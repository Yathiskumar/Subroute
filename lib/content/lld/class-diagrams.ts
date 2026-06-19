import type { RoadmapLesson } from "@/lib/content/types";

export const classDiagrams: RoadmapLesson = {
  title: "Class Diagrams",
  oneLiner:
    "A class diagram is a labelled box for each class — its name, its data, its actions — joined by lines that show how the classes relate. It is the single most-used picture in low-level design.",
  difficulty: "beginner",
  estimatedTime: "15 min",
  prototypePath: "/prototypes/lld/class-diagrams.html",
  content: {
    prototypeCaption:
      "Two clean panels. **Anatomy** walks you through one real class box — `BankAccount` — one part at a time: the name, the data, the actions, and the little `+ - #` symbols in front of each line. Click **Next** and the highlighted part lights up while a one-line plain-English note explains it. The **Relationships** panel is a cheat-sheet of the six lines that connect classes; click any line to see what it means and a way to remember it. Only one note shows at a time, so nothing scrolls away or grows the page.",

    overview: [
      {
        type: "p",
        text: "A **class diagram** is a picture of the classes in your design. You draw one box per class, write what that class *knows* and what it *does* inside the box, and then draw lines between boxes to show how the classes are connected. That's the whole idea. It is the most common diagram in low-level design because it answers the two questions an interviewer (or a teammate) always asks: *what are the pieces, and how do they fit together?*",
      },
      {
        type: "p",
        text: "Think of it like a blueprint for a house. The blueprint isn't the house — it's a simple drawing that lets everyone agree on the shape before a single brick is laid. A class diagram does the same for code: you sketch the boxes and lines, everyone looks at the same picture, and you catch design mistakes *before* you write them.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A class diagram = **boxes** (each box is a class, split into name / data / actions) joined by **lines** (each line shows how two classes relate). Learn to read the box and read the line, and you can read any class diagram.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The box: three stacked compartments" },
      {
        type: "p",
        text: "Every class is a rectangle split into three rows from top to bottom. The **top** row is the class *name*. The **middle** row lists its *attributes* — the data it holds. The **bottom** row lists its *operations* — the things it can do (its methods). That order never changes, so once you've seen one box you can read them all.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 560 300" width="100%" style="max-width:560px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class box for BankAccount split into three compartments: the name on top, two private attributes (owner: String, balance: double) in the middle, and three public operations (deposit, withdraw, getBalance) at the bottom.">
  <defs>
    <marker id="cd-arrow" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <!-- outer class box -->
  <rect x="40" y="20" width="300" height="260" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>

  <!-- compartment dividers -->
  <g stroke="#2d333d" stroke-width="1">
    <line x1="40" y1="64" x2="340" y2="64"/>
    <line x1="40" y1="148" x2="340" y2="148"/>
  </g>

  <!-- name compartment -->
  <text x="190" y="48" text-anchor="middle" font-size="14" font-weight="600" fill="#e8e4dc">BankAccount</text>

  <!-- attributes compartment -->
  <g font-size="12.5">
    <text x="56" y="92"><tspan fill="#fb863a">-</tspan><tspan fill="#e8e4dc"> owner: </tspan><tspan fill="#9099a8">String</tspan></text>
    <text x="56" y="118"><tspan fill="#fb863a">-</tspan><tspan fill="#e8e4dc"> balance: </tspan><tspan fill="#9099a8">double</tspan></text>
  </g>

  <!-- operations compartment -->
  <g font-size="12.5">
    <text x="56" y="176"><tspan fill="#fb863a">+</tspan><tspan fill="#e8e4dc"> deposit(amount: </tspan><tspan fill="#9099a8">double</tspan><tspan fill="#e8e4dc">)</tspan></text>
    <text x="56" y="202"><tspan fill="#fb863a">+</tspan><tspan fill="#e8e4dc"> withdraw(amount: </tspan><tspan fill="#9099a8">double</tspan><tspan fill="#e8e4dc">)</tspan></text>
    <text x="56" y="228"><tspan fill="#fb863a">+</tspan><tspan fill="#e8e4dc"> getBalance(): </tspan><tspan fill="#9099a8">double</tspan></text>
  </g>

  <!-- annotations to the right of each compartment -->
  <g stroke="#9099a8" stroke-width="1.3" marker-end="url(#cd-arrow)">
    <line x1="392" y1="44" x2="352" y2="44"/>
    <line x1="392" y1="104" x2="352" y2="104"/>
    <line x1="392" y1="200" x2="352" y2="200"/>
  </g>
  <g font-size="11" fill="#9099a8">
    <text x="398" y="48">name</text>
    <text x="398" y="100">attributes</text>
    <text x="398" y="114">(data it knows)</text>
    <text x="398" y="196">operations</text>
    <text x="398" y="210">(what it can do)</text>
  </g>
</svg>`,
        caption:
          "Read the box top to bottom: the **name** sits on top, the **attributes** (the data it knows) in the middle, and the **operations** (what it can do) at the bottom. The symbol in front of each line is its *visibility* — `+` means **public** (anyone can use it) and `-` means **private** (hidden inside the class).",
      },
      { type: "h", text: "The symbols: + - # in front of every line" },
      {
        type: "p",
        text: "Each attribute and method starts with a small symbol that says *who is allowed to touch it* — this is the **visibility**. There are only a few, and they map exactly onto the access keywords you already know from code:",
      },
      {
        type: "ul",
        items: [
          "**`+` public** — anyone can use it. (`public` in code.)",
          "**`-` private** — only this class can use it; hidden from everyone else. (`private` in code.)",
          "**`#` protected** — this class and classes that inherit from it. (`protected` in code.)",
          "**`~` package** — anything in the same package/module. (the default in Java.)",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "How to read a single line",
        text: "Read a line left to right: **visibility · name · type**. So `- balance: double` is *“a private attribute named balance that holds a double.”* And `+ deposit(amount: double): void` is *“a public method named deposit that takes a double called amount and returns nothing.”* The return type comes after the colon at the end.",
      },
      { type: "h", text: "The lines: how two boxes connect" },
      {
        type: "p",
        text: "Boxes on their own just list pieces. The *lines* between boxes are where the design lives — they show how classes depend on, contain, or build on one another. The exact shape of the line's *end* carries the meaning, so the arrowhead matters. Here are the six you'll meet, from loosest to tightest:",
      },
      {
        type: "ul",
        items: [
          "**Association** (a plain line) — *“knows about / uses.”* A `Teacher` is associated with the `Students` they teach.",
          "**Dependency** (a dashed line with an open arrow) — *“uses temporarily.”* One class needs another just for a moment, e.g. it takes it as a method argument.",
          "**Aggregation** (a line with a hollow ◇ diamond) — *“has-a, but the parts can live on their own.”* A `Team` has `Players`; delete the team and the players still exist.",
          "**Composition** (a line with a filled ◆ diamond) — *“owns-a; the parts die with the whole.”* A `House` is composed of `Rooms`; demolish the house and the rooms are gone too.",
          "**Inheritance / Generalization** (a solid line with a hollow ▷ triangle) — *“is-a.”* A `SavingsAccount` is a `BankAccount`.",
          "**Realization / Implementation** (a dashed line with a hollow ▷ triangle) — *“promises to do.”* A `Dog` class implements an `Animal` interface.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Diamond trick: which end, and hollow vs filled",
        text: "The diamond always sits on the side of the **whole** (the container), not the part. **Hollow ◇ = aggregation** (parts survive without the whole). **Filled ◆ = composition** (parts can't exist without the whole). Remember it as: *filled means a stronger bond — they share one fate.*",
      },
      { type: "h", text: "Multiplicity: how many?" },
      {
        type: "p",
        text: "Next to the ends of a line you'll often see numbers — that's **multiplicity**, the count of objects on each side. It reads just like a range: `1` is exactly one, `0..1` is zero or one (optional), `*` (or `0..*`) is any number including none, and `1..*` is one or more. So an `Order 1 ── * OrderLine` means *one order has many order lines.*",
      },
      { type: "h", text: "Three small conventions for special classes" },
      {
        type: "ul",
        items: [
          "**Abstract class** — the class name is written in *italics* (it can't be instantiated directly).",
          "**Interface** — the box has the keyword `«interface»` above its name.",
          "**Static member** — the attribute or method is <u>underlined</u> (it belongs to the class, not to any one object).",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't draw every getter and field",
        text: "A class diagram is communication, not a code dump. Show the attributes and methods that *explain the design* and skip the obvious noise (trivial getters/setters, framework boilerplate). A box with 40 methods teaches nothing; a box with the 4 that matter teaches everything.",
      },
    ],

    handsOn: [
      {
        title: "01 · Read the box top-to-bottom",
        body: "Open the prototype's **Anatomy** panel. Before clicking anything, read the `BankAccount` box yourself: name on top, the two `-` attributes in the middle, the three methods at the bottom. Now click **Next** to step through each part — confirm your reading matched the plain-English note that appears.",
      },
      {
        title: "02 · Decode the symbols",
        body: "On the visibility step, find the `+` on `deposit` and the `-` on `balance`. Say out loud what each means: *deposit is public (anyone can call it); balance is private (only the account touches it).* That `-` is exactly why encapsulation works — outsiders must go through `deposit`/`withdraw`, never poke `balance` directly.",
      },
      {
        title: "03 · Tell the six lines apart",
        body: "Switch to the **Relationships** panel and click each of the six connectors. Focus on the two diamonds: click **aggregation** (hollow ◇) then **composition** (filled ◆) back-to-back and read how they differ — *parts survive vs parts die with the whole.* That single distinction is the most common class-diagram interview question.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "bank-account.ts",
        code: `// The class diagram box on the left becomes this code on the right.
// Visibility symbols map straight to keywords: + → public, - → private, # → protected.

// «interface» Account  — a dashed-triangle "realization" in the diagram
interface Account {
  deposit(amount: number): void;
  getBalance(): number;
}

// BankAccount  ──▷  Account   (implements / realization)
class BankAccount implements Account {
  private owner: string;       // - owner: String
  private balance: number;     // - balance: double

  constructor(owner: string) {
    this.owner = owner;
    this.balance = 0;
  }

  public deposit(amount: number): void {  // + deposit(amount: double)
    this.balance += amount;
  }

  public getBalance(): number {           // + getBalance(): double
    return this.balance;
  }
}

// SavingsAccount  ──▷  BankAccount   (inheritance / generalization, "is-a")
class SavingsAccount extends BankAccount {
  private rate: number = 0.04;            // - rate: double
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "BankAccount.java",
        code: `// The class diagram box on the left becomes this code on the right.
// Visibility symbols map straight to keywords: + -> public, - -> private, # -> protected.

// «interface» Account  — a dashed-triangle "realization" in the diagram
interface Account {
    void deposit(double amount);
    double getBalance();
}

// BankAccount  --|>  Account   (implements / realization)
class BankAccount implements Account {
    private String owner;       // - owner: String
    private double balance;     // - balance: double

    public BankAccount(String owner) {
        this.owner = owner;
        this.balance = 0;
    }

    public void deposit(double amount) {   // + deposit(amount: double)
        this.balance += amount;
    }

    public double getBalance() {           // + getBalance(): double
        return this.balance;
    }
}

// SavingsAccount  --|>  BankAccount   (inheritance / generalization, "is-a")
class SavingsAccount extends BankAccount {
    private double rate = 0.04;            // - rate: double

    public SavingsAccount(String owner) { super(owner); }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "bank_account.py",
        code: `# The class diagram box on the left becomes this code on the right.
# Python has no keywords for visibility: a leading underscore signals "private (-)".
from abc import ABC, abstractmethod


# «interface» Account  — modelled as an abstract base class
class Account(ABC):
    @abstractmethod
    def deposit(self, amount: float) -> None: ...

    @abstractmethod
    def get_balance(self) -> float: ...


# BankAccount  --|>  Account   (implements / realization)
class BankAccount(Account):
    def __init__(self, owner: str) -> None:
        self._owner = owner       # - owner: String
        self._balance = 0.0       # - balance: double

    def deposit(self, amount: float) -> None:   # + deposit(amount: double)
        self._balance += amount

    def get_balance(self) -> float:             # + getBalance(): double
        return self._balance


# SavingsAccount  --|>  BankAccount   (inheritance / generalization, "is-a")
class SavingsAccount(BankAccount):
    def __init__(self, owner: str) -> None:
        super().__init__(owner)
        self._rate = 0.04         # - rate: double`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "bank_account.cpp",
        code: `// The class diagram box on the left becomes this code on the right.
// Visibility symbols map straight to keywords: + -> public, - -> private, # -> protected.
#include <string>

// «interface» Account  — a pure-virtual class (the dashed-triangle "realization")
class Account {
public:
    virtual void deposit(double amount) = 0;
    virtual double getBalance() const = 0;
    virtual ~Account() = default;
};

// BankAccount  ..|>  Account   (implements / realization)
class BankAccount : public Account {
private:
    std::string owner;     // - owner: String
    double balance;        // - balance: double

public:
    explicit BankAccount(std::string owner) : owner(std::move(owner)), balance(0) {}

    void deposit(double amount) override {   // + deposit(amount: double)
        balance += amount;
    }

    double getBalance() const override {     // + getBalance(): double
        return balance;
    }
};

// SavingsAccount  --|>  BankAccount   (inheritance / generalization, "is-a")
class SavingsAccount : public BankAccount {
private:
    double rate = 0.04;    // - rate: double
public:
    explicit SavingsAccount(std::string owner) : BankAccount(std::move(owner)) {}
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for a class diagram" },
      {
        type: "p",
        text: "Draw one whenever you need to *show structure*: at the start of a design to agree on the pieces, in an interview to lay out your classes before coding, in a code review to explain how a new module hangs together, or when onboarding someone into an unfamiliar codebase. It's the default diagram for low-level design because almost every LLD problem is, at heart, *“what classes, and how connected?”*",
      },
      {
        type: "callout",
        variant: "tip",
        title: "In an interview, the box is your thinking out loud",
        text: "When asked to design something (a parking lot, an elevator, a vending machine), start by sketching boxes for the nouns and lines for the relationships. The diagram *is* the conversation — it shows the interviewer you can decompose a problem into clean, well-related classes.",
      },
    ],

    tradeoffs: {
      pros: [
        "Universal — almost every engineer can read one, so it's the fastest way to share a design.",
        "Catches structural mistakes (wrong ownership, missing relationships, a god class) before you write code.",
        "Maps almost one-to-one to real code, so it's easy to go from diagram to implementation and back.",
        "Scales from a quick 3-box whiteboard sketch to a full module map.",
      ],
      cons: [
        "Shows structure, not behaviour — it can't tell you the order things happen in (that's a sequence diagram's job).",
        "Goes stale fast if drawn in too much detail; an over-precise diagram becomes a second copy of the code to maintain.",
        "Easy to overload — cramming every field and getter in turns a teaching tool into unreadable noise.",
        "The notation has corners (multiplicity, diamonds, dashed vs solid) that beginners mix up until practised.",
      ],
    },

    furtherReading: [
      {
        label: "UML Class Diagrams — UML-Diagrams.org reference",
        href: "https://www.uml-diagrams.org/class-diagrams-overview.html",
        note: "The most complete plain-reference for every element: compartments, visibility, all relationship types, multiplicity. Bookmark it as your lookup sheet.",
        kind: "docs",
      },
      {
        label: "UML Class Diagram Tutorial — Visual Paradigm",
        href: "https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-class-diagram-tutorial/",
        note: "A friendly, example-led walkthrough that builds a diagram step by step — great as a second read after this lesson.",
        kind: "article",
      },
      {
        label: "UML Distilled — Martin Fowler",
        note: "The classic short book on UML. Chapter 3 on class diagrams is the clearest few pages ever written on the topic; Fowler's whole point is to use just enough notation to communicate.",
        kind: "book",
      },
      {
        label: "Mermaid — Class Diagram syntax",
        href: "https://mermaid.js.org/syntax/classDiagram.html",
        note: "Lets you write class diagrams as plain text and render them in Markdown, docs, and GitHub. The fastest way to keep a diagram next to your code without a drawing tool.",
        kind: "docs",
      },
      {
        label: "PlantUML — Class Diagram",
        href: "https://plantuml.com/class-diagram",
        note: "Another text-to-diagram tool, popular in engineering teams. Useful for seeing how every relationship arrow is expressed in code-like syntax.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "class-diagrams-q1",
        question: "In a UML class box, what do the three compartments contain, from top to bottom?",
        options: [
          { id: "a", label: "Name, attributes (data), operations (methods)." },
          { id: "b", label: "Methods, then attributes, then the class name at the bottom." },
          { id: "c", label: "Inputs, outputs, and a description." },
          { id: "d", label: "Public members, private members, and protected members." },
        ],
        correctOptionId: "a",
        explanation:
          "A class box is always split the same way: the class name on top, the attributes (the data it holds) in the middle, and the operations/methods (what it can do) at the bottom. That fixed order is what lets you read any class box at a glance.",
      },
      {
        id: "class-diagrams-q2",
        question: "You see `- balance: double` inside a class box. What does the leading `-` mean?",
        options: [
          { id: "a", label: "The attribute is private — only this class can access it." },
          { id: "b", label: "The attribute is public — anyone can access it." },
          { id: "c", label: "The value is negative." },
          { id: "d", label: "The attribute is static and shared across all objects." },
        ],
        correctOptionId: "a",
        explanation:
          "The `-` symbol means private: only the class itself can touch `balance`. (`+` is public, `#` is protected, `~` is package.) Making `balance` private is exactly why outsiders must go through `deposit`/`withdraw` — that's encapsulation in a picture.",
      },
      {
        id: "class-diagrams-q3",
        question:
          "A `House` is made of `Rooms`, and if you demolish the house the rooms cease to exist too. Which relationship and notation models this?",
        options: [
          { id: "a", label: "Composition — a line with a filled ◆ diamond on the House side." },
          { id: "b", label: "Aggregation — a line with a hollow ◇ diamond on the House side." },
          { id: "c", label: "Inheritance — a solid line with a hollow ▷ triangle." },
          { id: "d", label: "Dependency — a dashed line with an open arrow." },
        ],
        correctOptionId: "a",
        explanation:
          "When the parts cannot exist without the whole (rooms die with the house), that's composition, drawn with a filled ◆ diamond on the whole's side. A hollow ◇ diamond (aggregation) would mean the parts can outlive the whole — like players surviving after a team disbands.",
      },
      {
        id: "class-diagrams-q4",
        question: "What does the multiplicity in `Order 1 ── * OrderLine` tell you?",
        options: [
          { id: "a", label: "One order is linked to many order lines (zero or more)." },
          { id: "b", label: "One order is linked to exactly one order line." },
          { id: "c", label: "Many orders share a single order line." },
          { id: "d", label: "Orders and order lines are the same class." },
        ],
        correctOptionId: "a",
        explanation:
          "Multiplicity is the count at each end of the line. `1` on the Order side and `*` on the OrderLine side reads as 'one order has many order lines.' `*` means any number including zero; `1..*` would mean at least one.",
      },
      {
        id: "class-diagrams-q5",
        question: "Which kind of question can a class diagram NOT answer well?",
        options: [
          { id: "a", label: "In what order do the objects call each other to handle a request?" },
          { id: "b", label: "What classes exist in the design?" },
          { id: "c", label: "Which class owns which data?" },
          { id: "d", label: "How are two classes related — does one contain or inherit from the other?" },
        ],
        correctOptionId: "a",
        explanation:
          "A class diagram shows structure — the pieces and how they're connected — but not behaviour over time. The order in which objects send messages to handle a request is what a sequence diagram captures. Use the right diagram for the question you're answering.",
      },
    ],
  },
};
