import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.08em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-elevated text-muted",
        accent:
          "border-accent/30 bg-accent/10 text-accent",
        outline: "border-border bg-transparent text-foreground",
        beginner:
          "border-diff-beginner/30 bg-diff-beginner/10 text-diff-beginner",
        intermediate:
          "border-diff-intermediate/30 bg-diff-intermediate/10 text-diff-intermediate",
        advanced:
          "border-diff-advanced/30 bg-diff-advanced/10 text-diff-advanced",
        muted: "border-border-subtle bg-transparent text-subtle",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
