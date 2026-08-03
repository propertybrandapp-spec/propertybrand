-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 015: Location & Connectivity
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Adds every field from spec section "2C. Location & Connectivity":
--   • Locality, landmark, city, pincode (the map pin itself — latitude/
--     longitude — already exists from migration_012)
--   • Address visibility setting (Exact / Approximate / Locality Only)
--   • Nearby landmarks with distance + travel time (flexible list — covers
--     both "nearest school/hospital/market/..." AND general "key
--     destinations", so admins aren't filling in two overlapping lists)
--   • Road width & approach road details
--   • Public transport availability
--   • Neighbourhood profile
--
-- NOTE on "Map layers for schools, hospitals, transit, daily needs and major
-- employment hubs": this app's map is Leaflet + OpenStreetMap (no Google
-- Places/Maps API key configured anywhere in the project), so there's no live
-- third-party feed of real-world POIs to draw as map pins. What's implemented
-- instead is admin-entered nearby-landmark data (below), shown on the
-- property page as a list grouped into those same 5 categories with toggle
-- filters — i.e. "layers" over the data you provide, not live pins sourced
-- from an external map API. Wiring up real POI pins would need a Google
-- Places (or similar) API key — happy to do that if you get one.
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Locality, landmark, city, pincode ──────────────────────────────────────
alter table public.listings add column if not exists locality text;
alter table public.listings add column if not exists landmark text;
alter table public.listings add column if not exists city text;
alter table public.listings add column if not exists pincode text;

-- ── 2. Address visibility ───────────────────────────────────────────────────
alter table public.listings add column if not exists address_visibility text
  not null default 'Exact Address'
  check (address_visibility in ('Exact Address', 'Approximate Location', 'Locality Only'));

-- ── 3. Nearby landmarks / key destinations ────────────────────────────────────
-- One flexible list instead of ~14 rigid columns. Each entry:
--   { "category": "School", "name": "DAV Public School", "distance": "1.2 km", "travelTime": "5 min drive" }
-- category is one of: School, Hospital, Market, Railway Station, Airport,
-- Metro/Bus Stop, Business Hub, Other — the same set the property page
-- groups into its 5 filter "layers" (Schools, Hospitals, Transit, Daily
-- Needs, Employment Hubs).
alter table public.listings add column if not exists nearby_landmarks jsonb not null default '[]';

-- ── 4. Road & transport ─────────────────────────────────────────────────────
alter table public.listings add column if not exists road_width text;              -- e.g. "40 ft wide"
alter table public.listings add column if not exists approach_road_details text;
alter table public.listings add column if not exists public_transport_notes text;  -- e.g. "Bus routes 12, 45; auto stand 100m"

-- ── 5. Neighbourhood profile ───────────────────────────────────────────────────
alter table public.listings add column if not exists neighbourhood_profile text
  check (neighbourhood_profile in ('Residential', 'Commercial', 'Mixed-Use', 'Emerging Growth Corridor'));

-- ════════════════════════════════════════════════════════════════════════════
-- Google Maps link + route options and the exact map pin (latitude/longitude)
-- already existed before this migration (migrations 010 and 012) — this file
-- only adds the descriptive/connectivity fields around them.
-- ════════════════════════════════════════════════════════════════════════════
