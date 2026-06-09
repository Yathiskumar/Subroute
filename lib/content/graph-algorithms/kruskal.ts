import type { ConceptContent } from "@/lib/content/types";

export const kruskal: ConceptContent = {
  prototypeCaption:
    "Eight nodes, ten weighted edges, and a sorted-edge list. Press **Play** to watch Kruskal walk edges from cheapest to most expensive, using Union-Find to skip any edge that would close a cycle. **Step** / **Back** advance one edge at a time. The right panel shows the DSU forest collapsing as edges are accepted.",

  overview: [
    {
      type: "p",
      text: "**Kruskal's algorithm builds a Minimum Spanning Tree by always grabbing the cheapest available edge — unless it would create a cycle.** It's a straight greedy walk over the edges, sorted by weight. The whole algorithm is six lines once you have a Union-Find.",
    },
    {
      type: "p",
      text: "The setup: sort all edges by weight. Start with every node in its own component (one-per-node, courtesy of DSU). Walk the sorted edges. For each edge `(u, v, w)`, ask DSU: 'are u and v already in the same component?' If yes, skip — adding this edge would close a cycle. If no, add it to the MST and `union(u, v)`. Stop when you've added V-1 edges (which is the size of any spanning tree on V nodes).",
    },
    {
      type: "p",
      text: "The correctness comes from the **cut property**: for any cut of the graph, the cheapest crossing edge belongs to *some* MST. Kruskal is one continuous application of this property — every edge it adds is the cheapest edge across the cut between two not-yet-connected components. It just doesn't know which cut at any given moment, and doesn't have to: the sorted order plus the cycle check guarantee correctness regardless.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The algorithm in six lines" },
    {
      type: "ol",
      items: [
        "Sort the edges by weight, ascending. This costs O(E log E) = O(E log V).",
        "Create a DSU with V nodes, each its own set.",
        "Initialise an empty MST edge list.",
        "Walk the sorted edges. For each `(u, v, w)`: if `find(u) ≠ find(v)`, add the edge to the MST and `union(u, v)`. Otherwise skip.",
        "Stop when the MST has V-1 edges (every node is in one component).",
        "If you ran out of edges before reaching V-1, the graph was disconnected and you have a Minimum Spanning *Forest*.",
      ],
    },
    { type: "h", text: "Why the greedy choice is safe" },
    {
      type: "ul",
      items: [
        "**The cut property**: for any cut (partition of nodes into two sets) of the graph, the cheapest edge crossing the cut belongs to *some* MST.",
        "When Kruskal considers edge `(u, v)` in sorted order, u and v are in two different components — call that cut. No cheaper edge crosses this cut, because all cheaper edges either stayed within one of the two components (no help) or were skipped earlier (impossible: they'd have merged the components).",
        "So adding `(u, v)` is safe — it's the cheapest crossing edge of some cut.",
        "If u and v are already in the same component, adding this edge would form a cycle without crossing any new cut — DSU's `find(u) == find(v)` check catches this in α(n).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Edges already sorted? Even faster",
      text: "If the input arrives pre-sorted — for instance, edges streamed in priority order — you can skip the O(E log E) sort and the runtime drops to O(E · α(V)) ≈ O(E). This makes Kruskal the natural choice for online MST problems where edges arrive over time.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Same-weight ties are arbitrary",
      text: "If multiple edges share the cheapest weight, Kruskal will pick *one* arbitrary MST out of several possible ones. If you need a *unique* MST, tiebreak deterministically (e.g. by edge endpoint IDs) — otherwise two runs on the same graph can produce different (but equally-valid) outputs.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Sparse graphs** — Kruskal is O(E log E), so when E ≈ V it's basically O(V log V). Beats Prim's heap-based O((V + E) log V).",
        "**Edges already sorted** — streaming input or geometric setups where edges naturally arrive in distance order. Skip the sort and Kruskal is essentially O(E · α(V)).",
        "**Network design** — laying down the cheapest set of links to connect a set of offices, cities, or sensors.",
        "**Clustering (single-link)** — agglomerative single-link clustering is Kruskal stopped after K-1 fewer edges. Each connected component is a cluster.",
        "**Image segmentation** — Felzenszwalb-Huttenlocher uses Kruskal-style merging with an adaptive threshold per region.",
        "**Pure pedagogy** — Kruskal is the cleanest demonstration of greedy-with-cycle-check, useful for teaching the cut property and DSU together.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Dense graphs** (E ≈ V²) — use **Prim's** with an array-based key, which runs in O(V²) without log factors. Or use Prim's with a binary heap for somewhere in between.",
        "**You only need an MST starting at one specific seed node** — Prim's grows from a seed naturally; Kruskal doesn't care where you start.",
        "**You need to support edge deletions** — neither Kruskal nor Prim do this efficiently. Use a dynamic MST data structure like Holm-Lichtenberg-Thorup if you need it.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Simple** — sort + DSU + loop. ~15 lines once you have a DSU library.",
      "**Excellent for sparse graphs** — O(E log E) dominated by the sort.",
      "**Edge-driven** — natural fit when edges arrive in a stream or are already sorted.",
      "**Easy to extend** — single-link clustering, MST forest on disconnected graphs, Steiner-tree heuristics all use Kruskal as their kernel.",
      "**No starting vertex needed** — Kruskal treats the whole graph at once; useful when there's no natural seed.",
    ],
    cons: [
      "**Needs all edges up front** — can't be incremental on graph topology changes.",
      "**Sort cost dominates** — on dense graphs E ≈ V² makes the sort the bottleneck.",
      "**Random access to edges** — Prim's only needs the cut-frontier, which can be smaller. Kruskal scans every edge.",
      "**Ties produce non-unique results** — you may need a deterministic tiebreaker for reproducibility.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through one MST build",
      body: "Press **Play**. Watch the algorithm walk the sorted-edge list left to right. Green edges are accepted into the MST; red edges are rejected because both endpoints are already in the same component. After V-1 acceptances, the MST is complete.",
    },
    {
      title: "02 · Step through edge by edge",
      body: "Hit **Step** to consider the next-cheapest edge. The narration tells you whether it was accepted (added to MST and `union(u, v)`) or rejected (`find(u) == find(v)`, would form a cycle). Watch the DSU forest on the right consolidate as components merge.",
    },
    {
      title: "03 · Try shuffling weights",
      body: "Press **Shuffle weights** to randomise the edge weights. The sorted-edge order changes completely, but the final MST often costs the same — because real graphs often have multiple MSTs of equal total weight. Notice that the *which* edges are accepted can differ.",
    },
    {
      title: "04 · Find an edge that's *just barely* rejected",
      body: "Look for the cheapest edge in the *rejected* (red) list. That edge would close exactly one cycle in the MST. If you removed any other MST edge from that cycle, this rejected edge would become the new replacement — and the cost would go up by exactly that difference. That's the basis of MST sensitivity analysis.",
    },
  ],

  code: {
    language: "typescript",
    filename: "kruskal.ts",
    code: `// Kruskal's MST — greedy edge addition with DSU cycle check.
type Edge = { u: number; v: number; w: number };

function kruskal(n: number, edges: Edge[]): Edge[] {
  // 1. Sort edges by weight ascending.
  const sorted = edges.slice().sort((a, b) => a.w - b.w);

  // 2. Initialise DSU.
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(x: number, y: number): boolean {
    const rx = find(x), ry = find(y);
    if (rx === ry) return false;
    if (rank[rx] < rank[ry]) parent[rx] = ry;
    else if (rank[rx] > rank[ry]) parent[ry] = rx;
    else { parent[ry] = rx; rank[rx]++; }
    return true;
  }

  // 3. Walk sorted edges; accept if it doesn't form a cycle.
  const mst: Edge[] = [];
  for (const e of sorted) {
    if (union(e.u, e.v)) {
      mst.push(e);
      if (mst.length === n - 1) break;     // tree complete
    }
  }
  return mst;
}`,
  },

  furtherReading: [
    {
      label: "Joseph Kruskal — *On the shortest spanning subtree of a graph* (1956)",
      href: "https://www.ams.org/journals/proc/1956-007-01/S0002-9939-1956-0078686-7/",
      note: "The original 5-page paper introducing the algorithm. Predates Prim's 1957 paper by a year.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, §23.2 (Kruskal's)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Textbook treatment with the cut-property proof and the DSU-driven implementation.",
      kind: "book",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms*, §4.3 (MSTs)",
      href: "https://algs4.cs.princeton.edu/43mst/",
      note: "Excellent side-by-side coverage of Kruskal and Prim with runnable Java and visualisations.",
      kind: "article",
    },
    {
      label: "Felzenszwalb & Huttenlocher — *Efficient graph-based image segmentation* (2004)",
      href: "https://cs.brown.edu/people/pfelzens/papers/seg-ijcv.pdf",
      note: "Kruskal applied to computer vision: edges are colour differences between adjacent pixels; merging continues while edge weights stay within an adaptive threshold.",
      kind: "paper",
    },
    {
      label: "Tarjan — *Data Structures and Network Algorithms* (1983)",
      href: "https://epubs.siam.org/doi/book/10.1137/1.9781611970265",
      note: "Tarjan's book treats Kruskal, Prim, and Borůvka's MST algorithms uniformly under the cut-property and cycle-property framework.",
      kind: "book",
    },
    {
      label: "Wikipedia — Kruskal's algorithm",
      href: "https://en.wikipedia.org/wiki/Kruskal%27s_algorithm",
      note: "Solid reference with the parallel variants (filter-Kruskal) and references to Borůvka's pre-Kruskal 1926 algorithm.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "kr-q1",
      question:
        "Why does Kruskal's algorithm always produce a tree with the minimum total weight?",
      options: [
        { id: "a", label: "Because sorting the edges first guarantees the answer." },
        { id: "b", label: "Because the cut property says the cheapest edge across any cut belongs to *some* MST — and every edge Kruskal accepts is the cheapest edge across the cut between its two then-disjoint components." },
        { id: "c", label: "Because DSU's union-by-rank automatically picks the minimum weight." },
        { id: "d", label: "Because BFS from every node converges to the MST." },
      ],
      correctOptionId: "b",
      explanation:
        "The cut property is the foundation: for any partition of vertices, the cheapest crossing edge is in *some* MST. Kruskal's sort-and-walk implicitly considers a cut every time it crosses two not-yet-connected components — and because edges are sorted, the one it's looking at is the cheapest such crossing. Adding it is always safe.",
    },
    {
      id: "kr-q2",
      question:
        "What is Kruskal's time complexity, and what dominates?",
      options: [
        { id: "a", label: "O(V²) — dominated by the DSU." },
        { id: "b", label: "O(E log V) — dominated by sorting the edges. The DSU work is O(E · α(V)) ≈ O(E)." },
        { id: "c", label: "O(V³) — like Floyd-Warshall." },
        { id: "d", label: "O(E + V log V) — dominated by the priority queue." },
      ],
      correctOptionId: "b",
      explanation:
        "Sorting E edges costs O(E log E) = O(E log V) (since E ≤ V², log E ≤ 2 log V). The DSU operations are E unions/finds, each α(V), totalling O(E · α(V)) ≈ O(E). The sort dominates. That's why Kruskal is the right choice for sparse graphs — sort-cost scales gracefully.",
    },
    {
      id: "kr-q3",
      question:
        "When Kruskal considers an edge (u, v) and finds `find(u) == find(v)`, what's happening?",
      options: [
        { id: "a", label: "The graph is disconnected." },
        { id: "b", label: "u and v are in the same component already — adding this edge would form a cycle, so the algorithm skips it." },
        { id: "c", label: "The DSU is broken." },
        { id: "d", label: "It's safe to add the edge; it improves the MST." },
      ],
      correctOptionId: "b",
      explanation:
        "When find(u) == find(v), u and v already share a root in the DSU — meaning a path between them exists using only previously-accepted MST edges. Adding the new edge would close a cycle, which contradicts the tree property. Kruskal skips it. This α(V) check is what makes the algorithm efficient.",
    },
  ],
};
