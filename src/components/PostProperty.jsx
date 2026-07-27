import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { createListing } from "../lib/listings";
import { uploadToR2, validateImageFile } from "../lib/r2Upload";
import { fetchListingFieldOptions } from "../lib/listingOptions";
import AuthModal from "./AuthModal";

// Fallback defaults — used until the dynamic options load (or if the
// "Site Content" → Listing Options table is still empty). Admins can add
// more of these from the admin console without a code change.
const DEFAULT_PROPERTY_TYPES = ["Apartment", "Villa", "Independent House", "Plot", "Commercial", "Office Space", "Shop / Showroom", "Warehouse / Industrial Shed", "Farmhouse", "Penthouse", "Studio Apartment", "Agricultural Land"];
const DEFAULT_BHK_OPTIONS = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "5+ BHK"];
const DEFAULT_AMENITIES = ["Lift", "Parking", "Visitor Parking", "Power Backup", "Security", "24x7 Security", "CCTV", "Intercom", "Swimming Pool", "Gym", "Garden", "Club House", "Multipurpose Hall", "Indoor Games", "Kids Play Area", "Jogging Track", "Amphitheatre", "Yoga / Meditation Area", "Senior Citizen Sitout", "Cafeteria", "WiFi", "Housekeeping", "Fire Safety", "Rain Water Harvesting", "Sewage Treatment Plant", "Solar Water Heating", "EV Charging Point", "Water Softener Plant", "Vaastu Compliant", "Pet Friendly", "Gated Community"];
const POSSESSION_OPTIONS = ["Ready to Move", "Under Construction"];

const EMPTY_FORM = {
  title: "",
  location: "",
  type: "Apartment",
  transactionType: "Buy",
  priceRaw: "",
  bhk: [],
  amenities: [],
  area: "",
  status: "Ready to Move",
  description: "",
  googleMapsLink: "",
  videoUrls: [],
  images: [],
};

