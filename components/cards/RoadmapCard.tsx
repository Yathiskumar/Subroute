import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { TagChip } from "@/components/shared/TagChip";
import { cn } from "@/lib/utils/cn";
import { roadmapTopicCount } from "@/lib/data/roadmaps";
import type { Roadmap } from "@/lib/types";

function getIcon(name: string): LucideIcon {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? Icons.Map;
}

export function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const Icon = getIcon(roadmap.icon);
  const available = roadmap.status === "available";
  const topicCount = roadmapTopicCount(roadmap);

  const inner = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, hsl(var(--accent) / 0.08), transparent 55%)",
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-lg border border-border-subtle bg-surface text-accent transition-colors group-hover:border-accent/40">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs uppercase tracking-[0.16em] text-subtle">
            {roadmap.abbr}
          </span>
          {available ? (
            <ArrowUpRight className="h-4 w-4 -translate-x-1 translate-y-1 text-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100" />
          ) : (
            <span className="rounded-full border border-border-subtle bg-surface px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
              Soon
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {roadmap.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{roadmap.description}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border-subtle pt-4">
        <DifficultyBadge level={roadmap.difficulty} />
        <span className="font-mono text-2xs uppercase tracking-[0.1em] text-subtle">
          {available
            ? `${roadmap.phases.length} phases · ${topicCount} topics`
            : roadmap.estimatedTime}
        </span>
      </div>

      {roadmap.tags.length ? (
        <div className="flex flex-wrap gap-1.5">
          {roadmap.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} label={tag} asButton={false} />
          ))}
        </div>
      ) : null}
    </>
  );

  const base =
    "group relative flex flex-col gap-5 overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated p-6";

  if (!available) {
    return (
      <div
        className={cn(base, "cursor-default opacity-70")}
        aria-disabled="true"
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/roadmaps/${roadmap.slug}`}
      className={cn(
        base,
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover",
      )}
    >
      {inner}
    </Link>
  );
}
