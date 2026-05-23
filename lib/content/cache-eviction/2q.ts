import type { ConceptContent } from "@/lib/content/types";

export const twoQ: ConceptContent = {
  prototypeCaption:
    "Three lists. New keys land in **A1in** (small FIFO probation, top-left). When A1in overflows, the evicted key drops into **A1out** (ghost list, bottom) — keys only, no values. A future hit on a ghost promotes the key into **Am** (the real LRU cache, top-right). Watch the demo: A enters A1in, becomes a ghost, then on its next access gets promoted to Am.",

  overview: [
    {
      type: "p",
      text: "2Q — **Two Queue** — is the simplest answer to 'how do I make LRU survive a scan?' Theodore Johnson and Dennis Shasha published it in 1994 as a buffer-pool replacement that consistently beats LRU on database workloads. The idea: new entries are **on probation** in a small FIFO queue. Only if they're re-accessed do they get promoted to the main LRU. Scans, which never re-access, never make it past probation.",
    },
    {
      type: "p",
      text: "MySQL InnoDB ships a 2Q variant as its default. So do several CDN edge caches. It's cheap, easy to implement, and gives you most of ARC's scan resistance with far less complexity.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Two queues, a single promotion rule" },
    {
      type: "p",
      text: "There are two cached lists plus a ghost list:",
    },
    {
      type: "ul",
      items: [
        "**A1in** — a small FIFO queue, typically ~25% of capacity. First-time entries land here.",
        "**Am** — a large LRU queue, the remaining ~75%. The 'proven' working set lives here.",
        "**A1out (ghost)** — keys recently evicted from A1in, no values. Used to detect 'almost popular' entries.",
      ],
    },
    {
      type: "p",
      text: "The algorithm on access:",
    },
    {
      type: "ol",
      items: [
        "**Hit in Am** — move to head of Am (standard LRU touch).",
        "**Hit in A1in** — **don't promote yet**. Leave it in place. (This is the version called 2Q-simplified; the original 2Q-Full promotes here.)",
        "**Hit in A1out (ghost)** — the key was kicked out of A1in but is asked for again, so it's worth keeping. Insert into Am at the head.",
        "**Miss everywhere** — insert into A1in at the head. If A1in is over its budget, push its tail into A1out (just the key) and drop the value.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Why this kills scans",
      text: "A scan reads N unique keys, each exactly once. They all enter A1in as misses, and they all get pushed out of A1in (and into A1out) in FIFO order without ever being promoted to Am. Your hot Am entries — the things your real workload cares about — are never touched.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Buffer pools for storage engines** — MySQL InnoDB ships a 2Q variant by default.",
        "**Workloads that intermittently scan** — analytics queries against an OLTP database, occasional batch jobs against a live cache.",
        "**You want scan resistance without ARC's complexity or patent**.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "MySQL InnoDB splits the buffer pool into a 'young' sublist (≈63%) and an 'old' sublist (≈37%), with promotion gated by a time-on-old threshold. The shape is 2Q — different names, same idea.",
    },
  ],

  tradeoffs: {
    pros: [
      "Strong scan resistance — the dominant reason it's chosen in database buffer pools.",
      "Conceptually simple — two lists and a small ghost list, with a single promotion rule.",
      "Empirically competitive with ARC on most workloads, at much lower implementation cost.",
      "Patent-free.",
    ],
    cons: [
      "Has tuning parameters: the size ratio between A1in, Am, and A1out. Not adaptive.",
      "More moving parts than plain LRU — three lists vs one.",
      "If the workload is purely recency-driven (no scans), plain LRU does about as well with less code.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk a key from A1in to ghost to Am",
      body: "Click A. It lands in A1in. Click B, then C — A is pushed out of A1in and shows up dashed in A1out as a ghost. Now click A again. The status line says GHOST HIT — A is promoted directly into Am.",
    },
    {
      title: "02 · Watch a scan get absorbed",
      body: "Click **Reset**. Click A twice to plant it in A1in. Now scan: D, E, F, B. Watch A1in cycle through them while Am stays empty — none of the scan keys are accessed twice in time, so none of them earn promotion.",
    },
    {
      title: "03 · An A1in re-hit doesn't promote",
      body: "Click A, then immediately click A again. The status confirms 'HIT A1in (no reorder)'. 2Q-simplified only promotes via the ghost path — re-hits inside A1in are noted but don't move the key.",
    },
  ],

  code: {
    language: "typescript",
    filename: "two-q.ts",
    code: `// 2Q simplified: A1in (FIFO), Am (LRU), A1out (ghost set).
class TwoQ<K, V> {
  private a1in = new Map<K, V>();   // FIFO probation
  private am = new Map<K, V>();      // LRU main
  private a1out = new Set<K>();      // ghost
  constructor(
    private kIn: number,    // capacity of A1in
    private kOut: number,   // capacity of A1out (ghost)
    private kMain: number,  // capacity of Am
  ) {}

  get(key: K): V | undefined {
    if (this.am.has(key)) {
      const v = this.am.get(key)!;
      this.am.delete(key); this.am.set(key, v); // touch (LRU)
      return v;
    }
    if (this.a1in.has(key)) {
      return this.a1in.get(key)!; // do NOT promote on first re-hit
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.am.has(key) || this.a1in.has(key)) return; // already cached
    if (this.a1out.has(key)) {
      // Ghost hit: promote straight to Am
      this.a1out.delete(key);
      this.evictMainIfNeeded();
      this.am.set(key, value);
      return;
    }
    // Brand-new key -> A1in
    if (this.a1in.size >= this.kIn) {
      const oldest = this.a1in.keys().next().value!;
      this.a1in.delete(oldest);
      this.a1out.add(oldest);
      if (this.a1out.size > this.kOut) {
        const ghostOldest = this.a1out.values().next().value!;
        this.a1out.delete(ghostOldest);
      }
    }
    this.a1in.set(key, value);
  }

  private evictMainIfNeeded(): void {
    if (this.am.size >= this.kMain) {
      const oldest = this.am.keys().next().value!;
      this.am.delete(oldest);
    }
  }
}`,
  },

  furtherReading: [
    {
      label: "Johnson & Shasha (1994) — 2Q: A Low Overhead High Performance Buffer Management Replacement Algorithm",
      note: "The original VLDB paper. Tight, readable, full of numbers.",
    },
    {
      label: "MySQL Reference Manual — Buffer pool",
      note: "Documents the young/old sublist design — InnoDB's flavor of 2Q.",
    },
  ],

  quiz: [
    {
      id: "twoq-q1",
      question:
        "Why does 2Q resist scans better than LRU?",
      options: [
        { id: "a", label: "It uses larger cache slots." },
        { id: "b", label: "Scan keys are seen exactly once and never get promoted past the small probation queue, so they can't push out the proven-popular entries." },
        { id: "c", label: "It detects scans by analyzing access patterns." },
        { id: "d", label: "It uses random eviction." },
      ],
      correctOptionId: "b",
      explanation:
        "First-time accesses sit in A1in. Promotion to Am requires a **second** access — something a scan, by definition, never provides. So scan keys come in, get pushed out of A1in in FIFO order, and never touch the main LRU.",
    },
    {
      id: "twoq-q2",
      question: "What is the role of the A1out ghost list?",
      options: [
        { id: "a", label: "It stores the values of evicted keys." },
        { id: "b", label: "It remembers the keys (no values) recently evicted from A1in, so that a re-request can be promoted directly to Am as proven-popular." },
        { id: "c", label: "It is a write-through buffer." },
        { id: "d", label: "It is used for replication." },
      ],
      correctOptionId: "b",
      explanation:
        "A1out is metadata-only. A hit against a key in A1out is the signal 'this key was almost-popular' — it gets promoted into Am on its way back in.",
    },
    {
      id: "twoq-q3",
      question:
        "Which production system most prominently uses a 2Q-style policy?",
      options: [
        { id: "a", label: "Redis (the default policy)." },
        { id: "b", label: "MySQL InnoDB's buffer pool, with its young/old sublist split." },
        { id: "c", label: "Linux page reclaim." },
        { id: "d", label: "The Memcached binary protocol." },
      ],
      correctOptionId: "b",
      explanation:
        "InnoDB names its lists 'young' (Am) and 'old' (A1in) but the structure is recognizably 2Q. Linux uses a Clock variant; Redis defaults to LRU with random sampling.",
    },
  ],
};
