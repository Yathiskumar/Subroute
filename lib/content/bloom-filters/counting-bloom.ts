import type { ConceptContent } from "@/lib/content/types";

export const countingBloom: ConceptContent = {
  prototypeCaption:
    "Each cell now holds a 4-bit **counter** instead of a single bit. Step through **Add & check**, **Safe delete**, or **Counter overflow** — or jump into **Free play** to add and remove words yourself. Watch counts go up by 1 on add, down by 1 on remove, and saturate at 15 when too many items share a cell.",

  overview: [
    {
      type: "p",
      text: "A **counting Bloom filter** is the obvious fix to the no-delete problem: replace each bit with a small *counter*. Now `add` increments k counters and `remove` decrements them. A counter > 0 plays the role of a 1; a counter == 0 plays the role of a 0. Membership queries are unchanged — if any of the k counters is 0, the item was never added.",
    },
    {
      type: "p",
      text: "Why does this preserve correctness? Because shared cells stay positive as long as *any* item still relies on them. When you remove apple from a cell that grape also uses, the count goes from 2 to 1 — apple is gone, grape is still findable, and nothing about the no-false-negative guarantee is broken. The same property that makes Bloom filters fail at deletion (cells are shared) is exactly what counting filters use to delete *safely*.",
    },
    {
      type: "p",
      text: "The price is memory. 4-bit counters (the standard choice) make a counting Bloom filter ~4× the size of a vanilla Bloom filter at the same false-positive rate. For most modern workloads that is too expensive — which is why this concept is best understood as the stepping stone from Bloom (1970) to [cuckoo filters](/topics/bloom-filters/cuckoo) (2014), the design that does deletion *and* costs less than Bloom.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Adding an item" },
    {
      type: "ol",
      items: [
        "Compute the same *k* hash values as a vanilla Bloom filter.",
        "**Increment** each of those *k* counters by 1.",
        "Counters saturate at the maximum the cell width allows (typically 15 for 4-bit cells). A saturated counter must not decrement on remove, or the structure can produce false negatives.",
      ],
    },
    { type: "h", text: "Removing an item" },
    {
      type: "ol",
      items: [
        "First *check* that the item is present — refuse to remove if any of its k counters is 0, because that item was never inserted.",
        "If all k counters are positive (and not saturated), **decrement** each by 1.",
        "Cells shared with other items keep a positive count; cells unique to this item drop to 0. The structure is now equivalent to one where the item was never added — except for any saturated counters, which must be left alone.",
      ],
    },
    { type: "h", text: "Checking is unchanged" },
    {
      type: "ul",
      items: [
        "If **any** of the k counters is 0, the item is **definitely not** in the set (treating > 0 as 'bit set').",
        "If **all** are > 0, the item is **maybe** in the set — same one-sided error as a vanilla Bloom filter, same FPR formula.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Counter overflow creates false negatives",
      text: "If a counter saturates and you blindly decrement it, you can erase membership for an item that was actually added — a *false negative*, which the Bloom-filter family is supposed to never produce. The fix is simple: once a counter hits its maximum, freeze it. Most implementations widen counters to 4 bits exactly because pinning at 15 makes overflow rare in practice.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Why 4 bits is the standard",
      text: "If the underlying Bloom filter is well-sized (load factor near optimal), the expected count per cell is small — usually 0, 1, or 2. The probability of a cell reaching 16 is vanishingly low (≈10⁻⁹ at typical settings), so 4 bits gives a safe margin without paying for 8-bit counters. Fan, Cao, Almeida & Broder worked this out in the original 2000 paper.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it earns its memory cost" },
    {
      type: "ul",
      items: [
        "**Sliding-window dedup** — log-line dedup over the last hour: add on arrival, remove when the line ages out. Cuckoo can do it too, but counting Bloom is dead simple and easy to reason about.",
        "**Distributed cache summaries** — Fan et al's original use case was 'summary cache' for web caches: each cache shares a counting filter so neighbours know what it holds, and entries can be added/removed as the cache turns over.",
        "**Allowlists with churn** — when users get added and removed often, a vanilla Bloom would saturate over time; a counting Bloom stays sized for the *current* set.",
        "**Quick retrofit** — if you already have a Bloom filter implementation, swapping bits for counters is a small change. Worth a try before reaching for cuckoo if you just need delete to work and don't want to rewrite.",
      ],
    },
    { type: "h", text: "When something else is better" },
    {
      type: "ul",
      items: [
        "**Memory is tight** → a [cuckoo filter](/topics/bloom-filters/cuckoo) supports deletion with *less* memory than even a vanilla Bloom filter at the same FPR.",
        "**You never delete** → save the 4× factor and use a plain [Bloom filter](/topics/bloom-filters/bloom).",
        "**You need exact membership** → use a hash set; no probabilistic filter can answer 'is this in the set?' definitively-yes.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Supports deletion** — the only filter in this topic that does so by directly extending the Bloom design; the math and code are familiar.",
      "**Same FPR formula** as a vanilla Bloom filter — sizing and tuning carry over directly.",
      "**Membership unchanged** — readers don't care that cells are counters; they just look for 'any zero'.",
      "**Mergeable** — two counting filters of the same shape add cell-wise to give the union with correct counts.",
    ],
    cons: [
      "**~4× the memory** of an equivalent Bloom filter (for 4-bit counters). That's almost always the deal-breaker vs. cuckoo.",
      "**Counter overflow is a correctness bug** — implementations must pin saturated cells and never decrement them, which leaks tiny amounts of error over time.",
      "**Still has false positives** — only the deletion problem is fixed; the FPR characteristic is identical to Bloom.",
      "**Bigger cache footprint** — k cell reads still happen, but each cell is now 4 bits instead of 1, so the hot working set is bigger.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk Add & check",
      body: "Open the **Add & check** scenario. Step through with **Next**: `apple` adds (3 cells go from 0 → 1), `apple` is checked (all > 0, maybe-yes), `banana` is checked (some cell is 0, definitely-no). Note the counts in the cells — they look like a Bloom filter, just with numbers instead of ticks.",
    },
    {
      title: "02 · Safe deletion in action",
      body: "Switch to **Safe delete**. Two words are added that share a cell — watch that shared cell go to 2. Then one of them is removed: the shared cell drops to 1 (not 0), so the other word is still findable. This is the whole point of counting Bloom — and the property that a plain Bloom filter cannot provide.",
    },
    {
      title: "03 · Counter overflow",
      body: "Step through **Counter overflow**. Many words pile onto the same cell until it saturates at 15. The narration explains why decrementing a saturated cell would cause false negatives, so saturated cells are *frozen* — they leak a small permanent positive bias into the filter, but never break the no-false-negative guarantee.",
    },
    {
      title: "04 · Free play — add, remove, repeat",
      body: "Open **Free play**. Add a few words, then remove one and check the cell counts move down by 1. Try removing a word you never added — the filter refuses ('one of the cells is 0, so this was never added'). Try checking a word you removed — back to definitely-no. Reset to clear.",
    },
  ],

  code: {
    language: "typescript",
    filename: "counting-bloom-filter.ts",
    code: `// Counting Bloom filter — 4-bit counters, supports delete.
class CountingBloomFilter {
  private readonly cells: Uint8Array;        // each cell holds 0..15
  private static readonly MAX = 15;

  constructor(
    private readonly m: number,              // number of cells
    private readonly k: number,              // hash functions
  ) {
    this.cells = new Uint8Array(m);          // 1 byte each (4 bits used)
  }

  add(item: string): void {
    for (const i of this.indices(item)) {
      if (this.cells[i] < CountingBloomFilter.MAX) this.cells[i]++;
      // else: leave at MAX — never decrement a saturated cell.
    }
  }

  remove(item: string): boolean {
    // Refuse to remove items that aren't present (would corrupt the filter).
    if (!this.has(item)) return false;
    for (const i of this.indices(item)) {
      if (this.cells[i] < CountingBloomFilter.MAX) {
        this.cells[i]--;                     // pinned cells stay pinned
      }
    }
    return true;
  }

  has(item: string): boolean {
    for (const i of this.indices(item)) {
      if (this.cells[i] === 0) return false; // definitely-not
    }
    return true;                             // maybe-yes
  }

  private *indices(item: string) {
    const h1 = fnv1a(item);
    const h2 = murmur3(item);
    for (let i = 0; i < this.k; i++) {
      yield Math.abs((h1 + i * h2) % this.m);
    }
  }
}`,
  },

  furtherReading: [
    {
      label: "Fan, Cao, Almeida & Broder — *Summary Cache: A Scalable Wide-Area Web Cache Sharing Protocol* (2000)",
      href: "https://pages.cs.wisc.edu/~cao/papers/summary-cache/",
      note: "The paper that introduced the counting Bloom filter — born from a cooperative web-cache protocol where caches need to share what they hold without exchanging full URL lists. Read §IV for the construction.",
      kind: "paper",
    },
    {
      label: "Mitzenmacher & Upfal — *Probability and Computing*, Ch. 5",
      href: "https://www.cambridge.org/core/books/probability-and-computing/04F2DAB7AB1B116D62C99A30C5D26A37",
      note: "Textbook treatment of Bloom and counting Bloom filters with the false-positive math worked all the way through. The standard graduate reference.",
      kind: "book",
    },
    {
      label: "RocksDB Wiki — Full Filter Block",
      href: "https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter",
      note: "Practical write-up from a real LSM-tree storage engine, including how counting filters were considered and ultimately replaced by ribbon filters for the delete-supporting case.",
      kind: "docs",
    },
    {
      label: "Andrei Broder & Michael Mitzenmacher — *Network Applications of Bloom Filters: A Survey* (2004)",
      href: "https://www.eecs.harvard.edu/~michaelm/postscripts/im2005b.pdf",
      note: "Survey paper with a clean section on counting Bloom filters, their FPR characteristics, and the 'spectral Bloom filter' generalisations that allow multiplicity queries.",
      kind: "paper",
    },
    {
      label: "Google Guava — `BloomFilter` source",
      href: "https://github.com/google/guava/blob/master/guava/src/com/google/common/hash/BloomFilter.java",
      note: "Production Bloom filter (not counting) — useful to compare what an industry-grade no-delete filter looks like, which is exactly what counting Bloom was designed to extend.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "cbf-q1",
      question:
        "What is the key change a counting Bloom filter makes to the original design?",
      options: [
        { id: "a", label: "It uses more hash functions to reduce false positives." },
        { id: "b", label: "It replaces each bit with a small counter so items can be removed by decrementing." },
        { id: "c", label: "It stores the item alongside each set bit so deletes are exact." },
        { id: "d", label: "It removes hash functions entirely and uses linear probing." },
      ],
      correctOptionId: "b",
      explanation:
        "Each bit becomes a (typically 4-bit) counter. Add increments k counters; remove decrements them; membership treats > 0 as 'set'. Shared cells stay positive while any item still uses them, which is what makes deletion safe.",
    },
    {
      id: "cbf-q2",
      question:
        "Why might a counting Bloom filter implementation refuse to decrement a cell once it reaches the maximum value (e.g. 15 for 4-bit counters)?",
      options: [
        { id: "a", label: "To save CPU cycles when the cell is heavily used." },
        { id: "b", label: "To prevent false positives from compounding over time." },
        { id: "c", label: "Because a saturated cell may have had more increments than fit, so decrementing could erase membership for an item that's still present (a false negative)." },
        { id: "d", label: "Because the standard requires it." },
      ],
      correctOptionId: "c",
      explanation:
        "Once a counter overflows, you've lost track of how many items actually mapped to that cell. Decrementing from saturation can drop it below the true count, producing a false negative — which the Bloom-filter family is meant to guarantee against. Pinning saturated cells trades a tiny permanent positive bias for that guarantee.",
    },
    {
      id: "cbf-q3",
      question:
        "Compared with a vanilla Bloom filter at the same false-positive rate, roughly how much more memory does a typical counting Bloom filter use?",
      options: [
        { id: "a", label: "About the same." },
        { id: "b", label: "About 2× more." },
        { id: "c", label: "About 4× more (one bit per cell becomes ~4 bits per cell)." },
        { id: "d", label: "About 16× more." },
      ],
      correctOptionId: "c",
      explanation:
        "Standard practice is 4-bit counters, which is enough headroom that overflow is rare under optimal sizing. That makes the counting variant about 4× larger than the bit-array variant — the chief reason cuckoo filters, which also support delete, have largely supplanted counting Bloom in new designs.",
    },
  ],
};
