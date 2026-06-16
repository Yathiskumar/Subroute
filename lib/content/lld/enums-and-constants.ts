import type { RoadmapLesson } from "@/lib/content/types";

export const enumsAndConstants: RoadmapLesson = {
  title: "Enums & Constants",
  oneLiner:
    "Model a fixed, finite set of named options as an enum instead of magic strings/ints — only valid values exist, and the compiler can check you handled them all.",
  difficulty: "beginner",
  estimatedTime: "10 min",
  prototypePath: "/prototypes/lld/enums-and-constants.html",
  content: {
    prototypeCaption:
      "An order moves through a fixed set of states — `PENDING → PAID → SHIPPED → DELIVERED`. The chips are the enum's *only* members; the highlighted one is the current value. Press **next()** to take a legal step (illegal ones are refused). Below, type any status string into both panels: the *magic-string* version happily accepts `\"shippd\"`, the *enum* version rejects anything outside the finite set.",

    overview: [
      {
        type: "p",
        text: "Lots of values in a program aren't free-form — they come from a small, *fixed* list of options. An order is `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, or `CANCELLED` — never anything else. A traffic light is `RED`, `YELLOW`, or `GREEN`. An **enum** (short for *enumerated type*) is how you tell the language: \"this value can only ever be one of these named members.\"",
      },
      {
        type: "p",
        text: "The alternative — storing those states as raw strings (`\"shipped\"`) or magic integers (`2`) — looks simpler but quietly invites bugs. Nothing stops a typo like `\"shippd\"`, nothing tells you what `2` means, and your editor can't autocomplete the options. An enum turns that fuzzy guesswork into a closed set the compiler understands.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "An enum says *only these named values exist*. Reach for one whenever a variable should hold one option out of a small, known, fixed list — and let the compiler reject everything else.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The \"magic value\" problem" },
      {
        type: "p",
        text: "Suppose an order's status is just a string. Now `order.status = \"shippd\"` is a perfectly valid line of code — it compiles, it runs, and it silently puts your order into a state that doesn't exist. Magic values share the same three weaknesses:",
      },
      {
        type: "ul",
        items: [
          "**Typos slip through.** `\"shippd\"`, `\"Shipped\"`, and `\"SHIPPED\"` are three different strings to the computer, but you meant one state.",
          "**No autocomplete, no discoverability.** Your editor can't suggest the valid options because nothing declares what they are.",
          "**No exhaustiveness.** Add a new state later and the compiler can't point you at the twelve `switch` statements that now miss a case.",
        ],
      },
      { type: "h", text: "An enum is a closed set of named constants" },
      {
        type: "p",
        text: "Declaring an enum gives those options names and makes them the *only* values the type can hold. Assigning anything else is now a compile error, not a runtime surprise. Each member is a first-class value you refer to by name:",
      },
      {
        type: "code",
        language: "typescript",
        filename: "order-status.ts",
        code: `enum OrderStatus {
  Pending,
  Paid,
  Shipped,
  Delivered,
  Cancelled,
}

let status: OrderStatus = OrderStatus.Pending;
status = OrderStatus.Shipped;   // ok — a real member
// status = "shippd";           // compile error — not part of the set`,
      },
      { type: "h", text: "Enums can carry data and behavior" },
      {
        type: "p",
        text: "In richer languages an enum member isn't just a label — each constant can carry its own *fields* and even *methods*. Picture each `OrderStatus` knowing its own customer-facing label and badge color, or each traffic-light state knowing how many seconds it lasts. The data travels *with* the value, so there's no separate lookup table to keep in sync.",
      },
      {
        type: "p",
        text: "Java is the clearest example: an enum is a full class, and each constant is a singleton instance that can hold fields and override methods. The prototype shows this — each status chip carries its own color and human label, defined right on the enum.",
      },
      { type: "h", text: "Constants: a single fixed value" },
      {
        type: "p",
        text: "Enums are for a *set* of related options. When you just have *one* fixed value that should never change — a tax rate, a max retry count, a config key — that's a **constant**: `final` in Java, `const` in TypeScript/C++, an UPPER_CASE module value in Python. Same spirit as an enum (name the value, don't repeat the magic literal), but for a lone value rather than a closed set.",
      },
      { type: "h", text: "Exhaustiveness: handling every case" },
      {
        type: "p",
        text: "The quiet superpower of enums is **exhaustiveness checking**. When you `switch` over an enum, the compiler (or linter) can verify you covered *every* member. Miss one — or add a new member later — and you get a warning at the exact spot that forgot it, instead of a silent fall-through at runtime.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "next-state.ts",
        code: `function describe(s: OrderStatus): string {
  switch (s) {
    case OrderStatus.Pending:   return "Waiting for payment";
    case OrderStatus.Paid:      return "Preparing to ship";
    case OrderStatus.Shipped:   return "On its way";
    case OrderStatus.Delivered: return "Delivered";
    case OrderStatus.Cancelled: return "Cancelled";
    // forget a case and TypeScript flags the missing 'never' below
  }
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Language notes — same idea, different spellings",
        text: "**Java** has rich enums: each constant is an object with fields and methods. **TypeScript** offers both an `enum` keyword and the popular *union of string literals* (`type Status = \"pending\" | \"paid\"`), which gives type-safety with plain strings. **Python** uses `enum.Enum` (and `IntEnum`/`StrEnum`) from the standard library. **C++** prefers `enum class`, which is scoped and won't silently convert to an `int`.",
      },
    ],

    handsOn: [
      {
        title: "01 · Walk the valid transitions",
        body: "The chips at the top are the enum's fixed members; the glowing one is the current value, seeded to `PENDING` on load. Press **next()** to advance one legal step at a time — `PENDING → PAID → SHIPPED → DELIVERED`. The console narrates each transition and shows the label and color that constant carries.",
      },
      {
        title: "02 · Try an illegal transition",
        body: "Reach a terminal state like `DELIVERED`, then press **next()** again — or hit **Cancel order** from a state that can't be cancelled. The move is *refused* and the console logs the reason. Only transitions the state machine allows go through; the enum can never hold a value outside its members.",
      },
      {
        title: "03 · Magic string vs enum",
        body: "In the contrast panel, type a status like `shippd` or `frozen` and press **Set**. The **magic-string** box accepts it and shows a broken, invalid state. The **enum** box checks the value against the finite set and *rejects* it — proving that with an enum, only valid values can ever exist.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "order-status.ts",
        code: `// Magic-string version — every string is "valid", so bugs slip in.
function advanceLoose(status: string): string {
  if (status === "pending") return "paid";
  if (status === "paid") return "shipped";
  return status; // "shippd"? "frozen"? all accepted, all wrong
}

// Enum version — a closed set; only these values exist.
enum OrderStatus {
  Pending = "PENDING",
  Paid = "PAID",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

const NEXT: Record<OrderStatus, OrderStatus | null> = {
  [OrderStatus.Pending]: OrderStatus.Paid,
  [OrderStatus.Paid]: OrderStatus.Shipped,
  [OrderStatus.Shipped]: OrderStatus.Delivered,
  [OrderStatus.Delivered]: null, // terminal — no next state
  [OrderStatus.Cancelled]: null,
};

function advance(s: OrderStatus): OrderStatus {
  const next = NEXT[s];
  if (next === null) throw new Error(\`\${s} is a final state\`);
  return next;
}

advance(OrderStatus.Pending); // → OrderStatus.Paid
// advance("shippd");         // compile error — not an OrderStatus`,
      },
      {
        label: "Java",
        language: "java",
        filename: "OrderStatus.java",
        code: `// A rich enum: each constant carries data (label, color) and behavior (next()).
public enum OrderStatus {
    PENDING("Awaiting payment", "#f0a020"),
    PAID("Payment received", "#5e9ff6"),
    SHIPPED("On its way", "#a78bfa"),
    DELIVERED("Delivered", "#5cc66f"),
    CANCELLED("Cancelled", "#f06868");

    private final String label;
    private final String color;

    OrderStatus(String label, String color) {
        this.label = label;
        this.color = color;
    }

    public String getLabel() { return label; }
    public String getColor() { return color; }

    // behavior lives on the enum: the next valid state, or null if terminal
    public OrderStatus next() {
        switch (this) {
            case PENDING: return PAID;
            case PAID:    return SHIPPED;
            case SHIPPED: return DELIVERED;
            default:      return null; // DELIVERED / CANCELLED are final
        }
    }
}

OrderStatus s = OrderStatus.PENDING;
s = s.next();              // → PAID
String text = s.getLabel(); // "Payment received"
// s = OrderStatus.valueOf("SHIPPD"); // throws — not a constant`,
      },
      {
        label: "Python",
        language: "python",
        filename: "order_status.py",
        code: `from enum import Enum


# Each member carries data (label, color); methods add behavior.
class OrderStatus(Enum):
    PENDING = ("Awaiting payment", "#f0a020")
    PAID = ("Payment received", "#5e9ff6")
    SHIPPED = ("On its way", "#a78bfa")
    DELIVERED = ("Delivered", "#5cc66f")
    CANCELLED = ("Cancelled", "#f06868")

    def __init__(self, label: str, color: str):
        self.label = label
        self.color = color

    def next(self) -> "OrderStatus | None":
        return _NEXT.get(self)  # None for terminal states


_NEXT = {
    OrderStatus.PENDING: OrderStatus.PAID,
    OrderStatus.PAID: OrderStatus.SHIPPED,
    OrderStatus.SHIPPED: OrderStatus.DELIVERED,
}

s = OrderStatus.PENDING
s = s.next()           # -> OrderStatus.PAID
print(s.label)         # "Payment received"
# OrderStatus("shippd")  # raises ValueError — not a member`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "order_status.cpp",
        code: `#include <stdexcept>
#include <string>

// 'enum class' is scoped and won't silently convert to an int.
enum class OrderStatus {
    Pending,
    Paid,
    Shipped,
    Delivered,
    Cancelled,
};

OrderStatus next(OrderStatus s) {
    switch (s) {
        case OrderStatus::Pending: return OrderStatus::Paid;
        case OrderStatus::Paid:    return OrderStatus::Shipped;
        case OrderStatus::Shipped: return OrderStatus::Delivered;
        default:
            throw std::runtime_error("final state has no next");
    }
}

const char* label(OrderStatus s) {
    switch (s) {
        case OrderStatus::Pending:   return "Awaiting payment";
        case OrderStatus::Paid:      return "Payment received";
        case OrderStatus::Shipped:   return "On its way";
        case OrderStatus::Delivered: return "Delivered";
        case OrderStatus::Cancelled: return "Cancelled";
    }
    return "";
}

OrderStatus s = OrderStatus::Pending;
s = next(s);              // -> OrderStatus::Paid
// int n = s;             // error — enum class won't convert to int`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When an enum is the right tool" },
      {
        type: "p",
        text: "Reach for an enum whenever a value comes from a *small, fixed, known* set of named options — order status, traffic-light color, day of the week, log level, card suit. If you catch yourself comparing against a handful of magic strings or integers, that's the signal: name the set, and let the compiler guarantee only those values exist. Use a plain **constant** instead when there's just one fixed value to name rather than a whole set.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't reach for an enum for a two-state flag",
        text: "If a value is genuinely just yes/no, on/off, or open/closed, a **boolean** is clearer than a two-member enum. Save enums for sets of *three or more* options — or for two states that you can already tell will grow.",
      },
    ],

    tradeoffs: {
      pros: [
        "**Type safety** — only the declared members are valid, so typos and bogus states become compile errors, not runtime bugs.",
        "**Autocomplete** — your editor knows the full set of options and suggests them, making the valid values discoverable.",
        "**Exhaustiveness** — a `switch` over an enum can be checked for completeness, so adding a member flags every place that must handle it.",
        "**Self-documenting** — `OrderStatus.Shipped` says exactly what `2` or `\"shipped\"` only hint at, and the data/behavior can live on the member.",
      ],
      cons: [
        "Enums that grow heavy with branching behavior can turn into a sprawling mini-class — sometimes polymorphism (a class per case) models it better.",
        "**Serialization & versioning** is delicate: persisting an enum by its ordinal/index breaks if you reorder members, and renaming a value can break stored data or APIs.",
        "Adding or removing a member ripples through every exhaustive `switch` — usually a feature, but real work when the set churns often.",
        "**Over-using** them where a boolean (or a free-form string for truly open sets) would do adds ceremony without buying type-safety.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Enum Types (Java Tutorial)",
        href: "https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html",
        note: "The canonical guide to Java's rich enums, including constants that carry fields and methods.",
        kind: "docs",
      },
      {
        label: "TypeScript Handbook — Enums",
        href: "https://www.typescriptlang.org/docs/handbook/enums.html",
        note: "Numeric and string enums in TypeScript, plus when a union of literals is the better choice.",
        kind: "docs",
      },
      {
        label: "Python docs — enum",
        href: "https://docs.python.org/3/library/enum.html",
        note: "The standard-library enum module: Enum, IntEnum, StrEnum, and members that carry data.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Enumerated type",
        href: "https://en.wikipedia.org/wiki/Enumerated_type",
        note: "A language-agnostic survey of enumerated types and how they're represented across languages.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "ec-q1",
        question: "What is the core problem with storing an order's status as a raw string like `\"shipped\"`?",
        options: [
          { id: "a", label: "Strings use too much memory compared to integers." },
          { id: "b", label: "Any string is accepted, so typos and invalid states like `\"shippd\"` slip in with no compiler check." },
          { id: "c", label: "Strings can't be compared with `===`." },
          { id: "d", label: "Strings are always slower than enums at runtime." },
        ],
        correctOptionId: "b",
        explanation:
          "A magic string isn't constrained to a fixed set, so `\"shippd\"` or `\"frozen\"` compile and run fine — putting the program into a state that should never exist. An enum limits the value to its declared members.",
      },
      {
        id: "ec-q2",
        question: "In a language with rich enums (like Java), what can each enum constant carry?",
        options: [
          { id: "a", label: "Only an integer index — nothing else." },
          { id: "b", label: "Nothing; an enum member is just a bare name." },
          { id: "c", label: "Its own fields and methods, so data and behavior travel with the value." },
          { id: "d", label: "A reference to a separate database table." },
        ],
        correctOptionId: "c",
        explanation:
          "In Java an enum is a full class and each constant is a singleton instance, so members can hold fields (like a label and color) and define behavior (like `next()`) — no separate lookup table needed.",
      },
      {
        id: "ec-q3",
        question: "You add a new member to an enum and `switch` over it everywhere. What does exhaustiveness checking buy you?",
        options: [
          { id: "a", label: "It automatically writes the new case for you." },
          { id: "b", label: "The compiler or linter flags every `switch` that doesn't yet handle the new member." },
          { id: "c", label: "It silently picks a default behavior for the new member." },
          { id: "d", label: "It converts the enum back into a string at runtime." },
        ],
        correctOptionId: "b",
        explanation:
          "Exhaustiveness checking verifies a `switch` covers every member. Add a new one and you get a warning at each spot that forgot it — at compile time, instead of a silent runtime fall-through.",
      },
      {
        id: "ec-q4",
        question: "When is a plain constant (`final`/`const`) a better fit than an enum?",
        options: [
          { id: "a", label: "When you have a single fixed value to name, not a set of related options." },
          { id: "b", label: "Whenever you have three or more options to model." },
          { id: "c", label: "When you need the compiler to check a `switch` is exhaustive." },
          { id: "d", label: "When each value must carry its own fields and methods." },
        ],
        correctOptionId: "a",
        explanation:
          "Enums model a closed *set* of options. For one lone fixed value — a tax rate, a max retry count — a named constant captures the intent without the ceremony of a whole enumerated type.",
      },
    ],
  },
};
