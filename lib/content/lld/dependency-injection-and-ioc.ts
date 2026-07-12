import type { RoadmapLesson } from "@/lib/content/types";

export const dependencyInjectionAndIoc: RoadmapLesson = {
  title: "Dependency Injection & Inversion of Control",
  oneLiner:
    "A dependency is just another object your object needs to do its job. Instead of letting an object build its own dependencies with new, you hand them in from outside — usually through the constructor. That's Dependency Injection, and it's the most common way to achieve Inversion of Control: an outside assembler, not your object, decides what gets wired together.",
  difficulty: "intermediate",
  estimatedTime: "16 min",
  prototypePath: "/prototypes/lld/dependency-injection-and-ioc.html",
  content: {
    prototypeCaption:
      "Two modes of the same `Car`, which needs an `Engine` and `Wheels`. In **Self-service**, the `Car` box literally contains `new Engine()` and `new Wheels()` — arrows point *down* as the car reaches in and builds its own parts, and the side panel shows *swap a part? ✗* and *test with a fake? ✗*. Flip to **Injected** and an *Assembler / main()* box appears above the car; it builds the parts and passes them *into* the constructor, so the arrows now point *up into* the `Car`. A tray lets you hand in `PetrolEngine`, `ElectricEngine`, or `FakeEngine (test)` — each pick updates the car without changing the `Car` class, flips both indicators to green ✓, and the fixed panel narrates how construction control moved *out of* the car. One panel, replaced each click; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "A **dependency** is just another object your object needs to do its job. A `Car` needs an `Engine`. An `OrderService` needs a `Database`. The question this lesson answers is small but it changes everything: *who builds that dependency?* If the object builds its own — `new Engine()` inside the `Car` — it is in control. If something *outside* builds it and hands it in, control has moved out. That second arrangement is what **Dependency Injection** and **Inversion of Control** are about.",
      },
      {
        type: "p",
        text: "**Dependency Injection (DI)** is the technique: instead of an object creating its own dependencies, you *inject* them from outside — almost always through the **constructor**. **Inversion of Control (IoC)** is the bigger idea behind it: your code stops being the thing that constructs and calls everything top-down. An outer *assembler* or *framework* now creates the pieces and wires them together. DI is simply the most common way to invert control over **construction**.",
      },
      {
        type: "p",
        text: "Picture a **coffee machine**. The cheap kind has a sealed-in water tank — to change the water you'd have to crack the machine open. The good kind has an *opening on top* that you **pour water into**. Same machine, but now *you* decide what goes in: filtered, sparkling, decaf. You change the input without rebuilding the machine. DI is that opening on top. The machine no longer fetches its own water; it accepts whatever you pour in.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Don't let an object build its own dependencies — **hand them in from outside**. The object's job is to *use* its tools, not to *make* them.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The Hollywood Principle",
        text: "IoC is often summed up as the *Hollywood Principle*: **“Don't call us, we'll call you.”** In ordinary code, *your* code is in charge — it creates objects and calls into libraries. Under IoC, you register your pieces and an outer assembler or framework calls *them* at the right time, with the right collaborators already plugged in. Control flips from your code to the framework.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The smell: a class that `new`s its own dependency" },
      {
        type: "p",
        text: "Here is the trap, and almost everyone writes it first. A class builds the concrete thing it needs *inside itself*:",
      },
      {
        type: "code",
        language: "typescript",
        code: `class Car {
  private engine = new PetrolEngine();   // ⚠️ car builds its own engine
  private wheels = new Wheels();          // ⚠️ ...and its own wheels

  drive() {
    this.engine.start();
  }
}`,
      },
      {
        type: "p",
        text: "Those `new` lines look harmless, but the `Car` has just taken on a second job it never wanted: *manufacturing its own parts*. That quietly causes two real problems. **You can't swap a part** — the day you want an `ElectricEngine`, you have to open `Car` and edit it, because the petrol engine is hard-wired inside. And **you can't test it in isolation** — every test of `Car` now spins up a *real* engine, because the car insists on building the real one. The car is welded to specific parts it should never have cared about.",
      },
      { type: "h", text: "The fix: inject the dependency through the constructor" },
      {
        type: "p",
        text: "Stop building parts inside the car. Declare *what the car needs* as parameters and let them be passed in. This is **constructor injection** — the most common, most honest form of DI:",
      },
      {
        type: "code",
        language: "typescript",
        code: `class Car {
  constructor(private engine: Engine, private wheels: Wheels) {}  // handed in

  drive() {
    this.engine.start();
  }
}

// somewhere at the edge of the app, the assembler builds and wires:
const car = new Car(new ElectricEngine(), new Wheels());`,
      },
      {
        type: "p",
        text: "Notice what just happened. The `Car` no longer says `new` anywhere. It *receives* an `Engine` and *uses* it. Whoever creates the car decides which engine goes in. Want electric? Pass an `ElectricEngine`. Want a fake for a test? Pass a `FakeEngine`. The `Car` class is never reopened. As a bonus, the constructor now lists **every dependency up front** — you can see exactly what a `Car` needs just by reading its signature.",
      },
      { type: "h", text: "The inversion: who is in control of building the parts?" },
      {
        type: "p",
        text: "Look at the *direction of control*. **Before**, the `Car` reached *down* and built its parts — control lived *inside* the car, and the build arrows pointed down and outward from it. **After**, an external **assembler** (often just your `main()`) builds the parts and passes them *up into* the car's constructor. Construction control moved from the object to the outside. That reversal — *the object no longer controls how it is assembled* — is the **Inversion of Control**. DI is the mechanism that carries it out.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 640 340" width="100%" style="max-width:640px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two diagrams of who controls construction. Self-service: the Car box builds its own Engine and Wheels, with arrows pointing down from Car to the parts it news inside itself. Injected: an external Assembler slash main box builds Engine and Wheels and passes them up into the Car constructor, so the arrows point up into the Car and control is inverted.">
  <defs>
    <marker id="di-down" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L11,4 L1,8 z" fill="#9099a8"/></marker>
    <marker id="di-up" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L11,4 L1,8 z" fill="#fb863a"/></marker>
  </defs>

  <!-- column labels -->
  <text x="160" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#9099a8">SELF-SERVICE — car builds its parts</text>
  <text x="480" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#fb863a">INJECTED — control inverted</text>
  <line x1="320" y1="36" x2="320" y2="320" stroke="#2d333d" stroke-width="1" stroke-dasharray="4 5"/>

  <!-- ===== SELF-SERVICE ===== -->
  <rect x="70" y="46" width="180" height="50" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="160" y="68" text-anchor="middle" font-size="13" font-weight="600" fill="#e8e4dc">Car</text>
  <text x="160" y="85" text-anchor="middle" font-size="9.5" fill="#6b7280">new Engine(); new Wheels();</text>

  <!-- car reaches DOWN to build its own parts -->
  <line x1="120" y1="98" x2="120" y2="232" stroke="#9099a8" stroke-width="1.6" marker-end="url(#di-down)"/>
  <line x1="200" y1="98" x2="200" y2="232" stroke="#9099a8" stroke-width="1.6" marker-end="url(#di-down)"/>
  <text x="160" y="168" text-anchor="middle" font-size="9.5" fill="#6b7280">builds ↓</text>

  <rect x="62" y="244" width="100" height="40" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="112" y="269" text-anchor="middle" font-size="11.5" font-weight="600" fill="#e8e4dc">Engine</text>
  <rect x="172" y="244" width="80" height="40" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="212" y="269" text-anchor="middle" font-size="11.5" font-weight="600" fill="#e8e4dc">Wheels</text>

  <!-- ===== INJECTED ===== -->
  <rect x="384" y="46" width="192" height="48" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)" stroke-width="1.5"/>
  <rect x="384" y="46" width="192" height="48" rx="6" fill="rgba(251,134,58,0.16)"/>
  <text x="480" y="67" text-anchor="middle" font-size="12.5" font-weight="600" fill="#e8e4dc">Assembler / main()</text>
  <text x="480" y="83" text-anchor="middle" font-size="9.5" fill="#fb863a">builds the parts, wires them in</text>

  <!-- assembler builds the two parts (down) -->
  <line x1="430" y1="96" x2="430" y2="160" stroke="#3a414c" stroke-width="1.3"/>
  <line x1="530" y1="96" x2="530" y2="160" stroke="#3a414c" stroke-width="1.3"/>
  <rect x="386" y="162" width="92" height="38" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="432" y="186" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">Engine</text>
  <rect x="488" y="162" width="84" height="38" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="530" y="186" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">Wheels</text>

  <!-- parts passed UP INTO the car constructor (inverted!) -->
  <line x1="432" y1="200" x2="455" y2="262" stroke="#fb863a" stroke-width="1.6" marker-end="url(#di-up)"/>
  <line x1="530" y1="200" x2="505" y2="262" stroke="#fb863a" stroke-width="1.6" marker-end="url(#di-up)"/>
  <text x="480" y="228" text-anchor="middle" font-size="9.5" fill="#fb863a">injected → into ctor</text>

  <rect x="390" y="272" width="180" height="48" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)" stroke-width="1.5"/>
  <text x="480" y="293" text-anchor="middle" font-size="13" font-weight="600" fill="#e8e4dc">Car</text>
  <text x="480" y="310" text-anchor="middle" font-size="9.5" fill="#6b7280">constructor(engine, wheels)</text>
