import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";

const CLIENT_TYPES = ["Buyer", "Investor", "NRI", "Agent", "Tenant", "Landlord"];

export default function ClientProfile({ onNavigate }) {
  const { profile, session, updateProfile, signOut } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", city: "", client_type: "Buyer" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        client_type: profile.client_type || "Buyer",
      });
    }
  }, [profile]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const { error } = await updateProfile(form);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-bold mb-2" style={{ color: "#15191C" }}>You're not logged in</p>
        <p className="text-sm mb-5" style={{ color: "#495057" }}>Please log in to view your profile.</p>
        <button
          onClick={() => onNavigate && onNavigate("home")}
          className="px-6 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#BA0D0B", color: "#FFFFFF" }}
        >
          Return Home
        </button>
      </div>
    );
  }

  const initials = (form.full_name || session.user.email).charAt(0).toUpperCase();

  return (
    <div style={{ background: "#FFFFFF" }} className="min-h-screen">
      <section className="px-4 py-12" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #EAF4FB 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
            style={{ background: "#2C9DD5", color: "#FFFFFF" }}
          >
            {initials}
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#15191C" }}>{form.full_name || "Welcome"}</h1>
          <p className="text-sm mt-1" style={{ color: "#495057" }}>{session.user.email}</p>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-2xl mx-auto">

          {/* Quick nav */}
          <div className="flex gap-3 mb-8 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => onNavigate && onNavigate("saved")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all"
              style={{ background: "#FFFFFF", color: "#15191C", border: "1px solid #E5E8EB" }}
            >
              ❤️ Saved Properties
            </button>
            <button
              onClick={() => onNavigate && onNavigate("inquiries")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all"
              style={{ background: "#FFFFFF", color: "#15191C", border: "1px solid #E5E8EB" }}
            >
              📋 My Inquiries
            </button>
          </div>

          {/* Edit form */}
          <div className="rounded-2xl p-6 lg:p-8" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#15191C" }}>Account Details</h2>
            <p className="text-sm mb-6" style={{ color: "#495057" }}>Update your personal information.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#15191C" }}>Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                  style={{ background: "#F7F8FA", border: "1.5px solid #E5E8EB", color: "#15191C" }}
                  onFocus={(e) => e.target.style.borderColor = "#2C9DD5"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E8EB"}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#15191C" }}>Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                  style={{ background: "#F7F8FA", border: "1.5px solid #E5E8EB", color: "#15191C" }}
                  onFocus={(e) => e.target.style.borderColor = "#2C9DD5"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E8EB"}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#15191C" }}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Ranchi"
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                  style={{ background: "#F7F8FA", border: "1.5px solid #E5E8EB", color: "#15191C" }}
                  onFocus={(e) => e.target.style.borderColor = "#2C9DD5"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E8EB"}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#15191C" }}>I am a...</label>
                <div className="flex flex-wrap gap-2">
                  {CLIENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm({ ...form, client_type: type })}
                      className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: form.client_type === type ? "#2C9DD5" : "#F7F8FA",
                        color: form.client_type === type ? "#FFFFFF" : "#495057",
                        border: `1px solid ${form.client_type === type ? "#2C9DD5" : "#E5E8EB"}`,
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {saved && (
                <div className="text-sm rounded-xl px-4 py-3" style={{ background: "#EAF8EC", color: "#16a34a" }}>
                  ✓ Profile updated successfully
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: "#BA0D0B", color: "#FFFFFF", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="text-center mt-8">
            <button
              onClick={async () => { await signOut(); onNavigate && onNavigate("home"); }}
              className="text-sm font-semibold"
              style={{ color: "#BA0D0B" }}
            >
              Log out of your account
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
