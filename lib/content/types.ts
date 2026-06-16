import type { Difficulty, QuizItem } from "@/lib/types";

export type ProseBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; variant: "info" | "warning" | "tip" | "success"; title?: string; text: string }
  | { type: "code"; language?: string; filename?: string; code: string };

export type HandsOnExercise = {
  title: string;
  body: string;
};

export type FurtherReading = {
  label: string;
  href?: string;
  note?: string;
  /** Source type — drives the tag/icon shown in the references list. */
  kind?: "paper" | "book" | "docs" | "article" | "video" | "spec";
};

/** One language variant of a reference snippet, shown as a tab. */
export type CodeSample = {
  /** Display name on the tab, e.g. "TypeScript", "Java". */
  label: string;
  /** Language hint (for the filename/meta). */
  language: string;
  filename: string;
  code: string;
};

export type ConceptContent = {
  overview: ProseBlock[];
  howItWorks: ProseBlock[];
  handsOn: HandsOnExercise[];
  code?: { language: string; filename: string; code: string };
  /** Multi-language reference. When present, rendered as a tabbed code block. */
  codeSamples?: CodeSample[];
  whenToUse?: ProseBlock[];
  tradeoffs?: { pros: string[]; cons: string[] };
  furtherReading?: FurtherReading[];
  quiz: QuizItem[];
  prototypeCaption: string;
};

/**
 * A standalone lesson hung off a roadmap topic. Reuses ConceptContent for the
 * body and carries its own header metadata (roadmap topics aren't Concepts).
 */
export type RoadmapLesson = {
  title: string;
  oneLiner: string;
  difficulty: Difficulty;
  estimatedTime: string;
  prototypePath: string | null;
  content: ConceptContent;
};

export type ComparisonRow = {
  algorithm: string;
  bursts: string;
  precision: string;
  memory: string;
  bestFor: string;
};

export type TopicContent = {
  /** Rich introduction — "What is X?" */
  intro: ProseBlock[];
  /** Use-case section — "Where you need this" */
  whyItMatters?: ProseBlock[];
  /** Optional comparison table across the concepts in this topic */
  comparison?: {
    headers: { algorithm: string; bursts: string; precision: string; memory: string; bestFor: string };
    rows: ComparisonRow[];
  };
  /** Optional decision-guide text — "How to pick" */
  howToChoose?: ProseBlock[];
};
