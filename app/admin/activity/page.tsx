import { CheckCircle2, ListChecks } from "lucide-react";
import { tryLoadRawData, recentActivity } from "@/lib/admin/analytics";
import { Panel, NotConfigured } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
function fmt(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${hh}:${mm} UTC`;
}

export default async function AdminActivityPage() {
  const raw = await tryLoadRawData();
  if (!raw) return <NotConfigured />;
  const items = recentActivity(raw, 50);

  return (
    <Panel
      title="Recent activity"
      description="Latest completions and quiz submissions across all users"
    >
      {items.length ? (
        <ul className="flex flex-col">
          {items.map((it, i) => (
            <li
              key={i}
              className="flex items-center gap-3 border-b border-border-subtle py-3 last:border-0"
            >
              <span
                className={
                  it.kind === "completed" ? "text-success" : "text-accent"
                }
              >
                {it.kind === "completed" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <ListChecks className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">
                  <span className="font-medium">{it.email}</span>{" "}
                  <span className="text-muted">
                    {it.kind === "completed"
                      ? "completed"
                      : `scored ${it.detail} on`}
                  </span>{" "}
                  {it.label}
                </p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-subtle">
                {fmt(it.at)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No activity yet.</p>
      )}
    </Panel>
  );
}
