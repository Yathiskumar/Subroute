import type { MetadataRoute } from "next";
import { TOPICS } from "@/lib/data/topics";
import { ROADMAPS } from "@/lib/data/roadmaps";
import { getRoadmapLessonParams } from "@/lib/content/roadmap-lessons";
import { getAllPostsMeta } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/topics",
    "/roadmaps",
    "/blog",
    "/about",
    "/changelog",
    "/roadmap",
    "/contact",
    "/legal/privacy",
    "/legal/terms",
    "/legal/license",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const topicRoutes = TOPICS.flatMap((topic) => [
    {
      url: `${SITE_URL}/topics/${topic.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...topic.concepts.map((concept) => ({
      url: `${SITE_URL}/topics/${topic.slug}/${concept.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  const roadmapRoutes = ROADMAPS.filter(
    (roadmap) => roadmap.status === "available",
  ).map((roadmap) => ({
    url: `${SITE_URL}/roadmaps/${roadmap.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const roadmapLessonRoutes = getRoadmapLessonParams().map((p) => ({
    url: `${SITE_URL}/roadmaps/${p.roadmapSlug}/${p.topicSlug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = getAllPostsMeta().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...topicRoutes,
    ...roadmapRoutes,
    ...roadmapLessonRoutes,
    ...blogRoutes,
  ];
}
