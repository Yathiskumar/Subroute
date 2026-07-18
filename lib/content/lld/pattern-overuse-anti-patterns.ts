import type { RoadmapLesson } from "@/lib/content/types";

export const patternOveruseAntiPatterns: RoadmapLesson = {
  title: "Pattern overuse & anti-patterns",
  oneLiner:
    "The last and wisest lesson of the whole patterns phase: a design pattern is a *tool*, not a *goal*. Applied to a problem you actually have, a pattern removes real pain. Applied to a problem you *might* have someday, the same pattern is just extra files, extra indirection, and extra confusion for zero benefit. \"When you have a hammer, everything looks like a nail\" — this lesson is about learning to put the hammer down.",
  difficulty: "intermediate",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/pattern-overuse-anti-patterns.html",
  content: {
    prototypeCaption:
      "A **decision bench** for one tiny requirement: *\"greet a user.\"* On the left, the 🧩 **over-engineered** build — a `GreeterFactory`, an `IGreeter` interface, a `GreetingStrategy`, five files. On the right, the ✅ **simple** build — one three-line function. A **complexity meter** shows the left side sky-high and the right side at 1. Below, flip the **\"New requirement?\"** chips. While no real varying force is on, the verdict reads ✅ *Keep it simple — YAGNI* and the whole left column is stamped **WASTE**. Flip on a genuine force — *\"greetings vary by language at runtime\"* — and the verdict flips to *Now a Strategy earns its keep* and the pattern turns green. Same pattern, waste or wisdom, decided entirely by whether a real force is present.",

    overview: [
      {
        type: "p",
        text: "You've now met a shelf full of design patterns. Here's the lesson that ties them together: **the goal was never to use patterns — the goal is simple code that solves the problem.** A pattern is a tool for removing a *specific, real* pain: a change that keeps rippling through your code, a piece you genuinely need to swap out, a class that's grown into a monster. When that pain is present, the right pattern is a relief. When it isn't, the same pattern is pure cost — more files, more indirection, more things a new reader has to hold in their head — for nothing in return.",
      },
      {
        type: "p",
        text: "Reaching for a pattern *before* the pain arrives has names: **over-engineering** and **speculative generality**. It's building for a future that may never come — a direct violation of YAGNI, *\"You Aren't Gonna Need It\"* ([[dry-kiss-yagni]]). The tell is a justification that starts with *\"what if one day we need to...\"*. Most of those days never come, and you pay the carrying cost of the abstraction every single day in between.",
      },
      {
        type: "p",
        text: "So flip the instinct. Reach for the **simplest thing that works** first. Write the plain function, the plain class, the direct call. Then let patterns **emerge**: when duplication shows up, when a change forces edits in five places, when a class is clearly doing three jobs — *that's* the signal. You refactor *to* the pattern to relieve pain you can point at. Patterns are a destination you arrive at, not a starting line you draw first.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Don't apply a pattern to a problem you don't have yet — reach for the simplest thing that works, and let the pattern *emerge* through refactoring the moment a real, present pain appears.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "A pattern for its own sake is a smell",
        text: "If you can't name the concrete pain a pattern removes *right now* — the exact change that keeps rippling, the swap you actually make — you're not designing, you're decorating. \"We used the Strategy pattern\" is not an achievement. \"This value now varies without touching the caller\" is.",
      },
    ],

    howItWorks: [
      { type: "h", text: "A gallery of anti-patterns" },
      {
        type: "p",
        text: "An *anti-pattern* is a solution that looks reasonable, gets used a lot, and reliably makes things worse. Most pattern misuse falls into a handful of recognizable shapes. Learn to spot these on sight — in your own diffs and in code review.",
      },
      { type: "h", text: "1 · Singleton abuse — a global variable in a tuxedo" },
      {
        type: "p",
        text: "The [[singleton]] gives you one instance with a global access point — and that global access is exactly the trap. Any code, anywhere, can call `Config.getInstance()`, so dependencies become *invisible*: a class secretly reaches out and grabs what it needs instead of being handed it. That makes it hard to test (you can't swap in a fake), hard to reason about (who touches this?), and quietly couples half your codebase to one object.",
      },
      {
        type: "code",
        language: "typescript",
        code: `// SMELL: hidden dependency, global reach-out, untestable
class OrderService {
  save(o: Order) {
    Database.getInstance().insert(o);  // where did this come from?!
  }
}

// FIX: inject it — the dependency is now visible and swappable
class OrderService {
  constructor(private db: Database) {}   // handed in, not grabbed
  save(o: Order) { this.db.insert(o); } // a fake DB slots in for tests
}`,
      },
      {
        type: "p",
        text: "The fix is almost always the same: **inject the dependency** instead of grabbing a global ([[dependency-injection-and-ioc]]). You keep \"one instance\" if you truly need it — you just pass it in rather than letting every class summon it from the ether.",
      },
      { type: "h", text: "2 · Speculative generality — abstraction nobody asked for" },
      {
        type: "p",
        text: "This is the purest form of pattern overuse: an interface with exactly **one** implementation, a Factory that only ever builds one type, a base class with a single subclass, \"configurable\" knobs no caller ever turns. It was all added *\"in case we need it later.\"* Every one of these is a layer of indirection you pay for now — more files to open, more hops to trace — buying flexibility you aren't using.",
      },
      {
        type: "ul",
        items: [
          "`interface IPriceCalculator` with one class `PriceCalculator` — the interface is dead weight until a *second* implementation exists.",
          "A `WidgetFactory.create()` that always returns `new StandardWidget()` — the factory adds a hop and decides nothing.",
          "A method that takes a `strategy` parameter that's always the same value at every call site.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The fix is a delete key",
        text: "Speculative generality is the one smell you fix by *removing* code. Collapse the one-impl interface into the concrete class, delete the factory and call `new Thing()`, drop the unused parameter. When the second case genuinely arrives, re-introducing the abstraction is a quick, well-informed refactor — and now you'll shape it to the two real cases instead of an imagined one.",
      },
      { type: "h", text: "3 · The God object — one class that does everything" },
      {
        type: "p",
        text: "A `Manager` or `Utils` or `Application` class that grows to 2,000 lines and touches everything: parsing, validation, database, formatting, networking. It violates the Single Responsibility Principle ([[single-responsibility]]) — it has a dozen reasons to change, so *every* change risks breaking something unrelated. Nobody can hold it in their head, and two people can't work near it without colliding. Fix: split it along its responsibilities into small classes that each do one thing.",
      },
      { type: "h", text: "4 · Poltergeist — the class that just forwards" },
      {
        type: "p",
        text: "A `Helper`, `Wrapper`, or `Manager` whose every method does nothing but call another object's method and return the result. It adds a name and a file but no behavior — a ghost in the call stack. You trace a call through three classes only to find the third one does the actual work. If a layer only forwards, delete it and call the real thing directly.",
      },
      { type: "h", text: "5 · Golden hammer / pattern-itis — forcing a favorite" },
      {
        type: "p",
        text: "You just learned Strategy, so now *everything* is a Strategy — even a tax rate that has been `0.2` since the company was founded. This is the \"when you have a hammer, everything's a nail\" trap: applying one beloved pattern everywhere regardless of fit. Its worst form is the *AbstractFactoryFactory* — patterns stacked on patterns until the ceremony dwarfs the work. A constant doesn't need a Strategy. A single object doesn't need a Factory. Match the tool to the force, not to your enthusiasm.",
      },
      { type: "h", text: "6 · Event soup — premature Observer / indirection overload" },
      {
        type: "p",
        text: "Everything fires events; everything listens; and now no one can answer *\"what happens when I click Save?\"* by reading the code — the flow scatters across a dozen handlers that trigger each other. [[observer]] and event buses are powerful, but heavy indirection has a cost: control flow becomes invisible. Use direct calls until decoupling buys you something real (a truly varying, runtime set of listeners). If a straight-line function would do, write the straight-line function.",
      },
      { type: "h", text: "How to apply patterns wisely" },
      {
        type: "ol",
        items: [
          "**Start simple.** Write the most direct code that solves *today's* problem — the plain function, the direct call, the concrete class. Ship it.",
          "**Wait for the pain.** Let duplication or a rippling change reveal itself. The *rule of three*: the first time, just write it; the second time, note the duplication; the *third* time, refactor.",
          "**Refactor TO the pattern.** When the pain is real and repeatable, introduce the pattern to relieve it — shaped by the actual cases you now have, not guesses.",
          "**Prefer the smallest pattern.** A function beats a Strategy class; a plain object beats a Factory. Choose the least machinery that removes the pain.",
          "**Delete abstractions that never earned a second implementation.** An interface, factory, or base class that's had one concrete use for a year isn't flexibility — it's cost. Collapse it.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `// OVER-ENGINEERED: a pattern for a value that never varies
interface IGreeter { greet(name: string): string; }
class EnglishGreeter implements IGreeter {
  greet(name: string) { return "Hi " + name; }
}
class GreeterFactory {
  static create(): IGreeter { return new EnglishGreeter(); } // only one!
}
const msg = GreeterFactory.create().greet("Ada");  // 3 files, 1 behavior

// HONEST: the whole job, no ceremony
function greet(name: string) { return "Hi " + name; }
const msg2 = greet("Ada");                           // 1 line, same result`,
      },
      {
        type: "callout",
        variant: "success",
        title: "The mature move is often not to add anything",
        text: "By the end of the patterns phase, the sign you've *learned* patterns isn't how many you can name — it's how confidently you can look at a clean three-line function and say \"this is done, it doesn't need a pattern.\" Knowing when *not* to reach for one is the whole skill.",
      },
    ],

    handsOn: [
      {
        title: "01 · See the same job built two ways",
        body: "Look at the bench with no requirement chips flipped. Left: the 🧩 over-engineered greeter — GreeterFactory → IGreeter → GreetingStrategy, five files, complexity meter pinned high. Right: the ✅ simple `greet(name)` function, complexity meter at 1. Read the verdict: ✅ 'Keep it simple — YAGNI', and the whole left column stamped WASTE. Same output, wildly different cost — because right now, nothing varies.",
      },
      {
        title: "02 · Add fake requirements — nothing changes",
        body: "Flip on the soft chips: '☐ Might need more languages someday' and '☐ Only ever one greeting'. Watch the verdict: it stays ✅ 'Keep it simple' and the left column stays WASTE. A 'what if someday' is not a present force — it's speculative generality. The pattern still earns nothing. This is YAGNI in action: a maybe-future doesn't justify indirection today.",
      },
      {
        title: "03 · Add a REAL force — the pattern earns its keep",
        body: "Flip on '☑ Greetings vary by language at runtime'. Now the verdict flips to 'Now a Strategy earns its keep', the left column turns green (JUSTIFIED, not WASTE), and the complexity is finally paying for something the problem actually demands. The pattern didn't change — the presence of a real, varying force did. Hit ↺ Reset and note how the same structure snaps back to WASTE the instant the real force is gone.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "greet.ts",
        code: `// ❌ OVER-ENGINEERED — a Factory + interface + Strategy for a value
//    that never varies. Five moving parts, one behavior.
interface IGreeter { greet(name: string): string; }
interface GreetingStrategy { format(name: string): string; }

class DefaultStrategy implements GreetingStrategy {
  format(name: string) { return "Hi " + name; }
}
class Greeter implements IGreeter {
  constructor(private strategy: GreetingStrategy) {}
  greet(name: string) { return this.strategy.format(name); }
}
class GreeterFactory {
  static create(): IGreeter { return new Greeter(new DefaultStrategy()); }
}
const message = GreeterFactory.create().greet("Ada");


// ✅ HONEST — the exact same result, no ceremony.
function greet(name: string) {
  return "Hi " + name;
}
const message2 = greet("Ada");`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Greet.java",
        code: `// ❌ OVER-ENGINEERED — Factory + interface + Strategy for a value
//    that never varies. Five moving parts, one behavior.
interface IGreeter { String greet(String name); }
interface GreetingStrategy { String format(String name); }

class DefaultStrategy implements GreetingStrategy {
    public String format(String name) { return "Hi " + name; }
}
class Greeter implements IGreeter {
    private final GreetingStrategy strategy;
    Greeter(GreetingStrategy s) { this.strategy = s; }
    public String greet(String name) { return strategy.format(name); }
}
class GreeterFactory {
    static IGreeter create() { return new Greeter(new DefaultStrategy()); }
}
// String message = GreeterFactory.create().greet("Ada");


// ✅ HONEST — the exact same result, no ceremony.
class Greet {
    static String greet(String name) { return "Hi " + name; }
    // String message = greet("Ada");
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "greet.py",
        code: `# ❌ OVER-ENGINEERED — a Factory + Protocol + Strategy for a value
#    that never varies. Five moving parts, one behavior.
from typing import Protocol


class GreetingStrategy(Protocol):
    def format(self, name: str) -> str: ...


class DefaultStrategy:
    def format(self, name: str) -> str:
        return "Hi " + name


class Greeter:
    def __init__(self, strategy: GreetingStrategy) -> None:
        self._strategy = strategy

    def greet(self, name: str) -> str:
        return self._strategy.format(name)


class GreeterFactory:
    @staticmethod
    def create() -> Greeter:
        return Greeter(DefaultStrategy())


message = GreeterFactory.create().greet("Ada")


# ✅ HONEST — the exact same result, no ceremony.
def greet(name: str) -> str:
    return "Hi " + name


message2 = greet("Ada")`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "greet.cpp",
        code: `#include <memory>
#include <string>

// ❌ OVER-ENGINEERED — Factory + interface + Strategy for a value
//    that never varies. Five moving parts, one behavior.
struct GreetingStrategy {
    virtual ~GreetingStrategy() = default;
    virtual std::string format(const std::string& name) = 0;
};
struct DefaultStrategy : GreetingStrategy {
    std::string format(const std::string& name) override { return "Hi " + name; }
};
struct IGreeter {
    virtual ~IGreeter() = default;
    virtual std::string greet(const std::string& name) = 0;
};
class Greeter : public IGreeter {
    std::unique_ptr<GreetingStrategy> strategy;
public:
    explicit Greeter(std::unique_ptr<GreetingStrategy> s) : strategy(std::move(s)) {}
    std::string greet(const std::string& name) override { return strategy->format(name); }
};
struct GreeterFactory {
    static std::unique_ptr<IGreeter> create() {
        return std::make_unique<Greeter>(std::make_unique<DefaultStrategy>());
    }
};
// auto message = GreeterFactory::create()->greet("Ada");


// ✅ HONEST — the exact same result, no ceremony.
std::string greet(const std::string& name) { return "Hi " + name; }
// auto message2 = greet("Ada");`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Signs you actually NEED a pattern..." },
      {
        type: "ul",
        items: [
          "**A change keeps rippling** — the same edit forces you to touch three, four, five places every time. That duplication of *change* is the clearest call for structure.",
          "**You genuinely swap implementations** — there are *already two or more* real variants (payment providers, export formats, storage backends), not one plus a hypothetical.",
          "**A class has grown many reasons to change** — it's clearly doing several jobs and every edit is scary. Splitting along responsibilities is overdue ([[single-responsibility]]).",
          "**You hit the pattern's exact problem** — you can name the force in one sentence: \"this must vary at runtime\" ([[strategy]]), \"one object changes and many must react\" ([[observer]]).",
        ],
      },
      { type: "h", text: "Signs you're over-engineering..." },
      {
        type: "ul",
        items: [
          "**Your reason starts with \"what if someday...\"** — you're building for an imagined future, not a present pain. That's speculative generality, a YAGNI violation.",
          "**An interface, factory, or base class has exactly one implementation** — and has for a while. It's indirection with no payoff; collapse it.",
          "**You're reaching for a pattern because you just learned it** — the golden-hammer reflex. Fit the tool to the force, not to your excitement.",
          "**A reader can't trace the flow** — Managers forward to Helpers that fire events into a bus. If the indirection buys nothing, the straight-line version is better code.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Right pain, right tool — a pattern used to relieve a real, present force removes duplication and makes the next change local and safe.",
        "Shared vocabulary — 'this is a Strategy' tells a teammate the shape of the code in three words, *when* the shape is actually there.",
        "Emergent, well-shaped design — patterns arrived at through refactoring fit the real cases you have, not the guesses you started with.",
        "Confident restraint — the discipline to write a clean three-line function and leave it alone is itself a mark of design maturity.",
      ],
      cons: [
        "Dead-weight indirection — a one-implementation interface or forwarding wrapper adds files and hops that buy nothing and slow every reader.",
        "Higher cognitive load — speculative abstractions make people trace calls through layers to find where the actual work happens.",
        "Harder change, not easier — the wrong or premature abstraction has to be unwound before you can make the change it didn't anticipate.",
        "Hidden coupling and lost flow — Singleton globals and premature event soup make dependencies invisible and control flow untraceable.",
      ],
    },

    furtherReading: [
      {
        label: "Anti-pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Anti-pattern",
        note: "The concept itself: what makes a common 'solution' reliably counterproductive, with a catalogue spanning software, organizations, and methodology. Good orientation.",
        kind: "docs",
      },
      {
        label: "Yagni — Martin Fowler",
        href: "https://martinfowler.com/bliki/Yagni.html",
        note: "The definitive short essay on 'You Aren't Gonna Need It' — why building for imagined futures (speculative generality) carries real cost you pay every day. The heart of this lesson.",
        kind: "article",
      },
      {
        label: "Is Design Dead? — Martin Fowler",
        href: "https://martinfowler.com/articles/designDead.html",
        note: "On evolutionary design: let structure emerge through refactoring rather than front-loading patterns. Argues directly for arriving at patterns instead of starting with them.",
        kind: "article",
      },
      {
        label: "AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis — Brown, Malveau, McCormick, Mowbray",
        href: "https://en.wikipedia.org/wiki/AntiPatterns",
        note: "The 1998 book that popularized the term — origin of the Golden Hammer, Poltergeist, God object (Blob), and Spaghetti Code, each with a refactored fix.",
        kind: "book",
      },
      {
        label: "Singleton — SourceMaking (and its criticism)",
        href: "https://sourcemaking.com/design_patterns/singleton",
        note: "A clear walkthrough of Singleton that also lays out why it's so often an anti-pattern: global state, hidden dependencies, and the testing pain that follows.",
        kind: "article",
      },
      {
        label: "AntiPatterns catalogue — SourceMaking",
        href: "https://sourcemaking.com/antipatterns",
        note: "A browsable gallery of software-development, architecture, and project-management anti-patterns — handy for putting a name to a smell you keep seeing.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "antipatterns-q1",
        question: "When is the right time to introduce a design pattern?",
        options: [
          { id: "a", label: "When a real, present pain appears — duplication, a rippling change, a class doing too much — and the pattern relieves it." },
          { id: "b", label: "At the start of a project, before writing any code, so the architecture is future-proof." },
          { id: "c", label: "Whenever you've just learned a new pattern and want to practice it." },
          { id: "d", label: "For every class, so the codebase looks consistent and professional." },
        ],
        correctOptionId: "a",
        explanation:
          "Patterns earn their keep by removing a specific pain you can point at *now*. You start with the simplest thing that works and refactor *to* the pattern when the pain is real. (b) is speculative generality / a YAGNI violation, (c) is the golden-hammer reflex, and (d) is pattern-itis — all forms of overuse.",
      },
      {
        id: "antipatterns-q2",
        question: "What is 'speculative generality'?",
        options: [
          { id: "a", label: "Adding abstraction — an interface, a factory, a config knob — for a flexibility you don't need yet, 'in case we need it later'." },
          { id: "b", label: "Writing code that is intentionally hard to read so competitors can't copy it." },
          { id: "c", label: "Generating documentation automatically from source comments." },
          { id: "d", label: "Choosing generic type parameters instead of concrete types for performance." },
        ],
        correctOptionId: "a",
        explanation:
          "Speculative generality is building for an imagined future — the interface with one implementation, the factory that makes one thing, the unused parameter. It violates YAGNI: you pay the carrying cost of the abstraction every day for flexibility you may never use. The fix is usually to delete it until a second real case appears.",
      },
      {
        id: "antipatterns-q3",
        question: "Why is Singleton so often called an anti-pattern?",
        options: [
          { id: "a", label: "Its global access point hides dependencies, couples code to one object, and makes classes hard to test — a global variable in disguise." },
          { id: "b", label: "It's impossible to implement correctly in any language." },
          { id: "c", label: "It always uses more memory than creating many instances." },
          { id: "d", label: "It can only be used once per program and then must be deleted." },
        ],
        correctOptionId: "a",
        explanation:
          "The problem isn't 'one instance' — it's the *global reach-out*. When any class can call getInstance(), dependencies become invisible, coupling spreads silently, and you can't swap in a fake for tests. The usual fix is dependency injection: keep one instance if you must, but *pass it in* instead of letting everyone grab it.",
      },
      {
        id: "antipatterns-q4",
        question: "What does the 'rule of three' advise about duplication and abstraction?",
        options: [
          { id: "a", label: "Write it the first time, notice the duplication the second time, and refactor to a shared abstraction on the third." },
          { id: "b", label: "Every method should be at most three lines long." },
          { id: "c", label: "A class may have no more than three responsibilities." },
          { id: "d", label: "Always create three implementations of an interface before shipping." },
        ],
        correctOptionId: "a",
        explanation:
          "The rule of three is a guard against premature abstraction: two occurrences might be coincidence, but the third confirms a real, repeating pattern worth extracting. Abstracting on the first sighting risks shaping the abstraction around a guess — exactly the speculative-generality trap.",
      },
      {
        id: "antipatterns-q5",
        question: "What's the cost of an interface (or factory) that has exactly one implementation?",
        options: [
          { id: "a", label: "Indirection with no payoff — extra files and call hops that every reader must trace, buying flexibility nobody is using." },
          { id: "b", label: "Nothing — extra interfaces are always good because they improve decoupling." },
          { id: "c", label: "It makes the program run measurably slower at scale." },
          { id: "d", label: "It prevents the concrete class from ever being tested." },
        ],
        correctOptionId: "a",
        explanation:
          "An interface earns its keep when a second implementation exists (or clearly, imminently will). With just one, it's dead weight: more files to open, an extra hop to follow, and the illusion of flexibility that isn't exercised. Collapse it into the concrete class; re-introduce it as a quick refactor when a real second case shows up.",
      },
      {
        id: "antipatterns-q6",
        question: "A teammate wraps a constant tax rate (0.2, unchanged for years) in a full Strategy pattern 'for flexibility.' Which anti-pattern is this?",
        options: [
          { id: "a", label: "Golden hammer / pattern-itis — forcing a favorite pattern onto a value that doesn't vary and has no present force calling for it." },
          { id: "b", label: "The lapsed-listener leak from the Observer pattern." },
          { id: "c", label: "A God object, because the Strategy class does too many things." },
          { id: "d", label: "Correct design — every value should be behind a Strategy in case it changes." },
        ],
        correctOptionId: "a",
        explanation:
          "A value that never varies has no runtime-variation force, so Strategy adds a class, an interface, and indirection for zero benefit — the golden-hammer reflex of applying a beloved pattern everywhere. A plain constant is the honest answer; introduce Strategy only when the value genuinely needs to vary.",
      },
    ],
  },
};
