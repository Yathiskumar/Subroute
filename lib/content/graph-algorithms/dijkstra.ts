import type { ConceptContent } from "@/lib/content/types";

export const dijkstra: ConceptContent = {
  prototypeCaption:
    "A six-node weighted graph and a priority queue. Press **Play** to watch Dijkstra *settle* the closest unsettled node and relax its outgoing edges, ring by ring. **Step** / **Back** walk one settle at a time. Use the **Start** dropdown to recompute from a different source.",

  overview: [
    {
      type: "p",
      text: "**Dijkstra's algorithm is BFS for weighted graphs.** Instead of a queue that always pops the oldest node, it uses a *priority queue* that always pops the node with the smallest known distance. Everything else is the same shape: a frontier of seen-but-not-yet-settled nodes, and a settled set of nodes whose shortest-path distance is finalised.",
    },
    {
      type: "p",
      text: "The trick is the **greedy** choice: at every step, the unsettled node with the smallest distance estimate has its true shortest distance. That's safe to commit to — any path that tried to reach it via some other route would have to go through another unsettled node with an *even bigger* estimate, which can't improve on what we already have. Once committed, we **relax** its outgoing edges: for each neighbour, check whether routing through this newly-settled node gives a shorter distance than the neighbour currently has, and update if so.",
    },
    {
      type: "p",
      text: "The only requirement is **non-negative edge weights**. Negative edges break the greedy choice — a node you committed to could turn out to be reachable more cheaply via a longer-but-cheaper path you hadn't explored yet. For graphs with negatives, you need Bellman-Ford. For everything else — road networks, latency-weighted topologies, fee-weighted routes — Dijkstra is the default.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The algorithm in five lines" },
    {
      type: "ol",
      items: [
        "Give every node a distance estimate. The start gets **0**, everyone else gets **∞**.",
        "Put `(start, 0)` into a min-priority-queue keyed by distance.",
        "Loop: pop the node `u` with the smallest distance. If it's already settled, skip it. Otherwise, mark `u` settled — its distance is now final.",
        "For each edge `u → v` with weight `w`: if `dist[u] + w < dist[v]`, update `dist[v] = dist[u] + w` and push `(v, dist[v])` into the priority queue. This is called **relaxing** the edge.",
        "Repeat until the queue is empty (or you popped the target you cared about).",
      ],
    },
    { type: "h", text: "Why the greedy choice is safe (the cut property)" },
    {
      type: "ul",
      items: [
        "When you pop the unsettled node `u` with the smallest estimate `dist[u]`, every other unsettled node has a distance estimate ≥ `dist[u]`.",
        "Any alternative path to `u` must pass through some unsettled node `w` first — and then `dist[u] ≤ dist[w] + (cost from w to u) ≤ dist[w]` only if every edge weight ≥ 0.",
        "So `dist[u]` can't be beaten — it's the true shortest distance. Settling is safe.",
        "This argument *breaks* the moment a negative edge appears: `dist[w] + (negative cost)` can be smaller than `dist[u]`, so `u` could later be reached more cheaply. That's why Dijkstra refuses to run on negative-weight graphs.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Two common implementations",
      text: "With a **binary heap** the runtime is O((V + E) log V) — what every library ships. With a **Fibonacci heap** the analysis drops to O(E + V log V), better in theory but rarely worth the constants in practice. On dense graphs (E ≈ V²), an **array-based** version is O(V²) and often beats the heap version because of cache effects.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Lazy deletion is the standard trick",
      text: "When a better path is found, the old `(v, oldDist)` is still in the heap — heaps don't support remove-by-key. The fix: leave it there and *skip stale entries on pop* (`if (oldDist > dist[v]) continue`). The heap can hold up to O(E) entries, so the time bound is O((V + E) log E), which simplifies to O((V + E) log V).",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Road maps and GPS routing** — every navigation app runs Dijkstra (or a derivative) over a road graph with travel-time weights.",
        "**Network routing protocols** — OSPF and IS-IS run Dijkstra over the network topology to compute shortest paths from a router to every other.",
        "**Latency-aware load balancing** — when picking which backend to call, route through the lowest-latency path. Same algorithm, different weights.",
        "**Toll / fee minimisation** — anywhere a path has a per-edge cost and you want the cheapest one, Dijkstra is the answer.",
        "**Game maps with movement costs** — different terrain has different costs to cross; Dijkstra finds the cheapest path. If you have a known goal and a heuristic, upgrade to A*.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Negative edge weights** — use **Bellman-Ford**. Dijkstra silently returns wrong answers; Bellman-Ford handles negatives and detects negative cycles.",
        "**All pairs at once on a small dense graph** — use **Floyd-Warshall**. V calls to Dijkstra is O(V·(V+E)·log V); Floyd-Warshall is O(V³) and often wins for V < a few hundred.",
        "**Unweighted graph** — use **BFS**. It's the same algorithm minus the heap; O(V + E) vs O((V + E) log V).",
        "**Single goal with a useful heuristic** — use **A***. It's Dijkstra with a 'go this way' hint; usually expands far fewer nodes.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Fast** — O((V + E) log V) with a binary heap, near-linear in sparse graphs.",
      "**Correct on non-negative weights** — no other classical SSSP algorithm beats it in this regime.",
      "**Settles one node at a time** — easy to stop early once you've settled your target, which is what GPS apps do.",
      "**The shape under A***, Prim's MST, Yen's k-shortest-paths — once you know Dijkstra, half a dozen other algorithms become obvious variants.",
      "**Ships in every standard library** — Python's `heapq`, Java's `PriorityQueue`, C++ `std::priority_queue`, all you need to write it from scratch.",
    ],
    cons: [
      "**Wrong on negative edges** — the greedy invariant breaks. Use Bellman-Ford.",
      "**Heap overhead** — for very dense graphs the O(V²) array form beats the O((V+E) log V) heap form because of constants.",
      "**No directional bias** — explores symmetrically away from the source. Pathfinding to a single goal can be much faster with A*.",
      "**Lazy-deletion entries clutter the heap** — implementation gotcha; missing the stale-skip check turns the algorithm into a slow correctness landmine.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through one full computation",
      body: "Press **Play** from the default start. Watch the priority queue (right panel) re-order as edges are relaxed: every time a shorter path is found, the affected node moves up in the queue. The settled set grows ring by ring — but the rings are weighted now, not edge-counted.",
    },
    {
      title: "02 · Step through one settle at a time",
      body: "Hit **Step** to pop the next node from the priority queue. If its distance is stale (it's already settled with a smaller distance), the prototype shows the *skip* badge — that's lazy deletion in action. **Back** rewinds the relaxation: distances roll back to their previous values.",
    },
    {
      title: "03 · Try a different start node",
      body: "Switch **Start** from A to E. Watch how the shortest-path tree (the highlighted edges) restructures itself: a leaf-start gives a long thin tree, an interior-start gives a balanced one. Note that *every* node's distance changes — Dijkstra is single-source by design.",
    },
    {
      title: "04 · Find the heaviest edge that's *not* in the tree",
      body: "Look for an edge with a big weight where neither endpoint's shortest path uses it. That edge would only ever be useful if a future change made some other path more expensive. In production routing, those are the edges that absorb failures — they're called *backup* paths.",
    },
  ],

  code: {
    language: "typescript",
    filename: "dijkstra.ts",
    code: `// Dijkstra's algorithm with a binary heap.
// Returns shortest distances from \`start\` to every reachable node.
type Edge = { to: string; w: number };
type Heap = Array<[number, string]>;          // [distance, node]

function dijkstra(
  graph: Map<string, Edge[]>,
  start: string,
): Map<string, number> {
  const dist = new Map<string, number>();
  for (const u of graph.keys()) dist.set(u, Infinity);
  dist.set(start, 0);

  const heap: Heap = [[0, start]];
  while (heap.length > 0) {
    const [d, u] = heap.shift()!;             // real code: sift-down
    if (d > (dist.get(u) ?? Infinity)) continue;   // stale entry — skip

    for (const { to: v, w } of graph.get(u) ?? []) {
      const nd = d + w;
      if (nd < (dist.get(v) ?? Infinity)) {
        dist.set(v, nd);
        heap.push([nd, v]);                   // real code: sift-up
      }
    }
  }
  return dist;
}

// Real implementations: replace shift/push with a proper binary heap
// (Python: heapq, Java: PriorityQueue, C++: priority_queue with reverse comparator).
// For a target-only query, return early as soon as you pop the target.`,
  },

  furtherReading: [
    {
      label: "Edsger Dijkstra — *A note on two problems in connexion with graphs* (1959)",
      href: "https://www-m3.ma.tum.de/foswiki/pub/MN0506/WebHome/dijkstra.pdf",
      note: "The three-page note that started it all. Dijkstra describes the algorithm verbally — it's surprisingly easy to follow.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, Chapter 24.3 (Dijkstra)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Textbook treatment with the cut-property proof and a comparison of array vs binary-heap vs Fibonacci-heap implementations.",
      kind: "book",
    },
    {
      label: "Robert Sedgewick — *Algorithms*, §4.4 (Shortest Paths)",
      href: "https://algs4.cs.princeton.edu/44sp/",
      note: "Princeton's online algorithms course with runnable Java code, animations, and the lazy- vs eager-relaxation comparison.",
      kind: "article",
    },
    {
      label: "RFC 2328 — OSPF Version 2 (the link-state protocol)",
      href: "https://datatracker.ietf.org/doc/html/rfc2328",
      note: "How the OSPF routing protocol runs Dijkstra over a router topology to build forwarding tables — Dijkstra in production at internet scale.",
      kind: "spec",
    },
    {
      label: "Stanford CS 261 — Optimization and Algorithmic Paradigms (Dijkstra)",
      href: "https://web.stanford.edu/class/cs261/2024/notes/l2.pdf",
      note: "Clean lecture notes including the failure modes on negative edges with a worked example you can replay by hand.",
      kind: "article",
    },
    {
      label: "Wikipedia — Dijkstra's algorithm",
      href: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm",
      note: "Solid reference with the bidirectional Dijkstra variant and pointers to specialised implementations (Pape's, Dial's bucket queue).",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "dij-q1",
      question:
        "Why is Dijkstra's algorithm incorrect on graphs with negative-weight edges?",
      options: [
        { id: "a", label: "Because the priority queue can't store negative numbers." },
        { id: "b", label: "Because the greedy 'settle the nearest unsettled node' choice can be wrong: a node could later be reached more cheaply via a longer path containing a negative edge." },
        { id: "c", label: "Because the algorithm runs forever on negative-edge graphs." },
        { id: "d", label: "Because negative weights make the heap unbalanced." },
      ],
      correctOptionId: "b",
      explanation:
        "The greedy step assumes you can never improve on an already-settled node by routing through unsettled nodes — because all future edges are ≥ 0, so the alternative can only get bigger. A negative edge breaks that assumption: an unsettled node might lead to a cheaper path than the one we just committed to. The algorithm finishes, but it returns wrong distances.",
    },
    {
      id: "dij-q2",
      question:
        "What does 'relaxing an edge' mean in Dijkstra's algorithm?",
      options: [
        { id: "a", label: "Removing the edge from the graph after it's been used." },
        { id: "b", label: "Checking if `dist[u] + w < dist[v]`, and if so, updating `dist[v]` to the shorter value." },
        { id: "c", label: "Lowering the weight of the edge over time." },
        { id: "d", label: "Marking both endpoints as visited." },
      ],
      correctOptionId: "b",
      explanation:
        "Relaxing edge (u, v) means: 'I now know a cheaper way to reach v — via u — than the path I had before.' Update v's distance and push the new (v, distance) pair into the priority queue. Every edge can be relaxed multiple times; the last relaxation gives v its final distance.",
    },
    {
      id: "dij-q3",
      question:
        "Using a binary heap, what is Dijkstra's time complexity?",
      options: [
        { id: "a", label: "O(V²)" },
        { id: "b", label: "O(V + E)" },
        { id: "c", label: "O((V + E) log V)" },
        { id: "d", label: "O(E log E + V log V)" },
      ],
      correctOptionId: "c",
      explanation:
        "Each node is popped once → V pops, each O(log V) → O(V log V). Each edge can trigger at most one push → E pushes, each O(log V) → O(E log V). Total: O((V + E) log V). With a Fibonacci heap the analysis drops to O(E + V log V), better asymptotically but rarely worth the constants in practice.",
    },
  ],
};
