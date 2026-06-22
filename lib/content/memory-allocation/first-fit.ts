import type { ConceptContent } from "@/lib/content/types";

export const firstFit: ConceptContent = {
  prototypeCaption:
    "Memory is a strip of reserved regions and **free holes**. A process arrives needing some space; First Fit scans the holes **left to right** and grabs the **first** one big enough, splitting it and leaving the remainder free. Step through with Prev / Next / Auto. Scenario **1 · Four-process run** uses the canonical workload shared across all four fit strategies — watch whether the big 600K hole survives for P4. Scenario **2 · The sliver trap** shows where First Fit's speed pays off.",

  overview: [
    {
      type: "p",
      text: "First Fit is the simplest allocation policy that actually works well. Keep a list of free **holes** in memory. When a request for *n* bytes arrives, walk the list from the beginning and hand back the **first hole that is at least *n* bytes**. If the hole is bigger than needed, carve off the front, give that to the request, and leave the remainder as a smaller free hole. If you reach the end without finding one, the allocation fails — even if the *total* free space exceeds *n*.",
    },
    {
      type: "p",
      text: "That last sentence is the whole drama of dynamic allocation. Free memory is rarely contiguous; it's a patchwork of holes left behind as variable-sized objects come and go. A request can fail not because memory is exhausted but because no *single* hole is large enough. This is **external fragmentation**, and every sequential-fit strategy is really just a different bet about how to keep the holes usable.",
    },
    {
      type: "p",
      text: "First Fit's bet is the laziest possible one: *don't think, just take the first thing that fits.* It sounds careless, but decades of study (and Knuth's own simulations) found it's one of the best general policies — fast because it stops scanning early, and it tends to leave larger holes toward the end of memory where bigger requests can still land.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The scan-and-split loop" },
    {
      type: "ol",
      items: [
        "**Walk the free list from the start.** Visit each hole in address order, skipping reserved regions.",
        "**Stop at the first hole that fits.** The instant you find a hole of size ≥ the request, you're done scanning — no need to look further. This early stop is why First Fit is fast.",
        "**Split the hole.** Give the request the front of the hole. If anything is left over, that remainder becomes a new, smaller free hole sitting right after the allocation.",
        "**Or fail.** If the scan reaches the end with no hole big enough, the request fails — report external fragmentation, even though free memory in total may dwarf the request.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "The free list, and why order matters",
      text: "Allocators keep free holes in a linked list. First Fit traditionally keeps that list sorted by **address**, so the scan always starts at low memory. A consequence: small allocations pile up near the front, and the front of memory slowly fills with little holes the scan has to step over every time — the average scan gets longer as the heap ages. (A variant, **Next Fit**, fixes exactly this by resuming where the last scan left off.)",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Splitting creates the fragments",
      text: "Every time a hole is bigger than the request, the leftover becomes a new hole. Over thousands of allocations, big holes get whittled into smaller and smaller pieces. The allocator isn't doing anything wrong — splitting is unavoidable when requests don't exactly match holes — but it's the mechanism by which a healthy heap slowly fragments.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When First Fit is the right call" },
    {
      type: "ul",
      items: [
        "**You want a simple, fast general-purpose allocator** — First Fit is the sensible default. It's easy to implement, it stops scanning early, and in practice it performs about as well as the more elaborate fits.",
        "**Allocation latency matters more than squeezing out the last byte** — early termination keeps the common case cheap.",
        "**Your workload is a mix of sizes** — First Fit handles variety gracefully and tends to preserve large holes at higher addresses for the occasional big request.",
        "**Be cautious when the front of memory fills with tiny holes** — scan time creeps up as the heap ages. If you see that, reach for Next Fit (resume the scan) or a segregated free list (bucket holes by size).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world note",
      text: "Production `malloc` implementations don't run a naive single-list First Fit, but the *idea* is everywhere: glibc's allocator, for instance, uses size-segregated bins and within them does a fit search. First Fit (and its cousin Next Fit) is the conceptual core you'd reach for inside a custom arena, a simple embedded allocator, or a teaching implementation.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Fast** — stops at the first match instead of scanning the whole list.",
      "**Simple** to implement and reason about.",
      "**Performs well in practice** — empirically competitive with or better than Best Fit on real workloads.",
      "**Preserves large holes** at higher addresses for bigger requests that arrive later.",
    ],
    cons: [
      "**External fragmentation** — splitting leaves the heap dotted with holes that may be too small to reuse.",
      "**Front-loading** — small holes accumulate near the start, lengthening the average scan as the heap ages.",
      "**No size awareness** — it may carve a big hole for a small request when a tighter hole sat further along (the problem Best Fit tries to solve).",
      "**Worst-case O(n)** scan over the free list per allocation.",
    ],
  },

  handsOn: [
    {
      title: "01 · Run the four-process workload",
      body: "On scenario **1 · Four-process run**, step through with Next. Watch First Fit place P1 (212K) in the 500K hole — the first that fits — even though tighter holes exist. By the time **P4 (426K)** arrives, the holes have been split down and P4 fails, despite plenty of total free memory. Note the 'Free' stat staying high while the allocation still fails: that's external fragmentation in one screen.",
    },
    {
      title: "02 · Compare against Best Fit on the same input",
      body: "This exact workload is shared by all four fit pages. Remember First Fit's result (P4 fails, 3 of 4 placed), then open the Best Fit page and run scenario 1 there. Best Fit places all four — because First Fit spent the 500K hole on P1 while Best Fit saved larger holes. Same input, different policy, different outcome.",
    },
    {
      title: "03 · See where First Fit wins — the sliver trap",
      body: "Switch to scenario **2 · The sliver trap** and step through. Here First Fit places all three requests, while Best Fit (try it on its page) fails the small final request. First Fit's habit of grabbing the first roomy hole leaves a usable leftover; Best Fit's precision manufactures slivers too small to use. Use Restart and Auto to replay both.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "first_fit.go",
      code: `package alloc

type Hole struct {
	Start int
	Size  int
}

// FirstFitAlloc returns the first hole large enough, splitting it.
// It returns the allocated address and ok=false on failure.
func FirstFitAlloc(holes *[]Hole, request int) (int, bool) {
	h := *holes
	for i := 0; i < len(h); i++ {
		if h[i].Size >= request { // first one that fits — stop here
			addr := h[i].Start
			leftover := h[i].Size - request
			if leftover == 0 {
				*holes = append(h[:i], h[i+1:]...) // exact fit: remove the hole
			} else {
				h[i].Start += request // shrink the hole from the front
				h[i].Size = leftover  // remainder stays free
			}
			return addr, true // address handed to the request
		}
	}
	return 0, false // external fragmentation: no single hole fits
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "FirstFit.java",
      code: `import java.util.List;

class Hole {
    int start, size;
    Hole(int start, int size) { this.start = start; this.size = size; }
}

class FirstFit {
    /** First Fit: return the first hole large enough, splitting it. Returns null on failure. */
    static Integer firstFitAlloc(List<Hole> holes, int request) {
        for (int i = 0; i < holes.size(); i++) {
            Hole hole = holes.get(i);
            if (hole.size >= request) {        // first one that fits — stop here
                int addr = hole.start;
                int leftover = hole.size - request;
                if (leftover == 0) {
                    holes.remove(i);           // exact fit: remove the hole
                } else {
                    hole.start += request;     // shrink the hole from the front
                    hole.size = leftover;      // remainder stays free
                }
                return addr;                   // address handed to the request
            }
        }
        return null;                           // external fragmentation: no single hole fits
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "first_fit.py",
      code: `from dataclasses import dataclass


@dataclass
class Hole:
    start: int
    size: int


def first_fit_alloc(holes: list[Hole], request: int) -> int | None:
    """First Fit: return the first hole large enough, splitting it."""
    for i, hole in enumerate(holes):
        if hole.size >= request:        # first one that fits — stop here
            addr = hole.start
            leftover = hole.size - request
            if leftover == 0:
                del holes[i]            # exact fit: remove the hole
            else:
                hole.start += request   # shrink the hole from the front
                hole.size = leftover    # remainder stays free
            return addr                 # address handed to the request
    return None                         # external fragmentation: no single hole fits`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "first_fit.cpp",
      code: `#include <optional>
#include <vector>

struct Hole {
    int start;
    int size;
};

// First Fit: return the first hole large enough, splitting it.
std::optional<int> firstFitAlloc(std::vector<Hole>& holes, int request) {
    for (std::size_t i = 0; i < holes.size(); ++i) {
        Hole& hole = holes[i];
        if (hole.size >= request) {            // first one that fits — stop here
            int addr = hole.start;
            int leftover = hole.size - request;
            if (leftover == 0) {
                holes.erase(holes.begin() + i); // exact fit: remove the hole
            } else {
                hole.start += request;          // shrink the hole from the front
                hole.size = leftover;           // remainder stays free
            }
            return addr;                        // address handed to the request
        }
    }
    return std::nullopt;                         // external fragmentation: no single hole fits
}`,
    },
  ],

  furtherReading: [
    {
      label: "OSTEP — Free-Space Management (Chapter 17)",
      href: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf",
      kind: "book",
      note: "A free, superb chapter from *Operating Systems: Three Easy Pieces* — first/best/worst/next fit, splitting, and coalescing, all with worked examples. Start here.",
    },
    {
      label: "Wilson et al. — Dynamic Storage Allocation: A Survey and Critical Review",
      href: "https://www.cs.hmc.edu/~oneill/gc-library/Wilson-Alloc-Survey-1995.pdf",
      kind: "paper",
      note: "The definitive survey; explains why First Fit holds up so well against fancier policies in practice.",
    },
    {
      label: "Knuth — The Art of Computer Programming, Vol. 1 (§2.5)",
      href: "https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming",
      kind: "book",
      note: "The original analysis of first-fit vs. best-fit, including the famous fifty-percent rule.",
    },
    {
      label: "Memory management (operating systems) — Wikipedia",
      href: "https://en.wikipedia.org/wiki/Memory_management_(operating_systems)",
      kind: "article",
      note: "A quick reference on partition-allocation strategies and external fragmentation.",
    },
    {
      label: "Operating System Concepts (Silberschatz) — Contiguous Memory Allocation",
      kind: "book",
      note: "The classic OS textbook's treatment of first/best/worst fit and external fragmentation.",
    },
  ],

  quiz: [
    {
      id: "ff-q1",
      question: "What does First Fit do the moment it finds a hole large enough for the request?",
      options: [
        { id: "a", label: "Keeps scanning to find a tighter hole." },
        { id: "b", label: "Stops scanning and allocates from that hole, splitting off any remainder." },
        { id: "c", label: "Merges it with neighboring holes first." },
        { id: "d", label: "Picks the largest hole seen so far." },
      ],
      correctOptionId: "b",
      explanation:
        "First Fit terminates at the first fitting hole — that early stop is the source of its speed. It allocates from that hole and leaves any leftover as a smaller free hole.",
    },
    {
      id: "ff-q2",
      question:
        "A request for 426K fails even though 959K is free in total. What is this called?",
      options: [
        { id: "a", label: "Internal fragmentation." },
        { id: "b", label: "Thrashing." },
        { id: "c", label: "External fragmentation — free space exists but no single hole is big enough." },
        { id: "d", label: "A memory leak." },
      ],
      correctOptionId: "c",
      explanation:
        "External fragmentation is free memory scattered across holes too small to satisfy a request individually. Total free space can far exceed the request and it still fails.",
    },
    {
      id: "ff-q3",
      question:
        "Why do small holes tend to accumulate near the start of memory under First Fit?",
      options: [
        { id: "a", label: "Because the OS reserves the front for itself." },
        { id: "b", label: "Because the scan always starts at low addresses, so early holes are split repeatedly while higher ones stay intact." },
        { id: "c", label: "Because large requests are always placed first." },
        { id: "d", label: "Because First Fit sorts holes by size." },
      ],
      correctOptionId: "b",
      explanation:
        "Starting every scan at the lowest address means the front holes are revisited and split first, slowly filling the front with slivers and lengthening the average scan — exactly what Next Fit avoids.",
    },
  ],
};
