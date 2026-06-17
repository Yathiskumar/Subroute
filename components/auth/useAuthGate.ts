"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

/**
 * Decides whether a "progress" action (mark complete, submit quiz) is allowed.
 * - Signed in → allowed.
 * - Auth not configured (self-hosted without Supabase) → allowed, so the site
 *   still works standalone via localStorage.
 * - Auth configured but signed out → gated; send them to /login and back.
 */
export function useAuthGate() {
  const { user, loading, disabled } = useAuth();
  const pathname = usePathname();

  const allowed = disabled || !!user;
  const gated = !disabled && !loading && !user;
  const loginHref = `/login?next=${encodeURIComponent(pathname ?? "/")}`;

  return { allowed, gated, loading, loginHref };
}
