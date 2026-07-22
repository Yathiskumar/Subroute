import type { RoadmapLesson } from "@/lib/content/types";

export const immutableObjectsForSafety: RoadmapLesson = {
  title: "Immutable Objects for Safety",
  oneLiner:
    "Every concurrency bug in this phase needs the same three ingredients: shared data, *mutable* data, and no coordination. Take away **mutable** and the whole class of bugs disappears — an object that can never change needs no lock, no `volatile`, no careful publishing. Think of a printed boarding pass: anyone can hold a copy and read it safely, because nobody can edit it while you're looking. Change the gate and you print a *new* pass; your old one stays a perfectly valid snapshot of an earlier moment.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/immutable-objects-for-safety.html",
  content: {
    prototypeCaption:
      "One shared `Point`, one ✍️ **Writer**, two 👓 **Readers**. In **✏️ Mutable** mode press `▶ Update (x, y)` — the write lands in two visible micro-steps (`x = 9` … then `y = 9`), and Reader A, reading in the gap, captures **x: 9 · y: 2** and flashes red with a `⚠️ torn read` chip: a state that never legally existed. The chip `🔒 Add a lock` fixes it and you immediately see the price — both readers grey out as `⏳ blocked` while the writer holds the lock. Now flip to **🔒 Immutable** and press the same button: a whole new card `v2 · x: 9 · y: 9` appears *beside* the old one, then the blue `current ▼` pointer swings across in one step. Reader A keeps showing a consistent `v1 · x: 1 · y: 2`; Reader B reads `v2`. Nobody ever sees a mix, and the readout stays `locks needed: 0 · torn reads: 0 · readers blocked: 0`. The `🕳 shallow trap` chip shows the one way this still breaks.",

    overview: [
      {
        type: "p",
        text: "Look back at every bug in this phase — the race condition, the stale value, the half-built singleton. They all need **three** things at once: data that is **shared** between threads, data that is **mutable**, and **no coordination** between the threads touching it. Locks attack the third ingredient: they add coordination. Immutability attacks the second one, and it is by far the cheapest fix — because a bug that *cannot be expressed* costs nothing to prevent.",
      },
      {
        type: "p",
        text: "Here's the mental model: a **printed boarding pass** versus a **shared whiteboard**. The whiteboard holds today's gate number, and anyone can walk up and rewrite it — so everyone has to take turns, and if you read while someone is mid-rewrite you get half of the old gate and half of the new one. A printed pass is different: your copy says `Gate A1` and it will *always* say `Gate A1`. Ten people can read ten copies at the same time with no queue, no marker, no turn-taking. When the gate changes, the airline prints a **new** pass — and your old one is still a consistent snapshot of an earlier moment, not garbage.",
      },
      {
        type: "p",
        text: "You already know *how* to build such an object from [[immutability-and-value-objects]] — final fields, no setters, `withX()` instead of `setX()`. This lesson is about *why that is a concurrency superpower*: an immutable object needs **no lock at all**, and can be shared by any number of threads, forever, with zero synchronization.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "If an object never changes, there is **no write to race with** — so any number of threads may read it at the same time with **zero locks**, and no reader can ever see a half-updated state.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've met it already",
        text: "Java's `String`, `Integer`, `LocalDate` and `record` types; Python's `tuple`, `str` and `frozenset`; every message you push through a queue or a Go channel. These are handed between threads all day long and nobody ever locks them — because there is nothing to lock.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Three ingredients — remove one and the bug is gone" },
      {
        type: "p",
        text: "A data race needs *shared* **and** *mutable* **and** *uncoordinated*. That gives you three ways out, and they are not equally priced:",
      },
      {
        type: "ul",
        items: [
          "**Remove *shared*** — give each thread its own copy or confine the object to one thread. Works, but you often *need* the sharing.",
          "**Remove *uncoordinated*** — add a lock ([[locks-mutex-semaphore]]) or a read-write lock ([[read-write-locks]]). Correct, but now you own a lock: contention, blocked readers, and a chance to deadlock ([[deadlock-race-starvation]]).",
          "**Remove *mutable*** — make the object immutable. No lock to acquire, no lock to forget, nothing to contend on, and readers never block each other. This is the cheapest of the three whenever it fits.",
        ],
      },
      { type: "h", text: "The torn read: a state that never legally existed" },
      {
        type: "p",
        text: "This is the bug the prototype dramatises. A writer updates two fields of a shared object. In the source it looks like a single change; at runtime it is **two separate writes** with a gap in between. A reader that arrives in that gap sees the new `x` and the *old* `y` — an object that is internally inconsistent, a combination the program never intended to produce. That's a **torn read** (also called an inconsistent or half-updated read):",
      },
      {
        type: "code",
        language: "java",
        filename: "TornRead.java",
        code: `// MUTABLE and shared — the writer's "one change" is really two writes.
class Point {
    int x = 1, y = 2;               // invariant we care about: x == y
}

Point p = new Point();              // shared by every thread

// writer thread
p.x = 9;                            // ← step 1
                                    // ← a reader arriving HERE sees x:9, y:2
p.y = 9;                            // ← step 2

// reader thread
System.out.println(p.x + "," + p.y); // may print 9,2 — a state that
                                     // never legally existed`,
      },
      {
        type: "p",
        text: "Notice what makes this so nasty: nothing crashed, no exception was thrown, and the reader's own code is flawless. It simply observed a moment that the writer never meant to expose. Bugs like this appear once in ten thousand runs and are almost impossible to reproduce on demand.",
      },
      { type: "h", text: "Change by copy — the old object stays valid" },
      {
        type: "p",
        text: "An immutable object cannot be half-updated, because it is never updated at all. A \"change\" is a method like `withX(9)` that **builds and returns a brand-new object** and leaves the original exactly as it was. That's the boarding pass being reprinted. Crucially, a thread still holding the *old* reference is not broken or stale-in-a-dangerous-way — it holds a **consistent snapshot** of an earlier moment, which is almost always fine and sometimes exactly what you want (a report, a request being served, a frame being rendered).",
      },
      {
        type: "code",
        language: "java",
        filename: "Point.java",
        code: `// A record is immutable: fields are final, there are no setters.
public record Point(int x, int y) {

    // "mutators" are really factories — the original is never touched.
    public Point withX(int newX) { return new Point(newX, y); }
    public Point moveTo(int nx, int ny) { return new Point(nx, ny); }
}

Point v1 = new Point(1, 2);
Point v2 = v1.moveTo(9, 9);   // v2 is a NEW object, fully formed
// v1 is STILL (1, 2) for anyone holding it — a valid older snapshot.
// There is no moment in which any Point exists as (9, 2).`,
      },
      { type: "h", text: "Safe publication for free" },
      {
        type: "p",
        text: "There is a second, subtler win. Normally, handing a freshly built object to another thread is risky: the other thread can see the reference *before* it sees the fields the constructor wrote — the classic broken double-checked lock in [[thread-safe-singleton]]. Java closes that hole for immutable objects: if a field is `final`, any thread that sees the object at all is **guaranteed** to see that field correctly initialised, with no `volatile` and no lock. That guarantee is written into the language spec (the *final field semantics* of the Java Memory Model). Immutable objects are therefore **safe to publish** by any means at all — a plain field, a `HashMap`, a queue, a callback.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Plain words: \"safe publication\"",
        text: "*Publishing* an object means making it visible to another thread. *Safely* published means the other thread is guaranteed to see the object fully built, not a half-constructed shell. Mutable objects need a lock, a `volatile`, or a concurrent collection to be published safely. Immutable objects with final fields need nothing.",
      },
      { type: "h", text: "The atomic swap: keep the mutable part to one reference" },
      {
        type: "p",
        text: "\"Nothing ever changes\" is fine for a `Money` or a `Point`, but real programs *do* change — configuration reloads, prices update, routing tables shift. The idiom that makes immutability practical is to shrink the mutable part down to **a single reference**, and make every change one pointer swap. The data is immutable; only the *pointer to the current version* moves. Because swapping a reference is a single atomic operation, every reader sees either the whole old version or the whole new version — never a mixture. That is exactly the `current ▼` arrow swinging from `v1` to `v2` in the prototype.",
      },
      {
        type: "code",
        language: "java",
        filename: "ConfigHolder.java",
        code: `public record Config(String host, int port, int timeoutMs) {}

// The ONLY mutable thing in the whole design: one reference.
static final AtomicReference<Config> CURRENT =
        new AtomicReference<>(new Config("a.example", 80, 500));

// Readers — thousands of threads, no lock, never blocked.
Config c = CURRENT.get();        // one read gets a consistent whole
use(c.host(), c.port());         // c can NEVER change under us

// Writer — build the new version, then swap in one step.
Config next = new Config("b.example", 443, 800);
CURRENT.set(next);               // all-or-nothing for every reader`,
      },
      {
        type: "p",
        text: "Note what readers get here: `CURRENT.get()` once, into a local variable, and from then on the object is frozen for as long as they need it. A reader that started before the swap simply finishes its work against the older config — consistently. This is the same shape as **copy-on-write** collections (`CopyOnWriteArrayList`), where a mutation copies the whole array and swaps the reference: reads are free and lock-free, writes are expensive.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The shallow trap — an object is only immutable if everything it holds is too",
        text: "A `final List<String> tags` field freezes the **reference**, not the list. Any thread that can reach it can still call `tags.add(\"x\")` and mutate your \"immutable\" object through the back door — and now you have a data race again, in a class you believed was safe. Fix it on **both** sides: copy on the way in (`this.tags = List.copyOf(tags)`) so the caller's list isn't yours, and never hand the live collection out of a getter. This is the `🕳 shallow trap` chip in the prototype: `final` reference ≠ frozen contents.",
      },
      { type: "h", text: "What it costs" },
      {
        type: "ul",
        items: [
          "**Allocation and GC pressure** — every change makes a new object. For small value objects in a modern runtime this is close to free; in a hot loop that rebuilds a large object millions of times, it is not.",
          "**Copying big structures** — replacing one entry in a 100 000-element immutable map by copying the whole map is O(n) per write. **Persistent (structural-sharing) data structures** solve this by sharing the untouched parts between versions, giving O(log n) \"copies\" — that's what Clojure's collections, Scala's `Vector`, and libraries like Immutable.js do.",
          "**Write-heavy contention moves, it doesn't vanish** — with an atomic swap, two writers can still clash. Use `compareAndSet` in a retry loop rather than blind `set`, or accept a lock on the (rare) write path.",
          "**Ceremony** — constructors, builders, `withX()` methods and defensive copies are more typing than a setter. Records, frozen dataclasses and `const` cut most of it away.",
        ],
      },
      { type: "h", text: "Where it shines" },
      {
        type: "ul",
        items: [
          "**Configuration and lookup tables** — read constantly by everything, changed rarely by one reloader. The atomic-swap idiom was practically invented for this.",
          "**Value objects** — `Money`, `Point`, `LocalDate`, `Currency`, IDs. Small, shared everywhere, and safe map keys precisely because their hash can never change.",
          "**Messages between threads** — anything you hand to a queue, an executor, a channel or an actor should be immutable, so sender and receiver can't stomp on each other after the handoff.",
          "**Functional and actor styles** — Clojure, Erlang/Elixir and Akka build their entire concurrency story on \"never mutate shared data\", which is why they need so few locks.",
          "**Caches and snapshots** — a cached immutable result can be handed to every caller with no defensive copying at all.",
        ],
      },
      { type: "h", text: "One line per language" },
      {
        type: "ul",
        items: [
          "**Java** — `record` gives you final fields, value equality and the final-field publication guarantee; `List.copyOf` / `Map.copyOf` make truly unmodifiable copies; `AtomicReference` holds the one mutable pointer.",
          "**Python** — `tuple`, `frozenset` and `@dataclass(frozen=True)`; rebinding a module-level or attribute reference is atomic under the GIL, which makes the swap idiom easy (use a lock only around read-modify-write).",
          "**C++** — `const` members and `const` methods; share as `std::shared_ptr<const Config>` and swap it with `std::atomic<std::shared_ptr<const T>>` so readers never lock.",
          "**Go** — structs are **values**, so passing one copies it; keep the shared thing a `sync/atomic.Pointer` or, better, follow the proverb *\"don't communicate by sharing memory; share memory by communicating\"* and send immutable values over a channel.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "The design habit",
        text: "When you catch yourself reaching for a lock, ask first: *does this object have to change at all?* Very often the answer is no, and the lock — plus every bug that lock could ever have — simply evaporates.",
      },
    ],

    handsOn: [
      {
        title: "01 · Break it in Mutable mode",
        body: "Start in ✏️ Mutable and press ▶ Update (x, y). The writer lane shows `x = 9` (step 1 of 2) while the card still reads `y: 2` and glows amber. In that gap Reader A reads and flashes red with `⚠️ torn read`, showing **x: 9 · y: 2** — a state that never legally existed. The readout ticks to `locks needed: 1 · torn reads: 1`. Reader B, arriving after step 2, is fine — which is exactly why this bug hides in testing.",
      },
      {
        title: "02 · Pay for the fix, then stop paying",
        body: "Click the `🔒 Add a lock` chip and press ▶ Update again. No torn read this time — but both readers go amber `⏳ blocked` while the writer holds the lock, and `readers blocked` climbs. Now flip the toggle to 🔒 Immutable and press ▶ Update (x, y). A new card `v2 · x: 9 · y: 9` appears fully formed beside `v1`, then the blue `current ▼` pointer swings across in one step. Readouts: `locks needed: 0 · torn reads: 0 · readers blocked: 0`.",
      },
      {
        title: "03 · Old snapshots, and the one way it still breaks",
        body: "In 🔒 Immutable mode, notice Reader A still shows `v1 · x: 1 · y: 2` — it holds an older reference and that snapshot is perfectly consistent, not corrupt. Press 👓 Read now and both readers jump to the current version, with no lock taken. Finally press the `🕳 shallow trap` chip: `point.tags.add(\"x\")` mutates every version through the shared list and the cards flash red — proof that a final reference is not frozen contents. Press ↺ Reset to start over.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "ConfigService.java",
        code: `import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

// ---- The immutable value. A record's fields are final, so any thread
// ---- that sees this object is GUARANTEED to see it fully built.
public record Config(String host, int port, List<String> tags) {

    // Compact constructor: defensive copy IN.
    // Without this, the caller keeps a live handle on our list.
    public Config {
        tags = List.copyOf(tags);      // truly unmodifiable, not just final
    }

    // "Change" = build a new object; this one is never touched.
    public Config withPort(int newPort) {
        return new Config(host, newPort, tags);
    }
}

public class ConfigService {

    // The ONLY mutable thing in the design: a single reference.
    private static final AtomicReference<Config> CURRENT =
            new AtomicReference<>(new Config("a.example", 80, List.of("v1")));

    // Readers: any number of threads, no lock, never blocked.
    static void handleRequest() {
        Config c = CURRENT.get();      // one read → a consistent whole
        // c can never change under us, so no torn read is possible
        System.out.println(c.host() + ":" + c.port());
    }

    // Writer: build the new version, then swap the pointer atomically.
    static void reload(int newPort) {
        Config next = CURRENT.get().withPort(newPort);
        CURRENT.set(next);             // readers see all-old or all-new
    }

    // Read-modify-write? Use compareAndSet so two writers can't lose an update.
    static void bumpPort() {
        Config old, next;
        do {
            old = CURRENT.get();
            next = old.withPort(old.port() + 1);
        } while (!CURRENT.compareAndSet(old, next));
    }

    public static void main(String[] args) throws Exception {
        Thread reader = new Thread(() -> { for (int i = 0; i < 3; i++) handleRequest(); });
        Thread writer = new Thread(() -> reload(443));
        reader.start(); writer.start();
        reader.join();  writer.join();
        // Zero locks were taken. Zero torn reads are possible.
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "config_service.py",
        code: `import threading
from dataclasses import dataclass, replace


# frozen=True blocks attribute writes and gives value equality + hashing.
@dataclass(frozen=True)
class Config:
    host: str
    port: int
    tags: tuple[str, ...]        # tuple, NOT list — a list would be mutable

    def with_port(self, new_port: int) -> "Config":
        return replace(self, port=new_port)   # returns a NEW Config


# The only mutable thing: one module-level reference.
_current = Config("a.example", 80, ("v1",))


def reload(new_port: int) -> None:
    """Writer: build the new version, then rebind the name.
    Rebinding a name is a single bytecode under the GIL, so readers
    see either the whole old Config or the whole new one."""
    global _current
    _current = _current.with_port(new_port)


def handle_request() -> None:
    """Reader: grab the reference ONCE into a local, then use it freely."""
    c = _current                  # snapshot; it can never change under us
    print(f"{c.host}:{c.port}")   # no lock, no torn read


if __name__ == "__main__":
    readers = [threading.Thread(target=handle_request) for _ in range(3)]
    writer = threading.Thread(target=reload, args=(443,))
    for t in readers:
        t.start()
    writer.start()
    for t in readers + [writer]:
        t.join()

    # c.port = 9999               # FrozenInstanceError — no write to race with
    # Note: read-modify-write (read _current, then rebind) still needs a
    # threading.Lock if two writers can run at once.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "config_service.cpp",
        code: `#include <atomic>
#include <iostream>
#include <memory>
#include <string>
#include <thread>
#include <vector>

// ---- The immutable value: const members, set once, no setters.
struct Config {
    const std::string host;
    const int port;
    const std::vector<std::string> tags;   // copied in, never handed out live

    Config(std::string h, int p, std::vector<std::string> t)
        : host(std::move(h)), port(p), tags(std::move(t)) {}

    // "Change" = a brand-new value; *this is never modified.
    Config withPort(int newPort) const { return Config(host, newPort, tags); }
};

using ConfigPtr = std::shared_ptr<const Config>;   // const → readers cannot mutate

// The ONLY mutable thing: one atomic pointer (C++20).
std::atomic<ConfigPtr> CURRENT{
    std::make_shared<const Config>("a.example", 80, std::vector<std::string>{"v1"})};

// Readers: lock-free, never blocked, always see a whole Config.
void handleRequest() {
    ConfigPtr c = CURRENT.load();          // snapshot, kept alive by the shared_ptr
    std::cout << c->host << ":" << c->port << "\\n";
}

// Writer: build a new version, then swap the pointer in one step.
void reload(int newPort) {
    ConfigPtr next = std::make_shared<const Config>(CURRENT.load()->withPort(newPort));
    CURRENT.store(next);                   // all-or-nothing for every reader
}

int main() {
    std::thread r1(handleRequest), r2(handleRequest), w(reload, 443);
    r1.join(); r2.join(); w.join();
    // No mutex anywhere: there is no write to race with.
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "config_service.go",
        code: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

// Structs are VALUES in Go: assigning or passing one copies it.
// Keep every field a value type (no slices/maps) and it is immutable in practice.
type Config struct {
	Host string
	Port int
}

// "Change" = return a new value; the receiver is a copy, so c is untouched.
func (c Config) WithPort(p int) Config {
	c.Port = p
	return c
}

// The ONLY mutable thing: one atomic pointer to an immutable Config.
var current atomic.Pointer[Config]

func reload(p int) {
	next := current.Load().WithPort(p)
	current.Store(&next) // one pointer swap: readers see all-old or all-new
}

func handleRequest() {
	c := *current.Load() // copy the value out — nobody can change it under us
	fmt.Printf("%s:%d\\n", c.Host, c.Port)
}

func main() {
	current.Store(&Config{Host: "a.example", Port: 80})

	var wg sync.WaitGroup
	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func() { defer wg.Done(); handleRequest() }()
	}
	wg.Add(1)
	go func() { defer wg.Done(); reload(443) }()
	wg.Wait()

	// The other Go way: "don't communicate by sharing memory;
	// share memory by communicating" — send immutable values down a channel.
	ch := make(chan Config, 1)
	go func() { ch <- Config{Host: "b.example", Port: 8080} }()
	fmt.Println(<-ch) // the receiver owns its own copy; no lock needed
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Make it immutable when..." },
      {
        type: "ul",
        items: [
          "**Many threads read it and few (or none) change it** — config, feature flags, routing tables, pricing rules, compiled regexes, lookup maps. Readers never block each other and never need a lock.",
          "**It's a value** — money, dates, coordinates, identifiers, units. Its identity *is* its data, so there is no reason it should ever mutate, and it becomes a safe map/set key for free.",
          "**It crosses a thread boundary** — anything handed to a queue, executor, channel, actor or callback. Immutable payloads mean sender and receiver can't corrupt each other after the handoff.",
          "**You want safe publication without ceremony** — final fields let you share the object through a plain field or a plain `HashMap` with no `volatile` and no lock.",
        ],
      },
      { type: "h", text: "Keep it mutable when..." },
      {
        type: "ul",
        items: [
          "**Writes are frequent and the object is large** — rebuilding a big structure on every edit will cost more than a well-scoped lock. Reach for a persistent data structure first, a lock second.",
          "**The thing genuinely has a lifecycle** — an in-progress `Order`, a game world, a connection pool. Model those as mutable *entities*, but build them out of immutable values.",
          "**It's confined to one thread anyway** — a local buffer or a per-request builder is not shared, so mutating it is free of risk. (Build mutably in private, then freeze and publish.)",
          "**You need in-place performance** — tight numeric loops over big arrays are the classic case where copying is simply not an option.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Zero locks — an immutable object can be read by any number of threads at once, with no synchronization and no contention.",
        "Torn reads become impossible — there is no half-updated state to observe, so readers always see an internally consistent object.",
        "Safe publication for free — final fields are guaranteed visible after construction, so you can share the object through any channel with no volatile.",
        "Old references stay valid — a reader holding a previous version keeps a coherent snapshot instead of watching data shift mid-computation.",
      ],
      cons: [
        "Allocation and GC pressure — every change creates a new object, which matters in hot write paths.",
        "Copying large structures is O(n) per write unless you use persistent/structural-sharing collections.",
        "Writers still need care — two threads swapping the same reference must use compare-and-swap or a lock, or one update is silently lost.",
        "Shallow immutability is a trap — a final reference to a mutable list or map leaves the door wide open, and the class *looks* safe.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Immutable Objects (Java Concurrency tutorial)",
        href: "https://docs.oracle.com/javase/tutorial/essential/concurrency/immutable.html",
        note: "The official short explanation of why immutable objects are inherently thread-safe, with a worked before/after example.",
        kind: "docs",
      },
      {
        label: "JLS §17.5 — final Field Semantics",
        href: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html",
        note: "The spec text behind 'safe publication for free': why a thread that sees the object is guaranteed to see its final fields fully initialised.",
        kind: "spec",
      },
      {
        label: "Java Concurrency in Practice — Goetz et al.",
        href: "https://jcip.net/",
        note: "Chapter 3 ('Sharing Objects') is the canonical treatment of immutability, safe publication and the volatile-holder/atomic-swap idioms.",
        kind: "book",
      },
      {
        label: "AtomicReference — Java SE API docs",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/AtomicReference.html",
        note: "The class that holds the single mutable pointer in the copy-and-swap idiom, including compareAndSet for competing writers.",
        kind: "docs",
      },
      {
        label: "The Go Blog — Share Memory By Communicating",
        href: "https://go.dev/blog/codelab-share",
        note: "Go's take on the same idea: pass immutable values over channels instead of sharing mutable state behind locks.",
        kind: "article",
      },
      {
        label: "Persistent data structure — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Persistent_data_structure",
        note: "How structural sharing makes 'copy on every change' affordable — the answer to immutability's biggest cost.",
        kind: "article",
      },
      {
        label: "Rich Hickey — The Value of Values (InfoQ)",
        href: "https://www.infoq.com/presentations/Value-Values/",
        note: "The talk that convinced a generation that values (not places) are the right unit of shared state. Worth the hour.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "immutable-objects-for-safety-q1",
        question: "Why is an immutable object thread-safe without any lock?",
        options: [
          { id: "a", label: "Because it never changes, so there is no write for a read to race with." },
          { id: "b", label: "Because the JVM automatically wraps every method call in a synchronized block." },
          { id: "c", label: "Because only one thread is allowed to hold a reference to it at a time." },
          { id: "d", label: "Because immutable objects are always stored in thread-local memory." },
        ],
        correctOptionId: "a",
        explanation:
          "A data race needs a write concurrent with another access. If the object's state is fixed at construction, every access is a read, so there is nothing to coordinate. Nothing is auto-synchronized (b), references can be shared by any number of threads at once (c), and the object lives on the ordinary shared heap, not in thread-local storage (d).",
      },
      {
        id: "immutable-objects-for-safety-q2",
        question: "In the prototype's Mutable mode, Reader A reports x: 9 · y: 2. What is that?",
        options: [
          { id: "a", label: "A torn read — the reader observed the object between the write to x and the write to y, a state that never legally existed." },
          { id: "b", label: "A deadlock between the reader and the writer." },
          { id: "c", label: "A cache-eviction artifact that a restart would fix." },
          { id: "d", label: "Correct behaviour — the reader is meant to see fields update one at a time." },
        ],
        correctOptionId: "a",
        explanation:
          "The writer's single logical change is two separate field writes, and the reader landed in the gap, seeing an internally inconsistent object. Nothing is blocked waiting on anything, so it isn't a deadlock, and it isn't a caching artifact — it's a real intermediate state the program never intended to expose.",
      },
      {
        id: "immutable-objects-for-safety-q3",
        question: "A class has only `final` fields, but one of them is a `List` that other code can still call `.add()` on. Is it safe to share across threads?",
        options: [
          { id: "a", label: "No — final freezes the reference, not the contents; any thread can mutate the list, so the race is back." },
          { id: "b", label: "Yes — final fields make the entire object graph immutable." },
          { id: "c", label: "Yes, as long as the class has no setters." },
          { id: "d", label: "Yes, because lists in Java are synchronized by default." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the shallow-vs-deep trap: `final` only stops the field being reassigned. Callers reaching that list can still mutate it, which reintroduces shared mutable state in a class that looks safe. Absent setters doesn't help, and ArrayList is not synchronized. The fix is copying in (List.copyOf) and never exposing the live collection.",
      },
      {
        id: "immutable-objects-for-safety-q4",
        question: "Configuration must be reloadable, but you want lock-free readers. What's the standard idiom?",
        options: [
          { id: "a", label: "Keep the Config immutable and hold the only mutable state in a single AtomicReference, so a change is one atomic pointer swap." },
          { id: "b", label: "Give every reader a synchronized block around each field access." },
          { id: "c", label: "Mutate the existing Config object's fields in place and mark each one volatile." },
          { id: "d", label: "Copy the Config into a thread-local for every reader on every request." },
        ],
        correctOptionId: "a",
        explanation:
          "Shrink the mutable part to one reference: build a whole new immutable Config, then swap the pointer. Readers do a single get() and see either the entire old version or the entire new one. Synchronizing every read (b) reintroduces blocking, per-field volatile (c) still allows a torn read across fields, and per-request thread-locals (d) don't solve how updates get in.",
      },
      {
        id: "immutable-objects-for-safety-q5",
        question: "After an atomic swap to v2, a worker thread is still holding its reference to v1. What should you do?",
        options: [
          { id: "a", label: "Nothing — v1 is a consistent snapshot of an earlier moment, and the worker can safely finish its job against it." },
          { id: "b", label: "Interrupt the worker, because it is now reading corrupted memory." },
          { id: "c", label: "Mutate v1 in place so it matches v2 and the worker catches up." },
          { id: "d", label: "Take a lock on v1 so no other thread reads the stale version." },
        ],
        correctOptionId: "a",
        explanation:
          "That's the whole point of change-by-copy: old versions stay valid and internally consistent, like an old boarding pass. v1 is not corrupt (b) — it's just older. Mutating it (c) would recreate the very bug immutability removed, and there is no write to guard against, so a lock (d) buys nothing.",
      },
      {
        id: "immutable-objects-for-safety-q6",
        question: "What is the main practical cost of an immutable-first design?",
        options: [
          { id: "a", label: "Every change allocates a new object, so write-heavy paths on large structures need persistent (structural-sharing) collections to stay affordable." },
          { id: "b", label: "Reads become slower because each one must copy the object first." },
          { id: "c", label: "Immutable objects cannot be used as map keys." },
          { id: "d", label: "It only works on a single CPU core." },
        ],
        correctOptionId: "a",
        explanation:
          "Copying on every write is the real price, and it bites when the structure is big and writes are frequent — persistent data structures share the untouched parts to make it O(log n) instead of O(n). Reads are actually cheaper (no lock, no copy), immutable objects make the *best* map keys because their hash can't change, and none of this is tied to core count.",
      },
    ],
  },
};
