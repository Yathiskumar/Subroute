import type { ConceptContent } from "@/lib/content/types";

export const counting: ConceptContent = {
  prototypeCaption:
    "Phase 1 counts how many times each value appears. Phase 2 turns the counts into running totals (= end positions). Phase 3 places each value at its slot, right-to-left. Press **Play** for the full sort, **Step** / **Back** to walk each phase, **Shuffle** for a new list.",

  overview: [
    {
      type: "p",
      text: "**Counting sort breaks the O(n log n) barrier by not comparing anything.** Every comparison sort needs Ω(n log n) in the worst case — that's a proven lower bound. Counting sort sidesteps it entirely: instead of asking 'is a < b?', it asks 'how many of each value are there?' and uses the answer to place every element directly at its final position.",
    },
    {
      type: "p",
      text: "Three passes do the whole job. **Pass 1** scans the input and tallies — `count[v]` ends up holding how many copies of value `v` exist. **Pass 2** converts those tallies into a prefix sum: now `count[v]` holds the *index where the last copy of v will end up*. **Pass 3** walks the input right-to-left and uses the prefix sums to drop each value at its final slot, decrementing the count after each placement. The result is sorted, in O(n + k) where k is the size of the value range.",
    },
    {
      type: "p",
      text: "The catch is that k. Counting sort uses a `count` array of size k+1, and you'll touch every slot of it during the prefix-sum pass. For small bounded ranges — bytes (k = 256), votes (k = number of candidates), exam scores (k = 100) — that's fine and the sort is blazingly fast. For 64-bit integers (k = 2⁶⁴), counting sort is laughably unsuitable. The right way to think about it: counting sort is for **bounded small-key** data, and it's the base case underneath radix sort.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Phase 1 — count" },
    {
      type: "ol",
      items: [
        "Allocate `count[0 … k]` and zero it.",
        "For each `v` in the input: `count[v]++`.",
        "After the pass, `count[v]` is the number of occurrences of value `v`.",
      ],
    },
    { type: "h", text: "Phase 2 — prefix-sum into end positions" },
    {
      type: "ol",
      items: [
        "For `v` from 1 to k: `count[v] += count[v-1]`.",
        "Now `count[v]` is the *one-past-the-last* slot index where value `v` will live in the output.",
        "Equivalently: `count[v] - 1` is where the last copy of v goes.",
      ],
    },
    { type: "h", text: "Phase 3 — place, right-to-left" },
    {
      type: "ol",
      items: [
        "Walk the input from index `n-1` down to 0 (right-to-left — this is what makes the sort *stable*).",
        "For each input value `v`: place it at `output[count[v] - 1]`, then `count[v]--`.",
        "After the loop, `output` is the sorted array.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why right-to-left makes it stable",
      text: "If two records have the same key `v`, the one earlier in the input gets placed first if we walk right-to-left — because we use `count[v] - 1` (the rightmost free slot for v) and decrement. So the original left-to-right order of equal keys is preserved. A left-to-right pass would reverse them. Stability is what lets radix sort use counting sort as its inner pass.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "When k matters more than n",
      text: "If your input has n = 1000 elements but values span 0 to 10⁹, counting sort allocates a billion-slot array. That's not a sort, that's an OOM. The rule of thumb: counting sort is the right tool when k is O(n) or smaller. For larger k with smaller key-widths, switch to radix.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Integer keys in a small known range** — votes, ages, exam scores, byte values, palette indices.",
        "**As radix sort's inner pass** — a stable O(n) per-digit sort is exactly what radix needs.",
        "**Histogram building** — pass 1 alone is essentially `Counter(items)`.",
        "**Stable bucketing** — group by category while preserving input order within each category.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Floating-point or string keys** — there's no natural finite count array. Use a comparison sort.",
        "**Wide integer ranges** — k ≫ n means you're allocating more memory than you can fit. Switch to radix or comparison sort.",
        "**You can't afford O(n + k) extra memory** — counting sort isn't in-place.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**O(n + k) — linear when k is O(n)** — the fastest sort known when the key range is bounded.",
      "**Stable** — right-to-left placement preserves the input order of equal keys.",
      "**No comparisons** — sidesteps the n log n lower bound for comparison sorts.",
      "**Foundation for radix sort** — radix is just counting sort applied per digit.",
      "**Trivial to parallelise the count phase** — each thread tallies its slice independently, then merge.",
    ],
    cons: [
      "**Not in-place** — needs a count array of size k+1 and a separate output array of size n.",
      "**O(n + k) memory** — unusable when k is huge.",
      "**Only works on integer-keyed data** — or anything mappable to a small integer.",
      "**Doesn't adapt** — sorted input takes the same work as random.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the three phases run end-to-end",
      body: "Press **Play**. Watch the *Phase* stat change: **Count** (tallies climb), **Prefix** (counts turn into running totals), **Place** (each input value lands directly at its slot). Notice that the output array fills in *out of input order* during placement — counting sort doesn't move adjacent things together.",
    },
    {
      title: "02 · Step through the count phase",
      body: "Use **Step** through Phase 1. Each tick of *Operations* is one increment. Watch the purple bar move across the count slots as each input value bumps its tally. After n increments, every value's count is locked.",
    },
    {
      title: "03 · See the prefix sum turn counts into positions",
      body: "Step through Phase 2. Each `count[v] += count[v-1]` is one operation. After the prefix-sum, `count[v]` is no longer 'how many of v' — it's 'one past where v's last copy lands.' That's the precomputed lookup table the placement phase will use.",
    },
    {
      title: "04 · Shuffle and notice k matters, not n",
      body: "Press **Shuffle** for a new random list of 9 values in [0, 9]. The total number of operations barely changes — it's always ≈ n + k. Try imagining the same algorithm on values in [0, 1 000 000]: the count array alone would dominate. That's why counting sort is for *small-range* integer data.",
    },
  ],

  code: {
    language: "typescript",
    filename: "counting-sort.ts",
    code: `// Counting sort — stable, O(n + k), not in-place.
// Requires integer keys in [0, k].
function countingSort(a: number[], k: number): number[] {
  const n = a.length;
  const count = new Array(k + 1).fill(0);
  const out = new Array(n);

  // Phase 1: tally.
  for (let i = 0; i < n; i++) count[a[i]]++;

  // Phase 2: prefix-sum into end-position-plus-one.
  for (let v = 1; v <= k; v++) count[v] += count[v - 1];

  // Phase 3: place, right-to-left for stability.
  for (let i = n - 1; i >= 0; i--) {
    const v = a[i];
    out[--count[v]] = v;
  }
  return out;
}

// Example
countingSort([4, 2, 2, 8, 3, 3, 1], 8);
// → [1, 2, 2, 3, 3, 4, 8]
// Memory: O(n + k). Time: O(n + k).`,
  },

  furtherReading: [
    {
      label: "Harold H. Seward — *Information Sorting in the Application of Electronic Digital Computers to Business Operations* (1954)",
      href: "https://dspace.mit.edu/handle/1721.1/15363",
      note: "MIT thesis introducing counting sort under the name 'distribution sort.' One of the earliest non-comparison sorting algorithms.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, §8.2 Counting Sort",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The standard treatment including the lower-bound proof for comparison sorts that counting sort cheats around.",
      kind: "book",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms* §5.1 String Sorts",
      href: "https://algs4.cs.princeton.edu/51radix/",
      note: "Builds counting sort as the inner loop for LSD radix string sort. The right place to learn counting sort if you also want radix.",
      kind: "book",
    },
    {
      label: "Wikipedia — Counting sort",
      href: "https://en.wikipedia.org/wiki/Counting_sort",
      note: "Covers the variant that handles negative keys (shift the range), and the parallel-counting-sort trick used in GPU implementations.",
      kind: "article",
    },
    {
      label: "GeeksforGeeks — Counting Sort",
      href: "https://www.geeksforgeeks.org/counting-sort/",
      note: "Clean code in many languages, with a step-by-step worked example and the standard stability discussion.",
      kind: "article",
    },
    {
      label: "Brilliant — Counting Sort",
      href: "https://brilliant.org/wiki/counting-sort/",
      note: "Good intuitive explanation of why the prefix-sum step does the heavy lifting and why right-to-left placement is what makes the sort stable.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "cs-q1",
      question:
        "Why does counting sort break the O(n log n) lower bound for comparison sorts?",
      options: [
        { id: "a", label: "Because it uses extra memory." },
        { id: "b", label: "Because the lower bound only applies to algorithms that decide order via comparisons; counting sort uses values as array indices instead." },
        { id: "c", label: "Because k is always smaller than log n." },
        { id: "d", label: "Because it's parallelisable." },
      ],
      correctOptionId: "b",
      explanation:
        "The Ω(n log n) bound is for *comparison* sorts — algorithms that must distinguish n! possible orderings via comparisons, which needs ≥ log₂(n!) ≈ n log n comparisons. Counting sort never compares two elements; it uses each value as a count-array index. Different model, different lower bound.",
    },
    {
      id: "cs-q2",
      question:
        "When does counting sort become *worse* than mergesort?",
      options: [
        { id: "a", label: "When n is small." },
        { id: "b", label: "When k (the key range) is much larger than n." },
        { id: "c", label: "When the input contains duplicates." },
        { id: "d", label: "When the input is already sorted." },
      ],
      correctOptionId: "b",
      explanation:
        "Counting sort is O(n + k) in both time and memory. When k >> n (e.g. 64-bit integers, n = 1000), the count array alone takes more memory than the data, and the prefix-sum pass dominates the runtime. Comparison sorts stay at O(n log n) regardless of value range, so mergesort wins.",
    },
    {
      id: "cs-q3",
      question:
        "Why does counting sort walk the input *right-to-left* in the placement phase?",
      options: [
        { id: "a", label: "Because right-to-left is faster on modern CPUs." },
        { id: "b", label: "Because it has to match the prefix-sum direction." },
        { id: "c", label: "Because right-to-left placement keeps equal-keyed elements in their original input order — that's what makes the sort stable, and stability is what radix sort needs." },
        { id: "d", label: "It's an arbitrary choice; either direction works." },
      ],
      correctOptionId: "c",
      explanation:
        "If two input items have the same key v, the one earlier in the input must end up at the earlier output slot for v. Walking right-to-left and using count[v]-1 (then decrementing) achieves exactly that. Walking left-to-right would reverse equal-keyed pairs — fine for a one-off sort, but breaks radix sort, which relies on the inner sort being stable.",
    },
  ],
};
