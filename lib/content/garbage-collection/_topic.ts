import type { TopicContent } from "@/lib/content/types";

export const garbageCollectionTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**Garbage collection is the runtime reclaiming memory you can no longer reach — automatically, without you calling `free()`.** When you write `user = null` in JavaScript or let a Python list fall out of scope, the object it held doesn't vanish on its own. Something has to notice it's unreachable and hand the memory back. That something is the garbage collector.",
    },
    {
      type: "p",
      text: "Every collector answers the same two questions: **which objects are still alive, and how do I reclaim the rest?** \"Alive\" almost always means *reachable* — you can get to the object by starting at the **roots** (local variables, globals, CPU registers) and following pointers. Anything you can't reach is garbage, even if it still points at other things. The algorithms differ in how they find the live set and what they do with the space the dead objects leave behind.",
    },
    {
      type: "p",
      text: "These eight algorithms are a ladder. Reference counting is the simplest idea that works — until it meets a cycle. Mark & sweep fixes cycles by tracing reachability, but leaves the heap fragmented. Mark-compact and copying collectors defeat fragmentation in two different ways. Generational collectors exploit the fact that most objects die young. And the last three — tri-color, incremental, concurrent — are all about one thing: collecting without freezing your program.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Why the algorithm choice matters" },
    {
      type: "ul",
      items: [
        "**Pause time** — a naive collector freezes every thread while it works (a *stop-the-world* pause). For a game or a trading system, a 200ms pause is a disaster. Concurrent and incremental collectors exist to shrink that pause.",
        "**Throughput** — the fraction of CPU spent running your code versus collecting. Doing less collection work, or doing it in bulk, raises throughput — often at the cost of longer pauses.",
        "**Memory overhead** — copying collectors need a spare half-heap; reference counting needs a counter on every object; generational collectors need write barriers. Nothing is free.",
        "**Fragmentation** — mark & sweep leaves holes that can starve a large allocation even when total free memory is plenty. Compacting and copying collectors eliminate it.",
        "**Cycles** — reference counting alone leaks them. Every tracing collector handles them for free, because reachability doesn't care about cycles.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Where these live in real runtimes",
      text: "**CPython** uses reference counting plus a cycle-detecting mark & sweep as backup. **The JVM** (G1, ZGC, Shenandoah) and **Go** use generational and concurrent tracing collectors. **V8** (Chrome, Node) is generational with an incremental, concurrent mark-compact for the old space. **Swift and Objective-C** use reference counting (ARC) and simply forbid strong cycles. Almost every production GC is a *hybrid* of the ideas on this page.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Algorithm",
      bursts: "How it finds garbage",
      precision: "Handles cycles?",
      memory: "Fragmentation",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "Reference Counting",
        bursts: "Per-object counter hits zero",
        precision: "No — cycles leak",
        memory: "Yes (no compaction)",
        bestFor: "Predictable frees, no pauses",
      },
      {
        algorithm: "Mark & Sweep",
        bursts: "Trace from roots, free unmarked",
        precision: "Yes",
        memory: "Yes (leaves holes)",
        bestFor: "Simple tracing baseline",
      },
      {
        algorithm: "Mark-Compact",
        bursts: "Mark, then slide live together",
        precision: "Yes",
        memory: "None — heap is compacted",
        bestFor: "Long-lived, full heaps",
      },
      {
        algorithm: "Copying (Cheney's)",
        bursts: "Copy survivors to a fresh half",
        precision: "Yes",
        memory: "None — survivors packed",
        bestFor: "Short-lived, sparse heaps",
      },
      {
        algorithm: "Generational",
        bursts: "Collect young often, old rarely",
        precision: "Yes",
        memory: "Depends on sub-collector",
        bestFor: "Typical app workloads",
      },
      {
        algorithm: "Tri-Color / Incremental / Concurrent",
        bursts: "Trace in steps or in parallel",
        precision: "Yes",
        memory: "Depends on sub-collector",
        bestFor: "Low-pause, latency-critical",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to think about picking one" },
    {
      type: "ul",
      items: [
        "**You want simple, deterministic frees and can guarantee no cycles** (or break them with weak references) → **reference counting**. Swift's ARC and C++ `shared_ptr` live here.",
        "**You need a correct, cycle-safe baseline and don't care about pauses** → **mark & sweep**. The teaching default and the fallback in many hybrids.",
        "**Your heap fills up with long-lived objects and fragmentation is hurting you** → **mark-compact**. One pass leaves you a clean, contiguous heap.",
        "**Most of your objects die almost immediately** → a **copying collector**, often as the young generation of a **generational** scheme. Allocation becomes a pointer bump and dead objects cost nothing to reclaim.",
        "**You cannot tolerate long stop-the-world pauses** (games, trading, interactive UIs) → **incremental** or **concurrent** collection built on the **tri-color** invariant.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Two axes, not one",
      text: "It helps to separate *how garbage is found* (reference counting vs. tracing) from *when the work happens* (stop-the-world vs. incremental vs. concurrent) and *what happens to survivors* (left in place, compacted, or copied). Real collectors mix and match: V8's old space is a *concurrent, incremental, compacting, generational* mark-sweep. Each adjective is one decision from this list.",
    },
  ],
};
