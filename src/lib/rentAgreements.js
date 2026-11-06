// Talks to the rent-agreement functions in Supabase (migration_031).
import { supabase, safeQuery } from "./supabaseClient";

// Link a party opens to review & sign: https://yoursite/#/sign/<token>
export function signingLink(token) {
  const base = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";
  return `${base}#/sign/${token}`;
}

export async function createRentAgreement({ form, ownerEmail, tenantEmail }) {
  const { data, error } = await safeQuery(
    supabase.rpc("create_rent_agreement", { p_form: form, p_owner_email: ownerEmail || null, p_tenant_email: tenantEmail || null })
  );
  if (error || !data) return { data: null, error: error || new Error("No data returned") };
  return { data: { id: data.id, ownerToken: data.owner_token, tenantToken: data.tenant_token }, error: null };
}

export async function getRentAgreement(token) {
  const { data, error } = await safeQuery(supabase.rpc("get_rent_agreement", { p_token: token }));
  return { data: data || null, error };
}

export async function signRentAgreement({ token, signature, aadhaar, pan, consent }) {
  const { data, error } = await safeQuery(
    supabase.rpc("sign_rent_agreement", { p_token: token, p_signature: signature, p_aadhaar: aadhaar, p_pan: pan, p_consent: consent })
  );
  return { data: data || null, error };
}
