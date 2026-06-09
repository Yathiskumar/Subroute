import type { ConceptContent } from "@/lib/content/types";

export const astar: ConceptContent = {
  prototypeCaption:
    "A 12×8 grid with a start, a goal, and a wall to route around. Press **Play** to watch A* expand cells in order of `f = g + h` — biased toward the goal. **Step** / **Back** walk one expansion at a time. **Heuristic** switches between Manhattan and Dijkstra (h = 0), so you can see how the heuristic changes how many cells get touched.",

  overview: [
    {
      type: "p",
      text: "**A* is Dijkstra with a hint.** Same algorithm, same priority queue, same relaxation step — but the priority isn't `g(n)` (cost from start) alone. It's `f(n) = g(n) + h(n)`, where `h(n)` is a *heuristic estimate* of the remaining cost to the goal. The heuristic biases the search toward the goal, so A* expands far fewer cells than Dijkstra to reach it.",
    },
    {
      type: "p",
      text: "The magic depends entirely on the heuristic. For A* to be **optimal** (return the shortest path), `h(n)` must be **admissible** — it never overestimates the true remaining cost. For A* to be **efficient** (never re-expand a settled node), `h(n)` must also be **consistent** (monotone): `h(u) ≤ w(u, v) + h(v)` for every edge. The standard 'Manhattan distance' heuristic on a grid satisfies both as long as movement is 4-directional with unit cost.",
    },
    {
      type: "p",
      text: "A* is what's running when your map app routes a car, when a game NPC plans a path, when a robot vacuum decides where to go next. With a strong heuristic it can be **dramatically** faster than Dijkstra — on a road network, a Euclidean-distance heuristic typically expands an order of magnitude fewer nodes. With `h(n) = 0` it degenerates to Dijkstra. With an *inadmissible* heuristic it finds *a* path fast but not always the shortest. Picking the heuristic is the whole job.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The algorithm in five lines" },
    {
      type: "ol",
      items: [
        "Give every node a `g`-score (cost from start) and `f`-score (`g + h`, where `h` estimates cost to goal). Start gets `g = 0`, `f = h(start)`; everyone else gets `g = ∞`.",
        "Put `start` in a min-priority queue keyed by `f`.",
        "Loop: pop the node `u` with the smallest `f`. If `u` is the goal, reconstruct and return the path.",
        "For each neighbour `v`: compute tentative `g = g(u) + w(u, v)`. If it beats `g(v)`, update `g(v)`, set `f(v) = g(v) + h(v)`, record `parent(v) = u`, and push `(v, f(v))` into the queue.",
        "If the queue empties before you reach the goal, no path exists.",
      ],
    },
    { type: "h", text: "Heuristic rules" },
    {
      type: "ul",
      items: [
        "**Admissible**: `h(n)` ≤ true remaining cost. Required for optimality. Example: Manhattan distance on a 4-directional grid, Euclidean distance on Euclidean roads.",
        "**Consistent (monotone)**: `h(u) ≤ w(u, v) + h(v)` for every edge. Required to avoid re-expanding settled nodes. Implies admissible.",
        "**The closer h is to the true cost, the better**: A* with a perfect heuristic expands only the nodes on the optimal path. With `h ≡ 0` it degenerates to Dijkstra. The closer `h` is to optimal, the fewer nodes you touch.",
        "**Overestimating** breaks optimality: you'll find *a* path quickly but not always the shortest. Weighted A* (use `f = g + w·h` with `w > 1`) intentionally trades optimality for speed; common in real-time planners.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Manhattan distance on a grid",
      text: "For a 4-directional grid with unit movement cost, the Manhattan distance `|x₁ - x₂| + |y₁ - y₂|` is both admissible and consistent — you can't reach the goal in fewer steps than that, and the heuristic never *jumps* by more than the cost of one move. If you allow diagonals, use the Chebyshev distance `max(|x|, |y|)` instead; for Euclidean movement, use plain `√((Δx)² + (Δy)²)`.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Inadmissible heuristics are a real choice",
      text: "If you don't need provably-optimal paths — e.g. game pathfinding where 'good enough fast' beats 'best slow' — overshooting `h(n)` by a constant factor can give you 5-10× speedups. This is *weighted A**: `f(n) = g(n) + w · h(n)` with `w > 1` returns paths within a factor `w` of optimal but with vastly less expansion. Common in real-time-strategy games and motion planning.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Pathfinding with a known goal and a useful heuristic** — games, GPS routing, robotics motion planning. Anywhere there's a meaningful distance estimate.",
        "**Grid worlds** — Manhattan / Chebyshev / Euclidean heuristics are all admissible and very effective.",
        "**Roads and maps** — straight-line Euclidean distance is admissible (real roads can't be shorter than straight lines).",
        "**Puzzle solving** — 15-puzzle and Rubik's cube solvers use A* with pattern-database heuristics.",
        "**Constraint search** — A* on the search tree of partial assignments, with the heuristic being an LP-relaxation lower bound.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**No good heuristic available** — A* with `h ≡ 0` is just Dijkstra. Use Dijkstra directly; it's simpler.",
        "**Multiple goals or multiple sources** — A* is single-goal. Use Dijkstra (single-source-all-targets) or run A* multiple times.",
        "**Memory-constrained search** — A* can hold the entire frontier in memory. Use **IDA*** (iterative deepening A*) for tree-shaped search spaces where the frontier is huge.",
        "**You want to find *all* shortest paths or analyse the whole graph** — A* explores a wedge toward the goal, not the whole graph. Use Dijkstra or Floyd-Warshall.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Dramatically faster than Dijkstra** when the heuristic is good — orders of magnitude on road networks.",
      "**Provably optimal** with an admissible heuristic; admissibly *and* consistent means no node is ever re-expanded.",
      "**Same skeleton as Dijkstra** — if you have Dijkstra working, A* is one line change.",
      "**Tunable** via the heuristic — start with `h ≡ 0` for correctness, scale up to weighted A* for speed.",
      "**Composable** with other tricks — bidirectional A*, jump-point search on grids, contraction hierarchies for road networks.",
    ],
    cons: [
      "**Picking a heuristic is the hard part** — a bad one makes A* worse than Dijkstra.",
      "**Single goal only** — for all-pairs or multi-source you need a different algorithm.",
      "**Memory can balloon** on big open searches — the open set can hold a large fraction of the graph in the worst case.",
      "**Inadmissible heuristics break optimality** — you have to be careful what you trade away.",
      "**Doesn't handle negative edges** — same restriction as Dijkstra.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through one path-find",
      body: "Press **Play** with the default Manhattan heuristic. Watch the orange wedge of expanded cells reach toward the goal — much narrower than Dijkstra's circular wave. The final path is highlighted in green once the goal pops off the queue.",
    },
    {
      title: "02 · Step through one expansion at a time",
      body: "Hit **Step** to expand the next cell from the open set. Each cell shows its `g` and `f` values; the cells with the smallest `f` are tried first. Notice cells *off the direct path* get inspected too — those are the candidates for routing around the wall.",
    },
    {
      title: "03 · Switch the heuristic to Dijkstra (h = 0)",
      body: "Use the **Heuristic** dropdown to set `h ≡ 0`. The algorithm becomes Dijkstra: expansion fans out in concentric rings around the start, not toward the goal. Count the *Expanded* stat — typically 3-5× more cells than Manhattan A* on the same grid.",
    },
    {
      title: "04 · Re-run with a wall in a different place",
      body: "Click any open cell to add or remove a wall. Run again. Watch how A* adapts — when the direct path is blocked, the wedge bulges around the wall. Try a wall that *splits* the grid: A* expands almost the whole map before reporting no path exists.",
    },
  ],

  code: {
    language: "typescript",
    filename: "astar.ts",
    code: `// A* on a grid with Manhattan-distance heuristic.
type Cell = { x: number; y: number };
const key = (c: Cell) => \`\${c.x},\${c.y}\`;

function manhattan(a: Cell, b: Cell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function astar(
  start: Cell,
  goal: Cell,
  passable: (c: Cell) => boolean,
): Cell[] | null {
  const g = new Map<string, number>([[key(start), 0]]);
  const parent = new Map<string, Cell>();
  // Open set: [f-score, cell]; in production use a binary heap.
  const open: Array<[number, Cell]> = [[manhattan(start, goal), start]];

  while (open.length > 0) {
    open.sort((a, b) => a[0] - b[0]);     // real code: heap.pop()
    const [, cur] = open.shift()!;
    if (cur.x === goal.x && cur.y === goal.y) return reconstruct(parent, cur);

    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nb: Cell = { x: cur.x + dx, y: cur.y + dy };
      if (!passable(nb)) continue;
      const tentativeG = (g.get(key(cur)) ?? Infinity) + 1;
      if (tentativeG < (g.get(key(nb)) ?? Infinity)) {
        g.set(key(nb), tentativeG);
        parent.set(key(nb), cur);
        open.push([tentativeG + manhattan(nb, goal), nb]);
      }
    }
  }
  return null;             // no path
}

function reconstruct(parent: Map<string, Cell>, cur: Cell): Cell[] {
  const path = [cur];
  while (parent.has(key(cur))) { cur = parent.get(key(cur))!; path.unshift(cur); }
  return path;
}`,
  },

  furtherReading: [
    {
      label: "Hart, Nilsson, Raphael — *A formal basis for the heuristic determination of minimum cost paths* (1968)",
      href: "https://ai.stanford.edu/~nilsson/OnlinePubs-Nils/PublishedPapers/astar.pdf",
      note: "The original A* paper. Proves the admissibility and consistency conditions and introduces the f = g + h formulation.",
      kind: "paper",
    },
    {
      label: "Amit Patel — *Introduction to A**",
      href: "https://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html",
      note: "The canonical online tutorial. Step-by-step animations, heuristic discussion, and comparisons with BFS/Dijkstra/Greedy-BFS.",
      kind: "article",
    },
    {
      label: "Russell & Norvig — *Artificial Intelligence: A Modern Approach*, Chapter 3",
      href: "https://aima.cs.berkeley.edu/",
      note: "Textbook treatment of A* in the broader context of informed search. Includes IDA*, weighted A*, and the heuristic-design discussion.",
      kind: "book",
    },
    {
      label: "Daniel Harabor — *Jump Point Search*",
      href: "https://harabor.net/data/papers/harabor-grastien-aaai11.pdf",
      note: "A modern grid-A* speedup that exploits grid symmetry to skip whole runs of cells. Often 10× faster than vanilla A* on uniform-cost grids.",
      kind: "paper",
    },
    {
      label: "Sebastian Lague — *A* Pathfinding video series*",
      href: "https://www.youtube.com/playlist?list=PLFt_AvWsXl0cq5Umv3pMC9SPnKjfp9eGW",
      note: "Excellent visual walkthrough of A* in Unity — narration is clear and the visualisations are the best on YouTube.",
      kind: "video",
    },
    {
      label: "Wikipedia — A* search algorithm",
      href: "https://en.wikipedia.org/wiki/A*_search_algorithm",
      note: "Solid reference covering all the variants — IDA*, SMA*, weighted A*, bidirectional A* — and the heuristic-design tradeoffs.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "as-q1",
      question:
        "What is the priority A* uses when popping the next node from its open set?",
      options: [
        { id: "a", label: "`h(n)` — the heuristic estimate of cost to goal." },
        { id: "b", label: "`g(n)` — the cost from start to n (this is what Dijkstra uses)." },
        { id: "c", label: "`f(n) = g(n) + h(n)` — total estimated path cost through n." },
        { id: "d", label: "The node's degree in the graph." },
      ],
      correctOptionId: "c",
      explanation:
        "A*'s priority combines what we know (`g`, the actual cost so far) with what we estimate (`h`, the heuristic). `f = g + h` is the estimated total path cost — minimising this picks the node most likely to be on a short path to the goal. With `h ≡ 0`, A* degenerates to Dijkstra (priority = `g`); with `g` ignored, it degenerates to greedy best-first search (priority = `h`).",
    },
    {
      id: "as-q2",
      question:
        "Under what condition on the heuristic is A* guaranteed to return the optimal (shortest) path?",
      options: [
        { id: "a", label: "The heuristic returns the exact remaining distance." },
        { id: "b", label: "The heuristic is admissible — it never overestimates the true remaining cost." },
        { id: "c", label: "The heuristic is positive." },
        { id: "d", label: "The heuristic is monotone but possibly overestimating." },
      ],
      correctOptionId: "b",
      explanation:
        "Admissibility (h(n) ≤ true remaining cost) is sufficient for A* to find the optimal path. If h ever overestimates, A* might pop a sub-optimal node off the open set before the truly best one — and commit to it. Consistency (a stronger condition) additionally guarantees no node is ever re-expanded, but admissibility alone is enough for optimality.",
    },
    {
      id: "as-q3",
      question:
        "What happens if you run A* with `h(n) = 0` for every node?",
      options: [
        { id: "a", label: "A* runs forever." },
        { id: "b", label: "A* still works but returns a sub-optimal path." },
        { id: "c", label: "A* degenerates exactly to Dijkstra's algorithm — same shortest paths, but no goal-bias, so it expands far more nodes." },
        { id: "d", label: "A* refuses to start." },
      ],
      correctOptionId: "c",
      explanation:
        "With h ≡ 0, the priority becomes `f = g + 0 = g`, which is Dijkstra's priority. The algorithm still finds the shortest path (h = 0 is admissible — it never overestimates), but without the goal-bias it expands cells radially around the start. That's exactly why A* exists: a useful `h` cuts the expanded set down to a wedge aimed at the goal.",
    },
  ],
};
