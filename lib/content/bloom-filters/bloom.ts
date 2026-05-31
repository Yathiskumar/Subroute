import type { ConceptContent } from "@/lib/content/types";

export const bloom: ConceptContent = {
  prototypeCaption:
    "A 24-cell bit array with k = 3 hash functions. Pick a scenario — **Add & check**, **False positive**, or **Saturation** — and step through with **Prev / Next**, or jump into **Free play** to add and check words yourself. Watch the bits light up, the stats update, and the narration explain why each answer is *definitely-no* or *maybe-yes*.",

  overview: [
    {
      type: "p",
      text: "A **Bloom filter** is the smallest useful 'have I seen this before?' data structure. It's a bit array, plus a handful of hash functions, plus a deliberate willingness to be wrong in one direction. Burton Bloom proposed it in 1970 to keep a dictionary of hyphenation rules in 24 KB instead of the megabytes a full hash table needed — and the same trick has been carrying weight ever since.",
    },
    {
      type: "p",
      text: "The setup is two lines of code: an array of *m* bits all starting at zero, and *k* independent hash functions that each map an item to one of those bits. **Add** sets the k bits to 1. **Check** asks: are all k of this item's bits set? If even one is zero, the item was *definitely never added*. If all are set, the item is *maybe* in the set — those bits could have been turned on by other items.",
    },
    {
      type: "p",
      text: "That's the whole structure. No keys are stored anywhere. You can't enumerate the set, you can't remove an item (we'll fix that in the next concept), and you can't be sure of a positive answer. In exchange you get **constant-time lookups**, ~10 bits per item for a 1% false-positive rate, and a filter so small it fits in L1 cache for millions of items.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Adding an item" },
    {
      type: "ol",
      items: [
        "Compute *k* hash values for the item — `h₁(x), h₂(x), ..., hₖ(x)` — each modulo *m* to get a bit index.",
        "Set those *k* bits in the array to 1. Bits that were already 1 stay 1.",
        "That's it. The item itself is never stored. You can't even tell which bits belong to which item.",
      ],
    },
    { type: "h", text: "Checking an item" },
    {
      type: "ol",
      items: [
        "Compute the same *k* hash values for the query item.",
        "Look at those *k* bits. If **any** is 0, return **definitely-not** — no item that hashes to that bit was ever added.",
        "If **all** are 1, return **maybe-yes** — either the item was added, or other items happen to have collectively set every one of its bits (a false positive).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "The false-positive formula",
      text: "After inserting *n* items into a Bloom filter of *m* bits with *k* hash functions, the probability of a false positive is roughly `(1 - e^(-kn/m))^k`. The optimal *k* for a given m/n is `(m/n) · ln 2`, which makes the formula collapse to `(1/2)^k`. The practical takeaway: aim for ~10 bits per item and k ≈ 7 to land near a 1% false-positive rate.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "It only gets worse, not better",
      text: "A Bloom filter's false-positive rate climbs monotonically as you add items — once a bit is set, nothing in a vanilla Bloom filter can ever turn it off. That's why a filter is sized for the maximum expected n upfront and *rebuilt from scratch* when it gets too full, not edited in place.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**You need to skip an expensive lookup** — disk I/O, network call, a cache miss that costs you 10ms. The filter rules out the definite-misses in nanoseconds.",
        "**Your set is mostly append-only** — a crawl frontier of visited URLs, a denylist that rebuilds nightly, an SSTable's key summary that's immutable once written.",
        "**Some false positives are acceptable** because you have a real source of truth behind the filter that confirms the maybe-hits.",
        "**Memory matters more than perfection** — billions of items in a few GB instead of 50× that.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You need to remove items** — use a [counting Bloom filter](/topics/bloom-filters/counting-bloom) or a [cuckoo filter](/topics/bloom-filters/cuckoo).",
        "**You need to enumerate or iterate the set** — Bloom filters can't list what's in them. Use a hash set.",
        "**You need exact answers** — payment systems, primary-key indexes, uniqueness constraints. The 1% wrong-answer rate is a bug, not a feature.",
        "**Your set is tiny** (a few hundred items) — the overhead of `k` hashes per op isn't worth it vs. a plain hash set that already fits in cache.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Tiny memory** — ~9.6 bits per item for a 1% false-positive rate, independent of item size. A million 100-byte URLs fit in 1.2 MB.",
      "**O(k) add and check** — constant time, no allocations, no rebalancing, no GC pressure.",
      "**No-false-negative guarantee** — a 'no' answer is always correct, which lets you use the filter as a definite skip.",
      "**Mergeable** — two Bloom filters of the same shape can be OR'd together to get the union of their sets. Maps cleanly onto distributed systems.",
      "**Cache-friendly** — k hash lookups touch at most k cache lines, often fewer.",
    ],
    cons: [
      "**Can't delete** — once a bit is set, it stays set. Removing an item would require turning off bits that other items might still need.",
      "**FPR grows with fill** — overestimate *n* and you waste memory; underestimate and the false-positive rate spirals.",
      "**Fixed size** — resizing means rehashing every item; in practice you rebuild from the source of truth instead.",
      "**Not key-recoverable** — there's no way to retrieve what was inserted; the filter only answers yes/no.",
      "**k hashes per op** — for k=7 that's seven cache touches; cuckoo filters do the same job in just two.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk Add & check",
      body: "Open the **Add & check** scenario and step through with **Next**. Watch the bits for `apple` light up, then a check for `apple` highlight the same three bits (all on → maybe-yes), then a check for `banana` find an empty bit (definitely-no). Notice that the *definitely-no* answer is exact: no probability involved.",
    },
    {
      title: "02 · See a false positive happen",
      body: "Switch to the **False positive** scenario. A handful of words is added until their bits cover most of the array, then a word that was never added is checked and *all three* of its bits happen to be lit by other words. Maybe-yes — but it's wrong. This is the rate the formula predicts; it isn't a bug.",
    },
    {
      title: "03 · Watch saturation kill the filter",
      body: "Step through **Saturation**. As more words are added, the *Bits set* stat climbs and the *Estimated FPR* climbs with it. After enough adds, almost every check is a false positive. The practical lesson: size *m* for the worst-case *n*, and rebuild before saturation if the data keeps growing.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Add half a dozen common words, then check ones you never added — try short words first (more likely to hash-collide). Note the *Estimated FPR* in the stats and try to find a false positive yourself. Use **Reset** to start over with an empty filter.",
    },
  ],

  code: {
    language: "typescript",
    filename: "bloom-filter.ts",
    code: `// A teaching Bloom filter — k hashes, m bits, no deletion.
class BloomFilter {
  private bits: Uint8Array;

  constructor(
    private readonly m: number,   // bit-array size
    private readonly k: number,   // number of hash functions
  ) {
    this.bits = new Uint8Array(m);
  }

  add(item: string): void {
    for (const i of this.indices(item)) this.bits[i] = 1;
  }

  has(item: string): boolean {
    for (const i of this.indices(item)) {
      if (this.bits[i] === 0) return false;   // definitely-not
    }
    return true;                              // maybe-yes
  }

  // Double-hashing: produce k indices from two base hashes,
  // following Kirsch & Mitzenmacher's "Less Hashing, Same Performance."
  private *indices(item: string) {
    const h1 = fnv1a(item);
    const h2 = murmur3(item);
    for (let i = 0; i < this.k; i++) {
      yield Math.abs((h1 + i * h2) % this.m);
    }
  }

  // Optimal sizing for n items at false-positive rate p.
  static optimalSize(n: number, p: number) {
    const m = Math.ceil(-(n * Math.log(p)) / Math.LN2 ** 2);
    const k = Math.max(1, Math.round((m / n) * Math.LN2));
    return { m, k };
  }
}

// Example: 1M items at 1% FPR → m ≈ 9.6 MB of bits, k = 7
const { m, k } = BloomFilter.optimalSize(1_000_000, 0.01);
const filter = new BloomFilter(m, k);
filter.add("alice@example.com");
filter.has("alice@example.com");  // true (was added)
filter.has("bob@example.com");    // almost certainly false`,
  },

  furtherReading: [
    {
      label: "Burton H. Bloom — *Space/Time Trade-offs in Hash Coding with Allowable Errors* (1970)",
      href: "https://dl.acm.org/doi/10.1145/362686.362692",
      note: "The original paper. Seven pages. Still the clearest exposition of the idea and the hyphenation-dictionary use case that motivated it.",
      kind: "paper",
    },
    {
      label: "Adam Kirsch & Michael Mitzenmacher — *Less Hashing, Same Performance* (2006)",
      href: "https://www.eecs.harvard.edu/~michaelm/postscripts/rsa2008.pdf",
      note: "Proves that you can simulate k independent hash functions with just *two* base hashes (h1 + i·h2). Every modern Bloom filter implementation uses this.",
      kind: "paper",
    },
    {
      label: "Cassandra docs — Bloom filters",
      href: "https://cassandra.apache.org/doc/latest/cassandra/managing/operating/bloom_filters.html",
      note: "Production write-up of Bloom filters per SSTable. Includes how the false-positive rate is tunable per table and how to compute the memory cost.",
      kind: "docs",
    },
    {
      label: "Bill Mill — Bloom Filters by Example",
      href: "https://llimllib.github.io/bloomfilter-tutorial/",
      note: "Short interactive tutorial with step-by-step bit-array animations and the FPR derivation worked from first principles. A great complement to the prototype above.",
      kind: "article",
    },
    {
      label: "Thomas Hurst — Bloom filter calculator",
      href: "https://hur.st/bloomfilter/",
      note: "Plug in n and p, get m and k. Indispensable when sizing a real filter — bookmark it.",
      kind: "docs",
    },
    {
      label: "Andrei Broder & Michael Mitzenmacher — *Network Applications of Bloom Filters: A Survey* (2004)",
      href: "https://www.eecs.harvard.edu/~michaelm/postscripts/im2005b.pdf",
      note: "The definitive 'where do Bloom filters show up?' paper. Covers caching, P2P, routing, measurement, dedup, and the variants this topic builds on.",
      kind: "paper",
    },
  ],

  quiz: [
    {
      id: "bf-q1",
      question:
        "A Bloom filter says a key is 'present.' Which of these is the only safe conclusion?",
      options: [
        { id: "a", label: "The key was definitely inserted at some point." },
        { id: "b", label: "The key is probably present — but it could be a false positive." },
        { id: "c", label: "The key was inserted at least k times." },
        { id: "d", label: "The hash functions are well-distributed." },
      ],
      correctOptionId: "b",
      explanation:
        "A Bloom filter has one-sided error: 'present' really means 'maybe present.' Other items may have collectively set all k bits, so you still need to confirm via the underlying store before treating the answer as authoritative.",
    },
    {
      id: "bf-q2",
      question:
        "Why can't a standard Bloom filter support deletion?",
      options: [
        { id: "a", label: "Because the hash functions aren't reversible." },
        { id: "b", label: "Because removing an item means clearing bits that other items might still need set." },
        { id: "c", label: "Because the filter is immutable by design." },
        { id: "d", label: "Because deletion would increase the false-positive rate." },
      ],
      correctOptionId: "b",
      explanation:
        "Multiple inserts can set the same bit, and the filter doesn't remember which item set which bit. Clearing a bit on remove would create false negatives for any other item that also relied on it — which is exactly the guarantee Bloom filters promise to never violate. The counting variant fixes this with per-bit counters.",
    },
    {
      id: "bf-q3",
      question:
        "You're designing a Bloom filter for 10 million URLs at a target false-positive rate of 1%. Roughly how many bits do you need?",
      options: [
        { id: "a", label: "About 1 million bits (≈125 KB)." },
        { id: "b", label: "About 96 million bits (≈12 MB)." },
        { id: "c", label: "About 1 billion bits (≈125 MB)." },
        { id: "d", label: "About the same as a hash set storing the URLs." },
      ],
      correctOptionId: "b",
      explanation:
        "The rule of thumb is ~9.6 bits per item for a 1% false-positive rate. 10⁷ items × ~9.6 bits ≈ 96 Mbits ≈ 12 MB — independent of how long the URLs are. Compare with the multi-GB hash set you'd need to store the URLs themselves.",
    },
  ],
};
