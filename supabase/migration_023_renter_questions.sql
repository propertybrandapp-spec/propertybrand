-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 023: Customer Questions — Questions for Renters
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Same structure as migration_022 (Quick Questions for Buyers): identical
-- renter_* columns on both client_profiles (persistent, for Tenant-type
-- accounts) and leads (per-inquiry, covers guests and lets someone answer
-- differently for a specific property than what's on their standing
-- profile). See migration_022's header comment for the full reasoning.
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS).
-- ════════════════════════════════════════════════════════════════════════════

do $$
declare
  tbl text;
begin
  foreach tbl in array array['client_profiles', 'leads']
  loop
    execute format('alter table public.%I add column if not exists renter_move_in_date date', tbl);
    execute format('alter table public.%I add column if not exists renter_monthly_rent_budget numeric', tbl);
    execute format('alter table public.%I add column if not exists renter_upfront_budget numeric', tbl);  -- deposit + brokerage + other move-in costs
    execute format('alter table public.%I add column if not exists renter_profile_type text
      check (renter_profile_type in (''Family'', ''Bachelor'', ''Student'', ''Corporate''))', tbl);
    execute format('alter table public.%I add column if not exists renter_furnishing_requirement text
      check (renter_furnishing_requirement in (''Unfurnished'', ''Semi-furnished'', ''Fully furnished'', ''No Preference''))', tbl);
    execute format('alter table public.%I add column if not exists renter_lease_duration text
      check (renter_lease_duration in (''11 Months'', ''1 Year'', ''2 Years'', ''3+ Years'', ''Flexible''))', tbl);
    execute format('alter table public.%I add column if not exists renter_pet_requirement text
      check (renter_pet_requirement in (''Have Pets - Need Pet-Friendly'', ''No Pets'', ''Planning to Get a Pet''))', tbl);
    execute format('alter table public.%I add column if not exists renter_parking_requirement text
      check (renter_parking_requirement in (''Not Needed'', ''1 Two-Wheeler'', ''1 Car'', ''Multiple Vehicles'', ''EV Charging Needed''))', tbl);
    execute format('alter table public.%I add column if not exists renter_preferred_localities text[] not null default ''{}''', tbl);
    execute format('alter table public.%I add column if not exists renter_commute_destination text', tbl);  -- e.g. "Near XYZ Tech Park" — minimize commute to here
    execute format('alter table public.%I add column if not exists renter_wants_brokerage_free boolean not null default false', tbl);
    execute format('alter table public.%I add column if not exists renter_wants_managed_rental boolean not null default false', tbl);
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file: Tenant-type accounts get a "Renter Preferences"
-- section on their account page, the Contact/Enquiry form shows these
-- questions instead of the buyer ones when the property being asked about is
-- for Rent, and AdminLeads.jsx surfaces both sets side by side.
-- ════════════════════════════════════════════════════════════════════════════
