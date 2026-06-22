import type { ConceptContent } from "@/lib/content/types";

export const completeGraph: ConceptContent = {
  prototypeCaption:
    "A complete graph Kₙ across four tabs, with a slider to choose n. **Build Kₙ** lays the vertices on a circle and draws every pair one edge at a time, narrating the running count toward the total; **Counting the edges** derives the n(n−1)/2 formula by walking each vertex's degree; **Density extreme** contrasts Kₙ's quadratic edge count against a sparse tree on the same vertices. **Free play** gives you the n slider (2–10) with live relayout, a *Show all* / *Clear* toggle, and live stats for n, the edge count, and the formula.",

  overview: [
    {
      type: "p",
      text: "**A complete graph Kₙ joins every single pair of vertices — it is the densest simple graph that can exist on n vertices.** There is no pair left unconnected, no vertex that doesn't touch every other. Drawn on a circle it looks like a perfectly woven web; add one more vertex and a whole new fan of edges sprouts from it to every vertex already there. Nothing is missing, which is exactly what makes it special.",
    },
    {
      type: "p",
      text: "Because every pair is joined, Kₙ has exactly **n(n−1)/2 edges** and every vertex has the same **degree n−1**. Those two numbers are the whole story. K₅ has 10 edges; K₆ has 15; K₁₀ has 45; K₁₀₀ already has 4,950. The edge count grows *quadratically* — roughly with n² — so doubling the vertices roughly quadruples the edges. That quadratic blow-up is why the complete graph is the worst case nearly every graph algorithm secretly fears.",
    },
    {
      type: "p",
      text: "You rarely *want* a fully complete graph in the wild — real networks are sparse. But Kₙ matters as a **benchmark and a bound**. It is the maximum any simple graph on n vertices can reach, so 'how dense is this graph?' is answered by comparing its edge count to n(n−1)/2. It is the structure that makes an adjacency matrix pay off, the worst case for the travelling-salesman tour, and the shape a clique becomes when a group is *completely* interconnected.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The two numbers that define Kₙ" },
    {
      type: "ul",
      items: [
        "**Edge count = n(n−1)/2.** Pick any vertex: it connects to the other n−1. Do that for all n vertices and you count n(n−1) endpoints — but every edge has two endpoints, so each edge got counted twice. Divide by 2: `n(n−1)/2`.",
        "**Degree = n−1 for every vertex.** Each vertex is joined to all the others and to no more, so the graph is *regular* — every vertex has identical degree. (Sanity check via the handshake lemma: Σ deg = n·(n−1) = 2·|E|, so |E| = n(n−1)/2 again.)",
        "**It's the upper bound.** A simple graph on n vertices can have at most n(n−1)/2 edges, and Kₙ is the graph that hits it. Any more would require a self-loop or a parallel edge — and then it's no longer simple.",
      ],
    },
    { type: "h", text: "Quadratic growth" },
    {
      type: "p",
      text: "n(n−1)/2 is **Θ(n²)** — for large n it behaves like n²/2. That single fact drives a lot of algorithm design. Listing or even just *touching* every edge is O(n²) work. An algorithm that's O(V + E) on a sparse graph degrades to O(V²) on a complete one, and an O(V·E) algorithm becomes O(V³). When someone reports an algorithm's worst case, they are very often imagining it running on Kₙ.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "When the matrix finally wins",
      text: "An adjacency list costs O(V + E) space and beats the O(V²) adjacency matrix on the sparse graphs you usually meet. But on Kₙ, E itself is Θ(V²) — the list saves nothing and carries per-node pointer overhead, while the matrix is a tight, cache-friendly V×V block. Dense ⇒ matrix. The complete graph is the cleanest case where that rule of thumb flips.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Cliques are complete subgraphs",
      text: "A **clique** is a set of vertices that are all mutually connected — i.e. they induce a complete subgraph. So a clique of size k is just a Kₖ hiding inside a bigger graph. Finding the largest clique (the *maximum clique* problem) is NP-hard precisely because completeness is a demanding, all-or-nothing condition.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Reach for a complete graph when" },
    {
      type: "ul",
      items: [
        "**Every pair genuinely interacts** — a round-robin tournament where each team plays every other, an all-to-all message exchange, a fully-meshed network where every node links directly to every other.",
        "**You need a worst-case benchmark** — to stress-test an algorithm or prove a bound, Kₙ is the maximal, most adversarial input on n vertices.",
        "**You're reasoning about cliques** — detecting fully-interconnected groups (a friend group where everyone knows everyone, co-occurring terms) means searching for complete subgraphs.",
        "**The graph really is dense** — when E approaches n(n−1)/2, store it as an adjacency matrix rather than a list.",
      ],
    },
    { type: "h", text: "Avoid forcing completeness when" },
    {
      type: "ul",
      items: [
        "**The real network is sparse** — most graphs (roads, the web, social follows) have far fewer than n²/2 edges; modelling them as complete wastes Θ(n²) space and erases the structure you care about.",
        "**You only need some connections** — if not every pair interacts, a general graph with the actual edges is both smaller and more faithful.",
        "**n is large** — n(n−1)/2 explodes; a complete graph on 100k vertices is ~5 billion edges, which no list or matrix will hold.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Maximally connected** — there's a direct edge between every pair, so the diameter is 1 and any vertex reaches any other in a single hop.",
      "**Perfectly regular and predictable** — every vertex has the same degree n−1, and the edge count is exactly n(n−1)/2, with no shape-dependent variation.",
      "**Robust** — you can delete many edges or vertices and the rest stays connected; there is no single point of failure.",
      "**The natural upper bound** — gives a clean denominator for measuring any graph's density and a concrete worst case for analysis.",
    ],
    cons: [
      "**Quadratic edge count** — n(n−1)/2 = Θ(n²) edges make storage and any all-edges algorithm expensive as n grows.",
      "**Almost never realistic** — real-world relationships are sparse; true all-to-all connectivity is rare and usually wasteful.",
      "**Expensive to maintain** — a fully-meshed network needs n−1 links per node, so adding one node forces n new connections.",
      "**The algorithmic worst case** — traversals, shortest paths, and tour problems all hit their worst running times on Kₙ.",
    ],
  },

  handsOn: [
    {
      title: "01 · Build Kₙ",
      body: "On the **Build Kₙ** tab the vertices sit on a circle. Press **Play** to draw every pair one edge at a time; each step names the pair being joined and the side panel shows *edges drawn so far / total*. Watch the count march toward n(n−1)/2 and land exactly on it when the last pair is connected — at K₆ that's the 15th edge. Use **Step** / **Back** to add or remove a single edge.",
    },
    {
      title: "02 · Counting the edges",
      body: "Switch to **Counting the edges** and Play. The prototype walks each vertex and notes it connects to the other **n−1**, accumulating n·(n−1) in the side panel. The final step halves it: *every edge was counted from both endpoints, so divide by 2* — giving n(n−1)/2. Confirm each vertex's degree reads n−1, and that the formula stat equals the edge count.",
    },
    {
      title: "03 · Density extreme",
      body: "On **Density extreme**, Play to see Kₙ's n(n−1)/2 edges contrasted against a sparse **tree** on the same n vertices, which needs only n−1. The side panel shows *Kₙ edges vs tree edges* side by side. Notice how the gap explodes as n grows — quadratic versus linear — which is exactly why a dense graph favours an adjacency matrix over a list.",
    },
    {
      title: "04 · Free play — drag the slider, watch it explode",
      body: "Open **Free play** and drag the **n** slider from 2 to 10; the circle relayouts live and rebuilds Kₙ. Toggle **Show all** / **Clear** to draw or hide all edges. Watch the *edges* and *n(n−1)/2* stats stay locked together and grow far faster than n itself — go from n=5 (10 edges) to n=10 (45 edges) and feel the quadratic jump.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "complete-graph.ts",
      code: `// The complete graph K_n: every pair of vertices is joined.
// Densest simple graph possible — n(n-1)/2 edges, every degree n-1.
class CompleteGraph {
  readonly n: number;
  readonly vertices: number[];

  constructor(n: number) {
    if (n < 0) throw new Error("n must be non-negative");
    this.n = n;
    this.vertices = Array.from({ length: n }, (_, i) => i);
  }

  // All unordered pairs {i, j} with i < j — exactly the edges of K_n.
  *edges(): IterableIterator<[number, number]> {
    for (let i = 0; i < this.n; i++)
      for (let j = i + 1; j < this.n; j++) yield [i, j];
  }

  // n(n-1)/2 — derived, not counted.
  edgeCount(): number {
    return (this.n * (this.n - 1)) / 2;
  }

  // Every vertex touches all the others, so the graph is (n-1)-regular.
  degree(_v: number): number {
    return this.n - 1;
  }

  // Place vertices evenly on a circle so K_n draws as a symmetric web.
  layout(cx = 280, cy = 145, radius = 120): Array<[number, number]> {
    return this.vertices.map((i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / this.n;
      return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    });
  }

  // Density: how close another graph's edge count is to the K_n ceiling.
  static density(vertices: number, edges: number): number {
    const max = (vertices * (vertices - 1)) / 2;
    return max === 0 ? 0 : edges / max; // 1.0 means complete
  }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "CompleteGraph.java",
      code: `// The complete graph K_n: every pair of vertices is joined.
// Densest simple graph possible — n(n-1)/2 edges, every degree n-1.
import java.util.*;

class CompleteGraph {
    final int n;
    final List<Integer> vertices;

    CompleteGraph(int n) {
        if (n < 0) throw new IllegalArgumentException("n must be non-negative");
        this.n = n;
        this.vertices = new ArrayList<>();
        for (int i = 0; i < n; i++) vertices.add(i);
    }

    // All unordered pairs {i, j} with i < j — exactly the edges of K_n.
    List<int[]> edges() {
        List<int[]> result = new ArrayList<>();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) result.add(new int[] { i, j });
        return result;
    }

    // n(n-1)/2 — derived, not counted.
    int edgeCount() {
        return (n * (n - 1)) / 2;
    }

    // Every vertex touches all the others, so the graph is (n-1)-regular.
    int degree(int v) {
        return n - 1;
    }

    // Place vertices evenly on a circle so K_n draws as a symmetric web.
    double[][] layout(double cx, double cy, double radius) {
        double[][] points = new double[n][2];
        for (int i = 0; i < n; i++) {
            double angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
            points[i][0] = cx + radius * Math.cos(angle);
            points[i][1] = cy + radius * Math.sin(angle);
        }
        return points;
    }

    // Density: how close another graph's edge count is to the K_n ceiling.
    static double density(int vertices, int edges) {
        double max = (vertices * (vertices - 1)) / 2.0;
        return max == 0 ? 0 : edges / max; // 1.0 means complete
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "complete_graph.py",
      code: `import math
from typing import Iterator


class CompleteGraph:
    """The complete graph K_n: every pair of vertices is joined.

    Densest simple graph possible — n(n-1)/2 edges, every degree n-1.
    """

    def __init__(self, n: int) -> None:
        if n < 0:
            raise ValueError("n must be non-negative")
        self.n = n
        self.vertices = list(range(n))

    def edges(self) -> Iterator[tuple[int, int]]:
        # All unordered pairs (i, j) with i < j — exactly the edges of K_n.
        for i in range(self.n):
            for j in range(i + 1, self.n):
                yield (i, j)

    def edge_count(self) -> int:
        # n(n-1)/2 — derived, not counted.
        return (self.n * (self.n - 1)) // 2

    def degree(self, v: int) -> int:
        # Every vertex touches all the others, so the graph is (n-1)-regular.
        return self.n - 1

    def layout(self, cx: float = 280, cy: float = 145,
               radius: float = 120) -> list[tuple[float, float]]:
        # Place vertices evenly on a circle so K_n draws as a symmetric web.
        points = []
        for i in self.vertices:
            angle = -math.pi / 2 + (i * 2 * math.pi) / self.n
            points.append((cx + radius * math.cos(angle),
                           cy + radius * math.sin(angle)))
        return points

    @staticmethod
    def density(vertices: int, edges: int) -> float:
        # Density: how close another graph's edge count is to the K_n ceiling.
        max_edges = (vertices * (vertices - 1)) / 2
        return 0 if max_edges == 0 else edges / max_edges  # 1.0 means complete`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "complete_graph.cpp",
      code: `// The complete graph K_n: every pair of vertices is joined.
// Densest simple graph possible — n(n-1)/2 edges, every degree n-1.
#include <cmath>
#include <stdexcept>
#include <utility>
#include <vector>

class CompleteGraph {
public:
    const int n;
    std::vector<int> vertices;

    explicit CompleteGraph(int n) : n(n) {
        if (n < 0) throw std::invalid_argument("n must be non-negative");
        vertices.resize(n);
        for (int i = 0; i < n; i++) vertices[i] = i;
    }

    // All unordered pairs {i, j} with i < j — exactly the edges of K_n.
    std::vector<std::pair<int, int>> edges() const {
        std::vector<std::pair<int, int>> result;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) result.emplace_back(i, j);
        return result;
    }

    // n(n-1)/2 — derived, not counted.
    int edgeCount() const {
        return (n * (n - 1)) / 2;
    }

    // Every vertex touches all the others, so the graph is (n-1)-regular.
    int degree(int v) const {
        return n - 1;
    }

    // Place vertices evenly on a circle so K_n draws as a symmetric web.
    std::vector<std::pair<double, double>> layout(double cx = 280, double cy = 145,
                                                  double radius = 120) const {
        std::vector<std::pair<double, double>> points;
        for (int i : vertices) {
            double angle = -M_PI / 2 + (i * 2 * M_PI) / n;
            points.emplace_back(cx + radius * std::cos(angle),
                                cy + radius * std::sin(angle));
        }
        return points;
    }

    // Density: how close another graph's edge count is to the K_n ceiling.
    static double density(int vertices, int edges) {
        double max = (vertices * (vertices - 1)) / 2.0;
        return max == 0 ? 0 : edges / max; // 1.0 means complete
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Wikipedia — Complete graph",
      href: "https://en.wikipedia.org/wiki/Complete_graph",
      note: "Definition, the n(n−1)/2 edge count, regularity, and the standard Kₙ notation with worked small cases.",
      kind: "article",
    },
    {
      label: "Wolfram MathWorld — Complete Graph",
      href: "https://mathworld.wolfram.com/CompleteGraph.html",
      note: "Formal treatment with edge/degree formulas, automorphisms, and how Kₙ relates to cliques and other graph families.",
      kind: "article",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, Appendix B.4 & Ch. 20",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Graph definitions, why dense graphs (E ≈ V²) favour an adjacency matrix, and the O(V+E) vs O(V²) representation trade-off.",
      kind: "book",
    },
    {
      label: "Khan Academy — Representing graphs",
      href: "https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs",
      note: "Adjacency list vs matrix with the storage trade-off that flips once a graph becomes dense like Kₙ.",
      kind: "article",
    },
    {
      label: "Wikipedia — Clique (graph theory)",
      href: "https://en.wikipedia.org/wiki/Clique_(graph_theory)",
      note: "A clique is a complete subgraph — why finding the maximum clique is NP-hard and how it ties back to Kₙ.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Graph data structures",
      href: "https://visualgo.net/en/graphds",
      note: "Build and visualise graphs interactively; add edges until a small graph becomes complete to see the matrix fill up.",
      kind: "video",
    },
  ],

  quiz: [
    {
      id: "cg-q1",
      question: "How many edges does the complete graph K₈ have?",
      options: [
        { id: "a", label: "8" },
        { id: "b", label: "28" },
        { id: "c", label: "56" },
        { id: "d", label: "64" },
      ],
      correctOptionId: "b",
      explanation:
        "A complete graph on n vertices has n(n−1)/2 edges. For n = 8 that is 8 × 7 / 2 = 28. The value 56 is n(n−1) before dividing by 2 (it double-counts each edge), and 64 is n².",
    },
    {
      id: "cg-q2",
      question: "In Kₙ, what is the degree of every vertex, and why is it the same for all of them?",
      options: [
        { id: "a", label: "n, because each vertex connects to all n vertices including itself." },
        { id: "b", label: "n−1, because each vertex connects to every other vertex — the graph is regular." },
        { id: "c", label: "It varies; central vertices have higher degree than outer ones." },
        { id: "d", label: "2, because every edge has two endpoints." },
      ],
      correctOptionId: "b",
      explanation:
        "Each vertex is joined to all the others and to no more, so it has degree n−1. Because every vertex sees the identical situation, Kₙ is (n−1)-regular — degree does not vary by position. A simple graph has no self-loop, so a vertex never connects to itself.",
    },
    {
      id: "cg-q3",
      question: "Why is the complete graph the worst case for many graph algorithms?",
      options: [
        { id: "a", label: "It has cycles, which confuse traversal algorithms." },
        { id: "b", label: "Its edge count is Θ(n²), so any algorithm that touches every edge does quadratic work; an O(V+E) routine degrades to O(V²)." },
        { id: "c", label: "It cannot be stored in memory at any size." },
        { id: "d", label: "Its vertices have unpredictable degrees, breaking the analysis." },
      ],
      correctOptionId: "b",
      explanation:
        "Kₙ has n(n−1)/2 = Θ(n²) edges — the maximum a simple graph can have. Since E itself is quadratic in V, algorithms whose cost depends on E (like O(V+E) traversals) hit O(V²) here, which is exactly the worst case they are analysed against.",
    },
  ],
};
