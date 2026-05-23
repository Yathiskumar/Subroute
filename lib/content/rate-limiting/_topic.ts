import type { TopicContent } from "@/lib/content/types";

export const rateLimitingTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**Rate limiting is the practice of capping how many requests a client can make to a system in a given time window.** Every API at scale uses it. It's the difference between a service that politely tells abusive clients to slow down and one that falls over when traffic spikes.",
    },
    {
      type: "p",
      text: "The contract is simple: every incoming request is checked against a quota. If the client is under the limit, the request goes through. If not, it's rejected — typically with an HTTP `429 Too Many Requests` response and a header telling the client when to try again.",
    },
    {
      type: "p",
      text: "The interesting part isn't the contract — it's how you decide whether the limit was hit. There are five canonical algorithms, and each one trades off a different property: bursts vs. smoothness, memory vs. precision, simplicity vs. boundary correctness. Pick the wrong one and you either invite abuse or alienate your real users.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Why every API at scale needs it" },
    {
      type: "ul",
      items: [
        "**Protect against abuse** — brute-force login attempts, credential stuffing, scrapers hammering endpoints.",
        "**Fairness across clients** — one noisy customer shouldn't starve the rest. Rate limits enforce a per-client share.",
        "**Cost control** — when each request costs you money (a downstream API call, an LLM token, a database query), an unbounded client is unbounded spend.",
        "**Protect downstream systems** — your database has a connection limit. Your payment processor has a TPS cap. Rate limiting at the edge stops chaos from reaching them.",
        "**Predictable capacity planning** — if every client is bounded, your total load is bounded.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Where it lives",
      text: "Rate limiters almost always sit at the edge — API gateway, reverse proxy, or service mesh — keyed on something like API key, user ID, or IP address. Putting it deeper in the stack means the work is already happening; putting it at the edge means the bad request never costs you anything.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Algorithm",
      bursts: "Bursts",
      precision: "Precision",
      memory: "Memory",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "Token Bucket",
        bursts: "Allowed (up to capacity)",
        precision: "Exact",
        memory: "O(1) — 2 counters",
        bestFor: "Public APIs with friendly bursts",
      },
      {
        algorithm: "Leaky Bucket",
        bursts: "Smoothed away",
        precision: "Exact",
        memory: "O(B) — bounded queue",
        bestFor: "Protecting slow downstreams",
      },
      {
        algorithm: "Fixed Window Counter",
        bursts: "Up to 2× at boundaries",
        precision: "Coarse",
        memory: "O(1) — 1 counter",
        bestFor: "Hourly/daily quotas, simplicity",
      },
      {
        algorithm: "Sliding Window Counter",
        bursts: "Smoothed",
        precision: "Approximate (~1% error)",
        memory: "O(1) — 2 counters",
        bestFor: "Edge networks at scale",
      },
      {
        algorithm: "Sliding Window Log",
        bursts: "Smoothed",
        precision: "Exact (timestamp-level)",
        memory: "O(N) — every timestamp",
        bestFor: "Auth, low-rate security limits",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "Decision guide" },
    {
      type: "ul",
      items: [
        "**You want bursts but a sustained cap** → **Token Bucket**. The default choice for almost any public API.",
        "**You must protect a slow downstream from any spike** → **Leaky Bucket**. Output is constant by construction.",
        "**You need a simple per-hour or per-day quota** → **Fixed Window Counter**. One Redis `INCR` per request.",
        "**You operate at edge scale and need smoothness without growing memory** → **Sliding Window Counter**.",
        "**Precision matters more than throughput** — login attempts, password resets, financial caps → **Sliding Window Log**.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "When in doubt, start with Token Bucket",
      text: "It's the most-deployed algorithm on the public internet for a reason. Easy to implement, easy to communicate (\"X req/s with bursts up to Y\"), and friendly to real user traffic.",
    },
  ],
};
