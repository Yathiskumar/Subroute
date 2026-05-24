import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { ArrowLeft, Clock } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { TagChip } from "@/components/shared/TagChip";
import { Button } from "@/components/ui/button";
import { PostAside, type TocHeading } from "@/components/blog/PostAside";
import { getAllPostsMeta, getPostBySlug, postUrl, formatDate } from "@/lib/blog";
import { slugify } from "@/lib/utils/slug";
import { SITE_URL, SITE_NAME } from "@/lib/site";

// Syntax highlighting runs at build time through Shiki (already a dependency).
// Dual themes emit CSS variables that we toggle by `.dark` in globals.css.
const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark-default" },
  keepBackground: false,
  // Default a language for fenced *blocks* only. Leaving `inline` unset means
  // plain `inline code` is bypassed (stays a normal <code>, styled as a pill)
  // instead of being wrapped in a full-width code figure.
  defaultLang: { block: "plaintext" },
};

// --- Heading + TOC helpers -------------------------------------------------

function nodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (React.isValidElement(node))
    return nodeText((node.props as { children?: React.ReactNode }).children);
  return "";
}

/** Pull h2/h3 headings from the raw MDX (ignoring fenced code) for the TOC. */
function extractHeadings(source: string): TocHeading[] {
  const out: TocHeading[] = [];
  let inFence = false;
  for (const line of source.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*`_]/g, "").trim();
    out.push({ depth: m[1].length, text, id: slugify(text) });
  }
  return out;
}

// Anchor-able headings so the TOC can deep-link into the post.
const mdxComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 id={slugify(nodeText(children))} className="scroll-mt-24">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 id={slugify(nodeText(children))} className="scroll-mt-24">
      {children}
    </h3>
  ),
};

export function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const { frontmatter } = post;
  const url = postUrl(frontmatter.slug);

  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    authors: [{ name: frontmatter.author }],
    keywords: frontmatter.tags,
    alternates: { canonical: `/blog/${frontmatter.slug}` },
    openGraph: {
      type: "article",
      url,
      title: frontmatter.title,
      description: frontmatter.excerpt,
      siteName: SITE_NAME,
      publishedTime: frontmatter.publishedAt,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
      ...(frontmatter.coverImage ? { images: [frontmatter.coverImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.excerpt,
      ...(frontmatter.coverImage ? { images: [frontmatter.coverImage] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const { frontmatter, content: source } = post;
  const url = postUrl(frontmatter.slug);
  const headings = extractHeadings(source);

  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      },
    },
  });

  // Image used for OG/JSON-LD: explicit cover, else the generated OG image.
  const socialImage = frontmatter.coverImage
    ? new URL(frontmatter.coverImage, SITE_URL).toString()
    : `${url}/opengraph-image`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.publishedAt,
    author: { "@type": "Person", name: frontmatter.author },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    image: socialImage,
    keywords: frontmatter.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD is static, build-time content — safe to inline.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: frontmatter.title },
          ]}
        />

        {/* Header */}
        <header className="mt-6 flex flex-col gap-4 border-b border-border-subtle pb-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
            <time dateTime={frontmatter.publishedAt}>
              {formatDate(frontmatter.publishedAt)}
            </time>
            <span aria-hidden className="text-subtle/40">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {frontmatter.readingTime} min read
            </span>
            <span aria-hidden className="text-subtle/40">
              ·
            </span>
            <span>{frontmatter.author}</span>
          </div>

          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
            {frontmatter.title}
          </h1>

          <p className="max-w-2xl text-pretty text-lg text-muted">
            {frontmatter.excerpt}
          </p>

          {frontmatter.tags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {frontmatter.tags.map((tag) => (
                <TagChip key={tag} label={tag} asButton={false} />
              ))}
            </div>
          ) : null}
        </header>

        {frontmatter.coverImage ? (
          <div className="mt-8 overflow-hidden rounded-xl border border-border-subtle bg-surface-sunken">
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              width={1200}
              height={630}
              className="h-auto w-full"
              priority
            />
          </div>
        ) : null}

        {/* Body — prose left, sticky TOC + share rail right */}
        <div className="mt-10 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr),240px]">
          <article className="min-w-0">
            <div className="prose-content prose-blog max-w-[68ch]">{content}</div>

            <footer className="mt-16 flex flex-col gap-6 border-t border-border-subtle pt-8">
              <p className="max-w-[68ch] text-sm text-muted">
                This is the canonical version of this post. If you found it on
                Hashnode, dev.to, or Medium, the original lives here on{" "}
                {SITE_NAME}.
              </p>
              <Button asChild variant="outline" className="self-start">
                <Link href="/blog">
                  <ArrowLeft /> All posts
                </Link>
              </Button>
            </footer>
          </article>

          <aside className="hidden lg:block">
            <PostAside headings={headings} url={url} title={frontmatter.title} />
          </aside>
        </div>
      </div>
    </>
  );
}
