import { supabase, safeQuery } from "./supabaseClient";

// ── Site Content (public, read-only) ─────────────────────────────────────────
// Powers four marketing sections that used to be hardcoded constants:
// Channel Partner tiers, client reviews, subscription/property-management
// plans, and investment opportunities. Each fetch function below returns
// whatever's active in the database — the calling component decides whether
// to fall back to bundled demo content if the table is still empty (see
// ChannelPartner.jsx, Testimonials.jsx, PropertyManagement.jsx,
// InvestmentAdvisory.jsx), the same way listings do until you've added real
// ones.

function normalizePartnerTier(row) {
  return {
    id: row.id,
    name: row.name,
    color: row.tier_color,
    borderColor: row.border_color,
    deals: row.deals_range,
    commission: row.commission,
    perks: Array.isArray(row.perks) ? row.perks : [],
    cta: row.cta_label,
    popular: row.is_popular,
  };
}

export async function fetchPartnerTiers() {
  const { data, error } = await safeQuery(
    supabase.from("partner_tiers").select("*").eq("is_active", true).order("display_order", { ascending: true })
  );
  if (error) return { data: [], error };
  return { data: (data || []).map(normalizePartnerTier), error: null };
}

function normalizeClientReview(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    location: row.location,
    avatar: row.avatar_initials || row.name?.slice(0, 2).toUpperCase(),
    avatarBg: row.avatar_gradient,
    rating: row.rating,
    category: row.category,
    text: row.review_text,
    property: row.property_label,
    date: row.review_date
      ? new Date(row.review_date).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
      : "",
    verified: row.is_verified,
  };
}

export async function fetchClientReviews() {
  const { data, error } = await safeQuery(
    supabase.from("client_reviews").select("*").eq("is_active", true).order("display_order", { ascending: true })
  );
  if (error) return { data: [], error };
  return { data: (data || []).map(normalizeClientReview), error: null };
}

function normalizeSubscriptionPlan(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price_label,
    period: row.billing_period,
    idealFor: row.ideal_for,
    color: row.plan_color,
    borderColor: row.border_color,
    features: Array.isArray(row.features) ? row.features : [],
    popular: row.is_popular,
  };
}

export async function fetchSubscriptionPlans() {
  const { data, error } = await safeQuery(
    supabase.from("subscription_plans").select("*").eq("is_active", true).order("display_order", { ascending: true })
  );
  if (error) return { data: [], error };
  return { data: (data || []).map(normalizeSubscriptionPlan), error: null };
}

function normalizeInvestmentOpportunity(row) {
  return {
    id: row.id,
    city: row.city,
    area: row.area,
    tag: row.tag,
    tagColor: row.tag_color,
    appreciation: row.appreciation,
    rentalYield: row.rental_yield,
    priceRange: row.price_range,
    type: row.property_type,
    image: row.image_url,
  };
}

export async function fetchInvestmentOpportunities() {
  const { data, error } = await safeQuery(
    supabase.from("investment_opportunities").select("*").eq("is_active", true).order("display_order", { ascending: true })
  );
  if (error) return { data: [], error };
  return { data: (data || []).map(normalizeInvestmentOpportunity), error: null };
}
