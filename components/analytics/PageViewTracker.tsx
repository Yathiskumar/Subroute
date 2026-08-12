"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Reports each page view to /api/track.
 *
 * Deliberately reads `window.location.search` instead of useSearchParams() —
 * the hook forces every page that renders this component into a Suspense
 * boundary and opts static routes into dynamic rendering, which is a steep
 * price for a fire-and-forget beacon.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  // React Strict Mode mounts effects twice in dev; this keeps the count honest.
  const lastSent = useRef<string | null>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (!pathname) return;
    const url = window.location.href;
    if (lastSent.current === url) return;
    lastSent.current = url;

    const initial = isFirst.current;
    isFirst.current = false;

    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        url,
        // Only meaningful on the landing view — see the route's attribution note.
        referrer: initial ? document.referrer || null : null,
        initial,
      }),
      // Survives the navigation that triggered it.
      keepalive: true,
    }).catch(() => {
      // Blocked by an ad blocker or offline — nothing to do, and nothing to say.
    });
  }, [pathname]);

  return null;
}
