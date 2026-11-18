import { supabase, safeQuery } from "./supabaseClient";

// ── Blog Posts Data Layer ─────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  "Buying Guide": "bg-[#16A34A]",
  "Investment Insights": "bg-purple-600",
  "Project Reviews": "bg-[#a78bfa]",
  "Home & Lifestyle": "bg-[#F59E0B]",
  "Market Reports": "bg-blue-600",
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=240&fit=crop";

function formatViews(n) {
  const v = n || 0;
  return v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v);
}

export function normalizePost(row) {
  const displayDate = row.published_at || row.created_at;
  return {
    id: row.id,
    dbId: row.id,
    category: row.category,
    categoryColor: CATEGORY_COLORS[row.category] || "bg-slate-600",
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    content: row.content || "",
    author: row.author_name,
    date: displayDate ? new Date(displayDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "",
    readTime: row.read_time_minutes ? `${row.read_time_minutes} min read` : "5 min read",
    image: row.cover_image_url || PLACEHOLDER_IMAGE,
    tags: row.tags || [],
    views: formatViews(row.views),
    viewsRaw: row.views || 0,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

export function denormalizePost(f) {
  return {
    title: f.title,
    slug: f.slug || slugify(f.title),
    category: f.category,
    excerpt: f.excerpt || null,
    content: f.content || null,
    author_name: f.author,
    cover_image_url: f.image || null,
    tags: f.tags || [],
    read_time_minutes: f.readTimeMinutes ? Number(f.readTimeMinutes) : null,
    status: f.status || "Draft",
    published_at: f.status === "Published" ? (f.publishedAt || new Date().toISOString()) : f.publishedAt || null,
    updated_at: new Date().toISOString(),
  };
}

export function slugify(title) {
  return (title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const DEFAULT_PUBLIC_POSTS = [
  {
    id: "blog-1",
    dbId: "blog-1",
    category: "Buying Guide",
    categoryColor: "bg-[#16A34A]",
    title: "The Ultimate 2026 Homebuyer's Due Diligence & RERA Checklist",
    slug: "homebuyers-rera-due-diligence-checklist-2026",
    excerpt: "Before issuing any token advance, learn how to audit 30-year encumbrance certificates, approved sanction plans, and RERA delivery dates.",
    content: "Purchasing a home is one of the most substantial financial commitments in an individual's lifetime. In 2026, real estate due diligence demands examining RERA quarterly compliance filings, municipal layout approvals, and title deed chains...",
    author: "Pranay Prateek",
    date: "November 15, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
    tags: ["Buying Guide", "RERA", "Legal Due Diligence"],
    views: "2.4K",
    status: "Published",
  },
  {
    id: "blog-2",
    dbId: "blog-2",
    category: "Investment Insights",
    categoryColor: "bg-purple-600",
    title: "Top 5 High-Appreciation Real Estate Corridors & Yield Analysis",
    slug: "top-high-appreciation-corridors-yield-analysis",
    excerpt: "Exploring metro fringe expansions, upcoming ring roads, and institutional infrastructure projects driving double-digit capital appreciation.",
    content: "Infrastructure projects such as outer ring roads, IT corridors, and healthcare clusters continue to dictate property appreciation trajectories...",
    author: "Advisory Research Team",
    date: "November 10, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    tags: ["Investment", "High Growth", "Rental Yield"],
    views: "3.8K",
    status: "Published",
  },
  {
    id: "blog-3",
    dbId: "blog-3",
    category: "Home & Lifestyle",
    categoryColor: "bg-[#F59E0B]",
    title: "Scientific Vastu Principles for Modern Apartments & High-Rise Towers",
    slug: "scientific-vastu-principles-modern-apartments",
    excerpt: "How to assess entrance facing, elemental balancing, and room layouts without resorting to destructive structural modifications.",
    content: "Vastu Shastra in modern multi-storey apartments focuses on harmonic spatial orientation, master bedroom placement in the South-West, kitchen placement in Agni corner...",
    author: "Vedic Design Consultant",
    date: "November 05, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    tags: ["Vastu", "Apartments", "Home Living"],
    views: "1.9K",
    status: "Published",
  },
  {
    id: "blog-4",
    dbId: "blog-4",
    category: "Project Reviews",
    categoryColor: "bg-[#a78bfa]",
    title: "Under-Construction vs Ready-to-Move: Financial Comparison & Tax Benefits",
    slug: "under-construction-vs-ready-to-move-comparison",
    excerpt: "Comparing GST liabilities, rental savings, tax deductions under Section 24, and construction risk factors for homebuyers.",
    content: "Choosing between an under-construction project and ready-to-move home involves weighing the 5% GST on under-construction units against the immediate rental offset of a ready property...",
    author: "Financial Advisory Cell",
    date: "October 28, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
    tags: ["Tax Benefits", "Ready to Move", "Project Reviews"],
    views: "4.1K",
    status: "Published",
  },
];

export async function fetchPublicPosts() {
  const { data, error } = await safeQuery(
    supabase
      .from("blog_posts")
      .select("*")
      .or("status.eq.Published,status.eq.published")
      .order("created_at", { ascending: false })
  );
  if (!error && data && data.length > 0) {
    return { data: data.map(normalizePost), error: null };
  }
  return { data: DEFAULT_PUBLIC_POSTS, error: null };
}

export async function fetchAdminPosts() {
  const { data, error } = await safeQuery(
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false })
  );
  if (error) return { data: [], error };
  return { data: (data || []).map(normalizePost), error: null };
}

export async function fetchPostBySlug(slug) {
  const { data, error } = await safeQuery(supabase.from("blog_posts").select("*").eq("slug", slug).single());
  if (error) return { data: null, error };
  return { data: normalizePost(data), error: null };
}

// Used by the Saved Properties page's "Articles" tab.
export async function fetchPostsByIds(ids) {
  if (!ids || ids.length === 0) return { data: [], error: null };
  const { data, error } = await safeQuery(supabase.from("blog_posts").select("*").in("id", ids));
  if (error) return { data: [], error };
  return { data: (data || []).map(normalizePost), error: null };
}

export async function createPost(post) {
  const { data, error } = await safeQuery(supabase.from("blog_posts").insert(denormalizePost(post)).select().single());
  if (error) return { data: null, error };
  return { data: normalizePost(data), error: null };
}

export async function updatePost(id, post) {
  const { data, error } = await safeQuery(
    supabase.from("blog_posts").update(denormalizePost(post)).eq("id", id).select().single()
  );
  if (error) return { data: null, error };
  return { data: normalizePost(data), error: null };
}

export async function updatePostStatus(id, status) {
  const payload = { status, updated_at: new Date().toISOString() };
  if (status === "Published") payload.published_at = new Date().toISOString();
  const { data, error } = await safeQuery(supabase.from("blog_posts").update(payload).eq("id", id).select().single());
  if (error) return { data: null, error };
  return { data: normalizePost(data), error: null };
}

export async function deletePost(id) {
  const { error } = await safeQuery(supabase.from("blog_posts").delete().eq("id", id));
  return { error };
}
