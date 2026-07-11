-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 003: Saved Posts, Blog Extras, Agent Application Fields
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to run even if already applied — every statement is idempotent.
-- ════════════════════════════════════════════════════════════════════════════

-- Extra blog_posts columns used by the Admin Blog editor + public article cards
alter table public.blog_posts add column if not exists tags text[] default '{}';
alter table public.blog_posts add column if not exists read_time_minutes integer;

-- Extra agents columns collected by the public "Become a Channel Partner" form
alter table public.agents add column if not exists city text;
alter table public.agents add column if not exists experience text;
alter table public.agents add column if not exists rera_number text;

-- Allow the public "Become a Channel Partner" form to submit applications
-- (they can only ever insert as Pending — never self-approve).
do $$ begin
  create policy "Anyone can submit a partner application"
    on public.agents for insert
    with check (status = 'Pending');
exception when duplicate_object then null; end $$;

-- Let a super_admin revoke another admin's access (Admin Console → Users)
do $$ begin
  create policy "Super admins can remove admin profiles"
    on public.admin_profiles for delete
    using (auth.uid() in (select id from public.admin_profiles where role = 'super_admin'));
exception when duplicate_object then null; end $$;

-- ── SAVED POSTS (bookmark icon on blog/article cards) ────────────────────────
-- Mirrors saved_properties exactly, just pointed at blog_posts instead.
create table if not exists public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.client_profiles(id) not null,
  post_id uuid references public.blog_posts(id) not null,
  created_at timestamptz default now(),
  unique (client_id, post_id)
);

alter table public.saved_posts enable row level security;

do $$ begin
  create policy "Clients can view own saved posts"
    on public.saved_posts for select
    using (auth.uid() = client_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Clients can save posts"
    on public.saved_posts for insert
    with check (auth.uid() = client_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Clients can unsave posts"
    on public.saved_posts for delete
    using (auth.uid() = client_id);
exception when duplicate_object then null; end $$;

create index if not exists idx_saved_posts_client on public.saved_posts(client_id);
