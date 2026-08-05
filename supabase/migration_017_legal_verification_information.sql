-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 017: Legal & Verification Information
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Adds every field from spec section "2E. Legal & Verification Information".
-- Unlike Section D, this data genuinely varies unit-by-unit even within the
-- same project (one flat's title can be clear while another's is disputed),
-- so it lives on `listings` directly rather than on the shared project.
--
-- Trust note baked into the design: the fields that amount to an active
-- claim of verification (poster_verified, verification_date,
-- verification_source, document_verification_status, and the various
-- certificate/status fields) are only ever set from the Admin console —
-- the public Post Property form only lets an owner self-declare ownership
-- type and RERA status. See AdminListingForm.jsx / PostProperty.jsx.
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS).
-- ════════════════════════════════════════════════════════════════════════════

alter table public.listings add column if not exists rera_status text
  not null default 'Pending Verification'
  check (rera_status in ('Registered', 'Not Applicable', 'Pending Verification'));

alter table public.listings add column if not exists ownership_type text
  check (ownership_type in ('Freehold', 'Leasehold', 'Cooperative', 'Society', 'Authority Lease', 'Other'));

alter table public.listings add column if not exists title_status text
  check (title_status in ('Clear Title', 'Disputed', 'Under Verification', 'Not Verified'));

alter table public.listings add column if not exists document_verification_status text
  not null default 'Pending'
  check (document_verification_status in ('Verified', 'Pending', 'Not Verified'));

alter table public.listings add column if not exists encumbrance_status text
  check (encumbrance_status in ('No Encumbrance', 'Existing Loan/Mortgage', 'Under Litigation', 'Not Verified'));
alter table public.listings add column if not exists encumbrance_notes text;

alter table public.listings add column if not exists occupancy_certificate_status text
  check (occupancy_certificate_status in ('Available', 'Applied / In Process', 'Not Available', 'Not Applicable'));
alter table public.listings add column if not exists completion_certificate_status text
  check (completion_certificate_status in ('Available', 'Applied / In Process', 'Not Available', 'Not Applicable'));
alter table public.listings add column if not exists possession_certificate_status text
  check (possession_certificate_status in ('Available', 'Applied / In Process', 'Not Available', 'Not Applicable'));

alter table public.listings add column if not exists building_plan_status text
  check (building_plan_status in ('Approved', 'Pending Approval', 'Not Available'));

alter table public.listings add column if not exists property_tax_status text
  check (property_tax_status in ('Paid Up to Date', 'Dues Pending', 'Not Verified'));
alter table public.listings add column if not exists utility_connection_status text
  check (utility_connection_status in ('Connected', 'Partially Connected', 'Not Connected', 'Not Verified'));
alter table public.listings add column if not exists utility_connection_notes text;  -- e.g. "Water: connected; Power: pending meter"

-- "Verified Owner" / "Verified Agent" / "Verified Developer" badge — the
-- label itself is derived from posted_by at display time, this just flags
-- whether that specific poster has actually been verified for this listing.
alter table public.listings add column if not exists poster_verified boolean not null default false;
alter table public.listings add column if not exists verification_date date;
alter table public.listings add column if not exists verification_source text;  -- e.g. "Site visit", "Document review", "RERA portal cross-check"

-- ── Legal disclaimer (site-wide, not per-listing) ─────────────────────────────
-- Lives on site_settings (the existing singleton config table from
-- migration_009) rather than on every listing, and is editable from
-- Admin → Site Content → Settings.
alter table public.site_settings add column if not exists legal_disclaimer text;

update public.site_settings
set legal_disclaimer = 'PropertyBrands performs a good-faith review of the information and documents provided by owners, agents, and developers, but this verification is not a substitute for independent legal due diligence. Buyers and tenants are strongly advised to independently verify title, ownership, encumbrance, RERA registration, and all statutory approvals — including through a qualified lawyer — before making any payment or entering into an agreement.'
where legal_disclaimer is null;

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, the Admin listing form shows a full "Legal &
-- Verification" section, the public Post Property form gets two lightweight
-- self-declared fields (ownership type, RERA status), and the property
-- detail page shows a Legal & Verification summary with the disclaimer
-- always shown alongside it.
-- ════════════════════════════════════════════════════════════════════════════
