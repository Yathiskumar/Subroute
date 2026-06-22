import type { ConceptContent } from "@/lib/content/types";

export const lru: ConceptContent = {
  prototypeCaption:
    "Capacity 4. Letters A–F act as keys. Each click is an access — hits jump to the front (left = most recent); on a miss when full, the entry at the back (right = least recent) is the one that dies. Hit **Run demo** to watch A, B, C, D fill the cache, then A bump to the front, then E evict the now-oldest tail entry.",

  overview: [
    {
      type: "p",
      text: "LRU — **Least Recently Used** — is the default eviction policy for almost every cache in production. The idea is one sentence: when you need to evict, drop the entry that was accessed the longest time ago. The bet is that recently-touched items are likely to be touched again soon, and stale items are not.",
    },
    {
      type: "p",
      text: "It's the policy in `lru_cache` (Python), Caffeine, Guava, Redis's `allkeys-lru`, the Linux dentry cache, and most browser HTTP caches. It's well-understood, it performs well across a huge range of workloads, and it can be implemented in true O(1) per operation.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Two data structures, working together" },
    {
      type: "p",
      text: "A naive LRU is O(N) — to find the least-recently-used entry you scan the whole cache. The classic trick is to combine two structures:",
    },
    {
      type: "ul",
      items: [
        "**A hash map** from key → node, so lookups are O(1).",
        "**A doubly-linked list** of nodes in access order, so moving a node to the front and dropping the tail are both O(1).",
      ],
    },
    {
      type: "p",
      text: "The list is ordered most-recent at the head, least-recent at the tail. The algorithm is:",
    },
    {
      type: "ol",
      items: [
        "**Get(key)** — look up the node in the map. If found, move it to the head of the list and return its value. If not, return a miss.",
        "**Put(key, value)** — if the key exists, update its value and move to head. Otherwise, insert a new node at the head. If the cache is now over capacity, remove the tail node and delete it from the map.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Recency is a proxy, not the truth",
      text: "LRU works because recency is **usually** a decent predictor of future access. It fails when it isn't — e.g. a one-shot scan of a million keys will evict everything you care about, even though those keys will never be touched again. That's the scan-resistance problem that 2Q and LIRS exist to solve.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Any cache where you don't have a strong reason to pick something else.** It's the safe default.",
        "**Web/app caches** — request patterns are bursty and recency-correlated, which is exactly LRU's sweet spot.",
        "**CPU page caches** at the OS level — though most kernels actually use a Clock variant for cheaper bookkeeping.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "Redis under `maxmemory-policy allkeys-lru` evicts the least-recently-used key when memory fills up. It uses an **approximate** LRU (sampling 5 random keys and evicting the oldest of them) to avoid the bookkeeping cost of a strict linked list — close enough in practice, much cheaper.",
    },
  ],

  tradeoffs: {
    pros: [
      "True O(1) for get and put with the HashMap + DLL implementation.",
      "Great hit rate on most realistic workloads — bursty, recency-correlated traffic.",
      "Trivial to understand and explain, which means it's the policy people actually maintain correctly.",
      "Well-supported in every language's standard library.",
    ],
    cons: [
      "Scan-vulnerable — one big sequential read can flush the whole cache.",
      "Strict LRU bookkeeping (moving a node on every hit) is contended in multi-threaded code. Caffeine and the Linux kernel both use lock-free approximations.",
      "Doesn't distinguish a key accessed once from a key accessed a thousand times. Frequency information is lost.",
    ],
  },

  handsOn: [
    {
      title: "01 · Run the demo, watch the tail die",
      body: "Hit **Run demo**. A, B, C, D fill the row left-to-right. Then A is re-accessed and jumps to the front — pushing the back slot one step closer to eviction. When E finally arrives, look at which letter actually gets evicted: it's the one that wasn't refreshed.",
    },
    {
      title: "02 · Refresh by hand",
      body: "Click **Reset**. Fill the cache yourself: A, B, C, D. Now click the rightmost letter — watch it teleport to the front, and a totally different letter is suddenly next in line for eviction. Recency, not insertion order, decides who dies.",
    },
    {
      title: "03 · Thrash a working set bigger than the cache",
      body: "Click A, B, C, D, E, F in order, then repeat A, B, C, D, E, F again. The cache only holds 4. Every single access is a miss — the hit rate stat sits at 0%. This is LRU's failure mode when the working set doesn't fit.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "lru.ts",
      code: `// Classic O(1) LRU using a Map.
// In JS, Map preserves insertion order — we delete and re-set
// to push an entry to the "most recent" end. Two lines of code,
// no DLL needed.
class LRU<K, V> {
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
    if (this.store.has(key)) this.store.delete(key);
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
      filename: "LruCache.java",
      code: `import java.util.LinkedHashMap;
import java.util.Map;

// Classic O(1) LRU using LinkedHashMap.
// accessOrder=true reorders an entry to the "most recent" end on
// every get/put — and removeEldestEntry drops the oldest. No DLL needed.
class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    LruCache(int capacity) {
        super(16, 0.75f, true); // accessOrder = true
        this.capacity = capacity;
    }

    V get(Object key) {
        return super.get(key); // moves entry to most-recent
    }

    V set(K key, V value) {
        return super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity; // evict least-recent when over capacity
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "lru_cache.py",
      code: `from collections import OrderedDict
from typing import Optional


class LRU:
    """Classic O(1) LRU using an OrderedDict.

    move_to_end pushes an entry to the "most recent" end; popitem(last=False)
    drops the oldest. Two calls, no doubly-linked list needed.
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
            self.store.move_to_end(key)
        self.store[key] = value
        if len(self.store) > self.capacity:
            self.store.popitem(last=False)  # drop oldest`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "lru_cache.cpp",
      code: `// Classic O(1) LRU: a list in access order + a hash map of iterators.
// splice() moves a node to the "most recent" front; the back is oldest.
#include <list>
#include <unordered_map>
#include <optional>

template <class K, class V>
class LRU {
    size_t capacity_;
    std::list<std::pair<K, V>> order_;                                  // front = most-recent
    std::unordered_map<K, typename std::list<std::pair<K, V>>::iterator> index_;

public:
    explicit LRU(size_t capacity) : capacity_(capacity) {}

    std::optional<V> get(const K& key) {
        auto it = index_.find(key);
        if (it == index_.end()) return std::nullopt;
        order_.splice(order_.begin(), order_, it->second); // move to front
        return it->second->second;
    }

    void set(const K& key, const V& value) {
        auto it = index_.find(key);
        if (it != index_.end()) {
            it->second->second = value;
            order_.splice(order_.begin(), order_, it->second);
            return;
        }
        order_.emplace_front(key, value);
        index_[key] = order_.begin();
        if (index_.size() > capacity_) {
            index_.erase(order_.back().first); // drop oldest
            order_.pop_back();
        }
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "LeetCode 146 — LRU Cache",
      href: "https://leetcode.com/problems/lru-cache/",
      note: "The canonical interview implementation: `O(1)` `get`/`put` via hash map + doubly-linked list. Worth coding once from scratch.",
      kind: "article",
    },
    {
      label: "Redis — Key eviction (approximated LRU)",
      href: "https://redis.io/docs/latest/develop/reference/eviction/",
      note: "Explains the random-sampling approximation Redis uses instead of strict LRU, tuned via `maxmemory-samples`.",
      kind: "docs",
    },
    {
      label: "Caffeine — A high performance caching library",
      href: "https://github.com/ben-manes/caffeine",
      note: "Source and wiki for why strict LRU loses on concurrent workloads and what to do about it.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Cache replacement policies",
      href: "https://en.wikipedia.org/wiki/Cache_replacement_policies",
      note: "Side-by-side comparison of LRU against FIFO, LFU, ARC and others.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "lru-q1",
      question: "Which two data structures combine to give LRU O(1) get and put?",
      options: [
        { id: "a", label: "A binary heap and a hash set" },
        { id: "b", label: "A hash map and a doubly-linked list" },
        { id: "c", label: "A sorted array and a stack" },
        { id: "d", label: "A red-black tree alone" },
      ],
      correctOptionId: "b",
      explanation:
        "The hash map gives O(1) lookup by key; the doubly-linked list lets you move a node to the head or drop the tail in O(1). Every other combination is O(log N) or O(N) on at least one operation.",
    },
    {
      id: "lru-q2",
      question:
        "An LRU cache of size 3 starts empty. We access: A, B, C, A, D. Which key was evicted to make room for D?",
      options: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
        { id: "d", label: "Nothing — the cache wasn't full" },
      ],
      correctOptionId: "b",
      explanation:
        "After A, B, C the cache is full with order C(newest)→B→A(oldest). The access to A bumps it to newest: A→C→B. Inserting D evicts B, the least-recently-used.",
    },
    {
      id: "lru-q3",
      question:
        "Why is LRU considered scan-vulnerable?",
      options: [
        { id: "a", label: "Because scans bypass the cache entirely." },
        { id: "b", label: "Because a single sequential read of many one-shot keys evicts the entire hot working set." },
        { id: "c", label: "Because LRU cannot handle sequential keys." },
        { id: "d", label: "Because scans cause O(N) lookups." },
      ],
      correctOptionId: "b",
      explanation:
        "LRU treats every access equally, so a scan of N new keys promotes all of them to 'most recent' and pushes your hot keys out the back — even though those scan keys will never be read again.",
    },
  ],
};
