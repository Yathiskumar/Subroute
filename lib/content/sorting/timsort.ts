import type { ConceptContent } from "@/lib/content/types";

export const timsort: ConceptContent = {
  prototypeCaption:
    "Phase 1 finds natural ascending runs in the data (each colour band is one run); short runs get extended with insertion sort. Phase 2 merges adjacent runs until one sorted run remains. Press **Play** to watch the full sort, **Step** / **Back** to walk each step, **Runny data** to seed an array with pre-existing runs, **Shuffle** for fully-random data.",

  overview: [
    {
      type: "p",
      text: "**Timsort is what your language's sort() actually does.** Python, Java (for objects), JavaScript V8, Rust's `slice::sort`, Android, Swift — all of them. Tim Peters designed it in 2002 for CPython after a frustrated weekend looking at how badly classical sorts handle real-world data. Real data is rarely random: server logs are mostly in timestamp order with a few late arrivals; merged feeds are sorted runs interleaved; even shuffled playlists have patterns. Timsort exploits those patterns to run in O(n) on the best cases while staying O(n log n) on the worst.",
    },
    {
      type: "p",
      text: "The algorithm is **merge sort with two upgrades**. First, it doesn't blindly split in half — it scans the input for **natural runs** (stretches already in ascending order) and uses *those* as the merge starting point. Already-sorted input is one giant run; you skip the merge phase entirely and finish in O(n). Second, when runs are too short (< minrun ≈ 32), Timsort extends them with **binary insertion sort** because insertion is the fastest sort on tiny inputs.",
    },
    {
      type: "p",
      text: "There's a third subtlety: Timsort doesn't merge runs in input order. It pushes runs onto a stack, then triggers merges when the top three runs satisfy specific size invariants (the 'runs' rules). This is what keeps the *total* merge work O(n log n) regardless of how the runs are distributed — and is also the source of a 2015 paper that found Timsort had a latent stack-overflow bug in its merge invariants. (Java and Python both patched it.) Real engineering, real bugs, real impact.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Phase 1 — find and extend runs" },
    {
      type: "ol",
      items: [
        "Scan left to right. Find the longest ascending stretch starting at the current position (a *run*).",
        "If the run's length is less than `minrun` (typically 32, computed from n), extend it: take the next `minrun - len` elements and **binary-insertion-sort** them into the existing run.",
        "Push the resulting run (start, length) onto the *run stack*.",
        "Continue scanning until the input is consumed.",
      ],
    },
    { type: "h", text: "Phase 2 — stack-driven merging" },
    {
      type: "ol",
      items: [
        "After each new run is pushed, check the top three runs A, B, C (A is on top). Enforce the invariants `|C| > |B| + |A|` and `|B| > |A|`.",
        "If either is violated, merge the smaller of (A, C) with B and repeat until the invariants hold.",
        "Once the input is fully scanned, merge whatever runs remain on the stack from top to bottom.",
        "Use *galloping mode* during merges — when one side is consistently winning, binary-search ahead to skip O(log) comparisons at a time.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Best case is O(n) — sorted input runs in one pass",
      text: "If the input is already sorted, Phase 1 finds *one* run of length n and pushes it. There's nothing to merge. Total work: one scan, O(n). Pure merge sort would still split-and-merge O(n log n). That's why your language's sort() feels instant on already-sorted data — Timsort detects it.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Galloping",
      text: "During a merge, if one side wins many comparisons in a row, Timsort assumes that side is going to keep winning and uses binary search to skip ahead to where the comparison flips. On highly-clumped data (like merging two sorted runs that don't interleave much) galloping cuts comparisons from O(n) to O(log n) per chunk — sometimes orders of magnitude faster on real workloads.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The 2015 invariant bug",
      text: "Stijn de Gouw and colleagues formally verified Timsort and discovered the stack-invariant check was missing a case — a pathological input could leave the run stack too deep, eventually overflowing. Python and Java both shipped patches. A solid reminder that complex, optimised algorithms can hide bugs no test suite finds.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Anything where you'd otherwise use a comparison sort** — Timsort is strictly better than mergesort and tied or better than quicksort on most real-world data.",
        "**Data with existing partial order** — log files, merged feeds, append-only data with occasional re-sorts.",
        "**You need a stable sort with O(n log n) worst-case guarantees** — Timsort gives you both.",
        "**Sorting records by multiple keys** — stability lets you sort by primary then secondary in two passes.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You're sorting primitive ints at huge scale** — Java's Arrays.sort uses dual-pivot quicksort for primitives because the cache wins outweigh stability. For 10⁹ integers, radix beats both.",
        "**Memory is extremely tight** — Timsort needs O(n) auxiliary space; heap sort doesn't.",
        "**You need to teach divide-and-conquer cleanly** — Timsort is several optimisations stacked on top of merge sort. Teach merge first.",
        "**You're sorting integers in a known small range** — counting sort wins.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**O(n) best case** on already-sorted or reverse-sorted data — beats every other comparison sort on common inputs.",
      "**O(n log n) worst case** — no adversarial input.",
      "**Stable** — equal elements keep their order.",
      "**Optimised for real-world data** — runs, galloping, the merge-stack invariants all target patterns that random-data benchmarks miss.",
      "**Battle-tested at planetary scale** — Python, Java, V8, Android, Rust all ship Timsort.",
    ],
    cons: [
      "**O(n) extra memory** for the merge buffer — same as merge sort.",
      "**Complex to implement correctly** — the run-stack invariants are subtle (and were buggy until 2015).",
      "**Slower than quicksort on uniformly random data** — by a small constant factor, because the run detection isn't free.",
      "**Not the right teaching algorithm** — its strength is in the optimisations, which require understanding merge sort first.",
    ],
  },

  handsOn: [
    {
      title: "01 · Run a fully-random sort",
      body: "Press **Shuffle** to get a random 12-element list, then **Play**. Watch Phase 1 detect runs — each colour band is one ascending run found in the data. Short runs get extended with insertion (purple). Then Phase 2 merges adjacent runs until one sorted run remains. *Runs found* shows how many natural runs the data contained.",
    },
    {
      title: "02 · See the best case on runny data",
      body: "Press **Runny data** to seed an input with three obvious ascending stretches `[22,38,55, 18,29,41,60, 25,33, 70,82,95]`. Step through Phase 1: Timsort finds the runs without doing any extra work. The merge phase is fast — only a few merges. Compare this to *Comparisons* on random data: runny data finishes in roughly half the operations.",
    },
    {
      title: "03 · Watch the merge stack collapse",
      body: "During Phase 2, each step merges two adjacent runs into one. The total number of merges equals the number of runs minus one. On the runny-data seed (3 runs), expect 2 merges. On random data of length 12, expect closer to 6 merges. *Merges done* counts them live.",
    },
    {
      title: "04 · Step into a merge",
      body: "Use **Step** during a merge. The orange band marks the range being merged. Each step compares the fronts of the two runs and picks the smaller. After the merge, the orange band becomes one sorted green span — that's one merged run living in the run stack.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "timsort.ts",
      code: `// A simplified Timsort sketch: find runs, extend short ones, merge.
// Real Timsort adds galloping and the full merge-stack invariants.
const MINRUN = 32;

function timsort<T>(a: T[]): T[] {
  const n = a.length;
  // Phase 1: detect runs, extending short ones with insertion sort.
  const runs: Array<[number, number]> = []; // [start, length] pairs.
  let i = 0;
  while (i < n) {
    let runEnd = i + 1;
    while (runEnd < n && a[runEnd] >= a[runEnd - 1]) runEnd++;
    let runLen = runEnd - i;
    if (runLen < MINRUN) {
      const extendTo = Math.min(i + MINRUN, n);
      insertionSortRange(a, i, extendTo);
      runLen = extendTo - i;
    }
    runs.push([i, runLen]);
    i += runLen;
  }
  // Phase 2: merge runs in order (simplified — real Timsort uses a stack).
  while (runs.length > 1) {
    const [aStart, aLen] = runs.shift()!;
    const [, bLen] = runs.shift()!;
    mergeInPlace(a, aStart, aStart + aLen, aStart + aLen + bLen);
    runs.unshift([aStart, aLen + bLen]);
  }
  return a;
}

function insertionSortRange<T>(a: T[], lo: number, hi: number): void {
  for (let i = lo + 1; i < hi; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= lo && a[j] > key) { a[j + 1] = a[j]; j--; }
    a[j + 1] = key;
  }
}

function mergeInPlace<T>(a: T[], lo: number, mid: number, hi: number): void {
  const left = a.slice(lo, mid), right = a.slice(mid, hi);
  let i = 0, j = 0, k = lo;
  while (i < left.length && j < right.length) {
    a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
  }
  while (i < left.length) a[k++] = left[i++];
  while (j < right.length) a[k++] = right[j++];
}

timsort([5, 21, 7, 23, 19]); // → [5, 7, 19, 21, 23]`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Timsort.java",
      code: `// A simplified Timsort sketch: find runs, extend short ones, merge.
// Real Timsort adds galloping and the full merge-stack invariants.
import java.util.*;

static final int MINRUN = 32;

static <T extends Comparable<T>> T[] timsort(T[] a) {
    int n = a.length;
    // Phase 1: detect runs, extending short ones with insertion sort.
    Deque<int[]> runs = new ArrayDeque<>(); // [start, length] pairs.
    int i = 0;
    while (i < n) {
        int runEnd = i + 1;
        while (runEnd < n && a[runEnd].compareTo(a[runEnd - 1]) >= 0) runEnd++;
        int runLen = runEnd - i;
        if (runLen < MINRUN) {
            int extendTo = Math.min(i + MINRUN, n);
            insertionSortRange(a, i, extendTo);
            runLen = extendTo - i;
        }
        runs.addLast(new int[]{i, runLen});
        i += runLen;
    }
    // Phase 2: merge runs in order (simplified — real Timsort uses a stack).
    while (runs.size() > 1) {
        int[] runA = runs.pollFirst();
        int[] runB = runs.pollFirst();
        int aStart = runA[0], aLen = runA[1], bLen = runB[1];
        mergeInPlace(a, aStart, aStart + aLen, aStart + aLen + bLen);
        runs.addFirst(new int[]{aStart, aLen + bLen});
    }
    return a;
}

static <T extends Comparable<T>> void insertionSortRange(T[] a, int lo, int hi) {
    for (int i = lo + 1; i < hi; i++) {
        T key = a[i];
        int j = i - 1;
        while (j >= lo && a[j].compareTo(key) > 0) { a[j + 1] = a[j]; j--; }
        a[j + 1] = key;
    }
}

static <T extends Comparable<T>> void mergeInPlace(T[] a, int lo, int mid, int hi) {
    List<T> left = new ArrayList<>(Arrays.asList(a).subList(lo, mid));
    List<T> right = new ArrayList<>(Arrays.asList(a).subList(mid, hi));
    int i = 0, j = 0, k = lo;
    while (i < left.size() && j < right.size()) {
        a[k++] = left.get(i).compareTo(right.get(j)) <= 0 ? left.get(i++) : right.get(j++);
    }
    while (i < left.size()) a[k++] = left.get(i++);
    while (j < right.size()) a[k++] = right.get(j++);
}

timsort(new Integer[]{5, 21, 7, 23, 19}); // → [5, 7, 19, 21, 23]`,
    },
    {
      label: "Python",
      language: "python",
      filename: "timsort.py",
      code: `# A simplified Timsort sketch: find runs, extend short ones, merge.
# Real Timsort adds galloping and the full merge-stack invariants.
MINRUN = 32


def timsort(a: list) -> list:
    n = len(a)
    # Phase 1: detect runs, extending short ones with insertion sort.
    runs: list[list[int]] = []  # [start, length] pairs.
    i = 0
    while i < n:
        run_end = i + 1
        while run_end < n and a[run_end] >= a[run_end - 1]:
            run_end += 1
        run_len = run_end - i
        if run_len < MINRUN:
            extend_to = min(i + MINRUN, n)
            insertion_sort_range(a, i, extend_to)
            run_len = extend_to - i
        runs.append([i, run_len])
        i += run_len
    # Phase 2: merge runs in order (simplified — real Timsort uses a stack).
    while len(runs) > 1:
        a_start, a_len = runs.pop(0)
        _, b_len = runs.pop(0)
        merge_in_place(a, a_start, a_start + a_len, a_start + a_len + b_len)
        runs.insert(0, [a_start, a_len + b_len])
    return a


def insertion_sort_range(a: list, lo: int, hi: int) -> None:
    for i in range(lo + 1, hi):
        key = a[i]
        j = i - 1
        while j >= lo and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key


def merge_in_place(a: list, lo: int, mid: int, hi: int) -> None:
    left, right = a[lo:mid], a[mid:hi]
    i = j = 0
    k = lo
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            a[k] = left[i]
            i += 1
        else:
            a[k] = right[j]
            j += 1
        k += 1
    while i < len(left):
        a[k] = left[i]
        i += 1
        k += 1
    while j < len(right):
        a[k] = right[j]
        j += 1
        k += 1


timsort([5, 21, 7, 23, 19])  # → [5, 7, 19, 21, 23]`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "timsort.cpp",
      code: `// A simplified Timsort sketch: find runs, extend short ones, merge.
// Real Timsort adds galloping and the full merge-stack invariants.
#include <vector>
#include <deque>
#include <array>
#include <algorithm>

const int MINRUN = 32;

template <typename T>
void insertionSortRange(std::vector<T>& a, int lo, int hi) {
    for (int i = lo + 1; i < hi; i++) {
        T key = a[i];
        int j = i - 1;
        while (j >= lo && a[j] > key) { a[j + 1] = a[j]; j--; }
        a[j + 1] = key;
    }
}

template <typename T>
void mergeInPlace(std::vector<T>& a, int lo, int mid, int hi) {
    std::vector<T> left(a.begin() + lo, a.begin() + mid);
    std::vector<T> right(a.begin() + mid, a.begin() + hi);
    size_t i = 0, j = 0;
    int k = lo;
    while (i < left.size() && j < right.size()) {
        a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    }
    while (i < left.size()) a[k++] = left[i++];
    while (j < right.size()) a[k++] = right[j++];
}

template <typename T>
std::vector<T> timsort(std::vector<T> a) {
    int n = a.size();
    // Phase 1: detect runs, extending short ones with insertion sort.
    std::deque<std::array<int, 2>> runs; // [start, length] pairs.
    int i = 0;
    while (i < n) {
        int runEnd = i + 1;
        while (runEnd < n && a[runEnd] >= a[runEnd - 1]) runEnd++;
        int runLen = runEnd - i;
        if (runLen < MINRUN) {
            int extendTo = std::min(i + MINRUN, n);
            insertionSortRange(a, i, extendTo);
            runLen = extendTo - i;
        }
        runs.push_back({i, runLen});
        i += runLen;
    }
    // Phase 2: merge runs in order (simplified — real Timsort uses a stack).
    while (runs.size() > 1) {
        auto runA = runs.front(); runs.pop_front();
        auto runB = runs.front(); runs.pop_front();
        int aStart = runA[0], aLen = runA[1], bLen = runB[1];
        mergeInPlace(a, aStart, aStart + aLen, aStart + aLen + bLen);
        runs.push_front({aStart, aLen + bLen});
    }
    return a;
}

// timsort<int>({5, 21, 7, 23, 19}); // → [5, 7, 19, 21, 23]`,
    },
  ],

  furtherReading: [
    {
      label: "Tim Peters — *listsort.txt* (Timsort design doc)",
      href: "https://github.com/python/cpython/blob/main/Objects/listsort.txt",
      note: "Tim Peters's own description of Timsort. The single best document on the algorithm — explains every design decision, including why the run-stack invariants matter.",
      kind: "docs",
    },
    {
      label: "de Gouw et al. — *How to break Timsort and how to fix it* (repro + paper, 2015)",
      href: "https://github.com/abstools/java-timsort-bug",
      note: "The companion GitHub repo for the formal-verification paper that uncovered the latent merge-invariant bug in Timsort. Has the worst-case input generator and links to the paper. Java and Python both shipped patches afterwards.",
      kind: "paper",
    },
    {
      label: "Auger, Jugé, Nicaud, Pivoteau — *On the Worst-Case Complexity of Timsort* (2018)",
      href: "https://drops.dagstuhl.de/opus/volltexte/2018/9467/pdf/LIPIcs-ESA-2018-4.pdf",
      note: "Tight analysis of Timsort's worst-case complexity (O(n log n)) and the best-case adaptive bound (O(n + n·H) where H measures pre-sortedness).",
      kind: "paper",
    },
    {
      label: "Wikipedia — Timsort",
      href: "https://en.wikipedia.org/wiki/Timsort",
      note: "Concise summary of the algorithm, the merge invariants, galloping mode, and the history.",
      kind: "article",
    },
    {
      label: "GeeksforGeeks — TimSort walkthrough",
      href: "https://www.geeksforgeeks.org/timsort/",
      note: "Step-by-step walkthrough of the three phases (runs → insertion → merge), with implementations in Python, Java, C++, JavaScript. Pairs nicely with the prototype above.",
      kind: "article",
    },
    {
      label: "Java's Arrays.sort and TimSort.java source",
      href: "https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/TimSort.java",
      note: "Production Timsort in 1000 lines of commented Java. Worth reading once you've understood the algorithm — every comment is a tuning decision.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "ts-q1",
      question:
        "What's Timsort's best-case time complexity, and on what input?",
      options: [
        { id: "a", label: "O(n log n) on every input — Timsort is just merge sort." },
        { id: "b", label: "O(n) on already-sorted (or reverse-sorted) input — Phase 1 finds one giant run, Phase 2 has nothing to merge." },
        { id: "c", label: "O(log n) on small inputs." },
        { id: "d", label: "O(n²) — Timsort uses insertion sort internally." },
      ],
      correctOptionId: "b",
      explanation:
        "Sorted input: Timsort scans, detects one run of length n, has no merges to do, and returns in O(n). Reverse-sorted: detects one descending run, reverses it in O(n), done. This is why benchmarking Timsort on `sort(sorted_list)` feels instant — and why Python's sort() is so fast on pre-grouped data.",
    },
    {
      id: "ts-q2",
      question:
        "Why does Timsort use insertion sort to extend short runs instead of just merging them as-is?",
      options: [
        { id: "a", label: "Because insertion sort doesn't use any memory." },
        { id: "b", label: "Because for n < ~32 the constant-factor advantages of insertion sort beat the merge-step overhead." },
        { id: "c", label: "Because insertion sort is stable and merge isn't." },
        { id: "d", label: "Because insertion sort is the only sort that handles duplicates." },
      ],
      correctOptionId: "b",
      explanation:
        "Below ~32 elements, insertion sort's tight inner loop, lack of recursion, and cache friendliness beat merge sort's split-and-buffer overhead. Timsort's `minrun` parameter (~32) sets exactly this threshold. Pure merging tiny runs would waste both work and memory.",
    },
    {
      id: "ts-q3",
      question:
        "Why does Timsort merge runs in stack order rather than left-to-right?",
      options: [
        { id: "a", label: "Because left-to-right merging would be slower." },
        { id: "b", label: "Because the stack invariants keep run sizes balanced, which bounds total merge work to O(n log n) regardless of run distribution." },
        { id: "c", label: "Because stacks are easier to implement than queues." },
        { id: "d", label: "Stack order has no specific reason; either order works." },
      ],
      correctOptionId: "b",
      explanation:
        "The merge-stack invariants (`|C| > |B| + |A|` and `|B| > |A|`) force runs to merge roughly with similar-sized neighbours. Without them, you could merge a 100-element run with a 1-element run, then with another 1-element run, doing way more total copying than the log n bound allows. The invariants are what keep Timsort's worst case at O(n log n) — and were the load-bearing piece of the 2015 verification bug.",
    },
  ],
};
