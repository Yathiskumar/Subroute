import type { ConceptContent } from "@/lib/content/types";

export const leakyBucket: ConceptContent = {
  prototypeCaption:
    "Requests fill the bucket. It drains at a constant 1 per second — no faster, no matter how hard you push. Overflow is dropped. Try 'Burst of 15' to see the smoothing effect.",

  overview: [
    {
      type: "p",
      text: "The leaky bucket flips the token bucket on its head. Instead of tokens coming in and being consumed by requests, requests themselves fill the bucket — and they drain out at a fixed rate, like water leaking through a pinhole. The output rate is always constant, regardless of how spiky the input is.",
    },
    {
      type: "p",
      text: "If you've ever seen a network operator talk about 'traffic shaping' or a 'committed information rate' — they're talking about a leaky bucket. It's the algorithm that turns a chaotic input stream into a clean, steady output stream.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Water in, water out — at a fixed rate" },
    {
      type: "p",
      text: "The classic implementation is a FIFO queue with two parameters:",
    },
    {
      type: "ul",
      items: [
        "**Capacity (B)** — the maximum number of queued requests. Overflow gets dropped.",
        "**Leak rate (r)** — how many requests are processed per second, regardless of arrival pattern.",
      ],
    },
    {
      type: "p",
      text: "The algorithm is two independent flows:",
    },
    {
      type: "ol",
      items: [
        "**On arrival:** if `queue.length < B`, append the request. Otherwise drop it.",
        "**On a timer (every 1/r seconds):** if the queue is non-empty, dequeue one request and forward it downstream.",
      ],
    },
    { type: "h", text: "The smoothing property" },
    {
      type: "p",
      text: "Whatever the input pattern — a steady stream, a sudden burst, a flatline — the output is metronome-steady at exactly r per second. This is the leaky bucket's whole reason for existing: it makes downstream systems' job easy.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Two variants in the wild",
      text: "The version shown here (a queue that drains at a fixed rate) is the **leaky bucket as a meter** — used for traffic shaping. There's also a **leaky bucket as a counter** variant that behaves almost identically to a token bucket. Be careful when reading older papers; they sometimes conflate the two.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Smoothing bursts before a slow downstream** — a database, an external API, a payment processor with strict TPS limits.",
        "**Network traffic shaping** — historically the original use case.",
        "**Egress queues** where you want predictable, constant outflow.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "NGINX's `limit_req` module is a leaky bucket: it forwards requests at exactly the configured rate and queues (or rejects) excess. Many message brokers and ETL pipelines use the same shape for the same reason.",
    },
  ],

  tradeoffs: {
    pros: [
      "Output rate is provably constant — perfect for protecting fragile downstreams.",
      "Implementation is a queue plus a timer — trivially understandable.",
      "Memory is bounded by capacity (the queue cannot exceed B entries).",
    ],
    cons: [
      "No bursting — even when downstream is idle, the leak rate is the leak rate. Capacity goes unused.",
      "Adds latency: a request that arrives during a queue of 9 waits 9 leak intervals before being served.",
      "Requires a timer or scheduler, which is more moving parts than token bucket's lazy refill.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the smoothing",
      body: "Click 'Burst of 15'. Notice the queue fills, then drains at exactly 1/sec for the next 10 seconds. The input was bursty, the output is metronomic.",
    },
    {
      title: "02 · Force an overflow",
      body: "Hit 'Burst of 15' on a full queue. The 'Dropped' counter should jump. This is the trade-off: leaky bucket rejects under load instead of slowing down.",
    },
    {
      title: "03 · Compare with token bucket",
      body: "Open the token bucket prototype in another tab. Burst both with the same input. Token bucket lets the burst through then runs out; leaky bucket smooths it out over time. Same goal, opposite philosophy.",
    },
  ],

  code: {
    language: "typescript",
    filename: "leaky-bucket.ts",
    code: `// A simple leaky bucket (FIFO queue + steady drain).
class LeakyBucket {
  private queue: (() => void)[] = [];

  constructor(
    private capacity: number,
    private leakIntervalMs: number,
  ) {
    setInterval(() => this.leak(), this.leakIntervalMs);
  }

  enqueue(work: () => void): boolean {
    if (this.queue.length >= this.capacity) return false;
    this.queue.push(work);
    return true;
  }

  private leak() {
    const next = this.queue.shift();
    if (next) next();
  }
}

// Process at exactly 10 requests per second, max queue 50.
const bucket = new LeakyBucket(50, 100);
if (!bucket.enqueue(() => handleRequest(req))) {
  // queue full — drop the request
}`,
  },

  furtherReading: [
    {
      label: "Wikipedia — Leaky bucket",
      note: "The article distinguishes the two variants (meter vs. counter) clearly.",
    },
    {
      label: "NGINX limit_req docs",
      note: "Production-grade leaky bucket configuration.",
    },
    {
      label: "ATM Forum — Traffic Management Specification",
      note: "The dense original definition from telecom networks. Skim section 4 for the math.",
    },
  ],

  quiz: [
    {
      id: "lb-q1",
      question:
        "What is the defining property of a leaky bucket compared to a token bucket?",
      options: [
        { id: "a", label: "The output rate is always constant, regardless of input pattern." },
        { id: "b", label: "It uses less memory." },
        { id: "c", label: "It allows bigger bursts." },
        { id: "d", label: "It never drops requests." },
      ],
      correctOptionId: "a",
      explanation:
        "The leaky bucket is a traffic shaper: the leak rate determines the output, period. Token bucket lets bursts through; leaky bucket smooths them.",
    },
    {
      id: "lb-q2",
      question:
        "A leaky bucket has capacity 10 and leak rate 1/sec. Twenty requests arrive at the same instant. What happens?",
      options: [
        { id: "a", label: "All 20 are processed immediately." },
        { id: "b", label: "All 20 are dropped." },
        { id: "c", label: "10 are queued, 10 are dropped. The 10 queued drain over 10 seconds." },
        { id: "d", label: "The bucket explodes and you get paged at 3 AM." },
      ],
      correctOptionId: "c",
      explanation:
        "Capacity is the queue size. The first 10 fit; the next 10 overflow and are dropped. The queued 10 then drain at 1/sec, taking 10 seconds.",
    },
    {
      id: "lb-q3",
      question:
        "Why might you choose token bucket over leaky bucket for a public API?",
      options: [
        { id: "a", label: "Token bucket uses less memory." },
        { id: "b", label: "Token bucket lets users burst when their app legitimately needs to, which is friendlier than forcing a constant rate." },
        { id: "c", label: "Token bucket is more accurate." },
        { id: "d", label: "Leaky bucket is deprecated." },
      ],
      correctOptionId: "b",
      explanation:
        "User-facing traffic is bursty by nature (page loads, batch syncs). Token bucket accommodates that. Leaky bucket is more appropriate when you must protect a slow downstream from any spike.",
    },
  ],
};
