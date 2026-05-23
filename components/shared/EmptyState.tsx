import type { ReactNode } from "react";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/40 py-16 px-6 text-center",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dot-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
      />
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-surface-elevated text-muted">
        {icon ?? <Compass className="h-5 w-5" />}
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description ? (
        <p className="max-w-sm text-pretty text-sm text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
