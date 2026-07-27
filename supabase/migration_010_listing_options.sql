-- ── Migration 010: Multi-BHK, Google Maps, Videos, Dynamic Listing Options ───
-- Four related changes to how listings are created/edited:
--
--   1. `bhk` becomes an array (text[]) instead of a single value, so one
--      listing — e.g. a builder project — can offer "2 BHK, 3 BHK" etc.
--      Existing single values are carried over automatically.
--   2. `property_type` no longer has a fixed 4-value CHECK constraint —
--      property types are now validated against the new
--      `listing_field_options` table below instead, so admins can add more
--      without a schema change.
--   3. Two new columns: `google_maps_link` and `video_urls` (an array, same
--      shape as the existing `images` column).
--   4. A new `listing_field_options` table backs the dropdowns/chips in
--      both the public "Post Property" form and the admin listing form —
--      property types, BHK options, amenities, and tags are now all
--      admin-editable lists instead of hardcoded in the React source.

-- ── 1 & 2. Listings table changes ─────────────────────────────────────────────

-- Drop the fixed 4-value check — property types now come from
-- listing_field_options instead, so this would otherwise block adding more.
alter table public.listings drop constraint if exists listings_property_type_check;

-- Convert bhk from a single value to an array; existing values become a
-- single-element array, nulls become an empty array.
alter table public.listings alter column bhk drop default;
alter table public.listings
  alter column bhk type text[]
  using (case when bhk is null or bhk = '' then '{}'::text[] else array[bhk] end);

alter table public.listings add column if not exists google_maps_link text;
alter table public.listings add column if not exists video_urls text[] default '{}';

-- ── 3. Dynamic listing options (property types, BHK, amenities, tags) ────────
create table if not exists public.listing_field_options (
  id uuid primary key default gen_random_uuid(),
  field_type text not null check (field_type in ('property_type', 'bhk', 'amenity', 'tag')),
  value text not null,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (field_type, value)
);

alter table public.listing_field_options enable row level security;

drop policy if exists "Public can view active listing field options" on public.listing_field_options;
create policy "Public can view active listing field options"
  on public.listing_field_options for select
  using (is_active = true);

drop policy if exists "Admins can manage all listing field options" on public.listing_field_options;
create policy "Admins can manage all listing field options"
  on public.listing_field_options for all
  using (auth.uid() in (select id from public.admin_profiles));

create index if not exists idx_listing_field_options_type on public.listing_field_options(field_type, display_order);

-- Seed with an expanded set of options (only if this table is still empty).
insert into public.listing_field_options (field_type, value, display_order)
select * from (values
  -- Property types (previously a fixed 4-value list)
  ('property_type', 'Apartment', 0),
  ('property_type', 'Villa', 1),
  ('property_type', 'Independent House', 2),
  ('property_type', 'Plot', 3),
  ('property_type', 'Commercial', 4),
  ('property_type', 'Office Space', 5),
  ('property_type', 'Shop / Showroom', 6),
  ('property_type', 'Warehouse / Industrial Shed', 7),
  ('property_type', 'Farmhouse', 8),
  ('property_type', 'Penthouse', 9),
  ('property_type', 'Studio Apartment', 10),
  ('property_type', 'Agricultural Land', 11),

  -- BHK (now multi-select on a listing)
  ('bhk', '1 RK', 0),
  ('bhk', '1 BHK', 1),
  ('bhk', '2 BHK', 2),
  ('bhk', '3 BHK', 3),
  ('bhk', '4 BHK', 4),
  ('bhk', '5 BHK', 5),
  ('bhk', '5+ BHK', 6),

  -- Amenities (expanded well beyond the original 13)
  ('amenity', 'Lift', 0),
  ('amenity', 'Parking', 1),
  ('amenity', 'Visitor Parking', 2),
  ('amenity', 'Power Backup', 3),
  ('amenity', 'Security', 4),
  ('amenity', '24x7 Security', 5),
  ('amenity', 'CCTV', 6),
  ('amenity', 'Intercom', 7),
  ('amenity', 'Swimming Pool', 8),
  ('amenity', 'Gym', 9),
  ('amenity', 'Garden', 10),
  ('amenity', 'Club House', 11),
  ('amenity', 'Multipurpose Hall', 12),
  ('amenity', 'Indoor Games', 13),
  ('amenity', 'Kids Play Area', 14),
  ('amenity', 'Jogging Track', 15),
  ('amenity', 'Amphitheatre', 16),
  ('amenity', 'Yoga / Meditation Area', 17),
  ('amenity', 'Senior Citizen Sitout', 18),
  ('amenity', 'Cafeteria', 19),
  ('amenity', 'WiFi', 20),
  ('amenity', 'Housekeeping', 21),
  ('amenity', 'Fire Safety', 22),
  ('amenity', 'Rain Water Harvesting', 23),
  ('amenity', 'Sewage Treatment Plant', 24),
  ('amenity', 'Solar Water Heating', 25),
  ('amenity', 'EV Charging Point', 26),
  ('amenity', 'Water Softener Plant', 27),
  ('amenity', 'Vaastu Compliant', 28),
  ('amenity', 'Pet Friendly', 29),
  ('amenity', 'Gated Community', 30),

  -- Tags (expanded)
  ('tag', 'Luxury', 0),
  ('tag', 'Affordable', 1),
  ('tag', 'Gated Community', 2),
  ('tag', 'Office', 3),
  ('tag', 'Retail', 4),
  ('tag', 'Industrial', 5),
  ('tag', 'Co-living', 6),
  ('tag', 'Student Accommodation', 7),
  ('tag', 'New Launch', 8),
  ('tag', 'Ready to Move', 9),
  ('tag', 'RERA Approved', 10),
  ('tag', 'Corner Plot', 11),
  ('tag', 'Investment Opportunity', 12)
) as v(field_type, value, display_order)
where not exists (select 1 from public.listing_field_options limit 1);
