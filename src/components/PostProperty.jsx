import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { createListing } from "../lib/listings";
import { uploadToR2, validateImageFile } from "../lib/r2Upload";
import { fetchListingFieldOptions } from "../lib/listingOptions";
import LocationPicker from "./LocationPicker";
import AuthModal from "./AuthModal";
import { Home, CheckCircle2 } from "lucide-react";

// Fallback defaults — used until the dynamic options load (or if the
// "Site Content" → Listing Options table is still empty). Admins can add
// more of these from the admin console without a code change.
const DEFAULT_PROPERTY_TYPES = ["Apartment", "Villa", "Independent House", "Plot", "Commercial", "Office Space", "Shop / Showroom", "Warehouse / Industrial Shed", "Farmhouse", "Penthouse", "Studio Apartment", "Agricultural Land", "Office", "Retail", "Industrial", "Co-living", "Student Accommodation"];
const DEFAULT_BHK_OPTIONS = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "5+ BHK"];
const DEFAULT_AMENITIES = ["Lift", "Parking", "Visitor Parking", "Power Backup", "Security", "24x7 Security", "CCTV", "Intercom", "Swimming Pool", "Gym", "Garden", "Club House", "Multipurpose Hall", "Indoor Games", "Kids Play Area", "Jogging Track", "Amphitheatre", "Yoga / Meditation Area", "Senior Citizen Sitout", "Cafeteria", "WiFi", "Housekeeping", "Fire Safety", "Rain Water Harvesting", "Sewage Treatment Plant", "Solar Water Heating", "EV Charging Point", "Water Softener Plant", "Vaastu Compliant", "Pet Friendly", "Gated Community"];
const POSSESSION_OPTIONS = ["Ready to Move", "Under Construction"];
const FACING_OPTIONS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
// ── New in Section 2A: Property Identity & Basic Details ──
const LISTING_TYPE_OPTIONS = ["Sale", "Rent", "Lease", "Resale", "New Launch", "Under Construction"];
const VASTU_OPTIONS = ["Vastu Compliant", "Not Vastu Compliant", "Not Specified"];
const FURNISHING_OPTIONS = ["Unfurnished", "Semi-furnished", "Fully furnished"];
const CONDITION_OPTIONS = ["New", "Renovated", "Well maintained", "Needs renovation"];

