import { useState } from "react";
import AdminLayout from "./AdminLayout";

// ── Data ──────────────────────────────────────────────────────────────────────

const LISTINGS = [
  { id: 1, title: "3 BHK Apartment", location: "Harmu Colony, Ranchi", type: "Apartment", price: "₹2.40 Cr", status: "Live", postedBy: "Owner", date: "Jun 14, 2026", views: 2140, image: "🏢" },
  { id: 2, title: "4 BHK Villa", location: "Kanke Road, Ranchi", type: "Villa", price: "₹3.80 Cr", status: "Pending", postedBy: "Builder", date: "Jun 16, 2026", views: 0, image: "🏡" },
  { id: 3, title: "1 BHK Flat", location: "Lalpur, Ranchi", type: "Apartment", price: "₹42 Lac", status: "Live", postedBy: "Agent", date: "Jun 10, 2026", views: 840, image: "🏠" },
  { id: 4, title: "Residential Plot", location: "Argora, Ranchi", type: "Plot", price: "₹85 Lac", status: "Flagged", postedBy: "Owner", date: "Jun 8, 2026", views: 312, image: "🏞️" },
  { id: 5, title: "Office Space", location: "Main Road, Ranchi", type: "Commercial", price: "₹1.50 Cr", status: "Live", postedBy: "Builder", date: "Jun 12, 2026", views: 1280, image: "🏬" },
  { id: 6, title: "2 BHK Apartment", location: "Morabadi, Ranchi", type: "Apartment", price: "₹68 Lac", status: "Live", postedBy: "Builder", date: "Jun 17, 2026", views: 1820, image: "🏢" },
  { id: 7, title: "5 BHK Luxury Villa", location: "Golf Course Road, Ranchi", type: "Villa", price: "₹7.20 Cr", status: "Live", postedBy: "Builder", date: "Jun 15, 2026", views: 2840, image: "🏡" },
  { id: 8, title: "3 BHK Flat", location: "Ashok Nagar, Ranchi", type: "Apartment", price: "₹1.10 Cr", status: "Rejected", postedBy: "Agent", date: "Jun 5, 2026", views: 0, image: "🏠" },
];

const STATUS_STYLES = {
  Live: { bg: "#EAF8EC", color: "#16a34a" },
  Pending: { bg: "#FDF1E5", color: "#E87C02" },
  Flagged: { bg: "#FCEAEA", color: "#BA0D0B" },
  Rejected: { bg: "#F2F4F6", color: "#495057" },
};

const FILTER_TABS = ["All", "Live", "Pending", "Flagged", "Rejected"];

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status];
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

