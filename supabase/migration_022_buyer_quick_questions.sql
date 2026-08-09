-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 022: Customer Questions — Quick Questions for Buyers
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- This is a different kind of section from 2A–2H: those added fields to
-- LISTINGS. This adds a buyer PREFERENCE questionnaire, so it goes on the
-- two places that represent a buyer:
--
--   client_profiles — persistent, one-time answers a logged-in buyer sets
--                     once and can update anytime from their account. Reused
--                     across every inquiry they make.
--   leads           — the SAME questions, captured per-inquiry instead —
--                     covers guests without an account, and lets someone
--                     give different answers for a different property than
--                     what's on their standing profile (e.g. investment
--                     purpose for one flat, self-use for another).
--
-- Both tables get identical columns so the same form component works for
-- either, and so AdminLeads.jsx can show one consistent shape regardless of
-- which table the answers came from.
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS).
-- ════════════════════════════════════════════════════════════════════════════

do $$
declare
  tbl text;
begin
  -- ── Applied to both tables identically ──
  foreach tbl in array array['client_profiles', 'leads']
  loop
    execute format('alter table public.%I add column if not exists buyer_purpose text
      check (buyer_purpose in (''Self-Use'', ''Investment'', ''Rental Income'', ''Second Home'', ''Retirement''))', tbl);
    execute format('alter table public.%I add column if not exists buyer_budget_max numeric', tbl);  -- "total budget, including registration and other charges"
    execute format('alter table public.%I add column if not exists buyer_comfortable_emi numeric', tbl);
    execute format('alter table public.%I add column if not exists buyer_preferred_locations text[] not null default ''{}''', tbl);
    execute format('alter table public.%I add column if not exists buyer_acceptable_locations text[] not null default ''{}''', tbl);
    execute format('alter table public.%I add column if not exists buyer_excluded_locations text[] not null default ''{}''', tbl);
    execute format('alter table public.%I add column if not exists buyer_purchase_timeline text
      check (buyer_purchase_timeline in (''Immediately'', ''1-3 Months'', ''3-6 Months'', ''6-12 Months'', ''Just Exploring''))', tbl);
    execute format('alter table public.%I add column if not exists buyer_priority_factors text[] not null default ''{}''', tbl);  -- Price, Location, Size, Amenities, Connectivity, Possession Timeline, Investment Return
    execute format('alter table public.%I add column if not exists buyer_loan_assistance text
      check (buyer_loan_assistance in (''Need a Home Loan'', ''Need Eligibility Help'', ''Self-Funded / No Loan Needed'', ''Not Sure Yet''))', tbl);
    execute format('alter table public.%I add column if not exists buyer_open_to_under_construction text
      check (buyer_open_to_under_construction in (''Yes'', ''No'', ''Maybe''))', tbl);
    execute format('alter table public.%I add column if not exists buyer_must_have_features text[] not null default ''{}''', tbl);  -- Parking, Lift, Power Backup, Pet-Friendly, Senior-Friendly Design
    execute format('alter table public.%I add column if not exists buyer_wants_comparison boolean not null default false', tbl);
  end loop;
end $$;

-- ── Link a lead to the submitting buyer's persistent profile, when logged in ──
-- Nullable — guest leads (no account) simply won't have this set, and rely
-- entirely on the per-lead buyer_* snapshot columns above instead.
alter table public.leads add column if not exists client_id uuid references public.client_profiles(id) on delete set null;
create index if not exists idx_leads_client_id on public.leads(client_id);

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file: logged-in buyers get a "Buyer Preferences" section
-- on their account page (persistent), the Contact/Enquiry form gets an
-- optional "Tell us more" step (per-inquiry, pre-filled from their profile if
-- logged in), and AdminLeads.jsx surfaces both in the lead detail drawer.
-- ════════════════════════════════════════════════════════════════════════════