const EMPTY_FORM = {
  title: "",
  location: "",
  type: "Apartment",
  transactionType: "Buy",
  listingType: "Sale",
  priceRaw: "",
  bhk: [],
  amenities: [],
  area: "",
  status: "Ready to Move",
  description: "",
  googleMapsLink: "",
  latitude: null,
  longitude: null,
  videoUrls: [],
  images: [],

  // ── Section 2A: Property Identity & Basic Details ──
  projectName: "",
  towerBlock: "",
  unitNumber: "",
  unitNumberPublic: true,
  bathrooms: "",
  balconies: "",
  servantRoom: false,
  builtUpArea: "",
  superBuiltUpArea: "",
  carpetArea: "",
  plotArea: "",
  floorNumber: "",
  totalFloors: "",
  totalUnits: "",
  facing: "",
  entranceDirection: "",
  vastuStatus: "Not Specified",
  furnishing: "",
  condition: "",
  age: "",
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
        <span className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#EFF6FF" }}>
          <Home className="w-7 h-7" style={{ color: "#1E88E5" }} strokeWidth={2} />
        </span>
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
        <span className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#F0FDF4" }}>
          <CheckCircle2 className="w-8 h-8" style={{ color: "#16A34A" }} strokeWidth={2} />
        </span>
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
              <Field label="Transaction Type">
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

            <Field label="Pin Location on Map" hint="This powers the interactive map buyers/tenants see on your listing.">
              <LocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onChange={({ latitude, longitude }) => setForm((f) => ({ ...f, latitude, longitude }))}
              />
            </Field>

            <Field label="Google Maps Link (optional)" hint="Only needed if you want the &quot;Get Directions&quot; button to open a specific saved link instead of the pin above.">
              <TextInput value={form.googleMapsLink} onChange={(e) => set("googleMapsLink", e.target.value)}
                placeholder="Paste a Google Maps share link (optional)" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={`Price (${form.transactionType === "Rent" ? "₹ / month" : "₹ total"})`} required>
                <TextInput type="number" min="0" value={form.priceRaw} onChange={(e) => set("priceRaw", e.target.value)} placeholder="e.g. 2400000" required />
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

          <div className="rounded-2xl p-6 space-y-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Property Identity &amp; Configuration</h2>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Project details, room configuration, and area breakdown — helps buyers/tenants find exactly what they need.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Project Name" hint="Optional">
                <TextInput value={form.projectName} onChange={(e) => set("projectName", e.target.value)} placeholder="e.g. Skyline Residency" />
              </Field>
              <Field label="Tower / Block">
                <TextInput value={form.towerBlock} onChange={(e) => set("towerBlock", e.target.value)} placeholder="e.g. Tower B" />
              </Field>
              <Field label="Unit Number">
                <TextInput value={form.unitNumber} onChange={(e) => set("unitNumber", e.target.value)} placeholder="e.g. 1204" />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
              <input type="checkbox" checked={form.unitNumberPublic} onChange={(e) => set("unitNumberPublic", e.target.checked)} className="w-4 h-4 rounded accent-[#1E88E5]" />
              Show my unit number on the public listing
            </label>

            <Field label="Listing Type">
              <Select value={form.listingType} onChange={(e) => set("listingType", e.target.value)}>
                {LISTING_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Bathrooms">
                <TextInput type="number" min="0" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} placeholder="e.g. 2" />
              </Field>
              <Field label="Balconies">
                <TextInput type="number" min="0" value={form.balconies} onChange={(e) => set("balconies", e.target.value)} placeholder="e.g. 1" />
              </Field>
              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                  <input type="checkbox" checked={form.servantRoom} onChange={(e) => set("servantRoom", e.target.checked)} className="w-4 h-4 rounded accent-[#1E88E5]" />
                  Servant Room
                </label>
              </div>
            </div>

            <Field label="Area Breakdown (sqft)" hint="Fill in whichever apply — e.g. plots typically only need Plot Area.">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <TextInput type="number" min="0" value={form.builtUpArea} onChange={(e) => set("builtUpArea", e.target.value)} placeholder="Built-up" />
                <TextInput type="number" min="0" value={form.superBuiltUpArea} onChange={(e) => set("superBuiltUpArea", e.target.value)} placeholder="Super Built-up" />
                <TextInput type="number" min="0" value={form.carpetArea} onChange={(e) => set("carpetArea", e.target.value)} placeholder="Carpet" />
                <TextInput type="number" min="0" value={form.plotArea} onChange={(e) => set("plotArea", e.target.value)} placeholder="Plot" />
              </div>
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Floor Number" hint="0 = ground floor">
                <TextInput type="number" min="0" value={form.floorNumber} onChange={(e) => set("floorNumber", e.target.value)} placeholder="e.g. 8" />
              </Field>
              <Field label="Total Floors">
                <TextInput type="number" min="0" value={form.totalFloors} onChange={(e) => set("totalFloors", e.target.value)} placeholder="e.g. 12" />
              </Field>
              <Field label="Total Units in Project">
                <TextInput type="number" min="0" value={form.totalUnits} onChange={(e) => set("totalUnits", e.target.value)} placeholder="e.g. 240" />
              </Field>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Facing">
                <Select value={form.facing} onChange={(e) => set("facing", e.target.value)}>
                  <option value="">— N/A —</option>
                  {FACING_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </Select>
              </Field>
              <Field label="Entrance Direction">
                <Select value={form.entranceDirection} onChange={(e) => set("entranceDirection", e.target.value)}>
                  <option value="">— N/A —</option>
                  {FACING_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </Select>
              </Field>
              <Field label="Vastu Status">
                <Select value={form.vastuStatus} onChange={(e) => set("vastuStatus", e.target.value)}>
                  {VASTU_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Furnishing">
                <Select value={form.furnishing} onChange={(e) => set("furnishing", e.target.value)}>
                  <option value="">— N/A —</option>
                  {FURNISHING_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </Select>
              </Field>
              <Field label="Condition">
                <Select value={form.condition} onChange={(e) => set("condition", e.target.value)}>
                  <option value="">— N/A —</option>
                  {CONDITION_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Age of Property">
                <TextInput value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="e.g. 2 years / New" />
              </Field>
            </div>
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
