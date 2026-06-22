import type { ConceptContent } from "@/lib/content/types";

export const trie: ConceptContent = {
  prototypeCaption:
    "A live trie keyed on characters — each node is one letter, each edge one step deeper. Type a word and press **Insert** to watch it walk character by character, creating nodes only where the path doesn't already exist. **Search** highlights the walk and reports whether the path ends on a word-end node (ring) or just a prefix. **Autocomplete** finds every word below a prefix by collecting all word-end descendants. **Delete** retraces the path and removes dangling nodes bottom-up. Hit **\"Load: car, card, cat, dog, do, done\"** first to populate a working trie, then explore — word-end nodes glow with a ring, shared prefixes show as a single shared path.",

  overview: [
    {
      type: "p",
      text: "**A trie keys its nodes on characters rather than whole values.** Every path from the root to a node spells out a prefix; every path that ends on a marked node spells out a complete word. The depth of the tree is the length of the longest key — not the number of keys. That single fact is what makes tries feel alien at first and indispensable once you've used them: *the number of keys stored in a trie has no effect on how long a single lookup takes.*",
    },
    {
      type: "p",
      text: "The shared-prefix property is the other defining feature. Insert **car**, **card**, and **cat** and you get exactly one `c` node, one `a` node beneath it, one `r` node beneath that — then `d` branches off `r` for **card**, and `t` branches off `a` for **cat**. The common prefix `ca` is stored once, not three times. Every operation — insert, search, autocomplete — walks that shared skeleton, spending time only on the characters it hasn't already accounted for.",
    },
    {
      type: "p",
      text: "Tries are the data structure behind autocomplete, spell-checkers, T9 phone keyboards, IP routing tables, and any system that needs to ask 'give me everything that *starts with* this.' A hash map can tell you whether a key exists in O(1) expected time, but it cannot answer prefix queries at all — it has no notion of shared structure. A balanced BST can answer prefix queries but needs O(log N) comparisons, each touching the whole string. A trie answers both in **O(L)** — L being the key length — independent of how many keys you've stored.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Insert, search, and autocomplete" },
    {
      type: "ol",
      items: [
        "**Insert(word):** Start at the root. For each character in `word`, check whether the current node has a child for that character. If yes, follow it. If no, create a new node and follow it. After the last character, set a `isEnd = true` flag on the current node to mark that a complete word ends here.",
        "**Search(word):** Start at the root. Walk character by character exactly as in insert, but never create nodes — if any character is missing a child, return `false`. If you reach the end of the word, return `node.isEnd`. A path that exists but has `isEnd = false` means a *prefix* is stored, not the word itself.",
        "**StartsWith(prefix) / prefix-exists check:** Same walk as search, but don't check `isEnd` at the end — returning `true` just because the path exists is the right answer. This is the core of autocomplete.",
        "**Autocomplete(prefix):** Walk to the node that the prefix ends on (using StartsWith logic). Then do a DFS or BFS from that node, collecting every `isEnd = true` descendant. Each collected path, prepended by the prefix, is a valid completion.",
        "**Delete(word):** Walk to the `isEnd` node, clear the flag. Then on the way back up (via recursion or a stack), prune any node that is now a dead end — `isEnd = false` and no remaining children — to keep the trie compact.",
      ],
    },
    { type: "h", text: "The word-end flag versus prefix existence" },
    {
      type: "ul",
      items: [
        "**Searching for 'car' when only 'card' is stored returns `false`** — the path `c→a→r` exists, but the `r` node has `isEnd = false`. The flag is what distinguishes a *stored word* from a *shared prefix on the way to longer words*.",
        "**'StartsWith' intentionally ignores the flag** — it only asks whether the path exists at all, which is what autocomplete and IP routing need.",
        "Every node can simultaneously be a prefix node (pointing to children) and a word-end node (flagged). `do`, `dog`, and `done` all share `d→o`; `o` is flagged, then `g` is flagged, then `n→e` is flagged.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "O(L) independent of N",
      text: "Every operation touches exactly L nodes — one per character in the key — no matter how many keys the trie holds. Doubling the number of stored words adds nodes only where new paths branch off; it doesn't lengthen any existing path. This is the property that makes tries outperform hash maps on prefix queries and outperform BSTs on all string operations for large N.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The space cost: one node per character",
      text: "A naive R-way trie (where each node holds an array of R child pointers, R being the alphabet size) uses O(N × L × R) space in the worst case. For R = 26 and a moderate vocabulary, that's a lot of empty pointers. **Compressed (radix) tries** merge single-child chains into one node labelled by a substring, collapsing the space. **Ternary search tries** replace each node's child array with a three-way BST comparison, cutting R down to a constant 3 while preserving O(L log R) performance.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When a trie is the right tool" },
    {
      type: "ul",
      items: [
        "**Autocomplete and type-ahead search** — retrieving all keys that share a prefix is O(L + K) where K is the number of results. No other general structure matches this.",
        "**Spell-checking and edit-distance search** — you can walk the trie while tolerating a bounded number of mismatches, pruning entire subtrees the moment you've spent too many edits.",
        "**IP routing — longest-prefix match** — routers store CIDR prefixes in a binary trie keyed on bits. Finding the most specific matching route is a single O(32) or O(128) walk for IPv4/IPv6.",
        "**Dictionary with prefix queries** — if you need both exact lookup and 'list all words starting with X', a trie is the natural fit. A hash map handles the first but not the second.",
        "**Alphabetical ordering of keys** — an in-order traversal of a trie visits all stored words in lexicographic order, without any sort step.",
      ],
    },
    { type: "h", text: "When a hash map or BST is better" },
    {
      type: "ul",
      items: [
        "**Pure exact-match lookup with no prefix queries** — a hash map gives O(1) expected time with simpler code, no per-character node overhead, and better cache behaviour for short keys.",
        "**Small key sets or one-shot lookups** — the O(N × L) node overhead of a trie beats a hash map only once N is large enough; for small sets, a sorted array with binary search is often faster in practice.",
        "**Non-string keys** — tries are designed for sequence-like keys (strings, bit vectors, byte arrays). For integer or composite keys, a hash map or BST is more natural.",
        "**Memory is severely constrained** — even a compressed trie allocates one node per unique path segment. If memory matters more than prefix-query speed, a sorted array of strings is hard to beat.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**O(L) worst-case operations** — insert, search, startsWith, and delete all take time proportional to key length, regardless of how many keys are stored. No hash collision, no BST rebalancing.",
      "**Prefix queries are native** — autocomplete, prefix existence, and 'all words starting with X' are first-class operations, not hacks layered on top of a structure that doesn't understand prefixes.",
      "**Shared prefixes save space** — a vocabulary where 90% of words share a root stores those shared characters once. A hash map stores the full key string for every entry.",
      "**Lexicographic ordering for free** — in-order traversal yields keys in sorted order without a separate sort step, making range queries and alphabetical listing trivial.",
      "**Predictable worst-case time** — unlike hash maps, a trie has no adversarial inputs that degrade O(1) to O(N). Worst-case is always O(L), making tries attractive in latency-sensitive or security-critical paths.",
    ],
    cons: [
      "**High node count and pointer overhead** — a naive R-way trie stores R child pointers per node. For a 26-letter alphabet and a deep trie, most of those pointers are null. Memory usage can dwarf a hash map for sparse vocabularies.",
      "**Poor cache locality** — each character step follows a pointer to a different heap allocation. Long words generate many cache misses; a hash map or sorted array with binary search often wins on real hardware for short keys.",
      "**Complex implementation** — a correct, space-efficient trie (with deletion and compression) is meaningfully more code than a hash map. The delete operation is the trickiest part: pruning dead-end nodes bottom-up without breaking shared paths.",
      "**Only useful for sequence keys** — tries don't generalise to numeric, composite, or unordered keys the way hash maps and BSTs do.",
    ],
  },

  handsOn: [
    {
      title: "01 · Load sample words and see prefix sharing",
      body: "Press **\"Load: car, card, cat, dog, do, done\"** and watch six words insert one by one. After all six are in, inspect the tree: `c→a→r` is a single path shared by **car**, **card**, and **cat** — the `r` node is a word-end (ring) for *car* and also the parent of `d` for *card*. The `d→o` path is shared by **do**, **dog**, and **done**. Count the nodes: you have far fewer than 6 × avgLength because of prefix sharing. That's the trie's defining advantage.",
    },
    {
      title: "02 · Search a complete word vs. a prefix-only string",
      body: "After loading the sample, type **car** in the input and press **Search**. The walk highlights `c→a→r` and reports *found* because the `r` node has its word-end ring. Now type **ca** and press **Search** — the walk highlights `c→a` but reports *not found*, even though the path exists. The `a` node has no ring: `ca` is a prefix stored in the trie, not a word. This is the critical `isEnd` flag distinction: the path existing and the word being stored are two separate things.",
    },
    {
      title: "03 · Autocomplete a prefix",
      body: "Type **ca** and press **Autocomplete**. The prototype highlights the walk to the `a` node, then fans out below it via DFS, collecting every word-end descendant: **car** and **cat** (and **card**). Try **do** — you get **do**, **dog**, **done**. Try **d** — you get all four `d`-words. The query time is O(L + K) where L = prefix length and K = number of results; it's independent of how many *other* words are in the trie. This is the killer feature that makes tries the backbone of every autocomplete system.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Insert a word that shares no prefix with the sample set — try **zebra** — and watch a brand-new `z` subtree appear, isolated from the `c` and `d` clusters. Then insert **ze** and note the `z→e` path already exists but `e` gains a ring. Now **Delete** **ze** — the ring clears, but the nodes stay because `z→e` is still on the path to **zebra**. Finally delete **zebra** and watch the entire `z` subtree vanish, pruned bottom-up. Experiment with the speed slider to slow inserts down and trace each character step.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "trie.ts",
      code: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd = false;
}

class Trie {
  private root = new TrieNode();

  /** O(L) — walk one node per character, creating nodes as needed. */
  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  /** O(L) — walk the path; true only if the path exists AND ends on isEnd. */
  search(word: string): boolean {
    const node = this.walk(word);
    return node !== null && node.isEnd;
  }

  /** O(L) — true if any stored word starts with this prefix. */
  startsWith(prefix: string): boolean {
    return this.walk(prefix) !== null;
  }

  /** O(L + K) — all words that begin with prefix (K = number of results). */
  autocomplete(prefix: string): string[] {
    const node = this.walk(prefix);
    if (node === null) return [];
    const results: string[] = [];
    this.collect(node, prefix, results);
    return results;
  }

  /** O(L) — clear isEnd; prune dead-end nodes bottom-up via recursion. */
  delete(word: string): boolean {
    return this.deleteHelper(this.root, word, 0);
  }

  // ── private helpers ────────────────────────────────────────────────────

  private walk(key: string): TrieNode | null {
    let node = this.root;
    for (const ch of key) {
      if (!node.children.has(ch)) return null;
      node = node.children.get(ch)!;
    }
    return node;
  }

  private collect(node: TrieNode, prefix: string, out: string[]): void {
    if (node.isEnd) out.push(prefix);
    for (const [ch, child] of node.children) {
      this.collect(child, prefix + ch, out);
    }
  }

  private deleteHelper(node: TrieNode, word: string, depth: number): boolean {
    if (depth === word.length) {
      if (!node.isEnd) return false;   // word wasn't stored
      node.isEnd = false;
      return node.children.size === 0; // signal: prune me if I'm a leaf
    }
    const ch = word[depth];
    const child = node.children.get(ch);
    if (!child) return false;
    const shouldPrune = this.deleteHelper(child, word, depth + 1);
    if (shouldPrune) node.children.delete(ch);
    // Prune this node too if it's now empty and not a word-end
    return node.children.size === 0 && !node.isEnd;
  }
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Trie.java",
      code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}

class Trie {
    private final TrieNode root = new TrieNode();

    /** O(L) — walk one node per character, creating nodes as needed. */
    void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node = node.children.computeIfAbsent(ch, k -> new TrieNode());
        }
        node.isEnd = true;
    }

    /** O(L) — walk the path; true only if the path exists AND ends on isEnd. */
    boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.isEnd;
    }

    /** O(L) — true if any stored word starts with this prefix. */
    boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    /** O(L + K) — all words that begin with prefix (K = number of results). */
    List<String> autocomplete(String prefix) {
        TrieNode node = walk(prefix);
        List<String> results = new ArrayList<>();
        if (node == null) return results;
        collect(node, prefix, results);
        return results;
    }

    /** O(L) — clear isEnd; prune dead-end nodes bottom-up via recursion. */
    boolean delete(String word) {
        return deleteHelper(root, word, 0);
    }

    // ── private helpers ────────────────────────────────────────────────────

    private TrieNode walk(String key) {
        TrieNode node = root;
        for (char ch : key.toCharArray()) {
            node = node.children.get(ch);
            if (node == null) return null;
        }
        return node;
    }

    private void collect(TrieNode node, String prefix, List<String> out) {
        if (node.isEnd) out.add(prefix);
        for (Map.Entry<Character, TrieNode> e : node.children.entrySet()) {
            collect(e.getValue(), prefix + e.getKey(), out);
        }
    }

    private boolean deleteHelper(TrieNode node, String word, int depth) {
        if (depth == word.length()) {
            if (!node.isEnd) return false;       // word wasn't stored
            node.isEnd = false;
            return node.children.isEmpty();      // signal: prune me if I'm a leaf
        }
        char ch = word.charAt(depth);
        TrieNode child = node.children.get(ch);
        if (child == null) return false;
        boolean shouldPrune = deleteHelper(child, word, depth + 1);
        if (shouldPrune) node.children.remove(ch);
        // Prune this node too if it's now empty and not a word-end
        return node.children.isEmpty() && !node.isEnd;
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "trie.py",
      code: `from __future__ import annotations


class TrieNode:
    def __init__(self) -> None:
        self.children: dict[str, TrieNode] = {}
        self.is_end = False


class Trie:
    def __init__(self) -> None:
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """O(L) — walk one node per character, creating nodes as needed."""
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        """O(L) — walk the path; true only if the path exists AND ends on is_end."""
        node = self._walk(word)
        return node is not None and node.is_end

    def starts_with(self, prefix: str) -> bool:
        """O(L) — true if any stored word starts with this prefix."""
        return self._walk(prefix) is not None

    def autocomplete(self, prefix: str) -> list[str]:
        """O(L + K) — all words that begin with prefix (K = number of results)."""
        node = self._walk(prefix)
        if node is None:
            return []
        results: list[str] = []
        self._collect(node, prefix, results)
        return results

    def delete(self, word: str) -> bool:
        """O(L) — clear is_end; prune dead-end nodes bottom-up via recursion."""
        return self._delete_helper(self.root, word, 0)

    # ── private helpers ────────────────────────────────────────────────────

    def _walk(self, key: str) -> TrieNode | None:
        node = self.root
        for ch in key:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def _collect(self, node: TrieNode, prefix: str, out: list[str]) -> None:
        if node.is_end:
            out.append(prefix)
        for ch, child in node.children.items():
            self._collect(child, prefix + ch, out)

    def _delete_helper(self, node: TrieNode, word: str, depth: int) -> bool:
        if depth == len(word):
            if not node.is_end:           # word wasn't stored
                return False
            node.is_end = False
            return len(node.children) == 0  # signal: prune me if I'm a leaf
        ch = word[depth]
        child = node.children.get(ch)
        if child is None:
            return False
        should_prune = self._delete_helper(child, word, depth + 1)
        if should_prune:
            del node.children[ch]
        # Prune this node too if it's now empty and not a word-end
        return len(node.children) == 0 and not node.is_end`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "trie.cpp",
      code: `#include <string>
#include <unordered_map>
#include <vector>

struct TrieNode {
    std::unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
    TrieNode* root = new TrieNode();

public:
    // O(L) — walk one node per character, creating nodes as needed.
    void insert(const std::string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            if (!node->children.count(ch)) {
                node->children[ch] = new TrieNode();
            }
            node = node->children[ch];
        }
        node->isEnd = true;
    }

    // O(L) — walk the path; true only if the path exists AND ends on isEnd.
    bool search(const std::string& word) {
        TrieNode* node = walk(word);
        return node != nullptr && node->isEnd;
    }

    // O(L) — true if any stored word starts with this prefix.
    bool startsWith(const std::string& prefix) {
        return walk(prefix) != nullptr;
    }

    // O(L + K) — all words that begin with prefix (K = number of results).
    std::vector<std::string> autocomplete(const std::string& prefix) {
        std::vector<std::string> results;
        TrieNode* node = walk(prefix);
        if (node == nullptr) return results;
        collect(node, prefix, results);
        return results;
    }

    // O(L) — clear isEnd; prune dead-end nodes bottom-up via recursion.
    bool remove(const std::string& word) {
        return deleteHelper(root, word, 0);
    }

private:
    // ── private helpers ────────────────────────────────────────────────────

    TrieNode* walk(const std::string& key) {
        TrieNode* node = root;
        for (char ch : key) {
            auto it = node->children.find(ch);
            if (it == node->children.end()) return nullptr;
            node = it->second;
        }
        return node;
    }

    void collect(TrieNode* node, const std::string& prefix,
                 std::vector<std::string>& out) {
        if (node->isEnd) out.push_back(prefix);
        for (auto& [ch, child] : node->children) {
            collect(child, prefix + ch, out);
        }
    }

    bool deleteHelper(TrieNode* node, const std::string& word, size_t depth) {
        if (depth == word.size()) {
            if (!node->isEnd) return false;          // word wasn't stored
            node->isEnd = false;
            return node->children.empty();           // signal: prune me if I'm a leaf
        }
        char ch = word[depth];
        auto it = node->children.find(ch);
        if (it == node->children.end()) return false;
        bool shouldPrune = deleteHelper(it->second, word, depth + 1);
        if (shouldPrune) {
            delete it->second;
            node->children.erase(it);
        }
        // Prune this node too if it's now empty and not a word-end
        return node->children.empty() && !node->isEnd;
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Wikipedia — Trie",
      href: "https://en.wikipedia.org/wiki/Trie",
      note: "Comprehensive reference covering the etymology (Fredkin 1960, coined from 'retrieval'), R-way and compressed variants, complexity proofs, and a survey of applications from routers to genome databases.",
      kind: "article",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms* (4th ed.), §5.2 Tries",
      href: "https://algs4.cs.princeton.edu/52trie/",
      note: "The canonical textbook treatment. Covers R-way tries and ternary search tries side-by-side, with Java implementations, theoretical node-count bounds, and exercises on spell-checking, IP lookup, and T9.",
      kind: "book",
    },
    {
      label: "Wikipedia — Ternary Search Tree",
      href: "https://en.wikipedia.org/wiki/Ternary_search_tree",
      note: "Covers the Bentley-Sedgewick variant that replaces the R-child array with a three-way comparison, cutting memory from O(R) to O(1) per node while preserving O(L log R) performance. Good complement to the main trie article.",
      kind: "article",
    },
    {
      label: "GeeksforGeeks — Trie Data Structure",
      href: "https://www.geeksforgeeks.org/introduction-to-trie-data-structure-and-algorithm-tutorials/",
      note: "Worked insert/search/delete examples with diagrams and code in multiple languages. Good first stop for seeing the flag-based word-end logic spelled out step by step.",
      kind: "article",
    },
    {
      label: "cp-algorithms — Aho-Corasick algorithm",
      href: "https://cp-algorithms.com/string/aho_corasick.html",
      note: "Shows how to augment a trie with failure links to build a finite automaton that searches for multiple patterns simultaneously in O(n + m + z) time — the industrial extension of the basic trie idea.",
      kind: "article",
    },
    {
      label: "Sedgewick & Wayne — *Algorithms* (4th ed.), §5.2 — TrieST and TST Java source",
      href: "https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/TrieST.java.html",
      note: "Production-quality R-way trie implementation from the textbook authors, with get/put/keys/keysWithPrefix/keysThatMatch/longestPrefixOf. Useful as a reference for handling edge cases cleanly.",
      kind: "docs",
    },
    {
      label: "MIT OpenCourseWare — 6.006 Lecture: Tries",
      href: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/",
      note: "Lecture notes and problem sets from MIT's intro algorithms course, including the formal O(L) proof for trie operations and comparison with hashing for string keys.",
      kind: "video",
    },
  ],

  quiz: [
    {
      id: "trie-q1",
      question:
        "A trie stores 1 million English words. How many nodes does a search for the 8-character word 'absolute' visit?",
      options: [
        { id: "a", label: "~20 — O(log N) because the trie is balanced." },
        { id: "b", label: "8 — one node per character, independent of how many words are stored." },
        { id: "c", label: "~1 million — it must scan all words to rule out collisions." },
        { id: "d", label: "It depends on how many words share the prefix 'abso'." },
      ],
      correctOptionId: "b",
      explanation:
        "A trie walks exactly one node per character of the key. 'Absolute' has 8 characters, so the search visits at most 8 nodes — the root plus one per character. The number of stored words, the number of words sharing the prefix 'abso', and the depth of the trie all have zero effect on this count. That's the defining O(L) guarantee.",
    },
    {
      id: "trie-q2",
      question:
        "You insert the word 'car' into a trie that already contains 'card'. How many new nodes are created?",
      options: [
        { id: "a", label: "3 — one for each character in 'car'." },
        { id: "b", label: "0 — the path c→a→r already exists; only the isEnd flag on 'r' is set." },
        { id: "c", label: "1 — only the final 'r' node is new." },
        { id: "d", label: "4 — one for the root and one per character." },
      ],
      correctOptionId: "b",
      explanation:
        "Because 'card' is already stored, the path c→a→r→d exists, which means c, a, and r nodes are all already there. Inserting 'car' walks that existing path and simply sets `isEnd = true` on the existing `r` node. Zero new nodes. This is prefix sharing in action: the shared prefix costs nothing extra to store.",
    },
    {
      id: "trie-q3",
      question:
        "Why does a trie support prefix queries ('give me all words starting with X') while a hash map cannot?",
      options: [
        { id: "a", label: "Hash maps are slower than tries, so they run out of time before finishing a prefix scan." },
        { id: "b", label: "A trie physically groups words by their shared prefixes — walking to the prefix node lands you at the root of a subtree containing exactly the matching words. A hash map scatters keys uniformly, so there's no subtree to walk." },
        { id: "c", label: "Hash maps don't store strings, so they can't compare prefixes." },
        { id: "d", label: "A trie sorts its keys, so range queries are easy; a hash map is unsorted." },
      ],
      correctOptionId: "b",
      explanation:
        "A trie is structurally organised by prefix: all words sharing prefix 'ca' live in the subtree rooted at the node reached by walking c→a. A prefix query is just 'walk to that node, then collect all isEnd descendants.' A hash map applies a hash function that deliberately destroys any relationship between similar keys — 'cat' and 'car' land in completely different buckets with no shared structure to exploit. Prefix queries on a hash map require scanning every key, which is O(N × L).",
    },
  ],
};
