import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function SavedProperties({ onNavigate }) {
  const { session } = useAuth();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) fetchSaved();
    else setLoading(false);
  }, [session]);

  async function fetchSaved() {
    setLoading(true);
    const { data } = await supabase
      .from("saved_properties")
      .select("id, created_at, listings:listing_id ( id, title, location, price_label, image_emoji, status )")
      .eq("client_id", session.user.id)
      .order("created_at", { ascending: false });
    setSaved(data || []);
    setLoading(false);
  }

  async function handleRemove(savedId) {
    await supabase.from("saved_properties").delete().eq("id", savedId);
    setSaved((prev) => prev.filter((s) => s.id !== savedId));
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-bold mb-2" style={{ color: "#15191C" }}>You're not logged in</p>
        <p className="text-sm mb-5" style={{ color: "#495057" }}>Log in to view properties you've saved.</p>
        <button
          onClick={() => onNavigate && onNavigate("home")}
          className="px-6 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#BA0D0B", color: "#FFFFFF" }}
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFFFF" }} className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#15191C" }}>Saved Properties</h1>
          <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
          <p className="text-sm mt-3" style={{ color: "#495057" }}>
            {loading ? "Loading..." : `${saved.length} propert${saved.length === 1 ? "y" : "ies"} saved`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl h-56 animate-pulse" style={{ background: "#F2F4F6" }} />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl" style={{ background: "#F7F8FA", border: "1px solid #E5E8EB" }}>
            <span className="text-5xl mb-4">❤️</span>
            <p className="text-base font-bold mb-1" style={{ color: "#15191C" }}>No saved properties yet</p>
            <p className="text-sm mb-5" style={{ color: "#495057" }}>Tap the heart icon on any listing to save it here.</p>
            <button
              onClick={() => onNavigate && onNavigate("search")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: "#BA0D0B", color: "#FFFFFF" }}
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saved.map((item) => {
              const listing = item.listings;
              if (!listing) return null;
              return (
                <div key={item.id} className="rounded-2xl overflow-hidden transition-shadow hover:shadow-lg" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
                  <div className="h-36 flex items-center justify-center text-4xl" style={{ background: "#F2F4F6" }}>
                    {listing.image_emoji || "🏠"}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold mb-1" style={{ color: "#15191C" }}>{listing.title}</p>
                    <p className="text-xs mb-2" style={{ color: "#495057" }}>{listing.location}</p>
                    <p className="text-base font-extrabold mb-3" style={{ color: "#2C9DD5" }}>{listing.price_label}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate && onNavigate("search")}
                        className="flex-1 py-2 rounded-lg text-xs font-bold"
                        style={{ background: "#EAF4FB", color: "#2C9DD5" }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="px-3 py-2 rounded-lg text-xs font-bold"
                        style={{ background: "#FCEAEA", color: "#BA0D0B" }}
                      >
                        Remove
                      </button>
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
