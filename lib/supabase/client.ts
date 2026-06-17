import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components / browser code.
 * Reads the public env vars (safe to expose — the anon key is row-level-security
 * gated). Returns a fresh client each call; @supabase/ssr handles cookie sync.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
