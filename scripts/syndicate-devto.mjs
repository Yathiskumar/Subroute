#!/usr/bin/env node
/**
 * Syndicate a post from content/blog/ to dev.to.
 *
 *   pnpm syndicate:devto <slug> [--publish] [--update <id>] [--dry-run]
 *
 * Defaults to creating a DRAFT. Nothing becomes public unless you pass
 * --publish, and the script refuses to run at all without DEVTO_API_KEY in the
 * environment — put it in .env.local, never on the command line where it lands
 * in your shell history.
 *
 * The canonical_url always points back at subroute.dev. That is the entire
 * point of syndicating rather than reposting: dev.to brings the readers, the
 * original keeps the search credit.
 *
 * Plain .mjs with no dependencies — Node's built-in fetch does everything
 * needed, and the repo has a standing no-new-deps guardrail.
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const API = "https://dev.to/api/articles";
const ROOT = process.cwd();

// --- args ------------------------------------------------------------------

const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
  console.log(`
Syndicate a blog post to dev.to as a draft (or live with --publish).

  pnpm syndicate:devto <slug> [options]

Options
  --publish       Publish live instead of creating a draft
  --update <id>   Update an existing dev.to article instead of creating a new one
  --dry-run       Print exactly what would be sent, make no network call
  --help          Show this

Environment
  DEVTO_API_KEY   Required (except with --dry-run). Settings -> Extensions -> DEV API Keys
`);
  process.exit(0);
}

const slug = argv.find((a) => !a.startsWith("--") && argv[argv.indexOf(a) - 1] !== "--update");
const publish = argv.includes("--publish");
const dryRun = argv.includes("--dry-run");
const updateId = argv.includes("--update") ? argv[argv.indexOf("--update") + 1] : null;

if (!slug) fail("No slug given. Try: pnpm syndicate:devto my-post-slug");
if (updateId && !/^\d+$/.test(updateId)) fail(`--update expects a numeric article id, got "${updateId}"`);

// --- read the post ---------------------------------------------------------

const file = path.join(ROOT, "content", "blog", `${slug}.mdx`);
if (!existsSync(file)) fail(`No such post: content/blog/${slug}.mdx`);
const raw = readFileSync(file, "utf8");

const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
if (!fmMatch) fail(`${slug}.mdx has no frontmatter block`);
const frontmatter = parseFrontmatter(fmMatch[1]);
const body = raw.slice(fmMatch[0].length).trim();

for (const required of ["title", "excerpt", "tags"]) {
  if (!frontmatter[required]) fail(`Frontmatter is missing "${required}"`);
}

// Read the canonical origin from lib/site.ts rather than restating it, so the
// two can't drift apart.
const siteSrc = readFileSync(path.join(ROOT, "lib", "site.ts"), "utf8");
const SITE_URL = siteSrc.match(/SITE_URL\s*=\s*"([^"]+)"/)?.[1];
if (!SITE_URL) fail("Could not read SITE_URL out of lib/site.ts");
const canonical = `${SITE_URL}/blog/${slug}`;

// --- transform the body ----------------------------------------------------

const notes = [];
const markdown = stripJsxBlocks(body, canonical, notes);

// dev.to tags are alphanumeric only — no hyphens, spaces or underscores — and
// capped at 4. Sanitising rather than erroring keeps "system-design" usable as
// "systemdesign" instead of 422-ing the whole request.
const rawTags = frontmatter.tags;
const cleaned = [];
for (const t of rawTags) {
  const norm = String(t).toLowerCase().replace(/[^a-z0-9]/g, "");
  if (norm && !cleaned.includes(norm)) cleaned.push(norm);
}
const tags = cleaned.slice(0, 4);
const droppedTags = cleaned.slice(4);

// dev.to caps the SEO description at 250 characters.
let description = frontmatter.excerpt;
let truncated = false;
if (description.length > 250) {
  description = description.slice(0, 250).replace(/\s+\S*$/, "").trimEnd() + "…";
  truncated = true;
}

const article = {
  title: frontmatter.title,
  body_markdown: markdown,
  published: publish,
  canonical_url: canonical,
  description,
  tags,
};

// --- report ----------------------------------------------------------------

console.log(`\n  ${frontmatter.title}`);
console.log(`  canonical  ${canonical}`);
console.log(`  mode       ${updateId ? `UPDATE #${updateId}` : "CREATE"} · ${publish ? "PUBLISHED LIVE" : "draft"}`);
console.log(`  tags       ${tags.join(", ") || "(none)"}`);
if (JSON.stringify(rawTags.map(String)) !== JSON.stringify(tags)) {
  console.log(`             ↳ from ${rawTags.join(", ")}`);
}
if (droppedTags.length) console.log(`  ⚠ dropped  ${droppedTags.join(", ")} (dev.to allows 4)`);
if (truncated) console.log(`  ⚠ description truncated to 250 chars`);
for (const n of notes) console.log(`  ⚠ ${n}`);
console.log(`  body       ${markdown.length} chars\n`);

if (dryRun) {
  console.log("--- body_markdown ---\n");
  console.log(markdown);
  console.log("\n--- dry run, nothing sent ---");
  process.exit(0);
}

// --- send ------------------------------------------------------------------

const key = process.env.DEVTO_API_KEY;
if (!key) {
  fail(
    "DEVTO_API_KEY is not set.\n" +
      "  Get one at dev.to → Settings → Extensions → DEV API Keys,\n" +
      "  add it to .env.local, then run:  set -a; source .env.local; set +a",
  );
}

if (publish) {
  console.log("  Publishing LIVE to dev.to in 3s — ctrl-C to abort.");
  await new Promise((r) => setTimeout(r, 3000));
}

const res = await fetch(updateId ? `${API}/${updateId}` : API, {
  method: updateId ? "PUT" : "POST",
  headers: {
    "api-key": key,
    "Content-Type": "application/json",
    accept: "application/vnd.forem.api-v1+json",
  },
  body: JSON.stringify({ article }),
});

const text = await res.text();
if (!res.ok) {
  console.error(`\n✖ dev.to returned ${res.status}\n${text}\n`);
  if (res.status === 422) {
    console.error("422 usually means a duplicate title, a bad tag, or a canonical_url");
    console.error("already claimed by another article.\n");
  }
  process.exit(1);
}

const out = JSON.parse(text);
console.log(`✔ ${updateId ? "Updated" : "Created"} — id ${out.id}`);
console.log(`  ${out.url ?? `https://dev.to/dashboard`}`);
if (!publish) console.log(`  Still a draft. Review it, then hit publish on dev.to.\n`);

// --- helpers ---------------------------------------------------------------

/**
 * Minimal frontmatter reader: scalars and string arrays, inline `[a, b]` or
 * block `- a`. Deliberately duplicates the shape lib/blog.ts parses rather than
 * importing it — that module is TypeScript and server-only, and pulling in a
 * compile step for thirty lines is a worse trade than this.
 */
