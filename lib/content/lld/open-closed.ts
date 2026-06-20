import type { RoadmapLesson } from "@/lib/content/types";

export const openClosed: RoadmapLesson = {
  title: "Open/Closed Principle (OCP)",
  oneLiner:
    "The 'O' in SOLID: your code should be open for extension but closed for modification — you add new behaviour by writing a new class, not by editing (and risking) the code that already works.",
  difficulty: "beginner",
  estimatedTime: "16 min",
  prototypePath: "/prototypes/lld/open-closed.html",
  content: {
    prototypeCaption:
      "One feature — *add a new shape* — built two ways, side by side. Click **Add Hexagon** (or any new shape) and watch what each design forces you to do. In **Closed design (switch)**, the new shape makes you reopen and edit the one central `switch`: the edited line flashes in the danger colour, a *modified existing code ✗* badge appears, and the *files you had to touch* counter climbs. In **Open design (interface)**, the same shape just drops in as a brand-new class card in green — *existing code untouched ✓* — and the touched-files counter only ever shows the one new file. A single fixed note panel narrates each add and the contrast; nothing scrolls or piles up.",

    overview: [
      {
        type: "p",
        text: "The **Open/Closed Principle** is the *O* in SOLID. It says: software should be **open for extension** but **closed for modification**. In plain words — when a new requirement shows up, you should be able to add new behaviour by writing *new* code, without going back and editing the code that already works.",
      },
      {
        type: "p",
        text: "Think of the **power sockets** in your house. When you buy a new lamp, a toaster, or a phone charger, you just plug it in. You don't rewire the wall, and you don't risk breaking the fridge that's already plugged in next to it. The socket is a fixed, stable *contract*; any appliance that fits the plug works. Your code wants the same shape: a stable socket (an interface) that new things plug into, so adding a toaster never means cutting into the wall.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "**Open for extension, closed for modification** — add new behaviour by writing a *new* class that plugs into a stable interface, instead of editing old, tested code.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The smell: a switch you have to edit every single time" },
      {
        type: "p",
        text: "OCP is easiest to understand by its *violation*. Picture an `AreaCalculator` that computes the area of shapes. A beginner writes one method with a big `switch` (or a chain of `if/else`) on the shape's type:",
      },
      {
        type: "ul",
        items: [
          "`if (shape.type === \"circle\")` → use the circle formula.",
          "`else if (shape.type === \"rectangle\")` → use the rectangle formula.",
          "`else if (shape.type === \"triangle\")` → use the triangle formula.",
        ],
      },
      {
        type: "p",
        text: "It works today. But what happens when product asks for a **hexagon**? You have to *open up* `AreaCalculator` and add another branch. The same thing happens for a discount calculator that switches on customer type (`new`, `regular`, `vip`), or a renderer that switches on file type. Every new variant means editing one central, growing method — code that was already written, already tested, already shipped. That editing is exactly the *modification* OCP wants you to avoid.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Why editing working code is the real cost",
        text: "Every time you reopen a tested method to add a branch, you risk a typo, a missed case, or a regression in the cases that already worked. You also have to re-test *all* of them, not just the new one. A long `switch` on a type is the classic fingerprint of an OCP violation.",
      },
      { type: "h", text: "The fix: an interface, and one new class per variant" },
      {
        type: "p",
        text: "Polymorphism turns the `switch` inside-out. Instead of one calculator that knows about every shape, you define a small **interface** — `Shape` with an `area()` method — and let *each shape* implement it. `Circle.area()` knows the circle formula, `Rectangle.area()` knows its own, and so on. The calculator no longer asks *“what type are you?”*; it just calls `shape.area()` and trusts each shape to answer.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 470" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Before and after of the Open/Closed Principle. On the left, a single AreaCalculator class contains a switch on shape type with a branch for circle, rectangle, and triangle; adding a hexagon forces editing this class. On the right, a Shape interface with an area method is implemented by separate Circle, Rectangle and Triangle classes, and a new Hexagon class plugs in without touching any existing class.">
  <defs>
    <marker id="ocp-arrow" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="ocp-tri" markerUnits="userSpaceOnUse" markerWidth="15" markerHeight="13" refX="13" refY="6" orient="auto"><path d="M1,1 L13,6 L1,11 Z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <!-- ===== column headings ===== -->
  <text x="180" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="#fb863a">BEFORE · must edit on every new shape</text>
  <text x="540" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="#e8e4dc">AFTER · new shape just plugs in</text>

  <!-- divider -->
  <line x1="360" y1="36" x2="360" y2="450" stroke="#2d333d" stroke-width="1" stroke-dasharray="4 5"/>

  <!-- ===== BEFORE: one class with a switch ===== -->
  <rect x="40" y="48" width="280" height="300" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)" stroke-width="1.6"/>
  <text x="180" y="74" text-anchor="middle" font-size="13" font-weight="600" fill="#e8e4dc">AreaCalculator</text>
  <line x1="40" y1="86" x2="320" y2="86" stroke="#2d333d" stroke-width="1"/>
  <text x="58" y="112" font-size="11.5" fill="#9099a8">area(shape):</text>
  <g font-size="11.5">
    <text x="70" y="140"><tspan fill="#9099a8">switch (shape.type) {</tspan></text>
    <text x="84" y="166"><tspan fill="#e8e4dc">case </tspan><tspan fill="#fb863a">circle</tspan><tspan fill="#e8e4dc">:    …</tspan></text>
    <text x="84" y="192"><tspan fill="#e8e4dc">case </tspan><tspan fill="#fb863a">rectangle</tspan><tspan fill="#e8e4dc">: …</tspan></text>
    <text x="84" y="218"><tspan fill="#e8e4dc">case </tspan><tspan fill="#fb863a">triangle</tspan><tspan fill="#e8e4dc">:  …</tspan></text>
    <text x="84" y="244"><tspan fill="#6b7280">case hexagon:  … </tspan><tspan fill="#fb863a">← you must add this</tspan></text>
    <text x="70" y="270"><tspan fill="#9099a8">}</tspan></text>
  </g>
  <!-- edit-warning box -->
  <rect x="58" y="290" width="244" height="42" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)" stroke-width="1.2"/>
  <text x="180" y="308" text-anchor="middle" font-size="10.5" fill="#fb863a">✗ reopen + re-test working code</text>
  <text x="180" y="324" text-anchor="middle" font-size="10.5" fill="#9099a8">every new shape edits this one class</text>

  <!-- ===== AFTER: interface + implementers ===== -->
  <!-- Shape interface -->
  <rect x="455" y="48" width="170" height="64" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="540" y="70" text-anchor="middle" font-size="10.5" fill="#9099a8">«interface»</text>
  <text x="540" y="88" text-anchor="middle" font-size="13" font-weight="600" fill="#e8e4dc">Shape</text>
  <line x1="455" y1="96" x2="625" y2="96" stroke="#2d333d" stroke-width="1"/>
  <text x="540" y="109" text-anchor="middle" font-size="11" fill="#fb863a">+ area()</text>

  <!-- three implementers -->
  <g>
    <rect x="392" y="180" width="100" height="40" rx="5" fill="#14161a" stroke="#3a414c" stroke-width="1.3"/>
    <text x="442" y="204" text-anchor="middle" font-size="11.5" fill="#e8e4dc">Circle</text>
    <rect x="500" y="180" width="100" height="40" rx="5" fill="#14161a" stroke="#3a414c" stroke-width="1.3"/>
    <text x="550" y="204" text-anchor="middle" font-size="11.5" fill="#e8e4dc">Rectangle</text>
    <rect x="608" y="180" width="100" height="40" rx="5" fill="#14161a" stroke="#3a414c" stroke-width="1.3"/>
    <text x="658" y="204" text-anchor="middle" font-size="11.5" fill="#e8e4dc">Triangle</text>
  </g>

  <!-- realization arrows (implementers up to interface) -->
  <g stroke="#9099a8" stroke-width="1.2" fill="none" stroke-dasharray="4 4" marker-end="url(#ocp-tri)">
    <path d="M442,180 L442,140 L530,140 L530,114"/>
    <path d="M550,180 L550,114"/>
    <path d="M658,180 L658,140 L550,140"/>
  </g>

  <!-- new Hexagon class plugging in -->
  <rect x="500" y="290" width="100" height="40" rx="5" fill="#14161a" stroke="#5cc66f" stroke-width="1.6"/>
  <text x="550" y="314" text-anchor="middle" font-size="11.5" fill="#5cc66f">Hexagon</text>
  <path d="M550,290 L550,250 L540,250 L540,114" stroke="#5cc66f" stroke-width="1.3" fill="none" stroke-dasharray="4 4" marker-end="url(#ocp-tri)"/>
  <rect x="432" y="346" width="236" height="40" rx="5" fill="rgba(92,198,111,0.12)" stroke="#5cc66f" stroke-width="1.2"/>
  <text x="550" y="364" text-anchor="middle" font-size="10.5" fill="#5cc66f">✓ new class only — nothing else touched</text>
  <text x="550" y="380" text-anchor="middle" font-size="10.5" fill="#9099a8">old shapes never reopened</text>

  <!-- caption row under both -->
  <text x="180" y="370" text-anchor="middle" font-size="10.5" fill="#6b7280">closed against new shapes? no.</text>
  <text x="180" y="386" text-anchor="middle" font-size="10.5" fill="#6b7280">it must change for each one.</text>
</svg>`,
        caption:
          "**Before**: one `AreaCalculator` with a `switch` — every new shape means *reopening* that class and re-testing it. **After**: a stable `Shape` interface with an `area()` method; `Circle`, `Rectangle`, and `Triangle` each implement it, and a brand-new `Hexagon` *plugs in* as its own class (green) without touching a single existing one. The dashed triangle arrows mean *“implements the interface.”*",
      },
      { type: "h", text: "Adding a variant becomes purely additive" },
      {
        type: "p",
        text: "Now watch what *adding a hexagon* looks like. You write a new `Hexagon` class that implements `Shape`, give it its own `area()`, and register it. That's it. You did **not** open `AreaCalculator`, you did not edit `Circle` or `Rectangle`, and the cases that already worked stay byte-for-byte the same. The system grew by *addition*, not *modification* — that is OCP working.",
      },
      { type: "h", text: "This is the Strategy pattern in disguise" },
      {
        type: "p",
        text: "The mechanism above — *“program to an interface, and swap in a new implementation to get new behaviour”* — is exactly the **Strategy pattern**. Each `Shape` is a strategy for computing area; each payment method is a strategy for charging; each sort order is a strategy for comparing. Strategy is the everyday tool you reach for to satisfy OCP: it gives you the stable seam (the interface) that new behaviour plugs into. Many design patterns (Strategy, Template Method, Decorator, Observer) exist precisely to make OCP achievable.",
      },
      {
        type: "callout",
        variant: "info",
        title: "“Closed” is never absolute — pick the axis you close against",
        text: "You can't make code closed against *every* possible change. The skill is choosing the **axis of change you anticipate** and closing against that. If new *shapes* arrive often, put the seam there (a `Shape` interface). If new shapes never change but the *output format* does, the seam belongs elsewhere. Close against the change you actually expect — not against everything.",
      },
    ],

    handsOn: [
      {
        title: "01 · Add a shape the painful way",
        body: "Start in the prototype's **Closed design (switch)** mode. Click **Add Hexagon**. Watch the central `switch` light up: a new `case` line appears highlighted in the danger colour, a *modified existing code ✗* badge shows, and the *files you had to touch* counter ticks up. You just reopened tested code to add one shape — read the note panel to see why that's the cost OCP avoids.",
      },
      {
        title: "02 · Add the same shape the OCP way",
        body: "Flip to **Open design (interface)** mode and click **Add Hexagon** again. This time a brand-new `Hexagon` class card drops in (green), the badge reads *existing code untouched ✓*, and the touched-files counter only ever counts the one new file. Same feature, but no existing code was reopened. Compare the two counters side by side.",
      },
      {
        title: "03 · Add three more and watch the gap grow",
        body: "Add a Pentagon, then a Star, then an Ellipse in *both* modes. In closed mode the `switch` keeps growing and the touched-files count keeps climbing — every shape reopens the same file. In open mode each shape is just one more independent card and the existing ones are never touched. That widening gap *is* the value of OCP: change by addition, not by modification.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "shapes.ts",
        code: `// BEFORE — one calculator with a switch you must EDIT for every new shape.
type Shape = { type: "circle" | "rectangle"; r?: number; w?: number; h?: number };

class AreaCalculator {
  area(s: Shape): number {
    switch (s.type) {                         // grows on every new shape ✗
      case "circle":    return Math.PI * s.r! * s.r!;
      case "rectangle": return s.w! * s.h!;
      // case "triangle": ... ← you must reopen this file to add it
      default: throw new Error("unknown shape");
    }
  }
}

// AFTER — a stable interface; each shape owns its own area().
interface IShape {
  area(): number;
}

class Circle implements IShape {
  constructor(private r: number) {}
  area() { return Math.PI * this.r * this.r; }
}

class Rectangle implements IShape {
  constructor(private w: number, private h: number) {}
  area() { return this.w * this.h; }
}

// The calculator never asks "what type?" — it just trusts the interface.
function totalArea(shapes: IShape[]): number {
  return shapes.reduce((sum, s) => sum + s.area(), 0);  // closed for modification
}

// ADDING A NEW SHAPE = purely additive. No existing class is touched.
class Triangle implements IShape {
  constructor(private base: number, private height: number) {}
  area() { return 0.5 * this.base * this.height; }
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Shapes.java",
        code: `// BEFORE — one calculator with a switch you must EDIT for every new shape.
class AreaCalculatorBad {
    double area(String type, double a, double b) {
        switch (type) {                          // grows on every new shape ✗
            case "circle":    return Math.PI * a * a;
            case "rectangle": return a * b;
            // case "triangle": ... ← reopen this file to add it
            default: throw new IllegalArgumentException("unknown shape");
        }
    }
}

// AFTER — a stable interface; each shape owns its own area().
interface Shape {
    double area();
}

class Circle implements Shape {
    private final double r;
    Circle(double r) { this.r = r; }
    public double area() { return Math.PI * r * r; }
}

class Rectangle implements Shape {
    private final double w, h;
    Rectangle(double w, double h) { this.w = w; this.h = h; }
    public double area() { return w * h; }
}

// The calculator just trusts the interface — closed for modification.
class AreaCalculator {
    double total(java.util.List<Shape> shapes) {
        return shapes.stream().mapToDouble(Shape::area).sum();
    }
}

// ADDING A NEW SHAPE = purely additive. No existing class is touched.
class Triangle implements Shape {
    private final double base, height;
    Triangle(double base, double height) { this.base = base; this.height = height; }
    public double area() { return 0.5 * base * height; }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "shapes.py",
        code: `# BEFORE — one calculator with an if/elif you must EDIT for every new shape.
import math


class AreaCalculatorBad:
    def area(self, shape):
        if shape["type"] == "circle":          # grows on every new shape ✗
            return math.pi * shape["r"] ** 2
        elif shape["type"] == "rectangle":
            return shape["w"] * shape["h"]
        # elif shape["type"] == "triangle": ... ← reopen this file to add it
        raise ValueError("unknown shape")


# AFTER — a stable interface; each shape owns its own area().
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...


class Circle(Shape):
    def __init__(self, r: float) -> None:
        self.r = r

    def area(self) -> float:
        return math.pi * self.r ** 2


class Rectangle(Shape):
    def __init__(self, w: float, h: float) -> None:
        self.w, self.h = w, h

    def area(self) -> float:
        return self.w * self.h


# The calculator just trusts the interface — closed for modification.
def total_area(shapes: list[Shape]) -> float:
    return sum(s.area() for s in shapes)


# ADDING A NEW SHAPE = purely additive. No existing class is touched.
class Triangle(Shape):
    def __init__(self, base: float, height: float) -> None:
        self.base, self.height = base, height

    def area(self) -> float:
        return 0.5 * self.base * self.height`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "shapes.cpp",
        code: `// BEFORE — one calculator with a switch you must EDIT for every new shape.
#include <vector>
#include <memory>
#include <numeric>
#include <cmath>

enum class Kind { Circle, Rectangle };

double areaBad(Kind k, double a, double b) {
    switch (k) {                                 // grows on every new shape ✗
        case Kind::Circle:    return M_PI * a * a;
        case Kind::Rectangle: return a * b;
        // case Kind::Triangle: ... ← reopen this file to add it
    }
    return 0;
}

// AFTER — a stable interface; each shape owns its own area().
struct Shape {
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

struct Circle : Shape {
    double r;
    explicit Circle(double r) : r(r) {}
    double area() const override { return M_PI * r * r; }
};

struct Rectangle : Shape {
    double w, h;
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
};

// The calculator just trusts the interface — closed for modification.
double totalArea(const std::vector<std::unique_ptr<Shape>>& shapes) {
    return std::accumulate(shapes.begin(), shapes.end(), 0.0,
        [](double sum, const auto& s) { return sum + s->area(); });
}

// ADDING A NEW SHAPE = purely additive. No existing class is touched.
struct Triangle : Shape {
    double base, height;
    Triangle(double base, double height) : base(base), height(height) {}
    double area() const override { return 0.5 * base * height; }
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to apply OCP" },
      {
        type: "p",
        text: "Reach for OCP at the **volatile points** of your system — the spots where new *variants* keep arriving. If you can finish the sentence *“we keep adding new kinds of ___”* (payment methods, report formats, notification channels, enemy types, discount rules, file parsers), that blank is begging for a stable interface and a class per variant. The tell-tale sign is a `switch`/`if-else` on a type that you find yourself editing release after release.",
      },
      {
        type: "p",
        text: "It's also the principle that makes **plugin architectures** possible: editors, browsers, and games stay closed (you don't recompile the core) yet open (anyone can add a plugin) because the core only talks to a fixed extension interface.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't add plug-in seams “just in case” (YAGNI)",
        text: "OCP has a dark twin: **speculative over-abstraction**. An interface, a factory, and three classes where one simple function would do is *worse* code, not better — it's harder to read and you may have guessed the wrong axis of change. Add the seam when the *second* variant actually shows up (or when you genuinely know it's coming). A `switch` with two stable cases that never change is fine. Abstract the change you have, not the change you imagine.",
      },
    ],

    tradeoffs: {
      pros: [
        "New behaviour is added by writing a new class — existing, tested code is never reopened, so regressions are far less likely.",
        "Each variant lives in its own small, focused class instead of one giant growing method, so the code is easier to read and test in isolation.",
        "Enables plugin and extension architectures: the core stays stable while third parties add new behaviour against a fixed interface.",
        "Pairs naturally with patterns you already know (Strategy, Template Method, Decorator), giving you a clear, named tool for the job.",
      ],
      cons: [
        "Adds indirection — an interface plus several classes is more moving parts than one switch, which can feel heavier for tiny, stable cases.",
        "You have to guess the right axis of change up front; close against the wrong axis and the abstraction gets in the way instead of helping.",
        "Over-applied, it leads to speculative abstraction (interfaces and factories everywhere) that violates YAGNI and hurts readability.",
        "Logic for one operation is now spread across many files, so following a single calculation can mean jumping between classes.",
      ],
    },

    furtherReading: [
      {
        label: "Open–closed principle — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle",
        note: "The concise reference: covers Meyer's original inheritance-based definition and the modern polymorphic (interface-based) interpretation, plus where the 'O' sits in SOLID.",
        kind: "docs",
      },
      {
        label: "The Open-Closed Principle — Robert C. Martin (Uncle Bob)",
        href: "https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html",
        note: "Uncle Bob's own essay. His framing — extend a system's behaviour without modifying it — and the plugin examples (Eclipse, Minecraft) make the principle click.",
        kind: "article",
      },
      {
        label: "Replace Conditional with Polymorphism — Refactoring.Guru",
        href: "https://refactoring.guru/replace-conditional-with-polymorphism",
        note: "The exact refactoring that takes you from a switch-on-type to one class per variant, with before/after code in several languages. This is OCP applied step by step.",
        kind: "docs",
      },
      {
        label: "The Open–Closed Principle — Baeldung",
        href: "https://www.baeldung.com/cs/open-closed-principle",
        note: "A clear, example-driven walkthrough that builds the violation and then the polymorphic fix. A good second read with concrete code.",
        kind: "article",
      },
      {
        label: "The Open Closed Principle (SOLID) — Christopher Okhravi",
        href: "https://www.youtube.com/watch?v=-ptUODVggHQ",
        note: "An energetic whiteboard explanation that draws the switch-to-polymorphism transformation live. Great if you learn better by watching someone reason through it.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "open-closed-q1",
        question: "What does the Open/Closed Principle actually say?",
        options: [
          { id: "a", label: "Software should be open for extension but closed for modification — add new behaviour without editing existing code." },
          { id: "b", label: "Classes should keep all their fields private and expose only public methods." },
          { id: "c", label: "Every class should have exactly one reason to change." },
          { id: "d", label: "Source files should always stay open in your editor while you refactor." },
        ],
        correctOptionId: "a",
        explanation:
          "OCP, the 'O' in SOLID, says entities should be open for extension (you can add new behaviour) but closed for modification (you don't reopen working code to do it). Option C describes the Single Responsibility Principle; option B describes encapsulation.",
      },
      {
        id: "open-closed-q2",
        question: "Which piece of code is the classic fingerprint of an OCP violation?",
        options: [
          { id: "a", label: "A growing switch/if-else on a type or enum that you must edit every time a new case appears." },
          { id: "b", label: "A class with a private field and a public getter." },
          { id: "c", label: "A function that takes its dependency as a constructor argument." },
          { id: "d", label: "A loop that calls the same method on every element of a list." },
        ],
        correctOptionId: "a",
        explanation:
          "A central switch (or if-else chain) on a type means every new variant forces you to reopen and re-test that method — modification, not extension. That growing conditional is the tell-tale smell OCP is meant to remove.",
      },
      {
        id: "open-closed-q3",
        question: "How does polymorphism let you satisfy OCP for the shapes example?",
        options: [
          { id: "a", label: "Define a Shape interface with area(); each shape implements its own area(), so a new shape is a new class and no existing code changes." },
          { id: "b", label: "Add more cases to the switch, but put each case in its own method." },
          { id: "c", label: "Make every field public so the calculator can read any shape directly." },
          { id: "d", label: "Cache the computed areas so the switch only runs once per shape." },
        ],
        correctOptionId: "a",
        explanation:
          "You turn the switch inside-out: a stable Shape interface with area(), and each shape implements it. The calculator just calls shape.area(). Adding a new shape means writing a new class — purely additive, with existing classes untouched.",
      },
      {
        id: "open-closed-q4",
        question: "Which design pattern is the everyday tool for achieving OCP by swapping in new implementations of an interface?",
        options: [
          { id: "a", label: "Strategy — program to an interface and plug in a new implementation to get new behaviour." },
          { id: "b", label: "Singleton — guarantee only one instance of a class exists." },
          { id: "c", label: "Adapter — make an incompatible interface usable through a wrapper." },
          { id: "d", label: "Facade — hide a complex subsystem behind one simple entry point." },
        ],
        correctOptionId: "a",
        explanation:
          "Strategy is exactly 'a stable interface that new behaviours plug into,' which is the seam OCP needs. Each shape, payment method, or sort order is a strategy. Singleton, Adapter, and Facade solve unrelated problems.",
      },
      {
        id: "open-closed-q5",
        question: "Your code already has a switch with two cases that have never changed and aren't expected to. What's the most sensible move?",
        options: [
          { id: "a", label: "Leave it as a simple switch — adding interfaces and classes 'just in case' is speculative over-abstraction (YAGNI)." },
          { id: "b", label: "Immediately extract an interface and one class per case to be safe." },
          { id: "c", label: "Add a third empty case now so the switch is ready for future growth." },
          { id: "d", label: "Make the switch closed against every conceivable future change." },
        ],
        correctOptionId: "a",
        explanation:
          "'Closed' is never absolute — you close against the axis of change you actually anticipate. If a switch is stable and not expected to grow, abstracting it adds indirection with no payoff. Add the seam when a real new variant arrives, not speculatively.",
      },
    ],
  },
};
