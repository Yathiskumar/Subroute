import type { ConceptContent } from "@/lib/content/types";

export const insertion: ConceptContent = {
  prototypeCaption:
    "Each value is lifted out (purple bar) and slid into its place inside the sorted left side, shifting larger values one slot to the right. Press **Play** for one full sort, **Step** / **Back** to follow each shift, **Try sorted** to see the best-case O(n), **Shuffle** to reroll.",

  overview: [
    {
      type: "p",
      text: "**Insertion sort is how you sort a hand of playing cards.** You pick up the next card, slide it left past every bigger card you've already arranged, and drop it into its place. The sorted region grows one card at a time, always from the left. You never touch the unsorted side until you commit to lifting its next card.",
    },
    {
      type: "p",
      text: "That single mental model gives you four guarantees that bubble and selection sort don't have together. It's **stable** (equal cards keep their order — you only shift left past *strictly bigger* ones). It's **in-place** (no extra memory). It's **adaptive** (already-sorted runs cost almost nothing). And it's **online** — you can feed it one element at a time and the sorted region is always available.",
    },
    {
      type: "p",
      text: "On random data, insertion sort is still O(n²) — every new card has to slide past about n/2 existing ones on average. But on **nearly-sorted** data, where each card only shifts a few slots, it's effectively O(n + d) where d is the number of out-of-place pairs. That's exactly why it's the inner loop of Timsort and the small-array base case of `std::sort` and `qsort`. For n under ~16, it beats every theoretically faster algorithm.",
    },
  ],

  howItWorks: [
    { type: "h", text: "One insertion" },
    {
      type: "ol",
      items: [
        "Position 0 is trivially sorted (a single element).",
        "Lift `key = a[i]` — the next unsorted value (purple in the prototype).",
        "Look left at `a[i-1]`. If it's bigger than `key`, shift it right by one (`a[j+1] = a[j]`). Step `j` left.",
        "Repeat until you find a smaller-or-equal element, or you fall off the left edge.",
        "Drop `key` into the gap at `j+1`. Sorted region now extends to index `i`.",
      ],
    },
    { type: "h", text: "Across the list" },
    {
      type: "ol",
      items: [
        "Iteration i = 1 inserts `a[1]` into the size-1 sorted prefix.",
        "Iteration i = 2 inserts `a[2]` into the size-2 sorted prefix.",
        "After iteration n-1, the entire list is sorted.",
        "Total comparisons & shifts: equal to the number of *inversions* in the input. Best case (already sorted): n-1 comparisons, zero shifts.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Insertion sort = the size of the inversion count",
      text: "An inversion is a pair (i, j) with i < j but a[i] > a[j]. Insertion sort's work is *exactly proportional* to the number of inversions — each shift fixes exactly one. A list with 5 inversions takes 5 shifts. A reverse-sorted list of n has n(n-1)/2 inversions. A sorted list has zero. This is why insertion sort dominates whenever data is nearly sorted: shifts ≈ inversions, and nearly-sorted means few inversions.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Why every fast sort uses insertion as a base case",
      text: "For n < ~16, the constant-factor wins of insertion sort (no recursion overhead, perfect cache locality, branch-predictor friendly) beat the asymptotic wins of merge sort and quicksort. That's why Timsort, std::sort, and Java's Arrays.sort all switch to insertion sort when their recursion reaches small chunks.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Small lists** (n < ~16) — fastest comparison sort on tiny inputs. Every serious `sort()` includes it for this case.",
        "**Nearly-sorted data** — streaming data with occasional out-of-order elements, files that are mostly already sorted, log compactions.",
        "**Online / streaming inputs** — you can feed one element at a time and always have a sorted view of what arrived so far.",
        "**As a sub-routine** — Timsort uses it to extend short runs; introsort uses it for tiny recursion leaves.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Large random data** — O(n²) is unacceptable past a few thousand elements; reach for merge or quick.",
        "**You need worst-case O(n log n)** — reverse-sorted input is insertion's worst case (full n²/2 shifts).",
        "**You can use a non-comparison sort** — counting/radix beat insertion on integer keys at scale.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Adaptive — O(n) on already-sorted data** — best case is one pass with n-1 comparisons and zero shifts.",
      "**Stable** — only shifts past strictly-larger elements, so equals retain their order.",
      "**In-place** — O(1) extra memory.",
      "**Online** — sorted region is always available; you can feed elements one at a time.",
      "**Tight inner loop** — beats theoretically-faster sorts on tiny inputs because of cache behaviour and branch prediction.",
    ],
    cons: [
      "**O(n²) on random and reverse-sorted data** — unusable for n above a few thousand.",
      "**Lots of writes** — every shift is an array assignment; selection sort makes far fewer.",
      "**Recursive sorts win on large data** — merge and quick both dominate from n ≈ 50 upward.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play one full sort",
      body: "Press **Play**. Watch the purple bar — that's the key being lifted out. Watch the red bars — those are the values shifting one slot right to make room. Notice how the green sorted region grows from the left, one element per outer iteration.",
    },
    {
      title: "02 · Step into a single insertion",
      body: "Use **Step** until you see a purple key. Then step one at a time and count the shifts. Each red flash is one shift right. The key drops back into the gap once a smaller-or-equal element blocks it (or the left edge does).",
    },
    {
      title: "03 · Try sorted — see the O(n) best case",
      body: "Press **Try sorted**. Step through. Each iteration lifts a key, compares once against its left neighbour, finds it's already in order, and drops the key right back. Zero shifts, n-1 comparisons total. That's the best case the trade-offs table promises.",
    },
    {
      title: "04 · Shuffle and watch shifts vs comparisons",
      body: "Press **Shuffle**. Step through a random list. The *Comparisons* counter goes up on every step inside the while loop; the *Shifts* counter only goes up when an element actually moves. On a random list the two are nearly equal — every comparison usually shifts. On a nearly-sorted list, comparisons climb while shifts stay near zero.",
    },
  ],

  code: {
    language: "typescript",
    filename: "insertion-sort.ts",
    code: `// Insertion sort — adaptive, stable, in-place.
// Best case O(n) on sorted input; worst case O(n²) on reverse-sorted.
function insertionSort<T>(a: T[]): T[] {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    // Shift larger elements one slot right.
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    // Drop the key into the gap.
    a[j + 1] = key;
  }
  return a;
}

// Example
insertionSort([5, 2, 4, 6, 1, 3]);
// → [1, 2, 3, 4, 5, 6]
// On nearly-sorted input, almost every iteration takes O(1).`,
  },

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, Ch. 2 Getting Started",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Insertion sort is the worked example for loop invariants. Sets up the rigor used through the rest of the book.",
      kind: "book",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms* §2.1.4 Insertion sort",
      href: "https://algs4.cs.princeton.edu/21elementary/",
      note: "Includes the proof that insertion-sort work equals the inversion count — the foundation for why it dominates on nearly-sorted data.",
      kind: "book",
    },
    {
      label: "Bentley & McIlroy — *Engineering a Sort Function* (1993)",
      href: "https://cs.fit.edu/~pkc/classes/writing/samples/bentley93engineering.pdf",
      note: "The paper behind qsort's small-array fallback. Lays out why insertion sort beats quicksort below n ≈ 7 and how to tune the cutoff.",
      kind: "paper",
    },
    {
      label: "Tim Peters — *Timsort listsort.txt*",
      href: "https://github.com/python/cpython/blob/main/Objects/listsort.txt",
      note: "Tim Peters explains how Timsort uses 'binary insertion sort' to extend short runs to a minimum length. The most practically-deployed insertion sort variant on Earth.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Insertion sort",
      href: "https://en.wikipedia.org/wiki/Insertion_sort",
      note: "Has the binary-insertion-sort variant (binary search for the slot, then shift) — same number of shifts but log n comparisons per insertion.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Sorting",
      href: "https://visualgo.net/en/sorting",
      note: "Run insertion against bubble and selection on the same input to feel why insertion wins on nearly-sorted data.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "is-q1",
      question:
        "Insertion sort's running time is proportional to which of the following?",
      options: [
        { id: "a", label: "The number of *distinct* values in the array." },
        { id: "b", label: "n²/2, always — the input doesn't matter." },
        { id: "c", label: "The number of *inversions* (pairs in the wrong order) in the input." },
        { id: "d", label: "The depth of the recursion." },
      ],
      correctOptionId: "c",
      explanation:
        "Each shift in insertion sort fixes exactly one inversion. A list with k inversions takes exactly k shifts. A sorted list has 0 inversions → O(n). A reverse-sorted list has n(n-1)/2 inversions → O(n²). 'Nearly-sorted' means 'few inversions,' which is why insertion sort wins there.",
    },
    {
      id: "is-q2",
      question:
        "Why does Timsort use insertion sort to extend short runs instead of just merging tiny runs directly?",
      options: [
        { id: "a", label: "Because insertion sort uses less memory than merge sort." },
        { id: "b", label: "Because for n < ~16 the constant-factor wins of insertion sort beat the asymptotic wins of merge sort." },
        { id: "c", label: "Because merge sort isn't stable." },
        { id: "d", label: "Because insertion sort can sort in parallel." },
      ],
      correctOptionId: "b",
      explanation:
        "Insertion sort has a tight inner loop with great cache behaviour and predictable branches. Merge sort has recursion overhead, allocation, and pointer-chasing. Below ~16 elements, those constants dominate and insertion wins. Timsort and std::sort both use this exact trick.",
    },
    {
      id: "is-q3",
      question:
        "What's the relationship between insertion sort and selection sort?",
      options: [
        { id: "a", label: "They're the same algorithm with different variable names." },
        { id: "b", label: "Insertion sort finds the right *home* for each element on insertion; selection sort finds the *right element* for each home." },
        { id: "c", label: "Insertion sort is the recursive version of selection sort." },
        { id: "d", label: "They differ only in time complexity." },
      ],
      correctOptionId: "b",
      explanation:
        "They're duals. Insertion sort grows a sorted prefix by taking the next input element and inserting it into the right slot. Selection sort grows a sorted prefix by finding the right element (the minimum) and putting it at the next slot. Both build the same growing sorted prefix — they choose differently between 'where does this element go?' and 'what element goes here?'.",
    },
  ],
};
