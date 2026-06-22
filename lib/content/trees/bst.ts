import type { ConceptContent } from "@/lib/content/types";

export const bst: ConceptContent = {
  prototypeCaption:
    "A live Binary Search Tree you build yourself. Type a number and press **Insert** to add a node — the prototype animates every comparison as it walks down from the root, then drops the node into place. **Search** highlights the same path in yellow; **Delete** handles all three cases including the two-children case (watch the in-order successor swap in). **Random** grows the tree with random integers; **Reset** clears it. The Speed slider controls how fast comparisons animate. Two demo sequences are pre-wired: **\"Insert 10→70 sorted (degenerates)\"** inserts 10, 20, 30, 40, 50, 60, 70 in order so you can watch the tree collapse into a right-leaning chain, and **\"Delete 30 (two children)\"** shows the in-order successor taking the deleted node's place. The stats panel tracks nodes, height, comparisons, and the running in-order list.",

  overview: [
    {
      type: "p",
      text: "**A Binary Search Tree organises keys so that every lookup, insertion, and deletion follows a single rule: smaller values go left, larger values go right.** At every node, every key in the left subtree is smaller than the node's key, and every key in the right subtree is larger. That invariant — the BST ordering property — is what makes the tree searchable: you never have to look at both children. One comparison tells you which half to discard.",
    },
    {
      type: "p",
      text: "The payoff is a structure that behaves like **binary search on an array, but stays dynamic**. An array supports O(log n) search but O(n) insert or delete because elements have to shift. A linked list supports O(1) insert but O(n) search because there's no structure to exploit. A BST threads the needle: O(log n) for all three operations on average, while still allowing arbitrary insertions and deletions without moving anything else. The price is that the O(log n) guarantee is probabilistic — it holds when the tree is *balanced*, but a worst-case insertion order (sorted input) degenerates the tree into a linked list.",
    },
    {
      type: "p",
      text: "BSTs are the conceptual core of a whole family of self-balancing trees — **AVL trees**, **red-black trees**, and B-trees — that exist for one reason: to restore the height guarantee the plain BST can lose. Every sorted-set and sorted-map in every standard library (C++ `std::map`, Java `TreeMap`, Rust `BTreeMap`) is a red-black tree under the hood. Understanding the plain BST is the prerequisite for understanding why balancing exists and what it costs.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Three operations, one invariant" },
    {
      type: "ol",
      items: [
        "**Search** — start at the root. If the target equals the current node, done. If smaller, recurse left; if larger, recurse right. Repeat until found or you fall off a `null` child (key absent).",
        "**Insert** — search as above but stop when you reach a `null` slot. Place the new node there. The path taken is exactly the comparison path, so the node ends up in the unique position that preserves the ordering invariant.",
        "**Delete (no children)** — the node is a leaf: just remove it. The invariant is trivially preserved.",
        "**Delete (one child)** — splice the node out: connect its parent directly to its one child. The subtree below still obeys the invariant, and the node is gone.",
        "**Delete (two children)** — find the *in-order successor*: the smallest key in the right subtree (go right once, then left as far as possible). Copy the successor's key into the current node, then delete the successor — which is guaranteed to have at most one child (it has no left child by definition), so this reduces to Case 2.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why the in-order successor works",
      text: "After a two-children delete, the replacement must be larger than everything in the left subtree and smaller than everything in the right subtree — exactly the ordering property the deleted node held. The in-order successor is the *smallest key in the right subtree*, so it's greater than every left-subtree key and less than every other right-subtree key. It's the only key in the whole tree that can legally sit in that spot.",
    },
    { type: "h", text: "Complexity" },
    {
      type: "ul",
      items: [
        "**Average case — O(log n)** for search, insert, and delete. The expected height of a BST built from n random keys is ~1.39 log₂ n.",
        "**Worst case — O(n)** when keys arrive in sorted (or reverse-sorted) order. Each new node attaches as a right (or left) child of the previous one, producing a chain of height n.",
        "**In-order traversal — O(n)**, visits every node exactly once and produces keys in ascending sorted order — a free sort as a side-effect of the structure.",
        "**Space — O(n)** for n nodes, plus O(h) call-stack depth during recursive operations (h = height).",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Height is everything",
      text: "All operation costs trace directly to tree height h, not n. On a balanced tree h ≈ log n, so operations are fast. On a degenerate tree h = n, and you've paid pointer overhead for the performance of a linked list. **This is the sole motivation for AVL trees and red-black trees**: they add a small constant overhead per operation to keep h = O(log n) unconditionally.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Dynamic sorted sets** — you need to insert, delete, and search keys, and the set changes at runtime. A sorted array is better for read-heavy workloads; a BST (or its self-balancing variant) is better when writes are frequent.",
        "**Order-statistic queries** — `rank(k)` (how many keys < k?), `select(i)` (the i-th smallest key), `floor(k)`, `ceil(k)`, `range(lo, hi)`. These are all O(h) on a BST and awkward or expensive on a hash table.",
        "**In-order iteration** — when you need to process elements in sorted order repeatedly without re-sorting, a BST gives you an O(n) in-order traversal anytime.",
        "**Teaching and prototyping** — the plain BST is the clearest exposition of the invariant before self-balancing complexity enters the picture.",
        "**Symbol tables with ordering** — compiler symbol tables, file-system directory trees, and database indexes over monotone keys all benefit from the BST shape.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You can't control insertion order** — if keys may arrive sorted, a plain BST degenerates. Reach for a **red-black tree** or **AVL tree** (already done for you in `std::map`, `TreeMap`, etc.).",
        "**You only need membership tests, no ordering** — a **hash set** gives O(1) average lookup with far less overhead. BSTs are overkill when sorted order is irrelevant.",
        "**Disk-bound data** — BST height scales as O(log₂ n) with a branching factor of 2. A **B-tree** with branching factor 100–1000 reduces disk I/O dramatically for database indexes.",
        "**Concurrent access** — BST rotations and pointer updates are hard to make thread-safe. Concurrent skip lists or lock-free hash maps are easier in practice.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**O(log n) average for search, insert, delete** — binary halving at every step means 20 comparisons cover a million-node tree.",
      "**In-order traversal is a free sort** — a single O(n) walk yields all keys in ascending order, no extra pass needed.",
      "**Order-statistic operations** — floor, ceiling, rank, select, and range queries are natural O(h) operations that hash tables cannot do at all.",
      "**Dynamic** — arbitrary inserts and deletes without shifting elements, unlike sorted arrays.",
      "**Conceptually simple** — one invariant (left < node < right) governs every operation. Easy to reason about correctness.",
    ],
    cons: [
      "**O(n) worst case** — sorted or nearly-sorted input produces a degenerate chain. Real workloads are rarely perfectly random.",
      "**No locality** — tree nodes scatter across the heap; pointer chasing is cache-unfriendly compared to arrays or B-trees.",
      "**Pointer overhead** — each node carries two child pointers and often a parent pointer, tripling the memory footprint vs. storing keys in a flat array.",
      "**Balancing is non-trivial** — fixing the worst case requires AVL or red-black rotations; implementing them correctly is notoriously error-prone.",
      "**Not thread-safe by default** — concurrent insert/delete requires careful locking or lock-free techniques; even read-only traversal is unsafe if a writer rotates the tree.",
    ],
  },

  handsOn: [
    {
      title: "01 · Insert a handful of nodes and watch the comparison path",
      body: "Type `50` and press **Insert**. The node drops straight to the root — zero comparisons. Now insert `30`: the prototype walks left from 50 (30 < 50) and places it. Insert `70`: it walks right (70 > 50). Insert `20`, `40`, `60`, `80` one at a time and watch how each comparison eliminates one half of the tree. The **comparisons** counter in the stats panel tells you exactly how deep the search went. A balanced tree of 7 nodes needs at most 3 comparisons — check that the counter never exceeds it.",
    },
    {
      title: "02 · Run \"Insert 10→70 sorted\" and witness degeneration",
      body: "Press **Reset**, then click **\"Insert 10→70 sorted (degenerates)\"**. Watch the tree grow as a right-leaning chain: 10 at the root, 20 attached to its right, 30 to 20's right, and so on. After all 7 inserts the height is 7 — the worst case for 7 nodes. Try **Search 70**: it takes 7 comparisons (one per level) instead of the 3 a balanced tree would need. This is why sorted-input insertion is the adversarial case and why every production ordered-map uses self-balancing.",
    },
    {
      title: "03 · Run \"Delete 30 (two children)\" and trace the successor",
      body: "Build a small tree with at least 10, 20, 30, 40, 50 inserted (or use **Random** to grow one that contains 30). Press **\"Delete 30 (two children)\"**. Node 30 has both a left child (20) and a right child (40). Watch the animation: the prototype walks *right from 30, then as far left as possible* — arriving at 40, the in-order successor. It copies 40's key up into the 30-slot, then removes the original 40 node (which has at most one child). The BST ordering invariant holds throughout: everything left of the old 30's position is still < 40, everything right is still > 40.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Try to maximise the **height** stat with the fewest nodes. Insert keys in *strictly decreasing* order (e.g. 100, 90, 80, 70, 60) and watch the tree lean left — a mirror of the sorted-ascending degeneration. Then press **Reset** and insert the same five keys in the order 60, 80, 70, 90, 100 — a permutation that produces a much shorter tree. Finally, search for a key that doesn't exist and watch the algorithm walk all the way to a `null` leaf before reporting *not found*. The **comparisons** counter shows exactly how much work a miss costs versus a hit.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "bst.ts",
      code: `// Minimal generic BST — insert, search, delete, in-order traversal.
// All operations are O(h) where h is the tree height.

interface BSTNode<T> {
  key: T;
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;
}

function insert<T>(root: BSTNode<T> | null, key: T): BSTNode<T> {
  if (root === null) return { key, left: null, right: null };
  if (key < root.key) root.left  = insert(root.left,  key);
  else if (key > root.key) root.right = insert(root.right, key);
  // key === root.key: duplicate — ignore (or handle as needed)
  return root;
}

function search<T>(root: BSTNode<T> | null, key: T): BSTNode<T> | null {
  if (root === null || root.key === key) return root;
  return key < root.key ? search(root.left, key) : search(root.right, key);
}

// Returns the node with the minimum key in a subtree.
function min<T>(node: BSTNode<T>): BSTNode<T> {
  return node.left === null ? node : min(node.left);
}

function remove<T>(root: BSTNode<T> | null, key: T): BSTNode<T> | null {
  if (root === null) return null;

  if (key < root.key) {
    root.left  = remove(root.left,  key);
  } else if (key > root.key) {
    root.right = remove(root.right, key);
  } else {
    // Found the node to delete.
    if (root.left  === null) return root.right; // Case 1 or 2 (no left child)
    if (root.right === null) return root.left;  // Case 2 (no right child)

    // Case 3: two children — replace with in-order successor.
    const successor = min(root.right);
    root.key   = successor.key;                 // overwrite key in place
    root.right = remove(root.right, successor.key); // delete successor
  }
  return root;
}

// In-order traversal — yields keys in ascending sorted order.
function inOrder<T>(root: BSTNode<T> | null, result: T[] = []): T[] {
  if (root === null) return result;
  inOrder(root.left, result);
  result.push(root.key);
  inOrder(root.right, result);
  return result;
}

// Example
let root: BSTNode<number> | null = null;
for (const k of [50, 30, 70, 20, 40, 60, 80]) root = insert(root, k);
console.log(inOrder(root));  // [20, 30, 40, 50, 60, 70, 80]
root = remove(root, 30);
console.log(inOrder(root));  // [20, 40, 50, 60, 70, 80]`,
    },
    {
      label: "Java",
      language: "java",
      filename: "BinarySearchTree.java",
      code: `// Minimal generic BST — insert, search, delete, in-order traversal.
// All operations are O(h) where h is the tree height.

import java.util.ArrayList;
import java.util.List;

class BstNode<T extends Comparable<T>> {
    T key;
    BstNode<T> left, right;

    BstNode(T key) { this.key = key; }
}

class BinarySearchTree {

    static <T extends Comparable<T>> BstNode<T> insert(BstNode<T> root, T key) {
        if (root == null) return new BstNode<>(key);
        int cmp = key.compareTo(root.key);
        if (cmp < 0) root.left = insert(root.left, key);
        else if (cmp > 0) root.right = insert(root.right, key);
        // cmp == 0: duplicate — ignore (or handle as needed)
        return root;
    }

    static <T extends Comparable<T>> BstNode<T> search(BstNode<T> root, T key) {
        if (root == null || root.key.compareTo(key) == 0) return root;
        return key.compareTo(root.key) < 0
                ? search(root.left, key)
                : search(root.right, key);
    }

    // Returns the node with the minimum key in a subtree.
    static <T extends Comparable<T>> BstNode<T> min(BstNode<T> node) {
        return node.left == null ? node : min(node.left);
    }

    static <T extends Comparable<T>> BstNode<T> remove(BstNode<T> root, T key) {
        if (root == null) return null;

        int cmp = key.compareTo(root.key);
        if (cmp < 0) {
            root.left = remove(root.left, key);
        } else if (cmp > 0) {
            root.right = remove(root.right, key);
        } else {
            // Found the node to delete.
            if (root.left == null) return root.right;  // Case 1 or 2 (no left child)
            if (root.right == null) return root.left;  // Case 2 (no right child)

            // Case 3: two children — replace with in-order successor.
            BstNode<T> successor = min(root.right);
            root.key = successor.key;                  // overwrite key in place
            root.right = remove(root.right, successor.key); // delete successor
        }
        return root;
    }

    // In-order traversal — yields keys in ascending sorted order.
    static <T extends Comparable<T>> List<T> inOrder(BstNode<T> root, List<T> result) {
        if (root == null) return result;
        inOrder(root.left, result);
        result.add(root.key);
        inOrder(root.right, result);
        return result;
    }

    // Example
    public static void main(String[] args) {
        BstNode<Integer> root = null;
        for (int k : new int[]{50, 30, 70, 20, 40, 60, 80})
            root = insert(root, k);
        System.out.println(inOrder(root, new ArrayList<>())); // [20, 30, 40, 50, 60, 70, 80]
        root = remove(root, 30);
        System.out.println(inOrder(root, new ArrayList<>())); // [20, 40, 50, 60, 70, 80]
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "bst.py",
      code: `# Minimal generic BST — insert, search, delete, in-order traversal.
# All operations are O(h) where h is the tree height.

from __future__ import annotations
from typing import Generic, List, Optional, TypeVar

T = TypeVar("T")


class BstNode(Generic[T]):
    def __init__(self, key: T) -> None:
        self.key = key
        self.left: Optional[BstNode[T]] = None
        self.right: Optional[BstNode[T]] = None


def insert(root: Optional[BstNode[T]], key: T) -> BstNode[T]:
    if root is None:
        return BstNode(key)
    if key < root.key:
        root.left = insert(root.left, key)
    elif key > root.key:
        root.right = insert(root.right, key)
    # key == root.key: duplicate — ignore (or handle as needed)
    return root


def search(root: Optional[BstNode[T]], key: T) -> Optional[BstNode[T]]:
    if root is None or root.key == key:
        return root
    return search(root.left, key) if key < root.key else search(root.right, key)


# Returns the node with the minimum key in a subtree.
def minimum(node: BstNode[T]) -> BstNode[T]:
    return node if node.left is None else minimum(node.left)


def remove(root: Optional[BstNode[T]], key: T) -> Optional[BstNode[T]]:
    if root is None:
        return None

    if key < root.key:
        root.left = remove(root.left, key)
    elif key > root.key:
        root.right = remove(root.right, key)
    else:
        # Found the node to delete.
        if root.left is None:
            return root.right   # Case 1 or 2 (no left child)
        if root.right is None:
            return root.left    # Case 2 (no right child)

        # Case 3: two children — replace with in-order successor.
        successor = minimum(root.right)
        root.key = successor.key                     # overwrite key in place
        root.right = remove(root.right, successor.key)  # delete successor
    return root


# In-order traversal — yields keys in ascending sorted order.
def in_order(root: Optional[BstNode[T]], result: Optional[List[T]] = None) -> List[T]:
    if result is None:
        result = []
    if root is None:
        return result
    in_order(root.left, result)
    result.append(root.key)
    in_order(root.right, result)
    return result


# Example
root: Optional[BstNode[int]] = None
for k in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, k)
print(in_order(root))  # [20, 30, 40, 50, 60, 70, 80]
root = remove(root, 30)
print(in_order(root))  # [20, 40, 50, 60, 70, 80]`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "bst.cpp",
      code: `// Minimal generic BST — insert, search, delete, in-order traversal.
// All operations are O(h) where h is the tree height.
#include <iostream>
#include <vector>

template <typename T>
struct BstNode {
    T key;
    BstNode* left = nullptr;
    BstNode* right = nullptr;

    explicit BstNode(const T& k) : key(k) {}
};

template <typename T>
BstNode<T>* insert(BstNode<T>* root, const T& key) {
    if (root == nullptr) return new BstNode<T>(key);
    if (key < root->key) root->left = insert(root->left, key);
    else if (key > root->key) root->right = insert(root->right, key);
    // key == root->key: duplicate — ignore (or handle as needed)
    return root;
}

template <typename T>
BstNode<T>* search(BstNode<T>* root, const T& key) {
    if (root == nullptr || root->key == key) return root;
    return key < root->key ? search(root->left, key) : search(root->right, key);
}

// Returns the node with the minimum key in a subtree.
template <typename T>
BstNode<T>* minNode(BstNode<T>* node) {
    return node->left == nullptr ? node : minNode(node->left);
}

template <typename T>
BstNode<T>* remove(BstNode<T>* root, const T& key) {
    if (root == nullptr) return nullptr;

    if (key < root->key) {
        root->left = remove(root->left, key);
    } else if (key > root->key) {
        root->right = remove(root->right, key);
    } else {
        // Found the node to delete.
        if (root->left == nullptr) {       // Case 1 or 2 (no left child)
            BstNode<T>* r = root->right;
            delete root;
            return r;
        }
        if (root->right == nullptr) {      // Case 2 (no right child)
            BstNode<T>* l = root->left;
            delete root;
            return l;
        }

        // Case 3: two children — replace with in-order successor.
        BstNode<T>* successor = minNode(root->right);
        root->key = successor->key;                      // overwrite key in place
        root->right = remove(root->right, successor->key); // delete successor
    }
    return root;
}

// In-order traversal — yields keys in ascending sorted order.
template <typename T>
void inOrder(BstNode<T>* root, std::vector<T>& result) {
    if (root == nullptr) return;
    inOrder(root->left, result);
    result.push_back(root->key);
    inOrder(root->right, result);
}

// Example
// BstNode<int>* root = nullptr;
// for (int k : {50, 30, 70, 20, 40, 60, 80}) root = insert(root, k);
// std::vector<int> out; inOrder(root, out);  // [20, 30, 40, 50, 60, 70, 80]
// root = remove(root, 30);                    // [20, 40, 50, 60, 70, 80]`,
    },
  ],

  furtherReading: [
    {
      label: "CLRS — *Introduction to Algorithms*, Chapter 12 (Binary Search Trees)",
      href: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      note: "The canonical textbook treatment: formal proofs of the BST ordering property, expected height of a randomly built BST (~1.39 log n), and full pseudocode for all three delete cases.",
      kind: "book",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms* 4th ed., Section 3.2 (BSTs)",
      href: "https://algs4.cs.princeton.edu/32bst/",
      note: "Java-based exposition with worked examples for floor, ceiling, rank, and select — the order-statistic extensions that make BSTs genuinely useful in practice. Free on the companion site.",
      kind: "book",
    },
    {
      label: "Wikipedia — Binary search tree",
      href: "https://en.wikipedia.org/wiki/Binary_search_tree",
      note: "Solid reference covering the full history, all three delete cases with diagrams, self-balancing variants, and expected-height analysis for randomly built trees.",
      kind: "article",
    },
    {
      label: "VisuAlgo — BST / AVL Tree visualisation",
      href: "https://visualgo.net/en/bst",
      note: "Step-through animations for search, insert, and delete on both plain BSTs and AVL trees — ideal for seeing how rotations restore balance after the plain BST degenerates.",
      kind: "article",
    },
    {
      label: "GeeksforGeeks — Binary Search Tree data structure",
      href: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
      note: "Comprehensive walkthroughs of every BST operation with diagrams and code in multiple languages, plus 40+ practice problems tiered by difficulty.",
      kind: "article",
    },
    {
      label: "University of San Francisco — BST Visualization (Galles)",
      href: "https://www.cs.usfca.edu/~galles/visualization/BST.html",
      note: "Browser-based visualiser that animates each comparison step during insert, search, and delete. Complements this prototype with a different visual style.",
      kind: "article",
    },
    {
      label: "Ben Pfaff — *An Introduction to Binary Search Trees and Balanced Trees* (GNU libavl)",
      href: "https://adtinfo.org/libavl.html/",
      note: "A free book-length treatment of BSTs, AVL trees, and red-black trees in C with literate-programming annotations — the deepest publicly available reference on balancing internals.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "bst-q1",
      question:
        "You insert the keys 1, 2, 3, 4, 5 into an empty BST in that order. What is the height of the resulting tree, and what is the time complexity of a search on it?",
      options: [
        { id: "a", label: "Height 3 (balanced), search is O(log n)." },
        { id: "b", label: "Height 5 (degenerate chain), search is O(n)." },
        { id: "c", label: "Height 5 (degenerate chain), search is O(log n) because the BST property still holds." },
        { id: "d", label: "Height 2 (complete binary tree), search is O(log n)." },
      ],
      correctOptionId: "b",
      explanation:
        "Inserting keys in sorted order gives every new node a single right-child attachment point. After 5 inserts the tree is a right-leaning chain of height 5. A search for key 5 requires 5 comparisons — one per level — so the cost is O(n), not O(log n). The BST ordering property still holds (it always does), but the height is what determines search cost, not the property itself. This worst-case behaviour is why self-balancing trees exist.",
    },
    {
      id: "bst-q2",
      question:
        "When deleting a node with two children from a BST, which replacement key preserves the BST ordering invariant?",
      options: [
        { id: "a", label: "Any key from the left subtree." },
        { id: "b", label: "The largest key in the left subtree (in-order predecessor)." },
        { id: "c", label: "The in-order successor: the smallest key in the right subtree." },
        { id: "d", label: "Both B and C are valid replacements." },
      ],
      correctOptionId: "d",
      explanation:
        "Both the in-order predecessor (largest key in the left subtree) and the in-order successor (smallest key in the right subtree) are valid replacements. Either one is strictly greater than every key in the left subtree and strictly less than every other key in the right subtree — the exact condition the deleted node satisfied. Most textbooks and implementations use the in-order successor because the resulting node has at most one child (no left child by definition), making the subsequent delete straightforward.",
    },
    {
      id: "bst-q3",
      question:
        "What does an in-order traversal of a BST produce, and why?",
      options: [
        { id: "a", label: "Keys in insertion order, because nodes are visited in creation sequence." },
        { id: "b", label: "Keys in descending order, because the right subtree is visited first." },
        { id: "c", label: "Keys in ascending sorted order, because the BST invariant guarantees left < node < right at every level." },
        { id: "d", label: "A random permutation, because tree height varies with insertion order." },
      ],
      correctOptionId: "c",
      explanation:
        "In-order traversal visits left subtree, then the node, then right subtree. The BST invariant guarantees that every key in the left subtree is smaller than the current node's key, and every key in the right subtree is larger. Applying this reasoning recursively means left-subtree keys come out first (smallest), then the node, then right-subtree keys (largest) — exactly ascending sorted order. This property makes BST in-order traversal a free O(n) sort as a side-effect of the structure.",
    },
  ],
};
