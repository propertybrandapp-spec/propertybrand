-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 029 — Plot / land listing details
-- Safe to run more than once. Run in the Supabase SQL editor.
--
-- Plots and agricultural land are described by size, road access and approvals
-- rather than BHK / floors. `plot_area_sqft` already exists (migration_013);
-- this adds the remaining plot-specific facts.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.listings add column if not exists plot_length_ft  numeric;
alter table public.listings add column if not exists plot_width_ft   numeric;
alter table public.listings add column if not exists road_width_ft   numeric;
alter table public.listings add column if not exists corner_plot     boolean not null default false;
alter table public.listings add column if not exists boundary_wall   boolean not null default false;
alter table public.listings add column if not exists land_use        text;
alter table public.listings add column if not exists plot_approval   text;

-- Make sure every property type the forms offer is accepted. Migration_010
-- dropped the old 4-value CHECK; this drops it again in case an older database
-- never ran that migration (that old check rejected "Agricultural Land",
-- "Farmhouse", "Office Space", … as well as everything added later).
alter table public.listings drop constraint if exists listings_property_type_check;

-- Make the plot types available in the type dropdowns if they were removed.
insert into public.listing_field_options (field_type, value, display_order)
select 'property_type', v.value, v.ord
from (values ('Plot', 3), ('Agricultural Land', 11)) as v(value, ord)
where not exists (
  select 1 from public.listing_field_options o
  where o.field_type = 'property_type' and o.value = v.value
);
