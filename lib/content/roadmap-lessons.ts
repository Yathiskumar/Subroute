import type { RoadmapLesson } from "./types";
import { classesAndObjects } from "./lld/classes-and-objects";
import { objectLifecycle } from "./lld/object-lifecycle";
import { encapsulation } from "./lld/encapsulation";
import { abstraction } from "./lld/abstraction";
import { inheritance } from "./lld/inheritance";
import { polymorphism } from "./lld/polymorphism";
import { staticVsInstance } from "./lld/static-vs-instance";
import { accessModifiers } from "./lld/access-modifiers";
import { abstractVsInterfaces } from "./lld/abstract-vs-interfaces";
import { compositionVsInheritance } from "./lld/composition-vs-inheritance";
import { associationAggregationComposition } from "./lld/association-aggregation-composition";
import { couplingAndCohesion } from "./lld/coupling-and-cohesion";
import { equalsAndHashcode } from "./lld/equals-and-hashcode";
import { immutabilityAndValueObjects } from "./lld/immutability-and-value-objects";
import { genericsAndTemplates } from "./lld/generics-and-templates";
import { enumsAndConstants } from "./lld/enums-and-constants";

/** Indexed by `${roadmapSlug}/${topicSlug}`. */
const ROADMAP_LESSONS: Record<string, RoadmapLesson> = {
  "lld/classes-and-objects": classesAndObjects,
  "lld/object-lifecycle": objectLifecycle,
  "lld/encapsulation": encapsulation,
  "lld/abstraction": abstraction,
  "lld/inheritance": inheritance,
  "lld/polymorphism": polymorphism,
  "lld/static-vs-instance": staticVsInstance,
  "lld/access-modifiers": accessModifiers,
  "lld/abstract-vs-interfaces": abstractVsInterfaces,
  "lld/composition-vs-inheritance": compositionVsInheritance,
  "lld/association-aggregation-composition": associationAggregationComposition,
  "lld/coupling-and-cohesion": couplingAndCohesion,
  "lld/equals-and-hashcode": equalsAndHashcode,
  "lld/immutability-and-value-objects": immutabilityAndValueObjects,
  "lld/generics-and-templates": genericsAndTemplates,
  "lld/enums-and-constants": enumsAndConstants,
};

export function getRoadmapLesson(
  roadmapSlug: string,
  topicSlug: string,
): RoadmapLesson | null {
  return ROADMAP_LESSONS[`${roadmapSlug}/${topicSlug}`] ?? null;
}

export function hasRoadmapLesson(
  roadmapSlug: string,
  topicSlug: string,
): boolean {
  return `${roadmapSlug}/${topicSlug}` in ROADMAP_LESSONS;
}

/** All authored lessons, as `{ roadmapSlug, topicSlug }` pairs for routing. */
export function getRoadmapLessonParams(): {
  roadmapSlug: string;
  topicSlug: string;
}[] {
  return Object.keys(ROADMAP_LESSONS).map((key) => {
    const [roadmapSlug, topicSlug] = key.split("/");
    return { roadmapSlug, topicSlug };
  });
}
