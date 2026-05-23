import type { ConceptContent } from "@/lib/content/types";

export const incremental: ConceptContent = {
  prototypeCaption:
    "Incremental GC chops one long collection into many tiny **slices** interleaved with the program. The **timeline** at the bottom shows control alternating between mutator slices (the program) and GC slices (a bit of marking each). The heap uses the same white/gray/black coloring as tri-color marking, and a **write barrier** fires inside mutator slices to keep marking correct across the gaps. Pick a scenario and step through — watch no single GC pause grow large.",

  overview: [
    {
      type: "p",
      text: "A classic stop-the-world collector freezes your entire program, does *all* the GC work, and resumes. If that work takes 200ms, every thread is frozen for 200ms — fatal for a game frame, an animation, or a trading loop. Incremental GC attacks the symptom directly: **do the same work, but in many small slices interleaved with the program**, so no single pause is long.",
    },
    {
      type: "p",
      text: "Mechanically, it's tri-color marking with a time budget. The collector marks for a few hundred microseconds, then hands control back to the program (the *mutator*). The program runs for a while, then yields back for another GC slice. Marking advances a little at a time until the gray queue drains. The total marking work is roughly the same as stop-the-world — but it's spread out, so the *worst-case pause* shrinks dramatically.",
    },
    {
      type: "p",
      text: "The catch is the same one tri-color faces: between GC slices, the program mutates pointers and can break the marking invariant. So incremental collectors lean on the same **write barrier** to stay correct — it's the price of interleaving.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Slices, budgets, and barriers" },
    {
      type: "ol",
      items: [
        "**Start a GC slice.** Color the roots gray (a short initial pause), then mark from the gray queue until the slice's time (or work) budget is used up. Yield to the program.",
        "**Mutator slice.** The program runs normally — computing, allocating, mutating pointers. A **write barrier** intercepts pointer stores that would break the tri-color invariant and re-grays the affected object, so nothing live is lost.",
        "**Resume marking.** The next GC slice pops where the last left off, draining a few more gray objects. Because the gray set persisted, no work is repeated.",
        "**Finish.** When the gray queue empties, marking is complete. A short final slice closes out, then sweep reclaims the white objects.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Pause time vs. throughput",
      text: "Incremental GC trades **throughput** for **latency**. The barrier runs on every pointer store, and slicing adds scheduling overhead, so the program does slightly *less* total work per second. In return, the longest pause drops from 'collect the whole heap' to 'one small slice.' For interactive and real-time systems that's a great trade; for a batch job that just wants maximum throughput, it's a loss.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Floating garbage and termination",
      text: "Because the program keeps allocating during collection, some objects become garbage *after* the collector has already marked them black — they survive this cycle and are reclaimed in the next. That's **floating garbage**: a little extra memory headroom in exchange for short pauses. There's also a subtle race: the mutator can keep creating gray work, so the collector must be guaranteed to make net progress (finite work + barriers that don't endlessly re-gray) or marking would never terminate.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Latency matters more than raw throughput** — UIs, games, audio/video, trading, anything with a frame budget or an SLA on tail latency.",
        "**The heap is large** — a big heap means a long stop-the-world pause; slicing keeps the worst case bounded regardless of heap size.",
        "**You can afford a small constant overhead per pointer write** — the write barrier — and a little floating garbage.",
        "**Not worth it for short-lived batch jobs** — if you never notice a pause, the barrier and slicing overhead are pure cost; a simple stop-the-world collector wins on throughput.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**V8** marks incrementally: it interleaves marking steps with JavaScript execution so a major GC doesn't stall a frame, with idle-time GC scheduled between frames. **Java's CMS** (now removed) and **G1** do incremental/concurrent marking to hit pause-time goals; **ZGC** and **Shenandoah** push pauses into the single-digit-millisecond range. The shared idea is always the same: never do all the GC work at once.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Short, bounded pauses** — the worst case is one slice, not the whole heap.",
      "**Scales to large heaps** — pause time no longer grows with total live data.",
      "**Smoother latency** — interactive and real-time workloads stay responsive.",
      "**Builds directly on tri-color marking** — the colors are exactly the resumable state a slice needs.",
    ],
    cons: [
      "**Lower throughput** — write-barrier cost on every store, plus slice scheduling overhead.",
      "**Floating garbage** — objects that die mid-cycle survive until the next collection.",
      "**More complex** — budgets, barriers, and a termination guarantee to get right.",
      "**Total wall-clock collection time is longer** — the work is the same but stretched out and interleaved.",
    ],
  },

  handsOn: [
    {
      title: "01 · Read the timeline",
      body: "Run scenario 1 (Interleaved slices) and step through, watching the timeline at the bottom. GC slices (gray) and mutator slices (purple) alternate, with the 'now' marker advancing. Note that each GC slice only blackens an object or two before yielding — total marking work is the same as stop-the-world, just chopped up so no single pause is large.",
    },
    {
      title: "02 · Catch a barrier mid-slice",
      body: "Run scenario 2 (Mutator + barrier). During a mutator slice the program runs `B.next = D` with B black and D white. Watch a tiny barrier slice appear on the timeline, graying D and re-queueing it. Step on: the next GC slice still finds D in the queue and marks it — interleaving stayed correct.",
    },
    {
      title: "03 · Compare the pauses",
      body: "On either scenario, look at the relative widths of the slices on the timeline. The mutator runs for most of the wall-clock time; the collector runs in short bursts. Imagine collapsing all the GC slices into one block — that's the single stop-the-world pause incremental GC is splitting up to avoid.",
    },
  ],

  code: {
    language: "typescript",
    filename: "incremental.ts",
    code: `// Incremental marking: tri-color marking that runs in bounded slices,
// yielding to the mutator between them. A write barrier keeps it correct.
type Color = "white" | "gray" | "black";
interface Obj { color: Color; refs: Obj[]; }

class IncrementalCollector {
  private gray: Obj[] = [];
  private marking = false;

  startCycle(roots: Obj[]): void {
    for (const r of roots) this.shade(r); // short initial pause: gray the roots
    this.marking = true;
  }

  /** Do a bounded amount of marking, then return so the program can run. */
  markSlice(budget: number): void {
    let work = 0;
    while (this.marking && this.gray.length && work < budget) {
      const obj = this.gray.pop()!;
      for (const child of obj.refs) this.shade(child);
      obj.color = "black";
      work++;
    }
    if (this.gray.length === 0) this.marking = false; // done -> sweep next
  }

  /** Write barrier in mutator slices: keeps the tri-color invariant. */
  writeBarrier(_holder: Obj, target: Obj): void {
    if (this.marking) this.shade(target); // re-gray so D isn't missed
  }

  private shade(o: Obj): void {
    if (o.color === "white") { o.color = "gray"; this.gray.push(o); }
  }
}

// Driver: interleave program work with GC slices.
//   while (running) { runMutatorForAWhile(); collector.markSlice(1000); }`,
  },

  furtherReading: [
    {
      label: "The Garbage Collection Handbook — Incremental & concurrent collection",
      note: "Jones, Hosking & Moss. Time/work budgets, tricolor invariants, and termination arguments.",
    },
    {
      label: "V8 — Incremental marking & idle-time GC",
      note: "How V8 splits marking into steps interleaved with JavaScript, scheduling GC into idle frame time.",
    },
    {
      label: "Steele / Dijkstra / Baker — early on-the-fly and incremental collectors",
      note: "The foundational papers that established interleaving GC with the mutator.",
    },
    {
      label: "OpenJDK — G1, ZGC, Shenandoah pause-time goals",
      note: "Production collectors built around keeping pauses short via incremental/concurrent work.",
    },
  ],

  quiz: [
    {
      id: "inc-q1",
      question: "What is the core idea of incremental garbage collection?",
      options: [
        { id: "a", label: "Do all GC work in one fast stop-the-world pass." },
        { id: "b", label: "Split the collection into many small slices interleaved with the running program, so no single pause is long." },
        { id: "c", label: "Count references on every pointer store." },
        { id: "d", label: "Never reclaim memory until the program exits." },
      ],
      correctOptionId: "b",
      explanation:
        "Incremental GC does roughly the same total work as stop-the-world, but spreads it across many short slices interleaved with the mutator, shrinking the worst-case pause.",
    },
    {
      id: "inc-q2",
      question: "What is the main trade-off incremental GC makes?",
      options: [
        { id: "a", label: "It improves both throughput and latency for free." },
        { id: "b", label: "It lowers throughput (write-barrier and scheduling overhead) in exchange for shorter, bounded pauses." },
        { id: "c", label: "It uses more memory but eliminates all pauses entirely." },
        { id: "d", label: "It only works on heaps with no cycles." },
      ],
      correctOptionId: "b",
      explanation:
        "The barrier runs on every pointer store and slicing adds scheduling cost, so the program does slightly less work per second — but the longest pause drops from 'whole heap' to 'one slice.'",
    },
    {
      id: "inc-q3",
      question:
        "Why does an incremental collector still need a write barrier between its slices?",
      options: [
        { id: "a", label: "To allocate new objects faster." },
        { id: "b", label: "Because the program mutates pointers between GC slices and can create a black→white pointer; the barrier re-grays the target so marking stays correct." },
        { id: "c", label: "To compact the heap after each slice." },
        { id: "d", label: "To reset object ages." },
      ],
      correctOptionId: "b",
      explanation:
        "Interleaving means the mutator runs mid-mark and can break the tri-color invariant. The write barrier catches such stores and re-grays the affected object, so an object that becomes reachable during a mutator slice isn't wrongly swept.",
    },
  ],
};
