import type { TopicContent } from "@/lib/content/types";

export const loadBalancingTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**Load balancing is the practice of spreading incoming requests across a pool of servers so no single one becomes the bottleneck.** The moment you run more than one instance of a service — for redundancy, for capacity, or both — something has to decide which instance handles each request. That decider is the load balancer, and the rule it follows is a *load-balancing algorithm*.",
    },
    {
      type: "p",
      text: "The contract looks trivial: a request arrives, pick a backend, forward it. The depth is entirely in the *pick*. A good choice keeps every server evenly utilized, tolerates servers of different sizes, and reacts when one slows down. A bad choice piles work onto an already-struggling node while its neighbors sit idle.",
    },
    {
      type: "p",
      text: "The algorithms divide into two families. **Stateless** strategies — round robin, weighted round robin, random — decide using only a counter or a coin flip, never looking at the servers. **State-aware** strategies — least connections, weighted least connections, and the response-time methods — track how busy each backend is and route to whoever is least loaded right now. Stateless is cheap and predictable; state-aware adapts but costs bookkeeping.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Why every scaled-out service needs it" },
    {
      type: "ul",
      items: [
        "**Horizontal scaling** — the only way to serve more traffic than one machine can handle is to add machines and split the work. The splitter is the load balancer.",
        "**High availability** — when a backend dies, the balancer stops sending it traffic and the service stays up. No single instance is a single point of failure.",
        "**Even utilization** — without balancing, hot spots form: one server saturates and starts dropping requests while others idle, wasting the capacity you paid for.",
        "**Heterogeneous fleets** — real fleets mix machine sizes. Weighted algorithms send the big boxes proportionally more work so they all reach capacity together.",
        "**Graceful degradation under load** — state-aware algorithms notice when a backend slows (GC pause, cold cache, noisy neighbor) and steer around it before it falls over.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Where it lives",
      text: "Load balancers sit at every tier: an L4/L7 appliance or cloud LB at the edge (AWS ALB/NLB, Envoy, NGINX, HAProxy), a service mesh sidecar between microservices, and a client-side balancer inside RPC libraries (gRPC, Finagle). The algorithm is the same idea at every layer — only the thing being balanced changes.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Algorithm",
      bursts: "Server state used",
      precision: "Handles uneven load",
      memory: "Per-request cost",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "Round Robin",
        bursts: "None (a counter)",
        precision: "Poorly — assumes equal servers & equal requests",
        memory: "O(1)",
        bestFor: "Uniform fleets, uniform requests",
      },
      {
        algorithm: "Weighted Round Robin",
        bursts: "Static weights",
        precision: "Handles uneven capacity, not uneven load",
        memory: "O(1)",
        bestFor: "Mixed machine sizes, predictable work",
      },
      {
        algorithm: "Random",
        bursts: "None (a coin flip)",
        precision: "Like round robin in the limit; lumpier short-term",
        memory: "O(1), no shared state",
        bestFor: "Many distributed LBs with no coordination",
      },
      {
        algorithm: "Least Connections",
        bursts: "Live active-connection count",
        precision: "Well — follows real-time busyness",
        memory: "O(N) counters",
        bestFor: "Long-lived or variable-duration requests",
      },
      {
        algorithm: "Weighted Least Connections",
        bursts: "Active count ÷ weight",
        precision: "Capacity and live load together",
        memory: "O(N) + weights",
        bestFor: "Mixed fleets with variable request cost",
      },
      {
        algorithm: "Least Response Time",
        bursts: "Active count × avg latency",
        precision: "Well — favors the servers answering fastest",
        memory: "O(N) + latency",
        bestFor: "Latency-sensitive, mixed-speed backends",
      },
      {
        algorithm: "Peak EWMA",
        bursts: "Decaying avg latency × active",
        precision: "Very well — tracks recent slowdowns, recovers slowly",
        memory: "O(N) + α decay",
        bestFor: "Adaptive routing in noisy, real-world fleets",
      },
      {
        algorithm: "IP Hash",
        bursts: "Hash of client identity",
        precision: "Doesn't — pins clients, not load",
        memory: "O(1) hash",
        bestFor: "Sticky sessions without a shared store",
      },
      {
        algorithm: "Power of Two Choices",
        bursts: "Load of 2 random servers",
        precision: "Nearly as well as least-connections",
        memory: "O(1), ~stateless",
        bestFor: "Distributed / client-side balancing at scale",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "Decision guide" },
    {
      type: "ul",
      items: [
        "**Identical servers, short and uniform requests** → **Round Robin**. The simplest thing that works, and it works well here.",
        "**Servers of different sizes, but request cost is predictable** → **Weighted Round Robin**. Give each server a weight proportional to its capacity.",
        "**Many independent load balancers that can't share state** → **Random**. No coordination needed, and it matches round robin's fairness as volume grows.",
        "**Requests vary wildly in duration (DB queries, uploads, websockets)** → **Least Connections**. It tracks who is actually busy instead of assuming.",
        "**Both at once — mixed fleet *and* variable request cost** → **Weighted Least Connections**. It divides live load by capacity.",
        "**Backends with genuinely different speeds, and latency matters** → **Least Response Time**. Scores by `(active + 1) × average latency`, routing around slow servers.",
        "**Adaptive routing in a noisy fleet** → **Peak EWMA**. A decaying average of recent latency, tunable via α — the basis of modern service-mesh and RPC balancers.",
        "**Sticky sessions with no shared store** → **IP Hash**. Pins each client to a server by hashing its identity (reach for consistent hashing so churn doesn't reshuffle everyone).",
        "**Near-least-connections quality with almost no state** → **Power of Two Choices**. Probe two random servers and take the lighter — ideal for distributed or client-side balancers.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Start simple, escalate on evidence",
      text: "Round robin is the right default. Reach for least-connections only when you can see uneven load in your metrics — long-tailed request durations or one backend running hot. Every step toward state-awareness buys adaptivity at the price of bookkeeping and, in distributed setups, stale-state hazards.",
    },
  ],
};
