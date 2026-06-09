import type { TopicContent } from "@/lib/content/types";

export const graphAlgorithmsTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**A graph is just dots and lines** — but almost everything interesting in computer science is hiding inside one. The cities your maps app routes between. The friends in your social network. The packages your build system has to compile in the right order. The web pages Google's crawler walks. Once you see the world as a graph, a handful of algorithms unlock all of it.",
    },
    {
      type: "p",
      text: "The ten here split into four groups. **Traversals** — BFS and DFS — answer 'who can I reach from here, and in what order?' They are the seed of almost every other graph algorithm. **Shortest paths** — Dijkstra, Bellman-Ford, Floyd-Warshall — answer 'what's the cheapest route?' under different rules about edge weights. **Minimum spanning trees** — Union-Find, Kruskal, Prim — answer 'how do I connect every node for the least cost?' And **A*** answers the same shortest-path question, but with a hint about which direction to look first — the trick behind every modern pathfinder.",
    },
    {
      type: "p",
      text: "You do not need to memorise ten algorithms. You need to know *which question each one answers* and *what assumption it requires*. Once that's clear, the code follows in twenty lines. This topic walks you through them in the order they build on each other — traversals first, because everything else is a smarter traversal.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Where this shows up" },
    {
      type: "ul",
      items: [
        "**Maps and routing** — Google Maps, Waze, and every GPS unit run Dijkstra or A* over a road graph millions of edges wide, every time you ask for directions.",
        "**Build systems and schedulers** — `make`, Bazel, Webpack, Airflow, and CI pipelines all topologically sort their task DAG to decide what runs in parallel and what must wait.",
        "**Social networks and recommendations** — friend-of-friend, shortest-path-between-people, and 'connected components' on follower graphs are all BFS or Union-Find under the hood.",
        "**Networks and the internet** — link-state routing protocols (OSPF, IS-IS) run Dijkstra on the network topology; distance-vector protocols (RIP, BGP path selection) trace back to Bellman-Ford.",
        "**Game AI and robotics** — every NPC that walks around a level, every robot vacuum that plans a path, runs A* on a grid or navmesh.",
        "**Compilers and verifiers** — register allocation is graph colouring; dead-code elimination is reachability; data-flow analysis runs a fixpoint over the control-flow graph.",
        "**Crash detection and money laundering** — anomaly detectors run connected-components and shortest-paths on transaction graphs to find rings of accounts moving money in circles.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Two ways to store a graph",
      text: "An **adjacency list** keeps, for each node, the list of its neighbours — O(V + E) memory, fast iteration. An **adjacency matrix** is a V×V grid where `M[u][v]` is the edge weight (or ∞) — O(V²) memory, O(1) edge lookup. Lists win for sparse graphs (most real ones); matrices win for dense graphs and for algorithms like Floyd-Warshall that look up arbitrary edges in their inner loop.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Algorithm",
      bursts: "Solves",
      precision: "Time",
      memory: "Edge weights",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "BFS",
        bursts: "Shortest path in edges",
        precision: "O(V + E)",
        memory: "Unweighted",
        bestFor: "Level-order walks; fewest-hops paths; shortest path in unweighted graphs.",
      },
      {
        algorithm: "DFS",
        bursts: "Reachability / structure",
        precision: "O(V + E)",
        memory: "Unweighted",
        bestFor: "Cycle detection, topological order, connected components, maze backtracking.",
      },
      {
        algorithm: "Topological Sort",
        bursts: "Linear DAG order",
        precision: "O(V + E)",
        memory: "DAG only",
        bestFor: "Build order, course prerequisites, task scheduling, dependency resolution.",
      },
      {
        algorithm: "Dijkstra",
        bursts: "Single-source shortest path",
        precision: "O((V + E) log V)",
        memory: "Non-negative",
        bestFor: "Road maps, network routing, any weighted graph with positive costs.",
      },
      {
        algorithm: "Bellman-Ford",
        bursts: "Single-source shortest path",
        precision: "O(V · E)",
        memory: "Negative OK; detects negative cycles",
        bestFor: "Currency arbitrage, distance-vector routing, graphs with negative weights.",
      },
      {
        algorithm: "Floyd-Warshall",
        bursts: "All-pairs shortest path",
        precision: "O(V³)",
        memory: "Negative OK (no neg cycle)",
        bestFor: "Small dense graphs where every pair matters — transitive closure, network diameter.",
      },
      {
        algorithm: "Union-Find",
        bursts: "Connectivity / merge sets",
        precision: "α(n) per op",
        memory: "n/a",
        bestFor: "Dynamic connectivity, Kruskal's cycle check, percolation, image segmentation.",
      },
      {
        algorithm: "Kruskal's MST",
        bursts: "Minimum spanning tree",
        precision: "O(E log E)",
        memory: "Any (no neg cycle issues)",
        bestFor: "Sparse graphs; edges already sorted; when you have a fast DSU.",
      },
      {
        algorithm: "Prim's MST",
        bursts: "Minimum spanning tree",
        precision: "O((V + E) log V)",
        memory: "Any",
        bestFor: "Dense graphs; when you have one starting vertex and want to grow outward.",
      },
      {
        algorithm: "A*",
        bursts: "Single goal shortest path",
        precision: "O(E) with a good heuristic",
        memory: "Non-negative + heuristic",
        bestFor: "Pathfinding to a known target — games, GPS, robotics, anywhere geometry hints help.",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to pick" },
    {
      type: "ul",
      items: [
        "**Unweighted graph, shortest path in edges** → **BFS**. Every edge counts the same, so first-seen is shortest. Don't reach for Dijkstra here.",
        "**Need an order, not a path** → **DFS** if you can recurse; **topological sort** if you need a linear schedule out of a DAG.",
        "**Weighted graph, positive weights, one source** → **Dijkstra**. The default. Fast, well-understood, every standard library has it.",
        "**Weighted graph with negative edges or a need to detect negative cycles** → **Bellman-Ford**. Slower, but it works where Dijkstra can't.",
        "**You need every pairwise distance, graph is small/dense** → **Floyd-Warshall**. Three nested loops, easy to write, O(V³).",
        "**Cheapest network that connects every node** → **Kruskal** if your graph is sparse (and you have a good DSU), **Prim** if it's dense.",
        "**Pathfinder to a *known goal* with a notion of distance to it** → **A***. Same answer as Dijkstra, often 10× faster, because the heuristic biases the search toward the goal.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Greedy works for shortest paths — here's why",
      text: "Dijkstra and Prim are both greedy: at each step they grab the cheapest frontier edge and commit. The reason that works (and isn't just lucky) is the **cut property** — for any cut of the graph, the cheapest crossing edge belongs to *some* MST, and the closest unsettled node from a source has its final distance fixed. Bellman-Ford gives this up — it has to relax repeatedly because negative edges break the cut property — and that's exactly where the V×E factor comes from.",
    },
  ],
};
