import { createContext, useContext, useState, useEffect } from "react";
import { supabase, safeQuery } from "./supabaseClient";

// ── Auth Context ─────────────────────────────────────────────────────────────
// Wraps the entire public site (see App.jsx wiring instructions). Any
// component can call useAuth() to read the logged-in client's session/profile
// or trigger sign in / sign up / sign out — without prop-drilling through
// every layer of Navbar → Hero → etc.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session on first load (so refresh doesn't log you out)
    safeQuery(supabase.auth.getSession()).then(async ({ data }) => {
      const session = data?.session || null;
      setSession(session);
      if (session) await fetchProfile(session.user.id);
      setLoading(false);
    });

    // Keep state in sync with login/logout events fired anywhere in the app
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data } = await safeQuery(
      supabase.from("client_profiles").select("*").eq("id", userId).single()
    );
    setProfile(data);
  }

  // ── Sign up: creates the auth.users row; the DB trigger (see schema.sql)
  // automatically creates the matching client_profiles row.
  async function signUp({ email, password, fullName, phone }) {
    const { data, error } = await safeQuery(
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      })
    );
    return { data, error };
  }

  async function signIn({ email, password }) {
    const { data, error } = await safeQuery(supabase.auth.signInWithPassword({ email, password }));
    return { data, error };
  }

  async function signInWithGoogle() {
    const { data, error } = await safeQuery(
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      })
    );
    return { data, error };
  }

  async function signOut() {
    await safeQuery(supabase.auth.signOut());
    setSession(null);
    setProfile(null);
  }

  async function updateProfile(updates) {
    if (!session) return { error: new Error("Not logged in") };
    const { data, error } = await safeQuery(
      supabase
        .from("client_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", session.user.id)
        .select()
        .single()
    );
    if (!error) setProfile(data);
    return { data, error };
  }

  const value = {
    session,
    profile,
    loading,
    isLoggedIn: !!session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
