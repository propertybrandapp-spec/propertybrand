import { createContext, useContext, useState, useCallback } from "react";

// ── Compare Context ───────────────────────────────────────────────────────────
// A lightweight, session-only "shortlist to compare" tool — no login and no
// database required, unlike Saved Properties. Stores full property objects
// (not just ids) so it works identically for real Supabase listings and the
// bundled demo listings shown before an admin/owner has added real ones.
//
// Capped at MAX_COMPARE items; adding a 5th silently no-ops (the UI disables
// the control instead of surprising the user with a removal).

const MAX_COMPARE = 4;
const CompareContext = createContext(null);

function keyOf(property) {
  return property.dbId || property.id;
}

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]); // array of property objects

  const isComparing = useCallback((id) => items.some((p) => keyOf(p) === id), [items]);

  const toggleCompare = useCallback((property) => {
    const id = keyOf(property);
    setItems((prev) => {
      if (prev.some((p) => keyOf(p) === id)) return prev.filter((p) => keyOf(p) !== id);
      if (prev.length >= MAX_COMPARE) return prev; // full — caller should disable the control
      return [...prev, property];
    });
  }, []);

  const removeFromCompare = useCallback((id) => {
    setItems((prev) => prev.filter((p) => keyOf(p) !== id));
  }, []);

  const clearCompare = useCallback(() => setItems([]), []);

  return (
    <CompareContext.Provider value={{ items, isComparing, toggleCompare, removeFromCompare, clearCompare, maxCompare: MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
