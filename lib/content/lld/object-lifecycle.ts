import type { RoadmapLesson } from "@/lib/content/types";

export const objectLifecycle: RoadmapLesson = {
  title: "Object Lifecycle",
  oneLiner:
    "Every object is born (constructor), lives while something points to it, becomes unreachable when the last reference is dropped, and is finally cleaned up (destructor or garbage collector).",
  difficulty: "beginner",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/object-lifecycle.html",
  content: {
    prototypeCaption:
      "Watch one object travel through four lanes — **Constructed → Active → Unreachable → Reclaimed**. Press *new Object()* to build one, *use()* it, *drop reference* until its count hits 0 so it slides to Unreachable, then *Run GC* to reclaim it. The console narrates every step.",

    overview: [
      {
        type: "p",
        text: "An object isn't permanent. It has a *life* — it gets created, it does its job for a while, and eventually it goes away. Understanding that journey is what stops you from leaking memory, holding files open forever, or using something that's already gone.",
      },
      {
        type: "p",
        text: "Think of a hotel room. When a guest checks in, the room is **constructed** for them (clean towels, fresh sheets — the *constructor* runs). While the guest is staying, the room is **active** and in use. When the guest checks out, nobody is pointing to that room anymore — it's **unreachable**. Later, housekeeping comes through, resets the room, and makes it available again — that's **cleanup**. The room had a clear beginning, middle, and end.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The four stages to remember",
        text: "**Constructed** (the constructor runs once) → **Active** (something still references it) → **Unreachable** (the last reference is dropped) → **Reclaimed** (memory freed, destructor/finalizer runs). Every object you ever create walks this path.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Birth: the constructor runs once" },
      {
        type: "p",
        text: "When you write `new Connection()`, the runtime first allocates memory for the object, then calls its **constructor**. The constructor runs *exactly once* per object and its job is initialization — setting fields to valid starting values and acquiring any resources the object needs, like opening a file or a network socket. After it finishes, the object exists and is ready to use.",
      },
      {
        type: "ul",
        items: [
          "**Allocation** — space is reserved in memory for the object's fields.",
          "**Initialization** — the constructor stores the passed-in values and opens any resources (a `db.connect()`, a file handle, a socket).",
          "Once the constructor returns, the object is *alive* and references to it can be handed around.",
        ],
      },
      { type: "h", text: "Life: in active use while referenced" },
      {
        type: "p",
        text: "An object stays alive as long as *something* points to it — a variable, a field on another object, an entry in a list. Call its methods, read its fields, pass it around; it keeps doing its job. The key idea is **reachability**: if your program can still get to the object through some chain of references, it must be kept alive.",
      },
      { type: "h", text: "Becoming unreachable: the last reference drops" },
      {
        type: "p",
        text: "The moment *nothing* references an object anymore, it becomes **unreachable**. The variable went out of scope, you reassigned it, or you removed it from a collection. The object is still sitting in memory, but your program has no way to reach it. It's now *garbage* — eligible for cleanup.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "reachability.ts",
        code: `let c = new Connection("db://localhost"); // constructed, 1 reference
const also = c;                            // 2 references now
c.query("SELECT 1");                       // active use
c = null;                                  // 1 reference left (via 'also')
// still reachable through 'also' — NOT collected yet
// ...later...
// when 'also' goes out of scope too → 0 references → unreachable`,
      },
      { type: "h", text: "Cleanup: destructor vs garbage collection" },
      {
        type: "p",
        text: "How the cleanup happens depends entirely on the language, and this is where the two big worlds split apart:",
      },
      {
        type: "ul",
        items: [
          "**Manual / deterministic (C++, Rust)** — cleanup happens at a *known* moment. In C++, when an object goes out of scope, its **destructor** runs immediately and predictably. This powers **RAII** (Resource Acquisition Is Initialization): acquire a resource in the constructor, release it in the destructor, and scope exit guarantees cleanup.",
          "**Garbage collected (Java, JavaScript, Python, Go, C#)** — a **garbage collector** periodically finds unreachable objects and frees their memory for you. You don't call `delete`. The catch: it runs *whenever it decides to*, not the instant the object becomes unreachable.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Finalizers are non-deterministic — don't rely on them",
        text: "Python's `__del__`, Java's `finalize()`, and similar finalizers *may* run when the GC collects an object — but you can't predict *when*, and they might not run at all before the program exits. Never put critical cleanup (closing a file, releasing a lock) in a finalizer. Use `try/finally`, `with`, `try-with-resources`, or RAII instead — they guarantee cleanup at a known point.",
      },
      {
        type: "p",
        text: "So the lifecycle is universal — born, live, become unreachable, get reclaimed — but *who* triggers the final cleanup, and *when*, differs. In the prototype, **Run GC** stands in for that sweep: it walks the Unreachable lane, runs each object's finalizer, frees it, and removes the card.",
      },
    ],

    handsOn: [
      {
        title: "01 · Construct and use an object",
        body: "Press **new Object()** to build a fresh `Conn`. Watch it appear in the **Constructed** lane (the constructor logs `Conn#N constructed`), then advance into **Active** with a reference count of 1. Hit **use()** a couple of times — the card pulses and the console logs each method call. This is an object doing its job while alive.",
      },
      {
        title: "02 · Drop the last reference",
        body: "On an active object, press **drop reference** to decrement its count. Get it down to **0** and the card slides into the **Unreachable** lane — nothing in your program can reach it anymore. Notice it still exists in memory; it just isn't gone yet.",
      },
      {
        title: "03 · Reclaim with the garbage collector",
        body: "Press **Run GC** (or wait for the automatic sweep). Every object in the Unreachable lane has its destructor/finalizer run — logged as `GC: Conn#N finalized & reclaimed` — and then fades out and disappears. Keep an eye on the **live objects** stat: it only counts objects that still exist.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "connection.ts",
        code: `// JS/TS is garbage-collected — no manual delete, no reliable destructor.
class Connection {
  private open = false;

  constructor(public url: string) {
    this.open = true;
    console.log(\`Conn(\${url}) constructed — socket opened\`);
  }

  query(sql: string) {
    if (!this.open) throw new Error("use after close");
    return \`result of \${sql}\`;
  }

  // GC won't reliably call this — close explicitly instead.
  close() {
    this.open = false;
    console.log(\`Conn(\${this.url}) closed\`);
  }
}

let c: Connection | null = new Connection("db://localhost");
c.query("SELECT 1");   // active use
c.close();             // deterministic cleanup — do it yourself
c = null;              // last reference dropped → unreachable
// the GC will reclaim the memory at some later, unspecified time.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Connection.java",
        code: `// Java is garbage-collected. Use try-with-resources for cleanup,
// NOT finalize() (deprecated and non-deterministic).
class Connection implements AutoCloseable {
    private final String url;
    private boolean open;

    Connection(String url) {
        this.url = url;
        this.open = true;
        System.out.println("Conn(" + url + ") constructed");
    }

    String query(String sql) {
        if (!open) throw new IllegalStateException("use after close");
        return "result of " + sql;
    }

    @Override public void close() {       // runs at a KNOWN point
        open = false;
        System.out.println("Conn(" + url + ") closed");
    }
}

// try-with-resources closes c the moment the block exits.
try (Connection c = new Connection("db://localhost")) {
    c.query("SELECT 1");   // active use
}                          // close() called here — deterministic
// the object becomes unreachable after the block; GC frees it later.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "connection.py",
        code: `# Python is garbage-collected (with reference counting on CPython).
# Use a context manager ('with'); don't rely on __del__.
class Connection:
    def __init__(self, url: str):
        self.url = url
        self.open = True
        print(f"Conn({url}) constructed")

    def query(self, sql: str) -> str:
        if not self.open:
            raise RuntimeError("use after close")
        return f"result of {sql}"

    def close(self) -> None:        # deterministic cleanup
        self.open = False
        print(f"Conn({self.url}) closed")

    def __enter__(self):  return self
    def __exit__(self, *exc):  self.close()

    def __del__(self):              # non-deterministic — may never run!
        if self.open:
            self.close()


with Connection("db://localhost") as c:
    c.query("SELECT 1")    # active use
# __exit__ → close() runs here, at a known point.
# once 'c' has no references, CPython reclaims it.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "connection.cpp",
        code: `// C++ cleanup is DETERMINISTIC. RAII: acquire in ctor, release in dtor.
#include <iostream>
#include <string>

class Connection {
    std::string url;
    bool open = false;

public:
    explicit Connection(std::string u) : url(std::move(u)), open(true) {
        std::cout << "Conn(" << url << ") constructed\\n"; // open resource
    }

    std::string query(const std::string& sql) {
        return "result of " + sql;
    }

    ~Connection() {                 // destructor — runs at scope exit
        if (open) std::cout << "Conn(" << url << ") closed\\n";
    }
};

void work() {
    Connection c("db://localhost"); // constructed
    c.query("SELECT 1");            // active use
}                                   // c goes out of scope HERE →
                                    // ~Connection() runs immediately.
// No GC, no leak — RAII guarantees cleanup at a known point.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Why lifecycle awareness matters" },
      {
        type: "ul",
        items: [
          "**Resource leaks** — files, sockets, and DB connections opened in a constructor must be closed. The GC frees *memory*, but it won't promptly close your *file handle*. Forget to close and you'll run out of handles.",
          "**Dangling / use-after-free** — in manual-memory languages, touching an object after it's been freed is a crash or a security bug. Know when an object's life ends.",
          "**Knowing when to free** — pick the right tool: deterministic cleanup (`finally`, `with`, RAII) for resources; let the GC handle plain memory.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Memory is reclaimed automatically; resources are not",
        text: "Even in garbage-collected languages, treat *external resources* (files, sockets, locks) differently from *memory*. Memory gets cleaned up for you, eventually. Resources need an explicit, deterministic release — close them yourself the moment you're done.",
      },
    ],

    tradeoffs: {
      pros: [
        "You know exactly when an object is safe to use and when it's gone — no use-after-free surprises.",
        "You release files, sockets, and locks at the right moment instead of leaking them.",
        "You can reason about memory pressure — why objects linger, and what keeps them alive (still-reachable references).",
        "You pick the right cleanup mechanism per language: RAII/`finally`/`with` for resources, GC for plain memory.",
      ],
      cons: [
        "**Resource leaks** — opening a file/socket in a constructor and never closing it because 'the GC will handle it' (it won't, in time).",
        "**Use-after-free / dangling references** — keeping a pointer to an object after its lifetime ended.",
        "**Relying on finalizers** — putting cleanup in `__del__`/`finalize()` and assuming it runs promptly, or at all.",
        "**Heavy constructors** — doing slow or failure-prone work (network calls, big allocations) in the constructor, so creating an object becomes expensive or throws midway.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Creating Objects",
        href: "https://docs.oracle.com/javase/tutorial/java/javaOO/objectcreation.html",
        note: "The Java tutorial on how `new` allocates and the constructor initializes an object.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Object lifetime",
        href: "https://en.wikipedia.org/wiki/Object_lifetime",
        note: "A language-agnostic overview of creation, use, and destruction across runtimes.",
        kind: "article",
      },
      {
        label: "MDN — Memory management",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
        note: "How JavaScript decides an object is unreachable and how the garbage collector reclaims it.",
        kind: "docs",
      },
      {
        label: "Python docs — object.__del__",
        href: "https://docs.python.org/3/reference/datamodel.html#object.__del__",
        note: "The reference for Python finalizers — and the warnings about why you can't depend on them.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Resource Acquisition Is Initialization (RAII)",
        href: "https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization",
        note: "The C++ idiom that ties resource cleanup to object lifetime for deterministic release.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "ol-q1",
        question: "What runs exactly once when an object is first created, to set up its starting state?",
        options: [
          { id: "a", label: "The destructor" },
          { id: "b", label: "The garbage collector" },
          { id: "c", label: "The constructor" },
          { id: "d", label: "The finalizer" },
        ],
        correctOptionId: "c",
        explanation:
          "The constructor runs once per object, right after memory is allocated, to initialize fields and acquire resources. Destructors and finalizers run at the *end* of an object's life, not the start.",
      },
      {
        id: "ol-q2",
        question: "In a garbage-collected language, when does an object become eligible for collection?",
        options: [
          { id: "a", label: "As soon as the constructor finishes." },
          { id: "b", label: "When the last reference to it is dropped, so nothing can reach it." },
          { id: "c", label: "Exactly 60 seconds after it's created." },
          { id: "d", label: "Only when you manually call delete on it." },
        ],
        correctOptionId: "b",
        explanation:
          "An object stays alive while it's *reachable* through some chain of references. The instant the last reference is gone, it's unreachable and the GC may reclaim it — but at a time of the GC's choosing.",
      },
      {
        id: "ol-q3",
        question: "Why shouldn't you rely on Python's `__del__` or Java's `finalize()` to close a file?",
        options: [
          { id: "a", label: "They run too often and slow the program down." },
          { id: "b", label: "They are non-deterministic — they may run late, or not at all before exit." },
          { id: "c", label: "They can only close network sockets, not files." },
          { id: "d", label: "They run before the object is even constructed." },
        ],
        correctOptionId: "b",
        explanation:
          "Finalizers fire whenever (and if) the GC gets around to collecting the object — you can't predict when, and they may never run. For deterministic cleanup, use `with`, `try/finally`, try-with-resources, or RAII.",
      },
      {
        id: "ol-q4",
        question: "In C++, when does an object's destructor run for a local variable?",
        options: [
          { id: "a", label: "At a random time chosen by a garbage collector." },
          { id: "b", label: "Never — C++ has no destructors." },
          { id: "c", label: "Immediately and predictably, when it goes out of scope." },
          { id: "d", label: "Only if you call free() on it yourself." },
        ],
        correctOptionId: "c",
        explanation:
          "C++ cleanup is deterministic: a local object's destructor runs the moment it goes out of scope. That guarantee is what makes RAII work — acquire in the constructor, release in the destructor.",
      },
    ],
  },
};
