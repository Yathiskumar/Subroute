import Link from "next/link";
import { ArrowRight, Timer, MousePointerClick } from "lucide-react";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { renderInline } from "@/components/shared/ProseRenderer";
import { cn } from "@/lib/utils/cn";
import type { Concept } from "@/lib/types";

export function ConceptCard({
  concept,
  topicSlug,
  index,
  className,
}: {
  concept: Concept;
  topicSlug: string;
  index?: number;
  className?: string;
}) {
  const hasPrototype = !!concept.prototypePath;
  return (
    <Link
      href={`/topics/${topicSlug}/${concept.slug}`}
      className={cn(
        "group relative flex items-stretch overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated transition-all duration-300",
        "hover:border-border-strong hover:shadow-card-hover",
        className,
      )}
    >
      {/* Left number/marker rail */}
      <div className="flex w-14 shrink-0 flex-col items-center justify-between border-r border-border-subtle bg-surface py-5">
        <span className="font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
          {typeof index === "number" ? String(index + 1).padStart(2, "0") : "•"}
        </span>
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors",
            hasPrototype ? "bg-accent shadow-[0_0_12px_hsl(var(--accent))]" : "bg-border-strong",
          )}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
              {concept.title}
            </h3>
            <p className="text-sm text-muted">{renderInline(concept.oneLiner)}</p>
          </div>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-2xs">
          <DifficultyBadge level={concept.difficulty} />
          <span className="inline-flex items-center gap-1 font-mono uppercase tracking-[0.1em] text-subtle">
            <Timer className="h-3 w-3" />
            {concept.estimatedTime}
          </span>
          {hasPrototype ? (
            <span className="inline-flex items-center gap-1 font-mono uppercase tracking-[0.1em] text-accent">
              <MousePointerClick className="h-3 w-3" />
              try it
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-mono uppercase tracking-[0.1em] text-subtle">
              prototype soon
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
