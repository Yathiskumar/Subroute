import { ROADMAPS } from "@/lib/data/roadmaps";
import { TOPICS } from "@/lib/data/topics";

export type CrossRef = { title: string; href: string };

/**
 * Resolves the `[[slug]]` cross-references authored in lesson and concept prose
 * to a real title + href.
 *
 * Built from the two lightweight *data* files (never from the content bodies),
 * so importing this into a renderer costs nothing at bundle time. Roadmap
 * lessons win over topic concepts on a tie — today the two slug spaces don't
 * overlap at all.
 */
const REFS: Record<string, CrossRef> = (() => {
  const map: Record<string, CrossRef> = {};

  for (const topic of TOPICS) {
    for (const concept of topic.concepts) {
      map[concept.slug] = {
        title: concept.title,
        href: `/topics/${topic.slug}/${concept.slug}`,
      };
    }
  }

  for (const roadmap of ROADMAPS) {
    for (const phase of roadmap.phases) {
      for (const group of phase.groups) {
        for (const item of group.items) {
          if (!item.slug) continue; // no slug = no lesson page to point at
          map[item.slug] = {
            title: item.title,
            href: `/roadmaps/${roadmap.slug}/${item.slug}`,
          };
        }
      }
    }
  }

  return map;
})();

/** `[[open-closed]]` → `{ title: "Open/Closed (OCP)", href: "/roadmaps/lld/open-closed" }`. */
export function resolveCrossRef(slug: string): CrossRef | null {
  return REFS[slug] ?? null;
}

/** Fallback label for a ref that points nowhere: `tell-dont-ask` → `tell don't ask`-ish. */
export function prettifySlug(slug: string): string {
  return slug.replace(/-/g, " ");
}
