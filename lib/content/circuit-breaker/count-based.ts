import type { ConceptContent } from "@/lib/content/types";

export const countBased: ConceptContent = {
  prototypeCaption:
    "A **sliding window of the last N calls**. Click **healthy call** or **failing call** to fill it; the bar tracks the failure rate, the dotted line marks the threshold. Cross it and the breaker trips to **OPEN** — every later call is rejected instantly until the cooldown elapses and **Half-Open** trial calls decide whether to close again. Flip on **Auto traffic** to watch a steady stream of requests do it on their own.",

  overview: [
    {
      type: "p",
      text: "Count-Based is the simplest trip rule there is. Keep the results of the **last N calls** in a fixed-size buffer. Every time you add a new result, drop the oldest. Compute the failure rate over that buffer. If it crosses your threshold (say, 50%), trip the breaker.",
    },
    {
      type: "p",
      text: "That is the whole algorithm. No timestamps, no decay function, no latency tracking. Just a ring of booleans and a percentage. It is what most libraries (Resilience4j, Polly, Hystrix in 'count' mode) default to, and it is what you should start with unless you have a reason not to.",
    },
    {
      type: "p",
      text: "The fixed-size window is also its blind spot. If traffic is bursty — five calls in a minute, then nothing — the breaker may stay in whatever state it was the last time someone called it, ignoring fresh evidence simply because no new calls arrived. The **Time-Based** variant fixes that.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The trip rule, step by step" },
    {
      type: "ol",
      items: [
        "Maintain a **ring buffer** of the last N call results (true = ok, false = fail). On every new call, push to the back and drop from the front if full.",
        "Compute the **failure rate**: count of fails ÷ count of entries. (Most implementations also require a minimum number of samples — typically half the window — before they will trip, so a single failure in a near-empty window doesn't immediately open you.)",
        "If the rate is at or above the **threshold** and you have enough samples, **trip → OPEN**.",
        "While OPEN, every call is **rejected immediately** for the configured cooldown.",
        "After the cooldown, **OPEN → HALF-OPEN**: a small number of trial calls are allowed. If the failure rate over the trials clears the threshold (e.g. all succeed), close. Otherwise, OPEN again.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why a window — not a streak?",
      text: "A counting variant ('5 fails in a row') is intuitive but brittle: a single intervening success resets the streak, even if you're really failing 80% of the time. A windowed rate captures the truth more honestly. Real failures don't ask permission to alternate with successes.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The bursty-traffic blind spot",
      text: "Suppose your window is 20 and traffic is sparse — one call every few minutes. The breaker only learns when a call happens. A downstream that comes back to life between calls is invisible: the breaker still thinks the last 20 calls are 80% failed (because that's what they were ten minutes ago) and trips on the next request. If your traffic is bursty, prefer **Time-Based**, which ages calls out by clock time.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for Count-Based" },
    {
      type: "ul",
      items: [
        "**Steady, predictable traffic** — a service handling dozens or hundreds of calls per second. The window always reflects roughly the last second or two of behaviour.",
        "**You want the simplest possible breaker** — fewer knobs to tune, easier to reason about, easier to debug. Count-Based is the 'no surprises' default.",
        "**Memory is a real constraint** — N booleans is the smallest serious breaker you can build. No timestamps, no counters per second.",
        "**You're prototyping** — ship Count-Based first, then upgrade to Time-Based or Error-Percentage once you see the actual traffic shape.",
        "**Avoid** when traffic is *bursty* or *very low volume* — both starve the window of fresh data. Use Time-Based or Error-Percentage instead.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Library defaults",
      text: "Resilience4j's default sliding-window type is COUNT_BASED with N=100 and a 50% failure-rate threshold. Polly's basic circuit-breaker counts consecutive failures (a degenerate count-based with the simplest possible rule). Hystrix used a bucketed count window internally even when its public API talked about time.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Tiny memory** — N bits (or N booleans) and a pointer.",
      "**O(1) per call** — push to the ring, compute rate over a fixed-size array, done.",
      "**Predictable** — no clocks, no decay, no surprise from time-of-day effects.",
      "**Easy to explain** — 'we trip if the last 20 calls were ≥ 50% failures' is a sentence a non-engineer can understand.",
    ],
    cons: [
      "**Insensitive to traffic shape** — bursty or low-volume traffic can leave stale data in the window.",
      "**No self-recovery in quiet periods** — without new calls, the rate stays whatever it was last measured.",
      "**Threshold tuning is workload-specific** — what counts as 'too many' depends on your normal error rate, which N alone doesn't capture.",
      "**Can trip on a tiny sample** unless you enforce a minimum-call count — one fail of two calls is 50%.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the window fill and trip",
      body: "Press **healthy call** four times, then **failing call** five times. Watch the bar climb from green to red and cross the threshold line — the breaker badge flips to **open**. Note the rejected count starts ticking only *after* it tripped.",
    },
    {
      title: "02 · The cooldown and recovery",
      body: "After tripping, wait for the cooldown — the badge flips to **half-open**. Click **healthy call** the configured number of trial times (default 3). All trials pass → **closed**, window reset. Now make those trials fail and watch it slam back to **open**.",
    },
    {
      title: "03 · Auto traffic with a sick downstream",
      body: "Tick **Auto traffic** and drag **Downstream failures** above the threshold. Watch it trip on its own. Now drag failures back to 0 and let the trial calls in Half-Open close it. This is what production traffic looks like through the breaker's eyes.",
    },
    {
      title: "04 · Push the knobs",
      body: "Widen the **Window size** to 16 — it takes longer to trip but the rate is more accurate. Shrink it to 4 — it's twitchy and trips on small bursts. Raise the **Failure threshold** to 80% — the breaker becomes much more tolerant. Each knob is a tradeoff between sensitivity and stability.",
    },
  ],

  code: {
    language: "typescript",
    filename: "count-based.ts",
    code: `// Count-based circuit breaker: trip when the failure rate over the last N calls
// crosses the threshold. The simplest sliding window there is.
class CountBasedBreaker {
  private state: "CLOSED" | "OPEN" | "HALF" = "CLOSED";
  private window: boolean[] = [];        // true = ok, false = fail
  private trials: boolean[] = [];
  private openUntil = 0;

  constructor(
    private size = 10,
    private threshold = 0.5,             // 50%
    private cooldownMs = 5000,
    private trialCount = 3,
    private minCalls = 5,                // don't trip on tiny samples
  ) {}

  async call<T>(work: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() >= this.openUntil) { this.state = "HALF"; this.trials = []; }
      else throw new Error("circuit open");
    }
    try {
      const result = await work();
      this.record(true);
      return result;
    } catch (err) {
      this.record(false);
      throw err;
    }
  }

  private record(ok: boolean) {
    if (this.state === "HALF") {
      this.trials.push(ok);
      if (this.trials.length >= this.trialCount) {
        const fails = this.trials.filter(x => !x).length;
        if (fails / this.trials.length >= this.threshold) this.trip();
        else this.close();
      }
      return;
    }
    this.window.push(ok);
    if (this.window.length > this.size) this.window.shift();
    if (this.window.length >= this.minCalls) {
      const fails = this.window.filter(x => !x).length;
      if (fails / this.window.length >= this.threshold) this.trip();
    }
  }

  private trip()  { this.state = "OPEN"; this.openUntil = Date.now() + this.cooldownMs; this.trials = []; }
  private close() { this.state = "CLOSED"; this.window = []; this.trials = []; }
}`,
  },

  furtherReading: [
    {
      label: "Resilience4j — CircuitBreaker sliding window",
      href: "https://resilience4j.readme.io/docs/circuitbreaker#sliding-window",
      note: "The canonical modern implementation. The COUNT_BASED type is exactly this concept; the docs explain how it composes with the half-open phase.",
      kind: "docs",
    },
    {
      label: "Microsoft .NET — Circuit Breaker pattern",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker",
      note: "Azure architecture-centre write-up with sequence diagrams for the trip and half-open transitions. Good complement to the algorithm above.",
      kind: "docs",
    },
    {
      label: "Polly — Advanced circuit-breaker (count-based)",
      href: "https://www.pollydocs.org/strategies/circuit-breaker",
      note: ".NET resilience library. The 'advanced' variant counts failures and successes in a sampling window — same idea, .NET vocabulary.",
      kind: "docs",
    },
    {
      label: "Hystrix — How it works",
      href: "https://github.com/Netflix/Hystrix/wiki/How-it-Works",
      note: "Netflix's original (archived) implementation. Worth reading for the bucketed-window optimisation that turns 'last 10 seconds' into ten 1-second counters — useful background for the next concept.",
      kind: "docs",
    },
    {
      label: "Martin Fowler — Circuit Breaker",
      href: "https://martinfowler.com/bliki/CircuitBreaker.html",
      note: "The short article with the canonical state-diagram drawing. Reads as a count-based rule by default.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "cb-count-q1",
      question: "What exactly is the 'window' in count-based?",
      options: [
        { id: "a", label: "The last N seconds of calls." },
        { id: "b", label: "The last N call results, regardless of when they happened." },
        { id: "c", label: "All calls since startup." },
        { id: "d", label: "All calls since the breaker last closed." },
      ],
      correctOptionId: "b",
      explanation:
        "Count-based windows are sized by call count, not time. A call ages out only when N newer calls have arrived to push it off the buffer. That's why bursty traffic is its blind spot.",
    },
    {
      id: "cb-count-q2",
      question: "Why do most implementations require a minimum number of calls before they will trip?",
      options: [
        { id: "a", label: "To save memory until the buffer fills up." },
        { id: "b", label: "To avoid tripping on a tiny, noisy sample (e.g. 1 fail of 2 calls = 50%)." },
        { id: "c", label: "Because the underlying TCP stack needs at least 5 calls to warm up." },
        { id: "d", label: "Because the half-open phase needs that many trials." },
      ],
      correctOptionId: "b",
      explanation:
        "A 50% failure rate sounds bad until you realise it came from 1 failure out of 2 calls — a sample size you can't trust. A minimum-call guard is the cheapest fix; the Error-Percentage variant is the more sophisticated version of the same idea.",
    },
    {
      id: "cb-count-q3",
      question: "If your service handles roughly 1 request per minute, why is count-based a poor choice?",
      options: [
        { id: "a", label: "It uses too much memory." },
        { id: "b", label: "It tracks latency, which dominates at low rates." },
        { id: "c", label: "The window only learns when a call happens, so stale data sits in it for very long periods." },
        { id: "d", label: "Half-open trials can't run at low rates." },
      ],
      correctOptionId: "c",
      explanation:
        "At one call per minute, a 20-call window covers 20 minutes. The breaker's view of 'now' is 20 minutes stale. Time-based windows fix this by ageing calls out by wall-clock time instead of by arrival count.",
    },
  ],
};
