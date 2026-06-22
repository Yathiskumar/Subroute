import type { ConceptContent } from "@/lib/content/types";

export const generational: ConceptContent = {
  prototypeCaption:
    "The heap is split by **age**. New objects allocate in **eden**; survivors of a collection are copied into a **survivor** space and their age ticks up; objects that survive enough collections are **promoted** to the **old generation**. Pick a scenario and step through. Scenario 1 follows an object from eden to tenure. Scenario 2 shows a **write barrier** recording an old→young pointer in the **remembered set** so a minor GC doesn't free a live object. Scenario 3 runs a full **major GC** over the old generation.",

  overview: [
    {
      type: "p",
      text: "Generational GC is less an algorithm than a *strategy* — a way of organizing the heap so the other collectors do far less work. It rests on one empirical observation, the **weak generational hypothesis**: *most objects die young.* The temporary string you built to format a log line, the array you allocated inside a loop, the intermediate result of a map-reduce — the overwhelming majority of allocations become garbage almost immediately, while a small minority (caches, config, long-lived data structures) live for the entire program.",
    },
    {
      type: "p",
      text: "So instead of scanning the whole heap on every collection, split it by age. New objects go in the **young generation**; objects that have survived a while live in the **old generation**. Collect the young generation **often and cheaply** — it's small and mostly garbage, so a copying collector clears it in microseconds. Collect the old generation **rarely** — it's large but mostly live, so there's little to reclaim and no point looking often.",
    },
    {
      type: "p",
      text: "The payoff is dramatic: the vast majority of GC work happens on a tiny slice of the heap. A *minor* (young) collection touches only the objects that are likely to be dead anyway, and a slow *major* (full) collection runs maybe once for every fifty or a hundred minor ones.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Spaces, ages, and two kinds of collection" },
    {
      type: "p",
      text: "The young generation is typically divided into an **eden** space and two **survivor** spaces (often called S0 and S1). Allocation is a fast pointer bump into eden. One survivor space is always kept empty to copy into.",
    },
    {
      type: "ol",
      items: [
        "**Allocate in eden.** Every new object lands in eden via a bump pointer. No GC, no bookkeeping — just advance a cursor.",
        "**Minor GC, when eden fills.** Trace from the roots through eden and the active survivor space. Copy the live objects into the *empty* survivor space, incrementing each survivor's **age**. Then wipe eden and the old survivor space wholesale — all that dead matter is reclaimed for free.",
        "**Age and promote.** Each minor GC an object survives bumps its age. Once an object's age crosses the **tenuring threshold**, it's **promoted** — copied into the old generation instead of back into a survivor space. It stops participating in minor GCs entirely.",
        "**Major GC, when the old generation fills.** A full collection of the entire heap — usually a mark-sweep or mark-compact over the old generation. Slow and stop-the-world, but rare.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "The problem minor GC must solve: old → young pointers",
      text: "A minor GC only traces the young generation — it deliberately *skips* the old generation to stay fast. But what if an old object points *into* the young generation? (e.g. a long-lived cache gets a freshly allocated entry: `cache.put(key, newObject)`.) If the collector ignores old gen, it never sees that reference and would wrongly free a live young object. So old→young pointers must be tracked as extra roots.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Write barriers and the remembered set",
      text: "The fix is a **write barrier**: a tiny snippet of code the runtime injects on every pointer store. When the program writes a pointer from an old object to a young one, the barrier records the source — into a **remembered set**, or by flipping a bit in a coarse-grained **card table** that marks a region of old gen as 'dirty.' At the next minor GC, the collector treats the remembered set / dirty cards as additional roots, so cross-generational references are followed without scanning all of old gen. The barrier is the price of keeping minor GC cheap.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When the strategy pays off" },
    {
      type: "ul",
      items: [
        "**High allocation rate, short object lifetimes** — request handlers, parsers, functional-style code that allocates freely. This is the workload generational GC is built for, and almost all server/app workloads fit it.",
        "**You want low average pause times** — minor GCs are short and frequent, so the typical pause a user experiences is tiny; the long major GC is rare.",
        "**Allocation must be fast** — bump-pointer allocation into eden is about as cheap as allocation gets.",
        "**Be wary when the hypothesis is violated** — workloads where most objects survive (large long-lived caches built up at startup, object pools) gain little: you pay to copy survivors and run barriers without reclaiming much. Generational GC is a *bet* on infant mortality; when that bet is wrong, it's pure overhead.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "**The HotSpot JVM** uses eden + two survivor spaces (default `SurvivorRatio=8`, so eden is 8× a survivor) and a `MaxTenuringThreshold` of up to 15 before promotion; G1, Parallel, and Serial collectors are all generational. **V8** (Chrome/Node) collects its young 'new space' with a copying **Scavenger** and promotes objects that survive two scavenges into old space. **.NET** uses three generations — gen 0 and gen 1 are the young/ephemeral generations collected often, gen 2 is the old generation. The hypothesis holds so reliably across these runtimes that generational collection is the default nearly everywhere.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Most GC work hits a tiny, mostly-dead slice of the heap** — minor collections are short and cheap.",
      "**Low average pause time** — the frequent collections are fast; the slow full collection is rare.",
      "**Fast bump-pointer allocation** into eden.",
      "**Composes with other collectors** — copying for the young gen, mark-compact or mark-sweep for the old gen; each generation uses the algorithm that suits it.",
    ],
    cons: [
      "**Write-barrier overhead on every pointer store** — the cost of maintaining the remembered set / card table, paid by the application, not the collector.",
      "**Loses its edge when objects survive** — if the generational hypothesis doesn't hold, you copy survivors and run barriers for little reclaim.",
      "**Major GC is still a long stop-the-world pause** — generational GC reduces how *often* you pay it, not how *much*.",
      "**More complex** — multiple spaces, ages, promotion policy, and the barrier machinery to get right.",
    ],
  },

  handsOn: [
    {
      title: "01 · Follow an object to tenure",
      body: "Run scenario 1 (Promotion lifecycle) and step through. Watch objects allocate in eden, then a minor GC copy the survivors into a survivor space with their age bumped to 1. Track one survivor across cycles — when its age reaches the threshold, it's promoted to old gen and stops appearing in minor GCs. Note how much of eden is garbage each cycle.",
    },
    {
      title: "02 · See the write barrier save a live object",
      body: "Run scenario 2 (Old-to-young pointer). An old-gen object gets a pointer to a freshly allocated young object; watch the write barrier fire and add it to the remembered set. On the next minor GC, the collector treats that entry as a root and copies the young object instead of freeing it. Mentally remove the barrier — without it, that object would be wrongly collected.",
    },
    {
      title: "03 · Trigger a major collection",
      body: "Run scenario 3 (Major collection). After many minor GCs the old generation fills with promoted objects, some now dead. Step through the full collection that marks and compacts the entire heap. Compare its scope to a minor GC — this is the slow, rare pause the whole strategy is designed to avoid running often.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "generational.go",
      code: `// A sketch of generational collection: fast minor GC over the young gen,
// promotion by age, and a remembered set fed by a write barrier.
package gc

const TenuringThreshold = 3

type Gen int

const (
	Young Gen = iota
	Old
)

type Obj struct {
	age  int
	refs []*Obj
	gen  Gen
}

type GenerationalHeap struct {
	eden       []*Obj
	survivor   []*Obj
	old        []*Obj
	roots      []*Obj
	remembered map[*Obj]bool // old objects holding young pointers
}

func NewGenerationalHeap() *GenerationalHeap {
	return &GenerationalHeap{remembered: map[*Obj]bool{}}
}

// Alloc is a bump into eden. Triggers a minor GC when full.
func (h *GenerationalHeap) Alloc(refs []*Obj) *Obj {
	o := &Obj{age: 0, refs: refs, gen: Young}
	h.eden = append(h.eden, o)
	if len(h.eden) > 8 {
		h.minorGC()
	}
	return o
}

// WriteRef: write barrier run on every pointer store. Records old -> young edges.
func (h *GenerationalHeap) WriteRef(holder, target *Obj) {
	holder.refs = append(holder.refs, target)
	if holder.gen == Old && target.gen == Young {
		h.remembered[holder] = true // remember it for the next minor GC
	}
}

// minorGC: trace young gen only. Roots = real roots + remembered set.
func (h *GenerationalHeap) minorGC() {
	live := map[*Obj]bool{}
	// Seed the worklist from real roots' children and the remembered set's children.
	var work []*Obj
	for _, r := range h.roots {
		work = append(work, r.refs...)
	}
	for r := range h.remembered {
		work = append(work, r.refs...)
	}
	for len(work) > 0 {
		o := work[len(work)-1]
		work = work[:len(work)-1]
		if o.gen == Old || live[o] {
			continue // don't trace into old gen
		}
		live[o] = true
		work = append(work, o.refs...)
	}
	var nextSurvivor []*Obj
	for o := range live {
		o.age++
		if o.age >= TenuringThreshold {
			o.gen = Old
			h.old = append(h.old, o) // promote
		} else {
			nextSurvivor = append(nextSurvivor, o)
		}
	}
	h.eden = nil                // wipe eden + old survivor wholesale
	h.survivor = nextSurvivor   // swap survivor spaces
	h.remembered = map[*Obj]bool{}
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Generational.java",
      code: `// A sketch of generational collection: fast minor GC over the young gen,
// promotion by age, and a remembered set fed by a write barrier.
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

enum Gen { YOUNG, OLD }

class Obj {
    int age;
    List<Obj> refs = new ArrayList<>();
    Gen gen = Gen.YOUNG;
}

class GenerationalHeap {
    private static final int TENURING_THRESHOLD = 3;

    private List<Obj> eden = new ArrayList<>();
    private List<Obj> survivor = new ArrayList<>();
    private final List<Obj> old = new ArrayList<>();
    private final List<Obj> roots = new ArrayList<>();
    private Set<Obj> remembered = new HashSet<>(); // old objects holding young pointers

    /** Allocation is a bump into eden. Triggers a minor GC when full. */
    Obj alloc(List<Obj> refs) {
        Obj o = new Obj();
        o.refs = refs;
        eden.add(o);
        if (eden.size() > 8) minorGC();
        return o;
    }

    /** Write barrier: run on every pointer store. Records old -> young edges. */
    void writeRef(Obj holder, Obj target) {
        holder.refs.add(target);
        if (holder.gen == Gen.OLD && target.gen == Gen.YOUNG) {
            remembered.add(holder); // remember it for the next minor GC
        }
    }

    /** Minor GC: trace young gen only. Roots = real roots + remembered set. */
    private void minorGC() {
        Set<Obj> live = new HashSet<>();
        Deque<Obj> work = new ArrayDeque<>();
        for (Obj r : roots) work.addAll(r.refs);
        for (Obj r : remembered) work.addAll(r.refs);
        while (!work.isEmpty()) {
            Obj o = work.pop();
            if (o.gen == Gen.OLD || live.contains(o)) continue; // don't trace into old gen
            live.add(o);
            work.addAll(o.refs);
        }
        List<Obj> nextSurvivor = new ArrayList<>();
        for (Obj o : live) {
            if (++o.age >= TENURING_THRESHOLD) { o.gen = Gen.OLD; old.add(o); } // promote
            else nextSurvivor.add(o);
        }
        eden = new ArrayList<>();      // wipe eden + old survivor wholesale
        survivor = nextSurvivor;       // swap survivor spaces
        remembered = new HashSet<>();
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "generational.py",
      code: `# A sketch of generational collection: fast minor GC over the young gen,
# promotion by age, and a remembered set fed by a write barrier.
TENURING_THRESHOLD = 3


class Obj:
    def __init__(self, refs: list["Obj"] | None = None, gen: str = "young") -> None:
        self.age = 0
        self.refs: list["Obj"] = refs if refs is not None else []
        self.gen = gen  # "young" | "old"


class GenerationalHeap:
    def __init__(self) -> None:
        self.eden: list[Obj] = []
        self.survivor: list[Obj] = []
        self.old: list[Obj] = []
        self.roots: list[Obj] = []
        self.remembered: set[Obj] = set()  # old objects holding young pointers

    def alloc(self, refs: list[Obj] | None = None) -> Obj:
        """Allocation is a bump into eden. Triggers a minor GC when full."""
        o = Obj(refs or [], "young")
        self.eden.append(o)
        if len(self.eden) > 8:
            self._minor_gc()
        return o

    def write_ref(self, holder: Obj, target: Obj) -> None:
        """Write barrier: run on every pointer store. Records old -> young edges."""
        holder.refs.append(target)
        if holder.gen == "old" and target.gen == "young":
            self.remembered.add(holder)  # remember it for the next minor GC

    def _minor_gc(self) -> None:
        """Minor GC: trace young gen only. Roots = real roots + remembered set."""
        live: set[Obj] = set()
        work: list[Obj] = []
        for r in self.roots:
            work.extend(r.refs)
        for r in self.remembered:
            work.extend(r.refs)
        while work:
            o = work.pop()
            if o.gen == "old" or o in live:
                continue                 # don't trace into old gen
            live.add(o)
            work.extend(o.refs)
        next_survivor: list[Obj] = []
        for o in live:
            o.age += 1
            if o.age >= TENURING_THRESHOLD:
                o.gen = "old"
                self.old.append(o)       # promote
            else:
                next_survivor.append(o)
        self.eden = []                   # wipe eden + old survivor wholesale
        self.survivor = next_survivor    # swap survivor spaces
        self.remembered.clear()`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "generational.cpp",
      code: `// A sketch of generational collection: fast minor GC over the young gen,
// promotion by age, and a remembered set fed by a write barrier.
#include <unordered_set>
#include <vector>

enum class Gen { Young, Old };

struct Obj {
    int age = 0;
    std::vector<Obj*> refs;
    Gen gen = Gen::Young;
};

class GenerationalHeap {
    static constexpr int TENURING_THRESHOLD = 3;

    std::vector<Obj*> eden_;
    std::vector<Obj*> survivor_;
    std::vector<Obj*> old_;
    std::vector<Obj*> roots_;
    std::unordered_set<Obj*> remembered_; // old objects holding young pointers

public:
    // Allocation is a bump into eden. Triggers a minor GC when full.
    Obj* alloc(std::vector<Obj*> refs = {}) {
        Obj* o = new Obj();
        o->refs = std::move(refs);
        eden_.push_back(o);
        if (eden_.size() > 8) minorGC();
        return o;
    }

    // Write barrier: run on every pointer store. Records old -> young edges.
    void writeRef(Obj* holder, Obj* target) {
        holder->refs.push_back(target);
        if (holder->gen == Gen::Old && target->gen == Gen::Young) {
            remembered_.insert(holder); // remember it for the next minor GC
        }
    }

private:
    // Minor GC: trace young gen only. Roots = real roots + remembered set.
    void minorGC() {
        std::unordered_set<Obj*> live;
        std::vector<Obj*> work;
        for (Obj* r : roots_) work.insert(work.end(), r->refs.begin(), r->refs.end());
        for (Obj* r : remembered_) work.insert(work.end(), r->refs.begin(), r->refs.end());
        while (!work.empty()) {
            Obj* o = work.back();
            work.pop_back();
            if (o->gen == Gen::Old || live.count(o)) continue; // don't trace into old gen
            live.insert(o);
            work.insert(work.end(), o->refs.begin(), o->refs.end());
        }
        std::vector<Obj*> nextSurvivor;
        for (Obj* o : live) {
            if (++o->age >= TENURING_THRESHOLD) { o->gen = Gen::Old; old_.push_back(o); } // promote
            else nextSurvivor.push_back(o);
        }
        eden_.clear();                  // wipe eden + old survivor wholesale
        survivor_ = nextSurvivor;       // swap survivor spaces
        remembered_.clear();
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Oracle — HotSpot GC Tuning Guide: Generations",
      href: "https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/generations.html",
      note: "Eden, survivor spaces, `SurvivorRatio`, and `MaxTenuringThreshold` as they actually ship in the JVM.",
      kind: "docs",
    },
    {
      label: "The Garbage Collection Handbook — Generational GC (Ch. 9)",
      href: "https://gchandbook.org/",
      note: "Jones, Hosking & Moss. The weak generational hypothesis, promotion policies, and remembered-set maintenance in depth.",
      kind: "book",
    },
    {
      label: "V8 — Trash talk: the Orinoco garbage collector",
      href: "https://v8.dev/blog/trash-talk",
      note: "How V8's generational design uses a copying Scavenger for new space and concurrent mark-compact for old space.",
      kind: "article",
    },
    {
      label: "Andy Wingo — Baffled by generational garbage collection",
      href: "https://wingolog.org/archives/2025/02/09/baffled-by-generational-garbage-collection",
      note: "A sharp, skeptical look at when the generational bet actually pays off — and when it doesn't.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "gen-q1",
      question: "What empirical observation does generational GC exploit?",
      options: [
        { id: "a", label: "Objects are allocated in a strictly last-in-first-out order." },
        { id: "b", label: "The weak generational hypothesis: most objects die young, while a small minority live a long time." },
        { id: "c", label: "Old objects never reference young objects." },
        { id: "d", label: "Reference counts are usually small." },
      ],
      correctOptionId: "b",
      explanation:
        "The whole strategy is a bet on infant mortality. If most objects die young, collecting the small young generation often and the large old generation rarely concentrates the work where the garbage is.",
    },
    {
      id: "gen-q2",
      question:
        "A minor GC traces only the young generation. Why is a write barrier needed?",
      options: [
        { id: "a", label: "To increment each object's age." },
        { id: "b", label: "To compact the old generation after every minor GC." },
        { id: "c", label: "To record old→young pointers in a remembered set, so a minor GC can treat them as roots and not wrongly free a reachable young object." },
        { id: "d", label: "To speed up allocation into eden." },
      ],
      correctOptionId: "c",
      explanation:
        "Since minor GC skips old gen, an old object pointing into young gen would be invisible to it. The write barrier records such stores into a remembered set (or card table), which the minor GC scans as extra roots.",
    },
    {
      id: "gen-q3",
      question:
        "An object is copied between survivor spaces and its age keeps increasing. What eventually happens when its age crosses the tenuring threshold?",
      options: [
        { id: "a", label: "It is freed immediately." },
        { id: "b", label: "It is promoted to the old generation and stops participating in minor GCs." },
        { id: "c", label: "Its age resets to zero." },
        { id: "d", label: "It triggers a major GC." },
      ],
      correctOptionId: "b",
      explanation:
        "Surviving enough minor collections marks an object as long-lived, so it's promoted (tenured) into the old generation — keeping the young generation small and minor GCs cheap.",
    },
  ],
};
