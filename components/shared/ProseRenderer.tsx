import { Fragment } from "react";
import Link from "next/link";
import { Callout } from "@/components/shared/Callout";
import { prettifySlug, resolveCrossRef } from "@/lib/content/cross-ref";
import { CodeBlock } from "@/components/shared/CodeBlock";
import type { ProseBlock } from "@/lib/content/types";

/**
 * Strips inline markup down to plain text. For contexts that can't render JSX —
 * `<meta>` descriptions, OG tags, JSON-LD — where the raw `**stars**` would
 * otherwise leak into search results and social cards.
 */
/**
 * One pass of the inline grammar. Alternation order is the precedence:
 * `code` wins outright (never parsed further), then **bold**, then *italic*,
 * then a [[cross-ref]].
 *
 * The delimiters are markdown's own rules, and they earn their keep:
 *  - `(?!\s)` / `(?<!\s)` means the marker must hug its text, so prose like
 *    "n * 2 * m" or a UML "0..*" is never mistaken for emphasis.
 *  - `(?!\*)` on the closing marker lets a run of three stars close correctly,
 *    which is what makes `**its *monitor***` parse as bold-wrapping-italic
 *    instead of leaving a stray star behind. Italic additionally refuses a
 *    closing star that *follows* one, so `*many readers **or** one writer*`
 *    closes at the end rather than snapping shut on the inner bold.
 *  - the bodies are lazy and unrestricted, so emphasis can *contain* other
 *    markup — that nesting is why this is recursive rather than one flat pass.
 * Built fresh per call: the regex is stateful (`g`), and recursion shares it otherwise.
 */
const inlineGrammar = () =>
  /`([^`]+)`|\*\*(?!\s)([\s\S]+?)(?<!\s)\*\*(?!\*)|\*(?!\s)([\s\S]+?)(?<!\s)(?<!\*)\*(?!\*)|\[\[([a-z0-9-]+)\]\]/g;

/**
 * Strips inline markup down to plain text. For contexts that can't render JSX —
 * `<meta>` descriptions, OG tags, JSON-LD — where the raw `**stars**` would
 * otherwise leak into search results and social cards.
 */
export function stripInline(text: string): string {
  const regex = inlineGrammar();
  let out = "";
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    out += text.slice(lastIdx, match.index);
    const [, code, bold, italic, slug] = match;
    if (code !== undefined) out += code;
    else if (bold !== undefined) out += stripInline(bold);
    else if (italic !== undefined) out += stripInline(italic);
    else if (slug !== undefined) out += resolveCrossRef(slug)?.title ?? prettifySlug(slug);
    lastIdx = regex.lastIndex;
  }
  return out + text.slice(lastIdx);
}

/** Tiny inline-markup renderer: handles **bold**, *italic*, `code`, and [[cross-refs]], nested freely. */
export function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = inlineGrammar();
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    const [, code, bold, italic, slug] = match;
    if (code !== undefined) {
      parts.push(
        <code
          key={key++}
          className="rounded-sm border border-border-subtle bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.9em]"
        >
          {code}
        </code>,
      );
    } else if (bold !== undefined) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {renderInline(bold)}
        </strong>,
      );
    } else if (italic !== undefined) {
      parts.push(
        <em key={key++} className="italic">
          {renderInline(italic)}
        </em>,
      );
    } else if (slug !== undefined) {
      const ref = resolveCrossRef(slug);
      parts.push(
        ref ? (
          <Link
            key={key++}
            href={ref.href}
            className="font-medium text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
          >
            {ref.title}
          </Link>
        ) : (
          <span key={key++}>{prettifySlug(slug)}</span>
        ),
      );
    }
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts.length ? parts : text;
}

export function ProseRenderer({ blocks }: { blocks: ProseBlock[] }) {
  return (
    <div className="flex flex-col">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="mb-4 leading-7 text-foreground/85">
                {renderInline(block.text)}
              </p>
            );
          case "h":
            return (
              <h3
                key={i}
                className="mt-8 mb-3 text-lg font-semibold tracking-tight text-foreground"
              >
                {renderInline(block.text)}
              </h3>
            );
          case "ul":
            return (
              <ul
                key={i}
                className="mb-4 list-disc space-y-2 pl-6 text-foreground/85 marker:text-accent"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="leading-7">
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={i}
                className="mb-4 list-decimal space-y-2 pl-6 text-foreground/85 marker:text-muted marker:font-mono marker:text-sm"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="leading-7">
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            );
          case "callout":
            return (
              <div key={i} className="my-5">
                <Callout variant={block.variant} title={block.title}>
                  <p className="leading-7">{renderInline(block.text)}</p>
                </Callout>
              </div>
            );
          case "code":
            return (
              <div key={i} className="my-5">
                <CodeBlock
                  filename={block.filename}
                  language={block.language}
                  code={block.code}
                />
              </div>
            );
          case "figure":
            return (
              <figure key={i} className="my-6">
                <div
                  className="overflow-x-auto rounded-lg border border-border-subtle bg-surface px-4 py-5"
                  dangerouslySetInnerHTML={{ __html: block.svg }}
                />
                {block.caption && (
                  <figcaption className="mt-2.5 px-1 text-center text-sm leading-6 text-muted">
                    {renderInline(block.caption)}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return <Fragment key={i} />;
        }
      })}
    </div>
  );
}
