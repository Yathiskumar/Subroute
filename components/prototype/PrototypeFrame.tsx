"use client";

import * as React from "react";
import {
  RefreshCw,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Pointer,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { renderInline } from "@/components/shared/ProseRenderer";

// Logical width the prototype is scaled from in fullscreen (a touch wider than
// the prototypes' internal max-width so there's a little breathing room).
const FS_WIDTH = 1040;

export function PrototypeFrame({
  src,
  title,
  caption,
  className,
}: {
  src: string | null;
  title: string;
  caption?: string;
  className?: string;
}) {
  const figureRef = React.useRef<HTMLElement | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const [key, setKey] = React.useState(0);
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [fsScale, setFsScale] = React.useState(1);

  const reload = () => setKey((k) => k + 1);

  // Prototypes that know their own size post a `prototype:height` message;
  // we size the frame to fit so nothing is hidden behind a scrollbar.
  React.useEffect(() => {
    function onMessage(e: MessageEvent) {
      const node = iframeRef.current;
      if (!node || e.source !== node.contentWindow) return;
      const data = e.data as { type?: string; height?: number } | null;
      if (data?.type === "prototype:height" && typeof data.height === "number") {
        setContentHeight(Math.max(360, Math.ceil(data.height)));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Re-measure on reload or when the source changes.
  React.useEffect(() => {
    setContentHeight(null);
  }, [key, src]);

  // Track fullscreen state (covers Esc, browser controls, etc.).
  React.useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === figureRef.current);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onChange as EventListener,
      );
    };
  }, []);

  // In fullscreen, scale the prototype up so it fills the screen, centered.
  React.useEffect(() => {
    if (!isFullscreen) return;
    const compute = () => {
      const h = contentHeight ?? 640;
      const s = Math.min(
        (window.innerWidth * 0.99) / FS_WIDTH,
        // leave room for the toolbar (~44px) and a little margin
        (window.innerHeight - 56) / h,
      );
      setFsScale(Math.max(0.5, Math.min(s, 3)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [isFullscreen, contentHeight]);

  const toggleFullscreen = () => {
    const node = figureRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    } else {
      const req =
        node.requestFullscreen ??
        (node as unknown as { webkitRequestFullscreen?: () => Promise<void> })
          .webkitRequestFullscreen;
      void req?.call(node);
    }
  };

  return (
    <figure
      ref={figureRef as React.RefObject<HTMLElement>}
      className={cn(
        "overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated",
        isFullscreen && "flex h-screen w-screen flex-col rounded-none border-0",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle bg-surface-sunken/40 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent/70" />
            <span className="h-2 w-2 rounded-full bg-warning/70" />
            <span className="h-2 w-2 rounded-full bg-success/70" />
          </span>
          <span className="hidden h-4 w-px bg-border-subtle sm:block" />
          <span className="hidden font-mono text-2xs uppercase tracking-[0.12em] text-subtle sm:inline">
            simulation › {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={reload} aria-label="Refresh" disabled={!src}>
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Refresh</span>
          </ToolbarButton>
          <ToolbarButton onClick={reload} aria-label="Reset" disabled={!src}>
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            disabled={!src}
            className={cn(
              isFullscreen &&
                "border-accent/40 bg-accent/10 text-accent hover:border-accent hover:text-accent",
            )}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
            <span className="hidden md:inline">
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </span>
          </ToolbarButton>
        </div>
      </div>

      {/* Frame area. Normal: fit reported height. Fullscreen: scale to fill. */}
      <div
        className={cn(
          "relative bg-surface-sunken",
          isFullscreen
            ? "grid flex-1 place-items-center overflow-auto"
            : cn("w-full", contentHeight == null && "aspect-[16/10]"),
        )}
        style={
          !isFullscreen && contentHeight != null
            ? { height: contentHeight }
            : undefined
        }
      >
        {src ? (
          // One stable div > div > iframe tree in both modes so toggling
          // fullscreen never remounts (and resets) the running prototype.
          // Fullscreen: the OUTER box takes the *scaled* size so the grid can
          // center it, while the INNER box keeps the prototype's logical size
          // and scales from its top-left. (Scaling the inner box alone would
          // leave its unscaled height in layout, dropping the content into the
          // lower part of the screen with a big empty band on top.)
          <div
            className={isFullscreen ? "shrink-0" : "absolute inset-0"}
            style={
              isFullscreen
                ? {
                    width: FS_WIDTH * fsScale,
                    height: (contentHeight ?? 640) * fsScale,
                  }
                : undefined
            }
          >
            <div
              className={isFullscreen ? undefined : "h-full w-full"}
              style={
                isFullscreen
                  ? {
                      width: FS_WIDTH,
                      height: contentHeight ?? 640,
                      transform: `scale(${fsScale})`,
                      transformOrigin: "top left",
                    }
                  : undefined
              }
            >
              <iframe
                key={key}
                ref={iframeRef}
                src={src}
                title={`${title} prototype`}
                sandbox="allow-scripts"
                loading="lazy"
                className="block h-full w-full"
              />
            </div>
          </div>
        ) : (
          <PlaceholderPanel />
        )}
      </div>

      {caption && !isFullscreen ? (
        <figcaption className="flex items-start gap-3 border-t border-border-subtle bg-surface-elevated px-5 py-3 text-sm">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div>
            <p className="font-mono text-2xs uppercase tracking-[0.12em] text-accent">
              About this simulation
            </p>
            <p className="mt-1 text-muted">{renderInline(caption)}</p>
          </div>
        </figcaption>
      ) : null}
    </figure>
  );
}

function ToolbarButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md border border-border-subtle bg-transparent px-2 font-mono text-2xs uppercase tracking-[0.08em] text-muted transition-colors hover:border-border hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function PlaceholderPanel() {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-grid-fade opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-scan-line"
      />
      <div className="relative flex max-w-md flex-col items-center gap-3 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-border-subtle bg-surface-elevated">
          <Pointer className="h-5 w-5 text-accent" />
        </div>
        <p className="font-mono text-2xs uppercase tracking-[0.16em] text-accent">
          Coming soon
        </p>
        <h3 className="text-xl font-semibold tracking-tight">
          Interactive simulation loads here
        </h3>
        <p className="text-sm text-muted">
          Each concept ships with a sandboxed, hands-on prototype. The author
          wires the HTML file once and it loads in this frame.
        </p>
      </div>
    </div>
  );
}
