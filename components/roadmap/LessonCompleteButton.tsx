"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthGate } from "@/components/auth/useAuthGate";
import {
  PROGRESS_SYNC_EVENT,
  progressStorageKey,
} from "@/lib/utils/roadmap-progress";

/**
 * Toggles this topic's completion in the same localStorage store the roadmap
 * reads, so checking it off here updates the roadmap (and vice versa).
 */
export function LessonCompleteButton({
  roadmapSlug,
  topicId,
  className,
}: {
  roadmapSlug: string;
  topicId: string | null;
  className?: string;
}) {
  const storageKey = progressStorageKey(roadmapSlug);
  const [done, setDone] = React.useState(false);
  const { gated, loginHref } = useAuthGate();

  const read = React.useCallback(() => {
    if (!topicId) return false;
    try {
      const raw = localStorage.getItem(storageKey);
      const set = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
      return set.has(topicId);
    } catch {
      return false;
    }
  }, [storageKey, topicId]);

  React.useEffect(() => {
    setDone(read());
    const resync = () => setDone(read());
    // Keep every instance on the page (and other tabs) in agreement.
    window.addEventListener(PROGRESS_SYNC_EVENT, resync);
    window.addEventListener("storage", resync);
    return () => {
      window.removeEventListener(PROGRESS_SYNC_EVENT, resync);
      window.removeEventListener("storage", resync);
    };
  }, [read]);

  const toggle = () => {
    if (!topicId) return;
    try {
      const raw = localStorage.getItem(storageKey);
      const set = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
      if (set.has(topicId)) set.delete(topicId);
      else set.add(topicId);
      localStorage.setItem(storageKey, JSON.stringify([...set]));
      setDone(set.has(topicId));
      window.dispatchEvent(new Event(PROGRESS_SYNC_EVENT));
    } catch {
      /* ignore */
    }
  };

  if (!topicId) return null;

  // Signed out (with auth configured): prompt sign-in instead of toggling.
  if (gated) {
    return (
      <Link
        href={loginHref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-elevated px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface",
          className,
        )}
      >
        <Lock className="h-4 w-4" />
        Sign in to mark complete
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={done}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors",
        done
          ? "border-success/40 bg-success/10 text-success hover:bg-success/15"
          : "border-border bg-surface-elevated text-foreground hover:border-border-strong hover:bg-surface",
        className,
      )}
    >
      {done ? (
        <Check className="h-4 w-4" strokeWidth={2.5} />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {done ? "Completed" : "Mark as complete"}
    </button>
  );
}
