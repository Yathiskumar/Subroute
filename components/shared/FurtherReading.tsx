import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  FileText,
  Newspaper,
  PlayCircle,
  ScrollText,
  Link2,
  type LucideIcon,
} from "lucide-react";
import type { FurtherReading as FurtherReadingItem } from "@/lib/content/types";
import { renderInline } from "@/components/shared/ProseRenderer";
import { cn } from "@/lib/utils/cn";

type KindMeta = { label: string; Icon: LucideIcon; className: string };

const KIND: Record<NonNullable<FurtherReadingItem["kind"]>, KindMeta> = {
  paper: { label: "Paper", Icon: FileText, className: "text-info" },
  book: { label: "Book", Icon: BookOpen, className: "text-warning" },
  docs: { label: "Docs", Icon: BookMarked, className: "text-success" },
  article: { label: "Article", Icon: Newspaper, className: "text-accent" },
  video: { label: "Talk", Icon: PlayCircle, className: "text-danger" },
  spec: { label: "Spec", Icon: ScrollText, className: "text-muted" },
};

const FALLBACK: KindMeta = { label: "Link", Icon: Link2, className: "text-muted" };

function domainOf(href: string): string | null {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function FurtherReading({ items }: { items: FurtherReadingItem[] }) {
  if (!items?.length) return null;

  return (
    <section
      id="references"
      aria-labelledby="references-heading"
      className="scroll-mt-20 rounded-2xl border border-border-subtle bg-surface-elevated/60 p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <BookMarked className="h-4 w-4 text-accent" />
        <h3 id="references-heading" className="kicker !text-accent">
          References &amp; further reading
        </h3>
        <span className="ml-auto text-xs text-subtle">
          {items.length} source{items.length === 1 ? "" : "s"}
        </span>
      </div>

      <ul className="grid gap-2.5 sm:grid-cols-2">
        {items.map((r, i) => {
          const meta = r.kind ? KIND[r.kind] : FALLBACK;
          const { Icon } = meta;
          const domain = r.href ? domainOf(r.href) : null;
          const linked = Boolean(r.href);

          const inner = (
            <>
              <span
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface",
                  meta.className,
                )}
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-[0.08em]",
                      meta.className,
                    )}
                  >
                    {meta.label}
                  </span>
                  {domain ? (
                    <span className="truncate font-mono text-[10px] text-subtle">
                      {domain}
                    </span>
                  ) : null}
                  {linked ? (
                    <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-subtle transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-accent" />
                  ) : null}
                </div>

                <p
                  className={cn(
                    "mt-1 text-sm font-medium leading-snug text-foreground",
                    linked && "group-hover:text-accent",
                  )}
                >
                  {renderInline(r.label)}
                </p>

                {r.note ? (
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {renderInline(r.note)}
                  </p>
                ) : null}
              </div>
            </>
          );

          const cardClass = cn(
            "group flex h-full gap-3 rounded-xl border border-border-subtle p-3.5 transition-colors",
            linked
              ? "bg-surface/40 hover:border-accent/50 hover:bg-surface-elevated"
              : "bg-surface/20",
          );

          return (
            <li key={i}>
              {linked ? (
                <a
                  href={r.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cardClass}
                >
                  {inner}
                </a>
              ) : (
                <div className={cardClass}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