</svg>`,
        caption:
          "**Self-service** (left): the `Car` reaches *down* and `new`s its own `Engine` and `Wheels` — control over construction lives inside the car. **Injected** (right): an external `Assembler / main()` builds the parts and passes them *up into* the car's constructor — the arrows point *into* the `Car`, and control over construction has been **inverted** out of the object. Same parts get built; *who builds them* flipped.",
      },
      { type: "h", text: "The composition root: where the wiring lives" },
      {
        type: "p",
        text: "If objects no longer build their own dependencies, *something* must. That place is the **composition root** — a single spot near the entry point of your app (`main()`, a startup file) where you construct the concrete pieces and wire the whole object graph together. Keeping the wiring in one place at the *edge* means the rest of your code stays free of `new` and free of construction concerns.",
      },
      {
        type: "callout",
        variant: "info",
        title: "A DI container is optional",
        text: "You do *not* need a framework to do DI. The simplest form is sometimes called **“poor man's DI”**: you just write the `new`s by hand in `main()`. A **DI container** (Spring, Guice, .NET's built-in container) automates this for large graphs — you declare what implements what, and the container constructs and injects everything for you. That automated wiring *is* a form of IoC. But for a small app, hand-wiring at `main()` is perfectly good DI, and easier to follow.",
      },
      { type: "h", text: "How DI, IoC, and DIP relate" },
      {
        type: "ul",
        items: [
          "**IoC (Inversion of Control)** is the broad principle: an outer assembler or framework controls construction and flow, not your object. *“Don't call us, we'll call you.”* DI is one *kind* of IoC (the kind about construction).",
          "**DI (Dependency Injection)** is the *technique*: pass dependencies in from outside instead of building them with `new`. It's the most common way to achieve IoC over object construction.",
          "**DIP (Dependency Inversion Principle)** is a separate, related idea — the *D* in SOLID — about which *direction* dependencies should point: toward *abstractions* (interfaces), not concrete classes. DI is how you usually *deliver* a DIP-friendly design: you inject an *interface*, and the assembler chooses the concrete implementation. You can do DI without DIP (inject a concrete type) and aim at DIP without a container — but in practice they travel together.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Feel the self-service car",
        body: "Open the prototype in **Self-service** mode. The `Car` box literally contains `new Engine()` and `new Wheels()`, and the build arrows point *down* as the car reaches in and constructs its own parts. Read the side panel: *swap a part? ✗*, *test with a fake? ✗*. The tray of other engines is disabled — there's no opening to hand anything in, because the car builds its own. This is the smell DI fixes.",
      },
      {
        title: "02 · Invert who builds the parts",
        body: "Flip to **Injected** mode. Watch an *Assembler / main()* box appear above the car. It builds the `Engine` and `Wheels` and passes them *up into* the car's constructor — the arrows now point *into* the `Car`. Both indicators flip to green: *swap? ✓*, *test? ✓*. Nothing inside `Car` changed; construction control just moved *out* of it and onto the assembler. Read the line about the Hollywood Principle.",
      },
      {
        title: "03 · Hand in different parts without touching the Car",
        body: "In Injected mode, use the tray to hand in an `ElectricEngine` — the explain panel confirms *the Car class never changed*. Now hand in a `FakeEngine (test)` and read why that makes the car testable: the fake just records that `start()` was called, so a unit test runs with no real engine. Click between the three engines and confirm the `Car` box stays identical every time — that is the payoff of injecting instead of building.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "car.ts",
        code: `// BEFORE — Car builds (new's) its own engine. It's in control.
