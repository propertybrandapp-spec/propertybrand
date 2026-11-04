// Emails the rent agreement draft through the Cloudflare Worker (POST /send-agreement).
const WORKER_URL = import.meta.env.VITE_R2_WORKER_URL;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Unique, valid addresses from a mixed list (blank / malformed ones dropped).
export function validRecipients(list) {
  return Array.from(new Set((list || []).map((e) => String(e || "").trim().toLowerCase()).filter((e) => EMAIL_RE.test(e))));
}

// -> { ok: true, sent: [...] } or { ok: false, error }
export async function sendAgreementEmail({ to, subject, html, text }) {
  if (!WORKER_URL) return { ok: false, error: "Email service isn't configured (VITE_R2_WORKER_URL missing)." };
  const recipients = validRecipients(to);
  if (recipients.length === 0) return { ok: false, error: "No valid email address was provided." };
  try {
    const res = await fetch(`${WORKER_URL}/send-agreement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: recipients, subject, html, text }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body.error || `Email service error (${res.status}).` };
    return { ok: true, sent: body.sent || recipients };
  } catch (err) {
    return { ok: false, error: err?.message || "Couldn't reach the email service." };
  }
}
