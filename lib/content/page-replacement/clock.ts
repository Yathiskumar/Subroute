import type { ConceptContent } from "@/lib/content/types";

export const clock: ConceptContent = {
  prototypeCaption:
    "The same logic as Second Chance, but pages stay put in a **ring** and a **hand** does the scanning. A hit sets the page's reference bit to 1 (green). On a fault the purple hand sweeps clockwise: a slot with bit 1 gets its bit cleared and the hand advances; the first slot with bit 0 is evicted and the new page loaded there. Watch the hand rotate and clear bits as it hunts for a victim.",

  overview: [
    {
      type: "p",
      text: "Clock is **Second Chance made efficient**. It makes exactly the same eviction decisions, but instead of shuffling pages around a queue, it leaves them fixed in a circular buffer and moves a single pointer — the 'clock hand' — around the ring. No list surgery, just an advancing index.",
    },
    {
      type: "p",
      text: "Picture the frames arranged in a circle, like numbers on a clock face. Each frame has a reference bit. The hand points at the next candidate for eviction. When you need to evict, the hand sweeps clockwise: if the frame it's pointing at has its bit set, it clears the bit and moves on (that page got a second chance); if the bit is already clear, that's the victim. The hand stops one past the slot it just filled, ready for next time.",
    },
    {
      type: "p",
      text: "Because the data never moves, every operation is O(1) amortized and touches only a bit and a pointer. That efficiency is why Clock — not exact LRU, not Second Chance — is the algorithm real operating systems and database buffer pools actually run.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The rule, step by step" },
    {
      type: "ol",
      items: [
        "**Page already in a slot?** Hit. Set its reference bit to 1. The hand does not move.",
        "**Not in memory, an empty slot exists?** Place the page there with bit = 1 and advance the hand past it.",
        "**Not in memory, all slots full?** Sweep clockwise from the hand: if the current slot's bit is 1, clear it to 0 and advance; if it's 0, evict that page, load the new one there with bit = 1, and leave the hand one slot ahead.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why the hand can't spin forever",
      text: "Each step of the sweep either finds a 0 (and stops) or clears a 1 to 0. In the worst case — every bit set — the hand clears all of them in one full revolution and then evicts the slot it started on, now reading 0. So a sweep visits at most every slot once or twice; it always terminates, and worst-case behavior is plain FIFO. The prototype's **Full sweep** preset shows the hand going all the way around.",
    },
    {
      type: "p",
      text: "Clock's quality matches Second Chance's, and so it inherits the same limit: a single bit of history. Real kernels extend the idea — combining the reference bit with the **dirty (modified) bit** (see NRU), or using a counter instead of one bit (see Aging) — to make finer decisions. But the bare Clock is the foundation under all of them.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Where Clock is the right answer" },
    {
      type: "ul",
      items: [
        "**Operating system page replacement** — Clock and its variants are the standard. They get most of LRU's quality at FIFO-like cost.",
        "**Database buffer pools** — PostgreSQL's buffer manager uses a clock-sweep variant (with a small counter per buffer) to pick eviction victims.",
        "**Any cache where exact LRU is too expensive** — Clock is the go-to approximation when you can't afford a metadata update on every access.",
        "**When the MMU gives you an accessed bit** — Clock is designed precisely around the single reference bit that page-table hardware already maintains.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Clock in the wild",
      text: "**PostgreSQL** uses 'clock sweep' over its shared buffers, with a usage counter that the hand decrements instead of a single bit. Classic **Unix** systems used a two-handed clock (the 'page daemon') where a leading hand clears bits and a trailing hand evicts. The Linux page reclaim has evolved well beyond a basic clock into multiple LRU lists and, more recently, the Multi-Gen LRU — but the reference-bit-and-sweep heritage is still visible.",
    },
  ],

  tradeoffs: {
    pros: [
      "**O(1) amortized, no data movement** — just a bit flip and a pointer advance.",
      "**LRU-like quality** — same decisions as Second Chance, far better than FIFO.",
      "**Uses the MMU's accessed bit** — little or no extra metadata.",
      "**The real-world standard** — what operating systems and buffer pools actually ship.",
    ],
    cons: [
      "**Only one bit of history** — coarser than true LRU; can't tell heavily-used from barely-used.",
      "**Worst case is FIFO** — when every bit is set, the sweep clears them and evicts the oldest.",
      "**Needs extensions for nuance** — respecting dirty pages or finer recency requires NRU/Aging-style additions.",
      "**Sweep cost spikes occasionally** — a sweep that clears many bits before finding a victim does more work that one step.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the hand clear bits and evict",
      body: "Load the **Classic textbook** preset and step to a fault on a full ring. Follow the purple hand: each slot with a green '1' gets cleared to '0' as the hand passes (a second chance), until the hand lands on a '0' slot — that page is evicted and the new one loaded there. The hand ends one slot past the new page.",
    },
    {
      title: "02 · Protect a hot page",
      body: "Run the **Hot page protected** preset. The repeatedly-referenced page keeps getting its bit re-set to 1 on each hit, so whenever the hand reaches it, the bit is cleared but the page survives that pass — and gets re-set before the hand comes around again. It's never evicted, just like a hot page under LRU.",
    },
    {
      title: "03 · Confirm Clock = Second Chance",
      body: "Note Clock's total faults on the **Belady example** preset, then open the Second Chance prototype and run the identical string and frame count. The fault totals match exactly — proof they're the same algorithm. The only difference is that Clock moved a pointer where Second Chance moved pages.",
    },
  ],

  code: {
    language: "typescript",
    filename: "clock.ts",
    code: `// Clock: Second Chance with a fixed ring and a moving hand.
interface Slot { page: number; ref: 0 | 1; }

class Clock {
  private slots: (Slot | null)[];
  private hand = 0;
  faults = 0; hits = 0;

  constructor(frames: number) { this.slots = Array(frames).fill(null); }

  access(page: number): "hit" | "fault" {
    const hit = this.slots.find((s) => s?.page === page);
    if (hit) { hit.ref = 1; this.hits++; return "hit"; } // set bit, hand stays
    this.faults++;
    // sweep clockwise: clear set bits, evict the first cleared one
    while (this.slots[this.hand] && this.slots[this.hand]!.ref === 1) {
      this.slots[this.hand]!.ref = 0;          // second chance
      this.hand = (this.hand + 1) % this.slots.length;
    }
    this.slots[this.hand] = { page, ref: 1 };  // evict here (was null or ref 0)
    this.hand = (this.hand + 1) % this.slots.length;
    return "fault";
  }
}`,
  },

  furtherReading: [
    {
      label: "OSTEP — Beyond Physical Memory: Policies (Ch. 22, Clock)",
      href: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf",
      note: "Derives Clock as the efficient implementation of approximate LRU and benchmarks it against true LRU and Optimal.",
      kind: "book",
    },
    {
      label: "PostgreSQL source — freelist.c (clock-sweep buffer replacement)",
      href: "https://github.com/postgres/postgres/blob/master/src/backend/storage/buffer/freelist.c",
      note: "A production clock sweep: `StrategyGetBuffer` advances a hand and decrements a per-buffer usage count. Read the comments for the real-world design.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Page replacement algorithm: Clock",
      href: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#Clock",
      note: "States plainly why Clock is more efficient than Second Chance: pages don't get pushed around the list.",
      kind: "article",
    },
    {
      label: "Corbató — A Paging Experiment with the Multics System (1968)",
      href: "https://dspace.mit.edu/handle/1721.1/5536",
      note: "The early work introducing the clock (and not-recently-used) page replacement idea on Multics.",
      kind: "paper",
    },
    {
      label: "LWN — The Multi-Generational LRU",
      href: "https://lwn.net/Articles/851184/",
      note: "How Linux page reclaim evolved past a basic clock; useful context on where the reference-bit idea leads in a modern kernel.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "pr-clock-q1",
      question: "What does the clock hand do when it points at a slot whose reference bit is 1?",
      options: [
        { id: "a", label: "Evicts that page." },
        { id: "b", label: "Clears the bit to 0 and advances to the next slot." },
        { id: "c", label: "Sets the bit to 1 again and stops." },
        { id: "d", label: "Swaps that page with the new one." },
      ],
      correctOptionId: "b",
      explanation:
        "A set bit means the page was used recently, so it gets a second chance: the hand clears the bit and moves on. Only a slot already at 0 is evicted.",
    },
    {
      id: "pr-clock-q2",
      question: "How does Clock relate to Second Chance?",
      options: [
        { id: "a", label: "Clock makes smarter decisions using two bits." },
        { id: "b", label: "They make identical eviction decisions; Clock just uses a fixed ring and a moving hand instead of rotating a queue." },
        { id: "c", label: "Clock looks into the future like Optimal." },
        { id: "d", label: "Clock tracks exact recency like LRU." },
      ],
      correctOptionId: "b",
      explanation:
        "Clock and Second Chance are the same algorithm. Clock's advantage is purely implementation: O(1) pointer movement with no page shuffling, which is why it's the version real systems ship.",
    },
    {
      id: "pr-clock-q3",
      question: "Why is Clock guaranteed to terminate its sweep and not spin forever?",
      options: [
        { id: "a", label: "Because it only ever scans one slot per fault." },
        { id: "b", label: "Because each step either finds a 0 (and stops) or clears a 1 to 0, so after at most one full revolution a 0 exists." },
        { id: "c", label: "Because hits move the hand backward." },
        { id: "d", label: "Because empty slots stop the hand." },
      ],
      correctOptionId: "b",
      explanation:
        "Every slot the hand passes with bit 1 gets cleared to 0. In the worst case the whole ring is cleared in one revolution, and the hand then lands on a 0 — the original start slot — and evicts. The sweep always halts; worst case is FIFO.",
    },
  ],
};
