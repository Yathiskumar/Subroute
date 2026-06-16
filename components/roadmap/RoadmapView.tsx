"use client";

import * as React from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  RotateCcw,
  Star,
  Target,
  type LucideIcon,
} from "lucide-react";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { TagChip } from "@/components/shared/TagChip";
import { cn } from "@/lib/utils/cn";
import { roadmapTopicCount } from "@/lib/data/roadmaps";
import {
  PROGRESS_SYNC_EVENT,
  progressStorageKey,
  topicProgressId,
} from "@/lib/utils/roadmap-progress";
import type { Roadmap, RoadmapTopicTag } from "@/lib/types";

function getIcon(name: string): LucideIcon {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? Icons.Circle;
}

const TAG_META: Record<
  RoadmapTopicTag,
  { label: string; className: string; star?: boolean }
> = {
  core: { label: "core", className: "border-accent/30 bg-accent/10 text-accent" },
  interview: {
    label: "interview",
    className: "border-warning/30 bg-warning/10 text-warning",
    star: true,
  },
  "deep-dive": {
    label: "deep dive",
    className: "border-info/30 bg-info/10 text-info",
  },
};

function TagBadge({ tag }: { tag: RoadmapTopicTag }) {
  const meta = TAG_META[tag];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-px font-mono text-[0.625rem] uppercase tracking-[0.08em]",
        meta.className,
      )}
    >
      {meta.star ? <Star className="h-2.5 w-2.5" fill="currentColor" /> : null}
      {meta.label}
    </span>
  );
}

