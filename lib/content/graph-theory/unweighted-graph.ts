import type { ConceptContent } from "@/lib/content/types";

export const unweightedGraph: ConceptContent = {
  prototypeCaption:
    "A seven-vertex undirected, unweighted graph across four tabs. **Distance = hops** runs a BFS from a source and labels every vertex with its hop-distance `d=k`, ring by ring; **Fewest hops wins** picks a start and target and highlights the path with the fewest edges; **A shortcut shrinks it** takes a 3-hop path, adds one shortcut edge, and re-runs to watch the distance drop to 2. **Free play** lets you click two vertices to toggle an edge, drag vertices, pick a source to recompute every `d=k` label live, and switch to Find-path mode — the live *max distance* stat tracks the farthest vertex.",

  overview: [
    {
      type: "p",
      text: "**An unweighted graph is one where every edge counts the same.** There is no number on a line saying 'this hop costs 5 and that one costs 1' — an edge is either there or it isn't. That single property has a surprisingly large consequence: the *length* of a path is simply how many edges it uses, and 'the shortest path' means nothing more than 'the path with the fewest hops'. Distance becomes a pure count.",
    },
    {
      type: "p",
      text: "Because cost is uniform, you don't need a fancy algorithm to find shortest paths — a plain **breadth-first search** reads distance straight off the graph. BFS sweeps outward in rings: everything one hop from the source, then everything two hops away, then three. The first time it reaches a vertex, the number of rings it has crossed *is* that vertex's shortest distance. No edge weight to compare, nothing to relax, nothing to optimise except the hop count itself.",
    },
    {
      type: "p",
      text: "This is the right model whenever the connections are equivalent and you only care about reachability and degrees of separation. Friends-of-friends on a social network, fewest clicks between two web pages, fewest moves in a puzzle where every move is one move. The moment some edges genuinely cost more than others — kilometres on a road, dollars on a flight, latency on a link — you've left unweighted territory and need a weighted graph plus Dijkstra. Until then, every hop is one hop, and BFS is all you need.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Why 'shortest' collapses to 'fewest edges'" },
    {
      type: "ul",
      items: [
        "**Every edge has the same weight — call it 1.** So the cost of a path is just its number of edges. A 3-edge path costs 3; a 2-edge path costs 2; 2 always beats 3.",
        "There is *nothing to optimise but the count* — no clever combination of cheap-but-many vs expensive-but-few edges, because there is no 'expensive'. Fewer edges is unconditionally better.",
        "**A vertex's distance `d` is the number of hops on the fewest-edge path back to the source.** The source itself is `d=0`; its neighbours are `d=1`; their new neighbours are `d=2`, and so on.",
        "Distance is **purely structural** — it depends only on which edges exist, not on any number attached to them. Change the edges and the distances recompute; that's it.",
      ],
    },
    { type: "h", text: "Why BFS reads distance off directly" },
    {
      type: "ol",
      items: [
        "Put the source in a queue with `d=0`. The queue holds the current frontier.",
        "Dequeue a vertex `u`. For each neighbour `v` you haven't seen, set `d(v) = d(u) + 1` and enqueue it.",
        "Because the queue is FIFO, vertices come out in **non-decreasing distance order**: all the `d=1` vertices before any `d=2` vertex, all the `d=2` before any `d=3`.",
        "**So the first time a vertex is seen, the distance you assign it is already the smallest possible** — any shorter route would have reached it on an earlier ring. First-seen = shortest.",
        "When the queue empties, every reachable vertex carries its hop-distance, and any unreached vertex is in a different component.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "First-seen = shortest only because edges are equal",
      text: "The whole 'first time we reach it is the shortest' guarantee rests on uniform edge cost. If one edge were 'longer' than another, a vertex reached early via a long edge could later be reached more cheaply via two short ones — and BFS, which doesn't look at weights, would already have locked in the wrong distance. That is exactly the case Dijkstra's algorithm exists to handle. On an unweighted graph, BFS *is* Dijkstra with every weight pinned to 1.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Adding an edge can only shrink distances",
      text: "Distance is the *minimum* over all paths. Adding an edge gives you a new possible path without removing any old ones, so no distance can ever go up — it can only stay the same or drop. A 'shortcut' edge between two far-apart vertices is the dramatic case: a 3-hop path can collapse to 2 the instant the shortcut appears. Removing an edge is the mirror image — distances can only grow, or a vertex can fall out of reach entirely.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Model it as unweighted when" },
    {
      type: "ul",
      items: [
        "**Every connection is equivalent** — a friendship is a friendship, a hyperlink is a hyperlink; none is 'worth more' than another.",
        "**You're counting degrees of separation** — fewest hops between two people, fewest clicks between two pages, fewest moves in a puzzle where each move is one move.",
        "**You only care about reachability and structure** — 'can I get there at all?' and 'how many steps away is it?' rather than 'how expensive is the route?'.",
        "**You want the cheapest correct shortest-path code** — on an unweighted graph BFS gives exact answers in O(V + E) with no priority queue, no weight comparisons.",
      ],
    },
    { type: "h", text: "Reach for a weighted graph instead when" },
    {
      type: "ul",
      items: [
        "**Edges genuinely cost different amounts** — kilometres of road, dollars of airfare, milliseconds of latency, bandwidth on a link.",
        "**A longer-hop route can be cheaper** — three short roads beating one long highway is invisible to BFS but is the whole point of Dijkstra.",
        "**You're trading off quantity against cost** — when 'fewer edges' and 'cheaper total' can disagree, hop count is the wrong objective and you need real weights.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Shortest path is trivial** — fewest edges, full stop; a single BFS reads every distance off in one O(V + E) pass.",
      "**No priority queue, no weight bookkeeping** — just a FIFO queue and a visited set; the simplest correct shortest-path algorithm there is.",
      "**Distance is intuitive** — 'three hops away' is exactly the degrees-of-separation number people already reason about.",
      "**Robust to edits** — adding edges can only shrink distances, removing them can only grow distances; the model is easy to reason about as the graph changes.",
    ],
    cons: [
      "**Can't express real cost** — a one-hop transatlantic flight and a one-hop bus ride look identical, which is wrong whenever distance or price matters.",
      "**Fewest-hops is sometimes the wrong objective** — the route with the fewest edges can be the slowest or most expensive once edges differ.",
      "**No tie-breaking signal** — many shortest paths can have the same hop count and the model gives you no reason to prefer one.",
      "**Migrating to weighted is a real change** — once weights appear you must swap BFS for Dijkstra (or 0-1 BFS / A*); the easy guarantee doesn't survive.",
    ],
  },

  handsOn: [
    {
      title: "01 · Distance = hops",
      body: "On the **Distance = hops** tab, press **Play** to run BFS from the source. Watch the rings light up: the source gets `d=0`, its neighbours `d=1`, theirs `d=2`. Each vertex is labelled with its hop-distance the moment it's first seen — and the narration reminds you that because every edge is weight-1, *first time seen IS the shortest distance*. The side panel shows the BFS queue (front → back) so you can see vertices leaving in non-decreasing distance order. Use **Step** / **Back** to move one dequeue at a time.",
    },
    {
      title: "02 · Fewest hops wins",
      body: "Switch to **Fewest hops wins**. The prototype picks a start and a target and runs BFS to find the path with the **fewest edges**, highlighting it in orange. The narration makes the key point: with all edges equal there is nothing to optimise but the *count* — so 'shortest' here just means 'fewest hops'. The side panel lists the path vertices; note its edge count, the only number that matters.",
    },
    {
      title: "03 · A shortcut shrinks it",
      body: "On **A shortcut shrinks it**, Play to see a **3-hop** shortest path between two vertices. Then the prototype *adds a shortcut edge* between two non-adjacent vertices on that path and re-runs BFS — and the distance drops to **2**. The before/after side panel makes it explicit. The lesson: distance is purely structural (hop count), recomputed the instant the edge set changes — adding an edge can only shrink it.",
    },
    {
      title: "04 · Free play — recompute distance live",
      body: "Open **Free play**. Click any two vertices to toggle an edge; drag vertices to rearrange. Pick a **source** and every vertex's `d=k` label recomputes live — watch the *max distance* stat (the farthest any vertex sits from the source) shift as you add and remove edges. Add a shortcut and watch labels drop; cut an edge and watch them climb or turn to `∞` as vertices fall out of reach. Switch to **Find path** mode to trace the fewest-hops route between any two vertices you choose.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "unweighted-graph.ts",
      code: `// In an unweighted graph every edge costs the same, so "shortest path"
// means "fewest edges" — and BFS reads the distance off directly.
class UnweightedGraph {
  private adj = new Map<string, Set<string>>();

  addEdge(u: string, v: string) {
    if (!this.adj.has(u)) this.adj.set(u, new Set());
    if (!this.adj.has(v)) this.adj.set(v, new Set());
    this.adj.get(u)!.add(v);   // undirected: both directions
    this.adj.get(v)!.add(u);
  }

  // Hop-distance from \`source\` to every reachable vertex.
  // First time a vertex is dequeued-into = its shortest distance,
  // because the FIFO queue hands out vertices in distance order.
  distances(source: string): Map<string, number> {
    const dist = new Map<string, number>([[source, 0]]);
    const queue: string[] = [source];
    while (queue.length) {
      const u = queue.shift()!;            // front of the frontier
      for (const v of this.adj.get(u) ?? []) {
        if (!dist.has(v)) {                // first sighting = shortest
          dist.set(v, dist.get(u)! + 1);   // every edge adds exactly 1
          queue.push(v);
        }
      }
    }
    return dist;                           // missing key => unreachable (∞)
  }

  // The fewest-edge path itself, reconstructed from a parent map.
  shortestPath(source: string, target: string): string[] | null {
    const prev = new Map<string, string | null>([[source, null]]);
    const queue = [source];
    while (queue.length) {
      const u = queue.shift()!;
      if (u === target) break;
      for (const v of this.adj.get(u) ?? []) {
        if (!prev.has(v)) { prev.set(v, u); queue.push(v); }
      }
    }
    if (!prev.has(target)) return null;    // different component
    const path: string[] = [];
    for (let c: string | null = target; c !== null; c = prev.get(c)!) path.unshift(c);
    return path;                           // path.length - 1 === hop count
  }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "UnweightedGraph.java",
      code: `// In an unweighted graph every edge costs the same, so "shortest path"
// means "fewest edges" — and BFS reads the distance off directly.
import java.util.*;

class UnweightedGraph {
    private final Map<String, Set<String>> adj = new HashMap<>();

    void addEdge(String u, String v) {
        adj.putIfAbsent(u, new LinkedHashSet<>());
        adj.putIfAbsent(v, new LinkedHashSet<>());
        adj.get(u).add(v);   // undirected: both directions
        adj.get(v).add(u);
    }

    // Hop-distance from source to every reachable vertex.
    // First time a vertex is dequeued-into = its shortest distance,
    // because the FIFO queue hands out vertices in distance order.
    Map<String, Integer> distances(String source) {
        Map<String, Integer> dist = new HashMap<>();
        dist.put(source, 0);
        Deque<String> queue = new ArrayDeque<>();
        queue.add(source);
        while (!queue.isEmpty()) {
            String u = queue.poll();              // front of the frontier
            for (String v : adj.getOrDefault(u, Set.of())) {
                if (!dist.containsKey(v)) {        // first sighting = shortest
                    dist.put(v, dist.get(u) + 1);  // every edge adds exactly 1
                    queue.add(v);
                }
            }
        }
        return dist;                              // missing key => unreachable
    }

    // The fewest-edge path itself, reconstructed from a parent map.
    List<String> shortestPath(String source, String target) {
        Map<String, String> prev = new HashMap<>();
        prev.put(source, null);
        Deque<String> queue = new ArrayDeque<>();
        queue.add(source);
        while (!queue.isEmpty()) {
            String u = queue.poll();
            if (u.equals(target)) break;
            for (String v : adj.getOrDefault(u, Set.of())) {
                if (!prev.containsKey(v)) { prev.put(v, u); queue.add(v); }
            }
        }
        if (!prev.containsKey(target)) return null;   // different component
        LinkedList<String> path = new LinkedList<>();
        for (String c = target; c != null; c = prev.get(c)) path.addFirst(c);
        return path;                              // path.size() - 1 == hop count
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "unweighted_graph.py",
      code: `from collections import deque


class UnweightedGraph:
    """In an unweighted graph every edge costs the same, so "shortest path"
    means "fewest edges" — and BFS reads the distance off directly.
    """

    def __init__(self) -> None:
        self.adj: dict[str, set[str]] = {}

    def add_edge(self, u: str, v: str) -> None:
        self.adj.setdefault(u, set())
        self.adj.setdefault(v, set())
        self.adj[u].add(v)   # undirected: both directions
        self.adj[v].add(u)

    def distances(self, source: str) -> dict[str, int]:
        # Hop-distance from source to every reachable vertex.
        # First time a vertex is dequeued-into = its shortest distance,
        # because the FIFO queue hands out vertices in distance order.
        dist = {source: 0}
        queue = deque([source])
        while queue:
            u = queue.popleft()              # front of the frontier
            for v in self.adj.get(u, ()):
                if v not in dist:            # first sighting = shortest
                    dist[v] = dist[u] + 1    # every edge adds exactly 1
                    queue.append(v)
        return dist                          # missing key => unreachable (inf)

    def shortest_path(self, source: str, target: str) -> list[str] | None:
        # The fewest-edge path itself, reconstructed from a parent map.
        prev: dict[str, str | None] = {source: None}
        queue = deque([source])
        while queue:
            u = queue.popleft()
            if u == target:
                break
            for v in self.adj.get(u, ()):
                if v not in prev:
                    prev[v] = u
                    queue.append(v)
        if target not in prev:
            return None                      # different component
        path: list[str] = []
        c: str | None = target
        while c is not None:
            path.insert(0, c)
            c = prev[c]
        return path                          # len(path) - 1 == hop count`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "unweighted_graph.cpp",
      code: `// In an unweighted graph every edge costs the same, so "shortest path"
// means "fewest edges" — and BFS reads the distance off directly.
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <queue>
#include <algorithm>

class UnweightedGraph {
    std::unordered_map<std::string, std::unordered_set<std::string>> adj_;

public:
    void addEdge(const std::string& u, const std::string& v) {
        adj_[u].insert(v);   // undirected: both directions
        adj_[v].insert(u);
    }

    // Hop-distance from source to every reachable vertex.
    // First time a vertex is dequeued-into = its shortest distance,
    // because the FIFO queue hands out vertices in distance order.
    std::unordered_map<std::string, int> distances(const std::string& source) const {
        std::unordered_map<std::string, int> dist{{source, 0}};
        std::queue<std::string> queue;
        queue.push(source);
        while (!queue.empty()) {
            std::string u = queue.front();          // front of the frontier
            queue.pop();
            auto it = adj_.find(u);
            if (it == adj_.end()) continue;
            for (const auto& v : it->second) {
                if (!dist.count(v)) {               // first sighting = shortest
                    dist[v] = dist[u] + 1;          // every edge adds exactly 1
                    queue.push(v);
                }
            }
        }
        return dist;                                // missing key => unreachable
    }

    // The fewest-edge path itself, reconstructed from a parent map.
    // Returns an empty vector if the target is unreachable.
    std::vector<std::string> shortestPath(const std::string& source,
                                          const std::string& target) const {
        std::unordered_map<std::string, std::string> prev;
        prev[source] = source;                      // start is its own predecessor
        std::queue<std::string> queue;
        queue.push(source);
        while (!queue.empty()) {
            std::string u = queue.front();
            queue.pop();
            if (u == target) break;
            auto it = adj_.find(u);
            if (it == adj_.end()) continue;
            for (const auto& v : it->second) {
                if (!prev.count(v)) { prev[v] = u; queue.push(v); }
            }
        }
        if (!prev.count(target)) return {};         // different component
        std::vector<std::string> path;
        for (std::string c = target; ; c = prev[c]) {
            path.push_back(c);
            if (c == source) break;
        }
        std::reverse(path.begin(), path.end());
        return path;                                // path.size() - 1 == hop count
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, §22.2 (Breadth-First Search)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The formal proof that BFS computes shortest-path distances when every edge has the same cost, plus the predecessor sub-graph.",
      kind: "book",
    },
    {
      label: "Wikipedia — Shortest path problem",
      href: "https://en.wikipedia.org/wiki/Shortest_path_problem",
      note: "Frames the unweighted case as the special version where every edge weight is 1 and BFS suffices — no Dijkstra needed.",
      kind: "article",
    },
    {
      label: "Wikipedia — Breadth-first search",
      href: "https://en.wikipedia.org/wiki/Breadth-first_search",
      note: "Why the FIFO frontier yields distances in increasing-hop order, with the shortest-path and bidirectional variants.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Single-Source Shortest Paths (BFS on unweighted graphs)",
      href: "https://visualgo.net/en/sssp",
      note: "Interactive animation: run BFS and watch the distance field fill ring by ring on a graph you can edit.",
      kind: "video",
    },
    {
      label: "Khan Academy — Breadth-first search and its uses",
      href: "https://www.khanacademy.org/computing/computer-science/algorithms/breadth-first-search/a/breadth-first-search-and-its-uses",
      note: "A gentle, example-driven walk through using BFS to find the fewest-edges path in an unweighted graph.",
      kind: "article",
    },
    {
      label: "Skiena — *The Algorithm Design Manual*, Ch. 5 (Graph Traversal)",
      href: "https://www.algorist.com/",
      note: "Practical guidance on when fewest-hops is the right objective and when you must switch to weighted shortest paths.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "uwg-q1",
      question:
        "In an unweighted graph, what does the 'shortest path' between two vertices mean?",
      options: [
        { id: "a", label: "The path that touches the fewest *vertices*, regardless of edges." },
        { id: "b", label: "The path with the fewest *edges* (hops), since every edge counts the same." },
        { id: "c", label: "The path whose edges have the smallest total weight." },
        { id: "d", label: "The path found by the lowest-numbered vertices first." },
      ],
      correctOptionId: "b",
      explanation:
        "Because every edge has the same cost, a path's length is simply its number of edges. So 'shortest' collapses to 'fewest hops' — there is no weight to add up. Option C describes the weighted case (Dijkstra's territory), which doesn't apply when all edges are equal.",
    },
    {
      id: "uwg-q2",
      question:
        "Why can a plain BFS read the shortest distance off an unweighted graph without any extra optimisation?",
      options: [
        { id: "a", label: "Because BFS sorts the edges by weight before expanding them." },
        { id: "b", label: "Because BFS uses a stack, which naturally finds the deepest path." },
        { id: "c", label: "Because its FIFO queue hands out vertices in non-decreasing distance order, so the first time a vertex is seen, that distance is already the smallest possible." },
        { id: "d", label: "Because BFS visits every vertex exactly twice and averages the two distances." },
      ],
      correctOptionId: "c",
      explanation:
        "The queue empties all distance-1 vertices before any distance-2 vertex, and so on. So a vertex's first sighting is via the fewest-edge route — any shorter path would have reached it on an earlier ring. This 'first-seen = shortest' guarantee holds precisely because every edge adds the same 1 to the distance.",
    },
    {
      id: "uwg-q3",
      question:
        "You add a single new edge that acts as a shortcut between two distant vertices. What can happen to the shortest distances in the graph?",
      options: [
        { id: "a", label: "Some distances may decrease, but none can increase." },
        { id: "b", label: "Some distances may increase, but none can decrease." },
        { id: "c", label: "All distances stay exactly the same — adding edges never matters." },
        { id: "d", label: "Distances become undefined until you re-weight every edge." },
      ],
      correctOptionId: "a",
      explanation:
        "Distance is the minimum over all paths. A new edge adds a possible path without removing any existing ones, so no distance can grow — it can only stay the same or shrink. A well-placed shortcut can collapse a 3-hop path to 2, which is exactly the 'A shortcut shrinks it' scenario.",
    },
  ],
};
