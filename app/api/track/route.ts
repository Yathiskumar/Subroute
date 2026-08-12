import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  visitorId,
  clientIp,
  country,
  attribution,
  deviceType,
  browserName,
  isBot,
  hasAuthCookie,
} from "@/lib/analytics/visitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Paths that are never worth counting as traffic. */
const IGNORED = /^\/(admin|api|auth|login)(\/|$)/;

/**
 * Records one anonymous page view. Called by <PageViewTracker /> on every
 * route change.
 *
 * Always answers 204, even on failure: analytics must never surface an error
 * to a reader or block a navigation. If the table or the secret key is missing,
 * the view is simply dropped.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      url?: unknown;
      referrer?: unknown;
      initial?: unknown;
    };
    const rawUrl = typeof body.url === "string" ? body.url : "";
    if (!rawUrl) return new NextResponse(null, { status: 204 });

    const parsed = new URL(rawUrl);
    const path = parsed.pathname.slice(0, 512);
    if (IGNORED.test(path)) return new NextResponse(null, { status: 204 });

    const ua = request.headers.get("user-agent") ?? "";
    if (isBot(ua)) return new NextResponse(null, { status: 204 });

    // Attribution is an entry-point property: only the view that *landed* on
    // the site carries a real referrer. Views from in-app navigation would
    // otherwise re-count the original referrer on every page.
    const initial = body.initial === true;
    const attr = initial
      ? attribution(rawUrl, typeof body.referrer === "string" ? body.referrer : null)
      : { source: "internal", medium: "internal", campaign: null };

    const supabase = createAdminClient();
    await supabase.from("page_views").insert({
      visitor_id: visitorId(clientIp(request.headers), ua),
      path,
      source: attr.source.slice(0, 128),
      medium: attr.medium.slice(0, 64),
      campaign: attr.campaign?.slice(0, 128) ?? null,
      country: country(request.headers),
      device: deviceType(ua),
      browser: browserName(ua),
      is_signed_in: hasAuthCookie(request.headers.get("cookie")),
    });
  } catch {
    // Swallow: a dropped page view is never worth a client-side error.
  }
  return new NextResponse(null, { status: 204 });
}
