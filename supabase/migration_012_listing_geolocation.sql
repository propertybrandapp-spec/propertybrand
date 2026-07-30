-- ── Migration 012: Property Map Location (lat/lng) ────────────────────────────
-- Adds real geographic coordinates to listings so the property detail page
-- can show an actual interactive map with a pin — not just an outbound
-- "Google Maps" link. `google_maps_link` (added in migration_010) is kept
-- for backward compatibility: if an admin/owner also pastes a specific
-- share link, it's used as an override for the "Get Directions" button;
-- otherwise directions are generated straight from lat/lng.
--
-- Both columns are nullable — existing listings (and any new one where
-- nobody bothers to drop a pin) simply show no embedded map, same as today.

alter table public.listings add column if not exists latitude double precision;
alter table public.listings add column if not exists longitude double precision;

comment on column public.listings.latitude is 'Set via the interactive location picker in Post Property / Admin — powers the embedded map on the property detail page.';
comment on column public.listings.longitude is 'Set via the interactive location picker in Post Property / Admin — powers the embedded map on the property detail page.';

create index if not exists idx_listings_geo on public.listings(latitude, longitude) where latitude is not null and longitude is not null;
