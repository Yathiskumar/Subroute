"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { TagChip } from "@/components/shared/TagChip";
import { cn } from "@/lib/utils/cn";
import type { Topic } from "@/lib/types";

function getIcon(name: string): LucideIcon {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? Icons.Box;
}

export function TopicCard({
  topic,
  index,
  className,
}: {
  topic: Topic;
  index?: number;
  className?: string;
}) {
  const Icon = getIcon(topic.icon);
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated p-6 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, hsl(var(--accent) / 0.08), transparent 55%)",
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-lg border border-border-subtle bg-surface text-accent transition-colors group-hover:border-accent/40">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="flex items-center gap-2">
          {typeof index === "number" ? (
            <span className="font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
          <ArrowUpRight className="h-4 w-4 -translate-x-1 translate-y-1 text-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {topic.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{topic.description}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border-subtle pt-4">
        <DifficultyBadge level={topic.difficulty} />
        <span className="font-mono text-2xs uppercase tracking-[0.1em] text-subtle">
          {topic.concepts.length} concepts · {topic.estimatedTime}
        </span>
      </div>

      {topic.tags.length ? (
        <div className="flex flex-wrap gap-1.5">
          {topic.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} label={tag} asButton={false} />
          ))}
        </div>
      ) : null}
    </Link>
  );
}
