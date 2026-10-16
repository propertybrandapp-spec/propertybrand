import React, { useState } from "react";
import BookExpertModal from "./BookExpertModal";

const LAND_PILLARS = [
  {
    id: "buy",
    title: "Buy Land & Plots",
    tagline: "Curated residential, commercial, industrial & agricultural parcels with verified boundaries.",
    icon: "📍",
    badge: "Verified Titles",
    action: "Explore Land Listings",
    filterType: "Plot",
  },
  {
    id: "sell",
    title: "Sell Your Land",
    tagline: "List your parcel directly to verified developers, HNIs and institutional buyers with zero spam.",
    icon: "📑",
    badge: "Direct Buyers",
    action: "List Your Land (Free)",
    isPost: true,
  },
  {
    id: "jda",
    title: "Joint Development (JDA)",
    tagline: "Maximize landowner returns by partnering with top-tier developers for legally structured revenue/area sharing.",
    icon: "🤝",
    badge: "High Return",
    action: "Explore JDA Partners",
    consultTopic: "land",
  },
  {
    id: "verify",
    title: "Verify Land & Due Diligence",
    tagline: "Title search, 30-year encumbrance check, survey boundary demarcation, zoning and master plan conversion check.",
    icon: "⚖️",
    badge: "Legal Protection",
    action: "Request Title Check",
    consultTopic: "legal",
  },
  {
    id: "develop",
    title: "Develop & Build",
    tagline: "Connect with architects, environmental consultants, structural engineers, and feasibility specialists.",
    icon: "🏗️",
    badge: "Turnkey Execution",
    action: "Get Feasibility Plan",
    consultTopic: "land",
  },
  {
    id: "invest",
    title: "Land Banking & Investment",
    tagline: "Compare holding costs, growth corridors, highway connectivity, and projected 5-year capital appreciation.",
    icon: "📈",
    badge: "Growth Corridors",
    action: "View Growth Corridors",
    anchor: "land-banking",
  },
];

const ESSENTIAL_LAND_CHECKS = [
  { title: "Zoning & Permitted Land Use", desc: "Agricultural, Residential (Yellow belt), Commercial, or Industrial classification under the local Master Plan." },
  { title: "Revenue Conversion Status", desc: "Non-agricultural (NA / CLU) conversion orders, patta/mutation extract, and land clearance approvals." },
  { title: "Approach Road & Access Width", desc: "Official road width (30ft / 40ft / 60ft+), frontage, and legal right of way documentation." },
  { title: "Physical Demarcation & Survey", desc: "Total area in Sq Yards, Acres, or Gunthas with GPS survey coordinates and boundary wall status." },
  { title: "Utilities & Site Constraints", desc: "High-tension wire clearances, flood plains, water table availability, and 3-phase power grid distance." },
  { title: "Title Encumbrance & Ownership", desc: "30-year search report, Nil-Encumbrance certificate (EC), single vs joint family ownership clearance." },
];

export default function LandDevelopHub({ onNavigate }) {
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("land");

  function handlePillarClick(pillar) {
    if (pillar.isPost) {
      onNavigate && onNavigate("post-property");
    } else if (pillar.consultTopic) {
      setSelectedTopic(pillar.consultTopic);
      setExpertModalOpen(true);
    } else if (pillar.anchor) {
      onNavigate && onNavigate("investment-advisory", pillar.anchor);
    } else {
      onNavigate && onNavigate("search", {
        transactionType: "Buy",
        types: ["Plot", "Agricultural Land"],
      });
    }
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-16 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1565C020_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
            <span>🗺️</span> Section 4: Land & Development Marketplace
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-white" style={{ color: "#FFFFFF" }}>
            Comprehensive Land Discovery, Due Diligence & Joint Development
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed" style={{ color: "#CBD5E1" }}>
            Land requires specialized discovery and verification beyond standard listings. We connect landowners, developers, institutional investors, and legal specialists with verified parcel intelligence.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate("search", { transactionType: "Buy", types: ["Plot", "Agricultural Land"] })}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              style={{ background: "#1565C0" }}
            >
              Browse Land Listings
            </button>
            <button
              onClick={() => {
                setSelectedTopic("land");
                setExpertModalOpen(true);
              }}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-sm"
            >
              Book Land Feasibility Expert
            </button>
            <button
              onClick={() => onNavigate && onNavigate("post-property")}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all"
            >
              List Land for Sale / JDA
            </button>
          </div>
        </div>
      </section>

      {/* The 6 Core Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAND_PILLARS.map((p) => (
            <div
              key={p.id}
              onClick={() => handlePillarClick(p)}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2.5 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition">
                    {p.icon}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  {p.tagline}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 group-hover:underline">
                  {p.action} →
                </span>
                <span className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition">
                  ›
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Due Diligence Checklist Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700">
            Professional Verification Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Essential Land Listing & Due Diligence Requirements
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Every plot and land parcel on Property Brands is subjected to verified documentation checks to protect buyers and maximize developer confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ESSENTIAL_LAND_CHECKS.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 hover:bg-white hover:shadow-md transition">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-3">
                0{idx + 1}
              </div>
              <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-12 rounded-3xl p-8 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Have Land for Joint Development (JDA)?</h3>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
              Connect with audited Tier-1 builders for 50:50 / 60:40 revenue sharing models. Get a complimentary feasibility & zoning report before entering contracts.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedTopic("land");
              setExpertModalOpen(true);
            }}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-sm whitespace-nowrap shadow-lg transition"
          >
            Request JDA Evaluation
          </button>
        </div>
      </section>

      <BookExpertModal
        isOpen={expertModalOpen}
        onClose={() => setExpertModalOpen(false)}
        initialTopic={selectedTopic}
      />
    </div>
  );
}
