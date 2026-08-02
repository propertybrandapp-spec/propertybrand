-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 014: Price & Financial Transparency
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Adds every field from spec section "2B. Price & Financial Transparency":
--   • Negotiable flag, all-inclusive vs base price
--   • Price per sqft (auto-computed — never entered manually)
--   • Detailed cost breakup (floor-rise, parking, clubhouse, PLC, GST, etc.)
--   • Maintenance amount + frequency
--   • Security deposit, brokerage, lease terms (rentals)
--   • EMI assumptions (interest rate / tenure / down-payment %)
--   • Loan eligibility / approved banks
--   • Price history (new table, auto-logged by trigger — nothing to fill in)
--   • Investment indicators: estimated rent, rental yield (auto-computed),
--     appreciation potential, holding period
--   • "Comparable price range in the same locality" is NOT a stored column —
--     it's computed on the fly from other listings sharing the same
--     `location` text, same as the existing search/filter behavior.
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS / OR REPLACE).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Negotiability & price type ─────────────────────────────────────────────
alter table public.listings add column if not exists price_negotiable boolean not null default false;
alter table public.listings add column if not exists price_type text
  check (price_type in ('All-Inclusive', 'Base Price'));

-- ── 2. Price per sq ft ─────────────────────────────────────────────────────
-- Generated column — always in sync with price_value/area_sqft, nothing to
-- enter or keep updated by hand.
alter table public.listings add column if not exists price_per_sqft numeric
  generated always as (
    case when area_sqft is not null and area_sqft > 0 and price_value is not null
      then round(price_value::numeric / area_sqft, 2)
      else null end
  ) stored;

-- ── 3. Detailed cost breakup ───────────────────────────────────────────────────
alter table public.listings add column if not exists cost_base numeric;
alter table public.listings add column if not exists cost_floor_rise numeric;
alter table public.listings add column if not exists cost_parking numeric;
alter table public.listings add column if not exists cost_clubhouse numeric;
alter table public.listings add column if not exists cost_plc numeric;              -- Preferential Location Charge
alter table public.listings add column if not exists cost_gst numeric;
alter table public.listings add column if not exists cost_registration numeric;
alter table public.listings add column if not exists cost_maintenance_deposit numeric;
alter table public.listings add column if not exists cost_other numeric;
alter table public.listings add column if not exists cost_other_label text;         -- what "other" covers

-- ── 4. Maintenance ─────────────────────────────────────────────────────────
alter table public.listings add column if not exists maintenance_amount numeric;
alter table public.listings add column if not exists maintenance_frequency text
  check (maintenance_frequency in ('Monthly', 'Quarterly', 'Half-Yearly', 'Annually'));

-- ── 5. Security deposit, brokerage, lease terms (rentals) ─────────────────────
alter table public.listings add column if not exists security_deposit numeric;
alter table public.listings add column if not exists brokerage_type text
  check (brokerage_type in ('None', 'One Month Rent', 'Fixed Amount', 'Percentage of Rent'));
alter table public.listings add column if not exists brokerage_amount numeric;      -- used when Fixed Amount / Percentage
alter table public.listings add column if not exists lock_in_period text;           -- e.g. "11 months"
alter table public.listings add column if not exists notice_period text;            -- e.g. "1 month"
alter table public.listings add column if not exists lease_terms text;              -- free-form, e.g. escalation clause

-- ── 6. EMI assumptions ─────────────────────────────────────────────────────────
-- Drives the EMI estimate already shown on the property detail page — now
-- per-listing instead of one hardcoded assumption for every property.
alter table public.listings add column if not exists emi_interest_rate numeric not null default 8.5;   -- % p.a.
alter table public.listings add column if not exists emi_tenure_years integer not null default 20;
alter table public.listings add column if not exists emi_down_payment_percent numeric not null default 20;

-- ── 7. Loan eligibility / bank approval ───────────────────────────────────────
alter table public.listings add column if not exists approved_banks text[] default '{}';
alter table public.listings add column if not exists loan_eligibility_notes text;

-- ── 8. Investment indicators ───────────────────────────────────────────────────
alter table public.listings add column if not exists estimated_monthly_rent numeric;
alter table public.listings add column if not exists appreciation_potential text
  check (appreciation_potential in ('Low', 'Moderate', 'High', 'Very High'));
alter table public.listings add column if not exists recommended_holding_period text;  -- e.g. "5-7 years"

-- Rental yield (%) — generated from estimated_monthly_rent vs price_value.
-- Only meaningful when both are set (typically Buy/Resale/New Launch listings
-- with an admin-entered rent estimate).
alter table public.listings add column if not exists rental_yield_percent numeric
  generated always as (
    case when price_value is not null and price_value > 0 and estimated_monthly_rent is not null
      then round((estimated_monthly_rent * 12.0 / price_value) * 100, 2)
      else null end
  ) stored;

-- ── 9. Price history ───────────────────────────────────────────────────────────
create table if not exists public.listing_price_history (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  price_value bigint,
  price_label text,
  changed_at timestamptz not null default now()
);

create index if not exists idx_listing_price_history_listing_id on public.listing_price_history(listing_id, changed_at desc);

alter table public.listing_price_history enable row level security;

drop policy if exists "Public can view price history of live listings" on public.listing_price_history;
create policy "Public can view price history of live listings"
  on public.listing_price_history for select
  using (listing_id in (select id from public.listings where status = 'Live'));

drop policy if exists "Users can view price history of their own listings" on public.listing_price_history;
create policy "Users can view price history of their own listings"
  on public.listing_price_history for select
  using (listing_id in (select id from public.listings where posted_by_user_id = auth.uid()));

drop policy if exists "Admins can manage all price history" on public.listing_price_history;
create policy "Admins can manage all price history"
  on public.listing_price_history for all
  using (auth.uid() in (select id from public.admin_profiles));

-- security definer so the log always succeeds regardless of which role
-- (public submitter, admin, etc.) is inserting/updating the listing itself —
-- this is an internal audit log, not something callers write to directly.
create or replace function public.log_listing_price_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT') or (new.price_value is distinct from old.price_value) then
    insert into public.listing_price_history (listing_id, price_value, price_label, changed_at)
    values (new.id, new.price_value, new.price_label, now());
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_log_price_on_insert on public.listings;
create trigger trg_log_price_on_insert
  after insert on public.listings
  for each row execute procedure public.log_listing_price_change();

drop trigger if exists trg_log_price_on_update on public.listings;
create trigger trg_log_price_on_update
  after update on public.listings
  for each row execute procedure public.log_listing_price_change();

-- Seed one history row per existing listing so charts/timelines aren't empty.
insert into public.listing_price_history (listing_id, price_value, price_label, changed_at)
select id, price_value, price_label, created_at
from public.listings l
where not exists (select 1 from public.listing_price_history h where h.listing_id = l.id);

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, both listing forms show the new Price & Financial
-- Transparency section, and the property detail page shows price-per-sqft,
-- cost breakup, EMI assumptions, price history, comparable pricing, and
-- investment indicators wherever data is available.
-- ════════════════════════════════════════════════════════════════════════════
