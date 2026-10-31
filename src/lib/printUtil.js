// ── Print / "Save as PDF" a single element ──────────────────────────────────
// window.print() prints the whole page — including the site header, footer and
// whatever modal is on top. This copies just one element (with the site's
// stylesheets) into a clean window and prints that, so the browser's print
// dialog offers exactly the brochure / agreement — and "Save as PDF" gives a
// real downloadable PDF of it.
//
// Returns false if the browser blocked the popup (callers can then fall back).
export function printElement(el, title = "PropertyBrands") {
  if (!el) return false;
  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) return false;

  const styleTags = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((n) => n.outerHTML)
    .join("\n");
  const base = document.baseURI;

  w.document.open();
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${String(title).replace(/</g, "&lt;")}</title><base href="${base}">${styleTags}
<style>
  html,body{background:#fff !important;margin:0;padding:0}
  body{padding:24px}
  .no-print{display:none !important}
  @media print{ body{padding:0} @page{margin:14mm} .avoid-break{break-inside:avoid} }
</style></head><body>${el.outerHTML}</body></html>`);
  w.document.close();

  // Wait for stylesheets/images, then print. A timeout covers browsers that
  // never fire load for cached resources.
  let printed = false;
  const go = () => { if (printed) return; printed = true; w.focus(); w.print(); };
  w.addEventListener("load", () => setTimeout(go, 400));
  setTimeout(go, 2500);
  return true;
}

// Downloads a file from a (possibly cross-origin) URL. The HTML `download`
// attribute is ignored for cross-origin links, so a plain <a download> to a
// file on another domain (like the R2 bucket) just opens it instead of saving
// it. This fetches the bytes and saves them; if the server doesn't allow that
// (no CORS), it falls back to opening the file in a new tab.
export async function downloadFromUrl(url, fileName) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    return { ok: true, method: "download" };
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
    return { ok: true, method: "opened" };
  }
}

// "https://x.r2.dev/a/b/Brochure.pdf?v=2" -> "pdf"; "" if there isn't one.
export function fileExtensionOf(url) {
  try {
    const path = new URL(url, window.location.href).pathname;
    const m = path.match(/\.([a-z0-9]{2,5})$/i);
    return m ? m[1].toLowerCase() : "";
  } catch {
    return "";
  }
}

export function isImageUrl(url) {
  return ["png", "jpg", "jpeg", "webp", "gif", "avif"].includes(fileExtensionOf(url));
}
