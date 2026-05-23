import type { ConceptContent } from "@/lib/content/types";

export const slab: ConceptContent = {
  prototypeCaption:
    "A slab allocator gives **each object type its own cache**. A cache is a set of **slabs** — contiguous memory pre-divided into fixed-size **slots** sized exactly for that object. Allocation is just 'find a free slot,' an O(1) operation with no size search and no external fragmentation. Slabs move between **empty → partial → full** as slots fill, and empty slabs are reclaimed. Scenario **1 · Two object types** runs two caches side by side; scenario **2 · Grow & reclaim** shows a slab created, filled, and returned to the OS.",

  overview: [
    {
      type: "p",
      text: "The slab allocator answers a different question from the fit strategies. They ask 'where do I put an arbitrary-sized request?' Slab allocation asks 'I allocate millions of objects of the *same few types* — how do I make that nearly free?' Its answer: give every object type its own **cache** of memory carved into slots exactly the right size, so allocation never searches and never wastes space on rounding.",
    },
    {
      type: "p",
      text: "Each cache owns one or more **slabs** — a slab is a chunk of contiguous memory (typically a page or a few pages from the underlying page allocator) sliced into a fixed number of equal **slots**. To allocate an object, you grab any free slot in the cache; to free it, you mark the slot free. There's no size matching, no splitting, no coalescing — just a free slot to claim. That's why allocation and free are **O(1)**.",
    },
    {
      type: "p",
      text: "Because every slot in a cache is the exact size of the object, there is essentially **no external fragmentation** within a cache, and internal fragmentation is limited to the small, fixed slack the object type itself defines. Bonwick designed the slab allocator for Solaris precisely to serve the kernel's torrent of same-typed objects — inodes, file structures, task structs — and the design (and its descendants SLAB/SLUB/SLOB) is now standard in Linux and the BSDs.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Caches, slabs, and slots" },
    {
      type: "ul",
      items: [
        "**Cache** — one per object type (e.g. `inode_cache`). It knows the object size and how many slots fit in a slab, and it tracks its slabs by state.",
        "**Slab** — a contiguous run of memory from the page allocator, divided into N fixed-size slots. A slab is **empty** (all slots free), **partial** (some used), or **full** (all used).",
        "**Slot** — space for exactly one object. Allocation claims a free slot; free releases one.",
      ],
    },
    { type: "h", text: "Allocate: prefer a partial slab" },
    {
      type: "ol",
      items: [
        "**Look for a partial slab first.** It already has both live objects and free slots, so using it keeps memory dense and avoids touching empty slabs.",
        "**Else use an empty slab** if one is on hand (kept around for fast reuse).",
        "**Else grow.** Ask the page allocator for a fresh slab (one or more pages), slice it into slots — it starts empty — and use it.",
        "**Claim a free slot** in O(1) and update the slab's state (empty→partial, or partial→full).",
      ],
    },
    { type: "h", text: "Free: release and maybe reclaim" },
    {
      type: "ol",
      items: [
        "**Find the object's slot** and mark it free; the slab transitions full→partial or partial→empty.",
        "**Reclaim empty slabs.** When a slab becomes fully empty, its memory can be returned to the page allocator. (Real allocators often keep a few empties cached for fast reuse instead of reclaiming immediately.)",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Object caching: the other half of Bonwick's idea",
      text: "The original slab design also **caches constructed objects**: when an object is freed, it can be kept in an initialized state so the next allocation skips re-initialization. For complex kernel structures with expensive constructors, reusing a warm, already-initialized object is a real speedup — allocation becomes 'hand back a ready-made object,' not 'find memory and build one.'",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Layered on the page/buddy allocator",
      text: "Slab allocation doesn't get memory from thin air — it requests whole pages from the underlying page allocator (a buddy system in Linux) and subdivides them into slots. Buddy handles coarse, power-of-two page allocation with fast coalescing; slab handles fine-grained, same-sized objects with O(1) speed. They're complementary layers, not competitors.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When slab allocation is the right tool" },
    {
      type: "ul",
      items: [
        "**You allocate huge numbers of identically-sized objects** — kernel objects, network buffers, tree/list nodes, connection structs. This is the workload slab was built for.",
        "**Allocation must be O(1) and predictable** — no scan, no fit search, no fragmentation-driven latency spikes; ideal for kernels and real-time-ish paths.",
        "**Object initialization is expensive** — caching constructed objects amortizes the setup cost across allocations.",
        "**Not for arbitrary-sized requests** — slab needs to know object sizes up front. General `malloc` workloads with wildly varying sizes are served by sized caches plus a fallback, not by a single slab cache.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "The **Linux kernel** uses slab-style allocation (the **SLUB** allocator by default, with SLAB and SLOB as alternatives) for nearly all internal objects. `kmalloc` is backed by a set of caches for common sizes; dedicated caches like `dentry`, `inode_cache`, and `task_struct` serve specific object types. You can watch them live in `/proc/slabinfo`. **FreeBSD** uses a slab allocator (`uma`, the zone allocator) descended from the same Solaris design.",
    },
  ],

  tradeoffs: {
    pros: [
      "**O(1) allocate and free** — just claim or release a slot; no search, no splitting.",
      "**Almost no fragmentation** — slots are exactly object-sized, so no external fragmentation within a cache.",
      "**Object caching** — freed objects can stay initialized, skipping re-construction on reuse.",
      "**Great cache/TLB behavior** — same-typed objects packed densely in slabs improve locality.",
    ],
    cons: [
      "**One cache per object type** — you must know sizes up front; not for arbitrary-sized allocation.",
      "**Per-cache overhead** — many object types means many caches and some bookkeeping.",
      "**Partially-full slabs hold memory** — a slab with one live object still occupies its whole page until that object frees.",
      "**Complexity** — slab states, reclamation policy, and per-CPU caches (in SLUB) add machinery.",
    ],
  },

  handsOn: [
    {
      title: "01 · Allocate from two caches at once",
      body: "On scenario **1 · Two object types**, step through. `file_cache` (64B, 6 slots/slab) and `task_cache` (128B, 4 slots/slab) fill independently — each object goes into a slot of its own cache. Watch a new slab get created the first time each cache is touched, and note the 'External frag = 0B' stat holding steady: every slot is exactly object-sized.",
    },
    {
      title: "02 · Watch slab states and reclamation",
      body: "Continue scenario 1 into the **free** operations. Freeing F3 turns its slab partial; freeing T1 then T2 empties the task slab entirely — watch it transition to EMPTY and get **reclaimed** back to the OS, dropping the 'Slabs in use' and 'Memory committed' stats. Then the final file allocation reuses the freed F3 slot rather than growing.",
    },
    {
      title: "03 · Grow past one slab, then reclaim a whole slab",
      body: "Switch to scenario **2 · Grow & reclaim**. Allocate seven file objects: the first six fill slab 1 (empty→partial→full), and the seventh forces a second slab to be created. Then free F1–F6 to empty slab 1 completely and watch it get reclaimed while slab 2 keeps F7. Use Auto to watch the empty→partial→full→reclaim lifecycle play out.",
    },
  ],

  code: {
    language: "typescript",
    filename: "slab.ts",
    code: `interface Slab { slots: (string | null)[]; }      // null = free slot

class Cache {
  slabs: Slab[] = [];
  constructor(public objectSize: number, public slotsPerSlab: number) {}

  private state(s: Slab) {
    const used = s.slots.filter(Boolean).length;
    return used === 0 ? "empty" : used === s.slots.length ? "full" : "partial";
  }

  /** O(1): claim a free slot, preferring a partial slab; grow only if needed. */
  alloc(objId: string): void {
    let slab = this.slabs.find((s) => this.state(s) === "partial")
            ?? this.slabs.find((s) => this.state(s) === "empty");
    if (!slab) {                                   // grow: new slab from page allocator
      slab = { slots: Array(this.slotsPerSlab).fill(null) };
      this.slabs.push(slab);
    }
    slab.slots[slab.slots.indexOf(null)] = objId;  // take the first free slot
  }

  /** O(1): release the slot; reclaim the slab if it becomes empty. */
  free(objId: string): void {
    for (const slab of this.slabs) {
      const i = slab.slots.indexOf(objId);
      if (i !== -1) {
        slab.slots[i] = null;
        if (this.state(slab) === "empty") {        // return memory to the OS
          this.slabs = this.slabs.filter((s) => s !== slab);
        }
        return;
      }
    }
  }
}`,
  },

  furtherReading: [
    {
      label: "Bonwick — The Slab Allocator: An Object-Caching Kernel Memory Allocator (USENIX 1994)",
      href: "https://www.usenix.org/conference/usenix-summer-1994-technical-conference/slab-allocator-object-caching-kernel",
      kind: "paper",
      note: "The original paper that introduced slab allocation in Solaris — readable and foundational.",
    },
    {
      label: "Slab allocation — Wikipedia",
      href: "https://en.wikipedia.org/wiki/Slab_allocation",
      kind: "article",
      note: "Concise overview of caches, slabs, slots, and the empty/partial/full states.",
    },
    {
      label: "Understanding the Linux VMM (Mel Gorman) — Ch. 8: Slab Allocator",
      href: "https://www.kernel.org/doc/gorman/html/understand/understand011.html",
      kind: "book",
      note: "Detailed, free walkthrough of caches, slabs, object coloring, and the slab lists.",
    },
    {
      label: "Linux kernel — Short users guide for SLUB",
      href: "https://docs.kernel.org/mm/slub.html",
      kind: "docs",
      note: "Official docs for Linux's default slab allocator (SLUB) — tuning, debugging, and how it differs from the classic SLAB.",
    },
    {
      label: "slabinfo(5) — Linux manual page",
      href: "https://man7.org/linux/man-pages/man5/slabinfo.5.html",
      kind: "docs",
      note: "What `/proc/slabinfo` reports — objsize, objperslab, pagesperslab. Inspect live caches on any running Linux box.",
    },
  ],

  quiz: [
    {
      id: "sl-q1",
      question: "Why is slab allocation O(1) with essentially no external fragmentation?",
      options: [
        { id: "a", label: "It rounds every request up to a power of two." },
        { id: "b", label: "Each cache holds fixed-size slots exactly sized for one object type, so allocation just claims a free slot — no size search, no splitting." },
        { id: "c", label: "It compacts memory after every free." },
        { id: "d", label: "It scans all holes to find the smallest fit." },
      ],
      correctOptionId: "b",
      explanation:
        "Because every slot in a cache is exactly the object's size, allocation is just grabbing a free slot (O(1)) and there's no leftover space between allocations to fragment.",
    },
    {
      id: "sl-q2",
      question: "When allocating, which slab does the allocator prefer to use?",
      options: [
        { id: "a", label: "A full slab." },
        { id: "b", label: "A brand-new slab, always." },
        { id: "c", label: "A partial slab first, then an empty one, and only grows a new slab if neither exists." },
        { id: "d", label: "The largest slab." },
      ],
      correctOptionId: "c",
      explanation:
        "Preferring partial slabs keeps memory dense and avoids committing new pages; an empty slab is the next choice, and growing a new slab from the page allocator is the last resort.",
    },
    {
      id: "sl-q3",
      question: "What is a key limitation of slab allocation?",
      options: [
        { id: "a", label: "It cannot free memory." },
        { id: "b", label: "It leaks cyclic references." },
        { id: "c", label: "It needs the object sizes known up front — one cache per type — so it doesn't suit arbitrary-sized requests." },
        { id: "d", label: "It produces large internal fragmentation by rounding to powers of two." },
      ],
      correctOptionId: "c",
      explanation:
        "Slab allocation is built for many same-sized objects and requires a pre-configured cache per type. Arbitrary-sized general allocation needs sized caches plus a fallback, not a single slab cache.",
    },
  ],
};
