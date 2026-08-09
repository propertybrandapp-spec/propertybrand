import { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { uploadToR2, validateImageFile } from "../lib/r2Upload";
import { Heart, ClipboardList } from "lucide-react";

const CLIENT_TYPES = ["Buyer", "Investor", "NRI", "Agent", "Tenant", "Landlord"];
// ── Section 3A: Quick Questions for Buyers ──
const BUYER_TYPES = ["Buyer", "Investor", "NRI"]; // client_types this section makes sense for
const PURPOSE_OPTIONS = ["Self-Use", "Investment", "Rental Income", "Second Home", "Retirement"];
const TIMELINE_OPTIONS = ["Immediately", "1-3 Months", "3-6 Months", "6-12 Months", "Just Exploring"];
const PRIORITY_OPTIONS = ["Price", "Location", "Size", "Amenities", "Connectivity", "Possession Timeline", "Investment Return"];
const LOAN_ASSISTANCE_OPTIONS = ["Need a Home Loan", "Need Eligibility Help", "Self-Funded / No Loan Needed", "Not Sure Yet"];
const UNDER_CONSTRUCTION_OPTIONS = ["Yes", "No", "Maybe"];
const MUST_HAVE_OPTIONS = ["Parking", "Lift", "Power Backup", "Pet-Friendly", "Senior-Friendly Design"];

export default function ClientProfile({ onNavigate }) {
  const { profile, session, updateProfile, signOut } = useAuth();
  const [form, setForm] = useState({
    full_name: "", phone: "", city: "", client_type: "Buyer",
    // ── Section 3A: Quick Questions for Buyers ──
    buyer_purpose: "", buyer_budget_max: "", buyer_comfortable_emi: "",
    buyer_preferred_locations: [], buyer_acceptable_locations: [], buyer_excluded_locations: [],
    buyer_purchase_timeline: "", buyer_priority_factors: [], buyer_loan_assistance: "",
    buyer_open_to_under_construction: "", buyer_must_have_features: [], buyer_wants_comparison: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateImageFile(file, 2); // 2MB limit for avatars
    if (validationError) {
      setAvatarError(validationError);
      return;
    }

    setAvatarError("");
    setAvatarUploading(true);

    const result = await uploadToR2(file, "avatars");

    if (result.error) {
      setAvatarError(result.error);
      setAvatarUploading(false);
      return;
    }

    await updateProfile({ avatar_url: result.url });
    setAvatarUploading(false);
  }

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        client_type: profile.client_type || "Buyer",
        buyer_purpose: profile.buyer_purpose || "",
        buyer_budget_max: profile.buyer_budget_max ?? "",
        buyer_comfortable_emi: profile.buyer_comfortable_emi ?? "",
        buyer_preferred_locations: profile.buyer_preferred_locations || [],
        buyer_acceptable_locations: profile.buyer_acceptable_locations || [],
        buyer_excluded_locations: profile.buyer_excluded_locations || [],
        buyer_purchase_timeline: profile.buyer_purchase_timeline || "",
        buyer_priority_factors: profile.buyer_priority_factors || [],
        buyer_loan_assistance: profile.buyer_loan_assistance || "",
        buyer_open_to_under_construction: profile.buyer_open_to_under_construction || "",
        buyer_must_have_features: profile.buyer_must_have_features || [],
        buyer_wants_comparison: !!profile.buyer_wants_comparison,
      });
    }
  }, [profile]);

  function toggleInArray(key, value) {
    setForm((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));
  }

  function locationsFromInput(value) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const { error } = await updateProfile({
      ...form,
      buyer_budget_max: form.buyer_budget_max === "" ? null : Number(form.buyer_budget_max),
      buyer_comfortable_emi: form.buyer_comfortable_emi === "" ? null : Number(form.buyer_comfortable_emi),
    });
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-bold mb-2" style={{ color: "#1F2937" }}>You're not logged in</p>
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>Please log in to view your profile.</p>
        <button
          onClick={() => onNavigate && onNavigate("home")}
          className="px-6 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#1565C0", color: "#FFFFFF" }}
        >
          Return Home
        </button>
      </div>
    );
  }

  const initials = (form.full_name || session.user.email).charAt(0).toUpperCase();

  return (
    <div style={{ background: "#FFFFFF" }} className="min-h-screen">
      <section className="px-4 py-12" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden transition-opacity"
              style={{ background: "#1565C0", color: "#FFFFFF", opacity: avatarUploading ? 0.6 : 1 }}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </button>
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ background: "rgba(11,11,11,0.4)" }}>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" style={{ color: "#FFFFFF" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "#1565C0", border: "2px solid #FFFFFF" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="#FFFFFF" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          {avatarError && (
            <p className="text-xs mb-2" style={{ color: "#1565C0" }}>{avatarError}</p>
          )}
          <h1 className="text-2xl font-extrabold" style={{ color: "#1F2937" }}>{form.full_name || "Welcome"}</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{session.user.email}</p>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-2xl mx-auto">

          {/* Quick nav */}
          <div className="flex gap-3 mb-8 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => onNavigate && onNavigate("saved")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all"
              style={{ background: "#FFFFFF", color: "#1F2937", border: "1px solid #E2E8F0" }}
            >
              <Heart className="w-4 h-4" style={{ color: "#1565C0" }} strokeWidth={2} /> Saved Properties
            </button>
            <button
              onClick={() => onNavigate && onNavigate("inquiries")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all"
              style={{ background: "#FFFFFF", color: "#1F2937", border: "1px solid #E2E8F0" }}
            >
              <ClipboardList className="w-4 h-4" style={{ color: "#1565C0" }} strokeWidth={2} /> My Inquiries
            </button>
          </div>

          {/* Edit form */}
          <div className="rounded-2xl p-6 lg:p-8" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#1F2937" }}>Account Details</h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Update your personal information.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                  style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }}
                  onFocus={(e) => e.target.style.borderColor = "#1565C0"}
                  onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                  style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }}
                  onFocus={(e) => e.target.style.borderColor = "#1565C0"}
                  onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Bhubaneswar"
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                  style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }}
                  onFocus={(e) => e.target.style.borderColor = "#1565C0"}
                  onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>I am a...</label>
                <div className="flex flex-wrap gap-2">
                  {CLIENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm({ ...form, client_type: type })}
                      className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: form.client_type === type ? "#1565C0" : "#F8FAFC",
                        color: form.client_type === type ? "#FFFFFF" : "#6B7280",
                        border: `1px solid ${form.client_type === type ? "#1565C0" : "#E2E8F0"}`,
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {saved && (
                <div className="text-sm rounded-xl px-4 py-3" style={{ background: "#F0FDF4", color: "#16A34A" }}>
                  ✓ Profile updated successfully
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: "#1565C0", color: "#FFFFFF", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* ── Buyer Preferences (Section 3A) ── */}
          {BUYER_TYPES.includes(form.client_type) && (
            <div className="rounded-2xl p-6 lg:p-8 mt-6" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <h2 className="text-lg font-bold mb-1" style={{ color: "#1F2937" }}>Buyer Preferences</h2>
              <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Answer a few quick questions so we can match you with the right properties — all optional.</p>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>What's your purpose?</label>
                  <div className="flex flex-wrap gap-2">
                    {PURPOSE_OPTIONS.map((p) => (
                      <button key={p} onClick={() => setForm({ ...form, buyer_purpose: p })}
                        className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
                        style={{ background: form.buyer_purpose === p ? "#1565C0" : "#F8FAFC", color: form.buyer_purpose === p ? "#FFFFFF" : "#6B7280", border: `1px solid ${form.buyer_purpose === p ? "#1565C0" : "#E2E8F0"}` }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Total Budget (₹)</label>
                    <input type="number" min="0" value={form.buyer_budget_max} onChange={(e) => setForm({ ...form, buyer_budget_max: e.target.value })}
                      placeholder="Including registration & charges"
                      className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none" style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Comfortable Monthly EMI (₹)</label>
                    <input type="number" min="0" value={form.buyer_comfortable_emi} onChange={(e) => setForm({ ...form, buyer_comfortable_emi: e.target.value })}
                      className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none" style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Preferred Locations</label>
                    <input value={form.buyer_preferred_locations.join(", ")} onChange={(e) => setForm({ ...form, buyer_preferred_locations: locationsFromInput(e.target.value) })}
                      placeholder="Comma-separated" className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none" style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Acceptable Locations</label>
                    <input value={form.buyer_acceptable_locations.join(", ")} onChange={(e) => setForm({ ...form, buyer_acceptable_locations: locationsFromInput(e.target.value) })}
                      placeholder="Comma-separated" className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none" style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Excluded Locations</label>
                    <input value={form.buyer_excluded_locations.join(", ")} onChange={(e) => setForm({ ...form, buyer_excluded_locations: locationsFromInput(e.target.value) })}
                      placeholder="Comma-separated" className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none" style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>How soon do you plan to buy?</label>
                  <div className="flex flex-wrap gap-2">
                    {TIMELINE_OPTIONS.map((t) => (
                      <button key={t} onClick={() => setForm({ ...form, buyer_purchase_timeline: t })}
                        className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
                        style={{ background: form.buyer_purchase_timeline === t ? "#1565C0" : "#F8FAFC", color: form.buyer_purchase_timeline === t ? "#FFFFFF" : "#6B7280", border: `1px solid ${form.buyer_purchase_timeline === t ? "#1565C0" : "#E2E8F0"}` }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>What matters most to you?</label>
                  <div className="flex flex-wrap gap-2">
                    {PRIORITY_OPTIONS.map((p) => (
                      <button key={p} onClick={() => toggleInArray("buyer_priority_factors", p)}
                        className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
                        style={{ background: form.buyer_priority_factors.includes(p) ? "#1565C0" : "#F8FAFC", color: form.buyer_priority_factors.includes(p) ? "#FFFFFF" : "#6B7280", border: `1px solid ${form.buyer_priority_factors.includes(p) ? "#1565C0" : "#E2E8F0"}` }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Do you need a home loan or eligibility help?</label>
                  <div className="flex flex-wrap gap-2">
                    {LOAN_ASSISTANCE_OPTIONS.map((l) => (
                      <button key={l} onClick={() => setForm({ ...form, buyer_loan_assistance: l })}
                        className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
                        style={{ background: form.buyer_loan_assistance === l ? "#1565C0" : "#F8FAFC", color: form.buyer_loan_assistance === l ? "#FFFFFF" : "#6B7280", border: `1px solid ${form.buyer_loan_assistance === l ? "#1565C0" : "#E2E8F0"}` }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Open to under-construction properties?</label>
                  <div className="flex flex-wrap gap-2">
                    {UNDER_CONSTRUCTION_OPTIONS.map((u) => (
                      <button key={u} onClick={() => setForm({ ...form, buyer_open_to_under_construction: u })}
                        className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
                        style={{ background: form.buyer_open_to_under_construction === u ? "#1565C0" : "#F8FAFC", color: form.buyer_open_to_under_construction === u ? "#FFFFFF" : "#6B7280", border: `1px solid ${form.buyer_open_to_under_construction === u ? "#1565C0" : "#E2E8F0"}` }}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Must-have features</label>
                  <div className="flex flex-wrap gap-2">
                    {MUST_HAVE_OPTIONS.map((m) => (
                      <button key={m} onClick={() => toggleInArray("buyer_must_have_features", m)}
                        className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
                        style={{ background: form.buyer_must_have_features.includes(m) ? "#1565C0" : "#F8FAFC", color: form.buyer_must_have_features.includes(m) ? "#FFFFFF" : "#6B7280", border: `1px solid ${form.buyer_must_have_features.includes(m) ? "#1565C0" : "#E2E8F0"}` }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                  <input type="checkbox" checked={form.buyer_wants_comparison} onChange={(e) => setForm({ ...form, buyer_wants_comparison: e.target.checked })} className="w-4 h-4 rounded accent-[#1565C0]" />
                  I'd like to compare properties with similar options
                </label>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#1565C0", color: "#FFFFFF", opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="text-center mt-8">
            <button
              onClick={async () => { await signOut(); onNavigate && onNavigate("home"); }}
              className="text-sm font-semibold"
              style={{ color: "#1565C0" }}
            >
              Log out of your account
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
