import type { ConceptContent } from "@/lib/content/types";

export const redBlack: ConceptContent = {
  prototypeCaption:
    "A live red-black tree that grows as you insert values. Type a number and press **Insert** to add a node — the fixup animation highlights the focus node in yellow and steps through recolors and rotations one by one. **Random** inserts a random integer; **Reset** clears the tree. Use the **Speed** slider to slow the animation to a crawl so you can trace each fixup case. The **Sequential insert 1→7** demo builds a worst-case ascending sequence and shows how the tree rebalances without the pathological skew you'd get from a plain BST. The **Recolor then rotate (50,30,70,20,40,10)** demo exercises both fixup branches — first a recolor-and-climb, then a triangle rotation, then a line rotation — so you see all three cases in one run. Stats in the corner track *nodes*, *height*, *recolors*, and *rotations* in real time.",

  overview: [
    {
      type: "p",
      text: "**A red-black tree is a binary search tree that paints every node red or black and enforces five invariants that together guarantee the tree can never be more than twice as tall as the shortest root-to-leaf path.** That height bound — ≤ 2·log₂(n+1) — means every search, insert, and delete costs O(log n) in the worst case, not just on average. Unlike a plain BST that degrades to a linked list on sorted input, a red-black tree will never do that.",
    },
    {
      type: "p",
      text: "The coloring scheme is the clever part. **Red edges (or equivalently, red nodes) represent 'free' links that don't count toward balance**; black edges are the ones that must balance perfectly across all root-to-NIL paths. The invariant that every such path has the *same number of black nodes* (the **black-height**) is what enforces balance. The rule that a red node's children must both be black prevents two reds from appearing in a row, which bounds how much extra height the red links can add. Taken together, the shortest possible path uses only black nodes (length = black-height), and the longest alternates red and black (length = 2 × black-height). The ratio is exactly 2.",
    },
    {
      type: "p",
      text: "Red-black trees sit at the center of systems programming. `std::map` and `std::set` in C++, `java.util.TreeMap` and `java.util.TreeSet` in Java, the Linux CFS process scheduler, epoll's event queue, and the kernel's virtual-memory area tracking all rely on red-black trees — specifically because red-black trees perform **at most two rotations per insert and three per delete**, which is fewer than AVL trees require under heavy write loads. The coloring trick trades a tiny amount of extra height for dramatically cheaper rebalancing.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The five invariants" },
    {
      type: "ol",
      items: [
        "**Every node is either red or black.** (Color is a single bit.)",
        "**The root is black.** (Prevents a degenerate case in fixup and keeps the black-height accounting clean.)",
        "**Every NIL leaf is black.** (Sentinel leaves are conceptually black, so path lengths include them.)",
        "**If a node is red, both its children are black.** (No two consecutive red nodes — this is the 'no double-red' rule.)",
        "**Every path from a given node down to any NIL descendant passes through the same number of black nodes.** (This is the **black-height** invariant — it's what enforces balance.)",
      ],
    },
    { type: "h", text: "Why the invariants bound height" },
    {
      type: "ul",
      items: [
        "Let `bh(x)` be the black-height of node x (number of black nodes on any path from x to a NIL, not counting x itself). Every subtree rooted at x contains at least 2^bh(x) − 1 internal nodes.",
        "Therefore `n ≥ 2^bh(root) − 1`, so `bh(root) ≤ log₂(n+1)`.",
        "The height h of the tree is at most 2·bh(root) (because the 'no double-red' rule means at most half of any root-to-leaf path's nodes can be red).",
        "Combining: `h ≤ 2·log₂(n+1)` — a **hard upper bound** on tree height, not an average-case claim.",
      ],
    },
    { type: "h", text: "Insert fixup: the three cases" },
    {
      type: "p",
      text: "Insert the new node as red (preserving black-height). If its parent is black, done — no invariant is violated. If the parent is also red, you have a *double-red* and must fix it. Let `z` be the newly inserted (or just-fixed) red node, `p` its red parent, `g` the black grandparent, and `u` the uncle (g's other child):",
    },
    {
      type: "ol",
      items: [
        "**Uncle is red → recolor and climb.** Flip `p` and `u` to black, flip `g` to red. Move the problem up: treat `g` as the new double-red node and repeat. This is a pure recolor — zero rotations.",
        "**Uncle is black and z is a 'triangle' (z and p are on opposite sides of g) → rotate to a line.** Rotate `p` in the direction toward `g`, turning the triangle into a line. Now apply case 3.",
        "**Uncle is black and z is a 'line' (z, p, g are all on the same side) → rotate grandparent + recolor.** Rotate `g` in the opposite direction (promoting `p`), then swap the colors of `p` and `g`. The double-red is resolved; no further propagation needed.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why ≤ 2 rotations per insert",
      text: "Case 1 (uncle red) propagates the fix upward but uses **zero rotations**. Cases 2 and 3 together use **one or two rotations** but immediately terminate — once you hit a black uncle, recoloring stops climbing. This is the key structural difference from AVL: AVL's double-rotation balancing can cascade up the tree, while red-black's rotation cases are always a local, bounded fix.",
    },
    { type: "h", text: "Delete fixup (overview)" },
    {
      type: "ul",
      items: [
        "Deletion is more complex — four cases instead of three — but the same bounding logic applies: **at most three rotations** for any delete.",
        "The deleted node's 'missing' black is pushed down into a double-black placeholder and resolved by recoloring or rotating with siblings.",
        "This prototype omits delete to keep the animation focused on the insert fixup cases; the Linux kernel's `rb_erase` implementation in `lib/rbtree.c` is the canonical reference.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Red-black vs AVL: when to reach for each",
      text: "AVL trees maintain a stricter height bound (difference in subtree heights ≤ 1) and are therefore shorter on average — making them faster for **read-heavy** workloads. Red-black trees rebalance with fewer rotations and are faster under **write-heavy** workloads, which is why operating-system schedulers and standard-library ordered maps default to them.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Where red-black trees excel" },
    {
      type: "ul",
      items: [
        "**Write-heavy ordered maps** — standard library `std::map`/`TreeMap` style containers where inserts and deletes are frequent; the low rotation count matters.",
        "**Real-time systems** — the worst-case O(log n) guarantee (not amortized) fits schedulers and interrupt handlers that can't tolerate spikes.",
        "**Operating system internals** — Linux CFS (process scheduling), epoll (I/O event tracking), and vm_area_struct (virtual memory layout) all use red-black trees for deterministic O(log n) updates on kernel paths.",
        "**Interval trees and augmented BSTs** — red-black structure is easy to augment with extra metadata (subtree max endpoint, size) without breaking the O(log n) guarantee.",
        "**Any 'ordered set with dynamic membership'** — if you need sorted iteration *and* cheap insert/delete, red-black is the textbook answer.",
      ],
    },
    { type: "h", text: "When to consider alternatives" },
    {
      type: "ul",
      items: [
        "**Read-heavy workloads with rare writes** — an **AVL tree** is shorter (stricter balance) and slightly faster for lookups. Use AVL if searches vastly outnumber inserts and deletes.",
        "**Range queries on disk** — **B-trees** (or B+ trees) have much higher branching factors and align with page sizes, making them dramatically faster when data doesn't fit in RAM.",
        "**Approximate membership** — a **Bloom filter** or **skip list** may be simpler and fast enough; reserve red-black for when you need exact, ordered access.",
        "**Concurrent access** — red-black trees require careful locking; **lock-free** skip lists are often simpler to reason about in multithreaded contexts.",
        "**Static data** — if you build once and only query, a **sorted array with binary search** beats every balanced BST on cache locality and constant factors.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Guaranteed O(log n) worst case** for search, insert, and delete — no degenerate cases, no amortized hand-waving.",
      "**Fewest rotations of any balanced BST** — at most 2 per insert, 3 per delete. This is why write-heavy systems (OS schedulers, ordered maps) prefer red-black over AVL.",
      "**Simple augmentation** — a single extra `color` bit per node; augmenting with size, max, or sum fields for interval trees or order-statistics trees is straightforward.",
      "**Universal availability** — every major standard library ships a red-black tree (`std::map`, `TreeMap`, Python's `sortedcontainers` under the hood); well-understood, battle-tested code.",
      "**Deterministic rebalancing** — fixup terminates in O(1) rotations (the rotation cases do not propagate); only the recolor case propagates, and it propagates without rotations.",
    ],
    cons: [
      "**More complex than AVL to implement correctly** — five invariants, three insert-fixup cases, four delete-fixup cases, and symmetric mirror cases for each. Getting it right from scratch takes care.",
      "**Slightly taller than AVL** — the weaker balance criterion means red-black trees can be up to 2× taller than AVL trees, so lookups have a larger constant factor.",
      "**Extra memory per node** — one color bit (usually padded to a full byte or stored in a pointer's low bit as Linux does). Minor, but non-zero.",
      "**No efficient split/merge** — unlike treaps or weight-balanced trees, splitting or merging two red-black trees at a key is non-trivial and O(log n) rather than O(1).",
      "**Harder to reason about correctness** — the invariants interact subtly; it's easy to write fixup code that passes unit tests but breaks a corner case (e.g., inserting into an all-red path).",
    ],
  },

  handsOn: [
    {
      title: "01 · Sequential insert 1→7 — watch the tree rebalance",
      body: "Press the **Sequential insert 1→7** demo button. A plain BST fed the values 1, 2, 3, 4, 5, 6, 7 in order degrades to a right-leaning chain — O(n) height. Watch what the red-black fixup does instead: after inserting 1 and 2 (red), inserting 3 triggers a *line* rotation on the grandparent (case 3), promoting 2 to the root and recoloring. By the time all 7 nodes are in, the tree is balanced to height 3. Notice the *rotations* counter: you'll see exactly 3 rotations for 7 inserts, confirming the ≤ 2-per-insert bound holds in practice.",
    },
    {
      title: "02 · Recolor then rotate — trace all three fixup cases",
      body: "Press **Recolor then rotate (50,30,70,20,40,10)**. Insert 50 (root, forced black), 30 (red, left child — OK), 70 (red, right child — OK). Now insert 20: parent 30 is red, uncle 70 is *also* red → **case 1 recolor**: flip 30 and 70 to black, flip 50 to red, then re-blacken 50 (it's the root). Insert 40: parent 30 is black — no fixup. Insert 10: parent 20 is red, uncle 40 is black, 10 is a *left child of a left child* → **case 3 line rotation**: rotate 30 right, recolor. Watch the *recolors* and *rotations* counters increment at each step. Slow the speed slider to 1× to see every individual transition.",
    },
    {
      title: "03 · Insert your own sequence and verify black-height",
      body: "Type any integers into the input and press **Insert** one by one. After each insert, count the black nodes on any root-to-NIL path — they must all be equal. Try a sequence that forces a *triangle* fixup (case 2): insert 10, 30, 20. The value 20 is a right child of left child (a triangle); watch it trigger a left rotation on 30 first (case 2), then a right rotation on 10 (case 3). The *height* stat in the corner should never exceed `⌊2·log₂(n+1)⌋` regardless of what order you insert.",
    },
    {
      title: "04 · Free play — try to break the invariants",
      body: "Press **Random** repeatedly to load random values and watch how the tree stays balanced no matter what. Then try adversarial sequences: purely descending order (100, 90, 80, …) or alternating high-low (50, 1, 100, 2, 99, 3, …). Compare the *height* and *rotations* stats across sequences. Notice that descending order drives the most rotations (every other insert needs a line rotation) while the alternating sequence triggers more recolors. The black-height should remain consistent and height should stay well under 2·log₂(n+1) in every case — that bound is provable, not a coincidence.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "red-black-insert.ts",
      code: `type Color = "RED" | "BLACK";

interface RBNode {
  key: number;
  color: Color;
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;
}

function newNode(key: number): RBNode {
  return { key, color: "RED", left: null, right: null, parent: null };
}

function rotateLeft(tree: { root: RBNode | null }, x: RBNode): void {
  const y = x.right!;
  x.right = y.left;
  if (y.left) y.left.parent = x;
  y.parent = x.parent;
  if (!x.parent) tree.root = y;
  else if (x === x.parent.left) x.parent.left = y;
  else x.parent.right = y;
  y.left = x;
  x.parent = y;
}

function rotateRight(tree: { root: RBNode | null }, x: RBNode): void {
  const y = x.left!;
  x.left = y.right;
  if (y.right) y.right.parent = x;
  y.parent = x.parent;
  if (!x.parent) tree.root = y;
  else if (x === x.parent.right) x.parent.right = y;
  else x.parent.left = y;
  y.right = x;
  x.parent = y;
}

function insertFixup(tree: { root: RBNode | null }, z: RBNode): void {
  while (z.parent?.color === "RED") {
    const p = z.parent!;
    const g = p.parent!;
    if (p === g.left) {
      const uncle = g.right;
      if (uncle?.color === "RED") {          // Case 1: uncle red → recolor
        p.color = "BLACK";
        uncle.color = "BLACK";
        g.color = "RED";
        z = g;                               // climb up
      } else {
        if (z === p.right) {                 // Case 2: triangle → rotate to line
          z = p;
          rotateLeft(tree, z);
        }
        z.parent!.color = "BLACK";           // Case 3: line → rotate grandparent
        z.parent!.parent!.color = "RED";
        rotateRight(tree, z.parent!.parent!);
      }
    } else {                                 // Mirror: p is g.right
      const uncle = g.left;
      if (uncle?.color === "RED") {
        p.color = "BLACK"; uncle.color = "BLACK"; g.color = "RED"; z = g;
      } else {
        if (z === p.left) { z = p; rotateRight(tree, z); }
        z.parent!.color = "BLACK";
        z.parent!.parent!.color = "RED";
        rotateLeft(tree, z.parent!.parent!);
      }
    }
  }
  tree.root!.color = "BLACK";               // Invariant 2: root is always black
}

function insert(tree: { root: RBNode | null }, key: number): void {
  const z = newNode(key);
  let y: RBNode | null = null;
  let x = tree.root;
  while (x) { y = x; x = key < x.key ? x.left : x.right; }
  z.parent = y;
  if (!y) tree.root = z;
  else if (key < y.key) y.left = z;
  else y.right = z;
  insertFixup(tree, z);
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "RedBlackTree.java",
      code: `class RedBlackTree {
    enum Color { RED, BLACK }

    static class RBNode {
        int key;
        Color color = Color.RED;
        RBNode left, right, parent;

        RBNode(int key) { this.key = key; }
    }

    RBNode root;

    private void rotateLeft(RBNode x) {
        RBNode y = x.right;
        x.right = y.left;
        if (y.left != null) y.left.parent = x;
        y.parent = x.parent;
        if (x.parent == null) root = y;
        else if (x == x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x;
        x.parent = y;
    }

    private void rotateRight(RBNode x) {
        RBNode y = x.left;
        x.left = y.right;
        if (y.right != null) y.right.parent = x;
        y.parent = x.parent;
        if (x.parent == null) root = y;
        else if (x == x.parent.right) x.parent.right = y;
        else x.parent.left = y;
        y.right = x;
        x.parent = y;
    }

    private void insertFixup(RBNode z) {
        while (z.parent != null && z.parent.color == Color.RED) {
            RBNode p = z.parent;
            RBNode g = p.parent;
            if (p == g.left) {
                RBNode uncle = g.right;
                if (uncle != null && uncle.color == Color.RED) { // Case 1: uncle red → recolor
                    p.color = Color.BLACK;
                    uncle.color = Color.BLACK;
                    g.color = Color.RED;
                    z = g;                                        // climb up
                } else {
                    if (z == p.right) {                           // Case 2: triangle → rotate to line
                        z = p;
                        rotateLeft(z);
                    }
                    z.parent.color = Color.BLACK;                 // Case 3: line → rotate grandparent
                    z.parent.parent.color = Color.RED;
                    rotateRight(z.parent.parent);
                }
            } else {                                              // Mirror: p is g.right
                RBNode uncle = g.left;
                if (uncle != null && uncle.color == Color.RED) {
                    p.color = Color.BLACK; uncle.color = Color.BLACK; g.color = Color.RED; z = g;
                } else {
                    if (z == p.left) { z = p; rotateRight(z); }
                    z.parent.color = Color.BLACK;
                    z.parent.parent.color = Color.RED;
                    rotateLeft(z.parent.parent);
                }
            }
        }
        root.color = Color.BLACK;                                 // Invariant 2: root is always black
    }

    void insert(int key) {
        RBNode z = new RBNode(key);
        RBNode y = null;
        RBNode x = root;
        while (x != null) { y = x; x = key < x.key ? x.left : x.right; }
        z.parent = y;
        if (y == null) root = z;
        else if (key < y.key) y.left = z;
        else y.right = z;
        insertFixup(z);
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "red_black_tree.py",
      code: `from __future__ import annotations

RED, BLACK = "RED", "BLACK"


class RBNode:
    def __init__(self, key: int) -> None:
        self.key = key
        self.color = RED
        self.left: RBNode | None = None
        self.right: RBNode | None = None
        self.parent: RBNode | None = None


class RedBlackTree:
    def __init__(self) -> None:
        self.root: RBNode | None = None

    def _rotate_left(self, x: RBNode) -> None:
        y = x.right
        x.right = y.left
        if y.left:
            y.left.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x is x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y

    def _rotate_right(self, x: RBNode) -> None:
        y = x.left
        x.left = y.right
        if y.right:
            y.right.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x is x.parent.right:
            x.parent.right = y
        else:
            x.parent.left = y
        y.right = x
        x.parent = y

    def _insert_fixup(self, z: RBNode) -> None:
        while z.parent and z.parent.color == RED:
            p = z.parent
            g = p.parent
            if p is g.left:
                uncle = g.right
                if uncle and uncle.color == RED:        # Case 1: uncle red → recolor
                    p.color = BLACK
                    uncle.color = BLACK
                    g.color = RED
                    z = g                               # climb up
                else:
                    if z is p.right:                    # Case 2: triangle → rotate to line
                        z = p
                        self._rotate_left(z)
                    z.parent.color = BLACK              # Case 3: line → rotate grandparent
                    z.parent.parent.color = RED
                    self._rotate_right(z.parent.parent)
            else:                                       # Mirror: p is g.right
                uncle = g.left
                if uncle and uncle.color == RED:
                    p.color = BLACK
                    uncle.color = BLACK
                    g.color = RED
                    z = g
                else:
                    if z is p.left:
                        z = p
                        self._rotate_right(z)
                    z.parent.color = BLACK
                    z.parent.parent.color = RED
                    self._rotate_left(z.parent.parent)
        self.root.color = BLACK                         # Invariant 2: root is always black

    def insert(self, key: int) -> None:
        z = RBNode(key)
        y: RBNode | None = None
        x = self.root
        while x:
            y = x
            x = x.left if key < x.key else x.right
        z.parent = y
        if y is None:
            self.root = z
        elif key < y.key:
            y.left = z
        else:
            y.right = z
        self._insert_fixup(z)`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "red_black_tree.cpp",
      code: `enum class Color { RED, BLACK };

struct RBNode {
    int key;
    Color color = Color::RED;
    RBNode* left = nullptr;
    RBNode* right = nullptr;
    RBNode* parent = nullptr;
    explicit RBNode(int k) : key(k) {}
};

class RedBlackTree {
    RBNode* root = nullptr;

    void rotateLeft(RBNode* x) {
        RBNode* y = x->right;
        x->right = y->left;
        if (y->left) y->left->parent = x;
        y->parent = x->parent;
        if (!x->parent) root = y;
        else if (x == x->parent->left) x->parent->left = y;
        else x->parent->right = y;
        y->left = x;
        x->parent = y;
    }

    void rotateRight(RBNode* x) {
        RBNode* y = x->left;
        x->left = y->right;
        if (y->right) y->right->parent = x;
        y->parent = x->parent;
        if (!x->parent) root = y;
        else if (x == x->parent->right) x->parent->right = y;
        else x->parent->left = y;
        y->right = x;
        x->parent = y;
    }

    void insertFixup(RBNode* z) {
        while (z->parent && z->parent->color == Color::RED) {
            RBNode* p = z->parent;
            RBNode* g = p->parent;
            if (p == g->left) {
                RBNode* uncle = g->right;
                if (uncle && uncle->color == Color::RED) {   // Case 1: uncle red → recolor
                    p->color = Color::BLACK;
                    uncle->color = Color::BLACK;
                    g->color = Color::RED;
                    z = g;                                    // climb up
                } else {
                    if (z == p->right) {                      // Case 2: triangle → rotate to line
                        z = p;
                        rotateLeft(z);
                    }
                    z->parent->color = Color::BLACK;          // Case 3: line → rotate grandparent
                    z->parent->parent->color = Color::RED;
                    rotateRight(z->parent->parent);
                }
            } else {                                          // Mirror: p is g->right
                RBNode* uncle = g->left;
                if (uncle && uncle->color == Color::RED) {
                    p->color = Color::BLACK; uncle->color = Color::BLACK; g->color = Color::RED; z = g;
                } else {
                    if (z == p->left) { z = p; rotateRight(z); }
                    z->parent->color = Color::BLACK;
                    z->parent->parent->color = Color::RED;
                    rotateLeft(z->parent->parent);
                }
            }
        }
        root->color = Color::BLACK;                           // Invariant 2: root is always black
    }

public:
    void insert(int key) {
        RBNode* z = new RBNode(key);
        RBNode* y = nullptr;
        RBNode* x = root;
        while (x) { y = x; x = key < x->key ? x->left : x->right; }
        z->parent = y;
        if (!y) root = z;
        else if (key < y->key) y->left = z;
        else y->right = z;
        insertFixup(z);
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, Chapter 13: Red-Black Trees",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The definitive textbook treatment: formal proof of the height bound, complete insert-fixup with all six cases (three + mirrors), and the full delete-fixup. Chapter 13 of the 4th edition.",
      kind: "book",
    },
    {
      label: "Guibas & Sedgewick — *A Dichromatic Framework for Balanced Trees* (1978)",
      href: "https://dl.acm.org/doi/10.1145/800152.804906",
      note: "The original paper that introduced red-black trees under the name 'symmetric binary B-trees.' Four pages, surprisingly readable, and the source of the color metaphor.",
      kind: "paper",
    },
    {
      label: "Sedgewick — *Left-Leaning Red-Black Trees* (2008)",
      href: "https://sedgewick.io/wp-content/themes/sedgewick/papers/2008LLRB.pdf",
      note: "Sedgewick's 2008 simplification that restricts red links to left children only, cutting the case count roughly in half. The basis of the red-black BST in *Algorithms, 4th Edition*.",
      kind: "paper",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms, 4th Ed.*, §3.3 Balanced Search Trees",
      href: "https://algs4.cs.princeton.edu/33balanced/",
      note: "Hands-on companion to the textbook: Java code, animations, and exercises covering 2-3 trees, LLRB trees, and their equivalence. Free on the Algs4 site.",
      kind: "book",
    },
    {
      label: "Linux kernel — *Red-black Trees (rbtree) in the Linux Kernel*",
      href: "https://www.kernel.org/doc/html/latest/core-api/rbtree.html",
      note: "The official kernel docs explaining the rbtree API used in CFS scheduling, epoll, and vm_area management. Shows how the color bit is stored in the pointer's low bit to save memory.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Red–black tree",
      href: "https://en.wikipedia.org/wiki/Red%E2%80%93black_tree",
      note: "Comprehensive reference with pseudocode for all insert and delete cases, the equivalence to 2-3-4 trees, and a survey of practical applications in standard libraries and operating systems.",
      kind: "article",
    },
    {
      label: "VisuAlgo — Binary Search Tree / Balanced BST",
      href: "https://visualgo.net/en/bst",
      note: "Step-through animations of BST, AVL, and balanced BST operations — useful for seeing how AVL rotations compare to red-black fixup on the same insertions.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "rb-q1",
      question:
        "A red-black tree has black-height 3 (three black nodes on every root-to-NIL path). What is the maximum possible height of the tree?",
      options: [
        { id: "a", label: "3" },
        { id: "b", label: "5" },
        { id: "c", label: "6" },
        { id: "d", label: "7" },
      ],
      correctOptionId: "c",
      explanation:
        "The maximum height is 2 × black-height = 2 × 3 = 6. The shortest root-to-NIL path has 3 black nodes; the longest alternates black and red, giving 3 black + 3 red = 6 nodes total. The 'no double-red' invariant (rule 4) is exactly what prevents the red links from adding more than one level of extra height per black level.",
    },
    {
      id: "rb-q2",
      question:
        "During an insert fixup, the newly inserted node's uncle is red. What happens?",
      options: [
        {
          id: "a",
          label: "Rotate the grandparent and recolor — the fixup terminates.",
        },
        {
          id: "b",
          label:
            "Recolor the parent and uncle to black, the grandparent to red, then move the problem up to the grandparent.",
        },
        {
          id: "c",
          label: "Rotate the parent toward the grandparent to turn the triangle into a line.",
        },
        {
          id: "d",
          label: "Do nothing — a red uncle means no invariant is violated.",
        },
      ],
      correctOptionId: "b",
      explanation:
        "When the uncle is red (case 1), the fix is purely a recolor: flip the parent and uncle to black and the grandparent to red. This preserves the black-height on every path through the grandparent while eliminating the double-red between the node and its parent. The grandparent is then treated as a newly inserted red node and the fixup climbs up. Crucially, no rotations happen in this case — only recoloring.",
    },
    {
      id: "rb-q3",
      question:
        "Why do operating-system schedulers (like Linux CFS) prefer red-black trees over AVL trees?",
      options: [
        {
          id: "a",
          label: "AVL trees don't support deletion, so they can't handle process exit.",
        },
        {
          id: "b",
          label:
            "Red-black trees have a shorter height than AVL trees, making lookups faster.",
        },
        {
          id: "c",
          label:
            "Red-black trees require at most 2 rotations per insert and 3 per delete, keeping rebalancing cost bounded and low under heavy write loads.",
        },
        {
          id: "d",
          label: "Red-black trees are O(1) for insert while AVL trees are O(log n).",
        },
      ],
      correctOptionId: "c",
      explanation:
        "Schedulers insert and delete tasks constantly (every context switch is at least one delete + one insert). AVL trees are *shorter* on average (better for lookups) but require more rotations to maintain their stricter balance, which is expensive under write-heavy workloads. Red-black trees' hard cap of ≤ 2 rotations per insert and ≤ 3 per delete keeps rebalancing overhead tight and predictable — exactly what a real-time scheduler needs. AVL trees are the better choice in read-heavy scenarios where lookup speed dominates.",
    },
  ],
};
