import type { ConceptContent } from "@/lib/content/types";

export const jumpHash: ConceptContent = {
  prototypeCaption:
    "A key doesn't sit on a ring here — a **formula** decides its bucket. The key 'jumps' forward through bucket numbers, each jump's size set by a pseudo-random number from the key, until a jump would overshoot N — then it stops at the last bucket it landed on. Click a key to trace it, hit **Play trace** to animate the arcs, and drag **N** to watch how few keys move when a bucket is added or removed.",

  overview: [
    {
      type: "p",
      text: "Jump Consistent Hash, from Google (Lamping & Veach, 2014), takes a different angle. There's no ring, no virtual nodes, no lookup table — in fact, **no stored state at all**. It's a tiny function: give it a key and a bucket count N, and it returns a bucket in the range [0, N-1]. The whole thing is about five lines of code.",
    },
    {
      type: "p",
      text: "The idea is to simulate, very cheaply, where a key would land as the number of buckets grows from 1 upward. Starting at bucket 0, the algorithm repeatedly decides whether the key should *jump* to a higher bucket. Each jump's distance is driven by a pseudo-random number seeded from the key. When the next jump would land at or past N, it stops — and the last bucket it sat on is the answer.",
    },
    {
      type: "p",
      text: "Because the jump sequence is fixed for a given key, growing N can only ever pull a key *forward* into a new higher bucket — and only with the right probability. That gives near-perfect balance and minimal movement, using zero memory. The catch: buckets must be numbered 0…N-1, and you can only cheaply add or remove the **last** one.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Jump forward until you'd overshoot" },
    {
      type: "ol",
      items: [
        "Start at bucket `b = -1` and candidate `j = 0`.",
        "Set `b = j` (accept the candidate), then draw the next pseudo-random number from the key.",
        "Compute the next candidate `j` — always a jump *forward*, and on average bigger jumps happen less often.",
        "If `j` is still below N, loop. As soon as `j ≥ N`, stop: the answer is the current `b`.",
      ],
    },
    {
      type: "p",
      text: "The number of jumps grows like O(log N), so even for huge N it finishes in a few dozen steps. The prototype draws each accepted jump as an arc and each rejected (overshooting) jump as a dashed arc that flies off the end — the last solid landing is the chosen bucket.",
    },
    { type: "h", text: "Why adding a bucket barely moves anything" },
    {
      type: "p",
      text: "Go from N to N+1 buckets and a key only moves if its jump sequence would have reached the new bucket N — which happens with probability exactly 1/(N+1). So about 1/(N+1) of all keys move into the new bucket, and **every other key stays put**. That's the theoretical minimum: it's exactly the fraction the new bucket *should* hold. Slide N in the prototype and the narration shows the moved count landing right near that expectation.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The big limitation: buckets are numbered, tail-only",
      text: "Jump hash returns a number 0…N-1, not a named node. You can cheaply grow to N+1 (add bucket N) or shrink to N-1 (remove the last bucket), but you can't remove an arbitrary bucket in the middle — doing so would renumber everything. That makes it ideal for sharded *storage* that scales at the tail, and a poor fit for a churny set of named cache servers.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Sharded data stores** where shards are numbered and you scale by adding shards at the end.",
        "**Memory- or cache-constrained lookups** — it needs literally zero storage, just the key and N.",
        "**You want the best possible balance** — its distribution is essentially perfectly even.",
        "**Stateless services** that can recompute the mapping anywhere from just (key, N), with no shared ring to distribute.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Storage, not web caching",
      text: "The paper itself notes the numbered-bucket constraint makes jump hash 'more suitable for data storage applications than for distributed web caching,' where servers come and go by name. Match the tool to that shape.",
    },
  ],

  tradeoffs: {
    pros: [
      "Zero memory — no ring, no table, no vnodes; just a ~5-line function.",
      "Near-perfect balance across buckets.",
      "Adding bucket N moves only ~1/(N+1) of keys — the theoretical minimum.",
      "O(log N) lookups; fast even for very large N.",
    ],
    cons: [
      "Buckets must be numbered 0…N-1 — it returns an index, not a named node.",
      "You can only cheaply add/remove the last bucket; arbitrary removal renumbers everything.",
      "No built-in weighting or replica selection (needs extra machinery).",
      "Poor fit for a fluctuating set of named servers (classic web-cache churn).",
    ],
  },

  handsOn: [
    {
      title: "01 · Trace one key's jumps",
      body: "Click a key chip inside any bucket, then press **Play trace**. The arcs animate the key jumping forward through bucket numbers; the dashed arc that flies past the end is the jump that overshot N, so the algorithm stops at the previous (green) bucket. The step list shows the math for each jump.",
    },
    {
      title: "02 · Add a bucket, count the movers",
      body: "Drag **N** up by one. Only the keys that jump into the brand-new last bucket move — the narration compares the actual moved count to the expected ~total/N. Everything already placed stays exactly where it was.",
    },
    {
      title: "03 · Watch the balance",
      body: "Hit **+5 keys** a few times and scan the per-bucket counts. With no ring and no tuning, the buckets stay strikingly even — that natural, near-perfect balance (with zero memory) is jump hash's headline feature.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "jump_hash.go",
      code: `// Jump Consistent Hash (Lamping & Veach, 2014).
// Returns a bucket in [0, numBuckets) using zero stored state.
package main

func jumpConsistentHash(key uint64, numBuckets int) int {
	var b int64 = -1
	var j int64 = 0
	for j < int64(numBuckets) {
		b = j
		// a 64-bit LCG step: the pseudo-random stream for this key
		key = key*2862933555777941757 + 1
		// next candidate jumps forward; bigger jumps are rarer
		r := float64((key >> 33) + 1)
		j = int64(float64(b+1) * (float64(int64(1)<<31) / r))
	}
	return int(b) // last bucket we landed on before overshooting
}

func main() {
	// Each key needs a 64-bit seed (hash the key once).
	jumpConsistentHash(0x123456789abcdef0, 6) // -> a bucket 0..5
	// Grow to 7 buckets: only ~1/7 of keys move, into the new bucket 6.
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "JumpHash.java",
      code: `// Jump Consistent Hash (Lamping & Veach, 2014).
// Returns a bucket in [0, numBuckets) using zero stored state.
class JumpHash {
    static int jumpConsistentHash(long key, int numBuckets) {
        long b = -1;
        long j = 0;
        while (j < numBuckets) {
            b = j;
            // a 64-bit LCG step: the pseudo-random stream for this key
            key = key * 2862933555777941757L + 1L;
            // next candidate jumps forward; bigger jumps are rarer
            // >>> is the unsigned shift, so the LCG stays in [0, 2^64).
            double r = (double) ((key >>> 33) + 1);
            j = (long) ((b + 1) * ((double) (1L << 31) / r));
        }
        return (int) b; // last bucket we landed on before overshooting
    }

    public static void main(String[] args) {
        // Each key needs a 64-bit seed (hash the key once).
        jumpConsistentHash(0x123456789abcdef0L, 6); // -> a bucket 0..5
        // Grow to 7 buckets: only ~1/7 of keys move, into the new bucket 6.
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "jump_hash.py",
      code: `# Jump Consistent Hash (Lamping & Veach, 2014).
# Returns a bucket in [0, num_buckets) using zero stored state.
import math

MASK64 = (1 << 64) - 1


def jump_consistent_hash(key: int, num_buckets: int) -> int:
    b, j = -1, 0
    while j < num_buckets:
        b = j
        # a 64-bit LCG step: the pseudo-random stream for this key
        key = (key * 2862933555777941757 + 1) & MASK64
        # next candidate jumps forward; bigger jumps are rarer
        r = (key >> 33) + 1
        j = math.floor((b + 1) * ((1 << 31) / r))
    return b  # last bucket we landed on before overshooting


# Each key needs a 64-bit seed (hash the key once).
jump_consistent_hash(0x123456789ABCDEF0, 6)  # -> a bucket 0..5
# Grow to 7 buckets: only ~1/7 of keys move, into the new bucket 6.`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "jump_hash.cpp",
      code: `// Jump Consistent Hash (Lamping & Veach, 2014).
// Returns a bucket in [0, numBuckets) using zero stored state.
#include <cstdint>

int jumpConsistentHash(uint64_t key, int numBuckets) {
    int64_t b = -1;
    int64_t j = 0;
    while (j < numBuckets) {
        b = j;
        // a 64-bit LCG step: the pseudo-random stream for this key
        key = key * 2862933555777941757ULL + 1;
        // next candidate jumps forward; bigger jumps are rarer
        double r = static_cast<double>((key >> 33) + 1);
        j = static_cast<int64_t>((b + 1) * (static_cast<double>(1LL << 31) / r));
    }
    return static_cast<int>(b); // last bucket we landed on before overshooting
}

// Usage:
// Each key needs a 64-bit seed (hash the key once).
// jumpConsistentHash(0x123456789abcdef0ULL, 6); // -> a bucket 0..5
// Grow to 7 buckets: only ~1/7 of keys move, into the new bucket 6.`,
    },
  ],

  furtherReading: [
    {
      label: "Lamping & Veach — A Fast, Minimal Memory, Consistent Hash Algorithm (2014)",
      href: "https://arxiv.org/abs/1406.2294",
      note: "The original Google paper. Five lines of code, the proof of even balance and minimal movement, and the numbered-bucket limitation in the authors' own words.",
      kind: "paper",
    },
    {
      label: "arXiv PDF — full text",
      href: "https://arxiv.org/pdf/1406.2294",
      note: "The complete paper PDF, including the reference C implementation worth reading line by line.",
      kind: "paper",
    },
    {
      label: "Erlend Hamberg — Jump Consistent Hash in Haskell and C++",
      href: "https://hamberg.no/erlend/posts/2015-03-20-jump-consistent-hash-in-haskell.html",
      note: "A clear walkthrough of the algorithm with runnable implementations — great for cementing how the loop works.",
      kind: "article",
    },
    {
      label: "go-jump-consistent-hash (reference implementation)",
      href: "https://github.com/lithammer/go-jump-consistent-hash",
      note: "A clean, well-documented Go library; useful to see how the seed is derived and how it's used in practice.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "jh-q1",
      question: "How much state does jump consistent hash store?",
      options: [
        { id: "a", label: "A sorted ring of server hashes" },
        { id: "b", label: "A lookup table of size M" },
        { id: "c", label: "None — it's a function of just the key and the bucket count N" },
        { id: "d", label: "One virtual-node list per server" },
      ],
      correctOptionId: "c",
      explanation:
        "Jump hash stores nothing. It's a ~5-line function that takes a key and N and returns a bucket in [0, N-1], which is why it's described as 'minimal memory.'",
    },
    {
      id: "jh-q2",
      question: "When you grow from N to N+1 buckets, roughly what fraction of keys move?",
      options: [
        { id: "a", label: "About half" },
        { id: "b", label: "About 1/(N+1) — only those that jump into the new last bucket" },
        { id: "c", label: "All of them" },
        { id: "d", label: "None" },
      ],
      correctOptionId: "b",
      explanation:
        "A key moves only if its jump sequence reaches the new bucket N, which happens with probability 1/(N+1). That's the theoretical minimum — exactly the share the new bucket should hold — and every other key stays put.",
    },
    {
      id: "jh-q3",
      question: "What is jump hash's main limitation?",
      options: [
        { id: "a", label: "It uses too much memory" },
        { id: "b", label: "Buckets must be numbered 0…N-1, and only the last one can be cheaply added or removed" },
        { id: "c", label: "Its distribution is very uneven" },
        { id: "d", label: "Lookups are O(N)" },
      ],
      correctOptionId: "b",
      explanation:
        "It returns a numeric index, not a named node, and removing an arbitrary middle bucket would renumber everything. That makes it great for tail-scaled, numbered shards and a poor fit for a churny set of named servers.",
    },
  ],
};
