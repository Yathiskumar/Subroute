import type { RoadmapLesson } from "@/lib/content/types";

export const deadlockRaceStarvation: RoadmapLesson = {
  title: "Deadlock, race conditions, starvation",
  oneLiner:
    "Three classic ways concurrent code goes wrong, and they fail in three different shapes. A **race condition** is two people updating the same shopping list from memory — one edit quietly overwrites the other. A **deadlock** is two diners each holding one chopstick, each politely waiting for the other's — nobody eats, ever. **Starvation** is the polite person at a crowded bar who never gets served because louder people keep cutting in. Learn to spot the shape and the fix follows.",
  difficulty: "intermediate",
  estimatedTime: "15 min",
  prototypePath: "/prototypes/lld/deadlock-race-starvation.html",
  content: {
    prototypeCaption:
      "Three tabs, one failure each. **⚡ Race** — two threads want to add 1 to a shared `count`. Press **▶ Interleave** six times and watch the micro-steps `read` `+1` `write` interleave: T1 reads 0, T2 reads the same 0, both write 1, and the caption ends at `count: 1 ✗ expected 2` with the box flashing red. Now hit **🔒 Add lock** and step through the *exact same* actions — T2's lane greys out until T1 is done, and you land on `count: 2 ✓`. **💀 Deadlock** — click **T1 grab A**, **T2 grab B**, **T1 wants B**, **T2 wants A**; the four arrows close into a red loop, a 💀 DEADLOCK chip drops in, and the caption reads `blocked: 2/2 forever`. Flip **↻ Same order** and replay: now both threads take A before B, T2 simply waits holding nothing, and everyone finishes. **🥱 Starvation** — press **▶ Tick** a few times: the two 🐷 hogs keep grabbing the 🍽 resource while 🙂 Polite's `waited:` counter climbs and its lane turns amber. Hit **⚖️ Fair queue** and the very next tick serves Polite, counter back to `0 ✓`.",

    overview: [
      {
        type: "p",
        text: "The moment two threads touch the same thing, three specific bugs become possible. They are worth learning as a set because they *feel* completely different when they hit you: a **race condition** gives you a wrong answer with everything still running; a **deadlock** gives you a program that stops dead with no error and no CPU usage; **starvation** gives you a program that works fine except one poor thread that never seems to get anything done.",
      },
      {
        type: "p",
        text: "Here's each one in one picture. **Race condition** — you and a flatmate both memorise the shopping list, both add one item from memory, and both write the list back: one of the two additions vanishes. **Deadlock** — two diners share two chopsticks; each grabs one and waits for the other to hand theirs over; both wait forever. **Starvation** — you're at a busy bar waiting politely while louder people keep getting served ahead of you; nothing is broken, you're just never picked.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A **race** is *wrong answer* (two threads interleave inside one logical step), a **deadlock** is *nobody moves* (a cycle of threads each waiting on a lock the next one holds), and **starvation** is *someone never moves* (a thread that could run but never gets picked). Locks fix races — and *cause* deadlocks and starvation.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Where you've met these",
        text: "A double-charged payment or a like count that drifts low is usually a race. A web app that hangs with 0% CPU until you restart it is usually a deadlock — a thread dump will show two threads each `BLOCKED` on a monitor the other owns. A background job that never finishes while the request threads fly along is usually starvation.",
      },
    ],

    howItWorks: [
      { type: "h", text: "1. Race condition — the interleaving that eats an update" },
      {
        type: "p",
        text: "The trap is that `count++` is not one step. The CPU does three: **read** the value into a register, **add** one, **write** it back. Two threads can slide in between each other's steps, and then both add 1 to the *same* starting value — so two increments produce one.",
      },
      {
        type: "code",
        language: "java",
        code: `// Both threads run this. count starts at 0.
count++;      // really: 1. read count   2. add 1   3. write count

//  T1: read 0 ....................... add → 1 ... write 1
//  T2: ......... read 0 ... add → 1 ............ write 1
//  count is now 1. Two increments happened. One survived.`,
      },
      {
        type: "p",
        text: "The fix is to make the whole read-modify-write **atomic** — indivisible from any other thread's point of view. Either wrap it in a lock (a *critical section*: at most one thread inside at a time) or use a hardware atomic like `AtomicInteger.incrementAndGet()` / `atomic.Add`. Both mean the same thing: nobody else can observe or touch the value halfway through.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Why races are the nastiest of the three",
        text: "A race is **timing-dependent**. Whether it bites depends on when the OS happens to switch threads, so it can pass your test suite 99 runs out of 100 on a quiet laptop and then fail every hour in production on a 32-core box under load. There's no crash, no stack trace — just numbers that are slightly, inexplicably wrong. Never conclude 'the race is fixed' because the test went green; reason about the code, and use a race detector (Go's `-race`, Java's jcstress, C++ ThreadSanitizer).",
      },
      { type: "h", text: "2. Deadlock — the cycle of polite waiting" },
      {
        type: "p",
        text: "Thread 1 holds lock A and needs B. Thread 2 holds lock B and needs A. Neither will let go of what it has before it gets what it wants, so both wait forever. Nothing crashes; the threads just go to sleep and never wake. Draw the waiting relationships as arrows and you'll see a **cycle** — that ring is the signature of a deadlock.",
      },
      {
        type: "p",
        text: "A deadlock needs **four conditions to hold at once** (the *Coffman conditions*). Break any single one and deadlock becomes impossible:",
      },
      {
        type: "ul",
        items: [
          "**Mutual exclusion** — the resource can only be held by one thread at a time. (Break it: use immutable data or a copy per thread, so there's nothing to lock.)",
          "**Hold and wait** — a thread keeps what it has while waiting for more. (Break it: grab *all* the locks you need in one shot, or release what you hold before waiting.)",
          "**No preemption** — you can't yank a lock away from a thread. (Break it: `tryLock` with a timeout, so a waiter gives up, releases everything, and retries.)",
          "**Circular wait** — the waiting arrows form a ring. (Break it: a **global lock order** — every thread takes A before B, always. This is the fix you'll use 90% of the time.)",
        ],
      },
      {
        type: "code",
        language: "java",
        code: `// ✗ Two orders → a ring is possible
void t1() { synchronized (A) { synchronized (B) { work(); } } }   // A → B
void t2() { synchronized (B) { synchronized (A) { work(); } } }   // B → A

// ✓ One global order → no ring can ever form
void t1() { synchronized (A) { synchronized (B) { work(); } } }   // A → B
void t2() { synchronized (A) { synchronized (B) { work(); } } }   // A → B
// T2 now waits at A holding NOTHING, so it can't block anybody.`,
      },
      {
        type: "p",
        text: "Other real fixes, in rough order of preference: **take fewer locks** (one coarse lock is boring and correct), **hold them for less time** (never call unknown code — a callback, an RPC — while holding a lock), **`tryLock` with a timeout** so a stuck thread backs off and retries instead of hanging, and best of all **no shared mutable state at all** (message passing, immutable values, one owner per piece of data).",
      },
      {
        type: "callout",
        variant: "info",
        title: "Livelock — deadlock's twitchy cousin",
        text: "If both threads keep timing out, backing off, and retrying in perfect lockstep, they stay busy but never progress — like two people stepping side to side in a corridor, forever. That's **livelock**: CPU is burning, work isn't happening. The cure is a *randomised* back-off so the symmetry breaks.",
      },
      { type: "h", text: "3. Starvation — able to run, never picked" },
      {
        type: "p",
        text: "A starving thread is not stuck on anything — it is *runnable*. It just never wins the turn, because greedier or higher-priority threads keep getting there first. Plain locks make no promise about who goes next: when a lock is released, whichever thread the OS happens to wake grabs it, and a thread that has waited a long time gets no special treatment. Under constant load, one unlucky thread can wait effectively forever.",
      },
      {
        type: "ul",
        items: [
          "**Fair locks / FIFO queues** — hand out turns in arrival order, so the longest waiter is served next. In Java that's `new ReentrantLock(true)`; more generally, put requests in a queue instead of letting threads scramble.",
          "**Don't play priority games** — big priority gaps let high-priority work permanently drown low-priority work. Keep priorities close to default unless you have a real reason.",
          "**Bound the greedy work** — batch sizes, per-client rate limits, and time slices stop one hot task from monopolising the resource.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Fairness isn't free — and priority inversion is real",
        text: "A fair lock guarantees turns but is markedly slower than a barging lock, because it hands the resource off between threads instead of letting whoever is already running keep it — so use it only when you actually observe starvation. And watch for **priority inversion**: a *low*-priority thread holding a lock blocks a *high*-priority one, which is exactly what nearly killed the Mars Pathfinder mission in 1997. The standard cure is priority inheritance — the lock holder temporarily inherits the waiter's priority.",
      },
      { type: "h", text: "Telling them apart when something goes wrong" },
      {
        type: "ul",
        items: [
          "**Wrong numbers, everything still running** → race condition. Look for shared mutable state touched without a lock or an atomic.",
          "**Hung, no CPU, no error** → deadlock. Take a thread dump: you'll see threads `BLOCKED`, each on a lock another blocked thread owns.",
          "**Hung, CPU pinned at 100%** → livelock or a spin loop, not a deadlock.",
          "**Everything works but one task never completes** → starvation. Check who else is hammering that lock, queue, or thread pool.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Lose an update, then get it back",
        body: "On the ⚡ Race tab, press ▶ Interleave six times. Watch the order: T1 read → T2 read (both see 0) → T1 +1 → T2 +1 → T1 write → T2 write. The caption ends at count: 1 ✗ expected 2 and the box flashes red — two increments, one survivor. Now click 🔒 Add lock and step through the same actions again: T2's lane greys out while T1 holds the lock, T2 later reads the fresh 1 instead of a stale 0, and you finish on count: 2 ✓. Same steps, one difference: the read-modify-write became indivisible.",
      },
      {
        title: "02 · Close the circular wait, then break it",
        body: "On the 💀 Deadlock tab, click the buttons left to right: T1 grab A, T2 grab B, T1 wants B, T2 wants A. After the third click one thread is amber (blocked: 1/2); after the fourth the arrows close into a red ring, the 💀 DEADLOCK chip appears and the caption reads blocked: 2/2 forever. Now hit ↻ Same order and replay — this time both threads take A then B, so T2 waits at A holding nothing, T1 finishes, and T2 walks through. One rule (always A before B) deleted the cycle.",
      },
      {
        title: "03 · Starve the polite thread, then queue it",
        body: "On the 🥱 Starvation tab, press ▶ Tick five or six times. The two 🐷 hogs alternate grabbing the 🍽 resource, their served: counters climb, and 🙂 Polite's lane turns amber with waited: 5, 6, 7… — it is never blocked, just never chosen. Click ⚖️ Fair queue and press ▶ Tick once: Polite is served immediately because FIFO picks the longest waiter, and the caption resets to waited: 0 ✓.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "ThreeBugs.java",
        code: `import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.TimeUnit;

public class ThreeBugs {

    /* ---------- 1. RACE CONDITION ---------- */
    static int plain = 0;                                   // ++ is read → add → write
    static final AtomicInteger atomic = new AtomicInteger(); // one indivisible step

    static void race() throws InterruptedException {
        Runnable job = () -> {
            for (int i = 0; i < 100_000; i++) {
                plain++;                     // ✗ interleaving silently loses updates
                atomic.incrementAndGet();    // ✓ atomic read-modify-write
            }
        };
        Thread a = new Thread(job), b = new Thread(job);
        a.start(); b.start(); a.join(); b.join();
        System.out.println(plain + " vs " + atomic.get());  // e.g. 137421 vs 200000
    }

    /* ---------- 2. DEADLOCK ---------- */
    static final Object A = new Object();
    static final Object B = new Object();

    static void deadlockProne() {            // ✗ this thread goes B → A
        synchronized (B) { synchronized (A) { /* work */ } }
    }

    static void safeOrder() {                // ✓ EVERY thread goes A → B
        synchronized (A) { synchronized (B) { /* work */ } }
    }

    static final ReentrantLock la = new ReentrantLock();
    static final ReentrantLock lb = new ReentrantLock();

    static boolean tryBoth() throws InterruptedException {   // ✓ back off instead of hanging
        if (!la.tryLock(50, TimeUnit.MILLISECONDS)) return false;
        try {
            if (!lb.tryLock(50, TimeUnit.MILLISECONDS)) return false;  // give up, retry later
            try { /* work */ } finally { lb.unlock(); }
            return true;
        } finally { la.unlock(); }
    }

    /* ---------- 3. STARVATION ---------- */
    static final ReentrantLock barging = new ReentrantLock();      // whoever grabs first wins
    static final ReentrantLock fifo    = new ReentrantLock(true);  // fair: longest waiter first

    static void politeThread() {
        fifo.lock();                          // queued in arrival order → always gets a turn
        try { /* work */ } finally { fifo.unlock(); }
    }

    public static void main(String[] args) throws InterruptedException {
        race();
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "three_bugs.py",
        code: `import queue
import threading

# ---------- 1. RACE CONDITION ----------
plain = 0
guarded = 0
lock = threading.Lock()


def work() -> None:
    global plain, guarded
    for _ in range(200_000):
        plain += 1          # ✗ read → add → write: another thread can slip in
        with lock:          # ✓ critical section: one thread inside at a time
            guarded += 1


t1, t2 = threading.Thread(target=work), threading.Thread(target=work)
t1.start(); t2.start(); t1.join(); t2.join()
print(plain, "vs", guarded)      # e.g. 271043 vs 400000


# ---------- 2. DEADLOCK ----------
A, B = threading.Lock(), threading.Lock()


def deadlock_prone() -> None:
    with B:                  # ✗ B → A while another thread does A → B = cycle
        with A:
            pass


def safe_order() -> None:
    with A:                  # ✓ everyone takes A before B — no cycle possible
        with B:
            pass


def try_with_timeout() -> bool:
    if not A.acquire(timeout=0.05):     # ✓ no preemption? give yourself an exit
        return False
    try:
        if not B.acquire(timeout=0.05):
            return False                # back off, release A, retry later
        try:
            pass                        # work
        finally:
            B.release()
        return True
    finally:
        A.release()


# ---------- 3. STARVATION ----------
# threading.Lock makes NO fairness promise. A FIFO queue does:
turns: "queue.Queue[str]" = queue.Queue()   # served strictly in arrival order`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "three_bugs.cpp",
        code: `#include <atomic>
#include <chrono>
#include <iostream>
#include <mutex>
#include <thread>

// ---------- 1. RACE CONDITION ----------
int plain = 0;                     // ++ is load → add → store
std::atomic<int> guarded{0};       // one indivisible read-modify-write

void work() {
    for (int i = 0; i < 100000; ++i) {
        ++plain;                   // ✗ data race — undefined behaviour, lost updates
        guarded.fetch_add(1);      // ✓ atomic
    }
}

// ---------- 2. DEADLOCK ----------
std::mutex a, b;

void deadlockProne() {             // ✗ b → a while someone else does a → b
    std::lock_guard<std::mutex> l1(b);
    std::lock_guard<std::mutex> l2(a);
}

void safeOrder() {                 // ✓ std::scoped_lock takes both at once,
    std::scoped_lock lk(a, b);     //   using a deadlock-avoidance algorithm
}

void backOff() {                   // ✓ try instead of blocking forever
    if (a.try_lock()) {
        std::lock_guard<std::mutex> keep(a, std::adopt_lock);
        // work
    } else {
        std::this_thread::sleep_for(std::chrono::milliseconds(1));  // retry later
    }
}

// ---------- 3. STARVATION ----------
// std::mutex gives NO fairness guarantee: a hot thread can re-acquire it
// again and again. If turns matter, put requests in your own FIFO queue.

int main() {
    std::thread t1(work), t2(work);
    t1.join();
    t2.join();
    std::cout << plain << " vs " << guarded.load() << "\\n";  // e.g. 138204 vs 200000
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "three_bugs.go",
        code: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

// ---------- 1. RACE CONDITION ----------
var plain int          // ++ is read → add → write
var guarded atomic.Int64 // one indivisible step

func work(wg *sync.WaitGroup) {
	defer wg.Done()
	for i := 0; i < 100000; i++ {
		plain++        // ✗ lost updates — "go run -race" reports this
		guarded.Add(1) // ✓ atomic
	}
}

// ---------- 2. DEADLOCK ----------
var a, b sync.Mutex

func deadlockProne() { // ✗ b → a while another goroutine does a → b
	b.Lock()
	a.Lock()
	a.Unlock()
	b.Unlock()
}

func safeOrder() { // ✓ every goroutine takes a before b
	a.Lock()
	defer a.Unlock()
	b.Lock()
	defer b.Unlock()
}

// Best of all: don't share memory. Give the data one owner and pass
// messages, so there is nothing to lock in the first place.
func owner(reqs <-chan int, done chan<- int) {
	total := 0
	for n := range reqs { // only THIS goroutine touches total
		total += n
	}
	done <- total
}

// ---------- 3. STARVATION ----------
// sync.Mutex flips into a FIFO "starvation mode" once a waiter has been
// queued for more than 1ms, so no goroutine waits forever.

func main() {
	var wg sync.WaitGroup
	wg.Add(2)
	go work(&wg)
	go work(&wg)
	wg.Wait()
	fmt.Println(plain, "vs", guarded.Load()) // e.g. 137204 vs 200000
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Go looking for these when..." },
      {
        type: "ul",
        items: [
          "**Any mutable state is reachable from two threads** — a counter, a cache, a shared list, a lazily built singleton. That is the entire precondition for a race.",
          "**A code path takes two or more locks** — the instant that happens, write down the order and make it a rule everyone follows. Two lock orders in one codebase is a deadlock waiting for load.",
          "**Threads have different priorities or wildly different workloads** — a fast, frequent task sharing a lock with a slow, rare one is the classic starvation setup.",
        ],
      },
      { type: "h", text: "Sidestep them entirely when..." },
      {
        type: "ul",
        items: [
          "**The state can be immutable** — nothing to race on, nothing to lock, no cycle to form. This is the cheapest fix in existence.",
          "**One thread can own the data** — an actor, a single-writer goroutine, an event loop. Others send messages instead of touching state.",
          "**A library already solved it** — `ConcurrentHashMap`, `AtomicLong`, `BlockingQueue`, channels. Hand-rolled locking loses to battle-tested primitives almost every time.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Locks make read-modify-write atomic, which removes lost updates — the single most common concurrency bug in real systems.",
        "A global lock ordering rule is nearly free: it costs one code-review habit and makes circular wait, and therefore deadlock, impossible.",
        "tryLock with a timeout converts a permanent hang into a retryable failure you can log, meter and alert on.",
        "Fair (FIFO) locks give a hard upper bound on waiting time, so no thread can be indefinitely postponed.",
      ],
      cons: [
        "Every lock you add is a new chance to deadlock or starve — the cure for one bug is the cause of the other two.",
        "Races are timing-dependent, so tests are weak evidence: a suite that passes proves nothing about interleavings it never happened to hit.",
        "Fair locks are noticeably slower than barging locks because the resource is handed off between threads instead of staying hot on one.",
        "More locks means less parallelism: taken far enough, a heavily locked design performs like single-threaded code with extra overhead.",
      ],
    },

    furtherReading: [
      {
        label: "Race Conditions and Critical Sections — Jenkov",
        href: "https://jenkov.com/tutorials/java-concurrency/race-conditions-and-critical-sections.html",
        note: "The clearest short explanation of why count++ is three steps and how a critical section makes it one. Best first read.",
        kind: "article",
      },
      {
        label: "Deadlock Prevention — Jenkov",
        href: "https://jenkov.com/tutorials/java-concurrency/deadlock-prevention.html",
        note: "Walks the three practical cures — lock ordering, lock timeout, deadlock detection — with concrete Java code for each.",
        kind: "article",
      },
      {
        label: "Operating Systems: Three Easy Pieces — Ch. 32, Concurrency Bugs",
        href: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf",
        note: "Free textbook chapter built on a study of real bugs in MySQL, Apache and Mozilla: atomicity violations, order violations and deadlock, with data on how often each occurs.",
        kind: "paper",
      },
      {
        label: "Deadlock — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Deadlock_(computer_science)",
        note: "Reference treatment of the four Coffman conditions, plus deadlock prevention, avoidance and detection, and the livelock distinction.",
        kind: "docs",
      },
      {
        label: "Java Concurrency in Practice — Goetz et al.",
        href: "https://jcip.net/",
        note: "The standard book on this material. Chapter 10 (Avoiding Liveness Hazards) is the definitive treatment of lock ordering, open calls and starvation.",
        kind: "book",
      },
      {
        label: "ReentrantLock — Java SE API docs",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html",
        note: "Read the fairness section: it spells out that fair locks guarantee turn order but have markedly lower throughput than barging locks.",
        kind: "docs",
      },
      {
        label: "Data Race Detector — go.dev",
        href: "https://go.dev/doc/articles/race_detector",
        note: "How to actually catch a race instead of guessing: run your tests with -race and let the tool point at the two conflicting accesses.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "deadlock-race-starvation-q1",
        question: "Two threads each run count++ once on a shared count that starts at 0, with no lock. Why can the result be 1?",
        options: [
          { id: "a", label: "count++ is read, add, write — both threads can read 0 before either writes, so both write 1 and one increment is lost." },
          { id: "b", label: "Integers overflow when two threads touch them at the same time." },
          { id: "c", label: "The second thread's write is rejected because the first thread still owns the variable." },
          { id: "d", label: "The compiler skips the second increment as dead code." },
        ],
        correctOptionId: "a",
        explanation:
          "count++ is not atomic: it compiles to a read, an add, and a write, and another thread can run between those steps. If both read 0, both compute 1 and both store 1, so two increments produce one. There's no overflow at these values, no ownership of a plain variable that could reject a write, and nothing about the second increment is dead code — it really executes, it just gets overwritten.",
      },
      {
        id: "deadlock-race-starvation-q2",
        question: "Your test suite runs the concurrent code 100 times and passes every time. What does that prove about a suspected race condition?",
        options: [
          { id: "a", label: "Very little — races are timing-dependent, so the suite only proves those particular interleavings didn't happen to fail." },
          { id: "b", label: "The race is fixed; 100 clean runs is statistically conclusive." },
          { id: "c", label: "The race exists but is harmless, since it never produced a wrong value." },
          { id: "d", label: "There was never a race, because a real race fails on every run." },
        ],
        correctOptionId: "a",
        explanation:
          "Whether a race manifests depends on when the scheduler happens to switch threads, which varies with machine, core count and load — so passing tests are weak evidence, not proof. That's exactly why races survive CI and then fail hourly in production. A real race does not fail every run (that's what makes it hard), and 'never observed' is not the same as harmless.",
      },
      {
        id: "deadlock-race-starvation-q3",
        question: "Which Coffman condition does a global lock ordering rule ('always take A before B') break?",
        options: [
          { id: "a", label: "Circular wait — if everyone acquires locks in the same order, the waiting arrows can never form a ring." },
          { id: "b", label: "Mutual exclusion — the locks stop being exclusive." },
          { id: "c", label: "No preemption — the OS can now take a lock away from a thread." },
          { id: "d", label: "Hold and wait — threads no longer hold a lock while waiting." },
        ],
        correctOptionId: "a",
        explanation:
          "With one global order, a thread waiting for B already holds A and can only be blocked by a thread further along the same order, so no cycle can close. The locks are still mutually exclusive, nothing preempts them, and a thread waiting for B is still holding A — hold-and-wait is untouched. Breaking any one of the four conditions suffices, and circular wait is usually the cheapest to break.",
      },
      {
        id: "deadlock-race-starvation-q4",
        question: "A service hangs. A thread dump shows two threads BLOCKED, each on a monitor the other owns, and CPU usage is near 0%. What is this?",
        options: [
          { id: "a", label: "A deadlock — a cycle of threads each waiting on a lock held by the next." },
          { id: "b", label: "A livelock — the threads are busily retrying and undoing each other's progress." },
          { id: "c", label: "Starvation — one thread is runnable but never scheduled." },
          { id: "d", label: "A race condition — the two threads interleaved inside a critical section." },
        ],
        correctOptionId: "a",
        explanation:
          "Blocked threads waiting in a cycle, with no CPU being burned, is the textbook deadlock signature. Livelock would show high CPU because the threads keep running and retrying. Starvation means a thread is runnable but not picked — nothing is blocked in a cycle. A race produces wrong values while the program keeps running, not a hang.",
      },
      {
        id: "deadlock-race-starvation-q5",
        question: "A low-priority background thread on a busy server never seems to finish, though it is always ready to run. Which fix targets the actual problem?",
        options: [
          { id: "a", label: "Serve waiters in FIFO order with a fair lock or queue, so the longest waiter is chosen next." },
          { id: "b", label: "Impose a global lock ordering across the codebase." },
          { id: "c", label: "Replace the counter updates with atomic operations." },
          { id: "d", label: "Wrap the thread's work in a bigger synchronized block." },
        ],
        correctOptionId: "a",
        explanation:
          "This is starvation: the thread is runnable but never picked, so the cure is fairness — a FIFO queue or a fair lock that bounds how long anyone can be passed over. Lock ordering prevents deadlock, atomics prevent races, and a bigger synchronized block only reduces parallelism and can make the starvation worse.",
      },
      {
        id: "deadlock-race-starvation-q6",
        question: "Two threads keep timing out on a lock, releasing everything, and retrying in perfect step. CPU is pegged at 100% but no work completes. What is happening, and what fixes it?",
        options: [
          { id: "a", label: "Livelock — the threads react to each other symmetrically; a randomised back-off breaks the symmetry." },
          { id: "b", label: "Deadlock — the threads are blocked forever; a lock ordering rule fixes it." },
          { id: "c", label: "A race condition — a lock around the shared write fixes it." },
          { id: "d", label: "Priority inversion — priority inheritance fixes it." },
        ],
        correctOptionId: "a",
        explanation:
          "Livelock is the busy version of deadlock: the threads are not blocked, they are actively retrying and politely getting out of each other's way forever, so CPU is high while progress is zero. Randomised back-off makes one thread win. Deadlock would show near-zero CPU with blocked threads, a race would produce wrong results rather than none, and priority inversion is a low-priority holder blocking a high-priority waiter.",
      },
    ],
  },
};
