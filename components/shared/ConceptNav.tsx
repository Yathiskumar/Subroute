"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ListTree } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Concept, Topic } from "@/lib/types";

type SidebarItem = { id: string; label: string };

export function ConceptNav({
  topic,
  current,
  prev,
  next,
  tocItems,
  className,
}: {
  topic: Topic;
  current: Concept;
  prev: Concept | null;
  next: Concept | null;
  tocItems: SidebarItem[];
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-6 text-sm",
        "lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto",
        className,
      )}
    >
      {/* Mini TOC */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
        <div className="flex items-center gap-2 pb-2">
          <ListTree className="h-3.5 w-3.5 text-accent" />
          <p className="font-mono text-2xs uppercase tracking-[0.12em] text-muted">
            On this page
          </p>
        </div>
        <ul className="mt-1 flex flex-col gap-0.5 border-l border-border-subtle">
          {tocItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="-ml-px block border-l border-transparent py-1.5 pl-3 text-muted transition-colors hover:border-accent hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* In-topic concept list */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
        <p className="kicker pb-2">{topic.title}</p>
        <ul className="flex flex-col">
          {topic.concepts.map((c, i) => {
            const isCurrent = c.slug === current.slug;
            return (
              <li key={c.slug}>
                <Link
                  href={`/topics/${topic.slug}/${c.slug}`}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors",
                    isCurrent
                      ? "bg-accent/10 text-foreground"
                      : "text-muted hover:bg-surface hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-2xs",
                      isCurrent ? "text-accent" : "text-subtle",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{c.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Prev / next */}
      <div className="grid grid-cols-2 gap-2">
        {prev ? (
          <Link
            href={`/topics/${topic.slug}/${prev.slug}`}
            className="group flex flex-col gap-1 rounded-lg border border-border-subtle bg-surface-elevated p-3 transition-colors hover:border-border-strong"
          >
            <span className="inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-[0.1em] text-subtle">
              <ArrowLeft className="h-3 w-3" />
              Prev
            </span>
            <span className="line-clamp-2 text-sm text-foreground group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span className="rounded-lg border border-dashed border-border-subtle p-3 text-2xs uppercase tracking-wider text-subtle">
            start of topic
          </span>
        )}
        {next ? (
          <Link
            href={`/topics/${topic.slug}/${next.slug}`}
            className="group flex flex-col items-end gap-1 rounded-lg border border-border-subtle bg-surface-elevated p-3 text-right transition-colors hover:border-border-strong"
          >
            <span className="inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-[0.1em] text-subtle">
              Next
              <ArrowRight className="h-3 w-3" />
            </span>
            <span className="line-clamp-2 text-sm text-foreground group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        ) : (
          <span className="rounded-lg border border-dashed border-border-subtle p-3 text-right text-2xs uppercase tracking-wider text-subtle">
            end of topic
          </span>
        )}
      </div>
    </aside>
  );
}
