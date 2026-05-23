import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-24">
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated p-12 text-center md:p-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dot-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-xl border border-border-subtle bg-surface text-accent">
          <FileQuestion className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <p className="font-mono text-2xs uppercase tracking-[0.18em] text-accent">
          404 · route not found
        </p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          That subroute doesn't exist (yet).
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted">
          Either the page hasn't been built or the URL drifted. Try the topic
          library — that's where most of the action lives.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <Button asChild>
            <Link href="/topics">Browse topics</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