export function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  const Icon = getIcon(roadmap.icon);
  const total = roadmapTopicCount(roadmap);
  const storageKey = progressStorageKey(roadmap.slug);

  // Stable per-topic ids, grouped by phase.
  const phaseIds = React.useMemo(
    () =>
      roadmap.phases.map((phase, pi) =>
        phase.groups.flatMap((group, gi) =>
          group.items.map((_, ii) => topicProgressId(pi, gi, ii)),
        ),
      ),
    [roadmap.phases],
  );

  const [done, setDone] = React.useState<Set<string>>(new Set());
  const [mounted, setMounted] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    setMounted(true);
    const load = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        setDone(new Set(raw ? (JSON.parse(raw) as string[]) : []));
      } catch {
        /* ignore */
      }
    };
    load();
    // Reflect completions toggled from a lesson page (or another tab).
    window.addEventListener(PROGRESS_SYNC_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(PROGRESS_SYNC_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [storageKey]);

  React.useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify([...done]));
    } catch {
      /* ignore */
    }
  }, [done, mounted, storageKey]);

  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleCollapse = (pi: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(pi)) next.delete(pi);
      else next.add(pi);
      return next;
    });

  const completedIn = (ids: string[]) =>
    mounted ? ids.filter((id) => done.has(id)).length : 0;

  const completedTotal = completedIn(phaseIds.flat());
  const percent = total ? Math.round((completedTotal / total) * 100) : 0;

  return (
    <>
      {/* Hero */}
      <div className="mt-8 flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-border-subtle bg-surface-elevated text-accent">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span aria-hidden className="h-px w-6 bg-accent" />
              <p className="kicker !text-accent">{roadmap.abbr} · Roadmap</p>
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
              {roadmap.title}
            </h1>
          </div>
        </div>

        <p className="max-w-3xl text-pretty text-lg text-muted">
          {roadmap.description}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <DifficultyBadge level={roadmap.difficulty} />
          <span className="font-mono text-2xs uppercase tracking-[0.1em] text-subtle">
            {roadmap.phases.length} phases · {total} topics ·{" "}
            {roadmap.estimatedTime}
          </span>
        </div>

        {roadmap.tags.length ? (
          <div className="flex flex-wrap gap-1.5">
            {roadmap.tags.map((tag) => (
              <TagChip key={tag} label={tag} asButton={false} />
            ))}
          </div>
        ) : null}

        {/* Progress panel */}
        <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="relative flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <p className="kicker">Your progress</p>
              <p className="text-2xl font-semibold tracking-tight">
                {mounted ? `${completedTotal} / ${total}` : `0 / ${total}`}{" "}
                <span className="text-base font-normal text-muted">topics</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-3xl font-semibold tabular-nums text-accent">
                {percent}%
              </span>
              {mounted && completedTotal > 0 ? (
                <button
                  type="button"
                  onClick={() => setDone(new Set())}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              ) : null}
            </div>
          </div>
          <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="relative mt-2 text-xs text-subtle">
            Progress saves automatically in this browser — check topics off as
            you learn them.
          </p>
        </div>
      </div>

      {/* Body: sticky phase map + timeline */}
      <div className="mt-14 lg:grid lg:grid-cols-[14rem_1fr] lg:items-start lg:gap-12">
        {/* Phase map */}
        <nav className="sticky top-20 hidden lg:block">
          <p className="kicker mb-3">Phases</p>
          <ol className="flex flex-col gap-0.5">
            {roadmap.phases.map((phase, pi) => {
              const ids = phaseIds[pi];
              const c = completedIn(ids);
              const complete = mounted && c === ids.length;
              return (
                <li key={phase.title}>
                  <a
                    href={`#phase-${pi}`}
                    className="group flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
                  >
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[0.625rem] transition-colors",
                        complete
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border-strong text-subtle group-hover:border-accent group-hover:text-accent",
                      )}
                    >
                      {complete ? (
                        <Check className="h-3 w-3" strokeWidth={3} />
                      ) : (
                        pi + 1
                      )}
                    </span>
                    <span className="flex-1 truncate">{phase.title}</span>
                    <span className="font-mono text-2xs tabular-nums text-subtle">
                      {mounted ? `${c}/${ids.length}` : ids.length}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Timeline */}
        <ol className="relative">
          {roadmap.phases.map((phase, pi) => {
            const PhaseIcon = getIcon(phase.icon);
            const ids = phaseIds[pi];
            const c = completedIn(ids);
            const pct = ids.length ? Math.round((c / ids.length) * 100) : 0;
            const phaseComplete = mounted && c === ids.length;
            const isLast = pi === roadmap.phases.length - 1;
            const open = !collapsed.has(pi);

            return (
              <li
                key={phase.title}
                id={`phase-${pi}`}
                className="relative grid scroll-mt-24 grid-cols-[2.75rem_1fr] gap-x-5 pb-8 last:pb-0 sm:grid-cols-[3rem_1fr] sm:gap-x-6"
              >
                {/* Rail */}
                <div className="relative flex justify-center">
                  <div
                    className={cn(
                      "z-10 grid h-11 w-11 place-items-center rounded-full border transition-colors sm:h-12 sm:w-12",
                      phaseComplete
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border-strong bg-surface-elevated text-accent",
                    )}
                  >
                    {phaseComplete ? (
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    ) : (
                      <PhaseIcon className="h-5 w-5" strokeWidth={1.75} />
                    )}
                  </div>
                  {!isLast ? (
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-11 h-[calc(100%-2.75rem)] w-px -translate-x-1/2 bg-gradient-to-b from-border-strong to-border-subtle sm:top-12 sm:h-[calc(100%-3rem)]"
                    />
                  ) : null}
                </div>

                {/* Card */}
                <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(pi)}
                    className="flex w-full items-start gap-3 p-6 text-left"
                    aria-expanded={open}
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-2xs uppercase tracking-[0.14em] text-subtle">
                          Phase {String(pi + 1).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden
                          className="h-1 w-1 rounded-full bg-border-strong"
                        />
                        <span className="font-mono text-2xs uppercase tracking-[0.1em] text-subtle">
                          {phase.duration}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {phase.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden font-mono text-2xs uppercase tracking-[0.1em] text-subtle sm:block">
                        {mounted ? `${c}/${ids.length}` : `${ids.length}`} topics
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-muted transition-transform duration-300",
                          open ? "" : "-rotate-90",
                        )}
                      />
                    </div>
                  </button>

                  {/* Per-phase progress bar */}
                  <div className="mx-6 h-1 overflow-hidden rounded-full bg-surface-sunken">
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Collapsible body */}
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="p-6 pt-5">
                        <p className="max-w-2xl text-sm leading-relaxed text-muted">
                          {phase.summary}
                        </p>

                        <div className="mt-4 flex gap-2.5 rounded-lg border border-accent/20 bg-accent/[0.06] p-3">
                          <Target
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                            strokeWidth={2}
                          />
                          <p className="text-sm leading-relaxed">
                            <span className="font-medium text-foreground">
                              Outcome —{" "}
                            </span>
                            <span className="text-muted">{phase.outcome}</span>
                          </p>
                        </div>

                        <div className="mt-5 flex flex-col gap-5">
                          {phase.groups.map((group, gi) => (
                            <div key={group.label ?? gi}>
                              {group.label ? (
                                <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-muted">
                                  {group.label}
                                </p>
                              ) : null}
                              <ul className="flex flex-col gap-1">
                                {group.items.map((item, ii) => {
                                  const id = topicProgressId(pi, gi, ii);
                                  const checked = mounted && done.has(id);
                                  const hasLesson = Boolean(item.slug);

                                  const titleRow = (
                                    <span className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={cn(
                                          "text-sm font-medium transition-colors",
                                          checked
                                            ? "text-subtle line-through decoration-border-strong"
                                            : hasLesson
                                              ? "text-foreground group-hover/item:text-accent"
                                              : "text-foreground",
                                        )}
                                      >
                                        {item.title}
                                      </span>
                                      {item.tag ? (
                                        <TagBadge tag={item.tag} />
                                      ) : null}
                                      {hasLesson ? (
                                        <span className="inline-flex items-center gap-0.5 rounded-full border border-accent/30 bg-accent/10 px-1.5 py-px font-mono text-[0.625rem] uppercase tracking-[0.08em] text-accent">
                                          Lesson
                                          <ArrowUpRight className="h-2.5 w-2.5" />
                                        </span>
                                      ) : null}
                                    </span>
                                  );

                                  const noteEl = item.note ? (
                                    <span
                                      className={cn(
                                        "mt-0.5 block text-xs leading-relaxed",
                                        checked ? "text-subtle/70" : "text-muted",
                                      )}
                                    >
                                      {item.note}
                                    </span>
                                  ) : null;

                                  return (
                                    <li key={id}>
                                      <div
                                        className={cn(
                                          "group/item flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                                          hasLesson
                                            ? "border-border-subtle bg-surface/50 hover:border-accent/40 hover:bg-surface"
                                            : "border-transparent hover:border-border-subtle hover:bg-surface",
                                        )}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => toggle(id)}
                                          aria-label={
                                            checked
                                              ? `Mark ${item.title} incomplete`
                                              : `Mark ${item.title} complete`
                                          }
                                          className={cn(
                                            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                                            checked
                                              ? "border-accent bg-accent text-accent-foreground"
                                              : "border-border-strong text-transparent hover:border-accent",
                                          )}
                                        >
                                          <Check
                                            className="h-3.5 w-3.5"
                                            strokeWidth={3}
                                          />
                                        </button>
                                        {hasLesson ? (
                                          <Link
                                            href={`/roadmaps/${roadmap.slug}/${item.slug}`}
                                            className="min-w-0 flex-1"
                                          >
                                            {titleRow}
                                            {noteEl}
                                          </Link>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => toggle(id)}
                                            className="min-w-0 flex-1 text-left"
                                          >
                                            {titleRow}
                                            {noteEl}
                                          </button>
                                        )}
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Completion banner */}
      {mounted && completedTotal === total && total > 0 ? (
        <div className="mt-10 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/[0.06] p-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
            <Check className="h-5 w-5" strokeWidth={3} />
          </div>
          <div>
            <p className="font-semibold tracking-tight">
              Roadmap complete — every topic checked off.
            </p>
            <p className="text-sm text-muted">
              Nicely done. Time to put it to work on real machine-coding rounds.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
