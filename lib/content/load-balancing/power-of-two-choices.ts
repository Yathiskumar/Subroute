import type { ConceptContent } from "@/lib/content/types";

export const powerOfTwoChoices: ConceptContent = {
  prototypeCaption:
    "For each request the balancer picks two servers at random (they flash amber), compares their active connections, and routes to the lighter one (it flashes as the winner). The 'Latest decision' strip shows the comparison. Watch 'Peak active' stay low — far lower than pure random would give, with almost no global state.",

  overview: [
    {
      type: "p",
      text: "Power of two choices (often 'P2C' or 'two random choices') is one of the most beautiful results in load balancing: pick two servers at random, send the request to whichever has fewer active connections. That single extra probe transforms the behavior. Pure random leaves the busiest server with ~log n / log log n connections; checking two and taking the lesser drops the maximum to ~log log n — an exponential improvement, for the cost of one comparison.",
    },
    {
      type: "p",
      text: "What makes it special is that it captures most of least-connections' quality while staying almost stateless. You don't track or scan all N servers — you sample two. That makes it ideal for distributed and client-side load balancing, where maintaining an accurate global view of every backend is expensive or impossible. It's the algorithm behind Finagle, Linkerd, and NGINX's `random two`.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Two probes, take the better" },
    {
      type: "ol",
      items: [
        "Pick two distinct servers uniformly at random.",
        "Compare a load signal on just those two — here, active connection count.",
        "Route to the less-loaded of the pair (ties go either way).",
      ],
    },
    {
      type: "p",
      text: "That's it. No full scan, no global minimum, no shared counter across the fleet. The prototype animates each step: the two random candidates light up amber, their active counts are compared in the decision strip, and the winner is chosen before the request is even dispatched.",
    },
    { type: "h", text: "Why two is the magic number" },
    {
      type: "p",
      text: "With one random choice, nothing stops a server from getting unlucky and piling up. With two, a busy server is only chosen if *both* of the two random picks happen to be busy — quadratically less likely. The jump from one choice to two is enormous; the jump from two to three is marginal. So two is the sweet spot: nearly all the benefit, minimal probing cost. This is the classic 'balls into bins' result of Mitzenmacher, Azar, and others.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "It generalizes",
      text: "The load signal doesn't have to be connection count. Probe two servers and compare their EWMA latency (that's Finagle's `p2cPeakEwma`), or their reported queue depth. P2C is a meta-strategy: 'sample a few, pick the best' layered on top of whatever metric you trust.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Distributed or client-side balancing** — many independent balancers that can't maintain a perfect global view. Two probes beat one with no coordination.",
        "**Large server pools** — when scanning all N for the true minimum is too costly, sampling two is O(1) and nearly as good.",
        "**Avoiding the herd** — naive distributed least-connections can stampede the one server that *looks* idle to everyone; randomizing the candidates breaks that synchronization.",
        "**As the default 'smart' policy** — pair it with EWMA latency and it's the modern microservice standard.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "NGINX offers `random two least_conn`; Finagle and Linkerd use P2C (over least-loaded or Peak EWMA) as their default balancer. It's the go-to when a global least-connections view is impractical but you still want its quality.",
    },
  ],

  tradeoffs: {
    pros: [
      "Exponential drop in peak load versus pure random — for one extra probe.",
      "Almost stateless: sample two servers, no global scan or shared counter.",
      "Avoids the distributed least-connections stampede by randomizing candidates.",
      "Works over any load metric — connections, latency, EWMA, queue depth.",
    ],
    cons: [
      "Slightly worse than a true global least-connections when you *can* see everything.",
      "Still needs a load signal for the two probed servers (active count, latency, etc.).",
      "On a tiny pool (e.g. 2 servers) the 'choice' degenerates and the benefit shrinks.",
      "Random pairing can still occasionally probe two busy servers — it's better on average, not a guarantee.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch a single decision",
      body: "Click 'Send 1' and read the 'Latest decision' strip: it names the two random candidates (which flash amber on the diagram), their active counts, and which one wins (`S2 wins (1 ≤ 3)`). The winner — the less-loaded of the pair — lights up before the request travels there.",
    },
    {
      title: "02 · Keep the peak low",
      body: "Hit 'Send 10', then 'Auto', and keep an eye on the 'Peak active' and 'Spread (max − min)' stats. Even under load they stay strikingly low — much lower than the Random concept's distribution — because every routing decision steers away from whichever of two probed servers is busier.",
    },
    {
      title: "03 · Compare against pure Random in your head",
      body: "Plain Random (the earlier concept) picks one server blindly, so a backend can quietly pile up. Here, a busy server only gets a request when *both* random probes happen to land on busy servers — quadratically rarer. That's the whole 'power of two': one extra look, exponentially flatter load.",
    },
  ],

  code: {
    language: "typescript",
    filename: "power-of-two-choices.ts",
    code: `// Power of two choices: sample two at random, route to the lighter one.
class P2CBalancer {
  private active: number[];
  constructor(private servers: string[]) {
    this.active = servers.map(() => 0);
  }

  acquire(): number {
    const n = this.servers.length;
    const a = Math.floor(Math.random() * n);
    let b = Math.floor(Math.random() * n);
    while (b === a && n > 1) b = Math.floor(Math.random() * n);

    const winner = this.active[a] <= this.active[b] ? a : b;
    this.active[winner]++;       // reserve eagerly, like least-conn
    return winner;
  }

  release(i: number): void {
    this.active[i]--;
  }
}

// The load signal is pluggable: compare EWMA latency instead of
// active count and you have Finagle's p2cPeakEwma.`,
  },

  furtherReading: [
    {
      label: "Mitzenmacher — The Power of Two Choices in Randomized Load Balancing",
      href: "https://www.eecs.harvard.edu/~michaelm/postscripts/tpds2001.pdf",
      note: "The foundational result: two probes drop max load from ~log n / log log n to ~log log n. The paper that names the technique.",
      kind: "paper",
    },
    {
      label: "Mitzenmacher, Richa & Sitaraman — The Power of Two Random Choices: A Survey",
      href: "https://www.eecs.harvard.edu/~michaelm/postscripts/handbook2001.pdf",
      note: "Broader survey of the balls-into-bins theory and its many applications.",
      kind: "paper",
    },
    {
      label: "Marc Brooker — The power of two random choices",
      href: "https://brooker.co.za/blog/2012/01/17/two-random.html",
      note: "The most intuitive explanation of why two beats one (and why three is barely better), with simulations.",
      kind: "article",
    },
    {
      label: "NGINX — random two least_conn",
      href: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/#load-balancing-methods",
      note: "NGINX's built-in P2C: `random two least_conn` picks two at random and routes to the one with fewer connections.",
      kind: "docs",
    },
    {
      label: "Finagle — Clients: P2C balancers",
      href: "https://twitter.github.io/finagle/guide/Clients.html",
      note: "Production P2C over least-loaded and Peak EWMA — the default in Twitter's RPC stack.",
      kind: "docs",
    },
    {
      label: "Tyler McMullen — Load Balancing is Impossible (talk)",
      href: "https://www.infoq.com/presentations/load-balancing/",
      note: "Walks through why randomized least-conns (P2C) sidesteps the catastrophic edge cases of global least-conns.",
      kind: "video",
    },
  ],

  quiz: [
    {
      id: "p2c-q1",
      question: "How does power of two choices route a request?",
      options: [
        { id: "a", label: "Scans all servers and picks the global minimum" },
        { id: "b", label: "Picks two servers at random and routes to the less-loaded one" },
        { id: "c", label: "Picks one server at random" },
        { id: "d", label: "Cycles through servers in order" },
      ],
      correctOptionId: "b",
      explanation:
        "It samples two random servers and compares a load signal (here, active connections), routing to the lighter of the two. No full scan and no global counter — yet it gets most of least-connections' benefit.",
    },
    {
      id: "p2c-q2",
      question: "Why is going from one random choice to two such a large improvement?",
      options: [
        { id: "a", label: "It doubles the number of servers" },
        { id: "b", label: "A busy server is chosen only if both random probes land on busy servers — quadratically less likely" },
        { id: "c", label: "It removes randomness entirely" },
        { id: "d", label: "It guarantees perfectly even load" },
      ],
      correctOptionId: "b",
      explanation:
        "With one pick, a server can get unlucky and pile up. With two, it's only chosen when both probes happen to be busy — far rarer. This shrinks peak load from ~log n / log log n to ~log log n. Going from two to three adds little more.",
    },
    {
      id: "p2c-q3",
      question: "Why is P2C especially well-suited to distributed or client-side load balancing?",
      options: [
        { id: "a", label: "It requires a shared global counter across all balancers" },
        { id: "b", label: "It needs no global view — sampling two servers avoids both the cost and the stampede of global least-connections" },
        { id: "c", label: "It only works with a single load balancer" },
        { id: "d", label: "It ignores server load completely" },
      ],
      correctOptionId: "b",
      explanation:
        "Maintaining an accurate global least-connections view across many balancers is costly and prone to stampedes (everyone picks the same 'idle' server). P2C just probes two random servers locally — no coordination — yet stays close to least-connections quality.",
    },
  ],
};
