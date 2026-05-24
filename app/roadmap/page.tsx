import Link from "next/link";
import { CheckCircle2, Hammer, Lightbulb } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

export const metadata = {
  title: "Roadmap",
  description: "Where Subroute is headed — shipped, in progress, and under consideration.",
};

const COLUMNS = [
  {
    icon: CheckCircle2,
    kicker: "Shipped",
    accent: "text-success",
    items: [
      "Rate Limiting — the five canonical algorithms.",
      "Cache Write Policies & Cache Eviction.",
      "Garbage Collection — eight collectors.",
      "Memory Allocation — six allocators.",
      "Load Balancing — nine algorithms, end-to-end.",
    ],
  },
  {
    icon: Hammer,
    kicker: "In progress",
    accent: "text-accent",
    items: [
      "Polishing prototypes and tightening explanations across existing tracks.",
      "Better fullscreen and mobile behavior for the larger simulations.",
      "Deeper, verified references on every concept.",
    ],
  },
  {
    icon: Lightbulb,
    kicker: "Under consideration",
    accent: "text-info",
    items: [
      "Consistent hashing & the hash ring, as its own deep dive.",
      "Consensus — Raft, leader election, and the log.",
      "Database indexing — B-trees and LSM-trees.",
      "Concurrency primitives — locks, semaphores, and queues.",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="container py-16">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Roadmap" }]} />
      <div className="mt-8 max-w-3xl">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <p className="kicker !text-accent">Resources</p>
        </div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          Roadmap
        </h1>
        <p className="mt-5 text-pretty text-lg text-muted">
          Subroute is built in the open, one topic at a time. This is the
          current thinking on what comes next — directions, not promises. The
          “under consideration” list shifts based on what people find useful.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <div
            key={col.kicker}
            className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-6"
          >
            <div className="flex items-center gap-2">
              <col.icon className={`h-4 w-4 ${col.accent}`} strokeWidth={1.75} />
              <p className="kicker">{col.kicker}</p>
            </div>
            <ul className="flex flex-col gap-3">
              {col.items.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-border-strong"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 max-w-3xl text-sm text-subtle">
        Have a topic you wish existed? Tell me on the{" "}
        <Link
          href="/contact"
          className="text-muted underline decoration-border-subtle underline-offset-4 transition-colors hover:text-foreground"
        >
          Contact
        </Link>{" "}
        page — requests genuinely shape this list.
      </p>
    </div>
  );
}
