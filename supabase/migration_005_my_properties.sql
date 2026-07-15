-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 005: "My Properties" (view + withdraw own listings)
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to run even if already applied — idempotent.
--
-- Without this, a user who posts a property via "Post Property" has no way to
-- see it afterwards — the public site only shows Live listings, and there was
-- previously no policy letting someone read their own Pending/Flagged/Rejected
-- submissions. This adds exactly that, plus the ability to withdraw a listing
-- that hasn't been published yet.
-- ════════════════════════════════════════════════════════════════════════════

do $$ begin
  create policy "Users can view their own listings"
    on public.listings for select
    using (posted_by_user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can withdraw their own pending listings"
    on public.listings for delete
    using (posted_by_user_id = auth.uid() and status = 'Pending');
exception when duplicate_object then null; end $$;
