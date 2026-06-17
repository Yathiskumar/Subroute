import type { RoadmapLesson } from "@/lib/content/types";

export const domainModeling: RoadmapLesson = {
  title: "Domain Modeling",
  oneLiner:
    "A domain model is a web of objects that mirror the real-world domain in the *exact language the domain experts use* — and the first skill is telling Entities, Value Objects, and Services apart.",
  difficulty: "intermediate",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/domain-modeling.html",
  content: {
    prototypeCaption:
      "Ten concepts from an e-commerce domain start in an **unsorted tray**. Drop each one into the bucket where it belongs — **Entity** (has identity & a lifecycle), **Value Object** (immutable, compared by value), or **Service** (stateless behavior). The console gives a one-line reason for every call, and a **model-correctness** meter climbs as you get them right. Once everything is sorted, hit **reveal model** to see how `Order` becomes an *aggregate root* holding `OrderLine`s and `Money`.",

    overview: [
      {
        type: "p",
        text: "A **domain model** is a set of objects that mirror the real-world domain your software is about — orders, customers, payments, money — and the relationships between them. It's not your database schema and it's not your UI; it's a *conceptual model made of code*, where each class represents a meaningful concept and carries both the **data** and the **behavior** that belong to it. Done well, a domain model lets you read the code and recognize the business in it.",
      },
      {
        type: "p",
        text: "The thing that makes a model *good* is that it speaks the **ubiquitous language** — the same words the domain experts use. Picture a local's hand-drawn map: it labels places with the names locals actually say, not GPS coordinates. A stranger and a local can point at the same spot and mean the same thing. A domain model is that map for your business: when the warehouse manager says \"line item\" and your code has an `OrderLine`, when accounting says \"a refund is money owed back\" and your `Money` value object knows how to subtract — analyst and engineer are finally pointing at the same thing.",
      },
      {
        type: "p",
        text: "The very first modeling skill — the one this lesson drills — is **classifying** each concept correctly. Is this thing an **Entity** (it has a distinct identity that survives change), a **Value Object** (it's defined purely by its attributes), or a **Service** (it's behavior that doesn't belong to any single object)? Get those three right and most of the model falls into place.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A domain model is **real-world concepts as objects**, named in the **ubiquitous language** of the domain experts — and every concept is either an **Entity** (identity), a **Value Object** (just its values), or a **Service** (homeless behavior).",
      },
    ],

    howItWorks: [
      { type: "h", text: "Entity — identity that survives change" },
      {
        type: "p",
        text: "An **Entity** is a thing you track *as itself* over time. It has a distinct **identity** — usually an ID — that stays the same even as every other attribute changes. Order #4471 is the same order whether it's `pending`, `paid`, or `shipped`; the customer renaming themselves doesn't make them a different `Customer`. The defining test: **two Entities with identical fields are still two different things.** Two brand-new orders that happen to have the same items and total are not the same order — they have different IDs. So Entity equality is by **identity**, not by value: `a.equals(b)` means `a.id === b.id`.",
      },
      {
        type: "p",
        text: "Entities also have a **lifecycle** — they're created, they change state, they may eventually be archived or deleted — and the model is usually responsible for protecting the *rules* of that lifecycle (you can't ship an unpaid order). Typical entities: `Order`, `Customer`, `Product`, `Account`.",
      },
      { type: "h", text: "Value Object — defined entirely by its attributes" },
      {
        type: "p",
        text: "A **Value Object** has **no identity** — it's defined *completely* by its attributes, and two value objects with equal attributes are *interchangeable*. Money is the classic example: two separate $5 notes are equal; you'd never ask \"but which $5 is it?\" The same goes for an `Address`, a `DateRange`, a `Color`, an `EmailAddress`. Because they have no identity, value objects should be **immutable**: once created they never change. Need a different amount? You don't mutate the `Money` — you create a *new* one. This is exactly the immutability you learned earlier, and the reason value objects must override `equals`/`hashCode` to compare by **value**, not by reference.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Value Objects sit on top of two earlier foundations",
        text: "A Value Object is where the **immutability** and **equals/hashCode** lessons pay off. Compare by *value* (override `equals`/`hashCode` so equal attributes are equal), and make the object *immutable* so it can be shared freely and used safely as a map key. Mutable value objects are a bug factory — change one and you silently change everything that aliased it.",
      },
      { type: "h", text: "Service — behavior with no natural home" },
      {
        type: "p",
        text: "Sometimes an operation involves several objects and doesn't *belong* to any single one. Transferring money touches two accounts; computing tax depends on jurisdiction rules, not on the order alone. Forcing that logic onto one entity makes it awkward (\"why does `Account` know how to debit *another* account?\"). A **Service** is the home for such behavior: a **stateless** object named after a verb — `TransferService`, `TaxCalculator`, `PaymentService`, `PricingService`. Stateless is the key word: a service holds no domain data of its own; it operates *on* entities and value objects passed to it. If you find yourself adding fields to a service, it probably wanted to be an entity.",
      },
      { type: "h", text: "Aggregate — a consistency boundary with one root" },
      {
        type: "p",
        text: "Real domains have clusters of objects that only make sense together. An `Order` owns its `OrderLine`s — a line item has no independent life outside its order. An **Aggregate** is such a cluster, treated as **one unit for consistency**, with a single **aggregate root** as the *only* entry point. Outside code talks to the `Order`; it never reaches in and grabs an `OrderLine` directly. The root enforces the invariants of the whole cluster — \"order total equals the sum of its lines,\" \"a shipped order can't add lines\" — so the rules can never be broken from the outside. Add a line by calling `order.addLine(...)`, and the `Order` (the root) keeps everything consistent.",
      },
      { type: "h", text: "A pure domain layer — no persistence or UI inside" },
      {
        type: "p",
        text: "The model stays valuable only if it stays **pure**: a domain object should be about the *business*, not about SQL, HTTP, or React. Keep database mapping, JSON serialization, and screen layout *out* of the model and *in* the layers around it (repositories, controllers, views). When the domain layer has no idea a database exists, you can test the business rules in milliseconds, swap the storage engine without touching the model, and read the code as a description of the domain rather than a tangle of framework calls.",
      },
      {
        type: "code",
        language: "typescript",
        code: `// ENTITY: identity-based equality — same id ⇒ same Order
class Order {
  constructor(public readonly id: string) {}   // identity persists through change
  equals(other: Order) { return other instanceof Order && other.id === this.id; }
}
const a = new Order("ord-1");
const b = new Order("ord-1");
a.equals(b);                 // true  — same identity, even if state differs

// VALUE OBJECT: value-based equality, immutable — no identity at all
class Money {
  constructor(readonly amount: number, readonly currency: string) {}  // frozen
  equals(o: Money) { return o.amount === this.amount && o.currency === this.currency; }
  add(o: Money) { return new Money(this.amount + o.amount, this.currency); } // returns NEW
}
new Money(5, "USD").equals(new Money(5, "USD"));   // true — two $5 are interchangeable`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Beware the anemic domain model",
        text: "If every domain class is just fields with getters and setters, and *all* the logic lives in `...Service` classes, you have an **anemic domain model** — an object-oriented facade over procedural code. It pays the full cost of a domain model and gets none of the benefit. The fix: **put behavior on the model.** `order.addLine(...)`, `order.total()`, and `money.add(...)` belong on `Order` and `Money`. Reserve services for the genuinely homeless behavior (`TransferService`), not as a dumping ground for logic that should live on an entity.",
      },
    ],

    handsOn: [
      {
        title: "01 · Classify a Value Object and read the reason",
        body: "From the unsorted tray, drop **Money** into the **Value Object** bucket. The console confirms with a one-line reason — `Money → Value Object: two $5 notes are interchangeable, no identity` — and the **model-correctness** meter ticks up. Try a wrong one on purpose: drop **Order** into **Value Object** and watch the ✗ feedback explain that an order has identity and a lifecycle, so it's an Entity.",
      },
      {
        title: "02 · Fill all three buckets and watch the meter",
        body: "Sort the remaining chips — `Customer`, `Product` and `OrderId` reveal Entity vs Value Object subtleties; `TaxCalculator` and `PaymentService` are stateless behavior; `Address`, `DateRange` and `EmailAddress` are pure values. The per-bucket counts and the **model-correctness** meter update with every drop. Use **Auto-classify** if you want to snap every chip into its correct bucket and study the result.",
      },
      {
        title: "03 · Reveal the aggregate",
        body: "Once everything is classified (or after Auto-classify), press **reveal model** to expand the **aggregate view**: `Order` sits at the top as the *aggregate root*, holding a list of `OrderLine`s, each carrying a `Money` value object — the relationship diagram that shows why `Order` is the only entry point. Hit **Reset** to clear the buckets and start over.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "domain.ts",
        code: `// VALUE OBJECT — immutable, equal by value, no identity
class Money {
  constructor(
    readonly amount: number,      // in minor units (cents)
    readonly currency: string,
  ) {
    Object.freeze(this);          // immutable
  }
  add(other: Money): Money {
    if (other.currency !== this.currency) throw new Error("currency mismatch");
    return new Money(this.amount + other.amount, this.currency);  // returns a NEW Money
  }
  equals(o: Money): boolean {
    return o instanceof Money && o.amount === this.amount && o.currency === this.currency;
  }
}

// VALUE OBJECT inside an entity — a line has no identity of its own
class OrderLine {
  constructor(readonly product: string, readonly qty: number, readonly unitPrice: Money) {}
  lineTotal(): Money {
    let sum = new Money(0, this.unitPrice.currency);
    for (let i = 0; i < this.qty; i++) sum = sum.add(this.unitPrice);
    return sum;
  }
}

// ENTITY / AGGREGATE ROOT — identity persists; the only entry point to its lines
class Order {
  private lines: OrderLine[] = [];
  constructor(readonly id: string, readonly currency = "USD") {}

  addLine(product: string, qty: number, unitPrice: Money): void {
    this.lines.push(new OrderLine(product, qty, unitPrice));   // root guards the invariant
  }
  total(): Money {
    return this.lines.reduce((sum, l) => sum.add(l.lineTotal()), new Money(0, this.currency));
  }
  equals(other: Order): boolean {
    return other instanceof Order && other.id === this.id;     // identity, not value
  }
}

const order = new Order("ord-4471");
order.addLine("Keyboard", 2, new Money(4999, "USD"));
order.addLine("Mouse", 1, new Money(2999, "USD"));
order.total();   // Money { amount: 12997, currency: "USD" }`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Domain.java",
        code: `import java.util.*;

// VALUE OBJECT — immutable, equal by value (records make this trivial)
record Money(long amount, String currency) {           // all fields final, equals/hashCode by value
    Money add(Money other) {
        if (!other.currency.equals(currency)) throw new IllegalArgumentException("currency mismatch");
        return new Money(amount + other.amount, currency);   // returns a NEW Money
    }
}

// VALUE OBJECT inside an entity — no identity of its own
record OrderLine(String product, int qty, Money unitPrice) {
    Money lineTotal() {
        Money sum = new Money(0, unitPrice.currency());
        for (int i = 0; i < qty; i++) sum = sum.add(unitPrice);
        return sum;
    }
}

// ENTITY / AGGREGATE ROOT — equality by id; the only entry point to its lines
final class Order {
    private final String id;
    private final String currency;
    private final List<OrderLine> lines = new ArrayList<>();

    Order(String id, String currency) { this.id = id; this.currency = currency; }

    void addLine(String product, int qty, Money unitPrice) {
        lines.add(new OrderLine(product, qty, unitPrice));    // root guards the invariant
    }
    Money total() {
        Money sum = new Money(0, currency);
        for (OrderLine l : lines) sum = sum.add(l.lineTotal());
        return sum;
    }
    @Override public boolean equals(Object o) {
        return o instanceof Order other && other.id.equals(id);   // identity, not value
    }
    @Override public int hashCode() { return id.hashCode(); }
}

class Demo {
    public static void main(String[] args) {
        Order order = new Order("ord-4471", "USD");
        order.addLine("Keyboard", 2, new Money(4999, "USD"));
        order.addLine("Mouse", 1, new Money(2999, "USD"));
        System.out.println(order.total());   // Money[amount=12997, currency=USD]
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "domain.py",
        code: `from dataclasses import dataclass, field
from typing import List


# VALUE OBJECT — frozen=True ⇒ immutable + equal/hash by value
@dataclass(frozen=True)
class Money:
    amount: int           # minor units (cents)
    currency: str

    def add(self, other: "Money") -> "Money":
        if other.currency != self.currency:
            raise ValueError("currency mismatch")
        return Money(self.amount + other.amount, self.currency)   # returns a NEW Money


# VALUE OBJECT inside an entity — no identity of its own
@dataclass(frozen=True)
class OrderLine:
    product: str
    qty: int
    unit_price: Money

    def line_total(self) -> Money:
        total = Money(0, self.unit_price.currency)
        for _ in range(self.qty):
            total = total.add(self.unit_price)
        return total


# ENTITY / AGGREGATE ROOT — equality by id; the only entry point to its lines
class Order:
    def __init__(self, id: str, currency: str = "USD") -> None:
        self.id = id
        self.currency = currency
        self._lines: List[OrderLine] = []

    def add_line(self, product: str, qty: int, unit_price: Money) -> None:
        self._lines.append(OrderLine(product, qty, unit_price))   # root guards the invariant

    def total(self) -> Money:
        total = Money(0, self.currency)
        for line in self._lines:
            total = total.add(line.line_total())
        return total

    def __eq__(self, other: object) -> bool:
        return isinstance(other, Order) and other.id == self.id   # identity, not value

    def __hash__(self) -> int:
        return hash(self.id)


order = Order("ord-4471")
order.add_line("Keyboard", 2, Money(4999, "USD"))
order.add_line("Mouse", 1, Money(2999, "USD"))
print(order.total())   # Money(amount=12997, currency='USD')`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "domain.cpp",
        code: `#include <string>
#include <vector>
#include <stdexcept>
#include <iostream>

// VALUE OBJECT — immutable (const fields), equal by value
struct Money {
    const long amount;        // minor units (cents)
    const std::string currency;

    Money add(const Money& o) const {
        if (o.currency != currency) throw std::invalid_argument("currency mismatch");
        return Money{amount + o.amount, currency};         // returns a NEW Money
    }
    bool operator==(const Money& o) const {                // equality by value
        return amount == o.amount && currency == o.currency;
    }
};

// VALUE OBJECT inside an entity — no identity of its own
struct OrderLine {
    std::string product;
    int qty;
    Money unitPrice;

    Money lineTotal() const {
        Money sum{0, unitPrice.currency};
        for (int i = 0; i < qty; ++i) sum = sum.add(unitPrice);
        return sum;
    }
};

// ENTITY / AGGREGATE ROOT — equality by id; the only entry point to its lines
class Order {
    std::string id_;
    std::string currency_;
    std::vector<OrderLine> lines_;
public:
    Order(std::string id, std::string currency = "USD")
        : id_(std::move(id)), currency_(std::move(currency)) {}

    void addLine(std::string product, int qty, Money unitPrice) {
        lines_.push_back(OrderLine{std::move(product), qty, unitPrice}); // root guards invariant
    }
    Money total() const {
        Money sum{0, currency_};
        for (const auto& l : lines_) sum = sum.add(l.lineTotal());
        return sum;
    }
    bool operator==(const Order& o) const { return id_ == o.id_; }       // identity, not value
};

int main() {
    Order order{"ord-4471"};
    order.addLine("Keyboard", 2, Money{4999, "USD"});
    order.addLine("Mouse", 1, Money{2999, "USD"});
    std::cout << order.total().amount << " " << order.total().currency << "\\n"; // 12997 USD
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When a domain model earns its keep" },
      {
        type: "p",
        text: "Reach for a rich domain model when the **business logic is the hard part** — interesting rules, invariants, state transitions, and money. That's where entities-with-behavior, immutable value objects, and aggregate roots that protect their invariants pay off, and where speaking the *ubiquitous language* keeps engineers and domain experts in sync. Start the design by listing the nouns of the domain and classifying each as Entity, Value Object, or Service — exactly the drill in the prototype.",
      },
      {
        type: "p",
        text: "When the app is mostly **CRUD over forms** with little real logic, a heavyweight model is overkill — a thin data layer is fine, and forcing DDD machinery onto it just adds ceremony. The judgment call is *how much logic is there, and how often does it change?* The more the rules churn, the more a clear model with behavior-on-the-objects repays the effort.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't let the model leak its surroundings",
        text: "The fastest way to ruin a domain model is to let persistence and transport concerns seep in — ORM annotations everywhere, JSON shape dictating your classes, validation tied to HTTP. Keep the domain layer **pure** and push those concerns to the edges. If you can't unit-test a business rule without a database running, the model has already leaked.",
      },
    ],

    tradeoffs: {
      pros: [
        "The code reads like the business — concepts and the ubiquitous language map straight onto classes, so experts and engineers point at the same things.",
        "Rules live where they belong — behavior on entities and value objects, invariants protected by aggregate roots, instead of scattered across services.",
        "Immutable value objects are safe to share, cache, and use as map keys, and they remove a whole class of aliasing bugs.",
        "A pure domain layer is fast and trivial to unit-test, and survives swapping the database, framework, or UI.",
      ],
      cons: [
        "It's overkill for simple CRUD apps — modeling machinery adds ceremony when there's barely any logic to protect.",
        "Classifying concepts (Entity vs Value Object vs where an aggregate boundary goes) takes real judgment and is easy to get wrong early.",
        "Drift toward an anemic model is constant pressure — logic keeps sneaking into services unless the team is disciplined.",
        "Keeping the model pure requires extra layers (repositories, mappers) to hold persistence and transport at arm's length.",
      ],
    },

    furtherReading: [
      {
        label: "Martin Fowler — Domain Model (PoEAA)",
        href: "https://martinfowler.com/eaaCatalog/domainModel.html",
        note: "The canonical pattern definition: an object model of the domain incorporating both behavior and data — the one-page reference behind this whole lesson.",
        kind: "article",
      },
      {
        label: "Martin Fowler — AnemicDomainModel",
        href: "https://martinfowler.com/bliki/AnemicDomainModel.html",
        note: "Why data-only classes with all logic in services are an anti-pattern — directly motivates the 'put behavior on the model' warning.",
        kind: "article",
      },
      {
        label: "Martin Fowler — ValueObject",
        href: "https://martinfowler.com/bliki/ValueObject.html",
        note: "Value-based equality and immutability across several languages — the bridge from the equals/hashCode and immutability foundations into modeling.",
        kind: "article",
      },
      {
        label: "Eric Evans — DDD Reference (free PDF)",
        href: "https://www.domainlanguage.com/ddd/reference/",
        note: "Evans' own concise definitions and pattern summaries of Entity, Value Object, Service, and Aggregate — a free, printable cheat sheet for the building blocks.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Domain model",
        href: "https://en.wikipedia.org/wiki/Domain_model",
        note: "A neutral overview: a conceptual model of the domain, independent of database and architecture, usually drawn as a UML class diagram.",
        kind: "article",
      },
      {
        label: "Wikipedia — Value object",
        href: "https://en.wikipedia.org/wiki/Value_object",
        note: "Equality not based on identity, immutability, and short implementation examples across C#, C++, Python, Java, Kotlin, and Ruby.",
        kind: "article",
      },
      {
        label: "Eric Evans — Domain-Driven Design: Tackling Complexity in the Heart of Software",
        note: "The book that introduced this vocabulary — ubiquitous language, entities, value objects, services, and aggregates — in depth.",
        kind: "book",
      },
      {
        label: "Vaughn Vernon — Implementing Domain-Driven Design",
        note: "The hands-on companion to Evans, with concrete guidance on drawing aggregate boundaries and keeping the model pure.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "dm-q1",
        question: "What distinguishes an Entity from a Value Object?",
        options: [
          { id: "a", label: "An Entity is faster to construct; a Value Object uses less memory." },
          { id: "b", label: "An Entity has a distinct identity that persists through change; a Value Object has no identity and is defined entirely by its attributes." },
          { id: "c", label: "An Entity is immutable; a Value Object is mutable." },
          { id: "d", label: "They're the same thing — the names are interchangeable." },
        ],
        correctOptionId: "b",
        explanation:
          "An Entity is tracked as itself over time via an identity (usually an ID), so two entities with identical fields are still different. A Value Object has no identity — equal attributes mean equal objects, which is why value objects are compared by value and kept immutable.",
      },
      {
        id: "dm-q2",
        question: "Two newly created Order objects happen to have the same items and the same total. Are they equal?",
        options: [
          { id: "a", label: "Yes — same fields means the same order." },
          { id: "b", label: "No — Order is an Entity, so equality is by identity (id); same fields are still two different orders." },
          { id: "c", label: "Yes — Order is a Value Object, so it's compared by value." },
          { id: "d", label: "Only if they also have the same timestamp." },
        ],
        correctOptionId: "b",
        explanation:
          "Order is an Entity. Entity equality is by identity, not by value — two distinct orders have different IDs even when every other field matches. This is the opposite of a Value Object like Money, where equal attributes do mean equal.",
      },
      {
        id: "dm-q3",
        question: "Why should a Value Object such as Money be immutable?",
        options: [
          { id: "a", label: "Because mutable objects can't be stored in a database." },
          { id: "b", label: "Because it has identity that must never change." },
          { id: "c", label: "So it can be shared and used safely (e.g. as a map key) without one place silently changing it for another — and its value equality stays consistent." },
          { id: "d", label: "Immutability has nothing to do with value objects." },
        ],
        correctOptionId: "c",
        explanation:
          "A value object is defined by its attributes, so those attributes must not change underneath anyone who holds it. Immutability (returning a new Money instead of mutating) prevents aliasing bugs and keeps value-based equality and hashing stable — connecting straight to the immutability and equals/hashCode foundations.",
      },
      {
        id: "dm-q4",
        question: "Where does the behavior of transferring money between two accounts most naturally belong?",
        options: [
          { id: "a", label: "On a stateless domain Service such as TransferService, since it spans two accounts and belongs to no single one." },
          { id: "b", label: "On the Money value object, since money is involved." },
          { id: "c", label: "Nowhere — transfers shouldn't be modeled in the domain." },
          { id: "d", label: "On a new Entity created for each transfer that stores its own balance." },
        ],
        correctOptionId: "a",
        explanation:
          "A transfer touches two accounts and naturally belongs to neither, so it's homeless behavior — exactly what a stateless Service is for. The service holds no domain data of its own; it operates on the entities passed to it. (A transfer might also be recorded as its own entity/event, but the operation itself is service behavior.)",
      },
      {
        id: "dm-q5",
        question: "In an aggregate where Order is the root containing OrderLines, how should outside code add a line item?",
        options: [
          { id: "a", label: "By reaching into the Order and pushing onto its internal list directly." },
          { id: "b", label: "By calling a method on the root, e.g. order.addLine(...), so the root can enforce the aggregate's invariants." },
          { id: "c", label: "By creating an OrderLine independently and storing it on its own, separate from any Order." },
          { id: "d", label: "By moving all line logic into a LineService and bypassing the Order entirely." },
        ],
        correctOptionId: "b",
        explanation:
          "The aggregate root is the only entry point. Outside code goes through order.addLine(...) so the Order can keep the whole cluster consistent (total = sum of lines, no lines on a shipped order). Reaching past the root or giving OrderLine an independent life breaks the consistency boundary the aggregate exists to protect.",
      },
    ],
  },
};
