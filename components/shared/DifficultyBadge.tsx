import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/lib/types";

const LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <Badge variant={level} aria-label={`Difficulty: ${LABELS[level]}`}>
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-current"
      />
      {LABELS[level]}
    </Badge>
  );
}
