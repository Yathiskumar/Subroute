import type { ConceptContent } from "@/lib/content/types";

export const fenwickTree: ConceptContent = {
  prototypeCaption:
    "An array **a[1..8]** (default `[3,2,5,1,4,6,2,7]`) paired with the BIT cells **t[1..8]**, drawn as bars that span each cell's coverage range. Enter a prefix length k and press **Query** to watch the hop-down path; enter an index and delta then press **Update** to watch the ripple-up path. **Reset** restores the defaults. The speed slider controls animation pace. Three demo buttons automate the key ideas: **\"Query full prefix [1..8]\"** traces the full down-hop chain, **\"Update a[5] += 10 (ripple)\"** shows the upward cascade in slow motion, and **\"Range sum [3..6]\"** fires query(6) then query(2) and subtracts — watch two separate hop paths light up in sequence. Stats panel tracks *n*, the current *result*, *hops* taken, and *lowbit(k)*.",

  overview: [
    {
      type: "p",
      text: "**A Fenwick tree (Binary Indexed Tree, BIT) is a 1-indexed array that lets you answer prefix-sum queries and apply point updates in O(log n) time using O(n) space.** Every cell `t[i]` stores the aggregate of a range of the underlying array that ends at index *i* and has length equal to `lowbit(i)` — the value of the lowest set bit of *i*, computed as `i & -i`. That single bit trick is what makes the whole structure tick: it partitions the index space into non-overlapping ranges whose sizes are powers of two, mirroring the binary representation of any index.",
    },
    {
      type: "p",
      text: "The asymmetry between query and update is the structure's most striking property. **A prefix-sum query hops *down***: start at index `k`, accumulate `t[k]`, then subtract `lowbit(k)` from `k` to jump to the next relevant cell. Each hop peels off the lowest set bit, so the chain terminates in at most O(log n) steps — exactly as many steps as there are set bits in *k*. **A point update hops *up***: start at the changed index, add the delta to `t[i]`, then add `lowbit(i)` to *i* to reach the next cell whose range includes position *i*. Again O(log n) steps, now climbing toward `n`. Same bit trick, opposite direction.",
    },
    {
      type: "p",
      text: "Compared with a **segment tree**, a Fenwick tree is strictly narrower in scope — it only handles prefix sums and point updates natively — but it wins on every practical metric when that scope is sufficient. The implementation is a single flat array with no tree-node structs, no left/right child pointers, and a constant factor roughly 2–3× smaller. It fits in a single cache line far longer into the traversal. For competitive programming and production systems that need fast frequency counting, order-statistic queries, or inversion counting, the BIT is the default first choice. The segment tree earns its keep the moment you need range-minimum, range-GCD, or lazy range updates.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Building the tree" },
    {
      type: "ol",
      items: [
        "Initialise `t[1..n] = 0`. For each position `i` in the input array, call `update(i, a[i])`. The tree is built in O(n log n). (An O(n) construction exists: copy the array, then for each `i` propagate to the parent `i + lowbit(i)`.)",
        "After construction, `t[i]` holds the sum of `a[i - lowbit(i) + 1 .. i]` — a range of `lowbit(i)` consecutive elements ending at `i`.",
      ],
    },
    { type: "h", text: "Prefix-sum query — hop down by subtracting lowbit" },
    {
      type: "ol",
      items: [
        "Set `sum = 0`, `i = k`.",
        "While `i > 0`: add `t[i]` to `sum`; set `i -= lowbit(i)`.",
        "Return `sum`. This accumulates disjoint ranges that together cover `a[1..k]` exactly.",
      ],
    },
    { type: "h", text: "Point update — hop up by adding lowbit" },
    {
      type: "ol",
      items: [
        "Set `i = pos`.",
        "While `i <= n`: add `delta` to `t[i]`; set `i += lowbit(i)`.",
        "Every cell whose coverage range includes `pos` gets updated — no more, no less.",
      ],
    },
    { type: "h", text: "Range sum" },
    {
      type: "ol",
      items: [
        "To sum `a[l..r]`, compute `query(r) - query(l - 1)`.",
        "The two prefix queries each cost O(log n), so range sums are also O(log n).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "lowbit(i) = i & −i",
      text: "In two's-complement arithmetic, `-i` flips all bits of `i` and adds 1. The result of `i & -i` is a number with exactly one bit set — the position of the lowest set bit of `i`. For `i = 6` (binary `110`), `lowbit(6) = 2` (binary `010`), meaning `t[6]` covers 2 elements. For `i = 8` (binary `1000`), `lowbit(8) = 8`, meaning `t[8]` covers 8 elements — the whole prefix.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Range sum = query(r) − query(l − 1)",
      text: "Because `query(k)` returns the exact prefix sum `a[1] + … + a[k]`, subtracting two prefix queries gives any contiguous range sum. This is the standard identity: `a[l..r] = prefix[r] - prefix[l-1]`. The BIT encodes this identity into its structure, so both halves cost only O(log n).",
    },
  ],

  whenToUse: [
    { type: "h", text: "Reach for a Fenwick tree when" },
    {
      type: "ul",
      items: [
        "You need **dynamic prefix sums** — frequencies that change over time (streaming data, online algorithms, competitive programming standard problems like counting inversions).",
        "Your queries are strictly **prefix sums or range sums** and updates are **point updates** — no range-min, range-max, or lazy propagation needed.",
        "**Cache performance matters** — the BIT's single flat array fits in L1/L2 cache far better than a pointer-linked segment tree on large *n*.",
        "You want **minimal code** — the entire structure is ~10 lines; a mistake-prone segment tree is 40–80 lines.",
        "**Order-statistic queries** (k-th smallest element) over a frequency array — BIT binary search runs in O(log n) with a simple bit-descent.",
      ],
    },
    { type: "h", text: "Reach for something else when" },
    {
      type: "ul",
      items: [
        "**Static data** — if the array never changes, compute a plain prefix-sum array once in O(n) and answer every query in O(1). The BIT adds complexity for no gain.",
        "**Range updates** — updating `a[l..r] += delta` requires a more complex BIT variant (difference-array trick) or is cleaner with a **segment tree with lazy propagation**.",
        "**Non-sum aggregates** — range-minimum, range-GCD, range-XOR with range updates all belong to the **segment tree**. The Fenwick tree's hop structure only works for invertible aggregates (sum, XOR) in the prefix direction.",
        "**Persistent queries** — if you need to query a historical version of the array, use a **persistent segment tree**. BITs don't compose persistently without significant extra machinery.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**O(log n) query and update** — both operations touch at most ⌊log₂ n⌋ + 1 cells, making the BIT fast in practice even for n = 10⁷.",
      "**Minimal memory** — a single array of length n + 1; no node structs, no child pointers, no auxiliary arrays. Memory footprint is the same as the input.",
      "**Cache-friendly** — contiguous array layout means the hop chain almost always hits warm cache lines, giving a real-world constant factor 2–3× better than a pointer-based segment tree.",
      "**Tiny implementation** — query and update each fit in five lines. Less code means fewer bugs, easier audits, and fast implementation under contest time pressure.",
      "**Composable** — BITs naturally extend to 2D (prefix sums over a grid) with the same bit trick applied to both axes, keeping O(log² n) per operation.",
    ],
    cons: [
      "**Only invertible prefix aggregates** — works natively for sum and XOR, but range-minimum and range-GCD are not invertible, so a BIT cannot answer range-min queries without a second data structure.",
      "**Range updates are awkward** — incrementing a contiguous range `a[l..r] += delta` requires either a separate difference-BIT or a two-BIT trick; a segment tree with lazy propagation handles this more cleanly.",
      "**1-indexed by convention** — most BIT implementations are 1-indexed because `lowbit(0) = 0` would loop forever. Off-by-one errors are common when converting between 0-indexed input and 1-indexed BIT.",
      "**Harder to reason about** — the implicit 'tree' (which cell covers which range) is invisible in the array. Debugging a wrong answer requires mentally simulating the lowbit hops, which is less intuitive than inspecting a segment tree's explicit nodes.",
      "**No persistence or lazy propagation** — advanced segment tree techniques (persistent trees, beats/kinetic heaps) have no clean BIT analogue; switching structures mid-project is expensive.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the prefix query hop down",
      body: "Click **\"Query full prefix [1..8]\"**. The prototype fires `query(8)` and animates the down-hop chain: it starts at index 8 (`lowbit(8)=8`, covers the whole array), accumulates `t[8]`, then subtracts 8 — reaching 0 and stopping in a single hop. Now manually enter `k = 7` and press **Query**. Because 7 is `0b111`, `lowbit(7)=1`, so the chain hops 7→6→4→0, touching three cells. Watch the dashed arrows trace each subtraction. The hop count in the stats panel equals the number of set bits in *k*.",
    },
    {
      title: "02 · Watch the update ripple up",
      body: "Click **\"Update a[5] += 10 (ripple)\"**. Index 5 is `0b101`, so `lowbit(5)=1`; the chain climbs 5→6→8, updating three cells before exceeding n=8. The bars for `t[5]`, `t[6]`, and `t[8]` all grow — those are exactly the BIT cells whose coverage ranges include position 5. Slow the speed slider to minimum and step through: each bar animates independently, making the upward cascade tangible. Then run **Query full prefix [1..8]** again and confirm the result increased by exactly 10.",
    },
    {
      title: "03 · Range sum [3..6] = query(6) − query(2)",
      body: "Click **\"Range sum [3..6]\"**. The prototype fires `query(6)` first — hop path 6→4→0, two hops — then fires `query(2)` — hop path 2→0, one hop — and subtracts. Two separate dashed-arrow paths light up in sequence, coloured differently so you can tell them apart. The stats panel shows both intermediate results and the final difference. Verify by hand: with default `a=[3,2,5,1,4,6,2,7]`, the range `a[3..6] = 5+1+4+6 = 16`. Confirm the prototype agrees.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Press **Reset** to restore defaults, then try these stress tests: (1) Set the speed slider to maximum and rapidly alternate **Query** and **Update** — confirm the result stays consistent after each round-trip. (2) Enter `idx = 1, delta = -3` and update — then query the full prefix; the BIT handles negative deltas without any special case. (3) Enter `k = 8` and query, note the result, then update every index by +1 (eight separate updates) and query again — the new result should be exactly 8 higher. If anything looks off, step through slowly with the speed slider at minimum to find which hop goes wrong.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "fenwick-tree.ts",
      code: `// Fenwick Tree (Binary Indexed Tree) — 1-indexed, point update, prefix sum.
class FenwickTree {
  private t: number[];
  private n: number;

  constructor(n: number) {
    this.n = n;
    this.t = new Array(n + 1).fill(0);
  }

  // Build from an existing array a[0..n-1] in O(n log n).
  static from(a: number[]): FenwickTree {
    const ft = new FenwickTree(a.length);
    for (let i = 0; i < a.length; i++) ft.update(i + 1, a[i]);
    return ft;
  }

  // The bit trick: lowest set bit of i.
  private lowbit(i: number): number {
    return i & -i;
  }

  // Point update: add delta to position pos (1-indexed).
  // Hops UP: i += lowbit(i) until i > n.  O(log n).
  update(pos: number, delta: number): void {
    for (let i = pos; i <= this.n; i += this.lowbit(i)) {
      this.t[i] += delta;
    }
  }

  // Prefix sum: sum of a[1..k].
  // Hops DOWN: i -= lowbit(i) until i <= 0.  O(log n).
  query(k: number): number {
    let sum = 0;
    for (let i = k; i > 0; i -= this.lowbit(i)) {
      sum += this.t[i];
    }
    return sum;
  }

  // Range sum: sum of a[l..r] (both 1-indexed).
  rangeQuery(l: number, r: number): number {
    return this.query(r) - this.query(l - 1);
  }
}

// Usage
const ft = FenwickTree.from([3, 2, 5, 1, 4, 6, 2, 7]);
console.log(ft.query(8));        // 30  — full prefix
console.log(ft.rangeQuery(3, 6)); // 16  — a[3]+a[4]+a[5]+a[6]
ft.update(5, 10);                // a[5] becomes 14
console.log(ft.query(8));        // 40  — updated prefix`,
    },
    {
      label: "Java",
      language: "java",
      filename: "FenwickTree.java",
      code: `// Fenwick Tree (Binary Indexed Tree) — 1-indexed, point update, prefix sum.
class FenwickTree {
    private final long[] t;
    private final int n;

    FenwickTree(int n) {
        this.n = n;
        this.t = new long[n + 1];
    }

    // Build from an existing array a[0..n-1] in O(n log n).
    static FenwickTree from(int[] a) {
        FenwickTree ft = new FenwickTree(a.length);
        for (int i = 0; i < a.length; i++) ft.update(i + 1, a[i]);
        return ft;
    }

    // The bit trick: lowest set bit of i.
    private int lowbit(int i) {
        return i & -i;
    }

    // Point update: add delta to position pos (1-indexed).
    // Hops UP: i += lowbit(i) until i > n.  O(log n).
    void update(int pos, long delta) {
        for (int i = pos; i <= n; i += lowbit(i)) {
            t[i] += delta;
        }
    }

    // Prefix sum: sum of a[1..k].
    // Hops DOWN: i -= lowbit(i) until i <= 0.  O(log n).
    long query(int k) {
        long sum = 0;
        for (int i = k; i > 0; i -= lowbit(i)) {
            sum += t[i];
        }
        return sum;
    }

    // Range sum: sum of a[l..r] (both 1-indexed).
    long rangeQuery(int l, int r) {
        return query(r) - query(l - 1);
    }
}

// Usage
// FenwickTree ft = FenwickTree.from(new int[]{3, 2, 5, 1, 4, 6, 2, 7});
// System.out.println(ft.query(8));        // 30  — full prefix
// System.out.println(ft.rangeQuery(3, 6)); // 16  — a[3]+a[4]+a[5]+a[6]
// ft.update(5, 10);                       // a[5] becomes 14
// System.out.println(ft.query(8));        // 40  — updated prefix`,
    },
    {
      label: "Python",
      language: "python",
      filename: "fenwick_tree.py",
      code: `# Fenwick Tree (Binary Indexed Tree) — 1-indexed, point update, prefix sum.
class FenwickTree:
    def __init__(self, n: int) -> None:
        self.n = n
        self.t = [0] * (n + 1)

    # Build from an existing array a[0..n-1] in O(n log n).
    @classmethod
    def from_array(cls, a: list[int]) -> "FenwickTree":
        ft = cls(len(a))
        for i, value in enumerate(a):
            ft.update(i + 1, value)
        return ft

    # The bit trick: lowest set bit of i.
    @staticmethod
    def _lowbit(i: int) -> int:
        return i & -i

    # Point update: add delta to position pos (1-indexed).
    # Hops UP: i += lowbit(i) until i > n.  O(log n).
    def update(self, pos: int, delta: int) -> None:
        i = pos
        while i <= self.n:
            self.t[i] += delta
            i += self._lowbit(i)

    # Prefix sum: sum of a[1..k].
    # Hops DOWN: i -= lowbit(i) until i <= 0.  O(log n).
    def query(self, k: int) -> int:
        total = 0
        i = k
        while i > 0:
            total += self.t[i]
            i -= self._lowbit(i)
        return total

    # Range sum: sum of a[l..r] (both 1-indexed).
    def range_query(self, l: int, r: int) -> int:
        return self.query(r) - self.query(l - 1)


# Usage
ft = FenwickTree.from_array([3, 2, 5, 1, 4, 6, 2, 7])
print(ft.query(8))         # 30  — full prefix
print(ft.range_query(3, 6))  # 16  — a[3]+a[4]+a[5]+a[6]
ft.update(5, 10)           # a[5] becomes 14
print(ft.query(8))         # 40  — updated prefix`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "fenwick_tree.cpp",
      code: `// Fenwick Tree (Binary Indexed Tree) — 1-indexed, point update, prefix sum.
#include <vector>

class FenwickTree {
    std::vector<long long> t_;
    int n_;

    // The bit trick: lowest set bit of i.
    static int lowbit(int i) {
        return i & -i;
    }

public:
    explicit FenwickTree(int n) : t_(n + 1, 0), n_(n) {}

    // Build from an existing array a[0..n-1] in O(n log n).
    static FenwickTree from(const std::vector<long long>& a) {
        FenwickTree ft(static_cast<int>(a.size()));
        for (int i = 0; i < static_cast<int>(a.size()); ++i) ft.update(i + 1, a[i]);
        return ft;
    }

    // Point update: add delta to position pos (1-indexed).
    // Hops UP: i += lowbit(i) until i > n.  O(log n).
    void update(int pos, long long delta) {
        for (int i = pos; i <= n_; i += lowbit(i)) {
            t_[i] += delta;
        }
    }

    // Prefix sum: sum of a[1..k].
    // Hops DOWN: i -= lowbit(i) until i <= 0.  O(log n).
    long long query(int k) const {
        long long sum = 0;
        for (int i = k; i > 0; i -= lowbit(i)) {
            sum += t_[i];
        }
        return sum;
    }

    // Range sum: sum of a[l..r] (both 1-indexed).
    long long rangeQuery(int l, int r) const {
        return query(r) - query(l - 1);
    }
};

// Usage
// FenwickTree ft = FenwickTree::from({3, 2, 5, 1, 4, 6, 2, 7});
// ft.query(8);        // 30  — full prefix
// ft.rangeQuery(3, 6); // 16  — a[3]+a[4]+a[5]+a[6]
// ft.update(5, 10);   // a[5] becomes 14
// ft.query(8);        // 40  — updated prefix`,
    },
  ],

  furtherReading: [
    {
      label: "Peter Fenwick — *A new data structure for cumulative frequency tables* (1994)",
      href: "https://doi.org/10.1002/spe.4380240306",
      note: "The original paper (Software: Practice and Experience, 24(3):327–336). Fenwick introduced the structure to speed up arithmetic coding — the competitive-programming use came later.",
      kind: "paper",
    },
    {
      label: "cp-algorithms — Fenwick Tree",
      href: "https://cp-algorithms.com/data_structures/fenwick.html",
      note: "The most thorough free reference: covers construction, prefix queries, range updates via difference BITs, order-statistic binary search on the BIT, and 2-D extensions.",
      kind: "docs",
    },
    {
      label: "TopCoder — Binary Indexed Trees tutorial",
      href: "https://www.topcoder.com/thrive/articles/Binary%20Indexed%20Trees",
      note: "A classic walkthrough by Petar Marić that visualises the lowbit coverage ranges and works through inversion-counting as a worked example.",
      kind: "article",
    },
    {
      label: "Wikipedia — Fenwick tree",
      href: "https://en.wikipedia.org/wiki/Fenwick_tree",
      note: "Solid encyclopaedic reference with history (including Boris Ryabko's 1989 precursor), pseudocode, and a survey of extensions.",
      kind: "article",
    },
    {
      label: "USACO Guide — Point Update Range Sum",
      href: "https://usaco.guide/gold/PURS",
      note: "Contest-focused module comparing BIT, segment tree, and sqrt-decomposition for the same problem class, with annotated C++ and Java solutions.",
      kind: "docs",
    },
    {
      label: "Antti Laaksonen — *Competitive Programmer's Handbook* (free PDF)",
      href: "https://cses.fi/book/book.pdf",
      note: "Chapter 9 covers BITs and segment trees side by side; Chapter 28 extends to 2-D BITs. The whole book is freely downloadable.",
      kind: "book",
    },
    {
      label: "William Fiset — Fenwick Tree range update range query (YouTube)",
      href: "https://www.youtube.com/watch?v=RgITNht_f4Q",
      note: "A 20-minute video that visualises the lowbit decomposition and then derives the two-BIT trick for range updates — a clean complement to reading-only resources.",
      kind: "video",
    },
  ],

  quiz: [
    {
      id: "fenwick-q1",
      question:
        "Cell `t[6]` in a Fenwick tree stores the sum of which elements of the underlying array?",
      options: [
        { id: "a", label: "a[1] through a[6] — the full prefix up to index 6." },
        { id: "b", label: "a[5] and a[6] — exactly two elements, because lowbit(6) = 2." },
        { id: "c", label: "Only a[6] — each cell stores one element." },
        { id: "d", label: "a[4] through a[6] — three elements, because 6 − 3 = 3." },
      ],
      correctOptionId: "b",
      explanation:
        "6 in binary is `110`. The lowest set bit is bit 1 (value 2), so `lowbit(6) = 6 & -6 = 2`. Cell `t[6]` therefore covers a range of length 2 ending at index 6: that's `a[5]` and `a[6]`. In general, `t[i]` covers `a[i - lowbit(i) + 1 .. i]`. Confusing `t[i]` with a full prefix sum is the most common misconception — full prefix sums require summing multiple cells via the query hop-down chain.",
    },
    {
      id: "fenwick-q2",
      question:
        "A point update at index 5 in a Fenwick tree of size 8 modifies which cells?",
      options: [
        { id: "a", label: "Only t[5] — a point update touches one cell by definition." },
        { id: "b", label: "t[5], t[6], t[8] — the cells reached by repeatedly adding lowbit(i)." },
        { id: "c", label: "t[5], t[4], t[8] — the cells on the path to the root." },
        { id: "d", label: "t[5] and t[8] only — lowbit(5) = 4, so only two hops." },
      ],
      correctOptionId: "b",
      explanation:
        "5 is `0b00101`, so `lowbit(5) = 1`. The update chain climbs: 5 → 5+1=6 → 6+lowbit(6)=6+2=8 → 8+lowbit(8)=8+8=16 > 8, stop. Cells touched: `t[5]`, `t[6]`, `t[8]`. These are exactly the cells whose coverage ranges include position 5. Any subsequent `query(k)` for k ≥ 5 will pass through at least one of these cells, ensuring it sees the updated value.",
    },
    {
      id: "fenwick-q3",
      question:
        "Why does a Fenwick tree generally outperform a segment tree in practice for prefix-sum / point-update workloads, even though both are O(log n)?",
      options: [
        { id: "a", label: "Because a Fenwick tree has a lower asymptotic complexity — O(log log n) amortised." },
        { id: "b", label: "Because a Fenwick tree stores the answer to every possible prefix query, making lookups O(1)." },
        { id: "c", label: "Because a Fenwick tree is a single flat array with no pointers, giving better cache locality and a smaller constant factor than a pointer-linked segment tree." },
        { id: "d", label: "Because the Fenwick tree uses binary search internally, which is faster than tree traversal." },
      ],
      correctOptionId: "c",
      explanation:
        "Both structures are O(log n), but constant factors matter enormously at scale. A segment tree typically allocates 4n nodes, each a struct with left/right child indices or pointers; traversing the tree scatters memory accesses across the heap. A Fenwick tree is a single array of length n+1; the hop-down or hop-up chain accesses indices in a pattern that stays warm in cache. Benchmarks on modern hardware consistently show BITs running 2–3× faster per operation than segment trees for pure prefix-sum workloads.",
    },
  ],
};
