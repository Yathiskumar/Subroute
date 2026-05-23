import type { ConceptContent } from "@/lib/content/types";

export const bestFit: ConceptContent = {
  prototypeCaption:
    "Best Fit scans **every** free hole — no early stop — and remembers the **smallest** one that still fits, then places the request there to leave the least leftover. The blue marker tracks the 'best so far' as the scan proceeds. Scenario **1 · Four-process run** is the shared workload: Best Fit is the only fit strategy that places all four processes here. Scenario **2 · The sliver trap** shows the dark side — where minimizing leftover backfires into unusable slivers.",

  overview: [
    {
      type: "p",
      text: "Best Fit takes the opposite stance from First Fit: instead of grabbing the first hole that works, it inspects **every** free hole and chooses the **smallest one large enough** for the request. The intuition is appealing — by always using the tightest possible hole, you leave the smallest possible leftover, which feels like it should minimize wasted space.",
    },
    {
      type: "p",
      text: "Two costs come with that thoroughness. First, there's no early stop: every allocation scans the entire free list to be sure it found the *smallest* fit, so each request is O(n). Second — and this is the surprising part — minimizing the leftover of each individual allocation tends to make the heap *worse* overall, because the tiny leftovers it produces are frequently too small to ever be useful again.",
    },
    {
      type: "p",
      text: "Best Fit is the canonical example of a locally-optimal choice that's globally mediocre. It optimizes the wrong thing: the size of *this* leftover, rather than the long-run usability of the heap. In Knuth's classic simulations and in Wilson's survey, Best Fit and First Fit come out roughly comparable — and where they differ, First Fit is often the safer bet despite being simpler.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Scan everything, keep the tightest" },
    {
      type: "ol",
      items: [
        "**Scan the entire free list.** Visit every hole — you cannot stop early, because a tighter fit might appear later.",
        "**Track the best candidate.** For each hole that fits, compute the leftover (hole size − request). Keep the hole with the *smallest* leftover seen so far.",
        "**Place in the best hole.** After the full scan, allocate from the tightest fitting hole and split off the (minimal) remainder.",
        "**Or fail.** If no hole fit during the whole scan, the request fails — external fragmentation, same as any fit strategy.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "The sliver problem",
      text: "Because Best Fit always leaves the *smallest* possible remainder, it manufactures tiny holes — a few bytes or a few kilobytes — that are too small to satisfy almost any future request. These slivers pile up, clog the free list, and waste space that can never be reclaimed without compaction. Paradoxically, the strategy designed to minimize waste produces a peculiarly *useless* kind of waste.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Speeding it up with structure",
      text: "A naive Best Fit is O(n) per allocation. Real allocators that want best-fit behavior avoid the linear scan by keeping holes in a **size-ordered structure** — a balanced tree (giving O(log n) lookup of the smallest sufficient hole) or **segregated free lists** that bucket holes by size class. The policy is the same; the data structure removes the scan.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When Best Fit makes sense" },
    {
      type: "ul",
      items: [
        "**You genuinely need to pack tightly and can afford the bookkeeping** — e.g. an allocator backed by a size-ordered tree, where the 'smallest sufficient hole' query is cheap.",
        "**Requests cluster around a few sizes** — if leftovers tend to be either zero or large (not slivers), Best Fit's downside is muted.",
        "**You're optimizing a specific, measured workload** — don't reach for Best Fit on intuition; measure. Its theoretical appeal rarely survives contact with real allocation traces.",
        "**Avoid it as a naive default** — the linear scan plus the sliver problem means First Fit or a segregated list is almost always the better starting point.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "The lesson Best Fit teaches",
      text: "Best Fit is worth studying precisely because it's a trap: an algorithm whose name promises the best result and whose greedy local optimization delivers a mediocre global one. Whenever you're tempted to 'minimize waste at each step,' Best Fit is the cautionary tale — the metric you optimize per-operation is not always the metric that matters in aggregate.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Minimal leftover per allocation** — uses the tightest hole, so large holes are preserved for large requests.",
      "**Can place requests the other fits reject** — on the four-process workload it fits all four by saving big holes (see the prototype).",
      "**Conceptually clear objective** — 'smallest sufficient hole' is easy to state and reason about.",
    ],
    cons: [
      "**Slivers** — tiny, unusable leftover holes accumulate and waste space.",
      "**Full scan every time** — O(n) per allocation unless backed by a size-ordered structure.",
      "**Globally mediocre** — locally-optimal choice that often fragments the heap worse than First Fit over time.",
      "**Fragile to workload** — its advantage on one trace can become a failure on another (the sliver trap).",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the 'best so far' marker hunt",
      body: "On scenario **1 · Four-process run**, step through with Next and watch the blue 'best so far' marker jump as the scan finds tighter and tighter holes. For P1 (212K) it considers the 500K, 300K, and 600K holes and settles on the 300K one — the tightest fit. Notice it never stops early: every hole is inspected before placing.",
    },
    {
      title: "02 · See Best Fit succeed where First Fit fails",
      body: "Run scenario 1 to the end: all four processes are placed (4/4), unlike First, Worst, and Next Fit, which fail P4. The reason is on screen — by always taking the tightest hole, Best Fit never spends the big 600K hole early, so it's still there when P4 (426K) needs it. Compare the final 'Placed' stat against the First Fit page.",
    },
    {
      title: "03 · Spring the sliver trap",
      body: "Switch to scenario **2 · The sliver trap**. Best Fit places the 1000K request in the 1200K hole (leftover 200K) and the 1100K in the 1300K hole (leftover 200K) — minimal leftovers, just as designed. But now the small 250K request **fails**: both leftovers are 200K slivers, too small. Run the same scenario on the First Fit page (it succeeds) to feel the difference.",
    },
  ],

  code: {
    language: "typescript",
    filename: "best-fit.ts",
    code: `interface Hole { start: number; size: number; }

/** Best Fit: scan all holes, pick the one with the smallest sufficient size. */
function bestFitAlloc(holes: Hole[], request: number): number | null {
  let bestIdx = -1;
  let bestLeftover = Infinity;

  for (let i = 0; i < holes.length; i++) {       // no early stop
    if (holes[i].size >= request) {
      const leftover = holes[i].size - request;
      if (leftover < bestLeftover) {             // tighter fit found
        bestLeftover = leftover;
        bestIdx = i;
      }
    }
  }
  if (bestIdx === -1) return null;               // nothing fit

  const hole = holes[bestIdx];
  const addr = hole.start;
  if (bestLeftover === 0) holes.splice(bestIdx, 1);
  else { hole.start += request; hole.size = bestLeftover; } // leaves the smallest sliver
  return addr;
}`,
  },

  furtherReading: [
    {
      label: "OSTEP — Free-Space Management (Chapter 17)",
      href: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf",
      kind: "book",
      note: "Free chapter from *Operating Systems: Three Easy Pieces* — works best fit through a concrete example and shows the sliver problem directly.",
    },
    {
      label: "Wilson et al. — Dynamic Storage Allocation: A Survey and Critical Review",
      href: "https://www.cs.hmc.edu/~oneill/gc-library/Wilson-Alloc-Survey-1995.pdf",
      kind: "paper",
      note: "Explains why best-fit's intuitive appeal doesn't hold up, and the role of slivers.",
    },
    {
      label: "Knuth — The Art of Computer Programming, Vol. 1 (§2.5)",
      href: "https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming",
      kind: "book",
      note: "Where best-fit and first-fit were first compared head-to-head in simulation.",
    },
    {
      label: "Memory management (operating systems) — Wikipedia",
      href: "https://en.wikipedia.org/wiki/Memory_management_(operating_systems)",
      kind: "article",
      note: "Side-by-side summary of best/first/worst fit and their fragmentation behavior.",
    },
    {
      label: "Operating System Concepts (Silberschatz) — Contiguous Memory Allocation",
      kind: "book",
      note: "Textbook comparison of best/first/worst fit and the fragmentation each produces.",
    },
  ],

  quiz: [
    {
      id: "bf-q1",
      question: "How does Best Fit choose which hole to allocate from?",
      options: [
        { id: "a", label: "The first hole big enough, stopping early." },
        { id: "b", label: "The largest hole available." },
        { id: "c", label: "The smallest hole that is still large enough, after scanning all holes." },
        { id: "d", label: "A random hole that fits." },
      ],
      correctOptionId: "c",
      explanation:
        "Best Fit inspects every hole and selects the one leaving the smallest leftover — which requires a full scan, since a tighter fit could appear anywhere in the list.",
    },
    {
      id: "bf-q2",
      question: "What is the characteristic downside of Best Fit's strategy?",
      options: [
        { id: "a", label: "It rounds requests up to powers of two." },
        { id: "b", label: "It produces tiny leftover slivers that are too small to reuse." },
        { id: "c", label: "It cannot handle cyclic references." },
        { id: "d", label: "It always leaves the largest possible leftover." },
      ],
      correctOptionId: "b",
      explanation:
        "By minimizing each leftover, Best Fit creates many tiny holes that future requests can't use — a self-defeating form of fragmentation despite the goal of minimizing waste.",
    },
    {
      id: "bf-q3",
      question:
        "On the shared four-process workload, why does Best Fit place all four processes while First Fit fails P4?",
      options: [
        { id: "a", label: "Best Fit compacts memory between allocations." },
        { id: "b", label: "Best Fit uses the tightest hole each time, so the large 600K hole is preserved for the large P4." },
        { id: "c", label: "Best Fit allocates P4 first." },
        { id: "d", label: "Best Fit ignores small processes." },
      ],
      correctOptionId: "b",
      explanation:
        "Because Best Fit always carves from the tightest hole, it never spends the big 600K hole on a small request — so it's still available when the 426K P4 arrives, which First Fit had already consumed.",
    },
  ],
};
