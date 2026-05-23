import type { ConceptContent } from "@/lib/content/types";

export const writeBack: ConceptContent = {
  prototypeCaption:
    "A 4-line write-back cache. Writes touch the cache only and mark the line **dirty** (yellow); memory stays untouched, showing the stale value with a strikethrough. The line flushes to memory only when something else evicts it. Hit **Demo** to watch three writes to `0x00` coalesce, then a conflicting write to `0x10` force a flush. **Saved mem writes** counts every store-write the policy avoided.",

  overview: [
    {
      type: "p",
      text: "Write-back — sometimes called write-behind — is the fast policy. **Writes hit the cache only.** The line is marked dirty, the call returns immediately, and the backing store is *not* updated yet. The store catches up later, when that line is evicted or when something explicitly flushes it.",
    },
    {
      type: "p",
      text: "The bet is that the same key will be written multiple times before it ever needs to be persisted. By holding the writes in cache, you collapse N updates into 1 store write — sometimes a massive win. The cost is a window during which the cache holds data the store doesn't. If you crash inside that window, that data is gone.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The dirty bit does the bookkeeping" },
    {
      type: "p",
      text: "Every cache line carries an extra bit: **dirty** (cache has been written and the store hasn't seen it yet) or **clean** (cache matches store).",
    },
    {
      type: "ol",
      items: [
        "**Write hits a cache line** — update the value in the cache, set `dirty = true`, return.",
        "**Write misses the cache** — usually paired with **write-allocate**: pull the line in from the store, then apply the write (and mark it dirty).",
        "**Read hits** — return the cached value, dirty or clean. The cache is always the authoritative source.",
        "**Eviction of a dirty line** — flush its value to the store, *then* drop the line. Eviction of a clean line is free.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "What you lose on a crash",
      text: "Every dirty line in the cache when the power dies is a write that never reached the store. CPU caches solve this with battery-backed RAM or by flushing on shutdown. Database buffer pools solve it by writing to a WAL **before** marking the page dirty, so recovery can replay the writes. Distributed write-back caches usually accept some loss in exchange for the throughput.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**The same key is written repeatedly** — CPU register spills, an in-memory counter, a hot session value. Coalescing wins big.",
        "**The backing store is slow or expensive** — remote disk, an API with rate limits, an OLAP warehouse. Trading durability for throughput is the right call.",
        "**You have a flush mechanism you trust** — a WAL, a checkpoint thread, a `sync()` boundary. Without one, write-back is just a way to lose data.",
        "**Single-writer or coherence-protocol workloads** — write-back across multiple writers requires a real protocol (MESI, MOESI) to keep them from disagreeing.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**Linux's page cache** is write-back. When you `write()` a file, the kernel updates pages in RAM and returns — disk doesn't see the data until later, or until `fsync()`. **CPU L1 data caches** are write-back, with MESI keeping cores coherent. **MySQL InnoDB's buffer pool** is write-back, paired with the redo log for crash recovery — the log is the durability story, the buffer pool is the throughput story.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Fast writes** — return at cache speed, not store speed.",
      "**Coalesces repeated writes** — writing the same key 100 times costs 1 store write on eventual flush.",
      "**Saves write bandwidth to the store** — huge win when the store is remote, networked, or rate-limited.",
      "**Reduces store contention** — fewer concurrent writers means fewer locks, fewer fsync stalls.",
    ],
    cons: [
      "**Data loss on crash** — every dirty line is at risk. Recovery requires a WAL or equivalent.",
      "**Complex eviction** — must flush dirty lines before dropping them; eviction is no longer free.",
      "**Multi-writer headaches** — without a coherence protocol, two caches with different dirty values of the same key will end up overwriting each other.",
      "**Hard to reason about consistency** — readers going straight to the store see stale data; you have to centralize reads through the cache or accept the staleness.",
    ],
  },

  handsOn: [
    {
      title: "01 · Write once, watch memory stay stale",
      body: "Pick `0x00`, set value to `99`, **Write**. The cache line goes dirty (yellow badge). On the right, memory still shows `A1` — with a strikethrough — because the store hasn't been touched. The Saved mem writes counter ticks: that's one store-write you didn't pay for.",
    },
    {
      title: "02 · Force a conflict flush",
      body: "Now write `0x10` (any value). Both `0x00` and `0x10` map to line 0 of this direct-mapped cache, so `0x00`'s dirty value has to flush to memory before `0x10` takes the slot. Watch the orange dot fire from the cache to memory — that's the deferred write finally landing.",
    },
    {
      title: "03 · Hammer the same key, see savings explode",
      body: "Click **Reset**. Write `0x04` ten times in a row with different values. Writes climbs to 10, Saved mem writes climbs to 10 — and memory still shows the original `B2`, untouched. Write-through would have hit memory 10 times. Write-back hit it zero.",
    },
  ],

  code: {
    language: "typescript",
    filename: "write-back.ts",
    code: `// Write-back cache: writes touch cache only, flush on evict.
// Dirty bit tracks "cache has a newer value than the store".
type Line<V> = { value: V; dirty: boolean };

class WriteBackCache<K, V> {
  private cache = new Map<K, Line<V>>();
  constructor(
    private capacity: number,
    private store: { get(k: K): V | undefined; put(k: K, v: V): void },
  ) {}

  get(key: K): V | undefined {
    if (this.cache.has(key)) return this.cache.get(key)!.value;
    const v = this.store.get(key);
    if (v !== undefined) this.admit(key, { value: v, dirty: false });
    return v;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      const line = this.cache.get(key)!;
      line.value = value;
      line.dirty = true;
      return;
    }
    // write-allocate: pull the line in (or just create it) and mark dirty
    this.admit(key, { value, dirty: true });
  }

  /** Explicit flush — call on shutdown, fsync, checkpoint. */
  flushAll(): void {
    for (const [k, line] of this.cache) {
      if (line.dirty) {
        this.store.put(k, line.value);
        line.dirty = false;
      }
    }
  }

  private admit(key: K, line: Line<V>) {
    if (this.cache.size >= this.capacity) {
      const [oldestK, oldestL] = this.cache.entries().next().value!;
      if (oldestL.dirty) this.store.put(oldestK, oldestL.value); // flush on evict
      this.cache.delete(oldestK);
    }
    this.cache.set(key, line);
  }
}`,
  },

  furtherReading: [
    {
      label: "MESI protocol — Wikipedia",
      note: "How CPU write-back caches stay coherent across cores. Required reading if you ever build a multi-writer cache.",
    },
    {
      label: "Linux kernel — Page cache and writeback",
      note: "The pdflush/bdi-writeback story. How dirty pages get reaped without blocking foreground writes.",
    },
    {
      label: "MySQL InnoDB — Buffer Pool and Doublewrite Buffer",
      note: "A production write-back implementation, with a WAL doing the durability work behind it.",
    },
  ],

  quiz: [
    {
      id: "wb-q1",
      question:
        "Under write-back, when does the backing store actually see a new write?",
      options: [
        { id: "a", label: "Immediately, in parallel with the cache update." },
        { id: "b", label: "When the dirty line is evicted, or on an explicit flush." },
        { id: "c", label: "Never — write-back is in-memory only." },
        { id: "d", label: "On the next read of that key." },
      ],
      correctOptionId: "b",
      explanation:
        "That's the whole point: the store update is deferred. Until eviction or an explicit flush, the dirty cache line is the only place the new value exists.",
    },
    {
      id: "wb-q2",
      question:
        "Why is write-back paired with a write-ahead log in databases like Postgres and MySQL?",
      options: [
        { id: "a", label: "The WAL replaces the cache." },
        { id: "b", label: "The WAL provides durability the write-back buffer pool lacks — a crash can replay log records to recover lost dirty pages." },
        { id: "c", label: "The WAL speeds up reads from the buffer pool." },
        { id: "d", label: "The WAL is required to maintain LRU order in the buffer pool." },
      ],
      correctOptionId: "b",
      explanation:
        "Write-back's weakness is the dirty-but-unflushed window. The WAL closes that gap: a transaction commit writes a log record durably, so even if the dirty buffer pool page is lost, recovery can rebuild it from the log.",
    },
    {
      id: "wb-q3",
      question:
        "A direct-mapped write-back cache holds a dirty line for `0x00`. A new write to `0x10` lands on the same cache line. What happens?",
      options: [
        { id: "a", label: "The write to `0x10` is rejected because the line is dirty." },
        { id: "b", label: "The dirty `0x00` line is flushed to memory first, then `0x10` takes the slot." },
        { id: "c", label: "Both values are stored in the same line." },
        { id: "d", label: "The cache silently discards the `0x00` update." },
      ],
      correctOptionId: "b",
      explanation:
        "Eviction of a dirty line in write-back must flush to the store before the line is overwritten. Otherwise the deferred update would be silently lost.",
    },
  ],
};
