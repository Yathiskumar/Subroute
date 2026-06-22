import type { ConceptContent } from "@/lib/content/types";

export const arc: ConceptContent = {
  prototypeCaption:
    "Four lists plus a tunable target **p**. **T1** holds keys seen once; **T2** keys seen twice or more (together they hold the real cache, capped at 4). **B1** and **B2** are ghost lists — keys recently evicted from T1 / T2 with no data attached. A ghost-hit in B1 bumps **p** up (favor recency); a ghost-hit in B2 bumps **p** down (favor frequency). Watch the **p** value at the top retune itself in real time.",

  overview: [
    {
      type: "p",
      text: "ARC — **Adaptive Replacement Cache** — is what you build when you can't decide between LRU and LFU. Invented at IBM in 2003 by Megiddo and Modha, it keeps two LRU-ish lists in parallel: one for entries seen **once** recently, and one for entries seen **more than once**. The brilliant trick is that it also remembers the keys it **just evicted** — and uses that history to retune the boundary between the two lists.",
    },
    {
      type: "p",
      text: "The result is a cache that behaves like LRU when the workload is recency-dominated and like LFU when frequency dominates — without any tuning parameter. It famously powers Sun ZFS's adaptive cache and inspired the algorithms behind PostgreSQL's clock-sweep and IBM DB2.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Four lists, one moving target" },
    {
      type: "p",
      text: "ARC maintains four lists for a cache of size c:",
    },
    {
      type: "ul",
      items: [
        "**T1** — entries seen exactly once recently (the LRU half).",
        "**T2** — entries seen at least twice (the frequent half).",
        "**B1** — ghost entries: keys recently evicted from T1. **Only keys are stored, not values.**",
        "**B2** — ghost entries: keys recently evicted from T2.",
      ],
    },
    {
      type: "p",
      text: "T1 and T2 together hold the cached values; B1 and B2 are pure metadata that fit on the side. ARC tracks a target size **p** for T1 (so T2 targets `c - p`). The algorithm:",
    },
    {
      type: "ol",
      items: [
        "**New key, not anywhere** → insert at the head of T1. Evict from whichever list is over its target.",
        "**Hit in T1 or T2** → move to the head of T2 (it's been seen twice now).",
        "**Hit in B1 (ghost)** → 'I evicted that too soon; recency matters more.' Increase p. Bring the key back into T2.",
        "**Hit in B2 (ghost)** → 'I evicted that too soon; frequency matters more.' Decrease p. Bring the key back into T2.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "The ghost lists are the magic",
      text: "Without B1 and B2, ARC would have no signal about which axis is hurting it. The ghosts cost almost nothing — just a key, no value — but they let ARC see the cost of its recent eviction decisions and adapt.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Mixed workloads** where the recency/frequency balance varies over time — backup jobs, then OLTP, then a scan, then OLTP again.",
        "**You don't want a tuning parameter** — ARC chooses p for you, continuously.",
        "**Buffer pools** for storage engines and filesystems, where the workload is genuinely unpredictable.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "Solaris ZFS uses ARC for its in-RAM block cache — that's where most engineers first encounter the name. PostgreSQL adopted a clock-based approximation after considering ARC. Worth noting: ARC is patented by IBM (US 6,996,676) — which is why some projects, including the Linux kernel, deliberately avoid it.",
    },
  ],

  tradeoffs: {
    pros: [
      "Self-tuning — adapts between recency and frequency without a knob.",
      "Scan-resistant — a one-shot scan only churns T1 while T2 (the proven-popular entries) is protected.",
      "Consistently better hit rate than LRU and LFU across a wide range of workload mixes.",
    ],
    cons: [
      "Significantly more complex to implement and reason about than LRU.",
      "Higher memory overhead — four lists plus ghost metadata.",
      "IBM patent (US 6,996,676) — some projects can't use it for legal reasons. CAR and CAR-T are patent-free variants designed for the same purpose.",
    ],
  },

  handsOn: [
    {
      title: "01 · Promote from T1 to T2",
      body: "Click A. It enters T1 (top-left). Click A again — it moves to T2 (top-right) because ARC now considers it 'frequent'. Two accesses is all it takes.",
    },
    {
      title: "02 · Watch a ghost hit retune p",
      body: "Click A, B, C, D, E — fill the cache. By now some keys have spilled into B1 (dashed ghosts, bottom-left). Click one of those ghost keys. The status line flags it as GHOST B1, and the **p** value at the top jiggles up. ARC just learned 'I evicted that too soon — favor recency next time'.",
    },
    {
      title: "03 · Send a scan, protect T2",
      body: "Click **Reset**. Click A, A to plant A in T2. Now scan: C, D, E, F. Watch T1 churn through them while T2 (and A) stay untouched — T2 only accepts keys seen at least twice, so a single-pass scan can't pollute it.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "arc.ts",
      code: `// Sketch only — full ARC needs careful list manipulation.
// T1, T2: hold real values; B1, B2: hold keys only (ghosts).
class ARC<K, V> {
  private t1 = new Map<K, V>(); // recent, seen once
  private t2 = new Map<K, V>(); // frequent, seen 2+ times
  private b1 = new Set<K>();    // ghost of T1
  private b2 = new Set<K>();    // ghost of T2
  private p = 0;                // target size of T1, learned

  constructor(private c: number) {}

  get(key: K): V | undefined {
    // Hit in T1 or T2 -> promote to T2 (head)
    if (this.t1.has(key)) {
      const v = this.t1.get(key)!;
      this.t1.delete(key);
      this.t2.set(key, v);
      return v;
    }
    if (this.t2.has(key)) {
      const v = this.t2.get(key)!;
      this.t2.delete(key); this.t2.set(key, v); // touch
      return v;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    // Ghost hits adapt p: B1 -> favor recency; B2 -> favor frequency
    if (this.b1.has(key)) {
      this.p = Math.min(this.c, this.p + Math.max(1, this.b2.size / this.b1.size));
      this.replace(key);
      this.b1.delete(key);
      this.t2.set(key, value);
      return;
    }
    if (this.b2.has(key)) {
      this.p = Math.max(0, this.p - Math.max(1, this.b1.size / this.b2.size));
      this.replace(key);
      this.b2.delete(key);
      this.t2.set(key, value);
      return;
    }
    // Brand new key
    if (this.t1.size + this.t2.size >= this.c) this.replace(key);
    this.t1.set(key, value);
  }

  private replace(_: K): void { /* evict from T1 or T2 based on p */ }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "ArcCache.java",
      code: `import java.util.LinkedHashMap;
import java.util.LinkedHashSet;

// Sketch only — full ARC needs careful list manipulation.
// T1, T2: hold real values; B1, B2: hold keys only (ghosts).
class ArcCache<K, V> {
    private final LinkedHashMap<K, V> t1 = new LinkedHashMap<>(); // recent, seen once
    private final LinkedHashMap<K, V> t2 = new LinkedHashMap<>(); // frequent, seen 2+ times
    private final LinkedHashSet<K> b1 = new LinkedHashSet<>();    // ghost of T1
    private final LinkedHashSet<K> b2 = new LinkedHashSet<>();    // ghost of T2
    private double p = 0;        // target size of T1, learned
    private final int c;

    ArcCache(int c) {
        this.c = c;
    }

    V get(K key) {
        // Hit in T1 or T2 -> promote to T2 (head)
        if (t1.containsKey(key)) {
            V v = t1.remove(key);
            t2.put(key, v);
            return v;
        }
        if (t2.containsKey(key)) {
            V v = t2.remove(key);
            t2.put(key, v); // touch
            return v;
        }
        return null;
    }

    void set(K key, V value) {
        // Ghost hits adapt p: B1 -> favor recency; B2 -> favor frequency
        if (b1.contains(key)) {
            p = Math.min(c, p + Math.max(1.0, (double) b2.size() / b1.size()));
            replace(key);
            b1.remove(key);
            t2.put(key, value);
            return;
        }
        if (b2.contains(key)) {
            p = Math.max(0, p - Math.max(1.0, (double) b1.size() / b2.size()));
            replace(key);
            b2.remove(key);
            t2.put(key, value);
            return;
        }
        // Brand new key
        if (t1.size() + t2.size() >= c) replace(key);
        t1.put(key, value);
    }

    private void replace(K key) { /* evict from T1 or T2 based on p */ }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "arc_cache.py",
      code: `from collections import OrderedDict
from typing import Optional


class ARC:
    """Sketch only — full ARC needs careful list manipulation.

    T1, T2: hold real values; B1, B2: hold keys only (ghosts).
    """

    def __init__(self, c: int) -> None:
        self.t1: OrderedDict = OrderedDict()  # recent, seen once
        self.t2: OrderedDict = OrderedDict()  # frequent, seen 2+ times
        self.b1: OrderedDict = OrderedDict()  # ghost of T1 (ordered set)
        self.b2: OrderedDict = OrderedDict()  # ghost of T2 (ordered set)
        self.p = 0                            # target size of T1, learned
        self.c = c

    def get(self, key) -> Optional[object]:
        # Hit in T1 or T2 -> promote to T2 (head)
        if key in self.t1:
            v = self.t1.pop(key)
            self.t2[key] = v
            return v
        if key in self.t2:
            self.t2.move_to_end(key)  # touch
            return self.t2[key]
        return None

    def set(self, key, value) -> None:
        # Ghost hits adapt p: B1 -> favor recency; B2 -> favor frequency
        if key in self.b1:
            self.p = min(self.c, self.p + max(1, len(self.b2) / len(self.b1)))
            self._replace(key)
            del self.b1[key]
            self.t2[key] = value
            return
        if key in self.b2:
            self.p = max(0, self.p - max(1, len(self.b1) / len(self.b2)))
            self._replace(key)
            del self.b2[key]
            self.t2[key] = value
            return
        # Brand new key
        if len(self.t1) + len(self.t2) >= self.c:
            self._replace(key)
        self.t1[key] = value

    def _replace(self, key) -> None:
        pass  # evict from T1 or T2 based on p`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "arc_cache.cpp",
      code: `// Sketch only — full ARC needs careful list manipulation.
// T1, T2: hold real values; B1, B2: hold keys only (ghosts).
#include <list>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <optional>

template <class K, class V>
class ARC {
    using VList = std::list<std::pair<K, V>>;
    VList t1_;  // recent, seen once
    VList t2_;  // frequent, seen 2+ times
    std::unordered_map<K, typename VList::iterator> t1Idx_, t2Idx_;
    std::unordered_set<K> b1_; // ghost of T1
    std::unordered_set<K> b2_; // ghost of T2
    double p_ = 0;             // target size of T1, learned
    size_t c_;

public:
    explicit ARC(size_t c) : c_(c) {}

    std::optional<V> get(const K& key) {
        // Hit in T1 or T2 -> promote to T2
        auto i = t1Idx_.find(key);
        if (i != t1Idx_.end()) {
            V v = i->second->second;
            t1_.erase(i->second);
            t1Idx_.erase(i);
            t2_.emplace_back(key, v);
            t2Idx_[key] = std::prev(t2_.end());
            return v;
        }
        auto j = t2Idx_.find(key);
        if (j != t2Idx_.end()) {
            t2_.splice(t2_.end(), t2_, j->second); // touch
            return j->second->second;
        }
        return std::nullopt;
    }

    void set(const K& key, const V& value) {
        // Ghost hits adapt p: B1 -> favor recency; B2 -> favor frequency
        if (b1_.count(key)) {
            p_ = std::min<double>(c_, p_ + std::max(1.0, (double)b2_.size() / b1_.size()));
            replace(key);
            b1_.erase(key);
            t2_.emplace_back(key, value);
            t2Idx_[key] = std::prev(t2_.end());
            return;
        }
        if (b2_.count(key)) {
            p_ = std::max(0.0, p_ - std::max(1.0, (double)b1_.size() / b2_.size()));
            replace(key);
            b2_.erase(key);
            t2_.emplace_back(key, value);
            t2Idx_[key] = std::prev(t2_.end());
            return;
        }
        // Brand new key
        if (t1Idx_.size() + t2Idx_.size() >= c_) replace(key);
        t1_.emplace_back(key, value);
        t1Idx_[key] = std::prev(t1_.end());
    }

private:
    void replace(const K&) { /* evict from T1 or T2 based on p */ }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Megiddo & Modha (2003) — ARC: A Self-Tuning, Low Overhead Replacement Cache",
      href: "https://www.usenix.org/legacy/event/fast03/tech/full_papers/megiddo/megiddo.pdf",
      note: "The original USENIX FAST paper. Surprisingly readable for a cache paper.",
      kind: "paper",
    },
    {
      label: "OpenZFS source — module/zfs/arc.c",
      href: "https://github.com/openzfs/zfs/blob/master/module/zfs/arc.c",
      note: "ARC in a real production storage system. The header comments document exactly how ZFS adapts the paper.",
      kind: "docs",
    },
    {
      label: "Bansal & Modha (2004) — CAR: Clock with Adaptive Replacement",
      href: "https://www.usenix.org/legacy/publications/library/proceedings/fast04/tech/full_papers/bansal/bansal.pdf",
      note: "Patent-free clock-based variants (CAR and CART) of ARC. Same idea, no licensing headache.",
      kind: "paper",
    },
  ],

  quiz: [
    {
      id: "arc-q1",
      question: "What is the purpose of ARC's 'ghost' lists B1 and B2?",
      options: [
        { id: "a", label: "They hold backup copies of evicted values for fast restoration." },
        { id: "b", label: "They store keys (not values) of recently evicted entries, so ARC can detect when its eviction decisions were wrong and adapt." },
        { id: "c", label: "They are extra cache slots that activate during high load." },
        { id: "d", label: "They store the access frequency of each key." },
      ],
      correctOptionId: "b",
      explanation:
        "B1 and B2 are pure metadata — keys only — that remember the last evictions. A hit in B1 means 'you just evicted that, recency must matter more'; a hit in B2 means 'frequency must matter more'. They are the feedback signal that lets ARC retune p without external configuration.",
    },
    {
      id: "arc-q2",
      question:
        "Why is ARC scan-resistant in a way that LRU is not?",
      options: [
        { id: "a", label: "ARC detects scans by inspecting key patterns." },
        { id: "b", label: "Scan keys are only seen once, so they live in T1 and never displace the proven-popular entries in T2." },
        { id: "c", label: "ARC has a built-in scan filter." },
        { id: "d", label: "ARC uses a larger cache than LRU." },
      ],
      correctOptionId: "b",
      explanation:
        "T2 only holds entries that have been accessed at least twice. A one-shot scan never promotes anything to T2, so it churns through T1 alone, leaving the popular T2 entries safe.",
    },
    {
      id: "arc-q3",
      question:
        "ARC has an active patent. What's the most common workaround in patent-sensitive codebases?",
      options: [
        { id: "a", label: "Use plain LRU." },
        { id: "b", label: "Use Clock-with-Adaptive-Replacement (CAR) or CAR-T, the patent-free variants by Bansal and Modha." },
        { id: "c", label: "Wait for the patent to expire." },
        { id: "d", label: "Implement ARC in a different language." },
      ],
      correctOptionId: "b",
      explanation:
        "CAR (Bansal & Modha, 2004) is a clock-based reformulation of ARC that achieves the same adaptive behavior without the patented data structures. Linux and several BSDs use clock-family policies partly for this reason.",
    },
  ],
};
