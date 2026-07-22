import type { RoadmapLesson } from "@/lib/content/types";

export const atomicOperationsAndCas: RoadmapLesson = {
  title: "Atomic operations & CAS",
  oneLiner:
    "An **atomic** operation is one that no other thread can cut in half — the read, the change and the write happen as a single indivisible step. **Compare-and-swap (CAS)** is the hardware instruction that makes it possible: *\"if this value is still what I last read, write my new one; otherwise tell me it changed.\"* Think of editing a wiki page: you copy it, edit your copy, and hit Save with *\"I based this on version 7\"*. If someone already saved version 8, your save is rejected and you re-open the fresh page and redo your edit. Nobody ever locked the page — you just retried.",
  difficulty: "intermediate",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/atomic-operations-and-cas.html",
  content: {
    prototypeCaption:
      "Two threads, one shared `count` box, and a deliberately unlucky interleaving. Start on **❌ count++** and press **▶ Step** six times: T1 and T2 each *read* 0 into their own `local` copy, each do *+1*, each *write* 1 — and the box ends red at **count: 1** with **lost updates 1**, even though two increments ran. Now click **⚛️ CAS retry** and step through the *exact same* interleaving: T1's `CAS(0→1)` succeeds, but T2's shows `expected 0 ≠ actual 1 ✗` in red, the **retries** counter ticks to 1, T2's lane loops back with `↻ retry — fresh read`, re-reads 1, and `CAS(1→2)` lands green at **count: 2**. Nothing was lost and nobody blocked. The **🔁 ABA** chip is a three-click cautionary tale — the value goes `A → B → A` and CAS wrongly succeeds — and **#️⃣ +version** re-runs it with a stamp so `A#1 ≠ A#3` correctly fails. Use **▶ Run all** to watch a mode play itself, **↺ Reset** to start over.",

    overview: [
      {
        type: "p",
        text: "Here is the most surprising line of code in concurrent programming: `count++`. It looks like one thing. It is actually **three** things — *read* the value out of memory, *add one* to it in a CPU register, *write* the result back. A thread can be interrupted between any two of those steps. If two threads both read `0`, both add one, and both write `1`, you ran two increments and gained one. That's a **lost update**, and it is the single most common concurrency bug there is.",
      },
      {
        type: "p",
        text: "**Atomic** means *indivisible*: the whole read-modify-write happens as one CPU instruction that no other thread can split. The hardware primitive that gives us this is **compare-and-swap (CAS)**. You hand it three things — the memory location, the value you *expect* to find there, and the *new* value you want to store. In one uninterruptible instruction the CPU checks whether memory still holds `expected`; if yes it writes the new value and reports success, if no it writes nothing and reports failure. On x86 that's the `LOCK CMPXCHG` instruction; on ARM it's a load-linked/store-conditional pair.",
      },
      {
        type: "p",
        text: "The mental model that makes this click is **editing a wiki page** (or a shared doc with version history). You open the page — that's your *read*, and you note that you're looking at version 7. You type your changes into your own copy — that's your *modify*, done privately, affecting nobody. Then you hit Save, and the save carries a claim: *\"this edit is based on version 7\"*. If the server still shows version 7, your save goes through. If someone saved version 8 while you were typing, the server **rejects** your save and shows you the fresh page — and you redo your edit on top of it. Nobody locked the page. Nobody waited in a queue. The loser of the race just tries again.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "CAS is *\"write my new value **only if** the old one is still what I read\"* — one indivisible instruction. Wrap it in a loop that re-reads and retries on failure, and you get a correct counter with **no lock, no blocking, and no deadlock**.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Where you've already met it",
        text: "`AtomicInteger` and `LongAdder` in Java, `std::atomic<int>` in C++, `sync/atomic` in Go, `Interlocked.Increment` in .NET — all of them are CAS wearing a friendly name. Higher up the stack, the same idea is called **optimistic locking**: a `version` column in a database row, an `If-Match: \"etag\"` header on an HTTP PUT, or a document's revision number. Same bargain everywhere: don't lock, just detect the conflict at write time and retry.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Why count++ breaks" },
      {
        type: "p",
        text: "Compile `count++` and you get roughly three machine steps. Line them up for two threads on the unluckiest possible schedule and the damage is obvious:",
      },
      {
        type: "ul",
        items: [
          "**T1 reads** `count` → its private copy holds `0`.",
          "**T2 reads** `count` → its private copy also holds `0`. Both threads now have the *same stale snapshot*.",
          "**T1 adds 1** in its own copy → `1`. **T2 adds 1** in its own copy → `1`. Neither has touched shared memory yet.",
          "**T1 writes** `1`. **T2 writes** `1` — on top of it. Two increments happened, `count` says `1`. One update is **gone**, and nothing crashed, so nothing tells you.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Python's GIL does not make += atomic",
        text: "A very common belief: *\"Python has a Global Interpreter Lock, so my counter is safe.\"* It isn't. The GIL guarantees only that one bytecode-ish step runs at a time — but `counter += 1` compiles to several bytecodes (load, add, store), and the interpreter can switch threads between them. You get the exact same lost update. Use a `threading.Lock`, or an `itertools.count()` whose `__next__` is a single C-level call.",
      },
      { type: "h", text: "The CAS retry loop" },
      {
        type: "p",
        text: "CAS on its own only *reports* a conflict — it doesn't resolve one. The pattern that resolves it is a tiny loop, and it is the same four lines in every language:",
      },
      {
        type: "code",
        language: "java",
        code: `// The canonical CAS retry loop — this IS what incrementAndGet() does inside.
while (true) {
    int current = count.get();                     // 1. READ  ("I'm on version 7")
    int next    = current + 1;                     // 2. COMPUTE (private, no sharing)
    if (count.compareAndSet(current, next)) {      // 3. SWAP IF UNCHANGED (atomic)
        return next;                               //    won the race — done
    }
    // 4. someone wrote first: the swap did nothing.
    //    Loop, re-read the FRESH value, redo the work on top of it.
}`,
      },
      {
        type: "p",
        text: "Read that loop against the wiki analogy and every line has a twin: `get()` is opening the page and noting version 7, `current + 1` is typing your edit into your own copy, `compareAndSet` is hitting Save with *\"based on version 7\"*, and the loop is being shown the fresh page and redoing your edit. The crucial detail is step 4: on failure you must **re-read**. Retrying with the same stale `current` would fail forever.",
      },
      { type: "h", text: "Lock-free and optimistic" },
      {
        type: "p",
        text: "This style is called **optimistic** because it assumes conflicts are rare and only checks for one at write time — the opposite of a lock, which *pessimistically* blocks everyone up front just in case. It is also **lock-free**: no thread is ever parked, no thread ever waits on another, and the operating system never has to suspend and re-schedule anyone. Two consequences fall straight out of that. First, **no deadlock** — you can't deadlock if nobody ever holds anything. Second, **no priority inversion or convoying** — a thread that gets descheduled mid-loop cannot block anyone else, because it holds nothing. The system as a whole always makes progress: every failed CAS means some *other* thread succeeded.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Lock-free ≠ wait-free",
        text: "Lock-free guarantees that *the system* always progresses — but one unlucky thread can keep losing the race and spin for a long time. That's called **starvation**. **Wait-free** is the stronger promise that *every* thread finishes in a bounded number of steps; Java's `LongAdder` gets close by giving each thread its own cell to increment and summing them only when you read.",
      },
      { type: "h", text: "When CAS beats a lock — and when it loses" },
      {
        type: "ul",
        items: [
          "**CAS wins** for short updates to a **single** variable — counters, sequence numbers, flags, a head pointer — under low-to-moderate contention. The whole operation is a handful of instructions with no trip into the kernel, so it's dramatically cheaper than acquiring a mutex.",
          "**CAS loses under heavy contention.** Every failed attempt is thrown-away work, and it burns CPU while spinning. With dozens of threads hammering one counter, a lock (which parks losers instead of spinning them) or a striped counter like `LongAdder` (which spreads writes across many cells) wins comfortably.",
          "**CAS can't do multi-variable updates.** It protects exactly one memory word. If you must move money from `balanceA` to `balanceB`, or keep `head` and `size` consistent, two atomics are **not** an atomic pair — another thread can observe the state between them. Use a lock, or pack the fields into one immutable object and CAS the reference to it (`AtomicReference`).",
          "**CAS loses when the work is long.** If computing the new value is expensive, a failed retry wastes a lot of it. Locks are better when the critical section is big.",
        ],
      },
      { type: "h", text: "The ABA problem" },
      {
        type: "p",
        text: "CAS compares **values**, not **histories** — and that gap has a name. Suppose T1 reads a value `A` and then gets descheduled. While it sleeps, T2 changes the value to `B`, does some work, and then changes it back to `A`. T1 wakes up, does its `compareAndSet(A, C)`, sees `A` sitting there, concludes *\"nothing changed\"*, and **succeeds** — even though the world moved on underneath it. For a plain integer counter that's usually harmless; for a pointer in a lock-free stack it's a real bug, because the `A` you're looking at may be a recycled node that's already been freed and reallocated.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The fix: a version stamp",
        text: "Attach a counter that increases on **every** write, and compare the pair (value, stamp) instead of just the value. Now `A#1` and `A#3` are visibly different, so the stale CAS correctly fails and retries. Java ships this as `AtomicStampedReference` (value + int stamp) and `AtomicMarkableReference` (value + boolean); C++ implementations use a double-width CAS on a tagged pointer. It's the same `version` column you'd add to a database row for optimistic locking.",
      },
      { type: "h", text: "Atomics also fix visibility" },
      {
        type: "p",
        text: "Lost updates aren't the only hazard. Without synchronisation, a value one thread writes may sit in a CPU cache or register and simply never become **visible** to another thread — the reader can spin forever on a stale copy. Atomic classes solve this too: in Java, reads and writes on an `AtomicInteger` have the same memory-ordering guarantees as `volatile`, so a write by one thread *happens-before* a subsequent read by another. In C++ you can even choose the strength (`memory_order_seq_cst` by default, `relaxed` if you only need atomicity and not ordering). So an atomic gives you two things at once: an indivisible update **and** a guarantee that everyone sees it.",
      },
    ],

    handsOn: [
      {
        title: "01 · Break it with ❌ count++",
        body: "Stay on the ❌ count++ chip and press ▶ Step six times. Watch the local: badges — T1 reads 0, then T2 also reads 0 (same stale snapshot), both do +1 in their own copy, then both write 1. The shared box ends red at count: 1 with lost updates 1, even though two increments ran. That red box is `count++` not being one operation.",
      },
      {
        title: "02 · Fix it with ⚛️ CAS retry",
        body: "Click ⚛️ CAS retry and step through the identical interleaving. T1's chip now reads CAS(0→1) and lands ✓. T2's shows `expected 0 ≠ actual 1 ✗` in red — nothing is written, retries ticks to 1, and its lane loops back with ↻ retry — fresh read. It re-reads 1, recomputes 2, and CAS(1→2) turns the box green at count: 2 with lost updates 0. Nobody blocked; the loser just retried.",
      },
      {
        title: "03 · Trip over 🔁 ABA, then fix it with #️⃣ +version",
        body: "Click 🔁 ABA and step three times: T1 reads A and pauses, T2 does A → B → A, and T1's CAS sees A and wrongly succeeds — the box flashes amber, 'Same value, different history'. Now click #️⃣ +version and replay it. The trail reads A#1 → B#2 → A#3 and the comparison becomes `expected A#1 ≠ actual A#3 ✗`, so the stale CAS correctly fails. Hit ↺ Reset to try any mode again, or ▶ Run all to watch one play itself.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "AtomicCounter.java",
        code: `import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicStampedReference;
import java.util.concurrent.atomic.LongAdder;

public class AtomicCounter {

    // ❌ BROKEN: count++ is read → add → write. Threads interleave, updates vanish.
    private int plain = 0;
    public void unsafeIncrement() { plain++; }

    // ✅ ATOMIC: the whole read-modify-write is one indivisible instruction.
    private final AtomicInteger count = new AtomicInteger(0);

    public int increment() {
        return count.incrementAndGet();      // library-provided CAS loop
    }

    // The SAME thing, written by hand — this is the canonical CAS retry loop.
    public int incrementByHand() {
        while (true) {
            int current = count.get();                  // 1. read ("version 7")
            int next    = current + 1;                  // 2. compute privately
            if (count.compareAndSet(current, next)) {   // 3. swap IF unchanged
                return next;                            //    won the race
            }
            // 4. someone wrote first → nothing was written. Loop and RE-READ.
        }
    }

    // Any pure function of the old value fits the same loop:
    public int doubleIt() {
        return count.updateAndGet(v -> v * 2);          // retries internally
    }

    // Heavy contention? Stripe the writes across cells instead of one hot word.
    private final LongAdder hits = new LongAdder();
    public void hit()      { hits.increment(); }        // scales far better
    public long hitCount() { return hits.sum(); }       // combine on read

    // ABA fix: compare (value, stamp) so A#1 and A#3 are visibly different.
    private final AtomicStampedReference<String> top =
            new AtomicStampedReference<>("A", 1);

    public boolean casWithStamp(String expected, String next) {
        int[] stampHolder = new int[1];
        String seen = top.get(stampHolder);             // read value AND stamp
        return top.compareAndSet(seen, next, stampHolder[0], stampHolder[0] + 1);
    }

    // ⚠️ Two atomics are NOT an atomic pair — another thread can see the gap.
    // Need to update several fields together? Use a lock, or CAS one immutable
    // object holding all of them via AtomicReference.
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "atomic_counter.py",
        code: `import itertools
import threading

# ❌ BROKEN. The GIL does NOT make += atomic: "counter += 1" is several
# bytecodes (load, add, store) and the interpreter can switch threads between
# them — exactly the read/modify/write split that loses updates.
counter = 0


def unsafe_worker(n: int) -> None:
    global counter
    for _ in range(n):
        counter += 1          # read → add → write, interruptible


# ✅ Option 1 — a lock (pessimistic: block first, then update).
lock = threading.Lock()
safe = 0


def locked_worker(n: int) -> None:
    global safe
    for _ in range(n):
        with lock:            # the whole read-modify-write is one critical section
            safe += 1


# ✅ Option 2 — a single C-level call that cannot be split.
ticket = itertools.count()    # next(ticket) is atomic in CPython


def ticket_worker(n: int) -> None:
    for _ in range(n):
        next(ticket)          # one call, no interleaving point inside


# Python has no CAS primitive, but the SHAPE of the retry loop is worth seeing:
class OptimisticCounter:
    def __init__(self) -> None:
        self._value = 0
        self._guard = threading.Lock()

    def _compare_and_set(self, expected: int, new: int) -> bool:
        with self._guard:                     # stands in for LOCK CMPXCHG
            if self._value != expected:
                return False                  # it changed — reject the write
            self._value = new
            return True

    def increment(self) -> int:
        while True:
            current = self._value             # 1. read
            nxt = current + 1                 # 2. compute
            if self._compare_and_set(current, nxt):   # 3. swap if unchanged
                return nxt
            # 4. lost the race → loop and re-read the fresh value


if __name__ == "__main__":
    threads = [threading.Thread(target=unsafe_worker, args=(100_000,)) for _ in range(4)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    print("unsafe:", counter, "(expected 400000 — usually less)")`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "atomic_counter.cpp",
        code: `#include <atomic>
#include <cstdint>
#include <iostream>
#include <thread>
#include <vector>

// ❌ BROKEN: ++plain is read → add → write, and it is a data race (UB).
int plain = 0;

// ✅ std::atomic<int> — the read-modify-write is one indivisible instruction.
std::atomic<int> count{0};

void increment_library(int n) {
    for (int i = 0; i < n; ++i) {
        count.fetch_add(1, std::memory_order_relaxed);  // ready-made atomic add
    }
}

// The same thing spelled out: the canonical CAS retry loop.
void increment_by_hand(int n) {
    for (int i = 0; i < n; ++i) {
        int current = count.load();                      // 1. read
        // compare_exchange_weak REFRESHES 'current' for you when it fails,
        // so the loop body is empty — the next attempt already sees the truth.
        while (!count.compare_exchange_weak(current, current + 1)) {
            // 2+3. compute & swap-if-unchanged; retry on failure
        }
    }
}

// ABA guard: pack a tag next to the value and CAS both at once.
struct Stamped {
    std::uint32_t value;
    std::uint32_t stamp;     // bumped on EVERY write, so A#1 != A#3
};
std::atomic<Stamped> top{Stamped{1, 1}};

bool cas_with_stamp(std::uint32_t next) {
    Stamped seen = top.load();
    Stamped fresh{next, seen.stamp + 1};
    return top.compare_exchange_strong(seen, fresh);   // fails if stamp moved
}

int main() {
    std::vector<std::thread> ts;
    for (int i = 0; i < 4; ++i) ts.emplace_back(increment_by_hand, 100000);
    for (auto& t : ts) t.join();
    std::cout << "count = " << count.load() << " (exactly 400000)\\n";
    std::cout << "lock-free? " << std::boolalpha << count.is_lock_free() << "\\n";
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "atomic_counter.go",
        code: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	// ❌ BROKEN: plain++ is read → add → write; goroutines interleave.
	var plain int64

	// ✅ atomic.Int64 (Go 1.19+) — indivisible read-modify-write.
	var count atomic.Int64

	var wg sync.WaitGroup
	for i := 0; i < 4; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 100000; j++ {
				plain++            // race detector will flag this
				count.Add(1)       // ready-made atomic increment
			}
		}()
	}
	wg.Wait()

	fmt.Println("plain:", plain, "(expected 400000 — usually less)")
	fmt.Println("count:", count.Load(), "(exactly 400000)")
	fmt.Println("byHand:", incrementByHand(&count))
}

// The canonical CAS retry loop, written out.
func incrementByHand(count *atomic.Int64) int64 {
	for {
		current := count.Load()                 // 1. read ("version 7")
		next := current + 1                     // 2. compute privately
		if count.CompareAndSwap(current, next) { // 3. swap IF unchanged
			return next                         //    won the race
		}
		// 4. someone wrote first → loop and RE-READ the fresh value
	}
}

// Need several fields consistent at once? One atomic can't do it —
// CAS a pointer to an immutable struct, or just take a sync.Mutex.
type stats struct{ hits, misses int64 }

var snapshot atomic.Pointer[stats]

func recordHit() {
	for {
		old := snapshot.Load()
		next := &stats{hits: old.hits + 1, misses: old.misses} // fresh copy
		if snapshot.CompareAndSwap(old, next) {                // swap the pointer
			return
		}
	}
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for an atomic when..." },
      {
        type: "ul",
        items: [
          "**One variable, short update** — a hit counter, a sequence/ID generator, a running total, a shutdown flag. `AtomicLong`, `std::atomic<int>`, `atomic.Int64`: cheaper than a mutex and impossible to deadlock.",
          "**Contention is low to moderate** — most attempts succeed on the first try, so you almost never pay for a retry.",
          "**You need lock-free progress** — real-time or latency-sensitive code where a thread being descheduled while holding a lock would stall everyone else.",
          "**You're doing optimistic concurrency higher up** — a `version` column, an ETag, a document revision. Same loop, bigger scale.",
        ],
      },
      { type: "h", text: "Take a lock instead when..." },
      {
        type: "ul",
        items: [
          "**Several fields must change together** — two atomics are not an atomic pair. Transfer between two balances, or keep `head` and `size` in step, and you need one critical section (or one immutable object CAS'd through an `AtomicReference`).",
          "**Contention is heavy** — dozens of threads on one hot word means mostly wasted retries and burnt CPU. Use a lock, or stripe with `LongAdder` / per-thread counters.",
          "**The update is expensive** — a long computation thrown away on every failed CAS costs far more than briefly blocking.",
          "**Correctness depends on recycled identity** — lock-free pointer structures need an ABA guard (`AtomicStampedReference`, tagged pointers, hazard pointers). If that sounds fiddly, that's the signal to use a battle-tested concurrent collection instead of hand-rolling one.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "No blocking and no deadlock — nobody ever holds anything, so threads can't wait on each other in a cycle.",
        "Very cheap in the common case: a single CPU instruction, no kernel call, no thread parking or context switch.",
        "System-wide progress guaranteed — every failed CAS means some other thread succeeded, so the program never stalls.",
        "Atomics also give memory visibility (volatile-like ordering), so other threads actually see the new value.",
      ],
      cons: [
        "Protects exactly one variable — multi-field invariants need a lock or an immutable object swapped by reference.",
        "Wasted work under contention: failed retries burn CPU spinning, and an unlucky thread can starve for a long time.",
        "The ABA problem — CAS compares values, not history, so an A→B→A change slips past unless you add a version stamp.",
        "Lock-free data structures are notoriously hard to write and review correctly; prefer the library's version over your own.",
      ],
    },

    furtherReading: [
      {
        label: "java.util.concurrent.atomic — Java SE API docs",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/package-summary.html",
        note: "The package overview spells out the CAS contract, the volatile-like memory semantics, and when to prefer LongAdder over AtomicLong. Start here.",
        kind: "docs",
      },
      {
        label: "Compare and Swap — Jenkov",
        href: "https://jenkov.com/tutorials/java-concurrency/compare-and-swap.html",
        note: "The clearest beginner walkthrough of the retry loop, with the check-then-act race it fixes and hardware-vs-synchronized comparison.",
        kind: "article",
      },
      {
        label: "std::atomic — cppreference",
        href: "https://en.cppreference.com/w/cpp/atomic/atomic",
        note: "Reference for compare_exchange_weak/strong (note how 'expected' is refreshed on failure) and the memory_order options C++ exposes.",
        kind: "docs",
      },
      {
        label: "sync/atomic — Go package docs",
        href: "https://pkg.go.dev/sync/atomic",
        note: "Go's atomic types and CompareAndSwap functions, plus the blunt warning that these are low-level primitives most code should avoid.",
        kind: "docs",
      },
      {
        label: "ABA problem — Wikipedia",
        href: "https://en.wikipedia.org/wiki/ABA_problem",
        note: "Short, concrete write-up of the A→B→A trap with the classic lock-free stack example and the tagged-pointer / stamp fixes.",
        kind: "docs",
      },
      {
        label: "Wait-Free Synchronization — Maurice Herlihy (1991)",
        href: "https://cs.brown.edu/~mph/Herlihy91/p124-herlihy.pdf",
        note: "The paper that proved compare-and-swap is universal: with CAS you can build any wait-free concurrent object. The theoretical bedrock under all of this.",
        kind: "paper",
      },
      {
        label: "Java Concurrency in Practice — Goetz et al.",
        href: "https://jcip.net/",
        note: "Chapter 15 ('Atomic Variables and Nonblocking Synchronization') is the definitive practical treatment of CAS, contention, and when locks still win.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "atomic-operations-and-cas-q1",
        question: "Why is `count++` unsafe when two threads run it at the same time?",
        options: [
          { id: "a", label: "It compiles to read → add → write, and a thread can be interrupted between those steps, so both threads can read the same old value." },
          { id: "b", label: "It is a single CPU instruction, but the CPU executes it out of order." },
          { id: "c", label: "It is safe — the compiler automatically inserts a lock around it." },
          { id: "d", label: "It only breaks on single-core machines, where threads must share one CPU." },
        ],
        correctOptionId: "a",
        explanation:
          "`count++` is three operations, not one: load the value, add one in a register, store it back. If both threads load 0 before either stores, both store 1 and one increment is lost. It is not a single instruction (b), no compiler adds locking for you (c), and the bug appears on single-core machines too — time-slicing is enough to interleave the steps (d).",
      },
      {
        id: "atomic-operations-and-cas-q2",
        question: "What exactly does `compareAndSet(expected, newValue)` do?",
        options: [
          { id: "a", label: "In one indivisible instruction: if memory still holds `expected`, write `newValue` and report success; otherwise write nothing and report failure." },
          { id: "b", label: "It blocks the calling thread until the value equals `expected`, then writes `newValue`." },
          { id: "c", label: "It always writes `newValue` and returns the value that was there before." },
          { id: "d", label: "It takes a lock, compares, writes, and releases the lock." },
        ],
        correctOptionId: "a",
        explanation:
          "CAS is a conditional write executed as one uninterruptible hardware instruction (x86's LOCK CMPXCHG): it swaps only if the value is unchanged, and reports whether it did. It never blocks or waits (b) — that's what makes it lock-free. An unconditional write returning the old value (c) is getAndSet, and no lock is involved (d).",
      },
      {
        id: "atomic-operations-and-cas-q3",
        question: "Your `compareAndSet` call returns false. What must the retry loop do next?",
        options: [
          { id: "a", label: "Re-read the current value, recompute the new value from it, and try the CAS again." },
          { id: "b", label: "Retry immediately with the same expected and new values until it eventually succeeds." },
          { id: "c", label: "Fall back to acquiring a lock, because CAS has failed permanently." },
          { id: "d", label: "Sleep the thread for a fixed backoff and then write the value unconditionally." },
        ],
        correctOptionId: "a",
        explanation:
          "A false return means somebody else wrote first, so your snapshot is stale — you must re-read and redo the computation on top of the fresh value, exactly like re-opening a wiki page that moved to version 8. Retrying with the same stale `expected` (b) would fail forever, one failure doesn't mean CAS is unusable (c), and writing unconditionally (d) throws away the other thread's update — the lost update you were trying to prevent.",
      },
      {
        id: "atomic-operations-and-cas-q4",
        question: "You need to move 100 from `balanceA` to `balanceB`. Both are `AtomicInteger`s. Is that safe?",
        options: [
          { id: "a", label: "No — two atomics are not an atomic pair; another thread can observe the state between the two updates. Use a lock or CAS one object holding both." },
          { id: "b", label: "Yes — every operation on an AtomicInteger is atomic, so a sequence of them is atomic too." },
          { id: "c", label: "Yes, as long as you always update balanceA before balanceB." },
          { id: "d", label: "Yes, because atomics provide volatile visibility, which makes the pair consistent." },
        ],
        correctOptionId: "a",
        explanation:
          "An atomic protects exactly one memory word. Two separate atomic updates leave a window where the money has left A but not arrived in B, and another thread can read that inconsistent state. Atomicity does not compose (b), a fixed order doesn't close the window (c), and visibility guarantees say when writes are seen, not that two writes happen together (d).",
      },
      {
        id: "atomic-operations-and-cas-q5",
        question: "A thread reads A, sleeps, and meanwhile the value goes A → B → A. The thread's CAS then succeeds. What is this called, and how is it fixed?",
        options: [
          { id: "a", label: "The ABA problem — CAS compares values, not history. Fix it by comparing a (value, version-stamp) pair, e.g. AtomicStampedReference." },
          { id: "b", label: "A lost update — fix it by using a bigger integer type." },
          { id: "c", label: "A deadlock — fix it by always acquiring resources in the same order." },
          { id: "d", label: "A visibility problem — fix it by marking the field volatile." },
        ],
        correctOptionId: "a",
        explanation:
          "CAS only asks 'is the value the same?', so an A→B→A round trip is invisible to it even though the world changed — dangerous when the value is a recycled pointer. Attaching a counter that increments on every write makes A#1 and A#3 distinguishable, so the stale CAS correctly fails. It isn't a lost update, a deadlock, or a visibility issue — CAS is lock-free (no deadlock) and already carries volatile-like ordering.",
      },
      {
        id: "atomic-operations-and-cas-q6",
        question: "Forty threads hammer one shared counter in a tight loop. What happens with a plain CAS retry loop, and what's the better option?",
        options: [
          { id: "a", label: "Most CAS attempts fail and spin, burning CPU on thrown-away work; a striped counter like LongAdder (or a lock) usually performs better." },
          { id: "b", label: "Nothing changes — CAS is always faster than a lock at any contention level." },
          { id: "c", label: "The threads deadlock, because forty CAS loops can wait on each other in a cycle." },
          { id: "d", label: "The counter silently loses updates once contention exceeds the number of CPU cores." },
        ],
        correctOptionId: "a",
        explanation:
          "CAS is optimistic: it wins when conflicts are rare, but under heavy contention nearly every attempt is wasted work and the retries spin hot. LongAdder gives each thread its own cell and sums on read, removing the hot word entirely. CAS is not universally faster (b), it cannot deadlock because no thread holds anything (c), and it never loses updates — that's the guarantee it provides (d).",
      },
    ],
  },
};
