import type { ConceptContent } from "@/lib/content/types";

export const stateMachine: ConceptContent = {
  prototypeCaption:
    "The three-state dance you'll see in every variant. Pick a scenario — **first trip**, **recovery succeeds**, **recovery fails** — and step through with **Prev / Next**, or jump into **Free play** to send calls yourself. Watch the badge change colour, the arrows light up, and the narration explain each move. No trip rules to learn yet — just the state machine itself.",

  overview: [
    {
      type: "p",
      text: "Before you compare 'count vs time vs slow-call' rules, you need the **states** they all share. Every circuit breaker — Hystrix, Resilience4j, Polly, Envoy, your own ten-line one — is the same finite state machine with three positions. The variants differ only in what makes them *transition*.",
    },
    {
      type: "p",
      text: "**Closed** is normal. Calls go through, the breaker just watches the results. **Open** is the trip: every call is rejected instantly, without even being attempted. **Half-Open** is the careful peek in between: after a cooldown, a small number of *trial* calls are allowed through. If those trials succeed, the breaker closes again. If they fail, it opens for another cooldown.",
    },
    {
      type: "p",
      text: "Learn this once and the rest of the topic is just five different rules for the question 'when do we leave Closed?'",
    },
  ],

  howItWorks: [
    { type: "h", text: "The three states" },
    {
      type: "ul",
      items: [
        "**Closed** — traffic flows. Every call is attempted. The breaker tallies results in some window (last N calls, last N seconds, etc.) and trips when whatever signal it cares about crosses a threshold.",
        "**Open** — every new call is rejected *immediately*, with an exception or short-circuit error. Nothing reaches the downstream. A timer counts down a cooldown (often a few seconds).",
        "**Half-Open** — the cooldown ended. A fixed number of trial calls (commonly 2–5) are allowed through. Their results decide: enough passes → back to Closed; even one significant failure → back to Open and the cooldown restarts.",
      ],
    },
    { type: "h", text: "The three transitions" },
    {
      type: "ol",
      items: [
        "**Closed → Open** — the trip. The trip *rule* is what changes between variants; the transition is the same: stop accepting calls, start the cooldown.",
        "**Open → Half-Open** — the timer's job. After the cooldown elapses, automatically move to Half-Open so the next call can be a trial.",
        "**Half-Open → Closed / Open** — the decision. A configurable count of trials decides. Pass → Closed and the window resets. Fail → Open, cooldown again.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Why Half-Open at all?",
      text: "Without Half-Open you'd have to choose between two bad options: stay Open forever (you'd never recover) or jump straight back to Closed and immediately retrip if the downstream is still sick. Half-Open is the cheap probe — a few calls' worth of risk to find out whether the downstream is healthy, instead of unleashing your full traffic on a service that just came back from the dead.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Half-Open is fragile by design",
      text: "While Half-Open, the breaker is more sensitive than usual — a single bad trial typically re-trips it. That's on purpose. You don't want to declare 'fully recovered' on one lucky call, and you don't want to keep probing if the early evidence says no.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When this is enough on its own" },
    {
      type: "ul",
      items: [
        "**Always** — every circuit breaker uses these states. The question is only which trip rule sits on top.",
        "**For learning** — implement the states first with a hard-coded rule (e.g. 'fail 3 times in a row'); plug in a real signal once the dance is comfortable.",
        "**For very small services** — a basic Closed/Open/Half-Open with a fixed-count trip rule is often all you need before reaching for a library.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "What the libraries call them",
      text: "Resilience4j: CLOSED, OPEN, HALF_OPEN (plus DISABLED and FORCED_OPEN for ops overrides). Polly: Closed, Open, HalfOpen, Isolated. Hystrix: same names. Envoy talks about 'cluster outlier detection' but the model is identical. Different vocabulary, one machine.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Universal** — every variant in this topic and every production library uses the same three states.",
      "**Tiny** — the bookkeeping is literally three enum values and a timestamp.",
      "**Composable** — swap in any trip rule (count, time, latency, %) without changing the states or transitions.",
      "**Self-recovering** — the cooldown + Half-Open probe means the breaker tries to come back without human intervention.",
    ],
    cons: [
      "**Not a complete strategy** — the states tell you when to fail fast, not what response to send to the caller. Pair with a fallback (cached value, default, secondary backend).",
      "**Half-Open is a thin moment** — if you set the trial count to 1, a single unlucky failure during recovery sends you back to Open even if the downstream is healthy.",
      "**Fixed cooldown can be too eager or too lazy** — too short and you slam a struggling downstream; too long and you keep failing requests after it has recovered. That's the problem the **Adaptive** variant exists to solve.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk the first trip",
      body: "Open the **First trip** scenario and click **Next** through every step. Watch the calls land in the window, the badge turn red when the rule trips, and the arrow Closed → Open light up. Note that *no* call reaches the downstream once Open — every reject is instant.",
    },
    {
      title: "02 · Recovery succeeds",
      body: "Switch to the **Recovery succeeds** scenario. The breaker is already Open and the cooldown is ticking. Step forward until it elapses and moves to Half-Open. Send the configured number of trial calls — all pass — and watch the transition to Closed. The window starts fresh.",
    },
    {
      title: "03 · Recovery fails",
      body: "Switch to **Recovery fails**. Same setup, but the very first trial in Half-Open fails. Watch the breaker slam back to Open and restart the cooldown. This is by design — Half-Open is a probe, not a commitment.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Click **healthy call** until you're bored, then alternate **failing call** to see exactly how many bad ones it takes to trip with the default rule. While Open, click **skip wait** to jump straight to Half-Open. The same controls work for every other variant in this topic — only the trip rule changes.",
    },
  ],

  code: {
    language: "typescript",
    filename: "circuit-breaker-state.ts",
    code: `// The smallest useful circuit breaker — three states, one rule.
type State = "CLOSED" | "OPEN" | "HALF_OPEN";

class CircuitBreaker {
  private state: State = "CLOSED";
  private failures = 0;          // current window
  private trials: boolean[] = [];
  private openUntil = 0;

  constructor(
    private failThreshold = 5,   // how many fails in CLOSED trip it
    private cooldownMs = 4000,   // how long OPEN waits before probing
    private trialCount = 3,      // how many HALF_OPEN trials to decide
  ) {}

  async call<T>(work: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() >= this.openUntil) this.state = "HALF_OPEN";
      else throw new Error("circuit open — fail fast");
    }

    try {
      const result = await work();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess() {
    if (this.state === "HALF_OPEN") {
      this.trials.push(true);
      if (this.trials.length >= this.trialCount) this.close();
    } else {
      this.failures = 0;          // reset on a healthy run
    }
  }

  private onFailure() {
    if (this.state === "HALF_OPEN") {
      this.trip();                // one bad trial re-opens
      return;
    }
    if (++this.failures >= this.failThreshold) this.trip();
  }

  private trip()  { this.state = "OPEN";    this.openUntil = Date.now() + this.cooldownMs; this.trials = []; }
  private close() { this.state = "CLOSED";  this.failures = 0; this.trials = []; }
}`,
  },

  furtherReading: [
    {
      label: "Michael Nygard — *Release It!* (Ch. 5 'Stability Patterns')",
      href: "https://pragprog.com/titles/mnee2/release-it-second-edition/",
      note: "The book that popularised the circuit breaker pattern for software. Nygard introduces the three states with the canonical 'cascading failure' story.",
      kind: "book",
    },
    {
      label: "Martin Fowler — Circuit Breaker",
      href: "https://martinfowler.com/bliki/CircuitBreaker.html",
      note: "The short article every library README links to. Has the canonical state-diagram drawing and the smallest possible code sketch.",
      kind: "article",
    },
    {
      label: "Resilience4j — CircuitBreaker docs",
      href: "https://resilience4j.readme.io/docs/circuitbreaker",
      note: "The modern Hystrix successor. The 'State transition' section is the cleanest spec of the three-state machine you'll find, with the extra DISABLED and FORCED_OPEN ops states.",
      kind: "docs",
    },
    {
      label: "Microsoft .NET — Circuit Breaker pattern",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker",
      note: "Azure architecture-centre write-up with sequence diagrams for each transition. Good complement to Fowler — slightly more operational, less theoretical.",
      kind: "docs",
    },
    {
      label: "Polly — The Circuit-Breaker docs",
      href: "https://www.pollydocs.org/strategies/circuit-breaker",
      note: ".NET resilience library. Their Closed/Open/HalfOpen/Isolated breakdown is excellent and shows the operational 'Isolated' state most other libraries leave out.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "cb-state-q1",
      question: "What does the breaker do with a call that arrives while it is OPEN?",
      options: [
        { id: "a", label: "Queues it until it transitions to HALF-OPEN." },
        { id: "b", label: "Sends it to the downstream and records the result." },
        { id: "c", label: "Rejects it immediately without attempting it." },
        { id: "d", label: "Forwards it to a fallback service." },
      ],
      correctOptionId: "c",
      explanation:
        "The whole point of OPEN is to fail fast. Calls are rejected synchronously without contacting the downstream — no queueing, no retry, no automatic fallback (that's a separate concern the caller adds on top).",
    },
    {
      id: "cb-state-q2",
      question: "Why does the breaker spend time in HALF-OPEN instead of going straight from OPEN back to CLOSED?",
      options: [
        { id: "a", label: "To give the downstream a few more seconds of rest." },
        { id: "b", label: "To probe with a small number of trial calls before risking full traffic." },
        { id: "c", label: "Because most libraries forget to implement direct transitions." },
        { id: "d", label: "To average out latency measurements." },
      ],
      correctOptionId: "b",
      explanation:
        "HALF-OPEN is the cheap probe. A few trial calls tell you whether the downstream has actually recovered before you let full production traffic hit it again. Going straight to CLOSED would likely re-trip on the next burst.",
    },
    {
      id: "cb-state-q3",
      question: "While in HALF-OPEN, a single trial call fails. What happens next?",
      options: [
        { id: "a", label: "The breaker stays HALF-OPEN and waits for more trials." },
        { id: "b", label: "The breaker transitions back to OPEN and restarts the cooldown." },
        { id: "c", label: "The breaker closes — one failure isn't enough to re-trip." },
        { id: "d", label: "The breaker enters a special FORCED_OPEN state." },
      ],
      correctOptionId: "b",
      explanation:
        "HALF-OPEN is intentionally sensitive: a single significant failure re-opens the breaker and the cooldown timer starts again. The pattern assumes the early evidence is your best signal of whether to trust the downstream yet.",
    },
  ],
};
