import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Only allow the post-login redirect to a same-origin, relative path. This
 * blocks open-redirects via crafted `?next=` values such as `//evil.com`,
 * `/\evil.com`, or an absolute `https://evil.com` URL. Anything that isn't a
 * single-leading-slash path falls back to the home page.
 */
function safeNext(raw: string | null): string {
  if (!raw) return "/";
  // Must start with exactly one "/" (not "//" or "/\") and contain no control
  // chars; reject any value that parses as having a scheme/host.
  if (!/^\/[^/\\]/.test(raw) && raw !== "/") return "/";
  return raw;
}

/**
 * OAuth / magic-link landing route. Supabase redirects here with a `code`
 * (PKCE) which we exchange for a session cookie, then send the user on to
 * wherever they started (`next`), defaulting to the home page.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // In prod behind a proxy, honour the forwarded host so the redirect
      // doesn't bounce the user to localhost.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";
      if (isLocal) return NextResponse.redirect(`${origin}${next}`);
      if (forwardedHost)
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
