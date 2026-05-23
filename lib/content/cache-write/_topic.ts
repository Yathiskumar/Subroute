import type { TopicContent } from "@/lib/content/types";

export const cacheWriteTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**A cache write policy decides what happens when a write changes data that the cache holds in front of a slower store.** A cache is fast; the backing store (memory, disk, database, an upstream API) is slow. Reads are easy — the cache answers if it has the value, otherwise it loads from below. Writes are where the design choices live.",
    },
    {
      type: "p",
      text: "Three questions decide the policy. **Does the write update the cache?** **Does it update the backing store right now or later?** **And what happens on a write that misses the cache — do you allocate a cache line or skip it?** The three classic answers — write-through, write-back, and write-around — make different tradeoffs across durability, latency, throughput, and the staleness window between the two layers.",
    },
    {
      type: "p",
      text: "These policies show up at every layer of the stack: in your CPU's L1/L2/L3 caches, in OS page caches, in database buffer pools, in distributed caches like Redis sitting in front of Postgres, and in CDNs caching objects from origin. The names are the same. The tradeoffs are the same. Pick the wrong one and you either lose data on a crash, blow up your write latency, or watch your cache hit rate flatline.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Why the policy choice matters" },
    {
      type: "ul",
      items: [
        "**Write latency** — write-through forces every write to wait for the slow store; write-back lets writes finish at cache speed.",
        "**Crash safety** — write-back can lose every dirty line that hadn't been flushed yet; write-through never can.",
        "**Cache pollution** — writing data that won't be re-read for hours wastes a slot. Write-around fixes this by keeping write-only data out of the cache entirely.",
        "**Write traffic to the backing store** — write-back coalesces repeated writes to the same key into one flush; write-through hits the store on every single write.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Where these policies live in practice",
      text: "Modern CPUs use write-back for the L1 data cache (with cache-coherence protocols to keep dirty lines safe across cores). Linux's page cache is write-back, with `fsync()` forcing a flush. Postgres's WAL is essentially write-through for durability. Redis cache-aside patterns in front of a SQL DB often use write-around for big infrequently-read blobs.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Policy",
      bursts: "Where writes go",
      precision: "Crash safety",
      memory: "Write latency",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "Write-through",
        bursts: "Cache + store (both)",
        precision: "Safe — store is always current",
        memory: "Slow — bound by store",
        bestFor: "Durability-critical, read-heavy",
      },
      {
        algorithm: "Write-back",
        bursts: "Cache only, flush on evict",
        precision: "Risky — dirty lines lost on crash",
        memory: "Fast — cache speed",
        bestFor: "Write-heavy, hot keys, CPU caches",
      },
      {
        algorithm: "Write-around",
        bursts: "Store only, bypass cache",
        precision: "Safe — store is the only writer",
        memory: "Same as store write",
        bestFor: "Write-once, read-rarely workloads",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "Decision guide" },
    {
      type: "ul",
      items: [
        "**You can't afford to lose a single write** (payments, audit logs, financial ledgers) → **write-through**. The store is always authoritative.",
        "**The same key is written many times in quick succession** (CPU registers spilling, an in-memory counter, a hot session value) → **write-back**. Coalescing identical writes is a huge win.",
        "**Most writes never get read back** (log ingestion, telemetry, archival uploads) → **write-around**. Don't pollute the cache with cold data.",
        "**You're sitting in front of a remote, slow, or expensive backing store** (S3, an upstream API, an OLAP warehouse) → **write-back with periodic flush**, *if* you can tolerate the durability gap.",
        "**You need strong consistency between cache and store and have multiple readers** → **write-through**, or pair write-back with a coherence protocol (MESI for CPUs, invalidations for distributed caches).",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Write-allocate vs no-write-allocate is an orthogonal choice",
      text: "On a write **miss**, you can either pull the line into the cache first (write-allocate, usually paired with write-back) or skip it (no-write-allocate, usually paired with write-through). Don't confuse this with write-around — write-around bypasses the cache on *every* write, hit or miss.",
    },
  ],
};
