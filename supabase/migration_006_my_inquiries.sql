-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 006: "My Inquiries" visibility fix
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to run even if already applied — idempotent.
--
-- Bug this fixes: the "My Inquiries" page (Navbar → account menu) queries
-- public.leads matching the logged-in client's email/phone, but the only
-- existing SELECT policy on leads restricted reads to admins. A regular
-- client always got an empty result — this adds the missing policy.
-- ════════════════════════════════════════════════════════════════════════════

do $$ begin
  create policy "Users can view their own inquiries"
    on public.leads for select
    using (
      email = (auth.jwt() ->> 'email')
      or phone = (select phone from public.client_profiles where id = auth.uid())
    );
exception when duplicate_object then null; end $$;
