-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 016: Project & Developer Information
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Unlike Sections A/B/C, most of this section describes the PROJECT and its
-- DEVELOPER, not any one unit — the same RERA number, brochure, construction
-- stage, and developer track record apply to every listing in that project.
-- Storing all of it as plain columns on `listings` would mean re-typing the
-- same facts on every unit and them silently drifting out of sync. So this
-- migration introduces two proper reusable tables instead:
--
--   developers  — one row per builder/developer, reused across all their projects
--   projects    — one row per project, reused across all its listed units
--
-- `listings` gets two new *optional* foreign keys (developer_id, project_id).
-- The plain-text `project_name` column from migration_013 is untouched and
-- still works as a simple display fallback for listings that aren't linked
-- to a full project profile (e.g. public self-listings).
--
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS / OR REPLACE).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Developers ────────────────────────────────────────────────────────────
create table if not exists public.developers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  verified boolean not null default false,
  experience_years integer,
  completed_projects_count integer,
  current_projects_count integer,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.developers enable row level security;

drop policy if exists "Anyone can view developers" on public.developers;
create policy "Anyone can view developers" on public.developers for select using (true);

drop policy if exists "Admins can manage developers" on public.developers;
create policy "Admins can manage developers" on public.developers for all
  using (auth.uid() in (select id from public.admin_profiles));

-- ── 2. Projects ─────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  developer_id uuid references public.developers(id) on delete set null,

  -- Scale
  land_area_acres numeric,
  total_towers integer,
  total_floors integer,        -- tallest/typical tower in the whole project
  total_units integer,         -- across the ENTIRE project (vs. listings.total_units, which is this one tower/block)

  -- Density — units_per_acre is computed, homes_per_floor is admin-entered
  -- (varies too much by tower/ground-floor-commercial etc. to reliably derive)
  units_per_acre numeric generated always as (
    case when land_area_acres is not null and land_area_acres > 0 and total_units is not null
      then round(total_units / land_area_acres, 1)
      else null end
  ) stored,
  homes_per_floor numeric,
  open_space_percent numeric,  -- % of project land left as open/green space

  -- Construction status
  construction_stage text check (construction_stage in (
    'Pre-Launch', 'Foundation', 'Under Construction', 'Structure Complete', 'Finishing Stage', 'Ready to Move', 'Completed'
  )),
  construction_stage_verified_at timestamptz,  -- auto-set by trigger below whenever the stage changes
  expected_possession_date date,
  handover_timeline text,       -- free text — e.g. phased handover notes, typical grace period

  -- RERA
  rera_number text,
  rera_state text,
  rera_project_name text,       -- the project's legal name as registered with RERA, if different from its marketing name
  rera_verification_link text,  -- direct link to the state RERA portal's record for this registration

  -- Approvals & documents — flexible lists rather than rigid columns:
  --   approvals: [{ "name": "Environmental Clearance", "status": "Approved", "documentUrl": "..." }]
  --   documents: [{ "type": "Brochure", "label": "2026 Brochure", "url": "..." }]
  --   (document "type" is one of: Brochure, Floor Plan, Master Plan, Specification Sheet, Other)
  approvals jsonb not null default '[]',
  documents jsonb not null default '[]',

  -- Construction quality
  construction_quality text,
  structure_type text,          -- e.g. "RCC framed structure"
  key_materials text,           -- e.g. "UPVC windows, vitrified tiles, modular kitchen, Kohler/Jaguar fittings"

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_developer_id on public.projects(developer_id);

alter table public.projects enable row level security;

drop policy if exists "Anyone can view projects" on public.projects;
create policy "Anyone can view projects" on public.projects for select using (true);

drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects" on public.projects for all
  using (auth.uid() in (select id from public.admin_profiles));

-- Auto-stamp construction_stage_verified_at whenever the stage actually
-- changes (or is set for the first time) — so "last verified update" is
-- always accurate without anyone needing to remember to update a date field.
create or replace function public.stamp_construction_stage_verified()
returns trigger as $$
begin
  if (tg_op = 'INSERT' and new.construction_stage is not null)
     or (tg_op = 'UPDATE' and new.construction_stage is distinct from old.construction_stage) then
    new.construction_stage_verified_at := now();
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_stamp_construction_stage on public.projects;
create trigger trg_stamp_construction_stage
  before insert or update on public.projects
  for each row execute procedure public.stamp_construction_stage_verified();

-- ── 3. Link listings to a developer & project profile ────────────────────────
alter table public.listings add column if not exists developer_id uuid references public.developers(id) on delete set null;
alter table public.listings add column if not exists project_id uuid references public.projects(id) on delete set null;
-- Plain-text fallback for when there's no linked developer profile (e.g. a
-- public self-listing where the owner just types a builder's name) — no
-- "verified" badge shown for this, only a linked developer_id gets that.
alter table public.listings add column if not exists developer_name text;

create index if not exists idx_listings_developer_id on public.listings(developer_id);
create index if not exists idx_listings_project_id on public.listings(project_id);

-- ════════════════════════════════════════════════════════════════════════════
-- After running this file, the admin listing form can search-select an
-- existing developer/project or quick-create a new one inline. The public
-- Post Property form only ever fills in the plain-text developer_name /
-- project_name fields — creating a verified developer/project profile stays
-- an admin-only action so the "Verified" badge actually means something.
-- ════════════════════════════════════════════════════════════════════════════
