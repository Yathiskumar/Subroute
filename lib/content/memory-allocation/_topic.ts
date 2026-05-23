import type { TopicContent } from "@/lib/content/types";

export const memoryAllocationTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**Memory allocation is the act of handing out a chunk of free memory in response to a request — `malloc`, `new`, a stack frame, a kernel object — and reclaiming it later.** Garbage collection decides *what is still alive*; allocation decides *where the next live thing goes.* Every program leans on an allocator on essentially every line, so the policy it uses quietly shapes throughput, latency, and how much memory you actually waste.",
    },
    {
      type: "p",
      text: "The core difficulty is **fragmentation**. Free memory is rarely one clean block — it's a patchwork of holes left behind as objects of different sizes come and go. An allocator's job is to choose *which hole* to carve a request from, and that single choice, repeated millions of times, determines whether your holes stay large and reusable or crumble into dust too small to use.",
    },
    {
      type: "p",
      text: "These six allocators split into two families. The first four — **First, Best, Worst, and Next Fit** — are *sequential-fit* strategies: they keep a list of holes and differ only in which one they pick. The last two are *structured* schemes that real systems ship: the **buddy system** (Linux's page allocator, splitting and merging powers of two) and **slab allocation** (the kernel's object caches, with O(1) allocation and zero external fragmentation).",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Why the policy matters" },
    {
      type: "ul",
      items: [
        "**External fragmentation** — free memory exists in total, but no single hole is big enough for the next request. A request fails even though there's plenty of room. This is the disease the fit strategies fight (and sometimes worsen).",
        "**Internal fragmentation** — you hand out *more* than was asked for (rounded up to a block size), and the slack inside the block is wasted. The buddy system trades this on purpose for speed.",
        "**Allocation speed** — how long it takes to find a hole. First/Next Fit stop early; Best/Worst Fit scan everything; buddy and slab are effectively O(1). On a hot path, this is the difference between a fast and a slow program.",
        "**Coalescing cost** — when memory is freed, can adjacent holes merge back into a big one? The buddy system makes this a single XOR and a list operation; naive free lists make it a search.",
        "**Predictability** — a kernel or real-time system cannot afford an allocator whose latency spikes or whose memory slowly rots into unusable slivers. That constraint is exactly why slab and buddy exist.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Where these live in real systems",
      text: "**Linux's page allocator** is a buddy system; its **slab/SLUB allocator** sits on top to dish out kernel objects (inodes, task_structs, file handles). **glibc `malloc` (ptmalloc)** uses segregated free lists with best-fit-like binning. **FreeBSD** popularized the slab allocator (Bonwick's design from Solaris). The sequential fits are the textbook foundation every one of these is a refinement of — and First Fit, in particular, is still remarkably hard to beat in practice.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Allocator",
      bursts: "How it picks",
      precision: "Speed",
      memory: "Fragmentation",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "First Fit",
        bursts: "First hole that fits, from the start",
        precision: "Fast (early stop)",
        memory: "External; clusters at front",
        bestFor: "Sensible general default",
      },
      {
        algorithm: "Best Fit",
        bursts: "Smallest hole that fits",
        precision: "Slow (scans all)",
        memory: "External; tiny slivers",
        bestFor: "Minimizing leftover (in theory)",
      },
      {
        algorithm: "Worst Fit",
        bursts: "Largest hole that fits",
        precision: "Slow (scans all)",
        memory: "External; eats big holes",
        bestFor: "Rarely — mostly a teaching foil",
      },
      {
        algorithm: "Next Fit",
        bursts: "First fit, resuming where it stopped",
        precision: "Fast; spreads load",
        memory: "External; spread out",
        bestFor: "Cheap, even use of memory",
      },
      {
        algorithm: "Buddy System",
        bursts: "Round to power of 2, split/merge",
        precision: "O(log n), fast coalescing",
        memory: "Internal (rounding waste)",
        bestFor: "Page allocation, fast free",
      },
      {
        algorithm: "Slab",
        bursts: "Fixed slot in a per-type cache",
        precision: "O(1)",
        memory: "Almost none (per type)",
        bestFor: "Many same-sized objects",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to think about picking one" },
    {
      type: "ul",
      items: [
        "**You want a simple, fast, good-enough general allocator** → **First Fit** (or **Next Fit** if you want to spread allocations out). Decades of study show First Fit is hard to beat for general workloads.",
        "**You're tempted by Best Fit to 'minimize waste'** → measure first. Best Fit minimizes the leftover of *each* allocation but tends to litter the heap with slivers too small to ever reuse, and it pays a full scan every time.",
        "**You're handing out whole pages and need fast merging** → the **buddy system**. Power-of-two blocks make finding a buddy and coalescing nearly free, at the cost of rounding every request up.",
        "**You allocate huge numbers of identically-sized objects** (kernel structs, network buffers, nodes) → a **slab allocator**. One cache per type means O(1) allocation, no external fragmentation, and warm, pre-initialized objects.",
        "**Real systems layer these** — Linux uses buddy for pages and slab on top for objects. The fit strategies are the conceptual baseline you reach for inside a custom allocator or arena.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Two kinds of waste, one trade-off",
      text: "Keep the two fragmentations straight: *external* is wasted space **between** allocations (the fit strategies' problem), *internal* is wasted space **inside** an allocation you over-rounded (the buddy system's deliberate cost). Slab allocation is special because, within a single object type, it has essentially neither — every slot is exactly the right size and packed tight. The price is structure: you must know your object sizes up front.",
    },
  ],
};
