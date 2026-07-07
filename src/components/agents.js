import { supabase } from "./supabaseClient";

// ── Agents Data Layer ─────────────────────────────────────────────────────────

export function normalizeAgent(row) {
  return {
    id: row.id,
    dbId: row.id,
    name: row.name,
    agency: row.agency,
    phone: row.phone,
    email: row.email,
    tier: row.tier,
    status: row.status,
    deals: row.deals_closed || 0,
    since: row.member_since || "—",
    rating: Number(row.rating) || 0,
    createdAt: row.created_at,
  };
}

export async function fetchAdminAgents() {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { data: [], error };
  return { data: (data || []).map(normalizeAgent), error: null };
}

export async function updateAgentStatus(id, status) {
  const { data, error } = await supabase
    .from("agents")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error };
  return { data: normalizeAgent(data), error: null };
}
