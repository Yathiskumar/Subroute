"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "./AuthProvider";

/**
 * Navbar auth control: a "Sign in" link when logged out, or an avatar button
 * with a sign-out popover when logged in. Renders nothing until auth resolves
 * (and nothing at all when auth isn't configured) so there's no flicker.
 */
export function UserMenu() {
  const { user, loading, disabled } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Ask the server whether this session is an admin (allowlist stays server-side).
  React.useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        if (active) setIsAdmin(!!d.isAdmin);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user]);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (disabled || loading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface-elevated px-3 text-sm font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface"
      >
        Sign in
      </Link>
    );
  }

  const label =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    "Account";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const initial = label.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-elevated text-sm font-medium text-foreground transition-colors hover:border-border-strong"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span>{initial}</span>
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg"
        >
          <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2.5">
            <UserIcon className="h-4 w-4 shrink-0 text-muted" />
            <span className="truncate text-sm text-foreground" title={label}>
              {label}
            </span>
          </div>
          {isAdmin ? (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 border-b border-border-subtle px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin dashboard
            </Link>
          ) : null}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-foreground",
              )}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
