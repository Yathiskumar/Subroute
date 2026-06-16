import type { RoadmapLesson } from "@/lib/content/types";

export const polymorphism: RoadmapLesson = {
  title: "Polymorphism",
  oneLiner:
    "One interface, many forms — the same method call does the right thing for each object's actual type, with no type-checking in the caller.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/polymorphism.html",
  content: {
    prototypeCaption:
      "A row of mixed **Shape** objects. **Click any shape** to call `shape.area()` on it — the dispatch bar shows the *same* call routing to that shape's *own* implementation (`Circle.area()`, `Square.area()`, …). Flip the toggle to `perimeter()` and click again — same idea, different method. Or press **Run on all** for the whole polymorphic loop. The caller never checks the type.",

    overview: [
      {
        type: "p",
        text: "**Polymorphism** means *many forms*. The idea: you call **one** method by name, and each object responds in its own way — based on what it actually *is*. The caller doesn't need to know, or ask, which kind of object it's holding. It just says \"do the thing,\" and the right behavior runs.",
      },
      {
        type: "p",
        text: "Think of a **play** button. Press it on a song and you hear audio; press it on a video and you see frames; press it on a podcast and the episode resumes. Same button, same word — *play* — but the behavior fits whatever media is loaded. Or imagine handing a stack of different shapes to someone and asking each one, \"what's your `area()`?\" A circle uses πr², a square uses s², a triangle uses ½bh — and you, the asker, never had to know the formula. Each shape knows its own.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Write the call **once** against a shared interface; let each object supply its **own** version of the method. The same line of code, `s.area()`, runs different behavior depending on the object's *real* type.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Runtime polymorphism: overriding and dynamic dispatch" },
      {
        type: "p",
        text: "The kind that matters most in object-oriented design is **runtime** (or *subtype*) polymorphism. You define a shared base — an interface or abstract class — that declares a method like `area()`. Then each subtype **overrides** it with its own implementation. When you call `shape.area()`, the language looks at the object's *actual* type at runtime and picks the matching method. That lookup is called **dynamic dispatch**.",
      },
      {
        type: "p",
        text: "The crucial part: the variable's *declared* type can be the general one (`Shape`), but the *behavior* that runs is the specific one (`Circle.area`, `Square.area`). One call site, many possible behaviors, resolved while the program runs.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "shapes.ts",
        code: `interface Shape {
  area(): number; // the shared promise — every shape can do this
}

class Circle implements Shape {
  constructor(private r: number) {}
  area() { return Math.PI * this.r ** 2; } // its own formula
}

class Square implements Shape {
  constructor(private s: number) {}
  area() { return this.s ** 2; } // a different formula
}

const shapes: Shape[] = [new Circle(5), new Square(4)];
for (const s of shapes) {
  console.log(s.area()); // SAME call — dynamic dispatch picks the right one
}`,
      },
      { type: "h", text: "The killer benefit: delete the type switch" },
      {
        type: "p",
        text: "The whole payoff is replacing a sprawling `if`/`switch`-on-type with a single polymorphic call. Look at the *before*: the caller has to know every shape and its formula, and you must edit it every time a new shape appears.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "before-vs-after.ts",
        code: `// BEFORE — the caller switches on a type tag (fragile)
function area(shape: any): number {
  switch (shape.kind) {
    case "circle":    return Math.PI * shape.r ** 2;
    case "square":    return shape.s ** 2;
    case "triangle":  return 0.5 * shape.b * shape.h;
    // add a new shape? you MUST come back and edit this switch.
    default: throw new Error("unknown shape");
  }
}

// AFTER — one polymorphic call; the caller knows nothing about types
function totalArea(shapes: Shape[]): number {
  return shapes.reduce((sum, s) => sum + s.area(), 0); // that's it
}`,
      },
      {
        type: "p",
        text: "The *after* version never names a concrete shape. Add a `Hexagon` that implements `Shape`, and `totalArea` keeps working untouched. That's the **open/closed principle** in one breath: your code is open to new shapes, closed to modification.",
      },
      { type: "h", text: "The wider landscape (so you know the words)" },
      {
        type: "ul",
        items: [
          "**Runtime / subtype** polymorphism — overriding + dynamic dispatch, the one above. This is what people usually mean in OOP design.",
          "**Compile-time** polymorphism (*overloading*) — several methods share a name but differ by their parameters, e.g. `add(int, int)` vs `add(double, double)`. The compiler picks which one based on the arguments; nothing is decided at runtime.",
          "**Parametric** polymorphism (*generics / templates*) — one piece of code works for many types without caring which, e.g. `List<T>` or `Box<T>`. The *same* logic, parameterized by type.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Dynamic dispatch in one line",
        text: "When you write `s.area()`, the method that runs is chosen by `s`'s **actual** type at runtime — not by the variable's declared type. That single rule is what makes the polymorphic loop possible.",
      },
    ],

    handsOn: [
      {
        title: "01 · Click each shape",
        body: "Click a Circle, then a Square, then a Triangle. The **dispatch bar** keeps showing the *same* call `shape.area()` on the left, but the right side changes — `Circle.area()`, `Square.area()`, `Triangle.area()`. One call site, a different method body each time. That's dynamic dispatch.",
      },
      {
        title: "02 · Flip the method, click again",
        body: "Toggle the call from `area()` to **`perimeter()`** and click the shapes again. Every shape answers the *new* call in its own way — `2·π·r`, `4·s`, `3·s`. Same interface, many forms: the whole point of polymorphism.",
      },
      {
        title: "03 · Add a shape — open/closed",
        body: "Click **+ Add shape** to drop a new type into the row, then click it (or press **Run on all**). It just works — the caller has zero `if (circle)` or `switch (kind)` to update. New behavior, no caller edits: the open/closed payoff.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "shapes.ts",
        code: `// One interface, many implementations. Pick your language above.
interface Shape {
  area(): number;
}

class Circle implements Shape {
  constructor(private r: number) {}
  area(): number { return Math.PI * this.r ** 2; }
}

class Square implements Shape {
  constructor(private s: number) {}
  area(): number { return this.s ** 2; }
}

// No type checks: one polymorphic call for every shape.
function totalArea(shapes: Shape[]): number {
  return shapes.reduce((sum, s) => sum + s.area(), 0);
}

const shapes: Shape[] = [new Circle(5), new Square(4)];
console.log(totalArea(shapes)); // 78.54 + 16 = 94.54`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Shapes.java",
        code: `// One interface, many implementations. Pick your language above.
import java.util.List;

interface Shape {
    double area();
}

class Circle implements Shape {
    private final double r;
    Circle(double r) { this.r = r; }
    public double area() { return Math.PI * r * r; }
}

class Square implements Shape {
    private final double s;
    Square(double s) { this.s = s; }
    public double area() { return s * s; }
}

class Geometry {
    // No instanceof, no switch: one polymorphic call.
    static double totalArea(List<Shape> shapes) {
        double sum = 0;
        for (Shape s : shapes) sum += s.area(); // dynamic dispatch
        return sum;
    }
}

// totalArea(List.of(new Circle(5), new Square(4))) → 94.54`,
      },
      {
        label: "Python",
        language: "python",
        filename: "shapes.py",
        code: `# One interface, many implementations. Pick your language above.
from abc import ABC, abstractmethod
from math import pi


class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...


class Circle(Shape):
    def __init__(self, r: float):
        self.r = r

    def area(self) -> float:
        return pi * self.r ** 2


class Square(Shape):
    def __init__(self, s: float):
        self.s = s

    def area(self) -> float:
        return self.s ** 2


# Duck typing: anything with .area() works — no type checks.
def total_area(shapes) -> float:
    return sum(s.area() for s in shapes)


print(total_area([Circle(5), Square(4)]))  # 78.54 + 16 = 94.54`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "shapes.cpp",
        code: `// One interface, many implementations. Pick your language above.
#include <vector>
#include <memory>

struct Shape {
    virtual double area() const = 0;   // pure virtual = interface
    virtual ~Shape() = default;
};

struct Circle : Shape {
    double r;
    explicit Circle(double r) : r(r) {}
    double area() const override { return 3.14159265 * r * r; }
};

struct Square : Shape {
    double s;
    explicit Square(double s) : s(s) {}
    double area() const override { return s * s; }
};

// Base reference + virtual call = dynamic dispatch. No type checks.
double totalArea(const std::vector<std::unique_ptr<Shape>>& shapes) {
    double sum = 0;
    for (const auto& s : shapes) sum += s->area();
    return sum;
}

// build a vector of Circle/Square, call totalArea → 94.54`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for polymorphism when…" },
      {
        type: "ul",
        items: [
          "You catch yourself writing a `switch` or `if`-chain on a **type tag** (`if (kind === \"circle\")`). That's the textbook smell — each branch wants to become an overridden method.",
          "You have a family of things that *do the same job differently* — shapes with `area()`, payment methods with `charge()`, exporters with `write()`.",
          "You expect **new variants** over time and don't want every addition to ripple through caller code.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Where this is heading",
        text: "Polymorphism is the engine behind whole design patterns. The **Strategy** pattern swaps interchangeable algorithms behind one interface; the **State** pattern lets an object change behavior when its internal state changes. Both are polymorphism with a name and a purpose — you'll meet them soon.",
      },
    ],

    tradeoffs: {
      pros: [
        "Extensible by default: add a new subtype without touching existing callers (open/closed).",
        "Deletes type switches — no `if`/`switch`-on-kind scattered across the codebase.",
        "Callers stay clean and general: they program to the interface, not to concrete types.",
        "Each behavior lives next to the data it needs, so related logic is in one place.",
      ],
      cons: [
        "Indirection can hide control flow — \"jump to definition\" lands on an interface, not the code that actually runs.",
        "Overusing it: a tiny one-off conditional doesn't need a class hierarchy and three new files.",
        "LSP violations — an override that does something surprising (throws, no-ops, changes the contract) breaks callers that trusted the interface.",
        "Too many thin subtypes can fragment logic, making the whole behavior hard to see at a glance.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Polymorphism",
        href: "https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html",
        note: "The classic Java tutorial showing overriding and dynamic dispatch with a clean example.",
        kind: "docs",
      },
      {
        label: "MDN — extends",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends",
        note: "How subclassing and method overriding work in JavaScript, with runnable examples.",
        kind: "docs",
      },
      {
        label: "Refactoring.Guru — Replace Conditional with Polymorphism",
        href: "https://refactoring.guru/replace-conditional-with-polymorphism",
        note: "A step-by-step refactoring that turns a type switch into overridden methods — the killer benefit in practice.",
        kind: "article",
      },
      {
        label: "Wikipedia — Polymorphism (computer science)",
        href: "https://en.wikipedia.org/wiki/Polymorphism_(computer_science)",
        note: "A map of the whole landscape: subtype, parametric, and ad-hoc (overloading) polymorphism.",
        kind: "article",
      },
      {
        label: "Wikipedia — Dynamic dispatch",
        href: "https://en.wikipedia.org/wiki/Dynamic_dispatch",
        note: "The mechanism that picks the right method at runtime — the engine under subtype polymorphism.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "po-q1",
        question:
          "In a loop that calls `s.area()` on a list of mixed Shape objects, what decides which `area()` actually runs?",
        options: [
          { id: "a", label: "The declared type of the variable `s` (always Shape)." },
          { id: "b", label: "The object's actual runtime type — dynamic dispatch picks its `area()`." },
          { id: "c", label: "A `switch` statement inside the loop." },
          { id: "d", label: "The order the shapes were added to the list." },
        ],
        correctOptionId: "b",
        explanation:
          "Subtype polymorphism uses dynamic dispatch: the method chosen depends on the object's real type at runtime, not on the variable's declared type. The same call runs Circle.area for a circle, Square.area for a square.",
      },
      {
        id: "po-q2",
        question:
          "What is the main advantage of replacing a `switch`-on-type with a polymorphic method call?",
        options: [
          { id: "a", label: "It always runs faster than a switch." },
          { id: "b", label: "It uses less memory." },
          { id: "c", label: "Adding a new type needs no changes to the caller (open/closed)." },
          { id: "d", label: "It removes the need for any classes." },
        ],
        correctOptionId: "c",
        explanation:
          "With polymorphism the caller programs to the interface and never names concrete types, so a new subtype slots in without editing existing caller code — open to extension, closed to modification.",
      },
      {
        id: "po-q3",
        question: "Which of these is compile-time (ad-hoc) polymorphism rather than runtime polymorphism?",
        options: [
          { id: "a", label: "Overriding `area()` in Circle and Square." },
          { id: "b", label: "Method overloading: `add(int, int)` vs `add(double, double)`." },
          { id: "c", label: "Calling `s.area()` through a base reference." },
          { id: "d", label: "Dynamic dispatch choosing a subtype's method." },
        ],
        correctOptionId: "b",
        explanation:
          "Overloading is resolved by the compiler from the argument types — that's compile-time (ad-hoc) polymorphism. Overriding and dynamic dispatch are resolved at runtime (subtype polymorphism).",
      },
      {
        id: "po-q4",
        question:
          "A new `Triangle` subtype overrides `area()` but secretly returns 0 and logs a warning instead of the real area. Why is that a problem?",
        options: [
          { id: "a", label: "It makes the code compile slower." },
          { id: "b", label: "It violates the contract callers rely on (an LSP-style violation)." },
          { id: "c", label: "It forces every caller to add a type check." },
          { id: "d", label: "It is fine — overrides can do anything they want." },
        ],
        correctOptionId: "b",
        explanation:
          "Polymorphism works only if every subtype honors the interface's promise. An override that quietly breaks the contract (returns a wrong/surprising value) breaks the callers that trusted `Shape.area()` — a Liskov Substitution Principle violation.",
      },
    ],
  },
};
