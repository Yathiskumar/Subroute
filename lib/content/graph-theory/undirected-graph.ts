import type { ConceptContent } from "@/lib/content/types";

export const undirectedGraph: ConceptContent = {
  prototypeCaption:
    "A six-vertex undirected graph across four tabs. **Anatomy** reveals the edges one at a time and shows what a vertex's degree means; **Handshake lemma** adds up every degree to prove the sum equals 2 × edges; **Paths & components** runs a BFS to trace a path and confirm the graph is connected. **Free play** lets you click two vertices to toggle an edge, drag vertices around, and run Find path on your own graph — the degree and component counters update live.",

  overview: [
    {
      type: "p",
      text: "**An undirected graph is the plainest graph there is: a set of vertices and a set of edges, where each edge simply joins two vertices with no sense of direction.** If there's an edge between A and B, then A is connected to B *and* B is connected to A — the relationship is symmetric. Drawn on paper it's just dots and lines; there are no arrowheads, because none are needed.",
    },
    {
      type: "p",
      text: "This is the right model whenever the relationship you're capturing is mutual. Friendship on most social networks (if I'm your friend, you're mine), a fibre cable between two routers (traffic flows both ways), a shared border between two countries, a road you can drive in either direction. The moment a relationship is *one-way* — a Twitter follow, a web hyperlink, a prerequisite — you've left undirected territory and need a directed graph instead.",
    },
    {
      type: "p",
      text: "Two pieces of vocabulary unlock most of what follows. The **degree** of a vertex is the number of edges touching it — your friend count, a router's cable count. And a **path** is a sequence of edges hopping from one vertex to the next; if a path exists between every pair of vertices, the graph is **connected**, otherwise it falls into separate **components**. Get comfortable reading degree and connectivity off a picture and the rest of graph theory has a foundation to stand on.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The pieces" },
    {
      type: "ul",
      items: [
        "**Vertices (nodes)** — the things. People, cities, routers, atoms. Usually written V, with |V| or *n* for the count.",
        "**Edges** — unordered pairs `{u, v}` saying 'u and v are connected.' Because the pair is *unordered*, `{u, v}` and `{v, u}` are the same edge. Written E, with |E| or *m* for the count.",
        "**Degree** — `deg(v)` = how many edges touch v. A vertex of degree 0 is *isolated*; degree 1 is a *leaf*; a high-degree vertex is a *hub*.",
        "**Path** — a walk v₀, v₁, …, v_k where each consecutive pair is joined by an edge. Its *length* is the number of edges, k.",
        "**Connected / components** — the graph is connected if some path links every pair of vertices. If not, it breaks into maximal connected pieces called components.",
      ],
    },
    { type: "h", text: "The handshake lemma" },
    {
      type: "p",
      text: "Add up the degrees of all vertices and you always get exactly twice the number of edges: **Σ deg(v) = 2·|E|**. The reason is almost too simple — every edge has two endpoints, so it contributes 1 to each of two vertices' degrees, i.e. 2 to the total. A direct corollary: the number of odd-degree vertices is always even (the classic 'in any group, the number of people who shook an odd number of hands is even').",
    },
    {
      type: "callout",
      variant: "info",
      title: "Simple graph vs multigraph",
      text: "Most of the time we assume a **simple** graph: no self-loops (an edge from a vertex to itself) and no parallel edges (two edges between the same pair). When those *are* allowed, it's a **multigraph** — handy for modelling, say, multiple flights between the same two cities. The handshake lemma still holds for multigraphs; a self-loop just counts 2 toward its vertex's degree.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "How many edges can it have?",
      text: "A simple undirected graph on n vertices has at most n(n−1)/2 edges — the case where every pair is joined, which is the complete graph Kₙ. Real-world graphs are usually far below that ceiling (they're *sparse*), which is why the adjacency-list representation, costing O(V + E), almost always beats the O(V²) adjacency matrix.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Model it as undirected when" },
    {
      type: "ul",
      items: [
        "**The relationship is mutual** — friendships, mutual followers, physical links (cables, roads you can travel both ways, shared walls).",
        "**You only care whether two things are related, not who 'points' at whom** — co-authorship, 'these two molecules can bond', 'these two pixels are adjacent'.",
        "**You're computing connectivity or clusters** — connected components, spanning trees, and 'is everyone reachable?' are natural undirected questions.",
      ],
    },
    { type: "h", text: "Reach for a directed graph instead when" },
    {
      type: "ul",
      items: [
        "**The relationship can be one-way** — follows, links, imports, 'A must happen before B'. Forcing these into an undirected graph throws away the very information you need.",
        "**Reachability is asymmetric** — if 'A can reach B' shouldn't imply 'B can reach A', you need arrows.",
        "**You need an ordering** — topological order, scheduling, and dependency resolution all require direction (and acyclicity).",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Simplest possible model** — one unordered pair per relationship; nothing to get backwards.",
      "**Symmetric by construction** — `A–B` automatically means `B–A`, so you never store or reason about two directions.",
      "**Connectivity is clean** — components, spanning trees, and 'is it all one piece?' are direct, well-studied questions.",
      "**The adjacency matrix is symmetric** — you can store just the upper triangle, halving memory if you use a matrix at all.",
    ],
    cons: [
      "**Can't express one-way relationships** — follows, links, prerequisites, and flows all need direction the model simply doesn't have.",
      "**No notion of 'source' or 'sink'** — every endpoint is interchangeable, so you can't ask 'who has no incoming relationships?'.",
      "**Edges are equal** — plain undirected graphs say nothing about *cost*; add weights when distance or price matters.",
      "**Each edge is stored twice in an adjacency list** — once in each endpoint's neighbour list (a minor space cost, and a footgun if you forget to add both).",
    ],
  },

  handsOn: [
    {
      title: "01 · Anatomy",
      body: "On the **Anatomy** tab, press **Play** to watch the six edges appear one at a time. Each narration reminds you that an undirected edge `{u, v}` counts toward *both* endpoints' degrees. The final step highlights vertex **B** and its three edges — note its degree of 3, while leaf vertex **D** has degree 1. Use **Step** / **Back** to move one edge at a time.",
    },
    {
      title: "02 · Handshake lemma",
      body: "Switch to **Handshake lemma** and Play. The prototype walks vertex by vertex, adding each degree to a running total in the side panel. Watch the total land on **12** — exactly 2 × 6 edges. Convince yourself why: every edge bumped the total by 2, once for each end. That's why the sum of degrees is always even.",
    },
    {
      title: "03 · Paths & components",
      body: "On **Paths & components**, Play to run a BFS from D to C. It expands neighbours until it reaches the target, then highlights the path in orange — and reminds you the path runs equally well in reverse, because the graph is undirected. The final step confirms all six vertices were reachable, so the graph is a single connected component.",
    },
    {
      title: "04 · Free play — build your own",
      body: "Open **Free play**. Click any two vertices to toggle an edge between them; drag vertices to rearrange. Watch the *Σ degree* stat stay at exactly twice the edge count no matter what you build (the handshake lemma in action). Hit **Clear edges** to make six isolated vertices and see the *components* counter jump to 6, then use **Find path** to confirm there's no route between disconnected vertices.",
    },
  ],

  code: {
    language: "typescript",
    filename: "undirected-graph.ts",
    code: `// An undirected graph as an adjacency list.
// The key invariant: every edge is stored on BOTH endpoints.
class UndirectedGraph {
  private adj = new Map<string, Set<string>>();

  addVertex(v: string) {
    if (!this.adj.has(v)) this.adj.set(v, new Set());
  }

  addEdge(u: string, v: string) {
    this.addVertex(u);
    this.addVertex(v);
    this.adj.get(u)!.add(v);   // u knows v ...
    this.adj.get(v)!.add(u);   // ... and v knows u (symmetric!)
  }

  degree(v: string): number {
    return this.adj.get(v)?.size ?? 0;
  }

  // Handshake lemma: this always equals 2 * (edge count).
  sumOfDegrees(): number {
    let s = 0;
    for (const nbrs of this.adj.values()) s += nbrs.size;
    return s;
  }

  // Shortest path by edge count (BFS) — undirected, so we follow edges both ways.
  shortestPath(start: string, goal: string): string[] | null {
    const prev = new Map<string, string | null>([[start, null]]);
    const queue = [start];
    while (queue.length) {
      const u = queue.shift()!;
      if (u === goal) break;
      for (const w of this.adj.get(u) ?? []) {
        if (!prev.has(w)) { prev.set(w, u); queue.push(w); }
      }
    }
    if (!prev.has(goal)) return null;       // different component
    const path: string[] = [];
    for (let c: string | null = goal; c !== null; c = prev.get(c)!) path.unshift(c);
    return path;
  }
}`,
  },

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, Appendix B.4 & Ch. 20",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The formal definitions of graphs, degree, paths, and the two standard representations (adjacency list vs matrix).",
      kind: "book",
    },
    {
      label: "Wikipedia — Graph (discrete mathematics)",
      href: "https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)",
      note: "Clear reference for vertices, edges, simple graphs vs multigraphs, and the surrounding vocabulary.",
      kind: "article",
    },
    {
      label: "Wikipedia — Handshaking lemma",
      href: "https://en.wikipedia.org/wiki/Handshaking_lemma",
      note: "Why the degree sum is twice the edge count, the even-odd-degree corollary, and its history back to Euler.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Graph data structures",
      href: "https://visualgo.net/en/graphds",
      note: "Interactive visualisation of adjacency lists and matrices on the same graph — great for seeing the storage trade-off.",
      kind: "video",
    },
    {
      label: "Skiena — *The Algorithm Design Manual*, Ch. 7 (Graph Traversal)",
      href: "https://www.algorist.com/",
      note: "Practical guidance on modelling problems as graphs and choosing a representation, with war stories.",
      kind: "book",
    },
    {
      label: "Khan Academy — Describing graphs",
      href: "https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/describing-graphs",
      note: "A gentle, example-driven introduction to vertices, edges, degree, and adjacency for first-time readers.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "ug-q1",
      question:
        "In a simple undirected graph with 6 vertices and 6 edges, what is the sum of all vertex degrees?",
      options: [
        { id: "a", label: "6" },
        { id: "b", label: "12" },
        { id: "c", label: "36" },
        { id: "d", label: "It depends on the graph's shape." },
      ],
      correctOptionId: "b",
      explanation:
        "By the handshake lemma, the sum of degrees is always 2 × (number of edges), regardless of shape — here 2 × 6 = 12. Each edge contributes 1 to each of its two endpoints, so it adds 2 to the total. The shape changes how the 12 is distributed among vertices, not the total.",
    },
    {
      id: "ug-q2",
      question:
        "What does it mean for an undirected graph to be 'connected'?",
      options: [
        { id: "a", label: "Every vertex has the same degree." },
        { id: "b", label: "There is a path between every pair of vertices — the graph is one single piece." },
        { id: "c", label: "Every pair of vertices is joined by a direct edge." },
        { id: "d", label: "The graph has no cycles." },
      ],
      correctOptionId: "b",
      explanation:
        "Connected means you can get from any vertex to any other by following edges — the graph forms a single component. Option C describes a *complete* graph (a much stronger condition), and option D describes a tree-or-forest property; neither is what 'connected' means.",
    },
    {
      id: "ug-q3",
      question:
        "Why is an undirected graph a poor model for 'who follows whom' on Twitter?",
      options: [
        { id: "a", label: "Undirected graphs can't store more than a few thousand vertices." },
        { id: "b", label: "Following is one-way — you can follow someone who doesn't follow you back — but an undirected edge forces the relationship to be mutual." },
        { id: "c", label: "Undirected graphs don't allow cycles, and follower networks have cycles." },
        { id: "d", label: "Undirected graphs require edge weights, which follows don't have." },
      ],
      correctOptionId: "b",
      explanation:
        "A follow is inherently directional: A→B does not imply B→A. An undirected edge {A, B} can only say 'A and B are mutually connected', erasing the asymmetry. That asymmetry is exactly the information a follower graph is about, so you need a directed graph.",
    },
  ],
};
