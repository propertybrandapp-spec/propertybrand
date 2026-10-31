import { useState, useRef, useEffect, useCallback } from "react";
import { AuthProvider } from "./lib/AuthContext";
import { SavedItemsProvider } from "./lib/SavedItemsContext";
import { CompareProvider } from "./lib/CompareContext";
import Navbar from "./components/Navbar";
import CompareBar from "./components/CompareBar";
import ComparePage from "./components/ComparePage";
import Hero from "./components/Hero";
import PopularProperties from "./components/PopularProperties";
import PreferredAgents from "./components/PreferredAgents";
import InvestmentAdvisory from "./components/InvestmentAdvisory";
import BlogInsights from "./components/BlogInsights";
import Testimonials from "./components/Testimonials";
import ChannelPartner from "./components/ChannelPartner";
import PropertyManagement from "./components/PropertyManagement";
import SearchResults from "./components/SearchResults";
import PropertyDetail from "./components/PropertyDetail";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Careers from "./components/Careers";
import ClientProfile from "./components/ClientProfile";
import SavedProperties from "./components/SavedProperties";
import MyInquiries from "./components/MyInquiries";
import Faq from "./components/Faq";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsConditions from "./components/TermsConditions";
import Disclaimer from "./components/Disclaimer";
import Sitemap from "./components/Sitemap";
import PostProperty from "./components/PostProperty";
import MyProperties from "./components/MyProperties";
import ArchitectsDesign from "./components/ArchitectsDesign";
import AdvertisementBanner from "./components/AdvertisementBanner";
import LandDevelopHub from "./components/LandDevelopHub";
import RentReadyHub from "./components/RentReadyHub";
import BuildMoveHub from "./components/BuildMoveHub";
import LifestyleHub from "./components/LifestyleHub";

// ── Simple client-side page router ───────────────────────────────────────────
// Pages: "home" | "search" | "channel-partner" | "property-management"
//      | "investment-advisory" | "agents" | "about" | "contact" | "careers"
//      | "blog" | "faq" | "privacy-policy" | "terms-conditions" | "disclaimer"
//      | "sitemap" | "profile" | "saved" | "inquiries" | "compare"
//      | "land-develop" | "rent-ready" | "build-move" | "lifestyle"
//
// The admin console used to render here (page === "admin") but now lives in
// its own separate project/deployment — see /admin-console (or wherever you
// deployed it) instead. Nothing in this file talks to it anymore.

// Pages that can be restored from the URL hash alone (i.e. they need no
// payload). "property-detail" is deliberately absent — it needs the property
// object, so a reload on it falls back to the home page.
const HASH_PAGES = [
  "home", "search", "channel-partner", "property-management", "investment-advisory", "agents", "about",
  "contact", "careers", "blog", "faq", "privacy-policy", "terms-conditions", "disclaimer", "sitemap",
  "post-property", "my-properties", "profile", "saved", "inquiries", "compare", "architects-design",
  "land-develop", "rent-ready", "build-move", "lifestyle",
];

