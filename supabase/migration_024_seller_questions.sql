-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 024: Customer Questions — Sellers / Listing Owners
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Unlike 3A/3B (buyer/renter preferences, which live on client_profiles and
-- leads), these questions are asked of whoever is POSTING a listing, so they
-- go on `listings` directly — same table Sections 2A-2H already extended.
--
-- Two fields here are explicitly sensitive and must stay admin-only:
--   • seller_reason_for_selling — the spec itself says "optional and private"
--   • seller_minimum_acceptable_price — showing this publicly would destroy
--     the seller's negotiating position, so it's treated the same way even
--     though the spec doesn't say "private" in as many words
-- Neither should ever be read by PropertyDetail.jsx (the public page) or any
-- other public-facing component — admin/agent internal use only.
--
-- Overlap check against what already exists, so nothing's duplicated:
--   • "Is the price negotiable?" — already `listings.price_negotiable`
--     (migration_014). Not re-added here.
--   • "Are all property documents available for verification?" is the
--     SELLER's own claim/willingness at listing time — distinct from
--     `document_verification_status` (migration_017), which is the ADMIN's
--     actual verification outcome after review. Both are kept, since one
--     feeds into the other rather than replacing it.
--   • "Availability date" is THIS UNIT's own move-in-ready date (e.g. once
--     a tenant vacates, or renovation finishes) — distinct from
--     `projects.expected_possession_date` (migration_016), which is about
--     the whole PROJECT's construction completion. Both are kept.
--   • "Owner, authorized representative, builder or agent" overlaps with
--     the existing `posted_by` classification (migration_010/021), but
--     reads as a distinct formal declaration/attestation rather than a
--     display category, so it's kept separate — see seller_role_confirmation.
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS).
-- ════════════════════════════════════════════════════════════════════════════

alter table public.listings add column if not exists seller_role_confirmation text
  check (seller_role_confirmation in ('Owner', 'Authorized Representative', 'Builder', 'Agent'));

alter table public.listings add column if not exists seller_exclusive_listing text
  check (seller_exclusive_listing in ('Exclusive to PropertyBrands', 'Also Listed Elsewhere'));

-- Private — admin/agent internal use only, never shown on the public listing.
alter table public.listings add column if not exists seller_reason_for_selling text;
alter table public.listings add column if not exists seller_minimum_acceptable_price numeric;

alter table public.listings add column if not exists seller_currently_occupied text
  check (seller_currently_occupied in ('Vacant', 'Occupied by Owner', 'Occupied by Tenant'));

alter table public.listings add column if not exists seller_availability_date date;

alter table public.listings add column if not exists seller_documents_available boolean not null default false;

alter table public.listings add column if not exists seller_wants_marketing_support text[] not null default '{}';
-- values: Professional Photography, Video Walkthrough, Valuation, Marketing Support

alter table public.listings add column if not exists seller_contact_authorization boolean not null default false;

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, both listing forms show a "Seller Questions" card
-- (placed last, right before submit — these read as final confirmations more
-- than property specs). The two private fields are clearly marked in the UI
-- and intentionally never wired into PropertyDetail.jsx's public display.
-- ════════════════════════════════════════════════════════════════════════════
