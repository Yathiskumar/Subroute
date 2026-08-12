/**
 * Renders one JSON-LD block.
 *
 * "<" is escaped so a stray "</script>" inside any field can't break out of the
 * tag. Every payload here is build-time content, but the escape costs nothing
 * and removes the whole class of bug rather than relying on the inputs staying
 * safe.
 *
 * Multiple blocks per page are fine — consumers merge them, which is what lets
 * a page-level node point at the site-wide Organization by `@id`.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
