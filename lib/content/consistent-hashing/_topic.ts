import type { TopicContent } from "@/lib/content/types";

export const consistentHashingTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**Consistent hashing is a way to map keys to servers so that adding or removing a server moves as few keys as possible.** You have a set of keys — cache entries, user sessions, database rows — and a pool of servers to spread them over. The job is to decide which server owns each key, and to keep that decision stable when the pool changes.",
    },
    {
      type: "p",
      text: "The obvious approach is `server = hash(key) % N`. It works perfectly until N changes. Add one server — go from 4 to 5 — and the modulo result flips for almost every key. Nearly your entire dataset has to move at once: caches go cold, sessions get lost, and the system thrashes. The whole point of consistent hashing is to avoid that cliff.",
    },
    {
      type: "p",
      text: "The classic trick, from Karger's 1997 paper, is to place both servers and keys on a circle — a *hash ring*. A key belongs to the first server you meet walking clockwise. Now adding or removing a server only disturbs the slice of the ring next to it; on average just **K/N keys move** instead of all of them. Everything in this topic is a variation on that one idea: keep placement stable, share load evenly, and look it up fast.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Where you actually need it" },
    {
      type: "ul",
      items: [
        "**Distributed caches** — Memcached and CDN edge nodes use it so that resizing the fleet doesn't flush every cache at once. This was the original motivating use case.",
        "**Sharded databases & key-value stores** — Dynamo, Cassandra, Riak, and ScyllaDB partition data across nodes with a hash ring so a node joining or leaving only reshuffles its neighbours' data.",
        "**Sticky load balancing** — pin a client or session to a backend by hashing its identity, without a shared session store. (This is the bridge from the Load Balancing topic's IP Hash.)",
        "**Network load balancers** — Google's Maglev and similar systems hash connections to backends so packets in one connection keep landing on the same server even as backends come and go.",
        "**Any time rehashing is expensive** — if moving a key means copying data, warming a cache, or migrating a partition, you want the *minimum* movement when membership changes.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "The one number that matters",
      text: "With naive `hash % N`, changing the server count moves ~100% of keys. With consistent hashing, it moves about 1/N of them. That single property — minimal disruption on membership change — is why every large distributed store reaches for it.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Method",
      bursts: "Core idea",
      precision: "Load balance",
      memory: "Lookup cost",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "Vanilla Ring",
        bursts: "Servers & keys on a circle; walk clockwise",
        precision: "Uneven — random gaps cause hot spots",
        memory: "O(log N) binary search",
        bestFor: "Understanding the core idea",
      },
      {
        algorithm: "Virtual Nodes",
        bursts: "Each server placed at V points on the ring",
        precision: "Even — smooths out as V grows",
        memory: "O(log(N·V))",
        bestFor: "Real ring-based stores (Dynamo, Cassandra)",
      },
      {
        algorithm: "Rendezvous (HRW)",
        bursts: "Score each server for the key, pick the highest",
        precision: "Even, no virtual nodes needed",
        memory: "O(N) — score every server",
        bestFor: "Small clusters, easy weighting",
      },
      {
        algorithm: "Jump Hash",
        bursts: "A formula maps key + count → bucket",
        precision: "Near-perfect, zero memory",
        memory: "O(log N), no table",
        bestFor: "Numbered shards that grow at the tail",
      },
      {
        algorithm: "Maglev",
        bursts: "Precompute a lookup table of backends",
        precision: "Very even by construction",
        memory: "O(1) table lookup",
        bestFor: "Fast network load balancers",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "Decision guide" },
    {
      type: "ul",
      items: [
        "**Learning the concept, or a simple ring** → **Vanilla Ring**. It's the foundation; understand it before anything else.",
        "**A production ring-based store** → **Virtual Nodes**. The same ring, but each server sits at many points so load is even and capacity is tunable. This is what Dynamo, Cassandra, and Riak actually ship.",
        "**A small number of servers, and you want weighting without the bookkeeping of vnodes** → **Rendezvous (HRW)**. It scores every server per key, so it's O(N), but it's simple and balances beautifully.",
        "**Shards numbered 0…N-1 that only ever grow at the end** → **Jump Hash**. No memory, no table, near-perfect balance — but you can't remove an arbitrary node, only the last one.",
        "**A high-throughput network load balancer** → **Maglev**. It builds a lookup table up front for O(1) routing and minimal disruption when backends change.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Start at the ring",
      text: "Almost every method here is the vanilla ring with one problem fixed. Virtual nodes fix uneven load; rendezvous removes the ring; jump hash removes the memory; Maglev makes lookup O(1). Learn the ring first and the rest fall into place.",
    },
  ],
};
