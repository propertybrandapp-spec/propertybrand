-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 013: Property Identity & Basic Details
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Adds every field from spec section "2A. Property Identity & Basic Details"
-- that didn't already exist on `listings`:
--   • Auto-generated human-readable Listing ID (listing_code)
--   • Project name / tower / block / unit number (+ public visibility toggle)
--   • Listing type (Sale / Rent / Lease / Resale / New Launch / Under Construction)
--   • Bathrooms, balconies, servant room
--   • Built-up / super built-up / carpet / plot area (previously one generic area_sqft)
--   • Floor number, total floors, total units in project
--   • Entrance direction, Vastu status
--   • Furnishing, property condition
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS / ON CONFLICT).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Unique Property ID / Listing ID ────────────────────────────────────────
-- A short, human-readable code (e.g. "PB000042") distinct from the internal
-- uuid `id`. Auto-assigned on insert — nobody types this in.
alter table public.listings add column if not exists listing_code text unique;

create sequence if not exists public.listing_code_seq start 1;

create or replace function public.set_listing_code()
returns trigger as $$
begin
  if new.listing_code is null then
    new.listing_code := 'PB' || lpad(nextval('public.listing_code_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_listing_code on public.listings;
create trigger trg_set_listing_code
  before insert on public.listings
  for each row execute procedure public.set_listing_code();

-- Backfill any existing rows that predate this migration, oldest first, then
-- fast-forward the sequence so new codes never collide with backfilled ones.
with numbered as (
  select id, row_number() over (order by created_at) as rn
  from public.listings
  where listing_code is null
)
update public.listings l
set listing_code = 'PB' || lpad(numbered.rn::text, 6, '0')
from numbered
where l.id = numbered.id;

select setval('public.listing_code_seq', greatest((select count(*) from public.listings where listing_code is not null), 1));

-- ── 2. Project name / tower / block / unit number ─────────────────────────────
-- `tower_block` also covers "tower number" from the Floor section below —
-- one field, so admins aren't asked to enter the same thing twice.
alter table public.listings add column if not exists project_name text;
alter table public.listings add column if not exists tower_block text;
alter table public.listings add column if not exists unit_number text;
alter table public.listings add column if not exists unit_number_public boolean not null default true;

-- ── 3. Listing type ─────────────────────────────────────────────────────────
-- NOTE: this is intentionally separate from the existing `transaction_type`
-- (Buy/Rent, drives the site's Buy/Rent nav filter) and `possession`
-- (Ready to Move/Under Construction, drives the possession filter). Those two
-- keep working exactly as before. `listing_type` is the new, richer
-- classification requested in the spec and is stored independently.
alter table public.listings add column if not exists listing_type text
  check (listing_type in ('Sale', 'Rent', 'Lease', 'Resale', 'New Launch', 'Under Construction'));

-- ── 4. Room configuration ─────────────────────────────────────────────────────
alter table public.listings add column if not exists bathrooms integer;
alter table public.listings add column if not exists balconies integer;
alter table public.listings add column if not exists servant_room boolean not null default false;

-- ── 5. Area breakdown ──────────────────────────────────────────────────────
-- Replaces the single generic `area_sqft` as the primary data-entry fields.
-- `area_sqft` itself is kept (it powers existing cards/sorting/search) and is
-- now auto-derived by the app from whichever of these is filled in first.
alter table public.listings add column if not exists built_up_area_sqft integer;
alter table public.listings add column if not exists super_built_up_area_sqft integer;
alter table public.listings add column if not exists carpet_area_sqft integer;
alter table public.listings add column if not exists plot_area_sqft integer;

-- ── 6. Floor / tower structure ────────────────────────────────────────────────
-- Legacy `floor` (free text, e.g. "8th of 12") is kept and now auto-generated
-- from floor_number + total_floors by the app, for back-compat with existing
-- display code.
alter table public.listings add column if not exists floor_number integer;
alter table public.listings add column if not exists total_floors integer;
alter table public.listings add column if not exists total_units integer;

-- ── 7. Direction & Vastu ──────────────────────────────────────────────────────
alter table public.listings add column if not exists entrance_direction text;
alter table public.listings add column if not exists vastu_status text
  check (vastu_status in ('Vastu Compliant', 'Not Vastu Compliant', 'Not Specified'));

-- ── 8. Furnishing & condition ──────────────────────────────────────────────────
alter table public.listings add column if not exists furnishing text
  check (furnishing in ('Unfurnished', 'Semi-furnished', 'Fully furnished'));

-- Named property_condition (not `condition`) to avoid any ambiguity with the
-- reserved CONDITION keyword used in PL/pgSQL exception blocks.
alter table public.listings add column if not exists property_condition text
  check (property_condition in ('New', 'Renovated', 'Well maintained', 'Needs renovation'));

-- ── 9. New property types requested by the spec ──────────────────────────────
-- property_type values are validated against listing_field_options (see
-- migration_010), not a DB check constraint, so new types are just new rows.
-- Existing similarly-named types (Office Space, Shop / Showroom, Warehouse /
-- Industrial Shed) are left in place — deactivate any you don't want from
-- Admin → Site Content → Listing Options.
insert into public.listing_field_options (field_type, value, display_order)
select * from (values
  ('property_type', 'Office', 20),
  ('property_type', 'Retail', 21),
  ('property_type', 'Industrial', 22),
  ('property_type', 'Co-living', 23),
  ('property_type', 'Student Accommodation', 24)
) as v(field_type, value, display_order)
on conflict (field_type, value) do nothing;

-- ── Helpful indexes ────────────────────────────────────────────────────────────
create index if not exists idx_listings_listing_type on public.listings(listing_type);

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, both the Admin "Add/Edit Listing" form and the
-- public "Post Property" form will show the new fields automatically.
-- Existing listings simply have empty values for the new columns until
-- someone edits and saves them.
-- ════════════════════════════════════════════════════════════════════════════
