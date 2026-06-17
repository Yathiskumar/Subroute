"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  QUIZ_KEY_PREFIX,
  QUIZ_SYNC_EVENT,
  quizStorageKey,
  quizIdFromKey,
  type QuizResult,
} from "@/lib/utils/quiz-progress";

/**
 * Two-way sync between the localStorage quiz-result store and the Supabase
 * `quiz_results` table. Renders nothing. Same shape as ProgressSync:
 * localStorage stays the source the UI reads; this keeps it backed up.
 *
 * - On sign-in: pull cloud rows, MERGE field-wise with local (best score and
 *   attempt count are preserved from whichever side is higher; the most recent
 *   attempt supplies the latest score), write merged back, push merged up.
 * - After sign-in: every local change is upserted as a delta.
 */

type Row = { quizId: string } & QuizResult;

function readLocal(): Map<string, Row> {
  const out = new Map<string, Row>();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const quizId = quizIdFromKey(key);
    if (!quizId) continue;
    try {
      const r = JSON.parse(localStorage.getItem(key) ?? "") as QuizResult;
      out.set(quizId, { quizId, ...r });
    } catch {
      /* ignore malformed entries */
    }
  }
  return out;
}

/** Field-wise merge of two results for the same quiz (no data loss). */
function mergeResult(a: Row, b: Row): Row {
  const latest = a.completedAt >= b.completedAt ? a : b;
  return {
    quizId: a.quizId,
    score: latest.score,
    total: latest.total,
    completedAt: latest.completedAt,
    bestScore: Math.max(a.bestScore, b.bestScore),
    attempts: Math.max(a.attempts, b.attempts),
    // Keep whichever side actually has the chosen answers.
    selections: latest.selections ?? a.selections ?? b.selections,
  };
}

const sameResult = (a: Row | undefined, b: Row) =>
  !!a &&
  a.score === b.score &&
  a.total === b.total &&
  a.bestScore === b.bestScore &&
  a.attempts === b.attempts &&
  a.completedAt === b.completedAt;

export function QuizSync() {
  const { user, disabled } = useAuth();
  const cloud = React.useRef<Map<string, Row>>(new Map());
  const userId = user?.id ?? null;

  React.useEffect(() => {
    if (disabled || !userId) {
      cloud.current = new Map();
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    const upsert = async (rows: Row[]) => {
      if (!rows.length) return;
      await supabase.from("quiz_results").upsert(
        rows.map((r) => ({
          user_id: userId,
          quiz_id: r.quizId,
          score: r.score,
          total: r.total,
          best_score: r.bestScore,
          attempts: r.attempts,
          completed_at: r.completedAt,
          selections: r.selections ?? null,
        })),
        { onConflict: "user_id,quiz_id" },
      );
    };

    // Push any local row that differs from what we believe the cloud holds.
    const reconcile = async () => {
      const local = readLocal();
      const changed: Row[] = [];
      for (const [id, row] of local)
        if (!sameResult(cloud.current.get(id), row)) changed.push(row);
      await upsert(changed);
      if (!cancelled)
        for (const r of changed) cloud.current.set(r.quizId, r);
    };

    // Initial pull + merge.
    (async () => {
      const { data, error } = await supabase
        .from("quiz_results")
        .select(
          "quiz_id, score, total, best_score, attempts, completed_at, selections",
        );
      if (cancelled) return;

      const remote = new Map<string, Row>();
      if (!error) {
        for (const r of data ?? []) {
          remote.set(r.quiz_id as string, {
            quizId: r.quiz_id as string,
            score: r.score as number,
            total: r.total as number,
            bestScore: r.best_score as number,
            attempts: r.attempts as number,
            completedAt: r.completed_at as string,
            selections:
              (r.selections as Record<string, string> | null) ?? undefined,
          });
        }
      }

      const local = readLocal();
      const merged = new Map<string, Row>(remote);
      for (const [id, row] of local) {
        const existing = merged.get(id);
        merged.set(id, existing ? mergeResult(existing, row) : row);
      }

      // Write merged back to localStorage so the UI shows the unified state.
      for (const [id, row] of merged) {
        const { quizId: _omit, ...result } = row;
        void _omit;
        localStorage.setItem(quizStorageKey(id), JSON.stringify(result));
      }
      cloud.current = remote;

      await reconcile();
      window.dispatchEvent(new Event(QUIZ_SYNC_EVENT));
    })();

    const onChange = () => {
      void reconcile();
    };
    window.addEventListener(QUIZ_SYNC_EVENT, onChange);
    window.addEventListener("storage", onChange);

    return () => {
      cancelled = true;
      window.removeEventListener(QUIZ_SYNC_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [userId, disabled]);

  return null;
}
