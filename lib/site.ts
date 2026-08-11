/** Canonical origin for the production site. Used for SEO canonical/OG URLs,
 *  the sitemap, and the RSS feed. Keep this in sync with the deployed domain. */
export const SITE_URL = "https://subroute.dev";

export const SITE_NAME = "Subroute";

export const SITE_DESCRIPTION =
  "An interactive playground for technical concepts. Explore system design, algorithms, and infrastructure through visual simulations you can actually touch.";

/** Feed discovery. Next merges `alternates` by replacement, not by deep merge —
 *  any page that sets its own `alternates` (every blog route does, for the
 *  canonical) drops whatever the root layout declared. So this gets spread into
 *  each of them rather than living only at the root. */
export const RSS_ALTERNATE_TYPES = {
  "application/rss+xml": [
    { url: "/blog/rss.xml", title: `${SITE_NAME} — Blog` },
  ],
};

/** Stable node ids so the Organization declared once in the root layout can be
 *  referenced by `@id` from per-page blocks (a BlogPosting's publisher, say)
 *  instead of being redescribed. Consumers merge JSON-LD across all blocks on
 *  a page, so the graph links up. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
