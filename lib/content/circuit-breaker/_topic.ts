import type { TopicContent } from "@/lib/content/types";

export const circuitBreakerTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**A circuit breaker stops you from calling something that is already broken.** Borrow the metaphor from your house: when a wire is shorting, the breaker pops and cuts the power. It hurts now — your lamps go off — but it prevents the fire that would happen if current kept flowing. Software does the same thing. If your service keeps calling a downstream that is timing out or returning errors, you pile up threads, connections, and queued requests waiting on something that will not answer. The breaker watches the call results, and once they look bad, it just *says no* to new calls for a while — fast — so the rest of your system stays healthy.",
    },
    {
      type: "p",
      text: "Every breaker has the same three states. **Closed** means traffic flows normally and the breaker is just watching. **Open** means the breaker has tripped and every call is rejected instantly without even being attempted. **Half-Open** is the careful peek in between: after a cooldown, a small number of trial calls are allowed through to see if the downstream has recovered. If those trials succeed, the breaker closes again; if they fail, it opens for another cooldown. That is the whole pattern. The six variants in this topic differ only in *which signal* trips the breaker and *how cleverly* it recovers.",
    },
    {
      type: "p",
      text: "If you remember nothing else, remember the goal: **fail fast, protect the system, give the downstream a break, and probe gently before letting traffic back in.** The rest is engineering choices about what counts as 'looks bad' — error rate? latency? error rate but only if you have enough samples to trust it? — and how cautiously to come back.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Where this shows up" },
    {
      type: "ul",
      items: [
        "**Microservices** — service A calls service B which calls service C. If C is dying, every blocked call inside A holds a thread, a TCP connection, and a slot in A's queue. Without a breaker, A dies *because* C dies. With one, A trips early and stays up to serve the requests that don't need C.",
        "**API gateways & service meshes** — Envoy, Istio, Linkerd, and AWS App Mesh all ship circuit-breaking at the proxy layer so individual services don't each have to reinvent it.",
        "**Client SDKs** — official SDKs for cloud services (AWS, GCP, Stripe) embed breakers so a noisy outage in one region doesn't snowball through every call your app makes.",
        "**Browser-side requests** — even a single-page app can benefit: if the analytics endpoint is down, trip and stop sending events instead of stacking up retries in a queue that blocks the main thread.",
        "**Anywhere a slow neighbour can poison the pool** — database connection pools, HTTP client pools, thread pools. The breaker frees you from the cascading-failure pattern where one slow dependency takes the entire upstream down.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "It's a feedback loop, not a switch",
      text: "Beginners often picture the breaker as 'check a flag, fail if set.' That is the easy part. The interesting work is *measuring*: what counts as a failure (just exceptions? slow responses? both?), how big a window, how many samples are enough to trust the number, and how to come back without instantly tripping again. Every variant here picks a different answer for those questions.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Variant",
      bursts: "Trip signal",
      precision: "Best at catching",
      memory: "Recovery style",
      bestFor: "Use when",
    },
    rows: [
      {
        algorithm: "State Machine",
        bursts: "(foundation)",
        precision: "The three-state dance itself",
        memory: "Closed → Open → Half-Open",
        bestFor: "Learning the pattern before any trip rule",
      },
      {
        algorithm: "Count-Based",
        bursts: "Fail rate over last N calls",
        precision: "Sustained error bursts",
        memory: "Fixed cooldown, then half-open trials",
        bestFor: "Steady traffic, simple default",
      },
      {
        algorithm: "Time-Based",
        bursts: "Fail rate over last N seconds",
        precision: "Self-recovering during quiet periods",
        memory: "Fixed cooldown, then half-open trials",
        bestFor: "Bursty traffic where call counts are uneven",
      },
      {
        algorithm: "Slow Call Rate",
        bursts: "% of calls slower than D ms",
        precision: "Latency-only failures (200 OK in 5s)",
        memory: "Fixed cooldown, then half-open trials",
        bestFor: "Latency-sensitive paths; downstreams that hang, not error",
      },
      {
        algorithm: "Error Percentage",
        bursts: "Min volume AND error % both met",
        precision: "Real outages — not 1 fail of 2 calls",
        memory: "Fixed cooldown, then a single trial call",
        bestFor: "Low-volume endpoints; production defaults (Hystrix lineage)",
      },
      {
        algorithm: "Adaptive",
        bursts: "Error % (closed) + probe results (recovering)",
        precision: "Repeat outages — gets stricter each retry",
        memory: "Exp-backoff cooldown + 10/25/50/100% ramp",
        bestFor: "Flaky dependencies where naïve recovery slams them back open",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to pick" },
    {
      type: "ul",
      items: [
        "**You're new and just want one** → **Count-Based** with a 50% threshold over the last 10–20 calls. It's the default in many libraries and you can ship it today.",
        "**Your traffic is bursty** (cron jobs, periodic syncs, sparse user activity) → **Time-Based**. Quiet minutes shouldn't keep the breaker open forever just because the last few calls happened to fail.",
        "**The downstream lies about being healthy by going slow** → **Slow Call Rate**. Errors aren't the only failure mode; a latency spike is enough to exhaust your thread pool.",
        "**Low-volume endpoint** where one bad call in three would otherwise trip you → **Error Percentage**. The volume gate is exactly the noise filter you need.",
        "**The downstream comes back, dies, comes back, dies** → **Adaptive**. Each re-trip doubles the cooldown and the ramp keeps you from blasting it the moment it shows a pulse.",
        "**Use the State Machine first** — it's the foundation. Every other variant is a different rule for *when* to trip; the close-open-half-open dance is identical.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Pair it with the rest",
      text: "A breaker is not a complete resilience strategy. It works best with **timeouts** (so a slow call eventually returns failure), **retries with jitter** (so transient blips don't even reach the breaker), and **fallbacks** (so a request can still produce *something* when the breaker is open). The breaker says 'no', but a good system also says 'here's what we can give you instead.'",
    },
  ],
};
