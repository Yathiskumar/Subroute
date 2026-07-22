import type { RoadmapLesson } from "@/lib/content/types";

export const memoryVisibility: RoadmapLesson = {
  title: "Memory visibility & the memory model",
  oneLiner:
    "A lock stops two threads from touching the same data *at the same time*. But there's a second, completely separate problem: a value one thread writes may never be **seen** by another — possibly forever. Picture two people, each with a private notebook, sharing one whiteboard: Amy scribbles \"done ✓\" in *her notebook*, meaning to copy it to the board later, while Ben keeps checking the board — or worse, his own stale copy — and waits forever. `volatile` is the rule \"always write straight to the whiteboard, always read from the whiteboard.\"",
  difficulty: "advanced",
  estimatedTime: "15 min",
  prototypePath: "/prototypes/lld/memory-visibility.html",
  content: {
    prototypeCaption:
      "Two CPU cores side by side, each with its own **cache** cell holding a copy of `done`, and one **Main memory (RAM)** bar underneath. Thread B is already spinning — the `spins:` counter climbs on its own. In **🟡 plain** mode, hit `▶ A: done = true`: only *Core 1's* cache turns green while **RAM done** and **Core2 sees** stay red — and the spins keep climbing. Wait a moment and B's lane rewrites itself to `r1 = done; while (!r1) { }` with a 🌀 *read hoisted into a register* tag: now B can never notice. Switch to **⚡ volatile** and write again — a dot travels from Core 1 down to RAM, RAM flips true, Core 2's copy is struck through (invalidated), and B's next read pulls from RAM and exits, lane green. **🔒 lock** does the same thing for a different reason. Below, the **🔀 Reordering** strip lets you `⇄ Swap` `data = 42;` and `ready = true;` then `▶ Run A` — B flashes red when it sees `ready == true` but `data == 0`. In volatile or lock mode the swap button becomes 🔒 Locked.",

    overview: [
      {
        type: "p",
        text: "Most people learn locks first and assume that's the whole story of thread safety. It isn't. A lock gives you **mutual exclusion** — only one thread inside the critical section at a time. But there is a second, independent problem hiding underneath: **visibility**. A value that thread A writes may not be *seen* by thread B — not late, not eventually, but possibly **never**. Your program isn't crashing or corrupting anything; B is simply looking at an old value and will keep looking at it until the heat death of the universe.",
      },
      {
        type: "p",
        text: "Here's the picture to keep. **Amy and Ben each have their own notebook, and they share one whiteboard.** The whiteboard is main memory (RAM); the notebooks are the private caches that sit inside each CPU core. Amy finishes her job and writes *\"done ✓\"* — but she writes it **in her own notebook**, intending to copy it to the whiteboard whenever she gets around to it. Ben, meanwhile, is watching the whiteboard, which still says *not done*. Or worse: Ben copied the board into *his* notebook once and now just re-reads his own copy. Amy is done. Ben will wait forever. Nobody lied, nobody crashed — the news just never travelled.",
      },
      {
        type: "p",
        text: "Two separate things cause this. **Hardware:** each core has its own cache and a store buffer, so a write can sit in one core's private memory instead of going out to RAM. **Software:** the compiler and the JIT are allowed to keep a variable in a **CPU register** and to reorder independent statements, because both are invisible *within a single thread*. The rules that say when one thread's writes must become visible to another are called the language's **memory model** — and `volatile` is the smallest tool that language gives you to force the issue.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Correct multithreaded code needs **two** guarantees, not one: *mutual exclusion* (only one thread at a time) **and** *visibility* (my write actually reaches your eyes). A lock gives you both. `volatile` gives you only the second — which is exactly why it fixes a stop-flag and does **not** fix `count++`.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've probably already hit this",
        text: "The classic symptom is a background thread that ignores its stop flag: you set `running = false`, the worker keeps going, and it *works fine* when you add a `System.out.println` or run it in the debugger — because printing takes a lock, which happens to flush memory. That's not a heisenbug in your logic; it's a missing visibility guarantee.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Why a write can go missing" },
      {
        type: "p",
        text: "Reading and writing main memory is slow — hundreds of times slower than a CPU instruction. So every core keeps a small private **cache** and a **store buffer** in front of it. When a thread writes a variable, the value first lands in that core's private storage; hardware will push it out to RAM and invalidate other cores' copies eventually, but *your program's* rules don't promise when. Meanwhile the other core happily serves reads out of *its* cache, which still holds the old value.",
      },
      {
        type: "ul",
        items: [
          "**The core's cache** — a private copy of the data each core is working on. Two cores can hold two different values for the same variable at the same moment.",
          "**The store buffer** — a write queue in front of the cache, so the core doesn't stall waiting for memory. A write parked here hasn't reached anybody else yet.",
          "**Registers** — the fastest storage of all, and the one that isn't memory at all. If the compiler decides to keep `done` in a register, no cache protocol on earth can help you: the thread has stopped *reading memory*.",
        ],
      },
      { type: "h", text: "The infinite-spin bug" },
      {
        type: "p",
        text: "This is the canonical example, and it's mostly a *compiler* bug rather than a hardware one. You write a loop that waits for a flag. The compiler notices that inside the loop body nothing ever assigns to `done`, so re-reading it every iteration is (from this thread's point of view) pointless work. So it **hoists the read out of the loop** into a register:",
      },
      {
        type: "code",
        language: "java",
        code: `// what you wrote                      // what the JIT is allowed to run
boolean done = false;                   boolean r1 = done;      // read ONCE
                                        if (!r1) {
while (!done) {          ───────▶           while (true) { }    // never re-reads
    // spin                             }
}`,
      },
      {
        type: "p",
        text: "That transformation is perfectly legal, because it is **invisible in a single thread**: no single-threaded program could tell the difference. It becomes catastrophic the moment another thread writes the flag. Marking the field `volatile` removes the compiler's permission: every read must go to the shared location, every write must go to the shared location.",
      },
      { type: "h", text: "What volatile actually promises" },
      {
        type: "ul",
        items: [
          "**A volatile read** is guaranteed to see the *most recent* write — no register copy, no stale cache line. Read the whiteboard, not your notebook.",
          "**A volatile write** is immediately made visible to any thread that subsequently reads that variable. Write on the whiteboard, not in your notebook.",
          "**No reordering across it** — the compiler and CPU may not move ordinary reads/writes across a volatile access in a way another thread could observe. Everything Amy wrote *before* putting the flag on the board is on the board too.",
          "**No atomicity.** `volatile` does not make a read-modify-write indivisible. It is a visibility and ordering tool, full stop.",
        ],
      },
      {
        type: "code",
        language: "java",
        code: `class Worker implements Runnable {
    private volatile boolean done = false;   // ← the whole fix

    public void run() {
        while (!done) {        // volatile read: goes to shared memory every time
            doWork();
        }
    }

    public void stop() {
        done = true;           // volatile write: published immediately
    }
}`,
      },
      { type: "h", text: "Reordering: the second surprise" },
      {
        type: "p",
        text: "The compiler and the CPU may execute independent statements **out of order** — again, because it's undetectable from inside one thread. Write `data = 42;` then `ready = true;` and another thread may genuinely observe `ready == true` while `data` is still `0`. It saw the flag before the payload. This is the `⇄ Swap` demo in the prototype, and it is the reason \"set the data, then set the flag\" is not, by itself, safe. Making `ready` volatile fixes it: everything written before the volatile write is visible to anyone who reads that volatile and sees the new value.",
      },
      { type: "h", text: "Happens-before, in plain words" },
      {
        type: "p",
        text: "**Happens-before** is the rule the memory model uses to answer \"is this write guaranteed visible?\". It is *not* about wall-clock time. It means: **if action A happens-before action B, then everything A wrote is guaranteed to be visible to B.** If there is no happens-before edge between two actions, the memory model promises you nothing at all — and \"nothing\" includes *never*. You create these edges with a small, fixed set of moves:",
      },
      {
        type: "ul",
        items: [
          "**Unlock → lock on the same lock.** Everything a thread did before releasing a lock is visible to the next thread that acquires it. This is why consistent locking gives you visibility *for free*.",
          "**Volatile write → volatile read of the same variable.** Same deal, without the exclusion.",
          "**`Thread.start()`** — everything the parent did before starting a thread is visible to that new thread.",
          "**`Thread.join()`** — everything the finished thread did is visible to whoever joins it.",
          "**Final-field publication** — a properly constructed object's `final` fields are visible to any thread that gets a reference to it, with no extra synchronization.",
          "**Transitivity** — if A happens-before B and B happens-before C, then A happens-before C. Edges chain.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "volatile gives visibility, NOT atomicity",
        text: "`volatile int count; count++;` is **still a broken race**. The `++` is three separate operations — read, add, write — and `volatile` only guarantees that each of those touches real memory. Two threads can both read `7`, both compute `8`, and both store `8`; you lost an increment. For read-modify-write you need an **atomic** (`AtomicInteger`, `std::atomic<int>`, `atomic.AddInt64`) or a lock. Rule of thumb: `volatile` is for a value that one thread *sets* and others *read* — a flag, a reference, a cached configuration — never for a counter.",
      },
      { type: "h", text: "Safe publication and the half-built object" },
      {
        type: "p",
        text: "The nastiest version of this bug isn't a boolean, it's an object. Thread A does `config = new Config(...)` and thread B reads `config`. Without a happens-before edge, B can see a **non-null reference to a half-constructed object**: the reference write became visible before the writes that filled in the fields. B reads `config.timeout` and gets `0`. Publishing an object safely means handing it over across a happens-before edge — store it in a `volatile` field or an `AtomicReference`, store it while holding a lock that readers also hold, initialise it in a static initialiser, or make it immutable with all-`final` fields.",
      },
      { type: "h", text: "One line per language" },
      {
        type: "ul",
        items: [
          "**Java** — the **Java Memory Model** (rewritten by JSR-133 in Java 5) is the specification that defines happens-before, `volatile`, `final`-field safety, and what a data race is; before JSR-133, `volatile` and double-checked locking were genuinely broken.",
          "**C++** — `std::atomic<T>` with **memory orders**: the default `memory_order_seq_cst` is the safe, intuitive one (a single global order everyone agrees on); `memory_order_relaxed` is faster but gives you visibility with *no* ordering, and `acquire`/`release` is the middle ground. A plain data race in C++ is formally **undefined behaviour**, not just a wrong answer.",
          "**Go** — the official advice from the Go memory model is *don't be clever*: **\"Don't communicate by sharing memory; share memory by communicating.\"** Use channels, `sync.Mutex`, or `sync/atomic` — and run your tests with the built-in **race detector** (`go test -race`), which catches missing happens-before edges at runtime.",
          "**Python** — CPython's GIL makes many races *look* impossible, but it does not make compound operations atomic and it is not a portable guarantee. Use `threading.Event`, `Lock`, or `queue.Queue` to publish state between threads.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "The practical takeaway",
        text: "If you already guard a piece of shared state with the **same lock** on every read and every write, you get visibility for free — you never need to think about caches, registers or reordering for that state. Reach for `volatile` only in the narrow case where a lock is overkill: a single flag or reference that one thread writes and others just read.",
      },
    ],

    handsOn: [
      {
        title: "01 · Watch a write disappear (🟡 plain)",
        body: "Leave the toggle on 🟡 plain and notice B is already running — the spins: counter climbs on its own while Core2 sees stays false. Now click ▶ A: done = true. Only Core 1's cache cell turns green; the RAM bar and Core 2's cache stay red, and the scoreboard still reads RAM done: false · Core2 sees: false. Press ▶ B: check a few times: B keeps reading its own stale copy. Wait a moment and B's lane rewrites itself to r1 = done; while (!r1) { } with a 🌀 read hoisted into a register tag — the compiler cached the value, so B can never notice. That's the infinite-spin bug.",
      },
      {
        title: "02 · Fix it with ⚡ volatile (and see 🔒 lock do the same)",
        body: "Click ⚡ volatile (this resets the demo) and hit ▶ A: done = true again. A green dot travels from Core 1 down to the Main memory (RAM) bar, RAM flips to true, and Core 2's cached copy is struck through — invalidated. A beat later B's next read pulls from RAM, its lane turns green with done ✓ — loop exited, and the spins counter freezes. Now click 🔒 lock and repeat: the same publication happens, but the explain panel names the reason — unlock → lock on the same lock is a happens-before edge. Consistent locking gives you visibility for free.",
      },
      {
        title: "03 · Break the order in the 🔀 Reordering strip",
        body: "Back on 🟡 plain, look at the bottom strip: A writes ① data = 42; then ② ready = true;. Press ▶ Run A and B ends up seeing data: 42 · ready: true — fine. Now press ⇄ Swap so ready is written first, and run it again: B's panel flashes red at data: 0 · ready: true — it saw the flag before the data. Switch to ⚡ volatile and the button becomes 🔒 Locked: a volatile write forbids reordering across it, so the data always lands first. Hit ↺ Reset any time to replay.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "Visibility.java",
        code: `import java.util.concurrent.atomic.AtomicInteger;

public class Visibility {

    // ❌ WITHOUT volatile: the JIT may hoist the read of 'done' into a
    //    register, so this worker can spin forever after stop() is called.
    static class BrokenWorker extends Thread {
        private boolean done = false;             // plain field
        public void run() {
            while (!done) { /* spin */ }          // may never re-read memory
            System.out.println("broken worker finished");
        }
        void stop_() { done = true; }             // write may stay in this core
    }

    // ✅ WITH volatile: every read goes to shared memory, every write is
    //    published immediately, and nothing is reordered across it.
    static class GoodWorker extends Thread {
        private volatile boolean done = false;    // visibility + ordering
        public void run() {
            while (!done) { /* spin */ }
            System.out.println("good worker finished");
        }
        void stop_() { done = true; }
    }

    // Safe publication: 'data' is written BEFORE the volatile flag, so any
    // thread that sees ready == true is guaranteed to see data == 42.
    static int data = 0;
    static volatile boolean ready = false;

    static void publisher() { data = 42; ready = true; }   // order preserved
    static void consumer()  { if (ready) assert data == 42; }

    // volatile is NOT atomic — count++ is read, add, write (three steps).
    static volatile int badCount = 0;             // still a race!
    static final AtomicInteger goodCount = new AtomicInteger();

    public static void main(String[] args) throws Exception {
        GoodWorker w = new GoodWorker();
        w.start();                                // start() = happens-before edge
        Thread.sleep(50);
        w.stop_();
        w.join();                                 // join() = happens-before edge

        badCount++;                               // lost updates under contention
        goodCount.incrementAndGet();              // atomic read-modify-write

        // A lock gives BOTH exclusion and visibility:
        Object lock = new Object();
        synchronized (lock) { data = 7; }         // unlock publishes to memory
        synchronized (lock) { System.out.println(data); }  // lock sees it
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "visibility.py",
        code: `import threading
import time

# CPython's GIL hides many visibility problems, but it does NOT make
# compound operations atomic — and it is not a portable guarantee.
# Publish state between threads with Event / Lock / Queue instead.

# ---- the flag: use threading.Event, not a bare bool ----
done = threading.Event()          # the "whiteboard": safe to read anywhere


def worker() -> None:
    while not done.is_set():      # a real, synchronized read every time
        time.sleep(0.01)          # do work
    print("worker finished")


# ---- safe publication: build it, then hand it over under a lock ----
_lock = threading.Lock()
_config = None                    # shared reference


def publish(timeout: int) -> None:
    global _config
    cfg = {"timeout": timeout}    # fully built FIRST...
    with _lock:                   # ...then published inside the lock
        _config = cfg


def read_config() -> dict | None:
    with _lock:                   # same lock on the read side = happens-before
        return _config


# ---- counters: += is read-modify-write, so it needs a lock ----
count = 0
_count_lock = threading.Lock()


def bump() -> None:
    global count
    with _count_lock:             # without this, increments are lost
        count += 1


t = threading.Thread(target=worker)
t.start()                         # start() publishes everything written before
time.sleep(0.05)
publish(30)
done.set()                        # flips the flag for the worker
t.join()                          # join() publishes the worker's writes back
print(read_config(), count)`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "visibility.cpp",
        code: `#include <atomic>
#include <chrono>
#include <iostream>
#include <thread>

// In C++ a data race on a plain variable is UNDEFINED BEHAVIOUR — not
// "an old value", but "the compiler may do anything". Use std::atomic.

std::atomic<bool> done{false};        // seq_cst by default: safest ordering
int data = 0;                         // plain int, published via 'done'

void worker() {
    while (!done.load()) {            // atomic load: real memory, every time
        // spin
    }
    std::cout << "worker saw data = " << data << "\\n";   // guaranteed 42
}

int main() {
    std::thread t(worker);

    data = 42;                        // 1. write the payload...
    done.store(true);                 // 2. ...then the flag (release semantics)
    //    Nothing above can be reordered past this seq_cst store, so any
    //    thread that observes done == true also observes data == 42.

    t.join();                         // join = happens-before edge

    // Explicit memory orders: acquire/release is the cheap correct pair.
    std::atomic<bool> flag{false};
    flag.store(true, std::memory_order_release);   // publish
    flag.load(std::memory_order_acquire);          // consume

    // relaxed = visibility WITHOUT ordering: fast, but nothing around it
    // is ordered. Only safe for standalone counters and statistics.
    std::atomic<int> hits{0};
    hits.fetch_add(1, std::memory_order_relaxed);  // atomic increment

    std::cout << hits.load() << "\\n";
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "visibility.go",
        code: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

// Go's rule: "Don't communicate by sharing memory; share memory by
// communicating." Prefer channels; use sync/atomic for simple flags.
// Run your tests with:  go test -race   (the built-in race detector
// reports reads and writes with no happens-before edge between them).

func main() {
	// ---- 1. the idiomatic way: a channel IS the happens-before edge ----
	dataCh := make(chan int)
	go func() {
		dataCh <- 42 // a send happens-before the matching receive
	}()
	fmt.Println("got", <-dataCh) // guaranteed to see everything sent

	// ---- 2. a stop flag without a channel: atomic.Bool ----
	var done atomic.Bool // NOT a plain bool: that would be a data race
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		for !done.Load() { // real memory read every iteration
			// work
		}
	}()
	done.Store(true) // published immediately
	wg.Wait()        // Wait() is a happens-before edge too

	// ---- 3. shared state guarded by a mutex gets visibility for free ----
	var mu sync.Mutex
	shared := 0
	mu.Lock()
	shared = 7 // Unlock publishes every write made while holding the lock
	mu.Unlock()

	mu.Lock()
	fmt.Println("shared =", shared) // Lock sees the previous Unlock's writes
	mu.Unlock()

	// ---- 4. counters need an atomic, not just visibility ----
	var hits atomic.Int64
	hits.Add(1) // read-modify-write, indivisible
	fmt.Println("hits =", hits.Load())
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for volatile when..." },
      {
        type: "ul",
        items: [
          "**One thread writes a simple flag, others only read it** — a `running`/`shutdown` boolean, a \"config reloaded\" marker. This is `volatile`'s home turf and a lock would be pure overhead.",
          "**You publish an immutable object by swapping a reference** — build it fully, then assign it to a `volatile` field. Readers either see the old object or the fully-built new one, never a half-built one.",
          "**A value is written independently of its previous value** — that's the dividing line. If the new value doesn't depend on the old one, `volatile` is enough.",
          "**Double-checked locking** — the classic lazy singleton needs the instance field to be `volatile`, or a second thread can get a non-null reference to a half-constructed object.",
        ],
      },
      { type: "h", text: "Use a lock or an atomic instead when..." },
      {
        type: "ul",
        items: [
          "**The operation is read-modify-write** — counters, `check-then-act`, `if (map.get(k) == null) map.put(k, v)`. Use `AtomicInteger`/`std::atomic`/`sync/atomic`, or a lock.",
          "**Two or more fields must change together** — `volatile` protects one variable at a time and can't give you an all-or-nothing update across several.",
          "**You already hold a lock on that state everywhere** — then stop worrying: consistent locking already gives you visibility, and adding `volatile` on top just adds noise.",
          "**You're reaching for `relaxed` memory orders to go faster** — measure first. Almost every real bottleneck is elsewhere, and relaxed ordering is one of the easiest ways to write code that is wrong only on some machines.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Correct visibility — a volatile read is guaranteed to see the latest write, killing stale-cache and hoisted-register bugs outright.",
        "Ordering for free — writes made before a volatile write are visible to anyone who reads that volatile and sees the new value, which is what makes safe publication work.",
        "Much cheaper than a lock for the read-mostly flag case: no blocking, no context switches, no deadlock risk, and readers never contend with each other.",
        "It's one keyword on one field — the fix is local and reviewable, unlike restructuring code around a new lock.",
      ],
      cons: [
        "No atomicity — the single biggest source of false confidence: `volatile count++` still loses updates, and many developers assume otherwise.",
        "Single-variable scope — it cannot make two related fields change together, so invariants spanning multiple variables still need a lock.",
        "Not free — volatile accesses insert memory barriers, so a volatile in a hot inner loop can be noticeably slower than a plain field.",
        "Easy to under-apply and hard to test — code missing a happens-before edge usually passes every test on your laptop and fails in production on different hardware.",
      ],
    },

    furtherReading: [
      {
        label: "JSR-133 (Java Memory Model) FAQ — Manson & Goetz",
        href: "https://www.cs.umd.edu/~pugh/java/memoryModel/jsr-133-faq.html",
        note: "The single best plain-English explanation of happens-before, what volatile really promises, final-field safety, and why the pre-Java-5 model was broken. Start here.",
        kind: "article",
      },
      {
        label: "Java Language Specification, Chapter 17 — Threads and Locks",
        href: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html",
        note: "The normative definition: the happens-before order, volatile semantics, final-field guarantees and what constitutes a data race. Dense, but it's the actual rulebook.",
        kind: "spec",
      },
      {
        label: "Java Concurrency in Practice — Brian Goetz et al.",
        href: "https://jcip.net/",
        note: "Chapter 3, 'Sharing Objects', is the canonical treatment of visibility, stale data, safe publication and when volatile is (and isn't) enough.",
        kind: "book",
      },
      {
        label: "std::memory_order — cppreference",
        href: "https://en.cppreference.com/w/cpp/atomic/memory_order",
        note: "The reference for C++ atomics: seq_cst, acquire/release and relaxed, with worked examples showing exactly which reorderings each one still permits.",
        kind: "docs",
      },
      {
        label: "The Go Memory Model",
        href: "https://go.dev/ref/mem",
        note: "Short and readable. Defines Go's happens-before edges (channel send/receive, mutex, WaitGroup, once) and states outright that racy programs have undefined behaviour.",
        kind: "docs",
      },
      {
        label: "Java Memory Model Pragmatics — Aleksey Shipilev",
        href: "https://shipilev.net/blog/2014/jmm-pragmatics/",
        note: "A deep, example-driven tour from a JVM engineer: what the hardware and JIT actually do, why intuitive reasoning fails, and how to test concurrent code with jcstress.",
        kind: "article",
      },
      {
        label: "How to Make a Multiprocessor Computer That Correctly Executes Multiprocess Programs — Leslie Lamport (1979)",
        href: "https://www.microsoft.com/en-us/research/publication/make-multiprocessor-computer-correctly-executes-multiprocess-programs/",
        note: "The paper that defined sequential consistency — the idealised model every modern memory model is a relaxation of. Three pages, and the origin of the whole field.",
        kind: "paper",
      },
    ],

    quiz: [
      {
        id: "memory-visibility-q1",
        question:
          "Thread A sets a plain (non-volatile) `boolean done = true`. Thread B runs `while (!done) {}`. What can happen?",
        options: [
          { id: "a", label: "B may never see the write and spin forever — the value can stay in A's core cache, or B's read can be hoisted into a register." },
          { id: "b", label: "B always sees it, just a few microseconds late — memory eventually synchronises." },
          { id: "c", label: "The program throws a ConcurrentModificationException." },
          { id: "d", label: "B sees a corrupted, half-written boolean." },
        ],
        correctOptionId: "a",
        explanation:
          "Without a happens-before edge the memory model promises nothing at all — and 'nothing' includes 'never'. Two things conspire: A's write can sit in its core's cache/store buffer, and the JIT can hoist B's read out of the loop into a register so it stops reading memory entirely. (b) is the common false assumption: 'eventually' is not guaranteed. There is no exception thrown (c), and a boolean write is not torn (d) — the value B reads is a perfectly valid *old* value.",
      },
      {
        id: "memory-visibility-q2",
        question: "What does `volatile` guarantee?",
        options: [
          { id: "a", label: "Visibility and ordering: reads and writes go to shared memory, and other reads/writes aren't reordered across it — but no atomicity." },
          { id: "b", label: "Mutual exclusion: only one thread can touch the field at a time." },
          { id: "c", label: "That compound operations like count++ become indivisible." },
          { id: "d", label: "That the field is stored in RAM rather than in the CPU cache, making access faster." },
        ],
        correctOptionId: "a",
        explanation:
          "volatile is a visibility-and-ordering tool: every read sees the most recent write and nothing is reordered across the access. It provides no mutual exclusion (b) and no atomicity — so (c) is exactly the misconception that makes `volatile count++` a broken race. And it's a correctness feature, not a speed one: it inserts memory barriers, so it is *slower* than a plain field (d).",
      },
      {
        id: "memory-visibility-q3",
        question: "You have `volatile int hits;` and several threads run `hits++`. Is that correct?",
        options: [
          { id: "a", label: "No — `++` is read, add, write; volatile makes each step touch memory but the three together are still not atomic, so increments get lost." },
          { id: "b", label: "Yes — volatile makes the whole increment atomic." },
          { id: "c", label: "Yes, as long as there are only two threads." },
          { id: "d", label: "No, because volatile is not allowed on int fields." },
        ],
        correctOptionId: "a",
        explanation:
          "A read-modify-write is three operations. Two threads can both read 7, both compute 8, and both store 8 — one increment vanishes. volatile guarantees each read and each write sees real memory, not that the trio is indivisible; use AtomicInteger or a lock. Thread count is irrelevant (c), and volatile is perfectly legal on an int (d) — it's just not sufficient here.",
      },
      {
        id: "memory-visibility-q4",
        question: "In plain words, what does 'A happens-before B' mean in a memory model?",
        options: [
          { id: "a", label: "Everything A wrote is guaranteed to be visible to B — it's a visibility guarantee, not a statement about clock time." },
          { id: "b", label: "A finished earlier than B on the wall clock." },
          { id: "c", label: "A and B can never run at the same time." },
          { id: "d", label: "The scheduler will always run thread A before thread B." },
        ],
        correctOptionId: "a",
        explanation:
          "Happens-before is an ordering *on visibility*: if the edge exists, B is guaranteed to see A's writes. Wall-clock order (b) means nothing on its own — A can finish first and still be invisible to B if no edge exists. It says nothing about exclusion (c) or about scheduling (d); you create edges with unlock→lock on the same lock, volatile write→read, Thread.start(), Thread.join(), and final-field publication.",
      },
      {
        id: "memory-visibility-q5",
        question: "Thread A runs `data = 42; ready = true;` with both fields plain. Thread B checks `if (ready) use(data);`. What can go wrong?",
        options: [
          { id: "a", label: "B can see ready == true while data is still 0 — the two independent writes may be reordered or become visible out of order." },
          { id: "b", label: "Nothing — statements always become visible in the order they were written." },
          { id: "c", label: "B will deadlock waiting for the flag." },
          { id: "d", label: "data will be visible but ready will not, so B simply skips the work." },
        ],
        correctOptionId: "a",
        explanation:
          "The compiler and CPU may reorder independent statements because it's undetectable inside a single thread — so B can observe the flag before the payload and act on a half-published value. Source order is not a visibility guarantee (b). Nothing blocks, so there's no deadlock (c), and (d) describes a harmless outcome rather than the dangerous one. Making `ready` volatile fixes it: everything written before a volatile write is visible to anyone who reads that volatile and sees the new value.",
      },
      {
        id: "memory-visibility-q6",
        question: "Your shared counter is already read and written only while holding the same lock. Should you also mark it volatile?",
        options: [
          { id: "a", label: "No — unlock→lock on the same lock is a happens-before edge, so consistent locking already gives you visibility; volatile would add noise and cost." },
          { id: "b", label: "Yes, locks only provide mutual exclusion; visibility always needs volatile as well." },
          { id: "c", label: "Yes, otherwise the JIT will hoist the read even inside the critical section." },
          { id: "d", label: "It doesn't matter — locks and volatile do exactly the same thing." },
        ],
        correctOptionId: "a",
        explanation:
          "A lock gives you both guarantees: mutual exclusion *and* visibility, because releasing a lock publishes everything written while holding it to the next thread that acquires it. So (b) and (c) are wrong — that's the whole point of the happens-before edge. And they are not the same thing (d): volatile gives visibility and ordering but no exclusion and no atomicity, which is why it can't replace a lock for compound updates.",
      },
    ],
  },
};
