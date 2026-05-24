import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { TOPICS } from "@/lib/data/topics";

export const metadata = {
  title: "Changelog",
  description: "What has shipped on Subroute, newest first.",
};

export default function ChangelogPage() {
  // Topics are authored in build order; show newest first.
  const releases = [...TOPICS].reverse();

  return (
    <div className="container py-16">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Changelog" }]}
      />
      <div className="mt-8 max-w-3xl">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <p className="kicker !text-accent">Resources</p>
        </div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          Changelog
        </h1>
        <p className="mt-5 text-pretty text-lg text-muted">
          Subroute grows one topic at a time — each shipped end-to-end with
          written explanations, live prototypes, and quizzes before it lands
          here. Newest first.
        </p>
      </div>

      <ol className="mt-12 max-w-3xl border-l border-border-subtle">
        {releases.map((topic, i) => {
          const conceptCount = topic.concepts.length;
          const liveCount = topic.concepts.filter((c) => c.prototypePath).length;
          return (
            <li key={topic.slug} className="relative pl-8 pb-10 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent"
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="text-lg font-semibold tracking-tight">
                  {topic.title}
                </h2>
                {i === 0 ? (
                  <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] text-accent">
                    Latest
                  </span>
                ) : null}
                <span className="font-mono text-2xs uppercase tracking-[0.1em] text-subtle">
                  {conceptCount} concepts
                  {liveCount < conceptCount ? ` · ${liveCount} live` : ""}
                </span>
              </div>
              <p className="mt-2 text-pretty text-muted">{topic.description}</p>
              <Link
                href={`/topics/${topic.slug}`}
                className="mt-3 inline-block text-sm text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
              >
                Open the track →
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 max-w-3xl text-sm text-subtle">
        Where things are headed next lives on the{" "}
        <Link
          href="/roadmap"
          className="text-muted underline decoration-border-subtle underline-offset-4 transition-colors hover:text-foreground"
        >
          Roadmap
        </Link>
        .
      </p>
    </div>
  );
}
