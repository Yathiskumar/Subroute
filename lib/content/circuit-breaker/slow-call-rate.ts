import type { ConceptContent } from "@/lib/content/types";

export const slowCallRate: ConceptContent = {
  prototypeCaption:
    "The breaker trips on **latency**, not errors. Every bar is one call's response time. Calls below the dotted line are **fast** (green); above it, **slow** (amber). Once the share of slow calls crosses the rate threshold, the breaker **trips** — even though every single call 'succeeded'. Drag **Downstream latency** above the slow line to see it happen on its own.",

  overview: [
    {
      type: "p",
      text: "Sometimes the downstream isn't broken — it's just *slow*. A database returning correct rows in 5 seconds will exhaust your thread pool just as effectively as one returning 500s instantly. The classic error-only breaker can't see that: every call returns 200 OK and the breaker stays closed while your service drowns.",
    },
    {
      type: "p",
      text: "The Slow Call Rate variant adds a latency dimension. Each call is timed; any call slower than a configured duration D is counted as 'slow.' If the share of slow calls in the window crosses a rate threshold (default 50%), the breaker trips just as it would for errors.",
    },
    {
      type: "p",
      text: "It's not a replacement for the error-based rule — most production setups run both. Errors trip on outright failure; slow-call-rate trips on degraded performance. Together they catch the two ways a dependency can take your service down.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The trip rule" },
    {
      type: "ol",
      items: [
        "On every call, **measure the duration** (start_time → end_time).",
        "Push the duration into a sliding window (count- or time-based — both work, this prototype uses count-based for clarity).",
        "Count how many durations are **≥ D** (the slow threshold).",
        "If that count divided by the window size hits the **slow-rate threshold** (e.g. 50%), **trip**.",
        "OPEN, cooldown, HALF-OPEN, trials — the rest is the standard state machine, with the same trip rule (still latency-based) applied to the trial calls.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Choose D from your SLO, not your gut",
      text: "The slow-duration D should come from what *callers* consider acceptable, not from what feels round. If your p99 SLO is 500ms, set D somewhere around there — D ≪ 500ms is too sensitive (trips on normal noise), D ≫ 500ms is too lax (trips after you've already broken the SLO). Real implementations often pick D = your timeout / 2.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Errors AND slow-call-rate, in parallel",
      text: "Resilience4j's recommendation is to enable both. An error rate trip catches outright 5xx; a slow-call-rate trip catches the trickier case where the dependency hangs but eventually returns. If you only enable one, prefer slow-call-rate for any dependency that holds a thread or connection — the slow-call case is the one that actually cascades.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to add Slow Call Rate to the mix" },
    {
      type: "ul",
      items: [
        "**Synchronous calls that hold a thread** — a slow downstream pins your thread pool. The slow-call-rate breaker frees those threads by failing fast.",
        "**Connection-pool-bound clients** — same idea at the connection layer. A slow database doesn't error, but it holds every connection in your pool until you trip.",
        "**Strict latency SLOs** — if 'too slow' is itself a contract violation, you'd rather degrade gracefully (fallback, cached value) than serve a slow response.",
        "**Downstreams that prefer to hang than fail** — some services swallow errors and time out at the load balancer instead of returning fast errors. Latency is the only signal you'll see.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "It pairs with timeouts, not replaces them",
      text: "A breaker is not a timeout. Without a timeout, a slow call still blocks the caller; the breaker only sees its duration after it eventually returns. Always set a per-call timeout *first*; the breaker then uses the bounded duration distribution to decide when to trip globally.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Catches the 'slow but not failing' case** that error-only breakers miss entirely.",
      "**Composes with the error-rate rule** — most libraries let you set both thresholds and either trips the breaker.",
      "**Cheap to add** — just record (duration, was-slow) per call; the comparison and counter are O(1).",
      "**Operationally legible** — 'we trip if ≥ 50% of calls take longer than 500 ms' is a one-sentence SLO you can show to product.",
    ],
    cons: [
      "**Tuning D matters** — wrong D means false trips (too low) or missed degradations (too high).",
      "**Doesn't capture errors** — you still need an error-rate rule (or both rules running in parallel).",
      "**Sensitive to one slow tail call** in low-volume windows — 1 of 2 calls being slow is 50% slow rate.",
      "**Has to wait for the call to return** to measure it — a permanently hanging call (no timeout) never registers as 'slow'. Hence the warning above.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the bars colour by speed",
      body: "Click **fast call** a few times — short green bars. Click **slow call** a few times — taller amber bars that overshoot the dotted line. The bar height is the latency; the threshold line and the colour both come from your **Slow if over** setting.",
    },
    {
      title: "02 · Trip on slow alone (no errors)",
      body: "Click **slow call** five times in a row. The bottom rate bar climbs into red — every call 'succeeded' but the slow-call rate is 100%. The breaker trips. The point: an error-only breaker would still be sitting at green right now.",
    },
    {
      title: "03 · Auto traffic with rising latency",
      body: "Tick **Auto traffic**. Slowly raise **Downstream latency** past the **Slow if over** value. Watch the bars turn amber and the rate climb. Drop latency back down to recover.",
    },
    {
      title: "04 · Tune the slow-duration",
      body: "Set **Downstream latency** to a fixed value, e.g. 400ms. Now slide **Slow if over** from 100ms to 1200ms. Same calls, completely different verdict — when D=100, all are slow; when D=1200, none are. The take-away: this knob is your most important one.",
    },
  ],

  code: {
    language: "typescript",
    filename: "slow-call-rate.ts",
    code: `// Slow-call-rate breaker: trip when too many calls take longer than D ms.
// Same state machine as the error-rate breaker, just a different signal.
class SlowCallBreaker {
  private state: "CLOSED" | "OPEN" | "HALF" = "CLOSED";
  private durations: number[] = [];   // ms
  private trials: number[] = [];
  private openUntil = 0;

  constructor(
    private size = 10,
    private slowMs = 500,
    private rateThreshold = 0.5,
    private cooldownMs = 5000,
    private trialCount = 3,
    private minCalls = 5,
  ) {}

  async call<T>(work: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN" && Date.now() >= this.openUntil) {
      this.state = "HALF"; this.trials = [];
    }
    if (this.state === "OPEN") throw new Error("circuit open");

    const start = performance.now();
    try {
      return await work();
    } finally {
      this.record(performance.now() - start);   // record even on throw
    }
  }

  private record(durationMs: number) {
    if (this.state === "HALF") {
      this.trials.push(durationMs);
      if (this.trials.length >= this.trialCount) {
        if (this.slowRate(this.trials) >= this.rateThreshold) this.trip();
        else this.close();
      }
      return;
    }
    this.durations.push(durationMs);
    if (this.durations.length > this.size) this.durations.shift();
    if (this.durations.length >= this.minCalls && this.slowRate(this.durations) >= this.rateThreshold) {
      this.trip();
    }
  }

  private slowRate(arr: number[]) {
    const slow = arr.filter(d => d >= this.slowMs).length;
    return slow / arr.length;
  }

  private trip()  { this.state = "OPEN"; this.openUntil = Date.now() + this.cooldownMs; this.trials = []; }
  private close() { this.state = "CLOSED"; this.durations = []; this.trials = []; }
}`,
  },

  furtherReading: [
    {
      label: "Resilience4j — Slow call configuration",
      href: "https://resilience4j.readme.io/docs/circuitbreaker#configuration",
      note: "The slowCallRateThreshold and slowCallDurationThreshold options. Worth reading alongside the failureRateThreshold — they share a window and can both trip.",
      kind: "docs",
    },
    {
      label: "Marc Brooker — Timeouts, retries, and backoff with jitter",
      href: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
      note: "AWS Builders' Library piece explaining why slow responses (not errors) cause most cascading failures. The clearest justification for adding a slow-call rule alongside the error rule.",
      kind: "article",
    },
    {
      label: "Hystrix — Why Hystrix?",
      href: "https://github.com/Netflix/Hystrix/wiki",
      note: "The original problem statement — Netflix's services were being taken down by *slow* dependencies, not crashed ones. Reading the motivation makes this variant click.",
      kind: "docs",
    },
    {
      label: "Envoy — outlier detection (slow responses)",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/outlier",
      note: "Envoy ejects hosts based on consecutive 5xx and consecutive gateway failures including timeouts — the proxy-layer equivalent of a slow-call-rate rule.",
      kind: "docs",
    },
    {
      label: "Google SRE — Handling Overload (Ch. 21)",
      href: "https://sre.google/sre-book/handling-overload/",
      note: "The chapter on adaptive throttling and overload. Explains why latency is the signal you actually want to react to — much of which translates directly to breaker design.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "cb-slow-q1",
      question: "Why isn't an error-rate breaker enough on its own?",
      options: [
        { id: "a", label: "Errors are too rare to be useful." },
        { id: "b", label: "A downstream can return 200 OK very slowly and still take you down." },
        { id: "c", label: "Error rates always need a minimum-call gate to be reliable." },
        { id: "d", label: "Most downstreams don't return errors anymore." },
      ],
      correctOptionId: "b",
      explanation:
        "Most cascading failures aren't caused by errors — they're caused by slow successes that pin threads, connections, and queues. An error-rate-only breaker sits at 0% while your service runs out of capacity.",
    },
    {
      id: "cb-slow-q2",
      question: "What's the most important knob in this variant?",
      options: [
        { id: "a", label: "The window size." },
        { id: "b", label: "The slow-duration threshold (D)." },
        { id: "c", label: "The cooldown duration." },
        { id: "d", label: "The half-open trial count." },
      ],
      correctOptionId: "b",
      explanation:
        "D defines what counts as slow. Get it wrong and the rate threshold becomes meaningless — too low and you trip on normal noise, too high and you miss real degradations. Derive D from your SLO, not from a round number.",
    },
    {
      id: "cb-slow-q3",
      question: "Why does this rule pair with — not replace — a per-call timeout?",
      options: [
        { id: "a", label: "Timeouts are a different state machine." },
        { id: "b", label: "Without a timeout, a hanging call never returns, so the breaker never measures it as slow." },
        { id: "c", label: "Timeouts only work for HTTP, breakers work for any protocol." },
        { id: "d", label: "Both implement the same algorithm — pick whichever is easier." },
      ],
      correctOptionId: "b",
      explanation:
        "The breaker only sees a call's duration after the call returns. If the call hangs forever, it never enters the window. Per-call timeouts give every call a bounded duration, which the breaker can then aggregate.",
    },
  ],
};
