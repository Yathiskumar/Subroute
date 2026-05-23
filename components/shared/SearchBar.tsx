"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search topics...",
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex h-11 w-full items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 transition-colors focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/40",
        className,
      )}
    >
      <Search
        aria-hidden
        className="h-4 w-4 shrink-0 text-subtle transition-colors group-focus-within:text-accent"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="rounded p-1 text-subtle transition-colors hover:bg-background hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd className="hidden h-5 items-center rounded border border-border-subtle bg-background px-1.5 font-mono text-2xs text-subtle sm:inline-flex">
          ⌘ K
        </kbd>
      )}
    </div>
  );
}