function pageFromHash() {
  const p = (window.location.hash || "").replace(/^#\/?/, "");
  return HASH_PAGES.includes(p) ? p : "home";
}

function AppContent() {
  const [page, setPage] = useState(() => pageFromHash());
  const [navNonce, setNavNonce] = useState(0);
  const [searchFilters, setSearchFilters] = useState(null);
  const [contactSubject, setContactSubject] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [pageAnchor, setPageAnchor] = useState(null);

  const ANCHOR_PAGES = ["investment-advisory", "property-management", "architects-design", "faq"];

  // ── Browser Back / Forward support ─────────────────────────────────────────
  // The site is one page that swaps components, so without this the browser's
  // Back button (and a phone's back gesture) would leave the site entirely.
  // Every navigate() adds a history entry; Back/Forward replays the entry —
  // page plus its payload (search filters, viewed property, …) — and restores
  // the scroll position. Payloads live in memory (entriesRef), not in the URL.
  const entriesRef = useRef(new Map());   // entry id -> { page, payload, scrollY }
  const currentIdRef = useRef(0);
  const nextIdRef = useRef(1);

  function applyEntry(to, payload) {
    setPage(to);
    setNavNonce((n) => n + 1);
    if (to === "search") setSearchFilters(payload || null);
    if (to === "contact") setContactSubject(payload || null);
    if (to === "property-detail") setViewingProperty(payload || null);
    if (ANCHOR_PAGES.includes(to)) setPageAnchor(payload || null);
  }

  useEffect(() => {
    const first = { page: pageFromHash(), payload: null, scrollY: 0 };
    entriesRef.current.set(0, first);
    currentIdRef.current = 0;
    try { window.history.replaceState({ pbId: 0 }, "", window.location.hash || `#/${first.page}`); } catch { /* sandboxed iframe etc. */ }
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

    function onPop(e) {
      const id = e.state?.pbId;
      let entry = id != null ? entriesRef.current.get(id) : null;
      if (id != null) currentIdRef.current = id;
      // Entry unknown (e.g. page was reloaded in between) — rebuild from the URL
      if (!entry) entry = { page: pageFromHash(), payload: null, scrollY: 0 };
      applyEntry(entry.page, entry.payload);
      setTimeout(() => window.scrollTo({ top: entry.scrollY || 0, behavior: "auto" }), 60);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `payload` is optional and its meaning depends on the destination:
  //  - "search"           → an initial filters object (transactionType, types, tags, possession, etc.)
  //  - "contact"          → a subject value to preselect in the contact form dropdown
  //  - "property-detail"  → { property, pool } — the clicked property + the list it came from (for "Similar Properties")
  //  - investment-advisory / property-management / architects-design / faq
  //                       → an anchor id string — scrolls to and briefly highlights that exact section
  function navigate(to, payload) {
    // Remember where the user was scrolled on the page they're leaving
    const leaving = entriesRef.current.get(currentIdRef.current);
    if (leaving) leaving.scrollY = window.scrollY;

    const id = nextIdRef.current++;
    entriesRef.current.set(id, { page: to, payload: payload ?? null, scrollY: 0 });
    currentIdRef.current = id;
    try { window.history.pushState({ pbId: id }, "", `#/${to}`); } catch { /* ignore */ }

    applyEntry(to, payload);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // The results page reports its live filters here so that coming Back to it
  // (e.g. after opening a property) restores what the visitor had chosen, not
  // just the filters the page was first opened with. Stored on the history
  // entry only — no state update, so nothing re-renders or resets.
  const rememberSearchFilters = useCallback((filters) => {
    const entry = entriesRef.current.get(currentIdRef.current);
    if (entry && entry.page === "search") entry.payload = filters;
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1 && currentIdRef.current > 0) window.history.back();
    else navigate("home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#FFFFFF", color: "#1F2937" }}
    >
      {/* ── Navbar always visible ── */}
      <Navbar onNavigate={navigate} currentPage={page} />

      {/* ── Dev nav strip (remove in production) ── */}

      {/* ── Page rendering ── */}
      {/* ── Back bar: one step back through the pages the visitor has seen ── */}
      {page !== "home" && (
        <div className="max-w-7xl mx-auto px-4 pt-3">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#1565C0] hover:border-[#1565C0] transition"
            aria-label="Go back to the previous page"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      <main>
        {page === "home" && (
          <>
            <Hero onNavigate={navigate} />
            <PopularProperties onNavigate={navigate} />
            <AdvertisementBanner onNavigate={navigate} />
            <PreferredAgents onNavigate={navigate} />
            <InvestmentAdvisory onNavigate={navigate} />
            <PropertyManagement onNavigate={navigate} />
            <ChannelPartner onNavigate={navigate} />
            <BlogInsights onNavigate={navigate} />
            <Testimonials onNavigate={navigate} />
          </>
        )}

        {page === "search" && <SearchResults key={navNonce} initialFilters={searchFilters} onNavigate={navigate} onFiltersChange={rememberSearchFilters} />}

        {page === "property-detail" && (
          <PropertyDetail key={navNonce} property={viewingProperty?.property} pool={viewingProperty?.pool} onNavigate={navigate} />
        )}

        {page === "channel-partner" && <ChannelPartner onNavigate={navigate} />}

        {page === "property-management" && <PropertyManagement onNavigate={navigate} scrollTo={pageAnchor} navKey={navNonce} />}

        {page === "architects-design" && <ArchitectsDesign onNavigate={navigate} scrollTo={pageAnchor} navKey={navNonce} />}

        {page === "investment-advisory" && <InvestmentAdvisory onNavigate={navigate} scrollTo={pageAnchor} navKey={navNonce} />}

        {page === "agents" && <PreferredAgents onNavigate={navigate} />}

        {page === "about" && <AboutUs onNavigate={navigate} />}

        {page === "contact" && <ContactUs key={navNonce} onNavigate={navigate} initialSubject={contactSubject} />}

        {page === "careers" && <Careers onNavigate={navigate} />}

        {page === "blog" && <BlogInsights onNavigate={navigate} />}

        {page === "faq" && <Faq onNavigate={navigate} scrollTo={pageAnchor} navKey={navNonce} />}

        {page === "privacy-policy" && <PrivacyPolicy onNavigate={navigate} />}

        {page === "terms-conditions" && <TermsConditions onNavigate={navigate} />}

        {page === "disclaimer" && <Disclaimer onNavigate={navigate} />}

        {page === "sitemap" && <Sitemap onNavigate={navigate} />}

        {page === "post-property" && <PostProperty key={navNonce} onNavigate={navigate} />}

        {page === "my-properties" && <MyProperties key={navNonce} onNavigate={navigate} />}

        {page === "profile" && <ClientProfile onNavigate={navigate} />}

        {page === "saved" && <SavedProperties onNavigate={navigate} />}

        {page === "inquiries" && <MyInquiries onNavigate={navigate} />}

        {page === "compare" && <ComparePage onNavigate={navigate} />}

        {page === "land-develop" && <LandDevelopHub onNavigate={navigate} />}

        {page === "rent-ready" && <RentReadyHub onNavigate={navigate} />}

        {page === "build-move" && <BuildMoveHub onNavigate={navigate} />}

        {page === "lifestyle" && <LifestyleHub onNavigate={navigate} />}
      </main>

      {/* ── Floating compare bar (visible on every page once something's selected) ── */}
      <CompareBar onNavigate={navigate} />

      {/* ── Footer always visible ── */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SavedItemsProvider>
        <CompareProvider>
          <AppContent />
        </CompareProvider>
      </SavedItemsProvider>
    </AuthProvider>
  );
}
