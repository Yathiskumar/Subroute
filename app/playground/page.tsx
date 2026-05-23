import Link from "next/link";
import { ArrowRight, Hammer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

export const metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <div className="container py-16">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Playground" }]}
      />
      <div className="mt-8 max-w-2xl">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <p className="kicker !text-accent">Free-form lab</p>
        </div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          The playground is coming.
        </h1>
        <p className="mt-5 text-pretty text-lg text-muted">
          A free-form sandbox to wire up your own simulations, chain concepts
          together, and stress-test the trade-offs. Until then, every concept
          page is its own little playground.
        </p>
      </div>

      <div className="relative mt-12 overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated p-10">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-grid-fade opacity-50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />
        <div className="relative flex max-w-lg flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1">
            <Hammer className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono text-2xs uppercase tracking-[0.14em] text-muted">
              under construction
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Want to suggest what lands here first?
          </h2>
          <p className="text-muted">
            We&apos;re prioritizing playground features based on what people open
            most often. If you have a wishlist, drop it via the feedback
            widget on any concept page.
          </p>
          <Button asChild className="mt-2 w-fit">
            <Link href="/topics">
              <Sparkles />
              Explore concept pages
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
