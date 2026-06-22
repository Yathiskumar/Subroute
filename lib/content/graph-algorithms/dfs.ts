import type { ConceptContent } from "@/lib/content/types";

export const dfs: ConceptContent = {
  prototypeCaption:
    "A seven-node graph *with cycles* — the same graph the BFS prototype uses — walked by recursive DFS. Press **Play** to watch it dive deep down one branch, then **backtrack** when a node's neighbours are all seen. Green lines are **tree edges** (first-time discovery); a dashed red line is a **back edge** — an edge to a node still on the call stack, which means a **cycle**. Use **Step** / **Back** to walk one call or return at a time, and **Start** to re-root the search.",

  overview: [
    {
      type: "p",
      text: "**Depth-First Search dives as deep as it can, then backs up.** Start at a node. Pick the first child. Recurse. When you hit a dead-end — a node whose children are all visited — back up to the most recent node that still has unvisited children and continue. The trail you trace is a tree of 'first-time' edges, sometimes called the DFS tree.",
    },
    {
      type: "p",
      text: "Where BFS uses a queue and explores in rings, DFS uses a **stack** — usually the implicit call stack of recursion — and explores in branches. Two timestamps fall out of every visit: a **discovery time** when the node is first reached and pushed, and a **finish time** when its call returns and it's popped. Those, plus the **edge classification** DFS produces — **tree edges** (first-time discovery) versus **back edges** (an edge to a node still on the stack) — are the raw material for almost everything DFS is good at. A back edge is the textbook signature of a **cycle**.",
    },
    {
      type: "p",
      text: "That structure is the engine behind **cycle detection** (a back edge to a still-grey ancestor), **topological sort** (reverse post-order on a DAG), **connected components**, **Tarjan SCC**, and every **backtracking** solver from sudoku to maze. On a *tree* specifically — where there are no back edges — the only remaining choice is *when* you record a node relative to its children, and that single decision gives the three textbook orders: **pre-order** (record on the way down), **in-order** (between the children), and **post-order** (on the way back up). Same recursion as the graph walk; only the position of one `record(node)` line moves.",
    },
  ],

  howItWorks: [
    { type: "h", text: "What DFS does on a graph" },
    {
      type: "ol",
      items: [
        "Start at a node, mark it **grey** (discovered, now on the stack), and record its discovery number.",
        "Scan its neighbours in order. For each *unseen* neighbour, follow a **tree edge** and recurse — dive deeper before going wider.",
        "If a neighbour is **grey** (still on the stack), that edge is a **back edge** — you've found a cycle. If it's **black** (finished), skip it.",
        "When every neighbour is handled, the call returns: pop the frame, mark the node **black** (finished), record its finish number. That return *is* backtracking.",
      ],
    },
    { type: "h", text: "Why the call stack matters" },
    {
      type: "ol",
      items: [
        "Each recursive call pushes a frame on the stack — that's the 'grey' set in textbook DFS.",
        "While a frame is on the stack, its node is *in progress* — its neighbours are being visited, but it isn't finished.",
        "When the function returns, the frame pops — the node becomes 'black' (finished).",
        "A back edge to a still-grey node = a cycle. Edges to black nodes = same component, no cycle.",
      ],
    },
    { type: "h", text: "On a tree: pre-, in-, and post-order" },
    {
      type: "ul",
      items: [
        "A tree has no back edges (no cycles), so the only freedom left is *when* you record a node relative to its children.",
        "**Pre-order** (`N L R`) — record on the way *down*, at discovery time. Used to clone or serialise a tree.",
        "**In-order** (`L N R`) — record *between* the two child recursions. On a BST this yields a sorted sequence.",
        "**Post-order** (`L R N`) — record on the way *back up*, at finish time. Used to delete a tree or aggregate from the leaves up. **Reverse post-order** of a DAG is exactly a topological sort.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Recursion depth is a real problem",
      text: "On a graph with a million nodes in a long path (think a linked list), recursive DFS blows the call stack. The fix is to write it iteratively with an explicit stack — same logic, no stack-overflow risk. Most production graph engines do this.",
    },
    {
      type: "callout",
      variant: "info",
      title: "BFS vs DFS in one sentence",
      text: "**BFS** asks 'who's nearby?' first — queue, level-order, shortest paths. **DFS** asks 'where does this go?' first — stack, recursion, structural questions. Same O(V + E) cost; entirely different output.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Tree traversal** — pre/in/post-order *is* DFS with `record()` in a different spot. Every tree walk is one of these three.",
        "**Cycle detection** — the back-edge test fires the moment you see a grey-to-grey transition.",
        "**Topological sort** — reverse post-order of a DAG-DFS is a valid topo order. No extra code needed.",
        "**Connected components** — one DFS sweep from each unvisited node; everything it touches is one component.",
        "**Strongly connected components** — Tarjan's and Kosaraju's algorithms are both two DFS passes with light bookkeeping.",
        "**Backtracking problems** — maze solving, sudoku, N-queens, generating permutations. 'Undo on failure' is just popping the recursion stack.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Shortest path in an unweighted graph** — use **BFS**. DFS doesn't track distances and will happily report a long path before the short one.",
        "**Weighted shortest path** — use **Dijkstra**. DFS visit-order has nothing to do with cost.",
        "**Very deep graphs** — write DFS iteratively or use BFS; recursive DFS overflows the call stack at a few hundred thousand nodes.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Linear time** — O(V + E), same as BFS. Visits every node and edge once.",
      "**One function, three orders** — pre/in/post-order all share the recursion, differing only by where `record()` sits.",
      "**Discovers structure** — tree edges, back edges, discovery/finish times — the inputs to Tarjan SCC, articulation points, bridges.",
      "**Low memory on narrow graphs** — only needs to remember the current path: O(depth) instead of O(width).",
      "**The native shape of backtracking** — try a choice, recurse, undo on failure. Every backtracking solver is DFS in disguise.",
    ],
    cons: [
      "**No shortest-path guarantee** — DFS can find any path before the shortest one. Use BFS or Dijkstra if distance matters.",
      "**Stack overflow on deep graphs** — recursive form fails at ~1e5 nodes deep in many runtimes; switch to an explicit stack.",
      "**Visit order depends on child order** — same tree stored differently produces different traversals. Surprising for tests.",
      "**Pre/in/post are tree concepts** — on general graphs you only get pre-order (discovery time) and post-order (finish time); in-order needs a notion of 'middle child' which only exists on binary trees.",
    ],
  },

  handsOn: [
    {
      title: "01 · Dive deep, then backtrack",
      body: "Press **Play** from start **A**. Watch one branch go all the way down — `A → B → C → E → D` — *before* anything fans out. That's the stack at work: DFS commits to a path until it dead-ends. When a node's neighbours are all seen, its frame pops, the node turns green (finished), and the search backtracks to the previous node. Discovery order on this graph from A: `A B C E D G F`.",
    },
    {
      title: "02 · Spot the back edges (cycles)",
      body: "Three **dashed red** edges appear — `E–B`, `D–A`, and `F–C`. Each is an edge to a node *still on the call stack*, which is the signature of a **cycle**. The **back edges** counter climbs to 3. The 6 green tree edges plus these 3 back edges account for all 9 edges the search touches. On an acyclic graph (a tree) this counter would stay at 0.",
    },
    {
      title: "03 · Read the call stack",
      body: "The left lane is the live **call stack**, top frame marked *running*. **Step** through and watch it grow as DFS descends and shrink as each `dfs()` returns. Its maximum height is the longest root-to-leaf path the search explored — the recursion depth that would overflow a real stack on a very deep graph.",
    },
    {
      title: "04 · Re-root the search",
      body: "Pick a different **Start** node. The discovery order and *which* edges become tree vs back edges both change — but the graph's node set and its underlying cycles don't. DFS structure depends on where you start and the neighbour order; the graph itself is fixed.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "dfs-graph.ts",
      code: `// Recursive DFS on a graph (adjacency list). Records discovery /
// finish order and classifies each edge as a tree or back edge.
type Color = "white" | "grey" | "black";

function dfs(adj: Map<string, string[]>, start: string) {
  const color = new Map<string, Color>();   // white = unseen, grey = on stack, black = done
  const order: string[] = [];               // discovery order
  const backEdges: [string, string][] = []; // each one closes a cycle
  let time = 0;
  const disc = new Map<string, number>();
  const fin = new Map<string, number>();

  function visit(u: string, parent: string | null) {
    color.set(u, "grey");                    // push: discovered, now on the stack
    disc.set(u, ++time);
    order.push(u);

    for (const v of adj.get(u) ?? []) {
      if (v === parent) continue;            // skip the undirected edge we arrived on
      const c = color.get(v) ?? "white";
      if (c === "white") {
        visit(v, u);                         // tree edge — recurse deeper
      } else if (c === "grey") {
        backEdges.push([u, v]);              // back edge → cycle
      }
      // black: already finished — nothing to do
    }

    color.set(u, "black");                   // pop: this frame returns, node finished
    fin.set(u, ++time);
  }

  visit(start, null);
  return { order, backEdges, disc, fin };
}

// disc = pre-order (discovery) time; fin = post-order (finish) time.
// Reverse the nodes by finish time and you have a topological sort of a DAG.
// On a graph millions of nodes deep, rewrite this with an explicit stack.`,
    },
    {
      label: "Java",
      language: "java",
      filename: "DfsGraph.java",
      code: `import java.util.*;

// Recursive DFS on a graph (adjacency list). Records discovery /
// finish order and classifies each edge as a tree or back edge.
// white = unseen, grey = on stack, black = done
class DfsGraph {
    final Map<String, List<String>> adj;
    final Map<String, Character> color = new HashMap<>();
    final List<String> order = new ArrayList<>();               // discovery order
    final List<String[]> backEdges = new ArrayList<>();         // each one closes a cycle
    final Map<String, Integer> disc = new HashMap<>();
    final Map<String, Integer> fin = new HashMap<>();
    int time = 0;

    DfsGraph(Map<String, List<String>> adj) { this.adj = adj; }

    void dfs(String start) { visit(start, null); }

    void visit(String u, String parent) {
        color.put(u, 'g');                   // push: discovered, now on the stack
        disc.put(u, ++time);
        order.add(u);

        for (String v : adj.getOrDefault(u, List.of())) {
            if (v.equals(parent)) continue;  // skip the undirected edge we arrived on
            char c = color.getOrDefault(v, 'w');
            if (c == 'w') {
                visit(v, u);                 // tree edge — recurse deeper
            } else if (c == 'g') {
                backEdges.add(new String[]{u, v});  // back edge → cycle
            }
            // black: already finished — nothing to do
        }

        color.put(u, 'b');                   // pop: this frame returns, node finished
        fin.put(u, ++time);
    }
}

// disc = pre-order (discovery) time; fin = post-order (finish) time.
// Reverse the nodes by finish time and you have a topological sort of a DAG.
// On a graph millions of nodes deep, rewrite this with an explicit stack.`,
    },
    {
      label: "Python",
      language: "python",
      filename: "dfs_graph.py",
      code: `def dfs(adj: dict[str, list[str]], start: str):
    """Recursive DFS on a graph (adjacency list). Records discovery /
    finish order and classifies each edge as a tree or back edge."""
    color: dict[str, str] = {}   # white = unseen, grey = on stack, black = done
    order: list[str] = []        # discovery order
    back_edges: list[tuple[str, str]] = []  # each one closes a cycle
    disc: dict[str, int] = {}
    fin: dict[str, int] = {}
    time = 0

    def visit(u: str, parent: str | None) -> None:
        nonlocal time
        color[u] = "grey"        # push: discovered, now on the stack
        time += 1
        disc[u] = time
        order.append(u)

        for v in adj.get(u, []):
            if v == parent:
                continue         # skip the undirected edge we arrived on
            c = color.get(v, "white")
            if c == "white":
                visit(v, u)      # tree edge — recurse deeper
            elif c == "grey":
                back_edges.append((u, v))  # back edge → cycle
            # black: already finished — nothing to do

        color[u] = "black"       # pop: this frame returns, node finished
        time += 1
        fin[u] = time

    visit(start, None)
    return order, back_edges, disc, fin


# disc = pre-order (discovery) time; fin = post-order (finish) time.
# Reverse the nodes by finish time and you have a topological sort of a DAG.
# On a graph millions of nodes deep, rewrite this with an explicit stack
# (and raise the recursion limit, or Python will refuse to go that deep).`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "dfs_graph.cpp",
      code: `// Recursive DFS on a graph (adjacency list). Records discovery /
// finish order and classifies each edge as a tree or back edge.
#include <functional>
#include <string>
#include <unordered_map>
#include <vector>

// color: 'w' = unseen, 'g' = on stack, 'b' = done
struct DfsResult {
    std::vector<std::string> order;                            // discovery order
    std::vector<std::pair<std::string, std::string>> backEdges; // each one closes a cycle
    std::unordered_map<std::string, int> disc, fin;
};

DfsResult dfs(
    const std::unordered_map<std::string, std::vector<std::string>> &adj,
    const std::string &start) {
    DfsResult r;
    std::unordered_map<std::string, char> color;
    int time = 0;

    std::function<void(const std::string &, const std::string *)> visit =
        [&](const std::string &u, const std::string *parent) {
            color[u] = 'g';              // push: discovered, now on the stack
            r.disc[u] = ++time;
            r.order.push_back(u);

            auto it = adj.find(u);
            if (it != adj.end()) {
                for (const auto &v : it->second) {
                    if (parent && v == *parent) continue;  // skip the edge we arrived on
                    char c = color.count(v) ? color[v] : 'w';
                    if (c == 'w') {
                        visit(v, &u);    // tree edge — recurse deeper
                    } else if (c == 'g') {
                        r.backEdges.push_back({u, v});  // back edge → cycle
                    }
                    // 'b': already finished — nothing to do
                }
            }

            color[u] = 'b';              // pop: this frame returns, node finished
            r.fin[u] = ++time;
        };

    visit(start, nullptr);
    return r;
}

// disc = pre-order (discovery) time; fin = post-order (finish) time.
// Reverse the nodes by finish time and you have a topological sort of a DAG.
// On a graph millions of nodes deep, rewrite this with an explicit stack.`,
    },
  ],

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, Chapter 22.3 (DFS)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Classical treatment of DFS: discovery/finish times, white/grey/black classification, the parenthesis theorem, and applications.",
      kind: "book",
    },
    {
      label: "Robert Tarjan — *Depth-first search and linear graph algorithms* (1972)",
      href: "https://epubs.siam.org/doi/10.1137/0201010",
      note: "The original paper that turned DFS into a structural tool — biconnected components, bridges, and Tarjan's still-canonical SCC algorithm.",
      kind: "paper",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms*, §4.1 Undirected Graphs (DFS)",
      href: "https://algs4.cs.princeton.edu/41graph/",
      note: "Princeton's online algorithms course covering DFS with runnable Java; the chapter pairs naturally with the BFS one and shows pre/post-order on directed graphs.",
      kind: "article",
    },
    {
      label: "VisuAlgo — DFS / BFS visualisation",
      href: "https://visualgo.net/en/dfsbfs",
      note: "Animations of DFS on a graph with grey/black colouring of in-progress vs finished nodes — the same colour model used in CLRS.",
      kind: "article",
    },
    {
      label: "Stanford CS 161 — DFS and applications",
      href: "https://web.stanford.edu/class/cs161/2024/lectures/lec10.pdf",
      note: "Clean lecture notes covering DFS, topological sort, and SCCs as one continuous arc — the way the algorithms actually compose.",
      kind: "article",
    },
    {
      label: "Wikipedia — Tree traversal",
      href: "https://en.wikipedia.org/wiki/Tree_traversal",
      note: "Definitive reference for pre/in/post-order including the level-order BFS cousin and iterative formulations using an explicit stack.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "dfs-q1",
      question:
        "BFS and DFS both visit every node in O(V + E). What is the essential difference in *how* they explore a graph?",
      options: [
        { id: "a", label: "BFS uses a stack and dives deep; DFS uses a queue and stays shallow." },
        { id: "b", label: "DFS uses a stack (often the call stack) and dives deep down one branch before backtracking; BFS uses a queue and expands outward in rings of equal distance." },
        { id: "c", label: "DFS finds shortest paths in an unweighted graph; BFS does not." },
        { id: "d", label: "They are identical apart from the order the result is printed." },
      ],
      correctOptionId: "b",
      explanation:
        "Same cost, opposite shape. DFS's stack makes it commit to one branch until it dead-ends, then backtrack — ideal for structural questions (cycles, topological order, components). BFS's queue makes it sweep level by level, so first-seen distance is the shortest path in an unweighted graph. DFS doesn't track distances and won't give shortest paths.",
    },
    {
      id: "dfs-q2",
      question:
        "Using the white-grey-black classification on a graph DFS, what indicates a cycle?",
      options: [
        { id: "a", label: "A tree edge — white-to-grey." },
        { id: "b", label: "A forward edge — grey-to-black-descendant." },
        { id: "c", label: "A back edge — grey-to-grey, hitting a node whose DFS call is still on the stack." },
        { id: "d", label: "A cross edge — black-to-black." },
      ],
      correctOptionId: "c",
      explanation:
        "When DFS finds an edge to a node that is currently grey (started but not finished), that node is an ancestor in the current recursion path. The edge plus the path from that ancestor down to the current node closes a cycle. Forward and cross edges go to already-finished (black) nodes, so they don't form cycles.",
    },
    {
      id: "dfs-q3",
      question:
        "After a DFS over a directed acyclic graph (DAG), how do you read off a valid topological order?",
      options: [
        { id: "a", label: "Take the discovery order — the order nodes were first pushed onto the stack." },
        { id: "b", label: "Take the order nodes *finished* (were popped, marked black) and reverse it — reverse post-order." },
        { id: "c", label: "Sort the nodes alphabetically." },
        { id: "d", label: "Use the order the start node's neighbours appear in the adjacency list." },
      ],
      correctOptionId: "b",
      explanation:
        "A node finishes only after all of its descendants have finished. So listing nodes by *finish* time and reversing it guarantees every edge points from an earlier node to a later one — exactly a topological order. It falls out of a single DFS with no extra passes, which is why reverse post-order is the standard topological-sort recipe.",
    },
  ],
};
