import type { RoadmapLesson } from "@/lib/content/types";

export const liskovSubstitution: RoadmapLesson = {
  title: "Liskov Substitution Principle (LSP)",
  oneLiner:
    "The 'L' in SOLID: if your code works with a base type, it must keep working when you hand it any subtype — no surprises, no broken promises. Inheritance has to preserve behaviour, not just shape.",
  difficulty: "intermediate",
  estimatedTime: "16 min",
  prototypePath: "/prototypes/lld/liskov-substitution.html",
  content: {
    prototypeCaption:
      "A **substitution test bench**. The caller code is fixed and you only change *which object you pass in*. In the **Rectangle vs Square** scenario the caller runs `setWidth(5); setHeight(4)` and expects `area == 20`. Pass a **Rectangle** and it passes (green, area 20). Pass a **Square** and watch its width-set *silently* also change its height — the expectation breaks (red, area 16). In the **Bird.fly()** scenario a `Sparrow` flies fine but a `Penguin` throws. The fixed explain panel names the exact rule that was broken in plain words, and a **Fixed design** view shows the corrected model where every substitute passes. Only one note shows at a time — nothing scrolls away or grows the page.",

    overview: [
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "If code works with a base type, it must keep working when given any subtype — **no surprises**.",
      },
      {
        type: "p",
        text: "The **Liskov Substitution Principle** (the *L* in **SOLID**) is about one promise: anywhere your code expects a *base* type, you should be able to drop in any *subtype* and the code keeps doing the right thing. The substitute behaves like what it claims to be. If swapping in a subclass quietly changes the result, throws an error the caller didn't expect, or does *less* than the base promised, you've broken LSP.",
      },
      {
        type: "p",
        text: "Think of a vending machine that takes any coin marked *“1 dollar.”* If someone slips in a fake that's the right size and weight but worth nothing, the machine still accepts it and your snack vanishes into a loss. The fake *looked like* a dollar (same shape) but didn't *behave like* one (same value). LSP says a subtype must be a real dollar — same shape **and** same behaviour — so the machine (your code) never gets a nasty surprise.",
      },
      {
        type: "p",
        text: "Barbara Liskov framed it in 1987 and it later became the third letter of SOLID. The key shift in thinking: inheritance isn't just *“this class has the same fields and methods.”* It's a *contract*. The subtype inherits the base's **promises**, and it must honour every one of them.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Two classic violation stories" },
      {
        type: "p",
        text: "The fastest way to feel LSP is to see it break. There are two stories every engineer should know by heart.",
      },
      {
        type: "p",
        text: "**Story 1 — the Rectangle and the Square.** In maths, a square *is a* rectangle, so it's tempting to write `class Square extends Rectangle`. A rectangle has independent `setWidth` and `setHeight`. But a square must keep all sides equal, so its `setWidth` *also* changes the height (and vice versa). Now picture a caller that was written for a plain rectangle:",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 620 340" width="100%" style="max-width:620px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A caller runs setWidth(5) then setHeight(4) and expects area to equal 20. For a Rectangle the width stays 5 and height becomes 4 so area is 20, which passes. For a Square, setWidth(5) makes both sides 5, then setHeight(4) makes both sides 4, so the box is 4 by 4 and the area is 16, which breaks the expectation of 20.">
  <defs>
    <marker id="lsp-arr" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <!-- caller code box -->
  <rect x="20" y="20" width="240" height="120" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="36" y="44" font-size="11" fill="#9099a8">the caller (written for a Rectangle)</text>
  <text x="36" y="72" font-size="12.5"><tspan fill="#e8e4dc">s.setWidth(</tspan><tspan fill="#fb863a">5</tspan><tspan fill="#e8e4dc">);</tspan></text>
  <text x="36" y="94" font-size="12.5"><tspan fill="#e8e4dc">s.setHeight(</tspan><tspan fill="#fb863a">4</tspan><tspan fill="#e8e4dc">);</tspan></text>
  <text x="36" y="122" font-size="12.5"><tspan fill="#e8e4dc">assert area == </tspan><tspan fill="#fb863a" font-weight="600">20</tspan></text>

  <!-- arrows to the two outcomes -->
  <g stroke="#9099a8" stroke-width="1.3" marker-end="url(#lsp-arr)">
    <line x1="264" y1="58" x2="332" y2="58"/>
    <line x1="264" y1="104" x2="332" y2="104"/>
  </g>

  <!-- Rectangle outcome (pass) -->
  <rect x="340" y="24" width="262" height="120" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.55)" stroke-width="1.4"/>
  <text x="356" y="46" font-size="12" font-weight="600" fill="#e8e4dc">Rectangle</text>
  <rect x="356" y="58" width="70" height="56" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.55)" stroke-width="1.2"/>
  <text x="391" y="128" font-size="10" text-anchor="middle" fill="#9099a8">5 × 4</text>
  <text x="468" y="84" font-size="13" fill="#e8e4dc">area = </text>
  <text x="524" y="84" font-size="15" font-weight="700" fill="#5cc66f">20</text>
  <text x="468" y="106" font-size="11" fill="#5cc66f">✓ as promised</text>

  <!-- Square outcome (break) -->
  <rect x="340" y="168" width="262" height="148" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.55)" stroke-width="1.4"/>
  <text x="356" y="190" font-size="12" font-weight="600" fill="#e8e4dc">Square <tspan fill="#9099a8" font-weight="400">— setWidth also sets height</tspan></text>
  <rect x="356" y="202" width="56" height="56" fill="rgba(240,104,104,0.16)" stroke="rgba(240,104,104,0.55)" stroke-width="1.2"/>
  <text x="384" y="276" font-size="10" text-anchor="middle" fill="#9099a8">4 × 4</text>
  <text x="468" y="228" font-size="13" fill="#e8e4dc">area = </text>
  <text x="524" y="228" font-size="15" font-weight="700" fill="#f06868">16</text>
  <text x="442" y="252" font-size="11" fill="#f06868">✗ expected 20</text>
  <text x="442" y="272" font-size="10.5" fill="#9099a8">setWidth(5) → 5×5,</text>
  <text x="442" y="288" font-size="10.5" fill="#9099a8">then setHeight(4) → 4×4</text>
  <text x="442" y="304" font-size="10.5" fill="#9099a8">the width you set was lost</text>
