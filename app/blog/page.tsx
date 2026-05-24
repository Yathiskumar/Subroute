import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Rss } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { TagChip } from "@/components/shared/TagChip";
import { EmptyState } from "@/components/shared/EmptyState";
import { getAllPostsMeta, formatDate } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

const TITLE = "Blog";
const DESCRIPTION =
  "Field notes on system design, algorithms, and infrastructure — the canonical home for posts also syndicated to Hashnode, dev.to, and Medium.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="container py-12 md:py-16">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <p className="kicker !text-accent">Writing</p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Notes from the playground.
          </h1>
          <Link
            href="/blog/rss.xml"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-3 font-mono text-2xs uppercase tracking-[0.1em] text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Rss className="h-3.5 w-3.5" />
            RSS
          </Link>
        </div>
        <p className="max-w-2xl text-pretty text-muted">{DESCRIPTION}</p>
      </div>

      <div className="mt-10 flex items-center justify-between border-b border-border-subtle pb-3">
        <p className="font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
        <p className="font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
          sort: newest
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={<Rss className="h-5 w-5" />}
          title="No posts yet"
          description="The first post is on its way. Check back soon."
          className="mt-12"
        />
      ) : (
        <ul className="mt-4 flex flex-col">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 border-b border-border-subtle py-7 transition-colors hover:border-border-strong"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  <span aria-hidden className="text-subtle/40">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min read
                  </span>
                </div>

                <h2 className="text-balance text-xl font-semibold tracking-tight transition-colors group-hover:text-accent md:text-2xl">
                  {post.title}
                </h2>

                <p className="max-w-2xl text-pretty text-muted">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {post.tags.map((tag) => (
                    <TagChip key={tag} label={tag} asButton={false} />
                  ))}
                  <span className="ml-auto inline-flex items-center gap-1 text-sm text-muted transition-colors group-hover:text-accent">
                    Read
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
