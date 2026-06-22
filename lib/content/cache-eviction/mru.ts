import type { ConceptContent } from "@/lib/content/types";

export const mru: ConceptContent = {
  prototypeCaption:
    "Capacity 4 — same layout as LRU, with the most recently used entry on the left. The twist: when the cache is full, that **front** (most recent) slot is the next one to die. Hit **Run demo** and watch the newest arrivals get evicted while older entries stick around.",

  overview: [
    {
      type: "p",
      text: "MRU — **Most Recently Used** — flips LRU on its head: when the cache is full, evict the entry that was accessed **most** recently. The bet is the opposite of LRU's: that the thing you just touched is the one you're least likely to need again soon.",
    },
    {
      type: "p",
      text: "It sounds absurd at first. Caching exists because of locality — recently-used data is usually re-used soon. MRU only makes sense when locality runs the other way: large sweeps, sequential scans, repeated full passes over a dataset bigger than the cache. In those workloads, LRU is the wrong policy, and MRU can hit nearly 100% on entries that LRU would miss entirely.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Same structure as LRU — opposite eviction end" },
    {
      type: "p",
      text: "Implementation-wise, MRU is just LRU with one line changed. The same HashMap + doubly-linked list works. On hit, you still move the entry to the head of the list. The only difference is **which end you evict from**:",
    },
    {
      type: "ol",
      items: [
        "**Get(key)** — look up in the map. Move the node to the head of the list. Return the value.",
        "**Put(key, value)** — insert at the head. If over capacity, evict **the head's previous neighbour** (the most-recently-used entry that isn't the new arrival).",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "The classic MRU win: loop bigger than cache",
      text: "Cache size 3, loop A, B, C, D, A, B, C, D... With LRU, every access is a miss — by the time you come back to A, it's been evicted. With MRU, you keep three of the four entries permanently and get a 75% hit rate. The intuition flips because the **next** access is always the one furthest in the future of the loop.",
    },
    { type: "h", text: "When MRU is the right bet" },
    {
      type: "p",
      text: "MRU wins exactly when the access pattern has **anti-locality** — re-access is unlikely for what you just used. The textbook case is a database join scanning a relation in order: once you've finished reading row N, you're moving to N+1, not back to N. LRU keeps the rows you've already passed; MRU keeps the rows you haven't reached yet.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Sequential scans larger than the cache** — database joins, sorted-merge operations, full-table reads.",
        "**Repeated full-loop workloads** — your workload reads A, B, C, D, A, B, C, D... and the loop is larger than your cache.",
        "**Streaming with anti-locality** — workloads where 'just used' is a strong negative signal for future use.",
        "**As a niche tier in a hybrid cache** — combined with LRU for general traffic, MRU for known scan ranges.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "MRU shows up most often inside database query engines — not as the top-level buffer pool policy, but for specific operators. PostgreSQL's `Sort` and `Hash Join` choose buffer-replacement strategies operator by operator: a sequential scan uses a ring buffer (MRU-like) to avoid polluting the shared buffer pool. Oracle has documented MRU buffer eviction for full scans.",
    },
  ],

  tradeoffs: {
    pros: [
      "Crushes LRU on loop/scan workloads larger than the cache — can go from 0% hit rate to near-100%.",
      "Same O(1) implementation as LRU — just swap the eviction end. No new data structures.",
      "Trivial to combine with LRU as two halves of a hybrid cache, segmented by workload type.",
    ],
    cons: [
      "Disastrous on normal recency-correlated traffic — it evicts exactly the items you'd want to keep.",
      "Niche by nature. If your workload isn't a scan, MRU is the wrong answer, full stop.",
      "Almost never a sensible default for a general-purpose cache — you need to know your access pattern.",
    ],
  },

  handsOn: [
    {
      title: "01 · See the newest slot die",
      body: "Click A, B, C, D to fill the cache. Now click E. Look at which slot vanished: it's D, the **most recent** arrival — not A. The opposite of LRU.",
    },
    {
      title: "02 · A hit makes you the next victim",
      body: "Click **Reset**. Click A, B, C, D, then click A again — A jumps to the front. Now click E. A is evicted, even though three letters were older. Touching something under MRU is what kills it.",
    },
    {
      title: "03 · The loop that makes MRU shine",
      body: "Reset. Click A, B, C, D — cache full. Now click A — it bumps to front. Click E — A dies. Click A — miss, A returns and bumps the front. Repeat. With anti-locality (you never re-read what you just touched), MRU keeps the older entries instead of churning them.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "mru.ts",
      code: `// MRU: same as LRU, but evict from the most-recent end.
// In JS, Map preserves insertion order — last key in is the
// most-recently-used. Drop *that* on overflow.
class MRU<K, V> {
  private store = new Map<K, V>();
  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    if (!this.store.has(key)) return undefined;
    const value = this.store.get(key)!;
    this.store.delete(key);
    this.store.set(key, value); // re-insert as most-recent
    return value;
  }

  set(key: K, value: V): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.capacity) {
      // Evict the most-recently-used: the last key currently in the map.
      // We have to walk to the end since Map has no "last" accessor.
      let lastKey: K | undefined;
      for (const k of this.store.keys()) lastKey = k;
      if (lastKey !== undefined) this.store.delete(lastKey);
    }
    this.store.set(key, value);
  }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "MruCache.java",
      code: `import java.util.LinkedHashMap;

// MRU: same as LRU, but evict from the most-recent end.
// LinkedHashMap preserves access order — last key in is the
// most-recently-used. Drop *that* on overflow.
class MruCache<K, V> {
    private final LinkedHashMap<K, V> store = new LinkedHashMap<>(16, 0.75f, true);
    private final int capacity;

    MruCache(int capacity) {
        this.capacity = capacity;
    }

    V get(K key) {
        return store.get(key); // accessOrder moves it to most-recent
    }

    void set(K key, V value) {
        if (store.containsKey(key)) {
            store.remove(key);
        } else if (store.size() >= capacity) {
            // Evict the most-recently-used: the last key in iteration order.
            // We have to walk to the end since there is no "last" accessor.
            K lastKey = null;
            for (K k : store.keySet()) lastKey = k;
            if (lastKey != null) store.remove(lastKey);
        }
        store.put(key, value);
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "mru_cache.py",
      code: `from collections import OrderedDict
from typing import Optional


class MRU:
    """MRU: same as LRU, but evict from the most-recent end.

    OrderedDict preserves insertion order — the last key in is the
    most-recently-used. Drop *that* on overflow.
    """

    def __init__(self, capacity: int) -> None:
        self.store: OrderedDict = OrderedDict()
        self.capacity = capacity

    def get(self, key) -> Optional[object]:
        if key not in self.store:
            return None
        self.store.move_to_end(key)  # re-insert as most-recent
        return self.store[key]

    def set(self, key, value) -> None:
        if key in self.store:
            del self.store[key]
        elif len(self.store) >= self.capacity:
            # Evict the most-recently-used: the last key in the ordering.
            self.store.popitem(last=True)
        self.store[key] = value`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "mru_cache.cpp",
      code: `// MRU: same as LRU, but evict from the most-recent end.
// A list in access order (front = most-recent) + a hash map of iterators.
#include <list>
#include <unordered_map>
#include <optional>

template <class K, class V>
class MRU {
    size_t capacity_;
    std::list<std::pair<K, V>> order_;                                 // front = most-recent
    std::unordered_map<K, typename std::list<std::pair<K, V>>::iterator> index_;

public:
    explicit MRU(size_t capacity) : capacity_(capacity) {}

    std::optional<V> get(const K& key) {
        auto it = index_.find(key);
        if (it == index_.end()) return std::nullopt;
        order_.splice(order_.begin(), order_, it->second); // move to front
        return it->second->second;
    }

    void set(const K& key, const V& value) {
        auto it = index_.find(key);
        if (it != index_.end()) {
            order_.erase(it->second);
            index_.erase(it);
        } else if (index_.size() >= capacity_) {
            // Evict the most-recently-used: the front of the list.
            index_.erase(order_.front().first);
            order_.pop_front();
        }
        order_.emplace_front(key, value);
        index_[key] = order_.begin();
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Chou & DeWitt (1985) — An Evaluation of Buffer Management Strategies for Relational Database Systems",
      href: "https://www.cs.cmu.edu/~natassa/courses/15-721/papers/P127.PDF",
      note: "The classic VLDB paper showing MRU beats LRU for sequential and looping scans inside a database engine.",
      kind: "paper",
    },
    {
      label: "PostgreSQL source — src/backend/storage/buffer/freelist.c (ring buffers)",
      href: "https://github.com/postgres/postgres/blob/master/src/backend/storage/buffer/freelist.c",
      note: "How Postgres uses MRU-like ring buffers for sequential scans to keep them from polluting the shared buffer pool.",
      kind: "docs",
    },
    {
      label: "Oracle — Tuning the Database Buffer Cache",
      href: "https://docs.oracle.com/en/database/oracle/oracle-database/18/tgdba/tuning-database-buffer-cache.html",
      note: "Documents how full table scans put blocks at the LRU end — a real-world counter-example to 'always LRU'.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "mru-q1",
      question: "When does MRU beat LRU on hit rate?",
      options: [
        { id: "a", label: "On any workload where requests are random." },
        { id: "b", label: "When the workload is a sequential or looping scan over a dataset larger than the cache — anti-locality." },
        { id: "c", label: "When the cache is much larger than the working set." },
        { id: "d", label: "Never — LRU is mathematically optimal." },
      ],
      correctOptionId: "b",
      explanation:
        "MRU only wins when 'just used' is a negative predictor of 'used again soon'. The canonical case is a full-loop scan: by the time you come back to the start, LRU has just thrown those entries away. MRU keeps them.",
    },
    {
      id: "mru-q2",
      question:
        "An MRU cache of size 3 starts empty. We access: A, B, C, D, A. After the access to D and then A, which keys remain in the cache?",
      options: [
        { id: "a", label: "{B, C, D}" },
        { id: "b", label: "{A, B, C}" },
        { id: "c", label: "{A, B, D}" },
        { id: "d", label: "{A, C, D}" },
      ],
      correctOptionId: "c",
      explanation:
        "After A, B, C the cache is full: oldest→A, B, C(newest). Inserting D evicts C (most-recent) → {A, B, D}. Then accessing A makes A the new most-recent. With no insertion happening on this access, no eviction occurs — the cache is still {A, B, D}.",
    },
    {
      id: "mru-q3",
      question:
        "Why do database query engines sometimes use MRU-like ring buffers for full table scans?",
      options: [
        { id: "a", label: "Because MRU is faster than LRU at the instruction level." },
        { id: "b", label: "Because a scan won't re-read what it just read, so keeping recent pages wastes cache space that could protect hot pages elsewhere." },
        { id: "c", label: "Because MRU uses less memory than LRU." },
        { id: "d", label: "Because MRU avoids lock contention." },
      ],
      correctOptionId: "b",
      explanation:
        "A sequential scan reads each page exactly once. If the scan promoted every page to 'most recent' under LRU, the rest of the buffer pool would be flushed by data the scan will never re-read. Using a small MRU-style ring buffer keeps the scan from polluting the main cache.",
    },
  ],
};
