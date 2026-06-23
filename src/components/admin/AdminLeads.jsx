import { useState } from "react";
import AdminLayout from "./AdminLayout";

// ── Data ──────────────────────────────────────────────────────────────────────

const LEADS = [
  { id: 1, name: "Rakesh Gupta", phone: "+91 94301 12345", email: "rakesh.g@email.com", interest: "3 BHK Flat, Harmu Colony", budget: "₹2 - 2.5 Cr", stage: "New", source: "Website", date: "Jun 17, 2026", assignedTo: "Rajesh Kumar" },
  { id: 2, name: "Neha Singhania", phone: "+91 98765 11223", email: "neha.s@email.com", interest: "Commercial Space, Main Road", budget: "₹1.5 Cr", stage: "Contacted", source: "Referral", date: "Jun 16, 2026", assignedTo: "Anil Mehta" },
  { id: 3, name: "Suresh Mahato", phone: "+91 90123 45678", email: "suresh.m@email.com", interest: "2 BHK Apartment, Morabadi", budget: "₹70 - 80 Lac", stage: "Site Visit", source: "Website", date: "Jun 15, 2026", assignedTo: "Priya Sharma" },
  { id: 4, name: "Anita Poddar", phone: "+91 91234 56789", email: "anita.p@email.com", interest: "Interior Design Service", budget: "₹8 - 10 Lac", stage: "Negotiation", source: "WhatsApp", date: "Jun 14, 2026", assignedTo: "Sunita Verma" },
  { id: 5, name: "Vikram Agarwal", phone: "+91 88001 23456", email: "vikram.a@email.com", interest: "Residential Plot, Argora", budget: "₹85 Lac - 1 Cr", stage: "Closed Won", source: "Referral", date: "Jun 10, 2026", assignedTo: "Deepak Singh" },
  { id: 6, name: "Priya Das", phone: "+91 99887 65432", email: "priya.d@email.com", interest: "Office Spaces (5 units)", budget: "₹6 Cr", stage: "Negotiation", source: "Cold Call", date: "Jun 13, 2026", assignedTo: "Anil Mehta" },
  { id: 7, name: "Manish Tiwari", phone: "+91 97765 43210", email: "manish.t@email.com", interest: "Project Partnership - Kanke Road", budget: "—", stage: "Closed Lost", source: "Website", date: "Jun 5, 2026", assignedTo: "Rajesh Kumar" },
  { id: 8, name: "Arvind Sharma", phone: "+91 96655 44332", email: "arvind.s@email.com", interest: "Sell 2 BHK, Lalpur", budget: "₹40 - 45 Lac", stage: "New", source: "Website", date: "Jun 17, 2026", assignedTo: "Unassigned" },
];

const STAGES = [
  { id: "New", color: "#2C9DD5", bg: "#EAF4FB" },
  { id: "Contacted", color: "#E87C02", bg: "#FDF1E5" },
  { id: "Site Visit", color: "#a78bfa", bg: "#F0EAFB" },
  { id: "Negotiation", color: "#E87C02", bg: "#FDF1E5" },
  { id: "Closed Won", color: "#16a34a", bg: "#EAF8EC" },
  { id: "Closed Lost", color: "#BA0D0B", bg: "#FCEAEA" },
];

