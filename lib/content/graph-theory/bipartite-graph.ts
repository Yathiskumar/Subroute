import type { ConceptContent } from "@/lib/content/types";

export const bipartiteGraph: ConceptContent = {
  prototypeCaption:
    "A six-vertex graph across four tabs. **Two-colour it** runs a BFS that paints each vertex the opposite colour of its neighbour on a clean bipartite graph; **An odd cycle breaks it** runs the same process on a graph with a triangle and stops at the edge that demands two same-coloured vertices; **Split into two sides** rearranges the bipartite graph into two columns so every edge visibly crosses the gap. **Free play** lets you click two vertices to toggle an edge, drag vertices around, and hit Test bipartite to 2-colour whatever you built — the group sizes and the *bipartite?* verdict update live.",

  overview: [
    {
      type: "p",
      text: "**A bipartite graph is one whose vertices split into two groups, with every edge crossing between the groups and never staying inside one.** Picture two columns of dots: edges only ever run left-to-right, never left-to-left or right-to-right. The two groups are often called the two *sides*, *parts*, or *colours* — and that last word is the key, because a graph is bipartite exactly when you can paint its vertices in **two** colours so that no edge ever joins two vertices of the same colour.",
    },
    {
      type: "p",
      text: "This is the natural model whenever the things you're connecting fall into two distinct kinds and relationships only ever cross the divide. Students and the courses they enrol in, jobs and the machines that can run them, buyers and sellers, actors and films, people and the events they attend. In each case an edge says 'this thing on the left relates to this thing on the right' — and two things on the same side are never directly joined.",
    },
    {
      type: "p",
      text: "The deep fact is a three-way equivalence: **a graph is bipartite if and only if it is 2-colourable if and only if it contains no odd-length cycle.** That last clause is the one to internalise. A triangle (a 3-cycle) is the smallest thing that can't be 2-coloured — colour two of its vertices and the third is adjacent to both, so it has no legal colour. Any odd cycle traps you the same way. Even cycles are fine; they alternate colours and close up cleanly. So testing bipartiteness is just a hunt for an odd cycle, and a single BFS or DFS finds one (or proves there's none) in linear time.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The pieces" },
    {
      type: "ul",
      items: [
        "**Two parts (sides)** — the vertex set splits into `V = X ∪ Y` with `X` and `Y` disjoint. Group 0 and group 1, left and right, the two colours — same idea, different names.",
        "**Crossing edges only** — every edge has one endpoint in `X` and one in `Y`. No edge lives wholly inside `X` or wholly inside `Y`.",
        "**2-colouring** — assign each vertex one of two colours so adjacent vertices always differ. The colour classes *are* the two parts.",
        "**Odd cycle** — a cycle with an odd number of edges (a triangle, a pentagon). Its presence is the exact obstruction to bipartiteness.",
      ],
    },
    { type: "h", text: "Testing it with a BFS 2-colouring" },
    {
      type: "ol",
      items: [
        "Pick any unvisited vertex, paint it colour 0, and put it in a queue.",
        "Dequeue a vertex `u`. For each neighbour `v`: if `v` is uncoloured, paint it the *opposite* colour of `u` and enqueue it.",
        "If `v` is already coloured the *same* as `u`, stop — you've found an edge inside one colour class, so the graph is **not** bipartite (you've just walked an odd cycle).",
        "Repeat until the queue empties; restart from any still-uncoloured vertex to cover every component.",
        "If you colour everything with no conflict, the two colour classes are the two sides — the graph is bipartite.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why an odd cycle is fatal",
      text: "Walk around a cycle alternating colours: 0, 1, 0, 1, … To close the loop, the last vertex must differ from the first. That works only if the number of steps is even. An odd cycle forces the last vertex to share the start's colour while being adjacent to it — an impossible demand. Even cycles alternate perfectly and close with no clash, which is why they're harmless.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Two sides need not be equal",
      text: "Bipartite says nothing about the two parts being the same size. A star (one centre joined to n leaves) is bipartite with parts of size 1 and n. The prototype's default graph happens to be a balanced 3 + 3, but `2 + 4` or `1 + 5` would be just as bipartite.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Model it as bipartite when" },
    {
      type: "ul",
      items: [
        "**Your entities fall into two distinct kinds and edges only cross** — users and items, students and courses, jobs and machines, applicants and slots.",
        "**You need a matching** — assigning workers to tasks, residents to hospitals, or ads to slots is the classic *bipartite matching* problem, solvable in polynomial time precisely because the graph is bipartite.",
        "**You're building a recommender or two-mode network** — buyer–product and reader–article graphs are bipartite by construction, and projecting onto one side reveals 'who shares interests'.",
      ],
    },
    { type: "h", text: "Reach for a general graph instead when" },
    {
      type: "ul",
      items: [
        "**Same-kind vertices connect directly** — if friends (one kind) link to friends, you have odd cycles and the bipartite structure is gone.",
        "**The graph already contains a triangle or any odd cycle** — it simply isn't bipartite, and forcing the model will mislead you.",
        "**You need more than two groups** — proper colouring with three or more colours, or `k`-partite structure, is a different (and generally much harder) problem.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Cheap to verify** — a single BFS/DFS 2-colouring decides bipartiteness in O(V + E) and hands you the two sides for free.",
      "**Matching becomes tractable** — maximum matching, which is NP-hard intuitions aside, is polynomial on bipartite graphs (Hopcroft–Karp in O(E√V)).",
      "**Natural fit for two-kind data** — users/items, jobs/machines, and similar domains map onto it with zero distortion.",
      "**Clean visual structure** — laying the two sides in two columns makes every relationship a crossing edge, instantly readable.",
    ],
    cons: [
      "**A single odd cycle destroys it** — add one triangle and the whole graph is no longer bipartite; the property is fragile.",
      "**Only two groups** — anything needing three or more categories falls outside the model.",
      "**Can't express same-side links** — a real friendship between two users (same side) has no place in a user–item bipartite graph.",
      "**Projections lose information** — collapsing a bipartite graph onto one side to get 'shared interests' discards which item created each link.",
    ],
  },

  handsOn: [
    {
      title: "01 · Two-colour it",
      body: "On **Two-colour it**, press **Play**. A BFS starts at vertex **A**, paints it group 0 (blue), and fans outward — every neighbour it reaches gets painted the *opposite* colour. Watch the warning-coloured edge as each one is checked: every edge joins a blue vertex to a purple one, so none ever clashes. The final step reports success and the two group sizes; the side panel lists the members of group 0 and group 1. Use **Step** / **Back** to crawl one colouring at a time.",
    },
    {
      title: "02 · An odd cycle breaks it",
      body: "Switch to **An odd cycle breaks it** and Play. This graph hides a triangle. The 2-colouring proceeds happily until it reaches an edge whose two endpoints have *already* been painted the same colour — that edge flashes red as the conflict. The narration spells out the odd cycle you just walked: there's no way to 2-colour a triangle, so the graph is **not** bipartite. The side panel pins down exactly which edge broke it.",
    },
    {
      title: "03 · Split into two sides",
      body: "On **Split into two sides**, Play to watch the bipartite graph rearrange itself. The vertices slide into two clean columns — group 0 on the left, group 1 on the right — and once they settle, *every* edge visibly crosses the gap from left to right. None stays within a column. That picture is the definition of bipartite made literal; the side panel names the left and right members.",
    },
    {
      title: "04 · Free play — build and test your own",
      body: "Open **Free play**. Click any two vertices to toggle an edge between them; drag vertices to rearrange. When you're ready, hit **Test bipartite** to run the 2-colouring on whatever you built — the *bipartite?* stat turns green for Yes or red for No, and the group-sizes stat fills in. Try adding an edge that closes a triangle and watch the verdict flip to No; remove it and it flips back. **Clear edges** strips everything; **Reset graph** restores the starting layout.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "bipartite-graph.ts",
      code: `// Test whether an undirected graph is bipartite by 2-colouring it
// with a BFS. Returns the two sides on success, or null if an odd
// cycle is found (i.e. the graph is not bipartite).
function bipartition(
  adj: Map<string, string[]>,
): [string[], string[]] | null {
  const colour = new Map<string, 0 | 1>();

  for (const start of adj.keys()) {
    if (colour.has(start)) continue;        // already handled this component
    colour.set(start, 0);
    const queue: string[] = [start];

    while (queue.length > 0) {
      const u = queue.shift()!;
      const next = (colour.get(u)! ^ 1) as 0 | 1;   // opposite colour
      for (const v of adj.get(u) ?? []) {
        if (!colour.has(v)) {
          colour.set(v, next);              // paint neighbour the other colour
          queue.push(v);
        } else if (colour.get(v) === colour.get(u)) {
          return null;                      // same colour across an edge → odd cycle
        }
      }
    }
  }

  // No conflicts: the two colour classes are the two sides.
  const side0: string[] = [], side1: string[] = [];
  for (const [v, c] of colour) (c === 0 ? side0 : side1).push(v);
  return [side0, side1];
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "BipartiteGraph.java",
      code: `// Test whether an undirected graph is bipartite by 2-colouring it
// with a BFS. Returns the two sides on success, or null if an odd
// cycle is found (i.e. the graph is not bipartite).
import java.util.*;

class BipartiteGraph {
    // Returns a 2-element list {side0, side1}, or null if not bipartite.
    static List<List<String>> bipartition(Map<String, List<String>> adj) {
        Map<String, Integer> colour = new HashMap<>();

        for (String start : adj.keySet()) {
            if (colour.containsKey(start)) continue;  // already handled this component
            colour.put(start, 0);
            Deque<String> queue = new ArrayDeque<>();
            queue.add(start);

            while (!queue.isEmpty()) {
                String u = queue.poll();
                int next = colour.get(u) ^ 1;          // opposite colour
                for (String v : adj.getOrDefault(u, List.of())) {
                    if (!colour.containsKey(v)) {
                        colour.put(v, next);           // paint neighbour the other colour
                        queue.add(v);
                    } else if (colour.get(v).equals(colour.get(u))) {
                        return null;                   // same colour across an edge -> odd cycle
                    }
                }
            }
        }

        // No conflicts: the two colour classes are the two sides.
        List<String> side0 = new ArrayList<>(), side1 = new ArrayList<>();
        for (var e : colour.entrySet())
            (e.getValue() == 0 ? side0 : side1).add(e.getKey());
        return List.of(side0, side1);
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "bipartite_graph.py",
      code: `from collections import deque


def bipartition(adj: dict[str, list[str]]) -> tuple[list[str], list[str]] | None:
    """Test whether an undirected graph is bipartite by 2-colouring it
    with a BFS. Returns the two sides on success, or None if an odd
    cycle is found (i.e. the graph is not bipartite).
    """
    colour: dict[str, int] = {}

    for start in adj:
        if start in colour:
            continue                     # already handled this component
        colour[start] = 0
        queue = deque([start])

        while queue:
            u = queue.popleft()
            nxt = colour[u] ^ 1          # opposite colour
            for v in adj.get(u, ()):
                if v not in colour:
                    colour[v] = nxt      # paint neighbour the other colour
                    queue.append(v)
                elif colour[v] == colour[u]:
                    return None          # same colour across an edge -> odd cycle

    # No conflicts: the two colour classes are the two sides.
    side0: list[str] = []
    side1: list[str] = []
    for v, c in colour.items():
        (side0 if c == 0 else side1).append(v)
    return side0, side1`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "bipartite_graph.cpp",
      code: `// Test whether an undirected graph is bipartite by 2-colouring it
// with a BFS. Returns the two sides on success, or false if an odd
// cycle is found (i.e. the graph is not bipartite).
#include <string>
#include <unordered_map>
#include <vector>
#include <queue>
#include <optional>

using Adj = std::unordered_map<std::string, std::vector<std::string>>;
using Sides = std::pair<std::vector<std::string>, std::vector<std::string>>;

std::optional<Sides> bipartition(const Adj& adj) {
    std::unordered_map<std::string, int> colour;

    for (const auto& [start, _] : adj) {
        if (colour.count(start)) continue;     // already handled this component
        colour[start] = 0;
        std::queue<std::string> queue;
        queue.push(start);

        while (!queue.empty()) {
            std::string u = queue.front();
            queue.pop();
            int next = colour[u] ^ 1;          // opposite colour
            auto it = adj.find(u);
            if (it == adj.end()) continue;
            for (const auto& v : it->second) {
                auto found = colour.find(v);
                if (found == colour.end()) {
                    colour[v] = next;          // paint neighbour the other colour
                    queue.push(v);
                } else if (found->second == colour[u]) {
                    return std::nullopt;       // same colour across an edge -> odd cycle
                }
            }
        }
    }

    // No conflicts: the two colour classes are the two sides.
    Sides sides;
    for (const auto& [v, c] : colour)
        (c == 0 ? sides.first : sides.second).push_back(v);
    return sides;
}`,
    },
  ],

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, Section 22.2 (exercise on bipartiteness)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "BFS as the engine for the 2-colouring test, plus the surrounding shortest-path machinery.",
      kind: "book",
    },
    {
      label: "Wikipedia — Bipartite graph",
      href: "https://en.wikipedia.org/wiki/Bipartite_graph",
      note: "Definitions, the two-colouring / odd-cycle characterisation, and the link to matching and König's theorem.",
      kind: "article",
    },
    {
      label: "Wikipedia — Graph coloring",
      href: "https://en.wikipedia.org/wiki/Graph_coloring",
      note: "Places 2-colouring in the broader colouring picture: bipartite graphs are exactly the 2-colourable ones.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Graph traversal (BFS/DFS)",
      href: "https://visualgo.net/en/dfsbfs",
      note: "Interactive BFS/DFS animations — the same traversal that powers the bipartite check, with a bipartite-test mode.",
      kind: "video",
    },
    {
      label: "Hopcroft–Karp algorithm (Wikipedia)",
      href: "https://en.wikipedia.org/wiki/Hopcroft%E2%80%93Karp_algorithm",
      note: "The classic O(E√V) maximum-matching algorithm for bipartite graphs — why bipartite structure is so valuable in assignment problems, with a link to the 1973 paper.",
      kind: "article",
    },
    {
      label: "Skiena — *The Algorithm Design Manual*, Graph problems",
      href: "https://www.algorist.com/",
      note: "Practical notes on recognising bipartite structure and turning real assignment problems into matchings.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "bp-q1",
      question:
        "Which condition is exactly equivalent to a graph being bipartite?",
      options: [
        { id: "a", label: "It has no cycles at all." },
        { id: "b", label: "It can be properly coloured with two colours (equivalently, it contains no odd-length cycle)." },
        { id: "c", label: "Every vertex has even degree." },
        { id: "d", label: "It is connected." },
      ],
      correctOptionId: "b",
      explanation:
        "Bipartite ⇔ 2-colourable ⇔ no odd cycle — these three are equivalent. A graph can have (even) cycles and still be bipartite, so option A is too strong; degree parity (C) and connectivity (D) are unrelated to bipartiteness.",
    },
    {
      id: "bp-q2",
      question:
        "While 2-colouring a graph with BFS, you reach an edge whose two endpoints are already painted the *same* colour. What does this prove?",
      options: [
        { id: "a", label: "The graph is disconnected." },
        { id: "b", label: "You started the BFS from the wrong vertex; restarting elsewhere would fix it." },
        { id: "c", label: "The graph is not bipartite — that edge closes an odd-length cycle." },
        { id: "d", label: "Nothing; you just recolour one endpoint and continue." },
      ],
      correctOptionId: "c",
      explanation:
        "An edge between two same-coloured vertices means the alternating path that coloured them, plus this edge, forms an odd cycle — the exact obstruction to bipartiteness. No choice of start vertex avoids it, and you can't recolour your way out: the graph simply isn't 2-colourable.",
    },
    {
      id: "bp-q3",
      question:
        "Why is a triangle (a 3-cycle) the smallest graph that is not bipartite?",
      options: [
        { id: "a", label: "Because it has three edges, and bipartite graphs may have at most two." },
        { id: "b", label: "Because colouring two of its vertices forces the third to be adjacent to two different colours, so no legal third colour exists among two." },
        { id: "c", label: "Because it is a complete graph, and no complete graph is bipartite." },
        { id: "d", label: "Because triangles have odd degree at every vertex." },
      ],
      correctOptionId: "b",
      explanation:
        "Colour vertex 1 blue and vertex 2 purple; vertex 3 is adjacent to both, so with only two colours it has no valid choice. That's the odd-cycle obstruction at its smallest. (K₃ is complete, but the relevant reason is the odd cycle, not completeness — K₄ is also non-bipartite, and not every non-bipartite graph is complete.)",
    },
  ],
};
