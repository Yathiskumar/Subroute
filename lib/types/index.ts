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
