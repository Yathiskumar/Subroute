"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function CodeBlock({
  code,
  language = "ts",
  filename,
  className,
}: {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border-subtle bg-surface-sunken",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border-subtle bg-surface-elevated/40 px-4 py-2">
        <div className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="h-2 w-2 rounded-full bg-border-strong" />
          </span>
          <span className="ml-2">{filename ?? language}</span>
        </div>
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
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-foreground/90">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
