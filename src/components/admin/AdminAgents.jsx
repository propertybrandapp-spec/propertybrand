import { useState } from "react";
import AdminLayout from "./AdminLayout";

// ── Data ──────────────────────────────────────────────────────────────────────

const AGENTS = [
  { id: 1, name: "Rajesh Kumar", agency: "Kumar Properties", phone: "+91 94301 12345", email: "rajesh.k@email.com", tier: "Gold", status: "Verified", deals: 67, since: "2008", rating: 4.8 },
  { id: 2, name: "Priya Sharma", agency: "Sharma Realty", phone: "+91 98765 54321", email: "priya.s@email.com", tier: "Silver", status: "Verified", deals: 28, since: "2012", rating: 4.7 },
  { id: 3, name: "Anil Mehta", agency: "Mehta Associates", phone: "+91 90123 67890", email: "anil.m@email.com", tier: "Gold", status: "Verified", deals: 111, since: "2005", rating: 4.9 },
  { id: 4, name: "Sunita Verma", agency: "Verma Homes", phone: "+91 91234 78901", email: "sunita.v@email.com", tier: "Associate", status: "Pending", deals: 0, since: "2026", rating: 0 },
  { id: 5, name: "Deepak Singh", agency: "Singh & Sons Realty", phone: "+91 88001 23456", email: "deepak.s@email.com", tier: "Silver", status: "Verified", deals: 35, since: "2010", rating: 4.7 },
  { id: 6, name: "Kavitha Nair", agency: "Nair Properties", phone: "+91 99887 65432", email: "kavitha.n@email.com", tier: "Associate", status: "Pending", deals: 0, since: "2026", rating: 0 },
  { id: 7, name: "Mohammed Ali", agency: "Ali Estates", phone: "+91 97123 45678", email: "ali.m@email.com", tier: "Associate", status: "Suspended", deals: 4, since: "2024", rating: 3.2 },
];

const TIER_STYLES = {
  Associate: { color: "#495057", bg: "#F2F4F6" },
  Silver: { color: "#2C9DD5", bg: "#EAF4FB" },
  Gold: { color: "#E87C02", bg: "#FDF1E5" },
};

const STATUS_STYLES = {
  Verified: { color: "#16a34a", bg: "#EAF8EC" },
  Pending: { color: "#E87C02", bg: "#FDF1E5" },
  Suspended: { color: "#BA0D0B", bg: "#FCEAEA" },
};

const TABS = ["All Agents", "Pending Verification", "Suspended"];

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  if (!rating) return <span className="text-xs" style={{ color: "#495057" }}>No reviews yet</span>;
  return (
    <div className="flex items-center gap-1">
      <svg className="w-3.5 h-3.5" fill="#E87C02" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-xs font-bold" style={{ color: "#15191C" }}>{rating}</span>
    </div>
  );
}

// ── Agent Card ────────────────────────────────────────────────────────────────
function AgentCard({ agent, onAction }) {
  const tier = TIER_STYLES[agent.tier];
  const status = STATUS_STYLES[agent.status];

  return (
    <div className="rounded-2xl p-5 transition-shadow hover:shadow-lg" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background: "#2C9DD5", color: "#FFFFFF" }}
          >
            {agent.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#15191C" }}>{agent.name}</p>
            <p className="text-xs" style={{ color: "#495057" }}>{agent.agency}</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0" style={{ background: status.bg, color: status.color }}>
          {agent.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: tier.bg, color: tier.color }}>
          {agent.tier} Partner
        </span>
        <Stars rating={agent.rating} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg p-2.5 text-center" style={{ background: "#F2F4F6" }}>
          <p className="text-base font-extrabold" style={{ color: "#15191C" }}>{agent.deals}</p>
          <p className="text-[10px]" style={{ color: "#495057" }}>Deals Closed</p>
        </div>
        <div className="rounded-lg p-2.5 text-center" style={{ background: "#F2F4F6" }}>
          <p className="text-base font-extrabold" style={{ color: "#15191C" }}>{agent.since}</p>
          <p className="text-[10px]" style={{ color: "#495057" }}>Member Since</p>
        </div>
      </div>

      <div className="text-xs mb-4 space-y-1">
        <p style={{ color: "#495057" }}>📞 {agent.phone}</p>
        <p style={{ color: "#495057" }}>✉️ {agent.email}</p>
      </div>

      {agent.status === "Pending" ? (
        <div className="flex gap-2">
          <button
            onClick={() => onAction(agent.id, "verify")}
            className="flex-1 py-2 rounded-lg text-xs font-bold"
            style={{ background: "#16a34a", color: "#FFFFFF" }}
          >
            Approve
          </button>
          <button
            onClick={() => onAction(agent.id, "reject")}
            className="flex-1 py-2 rounded-lg text-xs font-bold"
            style={{ background: "#FFFFFF", color: "#BA0D0B", border: "1px solid #BA0D0B" }}
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-lg text-xs font-bold"
            style={{ background: "#EAF4FB", color: "#2C9DD5" }}
          >
            View Profile
          </button>
          <button
            className="flex-1 py-2 rounded-lg text-xs font-bold"
            style={{ background: "#FFFFFF", color: "#495057", border: "1px solid #E5E8EB" }}
          >
            {agent.status === "Suspended" ? "Reinstate" : "Suspend"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function AdminAgents({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("All Agents");
  const [agents, setAgents] = useState(AGENTS);

  function handleAction(id, action) {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        if (action === "verify") return { ...a, status: "Verified" };
        if (action === "reject") return { ...a, status: "Suspended" };
        return a;
      })
    );
  }

  const filtered = agents.filter((a) => {
    if (activeTab === "Pending Verification") return a.status === "Pending";
    if (activeTab === "Suspended") return a.status === "Suspended";
    return true;
  });

  const stats = {
    total: agents.length,
    verified: agents.filter((a) => a.status === "Verified").length,
    pending: agents.filter((a) => a.status === "Pending").length,
    gold: agents.filter((a) => a.tier === "Gold").length,
  };

  return (
    <AdminLayout activePage="agents" onNavigate={onNavigate} title="Agents & Channel Partners" subtitle="Manage partner verification and performance tiers">
      <div className="space-y-5">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Partners", value: stats.total, color: "#2C9DD5", bg: "#EAF4FB" },
            { label: "Verified", value: stats.verified, color: "#16a34a", bg: "#EAF8EC" },
            { label: "Pending Review", value: stats.pending, color: "#E87C02", bg: "#FDF1E5" },
            { label: "Gold Tier", value: stats.gold, color: "#E87C02", bg: "#FDF1E5" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: "#495057" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab ? "#2C9DD5" : "#FFFFFF",
                color: activeTab === tab ? "#FFFFFF" : "#495057",
                border: `1px solid ${activeTab === tab ? "#2C9DD5" : "#E5E8EB"}`,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Agent Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onAction={handleAction} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
            <span className="text-4xl mb-3">✅</span>
            <p className="text-sm font-bold" style={{ color: "#15191C" }}>All caught up!</p>
            <p className="text-xs mt-1" style={{ color: "#495057" }}>No agents in this category right now.</p>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
