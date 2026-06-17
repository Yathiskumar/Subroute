import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type AppUser = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
};
export type ProgressRow = {
  userId: string;
  roadmapSlug: string;
  topicId: string;
  completedAt: string;
};
export type QuizRow = {
  userId: string;
  quizId: string;
  score: number;
  total: number;
  bestScore: number;
  attempts: number;
  completedAt: string;
};
export type RawData = {
  users: AppUser[];
  progress: ProgressRow[];
  quizzes: QuizRow[];
};

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const shortDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
const PASS_THRESHOLD = 0.7;

/** One round-trip per source; everything else is computed in memory. */
export async function loadRawData(): Promise<RawData> {
  const supabase = createAdminClient();

  // Users come from the auth admin API (paginated).
  const users: AppUser[] = [];
  const perPage = 1000;
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });
    // A rejected key fails on the first page — surface it as "not configured".
    if (error) {
      if (page === 1) throw error;
      break;
    }
    const batch = data.users ?? [];
    users.push(
      ...batch.map((u) => ({
        id: u.id,
        email: u.email ?? null,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
      })),
    );
    if (batch.length < perPage) break;
  }

  const [{ data: pData }, { data: qData }] = await Promise.all([
    supabase
      .from("progress")
      .select("user_id, roadmap_slug, topic_id, completed_at"),
    supabase
      .from("quiz_results")
      .select("user_id, quiz_id, score, total, best_score, attempts, completed_at"),
  ]);

  const progress: ProgressRow[] = (pData ?? []).map((r) => ({
    userId: r.user_id as string,
    roadmapSlug: r.roadmap_slug as string,
    topicId: r.topic_id as string,
    completedAt: r.completed_at as string,
  }));
  const quizzes: QuizRow[] = (qData ?? []).map((r) => ({
    userId: r.user_id as string,
    quizId: r.quiz_id as string,
    score: r.score as number,
    total: r.total as number,
    bestScore: r.best_score as number,
    attempts: r.attempts as number,
    completedAt: r.completed_at as string,
  }));

  return { users, progress, quizzes };
}

/** Like loadRawData but returns null when the key is missing or rejected. */
export async function tryLoadRawData(): Promise<RawData | null> {
  if (!process.env.SUPABASE_SECRET_KEY) return null;
  try {
    return await loadRawData();
  } catch {
    return null;
  }
}

// ---------- Overview ----------

export type Overview = {
  totalUsers: number;
  newUsers7: number;
  newUsers30: number;
  activeUsers7: number;
  totalCompletions: number;
  quizzesTaken: number;
  totalQuizAttempts: number;
  avgScorePct: number;
  passRatePct: number;
};

export function overview(raw: RawData, now = new Date()): Overview {
  const ms = now.getTime();
  const within = (iso: string | null, days: number) =>
    !!iso && ms - new Date(iso).getTime() <= days * 86_400_000;

  const scored = raw.quizzes.filter((q) => q.total > 0);
  const avgScorePct = scored.length
    ? Math.round(
        (scored.reduce((s, q) => s + q.bestScore / q.total, 0) /
          scored.length) *
          100,
      )
    : 0;
  const passRatePct = scored.length
    ? Math.round(
        (scored.filter((q) => q.bestScore / q.total >= PASS_THRESHOLD).length /
          scored.length) *
          100,
      )
    : 0;

  return {
    totalUsers: raw.users.length,
    newUsers7: raw.users.filter((u) => within(u.createdAt, 7)).length,
    newUsers30: raw.users.filter((u) => within(u.createdAt, 30)).length,
    activeUsers7: raw.users.filter((u) => within(u.lastSignInAt, 7)).length,
    totalCompletions: raw.progress.length,
    quizzesTaken: raw.quizzes.length,
    totalQuizAttempts: raw.quizzes.reduce((s, q) => s + q.attempts, 0),
    avgScorePct,
    passRatePct,
  };
}

export type Point = { label: string; value: number };

/** Daily signups for the last `days` days (oldest → newest). */
export function signupSeries(raw: RawData, days = 30, now = new Date()): Point[] {
  const counts = new Map<string, number>();
  for (const u of raw.users) {
    const k = u.createdAt.slice(0, 10);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const out: Point[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000);
    out.push({ label: shortDate(d), value: counts.get(dayKey(d)) ?? 0 });
  }
  return out;
}

