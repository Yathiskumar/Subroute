import type { ConceptContent } from "@/lib/content/types";

export const fifo: ConceptContent = {
  prototypeCaption:
    "Memory frames shown as a **FIFO queue**: pages enter at the right and leave from the left. Type a reference string, set the frame count, and step through. Each request is a **hit** (page already in a frame), a **fault into a free frame**, or a **fault that evicts the oldest page**. Try the **Belady's anomaly** preset, then raise the frame count and watch the faults go *up*.",

  overview: [
    {
      type: "p",
      text: "FIFO — First-In, First-Out — is the simplest replacement rule there is: **evict the page that has been in memory the longest.** Treat the frames as a queue. A new page joins the back; when you need space, you drop whatever is at the front, regardless of how useful it still is.",
    },
    {
      type: "p",
      text: "It's appealing because it needs almost no bookkeeping. You don't track how often a page is used or when it was last touched — just the order pages arrived. A single queue (or a pointer that wraps around the frames) is enough.",
    },
    {
      type: "p",
      text: "The catch is that *age is a bad proxy for usefulness*. A page loaded early might be the one your program hits on every iteration — a configuration table, a hot loop's data — yet FIFO will happily evict it just because it's old. That blind spot is why FIFO is mostly a teaching baseline and the starting point the other algorithms improve on.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The rule, step by step" },
    {
      type: "ol",
      items: [
        "**Page already in a frame?** It's a hit. Do nothing — FIFO doesn't even reorder the queue on a hit.",
        "**Not in memory, but a frame is free?** Load it into the free frame and put it at the back of the queue.",
        "**Not in memory and all frames full?** Evict the page at the front of the queue (the oldest), load the new page, and put it at the back.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Belady's anomaly: more memory, more faults",
      text: "You'd expect that giving a cache more frames can only help. For FIFO, that's not always true. On certain reference strings, going from 3 frames to 4 produces *more* page faults, not fewer. This is **Belady's anomaly**, and FIFO is the famous example. It happens because FIFO's eviction order isn't a 'stack' — the set of pages it keeps with 4 frames isn't guaranteed to be a superset of what it keeps with 3. LRU and Optimal are 'stack algorithms' and never suffer this. Run the prototype's **Belady's anomaly** preset at 3 frames, then bump it to 4.",
    },
    {
      type: "p",
      text: "Because FIFO ignores usage entirely, its worst case is brutal: a loop that cycles through slightly more pages than you have frames will fault on *every single access*, evicting each page just before it's needed again. The **Worst case** preset shows this.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When FIFO is enough" },
    {
      type: "ul",
      items: [
        "**As a baseline** — to measure how much smarter policies actually buy you. If LRU isn't beating FIFO on your workload, recency may not be a useful signal.",
        "**When metadata is genuinely too expensive** — in tiny embedded systems where you can't spare a bit per page or a timestamp, insertion order is free.",
        "**When access is roughly streaming** — if pages really are used once in arrival order (a sequential scan), FIFO and the fancy policies behave about the same.",
        "**Avoid it for looping or hot-page workloads** — anywhere a small working set is reused, FIFO will evict exactly the pages you're about to need.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Where you'll actually see it",
      text: "Pure FIFO is rare in production replacement, precisely because of its blind spot and Belady's anomaly. But it's the skeleton of **Second Chance** and **Clock**, which keep FIFO's cheap queue and add a single 'was this used recently?' bit to fix the worst of its mistakes. Understanding FIFO is the prerequisite for understanding those.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Dead simple** — a queue and nothing else; trivial to implement and reason about.",
      "**Minimal metadata** — no timestamps, counters, or usage bits.",
      "**O(1) per access** — enqueue/dequeue, no scanning.",
      "**Fair in one narrow sense** — every page gets exactly the same lifetime before eviction.",
    ],
    cons: [
      "**Ignores usage** — evicts hot pages just for being old.",
      "**Belady's anomaly** — adding frames can increase faults, which breaks intuition and capacity planning.",
      "**Terrible on loops** — can fault on every access when a working set barely exceeds memory.",
      "**Rarely competitive** — a single reference bit (Second Chance / Clock) beats it for nearly the same cost.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the queue evict the oldest",
      body: "Load the **Classic textbook** preset and step forward. Watch the 'next out' tag sit on the front (oldest) frame and the 'just in' tag on the back. Notice FIFO never reorders on a hit — a page that gets reused still ages out on schedule.",
    },
    {
      title: "02 · Reproduce Belady's anomaly",
      body: "Select the **Belady's anomaly** preset (it runs at 3 frames). Step to the end and note the total page faults. Now change the frame count to 4 and press Apply. Count the faults again — there are *more* with 4 frames than with 3. That's the anomaly: extra memory hurt FIFO.",
    },
    {
      title: "03 · Break it with a loop",
      body: "Run the **Worst case** preset (a 5-page loop in 3 frames). Every access is a fault — FIFO evicts each page one step before it's needed again. Then try the **Loop (warm cache)** preset, where the working set fits, and watch the fault rate collapse. Same algorithm, opposite outcome, decided entirely by whether the loop fits.",
    },
  ],

  code: {
    language: "typescript",
    filename: "fifo.ts",
    code: `// FIFO page replacement: evict the oldest-loaded page.
class FIFO {
  private frames: number;
  private resident = new Set<number>(); // pages currently in memory
  private queue: number[] = [];         // arrival order, front = oldest
  faults = 0;
  hits = 0;

  constructor(frames: number) { this.frames = frames; }

  access(page: number): "hit" | "fault" {
    if (this.resident.has(page)) {       // already in memory
      this.hits++;
      return "hit";                       // FIFO doesn't reorder on a hit
    }
    this.faults++;
    if (this.resident.size >= this.frames) {
      const victim = this.queue.shift()!; // evict the front (oldest)
      this.resident.delete(victim);
    }
    this.resident.add(page);
    this.queue.push(page);                // new page joins the back
    return "fault";
  }
}`,
  },

  furtherReading: [
    {
      label: "OSTEP — Beyond Physical Memory: Policies (Ch. 22)",
      href: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf",
      note: "Arpaci-Dusseau's free OS textbook chapter. FIFO, Optimal, LRU, and Clock compared on the same workloads — the ideal companion to this whole topic.",
      kind: "book",
    },
    {
      label: "Bélády, Nelson & Shedler — An anomaly in space-time characteristics (1969)",
      href: "https://dl.acm.org/doi/10.1145/363011.363155",
      note: "The original paper documenting Belady's anomaly for FIFO. Where the counterintuitive 'more frames, more faults' result was first shown.",
      kind: "paper",
    },
    {
      label: "Wikipedia — Page replacement algorithm: FIFO",
      href: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#First-in,_first-out",
      note: "Concise definition plus the link to Belady's anomaly and why FIFO is not a stack algorithm.",
      kind: "article",
    },
    {
      label: "GeeksforGeeks — Belady's Anomaly in Page Replacement",
      href: "https://www.geeksforgeeks.org/operating-systems/beladys-anomaly-in-page-replacement-algorithms/",
      note: "A worked numeric example of the anomaly with the exact reference string used in the prototype's preset.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "pr-fifo-q1",
      question: "On a page hit, what does FIFO do to its queue?",
      options: [
        { id: "a", label: "Moves the hit page to the back so it survives longer." },
        { id: "b", label: "Nothing — FIFO never reorders the queue on a hit." },
        { id: "c", label: "Moves the hit page to the front." },
        { id: "d", label: "Resets the page's reference counter." },
      ],
      correctOptionId: "b",
      explanation:
        "FIFO orders pages strictly by when they were loaded, not when they were used. A hit changes nothing about eviction order, which is exactly why a frequently-used page can still be evicted for being old.",
    },
    {
      id: "pr-fifo-q2",
      question: "What is Belady's anomaly?",
      options: [
        { id: "a", label: "FIFO can deadlock when all frames are dirty." },
        { id: "b", label: "Adding more frames can increase the number of page faults under FIFO." },
        { id: "c", label: "FIFO always produces more faults than Optimal." },
        { id: "d", label: "The reference bit can get stuck at 1 forever." },
      ],
      correctOptionId: "b",
      explanation:
        "For some reference strings, giving FIFO more frames produces more faults, not fewer. FIFO isn't a stack algorithm, so its larger-cache contents aren't a superset of its smaller-cache contents. LRU and Optimal never have this problem.",
    },
    {
      id: "pr-fifo-q3",
      question: "Why does FIFO perform so badly on a loop whose working set is one page larger than memory?",
      options: [
        { id: "a", label: "Because it evicts each page just before the loop comes back to it." },
        { id: "b", label: "Because it never evicts anything in a loop." },
        { id: "c", label: "Because the reference bits overflow." },
        { id: "d", label: "Because hits reset the queue order." },
      ],
      correctOptionId: "a",
      explanation:
        "In a tight loop that barely overflows memory, the oldest page is always the one needed next. FIFO evicts it one step too early, so every access faults — the worst-case behavior the prototype's 'Worst case' preset shows.",
    },
  ],
};
