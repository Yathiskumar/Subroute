import type { ConceptContent } from "@/lib/content/types";

export const floydWarshall: ConceptContent = {
  prototypeCaption:
    "A V×V distance matrix lit up cell-by-cell. Press **Play** to watch Floyd-Warshall sweep through every intermediate node `k`, every source `i`, and every target `j`, asking 'is `i → k → j` cheaper than the direct path I had before?'. **Step** / **Back** walk one cell update at a time.",

  overview: [
    {
      type: "p",
      text: "**Floyd-Warshall computes the shortest path between *every* pair of nodes — in three nested loops.** No priority queues, no relaxation queues, just a V×V distance matrix and a triple `for` loop. The algorithm is roughly five lines long and still ships in production whenever the graph is small and dense enough that 'all pairs at once' is what you actually want.",
    },
    {
      type: "p",
      text: "The trick is **dynamic programming over intermediate nodes**. Define `dist[k][i][j]` as the shortest path from `i` to `j` using only nodes `{1, 2, …, k}` as intermediates. The base case is `dist[0][i][j]` = the direct edge weight (or ∞). The recurrence is `dist[k][i][j] = min(dist[k-1][i][j], dist[k-1][i][k] + dist[k-1][k][j])` — either you skip node `k` and use the answer you had, or you go through `k`. After processing every `k` from 1 to V, the matrix holds shortest paths using *any* intermediate, i.e. the true all-pairs shortest paths.",
    },
    {
      type: "p",
      text: "The standard implementation drops the `k` dimension by overwriting the matrix in place — the recurrence is safe to do that because the row and column for `k` don't change during pass `k`. The runtime is O(V³), the memory is O(V²), and the algorithm handles negative edges (but not negative cycles — those make the answer undefined, and Floyd-Warshall detects them via a negative diagonal entry).",
    },
  ],

  howItWorks: [
    { type: "h", text: "The algorithm in three loops" },
    {
      type: "ol",
      items: [
        "Initialise: `dist[i][j] = w(i, j)` for every edge, `dist[i][i] = 0`, everything else `∞`.",
        "For every intermediate node `k`:",
        "&nbsp;&nbsp;For every source `i`:",
        "&nbsp;&nbsp;&nbsp;&nbsp;For every target `j`: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.",
        "Done. `dist[i][j]` is the shortest path from `i` to `j` for every pair.",
      ],
    },
    { type: "h", text: "Why the order of loops matters" },
    {
      type: "ul",
      items: [
        "**`k` must be the outermost loop.** It corresponds to adding intermediate nodes one at a time. After pass `k`, every shortest path that uses only `{1, …, k}` as intermediates is correctly computed.",
        "Swapping `i` or `j` to be outer breaks the recurrence: you'd update `dist[i][j]` using an already-updated `dist[i][k]` or `dist[k][j]`, double-counting node `k`.",
        "**Negative-cycle detection**: after the algorithm finishes, check every diagonal entry. If `dist[i][i] < 0` for any `i`, that node sits on a negative cycle, and shortest paths involving it are undefined.",
        "**Path reconstruction**: keep a `next[i][j]` matrix and update `next[i][j] = next[i][k]` whenever you take the through-`k` branch. Walk the matrix to rebuild the path.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Compare with V calls to Dijkstra",
      text: "V independent Dijkstra runs cost O(V · (V + E) log V). On a *sparse* graph (E ≈ V) that's O(V² log V), beating Floyd-Warshall's O(V³). On a *dense* graph (E ≈ V²) it's O(V³ log V), so Floyd-Warshall wins. The crossover is at roughly E ≈ V² / log V — but for V < a few hundred, Floyd-Warshall's tiny constant factor often makes it the practical winner regardless.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Use a sentinel for infinity carefully",
      text: "`dist[i][k] + dist[k][j]` overflows if both are `INT_MAX`. Real implementations use `Long.MAX_VALUE / 2` (or `Infinity` in JS) as the sentinel, or skip the addition when either operand is the sentinel. This bites everyone the first time they write Floyd-Warshall in C/Java.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**All-pairs shortest paths on a small dense graph** — anywhere V < ~500 and you want every pair, Floyd-Warshall's three lines beat the V-Dijkstras setup overhead.",
        "**Transitive closure** — replace `min(+)` with `OR(AND)` and you get the boolean reachability matrix (Warshall's original 1962 algorithm).",
        "**Network diameter / radius** — the max entry in the matrix is the graph's diameter; the min of max-per-row is the radius. Floyd-Warshall gives them in O(V³).",
        "**Detecting negative cycles** — any negative diagonal entry signals a node trapped in a negative cycle.",
        "**Regex-to-NFA conversion (Kleene's algorithm)** — same triple-loop pattern; the matrix entries become regular expressions instead of distances.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Single source on a non-trivial graph** — use **Dijkstra**. O((V + E) log V) is far better than O(V³).",
        "**Sparse graph, need all pairs** — use **Johnson's algorithm**: one Bellman-Ford to reweight, then V Dijkstras. O(V·E·log V) instead of O(V³).",
        "**V > a few thousand** — O(V³) hits the wall. V = 5000 means ~10¹¹ operations.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Three lines of code** — the inner loop is one line. Hard to get wrong, easy to verify.",
      "**Handles negative edges** — and detects negative cycles via the diagonal-entry check.",
      "**No data structures beyond a matrix** — no heaps, no priority queues, no queues. Just two arrays.",
      "**Cache-friendly** — the inner loop is a tight matrix scan; modern CPUs love this and can SIMD-vectorise it.",
      "**Generalises** — the (min, +) semiring becomes (OR, AND) for reachability or (regex-union, regex-concat) for finite-automata problems.",
    ],
    cons: [
      "**O(V³)** — V = 1000 is already a billion operations; V = 10000 is hopeless.",
      "**O(V²) memory** — same wall: a 5000-node matrix of doubles is 200 MB.",
      "**Computes all V² pairs even if you only need one** — wasteful for single-source queries.",
      "**No early exit** — runs through every (k, i, j) triple even when the answer stabilises early.",
    ],
  },

  handsOn: [
    {
      title: "01 · Play through a full V³ sweep",
      body: "Press **Play** and watch the matrix light up one cell at a time. The orange highlight tracks the current `(k, i, j)` triple. Notice the cells that *change*: each update is a discovery that going through `k` is cheaper than the previous best.",
    },
    {
      title: "02 · Step through cell by cell",
      body: "Hit **Step** to advance one `(k, i, j)` update. The narration tells you whether the new path `i → k → j` improved on the existing `dist[i][j]`. **Back** rewinds the update: the cell returns to its pre-update value.",
    },
    {
      title: "03 · Try a different graph",
      body: "Switch the **Graph** dropdown between *Dense*, *Path*, and *Negative edge*. Watch how the matrix fills in differently — dense graphs fill from the start, path graphs fill column-by-column, and negative edges produce mid-algorithm distance drops you wouldn't see in Dijkstra.",
    },
    {
      title: "04 · Find the graph's diameter",
      body: "After the algorithm finishes, scan the matrix for the largest finite entry. That's the graph's *diameter* — the longest shortest-path distance between any two nodes. The graph's *radius* (min row-max) tells you the most central node — a useful primitive for facility-location problems.",
    },
  ],

  code: {
    language: "typescript",
    filename: "floyd-warshall.ts",
    code: `// Floyd-Warshall — all-pairs shortest paths in O(V³).
// Handles negative edges; detects negative cycles via diagonal.
function floydWarshall(weight: number[][]): number[][] {
  const n = weight.length;
  // Copy so we don't mutate the input.
  const dist = weight.map(row => row.slice());

  // Initialise: distance to self is 0, missing edges already ∞.
  for (let i = 0; i < n; i++) dist[i][i] = 0;

  // The triple loop — k MUST be outermost.
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      // Tiny win: skip rows that can't reach k.
      if (dist[i][k] === Infinity) continue;
      for (let j = 0; j < n; j++) {
        const through = dist[i][k] + dist[k][j];
        if (through < dist[i][j]) dist[i][j] = through;
      }
    }
  }

  // Negative-cycle check: any negative diagonal entry means
  // that node sits on a negative cycle.
  for (let i = 0; i < n; i++) {
    if (dist[i][i] < 0) throw new Error("negative cycle detected");
  }
  return dist;
}

// To reconstruct paths, keep a \`next[i][j]\` matrix:
// next[i][j] starts as j (direct edge); update to next[i][k] when k improves dist[i][j].`,
  },

  furtherReading: [
    {
      label: "Robert Floyd — *Algorithm 97: Shortest path* (1962)",
      href: "https://dl.acm.org/doi/10.1145/367766.368168",
      note: "The original five-line CACM publication. Hard to find a more economical algorithm presentation in the literature.",
      kind: "paper",
    },
    {
      label: "Stephen Warshall — *A theorem on Boolean matrices* (1962)",
      href: "https://dl.acm.org/doi/10.1145/321105.321107",
      note: "Warshall's original transitive-closure paper from the same year — the AND/OR analogue. Combined with Floyd's distance version, this is where the name comes from.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, §25.2 (Floyd-Warshall)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The DP derivation in textbook form, with path-reconstruction and the negative-cycle proof.",
      kind: "book",
    },
    {
      label: "Stanford CS 261 — All-pairs shortest paths (notes)",
      href: "https://web.stanford.edu/class/cs261/2024/notes/l4.pdf",
      note: "Comparison of Floyd-Warshall vs Johnson's algorithm on sparse vs dense graphs, with the crossover analysis.",
      kind: "article",
    },
    {
      label: "Competitive Programming Handbook — §13 (Shortest paths)",
      href: "https://cses.fi/book/book.pdf",
      note: "Antti Laaksonen's free book on competitive algorithms. Floyd-Warshall section is concise and example-driven.",
      kind: "book",
    },
    {
      label: "Wikipedia — Floyd-Warshall algorithm",
      href: "https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm",
      note: "Solid reference with the path-reconstruction code and the Schulze method (electoral pairwise-winner) variant.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "fw-q1",
      question:
        "Why must `k` be the outermost loop in Floyd-Warshall?",
      options: [
        { id: "a", label: "Because `k` represents the source node and must be processed first." },
        { id: "b", label: "Because the recurrence `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])` requires `dist[i][k]` and `dist[k][j]` to be the values *before* this pass — putting `k` outermost ensures that's still true when we drop the `k` dimension and overwrite in place." },
        { id: "c", label: "Because compilers vectorise the outermost loop best." },
        { id: "d", label: "Because `k` is a smaller variable than `i` or `j`." },
      ],
      correctOptionId: "b",
      explanation:
        "The DP recurrence says: shortest path using intermediates {1..k} = either skip k (use the {1..k-1} answer) or go through k (using the {1..k-1} answers for i → k and k → j). Overwriting in place is safe only because during pass k, the row and column for k don't change. Putting i or j outermost breaks that — you'd read an updated dist[i][k] that already used k as intermediate, double-counting.",
    },
    {
      id: "fw-q2",
      question:
        "How does Floyd-Warshall detect a negative cycle?",
      options: [
        { id: "a", label: "The triple loop runs forever." },
        { id: "b", label: "The matrix becomes asymmetric." },
        { id: "c", label: "Some diagonal entry `dist[i][i]` becomes negative — meaning node `i` can reach itself via a cycle of negative total weight." },
        { id: "d", label: "An edge gets relaxed in the V-th pass, like Bellman-Ford." },
      ],
      correctOptionId: "c",
      explanation:
        "After the algorithm finishes, `dist[i][i]` should be 0 (or unchanged if i is isolated). If it's negative, it means there's a path i → ... → i that costs less than 0 — that's a negative cycle. The fix in practice is to either bail with an error or mark all entries reachable through the cycle as -∞.",
    },
    {
      id: "fw-q3",
      question:
        "When does V calls to Dijkstra beat Floyd-Warshall for all-pairs shortest paths?",
      options: [
        { id: "a", label: "Never — Floyd-Warshall is always faster." },
        { id: "b", label: "When the graph is *sparse* (E close to V): V Dijkstras run in O(V² log V) vs Floyd-Warshall's O(V³)." },
        { id: "c", label: "When the graph is *dense* (E close to V²)." },
        { id: "d", label: "Only when V is greater than 10000." },
      ],
      correctOptionId: "b",
      explanation:
        "V Dijkstras costs O(V · (V + E) log V). On a sparse graph (E ≈ V), that's O(V² log V), which beats O(V³) once V is reasonably big. On a dense graph (E ≈ V²), V Dijkstras is O(V³ log V), so Floyd-Warshall's tighter inner loop wins. The crossover is roughly E ≈ V² / log V — but for small V, Floyd-Warshall's constant factor often wins anyway. For sparse graphs with negative edges, use **Johnson's algorithm** (one Bellman-Ford + V Dijkstras after reweighting).",
    },
  ],
};
