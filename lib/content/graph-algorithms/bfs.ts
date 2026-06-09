import type { ConceptContent } from "@/lib/content/types";

export const bfs: ConceptContent = {
  prototypeCaption:
    "A seven-node graph, a queue, and a visit order. Press **Play** to watch BFS sweep outward in expanding rings, or use **Step** / **Back** to walk one dequeue at a time. The **Start** dropdown lets you re-run from any node so you can compare distance fields.",

  overview: [
    {
      type: "p",
      text: "**Breadth-First Search visits a graph in expanding rings.** Start at one node. Visit all of its neighbours. Then all of *their* unvisited neighbours. Then theirs. After k rounds, you've seen every node that's exactly k edges away from the start — and crucially, you've seen them in *that* order.",
    },
    {
      type: "p",
      text: "The whole algorithm is a single data structure: a **queue**. You enqueue the start, then loop — dequeue a node, mark it visited, enqueue every unvisited neighbour. That's it. Eight lines of code, O(V + E) time, O(V) space. The queue is what enforces the ring-by-ring order: nodes enqueued earlier (closer to the start) get dequeued before nodes enqueued later (further out).",
    },
    {
      type: "p",
      text: "BFS is the right tool whenever you need to count edges or find a *shortest path in an unweighted graph*. The first time a node leaves the queue, the path it took to get there is already the shortest one — because every shorter path would have reached it first. That property is so useful that BFS shows up under a dozen other names: level-order traversal in trees, breadth-first crawl in web spiders, k-hop neighbour queries in social networks.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The algorithm in five lines" },
    {
      type: "ol",
      items: [
        "Put the start node in a queue. Mark its distance as 0.",
        "Loop while the queue isn't empty: take the front node off.",
        "For each of its neighbours: if you haven't seen this neighbour yet, mark its distance as the current node's distance + 1 and enqueue it.",
        "Repeat until the queue empties.",
        "Every reachable node now has its shortest distance from the start.",
      ],
    },
    { type: "h", text: "Why the queue gives shortest paths" },
    {
      type: "ul",
      items: [
        "Nodes are added to the queue **in increasing distance order**: distance-0 first (the start), then distance-1, then distance-2.",
        "When you dequeue a distance-k node, its unvisited neighbours are at distance k+1 — they get marked once, with that distance, and never touched again.",
        "First-seen = shortest, because a longer path would have been blocked by a shorter one that ran first.",
        "**This only works if every edge counts the same.** Weighted edges break the invariant — that's why you need Dijkstra once weights enter the picture.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Three sets, not two",
      text: "It's tempting to track only 'visited / unvisited.' But BFS really has three states: **unseen** (we haven't touched it), **queued** (it's in the queue, distance assigned, neighbours not yet expanded), and **visited** (it's been dequeued, neighbours expanded). Forgetting to mark a node as queued *the moment you enqueue it* — not when you dequeue it — is the classic bug: you'll enqueue the same node many times and the runtime balloons.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Shortest path in an unweighted graph** — fewest hops between two web pages, friends-of-friends in a social network, fewest moves in a sliding puzzle.",
        "**Level-by-level processing** — render a tree level by level; rank pages by distance from the seed in a crawl.",
        "**Connectivity** — 'is there *any* path from A to B?' BFS answers it in O(V + E) and proves the shortest one in the same pass.",
        "**Bipartite check** — colour the start node 0, every neighbour 1, every grand-neighbour 0; an edge connecting two same-colour nodes proves the graph isn't bipartite.",
        "**Web crawling** — BFS gives you a 'concentric circle' crawl, so you cover the whole site before going deep into one corner.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Weighted edges** — use **Dijkstra**. BFS treats every edge as cost 1, so it'll return wrong answers on a graph where some edges are 'expensive.'",
        "**You want a topological order or to find cycles** — use **DFS**. Its post-order is the topo sort; its grey-edge detector finds cycles.",
        "**The graph is huge and the goal is somewhere specific** — use **A***. BFS expands everywhere; A* expands toward the goal.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Linear time** — O(V + E). Touches every node and every edge exactly once.",
      "**Shortest path is free** — first-seen distance is the answer; no extra bookkeeping.",
      "**Iterative** — uses a queue, not recursion. Works fine on graphs with millions of nodes where DFS would blow the stack.",
      "**Easy to parallelise** — each frontier ring can be expanded independently, which is why BFS underpins distributed graph engines like Pregel and Giraph.",
      "**Simple** — eight lines, one queue, one visited set. Hard to get wrong once you mark-on-enqueue.",
    ],
    cons: [
      "**Wrong on weighted graphs** — every edge weighs 1, full stop.",
      "**Memory grows with the frontier** — on a wide graph (high branching factor) the queue can hold most of the next layer at once. Worst case Θ(V).",
      "**No notion of 'direction'** — BFS explores symmetrically, even if you already know the goal is north-east. A* fixes that with a heuristic.",
      "**Order within a level is arbitrary** — depends on adjacency-list order, which can surprise debuggers expecting a stable visit order.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through one full BFS",
      body: "Press **Play** and watch the orange ring sweep outward from **A**. Notice how every distance-1 neighbour (B, C) gets enqueued before any distance-2 neighbour. The colour transitions go *unseen → queued → visited* — same three-state pattern from the explanation.",
    },
    {
      title: "02 · Step through one dequeue at a time",
      body: "Hit **Step** to advance and **Back** to rewind. Every step dequeues one node, marks it *visited*, and enqueues its unseen neighbours. Watch the *In queue* and *Visited* counters: the queue grows on the early steps (lots of new neighbours), then shrinks as the frontier hits already-seen nodes.",
    },
    {
      title: "03 · Try a different start node",
      body: "Pick a leaf like **D** or **G** in the **Start** dropdown. The visit order changes completely — and so do the distances. From a leaf, BFS has to crawl back up through its only neighbour before fanning out, so the distance field looks lopsided.",
    },
    {
      title: "04 · Find the longest shortest path",
      body: "Set start to **A** and look at the highest distance label in the graph. That number is the graph's *eccentricity* from A — the farthest any node is from your start. Try other start nodes; the maximum across all starts is the graph's **diameter**, which BFS computes in V² total time.",
    },
  ],

  code: {
    language: "typescript",
    filename: "bfs.ts",
    code: `// BFS on an adjacency list. Returns shortest-path distances
// (in edges) from \`start\` to every reachable node.
function bfs(adj: Map<string, string[]>, start: string): Map<string, number> {
  const dist = new Map<string, number>();
  const queue: string[] = [start];
  dist.set(start, 0);

  while (queue.length > 0) {
    const node = queue.shift()!;          // dequeue front
    for (const nb of adj.get(node) ?? []) {
      // Mark on enqueue, NOT on dequeue — prevents re-adds.
      if (!dist.has(nb)) {
        dist.set(nb, dist.get(node)! + 1);
        queue.push(nb);                   // enqueue back
      }
    }
  }
  return dist;
}

// To reconstruct the shortest path, store a \`parent\` map alongside \`dist\`
// and walk parents back from the target.
// Real-world use: ring buffer / Deque instead of \`shift()\` (O(1) vs O(n)).`,
  },

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, Chapter 22.2",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The canonical textbook treatment: BFS properties, shortest-paths proof, and the predecessor sub-graph.",
      kind: "book",
    },
    {
      label: "Edsger Dijkstra — *A note on two problems in connexion with graphs* (1959)",
      href: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD00xx/EWD46.html",
      note: "Dijkstra's three-page note that introduced the weighted shortest-path algorithm and, by elimination, framed BFS as its unweighted special case.",
      kind: "paper",
    },
    {
      label: "Skiena — *The Algorithm Design Manual*, BFS section",
      href: "https://www.algorist.com/",
      note: "Real-world war stories on when BFS is the right call — including 'how I solved this problem' anecdotes.",
      kind: "book",
    },
    {
      label: "VisuAlgo — BFS / DFS visualisation",
      href: "https://visualgo.net/en/dfsbfs",
      note: "Side-by-side animations of BFS and DFS on the same graph — great for cementing the queue-vs-stack difference.",
      kind: "article",
    },
    {
      label: "Pregel — Google's graph engine paper",
      href: "https://kowshik.github.io/JPregel/pregel_paper.pdf",
      note: "Why BFS-like 'superstep' iteration is the right shape for billion-node graphs and inspired Giraph, Spark GraphX, and modern graph databases.",
      kind: "paper",
    },
    {
      label: "Wikipedia — Breadth-first search",
      href: "https://en.wikipedia.org/wiki/Breadth-first_search",
      note: "Solid reference, with the bidirectional-BFS variant and a survey of historical applications.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "bfs-q1",
      question:
        "Why is BFS guaranteed to return the shortest path in an unweighted graph, but not in a weighted one?",
      options: [
        { id: "a", label: "Because BFS uses a stack, and the stack tracks distances." },
        { id: "b", label: "Because BFS sorts edges by weight before expanding them." },
        { id: "c", label: "Because BFS expands nodes in order of *number of edges* from the start — which equals shortest path only when every edge counts the same." },
        { id: "d", label: "Because BFS visits every node exactly once." },
      ],
      correctOptionId: "c",
      explanation:
        "BFS's queue enforces 'distance-by-edge-count' order: distance-1 nodes leave the queue before distance-2 nodes. That's the shortest-path distance only if every edge has weight 1. Once edges have different weights, a 2-hop path with cheap edges can beat a 1-hop path with an expensive edge — and BFS, which doesn't look at weights, would miss it. That's why Dijkstra exists.",
    },
    {
      id: "bfs-q2",
      question:
        "When should a node be marked as 'seen' so the same node isn't enqueued twice?",
      options: [
        { id: "a", label: "When it's dequeued." },
        { id: "b", label: "When it's enqueued." },
        { id: "c", label: "When its distance is finalised at the end of the algorithm." },
        { id: "d", label: "When the queue is empty." },
      ],
      correctOptionId: "b",
      explanation:
        "Mark on enqueue, not on dequeue. If you wait until a node is dequeued to mark it, you can enqueue it many times — once for each neighbour that sees it before it's dequeued — and the algorithm degrades to exponential time. The 'first time seen' is when its distance is finalised; that's when to mark it.",
    },
    {
      id: "bfs-q3",
      question:
        "On a graph with V nodes and E edges (adjacency list), what is BFS's time complexity?",
      options: [
        { id: "a", label: "O(V log V)" },
        { id: "b", label: "O(V²)" },
        { id: "c", label: "O(V + E)" },
        { id: "d", label: "O(E log V)" },
      ],
      correctOptionId: "c",
      explanation:
        "Each node is enqueued and dequeued at most once (O(V)). When a node is dequeued, we scan its adjacency list, summing to O(E) work total across all nodes. Together that's O(V + E). On an adjacency *matrix* it would be O(V²) because scanning each row is V work even for sparse nodes — one of the reasons adjacency lists are the default.",
    },
  ],
};
