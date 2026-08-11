import {
  tryLoadTraffic,
  summarize,
  visitorSeries,
  topPages,
  topSources,
  channels,
  topCountries,
  deviceSplit,
  browserSplit,
} from "@/lib/admin/traffic";
import { StatCard, Panel, BarList, TrendBars } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function TrafficUnavailable() {
  return (
    <div className="rounded-xl border border-danger/40 bg-danger/10 p-6">
      <h2 className="text-sm font-semibold text-foreground">
        Traffic table not available
      </h2>
      <p className="mt-1 text-sm text-muted">
        Run{" "}
        <code className="text-foreground">
          supabase/migrations/0005_page_views.sql
        </code>{" "}
        in the Supabase SQL editor, and make sure{" "}
        <code className="text-foreground">SUPABASE_SECRET_KEY</code> is set.
        Views start recording as soon as the table exists.
      </p>
    </div>
  );
}

export default async function AdminTrafficPage() {
  const rows = await tryLoadTraffic(30);
  if (!rows) return <TrafficUnavailable />;

  const s = summarize(rows);
  const trend =
    s.trend7Pct === null
      ? "no prior week to compare"
      : `${s.trend7Pct >= 0 ? "+" : ""}${s.trend7Pct}% vs previous 7 days`;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Visitors today"
          value={s.visitorsToday}
          sub={`${s.viewsToday} page views`}
        />
        <StatCard label="Visitors · 7 days" value={s.visitors7} sub={trend} />
        <StatCard
          label="Visitors · 30 days"
          value={s.visitors30}
          sub="counted once per day each"
        />
        <StatCard
          label="Page views · 30 days"
          value={s.views30}
          sub={`${s.viewsPerVisitor} pages per visitor`}
        />
      </div>

      <Panel
        title="Visitors per day"
        description="Unique visitors, last 30 days (UTC)"
      >
        <TrendBars data={visitorSeries(rows, 30)} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Where visitors came from"
          description="Counted once per visitor, by entry point"
        >
          <BarList
            items={topSources(rows)}
            emptyText="No traffic recorded yet."
          />
        </Panel>
        <Panel title="Channels" description="How that traffic is classified">
          <BarList items={channels(rows)} emptyText="No traffic recorded yet." />
        </Panel>
      </div>

      <Panel title="Top pages" description="Most-viewed pages, last 30 days">
        <BarList items={topPages(rows)} emptyText="No page views yet." />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Countries" description="By visitor">
          <BarList
            items={topCountries(rows)}
            emptyText="No geo data — this only fills in on Vercel."
          />
        </Panel>
        <Panel title="Devices" description="By visitor">
          <BarList items={deviceSplit(rows)} emptyText="No data yet." />
        </Panel>
        <Panel title="Browsers" description="By visitor">
          <BarList items={browserSplit(rows)} emptyText="No data yet." />
        </Panel>
      </div>

      <p className="text-xs text-subtle">
        {s.signedInPct}% of page views came from a signed-in session. Visitors
        are identified by a salted hash of IP + browser that rotates at midnight
        UTC — no raw IP is stored, and no tracking cookie is set, so someone
        returning tomorrow counts as a new visitor.
      </p>
    </div>
  );
}
