import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground",
        className,
      )}
      aria-label="Subroute home"
    >
      <span
        aria-hidden
        className="relative grid h-7 w-7 place-items-center rounded-md border border-border bg-surface-elevated transition-colors group-hover:border-accent"
      >
        <span className="absolute inset-1 rounded-[5px] bg-gradient-to-br from-accent/80 to-accent/40 opacity-90" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-background" />
      </span>
      <span className="flex items-baseline">
        <span>subroute</span>
        <span className="ml-0.5 text-accent">.</span>
      </span>
    </Link>
  );
}
