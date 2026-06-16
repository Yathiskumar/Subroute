/**
 * Shared keys for roadmap topic-completion progress (localStorage).
 * Both the roadmap view and the in-lesson "mark complete" button use these so
 * the two stay perfectly in sync — change the format in ONE place only.
 */

export function progressStorageKey(roadmapSlug: string): string {
  return `roadmap-progress:${roadmapSlug}`;
}

/** Stable per-topic id based on its position in the roadmap. */
export function topicProgressId(
  phaseIndex: number,
  groupIndex: number,
  itemIndex: number,
): string {
  return `${phaseIndex}-${groupIndex}-${itemIndex}`;
}

/** Fired on the window when progress changes, so on-page widgets resync. */
export const PROGRESS_SYNC_EVENT = "roadmap-progress-change";
