import type { ConceptContent } from "@/lib/content/types";

export const bucket: ConceptContent = {
  prototypeCaption:
    "Phase 1 scatters each value into the bucket for its range. Phase 2 sorts each bucket individually. Phase 3 concatenates buckets 0 → B-1 to produce the sorted output. Press **Play** to watch the three phases, **Step** / **Back** to walk each placement, **Shuffle** for a new list.",

  overview: [
    {
      type: "p",
      text: "**Bucket sort splits the value range into a handful of buckets, sorts each bucket on its own, then concatenates them.** If the input is roughly uniform across the range, the buckets are small and the per-bucket sorts are fast — so fast that the total work approaches O(n). It's the sort of choice when you know your data is, or can be made, roughly evenly distributed.",
    },
    {
      type: "p",
      text: "The three phases are mechanical. **Scatter:** for each value, compute its bucket (e.g. `v / range`) and append it there. **Sort:** sort each bucket on its own — usually with insertion sort, since buckets are small. **Gather:** walk buckets 0 → B-1 in order and concatenate. Because the buckets are ordered by value range and each bucket is sorted internally, the concatenation is sorted.",
    },
    {
      type: "p",
      text: "The expected runtime is O(n + n²/B + B) — linear when B is Θ(n) and the data is uniform. The catch is **skew**: if all the input lands in one bucket, you're really just running insertion sort on the whole input, and the algorithm degenerates to O(n²). Bucket sort and counting sort are cousins — counting sort uses one bucket per value, bucket sort uses one bucket per range — but bucket sort is the right tool for *continuous* values (floats from a uniform distribution) where you can't afford a count slot per distinct value.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Phase 1 — Scatter" },
    {
      type: "ol",
      items: [
        "Create B empty buckets covering the value range.",
        "For each value `v` in the input: append it to `bucket[floor(v / range_size)]`.",
        "After the pass, every value is in the bucket for its value range — but not sorted within the bucket yet.",
      ],
    },
    { type: "h", text: "Phase 2 — Sort each bucket" },
    {
      type: "ol",
      items: [
        "Walk buckets 0 → B-1.",
        "Sort each non-empty bucket with any sort. Insertion sort is the typical choice because buckets are expected to be small (~n/B elements each).",
        "After this phase, each bucket is sorted internally; the bucket order is already correct.",
      ],
    },
    { type: "h", text: "Phase 3 — Gather" },
    {
      type: "ol",
      items: [
        "Walk buckets 0 → B-1 in order.",
        "Append each bucket's contents to the output.",
        "Done.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why bucket sort is near-linear when data is uniform",
      text: "Pick B = n buckets. Then the expected bucket size is 1, the per-bucket insertion sort is O(1) on expectation, and the total work is O(n) for scatter + O(n) for the n single-element sorts + O(n) for gather = O(n). Even with B = n/10, expected bucket size is 10 and insertion sort on size-10 takes ~100 ops per bucket, n/10 buckets = 10n ops. Still O(n).",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Skew is bucket sort's enemy",
      text: "If 90% of your values land in bucket 0, bucket sort isn't sorting them — insertion sort is, on a list of 0.9n elements, in O((0.9n)²). The whole algorithm degenerates to insertion sort. The fix is either to pick bucket boundaries adaptively (quantile-based), to use a comparison sort instead of insertion as the inner sort (recursive bucket sort), or to switch to radix when the data isn't uniform.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Uniform-ish floating-point data** — like sorting random doubles in [0, 1). The textbook bucket-sort use case.",
        "**Sorting random samples** — Monte Carlo outputs, random hashes from a uniform hash function, evenly-spread sensor readings.",
        "**As an internal step in distributed sorts** — Hadoop's Terasort scatters records into B partitions (buckets), each node sorts its bucket locally, then results gather. That's bucket sort on a cluster.",
        "**As external sort's bucket-scatter step** — when sorting more data than fits in RAM and you know the rough distribution.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Skewed data** — bucket sort degenerates to insertion sort on the heavy bucket. Use a comparison sort instead.",
        "**Discrete integer values in a small range** — use counting sort. Same idea but with one bucket per value.",
        "**Fixed-width integer keys at scale** — use radix. More robust to skew.",
        "**You don't know the value range** — bucket sort needs `min, max, range_size` up front.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Near-linear expected runtime** on uniform data — O(n) when B = Θ(n).",
      "**Naturally parallel** — each bucket's sort is independent. Used in distributed sorts (Hadoop, Spark).",
      "**Stable** if the inner sort is stable (insertion is).",
      "**Adaptive to data density** — if you know the distribution, you can size buckets to keep them balanced.",
      "**Conceptually simple** — three phases, easy to reason about, easy to debug.",
    ],
    cons: [
      "**O(n²) worst case** when all values land in one bucket.",
      "**Requires knowing the value range** in advance.",
      "**Memory-heavy** — B buckets plus per-bucket overhead.",
      "**Not great for integers** — counting and radix sort do the same job with better guarantees.",
      "**Bucket boundary choice matters a lot** — bad boundaries kill performance silently.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the three phases run",
      body: "Press **Play**. The *Phase* stat shows **Setup → Scatter → Sort → Gather → Done**. In Scatter, each value moves from the input list into its range-bucket. In Sort, each non-empty bucket sorts internally (the bucket border turns solid when it's being worked on). In Gather, the buckets concatenate in order into the output row.",
    },
    {
      title: "02 · Step the scatter phase",
      body: "Use **Step** to walk Phase 1. Each step reads one input value (orange highlight) and drops it into the matching bucket (the bucket border lights up). Notice that scatter is O(n) — one pass, one division, one append per value.",
    },
    {
      title: "03 · Watch a bucket sort itself",
      body: "Step into Phase 2. Each non-empty bucket gets sorted on its own. For a bucket with one value, nothing happens — already sorted. For a bucket with two or three values, the inner sort runs in microseconds; that's why bucket sort approaches O(n) when buckets stay small.",
    },
    {
      title: "04 · Shuffle and look for skew",
      body: "Press **Shuffle**. If the random values cluster in one range (e.g. all in 0–19), watch one bucket fill up while others stay empty. That's bucket sort's worst case: the heavy bucket dominates the inner sort. Real implementations either pick bucket boundaries adaptively or fall back to a comparison sort when skew is detected.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "bucket-sort.ts",
      code: `// Bucket sort — expected O(n) on uniform data, O(n²) worst case.
function bucketSort(a: number[], minVal: number, maxVal: number, B: number): number[] {
  const buckets: number[][] = Array.from({ length: B }, () => []);
  const range = (maxVal - minVal) / B;

  // Phase 1: scatter into buckets.
  for (const v of a) {
    const idx = Math.min(B - 1, Math.floor((v - minVal) / range));
    buckets[idx].push(v);
  }

  // Phase 2: sort each bucket (insertion sort is typical).
  for (const bucket of buckets) bucket.sort((x, y) => x - y);

  // Phase 3: gather in order.
  const out: number[] = [];
  for (const bucket of buckets) out.push(...bucket);
  return out;
}

// Example — 9 values in [0, 100), 5 buckets of width 20.
bucketSort([29, 25, 3, 49, 9, 37, 21, 43, 17], 0, 100, 5);
// → [3, 9, 17, 21, 25, 29, 37, 43, 49]`,
    },
    {
      label: "Java",
      language: "java",
      filename: "BucketSort.java",
      code: `// Bucket sort — expected O(n) on uniform data, O(n²) worst case.
import java.util.*;

static int[] bucketSort(int[] a, double minVal, double maxVal, int B) {
    List<List<Integer>> buckets = new ArrayList<>();
    for (int i = 0; i < B; i++) buckets.add(new ArrayList<>());
    double range = (maxVal - minVal) / B;

    // Phase 1: scatter into buckets.
    for (int v : a) {
        int idx = Math.min(B - 1, (int) Math.floor((v - minVal) / range));
        buckets.get(idx).add(v);
    }

    // Phase 2: sort each bucket (insertion sort is typical).
    for (List<Integer> bucket : buckets) Collections.sort(bucket);

    // Phase 3: gather in order.
    int[] out = new int[a.length];
    int k = 0;
    for (List<Integer> bucket : buckets)
        for (int v : bucket) out[k++] = v;
    return out;
}

// Example — 9 values in [0, 100), 5 buckets of width 20.
bucketSort(new int[]{29, 25, 3, 49, 9, 37, 21, 43, 17}, 0, 100, 5);
// → [3, 9, 17, 21, 25, 29, 37, 43, 49]`,
    },
    {
      label: "Python",
      language: "python",
      filename: "bucket_sort.py",
      code: `import math


def bucket_sort(a: list, min_val: float, max_val: float, B: int) -> list:
    """Bucket sort — expected O(n) on uniform data, O(n²) worst case."""
    buckets: list[list[float]] = [[] for _ in range(B)]
    rng = (max_val - min_val) / B

    # Phase 1: scatter into buckets.
    for v in a:
        idx = min(B - 1, math.floor((v - min_val) / rng))
        buckets[idx].append(v)

    # Phase 2: sort each bucket (insertion sort is typical).
    for bucket in buckets:
        bucket.sort()

    # Phase 3: gather in order.
    out: list[float] = []
    for bucket in buckets:
        out.extend(bucket)
    return out


# Example — 9 values in [0, 100), 5 buckets of width 20.
bucket_sort([29, 25, 3, 49, 9, 37, 21, 43, 17], 0, 100, 5)
# → [3, 9, 17, 21, 25, 29, 37, 43, 49]`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "bucket_sort.cpp",
      code: `// Bucket sort — expected O(n) on uniform data, O(n²) worst case.
#include <vector>
#include <algorithm>
#include <cmath>

std::vector<int> bucketSort(const std::vector<int>& a, double minVal, double maxVal, int B) {
    std::vector<std::vector<int>> buckets(B);
    double range = (maxVal - minVal) / B;

    // Phase 1: scatter into buckets.
    for (int v : a) {
        int idx = std::min(B - 1, (int) std::floor((v - minVal) / range));
        buckets[idx].push_back(v);
    }

    // Phase 2: sort each bucket (insertion sort is typical).
    for (auto& bucket : buckets) std::sort(bucket.begin(), bucket.end());

    // Phase 3: gather in order.
    std::vector<int> out;
    for (const auto& bucket : buckets)
        out.insert(out.end(), bucket.begin(), bucket.end());
    return out;
}

// Example — 9 values in [0, 100), 5 buckets of width 20.
// bucketSort({29, 25, 3, 49, 9, 37, 21, 43, 17}, 0, 100, 5);
// → [3, 9, 17, 21, 25, 29, 37, 43, 49]`,
    },
  ],

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, §8.4 Bucket Sort",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The expected-time analysis assuming uniform distribution. Shows how the n²/B² expected-work-per-bucket bound flattens to O(n) when B = Θ(n).",
      kind: "book",
    },
    {
      label: "OpenDSA — Bucket Sort",
      href: "https://opendsa-server.cs.vt.edu/ODSA/Books/Everything/html/Bucketsort.html",
      note: "Interactive textbook chapter with visualisations and code; pairs nicely with the prototype above.",
      kind: "article",
    },
    {
      label: "Hadoop TeraSort — Owen O'Malley (2008)",
      href: "https://sortbenchmark.org/YahooHadoop.pdf",
      note: "Yahoo's record-setting TeraSort uses bucket-sort-by-partition across a cluster. Real industrial bucket sort at petabyte scale.",
      kind: "paper",
    },
    {
      label: "Spark — RangePartitioner source",
      href: "https://github.com/apache/spark/blob/master/core/src/main/scala/org/apache/spark/Partitioner.scala",
      note: "Spark samples the input to determine quantile-based bucket boundaries before partitioning. A production fix to bucket-sort's skew problem.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Bucket sort",
      href: "https://en.wikipedia.org/wiki/Bucket_sort",
      note: "Covers the variants (generic bucket sort, ProxmapSort, postman's sort) and the relationship to counting and radix sort.",
      kind: "article",
    },
    {
      label: "Brilliant — Bucket Sort",
      href: "https://brilliant.org/wiki/bucket-sort/",
      note: "Clean walkthrough with the average-case analysis and a discussion of the right number of buckets B as a function of n.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "bks-q1",
      question:
        "Bucket sort's expected runtime is O(n) when the data is uniform. What happens when the data is heavily skewed?",
      options: [
        { id: "a", label: "Still O(n) — the algorithm self-balances." },
        { id: "b", label: "O(n log n) — like a comparison sort." },
        { id: "c", label: "O(n²) — most values land in one bucket and the inner sort becomes insertion sort on a near-full list." },
        { id: "d", label: "It fails to terminate." },
      ],
      correctOptionId: "c",
      explanation:
        "If 0.9n values land in one bucket, the inner sort runs on a list of length 0.9n. If that inner sort is insertion sort, you pay O((0.9n)²) — back to quadratic. The fix is either adaptive bucket boundaries (quantiles), a better inner sort (mergesort), or just switching to radix when skew is detected.",
    },
    {
      id: "bks-q2",
      question:
        "How does bucket sort relate to counting sort?",
      options: [
        { id: "a", label: "They're unrelated." },
        { id: "b", label: "Counting sort is bucket sort with exactly one bucket per distinct value." },
        { id: "c", label: "Bucket sort is counting sort with comparisons." },
        { id: "d", label: "Counting sort is bucket sort applied twice." },
      ],
      correctOptionId: "b",
      explanation:
        "Counting sort: one bucket per value, bucket size is just a count. Bucket sort: one bucket per *range*, bucket holds the actual values. Both bypass the n log n bound by partitioning the value space; counting works for discrete small-range keys, bucket works for continuous keys with known range.",
    },
    {
      id: "bks-q3",
      question:
        "Why is bucket sort a natural fit for distributed sorting frameworks like Hadoop's TeraSort?",
      options: [
        { id: "a", label: "Because it's the only sort that works on disk." },
        { id: "b", label: "Because each bucket's sort is independent — different machines can sort different buckets in parallel without any synchronisation." },
        { id: "c", label: "Because it's the fastest sort known." },
        { id: "d", label: "Because it doesn't require any sorting at all." },
      ],
      correctOptionId: "b",
      explanation:
        "Each bucket's sort is independent: assign bucket 0 to machine A, bucket 1 to machine B, etc., and they finish in parallel. The only coordination needed is choosing the bucket boundaries up front (Spark samples to estimate quantiles, TeraSort pre-samples). This is how every modern distributed sort works under the hood — bucket sort across the cluster.",
    },
  ],
};
