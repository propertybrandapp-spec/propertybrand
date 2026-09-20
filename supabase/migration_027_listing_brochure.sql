-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 027: Listing Brochure
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- A brochure for THIS specific listing — distinct from the PROJECT-wide
-- "Brochure" document type already supported on `projects.documents` (see
-- migration_016), which only ever applies to listings linked to a full
-- developer/project profile (an admin-only setup step). Most listings —
-- especially public self-listings with no linked project — have no such
-- profile, so this gives every listing its own simple brochure field
-- regardless of whether it's part of a tracked project.
--
-- Same pattern as floor_plan_url (migration_019): a plain URL column, filled
-- in either by pasting a link or — in the admin form — by uploading a PDF
-- straight to the "documents" R2 folder that already accepts PDFs.
--
-- Safe to re-run — idempotent (IF NOT EXISTS).
-- ════════════════════════════════════════════════════════════════════════════

alter table public.listings add column if not exists brochure_url text;

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, both listing forms get a Brochure field (paste a
-- link on the public form; paste a link or upload a PDF directly on the
-- admin form), and the property detail page shows a "Download Brochure"
-- button in the contact sidebar wherever a listing has one set.
-- ════════════════════════════════════════════════════════════════════════════
