import { useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const BLOG_CATEGORIES = [
  { label: "All", icon: "🏠" },
  { label: "Buying Guide", icon: "🔑" },
  { label: "Investment Insights", icon: "📈" },
  { label: "Project Reviews", icon: "🏢" },
  { label: "Home & Lifestyle", icon: "🛋️" },
  { label: "Market Reports", icon: "📊" },
];

const FEATURED_ARTICLE = {
  id: 0,
  category: "Market Reports",
  categoryColor: "bg-blue-600",
  title: "Ranchi Real Estate 2025: Market Trends, Growth Corridors & Investment Hotspots",
  excerpt:
    "Ranchi's real estate market is witnessing unprecedented growth driven by infrastructure development, smart city initiatives, and rising demand from IT professionals and NRIs. Here's everything you need to know before investing.",
  author: "Aarav Mishra",
  authorRole: "Senior Market Analyst",
  date: "June 12, 2025",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=460&fit=crop",
  tags: ["Market Trends", "Investment", "Ranchi"],
};

const BLOG_POSTS = [
  {
    id: 1,
    category: "Buying Guide",
    categoryColor: "bg-[#16a34a]",
    title: "First-Time Home Buyer's Complete Guide for 2025",
    excerpt: "Everything you need to know about buying your first home — from loan eligibility to registration.",
    author: "Priya Verma",
    date: "June 10, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=240&fit=crop",
    tags: ["Home Loan", "RERA", "First-Time Buyer"],
    views: "12.4K",
  },
  {
    id: 2,
    category: "Investment Insights",
    categoryColor: "bg-purple-600",
    title: "Top 5 High-Growth Corridors for Real Estate Investment in Jharkhand",
    excerpt: "Discover which micro-markets are delivering the best appreciation and rental yields right now.",
    author: "Rohit Sharma",
    date: "June 8, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=240&fit=crop",
    tags: ["ROI", "Rental Yield", "Appreciation"],
    views: "9.1K",
  },
  {
    id: 3,
    category: "Home & Lifestyle",
    categoryColor: "bg-[#1a0f00]0",
    title: "Vastu Tips for Your New Home: A Practical 2025 Guide",
    excerpt: "Modern Vastu principles that work with contemporary architecture for positivity and prosperity.",
    author: "Sunita Nair",
    date: "June 5, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=240&fit=crop",
    tags: ["Vastu", "Interior", "Lifestyle"],
    views: "7.8K",
  },
  {
    id: 4,
    category: "Project Reviews",
    categoryColor: "bg-[#2C9DD5]",
    title: "Project Review: Emerald Heights, Kanke Road — Worth the Investment?",
    excerpt: "We visited the site, spoke to existing buyers and developers. Here's our unbiased review.",
    author: "Deepak Singh",
    date: "June 3, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=240&fit=crop",
    tags: ["Project Review", "Kanke Road", "Luxury"],
    views: "15.2K",
  },
  {
    id: 5,
    category: "Buying Guide",
    categoryColor: "bg-[#16a34a]",
    title: "Home Loan Documents Checklist: Everything Banks Need in 2025",
    excerpt: "A complete list of documents required for home loan approval with tips to speed up the process.",
    author: "Kavitha Menon",
    date: "June 1, 2025",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=240&fit=crop",
    tags: ["Home Loan", "Documentation", "Banks"],
    views: "8.3K",
  },
  {
    id: 6,
    category: "Market Reports",
    categoryColor: "bg-blue-600",
    title: "Smart City Impact: How Infrastructure is Driving Property Values in Ranchi",
    excerpt: "New roads, metro plans, and smart city projects are reshaping real estate micro-markets.",
    author: "Aarav Mishra",
    date: "May 28, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=240&fit=crop",
    tags: ["Infrastructure", "Smart City", "Growth"],
    views: "11.6K",
  },
];

const NEWS_ITEMS = [
  {
    id: 1,
    tag: "Policy",
    tagColor: "bg-blue-100 text-[#2C9DD5]",
    headline: "Govt extends PMAY subsidy for affordable housing till March 2026",
    time: "2 hours ago",
    source: "Economic Times",
  },
  {
    id: 2,
    tag: "Infrastructure",
    tagColor: "bg-green-100 text-[#4ade80]",
    headline: "Ranchi Ring Road Phase 2 approved — 18 new localities to benefit",
    time: "5 hours ago",
    source: "Times of India",
  },
  {
    id: 3,
    tag: "Market",
    tagColor: "bg-purple-100 text-purple-700",
    headline: "Residential property registrations up 22% in Jharkhand Q1 2025",
    time: "Yesterday",
    source: "PropertyBrands Research",
  },
  {
    id: 4,
    tag: "RERA",
    tagColor: "bg-orange-100 text-orange-700",
    headline: "Jharkhand RERA registers 340 new projects in 2025, highest ever",
    time: "2 days ago",
    source: "Jharkhand RERA",
  },
  {
    id: 5,
    tag: "Rates",
    tagColor: "bg-[#1a0a0a] text-[#BA0D0B]",
    headline: "RBI holds repo rate; home loan EMIs to remain stable in Q2 2025",
    time: "3 days ago",
    source: "RBI",
  },
];

const QUICK_GUIDES = [
  { icon: "📋", label: "How to Buy a Property", link: "#" },
  { icon: "🏦", label: "Apply for Home Loan", link: "#" },
  { icon: "📝", label: "Property Registration Process", link: "#" },
  { icon: "🔍", label: "What is RERA?", link: "#" },
  { icon: "💰", label: "How to Calculate EMI", link: "#" },
  { icon: "🏠", label: "How to Rent a Property", link: "#" },
];

// ── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ post }) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="bg-[#161616] rounded-xl border border-[#2a2a2a] overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group flex flex-col">
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
          onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#161616]/90 flex items-center justify-center hover:scale-110 transition"
        >
          <svg
            className={`w-3.5 h-3.5 ${bookmarked ? "fill-[#2C9DD5] text-[#2C9DD5]" : "fill-none text-[#A5AEB5]"}`}
            stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#F2F4F5] leading-snug mb-2 group-hover:text-[#2C9DD5] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-xs text-[#A5AEB5] leading-relaxed mb-3 line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] bg-[#1e1e1e] text-[#A5AEB5] px-2 py-0.5 rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2C9DD5] to-[#BA0D0B] flex items-center justify-center text-white text-[8px] font-bold">
              {post.author.charAt(0)}
            </div>
            <span className="text-[10px] text-[#A5AEB5] font-medium">{post.author}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#A5AEB5]">
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
    <div className="relative rounded-2xl overflow-hidden cursor-pointer group h-72">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={`${article.categoryColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
            {article.category}
          </span>
          <span className="text-[#A5AEB5] text-[10px]">{article.date}</span>
          <span className="text-[#A5AEB5] text-[10px]">·</span>
          <span className="text-[#A5AEB5] text-[10px]">{article.readTime}</span>
        </div>
        <h2 className="text-white text-lg font-extrabold leading-snug mb-2 line-clamp-2 group-hover:text-[#E87C02] transition-colors">
          {article.title}
        </h2>
        <p className="text-[#A5AEB5] text-xs leading-relaxed line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2C9DD5] to-[#BA0D0B] flex items-center justify-center text-white text-[9px] font-bold">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="text-white text-[11px] font-semibold">{article.author}</p>
              <p className="text-[#A5AEB5] text-[10px]">{article.authorRole}</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-[#161616]/10 hover:bg-[#161616]/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 transition">
            Read Full Article
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── News Feed ─────────────────────────────────────────────────────────────────
function NewsFeed() {
  return (
    <div className="bg-[#161616] rounded-2xl border border-[#2a2a2a] overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#2C9DD5] rounded-full animate-pulse" />
          <h3 className="text-sm font-bold text-[#F2F4F5]">Live Market News</h3>
        </div>
        <a href="#" className="text-xs font-semibold text-[#2C9DD5] hover:underline">View all</a>
      </div>

      {/* News items */}
      <div className="divide-y divide-gray-50">
        {NEWS_ITEMS.map((item) => (
          <div key={item.id} className="px-5 py-3.5 hover:bg-[#0B0B0B] transition cursor-pointer group">
            <div className="flex items-start gap-3">
              <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${item.tagColor}`}>
                {item.tag}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#F2F4F5] leading-snug group-hover:text-[#2C9DD5] transition line-clamp-2">
                  {item.headline}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-[#A5AEB5]">{item.time}</span>
                  <span className="text-[#A5AEB5] text-[10px]">·</span>
                  <span className="text-[10px] text-[#A5AEB5] font-medium">{item.source}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscribe */}
      <div className="px-5 py-4 bg-[#0B0B0B] border-t border-[#2a2a2a]">
        <p className="text-xs font-semibold text-[#EDEFF2] mb-2">Get daily market updates</p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 text-xs border border-[#2a2a2a] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2C9DD5] bg-[#161616]"
          />
          <button className="bg-[#BA0D0B] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#5C0B03] transition shrink-0">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function BlogInsights() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  return (
    <section className="bg-[#0B0B0B] py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Section Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#F2F4F5]">
              Latest Insights & Trends
            </h2>
            <div className="w-10 h-0.5 bg-[#2C9DD5] rounded-full mt-1" />
            <p className="text-[#A5AEB5] text-sm mt-1">
              Stay updated with real estate news, guides & market intelligence
            </p>
          </div>
          <a href="#" className="flex items-center gap-1 text-sm font-semibold text-[#2C9DD5] hover:underline">
            View all articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* ── Category Filter ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat.label
                  ? "bg-[#2C9DD5] text-white border-[#2C9DD5] shadow-sm"
                  : "bg-[#161616] text-[#A5AEB5] border-[#2a2a2a] hover:border-[#2C9DD5] hover:text-[#2C9DD5]"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Featured Article + News Feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FeaturedArticle article={FEATURED_ARTICLE} />
          </div>
          <div className="lg:col-span-1">
            <NewsFeed />
          </div>
        </div>

        {/* ── Blog Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#A5AEB5]">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm font-medium">No articles in this category yet.</p>
          </div>
        )}

        {/* ── Quick Guides Strip ── */}
        <div className="bg-[#161616] rounded-2xl border border-[#2a2a2a] p-6">
          <h3 className="text-base font-bold text-[#F2F4F5] mb-4">
            Quick Guides — Common Questions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_GUIDES.map((g) => (
              <a
                key={g.label}
                href={g.link}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#2a2a2a] hover:border-[#2C9DD5] hover:bg-[#1a0a0a] transition group"
              >
                <span className="text-xl shrink-0">{g.icon}</span>
                <span className="text-sm font-semibold text-[#EDEFF2] group-hover:text-[#2C9DD5] transition leading-snug">
                  {g.label}
                </span>
                <svg className="w-4 h-4 text-[#A5AEB5] group-hover:text-[#2C9DD5] ml-auto shrink-0 transition" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* ── Newsletter CTA ── */}
        <div className="bg-gradient-to-r from-[#2C9DD5] to-[#5C0B03] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-extrabold text-xl leading-tight mb-1">
              Stay Ahead of the Market
            </p>
            <p className="text-[#A5AEB5] text-sm">
              Get weekly insights on property trends, investment opportunities & new project launches — straight to your inbox.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-64 text-sm border-0 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2C9DD5]/50 bg-[#161616]/20 text-white placeholder-[#A5AEB5]"
            />
            <button className="bg-[#161616] text-[#2C9DD5] text-sm font-bold px-5 py-3 rounded-lg hover:bg-[#1e1e1e] transition shrink-0 shadow">
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
