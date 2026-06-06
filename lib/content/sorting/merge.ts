import type { ConceptContent } from "@/lib/content/types";

export const merge: ConceptContent = {
  prototypeCaption:
    "The array is split in half, halved again, and again, until each piece is one element — then the pieces are merged back in sorted order. Press **Play** for one full divide-and-conquer pass, **Step** / **Back** to follow each split and merge, **Shuffle** for a new list.",

  overview: [
    {
      type: "p",
      text: "**Merge sort is the first algorithm where the wins of divide-and-conquer become visible.** Split the array in half. Sort each half (recursively). Merge the two sorted halves into one sorted array. That's it — three steps, all of them obvious, and the result is O(n log n) on **every input**, even the adversarial ones that break quicksort.",
    },
    {
      type: "p",
      text: "The interesting work happens in the merge, not the split. Splitting takes O(1) per call (pick the middle index). Merging two sorted runs of total length n takes O(n) — you walk both runs front-to-back, picking the smaller front each step. The recursion is log n levels deep, and each level merges a total of n elements. n × log n is where the bound comes from.",
    },
    {
      type: "p",
      text: "Merge sort is **stable**, deterministic, and parallelizable. It's the right answer when you can't trust the input distribution (worst case is the same as average case), when you need stability, when the data doesn't fit in RAM (external mergesort streams sorted chunks from disk), or when you're sorting a linked list (no random access needed). The price is **O(n) extra memory** for the merge buffer — that's its one real weakness vs. quicksort.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Splitting" },
    {
      type: "ol",
      items: [
        "If the array has 0 or 1 elements, it's already sorted — return.",
        "Otherwise, split at the middle: left = `a[0 … n/2-1]`, right = `a[n/2 … n-1]`.",
        "Recursively sort left.",
        "Recursively sort right.",
        "Merge the two sorted halves into one sorted result.",
      ],
    },
    { type: "h", text: "Merging two sorted runs" },
    {
      type: "ol",
      items: [
        "Use two pointers, `i` on left and `j` on right, both starting at 0.",
        "Look at `left[i]` and `right[j]`. Take the smaller (or `left[i]` on a tie — *this is what makes merge sort stable*).",
        "Advance whichever pointer you took from. Repeat until one side is exhausted.",
        "Copy whatever's left in the non-exhausted side to the end of the output.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "The n log n bound, intuitively",
      text: "There are log₂(n) levels of recursion (each level halves the size). Every level processes all n elements once — splitting is free, merging is O(n) per level. Total work: n × log₂(n). For n = 1000, that's ~10 000 operations. For n = 1 000 000, ~20 million. Compared to bubble/insertion/selection sort's 10¹² for n = 1 000 000, the difference is hours vs milliseconds.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "External merge sort",
      text: "When data is bigger than RAM, you can still mergesort it. Read chunks the size of memory, sort each chunk in-memory, write each sorted chunk back to disk. Then merge the chunks k-at-a-time using a k-way merge with a min-heap of front-elements. This is exactly how databases sort their TEMP TABLE results and how `sort -m` works on UNIX. Merge sort is the only one of the canonical comparison sorts that does this naturally.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**You need a stable sort with worst-case guarantees** — merge sort is O(n log n) on every input and stable. Quicksort is faster on average but unstable and O(n²) on bad inputs.",
        "**External sorting** — data too big for RAM. Merge naturally streams; quicksort doesn't.",
        "**Linked lists** — merge sort needs only sequential access; quicksort needs random access. Linked-list merge sort is in-place (just swap node pointers).",
        "**Parallel sorting** — the two recursive halves are independent. Easy to parallelize, hard to do that with quicksort.",
        "**Counting inversions** — a tiny modification of the merge step counts the number of inversions in the input in O(n log n).",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You want the lowest in-memory time on random data** — quicksort beats merge by a constant factor because it's truly in-place and more cache-friendly.",
        "**Memory is tight** — merge sort needs O(n) auxiliary memory. Heap sort is O(n log n) and in-place.",
        "**Data is nearly sorted** — Timsort exploits existing runs; pure merge sort doesn't.",
        "**You're sorting integers with small range** — counting/radix beat O(n log n) entirely.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Guaranteed O(n log n)** on every input — no adversarial-input failure mode.",
      "**Stable** — the merge tie-break (prefer left) preserves original order of equal elements.",
      "**Naturally external** — streams sorted chunks from disk; the backbone of database sorts.",
      "**Trivially parallel** — left and right halves are independent.",
      "**Predictable cache behaviour** — sequential access patterns, no random jumps.",
    ],
    cons: [
      "**O(n) extra memory** — needs a buffer the size of the input. The main reason quicksort wins in-memory.",
      "**Slower constant factor than quicksort** on random data — extra writes during the copy-out-and-merge step.",
      "**Recursion depth log n** — fine in practice but consumes stack space.",
      "**Doesn't adapt** — sorted input still takes full O(n log n). Timsort fixes this.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through a full sort",
      body: "Press **Play** and watch the split tree grow downward — each row is one level of recursion. When the splits stop (every piece is size 1), the merges begin: pairs of pieces snap together as one sorted piece, level by level, until one sorted whole remains. Notice the merge phase is where all the real work lives.",
    },
    {
      title: "02 · Step into a single merge",
      body: "Use **Step** until you see two small pieces and a comparison highlight. Each step picks the smaller front element and adds it to the merged output below. Watch how the *Comparisons* counter only goes up on these front-vs-front decisions — the splits themselves are free.",
    },
    {
      title: "03 · Track the depth counter",
      body: "Look at the *Depth* stat. For an 8-element array, depth reaches 3 (8 → 4 → 2 → 1). For 16, depth would be 4. That's log₂(n). Total comparisons stay near n × depth ≈ n log n regardless of how scrambled the input is.",
    },
    {
      title: "04 · Shuffle and compare to bubble's swap count",
      body: "Press **Shuffle** and step through a few different inputs. The total *Comparisons* count stays roughly constant — that's the signature of an n log n algorithm. Compare to bubble sort on the same 8 items: bubble averages ~28 comparisons, merge ~17. The gap widens fast at larger n.",
    },
  ],

  code: {
    language: "typescript",
    filename: "merge-sort.ts",
    code: `// Merge sort — stable, guaranteed O(n log n), O(n) extra memory.
function mergeSort<T>(a: T[]): T[] {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  return merge(left, right);
}

function merge<T>(left: T[], right: T[]): T[] {
  const out: T[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    // Use \`<=\` to keep the sort stable: equal elements take from left first.
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  // One of these is empty; the other gets appended whole.
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}

// Example
mergeSort([38, 27, 43, 3, 9, 82, 10]);
// → [3, 9, 10, 27, 38, 43, 82]
// Comparisons: O(n log n) on every input.`,
  },

  furtherReading: [
    {
      label: "John von Neumann — Merge sort (1945)",
      href: "https://en.wikipedia.org/wiki/Merge_sort#History",
      note: "Merge sort was invented by von Neumann for the EDVAC. The history section captures why he needed a stable, predictable sort for early computer memory.",
      kind: "article",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, §2.3 Designing algorithms",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The canonical recurrence-relation derivation: T(n) = 2T(n/2) + O(n) → O(n log n) by the Master Theorem.",
      kind: "book",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms* §2.2 Mergesort",
      href: "https://algs4.cs.princeton.edu/22mergesort/",
      note: "Includes both top-down (recursive) and bottom-up (iterative) merge sort, plus performance comparisons with the elementary sorts.",
      kind: "book",
    },
    {
      label: "Knuth — *The Art of Computer Programming*, Vol. 3 §5.2.4",
      href: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html",
      note: "Knuth's chapter on merging is where the external-sort variants (replacement-selection, polyphase merge) come from. The reference for serious sort engineers.",
      kind: "book",
    },
    {
      label: "PostgreSQL docs — External merge sort for ORDER BY",
      href: "https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-WORK-MEM",
      note: "Real-world external sort: when a Postgres ORDER BY exceeds work_mem, it spills to disk and merges runs. This is merge sort in production at scale.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Merge sort",
      href: "https://en.wikipedia.org/wiki/Merge_sort",
      note: "Has the inversion-counting variant, the natural-merge variant (precursor to Timsort), and the in-place merge sort variants (Pratt, Katajainen).",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "ms-q1",
      question:
        "Why is merge sort O(n log n) on every input — including sorted, reverse-sorted, and random?",
      options: [
        { id: "a", label: "Because the recursion always halves the array, so the depth is log n, and every level still merges all n elements regardless of order." },
        { id: "b", label: "Because each comparison costs O(1)." },
        { id: "c", label: "Because it uses extra memory." },
        { id: "d", label: "Because the merge step is O(log n) per call." },
      ],
      correctOptionId: "a",
      explanation:
        "The split is unconditional — it always cuts at the middle, so the depth is log n no matter the order. The merge step at each level always touches every element. n elements × log n levels = O(n log n), guaranteed. This is why merge sort has no adversarial input.",
    },
    {
      id: "ms-q2",
      question:
        "What makes the merge step *stable*?",
      options: [
        { id: "a", label: "The recursion is deterministic." },
        { id: "b", label: "Equal elements on the left side are taken before equal elements on the right (`<=`, not `<`)." },
        { id: "c", label: "The merge step never compares equal elements." },
        { id: "d", label: "Stability is a property of all merge sorts regardless of comparison." },
      ],
      correctOptionId: "b",
      explanation:
        "The tie-break in the merge step is what determines stability. If left's front equals right's front, taking from left first preserves the original left-before-right order of those equal elements. Reversing the comparison to `<` would still sort correctly but lose stability.",
    },
    {
      id: "ms-q3",
      question:
        "Which workload most justifies merge sort over quicksort?",
      options: [
        { id: "a", label: "Sorting a small list of integers in memory." },
        { id: "b", label: "Sorting 10 TB of log files where the data doesn't fit in RAM." },
        { id: "c", label: "Sorting a list that's already mostly in order." },
        { id: "d", label: "Sorting an array of single bytes." },
      ],
      correctOptionId: "b",
      explanation:
        "External sorting is merge sort's killer use case. Quicksort needs random access; merge sort streams sorted chunks naturally. Every database's ORDER BY spill-to-disk path is an external merge sort. For (a) just use Timsort; (c) is Timsort's killer case; (d) is counting sort's killer case.",
    },
  ],
};
