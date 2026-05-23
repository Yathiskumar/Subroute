import type { ConceptContent } from "@/lib/content/types";

export const generational: ConceptContent = {
  prototypeCaption:
    "The heap is split by **age**. New objects allocate in **eden**; survivors of a collection are copied into a **survivor** space and their age ticks up; objects that survive enough collections are **promoted** to the **old generation**. Pick a scenario and step through. Scenario 1 follows an object from eden to tenure. Scenario 2 shows a **write barrier** recording an old→young pointer in the **remembered set** so a minor GC doesn't free a live object. Scenario 3 runs a full **major GC** over the old generation.",

  overview: [
    {
      type: "p",
      text: "Generational GC is less an algorithm than a *strategy* — a way of organizing the heap so the other collectors do far less work. It rests on one empirical observation, the **weak generational hypothesis**: *most objects die young.* The temporary string you built to format a log line, the array you allocated inside a loop, the intermediate result of a map-reduce — the overwhelming majority of allocations become garbage almost immediately, while a small minority (caches, config, long-lived data structures) live for the entire program.",
    },
    {
      type: "p",
      text: "So instead of scanning the whole heap on every collection, split it by age. New objects go in the **young generation**; objects that have survived a while live in the **old generation**. Collect the young generation **often and cheaply** — it's small and mostly garbage, so a copying collector clears it in microseconds. Collect the old generation **rarely** — it's large but mostly live, so there's little to reclaim and no point looking often.",
    },
    {
      type: "p",
      text: "The payoff is dramatic: the vast majority of GC work happens on a tiny slice of the heap. A *minor* (young) collection touches only the objects that are likely to be dead anyway, and a slow *major* (full) collection runs maybe once for every fifty or a hundred minor ones.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Spaces, ages, and two kinds of collection" },
    {
      type: "p",
      text: "The young generation is typically divided into an **eden** space and two **survivor** spaces (often called S0 and S1). Allocation is a fast pointer bump into eden. One survivor space is always kept empty to copy into.",
    },
    {
      type: "ol",
      items: [
        "**Allocate in eden.** Every new object lands in eden via a bump pointer. No GC, no bookkeeping — just advance a cursor.",
        "**Minor GC, when eden fills.** Trace from the roots through eden and the active survivor space. Copy the live objects into the *empty* survivor space, incrementing each survivor's **age**. Then wipe eden and the old survivor space wholesale — all that dead matter is reclaimed for free.",
        "**Age and promote.** Each minor GC an object survives bumps its age. Once an object's age crosses the **tenuring threshold**, it's **promoted** — copied into the old generation instead of back into a survivor space. It stops participating in minor GCs entirely.",
        "**Major GC, when the old generation fills.** A full collection of the entire heap — usually a mark-sweep or mark-compact over the old generation. Slow and stop-the-world, but rare.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "The problem minor GC must solve: old → young pointers",
      text: "A minor GC only traces the young generation — it deliberately *skips* the old generation to stay fast. But what if an old object points *into* the young generation? (e.g. a long-lived cache gets a freshly allocated entry: `cache.put(key, newObject)`.) If the collector ignores old gen, it never sees that reference and would wrongly free a live young object. So old→young pointers must be tracked as extra roots.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Write barriers and the remembered set",
      text: "The fix is a **write barrier**: a tiny snippet of code the runtime injects on every pointer store. When the program writes a pointer from an old object to a young one, the barrier records the source — into a **remembered set**, or by flipping a bit in a coarse-grained **card table** that marks a region of old gen as 'dirty.' At the next minor GC, the collector treats the remembered set / dirty cards as additional roots, so cross-generational references are followed without scanning all of old gen. The barrier is the price of keeping minor GC cheap.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When the strategy pays off" },
    {
      type: "ul",
      items: [
        "**High allocation rate, short object lifetimes** — request handlers, parsers, functional-style code that allocates freely. This is the workload generational GC is built for, and almost all server/app workloads fit it.",
        "**You want low average pause times** — minor GCs are short and frequent, so the typical pause a user experiences is tiny; the long major GC is rare.",
        "**Allocation must be fast** — bump-pointer allocation into eden is about as cheap as allocation gets.",
        "**Be wary when the hypothesis is violated** — workloads where most objects survive (large long-lived caches built up at startup, object pools) gain little: you pay to copy survivors and run barriers without reclaiming much. Generational GC is a *bet* on infant mortality; when that bet is wrong, it's pure overhead.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**The HotSpot JVM** uses eden + two survivor spaces (default `SurvivorRatio=8`, so eden is 8× a survivor) and a `MaxTenuringThreshold` of up to 15 before promotion; G1, Parallel, and Serial collectors are all generational. **V8** (Chrome/Node) collects its young 'new space' with a copying **Scavenger** and promotes objects that survive two scavenges into old space. **.NET** uses three generations — gen 0 and gen 1 are the young/ephemeral generations collected often, gen 2 is the old generation. The hypothesis holds so reliably across these runtimes that generational collection is the default nearly everywhere.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Most GC work hits a tiny, mostly-dead slice of the heap** — minor collections are short and cheap.",
      "**Low average pause time** — the frequent collections are fast; the slow full collection is rare.",
      "**Fast bump-pointer allocation** into eden.",
      "**Composes with other collectors** — copying for the young gen, mark-compact or mark-sweep for the old gen; each generation uses the algorithm that suits it.",
    ],
    cons: [
      "**Write-barrier overhead on every pointer store** — the cost of maintaining the remembered set / card table, paid by the application, not the collector.",
      "**Loses its edge when objects survive** — if the generational hypothesis doesn't hold, you copy survivors and run barriers for little reclaim.",
      "**Major GC is still a long stop-the-world pause** — generational GC reduces how *often* you pay it, not how *much*.",
      "**More complex** — multiple spaces, ages, promotion policy, and the barrier machinery to get right.",
    ],
  },

  handsOn: [
    {
      title: "01 · Follow an object to tenure",
      body: "Run scenario 1 (Promotion lifecycle) and step through. Watch objects allocate in eden, then a minor GC copy the survivors into a survivor space with their age bumped to 1. Track one survivor across cycles — when its age reaches the threshold, it's promoted to old gen and stops appearing in minor GCs. Note how much of eden is garbage each cycle.",
    },
    {
      title: "02 · See the write barrier save a live object",
      body: "Run scenario 2 (Old-to-young pointer). An old-gen object gets a pointer to a freshly allocated young object; watch the write barrier fire and add it to the remembered set. On the next minor GC, the collector treats that entry as a root and copies the young object instead of freeing it. Mentally remove the barrier — without it, that object would be wrongly collected.",
    },
    {
      title: "03 · Trigger a major collection",
      body: "Run scenario 3 (Major collection). After many minor GCs the old generation fills with promoted objects, some now dead. Step through the full collection that marks and compacts the entire heap. Compare its scope to a minor GC — this is the slow, rare pause the whole strategy is designed to avoid running often.",
    },
  ],

  code: {
    language: "typescript",
    filename: "generational.ts",
    code: `// A sketch of generational collection: fast minor GC over the young gen,
// promotion by age, and a remembered set fed by a write barrier.
const TENURING_THRESHOLD = 3;

interface Obj { age: number; refs: Obj[]; gen: "young" | "old"; }

class GenerationalHeap {
  private eden: Obj[] = [];
  private survivor: Obj[] = [];
  private old: Obj[] = [];
  private roots: Obj[] = [];
  private remembered = new Set<Obj>(); // old objects holding young pointers

  /** Allocation is a bump into eden. Triggers a minor GC when full. */
  alloc(refs: Obj[] = []): Obj {
    const o: Obj = { age: 0, refs, gen: "young" };
    this.eden.push(o);
    if (this.eden.length > 8) this.minorGC();
    return o;
  }

  /** Write barrier: run on every pointer store. Records old -> young edges. */
  writeRef(holder: Obj, target: Obj): void {
    holder.refs.push(target);
    if (holder.gen === "old" && target.gen === "young") {
      this.remembered.add(holder); // remember it for the next minor GC
    }
  }

  /** Minor GC: trace young gen only. Roots = real roots + remembered set. */
  private minorGC(): void {
    const live = new Set<Obj>();
    const work = [...this.roots, ...this.remembered].flatMap((r) => r.refs ?? [r]);
    while (work.length) {
      const o = work.pop()!;
      if (o.gen === "old" || live.has(o)) continue; // don't trace into old gen
      live.add(o);
      work.push(...o.refs);
    }
    const nextSurvivor: Obj[] = [];
    for (const o of live) {
      if (++o.age >= TENURING_THRESHOLD) { o.gen = "old"; this.old.push(o); } // promote
      else nextSurvivor.push(o);
    }
    this.eden = [];                 // wipe eden + old survivor wholesale
    this.survivor = nextSurvivor;   // swap survivor spaces
    this.remembered.clear();
  }
}`,
  },

  furtherReading: [
    {
      label: "The Garbage Collection Handbook — Generational GC (Ch. 9)",
      note: "Jones, Hosking & Moss. The weak generational hypothesis, promotion policies, and remembered-set maintenance in depth.",
    },
    {
      label: "Oracle — HotSpot Garbage Collection Tuning Guide",
      note: "Eden, survivor spaces, SurvivorRatio, and MaxTenuringThreshold as they actually ship in the JVM.",
    },
    {
      label: "V8 — Trash talk: the Orinoco garbage collector",
      note: "How V8's generational design uses a copying Scavenger for new space and concurrent mark-compact for old space.",
    },
    {
      label: "Andy Wingo — Baffled by generational garbage collection",
      note: "A sharp, skeptical look at when the generational bet actually pays off — and when it doesn't.",
    },
  ],

  quiz: [
    {
      id: "gen-q1",
      question: "What empirical observation does generational GC exploit?",
      options: [
        { id: "a", label: "Objects are allocated in a strictly last-in-first-out order." },
        { id: "b", label: "The weak generational hypothesis: most objects die young, while a small minority live a long time." },
        { id: "c", label: "Old objects never reference young objects." },
        { id: "d", label: "Reference counts are usually small." },
      ],
      correctOptionId: "b",
      explanation:
        "The whole strategy is a bet on infant mortality. If most objects die young, collecting the small young generation often and the large old generation rarely concentrates the work where the garbage is.",
    },
    {
      id: "gen-q2",
      question:
        "A minor GC traces only the young generation. Why is a write barrier needed?",
      options: [
        { id: "a", label: "To increment each object's age." },
        { id: "b", label: "To compact the old generation after every minor GC." },
        { id: "c", label: "To record old→young pointers in a remembered set, so a minor GC can treat them as roots and not wrongly free a reachable young object." },
        { id: "d", label: "To speed up allocation into eden." },
      ],
      correctOptionId: "c",
      explanation:
        "Since minor GC skips old gen, an old object pointing into young gen would be invisible to it. The write barrier records such stores into a remembered set (or card table), which the minor GC scans as extra roots.",
    },
    {
      id: "gen-q3",
      question:
        "An object is copied between survivor spaces and its age keeps increasing. What eventually happens when its age crosses the tenuring threshold?",
      options: [
        { id: "a", label: "It is freed immediately." },
        { id: "b", label: "It is promoted to the old generation and stops participating in minor GCs." },
        { id: "c", label: "Its age resets to zero." },
        { id: "d", label: "It triggers a major GC." },
      ],
      correctOptionId: "b",
      explanation:
        "Surviving enough minor collections marks an object as long-lived, so it's promoted (tenured) into the old generation — keeping the young generation small and minor GCs cheap.",
    },
  ],
};
