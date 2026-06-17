"use client";

import * as React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import type { UserRow } from "@/lib/admin/analytics";
import { cn } from "@/lib/utils/cn";

type SortKey = "email" | "createdAt" | "completions" | "quizzesTaken" | "lastActivity";

// Deterministic, locale-independent (UTC) — avoids server/client hydration drift.
const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

export function UsersTable({ rows }: { rows: UserRow[] }) {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("lastActivity");
  const [dir, setDir] = React.useState<"asc" | "desc">("desc");

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    const base = needle
      ? rows.filter((r) => r.email.toLowerCase().includes(needle))
      : rows;
    const sorted = [...base].sort((a, b) => {
      let cmp = 0;
      if (sort === "email") cmp = a.email.localeCompare(b.email);
      else if (sort === "completions") cmp = a.completions - b.completions;
      else if (sort === "quizzesTaken") cmp = a.quizzesTaken - b.quizzesTaken;
      else {
        const av = new Date(a[sort] ?? 0).getTime();
        const bv = new Date(b[sort] ?? 0).getTime();
        cmp = av - bv;
      }
      return dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [rows, q, sort, dir]);

  const toggleSort = (key: SortKey) => {
    if (sort === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setDir(key === "email" ? "asc" : "desc");
    }
  };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="px-3 py-2 text-left font-medium">
      <button
        type="button"
        onClick={() => toggleSort(k)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          sort === k ? "text-foreground" : "text-muted",
        )}
      >
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </button>
    </th>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email…"
            className="h-9 w-full rounded-md border border-border bg-surface-elevated pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
          />
        </div>
        <span className="shrink-0 text-xs text-muted">
          {filtered.length} of {rows.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead className="border-b border-border-subtle bg-surface-elevated text-xs uppercase tracking-wide">
            <tr>
              <Th label="Email" k="email" />
              <Th label="Joined" k="createdAt" />
              <Th label="Completed" k="completions" />
              <Th label="Quizzes" k="quizzesTaken" />
              <Th label="Last active" k="lastActivity" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={`${r.email}-${i}`}
                className="border-b border-border-subtle last:border-0 hover:bg-surface-elevated/50"
              >
                <td className="px-3 py-2.5 text-foreground">{r.email}</td>
                <td className="px-3 py-2.5 text-muted">{fmtDate(r.createdAt)}</td>
                <td className="px-3 py-2.5 tabular-nums text-foreground">
                  {r.completions}
                </td>
                <td className="px-3 py-2.5 tabular-nums text-foreground">
                  {r.quizzesTaken}
                </td>
                <td className="px-3 py-2.5 text-muted">
                  {fmtDate(r.lastActivity)}
                </td>
              </tr>
            ))}
            {!filtered.length ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-muted">
                  No users found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
