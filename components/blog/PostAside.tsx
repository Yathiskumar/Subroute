"use client";

import * as React from "react";
import { Check, Link2, Rss, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface TocHeading {
  id: string;
  text: string;
  depth: number;
}

export function PostAside({
  headings,
  url,
  title,
}: {
  headings: TocHeading[];
  url: string;
  title: string;
}) {
  const [activeId, setActiveId] = React.useState(headings[0]?.id ?? "");
  const [copied, setCopied] = React.useState(false);

  // Scroll-spy: highlight the heading nearest the top of the viewport.
  React.useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  return (
    <div className="sticky top-24 flex flex-col gap-8">
      {headings.length > 0 ? (
        <nav aria-label="On this page">
          <p className="kicker mb-3">On this page</p>
          <ul className="flex flex-col border-l border-border-subtle">
            {headings.map((h) => {
              const active = h.id === activeId;
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className={cn(
                      "-ml-px block border-l py-1 text-sm leading-snug transition-colors",
                      h.depth === 3 ? "pl-7" : "pl-4",
                      active
                        ? "border-accent text-foreground"
                        : "border-transparent text-muted hover:text-foreground",
                    )}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border-subtle pt-6">
        <p className="kicker">Share</p>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
          {copied ? "Link copied" : "Copy link"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Share on X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Share on LinkedIn
        </a>
        <a
          href="/blog/rss.xml"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <Rss className="h-3.5 w-3.5" />
          Subscribe via RSS
        </a>
      </div>
    </div>
  );
}
