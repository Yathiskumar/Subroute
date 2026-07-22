import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleSlash,
  Clock,
  Wrench,
  X as XIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { MultiCodeBlock } from "@/components/shared/MultiCodeBlock";
import { FurtherReading } from "@/components/shared/FurtherReading";
import {
  ProseRenderer,
  renderInline,
  stripInline,
} from "@/components/shared/ProseRenderer";
import { PrototypeFrame } from "@/components/prototype/PrototypeFrame";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { LessonCompleteButton } from "@/components/roadmap/LessonCompleteButton";
import { Button } from "@/components/ui/button";
import { topicProgressId } from "@/lib/utils/roadmap-progress";
import { getRoadmap } from "@/lib/data/roadmaps";
import {
  getRoadmapLesson,
  getRoadmapLessonParams,
} from "@/lib/content/roadmap-lessons";
import type { Roadmap } from "@/lib/types";

function findTopic(roadmap: Roadmap, topicSlug: string) {
  for (const phase of roadmap.phases) {
    for (const group of phase.groups) {
      const item = group.items.find((it) => it.slug === topicSlug);
      if (item) return { item, phase };
    }
  }
  return null;
}

/** The progress id the roadmap uses for this topic (by its position). */
function findTopicProgressId(roadmap: Roadmap, topicSlug: string): string | null {
  for (let pi = 0; pi < roadmap.phases.length; pi++) {
    const groups = roadmap.phases[pi].groups;
    for (let gi = 0; gi < groups.length; gi++) {
      const items = groups[gi].items;
      for (let ii = 0; ii < items.length; ii++) {
        if (items[ii].slug === topicSlug) return topicProgressId(pi, gi, ii);
      }
    }
  }
  return null;
}

export function generateStaticParams() {
  return getRoadmapLessonParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roadmapSlug: string; topicSlug: string }>;
}): Promise<Metadata> {
  const { roadmapSlug, topicSlug } = await params;
  const lesson = getRoadmapLesson(roadmapSlug, topicSlug);
  const roadmap = getRoadmap(roadmapSlug);
  if (!lesson || !roadmap) return { title: "Lesson not found" };
  return {
    title: `${lesson.title} — ${roadmap.abbr} Roadmap`,
    description: stripInline(lesson.oneLiner),
  };
}

