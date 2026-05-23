import type { ConceptContent } from "@/lib/content/types";

export const writeThrough: ConceptContent = {
  prototypeCaption:
    "A 4-line direct-mapped cache in front of 8 memory cells. Hit **Demo** to watch the canonical sequence, or pick an address, type a value and **Write** — both the cache line and the memory cell light up on every write. The stats prove the policy: Writes and Memory writes stay equal, forever. **Read** to see a cache hit save the trip; the cache still mirrors memory exactly.",

  overview: [
    {
      type: "p",
      text: "Write-through is the simplest write policy. **Every write goes to the cache AND the backing store, at the same time.** The cache and the store are always in lockstep — the cache is never holding data the store doesn't have.",
    },
    {
      type: "p",
      text: "It's the policy you reach for when the cache is an optimization, not a buffer. Reads can still hit the fast path. But writes are bound by the slow path, because they don't return until the store has confirmed the update.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Three steps, every write" },
    {
      type: "ol",
      items: [
        "**Write to the cache line** — update the value in the fast layer.",
        "**Write to the backing store** — propagate the same value down.",
        "**Acknowledge the write** — return to the caller only after the store has accepted it.",
      ],
    },
    {
      type: "p",
      text: "Because both layers carry the same value at all times, there's no notion of a 'dirty' line — every line is clean. Eviction is trivial: drop the entry, do nothing else, the store already has the canonical copy.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Write-allocate or no-write-allocate?",
      text: "On a write **miss**, you can either pull the line into the cache (write-allocate) or skip it (no-write-allocate). Write-through is most often paired with **no-write-allocate** — there's no point bringing a line in just to mirror what the store already has. Pair it with write-allocate only if you expect that key to be read back immediately.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Durability is non-negotiable** — payments, ledgers, audit logs, anywhere a lost write is a real incident.",
        "**Multi-reader workloads** — if other processes read directly from the store, you can't afford the cache to be ahead of it.",
        "**The store is fast enough** — local SSD, an in-process DB, or a write-optimized engine. The latency hit hurts less when the store isn't the bottleneck.",
        "**Read-heavy traffic** — writes are infrequent enough that paying full latency on each one doesn't dominate.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "Most CPU **L2/L3** caches in older designs were write-through to simplify cache-coherence between cores. The Postgres write-ahead log is logically write-through against the WAL file: every transaction commit waits for `fsync` before returning. Many CDN configurations are write-through against the origin so that a stale edge never lies to a client.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Crash-safe by construction** — the store is always authoritative. A power loss never costs you a write.",
      "**No dirty bookkeeping** — every cache line is clean, eviction is free.",
      "**Trivial consistency** — readers going straight to the store get the same value the cache would return.",
      "**Easy to reason about** — no flush queues, no write-back coalescing windows, no async durability ladder.",
    ],
    cons: [
      "**Slow writes** — every write blocks on the backing store. If the store is remote or slow, write latency suffers proportionally.",
      "**Wastes write bandwidth** — writing the same key 100 times costs 100 store writes, even though only the last value matters.",
      "**Pointless under write-around-able workloads** — if the data won't be re-read, you paid the store-write cost AND the cache-write cost for no benefit.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the two columns move together",
      body: "Open the simulator. Pick `0x00`, set value to `99`, hit **Write**. Watch both dots fire at once — one to the cache, one to memory. The Writes and Memory writes stats both tick up by 1. They will stay equal no matter what you do.",
    },
    {
      title: "02 · Read after write — confirm there's no drift",
      body: "After the write, hit **Read** on the same address. The cache answers (hit), and the value matches what memory shows on the right. Write-through guarantees this: cache and store carry the same value at all times.",
    },
    {
      title: "03 · Write the same key 5 times",
      body: "Pick one address, write 5 different values back-to-back. The Memory writes counter climbs to 5 — write-through paid the full memory-write cost on every single one, even though only the last value will ever be read.",
    },
  ],

  code: {
    language: "typescript",
    filename: "write-through.ts",
    code: `// Write-through cache: every write updates both layers.
// No dirty flag — lines are always in sync with the store.
class WriteThroughCache<K, V> {
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
    // 1. update cache (only if key is already cached — no-write-allocate)
    if (this.cache.has(key)) this.cache.set(key, value);
    // 2. always update the backing store, synchronously
    this.store.put(key, value);
  }

  private admit(key: K, value: V) {
    if (this.cache.size >= this.capacity) {
      // eviction is free — every line is clean
      const oldest = this.cache.keys().next().value!;
      this.cache.delete(oldest);
    }
    this.cache.set(key, value);
  }
}`,
  },

  furtherReading: [
    {
      label: "Patterson & Hennessy — Computer Organization and Design",
      note: "The canonical reference. Chapter 5 covers write-through vs write-back with the original tradeoff analysis.",
    },
    {
      label: "PostgreSQL — Reliability and the Write-Ahead Log",
      note: "Why durability-critical systems treat the WAL as write-through against persistent storage.",
    },
    {
      label: "AWS — Caching strategies (Cache-aside, Write-through, Write-back)",
      note: "Maps the policies onto common patterns in front of DynamoDB / RDS.",
    },
  ],

  quiz: [
    {
      id: "wt-q1",
      question:
        "Under write-through, when does a write to a cached key get acknowledged to the caller?",
      options: [
        { id: "a", label: "As soon as the cache line is updated." },
        { id: "b", label: "Only after the backing store has accepted the write." },
        { id: "c", label: "Only after the line is evicted from the cache." },
        { id: "d", label: "Asynchronously, on a background flush thread." },
      ],
      correctOptionId: "b",
      explanation:
        "Write-through requires the store to be updated synchronously. Returning before the store confirms would break the durability guarantee that's the whole point of choosing write-through.",
    },
    {
      id: "wt-q2",
      question:
        "Why does write-through have no concept of a 'dirty' cache line?",
      options: [
        { id: "a", label: "Because the cache only stores read data." },
        { id: "b", label: "Because every write propagates to the store immediately, so cache and store never disagree." },
        { id: "c", label: "Because eviction always cleans lines automatically." },
        { id: "d", label: "Because the dirty bit is set only in write-back caches with multi-level hierarchies." },
      ],
      correctOptionId: "b",
      explanation:
        "Dirty means 'cache has a newer value than the store'. Write-through never lets that state exist — both layers update together — so every line is clean by definition. Eviction becomes free.",
    },
    {
      id: "wt-q3",
      question:
        "Your workload writes the same hot key 100 times per second and the backing store is a remote database. What's the main cost of using write-through here?",
      options: [
        { id: "a", label: "The cache will become inconsistent." },
        { id: "b", label: "Every one of those 100 writes hits the database, even though only the last value matters." },
        { id: "c", label: "The cache will run out of dirty buffers." },
        { id: "d", label: "Reads to that key will start missing." },
      ],
      correctOptionId: "b",
      explanation:
        "Write-through can't coalesce. Each write makes the full round trip to the remote DB. Write-back's main appeal is collapsing repeated writes to the same key into a single flush on eviction.",
    },
  ],
};
