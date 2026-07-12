import type { RoadmapLesson } from "@/lib/content/types";

export const singleton: RoadmapLesson = {
  title: "Singleton",
  oneLiner:
    "Make sure a class has exactly one instance for the whole program, and give everyone an easy way to reach that same one. Instead of `new Printer()` scattered everywhere (which makes a fresh printer each time), everyone calls `Printer.getInstance()` and gets back the one shared printer — same object, same queue, every time.",
  difficulty: "beginner",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/singleton.html",
  content: {
    prototypeCaption:
      "An office with **one shared printer**. Flip between two worlds. In **WITHOUT Singleton**, every `new Printer()` makes a brand-new printer — click *Get printer* three times and you get three separate machines, each with its own job queue, so your print jobs scatter and nothing lines up. In **WITH Singleton**, every `getInstance()` hands back the *same* printer #1 — click it ten times and all the arrows point at one machine with one shared queue. Send a job from any desk and it lands in that single queue. The identity readout (`printer === printer2 ?`) flips from **false** to **true** the moment you switch worlds. One or two clicks and the whole idea lands: one instance, reachable from anywhere.",

    overview: [
      {
        type: "p",
        text: "**Singleton** is the simplest of all design patterns to state: make sure a class has **exactly one instance**, and give the whole program one easy way to get to it. That's it. Some things in a system are naturally *one of a kind* — there's one app configuration, one logger writing to one file, one connection pool — and it would be a bug to accidentally have two.",
      },
      {
        type: "p",
        text: "Picture an office with **one shared printer**. Everyone's desk can send jobs to it, and they all land in the *same* queue. Nobody 'makes a new printer' when they want to print — that would be absurd; you'd end up with a room full of half-used machines and your pages scattered across all of them. Instead, everyone reaches for *the* printer. A Singleton makes your class behave exactly like that shared printer: no matter how many times or from where you ask for it, you always get the one and only instance.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A Singleton guarantees **one instance** and a **global point of access** to it. You don't create it with `new` from the outside — you *ask the class for it* (`getInstance()`), and it hands back the same object every single time.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Singleton has a bad reputation — and it's partly deserved",
        text: "Singleton is famous *and* controversial. Because it's globally reachable and holds state, it can quietly couple your whole codebase together and make testing painful (every test shares the same object). Reach for it only when something is *genuinely* one-of-a-kind. When in doubt, prefer creating one instance at startup and passing it in where it's needed (dependency injection) — you get 'one instance' without the hidden global. We cover this honestly in the trade-offs below.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three moving parts" },
      {
        type: "p",
        text: "A textbook Singleton does three small things. Together they make it impossible to get a second instance:",
      },
      {
        type: "ul",
        items: [
          "**A private constructor** — so nobody *outside* the class can write `new Printer()`. The door to `new` is locked; only the class itself has the key.",
          "**A single stored instance** — the class keeps one reference to itself in a private static field (`private static instance`), the one and only copy.",
          "**A public accessor** — a static method `getInstance()` that everyone calls. The first call creates the instance and stashes it; every later call returns that same stored one.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `class Printer {
  private static instance: Printer;   // the one stored copy
  private queue: string[] = [];

  private constructor() {}            // 🔒 no 'new Printer()' from outside

  static getInstance(): Printer {     // everyone comes through here
    if (!Printer.instance) {          // first call? build it once
      Printer.instance = new Printer();
    }
    return Printer.instance;          // every call → the same object
  }

  print(job: string) { this.queue.push(job); }
}`,
      },
      {
        type: "p",
        text: "The magic is entirely in `getInstance()`. The **first** time anyone calls it, the `if` is true, so it builds the printer once and saves it. Every call after that, the `if` is false, so it skips straight to returning the *already-built* instance. Ask for it a thousand times from a thousand places — you get the exact same object a thousand times.",
      },
      {
        type: "callout",
        variant: "info",
        title: "\"Same object\" means identity, not just equal",
        text: "Two printers with empty queues might look *equal*, but a Singleton gives you the very same object in memory. That's why `Printer.getInstance() === Printer.getInstance()` is `true` — both names point at one thing. Anything you add to its queue from one place is instantly visible from every other place, because there's only one queue.",
      },
      { type: "h", text: "Lazy vs eager: when is it built?" },
      {
        type: "p",
        text: "There are two common styles, and the only difference is *when* the single instance gets created:",
      },
      {
        type: "ul",
        items: [
          "**Lazy** — built on the *first* call to `getInstance()` (the code above). You don't pay to create it until someone actually needs it. The catch: in a multi-threaded program, two threads could both see the `if` as true at once and each build one — that's the famous 'thread-safe Singleton' problem, solved with double-checked locking or a holder class (a later topic).",
          "**Eager** — built once when the class first loads, before anyone asks. Dead simple and automatically thread-safe, but you pay the creation cost up front even if it's never used.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "The easiest correct Singleton",
        text: "In many languages the simplest safe Singleton isn't the classic `getInstance()` at all. In Java it's a single-element `enum`; in Python a plain module-level object (modules are imported once); in modern apps, one instance created at startup and injected where needed. The classic private-constructor version is the one interviewers ask about — but know that the boring alternatives are often the better real-world choice.",
      },
      { type: "h", text: "Why the 'without' world goes wrong" },
      {
        type: "p",
        text: "If the constructor is *public* and everyone writes `new Printer()`, each call makes a **fresh** printer with its **own** empty queue. Desk A prints to its printer, Desk B prints to a different one, and now your pages are split across machines nobody agreed on. The whole point of a shared resource — one queue, one config, one log file — is lost. The prototype lets you feel this directly: create three printers, watch the jobs scatter, then flip to the Singleton world and watch them all snap onto one machine.",
      },
    ],

    handsOn: [
      {
        title: "01 · Live in the 'without' world first",
        body: "Open the prototype with the toggle on WITHOUT Singleton. Click 'Get printer' three times — three separate printer boxes appear, each labelled #1, #2, #3. Send a print job from a desk and notice it only lands in whichever printer that desk grabbed. The identity check `printer === printer2` reads false: these are genuinely different objects. This is the bug the pattern prevents.",
      },
      {
        title: "02 · Flip to the Singleton world",
        body: "Switch the toggle to WITH Singleton. Now click 'Get printer' as many times as you like — every call draws an arrow back to the same printer #1. The identity check flips to true. Send jobs from different desks and watch them all pile into one shared queue. That's 'one instance, globally reachable' made visible.",
      },
      {
        title: "03 · Prove the shared state",
        body: "Still in the Singleton world, send a job from Desk A, then read the queue from Desk B. Desk B sees Desk A's job, because there is only one queue. Try the same in the WITHOUT world and each desk sees only its own printer's jobs. This shared-state behaviour is exactly why Singletons are powerful — and exactly why they can be dangerous if overused.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "printer.ts",
        code: `class Printer {
  private static instance: Printer;    // the one and only stored copy
  private queue: string[] = [];

  private constructor() {}             // 🔒 blocks 'new Printer()' outside

  static getInstance(): Printer {
    if (!Printer.instance) {           // first call builds it once...
      Printer.instance = new Printer();
    }
    return Printer.instance;           // ...every call returns the same one
  }

  print(job: string): void { this.queue.push(job); }
  jobs(): string[] { return this.queue; }
}

// Everyone asks the class — nobody uses 'new'.
const a = Printer.getInstance();
const b = Printer.getInstance();

a.print("report.pdf");
console.log(a === b);        // true  — same object
console.log(b.jobs());      // ["report.pdf"] — B sees A's job (one queue)`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Printer.java",
        code: `import java.util.*;

public class Printer {
    private static Printer instance;              // the one stored copy
    private final List<String> queue = new ArrayList<>();

    private Printer() {}                            // 🔒 no 'new' outside

    public static Printer getInstance() {
        if (instance == null) {                    // first call builds once
            instance = new Printer();
        }
        return instance;                           // every call → same object
    }

    public void print(String job) { queue.add(job); }
    public List<String> jobs() { return queue; }
}

// Printer a = Printer.getInstance();
// Printer b = Printer.getInstance();
// a.print("report.pdf");
// System.out.println(a == b);      // true — same object
// System.out.println(b.jobs());    // [report.pdf] — one shared queue

// ✅ The idiomatic thread-safe Java Singleton is a one-element enum:
// public enum Printer { INSTANCE; public void print(String j) { ... } }`,
      },
      {
        label: "Python",
        language: "python",
        filename: "printer.py",
        code: `class Printer:
    _instance = None                       # the one stored copy

    def __new__(cls):                      # runs before __init__
        if cls._instance is None:          # first call builds once
            cls._instance = super().__new__(cls)
            cls._instance._queue = []
        return cls._instance               # every call → same object

    def print(self, job: str) -> None:
        self._queue.append(job)

    def jobs(self) -> list[str]:
        return self._queue


a = Printer()
b = Printer()
a.print("report.pdf")
print(a is b)        # True  — same object
print(b.jobs())      # ['report.pdf'] — one shared queue

# ✅ Often simpler in Python: a module-level object. A module is imported
# once, so 'printer = Printer()' in printer.py is already a Singleton.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "printer.cpp",
        code: `#include <string>
#include <vector>

class Printer {
    std::vector<std::string> queue;
    Printer() {}                          // 🔒 private constructor

public:
    // Meyers' Singleton: the local static is created once, thread-safe (C++11+).
    static Printer& getInstance() {
        static Printer instance;          // built on first call, reused after
        return instance;                  // every call → the same object
    }

    // Delete copy/move so nobody can duplicate the instance.
    Printer(const Printer&) = delete;
    Printer& operator=(const Printer&) = delete;

    void print(const std::string& job) { queue.push_back(job); }
    const std::vector<std::string>& jobs() const { return queue; }
};

// Printer& a = Printer::getInstance();
// Printer& b = Printer::getInstance();
// a.print("report.pdf");
// (&a == &b)  ->  true   — same object, one shared queue`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Use a Singleton when the thing is truly one-of-a-kind" },
      {
        type: "p",
        text: "A Singleton fits a small set of cases where having *two* would be a bug, and where everyone genuinely needs to talk to the *same* one:",
      },
      {
        type: "ul",
        items: [
          "**A single shared resource** — one connection pool, one thread pool, one hardware device driver. Two of these fighting over the same resource causes real bugs.",
          "**One coordinating point** — a logger writing to one file, an in-memory cache, an event bus. You *want* every part of the app to reach the same one.",
          "**Read-mostly global config** — app settings loaded once at startup and read everywhere. (If it changes often, a Singleton's shared mutable state gets risky.)",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Prefer 'one instance' over 'Singleton pattern' when you can",
        text: "You almost always want *one instance* — you rarely need the *global access* that makes Singletons troublesome. The cleaner path in modern code: create one instance at startup (in `main`, a container, or a module) and **pass it** to whatever needs it. You still have exactly one, but it's visible in the code, easy to swap for a fake in tests, and doesn't secretly couple everything together. See [[dependency-injection-and-ioc]] and [[program-to-interfaces]].",
      },
    ],

    tradeoffs: {
      pros: [
        "Guarantees exactly one instance — impossible to accidentally create a second when duplication would be a bug (one queue, one config, one pool).",
        "One obvious access point — every part of the program reaches the same object without threading it through call after call.",
        "Lazy option saves work — the instance can be created only on first use, so you don't pay for it if it's never needed.",
        "Simple to state and recognise — it's the most widely known pattern, so `getInstance()` instantly signals intent to other developers.",
      ],
      cons: [
        "Hidden global state — any code can reach in and mutate the shared instance, coupling distant parts of the system in ways that are hard to trace.",
        "Hurts testability — tests share the one instance, so state leaks between them; you can't easily swap in a fake, and tests must reset it carefully.",
        "Thread-safety traps — lazy creation needs careful locking (double-checked locking / holder idiom) or two threads can each build an instance.",
        "Often overused — reached for as a convenient global rather than because the thing is truly one-of-a-kind; that's how it earned its bad name.",
      ],
    },

    furtherReading: [
      {
        label: "Singleton — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/singleton",
        note: "The clearest illustrated walkthrough: the problem, the private-constructor + getInstance structure, real-world analogy, and language examples. Best first read.",
        kind: "article",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Singleton and 22 other patterns. The primary source for the pattern's formal intent and structure.",
        kind: "book",
      },
      {
        label: "Why Singletons are controversial — Google 'Singletons are Pathological Liars'",
        href: "https://testing.googleblog.com/2008/08/where-have-all-singletons-gone.html",
        note: "Google's testing blog on how global Singletons hide dependencies and wreck testability, and why passing one instance in (dependency injection) is usually better.",
        kind: "article",
      },
      {
        label: "Java enum Singleton — Effective Java (Joshua Bloch), Item 3",
        href: "https://www.baeldung.com/java-singleton",
        note: "Why a single-element enum is the simplest thread-safe, serialization-safe Singleton in Java, with the classic getInstance variants compared.",
        kind: "article",
      },
      {
        label: "Singleton pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Singleton_pattern",
        note: "Concise reference covering lazy vs eager initialisation, thread-safety approaches across languages, and the common criticisms of the pattern.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "singleton-q1",
        question: "What does the Singleton pattern guarantee?",
        options: [
          { id: "a", label: "A class has exactly one instance, and there's one global point of access to it." },
          { id: "b", label: "Every call to a method returns a brand-new object." },
          { id: "c", label: "A class can be instantiated only inside a subclass." },
          { id: "d", label: "Objects are cloned instead of being built from scratch." },
        ],
        correctOptionId: "a",
        explanation:
          "Singleton's whole job is to ensure a class has one and only one instance, reachable through a single access point (typically a static getInstance()). Option (d) describes the Prototype pattern; the others distort the intent.",
      },
      {
        id: "singleton-q2",
        question: "Why does a Singleton make its constructor private?",
        options: [
          { id: "a", label: "So no outside code can use `new` to create a second instance — everyone must come through getInstance()." },
          { id: "b", label: "To make the class run faster at startup." },
          { id: "c", label: "Because private constructors are required for all classes." },
          { id: "d", label: "So the class can be extended by any subclass." },
        ],
        correctOptionId: "a",
        explanation:
          "A private constructor locks the door to `new` from outside. That forces all callers through the static getInstance() method, which is what guarantees only one instance is ever created.",
      },
      {
        id: "singleton-q3",
        question: "In a lazy Singleton, when is the single instance created?",
        options: [
          { id: "a", label: "On the first call to getInstance(); every later call returns that same stored instance." },
          { id: "b", label: "Every time getInstance() is called, a new one is made." },
          { id: "c", label: "When the program exits." },
          { id: "d", label: "Never — the instance is passed in from outside." },
        ],
        correctOptionId: "a",
        explanation:
          "Lazy initialisation builds the instance the first time it's actually needed (the first getInstance() call), then caches it. Subsequent calls skip creation and return the cached object. Eager initialisation instead builds it up front when the class loads.",
      },
      {
        id: "singleton-q4",
        question: "If Printer is a proper Singleton, what does `Printer.getInstance() === Printer.getInstance()` return?",
        options: [
          { id: "a", label: "true — both calls return the very same object in memory." },
          { id: "b", label: "false — each call builds a separate but equal object." },
          { id: "c", label: "It throws an error because getInstance can't be called twice." },
          { id: "d", label: "It depends on how many print jobs are queued." },
        ],
        correctOptionId: "a",
        explanation:
          "The point of a Singleton is object identity: both calls hand back the one stored instance, so they are the same object and the identity check is true. That's why state set through one reference is visible through the other.",
      },
      {
        id: "singleton-q5",
        question: "What is the most common, well-founded criticism of the Singleton pattern?",
        options: [
          { id: "a", label: "It introduces hidden global state that couples distant code and makes testing hard, so it's often better to create one instance and pass it in." },
          { id: "b", label: "It always creates too many objects and wastes memory." },
          { id: "c", label: "It can only be written in Java." },
          { id: "d", label: "It makes it impossible to ever have one instance of a class." },
        ],
        correctOptionId: "a",
        explanation:
          "Because a Singleton is globally reachable and usually holds mutable state, any code can depend on it invisibly, which couples the system and makes tests share state. The common remedy is dependency injection: create exactly one instance at startup and pass it where needed, keeping the 'one instance' benefit without the hidden global.",
      },
    ],
  },
};