export default async function RoadmapLessonPage({
  params,
}: {
  params: Promise<{ roadmapSlug: string; topicSlug: string }>;
}) {
  const { roadmapSlug, topicSlug } = await params;
  const roadmap = getRoadmap(roadmapSlug);
  const lesson = getRoadmapLesson(roadmapSlug, topicSlug);
  if (!roadmap || !lesson) notFound();

  const located = findTopic(roadmap, topicSlug);
  const topicId = findTopicProgressId(roadmap, topicSlug);
  const { content } = lesson;

  // Walk every topic in roadmap order, keeping only those with a real lesson,
  // to find the previous / next lesson relative to this one.
  const orderedSlugs = roadmap.phases.flatMap((phase) =>
    phase.groups.flatMap((group) =>
      group.items
        .map((it) => it.slug)
        .filter(
          (slug): slug is string =>
            Boolean(slug) && Boolean(getRoadmapLesson(roadmap.slug, slug!)),
        ),
    ),
  );
  const curIdx = orderedSlugs.indexOf(topicSlug);
  const prevSlug = curIdx > 0 ? orderedSlugs[curIdx - 1] : null;
  const nextSlug =
    curIdx >= 0 && curIdx < orderedSlugs.length - 1
      ? orderedSlugs[curIdx + 1]
      : null;
  const prevLesson = prevSlug ? getRoadmapLesson(roadmap.slug, prevSlug) : null;
  const nextLesson = nextSlug ? getRoadmapLesson(roadmap.slug, nextSlug) : null;

  const hasPractice = Boolean(content.whenToUse || content.tradeoffs);
  const hasReference = Boolean(
    content.code || content.codeSamples?.length || content.furtherReading?.length,
  );

  const toc = [
    { id: "idea", label: "What it is" },
    { id: "mechanics", label: "How it works" },
    { id: "prototype", label: "Prototype" },
    { id: "hands-on", label: "Hands-on" },
    hasPractice ? { id: "in-practice", label: "In practice" } : null,
    hasReference ? { id: "reference", label: "Code & references" } : null,
    { id: "quiz", label: "Knowledge check" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <>
      {/* Header band */}
      <section className="border-b border-border-subtle">
        <div className="container pb-10 pt-10">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Roadmaps", href: "/roadmaps" },
              { label: roadmap.title, href: `/roadmaps/${roadmap.slug}` },
              { label: lesson.title },
            ]}
          />
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <DifficultyBadge level={lesson.difficulty} />
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] text-muted">
                <Clock className="h-3 w-3" />
                {lesson.estimatedTime} read
              </span>
              {located?.phase ? (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] text-muted">
                  {located.phase.title}
                </span>
              ) : null}
              {lesson.prototypePath ? (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  live prototype
                </span>
              ) : null}
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
              {lesson.title}
            </h1>
            <p className="max-w-2xl text-pretty text-lg text-muted">
              {renderInline(lesson.oneLiner)}
            </p>
            <LessonCompleteButton
              roadmapSlug={roadmap.slug}
              topicId={topicId}
              className="mt-1 w-fit lg:hidden"
            />
          </div>
        </div>
      </section>

      {/* Body — wide article + sticky outline rail */}
      <section className="container py-12">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_240px]">
          <article className="min-w-0">
            {/* Overview */}
            <section id="idea" className="scroll-mt-24">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden className="h-px w-6 bg-accent" />
                <p className="kicker !text-accent">The idea</p>
              </div>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                What it is
              </h2>
              <ProseRenderer blocks={content.overview} />
            </section>

            {/* How it works */}
            <section id="mechanics" className="mt-14 scroll-mt-24">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden className="h-px w-6 bg-accent" />
                <p className="kicker !text-accent">Mechanics</p>
              </div>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                How it works
              </h2>
              <ProseRenderer blocks={content.howItWorks} />
            </section>

            {/* Prototype — break out to the full content column */}
            <section id="prototype" className="mt-14 scroll-mt-24">
              <SectionHeading
                kicker="Interactive prototype"
                title="See it. Build it. Break it."
                description="A sandboxed, hands-on simulation — no setup, no install. Play with it as you read."
                className="mb-6"
              />
              <PrototypeFrame
                src={lesson.prototypePath}
                title={lesson.title}
                caption={content.prototypeCaption}
              />
            </section>

            {/* Hands-on */}
            <section id="hands-on" className="mt-14 scroll-mt-24">
              <SectionHeading
                kicker="Hands-on"
                title="Try these yourself"
                description="Open the prototype above, predict what happens, then verify."
                className="mb-6"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                {content.handsOn.map((ex, i) => (
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
                      {renderInline(ex.title.replace(/^\d+\s·\s*/, ""))}
                    </h4>
                    <p className="text-sm text-muted">{renderInline(ex.body)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* When to use + trade-offs */}
            {hasPractice ? (
              <section id="in-practice" className="mt-14 scroll-mt-24">
                <SectionHeading
                  kicker="In practice"
                  title="When to use it — and what trips people up"
                  className="mb-6"
                />
                {content.whenToUse ? (
                  <ProseRenderer blocks={content.whenToUse} />
                ) : null}
                {content.tradeoffs ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-success/25 bg-success/5 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <p className="kicker !text-success">What it gives you</p>
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
                        <p className="kicker !text-danger">Common mistakes</p>
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

            {/* Code & references */}
            {hasReference ? (
              <section id="reference" className="mt-14 scroll-mt-24">
                <SectionHeading
                  kicker="Reference"
                  title="Code & further reading"
                  description="A minimal reference implementation and pointers worth bookmarking."
                  className="mb-6"
                />
                <div className="grid gap-6">
                  {content.codeSamples?.length ? (
                    <MultiCodeBlock samples={content.codeSamples} />
                  ) : content.code ? (
                    <CodeBlock
                      filename={content.code.filename}
                      language={content.code.language}
                      code={content.code.code}
                    />
                  ) : null}
                  {content.furtherReading?.length ? (
                    <FurtherReading items={content.furtherReading} />
                  ) : null}
                </div>
              </section>
            ) : null}

            {/* Quiz */}
            <section id="quiz" className="mt-14 scroll-mt-24">
              <SectionHeading
                kicker="Knowledge check"
                title="Did it land?"
                description="Quick questions, answers revealed on submit. Sign in to save your best score."
                className="mb-6"
              />
              <QuizContainer
                items={content.quiz}
                quizId={`roadmaps/${roadmap.slug}/${topicSlug}`}
              />
            </section>

            {/* Prev / next lesson */}
            <nav className="mt-16 grid gap-3 border-t border-border-subtle pt-8 sm:grid-cols-2">
              {prevLesson && prevSlug ? (
                <Link
                  href={`/roadmaps/${roadmap.slug}/${prevSlug}`}
                  className="group flex flex-col gap-1 rounded-xl border border-border-subtle bg-surface-elevated p-5 transition-colors hover:border-border-strong"
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
                    <ArrowLeft className="h-3 w-3" /> Previous topic
                  </span>
                  <span className="text-base font-semibold tracking-tight group-hover:text-accent">
                    {prevLesson.title}
                  </span>
                  <span className="line-clamp-2 text-sm text-muted">
                    {renderInline(prevLesson.oneLiner)}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-border-subtle p-5 text-sm text-subtle">
                  <CircleSlash className="h-4 w-4" />
                  You&apos;re at the start of this track.
                </div>
              )}

              {nextLesson && nextSlug ? (
                <Link
                  href={`/roadmaps/${roadmap.slug}/${nextSlug}`}
                  className="group flex flex-col items-end gap-1 rounded-xl border border-border-subtle bg-surface-elevated p-5 text-right transition-colors hover:border-border-strong"
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
                    Next topic <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-base font-semibold tracking-tight group-hover:text-accent">
                    {nextLesson.title}
                  </span>
                  <span className="line-clamp-2 text-sm text-muted">
                    {renderInline(nextLesson.oneLiner)}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center justify-end gap-1.5 rounded-xl border border-dashed border-border-subtle p-5 text-right text-sm text-subtle">
                  Latest lesson · back to{" "}
                  <Link
                    href={`/roadmaps/${roadmap.slug}`}
                    className="text-accent hover:underline"
                  >
                    {roadmap.abbr} roadmap
                  </Link>
                </div>
              )}
            </nav>
          </article>

          {/* Sticky outline rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 flex flex-col gap-6">
              <LessonCompleteButton
                roadmapSlug={roadmap.slug}
                topicId={topicId}
                className="w-full"
              />
              <nav>
                <p className="kicker mb-3">On this page</p>
                <ul className="flex flex-col gap-0.5 border-l border-border-subtle">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/roadmaps/${roadmap.slug}`}>
                  <ArrowLeft /> {roadmap.abbr} roadmap
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
