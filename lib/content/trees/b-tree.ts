import type { ConceptContent } from "@/lib/content/types";

export const bTree: ConceptContent = {
  prototypeCaption:
    "An **order-4 B-tree** — each node holds up to 3 keys and up to 4 children. Type a number and press **Insert**, or hit **Random** to pick one, then watch the tree respond. When a node fills up it flashes red, the *middle key is promoted* to the parent, and the node splits in two — try **Sequential 10→80** to see this cascade repeatedly and the root itself split. Use **Search** to trace a lookup from root to leaf; the stat bar tracks total keys, current height, live nodes, and splits performed. The **Speed** slider controls animation pace.",

  overview: [
    {
      type: "p",
      text: "**A B-tree is a balanced multi-way search tree designed around one constraint: one node must fit in one disk block.** On a spinning hard drive or an SSD, the cost of *seeking to a page* and *reading it into RAM* dwarfs arithmetic by a factor of 10,000 or more. Binary search trees minimize comparisons — but comparisons are cheap. What's expensive is the number of pages you must fetch. A node with one key forces you to visit O(log₂ n) pages. A node with 200 keys keeps the same sorted order but collapses the tree to O(log₂₀₀ n) pages — fewer by a factor of 7–8 at database scale.",
    },
    {
      type: "p",
      text: "The mechanics flow from a single parameter: **order *m***, also called the *branching factor*. A node can hold at most *m* − 1 keys and at most *m* children. Every *internal* node (except the root) must hold at least ⌈m/2⌉ − 1 keys — this lower bound is what keeps the tree balanced after deletions, preventing any branch from becoming sparse. All leaves sit at the same depth. The result is a **wide, shallow** tree: height grows as log_m(n), so a real database index with m ≈ 200 reaches every one of a billion records in four or five page reads.",
    },
    {
      type: "p",
      text: "Rudolf Bayer and Edward McCreight invented the B-tree at Boeing Research Labs in 1970 (published 1972) specifically to manage large sorted files on block-addressed storage. The core insight has never become obsolete. Every major relational database — PostgreSQL, MySQL, Oracle, SQL Server, SQLite — uses B-trees (or the leaf-linked variant, **B+ trees**) as the default index structure. Filesystems (NTFS, HFS+, ext4's `htree`) use them for directory lookups. The data structure is now over 50 years old and remains the dominant on-disk search structure because the disk-read bottleneck it was designed to solve is as real today as it was in 1970.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Searching a B-tree" },
    {
      type: "ol",
      items: [
        "Start at the **root node**. Scan its keys left-to-right (or binary-search them) to find the first key ≥ your target.",
        "If the target equals that key, you're done — the record is here (or a pointer to it is).",
        "If the target is less than that key, follow the child pointer to the *left* of it. If you've passed all keys, follow the rightmost child pointer.",
        "Repeat at the child node. Each level eliminates all but one subtree.",
        "If you reach a leaf and the key is absent, the target is not in the tree.",
      ],
    },
    { type: "h", text: "Insertion and split-on-overflow" },
    {
      type: "ol",
      items: [
        "**Descend to the correct leaf** using the same search logic — follow child pointers at each level until you hit a leaf.",
        "Insert the new key into the leaf in sorted order.",
        "If the leaf now has *m* keys (one too many), **split it**: the middle key is *promoted* to the parent; the remaining keys are divided left and right into two new sibling nodes.",
        "The parent has gained a key. If the parent is now also full, split it too — the middle key of the *parent* promotes to *its* parent. This can cascade upward.",
        "**If the root splits**, a new root is created holding just the single promoted key and two children. This is the only way a B-tree grows taller — trees always grow at the root, never at the leaves.",
        "All leaves remain at the same depth after every insertion.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why fewer levels = fewer disk seeks",
      text: "Each level of the tree is one page fetch. A binary search tree over 1 million records has depth ~20; an order-200 B-tree has depth ~3. That's the difference between 20 disk reads and 3. On spinning storage at 10 ms per seek, 20 seeks costs 200 ms; 3 seeks costs 30 ms — a 6× wall-clock difference on a single lookup, compounding across every query a database processes.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "The minimum-keys rule",
      text: "Every non-root internal node must hold at least ⌈m/2⌉ − 1 keys. For order 4, that's 1 key minimum, 3 keys maximum. This *half-full guarantee* bounds the tree's height from both directions: nodes can't be too sparse (tree stays shallow) and can't overflow (splits keep capacity bounded). The root is exempt — it can hold as few as 1 key and 2 children, which is what it looks like right after a root split.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When a B-tree is the right structure" },
    {
      type: "ul",
      items: [
        "**Database indexes** — any SQL `CREATE INDEX` defaults to a B-tree. Range queries (`WHERE age BETWEEN 20 AND 30`), equality lookups, and `ORDER BY` all use the sorted leaf layer efficiently.",
        "**Filesystem directories** — large directories (thousands of entries) in NTFS, HFS+, and ext4's `dir_index` feature are B-trees over filename keys, giving O(log n) lookup instead of O(n) linear scan.",
        "**Key-value stores on disk** — RocksDB, LevelDB, and WiredTiger all use variants of B-trees or LSM trees where the sorted-page property is central.",
        "**Any sorted dataset larger than RAM** — if the data fits in memory, a red-black tree or skip list is simpler; once the dataset exceeds RAM, the page-aligned B-tree wins on I/O.",
        "**Ordered iteration** — B-trees (especially B+ trees with linked leaves) support efficient `SELECT ... ORDER BY` and range scans without a full sort.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**In-memory data, small dataset** — a red-black tree (used in `std::map`, Java `TreeMap`) or AVL tree has lower per-operation constant overhead when every node is already in cache.",
        "**Hash-only lookups, no ranges needed** — a hash table gives O(1) exact-match lookup vs O(log_m n) for B-tree; use it when you never need range queries or sorted order.",
        "**Write-heavy workloads needing maximum throughput** — LSM trees (Log-Structured Merge trees, as in RocksDB) batch writes in memory and flush sequentially, avoiding random-write amplification that B-trees can suffer on SSDs.",
        "**Multidimensional spatial queries** — a B-tree indexes one dimension. Spatial queries (`points within a rectangle`) need an R-tree, k-d tree, or GiST index instead.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Logarithmic height on the branching factor** — O(log_m n) pages per lookup; at m = 200, a billion-record index is only 4–5 levels deep.",
      "**Guaranteed balance** — every leaf is at the same depth after every operation. No rebalancing heuristics, no worst-case degeneration like an unbalanced BST.",
      "**Efficient range scans** — keys within a node are sorted; in a B+ tree, leaves are linked so a range query becomes one root-to-leaf descent then a sequential leaf scan.",
      "**Tunable to hardware** — setting the order so each node fills exactly one disk block (typically 4 KB or 16 KB) aligns I/O to the storage unit, eliminating partial-page waste.",
      "**Half-century of production hardening** — the structure and its deletion/merge algorithms are implemented, tested, and understood in every major database engine.",
    ],
    cons: [
      "**Split cascades add write amplification** — a single insert can cause splits at every level up to the root, writing O(log_m n) pages instead of one.",
      "**Complex implementation** — split, promote, merge-on-underflow, and borrow-from-sibling cover many edge cases. A correct, concurrent B-tree (with page latching) is a weeks-long engineering effort.",
      "**Poor locality for random writes on SSDs** — SSD pages must be erased in large blocks; random in-place overwrites during splits cause write amplification at the firmware level, which LSM trees avoid.",
      "**Space overhead** — the minimum-keys rule means pages are at most half-empty after a sequence of deletions, wasting up to 50 % of allocated space until a vacuum/reorganize pass.",
      "**Not cache-friendly for tiny datasets** — for data that fits in L2/L3 cache, a sorted array with binary search often outperforms a B-tree due to lower pointer-chasing overhead.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch repeated splits and root growth",
      body: "Press **Sequential 10→80** and let it run at default speed. Count the red flashes — each one is a node overflowing and splitting. Notice that once the *root* splits, the tree gains a new level: height jumps from 1 to 2, then later from 2 to 3. In an order-4 tree, the root first splits when the 4th key is inserted; subsequent root splits take progressively longer because more leaf splits must cascade up first. Try pausing with the **Speed** slider near zero to catch each promotion in slow motion.",
    },
    {
      title: "02 · Explore the mixed-insert pattern",
      body: "Hit **Reset** then press **Mixed inserts**. This sequence interleaves small and large values so splits land at different internal nodes rather than cascading straight up the right spine. Watch how the tree's shape differs from the sequential case — the key distribution is more even, splits are more spread out, and the height grows more slowly. When the demo finishes, compare the *splits* counter to the sequential run: same number of insertions, but fewer root splits because internal nodes absorb more promotions before filling.",
    },
    {
      title: "03 · Search and count node visits",
      body: "After running either demo, type a key that you saw inserted (e.g. `45`) into the input and press **Search**. Watch the prototype highlight each node it visits, root → internal → leaf. Count them — that number is the *height* of the tree, and it equals the number of disk-page reads a real database would issue. Now search for a key that was never inserted (e.g. `99`). The traversal still visits the same number of nodes before concluding the key is absent: B-tree search cost is always O(height), hit or miss.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Hit **Reset** and insert keys in a hand-crafted order. Try to force a root split with as few insertions as possible (hint: 4 insertions suffice in order 4). Then insert a key that lands in the same leaf as an existing key and confirm the split still produces a valid sorted tree. Finally, use **Random** repeatedly and watch whether the tree ever becomes unbalanced — it won't, and that's the point. The B-tree's invariants guarantee balance regardless of insertion order, which is exactly the guarantee an unbalanced BST cannot give.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "b-tree.ts",
      code: `// Minimal B-tree: search + insert-with-split. Order is configurable.
// "Order m" means: max m children, max m-1 keys, min ⌈m/2⌉-1 keys (non-root).

const ORDER = 4; // prototype uses order 4 (max 3 keys/node)
const MAX_KEYS = ORDER - 1;       // 3
const MIN_KEYS = Math.ceil(ORDER / 2) - 1; // 1

interface BNode {
  keys: number[];
  children: BNode[];
  isLeaf: boolean;
}

function makeNode(isLeaf: boolean): BNode {
  return { keys: [], children: [], isLeaf };
}

// --- Search ---
// Returns true if key exists anywhere in the subtree rooted at node.
function search(node: BNode, key: number): boolean {
  let i = 0;
  while (i < node.keys.length && key > node.keys[i]) i++;

  if (i < node.keys.length && key === node.keys[i]) return true; // found
  if (node.isLeaf) return false;                                  // not here
  return search(node.children[i], key);                           // descend
}

// --- Insert (non-full root entry point) ---
let root: BNode = makeNode(true);

function insert(key: number): void {
  if (root.keys.length === MAX_KEYS) {
    // Root is full — split it and grow the tree upward.
    const oldRoot = root;
    root = makeNode(false);
    root.children.push(oldRoot);
    splitChild(root, 0); // split the only child (oldRoot)
  }
  insertNonFull(root, key);
}

// Precondition: node has room for at least one more key.
function insertNonFull(node: BNode, key: number): void {
  let i = node.keys.length - 1;
  if (node.isLeaf) {
    node.keys.push(0); // make room
    while (i >= 0 && key < node.keys[i]) {
      node.keys[i + 1] = node.keys[i];
      i--;
    }
    node.keys[i + 1] = key;
  } else {
    while (i >= 0 && key < node.keys[i]) i--;
    i++;
    if (node.children[i].keys.length === MAX_KEYS) {
      splitChild(node, i);
      if (key > node.keys[i]) i++;
    }
    insertNonFull(node.children[i], key);
  }
}

// Split the i-th child of parent (which must be full).
// Middle key is promoted into parent; two half-nodes remain.
function splitChild(parent: BNode, i: number): void {
  const full = parent.children[i];
  const mid = Math.floor(MAX_KEYS / 2); // index of the promoted key
  const right = makeNode(full.isLeaf);

  right.keys = full.keys.splice(mid + 1);       // right half
  const promoted = full.keys.splice(mid)[0];     // middle key

  if (!full.isLeaf) {
    right.children = full.children.splice(mid + 1);
  }

  parent.keys.splice(i, 0, promoted);            // promote
  parent.children.splice(i + 1, 0, right);       // link right sibling
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "BTree.java",
      code: `// Minimal B-tree: search + insert-with-split. Order is configurable.
// "Order m" means: max m children, max m-1 keys, min ⌈m/2⌉-1 keys (non-root).

import java.util.ArrayList;
import java.util.List;

class BTree {
    static final int ORDER = 4; // prototype uses order 4 (max 3 keys/node)
    static final int MAX_KEYS = ORDER - 1;                  // 3
    static final int MIN_KEYS = (int) Math.ceil(ORDER / 2.0) - 1; // 1

    static class BNode {
        List<Integer> keys = new ArrayList<>();
        List<BNode> children = new ArrayList<>();
        boolean isLeaf;

        BNode(boolean isLeaf) { this.isLeaf = isLeaf; }
    }

    private BNode root = new BNode(true);

    // --- Search ---
    // Returns true if key exists anywhere in the subtree rooted at node.
    boolean search(BNode node, int key) {
        int i = 0;
        while (i < node.keys.size() && key > node.keys.get(i)) i++;

        if (i < node.keys.size() && key == node.keys.get(i)) return true; // found
        if (node.isLeaf) return false;                                    // not here
        return search(node.children.get(i), key);                         // descend
    }

    // --- Insert (non-full root entry point) ---
    void insert(int key) {
        if (root.keys.size() == MAX_KEYS) {
            // Root is full — split it and grow the tree upward.
            BNode oldRoot = root;
            root = new BNode(false);
            root.children.add(oldRoot);
            splitChild(root, 0); // split the only child (oldRoot)
        }
        insertNonFull(root, key);
    }

    // Precondition: node has room for at least one more key.
    private void insertNonFull(BNode node, int key) {
        int i = node.keys.size() - 1;
        if (node.isLeaf) {
            node.keys.add(0); // make room
            while (i >= 0 && key < node.keys.get(i)) {
                node.keys.set(i + 1, node.keys.get(i));
                i--;
            }
            node.keys.set(i + 1, key);
        } else {
            while (i >= 0 && key < node.keys.get(i)) i--;
            i++;
            if (node.children.get(i).keys.size() == MAX_KEYS) {
                splitChild(node, i);
                if (key > node.keys.get(i)) i++;
            }
            insertNonFull(node.children.get(i), key);
        }
    }

    // Split the i-th child of parent (which must be full).
    // Middle key is promoted into parent; two half-nodes remain.
    private void splitChild(BNode parent, int i) {
        BNode full = parent.children.get(i);
        int mid = MAX_KEYS / 2; // index of the promoted key
        BNode right = new BNode(full.isLeaf);

        // right half: keys after the middle
        right.keys = new ArrayList<>(full.keys.subList(mid + 1, full.keys.size()));
        int promoted = full.keys.get(mid);                  // middle key
        // trim full to just the left half (keys before mid)
        full.keys = new ArrayList<>(full.keys.subList(0, mid));

        if (!full.isLeaf) {
            right.children =
                new ArrayList<>(full.children.subList(mid + 1, full.children.size()));
            full.children = new ArrayList<>(full.children.subList(0, mid + 1));
        }

        parent.keys.add(i, promoted);             // promote
        parent.children.add(i + 1, right);        // link right sibling
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "b_tree.py",
      code: `# Minimal B-tree: search + insert-with-split. Order is configurable.
# "Order m" means: max m children, max m-1 keys, min ⌈m/2⌉-1 keys (non-root).

import math

ORDER = 4  # prototype uses order 4 (max 3 keys/node)
MAX_KEYS = ORDER - 1                       # 3
MIN_KEYS = math.ceil(ORDER / 2) - 1        # 1


class BNode:
    def __init__(self, is_leaf: bool) -> None:
        self.keys: list[int] = []
        self.children: list["BNode"] = []
        self.is_leaf = is_leaf


# --- Search ---
# Returns True if key exists anywhere in the subtree rooted at node.
def search(node: BNode, key: int) -> bool:
    i = 0
    while i < len(node.keys) and key > node.keys[i]:
        i += 1

    if i < len(node.keys) and key == node.keys[i]:
        return True            # found
    if node.is_leaf:
        return False           # not here
    return search(node.children[i], key)  # descend


# --- Insert (non-full root entry point) ---
root = BNode(is_leaf=True)


def insert(key: int) -> None:
    global root
    if len(root.keys) == MAX_KEYS:
        # Root is full — split it and grow the tree upward.
        old_root = root
        root = BNode(is_leaf=False)
        root.children.append(old_root)
        split_child(root, 0)  # split the only child (old_root)
    insert_non_full(root, key)


# Precondition: node has room for at least one more key.
def insert_non_full(node: BNode, key: int) -> None:
    i = len(node.keys) - 1
    if node.is_leaf:
        node.keys.append(0)  # make room
        while i >= 0 and key < node.keys[i]:
            node.keys[i + 1] = node.keys[i]
            i -= 1
        node.keys[i + 1] = key
    else:
        while i >= 0 and key < node.keys[i]:
            i -= 1
        i += 1
        if len(node.children[i].keys) == MAX_KEYS:
            split_child(node, i)
            if key > node.keys[i]:
                i += 1
        insert_non_full(node.children[i], key)


# Split the i-th child of parent (which must be full).
# Middle key is promoted into parent; two half-nodes remain.
def split_child(parent: BNode, i: int) -> None:
    full = parent.children[i]
    mid = MAX_KEYS // 2  # index of the promoted key
    right = BNode(is_leaf=full.is_leaf)

    right.keys = full.keys[mid + 1:]        # right half
    promoted = full.keys[mid]               # middle key
    full.keys = full.keys[:mid]             # left half

    if not full.is_leaf:
        right.children = full.children[mid + 1:]
        full.children = full.children[:mid + 1]

    parent.keys.insert(i, promoted)         # promote
    parent.children.insert(i + 1, right)    # link right sibling`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "b_tree.cpp",
      code: `// Minimal B-tree: search + insert-with-split. Order is configurable.
// "Order m" means: max m children, max m-1 keys, min ⌈m/2⌉-1 keys (non-root).
#include <memory>
#include <vector>

constexpr int ORDER = 4; // prototype uses order 4 (max 3 keys/node)
constexpr int MAX_KEYS = ORDER - 1;       // 3
constexpr int MIN_KEYS = (ORDER + 1) / 2 - 1; // 1 = ceil(ORDER/2) - 1

struct BNode {
    std::vector<int> keys;
    std::vector<std::unique_ptr<BNode>> children;
    bool isLeaf;
    explicit BNode(bool leaf) : isLeaf(leaf) {}
};

class BTree {
    std::unique_ptr<BNode> root = std::make_unique<BNode>(true);

public:
    // --- Search ---
    // Returns true if key exists anywhere in the subtree rooted at node.
    bool search(BNode* node, int key) {
        int i = 0;
        while (i < (int)node->keys.size() && key > node->keys[i]) i++;

        if (i < (int)node->keys.size() && key == node->keys[i]) return true; // found
        if (node->isLeaf) return false;                                      // not here
        return search(node->children[i].get(), key);                         // descend
    }

    // --- Insert (non-full root entry point) ---
    void insert(int key) {
        if ((int)root->keys.size() == MAX_KEYS) {
            // Root is full — split it and grow the tree upward.
            auto newRoot = std::make_unique<BNode>(false);
            newRoot->children.push_back(std::move(root));
            root = std::move(newRoot);
            splitChild(root.get(), 0); // split the only child (oldRoot)
        }
        insertNonFull(root.get(), key);
    }

private:
    // Precondition: node has room for at least one more key.
    void insertNonFull(BNode* node, int key) {
        int i = (int)node->keys.size() - 1;
        if (node->isLeaf) {
            node->keys.push_back(0); // make room
            while (i >= 0 && key < node->keys[i]) {
                node->keys[i + 1] = node->keys[i];
                i--;
            }
            node->keys[i + 1] = key;
        } else {
            while (i >= 0 && key < node->keys[i]) i--;
            i++;
            if ((int)node->children[i]->keys.size() == MAX_KEYS) {
                splitChild(node, i);
                if (key > node->keys[i]) i++;
            }
            insertNonFull(node->children[i].get(), key);
        }
    }

    // Split the i-th child of parent (which must be full).
    // Middle key is promoted into parent; two half-nodes remain.
    void splitChild(BNode* parent, int i) {
        BNode* full = parent->children[i].get();
        int mid = MAX_KEYS / 2; // index of the promoted key
        auto right = std::make_unique<BNode>(full->isLeaf);

        // right half: keys after the middle
        right->keys.assign(full->keys.begin() + mid + 1, full->keys.end());
        int promoted = full->keys[mid];                 // middle key
        full->keys.resize(mid);                          // left half

        if (!full->isLeaf) {
            for (int j = mid + 1; j < (int)full->children.size(); j++)
                right->children.push_back(std::move(full->children[j]));
            full->children.resize(mid + 1);
        }

        parent->keys.insert(parent->keys.begin() + i, promoted);  // promote
        parent->children.insert(parent->children.begin() + i + 1,
                                std::move(right));                // link right sibling
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Bayer & McCreight — *Organization and Maintenance of Large Ordered Indexes* (1972)",
      href: "https://link.springer.com/article/10.1007/BF00288683",
      note: "The original paper in Acta Informatica that introduced B-trees. Dense and mathematical, but the problem statement on pages 1–3 explains the disk-block motivation as clearly as anything written since.",
      kind: "paper",
    },
    {
      label: "Comer — *The Ubiquitous B-Tree*, ACM Computing Surveys (1979)",
      href: "https://dl.acm.org/doi/10.1145/356770.356776",
      note: "The definitive survey: search, insert, delete, B+ tree variant, and concurrency — all in one readable 23-page paper. Still the best single reference for understanding B-tree algorithms fully.",
      kind: "paper",
    },
    {
      label: "CLRS — *Introduction to Algorithms*, Chapter 18: B-Trees",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "Textbook-rigorous treatment of search, insert, and delete with loop invariants and worked examples. Chapter 18 is self-contained and the pseudocode maps cleanly to any language.",
      kind: "book",
    },
    {
      label: "Wikipedia — B-tree",
      href: "https://en.wikipedia.org/wiki/B-tree",
      note: "Good structural overview with diagrams for split and merge operations, a comparison of B-tree variants (B+ tree, B* tree), and a survey of real-world uses in databases and filesystems.",
      kind: "article",
    },
    {
      label: "Use The Index, Luke — *The Anatomy of an Index*",
      href: "https://use-the-index-luke.com/sql/anatomy/the-tree",
      note: "A practitioner's guide to how database B-tree indexes actually work under SQL queries — covers leaf-node doubly-linked lists, clustered vs non-clustered indexes, and why `LIKE '%foo'` can't use a B-tree.",
      kind: "article",
    },
    {
      label: "SQLite — Database File Format (B-tree pages)",
      href: "https://www.sqlite.org/fileformat.html",
      note: "The SQLite file format spec documents exactly how table and index B-trees are laid out on disk: page headers, cell arrays, overflow pages. Reading this makes the one-node-per-page design concrete.",
      kind: "docs",
    },
    {
      label: "PostgreSQL docs — Index Types: B-Tree",
      href: "https://www.postgresql.org/docs/current/indexes-types.html",
      note: "Documents which operators PostgreSQL's B-tree indexes accelerate, when the planner chooses them, and the storage parameters (`fillfactor`) that control how full pages are kept to reduce split frequency.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "btree-q1",
      question:
        "In an order-4 B-tree, a leaf node currently holds the keys [10, 20, 30]. You insert 25. What happens?",
      options: [
        {
          id: "a",
          label:
            "The key is inserted in place; the node now holds [10, 20, 25, 30] and no split occurs because 4 keys is allowed.",
        },
        {
          id: "b",
          label:
            "The node overflows to 4 keys, so it splits: 20 is promoted to the parent and the node becomes [10] and [25, 30].",
        },
        {
          id: "c",
          label:
            "The node overflows to 4 keys, so it splits: 25 is promoted to the parent and the node becomes [10, 20] and [30].",
        },
        {
          id: "d",
          label: "The insertion is rejected because the node is already at capacity.",
        },
      ],
      correctOptionId: "b",
      explanation:
        "Order 4 means max 3 keys (m − 1). After inserting 25 the node holds [10, 20, 25, 30] — 4 keys, one too many. The *middle* key of the 4 is promoted: index ⌊3/2⌋ = 1, which is 20. The left half [10] and right half [25, 30] become the two sibling nodes. The promoted key 20 moves up to the parent, which may itself overflow and split.",
    },
    {
      id: "btree-q2",
      question:
        "A B-tree with order *m* over *n* records guarantees a search visits at most how many nodes (disk pages)?",
      options: [
        { id: "a", label: "O(log₂ n) — same as a binary search tree." },
        { id: "b", label: "O(n / m) — the number of nodes at the leaf level." },
        { id: "c", label: "O(log_m n) — height grows with the *m*-th root of n." },
        { id: "d", label: "O(m · log n) — wider nodes cost more comparisons per level." },
      ],
      correctOptionId: "c",
      explanation:
        "Each node branches up to *m* ways, so the height of the tree is at most log_m(n). A search visits at most one node per level, giving O(log_m n) page reads. This is why a large *m* matters so much: log₂₀₀(1,000,000,000) ≈ 3.8, while log₂(1,000,000,000) ≈ 30. Option D is a common mistake — the extra comparisons *within* a node are RAM operations, not disk reads, so they don't dominate.",
    },
    {
      id: "btree-q3",
      question:
        "B-trees always grow *upward* — the root splits rather than leaves being pushed down. What consequence does this have?",
      options: [
        {
          id: "a",
          label:
            "It means the oldest inserted keys are always near the root and newer ones near the leaves.",
        },
        {
          id: "b",
          label:
            "It guarantees all leaves remain at the same depth after every insertion, keeping the tree perfectly balanced.",
        },
        {
          id: "c",
          label:
            "It means the tree can only grow taller during a root split, making insertions slower over time.",
        },
        {
          id: "d",
          label:
            "It means frequently searched keys migrate to the root over time, like a splay tree.",
        },
      ],
      correctOptionId: "b",
      explanation:
        "Because the tree grows by splitting the root upward, a new level is added *above* all existing leaves simultaneously — every leaf is still the same distance from the root. In contrast, a BST grows downward by attaching new leaves wherever the insertion falls, which can make some leaves far deeper than others. The upward-growth invariant is the mechanism that makes B-trees self-balancing without any after-the-fact rotations or rebalancing passes.",
    },
  ],
};
