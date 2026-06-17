/**
 * Shared helpers for quiz-result persistence (localStorage).
 * Mirrors the roadmap-progress pattern: localStorage is the single source the
 * UI reads, and QuizSync mirrors it to Supabase when signed in.
 * Change the format in ONE place only.
 */

export type QuizResult = {
  /** Correct answers in the most recent attempt. */
  score: number;
  /** Number of questions. */
  total: number;
  /** Best correct count across all attempts. */
  bestScore: number;
  /** How many times this quiz has been submitted. */
  attempts: number;
  /** ISO timestamp of the latest attempt. */
  completedAt: string;
  /** The options chosen in the latest attempt (questionId → optionId), so the
   *  completed quiz can be restored on reload. */
  selections?: Record<string, string>;
};

/** Shared prefix for every per-quiz localStorage key. */
export const QUIZ_KEY_PREFIX = "quiz-result:";

export function quizStorageKey(quizId: string): string {
  return `${QUIZ_KEY_PREFIX}${quizId}`;
}

/** Recover the quiz id from a full storage key, or null if it isn't one. */
export function quizIdFromKey(key: string): string | null {
  return key.startsWith(QUIZ_KEY_PREFIX)
    ? key.slice(QUIZ_KEY_PREFIX.length)
    : null;
}

/** Fired on the window when any quiz result changes, so widgets resync. */
export const QUIZ_SYNC_EVENT = "quiz-result-change";

export function readQuizResult(quizId: string): QuizResult | null {
  try {
    const raw = localStorage.getItem(quizStorageKey(quizId));
    return raw ? (JSON.parse(raw) as QuizResult) : null;
  } catch {
    return null;
  }
}

/**
 * Record an attempt: keeps the best score, bumps the attempt count, and stores
 * the latest score. Returns the merged result that was written.
 */
export function recordQuizResult(
  quizId: string,
  score: number,
  total: number,
  now: string,
  selections?: Record<string, string>,
): QuizResult {
  const prev = readQuizResult(quizId);
  const merged: QuizResult = {
    score,
    total,
    bestScore: Math.max(score, prev?.bestScore ?? 0),
    attempts: (prev?.attempts ?? 0) + 1,
    completedAt: now,
    selections,
  };
  try {
    localStorage.setItem(quizStorageKey(quizId), JSON.stringify(merged));
    window.dispatchEvent(new Event(QUIZ_SYNC_EVENT));
  } catch {
    /* ignore quota / private-mode errors */
  }
  return merged;
}
