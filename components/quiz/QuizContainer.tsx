"use client";

import * as React from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { QuizItem } from "@/lib/types";
import { QuizQuestion } from "./QuizQuestion";

/** Fisher–Yates shuffle of each question's options (answer position varies). */
function shuffleOptions(list: QuizItem[]): QuizItem[] {
  return list.map((it) => {
    const opts = [...it.options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return { ...it, options: opts };
  });
}

export function QuizContainer({
  items,
  className,
}: {
  items: QuizItem[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(true);
  const [selections, setSelections] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);
  // Render the authored order on the server, then shuffle on the client so the
  // correct answer never sits in a fixed slot (and reshuffles each visit/reset).
  const [displayItems, setDisplayItems] = React.useState<QuizItem[]>(items);
  React.useEffect(() => {
    setDisplayItems(shuffleOptions(items));
  }, [items]);

  const allAnswered = items.every((it) => selections[it.id]);
  const correctCount = items.filter(
    (it) => selections[it.id] === it.correctOptionId,
  ).length;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="group flex w-full items-center justify-between gap-4 border-b border-border-subtle bg-surface-elevated px-6 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-md border border-border-subtle bg-background font-mono text-xs text-accent">
                Q
              </span>
              <div>
                <p className="font-mono text-2xs uppercase tracking-[0.12em] text-accent">
                  Knowledge check
                </p>
                <p className="text-sm text-muted">
                  {items.length} questions
                  {submitted ? ` · scored ${correctCount}/${items.length}` : " · no scoring yet"}
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted transition-transform duration-300",
                open && "rotate-180",
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-4 p-6">
            {displayItems.map((item, idx) => (
              <QuizQuestion
                key={item.id}
                item={item}
                index={idx}
                total={items.length}
                selection={selections[item.id] ?? null}
                submitted={submitted}
                onSelect={(optionId) => {
                  if (submitted) return;
                  setSelections((prev) => ({ ...prev, [item.id]: optionId }));
                }}
              />
            ))}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-5">
              <p className="font-mono text-2xs uppercase tracking-[0.1em] text-subtle">
                {submitted
                  ? `you got ${correctCount} of ${items.length} right`
                  : `${Object.keys(selections).length}/${items.length} answered`}
              </p>
              {submitted ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelections({});
                    setSubmitted(false);
                    setDisplayItems(shuffleOptions(items));
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={!allAnswered}
                  onClick={() => setSubmitted(true)}
                >
                  Submit answers
                </Button>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
