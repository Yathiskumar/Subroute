import type { ConceptContent } from "@/lib/content/types";

export const markCompact: ConceptContent = {
  prototypeCaption:
    "Mark & sweep leaves holes; mark-compact removes them. The heap is shown as a row of address slots. **Mark** traces live objects from the roots (green). **Compute & move** then slides every survivor toward address 0, assigning each a *forwarding address*. **Fixup** rewrites pointers to those new addresses. Step through and watch the live objects pack into a contiguous block at the bottom, leaving one clean run of free space at the top.",

  overview: [
    {
      type: "p",
      text: "Mark-compact starts exactly like mark & sweep — trace from the roots, mark everything reachable — but it replaces the sweep with something more ambitious: instead of freeing dead objects in place and leaving holes, it **slides the live objects together** into one contiguous block. When it's done, the heap is split cleanly into 'all live objects' at the bottom and 'all free space' at the top.",
    },
    {
      type: "p",
      text: "That single change eliminates fragmentation entirely. After compaction, allocation is trivial — just bump a pointer at the boundary, because there's exactly one contiguous free region. No free lists, no best-fit search, no holes that defeat large allocations.",
    },
    {
      type: "p",
      text: "The price is that moving objects means **every pointer to a moved object must be updated**. The collector assigns each survivor a new home (its *forwarding address*), then makes a pass over the roots and all live objects to rewrite references to point at the new locations.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Mark, then compute new addresses, move, and fix up" },
    {
      type: "ol",
      items: [
        "**Mark.** Trace from the roots and mark every reachable object, just like mark & sweep.",
        "**Compute forwarding addresses.** Walk the heap in address order. Track a 'free' cursor starting at address 0. For each *live* object, record its forwarding address = current cursor, then advance the cursor past it. Dead objects are skipped, so survivors get packed.",
        "**Update pointers (fixup).** Walk the roots and every live object's references, replacing each pointer with the forwarding address of the object it pointed at.",
        "**Move.** Copy each live object's bytes to its forwarding address. Survivors end up contiguous at the bottom; everything above the cursor is now free space.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why order is preserved (and why that's nice)",
      text: "This is the classic **Lisp2 / sliding** compactor: it walks in address order, so objects keep their relative order after moving — they just slide down to close the gaps. Preserving order tends to keep objects that were allocated together near each other, which is good for cache locality. (Other compactors, like two-finger, are faster but scramble the order.)",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The cost: multiple passes over the live set",
      text: "Sliding compaction makes several passes — compute addresses, fix up pointers, then move bytes. That's more work per cycle than mark & sweep's single sweep, and it's all stop-the-world in the basic form. The payoff is a perfectly compact heap with zero fragmentation and pointer-bump allocation afterward, so it shines when the heap is full of long-lived survivors.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Fragmentation is your enemy** — long-running servers whose heaps would otherwise degrade into Swiss cheese over days of uptime.",
        "**The live set is large and long-lived** — compaction's cost is proportional to survivors, so it's worth it when most objects survive (the opposite of where copying collectors win).",
        "**You want pointer-bump allocation** — a compact heap means allocation is just incrementing a cursor, the fastest possible path.",
        "**As the old-generation collector** — many generational GCs use copying for the young generation and mark-compact for the old, where survivors dominate and a spare half-heap would be wasteful.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**The JVM's old generation** is compacted by collectors like Parallel Old and (regionally) G1. **.NET's CLR** GC compacts its heap. **V8's old space** uses a mark-compact (Mark-Sweep-Compact) for major collections. The common thread: these are the spaces full of survivors, where avoiding fragmentation matters more than the cost of moving.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Zero fragmentation** — survivors end up contiguous; free space is one clean block.",
      "**Pointer-bump allocation afterward** — no free lists or fit search; just advance a cursor.",
      "**Uses the whole heap** — unlike copying collectors, it needs no reserved second semispace.",
      "**Preserves allocation order** (sliding compactors) — good for locality of co-allocated objects.",
    ],
    cons: [
      "**Multiple passes** — compute addresses, fix up pointers, move bytes; more work per cycle than a plain sweep.",
      "**Must update every pointer** — relocating objects means rewriting all references to them.",
      "**Stop-the-world in the basic form** — moving objects while the program runs requires careful concurrent machinery.",
      "**Cost scales with the live set** — wasteful when most objects are dead (use copying there instead).",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the holes close",
      body: "Step through to the end and compare the heap before and after. The live objects (green) start scattered with dead gaps between them; afterward they sit packed against address 0 with one unbroken run of free slots above. That's fragmentation eliminated in a single cycle.",
    },
    {
      title: "02 · Follow a forwarding address",
      body: "Pick one live object near the top of the heap. Note its original address, then watch the 'compute' phase assign it a new, lower forwarding address as the free cursor advances. The gap it jumps over is exactly the dead space being reclaimed.",
    },
    {
      title: "03 · Catch the pointer fixup",
      body: "Find an object that points to another live object. After the move, its pointer must aim at the target's *new* address, not the old one. Step through the fixup phase and confirm the arrow re-targets — a stale pointer here would be a dangling reference and a crash.",
    },
  ],

  code: {
    language: "typescript",
    filename: "mark-compact.ts",
    code: `// Sliding (Lisp2-style) mark-compact: mark, compute new addresses,
// fix up every pointer, then slide survivors down to close the gaps.
type Ref = number; // an index into the heap array

interface Cell {
  marked: boolean;
  forward: Ref;        // computed new address
  refs: Ref[];         // outgoing pointers (heap indices)
  live: boolean;       // occupied slot?
}

class MarkCompactHeap {
  heap: (Cell | null)[] = [];
  roots: Ref[] = [];

  collect(): void {
    this.mark();
    this.computeForwarding();
    this.updatePointers();
    this.moveObjects();
  }

  private mark(): void {
    const work = [...this.roots];
    while (work.length) {
      const i = work.pop()!;
      const c = this.heap[i];
      if (!c || c.marked) continue;
      c.marked = true;
      work.push(...c.refs);
    }
  }

  // Pass 1: assign each live object its packed destination address.
  private computeForwarding(): void {
    let free = 0;
    for (let i = 0; i < this.heap.length; i++) {
      const c = this.heap[i];
      if (c && c.marked) c.forward = free++;
    }
  }

  // Pass 2: rewrite roots and references to the forwarding addresses.
  private updatePointers(): void {
    this.roots = this.roots.map((r) => this.heap[r]!.forward);
    for (const c of this.heap) {
      if (c && c.marked) c.refs = c.refs.map((r) => this.heap[r]!.forward);
    }
  }

  // Pass 3: slide each survivor down to its forwarding address.
  private moveObjects(): void {
    const next: (Cell | null)[] = [];
    for (const c of this.heap) {
      if (c && c.marked) {
        c.marked = false;          // reset for next cycle
        next[c.forward] = c;       // move (slide) into place
      }
    }
    this.heap = next;              // everything above the live block is free
  }
}`,
  },

  furtherReading: [
    {
      label: "The Garbage Collection Handbook — Mark-Compact (Ch. 3)",
      href: "https://gchandbook.org/",
      note: "Jones, Hosking & Moss. Compares Lisp2 sliding, two-finger, and threaded compaction in depth.",
      kind: "book",
    },
    {
      label: "V8 — Trash talk: the Orinoco garbage collector",
      href: "https://v8.dev/blog/trash-talk",
      note: "V8's blog on its mark-sweep-compact major GC and how it was made incremental and concurrent.",
      kind: "article",
    },
    {
      label: "Oracle — HotSpot GC Tuning Guide: Generations",
      href: "https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/generations.html",
      note: "How the JVM lays out and compacts its old generation, the survivor-heavy space where compaction pays off.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "mc-q1",
      question:
        "How does mark-compact differ from mark & sweep?",
      options: [
        { id: "a", label: "It uses reference counts instead of tracing." },
        { id: "b", label: "Instead of freeing dead objects in place, it slides the live objects together into one contiguous block." },
        { id: "c", label: "It only marks; it never reclaims memory." },
        { id: "d", label: "It copies live objects into a separate reserved half-heap." },
      ],
      correctOptionId: "b",
      explanation:
        "Both mark identically. The difference is the second phase: sweep frees in place and leaves holes; compact relocates survivors to be contiguous, eliminating fragmentation. (Copying to a reserved half-heap is the *copying* collector, a different design.)",
    },
    {
      id: "mc-q2",
      question:
        "Why must mark-compact update pointers during collection?",
      options: [
        { id: "a", label: "To increment reference counts." },
        { id: "b", label: "Because moving an object changes its address, so every reference to it must be rewritten to the new (forwarding) address." },
        { id: "c", label: "To mark objects as reachable." },
        { id: "d", label: "It doesn't — pointers never change." },
      ],
      correctOptionId: "b",
      explanation:
        "Compaction relocates survivors. A pointer still holding the old address would now be dangling, so the collector records each survivor's forwarding address and fixes up every root and reference to use it.",
    },
    {
      id: "mc-q3",
      question:
        "When is mark-compact a better choice than a copying collector?",
      options: [
        { id: "a", label: "When most objects die quickly." },
        { id: "b", label: "When the live set is large and long-lived, so reserving a whole spare half-heap would be wasteful." },
        { id: "c", label: "When you cannot tolerate any pointer updates." },
        { id: "d", label: "When the heap is almost entirely garbage." },
      ],
      correctOptionId: "b",
      explanation:
        "Copying collectors need a reserved semispace and shine when few objects survive. Mark-compact uses the whole heap and pays in proportion to survivors, so it wins in survivor-heavy spaces like an old generation.",
    },
  ],
};
