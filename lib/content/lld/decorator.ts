import type { RoadmapLesson } from "@/lib/content/types";

export const decorator: RoadmapLesson = {
  title: "Decorator",
  oneLiner:
    "Add behavior to an object by placing it inside wrapper objects that share its interface. A plain `Espresso` knows its own `cost()`; wrap it — `new Whip(new Milk(new Espresso()))` — and each layer adds its own price, then passes the call along. Stack any combination at runtime, with no `EspressoWithMilkAndWhip` subclass zoo.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/decorator.html",
  content: {
    prototypeCaption:
      "A coffee-order builder. The **☕ Espresso ($2.50)** sits at the core. Click an add-on chip — *🥛 Milk*, *🍫 Mocha*, *🍦 Whip*, *🍯 Caramel* — and a labeled **ring wraps around the whole order**; the newest wrapper is always the outermost ring. The mono readout shows the real composed expression, e.g. `new Whip(new Milk(new Espresso()))`, plus the current `cost()`. Press **▶ cost()** and watch a pulse travel from the outermost ring *inward* to the espresso, then back *out* — each ring flashes its `+$x` on the way out while the total counts up. That's the whole pattern in one animation: the call passes inward, each wrapper adds its bit on the return. The tiny counter reminds you what you're *not* writing: **16 subclasses** for 4 add-ons.",

    overview: [
      {
        type: "p",
        text: "**Decorator** attaches new behavior to an object by placing it inside wrapper objects that share its interface — that's the whole intent in one sentence. Think of a coffee order. An `Espresso` is a `Coffee`: it has a `cost()` and a `description()`. Now the customer wants milk. You don't edit `Espresso`, and you don't create a `MilkEspresso` subclass. You wrap it: `new Milk(new Espresso())`. The `Milk` wrapper is *also* a `Coffee` — same interface — so anyone holding it can call `cost()` exactly as before. Inside, `Milk` asks the espresso for its cost and adds $0.50 on top.",
      },
      {
        type: "p",
        text: "The trick that makes it powerful: because every wrapper looks like a plain `Coffee`, wrappers can wrap *other wrappers*. Want milk, mocha, and whip? `new Whip(new Mocha(new Milk(new Espresso())))`. Each layer adds one small thing and delegates the rest. You compose behavior at *runtime*, layer by layer, in any order and any combination — something plain inheritance simply can't do, because a class's parents are fixed forever at compile time.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A decorator **wraps** an object, **implements the same interface**, and **adds its own behavior** before or after delegating to the object it wraps. To the outside world, the wrapped stack is indistinguishable from the plain object.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Not the same as Python's @decorator syntax",
        text: "Python's `@decorator` functions share the *name* and the *spirit* (wrap a thing, keep its shape, add behavior) but they wrap **functions**, not objects, and they're applied once at definition time. The GoF Decorator pattern wraps **objects at runtime**. Related idea, different mechanism.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The four participants" },
      {
        type: "p",
        text: "Every textbook Decorator has the same four roles. In coffee terms:",
      },
      {
        type: "ul",
        items: [
          "**Component interface** — `Coffee`, with `cost()` and `description()`. This is the shape everyone agrees on; both real coffees and wrappers implement it.",
          "**Concrete Component** — `Espresso`, the plain object at the core of every stack. It answers `cost()` with its own price and doesn't know wrappers exist.",
          "**Base Decorator** — a small abstract class that *holds a reference to a wrapped `Coffee`* and, by default, just forwards every call to it. Its only job is the plumbing.",
          "**Concrete Decorators** — `Milk`, `Mocha`, `Whip`, `Caramel`. Each extends the base decorator and overrides methods to add its own bit: its price, its name — then delegates inward.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `interface Coffee {
  cost(): number;
  description(): string;
}

class Espresso implements Coffee {          // the core
  cost() { return 2.5; }
  description() { return "Espresso"; }
}

abstract class CoffeeDecorator implements Coffee {
  constructor(protected wrapped: Coffee) {} // 🔑 holds what it wraps
  cost() { return this.wrapped.cost(); }    // default: just delegate
  description() { return this.wrapped.description(); }
}

class Milk extends CoffeeDecorator {
  cost() { return this.wrapped.cost() + 0.5; }        // add, then delegate
  description() { return this.wrapped.description() + " + Milk"; }
}

class Whip extends CoffeeDecorator {
  cost() { return this.wrapped.cost() + 0.7; }
  description() { return this.wrapped.description() + " + Whip"; }
}

const order: Coffee = new Whip(new Milk(new Espresso()));
order.cost();          // 3.7  — 2.5 + 0.5 + 0.7
order.description();   // "Espresso + Milk + Whip"`,
      },
      { type: "h", text: "How one cost() call unwinds through the layers" },
      {
        type: "p",
        text: "Call `cost()` on `new Whip(new Milk(new Espresso()))` and the call travels *inward*: `Whip.cost()` asks `Milk`, `Milk.cost()` asks `Espresso`. Then the answers come back *out*: `Espresso` returns **$2.50**, `Milk` adds $0.50 and returns **$3.00**, `Whip` adds $0.70 and returns **$3.70**. Each layer does one small job on the way back. The caller never sees any of this — it called `cost()` on *a* `Coffee` and got a number.",
      },
      { type: "h", text: "Why not just subclass? Do the math" },
      {
        type: "p",
        text: "With 4 optional add-ons, covering every combination with subclasses means `EspressoWithMilk`, `EspressoWithMilkAndMocha`, `EspressoWithMilkAndWhip`… — one class per subset, which is **2⁴ = 16 classes**. Add a fifth add-on and it's 32. With Decorator you write **4 small wrapper classes**, ever, and compose any of the 16 combinations at runtime by stacking. That's the subclass explosion the pattern kills — and it's [[open-closed]] in action: you extend behavior by *adding* new wrapper classes, never by modifying `Espresso`.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Decorators wrap decorators — order can matter",
        text: "Because a wrapper *is a* `Coffee`, it happily wraps another wrapper — that's what makes stacking work. Note the stack has an order: for prices it doesn't matter ($ adds up either way), but a decorator that, say, applies a **10% discount** gives different totals depending on whether it wraps the milk or the milk wraps it.",
      },
      { type: "h", text: "You've already used this pattern" },
      {
        type: "ul",
        items: [
          "**Java I/O streams** — `new BufferedReader(new FileReader(\"log.txt\"))`: `FileReader` is the core component, `BufferedReader` is a decorator that adds buffering while staying a `Reader`. `GZIPInputStream`, `DataInputStream` — same idea, stackable.",
          "**Web middleware** — logging, auth, and compression layers each wrap a handler, do their bit, and delegate to the next. A request unwinds through them exactly like `cost()` unwinds through the coffee stack.",
          "**GUI components** — the Gang of Four's original example: a `ScrollDecorator` or `BorderDecorator` wraps any visual component and adds scrollbars or a border without the component knowing.",
        ],
      },
      {
        type: "p",
        text: "Don't confuse it with two neighbors: [[adapter]] also wraps one object, but its goal is to *change* the interface so incompatible code can talk; Decorator *keeps* the interface and adds behavior. And [[composite]] aggregates *many* children behind one interface, while a Decorator wraps *exactly one* object and enhances it.",
      },
    ],

    handsOn: [
      {
        title: "01 · Build an order by wrapping",
        body: "Open the prototype. The core ring is ☕ Espresso at $2.50. Click the 🥛 Milk +$0.50 chip — a Milk ring wraps around the espresso, and the readout updates to `new Milk(new Espresso())`. Add 🍦 Whip +$0.70 and watch it become the new *outermost* ring: `new Whip(new Milk(new Espresso()))`. Newest wrapper is always on the outside — that's the nesting order of the constructor calls.",
      },
      {
        title: "02 · Run cost() and watch it unwind",
        body: "Press ▶ cost(). A pulse travels from the outermost ring inward to the espresso — that's the call delegating layer by layer. Then it comes back out: each ring flashes its +$x as the total counts up ($2.50 → $3.00 → $3.70). One animation, whole pattern: call goes in, prices add up on the way out.",
      },
      {
        title: "03 · Toggle combinations, count the classes you didn't write",
        body: "Click a chip that's already on to unwrap that layer, then stack a different combination — Mocha + Caramel, all four, whatever you like. Every combination works because each wrapper only knows the `Coffee` it wraps. The little counter chip says it plainly: covering these combos with inheritance would take 16 subclasses; here it's 4 decorators. Press ↺ Reset to get back to a plain espresso.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "coffee.ts",
        code: `interface Coffee {
  cost(): number;
  description(): string;
}

// Concrete component — the plain object at the core.
class Espresso implements Coffee {
  cost(): number { return 2.5; }
  description(): string { return "Espresso"; }
}

// Base decorator — holds a wrapped Coffee, delegates by default.
abstract class CoffeeDecorator implements Coffee {
  constructor(protected wrapped: Coffee) {}
  cost(): number { return this.wrapped.cost(); }
  description(): string { return this.wrapped.description(); }
}

// Concrete decorators — each adds one small thing, then delegates.
class Milk extends CoffeeDecorator {
  cost(): number { return this.wrapped.cost() + 0.5; }
  description(): string { return this.wrapped.description() + " + Milk"; }
}

class Mocha extends CoffeeDecorator {
  cost(): number { return this.wrapped.cost() + 0.8; }
  description(): string { return this.wrapped.description() + " + Mocha"; }
}

class Whip extends CoffeeDecorator {
  cost(): number { return this.wrapped.cost() + 0.7; }
  description(): string { return this.wrapped.description() + " + Whip"; }
}

// Stack any combination at runtime — no subclass zoo.
const order: Coffee = new Whip(new Mocha(new Milk(new Espresso())));
console.log(order.description()); // Espresso + Milk + Mocha + Whip
console.log(order.cost());        // 4.5`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Coffee.java",
        code: `interface Coffee {
    double cost();
    String description();
}

// Concrete component — the plain object at the core.
class Espresso implements Coffee {
    public double cost() { return 2.50; }
    public String description() { return "Espresso"; }
}

// Base decorator — holds a wrapped Coffee, delegates by default.
abstract class CoffeeDecorator implements Coffee {
    protected final Coffee wrapped;
    protected CoffeeDecorator(Coffee wrapped) { this.wrapped = wrapped; }
    public double cost() { return wrapped.cost(); }
    public String description() { return wrapped.description(); }
}

// Concrete decorators — add one thing, then delegate inward.
class Milk extends CoffeeDecorator {
    Milk(Coffee c) { super(c); }
    public double cost() { return wrapped.cost() + 0.50; }
    public String description() { return wrapped.description() + " + Milk"; }
}

class Whip extends CoffeeDecorator {
    Whip(Coffee c) { super(c); }
    public double cost() { return wrapped.cost() + 0.70; }
    public String description() { return wrapped.description() + " + Whip"; }
}

public class Demo {
    public static void main(String[] args) {
        Coffee order = new Whip(new Milk(new Espresso()));
        System.out.println(order.description()); // Espresso + Milk + Whip
        System.out.println(order.cost());        // 3.7
        // Same shape as Java's own I/O:
        // new BufferedReader(new FileReader("log.txt"))
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "coffee.py",
        code: `from abc import ABC, abstractmethod


class Coffee(ABC):                      # component interface
    @abstractmethod
    def cost(self) -> float: ...
    @abstractmethod
    def description(self) -> str: ...


class Espresso(Coffee):                 # concrete component (the core)
    def cost(self) -> float:
        return 2.50
    def description(self) -> str:
        return "Espresso"


class CoffeeDecorator(Coffee):          # base decorator: holds the wrapped Coffee
    def __init__(self, wrapped: Coffee):
        self._wrapped = wrapped
    def cost(self) -> float:            # default: just delegate
        return self._wrapped.cost()
    def description(self) -> str:
        return self._wrapped.description()


class Milk(CoffeeDecorator):            # add one thing, then delegate
    def cost(self) -> float:
        return self._wrapped.cost() + 0.50
    def description(self) -> str:
        return self._wrapped.description() + " + Milk"


class Whip(CoffeeDecorator):
    def cost(self) -> float:
        return self._wrapped.cost() + 0.70
    def description(self) -> str:
        return self._wrapped.description() + " + Whip"


order = Whip(Milk(Espresso()))          # stack any combination at runtime
print(order.description())              # Espresso + Milk + Whip
print(order.cost())                     # 3.7

# Note: Python's @decorator syntax wraps *functions* at definition time.
# Same spirit, different mechanism — this pattern wraps *objects* at runtime.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "coffee.cpp",
        code: `#include <iostream>
#include <memory>
#include <string>

struct Coffee {                              // component interface
    virtual ~Coffee() = default;
    virtual double cost() const = 0;
    virtual std::string description() const = 0;
};

struct Espresso : Coffee {                   // concrete component
    double cost() const override { return 2.50; }
    std::string description() const override { return "Espresso"; }
};

struct CoffeeDecorator : Coffee {            // base decorator: owns the wrapped Coffee
    explicit CoffeeDecorator(std::unique_ptr<Coffee> w) : wrapped(std::move(w)) {}
    double cost() const override { return wrapped->cost(); }
    std::string description() const override { return wrapped->description(); }
protected:
    std::unique_ptr<Coffee> wrapped;
};

struct Milk : CoffeeDecorator {              // add one thing, then delegate
    using CoffeeDecorator::CoffeeDecorator;
    double cost() const override { return wrapped->cost() + 0.50; }
    std::string description() const override { return wrapped->description() + " + Milk"; }
};

struct Whip : CoffeeDecorator {
    using CoffeeDecorator::CoffeeDecorator;
    double cost() const override { return wrapped->cost() + 0.70; }
    std::string description() const override { return wrapped->description() + " + Whip"; }
};

int main() {
    // Stack any combination at runtime — newest wrapper outermost.
    std::unique_ptr<Coffee> order =
        std::make_unique<Whip>(std::make_unique<Milk>(std::make_unique<Espresso>()));
    std::cout << order->description() << "\\n";  // Espresso + Milk + Whip
    std::cout << order->cost() << "\\n";         // 3.7
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Decorator when behavior comes in optional, stackable pieces" },
      {
        type: "ul",
        items: [
          "**Add responsibilities at runtime** — the caller decides *while the program runs* which extras an object gets (this order wants milk and whip; the next one doesn't). Inheritance fixes behavior at compile time; wrapping composes it on the fly.",
          "**Combinations of optional features** — buffering + encryption + compression on a stream; logging + auth + rate-limiting on a handler. A handful of decorators covers every subset; subclasses would explode (n features → 2ⁿ classes).",
          "**When subclassing is closed to you** — the class is `final`, comes from a third-party library, or you only ever hold it behind an interface. You can't extend it, but you can always wrap it.",
          "**Keeping the core class small** — `Espresso` stays a dumb, honest espresso. Every extra lives in its own tiny class with one job. That's [[open-closed]]: open to extension by new wrappers, closed to modification.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When NOT to use it",
        text: "If there's exactly **one** fixed extra behavior and it never varies, a plain subclass — or just a field/flag on the class — is simpler and easier to read. Decorator pays off when extras are *optional and combinable*. And pick the right wrapper: [[adapter]] wraps to *change* the interface, Decorator wraps to *keep* it and add behavior; [[composite]] holds *many* children, Decorator wraps exactly *one*.",
      },
    ],

    tradeoffs: {
      pros: [
        "Add or remove responsibilities at runtime by wrapping and unwrapping — no recompiling, no editing the core class.",
        "Kills the subclass explosion: n optional features need n small wrapper classes instead of 2ⁿ subclasses for every combination.",
        "Single Responsibility in practice — each decorator is a tiny class that does exactly one thing (add milk, add buffering, add logging).",
        "Open-Closed in practice — new behavior means a new wrapper class; existing components and decorators never change.",
      ],
      cons: [
        "Many small objects — a heavily decorated system is a forest of little wrappers that look alike, which can make debugging and stack traces harder to follow.",
        "Identity breaks: the decorated object is **not** the same object as the core (`order !== espresso`), so identity checks and some type checks (`instanceof Espresso`) fail on the wrapped stack.",
        "Order can matter — a discount decorator gives different results wrapping the milk vs. being wrapped by it, and nothing in the types warns you.",
        "Hard to remove a layer from the middle of the stack — wrappers only know what's *inside* them, so pulling one out means rebuilding the chain around it.",
      ],
    },

    furtherReading: [
      {
        label: "Decorator — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/decorator",
        note: "The clearest illustrated walkthrough: the notification/stream problem, the wrapper structure, when to use it, and code in many languages. Best first read.",
        kind: "article",
      },
      {
        label: "Decorator pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Decorator_pattern",
        note: "Concise reference with UML, the Java I/O example, and notes on how the pattern relates to Adapter, Composite, and language-level decorators.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original Gang of Four book. Its Decorator chapter uses the classic GUI example — adding borders and scrollbars to visual components by wrapping.",
        kind: "book",
      },
      {
        label: "Head First Design Patterns — Freeman & Robson (Decorator chapter)",
        href: "https://en.wikipedia.org/wiki/Head_First_Design_Patterns",
        note: "The famous 'Starbuzz Coffee' chapter is exactly this lesson's example — beverages and condiment decorators — told with the book's trademark visual style.",
        kind: "book",
      },
      {
        label: "The Decorator Pattern in Python — python-patterns.guide (Brandon Rhodes)",
        href: "https://python-patterns.guide/gang-of-four/decorator-pattern/",
        note: "A careful look at implementing the GoF pattern in Python, and how it differs from Python's built-in @decorator syntax for functions.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "decorator-q1",
        question: "What is the intent of the Decorator pattern?",
        options: [
          { id: "a", label: "Attach new behavior to an object by placing it inside wrapper objects that share its interface." },
          { id: "b", label: "Ensure a class has exactly one instance with a global access point." },
          { id: "c", label: "Convert one interface into another so incompatible classes can work together." },
          { id: "d", label: "Build a complex object step by step with a fluent builder." },
        ],
        correctOptionId: "a",
        explanation:
          "Decorator wraps an object in layers that implement the same interface; each layer adds its own behavior and delegates the rest. Option (b) is Singleton, (c) is Adapter, (d) is Builder.",
      },
      {
        id: "decorator-q2",
        question: "Why can `Milk` wrap `Mocha`, which wraps `Espresso` — and the caller never notices?",
        options: [
          { id: "a", label: "Because every wrapper implements the same `Coffee` interface as the object it wraps, so a decorated stack looks exactly like a plain `Coffee`." },
          { id: "b", label: "Because `Milk` and `Mocha` are subclasses of `Espresso`." },
          { id: "c", label: "Because the wrappers copy all of `Espresso`'s fields into themselves." },
          { id: "d", label: "Because the language merges the classes together at compile time." },
        ],
        correctOptionId: "a",
        explanation:
          "The shared interface is the whole trick. A wrapper *is a* `Coffee` and *holds a* `Coffee`, so wrappers stack on wrappers freely, and callers just see one `Coffee`. They don't subclass `Espresso` — they wrap whatever `Coffee` they're given.",
      },
      {
        id: "decorator-q3",
        question: "A café has 4 optional add-ons. Covering every combination with plain subclasses vs. decorators takes how many classes?",
        options: [
          { id: "a", label: "16 subclasses (2⁴, one per combination) vs. just 4 decorator classes." },
          { id: "b", label: "4 subclasses vs. 16 decorators." },
          { id: "c", label: "8 subclasses vs. 8 decorators — it's always equal." },
          { id: "d", label: "1 subclass vs. 1 decorator." },
        ],
        correctOptionId: "a",
        explanation:
          "Every subset of 4 add-ons would need its own subclass: 2⁴ = 16. With Decorator you write one small wrapper per add-on — 4 classes — and compose any of the 16 combinations at runtime by stacking. A 5th add-on makes it 32 vs. 5.",
      },
      {
        id: "decorator-q4",
        question: "You call `cost()` on `new Whip(new Milk(new Espresso()))`. What actually happens?",
        options: [
          { id: "a", label: "The call delegates inward (Whip → Milk → Espresso); Espresso returns $2.50, then Milk adds $0.50 and Whip adds $0.70 on the way back out — $3.70 total." },
          { id: "b", label: "Only Whip's cost is returned, because it's the outermost object." },
          { id: "c", label: "Espresso adds the milk and whip prices itself, since it knows its toppings." },
          { id: "d", label: "The three objects each return their price to the caller, which must sum them manually." },
        ],
        correctOptionId: "a",
        explanation:
          "Each wrapper calls `cost()` on what it wraps, then adds its own piece to the returned value. The call unwinds through the layers and the caller gets one final number — it never knows how many layers were involved.",
      },
      {
        id: "decorator-q5",
        question: "Which of these is a real drawback of Decorator?",
        options: [
          { id: "a", label: "The decorated object is a different object from the core, so identity checks (`order === espresso`) and `instanceof Espresso` checks fail on the wrapped stack." },
          { id: "b", label: "It forces you to write one subclass for every combination of features." },
          { id: "c", label: "Behavior can never be changed at runtime once decorated." },
          { id: "d", label: "It only works in dynamically typed languages." },
        ],
        correctOptionId: "a",
        explanation:
          "Wrapping creates a new object around the core, so identity and concrete-type checks no longer see the original. That, plus many small look-alike objects, order sensitivity, and the difficulty of removing a middle layer, are the classic costs. Option (b) is the problem Decorator *solves*.",
      },
    ],
  },
};
