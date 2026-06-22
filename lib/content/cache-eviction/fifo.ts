import type { ConceptContent } from "@/lib/content/types";

export const fifo: ConceptContent = {
  prototypeCaption:
    "Capacity 4 — ordered by arrival, newest on the left. Re-accessing an entry does **nothing** to its position (the status line will literally say 'no reorder'). Only insertion can evict, and only the oldest arrival on the right gets dropped.",

  overview: [
    {
      type: "p",
      text: "FIFO — **First In, First Out** — is the simplest possible eviction policy. Whichever entry has been in the cache the longest is the one that gets evicted next. Accessing an entry doesn't change its eviction priority. There is no recency, no frequency — only age.",
    },
    {
      type: "p",
      text: "It's a single queue, a single counter, and a single pointer. The implementation is so small you can fit it in a tweet. The price for that simplicity is hit rate: on most workloads FIFO loses to LRU and LFU. But on certain workloads — streams, log replay, one-shot reads — it's actually the right tool.",
    },
  ],

  howItWorks: [
    { type: "h", text: "One queue, one decision" },
    {
      type: "p",
      text: "State is a queue (or a circular buffer) of entries in insertion order, plus a hash map for O(1) lookup. The algorithm:",
    },
    {
      type: "ol",
      items: [
        "**Get(key)** — look up the value in the map and return it. **The queue is not touched.**",
        "**Put(key, value)** — if the key is new, append it to the back of the queue and insert it in the map. If the cache is now over capacity, pop the front of the queue and remove it from the map.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Belady's anomaly",
      text: "FIFO has a strange property: **increasing the cache size can decrease the hit rate.** This is called Belady's anomaly and was discovered in 1969. LRU does not have this anomaly (it's a 'stack algorithm'). It's mostly a curiosity, but it's a sign that FIFO doesn't track the right signal.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Streaming or one-shot reads** — log replay, ETL pipelines, batch jobs. Re-use is rare, so spending CPU to track it is waste.",
        "**You need a hard cap on retention age** — FIFO is age-bounded by construction.",
        "**Hardware caches** at the lowest level — sometimes one bit of state and a circular pointer is all you can afford.",
        "**As a baseline** — implement FIFO first, measure your hit rate, **then** decide if LRU or LFU is worth the added complexity.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "The simplest possible policy — easy to implement, debug, and reason about.",
      "Zero bookkeeping on reads. No list shuffling, no counter increments. Trivially thread-safe.",
      "Predictable: every entry lives for exactly N evictions after insertion (where N is the cache size).",
    ],
    cons: [
      "Ignores access patterns entirely — a hot key is evicted at the same age as a cold one.",
      "Worse hit rate than LRU on virtually every realistic workload that has any reuse.",
      "Belady's anomaly — a bigger cache can perform worse than a smaller one on adversarial traces.",
    ],
  },

  handsOn: [
    {
      title: "01 · Confirm that reads do nothing",
      body: "Click A, B, C, D to fill. Now click A several times. Watch the row: A stays where it was, in the oldest slot. The status line confirms 'HIT (no reorder)'. Reads are pure look-ups in FIFO.",
    },
    {
      title: "02 · Evict the key you just hammered",
      body: "After step 1, click E. A is gone — the slot you were just hammering — because A was the oldest arrival. FIFO doesn't care how many times you touched it.",
    },
    {
      title: "03 · Compare to LRU mentally",
      body: "Run the same demo sequence A, B, C, D, A, E, B here, then in the LRU prototype. FIFO drops A; LRU keeps it. That gap — same workload, different victim — is FIFO's cost on any trace with re-use.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "fifo.ts",
      code: `// Map preserves insertion order in JS — perfect for FIFO.
// Critically, we do *not* re-insert on get.
class FIFO<K, V> {
  private store = new Map<K, V>();
  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    return this.store.get(key); // age unchanged
  }

  set(key: K, value: V): void {
    if (this.store.has(key)) {
      this.store.set(key, value); // value updated, age unchanged
      return;
    }
    this.store.set(key, value);
    if (this.store.size > this.capacity) {
      const oldest = this.store.keys().next().value!;
      this.store.delete(oldest);
    }
  }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "FifoCache.java",
      code: `import java.util.LinkedHashMap;

// LinkedHashMap keeps insertion order — perfect for FIFO.
// Critically, accessOrder stays false: we do *not* reorder on get.
class FifoCache<K, V> {
    private final LinkedHashMap<K, V> store = new LinkedHashMap<>();
    private final int capacity;

    FifoCache(int capacity) {
        this.capacity = capacity;
    }

    V get(K key) {
        return store.get(key); // age unchanged
    }

    void set(K key, V value) {
        if (store.containsKey(key)) {
            store.put(key, value); // value updated, age unchanged
            return;
        }
        store.put(key, value);
        if (store.size() > capacity) {
            K oldest = store.keySet().iterator().next();
            store.remove(oldest);
        }
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "fifo_cache.py",
      code: `from collections import OrderedDict
from typing import Optional


class FIFO:
    """OrderedDict keeps insertion order — perfect for FIFO.

    Critically, we do *not* move_to_end on get.
    """

    def __init__(self, capacity: int) -> None:
        self.store: OrderedDict = OrderedDict()
        self.capacity = capacity

    def get(self, key) -> Optional[object]:
        return self.store.get(key)  # age unchanged

    def set(self, key, value) -> None:
        if key in self.store:
            self.store[key] = value  # value updated, age unchanged
            return
        self.store[key] = value
        if len(self.store) > self.capacity:
            self.store.popitem(last=False)  # drop oldest arrival`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "fifo_cache.cpp",
      code: `// A queue of keys in arrival order + a hash map for O(1) lookup.
// Critically, we do *not* touch the queue on get.
#include <queue>
#include <unordered_map>
#include <optional>

template <class K, class V>
class FIFO {
    size_t capacity_;
    std::queue<K> order_;                 // arrival order, front = oldest
    std::unordered_map<K, V> store_;

public:
    explicit FIFO(size_t capacity) : capacity_(capacity) {}

    std::optional<V> get(const K& key) {
        auto it = store_.find(key);
        if (it == store_.end()) return std::nullopt; // age unchanged
        return it->second;
    }

    void set(const K& key, const V& value) {
        if (store_.count(key)) {
            store_[key] = value; // value updated, age unchanged
            return;
        }
        store_[key] = value;
        order_.push(key);
        if (store_.size() > capacity_) {
            store_.erase(order_.front()); // drop oldest arrival
            order_.pop();
        }
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Bélády, Nelson & Shedler (1969) — An anomaly in space-time characteristics of certain programs running in a paging machine",
      href: "https://dl.acm.org/doi/10.1145/363011.363155",
      note: "The original paper showing that adding cache slots can *hurt* FIFO's hit rate — now called Bélády's anomaly.",
      kind: "paper",
    },
    {
      label: "Wikipedia — Bélády's anomaly",
      href: "https://en.wikipedia.org/wiki/B%C3%A9l%C3%A1dy%27s_anomaly",
      note: "Concise explanation with a worked reference string where more frames cause more faults.",
      kind: "article",
    },
    {
      label: "Wikipedia — Cache replacement policies",
      href: "https://en.wikipedia.org/wiki/Cache_replacement_policies",
      note: "Comparison table of FIFO against LRU, LFU and everything else.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "fifo-q1",
      question:
        "What distinguishes FIFO from LRU in one sentence?",
      options: [
        { id: "a", label: "FIFO uses a hash map; LRU uses a tree." },
        { id: "b", label: "FIFO evicts by insertion age; LRU evicts by access recency." },
        { id: "c", label: "FIFO is faster than LRU on every workload." },
        { id: "d", label: "FIFO updates the queue on every read." },
      ],
      correctOptionId: "b",
      explanation:
        "In LRU, accessing an entry refreshes its eviction priority. In FIFO, accessing does nothing — the entry's position is fixed from the moment it was inserted.",
    },
    {
      id: "fifo-q2",
      question:
        "What is Belady's anomaly?",
      options: [
        { id: "a", label: "FIFO occasionally returns stale data after eviction." },
        { id: "b", label: "Increasing the cache size can decrease FIFO's hit rate on certain access traces." },
        { id: "c", label: "FIFO's worst case is O(N²)." },
        { id: "d", label: "FIFO cannot handle deletes." },
      ],
      correctOptionId: "b",
      explanation:
        "Belady, Nelson and Shedler showed in 1969 that for FIFO there exist access traces where a 4-slot cache outperforms a 5-slot one. LRU and other stack algorithms don't have this anomaly.",
    },
    {
      id: "fifo-q3",
      question:
        "FIFO cache, capacity 3. Trace: A, B, C, A, A, A, D. After D, which keys remain?",
      options: [
        { id: "a", label: "{A, C, D}" },
        { id: "b", label: "{B, C, D}" },
        { id: "c", label: "{A, B, D}" },
        { id: "d", label: "{A, C, B}" },
      ],
      correctOptionId: "b",
      explanation:
        "Reading A three more times doesn't move it in FIFO. The queue is still A(oldest), B, C, so D evicts A — leaving {B, C, D}.",
    },
  ],
};
