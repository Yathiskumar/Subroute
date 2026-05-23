import type { TopicContent } from "@/lib/content/types";

export const cacheEvictionTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**Cache eviction is the policy a cache uses to decide what to throw out when it runs out of room.** A cache is a small, fast store sitting in front of something larger and slower. Once it's full, every new entry has to push an old one out — and **which** one you push out is what makes or breaks the hit rate.",
    },
    {
      type: "p",
      text: "The goal is simple to state: keep the items most likely to be requested next, evict the rest. The hard part is predicting the future from the access pattern you've seen so far. Each algorithm is a different bet about what the past tells you about the future.",
    },
    {
      type: "p",
      text: "There are ten classic policies worth knowing. Some lean on **recency** (LRU, MRU, FIFO, Clock). Some lean on **frequency** (LFU). Some try to balance both (ARC, 2Q, LIRS). And a few intentionally ignore the access pattern (Random, TTL). Pick the wrong one and you spend most of your time fetching from the slow store — you have a cache in name only.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Why the policy choice matters" },
    {
      type: "ul",
      items: [
        "**Hit rate is everything** — a cache that hits 95% of the time is twenty times better than one that hits 50%. The eviction policy is the lever that moves that number.",
        "**Caches are finite by design** — RAM costs money, CPU caches are tiny, CDN edge nodes have hard disk caps. You will run out of room; the question is what you keep.",
        "**Wrong policy = thrashing** — if your policy evicts the hot keys, every request becomes a miss and the cache turns into pure overhead.",
        "**Workload-dependent** — there's no universal winner. A policy that crushes web traffic can lose to FIFO on a database scan workload.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Where eviction lives",
      text: "Operating systems use it for page caches (Linux uses a Clock-variant). Databases use it for buffer pools (Postgres uses Clock-Sweep, MySQL InnoDB uses a 2Q-like LRU). CDNs use it at every edge. Your CPU's L1/L2 caches use pseudo-LRU in hardware. Redis lets you pick the policy at runtime.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Algorithm",
      bursts: "Signal used",
      precision: "Hit rate",
      memory: "Overhead",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "LFU",
        bursts: "Frequency",
        precision: "Great for stable hotspots",
        memory: "O(1) — freq buckets",
        bestFor: "Long-tailed, skewed traffic",
      },
      {
        algorithm: "LRU",
        bursts: "Recency",
        precision: "Good on most workloads",
        memory: "O(1) — HashMap + DLL",
        bestFor: "General-purpose default",
      },
      {
        algorithm: "MRU",
        bursts: "Anti-recency",
        precision: "Crushes LRU on scans/loops",
        memory: "O(1) — HashMap + DLL",
        bestFor: "Sequential scans, looping workloads",
      },
      {
        algorithm: "FIFO",
        bursts: "Insertion order",
        precision: "Mediocre — ignores re-use",
        memory: "O(1) — single queue",
        bestFor: "Streaming, one-shot reads",
      },
      {
        algorithm: "Random",
        bursts: "None",
        precision: "Surprisingly close to LRU",
        memory: "O(1)",
        bestFor: "Embedded, hot loops, sampling",
      },
      {
        algorithm: "TTL",
        bursts: "Age",
        precision: "Depends on TTL choice",
        memory: "O(1) — expiry per key",
        bestFor: "Time-bounded data (DNS, sessions)",
      },
      {
        algorithm: "Clock",
        bursts: "Recency (approx)",
        precision: "≈ LRU, cheaper",
        memory: "O(N) — 1 bit/entry",
        bestFor: "OS page caches, hot paths",
      },
      {
        algorithm: "2Q",
        bursts: "Recency, two-tier",
        precision: "Better than LRU on scans",
        memory: "O(N) — two queues",
        bestFor: "Buffer pools that face scans",
      },
      {
        algorithm: "ARC",
        bursts: "Recency + frequency",
        precision: "Excellent, self-tuning",
        memory: "O(N) — 4 lists",
        bestFor: "Mixed workloads (ZFS, Postgres-adj)",
      },
      {
        algorithm: "LIRS",
        bursts: "Inter-reference recency",
        precision: "Beats LRU on weak-locality",
        memory: "O(N) — stack + queue",
        bestFor: "DB buffer pools, MySQL-like",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "Decision guide" },
    {
      type: "ul",
      items: [
        "**You don't know your workload yet** → **LRU**. Boring, well-understood, hard to beat without measurement.",
        "**A small set of keys is asked for much more often than the rest** → **LFU**. Frequency dominates recency for skewed traffic.",
        "**Sequential scans or loops larger than the cache** → **MRU**. The counter-intuitive opposite of LRU — drop what you just touched, because you won't come back to it for a while.",
        "**One-shot reads, streams, append-only logs** → **FIFO**. Re-use doesn't happen, so don't pay to track it.",
        "**You want LRU but in the OS kernel or a hot lock-free path** → **Clock**. One reference bit per page, no list shuffling on hits.",
        "**Big scans are wrecking your buffer pool's hit rate** → **2Q** or **LIRS**. Both protect frequently-used pages from being flushed by one-shot scans.",
        "**Mixed workload, you'd rather not tune** → **ARC**. Adapts the recency/frequency balance on the fly.",
        "**You need rock-bottom overhead and can tolerate noisy evictions** → **Random**. Try it before assuming it's bad.",
        "**Data has a natural lifetime** (DNS records, session cookies, OTP codes) → **TTL**. Eviction by clock, not by capacity.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "When in doubt, start with LRU and measure",
      text: "LRU is the default in nearly every cache library (Caffeine, Guava, Redis with `allkeys-lru`) for good reason. Get a baseline hit rate, then only swap in something fancier if the data shows you should.",
    },
  ],
};
