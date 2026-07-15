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

-- Only super_admins can revoke another admin's access
create policy "Super admins can remove admin profiles"
  on public.admin_profiles for delete
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
  image_url text,                       -- legacy single-image column; kept for back-compat, mirrors images[0]

  -- Rich detail fields (power the public Property Detail page + Admin listing form)
  transaction_type text not null default 'Buy' check (transaction_type in ('Buy', 'Rent')),
  possession text check (possession in ('Ready to Move', 'Under Construction')),
  bhk text,                             -- e.g. "3 BHK" — null for Plot/Commercial
  area_sqft integer,
  floor text,                           -- e.g. "8th of 12"
  facing text,                          -- e.g. "East"
  age text,                             -- e.g. "2 years", "New"
  description text,                     -- long-form copy for the detail page
  tags text[] default '{}',             -- Luxury, Affordable, Gated Community, Office, Retail, Industrial, Co-living, Student Accommodation
  amenities text[] default '{}',        -- Lift, Parking, Gym, Security, ...
  images text[] default '{}',           -- ordered array of R2 public URLs (gallery)
  featured boolean default false,
  verified boolean default false,
  badge text,                           -- e.g. "New Launch", "Luxury"
  badge_color text,                     -- hex color for the badge

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.listings enable row level security;

-- Public can view only Live listings (this powers your public SearchResults.jsx)
create policy "Public can view live listings"
  on public.listings for select
  using (status = 'Live');

-- Logged-in users can submit their own property, always as Pending — they
-- can never publish it themselves or post on someone else's behalf
create policy "Authenticated users can submit a property listing"
  on public.listings for insert
  with check (status = 'Pending' and posted_by_user_id = auth.uid());

-- Users can see and withdraw their own submissions regardless of moderation
-- status (this is what powers the "My Properties" page)
create policy "Users can view their own listings"
  on public.listings for select
  using (posted_by_user_id = auth.uid());

create policy "Users can withdraw their own pending listings"
  on public.listings for delete
  using (posted_by_user_id = auth.uid() and status = 'Pending');

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
  city text,
  experience text,
  rera_number text,
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

-- Anyone can submit a partner application (can only ever insert as Pending)
create policy "Anyone can submit a partner application"
  on public.agents for insert
  with check (status = 'Pending');


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
  tags text[] default '{}',
  read_time_minutes integer,
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
create index idx_listings_transaction_type on public.listings(transaction_type);
create index idx_listings_property_type on public.listings(property_type);
create index idx_leads_stage on public.leads(stage);
create index idx_agents_status on public.agents(status);
create index idx_blog_posts_status on public.blog_posts(status);

-- ════════════════════════════════════════════════════════════════════════════
-- CLIENT-FACING TABLES (regular site visitors — buyers, investors, NRIs, agents
-- signing up publicly. Separate from admin_profiles, which is internal staff.)
-- ════════════════════════════════════════════════════════════════════════════

-- ── 7. CLIENT PROFILES ────────────────────────────────────────────────────────
create table public.client_profiles (
  id uuid references auth.users(id) primary key,
  full_name text not null,
  phone text,
  city text,
  client_type text default 'Buyer' check (client_type in ('Buyer', 'Investor', 'NRI', 'Agent', 'Tenant', 'Landlord')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.client_profiles enable row level security;

-- Clients can only ever see/edit their own profile row — never anyone else's
create policy "Clients can view own profile"
  on public.client_profiles for select
  using (auth.uid() = id);

create policy "Clients can insert own profile"
  on public.client_profiles for insert
  with check (auth.uid() = id);

create policy "Clients can update own profile"
  on public.client_profiles for update
  using (auth.uid() = id);

-- Admins can view all client profiles (for support/CRM purposes)
create policy "Admins can view all client profiles"
  on public.client_profiles for select
  using (auth.uid() in (select id from public.admin_profiles));

-- Users can view their own inquiries (leads matching their email/phone) —
-- this powers the "My Inquiries" page. Placed here (not with the other leads
-- policies above) because it references client_profiles, which must already
-- exist for this policy to be created.
create policy "Users can view their own inquiries"
  on public.leads for select
  using (
    email = (auth.jwt() ->> 'email')
    or phone = (select phone from public.client_profiles where id = auth.uid())
  );


-- ── 8. SAVED PROPERTIES (wishlist / heart-icon favorites) ────────────────────
create table public.saved_properties (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.client_profiles(id) not null,
  listing_id uuid references public.listings(id) not null,
  created_at timestamptz default now(),
  unique (client_id, listing_id)
);

alter table public.saved_properties enable row level security;

create policy "Clients can view own saved properties"
  on public.saved_properties for select
  using (auth.uid() = client_id);

create policy "Clients can save properties"
  on public.saved_properties for insert
  with check (auth.uid() = client_id);

create policy "Clients can unsave properties"
  on public.saved_properties for delete
  using (auth.uid() = client_id);


-- ── Auto-create a client_profiles row whenever someone signs up ─────────────
-- This trigger fires on auth.users insert so client signup never needs a
-- second manual insert step from the frontend.
create function public.handle_new_client_user()
returns trigger as $$
begin
  insert into public.client_profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_client_user();

create index idx_saved_properties_client on public.saved_properties(client_id);


-- ── 9. SAVED POSTS (bookmark icon on blog/article cards) ─────────────────────
create table public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.client_profiles(id) not null,
  post_id uuid references public.blog_posts(id) not null,
  created_at timestamptz default now(),
  unique (client_id, post_id)
);

alter table public.saved_posts enable row level security;

create policy "Clients can view own saved posts"
  on public.saved_posts for select
  using (auth.uid() = client_id);

create policy "Clients can save posts"
  on public.saved_posts for insert
  with check (auth.uid() = client_id);

create policy "Clients can unsave posts"
  on public.saved_posts for delete
  using (auth.uid() = client_id);

create index idx_saved_posts_client on public.saved_posts(client_id);

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file:
-- 1. Go to Authentication → Users → Add User to create your first admin login
-- 2. Copy that user's UUID
-- 3. Run: insert into public.admin_profiles (id, full_name, role)
--         values ('paste-uuid-here', 'Your Name', 'super_admin');
--
-- Client signups (regular site visitors) need NO manual step — the trigger
-- above automatically creates their client_profiles row the moment they
-- sign up through the public AuthModal component.
-- ════════════════════════════════════════════════════════════════════════════
