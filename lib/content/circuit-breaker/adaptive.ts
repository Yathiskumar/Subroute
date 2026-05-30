import type { ConceptContent } from "@/lib/content/types";

export const adaptive: ConceptContent = {
  prototypeCaption:
    "Two upgrades over the fixed-cooldown breakers. **Cooldowns grow with every re-trip** — 3s → 6s → 12s → 24s — so a flaky downstream isn't slammed back to life. And recovery isn't all-or-nothing: traffic is admitted in stages (**10% → 25% → 50% → 100%**), each stage gated by a few healthy probe calls. One failure during recovery throws you back to OPEN with the next bigger cooldown.",

  overview: [
    {
      type: "p",
      text: "Every breaker so far has the same two failure modes during recovery. **Fail mode A: the downstream isn't ready yet** — the cooldown was too short, the trial calls fail, the breaker re-opens, and you wasted the cooldown for nothing. **Fail mode B: the downstream is barely ready** — the cooldown was long enough but the trial calls were the lull before another storm; you re-open seconds later. Repeat ad nauseam.",
    },
    {
      type: "p",
      text: "The Adaptive variant fixes both with two mechanisms. **Exponential backoff** on the cooldown — every re-trip doubles the wait (up to a cap), so a serially-failing dependency gets longer and longer breathing room. And **gradual ramp-up** during recovery — instead of jumping from 0% to 100% traffic, admit 10% first, then 25%, then 50%, then 100%, and gate each step on a small batch of healthy probes.",
    },
    {
      type: "p",
      text: "It's the breaker AWS, Google, and the big libraries reach for when a fixed cooldown isn't cutting it. More moving parts, more knobs, but the only variant that doesn't keep slamming a recovering downstream the moment it shows a pulse.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Mechanism 1 — Exponential backoff" },
    {
      type: "ol",
      items: [
        "Start with a **base cooldown** (e.g. 3 seconds) and a re-trip **streak counter** at 0.",
        "On every trip, set the cooldown to `min(base × 2^streak, max)`. First trip: 3s. Second: 6s. Third: 12s. Capped (e.g. 24s) so it doesn't run away.",
        "Reset the streak to 0 only on a **full** recovery — i.e. when traffic has reached 100% admission and stayed healthy. A partial recovery that re-trips counts as another re-trip.",
        "In production, **add jitter** (Adaptive's untested cousin): cooldown = min(base × 2^streak, max) × random(0.5..1.0). Stops every caller from probing the downstream in lockstep after a wide outage.",
      ],
    },
    { type: "h", text: "Mechanism 2 — Traffic ramp recovery" },
    {
      type: "ol",
      items: [
        "After the cooldown, instead of HALF-OPEN with N trials, enter a **RECOVERING** state with an admission level — start at 10%.",
        "Each incoming call: roll a die; admit it with probability = current admission level. Hold the rest back (count as 'rejected' but no penalty to the downstream).",
        "Track the admitted calls. After **K consecutive healthy** admitted calls (e.g. 2), promote to the next level: 10% → 25% → 50% → 100%.",
        "At 100% with K healthy in a row, **CLOSE**. Streak counter resets to 0.",
        "**Any** failure during RECOVERING — at any level — re-OPENs the breaker, with the next-bigger cooldown.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why this combination matters",
      text: "Without backoff, a flaky downstream that briefly recovers will cause you to re-trip every few seconds — same cooldown, same instant slam, same failure. Without ramp recovery, you risk sending full production traffic to a service that just woke up and is still warming caches. The two mechanisms cover the two failure modes; either alone leaves you exposed.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Inspirations",
      text: "Exponential backoff with jitter comes straight from the AWS Builders' Library. The gradual ramp is the same idea as AWS Application Load Balancer's `slow_start` mode, Envoy's `panic_threshold` thresholds, and Linkerd's adaptive concurrency — all of which slowly increase admitted load to a recovering target.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to upgrade to Adaptive" },
    {
      type: "ul",
      items: [
        "**Flaky dependencies that recover, then re-fail** — fixed-cooldown breakers waste your time with this pattern. Adaptive cooldowns space probes further and further apart.",
        "**Downstreams with cold starts** — services that need warm caches, JIT compilation, or connection pools to be at full speed. The 10/25/50/100% ramp gives them time to fully wake up.",
        "**Multi-tenant or shared infrastructure** — if your breaker tripping floods another service when it un-trips, the ramp limits the inrush spike.",
        "**Production at scale** — when fixed-cooldown breakers have caused you an incident before, this is what to roll out next.",
        "**Avoid if** your service is simple enough that exp-backoff is overkill — three knobs to tune vs. one. Start with Error-Percentage; upgrade if you see the failure modes above.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "More knobs means more ways to misconfigure",
      text: "Base cooldown, max cooldown, ramp levels, probes-per-step — that's four numbers, all interdependent. Pick wrong (e.g. base = max) and you reduce to a fixed-cooldown breaker. Test the behaviour with the prototype and a chaos scenario before shipping.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Doesn't slam recovering downstreams** — the ramp gives them time to warm up.",
      "**Handles flapping** — exp-backoff means re-failures get longer cooldowns, eventually waiting out the outage.",
      "**Self-tuning, in a sense** — you set the bounds; the cooldown picks its own length within them based on observed re-trips.",
      "**Mirrors what big systems do** — ALB slow-start, Envoy panic mode, Linkerd adaptive concurrency. Knowing this variant is knowing the production pattern.",
    ],
    cons: [
      "**More state and more knobs** — base, max, ramp levels, probes per level. Tuning is non-trivial.",
      "**Rejects some traffic during recovery** — at 10% admission, 90% of calls are held back. Pair with a fallback or queue if those callers need a response.",
      "**Cooldowns can get long** — a service that flaps 4 times can be locked out for 24+ seconds even though it's now healthy. Set a max you can live with.",
      "**Harder to reason about** — operators looking at a dashboard need to understand 'recovering at 25%' vs the simpler 'open' or 'closed'.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the cooldown double",
      body: "Click **failing call** until the breaker trips (default 50% over the last 12). It opens with a 3s cooldown. Wait until it recovers to half-open / recovering. Click **failing call** again to force a re-trip — now the cooldown is 6s. Do it again: 12s. The 'streak' counter in the cooldown card shows what you're paying for the flapping.",
    },
    {
      title: "02 · Walk the recovery ramp",
      body: "Trip the breaker once, let the cooldown elapse. The badge shows **recovering** at 10%. Click **healthy call** twice — the breaker promotes to 25%. Two more healthy → 50%. Two more → 100%. Two more → fully **closed**, streak resets to 0. The ramp is your insurance policy against flooding a freshly recovered service.",
    },
    {
      title: "03 · One slip and back to open",
      body: "Trip → recover to 25% with a couple of healthy calls. Now click **failing call** once. The breaker slams back to OPEN with the next-bigger cooldown — it doesn't average, it doesn't forgive. The single-failure rule applies at every ramp level, not just at 10%.",
    },
    {
      title: "04 · Auto traffic with a flaky downstream",
      body: "Tick **Auto traffic** and set **Downstream errors** to 60% (high but not 100). Watch the breaker repeatedly trip, recover partially, and re-trip — each cycle waiting longer. Eventually the cooldown sits at the max and probes get sparse. Drop errors to 0 and watch the ramp finally complete; the streak resets to 0, cooldown drops back to base.",
    },
  ],

  code: {
    language: "typescript",
    filename: "adaptive.ts",
    code: `// Adaptive breaker: exp-backoff cooldown + ramped recovery.
type State = "CLOSED" | "OPEN" | "RECOVERING";

class AdaptiveBreaker {
  private state: State = "CLOSED";
  private calls: boolean[] = [];
  private streak = 0;                 // re-trip count, drives backoff
  private cooldownMs;
  private openUntil = 0;
  private rampIdx = 0;
  private rampOk = 0;

  // 10 → 25 → 50 → 100% admission during recovery
  private static ADMIT = [10, 25, 50, 100];

  constructor(
    private size = 12,
    private threshold = 0.5,
    private baseMs = 3_000,
    private maxMs = 24_000,
    private probesPerStep = 2,
  ) { this.cooldownMs = baseMs; }

  async call<T>(work: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN" && Date.now() >= this.openUntil) this.toRecovering();
    if (this.state === "OPEN") throw new Error("circuit open");

    if (this.state === "RECOVERING") {
      // Admit a probabilistic slice; the rest are short-circuited.
      const admit = AdaptiveBreaker.ADMIT[this.rampIdx];
      if (Math.random() * 100 >= admit) throw new Error("recovering · held back");
    }

    try {
      const result = await work();
      this.onResult(true);
      return result;
    } catch (err) {
      this.onResult(false);
      throw err;
    }
  }

  private onResult(ok: boolean) {
    if (this.state === "RECOVERING") {
      if (!ok) { this.trip(); return; }
      this.rampOk++;
      if (this.rampOk >= this.probesPerStep) {
        if (this.rampIdx < AdaptiveBreaker.ADMIT.length - 1) {
          this.rampIdx++; this.rampOk = 0;
        } else { this.close(); }
      }
      return;
    }
    this.calls.push(ok);
    if (this.calls.length > this.size) this.calls.shift();
    const fails = this.calls.filter(c => !c).length;
    if (this.calls.length >= Math.min(5, this.size) && fails / this.calls.length >= this.threshold) {
      this.trip();
    }
  }

  private trip() {
    this.streak++;
    this.cooldownMs = Math.min(this.baseMs * 2 ** (this.streak - 1), this.maxMs);
    this.state = "OPEN";
    this.openUntil = Date.now() + this.cooldownMs;
    this.rampIdx = 0; this.rampOk = 0;
  }
  private toRecovering() { this.state = "RECOVERING"; this.rampIdx = 0; this.rampOk = 0; }
  private close() {
    this.state = "CLOSED"; this.calls = []; this.streak = 0;
    this.cooldownMs = this.baseMs; this.rampIdx = 0; this.rampOk = 0;
  }
}`,
  },

  furtherReading: [
    {
      label: "AWS Builders' Library — Timeouts, retries, and backoff with jitter",
      href: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
      note: "Marc Brooker's piece on why exponential backoff plus jitter is the only honest answer to flapping services. The exp-backoff part of this variant comes from here.",
      kind: "article",
    },
    {
      label: "AWS Application Load Balancer — slow_start_duration",
      href: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-attributes.html#slow-start-duration",
      note: "The 'gradually ramp traffic' idea, productionised at the load-balancer layer. Same concept as this breaker's recovery ramp, applied to new targets after deploy or recovery.",
      kind: "docs",
    },
    {
      label: "Envoy — panic threshold & outlier ejection",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/panic_threshold",
      note: "Envoy's adaptive behaviour during partial outages. The 'panic threshold' is a different mechanism but solves the same 'don't trust a single recovering host' problem.",
      kind: "docs",
    },
    {
      label: "Linkerd — adaptive concurrency control",
      href: "https://linkerd.io/2.14/features/load-balancing/",
      note: "Service-mesh take on the same idea: instead of binary open/closed, dynamically adjust how much load each upstream gets based on its recent latency.",
      kind: "docs",
    },
    {
      label: "Resilience4j — slowCallRateThreshold + allowedNumberOfCallsInHalfOpenState",
      href: "https://resilience4j.readme.io/docs/circuitbreaker#configuration",
      note: "Resilience4j doesn't ship full ramp recovery but its half-open knobs give you most of the way there. Worth reading to see how libraries approximate adaptive behaviour.",
      kind: "docs",
    },
    {
      label: "Polly — Advanced circuit-breaker + retry policies",
      href: "https://www.pollydocs.org/strategies/circuit-breaker",
      note: ".NET resilience library. The 'combining strategies' guide shows how to stack a breaker with retry-with-exp-backoff to get effectively adaptive behaviour.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "cb-adapt-q1",
      question: "Why does the cooldown grow on every re-trip?",
      options: [
        { id: "a", label: "To compensate for clock drift." },
        { id: "b", label: "Because a downstream that just re-failed probably needs more time, not the same time, to recover." },
        { id: "c", label: "To save memory on the breaker side." },
        { id: "d", label: "Because the HTTP spec requires it." },
      ],
      correctOptionId: "b",
      explanation:
        "A fixed cooldown means you keep probing at the same interval — and keep failing. Exponential backoff spaces probes further apart on each failure so a struggling service gets the time it actually needs.",
    },
    {
      id: "cb-adapt-q2",
      question: "During recovery, the breaker is at the 50% admission level when a single call fails. What happens?",
      options: [
        { id: "a", label: "It demotes to 25%." },
        { id: "b", label: "It stays at 50% and adds the failure to a running average." },
        { id: "c", label: "It re-opens with the next-bigger cooldown." },
        { id: "d", label: "Nothing — failures during recovery are ignored to avoid flapping." },
      ],
      correctOptionId: "c",
      explanation:
        "Recovery is intentionally fragile — one failure at any ramp level re-opens the breaker. The ramp is for *promotion*; demotion isn't a thing. If you survive any failure, you've effectively committed to the next cooldown.",
    },
    {
      id: "cb-adapt-q3",
      question: "Why is the ramp (10 → 25 → 50 → 100%) better than a single threshold of trial calls?",
      options: [
        { id: "a", label: "It uses less memory than counting trials." },
        { id: "b", label: "It avoids slamming a freshly recovered downstream with 100% traffic at once." },
        { id: "c", label: "It makes the breaker easier to test." },
        { id: "d", label: "It allows the breaker to use a smaller cooldown." },
      ],
      correctOptionId: "b",
      explanation:
        "A service that just woke up may have cold caches, empty connection pools, or be in the middle of warming a JIT. Going from 0 to 100% in one step risks immediate re-trip. The ramp gives the downstream time to fully come back before facing full load.",
    },
  ],
};
