import type { ConceptContent } from "@/lib/content/types";

export const heap: ConceptContent = {
  prototypeCaption:
    "A complete binary tree drawn alongside its **backing array** — same data, two views at once. Toggle between **Min-heap** and **Max-heap** to see the heap property flip and the entire structure re-heapify. Type any number and press **Insert** to watch the new leaf bubble up through parent swaps; press **Extract root** to pop the top and watch `siftDown` restore order. The **Speed** slider controls how fast each swap animates. Shortcuts: **Random** fills a fresh heap in one shot; **Reset** clears everything. The demo buttons — *Insert 1 → bubble all the way up* and *Extract root → watch sift-down* — run pre-scripted sequences so you can trace every index formula in real time. Stats panel tracks size, height, total swaps, and current root.",

  overview: [
    {
      type: "p",
      text: "**A binary heap is a complete binary tree that satisfies the heap property: in a min-heap every parent is ≤ both its children; in a max-heap every parent is ≥ both.** 'Complete' means every level is fully filled except possibly the last, which fills left to right. That shape constraint is what makes the array mapping work — there are no gaps, so the children of node `i` sit at exactly `2i + 1` and `2i + 2`, and the parent of node `i` is at `Math.floor((i - 1) / 2)`.",
    },
    {
      type: "p",
      text: "Because the shape is perfectly predictable, **a heap needs no pointers, no left/right references, no node objects — just a plain array**. The root lives at index 0. Its two children live at 1 and 2. Their children live at 3, 4, 5, 6. When you draw that array as a tree you get the visual above; when you look at the tree you can always read off the array index from the node's position. Every operation you do on the tree — insert, extract, bubble-up, sift-down — translates to arithmetic on array indices. This is what makes the heap so cache-friendly and compact in practice.",
    },
    {
      type: "p",
      text: "The heap is purpose-built for **one thing: fast access to the extreme element**. `peek` is O(1) — the min (or max) is always at index 0. `insert` is O(log n) — append to the end, then swap your way up. `extractRoot` is O(log n) — grab index 0, replace it with the last element, then swap your way down. What the heap *cannot* do efficiently is answer 'where is the element with key k?' — finding an arbitrary key requires scanning the whole array, O(n). It is not a search tree. Use it when you need the extreme end of a collection repeatedly and quickly, not when you need arbitrary lookups.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Bubble-up (insert)" },
    {
      type: "ol",
      items: [
        "Append the new value to the end of the array. Call its index `i`.",
        "Compare `arr[i]` with its parent at `arr[Math.floor((i - 1) / 2)]`.",
        "If the heap property is violated (e.g. `arr[i] < arr[parent]` in a min-heap), swap the two.",
        "Set `i = parent index` and repeat from step 2.",
        "Stop when the root is reached or no swap is needed — the property holds.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Index arithmetic: commit these to muscle memory",
      text: "Children of node `i`: left = `2i + 1`, right = `2i + 2`. Parent of node `i`: `Math.floor((i − 1) / 2)`. These three formulas *are* the tree structure — every heap operation runs on them and nothing else. There is no `node.left`, no `node.parent` pointer anywhere in the code.",
    },
    { type: "h", text: "Sift-down (extract root)" },
    {
      type: "ol",
      items: [
        "Save `arr[0]` — that's the value being returned.",
        "Move the last element (`arr[size - 1]`) to index 0, then shrink the array by one.",
        "Now `arr[0]` may violate the heap property. Compare it with its two children at `2i + 1` and `2i + 2`.",
        "In a min-heap, swap with the *smaller* child if that child is smaller than the current node. (Max-heap: swap with the *larger* child.)",
        "Repeat from step 3 with the new index until both children are ≥ the current node, or a leaf is reached.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "O(n) build-heap — Floyd's trick",
      text: "Inserting n elements one at a time costs O(n log n). But if you already have all the values, you can do better: load them into the array in any order, then call `siftDown` on every *internal* node from index `Math.floor(n / 2) − 1` down to 0. Each sift-down is cheap for nodes near the bottom (short path), and there are exponentially fewer nodes near the top. The sum works out to **O(n)** — a factor of log n faster than repeated insertion. This is Floyd's 1964 `buildHeap` and it is the foundation of heapsort.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Priority queues** — task schedulers, OS process scheduling, bandwidth management. You always want the highest-priority item next, and inserts/removes are frequent. A heap delivers both in O(log n).",
        "**Dijkstra's shortest-path algorithm** — the min-heap sits at the core, serving up the next closest unvisited vertex in O(log V) per extraction.",
        "**Top-k problems** — 'find the k largest numbers in a stream of millions.' Keep a min-heap of size k; if the new element beats the heap's minimum, swap it in. One pass, O(n log k), O(k) space.",
        "**Event-driven simulation** — events are keyed by timestamp; the heap always serves the next event to process. Used in network simulators, game engines, and financial backtests.",
        "**Heapsort** — build-heap in O(n), then extract-root n times: total O(n log n), in-place, no extra allocation. Not the fastest in practice (poor cache locality vs. quicksort) but optimal in theory.",
        "**Median-of-a-stream** — maintain a max-heap of the lower half and a min-heap of the upper half; the median is always the tops of those two heaps.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Arbitrary lookups by key** — a heap doesn't know where key k lives. Use a **hash map** (O(1) average) or **BST** (O(log n)) instead.",
        "**Sorted iteration over all elements** — extracting n times is O(n log n) and destroys the heap. Just sort the array once with your language's built-in sort.",
        "**Decrease-key in Dijkstra at scale** — the standard binary heap has no efficient decrease-key. A **Fibonacci heap** supports it in O(1) amortised, making Dijkstra O(E + V log V) instead of O((E + V) log V).",
        "**Ordered range queries** — 'find everything between k₁ and k₂.' A balanced BST or sorted array with binary search handles this; a heap cannot.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**O(1) peek** — the min (or max) is always at index 0. No traversal, no comparison.",
      "**O(log n) insert and extract** — bubble-up and sift-down each traverse at most one root-to-leaf path, which is at most ⌊log₂ n⌋ levels deep.",
      "**O(n) bulk construction** — Floyd's bottom-up `buildHeap` is provably linear, beating O(n log n) repeated insertion when all values are known upfront.",
      "**Cache-friendly array layout** — no pointer chasing. Parent and children of node `i` are at predictable offsets; prefetchers love it.",
      "**Dead simple implementation** — three index formulas and two loops. No rotations, no colour bits, no rebalancing cases. The entire data structure fits in 40 lines of code.",
    ],
    cons: [
      "**O(n) arbitrary search** — there is no ordering between siblings, so finding a node by value requires scanning the whole array. The heap property only constrains the vertical (parent–child) axis.",
      "**No decrease-key without augmentation** — updating the priority of an existing element requires knowing its index (needs a separate map) and then bubbling up or down. Standard library heaps rarely expose this.",
      "**Poor cache performance during sift-down at scale** — later levels of the tree (most of the nodes) map to high array indices that may span many cache lines, causing cache misses as the sift-down zigzags down.",
      "**Not stable** — equal-priority elements may be extracted in any order. If insertion order matters, you must embed a sequence number in the key.",
      "**Not a search structure** — if your workload is 'find, update, delete arbitrary keys,' a heap forces you to either scan (O(n)) or maintain a parallel index map. A balanced BST is the cleaner fit.",
    ],
  },

  handsOn: [
    {
      title: "01 · Insert 1 → bubble all the way up",
      body: "Click the **\"Insert 1 → bubble all the way up\"** demo button. In a max-heap, 1 is the smallest possible value and will stay put near the leaves — but switch to **Min-heap** first, then run it. Now 1 is the *minimum*, so it will bubble up through every level: leaf → internal node → root in ⌊log₂ n⌋ swaps. Watch both the tree view (the highlighted node climbing) and the **array panel** (the index arithmetic shifting values left). The swaps counter in the stats panel will tick once per level. Notice the parent-index formula `Math.floor((i − 1) / 2)` running at each step.",
    },
    {
      title: "02 · Extract root → watch sift-down",
      body: "Press **\"Extract root → watch sift-down\"**. The root vanishes, the last array element teleports to index 0, and now the heap property is violated at the top. `siftDown` kicks in: the new root is compared with both children; it swaps with the *smaller* child (min-heap) and descends. At each level the prototype highlights the two children being compared and the winning swap. Count the swaps against the tree height shown in the stats — sift-down takes at most `height` swaps, and `height = ⌊log₂ n⌋`. A heap of 1 million elements needs at most 20 swaps to restore order.",
    },
    {
      title: "03 · Toggle Min-heap vs Max-heap — watch the re-heapify",
      body: "Fill the heap with **Random** so you have 10–15 nodes. Now toggle from **Max-heap** to **Min-heap**. The structure isn't sorted in the new sense, so the prototype re-runs `buildHeap` (Floyd's O(n) bottom-up pass) on the existing array. Watch every internal node sift down in reverse order — rightmost internal node first, root last. The tree re-draws itself with every swap. Toggle back and forth a few times; the root always settles to the global min (min-heap) or global max (max-heap) by the end of the pass. This is how you'd switch policies in a priority queue without rebuilding from scratch.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Reset and manually insert values in sorted ascending order: 1, 2, 3, 4, 5, 6, 7 into a **Min-heap**. Each insert does *zero swaps* — the values already satisfy the heap property, so bubble-up terminates immediately every time. Now try the same sequence into a **Max-heap**: each insert will bubble all the way to the root because every new value is *larger* than the current root. Compare the swap counters between the two runs. This shows that heap insert's O(log n) is a *worst case* — the actual cost depends on the input order. Finish by smashing **Extract root** repeatedly and verify the values come out in sorted order, proving the heap-sort property.",
    },
  ],

  code: {
    language: "typescript",
    filename: "BinaryHeap.ts",
    code: `// Array-backed binary min-heap.
// Swap min → max comparator for a max-heap.
class BinaryHeap {
  private data: number[] = [];

  // Index helpers — the only "pointers" this structure needs.
  private parent(i: number): number { return Math.floor((i - 1) / 2); }
  private left(i: number):   number { return 2 * i + 1; }
  private right(i: number):  number { return 2 * i + 2; }

  private swap(a: number, b: number): void {
    [this.data[a], this.data[b]] = [this.data[b], this.data[a]];
  }

  // Min-heap property: parent ≤ children.
  private less(a: number, b: number): boolean {
    return this.data[a] < this.data[b];
  }

  // O(log n) — append then bubble up.
  push(value: number): void {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const p = this.parent(i);
      if (this.less(i, p)) { this.swap(i, p); i = p; }
      else break;
    }
  }

  // O(1) — root is always index 0.
  peek(): number | undefined { return this.data[0]; }

  // O(log n) — remove root, promote last, sift down.
  pop(): number | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = this.left(i), r = this.right(i);
      if (l < n && this.less(l, smallest)) smallest = l;
      if (r < n && this.less(r, smallest)) smallest = r;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  // O(n) — Floyd's bottom-up build; faster than n × push().
  static buildHeap(values: number[]): BinaryHeap {
    const h = new BinaryHeap();
    h.data = [...values];
    for (let i = Math.floor(h.data.length / 2) - 1; i >= 0; i--) {
      h.siftDown(i);           // sift every internal node, leaves skip
    }
    return h;
  }

  get size(): number { return this.data.length; }
}`,
  },

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, Ch. 6 (Heapsort) and Ch. 6.5 (Priority Queues)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The definitive textbook treatment: heap property proofs, the O(n) build-heap analysis via summing a geometric series, and heapsort correctness. Chapter 6 is self-contained and 30 pages.",
      kind: "book",
    },
    {
      label: "J. W. J. Williams — *Algorithm 232: Heapsort* (CACM, 1964)",
      href: "https://en.wikipedia.org/wiki/Heapsort#History",
      note: "The original one-page paper that introduced both the heap data structure and heapsort. The Wikipedia Heapsort article summarises the historical context and distinguishes Williams' siftUp-based build from Floyd's faster siftDown-based build.",
      kind: "paper",
    },
    {
      label: "R. W. Floyd — *Algorithm 245: Treesort 3* (CACM, 1964)",
      href: "https://en.wikipedia.org/wiki/Binary_heap#Building_a_heap",
      note: "Floyd's follow-up that introduced the O(n) bottom-up `buildHeap` by sifting down from internal nodes. The Wikipedia Binary heap article covers the technique and walks through the geometric-series proof of linearity.",
      kind: "paper",
    },
    {
      label: "Wikipedia — Binary heap",
      href: "https://en.wikipedia.org/wiki/Binary_heap",
      note: "Thorough reference article: array representation, index formulas, all operations with complexity proofs, d-ary heaps, and comparison with leftist/skew/Fibonacci heaps.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Binary Heap (Priority Queue)",
      href: "https://visualgo.net/en/heap",
      note: "Step-by-step animated insert, extract-max, and heapsort on a live heap. Pairs perfectly with the prototype here — run the same sequence on both to cross-check your intuition.",
      kind: "article",
    },
    {
      label: "Python `heapq` — official documentation",
      href: "https://docs.python.org/3/library/heapq.html",
      note: "The standard library min-heap in Python. Includes `heapify` (Floyd's O(n) build), `heappush`, `heappop`, and practical recipes for max-heaps, k-largest, and merge-sorted-iterables.",
      kind: "docs",
    },
    {
      label: "OpenDSA — Heaps and Priority Queues",
      href: "https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/Heaps.html",
      note: "Free interactive textbook chapter with code, exercises, and a worked proof of Floyd's O(n) build. Good complement to CLRS if you want a gentler prose walkthrough.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "heap-q1",
      question:
        "In an array-backed binary heap, where are the left child, right child, and parent of node at index i?",
      options: [
        { id: "a", label: "Left: 2i, Right: 2i + 1, Parent: i / 2" },
        { id: "b", label: "Left: 2i + 1, Right: 2i + 2, Parent: Math.floor((i − 1) / 2)" },
        { id: "c", label: "Left: i + 1, Right: i + 2, Parent: i − 1" },
        { id: "d", label: "Left: 2i + 2, Right: 2i + 3, Parent: Math.floor(i / 2)" },
      ],
      correctOptionId: "b",
      explanation:
        "With 0-based indexing the formulas are: left child = 2i + 1, right child = 2i + 2, parent = Math.floor((i − 1) / 2). Option A is the 1-based version (used in some textbooks); option C is wrong for any tree; option D offsets everything by one. Memorise the 0-based forms — they're what every modern implementation uses.",
    },
    {
      id: "heap-q2",
      question:
        "Why is Floyd's bottom-up buildHeap O(n), even though it calls siftDown — an O(log n) operation — for every internal node?",
      options: [
        { id: "a", label: "Because siftDown is actually O(1) when called on leaf nodes." },
        { id: "b", label: "Because most nodes are near the bottom of the tree and have very short sift-down paths; summing the work across all levels yields a geometric series that converges to O(n)." },
        { id: "c", label: "Because buildHeap skips half the nodes by only processing even indices." },
        { id: "d", label: "Because the heap property is already partially satisfied in a random array." },
      ],
      correctOptionId: "b",
      explanation:
        "The key insight is that most nodes live near the leaves, where sift-down paths are short. At height h there are at most ⌈n / 2^(h+1)⌉ nodes, each needing at most h swaps. Summing h × n / 2^(h+1) for h = 0 to log n gives n × Σ(h / 2^h) = 2n, which is O(n). The apparent O(n log n) bound is pessimistic because it assumes every node sifts down the full height.",
    },
    {
      id: "heap-q3",
      question:
        "You need to find whether a specific value k exists in a binary min-heap of n elements. What is the time complexity of the most straightforward correct approach?",
      options: [
        { id: "a", label: "O(1) — k is at the root if it's the minimum." },
        { id: "b", label: "O(log n) — binary search the array." },
        { id: "c", label: "O(n) — you must scan the entire backing array." },
        { id: "d", label: "O(log² n) — traverse the tree level by level, pruning branches smaller than k." },
      ],
      correctOptionId: "c",
      explanation:
        "The heap property only constrains the vertical (parent–child) axis: every parent is ≤ its children. Siblings have no defined order relative to each other. That means you cannot binary search the array (it's not sorted) and you cannot prune large subtrees (a subtree rooted at a node larger than k could still contain k deeper down — no, wait, it could not in a min-heap, but it also can't help narrow siblings). In the general case you must examine every element: O(n). This is the fundamental limitation of a heap vs. a BST.",
    },
  ],
};