export function completionsByRoadmap(raw: RawData): Point[] {
  const counts = new Map<string, number>();
  for (const p of raw.progress)
    counts.set(p.roadmapSlug, (counts.get(p.roadmapSlug) ?? 0) + 1);
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

// ---------- Users table ----------

export type UserRow = {
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  completions: number;
  quizzesTaken: number;
  lastActivity: string | null;
};

export function usersTable(raw: RawData): UserRow[] {
  const byUser = new Map<
    string,
    { completions: number; quizzes: number; last: number }
  >();
  const bump = (id: string, iso: string, kind: "c" | "q") => {
    const cur = byUser.get(id) ?? { completions: 0, quizzes: 0, last: 0 };
    if (kind === "c") cur.completions++;
    else cur.quizzes++;
    cur.last = Math.max(cur.last, new Date(iso).getTime());
    byUser.set(id, cur);
  };
  raw.progress.forEach((p) => bump(p.userId, p.completedAt, "c"));
  raw.quizzes.forEach((q) => bump(q.userId, q.completedAt, "q"));

  return raw.users
    .map((u) => {
      const agg = byUser.get(u.id);
      const lastFromActivity = agg?.last ? new Date(agg.last).toISOString() : null;
      const lastActivity =
        [lastFromActivity, u.lastSignInAt]
          .filter(Boolean)
          .sort()
          .pop() ?? null;
      return {
        email: u.email ?? "(no email)",
        createdAt: u.createdAt,
        lastSignInAt: u.lastSignInAt,
        completions: agg?.completions ?? 0,
        quizzesTaken: agg?.quizzes ?? 0,
        lastActivity,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.lastActivity ?? b.createdAt).getTime() -
        new Date(a.lastActivity ?? a.createdAt).getTime(),
    );
}

// ---------- Content engagement ----------

export type QuizStat = {
  quizId: string;
  label: string;
  takers: number;
  attempts: number;
  avgPct: number;
};

/** Turn "topics/sorting/bubble" into a readable label. */
export function quizLabel(quizId: string): string {
  const parts = quizId.split("/");
  if (parts.length === 3) {
    const [kind, group, item] = parts;
    const k = kind === "roadmaps" ? "Roadmap" : "Topic";
    return `${k} · ${group} / ${item}`;
  }
  return quizId;
}

export function quizStats(raw: RawData): QuizStat[] {
  const byQuiz = new Map<string, QuizRow[]>();
  for (const q of raw.quizzes) {
    if (!byQuiz.has(q.quizId)) byQuiz.set(q.quizId, []);
    byQuiz.get(q.quizId)!.push(q);
  }
  return [...byQuiz.entries()]
    .map(([quizId, rows]) => {
      const scored = rows.filter((r) => r.total > 0);
      const avgPct = scored.length
        ? Math.round(
            (scored.reduce((s, r) => s + r.bestScore / r.total, 0) /
              scored.length) *
              100,
          )
        : 0;
      return {
        quizId,
        label: quizLabel(quizId),
        takers: rows.length,
        attempts: rows.reduce((s, r) => s + r.attempts, 0),
        avgPct,
      };
    })
    .sort((a, b) => b.takers - a.takers);
}

// ---------- Recent activity ----------

export type ActivityItem = {
  kind: "completed" | "quiz";
  email: string;
  label: string;
  detail?: string;
  at: string;
};

export function recentActivity(raw: RawData, limit = 40): ActivityItem[] {
  const emailById = new Map(raw.users.map((u) => [u.id, u.email ?? "(no email)"]));
  const events: ActivityItem[] = [
    ...raw.progress.map<ActivityItem>((p) => ({
      kind: "completed",
      email: emailById.get(p.userId) ?? "(unknown)",
      label: `${p.roadmapSlug} · topic ${p.topicId}`,
      at: p.completedAt,
    })),
    ...raw.quizzes.map<ActivityItem>((q) => ({
      kind: "quiz",
      email: emailById.get(q.userId) ?? "(unknown)",
      label: quizLabel(q.quizId),
      detail: `${q.bestScore}/${q.total}`,
      at: q.completedAt,
    })),
  ];
  return events
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit);
}
