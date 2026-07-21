import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { useSavedItems } from "../lib/SavedItemsContext";
import { fetchListingsByIds } from "../lib/listings";
import { fetchPostsByIds } from "../lib/blogPosts";

// ── Main Export ───────────────────────────────────────────────────────────────
export default function SavedProperties({ onNavigate }) {
  const { session } = useAuth();
  const { savedPropertyIds, savedPostIds, toggleSaveProperty, toggleSavePost, loading: idsLoading } = useSavedItems();
  const [tab, setTab] = useState("properties"); // properties | articles
  const [properties, setProperties] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (idsLoading) return;
    let cancelled = false;
    setLoadingItems(true);
    Promise.all([
      fetchListingsByIds([...savedPropertyIds]),
      fetchPostsByIds([...savedPostIds]),
    ]).then(([propRes, postRes]) => {
      if (cancelled) return;
      setProperties(propRes.data);
      setPosts(postRes.data);
      setLoadingItems(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsLoading, savedPropertyIds.size, savedPostIds.size]);

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-bold mb-2" style={{ color: "#15191C" }}>You're not logged in</p>
        <p className="text-sm mb-5" style={{ color: "#495057" }}>Log in to view properties and articles you've saved.</p>
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

  const loading = idsLoading || loadingItems;

  function openProperty(property) {
    onNavigate && onNavigate("property-detail", { property, pool: properties });
  }

  return (
    <div style={{ background: "#FFFFFF" }} className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#15191C" }}>Saved Items</h1>
          <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setTab("properties")}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={{
              background: tab === "properties" ? "#2C9DD5" : "#F2F4F6",
              color: tab === "properties" ? "#FFFFFF" : "#495057",
            }}
          >
            ❤️ Properties <span className="text-xs opacity-80">({savedPropertyIds.size})</span>
          </button>
          <button
            onClick={() => setTab("articles")}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={{
              background: tab === "articles" ? "#2C9DD5" : "#F2F4F6",
              color: tab === "articles" ? "#FFFFFF" : "#495057",
            }}
          >
            🔖 Articles <span className="text-xs opacity-80">({savedPostIds.size})</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl h-56 animate-pulse" style={{ background: "#F2F4F6" }} />
            ))}
          </div>

        ) : tab === "properties" ? (
          properties.length === 0 ? (
            <EmptyState
              icon="❤️"
              title="No saved properties yet"
              subtitle="Tap the heart icon on any listing to save it here."
              ctaLabel="Browse Properties"
              onCta={() => onNavigate && onNavigate("search")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property) => (
                <div key={property.id} className="rounded-2xl overflow-hidden transition-shadow hover:shadow-lg cursor-pointer" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
                  onClick={() => openProperty(property)}>
                  <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${property.images?.[0]})`, background: "#F2F4F6" }} />
                  <div className="p-4">
                    <p className="text-sm font-bold mb-1 truncate" style={{ color: "#15191C" }}>{property.title}</p>
                    <p className="text-xs mb-2 truncate" style={{ color: "#495057" }}>{property.location}</p>
                    <p className="text-base font-extrabold mb-3" style={{ color: "#2C9DD5" }}>{property.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openProperty(property); }}
                        className="flex-1 py-2 rounded-lg text-xs font-bold"
                        style={{ background: "#EAF4FB", color: "#2C9DD5" }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSaveProperty(property); }}
                        className="px-3 py-2 rounded-lg text-xs font-bold"
                        style={{ background: "#FCEAEA", color: "#BA0D0B" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )

        ) : (
          posts.length === 0 ? (
            <EmptyState
              icon="🔖"
              title="No saved articles yet"
              subtitle="Tap the bookmark icon on any article to save it here."
              ctaLabel="Browse Articles"
              onCta={() => onNavigate && onNavigate("blog")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <div key={post.id} className="rounded-2xl overflow-hidden transition-shadow hover:shadow-lg" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
                  <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }} />
                  <div className="p-4">
                    <span className={`${post.categoryColor} inline-block text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2`}>{post.category}</span>
                    <p className="text-sm font-bold mb-2 line-clamp-2" style={{ color: "#15191C" }}>{post.title}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate && onNavigate("blog")}
                        className="flex-1 py-2 rounded-lg text-xs font-bold"
                        style={{ background: "#EAF4FB", color: "#2C9DD5" }}
                      >
                        Read Article
                      </button>
                      <button
                        onClick={() => toggleSavePost(post)}
                        className="px-3 py-2 rounded-lg text-xs font-bold"
                        style={{ background: "#FCEAEA", color: "#BA0D0B" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle, ctaLabel, onCta }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl" style={{ background: "#F7F8FA", border: "1px solid #E5E8EB" }}>
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-base font-bold mb-1" style={{ color: "#15191C" }}>{title}</p>
      <p className="text-sm mb-5" style={{ color: "#495057" }}>{subtitle}</p>
      <button
        onClick={onCta}
        className="px-6 py-2.5 rounded-xl text-sm font-bold"
        style={{ background: "#BA0D0B", color: "#FFFFFF" }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
