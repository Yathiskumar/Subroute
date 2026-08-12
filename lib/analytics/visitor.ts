import "server-only";
import { createHash } from "node:crypto";

/**
 * Pure helpers for turning a raw request into an anonymous page-view row.
 * Nothing here keeps an IP address — see visitorId() for why that matters.
 */

/**
 * A stable-for-one-day, non-reversible visitor token.
 *
 * The UTC date is part of the hash, so the token changes at midnight and the
 * same person counts as a new visitor tomorrow. That is a deliberate trade:
 * we lose cross-day retention in exchange for never holding an identifier that
 * can follow someone around, and for not needing a tracking cookie.
 */
export function visitorId(ip: string, userAgent: string, now = new Date()): string {
  const salt = process.env.ANALYTICS_SALT ?? process.env.SUPABASE_SECRET_KEY ?? "";
  const day = now.toISOString().slice(0, 10);
  return createHash("sha256")
    .update(`${ip}|${userAgent}|${salt}|${day}`)
    .digest("hex")
    .slice(0, 32);
}

/** First entry of x-forwarded-for is the client; the rest are proxies. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/** Vercel's edge sets this; locally there is no geo signal at all. */
export function country(headers: Headers): string | null {
  return headers.get("x-vercel-ip-country") ?? null;
}

const SEARCH_ENGINES = /(^|\.)(google|bing|duckduckgo|yahoo|yandex|baidu|ecosia|brave)\./i;

export type Attribution = {
  source: string;
  medium: string;
  campaign: string | null;
};

/**
 * Where a view came from. UTM tags win when present (they are explicit); the
 * referrer host is the fallback; anything else is direct — a bookmark, a typed
 * URL, or a link from an app that strips the referrer.
 */
export function attribution(pageUrl: string, referrer: string | null): Attribution {
  let params: URLSearchParams;
  let selfHost = "";
  try {
    const u = new URL(pageUrl);
    params = u.searchParams;
    selfHost = u.host;
  } catch {
    params = new URLSearchParams();
  }

  const utmSource = params.get("utm_source");
  const campaign = params.get("utm_campaign");

  let refHost = "";
  if (referrer) {
    try {
      refHost = new URL(referrer).host.replace(/^www\./, "");
    } catch {
      refHost = "";
    }
  }

  // Internal navigation isn't a traffic source.
  if (refHost && refHost === selfHost.replace(/^www\./, "")) refHost = "";

  if (utmSource) {
    return {
      source: utmSource.toLowerCase(),
      medium: (params.get("utm_medium") ?? "campaign").toLowerCase(),
      campaign,
    };
  }
  if (refHost) {
    const isSearch = SEARCH_ENGINES.test(`.${refHost}`);
    return {
      source: isSearch ? refHost.split(".")[0]! : refHost,
      medium: isSearch ? "organic" : "referral",
      campaign,
    };
  }
  return { source: "direct", medium: "direct", campaign };
}

export function deviceType(ua: string): "mobile" | "tablet" | "desktop" {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet";
  if (/Mobi|iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(ua))
    return "mobile";
  return "desktop";
}

/** Order matters — Edge/Chrome/Safari all claim to be each other. */
export function browserName(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "Other";
}

const BOT = /bot|crawler|spider|crawling|slurp|headless|lighthouse|preview|monitor|curl|wget|python-requests|axios|node-fetch|facebookexternalhit|whatsapp|telegram|discord|vercel-screenshot/i;

/** Crawlers and link-unfurlers are traffic, but they are not people. */
export function isBot(ua: string): boolean {
  return !ua || BOT.test(ua);
}

/**
 * Cheap "is this a logged-in session?" check. Supabase's auth cookie is named
 * `sb-<project-ref>-auth-token`. We only read its presence — validating the JWT
 * would mean a network round-trip on every single page view, and this flag only
 * splits the traffic chart into members vs visitors.
 */
export function hasAuthCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return /(^|;\s*)sb-[^=]*auth-token[^=]*=/.test(cookieHeader);
}