</svg>`,
        caption:
          "Same caller, two substitutes. The **Rectangle** keeps width and height independent, so `area == 20` holds. The **Square** ties them together: `setHeight(4)` quietly clobbers the width you just set, so the box is `4 × 4` and `area == 16`. The caller did nothing wrong — the *subtype* broke a promise the base made. That's an LSP violation.",
      },
      {
        type: "p",
        text: "**Story 2 — the Bird that can't fly.** Put a `fly()` method on a base `Bird`. Most birds are fine. Then along comes `Penguin extends Bird` — penguins don't fly. To compile, you override `fly()` to `throw new UnsupportedOperationException()`. Now any code that loops over birds and calls `fly()` blows up the moment it meets a penguin. The base promised *“all birds fly”*; the subtype can't keep that promise, so it cheats by throwing.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The tell-tale smell: a 'throw new NotSupportedException' override",
        text: "If a subclass overrides a method only to **throw** (\"not supported here\") or to do **nothing** at all, that's a *degenerate override* — a loud signal it doesn't truly satisfy the base's contract. The subtype removed behaviour the base promised. That's almost always an LSP violation, and a hint your inheritance tree is wrong.",
      },
      { type: "h", text: "The rule-of-thumb tests" },
      {
        type: "p",
        text: "You don't need formal logic to apply LSP. Run a candidate override through these four checks — a real subtype passes all of them:",
      },
      {
        type: "ul",
        items: [
          "**Don't strengthen preconditions.** A subtype must not demand *more* of the caller than the base did. If the base accepts any integer but the subtype rejects negatives, callers written for the base will suddenly fail.",
          "**Don't weaken postconditions.** A subtype must deliver *at least* what the base promised to return or guarantee. If the base says *“returns a sorted list,”* the subtype can't hand back an unsorted one.",
          "**Don't throw new, unexpected exceptions.** A subtype shouldn't throw error types the caller never agreed to handle — the `Penguin.fly()` trap. (Throwing the same kinds the base already documents is fine.)",
          "**Don't remove behaviour the base promised.** No degenerate overrides — no `throw new NotSupportedException`, no silently doing nothing where the base did something real.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "is-a vs behaves-like-a",
        text: "A square *is a* rectangle in geometry, and a penguin *is a* bird in biology — the shapes match. But neither *behaves like* the base your code relies on. LSP is the discipline of asking the harder question: not *“is X a kind of Y?”* but *“can X stand in for Y everywhere Y is used, and keep every promise Y made?”* Inheritance must preserve the **contract**, not just the field-and-method **shape**.",
      },
      { type: "h", text: "Why this is really about the caller" },
      {
        type: "p",
        text: "LSP protects the code that *uses* the base type. That code was written against the base's promises and shouldn't need a single `if (x instanceof Square)` special-case to stay correct. When you find yourself adding type checks to handle one particular subclass, the subclass has already broken substitutability — and you're now paying for it in branches scattered across the codebase.",
      },
    ],

    handsOn: [
      {
        title: "01 · Watch the Square break the promise",
        body: "Open the prototype on the **Rectangle vs Square** scenario. The caller is fixed: `setWidth(5); setHeight(4)` expecting `area == 20`. First click **Pass a Rectangle** and confirm it lands green at 20. Now click **Pass a Square** and watch the animation — see `setHeight(4)` *silently* drag the width down with it, so the box collapses to `4 × 4` and the result turns red at 16. Read the explain panel: which exact rule did the Square violate?",
      },
      {
        title: "02 · Make the Penguin throw",
        body: "Switch to the **Bird.fly()** scenario. Pass a `Sparrow` first — it flies, green check. Then pass a `Penguin` and watch the caller's `fly()` call blow up with a thrown exception (red). Notice that the caller code never changed; only the object you substituted did. The explain panel should name this as *throwing a new, unexpected exception* — a degenerate override.",
      },
      {
        title: "03 · See the fixed design pass for everyone",
        body: "Open the **Fixed design** view. Here `Square` is no longer a subtype of `Rectangle` — both implement a small immutable `Shape` interface with just `area()`, and birds split into a `Bird` base and a separate `FlyingBird` capability. Run every substitute through the bench again: they all pass green. Note *what changed* — we replaced bad inheritance with a shared interface (and composition), so no substitute can break a promise it never made.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "liskov-substitution.ts",
        code: `// ✗ VIOLATION: Square "is-a" Rectangle on paper, but doesn't behave like one.
