-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 019: Media & Virtual Experience
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- The existing `images` text[] column (bare URLs) is left completely
-- untouched — it's read as plain strings by property cards, carousels, and
-- the admin listing table all over both apps. Restructuring it into objects
-- would break every one of those. Instead:
--   • image_details layers optional {url, caption, roomLabel} onto whichever
--     photos the admin/owner wants to caption/tag, matched by url.
--   • Reordering (bullet: "so the best image becomes the cover") needs no
--     new column at all — position 0 in `images` has always been the cover
--     image (see image_url in normalizeListing). The form just gets
--     reorder/"make cover" controls over the existing array.
--
-- Image QUALITY CHECKS — an honest note: true screenshot/watermark/
-- "unrelated image" detection needs a vision-ML service, and there's no such
-- API configured anywhere in this project (same situation as the Google
-- Places gap noted in migration_015). What IS implemented, entirely
-- client-side, no API key needed:
--   • A real perceptual-hash duplicate check (dHash, computed via canvas)
--   • A filename/aspect-ratio screenshot heuristic (a heuristic — not a
--     guarantee, clearly labeled as such in the UI)
--   • Mandatory room-category coverage + the 8-15 photo count, checked in
--     the form before save
-- Watermark detection and semantic "is this actually a property photo"
-- classification are NOT implemented — flagging that honestly rather than
-- faking a check that doesn't really work.
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Photo captions & room labels ───────────────────────────────────────────
-- [{ "url": "...", "caption": "...", "roomLabel": "Living Room" }, ...]
alter table public.listings add column if not exists image_details jsonb not null default '[]';

-- ── 2. Virtual tour & drone footage ───────────────────────────────────────────
alter table public.listings add column if not exists virtual_tour_url text;   -- 360° tour (Matterport/Kuula/etc. embed or share link)
alter table public.listings add column if not exists drone_view_url text;     -- drone footage — only add where legally permitted to fly/film

-- ── 3. Unit floor plan ──────────────────────────────────────────────────────
-- Unit-specific (this listing's own layout) — distinct from the PROJECT-wide
-- "Floor Plan" / "Master Plan" documents already supported on `projects`
-- (see migration_016). "Tower location map" is added as another allowed
-- value there too — see DOCUMENT_TYPE_OPTIONS in the admin form.
alter table public.listings add column if not exists floor_plan_url text;
alter table public.listings add column if not exists floor_plan_caption text;  -- e.g. "3BHK · 1450 sqft, with dimensions"

-- ── 4. Construction-progress photos (project-level — shared across units) ──────
-- [{ "url": "...", "date": "2026-06-01", "caption": "Structure work, 8th floor" }]
alter table public.projects add column if not exists construction_progress_photos jsonb not null default '[]';

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, both listing forms get an enhanced photo manager
-- (captions, room labels, reordering, duplicate/screenshot warnings, and a
-- mandatory-coverage checklist), plus fields for the virtual tour, drone
-- footage, and floor plan. The property detail page's gallery and a new
-- "Media & Virtual Experience" section surface all of it.
-- ════════════════════════════════════════════════════════════════════════════
