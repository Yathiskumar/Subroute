import type { ConceptContent } from "@/lib/content/types";

export const weightedLeastConnections: ConceptContent = {
  prototypeCaption:
    "Least connections that finally accounts for capacity. Each server has a weight, and the balancer routes by the lowest **load ratio** = active ÷ weight, not raw active count. The ratios row shows the live comparison. Adjust weights and watch a weight-3 server comfortably carry three times the connections of a weight-1 server.",

  overview: [
    {
      type: "p",
      text: "Least connections has one blind spot: it treats every server as equal. Route to 'fewest connections' and a tiny 2-core box looks just as available as an 8-core monster when both show 4 active connections — but 4 connections means very different things to those two machines. Weighted least connections closes that gap by dividing each server's active count by its capacity weight and routing to the lowest **ratio**.",
    },
    {
      type: "p",
      text: "It is the most adaptive algorithm in this set because it combines both signals: **capacity** (the static weight, like weighted round robin) and **live load** (the active count, like least connections). A big server can hold proportionally more connections before it's considered 'as loaded' as a small one — so the fleet reaches saturation together.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Minimize active ÷ weight" },
    {
      type: "p",
      text: "Instead of comparing raw connection counts, compare load ratios:",
    },
    {
      type: "code",
      language: "text",
      code: "loadRatio(i) = active[i] / weight[i]\ntarget = argmin_i  loadRatio(i)",
    },
    {
      type: "p",
      text: "A weight-3 server at 3 active connections has ratio 1.0; a weight-1 server at 1 active connection also has ratio 1.0 — they're equally loaded *relative to capacity*, even though one holds three times the connections. New work goes to whoever has the lowest ratio, so the big servers fill up proportionally faster in absolute terms while every server's *relative* load stays even.",
    },
    {
      type: "p",
      text: "When all weights are equal, the division is by a constant and the algorithm collapses back to plain least connections. Weighted least connections is the strict generalization — least connections is just the all-weights-equal case.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Two signals, one number",
      text: "Think of weight as the *size of the bucket* and active connections as *how full it is*. The ratio is the fill level. Routing to the emptiest bucket — not the one with the fewest litres — is what lets a mixed fleet drain evenly.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Mixed fleet *and* variable request cost** — the combination that defeats every simpler algorithm. Big and small servers, short and long requests, all at once.",
        "**Gradual migrations** — running new, larger instances alongside old ones; weights keep both at proportional load while connection-awareness handles request variance.",
        "**Autoscaling groups with instance diversity** — spot/on-demand mixes or multi-generation pools where capacities genuinely differ.",
        "**Anywhere you'd want least connections but your servers aren't identical** — which, in practice, is most real fleets.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "HAProxy's `leastconn` honors per-server `weight`, and NGINX combines `least_conn` with `weight=` directives — both implement exactly this ratio-based routing. It's the standard choice for L4 balancing across heterogeneous backends.",
    },
  ],

  tradeoffs: {
    pros: [
      "The most adaptive of the set — accounts for both capacity and live load simultaneously.",
      "Generalizes least connections cleanly: equal weights reduce to plain least-conn.",
      "Keeps a mixed fleet at even *relative* utilization, so all servers saturate together.",
      "Handles uneven request durations and uneven server sizes in one rule.",
    ],
    cons: [
      "Inherits every distributed-state hazard of least connections — independent balancers see only their own connections.",
      "Two things to get right now: accurate weights *and* accurate live counts.",
      "Connection count is still an imperfect load proxy; many cheap connections can mislead the ratio.",
      "Weights are static and need re-tuning when the fleet's composition changes.",
    ],
  },

  handsOn: [
    {
      title: "01 · Read the load ratios",
      body: "Watch the 'Load ratios (active ÷ weight)' row while you hit 'Auto'. The balancer always targets the server showing the lowest ratio — not the lowest raw active count. With default weights 3, 1, 2, 1, the weight-3 server will sit at several active connections while a weight-1 server sits at one, yet their ratios stay close.",
    },
    {
      title: "02 · Prove the proportional fill",
      body: "Click 'Send 10' and let it settle. Compare the 'Active' counts to the weights: the weight-3 server should hover around three times the active connections of a weight-1 server. That's capacity-proportional balancing — the big box carries proportionally more, and the 'Load spread' stat stays tight.",
    },
    {
      title: "03 · Collapse it to least connections",
      body: "Set every weight to the same value (say all 2) with the steppers. The load ratio becomes active÷constant for everyone, so the algorithm now behaves identically to plain Least Connections — routing purely by raw active count. Weighted least connections is just least connections with a capacity divisor.",
    },
  ],

  code: {
    language: "typescript",
    filename: "weighted-least-connections.ts",
    code: `// Weighted least connections: minimize active / weight.
type Backend = { id: string; weight: number; active: number };

class WeightedLeastConnBalancer {
  private backends: Backend[];
  constructor(pool: { id: string; weight: number }[]) {
    this.backends = pool.map((b) => ({ ...b, active: 0 }));
  }

  acquire(): Backend {
    let best = this.backends[0];
    let bestRatio = best.active / best.weight;
    for (const b of this.backends) {
      const ratio = b.active / b.weight;   // load relative to capacity
      if (ratio < bestRatio) { best = b; bestRatio = ratio; }
    }
    best.active++;                          // reserve eagerly, at decision time
    return best;
  }

  release(b: Backend): void {
    b.active--;
  }
}

// With equal weights this reduces exactly to plain least connections.
const lb = new WeightedLeastConnBalancer([
  { id: "s1", weight: 3 },
  { id: "s2", weight: 1 },
  { id: "s3", weight: 2 },
  { id: "s4", weight: 1 },
]);`,
  },

  furtherReading: [
    {
      label: "Envoy — Load balancers (weighted least request)",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers",
      note: "Envoy's 'least request' LB and exactly how it folds weights into active-request accounting — the closest production analog to this prototype.",
      kind: "docs",
    },
    {
      label: "HAProxy — Load balancing algorithms (leastconn + weight)",
      href: "https://www.haproxy.com/documentation/haproxy-configuration-tutorials/load-balancing/",
      note: "How HAProxy folds per-server `weight` into its least-connections decision for mixed-capacity backends.",
      kind: "docs",
    },
    {
      label: "NGINX — least_conn with weighted servers",
      href: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/",
      note: "Combining the `least_conn` method with `weight=` so big and small servers fill proportionally.",
      kind: "docs",
    },
    {
      label: "Cloudflare — Types of load balancing algorithms",
      href: "https://www.cloudflare.com/learning/performance/types-of-load-balancing-algorithms/",
      note: "Defines weighted least connection plainly: weights assume some servers handle more connections than others.",
      kind: "article",
    },
    {
      label: "Google SRE Book — Ch. 20: Load Balancing in the Datacenter",
      href: "https://sre.google/sre-book/load-balancing-datacenter/",
      note: "Production view of combining capacity weights with live utilization to keep a heterogeneous fleet evenly loaded.",
      kind: "book",
    },
    {
      label: "Wikipedia — Load balancing (computing)",
      href: "https://en.wikipedia.org/wiki/Load_balancing_(computing)",
      note: "Where weighted least connections sits among the dynamic, state-aware strategies.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "wlc-q1",
      question:
        "Server A has weight 3 and 3 active connections. Server B has weight 1 and 1 active connection. Which does weighted least connections consider less loaded?",
      options: [
        { id: "a", label: "Server B — it has fewer raw connections" },
        { id: "b", label: "Server A — it has a bigger weight" },
        { id: "c", label: "Neither — their load ratios are equal (both 1.0)" },
        { id: "d", label: "Whichever was picked least recently" },
      ],
      correctOptionId: "c",
      explanation:
        "Load ratio is active ÷ weight: A is 3/3 = 1.0, B is 1/1 = 1.0. They're equally loaded relative to capacity. The next request would break the tie (e.g. by lowest index), but neither is 'less loaded' than the other.",
    },
    {
      id: "wlc-q2",
      question: "What two signals does weighted least connections combine?",
      options: [
        { id: "a", label: "Request size and response code" },
        { id: "b", label: "Static capacity (weight) and live load (active connections)" },
        { id: "c", label: "A random draw and a round-robin counter" },
        { id: "d", label: "CPU temperature and memory usage" },
      ],
      correctOptionId: "b",
      explanation:
        "It divides the live active-connection count by the static capacity weight. That fuses weighted round robin's capacity-awareness with least connections' live-load-awareness — the most adaptive combination in this set.",
    },
    {
      id: "wlc-q3",
      question: "What does weighted least connections reduce to when all server weights are equal?",
      options: [
        { id: "a", label: "Round robin" },
        { id: "b", label: "Random" },
        { id: "c", label: "Plain least connections" },
        { id: "d", label: "Weighted round robin" },
      ],
      correctOptionId: "c",
      explanation:
        "With equal weights, active ÷ weight is just active ÷ constant, so ordering by ratio is identical to ordering by raw active count. Weighted least connections is the strict generalization; least connections is its all-weights-equal special case.",
    },
  ],
};
