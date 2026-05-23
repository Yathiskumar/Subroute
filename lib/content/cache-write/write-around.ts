import type { ConceptContent } from "@/lib/content/types";

export const writeAround: ConceptContent = {
  prototypeCaption:
    "A 4-line cache reserved for reads only. Every write curves around the cache straight to memory along the violet arc — the cache stays cold for that address until something actually reads it. If the address *was* in the cache, the existing line is invalidated (red flash) so it can't return stale data. Hit **Demo** to watch reads populate the cache, a write invalidate the matching line, and cold writes leave the cache untouched.",

  overview: [
    {
      type: "p",
      text: "Write-around is the contrarian policy. **Every write bypasses the cache and goes straight to the backing store.** The cache is reserved for reads. The bet: most of what gets written won't get read back any time soon, so caching writes is wasted space.",
    },
    {
      type: "p",
      text: "The cache stays clean and small, holding only data that's actually being read. The cost: if a key gets written and then read soon after, that first read is a guaranteed miss — the cache never saw the write.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Writes skip the cache entirely" },
    {
      type: "ol",
      items: [
        "**Write any key** — go straight to the backing store. The cache is not touched.",
        "**If that key was already cached** — invalidate the existing line. Otherwise the cache would return a stale value on the next read.",
        "**Read miss** — load from the store, populate the cache, return.",
        "**Read hit** — return from cache. Reads behave like a normal read-only cache.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Invalidation is the subtle part",
      text: "If a write doesn't invalidate the matching cache line, the cache silently keeps serving the OLD value forever. Most production write-around implementations get this wrong at least once. The simulator flashes the invalidated line red on purpose — that step is where the policy lives or dies.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Write-once, read-rarely workloads** — log ingestion, telemetry, archival uploads, append-only audit trails. Most writes never get read at all.",
        "**Large blobs that would flush hot keys** — uploading a 10 MB file shouldn't push the small hot session keys out of the cache.",
        "**You already have a read-through cache and want to protect it from scan-like write patterns** — write-around keeps writes from polluting an LRU.",
        "**The write path is rare** — read:write ratio is 100:1 or higher. Why design the cache around the cold path?",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**CDN edge caches** are usually write-around against origin uploads: when you `PUT` to S3 via CloudFront, the edge invalidates any cached copy, the object lives on origin, and the next `GET` populates the cache. **Redis-in-front-of-Postgres** patterns often use write-around for bulk inserts: writes go straight to Postgres, the application invalidates affected keys in Redis, reads pull through. **CPU write-no-allocate** is the same idea at the silicon level — writes that miss the cache don't allocate a line.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Cache never pollutes** — only data that's been read lives in the cache, so the cache always reflects the read workload.",
      "**Big writes don't evict hot reads** — uploading 1 GB doesn't kick your session keys out.",
      "**Durability is safe** — the store is the only writer, so the cache can't hold dirty data the store doesn't have.",
      "**Simple to bolt on top of a read-through cache** — writes go straight to the source; the cache only sees reads.",
    ],
    cons: [
      "**First read after a write is always a miss** — if your workload has read-after-write patterns, write-around will hurt.",
      "**Invalidation is required** — without it, the cache serves stale values forever after a write.",
      "**No write-throughput help** — every write hits the store at full latency. Write-around is a *read* optimization, not a *write* optimization.",
      "**Doesn't protect the store** — write-back's coalescing benefit is gone; the store sees every write directly.",
    ],
  },

  handsOn: [
    {
      title: "01 · Read first, write second — see invalidation",
      body: "Pick `0x00`, hit **Read** — a cache miss, the value loads into line 0. Now write a new value to `0x00`. Watch the cache line flash red (invalidated) and disappear. Memory got the new value; the cache went cold for that key.",
    },
    {
      title: "02 · Write a key that was never read — cache untouched",
      body: "Pick `0x10` (or any other address), hit **Write**. The dot curves straight from CPU around the cache to memory. The cache lines on the left are unchanged — write-around protected them.",
    },
    {
      title: "03 · Compare to write-through's behavior",
      body: "In write-through, that same write would have allocated `0x10` into the cache. In write-around, the cache stays focused on what readers actually want. Open the write-through simulator in a second tab and run identical sequences to see the cache shape diverge.",
    },
  ],

  code: {
    language: "typescript",
    filename: "write-around.ts",
    code: `// Write-around: writes skip the cache, only reads populate it.
// Invalidation is mandatory — otherwise reads return stale values.
class WriteAroundCache<K, V> {
  private cache = new Map<K, V>();
  constructor(
    private capacity: number,
    private store: { get(k: K): V | undefined; put(k: K, v: V): void },
  ) {}

  get(key: K): V | undefined {
    if (this.cache.has(key)) return this.cache.get(key);
    const v = this.store.get(key);
    if (v !== undefined) this.admit(key, v);
    return v;
  }

  set(key: K, value: V): void {
    // Always write directly to the store...
    this.store.put(key, value);
    // ...and invalidate any cached copy. Skipping this step is the
    // most common bug in write-around implementations.
    this.cache.delete(key);
  }

  private admit(key: K, value: V) {
    if (this.cache.size >= this.capacity) {
      const oldest = this.cache.keys().next().value!;
      this.cache.delete(oldest);
    }
    this.cache.set(key, value);
  }
}`,
  },

  furtherReading: [
    {
      label: "AWS — Caching strategies (the cache-aside pattern)",
      note: "Walks through write-around in front of DynamoDB, including the invalidation gotchas.",
    },
    {
      label: "Cloudflare — Cache control and purging",
      note: "How a real CDN implements write-around at the edge, with explicit purge as the invalidation mechanism.",
    },
    {
      label: "Intel — Cache Allocation Technology overview",
      note: "How modern CPUs let you pick write-allocate vs no-write-allocate (write-around) per cache way.",
    },
  ],

  quiz: [
    {
      id: "wa-q1",
      question:
        "Under write-around, what happens to the cache on a write to a key that's already cached?",
      options: [
        { id: "a", label: "The cache line is updated in place." },
        { id: "b", label: "The cache line is invalidated — otherwise reads would return a stale value." },
        { id: "c", label: "The cache line is marked dirty." },
        { id: "d", label: "Nothing — the cache is completely untouched." },
      ],
      correctOptionId: "b",
      explanation:
        "If you wrote to the store but left the old value in the cache, the next read would happily return the stale cached value forever. Invalidation closes that hole; it's the most common bug in homegrown write-around implementations.",
    },
    {
      id: "wa-q2",
      question:
        "Which workload is the *worst* fit for write-around?",
      options: [
        { id: "a", label: "Telemetry ingestion where writes are 1000x more common than reads." },
        { id: "b", label: "An audit log written but almost never read." },
        { id: "c", label: "A session store where every login writes a key that's then read on every subsequent request." },
        { id: "d", label: "Large file uploads to object storage." },
      ],
      correctOptionId: "c",
      explanation:
        "Sessions are the read-after-write case write-around hates. The login write goes around the cache, so the first read (and possibly several reads, depending on traffic) is a guaranteed miss. Write-through or write-back would have served the cache directly.",
    },
    {
      id: "wa-q3",
      question:
        "Which problem does write-around solve that write-through does not?",
      options: [
        { id: "a", label: "Slow write latency." },
        { id: "b", label: "Crash recovery." },
        { id: "c", label: "Cache pollution from one-shot writes that won't be read back." },
        { id: "d", label: "Coalescing repeated writes." },
      ],
      correctOptionId: "c",
      explanation:
        "Write-through still pulls the written key into the cache, taking up a slot. Write-around's contribution is keeping that slot free for data that actual readers want. It does nothing for write latency (still hits the store) or for repeated-write coalescing (that's write-back's job).",
    },
  ],
};