class Rectangle {
  constructor(protected w = 0, protected h = 0) {}
  setWidth(w: number) { this.w = w; }
  setHeight(h: number) { this.h = h; }
  area() { return this.w * this.h; }
}

class Square extends Rectangle {
  setWidth(w: number) { this.w = w; this.h = w; }   // also changes height!
  setHeight(h: number) { this.w = h; this.h = h; }  // also changes width!
}

// A caller written for the BASE type:
function checkArea(r: Rectangle) {
  r.setWidth(5);
  r.setHeight(4);
  return r.area() === 20;   // promise: 5 × 4 == 20
}
checkArea(new Rectangle()); // true  ✓
checkArea(new Square());    // false ✗ — area is 16, the Square broke LSP

// ✓ FIX: don't inherit. Share an immutable interface; each shape computes its own area.
interface Shape { area(): number; }
class Rect implements Shape {
  constructor(private readonly w: number, private readonly h: number) {}
  area() { return this.w * this.h; }
}
class Sq implements Shape {
  constructor(private readonly side: number) {}
  area() { return this.side * this.side; }
}
// Now ANY Shape substitutes safely — there's no setter promise to break.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "LiskovSubstitution.java",
        code: `// ✗ VIOLATION: Square "is-a" Rectangle on paper, but doesn't behave like one.
class Rectangle {
    protected int w, h;
    void setWidth(int w)  { this.w = w; }
    void setHeight(int h) { this.h = h; }
    int area() { return w * h; }
}

class Square extends Rectangle {
    @Override void setWidth(int w)  { this.w = w; this.h = w; }  // also sets height!
    @Override void setHeight(int h) { this.w = h; this.h = h; }  // also sets width!
}

// A caller written for the BASE type:
static boolean checkArea(Rectangle r) {
    r.setWidth(5);
    r.setHeight(4);
    return r.area() == 20;   // promise: 5 × 4 == 20
}
// checkArea(new Rectangle()) -> true  ✓
// checkArea(new Square())    -> false ✗ — area is 16, the Square broke LSP

// ✓ FIX: don't inherit. Share an immutable interface; each shape computes its own area.
interface Shape { int area(); }
final class Rect implements Shape {
    private final int w, h;
    Rect(int w, int h) { this.w = w; this.h = h; }
    public int area() { return w * h; }
}
final class Sq implements Shape {
    private final int side;
    Sq(int side) { this.side = side; }
    public int area() { return side * side; }
}
// Now ANY Shape substitutes safely — there's no setter promise to break.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "liskov_substitution.py",
        code: `# ✗ VIOLATION: Square "is-a" Rectangle on paper, but doesn't behave like one.
