import type { ConceptContent } from "@/lib/content/types";

export const concurrentMarkSweep: ConceptContent = {
  prototypeCaption:
    "Concurrent mark-sweep runs the collector on its own thread, *in parallel* with your program (the mutator), so the heap is reclaimed with only two brief stop-the-world pauses. Watch the two thread lanes and the timeline: a short **STW initial mark**, a long **concurrent mark** (both threads run together), a short **STW remark**, then a **concurrent sweep**. Scenario 2 shows **floating garbage** — an object that dies mid-cycle but survives until the next one.",

  overview: [
    {
      type: "p",
      text: "Concurrent mark-sweep (CMS) takes the tri-color marking idea and runs the collector *on its own thread, alongside the running program*. The application thread (the **mutator**) and the collector thread share the same heap and run truly in parallel. The goal is the holy grail of GC: reclaim memory with almost no observable pause.",
    },
    {
      type: "p",
      text: "It can't be *entirely* pause-free — there are two short moments where the collector must briefly stop the world to get a consistent view of the roots. But those pauses touch only the roots and a small amount of fix-up work, not the whole heap, so they stay in the millisecond range regardless of how big the heap is. The expensive parts — tracing the whole object graph and sweeping the dead — happen concurrently while your program keeps running.",
    },
    {
      type: "p",
      text: "The price is paid in three currencies: a **write barrier** on every pointer store (to keep marking correct while the mutator mutates), some **floating garbage** (objects that die after being marked, reclaimed next cycle), and **fragmentation** (CMS sweeps in place and doesn't compact). It's a deliberate trade of throughput and memory tidiness for low latency.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Four phases — two brief pauses, two concurrent" },
    {
      type: "ol",
      items: [
        "**Initial mark (stop-the-world).** Briefly pause all mutator threads, scan the roots, and gray the directly-reachable objects. Short, because it only touches roots — then mutators resume.",
        "**Concurrent mark.** The collector drains the gray queue and traces the whole object graph *while the mutator runs in parallel.* A **write barrier** records pointer stores the mutator makes so nothing reachable is missed. (Real CMS adds a *precleaning* step here to reduce the next pause.)",
        "**Remark (stop-the-world).** A second brief pause to finish the work the barrier deferred — newly allocated objects and last-minute mutations — and confirm the gray queue is truly empty. Optimized to be quick.",
        "**Concurrent sweep.** Mutators resume; the collector walks the heap and frees the white (unreachable) objects in parallel with the program. No compaction.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Floating garbage is by design",
      text: "Suppose the collector has already marked object D black, and then the mutator runs `B.next = null`, making D unreachable. The collector won't un-mark D — it keeps it alive for this cycle. D is **floating garbage**: dead, but reclaimed only on the *next* GC cycle. That's the cost of not re-scanning: a little wasted memory in exchange for not pausing. It's never lost forever, just delayed by one cycle.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Two real failure modes: fragmentation and concurrent mode failure",
      text: "Because CMS sweeps in place and never compacts, the old generation slowly **fragments** — free memory exists but not in one contiguous block. And because the collector races the program, it can lose: if the heap fills up *before* the concurrent collection finishes (a **concurrent mode failure**), the JVM falls back to a full, compacting, stop-the-world collection — exactly the long pause CMS was trying to avoid. These two weaknesses are why Java deprecated CMS (JDK 9) and removed it (JDK 14) in favor of G1, ZGC, and Shenandoah.",
    },
  ],

  whenToUse: [
    { type: "h", text: "Where it fits" },
    {
      type: "ul",
      items: [
        "**Latency-sensitive services on multi-core machines** — you have spare cores to run the collector, and you care about tail latency more than raw throughput.",
        "**Large old generations** — concurrent tracing keeps the pause bounded even as the live set grows.",
        "**You can tolerate some wasted memory and CPU** — floating garbage, fragmentation, and barrier/thread overhead are the cost of staying responsive.",
        "**Not for throughput-bound batch jobs** — if nobody's watching pauses, a parallel stop-the-world collector reclaims faster and with less overhead.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**Java's CMS collector** was the canonical low-pause collector for the HotSpot old generation for over a decade, with exactly the four phases above — until it was deprecated in JDK 9 and removed in JDK 14 (JEP 363), superseded by **G1** (regionized, concurrent, *compacting*), **ZGC**, and **Shenandoah** (sub-millisecond pauses via concurrent relocation). **Go's** collector is a concurrent mark-sweep with a hybrid write barrier and similarly tiny STW phases. The pattern endures even though that specific JVM implementation is gone.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Near-zero observable pause** — only two short STW phases; the heavy tracing and sweeping run concurrently.",
      "**Pause time independent of heap size** — the STW phases touch roots and fix-ups, not the whole heap.",
      "**Uses spare cores** — the collector runs on its own thread alongside the program.",
      "**Built on the tri-color invariant** — a well-understood correctness foundation.",
    ],
    cons: [
      "**Fragmentation** — sweeps in place, never compacts; can eventually force a full compacting GC.",
      "**Concurrent mode failure** — if the heap fills before the cycle finishes, you fall back to a long stop-the-world collection.",
      "**Floating garbage** — objects that die mid-cycle survive until the next one.",
      "**Lower throughput & more CPU** — write-barrier cost on every store plus a collector thread competing for cores.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch two threads share one heap",
      body: "Run scenario 1 (Full CMS cycle) and step through. Track the two thread lanes: the collector pauses the mutator only for the brief STW initial-mark and STW remark; in between, both lanes run together during concurrent mark and concurrent sweep. On the timeline, note how little of the total time is red (stop-the-world).",
    },
    {
      title: "02 · Find the two short pauses",
      body: "On the timeline, the red slices are the only times your program is frozen — initial mark and remark. Compare their width to the green concurrent phases. That ratio is the whole point of CMS: the expensive work is overlapped with the program, so the pause stays tiny no matter how big the heap.",
    },
    {
      title: "03 · Create floating garbage",
      body: "Run scenario 2 (Floating garbage). The collector marks D black, then the mutator runs `B.next = null`, orphaning D. Step on: D stays black and survives this cycle as floating garbage (red dashed), wasting memory until the next cycle reclaims it. This is the trade CMS accepts for not re-scanning.",
    },
  ],

  code: {
    language: "typescript",
    filename: "concurrent-mark-sweep.ts",
    code: `// Concurrent mark-sweep: collector runs alongside the mutator, with two
// brief stop-the-world phases bracketing the concurrent work.
type Color = "white" | "gray" | "black";
interface Obj { color: Color; refs: Obj[]; }

class CMSCollector {
  private gray: Obj[] = [];

  collect(roots: Obj[], heap: Obj[], pauseMutators: (fn: () => void) => void) {
    // PHASE 1 — initial mark (STW): scan roots only, then resume mutators.
    pauseMutators(() => { for (const r of roots) this.shade(r); });

    // PHASE 2 — concurrent mark: trace the graph while the program runs.
    //   The mutator's writeBarrier() (below) feeds new work into 'gray'.
    while (this.gray.length) {
      const o = this.gray.pop()!;
      for (const c of o.refs) this.shade(c);
      o.color = "black";
    }

    // PHASE 3 — remark (STW): drain anything the barrier deferred.
    pauseMutators(() => {
      while (this.gray.length) {
        const o = this.gray.pop()!;
        for (const c of o.refs) this.shade(c);
        o.color = "black";
      }
    });

    // PHASE 4 — concurrent sweep: free white objects while the program runs.
    for (const o of heap) {
      if (o.color === "white") { /* free(o) */ }
      else o.color = "white"; // reset for next cycle
      // NOTE: objects orphaned after being blackened survive as floating garbage.
    }
  }

  /** Mutator write barrier (runs in parallel): keeps marking sound. */
  writeBarrier(target: Obj) { this.shade(target); }

  private shade(o: Obj) { if (o.color === "white") { o.color = "gray"; this.gray.push(o); } }
}`,
  },

  furtherReading: [
    {
      label: "Oracle — The Concurrent Mark Sweep (CMS) Collector",
      note: "The canonical four-phase description, tuning knobs, and the concurrent-mode-failure fallback.",
    },
    {
      label: "JEP 363 — Remove the Concurrent Mark Sweep (CMS) Garbage Collector",
      note: "Why the JVM retired CMS, and what replaced it (G1, ZGC, Shenandoah).",
    },
    {
      label: "The Garbage Collection Handbook — Concurrent collection",
      note: "Jones, Hosking & Moss. The theory behind concurrent tracing, barriers, and termination.",
    },
    {
      label: "Wikipedia — Concurrent mark sweep collector",
      note: "A concise overview of the algorithm, its phases, and its trade-offs.",
    },
  ],

  quiz: [
    {
      id: "cms-q1",
      question:
        "Why does even a 'concurrent' mark-sweep collector still have stop-the-world pauses?",
      options: [
        { id: "a", label: "To free every object one at a time." },
        { id: "b", label: "For two brief phases — initial mark and remark — that need a consistent view of the roots and final fix-ups; the heavy tracing and sweeping run concurrently." },
        { id: "c", label: "Because it compacts the heap on every cycle." },
        { id: "d", label: "It doesn't — CMS is fully pause-free." },
      ],
      correctOptionId: "b",
      explanation:
        "The initial mark and remark phases briefly pause the mutator to scan roots and reconcile changes the write barrier deferred. They touch only roots/fix-ups, so they stay short; concurrent mark and sweep do the bulk of the work in parallel.",
    },
    {
      id: "cms-q2",
      question: "What is floating garbage in a concurrent collector?",
      options: [
        { id: "a", label: "An object that is reachable but never marked." },
        { id: "b", label: "An object that becomes unreachable after the collector already marked it live, so it survives until the next GC cycle." },
        { id: "c", label: "Memory leaked permanently by the collector." },
        { id: "d", label: "An object stuck in the gray queue forever." },
      ],
      correctOptionId: "b",
      explanation:
        "If the mutator orphans an object after it's been marked black, the collector won't un-mark it. It's dead but survives this cycle, reclaimed on the next — a small memory cost for avoiding a re-scan and a pause.",
    },
    {
      id: "cms-q3",
      question:
        "What is a 'concurrent mode failure' in CMS, and why is it bad?",
      options: [
        { id: "a", label: "Two collector threads deadlock." },
        { id: "b", label: "The heap fills up before the concurrent collection finishes, forcing a long, full, stop-the-world compacting GC — exactly the pause CMS tries to avoid." },
        { id: "c", label: "The write barrier fails to compile." },
        { id: "d", label: "Floating garbage is never collected." },
      ],
      correctOptionId: "b",
      explanation:
        "CMS races the application. If allocations outrun the concurrent collection (often worsened by fragmentation, since CMS doesn't compact), the JVM falls back to a full stop-the-world collection — a large pause that defeats the purpose, and a key reason CMS was retired.",
    },
  ],
};
