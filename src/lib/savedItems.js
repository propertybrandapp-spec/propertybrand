import { supabase } from "./supabaseClient";

// ── Saved Items Data Layer ───────────────────────────────────────────────────
// Backs the heart icon on property cards and the bookmark icon on blog/article
// cards. Both mirror the same shape: a join table between client_profiles and
// the saved thing (listings / blog_posts), gated by RLS so clients only ever
// see their own saved rows.

export async function fetchSavedPropertyIds(clientId) {
  const { data, error } = await supabase
    .from("saved_properties")
    .select("listing_id")
    .eq("client_id", clientId);
  if (error) return { data: [], error };
  return { data: (data || []).map((r) => r.listing_id), error: null };
}

export async function saveProperty(clientId, listingId) {
  const { error } = await supabase.from("saved_properties").insert({ client_id: clientId, listing_id: listingId });
  return { error };
}

export async function unsaveProperty(clientId, listingId) {
  const { error } = await supabase.from("saved_properties").delete().eq("client_id", clientId).eq("listing_id", listingId);
  return { error };
}

export async function fetchSavedPostIds(clientId) {
  const { data, error } = await supabase
    .from("saved_posts")
    .select("post_id")
    .eq("client_id", clientId);
  if (error) return { data: [], error };
  return { data: (data || []).map((r) => r.post_id), error: null };
}

export async function savePost(clientId, postId) {
  const { error } = await supabase.from("saved_posts").insert({ client_id: clientId, post_id: postId });
  return { error };
}

export async function unsavePost(clientId, postId) {
  const { error } = await supabase.from("saved_posts").delete().eq("client_id", clientId).eq("post_id", postId);
  return { error };
}
