import { supabase } from "./supabaseClient";

// ── R2 Upload Helper ──────────────────────────────────────────────────────────
// Call uploadToR2(file, folder) from any component (admin listing form, client
// avatar upload, blog cover image picker, etc). Returns the public URL to save
// into the matching Supabase column (listings.image_url, client_profiles.avatar_url, etc).

const WORKER_URL = import.meta.env.VITE_R2_WORKER_URL;

/**
 * @param {File} file - the file object from an <input type="file"> element
 * @param {"listings"|"blog"|"avatars"|"agents"} folder - which R2 folder to store under
 * @returns {Promise<{url: string, key: string} | {error: string}>}
 */
export async function uploadToR2(file, folder) {
  if (!WORKER_URL) {
    return { error: "Missing VITE_R2_WORKER_URL — check your .env file." };
  }

  if (!file) return { error: "No file provided." };

  // Get the current Supabase session token to authenticate the presign request
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: "You must be logged in to upload files." };

  // Step 1 — ask the Worker for a presigned upload URL
  const presignRes = await fetch(`${WORKER_URL}/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      folder,
    }),
  });

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}));
    return { error: err.error || "Failed to get upload URL." };
  }

  const { uploadUrl, publicUrl } = await presignRes.json();

  // Step 2 — upload the actual file bytes directly to R2 using that URL
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    return { error: "Upload to storage failed. Please try again." };
  }

  return { url: publicUrl };
}

/**
 * Validates a file before upload — call this in onChange handlers to give
 * instant feedback instead of waiting for the Worker to reject it.
 */
export function validateImageFile(file, maxSizeMB = 5) {
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Please upload a JPEG, PNG, WebP, or AVIF image.";
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File must be smaller than ${maxSizeMB}MB.`;
  }
  return null;
}
