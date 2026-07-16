import { useState } from "react";
import { AuthProvider } from "./lib/AuthContext";
import { SavedItemsProvider } from "./lib/SavedItemsContext";
import Navbar from "./components/Navbar";
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
import AdminApp from "./components/admin/AdminApp";
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
//      | "sitemap" | "admin" | "profile" | "saved" | "inquiries"

function AppContent() {
  const [page, setPage] = useState("home");
  const [navNonce, setNavNonce] = useState(0);
  const [searchFilters, setSearchFilters] = useState(null);
  const [contactSubject, setContactSubject] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);

  // `payload` is optional and its meaning depends on the destination:
  //  - "search"           → an initial filters object (transactionType, types, tags, possession, etc.)
  //  - "contact"          → a subject value to preselect in the contact form dropdown
  //  - "property-detail"  → { property, pool } — the clicked property + the list it came from (for "Similar Properties")
  function navigate(to, payload) {
    setPage(to);
    setNavNonce((n) => n + 1);
    if (to === "search") setSearchFilters(payload || null);
    if (to === "contact") setContactSubject(payload || null);
    if (to === "property-detail") setViewingProperty(payload || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Admin console renders standalone — no public Navbar/Footer/dev-strip.
  // AdminApp handles its own auth gate, sidebar, and topbar internally.
  if (page === "admin") {
    return <AdminApp />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "#FFFFFF", color: "#15191C" }}
    >
      {/* ── Navbar always visible ── */}
      <Navbar onNavigate={navigate} currentPage={page} />

      {/* ── Dev nav strip (remove in production) ── */}
      <div
        className="px-4 py-2.5 overflow-x-auto"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E8EB",
          scrollbarWidth: "none",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2.5">
        <span
          className="text-[11px] font-bold uppercase tracking-widest shrink-0"
          style={{ color: "#5B6670" }}
        >
          Pages:
        </span>
        {[
          { id: "home", label: "🏠 Home" },
          { id: "search", label: "🔍 Search Results" },
          { id: "channel-partner", label: "🤝 Channel Partner" },
          { id: "property-management", label: "🏢 Property Management" },
          { id: "architects-design", label: "📐 Architects & Design" },
          { id: "investment-advisory", label: "📈 Investment Advisory" },
          { id: "agents", label: "🧑‍💼 Preferred Agents" },
          { id: "about", label: "📖 About Us" },
          { id: "contact", label: "✉️ Contact Us" },
          { id: "careers", label: "💼 Careers" },
          { id: "blog", label: "📰 Blog" },
          { id: "faq", label: "❓ Help / FAQ" },
          { id: "privacy-policy", label: "🔒 Privacy Policy" },
          { id: "terms-conditions", label: "📄 Terms & Conditions" },
          { id: "disclaimer", label: "⚠️ Disclaimer" },
          { id: "sitemap", label: "🗺️ Sitemap" },
          { id: "profile", label: "👤 My Profile" },
          { id: "saved", label: "❤️ Saved Properties" },
          { id: "inquiries", label: "📋 My Inquiries" },
          { id: "post-property", label: "🏷️ Post Property" },
          { id: "my-properties", label: "📦 My Properties" },
          { id: "admin", label: "🔐 Admin Console" },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(p.id)}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all"
            style={{
              background: page === p.id ? "#2C9DD5" : "transparent",
              color: page === p.id ? "#FFFFFF" : "#15191C",
              border: `1px solid ${page === p.id ? "#2C9DD5" : "#E5E8EB"}`,
            }}
          >
            {p.label}
          </button>
        ))}
        </div>
      </div>

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

        {page === "property-management" && <PropertyManagement onNavigate={navigate} />}

        {page === "architects-design" && <ArchitectsDesign onNavigate={navigate} />}

        {page === "investment-advisory" && <InvestmentAdvisory onNavigate={navigate} />}

        {page === "agents" && <PreferredAgents onNavigate={navigate} />}

        {page === "about" && <AboutUs onNavigate={navigate} />}

        {page === "contact" && <ContactUs key={navNonce} onNavigate={navigate} initialSubject={contactSubject} />}

        {page === "careers" && <Careers onNavigate={navigate} />}

        {page === "blog" && <BlogInsights onNavigate={navigate} />}

        {page === "faq" && <Faq onNavigate={navigate} />}

        {page === "privacy-policy" && <PrivacyPolicy onNavigate={navigate} />}

        {page === "terms-conditions" && <TermsConditions onNavigate={navigate} />}

        {page === "disclaimer" && <Disclaimer onNavigate={navigate} />}

        {page === "sitemap" && <Sitemap onNavigate={navigate} />}

        {page === "post-property" && <PostProperty key={navNonce} onNavigate={navigate} />}

        {page === "my-properties" && <MyProperties key={navNonce} onNavigate={navigate} />}

        {page === "profile" && <ClientProfile onNavigate={navigate} />}

        {page === "saved" && <SavedProperties onNavigate={navigate} />}

        {page === "inquiries" && <MyInquiries onNavigate={navigate} />}
      </main>

      {/* ── Footer always visible ── */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SavedItemsProvider>
        <AppContent />
      </SavedItemsProvider>
    </AuthProvider>
  );
}
