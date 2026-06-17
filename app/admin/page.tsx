import { ExternalLink } from "lucide-react";
import {
  tryLoadRawData,
  overview,
  signupSeries,
  completionsByRoadmap,
} from "@/lib/admin/analytics";
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
  const raw = await tryLoadRawData();
  if (!raw) return <NotConfigured />;
  const o = overview(raw);
  const signups = signupSeries(raw, 30);
  const byRoadmap = completionsByRoadmap(raw);

  return (
    <div className="flex flex-col gap-6">
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

      <a
        href="https://vercel.com/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-surface-elevated px-3.5 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
      >
        Traffic & page views in Vercel Analytics
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
