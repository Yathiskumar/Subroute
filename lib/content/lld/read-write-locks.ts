import type { RoadmapLesson } from "@/lib/content/types";

export const readWriteLocks: RoadmapLesson = {
  title: "Read-Write locks",
  oneLiner:
    "A plain mutex lets one thread in at a time, even when all they want to do is *look*. But reading shared data doesn't change it — so readers can't hurt each other. A **read-write lock** has two doors: a shared `readLock()` that many threads can hold at once, and an exclusive `writeLock()` that only one thread can hold, and only when nobody is reading. Think of a library noticeboard: any number of people can read the poster together, but when the curator swaps it, everyone steps back.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/read-write-locks.html",
  content: {
    prototypeCaption:
      "A **room** with one 📄 *Shared document v3* inside, five actors in the tray (👓 R1 R2 R3 and ✍️ W1 W2), and a mode switch at the top. Start on **🔒 Plain mutex** and click R1, R2, R3 — only one gets in, the other two sit in the amber waiting queue tagged `waiting: lock held`, even though all three only want to *look*. Flip to **👓✍️ Read-Write lock**, hit ↺ Reset, and click the same three: now `readers inside: 3`, all green, all at once. Click ✍️ W1 and it queues with `waiting: 3 readers` — a writer must wait for every reader to drain. Hit **✅ Release all**, W1 walks in alone, and releasing it ticks the document **v3 → v4**. Click R2 while W1 is inside and it queues too — writers block new readers. Finally, with R1 inside, press **⚠️ Upgrade R1→W**: the room turns red and stays red, because upgrading a read lock to a write lock deadlocks.",

    overview: [
      {
        type: "p",
        text: "A normal lock — a **mutex** — is a room with one key. Whoever holds the key is inside; everyone else waits at the door. That's exactly right when threads are *changing* shared data, because two writers editing the same thing at the same time corrupts it. But it's wasteful when threads only want to *read*. Reading doesn't change anything, so ten threads reading the same list can't possibly interfere with each other. A plain mutex makes them queue anyway.",
      },
      {
        type: "p",
        text: "A **read-write lock** fixes that by giving the same data two doors instead of one. `readLock()` is the **shared** door: any number of threads can be holding it at the same time. `writeLock()` is the **exclusive** door: only one thread gets it, and only while nobody at all is holding the read lock. The rule in one breath is *many readers **or** one writer, never both*.",
      },
      {
        type: "p",
        text: "Picture a **library noticeboard**. A crowd can stand in front of it reading the same poster — nobody's reading spoils anybody else's. When the curator comes to replace the poster, everyone has to step back and wait outside, and the curator works alone, because a half-peeled poster is not something you want people reading. The moment the new poster is up, the crowd floods back in. That is a read-write lock, complete with its timing rules.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "**Many readers or one writer, never both.** A read-write lock only pays for itself when reads massively outnumber writes — otherwise its extra bookkeeping makes it *slower* than the plain mutex it replaced.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Where you've already met it",
        text: "Any in-memory thing that is read constantly and updated rarely: a **config cache** reloaded once a minute but read on every request, a service's **routing table**, a product **catalogue** held in memory, a permissions map, a DNS cache. Databases use the same idea at a bigger scale — shared locks for `SELECT`, exclusive locks for `UPDATE`.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Two doors, four rules" },
      {
        type: "ul",
        items: [
          "**A reader may enter if no writer is inside.** Other readers are irrelevant — they don't block each other, because reading is not a change.",
          "**A writer may enter only when the room is completely empty** — no readers, no other writer. Exclusive means exclusive.",
          "**A waiting writer must wait for the readers to drain.** It cannot kick anyone out; it sits in the queue until the last current reader releases its lock.",
          "**While a writer is waiting or working, new readers are held out.** Otherwise a steady trickle of readers would keep the room permanently non-empty and the writer would never get in.",
        ],
      },
      {
        type: "p",
        text: "That last rule is the interesting one. It's why the prototype shows a reader queueing with the tag `waiting: writer queued` even though nobody is technically writing yet. The lock is deliberately holding the door shut so the writer eventually gets its turn.",
      },
      {
        type: "code",
        language: "java",
        filename: "Cache.java",
        code: `ReadWriteLock rw = new ReentrantReadWriteLock();
Map<String, String> config = new HashMap<>();

String get(String key) {
    rw.readLock().lock();          // SHARED — many threads at once
    try   { return config.get(key); }
    finally { rw.readLock().unlock(); }   // always in a finally
}

void reload(Map<String, String> fresh) {
    rw.writeLock().lock();         // EXCLUSIVE — waits for readers to drain
    try   { config = fresh; }
    finally { rw.writeLock().unlock(); }
}`,
      },
      {
        type: "p",
        text: "Note the shape: `lock()` outside the `try`, `unlock()` inside a `finally`. Unlike Java's `synchronized` block, an explicit lock is *not* released for you when an exception flies out — forget the `finally` and the lock is held forever, which freezes every other thread. This is the single most common bug in hand-written lock code.",
      },
      { type: "h", text: "When it pays off — and when it doesn't" },
      {
        type: "p",
        text: "A read-write lock is not free. It has to track *how many* readers are inside, wake a writer when the count hits zero, and decide who goes next — that's more state and more atomic operations than a mutex, which only tracks locked-or-not. You are paying that overhead on **every single acquire**, including all the reads.",
      },
      {
        type: "ul",
        items: [
          "**It pays off** when reads hugely outnumber writes *and* the critical sections are long enough for the parallelism to matter — an in-memory catalogue read a thousand times per update, a routing table, a cache of parsed config.",
          "**It does not pay off** when writes are frequent: the write lock serialises everything anyway, so you've bought the bookkeeping and none of the concurrency.",
          "**It does not pay off** for very short critical sections — reading one field, incrementing one counter. The lock's own overhead dwarfs the work being protected, and a plain mutex (or an atomic variable) is measurably faster.",
        ],
      },
      {
        type: "p",
        text: "The honest default is: **start with a plain mutex.** Move to a read-write lock only when you've measured a read-heavy contention problem. Swapping one in \"because it sounds faster\" often makes things slower.",
      },
      { type: "h", text: "Starvation: who gets to go next?" },
      {
        type: "p",
        text: "If the lock simply let readers in whenever no writer was *currently* inside, a busy system could keep at least one reader in the room forever, and the writer would sit in the queue indefinitely. That's **writer starvation** — a thread that is never technically deadlocked, just permanently unlucky. The fix is a policy:",
      },
      {
        type: "ul",
        items: [
          "**Read-preferring** — readers jump straight in whenever no writer holds the lock. Best raw read throughput, but writers can starve.",
          "**Write-preferring** — once a writer is waiting, new readers queue behind it. Writers always get their turn; read throughput dips slightly. This is what the prototype does.",
          "**Fair (FIFO)** — everyone is served in arrival order. No starvation for anyone, but readers that could have shared a turn are split up, so throughput drops. Java's `new ReentrantReadWriteLock(true)` gives you this.",
        ],
      },
      { type: "h", text: "Downgrading is fine — upgrading deadlocks" },
      {
        type: "p",
        text: "**Downgrading** means going from the write lock to the read lock: while still holding the write lock, acquire the read lock, then release the write lock. This is legal and useful — you finish your update and keep reading the fresh value without ever letting go and racing someone else for it.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The classic gotcha: never upgrade a read lock",
        text: "**Upgrading** — trying to take the write lock while you still hold the read lock — deadlocks in most implementations, including Java's `ReentrantReadWriteLock`. The write lock waits for *all* readers to leave, and you are one of those readers, waiting for yourself. Worse, if two threads try it at once you get a mutual deadlock. Release the read lock first, take the write lock, then **re-check your condition** — the world may have changed in the gap. The prototype's ⚠️ *Upgrade R1→W* button shows exactly this: the room turns red and never recovers.",
      },
      { type: "h", text: "What your language gives you" },
      {
        type: "ul",
        items: [
          "**Java** — `ReentrantReadWriteLock` (optionally fair) is the standard one. `StampedLock` is faster but not reentrant, and adds an **optimistic read**: you read without locking, then call `validate()` to ask \"did a writer touch this while I was reading?\" — if it says no, you paid almost nothing; if it says yes, you retry with a real read lock.",
          "**C++** — `std::shared_mutex` (C++17), taken with `std::shared_lock` for readers and `std::unique_lock` for writers.",
          "**Go** — `sync.RWMutex`, with `RLock()`/`RUnlock()` for readers and `Lock()`/`Unlock()` for writers.",
          "**Python** — the standard library has **no** read-write lock. You either build one from `threading.Condition` (about twenty lines) or reach for a library. In CPython the GIL already serialises bytecode, so the win is smaller than you'd expect for pure-Python work.",
        ],
      },
      { type: "h", text: "The alternative: don't share mutable state at all" },
      {
        type: "p",
        text: "Before adding a read-write lock, consider making the data **immutable** and swapping whole snapshots instead. A writer builds a brand-new copy, then atomically publishes it by reassigning one reference; readers just grab the current reference and read it with **no lock at all**. That's *copy-on-write* — `CopyOnWriteArrayList` in Java, or a plain `AtomicReference` to an immutable map. Readers become completely free and can never see a half-finished update; the cost is a full copy per write, so it only suits data that is written rarely. The immutability lesson later in this phase goes deeper.",
      },
    ],

    handsOn: [
      {
        title: "01 · Feel the waste of a plain mutex",
        body: "Click 🔒 Plain mutex, then click 👓 R1, 👓 R2 and 👓 R3 in the tray. Only R1 gets into the room; R2 and R3 drop into the amber waiting queue tagged `waiting: lock held`. Watch the caption: readers inside: 1, waiting: 2. Three threads that only wanted to *look* are now standing in line. Press ✅ Release all repeatedly and count how slowly `reads served` climbs — one per turn.",
      },
      {
        title: "02 · The money shot: readers share",
        body: "Hit ↺ Reset, switch to 👓✍️ Read-Write lock, and click the same three readers. All three sit inside together — readers inside: 3, waiting: 0, everything green. Now press ✅ Release all: `reads served` jumps by 3 in a single turn. Same clicks, three times the work, because reading doesn't change the document and so readers never conflict.",
      },
      {
        title: "03 · Writers drain, block, and then break it",
        body: "Click 👓 R1, R2 and R3 back into the room, then click ✍️ W1 — it queues with `waiting: 3 readers`, because a writer needs the room empty. Press ✅ Release all and W1 walks in alone; click 👓 R2 now and it queues with `waiting: writer inside`. Click W1's ⏏ leave chip and the document ticks v3 → v4 while R2 is admitted. Finally, reset, put 👓 R1 inside, and press ⚠️ Upgrade R1→W: the room goes red and stays red — upgrading a read lock to a write lock deadlocks, because R1 is waiting for itself to leave.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "ConfigCache.java",
        code: `import java.util.*;
import java.util.concurrent.locks.*;

/** A config map read on every request, reloaded once a minute. */
public class ConfigCache {
    // fair=true would serve everyone FIFO (no starvation, less throughput)
    private final ReentrantReadWriteLock rw = new ReentrantReadWriteLock();
    private final Lock read  = rw.readLock();    // SHARED door
    private final Lock write = rw.writeLock();   // EXCLUSIVE door
    private Map<String, String> config = new HashMap<>();

    public String get(String key) {
        read.lock();                             // many threads at once
        try {
            return config.get(key);
        } finally {
            read.unlock();                       // ALWAYS in a finally
        }
    }

    public void reload(Map<String, String> fresh) {
        write.lock();                            // waits for readers to drain,
        try {                                    // and blocks new ones meanwhile
            config = new HashMap<>(fresh);
        } finally {
            write.unlock();
        }
    }

    /** Legal: write -> read. Take read BEFORE releasing write. */
    public String reloadAndPeek(Map<String, String> fresh, String key) {
        write.lock();
        try {
            config = new HashMap<>(fresh);
            read.lock();                         // downgrade: still holding write
        } finally {
            write.unlock();                      // now only the read lock is held
        }
        try {
            return config.get(key);
        } finally {
            read.unlock();
        }
    }

    // DO NOT DO THIS — upgrading deadlocks: the write lock waits for all
    // readers to leave, and this thread is one of them, waiting for itself.
    //   read.lock();  write.lock();   // <- hangs forever
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "rwlock.py",
        code: `import threading

# Python's stdlib has NO read-write lock, so here is a small
# write-preferring one built from a Condition (~20 lines).


class RWLock:
    def __init__(self) -> None:
        self._cond = threading.Condition()
        self._readers = 0          # readers currently inside
        self._writer = False       # a writer is inside
        self._waiting_writers = 0  # writers in the queue

    def acquire_read(self) -> None:
        with self._cond:
            # wait while a writer is inside OR queued (no writer starvation)
            while self._writer or self._waiting_writers > 0:
                self._cond.wait()
            self._readers += 1     # SHARED: many readers may sit here

    def release_read(self) -> None:
        with self._cond:
            self._readers -= 1
            if self._readers == 0:
                self._cond.notify_all()   # the room drained — wake the writer

    def acquire_write(self) -> None:
        with self._cond:
            self._waiting_writers += 1
            while self._writer or self._readers > 0:   # needs an EMPTY room
                self._cond.wait()
            self._waiting_writers -= 1
            self._writer = True

    def release_write(self) -> None:
        with self._cond:
            self._writer = False
            self._cond.notify_all()       # let the waiting crowd back in


class ConfigCache:
    def __init__(self) -> None:
        self._lock = RWLock()
        self._config: dict[str, str] = {}

    def get(self, key: str) -> str | None:
        self._lock.acquire_read()
        try:
            return self._config.get(key)
        finally:
            self._lock.release_read()     # always release in a finally

    def reload(self, fresh: dict[str, str]) -> None:
        self._lock.acquire_write()
        try:
            self._config = dict(fresh)
        finally:
            self._lock.release_write()`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "config_cache.cpp",
        code: `#include <mutex>
#include <shared_mutex>   // C++17
#include <string>
#include <unordered_map>

class ConfigCache {
    mutable std::shared_mutex mu_;                 // the read-write lock
    std::unordered_map<std::string, std::string> config_;

public:
    // SHARED: many threads may hold a shared_lock at the same time.
    std::string get(const std::string& key) const {
        std::shared_lock<std::shared_mutex> lock(mu_);   // readLock()
        auto it = config_.find(key);
        return it == config_.end() ? std::string{} : it->second;
    }                                                     // RAII unlocks

    // EXCLUSIVE: unique_lock waits for every reader to drain.
    void reload(std::unordered_map<std::string, std::string> fresh) {
        std::unique_lock<std::shared_mutex> lock(mu_);   // writeLock()
        config_ = std::move(fresh);
    }
};

// Note: std::shared_mutex is NOT upgradable and NOT recursive.
// Taking a unique_lock while already holding a shared_lock on the
// same mutex deadlocks — release the shared_lock first, then re-check.

int main() {
    ConfigCache cache;
    cache.reload({{"region", "eu-west-1"}});
    return cache.get("region").empty() ? 1 : 0;
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "configcache.go",
        code: `package main

import (
	"fmt"
	"sync"
)

// ConfigCache is read on every request and reloaded rarely —
// the textbook case for sync.RWMutex.
type ConfigCache struct {
	mu     sync.RWMutex // zero value is ready to use
	config map[string]string
}

// Get takes the SHARED lock: many goroutines can be in here at once.
func (c *ConfigCache) Get(key string) string {
	c.mu.RLock()
	defer c.mu.RUnlock() // defer = Go's finally
	return c.config[key]
}

// Reload takes the EXCLUSIVE lock: it waits for every reader to
// finish, and new RLock() calls block while it waits.
func (c *ConfigCache) Reload(fresh map[string]string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.config = fresh
}

// Never call Lock() while holding RLock() — RWMutex is not
// upgradable or reentrant, so the goroutine waits for itself.

func main() {
	c := &ConfigCache{config: map[string]string{}}
	c.Reload(map[string]string{"region": "eu-west-1"})

	var wg sync.WaitGroup
	for i := 0; i < 3; i++ { // three concurrent readers, all admitted
		wg.Add(1)
		go func() { defer wg.Done(); _ = c.Get("region") }()
	}
	wg.Wait()
	fmt.Println(c.Get("region"))
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a read-write lock when..." },
      {
        type: "ul",
        items: [
          "**Reads vastly outnumber writes** — a rough rule of thumb is 10:1 or better. A config cache, a routing table, an in-memory catalogue, a permissions map.",
          "**The critical section is long enough to matter** — parsing, scanning a collection, serialising a response. Letting ten of those run in parallel is a real win.",
          "**The data must stay mutable in place** — you can't just publish an immutable snapshot because the structure is large and updates are partial.",
        ],
      },
      { type: "h", text: "Skip it when..." },
      {
        type: "ul",
        items: [
          "**Writes are common** — the write lock serialises everything anyway, so you pay the extra bookkeeping for no parallelism. A plain mutex is simpler and faster.",
          "**The critical section is tiny** — one field read, one counter bump. Use a plain mutex, or an atomic variable and skip locking entirely.",
          "**The data is small and rarely written** — copy-on-write or an immutable snapshot behind an atomic reference gives readers a completely lock-free path.",
          "**You haven't measured** — reach for the simple mutex first and only upgrade when a profiler shows read contention.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Real read parallelism — every reader can be inside at once, so read-heavy workloads stop queueing for no reason.",
        "Correctness is unchanged — writers are still fully exclusive, so nobody ever observes a half-finished update.",
        "It expresses intent — readLock() versus writeLock() documents at the call site whether this code mutates the data.",
        "Tunable policy — most implementations offer fair or write-preferring modes, so you can trade a little throughput for no starvation.",
      ],
      cons: [
        "Slower than a mutex under write-heavy or very short critical sections — the reader bookkeeping costs more than it saves.",
        "Starvation risk — a naive read-preferring lock can leave a writer waiting forever behind a stream of readers.",
        "Upgrading deadlocks — taking the write lock while holding the read lock is a classic, silent hang in Java, C++ and Go alike.",
        "More ways to get it wrong — two lock types, a mandatory finally/defer on each, and no compiler check that a read path never mutates.",
      ],
    },

    furtherReading: [
      {
        label: "Readers–writer lock — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Readers%E2%80%93writer_lock",
        note: "The concept from first principles: the shared/exclusive rules, read-preferring vs write-preferring policies, and the starvation trade-off between them.",
        kind: "docs",
      },
      {
        label: "ReentrantReadWriteLock — Java SE API docs",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/ReentrantReadWriteLock.html",
        note: "The reference implementation, including the fair/non-fair modes and an official worked example of lock downgrading (write to read).",
        kind: "docs",
      },
      {
        label: "StampedLock — Java SE API docs",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/StampedLock.html",
        note: "The faster, non-reentrant cousin. Read the optimistic-read example: read first, validate() afterwards, fall back to a real read lock only if a writer intervened.",
        kind: "docs",
      },
      {
        label: "Read / Write Locks in Java — Jenkov",
        href: "https://jenkov.com/tutorials/java-concurrency/read-write-locks.html",
        note: "Builds a read-write lock by hand from wait/notify, step by step — the clearest way to see why the reader count and the waiting-writer count both have to exist.",
        kind: "article",
      },
      {
        label: "std::shared_mutex — cppreference",
        href: "https://en.cppreference.com/w/cpp/thread/shared_mutex",
        note: "The C++17 primitive, with the shared_lock/unique_lock RAII wrappers and the explicit warning that it is neither recursive nor upgradable.",
        kind: "docs",
      },
      {
        label: "sync.RWMutex — Go package documentation",
        href: "https://pkg.go.dev/sync#RWMutex",
        note: "Go's version in a few paragraphs, including the crucial note that a blocked Lock() stops new RLock() calls from succeeding, so recursive read locking can deadlock.",
        kind: "docs",
      },
      {
        label: "Java Concurrency in Practice — Goetz et al.",
        href: "https://jcip.net/",
        note: "The standard text on this material. Chapter 13 covers explicit locks and ReadWriteLock, and is blunt about when the extra complexity is not worth it.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "read-write-locks-q1",
        question: "Why can many readers safely hold the lock at the same time?",
        options: [
          { id: "a", label: "Because reading doesn't change the data, so no reader can affect what another reader sees." },
          { id: "b", label: "Because the lock secretly gives each reader its own private copy of the data." },
          { id: "c", label: "Because readers are always faster than writers and finish before they collide." },
          { id: "d", label: "Because the CPU serialises reads in hardware, so a lock isn't needed at all." },
        ],
        correctOptionId: "a",
        explanation:
          "Concurrent access is only dangerous when someone mutates. Reads leave the data untouched, so they cannot conflict with each other — only writes need exclusivity. No copying happens (b), speed is irrelevant since a slow reader is still harmless (c), and hardware does not serialise reads for you — visibility of a concurrent write is precisely what the lock is guarding (d).",
      },
      {
        id: "read-write-locks-q2",
        question: "Three readers are inside and a writer requests the write lock. What happens?",
        options: [
          { id: "a", label: "The writer waits until all three readers release, and meanwhile new readers are made to queue too." },
          { id: "b", label: "The writer is admitted immediately and writes alongside the readers." },
          { id: "c", label: "The three readers are forcibly evicted so the writer can start at once." },
          { id: "d", label: "The write is silently dropped because the lock is already held." },
        ],
        correctOptionId: "a",
        explanation:
          "The write lock is exclusive, so it can only be granted when the room is completely empty — the writer waits for the current readers to drain. Holding new readers out while it waits is what stops it from starving. It is never admitted alongside readers (b), locks never evict existing holders (c), and the write is not dropped — it is delayed (d).",
      },
      {
        id: "read-write-locks-q3",
        question: "A counter is incremented by a thousand threads and read occasionally, each critical section being a single field update. What should you use?",
        options: [
          { id: "a", label: "A plain mutex or an atomic — a read-write lock's bookkeeping would cost more than the work it protects." },
          { id: "b", label: "A read-write lock, since read-write locks are always faster than mutexes." },
          { id: "c", label: "A read-write lock with fair mode enabled, to make the increments faster." },
          { id: "d", label: "No lock at all — single-field updates are automatically atomic." },
        ],
        correctOptionId: "a",
        explanation:
          "This workload is write-heavy with a microscopic critical section, the exact case where a read-write lock loses: writes serialise anyway, and the reader-counting overhead is paid on every acquire. Read-write locks are not universally faster (b), and fairness adds cost rather than removing it (c). Unsynchronised increments are a textbook race — read-modify-write is not atomic (d).",
      },
      {
        id: "read-write-locks-q4",
        question: "A thread holding the read lock calls writeLock().lock() without releasing the read lock first. What happens?",
        options: [
          { id: "a", label: "It deadlocks — the write lock waits for all readers to leave, and this thread is one of those readers." },
          { id: "b", label: "The lock upgrades cleanly and the thread continues holding only the write lock." },
          { id: "c", label: "The read lock is silently released and the write lock is granted." },
          { id: "d", label: "It throws a compile-time error in Java." },
        ],
        correctOptionId: "a",
        explanation:
          "Upgrading is not supported by ReentrantReadWriteLock, std::shared_mutex or sync.RWMutex: the writer blocks until the reader count hits zero, and the thread is itself keeping that count above zero, so it waits for itself forever. Downgrading (write to read) is the direction that is legal (b, c), and nothing about this is visible to the compiler — it hangs at runtime (d).",
      },
      {
        id: "read-write-locks-q5",
        question: "What is writer starvation, and how do real implementations avoid it?",
        options: [
          { id: "a", label: "A steady stream of readers keeps the lock permanently held, so a waiting writer never gets in — fixed by write-preferring or fair (FIFO) policies." },
          { id: "b", label: "A writer holds the lock so long that readers never run — fixed by capping how long a write may take." },
          { id: "c", label: "Two writers deadlock waiting for each other — fixed by acquiring locks in a fixed order." },
          { id: "d", label: "It only affects distributed systems, so a single-process lock is immune." },
        ],
        correctOptionId: "a",
        explanation:
          "Under a read-preferring policy, readers walk straight in whenever no writer is currently inside, so an overlapping stream of readers can keep the room occupied indefinitely and the writer waits forever without ever being deadlocked. The cure is a policy that queues new readers behind a waiting writer, or full FIFO fairness. Option (b) inverts the roles, (c) describes lock-ordering deadlock, and (d) is simply false.",
      },
      {
        id: "read-write-locks-q6",
        question: "Your in-memory routing table is read constantly and replaced once a minute. Besides a read-write lock, what alternative removes reader locking entirely?",
        options: [
          { id: "a", label: "Copy-on-write: build a fresh immutable table, then publish it by atomically swapping one reference — readers just read the current snapshot." },
          { id: "b", label: "Give every reader thread its own mutex so they never contend." },
          { id: "c", label: "Mark the table field volatile and mutate it in place." },
          { id: "d", label: "Increase the thread pool size so more readers can run." },
        ],
        correctOptionId: "a",
        explanation:
          "If writes are rare, the writer can build a whole new immutable copy and publish it with a single atomic reference swap — readers then need no lock at all and can never see a half-finished update. Per-reader mutexes protect nothing, since they don't exclude the writer (b). volatile makes the reference visible but does not make in-place mutation of the contents safe (c), and adding threads increases contention rather than removing it (d).",
      },
    ],
  },
};
