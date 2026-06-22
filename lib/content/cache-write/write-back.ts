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

  codeSamples: [
    {
      label: "TypeScript",
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
    {
      label: "Java",
      language: "java",
      filename: "WriteBack.java",
      code: `import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

// Write-back cache: writes touch cache only, flush on evict.
// Dirty bit tracks "cache has a newer value than the store".
interface Store<K, V> {
    V get(K k);
    void put(K k, V v);
}

class Line<V> {
    V value;
    boolean dirty;
    Line(V value, boolean dirty) {
        this.value = value;
        this.dirty = dirty;
    }
}

class WriteBackCache<K, V> {
    // LinkedHashMap preserves insertion order, so the first entry is the oldest.
    private final Map<K, Line<V>> cache = new LinkedHashMap<>();
    private final int capacity;
    private final Store<K, V> store;

    WriteBackCache(int capacity, Store<K, V> store) {
        this.capacity = capacity;
        this.store = store;
    }

    V get(K key) {
        Line<V> line = cache.get(key);
        if (line != null) return line.value;
        V v = store.get(key);
        if (v != null) admit(key, new Line<>(v, false));
        return v;
    }

    void set(K key, V value) {
        Line<V> line = cache.get(key);
        if (line != null) {
            line.value = value;
            line.dirty = true;
            return;
        }
        // write-allocate: pull the line in (or just create it) and mark dirty
        admit(key, new Line<>(value, true));
    }

    /** Explicit flush — call on shutdown, fsync, checkpoint. */
    void flushAll() {
        for (Map.Entry<K, Line<V>> e : cache.entrySet()) {
            Line<V> line = e.getValue();
            if (line.dirty) {
                store.put(e.getKey(), line.value);
                line.dirty = false;
            }
        }
    }

    private void admit(K key, Line<V> line) {
        if (cache.size() >= capacity) {
            Iterator<Map.Entry<K, Line<V>>> it = cache.entrySet().iterator();
            Map.Entry<K, Line<V>> oldest = it.next();
            if (oldest.getValue().dirty) {
                store.put(oldest.getKey(), oldest.getValue().value); // flush on evict
            }
            it.remove();
        }
        cache.put(key, line);
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "write_back.py",
      code: `from collections import OrderedDict
from dataclasses import dataclass
from typing import Generic, Optional, Protocol, TypeVar

K = TypeVar("K")
V = TypeVar("V")


class Store(Protocol[K, V]):
    def get(self, k: K) -> Optional[V]: ...
    def put(self, k: K, v: V) -> None: ...


@dataclass
class Line(Generic[V]):
    value: V
    dirty: bool


class WriteBackCache(Generic[K, V]):
    """Write-back cache: writes touch cache only, flush on evict.

    Dirty bit tracks "cache has a newer value than the store".
    """

    def __init__(self, capacity: int, store: Store[K, V]) -> None:
        self.capacity = capacity
        self.store = store
        # OrderedDict preserves insertion order, so the first entry is the oldest.
        self.cache: "OrderedDict[K, Line[V]]" = OrderedDict()

    def get(self, key: K) -> Optional[V]:
        if key in self.cache:
            return self.cache[key].value
        v = self.store.get(key)
        if v is not None:
            self._admit(key, Line(value=v, dirty=False))
        return v

    def set(self, key: K, value: V) -> None:
        if key in self.cache:
            line = self.cache[key]
            line.value = value
            line.dirty = True
            return
        # write-allocate: pull the line in (or just create it) and mark dirty
        self._admit(key, Line(value=value, dirty=True))

    def flush_all(self) -> None:
        """Explicit flush — call on shutdown, fsync, checkpoint."""
        for k, line in self.cache.items():
            if line.dirty:
                self.store.put(k, line.value)
                line.dirty = False

    def _admit(self, key: K, line: "Line[V]") -> None:
        if len(self.cache) >= self.capacity:
            oldest_k, oldest_l = next(iter(self.cache.items()))
            if oldest_l.dirty:
                self.store.put(oldest_k, oldest_l.value)  # flush on evict
            del self.cache[oldest_k]
        self.cache[key] = line`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "write_back.cpp",
      code: `// Write-back cache: writes touch cache only, flush on evict.
// Dirty bit tracks "cache has a newer value than the store".
#include <list>
#include <optional>
#include <unordered_map>
#include <utility>

template <typename K, typename V>
struct Store {
    virtual std::optional<V> get(const K& k) = 0;
    virtual void put(const K& k, const V& v) = 0;
    virtual ~Store() = default;
};

template <typename V>
struct Line {
    V value;
    bool dirty;
};

template <typename K, typename V>
class WriteBackCache {
    int capacity_;
    Store<K, V>* store_;
    // order_ tracks insertion order so the front is the oldest line.
    std::list<K> order_;
    std::unordered_map<K, std::pair<Line<V>, typename std::list<K>::iterator>> cache_;

public:
    WriteBackCache(int capacity, Store<K, V>* store)
        : capacity_(capacity), store_(store) {}

    std::optional<V> get(const K& key) {
        auto it = cache_.find(key);
        if (it != cache_.end()) return it->second.first.value;
        std::optional<V> v = store_->get(key);
        if (v) admit(key, Line<V>{*v, false});
        return v;
    }

    void set(const K& key, const V& value) {
        auto it = cache_.find(key);
        if (it != cache_.end()) {
            it->second.first.value = value;
            it->second.first.dirty = true;
            return;
        }
        // write-allocate: pull the line in (or just create it) and mark dirty
        admit(key, Line<V>{value, true});
    }

    // Explicit flush — call on shutdown, fsync, checkpoint.
    void flushAll() {
        for (auto& [k, entry] : cache_) {
            if (entry.first.dirty) {
                store_->put(k, entry.first.value);
                entry.first.dirty = false;
            }
        }
    }

private:
    void admit(const K& key, const Line<V>& line) {
        if (static_cast<int>(cache_.size()) >= capacity_) {
            const K oldest = order_.front();
            auto& entry = cache_[oldest];
            if (entry.first.dirty) {
                store_->put(oldest, entry.first.value); // flush on evict
            }
            cache_.erase(oldest);
            order_.pop_front();
        }
        order_.push_back(key);
        cache_[key] = {line, std::prev(order_.end())};
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "MESI protocol — Wikipedia",
      href: "https://en.wikipedia.org/wiki/MESI_protocol",
      note: "How CPU write-back caches stay coherent across cores via the **Modified/Exclusive/Shared/Invalid** states. Required reading if you ever build a multi-writer cache.",
      kind: "article",
    },
    {
      label: "Linux kernel — VM writeback tunables (dirty_ratio, dirty_writeback_centisecs)",
      href: "https://www.kernel.org/doc/html/latest/admin-guide/sysctl/vm.html",
      note: "The knobs that govern when dirty page-cache pages get flushed to disk — the kernel's write-back policy made configurable.",
      kind: "docs",
    },
    {
      label: "MySQL InnoDB — Doublewrite Buffer",
      href: "https://dev.mysql.com/doc/refman/8.4/en/innodb-doublewrite-buffer.html",
      note: "How a production write-back buffer pool survives a torn page on crash; pairs with the redo log for durability.",
      kind: "docs",
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
