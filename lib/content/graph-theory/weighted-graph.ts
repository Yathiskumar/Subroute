import type { ConceptContent } from "@/lib/content/types";

export const weightedGraph: ConceptContent = {
  prototypeCaption:
    "A six-vertex undirected weighted graph across four tabs, with every edge labelled by its cost. **Weights change the goal** introduces edges as costs and totals up one path; **Cheapest ≠ fewest hops** pits an expensive one-hop edge against a cheaper multi-hop detour; **Dijkstra grows a frontier** settles the closest unsettled node and relaxes its neighbours while a tentative-distance table updates. **Free play** lets you click two vertices to toggle an edge, click an edge to cycle its weight (1→2→3→5→9→1), and pick a source and target to compare the cheapest-path cost against the raw hop count.",

  overview: [
    {
      type: "p",
      text: "**A weighted graph attaches a number — a cost — to every edge, so an edge is no longer just 'these two are connected' but 'these two are connected, and it costs this much to cross.'** That cost might be a distance in kilometres, a latency in milliseconds, a toll in dollars, or a bandwidth you'd rather not saturate. The vertices and the connections are exactly the same as a plain graph; the weights are the new information, and they completely change what 'shortest' means.",
    },
    {
      type: "p",
      text: "Here is the property that makes this whole family of graphs worth studying: **the cheapest route is not necessarily the route with the fewest hops.** In an unweighted graph, the best path is simply the one with the fewest edges — that's all 'distance' can mean. The moment edges carry costs, a single expensive edge can be worse than a long chain of cheap ones. A direct flight `A → C` priced at 9 loses to the two-leg trip `A → B → C` that costs `2 + 3 = 5`. Fewest hops, most expensive trip.",
    },
    {
      type: "p",
      text: "This is exactly the gap that **Dijkstra's algorithm** exists to close. Plain breadth-first search counts edges, so on a weighted graph it confidently returns the wrong answer. Dijkstra instead grows a frontier outward by *accumulated cost*: it always settles the cheapest unsettled vertex next, then **relaxes** that vertex's edges — checking whether going through it gives any neighbour a cheaper tentative distance. With non-negative weights, the first time a vertex is settled, its distance is final. Get comfortable reading 'path cost = sum of weights' off a picture and the need for Dijkstra becomes obvious.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The pieces" },
    {
      type: "ul",
      items: [
        "**Weighted edge** — an edge `{u, v}` plus a number `w(u, v)`. Undirected here, so the cost is the same in both directions: crossing `A–B` costs the same as `B–A`.",
        "**Path cost** — the *sum* of the weights of the edges along a path, **not** the number of edges. The path `A → B → C` with weights 2 and 3 has cost 5 and length (hops) 2.",
        "**Shortest / cheapest path** — the path between two vertices with the minimum total cost. 'Shortest' now means cheapest, which can be very different from fewest-hops.",
        "**Tentative distance** — Dijkstra's best-known cost to reach each vertex so far. It starts at `∞` for every vertex except the source (which starts at 0) and only ever decreases.",
        "**Relaxing an edge** — for edge `u → v` of weight `w`, ask whether `dist[u] + w < dist[v]`. If so, you've found a cheaper way into `v`: lower `dist[v]` and remember `u` as its predecessor.",
        "**Settling a vertex** — removing the cheapest unsettled vertex from the frontier. With non-negative weights its distance is now final and never improves again.",
      ],
    },
    { type: "h", text: "Why fewest-hops can lose" },
    {
      type: "p",
      text: "Take the default graph: `A–C` is a direct edge of weight `9`, while `A–B` is `2` and `B–C` is `3`. The one-hop route `A → C` costs **9**; the two-hop detour `A → B → C` costs **2 + 3 = 5**. Fewest hops would pick the 9 and be wrong by a wide margin. This single picture is the entire reason a weighted shortest-path algorithm has to track *accumulated cost* rather than just counting edges.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Dijkstra needs non-negative weights",
      text: "Dijkstra's correctness rests on one assumption: **no edge has a negative weight.** That's what guarantees a settled vertex can never be reached more cheaply later. If costs can be negative (refunds, energy gains), a settled vertex *could* be improved by a later detour, and Dijkstra breaks — use **Bellman-Ford** instead, which is slower but handles negatives (and detects negative cycles).",
    },
    {
      type: "callout",
      variant: "tip",
      title: "It's just BFS with a priority queue",
      text: "If every weight were 1, Dijkstra would settle vertices in exactly BFS order — fewest hops *is* cheapest when all edges cost the same. Dijkstra generalises BFS by replacing the plain FIFO queue with a **min-priority queue keyed by tentative distance**, so the frontier expands by cost instead of by hop count. With a binary heap it runs in `O((V + E) log V)`.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Model it as a weighted graph when" },
    {
      type: "ul",
      items: [
        "**Crossing a connection has a cost that matters** — road distance, network latency, flight price, pipe capacity, transition probability. The number is the whole point.",
        "**You need the *cheapest* route, not the one with the fewest steps** — GPS routing, network packet routing, and least-cost supply chains all optimise summed cost.",
        "**Different connections are genuinely unequal** — a slow link and a fast link between the same two nodes should not be treated as interchangeable.",
      ],
    },
    { type: "h", text: "Reach for something else instead when" },
    {
      type: "ul",
      items: [
        "**Every edge is equally costly** — then it's an *unweighted* graph and plain BFS already gives shortest paths in `O(V + E)`; weights and a priority queue are wasted overhead.",
        "**Some weights are negative** — Dijkstra is unsound here; use Bellman-Ford (or Johnson's algorithm for all-pairs), which tolerate negatives and flag negative cycles.",
        "**You only care *whether* two things connect, not how dearly** — connectivity and components are unweighted questions; the weights are noise for that task.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Expresses real cost** — distance, time, price, and capacity all live naturally on edges, so 'best' can mean genuinely best rather than merely shortest in steps.",
      "**Shortest-path is a solved problem** — Dijkstra (non-negative) and Bellman-Ford (general) are well-understood, fast, and everywhere.",
      "**Generalises the unweighted case** — set every weight to 1 and you recover ordinary BFS distance; nothing is lost by adding weights.",
      "**Drives huge real systems** — internet routing, map navigation, and logistics optimisation are all weighted-graph shortest-path problems at scale.",
    ],
    cons: [
      "**Fewest-hops intuition fails** — a direct edge can be the *worst* choice, which trips people (and naive BFS) up constantly.",
      "**Negative weights break Dijkstra** — you must know your weights are non-negative, or switch to a slower algorithm.",
      "**Costlier to compute** — the priority queue pushes shortest-path from `O(V + E)` (BFS) up to `O((V + E) log V)`.",
      "**More to store and maintain** — every edge now carries a number that has to be sourced, kept current, and trusted; stale weights silently produce wrong routes.",
    ],
  },

  handsOn: [
    {
      title: "01 · Weights change the goal",
      body: "On the **Weights change the goal** tab, press **Play** to watch each edge appear with its **cost label** at the midpoint. The narration reminds you that a path's length is now the *sum of weights*, not the hop count. The final steps total up the route `A → B → C` edge by edge in the side panel — watch the *running cost* climb `0 → 2 → 5` — and the *path cost* stat lands on **5**.",
    },
    {
      title: "02 · Cheapest ≠ fewest hops",
      body: "Switch to **Cheapest ≠ fewest hops** — the centrepiece. The prototype highlights the single expensive edge `A–C` (cost **9**) against the cheaper two-hop detour `A → B → C` (cost **5**). The side panel lists both routes with their costs side by side. Step through and watch the fewest-hops route *lose*: one hop, but cost 9; two hops, but cost 5. This is precisely why counting edges is not enough.",
    },
    {
      title: "03 · Dijkstra grows a frontier",
      body: "On **Dijkstra grows a frontier**, Play to run Dijkstra from source **A**. Each step settles the cheapest unsettled vertex (turning it green) and then *relaxes* its neighbours, lowering their tentative distances. Follow the **dist table** in the side panel as `∞` values drop to real numbers — note `C` first gets the tentative `9` from the direct edge, then improves to `5` via `B`. The frontier always grows by accumulated cost, never by hop count.",
    },
    {
      title: "04 · Free play — engineer a detour",
      body: "Open **Free play**. Click any two vertices to toggle an edge; click an existing edge to **cycle its weight** through `1 → 2 → 3 → 5 → 9 → 1`. Then hit **Pick path**, choose a source and a target, and the side panel shows the *cheapest-path cost* next to the raw *hop count*. Try to engineer a case where they disagree: make one direct edge expensive and a longer detour cheap, and watch the cheapest path take more hops than the shortest-hops route. The *path cost* and *hops* stats update live.",
    },
  ],

  code: {
    language: "typescript",
    filename: "weighted-graph.ts",
    code: `// An undirected weighted graph + Dijkstra's shortest-path.
// Key idea: distance = SUM OF WEIGHTS, not hop count.
type Adj = Map<string, Array<{ to: string; w: number }>>;

class WeightedGraph {
  private adj: Adj = new Map();

  addEdge(u: string, v: string, w: number) {
    if (w < 0) throw new Error("Dijkstra needs non-negative weights");
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);
    this.adj.get(u)!.push({ to: v, w }); // undirected:
    this.adj.get(v)!.push({ to: u, w }); // same cost both ways
  }

  // Cheapest path by total cost (Dijkstra). Returns { cost, path }.
  shortestPath(src: string, dst: string) {
    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    for (const v of this.adj.keys()) dist.set(v, Infinity);
    dist.set(src, 0);
    prev.set(src, null);

    // tiny "priority queue": settle the cheapest unsettled vertex
    const settled = new Set<string>();
    while (settled.size < this.adj.size) {
      let u: string | null = null;
      let best = Infinity;
      for (const [v, d] of dist) if (!settled.has(v) && d < best) { best = d; u = v; }
      if (u === null) break;          // remaining vertices unreachable
      settled.add(u);
      if (u === dst) break;           // its distance is now final
      for (const { to, w } of this.adj.get(u) ?? []) {
        const alt = dist.get(u)! + w; // relax: is going via u cheaper?
        if (alt < dist.get(to)!) { dist.set(to, alt); prev.set(to, u); }
      }
    }

    if (dist.get(dst) === Infinity) return { cost: Infinity, path: [] };
    const path: string[] = [];
    for (let c: string | null = dst; c !== null; c = prev.get(c)!) path.unshift(c);
    return { cost: dist.get(dst)!, path }; // cheapest, NOT fewest-hops
  }
}`,
  },

  furtherReading: [
    {
      label: "Dijkstra (1959) — *A Note on Two Problems in Connexion with Graphs*",
      href: "https://doi.org/10.1007/BF01386390",
      note: "The original two-page paper that introduced the shortest-path algorithm now bearing his name. Remarkably readable.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, Ch. 22–24 (Shortest Paths)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The definitive treatment of single-source shortest paths: relaxation, Dijkstra's correctness, and Bellman-Ford for negative weights.",
      kind: "book",
    },
    {
      label: "Wikipedia — Dijkstra's algorithm",
      href: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm",
      note: "Clear walkthrough of settling vertices, edge relaxation, the non-negative-weight requirement, and the priority-queue complexity.",
      kind: "article",
    },
    {
      label: "Wikipedia — Shortest path problem",
      href: "https://en.wikipedia.org/wiki/Shortest_path_problem",
      note: "Frames why path cost is a sum of weights and surveys which algorithm fits which graph (weighted, unweighted, negative, DAG).",
      kind: "article",
    },
    {
      label: "VisuAlgo — Single-Source Shortest Paths",
      href: "https://visualgo.net/en/sssp",
      note: "Interactive animation of Dijkstra and Bellman-Ford on the same weighted graph — watch the distance estimates update live.",
      kind: "video",
    },
    {
      label: "Khan Academy — Representing graphs",
      href: "https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs",
      note: "A gentle primer on storing graphs (including weighted adjacency lists and matrices) before tackling shortest-path algorithms.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "wg-q1",
      question:
        "In a weighted graph, edge A–C has weight 9, while A–B has weight 2 and B–C has weight 3. What is the cheapest path from A to C, and its cost?",
      options: [
        { id: "a", label: "A → C, cost 9 — it has the fewest hops." },
        { id: "b", label: "A → B → C, cost 5 — fewer total weight despite more hops." },
        { id: "c", label: "A → B → C, cost 14 — add 9 + 2 + 3." },
        { id: "d", label: "Both paths cost the same; it doesn't matter which you take." },
      ],
      correctOptionId: "b",
      explanation:
        "Path cost is the sum of edge weights, not the hop count. The direct one-hop edge A–C costs 9, but the two-hop detour A → B → C costs 2 + 3 = 5, which is cheaper. The fewest-hops route loses — that's exactly why weighted graphs need an algorithm like Dijkstra rather than plain BFS.",
    },
    {
      id: "wg-q2",
      question:
        "What does it mean to 'relax' an edge u → v of weight w during Dijkstra's algorithm?",
      options: [
        { id: "a", label: "Remove the edge from the graph if it isn't on the shortest path." },
        { id: "b", label: "Check whether dist[u] + w is less than dist[v], and if so lower dist[v] and record u as v's predecessor." },
        { id: "c", label: "Divide the edge's weight by the number of hops taken so far." },
        { id: "d", label: "Mark vertex v as settled so its distance can never change again." },
      ],
      correctOptionId: "b",
      explanation:
        "Relaxing an edge asks whether reaching v *through* u is cheaper than v's current best-known distance: if dist[u] + w < dist[v], we found a better route, so we update dist[v] and remember u. Settling (option D) is a separate step — it happens when a vertex is removed from the frontier as the cheapest unsettled one.",
    },
    {
      id: "wg-q3",
      question:
        "Why can't Dijkstra's algorithm be trusted on a graph with negative edge weights?",
      options: [
        { id: "a", label: "Negative weights make the graph disconnected." },
        { id: "b", label: "A vertex settled as 'cheapest so far' might later be reached more cheaply through a negative-weight detour, breaking the guarantee that a settled distance is final." },
        { id: "c", label: "Dijkstra can only handle integer weights, and negatives are usually fractions." },
        { id: "d", label: "Negative weights always create cycles, which Dijkstra cannot represent." },
      ],
      correctOptionId: "b",
      explanation:
        "Dijkstra relies on the fact that, with non-negative weights, once a vertex is settled no later path can improve it. A negative edge could make a longer route cheaper *after* a vertex is settled, violating that assumption and producing wrong answers. Bellman-Ford handles negatives (and detects negative cycles) at a higher cost.",
    },
  ],
};
