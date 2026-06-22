import type { ConceptContent } from "@/lib/content/types";

export const cuckoo: ConceptContent = {
  prototypeCaption:
    "Eight buckets of two slots each. Every word gets a short **fingerprint** and two candidate buckets — try bucket A, fall back to bucket B, then start kicking. Step through **Add & check**, **Backup bucket**, or **Cuckoo eviction** — or open **Free play** and watch the kick chain animate when both homes are full.",

  overview: [
    {
      type: "p",
      text: "A **cuckoo filter** keeps the spirit of a Bloom filter — small, probabilistic, one-sided error — but throws out the bit array. Instead, it stores short *fingerprints* (typically 8–16 bits each) in a hash table of buckets, where each item has *two* candidate buckets. On a collision, an existing fingerprint is kicked out to its other home, like a cuckoo chick evicting its nestmate. That single trick gives you safe deletion *and* a smaller filter than Bloom at the same false-positive rate.",
    },
    {
      type: "p",
      text: "Why is this such a big deal? The 2014 Fan/Andersen/Kaminsky paper showed that for any FPR below ~3%, a cuckoo filter beats a Bloom filter on every dimension that matters: less space per item, faster lookups (only two cache lines touched), no extra memory for delete support, and a clean removal that doesn't leak error over time. In most new designs that need a probabilistic membership filter, cuckoo is now the default — Bloom is reserved for the cases where you literally never delete and want the simplest possible structure.",
    },
    {
      type: "p",
      text: "There is one catch: a cuckoo filter can *refuse an insert* when it gets very full, because the kick chain has nowhere to land. Bloom and counting Bloom never refuse — they just gradually get worse. This is the engineering trade you accept for the smaller footprint: you size for ~95% load factor, monitor occupancy, and either accept the (rare) insert failure or resize to a bigger filter.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The structure" },
    {
      type: "ul",
      items: [
        "A table of **buckets**, each holding a small fixed number of **slots** (typically 4 in production; the prototype uses 2 for clarity).",
        "A short **fingerprint** function `fp(x)` that hashes the full item down to *f* bits (commonly 8–16). The fingerprint, not the item, is what gets stored.",
        "Two candidate buckets per item, computed with a *partial-key cuckoo hashing* trick: `i₁ = hash(x) mod m` and `i₂ = i₁ ⊕ hash(fp(x))`. The XOR is the magic — it means you can compute `i₁` from `i₂` and the fingerprint alone, *without* needing the original item. That's what enables deletion.",
      ],
    },
    { type: "h", text: "Adding an item" },
    {
      type: "ol",
      items: [
        "Compute `fp = fingerprint(x)`, `i₁ = hash(x) mod m`, `i₂ = i₁ ⊕ hash(fp) mod m`.",
        "If bucket *i₁* has a free slot, drop the fingerprint in. Done.",
        "Else if bucket *i₂* has a free slot, drop it there. Done.",
        "Otherwise pick a random slot in *i₁* or *i₂*, **kick** the existing fingerprint out, and try to relocate the kicked fingerprint to *its* alternate bucket. Repeat until something lands or you hit a kick limit (commonly 500).",
        "Hitting the kick limit means the table is too full — the insert fails and you must rebuild larger. In practice this happens above ~95% load.",
      ],
    },
    { type: "h", text: "Checking an item" },
    {
      type: "ol",
      items: [
        "Compute `fp`, `i₁`, `i₂`.",
        "Look in bucket *i₁* and bucket *i₂*. If the fingerprint is in either, return **maybe-yes** — another item may share the same fingerprint and bucket (the false-positive case).",
        "If neither bucket contains the fingerprint, return **definitely-no**.",
      ],
    },
    { type: "h", text: "Removing an item" },
    {
      type: "ol",
      items: [
        "Compute `fp`, `i₁`, `i₂`.",
        "If `fp` is in bucket *i₁* or *i₂*, simply delete it from that slot. Clean removal — no counters, no shared-bit ambiguity.",
        "Caveat: like any filter with false positives, you may accidentally delete a fingerprint that 'belonged' to a different item. The same one-sided error that allows false positives means deletion has a tiny probability of removing the wrong entry, so cuckoo filters assume you only ever remove items you *know* you inserted (which is the same caveat counting Bloom has, just rarely stated).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why the XOR alternate is so clever",
      text: "Standard cuckoo hashing needs to rehash the full item to find an alternate location. That's a problem for a filter, because we threw the item away and only kept the fingerprint. The XOR trick — `i₂ = i₁ ⊕ hash(fp)` — is self-inverting: knowing the bucket you're in and the fingerprint you're holding, you can compute *its* other home without ever seeing the original. That's what makes both *delete* and *kick-chain rebalancing* possible inside a filter.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Inserts can fail",
      text: "Unlike Bloom and counting Bloom, a cuckoo filter can refuse to accept a new item when it gets very full — the kick chain runs to its limit without finding a free slot. The standard remedy is to size for the target load (≈95% with 4-slot buckets) and resize before you saturate. The flip side is that lookups stay fast and the FPR stays exactly what you tuned, instead of slowly degrading like a Bloom filter does as it fills.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**You need delete-supporting membership** and want the smallest filter you can get — cuckoo beats counting Bloom on memory at every realistic FPR.",
        "**You need predictable lookup latency** — only two bucket reads, both cache lines you can prefetch in parallel. Bloom touches k = 7+ cells; cuckoo touches 2.",
        "**Your set churns** — keys come and go often, and you don't want to rebuild the filter periodically to reclaim space.",
        "**You're building a new system in 2026** and just need *a* membership filter that works for both inserts and deletes — cuckoo is the modern default.",
      ],
    },
    { type: "h", text: "When something else is better" },
    {
      type: "ul",
      items: [
        "**You only ever add** → a [Bloom filter](/topics/bloom-filters/bloom) is smaller and simpler. Don't pay for delete support you don't use.",
        "**You can't tolerate insert failures** → counting Bloom never refuses an insert; it just degrades. For a denylist that *must* accept new entries forever, that may matter.",
        "**You need very high FPRs (> 3%)** → in that regime Bloom can actually be smaller per item; cuckoo's advantage kicks in at low FPRs (the common case).",
        "**You need exact membership** → use a hash set; the probabilistic-filter family is the wrong tool.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Supports clean delete** — pull the fingerprint out of a slot; no shared-counter accounting.",
      "**Smaller than Bloom** at realistic FPRs — typical configurations use ~7 bits per item vs Bloom's ~9.6 bits at 1% FPR.",
      "**Only two cache lines** per lookup — Bloom touches k of them. Critical for high-QPS use.",
      "**FPR stays constant** as the filter fills, instead of degrading like Bloom does.",
      "**Production-mature** — used in CockroachDB, ScyllaDB, libsegfault, the dnscrypt-proxy denylist, and many CDN caches.",
    ],
    cons: [
      "**Inserts can fail** once the table is very full — requires a resize path and good monitoring.",
      "**More implementation complexity** — kick logic, alternate-bucket XOR, randomised eviction, retry limits. Bloom is half the code.",
      "**Fingerprint collisions still cause false positives** — at the same FPR the math is different from Bloom but the *kind* of error is the same.",
      "**Worst-case insert is O(kick limit)** — most inserts are O(1), but a near-full filter can require hundreds of kicks for one insert.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk Add & check",
      body: "Open **Add & check** and step through. `apple` gets a fingerprint and two candidate buckets — bucket A is empty, so it goes there. Then a check for `apple` finds its fingerprint in bucket A (maybe-yes), and a check for `banana` finds neither bucket holds its fingerprint (definitely-no).",
    },
    {
      title: "02 · Backup bucket — the cheap fallback",
      body: "Switch to **Backup bucket**. Two words happen to map to the same primary bucket; the second one finds bucket A full but bucket B free, and lands there. This is the no-kick case — cuckoo's first move is always 'is there room in either home?' Kicks only fire when both are full.",
    },
    {
      title: "03 · Cuckoo eviction — watch the kick chain",
      body: "Step through **Cuckoo eviction**. The filter is already loaded; the new word's two buckets are *both* full. Watch a victim fingerprint get kicked out to *its* alternate bucket, which displaces *another* fingerprint, which goes to *its* alternate, until something lands in a free slot. The chain animates one step at a time so you can follow each move.",
    },
    {
      title: "04 · Free play — add, remove, repeat",
      body: "Open **Free play**. Add half a dozen short words and watch the buckets fill. Try **Remove** on one — the fingerprint disappears cleanly from whichever bucket holds it. Keep adding past ~14 items and you'll eventually see the 'too full' message: the kick chain ran to its limit. Reset to clear and try again.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "cuckoo-filter.ts",
      code: `// Cuckoo filter — fingerprints, two candidate buckets, kick chain.
type Fingerprint = number;            // typically 8–16 bits

class CuckooFilter {
  private readonly buckets: Fingerprint[][];

  constructor(
    private readonly numBuckets: number,
    private readonly slotsPerBucket = 4,
    private readonly maxKicks = 500,
  ) {
    this.buckets = Array.from({ length: numBuckets }, () => []);
  }

  add(item: string): boolean {
    const fp = this.fingerprint(item);
    const i1 = this.hash(item) % this.numBuckets;
    const i2 = (i1 ^ this.hash(String(fp))) % this.numBuckets;

    if (this.tryPlace(i1, fp)) return true;
    if (this.tryPlace(i2, fp)) return true;

    // Both buckets full — start the cuckoo dance.
    let idx = Math.random() < 0.5 ? i1 : i2;
    let cur: Fingerprint = fp;
    for (let n = 0; n < this.maxKicks; n++) {
      const slot = Math.floor(Math.random() * this.slotsPerBucket);
      const evicted = this.buckets[idx][slot];
      this.buckets[idx][slot] = cur;
      cur = evicted;
      idx = (idx ^ this.hash(String(cur))) % this.numBuckets;
      if (this.tryPlace(idx, cur)) return true;
    }
    return false;        // filter is too full — caller should resize
  }

  has(item: string): boolean {
    const fp = this.fingerprint(item);
    const i1 = this.hash(item) % this.numBuckets;
    const i2 = (i1 ^ this.hash(String(fp))) % this.numBuckets;
    return this.buckets[i1].includes(fp) || this.buckets[i2].includes(fp);
  }

  remove(item: string): boolean {
    const fp = this.fingerprint(item);
    const i1 = this.hash(item) % this.numBuckets;
    const i2 = (i1 ^ this.hash(String(fp))) % this.numBuckets;
    return this.removeFp(i1, fp) || this.removeFp(i2, fp);
  }

  private tryPlace(idx: number, fp: Fingerprint): boolean {
    if (this.buckets[idx].length < this.slotsPerBucket) {
      this.buckets[idx].push(fp);
      return true;
    }
    return false;
  }
  private removeFp(idx: number, fp: Fingerprint): boolean {
    const i = this.buckets[idx].indexOf(fp);
    if (i === -1) return false;
    this.buckets[idx].splice(i, 1);
    return true;
  }
  private fingerprint(x: string): Fingerprint { return hash(x, 'fp') & 0xff; }
  private hash(x: string, seed = ''): number { return murmur3(x + seed); }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "CuckooFilter.java",
      code: `// Cuckoo filter — fingerprints, two candidate buckets, kick chain.
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

class CuckooFilter {
    private final List<List<Integer>> buckets;  // fingerprints: typically 8–16 bits
    private final int numBuckets;
    private final int slotsPerBucket;
    private final int maxKicks;

    CuckooFilter(int numBuckets, int slotsPerBucket, int maxKicks) {
        this.numBuckets = numBuckets;
        this.slotsPerBucket = slotsPerBucket;
        this.maxKicks = maxKicks;
        this.buckets = new ArrayList<>(numBuckets);
        for (int i = 0; i < numBuckets; i++) buckets.add(new ArrayList<>());
    }

    boolean add(String item) {
        int fp = fingerprint(item);
        int i1 = Math.floorMod(hash(item, ""), numBuckets);
        int i2 = Math.floorMod(i1 ^ hash(String.valueOf(fp), ""), numBuckets);

        if (tryPlace(i1, fp)) return true;
        if (tryPlace(i2, fp)) return true;

        // Both buckets full — start the cuckoo dance.
        ThreadLocalRandom rng = ThreadLocalRandom.current();
        int idx = rng.nextBoolean() ? i1 : i2;
        int cur = fp;
        for (int n = 0; n < maxKicks; n++) {
            int slot = rng.nextInt(slotsPerBucket);
            int evicted = buckets.get(idx).get(slot);
            buckets.get(idx).set(slot, cur);
            cur = evicted;
            idx = Math.floorMod(idx ^ hash(String.valueOf(cur), ""), numBuckets);
            if (tryPlace(idx, cur)) return true;
        }
        return false;    // filter is too full — caller should resize
    }

    boolean has(String item) {
        int fp = fingerprint(item);
        int i1 = Math.floorMod(hash(item, ""), numBuckets);
        int i2 = Math.floorMod(i1 ^ hash(String.valueOf(fp), ""), numBuckets);
        return buckets.get(i1).contains(fp) || buckets.get(i2).contains(fp);
    }

    boolean remove(String item) {
        int fp = fingerprint(item);
        int i1 = Math.floorMod(hash(item, ""), numBuckets);
        int i2 = Math.floorMod(i1 ^ hash(String.valueOf(fp), ""), numBuckets);
        return removeFp(i1, fp) || removeFp(i2, fp);
    }

    private boolean tryPlace(int idx, int fp) {
        if (buckets.get(idx).size() < slotsPerBucket) {
            buckets.get(idx).add(fp);
            return true;
        }
        return false;
    }

    private boolean removeFp(int idx, int fp) {
        int i = buckets.get(idx).indexOf(fp);
        if (i == -1) return false;
        buckets.get(idx).remove(i);
        return true;
    }

    private int fingerprint(String x) { return hash(x, "fp") & 0xff; }
    private int hash(String x, String seed) { return murmur3(x + seed); }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "cuckoo_filter.py",
      code: `import random

# Cuckoo filter — fingerprints, two candidate buckets, kick chain.
# Fingerprints are small ints, typically 8–16 bits.


class CuckooFilter:
    def __init__(self, num_buckets: int, slots_per_bucket: int = 4,
                 max_kicks: int = 500) -> None:
        self.num_buckets = num_buckets
        self.slots_per_bucket = slots_per_bucket
        self.max_kicks = max_kicks
        self.buckets: list[list[int]] = [[] for _ in range(num_buckets)]

    def add(self, item: str) -> bool:
        fp = self._fingerprint(item)
        i1 = self._hash(item) % self.num_buckets
        i2 = (i1 ^ self._hash(str(fp))) % self.num_buckets

        if self._try_place(i1, fp):
            return True
        if self._try_place(i2, fp):
            return True

        # Both buckets full — start the cuckoo dance.
        idx = i1 if random.random() < 0.5 else i2
        cur = fp
        for _ in range(self.max_kicks):
            slot = random.randrange(self.slots_per_bucket)
            evicted = self.buckets[idx][slot]
            self.buckets[idx][slot] = cur
            cur = evicted
            idx = (idx ^ self._hash(str(cur))) % self.num_buckets
            if self._try_place(idx, cur):
                return True
        return False  # filter is too full — caller should resize

    def has(self, item: str) -> bool:
        fp = self._fingerprint(item)
        i1 = self._hash(item) % self.num_buckets
        i2 = (i1 ^ self._hash(str(fp))) % self.num_buckets
        return fp in self.buckets[i1] or fp in self.buckets[i2]

    def remove(self, item: str) -> bool:
        fp = self._fingerprint(item)
        i1 = self._hash(item) % self.num_buckets
        i2 = (i1 ^ self._hash(str(fp))) % self.num_buckets
        return self._remove_fp(i1, fp) or self._remove_fp(i2, fp)

    def _try_place(self, idx: int, fp: int) -> bool:
        if len(self.buckets[idx]) < self.slots_per_bucket:
            self.buckets[idx].append(fp)
            return True
        return False

    def _remove_fp(self, idx: int, fp: int) -> bool:
        if fp not in self.buckets[idx]:
            return False
        self.buckets[idx].remove(fp)
        return True

    def _fingerprint(self, x: str) -> int:
        return hash_seeded(x, "fp") & 0xff

    def _hash(self, x: str, seed: str = "") -> int:
        return murmur3(x + seed)`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "cuckoo_filter.cpp",
      code: `// Cuckoo filter — fingerprints, two candidate buckets, kick chain.
#include <algorithm>
#include <cstdint>
#include <random>
#include <string>
#include <vector>

class CuckooFilter {
    std::vector<std::vector<int>> buckets_;  // fingerprints: typically 8–16 bits
    int numBuckets_;
    int slotsPerBucket_;
    int maxKicks_;
    std::mt19937 rng_{std::random_device{}()};

public:
    CuckooFilter(int numBuckets, int slotsPerBucket = 4, int maxKicks = 500)
        : buckets_(numBuckets), numBuckets_(numBuckets),
          slotsPerBucket_(slotsPerBucket), maxKicks_(maxKicks) {}

    bool add(const std::string& item) {
        int fp = fingerprint(item);
        int i1 = hash(item, "") % numBuckets_;
        int i2 = (i1 ^ hash(std::to_string(fp), "")) % numBuckets_;

        if (tryPlace(i1, fp)) return true;
        if (tryPlace(i2, fp)) return true;

        // Both buckets full — start the cuckoo dance.
        std::uniform_int_distribution<int> coin(0, 1);
        std::uniform_int_distribution<int> slotPick(0, slotsPerBucket_ - 1);
        int idx = coin(rng_) ? i1 : i2;
        int cur = fp;
        for (int n = 0; n < maxKicks_; n++) {
            int slot = slotPick(rng_);
            int evicted = buckets_[idx][slot];
            buckets_[idx][slot] = cur;
            cur = evicted;
            idx = (idx ^ hash(std::to_string(cur), "")) % numBuckets_;
            if (tryPlace(idx, cur)) return true;
        }
        return false;    // filter is too full — caller should resize
    }

    bool has(const std::string& item) const {
        int fp = fingerprint(item);
        int i1 = hash(item, "") % numBuckets_;
        int i2 = (i1 ^ hash(std::to_string(fp), "")) % numBuckets_;
        return contains(i1, fp) || contains(i2, fp);
    }

    bool remove(const std::string& item) {
        int fp = fingerprint(item);
        int i1 = hash(item, "") % numBuckets_;
        int i2 = (i1 ^ hash(std::to_string(fp), "")) % numBuckets_;
        return removeFp(i1, fp) || removeFp(i2, fp);
    }

private:
    bool tryPlace(int idx, int fp) {
        if ((int) buckets_[idx].size() < slotsPerBucket_) {
            buckets_[idx].push_back(fp);
            return true;
        }
        return false;
    }

    bool removeFp(int idx, int fp) {
        auto& b = buckets_[idx];
        auto it = std::find(b.begin(), b.end(), fp);
        if (it == b.end()) return false;
        b.erase(it);
        return true;
    }

    bool contains(int idx, int fp) const {
        const auto& b = buckets_[idx];
        return std::find(b.begin(), b.end(), fp) != b.end();
    }

    int fingerprint(const std::string& x) const { return hash(x, "fp") & 0xff; }
    int hash(const std::string& x, const std::string& seed) const {
        return murmur3(x + seed);
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Fan, Andersen, Kaminsky & Mitzenmacher — *Cuckoo Filter: Practically Better Than Bloom* (CoNEXT 2014)",
      href: "https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf",
      note: "The original paper. Concise and approachable — introduces the design, proves the space and FPR guarantees, and benchmarks against Bloom. The XOR alternate-bucket construction is in §3.",
      kind: "paper",
    },
    {
      label: "Rasmus Pagh & Flemming Friche Rodler — *Cuckoo Hashing* (2001)",
      href: "https://www.itu.dk/people/pagh/papers/cuckoo-jour.pdf",
      note: "The hashing scheme cuckoo *filters* are built on. Worth reading for intuition about why the two-bucket idea works and when the kick chain fails.",
      kind: "paper",
    },
    {
      label: "Bin Fan — reference C++ implementation",
      href: "https://github.com/efficient/cuckoofilter",
      note: "The reference code from the paper's authors. Compact (<1k LOC) and a great map of paper → working filter, including the bit-packing and SIMD lookup tricks.",
      kind: "docs",
    },
    {
      label: "Pedro Gomes — Cuckoo Filter, explained visually",
      href: "https://brilliant.org/wiki/cuckoo-filter/",
      note: "Brilliant.org's walkthrough, with diagrams that complement the prototype above — particularly the kick-chain animation.",
      kind: "article",
    },
    {
      label: "David Eppstein — *Cuckoo Filter: Simplification and Analysis* (arXiv:1604.06067)",
      href: "https://arxiv.org/abs/1604.06067",
      note: "Cleans up the original paper's analysis and shows where the FPR formula in §3.2 actually comes from. Read this once you've absorbed the 2014 paper.",
      kind: "paper",
    },
    {
      label: "Graf & Lemire — *Xor Filters: Faster and Smaller Than Bloom and Cuckoo Filters* (arXiv:1912.08258)",
      href: "https://arxiv.org/abs/1912.08258",
      note: "The follow-up design that beats cuckoo on lookup speed and size for read-mostly workloads. Helpful framing for when cuckoo's 'supports delete' wins and when an xor filter would be better.",
      kind: "paper",
    },
  ],

  quiz: [
    {
      id: "ck-q1",
      question:
        "What does a cuckoo filter actually store in each bucket slot?",
      options: [
        { id: "a", label: "The full original item." },
        { id: "b", label: "A short fingerprint hash of the item (typically 8–16 bits)." },
        { id: "c", label: "A single bit indicating presence." },
        { id: "d", label: "A small counter, like a counting Bloom filter." },
      ],
      correctOptionId: "b",
      explanation:
        "Each slot holds a short fingerprint, not the original item. That makes the filter much smaller than a hash set but means two different items can share a fingerprint — the source of cuckoo's one-sided false-positive error.",
    },
    {
      id: "ck-q2",
      question:
        "Why is the XOR trick `i₂ = i₁ ⊕ hash(fingerprint)` essential to cuckoo filters?",
      options: [
        { id: "a", label: "It makes the hash uniformly distributed across the table." },
        { id: "b", label: "It lets you compute either candidate bucket from the other, knowing only the fingerprint — without the original item." },
        { id: "c", label: "It prevents fingerprint collisions entirely." },
        { id: "d", label: "It avoids modulo bias for non-power-of-two table sizes." },
      ],
      correctOptionId: "b",
      explanation:
        "The XOR is self-inverting: given a bucket and a fingerprint, you can derive its other candidate bucket without ever rehashing the original item. That's what makes deletion and the kick-chain relocation possible — you only ever have fingerprints, not items.",
    },
    {
      id: "ck-q3",
      question:
        "Compared to a Bloom filter at the same false-positive rate, what's a cuckoo filter's main advantage besides supporting deletion?",
      options: [
        { id: "a", label: "It uses fewer hash functions, with no real space difference." },
        { id: "b", label: "It needs fewer bits per item *and* touches only two cache lines per lookup, while Bloom touches k of them." },
        { id: "c", label: "It always succeeds at inserts, no matter how full it gets." },
        { id: "d", label: "It supports merging two filters cell-wise, which Bloom can't." },
      ],
      correctOptionId: "b",
      explanation:
        "At realistic FPRs (≤ 3%), cuckoo filters store fewer bits per item than Bloom and touch only two bucket lookups per query (vs Bloom's k = 7+ separate bit reads). The trade-off is that very-full cuckoo filters can refuse an insert, which Bloom and counting Bloom never do.",
    },
  ],
};
