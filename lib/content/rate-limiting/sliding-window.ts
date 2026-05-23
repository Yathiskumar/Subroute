import type { ConceptContent } from "@/lib/content/types";

export const slidingWindow: ConceptContent = {
  prototypeCaption:
    "The dashed orange box is a 15-second sliding view across two adjacent fixed windows. The estimate weights the previous window by how much of it still overlaps with 'now'. Try a burst and watch the formula update in real time.",

  overview: [
    {
      type: "p",
      text: "The sliding window counter (also called 'sliding window log approximation' or 'weighted sliding window') fixes the boundary problem of fixed windows without the memory cost of a full log. It's the algorithm Cloudflare uses for most of its rate-limiting product. The idea is clever: keep the simplicity of fixed-window counters, but estimate the rate over a rolling interval by blending the current and previous window's counts.",
    },
    {
      type: "p",
      text: "It's an approximation, not a perfect measurement. But the error is small (typically under 1% for well-distributed traffic), and the memory cost is the same as fixed window: two counters per client.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The weighted formula" },
    {
      type: "p",
      text: "You track two fixed-window counters: the **current** window's count, and the **previous** window's. On each request, compute:",
    },
    {
      type: "callout",
      variant: "info",
      text: "**estimate = previous_count × (1 − progress) + current_count**, where `progress = (now − window_start) / window_size`",
    },
    {
      type: "p",
      text: "If `estimate < limit`, allow the request and increment `current_count`. Otherwise, reject.",
    },
    {
      type: "p",
      text: "Walk through it: at the moment the current window starts (`progress = 0`), the estimate is `previous × 1 + current`, giving full weight to the previous window. Halfway through (`progress = 0.5`), it's `previous × 0.5 + current`, weighting it half. At the end of the window (`progress = 1`), it's just `current` — the previous window is forgotten.",
    },
    {
      type: "p",
      text: "The implicit assumption is that the previous window's traffic was uniformly distributed. This is approximate but holds well enough in practice.",
    },
    { type: "h", text: "Why this beats fixed window" },
    {
      type: "p",
      text: "A burst at the end of the previous window is still in the estimate until the previous window completely 'rolls off' (one full window-size later). So the boundary attack — stacking bursts across a reset — is now blocked: the estimate sees both.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Known approximation error",
      text: "Because we assume the previous window's traffic was uniform, a tight burst at the very start of the previous window is over-weighted as time goes on, and a burst at the very end is under-weighted. Cloudflare measured this and found <0.003% error for normal traffic distributions.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Public APIs at scale** where you want the smoothing of a true sliding window without the memory of a log.",
        "**Edge networks and CDNs** where every byte of state matters at multi-million request-per-second scale.",
        "**When you accept a tiny approximation error** in exchange for O(1) memory and constant-time operations.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Real-world example",
      text: "Cloudflare's edge rate limiter uses this exact algorithm. They published the design publicly — it's worth reading for the engineering trade-off discussion.",
    },
  ],

  tradeoffs: {
    pros: [
      "Smooth: no boundary cliff like fixed window.",
      "O(1) memory — only two counters per client.",
      "Constant-time decisions; no log scan.",
      "Distributable: two INCRs against Redis keys, one per window.",
    ],
    cons: [
      "Approximate — assumes uniform distribution within the previous window.",
      "More complex to reason about and explain to API consumers than 'X requests per minute, top of the minute'.",
      "Harder to surface a clean 'resets in X seconds' header (the rate decays continuously).",
    ],
  },

  handsOn: [
    {
      title: "01 · Read the formula in motion",
      body: "Hit **Burst of 8** (5 will be allowed, 3 denied — that's the current window). Wait until the status line flashes **'↻ Window rolled over'**: those 5 are now the **previous** count, and `current` resets to 0. From here the formula `estimate = prev × weight + curr` visibly ticks down as the weight slides from 1.00 toward 0.",
    },
    {
      title: "02 · Boundary attack — does it work?",
      body: "Try the burst-then-burst trick that broke fixed window. The estimate keeps both bursts in scope until the previous window rolls off completely, so the second burst gets rejected.",
    },
    {
      title: "03 · Force a rollover",
      body: "Send a few requests, then wait for the 'Window rolled over' message. Watch the current count become the previous count, and the current resets to 0. The estimate behavior continues smoothly.",
    },
  ],

  code: {
    language: "typescript",
    filename: "sliding-window.ts",
    code: `// Sliding window counter (weighted approximation).
class SlidingWindow {
  private windowStart = Date.now();
  private currentCount = 0;
  private previousCount = 0;

  constructor(
    private limit: number,
    private windowSizeMs: number,
  ) {}

  allow(): boolean {
    this.roll();
    const progress = (Date.now() - this.windowStart) / this.windowSizeMs;
    const estimate = this.previousCount * (1 - progress) + this.currentCount;
    if (estimate >= this.limit) return false;
    this.currentCount++;
    return true;
  }

  private roll() {
    const now = Date.now();
    if (now - this.windowStart >= this.windowSizeMs) {
      this.previousCount = this.currentCount;
      this.currentCount = 0;
      this.windowStart = now;
    }
  }
}

// Redis: two keys per client (prev, current) tied to window IDs.
// INCR is still O(1) — same cost as fixed window.`,
  },

  furtherReading: [
    {
      label: "Cloudflare — How we built rate limiting capable of scaling to millions of domains",
      href: "https://blog.cloudflare.com/counting-things-a-lot-of-different-things/",
      note: "Best public description of this algorithm at scale, with accuracy measurements.",
      kind: "article",
    },
    {
      label: "Figma — An alternative approach to rate limiting",
      href: "https://www.figma.com/blog/an-alternative-approach-to-rate-limiting/",
      note: "Engineering blog on a homegrown Redis-backed limiter — accurate, simple, space-efficient.",
      kind: "article",
    },
    {
      label: "Redis — Build rate limiters: fixed window, sliding window, and more",
      href: "https://redis.io/tutorials/howtos/ratelimiting/",
      note: "Walks through the two-counter sliding-window-counter pattern with runnable Lua.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "sw-q1",
      question:
        "In the sliding-window formula `estimate = previous × (1 − progress) + current`, what does `progress` represent?",
      options: [
        { id: "a", label: "The number of allowed requests so far." },
        { id: "b", label: "The fraction of the current window that has elapsed." },
        { id: "c", label: "The previous window's overflow." },
        { id: "d", label: "A constant tuned per client." },
      ],
      correctOptionId: "b",
      explanation:
        "`progress` runs from 0 (window just started) to 1 (window about to roll over). It controls how much of the previous window's count still counts.",
    },
    {
      id: "sw-q2",
      question:
        "Why is the sliding window counter only an approximation?",
      options: [
        { id: "a", label: "Because Redis is eventually consistent." },
        { id: "b", label: "Because it assumes the previous window's traffic was uniformly distributed in time." },
        { id: "c", label: "Because clocks drift." },
        { id: "d", label: "Because it sometimes drops requests randomly." },
      ],
      correctOptionId: "b",
      explanation:
        "The weighting `previous × (1 − progress)` implicitly treats the previous window's count as evenly spread. Real traffic is bursty, so the weight is approximate. In practice the error is tiny — under 1% for typical workloads.",
    },
    {
      id: "sw-q3",
      question:
        "Compared to a sliding-window log, what does the sliding-window counter sacrifice?",
      options: [
        { id: "a", label: "Memory efficiency." },
        { id: "b", label: "Boundary correctness." },
        { id: "c", label: "Exact per-request precision — it's an approximation." },
        { id: "d", label: "Latency — it's slower per request." },
      ],
      correctOptionId: "c",
      explanation:
        "Sliding log records every timestamp and gives an exact count. The counter version trades that exactness for O(1) memory. For most workloads the trade is excellent.",
    },
  ],
};
