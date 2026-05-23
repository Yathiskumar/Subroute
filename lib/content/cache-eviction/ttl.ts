import type { ConceptContent } from "@/lib/content/types";

export const ttl: ConceptContent = {
  prototypeCaption:
    "Each item carries its own countdown. Set the TTL slider (3–15 s) **before** inserting, then click a letter to add it. The bar under each item drains in real time, then the item vanishes. Re-inserting a letter refreshes its timer — TTL is a freshness window, not a capacity cap.",

  overview: [
    {
      type: "p",
      text: "TTL — **Time To Live** — is the only policy on this list that doesn't care about access patterns or cache pressure at all. Every entry comes with an expiry timestamp. When the clock passes that timestamp, the entry is invalid: gone from the cache, regardless of capacity or recency.",
    },
    {
      type: "p",
      text: "TTL isn't really competing with LRU and friends — it's solving a different problem. The others answer 'I'm out of room, what should I drop?' TTL answers 'this data has a natural lifetime; don't serve it past that point.' DNS records, session tokens, OTP codes, signed URLs, and rate-limit counters all have intrinsic expiry — TTL is the right tool for all of them, and it's almost always combined with one of the others.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Two patterns: passive and active expiry" },
    {
      type: "p",
      text: "State per entry is `(value, expiresAt)`. There are two main strategies for actually evicting expired entries:",
    },
    {
      type: "ul",
      items: [
        "**Passive (lazy)** — check `expiresAt` on every read. If expired, treat as a miss and delete. This is cheap on writes but means expired entries can squat in memory indefinitely if no one reads them.",
        "**Active (sweep)** — a background scanner walks the cache periodically and deletes anything past its expiry. Bounds memory usage but adds CPU and lock churn.",
      ],
    },
    {
      type: "p",
      text: "Real systems use both at once. Redis, for example, does passive expiry on every access **and** runs a probabilistic active sampler 10 times a second to clean up entries that no one reads.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "TTL composes with other policies",
      text: "Almost every cache supports TTL alongside its main eviction policy. Redis has `allkeys-lru` and `volatile-lru` (only consider keys with a TTL). Caffeine has `expireAfterWrite` and `expireAfterAccess`. TTL is rarely **the** policy; it's a co-pilot.",
    },
    { type: "h", text: "expireAfterWrite vs expireAfterAccess" },
    {
      type: "ul",
      items: [
        "**expireAfterWrite** — the timer starts at insertion and never resets. Use for data with a hard freshness contract (DNS records, signed JWTs).",
        "**expireAfterAccess** — every read resets the timer. Use for session-like data where 'still being used' should keep it alive.",
      ],
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**DNS records** — the canonical TTL use case. Every record carries its own TTL in seconds.",
        "**Session tokens, OAuth refresh tokens, OTPs** — must be invalid past a known point.",
        "**Signed URLs and pre-signed credentials** — TTL must match the signature window.",
        "**Rate-limit counters** — the bucket itself needs to expire when the window rolls over.",
        "**As a freshness layer on top of LRU/LFU/etc.** — \"keep the popular keys, but never serve anything older than 30 minutes.\"",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "Redis lets you set a TTL on any key with `EXPIRE`. Internally, it stores expiries in a separate hash and uses lazy expiry on read plus an active sampler. Caffeine in Java offers `expireAfterWrite`, `expireAfterAccess`, and a custom `Expiry` for per-entry timers.",
    },
  ],

  tradeoffs: {
    pros: [
      "Matches the problem when data has a real lifetime — no other policy gets the semantics right.",
      "Predictable upper bound on staleness — easy to reason about and easy to communicate.",
      "Cheap when paired with passive (lazy) expiry — no background work needed.",
      "Composes with any other eviction policy.",
    ],
    cons: [
      "Doesn't bound memory by itself — without capacity-based eviction, an idle-but-not-expired cache can balloon.",
      "Active sweepers cost CPU and can contend with reads. Probabilistic sampling helps but isn't free.",
      "Hard freshness on the wrong data hurts hit rate: short TTLs flush hot entries that the workload would happily reuse.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch eviction by the clock",
      body: "Drag the slider to 3s. Click A. The countdown bar drains in real time and A disappears at 0 — no miss, no pressure, just time. That's eviction by clock.",
    },
    {
      title: "02 · Refresh the timer",
      body: "Set the slider to 10s. Click A. While the bar is mid-drain, click A again. The timer resets to a fresh 10s — re-inserting the same key with a TTL is how you tell the cache 'keep this alive'.",
    },
    {
      title: "03 · Mix different lifetimes",
      body: "Set 4s and click A. Bump the slider up to 12s and click B. Both share the same cache, but A vanishes long before B. TTL is per-item, not global — every key can have its own freshness contract.",
    },
  ],

  code: {
    language: "typescript",
    filename: "ttl.ts",
    code: `// TTL with lazy + active expiry. Compose with another policy
// for capacity-based eviction.
class TTLCache<K, V> {
  private store = new Map<K, { value: V; expiresAt: number }>();

  constructor(private defaultTtlMs: number) {
    // Active sweep: every 1s, drop a sample of expired keys.
    setInterval(() => this.activeSweep(), 1000);
  }

  set(key: K, value: V, ttlMs = this.defaultTtlMs): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key); // lazy expiry on read
      return undefined;
    }
    return entry.value;
  }

  private activeSweep(): void {
    const now = Date.now();
    // Sample a few random keys and evict those that expired.
    const keys = Array.from(this.store.keys());
    for (let i = 0; i < Math.min(20, keys.length); i++) {
      const k = keys[Math.floor(Math.random() * keys.length)];
      const entry = this.store.get(k);
      if (entry && now >= entry.expiresAt) this.store.delete(k);
    }
  }
}`,
  },

  furtherReading: [
    {
      label: "Redis — EXPIRE command (key expiry)",
      href: "https://redis.io/docs/latest/commands/expire/",
      note: "How Redis combines lazy expiry on access with a probabilistic active scanner.",
      kind: "docs",
    },
    {
      label: "Caffeine — Eviction (expiry policies)",
      href: "https://github.com/ben-manes/caffeine/wiki/Eviction",
      note: "Compares `expireAfterWrite`, `expireAfterAccess`, and custom `Expiry` semantics in detail.",
      kind: "docs",
    },
    {
      label: "RFC 1035 — Domain names: implementation and specification",
      href: "https://datatracker.ietf.org/doc/html/rfc1035",
      note: "The original spec defining per-record TTLs. Everything DNS-shaped follows this.",
      kind: "spec",
    },
  ],

  quiz: [
    {
      id: "ttl-q1",
      question:
        "What's the difference between 'lazy' and 'active' TTL expiry?",
      options: [
        { id: "a", label: "Lazy is faster; active is more accurate." },
        { id: "b", label: "Lazy deletes expired entries when they're read; active uses a background sweep to find and delete them regardless of access." },
        { id: "c", label: "Lazy is for read caches; active is for write caches." },
        { id: "d", label: "There is no difference — they are different names for the same thing." },
      ],
      correctOptionId: "b",
      explanation:
        "Lazy expiry is essentially free on writes and only kicks in on reads — but expired-and-unread entries can sit in memory forever. Active sweepers bound the staleness in memory but cost CPU. Production caches usually run both.",
    },
    {
      id: "ttl-q2",
      question:
        "Which scenario is the textbook fit for TTL eviction?",
      options: [
        { id: "a", label: "Caching the top 100 most-popular feed items." },
        { id: "b", label: "Caching DNS records, OAuth tokens, or signed URLs — data with an intrinsic lifetime." },
        { id: "c", label: "An L1 CPU cache." },
        { id: "d", label: "A buffer pool for a relational database." },
      ],
      correctOptionId: "b",
      explanation:
        "TTL is uniquely suited to data with a contract about freshness. DNS records carry TTLs in the protocol; OAuth tokens have explicit `exp` claims; signed URLs are valid for a specific window. Other policies don't model this concept.",
    },
    {
      id: "ttl-q3",
      question:
        "Why is TTL almost always combined with another eviction policy in production?",
      options: [
        { id: "a", label: "Because TTL has poor hit rates on its own." },
        { id: "b", label: "Because TTL alone doesn't bound memory — if entries don't expire fast enough, the cache can grow unbounded." },
        { id: "c", label: "Because TTL is single-threaded by design." },
        { id: "d", label: "Because TTL is patent-encumbered." },
      ],
      correctOptionId: "b",
      explanation:
        "TTL evicts by clock, not by pressure. If you're inserting faster than entries expire — or your TTLs are long — memory grows without bound. Pairing TTL with an LRU/LFU capacity cap covers both the freshness and the memory concerns.",
    },
  ],
};
