import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { fetchMyListings, deleteListing } from "../lib/listings";

const STATUS_STYLES = {
  Live: { bg: "#EAF8EC", color: "#16a34a", note: "Live on the public site." },
  Pending: { bg: "#FDF1E5", color: "#E87C02", note: "Waiting for admin review — usually within 24 hours." },
  Flagged: { bg: "#FCEAEA", color: "#BA0D0B", note: "Flagged for review. Contact us if you think this is a mistake." },
  Rejected: { bg: "#F2F4F6", color: "#495057", note: "Not approved. Contact us for details." },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>{status}</span>;
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function MyProperties({ onNavigate }) {
  const { session, isLoggedIn } = useAuth();
  const [listings, setListings] = useState(null); // null = loading
  const [confirmWithdrawId, setConfirmWithdrawId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  async function load() {
    const { data } = await fetchMyListings(session.user.id);
    setListings(data);
  }

  async function handleWithdraw(listing) {
    setBusyId(listing.id);
    await deleteListing(listing.dbId, listing.images);
    await load();
    setConfirmWithdrawId(null);
    setBusyId(null);
  }

  function openProperty(listing) {
    onNavigate && onNavigate("property-detail", { property: listing, pool: listings || [] });
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-4xl mb-4">🏷️</span>
        <p className="text-lg font-bold mb-2" style={{ color: "#15191C" }}>Log in to see your properties</p>
        <p className="text-sm mb-5" style={{ color: "#495057" }}>Track the properties you've posted and their review status.</p>
        <button onClick={() => onNavigate && onNavigate("home")} className="px-6 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#BA0D0B", color: "#FFFFFF" }}>
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFFFF" }} className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#15191C" }}>My Properties</h1>
            <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
          </div>
          <button onClick={() => onNavigate && onNavigate("post-property")} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#BA0D0B", color: "#FFFFFF" }}>
            + Post a Property
          </button>
        </div>

        {listings === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => <div key={i} className="rounded-2xl h-56 animate-pulse" style={{ background: "#F2F4F6" }} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl flex flex-col items-center justify-center py-20 text-center" style={{ background: "#F7F8FA", border: "1px solid #E5E8EB" }}>
            <span className="text-5xl mb-4">🏠</span>
            <p className="text-base font-bold mb-1" style={{ color: "#15191C" }}>You haven't posted any properties yet</p>
            <p className="text-sm mb-5" style={{ color: "#495057" }}>List your property for free — it takes just a couple of minutes.</p>
            <button onClick={() => onNavigate && onNavigate("post-property")} className="px-6 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#BA0D0B", color: "#FFFFFF" }}>
              Post a Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing) => {
              const statusInfo = STATUS_STYLES[listing.moderationStatus] || STATUS_STYLES.Pending;
              return (
                <div key={listing.id} className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB", opacity: busyId === listing.id ? 0.5 : 1 }}>
                  <button
                    onClick={() => listing.moderationStatus === "Live" && openProperty(listing)}
                    className="w-full h-36 bg-cover bg-center block"
                    style={{ backgroundImage: `url(${listing.images?.[0]})`, background: listing.images?.[0] ? undefined : "#F2F4F6", cursor: listing.moderationStatus === "Live" ? "pointer" : "default" }}
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-bold truncate" style={{ color: "#15191C" }}>{listing.title}</p>
                      <StatusBadge status={listing.moderationStatus} />
                    </div>
                    <p className="text-xs mb-1 truncate" style={{ color: "#495057" }}>{listing.location}</p>
                    <p className="text-base font-extrabold mb-2" style={{ color: "#2C9DD5" }}>{listing.price}</p>
                    <p className="text-xs mb-3" style={{ color: "#495057" }}>{statusInfo.note}</p>

                    <div className="flex gap-2">
                      {listing.moderationStatus === "Live" && (
                        <button onClick={() => openProperty(listing)} className="flex-1 py-2 rounded-lg text-xs font-bold" style={{ background: "#EAF4FB", color: "#2C9DD5" }}>
                          View Listing
                        </button>
                      )}
                      {listing.moderationStatus === "Pending" && (
                        confirmWithdrawId === listing.id ? (
                          <div className="flex gap-2 flex-1">
                            <button onClick={() => handleWithdraw(listing)} className="flex-1 py-2 rounded-lg text-xs font-bold" style={{ background: "#BA0D0B", color: "#FFFFFF" }}>
                              Confirm
                            </button>
                            <button onClick={() => setConfirmWithdrawId(null)} className="flex-1 py-2 rounded-lg text-xs font-bold" style={{ background: "#F2F4F6", color: "#495057" }}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmWithdrawId(listing.id)} className="flex-1 py-2 rounded-lg text-xs font-bold" style={{ background: "#FCEAEA", color: "#BA0D0B" }}>
                            Withdraw
                          </button>
                        )
                      )}
                      {(listing.moderationStatus === "Flagged" || listing.moderationStatus === "Rejected") && (
                        <button onClick={() => onNavigate && onNavigate("contact", "other")} className="flex-1 py-2 rounded-lg text-xs font-bold" style={{ background: "#F2F4F6", color: "#495057" }}>
                          Contact Support
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
