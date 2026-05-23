import type { ConceptContent } from "@/lib/content/types";

export const lirs: ConceptContent = {
  prototypeCaption:
    "Two structures: the **S stack** (left) holds recent access history with each key tagged **LIR** (always cached, blue), **HIR-r** (cached but probationary, amber), or **ghost** (key remembered, data evicted, dashed). The **Q list** (right) holds only the resident HIR — the next victim on a miss. LIR slots: 3, HIR-resident slot: 1.",

  overview: [
    {
      type: "p",
      text: "LIRS — **Low Inter-reference Recency Set** — was proposed by Song Jiang and Xiaodong Zhang in 2002 as a stronger answer to LRU's scan problem. Instead of measuring how recently a key was touched, it measures the **gap between consecutive touches**. Keys with small gaps are 'hot' (LIR); keys with large gaps are 'cold' (HIR). Only hot keys are protected from eviction.",
    },
    {
      type: "p",
      text: "It is widely considered the highest-hit-rate non-ML eviction policy in the literature. MySQL adopted a LIRS-inspired layout for some of its buffer pools, and Apache Cassandra and Apache Impala use LIRS or close variants. It's more complex than 2Q but consistently wins on workloads with weak locality.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The key insight: inter-reference recency (IRR)" },
    {
      type: "p",
      text: "When you access a key, look back to its previous access. The number of **distinct** other keys accessed in between is its IRR. Small IRR means 'used often within a short window' — hot. Large IRR means 'long gaps between uses' — cold.",
    },
    {
      type: "ul",
      items: [
        "**LIR** — keys with low IRR. The genuine working set. Always cached.",
        "**HIR** — keys with high IRR. Two flavors: **resident HIR** (cached, but on the chopping block) and **non-resident HIR** (only the key is remembered, like a ghost).",
      ],
    },
    {
      type: "p",
      text: "Two data structures hold this state:",
    },
    {
      type: "ul",
      items: [
        "**Stack S** — an LRU-ordered list containing all LIR keys plus **some** HIR keys (resident and non-resident). Used to determine when an HIR key should be promoted to LIR.",
        "**Queue Q** — a FIFO of just the resident HIR keys. Used to pick the next eviction victim cheaply.",
      ],
    },
    {
      type: "p",
      text: "The algorithm on access:",
    },
    {
      type: "ol",
      items: [
        "**Hit on a LIR key** — move to the top of S. (Standard LRU touch.)",
        "**Hit on a resident HIR key in S** — promote to LIR (you've now seen it within a short window). Move the bottom LIR key to HIR to make room.",
        "**Hit on a non-resident HIR key in S** — same as above: it just earned LIR status. Evict the head of Q to load it.",
        "**Miss on a key not in S** — load as resident HIR, push onto Q. Evict the head of Q if Q is full.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "LIR keys get unbounded protection — by design",
      text: "Once a key is in LIR, only another key with even smaller IRR can dislodge it. That's why LIRS is so robust against scans: a one-shot scan key has near-infinite IRR (it never gets accessed again), so it stays HIR and falls off Q quickly.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Weak-locality workloads** — DB buffer pools mixing OLTP with analytics, large-key-space caches where LRU consistently underperforms.",
        "**You've outgrown 2Q** — LIRS gives the next jump in hit rate at the cost of more complex state.",
        "**Long-running caches** where the IRR signal has time to stabilize.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "MySQL adopted a LIRS-inspired layout for InnoDB's adaptive hash index; Apache Cassandra uses LIRS for its row cache. Academic surveys consistently rank LIRS at or near the top of non-ML eviction policies on standard benchmark traces.",
    },
  ],

  tradeoffs: {
    pros: [
      "Excellent hit rate, especially on workloads where LRU does badly (scans, mixed locality).",
      "Strong scan resistance — scan keys never accumulate the low IRR needed to enter LIR.",
      "Self-tuning in spirit — LIR/HIR membership is determined by the workload, not by a tunable parameter.",
    ],
    cons: [
      "Considerably more complex than LRU or 2Q. Real implementations are tricky to get right.",
      "Higher memory overhead — the stack S can grow to hold non-resident HIR keys, which costs metadata.",
      "Eviction logic involves pruning the bottom of S; subtle bugs around 'stack pruning' have plagued real implementations.",
    ],
  },

  handsOn: [
    {
      title: "01 · Fill the LIR tier",
      body: "Click A, B, C. Each enters S tagged LIR (blue) — that's the protected working set, three slots strong. Now click D — it enters as HIR-resident (amber) and shows up in Q. The chopping block.",
    },
    {
      title: "02 · Promote with a short re-access",
      body: "After step 1, click D again. The status line says 'promote to LIR' — D's inter-reference gap was small, so it earns LIR status. The previously-bottom LIR is demoted to HIR-resident in its place.",
    },
    {
      title: "03 · Scan without polluting LIR",
      body: "Click **Reset**, then A, B, C (LIR set established). Now scan: D, E, F. They each enter as HIR-r, churn through Q, and never reach LIR — their IRRs are too large. A, B, C are untouched. That's LIRS's scan resistance.",
    },
  ],

  code: {
    language: "typescript",
    filename: "lirs.ts",
    code: `// Sketch only — full LIRS needs careful stack pruning.
// LIR keys + some HIR keys live in stack S (LRU order).
// Resident HIR keys also live in queue Q (FIFO).
type Status = "LIR" | "RESIDENT_HIR" | "NON_RESIDENT_HIR";

class LIRS<K, V> {
  private values = new Map<K, V>();          // only resident
  private status = new Map<K, Status>();
  private s: K[] = [];                        // LRU-ordered stack (head = MRU)
  private q: K[] = [];                        // FIFO of resident HIRs
  constructor(private lirCap: number, private hirCap: number) {}

  get(key: K): V | undefined {
    if (!this.values.has(key)) return undefined;
    const st = this.status.get(key);
    if (st === "LIR") {
      this.bumpInStack(key);
    } else if (st === "RESIDENT_HIR") {
      if (this.s.includes(key)) {
        // Promote: HIR -> LIR; demote bottom LIR -> HIR
        this.promoteToLIR(key);
      } else {
        this.bumpInStack(key);
      }
    }
    return this.values.get(key);
  }

  set(key: K, value: V): void {
    // ... see paper for full insert + stack pruning rules
    this.values.set(key, value);
  }

  private bumpInStack(_: K) { /* move key to top of s */ }
  private promoteToLIR(_: K) { /* LIR/HIR boundary management */ }
}`,
  },

  furtherReading: [
    {
      label: "Jiang & Zhang (2002) — LIRS: An Efficient Low Inter-reference Recency Set Replacement Policy",
      note: "The original SIGMETRICS paper. Read it before implementing.",
    },
    {
      label: "Apache Cassandra source — LIRS in the row cache",
      note: "Production-quality implementation worth studying.",
    },
    {
      label: "Comparison studies — LIRS vs ARC vs 2Q vs LRU",
      note: "Multiple academic surveys benchmark these together on standard traces (UMass, OLTP, web).",
    },
  ],

  quiz: [
    {
      id: "lirs-q1",
      question: "What does 'inter-reference recency' (IRR) measure for a given key?",
      options: [
        { id: "a", label: "How long ago the key was inserted into the cache." },
        { id: "b", label: "The number of distinct other keys accessed between two consecutive accesses of this key." },
        { id: "c", label: "The total number of times the key has been accessed." },
        { id: "d", label: "How recently the key was evicted." },
      ],
      correctOptionId: "b",
      explanation:
        "IRR is a workload property, not a cache property. A small IRR means the key was accessed again after seeing only a few other keys — it's part of the working set. A large IRR means long stretches between accesses — it's cold.",
    },
    {
      id: "lirs-q2",
      question:
        "Why is LIRS especially robust against scan workloads?",
      options: [
        { id: "a", label: "It detects scans heuristically." },
        { id: "b", label: "Scan keys never get re-accessed, so they always have infinite IRR and remain HIR — they can't displace the LIR working set." },
        { id: "c", label: "It uses a separate scan cache." },
        { id: "d", label: "It limits the rate of new insertions." },
      ],
      correctOptionId: "b",
      explanation:
        "LIR membership requires demonstrably low IRR — proof of repeated re-access within a short window. A one-shot scan key never reaches this threshold, so it can only live as resident HIR and falls off Q quickly.",
    },
    {
      id: "lirs-q3",
      question:
        "What is the role of the queue Q in LIRS?",
      options: [
        { id: "a", label: "It stores LIR keys." },
        { id: "b", label: "It is a FIFO of resident HIR keys, used to pick the next eviction victim in O(1)." },
        { id: "c", label: "It holds writes pending flush." },
        { id: "d", label: "It is a backup of the LRU stack." },
      ],
      correctOptionId: "b",
      explanation:
        "Without Q, finding the next HIR to evict would require scanning S. The queue is a thin index over the resident HIR portion of S, making eviction constant-time.",
    },
  ],
};
