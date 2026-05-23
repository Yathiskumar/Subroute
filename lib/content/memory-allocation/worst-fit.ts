import type { ConceptContent } from "@/lib/content/types";

export const worstFit: ConceptContent = {
  prototypeCaption:
    "Worst Fit is Best Fit inverted: it scans **every** hole and places the request in the **largest** one that fits, on the theory that the big leftover stays reusable. The marker tracks the 'largest so far'. Scenario **1 · Four-process run** shows the theory backfiring — carving the biggest holes early starves the later large request. Scenario **2 · The sliver trap** is the rare case where leaving big leftovers actually helps.",

  overview: [
    {
      type: "p",
      text: "Worst Fit makes the opposite gamble from Best Fit. Instead of the *smallest* hole that fits, it always carves the request from the **largest** available hole. The reasoning sounds almost clever: if you always cut from the biggest hole, the leftover is also big — and a big leftover is more likely to be useful to a future request than a tiny sliver.",
    },
    {
      type: "p",
      text: "It's a nice idea that mostly doesn't work. By always attacking the largest hole, Worst Fit systematically *destroys* the very large holes a program needs for its big allocations. After a few medium requests, there are no large holes left at all — so when a genuinely large request finally arrives, nothing can hold it, even though several medium holes (and plenty of total free space) remain.",
    },
    {
      type: "p",
      text: "Worst Fit shares Best Fit's cost — a full O(n) scan with no early stop — without sharing its occasional benefit. In practice it's the weakest of the four sequential fits, and it survives mainly as a teaching foil: the allocator that shows why 'leave large leftovers' is the wrong heuristic when your workload contains large requests.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Scan everything, keep the biggest" },
    {
      type: "ol",
      items: [
        "**Scan the entire free list.** Like Best Fit, there's no early stop — a larger hole could appear anywhere.",
        "**Track the largest fitting hole.** Among all holes that satisfy the request, remember the one with the greatest *size* (not the greatest leftover — though for a fixed request these rank identically).",
        "**Place in the largest hole.** Allocate from it and split off the (large) remainder, which goes back on the free list.",
        "**Or fail.** If no hole fit, the request fails. With Worst Fit, failures often happen on *large* requests precisely because the big holes were spent earlier on smaller ones.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Why it backfires",
      text: "The flaw is that large holes are a scarce, valuable resource — they're the only thing that can satisfy large requests. Worst Fit spends them indiscriminately, on small and large requests alike. A small request that could have fit in a small hole instead takes a bite out of the biggest hole, shrinking it. Repeat that a few times and the largest hole is now medium-sized, and the next big request has nowhere to go.",
    },
    {
      type: "callout",
      variant: "info",
      title: "When the intuition is actually right",
      text: "Worst Fit isn't *always* wrong. If your workload is dominated by small-to-medium requests of similar size and rarely sees a large one, spreading allocations across big holes can keep leftovers comfortably reusable and avoid slivers. The prototype's sliver-trap scenario shows exactly this case — there, leaving big leftovers lets a later small request succeed.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When (rarely) to consider Worst Fit" },
    {
      type: "ul",
      items: [
        "**Uniform, small-to-medium request sizes with no large outliers** — the one regime where big leftovers stay useful and slivers are avoided.",
        "**As a deliberate contrast in teaching or benchmarking** — Worst Fit is the clearest demonstration of how a plausible heuristic can be globally counterproductive.",
        "**Almost never as a general default** — if you have large requests in the mix (and most real workloads do), Worst Fit's habit of consuming big holes early is exactly the wrong behavior.",
        "**Prefer First Fit or a segregated free list** for general use; reach for Worst Fit only after measuring that your workload truly lacks large requests.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Best Fit and Worst Fit are two ends of one mistake",
      text: "Best Fit optimizes for the smallest leftover and breeds slivers; Worst Fit optimizes for the largest leftover and destroys big holes. Both fixate on the *leftover size* of a single allocation, which turns out to be the wrong thing to optimize. First Fit ignores leftover size entirely and, by not trying to be clever, usually wins.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Large leftovers** — the remainder of each allocation is sizeable and (sometimes) reusable.",
      "**Avoids slivers** — unlike Best Fit, it rarely creates tiny unusable holes.",
      "**Can help on uniform small-request workloads** — see the sliver-trap scenario.",
    ],
    cons: [
      "**Destroys large holes** — spends the scarce big holes on every request, large or small.",
      "**Fails large requests** — by the time a big request arrives, no big hole remains.",
      "**Full O(n) scan** every allocation, no early stop — same cost as Best Fit.",
      "**Generally the weakest sequential fit** — rarely the right choice in practice.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the big holes get eaten",
      body: "On scenario **1 · Four-process run**, step through and notice that P1 (212K) — a fairly small request — is carved out of the **600K** hole, the largest one, leaving 388K. The biggest hole in memory just got smaller to satisfy a small process. Keep stepping and watch the large holes steadily shrink.",
    },
    {
      title: "02 · See the large request starve",
      body: "Run scenario 1 to the end. **P4 (426K) fails** — only 3 of 4 placed — because Worst Fit already bit chunks out of every large hole on the earlier, smaller processes. There's plenty of free memory, but no single hole reaches 426K anymore. Compare with the Best Fit page, which fits all four by doing the opposite.",
    },
    {
      title: "03 · Find the case where it helps",
      body: "Switch to scenario **2 · The sliver trap**. Here Worst Fit places all three requests: by carving the 1000K and 1100K from the largest holes, the leftovers stay big enough that the final 250K request still fits. This is the narrow regime — no large request arrives late — where 'leave big leftovers' actually pays off. Use Restart to replay and contrast with Best Fit, which fails this scenario.",
    },
  ],

  code: {
    language: "typescript",
    filename: "worst-fit.ts",
    code: `interface Hole { start: number; size: number; }

/** Worst Fit: scan all holes, pick the largest one that fits. */
function worstFitAlloc(holes: Hole[], request: number): number | null {
  let worstIdx = -1;
  let largest = -1;

  for (let i = 0; i < holes.length; i++) {     // no early stop
    if (holes[i].size >= request && holes[i].size > largest) {
      largest = holes[i].size;                 // remember the biggest fitting hole
      worstIdx = i;
    }
  }
  if (worstIdx === -1) return null;            // nothing fit

  const hole = holes[worstIdx];
  const addr = hole.start;
  const leftover = hole.size - request;        // intentionally large
  if (leftover === 0) holes.splice(worstIdx, 1);
  else { hole.start += request; hole.size = leftover; }
  return addr;
}`,
  },

  furtherReading: [
    {
      label: "Operating System Concepts (Silberschatz) — Contiguous Memory Allocation",
      note: "Presents worst-fit alongside first/best fit and notes it tends to perform poorly.",
    },
    {
      label: "Wilson et al. — Dynamic Storage Allocation: A Survey and Critical Review",
      note: "Context on why leftover-size heuristics (both best and worst) underperform First Fit.",
    },
    {
      label: "Knuth, TAOCP Vol. 1 — Dynamic Storage Allocation (§2.5)",
      note: "Foundational analysis of placement policies and fragmentation.",
    },
  ],

  quiz: [
    {
      id: "wf-q1",
      question: "Which hole does Worst Fit choose for a request?",
      options: [
        { id: "a", label: "The smallest hole that fits." },
        { id: "b", label: "The largest hole that fits, after scanning all holes." },
        { id: "c", label: "The first hole that fits." },
        { id: "d", label: "The hole nearest the last allocation." },
      ],
      correctOptionId: "b",
      explanation:
        "Worst Fit selects the largest sufficient hole, on the theory that the large leftover remains reusable — which requires scanning the whole free list.",
    },
    {
      id: "wf-q2",
      question:
        "On the four-process workload, why does the large P4 request fail under Worst Fit?",
      options: [
        { id: "a", label: "P4 is larger than total memory." },
        { id: "b", label: "Worst Fit consumed chunks of the largest holes on earlier, smaller requests, leaving no single hole big enough for P4." },
        { id: "c", label: "Worst Fit reserves memory for the OS." },
        { id: "d", label: "P4 arrived before the holes were created." },
      ],
      correctOptionId: "b",
      explanation:
        "By always cutting from the biggest hole, Worst Fit shrinks the large holes on every request. When the big P4 arrives, the large holes it needed are already gone.",
    },
    {
      id: "wf-q3",
      question: "In what kind of workload can Worst Fit actually be reasonable?",
      options: [
        { id: "a", label: "Workloads with many large outlier requests." },
        { id: "b", label: "Workloads of uniform small-to-medium requests with no large requests, where big leftovers stay reusable." },
        { id: "c", label: "Workloads that never free memory." },
        { id: "d", label: "Workloads dominated by power-of-two sizes." },
      ],
      correctOptionId: "b",
      explanation:
        "Without large requests, spreading allocations across big holes keeps leftovers comfortably usable and avoids slivers — the regime shown by the prototype's sliver-trap scenario.",
    },
  ],
};
