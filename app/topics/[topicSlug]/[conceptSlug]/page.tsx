import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Wrench,
  CircleSlash,
  Check,
  X as XIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { Callout } from "@/components/shared/Callout";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ConceptNav } from "@/components/shared/ConceptNav";
import { FeedbackWidget } from "@/components/shared/FeedbackWidget";
import { PrototypeFrame } from "@/components/prototype/PrototypeFrame";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { Button } from "@/components/ui/button";
import { ProseRenderer, renderInline } from "@/components/shared/ProseRenderer";
import { FurtherReading } from "@/components/shared/FurtherReading";
import { TOPICS, getConcept } from "@/lib/data/topics";
import { SAMPLE_QUIZ } from "@/lib/data/quiz";
import { getConceptContent } from "@/lib/content";

export function generateStaticParams() {
  return TOPICS.flatMap((t) =>
    t.concepts.map((c) => ({ topicSlug: t.slug, conceptSlug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicSlug: string; conceptSlug: string }>;
}) {
  const { topicSlug, conceptSlug } = await params;
  const data = getConcept(topicSlug, conceptSlug);
  if (!data) return {};
  return {
    title: `${data.concept.title} — ${data.topic.title}`,
    description: data.concept.oneLiner,
  };
}

const TOC_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "how-it-works", label: "How it works" },
  { id: "prototype", label: "Interactive prototype" },
  { id: "hands-on", label: "Hands-on demo" },
  { id: "tradeoffs", label: "Trade-offs" },
  { id: "supporting", label: "Code & references" },
  { id: "quiz", label: "Knowledge check" },
];

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ topicSlug: string; conceptSlug: string }>;
}) {
  const { topicSlug, conceptSlug } = await params;
  const data = getConcept(topicSlug, conceptSlug);
  if (!data) notFound();

  const { topic, concept, prev, next } = data;
  const content = getConceptContent(topic.slug, concept.slug);

  return (
    <>
      {/* Header */}
      <section className="border-b border-border-subtle">
        <div className="container pb-10 pt-10">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Topics", href: "/topics" },
              { label: topic.title, href: `/topics/${topic.slug}` },
              { label: concept.title },
            ]}
          />
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <DifficultyBadge level={concept.difficulty} />
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] text-muted">
                <Clock className="h-3 w-3" />
                {concept.estimatedTime} read
              </span>
              {concept.prototypePath ? (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  live prototype
                </span>
              ) : null}
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
              {concept.title}
            </h1>
            <p className="max-w-2xl text-pretty text-lg text-muted">
              {concept.oneLiner}
            </p>
          </div>
        </div>
      </section>

      {/* Body — two pane */}
      <section className="container py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr,280px]">
          <article className="min-w-0">
            {/* Overview */}
            <section id="overview" className="scroll-mt-20">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden className="h-px w-6 bg-accent" />
                <p className="kicker !text-accent">Overview</p>
              </div>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                What this concept solves
              </h2>
              {content ? (
                <ProseRenderer blocks={content.overview} />
              ) : (
                <PlaceholderProse />
              )}
            </section>

            {/* How it works */}
            <section id="how-it-works" className="scroll-mt-20 mt-12">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden className="h-px w-6 bg-accent" />
                <p className="kicker !text-accent">Mechanics</p>
              </div>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                How it works
              </h2>
              {content ? (
                <ProseRenderer blocks={content.howItWorks} />
              ) : (
                <Callout variant="info" title="Content coming soon">
                  This concept&apos;s full explanation is being written. The
                  prototype below works today.
                </Callout>
              )}
            </section>

            {/* Interactive prototype */}
            <section id="prototype" className="scroll-mt-20 mt-12">
              <SectionHeading
                kicker="Interactive prototype"
                title="Run it. Break it. Tune it."
                description="Sandboxed simulation embedded right in the page. No setup, no install."
                className="mb-6"
              />
              <PrototypeFrame
                src={concept.prototypePath}
                title={concept.title}
                caption={
                  content?.prototypeCaption ??
                  (concept.prototypePath
                    ? "Live HTML prototype loaded in a sandboxed iframe."
                    : "When this concept's prototype lands, it loads here as a sandboxed iframe.")
                }
              />
            </section>

            {/* Hands-on */}
            <section id="hands-on" className="scroll-mt-20 mt-12">
              <SectionHeading
                kicker="Hands-on"
                title="Try these on your own"
                description="Open the prototype above, run each experiment, predict the answer, then verify."
                className="mb-6"
              />
              <div className="grid gap-4 md:grid-cols-3">
                {(content?.handsOn ?? DEFAULT_HANDSON).map((ex, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface-elevated p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xs uppercase tracking-[0.16em] text-subtle">
                        try {String(i + 1).padStart(2, "0")}
                      </span>
                      <Wrench className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <h4 className="text-base font-semibold tracking-tight">
                      {ex.title.replace(/^\d+\s·\s*/, "")}
                    </h4>
                    <p className="text-sm text-muted">{renderInline(ex.body)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* When to use + Trade-offs */}
            {content?.whenToUse || content?.tradeoffs ? (
              <section id="tradeoffs" className="scroll-mt-20 mt-12">
                <SectionHeading
                  kicker="In practice"
                  title="When to use it — and what you give up"
                  className="mb-6"
                />
                {content?.whenToUse ? (
                  <ProseRenderer blocks={content.whenToUse} />
                ) : null}
                {content?.tradeoffs ? (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-success/25 bg-success/5 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <p className="kicker !text-success">Pros</p>
                      </div>
                      <ul className="flex flex-col gap-2 text-sm text-foreground/85">
                        {content.tradeoffs.pros.map((p, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-success" />
                            <span>{renderInline(p)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-danger/25 bg-danger/5 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <XIcon className="h-4 w-4 text-danger" />
                        <p className="kicker !text-danger">Cons</p>
                      </div>
                      <ul className="flex flex-col gap-2 text-sm text-foreground/85">
                        {content.tradeoffs.cons.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-danger" />
                            <span>{renderInline(c)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Supporting content */}
            <section id="supporting" className="scroll-mt-20 mt-12">
              <SectionHeading
                kicker="Reference"
                title="Code & further reading"
                description="A minimal reference implementation and pointers worth bookmarking."
                className="mb-6"
              />
              <div className="grid gap-6">
                {content?.code ? (
                  <CodeBlock
                    filename={content.code.filename}
                    language={content.code.language}
                    code={content.code.code}
                  />
                ) : (
                  <CodeBlock
                    filename="reference.ts"
                    language="typescript"
                    code="// A reference implementation will land here with the real content."
                  />
                )}

                {content?.furtherReading?.length ? (
                  <FurtherReading items={content.furtherReading} />
                ) : null}
              </div>
            </section>

            {/* Quiz */}
            <section id="quiz" className="scroll-mt-20 mt-12">
              <SectionHeading
                kicker="Knowledge check"
                title="Did the prototype land?"
                description="Quick questions, answers revealed on submit. Sign in to save your best score."
                className="mb-6"
              />
              <QuizContainer
                items={content?.quiz ?? SAMPLE_QUIZ}
                quizId={`topics/${topic.slug}/${concept.slug}`}
              />
            </section>

            {/* Prev/Next footer */}
            <nav className="mt-16 grid gap-3 border-t border-border-subtle pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/topics/${topic.slug}/${prev.slug}`}
                  className="group flex flex-col gap-1 rounded-xl border border-border-subtle bg-surface-elevated p-5 transition-colors hover:border-border-strong"
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
                    <ArrowLeft className="h-3 w-3" /> Previous concept
                  </span>
                  <span className="text-base font-semibold tracking-tight group-hover:text-accent">
                    {prev.title}
                  </span>
                  <span className="text-sm text-muted">{prev.oneLiner}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-border-subtle p-5 text-sm text-subtle">
                  <CircleSlash className="h-4 w-4" />
                  You&apos;re at the start of this track.
                </div>
              )}
              {next ? (
                <Link
                  href={`/topics/${topic.slug}/${next.slug}`}
                  className="group flex flex-col items-end gap-1 rounded-xl border border-border-subtle bg-surface-elevated p-5 text-right transition-colors hover:border-border-strong"
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
                    Next concept <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-base font-semibold tracking-tight group-hover:text-accent">
                    {next.title}
                  </span>
                  <span className="text-sm text-muted">{next.oneLiner}</span>
                </Link>
              ) : (
                <div className="flex items-center justify-end gap-2 rounded-xl border border-dashed border-border-subtle p-5 text-right text-sm text-subtle">
                  Track complete · back to{" "}
                  <Link
                    href={`/topics/${topic.slug}`}
                    className="text-accent hover:underline"
                  >
                    {topic.title}
                  </Link>
                </div>
              )}
            </nav>

            <div className="mt-8">
              <FeedbackWidget />
            </div>

            <div className="mt-8 flex justify-center">
              <Button asChild variant="outline">
                <Link href={`/topics/${topic.slug}`}>
                  <ArrowLeft /> Back to {topic.title}
                </Link>
              </Button>
            </div>
          </article>

          <ConceptNav
            topic={topic}
            current={concept}
            prev={prev}
            next={next}
            tocItems={TOC_ITEMS}
            className="hidden lg:flex"
          />
        </div>
      </section>
    </>
  );
}

const DEFAULT_HANDSON = [
  {
    title: "01 · Open the prototype",
    body: "Run the simulation above and form a hypothesis about how it'll respond to a burst.",
  },
  {
    title: "02 · Try a burst",
    body: "Most prototypes have a 'Burst' button. Click it and see if your prediction held.",
  },
  {
    title: "03 · Tune a parameter",
    body: "Where you can, adjust capacity or rate. Note the trade-off you just discovered.",
  },
];

function PlaceholderProse() {
  return (
    <>
      <p className="mb-4 leading-7 text-foreground/85">
        This concept&apos;s explanation is in progress. The prototype below works
        today — try it while the words catch up.
      </p>
    </>
  );
}
