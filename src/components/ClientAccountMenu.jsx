import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { User, Tag, Heart, ClipboardList } from "lucide-react";

export default function ClientAccountMenu({ onNavigate }) {
  const { profile, session, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName = profile?.full_name || session?.user?.email?.split("@")[0] || "Account";
  const initials = displayName.charAt(0).toUpperCase();

  async function handleLogout() {
    setOpen(false);
    await signOut();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 transition"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover shrink-0"
            style={{ border: "1.5px solid #E2E8F0" }}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "#1E88E5", color: "#FFFFFF" }}
          >
            {initials}
          </div>
        )}
        <span className="hidden sm:inline text-sm font-semibold" style={{ color: "#1F2937" }}>
          {displayName}
        </span>
        <svg
          className="w-3.5 h-3.5 hidden sm:block transition-transform"
          style={{ color: "#6B7280", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "#1E88E5", color: "#FFFFFF" }}>
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "#1F2937" }}>{displayName}</p>
                <p className="text-xs truncate" style={{ color: "#6B7280" }}>{session?.user?.email}</p>
              </div>
            </div>
            {[
              { label: "My Profile", page: "profile", icon: User },
              { label: "My Properties", page: "my-properties", icon: Tag },
              { label: "Saved Properties", page: "saved", icon: Heart },
              { label: "My Inquiries", page: "inquiries", icon: ClipboardList },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { setOpen(false); onNavigate && onNavigate(item.page); }}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm transition-colors"
                style={{ color: "#1F2937" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#F1F5F9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <item.icon className="w-4 h-4" style={{ color: "#6B7280" }} strokeWidth={2} />
                {item.label}
              </button>
            ))}
            <div style={{ borderTop: "1px solid #E2E8F0" }} />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors"
              style={{ color: "#DC2626" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#FEE2E2"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              Log Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
