import type { ConceptContent } from "@/lib/content/types";

export const clock: ConceptContent = {
  prototypeCaption:
    "Six slots arranged in a ring. A single hand rotates around looking for an eviction victim. Each slot shows the key and its reference bit (0 or 1). Hits flip the bit to 1; on a miss, the hand walks the ring, clearing any 1 → 0 (a 'second chance'), and evicts the first slot whose bit was already 0.",

  overview: [
    {
      type: "p",
      text: "Clock — sometimes called **Second Chance** — is the policy you reach for when you want LRU's behavior but you can't afford LRU's bookkeeping. Instead of moving an entry to the front of a list on every access, Clock just sets a single 'recently-used' bit. Eviction is a circular sweep: the hand walks the ring, and any entry whose bit is on gets that bit cleared and a second chance. The first entry whose bit is already off is the one that dies.",
    },
    {
      type: "p",
      text: "It's wildly cheap. There's no per-access list mutation, which means no lock contention on the hot path. That's why the Linux kernel, Postgres's buffer pool (as Clock-Sweep), and most database storage engines pick a Clock variant over strict LRU.",
    },
  ],

  howItWorks: [
    { type: "h", text: "One bit per entry, one rotating hand" },
    {
      type: "p",
      text: "State per entry is just the value plus one bit: `referenced`. There's also a single global pointer, `hand`, that walks the entries in a circle. The algorithm:",
    },
    {
      type: "ol",
      items: [
        "**Get / hit** — find the entry, return the value, set `referenced = 1`. No list mutation, no movement.",
        "**Insert / miss + full cache** — advance the hand. If the entry at the hand has `referenced = 1`, clear it (`referenced = 0`) and step forward. If it has `referenced = 0`, evict it. Insert the new entry in that slot with `referenced = 1`.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Why this approximates LRU",
      text: "Any entry that's been touched between the hand's last visit and now will survive — its bit is on. An entry that hasn't been touched in a full rotation gets its bit cleared and dies on the next pass. That's a coarse-grained approximation of 'least recently used', cheap enough to use in a kernel.",
    },
    { type: "h", text: "Variants" },
    {
      type: "ul",
      items: [
        "**Clock-Sweep (Postgres)** — uses a small counter (0..5) instead of a single bit. Each pass decrements; eviction requires the counter to reach zero. Resists scan more than vanilla Clock.",
        "**GCLOCK / WS-Clock** — generalised counter-based variants used in databases.",
        "**CAR / CAR-T** — ARC's adaptive behavior layered on top of a clock structure (patent-free).",
      ],
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**OS-level caches** — page caches, dentry caches, buffer pools. Strict LRU is too expensive at the kernel hot path.",
        "**High-contention multi-threaded caches** — no list mutation on read means no contended lock on the read path.",
        "**Storage engine buffer pools** — Postgres, InnoDB, and most embedded DBs use a clock variant.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "PostgreSQL's buffer manager uses Clock-Sweep with a 5-bit usage counter (`BM_USAGECOUNT`). Linux's page reclaim is a two-list 'active'/'inactive' Clock variant. MySQL InnoDB's buffer pool uses a 2Q-like layout, also without strict LRU bookkeeping.",
    },
  ],

  tradeoffs: {
    pros: [
      "Almost-free on read — set one bit, no list shuffling, no allocations.",
      "Thread-friendly — no contended LRU lock on the hot path, just an atomic bit set.",
      "Hit rate close to LRU on realistic workloads (within a few percent on most traces).",
      "Trivial state per entry — one bit, or a small counter.",
    ],
    cons: [
      "The hand may have to walk a long way to find a victim if many entries have their bits set — eviction is amortized O(1) but worst-case proportional to the cache size.",
      "It's still recency-based — a one-shot scan still pollutes the cache, though counter variants resist it better than the bit version.",
      "Slightly harder to debug than LRU because eviction order depends on where the hand currently is.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the hand spin",
      body: "Click A, B, C, D, E, F to fill all six slots. Each slot has ref=1. Now click G — the hand walks the ring, clearing 1 → 0 as it goes, until it lands on a slot already at 0. That's the first eviction.",
    },
    {
      title: "02 · Earn a second chance",
      body: "After step 1, click B twice — its ref bit is locked to 1. Now click H. When the hand reaches B, the bit gets cleared but B survives this pass. It only dies if the hand laps back before B is touched again.",
    },
    {
      title: "03 · Lap the cache with no hits",
      body: "Click **Reset**, fill 6 slots, then keep clicking new keys (G, H) without touching anything already cached. The hand keeps lapping, clearing every bit on each pass before evicting. With no access signal, Clock degrades to FIFO — and that's the best you can do without information.",
    },
  ],

  code: {
    language: "typescript",
    filename: "clock.ts",
    code: `// Circular buffer + one bit per slot.
// O(1) amortized; only the eviction loop walks the ring.
class Clock<K, V> {
  private slots: Array<{ key: K; value: V; ref: boolean } | null>;
  private index = new Map<K, number>();
  private hand = 0;

  constructor(private capacity: number) {
    this.slots = new Array(capacity).fill(null);
  }

  get(key: K): V | undefined {
    const i = this.index.get(key);
    if (i === undefined) return undefined;
    this.slots[i]!.ref = true; // second-chance flag
    return this.slots[i]!.value;
  }

  set(key: K, value: V): void {
    const existing = this.index.get(key);
    if (existing !== undefined) {
      this.slots[existing]!.value = value;
      this.slots[existing]!.ref = true;
      return;
    }
    // Find a victim: walk until we see a ref bit at 0
    while (this.slots[this.hand] && this.slots[this.hand]!.ref) {
      this.slots[this.hand]!.ref = false;
      this.hand = (this.hand + 1) % this.capacity;
    }
    const victim = this.slots[this.hand];
    if (victim) this.index.delete(victim.key);
    this.slots[this.hand] = { key, value, ref: true };
    this.index.set(key, this.hand);
    this.hand = (this.hand + 1) % this.capacity;
  }
}`,
  },

  furtherReading: [
    {
      label: "Corbató (1968) — A paging experiment with the Multics system",
      href: "https://multicians.org/paging-experiment.pdf",
      note: "The original Clock paper. Yes, 1968.",
      kind: "paper",
    },
    {
      label: "PostgreSQL source — src/backend/storage/buffer/freelist.c",
      href: "https://github.com/postgres/postgres/blob/master/src/backend/storage/buffer/freelist.c",
      note: "Real clock-sweep implementation that decrements a usage counter as the hand passes. Worth reading.",
      kind: "docs",
    },
    {
      label: "Linux kernel source — mm/vmscan.c (active/inactive LRU)",
      href: "https://github.com/torvalds/linux/blob/master/mm/vmscan.c",
      note: "Modern two-list Clock variant used for page reclaim.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "clock-q1",
      question:
        "Why does Clock perform better than strict LRU in multi-threaded systems?",
      options: [
        { id: "a", label: "Clock has a higher hit rate by construction." },
        { id: "b", label: "Clock doesn't move entries on every access — just sets a bit — so there's no contended LRU list to lock." },
        { id: "c", label: "Clock uses less memory per entry." },
        { id: "d", label: "Clock is patented and proprietary." },
      ],
      correctOptionId: "b",
      explanation:
        "Strict LRU requires moving the touched entry to the head of a shared list on every read — a write to shared state that serializes readers. Clock just flips a per-entry bit, which is an atomic single-word write and doesn't touch any shared list structure.",
    },
    {
      id: "clock-q2",
      question:
        "An entry has its referenced bit set. The clock hand arrives at it. What happens?",
      options: [
        { id: "a", label: "It is evicted immediately." },
        { id: "b", label: "Its bit is cleared and the hand moves on — the entry survives this pass." },
        { id: "c", label: "The hand stops and waits." },
        { id: "d", label: "The bit is left alone and the hand moves on." },
      ],
      correctOptionId: "b",
      explanation:
        "That's the 'second chance' rule: a touched entry gets its bit cleared and is spared this rotation. If it doesn't get touched again before the hand returns, it'll be evicted then.",
    },
    {
      id: "clock-q3",
      question:
        "Postgres uses a Clock variant with a 5-bit counter instead of a single bit. What's the advantage?",
      options: [
        { id: "a", label: "It uses less memory than the single-bit version." },
        { id: "b", label: "Hot pages can require multiple sweeps before becoming evictable, giving better resistance to one-shot scans." },
        { id: "c", label: "It runs in O(log N)." },
        { id: "d", label: "It supports cache invalidation." },
      ],
      correctOptionId: "b",
      explanation:
        "Each access bumps the usage counter (capped at 5). The hand decrements rather than clearing, so a pinned-hot page survives multiple rotations before becoming a candidate for eviction. This is what makes Clock-Sweep scan-resistant in Postgres's buffer pool.",
    },
  ],
};