// ── Lead Detail Drawer ────────────────────────────────────────────────────────
function LeadDrawer({ lead, onClose }) {
  if (!lead) return null;
  const stage = STAGES.find((s) => s.id === lead.stage);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="absolute right-0 top-0 bottom-0 w-full sm:w-96 overflow-y-auto"
        style={{ background: "#FFFFFF", borderLeft: "1px solid #E5E8EB" }}
      >
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4"
          style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E8EB" }}
        >
          <h3 className="text-base font-bold" style={{ color: "#15191C" }}>Lead Details</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ color: "#495057" }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
              style={{ background: "#2C9DD5", color: "#FFFFFF" }}
            >
              {lead.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: "#15191C" }}>{lead.name}</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: stage.bg, color: stage.color }}>
                {lead.stage}
              </span>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            {[
              { label: "Phone", value: lead.phone },
              { label: "Email", value: lead.email },
              { label: "Interested In", value: lead.interest },
              { label: "Budget", value: lead.budget },
              { label: "Source", value: lead.source },
              { label: "Date", value: lead.date },
              { label: "Assigned To", value: lead.assignedTo },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-start gap-3 py-2" style={{ borderBottom: "1px solid #F2F4F6" }}>
                <span className="text-xs shrink-0" style={{ color: "#495057" }}>{row.label}</span>
                <span className="text-sm font-medium text-right" style={{ color: "#15191C" }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Stage updater */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#495057" }}>Update Stage</p>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                  style={{
                    background: lead.stage === s.id ? s.color : "#F2F4F6",
                    color: lead.stage === s.id ? "#FFFFFF" : "#495057",
                  }}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: "#BA0D0B", color: "#FFFFFF" }}
            >
              Call Now
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: "#FFFFFF", color: "#2C9DD5", border: "1.5px solid #2C9DD5" }}
            >
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function AdminLeads({ onNavigate, onLogout, adminProfile }) {
  const [activeStage, setActiveStage] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  const filtered = activeStage === "All" ? LEADS : LEADS.filter((l) => l.stage === activeStage);

  return (
    <AdminLayout activePage="leads" onNavigate={onNavigate} onLogout={onLogout} adminProfile={adminProfile} title="Leads & Inquiries" subtitle="Track and manage every customer inquiry">
      <div className="space-y-5">

        {/* ── Stage Pipeline Summary ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveStage("All")}
            className="rounded-xl p-3.5 text-left transition-all"
            style={{
              background: activeStage === "All" ? "#15191C" : "#FFFFFF",
              border: `1px solid ${activeStage === "All" ? "#15191C" : "#E5E8EB"}`,
            }}
          >
            <p className="text-xl font-extrabold" style={{ color: activeStage === "All" ? "#FFFFFF" : "#15191C" }}>{LEADS.length}</p>
            <p className="text-xs mt-0.5" style={{ color: activeStage === "All" ? "#D6DADD" : "#495057" }}>All Leads</p>
          </button>
          {STAGES.map((stage) => {
            const count = LEADS.filter((l) => l.stage === stage.id).length;
            const active = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className="rounded-xl p-3.5 text-left transition-all"
                style={{
                  background: active ? stage.color : "#FFFFFF",
                  border: `1px solid ${active ? stage.color : "#E5E8EB"}`,
                }}
              >
                <p className="text-xl font-extrabold" style={{ color: active ? "#FFFFFF" : "#15191C" }}>{count}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: active ? "rgba(255,255,255,0.85)" : "#495057" }}>{stage.id}</p>
              </button>
            );
          })}
        </div>

        {/* ── View toggle ── */}
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "#495057" }}>
            <span className="font-bold" style={{ color: "#15191C" }}>{filtered.length}</span> leads
          </p>
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid #E5E8EB" }}>
            {["table", "cards"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-4 py-2 text-xs font-semibold capitalize transition-all"
                style={{
                  background: viewMode === mode ? "#2C9DD5" : "#FFFFFF",
                  color: viewMode === mode ? "#FFFFFF" : "#495057",
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table view ── */}
        {viewMode === "table" && (
          <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#F2F4F6", borderBottom: "1px solid #E5E8EB" }}>
                    <th className="px-5 py-3.5 text-left font-bold" style={{ color: "#15191C" }}>Name</th>
                    <th className="px-3 py-3.5 text-left font-bold hidden md:table-cell" style={{ color: "#15191C" }}>Interested In</th>
                    <th className="px-3 py-3.5 text-left font-bold hidden lg:table-cell" style={{ color: "#15191C" }}>Budget</th>
                    <th className="px-3 py-3.5 text-left font-bold" style={{ color: "#15191C" }}>Stage</th>
                    <th className="px-3 py-3.5 text-left font-bold hidden lg:table-cell" style={{ color: "#15191C" }}>Source</th>
                    <th className="px-3 py-3.5 text-left font-bold hidden md:table-cell" style={{ color: "#15191C" }}>Assigned</th>
                    <th className="px-5 py-3.5 text-right font-bold" style={{ color: "#15191C" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => {
                    const stage = STAGES.find((s) => s.id === lead.stage);
                    return (
                      <tr
                        key={lead.id}
                        className="cursor-pointer transition-colors"
                        style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F2F4F6" : "none" }}
                        onClick={() => setSelectedLead(lead)}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#FAFBFC"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background: "#2C9DD5", color: "#FFFFFF" }}
                            >
                              {lead.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate" style={{ color: "#15191C" }}>{lead.name}</p>
                              <p className="text-xs truncate" style={{ color: "#495057" }}>{lead.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 hidden md:table-cell truncate max-w-[200px]" style={{ color: "#495057" }}>{lead.interest}</td>
                        <td className="px-3 py-3.5 hidden lg:table-cell font-semibold" style={{ color: "#15191C" }}>{lead.budget}</td>
                        <td className="px-3 py-3.5">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: stage.bg, color: stage.color }}>
                            {lead.stage}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 hidden lg:table-cell" style={{ color: "#495057" }}>{lead.source}</td>
                        <td className="px-3 py-3.5 hidden md:table-cell" style={{ color: "#495057" }}>{lead.assignedTo}</td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="text-xs font-semibold" style={{ color: "#2C9DD5" }}>View →</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Cards view ── */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lead) => {
              const stage = STAGES.find((s) => s.id === lead.stage);
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-lg"
                  style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: "#2C9DD5", color: "#FFFFFF" }}
                      >
                        {lead.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "#15191C" }}>{lead.name}</p>
                        <p className="text-xs" style={{ color: "#495057" }}>{lead.phone}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: stage.bg, color: stage.color }}>
                      {lead.stage}
                    </span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: "#495057" }}>Interested in:</p>
                  <p className="text-sm font-semibold mb-3" style={{ color: "#15191C" }}>{lead.interest}</p>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #F2F4F6" }}>
                    <span className="text-xs" style={{ color: "#495057" }}>Budget: <span className="font-semibold" style={{ color: "#15191C" }}>{lead.budget}</span></span>
                    <span className="text-xs" style={{ color: "#495057" }}>{lead.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </AdminLayout>
  );
}
