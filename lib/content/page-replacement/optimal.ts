import type { ConceptContent } from "@/lib/content/types";

export const optimal: ConceptContent = {
  prototypeCaption:
    "Optimal **looks into the future**. On each fault it computes, for every resident page, the step where that page is next used — shown under each frame and as a dashed outline on the reference string ahead. It evicts the page whose next use is **furthest away** (or never). Step through and watch the lookahead drive each choice. This is the fewest faults any algorithm could possibly achieve.",

  overview: [
    {
      type: "p",
      text: "Optimal — also called **OPT**, **MIN**, or **Belady's algorithm** — answers a simple question perfectly: *of the pages in memory, which one won't be needed for the longest time?* Evict that one. If a page is never used again, it's the ideal victim.",
    },
    {
      type: "p",
      text: "This produces the **minimum possible number of page faults** for a given reference string and frame count. No real algorithm can do better. That makes Optimal incredibly useful — not as something you'd run, but as the **yardstick**. When you measure LRU or Clock, you compare against Optimal to see how much room is left.",
    },
    {
      type: "p",
      text: "The reason you can't actually use it is right there in the definition: it needs to know the future. A running program hasn't told you what it will reference next. So Optimal is computed offline, on a recorded trace, after the fact. Every practical policy is really an attempt to *guess* the future from the past.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The rule, step by step" },
    {
      type: "ol",
      items: [
        "**Page already in a frame?** Hit. Nothing to do — Optimal never needs to reorder on a hit.",
        "**Not in memory, free frame available?** Load it into the free frame.",
        "**Not in memory, all frames full?** For each resident page, scan the rest of the reference string to find its **next use**. Evict the page whose next use is furthest in the future. A page that's never used again wins (is evicted) immediately.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why furthest-future is provably optimal",
      text: "Intuitively: the page you won't need for the longest time is the one you can most afford to lose, because by the time you'd want it back, every other resident page will have already had its turn. Belady proved this rigorously in 1966. The key consequence for you: Optimal is a hard floor — if your policy's fault count equals Optimal's, you cannot improve it by being cleverer about eviction; you'd need more memory.",
    },
    {
      type: "p",
      text: "Optimal is also a **stack algorithm**, so it never suffers Belady's anomaly: giving it more frames can only reduce (or hold) the fault count, never increase it. Try the **Belady example** preset at 3 then 4 frames and watch faults behave sensibly — the opposite of FIFO.",
    },
  ],

  whenToUse: [
    { type: "h", text: "How it's actually used" },
    {
      type: "ul",
      items: [
        "**As the benchmark** — run Optimal on a captured trace to learn the best achievable fault rate, then judge real policies against it.",
        "**To size memory** — if even Optimal faults a lot at N frames, the problem is capacity, not policy; you need more RAM, not a smarter algorithm.",
        "**To sanity-check a simulator** — no policy should ever beat Optimal. If one does, there's a bug.",
        "**Never in a live system** — it requires future knowledge that a running program cannot provide. Treat it as theory, not implementation.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "The bridge to LRU",
      text: "Optimal looks *forward* to the next use. LRU looks *backward* to the last use and bets the future mirrors the past. That bet — the principle of locality — is why LRU, an implementable policy, often lands surprisingly close to the unbeatable one. Studying Optimal first makes LRU's logic obvious.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Provably minimal faults** — no algorithm can do better for the same memory.",
      "**The definitive benchmark** — gives every other policy a meaningful target.",
      "**No Belady's anomaly** — it's a stack algorithm; more frames never hurt.",
      "**Conceptually clarifying** — frames it as 'guess the future', which is what every real policy attempts.",
    ],
    cons: [
      "**Unimplementable online** — needs to know future references.",
      "**Requires the full trace** — only computable offline, after the fact.",
      "**Costly to compute naively** — scanning ahead for each resident page on every fault (though smarter implementations precompute next-use distances).",
      "**Not a product, only a measuring stick** — you can't ship it.",
    ],
  },

  handsOn: [
    {
      title: "01 · Read the lookahead",
      body: "Load the **Classic textbook** preset and step to the first fault that requires an eviction. Under each frame you'll see 'next @ step N' or 'not used again'. The decision card lists the lookahead for every resident page and marks which one is evicted. Confirm it always picks the largest 'next use' distance.",
    },
    {
      title: "02 · Spot the 'never used again' win",
      body: "Step through any preset until a resident page has no future use. The prototype marks it 'not used again' and evicts it on the very next fault, ahead of pages that will be needed. A page with no future is the perfect victim.",
    },
    {
      title: "03 · Race it against the others",
      body: "Note Optimal's total faults on the **Belady example** preset, then open the FIFO and LRU prototypes and run the same string and frame count. Optimal's fault count is the floor; see how close LRU gets and how far FIFO trails. Then raise Optimal to 4 frames — unlike FIFO, faults only drop.",
    },
  ],

  code: {
    language: "typescript",
    filename: "optimal.ts",
    code: `// Optimal (Belady's) page replacement — needs the full future trace.
function optimal(refs: number[], frames: number) {
  const resident: number[] = [];
  let faults = 0, hits = 0;

  // distance to the next use of \`page\`, searching from index \`from\`
  const nextUse = (page: number, from: number): number => {
    for (let k = from; k < refs.length; k++) if (refs[k] === page) return k;
    return Infinity;                         // never used again
  };

  refs.forEach((page, i) => {
    if (resident.includes(page)) { hits++; return; }   // hit
    faults++;
    if (resident.length < frames) { resident.push(page); return; } // free frame

    // evict the resident page whose next use is furthest in the future
    let victim = 0, best = -1;
    for (let f = 0; f < resident.length; f++) {
      const d = nextUse(resident[f], i + 1);
      if (d > best) { best = d; victim = f; }
    }
    resident[victim] = page;
  });

  return { faults, hits };                   // faults is the provable minimum
}`,
  },

  furtherReading: [
    {
      label: "Belady — A study of replacement algorithms for virtual storage (1966)",
      href: "https://ieeexplore.ieee.org/document/5388441",
      note: "The original IBM Systems Journal paper that introduced the MIN (Optimal) algorithm and proved it minimizes faults.",
      kind: "paper",
    },
    {
      label: "OSTEP — Beyond Physical Memory: Policies (Ch. 22)",
      href: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf",
      note: "Uses Optimal as 'the optimal policy' baseline and shows real policies catching up to it. The clearest treatment of why it's the yardstick.",
      kind: "book",
    },
    {
      label: "Wikipedia — Page replacement algorithm: The theoretically optimal policy",
      href: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#The_theoretically_optimal_page_replacement_algorithm",
      note: "Short, precise statement of the rule and why it's unimplementable in practice.",
      kind: "article",
    },
    {
      label: "Stack algorithms and Belady's anomaly",
      href: "https://en.wikipedia.org/wiki/B%C3%A9l%C3%A1dy%27s_anomaly",
      note: "Explains why Optimal and LRU are stack algorithms immune to the anomaly that bites FIFO — the property that makes 'more frames never hurt'.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "pr-opt-q1",
      question: "Which page does Optimal evict when memory is full?",
      options: [
        { id: "a", label: "The one loaded earliest." },
        { id: "b", label: "The one used least often so far." },
        { id: "c", label: "The one whose next use is furthest in the future (or never)." },
        { id: "d", label: "The one used least recently in the past." },
      ],
      correctOptionId: "c",
      explanation:
        "Optimal looks forward: the page you won't need for the longest time is the cheapest to lose. A page with no future use is evicted first of all.",
    },
    {
      id: "pr-opt-q2",
      question: "Why can't Optimal be used in a real running system?",
      options: [
        { id: "a", label: "It uses too much memory for its counters." },
        { id: "b", label: "It requires knowing future references, which a live program hasn't revealed yet." },
        { id: "c", label: "It suffers from Belady's anomaly." },
        { id: "d", label: "It only works with a single frame." },
      ],
      correctOptionId: "b",
      explanation:
        "The rule depends on each page's *next* use. Online, you don't know the future, so Optimal can only be computed offline on a recorded trace. Real policies approximate it by guessing the future from the past.",
    },
    {
      id: "pr-opt-q3",
      question: "What is the main practical value of Optimal?",
      options: [
        { id: "a", label: "It's the fastest algorithm to implement." },
        { id: "b", label: "It's a lower bound — the benchmark that tells you how good a real policy can possibly be." },
        { id: "c", label: "It guarantees no page is ever dirty when evicted." },
        { id: "d", label: "It eliminates the need for a reference bit." },
      ],
      correctOptionId: "b",
      explanation:
        "Optimal gives the minimum possible fault count. Comparing a real policy against it tells you whether to invest in a smarter algorithm (there's a gap to close) or more memory (even Optimal faults a lot).",
    },
  ],
};
