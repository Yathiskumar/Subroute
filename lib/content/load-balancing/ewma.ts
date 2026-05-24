import type { ConceptContent } from "@/lib/content/types";

export const ewma: ConceptContent = {
  prototypeCaption:
    "Peak EWMA: each server's response time is smoothed into an exponentially-decaying average, plotted live per server. The pick score is EWMA × (active + 1). Drag the α slider to watch the curves go from slow-and-smooth (low α) to twitchy-and-reactive (high α), and see the half-life stat change with it.",

  overview: [
    {
      type: "p",
      text: "An exponentially weighted moving average (EWMA) is how you give a load balancer a *memory with a fading edge*. Each new latency sample is blended into a running average with weight α, while everything before it decays by (1 − α). Recent behavior dominates; ancient history quietly fades out. This is the statistical core of every modern adaptive balancer — Twitter's Finagle, Linkerd, and gRPC's latency-aware policies all route on an EWMA of response time.",
    },
    {
      type: "p",
      text: "The 'Peak' variant used here (from Finagle) keeps the same EWMA × (active + 1) score as least response time, but the EWMA makes the latency term *react quickly to spikes and recover only cautiously*. A server that gets slow is penalized fast; once it recovers, its score eases back down gradually rather than snapping, so you don't immediately stampede back onto a server that just had a bad moment.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The one-line recurrence" },
    {
      type: "p",
      text: "On every completed request, fold the new sample into the average:",
    },
    {
      type: "code",
      language: "text",
      code: "ewma = α · sample + (1 − α) · ewma",
    },
    {
      type: "ul",
      items: [
        "**α (alpha)** is the smoothing factor, 0 < α < 1. High α → the latest sample matters a lot → reactive but jumpy. Low α → heavy smoothing → stable but slow to notice change.",
        "**(1 − α)** is how much of the old average survives each step. Apply it repeatedly and old samples decay geometrically — that's the 'exponential' in EWMA.",
        "**Half-life** ≈ how many samples until an old observation's weight halves: `ln(0.5) / ln(1 − α)`. The prototype shows this live as you move the slider.",
      ],
    },
    { type: "h", text: "Why multiply by (active + 1)?" },
    {
      type: "p",
      text: "EWMA alone tells you how fast a server *has been*. Multiplying by the current outstanding-request count (plus one for the new request) turns it into an estimate of how long the *next* request will take given the queue in front of it. This is the same scoring shape as least response time — EWMA just supplies a much better latency number: one that forgets stale data at a rate you control.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Tuning α is the whole game",
      text: "Too high and the balancer chases noise, flapping traffic on every random slow request. Too low and it's sluggish, sending requests to a server that went bad seconds ago. The right α depends on your request rate and how spiky your latencies are — which is exactly what the slider lets you feel.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Adaptive, latency-aware balancing at scale** — the default in modern RPC stacks (Finagle, Linkerd, gRPC) and service meshes.",
        "**Noisy environments** — shared hardware, GC pauses, JIT warmup; EWMA smooths transient blips instead of overreacting to each one.",
        "**Paired with power-of-two-choices** — score two random servers by their EWMA and take the better one; nearly stateless yet sharply latency-aware.",
        "**When you need to react to degradation faster than a plain average allows** — Peak EWMA penalizes slowdowns quickly and recovers slowly, protecting tail latency.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "Twitter's Finagle ships `p2cPeakEwma`: power-of-two-choices over a Peak-EWMA latency score, with a configurable decay time. Linkerd's proxy uses the same idea. It's arguably the most-deployed 'smart' load-balancing policy in microservice infrastructure.",
    },
  ],

  tradeoffs: {
    pros: [
      "Tracks recent latency while forgetting stale data at a tunable rate — the best of running-average worlds.",
      "O(1) memory and compute per server: one number, one update per request.",
      "Peak variant reacts fast to slowdowns and recovers cautiously, protecting tail latency.",
      "Composes beautifully with power-of-two-choices for near-stateless adaptive balancing.",
    ],
    cons: [
      "α must be tuned — wrong values either chase noise or react too slowly.",
      "Still a lagging signal: EWMA only updates when requests complete.",
      "More moving parts to reason about and debug than a stateless counter.",
      "Per-balancer EWMAs can disagree across a distributed fleet, like any local-state scheme.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the curves settle",
      body: "Hit 'Auto' and watch the live chart. Server 3 starts at ×3 latency, so its line (red) climbs well above the others and the LB sends it less work. Each server's EWMA is exactly the number the score row multiplies by (active + 1) — the chart *is* what the algorithm sees.",
    },
    {
      title: "02 · Slide α from smooth to jumpy",
      body: "Drag the α slider to 0.05: the lines go glassy-smooth and the 'EWMA half-life' stat jumps to ~13 — old samples linger, so the balancer reacts slowly. Now push α to 0.90: the lines get jagged, half-life drops near ~0.3, and routing flips quickly on every spike. Find the α where it tracks change without flapping.",
    },
    {
      title: "03 · Create and heal a hotspot",
      body: "While it's running, raise Server 1's latency to ×4. Its EWMA line climbs and the LB drains traffic off it within a few samples. Drop it back to ×1 and watch how gently the line — and the traffic — return: Peak EWMA recovers cautiously, not instantly. Compare that lag at low vs. high α.",
    },
  ],

  code: {
    language: "typescript",
    filename: "peak-ewma.ts",
    code: `// Peak EWMA: smooth recent latency, score by ewma * (active + 1).
type Backend = { id: string; active: number; ewmaMs: number };

class PeakEwmaBalancer {
  private backends: Backend[];
  constructor(ids: string[], private alpha = 0.3, private defaultRtMs = 1500) {
    this.backends = ids.map((id) => ({ id, active: 0, ewmaMs: 0 }));
  }

  private score(b: Backend): number {
    const rt = b.ewmaMs || this.defaultRtMs;
    return (rt / 1000) * (b.active + 1);
  }

  acquire(): Backend {
    let best = this.backends[0];
    for (const b of this.backends) {
      if (this.score(b) < this.score(best)) best = b;
    }
    best.active++;
    return best;
  }

  // Fold the observed RTT into the exponentially-weighted average.
  release(b: Backend, rtMs: number): void {
    b.active--;
    b.ewmaMs = b.ewmaMs === 0
      ? rtMs
      : this.alpha * rtMs + (1 - this.alpha) * b.ewmaMs;
  }
}

// half-life in samples ≈ ln(0.5) / ln(1 - alpha)`,
  },

  furtherReading: [
    {
      label: "Finagle — Clients: Peak EWMA load balancer",
      href: "https://twitter.github.io/finagle/guide/Clients.html",
      note: "The canonical Peak-EWMA description: a peak-sensitive moving average of RTT, weighted by outstanding requests, with a decay time.",
      kind: "docs",
    },
    {
      label: "InfoQ — How Twitter Improves Resource Usage with a Deterministic Load Balancing Algorithm",
      href: "https://www.infoq.com/news/2020/01/twitter-deterministic-aperture/",
      note: "How Twitter evolved its P2C + EWMA balancing (aperture) in production, and what problems it solved.",
      kind: "article",
    },
    {
      label: "Mitzenmacher — The Power of Two Choices in Randomized Load Balancing",
      href: "https://www.eecs.harvard.edu/~michaelm/postscripts/tpds2001.pdf",
      note: "The P2C result that EWMA scoring is almost always paired with in practice.",
      kind: "paper",
    },
    {
      label: "Envoy — Load balancers",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers",
      note: "Envoy's least-request and slow-start behaviors — the same latency-aware family in a different proxy.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Moving average (exponential)",
      href: "https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average",
      note: "The EWMA recurrence, α, and how the weights decay geometrically — the math under the hood.",
      kind: "article",
    },
    {
      label: "Tyler McMullen — Load Balancing is Impossible (talk)",
      href: "https://www.infoq.com/presentations/load-balancing/",
      note: "Why time-decayed latency signals plus randomized choice beat both pure random and naive least-conns.",
      kind: "video",
    },
  ],

  quiz: [
    {
      id: "ewma-q1",
      question: "In `ewma = α·sample + (1 − α)·ewma`, what does a *high* α do?",
      options: [
        { id: "a", label: "Makes the average react quickly to new samples but noisier" },
        { id: "b", label: "Makes the average very smooth and slow to change" },
        { id: "c", label: "Disables the moving average" },
        { id: "d", label: "Weights the oldest sample most heavily" },
      ],
      correctOptionId: "a",
      explanation:
        "A high α gives the newest sample a large share of the average, so it reacts fast — but it also chases noise and can flap. A low α smooths heavily and reacts slowly. Tuning α trades reactivity against stability.",
    },
    {
      id: "ewma-q2",
      question: "Why does Peak EWMA multiply the smoothed latency by (active + 1)?",
      options: [
        { id: "a", label: "To convert milliseconds to seconds" },
        { id: "b", label: "To estimate the wait a new request faces, given the current queue" },
        { id: "c", label: "To make the score an integer" },
        { id: "d", label: "To ignore the server's latency" },
      ],
      correctOptionId: "b",
      explanation:
        "EWMA captures how fast the server has been; multiplying by the outstanding-request count (plus one for the incoming request) estimates how long the next request will actually wait. It's the least-response-time score with a better latency number.",
    },
    {
      id: "ewma-q3",
      question: "What's the main advantage of EWMA over a plain running average of response time?",
      options: [
        { id: "a", label: "It uses less memory" },
        { id: "b", label: "It never changes once set" },
        { id: "c", label: "It decays old samples, so it tracks recent behavior instead of all history" },
        { id: "d", label: "It requires no per-request updates" },
      ],
      correctOptionId: "c",
      explanation:
        "A simple mean weights a stale sample from long ago as much as a fresh one. EWMA's (1 − α) factor makes old samples fade geometrically, so the score reflects how the server is behaving *now* — at a decay rate you control via α.",
    },
  ],
};