class Rectangle:
    def __init__(self):
        self._w = self._h = 0
    def set_width(self, w):  self._w = w
    def set_height(self, h): self._h = h
    def area(self):          return self._w * self._h

class Square(Rectangle):
    def set_width(self, w):  self._w = w; self._h = w   # also sets height!
    def set_height(self, h): self._w = h; self._h = h   # also sets width!

# A caller written for the BASE type:
def check_area(r: Rectangle) -> bool:
    r.set_width(5)
    r.set_height(4)
    return r.area() == 20    # promise: 5 × 4 == 20

check_area(Rectangle())  # True  ✓
check_area(Square())     # False ✗ — area is 16, the Square broke LSP

# ✓ FIX: don't inherit. Share a tiny protocol; each shape computes its own area.
from typing import Protocol

class Shape(Protocol):
    def area(self) -> int: ...

class Rect:
    def __init__(self, w, h): self._w, self._h = w, h
    def area(self): return self._w * self._h

class Sq:
    def __init__(self, side): self._side = side
    def area(self): return self._side * self._side
# Now ANY Shape substitutes safely — there's no setter promise to break.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "liskov_substitution.cpp",
        code: `// ✗ VIOLATION: Square "is-a" Rectangle on paper, but doesn't behave like one.
class Rectangle {
protected:
    int w = 0, h = 0;
public:
    virtual void setWidth(int x)  { w = x; }
    virtual void setHeight(int x) { h = x; }
    virtual int  area() const     { return w * h; }
    virtual ~Rectangle() = default;
};

class Square : public Rectangle {
public:
    void setWidth(int x)  override { w = x; h = x; }  // also sets height!
    void setHeight(int x) override { w = x; h = x; }  // also sets width!
};

// A caller written for the BASE type:
bool checkArea(Rectangle& r) {
    r.setWidth(5);
    r.setHeight(4);
    return r.area() == 20;   // promise: 5 × 4 == 20
}
// Rectangle -> true  ✓     Square -> false ✗ (area is 16): the Square broke LSP

// ✓ FIX: don't inherit. Share an abstract interface; each shape computes its own area.
struct Shape { virtual int area() const = 0; virtual ~Shape() = default; };
struct Rect : Shape {
    int w, h; Rect(int w, int h) : w(w), h(h) {}
    int area() const override { return w * h; }
};
struct Sq : Shape {
    int side; explicit Sq(int s) : side(s) {}
    int area() const override { return side * side; }
};
// Now ANY Shape substitutes safely — there's no setter promise to break.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "How to obey LSP — and spot when inheritance is wrong" },
      {
        type: "p",
        text: "Before you write `extends` or `: public`, ask: *can this subtype keep every promise the base makes, in every method, with no special-casing by callers?* If yes, inheritance is a good fit. If you can already imagine a method the subtype would have to weaken, throw out of, or no-op, stop — inheritance is the wrong tool here.",
      },
      {
        type: "ul",
        items: [
          "**Reach for a shared interface** when several types offer the same *capability* but don't share real behaviour. `Rect` and `Sq` both `area()`, but neither needs the other's setters — an immutable `Shape` interface fits perfectly.",
          "**Reach for composition** when a type *has* a behaviour rather than *is* a kind of something. A `Penguin` *has-a* `swim()` ability; a `Sparrow` *has-a* `fly()` ability. Model the capability as a separate piece you compose in, not a method on a one-size base.",
          "**Make objects immutable** when you can. Half of LSP traps (the Rectangle/Square one included) come from mutating setters. No setters, no setter-promise to break.",
          "**Watch the callers.** If using a subtype forces `if (x instanceof Subtype)` checks anywhere, substitutability is already broken — let that be your alarm.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "When the subtype can't honour the full contract",
        text: "Prefer **composition** or a **shared interface** over inheritance whenever a subtype can't keep every promise of the base. *“Favour composition over inheritance”* is, in large part, just LSP advice in disguise — it steers you away from is-a trees that can't honour their contracts.",
      },
    ],

    tradeoffs: {
      pros: [
        "Callers stay simple and correct — code written against the base needs no `instanceof` checks or special cases for particular subtypes.",
        "Subtypes become freely swappable, which is exactly what makes polymorphism, mocking, and dependency injection trustworthy.",
        "Bugs surface as design questions early (\"can this really stand in for the base?\") instead of as runtime surprises in production.",
        "It keeps inheritance trees honest — you only inherit where behaviour truly transfers, so the hierarchy actually means something.",
      ],
      cons: [
        "It takes discipline and judgement: the violations (preconditions, postconditions, hidden exceptions) are subtle and easy to miss in review.",
        "Honouring the full contract can mean more types — separate interfaces or composed capabilities instead of one tidy base class.",
        "Real-world is-a relationships (square/rectangle, penguin/bird) tempt you into inheritance that violates LSP, so intuition can mislead.",
        "Languages give you little help — most won't warn you when an override strengthens a precondition or throws a new exception; the check stays manual.",
      ],
    },

    furtherReading: [
      {
        label: "Liskov substitution principle — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Liskov_substitution_principle",
        note: "The canonical overview: the formal substitutability definition, the precondition/postcondition rules, and the very Square-extends-Rectangle example used in this lesson.",
        kind: "docs",
      },
      {
        label: "Data Abstraction and Hierarchy — Barbara Liskov (1987)",
        note: "The original SIGPLAN keynote where Liskov introduced the substitution idea. Worth reading once to see the principle in the author's own words; widely available as a PDF by searching the title.",
        kind: "paper",
      },
      {
        label: "Solid Relevance — Robert C. Martin (Uncle Bob)",
        href: "https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html",
        note: "Uncle Bob, who coined the SOLID acronym, argues LSP is about keeping abstractions crisp — \"a program that uses an interface must not be confused by an implementation of that interface.\" A short, opinionated read.",
        kind: "article",
      },
      {
        label: "The Liskov Substitution Principle, with code examples — Stackify",
        href: "https://stackify.com/solid-design-liskov-substitution-principle/",
        note: "A friendly, example-led walkthrough that builds the violation and the fix step by step. A good second read right after this lesson.",
        kind: "article",
      },
      {
        label: "Liskov Substitution Principle (SOLID), Robustness & Design by Contract — Code Walks",
        href: "https://www.youtube.com/watch?v=bVwZquRH1Vk",
        note: "A clear talk that ties LSP to the Robustness Principle and Design by Contract — exactly the preconditions/postconditions framing used in the rule-of-thumb tests.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "liskov-substitution-q1",
        question: "In one sentence, what does the Liskov Substitution Principle require?",
        options: [
          { id: "a", label: "Anywhere code expects a base type, any subtype can stand in and keep working — no surprises." },
          { id: "b", label: "Every subclass must override every method of its parent." },
          { id: "c", label: "A class should have only one reason to change." },
          { id: "d", label: "High-level modules must not depend on low-level modules." },
        ],
        correctOptionId: "a",
        explanation:
          "LSP is about substitutability: a subtype must be usable everywhere its base type is used, honouring every promise the base made. Option (c) is the Single Responsibility Principle and (d) is the Dependency Inversion Principle — both also in SOLID, but not LSP.",
      },
      {
        id: "liskov-substitution-q2",
        question:
          "A caller does `setWidth(5); setHeight(4)` and expects `area == 20`. Why does `Square extends Rectangle` break it?",
        options: [
          { id: "a", label: "Square's setHeight also changes the width, so the box becomes 4 × 4 and the area is 16, not 20." },
          { id: "b", label: "Square has fewer fields than Rectangle, so the area can't be computed." },
          { id: "c", label: "Squares can't have an area in geometry." },
          { id: "d", label: "The caller forgot to call a constructor on the Square." },
        ],
        correctOptionId: "a",
        explanation:
          "To stay square, Square's setters keep all sides equal: setWidth(5) makes it 5 × 5, then setHeight(4) makes it 4 × 4 — clobbering the width you set. Area is 16. The caller assumed width and height were independent, a promise Rectangle made and Square silently broke.",
      },
      {
        id: "liskov-substitution-q3",
        question:
          "You override a base method only to `throw new UnsupportedOperationException()` (like `Penguin.fly()`). What does this signal?",
        options: [
          { id: "a", label: "A likely LSP violation — the subtype can't honour the base's contract, so it throws an exception the caller never expected." },
          { id: "b", label: "Good defensive programming that strengthens the design." },
          { id: "c", label: "Nothing — throwing from an override is always fine." },
          { id: "d", label: "That the base class needs more methods." },
        ],
        correctOptionId: "a",
        explanation:
          "A degenerate override that just throws (or does nothing) is a classic LSP smell: the subtype removes behaviour the base promised and throws an exception callers didn't agree to handle. It usually means the inheritance tree is wrong — model the capability with a separate interface or composition instead.",
      },
      {
        id: "liskov-substitution-q4",
        question: "Which of these is NOT one of the LSP rule-of-thumb tests for a valid override?",
        options: [
          { id: "a", label: "A subtype may rename the base's methods as long as the logic is similar." },
          { id: "b", label: "A subtype must not strengthen the preconditions (demand more of the caller)." },
          { id: "c", label: "A subtype must not weaken the postconditions (deliver less than promised)." },
          { id: "d", label: "A subtype must not throw new, unexpected exception types." },
        ],
        correctOptionId: "a",
        explanation:
          "Renaming methods isn't an LSP rule at all — and would break substitution outright, since the caller invokes the base's method names. The real tests are: don't strengthen preconditions, don't weaken postconditions, don't throw new exceptions, and don't remove promised behaviour.",
      },
      {
        id: "liskov-substitution-q5",
        question:
          "Your `Square` can't honour `Rectangle`'s independent-setter contract. What's the cleaner fix?",
        options: [
          { id: "a", label: "Drop the inheritance; have Rect and Square both implement a small immutable Shape interface with area()." },
          { id: "b", label: "Add `if (s instanceof Square)` checks in every caller to handle squares specially." },
          { id: "c", label: "Make Rectangle extend Square instead." },
          { id: "d", label: "Keep the inheritance but document the surprise in a comment." },
        ],
        correctOptionId: "a",
        explanation:
          "When a subtype can't keep the base's full contract, prefer a shared interface (or composition) over inheritance. An immutable Shape with just area() removes the troublesome setters entirely, so every shape substitutes safely. Sprinkling instanceof checks (b) is the very symptom LSP warns against.",
      },
    ],
  },
};