const inputStyle = { background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" };

function Field({ label, children, required, hint }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>
        {label}{required && <span style={{ color: "#DC2626" }}> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs mt-1.5" style={{ color: "#6B7280" }}>{hint}</p>}
    </div>
  );
}

function TextInput(props) {
  return <input {...props} className="w-full text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2" style={inputStyle} />;
}

function Select({ children, ...props }) {
  return <select {...props} className="w-full text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2" style={inputStyle}>{children}</select>;
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
      style={{
        background: active ? "#1E88E5" : "#F1F5F9",
        color: active ? "#FFFFFF" : "#6B7280",
        border: active ? "1px solid #1E88E5" : "1px solid #E2E8F0",
      }}
    >
      {label}
    </button>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function PostProperty({ onNavigate }) {
  const { isLoggedIn } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [options, setOptions] = useState(null); // null = loading
  const [videoDraft, setVideoDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  useEffect(() => {
    let cancelled = false;
    fetchListingFieldOptions().then(({ data }) => { if (!cancelled) setOptions(data); });
    return () => { cancelled = true; };
  }, []);

  const PROPERTY_TYPES = options?.propertyTypes?.length ? options.propertyTypes : DEFAULT_PROPERTY_TYPES;
  const BHK_OPTIONS = options?.bhkOptions?.length ? options.bhkOptions : DEFAULT_BHK_OPTIONS;
  const AMENITIES = options?.amenities?.length ? options.amenities : DEFAULT_AMENITIES;

  function toggleInArray(key, value) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  }

  function addVideoUrl() {
    if (!videoDraft.trim()) return;
    set("videoUrls", [...form.videoUrls, videoDraft.trim()]);
    setVideoDraft("");
  }

  function removeVideoUrl(url) {
    set("videoUrls", form.videoUrls.filter((u) => u !== url));
  }

  async function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadError("");
    setUploading(true);
    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) { setUploadError(validationError); continue; }
      const result = await uploadToR2(file, "listings");
      if (result.error) setUploadError(result.error);
      else setForm((f) => ({ ...f, images: [...f.images, result.url] }));
    }
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url) {
    set("images", form.images.filter((u) => u !== url));
  }

  function priceLabelFromRaw(raw) {
    const n = Number(raw) || 0;
    if (form.transactionType === "Rent") return `₹${n.toLocaleString("en-IN")}/month`;
    return n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : `₹${(n / 100000).toFixed(0)} Lac`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveError("");

    if (!form.title || !form.location || !form.priceRaw) {
      setSaveError("Title, location, and price are required.");
      return;
    }

    setSaving(true);
    const { error } = await createListing({
      ...form,
      price: priceLabelFromRaw(form.priceRaw),
      postedBy: "Owner",
      // moderationStatus intentionally omitted — createListing/denormalizeListing
      // defaults it to "Pending", and RLS only allows inserting as Pending anyway.
    });
    setSaving(false);

    if (error) {
      setSaveError(error.message || "Something went wrong submitting your property. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  // ── Not logged in ──
  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-4xl mb-4">🏠</span>
        <p className="text-lg font-bold mb-2" style={{ color: "#1F2937" }}>Log in to post your property</p>
        <p className="text-sm mb-5 max-w-sm" style={{ color: "#6B7280" }}>
          Creating a free account lets you manage your listing and track inquiries from interested buyers or tenants.
        </p>
        <button onClick={() => setAuthModalOpen(true)} className="px-6 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#1E88E5", color: "#FFFFFF" }}>
          Log In / Sign Up
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  // ── Submitted ──
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-5xl mb-4">✅</span>
        <p className="text-lg font-bold mb-2" style={{ color: "#1F2937" }}>Property submitted for review!</p>
        <p className="text-sm mb-6 max-w-sm" style={{ color: "#6B7280" }}>
          Our team will verify the details and publish it within 24 hours. You can track its status from your profile.
        </p>
        <div className="flex gap-3">
          <button onClick={() => onNavigate && onNavigate("my-properties")} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#EFF6FF", color: "#1E88E5" }}>
            My Properties
          </button>
          <button onClick={() => { setForm(EMPTY_FORM); setSubmitted(false); }} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#1E88E5", color: "#FFFFFF" }}>
            Post Another
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div style={{ background: "#FFFFFF" }} className="px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#FFFFFF", color: "#1E88E5", border: "1px solid #1E88E5" }}>
            Free Listing
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#1F2937" }}>Post Your Property</h1>
          <p className="text-sm mt-2" style={{ color: "#6B7280" }}>
            List your property for free. Our team reviews every submission before it goes live.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {saveError && (
            <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: "#FEE2E2", color: "#DC2626" }}>{saveError}</div>
          )}

          <div className="rounded-2xl p-6 space-y-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <Field label="Title" required>
              <TextInput value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 3 BHK Apartment in Patia" required />
            </Field>

            <Field label="Location" required>
              <TextInput value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Patia, Bhubaneswar" required />
            </Field>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Listing Type">
                <Select value={form.transactionType} onChange={(e) => set("transactionType", e.target.value)}>
                  <option value="Buy">For Sale</option>
                  <option value="Rent">For Rent</option>
                </Select>
              </Field>
              <Field label="Property Type">
                <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Possession">
                <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
                  {POSSESSION_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </Field>
            </div>

            <Field label="BHK" hint="Select all that apply — e.g. a project offering both 2 BHK and 3 BHK units.">
              <div className="flex flex-wrap gap-2">
                {BHK_OPTIONS.map((b) => (
                  <Chip key={b} label={b} active={form.bhk.includes(b)} onClick={() => toggleInArray("bhk", b)} />
                ))}
              </div>
            </Field>

            <Field label="Google Maps Location">
              <TextInput value={form.googleMapsLink} onChange={(e) => set("googleMapsLink", e.target.value)}
                placeholder="Paste a Google Maps share link (optional)" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={`Price (${form.transactionType === "Rent" ? "₹ / month" : "₹ total"})`} required>
                <TextInput type="number" min="0" value={form.priceRaw} onChange={(e) => set("priceRaw", e.target.value)} placeholder="e.g. 2400000" required />
              </Field>
              <Field label="Area (sqft)">
                <TextInput type="number" min="0" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. 1200" />
              </Field>
            </div>

            {form.priceRaw && (
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Will display as <span className="font-bold" style={{ color: "#1E88E5" }}>{priceLabelFromRaw(form.priceRaw)}</span>
              </p>
            )}

            <Field label="Description">
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4}
                placeholder="Tell buyers or tenants a bit about the property..."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 resize-none" style={inputStyle} />
            </Field>

            <Field label="Amenities">
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <Chip key={a} label={a} active={form.amenities.includes(a)} onClick={() => toggleInArray("amenities", a)} />
                ))}
              </div>
            </Field>
          </div>

          <div className="rounded-2xl p-6 space-y-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Videos</h2>
            <p className="text-xs" style={{ color: "#6B7280" }}>Paste a link to a walkthrough video (YouTube, Vimeo, etc.) — optional.</p>
            <div className="flex flex-wrap gap-2">
              {form.videoUrls.map((url) => (
                <span key={url} className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "#F1F5F9", color: "#1F2937" }}>
                  {url.length > 40 ? url.slice(0, 40) + "…" : url}
                  <button type="button" onClick={() => removeVideoUrl(url)} className="font-bold" style={{ color: "#DC2626" }}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <TextInput value={videoDraft} onChange={(e) => setVideoDraft(e.target.value)} placeholder="https://youtube.com/watch?v=..."
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVideoUrl(); } }} />
              <button type="button" onClick={addVideoUrl} className="text-xs font-bold px-4 rounded-xl shrink-0" style={{ background: "#1E88E5", color: "#FFFFFF" }}>Add</button>
            </div>
          </div>

          <div className="rounded-2xl p-6 space-y-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Photos</h2>
            {uploadError && <div className="px-3.5 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "#FEE2E2", color: "#DC2626" }}>{uploadError}</div>}
            <div className="flex flex-wrap gap-3">
              {form.images.map((url) => (
                <div key={url} className="relative w-28 h-28 rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(0,0,0,0.7)", color: "#FFFFFF" }}>×</button>
                </div>
              ))}
              <label className="w-28 h-28 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ border: "1.5px dashed #E2E8F0", color: "#6B7280" }}>
                {uploading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" style={{ color: "#1E88E5" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] font-semibold text-center px-1">Add Photo</span>
                  </>
                )}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleFilesSelected} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving || uploading}
            className="w-full py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            style={{ background: "#1E88E5", color: "#FFFFFF" }}>
            {saving ? "Submitting..." : "Submit Property for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
