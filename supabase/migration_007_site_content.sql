-- ── Migration 007: Dynamic Site Content ──────────────────────────────────────
-- Makes four previously-hardcoded marketing sections editable from the admin
-- console instead of living as constants in the React source:
--   • Channel Partner tiers      (ChannelPartner.jsx)
--   • Client reviews/testimonials (Testimonials.jsx)
--   • Property Management subscription plans (PropertyManagement.jsx)
--   • Investment corridors / high-growth opportunities (InvestmentAdvisory.jsx)
--
-- Safe to run on an existing database — every statement is guarded so this
-- can be re-run without error.

-- ── 1. Channel Partner Tiers ─────────────────────────────────────────────────
create table if not exists public.partner_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier_color text not null default '#6B7280',
  border_color text not null default '#E2E8F0',
  deals_range text,
  commission text,
  perks jsonb not null default '[]',        -- array of strings
  cta_label text not null default 'Apply Now',
  is_popular boolean not null default false,
  is_active boolean not null default true,  -- admins can hide a tier without deleting it
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── 2. Client Reviews / Testimonials ─────────────────────────────────────────
create table if not exists public.client_reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  location text,
  avatar_initials text,
  avatar_gradient text not null default 'from-blue-500 to-blue-700', -- tailwind gradient classes
  rating integer not null default 5 check (rating between 1 and 5),
  category text,                            -- e.g. "Home Buyers", "NRIs", "Investors"
  review_text text not null,
  property_label text,
  review_date date not null default current_date,
  is_verified boolean not null default true,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── 3. Subscription / Property Management Plans ──────────────────────────────
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_label text not null,                -- e.g. "₹2,999" (display string, not a raw number)
  billing_period text not null default '/month',
  ideal_for text,
  plan_color text not null default '#6B7280',
  border_color text not null default '#E2E8F0',
  features jsonb not null default '[]',     -- array of {text, included}
  is_popular boolean not null default false,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── 4. Investment Opportunities / Corridors ──────────────────────────────────
create table if not exists public.investment_opportunities (
  id uuid primary key default gen_random_uuid(),
  city text not null default 'Bhubaneswar',
  area text not null,
  tag text,                                 -- e.g. "High Growth", "Rental Hotspot"
  tag_color text not null default 'bg-blue-100 text-[#1E88E5]',
  appreciation text,                        -- e.g. "+18%"
  rental_yield text,                        -- e.g. "4.2%"
  price_range text,
  property_type text,
  image_url text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Same shape for all four: anyone can read active rows (this is public
-- marketing content), only admins can create/edit/delete/hide.

alter table public.partner_tiers enable row level security;
alter table public.client_reviews enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.investment_opportunities enable row level security;

drop policy if exists "Public can view active partner tiers" on public.partner_tiers;
create policy "Public can view active partner tiers"
  on public.partner_tiers for select
  using (is_active = true);

drop policy if exists "Admins can manage all partner tiers" on public.partner_tiers;
create policy "Admins can manage all partner tiers"
  on public.partner_tiers for all
  using (auth.uid() in (select id from public.admin_profiles));

drop policy if exists "Public can view active client reviews" on public.client_reviews;
create policy "Public can view active client reviews"
  on public.client_reviews for select
  using (is_active = true);

drop policy if exists "Admins can manage all client reviews" on public.client_reviews;
create policy "Admins can manage all client reviews"
  on public.client_reviews for all
  using (auth.uid() in (select id from public.admin_profiles));

drop policy if exists "Public can view active subscription plans" on public.subscription_plans;
create policy "Public can view active subscription plans"
  on public.subscription_plans for select
  using (is_active = true);

drop policy if exists "Admins can manage all subscription plans" on public.subscription_plans;
create policy "Admins can manage all subscription plans"
  on public.subscription_plans for all
  using (auth.uid() in (select id from public.admin_profiles));

drop policy if exists "Public can view active investment opportunities" on public.investment_opportunities;
create policy "Public can view active investment opportunities"
  on public.investment_opportunities for select
  using (is_active = true);

drop policy if exists "Admins can manage all investment opportunities" on public.investment_opportunities;
create policy "Admins can manage all investment opportunities"
  on public.investment_opportunities for all
  using (auth.uid() in (select id from public.admin_profiles));

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists idx_partner_tiers_order on public.partner_tiers(display_order);
create index if not exists idx_client_reviews_order on public.client_reviews(display_order);
create index if not exists idx_subscription_plans_order on public.subscription_plans(display_order);
create index if not exists idx_investment_opportunities_order on public.investment_opportunities(display_order);
