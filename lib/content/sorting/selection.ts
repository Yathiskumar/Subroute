import type { ConceptContent } from "@/lib/content/types";

export const selection: ConceptContent = {
  prototypeCaption:
    "Each round, the algorithm scans the unsorted right side for the smallest value (purple lift) and swaps it into the next sorted slot. Press **Play** to watch all eight rounds, **Step** / **Back** to walk through each comparison, **Try sorted** to confirm even sorted data still does n² compares, **Shuffle** for a new list.",

  overview: [
    {
      type: "p",
      text: "**Selection sort is the algorithm that says: I will not move anything until I know I'm moving it to its final home.** Each round, it scans the unsorted region, finds the smallest value, and swaps it into the next sorted slot. After one round, position 0 holds the global minimum. After two rounds, positions 0 and 1 hold the two smallest. After n-1 rounds the entire list is sorted.",
    },
    {
      type: "p",
      text: "It's the dual of bubble sort. Bubble does many adjacent swaps to push *one* value to its final slot per pass. Selection does *one* swap per pass — at the very end of the scan, after the minimum is known. Both do O(n²) comparisons, but selection sort's defining feature is **at most n-1 total swaps**. That makes it the right choice on hardware where writes are far more expensive than reads — flash memory, write-once media, anything where you're literally counting writes.",
    },
    {
      type: "p",
      text: "The catch is selection sort doesn't get any faster on sorted data. The inner scan has to look at every remaining element to *prove* it found the minimum — that's true on random input, sorted input, and reverse-sorted input alike. So unlike insertion sort or bubble sort with early-exit, selection's best, average, and worst case are all O(n²). Predictable, but never fast.",
    },
  ],

  howItWorks: [
    { type: "h", text: "One round" },
    {
      type: "ol",
      items: [
        "Assume the smallest value in the unsorted region is at position `i` (the leftmost unsorted slot).",
        "Scan `a[i+1]` through `a[n-1]`. Each time you find a value smaller than the current min, update `min_idx`.",
        "After the scan, swap `a[i]` with `a[min_idx]`. The slot at `i` is now locked.",
        "Advance the sorted/unsorted boundary by one and repeat.",
      ],
    },
    { type: "h", text: "Across the whole list" },
    {
      type: "ol",
      items: [
        "Round 1 scans n-1 elements and locks position 0.",
        "Round 2 scans n-2 elements and locks position 1.",
        "Round k scans n-k elements; after round n-1, position n-1 is implicitly the largest.",
        "Total comparisons: (n-1) + (n-2) + … + 1 = n(n-1)/2 ≈ n²/2.",
        "Total swaps: at most n-1 (often fewer, since `min_idx == i` skips the swap).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why writes-vs-reads matters",
      text: "Reading from flash memory is fast and unlimited. Writing to flash wears the cells out — typical NAND survives ~100 000 writes per cell. If you're sorting on a device where every swap counts toward end-of-life, selection sort's n-1 swap budget is irresistible. Insertion sort can do O(n²) writes on bad input; selection sort can't.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Selection sort isn't stable",
      text: "The swap at the end of each round can leap over equal-valued elements and reorder them. `[3a, 3b, 2]` selection-sorted becomes `[2, 3b, 3a]` — the two threes have flipped. If stability matters, use insertion sort or merge sort instead.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Writes are expensive** — flash storage, EEPROM, networked devices. n-1 swaps total beats every other in-place comparison sort.",
        "**You're teaching the divide-into-sorted-and-unsorted invariant** — that mental model carries directly into insertion sort and heap sort.",
        "**Tiny n where you want predictable behaviour** — selection sort's running time depends only on n, not on the input ordering. No surprises.",
        "**Finding the k smallest elements** — stop after k rounds and you have a partial sort in O(k · n).",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You need stability** — selection sort isn't stable; merge or insertion is.",
        "**Performance matters at all** — every comparison sort beats selection on random data; insertion sort beats it on nearly-sorted data.",
        "**Just use your language's sort()** — for production code, the answer is always Timsort or intro-sort.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Minimum writes** — exactly n-1 swaps in the worst case, often fewer. Unbeatable when writes hurt.",
      "**In-place** — O(1) extra space.",
      "**Predictable runtime** — O(n²) on every input, no surprises from worst-case inputs.",
      "**Simple to implement** — one nested loop, one swap at the end of each round.",
      "**Easy to convert into a partial sort** — stop after k rounds to get the k smallest values sorted.",
    ],
    cons: [
      "**O(n²) on every input** — no fast path for sorted or nearly-sorted data.",
      "**Not stable** — the end-of-round swap can hop over equal values.",
      "**Always n²/2 comparisons** — even when the list is already sorted, every round still has to scan to prove the minimum.",
      "**Insertion sort dominates it** for nearly all practical small-n use cases.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through one full sort",
      body: "Press **Play**. Watch the purple bar — that's the current minimum candidate during a scan. After the scan finishes, the purple bar swaps into the next green sorted slot. Notice how each round produces exactly one swap and how the sorted green region grows by one per round.",
    },
    {
      title: "02 · Count comparisons vs swaps",
      body: "Use **Step** to advance manually. Watch the two counters in the stats grid. On 8 random items, expect ~28 comparisons but at most 7 swaps — the lopsided ratio that makes selection sort the write-efficient choice.",
    },
    {
      title: "03 · Try sorted data — same work, no savings",
      body: "Press **Try sorted**. Step through. The algorithm still does ~28 comparisons — every round still has to scan the entire unsorted region to *prove* the smallest is at position `i`. The swap count stays at 0 since `min_idx == i` every round, but selection sort can never beat O(n²) the way bubble sort's early-exit can.",
    },
    {
      title: "04 · Shuffle and watch the swap discipline",
      body: "Press **Shuffle** and step through. Each round picks one purple minimum, makes one swap, locks one slot. The total swap count never exceeds n-1, regardless of how scrambled the input is. That bound is selection sort's signature.",
    },
  ],

  code: {
    language: "typescript",
    filename: "selection-sort.ts",
    code: `// Selection sort — minimum writes, O(n²) comparisons.
// In-place, not stable, predictable O(n²) on every input.
function selectionSort<T>(a: T[]): T[] {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    // Find the index of the smallest value in a[i..n-1].
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    // One swap per outer iteration — at most.
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  return a;
}

// Example
selectionSort([29, 10, 14, 37, 13]);
// → [10, 13, 14, 29, 37]
// Comparisons: 4+3+2+1 = 10. Swaps: at most 4.`,
  },

  furtherReading: [
    {
      label: "Sedgewick & Wayne — *Algorithms*, 4th ed. §2.1 Elementary Sorts",
      href: "https://algs4.cs.princeton.edu/21elementary/",
      note: "The canonical undergraduate treatment. Shows the side-by-side complexity tables that motivate why selection sort still has a niche.",
      kind: "book",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, Ch. 2",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Includes selection sort as exercise 2.2-2 with a step-by-step loop-invariant proof. Worth working through if you want to internalize the invariant.",
      kind: "book",
    },
    {
      label: "GeeksforGeeks — Selection Sort",
      href: "https://www.geeksforgeeks.org/selection-sort/",
      note: "Clean code in 10+ languages, plus a discussion of variants like double-ended selection sort (find min *and* max each round).",
      kind: "article",
    },
    {
      label: "Wikipedia — Selection sort",
      href: "https://en.wikipedia.org/wiki/Selection_sort",
      note: "Has the proof sketch for the n-1 worst-case swap bound and the relationship to heap sort (which is essentially selection sort with a priority queue).",
      kind: "article",
    },
    {
      label: "VisuAlgo — Sorting comparison",
      href: "https://visualgo.net/en/sorting",
      note: "Run selection, bubble, and insertion side by side on the same input to feel the difference in swap counts.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "ss-q1",
      question:
        "On a list of 100 elements, how many swaps does selection sort do in the worst case?",
      options: [
        { id: "a", label: "About 100² ≈ 10 000 — one per comparison." },
        { id: "b", label: "About 100²/2 ≈ 5 000 — one per pair." },
        { id: "c", label: "At most 99 — one per outer iteration." },
        { id: "d", label: "Exactly 100 — one per element." },
      ],
      correctOptionId: "c",
      explanation:
        "Selection sort does at most one swap per outer-loop iteration, and there are n-1 outer iterations. So for n = 100, that's at most 99 swaps total. That's the fundamental reason it's preferred over insertion or bubble when writes are expensive.",
    },
    {
      id: "ss-q2",
      question:
        "Why isn't there a meaningful 'best case' for selection sort?",
      options: [
        { id: "a", label: "Because it always allocates O(n) extra memory regardless of input." },
        { id: "b", label: "Because each round still has to scan the entire unsorted region to prove the minimum, even on sorted input." },
        { id: "c", label: "Because the swap step is always O(n)." },
        { id: "d", label: "Because the recursion always reaches depth n." },
      ],
      correctOptionId: "b",
      explanation:
        "Selection sort's inner loop does the same n-1, n-2, …, 1 comparisons regardless of input order — it has no early-exit because finding the minimum requires looking at every candidate. Bubble sort and insertion sort both have O(n) best cases via early exit; selection sort doesn't.",
    },
    {
      id: "ss-q3",
      question:
        "Sorting `['3a', '3b', '2']` with selection sort yields `['2', '3b', '3a']`. What does that tell us?",
      options: [
        { id: "a", label: "Selection sort is unstable — equal elements can be reordered." },
        { id: "b", label: "There's a bug — selection sort should preserve `3a` before `3b`." },
        { id: "c", label: "Selection sort doesn't handle duplicates." },
        { id: "d", label: "Selection sort only works on numeric data." },
      ],
      correctOptionId: "a",
      explanation:
        "Round 1 finds `2` as the minimum and swaps it with the leftmost element `3a`. The `3a` lands at position 2, behind `3b`. That cross-swap is exactly what makes selection sort unstable: equal-valued elements can be reordered by the end-of-round swap. If stability matters, reach for insertion sort or merge sort.",
    },
  ],
};
