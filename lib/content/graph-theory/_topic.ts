import type { TopicContent } from "@/lib/content/types";

export const graphTheoryTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**A graph is the simplest way to say 'these things are related.'** Dots for the things — call them *vertices* or *nodes* — and lines for the relationships — call them *edges*. That's the entire definition. Friendships, roads, web links, course prerequisites, circuit wires, molecules, git commits: every one of them is a set of things plus a set of connections, which is to say every one of them is a graph.",
    },
    {
      type: "p",
      text: "The reason graphs are worth a whole topic *before* you touch a single algorithm is that not all graphs are the same shape — and the shape decides what you're allowed to do. Do the edges point one way or both? Do they carry a number, or are they all equal? Can you walk in a circle, or does every path eventually dead-end? Is the graph one big blob, or two neat sides? Each of these is a yes/no question, and the answers are what people mean when they say *directed*, *weighted*, *cyclic*, *bipartite*, *complete*. Learn to read those properties off a graph and half of graph theory stops being vocabulary and starts being obvious.",
    },
    {
      type: "p",
      text: "This topic walks the properties in the order they build on each other. First *direction* — undirected versus directed, the most fundamental fork. Then *weight* — unweighted versus weighted, which changes what 'shortest' even means. Then the special families — *complete* graphs at one density extreme, *bipartite* graphs split cleanly in two. Finally *cycles* — graphs that loop back, and the acyclic ones (DAGs) that don't, which are the single most important graph shape in all of software engineering. Every prototype here is something you can drive: build the graph, run the test, watch the property reveal itself.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Why the shape matters before the algorithm" },
    {
      type: "ul",
      items: [
        "**The shape picks the algorithm.** Shortest path in an *unweighted* graph is BFS; add weights and it becomes Dijkstra. Ordering tasks works only if the dependency graph is a *DAG*. You can't choose the right tool until you've named the shape.",
        "**The shape catches bugs.** 'Can A reach B?' has a different answer in a directed graph than an undirected one. Treating a one-way street network as two-way silently returns wrong routes — a class of bug that only makes sense once you know direction is a property.",
        "**Modelling is a shape decision.** When you sit down to represent a problem as a graph, your first three questions are exactly these: directed or not, weighted or not, can it cycle? Get them right and the data structure writes itself.",
        "**Real systems are named by their shape.** A build system is 'a DAG of targets.' A scheduler runs 'a topological order.' A matching engine works on 'a bipartite graph.' The shape *is* the shared language engineers use to describe these systems.",
        "**Impossibility is a shape, too.** 'There is no valid build order' is the same statement as 'the dependency graph has a cycle.' Recognising the shape tells you when a problem has no solution before you waste time looking for one.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Two ways to store any of these graphs",
      text: "Whatever the shape, you store it one of two ways. An **adjacency list** keeps, per node, the list of its neighbours — O(V + E) memory, fast to iterate, the default for the sparse graphs you meet in practice. An **adjacency matrix** is a V×V grid where cell (u, v) marks the edge (and holds its weight, if any) — O(V²) memory but O(1) to ask 'is there an edge from u to v?'. Direction shows up as asymmetry in the matrix; weight shows up as numbers instead of 1/0; an undirected graph's matrix is symmetric.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Graph type",
      bursts: "Edges",
      precision: "Weighted?",
      memory: "Cycles?",
      bestFor: "Models / where it shows up",
    },
    rows: [
      {
        algorithm: "Undirected",
        bursts: "Two-way",
        precision: "No",
        memory: "Allowed",
        bestFor: "Friendships, road links you can travel both ways, network cables, mutual relationships.",
      },
      {
        algorithm: "Directed (digraph)",
        bursts: "One-way",
        precision: "No",
        memory: "Allowed",
        bestFor: "Twitter follows, web links, one-way streets, state machines, prerequisites.",
      },
      {
        algorithm: "Unweighted",
        bursts: "Either",
        precision: "No — all edges equal",
        memory: "Allowed",
        bestFor: "Fewest-hops questions: degrees of separation, maze steps, BFS distance.",
      },
      {
        algorithm: "Weighted",
        bursts: "Either",
        precision: "Yes — each edge has a cost",
        memory: "Allowed",
        bestFor: "Road distances, network latency, prices — anywhere 'cheapest' ≠ 'fewest'.",
      },
      {
        algorithm: "Complete (Kₙ)",
        bursts: "Every pair",
        precision: "Either",
        memory: "Many",
        bestFor: "Round-robin tournaments, fully-connected layers, the dense worst case.",
      },
      {
        algorithm: "Bipartite",
        bursts: "Only across two sides",
        precision: "Either",
        memory: "Even-length only",
        bestFor: "Jobs↔workers, students↔courses, any matching problem.",
      },
      {
        algorithm: "Cyclic",
        bursts: "Either",
        precision: "Either",
        memory: "Has at least one",
        bestFor: "Feedback loops, deadlocks, circular dependencies, money-laundering rings.",
      },
      {
        algorithm: "DAG (acyclic)",
        bursts: "One-way",
        precision: "Either",
        memory: "None — by definition",
        bestFor: "Build systems, task schedulers, spreadsheets, git history, course plans.",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "Reading a graph's shape — the questions in order" },
    {
      type: "ul",
      items: [
        "**Do the edges have direction?** If a connection is mutual (friendship, a cable), it's **undirected**. If it can be one-way (a follow, a link, a prerequisite), it's **directed** — and now 'A reaches B' no longer implies 'B reaches A'.",
        "**Do the edges carry a number?** If every edge is interchangeable, it's **unweighted** and 'shortest' means *fewest edges* — use BFS. If edges have costs, it's **weighted** and 'shortest' means *lowest total cost* — a 3-hop cheap path can beat a 1-hop expensive one, which is exactly why Dijkstra exists.",
        "**How dense is it?** A graph where *every* pair is connected is **complete** (Kₙ) and has n(n−1)/2 edges — the ceiling. Most real graphs are far sparser; knowing where you sit on that scale tells you whether an adjacency list or matrix wins.",
        "**Can the nodes split into two sides with no edge inside a side?** Then it's **bipartite**, and matching algorithms apply. The quick test: try to 2-colour it; you succeed if and only if it has no odd-length cycle.",
        "**Can you start at a node and walk back to it?** If yes, the graph is **cyclic** — watch for feedback loops and deadlocks. If a *directed* graph never lets you loop back, it's a **DAG**, and you get a topological order for free.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "DAG is the property that pays the rent",
      text: "Of all these shapes, 'directed and acyclic' is the one you'll lean on most as an engineer. A DAG is exactly the condition under which you can list everything in an order where every dependency comes before the thing that needs it — a *topological order*. Build systems, package managers, spreadsheet recalculation, data pipelines, and even the way git stores commits are all DAGs precisely so this ordering is guaranteed to exist. The moment a cycle sneaks in, the order vanishes and the tool reports an error — 'circular dependency.'",
    },
  ],
};
