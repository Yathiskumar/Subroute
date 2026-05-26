import type { ConceptContent } from "@/lib/content/types";

export const maglev: ConceptContent = {
  prototypeCaption:
    "Maglev builds a fixed **lookup table** of M slots up front. Each backend has a pseudo-random **preference list**, and they take turns in a **round-robin draft** — each claims its most-wanted free slot — until every slot is filled. Press **Play draft** to watch it fill, then click a key to see its O(1) lookup: `hash(key) % M` → read the cell → done. Remove a backend and only a bounded slice of the table changes.",

  overview: [
    {
      type: "p",
      text: "Maglev hashing comes from Google's network load balancer (Eisenbud et al., NSDI 2016). Its job is brutal: route millions of packets per second to backends, with lookups that must be as close to free as possible. A ring walk or an O(N) score per packet is too slow. So Maglev does the work **once, up front**, and bakes the result into a flat array.",
    },
    {
      type: "p",
      text: "That array is the **lookup table**: M slots (M a prime, ~65537 in production), each holding the id of one backend. Once it's built, routing a key is three trivial operations — `hash(key)`, `mod M`, read `table[slot]`. That's **O(1)**, no matter how many backends or keys you have. The cleverness is entirely in how the table gets filled so that it's both *evenly balanced* and *barely disturbed* when backends change.",
    },
    {
      type: "p",
      text: "Filling is a fair draft. Each backend generates a **preference list** — a permutation of all slot numbers, the order it would grab slots if it could. Then backends take turns: on your turn you claim your most-preferred slot that's still free. Round after round until the table is full. Because everyone gets roughly equal turns, everyone ends up with roughly equal slots.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Build the table with a round-robin draft" },
    {
      type: "ol",
      items: [
        "Pick a table size M (prime). Each backend derives two numbers from its name — an `offset` and a `skip` — that generate its preference list: `offset, offset+skip, offset+2·skip, …` (all mod M).",
        "Go round by round. On each backend's turn, scan down its preference list to the first slot that's still empty and claim it.",
        "If its top choice is taken, it skips to its next preference (the prototype shows these skips).",
        "Continue until all M slots are filled. Now every slot maps to exactly one backend.",
      ],
    },
    {
      type: "p",
      text: "Lookup afterwards is the easy part: `slot = hash(key) % M`, then `backend = table[slot]`. One hash, one modulo, one array read — the same cost whether you have 3 backends or 300.",
    },
    { type: "h", text: "Why disruption is bounded" },
    {
      type: "p",
      text: "When a backend disappears, Maglev rebuilds the table — but the draft is designed so that most slots keep their previous owner. Only a small, bounded fraction of slots change hands, which means only a small fraction of connections get re-routed. It's not quite as minimal as the ring or jump hash, but it's close — and in exchange you get O(1) lookups and very even balance. A bigger M makes both the balance smoother and the disruption finer-grained.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Built for connection consistency",
      text: "Maglev pairs this table with connection tracking so that, even during a rebuild, existing TCP connections keep going to the same backend. The hashing gives a good default; the tracking handles the edge cases. Together they let Google run load balancing as software on commodity servers.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "It costs O(M) memory and a rebuild",
      text: "Unlike jump hash's zero state, Maglev keeps an M-slot table and must recompute it when membership changes. With M in the tens of thousands that's cheap and fast, but it is real work and real memory — the price of O(1) lookups.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**High-throughput network load balancers** — the original use: routing packets at line rate where per-lookup cost must be O(1).",
        "**Many lookups, infrequent membership change** — you pay to build the table once, then enjoy cheap reads.",
        "**You need even balance *and* fast lookups** — Maglev gives both, where the ring trades lookup speed and jump hash trades flexibility.",
        "**Connection-oriented traffic** — combined with connection tracking, it keeps flows pinned to their backend through churn.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "O(1) lookup — one hash, one mod, one array read, regardless of scale.",
      "Very even load by construction (the fair round-robin draft).",
      "Bounded disruption when backends change — only a small fraction of slots move.",
      "Battle-tested at Google scale; pairs naturally with connection tracking.",
    ],
    cons: [
      "Uses O(M) memory for the table — not zero-state like jump hash.",
      "Membership changes require rebuilding the table.",
      "Disruption is slightly worse than the ring or jump hash (still bounded, just not minimal).",
      "More moving parts (preference lists, draft) than a plain ring.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the draft fill the table",
      body: "Press **Play draft**. Backends take turns claiming their most-preferred free slot; the status line calls out each pick and any slots it had to skip because they were already taken. When it finishes, every slot is coloured by its owner and lookups are ready.",
    },
    {
      title: "02 · Do an O(1) lookup",
      body: "Click a key chip. The result panel shows the three steps: `hash(key)`, then `mod M` to get a slot, then `table[slot]` to get the backend — and the matching cell in the table highlights. No walking, no scoring; just one array read.",
    },
    {
      title: "03 · Remove a backend, change M",
      body: "Click a backend's **✕** and watch the table redraft — most cells keep their colour; only a bounded slice changes. Then try the **M** buttons (7 → 31): a bigger table balances more smoothly and spreads disruption over finer slots. Production uses M ≈ 65537.",
    },
  ],

  code: {
    language: "typescript",
    filename: "maglev.ts",
    code: `// Maglev hashing: build a lookup table once, then route in O(1).
function buildTable(backends: string[], M: number): string[] {
  // Each backend's preference list is a permutation of [0, M).
  const prefs = backends.map((name) => {
    const offset = h(name + ":offset") % M;
    const skip = (h(name + ":skip") % (M - 1)) + 1; // 1..M-1
    return Array.from({ length: M }, (_, j) => (offset + j * skip) % M);
  });

  const table: (string | null)[] = new Array(M).fill(null);
  const next = backends.map(() => 0); // cursor into each pref list
  let filled = 0;

  // Round-robin draft: each backend claims its top free slot, in turn.
  while (filled < M) {
    for (let i = 0; i < backends.length; i++) {
      let slot = prefs[i][next[i]];
      while (table[slot] !== null) slot = prefs[i][++next[i]]; // skip taken
      table[slot] = backends[i];
      next[i]++;
      if (++filled === M) break;
    }
  }
  return table as string[];
}

function h(s: string): number { /* any 32-bit hash */ return 0; }

const table = buildTable(["alpha", "beta", "gamma"], 65537);
// Lookup is now O(1):
function lookup(key: string, table: string[]): string {
  return table[h(key) % table.length];
}`,
  },

  furtherReading: [
    {
      label: "Eisenbud et al. — Maglev: A Fast and Reliable Software Network Load Balancer (NSDI 2016)",
      href: "https://www.usenix.org/conference/nsdi16/technical-sessions/presentation/eisenbud",
      note: "The original paper. §3.4 covers the consistent-hashing table and the round-robin fill; the rest explains how it routes packets at line rate.",
      kind: "paper",
    },
    {
      label: "Maglev paper — full PDF",
      href: "https://www.usenix.org/sites/default/files/nsdi16-paper-eisenbud.pdf",
      note: "Complete text, including the table-generation pseudocode and the analysis of balance vs. disruption as M varies.",
      kind: "paper",
    },
    {
      label: "The Morning Paper — Maglev walkthrough",
      href: "https://blog.acolyer.org/2016/03/21/maglev-a-fast-and-reliable-software-network-load-balancer/",
      note: "Adrian Colyer's accessible summary of the paper — a fast way to grasp the whole system before diving into the PDF.",
      kind: "article",
    },
    {
      label: "Google Cloud Blog — the load balancer that powers GCP networking",
      href: "https://cloud.google.com/blog/products/gcp/google-shares-software-network-load-balancer-design-powering-gcp-networking",
      note: "Google's own write-up on why Maglev exists and how it's deployed in production.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "mg-q1",
      question: "After the table is built, how does Maglev route a key?",
      options: [
        { id: "a", label: "Walk a ring clockwise to the next backend" },
        { id: "b", label: "Score every backend and take the highest" },
        { id: "c", label: "Compute hash(key) % M and read table[slot] — O(1)" },
        { id: "d", label: "Jump forward through bucket numbers" },
      ],
      correctOptionId: "c",
      explanation:
        "All the work is done up front when building the table. A lookup is one hash, one modulo, and one array read — O(1) regardless of how many backends or keys exist.",
    },
    {
      id: "mg-q2",
      question: "How is the lookup table filled?",
      options: [
        { id: "a", label: "Randomly, then sorted" },
        { id: "b", label: "Backends take turns in a round-robin draft, each claiming its most-preferred free slot" },
        { id: "c", label: "Each key writes itself into a slot" },
        { id: "d", label: "By copying the previous table unchanged" },
      ],
      correctOptionId: "b",
      explanation:
        "Each backend has a pseudo-random preference list (a permutation of slots). They take turns claiming their top still-free slot until every slot is filled. Roughly equal turns yield roughly equal slot counts — even balance.",
    },
    {
      id: "mg-q3",
      question: "Compared with jump hash, what does Maglev trade for its O(1) lookups?",
      options: [
        { id: "a", label: "It uses O(M) memory and must rebuild the table when backends change" },
        { id: "b", label: "It distributes load very unevenly" },
        { id: "c", label: "Its lookups are actually O(N)" },
        { id: "d", label: "It can only support a single backend" },
      ],
      correctOptionId: "a",
      explanation:
        "Jump hash stores nothing; Maglev keeps an M-slot table and recomputes it on membership change. In return, lookups are a single array read and disruption stays bounded — a good deal for a packet-rate load balancer.",
    },
  ],
};
