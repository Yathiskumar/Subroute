import type { ConceptContent } from "@/lib/content/types";

export const nextFit: ConceptContent = {
  prototypeCaption:
    "Next Fit is First Fit with a memory: it keeps a **bookmark** at the last allocation and resumes scanning from there, **wrapping around** the end of memory back to the start. The '↻ resume here' marker shows where the next scan begins. Scenario **1 · Four-process run** shows allocations spreading forward instead of clustering at the front. Scenario **2 · The sliver trap** shows the rolling pointer still finding a home for the small final request.",

  overview: [
    {
      type: "p",
      text: "Next Fit is a small but pointed tweak to First Fit. First Fit always begins its scan at the start of memory, which means the front holes get visited — and split — over and over, while the average scan grows longer as the heap ages. Next Fit fixes this by keeping a **roving pointer**: it resumes each scan from wherever the *last* allocation landed, and only wraps back to the beginning if it hits the end without finding a fit.",
    },
    {
      type: "p",
      text: "The effect is that allocations **spread out** across memory rather than piling up at the front. The pointer sweeps forward like a clock hand, distributing requests around the address space. Each allocation is still 'first fit from the current position,' so it keeps First Fit's early-stop speed — but the starting point moves, so no single region bears the full scan burden.",
    },
    {
      type: "p",
      text: "Whether that's better depends on the workload. Spreading reduces the front-loading pathology and can shorten scans, but it also scatters allocations, which can hurt locality and sometimes fragments memory more evenly (and thus more pervasively). On the shared four-process workload Next Fit ends up with the same failure as First Fit — but a different heap *shape*, which is the real lesson.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The roving pointer" },
    {
      type: "ol",
      items: [
        "**Start where you left off.** Begin scanning from the saved bookmark — the position of the most recent allocation — not from the start of memory.",
        "**Take the first hole that fits**, just like First Fit, scanning forward.",
        "**Wrap around.** If you reach the end of memory without a fit, continue from address 0 and scan up to the bookmark. Only after a full loop with no fit does the request fail.",
        "**Move the bookmark.** When you place the request, save its position as the new starting point for the next allocation.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why wrap-around matters",
      text: "The wrap is what keeps Next Fit correct: without it, holes *behind* the pointer would be invisible and the allocator could fail spuriously while free space sat unused at low addresses. The scan is therefore a full circular sweep — at most O(n) — that just happens to *start* at the bookmark instead of at zero.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The trade for spreading",
      text: "Spreading allocations around memory has a cost: it tends to leave free space distributed in many medium holes rather than consolidated. Some studies find Next Fit fragments slightly worse than First Fit because it doesn't give low-address holes a chance to be refilled and coalesced. It also scatters related allocations, which can reduce cache and page locality.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When Next Fit fits" },
    {
      type: "ul",
      items: [
        "**The front of memory keeps filling with small holes under First Fit** — Next Fit's roving start avoids re-scanning that congested region every time.",
        "**You want allocations spread evenly** across the address space rather than concentrated at the front.",
        "**Allocation speed matters and the free list is long** — resuming mid-list keeps the common scan short.",
        "**Be wary if locality matters** — scattering related allocations across memory can hurt cache/page behavior; and the fragmentation profile is sometimes worse than plain First Fit. Measure on your workload.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "A common building block",
      text: "The roving-pointer idea shows up well beyond classic free-list allocators — it's the same insight behind the **Clock** page-replacement algorithm (a hand sweeping circularly through frames) and behind bump-pointer allocators that advance through an arena. 'Resume where you stopped, wrap when you reach the end' is a broadly reusable pattern.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Avoids front-loading** — doesn't repeatedly re-scan and split the low-address holes.",
      "**Fast** — keeps First Fit's early stop; the average scan can be shorter than First Fit's on an aged heap.",
      "**Even distribution** — allocations spread across the whole address space.",
      "**Simple** — one extra saved pointer on top of First Fit.",
    ],
    cons: [
      "**Can fragment more evenly (and thus more pervasively)** than First Fit on some workloads.",
      "**Hurts locality** — related allocations get scattered around memory.",
      "**Still external fragmentation** — wrapping doesn't conjure a hole big enough; large requests can still fail.",
      "**Outcome depends on history** — the same request can land in different places depending on where the bookmark is.",
    ],
  },

  handsOn: [
    {
      title: "01 · Follow the bookmark",
      body: "On scenario **1 · Four-process run**, step through and watch the '↻ resume here' marker. P1 (212K) is placed and the bookmark lands on it; P2's scan then *resumes* from there rather than restarting at address 0. Notice how each allocation pushes the bookmark forward — the scan never goes back to the front unless it wraps.",
    },
    {
      title: "02 · Compare the heap shape to First Fit",
      body: "Run scenario 1 to the end. Like First Fit, Next Fit fails **P4 (426K)** — 3 of 4 placed — but the *arrangement* of allocations is different: they're spread further across memory instead of clustered near the front. Open the First Fit page, run the same scenario, and compare where each process ended up. Same input, same failure, different shape.",
    },
    {
      title: "03 · Watch a wrap-around",
      body: "Switch to scenario **2 · The sliver trap** and step through. After the first two requests push the bookmark toward the end, the small final request resumes from there, finds no fit ahead, and **wraps back to the start** to land in the leftover near address 0. Watch for the 'Reached the end of memory — wrap back' narration. Use Restart and Auto to replay the sweep.",
    },
  ],

  code: {
    language: "typescript",
    filename: "next-fit.ts",
    code: `interface Hole { start: number; size: number; }

class NextFit {
  private last = 0; // roving bookmark: index to resume from

  alloc(holes: Hole[], request: number): number | null {
    const n = holes.length;
    for (let step = 0; step < n; step++) {
      const i = (this.last + step) % n;   // resume at bookmark, wrap with %
      if (holes[i].size >= request) {     // first fit from current position
        const addr = holes[i].start;
        const leftover = holes[i].size - request;
        if (leftover === 0) holes.splice(i, 1);
        else { holes[i].start += request; holes[i].size = leftover; }
        this.last = i;                    // save bookmark for next time
        return addr;
      }
    }
    return null;                          // full loop, no fit: fail
  }
}`,
  },

  furtherReading: [
    {
      label: "Wilson et al. — Dynamic Storage Allocation: A Survey and Critical Review",
      note: "Compares next-fit's roving pointer against first-fit, including its sometimes-worse fragmentation.",
    },
    {
      label: "Knuth, TAOCP Vol. 1 — Dynamic Storage Allocation (§2.5)",
      note: "Introduces the 'next fit' (roving pointer) variant of first fit.",
    },
    {
      label: "The Clock page-replacement algorithm",
      note: "The same circular-sweep idea applied to choosing which page to evict — worth comparing.",
    },
  ],

  quiz: [
    {
      id: "nf-q1",
      question: "How does Next Fit differ from First Fit?",
      options: [
        { id: "a", label: "It picks the smallest hole that fits." },
        { id: "b", label: "It resumes scanning from the last allocation's position and wraps around, instead of always starting at address 0." },
        { id: "c", label: "It scans the whole free list every time." },
        { id: "d", label: "It rounds requests to powers of two." },
      ],
      correctOptionId: "b",
      explanation:
        "Next Fit keeps a roving bookmark and starts each scan there, wrapping to the beginning if it reaches the end — spreading allocations forward instead of re-scanning the front each time.",
    },
    {
      id: "nf-q2",
      question: "Why must Next Fit wrap around to the start of memory?",
      options: [
        { id: "a", label: "To compact the heap." },
        { id: "b", label: "So holes behind the bookmark remain reachable; otherwise the allocator could fail spuriously while free space sits at low addresses." },
        { id: "c", label: "To increment a reference count." },
        { id: "d", label: "To merge adjacent holes." },
      ],
      correctOptionId: "b",
      explanation:
        "Without the wrap, holes before the current position would be invisible to the scan. Wrapping makes it a full circular sweep, so a request only fails after the whole list has been checked.",
    },
    {
      id: "nf-q3",
      question:
        "On the four-process workload, how does Next Fit's result compare to First Fit's?",
      options: [
        { id: "a", label: "It places all four where First Fit fails one." },
        { id: "b", label: "It fails P4 just like First Fit, but produces a different distribution of allocations across memory." },
        { id: "c", label: "It places fewer processes than First Fit." },
        { id: "d", label: "It is identical to Best Fit." },
      ],
      correctOptionId: "b",
      explanation:
        "Next Fit also fails the large P4 (3 of 4 placed), but because the bookmark spreads allocations forward, the heap ends up shaped differently than First Fit's front-clustered layout.",
    },
  ],
};
