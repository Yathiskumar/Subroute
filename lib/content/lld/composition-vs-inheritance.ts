import type { RoadmapLesson } from "@/lib/content/types";

export const compositionVsInheritance: RoadmapLesson = {
  title: "Composition vs Inheritance",
  oneLiner:
    "Inheritance models \"is-a\" and is rigid; composition models \"has-a\" by assembling behaviors and is far more flexible — favor composition.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/composition-vs-inheritance.html",
  content: {
    prototypeCaption:
      "In the center sits one `Character` object. From the palette, plug in behaviors — pick how it **moves**, what it **attacks** with, whether it has a **shield** — and the abilities panel updates live. Press **simulate turn** to watch it act using whatever's currently plugged in. The counter on the right shows how many *subclasses* you'd need to cover every combination if you tried this with inheritance instead.",

    overview: [
      {
        type: "p",
        text: "There are two main ways for one class to get behavior from another. **Inheritance** says a type *is a* kind of another type and reuses its code by extending it. **Composition** says a type *has a* helper object and reuses that object's behavior by holding it as a field and delegating to it. Same goal — reuse — but two very different shapes.",
      },
      {
        type: "p",
        text: "Picture a video-game character. With inheritance you'd try to bake every ability into the class tree: a `FlyingCharacter`, a `SwimmingArmoredCharacter`, and so on. With composition you keep *one* `Character` that simply *holds* a move-behavior, an attack-behavior, and a defense-behavior — small, swappable parts you snap in and out. Want a flying, laser-shooting, shielded character? Plug in those three behaviors. No new class required.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Inheritance is **is-a** and locks the relationship in at *design time*; composition is **has-a** and lets you assemble — and even swap — behavior at *runtime*. When in doubt, **favor composition**.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The \"is-a\" vs \"has-a\" test" },
      {
        type: "p",
        text: "Before reaching for either tool, say the relationship out loud. If \"a B *is a* A\" sounds true — \"a `Dog` is an `Animal`\" — inheritance fits. If it sounds wrong but \"a B *has a* A\" is true — \"a `Character` *has a* fly behavior\" — that's composition. A character is not a kind of flying; it merely *has* a way to move. Getting this test right is the whole ballgame.",
      },
      { type: "h", text: "Why inheritance explodes" },
      {
        type: "p",
        text: "Inheritance forces every variation into the class tree. Suppose a character can move three ways (walk / fly / swim), attack two ways (sword / laser), and either have a shield or not. To cover every combination with subclasses you'd need one class per combination:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// one subclass for every combination of abilities…
3 (move) × 2 (attack) × 2 (defense) = 12 subclasses
// add a fourth move option and it jumps to 4 × 2 × 2 = 16
// add another axis (say 3 armor tiers) → 12 × 3 = 36`,
      },
      {
        type: "p",
        text: "This is the **combinatorial explosion**. Each new option *multiplies* the number of classes, and any shared logic gets copy-pasted across cousins in the tree. Worse, a tweak to a base class can quietly break dozens of descendants — the *fragile base class* problem.",
      },
      { type: "h", text: "How composition assembles small behaviors" },
      {
        type: "p",
        text: "Composition flips it. Instead of one class per combination, you write a handful of tiny **behavior objects** — `FlyBehavior`, `SwimBehavior`, `LaserAttack`, `SwordAttack` — each doing one thing. The `Character` just holds references to them and delegates: when asked to move, it calls `this.moveBehavior.move()`. Three move behaviors, two attack behaviors, and an optional shield cover *all* twelve combinations with only seven small objects, no subclass tree at all.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class Character {
  constructor(
    private moveBehavior: MoveBehavior,    // HELD, not inherited
    private attackBehavior: AttackBehavior,
  ) {}

  performMove()   { return this.moveBehavior.move(); }     // delegate
  performAttack() { return this.attackBehavior.attack(); }

  // swap a behavior at RUNTIME — impossible with a fixed subclass
  setMove(b: MoveBehavior) { this.moveBehavior = b; }
}`,
      },
      {
        type: "p",
        text: "Because the behavior lives in a field, you can *change it while the program runs*: `hero.setMove(new FlyBehavior())` turns a walker into a flyer instantly. A subclass can never do that — its identity is fixed the moment it's constructed. (This swap-a-behavior-at-runtime idea is exactly the **Strategy pattern**, which you'll meet later — it's composition with a name.)",
      },
      { type: "h", text: "Favor composition over inheritance — and why" },
      {
        type: "p",
        text: "The famous guideline from the *Gang of Four* is \"**favor object composition over class inheritance**.\" The reasons are concrete:",
      },
      {
        type: "ul",
        items: [
          "**Loose coupling** — the `Character` depends on small behavior *interfaces*, not on a sprawling parent's internals. Parts evolve independently.",
          "**No fragile base class** — there's no deep tree where a base-class change ripples into every descendant.",
          "**Runtime flexibility** — behaviors are plugged in (and swapped) while the program runs, instead of being frozen at design time.",
          "**No combinatorial explosion** — new options *add* behaviors instead of *multiplying* classes.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "\"Favor\" is not \"always\"",
        text: "Composition is the *default*, not a law. Inheritance is still the right tool when there's a genuine **is-a** relationship with real shared behavior and you want polymorphism — `SavingsAccount` *is a* `BankAccount`. Reach for inheritance for honest hierarchies; reach for composition when you're really just assembling capabilities.",
      },
    ],

    handsOn: [
      {
        title: "01 · Plug in any combination",
        body: "In the palette, change the **Move** dropdown to *Fly*, set **Attack** to *Laser*, and toggle **Shield** on. Watch the *abilities* panel under the character update instantly. You just built a flying, laser-shooting, shielded character without creating a single new class.",
      },
      {
        title: "02 · Simulate a turn",
        body: "Press **simulate turn**. The console logs the character acting with whatever is plugged in right now — e.g. `moves by flying`, then `attacks with laser`, then `raises shield`. Change one dropdown and simulate again: only that part of the behavior changes, because each behavior is an independent object.",
      },
      {
        title: "03 · Watch the inheritance counter explode",
        body: "Look at the **\"With inheritance you'd need…\"** panel on the right. As you select options it recomputes `moves × attacks × defenses = N subclasses`. Toggle **+ add an armor axis** and watch the count multiply — the explosion composition quietly avoids with just a handful of behavior objects.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "duck.ts",
        code: `// ❌ RIGID: a subclass per behavior combination
class Duck {
  display() { return "a duck"; }
}
class FlyingDuck extends Duck {
  fly() { return "flap flap"; }
}
class RubberDuck extends Duck {
  // can't fly — but inherited fly() if Duck had it… messy overrides
  quack() { return "squeak"; }
}
// add "rocket-powered" + "mute" and the tree multiplies…

// ✅ FLEXIBLE: Duck HOLDS pluggable behaviors
interface FlyBehavior { fly(): string; }
interface QuackBehavior { quack(): string; }

class FlyWithWings implements FlyBehavior { fly() { return "flap flap"; } }
class FlyNoWay     implements FlyBehavior { fly() { return "can't fly"; } }
class LoudQuack    implements QuackBehavior { quack() { return "QUACK"; } }
class MuteQuack    implements QuackBehavior { quack() { return "..."; } }

class Duck2 {
  constructor(
    private fly: FlyBehavior,
    private quack: QuackBehavior,
  ) {}
  performFly()   { return this.fly.fly(); }     // delegate
  performQuack() { return this.quack.quack(); }
  setFly(b: FlyBehavior) { this.fly = b; }       // swap at runtime!
}

const rubber = new Duck2(new FlyNoWay(), new MuteQuack());
const rocket = new Duck2(new FlyWithWings(), new LoudQuack());
rubber.setFly(new FlyWithWings()); // now the rubber duck can fly`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Duck.java",
        code: `// ✅ FLEXIBLE: Duck HOLDS pluggable behaviors (the Strategy pattern)
interface FlyBehavior  { String fly(); }
interface QuackBehavior { String quack(); }

class FlyWithWings implements FlyBehavior  { public String fly()   { return "flap flap"; } }
class FlyNoWay     implements FlyBehavior  { public String fly()   { return "can't fly"; } }
class LoudQuack    implements QuackBehavior { public String quack() { return "QUACK"; } }
class MuteQuack    implements QuackBehavior { public String quack() { return "..."; } }

class Duck {
    private FlyBehavior fly;
    private QuackBehavior quack;

    Duck(FlyBehavior fly, QuackBehavior quack) {
        this.fly = fly;       // composed in, not inherited
        this.quack = quack;
    }

    String performFly()   { return fly.fly(); }     // delegate
    String performQuack() { return quack.quack(); }
    void setFly(FlyBehavior b) { this.fly = b; }     // swap at runtime
}

Duck rubber = new Duck(new FlyNoWay(), new MuteQuack());
Duck rocket = new Duck(new FlyWithWings(), new LoudQuack());
rubber.setFly(new FlyWithWings()); // the rubber duck can now fly`,
      },
      {
        label: "Python",
        language: "python",
        filename: "duck.py",
        code: `from typing import Protocol


# ✅ FLEXIBLE: Duck HOLDS pluggable behaviors
class FlyBehavior(Protocol):
    def fly(self) -> str: ...


class QuackBehavior(Protocol):
    def quack(self) -> str: ...


class FlyWithWings:
    def fly(self) -> str: return "flap flap"


class FlyNoWay:
    def fly(self) -> str: return "can't fly"


class LoudQuack:
    def quack(self) -> str: return "QUACK"


class MuteQuack:
    def quack(self) -> str: return "..."


class Duck:
    def __init__(self, fly: FlyBehavior, quack: QuackBehavior):
        self._fly = fly       # composed in, not inherited
        self._quack = quack

    def perform_fly(self) -> str:   return self._fly.fly()     # delegate
    def perform_quack(self) -> str: return self._quack.quack()

    def set_fly(self, behavior: FlyBehavior) -> None:
        self._fly = behavior  # swap at runtime!


rubber = Duck(FlyNoWay(), MuteQuack())
rocket = Duck(FlyWithWings(), LoudQuack())
rubber.set_fly(FlyWithWings())  # the rubber duck can now fly`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "duck.cpp",
        code: `#include <memory>
#include <string>

// ✅ FLEXIBLE: Duck HOLDS pluggable behaviors
struct FlyBehavior  { virtual std::string fly()   const = 0; virtual ~FlyBehavior()  = default; };
struct QuackBehavior { virtual std::string quack() const = 0; virtual ~QuackBehavior() = default; };

struct FlyWithWings : FlyBehavior  { std::string fly()   const override { return "flap flap"; } };
struct FlyNoWay     : FlyBehavior  { std::string fly()   const override { return "can't fly"; } };
struct LoudQuack    : QuackBehavior { std::string quack() const override { return "QUACK"; } };
struct MuteQuack    : QuackBehavior { std::string quack() const override { return "..."; } };

class Duck {
    std::unique_ptr<FlyBehavior> fly;     // composed in, not inherited
    std::unique_ptr<QuackBehavior> quack;
public:
    Duck(std::unique_ptr<FlyBehavior> f, std::unique_ptr<QuackBehavior> q)
        : fly(std::move(f)), quack(std::move(q)) {}

    std::string performFly()   const { return fly->fly(); }     // delegate
    std::string performQuack() const { return quack->quack(); }

    void setFly(std::unique_ptr<FlyBehavior> b) { fly = std::move(b); } // swap at runtime
};

int main() {
    Duck rubber(std::make_unique<FlyNoWay>(), std::make_unique<MuteQuack>());
    rubber.setFly(std::make_unique<FlyWithWings>()); // rubber duck can now fly
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When inheritance is fine" },
      {
        type: "p",
        text: "Use inheritance when there's a genuine **is-a** relationship with real shared behavior, and you want polymorphism over the base type — a `SavingsAccount` *is a* `BankAccount`, a `Circle` *is a* `Shape`. The hierarchy is shallow, stable, and honest. If the is-a sentence rings true and you'd happily treat every subclass through the parent's interface, inheritance is the cleaner tool.",
      },
      { type: "h", text: "When to prefer composition" },
      {
        type: "p",
        text: "Prefer composition the moment you're reaching for inheritance *just to reuse code*, or when a type's capabilities vary along several independent axes (how it moves, attacks, defends). If you find yourself wanting to mix and match — or change behavior while the program runs — hold the behaviors as fields and delegate. That's the **has-a** shape, and it keeps the design flat, loosely coupled, and easy to extend.",
      },
    ],

    tradeoffs: {
      pros: [
        "Loose coupling — the host depends on small behavior interfaces, not a parent's internals, so parts evolve independently.",
        "Runtime flexibility — behaviors are plugged in and can be swapped while the program runs (the basis of the Strategy pattern).",
        "No combinatorial explosion — new options add a behavior object instead of multiplying subclasses.",
        "Easier testing and reuse — each small behavior can be unit-tested and shared across many hosts.",
      ],
      cons: [
        "Inheritance suffers a combinatorial explosion — one subclass per feature combination quickly becomes unmanageable.",
        "The fragile base class problem — a change high in the tree can silently break distant descendants.",
        "Inheriting purely for reuse couples unrelated types and often violates the Liskov Substitution Principle.",
        "Overusing composition adds its own noise — lots of tiny objects and wiring can obscure a simple, genuine is-a hierarchy.",
      ],
    },

    furtherReading: [
      {
        label: "Wikipedia — Composition over inheritance",
        href: "https://en.wikipedia.org/wiki/Composition_over_inheritance",
        note: "The canonical write-up of the principle, with the duck-behavior example and its rationale.",
        kind: "article",
      },
      {
        label: "Wikipedia — Object composition",
        href: "https://en.wikipedia.org/wiki/Object_composition",
        note: "Background on has-a relationships, aggregation, and delegation between objects.",
        kind: "article",
      },
      {
        label: "Refactoring.Guru — Replace Inheritance with Delegation",
        href: "https://refactoring.guru/replace-inheritance-with-delegation",
        note: "A step-by-step refactoring that swaps a fragile subclass for a held, delegated object.",
        kind: "article",
      },
      {
        label: "Design Patterns (GoF) — \"favor object composition over class inheritance\"",
        note: "The Gang of Four book that coined the guideline and motivates it with the Strategy pattern.",
        kind: "book",
      },
      {
        label: "Effective Java — Item 18: Favor composition over inheritance",
        note: "Joshua Bloch's classic treatment of why inheritance across package boundaries is fragile.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "ci-q1",
        question: "Which relationship does composition model, and which does inheritance model?",
        options: [
          { id: "a", label: "Composition models is-a; inheritance models has-a." },
          { id: "b", label: "Composition models has-a; inheritance models is-a." },
          { id: "c", label: "Both model is-a; they differ only in syntax." },
          { id: "d", label: "Both model has-a; they differ only in performance." },
        ],
        correctOptionId: "b",
        explanation:
          "Inheritance is an is-a relationship — a subclass is a kind of its parent. Composition is a has-a relationship — an object holds another object as a field and delegates to it.",
      },
      {
        id: "ci-q2",
        question:
          "A character can move 3 ways, attack 2 ways, and either carry a shield or not. With inheritance, how many subclasses cover every combination?",
        options: [
          { id: "a", label: "7 — you add one class per option." },
          { id: "b", label: "3 — one per movement type." },
          { id: "c", label: "12 — the options multiply (3 × 2 × 2)." },
          { id: "d", label: "1 — a single base class is enough." },
        ],
        correctOptionId: "c",
        explanation:
          "Each axis multiplies the others: 3 × 2 × 2 = 12 subclasses. This combinatorial explosion is exactly what composition avoids — there you need only 3 + 2 + 1 small behavior objects.",
      },
      {
        id: "ci-q3",
        question:
          "Why can a composed `Character` swap its move behavior at runtime, while a fixed subclass cannot?",
        options: [
          { id: "a", label: "Because subclasses are always slower to construct." },
          { id: "b", label: "Because the behavior is held in a field that can be reassigned, whereas a subclass's identity is fixed when it's created." },
          { id: "c", label: "Because composition copies the parent's source code at runtime." },
          { id: "d", label: "It can't — composition is also fixed at construction time." },
        ],
        correctOptionId: "b",
        explanation:
          "Composition keeps behavior in a field, so `setMove(new FlyBehavior())` swaps it live. A subclass's type is decided at construction and can never change — this runtime swap is the heart of the Strategy pattern.",
      },
      {
        id: "ci-q4",
        question: "Which statement best captures \"favor composition over inheritance\"?",
        options: [
          { id: "a", label: "Never use inheritance; it is always wrong." },
          { id: "b", label: "Always use inheritance; composition is a workaround." },
          { id: "c", label: "Default to composition for flexibility and loose coupling, but use inheritance for genuine is-a hierarchies with shared behavior." },
          { id: "d", label: "Composition and inheritance are interchangeable, so the choice never matters." },
        ],
        correctOptionId: "c",
        explanation:
          "\"Favor\" means default, not absolute. Composition gives loose coupling, no fragile base class, and runtime flexibility — but inheritance is still right for honest is-a relationships where you want polymorphism over shared behavior.",
      },
    ],
  },
};
