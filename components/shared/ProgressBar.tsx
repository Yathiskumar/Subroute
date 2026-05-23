import { cn } from "@/lib/utils/cn";

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-[0.1em] text-muted">
          <span>{label}</span>
          <span className="text-foreground num-tabular">{pct}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent/70 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
