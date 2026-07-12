-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 004: Public "Post Property" Submissions
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to run even if already applied — idempotent.
--
-- Without this, the public "Post Property" form (Navbar → Post Property) has
-- no way to write into public.listings — previously only admins could insert.
-- This lets a logged-in user submit their own property, but ONLY as Pending
-- (never Live) and ONLY tagged to their own account — they still can't
-- publish it themselves or post on someone else's behalf.
-- ════════════════════════════════════════════════════════════════════════════

do $$ begin
  create policy "Authenticated users can submit a property listing"
    on public.listings for insert
    with check (status = 'Pending' and posted_by_user_id = auth.uid());
exception when duplicate_object then null; end $$;
