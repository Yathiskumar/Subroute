"use client";

import { cn } from "@/lib/utils/cn";

export function TagChip({
  label,
  active,
  onClick,
  asButton = true,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  asButton?: boolean;
}) {
  const className = cn(
    "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 font-mono text-2xs uppercase tracking-[0.08em] transition-all",
    active
      ? "border-accent bg-accent/10 text-accent"
      : "border-border bg-surface-elevated text-muted hover:border-border-strong hover:text-foreground",
  );

  if (!asButton) {
    return <span className={className}>{label}</span>;
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {active ? <span className="h-1.5 w-1.5 rounded-full bg-accent" /> : null}
      {label}
    </button>
  );
}
