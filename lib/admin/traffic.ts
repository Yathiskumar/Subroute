import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Point } from "@/lib/admin/analytics";

/**
 * Reads public.page_views and reduces it to the handful of numbers the admin
 * dashboard shows. One query, everything else computed in memory — the volume
 * this site sees is far below the point where SQL aggregation would pay off.
 */

export type ViewRow = {
  visitorId: string;
  path: string;
  source: string;
  medium: string;
  country: string | null;
  device: string;
  browser: string;
  isSignedIn: boolean;
  viewedAt: string;
};

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const DAY_MS = 86_400_000;
const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const shortDate = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
const MAX_ROWS = 100_000;

/** Null when the secret key is missing or the table has not been created yet. */
export async function tryLoadTraffic(days = 30): Promise<ViewRow[] | null> {
  if (!process.env.SUPABASE_SECRET_KEY) return null;
  try {
    const since = new Date(Date.now() - days * DAY_MS).toISOString();
    const { data, error } = await createAdminClient()
      .from("page_views")
      .select(
        "visitor_id, path, source, medium, country, device, browser, is_signed_in, viewed_at",
      )
      .gte("viewed_at", since)
      .order("viewed_at", { ascending: false })
      .limit(MAX_ROWS);
    if (error) return null;
    return (data ?? []).map((r) => ({
      visitorId: r.visitor_id as string,
      path: r.path as string,
      source: r.source as string,
      medium: r.medium as string,
      country: (r.country as string | null) ?? null,
      device: r.device as string,
      browser: r.browser as string,
      isSignedIn: r.is_signed_in as boolean,
      viewedAt: r.viewed_at as string,
    }));
  } catch {
    return null;
  }
}

export type TrafficSummary = {
  visitorsToday: number;
  viewsToday: number;
  visitors7: number;
  visitors30: number;
  views30: number;
  viewsPerVisitor: number;
  signedInPct: number;
  /** Change in visitors vs the same-length window immediately before. */
  trend7Pct: number | null;
};

/**
 * `visitorId` rotates at midnight UTC, so a distinct count over a multi-day
 * window counts a returning person once per day they showed up. That is the
 * price of not tracking anyone across days — the labels in the UI say so.
 */
export function summarize(rows: ViewRow[], now = new Date()): TrafficSummary {
  const ms = now.getTime();
  const today = dayKey(now);
  const since = (days: number) => ms - days * DAY_MS;

  const todayRows = rows.filter((r) => r.viewedAt.slice(0, 10) === today);
  const rows7 = rows.filter((r) => new Date(r.viewedAt).getTime() >= since(7));
  const rows14to7 = rows.filter((r) => {
    const t = new Date(r.viewedAt).getTime();
    return t >= since(14) && t < since(7);
  });

  const uniq = (list: ViewRow[]) => new Set(list.map((r) => r.visitorId)).size;
  const visitors7 = uniq(rows7);
  const prev7 = uniq(rows14to7);
  const visitors30 = uniq(rows);

  return {
    visitorsToday: uniq(todayRows),
    viewsToday: todayRows.length,
    visitors7,
    visitors30,
    views30: rows.length,
    viewsPerVisitor: visitors30
      ? Math.round((rows.length / visitors30) * 10) / 10
      : 0,
    signedInPct: rows.length
      ? Math.round((rows.filter((r) => r.isSignedIn).length / rows.length) * 100)
      : 0,
    trend7Pct: prev7 ? Math.round(((visitors7 - prev7) / prev7) * 100) : null,
  };
}

/** Unique visitors per day, oldest → newest. */
export function visitorSeries(rows: ViewRow[], days = 30, now = new Date()): Point[] {
  const byDay = new Map<string, Set<string>>();
  for (const r of rows) {
    const k = r.viewedAt.slice(0, 10);
    if (!byDay.has(k)) byDay.set(k, new Set());
    byDay.get(k)!.add(r.visitorId);
  }
  const out: Point[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * DAY_MS);
    out.push({ label: shortDate(d), value: byDay.get(dayKey(d))?.size ?? 0 });
  }
  return out;
}

function rank(
  rows: ViewRow[],
  key: (r: ViewRow) => string | null,
  limit: number,
  countVisitors: boolean,
): Point[] {
  const buckets = new Map<string, Set<string> | number>();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    if (countVisitors) {
      if (!buckets.has(k)) buckets.set(k, new Set<string>());
      (buckets.get(k) as Set<string>).add(r.visitorId);
    } else {
      buckets.set(k, ((buckets.get(k) as number) ?? 0) + 1);
    }
  }
  return [...buckets.entries()]
    .map(([label, v]) => ({
      label,
      value: typeof v === "number" ? v : v.size,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/** Most-viewed pages, by page view (a reader hitting one page twice counts twice). */
export function topPages(rows: ViewRow[], limit = 12): Point[] {
  return rank(rows, (r) => r.path, limit, false);
}

/**
 * Where visitors came from, counted once per visitor. Internal navigation is
 * excluded — only the view that entered the site carries a real source.
 */
export function topSources(rows: ViewRow[], limit = 10): Point[] {
  const entries = rows.filter((r) => r.medium !== "internal");
  return rank(entries, (r) => r.source, limit, true);
}

/** Organic / referral / direct / campaign split, by visitor. */
export function channels(rows: ViewRow[]): Point[] {
  const entries = rows.filter((r) => r.medium !== "internal");
  return rank(entries, (r) => r.medium, 10, true);
}

export function topCountries(rows: ViewRow[], limit = 10): Point[] {
  return rank(rows, (r) => r.country, limit, true);
}

export function deviceSplit(rows: ViewRow[]): Point[] {
  return rank(rows, (r) => r.device, 5, true);
}

export function browserSplit(rows: ViewRow[]): Point[] {
  return rank(rows, (r) => r.browser, 6, true);
}
