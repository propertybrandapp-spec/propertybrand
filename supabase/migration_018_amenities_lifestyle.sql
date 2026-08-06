-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 018: Amenities & Lifestyle
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Adds every field from spec section "2F. Amenities & Lifestyle". The
-- existing `amenities` text[] column (simple checklist, powers search
-- filtering + property cards) is left completely untouched — breaking that
-- would break search. Instead:
--   • amenity_details (new) layers optional status/condition onto whichever
--     amenities are already checked, without changing what `amenities` is.
--   • unit_features (new) is a SEPARATE checklist for unit-specific things
--     (modular kitchen, false ceiling, ...) — distinct from the shared
--     project-level `amenities` checklist, per the spec's explicit ask.
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS / ON CONFLICT).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Project amenities: availability & condition ────────────────────────────
-- [{ "name": "Swimming Pool", "status": "Available", "condition": "Good" }, ...]
-- `name` should match an entry already in `amenities`, but isn't DB-enforced
-- (same soft-validation approach as everywhere else in this schema).
alter table public.listings add column if not exists amenity_details jsonb not null default '[]';

-- ── 2. Unit-level features (separate from common/project amenities) ──────────
alter table public.listings add column if not exists unit_features text[] not null default '{}';

-- ── 3. Parking & EV charging ───────────────────────────────────────────────────
alter table public.listings add column if not exists parking_type text
  check (parking_type in ('Open', 'Covered', 'Basement', 'Multi-level Mechanical', 'Stilt', 'None'));
alter table public.listings add column if not exists parking_slots integer;
alter table public.listings add column if not exists ev_charging_status text
  check (ev_charging_status in ('Available', 'Not Available', 'Planned'));

-- ── 4. Power backup ─────────────────────────────────────────────────────────
alter table public.listings add column if not exists power_backup_type text
  check (power_backup_type in ('None', 'Common Areas Only', 'Partial Apartment Backup', 'Full Apartment Backup'));

-- ── 5. Security ──────────────────────────────────────────────────────────────
-- Checklist of: Security Guards, CCTV Surveillance, Access Control, Video
-- Door Phone — deliberately separate from the generic "Security"/"CCTV"
-- amenity chips, since the spec wants each tracked individually.
alter table public.listings add column if not exists security_features text[] not null default '{}';

-- ── 6. Water & sewage ──────────────────────────────────────────────────────────
alter table public.listings add column if not exists water_source text
  check (water_source in ('Municipal Supply', 'Borewell', 'Both', 'Tanker Supply', 'Not Specified'));
-- Checklist of: Water Treatment Plant, Sewage Treatment Plant (STP), Rainwater Harvesting
alter table public.listings add column if not exists water_sewage_features text[] not null default '{}';

-- ── 7. Connectivity ──────────────────────────────────────────────────────────
alter table public.listings add column if not exists internet_readiness text
  check (internet_readiness in ('Fibre Ready', 'Broadband Ready', 'Not Ready', 'Not Specified'));
alter table public.listings add column if not exists mobile_network_quality text
  check (mobile_network_quality in ('Excellent', 'Good', 'Average', 'Poor', 'Not Specified'));

-- ── 8. Pet policy ────────────────────────────────────────────────────────────
alter table public.listings add column if not exists pet_policy text
  check (pet_policy in ('Pets Allowed', 'Not Allowed', 'Restrictions Apply', 'Not Specified'));
alter table public.listings add column if not exists pet_policy_notes text;

-- ── 9. Senior-citizen-friendly & accessibility features ────────────────────────
alter table public.listings add column if not exists senior_citizen_features text[] not null default '{}';
alter table public.listings add column if not exists accessibility_features text[] not null default '{}';

-- ── 10. A few missing amenity presets (children's/sports/fitness/community/WFH) ──
-- The existing `amenities` checklist already covers most of this (Kids Play
-- Area, Gym, Indoor Games, Club House, Multipurpose Hall...) — just filling
-- the remaining gaps rather than building a separate taxonomy for it.
insert into public.listing_field_options (field_type, value, display_order)
select * from (values
  ('amenity', 'Co-working / WFH Space', 40),
  ('amenity', 'Sports Court', 41),
  ('amenity', 'Skating Rink', 42),
  ('amenity', 'Cricket Practice Net', 43),
  ('amenity', 'Banquet Hall', 44)
) as v(field_type, value, display_order)
on conflict (field_type, value) do nothing;

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, both listing forms show a full "Amenities &
-- Lifestyle" section, and the property detail page surfaces all of it.
-- ════════════════════════════════════════════════════════════════════════════
