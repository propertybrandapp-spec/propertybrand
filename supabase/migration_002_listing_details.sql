-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 002: Rich Listing Details
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Safe to run even if you already ran schema.sql — every statement below is
-- idempotent (IF NOT EXISTS), so it will only add what's missing.
--
-- This adds everything the public Property Detail page (image gallery, BHK,
-- amenities, tags, etc.) and the new Admin "Add/Edit Listing" form need,
-- without touching any existing column, policy, or other table.
-- ════════════════════════════════════════════════════════════════════════════

-- NOTE on naming: `listings.status` already means the MODERATION state
-- (Live / Pending / Flagged / Rejected) and is used by the admin dashboard —
-- we leave it untouched. Buy-vs-Rent and Ready-to-Move-vs-Under-Construction
-- are different concepts, so they get their own new columns below
-- (transaction_type, possession) rather than overloading `status`.

alter table public.listings add column if not exists transaction_type text not null default 'Buy' check (transaction_type in ('Buy', 'Rent'));
alter table public.listings add column if not exists possession text check (possession in ('Ready to Move', 'Under Construction'));
alter table public.listings add column if not exists bhk text;                          -- e.g. "3 BHK" — null for Plot/Commercial
alter table public.listings add column if not exists area_sqft integer;
alter table public.listings add column if not exists floor text;                        -- e.g. "8th of 12"
alter table public.listings add column if not exists facing text;                       -- e.g. "East"
alter table public.listings add column if not exists age text;                          -- e.g. "2 years", "New"
alter table public.listings add column if not exists description text;                  -- long-form copy for the detail page
alter table public.listings add column if not exists tags text[] default '{}';          -- Luxury, Affordable, Gated Community, Office, Retail, Industrial, Co-living, Student Accommodation
alter table public.listings add column if not exists amenities text[] default '{}';     -- Lift, Parking, Gym, Security, ...
alter table public.listings add column if not exists images text[] default '{}';        -- ordered array of R2 public URLs (gallery)
alter table public.listings add column if not exists featured boolean default false;
alter table public.listings add column if not exists verified boolean default false;
alter table public.listings add column if not exists badge text;                        -- e.g. "New Launch", "Luxury"
alter table public.listings add column if not exists badge_color text;                  -- hex color for the badge

-- Helpful indexes for the public search/filter page
create index if not exists idx_listings_transaction_type on public.listings(transaction_type);
create index if not exists idx_listings_property_type on public.listings(property_type);

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, every new listing you create from the Admin
-- Console → Property Listings → Add Listing will populate these columns
-- automatically. Existing rows (if any) will just have empty/default values
-- for the new columns until you edit and save them from the admin form.
-- ════════════════════════════════════════════════════════════════════════════
