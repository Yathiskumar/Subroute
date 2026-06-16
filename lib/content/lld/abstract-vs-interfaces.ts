import type { RoadmapLesson } from "@/lib/content/types";

export const abstractVsInterfaces: RoadmapLesson = {
  title: "Abstract Classes vs Interfaces",
  oneLiner:
    "Both define contracts, but an abstract class is a shared partial base (state + some code, single inheritance) while an interface is a pure capability contract (no state, multiple allowed).",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/abstract-vs-interfaces.html",
  content: {
    prototypeCaption:
      "Two columns — **Abstract Class** and **Interface** — laid out side by side, each row showing what it *can* and *can't* do. Flip the **requirement toggles** on top to describe your situation, and watch the recommended column light up with a `→ use this` badge while the log explains *why*. Ask for shared state *and* mixing several contracts at once, and it tells you to combine both.",

    overview: [
      {
        type: "p",
        text: "**Abstract classes** and **interfaces** both let you declare a contract — a set of methods that subtypes must provide — without fully implementing them up front. Because they overlap so much, beginners often treat them as interchangeable. They aren't. The difference is about *what each one is allowed to carry* and *how many a class can take on*.",
      },
      {
        type: "p",
        text: "Picture a job description. An **abstract class** is like a *partly-trained employee*: they already share company knowledge and some habits (real code and stored state), and a new hire *becomes* one of them — you can only have one such base. An **interface** is like a *certification* — \"can drive\", \"can swim\" — a promise of a capability with no baggage attached, and you can hold many certifications at once across totally unrelated people.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Use an **abstract class** when subtypes *are a kind of* something and should share code and state. Use an **interface** when unrelated types just need to *promise the same capability*. Is-a → abstract class; can-do → interface.",
      },
    ],

    howItWorks: [
      { type: "h", text: "What an abstract class can carry" },
      {
        type: "p",
        text: "An abstract class sits halfway between a normal class and a pure contract. It *cannot* be instantiated on its own, but it can hold almost everything a regular class can:",
      },
      {
        type: "ul",
        items: [
          "**Fields / instance state** — it can store data, like a `name` or a cached value, that every subclass inherits.",
          "**A constructor** — it can run setup code when a subclass object is built (subclasses call `super(...)`).",
          "**Concrete methods** — fully written methods that all subclasses get for free, *plus* `abstract` methods that subclasses are forced to fill in.",
        ],
      },
      {
        type: "p",
        text: "The catch: in most languages a class can extend exactly **one** abstract class. You inherit a single base, so it's the right home for a shared identity plus shared machinery.",
      },
      { type: "h", text: "What an interface can carry" },
      {
        type: "p",
        text: "An interface is a leaner thing — a contract of method *signatures* with (classically) no bodies and no stored state. A class `implements` an interface by providing real code for every method it names. The superpower is multiplicity: a single class can implement **many** interfaces at once, mixing capabilities from completely unrelated contracts.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "contracts.ts",
        code: `// Interface: just the capability, no state, no constructor.
interface Drawable {
  draw(): void; // a signature — the WHAT, no HOW
}

// One class can promise MANY unrelated capabilities at once:
class Widget implements Drawable, Serializable, Clickable {
  draw() { /* ... */ }
  serialize() { /* ... */ }
  onClick() { /* ... */ }
}`,
      },
      {
        type: "p",
        text: "Modern languages blurred the line a little: since **Java 8**, interfaces can carry `default` methods (a shared body) and static methods — yet they *still* hold no instance state. **TypeScript** interfaces describe object shapes and are purely structural (they vanish at runtime). **Python** uses `abc.ABC` for abstract base classes and `Protocol` for interface-style structural typing. **C++** has no separate `interface` keyword at all — an interface there is just an abstract class whose methods are all *pure virtual* (`= 0`).",
      },
      { type: "h", text: "The decision rule" },
      {
        type: "p",
        text: "When both seem to fit, ask two questions. *Is there shared code or state every subtype should inherit, and is this an \"is-a\" relationship?* → reach for an **abstract class**. *Do unrelated types just need to advertise the same ability, with each writing its own version?* → reach for an **interface**. And when you need **both** — shared state *and* the freedom to mix several capabilities — the idiomatic answer is to combine them: an abstract base for the shared part, interfaces for each extra capability.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Why \"single base, many contracts\" matters",
        text: "Single inheritance keeps the shared-state story simple — there's exactly one base to reason about, so no ambiguity over whose `name` field you inherited. Interfaces sidestep that problem by carrying no state at all, which is *why* a language can safely let you implement as many as you like.",
      },
    ],

    handsOn: [
      {
        title: "01 · Read the comparison grid",
        body: "Before touching anything, scan the two columns. Notice where the badges differ: **holds state** and **constructor** are `✓` for the abstract class but `✗` for the interface, while **how many** reads `one` vs `many`. The row that's identical — **forces a contract** — is `✓` for both, which is exactly why they get confused.",
      },
      {
        title: "02 · Toggle a requirement and watch the pick",
        body: "Flip **I need to share common code** on. The **Abstract Class** column lights up with a `→ use this` badge and the log explains why — concrete methods live on a base, not on a pure interface. Now turn it off and flip **I just need a capability contract**; the recommendation jumps to the **Interface** column live.",
      },
      {
        title: "03 · Force the conflict",
        body: "Turn on **I need stored fields/state** *and* **one class must mix several of these** at the same time. No single tool wins — so the log advises the combined pattern: an *abstract base for the shared state* plus *interfaces for the extra capabilities*. That's the real-world answer when requirements pull both ways.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "shapes.ts",
        code: `// Abstract class: shared state + a concrete method + an abstract one.
abstract class Shape {
  constructor(protected name: string) {} // stored state + constructor

  describe(): string {                    // concrete — shared by all shapes
    return \`\${this.name} with area \${this.area().toFixed(2)}\`;
  }

  abstract area(): number;                // the WHAT — each shape fills in
}

// Interface: a pure capability contract, no state.
interface Drawable {
  draw(): void;
}

// Circle IS-A Shape (extends one base) and CAN-DO Drawable (implements).
class Circle extends Shape implements Drawable {
  constructor(private r: number) {
    super("circle");
  }
  area(): number {
    return Math.PI * this.r * this.r;
  }
  draw(): void {
    console.log(\`drawing \${this.describe()}\`);
  }
}

const c = new Circle(2);
console.log(c.describe()); // circle with area 12.57
c.draw();`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Shapes.java",
        code: `// Abstract class: shared state + a concrete method + an abstract one.
abstract class Shape {
    protected final String name;

    Shape(String name) {        // constructor — subclasses call super(...)
        this.name = name;       // stored state, inherited by every shape
    }

    String describe() {         // concrete — shared by all shapes
        return name + " with area " + String.format("%.2f", area());
    }

    abstract double area();     // the WHAT — each shape fills in
}

// Interface: a pure capability contract, no instance state.
interface Drawable {
    void draw();
}

// Circle IS-A Shape (extends one) and CAN-DO Drawable (implements many).
class Circle extends Shape implements Drawable {
    private final double r;

    Circle(double r) {
        super("circle");
        this.r = r;
    }

    double area() {
        return Math.PI * r * r;
    }

    public void draw() {
        System.out.println("drawing " + describe());
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "shapes.py",
        code: `# Abstract base class via abc; Protocol gives the interface contract.
from abc import ABC, abstractmethod
from math import pi
from typing import Protocol


class Shape(ABC):
    def __init__(self, name: str) -> None:
        self.name = name                       # stored state + constructor

    def describe(self) -> str:                 # concrete — shared by all
        return f"{self.name} with area {self.area():.2f}"

    @abstractmethod
    def area(self) -> float:                   # the WHAT — each fills in
        ...


class Drawable(Protocol):                      # interface-style contract
    def draw(self) -> None: ...


# Circle IS-A Shape (subclasses one ABC) and satisfies Drawable structurally.
class Circle(Shape):
    def __init__(self, r: float) -> None:
        super().__init__("circle")
        self.r = r

    def area(self) -> float:
        return pi * self.r * self.r

    def draw(self) -> None:
        print(f"drawing {self.describe()}")


c = Circle(2)
print(c.describe())  # circle with area 12.57
c.draw()`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "shapes.cpp",
        code: `// No "interface" keyword — an interface is an all-pure-virtual class.
#include <iostream>
#include <string>
#include <utility>

// Abstract class: stored state + a concrete method + a pure-virtual one.
class Shape {
protected:
    std::string name;
public:
    explicit Shape(std::string name) : name(std::move(name)) {} // ctor + state

    std::string describe() const {            // concrete — shared by all
        return name + " with area " + std::to_string(area());
    }

    virtual double area() const = 0;          // pure virtual — the WHAT
    virtual ~Shape() = default;
};

// Interface = a class with only pure-virtual methods, no state.
class Drawable {
public:
    virtual void draw() const = 0;
    virtual ~Drawable() = default;
};

// Circle IS-A Shape and CAN-DO Drawable (C++ allows multiple inheritance).
class Circle : public Shape, public Drawable {
    double r;
public:
    explicit Circle(double r) : Shape("circle"), r(r) {}

    double area() const override { return 3.14159265 * r * r; }
    void draw() const override {
        std::cout << "drawing " << describe() << "\\n";
    }
};

int main() {
    Circle c(2);
    std::cout << c.describe() << "\\n";
    c.draw();
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Picking between the two" },
      {
        type: "p",
        text: "Default to an **interface** — it's the looser, more composable choice, and types that share *nothing but a capability* can still implement it. Promote to an **abstract class** the moment you find yourself wanting to *share real code or stored state* across subtypes that genuinely form an \"is-a\" family. When both pulls are real at once, don't choose — use an abstract base for the shared part and layer interfaces on top for the mix-in capabilities.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't force an is-a where there's only a can-do",
        text: "Reaching for an abstract base just to share one helper method drags every subtype into a single inheritance line they may not belong in. If the types aren't truly the same *kind* of thing, an interface (or composition) keeps them free.",
      },
    ],

    tradeoffs: {
      pros: [
        "Reach for an **abstract class** when subtypes share an *is-a* relationship — a `Circle` and a `Square` are both genuinely a kind of `Shape`.",
        "Reach for an **abstract class** when you have *concrete code or stored state* every subtype should inherit, like a shared `name` field and a `describe()` method.",
        "Reach for an **abstract class** when you want a *constructor* to enforce valid setup for the whole family of subtypes.",
        "Reach for an **abstract class** when *single inheritance is fine* and you want one clear, central base to evolve over time.",
      ],
      cons: [
        "Reach for an **interface** when *unrelated types* need the same ability — a `FileButton` and a `Player` can both be `Clickable` without sharing a family.",
        "Reach for an **interface** when one class must *mix several capabilities* at once, since a class can implement many but extend only one.",
        "Reach for an **interface** when you want a *pure contract with no state* — just signatures callers can depend on, each type writing its own version.",
        "Reach for an **interface** when you're designing for *maximum flexibility and testing*, letting any type opt in to a capability without inheritance baggage.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Abstract Methods and Classes",
        href: "https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html",
        note: "The canonical Java tutorial on abstract classes, abstract methods, and when to choose them over an interface.",
        kind: "docs",
      },
      {
        label: "Oracle — Defining an Interface",
        href: "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html",
        note: "How interfaces work in Java, including default methods (Java 8) and implementing many at once.",
        kind: "docs",
      },
      {
        label: "Python docs — abc (Abstract Base Classes)",
        href: "https://docs.python.org/3/library/abc.html",
        note: "Declaring abstract bases in Python with abc.ABC and @abstractmethod — the abstract-class side of the comparison.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Interface (object-oriented programming)",
        href: "https://en.wikipedia.org/wiki/Interface_(object-oriented_programming)",
        note: "A language-agnostic overview of interfaces and how they relate to abstract classes across OOP languages.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "ai-q1",
        question:
          "Which capability belongs to an abstract class but NOT to a classic interface?",
        options: [
          { id: "a", label: "Declaring a method that subtypes must implement." },
          { id: "b", label: "Holding instance state (fields) and a constructor." },
          { id: "c", label: "Being used as a type for a variable." },
          { id: "d", label: "Forcing implementers to provide certain methods." },
        ],
        correctOptionId: "b",
        explanation:
          "Both can declare required methods and act as types. The distinguishing feature is that an abstract class can store instance state and run a constructor, while a classic interface holds no instance state.",
      },
      {
        id: "ai-q2",
        question:
          "A `Widget` needs to be drawable, serializable, and clickable — three unrelated capabilities. What's the natural fit?",
        options: [
          { id: "a", label: "Three abstract classes, extended together." },
          { id: "b", label: "One giant abstract class with all three jobs." },
          { id: "c", label: "Three interfaces, implemented by the one class." },
          { id: "d", label: "Nothing — a class can only have one capability." },
        ],
        correctOptionId: "c",
        explanation:
          "A class can implement many interfaces but extend only one base. Three independent capabilities map cleanly onto three interfaces the single Widget implements.",
      },
      {
        id: "ai-q3",
        question:
          "Since Java 8, interfaces can include `default` methods with real bodies. Does that make them the same as abstract classes?",
        options: [
          { id: "a", label: "No — interfaces still hold no instance state, and a class can implement many." },
          { id: "b", label: "Yes — default methods erase every difference." },
          { id: "c", label: "Yes — interfaces can now have constructors too." },
          { id: "d", label: "No — but only because default methods are rarely used." },
        ],
        correctOptionId: "a",
        explanation:
          "Default methods let interfaces share some code, but interfaces still carry no instance state and a class can still implement many of them. Those two facts keep them distinct from abstract classes.",
      },
      {
        id: "ai-q4",
        question:
          "You need subtypes to share a stored `name` field AND mix in several unrelated capabilities. What's the idiomatic design?",
        options: [
          { id: "a", label: "Pick one tool and live with its limitation." },
          { id: "b", label: "Use multiple abstract classes at once." },
          { id: "c", label: "Make every field public and skip contracts entirely." },
          { id: "d", label: "An abstract base for the shared state, plus interfaces for the extra capabilities." },
        ],
        correctOptionId: "d",
        explanation:
          "When requirements pull both ways, combine them: an abstract base holds the shared state and code (single inheritance), while interfaces add the mix-in capabilities a class can implement many of.",
      },
    ],
  },
};
