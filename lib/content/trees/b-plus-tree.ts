import type { ConceptContent } from "@/lib/content/types";

export const bPlusTree: ConceptContent = {
  prototypeCaption:
    "An **order-4 B+ tree** that grows as you insert keys. Internal nodes (darker, rectangular) hold only separator keys — signposts that route searches; the actual data lives exclusively in the leaf layer (lighter, rounded). Leaves are wired together with *dashed arrows* forming a sorted linked list you can walk without re-traversing the tree. Use **Insert** to add one key, **Search** to highlight the single leaf it lands in, and **Range Scan** (lo / hi) to watch the highlighted chain walk across the leaf level. **Build 10→80** seeds the tree with eight evenly-spaced keys so you can see a multi-level structure immediately. Stats in the corner track total keys, tree height, leaf count, and range-scan hits.",

  overview: [
    {
      type: "p",
      text: "**A B+ tree is a B-tree variant with one decisive change: all data lives in the leaves.** In a plain B-tree every node can carry a full data record alongside its key, so a lucky search might terminate at an internal node. A B+ tree forbids that. Internal nodes hold *only* separator keys — lightweight signposts copied up from the leaves purely to route traffic. The real payload is always in a leaf, and every search must descend all the way there. That sounds like extra work, but the payoff is enormous: because internal nodes carry no data, each one can pack far more keys into a single disk page, which dramatically increases fan-out, keeps the tree shallower, and puts fewer pages between the root and your data.",
    },
    {
      type: "p",
      text: "The second decisive change is the **leaf linked list**. Every leaf holds a pointer to the next leaf in sorted key order, so the entire data set is woven into a sorted chain at the bottom of the tree. A *range scan* — 'give me all rows where age BETWEEN 20 AND 60' — descends the tree once to find the first matching leaf, then walks the chain rightward until the keys exceed the upper bound. No re-traversal, no backtracking. Compare this with a plain B-tree: to visit all keys in a range you'd need a full in-order traversal of the tree, which revisits internal nodes and cannot be streamed efficiently off disk. The linked leaf list is what makes B+ trees the engine of choice for ordered columns in relational databases.",
    },
    {
      type: "p",
      text: "The result is the structure that powers virtually every serious storage engine you'll encounter. **MySQL InnoDB**, **PostgreSQL**, **SQLite**, **Oracle**, **Microsoft SQL Server**, and filesystems like **NTFS** and **ext4** all index their data with B+ trees. The reason is the same in every case: workloads mix point lookups, range scans, and ordered iteration, and the B+ tree handles all three in O(log n) descent plus O(k) leaf-chain walk — where k is the number of results — with predictable, disk-friendly access patterns.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Search — every lookup reaches a leaf" },
    {
      type: "ol",
      items: [
        "Start at the root. Each internal node contains a sorted list of separator keys. Binary-search (or linear-scan for small order) to find the first separator key *greater than* the target, then follow the child pointer to the left of it.",
        "Repeat at every internal level: compare, descend. All paths from root to leaf have the *same length* — the tree is always height-balanced — so every search costs exactly `O(log_B n)` node reads, where `B` is the order (max children per node).",
        "Arrive at a leaf. Scan the leaf's keys. If the target key is present, return its associated record. If not, the key does not exist. Unlike a plain B-tree there is no chance of an 'early exit' at an internal node — this gives uniform, predictable cost.",
      ],
    },
    { type: "h", text: "Insert — leaf split with copy-up" },
    {
      type: "ol",
      items: [
        "Descend exactly as in Search to find the correct leaf.",
        "If the leaf has room (fewer than `order - 1` keys), insert the key in sorted position. Done.",
        "If the leaf is **full**, split it into two leaves. The **middle key is *copied* up** (not moved) to the parent as a new separator: the original key stays in the right leaf so every lookup still reaches real data in a leaf. Contrast with plain B-tree splits, where the middle key is *promoted* — moved to the parent and removed from the child.",
        "Update the linked-list pointers so the two new leaves stay chained correctly in order.",
        "If the parent internal node is now full, split it too — but here the middle key is *pushed up* (moved, not copied) since internal nodes carry no data. Splits cascade upward until a non-full node absorbs the new separator, or the root itself splits and the tree grows one level taller.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Copy-up vs push-up",
      text: "Remember: a leaf split **copies** the separator key up — the key appears in both the leaf and the parent. An internal-node split **pushes** the separator key up — it leaves the child and moves to the parent. This distinction is why B+ trees guarantee all data is reachable at the leaf level even after arbitrarily many splits.",
    },
    { type: "h", text: "Range scan — descend once, walk the chain" },
    {
      type: "ol",
      items: [
        "Search for the lower bound `lo` as described above. Arrive at the first leaf that could contain it.",
        "Scan the leaf's keys left-to-right, collecting every key ≥ `lo`.",
        "Follow the leaf's `next` pointer to the adjacent leaf and continue scanning.",
        "Stop when the current key exceeds the upper bound `hi` or the `next` pointer is null.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Why this is fast on disk",
      text: "Database pages are fetched in block-sized reads. Because leaves are linked *in sorted key order*, a range scan reads physically adjacent (or nearly adjacent) pages sequentially — the access pattern that spinning disks and SSDs both handle at peak throughput. Internal nodes act as a tiny index on top, small enough to fit in the buffer pool, so repeated range scans pay the descent cost from cache, not disk.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Choose a B+ tree when" },
    {
      type: "ul",
      items: [
        "**Range queries are common** — `BETWEEN`, `>`, `<`, ordered iteration — because the leaf chain lets you scan a contiguous range without revisiting internal nodes.",
        "**The dataset lives on disk or in a block store** — the high fan-out (hundreds of children per node at typical 4–16 KB page sizes) keeps the tree 2–4 levels deep even for billions of rows, minimising disk I/O.",
        "**Ordered scans matter** — `ORDER BY`, `GROUP BY`, index-only scans, and merge joins all benefit from the pre-sorted leaf layer.",
        "**Uniform lookup cost is desirable** — every search pays exactly the same depth, which makes query-plan cost estimation reliable.",
        "**You need concurrent access** — locking can be applied per-node during traversal; the fixed-depth structure makes lock-coupling (crabbing) predictable.",
      ],
    },
    { type: "h", text: "Consider a plain B-tree (or other structure) when" },
    {
      type: "ul",
      items: [
        "**Point lookups dominate and range scans are rare** — a plain B-tree can return data from an internal node early, saving the final leaf descent. The win is modest in practice but real on tiny datasets.",
        "**Keys are unique and random (e.g. UUIDs)** — high-randomness inserts cause frequent leaf splits and page fragmentation in B+ trees; a hash index or LSM-tree may outperform on write-heavy workloads.",
        "**The working set fits entirely in memory** — when there is no disk I/O, simpler in-memory structures (red-black trees, skip lists) avoid the bookkeeping overhead of B+ tree splits.",
        "**Write amplification is the bottleneck** — LSM-trees (used by RocksDB, Cassandra, LevelDB) buffer writes in memory and merge sorted runs, outperforming B+ trees on write-heavy SSD workloads.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Killer range scans** — the leaf linked list turns a range query into one descent + a sequential walk; no other balanced-tree structure matches this for ordered data on disk.",
      "**Maximum fan-out** — internal nodes carry only keys (no data records), so far more separator keys fit per page. A 4 KB page holding 8-byte keys can fan out ~500 children, keeping trees 2–4 levels deep for billions of rows.",
      "**Uniform lookup depth** — every search hits a leaf, so O(log_B n) cost is guaranteed regardless of where a key sits; query optimisers can predict performance reliably.",
      "**Cache-friendly internal nodes** — the compact internal layer often fits entirely in the buffer pool, making repeated queries pay only a single leaf I/O after warmup.",
      "**Widely understood and battle-tested** — B+ trees underpin MySQL InnoDB, PostgreSQL, SQLite, Oracle, SQL Server, NTFS, and ext4; decades of production tuning means the edge cases are well-documented.",
    ],
    cons: [
      "**Every lookup descends to a leaf** — a plain B-tree can return early if a key lands in an internal node; B+ trees pay the full depth every time, which matters on extremely shallow trees or tiny datasets.",
      "**Leaf splits require pointer rewiring** — splitting a leaf demands updating the `next`/`prev` chain pointers in addition to the usual key redistribution, adding bookkeeping that must be done atomically under concurrent access.",
      "**Write amplification on random inserts** — inserting uniformly random keys (e.g. UUIDs as primary keys) causes near-constant leaf splits and index-page writes; LSM-trees handle random writes more gracefully on write-heavy SSD workloads.",
      "**Space overhead from copied separator keys** — the copy-up rule means separator keys exist in both the internal node and the right leaf, slightly inflating space compared to a B-tree where promoted keys live only in the parent.",
      "**Deletion complexity** — removing a key from a leaf may trigger merges or redistributions upward and requires repairing the leaf chain; implementations often defer merges (lazy deletion) to avoid cascading writes.",
    ],
  },

  handsOn: [
    {
      title: "01 · Build 10→80 — watch the leaf chain form",
      body: "Click **Build 10→80** to insert keys 10, 20, 30, 40, 50, 60, 70, 80 in sequence. After the first four inserts the root leaf splits: a separator key is *copied up* to a new internal node and two linked leaves appear at the bottom. Keep watching — the tree grows a second internal level around 6–7 keys. Once all 8 are in, trace the dashed arrows connecting the leaves left-to-right: that chain is the entire sorted dataset in O(1) traversal order. Notice the internal nodes contain only *copies* of split-point keys, never the actual records.",
    },
    {
      title: "02 · Range Scan lo=20 hi=60 — walk the leaf chain",
      body: "After building the tree, set **lo = 20** and **hi = 60**, then click **Range Scan**. The prototype descends the tree once to the first leaf that could hold 20, then highlights each leaf in sequence as it walks the `next` pointers rightward — you'll see the scan hop leaf-to-leaf without touching any internal node again. The **scan hits** counter shows exactly how many keys fell inside the window. Compare the highlighted path with what a plain B-tree in-order traversal would look like: it would revisit every internal node between matching keys.",
    },
    {
      title: "03 · Search — confirm every lookup reaches a leaf",
      body: "Use **Search** on several keys: try a key that exists (e.g. 40) and one that doesn't (e.g. 35). Watch the highlighted path in both cases — it always terminates at a leaf, never at an internal node. The separator key 40 may appear in an internal node as a signpost, but the search still descends past it to the leaf to confirm. This is the 'uniform cost' property: regardless of where in the tree a separator lives, you always pay the full height in node reads.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Try inserting keys out of order (e.g. 55, 13, 77, 3) after **Build 10→80** and watch the leaf splits maintain sorted order in the chain. Then try a **Range Scan** that spans the whole tree (lo=1, hi=99) and verify the scan-hits counter matches the total key count. Finally, experiment with the **Speed** slider: slow it right down during an insert that causes a split and trace exactly which pointer rewirings happen step by step — leaf `next`/`prev` update before the separator propagates upward.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "b-plus-tree.ts",
      code: `// Minimal order-4 B+ tree — search, range scan, and insert sketch.
// All data lives in leaves; internal nodes hold separator keys only.

const ORDER = 4; // max children per internal node

interface Leaf {
  kind: "leaf";
  keys: number[];
  next: Leaf | null;          // linked-list pointer →
}

interface Internal {
  kind: "internal";
  keys: number[];             // separator keys (copies from leaf splits)
  children: (Internal | Leaf)[];
}

type BPlusNode = Internal | Leaf;

function search(root: BPlusNode, target: number): boolean {
  let node = root;
  while (node.kind === "internal") {
    // Find the first separator key > target; follow child to its left.
    const i = node.keys.findIndex((k) => target < k);
    node = i === -1 ? node.children.at(-1)! : node.children[i];
  }
  // node is now a leaf — every search descends to a leaf (uniform cost).
  return (node as Leaf).keys.includes(target);
}

function rangeScan(root: BPlusNode, lo: number, hi: number): number[] {
  // 1. Descend to the first leaf that may contain lo.
  let node = root;
  while (node.kind === "internal") {
    const i = node.keys.findIndex((k) => lo < k);
    node = i === -1 ? node.children.at(-1)! : node.children[i];
  }
  // 2. Walk the leaf linked list, collecting keys in [lo, hi].
  const results: number[] = [];
  let leaf: Leaf | null = node as Leaf;
  while (leaf !== null) {
    for (const k of leaf.keys) {
      if (k > hi) return results;   // past upper bound — stop early
      if (k >= lo) results.push(k);
    }
    leaf = leaf.next;               // follow the chain →
  }
  return results;
}

// insert() — full implementation omitted for brevity; key rules:
//   • Leaf split → COPY the middle key up (key stays in right leaf too).
//   • Internal split → PUSH the middle key up (key leaves the child).
//   • Always rewire leaf.next pointers when splitting a leaf.`,
    },
    {
      label: "Java",
      language: "java",
      filename: "BPlusTree.java",
      code: `// Minimal order-4 B+ tree — search, range scan, and insert sketch.
// All data lives in leaves; internal nodes hold separator keys only.

import java.util.ArrayList;
import java.util.List;

class BPlusTree {
    static final int ORDER = 4; // max children per internal node

    // Base node type; "kind" is encoded by the concrete subclass.
    abstract static class BPlusNode {
        List<Integer> keys = new ArrayList<>();
    }

    static class Leaf extends BPlusNode {
        Leaf next; // linked-list pointer →
    }

    static class Internal extends BPlusNode {
        // keys are separator keys (copies from leaf splits)
        List<BPlusNode> children = new ArrayList<>();
    }

    boolean search(BPlusNode root, int target) {
        BPlusNode node = root;
        while (node instanceof Internal internal) {
            // Find the first separator key > target; follow child to its left.
            int i = firstGreater(internal.keys, target);
            node = i == -1 ? internal.children.get(internal.children.size() - 1)
                           : internal.children.get(i);
        }
        // node is now a leaf — every search descends to a leaf (uniform cost).
        return node.keys.contains(target);
    }

    List<Integer> rangeScan(BPlusNode root, int lo, int hi) {
        // 1. Descend to the first leaf that may contain lo.
        BPlusNode node = root;
        while (node instanceof Internal internal) {
            int i = firstGreater(internal.keys, lo);
            node = i == -1 ? internal.children.get(internal.children.size() - 1)
                           : internal.children.get(i);
        }
        // 2. Walk the leaf linked list, collecting keys in [lo, hi].
        List<Integer> results = new ArrayList<>();
        Leaf leaf = (Leaf) node;
        while (leaf != null) {
            for (int k : leaf.keys) {
                if (k > hi) return results;   // past upper bound — stop early
                if (k >= lo) results.add(k);
            }
            leaf = leaf.next;                 // follow the chain →
        }
        return results;
    }

    // Index of the first key > target, or -1 if none.
    private int firstGreater(List<Integer> keys, int target) {
        for (int i = 0; i < keys.size(); i++)
            if (target < keys.get(i)) return i;
        return -1;
    }

    // insert() — full implementation omitted for brevity; key rules:
    //   • Leaf split → COPY the middle key up (key stays in right leaf too).
    //   • Internal split → PUSH the middle key up (key leaves the child).
    //   • Always rewire leaf.next pointers when splitting a leaf.
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "b_plus_tree.py",
      code: `# Minimal order-4 B+ tree — search, range scan, and insert sketch.
# All data lives in leaves; internal nodes hold separator keys only.

from typing import List, Optional, Union

ORDER = 4  # max children per internal node


class Leaf:
    def __init__(self) -> None:
        self.kind = "leaf"
        self.keys: List[int] = []
        self.next: Optional["Leaf"] = None  # linked-list pointer →


class Internal:
    def __init__(self) -> None:
        self.kind = "internal"
        self.keys: List[int] = []           # separator keys (copies from leaf splits)
        self.children: List[Union["Internal", Leaf]] = []


BPlusNode = Union[Internal, Leaf]


def _first_greater(keys: List[int], target: int) -> int:
    # Index of the first key > target, or -1 if none.
    for i, k in enumerate(keys):
        if target < k:
            return i
    return -1


def search(root: BPlusNode, target: int) -> bool:
    node = root
    while node.kind == "internal":
        # Find the first separator key > target; follow child to its left.
        i = _first_greater(node.keys, target)
        node = node.children[-1] if i == -1 else node.children[i]
    # node is now a leaf — every search descends to a leaf (uniform cost).
    return target in node.keys


def range_scan(root: BPlusNode, lo: int, hi: int) -> List[int]:
    # 1. Descend to the first leaf that may contain lo.
    node = root
    while node.kind == "internal":
        i = _first_greater(node.keys, lo)
        node = node.children[-1] if i == -1 else node.children[i]
    # 2. Walk the leaf linked list, collecting keys in [lo, hi].
    results: List[int] = []
    leaf: Optional[Leaf] = node
    while leaf is not None:
        for k in leaf.keys:
            if k > hi:
                return results          # past upper bound — stop early
            if k >= lo:
                results.append(k)
        leaf = leaf.next                # follow the chain →
    return results


# insert() — full implementation omitted for brevity; key rules:
#   • Leaf split → COPY the middle key up (key stays in right leaf too).
#   • Internal split → PUSH the middle key up (key leaves the child).
#   • Always rewire leaf.next pointers when splitting a leaf.`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "b_plus_tree.cpp",
      code: `// Minimal order-4 B+ tree — search, range scan, and insert sketch.
// All data lives in leaves; internal nodes hold separator keys only.
#include <vector>

constexpr int ORDER = 4; // max children per internal node

enum class Kind { Leaf, Internal };

struct BPlusNode {
    Kind kind;
    std::vector<int> keys;
    explicit BPlusNode(Kind k) : kind(k) {}
    virtual ~BPlusNode() = default;
};

struct Leaf : BPlusNode {
    Leaf* next = nullptr;       // linked-list pointer →
    Leaf() : BPlusNode(Kind::Leaf) {}
};

struct Internal : BPlusNode {
    // keys are separator keys (copies from leaf splits)
    std::vector<BPlusNode*> children;
    Internal() : BPlusNode(Kind::Internal) {}
};

// Index of the first key > target, or -1 if none.
static int firstGreater(const std::vector<int>& keys, int target) {
    for (int i = 0; i < (int)keys.size(); i++)
        if (target < keys[i]) return i;
    return -1;
}

bool search(BPlusNode* root, int target) {
    BPlusNode* node = root;
    while (node->kind == Kind::Internal) {
        // Find the first separator key > target; follow child to its left.
        auto* internal = static_cast<Internal*>(node);
        int i = firstGreater(internal->keys, target);
        node = i == -1 ? internal->children.back() : internal->children[i];
    }
    // node is now a leaf — every search descends to a leaf (uniform cost).
    for (int k : node->keys) if (k == target) return true;
    return false;
}

std::vector<int> rangeScan(BPlusNode* root, int lo, int hi) {
    // 1. Descend to the first leaf that may contain lo.
    BPlusNode* node = root;
    while (node->kind == Kind::Internal) {
        auto* internal = static_cast<Internal*>(node);
        int i = firstGreater(internal->keys, lo);
        node = i == -1 ? internal->children.back() : internal->children[i];
    }
    // 2. Walk the leaf linked list, collecting keys in [lo, hi].
    std::vector<int> results;
    Leaf* leaf = static_cast<Leaf*>(node);
    while (leaf != nullptr) {
        for (int k : leaf->keys) {
            if (k > hi) return results;   // past upper bound — stop early
            if (k >= lo) results.push_back(k);
        }
        leaf = leaf->next;                // follow the chain →
    }
    return results;
}

// insert() — full implementation omitted for brevity; key rules:
//   • Leaf split → COPY the middle key up (key stays in right leaf too).
//   • Internal split → PUSH the middle key up (key leaves the child).
//   • Always rewire leaf->next pointers when splitting a leaf.`,
    },
  ],

  furtherReading: [
    {
      label: "Comer (1979) — *The Ubiquitous B-Tree*, ACM Computing Surveys",
      href: "https://dl.acm.org/doi/10.1145/356770.356776",
      note: "The definitive survey that coined the phrase 'ubiquitous.' Covers B-tree and B+ tree variants, insertion/deletion algorithms, and applications — still the best single reference after 45 years.",
      kind: "paper",
    },
    {
      label: "MySQL Reference Manual — InnoDB Clustered and Secondary Indexes",
      href: "https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html",
      note: "Official MySQL docs explaining how InnoDB's clustered index is a B+ tree where leaf pages contain the full row, and secondary indexes store primary-key values as their 'data' in the leaf.",
      kind: "docs",
    },
    {
      label: "PostgreSQL Documentation — B-Tree Index Access Method",
      href: "https://www.postgresql.org/docs/current/btree.html",
      note: "PostgreSQL's internal B-tree implementation guide: operator class semantics, deduplication, bottom-up deletion, and the `pg_amcheck` consistency checker.",
      kind: "docs",
    },
    {
      label: "Use The Index, Luke — *The Leaf Nodes*",
      href: "https://use-the-index-luke.com/sql/anatomy/the-leaf-nodes",
      note: "A practitioner's illustrated walkthrough of B+ tree leaf structure and the doubly-linked list — emphasises why ordered scans are cheap and random inserts can fragment the leaf layer.",
      kind: "article",
    },
    {
      label: "Wikipedia — B+ tree",
      href: "https://en.wikipedia.org/wiki/B%2B_tree",
      note: "Solid reference for the formal definition, order constraints, split/merge pseudocode, and a comparison table of B-tree variants.",
      kind: "article",
    },
    {
      label: "UC Berkeley CS186 — *B+ Trees* (course notes)",
      href: "https://cs186berkeley.net/notes/note4/",
      note: "Detailed undergraduate database course notes covering search, insert with leaf and internal splits, bulk loading, and I/O cost calculations. Great worked examples for each case.",
      kind: "article",
    },
    {
      label: "CMU 15-445/645 — *Intro to Database Systems* (Fall 2023)",
      href: "https://15445.courses.cs.cmu.edu/fall2023/",
      note: "Andy Pavlo's full database systems course; the B+ tree lecture (lecture 7) covers concurrent index access, latch crabbing, and optimistic locking — production concerns not covered in most textbooks.",
      kind: "video",
    },
  ],

  quiz: [
    {
      id: "bplus-q1",
      question:
        "When a B+ tree leaf node splits, what happens to the middle (separator) key?",
      options: [
        {
          id: "a",
          label:
            "It is moved to the parent internal node and removed from the leaf — the same as a plain B-tree split.",
        },
        {
          id: "b",
          label:
            "It is copied up to the parent internal node and also kept in the right leaf, so all data remains accessible at the leaf level.",
        },
        {
          id: "c",
          label:
            "It is discarded because internal nodes in a B+ tree do not store real keys.",
        },
        {
          id: "d",
          label:
            "It stays in the left leaf and a new search key is generated for the parent.",
        },
      ],
      correctOptionId: "b",
      explanation:
        "B+ tree leaf splits use **copy-up**: the separator key is duplicated — it appears in the parent as a routing signpost *and* remains in the right leaf as part of the actual data. This preserves the invariant that every key is reachable at the leaf level. Plain B-tree splits use *push-up*: the middle key is promoted to the parent and removed from the child, so it lives only in the internal node.",
    },
    {
      id: "bplus-q2",
      question:
        "Why do B+ trees support range scans more efficiently than plain B-trees?",
      options: [
        {
          id: "a",
          label:
            "B+ trees sort keys during insertion, so range queries find data faster.",
        },
        {
          id: "b",
          label:
            "B+ tree internal nodes cache the full range of their subtree, so range bounds are checked at the root.",
        },
        {
          id: "c",
          label:
            "All data is in the leaves, and leaves are linked in sorted order — so a range scan descends once then walks the chain without re-traversing the tree.",
        },
        {
          id: "d",
          label:
            "B+ trees compress adjacent keys, reducing the number of nodes visited during a range query.",
        },
      ],
      correctOptionId: "c",
      explanation:
        "The leaf linked list is the key advantage. A range scan finds the first qualifying leaf via a normal O(log n) descent, then follows `next` pointers across the leaf layer to collect all keys up to the upper bound — visiting only leaf pages, in sequential (or near-sequential) disk order. A plain B-tree has no leaf chain, so a range scan requires a full in-order traversal that revisits internal nodes between matching keys.",
    },
    {
      id: "bplus-q3",
      question:
        "A B+ tree of order 500 stores 125,000,000 records. What is the maximum number of node reads needed to find any single key?",
      options: [
        { id: "a", label: "About 125,000,000 — worst case linear scan." },
        { id: "b", label: "About 1,000 — proportional to the square root of n." },
        {
          id: "c",
          label:
            "About 3 — log base 500 of 125,000,000 is roughly 3, so the tree is at most 3 levels deep.",
        },
        {
          id: "d",
          label:
            "About 17 — log base 2 of 125,000,000, because B+ trees do binary search internally.",
        },
      ],
      correctOptionId: "c",
      explanation:
        "Height = ⌈log_B(n)⌉ where B is the order. log₅₀₀(125,000,000) = log(125,000,000) / log(500) ≈ 8.097 / 2.699 ≈ 3. A 3-level tree means at most 3 page reads to reach any leaf — even for 125 million rows. This is why high fan-out (large B) is so valuable on disk: going from B=2 (binary tree, height ~27) to B=500 (B+ tree, height ~3) cuts disk I/O by nearly 90%.",
    },
  ],
};
