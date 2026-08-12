import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE_URL } from "@/lib/site";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  // Emitted alongside the visual trail so the two can never drift apart. The
  // final crumb is the current page and carries no href; schema.org allows a
  // trailing ListItem with a name but no `item`, which is exactly that case.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, SITE_URL).toString() } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={breadcrumbJsonLd} />
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight
                  className="h-3 w-3 text-subtle/60"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
