import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className,
  action,
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between md:gap-8",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-2", align === "center" && "items-center")}>
        {kicker ? (
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-px w-6 bg-accent" />
            <p className="kicker !text-accent">{kicker}</p>
          </div>
        ) : null}
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-pretty text-muted",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
