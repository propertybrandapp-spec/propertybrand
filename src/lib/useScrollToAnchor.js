import { useEffect, useState } from "react";

// ── useScrollToAnchor ─────────────────────────────────────────────────────────
// Used by every page that has multiple navbar sub-links pointing at it
// (Investment Advisory, Home Loans, Architects & Design, Property Management,
// FAQ) so each specific link actually lands on — and briefly highlights — the
// exact section it names, instead of just the top of a shared page.
//
// Usage: give the target element `id={anchor}`, then:
//   const highlighted = useScrollToAnchor(scrollTo);
//   <div id="tenant-management" style={highlighted === "tenant-management" ? HIGHLIGHT_STYLE : undefined}>
export function useScrollToAnchor(anchor, deps = []) {
  const [highlighted, setHighlighted] = useState(null);

  useEffect(() => {
    if (!anchor) return;

    // Small delay lets the page finish its initial layout/image-load pass
    // before we measure scroll position — otherwise we can scroll to the
    // wrong spot if content above the target is still resizing.
    const scrollTimer = setTimeout(() => {
      const el = document.getElementById(anchor);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      setHighlighted(anchor);
    }, 150);

    const clearTimer = setTimeout(() => setHighlighted(null), 2600);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor, ...deps]);

  return highlighted;
}

// Shared highlight style — a soft blue ring + tint that fades in/out, applied
// to whichever element's id matches the current highlight target.
export const ANCHOR_HIGHLIGHT_STYLE = {
  boxShadow: "0 0 0 3px #2C9DD5",
  background: "#EAF4FB",
  transition: "box-shadow 0.3s ease, background 0.3s ease",
};
