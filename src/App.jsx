import { useState } from "react";
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

// ── Simple client-side page router ───────────────────────────────────────────
// Pages: "home" | "search" | "channel-partner" | "property-management"
//      | "investment-advisory" | "agents" | "about" | "contact" | "careers"
//      | "blog" | "faq" | "privacy-policy" | "terms-conditions" | "disclaimer"
//      | "sitemap" | "profile" | "saved" | "inquiries" | "compare"
//
// The admin console used to render here (page === "admin") but now lives in
// its own separate project/deployment — see /admin-console (or wherever you
// deployed it) instead. Nothing in this file talks to it anymore.

function AppContent() {
  const [page, setPage] = useState("home");
  const [navNonce, setNavNonce] = useState(0);
  const [searchFilters, setSearchFilters] = useState(null);
  const [contactSubject, setContactSubject] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [pageAnchor, setPageAnchor] = useState(null);

  const ANCHOR_PAGES = ["investment-advisory", "property-management", "architects-design", "faq"];

  // `payload` is optional and its meaning depends on the destination:
  //  - "search"           → an initial filters object (transactionType, types, tags, possession, etc.)
  //  - "contact"          → a subject value to preselect in the contact form dropdown
  //  - "property-detail"  → { property, pool } — the clicked property + the list it came from (for "Similar Properties")
  //  - investment-advisory / property-management / architects-design / faq
  //                       → an anchor id string — scrolls to and briefly highlights that exact section
  function navigate(to, payload) {
    setPage(to);
    setNavNonce((n) => n + 1);
    if (to === "search") setSearchFilters(payload || null);
    if (to === "contact") setContactSubject(payload || null);
    if (to === "property-detail") setViewingProperty(payload || null);
    if (ANCHOR_PAGES.includes(to)) setPageAnchor(payload || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "#FFFFFF", color: "#1F2937" }}
    >
      {/* ── Navbar always visible ── */}
      <Navbar onNavigate={navigate} currentPage={page} />

      {/* ── Dev nav strip (remove in production) ── */}

      {/* ── Page rendering ── */}
      <main>
        {page === "home" && (
          <>
            <Hero onNavigate={navigate} />
            <PopularProperties onNavigate={navigate} />
            <PreferredAgents onNavigate={navigate} />
            <InvestmentAdvisory onNavigate={navigate} />
            <PropertyManagement onNavigate={navigate} />
            <ChannelPartner onNavigate={navigate} />
            <BlogInsights onNavigate={navigate} />
            <Testimonials onNavigate={navigate} />
          </>
        )}

        {page === "search" && <SearchResults key={navNonce} initialFilters={searchFilters} onNavigate={navigate} />}

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
