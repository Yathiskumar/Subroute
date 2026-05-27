import type { TopicContent } from "@/lib/content/types";

export const pageReplacementTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**A page replacement algorithm decides which page to throw out of memory when you need room for a new one.** Programs think they have a huge, continuous memory, but physical RAM is much smaller. The operating system keeps the pages a program is actually using in RAM and leaves the rest on disk. When a program touches a page that isn't in RAM — a **page fault** — the OS must load it. If every RAM frame is already full, something has to go. Choosing *what* goes is the whole problem.",
    },
    {
      type: "p",
      text: "The choice matters because the page you evict might be needed again in a moment. Guess wrong and you fault it right back in, paying for a slow disk read you could have avoided. Guess well and the pages still in memory are the ones the program keeps using. Every algorithm here is a different rule for making that guess.",
    },
    {
      type: "p",
      text: "The same idea appears in CPU caches, database buffer pools, CDN edge caches, and web caches — anywhere a small fast store fronts a big slow one. The names and units change, but the question never does: *the box is full and something new wants in; which old thing do you drop?*",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Where this shows up" },
    {
      type: "ul",
      items: [
        "**Virtual memory** — the original setting. The OS pages memory in and out of RAM; a bad policy means **thrashing**, where the machine spends all its time shuffling pages instead of running your program.",
        "**Database buffer pools** — PostgreSQL, MySQL/InnoDB, and Oracle all keep hot disk pages in RAM and need a replacement policy (often a Clock or LRU variant) to decide what to drop.",
        "**CPU caches** — L1/L2/L3 caches evict cache lines with hardware approximations of LRU; the cost of a miss is a slower memory level, not a disk.",
        "**Web & CDN caches** — Varnish, NGINX, and CDN edge nodes evict objects under memory pressure; LRU and LFU variants are everywhere.",
        "**Any tiered storage** — the moment a fast tier fills, you need a rule for what falls back to the slow tier. The algorithms are the same.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "The metric that matters",
      text: "Almost every policy is judged by one number: the **page-fault rate** (equivalently, the hit ratio) for a given amount of memory. Fewer faults means less time waiting on the slow tier. The prototypes here report exactly this so you can race the algorithms against the same reference string.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Algorithm",
      bursts: "Core rule",
      precision: "Fault rate",
      memory: "Cost / metadata",
      bestFor: "Best known for",
    },
    rows: [
      {
        algorithm: "FIFO",
        bursts: "Evict the oldest-loaded page",
        precision: "Poor — ignores usage",
        memory: "A queue; almost nothing",
        bestFor: "The simplest baseline (and Belady's anomaly)",
      },
      {
        algorithm: "Optimal",
        bursts: "Evict the page used furthest in the future",
        precision: "Best possible (lower bound)",
        memory: "Needs the future — unimplementable",
        bestFor: "The yardstick every real policy is measured against",
      },
      {
        algorithm: "LRU",
        bursts: "Evict the least-recently-used page",
        precision: "Excellent in practice",
        memory: "Recency order; expensive to track exactly",
        bestFor: "The gold-standard practical policy",
      },
      {
        algorithm: "Second Chance",
        bursts: "FIFO, but spare a page whose reference bit is set",
        precision: "Better than FIFO",
        memory: "FIFO queue + 1 bit per page",
        bestFor: "A cheap, easy upgrade over FIFO",
      },
      {
        algorithm: "Clock",
        bursts: "Second Chance as a circular buffer with a hand",
        precision: "Same as Second Chance, far cheaper",
        memory: "Ring + 1 bit per page; O(1) work",
        bestFor: "The LRU approximation real kernels actually ship",
      },
      {
        algorithm: "NRU",
        bursts: "Pick from the lowest (R, M) class",
        precision: "Coarse but cheap",
        memory: "2 bits per page + periodic tick",
        bestFor: "Respecting dirty pages with minimal bookkeeping",
      },
      {
        algorithm: "Aging",
        bursts: "Shift-register counters approximate recency",
        precision: "Very close to LRU",
        memory: "An n-bit counter per page",
        bestFor: "Software LRU approximation in fixed memory",
      },
      {
        algorithm: "LFU",
        bursts: "Evict the least-frequently-used page",
        precision: "Great for stable hot sets, bad for shifting ones",
        memory: "A counter per page",
        bestFor: "Workloads with a steady, popular core",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to pick" },
    {
      type: "ul",
      items: [
        "**Just measuring the best you could do** → **Optimal**. It can't be built (it needs the future), but it tells you how close any real policy gets.",
        "**You want the best realistic quality** → **LRU**. Recency is a strong signal. Exact LRU is costly, which is why the next few exist.",
        "**You need LRU's quality but cheaply** → **Clock** (or **Aging** in software). Clock is what most operating systems and database buffer pools actually run.",
        "**You're starting from FIFO and want an easy win** → **Second Chance**. One reference bit turns FIFO into something respectable; Clock is the same idea done efficiently.",
        "**Eviction cost depends on whether a page is dirty** → **NRU**. It prefers evicting clean pages so it doesn't have to write them back to disk.",
        "**Your hot set is stable and popularity is the real signal** → **LFU**. But watch for stale, once-popular pages that never leave — frequency without aging gets stuck in the past.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "It's one idea, refined",
      text: "Start at FIFO (age only). Optimal shows the ceiling. LRU uses recency to get near it. Second Chance and Clock approximate LRU with a single bit; NRU adds the dirty bit; Aging adds more bits for finer recency; LFU swaps recency for frequency. Learn them in that order and each one is just the previous with one problem fixed.",
    },
  ],
};
