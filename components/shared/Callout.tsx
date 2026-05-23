import { Info, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

const calloutVariants = cva(
  "relative flex gap-3 rounded-lg border p-4 text-sm",
  {
    variants: {
      variant: {
        info: "border-info/30 bg-info/5 text-foreground",
        warning: "border-warning/30 bg-warning/5 text-foreground",
        tip: "border-accent/30 bg-accent/5 text-foreground",
        success: "border-success/30 bg-success/5 text-foreground",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  success: CheckCircle2,
} as const;

const ICON_COLORS = {
  info: "text-info",
  warning: "text-warning",
  tip: "text-accent",
  success: "text-success",
} as const;

export interface CalloutProps extends VariantProps<typeof calloutVariants> {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Callout({
  variant = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const v = variant ?? "info";
  const Icon = ICONS[v];
  return (
    <div className={cn(calloutVariants({ variant: v }), className)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", ICON_COLORS[v])} />
      <div className="flex-1 space-y-1">
        {title ? <p className="font-medium leading-tight">{title}</p> : null}
        <div className="text-sm text-muted [&_p]:leading-6">{children}</div>
      </div>
    </div>
  );
}
