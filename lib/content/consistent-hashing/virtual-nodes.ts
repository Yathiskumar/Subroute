import type { ConceptContent } from "@/lib/content/types";

export const virtualNodes: ConceptContent = {
  prototypeCaption:
    "Same ring — but now each server owns **V points** instead of one. With V=3, server *alpha* appears as **a1, a2, a3**, scattered around the circle; same colour means same server. Drag the **V slider** and watch the *imbalance* number drop as each server's positions interleave. Remove a server and its keys spread across the survivors instead of dumping on one.",

  overview: [
    {
      type: "p",
      text: "The vanilla ring has one nagging flaw: server positions are random, so the arcs between them are uneven. With a handful of servers, one might own a third of the ring and another a sliver — lopsided load. And when a server dies, *all* of its keys fall onto the single next server, which can tip it over. Virtual nodes fix both problems with one idea.",
    },
    {
      type: "p",
      text: "**Instead of placing each server at one point, place it at many.** A single physical server *beta* is hashed to V different positions — call them b1, b2, …, bV — each landing somewhere different on the ring. Those points are called *virtual nodes* (vnodes). The lookup rule is unchanged: a key still walks clockwise to the nearest point. But now that point belongs to one of a server's many vnodes, and the server's total share is the sum of all its little arcs scattered around the circle.",
    },
    {
      type: "p",
      text: "Spreading each server across many points averages out the randomness. Instead of one big lucky-or-unlucky arc, a server owns dozens of small ones all over the ring, so its share converges toward its fair fraction. And when it leaves, its many arcs each hand off to whatever different server is next — so its keys **scatter across all survivors** rather than crushing one.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Each server becomes V points" },
    {
      type: "ol",
      items: [
        "Choose V, the number of virtual nodes per server (often 100–256 in real systems).",
        "For each server, hash V distinct labels — `hash(\"beta#0\")`, `hash(\"beta#1\")`, … — and drop all V points onto the ring.",
        "Keep a map from every vnode point back to its physical server.",
        "Look a key up exactly as before: walk clockwise to the nearest point, then follow the map to find which physical server owns that vnode.",
      ],
    },
    {
      type: "p",
      text: "More points means smaller, more numerous arcs, which means the law of large numbers works in your favour. The statistical wobble in each server's share shrinks roughly like 1/√V — so going from V=1 to V=100 cuts the imbalance by about 10×. The prototype's *imbalance* readout (the spread between the busiest and idlest server) is exactly this number; slide V up and watch it fall.",
    },
    { type: "h", text: "Capacity for free: weight by vnode count" },
    {
      type: "p",
      text: "Because a server's load is proportional to how many points it has, you get heterogeneous capacity almost for nothing: give a machine that's twice as powerful twice as many virtual nodes and it takes on twice the keys. No special weighting logic — just hand the bigger boxes more points. This is exactly how Dynamo tunes for mixed hardware.",
    },
    {
      type: "callout",
      variant: "info",
      title: "This is what real systems ship",
      text: "Amazon Dynamo introduced vnodes to solve the vanilla ring's uneven load; Cassandra exposes the count directly as `num_tokens` (commonly 16–256), and Riak and ScyllaDB use the same idea. When someone says 'consistent hashing' in production, they almost always mean the ring *with* virtual nodes.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "More vnodes isn't free",
      text: "Each vnode is another entry in the sorted ring, so memory and lookup cost grow with N·V, and in a real cluster more tokens mean more ranges to gossip about and stream during repair. There's a sweet spot — enough points to balance load, not so many that bookkeeping dominates. That's why Cassandra moved its default down from 256 to 16.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Any production ring** — if you're using a hash ring at all, you almost certainly want virtual nodes on top. The vanilla ring's imbalance is real.",
        "**Mixed-capacity fleets** — give bigger machines more vnodes and they take proportionally more load, with no separate weighting code.",
        "**Smoother failure handling** — when a node dies, its load fans out across all survivors instead of doubling one neighbour's burden.",
        "**Faster rebalancing** — a joining node pulls a little data from many existing nodes in parallel, rather than a lot from one.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "Evens out load — imbalance shrinks roughly like 1/√V as you add points.",
      "A failing server's keys scatter across all survivors instead of dumping on one neighbour.",
      "Heterogeneous capacity comes for free: more vnodes = proportionally more load.",
      "Rebalancing is smoother — joins and leaves touch many nodes a little, not one node a lot.",
    ],
    cons: [
      "Ring size grows to N·V, so memory and lookup cost rise with the vnode count.",
      "More tokens mean more ranges to track, gossip, and stream during repair in real clusters.",
      "Picking V is a tuning decision — too few and load stays lumpy, too many and overhead dominates.",
      "Still hash-based placement: it balances on average, not perfectly, for any single layout.",
    ],
  },

  handsOn: [
    {
      title: "01 · Slide V and watch imbalance fall",
      body: "Drag the **Vnodes per server (V)** slider from 1 up to 15. Watch the *imbalance σ/μ* readout: at V=1 it's the lumpy vanilla ring, and as V grows the per-server key counts tighten toward the *ideal per server* line. That shrinking spread is the entire point of virtual nodes.",
    },
    {
      title: "02 · Remove a server, watch keys scatter",
      body: "With a few servers placed, **click a server** (a vnode dot or its stat card) to remove it. Its keys don't all pile onto one neighbour the way they did on the vanilla ring — they spread across the remaining servers, because its many vnodes each handed off to a different survivor.",
    },
    {
      title: "03 · See the labels interleave",
      body: "At a low V, hover the dots: each server's points (a1, a2, a3 …) sit at scattered positions, interleaved with every other server's. **Add a server** and +6 keys, then nudge V — notice how mixing the colours around the ring is what produces the even split.",
    },
  ],

  code: {
    language: "typescript",
    filename: "vnode-ring.ts",
    code: `// Consistent-hashing ring with virtual nodes.
// Each physical server is placed at V points; a map leads each point home.
class VNodeRing {
  private ring: { hash: number; server: string }[] = [];

  constructor(private vnodes = 100) {}

  private hash(s: string): number {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  addServer(name: string, weight = 1): void {
    // weight just scales how many points this server gets
    const points = this.vnodes * weight;
    for (let i = 0; i < points; i++) {
      this.ring.push({ hash: this.hash(\`\${name}#\${i}\`), server: name });
    }
    this.ring.sort((a, b) => a.hash - b.hash);
  }

  removeServer(name: string): void {
    this.ring = this.ring.filter((e) => e.server !== name);
  }

  getServer(key: string): string | null {
    if (this.ring.length === 0) return null;
    const h = this.hash(key);
    // first vnode clockwise; wrap to 0 if past the end
    const hit = this.ring.find((e) => e.hash >= h) ?? this.ring[0];
    return hit.server; // the map from point -> physical server
  }
}

const ring = new VNodeRing(150);
ring.addServer("alpha");
ring.addServer("beta", 2); // twice the capacity -> twice the points
ring.getServer("user:42");`,
  },

  furtherReading: [
    {
      label: "Amazon Dynamo (SOSP 2007), §4.2 — virtual nodes",
      href: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
      note: "The paper that popularised vnodes: it names the vanilla ring's two problems (non-uniform load, no capacity awareness) and introduces virtual nodes to fix both.",
      kind: "paper",
    },
    {
      label: "Werner Vogels — Amazon's Dynamo (announcement)",
      href: "https://www.allthingsdistributed.com/2007/10/amazons_dynamo.html",
      note: "Amazon's CTO on why Dynamo was built the way it was — the readable companion to the paper.",
      kind: "article",
    },
    {
      label: "DataStax — Cassandra virtual nodes (vnodes)",
      href: "https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/architecture/archDataDistributeVnodesUsing.html",
      note: "How a major production database exposes vnodes via `num_tokens`, and why the count is a balance-vs-overhead tradeoff.",
      kind: "docs",
    },
    {
      label: "Toptal — A Guide to Consistent Hashing (virtual nodes)",
      href: "https://www.toptal.com/big-data/consistent-hashing",
      note: "Walks through how adding virtual nodes tightens the distribution, with the ~5% deviation figure at ~150 points per server.",
      kind: "article",
    },
    {
      label: "Tom White — Consistent Hashing",
      href: "https://tom-e-white.com/2007/11/consistent-hashing.html",
      note: "The classic explainer; its 'replicas' parameter is exactly the vnode count, shown shrinking the load spread.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "vn-q1",
      question: "What does a virtual node actually add to the ring?",
      options: [
        { id: "a", label: "A second hash function for keys" },
        { id: "b", label: "An extra physical server" },
        { id: "c", label: "One more ring position that maps back to an existing physical server" },
        { id: "d", label: "A backup copy of every key" },
      ],
      correctOptionId: "c",
      explanation:
        "A vnode is just another point on the ring owned by an existing physical server. Each server is placed at V points, and a map leads every point back to its physical server. The lookup rule is unchanged.",
    },
    {
      id: "vn-q2",
      question: "Why does increasing V make the load more even?",
      options: [
        { id: "a", label: "It makes the hash function more random" },
        { id: "b", label: "Each server owns many small arcs spread around the ring, so its share converges to its fair fraction (~1/√V wobble)" },
        { id: "c", label: "It reduces the total number of keys" },
        { id: "d", label: "Larger V forces servers to be evenly spaced by definition" },
      ],
      correctOptionId: "b",
      explanation:
        "With many points, a server's load is the sum of many small arcs rather than one large random one. Averaging shrinks the statistical wobble roughly like 1/√V, so the busiest and idlest servers move closer to the ideal share.",
    },
    {
      id: "vn-q3",
      question: "How do virtual nodes give you heterogeneous (mixed-capacity) servers almost for free?",
      options: [
        { id: "a", label: "By assigning a more powerful server more virtual nodes, so it owns proportionally more of the ring" },
        { id: "b", label: "By giving each server a faster hash function" },
        { id: "c", label: "By storing two copies of hot keys on big servers" },
        { id: "d", label: "Capacity can't be expressed with virtual nodes" },
      ],
      correctOptionId: "a",
      explanation:
        "Load is proportional to point count, so a server that should handle twice the work simply gets twice the vnodes. No separate weighting logic is needed — exactly how Dynamo tunes for mixed hardware.",
    },
  ],
};
