export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Concept = {
  slug: string;
  title: string;
  oneLiner: string;
  difficulty: Difficulty;
  estimatedTime: string;
  prototypePath: string | null;
};

export type Topic = {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  icon: string;
  tags: string[];
  estimatedTime: string;
  prerequisites: string[];
  concepts: Concept[];
};

export type RoadmapStatus = "available" | "coming-soon";

/** Emphasis marker shown next to a topic. */
export type RoadmapTopicTag = "core" | "interview" | "deep-dive";

export type RoadmapTopic = {
  title: string;
  /** One-line "what this is" — keeps the roadmap scannable without full content. */
  note?: string;
  tag?: RoadmapTopicTag;
  /**
   * When set, this topic has a full lesson at
   * `/roadmaps/{roadmapSlug}/{slug}` and renders as a link.
   */
  slug?: string;
};

/** A cluster of topics inside a phase, optionally grouped under a sub-heading. */
export type RoadmapGroup = {
  /** Optional sub-heading, e.g. "Creational", "Beginner". Omit for a flat list. */
  label?: string;
  items: RoadmapTopic[];
};

export type RoadmapPhase = {
  title: string;
  summary: string;
  /** What the learner can do once this phase is complete. */
  outcome: string;
  /** Lucide icon name for the phase. */
  icon: string;
  /** Rough time to work through the phase, e.g. "~1 week". */
  duration: string;
  groups: RoadmapGroup[];
};

export type Roadmap = {
  slug: string;
  title: string;
  /** Short label, e.g. "LLD". */
  abbr: string;
  description: string;
  /** Lucide icon name. */
  icon: string;
  status: RoadmapStatus;
  difficulty: Difficulty;
  /** Human estimate, e.g. "8–10 weeks". */
  estimatedTime: string;
  tags: string[];
  phases: RoadmapPhase[];
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizItem = {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};
