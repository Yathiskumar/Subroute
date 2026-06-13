import type { TopicContent } from "@/lib/content/types";

export const treesTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**A tree is a graph with no cycles and exactly one path between any two nodes** — that constraint buys you something powerful: a natural hierarchy. Every tree has a root, children branch from it, and the structure repeats recursively until you hit leaves. That branching shape is why trees show up everywhere: every time you need to search a sorted set, index a database, autocomplete a word, or answer 'what's the sum of this range?', a tree is almost certainly doing the work.",
    },
    {
      type: "p",
      text: "The nine trees here span three distinct contracts. The **BST** is the foundation — put smaller keys left, larger right, and you get O(log n) search *on average*. AVL and red-black trees fix the worst-case problem by keeping the tree balanced, guaranteeing O(log n) at all times; the red-black tree is the one you'll find in every production standard library. The **heap** abandons the search property entirely and optimises for one thing: finding the minimum or maximum in O(1). The **trie** does something completely different — it keys on characters, not comparisons, making prefix queries blazing fast. Finally, **B-trees and B+ trees** go wide instead of deep to match the block size of a disk, and **segment and Fenwick trees** are specialised range-query machines used everywhere from competitive programming to databases.",
    },
    {
      type: "p",
      text: "You do not need to implement all nine from scratch. You need to know *what each one promises* and *what it costs to keep that promise*. O(log n) is the whole game — and it only holds when the tree stays balanced. Once that's clear, everything else is a matter of which invariant you're willing to enforce.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Where this shows up" },
    {
      type: "ul",
      items: [
        "**Database and filesystem indexes** — every B+ tree index in PostgreSQL, MySQL (InnoDB), and SQLite lets the engine jump to a row in O(log n) disk reads instead of scanning the whole table; ext4 and NTFS directory structures are B-trees too.",
        "**Language standard libraries** — `std::map` and `std::set` in C++, `TreeMap` and `TreeSet` in Java, and Python's `sortedcontainers` are all backed by red-black trees; you get O(log n) insert, delete, and lookup with in-order iteration for free.",
        "**Operating system schedulers** — the Linux kernel's Completely Fair Scheduler (CFS) stores runnable tasks in a red-black tree keyed by virtual runtime; the scheduler always picks the leftmost node in O(log n).",
        "**Priority queues, Dijkstra, and task schedulers** — binary heaps power Python's `heapq`, Java's `PriorityQueue`, and every implementation of Dijkstra's algorithm; OS job queues and event loops use the same structure.",
        "**Autocomplete, spell-check, and IP routing** — tries back the autocomplete in your IDE and search bar; spell-checkers do prefix and edit-distance search over a trie; internet routers do longest-prefix matching on a trie of CIDR blocks.",
        "**Competitive programming and analytics range queries** — segment trees answer 'sum / min / max over range [l, r]' with point updates in O(log n); Fenwick trees (BITs) do the same for prefix sums with half the code and half the memory.",
        "**Compilers and expression evaluation** — parse trees and abstract syntax trees are the canonical internal representation of every compiler and interpreter; expression evaluation, constant folding, and code generation all walk a tree.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Balanced vs unbalanced: why O(log n) is the whole game",
      text: "A perfect binary tree of n nodes has height ⌊log₂ n⌋ — that's why balanced trees give O(log n) operations. But insert keys in sorted order into a plain BST and the tree degrades into a linked list: height becomes n, and every search is O(n). **Balance is not optional** — it's the difference between a data structure and a slow list. AVL trees enforce a strict height difference of at most 1 between subtrees. Red-black trees enforce a looser colour invariant that guarantees height ≤ 2 log₂(n + 1). The trade-off: AVL trees rebalance more eagerly (better for read-heavy workloads); red-black trees rebalance lazily (better for write-heavy workloads, which is why they dominate in practice).",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Tree",
      bursts: "Self-balancing?",
      precision: "Search / Insert",
      memory: "Ordered traversal?",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "Binary Search Tree",
        bursts: "No",
        precision: "O(log n) avg / O(n) worst",
        memory: "Yes (in-order)",
        bestFor: "Teaching the search property; small data sets where balance is unlikely to degrade.",
      },
      {
        algorithm: "AVL Tree",
        bursts: "Yes — strict height balance",
        precision: "O(log n) guaranteed",
        memory: "Yes (in-order)",
        bestFor: "Read-heavy workloads where lookup speed matters more than insert overhead.",
      },
      {
        algorithm: "Red-Black Tree",
        bursts: "Yes — colour invariant",
        precision: "O(log n) guaranteed",
        memory: "Yes (in-order)",
        bestFor: "General-purpose ordered maps and sets; the default in most standard libraries.",
      },
      {
        algorithm: "Binary Heap",
        bursts: "N/A (not a search tree)",
        precision: "Search O(n) / Insert O(log n)",
        memory: "No",
        bestFor: "Priority queues, Dijkstra's algorithm, and any 'give me the smallest/largest fast' workload.",
      },
      {
        algorithm: "Trie (Prefix Tree)",
        bursts: "N/A",
        precision: "O(L) by key length",
        memory: "Yes (lexicographic)",
        bestFor: "Autocomplete, spell-check, IP routing, and any query keyed on string prefixes.",
      },
      {
        algorithm: "B-Tree",
        bursts: "Yes — wide, multi-key nodes",
        precision: "O(log n) disk reads",
        memory: "Yes (in-order)",
        bestFor: "Filesystem metadata, database indexes where every level is a disk read.",
      },
      {
        algorithm: "B+ Tree",
        bursts: "Yes — data only in leaves",
        precision: "O(log n) disk reads",
        memory: "Yes — leaves linked for range scans",
        bestFor: "Database range queries; the dominant structure behind SQL table indexes.",
      },
      {
        algorithm: "Segment Tree",
        bursts: "N/A (static structure)",
        precision: "O(log n) query + update",
        memory: "No",
        bestFor: "Range sum / min / max / GCD with point or range updates; competitive programming and analytics.",
      },
      {
        algorithm: "Fenwick Tree (BIT)",
        bursts: "N/A (static structure)",
        precision: "O(log n) prefix query + update",
        memory: "No",
        bestFor: "Prefix sums with point updates; simpler and faster constant than segment trees for sums only.",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to pick" },
    {
      type: "ul",
      items: [
        "**Need an ordered map or set with O(log n) insert, delete, lookup, and in-order iteration** → **red-black tree**. It's already in your standard library (`std::map`, `TreeMap`, `SortedDict`). Reach for it first.",
        "**Read-heavy workload where the tightest possible height matters** → **AVL tree**. AVL enforces strict height balance, so lookups hit fewer levels — at the cost of more rotations on insert. Worth it only when reads dominate heavily.",
        "**Need the minimum or maximum element in O(1), and you'll be inserting and removing frequently** → **binary heap**. It's an array, it's cache-friendly, and it powers every priority queue and heap-based shortest-path algorithm.",
        "**Keys are strings and queries are prefix-based** → **trie**. Autocomplete, spell-check, IP longest-prefix matching, and phone-book style lookups all fit naturally. Each lookup is O(L) on key length, independent of how many keys are stored.",
        "**Data lives on disk or in a block-addressable store** → **B+ tree**. Its wide fan-out means the tree is only 3–4 levels deep even for billions of rows; every level is a disk read, so minimising height is everything. If you need range scans, B+ trees beat B-trees because the leaves form a linked list.",
        "**You need range aggregate queries (sum, min, max, GCD) with updates** → **segment tree**. It supports both point updates and range updates with lazy propagation in O(log n), and it can hold any associative aggregate.",
        "**You only need prefix sums with point updates and every nanosecond counts** → **Fenwick tree (BIT)**. It's half the code and half the memory of a segment tree, with better cache behaviour. If you find yourself needing range min/max or range updates, switch to a segment tree.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "The shape of the problem tells you the tree",
      text: "Ask three questions: **Is the key a string or a prefix?** → trie. **Is the data on disk?** → B+ tree. **Do you need range aggregates?** → segment or Fenwick tree. If none of those apply and you need an ordered collection, red-black tree. If you only need the extreme element fast, heap. The BST is for learning; the others are for shipping.",
    },
  ],
};
