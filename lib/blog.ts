import fs from "node:fs";
import path from "node:path";
import { SITE_URL } from "@/lib/site";

/**
 * File-based blog. Posts live as `.mdx` (or `.md`) files in `content/blog/`,
 * each with YAML frontmatter. This module reads them at build time — every
 * function here is server-only (it touches `fs`) and is consumed by React
 * Server Components, the sitemap, and the RSS route, all of which prerender.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogFrontmatter {
  title: string;
  slug: string;
  /** ISO date string, e.g. "2026-05-24". */
  publishedAt: string;
  excerpt: string;
  /** Estimated reading time in minutes. */
  readingTime: number;
  tags: string[];
  coverImage?: string;
  author: string;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  /** Raw MDX body with the frontmatter block stripped. */
  content: string;
}

// --- Minimal frontmatter parsing -------------------------------------------
// We control every post's frontmatter, so a small, predictable parser covers
// the supported shape (scalars, numbers, and string arrays — inline `[a, b]`
// or block `- a`). Post bodies are handled by next-mdx-remote's compiler; this
// only needs to read metadata for listings, the sitemap, and the feed.

function parseScalar(raw: string): unknown {
  const t = raw.trim();
  if (t === "") return "";
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  if (t === "true") return true;
  if (t === "false") return false;
  return t;
}

function parseFrontmatterBlock(src: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const lines = src.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!m) {
      i++;
      continue;
    }
    const [, key, rest] = m;
    if (rest === "") {
      // Block-style array on following indented `- item` lines.
      const items: unknown[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        items.push(parseScalar(lines[j].replace(/^\s*-\s+/, "")));
        j++;
      }
      out[key] = items;
      i = j;
    } else if (rest.startsWith("[") && rest.endsWith("]")) {
      const inner = rest.slice(1, -1).trim();
      out[key] = inner ? inner.split(",").map((s) => parseScalar(s)) : [];
      i++;
    } else {
      out[key] = parseScalar(rest);
      i++;
    }
  }
  return out;
}

function splitFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, content: raw };
  return {
    data: parseFrontmatterBlock(match[1]),
    content: raw.slice(match[0].length),
  };
}

function coerce(
  data: Record<string, unknown>,
  content: string,
  fallbackSlug: string,
): BlogFrontmatter {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime =
    typeof data.readingTime === "number" && data.readingTime > 0
      ? data.readingTime
      : Math.max(1, Math.round(words / 200));

  return {
    title: String(data.title ?? "Untitled"),
    slug: String(data.slug ?? fallbackSlug),
    publishedAt: String(data.publishedAt ?? ""),
    excerpt: String(data.excerpt ?? ""),
    readingTime,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    author: String(data.author ?? "Subroute"),
  };
}

// --- Public API ------------------------------------------------------------

/** All posts, newest first. */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = splitFrontmatter(raw);
      const fallbackSlug = file.replace(/\.mdx?$/, "");
      return { frontmatter: coerce(data, content, fallbackSlug), content };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime(),
    );
}

/** Frontmatter only, newest first — for listings, sitemap, and the feed. */
export function getAllPostsMeta(): BlogFrontmatter[] {
  return getAllPosts().map((p) => p.frontmatter);
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.frontmatter.slug === slug) ?? null;
}

export function postUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

/** Human-readable date, e.g. "May 24, 2026". Stable across locales/timezones. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
