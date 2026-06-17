import { cn } from "@/lib/utils/cn";
import type { Point } from "@/lib/admin/analytics";

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5">
      <p className="kicker text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border-subtle bg-surface-elevated p-5",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Horizontal labelled bars, e.g. completions per roadmap. */
export function BarList({
  items,
  emptyText = "No data yet.",
  valueSuffix = "",
}: {
  items: { label: string; value: number }[];
  emptyText?: string;
  valueSuffix?: string;
}) {
  if (!items.length)
    return <p className="text-sm text-muted">{emptyText}</p>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((it) => (
        <li key={it.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-foreground" title={it.label}>
              {it.label}
            </span>
            <span className="shrink-0 tabular-nums text-muted">
              {it.value}
              {valueSuffix}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70"
              style={{ width: `${(it.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Vertical mini bars for a time series (e.g. daily signups). */
export function TrendBars({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div>
      <div className="flex h-32 items-end gap-0.5">
        {data.map((d, i) => (
          <div
            key={i}
            className="group relative flex-1"
            title={`${d.label}: ${d.value}`}
          >
            <div
              className="w-full rounded-sm bg-accent/70 transition-colors group-hover:bg-accent"
              style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-2xs text-subtle">
        <span>{data[0]?.label}</span>
        <span className="tabular-nums">{total} total</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/** Shown when SUPABASE_SECRET_KEY isn't configured yet. */
export function NotConfigured() {
  return (
    <div className="rounded-xl border border-danger/40 bg-danger/10 p-6">
      <h2 className="text-sm font-semibold text-foreground">
        Analytics not configured
      </h2>
      <p className="mt-1 text-sm text-muted">
        Set <code className="text-foreground">SUPABASE_SECRET_KEY</code> in your
        environment (Supabase → Settings → API Keys → Secret key) and restart the
        server. The key bypasses row-level security to read all-user analytics,
        so it must stay server-side.
      </p>
    </div>
  );
}
