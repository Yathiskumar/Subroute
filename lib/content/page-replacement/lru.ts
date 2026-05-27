import type { ConceptContent } from "@/lib/content/types";

export const lru: ConceptContent = {
  prototypeCaption:
    "Frames are kept **sorted by recency** — least-recently-used on the left (next to be evicted), most-recently-used on the right. Every hit slides its page to the right end; every fault loads at the right end and, if full, drops the left end. Step through and watch a reused page repeatedly rescue itself by jumping to the most-recent end.",

  overview: [
    {
      type: "p",
      text: "LRU — Least Recently Used — bets that **the recent past predicts the near future**. The page you haven't touched in the longest time is the one you're least likely to need soon, so evict that one. It's the practical workhorse of replacement policies and usually the first thing anyone reaches for.",
    },
    {
      type: "p",
      text: "The bet rests on **locality of reference**: real programs reuse the same pages over short windows — a loop's data, the current function's stack, the hot rows of a table. If a page hasn't been used in a while, the program has probably moved on. Recency is a cheap, surprisingly accurate stand-in for the future that Optimal needs.",
    },
    {
      type: "p",
      text: "Where FIFO orders pages by *arrival* and ignores use, LRU orders them by *last use*. That single change turns a weak baseline into a policy that often lands close to Optimal — and, unlike FIFO, never suffers Belady's anomaly.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The rule, step by step" },
    {
      type: "ol",
      items: [
        "**Page already in a frame?** Hit. Move it to the **most-recently-used** end — it just proved it's still wanted.",
        "**Not in memory, free frame available?** Load it at the most-recently-used end.",
        "**Not in memory, all frames full?** Evict the page at the **least-recently-used** end, then load the new page at the most-recent end.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Implementing it is the hard part",
      text: "The rule is simple; tracking it efficiently is not. Exact LRU needs to know the recency order at all times. Two classic approaches: (1) a **doubly-linked list + hash map** — O(1) to move a node to the front on every access, but a pointer update on *every* memory reference is expensive; (2) a **timestamp or counter per page**, updated on each access and scanned on eviction. Both add real cost to the hot path. That overhead is exactly why Clock, Aging, and friends exist — they *approximate* LRU for a fraction of the price.",
    },
    {
      type: "p",
      text: "LRU is a **stack algorithm**: the set of pages it keeps with N frames is always a subset of what it keeps with N+1. So adding memory can only help — no Belady's anomaly. Compare the **Sequential thrash** preset against the same string in the FIFO prototype to see the difference recency makes.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When LRU shines (and when it doesn't)" },
    {
      type: "ul",
      items: [
        "**Workloads with temporal locality** — loops, working sets, recently-accessed data that's likely to be accessed again. This is most real software, which is why LRU is the default mental model.",
        "**When you can afford the bookkeeping** — application-level caches (an in-memory key/value cache) can maintain an exact LRU list cheaply; that's harder at the OS/hardware level.",
        "**As the quality target** — even when you ship an approximation (Clock), you design and measure it against LRU.",
        "**Beware sequential scans** — one big linear pass over data you'll never revisit floods the cache and evicts your hot pages. This 'scan resistance' problem is what ARC, 2Q, and LIRS (see the Cache Eviction topic) were built to fix.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Where you'll see it",
      text: "Application and database caches lean on LRU and its variants constantly: Redis offers an `allkeys-lru` eviction policy (an approximate LRU that samples a few keys rather than maintaining a global order), and most database buffer managers use an LRU-flavored policy. At the OS and CPU-cache level, true LRU is too costly, so you'll find Clock and pseudo-LRU approximations instead.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Strong fault rates** — exploits locality, often near Optimal on real workloads.",
      "**No Belady's anomaly** — it's a stack algorithm; more memory never hurts.",
      "**Intuitive and predictable** — easy to reason about what's in the cache and why.",
      "**Well-studied** — decades of variants (2Q, ARC, LIRS) build on it for tricky workloads.",
    ],
    cons: [
      "**Expensive to track exactly** — a metadata update on every single access (list move or timestamp write).",
      "**Not scan-resistant** — a one-time linear scan can evict the entire hot set.",
      "**Recency ≠ frequency** — a page hit a hundred times then idle briefly can lose to a page touched once recently.",
      "**Approximations usually win in practice** — Clock gets most of LRU's quality for far less cost, so exact LRU is often not worth it at the OS level.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch a hit rescue a page",
      body: "Load the **Hot page** preset and step through. The frequently-referenced page keeps getting hit, and each hit slides it to the 'most recent' end — so it's never the leftmost (LRU) frame when an eviction happens. Contrast this with FIFO, which would evict it on schedule regardless.",
    },
    {
      title: "02 · See recency beat arrival order",
      body: "Run the **Sequential thrash** preset (1 2 3 4 repeating, 3 frames) in this prototype, then run the identical string in the FIFO prototype. Compare the page-fault totals. Then try **Working set fit**, where the reused set fits in memory and the fault rate drops sharply — locality rewarded.",
    },
    {
      title: "03 · Read the 'used @ step' labels",
      body: "Step through any preset and watch the small 'used @ step N' note under each frame. The leftmost frame always has the smallest step number — it's the least recently used, and it's the next to go. This is the single fact that defines LRU.",
    },
  ],

  code: {
    language: "typescript",
    filename: "lru.ts",
    code: `// Exact LRU with a Map (insertion order = recency order in JS Maps).
class LRU {
  private frames: number;
  private cache = new Map<number, true>(); // oldest entry first
  faults = 0;
  hits = 0;

  constructor(frames: number) { this.frames = frames; }

  access(page: number): "hit" | "fault" {
    if (this.cache.has(page)) {
      this.cache.delete(page);
      this.cache.set(page, true);          // re-insert => now most recent
      this.hits++;
      return "hit";
    }
    this.faults++;
    if (this.cache.size >= this.frames) {
      const lru = this.cache.keys().next().value!; // first key = least recent
      this.cache.delete(lru);                       // evict it
    }
    this.cache.set(page, true);            // load as most recent
    return "fault";
  }
}`,
  },

  furtherReading: [
    {
      label: "OSTEP — Beyond Physical Memory: Policies (Ch. 22)",
      href: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf",
      note: "Derives LRU from the principle of locality and shows how close it gets to Optimal — then motivates why kernels approximate it.",
      kind: "book",
    },
    {
      label: "Redis — Key eviction (LRU and LFU policies)",
      href: "https://redis.io/docs/latest/develop/reference/eviction/",
      note: "How a real system ships an *approximate* LRU by sampling keys instead of maintaining a global order, and why exact LRU was too costly.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Cache replacement policies: LRU",
      href: "https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)",
      note: "The doubly-linked-list + hash-map implementation and the data-structure tradeoffs behind exact LRU.",
      kind: "article",
    },
    {
      label: "Megiddo & Modha — ARC: A Self-Tuning Replacement Cache (2003)",
      href: "https://www.usenix.org/legacy/events/fast03/tech/full_papers/megiddo/megiddo.pdf",
      note: "The classic paper on fixing LRU's biggest weakness — scans — by balancing recency and frequency. Great context for LRU's limits.",
      kind: "paper",
    },
    {
      label: "LeetCode 146 — LRU Cache",
      href: "https://leetcode.com/problems/lru-cache/",
      note: "Implement an O(1) LRU yourself with a hash map and doubly-linked list — the canonical interview exercise that cements the data structure.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "pr-lru-q1",
      question: "What signal does LRU use to choose a victim?",
      options: [
        { id: "a", label: "How long ago the page was loaded (arrival order)." },
        { id: "b", label: "How long ago the page was last used (recency)." },
        { id: "c", label: "How many times the page has been used (frequency)." },
        { id: "d", label: "Whether the page is dirty." },
      ],
      correctOptionId: "b",
      explanation:
        "LRU evicts the page whose most recent use is furthest in the past, betting that locality means it won't be needed soon. That's different from FIFO (arrival order) and LFU (frequency).",
    },
    {
      id: "pr-lru-q2",
      question: "Why do real operating systems usually approximate LRU instead of implementing it exactly?",
      options: [
        { id: "a", label: "Exact LRU suffers from Belady's anomaly." },
        { id: "b", label: "Exact LRU requires updating recency metadata on every single memory access, which is too expensive on the hot path." },
        { id: "c", label: "Exact LRU can only handle one frame at a time." },
        { id: "d", label: "Exact LRU ignores locality." },
      ],
      correctOptionId: "b",
      explanation:
        "Maintaining a true recency order means a list move or timestamp write on every reference. At OS/hardware speed that overhead is prohibitive, so Clock and Aging approximate LRU for far less cost.",
    },
    {
      id: "pr-lru-q3",
      question: "Which workload is LRU notably bad at?",
      options: [
        { id: "a", label: "A tight loop whose working set fits in memory." },
        { id: "b", label: "A large one-time sequential scan over data that's never revisited." },
        { id: "c", label: "Repeatedly accessing a few hot pages." },
        { id: "d", label: "Any workload with strong temporal locality." },
      ],
      correctOptionId: "b",
      explanation:
        "A big sequential scan brings in pages you'll never touch again, and because they're 'most recent' they push out your genuinely hot pages. This lack of scan resistance is what ARC, 2Q, and LIRS were designed to fix.",
    },
  ],
};
