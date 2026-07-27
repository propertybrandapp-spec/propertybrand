-- ── Migration 009: Site Settings & Office Locations ──────────────────────────
-- Adds two more admin-editable content types:
--   • site_settings — a SINGLE-ROW table for contact info + social media
--     links shown in the Footer and Contact Us page. This is what makes the
--     Footer's social icons (Facebook/Instagram/LinkedIn/YouTube) — which
--     previously all pointed at "#" — into real, editable links.
--   • office_locations — the list of city offices shown on the Contact Us
--     page (previously a hardcoded array).
-- Both are seeded with the same values the site already shows, so nothing
-- changes visually until you edit them from the admin console.

-- ── Site Settings (singleton — always exactly one row) ───────────────────────
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  phone text,
  whatsapp text,
  email text,
  website_url text,
  corporate_address text,
  business_hours text,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  youtube_url text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
  on public.site_settings for update
  using (auth.uid() in (select id from public.admin_profiles));

-- No public/admin INSERT or DELETE policy on purpose — this table should only
-- ever contain the single seeded row below, edited in place.

insert into public.site_settings (phone, whatsapp, email, website_url, corporate_address, business_hours, facebook_url, instagram_url, linkedin_url, youtube_url)
select '+91 94301 00000', '+91 98765 00000', 'info@propertybrands.in', 'www.propertybrands.in',
       'PropertyBrands Realty Services, Bhubaneswar, Odisha — 751001',
       'Mon – Sat, 9:00 AM – 7:00 PM',
       '#', '#', '#', '#'
where not exists (select 1 from public.site_settings limit 1);

-- ── Office Locations ──────────────────────────────────────────────────────────
create table if not exists public.office_locations (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  address text not null,
  phone text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.office_locations enable row level security;

drop policy if exists "Public can view active office locations" on public.office_locations;
create policy "Public can view active office locations"
  on public.office_locations for select
  using (is_active = true);

drop policy if exists "Admins can manage all office locations" on public.office_locations;
create policy "Admins can manage all office locations"
  on public.office_locations for all
  using (auth.uid() in (select id from public.admin_profiles));

insert into public.office_locations (city, address, phone, display_order)
select * from (values
  ('Bhubaneswar', 'Main Road, Bhubaneswar, Odisha 751001', '+91 94301 00000', 0),
  ('Delhi', 'Connaught Place, New Delhi 110001', '+91 98765 00001', 1),
  ('Bangalore', 'MG Road, Bangalore, Karnataka 560001', '+91 98765 00002', 2)
) as v(city, address, phone, display_order)
where not exists (select 1 from public.office_locations limit 1);

create index if not exists idx_office_locations_order on public.office_locations(display_order);
