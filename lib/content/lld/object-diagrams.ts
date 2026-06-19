import type { RoadmapLesson } from "@/lib/content/types";

export const objectDiagrams: RoadmapLesson = {
  title: "Object Diagrams",
  oneLiner:
    "An object diagram is a photo of your running program at one moment — it shows real objects with their actual values, not the general class blueprint. One class diagram can produce many different object diagrams.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/object-diagrams.html",
  content: {
    prototypeCaption:
      "One small `BankAccount` class box (the blueprint) sits at the top. Press **Snapshot A** or **Snapshot B** to spawn two concrete object boxes below it — `alice : BankAccount` and `bob : BankAccount` — each with its own real values like `balance = 500`. The two buttons produce *different* values from the *same* class, so you can see one blueprint make many snapshots. Click the class box, any object box, or any value slot and a single fixed-height panel is rewritten with a plain-English note. Nothing scrolls or grows — only that one panel changes.",

    overview: [
      {
        type: "p",
        text: "An **object diagram** is a picture of *specific objects* in your program at *one exact moment*. A class diagram tells you what a `BankAccount` *can* have (an owner, a balance). An object diagram says *“right now there is an account belonging to Alice with a balance of 500.”* It fills in the real values.",
      },
      {
        type: "p",
        text: "Think of it like a class photo. The class diagram is the *form* every student fills in — *name, age, grade* — the same blank boxes for everyone. The object diagram is the actual photo on photo day: *Alice, 14, Grade 9* standing next to *Bob, 15, Grade 9*. Same form, real people, frozen at one second in time.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A class diagram is the **blueprint** (what every object *could* hold); an object diagram is a **snapshot** of real objects with their *actual values* at one moment. One blueprint → many possible snapshots.",
      },
    ],

    howItWorks: [
      { type: "h", text: "A snapshot, not a blueprint" },
      {
        type: "p",
        text: "A class diagram is general and timeless: it describes *every* `BankAccount` that will ever exist. An object diagram is the opposite — it is *specific* and *frozen in time*. It captures the exact objects that are alive at one instant and the exact values they hold. If you paused your program and looked at memory, an object diagram is the picture you'd draw.",
      },
      { type: "h", text: "Instance notation: name : ClassName" },
      {
        type: "p",
        text: "Each real object is drawn as a box, and its title is written as `objectName : ClassName`. In real UML this whole title is **underlined** — that underline is the signal that says *“this is one real instance, not a class.”* The name before the colon is which object it is; the class after the colon is what kind of thing it is.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 360" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A class diagram with one BankAccount blueprint box on the left holding attributes owner: String and balance: double, an arrow labelled instances pointing right, and an object diagram on the right with two underlined instance boxes alice : BankAccount (owner = Alice, balance = 500) and bob : BankAccount (owner = Bob, balance = 1200).">
  <defs>
    <marker id="od-arrow" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#d8d3c9"/></marker>
  </defs>

  <!-- section labels -->
  <text x="120" y="20" text-anchor="middle" font-size="11" fill="#9099a8">CLASS DIAGRAM (blueprint)</text>
  <text x="520" y="20" text-anchor="middle" font-size="11" fill="#9099a8">OBJECT DIAGRAM (snapshot, one moment)</text>

  <!-- LEFT: class box (grey blueprint, NOT underlined) -->
  <g>
    <rect x="30" y="36" width="180" height="78" rx="6" fill="#14161a" stroke="#2d333d"/>
    <line x1="30" y1="62" x2="210" y2="62" stroke="#2d333d" stroke-width="1"/>
    <text x="120" y="54" text-anchor="middle" font-size="13" fill="#e8e4dc">BankAccount</text>
    <text x="44" y="82" font-size="12" fill="#e8e4dc">- owner: String</text>
    <text x="44" y="102" font-size="12" fill="#e8e4dc">- balance: double</text>
  </g>
  <text x="120" y="136" text-anchor="middle" font-size="10.5" fill="#6b7280">one class describes every account</text>

  <!-- ARROW: blueprint → instances -->
  <line x1="222" y1="75" x2="296" y2="75" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#od-arrow)"/>
  <text x="259" y="66" text-anchor="middle" font-size="11" fill="#fb863a" font-style="italic">instances</text>

  <!-- RIGHT: object box "alice" (accent tint, UNDERLINED title) -->
  <g>
    <rect x="320" y="36" width="200" height="78" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
    <line x1="320" y1="62" x2="520" y2="62" stroke="rgba(251,134,58,0.55)" stroke-width="1"/>
    <text x="420" y="54" text-anchor="middle" font-size="13" fill="#e8e4dc" text-decoration="underline">alice : BankAccount</text>
    <text x="334" y="82" font-size="12" fill="#e8e4dc">owner   = "Alice"</text>
    <text x="334" y="102" font-size="12" fill="#e8e4dc">balance = 500</text>
  </g>
  <text x="690" y="86" text-anchor="end" font-size="10.5" fill="#6b7280" font-style="italic">← a real value, frozen now</text>

  <!-- RIGHT: object box "bob" (accent tint, UNDERLINED title) -->
  <g>
    <rect x="320" y="138" width="200" height="78" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
    <line x1="320" y1="164" x2="520" y2="164" stroke="rgba(251,134,58,0.55)" stroke-width="1"/>
    <text x="420" y="156" text-anchor="middle" font-size="13" fill="#e8e4dc" text-decoration="underline">bob : BankAccount</text>
    <text x="334" y="184" font-size="12" fill="#e8e4dc">owner   = "Bob"</text>
    <text x="334" y="204" font-size="12" fill="#e8e4dc">balance = 1200</text>
  </g>
  <text x="420" y="238" text-anchor="middle" font-size="10.5" fill="#6b7280">...many objects, real values</text>
</svg>`,
        caption:
          "A class is the *blueprint*; an object diagram is a *snapshot* of real instances with actual values at one moment — one class, many objects. The object titles `alice : BankAccount` and `bob : BankAccount` are **underlined** to mark them as real instances; their accent-tinted boxes show **values** (`balance = 500`), not the grey blueprint's *types* (`- balance: double`).",
      },
      { type: "h", text: "Slots: the actual values" },
      {
        type: "p",
        text: "Inside each object box you list **slots**. A slot is one attribute with its *real value filled in*, written `attribute = value` — for example `balance = 500`. This is the big difference from a class box: a class box shows the attribute *with its type* (`- balance: double`), while an object box shows the attribute *with its value* (`balance = 500`). Types describe the shape; values describe this one object right now.",
      },
      { type: "h", text: "Links: instances of associations" },
      {
        type: "p",
        text: "Lines between object boxes are called **links**. A link is just one real connection between two specific objects. If a class diagram says *“a `Customer` is associated with `Account`s,”* an object diagram makes that concrete: *“`alice` is linked to `account#42`.”* So a link is an *instance of* an association, the same way an object is an instance of a class.",
      },
      { type: "h", text: "One blueprint, many snapshots" },
      {
        type: "ul",
        items: [
          "The **same** class diagram can produce **endless** object diagrams — one for every combination of real values your program might hold.",
          "Two snapshots taken at different times look different even for the *same* object: `alice`'s `balance` might be `500` now and `300` after a withdrawal.",
          "An object diagram is therefore tied to a **moment** — change the moment and you get a new, valid picture from the same blueprint.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "When an object diagram earns its keep",
        text: "Reach for one when a structure is *hard to picture in the abstract* — a tree, a linked list, a graph of who-points-to-whom, or a tricky bug where you need to see the exact objects and links that exist at the moment things break. Drawing the real instances often makes the problem obvious.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't confuse it with a class diagram",
        text: "If you see a *type* after a colon (`balance: double`) you're reading a **class** box. If you see a *value* after an equals sign (`balance = 500`) and an underlined `name : Class` title, you're reading an **object** box. Type = blueprint, value = snapshot.",
      },
    ],

    handsOn: [
      {
        title: "01 · Read the blueprint, then take a snapshot",
        body: "Open the prototype. At the top is the `BankAccount` class box — the blueprint, showing attributes with *types* (`- balance: double`). Now press **Snapshot A**. Two object boxes appear below: `alice` and `bob`, each with real *values*. Notice their titles are underlined `name : BankAccount` — that underline means *“real instance.”*",
      },
      {
        title: "02 · Same blueprint, different snapshot",
        body: "Press **Snapshot B**. The same two object boxes reappear but with *different values* — `alice`'s balance is no longer 500. This is the key lesson: one class diagram can produce *many* object diagrams. The blueprint never changed; only the moment-in-time values did.",
      },
      {
        title: "03 · Click a slot vs the class box",
        body: "Click a value slot like `balance = 500` and read the panel: it's the *actual value this object holds right now*. Now click the class box at the top and read again: it's the *blueprint* that says every account *can* have a balance. Feel the difference — value vs type, instance vs class.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "snapshot.ts",
        code: `// The class is the blueprint; the objects below are one snapshot.
class BankAccount {
  constructor(public owner: string, public balance: number) {}
}

// ---- take a snapshot: create specific instances ----
const alice = new BankAccount("Alice", 500);
const bob = new BankAccount("Bob", 1200);

// Object diagram for THIS moment:
//   alice : BankAccount   { owner = "Alice", balance = 500 }
//   bob   : BankAccount   { owner = "Bob",   balance = 1200 }

alice.balance -= 200; // a later moment = a DIFFERENT object diagram:
//   alice : BankAccount   { owner = "Alice", balance = 300 }`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Snapshot.java",
        code: `// The class is the blueprint; the objects below are one snapshot.
class BankAccount {
    String owner;
    double balance;
    BankAccount(String owner, double balance) {
        this.owner = owner;
        this.balance = balance;
    }
}

// ---- take a snapshot: create specific instances ----
BankAccount alice = new BankAccount("Alice", 500);
BankAccount bob = new BankAccount("Bob", 1200);

// Object diagram for THIS moment:
//   alice : BankAccount   { owner = "Alice", balance = 500 }
//   bob   : BankAccount   { owner = "Bob",   balance = 1200 }

alice.balance -= 200; // a later moment = a DIFFERENT object diagram:
//   alice : BankAccount   { owner = "Alice", balance = 300 }`,
      },
      {
        label: "Python",
        language: "python",
        filename: "snapshot.py",
        code: `# The class is the blueprint; the objects below are one snapshot.
class BankAccount:
    def __init__(self, owner: str, balance: float):
        self.owner = owner
        self.balance = balance

# ---- take a snapshot: create specific instances ----
alice = BankAccount("Alice", 500)
bob = BankAccount("Bob", 1200)

# Object diagram for THIS moment:
#   alice : BankAccount   { owner = "Alice", balance = 500 }
#   bob   : BankAccount   { owner = "Bob",   balance = 1200 }

alice.balance -= 200  # a later moment = a DIFFERENT object diagram:
#   alice : BankAccount   { owner = "Alice", balance = 300 }`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "snapshot.cpp",
        code: `// The class is the blueprint; the objects below are one snapshot.
#include <string>

struct BankAccount {
    std::string owner;
    double balance;
};

// ---- take a snapshot: create specific instances ----
BankAccount alice{"Alice", 500};
BankAccount bob{"Bob", 1200};

// Object diagram for THIS moment:
//   alice : BankAccount   { owner = "Alice", balance = 500 }
//   bob   : BankAccount   { owner = "Bob",   balance = 1200 }

alice.balance -= 200; // a later moment = a DIFFERENT object diagram:
//   alice : BankAccount   { owner = "Alice", balance = 300 }`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for an object diagram" },
      {
        type: "p",
        text: "Use one when *specific instances* tell the story better than the general blueprint: to show an example configuration, to make a tricky data structure (a tree, a graph, a linked list) concrete, to explain a bug by drawing the exact objects and links alive at the failure point, or to test your class diagram by asking *“can it actually produce a sensible snapshot?”* It is a companion to the class diagram, not a replacement.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "A quick sanity check for your design",
        text: "Sketch one object diagram from your class diagram. If you *can't* fill in a believable set of values and links, your class diagram is probably wrong — a missing relationship, a bad multiplicity, or an attribute that doesn't belong. The snapshot exposes design holes fast.",
      },
    ],

    tradeoffs: {
      pros: [
        "Makes an abstract design concrete — real values and links are far easier to grasp than types alone.",
        "Great for explaining tricky structures (trees, graphs, linked lists) or reproducing a bug at the exact moment it happens.",
        "Acts as a test of a class diagram: if you can't draw a believable snapshot, the blueprint has a flaw.",
        "Beginner-friendly — it looks like the program's actual data, so non-experts can read it.",
      ],
      cons: [
        "Captures only one moment — it can't show how the objects got there or what changes next.",
        "Doesn't scale: a snapshot of hundreds of live objects becomes an unreadable wall of boxes.",
        "Easy to mistake for a class diagram if you forget the underline and the value slots.",
        "Quickly goes out of date — the very next operation can make a different, equally valid diagram.",
      ],
    },

    furtherReading: [
      {
        label: "UML Object Diagrams — UML-Diagrams.org reference",
        href: "https://www.uml-diagrams.org/class-diagrams-overview.html#object-diagram",
        note: "The plain-reference for instance specifications, slots, and links, with the underline notation spelled out. Bookmark it as your lookup sheet.",
        kind: "docs",
      },
      {
        label: "What is an Object Diagram? — Visual Paradigm guide",
        href: "https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-object-diagram/",
        note: "A friendly, example-led walkthrough showing how an object diagram is built from a class diagram step by step.",
        kind: "article",
      },
      {
        label: "UML Distilled — Martin Fowler",
        note: "The classic short book on UML. Fowler covers object diagrams as a quick, practical way to illustrate a class diagram with a concrete example.",
        kind: "book",
      },
      {
        label: "Mermaid — Class Diagram syntax",
        href: "https://mermaid.js.org/syntax/classDiagram.html",
        note: "Mermaid renders class structure as plain text in Markdown and GitHub; the same notation is the basis for sketching instances next to your code.",
        kind: "docs",
      },
      {
        label: "Object Diagrams in UML — GeeksforGeeks",
        href: "https://www.geeksforgeeks.org/unified-modeling-language-uml-object-diagrams/",
        note: "A beginner-level article with worked examples contrasting object diagrams against class diagrams.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "object-diagrams-q1",
        question: "What does an object diagram show that a class diagram does not?",
        options: [
          { id: "a", label: "Specific objects with their actual values at one moment in time." },
          { id: "b", label: "The methods every class can perform." },
          { id: "c", label: "The order in which messages are sent between objects." },
          { id: "d", label: "Which package each class belongs to." },
        ],
        correctOptionId: "a",
        explanation:
          "A class diagram is the general blueprint — what every object could hold. An object diagram is a snapshot of real instances with their actual values frozen at one instant, like a class photo taken on photo day.",
      },
      {
        id: "object-diagrams-q2",
        question: "In an object box you see the title written as `alice : BankAccount`, underlined. What does that mean?",
        options: [
          { id: "a", label: "It's one real instance named alice, of the class BankAccount." },
          { id: "b", label: "BankAccount inherits from alice." },
          { id: "c", label: "alice is a method inside BankAccount." },
          { id: "d", label: "BankAccount is an abstract class." },
        ],
        correctOptionId: "a",
        explanation:
          "The notation `objectName : ClassName` names one specific instance and the kind of thing it is. The underline is UML's signal that this is a real object, not a class.",
      },
      {
        id: "object-diagrams-q3",
        question:
          "You're looking at two boxes. Box X has `- balance: double`. Box Y has `balance = 500`. Which is which?",
        options: [
          { id: "a", label: "X is a class box (shows the type); Y is an object box (shows the value)." },
          { id: "b", label: "X is an object box; Y is a class box." },
          { id: "c", label: "Both are class boxes." },
          { id: "d", label: "Both are object boxes." },
        ],
        correctOptionId: "a",
        explanation:
          "A type after a colon (`balance: double`) describes the blueprint — that's a class box. A value after an equals sign (`balance = 500`) is the actual data this one object holds — that's an object box (a slot).",
      },
      {
        id: "object-diagrams-q4",
        question: "How many different object diagrams can a single class diagram produce?",
        options: [
          { id: "a", label: "Many — one for every combination of real values and links your program can hold." },
          { id: "b", label: "Exactly one — the diagram is fixed by the class." },
          { id: "c", label: "Two: one for valid data and one for invalid data." },
          { id: "d", label: "None — object diagrams come from sequence diagrams instead." },
        ],
        correctOptionId: "a",
        explanation:
          "One blueprint describes endless possible snapshots. Even the same object at two different moments gives two different object diagrams — for example alice's balance is 500 now and 300 after a withdrawal.",
      },
      {
        id: "object-diagrams-q5",
        question: "When is an object diagram the most useful tool to reach for?",
        options: [
          { id: "a", label: "To make a tricky structure concrete or show the exact objects and links alive when a bug happens." },
          { id: "b", label: "To document the workflow and branches of a long-running process." },
          { id: "c", label: "To list every method and field of every class in the system." },
          { id: "d", label: "To show how an object moves through its lifecycle states." },
        ],
        correctOptionId: "a",
        explanation:
          "Object diagrams shine when specific instances tell the story better than the abstract blueprint — picturing a tree or graph, or freezing the exact objects and links at the moment something breaks. Workflows are activity diagrams; lifecycles are state diagrams.",
      },
    ],
  },
};
