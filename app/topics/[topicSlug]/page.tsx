import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  ListChecks,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import { ConceptCard } from "@/components/cards/ConceptCard";
import { TopicCard } from "@/components/cards/TopicCard";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { TagChip } from "@/components/shared/TagChip";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Callout } from "@/components/shared/Callout";
import { ProseRenderer } from "@/components/shared/ProseRenderer";
import { ComparisonTable } from "@/components/shared/ComparisonTable";
import { Button } from "@/components/ui/button";
import { getRelatedTopics, getTopic, TOPICS } from "@/lib/data/topics";
import { getTopicContent } from "@/lib/content";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topicSlug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { topicSlug: string };
}) {
  const topic = getTopic(params.topicSlug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
  };
}

function getIcon(name: string): LucideIcon {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? Icons.Box;
}

export default function TopicDetailPage({
  params,
}: {
  params: { topicSlug: string };
}) {
  const topic = getTopic(params.topicSlug);
  if (!topic) notFound();

  const Icon = getIcon(topic.icon);
  const related = getRelatedTopics(topic.slug);
  const firstConcept = topic.concepts[0];
  const topicContent = getTopicContent(topic.slug);

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border-subtle">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black_15%,transparent_70%)]"
        />
        <div className="container pb-16 pt-12">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Topics", href: "/topics" },
              { label: topic.title },
            ]}
          />
          <div className="mt-6 grid gap-10 md:grid-cols-[1fr,auto] md:items-start">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-border-subtle bg-surface-elevated text-accent">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <DifficultyBadge level={topic.difficulty} />
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
                {topic.title}
              </h1>
              <p className="max-w-2xl text-pretty text-lg text-muted">
                {topic.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {topic.tags.map((t) => (
                  <TagChip key={t} label={t} asButton={false} />
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-3">
                {firstConcept ? (
                  <Button asChild size="lg">
                    <Link
                      href={`/topics/${topic.slug}/${firstConcept.slug}`}
                    >
                      Start with {firstConcept.title}
                      <ArrowRight />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Quick facts box */}
            <aside className="w-full rounded-xl border border-border-subtle bg-surface-elevated p-5 md:w-72">
              <p className="kicker pb-3">At a glance</p>
              <dl className="flex flex-col gap-3">
                <Fact
                  icon={<ListChecks className="h-3.5 w-3.5" />}
                  label="Concepts"
                  value={topic.concepts.length.toString()}
                />
                <Fact
                  icon={<Clock className="h-3.5 w-3.5" />}
                  label="Total time"
                  value={topic.estimatedTime}
                />
                <Fact
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  label="Prototypes"
                  value={`${topic.concepts.filter((c) => c.prototypePath).length} live`}
                />
              </dl>
              {topic.prerequisites.length ? (
                <div className="mt-4 border-t border-border-subtle pt-4">
                  <p className="kicker pb-2">Prerequisites</p>
                  <ul className="flex flex-col gap-1">
                    {topic.prerequisites.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-2 text-sm text-muted"
                      >
                        <span className="h-1 w-1 rounded-full bg-border-strong" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      {/* Topic intro — "What is X?" + why it matters */}
      {topicContent ? (
        <section className="container py-16">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2">
              <span aria-hidden className="h-px w-6 bg-accent" />
              <p className="kicker !text-accent">What is {topic.title}?</p>
            </div>
            <h2 className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl">
              The 60-second primer
            </h2>
            <ProseRenderer blocks={topicContent.intro} />

            {topicContent.whyItMatters ? (
              <div className="mt-10">
                <ProseRenderer blocks={topicContent.whyItMatters} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Comparison table */}
      {topicContent?.comparison ? (
        <section className="container pb-16">
          <SectionHeading
            kicker="Side-by-side"
            title="How they compare"
            description="The same concepts, on the same axes. Use this as a map; the individual pages are the territory."
          />
          <div className="mt-10">
            <ComparisonTable
              headers={topicContent.comparison.headers}
              rows={topicContent.comparison.rows}
            />
          </div>
        </section>
      ) : null}

      {/* How to choose */}
      {topicContent?.howToChoose ? (
        <section className="container pb-16">
          <div className="max-w-3xl">
            <SectionHeading
              kicker="Decision guide"
              title="Which one should you use?"
              description="A practical tour of when each algorithm wins."
              className="mb-8"
            />
            <ProseRenderer blocks={topicContent.howToChoose} />
          </div>
        </section>
      ) : null}

      {/* Body — concept list + sticky TOC */}
      <section className="container py-12 border-t border-border-subtle">
        <div className="grid gap-10 lg:grid-cols-[1fr,260px]">
          <div className="flex flex-col gap-4">
            <SectionHeading
              kicker="Concepts in this track"
              title={`${topic.concepts.length} concepts, in order`}
              description="Each links to a concept page with its own explanation, prototype, and quiz."
            />
            <div className="mt-4 flex flex-col gap-3">
              {topic.concepts.map((concept, i) => (
                <ConceptCard
                  key={concept.slug}
                  concept={concept}
                  topicSlug={topic.slug}
                  index={i}
                />
              ))}
            </div>

            {!topicContent ? (
              <Callout variant="tip" title="Heads up — this is a scaffold" className="mt-8">
                All concepts have placeholder content right now. One prototype is
                wired end-to-end so you can see how the iframe loads.
              </Callout>
            ) : null}
          </div>

          {/* Sidebar TOC */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <p className="kicker pb-2">Quick jump</p>
              <ul className="flex flex-col">
                {topic.concepts.map((c, i) => (
                  <li key={c.slug}>
                    <Link
                      href={`/topics/${topic.slug}/${c.slug}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                    >
                      <span className="font-mono text-2xs text-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate">{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Related topics */}
      {related.length ? (
        <section className="container pb-24">
          <SectionHeading
            kicker="Related tracks"
            title="If this one clicks, try these next."
          />
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((t, i) => (
              <TopicCard key={t.slug} topic={t} index={i} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="inline-flex items-center gap-2 text-xs text-muted">
        <span className="text-accent">{icon}</span>
        {label}
      </dt>
      <dd className="num-tabular text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}
