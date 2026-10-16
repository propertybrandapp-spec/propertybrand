import React, { useState } from "react";
import BookExpertModal from "./BookExpertModal";

const SENIOR_LIVING_FEATURES = [
  { title: "24/7 Paramedical & Emergency Response", desc: "SOS alert buttons in every bathroom and bedroom tied to on-campus nurse stations." },
  { title: "Barrier-Free Senior Ergonomics", desc: "Zero-threshold anti-skid vitrified flooring, wide wheelchair-compliant doorways, and safety grab rails." },
  { title: "Dietitian-Curated Communal Dining", desc: "Fresh, low-sodium pure vegetarian and multi-cuisine meal plans prepared daily by in-house nutritionists." },
  { title: "Assisted Living & Palliative Care", desc: "Dedicated caregivers for daily living activities, medicine reminders, and tie-ups with leading hospitals." },
  { title: "Active Community & Wellness Programs", desc: "Physiotherapy gyms, indoor games, temple visits, yoga centers, and daily evening club gatherings." },
  { title: "Transparent Recurring Billing", desc: "Clear separation between real estate ownership cost and monthly care & food maintenance fees." },
];

const SECOND_HOME_FEATURES = [
  { title: "Agricultural Land Title Legality", desc: "Verification of state-specific land ceiling acts, farmer certificate requirements, and mutation records." },
  { title: "Managed Rental Income Programs", desc: "Handover your villa or holiday home to professional vacation rental operators for 6%–10% gross annual yield." },
  { title: "Remote Caretaker & Garden Maintenance", desc: "Quarterly drone boundary inspections, boundary fencing, drip irrigation, and regular caretaker supervision." },
  { title: "Shared Ownership Governance", desc: "Clear 45-day guaranteed annual usage calendars, reserve fund contributions, and legal fractional exit mechanisms." },
];

export default function LifestyleHub({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("senior-living"); // "senior-living" | "second-homes"
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("investment");

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white py-14 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <span>🌿</span> Section 8: Senior Living, Retirement & Second-Home Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-white" style={{ color: "#FFFFFF" }}>
            Curated Living for Wellness, Retirement & Nature Getaways
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed" style={{ color: "#D1FAE5" }}>
            Lifestyle real estate requires verified care amenities, medical clearances, and legal ownership guidelines. Discover independent senior living communities, luxury retirement homes, and managed farmhouses.
          </p>

          {/* Tab Selector */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <button
              onClick={() => setActiveTab("senior-living")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "senior-living"
                  ? "bg-white text-gray-950 shadow-md font-black"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              👵 Retirement & Senior Living
            </button>
            <button
              onClick={() => setActiveTab("second-homes")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "second-homes"
                  ? "bg-white text-gray-950 shadow-md font-black"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              🏡 Farmhouses & Second Homes
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {/* RETIREMENT & SENIOR LIVING VIEW */}
        {activeTab === "senior-living" && (
          <div className="space-y-10 animate-fade-in">
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl">
                <span className="text-3xl p-3 rounded-2xl bg-teal-50 text-teal-700 block w-fit mb-4">🦽</span>
                <h3 className="text-lg font-bold text-gray-900">Independent Senior Living</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Active resort-style communities designed for retirees who want vibrant socializing, housekeeping, security, and zero maintenance hassles.
                </p>
                <button
                  onClick={() => onNavigate && onNavigate("search", { transactionType: "Buy", tags: ["Gated Community"] })}
                  className="mt-4 text-xs font-bold text-teal-700 hover:underline"
                >
                  Browse Independent Living →
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl">
                <span className="text-3xl p-3 rounded-2xl bg-emerald-50 text-emerald-700 block w-fit mb-4">🩺</span>
                <h3 className="text-lg font-bold text-gray-900">Assisted Living Communities</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Tailored support for seniors requiring assistance with medication, mobility, and 24/7 on-site geriatric nursing care.
                </p>
                <button
                  onClick={() => {
                    setSelectedTopic("investment");
                    setExpertModalOpen(true);
                  }}
                  className="mt-4 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Schedule Family Consultation →
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl">
                <span className="text-3xl p-3 rounded-2xl bg-blue-50 text-blue-700 block w-fit mb-4">📋</span>
                <h3 className="text-lg font-bold text-gray-900">Retirement Yield & NRI Care</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Secure premium retirement homes for elderly parents in India with dedicated relationship managers and emergency liaison.
                </p>
                <button
                  onClick={() => {
                    setSelectedTopic("nri");
                    setExpertModalOpen(true);
                  }}
                  className="mt-4 text-xs font-bold text-blue-700 hover:underline"
                >
                  NRI Parent Care Advisory →
                </button>
              </div>
            </div>

            {/* Checklist of Senior Standards */}
            <div className="bg-gray-50/80 rounded-3xl p-6 sm:p-10 border border-gray-200">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Verification Standard</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">Our Senior Care & Safety Verification Protocol</h2>
                <p className="text-xs text-gray-500 mt-1">
                  We do not classify any listing as Senior Living without verifying medical infrastructure and resident support contracts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {SENIOR_LIVING_FEATURES.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center mb-2.5">
                      0{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FARMHOUSES & SECOND HOMES VIEW */}
        {activeTab === "second-homes" && (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-3xl p-3 rounded-2xl bg-emerald-50 text-emerald-700 block w-fit mb-4">🌾</span>
                  <h3 className="text-xl font-bold text-gray-900">Farmhouses & Agricultural Plantations</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    Explore fertile agricultural land, mango & sandalwood plantations, and weekend farm estates. Every listing clearly documents state farmer eligibility requirements and access roads.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</span>
                      <span>Verified water table & borewell clearance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</span>
                      <span>High-voltage grid distance & fencing status</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate("search", { transactionType: "Buy", types: ["Agricultural Land", "Farmhouse"] })}
                  className="mt-6 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition w-fit"
                >
                  Browse Farmhouses & Land →
                </button>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-3xl p-3 rounded-2xl bg-amber-50 text-amber-700 block w-fit mb-4">🏖️</span>
                  <h3 className="text-xl font-bold text-gray-900">Managed Vacation Homes & Fractional Villas</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    Own a luxury hillside or coastal holiday home with professional hospitality management. Earn passive rental income while enjoying 45 days of guaranteed personal family stays per year.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</span>
                      <span>Zero caretaker hassle · Full housekeeping & pool maintenance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</span>
                      <span>Legally vetted co-ownership & resale exit rules</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setSelectedTopic("investment");
                    setExpertModalOpen(true);
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition w-fit"
                >
                  Explore Fractional Opportunities →
                </button>
              </div>
            </div>

            {/* Checklist of Second Home Protections */}
            <div className="bg-emerald-50/50 rounded-3xl p-6 sm:p-8 border border-emerald-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Second-Home Governance & Due Diligence Protocol</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SECOND_HOME_FEATURES.map((feat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-emerald-200/60 shadow-sm">
                    <h4 className="text-sm font-bold text-emerald-950">{feat.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <BookExpertModal
        isOpen={expertModalOpen}
        onClose={() => setExpertModalOpen(false)}
        initialTopic={selectedTopic}
      />
    </div>
  );
}
