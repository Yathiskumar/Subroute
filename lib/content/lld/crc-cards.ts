import type { RoadmapLesson } from "@/lib/content/types";

export const crcCards: RoadmapLesson = {
  title: "CRC Cards",
  oneLiner:
    "CRC = Class–Responsibility–Collaborator: one index card per class — its name, what it's responsible for, and which classes it talks to — that you brainstorm and role-play to discover a design cheaply before drawing a single diagram.",
  difficulty: "intermediate",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/crc-cards.html",
  content: {
    prototypeCaption:
      "A small deck of CRC cards for a checkout — **Cashier**, **Order**, **OrderLine**, **Product**, **Payment** — each showing its *responsibilities* (left) and *collaborators* (right). Pick the scenario *\"Customer checks out a cart\"* and step through it with **Next**/**Prev**: each step names an action, the **responsible card lights up**, and arrows are drawn to every **collaborator** it must talk to — enacting the walkthrough. Toggle **Quiz me** to guess which card owns a step before it's revealed, and watch the *active card* and *collaborations drawn* indicators update live.",

    overview: [
      {
        type: "p",
        text: "A **CRC card** is one index card per class, split into three areas: the **C**lass name at the top, its **R**esponsibilities down the left, and its **C**ollaborators down the right. That's the whole technique — invented by **Kent Beck and Ward Cunningham** in 1989 as a way to *teach* object-oriented thinking, and still one of the fastest, cheapest ways to sketch a design with a group of people around a table.",
      },
      {
        type: "p",
        text: "Think of casting a play. Before you build any sets, you assign **roles** to actors: *you carry the message, you guard the gate, you settle the bill.* A CRC card is an actor's role sheet — what this object is responsible for, and which other actors it has to speak to on stage. The genius is the *index card*: it's deliberately tiny. If a class's responsibilities won't fit on a small card, that's a loud signal the class is doing too much and should be split. The physical limit does the design critique for you.",
      },
      {
        type: "p",
        text: "CRC sits one rung *below* a UML class diagram. It's not a formal artifact you keep forever; it's a brainstorming and discovery tool. You shuffle cards, scribble on them, tear them up, and redo — and out of that play-acting falls a candidate set of classes, their responsibilities, and the wiring between them, ready to be drawn up properly afterwards.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A CRC card is an index card naming **one class**, what it's **responsible** for, and which classes it **collaborates** with — and if the responsibilities don't fit on the card, the class is doing too much.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three regions of a card" },
      {
        type: "p",
        text: "Every CRC card has the same layout. The **class name** goes across the top. The **left column** lists *responsibilities* — the things this class *knows* (data it holds) or *does* (operations it performs), written as short verb phrases like \"calculate total\" or \"hold line items.\" The **right column** lists *collaborators* — the other classes this one must talk to in order to meet its responsibilities. Responsibilities and collaborators usually line up: a responsibility on the left that needs help from another class names that class on the right.",
      },
      {
        type: "code",
        language: "text",
        filename: "order.crc",
        code: `┌─────────────────────────────────────────────┐
│  Order                              (Class)  │
├──────────────────────────┬──────────────────┤
│  Responsibilities        │  Collaborators   │
├──────────────────────────┼──────────────────┤
│  • hold the line items   │  OrderLine       │
│  • calculate the total   │  OrderLine       │
│  • know the customer     │  Customer        │
│  • request payment       │  Payment         │
└──────────────────────────┴──────────────────┘`,
      },
      {
        type: "p",
        text: "Notice how each responsibility on the left maps to a collaborator on the right. \"Calculate the total\" can't be done alone — `Order` has to ask each `OrderLine` for its subtotal — so `OrderLine` appears as a collaborator. That two-column pairing is what turns a vague class name into a concrete, testable role.",
      },
      { type: "h", text: "Brainstorm the cards as a group" },
      {
        type: "p",
        text: "You start by reading a use case and pulling out the **nouns** as candidate classes — `Customer`, `Order`, `Product`, `Payment` — and writing each on its own physical card. Then, with the team gathered around the table, you hand the cards out and assign responsibilities by asking, for each thing the system must do, *\"whose job is this?\"* The cards are cheap and movable on purpose: anyone can pick one up, cross something out, or tear it up and start over. Because everyone can see and touch the deck, the *whole group* designs together instead of one person at a whiteboard.",
      },
      { type: "h", text: "The heart of it: role-play a scenario" },
      {
        type: "p",
        text: "The real magic isn't writing the cards — it's **enacting a scenario** with them. You pick a concrete use case (\"a customer checks out their cart\") and walk it **step by step**. For each step, you ask *\"which card is responsible for this?\"*, physically **pick up that card**, and act as if you are that object. To do the step, the object almost always needs help — and the moment you say *\"to total the order, I ask each line for its price,\"* you've discovered a **collaborator**. You point from the active card to the cards it talks to, and those arrows become the relationships in your design.",
      },
      {
        type: "p",
        text: "Walking the scenario this way surfaces three things at once: **missing responsibilities** (a step nobody's card can do), **missing classes** (a step that needs an object you forgot to create), and the **collaboration graph** (who calls whom). It's a dry run of the system performed by people holding cards — and it finds design holes far faster and cheaper than writing code would.",
      },
      { type: "h", text: "Too many responsibilities is a smell" },
      {
        type: "p",
        text: "As you role-play, watch the cards. If one card keeps getting picked up for *everything* and its responsibility list overflows the index card, that's a **God class** forming — low cohesion, too many reasons to change. The fix is to **split it**: peel some responsibilities onto a new card and hand them off. This is exactly the **Single Responsibility Principle** and **high cohesion** you met earlier, now made physical: the size of the card is your cohesion budget.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Keep responsibilities high-level and few",
        text: "Write responsibilities as short, high-level verb phrases, and keep them few — a handful per card, not twenty. If it doesn't fit on the card, the class is doing too much. The index card's small size is a *feature*: it forces brevity and exposes bloated classes at a glance.",
      },
      { type: "h", text: "A low-cost precursor to diagrams" },
      {
        type: "p",
        text: "CRC is deliberately *informal*. There's no rigorous notation, no tool, no version control — just cards you're happy to throw away. That cheapness is the point: you can explore three different decompositions in the time it would take to draw one careful class diagram. Once the deck stabilizes and the scenarios run cleanly, the cards translate almost directly into a **UML class diagram** (cards → classes, responsibilities → methods/fields, collaborators → associations) and the role-play steps into a **sequence diagram**.",
      },
      {
        type: "callout",
        variant: "info",
        title: "CRC feeds class diagrams and GRASP",
        text: "CRC is the brainstorming front-end to formal modeling: the cards become a class diagram and the walkthrough becomes a sequence diagram. Deciding *who* owns each responsibility while you role-play is exactly the responsibility-assignment question that **GRASP** (Information Expert, Creator, Controller…) gives you principled answers to.",
      },
    ],

    handsOn: [
      {
        title: "01 · Read the deck, then step the scenario",
        body: "Five CRC cards load — **Cashier**, **Order**, **OrderLine**, **Product**, **Payment** — each with its *responsibilities* (left) and *collaborators* (right). With the scenario set to *\"Customer checks out a cart\"*, press **Next** to take the first step. The console states the action (e.g. *\"start a new order\"*), the **responsible card lights up**, and arrows are drawn to each collaborator it must talk to. Keep pressing **Next** to walk the whole checkout end to end, then **Prev** to step back.",
      },
      {
        title: "02 · Quiz yourself on who owns each step",
        body: "Toggle **Quiz me** on. Now, before each step is revealed, you must click the card you think is **responsible** for that action. Pick **Order** for *\"calculate the total\"* and you get a ✓; pick the wrong card and you get a ✗ with the answer. The *active card* and *collaborations drawn* indicators update as you go — this is the role-play forcing you to assign responsibilities deliberately.",
      },
      {
        title: "03 · Switch scenarios and reset",
        body: "Use the **scenario selector** to switch to *\"Payment is declined\"* and step through it: watch how `Payment` now collaborates differently and the arrows redraw. Hit **Reset** at any time to clear the highlights, rewind to step zero, and start the walkthrough fresh — exactly like tearing up the cards and re-enacting the scenario from scratch.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "checkout.ts",
        code: `// Cards translated to skeletons: responsibilities → methods, collaborators → fields.
//
//   Order        resp: hold lines, calc total, request payment   collab: OrderLine, Payment
//   OrderLine    resp: know product & qty, give subtotal          collab: Product
//   Product      resp: know its price                             collab: —
//   Payment      resp: charge the customer                        collab: —

class Product {
  constructor(public name: string, public price: number) {} // "know its price"
}

class OrderLine {
  constructor(private product: Product, private qty: number) {} // collaborator: Product
  subtotal(): number {
    return this.product.price * this.qty; // "give subtotal" — asks Product for its price
  }
}

class Payment {
  charge(amount: number): boolean {       // "charge the customer"
    return amount > 0;
  }
}

class Order {
  private lines: OrderLine[] = [];        // collaborator: OrderLine
  constructor(private payment: Payment) {} // collaborator: Payment

  addLine(line: OrderLine): void { this.lines.push(line); } // "hold the line items"

  total(): number {                                          // "calculate the total"
    return this.lines.reduce((sum, l) => sum + l.subtotal(), 0);
  }

  checkout(): boolean {                                      // "request payment"
    return this.payment.charge(this.total());
  }
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Checkout.java",
        code: `// Cards → skeletons: responsibilities become methods, collaborators become fields.
import java.util.ArrayList;
import java.util.List;

class Product {                                  // resp: know its price
    final String name; final double price;
    Product(String name, double price) { this.name = name; this.price = price; }
}

class OrderLine {                                // collaborator: Product
    private final Product product;
    private final int qty;
    OrderLine(Product product, int qty) { this.product = product; this.qty = qty; }
    double subtotal() { return product.price * qty; }   // asks Product for its price
}

class Payment {                                  // resp: charge the customer
    boolean charge(double amount) { return amount > 0; }
}

class Order {                                    // collaborators: OrderLine, Payment
    private final List<OrderLine> lines = new ArrayList<>();
    private final Payment payment;
    Order(Payment payment) { this.payment = payment; }

    void addLine(OrderLine line) { lines.add(line); }   // "hold the line items"

    double total() {                                    // "calculate the total"
        return lines.stream().mapToDouble(OrderLine::subtotal).sum();
    }

    boolean checkout() {                                // "request payment"
        return payment.charge(total());
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "checkout.py",
        code: `# Cards → skeletons: responsibilities become methods, collaborators become fields.
from dataclasses import dataclass, field


@dataclass
class Product:                       # resp: know its price
    name: str
    price: float


@dataclass
class OrderLine:                     # collaborator: Product
    product: Product
    qty: int

    def subtotal(self) -> float:     # "give subtotal" — asks Product for its price
        return self.product.price * self.qty


class Payment:                       # resp: charge the customer
    def charge(self, amount: float) -> bool:
        return amount > 0


@dataclass
class Order:                         # collaborators: OrderLine, Payment
    payment: Payment
    lines: list[OrderLine] = field(default_factory=list)

    def add_line(self, line: OrderLine) -> None:  # "hold the line items"
        self.lines.append(line)

    def total(self) -> float:                     # "calculate the total"
        return sum(line.subtotal() for line in self.lines)

    def checkout(self) -> bool:                   # "request payment"
        return self.payment.charge(self.total())`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "checkout.cpp",
        code: `// Cards → skeletons: responsibilities become methods, collaborators become members.
#include <string>
#include <vector>

struct Product {                          // resp: know its price
    std::string name;
    double price;
};

class OrderLine {                         // collaborator: Product
    Product product;
    int qty;
public:
    OrderLine(Product p, int q) : product(p), qty(q) {}
    double subtotal() const { return product.price * qty; } // asks Product for its price
};

class Payment {                           // resp: charge the customer
public:
    bool charge(double amount) const { return amount > 0; }
};

class Order {                             // collaborators: OrderLine, Payment
    std::vector<OrderLine> lines;
    Payment payment;
public:
    explicit Order(Payment p) : payment(p) {}

    void addLine(const OrderLine& line) { lines.push_back(line); } // "hold the line items"

    double total() const {                                         // "calculate the total"
        double sum = 0;
        for (const auto& l : lines) sum += l.subtotal();
        return sum;
    }

    bool checkout() const { return payment.charge(total()); }      // "request payment"
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When CRC cards earn their keep" },
      {
        type: "p",
        text: "Reach for CRC at the *start* of design, right after you have use cases but before any diagrams or code. It shines when a group needs to agree on a decomposition quickly — onboarding people onto an existing design, exploring an unfamiliar domain, or settling an argument about *who should own a responsibility*. Because the cards are throwaway, it's ideal precisely when you're *unsure* and want to try several shapes cheaply.",
      },
      {
        type: "p",
        text: "It's less useful once the design is settled and detailed — at that point a real class diagram, sequence diagram, and code carry the weight. CRC is a discovery tool, not a system of record; don't try to make the cards authoritative or keep them in sync forever.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't over-formalize the cards",
        text: "The value of CRC is its informality and speed. If you find yourself adding fields for types, multiplicities, and method signatures, you've outgrown the cards — graduate to a UML class diagram. Keep responsibilities verb-phrase-short and stay willing to tear cards up.",
      },
    ],

    tradeoffs: {
      pros: [
        "Cheap and fast — index cards cost nothing and a whole decomposition can be explored and discarded in minutes.",
        "Collaborative — everyone around the table can see, touch, and move the cards, so the whole group designs together.",
        "Surfaces design holes early — role-playing a scenario exposes missing classes, missing responsibilities, and God classes before any code exists.",
        "Smooth on-ramp to UML — cards map almost directly to a class diagram and the walkthrough to a sequence diagram.",
      ],
      cons: [
        "Informal and non-persistent — cards aren't a lasting artifact and can drift from the real design if relied on too long.",
        "Scales poorly — a deck of dozens of cards becomes hard to lay out and role-play for a large system.",
        "Group-dependent — much of the value comes from live discussion, so it's weaker as a solo, asynchronous activity.",
        "Coarse — it captures responsibilities and collaborators but not types, multiplicities, or detailed signatures.",
      ],
    },

    furtherReading: [
      {
        label: "Beck & Cunningham — \"A Laboratory For Teaching Object-Oriented Thinking\" (OOPSLA '89)",
        href: "https://c2.com/doc/oopsla89/paper.html",
        note: "The original 1989 paper that introduced CRC cards — short, readable, and the source of the whole technique.",
        kind: "paper",
      },
      {
        label: "Wikipedia — Class-responsibility-collaboration card",
        href: "https://en.wikipedia.org/wiki/Class-responsibility-collaboration_card",
        note: "Concise definition of the three regions and how CRC fits between use cases and class diagrams.",
        kind: "article",
      },
      {
        label: "Agile Modeling — CRC Cards: An Agile Introduction",
        href: "https://agilemodeling.com/artifacts/crcModel.htm",
        note: "Scott Ambler's practical walkthrough of brainstorming cards and role-playing scenarios with a team.",
        kind: "article",
      },
      {
        label: "Agile Alliance — What are CRC Cards?",
        href: "https://agilealliance.org/glossary/crc-cards/",
        note: "A short glossary entry placing CRC cards in the XP / agile design context.",
        kind: "article",
      },
      {
        label: "Object Design: Roles, Responsibilities, and Collaborations — Rebecca Wirfs-Brock & Alan McKean",
        note: "The definitive book on responsibility-driven design, the philosophy CRC cards grew into.",
        kind: "book",
      },
      {
        label: "Extreme Programming Explained — Kent Beck",
        note: "From a co-inventor of CRC; situates cards within lightweight, collaborative, throwaway-friendly design.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "crc-q1",
        question: "What do the three letters in CRC stand for?",
        options: [
          { id: "a", label: "Create, Read, Cache." },
          { id: "b", label: "Class, Responsibility, Collaborator." },
          { id: "c", label: "Component, Relation, Constraint." },
          { id: "d", label: "Class, Reference, Container." },
        ],
        correctOptionId: "b",
        explanation:
          "CRC = Class–Responsibility–Collaborator. Each index card names one class, lists what it's responsible for (knows or does), and lists the other classes it collaborates with.",
      },
      {
        id: "crc-q2",
        question: "On a CRC card, what goes in the two columns below the class name?",
        options: [
          { id: "a", label: "Method signatures on the left, field types on the right." },
          { id: "b", label: "Responsibilities (what it knows/does) on the left, collaborators (classes it talks to) on the right." },
          { id: "c", label: "Pros on the left, cons on the right." },
          { id: "d", label: "Inputs on the left, outputs on the right." },
        ],
        correctOptionId: "b",
        explanation:
          "The left column lists responsibilities — data the class holds or operations it performs — and the right column lists the collaborators it must talk to in order to meet those responsibilities.",
      },
      {
        id: "crc-q3",
        question: "What is the point of 'role-playing' or 'enacting a scenario' with CRC cards?",
        options: [
          { id: "a", label: "To assign blame when a bug is found in production." },
          { id: "b", label: "To walk a use case step by step, picking up the responsible card at each step, which surfaces missing classes, missing responsibilities, and collaborators." },
          { id: "c", label: "To measure how fast each class runs at runtime." },
          { id: "d", label: "To generate compilable code automatically from the cards." },
        ],
        correctOptionId: "b",
        explanation:
          "Role-play is the heart of the technique: walking a scenario and asking 'whose job is this step?' reveals which card is responsible and which collaborators it needs — exposing design holes cheaply, before any code.",
      },
      {
        id: "crc-q4",
        question: "During role-play, one card's responsibility list keeps growing until it won't fit on the index card. What does this signal?",
        options: [
          { id: "a", label: "The class is well designed because it does so much." },
          { id: "b", label: "You should buy a bigger index card." },
          { id: "c", label: "A God class with low cohesion is forming — split its responsibilities onto a new card." },
          { id: "d", label: "Nothing — card size is irrelevant to design." },
        ],
        correctOptionId: "c",
        explanation:
          "The card's small size is a cohesion budget. Overflowing responsibilities means the class is doing too much (a God class, violating the Single Responsibility Principle) — split it by moving responsibilities onto a new card.",
      },
      {
        id: "crc-q5",
        question: "How does CRC relate to formal UML modeling?",
        options: [
          { id: "a", label: "CRC replaces UML entirely; you never need diagrams." },
          { id: "b", label: "CRC is a cheap, informal precursor: cards become classes, responsibilities become methods/fields, collaborators become associations, and scenarios become sequence diagrams." },
          { id: "c", label: "CRC is a stricter, more formal notation than UML." },
          { id: "d", label: "They are unrelated; CRC is only for documentation." },
        ],
        correctOptionId: "b",
        explanation:
          "CRC is the low-cost brainstorming front-end to formal design. Once the deck stabilizes, cards translate almost directly into a UML class diagram, and the role-play walkthrough becomes a sequence diagram.",
      },
    ],
  },
};
