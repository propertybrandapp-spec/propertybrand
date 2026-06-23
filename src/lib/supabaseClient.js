import { createClient } from "@supabase/supabase-js";

// ── Supabase Client ───────────────────────────────────────────────────────────
// Pulls credentials from environment variables. Never hardcode these.
// Create a .env file in your project root (see .env.example) with:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-public-key
//
// The anon key is safe to expose in frontend code — it only grants access
// permitted by your Row Level Security (RLS) policies (see SQL schema file).

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
