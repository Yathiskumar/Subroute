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

  code: {
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

  furtherReading: [
    {
      label: "Shi, Prasad, Ko (2010) — An O(1) algorithm for implementing the LFU cache eviction scheme",
      note: "The canonical paper introducing the frequency-bucket trick.",
    },
    {
      label: "Caffeine — Window TinyLFU",
      note: "Modern hybrid that pairs a tiny LRU admission window with a frequency sketch — currently the state of the art.",
    },
    {
      label: "Redis — LFU eviction policy",
      note: "Practical write-up of the decaying-counter approach Redis uses.",
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
