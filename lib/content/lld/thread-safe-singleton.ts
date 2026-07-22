import type { RoadmapLesson } from "@/lib/content/types";

export const threadSafeSingleton: RoadmapLesson = {
  title: "Thread-safe Singleton",
  oneLiner:
    "The classic `if (instance == null) instance = new X();` works perfectly — until two threads run it at the same instant and both see `null`. Then you get *two* singletons, which is a contradiction in terms. This lesson walks the four standard fixes in order — a lock on the whole method, double-checked locking with `volatile`, and the static holder idiom — and shows exactly why the last one is usually the right answer.",
  difficulty: "intermediate",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/thread-safe-singleton.html",
  content: {
    prototypeCaption:
      "Two threads, **🧵 T1** and **🧵 T2**, call `getInstance()` at the same instant. Pick an implementation with the chips — **❌ Naive**, **🐢 synchronized**, **⚡ DCL + volatile**, **🏅 Holder** — then hit **▶ Both call getInstance()** and watch the two lanes step through their instructions in a fixed interleaving (or drive it yourself with **⏭ Step**). Watch two counters: **🏭 instances created** and **🔒 lock acquisitions**. In *Naive*, both lanes pass the null check and the instance counter goes to **2** — two red printer boxes, one guarantee broken. In *synchronized* it stays at 1, but T2 visibly **waits** at the lock on *every* round and the lock counter climbs to **6**. In *DCL* the lock is taken on the first call only, then the counter stops rising — and flipping the **volatile: ON/OFF** switch makes T2 grab a **⚠️ half-built** object. In *Holder* there is no lock and no null check at all — the shortest lane of the four, with **🔒 0**. The scoreboard at the bottom keeps every verdict side by side.",

    overview: [
      {
        type: "p",
        text: "A Singleton's whole promise is *one instance*. The textbook lazy version keeps that promise beautifully in a single-threaded program: `if (instance == null) instance = new Printer();` runs once, and every later call returns the stored object. Put two threads on it, though, and the promise quietly breaks — because that one innocent line is really **three** separate steps (read the field, build the object, write the field), and another thread can slip in between any two of them.",
      },
      {
        type: "p",
        text: "Picture the office again. Two colleagues, **Ana** and **Ben**, both need the shared printer. Each walks to the corner, sees it's **empty**, and thinks *\"there's no printer here — I'll order one.\"* Neither knows the other is doing the same thing at that exact moment. An hour later, two printers arrive. Nobody did anything wrong individually; the problem is that *checking* and *acting* were two separate moments, and the world changed in between. That gap is called a **race condition**, and it is the entire subject of this lesson.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Lazy creation is only safe if the *check* and the *create* happen as **one indivisible step**. Every fix below is just a different way of making that true: hold a lock while you do both, or let the language's class loader do it for you.",
      },
      {
        type: "callout",
        variant: "info",
        title: "This is a top-5 interview question",
        text: "\"Write a thread-safe Singleton\" is asked constantly, and the interviewer is almost never after the code — they want to hear *why* double-checked locking needs `volatile`, and *why* the static holder idiom (or an `enum`) is preferred over it. If you can say those two things clearly, you have answered the question.",
      },
    ],

    howItWorks: [
      { type: "h", text: "1 · Naive lazy — the broken baseline" },
      {
        type: "p",
        text: "Here is the version everyone writes first. It has no protection of any kind:",
      },
      {
        type: "code",
        language: "java",
        filename: "Naive.java",
        code: `public static Printer getInstance() {
    if (instance == null) {          // ① T1 reads null ... and so does T2
        instance = new Printer();    // ② both build. TWO instances exist.
    }
    return instance;                 // ③ each thread returns a different object
}`,
      },
      {
        type: "p",
        text: "Run the prototype in **❌ Naive** mode and you can watch it happen: T1 reads the field and sees `null`, then T2 reads it *before T1 has written anything* and also sees `null`. Both enter the branch, both call `new Printer()`, and **🏭 instances created** ticks to **2**. Each thread walks away holding a different object with a different queue — which is precisely the bug a Singleton exists to prevent. Worse, it's *intermittent*: on most runs the timing works out fine, so this bug ships to production and shows up once a week under load.",
      },
      { type: "h", text: "2 · synchronized — correct, but you pay forever" },
      {
        type: "p",
        text: "The obvious fix is a **lock**: put `synchronized` on the method so only one thread can be inside it at a time. A lock is a key to a room — you can't enter until whoever has the key comes out. Now T1 takes the key, checks, builds, and leaves; T2 waits, gets the key, checks, sees the instance already exists, and returns it. One instance, guaranteed.",
      },
      {
        type: "p",
        text: "The cost is that the lock is on **every** call, forever. In the prototype's **🐢 synchronized** mode, run all three rounds: **🔒 lock acquisitions** climbs to **6** even though the instance was built on the very first one. Rounds 2 and 3 acquire and release a lock purely to read a field that will never change again — and T2 still blocks in amber, waiting its turn. On a hot path called from many threads, that queue at the door becomes real contention.",
      },
      { type: "h", text: "3 · Double-checked locking — lock only when it might matter" },
      {
        type: "p",
        text: "**Double-checked locking (DCL)** removes the everyday cost by checking *twice*: once cheaply without the lock, and once again inside it. Think of a window in the supply-room door — you look through the window first (free), and only if the corner looks empty do you bother taking the key, and then you look again *inside* the room before ordering anything.",
      },
      {
        type: "code",
        language: "java",
        filename: "DoubleChecked.java",
        code: `private static volatile Printer instance;      // volatile is NOT optional

public static Printer getInstance() {
    if (instance == null) {                    // ① fast path, no lock
        synchronized (Printer.class) {         // ② only the first callers get here
            if (instance == null) {            // ③ check AGAIN, now under the lock
                instance = new Printer();
            }
        }
    }
    return instance;                           // later calls never touch the lock
}`,
      },
      {
        type: "p",
        text: "The **second** check is the one that does the work. Two threads can both fail check ①, but only one of them gets the lock; by the time the loser is let in, check ③ is false and it just returns what's already there. After that first call, every future call fails check ① immediately and returns without touching the lock at all. In the prototype's **⚡ DCL + volatile** mode, the lock counter moves during round 1 and then **stops rising** — that's the whole payoff.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Drop `volatile` and DCL silently breaks",
        text: "`volatile` means: **every thread always reads and writes this field in main memory, in program order — no caching, no reordering.** Without it, the compiler and CPU are allowed to *reorder* `instance = new Printer()` so the field is set to the new address **before** the constructor has finished filling in the object's fields. A second thread then passes the lock-free check ①, sees a non-null reference, skips the lock entirely and returns a **half-built object** — non-null, but with empty fields. Flip the **volatile: ON/OFF** switch in the prototype and run it: T2's lane turns red with *⚠️ half-built object visible*. This is not theoretical; before Java 5 fixed the memory model, DCL was formally declared broken.",
      },
      { type: "h", text: "4 · The static holder idiom — lazy AND lock-free" },
      {
        type: "p",
        text: "Here's the punchline: you can get lazy initialisation with **no lock and no null check at all**, by making the language do it. Every JVM already guarantees that a class is initialised **exactly once**, and that all threads see the finished result — it takes an internal lock during class loading and then never again. So put the instance in a tiny private nested class that isn't loaded until someone actually touches it. This is the **Bill Pugh** or *initialization-on-demand holder* idiom:",
      },
      {
        type: "code",
        language: "java",
        filename: "Holder.java",
        code: `public class Printer {
    private Printer() {}

    private static class Holder {                  // not loaded until first touched
        static final Printer INSTANCE = new Printer();   // JVM: runs exactly once
    }

    public static Printer getInstance() {
        return Holder.INSTANCE;                    // no lock, no null check
    }
}`,
      },
      {
        type: "p",
        text: "`Holder` isn't loaded when `Printer` is loaded — only when `Holder.INSTANCE` is first *read*. That read triggers class initialisation, the JVM builds the instance once under its own one-time lock, and every call afterwards is a plain field read. You get **lazy** (nothing is built until first use), **thread-safe** (guaranteed by the class loader), and **fast** (zero synchronisation in your code) — and the method body is one line. In the prototype's **🏅 Holder** mode the lane is visibly the shortest of the four and **🔒 lock acquisitions** stays at **0**.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The simplest bulletproof Java Singleton is an enum",
        text: "`public enum Printer { INSTANCE; ... }` gives you all of the above *plus* free protection against serialization and reflection attacks, because the JVM guarantees enum constants are unique. Joshua Bloch calls it the best way to implement a singleton in *Effective Java*. Its only real drawbacks: it's eager (created when the enum class loads) and it can't extend another class.",
      },
      { type: "h", text: "Eager initialisation — the honest simple option" },
      {
        type: "p",
        text: "You can also just write `private static final Printer INSTANCE = new Printer();` directly on the class. The JVM's one-time class-initialisation guarantee makes this completely thread-safe with zero ceremony. The only thing you lose is laziness: the object is built the moment the class loads, whether or not anyone ever asks for it. That's fine for something cheap, and wasteful for something that opens sockets or reads files. The scoreboard row **🥱 Eager field** in the prototype shows exactly that trade: 1 instance, 0 locks, *lazy: ✗*. The holder idiom exists to give you the same safety **without** giving up laziness.",
      },
      { type: "h", text: "Other languages have their own guarantees" },
      {
        type: "ul",
        items: [
          "**Python** — a plain module-level object is already a singleton, because a module's body executes exactly once on first import and the import machinery holds a lock while it does. If you must build one lazily inside a class, wrap the check-and-create in a `threading.Lock` — the GIL does *not* make check-then-act safe.",
          "**C++11 and later** — a `static` local variable inside a function (a *Meyers singleton*) is guaranteed by the standard to be initialised exactly once, with other threads blocked until it's done. These are nicknamed **magic statics**. `std::call_once` with a `std::once_flag` is the explicit equivalent.",
          "**Go** — `sync.Once` is the idiom: `once.Do(func() { instance = newPrinter() })` runs the function exactly once no matter how many goroutines call it, and guarantees the result is visible to all of them. Package-level `var` plus `func init()` is the eager equivalent.",
          "**C#** — `Lazy<T>` with the default thread-safety mode does the whole job for you, and a static readonly field gets the same one-time initialisation guarantee from the CLR.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Making the object immutable dissolves most of the problem",
        text: "All of this is about safely publishing *one* object. If that object also holds mutable state that many threads read and write, you have a **second**, larger thread-safety problem inside it that no amount of clever `getInstance()` will fix. A singleton whose fields are all `final` and never change is the easiest kind to get right.",
      },
    ],

    handsOn: [
      {
        title: "01 · Break it on purpose",
        body: "Leave the chip on ❌ Naive and press ▶ Both call getInstance(). Watch the lanes: T1 reads the field and sees null, then T2 reads it and *also* sees null — neither has written yet. Both run instance = new Printer(), 🏭 instances created jumps to 2, and two printer boxes appear (the second in red). Each thread's 'got:' line shows a different object. That is the race condition, made visible in six steps.",
      },
      {
        title: "02 · Feel the cost of the lock, then remove it",
        body: "Switch to 🐢 synchronized and run all three rounds. Instances stay at 1 ✓ — but T2 turns amber and sits at '⏸ waiting for lock' on every single round, and 🔒 lock acquisitions climbs 2 → 4 → 6 long after the instance exists. Now switch to ⚡ DCL + volatile and run three rounds again: the lock counter moves during round 1 and then stops dead, because rounds 2 and 3 exit on the lock-free first check. Use ⏭ Step to walk round 1 slowly and watch T2 stop at the *second* check inside the lock.",
      },
      {
        title: "03 · Turn volatile off, then meet the winner",
        body: "Still in ⚡ DCL mode, click the volatile: ON switch so it reads volatile: OFF, then run round 1. T1 publishes the reference before the constructor finishes; T2's first check sees non-null, skips the lock, and its lane flashes red with '⚠️ got a bad object' next to a ⚠️ half-built printer. Finally switch to 🏅 Holder: two instructions, no lock badge, no null check, 🔒 lock acquisitions: 0, and instances 1 ✓. Compare all five rows in the scoreboard — including 🥱 Eager field, the one that scores lazy: ✗.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "Printer.java",
        code: `import java.util.*;

/** All four implementations side by side, worst to best. */
public class Printer {

    private final List<String> queue = new ArrayList<>();
    private Printer() { }                       // 🔒 no 'new Printer()' outside

    // ── 1. NAIVE — broken under concurrency ────────────────────────────
    private static Printer naive;
    public static Printer naiveGet() {
        if (naive == null) {                    // two threads can BOTH pass here
            naive = new Printer();              // → two instances
        }
        return naive;
    }

    // ── 2. SYNCHRONIZED — correct, but every call pays for the lock ────
    private static Printer synced;
    public static synchronized Printer syncedGet() {
        if (synced == null) synced = new Printer();
        return synced;                          // lock acquired on EVERY call
    }

    // ── 3. DOUBLE-CHECKED LOCKING — needs volatile, or it is broken ────
    private static volatile Printer dcl;        // volatile: no reordering,
                                                // no stale reads
    public static Printer dclGet() {
        if (dcl == null) {                      // ① cheap check, no lock
            synchronized (Printer.class) {      // ② only first callers get here
                if (dcl == null) {              // ③ check again under the lock
                    dcl = new Printer();
                }
            }
        }
        return dcl;                             // later calls skip the lock
    }

    // ── 4. STATIC HOLDER (Bill Pugh) — lazy, lock-free, usually the answer
    private static class Holder {               // loaded on first touch only
        static final Printer INSTANCE = new Printer();  // JVM runs this ONCE
    }
    public static Printer getInstance() {
        return Holder.INSTANCE;                 // no lock, no null check
    }

    public void print(String job) { queue.add(job); }
}

// ── 5. The simplest bulletproof form: a one-element enum ───────────────
// enum PrinterEnum {
//     INSTANCE;                                 // unique even across
//     public void print(String job) { ... }      // serialization + reflection
// }`,
      },
      {
        label: "Python",
        language: "python",
        filename: "printer.py",
        code: `import threading


class Printer:
    """Lazy singleton that is safe under threads.

    The GIL does NOT make 'check then create' atomic: a thread switch can
    happen between the check and the assignment, so you still need a lock.
    """

    _instance = None
    _lock = threading.Lock()        # one lock shared by the class

    @classmethod
    def get_instance(cls) -> "Printer":
        if cls._instance is None:               # ① fast path, no lock
            with cls._lock:                     # ② only first callers get here
                if cls._instance is None:       # ③ check again under the lock
                    obj = cls.__new__(cls)
                    obj._queue = []             # finish building BEFORE publish
                    cls._instance = obj         # publish last
        return cls._instance

    def print(self, job: str) -> None:
        self._queue.append(job)


# ✅ Usually simpler in Python: a module-level object. A module's body runs
# exactly once on first import, and the import system holds a lock while it
# does — so this is already a thread-safe, lazily-created singleton.
printer = Printer.get_instance()


# ✅ Function-scoped alternative, thread-safe and lazy in one decorator:
# from functools import cache
# @cache
# def get_printer() -> Printer: ...`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "printer.cpp",
        code: `#include <mutex>
#include <string>
#include <vector>

class Printer {
    std::vector<std::string> queue;
    Printer() = default;                       // 🔒 private constructor

public:
    Printer(const Printer&) = delete;
    Printer& operator=(const Printer&) = delete;

    // ── BEST: "magic statics". Since C++11 the standard guarantees a
    // function-local static is initialised exactly once; other threads
    // block until it is done. Lazy, thread-safe, no lock you can see.
    static Printer& instance() {
        static Printer only;                   // built on first call
        return only;                           // every call → same object
    }

    void print(const std::string& job) { queue.push_back(job); }
};

// ── Explicit equivalent when you need more control: std::call_once.
class Logger {
    static std::once_flag flag;
    static Logger* inst;
public:
    static Logger& instance() {
        std::call_once(flag, [] { inst = new Logger(); });  // runs ONCE
        return *inst;
    }
};
std::once_flag Logger::flag;
Logger* Logger::inst = nullptr;

// ⚠️ Hand-rolled double-checked locking needs std::atomic with the right
// memory order — a plain pointer has the same half-built-object bug as
// Java without volatile. Prefer the magic static above.`,
      },
      {
        label: "Go",
        language: "go",
        filename: "printer.go",
        code: `package printer

import "sync"

type Printer struct {
	mu    sync.Mutex
	queue []string
}

var (
	instance *Printer
	once     sync.Once // the idiomatic Go answer
)

// GetInstance returns the one Printer. sync.Once guarantees the function
// runs exactly once no matter how many goroutines call GetInstance at the
// same moment, and that every caller sees the finished value.
func GetInstance() *Printer {
	once.Do(func() {
		instance = &Printer{queue: make([]string, 0)}
	})
	return instance
}

func (p *Printer) Print(job string) {
	p.mu.Lock() // the singleton itself still needs its own locking
	defer p.mu.Unlock()
	p.queue = append(p.queue, job)
}

// ✅ Eager alternative: a package-level var is initialised once, before
// main() runs, by the Go runtime — no lock and no Once needed.
//
//	var eager = &Printer{}
//
// ❌ Never hand-roll "if instance == nil { instance = ... }" in Go either:
// it is a data race, and 'go test -race' will flag it.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Pick the implementation like this" },
      {
        type: "ul",
        items: [
          "**Default: the static holder idiom** (or `enum` in Java, a module-level object in Python, a function-local `static` in C++, `sync.Once` in Go). Lazy, thread-safe, lock-free, and short enough to get right on the first try.",
          "**Eager `static final` field** — when the object is cheap to build and certain to be used. Simplest possible correct code; you're only paying startup cost you were going to pay anyway.",
          "**Double-checked locking** — when you genuinely need lazy creation *and* the holder idiom doesn't fit, typically because the instance depends on runtime arguments or lives in a non-static field. Write `volatile`. Never skip it.",
          "**Plain `synchronized` method** — fine when `getInstance()` is called rarely, or in a quick prototype. Correct is better than clever; optimise only if the lock actually shows up in a profile.",
        ],
      },
      { type: "h", text: "Step back before you optimise the lock" },
      {
        type: "p",
        text: "The best fix is often to not need a lazy global at all. Create the one instance at startup and **pass it** to whatever needs it — dependency injection gives you \"exactly one\" without any of this, and it stays testable. See [[dependency-injection-and-ioc]]. If you do keep a singleton, remember that thread-safe *creation* is only half the job: the object's own mutable state still needs its own locking or immutability, as covered by [[singleton]]'s trade-offs.",
      },
    ],

    tradeoffs: {
      pros: [
        "The holder idiom gives you lazy, thread-safe, lock-free initialisation in one line — the language runtime does the hard part and can't be got wrong.",
        "Double-checked locking removes the lock from the common path entirely: after the first call, getInstance() is a single field read.",
        "A one-element enum (Java) adds free protection against serialization and reflection creating a second instance.",
        "Eager initialisation is trivially correct — no locks, no checks, nothing to review — whenever laziness isn't worth anything.",
      ],
      cons: [
        "Naive lazy initialisation fails intermittently and invisibly: it usually works, so the duplicate-instance bug reaches production and appears only under load.",
        "A synchronized getInstance() taxes every call forever, including the millions that happen after the instance already exists.",
        "Double-checked locking is famously easy to write incorrectly — forget volatile and you publish half-built objects, and no test will reliably catch it.",
        "The holder idiom can't take runtime arguments and only works for a static instance, so it doesn't cover every case.",
      ],
    },

    furtherReading: [
      {
        label: "The \"Double-Checked Locking is Broken\" Declaration",
        href: "https://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html",
        note: "The original write-up, signed by a long list of JVM and concurrency experts, showing step by step how reordering lets another thread see a half-built object. The definitive source on why volatile is required.",
        kind: "paper",
      },
      {
        label: "JSR-133 Java Memory Model and Thread Specification FAQ",
        href: "https://www.cs.umd.edu/~pugh/java/memoryModel/jsr-133-faq.html",
        note: "Jeremy Manson and Brian Goetz explain volatile, happens-before, safe publication and final-field semantics in plain English. Read the volatile and final sections before your next concurrency interview.",
        kind: "spec",
      },
      {
        label: "Java Language Specification §12.4 — Initialization of Classes and Interfaces",
        href: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-12.html#jls-12.4.2",
        note: "The actual guarantee the holder idiom relies on: the JVM initialises each class exactly once, under its own lock, with the result visible to all threads. Dense but short.",
        kind: "docs",
      },
      {
        label: "Java Concurrency in Practice — Brian Goetz et al.",
        href: "https://jcip.net/",
        note: "The standard reference. Chapter 3 (Sharing Objects) and Chapter 16 cover safe publication and lazy initialisation holders, including exactly why the naive version is unsafe.",
        kind: "book",
      },
      {
        label: "Double-Checked Locking with Singleton — Baeldung",
        href: "https://www.baeldung.com/java-singleton-double-checked-locking",
        note: "A practical Java walkthrough of the DCL variants with and without volatile, plus the holder and enum alternatives. Good for cementing the code shapes.",
        kind: "article",
      },
      {
        label: "sync.Once — Go package documentation",
        href: "https://pkg.go.dev/sync#Once",
        note: "Go's one-line answer to this whole lesson, with the memory-visibility guarantee spelled out: Do returns only after f has completed, and every caller observes the result.",
        kind: "docs",
      },
      {
        label: "Storage duration — static local variables (cppreference)",
        href: "https://en.cppreference.com/w/cpp/language/storage_duration",
        note: "The C++11 'magic statics' rule: a function-local static is initialised exactly once and concurrent callers wait for it. This is why the Meyers singleton is thread-safe for free.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "thread-safe-singleton-q1",
        question: "Why is `if (instance == null) instance = new Printer();` unsafe with two threads?",
        options: [
          { id: "a", label: "Both threads can read the field as null before either one writes it, so both run the constructor and two instances exist." },
          { id: "b", label: "The constructor itself cannot be called from more than one thread." },
          { id: "c", label: "It is safe — the JVM makes single-line assignments atomic." },
          { id: "d", label: "The second thread will always throw a NullPointerException." },
        ],
        correctOptionId: "a",
        explanation:
          "The check and the create are two separate steps, so a second thread can slip in between them and also see null — a classic check-then-act race, and the field ends up written twice. Constructors are perfectly callable from many threads (b), and nothing about this throws (d). Option (c) confuses a single assignment being atomic with the whole check-then-act sequence being atomic — it is not.",
      },
      {
        id: "thread-safe-singleton-q2",
        question: "What is the real drawback of putting `synchronized` on the whole getInstance() method?",
        options: [
          { id: "a", label: "Every call acquires the lock forever, including the millions made long after the instance already exists." },
          { id: "b", label: "It can still create two instances under heavy load." },
          { id: "c", label: "It makes the singleton eager instead of lazy." },
          { id: "d", label: "It only works if the field is also marked volatile." },
        ],
        correctOptionId: "a",
        explanation:
          "A synchronized method is correct — one instance, always — but the lock is paid on every single call, so threads queue up just to read a field that will never change again. It stays lazy (c), it never produces two instances (b), and because the lock provides the memory-visibility guarantee itself, volatile is not needed (d).",
      },
      {
        id: "thread-safe-singleton-q3",
        question: "In double-checked locking, what does the SECOND null check accomplish?",
        options: [
          { id: "a", label: "It catches the thread that passed the first check but then waited at the lock, so it returns the instance the winner just built instead of building another." },
          { id: "b", label: "It makes the first check unnecessary." },
          { id: "c", label: "It releases the lock earlier than a plain synchronized method would." },
          { id: "d", label: "It replaces the need for the volatile keyword." },
        ],
        correctOptionId: "a",
        explanation:
          "Two threads can both fail check ①, but only one gets the lock; the loser enters afterwards and check ③ is now false, so it simply returns the existing object. The first check is the whole optimisation and stays essential (b), the checks have nothing to do with lock release timing (c), and volatile is still required for safe publication (d).",
      },
      {
        id: "thread-safe-singleton-q4",
        question: "What goes wrong if the DCL field is not declared `volatile`?",
        options: [
          { id: "a", label: "Writes can be reordered so the reference is published before the constructor finishes, letting another thread take the lock-free path and get a half-built object." },
          { id: "b", label: "The lock stops working and two instances are created." },
          { id: "c", label: "The field is garbage-collected between the two checks." },
          { id: "d", label: "Nothing — volatile is only a performance hint." },
        ],
        correctOptionId: "a",
        explanation:
          "volatile forbids reordering and stale reads, guaranteeing that any thread which sees a non-null reference also sees a fully constructed object. Without it the assignment can become visible before construction completes, so a reader on the fast path returns an object with empty fields. The lock still excludes other writers (b), nothing is collected while referenced (c), and volatile is a correctness requirement, not a hint (d).",
      },
      {
        id: "thread-safe-singleton-q5",
        question: "Why is the static holder idiom (a private nested class holding the instance) usually the preferred answer?",
        options: [
          { id: "a", label: "The class loader guarantees one-time, thread-safe initialisation, and the holder class isn't loaded until first use — so it is lazy and lock-free with no synchronisation code of your own." },
          { id: "b", label: "It creates the instance eagerly when the outer class loads, which avoids all races." },
          { id: "c", label: "It uses double-checked locking internally, so it is just shorter to write." },
          { id: "d", label: "It allows more than one instance when several threads ask at once." },
        ],
        correctOptionId: "a",
        explanation:
          "The JVM already initialises every class exactly once under its own internal lock, and a nested class is only initialised when one of its members is first referenced — so you get laziness and thread safety for free, with zero locks in your code. It is specifically NOT eager (b), involves no double-checked locking (c), and guarantees exactly one instance (d).",
      },
      {
        id: "thread-safe-singleton-q6",
        question: "Which pairing of language and idiomatic one-time initialisation is correct?",
        options: [
          { id: "a", label: "Go uses sync.Once, and C++11 relies on a function-local static ('magic statics') being initialised exactly once." },
          { id: "b", label: "Go uses volatile, and C++ requires a manual double-checked lock on a raw pointer." },
          { id: "c", label: "Python's GIL makes a naive check-then-create singleton fully thread-safe, so no lock is needed." },
          { id: "d", label: "Every language needs the Java holder idiom copied verbatim." },
        ],
        correctOptionId: "a",
        explanation:
          "sync.Once.Do runs its function exactly once and publishes the result to all goroutines, and since C++11 a function-local static is guaranteed to be initialised once with other threads blocked until it completes. Go has no volatile keyword and hand-rolled C++ DCL needs std::atomic (b); the GIL can still switch threads between the check and the assignment, so Python needs a threading.Lock (c); and each language has its own native mechanism (d).",
      },
    ],
  },
};
