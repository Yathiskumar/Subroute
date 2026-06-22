import type { ConceptContent } from "@/lib/content/types";

export const directedGraph: ConceptContent = {
  prototypeCaption:
    "A six-vertex directed graph (digraph) across four tabs. **One-way edges** adds the arrows one at a time and shows that each arrow A→B bumps A's out-degree and B's in-degree only; **Reachability** runs a BFS that follows arrow direction from a source and lights up the reachable set ring by ring — then shows the reverse direction is *not* reachable; **Sources & sinks** highlights the in-degree-0 and out-degree-0 vertices. **Free play** lets you click a source then a target to add a one-way arrow (click the same pair again to remove it), drag vertices, and switch on a Reachable-from mode — the in/out-degree badges update live.",

  overview: [
    {
      type: "p",
      text: "**A directed graph — a digraph — is a graph whose edges have a direction: each edge is a one-way arrow from a source vertex to a target.** Writing `A → B` says A points to B; it says nothing about B pointing back. Drawn on paper, the difference from an undirected graph is a single detail — every line grows an arrowhead — but that arrowhead changes everything you can ask of the graph.",
    },
    {
      type: "p",
      text: "Reach for a digraph the moment a relationship is *one-way*. A Twitter follow (you can follow someone who doesn't follow you), a web hyperlink (page A links to B without B linking back), a prerequisite (\"finish Calculus I before Calculus II\"), a function call, a road that's one-way: all of these are asymmetric, and an undirected edge would erase exactly the information you care about. If `A → B` does not imply `B → A`, you are in directed territory.",
    },
    {
      type: "p",
      text: "Two vocabulary shifts come with the arrowheads. A vertex no longer has a single *degree* — it has an **in-degree** (arrows landing on it) and an **out-degree** (arrows leaving it), and these can differ wildly. And **reachability** is now *asymmetric*: \"can I get from A to B following arrows?\" is a different question from \"can I get from B to A?\". A vertex with in-degree 0 is a **source** (nothing reaches it); one with out-degree 0 is a **sink** (you can't leave it). Master in/out-degree and directed reachability and the rest of digraph theory — topological sort, strongly connected components, DAGs — has a foundation.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The pieces" },
    {
      type: "ul",
      items: [
        "**Vertices (nodes)** — the things. Pages, accounts, tasks, states. Written V, with |V| or *n* for the count.",
        "**Directed edges (arcs)** — *ordered* pairs `(u, v)` drawn as an arrow `u → v`. Because the pair is ordered, `(u, v)` and `(v, u)` are two *different* edges, and a graph may contain one, both, or neither.",
        "**In-degree** — `deg⁻(v)` = number of arrows pointing *at* v. **Out-degree** — `deg⁺(v)` = number of arrows *leaving* v. A vertex's total activity is the sum of the two.",
        "**Source** — a vertex with in-degree 0: nothing points to it. **Sink** — a vertex with out-degree 0: nothing leaves it. Either can also be isolated (both degrees 0).",
        "**Directed path & reachability** — a walk `v₀ → v₁ → … → v_k` that respects every arrow's direction. v is *reachable* from u if such a path exists. Crucially, u reachable-from-v does **not** imply v reachable-from-u.",
      ],
    },
    { type: "h", text: "The directed handshake lemma" },
    {
      type: "p",
      text: "Sum the in-degrees of every vertex and you get the number of edges. Sum the out-degrees and you get the same number. So **Σ deg⁻(v) = Σ deg⁺(v) = |E|** — every arrow has exactly one head and one tail, so it contributes 1 to the total in-degree and 1 to the total out-degree. (Contrast the undirected handshake lemma, where the degree sum is 2|E| because each edge has two interchangeable endpoints.)",
    },
    {
      type: "callout",
      variant: "info",
      title: "Reachability is one-way",
      text: "In an undirected graph, connectivity is symmetric: if you can walk from A to B you can walk back. A digraph breaks that. In the prototype's default graph, A reaches every other vertex, but the sink F reaches only itself — there is no arrow path from F back to A. When *every* vertex can reach every other (both directions), the digraph is **strongly connected**; that's a much stronger and rarer property than undirected connectivity.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Sources, sinks, and topological order",
      text: "If a directed graph has no cycle (a **DAG**), it must contain at least one source and at least one sink — otherwise you could keep following arrows forever and never leave, which forces a cycle. Repeatedly peeling off a source vertex is exactly Kahn's algorithm for topological sorting, the backbone of build systems, schedulers, and spreadsheet recalculation.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Model it as directed when" },
    {
      type: "ul",
      items: [
        "**The relationship is one-way** — follows, links, imports, citations, money transfers, 'A must finish before B'. The direction *is* the information.",
        "**Reachability should be asymmetric** — 'A can reach B' must not silently imply 'B can reach A' (web crawls, influence/spread, who-can-call-whom).",
        "**You need an ordering or to detect cycles** — topological sort, dependency resolution, deadlock detection, and 'is this schedule even possible?' all require arrows (and often acyclicity).",
        "**You care about flow** — traffic, water, packets, or control flowing from sources toward sinks through a network.",
      ],
    },
    { type: "h", text: "Reach for an undirected graph instead when" },
    {
      type: "ul",
      items: [
        "**The relationship is genuinely mutual** — friendships, physical cables, shared borders, 'these two can bond'. Adding arrows you'll always keep symmetric just doubles your bookkeeping.",
        "**You only ask connectivity/clustering questions** — connected components and spanning trees are simpler and faster on an undirected model.",
        "**Direction would be noise** — if you'd immediately collapse `A → B` and `B → A` into one relationship, don't introduce the distinction in the first place.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Expresses asymmetry** — follows, links, prerequisites, and flows are captured faithfully; the model says exactly what it means.",
      "**In-degree vs out-degree are distinct signals** — you can ask 'who has no incoming arrows?' (sources) or 'who is everyone pointing at?' (high in-degree hubs, the basis of PageRank).",
      "**Unlocks ordering algorithms** — topological sort, cycle detection, and strongly-connected-components all live here and have nowhere to run on an undirected graph.",
      "**Reachability is precise** — directed BFS/DFS answers 'can A get to B?' without the false symmetry an undirected edge would impose.",
    ],
    cons: [
      "**More to store and reason about** — `(u, v)` and `(v, u)` are separate edges; an adjacency list often needs both a forward and a reverse copy (a 'transpose') for some algorithms.",
      "**Connectivity gets subtle** — there are *weak*, *unilateral*, and *strong* connectivity, and the cheap undirected union-find no longer answers 'is it all one piece?'.",
      "**Easy to get the direction backwards** — a flipped arrow is a silent bug; the graph still looks valid but every reachability answer is wrong.",
      "**Cycles can hide** — a directed cycle (`A → B → C → A`) breaks topological sort and any algorithm that assumes a DAG; you have to test for it.",
    ],
  },

  handsOn: [
    {
      title: "01 · One-way edges",
      body: "On the **One-way edges** tab, press **Play** to watch the seven arrows appear one at a time. Each narration calls out that arrow `u → v` raises *u's* out-degree and *v's* in-degree — and nothing else; there is no implied `v → u`. The side panel lists the arrows added so far. The final step shows each vertex's `in / out` pair: note **A** lands on in-degree `0` and **F** on out-degree `0`. Use **Step** / **Back** to move one arrow at a time.",
    },
    {
      title: "02 · Reachability",
      body: "Switch to **Reachability** and Play. A BFS starts at **A** and expands ring by ring, but only ever travels in the arrow direction — watch the *reached* counter and the side panel's reachable-from-A set grow. The final step makes the key point: A reaches all six vertices (e.g. A → B → C → F), yet from the sink **F** you can reach only `{F}` — there is no path back. Reachability in a digraph is one-way.",
    },
    {
      title: "03 · Sources & sinks",
      body: "On **Sources & sinks**, Play to first highlight the **sources** (in-degree 0 — here **A**) in purple, then the **sinks** (out-degree 0 — here **F**) in red. The narration explains what each means: nothing reaches a source, and nothing leaves a sink. The side panel shows the source and sink sets and the stats grid relabels to *sources* and *sinks* counts. Every acyclic digraph must have at least one of each.",
    },
    {
      title: "04 · Free play — build your own digraph",
      body: "Open **Free play**. Click a *source* vertex then a *target* to add a one-way arrow; click the same pair again to remove it; drag vertices to rearrange. Each vertex shows its live `in n · out n` badge. Hit **Reachable from** and click any vertex to light up everything it can reach following arrows — pick a sink and watch only itself light up. Use **Clear arrows** for six isolated vertices, or **Reset graph** to return to the starting digraph.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "directed-graph.ts",
      code: `// A directed graph (digraph) as an adjacency list.
// The key difference from undirected: each edge is stored ONCE,
// only on its source — direction is the whole point.
class DirectedGraph {
  private adj = new Map<string, Set<string>>();

  addVertex(v: string) {
    if (!this.adj.has(v)) this.adj.set(v, new Set());
  }

  // One-way arrow u -> v. We do NOT add v -> u.
  addEdge(u: string, v: string) {
    this.addVertex(u);
    this.addVertex(v);
    this.adj.get(u)!.add(v);
  }

  outDegree(v: string): number {
    return this.adj.get(v)?.size ?? 0;
  }

  inDegree(v: string): number {
    let count = 0;
    for (const targets of this.adj.values()) if (targets.has(v)) count++;
    return count;
  }

  sources(): string[] {            // in-degree 0
    return [...this.adj.keys()].filter((v) => this.inDegree(v) === 0);
  }

  sinks(): string[] {              // out-degree 0
    return [...this.adj.keys()].filter((v) => this.outDegree(v) === 0);
  }

  // Reachability: BFS that follows arrow direction only.
  // reachable('A') may include 'F' even when reachable('F') excludes 'A'.
  reachable(start: string): Set<string> {
    const seen = new Set<string>([start]);
    const queue = [start];
    while (queue.length) {
      const u = queue.shift()!;
      for (const v of this.adj.get(u) ?? []) {
        if (!seen.has(v)) { seen.add(v); queue.push(v); }
      }
    }
    return seen;
  }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "DirectedGraph.java",
      code: `// A directed graph (digraph) as an adjacency list.
// The key difference from undirected: each edge is stored ONCE,
// only on its source — direction is the whole point.
import java.util.*;

class DirectedGraph {
    private final Map<String, Set<String>> adj = new HashMap<>();

    void addVertex(String v) {
        adj.putIfAbsent(v, new LinkedHashSet<>());
    }

    // One-way arrow u -> v. We do NOT add v -> u.
    void addEdge(String u, String v) {
        addVertex(u);
        addVertex(v);
        adj.get(u).add(v);
    }

    int outDegree(String v) {
        return adj.containsKey(v) ? adj.get(v).size() : 0;
    }

    int inDegree(String v) {
        int count = 0;
        for (Set<String> targets : adj.values()) if (targets.contains(v)) count++;
        return count;
    }

    List<String> sources() {         // in-degree 0
        List<String> result = new ArrayList<>();
        for (String v : adj.keySet()) if (inDegree(v) == 0) result.add(v);
        return result;
    }

    List<String> sinks() {           // out-degree 0
        List<String> result = new ArrayList<>();
        for (String v : adj.keySet()) if (outDegree(v) == 0) result.add(v);
        return result;
    }

    // Reachability: BFS that follows arrow direction only.
    // reachable("A") may include "F" even when reachable("F") excludes "A".
    Set<String> reachable(String start) {
        Set<String> seen = new LinkedHashSet<>(List.of(start));
        Deque<String> queue = new ArrayDeque<>();
        queue.add(start);
        while (!queue.isEmpty()) {
            String u = queue.poll();
            for (String v : adj.getOrDefault(u, Set.of())) {
                if (seen.add(v)) queue.add(v);
            }
        }
        return seen;
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "directed_graph.py",
      code: `from collections import deque


class DirectedGraph:
    """A directed graph (digraph) as an adjacency list.

    The key difference from undirected: each edge is stored ONCE,
    only on its source — direction is the whole point.
    """

    def __init__(self) -> None:
        self.adj: dict[str, set[str]] = {}

    def add_vertex(self, v: str) -> None:
        self.adj.setdefault(v, set())

    def add_edge(self, u: str, v: str) -> None:
        # One-way arrow u -> v. We do NOT add v -> u.
        self.add_vertex(u)
        self.add_vertex(v)
        self.adj[u].add(v)

    def out_degree(self, v: str) -> int:
        return len(self.adj.get(v, ()))

    def in_degree(self, v: str) -> int:
        return sum(1 for targets in self.adj.values() if v in targets)

    def sources(self) -> list[str]:          # in-degree 0
        return [v for v in self.adj if self.in_degree(v) == 0]

    def sinks(self) -> list[str]:            # out-degree 0
        return [v for v in self.adj if self.out_degree(v) == 0]

    def reachable(self, start: str) -> set[str]:
        # BFS that follows arrow direction only.
        # reachable("A") may include "F" even when reachable("F") excludes "A".
        seen = {start}
        queue = deque([start])
        while queue:
            u = queue.popleft()
            for v in self.adj.get(u, ()):
                if v not in seen:
                    seen.add(v)
                    queue.append(v)
        return seen`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "directed_graph.cpp",
      code: `// A directed graph (digraph) as an adjacency list.
// The key difference from undirected: each edge is stored ONCE,
// only on its source — direction is the whole point.
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <queue>

class DirectedGraph {
    std::unordered_map<std::string, std::unordered_set<std::string>> adj_;

public:
    void addVertex(const std::string& v) {
        adj_.try_emplace(v);
    }

    // One-way arrow u -> v. We do NOT add v -> u.
    void addEdge(const std::string& u, const std::string& v) {
        addVertex(u);
        addVertex(v);
        adj_[u].insert(v);
    }

    int outDegree(const std::string& v) const {
        auto it = adj_.find(v);
        return it == adj_.end() ? 0 : static_cast<int>(it->second.size());
    }

    int inDegree(const std::string& v) const {
        int count = 0;
        for (const auto& [src, targets] : adj_)
            if (targets.count(v)) count++;
        return count;
    }

    std::vector<std::string> sources() const {   // in-degree 0
        std::vector<std::string> result;
        for (const auto& [v, _] : adj_) if (inDegree(v) == 0) result.push_back(v);
        return result;
    }

    std::vector<std::string> sinks() const {     // out-degree 0
        std::vector<std::string> result;
        for (const auto& [v, _] : adj_) if (outDegree(v) == 0) result.push_back(v);
        return result;
    }

    // Reachability: BFS that follows arrow direction only.
    // reachable("A") may include "F" even when reachable("F") excludes "A".
    std::unordered_set<std::string> reachable(const std::string& start) const {
        std::unordered_set<std::string> seen{start};
        std::queue<std::string> queue;
        queue.push(start);
        while (!queue.empty()) {
            std::string u = queue.front();
            queue.pop();
            auto it = adj_.find(u);
            if (it == adj_.end()) continue;
            for (const auto& v : it->second)
                if (seen.insert(v).second) queue.push(v);
        }
        return seen;
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, Appendix B.4 & Ch. 20",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Formal definitions of directed graphs, in/out-degree, directed paths, and the adjacency-list/matrix representations — including the graph transpose.",
      kind: "book",
    },
    {
      label: "Wikipedia — Directed graph",
      href: "https://en.wikipedia.org/wiki/Directed_graph",
      note: "Clear reference for arcs, in-degree and out-degree, sources and sinks, and the directed degree sum (Σ in = Σ out = |E|).",
      kind: "article",
    },
    {
      label: "Wikipedia — Reachability",
      href: "https://en.wikipedia.org/wiki/Reachability",
      note: "Why pairwise reachability in a digraph need not be symmetric, plus the algorithms (Floyd–Warshall, transitive closure) that compute it.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Graph data structures",
      href: "https://visualgo.net/en/graphds",
      note: "Interactive visualisation with a directed/unweighted mode — edit a digraph and watch the adjacency list and matrix update.",
      kind: "video",
    },
    {
      label: "Khan Academy — Describing graphs",
      href: "https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/describing-graphs",
      note: "A gentle, example-driven introduction that contrasts directed and undirected edges, in/out-degree, and adjacency for first-time readers.",
      kind: "article",
    },
    {
      label: "Skiena — *The Algorithm Design Manual*, Ch. 5 (Graph Traversal)",
      href: "https://www.algorist.com/",
      note: "Practical guidance on modelling problems as directed graphs, choosing a representation, and war stories on direction-aware traversal.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "dg-q1",
      question:
        "In the directed graph, adding the single arrow A → B changes which vertices' degrees?",
      options: [
        { id: "a", label: "It raises A's out-degree and B's in-degree only." },
        { id: "b", label: "It raises both A's and B's degree, in both directions (so the relationship is mutual)." },
        { id: "c", label: "It raises A's in-degree and B's out-degree." },
        { id: "d", label: "It has no effect on degree until a matching B → A arrow is added." },
      ],
      correctOptionId: "a",
      explanation:
        "A directed edge is an ordered pair: A → B means A points to B and nothing more. It adds 1 to A's out-degree (an arrow leaving A) and 1 to B's in-degree (an arrow arriving at B). There is no implied B → A, which is exactly what distinguishes a digraph from an undirected graph.",
    },
    {
      id: "dg-q2",
      question:
        "In a digraph, vertex A can reach vertex F by following arrows. What does this tell you about whether F can reach A?",
      options: [
        { id: "a", label: "F can definitely reach A, because reachability is symmetric." },
        { id: "b", label: "Nothing — reachability is one-way, so F may or may not be able to reach A." },
        { id: "c", label: "F can never reach A, because that would create a cycle." },
        { id: "d", label: "F can reach A only if they have the same in-degree." },
      ],
      correctOptionId: "b",
      explanation:
        "Reachability in a directed graph is asymmetric: A → … → F says nothing about a path from F back to A. In the prototype, A reaches F but the sink F reaches only itself. (If F could also reach A, they'd be in the same strongly connected component — possible, but not guaranteed.)",
    },
    {
      id: "dg-q3",
      question:
        "What is a 'sink' in a directed graph?",
      options: [
        { id: "a", label: "A vertex with in-degree 0 — nothing points to it." },
        { id: "b", label: "A vertex with the highest in-degree in the graph." },
        { id: "c", label: "A vertex with out-degree 0 — arrows arrive but none leave, so you can't continue from it." },
        { id: "d", label: "Any vertex that is part of a directed cycle." },
      ],
      correctOptionId: "c",
      explanation:
        "A sink has out-degree 0: arrows can land on it, but none leave, so once a traversal reaches a sink it's stuck there. The mirror image is a source (in-degree 0), described in option A. Every finite acyclic digraph must have at least one of each.",
    },
  ],
};
