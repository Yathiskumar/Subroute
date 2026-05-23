import type { QuizItem } from "@/lib/types";

export const SAMPLE_QUIZ: QuizItem[] = [
  {
    id: "q1",
    question:
      "Which property best distinguishes a token bucket from a leaky bucket?",
    options: [
      { id: "a", label: "Token buckets allow short bursts; leaky buckets do not." },
      { id: "b", label: "Leaky buckets refill tokens over time." },
      { id: "c", label: "Token buckets enforce a strict constant rate." },
      { id: "d", label: "They are functionally equivalent." },
    ],
    correctOptionId: "a",
    explanation:
      "A full token bucket can drain quickly, allowing a burst, then refills at a steady rate. A leaky bucket processes at a constant rate regardless of arrival pattern.",
  },
  {
    id: "q2",
    question:
      "What is the typical trade-off when you raise the bucket capacity?",
    options: [
      { id: "a", label: "Sustained throughput goes up; burst tolerance goes down." },
      { id: "b", label: "Burst tolerance goes up; the sustained rate stays the same." },
      { id: "c", label: "Latency drops to zero." },
      { id: "d", label: "Memory usage decreases." },
    ],
    correctOptionId: "b",
    explanation:
      "Capacity controls how many tokens can sit unused, i.e. how big a burst can be. The refill rate is what governs sustained throughput.",
  },
  {
    id: "q3",
    question: "Where does a token bucket usually live in a real system?",
    options: [
      { id: "a", label: "Inside the database query planner." },
      { id: "b", label: "At the API gateway / edge, per client identifier." },
      { id: "c", label: "Only in the client-side SDK." },
      { id: "d", label: "Inside the kernel, between TCP retransmits." },
    ],
    correctOptionId: "b",
    explanation:
      "The most common placement is at the edge — gateway, reverse proxy, or service mesh — keyed by client ID, API key, or IP.",
  },
];
