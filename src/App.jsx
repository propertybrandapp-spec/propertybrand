import { useState } from "react";
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
import Footer from "./components/Footer";
import AdminApp from "./components/admin/AdminApp";

// ── Simple client-side page router ───────────────────────────────────────────
// Pages: "home" | "search" | "channel-partner" | "property-management" | "admin"

export default function App() {
  const [page, setPage] = useState("home");

  function navigate(to) {
    setPage(to);
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
            <PreferredAgents />
            <InvestmentAdvisory />
            <PropertyManagement />
            <ChannelPartner />
            <BlogInsights />
            <Testimonials />
          </>
        )}

        {page === "search" && <SearchResults />}

        {page === "channel-partner" && <ChannelPartner />}

        {page === "property-management" && <PropertyManagement />}
      </main>

      {/* ── Footer always visible ── */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
