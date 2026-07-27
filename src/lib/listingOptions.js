import { supabase, safeQuery } from "./supabaseClient";

// ── Listing Field Options (public, read-only) ────────────────────────────────
// Powers the dropdowns/chips in "Post Property" — property types, BHK
// options, amenities, and tags used to be hardcoded arrays; now they're
// admin-editable (Admin console → Site Content → Listing Options). Falls
// back to bundled defaults if the migration hasn't been run yet / the table
// is still empty, same pattern as everything else in siteContent.js.

export async function fetchListingFieldOptions() {
  const { data, error } = await safeQuery(
    supabase.from("listing_field_options").select("*").eq("is_active", true).order("display_order", { ascending: true })
  );
  if (error || !data || data.length === 0) return { data: null, error };

  const grouped = { propertyTypes: [], bhkOptions: [], amenities: [], tags: [] };
  const keyByFieldType = { property_type: "propertyTypes", bhk: "bhkOptions", amenity: "amenities", tag: "tags" };
  data.forEach((row) => {
    const key = keyByFieldType[row.field_type];
    if (key) grouped[key].push(row.value);
  });
  return { data: grouped, error: null };
}
