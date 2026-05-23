import type { ConceptContent } from "@/lib/content/types";

export const triColor: ConceptContent = {
  prototypeCaption:
    "Tri-color marking colors every object **white** (unvisited), **gray** (reachable, but its pointers haven't been followed yet), or **black** (reachable and fully scanned). Marking pulls objects off the **gray work queue** until it's empty; whatever stays white is garbage. Pick a scenario and step through. Scenario 2 shows how a program mutating pointers *during* marking can break the algorithm; Scenario 3 shows the **write barrier** that fixes it.",

  overview: [
    {
      type: "p",
      text: "Tri-color marking is a reformulation of mark & sweep that makes the marking phase *interruptible* — and that single property is what unlocks concurrent and incremental collection. Instead of one binary 'marked' bit, every object is one of three colors:",
    },
    {
      type: "ul",
      items: [
        "**White** — not yet reached. At the end of marking, white means garbage.",
        "**Gray** — reached and known to be alive, but its outgoing pointers haven't been scanned yet. The 'work to do' set.",
        "**Black** — reached *and* fully scanned; all its children are at least gray. Done.",
      ],
    },
    {
      type: "p",
      text: "Marking is just: move objects from white → gray → black. Start by graying the roots. Repeatedly take a gray object, gray each white object it points to, then blacken it. When no gray objects remain, the wavefront has swept the whole reachable graph — everything still white is unreachable and can be swept.",
    },
    {
      type: "p",
      text: "Why bother with three colors instead of one bit? Because the gray set is an explicit, resumable description of *exactly how far marking has gotten.* You can stop, let the program run, and pick up where you left off. A plain mark bit can't do that safely.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The invariant that makes it sound" },
    {
      type: "p",
      text: "The whole algorithm rests on one rule, the **strong tri-color invariant**: *no black object may point to a white object.* Intuitively: once you've declared an object fully scanned (black), you've promised the collector will never need to look at it again — so it had better not be the only thing keeping a white object alive. As long as the invariant holds, every reachable object eventually turns black.",
    },
    {
      type: "ol",
      items: [
        "**Initialize.** All objects white. Color the root-referenced objects gray and push them onto the gray queue.",
        "**Process a gray object.** Pop it. For each object it points to that is white, color it gray and enqueue it. Then color the popped object black.",
        "**Repeat** until the gray queue is empty.",
        "**Sweep.** Every object still white is unreachable — reclaim it. Reset colors for the next cycle.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Why this matters: the concurrent hazard",
      text: "If the collector runs *while the program (the 'mutator') keeps running*, the program can break the invariant. Picture a black object B and a white object D the collector hasn't reached. The program runs `B.next = D` — now a black object points to a white one. The collector, having already finished B, will never re-scan it; D stays white and gets swept. Later the program follows `B.next` into freed memory: **use-after-free.** This is the central problem every concurrent/incremental collector must solve.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Write barriers: insertion (Dijkstra) vs deletion (Yuasa)",
      text: "The fix is a **write barrier** — a few instructions the runtime runs on every pointer store. **Dijkstra's insertion barrier** catches the store above: when a black object gets a pointer to a white one, it grays the target (or the source), restoring the strong invariant. **Yuasa's deletion barrier** (snapshot-at-the-beginning / SATB) takes the opposite tack: when a pointer is *overwritten*, it grays the old target, preserving the set of objects that were live when marking began — this maintains the *weak* invariant. Real collectors pick one or combine them; **Go** uses a hybrid Dijkstra+Yuasa barrier that drops worst-case stop-the-world pauses below 50µs.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Where it shows up" },
    {
      type: "ul",
      items: [
        "**Any concurrent or incremental tracing collector** — tri-color is the foundation. The colors are precisely the state you need to pause and resume marking safely.",
        "**Low-latency runtimes** — Go, Java's G1 / ZGC / Shenandoah, and V8's concurrent marker all express their marking in tri-color terms.",
        "**When you must reason about correctness under mutation** — the strong/weak invariants give you a precise, checkable property to preserve.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**Go's** garbage collector is a tri-color concurrent mark-sweep with a hybrid write barrier. **Java's** G1, ZGC, and Shenandoah collectors all mark concurrently using tri-color invariants (G1 and Shenandoah use SATB/Yuasa-style barriers). **V8** does concurrent tri-color marking on background threads. In every case the white/gray/black abstraction plus a write barrier is what lets the collector trace a live, mutating heap without corrupting it.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Marking becomes pausable and resumable** — the gray set captures exactly how far you've gotten.",
      "**Foundation for concurrent and incremental GC** — lets the collector run alongside the program.",
      "**Correctness is a checkable invariant** — 'no black → white pointer' is precise and easy to reason about.",
      "**Handles cycles** — like all tracing, it's reachability-based.",
    ],
    cons: [
      "**Requires a write barrier under concurrency** — every pointer store pays a small, constant cost.",
      "**Floating garbage** — objects that die *after* being grayed/blackened survive this cycle (collected next time).",
      "**Extra per-object state** — two bits of color (or color bitmaps) instead of one mark bit.",
      "**Barrier design is subtle** — insertion vs deletion vs hybrid each have correctness and stack-rescanning trade-offs that are easy to get wrong.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the wavefront advance",
      body: "Run scenario 1 (Basic marking) and step through. Track the gray work queue: every step grays an object's white children, then blackens the object. Notice that the gray set is the boundary between fully-scanned black and untouched white — and that the strong invariant (no black→white pointer) holds at every single step.",
    },
    {
      title: "02 · Break it on purpose",
      body: "Run scenario 2 (The concurrent bug). With no write barrier, watch the mutator run `B.next = D` after B is already black. Step to the end: D is swept while B still points to it. That's the use-after-free the invariant exists to prevent — see exactly which step plants the bug.",
    },
    {
      title: "03 · Let the barrier save it",
      body: "Run scenario 3 (Write barrier saves the day). Same mutation, but now the Dijkstra barrier fires the instant `B.next = D` happens, graying D and re-adding it to the queue. Step through and confirm D ends up black — the collector traced a mutating heap correctly. This is how Go and G1 stay sound.",
    },
  ],

  code: {
    language: "typescript",
    filename: "tri-color.ts",
    code: `// Tri-color marking with a Dijkstra-style insertion write barrier.
type Color = "white" | "gray" | "black";
interface Obj { color: Color; refs: Obj[]; }

class TriColorMarker {
  private gray: Obj[] = []; // the work queue

  mark(roots: Obj[]): void {
    for (const r of roots) this.shade(r);  // gray the roots
    while (this.gray.length) {
      const obj = this.gray.pop()!;        // take a gray object
      for (const child of obj.refs) this.shade(child); // gray its white children
      obj.color = "black";                 // fully scanned
    }
    // anything still white is unreachable -> sweep it
  }

  /** white -> gray (and enqueue). Idempotent for gray/black. */
  private shade(o: Obj): void {
    if (o.color === "white") { o.color = "gray"; this.gray.push(o); }
  }

  /** Write barrier: run on every pointer store 'holder.field = target'.
   *  Dijkstra: graying the target restores "no black -> white". */
  writeBarrier(holder: Obj, target: Obj): void {
    this.shade(target);
    // (Yuasa/SATB variant would instead shade the *old* value being overwritten.)
  }
}`,
  },

  furtherReading: [
    {
      label: "Dijkstra et al. — On-the-Fly Garbage Collection: An Exercise in Cooperation (1978)",
      href: "https://dl.acm.org/doi/10.1145/359642.359655",
      note: "The original CACM paper that introduced tri-color marking and the insertion write barrier.",
      kind: "paper",
    },
    {
      label: "The Garbage Collection Handbook — Concurrent collection & tri-color abstraction",
      href: "https://gchandbook.org/",
      note: "Jones, Hosking & Moss. Strong vs weak invariants, insertion vs deletion barriers, in rigorous detail.",
      kind: "book",
    },
    {
      label: "Go — Eliminate STW stack re-scanning (golang/proposal #17503, hybrid write barrier)",
      href: "https://github.com/golang/proposal/blob/master/design/17503-eliminate-rescan.md",
      note: "How Go combines Dijkstra and Yuasa barriers to drop worst-case stop-the-world pauses below 50µs.",
      kind: "spec",
    },
    {
      label: "V8 — Concurrent marking",
      href: "https://v8.dev/blog/concurrent-marking",
      note: "A production tri-color marker running on background threads, with the barrier machinery to match.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "tc-q1",
      question: "In tri-color marking, what does it mean for an object to be gray?",
      options: [
        { id: "a", label: "It is unreachable and will be freed." },
        { id: "b", label: "It is reachable, but its outgoing pointers have not been scanned yet." },
        { id: "c", label: "It is reachable and fully scanned." },
        { id: "d", label: "It has a reference count of zero." },
      ],
      correctOptionId: "b",
      explanation:
        "Gray is the work-to-do set: the object is known live, but the collector still has to follow its pointers (graying any white children) before it can be blackened.",
    },
    {
      id: "tc-q2",
      question: "What is the strong tri-color invariant?",
      options: [
        { id: "a", label: "No white object may point to a black object." },
        { id: "b", label: "Every gray object must point only to black objects." },
        { id: "c", label: "No black object may point to a white object." },
        { id: "d", label: "Every object must be reachable from a root." },
      ],
      correctOptionId: "c",
      explanation:
        "Once an object is black it won't be re-scanned, so it must never be the sole link keeping a white object alive. Preserving 'no black→white pointer' guarantees every reachable object eventually becomes black.",
    },
    {
      id: "tc-q3",
      question:
        "While the collector marks concurrently, the program runs `B.next = D`, where B is black and D is white. Why is a write barrier needed here?",
      options: [
        { id: "a", label: "To increment B's reference count." },
        { id: "b", label: "Because this creates a black→white pointer; without the barrier graying D, D would be swept while B still references it — a use-after-free." },
        { id: "c", label: "To move D into the old generation." },
        { id: "d", label: "To compact the heap after marking." },
      ],
      correctOptionId: "b",
      explanation:
        "The store violates the strong invariant. A Dijkstra insertion barrier grays D (re-enqueuing it) so the collector still traces it; otherwise D stays white, gets freed, and B is left pointing at reclaimed memory.",
    },
  ],
};
