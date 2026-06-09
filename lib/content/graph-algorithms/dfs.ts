import type { ConceptContent } from "@/lib/content/types";

export const dfs: ConceptContent = {
  prototypeCaption:
    "A nine-node binary tree walked recursively. The three tabs — **Pre-order**, **In-order**, **Post-order** — change *when* a node is recorded relative to its children; the rest of the DFS is identical. Use **Step** / **Back** to walk one call or return at a time.",

  overview: [
    {
      type: "p",
      text: "**Depth-First Search dives as deep as it can, then backs up.** Start at a node. Pick the first child. Recurse. When you hit a dead-end — a node whose children are all visited — back up to the most recent node that still has unvisited children and continue. The trail you trace is a tree of 'first-time' edges, sometimes called the DFS tree.",
    },
    {
      type: "p",
      text: "Where BFS uses a queue and explores in rings, DFS uses a **stack** — usually the implicit call stack of recursion — and explores in branches. The single most important DFS concept is **when** you record each node relative to its children. On a tree the three answers form the three textbook traversal orders: **Pre-order (N L R)** records the node *before* descending; **In-order (L N R)** records it *between* the left and right recursion; **Post-order (L R N)** records it *after* both children are done. The recursion is the same — only the position of one `record(node)` line moves.",
    },
    {
      type: "p",
      text: "Those three orders unlock real work. Pre-order is how you copy or serialise a tree. In-order, on a binary search tree, comes out *sorted*. Post-order is how you delete a tree or compute any aggregate from the leaves up (compiler IR sizes, file-system disk usage, expression-tree evaluation). And the same DFS skeleton — generalised from a tree to a graph — is the engine behind **cycle detection** (a back edge to a still-grey ancestor), **topological sort** (reverse post-order on a DAG), **connected components**, **Tarjan SCC**, and every **backtracking** solver from sudoku to maze.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The three traversal orders, side by side" },
    {
      type: "ul",
      items: [
        "**Pre-order** (`N L R`) — `record(node)` is the *first* thing the function does after the null-check. You see every node *before* its children.",
        "**In-order** (`L N R`) — `record(node)` sits *between* the recursive calls into left and right children. On a BST, this yields a sorted sequence.",
        "**Post-order** (`L R N`) — `record(node)` is the *last* thing before the function returns. You see every node *after* both subtrees are fully done.",
        "**Reverse post-order** of a DAG-DFS is exactly a topological sort. Same skeleton, same recursion — just a different *prepend* position.",
      ],
    },
    { type: "h", text: "Why the call stack matters" },
    {
      type: "ol",
      items: [
        "Each recursive call pushes a frame on the stack — that's the 'grey' set in textbook DFS.",
        "While a frame is on the stack, its node is *in progress* — its children are being visited, but it isn't finished.",
        "When the function returns, the frame pops — the node becomes 'black' (finished).",
        "A back edge to a still-grey node = a cycle. Forward / cross edges to black nodes = same component, no cycle.",
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
      title: "01 · Walk Pre-order (N L R)",
      body: "Press **Play** in the **Pre-order** tab. Watch each node turn warning-orange the moment its frame is pushed — that's `record(node)` firing *before* either child is visited. The result row fills from the root downward. Result on this tree: `F B A D C E G I H`.",
    },
    {
      title: "02 · Walk In-order (L N R)",
      body: "Switch to **In-order**. Now `record()` happens *between* left and right recursion — so a node only fires after its entire left subtree is done. On this tree (which is a BST when you read it left-to-right), the result comes out sorted: `A B C D E F G H I`.",
    },
    {
      title: "03 · Walk Post-order (L R N)",
      body: "Switch to **Post-order**. The recording happens on the *way back up* — every node fires after both subtrees are done. Watch the call stack pop a frame just as the node turns orange. Result: `A C E D B H I G F`. Reverse this and you have one valid topological order of the tree.",
    },
    {
      title: "04 · Compare the three result strings",
      body: "Run each mode through to completion and compare the *Pre-order result* / *In-order result* / *Post-order result* rows in your head. The recursion is identical — only the position of one line of code moves. That's the whole pedagogy of the three traversals in one prototype.",
    },
  ],

  code: {
    language: "typescript",
    filename: "dfs-tree-traversal.ts",
    code: `// Recursive DFS — pre/in/post-order on a binary tree.
type Node = { val: string; left: Node | null; right: Node | null };

function preorder(node: Node | null, out: string[] = []): string[] {
  if (!node) return out;
  out.push(node.val);                  // ← N (before children)
  preorder(node.left, out);            //   L
  preorder(node.right, out);           //   R
  return out;
}

function inorder(node: Node | null, out: string[] = []): string[] {
  if (!node) return out;
  inorder(node.left, out);             //   L
  out.push(node.val);                  // ← N (between children) — sorted on a BST
  inorder(node.right, out);            //   R
  return out;
}

function postorder(node: Node | null, out: string[] = []): string[] {
  if (!node) return out;
  postorder(node.left, out);           //   L
  postorder(node.right, out);          //   R
  out.push(node.val);                  // ← N (after both children done)
  return out;
}

// Generalised to a graph: pre-order = discovery time, post-order = finish time.
// Reverse post-order of a DAG-DFS is a topological sort.`,
  },

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
        "What is the *only* difference between pre-order, in-order, and post-order DFS on a binary tree?",
      options: [
        { id: "a", label: "The choice of data structure — pre uses a queue, in uses a stack, post uses a list." },
        { id: "b", label: "The position of the `record(node)` line relative to the recursive calls into left and right children." },
        { id: "c", label: "Pre-order visits all leaves first, post-order visits the root first." },
        { id: "d", label: "They use different algorithms entirely." },
      ],
      correctOptionId: "b",
      explanation:
        "All three are the same recursive DFS — the only thing that moves is `record(node)`. Pre-order puts it *before* both recursive calls (N L R); in-order puts it *between* them (L N R); post-order puts it *after* both (L R N). Everything else — the stack, the recursion, the children order — is identical.",
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
        "Why does *in-order* DFS on a binary search tree (BST) produce a sorted sequence?",
      options: [
        { id: "a", label: "Because DFS visits nodes in alphabetical order." },
        { id: "b", label: "Because a BST stores all values < node in the left subtree and all values > node in the right subtree — recursing fully left first, then recording, then right, walks the values in ascending order." },
        { id: "c", label: "Because in-order uses a min-heap internally." },
        { id: "d", label: "Because BSTs are sorted by construction; the traversal order doesn't matter." },
      ],
      correctOptionId: "b",
      explanation:
        "The BST invariant — left < node < right — means that fully exhausting the left subtree before recording the node yields the smallest values first. After the node, the right subtree contains everything larger. That's exactly the L-N-R order in-order DFS performs.",
    },
  ],
};
