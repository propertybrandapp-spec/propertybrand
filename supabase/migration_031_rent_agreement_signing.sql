-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 031 — RentReady review & sign links
-- Safe to run more than once. Run in the Supabase SQL editor.
--
-- RentReady now creates an agreement record with two secret links (one for the
-- landlord, one for the tenant). Each person opens their link, reviews the
-- agreement, confirms their Aadhaar and PAN and signs. Nobody can read the
-- table directly — the website talks to it only through the three functions
-- below, each of which needs the secret token from the link.
--
-- Privacy: the full Aadhaar number is never stored — only its last 4 digits.
-- PAN is stored for the record and is visible only to admins.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.rent_agreements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_data jsonb not null,
  owner_name text,
  tenant_name text,
  owner_email text,
  tenant_email text,
  owner_token uuid not null unique default gen_random_uuid(),
  tenant_token uuid not null unique default gen_random_uuid(),

  owner_signed_at timestamptz,
  owner_signature text,
  owner_aadhaar_last4 text,
  owner_pan text,
  owner_kyc_status text,
  owner_ip text,

  tenant_signed_at timestamptz,
  tenant_signature text,
  tenant_aadhaar_last4 text,
  tenant_pan text,
  tenant_kyc_status text,
  tenant_ip text,

  status text not null default 'pending'
    check (status in ('pending', 'partially_signed', 'fully_signed'))
);

alter table public.rent_agreements enable row level security;

drop policy if exists "Admins can view rent agreements" on public.rent_agreements;
create policy "Admins can view rent agreements"
  on public.rent_agreements for select
  using (auth.uid() in (select id from public.admin_profiles));

-- ── helpers ──────────────────────────────────────────────────────────────────
create or replace function public._agreement_view(a public.rent_agreements, p_role text)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'id', a.id,
    'role', p_role,
    'status', a.status,
    'form_data', a.form_data,
    'owner', jsonb_build_object('name', a.owner_name, 'signed_at', a.owner_signed_at, 'signature', a.owner_signature,
                                'aadhaar_last4', a.owner_aadhaar_last4, 'kyc_status', a.owner_kyc_status),
    'tenant', jsonb_build_object('name', a.tenant_name, 'signed_at', a.tenant_signed_at, 'signature', a.tenant_signature,
                                 'aadhaar_last4', a.tenant_aadhaar_last4, 'kyc_status', a.tenant_kyc_status)
  );
$$;

-- ── 1. create (called by RentReady when the draft is submitted) ──────────────
create or replace function public.create_rent_agreement(p_form jsonb, p_owner_email text, p_tenant_email text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  a public.rent_agreements;
begin
  if p_form is null or octet_length(p_form::text) > 60000 then
    raise exception 'Agreement data is missing or too large';
  end if;
  insert into public.rent_agreements (form_data, owner_name, tenant_name, owner_email, tenant_email)
  values (p_form, nullif(p_form->>'ownerName', ''), nullif(p_form->>'tenantName', ''),
          nullif(lower(trim(p_owner_email)), ''), nullif(lower(trim(p_tenant_email)), ''))
  returning * into a;
  return jsonb_build_object('id', a.id, 'owner_token', a.owner_token, 'tenant_token', a.tenant_token);
end $$;

-- ── 2. open a link ───────────────────────────────────────────────────────────
create or replace function public.get_rent_agreement(p_token uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  a public.rent_agreements;
begin
  select * into a from public.rent_agreements where owner_token = p_token or tenant_token = p_token;
  if not found then return null; end if;
  return public._agreement_view(a, case when a.owner_token = p_token then 'owner' else 'tenant' end);
end $$;

-- ── 3. confirm KYC details and sign ──────────────────────────────────────────
create or replace function public.sign_rent_agreement(
  p_token uuid, p_signature text, p_aadhaar text, p_pan text, p_consent boolean)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  a public.rent_agreements;
  v_role text;
  v_aadhaar text := regexp_replace(coalesce(p_aadhaar, ''), '\D', '', 'g');
  v_pan text := upper(trim(coalesce(p_pan, '')));
  v_expected_aadhaar text;
  v_expected_pan text;
  v_kyc text := 'submitted';
  v_ip text;
begin
  select * into a from public.rent_agreements where owner_token = p_token or tenant_token = p_token for update;
  if not found then raise exception 'This signing link is not valid.'; end if;
  v_role := case when a.owner_token = p_token then 'owner' else 'tenant' end;

  if (v_role = 'owner' and a.owner_signed_at is not null) or (v_role = 'tenant' and a.tenant_signed_at is not null) then
    raise exception 'You have already signed this agreement.';
  end if;
  if not coalesce(p_consent, false) then raise exception 'Please tick the confirmation box.'; end if;
  if length(trim(coalesce(p_signature, ''))) < 2 then raise exception 'Please type your full name as your signature.'; end if;
  if v_aadhaar !~ '^[2-9][0-9]{11}$' then raise exception 'Enter a valid 12-digit Aadhaar number.'; end if;
  if v_pan !~ '^[A-Z]{5}[0-9]{4}[A-Z]$' then raise exception 'Enter a valid PAN (like ABCDE1234F).'; end if;

  -- Compare with what the person who prepared the agreement typed, if anything.
  v_expected_aadhaar := regexp_replace(coalesce(a.form_data->>(v_role || 'Aadhaar'), ''), '\D', '', 'g');
  v_expected_pan := upper(trim(coalesce(a.form_data->>(v_role || 'Pan'), '')));
  if v_expected_aadhaar <> '' and right(v_expected_aadhaar, 4) <> right(v_aadhaar, 4) then v_kyc := 'mismatch'; end if;
  if v_expected_pan <> '' and v_expected_pan <> v_pan then v_kyc := 'mismatch'; end if;
  if v_kyc <> 'mismatch' and (v_expected_aadhaar <> '' or v_expected_pan <> '') then v_kyc := 'matched'; end if;

  begin
    v_ip := split_part(coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', ''), ',', 1);
  exception when others then v_ip := null; end;

  if v_role = 'owner' then
    update public.rent_agreements set owner_signed_at = now(), owner_signature = trim(p_signature),
      owner_aadhaar_last4 = right(v_aadhaar, 4), owner_pan = v_pan, owner_kyc_status = v_kyc, owner_ip = v_ip
      where id = a.id returning * into a;
  else
    update public.rent_agreements set tenant_signed_at = now(), tenant_signature = trim(p_signature),
      tenant_aadhaar_last4 = right(v_aadhaar, 4), tenant_pan = v_pan, tenant_kyc_status = v_kyc, tenant_ip = v_ip
      where id = a.id returning * into a;
  end if;

  update public.rent_agreements set status = case
      when owner_signed_at is not null and tenant_signed_at is not null then 'fully_signed'
      else 'partially_signed' end
    where id = a.id returning * into a;

  return public._agreement_view(a, v_role);
end $$;

revoke all on function public._agreement_view(public.rent_agreements, text) from public, anon, authenticated;
grant execute on function public.create_rent_agreement(jsonb, text, text) to anon, authenticated;
grant execute on function public.get_rent_agreement(uuid) to anon, authenticated;
grant execute on function public.sign_rent_agreement(uuid, text, text, text, boolean) to anon, authenticated;
