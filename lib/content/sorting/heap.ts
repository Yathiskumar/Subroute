import type { ConceptContent } from "@/lib/content/types";

export const heap: ConceptContent = {
  prototypeCaption:
    "The array becomes a binary tree on top; the heap is built by sifting parents down (Phase: Build), then the root (max) is repeatedly swapped to the end and the heap shrinks (Phase: Sort). Press **Play**, **Step** / **Back** to walk each compare-and-swap, **Shuffle** for a new list.",

  overview: [
    {
      type: "p",
      text: "**Heap sort is the algorithm with the most reassuring promise of any comparison sort: O(n log n) on every input, in-place.** No quicksort-style adversarial pivot. No merge sort-style O(n) extra memory. Heap sort gives you both guarantees at once, and the price is a slightly worse constant factor than quicksort on random data.",
    },
    {
      type: "p",
      text: "The trick is the **binary heap** data structure: an array we *interpret* as a complete binary tree, with the rule that every parent ≥ its children (a max-heap). Parent of index `i` is `(i-1)/2`; children are `2i+1` and `2i+2`. With that one structural invariant, the largest value always sits at index 0.",
    },
    {
      type: "p",
      text: "Sorting becomes a two-phase job. **Build phase:** turn the array into a max-heap with a single bottom-up sweep — O(n), surprisingly. **Sort phase:** repeatedly swap the root (max) to the end, shrink the heap by one, and `sift-down` the new root to re-establish the heap property. Each sift is O(log n) and we do n of them. n log n total, in-place, predictable, and no recursion at all if you're careful.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The heap, as an array" },
    {
      type: "ol",
      items: [
        "Treat `a[0]` as the tree root.",
        "For any index `i`: left child is at `2i + 1`, right child at `2i + 2`, parent at `(i - 1) / 2` (integer division).",
        "Max-heap invariant: `a[parent(i)] >= a[i]` for every i ≥ 1.",
        "Consequence: `a[0]` is the global maximum, always.",
      ],
    },
    { type: "h", text: "sift-down(i, size)" },
    {
      type: "ol",
      items: [
        "Look at `i`'s children (within `size`). Pick the larger of the two (or the only one if there's just one).",
        "If that child is bigger than `a[i]`, swap and recurse into the child's slot.",
        "Otherwise stop — the invariant holds.",
      ],
    },
    { type: "h", text: "Build phase — O(n)" },
    {
      type: "ol",
      items: [
        "Loop `i` from `(n / 2) - 1` down to 0 — every non-leaf index, in reverse.",
        "For each `i`, call `sift-down(i, n)`.",
        "Bottom-up beats top-down by an order: most calls only sift a few levels, and the math works out to O(n) total, not O(n log n).",
      ],
    },
    { type: "h", text: "Sort phase — O(n log n)" },
    {
      type: "ol",
      items: [
        "Swap `a[0]` (current max) with `a[size - 1]`.",
        "Decrement `size` — the just-locked max is no longer part of the heap.",
        "`sift-down(0, size)` to restore the invariant on the smaller heap.",
        "Repeat until `size == 1`. Now the array is sorted ascending.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why building a heap is O(n), not O(n log n)",
      text: "Bottom-up build does sift-down at every non-leaf. Most non-leaves are near the bottom and only sift down a few levels. The sum across levels is n/2 · 1 + n/4 · 2 + n/8 · 3 + … which converges to ≈ 2n. Top-down build (insert one at a time) would be O(n log n) — a real and avoidable cost.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Heap sort isn't stable",
      text: "The big swap-root-with-end step jumps an equal-keyed value past arbitrarily many others. If you need stability, mergesort or Timsort are the comparison-sort options.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Hard worst-case guarantees** — embedded systems, real-time controllers, anywhere you can't afford an O(n²) outlier.",
        "**Memory-constrained sorting** — in-place, no extra buffer, no recursion stack if you write it iteratively.",
        "**As introsort's fallback** — once quicksort detects recursion blowing up, it switches to heap sort to finish in O(n log n).",
        "**Priority queues** — the heap itself is the structure behind std::priority_queue, Python's heapq, Dijkstra and A* open-sets.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You want maximum in-memory speed on random data** — quicksort wins on constants by ~2×.",
        "**You need stability** — heap sort isn't stable; mergesort and Timsort are.",
        "**You're sorting nearly-sorted data** — heap sort doesn't adapt; Timsort exploits existing runs.",
        "**The data is integers in a small range** — counting / radix beat O(n log n) entirely.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Guaranteed O(n log n)** on every input — no worst-case landmine.",
      "**In-place** — O(1) extra memory; the heap lives inside the input array.",
      "**No recursion** if implemented iteratively — predictable stack usage.",
      "**The heap is independently useful** — same code powers Dijkstra, A*, top-k queries, and event-loop schedulers.",
    ],
    cons: [
      "**Slower than quicksort on random data** — worse cache behaviour because parent-to-child jumps skip around in memory.",
      "**Not stable** — equal-keyed elements can be reordered by the big swap.",
      "**Doesn't adapt** — sorted input still takes full O(n log n).",
      "**Less educational** than merge sort for divide-and-conquer; the heap data structure is the real concept to learn.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through the two phases",
      body: "Press **Play**. Watch the *Phase* stat switch from **Build** to **Sort**. In Build, parents sift down to establish the max-heap. In Sort, the root (always the current max) swaps with the last heap slot, the heap shrinks, and the new root sifts down. After n-1 iterations of Sort, the array is sorted.",
    },
    {
      title: "02 · Watch a sift-down",
      body: "Use **Step** until you see a purple focus node with two orange children. Step once more — the focus compares against its children, picks the bigger, and swaps if needed. The focus walks down the tree until it lands on a node that's bigger than both its children.",
    },
    {
      title: "03 · See the array-as-tree mapping",
      body: "The tree at the top and the bar row beneath show the same data. Index 0 is the root, 1 and 2 are its children, 3–6 are the grandchildren. Every parent in the tree should be at least as tall as its children when the heap invariant holds. After Build phase, scan visually: every parent ≥ children.",
    },
    {
      title: "04 · Shuffle and compare comparisons",
      body: "Press **Shuffle** and step through. On a random 7-element input, expect about 12 comparisons in Build phase and another 30+ in Sort phase. Total stays near n log n regardless of how scrambled the input is — no best case, no worst case, same work either way.",
    },
  ],

  code: {
    language: "typescript",
    filename: "heap-sort.ts",
    code: `// Heap sort — in-place, O(n log n) on every input, not stable.
function heapSort<T>(a: T[]): T[] {
  const n = a.length;
  // Phase 1: build max-heap bottom-up (O(n), not O(n log n)).
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(a, i, n);
  // Phase 2: pull the max to the end, shrink, re-heapify.
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(a, 0, end);
  }
  return a;
}

function siftDown<T>(a: T[], i: number, size: number): void {
  while (true) {
    const l = 2 * i + 1, r = 2 * i + 2;
    let largest = i;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest === i) break;
    [a[i], a[largest]] = [a[largest], a[i]];
    i = largest;
  }
}

// Example
heapSort([12, 11, 13, 5, 6, 7]);
// → [5, 6, 7, 11, 12, 13]`,
  },

  furtherReading: [
    {
      label: "J. W. J. Williams — *Algorithm 232: Heapsort* (1964)",
      href: "https://dl.acm.org/doi/10.1145/512274.512284",
      note: "The original paper that introduced both the binary heap and heap sort. Two pages, dense — and still the canonical reference.",
      kind: "paper",
    },
    {
      label: "Robert Floyd — *Algorithm 245: Treesort* (1964)",
      href: "https://dl.acm.org/doi/10.1145/355588.365103",
      note: "Floyd's bottom-up build-heap algorithm — the O(n) construction the modern sort uses, published a few months after Williams.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, Ch. 6 Heapsort",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The standard treatment, including the proof that bottom-up build is O(n) (the sum-of-heights argument).",
      kind: "book",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms* §2.4 Priority Queues",
      href: "https://algs4.cs.princeton.edu/24pq/",
      note: "Covers the heap as a priority queue first, then shows heap sort as a clean falls-out application. Great if you want intuition before formalism.",
      kind: "book",
    },
    {
      label: "David Musser — *Introsort* (1997)",
      href: "https://www.cs.rpi.edu/~musser/gp/algorithms.pdf",
      note: "Defines std::sort. Quicksort with a heap-sort escape hatch when recursion depth exceeds 2 log n. Heap sort's most important production role.",
      kind: "paper",
    },
    {
      label: "Wikipedia — Heapsort",
      href: "https://en.wikipedia.org/wiki/Heapsort",
      note: "Has the Floyd's bottom-up sift-down optimization (skip the equality check on the way down, fix it up on the way back), which knocks roughly 30% off comparisons.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "hs-q1",
      question:
        "Why is the build-heap phase O(n) and not O(n log n)?",
      options: [
        { id: "a", label: "Because the inner loop runs only on the first half of the array." },
        { id: "b", label: "Because most non-leaves are near the bottom of the tree and only sift down a few levels; the sum across all levels is O(n)." },
        { id: "c", label: "Because the heap is binary." },
        { id: "d", label: "Because the array is already in heap order after a single pass." },
      ],
      correctOptionId: "b",
      explanation:
        "The bottom-up build has n/2 leaves doing 0 work, n/4 nodes doing 1 sift, n/8 doing 2, etc. Summing n/4·1 + n/8·2 + n/16·3 + … converges to a constant times n — roughly 2n total operations. Top-down (insert one at a time) really is O(n log n); bottom-up gets the n speedup.",
    },
    {
      id: "hs-q2",
      question:
        "Where does heap sort's structure show up *outside* of sorting?",
      options: [
        { id: "a", label: "Inside std::priority_queue, Python's heapq, Dijkstra's open set, A* search, and event-loop schedulers." },
        { id: "b", label: "Only in academic textbooks." },
        { id: "c", label: "In hash tables." },
        { id: "d", label: "In B-trees on disk." },
      ],
      correctOptionId: "a",
      explanation:
        "The binary heap is the data structure, heap sort is one specific use of it. Priority queues power Dijkstra/A*, top-k queries, OS schedulers, event loops, top-of-feed ranking. Learning heap sort is mostly an excuse to learn the heap.",
    },
    {
      id: "hs-q3",
      question:
        "In `std::sort` (C++ standard library), what role does heap sort play?",
      options: [
        { id: "a", label: "It's the primary algorithm; quicksort isn't used." },
        { id: "b", label: "It's the fallback in introsort: quicksort runs until recursion depth exceeds 2 log n, then switches to heap sort to guarantee O(n log n)." },
        { id: "c", label: "It's used only for sorting tiny arrays." },
        { id: "d", label: "It's used only for sorting strings." },
      ],
      correctOptionId: "b",
      explanation:
        "Introsort starts with quicksort and tracks recursion depth. If depth exceeds 2·⌊log n⌋, it switches the current sub-array to heap sort. The result is quicksort's speed on average and heap sort's worst-case guarantee. That's std::sort, .NET's Array.Sort for value types, and several Rust sort implementations.",
    },
  ],
};
