import type { RoadmapLesson } from "@/lib/content/types";

export const locksMutexSemaphore: RoadmapLesson = {
  title: "Locks, Mutex, Semaphore",
  oneLiner:
    "When two threads touch the same data at the same time, the data breaks. A **mutex** fixes it like the key to a single-occupancy toilet: one key, one person inside, everyone else waits in the corridor. A **semaphore** is the barrier at a car park with 3 spaces: it doesn't care *who* you are, it just counts — three cars in, the fourth waits for someone to drive out. These two tools guard almost every piece of shared state you will ever write.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/locks-mutex-semaphore.html",
  content: {
    prototypeCaption:
      "Four threads (T1–T4) on the left, a **door** in the middle, and a room on the right holding one shared number: `balance: 100`. Each thread does the same tiny job — read the balance, add 1, write it back — so four threads should leave `104` behind. On the **🔒 Mutex** tab flip the chip to `🔓 No lock` and press `▶ Run all`: everybody strolls in together, two threads read `100` at the same moment, and the counter ends on a red **`102`**. Flip back to `🔒 With lock` and run again — now only one card turns green inside, the door shows `holder: T1`, the other three sit amber in the `waiting` queue, and each `✅ release` lets exactly one more in until the balance reads a green **`104 ✓`**. The **🎟 Semaphore** tab turns the same door into a counting barrier: `＋ / −` sets `permits: 3 / 3`, and `▶ Acquire all` lets *three* threads in at once while one waits. Drop the permits to `1` and it behaves exactly like the mutex. Watch `inside: 2/3` and `waiting: 1` in the caption — that pair of numbers *is* the difference between the two tools.",

    overview: [
      {
        type: "p",
        text: "Two threads. One shared variable. Both run `balance = balance + 1`. You would expect the number to go up by two — and sometimes it does. But that one line is really *three* steps: **read** the value, **add one**, **write** it back. If both threads read `100` before either writes, both write `101`, and one increment vanishes forever. Nothing crashed, no exception was thrown — the number is just quietly wrong. That is a **data race**, and it is the bug this whole lesson exists to prevent.",
      },
      {
        type: "p",
        text: "The stretch of code that touches shared data — those three steps — is called the **critical section**. The rule is simple: *only one thread at a time may be in it*. The tool that enforces the rule is a **lock**, also called a **mutex** (short for *mutual exclusion*). Picture the single-occupancy toilet at a café with exactly one key hanging behind the counter. You take the key, go in, lock the door, do your business, come out and hang the key back. There is no rule about who goes next and no schedule — the key itself makes it impossible for two people to be inside at once.",
      },
      {
        type: "p",
        text: "A **semaphore** answers a different question. It is not a key, it is a **counter of permits**. Think of the barrier at a small car park with 3 spaces: the barrier lifts while a space is free, and once all three are taken it stays down until someone drives out. It never asks who you are. A semaphore with `1` permit *behaves* like a mutex, and the shorthand is worth memorising: **a mutex asks \"is anyone inside?\", a semaphore asks \"how many are inside?\"**",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "**Mutex = one key, one holder at a time (mutual exclusion). Semaphore = N permits, so up to N threads may be inside at once.** Both follow the same rhythm — `acquire → work → release` — and the release must happen *no matter what*, which is why it lives in a `finally` block (Java/Python), a destructor (C++ RAII), or a `defer` (Go).",
      },
      {
        type: "callout",
        variant: "info",
        title: "You are already surrounded by these",
        text: "A database connection pool that allows 10 connections is a semaphore with 10 permits. A rate limiter that permits 5 concurrent uploads is a semaphore. Java's `synchronized` keyword, Python's `with lock:`, C++'s `std::lock_guard`, and Go's `mu.Lock()` are all mutexes. Even the `SELECT ... FOR UPDATE` row lock in your database is the same idea, one layer down.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The critical section" },
      {
        type: "p",
        text: "A **critical section** is any piece of code that reads *and* writes state shared with other threads — a counter, a list, a cache entry, a file handle, a bank balance. Its danger is not the code itself but the fact that a thread can be paused by the operating system **between any two machine instructions**. Your innocent `balance++` can be interrupted right after the read and before the write, and another thread can slip in during that gap. You never get to choose when that happens, so you must make the gap impossible to exploit.",
      },
      {
        type: "ul",
        items: [
          "**Read** — thread A loads `balance` (100) into a register.",
          "**Modify** — thread A computes 101 *in its own registers*. Meanwhile thread B also loads `balance` and still sees **100**.",
          "**Write** — A stores 101. Then B stores 101 as well. Two increments happened; the counter moved by one. That is a **lost update**.",
        ],
      },
      { type: "h", text: "Mutex: acquire → work → release" },
      {
        type: "p",
        text: "A mutex has exactly two operations. `acquire()` (also called `lock()`) says *\"give me the key; if someone else has it, put me to sleep until it is free.\"* `release()` (`unlock()`) hands the key back and wakes one waiting thread. Between those two calls, you are guaranteed to be alone. The critical rule is that the release must be **unconditional** — if your code throws an exception between acquire and release and you skip the unlock, the key is gone forever and every other thread blocks until the process is killed.",
      },
      {
        type: "code",
        language: "java",
        code: `private final Lock lock = new ReentrantLock();
private int balance = 100;

void deposit() {
    lock.lock();              // acquire — blocks if someone else holds it
    try {
        balance = balance + 1;   // the critical section: read → +1 → write
    } finally {
        lock.unlock();        // release — ALWAYS, even if the body throws
    }
}`,
      },
      {
        type: "p",
        text: "Every language spells that safety net differently, but it is always the same idea: **tie the release to leaving the block, not to reaching a line of code.** Java uses `try/finally` (or `synchronized`, which unlocks automatically). C++ uses `std::lock_guard`, whose destructor unlocks when the scope ends — that is **RAII**, *resource acquisition is initialisation*. Python uses `with lock:`. Go uses `defer mu.Unlock()` on the line right after `mu.Lock()`, so the two are impossible to separate by accident.",
      },
      { type: "h", text: "synchronized and reentrancy, in two lines" },
      {
        type: "p",
        text: "In Java, **every object carries a built-in lock called its *monitor***. Writing `synchronized (obj) { ... }` acquires that object's monitor for the block, and marking a method `synchronized` locks `this` for the whole method — no explicit unlock needed, the JVM releases it when the block exits, even on an exception. Java's locks are also **reentrant**: *the thread that already holds a lock can acquire it again without blocking itself* (a counter goes up, and the lock is only truly free when it hits zero). That is what lets one `synchronized` method safely call another on the same object. Not every lock is reentrant, though — a plain POSIX mutex or a Go `sync.Mutex` will **deadlock against itself** if you lock it twice in the same goroutine.",
      },
      { type: "h", text: "Semaphore: a counter, not an owner" },
      {
        type: "p",
        text: "A semaphore holds an integer: the number of **permits** available. `acquire()` takes one permit and blocks while the count is zero; `release()` gives one back and wakes a waiter. Set it to 3 and three threads run inside the guarded region *simultaneously*. Two consequences of \"it is only a counter\" catch beginners out:",
      },
      {
        type: "ul",
        items: [
          "**There is no owner.** A mutex remembers *who* locked it, and in most libraries only that thread may unlock it. A semaphore does not — **any** thread may call `release()`, even one that never acquired. That is a feature: it lets one thread signal another (a producer releasing a permit that a consumer is waiting on).",
          "**A binary semaphore (1 permit) ≈ a mutex**, but without ownership, and usually without reentrancy. It gives you mutual exclusion; it does *not* give you the safety checks or the \"same thread must unlock\" discipline of a real mutex. When you want mutual exclusion, use a mutex; use a semaphore when you want to cap *how many*.",
          "**N > 1 permits is not mutual exclusion.** A semaphore of 3 happily lets three threads corrupt the same counter together — exactly what the prototype shows. It limits concurrency; it does not make a critical section safe.",
        ],
      },
      { type: "h", text: "Blocking, tryLock and timeouts" },
      {
        type: "p",
        text: "A plain `lock()` **blocks** — the thread sleeps until the lock is free, however long that takes. Sometimes you would rather not wait forever: `tryLock()` returns `false` immediately if the lock is taken, and `tryLock(200, MILLISECONDS)` waits only as long as you allow, then gives up and returns `false`. Use them when you have something useful to do instead of waiting (serve a cached value, return \"busy, try again\", fail a request cleanly rather than piling up threads).",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Keep critical sections small — and never take two locks in different orders",
        text: "A lock is a queue: while you hold it, *every* other thread that wants it is frozen. Do slow work — network calls, disk I/O, logging, waiting on a user — **outside** the lock, and hold it only for the few lines that touch shared memory. And a second, sharper trap: if thread A locks `x` then wants `y`, while thread B locks `y` then wants `x`, both wait forever. That is a **deadlock**, and the standard cure is to always acquire multiple locks in one globally agreed order.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Locks are not free",
        text: "An uncontended lock is cheap (often just an atomic instruction), but a contended one is not: the loser is put to sleep by the OS and woken later, costing microseconds and a context switch. If a single counter is all you are protecting, an atomic type (`AtomicInteger`, `std::atomic<int>`, `sync/atomic`) does the job lock-free. Locks earn their keep when you must keep *several* pieces of state consistent together.",
      },
    ],

    handsOn: [
      {
        title: "01 · Break it first — 🔓 No lock",
        body: "On the 🔒 Mutex tab, click the chip so it reads 🔓 No lock, then hit ▶ Run all. All four threads walk straight into the room: T1 and T2 both show read 100 and both write 101, then T3 and T4 both read 101. The card flashes red and lands on balance: 102 when four +1s should have produced 104. Two updates were lost — and nothing errored. That is exactly what an unguarded critical section looks like.",
      },
      {
        title: "02 · Fix it — 🔒 With lock",
        body: "Flip the chip back to 🔒 With lock (the board resets to 100) and press ▶ Run all. Only one card goes green inside the room; the door shows holder: T1 with its single 🔑, and the caption reads inside: 1/1 · waiting: 3 while the other three sit amber. Now click ✅ release four times: each release writes the value and admits exactly one waiter, and the balance climbs 101 → 102 → 103 → 104 ✓ in green. Same four threads, same work — one key made it correct.",
      },
      {
        title: "03 · Count instead of own — 🎟 Semaphore",
        body: "Switch to the 🎟 Semaphore tab (permits: 3 / 3) and hit ▶ Acquire all. Three threads get in together — inside: 3/3 · waiting: 1 — because a semaphore limits how *many*, not *who*. Click ✅ release repeatedly and watch the balance end on a red 102 again: three threads that all read 100 still overwrite each other. Now press − twice to reach permits: 1 / 1 and re-run: one in at a time, and the balance finishes on 104 ✓. A binary semaphore behaves just like a mutex — minus the owner.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "Counter.java",
        code: `import java.util.concurrent.Semaphore;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class Counter {
    private final Lock lock = new ReentrantLock();  // reentrant: same thread may re-enter
    private int balance = 100;

    // --- MUTEX: one key, one holder --------------------------------
    void depositWithLock() {
        lock.lock();                       // acquire (blocks while taken)
        try {
            balance = balance + 1;         // critical section: read → +1 → write
        } finally {
            lock.unlock();                 // release — ALWAYS, even on exception
        }
    }

    // The keyword version: every object has a built-in monitor lock.
    synchronized void depositSynchronized() {
        balance = balance + 1;             // JVM locks 'this' and unlocks on exit
    }

    // Don't want to wait forever? Ask, don't block.
    boolean depositIfFree() {
        if (!lock.tryLock()) return false; // taken → do something else instead
        try { balance = balance + 1; return true; }
        finally { lock.unlock(); }
    }

    int get() { synchronized (this) { return balance; } }
}

// --- SEMAPHORE: N permits, no owner --------------------------------
class ConnectionPool {
    private final Semaphore permits = new Semaphore(3);   // 3 cars, 3 spaces

    void query(String sql) throws InterruptedException {
        permits.acquire();                 // blocks when all 3 are in use
        try {
            System.out.println("running " + sql +
                " · free permits: " + permits.availablePermits());
            Thread.sleep(50);              // pretend this is real I/O
        } finally {
            permits.release();             // any thread may release a permit
        }
    }
}

public class Demo {
    public static void main(String[] args) throws Exception {
        Counter c = new Counter();
        Thread[] ts = new Thread[4];
        for (int i = 0; i < ts.length; i++) {
            ts[i] = new Thread(c::depositWithLock);
            ts[i].start();
        }
        for (Thread t : ts) t.join();
        System.out.println("balance = " + c.get());   // always 104
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "counter.py",
        code: `import threading

# --- MUTEX: one key, one holder ---------------------------------------
lock = threading.Lock()          # use RLock() if the same thread re-enters
balance = 100


def deposit_with_lock() -> None:
    global balance
    with lock:                   # acquire; the 'with' block releases for you
        balance = balance + 1    # critical section: read -> +1 -> write
    # leaving the block releases the lock, even if the body raised


def deposit_unsafe() -> None:
    global balance
    balance = balance + 1        # a data race waiting to happen


def deposit_if_free() -> bool:
    global balance
    if not lock.acquire(timeout=0.2):   # don't block forever
        return False                    # busy -> do something else
    try:
        balance = balance + 1
        return True
    finally:
        lock.release()                  # ALWAYS release


threads = [threading.Thread(target=deposit_with_lock) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print("balance =", balance)      # 104, every single run


# --- SEMAPHORE: N permits, no owner -----------------------------------
pool = threading.Semaphore(3)    # a car park with 3 spaces


def query(sql: str) -> None:
    with pool:                   # acquire() a permit; blocks when 0 are left
        print("running", sql)    # up to 3 threads are in here together
    # release() happens on exit — any thread may release a permit`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "counter.cpp",
        code: `#include <atomic>
#include <iostream>
#include <mutex>
#include <semaphore>
#include <thread>
#include <vector>

std::mutex mtx;                       // the one key
int balance = 100;

// --- MUTEX via RAII: the destructor unlocks, so you cannot forget -----
void deposit_with_lock() {
    std::lock_guard<std::mutex> guard(mtx);   // acquire on construction
    balance = balance + 1;                    // critical section
}                                             // release on scope exit — always

// Don't want to block? Ask first.
bool deposit_if_free() {
    std::unique_lock<std::mutex> guard(mtx, std::try_to_lock);
    if (!guard.owns_lock()) return false;     // taken → skip it
    balance = balance + 1;
    return true;
}

// --- SEMAPHORE: N permits (C++20) ------------------------------------
std::counting_semaphore<3> permits{3};        // 3 spaces in the car park

void query(int id) {
    permits.acquire();                        // blocks while the count is 0
    std::cout << "query " << id << " running\\n";
    permits.release();                        // any thread may release
}

int main() {
    std::vector<std::thread> ts;
    for (int i = 0; i < 4; ++i) ts.emplace_back(deposit_with_lock);
    for (auto& t : ts) t.join();
    std::cout << "balance = " << balance << "\\n";   // always 104

    // For a lone counter, skip the lock entirely:
    std::atomic<int> hits{0};
    ++hits;                                   // lock-free read-modify-write
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "counter.go",
        code: `package main

import (
	"fmt"
	"sync"
)

// --- MUTEX: one key, one holder -------------------------------------
type Counter struct {
	mu      sync.Mutex // NOT reentrant: locking twice in one goroutine deadlocks
	balance int
}

func (c *Counter) Deposit() {
	c.mu.Lock()
	defer c.mu.Unlock() // release on return — even if we panic
	c.balance++         // critical section: read -> +1 -> write
}

func (c *Counter) DepositIfFree() bool {
	if !c.mu.TryLock() { // Go 1.18+: ask, don't block
		return false
	}
	defer c.mu.Unlock()
	c.balance++
	return true
}

// --- SEMAPHORE: a buffered channel of N permits ----------------------
type Pool struct{ permits chan struct{} }

func NewPool(n int) *Pool { return &Pool{permits: make(chan struct{}, n)} }

func (p *Pool) Query(sql string) {
	p.permits <- struct{}{}        // acquire: blocks when the buffer is full
	defer func() { <-p.permits }() // release: frees one slot
	fmt.Println("running", sql)    // at most N goroutines are in here
}

func main() {
	c := &Counter{balance: 100}
	var wg sync.WaitGroup
	for i := 0; i < 4; i++ {
		wg.Add(1)
		go func() { defer wg.Done(); c.Deposit() }()
	}
	wg.Wait()
	fmt.Println("balance =", c.balance) // always 104

	pool := NewPool(3) // 3 permits — like a car park with 3 spaces
	pool.Query("SELECT 1")
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a mutex when..." },
      {
        type: "ul",
        items: [
          "**Two or more threads read and write the same state** — a counter, a map, a cached object, a file. If even one thread writes, the access needs guarding.",
          "**Several fields must stay consistent together** — moving money between two accounts, updating an index and its list. Atomics fix one variable; a lock lets you keep an *invariant*.",
          "**The guarded work is short** — a handful of lines with no I/O, no waiting, no calls into code you do not control.",
        ],
      },
      { type: "h", text: "Reach for a semaphore when..." },
      {
        type: "ul",
        items: [
          "**You want to cap concurrency, not exclude it** — at most 10 open database connections, 5 parallel uploads, 3 workers hitting a fragile downstream API.",
          "**One thread needs to signal another** — a producer `release()`s a permit that a waiting consumer `acquire()`s. A mutex cannot do this, because only the owner may unlock it.",
        ],
      },
      { type: "h", text: "Skip both when..." },
      {
        type: "ul",
        items: [
          "**Nothing is shared** — thread-local or immutable data needs no lock at all. The cheapest synchronisation is not sharing.",
          "**It is a single counter or flag** — an atomic type is faster and cannot be forgotten to unlock.",
          "**A higher-level tool already fits** — a `ConcurrentHashMap`, a blocking queue, an actor, or a Go channel hides the locking and is much harder to get wrong.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Correctness — mutual exclusion makes lost updates and torn state impossible, turning read-modify-write into an all-or-nothing step.",
        "Simple mental model — acquire, work, release; one key or N permits, and the same three calls in every language.",
        "Semaphores give you a throttle — cap concurrent connections, uploads or workers with a single counter instead of custom queueing.",
        "Composable with invariants — a lock can protect several fields at once, which atomic variables alone cannot do.",
      ],
      cons: [
        "Deadlock — take two locks in different orders and both threads wait forever; the program simply stops with no error.",
        "Throughput loss — while one thread holds the lock, every other contender is asleep, so a fat critical section serialises your whole system.",
        "Easy to forget the release — an early return or a thrown exception without finally/RAII/defer leaves the lock held permanently.",
        "Semaphores have no owner and no reentrancy — a stray release() inflates the permit count silently, and self-locking a non-reentrant mutex deadlocks against itself.",
      ],
    },

    furtherReading: [
      {
        label: "Locks in Java — Jenkov",
        href: "https://jenkov.com/tutorials/java-concurrency/locks.html",
        note: "Builds a lock from scratch before showing ReentrantLock — the clearest explanation of what reentrancy actually costs and why unlock belongs in finally.",
        kind: "article",
      },
      {
        label: "java.util.concurrent.Semaphore — Java SE API docs",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Semaphore.html",
        note: "The official contract, including the pool example, fair vs unfair queueing, and the explicit note that a semaphore has no ownership — any thread may release.",
        kind: "docs",
      },
      {
        label: "std::lock_guard — cppreference",
        href: "https://en.cppreference.com/w/cpp/thread/lock_guard",
        note: "The RAII lock in one page: acquire in the constructor, release in the destructor, so an exception can never leave a mutex locked.",
        kind: "docs",
      },
      {
        label: "threading — Python standard library docs",
        href: "https://docs.python.org/3/library/threading.html",
        note: "Lock, RLock, Semaphore and BoundedSemaphore side by side, with the with-statement idiom and the acquire(timeout=...) form for non-blocking waits.",
        kind: "docs",
      },
      {
        label: "sync — Go package documentation",
        href: "https://pkg.go.dev/sync",
        note: "Mutex, RWMutex and the rule that a Go mutex is not reentrant and must not be copied after first use; pair it with defer mu.Unlock().",
        kind: "docs",
      },
      {
        label: "The Little Book of Semaphores — Allen B. Downey",
        href: "https://greenteapress.com/wp/semaphores/",
        note: "A free book that teaches synchronisation as puzzles solved with nothing but semaphores — the best way to build real intuition for permits and signalling.",
        kind: "book",
      },
      {
        label: "Cooperating Sequential Processes (EWD 123) — Edsger W. Dijkstra",
        href: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD01xx/EWD123.html",
        note: "The 1965 paper that invented the semaphore, along with the critical section problem and the dining philosophers. Surprisingly readable, and the source of every idea above.",
        kind: "paper",
      },
    ],

    quiz: [
      {
        id: "locks-mutex-semaphore-q1",
        question: "Four threads each run balance = balance + 1 on a shared balance of 100, with no lock. Why can the result be 102 instead of 104?",
        options: [
          { id: "a", label: "The increment is really read → modify → write, so two threads can read the same value and both write back the same result, losing an update." },
          { id: "b", label: "Threads always run in a random order, and some of them silently skip their turn." },
          { id: "c", label: "The compiler removes duplicate increments as an optimisation." },
          { id: "d", label: "Integers overflow when several threads write to them at once." },
        ],
        correctOptionId: "a",
        explanation:
          "A single increment is three steps, and a thread can be paused between any two of them. If two threads read 100 before either writes, both compute 101 and both store it — two increments, one net change. Ordering is unpredictable but no thread ever skips its work (b), nothing is optimised away (c), and 102 is nowhere near an overflow (d).",
      },
      {
        id: "locks-mutex-semaphore-q2",
        question: "What is the difference between a mutex and a semaphore?",
        options: [
          { id: "a", label: "A mutex allows exactly one holder at a time; a semaphore holds N permits and lets up to N threads in at once." },
          { id: "b", label: "A mutex works between processes; a semaphore only works inside one process." },
          { id: "c", label: "A mutex blocks the thread while a semaphore always returns immediately." },
          { id: "d", label: "A semaphore protects reads while a mutex protects writes." },
        ],
        correctOptionId: "a",
        explanation:
          "The mutex is a single key (mutual exclusion); the semaphore is a counter of permits that caps how many threads may be inside. Both can block, both exist in process-local and cross-process forms, and neither is tied to reads versus writes — that distinction belongs to a read-write lock.",
      },
      {
        id: "locks-mutex-semaphore-q3",
        question: "Why must unlock() live in a finally block (or a C++ destructor, or a Go defer)?",
        options: [
          { id: "a", label: "So the lock is released even when the critical section throws or returns early — otherwise it stays held and every other thread blocks forever." },
          { id: "b", label: "Because finally blocks run faster than normal statements." },
          { id: "c", label: "Because the JVM refuses to compile a lock() without a matching finally." },
          { id: "d", label: "It is only a style convention; the runtime unlocks automatically when the method returns." },
        ],
        correctOptionId: "a",
        explanation:
          "An exception or an early return that skips unlock() leaks the lock permanently, and every waiting thread blocks until the process dies. finally / RAII / defer tie the release to *leaving the block* rather than to reaching a line. Nothing unlocks an explicit Lock automatically (d), and it is a correctness rule, not style or speed.",
      },
      {
        id: "locks-mutex-semaphore-q4",
        question: "Which statement about a semaphore's release() is true?",
        options: [
          { id: "a", label: "Any thread may call release() — a semaphore counts permits and has no owner, unlike a mutex." },
          { id: "b", label: "Only the thread that called acquire() may call release()." },
          { id: "c", label: "release() must be called exactly once per program run." },
          { id: "d", label: "release() blocks until another thread calls acquire()." },
        ],
        correctOptionId: "a",
        explanation:
          "A semaphore is just a counter, so there is no ownership record — any thread may hand a permit back, which is precisely what makes semaphores usable for signalling between threads. A mutex is the one with the owner (b). release() never blocks (d), and it is called once per acquire, not once per program (c).",
      },
      {
        id: "locks-mutex-semaphore-q5",
        question: "You protect a shared counter with a semaphore initialised to 3 permits. Is the counter safe?",
        options: [
          { id: "a", label: "No — three threads can be inside at once and still lose updates; only 1 permit (or a mutex) gives mutual exclusion." },
          { id: "b", label: "Yes — a semaphore always guarantees mutual exclusion regardless of the permit count." },
          { id: "c", label: "Yes, as long as each thread releases the permit it acquired." },
          { id: "d", label: "Yes — semaphores make every operation inside them atomic." },
        ],
        correctOptionId: "a",
        explanation:
          "A semaphore limits *how many* threads may be inside, not *who*; with 3 permits three threads can read the same value and overwrite each other exactly as if there were no lock. Only a binary semaphore (1 permit) or a real mutex enforces mutual exclusion, and correct release discipline does not change that.",
      },
      {
        id: "locks-mutex-semaphore-q6",
        question: "Thread A locks accountX then tries to lock accountY, while thread B locks accountY then tries to lock accountX. What happens, and what is the standard fix?",
        options: [
          { id: "a", label: "Both block forever — a deadlock. The usual fix is to always acquire multiple locks in one globally agreed order." },
          { id: "b", label: "The runtime detects the cycle and rolls one thread back automatically." },
          { id: "c", label: "Nothing bad — reentrant locks let each thread re-enter the other's lock." },
          { id: "d", label: "One transfer is silently dropped and the program continues." },
        ],
        correctOptionId: "a",
        explanation:
          "Each thread holds what the other needs, so neither can ever proceed — the classic two-lock deadlock, and the program simply stops with no exception. Ordinary thread runtimes do no deadlock detection or rollback (b), and reentrancy only helps a thread re-acquire a lock *it already holds*, not one held by someone else (c).",
      },
    ],
  },
};
