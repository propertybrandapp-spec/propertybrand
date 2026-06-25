import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

// ── Google Icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    if (mode === "signup") {
      if (!form.fullName || !form.email || !form.password) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
      const { error } = await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setSuccessMsg("Account created! Check your email to verify, then log in.");
      setMode("login");
      return;
    }

    // Login
    const { error } = await signIn({ email: form.email, password: form.password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    onClose();
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success, Supabase redirects the page — no further action needed here.
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "#FFFFFF", boxShadow: "0 28px 56px rgba(21,25,28,0.25)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full z-10 transition-colors"
          style={{ color: "#495057" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#F2F4F6"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <span className="font-extrabold text-xl tracking-tight" style={{ color: "#15191C" }}>
              property<span style={{ color: "#2C9DD5" }}>Brands</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: "#F2F4F6" }}>
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setSuccessMsg(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize"
                style={{
                  background: mode === m ? "#FFFFFF" : "transparent",
                  color: mode === m ? "#15191C" : "#495057",
                  boxShadow: mode === m ? "0 1px 3px rgba(21,25,28,0.08)" : "none",
                }}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-bold mb-1" style={{ color: "#15191C" }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm mb-5" style={{ color: "#495057" }}>
            {mode === "login"
              ? "Log in to save properties, track inquiries, and more."
              : "Join PropertyBrands to save listings, schedule visits, and track your inquiries."}
          </p>

          {/* Google sign-in */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold mb-4 transition-all"
            style={{ background: "#FFFFFF", border: "1.5px solid #E5E8EB", color: "#15191C" }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#2C9DD5"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E8EB"}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "#E5E8EB" }} />
            <span className="text-xs" style={{ color: "#495057" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "#E5E8EB" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full Name *"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                style={{ background: "#F7F8FA", border: "1.5px solid #E5E8EB", color: "#15191C" }}
                onFocus={(e) => e.target.style.borderColor = "#2C9DD5"}
                onBlur={(e) => e.target.style.borderColor = "#E5E8EB"}
              />
            )}
            <input
              type="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
              style={{ background: "#F7F8FA", border: "1.5px solid #E5E8EB", color: "#15191C" }}
              onFocus={(e) => e.target.style.borderColor = "#2C9DD5"}
              onBlur={(e) => e.target.style.borderColor = "#E5E8EB"}
            />
            {mode === "signup" && (
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                style={{ background: "#F7F8FA", border: "1.5px solid #E5E8EB", color: "#15191C" }}
                onFocus={(e) => e.target.style.borderColor = "#2C9DD5"}
                onBlur={(e) => e.target.style.borderColor = "#E5E8EB"}
              />
            )}
            <input
              type="password"
              placeholder="Password *"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
              style={{ background: "#F7F8FA", border: "1.5px solid #E5E8EB", color: "#15191C" }}
              onFocus={(e) => e.target.style.borderColor = "#2C9DD5"}
              onBlur={(e) => e.target.style.borderColor = "#E5E8EB"}
            />

            {error && (
              <div className="text-sm rounded-xl px-4 py-3" style={{ background: "#FCEAEA", color: "#BA0D0B" }}>
                {error}
              </div>
            )}
            {successMsg && (
              <div className="text-sm rounded-xl px-4 py-3" style={{ background: "#EAF8EC", color: "#16a34a" }}>
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: loading ? "#5C0B03" : "#BA0D0B", color: "#FFFFFF", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "#495057" }}>
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => setMode("signup")} className="font-semibold" style={{ color: "#2C9DD5" }}>
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="font-semibold" style={{ color: "#2C9DD5" }}>
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
