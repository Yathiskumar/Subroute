import type { ConceptContent } from "@/lib/content/types";

export const markSweep: ConceptContent = {
  prototypeCaption:
    "A tracing collector in two phases. **Mark:** start at the roots and walk every pointer, painting each object you reach as live (green). **Sweep:** scan the whole heap and free anything still unmarked (red). Pick a scenario and step through. Scenario 2 shows a **cycle** collected with ease — reachability, not counting, is what matters. Scenario 3 shows a self-referential **island** that's still garbage because no root reaches it.",

  overview: [
    {
      type: "p",
      text: "Mark & sweep is the original *tracing* collector, and the mental model behind almost every modern GC. Instead of asking each object \"how many things point at you?\", it asks one global question: **starting from the roots, what can I actually reach?** Everything reachable is alive. Everything else is garbage, by definition.",
    },
    {
      type: "p",
      text: "It runs in two phases. **Mark** does a graph traversal from the roots — local variables, globals, registers — following every pointer and setting a `marked` bit on each object it visits. **Sweep** then walks the entire heap linearly and frees every object whose bit is still clear, resetting the bits on the survivors for next time.",
    },
    {
      type: "p",
      text: "Because it's built on reachability, it collects cycles for free: a cycle that no root can reach is simply never marked, so sweep reclaims it like any other garbage. That's the property reference counting could never give you.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Two phases, one reachability question" },
    {
      type: "ol",
      items: [
        "**Mark — seed the worklist with the roots.** Push every root-referenced object onto a worklist (or recursion stack).",
        "**Mark — drain the worklist.** Pop an object, set its `marked` bit, and push each object it points to that isn't already marked. Repeat until the worklist is empty. Every live object is now marked.",
        "**Sweep — scan the whole heap.** Walk linearly through every object. If `marked` is set, clear it (ready for the next cycle). If it's clear, the object is unreachable — free it.",
        "**Resume.** The marks are reset, the free list has reclaimed the dead, and the program continues.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "It's just a graph traversal",
      text: "Mark is breadth-first or depth-first search over the object graph, rooted at the GC roots. A cycle is a non-issue: the first time you reach an object in the cycle you mark it, and the `if not already marked` check stops you from looping forever. This is exactly why mark & sweep handles the cycles that defeat reference counting.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Two real costs: pauses and fragmentation",
      text: "Classic mark & sweep is **stop-the-world** — the program must freeze during marking, or it could rewire pointers out from under the collector. And sweep only frees objects *in place*; it never moves survivors. Over time the heap becomes a patchwork of live objects and reclaimed holes — **fragmentation** — which can starve a large allocation even when plenty of total memory is free. Mark-compact and copying collectors exist to fix exactly this.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**You need to collect cycles correctly** — anything reference counting alone can't handle.",
        "**You want a simple, well-understood baseline** — mark & sweep is the teaching default and the foundation most production collectors extend.",
        "**Object movement is undesirable or impossible** — because sweep leaves survivors in place, addresses are stable, which matters for code holding raw interior pointers (some C/C++ interop, conservative collectors).",
        "**Pauses are acceptable, or you'll later make it incremental/concurrent** — the basic algorithm pairs naturally with the tri-color techniques later in this track.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**Ruby's MRI** used a stop-the-world mark & sweep for years before adding incremental and generational improvements. **Boehm GC** — the drop-in conservative collector for C and C++ — is a mark & sweep. And the 'mark' half is the literal core of the JVM's CMS and G1, V8's old-space collector, and Go's collector; they all start from mark & sweep and add concurrency, compaction, and generations on top.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Collects cycles** — reachability ignores how objects point at each other.",
      "**No per-write overhead** — unlike reference counting, normal pointer assignments cost nothing; the work is batched into the GC cycle.",
      "**Survivors don't move** — addresses stay stable, simplifying interop with native code.",
      "**Conceptually simple** — a graph traversal plus a linear scan. Easy to reason about and to extend.",
    ],
    cons: [
      "**Stop-the-world pauses** — the basic algorithm freezes the program for the whole mark + sweep, and pause time scales with heap size.",
      "**Fragmentation** — frees in place, leaving holes that can defeat large allocations.",
      "**Sweep touches the whole heap** — even the dead, cold pages, hurting cache and paging behavior.",
      "**Work is proportional to heap size, not garbage** — you pay to walk live and dead alike.",
    ],
  },

  handsOn: [
    {
      title: "01 · Trace a clean heap",
      body: "Run scenario 1 (Basic trace) and step through the mark phase. Note which objects light up green as you follow pointers from the roots — and which never get touched. Predict the unmarked set before you reach sweep; those are exactly the ones that turn red.",
    },
    {
      title: "02 · Collect a cycle",
      body: "Run scenario 2 (Cycle wins). Two objects point at each other but no root reaches them. Step to the end and confirm both are swept. Compare this with the reference-counting prototype, where the identical cycle leaked forever.",
    },
    {
      title: "03 · Spot the floating island",
      body: "Run scenario 3 (Floating island). A little self-connected group of objects looks 'busy' — full of internal pointers — but no root can reach it. Watch mark skip the whole island, then sweep reclaim it. Internal connectivity never implies liveness; only root-reachability does.",
    },
  ],

  code: {
    language: "typescript",
    filename: "mark-sweep.ts",
    code: `// Mark & sweep: trace reachability from the roots, then free the rest.
class GcObject {
  marked = false;
  refs: GcObject[] = []; // outgoing pointers
}

class MarkSweepHeap {
  private heap: GcObject[] = [];      // every allocated object
  private roots: GcObject[] = [];     // locals, globals, registers

  collect(): void {
    this.mark();
    this.sweep();
  }

  /** Phase 1: paint everything reachable from the roots. */
  private mark(): void {
    const worklist = [...this.roots];     // BFS seed
    while (worklist.length) {
      const obj = worklist.pop()!;
      if (obj.marked) continue;           // already visited — breaks cycles
      obj.marked = true;
      for (const child of obj.refs) {
        if (!child.marked) worklist.push(child);
      }
    }
  }

  /** Phase 2: linear scan — free the unmarked, reset the survivors. */
  private sweep(): void {
    const survivors: GcObject[] = [];
    for (const obj of this.heap) {
      if (obj.marked) {
        obj.marked = false;               // reset for the next cycle
        survivors.push(obj);
      } else {
        // ...return obj's memory to the free list here (left in place).
      }
    }
    this.heap = survivors;
  }
}`,
  },

  furtherReading: [
    {
      label: "The Garbage Collection Handbook — Mark-Sweep (Ch. 2)",
      href: "https://gchandbook.org/",
      note: "Jones, Hosking & Moss. The canonical description, including the mark-bit table and lazy sweeping.",
      kind: "book",
    },
    {
      label: "Boehm-Demers-Weiser conservative GC",
      href: "https://hboehm.info/gc/",
      note: "A production mark & sweep you can drop into a C or C++ program. Great for seeing the algorithm in real code.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Tracing garbage collection",
      href: "https://en.wikipedia.org/wiki/Tracing_garbage_collection",
      note: "Covers the naive mark-and-sweep cycle, the mark bit, and tri-color refinements.",
      kind: "article",
    },
    {
      label: "Ruby — Incremental Garbage Collection in Ruby 2.2",
      href: "https://www.heroku.com/blog/incremental-gc/",
      note: "Koichi Sasada on how MRI's stop-the-world mark & sweep grew generational (2.1) and incremental (2.2) low-pause improvements.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "ms-q1",
      question:
        "What does the 'mark' phase actually do?",
      options: [
        { id: "a", label: "Counts how many references point at each object." },
        { id: "b", label: "Traverses the object graph from the roots, setting a bit on every reachable object." },
        { id: "c", label: "Moves all live objects to the start of the heap." },
        { id: "d", label: "Frees every object with a zero reference count." },
      ],
      correctOptionId: "b",
      explanation:
        "Mark is a graph traversal rooted at the GC roots. Each object it can reach gets its marked bit set. Anything left unmarked after the traversal is unreachable garbage.",
    },
    {
      id: "ms-q2",
      question:
        "Why does mark & sweep collect cycles that reference counting leaks?",
      options: [
        { id: "a", label: "It decrements reference counts more aggressively." },
        { id: "b", label: "Because it asks 'is this reachable from a root?', not 'how many things point at it?' — a cycle no root can reach is simply never marked." },
        { id: "c", label: "It detects cycles explicitly with a separate algorithm." },
        { id: "d", label: "It never actually collects cycles either." },
      ],
      correctOptionId: "b",
      explanation:
        "Reachability is the key. The objects in a cycle keep each other's counts up, but if no root can reach the cycle, the mark phase never visits it, so sweep frees the whole thing.",
    },
    {
      id: "ms-q3",
      question:
        "After many mark & sweep cycles, a program fails to allocate a large object even though total free memory is more than enough. Why?",
      options: [
        { id: "a", label: "The marked bits were never reset." },
        { id: "b", label: "Fragmentation — sweep frees objects in place, leaving the free space scattered in holes too small for the request." },
        { id: "c", label: "The roots were collected by mistake." },
        { id: "d", label: "Reference counts overflowed." },
      ],
      correctOptionId: "b",
      explanation:
        "Sweep never moves survivors, so reclaimed space is left as holes between live objects. The total may be large, but no single contiguous gap fits the allocation. Mark-compact and copying collectors solve this by relocating survivors.",
    },
  ],
};
