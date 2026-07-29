-- ── Migration 011: Dynamic Hero Section ───────────────────────────────────────
-- Makes the homepage Hero section (Hero.jsx) fully admin-editable instead of
-- hardcoded constants in the React source:
--   • hero_content  — SINGLE-ROW table: headline, subtext, search tabs, the
--     four "quick CTA" buttons, and the sidebar promo card (image/badge/
--     text/button). Same singleton shape as site_settings (migration 009) —
--     always exactly one row, edited in place.
--   • hero_cards    — the "We've got properties for everyone" card grid
--     below the search box. A repeatable list like partner_tiers /
--     client_reviews (migration 007) — admins can add, reorder, hide, or
--     delete cards. Each card is either an image card (image_url set) or a
--     solid-color promo card (background_color set instead).
--   • listing_field_options gets a new 'budget_range' field_type so the
--     Hero search bar's budget dropdown reuses the same admin-editable list
--     system as property types (migration 010) instead of its own hardcoded
--     array.
--
-- Both tables are seeded below with the exact content the Hero section
-- already shows, so nothing changes visually until you edit them from the
-- admin console (Site Content → Hero Content / Hero Cards). Safe to re-run.

-- ── 1. Hero Content (singleton — always exactly one row) ─────────────────────
create table if not exists public.hero_content (
  id uuid primary key default gen_random_uuid(),
  headline_prefix text not null default 'Start your',
  headline_highlight text not null default '',
  headline_suffix text not null default '',
  subtext text,
  search_tabs text[] not null default '{}',
  quick_ctas jsonb not null default '[]',   -- array of {label, linkType, linkValue}
  promo_badge text,
  promo_image text,
  promo_eyebrow text,
  promo_heading text,
  promo_cta_label text,
  promo_cta_link_type text not null default 'page' check (promo_cta_link_type in ('page', 'url')),
  promo_cta_link_value text,
  updated_at timestamptz not null default now()
);

alter table public.hero_content enable row level security;

drop policy if exists "Public can view hero content" on public.hero_content;
create policy "Public can view hero content"
  on public.hero_content for select
  using (true);

drop policy if exists "Admins can update hero content" on public.hero_content;
create policy "Admins can update hero content"
  on public.hero_content for update
  using (auth.uid() in (select id from public.admin_profiles));

-- No public/admin INSERT or DELETE policy on purpose — same reasoning as
-- site_settings: this table should only ever contain the single seeded row
-- below, edited in place.

insert into public.hero_content (
  headline_prefix, headline_highlight, headline_suffix, subtext, search_tabs, quick_ctas,
  promo_badge, promo_image, promo_eyebrow, promo_heading, promo_cta_label, promo_cta_link_type, promo_cta_link_value
)
select
  'Start your', '#DiscoverInvestGrow', 'Journey',
  'Discover. Invest. Build. Grow. Compare. Discuss. Decide.',
  array['Buy', 'Rent', 'New Projects', 'Plot', 'Commercial', 'Post Free Property Ad'],
  '[
    {"label": "Explore Properties", "linkType": "page", "linkValue": "search"},
    {"label": "Schedule Site Visit", "linkType": "page", "linkValue": "contact"},
    {"label": "Calculate EMI", "linkType": "page", "linkValue": "investment-advisory"},
    {"label": "Talk to an Expert", "linkType": "page", "linkValue": "contact"}
  ]'::jsonb,
  'Save 40%',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=200&fit=crop',
  'Get Home Interiors from',
  'Top Architects & Designers',
  'Check Offers',
  'page',
  'architects-design'
where not exists (select 1 from public.hero_content limit 1);

-- ── 2. Hero Cards (the property-type grid under the search box) ──────────────
create table if not exists public.hero_cards (
  id uuid primary key default gen_random_uuid(),
  image_url text,             -- set for a photo card
  background_color text,      -- set instead of image_url for a solid-color promo card
  title text not null,        -- big headline text, e.g. "12,400+" or "Discover Your Dream Property"
  subtitle text,               -- supporting line, e.g. "Verified Listings"
  cta_label text not null default 'Explore',
  link_type text not null default 'page' check (link_type in ('page', 'url')),
  link_value text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.hero_cards enable row level security;

drop policy if exists "Public can view active hero cards" on public.hero_cards;
create policy "Public can view active hero cards"
  on public.hero_cards for select
  using (is_active = true);

drop policy if exists "Admins can manage all hero cards" on public.hero_cards;
create policy "Admins can manage all hero cards"
  on public.hero_cards for all
  using (auth.uid() in (select id from public.admin_profiles));

create index if not exists idx_hero_cards_order on public.hero_cards(display_order);

insert into public.hero_cards (image_url, background_color, title, subtitle, cta_label, link_type, link_value, display_order)
select * from (values
  ('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=260&fit=crop', null, '12,400+', 'Verified Listings', 'Explore', 'page', 'search', 0),
  ('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=260&fit=crop', null, 'Projects', 'Featured Developers', 'Explore', 'page', 'search', 1),
  (null, '#1E88E5', 'Discover Your Dream Property', 'Exclusive access to premium listings & investment insights', 'Talk to an Expert', 'page', 'contact', 2),
  ('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop', null, '580+', 'Budget Homes', 'Explore', 'page', 'search', 3)
) as v(image_url, background_color, title, subtitle, cta_label, link_type, link_value, display_order)
where not exists (select 1 from public.hero_cards limit 1);

-- ── 3. Budget ranges join the same dynamic list as property types/BHK/etc ────
alter table public.listing_field_options drop constraint if exists listing_field_options_field_type_check;
alter table public.listing_field_options
  add constraint listing_field_options_field_type_check
  check (field_type in ('property_type', 'bhk', 'amenity', 'tag', 'budget_range'));

insert into public.listing_field_options (field_type, value, display_order)
select * from (values
  ('budget_range', 'Under ₹30 Lac', 0),
  ('budget_range', '₹30 - 50 Lac', 1),
  ('budget_range', '₹50 Lac - 1 Cr', 2),
  ('budget_range', '₹1 - 1.5 Cr', 3),
  ('budget_range', '₹1.5 - 2 Cr', 4),
  ('budget_range', 'Above ₹2 Cr', 5)
) as v(field_type, value, display_order)
where not exists (select 1 from public.listing_field_options where field_type = 'budget_range' limit 1);
