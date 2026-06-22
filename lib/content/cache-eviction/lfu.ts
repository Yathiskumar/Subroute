import type { ConceptContent } from "@/lib/content/types";

export const lfu: ConceptContent = {
  prototypeCaption:
    "Capacity 4. Each slot shows the key plus its access count (×N). The leftmost slot is the highest-frequency entry; the rightmost — lowest — is next to evict. Hit **Run demo** to see A pile up to ×3 while later one-time keys (B, C, D…) churn past it in the bottom slot.",

  overview: [
    {
      type: "p",
      text: "LFU — **Least Frequently Used** — evicts the entry that has been accessed the fewest times. The bet is different from LRU's: instead of betting that recent access predicts future access, LFU bets that **popular** keys stay popular.",
    },
    {
      type: "p",
      text: "It shines on skewed workloads — the classic 80/20 case where a small fraction of keys account for most of the traffic. CDN edge nodes, ad-serving caches, and DNS resolvers often look like this, and LFU keeps the popular keys pinned even when a flood of one-shot lookups goes through.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Count, then evict the smallest count" },
    {
      type: "p",
      text: "The state per entry is a tuple: `(key, value, frequency)`. The algorithm:",
    },
    {
      type: "ol",
      items: [
        "**Get(key)** — if found, increment its frequency counter and return the value.",
        "**Put(key, value)** — if the key exists, update the value and increment frequency. Otherwise insert with frequency 1.",
        "**Evict** — when over capacity, find the entry with the minimum frequency and remove it. Ties broken by least-recently-used among the lowest-frequency entries.",
      ],
    },
    { type: "h", text: "Getting to O(1)" },
    {
      type: "p",
      text: "A naive LFU scans for the min frequency on each eviction — that's O(N). The O(1) trick (Shi & al., 2010) is to maintain a **doubly-linked list of frequency buckets**, where each bucket contains all keys at that frequency, and a pointer to the current minimum bucket. Incrementing a frequency moves the key to the next bucket; eviction always comes from the head of the min bucket.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Old counts never decay",
      text: "Standard LFU has a serious flaw: once a key has been accessed a million times, its frequency stays at a million forever — even if it hasn't been touched in days. New popular keys can't displace stale ones. Production LFUs (Redis's `allkeys-lfu`, Caffeine's W-TinyLFU) add a **decay** term or use a probabilistic sketch to forget old counts.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Skewed access patterns** — a small percentage of keys account for the majority of requests (CDNs, search indexes, recommendation features).",
        "**Long-running caches** where frequency information accumulates into a useful signal.",
        "**When LRU is being defeated by scans** — LFU's hot keys survive scans because the scan keys never accumulate frequency.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "Redis offers `allkeys-lfu` (or `volatile-lfu` for keys with a TTL). It uses a 24-bit per-key counter with a probabilistic increment and a decay term, so old counts fade. It's measurably better than LRU on skewed workloads.",
    },
  ],

  tradeoffs: {
    pros: [
      "Excellent hit rate on workloads with stable, skewed popularity.",
      "Naturally scan-resistant — one-shot keys never build up enough frequency to displace hot keys.",
      "O(1) per operation is achievable with the frequency-bucket layout.",
    ],
    cons: [
      "Vintage popularity — without decay, yesterday's hot keys stay pinned forever.",
      "Cold-start penalty — a brand new genuinely-popular key starts at frequency 1 and is the next thing to be evicted.",
      "More bookkeeping per entry (a counter, a freq bucket pointer) than LRU's single linked-list position.",
    ],
  },

  handsOn: [
    {
      title: "01 · Build up a hot key",
      body: "Click A three times. The slot shows A×3 and pins to the leftmost position. Now click B, C, D — the cache fills, but A is far from the eviction edge. Click E: it evicts the ×1 entry on the right, not A.",
    },
    {
      title: "02 · Watch the lowest count die",
      body: "Click **Reset**, then build up A×3, B×2, C×1, D×1. Now click E. The prototype evicts a ×1 entry (the lowest-frequency slot). Click F — another ×1 goes. A stays untouched because its count dominates.",
    },
    {
      title: "03 · The frequency lock-in problem",
      body: "Hammer A maybe ten times to get A×10. Then stop using A entirely and click only B, C, D, E, F. A's slot never moves — even though no one is asking for it. This is why production LFU systems (Redis, Caffeine) add a decay term to old counters.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "lfu.ts",
      code: `// O(1) LFU sketch — frequency buckets keyed by count.
// Each bucket is an ordered set so we can break ties by recency.
class LFU<K, V> {
  private values = new Map<K, V>();
  private freq = new Map<K, number>();
  private buckets = new Map<number, Set<K>>(); // freq -> keys at that freq
  private minFreq = 0;

  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    if (!this.values.has(key)) return undefined;
    this.touch(key);
    return this.values.get(key);
  }

  set(key: K, value: V): void {
    if (this.capacity === 0) return;
    if (this.values.has(key)) {
      this.values.set(key, value);
      this.touch(key);
      return;
    }
    if (this.values.size >= this.capacity) this.evict();
    this.values.set(key, value);
    this.freq.set(key, 1);
    this.bucket(1).add(key);
    this.minFreq = 1;
  }

  private touch(key: K): void {
    const f = this.freq.get(key)!;
    this.bucket(f).delete(key);
    if (this.bucket(f).size === 0 && f === this.minFreq) this.minFreq++;
    this.freq.set(key, f + 1);
    this.bucket(f + 1).add(key);
  }

  private evict(): void {
    const victims = this.bucket(this.minFreq);
    const victim = victims.values().next().value!; // oldest at min freq
    victims.delete(victim);
    this.values.delete(victim);
    this.freq.delete(victim);
  }

  private bucket(f: number): Set<K> {
    if (!this.buckets.has(f)) this.buckets.set(f, new Set());
    return this.buckets.get(f)!;
  }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "LfuCache.java",
      code: `import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;

// O(1) LFU sketch — frequency buckets keyed by count.
// Each bucket is an ordered set (LinkedHashSet) so we break ties by recency.
class LfuCache<K, V> {
    private final Map<K, V> values = new HashMap<>();
    private final Map<K, Integer> freq = new HashMap<>();
    private final Map<Integer, LinkedHashSet<K>> buckets = new HashMap<>(); // freq -> keys
    private int minFreq = 0;
    private final int capacity;

    LfuCache(int capacity) {
        this.capacity = capacity;
    }

    V get(K key) {
        if (!values.containsKey(key)) return null;
        touch(key);
        return values.get(key);
    }

    void set(K key, V value) {
        if (capacity == 0) return;
        if (values.containsKey(key)) {
            values.put(key, value);
            touch(key);
            return;
        }
        if (values.size() >= capacity) evict();
        values.put(key, value);
        freq.put(key, 1);
        bucket(1).add(key);
        minFreq = 1;
    }

    private void touch(K key) {
        int f = freq.get(key);
        bucket(f).remove(key);
        if (bucket(f).isEmpty() && f == minFreq) minFreq++;
        freq.put(key, f + 1);
        bucket(f + 1).add(key);
    }

    private void evict() {
        LinkedHashSet<K> victims = bucket(minFreq);
        K victim = victims.iterator().next(); // oldest at min freq
        victims.remove(victim);
        values.remove(victim);
        freq.remove(victim);
    }

    private LinkedHashSet<K> bucket(int f) {
        return buckets.computeIfAbsent(f, k -> new LinkedHashSet<>());
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "lfu_cache.py",
      code: `from collections import OrderedDict, defaultdict
from typing import Optional


class LFU:
    """O(1) LFU sketch — frequency buckets keyed by count.

    Each bucket is an ordered set (OrderedDict) so we break ties by recency.
    """

    def __init__(self, capacity: int) -> None:
        self.capacity = capacity
        self.values: dict = {}
        self.freq: dict = {}
        # freq -> ordered keys at that freq
        self.buckets: defaultdict = defaultdict(OrderedDict)
        self.min_freq = 0

    def get(self, key) -> Optional[object]:
        if key not in self.values:
            return None
        self._touch(key)
        return self.values[key]

    def set(self, key, value) -> None:
        if self.capacity == 0:
            return
        if key in self.values:
            self.values[key] = value
            self._touch(key)
            return
        if len(self.values) >= self.capacity:
            self._evict()
        self.values[key] = value
        self.freq[key] = 1
        self.buckets[1][key] = True
        self.min_freq = 1

    def _touch(self, key) -> None:
        f = self.freq[key]
        del self.buckets[f][key]
        if not self.buckets[f] and f == self.min_freq:
            self.min_freq += 1
        self.freq[key] = f + 1
        self.buckets[f + 1][key] = True

    def _evict(self) -> None:
        victim, _ = self.buckets[self.min_freq].popitem(last=False)  # oldest at min freq
        del self.values[victim]
        del self.freq[victim]`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "lfu_cache.cpp",
      code: `// O(1) LFU sketch — frequency buckets keyed by count.
// Each bucket is a std::list so we can break ties by recency (front = oldest).
#include <list>
#include <unordered_map>
#include <optional>

template <class K, class V>
class LFU {
    size_t capacity_;
    int minFreq_ = 0;
    std::unordered_map<K, V> values_;
    std::unordered_map<K, int> freq_;
    std::unordered_map<int, std::list<K>> buckets_;                     // freq -> keys
    std::unordered_map<K, typename std::list<K>::iterator> position_;   // key -> node

public:
    explicit LFU(size_t capacity) : capacity_(capacity) {}

    std::optional<V> get(const K& key) {
        auto it = values_.find(key);
        if (it == values_.end()) return std::nullopt;
        touch(key);
        return it->second;
    }

    void set(const K& key, const V& value) {
        if (capacity_ == 0) return;
        if (values_.count(key)) {
            values_[key] = value;
            touch(key);
            return;
        }
        if (values_.size() >= capacity_) evict();
        values_[key] = value;
        freq_[key] = 1;
        buckets_[1].push_back(key);
        position_[key] = std::prev(buckets_[1].end());
        minFreq_ = 1;
    }

private:
    void touch(const K& key) {
        int f = freq_[key];
        buckets_[f].erase(position_[key]);
        if (buckets_[f].empty() && f == minFreq_) minFreq_++;
        freq_[key] = f + 1;
        buckets_[f + 1].push_back(key);
        position_[key] = std::prev(buckets_[f + 1].end());
    }

    void evict() {
        K victim = buckets_[minFreq_].front(); // oldest at min freq
        buckets_[minFreq_].pop_front();
        values_.erase(victim);
        freq_.erase(victim);
        position_.erase(victim);
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Shah, Mitra & Matani — An O(1) algorithm for implementing the LFU cache eviction scheme",
      href: "https://arxiv.org/abs/2110.11602",
      note: "The canonical write-up of the frequency-bucket trick that makes LFU `O(1)`.",
      kind: "paper",
    },
    {
      label: "Caffeine — Efficiency (Window TinyLFU)",
      href: "https://github.com/ben-manes/caffeine/wiki/Efficiency",
      note: "Modern hybrid that pairs a tiny LRU admission window with a frequency sketch — currently the state of the art.",
      kind: "docs",
    },
    {
      label: "Redis — Key eviction (LFU policy)",
      href: "https://redis.io/docs/latest/develop/reference/eviction/",
      note: "Practical write-up of the decaying Morris-counter approach Redis uses for `allkeys-lfu`.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Cache replacement policies",
      href: "https://en.wikipedia.org/wiki/Cache_replacement_policies",
      note: "Comparison table placing LFU against LRU, ARC, LIRS and the rest.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "lfu-q1",
      question:
        "On which workload does LFU most clearly beat LRU?",
      options: [
        { id: "a", label: "A short, bursty session with mostly unique keys." },
        { id: "b", label: "A skewed workload where 10% of keys serve 90% of requests, mixed with one-shot scans." },
        { id: "c", label: "A perfectly uniform random workload." },
        { id: "d", label: "A workload that fits entirely in the cache." },
      ],
      correctOptionId: "b",
      explanation:
        "LFU's frequency counter naturally keeps the hot 10% pinned while the one-shot keys (frequency 1) get evicted first. LRU would let the scan push the hot keys out.",
    },
    {
      id: "lfu-q2",
      question:
        "What is the classic flaw of vanilla LFU that production systems work around?",
      options: [
        { id: "a", label: "It can't be implemented in O(1)." },
        { id: "b", label: "Frequency counters never decay, so stale-but-formerly-popular keys are pinned forever." },
        { id: "c", label: "It uses too much memory per entry." },
        { id: "d", label: "It can't be made thread-safe." },
      ],
      correctOptionId: "b",
      explanation:
        "Without decay, a key that was hot last week stays pinned this week even if no one is asking for it. Redis, Caffeine, and Memcached all add some form of count decay or aging to address this.",
    },
    {
      id: "lfu-q3",
      question:
        "An LFU cache of size 3 sees: A, A, B, A, C, B, D. What happens on the D?",
      options: [
        { id: "a", label: "A is evicted." },
        { id: "b", label: "B is evicted." },
        { id: "c", label: "C is evicted." },
        { id: "d", label: "D is rejected because the cache is full." },
      ],
      correctOptionId: "c",
      explanation:
        "After A, A, B, A, C, B the frequencies are A=3, B=2, C=1. Inserting D requires evicting the lowest-frequency entry, which is C at 1.",
    },
  ],
};
