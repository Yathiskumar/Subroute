import type { RoadmapLesson } from "@/lib/content/types";

export const strategy: RoadmapLesson = {
  title: "Strategy",
  oneLiner:
    "Define a family of interchangeable algorithms behind one interface, so the client can pick and swap them at runtime. A maps app computes 🚗 drive, 🚴 bike and 🚶 walk routes in completely different ways — but the map just calls `route(A, B)` on whichever `RouteStrategy` it currently holds. Swap the strategy and the *same call* produces a different route, with no if/else anywhere.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/strategy.html",
  content: {
    prototypeCaption:
      "A tiny maps app routing from **A to B**. Pick a strategy chip — **🚗 Drive**, **🚴 Bike** or **🚶 Walk** — then press **▶ route()**. Each strategy draws a *completely different* path across the same city: Drive hugs the highway around the edge (fast but long), Bike follows the riverside lanes, Walk cuts straight through the park (short but slow). The one thing that never changes is the mono card reading `map.route(A → B)` — that's the client code, and it stays byte-for-byte identical while the algorithm behind it swaps. Switch chips and re-route a few times: same call, different algorithm, different result. That's the whole pattern.",

    overview: [
      {
        type: "p",
        text: "**Strategy** answers a question every codebase eventually hits: *what do you do when there are several ways to perform the same task?* A maps app can take you from A to B by car, by bike or on foot — same start, same destination, three totally different route computations. The naive answer is one giant method with an `if (mode === \"drive\") … else if (mode === \"bike\") … else …` — and that method grows, tangles and breaks a little more with every new travel mode. Strategy takes the opposite route: pull each algorithm out into its **own small class**, make them all implement **one interface** (`RouteStrategy` with a single `buildRoute(A, B)` method), and let the map hold *whichever one* is currently selected.",
      },
      {
        type: "p",
        text: "The payoff is that the *client code never changes*. The map object doesn't know highways from bike lanes — it holds **one** strategy reference and calls `buildRoute(A, B)` on it. Tap the 🚶 chip and the app just swaps which object sits behind that reference; the call site is untouched. New travel mode next quarter (🛴 scooter)? Write one new class that implements `RouteStrategy` — you never reopen the map, and you never re-test the three algorithms that already worked. Alongside [[singleton]], this is one of the **two most-asked patterns in interviews**, because it's the cleanest demonstration of composition, polymorphism and the open–closed principle working together.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Strategy defines a **family of interchangeable algorithms**, puts each behind **one common interface**, and lets the client **pick or swap** the algorithm at runtime — the code that *uses* the algorithm never changes, only the object plugged into it does.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've already used it",
        text: "Every time you pass a comparator to a sort — `routes.sort((a, b) => a.km - b.km)` — you're using Strategy. The sort is the context (the stable skeleton), and the callback is the interchangeable algorithm you plug in. In functional languages a strategy is often just a passed-in function.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three participants" },
      {
        type: "p",
        text: "A textbook Strategy has three moving parts, and each is small:",
      },
      {
        type: "ul",
        items: [
          "**The Strategy interface** — one contract every algorithm signs, e.g. `RouteStrategy` with a single method `buildRoute(from, to)`. This is [[program-to-interfaces]] in its purest form: the client depends on this contract and nothing else.",
          "**Concrete strategies** — one small class per algorithm: `DriveStrategy`, `BikeStrategy`, `WalkStrategy`. Each hides its own details (highway graphs, bike-lane maps, footpaths) behind the same method signature. They're interchangeable precisely because they're indistinguishable through the interface.",
          "**The Context** — the class that needs the work done (the `MapApp`). It holds **one** strategy reference, receives it via the constructor or a setter (that's constructor/setter injection — see [[dependency-injection-and-ioc]]), and *delegates*: `route(A, B)` just calls `this.strategy.buildRoute(A, B)`. The context never implements an algorithm and never inspects which one it holds.",
        ],
      },
      { type: "h", text: "The smell it cures: the algorithm-choosing conditional" },
      {
        type: "p",
        text: "Strategy exists to kill one specific smell: a **growing `if/else` or `switch` that picks an algorithm inline**. One method that branches on a mode string, with each branch containing a whole algorithm, has three compounding problems: every new variant means *editing* a class that already worked (a direct [[open-closed]] violation), the variants can't be tested in isolation because they share locals and state, and the conditional inevitably gets copy-pasted to other places that need the same choice. Strategy replaces the branch point with **polymorphism** — the 'decision' happens once, when someone plugs a strategy in; after that, calling the method *is* the dispatch.",
      },
      {
        type: "code",
        language: "typescript",
        code: `interface RouteStrategy {                    // the one shared contract
  buildRoute(from: string, to: string): string;
}

class DriveStrategy implements RouteStrategy {
  buildRoute(a: string, b: string) { return \`\${a}→highways→\${b}\`; }
}
class WalkStrategy implements RouteStrategy {
  buildRoute(a: string, b: string) { return \`\${a}→park path→\${b}\`; }
}

class MapApp {                                // the context
  constructor(private strategy: RouteStrategy) {}   // injected in
  setStrategy(s: RouteStrategy) { this.strategy = s; }  // swap at runtime
  route(a: string, b: string) {
    return this.strategy.buildRoute(a, b);    // delegate — no if/else
  }
}

const map = new MapApp(new DriveStrategy());
map.route("A", "B");                 // drive route
map.setStrategy(new WalkStrategy()); // user taps 🚶
map.route("A", "B");                 // SAME call, different algorithm`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "The modern shortcut: a strategy is often just a function",
        text: "When a strategy interface has exactly **one method**, a whole class can be overkill. In JavaScript/TypeScript, Python, and modern Java/C++, you can pass a **function or lambda** instead: `routes.sort((a, b) => a.time - b.time)` is Strategy with zero ceremony — the comparator *is* the strategy. Reach for the class version when strategies carry their own state or config (API keys, tuning parameters), or when the family is big enough to deserve names.",
      },
      { type: "h", text: "Strategy vs State: same shape, different driver" },
      {
        type: "p",
        text: "Strategy's structure — context delegating to a swappable object behind an interface — is *identical* to the [[state]] pattern, and interviewers love asking the difference. It's about **who does the swapping and why**. In Strategy, the **client** picks the algorithm (*you* tap 🚴 in the maps app), the strategies don't know each other exist, and the chosen strategy rarely changes mid-task. In State, the objects represent *modes of being* (an order that's `Placed`, `Paid`, `Shipped`), they typically **know about each other and trigger their own transitions** — paying an order moves it to `Paid` without any client choosing. One sentence: **Strategy is chosen from outside; State switches itself from inside.**",
      },
      { type: "h", text: "Where you'll meet it in the wild" },
      {
        type: "ul",
        items: [
          "**Sort comparators** — `Array.sort(cmp)`, Java's `Comparator`, C++'s `std::sort` predicate: the classic function-as-strategy.",
          "**Payment methods** — checkout calls `pay(amount)` on a `PaymentStrategy`; card, UPI, wallet and PayPal each implement it their own way.",
          "**Compression codecs** — an archiver holds a `CompressionStrategy` (zip, gzip, zstd) and calls `compress(bytes)` without caring which.",
          "**Pricing & discount rules** — seasonal, coupon, loyalty-tier discounts as interchangeable `DiscountStrategy` objects the cart applies.",
          "**Auth providers** — login flows swap `AuthStrategy` implementations (password, OAuth, magic link); libraries like Passport.js literally call them strategies.",
          "**Route planning** — the running example: navigation apps swap routing algorithms per travel mode over the same `buildRoute` call.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Run the same call three ways",
        body: "In the prototype, leave 🚗 Drive selected and press ▶ route(). A long blue path draws along the highway ring — 12 min · 8.4 km. Now tap 🚴 Bike, press ▶ route() again: the drive path vanishes and a riverside route replaces it. Tap 🚶 Walk and route once more — a short green path cuts diagonally through the park, 58 min · 4.7 km. Three totally different algorithms, three different results.",
      },
      {
        title: "02 · Stare at the context card",
        body: "While you swap chips, watch the mono card that reads map.route(A → B) — it never changes, which is why it carries the little 'client code: unchanged' chip. That card is the whole point of the pattern: the context makes one polymorphic call, and the strategy chips only change which object receives it. No branch in the client ever asks 'which mode am I in?'.",
      },
      {
        title: "03 · Swap mid-flight, then reset",
        body: "Press ▶ route() and, while the path is still drawing, click a different chip and route again — the old path is replaced instantly, because the map holds exactly ONE strategy at a time (not three tangled branches). Finish with ↺ Reset: the map clears, but the selected chip stays — the strategy is state the context holds, not something rebuilt per call.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "route-strategy.ts",
        code: `// 1) The Strategy interface — one contract for the whole family.
interface RouteStrategy {
  buildRoute(from: string, to: string): string;
}

// 2) Concrete strategies — each computes the route its own way.
class DriveStrategy implements RouteStrategy {
  buildRoute(from: string, to: string): string {
    return \`\${from} → highways → \${to}  (12 min · 8.4 km)\`;
  }
}
class BikeStrategy implements RouteStrategy {
  buildRoute(from: string, to: string): string {
    return \`\${from} → river lanes → \${to}  (26 min · 6.1 km)\`;
  }
}
class WalkStrategy implements RouteStrategy {
  buildRoute(from: string, to: string): string {
    return \`\${from} → park path → \${to}  (58 min · 4.7 km)\`;
  }
}

// 3) The Context — holds ONE strategy, delegates, never branches.
class MapApp {
  constructor(private strategy: RouteStrategy) {}  // injected in
  setStrategy(s: RouteStrategy): void { this.strategy = s; }
  route(from: string, to: string): string {
    return this.strategy.buildRoute(from, to);     // polymorphic call
  }
}

const app = new MapApp(new DriveStrategy());
console.log(app.route("A", "B"));   // drive route
app.setStrategy(new WalkStrategy());  // user taps 🚶
console.log(app.route("A", "B"));   // SAME call → walking route

// The lambda shortcut: a one-method strategy is just a function.
const distances = [8.4, 6.1, 4.7];
distances.sort((a, b) => a - b);    // the comparator IS a strategy`,
      },
      {
        label: "Java",
        language: "java",
        filename: "RouteStrategy.java",
        code: `// 1) The Strategy interface — one contract for the whole family.
interface RouteStrategy {
    String buildRoute(String from, String to);
}

// 2) Concrete strategies — each computes the route its own way.
class DriveStrategy implements RouteStrategy {
    public String buildRoute(String from, String to) {
        return from + " → highways → " + to + "  (12 min · 8.4 km)";
    }
}
class BikeStrategy implements RouteStrategy {
    public String buildRoute(String from, String to) {
        return from + " → river lanes → " + to + "  (26 min · 6.1 km)";
    }
}
class WalkStrategy implements RouteStrategy {
    public String buildRoute(String from, String to) {
        return from + " → park path → " + to + "  (58 min · 4.7 km)";
    }
}

// 3) The Context — holds ONE strategy, delegates, never branches.
class MapApp {
    private RouteStrategy strategy;
    MapApp(RouteStrategy s) { this.strategy = s; }       // injected in
    void setStrategy(RouteStrategy s) { this.strategy = s; }
    String route(String from, String to) {
        return strategy.buildRoute(from, to);            // polymorphic call
    }
}

// MapApp app = new MapApp(new DriveStrategy());
// app.route("A", "B");                  // drive route
// app.setStrategy(new WalkStrategy());  // user taps 🚶
// app.route("A", "B");                  // SAME call → walking route
//
// RouteStrategy is a functional interface, so a lambda works too:
// app.setStrategy((a, b) -> a + " → teleport → " + b);`,
      },
      {
        label: "Python",
        language: "python",
        filename: "route_strategy.py",
        code: `from abc import ABC, abstractmethod

# 1) The Strategy interface — one contract for the whole family.
class RouteStrategy(ABC):
    @abstractmethod
    def build_route(self, start: str, end: str) -> str: ...

# 2) Concrete strategies — each computes the route its own way.
class DriveStrategy(RouteStrategy):
    def build_route(self, start: str, end: str) -> str:
        return f"{start} → highways → {end}  (12 min · 8.4 km)"

class BikeStrategy(RouteStrategy):
    def build_route(self, start: str, end: str) -> str:
        return f"{start} → river lanes → {end}  (26 min · 6.1 km)"

class WalkStrategy(RouteStrategy):
    def build_route(self, start: str, end: str) -> str:
        return f"{start} → park path → {end}  (58 min · 4.7 km)"

# 3) The Context — holds ONE strategy, delegates, never branches.
class MapApp:
    def __init__(self, strategy: RouteStrategy):    # injected in
        self._strategy = strategy

    def set_strategy(self, strategy: RouteStrategy) -> None:
        self._strategy = strategy

    def route(self, start: str, end: str) -> str:
        return self._strategy.build_route(start, end)  # polymorphic call


app = MapApp(DriveStrategy())
print(app.route("A", "B"))      # drive route
app.set_strategy(WalkStrategy())  # user taps 🚶
print(app.route("A", "B"))      # SAME call → walking route

# The lambda shortcut: a one-method strategy is just a function.
distances = [8.4, 6.1, 4.7]
distances.sort(key=lambda km: km)   # the key function IS a strategy`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "route_strategy.cpp",
        code: `#include <iostream>
#include <memory>
#include <string>

// 1) The Strategy interface — one contract for the whole family.
class RouteStrategy {
public:
    virtual ~RouteStrategy() = default;
    virtual std::string buildRoute(const std::string& a,
                                   const std::string& b) const = 0;
};

// 2) Concrete strategies — each computes the route its own way.
class DriveStrategy : public RouteStrategy {
public:
    std::string buildRoute(const std::string& a, const std::string& b) const override {
        return a + " → highways → " + b + "  (12 min · 8.4 km)";
    }
};
class WalkStrategy : public RouteStrategy {
public:
    std::string buildRoute(const std::string& a, const std::string& b) const override {
        return a + " → park path → " + b + "  (58 min · 4.7 km)";
    }
};

// 3) The Context — holds ONE strategy, delegates, never branches.
class MapApp {
    std::unique_ptr<RouteStrategy> strategy;
public:
    explicit MapApp(std::unique_ptr<RouteStrategy> s) : strategy(std::move(s)) {}
    void setStrategy(std::unique_ptr<RouteStrategy> s) { strategy = std::move(s); }
    std::string route(const std::string& a, const std::string& b) const {
        return strategy->buildRoute(a, b);            // polymorphic call
    }
};

int main() {
    MapApp app(std::make_unique<DriveStrategy>());
    std::cout << app.route("A", "B") << "\\n";        // drive route
    app.setStrategy(std::make_unique<WalkStrategy>()); // user taps 🚶
    std::cout << app.route("A", "B") << "\\n";        // SAME call → walk route
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Strategy when…" },
      {
        type: "ul",
        items: [
          "**You have many variants of one algorithm** — several ways to route, price, compress, sort or authenticate, all doing 'the same job' differently. That's the family Strategy is built for.",
          "**The choice happens at runtime** — the user taps a travel-mode chip, a config flag picks a codec, an A/B test assigns a pricing rule. Swapping an object is trivial; rewriting a conditional at runtime is impossible.",
          "**You want each algorithm isolated and testable** — every strategy is a small class you can unit-test alone, hand a fake to, or tune without touching its siblings or the context.",
          "**A conditional that picks algorithms keeps growing** — an `if/else` chain over modes that every new feature edits is the flashing sign; Strategy replaces the branches with one polymorphic call and makes new variants pure additions ([[open-closed]]).",
        ],
      },
      { type: "h", text: "Skip it when…" },
      {
        type: "ul",
        items: [
          "**There's one algorithm and it never varies** — an interface, three files and an injection point to wrap a single stable computation is pure ceremony. Inline it and move on; extract a strategy the day a second variant actually appears.",
          "**The variants are trivially small** — if each 'algorithm' is one expression (a comparator, a formatter), pass a **function argument** instead of building the class version. Same pattern, a tenth of the code.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Swap algorithms at runtime — the context holds a reference, so changing behaviour is one assignment, not a code change.",
        "Open–closed wins: a new variant is a new class that implements the interface — existing, tested strategies and the context stay untouched.",
        "Each algorithm is isolated — its data structures and helpers live in its own class, unit-testable alone and easy to mock in the context's tests.",
        "Kills duplicated algorithm-choosing conditionals — the mode decision happens once (where the strategy is injected), instead of being re-branched at every call site.",
      ],
      cons: [
        "More classes and indirection — a family of three one-line algorithms becomes an interface plus three files; overkill when a function argument would do.",
        "Clients must know the strategies to choose one — something (UI, config, factory) still has to map 'user tapped 🚴' to `new BikeStrategy()`; the decision moves, it doesn't vanish.",
        "The shared interface can pinch — all strategies must fit one signature, so a variant that needs extra inputs forces either a wider interface or config passed into its constructor.",
        "Harder to read for newcomers than a plain conditional — behaviour is spread across classes and picked at runtime, so 'which code actually ran?' takes one more hop to answer.",
      ],
    },

    furtherReading: [
      {
        label: "Strategy — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/strategy",
        note: "The clearest illustrated walkthrough — a navigation-app example almost identical to this lesson's, structure diagrams, and 'how to implement' steps. Best first read.",
        kind: "article",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Strategy. The primary source for its intent: 'define a family of algorithms, encapsulate each one, and make them interchangeable.'",
        kind: "book",
      },
      {
        label: "Head First Design Patterns — Freeman & Robson (Chapter 1: the duck simulator)",
        href: "https://www.oreilly.com/library/view/head-first-design/9781492077992/",
        note: "Famously opens the whole book with Strategy: ducks whose fly and quack behaviours are swappable objects. The gentlest deep-dive on 'favor composition over inheritance.'",
        kind: "book",
      },
      {
        label: "The Strategy Pattern in Java — Baeldung",
        href: "https://www.baeldung.com/java-strategy-pattern",
        note: "Practical Java treatment, including how Java 8 lambdas collapse one-method strategies into function references — the modern shortcut this lesson mentions.",
        kind: "article",
      },
      {
        label: "Strategy pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Strategy_pattern",
        note: "Concise reference with UML, multi-language examples, and the relationship to the open–closed principle and to function-as-argument styles.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "strategy-q1",
        question: "What is the intent of the Strategy pattern?",
        options: [
          { id: "a", label: "Define a family of interchangeable algorithms behind one interface, so the client can pick or swap them at runtime." },
          { id: "b", label: "Guarantee that a class has exactly one instance with a global access point." },
          { id: "c", label: "Add new behaviour to an object by wrapping it in layers." },
          { id: "d", label: "Convert one interface into another so incompatible classes can work together." },
        ],
        correctOptionId: "a",
        explanation:
          "Strategy encapsulates each variant of an algorithm in its own class behind a shared interface, and the context delegates to whichever one it currently holds — so the algorithm can be swapped without touching the client. (b) is Singleton, (c) is Decorator, (d) is Adapter.",
      },
      {
        id: "strategy-q2",
        question: "In the maps-app example, what is the role of the Context (the `MapApp` class)?",
        options: [
          { id: "a", label: "It holds one RouteStrategy reference and delegates route(A, B) to it — it never implements or inspects the algorithms." },
          { id: "b", label: "It contains an if/else over travel modes and runs the matching branch." },
          { id: "c", label: "It inherits from DriveStrategy, BikeStrategy and WalkStrategy at once." },
          { id: "d", label: "It creates a new strategy object on every single route() call." },
        ],
        correctOptionId: "a",
        explanation:
          "The context's whole job is delegation: hold one strategy (injected via constructor or setter), and forward the call polymorphically. It contains no algorithm and no branch — that's exactly what makes the client code stay unchanged when strategies swap. (b) is the smell the pattern removes; (c) is inheritance misuse where composition belongs.",
      },
      {
        id: "strategy-q3",
        question: "Your pricing method is a growing `switch` over discount types, and every new discount edits that method. How does Strategy fix this?",
        options: [
          { id: "a", label: "Each discount becomes its own class behind a DiscountStrategy interface, so a new discount is a new class — existing code isn't edited (open–closed)." },
          { id: "b", label: "It replaces the switch with a longer chain of nested if statements." },
          { id: "c", label: "It merges all discount rules into one bigger, smarter method." },
          { id: "d", label: "It caches the switch result so the branches run faster." },
        ],
        correctOptionId: "a",
        explanation:
          "Strategy converts the branch point into polymorphism: the 'decision' happens once, when a strategy is plugged in, and adding a variant means adding a class rather than modifying tested code. That's the open–closed principle in action — the pattern's core motivation, not a performance trick.",
      },
      {
        id: "strategy-q4",
        question: "Strategy and State have nearly identical structure. What's the key difference?",
        options: [
          { id: "a", label: "In Strategy the client picks the algorithm from outside and it rarely self-switches; in State the objects represent modes that typically trigger their own transitions." },
          { id: "b", label: "Strategy only works with exactly two algorithms; State supports more." },
          { id: "c", label: "State uses interfaces while Strategy requires inheritance from a base class." },
          { id: "d", label: "There is no difference — they are two names for the same pattern." },
        ],
        correctOptionId: "a",
        explanation:
          "Both delegate to a swappable object behind an interface — the difference is who drives the swap. A user taps 🚴 and the client sets BikeStrategy; strategies don't know each other exist. State objects (Placed → Paid → Shipped) usually know about each other and move the context between themselves as part of their behaviour. Strategy is chosen from outside; State switches itself from inside.",
      },
      {
        id: "strategy-q5",
        question: "You call `routes.sort((a, b) => a.km - b.km)`. How does this relate to the Strategy pattern?",
        options: [
          { id: "a", label: "The comparator function IS a strategy — sort is the context, and the passed-in function is the interchangeable algorithm, no class needed." },
          { id: "b", label: "It's unrelated — Strategy always requires an interface and concrete classes." },
          { id: "c", label: "It's the State pattern, because the array changes state when sorted." },
          { id: "d", label: "It's the Singleton pattern, because there is only one comparator." },
        ],
        correctOptionId: "a",
        explanation:
          "When a strategy interface has one method, a function or lambda can play the strategy role with zero ceremony — sort comparators are the classic example. The class-based form earns its keep when strategies carry their own state or configuration; the intent (interchangeable algorithm behind one contract) is identical either way.",
      },
      {
        id: "strategy-q6",
        question: "When is applying the Strategy pattern probably a mistake?",
        options: [
          { id: "a", label: "When there's a single stable algorithm that never varies, or the variants are so trivial a function argument would do." },
          { id: "b", label: "When users need to switch the algorithm at runtime." },
          { id: "c", label: "When each algorithm needs to be unit-tested in isolation." },
          { id: "d", label: "When a conditional choosing between algorithms keeps growing." },
        ],
        correctOptionId: "a",
        explanation:
          "One algorithm with no variants gains nothing from an interface, extra classes and an injection point — that's ceremony without benefit, and a tiny variant is often better passed as a lambda. Options (b), (c) and (d) are the exact situations where Strategy shines: runtime selection, isolated testing, and killing algorithm-choosing conditionals.",
      },
    ],
  },
};
