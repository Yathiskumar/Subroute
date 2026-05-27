import type { ConceptContent } from "@/lib/content/types";

export const lfu: ConceptContent = {
  prototypeCaption:
    "Each resident page keeps a **reference count**, shown as a number and a bar. Every access bumps the count; a fresh page starts at 1. On a fault with no free frame, the page with the **smallest count** is evicted — ties broken by least-recently-used. Try the **Stale frequency** preset to watch a once-popular page refuse to leave long after it's gone cold.",

  overview: [
    {
      type: "p",
      text: "LFU — Least Frequently Used — bets on **popularity** instead of recency. Each page keeps a running count of how many times it's been referenced, and when something has to go, LFU evicts the page with the smallest count. The intuition: a page used many times is probably important and will be used again; a page used once was probably a fluke.",
    },
    {
      type: "p",
      text: "Where LRU asks *'when was this last used?'*, LFU asks *'how often has this been used?'*. For workloads with a stable set of hot pages — a few popular items everyone keeps requesting — frequency is a strong, stable signal that resists being knocked out by one-off accesses.",
    },
    {
      type: "p",
      text: "But frequency has a famous blind spot: it has **no sense of time**. A page that was hammered early in the program builds a huge count and then clings to memory forever, even if it's never touched again — because its count stays high while newer, genuinely-useful pages can't catch up. This 'cache pollution' by stale-but-popular pages is LFU's defining weakness.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The rule, step by step" },
    {
      type: "ol",
      items: [
        "**Page already resident?** Hit. Increment its count by one.",
        "**Not in memory, free frame available?** Load it with a starting count of 1.",
        "**Not in memory, all frames full?** Evict the page with the **smallest count**. If several tie for the smallest, break the tie by least-recently-used (evict the one not touched for longest).",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "The stale-frequency problem",
      text: "Imagine a page referenced 50 times during startup, then never again. Its count is 50. Meanwhile your current working set churns through pages that only ever reach counts of 2 or 3. Pure LFU will evict your live working set over and over while protecting the dead startup page, because 50 > 3. Frequency without decay measures *all-time* popularity, not *current* popularity. The prototype's **Stale frequency** preset shows this trap directly.",
    },
    {
      type: "p",
      text: "Real LFU implementations fix this with **aging** or **decay**: periodically halve all counts, or use a count that decays over time, so old popularity fades and recent popularity dominates. (This is the same insight that turned NFU into Aging.) Redis's LFU mode, for instance, uses a probabilistic counter with a decay term rather than a raw count. The bare LFU shown here omits decay so you can see exactly why it's needed.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When frequency is the right signal" },
    {
      type: "ul",
      items: [
        "**Stable, skewed popularity** — a small set of items accounts for most accesses and that set rarely changes (think a CDN serving a catalogue where a few assets dominate). Frequency captures this beautifully.",
        "**When recency misleads** — workloads where a page used heavily but not *just now* is still the right thing to keep; LRU would wrongly evict it, LFU won't.",
        "**Always pair it with decay in production** — raw LFU's stale-frequency trap makes some aging mechanism essentially mandatory for a long-running cache.",
        "**Avoid it for shifting working sets** — if the hot set changes over time, undecayed counts anchor the cache to the past and starve the present.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Where you'll see it",
      text: "**Redis** offers `allkeys-lfu` / `volatile-lfu` eviction with a built-in decay so old accesses fade. Hybrid policies like **ARC**, **2Q**, and **LFRU** combine recency and frequency to get the best of both (see the Cache Eviction topic). Pure, undecayed LFU is mostly a teaching device and a building block — but the *frequency* signal it isolates is everywhere in modern caches.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Captures popularity** — keeps a stable hot set even when single accesses churn around it.",
      "**Resists one-hit wonders** — a page touched once can't displace a genuinely popular page.",
      "**Strong on skewed workloads** — when a few items dominate access, frequency tracks them directly.",
      "**Simple core idea** — one counter per page, evict the minimum.",
    ],
    cons: [
      "**No sense of time** — stale-but-popular pages cling forever; the defining flaw.",
      "**Slow to adapt** — a new hot page starts at 1 and takes many accesses to overtake an old high count.",
      "**Needs decay to be practical** — usable long-running LFU requires aging the counts, adding complexity.",
      "**Tie-breaking and counter cost** — ties need a secondary rule (often LRU), and exact min-count eviction wants a careful data structure (e.g. buckets by frequency).",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch counts protect a popular page",
      body: "Load the **Frequency wins** preset and step through. The pages accessed repeatedly grow long bars (high counts) and survive, while pages touched once or twice get evicted first. On each eviction the decision card lists all counts sorted low-to-high and marks the smallest as the victim.",
    },
    {
      title: "02 · Fall into the stale-frequency trap",
      body: "Run **Stale frequency**: one page is hammered early (its bar shoots up), then never used again, while later pages cycle through with low counts. Watch LFU repeatedly evict the live, low-count pages and protect the dead high-count one. This is the exact failure that motivates decaying the counts.",
    },
    {
      title: "03 · See the LRU tie-breaker kick in",
      body: "Run **Tie → LRU**, where several pages share the same lowest count. When counts tie, LFU can't decide on frequency alone, so it evicts the least-recently-used among them. Read the decision card — it shows each tied page's 'last used' step and notes when the tie was broken by recency.",
    },
  ],

  code: {
    language: "typescript",
    filename: "lfu.ts",
    code: `// LFU: evict the smallest reference count; ties broken by least-recently-used.
interface Slot { page: number; freq: number; lastUsed: number; }

class LFU {
  private frames: number;
  private resident: Slot[] = [];
  private clock = 0;          // logical time for the LRU tie-break
  faults = 0; hits = 0;

  constructor(frames: number) { this.frames = frames; }

  access(page: number): "hit" | "fault" {
    this.clock++;
    const slot = this.resident.find((s) => s.page === page);
    if (slot) { slot.freq++; slot.lastUsed = this.clock; this.hits++; return "hit"; }
    this.faults++;
    if (this.resident.length >= this.frames) {
      // smallest freq wins; tie -> smallest lastUsed (least recently used)
      let victim = this.resident[0];
      for (const s of this.resident) {
        if (s.freq < victim.freq ||
           (s.freq === victim.freq && s.lastUsed < victim.lastUsed)) victim = s;
      }
      this.resident = this.resident.filter((s) => s !== victim);
    }
    this.resident.push({ page, freq: 1, lastUsed: this.clock }); // new page: count 1
    return "fault";
  }
}`,
  },

  furtherReading: [
    {
      label: "Wikipedia — Least Frequently Used",
      href: "https://en.wikipedia.org/wiki/Least_frequently_used",
      note: "The core LFU rule, the stale-frequency (cache pollution) problem, and the aging variants that fix it.",
      kind: "article",
    },
    {
      label: "Redis — Key eviction: the LFU policy and its decay",
      href: "https://redis.io/docs/latest/develop/reference/eviction/#the-new-lfu-mode",
      note: "How a production system implements LFU with a probabilistic, *decaying* counter to avoid the stale-frequency trap.",
      kind: "docs",
    },
    {
      label: "Shah, Mitra & Matani — An O(1) algorithm for LFU (2010)",
      href: "http://dhruvbird.com/lfu.pdf",
      note: "The data structure that makes exact LFU eviction O(1) using frequency buckets — the answer to 'how do you find the minimum count fast?'",
      kind: "paper",
    },
    {
      label: "Einziger, Friedman & Manes — TinyLFU: A Highly Efficient Cache Admission Policy",
      href: "https://arxiv.org/abs/1512.00727",
      note: "A modern, space-efficient frequency estimator (used by Caffeine) that combines LFU's signal with aging — where frequency-based caching went next.",
      kind: "paper",
    },
    {
      label: "LeetCode 460 — LFU Cache",
      href: "https://leetcode.com/problems/lfu-cache/",
      note: "Implement an O(1) LFU with the frequency-bucket structure yourself — the exercise that makes the counting and tie-breaking concrete.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "pr-lfu-q1",
      question: "Which page does LFU evict?",
      options: [
        { id: "a", label: "The one loaded earliest." },
        { id: "b", label: "The one used least recently." },
        { id: "c", label: "The one with the smallest reference count (ties broken by least-recently-used)." },
        { id: "d", label: "The one whose next use is furthest away." },
      ],
      correctOptionId: "c",
      explanation:
        "LFU evicts on frequency: the page referenced the fewest times. When counts tie, a secondary rule — here, least-recently-used — decides.",
    },
    {
      id: "pr-lfu-q2",
      question: "What is the stale-frequency problem in basic LFU?",
      options: [
        { id: "a", label: "Counts can overflow and wrap to zero." },
        { id: "b", label: "A page popular long ago keeps a high count and clings to memory forever, even after it stops being used, starving the current working set." },
        { id: "c", label: "Two pages can never have the same count." },
        { id: "d", label: "New pages are evicted before they're ever used." },
      ],
      correctOptionId: "b",
      explanation:
        "Raw counts measure all-time popularity, not current popularity. A page hammered early builds a count newer pages can't beat, so LFU protects the dead page and evicts live ones. Decaying the counts over time fixes it.",
    },
    {
      id: "pr-lfu-q3",
      question: "How do practical LFU implementations avoid clinging to stale-but-popular pages?",
      options: [
        { id: "a", label: "They cap the cache at one frame." },
        { id: "b", label: "They periodically decay or age the counts (e.g. halve them), so old popularity fades and recent popularity dominates." },
        { id: "c", label: "They switch to FIFO when memory is full." },
        { id: "d", label: "They never increment counts on a hit." },
      ],
      correctOptionId: "b",
      explanation:
        "Aging the counts — periodically halving them, or using a decaying counter as Redis does — makes the count reflect recent rather than all-time usage. It's the same fix that turned NFU into Aging.",
    },
  ],
};
