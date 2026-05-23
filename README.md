# Subroute — Interactive Learning Platform (Scaffold)

A scaffold for a web platform where users learn technical CS / system-design
concepts through **interactive prototypes and visual simulations**, not static
text. This repo is **Phase 1**: structure, routes, and components only. All
content is placeholder. One end-to-end working demo prototype is wired up to
prove the iframe-loading mechanism.

---

## Quick start

```bash
pnpm install      # if you haven't already
pnpm dev          # open http://localhost:3000
```

Other scripts:

```bash
pnpm build        # production build
pnpm start        # serve built output
pnpm typecheck    # run tsc --noEmit
pnpm lint         # next lint
```

Dark mode is the default. Toggle in the navbar.

> One working prototype lives at
> `/topics/rate-limiting/token-bucket` — it loads
> `/public/prototypes/demo/demo.html` in a sandboxed iframe. All other concept
> pages show a polished placeholder where their prototype will go.

---

## Tech stack

- **Next.js 14** App Router · TypeScript strict
- **Tailwind CSS** with semantic CSS-variable tokens
- **Radix UI** primitives (Dialog, Collapsible, Slot) — minimal, hand-rolled
- **next-themes** for dark/light mode
- **Framer Motion**, **lucide-react** installed and ready
- **@next/mdx**, **shiki** installed (not wired yet; reserved for content phase)
- **pnpm** as package manager

All colors, surfaces, and accents resolve to CSS variables defined in
`styles/globals.css`. No hex codes live in components.

---

## Folder structure

```
app/
  layout.tsx                       Root layout + fonts + Providers
  page.tsx                         Homepage
  not-found.tsx                    404 page
  topics/
    page.tsx                       Topic listing (with search + tag filter)
    [topicSlug]/
      page.tsx                     Topic detail (concept list + sidebar TOC)
      [conceptSlug]/page.tsx       Concept detail — the main learning surface
  about/page.tsx
  playground/page.tsx
  providers.tsx                    ThemeProvider wrapper

components/
  ui/                              Base primitives (button, card, badge, input, ...)
  layout/                          Navbar, Footer, MobileMenu, ThemeToggle, Logo
  cards/                           TopicCard, ConceptCard
  prototype/                       PrototypeFrame (iframe + toolbar)
  quiz/                            QuizContainer, QuizQuestion
  shared/                          Breadcrumb, Callout, CodeBlock, ConceptNav,
                                   DifficultyBadge, EmptyState, FeedbackWidget,
                                   ProgressBar, SearchBar, SectionHeading, TagChip

lib/
  data/
    topics.ts                      All placeholder topic + concept data (typed)
    quiz.ts                        Sample quiz data
  types/
    index.ts                       Topic, Concept, Difficulty, QuizItem types
  utils/
    cn.ts, slug.ts                 Helpers

public/
  prototypes/
    demo/demo.html                 The working token-bucket demo

styles/
  globals.css                      Theme tokens (CSS vars) + base styles
```

---

## Design system

All colors, borders, and accent values are CSS variables. Semantic Tailwind
tokens are exposed in `tailwind.config.ts`:

| Token                   | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `bg-background`         | Page background                               |
| `bg-surface`            | Subtle elevation                              |
| `bg-surface-elevated`   | Card/panel surfaces                           |
| `bg-surface-sunken`     | Recessed areas (code, console)                |
| `border-border`         | Default border                                |
| `border-border-subtle`  | Quiet divider                                 |
| `border-border-strong`  | Stronger border on hover/focus                |
| `text-foreground`       | Primary text                                  |
| `text-muted`            | Secondary text                                |
| `text-subtle`           | Tertiary / labels                             |
| `text-accent`           | Signal accent (warm orange)                   |
| `text-diff-*`           | Difficulty (`beginner`, `intermediate`, `advanced`) |

Two utility classes worth knowing:

- `.kicker` — mono uppercase mini-label used above headings.
- `.bg-grid-fade` / `.bg-dot-grid` — decorative backgrounds masked to fade out.

---

## How to add a new topic

Topics live in **`lib/data/topics.ts`** as a typed array. Adding a topic is a
one-file change — the rest of the app picks it up automatically.

```ts
// lib/data/topics.ts
export const TOPICS: Topic[] = [
  // ...existing topics
  {
    slug: "circuit-breakers",                    // url path segment
    title: "Circuit Breakers",
    description: "Stop calling a failing service before it takes you down with it.",
    difficulty: "intermediate",
    icon: "Zap",                                  // any lucide-react icon name
    tags: ["distributed", "resilience"],
    estimatedTime: "40 min",
    prerequisites: ["Retries & timeouts"],
    concepts: [
      {
        slug: "closed-open-half-open",
        title: "Closed / Open / Half-Open",
        oneLiner: "The three states every circuit breaker cycles through.",
        difficulty: "intermediate",
        estimatedTime: "8 min",
        prototypePath: null,                     // or "/prototypes/circuit-breakers/states.html"
      },
      // ...more concepts
    ],
  },
];
```

The topic will appear:
- on the homepage's featured grid (first six),
- on `/topics`,
- at `/topics/circuit-breakers`,
- and each concept at `/topics/circuit-breakers/<conceptSlug>`.

---

## How to add a new prototype

1. Drop a standalone HTML file under
   `public/prototypes/<topic-slug>/<concept-slug>.html`. It can use any vanilla
   HTML / CSS / JS — no build step.
2. Set `prototypePath` on the matching concept in `lib/data/topics.ts` to
   `"/prototypes/<topic-slug>/<concept-slug>.html"`.

That's it. The iframe is sandboxed with `allow-scripts` and loads lazily.
See `public/prototypes/demo/demo.html` for a working reference (token-bucket
simulation with sliders, animated bucket, and event log).

---

## How to swap in real content

Phase 1 deliberately ships **no MDX wiring**. The dependencies
(`@next/mdx`, `shiki`) are installed and ready; the explanation area in
`app/topics/[topicSlug]/[conceptSlug]/page.tsx` is where MDX-rendered content
will plug in. Replace the placeholder `<article>` body with `<Mdx source={...} />`
once the content pipeline is built.

---

## Out of scope for this phase

- Real educational content / explanations
- Real interactive prototypes beyond the demo
- Authentication, user accounts, progress persistence
- Backend / database
- Real quiz scoring logic (placeholder submit only)
- MDX rendering pipeline
- Analytics, telemetry, SEO beyond basic per-page metadata

---

## License

Scaffold. Use it however helps.
