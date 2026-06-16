import type { ConceptContent } from "@/lib/content/types";

export const cyclicGraph: ConceptContent = {
  prototypeCaption:
    "A six-vertex undirected graph across four tabs, all driven by a depth-first search. **Find the cycle** runs DFS on a graph that loops and stops the instant an edge reaches a vertex still on the DFS stack — a back edge — then paints the loop red; **The acyclic case** runs the same DFS on a tree and shows that no back edge ever appears; **Break the cycle** removes one edge of the loop and re-runs to prove a single cut makes the graph acyclic. **Free play** lets you click two vertices to toggle an edge, drag vertices, and hit **Detect cycle** to run DFS on your own graph — the *on stack* and *result* stats update live.",

  overview: [
    {
      type: "p",
      text: "**A cyclic graph is one you can walk in a circle: start at some vertex, follow edges, and arrive back where you began without retracing a step.** That closed walk is a *cycle*. A graph with even one such loop is *cyclic*; a graph with none is *acyclic* (and a connected acyclic graph is exactly a tree). The whole topic is really one question — *is there a loop?* — and the interesting part is how you answer it without eyeballing the picture.",
    },
    {
      type: "p",
      text: "The answer is a depth-first search, and it hinges on a single idea: the **DFS stack**. As DFS dives into the graph it keeps a stack of the vertices on the current path — the chain of \"I'm still busy exploring this one\" nodes between the root and where you are now. A vertex is *on the stack* while DFS is working inside its subtree, and only comes off when DFS has finished everything below it. A cycle exists *exactly* when you follow an edge and land on a vertex that is **still on the stack** — that edge is a **back edge**, and it closes a loop with the path already on the stack.",
    },
    {
      type: "p",
      text: "One subtlety makes the undirected case its own thing: the edge straight back to your *parent* doesn't count. Every undirected edge can be walked both ways, so from a child you'll always *see* the edge back to the vertex you just came from — but that's not a loop, it's the same edge. So the rule is sharpened: a cycle is a back edge to an on-stack vertex **that is not your parent**. Get that one exception right and DFS detects cycles in O(V + E), the same cost as visiting the graph once.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Three colours, one stack" },
    {
      type: "ul",
      items: [
        "**White (unseen)** — DFS hasn't reached this vertex yet.",
        "**On stack** — DFS has entered this vertex but hasn't finished it; it sits on the current path. These are the vertices a back edge can hit.",
        "**Done** — DFS has explored everything reachable below this vertex and popped it off the stack. An edge to a *done* vertex is harmless: it left the stack, so it can't close a loop on the current path.",
        "**The DFS stack** is just the on-stack vertices in order, root at the bottom, the vertex you're currently inside at the **top**.",
      ],
    },
    { type: "h", text: "The detection rule" },
    {
      type: "ol",
      items: [
        "Run DFS from any unvisited vertex (repeat for each component so disconnected pieces are covered).",
        "On entering a vertex, push it onto the stack and mark it *on stack*.",
        "For each neighbour: if it's the **parent** you just came from, skip it — that's the same undirected edge, not a loop.",
        "If the neighbour is **white**, recurse into it (it goes on the stack on top of you).",
        "If the neighbour is **on stack** (and not the parent), you've found a **back edge** — a cycle. The loop is the stack slice from that neighbour up to the current vertex, plus the back edge.",
        "When a vertex's neighbours are exhausted, pop it (mark *done*). If DFS finishes with no back edge ever found, the graph is acyclic.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why \"on the stack\", not just \"visited\"",
      text: "A common bug is to flag a cycle whenever you reach an *already-visited* vertex. That's wrong: a *done* vertex was visited but has already left the stack, so reaching it just means two paths met — no loop on the current path. The cycle test is specifically \"still on the stack.\" In CLRS terms the three colours are white / gray / black, and a cycle is a *gray edge* (an edge to a gray, i.e. on-stack, vertex).",
    },
    {
      type: "callout",
      variant: "tip",
      title: "The edge-count shortcut",
      text: "For a connected undirected graph you don't even need DFS to know *whether* a cycle exists: a tree on n vertices has exactly n − 1 edges, so any connected graph with n or more edges must contain a cycle. With 6 vertices, 5 edges can be acyclic (a tree) but 6 edges cannot. DFS earns its keep when you want to *find* the loop, handle multiple components, or detect cycles in a directed graph where the edge count alone won't tell you.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Care about cycles when" },
    {
      type: "ul",
      items: [
        "**You're checking for deadlock or circular dependency** — a cycle in a resource-wait graph or an import graph is a bug you must find and break.",
        "**You need a tree or spanning structure** — adding an edge is only safe if it *doesn't* close a loop; that's exactly the test Kruskal's and union-find use to build a minimum spanning tree.",
        "**You're validating a schedule or build order** — a topological order exists only when the dependency graph is acyclic, so cycle detection is the precondition for ordering anything.",
        "**You want graph structure** — girth (shortest cycle), feedback edge sets, and \"how many independent loops\" (the cyclomatic number m − n + c) all start from finding cycles.",
      ],
    },
    { type: "h", text: "Reach for something other than plain DFS cycle detection when" },
    {
      type: "ul",
      items: [
        "**The graph is directed** — the on-stack rule still works, but you drop the parent exception (a 2-cycle A→B→A is a real cycle), and \"done\" vs \"on stack\" becomes the whole story.",
        "**You only need to maintain acyclicity as edges arrive** — incremental **union-find** answers \"would this edge make a cycle?\" in near-constant time, faster than re-running DFS each time.",
        "**You want the shortest cycle (girth) in an unweighted graph** — a BFS-based approach is usually cleaner than instrumenting DFS.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Linear time** — one DFS pass, O(V + E), finds a cycle or proves there's none.",
      "**Constructive** — the moment it fires, the DFS stack hands you the actual cycle, not just a yes/no.",
      "**Handles disconnected graphs** — restart DFS from each unvisited vertex and every component is covered.",
      "**One idea ports everywhere** — the \"edge to an on-stack vertex\" rule extends to directed graphs (topological sort, deadlock detection) with only the parent rule dropped.",
    ],
    cons: [
      "**The parent exception is a footgun** — forget it on undirected graphs and you'll report a cycle for every single edge.",
      "**Recursion depth** — a naive recursive DFS can blow the call stack on a long path; deep graphs need an explicit stack.",
      "**Finds *a* cycle, not the best one** — plain DFS gives you whichever loop it hits first, not the shortest (girth) or any particular one.",
      "**Re-runs from scratch** — if edges are arriving one at a time, re-running DFS per edge is wasteful; union-find is the incremental tool.",
    ],
  },

  handsOn: [
    {
      title: "01 · Find the cycle",
      body: "On **Find the cycle**, press **Play**. DFS dives from **A**, pushing each vertex onto the stack shown in the side panel (the **top** is marked). Watch it walk A → B → E → D and then test the edge **D–A**: A is *still on the stack*, so this is a back edge and the loop snaps red. The narration names the cycle and the *result* stat flips to **Cyclic**. Use **Step** / **Back** to inspect the exact moment the back edge is found.",
    },
    {
      title: "02 · The acyclic case",
      body: "Switch to **The acyclic case** — same DFS, but the preset is a *tree* (5 edges, 6 vertices). Play it through and watch the stack grow and shrink as DFS dives and backtracks. Every edge it tests either leads to a *white* vertex (go deeper) or straight back to the *parent* (ignored). No edge ever reaches a non-parent vertex on the stack, so no back edge is found and the *result* stays **Acyclic**.",
    },
    {
      title: "03 · Break the cycle",
      body: "**Break the cycle** starts from the looping graph and highlights the cycle in red. Then it *removes one edge* of that loop and re-runs DFS — and now the search completes with the stack emptying cleanly and no back edge. The takeaway is on screen: a cycle needs *every one* of its edges, so cutting any single one of them makes the whole graph acyclic. Compare the before/after panel.",
    },
    {
      title: "04 · Free play — build your own loops",
      body: "Open **Free play**. Click any two vertices to toggle an edge; drag vertices to rearrange. Build a tree first, then add one edge between two vertices that are *already connected by a path* — that single edge closes a loop. Hit **Detect cycle** to run DFS on your graph and watch the *on stack* counter rise and fall and the *result* report **Cyclic** or **Acyclic**. **Clear edges** to start from scratch.",
    },
  ],

  code: {
    language: "typescript",
    filename: "cyclic-graph.ts",
    code: `// Undirected cycle detection by DFS.
// A cycle exists iff DFS finds an edge to a vertex that is
// STILL ON THE STACK (i.e. an ancestor) and isn't the parent.
function hasCycle(adj: Map<string, string[]>): boolean {
  const onStack = new Set<string>();   // vertices on the current DFS path
  const done = new Set<string>();      // fully explored vertices

  function dfs(u: string, parent: string | null): boolean {
    onStack.add(u);                    // push: u is on the path now
    for (const v of adj.get(u) ?? []) {
      if (v === parent) continue;      // the edge back to parent is NOT a cycle
      if (onStack.has(v)) return true; // back edge -> v is an ancestor -> cycle!
      if (!done.has(v) && dfs(v, u)) return true;
    }
    onStack.delete(u);                 // pop: u and its subtree are finished
    done.add(u);
    return false;
  }

  // Restart for every component so disconnected pieces are covered.
  for (const start of adj.keys()) {
    if (!done.has(start) && dfs(start, null)) return true;
  }
  return false;
}

// To return the cycle itself, keep an explicit array stack and, on the
// back edge u->v, slice it from the first occurrence of v up to u.`,
  },

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, §20.3 (DFS) & §20.4 (classifying edges)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The white/gray/black colouring and the theorem that a graph has a cycle iff DFS produces a back edge.",
      kind: "book",
    },
    {
      label: "Wikipedia — Cycle (graph theory)",
      href: "https://en.wikipedia.org/wiki/Cycle_(graph_theory)",
      note: "Definitions of cycles, girth, chordless cycles, and the difference between cycle detection in undirected vs directed graphs.",
      kind: "article",
    },
    {
      label: "Wikipedia — Cycle detection / depth-first search",
      href: "https://en.wikipedia.org/wiki/Depth-first_search",
      note: "How DFS classifies tree/back/forward/cross edges and why a back edge is exactly the signature of a cycle.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Graph traversal (DFS/BFS)",
      href: "https://visualgo.net/en/dfsbfs",
      note: "Animated DFS where you can watch the recursion stack and back-edge detection on a graph of your choice.",
      kind: "video",
    },
    {
      label: "Skiena — *The Algorithm Design Manual*, Ch. 5 (Graph Traversal)",
      href: "https://www.algorist.com/",
      note: "Practical cycle-detection recipes for both undirected and directed graphs, with the union-find alternative discussed.",
      kind: "book",
    },
    {
      label: "Khan Academy — Connected components & graph traversal",
      href: "https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/describing-graphs",
      note: "Gentle grounding in paths, trees vs graphs with loops, and why a tree has exactly n − 1 edges.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "cyc-q1",
      question:
        "During a DFS on an undirected graph, you follow an edge and arrive at a vertex. In which case have you found a cycle?",
      options: [
        { id: "a", label: "The vertex is white (not yet seen)." },
        { id: "b", label: "The vertex is on the DFS stack and is not the parent you just came from." },
        { id: "c", label: "The vertex is already marked done (fully explored)." },
        { id: "d", label: "The vertex is the parent you came from." },
      ],
      correctOptionId: "b",
      explanation:
        "A cycle is a *back edge*: an edge to a vertex still on the current DFS path (the stack), excluding the immediate parent. A white vertex means go deeper; a done vertex has already left the stack so it can't close a loop on the current path; the parent edge is the same undirected edge walked backward, not a loop.",
    },
    {
      id: "cyc-q2",
      question:
        "A connected undirected graph has 6 vertices. What is the largest number of edges it can have while still being acyclic?",
      options: [
        { id: "a", label: "5" },
        { id: "b", label: "6" },
        { id: "c", label: "15" },
        { id: "d", label: "It can be acyclic with any number of edges." },
      ],
      correctOptionId: "a",
      explanation:
        "A connected acyclic graph is a tree, and a tree on n vertices has exactly n − 1 edges — here 6 − 1 = 5. Add even one more edge (a 6th) and it must connect two already-connected vertices, closing a cycle. That n − 1 bound is why the edge count alone can sometimes settle the question.",
    },
    {
      id: "cyc-q3",
      question:
        "You've found a cycle in a graph and want to make the graph acyclic with the fewest edge removals. How many edges of that single cycle must you remove?",
      options: [
        { id: "a", label: "All of them — a cycle is only broken when every edge is gone." },
        { id: "b", label: "Exactly one — removing any single edge of the loop breaks it." },
        { id: "c", label: "Half of them, rounded up." },
        { id: "d", label: "None — cycles can't be removed without deleting a vertex." },
      ],
      correctOptionId: "b",
      explanation:
        "A cycle is a closed chain, so cutting any one of its edges opens the chain and the loop is gone — that's what the *Break the cycle* tab demonstrates. A cycle needs *every* one of its edges to stay closed, so removing a single edge is enough to destroy that particular cycle.",
    },
  ],
};
