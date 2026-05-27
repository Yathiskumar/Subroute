import type { ConceptContent } from "@/lib/content/types";

export const nru: ConceptContent = {
  prototypeCaption:
    "NRU classifies pages by two bits — **R** (referenced) and **M** (modified/dirty) — into four classes, colored from best-to-evict (Class 0: clean & cold) to worst (Class 3: dirty & hot). Add a `w` suffix to a reference to make it a write (sets M). A periodic **clock tick** clears all R bits. On a fault, NRU evicts any page from the lowest non-empty class. Watch the classes shift as ticks fire and writes dirty pages.",

  overview: [
    {
      type: "p",
      text: "NRU — Not Recently Used — sorts pages into four buckets using two bits the hardware already maintains, then evicts from the cheapest bucket. It's a coarse policy, but it captures two things that matter: whether a page was **used recently**, and whether it's **dirty** (modified and not yet written back to disk).",
    },
    {
      type: "p",
      text: "The dirty bit is the new idea here. Evicting a clean page is cheap — its copy on disk is already current, so you just drop it. Evicting a dirty page is expensive — you must first **write it back** to disk. So all else equal, NRU prefers to evict clean pages and spare dirty ones, saving disk writes.",
    },
    {
      type: "p",
      text: "Each page carries a **referenced bit (R)**, set on any access, and a **modified bit (M)**, set on a write. Those two bits give four classes, and NRU's whole policy is: *evict any page from the lowest-numbered non-empty class.* Simple to compute, and it respects both recency and the cost of eviction.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The four classes" },
    {
      type: "ul",
      items: [
        "**Class 0 — not referenced, not modified** (clean & cold): the ideal victim. Unused recently *and* cheap to drop.",
        "**Class 1 — not referenced, but modified** (dirty & cold): unused recently, but evicting it costs a writeback.",
        "**Class 2 — referenced, not modified** (clean & hot): used recently, so probably wanted again, but cheap to drop.",
        "**Class 3 — referenced and modified** (dirty & hot): used recently *and* expensive to evict — the worst choice.",
      ],
    },
    { type: "h", text: "The rule, step by step" },
    {
      type: "ol",
      items: [
        "**Periodically, a clock tick clears every page's R bit.** This is what makes 'recently' mean something — without it, R would saturate at 1 forever. The M bit is *not* cleared on a tick; it stays set until the page is written back.",
        "**On a reference:** set R = 1. If it's a write, also set M = 1.",
        "**On a fault with a free frame:** load the page (R = 1, M = 1 if it was a write).",
        "**On a fault with no free frame:** classify all resident pages by (R, M), then evict any page from the **lowest non-empty class**. If it was dirty, write it back first.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Note the counterintuitive ordering",
      text: "Class 1 (dirty & cold) ranks *below* Class 2 (clean & hot) — NRU would rather evict a modified-but-unused page than a clean-but-recently-used one. The reasoning: recency is a stronger predictor of future use than dirtiness, so it prefers to keep the hot page even though the cold dirty page is cheaper to drop. The writeback is a one-time cost; faulting a hot page back in could happen repeatedly. The prototype colors the classes so you can watch this play out.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When NRU fits" },
    {
      type: "ul",
      items: [
        "**When writeback cost matters** — if dirty pages are expensive to evict (slow disk, network storage), NRU's preference for clean victims directly cuts write traffic.",
        "**When you want cheap, good-enough** — two hardware bits and a periodic tick give a respectable policy with almost no per-access work.",
        "**As the model for 'use the dirty bit'** — NRU is the canonical example of folding eviction *cost* into the decision, not just predicted usefulness.",
        "**Not when you need fine recency** — NRU's notion of 'recent' is binary and reset in bulk by the tick; Aging or LRU track recency far more precisely.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "NRU vs Clock",
      text: "Clock uses one bit (R) and a sweep. NRU adds the second bit (M) and replaces the sweep with a one-shot classification into four buckets. Real systems often combine the ideas: a Clock sweep that also consults the dirty bit, preferring to evict clean pages on the first pass and dirty ones only on a second. NRU is the clean conceptual version of that 'respect the dirty bit' instinct.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Respects writeback cost** — prefers clean victims, cutting disk writes.",
      "**Very cheap** — two bits per page plus a periodic tick; no per-access counters.",
      "**Uses hardware bits directly** — R and M are maintained by the MMU on most architectures.",
      "**Easy to understand and implement** — four buckets, pick from the lowest.",
    ],
    cons: [
      "**Coarse recency** — 'recently used' is one bit, reset wholesale by the tick; no gradation.",
      "**Arbitrary within a class** — it picks *any* page from the lowest class, so two pages in the same class are indistinguishable.",
      "**Tick period is a tuning knob** — too frequent and everything looks cold; too rare and everything looks hot.",
      "**Beaten on quality by finer policies** — Aging and LRU make better choices when you can afford the bookkeeping.",
    ],
  },

  handsOn: [
    {
      title: "01 · See all four classes at once",
      body: "Load the **All four classes** preset and step through. The frames are colored by class (0–3), and the legend below maps each color to its (R, M) meaning. On an eviction, the decision card lists every class's members and marks which class the victim came from — always the lowest non-empty one.",
    },
    {
      title: "02 · Watch a clock tick cool everything down",
      body: "Every few steps a **clock tick** fires (you set the period with 'Tick every'). Step onto a tick row — it's highlighted, and the banner says 'all R bits cleared'. Notice pages drop from the hot classes (2, 3) to the cold ones (0, 1) instantly. The M bits stay put: a dirty page stays dirty until it's written back.",
    },
    {
      title: "03 · Make writebacks happen",
      body: "Run the **Write heavy** preset (lots of `w` suffixes). Watch the 'Writebacks' stat climb each time NRU is forced to evict a dirty page (Class 1 or 3) — those evictions cost a disk write. Compare with the **Read only** preset, where M stays 0 everywhere and writebacks never happen.",
    },
  ],

  code: {
    language: "typescript",
    filename: "nru.ts",
    code: `// NRU: classify by (R, M) bits, evict from the lowest non-empty class.
interface Slot { page: number; r: 0 | 1; m: 0 | 1; }

class NRU {
  private slots: (Slot | null)[];
  faults = 0; hits = 0; writebacks = 0;

  constructor(frames: number) { this.slots = Array(frames).fill(null); }

  tick() { for (const s of this.slots) if (s) s.r = 0; } // clear R, keep M

  access(page: number, write = false): "hit" | "fault" {
    const slot = this.slots.find((s) => s?.page === page);
    if (slot) { slot.r = 1; if (write) slot.m = 1; this.hits++; return "hit"; }
    this.faults++;
    const free = this.slots.indexOf(null);
    if (free >= 0) { this.slots[free] = { page, r: 1, m: write ? 1 : 0 }; return "fault"; }

    // class = (R << 1) | M; evict any page from the lowest non-empty class
    let victim = 0, bestClass = 4;
    this.slots.forEach((s, i) => {
      const cls = (s!.r << 1) | s!.m;
      if (cls < bestClass) { bestClass = cls; victim = i; }
    });
    if (this.slots[victim]!.m === 1) this.writebacks++;   // dirty: write back
    this.slots[victim] = { page, r: 1, m: write ? 1 : 0 };
    return "fault";
  }
}`,
  },

  furtherReading: [
    {
      label: "Wikipedia — Page replacement algorithm: Not recently used",
      href: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#Not_recently_used",
      note: "Defines the four (R, M) classes and the periodic clearing of the referenced bit.",
      kind: "article",
    },
    {
      label: "Tanenbaum & Bos — Modern Operating Systems (Ch. 3)",
      href: "https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003311/",
      note: "The standard textbook source for NRU's four classes and why dirty pages are costlier to evict than clean ones.",
      kind: "book",
    },
    {
      label: "OSDev Wiki — Paging and the accessed/dirty bits",
      href: "https://wiki.osdev.org/Paging",
      note: "Shows where the R (accessed) and M (dirty) bits actually live in x86 page-table entries — the hardware NRU reads.",
      kind: "docs",
    },
    {
      label: "GeeksforGeeks — Not Recently Used (NRU) page replacement",
      href: "https://www.geeksforgeeks.org/operating-systems/not-recently-used-nru-page-replacement-algorithm/",
      note: "A worked example with the bit transitions and class assignments stepped out explicitly.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "pr-nru-q1",
      question: "What do the two bits NRU tracks represent?",
      options: [
        { id: "a", label: "Referenced (R) and modified/dirty (M)." },
        { id: "b", label: "Read count and write count." },
        { id: "c", label: "Age in seconds and frequency." },
        { id: "d", label: "Whether the page is locked and whether it's shared." },
      ],
      correctOptionId: "a",
      explanation:
        "R is set on any access; M is set on a write. The four combinations form the four classes NRU evicts from, lowest class first.",
    },
    {
      id: "pr-nru-q2",
      question: "Why does NRU rank Class 1 (dirty & cold) below Class 2 (clean & hot) for eviction?",
      options: [
        { id: "a", label: "Because dirty pages are always safe to drop." },
        { id: "b", label: "Because recency predicts future use more strongly than dirtiness; it would rather pay one writeback than risk re-faulting a hot page repeatedly." },
        { id: "c", label: "Because clean pages can never be evicted." },
        { id: "d", label: "Because Class 2 pages are older." },
      ],
      correctOptionId: "b",
      explanation:
        "A writeback is a one-time cost, but evicting a recently-used page risks faulting it back in again and again. NRU keeps the hot page and accepts the writeback on the cold dirty one.",
    },
    {
      id: "pr-nru-q3",
      question: "What does the periodic clock tick do, and what does it deliberately leave alone?",
      options: [
        { id: "a", label: "Clears all M bits but keeps R bits." },
        { id: "b", label: "Clears all R bits but leaves M bits set, so 'recently used' stays meaningful while dirtiness persists until writeback." },
        { id: "c", label: "Evicts every Class 0 page." },
        { id: "d", label: "Resets both R and M to 0 for every page." },
      ],
      correctOptionId: "b",
      explanation:
        "Clearing R periodically is what gives 'recently' a time window. M must persist — a page stays dirty until it's actually written back to disk — so the tick never clears it.",
    },
  ],
};
