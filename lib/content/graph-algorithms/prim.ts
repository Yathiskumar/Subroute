import type { ConceptContent } from "@/lib/content/types";

export const prim: ConceptContent = {
  prototypeCaption:
    "Eight nodes, ten weighted edges, and a min-priority queue. Press **Play** to watch Prim grow the MST from a seed node, always pulling in the cheapest edge that reaches a new vertex. **Step** / **Back** advance one node-addition at a time. **Start** picks a different seed so you can confirm the MST cost stays the same.",

  overview: [
    {
      type: "p",
      text: "**Prim's algorithm grows a Minimum Spanning Tree from a single seed.** Where Kruskal sorts all edges up front and walks them globally, Prim starts at one node and keeps pulling in the cheapest edge from the current tree to a new outside node. It's literally Dijkstra's algorithm with a different key — instead of 'distance from source,' the key is 'cheapest edge connecting this node to the current tree.'",
    },
    {
      type: "p",
      text: "The algorithm: pick any starting node and put it in the tree. Maintain a min-priority queue of *every edge crossing the cut* between the tree and the rest of the graph. Pop the cheapest such edge — that edge connects the tree to one new node. Add the new node to the tree, push its outgoing edges into the queue. Repeat until the tree has V nodes (or V-1 edges).",
    },
    {
      type: "p",
      text: "Prim's and Kruskal's both compute MSTs and both are justified by the cut property — but they explore the graph in opposite directions. Kruskal considers edges globally, in weight order. Prim grows a connected region locally, like ink spreading on paper. For dense graphs, Prim's tighter local frontier wins. For sparse graphs, Kruskal's global sort wins.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The algorithm in five lines" },
    {
      type: "ol",
      items: [
        "Put any starting node `s` into the tree. Mark it visited.",
        "Push every edge `(s, v, w)` into a min-priority queue keyed by `w`.",
        "Loop: pop the cheapest edge `(u, v, w)` from the queue. If `v` is already in the tree, discard the edge (it would form a cycle). Otherwise add `v` to the tree and add `(u, v)` to the MST.",
        "Push every edge from the newly-added `v` to an outside node into the queue.",
        "Stop when the tree has V nodes.",
      ],
    },
    { type: "h", text: "Why the greedy choice is safe (same cut property)" },
    {
      type: "ul",
      items: [
        "At each step, the 'cut' is (tree nodes, outside nodes). The priority queue's minimum is the cheapest edge crossing that cut.",
        "**Cut property**: the cheapest edge crossing any cut is in *some* MST. So adding it is safe.",
        "After V-1 such additions, every node is in the tree and you have an MST.",
        "Same property that justifies Kruskal — Prim just considers cuts in a fixed order (always 'tree vs. outside') instead of Kruskal's 'whichever two components this edge bridges'.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Prim's vs Dijkstra's",
      text: "Both are 'pop the cheapest frontier edge, add the node, push its new edges' algorithms. The only difference is the **priority**: Dijkstra uses distance-from-source `dist[u] + w(u,v)`, Prim uses just the edge weight `w(u,v)`. That's why Prim doesn't care about path length — only the cost of the one new edge.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Eager Prim removes stale entries",
      text: "The straight 'push edge per neighbour' implementation can have multiple entries for the same destination node. **Eager Prim** keeps only the cheapest current edge to each outside node — slightly more code, but the heap shrinks from O(E) to O(V), giving O(E log V) instead of O(E log E). Most production implementations use the eager form.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Dense graphs** — Prim with an array-based key is O(V²), which beats Kruskal's O(E log E) ≈ O(V² log V) when E ≈ V².",
        "**You have a natural seed node** — network design from a hub, dendrogram clustering from a centroid, mesh generation around a vertex.",
        "**You don't have the whole edge set up front** — Prim only needs each node's outgoing edges as that node enters the tree, so it works on graphs with a 'lazy-load' adjacency list.",
        "**Inside Dijkstra-flavoured infrastructure** — if you've already got a binary heap and a relaxation loop, Prim is one line change away.",
        "**As a sub-step in approximation algorithms** — the 2-approximation for metric Steiner tree starts with an MST built via Prim.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Sparse graphs** — use **Kruskal**. Its O(E log E) is dominated by the sort, which is fine when E is small.",
        "**Edges already sorted** — Kruskal can skip the sort and run in O(E · α(V)).",
        "**You need to detect cycles for *other* reasons too** — Kruskal's DSU gives you connected components for free.",
        "**You only need part of the MST** — Kruskal-with-early-stop is simpler if you want the K cheapest tree edges.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**O((V + E) log V)** with a binary heap, O(V²) with an array — well-suited to dense graphs.",
      "**Grows locally** — useful when you want the partial tree at any point, e.g. visualisations or incremental layouts.",
      "**No DSU needed** — just a visited set and a priority queue.",
      "**Dijkstra-shaped** — easy to layer on top of existing shortest-path code.",
      "**Eager variant** has the lowest priority-queue churn of the MST algorithms.",
    ],
    cons: [
      "**Needs a heap and a visited set** — more bookkeeping than Kruskal's DSU.",
      "**Less natural for streaming edges** — Prim wants to know each node's full neighbourhood as that node is added.",
      "**Tie-handling depends on heap order** — same caveat as Kruskal: non-unique MSTs are visited in different orders.",
      "**Seed-dependent visit order** — the final MST is the same, but the path the algorithm took to build it varies. Debugging is harder.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through one MST build",
      body: "Press **Play** from the default seed. Watch the tree grow ring-by-ring: each step, the cheapest cut-crossing edge fires and pulls in one new node. The heap on the right reorders as new edges enter and stale ones get skipped.",
    },
    {
      title: "02 · Step through one cut-edge at a time",
      body: "Hit **Step** to pop the next cheapest edge from the heap. If both endpoints are already in the tree, the prototype shows the *skip* badge (stale entry). Otherwise the new node joins the tree. **Back** rewinds the addition.",
    },
    {
      title: "03 · Try a different seed node",
      body: "Switch **Start** from A to F. The growth path and the order of node additions change completely — but check the *Total weight* stat: it stays the same. The MST is structurally fixed by the edge weights; the seed only changes the build order.",
    },
    {
      title: "04 · Compare with Kruskal",
      body: "Open Kruskal on the same graph. You'll see the same set of edges chosen (assuming unique weights), in a totally different order: Kruskal walks cheapest-first regardless of location; Prim walks cheapest-from-the-current-frontier. Same destination, different path.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "prim.ts",
      code: `// Prim's MST — lazy variant with a binary heap.
// Push every cut-crossing edge; skip stale entries on pop.
type Edge = { to: number; w: number };
type HeapEntry = [number, number, number];   // [weight, from, to]

function prim(graph: Map<number, Edge[]>, start: number): HeapEntry[] {
  const inTree = new Set<number>([start]);
  const heap: HeapEntry[] = [];

  // Seed: push every edge from start.
  for (const { to, w } of graph.get(start) ?? []) heap.push([w, start, to]);
  heap.sort((a, b) => a[0] - b[0]);   // real code: min-heap

  const mst: HeapEntry[] = [];
  while (heap.length > 0 && mst.length < graph.size - 1) {
    const e = heap.shift()!;          // real code: heap.pop()
    const [w, u, v] = e;
    if (inTree.has(v)) continue;      // stale — cycle would form

    inTree.add(v);
    mst.push(e);

    // Push every edge from v to a not-yet-in-tree node.
    for (const { to, w: ew } of graph.get(v) ?? []) {
      if (!inTree.has(to)) {
        heap.push([ew, v, to]);
        heap.sort((a, b) => a[0] - b[0]);    // real code: heap.push()
      }
    }
  }
  return mst;
}

// Real implementations: replace shift/sort with a proper binary heap
// (Python: heapq, Java: PriorityQueue, C++: priority_queue with reverse comparator).
// Eager variant: keep only the cheapest current edge per outside node — O(V) heap entries.`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Prim.java",
      code: `import java.util.*;

// Prim's MST — lazy variant with a binary heap.
// Push every cut-crossing edge; skip stale entries on pop.
record Edge(int to, int w) {}

// Heap entry [weight, from, to]; PriorityQueue keeps it a real min-heap.
List<int[]> prim(Map<Integer, List<Edge>> graph, int start) {
    Set<Integer> inTree = new HashSet<>();
    inTree.add(start);
    PriorityQueue<int[]> heap =
        new PriorityQueue<>(Comparator.comparingInt(e -> e[0]));

    // Seed: push every edge from start.
    for (Edge e : graph.getOrDefault(start, List.of()))
        heap.add(new int[]{e.w(), start, e.to()});

    List<int[]> mst = new ArrayList<>();
    while (!heap.isEmpty() && mst.size() < graph.size() - 1) {
        int[] e = heap.poll();        // heap.pop()
        int v = e[2];
        if (inTree.contains(v)) continue;   // stale — cycle would form

        inTree.add(v);
        mst.add(e);

        // Push every edge from v to a not-yet-in-tree node.
        for (Edge nx : graph.getOrDefault(v, List.of())) {
            if (!inTree.contains(nx.to())) {
                heap.add(new int[]{nx.w(), v, nx.to()});   // heap.push()
            }
        }
    }
    return mst;
}

// PriorityQueue is the proper binary heap.
// Eager variant: keep only the cheapest current edge per outside node — O(V) heap entries.`,
    },
    {
      label: "Python",
      language: "python",
      filename: "prim.py",
      code: `import heapq


def prim(graph: dict[int, list[tuple[int, int]]], start: int) -> list[tuple[int, int, int]]:
    """Prim's MST — lazy variant with a binary heap.
    Push every cut-crossing edge; skip stale entries on pop.
    graph maps node -> list of (to, weight); returns (weight, from, to) tuples."""
    in_tree: set[int] = {start}
    heap: list[tuple[int, int, int]] = []   # (weight, from, to) — heapq keeps it sorted

    # Seed: push every edge from start.
    for to, w in graph.get(start, []):
        heapq.heappush(heap, (w, start, to))

    mst: list[tuple[int, int, int]] = []
    while heap and len(mst) < len(graph) - 1:
        w, u, v = heapq.heappop(heap)       # heap.pop()
        if v in in_tree:
            continue                        # stale — cycle would form

        in_tree.add(v)
        mst.append((w, u, v))

        # Push every edge from v to a not-yet-in-tree node.
        for to, ew in graph.get(v, []):
            if to not in in_tree:
                heapq.heappush(heap, (ew, v, to))   # heap.push()
    return mst


# heapq is the proper binary heap.
# Eager variant: keep only the cheapest current edge per outside node — O(V) heap entries.`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "prim.cpp",
      code: `// Prim's MST — lazy variant with a binary heap.
// Push every cut-crossing edge; skip stale entries on pop.
#include <array>
#include <functional>
#include <queue>
#include <unordered_map>
#include <unordered_set>
#include <vector>

struct Edge { int to, w; };

// Heap entry [weight, from, to]; tuple ordering sorts by weight first.
using Entry = std::array<int, 3>;

std::vector<Entry> prim(
    const std::unordered_map<int, std::vector<Edge>> &graph, int start) {
    std::unordered_set<int> inTree{start};
    // Min-heap via greater comparator on the weight (entry[0]).
    auto cmp = [](const Entry &a, const Entry &b) { return a[0] > b[0]; };
    std::priority_queue<Entry, std::vector<Entry>, decltype(cmp)> heap(cmp);

    // Seed: push every edge from start.
    auto sit = graph.find(start);
    if (sit != graph.end())
        for (const auto &e : sit->second) heap.push({e.w, start, e.to});

    std::vector<Entry> mst;
    while (!heap.empty() && static_cast<int>(mst.size()) < static_cast<int>(graph.size()) - 1) {
        Entry e = heap.top();         // heap.pop()
        heap.pop();
        int v = e[2];
        if (inTree.count(v)) continue;   // stale — cycle would form

        inTree.insert(v);
        mst.push_back(e);

        // Push every edge from v to a not-yet-in-tree node.
        auto vit = graph.find(v);
        if (vit != graph.end())
            for (const auto &nx : vit->second)
                if (!inTree.count(nx.to)) heap.push({nx.w, v, nx.to});  // heap.push()
    }
    return mst;
}

// priority_queue with a greater comparator is the proper binary min-heap.
// Eager variant: keep only the cheapest current edge per outside node — O(V) heap entries.`,
    },
  ],

  furtherReading: [
    {
      label: "Robert Prim — *Shortest connection networks and some generalizations* (1957)",
      href: "https://archive.org/details/bstj36-6-1389",
      note: "The original Bell Labs paper. Predates Dijkstra's 1959 paper but uses essentially the same algorithm shape.",
      kind: "paper",
    },
    {
      label: "Vojtěch Jarník — *O jistém problému minimálním* (1930)",
      href: "https://dml.cz/handle/10338.dmlcz/500726",
      note: "Jarník's 1930 paper described the same algorithm 27 years before Prim — which is why it's sometimes called the Jarník-Prim algorithm.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, §23.2 (Prim's)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Textbook treatment alongside Kruskal's, with the cut-property proof and the array vs heap implementation tradeoff.",
      kind: "book",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms*, §4.3 (MSTs, eager vs lazy Prim)",
      href: "https://algs4.cs.princeton.edu/43mst/",
      note: "Detailed comparison of lazy and eager Prim implementations with measured performance numbers.",
      kind: "article",
    },
    {
      label: "Tarjan — *Data Structures and Network Algorithms* (1983)",
      href: "https://epubs.siam.org/doi/book/10.1137/1.9781611970265",
      note: "Treats Prim, Kruskal, and Borůvka uniformly via the cut/cycle property. Includes the Fredman-Tarjan O(E log* V) algorithm.",
      kind: "book",
    },
    {
      label: "Wikipedia — Prim's algorithm",
      href: "https://en.wikipedia.org/wiki/Prim%27s_algorithm",
      note: "Solid reference with the parallel variants (Borůvka-style) and historical attribution.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "pr-q1",
      question:
        "What's the structural difference between Prim's and Dijkstra's algorithms?",
      options: [
        { id: "a", label: "Dijkstra uses a stack; Prim uses a queue." },
        { id: "b", label: "They have the same skeleton — pop the cheapest frontier edge, add the node, push its new edges — but Dijkstra's priority is `dist[u] + w(u, v)`, while Prim's is just `w(u, v)`." },
        { id: "c", label: "Prim's allows negative edges, Dijkstra's doesn't." },
        { id: "d", label: "Dijkstra needs an undirected graph, Prim's needs a directed one." },
      ],
      correctOptionId: "b",
      explanation:
        "Same algorithmic shape, different priority. Dijkstra's priority is total distance from the source — so paths get extended. Prim's priority is just the edge weight — so only the cost of crossing one cut matters. That's why Prim's makes a *tree* and Dijkstra's makes shortest *paths*.",
    },
    {
      id: "pr-q2",
      question:
        "Prim's algorithm computes the same MST regardless of the starting node. Why?",
      options: [
        { id: "a", label: "Because all starting nodes have the same neighbours." },
        { id: "b", label: "Because the MST is determined by the edge weights, and the cut property says the cheapest edge across any cut belongs to *some* MST — so any safe sequence of cut-greedy choices produces the same set of edges (assuming unique weights)." },
        { id: "c", label: "Because Prim's randomises the seed internally." },
        { id: "d", label: "Because Dijkstra's start-independence proves it." },
      ],
      correctOptionId: "b",
      explanation:
        "If all edge weights are distinct, the MST is unique — and Prim's, Kruskal's, and Borůvka's all produce it. With distinct weights, the cut property gives only one safe choice per step, so any greedy MST algorithm converges. With ties, the chosen edges can differ but the total cost can't.",
    },
    {
      id: "pr-q3",
      question:
        "When pop returns an edge (u, v) whose destination `v` is already in the tree, what does the algorithm do?",
      options: [
        { id: "a", label: "Add it to the MST anyway." },
        { id: "b", label: "Halt — something is wrong." },
        { id: "c", label: "Skip it (stale entry; adding it would form a cycle), then pop the next one." },
        { id: "d", label: "Reverse the edge direction and try again." },
      ],
      correctOptionId: "c",
      explanation:
        "In lazy Prim's, the heap can contain multiple edges to the same outside node — and once the node enters the tree via the cheapest one, the others become stale. The fix is to check `if (inTree.has(v)) continue` on pop. This is the same lazy-deletion pattern Dijkstra uses for stale distance entries.",
    },
  ],
};
