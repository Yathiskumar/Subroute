import type { QuizItem } from "@/lib/types";

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
};

export type ConceptContent = {
  overview: ProseBlock[];
  howItWorks: ProseBlock[];
  handsOn: HandsOnExercise[];
  code?: { language: string; filename: string; code: string };
  whenToUse?: ProseBlock[];
  tradeoffs?: { pros: string[]; cons: string[] };
  furtherReading?: FurtherReading[];
  quiz: QuizItem[];
  prototypeCaption: string;
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
