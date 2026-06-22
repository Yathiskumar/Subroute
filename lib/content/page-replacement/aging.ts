import type { ConceptContent } from "@/lib/content/types";

export const aging: ConceptContent = {
  prototypeCaption:
    "Each page carries an **8-bit counter**, shown as a strip of bits (leftmost = most recent interval). A reference sets the page's R bit. On every **clock tick**, every counter shifts right by one and the R bit drops into the leftmost position, then R clears. On a fault, the page with the **smallest counter** is evicted. Watch the bits march rightward and the counters separate hot pages from cold ones.",

  overview: [
    {
      type: "p",
      text: "Aging is software's best cheap imitation of LRU. The problem with exact LRU is the cost of maintaining a precise recency order on every access. Aging instead keeps a small **counter** per page — typically 8 bits — and updates it only at periodic clock ticks. The counter encodes *recency over the last several intervals*, and the page with the smallest counter is the least-recently-used-ish victim.",
    },
    {
      type: "p",
      text: "The trick is how the counter is built. At each tick, you shift the counter right by one bit and slide the page's reference bit into the newly-vacated **leftmost** (most significant) position. So the high bits record recent intervals and the low bits record older ones. A page used in the most recent interval has a 1 in the top bit, making its counter large; a page idle for many intervals shifts its 1s down and out, making its counter small.",
    },
    {
      type: "p",
      text: "Because more-significant bits dominate the numeric value, **recent use outweighs old use** automatically — exactly LRU's instinct — but you only ever do a cheap shift-and-OR per page per tick, never a per-access list update.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The rule, step by step" },
    {
      type: "ol",
      items: [
        "**On a reference:** set the page's R bit to 1 (just a flag for this interval). A hit needs nothing more.",
        "**On a clock tick:** for every page, `counter = (counter >> 1) | (R << (n-1))` — shift right, drop R into the top bit — then clear R to 0. This is the 'aging' step.",
        "**On a fault with a free frame:** load the page with a counter of 0 and R = 1.",
        "**On a fault with no free frame:** evict the page with the **numerically smallest counter** — the one least recently (and least often) used across the recent intervals.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why it approximates LRU — and where it differs",
      text: "Comparing counters mostly answers 'who was referenced most recently?' because the top bit (most recent interval) dominates. But Aging has finite memory: with 8 bits it only remembers 8 intervals. Two pages both idle for 8+ intervals both reach counter 0 — Aging can't tell which was used more recently beyond its window, where true LRU always can. Within its window, though, it tracks recency remarkably well for the cost.",
    },
    {
      type: "p",
      text: "Aging is the polished descendant of **NFU** (Not Frequently Used), which simply *added* the R bit to a counter each interval. NFU's flaw: a page heavily used long ago keeps a huge count forever (it never forgets). The right-shift fixes exactly that — old activity decays away one bit at a time, so the counter measures *recent* behavior, not all-time totals.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When Aging is a good fit" },
    {
      type: "ul",
      items: [
        "**Software-managed page replacement** — when you want LRU-quality decisions but can only afford periodic, bounded work, not per-access bookkeeping.",
        "**When you have a periodic timer anyway** — Aging piggybacks on a clock interrupt the OS already runs.",
        "**When a few bits of recency history are enough** — most working sets are stable over a handful of intervals, which is exactly Aging's window.",
        "**Tune the counter width and tick period together** — more bits and finer ticks track recency more precisely, at proportional cost.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Aging vs Clock vs LRU",
      text: "Clock keeps one bit and is dirt cheap but very coarse. Exact LRU keeps perfect order but is expensive on every access. Aging sits between them: an n-bit counter updated per tick gives several bits of recency history — much finer than Clock, much cheaper than true LRU. It's the natural choice when Clock's single bit isn't discriminating enough.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Close to LRU's quality** for a fraction of the cost — recent use dominates automatically.",
      "**Cheap, bounded work** — one shift-and-OR per page per tick; nothing on the access hot path beyond setting a bit.",
      "**Decays old activity** — fixes NFU's 'never forgets' problem so the counter reflects *recent* behavior.",
      "**Tunable resolution** — pick the counter width and tick rate to trade precision for cost.",
    ],
    cons: [
      "**Finite memory horizon** — an n-bit counter can't distinguish pages idle longer than n intervals; both hit 0.",
      "**Tick granularity blurs order** — references within the same interval are indistinguishable; their order is lost.",
      "**Per-tick scan** — updating every page's counter each tick is O(frames) work, periodically.",
      "**Still not exact** — when precise LRU truly matters and is affordable, Aging is an approximation, not a replacement.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the bits shift on every tick",
      body: "Load the **Classic textbook** preset and step forward to a tick (highlighted rows; banner reads 'counters shifted right, R inserted at the top'). Watch each page's bit strip slide one cell to the right, with the most-recent interval's bit appearing at the left. Pages referenced this interval get a fresh 1 up top; idle pages lose their leftmost 1s downward.",
    },
    {
      title: "02 · See a hot page keep the highest counter",
      body: "Run **Hot page wins**. The repeatedly-referenced page sets its R bit nearly every interval, so the shift keeps injecting 1s into its top bit and its counter stays large — it's never the smallest, so it's never evicted. The decision card lists every counter (binary + value) on each eviction so you can confirm the smallest one loses.",
    },
    {
      title: "03 · Find the horizon limit",
      body: "Run **Two working sets** (two groups of pages used in alternating phases). When a group goes idle for more than 8 intervals, every counter in it shifts down to 0 — and Aging can no longer tell those pages apart, unlike true LRU. This is the finite-memory limit of the n-bit counter, made visible.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "aging.go",
      code: `// Aging: per-page n-bit shift-register counter approximating LRU.
package aging

const bits = 8

type slot struct {
	page    int
	r       int  // 0 or 1
	counter uint // n-bit shift register
}

type Aging struct {
	slots  []*slot // nil = empty frame
	Faults int
	Hits   int
}

func NewAging(frames int) *Aging {
	return &Aging{slots: make([]*slot, frames)}
}

// Tick is called periodically: shift right, drop R into the top bit, clear R.
func (a *Aging) Tick() {
	for _, s := range a.slots {
		if s != nil {
			s.counter = (s.counter >> 1) | (uint(s.r) << (bits - 1))
			s.r = 0
		}
	}
}

func (a *Aging) Access(page int) string {
	for _, s := range a.slots {
		if s != nil && s.page == page {
			s.r = 1 // mark referenced
			a.Hits++
			return "hit"
		}
	}
	a.Faults++
	for i, s := range a.slots {
		if s == nil {
			a.slots[i] = &slot{page: page, r: 1, counter: 0}
			return "fault"
		}
	}

	// evict the smallest counter: least recently used over the recent window
	victim := 0
	for i, s := range a.slots {
		if s.counter < a.slots[victim].counter {
			victim = i
		}
	}
	a.slots[victim] = &slot{page: page, r: 1, counter: 0}
	return "fault"
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Aging.java",
      code: `// Aging: per-page n-bit shift-register counter approximating LRU.
class Aging {
    private static final int BITS = 8;

    private static final class Slot {
        int page;
        int r;       // 0 or 1
        int counter; // n-bit shift register
        Slot(int page, int r, int counter) { this.page = page; this.r = r; this.counter = counter; }
    }

    private final Slot[] slots;
    int faults = 0;
    int hits = 0;

    Aging(int frames) { this.slots = new Slot[frames]; }

    // called periodically: shift right, drop R into the top bit, clear R
    void tick() {
        for (Slot s : slots) if (s != null) {
            s.counter = (s.counter >>> 1) | (s.r << (BITS - 1));
            s.r = 0;
        }
    }

    String access(int page) {
        for (Slot s : slots) {
            if (s != null && s.page == page) { s.r = 1; hits++; return "hit"; } // mark referenced
        }
        faults++;
        for (int i = 0; i < slots.length; i++) {
            if (slots[i] == null) { slots[i] = new Slot(page, 1, 0); return "fault"; }
        }

        // evict the smallest counter: least recently used over the recent window
        int victim = 0;
        for (int i = 0; i < slots.length; i++) {
            if (slots[i].counter < slots[victim].counter) victim = i;
        }
        slots[victim] = new Slot(page, 1, 0);
        return "fault";
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "aging.py",
      code: `# Aging: per-page n-bit shift-register counter approximating LRU.
from dataclasses import dataclass

BITS = 8


@dataclass
class Slot:
    page: int
    r: int        # 0 or 1
    counter: int  # n-bit shift register


class Aging:
    def __init__(self, frames: int) -> None:
        self.slots: list[Slot | None] = [None] * frames
        self.faults = 0
        self.hits = 0

    def tick(self) -> None:
        # called periodically: shift right, drop R into the top bit, clear R
        for s in self.slots:
            if s is not None:
                s.counter = (s.counter >> 1) | (s.r << (BITS - 1))
                s.r = 0

    def access(self, page: int) -> str:
        for s in self.slots:
            if s is not None and s.page == page:
                s.r = 1  # mark referenced
                self.hits += 1
                return "hit"
        self.faults += 1
        for i, s in enumerate(self.slots):
            if s is None:
                self.slots[i] = Slot(page, 1, 0)
                return "fault"

        # evict the smallest counter: least recently used over the recent window
        victim = 0
        for i, s in enumerate(self.slots):
            if s.counter < self.slots[victim].counter:
                victim = i
        self.slots[victim] = Slot(page, 1, 0)
        return "fault"`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "aging.cpp",
      code: `// Aging: per-page n-bit shift-register counter approximating LRU.
#include <cstdint>
#include <optional>
#include <string>
#include <vector>

class Aging {
    static constexpr int BITS = 8;

    struct Slot {
        int page;
        int r;            // 0 or 1
        std::uint32_t counter; // n-bit shift register
    };

    std::vector<std::optional<Slot>> slots_; // nullopt = empty frame

public:
    int faults = 0;
    int hits = 0;

    explicit Aging(int frames) : slots_(frames) {}

    // called periodically: shift right, drop R into the top bit, clear R
    void tick() {
        for (auto& s : slots_) if (s) {
            s->counter = (s->counter >> 1) | (static_cast<std::uint32_t>(s->r) << (BITS - 1));
            s->r = 0;
        }
    }

    std::string access(int page) {
        for (auto& s : slots_) {
            if (s && s->page == page) { s->r = 1; hits++; return "hit"; } // mark referenced
        }
        faults++;
        for (auto& s : slots_) {
            if (!s) { s = Slot{page, 1, 0}; return "fault"; }
        }

        // evict the smallest counter: least recently used over the recent window
        int victim = 0;
        for (int i = 0; i < static_cast<int>(slots_.size()); i++) {
            if (slots_[i]->counter < slots_[victim]->counter) victim = i;
        }
        slots_[victim] = Slot{page, 1, 0};
        return "fault";
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Wikipedia — Page replacement algorithm: Aging",
      href: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#Aging",
      note: "The shift-register counter rule and how Aging descends from NFU by letting old references decay.",
      kind: "article",
    },
    {
      label: "Tanenbaum & Bos — Modern Operating Systems (Ch. 3, NFU & Aging)",
      href: "https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003311/",
      note: "The canonical treatment: why NFU never forgets, and how the right-shift in Aging fixes it to approximate LRU.",
      kind: "book",
    },
    {
      label: "OSTEP — Beyond Physical Memory: Policies (Ch. 22)",
      href: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf",
      note: "Context on approximating LRU with hardware use bits — the family of techniques Aging belongs to.",
      kind: "book",
    },
    {
      label: "GeeksforGeeks — NFU and Aging page replacement",
      href: "https://www.geeksforgeeks.org/operating-systems/numerical-on-aging-and-nfu-page-replacement-algorithms/",
      note: "Worked numeric examples of the counter updates over several ticks — useful to check your understanding against the prototype.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "pr-aging-q1",
      question: "On each clock tick, how does Aging update a page's counter?",
      options: [
        { id: "a", label: "Adds the reference bit to the counter." },
        { id: "b", label: "Shifts the counter right by one bit and inserts the reference bit at the leftmost (most significant) position, then clears R." },
        { id: "c", label: "Doubles the counter if the page was referenced." },
        { id: "d", label: "Resets the counter to the number of references this interval." },
      ],
      correctOptionId: "b",
      explanation:
        "The right-shift pushes old history toward the low bits (decaying it), and the new R bit enters at the top. So recent intervals dominate the numeric value — which is what makes the smallest counter the least-recently-used page.",
    },
    {
      id: "pr-aging-q2",
      question: "What problem in NFU does Aging's right-shift fix?",
      options: [
        { id: "a", label: "NFU could deadlock when memory was full." },
        { id: "b", label: "NFU never forgot — a page heavily used long ago kept a huge count forever, so it measured all-time usage, not recent usage." },
        { id: "c", label: "NFU ignored the reference bit entirely." },
        { id: "d", label: "NFU suffered from Belady's anomaly." },
      ],
      correctOptionId: "b",
      explanation:
        "NFU just added the R bit to a counter each interval, so old activity accumulated permanently. Aging shifts right each tick, so old references decay one bit at a time and the counter reflects *recent* behavior — much closer to LRU.",
    },
    {
      id: "pr-aging-q3",
      question: "What is the fundamental limitation of using a fixed n-bit counter?",
      options: [
        { id: "a", label: "It can only track a single frame." },
        { id: "b", label: "It can't distinguish two pages that have both been idle longer than n intervals — both counters reach 0." },
        { id: "c", label: "It requires updating metadata on every memory access." },
        { id: "d", label: "It always evicts the most recently used page." },
      ],
      correctOptionId: "b",
      explanation:
        "An n-bit counter remembers only n intervals of history. Pages idle beyond that window all shift down to 0, and Aging can't tell them apart — whereas true LRU always knows which was used least recently. That's the price of bounded memory.",
    },
  ],
};
