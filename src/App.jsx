import { useState } from "react";
import Navbar from "./components/common/Navbar";
import Hero from "./components/home/Hero";
import PopularProperties from "./components/home/PopularProperties";
import PreferredAgents from "./components/home/PreferredAgents";
import InvestmentAdvisory from "./components/home/InvestmentAdvisory";
import BlogInsights from "./components/home/BlogInsights";
import Testimonials from "./components/home/Testimonials";
import ChannelPartner from "./components/home/ChannelPartner";
import PropertyManagement from "./components/home/PropertyManagement";
import SearchResults from "./components/home/SearchResults";
import Footer from "./components/home/Footer";

// ── Simple client-side page router ───────────────────────────────────────────
// Pages: "home" | "search" | "channel-partner" | "property-management"

export default function App() {
  const [page, setPage] = useState("home");

  function navigate(to) {
    setPage(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        className="flex items-center gap-2 px-4 py-2 overflow-x-auto"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E8EB",
          scrollbarWidth: "none",
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-widest shrink-0"
          style={{ color: "#5B6670" }}
        >
          Pages:
        </span>
        {[
          { id: "home", label: "🏠 Home" },
          { id: "search", label: "🔍 Search Results" },
          { id: "channel-partner", label: "🤝 Channel Partner" },
          { id: "property-management", label: "🏢 Property Management" },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(p.id)}
            className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              background: page === p.id ? "#2C9DD5" : "transparent",
              color: page === p.id ? "#15191C" : "#5B6670",
              border: `1px solid ${page === p.id ? "#2C9DD5" : "#E5E8EB"}`,
            }}
          >
            {p.label}
          </button>
        ))}
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
