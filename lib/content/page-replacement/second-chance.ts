import type { ConceptContent } from "@/lib/content/types";

export const secondChance: ConceptContent = {
  prototypeCaption:
    "FIFO with one extra bit per page. The queue runs front (oldest) → back (newest), and each frame shows its **reference bit (R)**. A hit sets R = 1. On a fault, inspect the front: if R = 1, clear it and **rotate the page to the back** (a second chance); repeat until you reach a page with R = 0 — that one is evicted. Watch the **Chances given** counter climb as hot pages keep dodging eviction.",

  overview: [
    {
      type: "p",
      text: "Second Chance is the smallest possible fix to FIFO's biggest flaw. FIFO evicts the oldest page even if it's being used constantly. Second Chance adds **one reference bit** per page and asks a single extra question before evicting: *has this page been used recently?* If yes, it gets a reprieve.",
    },
    {
      type: "p",
      text: "The bit is set to 1 whenever the page is referenced. When FIFO would evict the front-of-queue page, Second Chance checks that bit. If it's 0, evict as normal. If it's 1, the page has earned a **second chance**: clear the bit to 0 and send the page to the back of the queue, as if it had just arrived. Then look at the new front.",
    },
    {
      type: "p",
      text: "This tiny change makes a big difference: a page that keeps getting used keeps getting its bit set, so it keeps rotating to the back and survives. A page nobody touches has bit 0 and gets evicted on its turn. You've turned pure age into 'age, unless recently used' — a cheap nod toward LRU.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The rule, step by step" },
    {
      type: "ol",
      items: [
        "**Page already in the queue?** Hit. Set its reference bit to 1. It keeps its position — the order doesn't change.",
        "**Not in memory, free frame available?** Append it to the back of the queue with R = 1.",
        "**Not in memory, queue full?** Look at the front page. If its R = 1: clear it to 0, move the page to the back, and look at the new front. Repeat. The first page you find with R = 0 is evicted; the new page joins the back with R = 1.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "What happens when every bit is set?",
      text: "If every resident page has R = 1, the scan clears them all to 0 as it rotates the whole queue exactly once — and then evicts the original front page, which is now back at the front with R = 0. So in the worst case Second Chance degrades gracefully to plain FIFO (it evicts the oldest), never looping forever. The prototype's **Bits stay set** preset drives this case.",
    },
    {
      type: "p",
      text: "The hidden cost is the *rotation*. Every second chance physically moves a page from the front to the back of the queue — real pointer surgery on a linked list. On a hot workload that's a lot of list shuffling. That inefficiency is precisely what **Clock** removes: same algorithm, but the pages stay put and a moving 'hand' does the scanning instead.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**As the obvious upgrade from FIFO** — one bit and one check buy most of the benefit of tracking usage, with almost no added complexity.",
        "**When hardware gives you a reference bit for free** — most MMUs already set an 'accessed' bit on each page table entry, so the metadata costs nothing extra.",
        "**As a stepping stone to Clock** — understand Second Chance and Clock is just the efficient implementation of the identical idea.",
        "**Prefer Clock for real systems** — if you're going to ship this logic, ship it as Clock to avoid the queue-rotation overhead.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Second Chance and Clock are the same algorithm",
      text: "They make identical eviction decisions on the same input — the only difference is the data structure. Second Chance moves pages around a queue; Clock leaves them in a ring and moves a pointer. If that clicks, you understand both at once. Open both prototypes on the same reference string and compare the fault counts: they match.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Fixes FIFO's worst mistake** for one bit per page and one extra check.",
      "**Uses hardware you already have** — the MMU's accessed bit.",
      "**Can't starve a hot page** — repeated use keeps re-setting the bit.",
      "**Degrades gracefully** — worst case is just FIFO, never an infinite loop.",
    ],
    cons: [
      "**Queue rotation is costly** — each second chance moves a node to the back of the list.",
      "**Only one bit of history** — it knows 'used since last checked or not', nothing finer; coarser than true LRU.",
      "**Clock strictly dominates it** — identical decisions, cheaper implementation, so pure Second Chance is rarely the right ship.",
      "**Bit can lag reality** — between scans the single bit can't distinguish a page used once from one used a thousand times.",
    ],
  },

  handsOn: [
    {
      title: "01 · Give a page its second chance",
      body: "Load the **Classic textbook** preset and step to the first fault that hits a full queue. Read the decision card's scan log: it shows each front page with R = 1 getting its bit cleared and rotating to the back, until a page with R = 0 is found and evicted. The 'Chances given' stat ticks up each time.",
    },
    {
      title: "02 · Protect a hot page",
      body: "Run the **Hot page spared** preset. The repeatedly-referenced page keeps having its R bit set, so every time the scan reaches it, it's spared and rotated to the back. It survives the whole run — exactly the page FIFO would have wrongly evicted.",
    },
    {
      title: "03 · Force the FIFO worst case, then compare to Clock",
      body: "Run **Bits stay set**: when every page's bit is 1, the scan clears them all in one rotation and falls back to evicting the oldest — Second Chance behaving as plain FIFO. Then open the Clock prototype with the same string and frame count and confirm the fault totals are identical. Same algorithm, different machinery.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "second_chance.go",
      code: `// Second Chance: FIFO queue + one reference bit per page.
package secondchance

type slot struct {
	page int
	ref  int // 0 or 1
}

type SecondChance struct {
	frames int
	queue  []*slot // front = index 0 (oldest)
	Faults int
	Hits   int
}

func NewSecondChance(frames int) *SecondChance {
	return &SecondChance{frames: frames}
}

func (sc *SecondChance) Access(page int) string {
	for _, s := range sc.queue {
		if s.page == page {
			s.ref = 1 // mark used
			sc.Hits++
			return "hit"
		}
	}
	sc.Faults++
	if len(sc.queue) < sc.frames {
		sc.queue = append(sc.queue, &slot{page: page, ref: 1}) // free frame
		return "fault"
	}
	// scan from the front, sparing pages whose ref bit is set
	for sc.queue[0].ref == 1 {
		spared := sc.queue[0]
		sc.queue = sc.queue[1:]
		spared.ref = 0                      // clear the bit...
		sc.queue = append(sc.queue, spared) // ...and rotate to the back
	}
	sc.queue = sc.queue[1:] // first page with ref 0 is evicted
	sc.queue = append(sc.queue, &slot{page: page, ref: 1})
	return "fault"
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "SecondChance.java",
      code: `// Second Chance: FIFO queue + one reference bit per page.
import java.util.*;

class SecondChance {
    private static final class Slot {
        int page;
        int ref; // 0 or 1
        Slot(int page, int ref) { this.page = page; this.ref = ref; }
    }

    private final int frames;
    private final Deque<Slot> queue = new ArrayDeque<>(); // front = oldest
    int faults = 0;
    int hits = 0;

    SecondChance(int frames) { this.frames = frames; }

    String access(int page) {
        for (Slot s : queue) {
            if (s.page == page) { s.ref = 1; hits++; return "hit"; } // mark used
        }
        faults++;
        if (queue.size() < frames) {
            queue.addLast(new Slot(page, 1));                        // free frame
            return "fault";
        }
        // scan from the front, sparing pages whose ref bit is set
        while (queue.peekFirst().ref == 1) {
            Slot spared = queue.pollFirst();
            spared.ref = 0;            // clear the bit...
            queue.addLast(spared);     // ...and rotate to the back
        }
        queue.pollFirst();             // first page with ref 0 is evicted
        queue.addLast(new Slot(page, 1));
        return "fault";
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "second_chance.py",
      code: `# Second Chance: FIFO queue + one reference bit per page.
from collections import deque
from dataclasses import dataclass


@dataclass
class Slot:
    page: int
    ref: int  # 0 or 1


class SecondChance:
    def __init__(self, frames: int) -> None:
        self.frames = frames
        self.queue: deque[Slot] = deque()  # front = leftmost (oldest)
        self.faults = 0
        self.hits = 0

    def access(self, page: int) -> str:
        for s in self.queue:
            if s.page == page:
                s.ref = 1  # mark used
                self.hits += 1
                return "hit"
        self.faults += 1
        if len(self.queue) < self.frames:
            self.queue.append(Slot(page, 1))  # free frame
            return "fault"
        # scan from the front, sparing pages whose ref bit is set
        while self.queue[0].ref == 1:
            spared = self.queue.popleft()
            spared.ref = 0              # clear the bit...
            self.queue.append(spared)  # ...and rotate to the back
        self.queue.popleft()           # first page with ref 0 is evicted
        self.queue.append(Slot(page, 1))
        return "fault"`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "second_chance.cpp",
      code: `// Second Chance: FIFO queue + one reference bit per page.
#include <deque>
#include <string>

class SecondChance {
    struct Slot {
        int page;
        int ref; // 0 or 1
    };

    int frames_;
    std::deque<Slot> queue_; // front = oldest

public:
    int faults = 0;
    int hits = 0;

    explicit SecondChance(int frames) : frames_(frames) {}

    std::string access(int page) {
        for (auto& s : queue_) {
            if (s.page == page) { s.ref = 1; hits++; return "hit"; } // mark used
        }
        faults++;
        if (static_cast<int>(queue_.size()) < frames_) {
            queue_.push_back({page, 1});                             // free frame
            return "fault";
        }
        // scan from the front, sparing pages whose ref bit is set
        while (queue_.front().ref == 1) {
            Slot spared = queue_.front();
            queue_.pop_front();
            spared.ref = 0;              // clear the bit...
            queue_.push_back(spared);    // ...and rotate to the back
        }
        queue_.pop_front();              // first page with ref 0 is evicted
        queue_.push_back({page, 1});
        return "fault";
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Wikipedia — Page replacement algorithm: Second-chance",
      href: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#Second-chance",
      note: "The reference-bit rule and the explicit observation that the worst case degrades to FIFO.",
      kind: "article",
    },
    {
      label: "OSTEP — Beyond Physical Memory: Policies (Ch. 22)",
      href: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf",
      note: "Introduces the use (reference) bit and the second-chance idea as the bridge from FIFO to Clock.",
      kind: "book",
    },
    {
      label: "Tanenbaum & Bos — Modern Operating Systems (Ch. 3, Memory Management)",
      href: "https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003311/",
      note: "Tanenbaum's classic side-by-side of Second Chance and Clock, making clear they are the same policy with different bookkeeping.",
      kind: "book",
    },
    {
      label: "GeeksforGeeks — Second Chance (or Clock) Page Replacement",
      href: "https://www.geeksforgeeks.org/operating-systems/second-chance-or-clock-page-replacement-policy/",
      note: "A worked numeric walkthrough showing the reference bits flipping as pages are spared and rotated.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "pr-sc-q1",
      question: "On a fault with a full queue, what does Second Chance do with a front page whose reference bit is 1?",
      options: [
        { id: "a", label: "Evicts it immediately." },
        { id: "b", label: "Clears the bit to 0 and moves the page to the back of the queue." },
        { id: "c", label: "Sets the bit to 1 again and leaves it at the front." },
        { id: "d", label: "Swaps it with the page at the back." },
      ],
      correctOptionId: "b",
      explanation:
        "A set reference bit earns a second chance: clear it and rotate the page to the back as if newly arrived. Only a page found with bit 0 is actually evicted.",
    },
    {
      id: "pr-sc-q2",
      question: "If every resident page has its reference bit set to 1, how does Second Chance behave?",
      options: [
        { id: "a", label: "It loops forever and never evicts." },
        { id: "b", label: "It clears every bit in one full rotation and then evicts the oldest page — degrading to FIFO." },
        { id: "c", label: "It evicts every page at once." },
        { id: "d", label: "It refuses the new page." },
      ],
      correctOptionId: "b",
      explanation:
        "The scan clears all the bits as it rotates the whole queue once, then the original front page — now back at the front with bit 0 — is evicted. Worst case is plain FIFO, never an infinite loop.",
    },
    {
      id: "pr-sc-q3",
      question: "What is the key inefficiency of Second Chance that Clock eliminates?",
      options: [
        { id: "a", label: "It needs two reference bits instead of one." },
        { id: "b", label: "It physically rotates pages around the queue on every second chance, instead of just moving a pointer." },
        { id: "c", label: "It scans the future like Optimal." },
        { id: "d", label: "It cannot handle hits." },
      ],
      correctOptionId: "b",
      explanation:
        "Second Chance moves a page from front to back of the list each time it spares one — real list manipulation. Clock makes the identical decisions but leaves pages in a fixed ring and advances a hand instead, so the work is O(1) with no shuffling.",
    },
  ],
};
