import type { ConceptContent } from "@/lib/content/types";

export const unionFind: ConceptContent = {
  prototypeCaption:
    "Eight nodes, each its own set at the start. Use **Union** to merge two sets via union-by-rank; **Find** highlights the path from a node up to its root and then *flattens* it with path compression. **Play** runs a scripted sequence of merges so you can watch the forest collapse.",

  overview: [
    {
      type: "p",
      text: "**Union-Find — also called Disjoint Set Union, or DSU — is the data structure that answers two questions: 'are these two things in the same group?' and 'merge these two groups.'** Both in essentially **constant time**.",
    },
    {
      type: "p",
      text: "The structure is a forest. Each element is a node pointing to a parent; following parents up to the root identifies an element's *set*. Two operations: `find(x)` walks up to the root; `union(x, y)` finds both roots and points one at the other. Naïve, these are O(n). With two cheap optimisations — **union by rank** (smaller tree hangs under bigger one) and **path compression** (every node visited during `find` is rewired directly to the root) — the amortised cost per operation drops to **α(n)**, the inverse Ackermann function, which is ≤ 4 for any input you can fit in physical memory.",
    },
    {
      type: "p",
      text: "DSU isn't a graph algorithm on its own. It's a **primitive** that other graph algorithms lean on. Kruskal's MST uses it to test 'does adding this edge form a cycle?' in α(n) per edge. Connected-components labelling, dynamic connectivity under edge insertions, percolation simulations, and image segmentation all sit on top of DSU.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The structure" },
    {
      type: "ol",
      items: [
        "Two arrays: `parent[i]` (initially `i` — every node is its own root) and `rank[i]` (initially 0 — every tree is one node tall).",
        "**`find(x)`**: follow `parent[x]` up until `parent[x] == x`. That's the root. The root identifies the set.",
        "**`union(x, y)`**: find both roots. If they're the same, x and y are already in the same set. Otherwise, attach the smaller-rank root under the bigger-rank root.",
        "**Are x and y in the same set?** Check `find(x) == find(y)`.",
      ],
    },
    { type: "h", text: "The two optimisations" },
    {
      type: "ul",
      items: [
        "**Union by rank** — when merging two trees, the shorter tree hangs under the taller one. This keeps trees from getting too tall: max rank after n unions is O(log n).",
        "**Path compression** — during `find(x)`, after walking up to the root, rewire *every* node on the path to point directly at the root. Next `find()` on any of those nodes is one step instead of log n.",
        "Together: the amortised cost per operation is O(α(n)) — the inverse Ackermann function — which is ≤ 4 for every input you'll ever process. Effectively constant.",
        "**Union by size** is an alternative to union by rank — attach the smaller tree (by count of nodes) under the bigger. Same asymptotic guarantee.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why α(n) ≈ constant",
      text: "The inverse Ackermann function α(n) grows so slowly that α(2^65536) ≤ 4. There is no practical input on which it exceeds 4. So although DSU isn't *strictly* O(1) per operation, it's the closest a non-trivial data structure gets — and the proof (by Tarjan, 1975) is one of the most celebrated results in data-structure analysis.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "DSU doesn't support split",
      text: "There's no efficient way to *break* a set back apart. DSU is for problems where you only ever *merge* — Kruskal, connected components under edge additions, percolation. If you need to support edge *deletion*, you need link-cut trees (O(log n) per operation) or the more elaborate Euler-tour tree.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Kruskal's MST** — the cycle-detection step. Adding an edge forms a cycle iff its endpoints are already in the same component. `find(u) == find(v)` decides it in α(n).",
        "**Dynamic connected components** — answer 'are u and v in the same component?' as edges are added over time.",
        "**Percolation simulations** — random-edge addition until the top and bottom of a grid are in the same component (classic physics simulation, popularised by Princeton's *Algorithms* MOOC).",
        "**Image segmentation (e.g. Felzenszwalb-Huttenlocher)** — merge adjacent pixels whose colour difference is small; DSU tracks the resulting regions.",
        "**Offline LCA queries** — Tarjan's offline LCA algorithm uses DSU to answer LCA queries during a DFS in α(n) per query.",
        "**Equivalence classes** — anywhere you have an equivalence relation and need to discover the classes (e.g. type unification in a compiler's Hindley-Milner inference).",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You need to delete edges** — DSU has no efficient split. Use a **link-cut tree** for O(log n) per op or Euler-tour trees.",
        "**You need shortest paths within a component** — DSU only tracks membership. Use BFS / Dijkstra alongside.",
        "**Static graph, one connected-components query** — a single DFS / BFS sweep is simpler and O(V + E).",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Near-constant per operation** — α(n) ≤ 4 in practice. Essentially the fastest possible structure for incremental connectivity.",
      "**Trivially small** — two arrays, ~20 lines of code with both optimisations.",
      "**Cache-friendly** — the arrays are contiguous and `find` is a tight pointer chase that the prefetcher handles well.",
      "**Composable** — Kruskal's MST, percolation, and segmentation all sit on top with no modification.",
      "**Easy to extend** — track per-set sizes, sums, or auxiliary statistics by maintaining them at root nodes.",
    ],
    cons: [
      "**No split** — DSU is merge-only. Edge deletion needs link-cut trees.",
      "**No per-set enumeration** — knowing the root of a set doesn't give you its members without an extra pass.",
      "**Path compression mutates on read** — `find()` is not a pure query; in a concurrent setting you need synchronization.",
      "**Amortised, not worst-case** — a single operation can be slow; the bound holds across many.",
    ],
  },

  handsOn: [
    {
      title: "01 · Union-by-rank, step by step",
      body: "Click **Union** on the default sequence. Watch the rank labels: small-rank trees hang under big-rank trees. The tree depth grows logarithmically — even after merging all 8 nodes, the longest path to the root is only ~3.",
    },
    {
      title: "02 · Watch path compression flatten the tree",
      body: "After a few unions, click **Find** on a leaf. The path from that leaf to the root gets highlighted, then *every node on the path* gets rewired directly to the root. Future `find()` calls on any of them are one step.",
    },
    {
      title: "03 · Try the all-merge scenario",
      body: "Press **Play** to run a scripted 7-union sequence that ends with all 8 nodes in one set. Notice the *components* counter dropping from 8 → 1, and the *Operations* counter ticking up. Total work for 7 unions: ~10 array writes.",
    },
    {
      title: "04 · Verify two nodes are connected",
      body: "After the merges, click **Find** on two nodes that should be in the same set. The roots match: connected. Now use the **Reset** button and try `find()` *before* any unions — every node is its own root, and the answer is *not* connected. That's the cycle-check Kruskal relies on.",
    },
  ],

  code: {
    language: "typescript",
    filename: "union-find.ts",
    code: `// Union-Find with union-by-rank + path compression.
// Both operations amortise to O(α(n)) — effectively constant.
class DSU {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      // Path compression: point x straight at the root.
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;          // already in the same set
    // Union by rank: hang the shorter tree under the taller one.
    if (this.rank[rx] < this.rank[ry])      this.parent[rx] = ry;
    else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
    else { this.parent[ry] = rx; this.rank[rx]++; }
    return true;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}`,
  },

  furtherReading: [
    {
      label: "Robert Tarjan — *Efficiency of a good but not linear set union algorithm* (1975)",
      href: "https://dl.acm.org/doi/10.1145/321879.321884",
      note: "The proof that union-by-rank + path compression gives the inverse Ackermann bound. One of the foundational papers in data-structure analysis.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, §21 (Data structures for disjoint sets)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Textbook treatment with all the proofs, plus the linked-list and tree-based representations.",
      kind: "book",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms*, §1.5 (Case study: Union-Find)",
      href: "https://algs4.cs.princeton.edu/15uf/",
      note: "Princeton's online course covers the percolation application end-to-end. Excellent for building intuition.",
      kind: "article",
    },
    {
      label: "Felzenszwalb & Huttenlocher — *Efficient graph-based image segmentation* (2004)",
      href: "https://cs.brown.edu/people/pfelzens/papers/seg-ijcv.pdf",
      note: "A widely-used image segmentation algorithm built on DSU. Shows how DSU drops cleanly into a domain very different from graph theory.",
      kind: "paper",
    },
    {
      label: "Competitive Programming Handbook — DSU section",
      href: "https://cses.fi/book/book.pdf",
      note: "Antti Laaksonen's free book. Compact DSU section with extensions for size tracking and weighted DSU.",
      kind: "book",
    },
    {
      label: "Wikipedia — Disjoint-set data structure",
      href: "https://en.wikipedia.org/wiki/Disjoint-set_data_structure",
      note: "Solid reference covering all the variants — by-size vs by-rank, halving, splitting — and the link-cut tree extension for supporting deletion.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "uf-q1",
      question:
        "Without union-by-rank or path compression, what is the worst-case time of `find(x)` after n unions?",
      options: [
        { id: "a", label: "O(1)" },
        { id: "b", label: "O(log n)" },
        { id: "c", label: "O(n)" },
        { id: "d", label: "O(α(n))" },
      ],
      correctOptionId: "c",
      explanation:
        "Naïve `union` (always attach `find(x)` under `find(y)`) can build a tree that's literally a long chain — node n-1 → n-2 → ... → 0. `find(n-1)` then has to walk every step, O(n). Union-by-rank prevents this by keeping the tree depth O(log n). Path compression collapses the chain to depth 1 on first traversal. Both together give O(α(n)).",
    },
    {
      id: "uf-q2",
      question:
        "What does *path compression* during `find(x)` do?",
      options: [
        { id: "a", label: "It deletes nodes from the tree." },
        { id: "b", label: "It re-roots the tree to make x the new root." },
        { id: "c", label: "It rewires every node visited on the path from x to the root so they all point directly at the root." },
        { id: "d", label: "It shortens the path by half." },
      ],
      correctOptionId: "c",
      explanation:
        "After find() walks from x up to the root r, it sets parent[x] = r — and recursively for every node visited on the way. Next time find() runs on any of those nodes, it's one step to the root. This is what amortises the cost down to α(n) per operation.",
    },
    {
      id: "uf-q3",
      question:
        "Why is DSU the right data structure for Kruskal's MST cycle check?",
      options: [
        { id: "a", label: "Because Kruskal's needs sorted edges, and DSU sorts them." },
        { id: "b", label: "Because adding edge (u, v) forms a cycle iff u and v are already in the same component — and DSU answers that in α(n) per query." },
        { id: "c", label: "Because DSU computes minimum-spanning-tree weight directly." },
        { id: "d", label: "Because DSU stores edge weights." },
      ],
      correctOptionId: "b",
      explanation:
        "Kruskal walks edges in sorted order. For each, it asks: 'does this edge close a cycle?' Equivalently: 'are u and v already in the same component?' DSU answers that in α(n) via find(u) == find(v). If yes, skip; if no, union them and add the edge to the MST. The cycle check is what makes Kruskal feasible — without DSU, the check would cost O(V) per edge and the whole algorithm would degrade to O(V · E).",
    },
  ],
};
