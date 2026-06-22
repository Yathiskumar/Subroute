import type { ConceptContent } from "@/lib/content/types";

export const bellmanFord: ConceptContent = {
  prototypeCaption:
    "Five nodes, edges that include a negative weight. Press **Play** to watch Bellman-Ford relax every edge in every pass — V-1 passes total. **Step** / **Back** walk one edge-relaxation at a time. **Try neg-cycle** loads a graph with a negative cycle so the algorithm correctly flags it on the V-th pass.",

  overview: [
    {
      type: "p",
      text: "**Bellman-Ford answers the same question as Dijkstra — shortest paths from one source — but it works when edges can be negative.** It pays for that with speed: O(V · E) instead of O((V + E) log V). The algorithm isn't greedy, it's *patient*: it relaxes every edge in the graph, V-1 times.",
    },
    {
      type: "p",
      text: "The intuition is shortest paths in a graph with V nodes contain at most V-1 edges (any longer and they'd have to revisit a node — a cycle). After one full pass over every edge, every node 1 edge away from the source has its true distance. After two passes, every node ≤ 2 edges away does. After V-1 passes, every reachable node is settled — and if a V-th pass would still improve some distance, the graph contains a **negative cycle**.",
    },
    {
      type: "p",
      text: "That last property — *detecting* negative cycles — is what makes Bellman-Ford the go-to algorithm for currency-arbitrage detection, financial flow analysis, and distance-vector routing protocols like the old RIP. You don't reach for Bellman-Ford for speed; you reach for it when negative edges or cycle detection are on the menu.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The algorithm in four lines" },
    {
      type: "ol",
      items: [
        "Give every node a distance estimate. The start gets **0**, everyone else gets **∞**.",
        "Repeat V-1 times: for every edge `(u, v, w)`, if `dist[u] + w < dist[v]`, update `dist[v]`. (This is the same 'relax' step as Dijkstra.)",
        "Do one more pass — the V-th. If any distance still improves, a negative cycle is reachable from the source.",
        "Otherwise, `dist` holds the correct shortest distances.",
      ],
    },
    { type: "h", text: "Why V-1 passes are enough" },
    {
      type: "ul",
      items: [
        "Any shortest path has at most V-1 edges; with V nodes, any longer walk revisits a vertex and is either redundant (in a non-negative cycle) or worse than its acyclic version.",
        "After pass k, every shortest path that uses ≤ k edges has been correctly computed — because at some point during pass k, the right edges along that path got relaxed in the right order.",
        "After V-1 passes, every shortest path has been found. If a V-th pass *still* improves a distance, it's because there's a cycle that lowers the cost every time you go round — a negative cycle.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why Dijkstra is faster",
      text: "Dijkstra commits to one node per outer iteration — V outer iterations, each one log V work for the heap. Bellman-Ford has V-1 outer passes, each relaxing all E edges. The reason Dijkstra can do that — the cut-property argument — requires every edge ≥ 0. Bellman-Ford doesn't need that assumption, so it pays the V × E cost.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Negative cycle ≠ negative edge",
      text: "A graph can have negative edges and *still* have well-defined shortest paths — as long as no cycle has a negative total weight. Bellman-Ford handles negative edges correctly; it only fails when a *negative cycle* is reachable from the source, in which case shortest paths are undefined (you could walk the cycle infinitely and drive the cost to -∞).",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Negative edge weights** — the only classical SSSP algorithm that handles them correctly (with cycle detection).",
        "**Detecting negative cycles** — currency arbitrage (FX rate logs encoded as `-log(rate)`); financial flow analysis; constraint solvers.",
        "**Distance-vector routing protocols** — RIP and (informally) BGP both descend from Bellman-Ford: each router relaxes distance vectors from its neighbours.",
        "**Constraint systems** — 'this difference must be ≤ that one' constraints encode as edges; Bellman-Ford either finds a feasible solution or proves the constraints are unsatisfiable (negative cycle).",
        "**As a building block** — Johnson's all-pairs algorithm runs Bellman-Ford once to reweight the graph, then runs Dijkstra V times. Best of both worlds.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Non-negative weights** — use **Dijkstra**. Same answer, much faster: O((V + E) log V) beats O(V · E) for sparse graphs.",
        "**All pairs needed** — use **Floyd-Warshall** for small dense graphs (O(V³) is one big nested loop), or **Johnson's** for sparse graphs.",
        "**No weights** — use **BFS**. It's even faster: O(V + E), no relaxation, no priority queue.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Handles negative edges** — the only standard SSSP algorithm that does.",
      "**Detects negative cycles** — for free, on a single extra pass.",
      "**Simple** — two nested loops, no priority queue, no heap.",
      "**Distributed-friendly** — each node only needs to know its neighbours, which is why distance-vector routing protocols are built on it.",
      "**Predictable** — V-1 passes regardless of the graph shape; no worst-case blow-ups.",
    ],
    cons: [
      "**O(V · E)** — much slower than Dijkstra on non-negative graphs.",
      "**Doesn't use heaps** — and can't easily benefit from the 'process closest first' optimisation; that's what Dijkstra is for.",
      "**Slow convergence in distance-vector routing** — the 'count to infinity' problem; protocols use poison reverse and split horizon as workarounds.",
      "**No early termination** — must do V-1 passes even if shortest paths stabilise in one. (Some implementations check for 'no relaxations this pass' and exit early.)",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through V-1 passes",
      body: "Press **Play**. Watch the pass counter increment as every edge gets relaxed once per pass. Note how distances ratchet downward as the algorithm discovers shorter paths — particularly when a negative edge gets relaxed and propagates the improvement.",
    },
    {
      title: "02 · Step through one edge-relaxation at a time",
      body: "Hit **Step** to relax the next edge in the current pass. Look at the *Updated* counter — early passes update many distances; later passes update fewer. If a pass updates *nothing*, the algorithm could safely stop early (and the optimised form does).",
    },
    {
      title: "03 · Try neg-cycle to see detection in action",
      body: "Press **Try neg-cycle** to load a graph with a cycle whose edge weights sum to a negative number. Watch the algorithm complete V-1 passes normally, then on the V-th pass an edge still improves a distance — the prototype shows the *cycle detected* badge and halts. That extra pass is the entire negative-cycle test.",
    },
    {
      title: "04 · Compare convergence with Dijkstra",
      body: "Open Dijkstra in another window with the *same* graph (minus the negative edge). Notice: Dijkstra settles each node exactly once and is done in V iterations. Bellman-Ford has to relax every edge V-1 times — even on graphs where Dijkstra would work. That's the cost of supporting negatives.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "bellman-ford.ts",
      code: `// Bellman-Ford — single-source shortest paths.
// Handles negative edges; detects negative cycles.
type Edge = { from: string; to: string; w: number };

function bellmanFord(
  nodes: string[],
  edges: Edge[],
  start: string,
): Map<string, number> {
  const dist = new Map<string, number>();
  for (const u of nodes) dist.set(u, Infinity);
  dist.set(start, 0);

  // V-1 passes — every shortest path is found by the V-1'th pass.
  for (let i = 0; i < nodes.length - 1; i++) {
    let updated = false;
    for (const { from, to, w } of edges) {
      const nd = (dist.get(from) ?? Infinity) + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        updated = true;
      }
    }
    if (!updated) break;        // optimisation: settled early
  }

  // V-th pass: any further improvement means a reachable negative cycle.
  for (const { from, to, w } of edges) {
    if ((dist.get(from) ?? Infinity) + w < (dist.get(to) ?? Infinity)) {
      throw new Error("graph contains a negative cycle reachable from start");
    }
  }
  return dist;
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "BellmanFord.java",
      code: `import java.util.*;

// Bellman-Ford — single-source shortest paths.
// Handles negative edges; detects negative cycles.
record Edge(String from, String to, int w) {}

Map<String, Long> bellmanFord(List<String> nodes, List<Edge> edges, String start) {
    final long INF = Long.MAX_VALUE;
    Map<String, Long> dist = new HashMap<>();
    for (String u : nodes) dist.put(u, INF);
    dist.put(start, 0L);

    // V-1 passes — every shortest path is found by the V-1'th pass.
    for (int i = 0; i < nodes.size() - 1; i++) {
        boolean updated = false;
        for (Edge e : edges) {
            if (dist.get(e.from()) == INF) continue;   // unreachable, skip
            long nd = dist.get(e.from()) + e.w();
            if (nd < dist.get(e.to())) {
                dist.put(e.to(), nd);
                updated = true;
            }
        }
        if (!updated) break;    // optimisation: settled early
    }

    // V-th pass: any further improvement means a reachable negative cycle.
    for (Edge e : edges) {
        if (dist.get(e.from()) != INF
                && dist.get(e.from()) + e.w() < dist.get(e.to())) {
            throw new IllegalStateException(
                "graph contains a negative cycle reachable from start");
        }
    }
    return dist;
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "bellman_ford.py",
      code: `from math import inf


def bellman_ford(
    nodes: list[str],
    edges: list[tuple[str, str, int]],   # (from, to, weight)
    start: str,
) -> dict[str, float]:
    """Bellman-Ford — single-source shortest paths.
    Handles negative edges; detects negative cycles."""
    dist: dict[str, float] = {u: inf for u in nodes}
    dist[start] = 0

    # V-1 passes — every shortest path is found by the V-1'th pass.
    for _ in range(len(nodes) - 1):
        updated = False
        for frm, to, w in edges:
            nd = dist[frm] + w
            if nd < dist[to]:
                dist[to] = nd
                updated = True
        if not updated:
            break               # optimisation: settled early

    # V-th pass: any further improvement means a reachable negative cycle.
    for frm, to, w in edges:
        if dist[frm] + w < dist[to]:
            raise ValueError("graph contains a negative cycle reachable from start")
    return dist`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "bellman_ford.cpp",
      code: `// Bellman-Ford — single-source shortest paths.
// Handles negative edges; detects negative cycles.
#include <limits>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

struct Edge { std::string from, to; int w; };

std::unordered_map<std::string, long long> bellmanFord(
    const std::vector<std::string> &nodes,
    const std::vector<Edge> &edges,
    const std::string &start) {
    const long long INF = std::numeric_limits<long long>::max();
    std::unordered_map<std::string, long long> dist;
    for (const auto &u : nodes) dist[u] = INF;
    dist[start] = 0;

    // V-1 passes — every shortest path is found by the V-1'th pass.
    for (size_t i = 0; i + 1 < nodes.size(); i++) {
        bool updated = false;
        for (const auto &e : edges) {
            if (dist[e.from] == INF) continue;    // unreachable, skip
            long long nd = dist[e.from] + e.w;
            if (nd < dist[e.to]) {
                dist[e.to] = nd;
                updated = true;
            }
        }
        if (!updated) break;    // optimisation: settled early
    }

    // V-th pass: any further improvement means a reachable negative cycle.
    for (const auto &e : edges) {
        if (dist[e.from] != INF && dist[e.from] + e.w < dist[e.to]) {
            throw std::runtime_error(
                "graph contains a negative cycle reachable from start");
        }
    }
    return dist;
}`,
    },
  ],

  furtherReading: [
    {
      label: "Richard Bellman — *On a routing problem* (1958)",
      href: "https://www.rand.org/content/dam/rand/pubs/papers/2008/P1066.pdf",
      note: "The original RAND paper. Short, readable, and surprisingly modern in framing.",
      kind: "paper",
    },
    {
      label: "Lester Ford Jr. — *Network Flow Theory* (1956)",
      href: "https://www.rand.org/pubs/papers/P923.html",
      note: "Ford's earlier RAND paper that proposed the same relaxation idea — the algorithm is named for both authors.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, §24.1 (Bellman-Ford)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Textbook proof of correctness via the relaxation lemma, with the negative-cycle detection argument spelled out.",
      kind: "book",
    },
    {
      label: "RFC 2453 — Routing Information Protocol (RIP) Version 2",
      href: "https://datatracker.ietf.org/doc/html/rfc2453",
      note: "RIP is essentially distributed Bellman-Ford. The 'count-to-infinity' problem and the workarounds (split horizon, poison reverse) are direct consequences of the algorithm's update model.",
      kind: "spec",
    },
    {
      label: "Stanford CS 261 — Bellman-Ford and negative cycles",
      href: "https://web.stanford.edu/class/cs261/2024/notes/l3.pdf",
      note: "Lecture notes with a worked currency-arbitrage example and the Johnson's-algorithm extension to all-pairs.",
      kind: "article",
    },
    {
      label: "Wikipedia — Bellman-Ford algorithm",
      href: "https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm",
      note: "Solid reference, including the queue-based SPFA variant and the constraint-systems application.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "bf-q1",
      question: "Why does Bellman-Ford run for exactly V-1 passes?",
      options: [
        { id: "a", label: "Because each pass costs O(V), so V-1 passes give O(V²)." },
        { id: "b", label: "Because any shortest path has at most V-1 edges, and pass k correctly computes every shortest path of length ≤ k edges." },
        { id: "c", label: "Because the algorithm needs V iterations to overflow the heap." },
        { id: "d", label: "Because V-1 is the diameter of every graph." },
      ],
      correctOptionId: "b",
      explanation:
        "A shortest path can't have a cycle (negative cycles aside), so it has at most V-1 edges. After pass k, every shortest path with ≤ k edges has been fully relaxed in the right order. V-1 passes suffice. The V-th pass is the negative-cycle test.",
    },
    {
      id: "bf-q2",
      question:
        "On Bellman-Ford's V-th (extra) pass, an edge can still be relaxed. What does this mean?",
      options: [
        { id: "a", label: "There's a bug — the algorithm should have converged." },
        { id: "b", label: "The graph contains a negative cycle reachable from the source." },
        { id: "c", label: "The source node is unreachable." },
        { id: "d", label: "The graph has duplicate edges." },
      ],
      correctOptionId: "b",
      explanation:
        "If V-1 passes were enough for every acyclic shortest path and a V-th pass still finds an improvement, it's because some cycle is reachable that decreases the total cost every time you traverse it. That's the definition of a negative cycle — and it means shortest paths to nodes reachable via that cycle are -∞ (undefined).",
    },
    {
      id: "bf-q3",
      question:
        "Why is Bellman-Ford O(V · E) while Dijkstra is O((V + E) log V)?",
      options: [
        { id: "a", label: "Because Bellman-Ford uses a slower data structure." },
        { id: "b", label: "Because Bellman-Ford relaxes every edge V-1 times, while Dijkstra commits to one node per outer iteration." },
        { id: "c", label: "Because Bellman-Ford doesn't use recursion." },
        { id: "d", label: "Because Bellman-Ford computes more than shortest paths." },
      ],
      correctOptionId: "b",
      explanation:
        "Dijkstra exploits the cut property — given non-negative edges, the closest unsettled node has its final distance — so it commits one node per iteration and never revisits. Bellman-Ford can't make that commitment when negatives are allowed, so it has to relax every edge V-1 times. The price of negative-edge support is the V-1 vs log-V factor.",
    },
  ],
};
