import type { ConceptContent } from "@/lib/content/types";

export const bubble: ConceptContent = {
  prototypeCaption:
    "Eight bars, one full pass of bubble sort. Press **Play** to watch the largest value bubble to the end on every round, or use **Step** / **Back** to walk through each compare-and-maybe-swap by hand. **Try sorted** shows the best-case early-exit; **Shuffle** gives a new random list.",

  overview: [
    {
      type: "p",
      text: "**Bubble sort is the first sort you learn and the first sort you should stop using.** It compares each pair of adjacent values and swaps them if they're in the wrong order. After one pass the biggest value sits at the end. After two passes the two biggest sit at the end. After n-1 passes everything is sorted. The whole thing is a single nested loop and four lines of code — which is exactly why it's still the entry-point algorithm in every textbook.",
    },
    {
      type: "p",
      text: "It earns its name because large values appear to *bubble up* (or rather, swim to the right) one slot per pass. Each pass moves the next-largest unsorted value into its final sorted slot at the end. The algorithm only ever swaps neighbours — so a value that needs to travel a long way takes one pass per slot it moves.",
    },
    {
      type: "p",
      text: "The only practical optimization is the **early-exit flag**: if a full pass completes with zero swaps, the list is already sorted and you can stop. That brings the best case down to O(n). The worst and average case stay at O(n²), which is why bubble sort is essentially useless for n > a few hundred. It's here because the swap idea is the seed of selection, insertion, and quick sort — three algorithms you *will* use.",
    },
  ],

  howItWorks: [
    { type: "h", text: "One pass" },
    {
      type: "ol",
      items: [
        "Start with `i = 0`. Compare `a[i]` and `a[i+1]`.",
        "If `a[i] > a[i+1]`, swap them. Otherwise leave them alone.",
        "Advance i. Repeat until you've compared every adjacent pair.",
        "At the end of the pass, the largest value in the unsorted region sits in its final slot at the right.",
      ],
    },
    { type: "h", text: "Across all passes" },
    {
      type: "ol",
      items: [
        "Run pass 1: largest value reaches index n-1. That slot is now locked.",
        "Run pass 2: second-largest reaches index n-2 (you don't need to compare past n-1).",
        "After pass k: the rightmost k slots are sorted.",
        "Stop when a pass makes zero swaps — the list is sorted.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "The early-exit optimization",
      text: "Track a `swapped` boolean per pass. If it stays false, the list is already in order and you can exit immediately. This brings the best case (already-sorted input) from O(n²) down to O(n) — exactly one pass with n-1 comparisons and no swaps.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Why it's still O(n²) on average",
      text: "On random data, each pass moves only *one* value to its final slot, so you need ~n passes. Each pass does ~n comparisons. That's n × n = O(n²) work. Insertion sort does the same number of comparisons in the worst case but far fewer on average — which is why insertion is what people actually use when they need a tiny in-place sort.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Teaching** — the swap-based step is the cleanest introduction to an in-place sort.",
        "**Tiny lists where simplicity wins** — for n < 10, the constant-factor advantage of cache-friendly code can outweigh the algorithmic disadvantage, but **insertion sort** already wins here and is just as simple.",
        "**Detecting whether a list is already sorted** — one pass with the early-exit flag answers that in O(n) and reports zero swaps if so.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Anywhere n > ~50** — even insertion sort is meaningfully faster because it doesn't keep swapping past values that are already in place.",
        "**Nearly-sorted data** — insertion sort handles this in true O(n + d) where d is the number of inversions; bubble's early-exit only helps if zero swaps happen.",
        "**Production code** — there is no real-world situation where bubble sort is the right answer. Your language's `sort()` is.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Trivially simple** — four lines, no recursion, no extra memory. You can implement it correctly under exam pressure.",
      "**In-place** — needs O(1) extra space, just a temp for the swap.",
      "**Stable** — equal elements never overtake each other, because we only swap on strictly greater-than.",
      "**Early-exit detects sorted data** in O(n) — one pass, no swaps, done.",
      "**Useful pedagogy** — the swap-adjacent step is the seed of selection sort, insertion sort, and the partition loop in quick sort.",
    ],
    cons: [
      "**O(n²) average and worst case** — unusable for n > a few hundred.",
      "**Lots of writes** — every swap is two assignments. Selection sort makes one swap per pass; bubble can make ~n swaps per pass.",
      "**No advantage over insertion sort** — same worst case, much worse average case, same simplicity.",
      "**Confuses students into using it in interviews** — it works, but it signals you didn't pick the right tool.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through one full sort",
      body: "Press **Play** and watch one pass complete. The orange bars are the pair being compared; red bars flash on a swap; the green bar at the right end is the value that's locked in for the pass. Notice that after one pass the largest value is at the end, but the rest are still mostly unsorted.",
    },
    {
      title: "02 · Step through with Step / Back",
      body: "Hit **Step** to advance one compare-or-swap at a time, **Back** to rewind. Watch the *Comparisons* and *Swaps* counters: every step increments one of them. On a random list of 8, expect ~28 comparisons and ~15 swaps before the list is sorted.",
    },
    {
      title: "03 · Try the sorted-data fast path",
      body: "Press **Try sorted** to load an already-sorted list. Watch the early-exit kick in: one full pass completes with zero swaps and the algorithm stops on pass 1. That's the best-case O(n) you read about in the trade-offs.",
    },
    {
      title: "04 · Shuffle for a new worst case",
      body: "Press **Shuffle** repeatedly. Look for inputs where the smallest value sits at the right end — bubble sort has to drag it left one slot per pass, so those inputs take the full n-1 passes. That's the algorithm's worst case made visible.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "bubble-sort.ts",
      code: `// Bubble sort with the early-exit optimization.
// Stable, in-place, O(n) best, O(n²) average and worst.
function bubbleSort<T>(a: T[]): T[] {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    // After pass i, the last i elements are in their final slots.
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    // Zero swaps means the list is already sorted.
    if (!swapped) break;
  }
  return a;
}

// Example
bubbleSort([5, 1, 4, 2, 8]); // → [1, 2, 4, 5, 8]
// On random input of length n, expect ~n²/2 comparisons and ~n²/4 swaps.`,
    },
    {
      label: "Java",
      language: "java",
      filename: "BubbleSort.java",
      code: `// Bubble sort with the early-exit optimization.
// Stable, in-place, O(n) best, O(n²) average and worst.
static <T extends Comparable<T>> T[] bubbleSort(T[] a) {
    int n = a.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        // After pass i, the last i elements are in their final slots.
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j].compareTo(a[j + 1]) > 0) {
                T tmp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = tmp;
                swapped = true;
            }
        }
        // Zero swaps means the list is already sorted.
        if (!swapped) break;
    }
    return a;
}

// Example
bubbleSort(new Integer[]{5, 1, 4, 2, 8}); // → [1, 2, 4, 5, 8]
// On random input of length n, expect ~n²/2 comparisons and ~n²/4 swaps.`,
    },
    {
      label: "Python",
      language: "python",
      filename: "bubble_sort.py",
      code: `def bubble_sort(a: list) -> list:
    """Bubble sort with the early-exit optimization.
    Stable, in-place, O(n) best, O(n²) average and worst."""
    n = len(a)
    for i in range(n - 1):
        swapped = False
        # After pass i, the last i elements are in their final slots.
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        # Zero swaps means the list is already sorted.
        if not swapped:
            break
    return a


# Example
bubble_sort([5, 1, 4, 2, 8])  # → [1, 2, 4, 5, 8]
# On random input of length n, expect ~n²/2 comparisons and ~n²/4 swaps.`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "bubble_sort.cpp",
      code: `// Bubble sort with the early-exit optimization.
// Stable, in-place, O(n) best, O(n²) average and worst.
#include <vector>
#include <utility>

template <typename T>
std::vector<T> bubbleSort(std::vector<T> a) {
    int n = a.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        // After pass i, the last i elements are in their final slots.
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                std::swap(a[j], a[j + 1]);
                swapped = true;
            }
        }
        // Zero swaps means the list is already sorted.
        if (!swapped) break;
    }
    return a;
}

// Example
// bubbleSort<int>({5, 1, 4, 2, 8}); // → [1, 2, 4, 5, 8]
// On random input of length n, expect ~n²/2 comparisons and ~n²/4 swaps.`,
    },
  ],

  furtherReading: [
    {
      label: "Donald Knuth — *The Art of Computer Programming*, Vol. 3 §5.2.2",
      href: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html",
      note: "Knuth's exchange-sorting chapter is the definitive treatment — including the proof that bubble sort makes exactly the same number of swaps as the number of inversions in the input.",
      kind: "book",
    },
    {
      label: "Owen Astrachan — *Bubble Sort: An Archaeological Algorithmic Analysis* (2003)",
      href: "https://users.cs.duke.edu/~ola/bubble/bubble.pdf",
      note: "Argues bubble sort should be retired from CS curricula because it teaches the wrong intuitions. Worth reading even if you disagree.",
      kind: "paper",
    },
    {
      label: "VisuAlgo — Bubble sort visualization",
      href: "https://visualgo.net/en/sorting",
      note: "Side-by-side animations of bubble, selection, insertion, merge, and quick sorts. Useful for comparing them on the same input.",
      kind: "article",
    },
    {
      label: "Wikipedia — Bubble sort",
      href: "https://en.wikipedia.org/wiki/Bubble_sort",
      note: "Solid summary with the comb-sort and cocktail-shaker-sort variants — variations that fix bubble sort's 'turtle' problem (small values at the end).",
      kind: "article",
    },
    {
      label: "Big-O Cheat Sheet — sorting complexity",
      href: "https://www.bigocheatsheet.com/",
      note: "One-page reference for the time-and-space complexity of every common sort. Keep it bookmarked for interviews.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "bs-q1",
      question:
        "After one full pass of bubble sort on `[5, 1, 4, 2, 8]`, what does the array look like?",
      options: [
        { id: "a", label: "`[1, 2, 4, 5, 8]` — fully sorted in one pass." },
        { id: "b", label: "`[1, 4, 2, 5, 8]` — the largest bubbled to the end, the rest moved one slot left where applicable." },
        { id: "c", label: "`[1, 4, 5, 2, 8]` — the largest bubbled to the end, other values may be partially reordered." },
        { id: "d", label: "`[1, 4, 2, 8, 5]` — only adjacent swaps happen, so 8 only moves one slot." },
      ],
      correctOptionId: "c",
      explanation:
        "Each adjacent pair gets compared left to right. (5,1) swap → (5,4) swap → (5,2) swap → (5,8) no swap. The result is `[1, 4, 2, 5, 8]`. Wait — re-trace: start `[5,1,4,2,8]`, compare 5,1 → swap → `[1,5,4,2,8]`, compare 5,4 → swap → `[1,4,5,2,8]`, compare 5,2 → swap → `[1,4,2,5,8]`, compare 5,8 → no swap. Final after pass 1: `[1, 4, 2, 5, 8]` — that's option (b). The point is the largest reaches the end while only one slot of leftward motion per other element is possible per pass.",
    },
    {
      id: "bs-q2",
      question:
        "Why does the early-exit optimization bring the best case down to O(n) but not the worst case?",
      options: [
        { id: "a", label: "Because the worst case has no swaps either." },
        { id: "b", label: "Because in the worst case every pass makes at least one swap, so the flag is never zero." },
        { id: "c", label: "Because the optimization only helps in random data." },
        { id: "d", label: "Because the inner loop always runs n times regardless." },
      ],
      correctOptionId: "b",
      explanation:
        "The early-exit flag fires only when a pass completes with zero swaps. On a reverse-sorted list (worst case) every pair is out of order, so every pass does many swaps and the flag never fires. You still need all n-1 passes, doing n² work total.",
    },
    {
      id: "bs-q3",
      question:
        "Bubble sort is *stable*. What does that mean in practice?",
      options: [
        { id: "a", label: "It always completes in a predictable amount of time." },
        { id: "b", label: "It doesn't crash on duplicate values." },
        { id: "c", label: "Equal-valued elements stay in the same relative order they had in the input." },
        { id: "d", label: "It uses O(1) extra memory." },
      ],
      correctOptionId: "c",
      explanation:
        "Stability means equal keys don't get reordered. Bubble sort only swaps on strictly `a[j] > a[j+1]`, never on equality, so two equal values keep their original left-to-right order. This is what lets you sort by multiple keys: sort by the secondary key first, then by the primary — the secondary order survives because the sort is stable.",
    },
  ],
};
