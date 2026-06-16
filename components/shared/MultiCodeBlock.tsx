"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { CodeSample } from "@/lib/content/types";

const PREF_KEY = "code-lang-pref";

export function MultiCodeBlock({
  samples,
  className,
}: {
  samples: CodeSample[];
  className?: string;
}) {
  const [active, setActive] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  // Restore the reader's preferred language across lessons.
  React.useEffect(() => {
    try {
      const pref = localStorage.getItem(PREF_KEY);
      if (pref) {
        const i = samples.findIndex((s) => s.label === pref);
        if (i >= 0) setActive(i);
      }
    } catch {
      /* ignore */
    }
  }, [samples]);

  const select = (i: number) => {
    setActive(i);
    try {
      localStorage.setItem(PREF_KEY, samples[i].label);
    } catch {
      /* ignore */
    }
  };

  const current = samples[active] ?? samples[0];

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border-subtle bg-surface-sunken",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-elevated/40 px-2 py-1.5">
        <div
          role="tablist"
          aria-label="Language"
          className="flex items-center gap-0.5 overflow-x-auto"
        >
          {samples.map((s, i) => (
            <button
              key={s.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => select(i)}
              className={cn(
                "whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.1em] transition-colors",
                i === active
                  ? "bg-accent/10 text-accent"
                  : "text-subtle hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-1">
          <span className="hidden font-mono text-2xs text-subtle sm:inline">
            {current.filename}
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border-subtle px-2 font-mono text-2xs uppercase tracking-[0.08em] text-muted transition-colors hover:border-border hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-success" />
                copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                copy
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-foreground/90">
        <code className="font-mono">{current.code}</code>
      </pre>
    </div>
  );
}
