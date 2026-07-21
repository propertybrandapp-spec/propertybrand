# PropertyBrands — Connecting Real Listings (Supabase + Cloudflare R2)

This guide gets the public site — Search Results, Property Detail, Post
Property, and the rest — running on your real Supabase database and
Cloudflare R2 storage, instead of the bundled demo data. (The admin console
that manages this data lives in a separate project — see its own SETUP.md.)

Your project already has the plumbing for this built in (`src/lib/supabaseClient.js`,
`src/lib/r2Upload.js`, `cloudflare-worker/`). This guide just walks through wiring
it up. It looks like a Supabase project (`.env`) is already configured — if so,
skip straight to **Step 1**.

---

## Step 0 — If you're starting from scratch

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor → New Query**, paste the entire contents of `supabase/schema.sql`, and run it. This creates every table (listings, leads, agents, blog_posts, client_profiles, admin_profiles, saved_properties) with the new listing-detail columns already included. `admin_profiles` is used by the separate admin console, not this site, but it's part of the same schema/database.
3. Skip to **Step 2**.

## Step 1 — Already have a Supabase project? Run the migration

Your `listings` table exists but is missing the columns the new Property Detail
page and Admin form need (BHK, images, tags, amenities, etc).

1. Go to **Supabase Dashboard → SQL Editor → New Query**.
2. Paste the entire contents of `supabase/migration_002_listing_details.sql` and run it.
3. It's safe to run even if you're not sure — every statement is `IF NOT EXISTS`, so it only adds what's missing and never touches existing data.

## Step 2 — Admin console

The admin console is a **separate project/deployment** (not part of this
repo) that shares this same Supabase project and R2 worker. See its own
SETUP.md for creating your first admin login and deploying it. Nothing in
this project needs to change to support it.

## Step 3 — Cloudflare R2 bucket (property photos)

If you already have `propertybrands-media` bucket set up, skip to Step 4.

1. **Cloudflare Dashboard → R2 → Create bucket** → name it (e.g. `propertybrands-media`).
2. Under the bucket's **Settings → Public Access**, enable public access (or connect a custom domain) so uploaded photos are viewable — note the public URL base, you'll need it below.
3. Create an **R2 API token** (Cloudflare Dashboard → R2 → Manage API Tokens) with read/write access to that bucket — you'll get an Access Key ID and Secret Access Key.

## Step 4 — Deploy the upload Worker

The Worker is the only thing allowed to talk to R2 directly — the browser asks it for a short-lived upload URL, never holds storage credentials itself.

```bash
cd cloudflare-worker
npm install
wrangler login          # one-time, opens a browser to authenticate

wrangler secret put R2_ACCOUNT_ID          # from Cloudflare dashboard sidebar
wrangler secret put R2_ACCESS_KEY_ID       # from Step 3
wrangler secret put R2_SECRET_ACCESS_KEY   # from Step 3
wrangler secret put R2_BUCKET_NAME         # e.g. propertybrands-media
wrangler secret put R2_PUBLIC_BASE_URL     # e.g. https://media.yourdomain.com (no trailing slash)

# This Worker is shared by both this site AND the separate admin console,
# so list every origin allowed to call it, comma-separated, no spaces:
wrangler secret put ALLOWED_ORIGINS        # e.g. https://propertybrands.in,https://admin.propertybrands.in

npm run deploy
```

This prints a URL like `https://propertybrands-r2-upload.<you>.workers.dev` — that's your `VITE_R2_WORKER_URL` (used by both this site's `.env` and the admin console's `.env`).

> This Worker now also has a `/delete` endpoint (new) — used automatically when an admin removes a photo or deletes a listing, so orphaned files don't pile up in your bucket. No extra setup needed; it reuses the same bucket binding and secrets above.

## Step 5 — Environment variables

In the project root, create/update `.env` (copy from `env.example` if starting fresh):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

VITE_R2_WORKER_URL=https://propertybrands-r2-upload.your-subdomain.workers.dev
```

Get the Supabase values from **Project Settings → API**. Restart `npm run dev` after editing `.env`.

---

## How it all connects

- New listings are created in the **admin console** (separate project) and written to your `listings` table via its own copy of `src/lib/listings.js`.
- Listings default to **Pending** — an admin flips the **Moderation Status** dropdown to **Live** to make them publicly visible.
- The public **Search Results** page (`/search`) automatically fetches real **Live** listings from Supabase. Until you add your first one, it shows the bundled demo dataset so the site never looks empty — the moment you have one real Live listing, it takes over automatically.
- Clicking any property card — on the homepage or in search results — opens the **Property Detail** page (image gallery, amenities, key facts, contact CTAs, similar properties), Amazon-style.
- Regular visitors can also submit their own listing via **Post Property** — it's saved as `Pending` until an admin approves it.

## Troubleshooting

- **"Couldn't load listings"** → check `.env` values and that you ran the SQL in Steps 0/1.
- **Photo upload fails (Post Property / profile avatar)** → check `VITE_R2_WORKER_URL` is set and the Worker deployed successfully (Step 4); check the Worker's secrets are all set (`wrangler secret list` from `cloudflare-worker/`), including `ALLOWED_ORIGINS` containing this site's exact origin.
