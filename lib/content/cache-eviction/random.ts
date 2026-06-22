import type { ConceptContent } from "@/lib/content/types";

export const random: ConceptContent = {
  prototypeCaption:
    "Capacity 4. When the cache is full and a miss arrives, a spinner cycles through the slots before landing on a random victim. No bookkeeping, no list shuffling — just luck. Hit **Run demo** twice: you'll get different evictions each time, and surprisingly similar hit rates.",

  overview: [
    {
      type: "p",
      text: "Random replacement is exactly what it sounds like: when you need to evict, pick a random entry and drop it. There is no tracking of recency, frequency, or age. There is no list to maintain. The only state is the set of cached entries.",
    },
    {
      type: "p",
      text: "It's the policy people assume must be terrible — and then they measure it. On many realistic workloads, random eviction lands within a few percentage points of LRU. CPU caches have used pseudo-random policies for decades for precisely this reason: the implementation cost is zero, and the hit-rate loss is small.",
    },
  ],

  howItWorks: [
    { type: "h", text: "There is no algorithm" },
    {
      type: "p",
      text: "State: a set or hash map of entries. On insert, if the cache is over capacity, pick a uniformly random entry and remove it. That's the whole policy.",
    },
    {
      type: "ol",
      items: [
        "**Get(key)** — look up in the map. Return value or miss. No bookkeeping.",
        "**Put(key, value)** — insert. If size > capacity, pick a random victim and delete.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Pseudo-random is usually enough",
      text: "CPU caches use 'pseudo-LRU' or true-random bits derived from a lightweight LFSR — anything that isn't easily predictable. The randomness doesn't need to be cryptographic; it just needs to be uncorrelated with the access pattern.",
    },
    { type: "h", text: "Why it isn't a disaster" },
    {
      type: "p",
      text: "If 80% of your cache holds the hot working set, then a random eviction has an 80% chance of evicting a hot key — bad! But here's the rescue: most workloads have **re-references**. The next time the evicted hot key is asked for, it'll be reloaded, and now it's protected from the very next random eviction (which is statistically more likely to land on cold data again). The error self-corrects.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Embedded systems and CPU caches** — when even one extra metadata byte per line is unacceptable.",
        "**High-contention paths** — no per-entry state means no contended writes.",
        "**Memcached's sampling fallback** — Memcached samples a few random items and evicts the oldest among them. With sample size 1, that's pure random; with larger samples, it approaches LRU.",
        "**As a sanity baseline** — if your fancy policy isn't measurably beating random, your fancy policy isn't pulling its weight.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "Many x86 CPUs use pseudo-LRU, but ARM and several POWER chips use pure random replacement in their L2/L3 caches. Redis can also approximate LRU by random sampling — the `maxmemory-samples 5` knob means 'pick 5 at random, evict the oldest'.",
    },
  ],

  tradeoffs: {
    pros: [
      "Zero bookkeeping — no list, no counter, no timestamp.",
      "Trivially thread-safe — no shared mutable state on reads.",
      "Surprisingly competitive on realistic workloads, often within 5-10% of LRU's hit rate.",
      "Hardware-friendly — pseudo-random victim selection is a single LFSR step.",
    ],
    cons: [
      "No protection for hot keys — they're evicted at the same rate as cold ones.",
      "Variance: two runs of the same trace give different hit rates. Painful for reproducible benchmarks.",
      "Easy to beat for the cost of a tiny bit of metadata. If you can afford LRU's overhead, LRU wins outright.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the spinner pick a loser",
      body: "Click A, B, C, D to fill the cache. Now click E — the spinner lights up each slot in sequence, slows down, and lands on a random one. The evicted letter is whoever was unlucky.",
    },
    {
      title: "02 · Run the demo twice and compare",
      body: "Hit **Run demo**, note the hit count and which keys ended up in the cache. Reset and run it again. Different victims, different final cache state, and yet a similar hit rate — that's the surprising part.",
    },
    {
      title: "03 · A hot key can still be evicted",
      body: "Click A five times — it's now your hottest key. Click B, C, D, then trigger a miss with E. There's still a 25% chance A is the victim. Random doesn't protect hot keys; the workload has to do that by re-asking for them.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "random.ts",
      code: `// True random replacement. Stupidly simple, surprisingly effective.
class RandomCache<K, V> {
  private store = new Map<K, V>();
  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    return this.store.get(key);
  }

  set(key: K, value: V): void {
    if (!this.store.has(key) && this.store.size >= this.capacity) {
      // Pick a random key and evict it.
      const keys = Array.from(this.store.keys());
      const victim = keys[Math.floor(Math.random() * keys.length)];
      this.store.delete(victim);
    }
    this.store.set(key, value);
  }
}

// Redis-style "sample N, evict oldest of N" — random as N -> 1,
// approaches LRU as N -> cache size.
class SampledLRU<K, V> {
  private store = new Map<K, { value: V; lastUsed: number }>();
  private clock = 0;
  constructor(private capacity: number, private samples = 5) {}

  set(key: K, value: V): void {
    if (!this.store.has(key) && this.store.size >= this.capacity) {
      const keys = Array.from(this.store.keys());
      let victim = keys[Math.floor(Math.random() * keys.length)];
      for (let i = 1; i < this.samples; i++) {
        const candidate = keys[Math.floor(Math.random() * keys.length)];
        if (this.store.get(candidate)!.lastUsed < this.store.get(victim)!.lastUsed) {
          victim = candidate;
        }
      }
      this.store.delete(victim);
    }
    this.store.set(key, { value, lastUsed: ++this.clock });
  }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "RandomCache.java",
      code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

// True random replacement. Stupidly simple, surprisingly effective.
class RandomCache<K, V> {
    private final Map<K, V> store = new HashMap<>();
    private final int capacity;

    RandomCache(int capacity) {
        this.capacity = capacity;
    }

    V get(K key) {
        return store.get(key);
    }

    void set(K key, V value) {
        if (!store.containsKey(key) && store.size() >= capacity) {
            // Pick a random key and evict it.
            List<K> keys = new ArrayList<>(store.keySet());
            K victim = keys.get(ThreadLocalRandom.current().nextInt(keys.size()));
            store.remove(victim);
        }
        store.put(key, value);
    }
}

// Redis-style "sample N, evict oldest of N" — random as N -> 1,
// approaches LRU as N -> cache size.
class SampledLRU<K, V> {
    private record Entry<V>(V value, long lastUsed) {}

    private final Map<K, Entry<V>> store = new HashMap<>();
    private long clock = 0;
    private final int capacity;
    private final int samples;

    SampledLRU(int capacity, int samples) {
        this.capacity = capacity;
        this.samples = samples;
    }

    void set(K key, V value) {
        if (!store.containsKey(key) && store.size() >= capacity) {
            List<K> keys = new ArrayList<>(store.keySet());
            var rng = ThreadLocalRandom.current();
            K victim = keys.get(rng.nextInt(keys.size()));
            for (int i = 1; i < samples; i++) {
                K candidate = keys.get(rng.nextInt(keys.size()));
                if (store.get(candidate).lastUsed() < store.get(victim).lastUsed()) {
                    victim = candidate;
                }
            }
            store.remove(victim);
        }
        store.put(key, new Entry<>(value, ++clock));
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "random_cache.py",
      code: `import random
from typing import Optional


class RandomCache:
    """True random replacement. Stupidly simple, surprisingly effective."""

    def __init__(self, capacity: int) -> None:
        self.store: dict = {}
        self.capacity = capacity

    def get(self, key) -> Optional[object]:
        return self.store.get(key)

    def set(self, key, value) -> None:
        if key not in self.store and len(self.store) >= self.capacity:
            # Pick a random key and evict it.
            victim = random.choice(list(self.store.keys()))
            del self.store[victim]
        self.store[key] = value


class SampledLRU:
    """Redis-style 'sample N, evict oldest of N' — random as N -> 1,
    approaches LRU as N -> cache size.
    """

    def __init__(self, capacity: int, samples: int = 5) -> None:
        self.store: dict = {}  # key -> (value, last_used)
        self.clock = 0
        self.capacity = capacity
        self.samples = samples

    def set(self, key, value) -> None:
        if key not in self.store and len(self.store) >= self.capacity:
            keys = list(self.store.keys())
            victim = random.choice(keys)
            for _ in range(1, self.samples):
                candidate = random.choice(keys)
                if self.store[candidate][1] < self.store[victim][1]:
                    victim = candidate
            del self.store[victim]
        self.clock += 1
        self.store[key] = (value, self.clock)`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "random_cache.cpp",
      code: `// True random replacement. Stupidly simple, surprisingly effective.
#include <unordered_map>
#include <vector>
#include <random>
#include <optional>

template <class K, class V>
class RandomCache {
    size_t capacity_;
    std::unordered_map<K, V> store_;
    std::mt19937 rng_{std::random_device{}()};

public:
    explicit RandomCache(size_t capacity) : capacity_(capacity) {}

    std::optional<V> get(const K& key) {
        auto it = store_.find(key);
        if (it == store_.end()) return std::nullopt;
        return it->second;
    }

    void set(const K& key, const V& value) {
        if (!store_.count(key) && store_.size() >= capacity_) {
            // Pick a random key and evict it.
            std::vector<K> keys;
            keys.reserve(store_.size());
            for (const auto& [k, v] : store_) keys.push_back(k);
            std::uniform_int_distribution<size_t> dist(0, keys.size() - 1);
            store_.erase(keys[dist(rng_)]);
        }
        store_[key] = value;
    }
};

// Redis-style "sample N, evict oldest of N" — random as N -> 1,
// approaches LRU as N -> cache size.
template <class K, class V>
class SampledLRU {
    struct Entry { V value; long lastUsed; };
    size_t capacity_;
    int samples_;
    long clock_ = 0;
    std::unordered_map<K, Entry> store_;
    std::mt19937 rng_{std::random_device{}()};

public:
    SampledLRU(size_t capacity, int samples = 5)
        : capacity_(capacity), samples_(samples) {}

    void set(const K& key, const V& value) {
        if (!store_.count(key) && store_.size() >= capacity_) {
            std::vector<K> keys;
            keys.reserve(store_.size());
            for (const auto& [k, v] : store_) keys.push_back(k);
            std::uniform_int_distribution<size_t> dist(0, keys.size() - 1);
            K victim = keys[dist(rng_)];
            for (int i = 1; i < samples_; i++) {
                const K& candidate = keys[dist(rng_)];
                if (store_[candidate].lastUsed < store_[victim].lastUsed) {
                    victim = candidate;
                }
            }
            store_.erase(victim);
        }
        store_[key] = Entry{value, ++clock_};
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Smith (1982) — Cache Memories (ACM Computing Surveys)",
      href: "https://dl.acm.org/doi/10.1145/356887.356892",
      note: "Classic survey noting random replacement is surprisingly competitive on real traces.",
      kind: "paper",
    },
    {
      label: "Redis — Key eviction (maxmemory-samples)",
      href: "https://redis.io/docs/latest/develop/reference/eviction/",
      note: "Explains the sampled-LRU trick and how `maxmemory-samples` dials it between random and strict LRU.",
      kind: "docs",
    },
    {
      label: "ARM Cortex-A Series Programmer's Guide (Armv7-A) — Cache policies",
      href: "https://documentation-service.arm.com/static/6893ad23e7f7ce6150e88d37",
      note: "Real-world hardware: ARM cores select between pseudo-random and round-robin line replacement.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "rand-q1",
      question: "Why is random replacement competitive with LRU on many realistic workloads?",
      options: [
        { id: "a", label: "Random is mathematically equivalent to LRU." },
        { id: "b", label: "Hot keys are re-referenced often, so a mistaken eviction is quickly corrected on the next miss; the error self-corrects." },
        { id: "c", label: "Random has a lower miss rate by design." },
        { id: "d", label: "Random uses larger cache slots." },
      ],
      correctOptionId: "b",
      explanation:
        "Random will sometimes evict a hot key, but as soon as that key is requested again it returns to the cache. The re-reference rate of typical workloads acts as a self-correcting feedback loop, so the average hit rate sits close to LRU's.",
    },
    {
      id: "rand-q2",
      question:
        "Redis sets `maxmemory-samples 5` by default for its LRU eviction. What does this control?",
      options: [
        { id: "a", label: "The number of keys to delete per eviction event." },
        { id: "b", label: "The number of random keys to sample; Redis evicts the least-recently-used among that sample." },
        { id: "c", label: "How many seconds to wait between evictions." },
        { id: "d", label: "The maximum number of cached items." },
      ],
      correctOptionId: "b",
      explanation:
        "Redis trades exact LRU for sampled approximate LRU. With samples=1 it degenerates to random; with samples=N (cache size) it becomes exact LRU. The default of 5 is empirically very close to exact LRU at a fraction of the bookkeeping cost.",
    },
    {
      id: "rand-q3",
      question:
        "What is the single biggest downside of random eviction in a benchmarking context?",
      options: [
        { id: "a", label: "It's slow." },
        { id: "b", label: "It produces non-deterministic, run-to-run variance in hit rate that makes results hard to compare." },
        { id: "c", label: "It cannot evict large entries." },
        { id: "d", label: "It requires special hardware." },
      ],
      correctOptionId: "b",
      explanation:
        "Random replacement gives a different result every run. For repeatable benchmarks you have to fix the RNG seed or average over many runs — both painful compared to LRU's deterministic behavior.",
    },
  ],
};
