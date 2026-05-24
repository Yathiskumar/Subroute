import type { ConceptContent } from "@/lib/content/types";

export const ipHash: ConceptContent = {
  prototypeCaption:
    "Five clients, each with a fixed IP. The balancer hashes the IP and takes it mod 4 — so a given client always lands on the same server, shown in the routing table. Click a client to watch its hash computed live; notice the distribution can be lumpy because it depends on the IPs, not on balance.",

  overview: [
    {
      type: "p",
      text: "Every algorithm so far spreads load without caring *who* the request comes from. IP hash does the opposite: it deliberately sends the same client to the same server every time, by hashing the client's IP address and mapping that to a backend. This is **session affinity** (a.k.a. sticky sessions) achieved with zero shared state — no session store, no cookies, just arithmetic.",
    },
    {
      type: "p",
      text: "Why pin a client to a server? Because some servers hold per-client state that's expensive to move: an in-memory session, a warmed local cache, an open websocket, a partially-uploaded file. If request N+1 lands on a different server than request N, that state is gone. Hashing the client identity guarantees stickiness deterministically, the same way on every load balancer in the fleet — no coordination required.",
    },
  ],

  howItWorks: [
    { type: "h", text: "hash(client) mod N" },
    {
      type: "ol",
      items: [
        "Take a stable client identifier — typically the source IP (or a header like a session ID).",
        "Run it through a hash function to get a large integer.",
        "Map to a server with `hash mod N`, where N is the number of backends.",
        "Forward there. The same input always yields the same server, so the client sticks.",
      ],
    },
    {
      type: "p",
      text: "The prototype uses a small djb2-style string hash on the IP and takes it mod 4. Click any client and the 'Latest hash calculation' strip shows the exact numbers: `hash(\"10.0.0.7\") = … → mod 4 = 2 → Server 3`. The routing table makes the determinism obvious — each client has one fixed destination, forever.",
    },
    { type: "h", text: "Two real problems" },
    {
      type: "ul",
      items: [
        "**Uneven distribution.** Balance now depends on the *clients*, not the algorithm. A few heavy clients hashing to the same server creates a hotspot the LB can't fix — watch the 'Spread' stat stay stubbornly nonzero.",
        "**The resharding catastrophe.** `mod N` means changing N remaps almost everyone. Add or remove a single server and most clients suddenly hash to a different backend — every sticky session breaks at once.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Plain mod-N hashing is brittle — use consistent hashing",
      text: "Because `hash mod N` reshuffles nearly all keys when N changes, production systems use *consistent hashing* (a hash ring) or Google's Maglev hashing instead. Those remap only ~1/N of clients when a server joins or leaves, keeping the rest of the sticky sessions intact. Same goal — stickiness — far gentler under churn.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Stateful sessions without a shared store** — server-local session data, when you can't or won't centralize it in Redis.",
        "**Cache locality** — keep a client on the server that already has its data warm, raising hit rates.",
        "**Sticky long-lived connections** — websockets, SSE, gRPC streams that must stay on one backend.",
        "**Sharding by key** — the same idea routes a given user/tenant ID to its owning shard.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "NGINX exposes `ip_hash` and a general `hash $key consistent` directive; HAProxy has `balance source` and `balance hdr`. For large dynamic fleets, Google's Maglev and ring-based consistent hashing are the production-grade variants that survive backends coming and going.",
    },
  ],

  tradeoffs: {
    pros: [
      "Deterministic session affinity with no shared session store or cookies.",
      "Same mapping on every load balancer — no coordination across the fleet.",
      "Improves cache hit rates and keeps client-local state intact.",
      "O(1) per request: one hash, one modulo.",
    ],
    cons: [
      "Distribution depends on the client population — heavy or clustered clients create hotspots the LB can't smooth.",
      "Blind to load, capacity, and latency — it optimizes stickiness, not balance.",
      "Plain `mod N` remaps almost all clients when the server count changes; needs consistent hashing to be safe under churn.",
      "Clients behind a shared NAT/proxy all hash to one server, concentrating load.",
    ],
  },

  handsOn: [
    {
      title: "01 · Confirm the stickiness",
      body: "Click 'Client C' several times. Every request follows the same line to the same server, and the 'Latest hash calculation' strip shows the identical computation each time. Check the routing table: Client C's row never changes destination — that's deterministic affinity.",
    },
    {
      title: "02 · Watch the distribution go lumpy",
      body: "Hit 'Send 20 random'. Because routing depends on which IPs exist (not on balancing), the per-server counts come out uneven and the 'Spread (max − min)' stat stays well above zero. No amount of traffic evens it out — the hash, not the load, decides.",
    },
    {
      title: "03 · Reason about resharding",
      body: "The routing table shows each client's server for N = 4. Now imagine N drops to 3: every `hash mod 4` becomes `hash mod 3`, so almost every client remaps to a different server and all their sessions break at once. That fragility is exactly why production systems reach for consistent hashing instead of plain mod-N.",
    },
  ],

  code: {
    language: "typescript",
    filename: "ip-hash.ts",
    code: `// IP hash: deterministic session affinity via hash(client) mod N.
function hashIP(ip: string): number {
  let h = 5381;                 // djb2
  for (let i = 0; i < ip.length; i++) {
    h = ((h << 5) + h + ip.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

class IpHashBalancer {
  constructor(private servers: string[]) {}
  pick(clientIp: string): string {
    return this.servers[hashIP(clientIp) % this.servers.length];
  }
}

// The fragility: 'mod N' remaps almost everyone when N changes.
// Production systems use consistent hashing (a ring) instead, which
// remaps only ~1/N of clients when a server is added or removed:
//
//   ring.addServer("s5");      // only keys between s5 and its
//   const s = ring.locate(ip); // predecessor move — the rest stay put`,
  },

  furtherReading: [
    {
      label: "NGINX — ip_hash and hash methods",
      href: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/#load-balancing-methods",
      note: "`ip_hash` for source-IP stickiness and the generic `hash ... consistent` directive for ring hashing.",
      kind: "docs",
    },
    {
      label: "HAProxy — Load balancing algorithms (source / hash)",
      href: "https://www.haproxy.com/documentation/haproxy-configuration-tutorials/load-balancing/",
      note: "`balance source` and header/URL hashing, plus the `hash-type consistent` option to survive backend changes.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Consistent hashing",
      href: "https://en.wikipedia.org/wiki/Consistent_hashing",
      note: "Why `mod N` is brittle and how a hash ring remaps only ~1/N of keys when N changes. Covers Karger et al. (1997).",
      kind: "article",
    },
    {
      label: "Maglev: A Fast and Reliable Software Network Load Balancer (Google, NSDI '16)",
      href: "https://www.usenix.org/conference/nsdi16/technical-sessions/presentation/eisenbud",
      note: "Google's production hashing scheme: near-perfect distribution plus minimal disruption when backends churn.",
      kind: "paper",
    },
    {
      label: "Toptal — The Ultimate Guide to Consistent Hashing",
      href: "https://www.toptal.com/big-data/consistent-hashing",
      note: "A visual, code-backed walkthrough of the hash ring — the upgrade path from plain IP hash.",
      kind: "article",
    },
    {
      label: "Cloudflare — Types of load balancing algorithms",
      href: "https://www.cloudflare.com/learning/performance/types-of-load-balancing-algorithms/",
      note: "IP/hash methods in context among the other strategies.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "iph-q1",
      question: "What is the primary purpose of IP hash load balancing?",
      options: [
        { id: "a", label: "To distribute load as evenly as possible" },
        { id: "b", label: "To always send a given client to the same server (session affinity)" },
        { id: "c", label: "To route to the fastest server" },
        { id: "d", label: "To pick a random server per request" },
      ],
      correctOptionId: "b",
      explanation:
        "IP hash trades even distribution for stickiness: hashing the client identity pins each client to one backend, preserving server-local session state and cache locality — with no shared session store.",
    },
    {
      id: "iph-q2",
      question: "Why can IP hash produce an uneven load distribution?",
      options: [
        { id: "a", label: "The hash function is random per request" },
        { id: "b", label: "Balance depends on the client population, not the algorithm; clustered or heavy clients create hotspots" },
        { id: "c", label: "It always overloads server 1" },
        { id: "d", label: "It ignores the client IP" },
      ],
      correctOptionId: "b",
      explanation:
        "Since the destination is decided by the clients' IPs, the spread reflects who's actually sending traffic. A few heavy clients (or many behind one NAT) hashing to the same server make a hotspot the balancer can't smooth out.",
    },
    {
      id: "iph-q3",
      question: "Why do production systems prefer consistent hashing over plain `hash mod N`?",
      options: [
        { id: "a", label: "It's faster to compute" },
        { id: "b", label: "It distributes perfectly evenly" },
        { id: "c", label: "When the server count changes, it remaps only ~1/N of clients instead of nearly all of them" },
        { id: "d", label: "It doesn't need a hash function" },
      ],
      correctOptionId: "c",
      explanation:
        "With `mod N`, changing N reshuffles almost every key, breaking nearly all sticky sessions at once. Consistent hashing (a ring) or Maglev hashing moves only about 1/N of keys when a backend is added or removed, keeping the rest pinned.",
    },
  ],
};
