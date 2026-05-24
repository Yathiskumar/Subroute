"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Background grid that brightens around the cursor. A faint static grid sits
 * underneath; a brighter accent-tinted copy is revealed through a radial mask
 * that follows the pointer, so the cells under your cursor light up.
 */
export function InteractiveGrid({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        el.style.setProperty("--spot", inside ? "1" : "0");
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      {/* faint static grid */}
      <div className="absolute inset-0 bg-grid-fade" />
      {/* bright accent grid + glow, revealed in a circle around the cursor */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--spot, 0)" as React.CSSProperties["opacity"],
          backgroundImage:
            "radial-gradient(160px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--accent) / 0.14) 0%, transparent 70%)," +
            "linear-gradient(to right, hsl(var(--accent) / 0.6) 1px, transparent 1px)," +
            "linear-gradient(to bottom, hsl(var(--accent) / 0.6) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 56px 56px, 56px 56px",
          WebkitMaskImage:
            "radial-gradient(150px circle at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(0,0,0,0.35) 48%, transparent 72%)",
          maskImage:
            "radial-gradient(150px circle at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(0,0,0,0.35) 48%, transparent 72%)",
        }}
      />
    </div>
  );
}
