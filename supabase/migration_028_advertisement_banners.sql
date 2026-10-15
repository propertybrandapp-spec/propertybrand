-- PropertyBrands — Migration 028: Advertisement Banners
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run

create table if not exists public.advertisement_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  badge text default 'Sponsored',
  image_url text not null,
  cta_label text default 'Explore Now',
  link_type text default 'page',
  link_value text default 'search',
  placement text default 'home', -- 'home', 'search', 'detail', 'all'
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: Public read, authenticated admin write
alter table public.advertisement_banners enable row level security;

create policy "Public can view active advertisement banners"
  on public.advertisement_banners for select
  using (is_active = true);

create policy "Admins can manage advertisement banners"
  on public.advertisement_banners for all
  using (true)
  with check (true);

-- Insert default starter banners
insert into public.advertisement_banners (title, subtitle, badge, image_url, cta_label, link_type, link_value, placement, display_order)
values
  ('Exclusive Launch: Luxury Golf Penthouses & Apartments', 'Direct booking discounts up to ₹5,00,000 + 0% processing fee on partner bank loans.', 'Featured Developer', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80', 'Explore Featured Deals', 'page', 'search', 'home', 1),
  ('Advertise Your Real Estate Project on PropertyBrands', 'Get featured in front of 50,000+ verified home buyers and serious investors every month.', 'Partner Spotlight', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80', 'Partner with Us', 'page', 'channel-partner', 'search', 2)
on conflict do nothing;
