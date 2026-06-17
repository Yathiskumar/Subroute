import {
  tryLoadRawData,
  completionsByRoadmap,
  quizStats,
} from "@/lib/admin/analytics";
import { Panel, BarList, NotConfigured } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminContentPage() {
  const raw = await tryLoadRawData();
  if (!raw) return <NotConfigured />;
  const byRoadmap = completionsByRoadmap(raw);
  const quizzes = quizStats(raw);

  const mostTaken = quizzes.slice(0, 10).map((q) => ({
    label: q.label,
    value: q.takers,
  }));
  // Hardest = lowest average score, but only quizzes that have been taken.
  const hardest = [...quizzes]
    .sort((a, b) => a.avgPct - b.avgPct)
    .slice(0, 10)
    .map((q) => ({ label: q.label, value: q.avgPct }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel
        title="Completions by roadmap"
        description="Lessons marked complete per roadmap"
      >
        <BarList items={byRoadmap} emptyText="No completions yet." />
      </Panel>

      <Panel
        title="Most-taken quizzes"
        description="By number of users who attempted"
      >
        <BarList items={mostTaken} emptyText="No quiz attempts yet." />
      </Panel>

      <Panel
        title="Hardest quizzes"
        description="Lowest average best-score — candidates to clarify"
        className="lg:col-span-2"
      >
        <BarList
          items={hardest}
          emptyText="No quiz attempts yet."
          valueSuffix="%"
        />
      </Panel>
    </div>
  );
}
