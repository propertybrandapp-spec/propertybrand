-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 021: Seller / Agent Information
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- This project already had a full `agents` directory (AdminAgents.jsx,
-- PreferredAgents.jsx, RERA number, rating, Verified status...) — this
-- migration extends it with the fields the spec adds (photo, areas served,
-- response time, preferred contact methods, availability, phone masking)
-- rather than building a second, competing profile system.
--
-- `listings` gets an optional agent_id link (same pattern as developer_id/
-- project_id from migration_016) plus plain poster_* fallback fields for
-- listings with no linked agent profile — mainly private owners, who don't
-- have (and shouldn't need) a full directory listing to post their own flat.
--
-- Also: submitLead() in src/lib/leads.js was already built and its own
-- comment says it's meant to power "Contact"/"Schedule a Site Visit" buttons
-- on PropertyDetail.jsx — but that page never actually got them. This
-- section finally wires that up.
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Extend the existing agents directory ────────────────────────────────
alter table public.agents add column if not exists photo_url text;
alter table public.agents add column if not exists areas_served text[] not null default '{}';
alter table public.agents add column if not exists response_time text;              -- e.g. "Usually responds within 1 hour"
alter table public.agents add column if not exists preferred_contact_methods text[] not null default '{}';  -- Call, WhatsApp, Chat, Email
alter table public.agents add column if not exists availability_notes text;          -- e.g. "Site visits Mon–Sat, 10am–6pm"
alter table public.agents add column if not exists phone_masking_enabled boolean not null default false;

-- ── 2. posted_by: add Channel Partner & Property Manager ─────────────────────
alter table public.listings drop constraint if exists listings_posted_by_check;
alter table public.listings add constraint listings_posted_by_check
  check (posted_by in ('Owner', 'Builder', 'Channel Partner', 'Agent', 'Property Manager'));

-- ── 3. Link a listing to an agent profile, or fall back to plain contact info ──
alter table public.listings add column if not exists agent_id uuid references public.agents(id) on delete set null;

-- Plain fallback — mainly for private Owners, who won't have (and shouldn't
-- need) a full agents-directory profile just to post their own flat.
alter table public.listings add column if not exists poster_name text;
alter table public.listings add column if not exists poster_phone text;
alter table public.listings add column if not exists poster_email text;
alter table public.listings add column if not exists poster_photo_url text;
alter table public.listings add column if not exists poster_preferred_contact_methods text[] not null default '{}';
alter table public.listings add column if not exists poster_availability_notes text;
-- Defaults to true (masked) — a private owner's number should be protected
-- by default; they can turn this off if they'd rather show it outright.
alter table public.listings add column if not exists poster_phone_masking_enabled boolean not null default true;

create index if not exists idx_listings_agent_id on public.listings(agent_id);

-- ════════════════════════════════════════════════════════════════════════════
-- An honest note on "masked phone numbers": there's no telephony/virtual-
-- number API configured anywhere in this project (same gap as the Google
-- Places note in migration_015), so this does NOT implement real call
-- masking (a proxy number that forwards calls without exposing the real
-- one). What's implemented is the display-level pattern used across most
-- real estate sites: the number shows partially obscured until the visitor
-- taps "Reveal", at which point the real number is shown client-side and a
-- lead is logged. If you want true call masking later, that needs a
-- telephony provider (e.g. Twilio, Exotel) and an API key.
-- ════════════════════════════════════════════════════════════════════════════
