"use client";

import * as React from "react";
import { ThumbsDown, ThumbsUp, MessageSquarePlus, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function FeedbackWidget({ className }: { className?: string }) {
  const [reaction, setReaction] = React.useState<"up" | "down" | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md border border-border-subtle bg-surface text-muted">
          <MessageSquarePlus className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">Was this concept helpful?</p>
          <p className="text-xs text-muted">
            Tell us what worked, or what to improve. We read every note.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {submitted ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-3 py-1.5 text-xs text-success">
            <Check className="h-3.5 w-3.5" /> thanks for the feedback
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setReaction("up");
                setSubmitted(true);
              }}
              aria-label="Helpful"
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs transition-colors",
                reaction === "up"
                  ? "border-success bg-success/10 text-success"
                  : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
              )}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Helpful
            </button>
            <button
              type="button"
              onClick={() => {
                setReaction("down");
                setSubmitted(true);
              }}
              aria-label="Not helpful"
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs transition-colors",
                reaction === "down"
                  ? "border-danger bg-danger/10 text-danger"
                  : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
              )}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              Not yet
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              Suggest improvement
            </button>
          </>
        )}
      </div>
    </div>
  );
}
