import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { ArrowLeft, Clock, Rss } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { TagChip } from "@/components/shared/TagChip";
import { Button } from "@/components/ui/button";
import { getAllPostsMeta, getPostBySlug, postUrl, formatDate } from "@/lib/blog";
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

  const { content } = await compileMDX({
    source,
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
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
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

      <article className="container py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: frontmatter.title },
          ]}
        />

        {/* Header */}
        <header className="mt-6 flex flex-col gap-4">
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

        {/* Body */}
        <div className="prose-content prose-blog mt-10 max-w-[65ch]">
          {content}
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col gap-6 border-t border-border-subtle pt-8">
          <p className="text-sm text-muted">
            This is the canonical version of this post. If you found it
            elsewhere, the original lives here on {SITE_NAME}.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft /> All posts
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/blog/rss.xml">
                <Rss /> Subscribe via RSS
              </Link>
            </Button>
          </div>
        </footer>
      </article>
    </>
  );
}
