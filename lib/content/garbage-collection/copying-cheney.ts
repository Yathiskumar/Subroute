import type { ConceptContent } from "@/lib/content/types";

export const copyingCheney: ConceptContent = {
  prototypeCaption:
    "The heap is split into two halves — **from-space** (active) and **to-space** (empty). Collection copies every live object from one half to the other, then swaps their roles. Cheney's trick: a single **scan** pointer chases an **alloc** pointer through to-space, turning the graph traversal into a tidy breadth-first sweep with no recursion stack. Step through and watch survivors stream across, leaving a left-behind **forwarding pointer** so shared references all redirect to the one copy.",

  overview: [
    {
      type: "p",
      text: "A copying collector divides the heap into two equal halves, called **semispaces**. At any moment the program allocates only into one of them — *from-space* — bumping a pointer forward. The other half, *to-space*, sits empty and waiting. When from-space fills up, collection begins.",
    },
    {
      type: "p",
      text: "Collection copies every *live* object out of from-space and into to-space, packing them tightly. Dead objects are simply never copied — they cost nothing to reclaim. When the copy finishes, the two roles swap: to-space becomes the new active space, and the old from-space is declared entirely empty in one stroke. There is no separate sweep and no fragmentation.",
    },
    {
      type: "p",
      text: "**Cheney's algorithm** (1970) is the elegant way to do the copy without a recursion stack. It uses two pointers in to-space — a *scan* pointer and an *alloc* (free) pointer — and the gap between them *is* the work queue. That turns the whole traversal into a single linear sweep.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Two pointers, one breadth-first sweep" },
    {
      type: "ol",
      items: [
        "**Copy the roots.** For each object a root points at, copy it to to-space at the `alloc` pointer, advance `alloc`, and leave a **forwarding pointer** in the old copy that says 'I've moved — here's where'. Repoint the root.",
        "**Scan.** Take the object at the `scan` pointer (the oldest copied-but-not-yet-processed object). For each reference it holds: if the target already has a forwarding pointer, just redirect to it; otherwise copy the target to `alloc`, advance `alloc`, and leave a forwarding pointer.",
        "**Advance scan.** Move `scan` past the object you just processed. The region between `scan` and `alloc` is the queue of objects copied but not yet scanned.",
        "**Repeat until scan catches alloc.** When `scan == alloc`, the queue is empty — every reachable object has been copied and every pointer fixed. Swap the semispaces.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "The forwarding pointer prevents double-copying",
      text: "Shared objects and cycles are handled by one trick: the first time you copy an object, you overwrite its old location with a forwarding pointer to its new address. Any later reference that reaches the same object sees the forwarding pointer and just redirects — so each live object is copied exactly once, and cycles terminate naturally.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Why the scan/alloc gap is the work queue",
      text: "Newly copied objects pile up at the `alloc` end. The `scan` pointer processes them in arrival order, and processing one may copy more, which extend the `alloc` end. That's a FIFO queue — hence breadth-first — implemented for free inside to-space itself, with zero auxiliary stack or recursion. This is the heart of Cheney's elegance.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Most objects die young** — collection cost is proportional to *survivors*, not heap size, so a sparse heap is collected almost for free.",
        "**You want the fastest possible allocation** — into a contiguous space, allocation is a single pointer bump and a bounds check.",
        "**Fragmentation must be impossible** — survivors are packed tightly on every copy, so the live region is always contiguous.",
        "**As a young-generation collector** — copying is the textbook choice for the nursery in a generational GC, where the weak generational hypothesis guarantees few survivors.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**The young generation** of nearly every generational collector is a copying collector — the JVM's eden/survivor spaces, V8's 'new space' (a semispace scavenger), and the .NET gen-0 heap all copy survivors out and reclaim the rest wholesale. The cost: you can only ever use half your heap for live data at once, which is why copying is reserved for the nursery, not the survivor-heavy old space.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Cost scales with live data, not heap size** — dead objects are never even visited.",
      "**Pointer-bump allocation** — allocating is incrementing a pointer in a contiguous space.",
      "**Zero fragmentation** — survivors are compacted automatically by the copy.",
      "**No recursion stack** — Cheney's scan/alloc gap is the work queue, so the traversal is iterative and bounded.",
    ],
    cons: [
      "**Half the heap is always idle** — you reserve a whole empty semispace to copy into.",
      "**Copying cost scales with survivors** — terrible for survivor-heavy heaps (use mark-compact there).",
      "**Every live object moves** — addresses change, so all pointers must be redirected (via forwarding pointers).",
      "**Poor cache behavior for large live sets** — copying lots of data thrashes the cache; fine when survivors are few.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch survivors stream across",
      body: "Step through and follow live objects copying from from-space into to-space, packing tightly at the alloc pointer. Notice the dead objects are never touched — they're reclaimed simply by abandoning from-space at the end. That's why copying cost depends only on survivors.",
    },
    {
      title: "02 · Catch a forwarding pointer in action",
      body: "Find an object that two others both point at. The first reference copies it and leaves a forwarding pointer behind. Step to the second reference and watch it hit that forwarding pointer and redirect — proof the object is copied exactly once, not twice.",
    },
    {
      title: "03 · See scan chase alloc",
      body: "Track the scan and alloc pointers. Each object scan processes can push more objects onto alloc, widening the gap; scan then works its way forward to close it. When scan finally catches alloc, the queue is empty and collection ends. That gap is the breadth-first queue, living inside to-space.",
    },
  ],

  code: {
    language: "typescript",
    filename: "cheney.ts",
    code: `// Cheney's copying collector: a breadth-first copy with no recursion stack.
// 'scan' and 'alloc' pointers walk to-space; the gap between them is the queue.
interface Obj {
  refs: Obj[];            // outgoing pointers (into from-space)
  forwarded: Obj | null;  // set once copied: points to the to-space copy
}

class CheneyCollector {
  toSpace: Obj[] = [];

  collect(roots: Obj[]): Obj[] {
    this.toSpace = [];
    let scan = 0;

    // 1. Evacuate the roots into to-space.
    const newRoots = roots.map((r) => this.copy(r));

    // 2. Scan: process each copied object; the gap to 'alloc'
    //    (toSpace.length) is the breadth-first work queue.
    while (scan < this.toSpace.length) {
      const obj = this.toSpace[scan++];
      obj.refs = obj.refs.map((child) => this.copy(child));
    }
    // scan === alloc → queue empty → from-space is now wholly garbage.
    return newRoots;
  }

  /** Copy once; thereafter follow the forwarding pointer. */
  private copy(obj: Obj): Obj {
    if (obj.forwarded) return obj.forwarded;   // already moved — redirect
    const copy: Obj = { refs: obj.refs, forwarded: null };
    this.toSpace.push(copy);                   // bump 'alloc'
    obj.forwarded = copy;                      // leave a forwarding pointer
    return copy;
  }
}`,
  },

  furtherReading: [
    {
      label: "C. J. Cheney — A nonrecursive list compacting algorithm (1970)",
      note: "The original two-page paper. Remarkably readable, and the source of the scan/alloc-pointer trick.",
    },
    {
      label: "The Garbage Collection Handbook — Copying (Ch. 4)",
      note: "Jones, Hosking & Moss. Semispaces, Cheney scanning, and how copying feeds into generational design.",
    },
    {
      label: "V8 — The Scavenger (new space collection)",
      note: "How V8's young-generation collector applies Cheney-style copying to short-lived objects.",
    },
  ],

  quiz: [
    {
      id: "cc-q1",
      question:
        "In a copying collector, how is dead memory reclaimed?",
      options: [
        { id: "a", label: "Each dead object is individually freed during a sweep." },
        { id: "b", label: "Live objects are copied to the other semispace; the entire from-space is then declared free at once." },
        { id: "c", label: "Dead objects' reference counts are decremented to zero." },
        { id: "d", label: "Dead objects are slid to the end of the heap." },
      ],
      correctOptionId: "b",
      explanation:
        "Copying never touches dead objects. It evacuates the survivors to to-space and abandons from-space wholesale, so reclamation cost is proportional to the live set, not the garbage.",
    },
    {
      id: "cc-q2",
      question:
        "What is the purpose of the forwarding pointer left in from-space?",
      options: [
        { id: "a", label: "To remember an object's reference count." },
        { id: "b", label: "So that any later reference to an already-copied object redirects to the single new copy instead of copying it again." },
        { id: "c", label: "To mark an object as garbage." },
        { id: "d", label: "To store the object's original allocation time." },
      ],
      correctOptionId: "b",
      explanation:
        "The first copy overwrites the old location with a forwarding pointer to the new address. Shared references and cycles then resolve to that one copy, guaranteeing each live object is copied exactly once.",
    },
    {
      id: "cc-q3",
      question:
        "In Cheney's algorithm, what does the region between the scan and alloc pointers represent?",
      options: [
        { id: "a", label: "The free space remaining in from-space." },
        { id: "b", label: "Fragmented holes that need compacting." },
        { id: "c", label: "The breadth-first work queue: objects copied but not yet scanned for their own references." },
        { id: "d", label: "The set of dead objects awaiting reclamation." },
      ],
      correctOptionId: "c",
      explanation:
        "Newly copied objects accumulate at alloc; scan processes them in order, and processing may copy more. That FIFO gap is the work queue, implemented inside to-space itself — which is why Cheney's copy needs no recursion stack.",
    },
  ],
};
