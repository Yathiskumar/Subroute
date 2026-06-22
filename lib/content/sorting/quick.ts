import type { ConceptContent } from "@/lib/content/types";

export const quick: ConceptContent = {
  prototypeCaption:
    "A pivot (purple) is chosen, the rest of the range is partitioned into smaller-than-pivot and bigger-than-pivot, and the pivot lands in its final sorted position. Press **Play** to watch the recursion unfold across the whole array, **Step** / **Back** to walk each compare-and-swap, **Shuffle** for a new list.",

  overview: [
    {
      type: "p",
      text: "**Quicksort is the in-memory speed champion — when you control the pivot.** Pick any element as the pivot. Partition the rest: everything smaller goes left of it, everything larger goes right. Now the pivot is in its final sorted position, and you recurse on the two sides. Each pivot eats one element off the problem; partitioning is linear. Average depth is log n. Average work is O(n log n) with the tightest constants of any comparison sort.",
    },
    {
      type: "p",
      text: "The win is two things at once: it's **in-place** (no buffer the size of the input like merge sort needs) and it's **cache-friendly** (the partition step reads and writes sequentially). On random data, quicksort beats merge sort by roughly 2× in practice — same algorithmic class but better constants.",
    },
    {
      type: "p",
      text: "The catch is the **worst case is O(n²)**, hit when every pivot lands at one end of its range — exactly what happens if you always pick the last element as pivot and the input is already sorted. Real implementations dodge this with **randomised** or **median-of-three** pivot selection, plus an **introsort** fallback (switch to heap sort if recursion gets too deep). Done right, quicksort is the fastest practical comparison sort. Done naively, it's a bug waiting for adversarial input.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Partition (Lomuto's scheme)" },
    {
      type: "ol",
      items: [
        "Choose `pivot = a[hi]` (the rightmost element of the current range).",
        "Keep a boundary `i` just left of the smaller-than-pivot region.",
        "Scan `j` from `lo` to `hi-1`. If `a[j] < pivot`, advance `i` and swap `a[i]` with `a[j]`.",
        "After the scan, swap `a[i+1]` with the pivot at `a[hi]`. The pivot now sits at its final sorted position `i+1`.",
        "Return that position — everything left of it is smaller, everything right is larger.",
      ],
    },
    { type: "h", text: "The recursion" },
    {
      type: "ol",
      items: [
        "Call `quicksort(lo, hi)`. If `lo >= hi`, return — the range is sorted.",
        "Partition. Let `p` be the pivot's final position.",
        "Recurse on `quicksort(lo, p-1)`.",
        "Recurse on `quicksort(p+1, hi)`.",
        "Bottom out when ranges shrink to length 0 or 1.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why the average case is O(n log n)",
      text: "If the pivot lands near the middle of its range, both halves are ~n/2 and the recursion is log n deep. Each level still partitions a total of n elements. n × log n. The 'near the middle' part holds *on expectation* for random pivots — even badly-balanced splits average out as long as the pivot isn't pathologically picked.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The O(n²) trap and how production sorts dodge it",
      text: "Always picking `a[hi]` on a sorted input means the pivot is always the max of its range, so the left half is everything-but-one and the right half is empty. Recursion is n deep, work per level is n, total n². Fix: pick the pivot **randomly**, or use **median-of-three** (median of `a[lo], a[mid], a[hi]`). Both make adversarial inputs astronomically unlikely. Real-world sorts go further with **introsort**: track recursion depth, fall back to heap sort if it exceeds 2 log n.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**General-purpose in-memory sorting of random data** — fastest practical comparison sort.",
        "**Memory-constrained environments** — O(log n) recursion stack, no buffer.",
        "**You can randomise the pivot** — adversarial inputs become a non-issue.",
        "**You can apply introsort** — guarantees O(n log n) worst case by escape-hatch into heap sort.",
        "**Cache locality matters** — partition is a sequential scan, very friendly to modern memory hierarchies.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You need stability** — quicksort is not stable; use Timsort or merge sort.",
        "**You can't trust the input distribution and can't afford the O(n²) worst case** — use heap sort or merge sort.",
        "**You're sorting a linked list** — quicksort needs random access; use merge sort.",
        "**Data is already nearly sorted** — Timsort exploits existing runs; quicksort gets its worst case.",
        "**You're sorting integers with a known small range** — counting or radix sort beats every comparison sort.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Fastest in-memory comparison sort on random data** — beats merge sort by ~2× in practice.",
      "**In-place** — only O(log n) stack space for the recursion.",
      "**Cache-friendly** — sequential reads and writes during partitioning.",
      "**Tail-recursion elimination** — modern implementations turn the second recursive call into a loop, cutting stack depth.",
      "**Easy to make hostile-input-resistant** with randomised or median-of-three pivot selection.",
    ],
    cons: [
      "**O(n²) worst case** if pivot selection goes bad — must defend with randomisation or introsort fallback.",
      "**Not stable** — equal elements can be reordered during partitioning.",
      "**Recursion** can blow the stack on adversarial inputs without depth limits.",
      "**Slower on nearly-sorted data** than Timsort — gets its worst case exactly when the data is best-prepared.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through one full sort",
      body: "Press **Play**. Watch the purple pivot get chosen at the right edge of the range. Then watch the orange scanner walk left-to-right, occasionally swapping (red flash) to move smaller-than-pivot values into the left group. At the end of the scan the pivot snaps into its final sorted slot (green) and the recursion divides the range into two smaller ranges.",
    },
    {
      title: "02 · Count the partitions",
      body: "The *Pivots set* counter increments once per partition — that's exactly the number of recursive calls. For 8 elements that's typically 6–8 calls. Each call's partition does linear work on its range; the sum across all levels is the n log n total.",
    },
    {
      title: "03 · Step into one partition",
      body: "Use **Step** to enter a partition. Each tick of *Comparisons* is one `a[j] < pivot?` check; each tick of *Swaps* is one move into the smaller-than-pivot group. After the scan completes, watch the final pivot swap — that's the moment the pivot lands at its sorted home.",
    },
    {
      title: "04 · Shuffle until you see a bad pivot",
      body: "Press **Shuffle** repeatedly. Look for inputs where the right-most element is unusually small or large — that's when the partition produces a lopsided split (one big side, one tiny side) and the recursion gets deep. That's quicksort's worst-case path in miniature. Real implementations defend with randomised pivot selection (this prototype uses fixed `a[hi]` for clarity).",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "quick-sort.ts",
      code: `// Quicksort with Lomuto partition.
// Average O(n log n) in-place; worst O(n²) on bad pivots.
// Production code should randomise the pivot to dodge worst-case inputs.
function quickSort<T>(a: T[], lo = 0, hi = a.length - 1): T[] {
  if (lo >= hi) return a;
  const p = partition(a, lo, hi);
  quickSort(a, lo, p - 1);
  quickSort(a, p + 1, hi);
  return a;
}

function partition<T>(a: T[], lo: number, hi: number): number {
  // For a hostile-input-resistant version, swap a[hi] with a[lo + random(hi-lo+1)] here.
  const pivot = a[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
  [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
  return i + 1;
}

// Example
quickSort([10, 7, 8, 9, 1, 5]);
// → [1, 5, 7, 8, 9, 10]`,
    },
    {
      label: "Java",
      language: "java",
      filename: "QuickSort.java",
      code: `// Quicksort with Lomuto partition.
// Average O(n log n) in-place; worst O(n²) on bad pivots.
// Production code should randomise the pivot to dodge worst-case inputs.
static <T extends Comparable<T>> void quickSort(T[] a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}

static <T extends Comparable<T>> int partition(T[] a, int lo, int hi) {
    // For a hostile-input-resistant version, swap a[hi] with a[lo + random(hi-lo+1)] here.
    T pivot = a[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (a[j].compareTo(pivot) < 0) {
            i++;
            T tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
    }
    T tmp = a[i + 1]; a[i + 1] = a[hi]; a[hi] = tmp;
    return i + 1;
}

// Example
Integer[] arr = {10, 7, 8, 9, 1, 5};
quickSort(arr, 0, arr.length - 1);
// → [1, 5, 7, 8, 9, 10]`,
    },
    {
      label: "Python",
      language: "python",
      filename: "quick_sort.py",
      code: `def quick_sort(a: list, lo: int = 0, hi: int = None) -> list:
    """Quicksort with Lomuto partition.
    Average O(n log n) in-place; worst O(n²) on bad pivots.
    Production code should randomise the pivot to dodge worst-case inputs."""
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    p = partition(a, lo, hi)
    quick_sort(a, lo, p - 1)
    quick_sort(a, p + 1, hi)
    return a


def partition(a: list, lo: int, hi: int) -> int:
    # For a hostile-input-resistant version, swap a[hi] with a[lo + random(hi-lo+1)] here.
    pivot = a[hi]
    i = lo - 1
    for j in range(lo, hi):
        if a[j] < pivot:
            i += 1
            a[i], a[j] = a[j], a[i]
    a[i + 1], a[hi] = a[hi], a[i + 1]
    return i + 1


# Example
quick_sort([10, 7, 8, 9, 1, 5])
# → [1, 5, 7, 8, 9, 10]`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "quick_sort.cpp",
      code: `// Quicksort with Lomuto partition.
// Average O(n log n) in-place; worst O(n²) on bad pivots.
// Production code should randomise the pivot to dodge worst-case inputs.
#include <vector>
#include <utility>

template <typename T>
int partition(std::vector<T>& a, int lo, int hi) {
    // For a hostile-input-resistant version, swap a[hi] with a[lo + random(hi-lo+1)] here.
    T pivot = a[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (a[j] < pivot) {
            i++;
            std::swap(a[i], a[j]);
        }
    }
    std::swap(a[i + 1], a[hi]);
    return i + 1;
}

template <typename T>
void quickSort(std::vector<T>& a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}

// Example
// std::vector<int> v = {10, 7, 8, 9, 1, 5};
// quickSort(v, 0, v.size() - 1);
// → [1, 5, 7, 8, 9, 10]`,
    },
  ],

  furtherReading: [
    {
      label: "C. A. R. Hoare — *Quicksort* (1962)",
      href: "https://academic.oup.com/comjnl/article/5/1/10/395338",
      note: "The original 1962 paper. Hoare invented quicksort while at Moscow State University, working on translating Russian sentences word-by-word.",
      kind: "paper",
    },
    {
      label: "Bentley & McIlroy — *Engineering a Sort Function* (1993)",
      href: "https://cs.fit.edu/~pkc/classes/writing/samples/bentley93engineering.pdf",
      note: "The paper behind qsort and std::sort. Median-of-three pivot, three-way partitioning for duplicate-heavy data, the small-array fallback to insertion sort.",
      kind: "paper",
    },
    {
      label: "David Musser — *Introsort* (1997)",
      href: "https://www.cs.rpi.edu/~musser/gp/algorithms.pdf",
      note: "Introduces the heap-sort fallback that gives quicksort an O(n log n) worst-case guarantee. This is what std::sort actually ships.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, Ch. 7 Quicksort",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Full analysis with the partitioning correctness proof and the randomised-pivot expectation derivation.",
      kind: "book",
    },
    {
      label: "Vladimir Yaroslavskiy — Dual-Pivot Quicksort",
      href: "http://codeblab.com/wp-content/uploads/2009/09/DualPivotQuicksort.pdf",
      note: "The 2009 algorithm that became Java's Arrays.sort for primitives. Uses two pivots to split into three regions; faster on real-world data than classic quicksort.",
      kind: "paper",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms* §2.3 Quicksort",
      href: "https://algs4.cs.princeton.edu/23quicksort/",
      note: "Walks through partition variants, the analysis, and three-way partitioning for duplicate keys.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "qs-q1",
      question:
        "What's the worst-case time complexity of quicksort with the rightmost element as pivot, on already-sorted input?",
      options: [
        { id: "a", label: "O(n log n) — same as the average case." },
        { id: "b", label: "O(n²) — the pivot is always the max, so one side is empty every call." },
        { id: "c", label: "O(n) — the partition exits early on sorted input." },
        { id: "d", label: "O(log n) — the recursion is shallow." },
      ],
      correctOptionId: "b",
      explanation:
        "If the rightmost element is always the largest in its range (true for sorted input), each partition puts every element on the left side and leaves the right side empty. Recursion is n deep, work per level is n. n × n = O(n²). This is why real implementations randomise the pivot — sorted input becomes the average case again.",
    },
    {
      id: "qs-q2",
      question:
        "Which production-grade quicksort variant gives an O(n log n) worst-case guarantee?",
      options: [
        { id: "a", label: "Dual-pivot quicksort." },
        { id: "b", label: "Three-way partitioning." },
        { id: "c", label: "Introsort — quicksort that falls back to heap sort when recursion depth exceeds 2 log n." },
        { id: "d", label: "Median-of-three pivot selection alone." },
      ],
      correctOptionId: "c",
      explanation:
        "Median-of-three makes adversarial input unlikely but doesn't guarantee it never happens. Introsort *guarantees* O(n log n) by tracking recursion depth and switching to heap sort if it exceeds 2 log n. std::sort, .NET's Array.Sort, and several other production libraries use this exact pattern.",
    },
    {
      id: "qs-q3",
      question:
        "Quicksort isn't stable. What does that mean in practice for sorting records by multiple keys?",
      options: [
        { id: "a", label: "It can't sort records at all." },
        { id: "b", label: "Equal-keyed records can be reordered during partitioning, so you can't reliably sort by primary then secondary key." },
        { id: "c", label: "It needs more memory for records." },
        { id: "d", label: "It runs faster on records than on integers." },
      ],
      correctOptionId: "b",
      explanation:
        "Stability is what lets you sort by 'last name, then first name' as two separate sorts. Quicksort's partition step can reorder equal-keyed records, so doing two passes won't reliably preserve the inner sort. For multi-key sorting, use Timsort or merge sort, or pack both keys into one composite comparison.",
    },
  ],
};
