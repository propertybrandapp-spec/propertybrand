-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run
-- ════════════════════════════════════════════════════════════════════════════

-- ── Extension for UUID generation ─────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── 1. ADMIN PROFILES (extends Supabase's built-in auth.users) ───────────────
-- Every admin user gets a row here. Role gates what they can do in the UI.
create table public.admin_profiles (
  id uuid references auth.users(id) primary key,
  full_name text not null,
  role text not null default 'staff' check (role in ('super_admin', 'admin', 'staff')),
  avatar_initials text default 'A',
  created_at timestamptz default now()
);

alter table public.admin_profiles enable row level security;

-- Only logged-in admins can read the admin profiles table
create policy "Admins can view all admin profiles"
  on public.admin_profiles for select
  using (auth.uid() in (select id from public.admin_profiles));

-- Only super_admins can edit other admins' roles
create policy "Super admins can update admin profiles"
  on public.admin_profiles for update
  using (
    auth.uid() in (select id from public.admin_profiles where role = 'super_admin')
  );


-- ── 2. PROPERTY LISTINGS ──────────────────────────────────────────────────────
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  property_type text not null check (property_type in ('Apartment', 'Villa', 'Plot', 'Commercial')),
  price_label text not null,           -- e.g. "₹2.40 Cr" (display string)
  price_value bigint,                  -- raw numeric value in INR for sorting/filtering
  status text not null default 'Pending' check (status in ('Live', 'Pending', 'Flagged', 'Rejected')),
  posted_by text not null check (posted_by in ('Owner', 'Builder', 'Agent')),
  posted_by_user_id uuid references auth.users(id),
  views integer default 0,
  image_emoji text default '🏠',       -- placeholder until real image upload is added
  image_url text,                       -- for when you wire up Supabase Storage
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.listings enable row level security;

-- Public can view only Live listings (this powers your public SearchResults.jsx)
create policy "Public can view live listings"
  on public.listings for select
  using (status = 'Live');

-- Admins can view, insert, update, delete everything
create policy "Admins can manage all listings"
  on public.listings for all
  using (auth.uid() in (select id from public.admin_profiles));


-- ── 3. LEADS / INQUIRIES ──────────────────────────────────────────────────────
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  interest text,                        -- what property/service they're interested in
  budget_label text,                    -- e.g. "₹2 - 2.5 Cr"
  stage text not null default 'New' check (stage in ('New', 'Contacted', 'Site Visit', 'Negotiation', 'Closed Won', 'Closed Lost')),
  source text default 'Website' check (source in ('Website', 'Referral', 'WhatsApp', 'Cold Call', 'Walk-in')),
  assigned_to uuid references auth.users(id),
  listing_id uuid references public.listings(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Anyone (even logged-out site visitors) can INSERT a lead — this powers
-- your QuickInquiry form in Footer.jsx and any "Contact Agent" button
create policy "Anyone can submit a lead"
  on public.leads for insert
  with check (true);

-- Only admins can view/update/delete leads
create policy "Admins can manage all leads"
  on public.leads for select using (auth.uid() in (select id from public.admin_profiles));
create policy "Admins can update leads"
  on public.leads for update using (auth.uid() in (select id from public.admin_profiles));
create policy "Admins can delete leads"
  on public.leads for delete using (auth.uid() in (select id from public.admin_profiles));


-- ── 4. AGENTS / CHANNEL PARTNERS ──────────────────────────────────────────────
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),  -- nullable until they create a login
  name text not null,
  agency text,
  phone text not null,
  email text not null,
  tier text not null default 'Associate' check (tier in ('Associate', 'Silver', 'Gold')),
  status text not null default 'Pending' check (status in ('Verified', 'Pending', 'Suspended')),
  deals_closed integer default 0,
  member_since text,
  rating numeric(2,1) default 0,
  created_at timestamptz default now()
);

alter table public.agents enable row level security;

-- Public can view only Verified agents (powers PreferredAgents.jsx)
create policy "Public can view verified agents"
  on public.agents for select
  using (status = 'Verified');

-- Admins manage everything
create policy "Admins can manage all agents"
  on public.agents for all
  using (auth.uid() in (select id from public.admin_profiles));


-- ── 5. BLOG POSTS ─────────────────────────────────────────────────────────────
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null check (category in ('Buying Guide', 'Investment Insights', 'Project Reviews', 'Home & Lifestyle', 'Market Reports')),
  excerpt text,
  content text,                         -- full article body (markdown or HTML)
  author_name text not null,
  cover_image_url text,
  status text not null default 'Draft' check (status in ('Draft', 'Published', 'Archived')),
  views integer default 0,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.blog_posts enable row level security;

-- Public can view only Published posts (powers BlogInsights.jsx)
create policy "Public can view published posts"
  on public.blog_posts for select
  using (status = 'Published');

-- Admins manage everything
create policy "Admins can manage all blog posts"
  on public.blog_posts for all
  using (auth.uid() in (select id from public.admin_profiles));


-- ── 6. ADMIN USERS / ROLES (separate from agents — internal staff accounts) ──
-- Note: admin_profiles (table #1) already covers role gating for the people
-- who log into /admin. This table is only needed if you want a richer
-- "Users & Roles" management screen showing invite status, last login, etc.
alter table public.admin_profiles add column if not exists last_login timestamptz;
alter table public.admin_profiles add column if not exists invited_by uuid references auth.users(id);
alter table public.admin_profiles add column if not exists is_active boolean default true;


-- ── Helpful indexes for dashboard performance ─────────────────────────────────
create index idx_listings_status on public.listings(status);
create index idx_leads_stage on public.leads(stage);
create index idx_agents_status on public.agents(status);
create index idx_blog_posts_status on public.blog_posts(status);

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file:
-- 1. Go to Authentication → Users → Add User to create your first admin login
-- 2. Copy that user's UUID
-- 3. Run: insert into public.admin_profiles (id, full_name, role)
--         values ('paste-uuid-here', 'Your Name', 'super_admin');
-- ════════════════════════════════════════════════════════════════════════════
