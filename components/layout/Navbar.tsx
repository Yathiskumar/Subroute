"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const NAV_ITEMS = [
  { href: "/topics", label: "Topics" },
  { href: "/playground", label: "Playground" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-[15px] h-px bg-accent" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/topics"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-elevated text-muted transition-colors hover:border-border-strong hover:text-foreground md:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <MobileMenu items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
