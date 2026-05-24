import * as React from "react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

/** Shared shell for the Privacy / Terms / License prose pages. */
export function LegalDoc({
  kicker,
  title,
  updated,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container py-16">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />
      <div className="mt-8 max-w-3xl">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <p className="kicker !text-accent">{kicker}</p>
        </div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
          Last updated: {updated}
        </p>
        <p className="mt-6 text-pretty text-lg text-muted">{intro}</p>
        <div className="mt-12 flex flex-col gap-10">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {heading}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-pretty leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 leading-relaxed text-muted">
          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
