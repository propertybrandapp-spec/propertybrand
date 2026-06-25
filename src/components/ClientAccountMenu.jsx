import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

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
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: "#2C9DD5", color: "#FFFFFF" }}
        >
          {initials}
        </div>
        <span className="hidden sm:inline text-sm font-semibold" style={{ color: "#15191C" }}>
          {displayName}
        </span>
        <svg
          className="w-3.5 h-3.5 hidden sm:block transition-transform"
          style={{ color: "#495057", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
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
            style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
          >
            <div className="px-4 py-3" style={{ borderBottom: "1px solid #E5E8EB" }}>
              <p className="text-sm font-bold truncate" style={{ color: "#15191C" }}>{displayName}</p>
              <p className="text-xs truncate" style={{ color: "#495057" }}>{session?.user?.email}</p>
            </div>
            {[
              { label: "My Profile", page: "profile", icon: "👤" },
              { label: "Saved Properties", page: "saved", icon: "❤️" },
              { label: "My Inquiries", page: "inquiries", icon: "📋" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { setOpen(false); onNavigate && onNavigate(item.page); }}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm transition-colors"
                style={{ color: "#15191C" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#F2F4F6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
            <div style={{ borderTop: "1px solid #E5E8EB" }} />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors"
              style={{ color: "#BA0D0B" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#FCEAEA"}
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
