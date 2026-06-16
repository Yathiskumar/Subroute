import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { RoadmapCard } from "@/components/cards/RoadmapCard";
import { ROADMAPS } from "@/lib/data/roadmaps";

export const metadata = {
  title: "Roadmaps",
  description:
    "Structured learning roadmaps — a clear path from start to finish for each subject, starting with Low-Level Design.",
};

export default function RoadmapsPage() {
  const available = ROADMAPS.filter((r) => r.status === "available");

  return (
    <div className="container py-16">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Roadmaps" }]}
      />

      <div className="mt-8 max-w-2xl">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <p className="kicker !text-accent">Learning roadmaps</p>
        </div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          Know exactly what to learn next.
        </h1>
        <p className="mt-5 text-pretty text-lg text-muted">
          Every subject, mapped end to end — phase by phase, topic by topic. No
          guessing what comes next, no missing fundamentals. Pick a track and
          follow the path.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ROADMAPS.map((roadmap) => (
          <RoadmapCard key={roadmap.slug} roadmap={roadmap} />
        ))}
      </div>

      {available.length < ROADMAPS.length ? (
        <p className="mt-8 max-w-2xl text-sm text-subtle">
          More tracks are on the way. Roadmaps marked{" "}
          <span className="font-mono text-2xs uppercase tracking-[0.12em]">
            soon
          </span>{" "}
          are being built out next.
        </p>
      ) : null}
    </div>
  );
}
