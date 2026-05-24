import Link from "next/link";
import { ArrowRight, MousePointerClick, Heart, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container py-16">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <div className="mt-8 max-w-3xl">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <p className="kicker !text-accent">About Subroute</p>
        </div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          We&apos;re tired of static diagrams.
        </h1>
        <p className="mt-5 text-pretty text-lg text-muted">
          Subroute is an experiment in teaching technical concepts the way most
          engineers actually learn them in practice: by running the thing,
          breaking it, and seeing what happens. Every page on this site is
          built around an interactive prototype, not just words about one.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: MousePointerClick,
            kicker: "Principle 01",
            title: "Show, then tell",
            body: "The simulation comes first. Words label what you've already touched, instead of trying to replace the touching.",
          },
          {
            icon: Heart,
            kicker: "Principle 02",
            title: "No filler",
            body: "Every paragraph earns its place. If a section doesn't move your mental model forward, we cut it.",
          },
          {
            icon: Code2,
            kicker: "Principle 03",
            title: "Open prototype",
            body: "Each demo is a standalone HTML file. Read the source, fork it, build your own. No frameworks required.",
          },
        ].map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-6"
          >
            <div className="flex items-center justify-between">
              <p className="kicker">{p.kicker}</p>
              <p.icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
            <p className="text-sm text-muted">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <SectionHeading
          kicker="Currently"
          title="Built in the open, one topic at a time."
          description="Several tracks are live end-to-end — written explanations, interactive prototypes, and quizzes. New topics ship regularly; see what's landed on the changelog and what's coming on the roadmap."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/topics">
              Browse the library <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/topics/rate-limiting/token-bucket">
              See the working demo <MousePointerClick />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