class CarV0 {
  private engine = new PetrolEngine();   // ⚠️ can't swap, can't test
  drive() { this.engine.start(); }
}

// AFTER — the engine is INJECTED through the constructor.
interface Engine { start(): void; }

class Car {
  constructor(private engine: Engine) {}   // handed in from outside
  drive() { this.engine.start(); }
}

class PetrolEngine implements Engine {
  start() { /* ...real petrol engine... */ }
}
class ElectricEngine implements Engine {
  start() { /* ...real electric engine... */ }
}

// COMPOSITION ROOT — the assembler (main) builds & wires at the app edge.
// "Poor man's DI": just new things up by hand. No container needed.
function main() {
  const car = new Car(new ElectricEngine());   // swap engine in ONE line
  car.drive();
}

// Inject a FAKE in a test — fast, offline, asserts on a recording.
class FakeEngine implements Engine {
  started = false;
  start() { this.started = true; }
}
const fake = new FakeEngine();
new Car(fake).drive();
// expect(fake.started).toBe(true);   // no real engine spun up`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Car.java",
        code: `// BEFORE — Car builds (new's) its own engine. It's in control.
class CarV0 {
    private final PetrolEngine engine = new PetrolEngine();  // ⚠️ can't swap/test
    void drive() { engine.start(); }
}

// AFTER — the engine is INJECTED through the constructor.
interface Engine { void start(); }

class Car {
    private final Engine engine;
    Car(Engine engine) { this.engine = engine; }   // handed in from outside
    void drive() { engine.start(); }
}

class PetrolEngine implements Engine {
    public void start() { /* ...real petrol engine... */ }
}
class ElectricEngine implements Engine {
    public void start() { /* ...real electric engine... */ }
}

// COMPOSITION ROOT — the assembler (main) builds & wires at the app edge.
// "Poor man's DI": just new things up by hand. A container (Spring/Guice)
// would do this wiring for you, which is itself a form of IoC.
class App {
    public static void main(String[] args) {
        Car car = new Car(new ElectricEngine());   // swap engine in ONE line
        car.drive();
    }
}

// Inject a FAKE in a test — fast, offline, asserts on a recording.
class FakeEngine implements Engine {
    boolean started = false;
    public void start() { started = true; }
}
// var fake = new FakeEngine();
// new Car(fake).drive();
// assertTrue(fake.started);   // no real engine spun up`,
      },
      {
        label: "Python",
        language: "python",
        filename: "car.py",
        code: `from abc import ABC, abstractmethod

# BEFORE — Car builds (creates) its own engine. It's in control.
class CarV0:
    def __init__(self) -> None:
        self._engine = PetrolEngine()        # ⚠️ can't swap, can't test
    def drive(self) -> None:
        self._engine.start()

# AFTER — the engine is INJECTED through the constructor.
class Engine(ABC):
    @abstractmethod
    def start(self) -> None: ...

class Car:
    def __init__(self, engine: Engine) -> None:   # handed in from outside
        self._engine = engine
    def drive(self) -> None:
        self._engine.start()

class PetrolEngine(Engine):
    def start(self) -> None: ...    # real petrol engine
class ElectricEngine(Engine):
    def start(self) -> None: ...    # real electric engine

# COMPOSITION ROOT — the assembler (main) builds & wires at the app edge.
# "Poor man's DI": just construct by hand. No container needed.
def main() -> None:
    car = Car(ElectricEngine())          # swap engine in ONE line
    car.drive()

# Inject a FAKE in a test — fast, offline, asserts on a recording.
class FakeEngine(Engine):
    def __init__(self) -> None:
        self.started = False
    def start(self) -> None:
        self.started = True

fake = FakeEngine()
Car(fake).drive()
assert fake.started is True          # no real engine spun up`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "car.cpp",
        code: `#include <cassert>

// BEFORE — Car builds its own engine. It's in control.
struct PetrolEngineV0 { void start() {} };
class CarV0 {
    PetrolEngineV0 engine;                     // ⚠️ can't swap, can't test
public:
    void drive() { engine.start(); }
};

// AFTER — the engine is INJECTED through the constructor (by reference).
struct Engine {
    virtual void start() = 0;
    virtual ~Engine() = default;
};
class Car {
    Engine& engine;                            // handed in from outside
public:
    explicit Car(Engine& e) : engine(e) {}
    void drive() { engine.start(); }
};

struct PetrolEngine : Engine {
    void start() override {}    // real petrol engine
};
struct ElectricEngine : Engine {
    void start() override {}    // real electric engine
};

// Inject a FAKE in a test — fast, offline, asserts on a recording.
struct FakeEngine : Engine {
    bool started = false;
    void start() override { started = true; }
};

// COMPOSITION ROOT — the assembler (main) builds & wires at the app edge.
// "Poor man's DI": just construct by hand. No container needed.
int main() {
    ElectricEngine electric;
    Car car{electric};          // swap engine in ONE line
    car.drive();

    FakeEngine fake;
    Car{fake}.drive();
    assert(fake.started);       // no real engine spun up
    return 0;
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Inject the dependencies that vary or talk to the outside world" },
      {
        type: "p",
        text: "DI earns its keep around **volatile or external** dependencies — anything that touches the outside world, or anything you might reasonably want to replace, fake, or reconfigure. These are exactly the things that make code rigid and hard to test when you `new` them inline.",
      },
      {
        type: "ul",
        items: [
          "**External services** — databases, payment gateways, email/SMS providers, an HTTP client to another team's API. Inject them so you can stub them in tests and swap providers in production.",
          "**The clock and randomness** — inject a `Clock` and a `RandomSource` so tests can pin time and seeds instead of being flaky.",
          "**Things you want to fake in a unit test** — if you can't test a class without standing up real infrastructure, that dependency wants injecting.",
          "**Configuration & policy choices** — inject the strategy (which algorithm, which storage backend) so the choice is made once, at the composition root, not scattered through the code.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't inject everything",
        text: "DI is a tool, not a tax on every line. Simple value objects (a `Money`, a `Point`), pure helpers, and standard-library types don't need injecting — they never vary and you'll never fake them. Forcing `new`-free purity on *everything* turns a tiny app into a maze of constructors and wiring with no payoff. Inject what is *volatile* or *external*; just `new` what is *stable* and *trivial*.",
      },
    ],

    tradeoffs: {
      pros: [
        "Swappability — hand in a different implementation (petrol→electric, MySQL→Postgres) by changing one line at the composition root; the consuming class is never reopened.",
        "Testability — inject a fake or mock and unit-test the class with no database, network, or real engine in sight.",
        "Honesty — the constructor lists every dependency up front, so you can see exactly what a class needs just by reading its signature.",
        "Decoupling & boundaries — the object stops knowing how to build its collaborators, so each piece can change independently and teams can build them in parallel.",
      ],
      cons: [
        "More wiring — something must construct and connect the graph at the app's edge; in a large app that composition root can sprawl.",
        "Indirection — to find what actually runs you may have to trace from the consumer back to the composition root, instead of reading it inline.",
        "Container complexity — a DI framework adds its own concepts (scopes, lifecycles, magic auto-wiring) and failures that surface at startup rather than at compile time.",
        "Over-application — injecting stable, trivial dependencies adds ceremony with no benefit and buries simple code under constructors.",
      ],
    },

    furtherReading: [
      {
        label: "Inversion of Control Containers and the Dependency Injection pattern — Martin Fowler",
        href: "https://martinfowler.com/articles/injection.html",
        note: "The definitive essay. Fowler untangles Inversion of Control from Dependency Injection, names the three injection styles (constructor, setter, interface), and explains what a DI container actually does for you.",
        kind: "article",
      },
      {
        label: "Inversion of Control — Martin Fowler (bliki)",
        href: "https://martinfowler.com/bliki/InversionOfControl.html",
        note: "A short, sharp note on what IoC really means and why the term is broader than DI. This is where the “don't call us, we'll call you” framing is made precise.",
        kind: "article",
      },
      {
        label: "Dependency injection — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Dependency_injection",
        note: "A clear, language-agnostic overview: the four roles (service, client, interface, injector), constructor vs setter vs method injection, and how DI relates to IoC and the composition root.",
        kind: "docs",
      },
      {
        label: "Spring Framework — The IoC Container (Core docs)",
        href: "https://docs.spring.io/spring-framework/reference/core/beans.html",
        note: "How a real-world DI container works: Spring constructs your beans and injects their collaborators for you. Good for seeing automated IoC at production scale.",
        kind: "docs",
      },
      {
        label: "Guice — Motivation & Getting Started",
        href: "https://github.com/google/guice/wiki/Motivation",
        note: "Google's lightweight DI container, opening with a before/after of hand-wiring vs injected code. A focused read on why a container helps once the object graph grows.",
        kind: "docs",
      },
      {
        label: "Dependency Injection Principles, Practices, and Patterns — Seemann & van Deursen",
        href: "https://www.manning.com/books/dependency-injection-principles-practices-patterns",
        note: "The canonical book on DI done right: the composition root, constructor injection as the default, anti-patterns to avoid, and when a container helps versus hurts. The deepest treatment if you want to go beyond the basics.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "dependency-injection-and-ioc-q1",
        question: "What is Dependency Injection, in one sentence?",
        options: [
          { id: "a", label: "Passing an object its dependencies from outside (usually via the constructor) instead of having it build them with `new`." },
          { id: "b", label: "A rule that every class must be created by a framework like Spring or Guice." },
          { id: "c", label: "Replacing all interfaces in a codebase with concrete classes." },
          { id: "d", label: "Making each class build its own dependencies so nothing leaks in from outside." },
        ],
        correctOptionId: "a",
        explanation:
          "DI is the technique of handing an object its dependencies from the outside rather than letting it construct them internally. A framework (b) can automate this but isn't required — hand-wiring in main() is still DI. (d) describes the exact smell DI removes.",
      },
      {
        id: "dependency-injection-and-ioc-q2",
        question: "A `Car` contains `private engine = new PetrolEngine()`. Which two problems does this directly cause?",
        options: [
          { id: "a", label: "You can't swap the engine without editing Car, and you can't test Car without spinning up a real engine." },
          { id: "b", label: "The code won't compile, and PetrolEngine will leak memory." },
          { id: "c", label: "Car automatically becomes abstract, and PetrolEngine becomes public." },
          { id: "d", label: "Nothing — building dependencies inline is the recommended approach." },
        ],
        correctOptionId: "a",
        explanation:
          "By `new`-ing the concrete engine inside itself, the car is welded to that part: changing to electric means editing Car, and every test must build a real engine. Those two pains — no swapping, no isolated testing — are exactly what injecting the engine removes.",
      },
      {
        id: "dependency-injection-and-ioc-q3",
        question: "How do Inversion of Control (IoC), Dependency Injection (DI), and the Dependency Inversion Principle (DIP) relate?",
        options: [
          { id: "a", label: "IoC is the broad principle (an outer assembler/framework controls construction & flow); DI is the most common technique for inverting construction; DIP is a separate SOLID rule about pointing dependencies at abstractions." },
          { id: "b", label: "They are three names for exactly the same thing." },
          { id: "c", label: "DIP is the technique, DI is the principle, and IoC is a Java framework." },
          { id: "d", label: "IoC and DI are about databases; DIP is about user interfaces." },
        ],
        correctOptionId: "a",
        explanation:
          "IoC is the umbrella idea — control flips from your code to an outer assembler or framework (“don't call us, we'll call you”). DI is one kind of IoC: the technique of injecting dependencies to invert *construction*. DIP is a distinct SOLID principle about *direction* — depend on abstractions, not concretes. They travel together but are not the same thing.",
      },
      {
        id: "dependency-injection-and-ioc-q4",
        question: "Where does the wiring live in a DI-based app, and do you need a container?",
        options: [
          { id: "a", label: "In a composition root near main(); a container is optional — hand-wiring with `new` (“poor man's DI”) is still valid DI." },
          { id: "b", label: "Inside each class's constructor, and a container is always mandatory." },
          { id: "c", label: "Spread across every file, and only a container can do DI at all." },
          { id: "d", label: "Nowhere — DI removes the need to ever construct objects." },
        ],
        correctOptionId: "a",
        explanation:
          "The construction and wiring belong in a single composition root at the edge of the app (often main()). A DI container automates this for large object graphs, but it is optional: writing the `new`s by hand — “poor man's DI” — is perfectly good DI and easier to follow in a small app.",
      },
      {
        id: "dependency-injection-and-ioc-q5",
        question: "Which dependency is the BEST candidate to just `new` inline rather than inject?",
        options: [
          { id: "a", label: "A simple immutable value type like Money or Point from your own code." },
          { id: "b", label: "A payment gateway you call over the network." },
          { id: "c", label: "The database your repository talks to." },
          { id: "d", label: "An email provider you may want to fake in tests." },
        ],
        correctOptionId: "a",
        explanation:
          "DI pays off for volatile, external dependencies — networks, databases, payment gateways, email — which you may swap or need to fake. A stable, trivial value type like Money never varies and won't be faked, so injecting it just adds ceremony. Inject what changes; `new` what's stable and simple.",
      },
    ],
  },
};
