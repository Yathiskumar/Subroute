import type { ConceptContent } from "@/lib/content/types";

export const segmentTree: ConceptContent = {
  prototypeCaption:
    "A segment tree built over the default array `a = [3, 2, 5, 1, 4, 6, 2, 7]`. Toggle between **Sum**, **Min**, and **Max** modes to swap the aggregate. Enter `lo` / `hi` and press **Query** to fire a range query — nodes light up *yellow* (visiting), *green* (fully inside, result taken), or *dim* (disjoint, skipped). Enter `idx` / `value` and press **Update** to move a leaf and watch the combines ripple back up the path. Three demo buttons replay: **\"Query full range [1..8]\"**, **\"Query single element [3..3]\"**, and **\"Set a5 = 10, then query [3..6]\"**. The stats bar shows *n*, *height*, the current *result*, and *nodes visited*.",

  overview: [
    {
      type: "p",
      text: "**A segment tree turns any associative aggregation into a O(log n) range query.** Build a complete binary tree over an array of n elements. Each leaf stores one element. Each internal node stores the combined aggregate — sum, minimum, maximum, GCD, or anything else you can merge — for the contiguous sub-array its subtree covers. The root covers `[0..n-1]`; the two children split that range in half, recursively, down to single-element leaves. With O(n) space (typically a flat array of size 4n) you get every range query you'll ever need, answered in O(log n) time.",
    },
    {
      type: "p",
      text: "The query algorithm is driven by **three overlap cases** between the query range `[l..r]` and the node's range `[nl..nr]`. **DISJOINT**: if `[nl..nr]` and `[l..r]` don't overlap at all, return the identity element immediately — this entire subtree is irrelevant. **FULLY INSIDE**: if `[nl..nr]` is completely contained within `[l..r]`, return the node's stored value without recursing — this node's aggregate is exact. **PARTIAL**: if they partially overlap, recurse into *both* children and combine their answers. The magic is that at each level of the tree, at most *four* nodes are in the partial state; every other node is either fully inside or disjoint. This bounds the work to O(log n) even when the query range is huge.",
    },
    {
      type: "p",
      text: "Point updates are the mirror image. Walk from root to the target leaf, following the half that contains the index. Change the leaf's value, then on the way *back up* recompute each ancestor from its two children. The path is O(log n) nodes long, so the total update cost is O(log n). This is the essential trade-off versus a plain prefix-sum array: prefix sums answer range-sum queries in O(1) but require O(n) to rebuild after any update. The segment tree sacrifices a log factor on queries to make updates equally fast — a critical property for any workload that mixes reads and writes on live data.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Build — O(n) time, O(n) space" },
    {
      type: "ol",
      items: [
        "Allocate a flat array `tree` of size `4n` (a safe upper bound). Node 1 is the root; node `i`'s children are `2i` and `2i+1`.",
        "Recursively build: `build(node, nl, nr)` — if `nl === nr`, set `tree[node] = a[nl]` (leaf). Otherwise, split at mid = ⌊(nl+nr)/2⌋, recurse on both children, then set `tree[node] = combine(tree[2·node], tree[2·node+1])`.",
        "The recursion bottoms out at n leaves and does O(1) work per internal node, so total build time is O(n).",
      ],
    },
    { type: "h", text: "Range query — three overlap cases" },
    {
      type: "ol",
      items: [
        "**DISJOINT** (`nr < l` or `r < nl`): the node's range is entirely outside the query range. Return the identity element (`0` for sum, `+∞` for min, `-∞` for max). Do not recurse.",
        "**FULLY INSIDE** (`l ≤ nl` and `nr ≤ r`): the node's range is completely covered by the query range. Return `tree[node]` directly. Do not recurse.",
        "**PARTIAL**: the ranges overlap but neither contains the other. Split at mid, recurse on both children, return `combine(left_result, right_result)`.",
      ],
    },
    { type: "h", text: "Point update — O(log n)" },
    {
      type: "ol",
      items: [
        "Recurse from root to the target leaf, going left if `idx ≤ mid`, right otherwise.",
        "At the leaf (`nl === nr === idx`), set `tree[node] = newValue`.",
        "On the way *back up*, recompute each ancestor: `tree[node] = combine(tree[2·node], tree[2·node+1])`.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Associativity is the only requirement",
      text: "The combine function must be **associative**: `combine(a, combine(b, c)) === combine(combine(a, b), c)`. It does *not* need to be commutative (though sum/min/max happen to be). This is why segment trees handle GCD, bitwise AND/OR, matrix multiplication over ranges, and even custom merge functions — anything that can be split and rejoined in any bracket order works.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Lazy propagation for range updates",
      text: "A point update is O(log n), but updating every element in a range `[l..r]` naively costs O(n log n). **Lazy propagation** fixes this: instead of pushing a range update all the way to the leaves immediately, store a *pending tag* at the highest fully-covered node and propagate it downward only when that node is visited next. This keeps both range updates and range queries at O(log n). Lazy propagation is the standard extension for problems like 'add 5 to every element in [3..7], then query the sum of [1..8].'",
    },
  ],

  whenToUse: [
    { type: "h", text: "Reach for a segment tree when" },
    {
      type: "ul",
      items: [
        "You need **range queries and point updates** on the same array — the core sweet spot. Any workload that mixes 'read a range aggregate' with 'change one element' is a segment tree problem.",
        "The **aggregate is not just a sum** — range minimum, range maximum, range GCD, range bitwise OR. Fenwick trees natively support only prefix sums (and, with tricks, range sums); segment trees support any associative operation.",
        "You need **range updates** in addition to range queries — add lazy propagation and both stay O(log n).",
        "You need to **query and update offline** on static-size arrays — segment trees work on arrays that don't grow or shrink (for dynamic sizes, consider a dynamic segment tree or a balanced BST).",
        "Competitive programming problems that mention 'range query' and 'update' together almost always call for a segment tree.",
      ],
    },
    { type: "h", text: "When to consider the alternatives" },
    {
      type: "ul",
      items: [
        "**Prefix-sum array**: if your array is *read-only after initial build*, prefix sums answer range-sum queries in O(1) with O(n) space and trivial code. No updates allowed.",
        "**Fenwick tree (Binary Indexed Tree)**: if you need only point updates and prefix sums (or range sums), the Fenwick tree has the same O(log n) complexity but uses ~2× less memory, has a smaller constant, and fits in ~10 lines. Pick Fenwick for sum-only workloads; pick segment tree when the operation is anything else or when you need lazy range updates.",
        "**Sparse table**: for *static* range-minimum / range-maximum queries with O(1) query time and O(n log n) build — but no updates at all.",
        "**Sqrt decomposition**: simpler to implement (no recursion), handles a wider variety of non-associative queries, but O(√n) per operation instead of O(log n).",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**O(log n) range queries for any associative operation** — sum, min, max, GCD, bitwise ops, matrix products, custom merges all fit the same template.",
      "**O(log n) point updates** — unlike prefix-sum arrays which need O(n) to rebuild after a change.",
      "**O(n) build time** — the full tree is constructed in a single O(n) bottom-up or top-down pass.",
      "**Lazy propagation extends it to O(log n) range updates** — 'add 5 to [3..7]' costs the same as a single point update.",
      "**Flat-array implementation** — storing the tree in a 1-indexed array of size 4n is cache-friendly and avoids pointer overhead. No dynamic allocation needed.",
    ],
    cons: [
      "**~4× memory overhead** — the tree array needs up to 4n nodes. A Fenwick tree on the same data needs exactly n+1 cells.",
      "**Larger constant than Fenwick** — recursive calls, range comparisons, and combine logic add up. For sum-only workloads with tight time limits, Fenwick wins on raw speed.",
      "**Non-trivial to implement correctly** — off-by-one errors in range splits, wrong identity elements, and forgetting to push lazy tags down before recursing are all common bugs.",
      "**Lazy propagation multiplies complexity** — the basic structure is ~30 lines; full lazy propagation can triple that, and each new operation type needs a custom 'tag compose' function.",
      "**Static size** — a standard segment tree is built over a fixed n. Handling insertions or deletions requires a dynamic/implicit segment tree, which is substantially more complex.",
    ],
  },

  handsOn: [
    {
      title: "01 · Two range queries — full cover vs. single element",
      body: "Click **\"Query full range [1..8]\"**. Watch the root (covering `[1..8]`) immediately go *green* — it's FULLY INSIDE the query range, so the result is taken without a single recursion into children. The stats bar shows **visited = 1**. Now click **\"Query single element [3..3]\"** and watch the opposite: the tree descends all the way to the leaf at index 3, and every sibling node along the path goes *dim* (DISJOINT). Notice how nodes at each level split the decision — left child is disjoint or fully inside, right child continues narrowing. This is the three-overlap-case engine: at most four nodes are in the PARTIAL state at any level, which is why the visited count is bounded by O(log n) even for arbitrary ranges.",
    },
    {
      title: "02 · Point update then range query",
      body: "Click **\"Set a5 = 10, then query [3..6]\"**. First, the update animation highlights the root-to-leaf path for index 5 in *yellow* as it descends; when it hits the leaf it changes the stored value, then the *green* recompute sweeps back up — each ancestor recalculates from its two children. Then the query fires on `[3..6]`: compare the result to what you'd get without the update (the original array gives sum=1+4+6+2=13 for indices 3-6; after setting a5=10 the result should be 1+10+6+2=19 for sum mode). Toggle to **Min** and re-run the demo — the update propagation looks identical, but the merge logic changes and so does the answer.",
    },
    {
      title: "03 · Toggle Sum / Min / Max and re-query",
      body: "Enter `lo=2`, `hi=6` in the query inputs and press **Query** in **Sum** mode — note the result. Now switch to **Min** and press **Query** again (the range stays). The visited node pattern is *identical* — the same three-overlap-case traversal — but the green nodes now return their minimum instead of their sum, and the combines along partial nodes take `Math.min` instead of `+`. Switch to **Max** and repeat. This is the segment tree's generality: one traversal algorithm, swappable combine function. The only thing that changes between the three modes is what `combine(a, b)` returns and what identity element is returned for DISJOINT nodes.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Try entering a query range that's just one element wide: `lo=hi=4`. Count the *visited* nodes — it should equal the tree height (roughly log₂ 8 = 3 internal levels plus the leaf). Now enter the widest possible range `lo=1, hi=8` — visited should be 1 (root is fully inside). Notice the worst case is a range like `lo=2, hi=7` — count visited and see how the partial nodes at each level multiply. Finally, hammer the **Update** button repeatedly with different index/value pairs and watch the path light up each time. Can you craft a sequence of updates and queries that produces a surprising result? Try setting all values to the same number, then querying Min — the tree should collapse to that value everywhere.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "segment-tree.ts",
      code: `// Recursive segment tree supporting sum / min / max via a swappable combine.
// tree[] is 1-indexed; node i's children are 2i and 2i+1.
// Build is O(n); query and point-update are O(log n).

type Combine = (a: number, b: number) => number;

class SegmentTree {
  private tree: number[];
  private n: number;
  private combine: Combine;
  private identity: number;

  constructor(a: number[], combine: Combine, identity: number) {
    this.n = a.length;
    this.combine = combine;
    this.identity = identity;
    this.tree = new Array(4 * this.n).fill(identity);
    this.build(a, 1, 0, this.n - 1);
  }

  private build(a: number[], node: number, nl: number, nr: number): void {
    if (nl === nr) { this.tree[node] = a[nl]; return; }
    const mid = (nl + nr) >> 1;
    this.build(a, 2 * node,     nl,      mid);
    this.build(a, 2 * node + 1, mid + 1, nr);
    this.tree[node] = this.combine(this.tree[2 * node], this.tree[2 * node + 1]);
  }

  query(l: number, r: number, node = 1, nl = 0, nr = this.n - 1): number {
    if (nr < l || r < nl) return this.identity;          // DISJOINT
    if (l <= nl && nr <= r) return this.tree[node];      // FULLY INSIDE
    const mid = (nl + nr) >> 1;                          // PARTIAL — recurse
    return this.combine(
      this.query(l, r, 2 * node,     nl,      mid),
      this.query(l, r, 2 * node + 1, mid + 1, nr),
    );
  }

  update(idx: number, val: number, node = 1, nl = 0, nr = this.n - 1): void {
    if (nl === nr) { this.tree[node] = val; return; }    // leaf — set
    const mid = (nl + nr) >> 1;
    if (idx <= mid) this.update(idx, val, 2 * node,     nl,      mid);
    else            this.update(idx, val, 2 * node + 1, mid + 1, nr);
    this.tree[node] = this.combine(this.tree[2 * node], this.tree[2 * node + 1]);
  }
}

// Usage:
const a = [3, 2, 5, 1, 4, 6, 2, 7];
const sumTree = new SegmentTree(a, (x, y) => x + y, 0);
const minTree = new SegmentTree(a, Math.min,          Infinity);
const maxTree = new SegmentTree(a, Math.max,         -Infinity);

console.log(sumTree.query(2, 5)); // sum of a[2..5] = 5+1+4+6 = 16
sumTree.update(4, 10);            // set a[4] = 10
console.log(sumTree.query(2, 5)); // 5+1+10+6 = 22`,
    },
    {
      label: "Java",
      language: "java",
      filename: "SegmentTree.java",
      code: `// Recursive segment tree supporting sum / min / max via a swappable combine.
// tree[] is 1-indexed; node i's children are 2i and 2i+1.
// Build is O(n); query and point-update are O(log n).

import java.util.Arrays;
import java.util.function.LongBinaryOperator;

class SegmentTree {
    private final long[] tree;
    private final int n;
    private final LongBinaryOperator combine;
    private final long identity;

    SegmentTree(long[] a, LongBinaryOperator combine, long identity) {
        this.n = a.length;
        this.combine = combine;
        this.identity = identity;
        this.tree = new long[4 * n];
        Arrays.fill(this.tree, identity);
        build(a, 1, 0, n - 1);
    }

    private void build(long[] a, int node, int nl, int nr) {
        if (nl == nr) { tree[node] = a[nl]; return; }
        int mid = (nl + nr) >> 1;
        build(a, 2 * node,     nl,      mid);
        build(a, 2 * node + 1, mid + 1, nr);
        tree[node] = combine.applyAsLong(tree[2 * node], tree[2 * node + 1]);
    }

    long query(int l, int r) { return query(l, r, 1, 0, n - 1); }

    private long query(int l, int r, int node, int nl, int nr) {
        if (nr < l || r < nl) return identity;            // DISJOINT
        if (l <= nl && nr <= r) return tree[node];        // FULLY INSIDE
        int mid = (nl + nr) >> 1;                         // PARTIAL — recurse
        return combine.applyAsLong(
            query(l, r, 2 * node,     nl,      mid),
            query(l, r, 2 * node + 1, mid + 1, nr));
    }

    void update(int idx, long val) { update(idx, val, 1, 0, n - 1); }

    private void update(int idx, long val, int node, int nl, int nr) {
        if (nl == nr) { tree[node] = val; return; }       // leaf — set
        int mid = (nl + nr) >> 1;
        if (idx <= mid) update(idx, val, 2 * node,     nl,      mid);
        else            update(idx, val, 2 * node + 1, mid + 1, nr);
        tree[node] = combine.applyAsLong(tree[2 * node], tree[2 * node + 1]);
    }
}

// Usage:
// long[] a = {3, 2, 5, 1, 4, 6, 2, 7};
// SegmentTree sumTree = new SegmentTree(a, Long::sum, 0);
// SegmentTree minTree = new SegmentTree(a, Math::min, Long.MAX_VALUE);
// SegmentTree maxTree = new SegmentTree(a, Math::max, Long.MIN_VALUE);
//
// System.out.println(sumTree.query(2, 5)); // sum of a[2..5] = 5+1+4+6 = 16
// sumTree.update(4, 10);                    // set a[4] = 10
// System.out.println(sumTree.query(2, 5)); // 5+1+10+6 = 22`,
    },
    {
      label: "Python",
      language: "python",
      filename: "segment_tree.py",
      code: `# Recursive segment tree supporting sum / min / max via a swappable combine.
# tree[] is 1-indexed; node i's children are 2i and 2i+1.
# Build is O(n); query and point-update are O(log n).

from typing import Callable, List


class SegmentTree:
    def __init__(self, a: List[int], combine: Callable[[int, int], int], identity: int) -> None:
        self.n = len(a)
        self.combine = combine
        self.identity = identity
        self.tree = [identity] * (4 * self.n)
        self._build(a, 1, 0, self.n - 1)

    def _build(self, a: List[int], node: int, nl: int, nr: int) -> None:
        if nl == nr:
            self.tree[node] = a[nl]
            return
        mid = (nl + nr) >> 1
        self._build(a, 2 * node,     nl,      mid)
        self._build(a, 2 * node + 1, mid + 1, nr)
        self.tree[node] = self.combine(self.tree[2 * node], self.tree[2 * node + 1])

    def query(self, l: int, r: int, node: int = 1, nl: int = 0, nr: int = None) -> int:
        if nr is None:
            nr = self.n - 1
        if nr < l or r < nl:                              # DISJOINT
            return self.identity
        if l <= nl and nr <= r:                           # FULLY INSIDE
            return self.tree[node]
        mid = (nl + nr) >> 1                              # PARTIAL — recurse
        return self.combine(
            self.query(l, r, 2 * node,     nl,      mid),
            self.query(l, r, 2 * node + 1, mid + 1, nr),
        )

    def update(self, idx: int, val: int, node: int = 1, nl: int = 0, nr: int = None) -> None:
        if nr is None:
            nr = self.n - 1
        if nl == nr:                                      # leaf — set
            self.tree[node] = val
            return
        mid = (nl + nr) >> 1
        if idx <= mid:
            self.update(idx, val, 2 * node,     nl,      mid)
        else:
            self.update(idx, val, 2 * node + 1, mid + 1, nr)
        self.tree[node] = self.combine(self.tree[2 * node], self.tree[2 * node + 1])


# Usage:
a = [3, 2, 5, 1, 4, 6, 2, 7]
sum_tree = SegmentTree(a, lambda x, y: x + y, 0)
min_tree = SegmentTree(a, min, float("inf"))
max_tree = SegmentTree(a, max, float("-inf"))

print(sum_tree.query(2, 5))  # sum of a[2..5] = 5+1+4+6 = 16
sum_tree.update(4, 10)       # set a[4] = 10
print(sum_tree.query(2, 5))  # 5+1+10+6 = 22`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "segment_tree.cpp",
      code: `// Recursive segment tree supporting sum / min / max via a swappable combine.
// tree[] is 1-indexed; node i's children are 2i and 2i+1.
// Build is O(n); query and point-update are O(log n).
#include <algorithm>
#include <functional>
#include <vector>

class SegmentTree {
    std::vector<long long> tree_;
    int n_;
    std::function<long long(long long, long long)> combine_;
    long long identity_;

public:
    SegmentTree(const std::vector<long long>& a,
                std::function<long long(long long, long long)> combine,
                long long identity)
        : tree_(4 * a.size(), identity), n_(a.size()),
          combine_(std::move(combine)), identity_(identity) {
        build(a, 1, 0, n_ - 1);
    }

    long long query(int l, int r) { return query(l, r, 1, 0, n_ - 1); }

    void update(int idx, long long val) { update(idx, val, 1, 0, n_ - 1); }

private:
    void build(const std::vector<long long>& a, int node, int nl, int nr) {
        if (nl == nr) { tree_[node] = a[nl]; return; }
        int mid = (nl + nr) >> 1;
        build(a, 2 * node,     nl,      mid);
        build(a, 2 * node + 1, mid + 1, nr);
        tree_[node] = combine_(tree_[2 * node], tree_[2 * node + 1]);
    }

    long long query(int l, int r, int node, int nl, int nr) {
        if (nr < l || r < nl) return identity_;           // DISJOINT
        if (l <= nl && nr <= r) return tree_[node];       // FULLY INSIDE
        int mid = (nl + nr) >> 1;                          // PARTIAL — recurse
        return combine_(
            query(l, r, 2 * node,     nl,      mid),
            query(l, r, 2 * node + 1, mid + 1, nr));
    }

    void update(int idx, long long val, int node, int nl, int nr) {
        if (nl == nr) { tree_[node] = val; return; }      // leaf — set
        int mid = (nl + nr) >> 1;
        if (idx <= mid) update(idx, val, 2 * node,     nl,      mid);
        else            update(idx, val, 2 * node + 1, mid + 1, nr);
        tree_[node] = combine_(tree_[2 * node], tree_[2 * node + 1]);
    }
};

// Usage:
// std::vector<long long> a = {3, 2, 5, 1, 4, 6, 2, 7};
// const long long NEG_INF = std::numeric_limits<long long>::min();
// const long long POS_INF = std::numeric_limits<long long>::max();
// SegmentTree sumTree(a, [](long long x, long long y) { return x + y; }, 0);
// SegmentTree minTree(a, [](long long x, long long y) { return std::min(x, y); }, POS_INF);
// SegmentTree maxTree(a, [](long long x, long long y) { return std::max(x, y); }, NEG_INF);
//
// sumTree.query(2, 5); // sum of a[2..5] = 5+1+4+6 = 16
// sumTree.update(4, 10); // set a[4] = 10
// sumTree.query(2, 5); // 5+1+10+6 = 22`,
    },
  ],

  furtherReading: [
    {
      label: "cp-algorithms.com — Segment Tree",
      href: "https://cp-algorithms.com/data_structures/segment_tree.html",
      note: "The single most comprehensive free reference: covers basic sum/min/max trees, advanced modifications (painting segments, finding the k-th zero), lazy propagation, and memory-optimised iterative variants. Bookmark this.",
      kind: "docs",
    },
    {
      label: "Antti Laaksonen — *Competitive Programmer's Handbook* (free PDF)",
      href: "https://cses.fi/book/book.pdf",
      note: "Chapter 9 gives a concise, competition-focused treatment of segment trees and Fenwick trees side-by-side — the clearest written comparison of the two structures. Free, legal, 300 pages.",
      kind: "book",
    },
    {
      label: "Codeforces EDU — Segment Tree (Part 1 & 2)",
      href: "https://codeforces.com/edu/course/2",
      note: "Video lectures + graded problems from Codeforces's official education track. Part 1 covers the basics; Part 2 covers lazy propagation with a sequence of escalating exercises.",
      kind: "video",
    },
    {
      label: "Wikipedia — Segment tree",
      href: "https://en.wikipedia.org/wiki/Segment_tree",
      note: "Solid encyclopaedic overview with the fractional cascading variant, history, and a survey of geometric applications (stabbing queries, interval scheduling) that go beyond the competitive-programming use case.",
      kind: "article",
    },
    {
      label: "USACO Guide — Point Update Range Sum",
      href: "https://usaco.guide/gold/PURS",
      note: "Side-by-side recursive and iterative segment tree implementations with USACO/CSES practice problems. The best entry point if you're working through a structured contest curriculum.",
      kind: "docs",
    },
    {
      label: "GeeksforGeeks — Segment Tree",
      href: "https://www.geeksforgeeks.org/segment-tree-data-structure/",
      note: "Good for a second explanation with extra worked examples (range minimum, lazy propagation for range add) and a large problem set linked at the bottom.",
      kind: "article",
    },
    {
      label: "YouTube — Segment Tree Range Minimum Query (William Fiset)",
      href: "https://www.youtube.com/watch?v=ZBHKZF5w4YU",
      note: "A 20-minute visual walkthrough of building, querying, and updating a segment tree. The animation of the three overlap cases is the clearest visual explanation of why the query visits only O(log n) nodes.",
      kind: "video",
    },
  ],

  quiz: [
    {
      id: "segtree-q1",
      question:
        "A range query on a segment tree visits at most O(log n) nodes even when the query range spans nearly the whole array. Why?",
      options: [
        {
          id: "a",
          label:
            "Because the tree is balanced, so any path from root to leaf is O(log n) long.",
        },
        {
          id: "b",
          label:
            "Because at each level of the tree, at most four nodes are in the PARTIAL state; every other node is either FULLY INSIDE (taken immediately) or DISJOINT (skipped immediately).",
        },
        {
          id: "c",
          label:
            "Because the algorithm sorts the array before querying, reducing the search space.",
        },
        {
          id: "d",
          label:
            "Because the segment tree only stores aggregates for power-of-two ranges.",
        },
      ],
      correctOptionId: "b",
      explanation:
        "The key insight is the three-case rule. At any given depth, the query range `[l..r]` can create at most two 'boundary' nodes where the overlap is partial — one on the left fringe and one on the right fringe. All nodes strictly between those boundaries are FULLY INSIDE (result taken immediately) and all nodes outside are DISJOINT (skipped immediately). Since the tree has O(log n) levels and at most 4 partial nodes per level, total work is O(4 log n) = O(log n). The balance of the tree is necessary for O(log n) depth, but it's the three-case classification that bounds the work per level.",
    },
    {
      id: "segtree-q2",
      question:
        "Which of the following aggregate functions CANNOT be supported by a standard segment tree?",
      options: [
        { id: "a", label: "Range GCD (greatest common divisor of a[l..r])." },
        {
          id: "b",
          label: "Range median (the middle value of a sorted sub-array).",
        },
        { id: "c", label: "Range bitwise AND of all elements in a[l..r]." },
        {
          id: "d",
          label:
            "Range sum with a lazy 'add k to every element in a sub-range' update.",
        },
      ],
      correctOptionId: "b",
      explanation:
        "A segment tree's combine function must be **associative**: you must be able to merge the answers for `[l..mid]` and `[mid+1..r]` into the answer for `[l..r]` using only the two sub-answers. GCD, bitwise AND, and sum (with lazy add) all satisfy this — you can compute them from the left-half result and right-half result alone. Median is different: knowing the median of the left half and the median of the right half is not enough to determine the median of the whole range. You'd need the full sorted sub-array. (There are advanced data structures — merge sort trees, wavelet trees — that handle this, but they're not standard segment trees.)",
    },
    {
      id: "segtree-q3",
      question:
        "When should you choose a Fenwick tree (Binary Indexed Tree) over a segment tree?",
      options: [
        {
          id: "a",
          label:
            "When you need range minimum queries — Fenwick trees are faster for min.",
        },
        {
          id: "b",
          label:
            "When you need lazy range updates — Fenwick trees handle them more efficiently.",
        },
        {
          id: "c",
          label:
            "When you need only point updates and prefix/range sums, and you want smaller code and lower constant factor.",
        },
        {
          id: "d",
          label:
            "When the array size is unknown at build time — Fenwick trees resize dynamically.",
        },
      ],
      correctOptionId: "c",
      explanation:
        "Fenwick trees are essentially a space-optimised, faster-constant implementation of the segment tree *restricted to prefix sums*. They need n+1 cells (vs up to 4n for a segment tree), have no recursion overhead, and fit in ~10 lines of code. Choose Fenwick when the operation is addition (or can be reduced to prefix sums) and you don't need range updates via lazy propagation. Choose a segment tree when you need any other associative operation (min, max, GCD, …) or when you need lazy range updates — Fenwick trees do not support these without significant contortion.",
    },
  ],
};
