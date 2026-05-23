"use client";

import { Check, X, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { renderInline } from "@/components/shared/ProseRenderer";
import type { QuizItem } from "@/lib/types";

export function QuizQuestion({
  item,
  index,
  total,
  selection,
  submitted,
  onSelect,
}: {
  item: QuizItem;
  index: number;
  total: number;
  /** The user's currently chosen option id, whether or not submitted */
  selection: string | null;
  /** Whether the quiz has been submitted (locks input + reveals correctness) */
  submitted: boolean;
  onSelect: (optionId: string) => void;
}) {
  const correct = selection === item.correctOptionId;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-6">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
          question {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        {submitted && selection !== null ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-[0.1em]",
              correct ? "text-success" : "text-danger",
            )}
          >
            {correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {correct ? "correct" : "review"}
          </span>
        ) : null}
      </div>
      <h4 className="text-lg font-medium leading-snug tracking-tight">
        {item.question}
      </h4>
      <div className="flex flex-col gap-2">
        {item.options.map((opt) => {
          const isSelected = selection === opt.id;
          const isCorrect = item.correctOptionId === opt.id;
          // Before submit: only "selected" or "neutral".
          // After submit: correct answer always lights up; user's wrong pick goes red.
          let state: "neutral" | "selected" | "correct" | "wrong";
          if (!submitted) {
            state = isSelected ? "selected" : "neutral";
          } else if (isCorrect) {
            state = "correct";
          } else if (isSelected) {
            state = "wrong";
          } else {
            state = "neutral";
          }
          return (
            <button
              type="button"
              key={opt.id}
              disabled={submitted}
              aria-pressed={isSelected}
              onClick={() => onSelect(opt.id)}
              className={cn(
                "group flex items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-all duration-150",
                state === "neutral" &&
                  "border-border bg-surface text-foreground/85 hover:border-border-strong hover:text-foreground",
                state === "selected" &&
                  "border-accent bg-accent/15 text-foreground ring-1 ring-accent/40 shadow-[0_0_0_3px_hsl(var(--accent)/0.08)]",
                state === "correct" && "border-success bg-success/15 text-foreground",
                state === "wrong" && "border-danger bg-danger/15 text-foreground",
                submitted && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-2xs font-semibold transition-colors",
                  state === "neutral" && "border-border text-subtle",
                  state === "selected" && "border-accent bg-accent text-accent-foreground",
                  state === "correct" && "border-success bg-success text-white",
                  state === "wrong" && "border-danger bg-danger text-white",
                )}
              >
                {String.fromCharCode(65 + item.options.indexOf(opt))}
              </span>
              <span
                className={cn(
                  "transition-colors",
                  state === "selected" && "font-medium",
                )}
              >
                {opt.label}
              </span>
              {submitted && isCorrect ? (
                <Check className="ml-auto h-4 w-4 text-success" />
              ) : null}
              {submitted && isSelected && !isCorrect ? (
                <X className="ml-auto h-4 w-4 text-danger" />
              ) : null}
            </button>
          );
        })}
      </div>
      {submitted ? (
        <div className="flex gap-2.5 rounded-md border border-border-subtle bg-surface px-4 py-3 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>{renderInline(item.explanation)}</span>
        </div>
      ) : null}
    </div>
  );
}
