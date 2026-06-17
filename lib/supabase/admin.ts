import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase client using the SECRET key. Bypasses row-level security
 * and can call the auth admin API, so it can read analytics across every user.
 *
 * SERVER-ONLY. The "server-only" import makes the build fail if this is ever
 * pulled into a client bundle. Never expose SUPABASE_SECRET_KEY to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Admin client not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.",
    );
  }
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
