-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 030 — Duplex property type
-- Safe to run more than once. Run in the Supabase SQL editor.
-- Adds "Duplex" to the property-type dropdowns (Post Property, admin listing
-- form, search filters, homepage search).
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.listing_field_options (field_type, value, display_order)
select 'property_type', 'Duplex', 3
where not exists (
  select 1 from public.listing_field_options
  where field_type = 'property_type' and lower(value) = 'duplex'
);
  