import "server-only";

/** Parsed, lower-cased admin email allowlist from the ADMIN_EMAILS env var. */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/** True when both the allowlist and the secret key are configured. */
export function adminConfigured(): boolean {
  return adminEmails().length > 0 && !!process.env.SUPABASE_SECRET_KEY;
}
