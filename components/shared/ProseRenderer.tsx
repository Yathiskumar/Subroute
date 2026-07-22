import { Fragment } from "react";
import Link from "next/link";
import { Callout } from "@/components/shared/Callout";
import { prettifySlug, resolveCrossRef } from "@/lib/content/cross-ref";
import { CodeBlock } from "@/components/shared/CodeBlock";
import type { ProseBlock } from "@/lib/content/types";

/** Tiny inline-markup renderer: handles **bold**, *italic*, and `code`. */
export function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Order matters: **bold** is tried before *italic* so the latter never
  // swallows a bold token. The [^*] guards keep the two from colliding.
  // [[kebab-slug]] is a cross-reference to another lesson/concept; the strict
  // slug shape keeps it from matching nested array literals like [["a", b]].
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[\[[a-z0-9-]+\]\])/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("[[")) {
      const slug = token.slice(2, -2);
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
    } else if (token.startsWith("*")) {
      parts.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="rounded-sm border border-border-subtle bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.9em]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    lastIdx = match.index + token.length;
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
                {block.text}
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
