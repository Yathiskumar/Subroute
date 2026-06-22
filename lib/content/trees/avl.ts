import type { ConceptContent } from "@/lib/content/types";

export const avl: ConceptContent = {
  prototypeCaption:
    "A live AVL tree with **balance-factor badges** on every node. Type a value and press **Insert** or **Delete**, hit **Random** to add a random integer, or **Reset** to clear. The **Speed** slider controls animation pace. Use the four demo buttons — **LL · single right-rotate**, **RR · single left-rotate**, **LR · double**, **RL · double** — to watch each rotation case in isolation. Unbalanced nodes turn *red* the instant their balance factor leaves ±1; nodes involved in a rotation pulse *purple*. Stats bar tracks total nodes, tree height, rotation count, and whether the tree is currently balanced.",

  overview: [
    {
      type: "p",
      text: "**An AVL tree is a binary search tree that repairs itself after every write.** Named after Georgy Adelson-Velsky and Evgenii Landis, who published the structure in 1962, it was the first self-balancing BST ever described. The core promise: for any node in the tree, the heights of its left and right subtrees differ by *at most one*. Break that rule with an insert or delete, and the tree fixes itself immediately with one or two pointer swaps called *rotations*.",
    },
    {
      type: "p",
      text: "That single-node invariant has a global consequence: the height of an AVL tree with n nodes is always **O(log n)**. A plain BST fed sorted input degenerates into a linked list — height n, O(n) search. An AVL tree fed the same sorted input keeps rebalancing as it goes, holding height at roughly 1.44 log₂ n. Every search, insert, and delete therefore runs in **O(log n)** time, worst-case, guaranteed. That is the trade the tree makes: a small constant overhead on every write, in exchange for a hard cap on every read.",
    },
    {
      type: "p",
      text: "AVL trees are more rigidly balanced than **red-black trees** — the other workhorse self-balancing BST. A red-black tree allows one subtree to be up to *twice* the height of the other; an AVL tree allows only one level of difference. The result is that **AVL lookup is faster** (shallower trees, fewer comparisons) while **AVL insert/delete trigger more rotations** on average. That trade-off steers practitioners toward AVL trees for read-heavy workloads — in-memory databases, language runtimes' symbol tables, interval trees — and toward red-black trees for write-heavy workloads like the Linux kernel's `rbtree` or Java's `TreeMap`.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Balance factor and the ±1 invariant" },
    {
      type: "ul",
      items: [
        "Every node stores its **balance factor** (BF) = height(left subtree) − height(right subtree).",
        "After every insert or delete, recompute BFs up the path from the changed node to the root.",
        "A BF of **−1, 0, or +1** is healthy. A BF of **−2 or +2** triggers a rotation at that node.",
        "Height of a null child is defined as **−1**, so a lone leaf has BF 0.",
      ],
    },
    { type: "h", text: "The four rotation cases" },
    {
      type: "ol",
      items: [
        "**LL — single right rotation.** Insert into the *left* child of the *left* subtree. Example: insert 30, 20, 10 into an empty tree. When 10 arrives, node 30 reaches BF +2. Its left child 20 has BF +1 (left-heavy). Fix: pivot right at 30 — 20 becomes the new root, 30 becomes 20's right child, 10 stays 20's left child.",
        "**RR — single left rotation.** Insert into the *right* child of the *right* subtree. Mirror image of LL. Example: insert 10, 20, 30. When 30 arrives, node 10 reaches BF −2. Its right child 20 has BF −1. Fix: pivot left at 10.",
        "**LR — double rotation (left then right).** Insert into the *right* child of the *left* subtree. Example: insert 30, 10, 20. Node 30 gets BF +2, but its left child 10 has BF −1 (right-heavy) — a single right rotation at 30 would not fix it. Fix: rotate *left* at 10 first (converting it to LL shape), then rotate *right* at 30.",
        "**RL — double rotation (right then left).** Insert into the *left* child of the *right* subtree. Mirror image of LR. Example: insert 10, 30, 20. Fix: rotate *right* at 30 first, then rotate *left* at 10.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "How to remember which case you're in",
      text: "Look at the **unbalanced node** and its **heavier child**. If both lean the same direction (node left-heavy, child left-heavy → LL; node right-heavy, child right-heavy → RR), one rotation suffices. If they lean *opposite* directions (node left-heavy, child right-heavy → LR; node right-heavy, child left-heavy → RL), you need two rotations — first straighten the child, then rotate the root.",
    },
    { type: "h", text: "Why height stays O(log n)" },
    {
      type: "ul",
      items: [
        "Let N(h) be the *minimum* number of nodes in an AVL tree of height h. Then N(h) = N(h−1) + N(h−2) + 1 — a Fibonacci-like recurrence.",
        "Solving it gives N(h) ≈ φ^h / √5, where φ ≈ 1.618. Inverting: h ≤ log_φ(n) ≈ 1.44 log₂(n).",
        "Because height is bounded by a constant times log₂ n, every operation that walks root-to-leaf (search, insert, delete) runs in **O(log n)**.",
        "Rotations themselves are O(1) — they swap a fixed number of pointers — and at most two happen per insert (one for LR/RL, one for the outer fix).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Delete can trigger a chain of rotations",
      text: "Insert needs **at most one rotation** (or one double-rotation) to restore balance. Delete is trickier: removing a node can unbalance its parent, and fixing the parent can unbalance *its* parent, propagating all the way to the root. In the worst case, delete triggers **O(log n) rotations** up the path. Each rotation is still O(1), so the total delete cost stays O(log n), but the constant is higher than for insert.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When AVL is the right choice" },
    {
      type: "ul",
      items: [
        "**Read-heavy workloads** — its stricter balance (max height ≈ 1.44 log₂ n vs red-black's ≈ 2 log₂ n) means fewer comparisons per lookup. Databases that serve many more reads than writes benefit directly.",
        "**Sorted iteration in O(n)** — like any BST, an in-order traversal visits all keys in sorted order in linear time. Combine that with O(log n) search and you get an efficient ordered map.",
        "**Interval trees and augmented BSTs** — AVL's strict balance is attractive when you augment each node with extra metadata (interval endpoints, subtree max) and need that metadata to stay shallow.",
        "**Language runtimes and compiler symbol tables** — fast lookup with infrequent inserts; the rigid balance is worth the rotation overhead.",
        "**When you need a provably tight height bound** — red-black trees have a simpler implementation but a looser bound; AVL gives you the tightest classical guarantee without external structures.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Write-heavy workloads** — if inserts and deletes dominate, the extra rotations and height-field bookkeeping make red-black trees or B-trees more efficient in practice.",
        "**On-disk or cache-unfriendly sizes** — AVL trees are pointer-based structures with poor locality. For large datasets that don't fit in L2 cache, a **B-tree** (many keys per node, few cache misses) wins by a wide margin.",
        "**When implementation simplicity matters** — AVL trees have four distinct rotation cases to handle correctly; a **skip list** or **treap** achieves similar expected bounds with much simpler code.",
        "**Concurrent access** — lock-coupling an AVL tree during rotations is non-trivial. Concurrent skip lists or lock-free structures are usually easier to reason about.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Guaranteed O(log n) for search, insert, and delete** — no degenerate case, no amortized handwaving. Every operation is worst-case logarithmic.",
      "**Tighter balance than red-black trees** — height is at most 1.44 log₂ n, so lookups touch fewer nodes. Measurably faster in read-dominated benchmarks.",
      "**Simple invariant** — the ±1 balance-factor rule is easy to test and easy to audit; invariant-checking is a one-liner during debugging.",
      "**In-order traversal in O(n)** — delivers all keys in sorted order in linear time, like any BST, making it a natural ordered map.",
      "**Rotations are O(1)** — each rotation swaps a constant number of pointers; the bookkeeping overhead per operation is tiny.",
    ],
    cons: [
      "**More rotations than red-black on writes** — delete can trigger O(log n) rotations propagating up the tree; insert up to two. Red-black trees bound both at O(1) amortized.",
      "**Extra memory per node** — each node must store a height or balance-factor field. Small in absolute terms, but matters in memory-tight environments with millions of nodes.",
      "**Four rotation cases to implement correctly** — LL, RR, LR, RL each require different code paths; a single off-by-one in a height update corrupts the whole tree silently.",
      "**Poor cache behaviour** — pointer-chasing down a height-log-n chain of heap-allocated nodes produces cache misses that dominate at large n; B-trees or van Emde Boas layouts win there.",
      "**Not concurrent-friendly** — rotations modify multiple pointers; safe concurrent access requires fine-grained locking or complex lock-free protocols.",
    ],
  },

  handsOn: [
    {
      title: "01 · LL and RR — single rotations",
      body: "Click **LL · single right-rotate (10,20,30)**. Watch the tree build as 10, 20, 30 are inserted in order. When 30 lands, node 10's balance factor drops to −2 and turns red — the RR violation. A *single left rotation* at 10 fires: 20 rises to the root, 10 drops left, 30 stays right. The tree is balanced in one pivot. Now click **RR · single left-rotate (30,20,10)** — the mirror image. Node 30 gets BF +2 after 10 arrives; a single right rotation at 30 fixes it. Notice the rotation counter increments by exactly one each time.",
    },
    {
      title: "02 · LR and RL — double rotations",
      body: "Click **LR · double (30,10,20)**. Insert order is 30, 10, 20. When 20 lands, node 30 has BF +2 but its left child 10 has BF −1 — they lean *opposite* directions, so a single right rotation at 30 would push the imbalance down rather than fix it. Watch the two-step fix: first a left rotation at 10 (converting the shape to LL), then a right rotation at 30. The rotation counter jumps by two. Now click **RL · double (10,30,20)** — the mirror: right rotation at 30, then left rotation at 10. Both double-rotation demos end with the same balanced three-node tree; only the intermediate state differs.",
    },
    {
      title: "03 · Insert sorted values — AVL vs a plain BST",
      body: "Use the number input to insert 1, 2, 3, 4, 5, 6, 7 in order. A plain BST would degenerate to a right-leaning chain of height 6 — every search would scan all seven nodes. Watch what the AVL tree does instead: after each insert the tree rebalances, and the height stat in the panel never exceeds 3. By the time all seven nodes are in, you have a near-perfect tree of height 2. Then insert a few more sorted values (8, 9, 10) and confirm the height stays at 3. The contrast with a degenerate BST is the entire point of the data structure.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Press **Random** five or six times to build a random tree, then use **Delete** to remove nodes one at a time. Watch the balance factors and rotation counter after each deletion — deletes can cascade rotations all the way up the path to the root, unlike inserts which need at most two. Try to find a sequence of deletions that triggers three or more rotations from a single delete. Then **Reset** and try inserting your own sequence to create an LR or RL shape manually before the tree auto-fixes it.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "avl.ts",
      code: `// Minimal AVL tree — insert with rebalancing.
// Each node tracks its own height; balance factor is derived on the fly.

interface AVLNode {
  key: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
}

function height(n: AVLNode | null): number {
  return n ? n.height : -1;           // null → height -1 by convention
}

function bf(n: AVLNode): number {
  return height(n.left) - height(n.right);
}

function updateHeight(n: AVLNode): void {
  n.height = 1 + Math.max(height(n.left), height(n.right));
}

// ── Rotations ────────────────────────────────────────────────────────────────

function rotateRight(y: AVLNode): AVLNode {   // fixes LL imbalance
  const x = y.left!;
  y.left = x.right;
  x.right = y;
  updateHeight(y);
  updateHeight(x);
  return x;                                   // x is the new root
}

function rotateLeft(x: AVLNode): AVLNode {    // fixes RR imbalance
  const y = x.right!;
  x.right = y.left;
  y.left = x;
  updateHeight(x);
  updateHeight(y);
  return y;
}

function rebalance(n: AVLNode): AVLNode {
  updateHeight(n);
  const b = bf(n);

  if (b > 1) {                        // left-heavy
    if (bf(n.left!) < 0)              // LR case: straighten first
      n.left = rotateLeft(n.left!);
    return rotateRight(n);            // LL (or now-straightened LR)
  }
  if (b < -1) {                       // right-heavy
    if (bf(n.right!) > 0)             // RL case: straighten first
      n.right = rotateRight(n.right!);
    return rotateLeft(n);             // RR (or now-straightened RL)
  }
  return n;                           // already balanced
}

// ── Public API ────────────────────────────────────────────────────────────────

function insert(root: AVLNode | null, key: number): AVLNode {
  if (!root) return { key, left: null, right: null, height: 0 };
  if (key < root.key) root.left  = insert(root.left,  key);
  else if (key > root.key) root.right = insert(root.right, key);
  // duplicate keys are ignored
  return rebalance(root);
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "AvlTree.java",
      code: `// Minimal AVL tree — insert with rebalancing.
// Each node tracks its own height; balance factor is derived on the fly.

class AvlNode {
    int key;
    AvlNode left, right;
    int height;

    AvlNode(int key) { this.key = key; }
}

class AvlTree {

    static int height(AvlNode n) {
        return n != null ? n.height : -1;   // null → height -1 by convention
    }

    static int bf(AvlNode n) {
        return height(n.left) - height(n.right);
    }

    static void updateHeight(AvlNode n) {
        n.height = 1 + Math.max(height(n.left), height(n.right));
    }

    // ── Rotations ────────────────────────────────────────────────────────────

    static AvlNode rotateRight(AvlNode y) {   // fixes LL imbalance
        AvlNode x = y.left;
        y.left = x.right;
        x.right = y;
        updateHeight(y);
        updateHeight(x);
        return x;                             // x is the new root
    }

    static AvlNode rotateLeft(AvlNode x) {    // fixes RR imbalance
        AvlNode y = x.right;
        x.right = y.left;
        y.left = x;
        updateHeight(x);
        updateHeight(y);
        return y;
    }

    static AvlNode rebalance(AvlNode n) {
        updateHeight(n);
        int b = bf(n);

        if (b > 1) {                          // left-heavy
            if (bf(n.left) < 0)               // LR case: straighten first
                n.left = rotateLeft(n.left);
            return rotateRight(n);            // LL (or now-straightened LR)
        }
        if (b < -1) {                         // right-heavy
            if (bf(n.right) > 0)              // RL case: straighten first
                n.right = rotateRight(n.right);
            return rotateLeft(n);             // RR (or now-straightened RL)
        }
        return n;                             // already balanced
    }

    // ── Public API ────────────────────────────────────────────────────────────

    static AvlNode insert(AvlNode root, int key) {
        if (root == null) return new AvlNode(key);
        if (key < root.key) root.left = insert(root.left, key);
        else if (key > root.key) root.right = insert(root.right, key);
        // duplicate keys are ignored
        return rebalance(root);
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "avl_tree.py",
      code: `# Minimal AVL tree — insert with rebalancing.
# Each node tracks its own height; balance factor is derived on the fly.

from __future__ import annotations
from typing import Optional


class AvlNode:
    def __init__(self, key: int) -> None:
        self.key = key
        self.left: Optional[AvlNode] = None
        self.right: Optional[AvlNode] = None
        self.height = 0


def height(n: Optional[AvlNode]) -> int:
    return n.height if n else -1            # None → height -1 by convention


def bf(n: AvlNode) -> int:
    return height(n.left) - height(n.right)


def update_height(n: AvlNode) -> None:
    n.height = 1 + max(height(n.left), height(n.right))


# ── Rotations ──────────────────────────────────────────────────────────────────

def rotate_right(y: AvlNode) -> AvlNode:   # fixes LL imbalance
    x = y.left
    y.left = x.right
    x.right = y
    update_height(y)
    update_height(x)
    return x                               # x is the new root


def rotate_left(x: AvlNode) -> AvlNode:    # fixes RR imbalance
    y = x.right
    x.right = y.left
    y.left = x
    update_height(x)
    update_height(y)
    return y


def rebalance(n: AvlNode) -> AvlNode:
    update_height(n)
    b = bf(n)

    if b > 1:                              # left-heavy
        if bf(n.left) < 0:                 # LR case: straighten first
            n.left = rotate_left(n.left)
        return rotate_right(n)            # LL (or now-straightened LR)
    if b < -1:                            # right-heavy
        if bf(n.right) > 0:                # RL case: straighten first
            n.right = rotate_right(n.right)
        return rotate_left(n)            # RR (or now-straightened RL)
    return n                              # already balanced


# ── Public API ──────────────────────────────────────────────────────────────────

def insert(root: Optional[AvlNode], key: int) -> AvlNode:
    if root is None:
        return AvlNode(key)
    if key < root.key:
        root.left = insert(root.left, key)
    elif key > root.key:
        root.right = insert(root.right, key)
    # duplicate keys are ignored
    return rebalance(root)`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "avl_tree.cpp",
      code: `// Minimal AVL tree — insert with rebalancing.
// Each node tracks its own height; balance factor is derived on the fly.
#include <algorithm>

struct AvlNode {
    int key;
    AvlNode* left = nullptr;
    AvlNode* right = nullptr;
    int height = 0;

    explicit AvlNode(int k) : key(k) {}
};

int height(AvlNode* n) {
    return n ? n->height : -1;            // nullptr → height -1 by convention
}

int bf(AvlNode* n) {
    return height(n->left) - height(n->right);
}

void updateHeight(AvlNode* n) {
    n->height = 1 + std::max(height(n->left), height(n->right));
}

// ── Rotations ────────────────────────────────────────────────────────────────

AvlNode* rotateRight(AvlNode* y) {        // fixes LL imbalance
    AvlNode* x = y->left;
    y->left = x->right;
    x->right = y;
    updateHeight(y);
    updateHeight(x);
    return x;                             // x is the new root
}

AvlNode* rotateLeft(AvlNode* x) {         // fixes RR imbalance
    AvlNode* y = x->right;
    x->right = y->left;
    y->left = x;
    updateHeight(x);
    updateHeight(y);
    return y;
}

AvlNode* rebalance(AvlNode* n) {
    updateHeight(n);
    int b = bf(n);

    if (b > 1) {                          // left-heavy
        if (bf(n->left) < 0)              // LR case: straighten first
            n->left = rotateLeft(n->left);
        return rotateRight(n);            // LL (or now-straightened LR)
    }
    if (b < -1) {                         // right-heavy
        if (bf(n->right) > 0)             // RL case: straighten first
            n->right = rotateRight(n->right);
        return rotateLeft(n);             // RR (or now-straightened RL)
    }
    return n;                             // already balanced
}

// ── Public API ────────────────────────────────────────────────────────────────

AvlNode* insert(AvlNode* root, int key) {
    if (!root) return new AvlNode(key);
    if (key < root->key) root->left = insert(root->left, key);
    else if (key > root->key) root->right = insert(root->right, key);
    // duplicate keys are ignored
    return rebalance(root);
}`,
    },
  ],

  furtherReading: [
    {
      label:
        "Adelson-Velsky & Landis — *An algorithm for the organisation of information* (1962)",
      href: "https://en.wikipedia.org/wiki/AVL_tree#History",
      note: "The original 1962 paper (Doklady Akademii Nauk SSSR, vol. 146) that introduced the first self-balancing BST. The English translation by Myron J. Ricci appeared in *Soviet Mathematics – Doklady*, 3:1259–1263, 1962. Wikipedia's AVL tree article links the full bibliographic details.",
      kind: "paper",
    },
    {
      label: "Wikipedia — AVL tree",
      href: "https://en.wikipedia.org/wiki/AVL_tree",
      note: "Comprehensive reference covering the height bound proof, all four rotation cases with diagrams, deletion algorithm, and a comparison table against red-black trees.",
      kind: "article",
    },
    {
      label: "MIT OpenCourseWare — Introduction to Algorithms 6.006 (Spring 2020)",
      href: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
      note: "Lecture notes and problem sets from MIT's 6.006 course; AVL trees are covered in the balanced BSTs lecture with proofs of the height bound and rotation correctness.",
      kind: "docs",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms, 4th Edition* booksite",
      href: "https://algs4.cs.princeton.edu/home/",
      note: "The companion site for the definitive undergraduate algorithms text. Chapter 3 covers symbol-table implementations including balanced BSTs; Java source for red-black trees (close cousin to AVL) is freely downloadable.",
      kind: "book",
    },
    {
      label: "VisuAlgo — Binary Search Tree / AVL Tree",
      href: "https://visualgo.net/en/bst",
      note: "Step-through animations of AVL insert, delete, and all four rotation cases on an interactive canvas. Supports both manual input and random tree generation — a direct complement to the prototype here.",
      kind: "article",
    },
    {
      label: "GeeksforGeeks — Introduction to AVL Tree",
      href: "https://www.geeksforgeeks.org/introduction-to-avl-tree/",
      note: "Practical walkthrough of balance-factor computation, all four rotation cases with before/after diagrams, and annotated C++ / Java / Python / JavaScript implementations.",
      kind: "article",
    },
    {
      label: "David Galles — AVL Tree Visualization (USFCA)",
      href: "https://www.cs.usfca.edu/~galles/visualization/AVLtree.html",
      note: "Classic browser-based visualizer from the University of San Francisco. Shows pointer-level detail of each rotation step — useful for seeing exactly which child pointers move during an LL vs LR fix.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "avl-q1",
      question:
        "A node has a left subtree of height 3 and a right subtree of height 1. What is its balance factor, and does it violate the AVL invariant?",
      options: [
        {
          id: "a",
          label: "BF = −2; yes, AVL violation — the node must be rebalanced.",
        },
        {
          id: "b",
          label:
            "BF = +2; yes, AVL violation — the node must be rebalanced.",
        },
        {
          id: "c",
          label: "BF = +2; no violation — AVL allows any positive balance factor.",
        },
        {
          id: "d",
          label: "BF = +1; no violation — the subtrees differ by only one level.",
        },
      ],
      correctOptionId: "b",
      explanation:
        "Balance factor = height(left) − height(right) = 3 − 1 = +2. The AVL invariant requires BF ∈ {−1, 0, +1}, so +2 is a violation. Because the node is left-heavy (+2) and we need to check its left child's BF to determine whether this is an LL case (single right rotation) or an LR case (double rotation).",
    },
    {
      id: "avl-q2",
      question:
        "You insert 30, then 10, then 20 into an empty AVL tree. Which rotation sequence restores balance?",
      options: [
        {
          id: "a",
          label: "Single right rotation at node 30 (LL case).",
        },
        {
          id: "b",
          label: "Single left rotation at node 30 (RR case).",
        },
        {
          id: "c",
          label:
            "Left rotation at node 10, then right rotation at node 30 (LR double rotation).",
        },
        {
          id: "d",
          label:
            "Right rotation at node 10, then left rotation at node 30 (RL double rotation).",
        },
      ],
      correctOptionId: "c",
      explanation:
        "After inserting 30, 10, 20: node 30 has BF +2 (left-heavy), but its left child 10 has BF −1 (right-heavy). The imbalance is in the *right* subtree of the *left* child — the LR case. A single right rotation at 30 would not work because 10 and 20 lean opposite directions. The fix is: rotate left at 10 (making 20 the left child of 30, 10 the left child of 20), then rotate right at 30. Result: 20 is the root, 10 its left child, 30 its right child.",
    },
    {
      id: "avl-q3",
      question:
        "Why do AVL trees typically offer faster lookups than red-black trees, yet red-black trees are preferred in many standard library implementations?",
      options: [
        {
          id: "a",
          label:
            "AVL trees use O(1) memory per node; red-black trees use O(log n), making AVL faster for large datasets.",
        },
        {
          id: "b",
          label:
            "AVL trees have strictly tighter height bounds (≈1.44 log₂ n vs ≈2 log₂ n), so lookups touch fewer nodes — but AVL insert/delete trigger more rotations, making red-black trees faster for write-heavy workloads.",
        },
        {
          id: "c",
          label:
            "Red-black trees are always faster for both reads and writes; AVL trees are only used in academic settings.",
        },
        {
          id: "d",
          label:
            "AVL trees guarantee O(log n) only for search; insert and delete are O(n) in the worst case.",
        },
      ],
      correctOptionId: "b",
      explanation:
        "The AVL height bound is ≈1.44 log₂ n; a red-black tree can reach ≈2 log₂ n. Shallower tree = fewer comparisons per lookup, so AVL wins on reads. However, AVL delete can cascade O(log n) rotations up the tree; red-black trees bound insert and delete rotations at O(1) amortized. Standard library authors (Java `TreeMap`, Linux `rbtree`, C++ `std::map`) chose red-black trees because real-world code tends to mix reads and writes, and the write overhead of AVL trees adds up. For read-heavy applications — in-memory caches, interval trees — AVL is often the better pick.",
    },
  ],
};
