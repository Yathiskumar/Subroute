import type { ConceptContent } from "@/lib/content/types";

export const dag: ConceptContent = {
  prototypeCaption:
    "A six-vertex directed graph across four tabs. **Topological order** runs Kahn's algorithm on a valid DAG — counting in-degrees, seeding a ready queue with the in-degree-0 vertices, then placing one at a time and decrementing successors. **Add a back edge → cycle** runs the same algorithm on the graph plus a back edge: the queue empties early and the leftover vertices light up red. **Many valid orders** shows two different correct orders for the same DAG side by side. **Free play** lets you click a source then a target to add a forward arrow, drag vertices, and hit **Topological sort** to get an order or a 'cycle — not a DAG' verdict, with a live placed count.",

  overview: [
    {
      type: "p",
      text: "**A directed acyclic graph is a directed graph with no way to loop back.** Every edge is an arrow with a direction, and no matter which arrow you start on or how you follow them, you can never return to where you began. That single 'no cycles' property is the whole concept — and it is more powerful than it looks, because it guarantees the vertices can always be laid out in a straight line where *every arrow points forward*. That line is called a **topological order**.",
    },
    {
      type: "p",
      text: "You have used DAGs all day without naming them. A **build system** is a DAG: compile `a.o` before linking it into the binary. A **spreadsheet** is a DAG of cells: a formula depends on the cells it references, and a circular reference is an error precisely because it would break acyclicity. **Package managers**, **task schedulers**, **course prerequisites**, and **git commit history** are all DAGs. The arrows mean 'must come before' or 'depends on', and topological sort is the universal answer to *'in what order can I do all of this?'*.",
    },
    {
      type: "p",
      text: "The reason 'acyclic' matters so much: a cycle is a dependency loop, and a loop has no valid order. If A must come before B, B before C, and C before A, there is no first thing to do — the task is impossible. So the same algorithm that produces an order also *detects* whether the graph is a true DAG: if a topological sort can place every vertex, the graph is acyclic; if it gets stuck with vertices left over, those leftovers form a cycle and no order exists.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Kahn's algorithm — topological sort by in-degree" },
    {
      type: "ol",
      items: [
        "Compute the **in-degree** of every vertex — the number of arrows pointing *into* it. A vertex with in-degree 0 has no prerequisites.",
        "Put every in-degree-0 vertex into a **ready queue**. These can go first, in any order.",
        "Pop a vertex from the queue, **append it to the order**, and for each of its outgoing arrows, **decrement the target's in-degree** (the arrow is now 'satisfied').",
        "Any target whose in-degree just hit 0 has all its prerequisites placed — **add it to the ready queue**.",
        "Repeat until the queue is empty. If you placed all `V` vertices, the order is a valid topological sort. If not, the unplaced vertices form a **cycle** — the graph is not a DAG.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Two algorithms, same answer",
      text: "Kahn's algorithm (above) is the in-degree / queue approach the prototype animates. The other classic is **DFS-based**: run depth-first search and emit each vertex once you finish exploring all its descendants — the *reverse* of that finish order is a topological sort. DFS also catches cycles via a 'grey' (on-the-stack) edge. Both run in **O(V + E)**; Kahn's is easier to watch because the ready queue makes the 'no remaining prerequisites' condition visible.",
    },
    {
      type: "p",
      text: "**The order is not unique.** Whenever two vertices are both ready at the same time — neither depends on the other — you may take either one first, and each choice leads to a different valid order. A DAG therefore encodes a **partial order**: it fixes the relative order of any two vertices joined by a chain of arrows, and leaves *incomparable* vertices free to swap. The number of valid topological orders can be huge; any line that respects every arrow counts.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Detecting the cycle is the point",
      text: "When Kahn's algorithm stalls, the vertices it never placed are exactly those still trapped in a cycle — every one of them still has an incoming arrow from another unplaced vertex, so none can ever reach in-degree 0. That is why spreadsheets can flag a *circular reference* and build tools can report a *dependency cycle*: the same topological sort that orders the work also proves when ordering is impossible.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Model it as a DAG when" },
    {
      type: "ul",
      items: [
        "**Relationships mean 'must come before' or 'depends on'** — build targets, package dependencies, task prerequisites, course requirements, data-pipeline stages.",
        "**You need a valid execution order** — topological sort hands you one in O(V + E), and tells you if none exists.",
        "**Cycles are illegal and you want to detect them** — spreadsheet circular references, deadlock-free lock ordering, a `Makefile` that must not loop.",
        "**You're recording an immutable, branching history** — git commits, blockchain blocks, and event-sourcing logs are DAGs where arrows point to ancestors.",
      ],
    },
    { type: "h", text: "Reach for something else when" },
    {
      type: "ul",
      items: [
        "**The relationship can legitimately loop** — web links, social follows, road networks, and state machines have cycles; use a general **directed (cyclic) graph**.",
        "**Direction is meaningless** — if A relating to B always implies B relating to A (friendship, physical cables), an **undirected graph** is simpler and correct.",
        "**You need shortest paths with costs** — that's a job for a **weighted graph** with Dijkstra or Bellman-Ford (though a DAG admits an even faster linear-time shortest path via topological order).",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**A valid order always exists and is cheap** — topological sort runs in O(V + E), turning a tangle of dependencies into a flat to-do list.",
      "**Cycle detection comes free** — the same sort that orders the work proves when ordering is impossible, with the offending cycle identified.",
      "**Unlocks linear-time DP** — longest path, shortest path, and counting paths are all O(V + E) on a DAG because you can process vertices in topological order.",
      "**Matches how real systems think** — builds, schedulers, and dependency resolvers map onto a DAG almost without translation.",
    ],
    cons: [
      "**The acyclic constraint is a real burden** — you must guarantee no cycles ever form, which means validating every edge you add (the prototype refuses a reverse arrow for this reason).",
      "**Can't model genuine feedback loops** — retries, mutual recursion, and cyclic state transitions don't fit; forcing them in loses information.",
      "**The order isn't unique** — if you need a *single canonical* order you must add a deterministic tie-break, or downstream results may differ run to run.",
      "**One bad edge breaks everything** — a single accidental back edge turns the whole graph into a non-DAG, and topological sort then refuses to produce any order at all.",
    ],
  },

  handsOn: [
    {
      title: "01 · Topological order",
      body: "On **Topological order**, press **Play** to run Kahn's algorithm on the DAG. The first step counts every vertex's in-degree (shown as `in N` badges) and lights the in-degree-0 vertices blue — those seed the **ready queue** in the left panel. Each subsequent step pops a ready vertex (it flashes amber, then turns green with its position `#k` in the right-hand **topological order** panel) and decrements its successors' in-degrees; when one hits 0 it joins the queue. The final step shows the full order `A → B → C → D → E → F` and the *is a DAG?* stat flips to **Yes ✓**. Use **Step** / **Back** to move one decrement at a time.",
    },
    {
      title: "02 · Add a back edge → cycle",
      body: "Switch to **Add a back edge → cycle**. The first step highlights the added arrow `F→B` in red — it closes the loop `B→D→F→B`. Play on, and watch the ready queue drain: a few vertices get placed, then the queue empties with **B, D, F never placed**. Those three light up red (in-degree-0 was never reached for any of them) and the *is a DAG?* stat reads **No (cycle)**. The lesson: one back edge is enough to make a topological order impossible.",
    },
    {
      title: "03 · Many valid orders",
      body: "On **Many valid orders**, Play to see the *same* DAG sorted two different ways. **Order A** breaks ties by smallest letter; **Order B** breaks them by largest. Both appear in side-by-side panels, and both are correct — trace any arrow and its tail still precedes its head in either line. The closing step names the idea: a DAG is a *partial order*, so incomparable vertices are free to swap and any arrow-respecting line is a valid sort.",
    },
    {
      title: "04 · Free play — break the acyclic rule yourself",
      body: "Open **Free play**. Click a source vertex then a target to add a forward arrow; drag vertices to rearrange. The prototype **refuses** an arrow whose reverse already exists (that would make a 2-cycle) — a small taste of the validation a real dependency system must do. Hit **Topological sort** to run Kahn's on your graph: a valid DAG reports its order and turns every vertex green, while a graph with a cycle reports *'cycle — not a DAG'* and reddens the trapped vertices. Watch the **placed** stat and the *is a DAG?* card update live.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "dag.ts",
      code: `// Topological sort via Kahn's algorithm.
// Returns a valid linear order, or null if the graph has a cycle (not a DAG).
function topologicalSort(
  vertices: string[],
  edges: [string, string][], // [from, to] — "from must come before to"
): string[] | null {
  // 1. In-degree = number of arrows pointing INTO each vertex.
  const inDegree = new Map<string, number>(vertices.map((v) => [v, 0]));
  const out = new Map<string, string[]>(vertices.map((v) => [v, []]));
  for (const [u, v] of edges) {
    out.get(u)!.push(v);
    inDegree.set(v, inDegree.get(v)! + 1);
  }

  // 2. Seed the ready queue with every in-degree-0 vertex (no prerequisites).
  const ready = vertices.filter((v) => inDegree.get(v) === 0);
  const order: string[] = [];

  // 3. Place a ready vertex, then relax its outgoing arrows.
  while (ready.length > 0) {
    const u = ready.shift()!;
    order.push(u);
    for (const v of out.get(u)!) {
      inDegree.set(v, inDegree.get(v)! - 1); // this arrow is now satisfied
      if (inDegree.get(v) === 0) ready.push(v); // all prerequisites done
    }
  }

  // 4. Placed everything ⇒ DAG. Otherwise the leftovers form a cycle.
  return order.length === vertices.length ? order : null;
}

// const order = topologicalSort(
//   ["A", "B", "C", "D", "E", "F"],
//   [["A","C"],["B","C"],["B","D"],["C","E"],["D","E"],["D","F"],["E","F"]],
// ); // → ["A","B","C","D","E","F"]  (one of several valid orders)`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Dag.java",
      code: `// Topological sort via Kahn's algorithm.
// Returns a valid linear order, or null if the graph has a cycle (not a DAG).
import java.util.*;

class Dag {
    // edges as String[]{from, to} — "from must come before to"
    static List<String> topologicalSort(List<String> vertices, List<String[]> edges) {
        // 1. In-degree = number of arrows pointing INTO each vertex.
        Map<String, Integer> inDegree = new HashMap<>();
        Map<String, List<String>> out = new HashMap<>();
        for (String v : vertices) {
            inDegree.put(v, 0);
            out.put(v, new ArrayList<>());
        }
        for (String[] e : edges) {
            out.get(e[0]).add(e[1]);
            inDegree.merge(e[1], 1, Integer::sum);
        }

        // 2. Seed the ready queue with every in-degree-0 vertex (no prerequisites).
        Deque<String> ready = new ArrayDeque<>();
        for (String v : vertices) if (inDegree.get(v) == 0) ready.add(v);
        List<String> order = new ArrayList<>();

        // 3. Place a ready vertex, then relax its outgoing arrows.
        while (!ready.isEmpty()) {
            String u = ready.poll();
            order.add(u);
            for (String v : out.get(u)) {
                inDegree.merge(v, -1, Integer::sum);  // this arrow is now satisfied
                if (inDegree.get(v) == 0) ready.add(v); // all prerequisites done
            }
        }

        // 4. Placed everything => DAG. Otherwise the leftovers form a cycle.
        return order.size() == vertices.size() ? order : null;
    }
}

// List<String> order = Dag.topologicalSort(
//   List.of("A", "B", "C", "D", "E", "F"),
//   List.of(new String[]{"A","C"}, new String[]{"B","C"}, new String[]{"B","D"},
//           new String[]{"C","E"}, new String[]{"D","E"}, new String[]{"D","F"},
//           new String[]{"E","F"}));
// -> ["A","B","C","D","E","F"]  (one of several valid orders)`,
    },
    {
      label: "Python",
      language: "python",
      filename: "dag.py",
      code: `from collections import deque


def topological_sort(
    vertices: list[str],
    edges: list[tuple[str, str]],  # (from, to) — "from must come before to"
) -> list[str] | None:
    """Topological sort via Kahn's algorithm.

    Returns a valid linear order, or None if the graph has a cycle (not a DAG).
    """
    # 1. In-degree = number of arrows pointing INTO each vertex.
    in_degree = {v: 0 for v in vertices}
    out: dict[str, list[str]] = {v: [] for v in vertices}
    for u, v in edges:
        out[u].append(v)
        in_degree[v] += 1

    # 2. Seed the ready queue with every in-degree-0 vertex (no prerequisites).
    ready = deque(v for v in vertices if in_degree[v] == 0)
    order: list[str] = []

    # 3. Place a ready vertex, then relax its outgoing arrows.
    while ready:
        u = ready.popleft()
        order.append(u)
        for v in out[u]:
            in_degree[v] -= 1            # this arrow is now satisfied
            if in_degree[v] == 0:
                ready.append(v)          # all prerequisites done

    # 4. Placed everything => DAG. Otherwise the leftovers form a cycle.
    return order if len(order) == len(vertices) else None


# order = topological_sort(
#     ["A", "B", "C", "D", "E", "F"],
#     [("A","C"),("B","C"),("B","D"),("C","E"),("D","E"),("D","F"),("E","F")],
# )  # -> ["A","B","C","D","E","F"]  (one of several valid orders)`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "dag.cpp",
      code: `// Topological sort via Kahn's algorithm.
// Returns a valid linear order, or empty optional if the graph has a cycle.
#include <string>
#include <unordered_map>
#include <vector>
#include <queue>
#include <optional>
#include <utility>

std::optional<std::vector<std::string>> topologicalSort(
    const std::vector<std::string>& vertices,
    const std::vector<std::pair<std::string, std::string>>& edges) {
  // 1. In-degree = number of arrows pointing INTO each vertex.
  std::unordered_map<std::string, int> inDegree;
  std::unordered_map<std::string, std::vector<std::string>> out;
  for (const auto& v : vertices) { inDegree[v] = 0; out[v] = {}; }
  for (const auto& [u, v] : edges) {
    out[u].push_back(v);
    inDegree[v]++;
  }

  // 2. Seed the ready queue with every in-degree-0 vertex (no prerequisites).
  std::queue<std::string> ready;
  for (const auto& v : vertices) if (inDegree[v] == 0) ready.push(v);
  std::vector<std::string> order;

  // 3. Place a ready vertex, then relax its outgoing arrows.
  while (!ready.empty()) {
    std::string u = ready.front();
    ready.pop();
    order.push_back(u);
    for (const auto& v : out[u]) {
      if (--inDegree[v] == 0) ready.push(v); // arrow satisfied; prerequisites done
    }
  }

  // 4. Placed everything => DAG. Otherwise the leftovers form a cycle.
  if (order.size() == vertices.size()) return order;
  return std::nullopt;
}

// auto order = topologicalSort(
//   {"A", "B", "C", "D", "E", "F"},
//   {{"A","C"},{"B","C"},{"B","D"},{"C","E"},{"D","E"},{"D","F"},{"E","F"}});
// // -> ["A","B","C","D","E","F"]  (one of several valid orders)`,
    },
  ],

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, §20.4 (Topological sort)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The DFS-finish-time topological sort, its correctness proof, and the link between DAGs and partial orders.",
      kind: "book",
    },
    {
      label: "A. B. Kahn — *Topological sorting of large networks* (1962)",
      href: "https://doi.org/10.1145/368996.369025",
      note: "The original three-page paper that introduced the in-degree / ready-queue algorithm the prototype animates.",
      kind: "paper",
    },
    {
      label: "Wikipedia — Directed acyclic graph",
      href: "https://en.wikipedia.org/wiki/Directed_acyclic_graph",
      note: "Definitions, the topological-order equivalence, and a tour of applications from spreadsheets to version control.",
      kind: "article",
    },
    {
      label: "Wikipedia — Topological sorting",
      href: "https://en.wikipedia.org/wiki/Topological_sorting",
      note: "Both Kahn's and the DFS algorithm side by side, with the cycle-detection and uniqueness discussion.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Topological sort",
      href: "https://visualgo.net/en/dfsbfs",
      note: "Interactive animation of topological ordering (under the DFS/BFS module) on graphs you can edit.",
      kind: "video",
    },
    {
      label: "Skiena — *The Algorithm Design Manual*, §15.2 (Topological sorting)",
      href: "https://www.algorist.com/",
      note: "When to reach for a DAG in practice, with scheduling and dependency war stories.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "dag-q1",
      question:
        "What single property distinguishes a DAG from a general directed graph, and what does it guarantee?",
      options: [
        { id: "a", label: "It has no cycles — which guarantees a topological order (a linear layout where every arrow points forward) exists." },
        { id: "b", label: "Every vertex has in-degree 0 — which guarantees the graph is connected." },
        { id: "c", label: "It has no edges pointing backward in the alphabet — which guarantees a unique order." },
        { id: "d", label: "It is undirected — which guarantees symmetry between every pair of vertices." },
      ],
      correctOptionId: "a",
      explanation:
        "A DAG is a directed graph with no directed cycles. Acyclicity is exactly the condition for a topological order to exist: you can lay the vertices in a line with every arrow pointing forward. A directed graph with a cycle has no such order, because a cycle is a dependency loop with no valid starting point.",
    },
    {
      id: "dag-q2",
      question:
        "In Kahn's algorithm, what does it mean if the ready queue empties before all vertices have been placed?",
      options: [
        { id: "a", label: "The algorithm has a bug — it should always place every vertex." },
        { id: "b", label: "The remaining vertices have in-degree 0 and were simply skipped." },
        { id: "c", label: "The remaining vertices form a cycle, so the graph is not a DAG and has no topological order." },
        { id: "d", label: "The graph is disconnected, so each component needs a separate sort." },
      ],
      correctOptionId: "c",
      explanation:
        "If the queue empties early, the unplaced vertices each still have an incoming arrow from another unplaced vertex — so none can ever reach in-degree 0. That mutual waiting is precisely a cycle, which proves the graph is not a DAG and that no topological order exists.",
    },
    {
      id: "dag-q3",
      question:
        "Why can the same DAG have more than one valid topological order?",
      options: [
        { id: "a", label: "Because the algorithm is randomised and picks a different order each run." },
        { id: "b", label: "Because a DAG defines only a partial order: vertices not connected by a chain of arrows are incomparable and may be placed in either relative order." },
        { id: "c", label: "Because adding edges removes orderings, so fewer edges always means exactly one order." },
        { id: "d", label: "It can't — every DAG has exactly one topological order." },
      ],
      correctOptionId: "b",
      explanation:
        "A DAG fixes the relative order only of vertices joined by a directed path; any two vertices with no path between them are incomparable and can swap. Whenever two vertices are both 'ready' (in-degree 0) at the same time, either may go first, so multiple valid orders exist. It is a partial order, not a total one.",
    },
  ],
};
