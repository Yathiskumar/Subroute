import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  tryLoadRawData,
  overview,
  signupSeries,
  completionsByRoadmap,
} from "@/lib/admin/analytics";
import { tryLoadTraffic, summarize, visitorSeries } from "@/lib/admin/traffic";
import {
  StatCard,
  Panel,
  BarList,
  TrendBars,
  NotConfigured,
} from "@/components/admin/ui";

// Always recompute from live data — never serve a cached snapshot.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminOverviewPage() {
  const [raw, views] = await Promise.all([tryLoadRawData(), tryLoadTraffic(30)]);
  if (!raw) return <NotConfigured />;
  const o = overview(raw);
  const signups = signupSeries(raw, 30);
  const byRoadmap = completionsByRoadmap(raw);
  const traffic = views ? summarize(views) : null;

  return (
    <div className="flex flex-col gap-6">
      {traffic ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Visitors today"
            value={traffic.visitorsToday}
            sub={`${traffic.viewsToday} page views`}
          />
          <StatCard
            label="Visitors · 7 days"
            value={traffic.visitors7}
            sub={
              traffic.trend7Pct === null
                ? "everyone, signed in or not"
                : `${traffic.trend7Pct >= 0 ? "+" : ""}${traffic.trend7Pct}% vs previous 7d`
            }
          />
          <StatCard
            label="Visitors · 30 days"
            value={traffic.visitors30}
            sub={`${traffic.views30} page views`}
          />
          <StatCard
            label="Signed-in share"
            value={`${traffic.signedInPct}%`}
            sub="of page views"
          />
        </div>
      ) : null}

      {traffic ? (
        <Panel
          title="Visitors per day"
          description="Unique visitors, last 30 days — includes people who never sign in"
        >
          <TrendBars data={visitorSeries(views!, 30)} />
        </Panel>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total users"
          value={o.totalUsers}
          sub={`${o.activeUsers7} active in 7d`}
        />
        <StatCard
          label="New signups"
          value={o.newUsers30}
          sub={`${o.newUsers7} in the last 7 days`}
        />
        <StatCard
          label="Lessons completed"
          value={o.totalCompletions}
          sub="across all users"
        />
        <StatCard
          label="Quizzes taken"
          value={o.quizzesTaken}
          sub={`${o.totalQuizAttempts} total attempts`}
        />
        <StatCard label="Avg quiz score" value={`${o.avgScorePct}%`} />
        <StatCard
          label="Quiz pass rate"
          value={`${o.passRatePct}%`}
          sub="best score ≥ 70%"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Signups"
          description="New accounts per day, last 30 days"
        >
          <TrendBars data={signups} />
        </Panel>
        <Panel
          title="Completions by roadmap"
          description="Total lessons marked complete"
        >
          <BarList items={byRoadmap} emptyText="No completions yet." />
        </Panel>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/traffic"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-surface-elevated px-3.5 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          Sources, top pages & countries
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-surface-elevated px-3.5 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          Cross-check in Vercel Analytics
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
