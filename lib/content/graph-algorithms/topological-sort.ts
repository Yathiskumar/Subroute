import type { ConceptContent } from "@/lib/content/types";

export const topologicalSort: ConceptContent = {
  prototypeCaption:
    "A 7-node DAG with two algorithm tabs. **Kahn's algorithm (BFS)** pulls zero-in-degree nodes from a queue. **DFS (reverse post-order)** runs DFS and prepends each node when its subtree finishes. Both produce a valid build order — switch tabs to compare. **Try cycle** loads a graph with a cycle to show both algorithms correctly refusing.",

  overview: [
    {
      type: "p",
      text: "**A topological sort lays out the nodes of a DAG in a line so every edge points forward.** If A must happen before B, then A sits to the left of B in the order. It's the right answer to 'what order should I do these tasks in, given that some require others?' — and the wrong question to even ask if your graph has a cycle.",
    },
    {
      type: "p",
      text: "There are two standard algorithms, both O(V + E) and both built on a traversal you already know. **Kahn's algorithm** repeatedly finds a node with zero remaining prerequisites (in-degree zero), emits it, then decrements its successors' in-degrees. It's the BFS-flavoured one — easy to write iteratively, easy to *parallelise* (all in-degree-zero nodes can run at the same time). **DFS post-order** runs DFS and appends each node to a list the moment its DFS call returns; reverse the list and you have a topological order. It's the DFS-flavoured one — three extra lines on top of plain DFS.",
    },
    {
      type: "p",
      text: "If you've ever waited for `npm install` to compute its install order, watched `make` skip a build step, queued tasks in Airflow, run a Spark DAG, or written a course-prerequisite recommender — you've used a topological sort. The same idea shows up in symbol resolution inside compilers, dependency injection containers, and database query planners.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Kahn's algorithm — the BFS-style one" },
    {
      type: "ol",
      items: [
        "Compute the **in-degree** of every node (how many edges point at it).",
        "Put every in-degree-zero node into a queue — these have no prerequisites.",
        "Loop: dequeue a node, emit it to the output, then for each of its outgoing edges decrement the neighbour's in-degree. If a neighbour's in-degree drops to zero, enqueue it.",
        "When the queue empties, you have a valid order — unless the output count is less than V, which means there was a cycle.",
      ],
    },
    { type: "h", text: "DFS post-order — the DFS-style one" },
    {
      type: "ol",
      items: [
        "Run DFS over the whole graph (loop over every node and DFS into the unvisited ones).",
        "When `dfs(node)` is about to return, push `node` onto a 'finished' stack.",
        "Reverse the finished stack — that's a valid topological order.",
        "To also detect cycles, use the white/grey/black classification — a grey-to-grey edge during DFS means there's a back edge, hence a cycle.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "There can be many valid orders",
      text: "Topological order isn't unique. If there are two in-degree-zero nodes at once, you can pick either — both produce valid orders. That's why Kahn's algorithm parallelises so well: at every step, *all* the currently in-degree-zero nodes are work that can run concurrently. Build systems like Bazel exploit this directly to drive parallel builds.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "If the graph has a cycle, there is no order",
      text: "A topological sort requires a Directed Acyclic Graph. If the graph has any cycle, both algorithms detect it: Kahn's because the output ends up shorter than V (the cycle's in-degrees never reach zero), DFS because of a grey-to-grey back edge. Production code should always check and surface a clear 'circular dependency' error — that's the kind of bug that turns a build system into an infinite loop.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Build systems** — `make`, Bazel, Webpack, CMake all topo-sort their targets to determine compile and link order.",
        "**Workflow schedulers** — Airflow, Luigi, Dagster, GitHub Actions arrange tasks in a DAG and run them in topological order, fanning out where possible.",
        "**Course / curriculum planners** — university degree-tracking tools sort courses by prerequisite so the student gets a feasible schedule.",
        "**Spreadsheet recalculation** — when a cell changes, Excel topo-sorts the dependent cells so each one updates after its inputs.",
        "**Package managers** — `pip`, `npm`, `apt`, `cargo` resolve dependencies into a topological install order.",
        "**Compilers** — type checking, symbol resolution, and IR optimisation passes all topo-sort dependency graphs (use-def, call graph).",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Your graph might have cycles** — topo sort can't help. Use **strongly connected components** to collapse the cycles into super-nodes; the resulting condensation graph is a DAG and *that* can be topo-sorted.",
        "**You need shortest paths in the DAG** — topo-sort the DAG first, *then* relax edges in topological order. Linear-time DAG shortest paths beat Dijkstra here.",
        "**You only care about reachability, not order** — a plain DFS or BFS sweep is simpler and just as fast.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Linear time** — O(V + E) for both Kahn's and DFS. Touches every node and every edge once.",
      "**Parallelism falls out naturally** — Kahn's algorithm exposes every concurrently-ready node at once. Build systems exploit this for free parallelism.",
      "**Detects cycles for free** — Kahn's via the output-count check, DFS via the back-edge test. No second pass needed.",
      "**Simple to implement** — Kahn's is ~10 lines; DFS post-order is plain DFS plus one `push` on return.",
      "**Enables linear DAG shortest paths** — once you have a topological order, you can compute single-source shortest paths in O(V + E), no priority queue needed.",
    ],
    cons: [
      "**DAG-only** — the moment there's a cycle, both algorithms refuse. You need a 'detect-and-report' fallback in production.",
      "**Order isn't unique** — fine for most uses, but if you depend on a stable order across runs you need a tiebreaker rule.",
      "**Doesn't optimise anything** — it gives you *a* valid order, not the *best* one. Critical-path scheduling on top of topo-sort is the next step.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk Kahn's algorithm (BFS)",
      body: "Stay in the **Kahn's algorithm** tab and press **Play**. Watch the in-degree counter above each node count down as edges are consumed. Every node enters the queue the *moment* its in-degree hits zero — the width of the queue at any step is the maximum parallelism your build system could exploit then.",
    },
    {
      title: "02 · Walk DFS (reverse post-order)",
      body: "Switch to the **DFS (reverse post-order)** tab. Now there's no queue — there's a call stack. DFS dives deep, then on the way back *prepends* each node to the result. The final order is different from Kahn's but still satisfies every edge.",
    },
    {
      title: "03 · Compare the two orders",
      body: "Both Kahn and DFS produce *valid* topological orders, but usually different ones. Run each through completion and look at the build-order row — every edge `u → v` in the graph has `u` before `v` in both, but the specific positions can differ wherever the graph offers a choice.",
    },
    {
      title: "04 · Try cycle to see both detectors fire",
      body: "Press **Try cycle**. In Kahn's tab the queue drains but some nodes never reach in-degree zero — *cycle detected*. Switch to DFS tab: the moment a back edge points to a node still on the call stack, the algorithm halts the same way. Same diagnosis, two different mechanisms.",
    },
  ],

  code: {
    language: "typescript",
    filename: "topological-sort.ts",
    code: `// Kahn's algorithm — BFS-flavoured topological sort with cycle detection.
function topoSortKahn(adj: Map<string, string[]>): string[] {
  // Step 1: compute in-degrees.
  const inDeg = new Map<string, number>();
  for (const u of adj.keys()) inDeg.set(u, 0);
  for (const nbs of adj.values())
    for (const v of nbs) inDeg.set(v, (inDeg.get(v) ?? 0) + 1);

  // Step 2: seed the queue with every zero-in-degree node.
  const queue: string[] = [];
  for (const [u, d] of inDeg) if (d === 0) queue.push(u);

  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj.get(u) ?? []) {
      const d = (inDeg.get(v) ?? 0) - 1;
      inDeg.set(v, d);
      if (d === 0) queue.push(v);
    }
  }

  // Step 3: cycle check.
  if (order.length !== adj.size)
    throw new Error("cycle detected — no topological order exists");
  return order;
}

// DFS post-order — same answer, three extra lines on top of DFS.
function topoSortDfs(adj: Map<string, string[]>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  function dfs(u: string) {
    seen.add(u);
    for (const v of adj.get(u) ?? []) if (!seen.has(v)) dfs(v);
    out.push(u);           // on the way back up — post-order
  }
  for (const u of adj.keys()) if (!seen.has(u)) dfs(u);
  return out.reverse();     // reverse post-order is a topological order
}`,
  },

  furtherReading: [
    {
      label: "Arthur Kahn — *Topological sorting of large networks* (1962)",
      href: "https://dl.acm.org/doi/10.1145/368996.369025",
      note: "The original paper proposing the in-degree-zero queue algorithm. Two pages, in the November 1962 CACM.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, §22.4 (Topological sort)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Clean DFS-based treatment and the proof that DAG ⇔ no back edges in DFS.",
      kind: "book",
    },
    {
      label: "GNU Make manual — *Phony targets and the dependency graph*",
      href: "https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html",
      note: "Real-world example of topological sort: `make`'s prerequisite graph and how parallel `-j` builds exploit independent branches.",
      kind: "docs",
    },
    {
      label: "Apache Airflow — *DAG scheduling concepts*",
      href: "https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html",
      note: "How a modern workflow engine uses a topological order to schedule task runs, retries, and dependencies.",
      kind: "docs",
    },
    {
      label: "Bazel — *Build dependency graph and parallelism*",
      href: "https://bazel.build/extending/rules#actions",
      note: "Google's build system uses topological order to dispatch hermetic actions in parallel; a great case study in production-grade DAG scheduling.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Topological sorting",
      href: "https://en.wikipedia.org/wiki/Topological_sorting",
      note: "Solid summary with the parallel variant (Coffman–Graham) and the connection to scheduling theory.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "topo-q1",
      question: "What is the key property of a topological order?",
      options: [
        { id: "a", label: "Every node has the same in-degree." },
        { id: "b", label: "For every edge u → v, u appears before v in the order." },
        { id: "c", label: "Nodes are sorted by alphabetical name." },
        { id: "d", label: "Every node is reachable from every other node." },
      ],
      correctOptionId: "b",
      explanation:
        "The defining property is *every edge points forward*: if u → v exists, u must appear before v in the order. There can be many valid orders for the same DAG, and the algorithm only needs to produce one of them.",
    },
    {
      id: "topo-q2",
      question:
        "Kahn's algorithm finishes with `order.length < V`. What does this mean?",
      options: [
        { id: "a", label: "There was a node with in-degree zero that didn't get enqueued — a bug in the algorithm." },
        { id: "b", label: "The graph has a cycle, so no topological order exists." },
        { id: "c", label: "The output is partially complete and you should run DFS to finish it." },
        { id: "d", label: "The graph is disconnected." },
      ],
      correctOptionId: "b",
      explanation:
        "Every node in a cycle has at least one incoming edge from inside the cycle, so its in-degree never drops to zero — the queue empties early. The output-count check is Kahn's cycle detector. Disconnected DAGs work fine: every component has its own in-degree-zero seed.",
    },
    {
      id: "topo-q3",
      question:
        "Why does the *reverse* of DFS post-order produce a topological sort?",
      options: [
        { id: "a", label: "Because DFS visits nodes in alphabetical order." },
        { id: "b", label: "Because every node finishes after all of its descendants, so reversing the finish order puts every node before its descendants — i.e. before the nodes its edges point at." },
        { id: "c", label: "Because reverse post-order is the same as pre-order." },
        { id: "d", label: "Because BFS uses a queue and DFS uses a stack." },
      ],
      correctOptionId: "b",
      explanation:
        "When DFS finishes a node u, every node reachable from u has already finished. So finish-time(u) > finish-time(v) for every descendant v. Sorting nodes by descending finish-time (reverse post-order) puts every u before every descendant v — exactly the topological property that every edge u → v points forward.",
    },
  ],
};
