-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 025: Property Detail Page — Key Highlights
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Section 4 of the spec ("Property Detail Page: Recommended Layout") is
-- mostly a layout/reorganization of data that already exists on `listings`
-- from Sections 2A-2H — no new columns needed for most of it. The one
-- genuinely new piece of data is "Why this property? Three to five concise
-- value highlights" — a short, admin/owner-curated list of the most
-- compelling reasons to consider this specific property, distinct from the
-- full amenities/specs lists elsewhere on the page.
--
-- Safe to re-run — idempotent (IF NOT EXISTS).
-- ════════════════════════════════════════════════════════════════════════════

alter table public.listings add column if not exists key_highlights text[] not null default '{}';

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, both listing forms let you add 3-5 short
-- highlight bullets, and the property detail page shows them in a new
-- "Why This Property?" section near the top of the page.
-- ════════════════════════════════════════════════════════════════════════════
