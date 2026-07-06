# PropertyBrands — Connecting Real Listings (Supabase + Cloudflare R2)

This guide gets the **Add / Edit / Delete Listing** admin console and the public
**Property Detail** page running on your real Supabase database and Cloudflare
R2 storage, instead of the bundled demo data.

Your project already has the plumbing for this built in (`src/lib/supabaseClient.js`,
`src/lib/r2Upload.js`, `cloudflare-worker/`). This guide just walks through wiring
it up. It looks like a Supabase project (`.env`) is already configured — if so,
skip straight to **Step 1**.

---

## Step 0 — If you're starting from scratch

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor → New Query**, paste the entire contents of `supabase/schema.sql`, and run it. This creates every table (listings, leads, agents, blog_posts, client_profiles, admin_profiles, saved_properties) with the new listing-detail columns already included.
3. Skip to **Step 2**.

## Step 1 — Already have a Supabase project? Run the migration

Your `listings` table exists but is missing the columns the new Property Detail
page and Admin form need (BHK, images, tags, amenities, etc).

1. Go to **Supabase Dashboard → SQL Editor → New Query**.
2. Paste the entire contents of `supabase/migration_002_listing_details.sql` and run it.
3. It's safe to run even if you're not sure — every statement is `IF NOT EXISTS`, so it only adds what's missing and never touches existing data.

## Step 2 — Create your first admin login

If you haven't already:

1. **Supabase Dashboard → Authentication → Users → Add User** — create a user with your email/password.
2. Copy that user's **UUID** (shown in the users table).
3. Back in **SQL Editor**, run:
   ```sql
   insert into public.admin_profiles (id, full_name, role)
   values ('paste-the-uuid-here', 'Your Name', 'super_admin');
   ```
4. You can now log in at `/admin` (click "🔐 Admin Console" in the dev nav strip, or navigate there) using that email/password.

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
wrangler secret put ALLOWED_ORIGIN         # your site's URL, e.g. https://propertybrands.pages.dev

npm run deploy
```

This prints a URL like `https://propertybrands-r2-upload.<you>.workers.dev` — that's your `VITE_R2_WORKER_URL`.

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

- **Admin Console → Property Listings → Add Listing** opens a form (`AdminListingForm.jsx`) — fill in details, drag in photos (they upload straight to R2 via the Worker), and hit **Create Listing**. It's written to your `listings` table via `src/lib/listings.js`.
- Listings default to **Pending** — flip the **Moderation Status** dropdown to **Live** (or use **Approve** from the listings table) to make them publicly visible.
- The public **Search Results** page (`/search`) automatically fetches real **Live** listings from Supabase. Until you add your first one, it shows the bundled demo dataset so the site never looks empty — the moment you have one real Live listing, it takes over automatically.
- Clicking any property card — on the homepage or in search results — opens the new **Property Detail** page (image gallery, amenities, key facts, contact CTAs, similar properties), Amazon-style.
- **Edit** and **Delete** both live behind the ⋮ menu on each row in the admin Listings table (or open Edit directly by clicking a row). Delete also removes the listing's photos from R2.

## Troubleshooting

- **"Couldn't load listings" in the admin console** → check `.env` values and that you ran the SQL in Steps 0/1.
- **Photo upload fails** → check `VITE_R2_WORKER_URL` is set and the Worker deployed successfully (Step 4); check the Worker's secrets are all set (`wrangler secret list` from `cloudflare-worker/`).
- **Logged in but admin console still shows the login screen** → make sure you completed Step 2 (the `admin_profiles` row) — a Supabase auth user alone isn't enough, they also need a matching admin profile row.
