import type { ConceptContent } from "@/lib/content/types";

export const radix: ConceptContent = {
  prototypeCaption:
    "Pass 1 sorts by the ones digit (drop each number into bucket 0–9, then collect). Pass 2 sorts by the tens. Pass 3 by the hundreds. After the highest digit, the list is fully sorted. Press **Play** to watch every pass, **Step** / **Back** to walk each placement, **Shuffle** for a new list.",

  overview: [
    {
      type: "p",
      text: "**Radix sort sorts by one digit at a time — and somehow ends up sorted overall.** Pass 1 sorts the list by the ones digit. Pass 2 sorts the result by the tens. Pass 3 by the hundreds. After d passes (where d is the number of digits), the array is fully sorted. The magic is that each pass uses a **stable** sub-sort (counting sort, almost always), so the work of earlier passes survives each later pass.",
    },
    {
      type: "p",
      text: "This is the **least-significant-digit (LSD)** variant — the one almost always meant by 'radix sort.' Sort from the ones up, and you finish when the most-significant digit pass is done. The alternative, **MSD radix**, sorts from the top digit down and is the right shape for strings, but LSD is simpler to reason about and dominates for fixed-width integer keys.",
    },
    {
      type: "p",
      text: "The complexity is O(d · (n + k)) where d is the number of digits and k is the radix (10 for decimal, 256 for byte-radix). When d is small (fixed-width integers) and k is small (any reasonable radix), radix sort runs in **linear time** — and it really does, in practice. It's the sort of choice for billion-element integer datasets where O(n log n) comparison sorts get crushed by the log factor.",
    },
  ],

  howItWorks: [
    { type: "h", text: "One pass (the d-th digit)" },
    {
      type: "ol",
      items: [
        "Use a stable inner sort — usually counting sort — keyed on the d-th digit of each number.",
        "Walk the current list left-to-right. For each value, extract digit d and drop the value into `bucket[digit]` (one of 10 buckets in base 10).",
        "Walk buckets 0 → 9 in order, appending their contents to the new list.",
        "Because the inner sort is stable, two values with the same d-th digit preserve their previous relative order — which encodes the result of all earlier passes.",
      ],
    },
    { type: "h", text: "All passes" },
    {
      type: "ol",
      items: [
        "Find the maximum value to know how many digits you need: `d = digits(max)`.",
        "For `p = 0` to `d - 1`: run one pass keyed on digit at position `p` (ones, tens, hundreds, …).",
        "After the last pass, the array is sorted.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why stability is the load-bearing property",
      text: "Imagine pass 1 (ones digit) finishes, then pass 2 (tens digit) re-orders by tens. Two values with the same tens digit must keep the order they had after pass 1 — otherwise pass 1's work is wasted. Stable counting sort guarantees that. If you used quicksort as the inner pass, radix would silently corrupt earlier passes' work.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "MSD vs LSD",
      text: "LSD radix sorts the bottom digit first; you finish in d passes regardless of input. MSD sorts the top digit first, then recursively sorts each bucket — finishes early when buckets become single elements. MSD is the right shape for variable-length strings (it can stop at common prefixes), LSD is the right shape for fixed-width integers. Most textbook 'radix sort' is LSD.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Fixed-width integer keys at scale** — IPv4 addresses, timestamps, 64-bit hashes, SSNs, phone numbers. d is constant, total work is O(n).",
        "**Sorting strings of bounded length** — use MSD radix to descend into common prefixes.",
        "**External sorting of integers** — radix can be implemented with sequential I/O; great for disk-backed sorts.",
        "**GPU sorting** — the per-digit counting step parallelises beautifully across thousands of threads.",
        "**When O(n log n) is hitting the log-factor wall** — at n = 10⁹, log₂(n) ≈ 30; that 30× factor is what radix sort eliminates.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Floating-point keys** — workable but tricky (need to handle sign bit, exponent). Comparison sort is simpler.",
        "**Variable-length keys with no max** — MSD can recurse forever; comparison sorts handle this directly.",
        "**Small n** — comparison sort's constants beat radix's allocations and bucket maintenance for n < ~100.",
        "**Highly skewed distributions** — most buckets are empty; the per-pass overhead dominates.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Linear in n** for fixed-width keys — O(d · (n + k)) with d and k constant.",
      "**Stable** — naturally, because the inner counting sort is stable.",
      "**Beats comparison sorts at very large n** — when log n itself becomes a noticeable constant factor.",
      "**Parallelisable per-digit** — counting and bucketing can be sharded across threads or GPU cores.",
      "**No comparisons needed** — sidesteps the n log n lower bound the same way counting sort does.",
    ],
    cons: [
      "**O(n + k) extra memory** — buckets and the inner counting sort's count array.",
      "**Bad for variable-length or unbounded-range keys** — d grows with the input.",
      "**Per-pass constant factor isn't tiny** — for small n, quicksort/Timsort win.",
      "**Less general** than comparison sorts — strings, floats, and custom comparators all need work.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through all the digit passes",
      body: "Press **Play**. Watch the *Sorting by* stat change: **Ones**, then **Tens**, then **Hundreds**. After each pass, the new list is the contents of buckets 0 → 9 in order. Notice the list isn't fully sorted until the highest digit pass completes — earlier passes look almost random.",
    },
    {
      title: "02 · Step into one pass",
      body: "Use **Step** during a pass. Each step either reads a value from the list (orange highlight on the digit being read), drops it into the matching bucket, or — at the end — collects all buckets into the new list. Watch the underlined digit in the chip — that's the one being keyed on.",
    },
    {
      title: "03 · Verify the stability invariant",
      body: "Pick two values with the same tens digit — say 42 and 47. After pass 2 (tens), both should land in bucket 4. Check that 42 and 47 keep the relative order they had after pass 1 (which sorted by ones digit). That's stability surviving the pass — exactly what makes radix sort correct.",
    },
    {
      title: "04 · Shuffle and watch d grow with magnitude",
      body: "Press **Shuffle**. If the random max is 87, only 2 passes run (ones, tens). If it's 752, 3 passes run. d depends on the max value, not n. That's why radix is so good on fixed-width keys: d is bounded by the key width, so the work is linear in n.",
    },
  ],

  code: {
    language: "typescript",
    filename: "radix-sort.ts",
    code: `// LSD radix sort for non-negative integers.
// Stable, O(d · (n + b)) where d = digit count, b = radix.
function radixSort(a: number[], radix = 10): number[] {
  if (a.length === 0) return a;
  const max = Math.max(...a);
  let out = a.slice();
  for (let exp = 1; exp <= max; exp *= radix) {
    out = countingSortByDigit(out, exp, radix);
  }
  return out;
}

function countingSortByDigit(a: number[], exp: number, b: number): number[] {
  const n = a.length;
  const count = new Array(b).fill(0);
  const out = new Array(n);

  // Tally by the current digit.
  for (let i = 0; i < n; i++) count[Math.floor(a[i] / exp) % b]++;

  // Prefix-sum into end positions.
  for (let v = 1; v < b; v++) count[v] += count[v - 1];

  // Place right-to-left so the inner sort is stable.
  for (let i = n - 1; i >= 0; i--) {
    const d = Math.floor(a[i] / exp) % b;
    out[--count[d]] = a[i];
  }
  return out;
}

// Example
radixSort([170, 45, 75, 90, 802, 24, 2, 66]);
// → [2, 24, 45, 66, 75, 90, 170, 802]`,
  },

  furtherReading: [
    {
      label: "Herman Hollerith — *An Electric Tabulating System* (1889)",
      href: "https://dl.acm.org/doi/10.1109/MAHC.1986.10080",
      note: "Hollerith invented mechanical radix sort for the 1890 US Census. The card-sorting machines that became IBM directly implemented this algorithm — sorting one digit at a time, one pass per digit.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, §8.3 Radix Sort",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Includes the proof that LSD radix is correct iff the inner sort is stable, and the running-time analysis as a function of d, n, k.",
      kind: "book",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms* §5.1 String Sorts",
      href: "https://algs4.cs.princeton.edu/51radix/",
      note: "Covers both LSD and MSD radix sort, with the application to variable-length strings that LSD struggles with. The canonical undergraduate treatment.",
      kind: "book",
    },
    {
      label: "Duane Merrill & Andrew Grimshaw — *High Performance and Scalable Radix Sorting* (2011)",
      href: "https://research.nvidia.com/publication/2011-02_high-performance-and-scalable-radix-sorting-case-study-implementing-dynamic",
      note: "NVIDIA paper on GPU radix sort. Shows why radix wins on massively parallel hardware: each digit pass shards perfectly across thousands of threads.",
      kind: "paper",
    },
    {
      label: "Wikipedia — Radix sort",
      href: "https://en.wikipedia.org/wiki/Radix_sort",
      note: "Walks through both LSD and MSD variants, the negative-number handling tricks, and the floating-point radix sort variant (sort by bit pattern with sign-bit flip).",
      kind: "article",
    },
    {
      label: "Engineering radix sort — Knuth, *TAOCP* Vol. 3 §5.2.5",
      href: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html",
      note: "Knuth's chapter analyses the optimal radix choice (it's surprisingly large — often 256 for modern hardware) and the cache-miss tradeoffs.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "rs-q1",
      question:
        "Why does LSD radix sort *require* the inner per-digit sort to be stable?",
      options: [
        { id: "a", label: "Stability makes the algorithm faster." },
        { id: "b", label: "Without stability, a later pass would re-order elements that earlier passes had already placed correctly — losing all earlier work." },
        { id: "c", label: "Stability is necessary only when sorting strings." },
        { id: "d", label: "It isn't required; any sort works." },
      ],
      correctOptionId: "b",
      explanation:
        "Each pass sorts by *one digit*. For values that share that digit, the result of all previous passes must survive. Stability is exactly the property that says 'equal-keyed elements keep their previous order.' Use an unstable inner sort and radix produces garbage.",
    },
    {
      id: "rs-q2",
      question:
        "Sorting 1 billion 64-bit integers with byte-radix (k = 256). About how many passes does LSD radix sort do?",
      options: [
        { id: "a", label: "About log₂(10⁹) ≈ 30 — same as a comparison sort." },
        { id: "b", label: "8 passes — one per byte of the 64-bit key." },
        { id: "c", label: "256 passes — one per radix bucket." },
        { id: "d", label: "1 pass." },
      ],
      correctOptionId: "b",
      explanation:
        "A 64-bit key has 8 bytes, and byte-radix means 8 passes total — fixed, independent of n. Total work O(8 · (10⁹ + 256)) ≈ O(n). A comparison sort would do n × 30 = 30 × 10⁹ comparisons. At this scale radix beats comparison sorts by an order of magnitude.",
    },
    {
      id: "rs-q3",
      question:
        "When is MSD radix sort preferable to LSD?",
      options: [
        { id: "a", label: "When the keys are fixed-width integers." },
        { id: "b", label: "When you want O(1) memory." },
        { id: "c", label: "When the keys are variable-length strings — MSD can stop early at common prefixes, while LSD has to do d passes for the longest key." },
        { id: "d", label: "Never — LSD always wins." },
      ],
      correctOptionId: "c",
      explanation:
        "LSD has to process every key for every digit position up to the max length, so a single 100-character string forces 100 passes over everything. MSD recurses into buckets — once a bucket has one element, that's a leaf and you're done. For strings, MSD's early termination is a huge win. For fixed-width integers, LSD is simpler and faster.",
    },
  ],
};
