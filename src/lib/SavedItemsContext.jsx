import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import AuthModal from "../components/AuthModal";
import {
  fetchSavedPropertyIds, saveProperty, unsaveProperty,
  fetchSavedPostIds, savePost, unsavePost,
} from "./savedItems";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v) => typeof v === "string" && UUID_RE.test(v);

// ── Saved Items Context ──────────────────────────────────────────────────────
// Wraps the whole app so the heart icon (properties) and bookmark icon
// (articles) stay in sync everywhere they appear — homepage, search results,
// the detail pages, and the Saved page itself — without prop-drilling.
//
// Logged-out visitors get a sign-in prompt (see the shared <AuthModal>
// rendered below) instead of a save happening — there's no per-visitor
// identity to save against until they've signed in.
//
// Once logged in: real, Supabase-backed listings/posts (a genuine UUID id)
// persist to saved_properties / saved_posts. Bundled demo items (small
// integer ids, shown before you've added real content) just toggle
// visually for the current session, since there's nothing in the database
// for them to reference.

const SavedItemsContext = createContext(null);

export function SavedItemsProvider({ children }) {
  const { session, isLoggedIn } = useAuth();
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());
  const [savedPostIds, setSavedPostIds] = useState(new Set());
  const [localPropertyIds, setLocalPropertyIds] = useState(new Set()); // demo-only, session-scoped
  const [localPostIds, setLocalPostIds] = useState(new Set());          // demo-only, session-scoped
  const [loading, setLoading] = useState(false);
  // Centralized here (rather than in every heart/bookmark button) so every
  // "save" action anywhere in the app opens the same sign-in prompt when
  // logged out, instead of each place needing its own <AuthModal>.
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setSavedPropertyIds(new Set());
      setSavedPostIds(new Set());
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchSavedPropertyIds(session.user.id),
      fetchSavedPostIds(session.user.id),
    ]).then(([props, posts]) => {
      if (cancelled) return;
      setSavedPropertyIds(new Set(props.data));
      setSavedPostIds(new Set(posts.data));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [isLoggedIn, session?.user?.id]);

  const isPropertySaved = useCallback(
    (id) => (isUuid(id) ? savedPropertyIds.has(id) : localPropertyIds.has(id)),
    [savedPropertyIds, localPropertyIds]
  );

  const isPostSaved = useCallback(
    (id) => (isUuid(id) ? savedPostIds.has(id) : localPostIds.has(id)),
    [savedPostIds, localPostIds]
  );

  async function toggleSaveProperty(property) {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }

    const id = property.dbId || property.id;

    if (!isUuid(id)) {
      // Bundled demo listing — nothing in the DB to reference, so just
      // toggle visually for this session (still requires being logged in
      // first, so the experience matches saving a real listing).
      setLocalPropertyIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
      return;
    }

    const currentlySaved = savedPropertyIds.has(id);
    // Optimistic update
    setSavedPropertyIds((prev) => {
      const next = new Set(prev);
      currentlySaved ? next.delete(id) : next.add(id);
      return next;
    });

    const { error } = currentlySaved
      ? await unsaveProperty(session.user.id, id)
      : await saveProperty(session.user.id, id);

    if (error) {
      // Roll back on failure
      setSavedPropertyIds((prev) => {
        const next = new Set(prev);
        currentlySaved ? next.add(id) : next.delete(id);
        return next;
      });
    }
  }

  async function toggleSavePost(post) {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }

    const id = post.dbId || post.id;

    if (!isUuid(id)) {
      setLocalPostIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
      return;
    }

    const currentlySaved = savedPostIds.has(id);
    setSavedPostIds((prev) => {
      const next = new Set(prev);
      currentlySaved ? next.delete(id) : next.add(id);
      return next;
    });

    const { error } = currentlySaved
      ? await unsavePost(session.user.id, id)
      : await savePost(session.user.id, id);

    if (error) {
      setSavedPostIds((prev) => {
        const next = new Set(prev);
        currentlySaved ? next.add(id) : next.delete(id);
        return next;
      });
    }
  }

  const value = {
    loading,
    isPropertySaved,
    isPostSaved,
    toggleSaveProperty,
    toggleSavePost,
    savedPropertyIds,
    savedPostIds,
  };

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode="login" />
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  const ctx = useContext(SavedItemsContext);
  if (!ctx) throw new Error("useSavedItems must be used inside <SavedItemsProvider>");
  return ctx;
}
