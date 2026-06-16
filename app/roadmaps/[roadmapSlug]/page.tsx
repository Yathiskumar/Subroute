import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { RoadmapView } from "@/components/roadmap/RoadmapView";
import { ROADMAPS, getRoadmap } from "@/lib/data/roadmaps";

export function generateStaticParams() {
  return ROADMAPS.filter((r) => r.status === "available").map((r) => ({
    roadmapSlug: r.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roadmapSlug: string }>;
}): Promise<Metadata> {
  const { roadmapSlug } = await params;
  const roadmap = getRoadmap(roadmapSlug);
  if (!roadmap) return { title: "Roadmap not found" };
  return {
    title: `${roadmap.title} Roadmap`,
    description: roadmap.description,
  };
}

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ roadmapSlug: string }>;
}) {
  const { roadmapSlug } = await params;
  const roadmap = getRoadmap(roadmapSlug);

  if (!roadmap || roadmap.status !== "available") {
    notFound();
  }

  return (
    <div className="container py-16">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Roadmaps", href: "/roadmaps" },
          { label: roadmap.title },
        ]}
      />
      <RoadmapView roadmap={roadmap} />
    </div>
  );
}
