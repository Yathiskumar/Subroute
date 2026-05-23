import Link from "next/link";
import {
  ArrowRight,
  MousePointerClick,
  Compass,
  Sparkles,
  Brain,
  Layers,
  Zap,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/cards/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TOPICS } from "@/lib/data/topics";

const FEATURED = TOPICS;

const STEPS = [
  {
    n: "01",
    icon: Compass,
    title: "Pick a topic",
    body: "Browse a curated set of CS and system-design topics. Each is broken into bite-sized concepts.",
  },
  {
    n: "02",
    icon: Layers,
    title: "Explore a concept",
    body: "Read the why, then keep going. Diagrams, code, and short notes that earn their place.",
  },
  {
    n: "03",
    icon: MousePointerClick,
    title: "Play with the prototype",
    body: "Twist the inputs, break it, watch the system react. Then check yourself with a quick quiz.",
  },
];

const WHY = [
  {
    icon: Brain,
    title: "Working memory loves motion",
    body: "Static diagrams leave gaps that take days of reading to fill. Watching a system run closes them in minutes.",
  },
  {
    icon: Zap,
    title: "Small inputs, big intuition",
    body: "Sliding a single dial reveals the trade-off space far faster than enumerating it in prose.",
  },
  {
    icon: Eye,
    title: "You can't fake understanding here",
    body: "If the simulation breaks when you stress it the way the algorithm should break, you actually get it.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden border-b border-border-subtle">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-grid-fade"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[680px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--accent) / 0.6) 0%, transparent 60%)",
          }}
        />

        <div className="container relative pb-24 pt-16 md:pb-32 md:pt-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-elevated px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-2xs uppercase tracking-[0.18em] text-muted">
                v0.1 · scaffold preview
              </span>
            </div>

            <h1 className="mt-8 text-balance text-5xl font-semibold tracking-[-0.03em] md:text-7xl">
              Learn by{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-accent">playing</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-accent/20 md:bottom-2 md:h-4"
                />
              </span>
              ,
              <br className="hidden md:inline" /> not just reading.
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-lg text-muted md:text-xl">
              An interactive playground for technical concepts. Every page is a
              live simulation you can poke, twist, and break — built for
              engineers who learn with their hands.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/topics">
                  Browse topics
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/topics/rate-limiting/token-bucket">
                  <MousePointerClick />
                  Try a live demo
                </Link>
              </Button>
            </div>

            {/* console-style command hint */}
            <div className="mt-12 flex items-center gap-2 rounded-full border border-border-subtle bg-surface-elevated/60 px-4 py-2 font-mono text-xs">
              <span className="text-accent">›</span>
              <span className="text-muted">subroute</span>
              <span className="text-subtle">--topic</span>
              <span className="text-foreground">rate-limiting</span>
              <span className="caret -ml-1" aria-hidden />
            </div>
          </div>

          {/* Stats / signal bar */}
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-border-subtle bg-border-subtle">
            <Stat label="Topics" value={TOPICS.length.toString()} />
            <Stat
              label="Concepts"
              value={TOPICS.reduce((n, t) => n + t.concepts.length, 0).toString()}
            />
            <Stat label="Static pages" value="0" hint="we hate them too" />
          </div>
        </div>
      </section>

      {/* ============================ FEATURED ============================ */}
      <section className="container py-24">
        <SectionHeading
          kicker="Featured track"
          title="Start with something foundational"
          description="Rate limiting — the first track wired end-to-end with live prototypes you can break."
          action={
            <Button asChild variant="outline">
              <Link href="/topics">
                See all topics <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((topic, i) => (
            <TopicCard key={topic.slug} topic={topic} index={i} />
          ))}
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="relative border-y border-border-subtle bg-surface/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />
        <div className="container py-24">
          <SectionHeading
            kicker="How it works"
            title="Three steps. No syllabus."
            description="Open the platform mid-coffee, leave with a sharper mental model. The whole loop is built to fit a lunch break."
          />
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border-subtle bg-border-subtle md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="group relative flex flex-col gap-4 bg-surface-elevated p-8 transition-colors hover:bg-surface"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-2xs uppercase tracking-[0.18em] text-subtle">
                    Step {step.n}
                  </span>
                  <step.icon
                    className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ WHY VISUAL ============================ */}
      <section className="container py-24">
        <SectionHeading
          kicker="Why visual learning"
          title="The fastest path from confused to fluent."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {WHY.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated p-6"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
              <item.icon
                className="h-5 w-5 text-accent"
                strokeWidth={1.75}
                aria-hidden
              />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="container pb-32">
        <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated p-10 md:p-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to stop reading about systems and start running them?
            </h2>
            <p className="text-pretty text-muted">
              The scaffold is here. Real prototypes and explanations are
              landing topic-by-topic — start where you're curious.
            </p>
            <Button asChild size="lg" className="mt-2">
              <Link href="/topics">
                Open the topic library
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1 bg-background px-6 py-5 text-left">
      <span className="font-mono text-2xs uppercase tracking-[0.16em] text-subtle">
        {label}
      </span>
      <span className="num-tabular text-3xl font-semibold tracking-tight">
        {value}
      </span>
      {hint ? (
        <span className="font-mono text-2xs uppercase tracking-[0.1em] text-accent">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