function parseFrontmatter(src) {
  const out = {};
  const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rest] = m;
    if (rest.trim() === "") {
      const items = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        items.push(unquote(lines[++i].replace(/^\s*-\s+/, "")));
      }
      out[key] = items;
    } else if (rest.trim().startsWith("[")) {
      out[key] = rest
        .trim()
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((s) => unquote(s.trim()))
        .filter(Boolean);
    } else {
      out[key] = unquote(rest.trim());
    }
  }
  return out;
}

function unquote(s) {
  const t = s.trim();
  return (t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))
    ? t.slice(1, -1)
    : t;
}

/**
 * dev.to sanitises HTML, so inline SVG figures and prototype iframes are
 * stripped on their end — silently, leaving a hole in the argument. Replacing
 * them here with an explicit pointer back to the original is both honest about
 * what's missing and the whole reason to syndicate in the first place.
 */
function stripJsxBlocks(src, url, notes) {
  const lines = src.split(/\r?\n/);
  const out = [];
  let figures = 0;
  let embeds = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^<figure\b/.test(line.trim())) {
      while (i < lines.length && lines[i].trim() !== "</figure>") i++;
      figures++;
      out.push(`> **Figure omitted** — [see the diagram in the original post](${url})`);
      continue;
    }

    if (/^<div className="embed"/.test(line.trim())) {
      while (i < lines.length && lines[i].trim() !== "</div>") i++;
      embeds++;
      out.push(`> **Interactive demo** — [run it in the original post](${url})`);
      continue;
    }

    out.push(line);
  }

  if (figures) notes.push(`${figures} figure${figures > 1 ? "s" : ""} replaced with a link back (dev.to strips inline SVG)`);
  if (embeds) notes.push(`${embeds} embed${embeds > 1 ? "s" : ""} replaced with a link back (dev.to strips iframes)`);

  const trailer = `\n\n---\n\n*Originally published at [${new URL(url).host}](${url}).*\n`;
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + trailer;
}

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}
