import type { ConceptContent } from "@/lib/content/types";

export const timeBased: ConceptContent = {
  prototypeCaption:
    "A **time-based window** — failures aren't counted by call number, but by clock. Each second has a bar; the current second is on the right. Spike the failure rate to trip it, then turn the failures off and *stop clicking* — the red bars march left and fall off the edge, and the breaker recovers on its own without any new calls.",

  overview: [
    {
      type: "p",
      text: "Time-Based is Count-Based's twin, with one critical change: the window is sized in **seconds**, not call count. Every call is stamped with its arrival time. The breaker only looks at calls newer than `now - windowSeconds`. Old calls don't have to wait for new ones to push them out — they age out by themselves.",
    },
    {
      type: "p",
      text: "Implementation is almost always bucketed: instead of storing every call's timestamp, the breaker maintains an array of one-second counters (or a similar fine grain) and rotates them. Hystrix did this with ten 1-second buckets; Resilience4j's TIME_BASED window does the same. The bucketing keeps the bookkeeping O(1) per call regardless of traffic volume.",
    },
    {
      type: "p",
      text: "The payoff is **self-recovery during quiet periods**. If your service was failing badly but stops getting traffic for a few seconds, those failed calls quietly drop out of the window and the breaker un-trips itself — no probing needed. The price is slightly more bookkeeping per call.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The trip rule" },
    {
      type: "ol",
      items: [
        "Maintain a window of the last **W seconds** of call results — typically as W one-second buckets, each holding (ok count, fail count).",
        "On every call, increment the bucket for `floor(now / 1s)` and let older buckets age out as time advances.",
        "Compute the **failure rate** across all buckets currently inside the window.",
        "If the rate is at or above the threshold and there are enough samples, **trip**.",
        "OPEN and HALF-OPEN behave exactly like Count-Based: cooldown, then a small number of trial calls decide.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Why bucketed and not exact timestamps?",
      text: "Storing every timestamp is O(traffic) memory. Bucketing trades a tiny precision loss for fixed memory: with W=10 seconds at 1-second granularity, you keep exactly 10 counter pairs no matter whether you handle 1 or 100 000 requests per second. The granularity sets your worst-case error: a 1s bucket can be off by ±1 second around the trip moment, which almost never matters.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Bursty traffic — fixed",
      text: "Imagine a service that handles 100 requests in one second, then nothing for a minute, then another 100. A Count-Based window of 20 calls would still be 'looking at' that first burst a minute later — its view of 'now' is stale. Time-Based with a 10-second window would have aged the burst out completely. That is the bug this variant exists to fix.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to prefer Time-Based" },
    {
      type: "ul",
      items: [
        "**Bursty or sparse traffic** — cron jobs, batch syncs, low-RPS endpoints. Counting calls leaves stale data; counting seconds is honest about how old the evidence is.",
        "**You want quiet-period self-recovery** — if requests stop entirely, the breaker should un-trip itself without you scripting probes.",
        "**Mixed traffic patterns** — your service handles big bursts and quiet patches in the same hour. A time-windowed view is the same shape whether you got 5 or 5 000 calls in the last second.",
        "**Capacity planning matters** — 'last 10 seconds' is a duration you can put on a dashboard alongside latency. 'Last 100 calls' isn't.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Watch the bucket granularity",
      text: "With 1-second buckets, the window is technically anywhere from W-1 to W seconds wide depending on where you are in the current second. That's normally fine. If you need sub-second precision (latency-sensitive edge proxies), drop to 100ms buckets — at the cost of 10× the memory.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Self-recovers in quiet periods** — failed calls age out by wall-clock, no probes required.",
      "**Honest under bursty traffic** — a sudden burst doesn't anchor the window forever.",
      "**Operationally legible** — 'we trip if 50% of the last 10 seconds were failures' is a dashboard sentence.",
      "**Still O(1) per call** — bucketing keeps memory and CPU fixed regardless of throughput.",
    ],
    cons: [
      "**Slightly more bookkeeping** than Count-Based — you have to manage buckets and time advancement.",
      "**Bucket granularity is a tuning knob** — too coarse and you lose precision; too fine and you spend more memory.",
      "**Clock skew can lie to you** — if the OS clock jumps (NTP correction, VM pause), buckets can be wrong for a moment. Most libraries use a monotonic clock to dodge this.",
      "**Still vulnerable at very low volumes** — pair with a minimum-call gate (the Error-Percentage variant) if traffic is tiny.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the bars age out",
      body: "Click **failing call** five times in quick succession — all five go into the rightmost (current-second) bar. Now don't click anything for ten seconds. Watch the red bars march left as new (empty) seconds slide in, and finally fall off the left edge. The failure rate drifts back to 0 without you touching the controls.",
    },
    {
      title: "02 · Spike, trip, and self-recover",
      body: "Tick **Auto traffic** and drag **Downstream failures** to 80%. The breaker trips. Now drag failures to 0 and untick auto traffic. Don't click anything. Within a few seconds the red bars age out, the rate falls below the threshold — but the breaker doesn't auto-close in OPEN. It waits for its cooldown, opens to HALF-OPEN, and the next clicks decide.",
    },
    {
      title: "03 · Compare to Count-Based",
      body: "Open the Count-Based prototype in another tab. In both, click **failing call** five times and stop. In Count-Based, those 5 fails will still be in the window for the next 5 calls you make — possibly minutes later. In Time-Based, they're gone in 10 seconds whether or not you make more calls. That is the entire difference between the two algorithms.",
    },
    {
      title: "04 · Widen the window",
      body: "Set **Window length** to 16s. The breaker now needs sustained failure across 16 seconds to trip — a 1-second blip won't do it. Drop the window to 4s and the breaker becomes twitchy: a single bad second can dominate. The window length is your noise filter.",
    },
  ],

  code: {
    language: "typescript",
    filename: "time-based.ts",
    code: `// Time-based circuit breaker: trip on the failure rate over the last W seconds.
// Implemented with one bucket per second — bucketing keeps everything O(1).
class TimeBasedBreaker {
  private state: "CLOSED" | "OPEN" | "HALF" = "CLOSED";
  private buckets: Array<{ ok: number; fail: number; sec: number }> = [];
  private trials: boolean[] = [];
  private openUntil = 0;

  constructor(
    private windowSec = 10,
    private threshold = 0.5,
    private cooldownMs = 5000,
    private trialCount = 3,
    private minCalls = 5,
  ) {}

  async call<T>(work: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN" && Date.now() >= this.openUntil) {
      this.state = "HALF"; this.trials = [];
    }
    if (this.state === "OPEN") throw new Error("circuit open");

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
    const sec = Math.floor(Date.now() / 1000);
    let b = this.buckets[this.buckets.length - 1];
    if (!b || b.sec !== sec) {
      b = { ok: 0, fail: 0, sec };
      this.buckets.push(b);
    }
    if (ok) b.ok++; else b.fail++;
    this.prune(sec);
    this.maybeTrip();
  }

  private prune(now: number) {
    const lo = now - this.windowSec + 1;
    while (this.buckets.length && this.buckets[0].sec < lo) this.buckets.shift();
  }

  private maybeTrip() {
    let ok = 0, fail = 0;
    for (const b of this.buckets) { ok += b.ok; fail += b.fail; }
    const total = ok + fail;
    if (total >= this.minCalls && fail / total >= this.threshold) this.trip();
  }

  private trip()  { this.state = "OPEN"; this.openUntil = Date.now() + this.cooldownMs; this.trials = []; }
  private close() { this.state = "CLOSED"; this.buckets = []; this.trials = []; }
}`,
  },

  furtherReading: [
    {
      label: "Resilience4j — TIME_BASED sliding window",
      href: "https://resilience4j.readme.io/docs/circuitbreaker#sliding-window",
      note: "The reference implementation. The TIME_BASED type is exactly this — bucketed per-second with the same trip rule and half-open phase.",
      kind: "docs",
    },
    {
      label: "Hystrix — Metrics and Health Counts",
      href: "https://github.com/Netflix/Hystrix/wiki/Metrics-and-Monitoring",
      note: "Netflix's original. Walks through the 10-bucket × 1-second rolling-window structure that almost every modern library inherited.",
      kind: "docs",
    },
    {
      label: "Adrian Cockcroft — Lessons from Netflix",
      href: "https://www.youtube.com/watch?v=lY7hX_jPNAQ",
      note: "Why Netflix needed time-based windows for their bursty cross-region traffic. The same talk that popularised the circuit-breaker-as-default-pattern idea.",
      kind: "video",
    },
    {
      label: "Envoy — outlier detection",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/outlier",
      note: "Envoy's per-host ejection uses a time-windowed view of consecutive 5xx and gateway failures — the same time-based-windowing idea at the proxy layer.",
      kind: "docs",
    },
    {
      label: "Sam Newman — Building Microservices, Ch. 12",
      href: "https://samnewman.io/books/building_microservices_2nd_edition/",
      note: "The chapter on resilience covers why time-windowing matters in service meshes and how it composes with retries and timeouts.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "cb-time-q1",
      question: "What's the key difference between Time-Based and Count-Based?",
      options: [
        { id: "a", label: "Time-Based uses a different state machine." },
        { id: "b", label: "Time-Based ages calls out by wall-clock; Count-Based ages them out by arrival order." },
        { id: "c", label: "Time-Based requires latency measurement; Count-Based doesn't." },
        { id: "d", label: "Time-Based always uses more memory." },
      ],
      correctOptionId: "b",
      explanation:
        "Same three-state machine, same trip rule (failure rate vs threshold), same Half-Open trial logic. The only difference is what makes a call leave the window — seconds elapsed vs new calls arrived.",
    },
    {
      id: "cb-time-q2",
      question: "Why are most implementations bucketed instead of storing per-call timestamps?",
      options: [
        { id: "a", label: "Buckets are easier to draw on a chart." },
        { id: "b", label: "Buckets give O(1) memory regardless of traffic — exact timestamps grow with throughput." },
        { id: "c", label: "Buckets are more accurate than timestamps." },
        { id: "d", label: "Buckets are required by the HTTP spec." },
      ],
      correctOptionId: "b",
      explanation:
        "A per-call timestamp list grows with traffic — bad for a high-RPS service. A fixed array of W buckets stays the same size whether you handle 1 or 100 000 calls per second, in exchange for slightly fuzzier window edges.",
    },
    {
      id: "cb-time-q3",
      question: "Which workload makes Time-Based clearly better than Count-Based?",
      options: [
        { id: "a", label: "Steady traffic at 100 requests/second." },
        { id: "b", label: "Periodic batches: a burst of 200 requests every five minutes." },
        { id: "c", label: "Latency-bound traffic where every call takes ~1 second." },
        { id: "d", label: "Single-threaded clients with strict ordering." },
      ],
      correctOptionId: "b",
      explanation:
        "Periodic bursts starve a count-based window of fresh data between bursts. The breaker keeps 'remembering' the previous burst until enough new calls arrive to push them out. Time-based naturally forgets old bursts when their seconds expire.",
    },
  ],
};
