import type { ConceptContent } from "@/lib/content/types";

export const referenceCounting: ConceptContent = {
  prototypeCaption:
    "Every heap object carries a **reference count** — how many things point at it. Pick a scenario, then step through. Watch the count rise on each new pointer and fall on each `= null`. The instant a count hits **0** (red), the object is freed. Scenario 3 builds a **cycle**: two objects that point at each other never reach 0, so pure reference counting leaks them forever.",

  overview: [
    {
      type: "p",
      text: "Reference counting is the most direct answer to \"is this object still needed?\" **Give every object a counter of how many references point at it.** Add a reference, increment. Remove a reference, decrement. The moment the count drops to **zero**, nothing can reach the object — so free it immediately.",
    },
    {
      type: "p",
      text: "The appeal is that collection is *eager and local*. There's no separate \"GC pause\" that scans the whole heap — memory is reclaimed at the exact instant the last reference disappears, spread out across normal program execution. That predictability is why Swift (ARC), Objective-C, C++ `shared_ptr`, and CPython all lean on it.",
    },
    {
      type: "p",
      text: "It has one famous, fatal blind spot: **cycles**. Two objects that reference each other keep each other's count above zero even after the rest of the program has forgotten they exist. Pure reference counting can never free them.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The counter, maintained on every pointer write" },
    {
      type: "p",
      text: "Each object stores an integer `rc`, initialized to 1 when it's created and first assigned. Every assignment that copies or overwrites a reference adjusts counts:",
    },
    {
      type: "ol",
      items: [
        "**Create & assign** (`a = new Obj()`) — the object starts with `rc = 1`.",
        "**Copy a reference** (`b = a`) — increment the target's count. Now `rc = 2`.",
        "**Overwrite or clear** (`b = null`, or `b = somethingElse`) — decrement the *old* target's count. If it hits 0, free it.",
        "**Free an object** — before reclaiming it, decrement the count of everything *it* pointed at. That can trigger a **cascade**: freeing a list head frees the next node, which frees the next, and so on.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "The cycle problem",
      text: "Make object A point to B and B point back to A. Now drop every *external* reference to both. A's count is still 1 (B holds it) and B's count is still 1 (A holds it). Neither can ever reach zero, even though the whole pair is unreachable garbage. This is why every reference-counted runtime either forbids strong cycles (Swift's `weak`/`unowned`) or bolts on a tracing cycle-collector (CPython).",
    },
    {
      type: "callout",
      variant: "info",
      title: "The hidden cost: every pointer write",
      text: "Counts must be updated on *every* reference assignment, including ones that look free — passing an object to a function, returning it, storing it in an array. In multithreaded code each update must be atomic, and atomic increments are expensive. This per-write overhead is reference counting's quiet tax, and the reason high-throughput runtimes prefer tracing collectors.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**You want deterministic destruction** — files closed, locks released, sockets freed *exactly* when the last reference drops. RAII in C++ and `deinit` in Swift depend on this.",
        "**You can't tolerate GC pauses** — reclamation is spread across normal execution, with no stop-the-world phase (cascades aside).",
        "**Your object graph is naturally acyclic** — trees, DAGs, ownership hierarchies. No cycles means no leaks.",
        "**You can express weak edges** — use weak references for back-pointers (child → parent, observer → subject) so the cycle never forms.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**Swift's ARC** (Automatic Reference Counting) inserts retain/release calls at compile time and asks you to mark cycle-breaking edges `weak` or `unowned`. **CPython** reference-counts everything and runs a periodic generational cycle-detector to catch the leaks RC misses. **C++ `std::shared_ptr`** is reference counting you opt into per object, with `weak_ptr` as the cycle breaker.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Immediate reclamation** — memory is freed the instant the last reference drops, not at some later GC cycle.",
      "**Deterministic** — you can reason about exactly when an object dies, enabling RAII-style resource cleanup.",
      "**No stop-the-world pause** — work is incremental and spread across execution.",
      "**Locality** — only the objects involved in an assignment are touched, not the whole heap.",
    ],
    cons: [
      "**Cannot collect cycles** — the defining flaw; needs weak references or a backup tracing collector.",
      "**Per-write overhead** — every reference assignment costs a count update; atomic in multithreaded code, which is slow.",
      "**Cascade pauses** — freeing the head of a huge structure can free thousands of objects in one synchronous burst.",
      "**Extra memory per object** — a counter on every single object, plus the cache traffic of touching it constantly.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch a count climb and fall",
      body: "Run scenario 1 (Basic counting) and step through. Three variables point at one object, driving its count to 3, then each `= null` walks it back down. Predict the step where it frees — the count must read 0 before the object turns red.",
    },
    {
      title: "02 · Trigger a cascade",
      body: "Run scenario 2 (Cascade freeing). A list holds a node. Clear the single root and watch one decrement free the list, whose own teardown decrements the node to 0 — two frees from one assignment. This is where a reference-counting pause can sneak in.",
    },
    {
      title: "03 · Build a leak",
      body: "Run scenario 3 (Cycle leak). Two nodes point at each other, then both external roots are cleared. Step to the end: both counts sit at 1, nothing can reach them, and yet neither is freed. That stranded pair is the leak a tracing collector would have caught.",
    },
  ],

  code: {
    language: "typescript",
    filename: "reference-counting.ts",
    code: `// Reference counting: every object tracks how many references point at it.
// When the count hits zero, free it — and decrement everything it pointed to.
class RcObject {
  rc = 0;
  refs: RcObject[] = []; // outgoing references this object holds
}

class RefCountedHeap {
  /** Called whenever a new reference to \`obj\` is created (b = a). */
  retain(obj: RcObject): void {
    obj.rc++;
  }

  /** Called whenever a reference to \`obj\` is dropped (b = null). */
  release(obj: RcObject): void {
    if (--obj.rc === 0) {
      this.free(obj);
    }
  }

  /** Assign \`field = target\`, maintaining counts on both sides. */
  assign(holder: RcObject, field: number, target: RcObject | null): void {
    const old = holder.refs[field];
    if (target) this.retain(target);   // count the new edge first...
    if (old) this.release(old);        // ...then drop the old one (may free it)
    holder.refs[field] = target as RcObject;
  }

  private free(obj: RcObject): void {
    // Before reclaiming, drop the references this object held.
    // This is what makes freeing cascade through a structure.
    for (const child of obj.refs) {
      if (child) this.release(child);
    }
    obj.refs = [];
    // ...return obj's memory to the allocator here.
    // NOTE: a cycle (A.refs=[B], B.refs=[A]) never reaches this path —
    // both counts stay at 1 forever. That is the leak.
  }
}`,
  },

  furtherReading: [
    {
      label: "Swift — Automatic Reference Counting (ARC)",
      href: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/",
      note: "Apple's official guide, including strong/`weak`/`unowned` and how to break the cycles ARC can't collect on its own.",
      kind: "docs",
    },
    {
      label: "CPython — Garbage collector design",
      href: "https://devguide.python.org/garbage_collector/",
      note: "How CPython pairs per-object reference counting with a generational cycle-detector for the leaks RC misses.",
      kind: "docs",
    },
    {
      label: "Jones, Hosking & Moss — The Garbage Collection Handbook, Ch. 5",
      href: "https://gchandbook.org/",
      note: "The definitive treatment of reference counting, deferred counting, and cycle collection.",
      kind: "book",
    },
    {
      label: "Wikipedia — Reference counting",
      href: "https://en.wikipedia.org/wiki/Reference_counting",
      note: "A concise overview of the technique, its cycle problem, and the usual mitigations.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "rc-q1",
      question: "When does a reference-counted object get freed?",
      options: [
        { id: "a", label: "During a periodic stop-the-world scan of the heap." },
        { id: "b", label: "The instant its reference count drops to zero." },
        { id: "c", label: "When the program exits." },
        { id: "d", label: "When a tracing collector marks it unreachable." },
      ],
      correctOptionId: "b",
      explanation:
        "Reclamation is eager: the moment a decrement brings the count to 0, nothing can reach the object, so it's freed immediately — no separate GC phase required.",
    },
    {
      id: "rc-q2",
      question:
        "Two objects A and B reference each other, and every external reference to both is dropped. What happens under pure reference counting?",
      options: [
        { id: "a", label: "Both are freed immediately — the cycle is detected." },
        { id: "b", label: "Both leak: each keeps the other's count at 1, so neither reaches 0." },
        { id: "c", label: "A is freed but B leaks." },
        { id: "d", label: "The runtime throws a cycle-detected error." },
      ],
      correctOptionId: "b",
      explanation:
        "This is reference counting's defining flaw. A's count stays at 1 because B points to it, and vice versa. Neither hits zero, so the unreachable cycle is never reclaimed.",
    },
    {
      id: "rc-q3",
      question:
        "Why can freeing a single object cause a noticeable pause under reference counting?",
      options: [
        { id: "a", label: "Because freeing requires a full heap scan." },
        { id: "b", label: "Because the count update must be atomic." },
        { id: "c", label: "Because freeing one object decrements its children, which can cascade through a large structure synchronously." },
        { id: "d", label: "Because the memory must be zeroed before release." },
      ],
      correctOptionId: "c",
      explanation:
        "Freeing an object decrements every object it referenced. If that head sits atop a large list or tree, the whole structure can collapse in one synchronous burst — a reference-counting 'pause'.",
    },
  ],
};
