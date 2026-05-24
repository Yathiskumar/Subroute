import type { ConceptContent } from "@/lib/content/types";

export const roundRobin: ConceptContent = {
  prototypeCaption:
    "Four identical servers behind one load balancer. Each request is sent to the next server in turn — 1, 2, 3, 4, 1, 2… Send requests one at a time or hit Start auto and watch the 'Next' pointer cycle and the handled counts stay dead even.",

  overview: [
    {
      type: "p",
      text: "Round robin is the 'hello world' of load balancing: hand request 1 to server 1, request 2 to server 2, and so on, wrapping back to the start after the last server. It is the default in NGINX, the simplest mode in HAProxy, and the mental model most people reach for first — because it is genuinely good when its one assumption holds.",
    },
    {
      type: "p",
      text: "That assumption: every server is equally capable and every request costs roughly the same. When that's true, dealing requests out like cards produces a perfectly even split with essentially zero machinery — one integer counter, incremented modulo the number of servers.",
    },
  ],

  howItWorks: [
    { type: "h", text: "One counter, modulo N" },
    {
      type: "p",
      text: "The entire algorithm is a pointer that walks the server list and wraps around:",
    },
    {
      type: "ol",
      items: [
        "Keep an index `next`, starting at 0.",
        "On each request, forward it to `servers[next]`.",
        "Advance: `next = (next + 1) % N`.",
      ],
    },
    {
      type: "p",
      text: "After N requests every server has received exactly one; after kN requests, exactly k each. The distribution is as even as it can possibly be, and the decision is O(1) with no knowledge of server state at all.",
    },
    { type: "h", text: "Why it's stateless (mostly)" },
    {
      type: "p",
      text: "Round robin looks at neither the servers nor the request — only its own counter. That makes it trivially fast and easy to reason about. The catch is that single shared counter: if many load-balancer instances each keep their own, their cycles drift out of phase and the global distribution is no longer a clean rotation (though it stays roughly even). True global round robin needs a shared, atomically-incremented counter, which reintroduces coordination cost.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The hidden assumption bites hard",
      text: "Round robin is blind to how long a request takes. If request durations vary — one is a 2-second report, the next is a 5ms health check — round robin will happily stack three slow requests on server 2 while server 3 breezes through twenty fast ones. Even *counts* do not mean even *load*.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Homogeneous fleets** — every backend is the same instance type with the same resources.",
        "**Uniform, short requests** — stateless HTTP endpoints where every call costs about the same and finishes quickly.",
        "**You want predictability** — round robin's behavior is completely deterministic and easy to explain in a postmortem.",
        "**A sane default** — when you have no load metrics yet, round robin is the right place to start before measuring whether you need something smarter.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world default",
      text: "NGINX uses round robin as its default upstream method, and it backs countless production deployments. Most teams never need anything else — until request durations start varying, at which point least-connections earns its keep.",
    },
  ],

  tradeoffs: {
    pros: [
      "Dead simple: one counter, O(1) per request, trivial to implement and debug.",
      "Perfectly even request *counts* across servers over each full cycle.",
      "Completely stateless about backends — no health probing or connection tracking required.",
      "Deterministic and predictable, which makes capacity planning easy.",
    ],
    cons: [
      "Blind to request cost — even counts can mean wildly uneven load when durations differ.",
      "Blind to server capacity — sends a small box and a big box the same share (that's what Weighted Round Robin fixes).",
      "Blind to health — a slow or degraded server still gets its full 1/N until a separate health check ejects it.",
      "Global ordering needs a shared counter; per-instance counters drift out of phase across distributed LBs.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the cycle",
      body: "Click 'Send one' five times and follow the 'Next' label on the load balancer. It walks Server 1 → 2 → 3 → 4 → 1, and the handled counts climb in lockstep. After any multiple of four sends, all four counts are identical — that's the perfect even split round robin guarantees.",
    },
    {
      title: "02 · Let it run",
      body: "Hit 'Start auto' and let it stream. The Distribution stat (S1 · S2 · S3 · S4) stays within one of being perfectly equal at all times. No server ever pulls ahead — that steadiness is round robin's whole selling point.",
    },
    {
      title: "03 · Imagine uneven durations",
      body: "The sim gives every request the same flight time, so counts and load are the same thing here. Now picture request 2 taking ten times as long as the others: round robin would still deal server 2 its turn every fourth request, piling slow work on it regardless. Keep that gap in mind — it's exactly the blind spot Least Connections is built to close.",
    },
  ],

  code: {
    language: "typescript",
    filename: "round-robin.ts",
    code: `// Round robin: a single index that walks the pool and wraps.
class RoundRobinBalancer {
  private next = 0;
  constructor(private servers: string[]) {}

  pick(): string {
    const server = this.servers[this.next];
    this.next = (this.next + 1) % this.servers.length;
    return server;
  }
}

// Usage
const lb = new RoundRobinBalancer(["s1", "s2", "s3", "s4"]);
lb.pick(); // "s1"
lb.pick(); // "s2"
lb.pick(); // "s3"
lb.pick(); // "s4"
lb.pick(); // "s1"  (wraps around)

// Note: for global ordering across multiple LB instances,
// 'next' must be a shared, atomically-incremented counter
// (e.g. Redis INCR) — otherwise each instance cycles on its own.`,
  },

  furtherReading: [
    {
      label: "NGINX — HTTP Load Balancing",
      href: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/",
      note: "Round robin is NGINX's default upstream method; this doc shows it alongside weighted and least-conn modes.",
      kind: "docs",
    },
    {
      label: "HAProxy — Load balancing algorithms",
      href: "https://www.haproxy.com/documentation/haproxy-configuration-tutorials/load-balancing/",
      note: "How HAProxy implements `roundrobin` (and static-rr), and when it recommends alternatives.",
      kind: "docs",
    },
    {
      label: "AWS — How Elastic Load Balancing works",
      href: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html",
      note: "Round robin is the ALB target-group default; the doc spells out exactly when it's the right routing algorithm (uniform requests, uniform targets).",
      kind: "docs",
    },
    {
      label: "Cloudflare — Types of load balancing algorithms",
      href: "https://www.cloudflare.com/learning/performance/types-of-load-balancing-algorithms/",
      note: "Plain-English tour of round robin and where its 'all requests are equal' assumption breaks down.",
      kind: "article",
    },
    {
      label: "Google SRE Book — Ch. 20: Load Balancing in the Datacenter",
      href: "https://sre.google/sre-book/load-balancing-datacenter/",
      note: "Why naive round robin underutilizes a fleet at scale (the famous '700 of 1,000 CPUs' example) — the motivation for smarter policies.",
      kind: "book",
    },
    {
      label: "Wikipedia — Round-robin scheduling",
      href: "https://en.wikipedia.org/wiki/Round-robin_scheduling",
      note: "The general scheduling idea behind the load-balancing algorithm.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "rr-q1",
      question: "What information does a round robin balancer use to choose a server?",
      options: [
        { id: "a", label: "Each server's current CPU usage" },
        { id: "b", label: "The number of active connections per server" },
        { id: "c", label: "Only its own counter — nothing about the servers" },
        { id: "d", label: "The size of the incoming request" },
      ],
      correctOptionId: "c",
      explanation:
        "Round robin is stateless about the backends. It increments an index modulo N and forwards to that server, never inspecting server load, health, or request cost. That blindness is both its simplicity and its weakness.",
    },
    {
      id: "rr-q2",
      question:
        "Round robin distributes request counts evenly. Why can the actual load still end up uneven?",
      options: [
        { id: "a", label: "Because the counter occasionally skips a server" },
        { id: "b", label: "Because requests can take very different amounts of time" },
        { id: "c", label: "Because it always favors the first server" },
        { id: "d", label: "It can't — even counts always mean even load" },
      ],
      correctOptionId: "b",
      explanation:
        "Equal counts only equal equal load when every request costs the same. If durations vary, round robin can pile several slow requests on one server while another races through many fast ones — same count, very different real load.",
    },
    {
      id: "rr-q3",
      question:
        "You run round robin across three load-balancer instances, each with its own counter. What happens to the global distribution?",
      options: [
        { id: "a", label: "It breaks completely and one server gets everything" },
        { id: "b", label: "It stays a perfect global rotation automatically" },
        { id: "c", label: "It stays roughly even but is no longer a clean 1-2-3-4 rotation" },
        { id: "d", label: "Requests are dropped until the counters resync" },
      ],
      correctOptionId: "c",
      explanation:
        "Independent per-instance counters drift out of phase, so the global sequence isn't a tidy rotation — but each instance still spreads its own share evenly, so the aggregate stays roughly balanced. A truly global order requires a shared, atomic counter.",
    },
  ],
};
