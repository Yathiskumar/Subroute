import type { RoadmapLesson } from "@/lib/content/types";

export const relationshipNotation: RoadmapLesson = {
  title: "Relationship Notation",
  oneLiner:
    "The lines between boxes carry as much meaning as the boxes. This is the decoder for the six connectors — association, dependency, aggregation, composition, generalization, realization — and how to pick the right one.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/relationship-notation.html",
  content: {
    prototypeCaption:
      "A decoder quiz. You read a plain-English statement — *“A House is made of Rooms; demolish the house and the rooms go too.”* — then click which of the six notations matches, each drawn as a tiny picture of its real line and end-shape. One fixed-height panel flips to ✓ or ✗ and explains *why* (filled diamond = parts die with the whole). **Next ›** walks you through six statements covering all six relationships, with a running score. Nothing scrolls away or grows the page.",

    overview: [
      {
        type: "p",
        text: "In a class diagram the boxes get all the attention, but the *lines* between them carry just as much meaning. A line tells you whether two classes barely know each other, share a part, or live and die together. Get the line wrong and you've described a different design. This lesson is a **decoder** for the six connector notations, lined up from *loosest* to *tightest*.",
      },
      {
        type: "p",
        text: "Think of relationships between people. An **acquaintance** you just *know* (association). Someone you *borrow a tool from once* (dependency). A **club** you belong to — it can disband and you carry on (aggregation). Your **body and its organs** — they don't survive without you (composition). Being *a kind of* something — a doctor *is a* person (generalization). And *promising to do a job* — you sign a contract to deliver (realization). Same idea, six strengths of tie.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "To identify *any* relationship, read just two things: the **line style** (solid or dashed) and the **end shape** (plain · open arrow · diamond ◇◆ · triangle ▷). Those two facts alone name all six.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Read two facts, name the line" },
      {
        type: "p",
        text: "Every connector is built from two choices. The **line style** is solid or dashed. The **end shape** is one of: nothing, an open arrowhead, a diamond (hollow ◇ or filled ◆), or a hollow triangle ▷. Decode those two and you've named the relationship. Here is the whole family on one card:",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 620 360" width="100%" style="max-width:620px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The six UML class relationships as a legend, loosest to tightest: association (solid plain line), dependency (dashed line with open arrowhead), aggregation (solid line, hollow diamond on the whole), composition (solid line, filled diamond on the whole), generalization (solid line, hollow triangle at the parent), realization (dashed line, hollow triangle at the interface).">
  <defs>
    <marker id="rn-arrow" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="11" refX="9" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8" fill="none" stroke="#d8d3c9" stroke-width="1.4"/></marker>
  </defs>

  <!-- row dividers -->
  <g stroke="#2d333d" stroke-width="1">
    <line x1="14" y1="60" x2="606" y2="60"/>
    <line x1="14" y1="110" x2="606" y2="110"/>
    <line x1="14" y1="160" x2="606" y2="160"/>
    <line x1="14" y1="210" x2="606" y2="210"/>
    <line x1="14" y1="260" x2="606" y2="260"/>
    <line x1="14" y1="310" x2="606" y2="310"/>
  </g>

  <!-- header -->
  <text x="14" y="24" font-size="11" fill="#6b7280" letter-spacing="0.06em">THE SIX CONNECTORS</text>
  <text x="606" y="24" text-anchor="end" font-size="11" fill="#6b7280" letter-spacing="0.06em">loosest → tightest</text>

  <!-- shared geometry: name col x=14, connector col x=372..596, baseline = row center -->

  <!-- 1 · Association : solid plain line, no end shape -->
  <text x="14" y="80" font-size="14" fill="#e8e4dc">1 · Association</text>
  <text x="14" y="98" font-size="11.5" fill="#9099a8">A knows / uses B (a field)</text>
  <text x="372" y="79" text-anchor="middle" font-size="11" fill="#6b7280">A</text>
  <line x1="384" y1="85" x2="584" y2="85" stroke="#d8d3c9" stroke-width="1.6"/>
  <text x="596" y="79" text-anchor="middle" font-size="11" fill="#6b7280">B</text>

  <!-- 2 · Dependency : dashed line, open arrowhead -->
  <text x="14" y="130" font-size="14" fill="#e8e4dc">2 · Dependency</text>
  <text x="14" y="148" font-size="11.5" fill="#9099a8">A uses B briefly (a parameter)</text>
  <text x="372" y="129" text-anchor="middle" font-size="11" fill="#6b7280">A</text>
  <line x1="384" y1="135" x2="576" y2="135" stroke="#d8d3c9" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#rn-arrow)"/>
  <text x="596" y="129" text-anchor="middle" font-size="11" fill="#6b7280">B</text>

  <!-- 3 · Aggregation : solid line, hollow diamond on the whole -->
  <text x="14" y="180" font-size="14" fill="#e8e4dc">3 · Aggregation</text>
  <text x="14" y="198" font-size="11.5" fill="#9099a8">has-a; parts survive alone</text>
  <text x="372" y="179" text-anchor="middle" font-size="11" fill="#6b7280">Whole</text>
  <line x1="408" y1="185" x2="572" y2="185" stroke="#d8d3c9" stroke-width="1.6"/>
  <path d="M384,185 l12,-7 l12,7 l-12,7 z" fill="none" stroke="#fb863a" stroke-width="1.6"/>
  <text x="588" y="179" text-anchor="middle" font-size="11" fill="#6b7280">Part</text>

  <!-- 4 · Composition : solid line, filled diamond on the whole -->
  <text x="14" y="230" font-size="14" fill="#e8e4dc">4 · Composition</text>
  <text x="14" y="248" font-size="11.5" fill="#9099a8">owns-a; parts die with whole</text>
  <text x="372" y="229" text-anchor="middle" font-size="11" fill="#6b7280">Whole</text>
  <line x1="408" y1="235" x2="572" y2="235" stroke="#d8d3c9" stroke-width="1.6"/>
  <path d="M384,235 l12,-7 l12,7 l-12,7 z" fill="#fb863a" stroke="#fb863a" stroke-width="1.6"/>
  <text x="588" y="229" text-anchor="middle" font-size="11" fill="#6b7280">Part</text>

  <!-- 5 · Generalization : solid line, hollow triangle pointing at parent -->
  <text x="14" y="280" font-size="14" fill="#e8e4dc">5 · Generalization</text>
  <text x="14" y="298" font-size="11.5" fill="#9099a8">is-a (extends)</text>
  <text x="372" y="279" text-anchor="middle" font-size="11" fill="#6b7280">Child</text>
  <line x1="384" y1="285" x2="572" y2="285" stroke="#d8d3c9" stroke-width="1.6"/>
  <path d="M596,285 l-24,-9 l0,18 z" fill="none" stroke="#d8d3c9" stroke-width="1.6"/>
  <text x="590" y="269" text-anchor="middle" font-size="11" fill="#6b7280">Parent</text>

  <!-- 6 · Realization : dashed line, hollow triangle pointing at interface -->
  <text x="14" y="330" font-size="14" fill="#e8e4dc">6 · Realization</text>
  <text x="14" y="348" font-size="11.5" fill="#9099a8">implements a contract</text>
  <text x="372" y="329" text-anchor="middle" font-size="11" fill="#6b7280">Class</text>
  <line x1="384" y1="335" x2="572" y2="335" stroke="#d8d3c9" stroke-width="1.6" stroke-dasharray="5 4"/>
  <path d="M596,335 l-24,-9 l0,18 z" fill="none" stroke="#d8d3c9" stroke-width="1.6"/>
  <text x="588" y="319" text-anchor="middle" font-size="11" fill="#6b7280">Iface</text>
</svg>`,
        caption:
          "Read any connector by its *line style* (solid vs dashed) and its *end shape* (open arrow / hollow `◇` vs filled `◆` diamond / hollow `▷` triangle) — that pair alone names the relationship.",
      },

      { type: "h", text: "1 · Association — a plain solid line" },
      {
        type: "p",
        text: "The loosest structural tie. One class **knows about and uses** another, usually by holding a *reference* to it as a field. No ownership, no shared fate — just a lasting link.",
      },
      {
        type: "ul",
        items: [
          "**Notation:** a plain *solid line*, no end shape. An optional *open arrow* on one end shows **navigability** (which way you can reach the other), and small numbers at the ends show **multiplicity** (`1`, `0..1`, `*`, `1..*`).",
          "**Example:** an `Order` keeps a reference to its `Customer`. Both exist independently; the order just *knows* its customer.",
          "**Code form:** a stored field — `class Order { customer: Customer }`.",
        ],
      },

      { type: "h", text: "2 · Dependency — dashed line, open arrow" },
      {
        type: "p",
        text: "The most fleeting tie. Class A **uses** B only *for a moment* — B is passed in as a method parameter, created as a local variable, or returned. When the method ends, the link is gone.",
      },
      {
        type: "ul",
        items: [
          "**Notation:** a *dashed line* with an *open (unfilled) arrowhead* pointing at the class being used.",
          "**Example:** `placeOrder(gateway: PaymentGateway)` takes a `PaymentGateway` just to charge once. `Order` doesn't keep it.",
          "**Code form:** a method parameter, local variable, or return type — not a stored field.",
        ],
      },

      { type: "h", text: "3 · Aggregation — solid line, hollow ◇ diamond" },
      {
        type: "p",
        text: "A *whole–part* tie where the parts have an **independent lifetime**. The whole *has* the parts, but they were not created by it and survive without it. They may even be shared by several wholes.",
      },
      {
        type: "ul",
        items: [
          "**Notation:** a *solid line* with a *hollow ◇ diamond* sitting on the **whole** (the container).",
          "**Example:** a `Team` ◇── `Player`. Disband the team and the players still exist — they can join another team.",
          "**Code form:** a part *passed in* and stored — `class Team { constructor(players: Player[]) {...} }`. The team didn't make the players.",
        ],
      },

      { type: "h", text: "4 · Composition — solid line, filled ◆ diamond" },
      {
        type: "p",
        text: "The tightest *whole–part* tie. The whole **owns** the parts exclusively, and they share **one lifetime**: created with the whole, destroyed with it. No sharing.",
      },
      {
        type: "ul",
        items: [
          "**Notation:** a *solid line* with a *filled ◆ diamond* on the **whole**.",
          "**Example:** a `House` ◆── `Room`. Demolish the house and the rooms are gone too; a room belongs to exactly one house.",
          "**Code form:** the part *created inside* the whole — `class House { rooms = [new Room()] }`. Born and dying together.",
        ],
      },

      { type: "h", text: "5 · Generalization / Inheritance — solid line, hollow ▷ triangle" },
      {
        type: "p",
        text: 'The "**is-a**" tie. A child class *is a kind of* its parent and reuses the parent\'s members. This is plain class-to-class inheritance.',
      },
      {
        type: "ul",
        items: [
          "**Notation:** a *solid line* with a *hollow ▷ triangle* pointing at the **parent**.",
          "**Example:** `SavingsAccount` ──▷ `Account`. A savings account *is an* account.",
          "**Code form:** `class SavingsAccount extends Account`.",
        ],
      },

      { type: "h", text: "6 · Realization / Implementation — dashed line, hollow ▷ triangle" },
      {
        type: "p",
        text: "The **contract** tie. A class promises to *fulfil* an interface — it provides all the methods the interface lists. It looks like inheritance but the line is *dashed*, because the class isn't a kind of the interface, it just keeps its promise.",
      },
      {
        type: "ul",
        items: [
          "**Notation:** a *dashed line* with a *hollow ▷ triangle* pointing at the **interface**.",
          "**Example:** `ArrayList` ⇠▷ `«interface» List`. ArrayList implements List.",
          "**Code form:** `class ArrayList implements List`.",
        ],
      },

      {
        type: "callout",
        variant: "tip",
        title: "Two memory tricks that decode everything",
        text: "**(a) Line style:** *dashed* = a looser, temporary use or a contract (**dependency, realization**); *solid* = a stronger, structural tie (the other four). **(b) Diamond:** the diamond always sits on the **whole**, never the part. *Hollow ◇* = parts survive (**aggregation**); *filled ◆* = parts die with the whole (**composition**) — filled means a stronger, single-fate bond.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The two most-confused pairs",
        text: "**Aggregation ◇ vs composition ◆:** both are *has-a*; ask *“if I destroy the whole, do the parts die?”* — yes ⇒ composition (filled), no ⇒ aggregation (hollow). **Dependency vs association:** both mean *uses*; ask *“does the class keep a reference?”* — a stored field is association (solid line); a one-off parameter or local is dependency (dashed arrow).",
      },
    ],

    handsOn: [
      {
        title: "01 · Decode by the two facts",
        body: "Open the prototype and read the first statement before clicking. For each notation choice, name its two facts out loud — *“solid line, filled diamond”* or *“dashed line, open arrow.”* Pick the one whose two facts match the meaning. The verdict panel confirms whether your decode was right.",
      },
      {
        title: "02 · Nail the diamond pair",
        body: 'Find the two diamond statements — the `House`/`Rooms` one and the `Team`/`Players` one. Both are "has-a", so the only question is shared fate. Ask *“if the whole is destroyed, do the parts die?”* House → yes → **composition ◆**. Team → no → **aggregation ◇**. Getting this back-to-back burns in the difference.',
      },
      {
        title: "03 · Tell dashed from solid",
        body: 'Compare the `SavingsAccount is a BankAccount` statement with the `ArrayList implements List` one. Both use a triangle ▷ — but one is *solid* (generalization, real inheritance) and one is *dashed* (realization, a contract). Pick wrong on purpose once to read why the dashes change the meaning.',
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "relationships.ts",
        code: `// All six relationships in one file. The comment on each shows the notation.
interface PaymentGateway { charge(amount: number): void; } // an interface to implement

// 5. Generalization (is-a): solid line, hollow ▷ triangle  →  extends
class Account { protected balance = 0; }
class SavingsAccount extends Account { rate = 0.04; }

// 6. Realization (implements a contract): DASHED line, hollow ▷ triangle  →  implements
class StripeGateway implements PaymentGateway {
  charge(amount: number): void { /* ... */ }
}

class Customer { name = ""; }
class Player { name = ""; }
class Room { constructor(public name: string) {} }

class Order {
  // 1. Association (knows-a): solid line — a STORED field reference
  customer: Customer;
  constructor(customer: Customer) { this.customer = customer; }

  // 2. Dependency (uses briefly): dashed line, open arrow — a PARAMETER, not stored
  placeOrder(gateway: PaymentGateway): void { gateway.charge(100); }
}

class Team {
  // 3. Aggregation (has-a, parts survive): hollow ◇ — players PASSED IN and stored
  constructor(public players: Player[]) {}
}

class House {
  // 4. Composition (owns-a, parts die with whole): filled ◆ — rooms MADE inside
  private rooms: Room[] = [new Room("kitchen"), new Room("bath")];
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Relationships.java",
        code: `// All six relationships in one file. The comment on each shows the notation.
import java.util.List;

interface PaymentGateway { void charge(double amount); }

// 5. Generalization (is-a): solid line, hollow ▷ triangle  ->  extends
class Account { protected double balance = 0; }
class SavingsAccount extends Account { double rate = 0.04; }

// 6. Realization (implements a contract): DASHED line, hollow ▷ triangle  ->  implements
class StripeGateway implements PaymentGateway {
    public void charge(double amount) { /* ... */ }
}

class Customer { String name; }
class Player { String name; }
class Room { Room(String name) {} }

class Order {
    // 1. Association (knows-a): solid line — a STORED field reference
    private Customer customer;
    Order(Customer customer) { this.customer = customer; }

    // 2. Dependency (uses briefly): dashed line, open arrow — a PARAMETER, not stored
    void placeOrder(PaymentGateway gateway) { gateway.charge(100); }
}

class Team {
    // 3. Aggregation (has-a, parts survive): hollow ◇ — players PASSED IN and stored
    private List<Player> players;
    Team(List<Player> players) { this.players = players; }
}

class House {
    // 4. Composition (owns-a, parts die with whole): filled ◆ — rooms MADE inside
    private final Room kitchen = new Room("kitchen");
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "relationships.py",
        code: `# All six relationships in one file. The comment on each shows the notation.
from abc import ABC, abstractmethod


# the interface to implement
class PaymentGateway(ABC):
    @abstractmethod
    def charge(self, amount: float) -> None: ...


# 5. Generalization (is-a): solid line, hollow ▷ triangle  ->  subclassing
class Account:
    def __init__(self) -> None:
        self.balance = 0.0

class SavingsAccount(Account):           # is-a Account
    def __init__(self) -> None:
        super().__init__()
        self.rate = 0.04


# 6. Realization (implements a contract): DASHED line, hollow ▷ triangle
class StripeGateway(PaymentGateway):     # fulfils the contract
    def charge(self, amount: float) -> None: ...


class Customer: ...
class Player: ...
class Room:
    def __init__(self, name: str) -> None: self.name = name


class Order:
    def __init__(self, customer: Customer) -> None:
        self.customer = customer         # 1. Association: STORED field reference

    def place_order(self, gateway: PaymentGateway) -> None:
        gateway.charge(100)              # 2. Dependency: PARAMETER, not stored


class Team:
    def __init__(self, players: list[Player]) -> None:
        self.players = players           # 3. Aggregation ◇: players PASSED IN


class House:
    def __init__(self) -> None:
        self.rooms = [Room("kitchen")]   # 4. Composition ◆: rooms MADE inside`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "relationships.cpp",
        code: `// All six relationships in one file. The comment on each shows the notation.
#include <vector>
#include <memory>

struct PaymentGateway {                       // the interface to implement
    virtual void charge(double amount) = 0;
    virtual ~PaymentGateway() = default;
};

// 5. Generalization (is-a): solid line, hollow ▷ triangle  ->  inheritance
class Account { protected: double balance = 0; };
class SavingsAccount : public Account { double rate = 0.04; };

// 6. Realization (implements a contract): DASHED line, hollow ▷ triangle
class StripeGateway : public PaymentGateway {
public:
    void charge(double amount) override { /* ... */ }
};

class Customer {};
class Player {};
class Room { public: Room(const char*) {} };

class Order {
    Customer* customer;                       // 1. Association: STORED reference
public:
    explicit Order(Customer* c) : customer(c) {}

    // 2. Dependency: dashed open arrow — a PARAMETER, not stored
    void placeOrder(PaymentGateway& gateway) { gateway.charge(100); }
};

class Team {
    std::vector<Player*> players;             // 3. Aggregation ◇: PASSED IN
public:
    explicit Team(std::vector<Player*> p) : players(std::move(p)) {}
};

class House {
    Room kitchen{"kitchen"};                  // 4. Composition ◆: MADE inside, dies with House
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When this notation earns its keep" },
      {
        type: "p",
        text: "Any time you *draw or read* a class diagram, the connectors are how you record intent. They also settle real arguments in design and code review — *“does the order own the customer, or just reference it?”* is a question about which line to draw. And in interviews, picking the right connector shows you understand ownership and lifetime, not just class names.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Where it pays off",
        text: "Use it whenever you sketch or read a class diagram; to settle code-review arguments about *ownership and lifetime*; and in interviews, where getting **aggregation ◇ vs composition ◆** right is a classic question that quietly separates beginners from people who think in terms of object lifetimes.",
      },
    ],

    tradeoffs: {
      pros: [
        "A precise, shared vocabulary — one line communicates ownership, lifetime, and direction at a glance.",
        "Forces the right design question early: *who owns what, and for how long?*",
        "Maps cleanly to code — a field, a parameter, `extends`, `implements` each have a known line.",
        "Decodable from just two facts (line style + end shape), so it's quick to read once learned.",
      ],
      cons: [
        "People routinely confuse aggregation and composition — the two diamonds look almost identical.",
        "Aggregation vs composition is sometimes genuinely debatable; reasonable engineers disagree on lifetimes.",
        "Dashed-vs-solid and diamond-end details are easy to get backwards until practised.",
        "Over-precise connectors can imply more certainty about a design than you actually have.",
      ],
    },

    furtherReading: [
      {
        label: "Association, Aggregation & Composition — UML-Diagrams.org",
        href: "https://www.uml-diagrams.org/association.html",
        note: "The authoritative reference page for each connector, with exact notation rules. The best lookup sheet when you need to be sure.",
        kind: "docs",
      },
      {
        label: "UML Aggregation vs Composition — Visual Paradigm",
        href: "https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-aggregation-vs-composition/",
        note: "A focused, example-led explainer on the single most-confused pair, with clear pictures of hollow vs filled diamonds.",
        kind: "article",
      },
      {
        label: "Association, Composition and Aggregation in Java — GeeksforGeeks",
        href: "https://www.geeksforgeeks.org/association-composition-aggregation-java/",
        note: "Shows each relationship as runnable Java so you can see how the notation becomes code. Good second read.",
        kind: "article",
      },
      {
        label: "UML Distilled — Martin Fowler",
        note: "Chapter 3 covers the relationship lines in a few crisp pages. Fowler's advice: use the connector only when the distinction actually matters to your reader.",
        kind: "book",
      },
      {
        label: "UML Class Diagram Relationships explained (video)",
        href: "https://www.youtube.com/watch?v=3cmzqZzwNDM",
        note: "A short visual walkthrough drawing each line type live — useful if you learn better by watching the diamonds and arrows being drawn.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "relationship-notation-q1",
        question:
          "A `House` is composed of `Rooms`; if the house is demolished, its rooms cease to exist. Which notation models this?",
        options: [
          { id: "a", label: "Composition — solid line with a filled ◆ diamond on the House." },
          { id: "b", label: "Aggregation — solid line with a hollow ◇ diamond on the House." },
          { id: "c", label: "Association — a plain solid line." },
          { id: "d", label: "Realization — a dashed line with a hollow ▷ triangle." },
        ],
        correctOptionId: "a",
        explanation:
          "The parts cannot outlive the whole (rooms die with the house), so it's composition — a filled ◆ diamond on the whole's side. A hollow ◇ diamond (aggregation) would mean the parts survive on their own. Filled = a single, shared fate.",
      },
      {
        id: "relationship-notation-q2",
        question:
          "A `Team` has `Players`, but if the team disbands the players still exist and can join another team. Which notation fits?",
        options: [
          { id: "a", label: "Aggregation — solid line with a hollow ◇ diamond on the Team." },
          { id: "b", label: "Composition — solid line with a filled ◆ diamond on the Team." },
          { id: "c", label: "Dependency — a dashed line with an open arrow." },
          { id: "d", label: "Generalization — a solid line with a hollow ▷ triangle." },
        ],
        correctOptionId: "a",
        explanation:
          "The parts have an independent lifetime — players outlive the team — so it's aggregation, drawn with a hollow ◇ diamond on the whole. Composition (filled ◆) would mean the players die with the team. The test is always: destroy the whole, do the parts die? No here, so hollow.",
      },
      {
        id: "relationship-notation-q3",
        question:
          "`ArrayList` implements the `List` interface. Which notation is correct — and how does it differ from `SavingsAccount extends Account`?",
        options: [
          {
            id: "a",
            label:
              "Realization — a DASHED line with a hollow ▷ triangle. `extends` would be the same triangle but a SOLID line (generalization).",
          },
          {
            id: "b",
            label: "Generalization — a solid line with a hollow ▷ triangle, identical to `extends`.",
          },
          { id: "c", label: "Association — a plain solid line, since both are classes." },
          { id: "d", label: "Dependency — a dashed line with an open arrow." },
        ],
        correctOptionId: "a",
        explanation:
          "Implementing an interface is realization: a dashed line with a hollow ▷ triangle pointing at the interface. Inheriting a class (`extends`) is generalization: the same triangle but a solid line. The triangle shape is shared; the line style — dashed vs solid — is what separates a contract from true is-a inheritance.",
      },
      {
        id: "relationship-notation-q4",
        question:
          "`placeOrder(gateway: PaymentGateway)` takes a `PaymentGateway` as a parameter, uses it to charge once, and never stores it. Which line?",
        options: [
          { id: "a", label: "Dependency — a dashed line with an open arrowhead." },
          { id: "b", label: "Association — a plain solid line." },
          { id: "c", label: "Aggregation — a solid line with a hollow ◇ diamond." },
          { id: "d", label: "Composition — a solid line with a filled ◆ diamond." },
        ],
        correctOptionId: "a",
        explanation:
          "A class that uses another only briefly — as a method parameter, local variable, or return type, without keeping a reference — is a dependency: a dashed line with an open arrow. If it had stored the gateway as a field, that lasting link would be an association (a solid line) instead.",
      },
      {
        id: "relationship-notation-q5",
        question:
          "You only know two facts about a connector: the line is DASHED and the end is an OPEN ARROWHEAD (no diamond, no triangle). Which relationship is it?",
        options: [
          { id: "a", label: "Dependency — dashed + open arrow always means a temporary use." },
          { id: "b", label: "Realization — dashed lines always mean implementing an interface." },
          { id: "c", label: "Association — any line between two classes is association." },
          { id: "d", label: "Composition — dashed just means the diamond wasn't filled in yet." },
        ],
        correctOptionId: "a",
        explanation:
          "The two facts decode it: dashed line = a looser/temporary tie, and an open arrowhead (not a triangle, not a diamond) is the dependency marker. Realization is also dashed but ends in a hollow ▷ triangle, not an arrow. This is the whole skill — read the line style and the end shape, and the relationship names itself.",
      },
    ],
  },
};
