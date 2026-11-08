-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 032 — Multiple unit sizes, handover timeline, price trend,
--                 private owner contact number
-- Safe to run more than once. Run in the Supabase SQL editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- One project, several sizes: [{ "label": "3 BHK", "areaSqft": 1450, "price": 8500000 }, …]
alter table public.listings add column if not exists unit_configurations jsonb not null default '[]'::jsonb;

-- When the project is handed over (shown in the project description).
alter table public.listings add column if not exists handover_date     date;
alter table public.listings add column if not exists handover_timeline text;

-- Price per sq ft in the area over time: [{ "period": "2023", "pricePerSqft": 4200 }, …]
alter table public.listings add column if not exists price_trend jsonb not null default '[]'::jsonb;

-- The poster's phone number. Kept in its OWN table so it is never exposed by the
-- public listing API: only the person who posted it and admins can read it.
create table if not exists public.listing_contacts (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  phone      text not null,
  posted_by_user_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.listing_contacts enable row level security;

drop policy if exists "Poster can add contact for own listing" on public.listing_contacts;
create policy "Poster can add contact for own listing" on public.listing_contacts
  for insert to authenticated
  with check (exists (select 1 from public.listings l where l.id = listing_id and l.posted_by_user_id = auth.uid()));

drop policy if exists "Poster can read own contact" on public.listing_contacts;
create policy "Poster can read own contact" on public.listing_contacts
  for select to authenticated using (posted_by_user_id = auth.uid());

drop policy if exists "Poster can update own contact" on public.listing_contacts;
create policy "Poster can update own contact" on public.listing_contacts
  for update to authenticated
  using (posted_by_user_id = auth.uid()) with check (posted_by_user_id = auth.uid());

drop policy if exists "Admins manage listing contacts" on public.listing_contacts;
create policy "Admins manage listing contacts" on public.listing_contacts
  for all to authenticated
  using (auth.uid() in (select id from public.admin_profiles))
  with check (auth.uid() in (select id from public.admin_profiles));
