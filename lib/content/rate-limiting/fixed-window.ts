import type { ConceptContent } from "@/lib/content/types";

export const fixedWindow: ConceptContent = {
  prototypeCaption:
    "A counter resets every 10 seconds. Up to 5 requests are allowed per window. Watch the recent-windows strip below — and try clicking 'Burst of 8' right before the window resets to see the classic boundary problem.",

  overview: [
    {
      type: "p",
      text: "The fixed window counter is the simplest rate limiter that anyone ever writes. Pick a time window (say, 1 minute). Count requests in that window. If the count exceeds the limit, reject. When the window expires, reset the counter to zero. That's the whole algorithm.",
    },
    {
      type: "p",
      text: "Its simplicity is also its main weakness: by treating the window as a hard boundary, it allows up to **2× the limit** in a tight enough time span — by stacking bursts on either side of the reset. The prototype above demonstrates this clearly.",
    },
  ],

  howItWorks: [
    { type: "h", text: "One counter, one timer" },
    {
      type: "p",
      text: "The state per client is a tuple: `(count, windowStart)`. The algorithm:",
    },
    {
      type: "ol",
      items: [
        "On each request, check if the current window has expired (`now - windowStart >= windowSize`). If so, reset `count = 0` and `windowStart = now`.",
        "If `count < limit`, increment `count` and **allow** the request.",
        "Otherwise, **reject**.",
      ],
    },
    {
      type: "p",
      text: "In production this is usually implemented in Redis as `INCR rl:{client}:{window-id}` with an `EXPIRE` — two commands, atomic, distributed.",
    },
    { type: "h", text: "The boundary problem" },
    {
      type: "p",
      text: "Suppose your limit is 5 requests per 10-second window. A client sends 5 requests in the last second of one window, then 5 more in the first second of the next. That's 10 requests in ~2 seconds — twice the intended rate. The algorithm never noticed, because each window saw exactly 5.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Why this matters",
      text: "A determined attacker can sustain 2× your nominal limit indefinitely by syncing bursts to window boundaries. For most usage this isn't catastrophic, but if your downstream truly cannot handle 2× capacity, fixed window is the wrong tool.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Internal services** where rough-and-ready throttling is enough and exact behavior at boundaries doesn't matter.",
        "**Cost-quota systems** that bill per calendar interval (e.g. \"1000 requests per hour\") — the window boundary maps naturally to the billing boundary.",
        "**When operational simplicity is more important than perfect smoothing** — debugging is trivial because each window's count is a single integer.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Real-world example",
      text: "GitHub's REST API uses a fixed window: 5,000 requests per hour, with `X-RateLimit-Reset` telling you the exact UNIX timestamp when the next window starts. You can plan around it.",
    },
  ],

  tradeoffs: {
    pros: [
      "Dead-simple to implement and reason about — one integer per client per window.",
      "Trivial in Redis: `INCR` plus `EXPIRE`. O(1) memory and O(1) per request.",
      "Window boundaries align with human-readable units (top of the minute, top of the hour) — easy to communicate to API consumers.",
    ],
    cons: [
      "The boundary problem: up to 2× the limit can pass in a short interval straddling the reset.",
      "Coarse-grained — no information about distribution within the window.",
      "Resets cause sudden behavior changes (everyone's quota refills at the same instant).",
    ],
  },

  handsOn: [
    {
      title: "01 · Trigger the boundary attack",
      body: "Wait until the timer shows ~0.5s remaining. Click 'Send request' 5 times fast. As the window resets, immediately send 5 more. You just sent 10 requests in ~1.5 seconds against a 5-per-10s limit.",
    },
    {
      title: "02 · Read the history strip",
      body: "The bars below show the last few windows. A red bar means the limit was hit in that window. Are your burst patterns even, or do they cluster?",
    },
    {
      title: "03 · Predict the next reset",
      body: "Look at the time-remaining label. If you send a burst now, how many will succeed in the current window? How many will need to wait? Estimate before clicking — then verify.",
    },
  ],

  code: {
    language: "typescript",
    filename: "fixed-window.ts",
    code: `// In-memory fixed window. Production uses Redis INCR + EXPIRE.
class FixedWindow {
  private windowStart = Date.now();
  private count = 0;

  constructor(
    private limit: number,
    private windowSizeMs: number,
  ) {}

  allow(): boolean {
    const now = Date.now();
    if (now - this.windowStart >= this.windowSizeMs) {
      this.windowStart = now;
      this.count = 0;
    }
    if (this.count >= this.limit) return false;
    this.count++;
    return true;
  }
}

// Redis equivalent (atomic, distributed)
// const key = \`rl:\${userId}:\${Math.floor(Date.now() / windowMs)}\`;
// const count = await redis.incr(key);
// if (count === 1) await redis.expire(key, windowSeconds);
// return count <= limit;`,
  },

  furtherReading: [
    {
      label: "GitHub API rate limiting docs",
      note: "Canonical example of fixed-window quotas in production.",
    },
    {
      label: "Cloudflare blog — How we built rate limiting capable of scaling to millions of domains",
      note: "Compares fixed window, sliding window, and the boundary problem with real numbers.",
    },
  ],

  quiz: [
    {
      id: "fw-q1",
      question:
        "What is the 'boundary problem' in fixed-window rate limiting?",
      options: [
        { id: "a", label: "Counters cannot be stored at exact window boundaries." },
        { id: "b", label: "A client can pass up to 2× the limit by stacking bursts on both sides of a window reset." },
        { id: "c", label: "Timestamps round down at window boundaries." },
        { id: "d", label: "Redis cannot store integers across window resets." },
      ],
      correctOptionId: "b",
      explanation:
        "Each window enforces its own count independently. A burst at the end of one window and a burst at the start of the next are both legal — but back-to-back, they exceed the intended rate.",
    },
    {
      id: "fw-q2",
      question:
        "Which property makes fixed window appealing despite the boundary problem?",
      options: [
        { id: "a", label: "It allows bigger bursts than token bucket." },
        { id: "b", label: "It's a single integer per client per window — trivially atomic in Redis with INCR + EXPIRE." },
        { id: "c", label: "It guarantees zero rate-limit errors." },
        { id: "d", label: "It works without any storage." },
      ],
      correctOptionId: "b",
      explanation:
        "The two-command Redis pattern (INCR a key, set EXPIRE on first hit) is atomic, distributed, and dead-simple. For most rough quota needs, it's the right trade-off.",
    },
    {
      id: "fw-q3",
      question:
        "Fixed window with limit 100 per minute. A client sends 100 requests at 12:00:59.9 and 100 more at 12:01:00.1. What happens?",
      options: [
        { id: "a", label: "All 200 are accepted — they fall in two separate windows." },
        { id: "b", label: "100 are accepted, 100 are rejected." },
        { id: "c", label: "All 200 are rejected." },
        { id: "d", label: "Redis throws an error." },
      ],
      correctOptionId: "a",
      explanation:
        "This is the boundary problem in action — 200 requests in 200 milliseconds, double the intended rate, both windows happily under their limits.",
    },
  ],
};
