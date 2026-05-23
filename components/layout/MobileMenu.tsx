"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";

export function MobileMenu({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-elevated text-muted transition-colors hover:border-border-strong hover:text-foreground md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent side="right" className="border-l border-border">
        <div className="mt-8 flex flex-col gap-1">
          <p className="kicker mb-3">Navigate</p>
          {items.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-base font-medium transition-colors",
                  active
                    ? "bg-surface-elevated text-foreground"
                    : "text-muted hover:bg-surface-elevated hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
