import type { TopicContent } from "@/lib/content/types";

export const sortingTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**Sorting is the first algorithm topic every programmer learns, and the only one you'll keep meeting forever.** Databases pre-sort to make joins cheap. Search engines pre-sort to do binary search. Log pipelines sort by time. The hash-and-route layer in front of every API sorts buckets internally. Every programming language ships a `sort()` — and inside that one function is roughly fifty years of engineering you should know about.",
    },
    {
      type: "p",
      text: "The ten algorithms here split into three families. **Comparison sorts** ask `a < b?` and shuffle elements around — bubble, selection, insertion, merge, quick, heap. Theory says these can't beat **O(n log n)** in the worst case. **Non-comparison sorts** sidestep that bound by *looking at the values themselves* — counting, radix, bucket — and run in O(n + k) when the data fits their assumptions. **Hybrid sorts** — Timsort — combine the best of comparison sorts with awareness of real-world data, which is rarely random.",
    },
    {
      type: "p",
      text: "Don't think of them as ten interchangeable boxes. Each one was the right answer to a *specific* situation: bubble teaches the swap; insertion is the right tool for nearly-sorted lists; quicksort wins the in-memory race when you control the pivot; mergesort is the right tool for stable external sorts; heapsort is the safe choice when you cannot tolerate quicksort's worst case; counting/radix/bucket all win when your data is integers in a known range; Timsort wins on the messy, partially-sorted lists that show up everywhere in practice.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Where this shows up" },
    {
      type: "ul",
      items: [
        "**Your language's sort()** — Python, Java, Rust, JavaScript V8 all ship Timsort or a close relative. Go and C++ use intro-sort, a quicksort that falls back to heapsort on bad pivots.",
        "**Databases** — `ORDER BY` runs an external mergesort when the data doesn't fit in RAM; B-tree pages stay sorted on disk so range scans are cheap.",
        "**Indexing pipelines** — Lucene, Elasticsearch, BigQuery, Spark all sort intermediate results to enable merge-joins and grouped aggregations.",
        "**Networking** — packet schedulers sort by deadline; routers sort by prefix length; Kademlia and other DHTs sort peers by XOR-distance.",
        "**Graphics & games** — depth-sorted transparency, BVH construction, A* open-set priority queues all hide a heap or a radix-style sort inside.",
        "**Coding interviews & data structures** — most algorithms problems either *are* a sort or *use* one as a preprocessing step. Sorting is the universal primitive.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why so many algorithms still matter",
      text: "It's tempting to memorise 'just use quicksort.' But quicksort hates already-sorted input. Mergesort needs O(n) extra memory. Counting sort needs a known small key range. Bucket sort needs roughly uniform data. Insertion sort beats everything on lists under ~16 elements. Real `sort()` implementations stitch several of these together — Timsort uses insertion for small runs and merge for everything else; Java's Arrays.sort uses dual-pivot quicksort for primitives and Timsort for objects. The reason there's no one winner is the algorithms aren't competing on the same problem.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Algorithm",
      bursts: "Best",
      precision: "Average",
      memory: "Worst",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "Bubble Sort",
        bursts: "O(n)",
        precision: "O(n²)",
        memory: "O(n²)",
        bestFor: "Teaching the swap primitive. Don't use it in real code.",
      },
      {
        algorithm: "Selection Sort",
        bursts: "O(n²)",
        precision: "O(n²)",
        memory: "O(n²)",
        bestFor: "When writes are far more expensive than reads (e.g. flash memory).",
      },
      {
        algorithm: "Insertion Sort",
        bursts: "O(n)",
        precision: "O(n²)",
        memory: "O(n²)",
        bestFor: "Small lists (n < ~16) and nearly-sorted data. The inner loop of Timsort.",
      },
      {
        algorithm: "Merge Sort",
        bursts: "O(n log n)",
        precision: "O(n log n)",
        memory: "O(n log n)",
        bestFor: "Stable sorting; external sorts that don't fit in RAM; linked lists.",
      },
      {
        algorithm: "Quick Sort",
        bursts: "O(n log n)",
        precision: "O(n log n)",
        memory: "O(n²)",
        bestFor: "In-place, cache-friendly sorting when you control the pivot.",
      },
      {
        algorithm: "Heap Sort",
        bursts: "O(n log n)",
        precision: "O(n log n)",
        memory: "O(n log n)",
        bestFor: "Hard worst-case guarantees; embedded systems with no recursion budget.",
      },
      {
        algorithm: "Counting Sort",
        bursts: "O(n + k)",
        precision: "O(n + k)",
        memory: "O(n + k)",
        bestFor: "Integer keys in a small known range — frequency tables, vote counts.",
      },
      {
        algorithm: "Radix Sort",
        bursts: "O(d · (n + k))",
        precision: "O(d · (n + k))",
        memory: "O(d · (n + k))",
        bestFor: "Fixed-width integer keys at scale — IP addresses, timestamps, hashes.",
      },
      {
        algorithm: "Bucket Sort",
        bursts: "O(n + k)",
        precision: "O(n + k)",
        memory: "O(n²)",
        bestFor: "Roughly uniform floats — `sort(random_array)` is its dream input.",
      },
      {
        algorithm: "Timsort",
        bursts: "O(n)",
        precision: "O(n log n)",
        memory: "O(n log n)",
        bestFor: "Real-world data with existing partial order. The default in Python/Java/JS.",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to pick" },
    {
      type: "ul",
      items: [
        "**You just need it sorted** → call your language's built-in `sort()`. It's Timsort or intro-sort; both are near-optimal for general data and have been hardened by millions of users. Don't reinvent.",
        "**Your data is integers in a known range** (votes 0-9, ages 0-120, byte values 0-255) → **counting sort**. It's linear and easier to write than you'd think.",
        "**Your data is fixed-width integers at huge scale** (IPv4 addresses, 64-bit hashes) → **radix sort**. Beats comparison sorts at billion-element scale.",
        "**You need a *stable* sort and have memory to spare** → **merge sort** (or Timsort, which is also stable). Stability matters when ordering by multiple keys: sort by name then by date, the dates within each name stay in original order.",
        "**You need worst-case O(n log n) guarantees** (real-time systems, hostile inputs) → **heap sort** or intro-sort (quicksort + heapsort fallback). Pure quicksort is fast on average but can be tricked.",
        "**Your list is small** (n < ~16) or **nearly sorted** → **insertion sort**. That's why it's inside Timsort and inside std::sort's small-array base case.",
        "**You're teaching** → start with **bubble** for the swap, **insertion** for the real-world card-sorting analogy, then **merge** to introduce divide-and-conquer.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Stable vs unstable sorts",
      text: "A *stable* sort keeps equal elements in their original order. Merge sort, insertion sort, bubble sort, counting sort, radix sort, and Timsort are stable. Selection sort, quick sort, and heap sort are not. Stability matters more than it sounds: it's what lets you sort by multiple columns by sorting once per column, in reverse priority order.",
    },
  ],
};
