import type { RoadmapLesson } from "@/lib/content/types";

export const visitor: RoadmapLesson = {
  title: "Visitor",
  oneLiner:
    "Add new operations to a fixed family of classes without editing them, by packaging each operation as its own *visitor* object. Like an insurance agent walking a street of buildings: the house, the bank and the coffee shop never learn anything new — each just opens the door (`accept(visitor)`) and the agent does the right thing for that building. Need a safety audit next month? Send a *different* visitor down the same street — zero changes to the buildings.",
  difficulty: "intermediate",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/visitor.html",
  content: {
    prototypeCaption:
      "A street of three buildings — 🏠 House, 🏦 Bank, ☕ Coffee Shop. Pick a visitor chip (**🧾 InsuranceAgent** or **🔍 SafetyAuditor**) and press **▶ Visit street**: the agent walks building to building, and at each one you see *both dispatches* happen — first the building's `accept(v)` tag flashes (the building says *'I'm a House'*), then the visitor's matching method chip lights up (`visitHouse()`, `visitBank()`, `visitShop()`) and the result slot fills with *that visitor's* product for *that building*. Switch chips and re-visit: same three buildings, completely different results — and the counter **building classes edited: 0** never moves. Press **＋ New visitor** to add a 💰 TaxAssessor: a whole new operation appears as *just a new class*, and the buildings still haven't changed a line.",

    overview: [
      {
        type: "p",
        text: "**Visitor** answers one question: *how do I add a brand-new operation to a whole family of classes without editing any of them?* The intent in one sentence: **put each operation in its own visitor object, and let every element 'accept' the visitor instead of implementing the operation itself.** Imagine an insurance agent working one street with three very different buildings — a house, a bank, a coffee shop. The agent carries all the expertise: at the house they sell home insurance, at the bank theft insurance, at the coffee shop fire insurance. The *buildings* don't know anything about insurance. Each one just opens the door — `accept(visitor)` — and the visitor does whatever is right *for that building type*.",
      },
      {
        type: "p",
        text: "Now the payoff. Next month a **safety auditor** needs to inspect the same street, and next year a **tax assessor**. Without Visitor you'd crack open `House`, `Bank` and `CoffeeShop` and bolt a new method onto each — three edits per operation, forever, and the building classes slowly fill up with insurance math, audit checklists and tax tables that have nothing to do with *being a building*. With Visitor, every new operation is simply a **new visitor class** walking the same street. The buildings are written once and never touched again — which is [[open-closed]] in its purest form: closed for modification, open for extension *by adding visitors*.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Visitor moves operations *out of* a family of classes and into standalone visitor objects — one visitor per operation, with one `visitX` method per element type. Elements only ever do one tiny thing: `accept(v)`, which hands themselves to the visitor's matching method.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Fair warning: this is the trickiest GoF pattern",
        text: "Visitor feels *backwards* the first time — the object hands itself to the operation instead of the operation being a method on the object. That flip is powered by a technique called **double dispatch**, which we unpack slowly below. Hold onto the street: a building opening its door (first dispatch), then the agent doing the right thing for that building type (second dispatch). Every confusing line of Visitor code is just one of those two moments.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The four moving parts" },
      {
        type: "p",
        text: "Visitor splits the world into a *stable* side (the elements — our buildings) and a *growing* side (the visitors — one per operation):",
      },
      {
        type: "ul",
        items: [
          "**Element interface** — declares exactly one method: `accept(visitor)`. That's the building's front door. (`Building` with `accept(v)`.)",
          "**Concrete elements** — `House`, `Bank`, `CoffeeShop`. Each implements `accept` with one line that names its own type: `House.accept(v)` calls `v.visitHouse(this)`, `Bank.accept(v)` calls `v.visitBank(this)`, and so on. This one line is the whole trick.",
          "**Visitor interface** — declares one `visitX` method *per element type*: `visitHouse(h)`, `visitBank(b)`, `visitShop(s)`. It's the shape every operation must fill in: 'tell me what you do at each kind of building'.",
          "**Concrete visitors** — one class *per operation*: `InsuranceAgent`, `SafetyAuditor`, `TaxAssessor`. Each fills in all three `visitX` methods with that operation's logic. Adding an operation = adding one of these. Nothing else changes.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `interface Visitor {                    // one visitX per element type
  visitHouse(h: House): void;
  visitBank(b: Bank): void;
  visitShop(s: CoffeeShop): void;
}

interface Building {
  accept(v: Visitor): void;            // the front door
}

class House implements Building {
  accept(v: Visitor) { v.visitHouse(this); }  // "I'm a House — use your House move"
}
class Bank implements Building {
  accept(v: Visitor) { v.visitBank(this); }   // "I'm a Bank — use your Bank move"
}
class CoffeeShop implements Building {
  accept(v: Visitor) { v.visitShop(this); }
}

// A new operation = a new class. The buildings above never change.
class InsuranceAgent implements Visitor {
  visitHouse(h: House)      { /* sell a home policy   */ }
  visitBank(b: Bank)        { /* sell theft cover     */ }
  visitShop(s: CoffeeShop)  { /* sell fire cover      */ }
}`,
      },
      { type: "h", text: "Double dispatch, slowly" },
      {
        type: "p",
        text: "Here's the puzzle Visitor solves. You're holding a mixed street — a list typed as `Building[]` — and an agent. For each building you need to run *the right combination* of **which building** it is and **which visitor** is calling. That's a decision based on **two** runtime types at once, and ordinary method calls only ever pick a method based on **one** (the object you call it on). Visitor gets both by chaining *two* ordinary calls:",
      },
      {
        type: "ol",
        items: [
          "**First dispatch — the building's door.** You call `building.accept(agent)`. The language's normal polymorphism ([[polymorphism]]) looks at the *building's* real runtime type and picks the right `accept` — `House.accept`, `Bank.accept`, whichever. At this moment the code *knows* it's standing inside a House.",
          "**Second dispatch — the visitor's move.** That `accept` body is one line: `v.visitHouse(this)`. Now polymorphism runs *again*, this time on the **visitor's** runtime type — if `v` is an `InsuranceAgent` you get the agent's `visitHouse`, if it's a `SafetyAuditor` you get the auditor's `visitHouse`. Two hops, and you've landed on exactly the (building type × visitor type) cell you needed.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Why not just overload visit(element)?",
        text: "A tempting shortcut: give the visitor one overloaded method — `visit(House)`, `visit(Bank)`, `visit(CoffeeShop)` — and call `agent.visit(building)` directly. It doesn't work. In Java, C++ and TypeScript, *overloads are chosen at compile time from the variable's declared type* — and your variable is declared `Building`, so the compiler either refuses (no `visit(Building)` overload) or always picks the same one. Only *virtual dispatch on the receiver* looks at runtime types — so Visitor uses it twice: once on the element (`accept`), once on the visitor (`visitHouse`). That's all 'double dispatch' means.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The accept line is the building signing its name",
        text: "Notice that `v.visitHouse(this)` hard-codes the word *House* — written inside the `House` class, where that fact is always true. The building isn't doing any insurance work; it's just *announcing its own type* in a way the compiler can check, then handing itself over (`this`). One line per element, written once, reused by every visitor forever.",
      },
      { type: "h", text: "The trade: cheap operations, expensive new element types" },
      {
        type: "p",
        text: "Visitor doesn't remove work — it *moves* it. Look at the grid of (element types × operations). Plain OO puts each operation as a method inside each element class: adding an **operation** means editing *every element*. Visitor flips the grid: adding an **operation** is one new visitor class and zero edits — but adding an **element type** (a fourth building, say `Museum`) now means editing *every visitor*: the `Visitor` interface gains `visitMuseum`, and `InsuranceAgent`, `SafetyAuditor` and `TaxAssessor` must each implement it. It's the exact mirror image. So the pattern pays off precisely when the element family is **stable** and the operations **keep coming** — and punishes you when it's the other way round.",
      },
      { type: "h", text: "Where you've already met it" },
      {
        type: "ul",
        items: [
          "**Compilers and ASTs** — the classic home. A syntax tree has a fixed set of node types (`IfNode`, `CallNode`, `LiteralNode`…), but the operations never stop coming: a *type-check* visitor, a *code-gen* visitor, a *lint* visitor, a *pretty-print* visitor — each a separate class walking the same tree.",
          "**Document exporters** — one document tree of headings, paragraphs, tables and images; an `HtmlExporter`, `PdfExporter` and `MarkdownExporter` visitor each render the same nodes their own way, often walking a [[composite]] structure.",
          "**File-system reports** — walk one tree of files and folders with a *total-size* visitor, a *virus-scan* visitor, or a *find-large-files* visitor, without teaching `File` and `Folder` any of those jobs.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Watch both dispatches at one building",
        body: "With the 🧾 InsuranceAgent chip selected, press ▶ Visit street and keep your eyes on the House card. Two beats: first its accept(v) tag flashes — that's the *first dispatch*, the House's own accept method being chosen. Then the visitHouse() chip pops in and the result slot fills with 'home policy $120' — the *second dispatch*, the InsuranceAgent's House-specific method. The agent then repeats the same two beats at the Bank (visitBank() → 'theft cover $900') and the Coffee Shop (visitShop() → 'fire cover $310').",
      },
      {
        title: "02 · Same street, different operation",
        body: "Click the 🔍 SafetyAuditor chip — all three result slots clear. Press ▶ Visit street again: the *same* three buildings now produce 'smoke alarms ✓', 'vault check ✓' and 'gas lines ✓'. Nothing about the buildings changed — check the counter: **building classes edited: 0**. The entire difference between the two runs lives inside which visitor object walked the street.",
      },
      {
        title: "03 · Add an operation for free",
        body: "Press ＋ New visitor. A 💰 TaxAssessor chip appears with a green 'just a new class' flash — that flash is the whole pattern: a brand-new operation entered the system as one new class. Select it and ▶ Visit street to see assessments fill in; the edit counter still reads 0. Now imagine the reverse — adding a fourth *building* — and notice every one of the three visitor chips would need a new visitMuseum() method. That asymmetry is the trade you're buying.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "street.ts",
        code: `// Visitor interface: one visitX method per element type.
interface Visitor {
  visitHouse(h: House): void;
  visitBank(b: Bank): void;
  visitShop(s: CoffeeShop): void;
}

// Element interface: just a front door.
interface Building {
  accept(v: Visitor): void;               // 1st dispatch happens here
}

class House implements Building {
  rooms = 4;
  accept(v: Visitor) { v.visitHouse(this); }   // 2nd dispatch: House-shaped
}

class Bank implements Building {
  vaults = 2;
  accept(v: Visitor) { v.visitBank(this); }
}

class CoffeeShop implements Building {
  burners = 6;
  accept(v: Visitor) { v.visitShop(this); }
}

// Operation #1 — one visitor class per operation.
class InsuranceAgent implements Visitor {
  visitHouse(h: House)     { console.log(\`home policy $\${30 * h.rooms}\`); }
  visitBank(b: Bank)       { console.log(\`theft cover $\${450 * b.vaults}\`); }
  visitShop(s: CoffeeShop) { console.log(\`fire cover $\${50 + 40 * s.burners}\`); }
}

// Operation #2 — added later. The buildings above were NOT edited.
class SafetyAuditor implements Visitor {
  visitHouse(h: House)     { console.log(\`check smoke alarms in \${h.rooms} rooms\`); }
  visitBank(b: Bank)       { console.log(\`inspect \${b.vaults} vaults\`); }
  visitShop(s: CoffeeShop) { console.log(\`test \${s.burners} gas burners\`); }
}

const street: Building[] = [new House(), new Bank(), new CoffeeShop()];
for (const b of street) b.accept(new InsuranceAgent()); // policies for each
for (const b of street) b.accept(new SafetyAuditor());  // audits — same street`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Street.java",
        code: `// Visitor interface: one visitX method per element type.
interface Visitor {
    void visitHouse(House h);
    void visitBank(Bank b);
    void visitShop(CoffeeShop s);
}

// Element interface: just a front door.
interface Building {
    void accept(Visitor v);                 // 1st dispatch happens here
}

class House implements Building {
    int rooms = 4;
    public void accept(Visitor v) { v.visitHouse(this); } // 2nd dispatch
}

class Bank implements Building {
    int vaults = 2;
    public void accept(Visitor v) { v.visitBank(this); }
}

class CoffeeShop implements Building {
    int burners = 6;
    public void accept(Visitor v) { v.visitShop(this); }
}

// Operation #1 — one visitor class per operation.
class InsuranceAgent implements Visitor {
    public void visitHouse(House h)     { System.out.println("home policy $" + 30 * h.rooms); }
    public void visitBank(Bank b)       { System.out.println("theft cover $" + 450 * b.vaults); }
    public void visitShop(CoffeeShop s) { System.out.println("fire cover $" + (50 + 40 * s.burners)); }
}

// Operation #2 — added later. No building class was edited.
class SafetyAuditor implements Visitor {
    public void visitHouse(House h)     { System.out.println("check smoke alarms in " + h.rooms + " rooms"); }
    public void visitBank(Bank b)       { System.out.println("inspect " + b.vaults + " vaults"); }
    public void visitShop(CoffeeShop s) { System.out.println("test " + s.burners + " gas burners"); }
}

public class Street {
    public static void main(String[] args) {
        Building[] street = { new House(), new Bank(), new CoffeeShop() };
        for (Building b : street) b.accept(new InsuranceAgent());
        for (Building b : street) b.accept(new SafetyAuditor()); // same street
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "street.py",
        code: `# Python has no compile-time overloading, so the visit methods
# are named explicitly — which makes the double dispatch easy to see.

class Building:                       # element interface: just a door
    def accept(self, v): raise NotImplementedError


class House(Building):
    rooms = 4
    def accept(self, v):              # 1st dispatch picked this method...
        v.visit_house(self)           # ...2nd dispatch picks the visitor's


class Bank(Building):
    vaults = 2
    def accept(self, v):
        v.visit_bank(self)


class CoffeeShop(Building):
    burners = 6
    def accept(self, v):
        v.visit_shop(self)


class InsuranceAgent:                 # operation #1 = one class
    def visit_house(self, h): print(f"home policy \${30 * h.rooms}")
    def visit_bank(self, b):  print(f"theft cover \${450 * b.vaults}")
    def visit_shop(self, s):  print(f"fire cover \${50 + 40 * s.burners}")


class SafetyAuditor:                  # operation #2 — buildings untouched
    def visit_house(self, h): print(f"check smoke alarms in {h.rooms} rooms")
    def visit_bank(self, b):  print(f"inspect {b.vaults} vaults")
    def visit_shop(self, s):  print(f"test {s.burners} gas burners")


street = [House(), Bank(), CoffeeShop()]
for b in street: b.accept(InsuranceAgent())   # policies for each building
for b in street: b.accept(SafetyAuditor())    # audits — same street`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "street.cpp",
        code: `#include <iostream>
#include <memory>
#include <vector>

class House; class Bank; class CoffeeShop;   // forward declarations

class Visitor {                              // one visitX per element type
public:
    virtual void visitHouse(House& h) = 0;
    virtual void visitBank(Bank& b) = 0;
    virtual void visitShop(CoffeeShop& s) = 0;
    virtual ~Visitor() = default;
};

class Building {                             // element interface
public:
    virtual void accept(Visitor& v) = 0;     // 1st dispatch (virtual call)
    virtual ~Building() = default;
};

class House : public Building {
public:
    int rooms = 4;
    void accept(Visitor& v) override { v.visitHouse(*this); }  // 2nd dispatch
};

class Bank : public Building {
public:
    int vaults = 2;
    void accept(Visitor& v) override { v.visitBank(*this); }
};

class CoffeeShop : public Building {
public:
    int burners = 6;
    void accept(Visitor& v) override { v.visitShop(*this); }
};

class InsuranceAgent : public Visitor {      // operation #1 = one class
public:
    void visitHouse(House& h) override { std::cout << "home policy $" << 30 * h.rooms << "\\n"; }
    void visitBank(Bank& b) override   { std::cout << "theft cover $" << 450 * b.vaults << "\\n"; }
    void visitShop(CoffeeShop& s) override { std::cout << "fire cover $" << 50 + 40 * s.burners << "\\n"; }
};

class SafetyAuditor : public Visitor {       // operation #2 — no building edited
public:
    void visitHouse(House& h) override { std::cout << "check smoke alarms in " << h.rooms << " rooms\\n"; }
    void visitBank(Bank& b) override   { std::cout << "inspect " << b.vaults << " vaults\\n"; }
    void visitShop(CoffeeShop& s) override { std::cout << "test " << s.burners << " gas burners\\n"; }
};

int main() {
    std::vector<std::unique_ptr<Building>> street;
    street.push_back(std::make_unique<House>());
    street.push_back(std::make_unique<Bank>());
    street.push_back(std::make_unique<CoffeeShop>());

    InsuranceAgent agent;  SafetyAuditor auditor;
    for (auto& b : street) b->accept(agent);    // policies for each
    for (auto& b : street) b->accept(auditor);  // audits — same street
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Visitor when operations outnumber element types" },
      {
        type: "p",
        text: "Visitor is a specialist's tool: spectacular in its niche, clumsy outside it. The niche has a precise shape:",
      },
      {
        type: "ul",
        items: [
          "**The element hierarchy is stable, the operations keep coming** — a compiler's AST node types are fixed by the language grammar, but every release wants another pass (lint, optimize, format). New pass = new visitor, zero risk to the nodes.",
          "**Unrelated operations are polluting the element classes** — if `Document` nodes are accumulating `toHtml()`, `toPdf()`, `wordCount()`, `spellCheck()`… each with its own imports and helpers, visitors pull every operation into its own cohesive class and give the elements back a single responsibility ([[single-responsibility]]).",
          "**One operation needs to act differently per concrete type across a mixed collection** — you're iterating `Building[]` and `instanceof`/`isinstance` chains are spreading. Double dispatch replaces the whole chain with compiler-checked methods: forget one element type and the code *doesn't compile*, whereas a forgotten `else if` fails silently.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When NOT to use it",
        text: "Skip Visitor when the **element types change often** — every new element forces a new method into every existing visitor, which is death by a thousand cuts. Skip it when the hierarchy is **tiny and settled with only a couple of operations** — plain methods on the classes are shorter, clearer, and don't make readers chase `accept` → `visitX` indirection. And if the operation only needs *one* element type, you don't need dispatch at all — just a function.",
      },
    ],

    tradeoffs: {
      pros: [
        "New operations are one new class — a lint pass, an exporter, a report joins the system without touching a single element, the open-closed principle at its cleanest.",
        "Related behaviour lives together — all of the insurance logic sits in InsuranceAgent instead of being smeared one method at a time across every building class.",
        "The compiler audits completeness — the Visitor interface forces every concrete visitor to handle every element type; a forgotten case is a compile error, not a silent runtime bug.",
        "Visitors can carry state across the walk — a size-totalling or code-generating visitor accumulates results as it moves element to element, something scattered per-class methods can't do cleanly.",
      ],
      cons: [
        "Adding an element type is expensive — a fourth building means a new visitX on the interface and an implementation in every visitor ever written; the pattern's superpower exactly mirrored as its weakness.",
        "Elements may need to expose internals — visitors live outside the element classes, so fields the operation needs (rooms, vaults) must become public or gain getters, weakening encapsulation.",
        "The indirection is genuinely confusing at first — accept calls visit which was picked by accept; readers new to double dispatch will trace the two hops several times before it clicks.",
        "It hard-couples visitors to the concrete element list — every visitor names House, Bank and CoffeeShop explicitly, so the element family and all visitors must always evolve in lockstep.",
      ],
    },

    furtherReading: [
      {
        label: "Visitor — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/visitor",
        note: "The clearest illustrated walkthrough: problem, structure diagram, the insurance-agent analogy this lesson borrows, and multi-language examples. Best first read.",
        kind: "article",
      },
      {
        label: "Double dispatch — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Double_dispatch",
        note: "The mechanism underneath the pattern, explained on its own: why single dynamic dispatch can't select on two runtime types, and how the accept/visit pair fakes it.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original Gang of Four catalogue. Its Visitor chapter is the primary source for the intent, the participants, and the honest discussion of the add-element cost.",
        kind: "book",
      },
      {
        label: "Crafting Interpreters — Representing Code (Robert Nystrom)",
        href: "https://craftinginterpreters.com/representing-code.html",
        note: "Visitor in its natural habitat: a free book chapter that derives the pattern from scratch to run interpreter passes over AST nodes, including the 'expression problem' framing of the add-operation vs add-type trade.",
        kind: "book",
      },
      {
        label: "Visitor pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Visitor_pattern",
        note: "Concise reference with UML, per-language dispatch details, and links to real uses in compilers and document processing.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "visitor-q1",
        question: "What is the core intent of the Visitor pattern?",
        options: [
          { id: "a", label: "Add new operations to a fixed family of classes without editing them, by putting each operation in its own visitor object." },
          { id: "b", label: "Guarantee that a class has exactly one instance with a global access point." },
          { id: "c", label: "Let subclasses override individual steps of an algorithm defined in a base class." },
          { id: "d", label: "Convert one class's interface into another interface clients expect." },
        ],
        correctOptionId: "a",
        explanation:
          "Visitor moves operations out of the element classes and into standalone visitor classes — one per operation. Elements only implement accept(v), so new operations (new visitors) arrive without touching any element. Option (b) is Singleton, (c) is Template Method, (d) is Adapter.",
      },
      {
        id: "visitor-q2",
        question: "In double dispatch, what do the two dispatches actually select?",
        options: [
          { id: "a", label: "The first dispatch picks the element's accept method by the element's runtime type; the second picks the visitor's matching visitX method by the visitor's runtime type." },
          { id: "b", label: "Both dispatches pick methods on the visitor — once at compile time and once at runtime." },
          { id: "c", label: "The first dispatch creates the visitor and the second destroys it." },
          { id: "d", label: "The first dispatch locks the element and the second releases the lock." },
        ],
        correctOptionId: "a",
        explanation:
          "The right code to run depends on two runtime types at once: which element and which visitor. Calling building.accept(v) lets polymorphism choose by the building's real type; that accept body then calls v.visitHouse(this), letting polymorphism choose again by the visitor's real type. Two ordinary virtual calls, chained, select on both types.",
      },
      {
        id: "visitor-q3",
        question: "Why can't a plain overloaded method — visit(House), visit(Bank) — replace the accept/visit pair when iterating a Building[] list?",
        options: [
          { id: "a", label: "Because overload resolution happens at compile time using the variable's declared type (Building), not the object's runtime type — so the right overload is never chosen dynamically." },
          { id: "b", label: "Because overloaded methods are slower than virtual methods." },
          { id: "c", label: "Because most languages forbid more than two overloads per method." },
          { id: "d", label: "Because overloads cannot take object parameters, only primitives." },
        ],
        correctOptionId: "a",
        explanation:
          "In Java, C++ and TypeScript the compiler picks among overloads using the static (declared) type of the argument. Inside the loop that type is just Building, so agent.visit(b) can't route to visit(House) at runtime. Only virtual dispatch on a call's receiver consults runtime types — so Visitor uses it twice: once on the element (accept), once on the visitor (visitX).",
      },
      {
        id: "visitor-q4",
        question: "Your street gains a fourth element type, Museum. What does the Visitor pattern force you to do?",
        options: [
          { id: "a", label: "Add visitMuseum to the Visitor interface and implement it in every concrete visitor — InsuranceAgent, SafetyAuditor, TaxAssessor and all the rest." },
          { id: "b", label: "Nothing — visitors automatically handle new element types." },
          { id: "c", label: "Only write the Museum class; visitors are unaffected." },
          { id: "d", label: "Rewrite the accept method of every existing building." },
        ],
        correctOptionId: "a",
        explanation:
          "This is Visitor's mirror-image trade: adding an operation is one new class, but adding an element type touches every visitor, because each must say what it does at a Museum. That's why the pattern fits stable element hierarchies with growing operations — and hurts when element types churn.",
      },
      {
        id: "visitor-q5",
        question: "Which situation is the strongest fit for the Visitor pattern?",
        options: [
          { id: "a", label: "A compiler's AST: node types are fixed by the grammar, but new passes — type-check, lint, code-gen, format — are added constantly." },
          { id: "b", label: "A two-class hierarchy with a single operation that will never grow." },
          { id: "c", label: "A plugin system where new element types are added by third parties every week." },
          { id: "d", label: "A single class that needs one helper function." },
        ],
        correctOptionId: "a",
        explanation:
          "Visitor shines when the element family is stable and operations keep multiplying — exactly a compiler's AST, where each pass is one visitor walking the same fixed node types. Option (c) is the anti-case (element churn forces edits to every visitor), and (b)/(d) are too small to justify the indirection.",
      },
    ],
  },
};
