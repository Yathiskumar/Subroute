"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/activity", label: "Activity" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 border-b border-border-subtle">
      {TABS.map((tab) => {
        const active =
          tab.href === "/admin"
            ? pathname === "/admin"
            : pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative px-3 py-2 text-sm transition-colors",
              active ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {tab.label}
            {active ? (
              <span className="absolute inset-x-3 -bottom-px h-0.5 bg-accent" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
