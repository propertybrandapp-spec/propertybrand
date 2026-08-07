import { useState, useEffect } from "react";
import { fetchPublicPosts } from "../lib/blogPosts";
import { useSavedItems } from "../lib/SavedItemsContext";
import { Home, Key, TrendingUp, Building2, Sofa, BarChart3, ClipboardList, Landmark, PenLine, Search, DollarSign, Newspaper, Inbox } from "lucide-react";

// ── Static content (categories for the filter UI, market news ticker) ───────

const BLOG_CATEGORIES = [
  { label: "All", icon: Home },
  { label: "Buying Guide", icon: Key },
  { label: "Investment Insights", icon: TrendingUp },
  { label: "Project Reviews", icon: Building2 },
  { label: "Home & Lifestyle", icon: Sofa },
  { label: "Market Reports", icon: BarChart3 },
];

const NEWS_ITEMS = [
  {
    id: 1,
    tag: "Policy",
    tagColor: "bg-blue-100 text-[#1565C0]",
    headline: "Govt extends PMAY subsidy for affordable housing till March 2026",
    time: "2 hours ago",
    source: "Economic Times",
  },
  {
    id: 2,
    tag: "Infrastructure",
    tagColor: "bg-green-100 text-[#4ade80]",
    headline: "Bhubaneswar Ring Road Phase 2 approved — 18 new localities to benefit",
    time: "5 hours ago",
    source: "Times of India",
  },
  {
    id: 3,
    tag: "Market",
    tagColor: "bg-purple-100 text-purple-700",
    headline: "Residential property registrations up 22% in Odisha Q1 2025",
    time: "Yesterday",
    source: "PropertyBrands Research",
  },
  {
    id: 4,
    tag: "RERA",
    tagColor: "bg-orange-100 text-orange-700",
    headline: "Odisha RERA registers 340 new projects in 2025, highest ever",
    time: "2 days ago",
    source: "Odisha RERA",
  },
  {
    id: 5,
    tag: "Rates",
    tagColor: "bg-[#FEE2E2] text-[#DC2626]",
    headline: "RBI holds repo rate; home loan EMIs to remain stable in Q2 2025",
    time: "3 days ago",
    source: "RBI",
  },
];

const QUICK_GUIDES = [
  { icon: ClipboardList, label: "How to Buy a Property", page: "faq" },
  { icon: Landmark, label: "Apply for Home Loan", page: "faq" },
  { icon: PenLine, label: "Property Registration Process", page: "faq" },
  { icon: Search, label: "What is RERA?", page: "faq" },
  { icon: DollarSign, label: "How to Calculate EMI", page: "faq" },
  { icon: Home, label: "How to Rent a Property", page: "faq" },
];

// ── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ post }) {
  const { isPostSaved, toggleSavePost } = useSavedItems();
  const bookmarked = isPostSaved(post.dbId || post.id);

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 ${post.categoryColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
          {post.category}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleSavePost(post); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#FFFFFF]/90 flex items-center justify-center hover:scale-110 transition"
        >
          <svg
            className={`w-3.5 h-3.5 ${bookmarked ? "fill-[#1565C0] text-[#1565C0]" : "fill-none text-[#6B7280]"}`}
            stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#1F2937] leading-snug mb-2 group-hover:text-[#1565C0] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-xs text-[#6B7280] leading-relaxed mb-3 line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] bg-[#F1F5F9] text-[#6B7280] px-2 py-0.5 rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#1565C0] to-[#1565C0] flex items-center justify-center text-white text-[8px] font-bold">
              {post.author.charAt(0)}
            </div>
            <span className="text-[10px] text-[#6B7280] font-medium">{post.author}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#6B7280]">
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readTime}
            </span>
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Featured Article ──────────────────────────────────────────────────────────
function FeaturedArticle({ article }) {
  return (
    <div className="relative h-72 overflow-hidden rounded-3xl border border-slate-200 shadow-lg cursor-pointer group bg-white">
      
      {/* Image */}
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/95 via-[#1F2937]/55 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`${article.categoryColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm`}
          >
            {article.category}
          </span>

          <span className="text-slate-300 text-[10px]">
            {article.date}
          </span>

          <span className="text-slate-400 text-[10px]">•</span>

          <span className="text-slate-300 text-[10px]">
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-white text-xl font-extrabold leading-snug mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-[#1565C0]">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="text-slate-300 text-xs leading-relaxed line-clamp-2 mb-4">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1565C0] to-[#F59E0B] flex items-center justify-center text-white text-[10px] font-bold shadow-md">
              {article.author.charAt(0)}
            </div>

            <div>
              <p className="text-white text-xs font-semibold">
                {article.author}
              </p>

              <p className="text-slate-400 text-[10px]">
                {article.authorRole || "Contributor"}
              </p>
            </div>
          </div>

          {/* CTA */}
          <button className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#1565C0] hover:bg-[#1565C0]">
            Read Full Article

            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
}

// ── News Feed ─────────────────────────────────────────────────────────────────
function NewsFeed({ onNavigate }) {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#1565C0] rounded-full animate-pulse" />
          <h3 className="text-sm font-bold text-[#1F2937]">Live Market News</h3>
        </div>
        <button onClick={() => onNavigate && onNavigate("blog")} className="text-xs font-semibold text-[#1565C0] hover:underline">View all</button>
      </div>

      {/* News items */}
      <div className="divide-y divide-gray-50">
        {NEWS_ITEMS.map((item) => (
          <div key={item.id} className="px-5 py-3.5 hover:bg-[#FFFFFF] transition cursor-pointer group">
            <div className="flex items-start gap-3">
              <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${item.tagColor}`}>
                {item.tag}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#1F2937] leading-snug group-hover:text-[#1565C0] transition line-clamp-2">
                  {item.headline}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-[#6B7280]">{item.time}</span>
                  <span className="text-[#6B7280] text-[10px]">·</span>
                  <span className="text-[10px] text-[#6B7280] font-medium">{item.source}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscribe */}
      <div className="px-5 py-4 bg-[#FFFFFF] border-t border-[#E2E8F0]">
        <p className="text-xs font-semibold text-[#1F2937] mb-2">Get daily market updates</p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 text-xs border border-[#E2E8F0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#1565C0] bg-[#FFFFFF]"
          />
          <button className="bg-[#1565C0] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#0D47A1] transition shrink-0">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function BlogInsights({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [dbPosts, setDbPosts] = useState(null); // null = still loading, [] = loaded but empty

  useEffect(() => {
    let cancelled = false;
    fetchPublicPosts().then(({ data }) => {
      if (!cancelled) setDbPosts(data);
    });
    return () => { cancelled = true; };
  }, []);

  const isLoading = dbPosts === null;
  const posts = dbPosts || [];
  const featuredArticle = posts[0] || null;
  const gridPosts = posts.slice(1);

  const filtered =
    activeCategory === "All"
      ? gridPosts
      : gridPosts.filter((p) => p.category === activeCategory);

  return (
    <section className="bg-[#FFFFFF] py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Section Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">
              Latest Insights & Trends
            </h2>
            <div className="w-10 h-0.5 bg-[#1565C0] rounded-full mt-1" />
            <p className="text-[#6B7280] text-sm mt-1">
              Stay updated with real estate news, guides & market intelligence
            </p>
          </div>
          <button onClick={() => onNavigate && onNavigate("blog")} className="flex items-center gap-1 text-sm font-semibold text-[#1565C0] hover:underline">
            View all articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ── Category Filter ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat.label
                  ? "bg-[#1565C0] text-white border-[#1565C0] shadow-sm"
                  : "bg-[#FFFFFF] text-[#6B7280] border-[#E2E8F0] hover:border-[#1565C0] hover:text-[#1565C0]"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" strokeWidth={2.5} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Featured Article + News Feed ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 rounded-2xl animate-pulse" style={{ background: "#F1F5F9" }} />
            <div className="lg:col-span-1 h-80 rounded-2xl animate-pulse" style={{ background: "#F1F5F9" }} />
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl flex flex-col items-center justify-center py-20 text-center" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <span className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: "#EFF6FF" }}>
              <Newspaper className="w-7 h-7" style={{ color: "#1565C0" }} strokeWidth={2} />
            </span>
            <p className="text-sm font-bold" style={{ color: "#1F2937" }}>No articles published yet</p>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Check back soon for real estate news, guides & market insights.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FeaturedArticle article={featuredArticle} />
              </div>
              <div className="lg:col-span-1">
                <NewsFeed onNavigate={onNavigate} />
              </div>
            </div>

            {/* ── Blog Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-[#6B7280]">
                <Inbox className="w-10 h-10 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm font-medium">No articles in this category yet.</p>
              </div>
            )}
          </>
        )}

        {/* ── Quick Guides Strip ── */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6">
          <h3 className="text-base font-bold text-[#1F2937] mb-4">
            Quick Guides — Common Questions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_GUIDES.map((g) => (
              <button
                key={g.label}
                onClick={() => onNavigate && onNavigate(g.page)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:border-[#1565C0] hover:bg-[#EFF6FF] transition group text-left w-full"
              >
                <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EFF6FF" }}>
                  <g.icon className="w-[18px] h-[18px]" style={{ color: "#1565C0" }} strokeWidth={2} />
                </span>
                <span className="text-sm font-semibold text-[#1F2937] group-hover:text-[#1565C0] transition leading-snug">
                  {g.label}
                </span>
                <svg className="w-4 h-4 text-[#6B7280] group-hover:text-[#1565C0] ml-auto shrink-0 transition" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* ── Newsletter CTA ── */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(21,101,192,0.08),_transparent_35%),linear-gradient(to_bottom_right,#ffffff,#f8fafc)] p-8 shadow-lg">

  {/* Decorative Glow */}
  <div className="absolute -top-16 -right-16 w-48 h-48 bg-sky-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

  <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
    
    {/* Content */}
    <div className="max-w-xl">
      <span className="text-[#1565C0] text-xs font-bold uppercase tracking-widest">
        Newsletter
      </span>

      <p className="text-[#1F2937] font-extrabold text-2xl leading-tight mt-2 mb-2">
        Stay Ahead of the Market
      </p>

      <p className="text-slate-600 text-sm leading-relaxed">
        Get weekly insights on property trends, investment opportunities,
        market analysis, and new project launches delivered directly to your
        inbox.
      </p>
    </div>

    {/* Form */}
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
      
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full md:w-72 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#1F2937] shadow-sm transition-all focus:border-[#1565C0] focus:outline-none focus:ring-4 focus:ring-sky-100"
      />

      <button className="rounded-xl bg-[#1565C0] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#0D47A1] hover:shadow-lg">
        Subscribe
      </button>

    </div>
  </div>
</div>

      </div>
    </section>
  );
}
