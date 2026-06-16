import type { RoadmapLesson } from "@/lib/content/types";

export const immutabilityAndValueObjects: RoadmapLesson = {
  title: "Immutability & Value Objects",
  oneLiner:
    "An object that can't change after construction is simpler, safe to share, and thread-safe by default — \"changes\" return a new object instead.",
  difficulty: "beginner",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/immutability-and-value-objects.html",
  content: {
    prototypeCaption:
      "Two references, `aliasA` and `aliasB`, both point at one `Money(100, \"USD\")` box. In **Mutable** mode, pressing `aliasA.setAmount(0)` corrupts the shared box and `aliasB` *unexpectedly* reads 0 too — the shield flashes **red**. Switch to **Immutable** mode: `aliasA.plus(...)` builds a *new* box and swings only `aliasA`'s arrow to it; `aliasB` stays on the untouched original and the change flashes **green**.",

    overview: [
      {
        type: "p",
        text: "Think about a banknote with the number $100 printed on it. You can't *edit* a $100 bill into a $50 bill — the value is fixed the moment it's made. If you want $50, you hand over the $100 and get a *different* note back. An **immutable** object works exactly like that: once it's built, its data never changes. Any \"change\" hands you a brand-new object and leaves the original alone.",
      },
      {
        type: "p",
        text: "Most bugs in shared state come from something quietly editing an object that other code is still relying on. Immutability removes that whole category of bug by making the edit *impossible*. A date, a coordinate, a sum of money — these are things whose identity *is* their value, and they're far easier to reason about when they simply can't be mutated out from under you.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Don't change the object — replace it. An immutable value never mutates; operations like `plus` or `withAmount` return a **new** object, so anyone still holding the old one is safe.",
      },
    ],

    howItWorks: [
      { type: "h", text: "What makes an object immutable" },
      {
        type: "p",
        text: "An object is immutable when there is *no legal way* to change its data after it's constructed. In practice that means three things working together:",
      },
      {
        type: "ul",
        items: [
          "**Set every field once, at construction.** Mark fields `final` (Java), `readonly` (TypeScript), or `const` (C++) so the compiler refuses any later write.",
          "**Expose no setters.** Provide getters if you like, but nothing that writes. The only moment the data is set is in the constructor.",
          "**Deep-copy on the way in and out.** If the constructor receives a mutable thing (a list, an array, a date), store a *copy*, not the caller's object. If a getter returns a mutable thing, return a *copy* of that too.",
        ],
      },
      { type: "h", text: "The aliasing bug — one mutation, two surprises" },
      {
        type: "p",
        text: "Here's the trap immutability saves you from. When you assign one object to two variables, you don't get two objects — you get two *references* to the **same** object. Mutate it through one, and the other sees the change too, often somewhere far away in the code that never asked for it.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "aliasing.ts",
        code: `// MUTABLE Money — has a setter
const aliasA = new MutableMoney(100, "USD");
const aliasB = aliasA;          // NOT a copy — same object, two names

aliasA.setAmount(0);            // mutate through one reference...
console.log(aliasB.amount);     // 0  ← aliasB changed too! spooky action

// With an IMMUTABLE Money there is no setAmount at all,
// so this bug simply cannot be written.`,
      },
      {
        type: "p",
        text: "This is *aliasing*. It's not a typo or a logic slip — the code reads perfectly. The damage is that `aliasB` was silently corrupted by something it had no relationship with. Defensive copying (storing and returning copies) is one fix; making the object immutable is the stronger one, because then there's nothing to mutate in the first place.",
      },
      { type: "h", text: "How an immutable object \"changes\"" },
      {
        type: "p",
        text: "If you can't edit the object, how do you get a different value? You build a new one. A method like `plus(amount)` doesn't touch `this` — it constructs and returns a fresh object with the new value, leaving the original exactly as it was:",
      },
      {
        type: "code",
        language: "typescript",
        filename: "money.ts",
        code: `class Money {
  constructor(readonly amount: number, readonly currency: string) {}

  plus(extra: number): Money {
    return new Money(this.amount + extra, this.currency); // NEW object
  }

  withAmount(amount: number): Money {
    return new Money(amount, this.currency);              // NEW object
  }
}

const a = new Money(100, "USD");
const b = a.plus(50);   // b is Money(150,"USD"); a is STILL Money(100,"USD")`,
      },
      {
        type: "p",
        text: "Notice the shape: every \"mutator\" is really a *factory* that returns a new instance. The original is read-only and survives untouched, so any other reference pointing at it is never surprised.",
      },
      { type: "h", text: "Value objects: equality by value, no identity" },
      {
        type: "p",
        text: "A **value object** is a small immutable object whose *identity is its value*. Two `Money(100, \"USD\")` objects are completely interchangeable — it makes no sense to ask *which* $100 you have, only *whether* it's $100. So value objects compare by **value**: `Money(100,\"USD\").equals(Money(100,\"USD\"))` is `true` even though they're separate instances in memory.",
      },
      {
        type: "p",
        text: "Contrast that with an **entity** — a `User`, an `Order`, a `BankAccount`. Two users named \"Alice\" with the same balance are *not* the same user; each has its own identity (an id) that persists even as its data changes. Entities are compared by id; value objects are compared by their fields. Money, dates, coordinates, colors, and quantities are classic value objects.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Shallow vs. deep immutability",
        text: "A `final`/`readonly` field only freezes the *reference*, not what it points at. An immutable object holding a `final List` whose contents can still be added to is **not** truly immutable — callers can mutate the list behind your back. Real immutability is *deep*: copy the list in, store an unmodifiable view, and never hand out the live collection. In JavaScript, `Object.freeze()` is likewise shallow — it freezes the top level only.",
      },
      { type: "h", text: "Thread-safety, for free" },
      {
        type: "p",
        text: "Because an immutable object never changes, multiple threads can read it at the same time with *zero* locks, *zero* synchronization, and no chance of seeing a half-updated state. There's no write to race against. This is one of the biggest practical wins of immutability: shared, immutable data is automatically safe to pass anywhere, including across threads.",
      },
      { type: "h", text: "What each language gives you" },
      {
        type: "ul",
        items: [
          "**Java** — `final` fields and `record` types (which are immutable and get value equality for free).",
          "**Python** — `@dataclass(frozen=True)` raises on any attribute write; `tuple` is the built-in immutable sequence.",
          "**C++** — `const` members and methods marked `const`; \"mutators\" return a new value object.",
          "**TypeScript** — `readonly` fields (compile-time) plus `Object.freeze()` for a runtime, shallow freeze.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Trigger the aliasing bug",
        body: "Start in **Mutable** mode. Both `aliasA` and `aliasB` point at one `Money(100)` box. Press `aliasA.setAmount(0)` — the shared box flashes **red** and the log warns `aliasB unexpectedly changed!`. One mutation corrupted a reference that never asked for it.",
      },
      {
        title: "02 · Flip to Immutable and repeat the action",
        body: "Toggle the mode to **Immutable**, then press `aliasA.plus(...)`. A *new* box appears, `aliasA`'s arrow swings over to it, and `aliasB` stays on the original `100` box — flashing **green**. Same intent, but the original is untouched: `aliasB safe — original unchanged`.",
      },
      {
        title: "03 · Prove value equality",
        body: "Press `aliasA.equals(aliasB)` (or the equality check). Even with two separate `Money(100, \"USD\")` instances, the result is `true` — value objects are equal when their fields match, identity doesn't matter.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "money.ts",
        code: `// readonly fields, no setters; "mutators" return a NEW Money.
class Money {
  constructor(
    readonly amount: number,
    readonly currency: string,
  ) {
    Object.freeze(this); // shallow runtime freeze; fields are primitives here
  }

  plus(extra: number): Money {
    return new Money(this.amount + extra, this.currency); // new object
  }

  withAmount(amount: number): Money {
    return new Money(amount, this.currency);              // new object
  }

  // value equality — equal when the fields are equal, not the references
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

const a = new Money(100, "USD");
const b = a.plus(50);                 // b = 150 USD; a is STILL 100 USD
const c = new Money(100, "USD");
a.equals(c);                          // true — same value, different instances
// a.amount = 0;                      // error: Cannot assign to 'amount' (readonly)`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Money.java",
        code: `// A record is immutable and gets value equality (equals/hashCode) for free.
public record Money(long amount, String currency) {

    public Money plus(long extra) {
        return new Money(amount + extra, currency);   // new object
    }

    public Money withAmount(long newAmount) {
        return new Money(newAmount, currency);        // new object
    }
}

Money a = new Money(100, "USD");
Money b = a.plus(50);                 // b = 150 USD; a is STILL 100 USD
Money c = new Money(100, "USD");
a.equals(c);                          // true — records compare by value
// a.amount = 0;                      // won't compile: record fields are final

// Pre-records: the same thing with explicit final fields.
final class MoneyClassic {
    private final long amount;
    private final String currency;
    MoneyClassic(long amount, String currency) {
        this.amount = amount;
        this.currency = currency;     // set once, no setters anywhere
    }
    MoneyClassic plus(long extra) {
        return new MoneyClassic(amount + extra, currency);
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "money.py",
        code: `from dataclasses import dataclass

# frozen=True blocks attribute writes AND generates value equality + hashing.
@dataclass(frozen=True)
class Money:
    amount: int
    currency: str

    def plus(self, extra: int) -> "Money":
        return Money(self.amount + extra, self.currency)   # new object

    def with_amount(self, new_amount: int) -> "Money":
        return Money(new_amount, self.currency)            # new object


a = Money(100, "USD")
b = a.plus(50)            # b = 150 USD; a is STILL 100 USD
c = Money(100, "USD")
a == c                    # True — frozen dataclasses compare by value
hash(a) == hash(c)        # True — so Money works as a dict key / set member
# a.amount = 0           # raises FrozenInstanceError: cannot assign to field`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "money.cpp",
        code: `// const members are set once in the initializer list; methods are const.
#include <string>

class Money {
    const long amount_;
    const std::string currency_;

public:
    Money(long amount, std::string currency)
        : amount_(amount), currency_(std::move(currency)) {}

    long amount() const { return amount_; }
    const std::string& currency() const { return currency_; }

    // "mutators" return a brand-new Money; *this is never changed.
    Money plus(long extra) const {
        return Money(amount_ + extra, currency_);
    }
    Money withAmount(long newAmount) const {
        return Money(newAmount, currency_);
    }

    // value equality — equal when the fields are equal
    bool operator==(const Money& o) const {
        return amount_ == o.amount_ && currency_ == o.currency_;
    }
};

Money a(100, "USD");
Money b = a.plus(50);     // b = 150 USD; a is STILL 100 USD
Money c(100, "USD");
bool same = (a == c);     // true — compared by value
// a.amount_ = 0;         // won't compile: amount_ is const`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for an immutable value object" },
      {
        type: "p",
        text: "Use immutability for any small concept whose meaning *is* its value — money, dates, ranges, coordinates, colors, quantities, identifiers. Reach for it whenever an object will be **shared** across the codebase, used as a **map or set key**, passed **between threads**, or **cached**: in all of those cases the guarantee that it can't change quietly is worth far more than the cost of an occasional new allocation. Keep mutability for things that genuinely model an evolving lifecycle — an `Order` being filled, a `Game` in progress — and even then, build them out of immutable value objects.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Watch the hidden mutable field",
        text: "An object isn't immutable just because its fields are `final` or `readonly`. If one of those fields is a mutable list, map, or date, copy it on the way in and never hand out the live reference — otherwise a caller mutates your \"immutable\" object through the back door.",
      },
    ],

    tradeoffs: {
      pros: [
        "Safe to share freely — pass it anywhere; no caller can change it under you.",
        "Whole classes of aliasing bugs vanish: there's no setter to corrupt shared state.",
        "Thread-safe by default — read from any number of threads with no locks.",
        "Great as map/set keys and easy to cache, because the value (and its hash) never changes.",
      ],
      cons: [
        "Every \"change\" allocates a new object, which can mean GC churn in hot loops.",
        "Awkward for large state that updates often — copying a big structure per edit is wasteful.",
        "More ceremony than a plain mutable field: constructors, copy-in/copy-out, factory-style mutators.",
        "Easy to get *partially* immutable — a final reference to a mutable list isn't truly immutable.",
      ],
    },

    furtherReading: [
      {
        label: "Wikipedia — Immutable object",
        href: "https://en.wikipedia.org/wiki/Immutable_object",
        note: "A broad cross-language overview of what immutability is and why it helps.",
        kind: "article",
      },
      {
        label: "Oracle — A Strategy for Defining Immutable Objects",
        href: "https://docs.oracle.com/javase/tutorial/essential/concurrency/imstrat.html",
        note: "The canonical checklist for making a Java class immutable, including defensive copying.",
        kind: "docs",
      },
      {
        label: "MDN — Object.freeze()",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze",
        note: "How JavaScript's runtime freeze works — and the crucial detail that it's shallow.",
        kind: "docs",
      },
      {
        label: "Martin Fowler — ValueObject",
        href: "https://martinfowler.com/bliki/ValueObject.html",
        note: "The definition of a value object and why equality by value (not identity) matters.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "im-q1",
        question: "What is the defining property of an immutable object?",
        options: [
          { id: "a", label: "Its fields are encrypted so they can't be read." },
          { id: "b", label: "Its data cannot change after construction; \"changes\" return a new object." },
          { id: "c", label: "It can only be created once per program run." },
          { id: "d", label: "It has setters but they validate input before writing." },
        ],
        correctOptionId: "b",
        explanation:
          "Immutability means the object's state is fixed at construction. Operations that would \"change\" it instead build and return a fresh object, leaving the original untouched.",
      },
      {
        id: "im-q2",
        question:
          "`aliasB = aliasA;` with a *mutable* `Money`, then `aliasA.setAmount(0)`. What does `aliasB.amount` read?",
        options: [
          { id: "a", label: "0 — both names point at the same object, so the mutation is shared." },
          { id: "b", label: "100 — aliasB kept its own independent copy." },
          { id: "c", label: "It throws, because two names can't share one object." },
          { id: "d", label: "undefined — the assignment cleared aliasB." },
        ],
        correctOptionId: "a",
        explanation:
          "The assignment copies the reference, not the object. `aliasA` and `aliasB` name the same `Money`, so mutating it through one is visible through the other — the aliasing bug.",
      },
      {
        id: "im-q3",
        question:
          "On an immutable `Money(100, \"USD\")`, what does `m.plus(50)` do?",
        options: [
          { id: "a", label: "Sets m.amount to 150 in place and returns nothing." },
          { id: "b", label: "Throws, because immutable objects can't add." },
          { id: "c", label: "Returns a new Money(150, \"USD\") and leaves m as Money(100, \"USD\")." },
          { id: "d", label: "Returns 150 as a plain number." },
        ],
        correctOptionId: "c",
        explanation:
          "An immutable \"mutator\" is really a factory: it constructs a new object with the new value and returns it. The original `m` is never modified.",
      },
      {
        id: "im-q4",
        question: "How does a value object differ from an entity?",
        options: [
          { id: "a", label: "A value object has methods; an entity does not." },
          { id: "b", label: "A value object compares by its fields (no identity); an entity has an id and compares by identity." },
          { id: "c", label: "An entity is always immutable; a value object is always mutable." },
          { id: "d", label: "They're two names for the same thing." },
        ],
        correctOptionId: "b",
        explanation:
          "A value object's identity *is* its value — two `Money(100,\"USD\")` are interchangeable and equal. An entity (a User, an Order) has a distinct identity that persists even as its data changes.",
      },
      {
        id: "im-q5",
        question:
          "An object has only `final` fields, but one of them is a `List` you can still `.add()` to. Is the object truly immutable?",
        options: [
          { id: "a", label: "Yes — final fields make the whole object immutable." },
          { id: "b", label: "No — final only freezes the reference; the list's contents can still change, so it's only shallowly immutable." },
          { id: "c", label: "Yes, as long as the class has no setters." },
          { id: "d", label: "It's immutable only on a single thread." },
        ],
        correctOptionId: "b",
        explanation:
          "`final`/`readonly` freezes the reference, not what it points at. A final reference to a mutable list is only shallowly immutable — true (deep) immutability needs the list copied in and never exposed live.",
      },
    ],
  },
};