// ── Action Menu ───────────────────────────────────────────────────────────────
function ActionMenu({ listing }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
        style={{ color: "#495057" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#F2F4F6"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-2xl z-30 py-1 overflow-hidden"
          style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
        >
          {["View Details", "Edit Listing", "Approve", "Flag for Review"].map((action) => (
            <button
              key={action}
              onClick={() => setOpen(false)}
              className="block w-full text-left px-4 py-2 text-sm transition-colors"
              style={{ color: "#15191C" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F2F4F6"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              {action}
            </button>
          ))}
          <div style={{ borderTop: "1px solid #E5E8EB" }} />
          <button
            onClick={() => setOpen(false)}
            className="block w-full text-left px-4 py-2 text-sm font-semibold transition-colors"
            style={{ color: "#BA0D0B" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#FCEAEA"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Delete Listing
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function AdminListings({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const filtered = LISTINGS.filter((l) => {
    if (activeFilter !== "All" && l.status !== activeFilter) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function toggleSelect(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function toggleSelectAll() {
    setSelected(selected.length === filtered.length ? [] : filtered.map((l) => l.id));
  }

  const counts = {
    All: LISTINGS.length,
    Live: LISTINGS.filter((l) => l.status === "Live").length,
    Pending: LISTINGS.filter((l) => l.status === "Pending").length,
    Flagged: LISTINGS.filter((l) => l.status === "Flagged").length,
    Rejected: LISTINGS.filter((l) => l.status === "Rejected").length,
  };

  return (
    <AdminLayout activePage="listings" onNavigate={onNavigate} title="Property Listings" subtitle="Manage, approve, and moderate all listings">
      <div className="space-y-5">

        {/* ── Top bar: search + add button ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 w-full sm:w-72"
            style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#495057" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings..."
              className="flex-1 text-sm bg-transparent focus:outline-none"
              style={{ color: "#15191C" }}
            />
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#BA0D0B", color: "#FFFFFF" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#5C0B03"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#BA0D0B"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Listing
          </button>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: activeFilter === tab ? "#2C9DD5" : "#FFFFFF",
                color: activeFilter === tab ? "#FFFFFF" : "#495057",
                border: `1px solid ${activeFilter === tab ? "#2C9DD5" : "#E5E8EB"}`,
              }}
            >
              {tab}
              <span
                className="text-[10px] font-bold px-1.5 rounded-full"
                style={{
                  background: activeFilter === tab ? "rgba(255,255,255,0.25)" : "#F2F4F6",
                  color: activeFilter === tab ? "#FFFFFF" : "#495057",
                }}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Bulk actions bar ── */}
        {selected.length > 0 && (
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "#EAF4FB", border: "1px solid #2C9DD5" }}
          >
            <span className="text-sm font-semibold" style={{ color: "#2C9DD5" }}>
              {selected.length} listing{selected.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: "#2C9DD5", color: "#FFFFFF" }}>
                Approve Selected
              </button>
              <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: "#FFFFFF", color: "#BA0D0B", border: "1px solid #BA0D0B" }}>
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* ── Table ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F2F4F6", borderBottom: "1px solid #E5E8EB" }}>
                  <th className="px-5 py-3.5 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded cursor-pointer accent-[#2C9DD5]"
                    />
                  </th>
                  <th className="px-3 py-3.5 text-left font-bold" style={{ color: "#15191C" }}>Property</th>
                  <th className="px-3 py-3.5 text-left font-bold hidden md:table-cell" style={{ color: "#15191C" }}>Type</th>
                  <th className="px-3 py-3.5 text-left font-bold" style={{ color: "#15191C" }}>Price</th>
                  <th className="px-3 py-3.5 text-left font-bold hidden lg:table-cell" style={{ color: "#15191C" }}>Posted By</th>
                  <th className="px-3 py-3.5 text-left font-bold hidden lg:table-cell" style={{ color: "#15191C" }}>Views</th>
                  <th className="px-3 py-3.5 text-left font-bold" style={{ color: "#15191C" }}>Status</th>
                  <th className="px-3 py-3.5 text-left font-bold hidden md:table-cell" style={{ color: "#15191C" }}>Date</th>
                  <th className="px-5 py-3.5 text-right font-bold" style={{ color: "#15191C" }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((listing, i) => (
                  <tr
                    key={listing.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F2F4F6" : "none" }}
                    className="transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.background = "#FAFBFC"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td className="px-5 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.includes(listing.id)}
                        onChange={() => toggleSelect(listing.id)}
                        className="w-4 h-4 rounded cursor-pointer accent-[#2C9DD5]"
                      />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                          style={{ background: "#F2F4F6" }}
                        >
                          {listing.image}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate" style={{ color: "#15191C" }}>{listing.title}</p>
                          <p className="text-xs truncate" style={{ color: "#495057" }}>{listing.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 hidden md:table-cell" style={{ color: "#495057" }}>{listing.type}</td>
                    <td className="px-3 py-3.5 font-bold" style={{ color: "#15191C" }}>{listing.price}</td>
                    <td className="px-3 py-3.5 hidden lg:table-cell" style={{ color: "#495057" }}>{listing.postedBy}</td>
                    <td className="px-3 py-3.5 hidden lg:table-cell" style={{ color: "#495057" }}>{listing.views.toLocaleString()}</td>
                    <td className="px-3 py-3.5"><StatusBadge status={listing.status} /></td>
                    <td className="px-3 py-3.5 hidden md:table-cell" style={{ color: "#495057" }}>{listing.date}</td>
                    <td className="px-5 py-3.5 text-right"><ActionMenu listing={listing} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm font-bold" style={{ color: "#15191C" }}>No listings found</p>
              <p className="text-xs mt-1" style={{ color: "#495057" }}>Try adjusting your search or filter</p>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderTop: "1px solid #E5E8EB" }}
            >
              <p className="text-xs" style={{ color: "#495057" }}>
                Showing <span className="font-semibold" style={{ color: "#15191C" }}>{filtered.length}</span> of{" "}
                <span className="font-semibold" style={{ color: "#15191C" }}>{LISTINGS.length}</span> listings
              </p>
              <div className="flex gap-1.5">
                <button className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center" style={{ background: "#F2F4F6", color: "#495057" }}>‹</button>
                <button className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center" style={{ background: "#2C9DD5", color: "#FFFFFF" }}>1</button>
                <button className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center" style={{ background: "#F2F4F6", color: "#495057" }}>2</button>
                <button className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center" style={{ background: "#F2F4F6", color: "#495057" }}>›</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
