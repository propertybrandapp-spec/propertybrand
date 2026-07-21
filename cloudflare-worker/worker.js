/**
 * PropertyBrands — R2 Upload Worker
 *
 * This Worker is the ONLY thing allowed to talk to R2 with write access.
 * The frontend never holds R2 credentials — it asks this Worker for a
 * short-lived presigned URL, uploads directly to R2 using that URL, then
 * stores the resulting public file path in Supabase (listings.image_url,
 * blog_posts.cover_image_url, client_profiles.avatar_url, etc).
 *
 * Shared by BOTH frontends — the public site (PostProperty, ClientProfile
 * avatar upload) and the admin console (listing/blog/agent photos) — which
 * as of the admin/public split now live on two different origins. That's
 * why ALLOWED_ORIGINS (plural) below is a comma-separated list rather than
 * a single string.
 *
 * Deploy with: wrangler deploy
 * (see wrangler.toml in this same folder for bucket binding config)
 */

import { AwsClient } from "aws4fetch";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight — required since the browser calls this Worker directly
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request, env) });
    }

    // ── POST /presign — returns a short-lived URL the browser can PUT a file to
    if (url.pathname === "/presign" && request.method === "POST") {
      return handlePresign(request, env);
    }

    // ── POST /delete — removes one or more objects from R2 by key
    if (url.pathname === "/delete" && request.method === "POST") {
      return handleDelete(request, env);
    }

    // ── GET /file/:key — public read proxy (only needed if your bucket isn't
    // already attached to a public R2.dev domain or custom domain)
    if (url.pathname.startsWith("/file/") && request.method === "GET") {
      return handleFileGet(request, env);
    }

    return new Response("Not found", { status: 404, headers: corsHeaders(request, env) });
  },
};

// ── Delete endpoint ─────────────────────────────────────────────────────────
// Called when an admin removes an image from a listing form, or deletes a
// listing outright (see src/lib/listings.js -> deleteListing()).
async function handleDelete(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Missing Authorization header" }, 401, request, env);
  }

  const body = await request.json();
  const { urls } = body; // array of public URLs previously returned by /presign

  if (!Array.isArray(urls) || urls.length === 0) {
    return json({ error: "urls (array) is required" }, 400, request, env);
  }

  // Convert each public URL back into its R2 object key, and only allow
  // deleting inside the folders this Worker is allowed to write to
  const ALLOWED_FOLDERS = ["listings", "blog", "avatars", "agents"];
  const prefix = `${env.R2_PUBLIC_BASE_URL}/`;
  const safeKeys = urls
    .filter((u) => typeof u === "string" && u.startsWith(prefix))
    .map((u) => u.slice(prefix.length))
    .filter((key) => ALLOWED_FOLDERS.some((f) => key.startsWith(`${f}/`)));

  await Promise.all(safeKeys.map((key) => env.R2_BUCKET.delete(key)));

  return json({ deleted: safeKeys }, 200, request, env);
}

// ── Presign endpoint ────────────────────────────────────────────────────────
async function handlePresign(request, env) {
  // Require the caller to be a logged-in Supabase user (admin or client).
  // We don't re-verify the JWT here for simplicity — in production, verify
  // the Supabase access token against your Supabase JWT secret before
  // issuing a presigned URL, so random visitors can't fill your bucket.
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Missing Authorization header" }, 401, request, env);
  }

  const body = await request.json();
  const { fileName, fileType, folder } = body;

  if (!fileName || !fileType || !folder) {
    return json({ error: "fileName, fileType, and folder are required" }, 400, request, env);
  }

  // Restrict which folders are writable — prevents path traversal / abuse
  const ALLOWED_FOLDERS = ["listings", "blog", "avatars", "agents"];
  if (!ALLOWED_FOLDERS.includes(folder)) {
    return json({ error: `folder must be one of: ${ALLOWED_FOLDERS.join(", ")}` }, 400, request, env);
  }

  // Restrict file types to images only
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!ALLOWED_TYPES.includes(fileType)) {
    return json({ error: "Only image uploads are allowed" }, 400, request, env);
  }

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeFileName}`;

  const client = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  });

  const r2Endpoint = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET_NAME}/${key}`;

  // Sign a PUT request valid for 5 minutes
  const signedRequest = await client.sign(
    new Request(r2Endpoint, { method: "PUT", headers: { "Content-Type": fileType } }),
    { aws: { signQuery: true }, expiresIn: 300 }
  );

  return json(
    {
      uploadUrl: signedRequest.url,
      key,
      publicUrl: `${env.R2_PUBLIC_BASE_URL}/${key}`,
    },
    200,
    request,
    env
  );
}

// ── Public file read proxy (optional fallback) ───────────────────────────────
async function handleFileGet(request, env) {
  const url = new URL(request.url);
  const key = decodeURIComponent(url.pathname.replace("/file/", ""));

  const object = await env.R2_BUCKET.get(key);
  if (!object) return new Response("Not found", { status: 404, headers: corsHeaders(request, env) });

  const headers = new Headers(corsHeaders(request, env));
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
// Reads ALLOWED_ORIGINS (preferred, comma-separated, e.g.
// "https://propertybrands.in,https://admin.propertybrands.in") and reflects
// back whichever of those origins made the request. Falls back to the older
// singular ALLOWED_ORIGIN secret for back-compat, then to "*".
function corsHeaders(request, env) {
  const configured = env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || "";
  const allowList = configured.split(",").map((o) => o.trim()).filter(Boolean);
  const requestOrigin = request.headers.get("Origin") || "";

  const allowOrigin = allowList.includes(requestOrigin)
    ? requestOrigin
    : (allowList[0] || "*");

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    // Response varies depending on the request's Origin header — tells
    // caches/CDNs not to serve one origin's CORS headers to another origin.
    "Vary": "Origin",
  };
}

function json(data, status, request, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(request, env) },
  });
}
