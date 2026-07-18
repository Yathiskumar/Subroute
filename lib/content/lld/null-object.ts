import type { RoadmapLesson } from "@/lib/content/types";

export const nullObject: RoadmapLesson = {
  title: "Null Object",
  oneLiner:
    "Instead of returning `null` when something is missing, return a real object of the same interface that safely does nothing. A walk-in with no loyalty card becomes a `GuestCustomer` holding a `NoDiscountPlan` (0% off, no perks) — so `customer.getPlan().getDiscount()` works for *everyone*, and nobody ever writes `if (customer != null)` again.",
  difficulty: "beginner",
  estimatedTime: "10 min",
  prototypePath: "/prototypes/lld/null-object.html",
  content: {
    prototypeCaption:
      "A coffee-shop **checkout lane**. The CODE card shows the one chained line every checkout runs: `lookupCustomer(card).getPlan().getDiscount()`. Flip between two worlds and swipe. In **WITHOUT Null Object**, `💳 Member card` works fine ($10.00 → $8.00 ✓), but `🪪 No card` makes the lookup return a red `null` — the chain reaches `.getPlan()` and 💥 explodes with a *NullPointerException*. Press `🩹 Add null checks` and the tidy one-liner turns into a red 5-line if-pyramid (**checks: 2**) that survives the swipe — that's the tax null makes you pay in *every* method. Flip to **WITH Null Object**: `🪪 No card` now returns a calm grey `GuestCustomer` with a `NoDiscountPlan`, the *same* one-line chain runs end-to-end green ($10.00 → $10.00 ✓, **checks: 0**), and no crash is possible. Same code line, no ifs — that's the whole pattern.",

    overview: [
      {
        type: "p",
        text: "**Null Object** answers one question: what should a method return when there's *nothing* to return? Picture a coffee-shop loyalty system. `shop.lookupCustomer(cardId)` finds the customer for a swiped card, and checkout applies their plan's discount with one tidy chain: `customer.getPlan().getDiscount()`. Then a walk-in arrives with **no card**. The naive answer — return `null` — leaves the caller holding a live grenade: forget one check and `.getPlan()` on `null` crashes the register.",
      },
      {
        type: "p",
        text: "So teams defend themselves the only way `null` allows: `if (customer != null && customer.getPlan() != null) { … }` — copied into *every* method that touches a customer. The Null Object pattern deletes that entire tax. When there's no real customer, `lookupCustomer` returns a **GuestCustomer**: a genuine object with the *same interface*, whose plan is a **NoDiscountPlan** — discount `0%`, perks empty, side effects none. The chain runs end to end for everyone, and the 'nobody' case is handled *once*, inside the null object, instead of everywhere it's used.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Replace `null` with a **real object of the same interface that safely does nothing** — neutral values, no-op methods — so callers never have to check for absence.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The billion-dollar mistake",
        text: "Tony Hoare, who introduced the null reference in 1965, later called it his *billion-dollar mistake* for all the crashes and defensive code it has caused since — Null Object is one of the classic ways to design that mistake out of your APIs.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three participants" },
      {
        type: "p",
        text: "The pattern is tiny — an interface and two kinds of implementation of it:",
      },
      {
        type: "ul",
        items: [
          "**The abstract type** — the interface callers program against: `Customer` (with `getPlan()`) and `Plan` (with `getDiscount()`, `perks()`). Callers only ever see this type, never a concrete class.",
          "**Real implementations** — the objects with actual behaviour: a `MemberCustomer` whose `GoldPlan` returns `20`% off and real perks.",
          "**The Null implementation** — `GuestCustomer` and `NoDiscountPlan`: same interface, **neutral behaviour**. Numbers return `0`, collections return *empty* (never `null`), actions are no-ops. It does nothing — *safely*.",
        ],
      },
      {
        type: "p",
        text: "Because a null object holds no state and always behaves the same, you usually create **one shared instance** and hand it out everywhere — a natural little [[singleton]]. There's no point allocating a fresh `NoDiscountPlan` per walk-in when every one of them is identical.",
      },
      {
        type: "code",
        language: "typescript",
        code: `interface Plan {
  getDiscount(): number;                 // percent off
}

class GoldPlan implements Plan {
  getDiscount() { return 20; }           // real behaviour
}

class NoDiscountPlan implements Plan {   // the Null Object
  static readonly INSTANCE = new NoDiscountPlan();  // stateless → share one
  getDiscount() { return 0; }            // neutral: safely does nothing
}

// lookupCustomer() NEVER returns null — walk-ins get a GuestCustomer
// whose getPlan() is NoDiscountPlan.INSTANCE. So checkout is one line:
const price = 10 * (1 - shop.lookupCustomer(card).getPlan().getDiscount() / 100);`,
      },
      { type: "h", text: "Where it shines" },
      {
        type: "ul",
        items: [
          "**Chained calls** — `a().b().c()` is only safe if no link can be `null`. Null objects keep the whole chain alive with neutral values, exactly like the checkout line above.",
          "**Collections mixing real and 'missing' entries** — loop over `customers` and call `getPlan().getDiscount()` on every element without filtering; guests simply contribute `0`.",
          "**Default collaborators** — give a class a `NullLogger` by default so its code calls `logger.log(...)` unconditionally; wire in a real logger only when you want output.",
        ],
      },
      { type: "h", text: "The honest caveat: it can hide real errors" },
      {
        type: "p",
        text: "A null object *swallows* absence. That's the feature — and the danger. If 'missing' is a **genuine error** the caller must know about (an unknown payment account, a required config key), a silent do-nothing object turns a loud crash into a quiet wrong answer that surfaces days later. Reserve the pattern for cases where doing nothing is *correct*, not merely convenient.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The modern spectrum for 'maybe absent'",
        text: "Null Object is one point on a spectrum. Java's `Optional<Customer>` and TypeScript's `Customer | undefined` with optional chaining (`customer?.getPlan()`) make absence **visible in the type** and force callers to decide; a null object makes absence **invisible** and decides for them. Use the type-level tools when callers should care, and a null object when they genuinely shouldn't.",
      },
      {
        type: "p",
        text: "You've already met this pattern in the wild: a **NullLogger** (log calls go nowhere), the **guest user/session** every web framework hands to signed-out visitors, a **no-op cache** used when caching is disabled, and the **empty iterator** — the reason `for (x of emptyList)` just runs zero times instead of crashing.",
      },
    ],

    handsOn: [
      {
        title: "01 · Crash the WITHOUT world",
        body: "With the toggle on ✕ WITHOUT Null Object, press 💳 Member card — the lookup returns a gold Customer, the chain lights up left to right, and the price drops $10.00 → $8.00 ✓. Now press 🪪 No card: the lookup returns a red null token, the pulse reaches .getPlan() and 💥 explodes — NullPointerException, price ☠. Same line of code, one missing card, dead register.",
      },
      {
        title: "02 · Pay the null-check tax",
        body: "Press 🩹 Add null checks. The tidy one-liner on the CODE card turns into a red 5-line if-null pyramid and the counter jumps to checks: 2. Swipe 🪪 No card again — it survives now, but look at what checkout code became. Multiply that pyramid by every method that touches a customer: that's the tax null makes the whole codebase pay.",
      },
      {
        title: "03 · Flip to WITH and compare",
        body: "Switch the toggle to ✓ WITH Null Object — the code is the original one-liner again and the counter reads checks: 0. Press 🪪 No card: the lookup returns a calm grey GuestCustomer with a NoDiscountPlan, the same chain runs end-to-end green, and the price stays $10.00 ✓. Press 💳 Member card to confirm members still get $8.00, then ↺ Reset and replay both worlds — identical code line, zero ifs, no crash possible.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "loyalty.ts",
        code: `interface Plan {
  getDiscount(): number;                     // percent off, e.g. 20
  perks(): string[];
}

class GoldPlan implements Plan {
  getDiscount() { return 20; }
  perks() { return ["free refill", "birthday drink"]; }
}

// The Null Object: same interface, neutral behaviour.
class NoDiscountPlan implements Plan {
  static readonly INSTANCE = new NoDiscountPlan(); // stateless → share one
  getDiscount() { return 0; }                      // neutral number
  perks(): string[] { return []; }                 // empty, never null
}

interface Customer {
  getName(): string;
  getPlan(): Plan;
}

class MemberCustomer implements Customer {
  constructor(private name: string) {}
  getName() { return this.name; }
  getPlan(): Plan { return new GoldPlan(); }
}

class GuestCustomer implements Customer {          // Null Object for Customer
  getName() { return "Guest"; }
  getPlan(): Plan { return NoDiscountPlan.INSTANCE; }
}

class Shop {
  private members = new Map<string, Customer>([["gold-7", new MemberCustomer("Mia")]]);
  lookupCustomer(cardId?: string): Customer {      // NEVER returns null
    return (cardId && this.members.get(cardId)) || new GuestCustomer();
  }
}

// Checkout: one line, zero null checks, works for members AND walk-ins.
const shop = new Shop();
const price = 10 * (1 - shop.lookupCustomer("gold-7").getPlan().getDiscount() / 100);
console.log(price);                                 // 8 — guest would print 10`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Loyalty.java",
        code: `import java.util.*;

interface Plan {
    int getDiscount();                         // percent off, e.g. 20
    List<String> perks();
}

class GoldPlan implements Plan {
    public int getDiscount() { return 20; }
    public List<String> perks() { return List.of("free refill"); }
}

// The Null Object: same interface, neutral behaviour, one shared instance.
class NoDiscountPlan implements Plan {
    static final NoDiscountPlan INSTANCE = new NoDiscountPlan();
    private NoDiscountPlan() {}                // stateless → one is enough
    public int getDiscount() { return 0; }     // neutral number
    public List<String> perks() { return List.of(); }  // empty, never null
}

interface Customer {
    Plan getPlan();
}

class MemberCustomer implements Customer {
    public Plan getPlan() { return new GoldPlan(); }
}

class GuestCustomer implements Customer {      // Null Object for Customer
    public Plan getPlan() { return NoDiscountPlan.INSTANCE; }
}

class Shop {
    Customer lookupCustomer(String cardId) {   // NEVER returns null
        return "gold-7".equals(cardId) ? new MemberCustomer() : new GuestCustomer();
    }
}

// double price = 10 * (1 - shop.lookupCustomer(card).getPlan().getDiscount() / 100.0);
// One line at checkout — members pay 8.00, walk-ins pay 10.00, nobody crashes.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "loyalty.py",
        code: `class GoldPlan:
    """Real behaviour: 20% off and actual perks."""
    def get_discount(self) -> int:
        return 20

    def perks(self) -> list[str]:
        return ["free refill", "birthday drink"]


class NoDiscountPlan:
    """The Null Object: same methods, neutral behaviour."""
    def get_discount(self) -> int:
        return 0                        # neutral number

    def perks(self) -> list[str]:
        return []                       # empty, never None


NO_DISCOUNT = NoDiscountPlan()          # stateless → share one instance


class MemberCustomer:
    def get_plan(self):
        return GoldPlan()


class GuestCustomer:
    """Null Object for Customer — a real object, not None."""
    def get_plan(self):
        return NO_DISCOUNT


class Shop:
    def lookup_customer(self, card_id: str | None):   # NEVER returns None
        return MemberCustomer() if card_id == "gold-7" else GuestCustomer()


shop = Shop()
price = 10 * (1 - shop.lookup_customer(None).get_plan().get_discount() / 100)
print(price)                            # 10.0 — the walk-in chain never crashes`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "loyalty.cpp",
        code: `#include <string>
#include <vector>

struct Plan {
    virtual ~Plan() = default;
    virtual int discount() const = 0;              // percent off
    virtual std::vector<std::string> perks() const = 0;
};

struct GoldPlan : Plan {
    int discount() const override { return 20; }
    std::vector<std::string> perks() const override { return {"free refill"}; }
};

// The Null Object: same interface, neutral behaviour.
struct NoDiscountPlan : Plan {
    int discount() const override { return 0; }    // neutral number
    std::vector<std::string> perks() const override { return {}; }
    static const NoDiscountPlan& instance() {      // stateless → share one
        static NoDiscountPlan one;
        return one;
    }
};

struct Customer {
    virtual ~Customer() = default;
    virtual const Plan& plan() const = 0;
};

struct MemberCustomer : Customer {
    GoldPlan gold;
    const Plan& plan() const override { return gold; }
};

struct GuestCustomer : Customer {                  // Null Object for Customer
    const Plan& plan() const override { return NoDiscountPlan::instance(); }
};

// Shop::lookup returns a Customer& that is NEVER null — walk-ins get a Guest.
// double price = 10 * (1 - shop.lookup(card).plan().discount() / 100.0);`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Use it when doing nothing is the correct answer" },
      {
        type: "ul",
        items: [
          "**A sane do-nothing default exists** — 0% discount, empty perks, a log call that goes nowhere. If the neutral behaviour is genuinely *right* for the missing case, a null object encodes it once.",
          "**Callers shouldn't care about absence** — checkout should not branch on 'is this a member?'; it should just ask the plan for a discount and get `0` for guests.",
          "**Chained calls and collection loops** — anywhere `null` would force a guard before every dot or a filter before every loop.",
          "**Optional collaborators** — loggers, metrics, caches, notifiers that a class should be able to call unconditionally whether or not one is configured.",
        ],
      },
      { type: "h", text: "Skip it when absence is an error" },
      {
        type: "ul",
        items: [
          "**The caller must know something is missing** — an unknown payment account, a required config key, a failed lookup that should stop the flow. A silent no-op here converts a loud, debuggable crash into quiet wrong behaviour.",
          "**Different callers need different reactions to absence** — one wants a retry, one wants an error page. A null object bakes in a single reaction (nothing); prefer `Optional`/`Maybe` types or explicit `| undefined` handling so each caller decides.",
          "**You'd need the null object to lie** — if `GuestCustomer` had to fake a name, an ID, and an address to satisfy the interface, the 'neutral' behaviour isn't neutral anymore. That's a sign the design wants explicit absence.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Deletes repetitive null checks — the 'nobody' case is implemented once, inside the null object, instead of guarded before every call site.",
        "Makes chained calls and loops safe by construction — every link in `a().b().c()` is a real object, so the happy path is the only path.",
        "Callers get simpler and polymorphic — checkout treats members and guests identically through one interface, with no `if (guest)` branching.",
        "Cheap to share — null objects are stateless, so one instance (a mini [[singleton]]) serves the whole program with zero allocation cost.",
      ],
      cons: [
        "Can hide genuine errors — a silent no-op where absence *mattered* turns crashes into quiet wrong results that are much harder to trace.",
        "One extra class per interface — for a type with many methods, writing a neutral version of every method is real boilerplate.",
        "One-size-fits-all reaction — every caller gets 'do nothing'; if different callers need different absence handling, the pattern is the wrong tool.",
        "Can mask design smells — sprinkling null objects everywhere to keep long `a().b().c()` chains alive papers over coupling that violates the Law of Demeter.",
      ],
    },

    furtherReading: [
      {
        label: "Introduce Null Object — Refactoring.Guru",
        href: "https://refactoring.guru/introduce-null-object",
        note: "The refactoring recipe: how to spot repeated null checks and mechanically replace them with a null object, with before/after code.",
        kind: "article",
      },
      {
        label: "Null object pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Null_object_pattern",
        note: "Concise reference with the pattern's structure and side-by-side examples in a dozen languages, plus its relationship to Optional types.",
        kind: "docs",
      },
      {
        label: "Null Object — SourceMaking",
        href: "https://sourcemaking.com/design_patterns/null_object",
        note: "Walks the intent, structure diagram, and check-list for deciding whether a do-nothing default is safe, with a NullLogger-style example.",
        kind: "article",
      },
      {
        label: "Null References: The Billion Dollar Mistake — Tony Hoare (InfoQ talk)",
        href: "https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/",
        note: "The inventor of the null reference explains why he regrets it — the historical 'why' behind every pattern and type-system feature that fights null.",
        kind: "video",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "Null Object isn't in the original GoF catalogue (Bobby Woolf described it later in 'Pattern Languages of Program Design 3'), but this book defines the pattern vocabulary and polymorphism ideas it builds on.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "null-object-q1",
        question: "What is the core idea of the Null Object pattern?",
        options: [
          { id: "a", label: "When something is missing, return a real object of the same interface that safely does nothing, instead of returning null." },
          { id: "b", label: "Throw an exception whenever a lookup finds nothing, so callers are forced to handle it." },
          { id: "c", label: "Wrap every object in a proxy that logs when null is about to be returned." },
          { id: "d", label: "Replace all objects with static utility methods so null can never appear." },
        ],
        correctOptionId: "a",
        explanation:
          "The pattern replaces null with a genuine implementation of the expected interface whose behaviour is neutral — a GuestCustomer with a NoDiscountPlan (0% off, empty perks). Callers use it exactly like a real object, so they never need to check for absence.",
      },
      {
        id: "null-object-q2",
        question: "Why does `shop.lookupCustomer(card).getPlan().getDiscount()` never crash once GuestCustomer and NoDiscountPlan exist?",
        options: [
          { id: "a", label: "Because every link in the chain now returns a real object — a walk-in gets a GuestCustomer whose plan is a NoDiscountPlan returning 0." },
          { id: "b", label: "Because the language automatically skips method calls on null values." },
          { id: "c", label: "Because getDiscount() catches the NullPointerException internally." },
          { id: "d", label: "Because lookupCustomer() throws before the chain can run." },
        ],
        correctOptionId: "a",
        explanation:
          "Chained calls are only as safe as their weakest link. With the pattern, lookupCustomer never returns null — it returns a GuestCustomer — and getPlan never returns null — it returns NoDiscountPlan. Every dot lands on a real object, so the chain runs end to end and simply yields a 0% discount for guests.",
      },
      {
        id: "null-object-q3",
        question: "NoDiscountPlan holds no state and always behaves the same. What does this suggest about how to create it?",
        options: [
          { id: "a", label: "Create one shared instance and reuse it everywhere — a null object is a natural fit for the Singleton idea." },
          { id: "b", label: "Allocate a fresh NoDiscountPlan for every walk-in so their discounts stay separate." },
          { id: "c", label: "Make it a subclass of GoldPlan so it inherits the 20% discount." },
          { id: "d", label: "Store it in a global mutable variable that methods can reassign." },
        ],
        correctOptionId: "a",
        explanation:
          "Because null objects are stateless and behaviourally identical, there is nothing to gain from multiple copies — one shared INSTANCE serves the whole program at zero cost. That's why implementations usually expose something like NoDiscountPlan.INSTANCE, a miniature Singleton.",
      },
      {
        id: "null-object-q4",
        question: "What is the main danger of using a Null Object, shown by the honest caveat in this lesson?",
        options: [
          { id: "a", label: "Its silent do-nothing behaviour can hide genuine errors — a 'missing' case that mattered produces quiet wrong results instead of a loud, debuggable failure." },
          { id: "b", label: "It makes programs dramatically slower because of the extra virtual calls." },
          { id: "c", label: "It only works in dynamically typed languages." },
          { id: "d", label: "It forces every caller to add extra null checks around the null object." },
        ],
        correctOptionId: "a",
        explanation:
          "A null object swallows absence by design. When absence is actually an error — an unknown payment account, a missing required config — a no-op turns what would have been an obvious crash into subtly wrong behaviour discovered much later. Reserve the pattern for cases where doing nothing is truly correct.",
      },
      {
        id: "null-object-q5",
        question: "When should you prefer Java's Optional or TypeScript's `| undefined` with optional chaining over a Null Object?",
        options: [
          { id: "a", label: "When callers SHOULD know about and decide how to handle absence — the type makes 'maybe missing' visible instead of silently defaulting it away." },
          { id: "b", label: "Never — Optional and null objects are interchangeable in all situations." },
          { id: "c", label: "Only when the interface has more than ten methods." },
          { id: "d", label: "When you want absence handled identically everywhere without callers thinking about it." },
        ],
        correctOptionId: "a",
        explanation:
          "Optional/`| undefined` put absence into the type signature and force each caller to make a decision (retry, error page, default). A null object does the opposite: it hides absence and picks one reaction — do nothing — for everyone. Use type-level absence when callers should care, and a null object when they genuinely shouldn't (option d describes the null-object side of the spectrum).",
      },
    ],
  },
};
