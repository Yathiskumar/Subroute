import type { RoadmapLesson } from "@/lib/content/types";

export const couplingAndCohesion: RoadmapLesson = {
  title: "Coupling & Cohesion",
  oneLiner:
    "Aim for HIGH cohesion (each module does one thing well) and LOW coupling (modules barely depend on each other) — the two dials behind almost every \"good design\" judgment.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/coupling-and-cohesion.html",
  content: {
    prototypeCaption:
      "Eight responsibilities start dumped into one tangled module — low cohesion, lots of cross-cutting dependency lines. Click a function to **move** it into the module it belongs to (Orders, Billing, or Notifications) and watch the **coupling** score fall and **cohesion** rise as related work gets grouped. Hit **Auto-refactor** to snap to the ideal, or **Tangle it** to make a mess again.",

    overview: [
      {
        type: "p",
        text: "Almost every time a senior engineer calls a design \"clean\" or \"messy,\" they're really reading two dials. **Cohesion** asks: *does this module do one focused thing, or a grab-bag of unrelated things?* **Coupling** asks: *how much does this module need to know about other modules to do its job?* The goal is simple to state — **high cohesion, low coupling** — and most refactoring is just turning those two dials in the right direction.",
      },
      {
        type: "p",
        text: "Think of a well-run kitchen. The pastry station does pastry, the grill does grilled food, the dishwasher washes — each station is *cohesive*, focused on one kind of work. And they hand off through a simple counter, not by reaching into each other's drawers — that's *low coupling*. Now imagine one chaotic station that fries, bakes, plates, and takes payment, constantly grabbing tools from everyone else. That's low cohesion and high coupling: slow, fragile, and impossible to change without chaos.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "**High cohesion** = each module does *one thing well*. **Low coupling** = modules *barely depend* on each other. Push both directions at once and the design almost always gets better.",
      },
    ],

    howItWorks: [
      {
        type: "p",
        text: "These are just two simple questions you ask about any piece of code. That's it — keep these two questions in your head and you understand the whole topic:",
      },
      {
        type: "ul",
        items: [
          "**Cohesion** — *Does this one module stick to a single job?* (You want **yes** → high cohesion.)",
          "**Coupling** — *How much does this module need to know about other modules?* (You want **as little as possible** → low coupling.)",
        ],
      },

      { type: "h", text: "1. Cohesion: one module, one job" },
      {
        type: "p",
        text: "A module has **high cohesion** when everything inside it works toward the *same* job. An `InvoiceFormatter` that only formats invoices is cohesive — every method belongs there.",
      },
      {
        type: "p",
        text: "It has **low cohesion** when you've stuffed unrelated jobs into one place — like an `OrderManager` that validates orders, charges cards, *and* sends emails. Three different jobs in one box. (Engineers call this a **God class**.) A quick smell test: if you describe what a class does and you have to say \"and… and… and…\", it's probably doing too much.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Easy way to spot low cohesion",
        text: "Vague names like `Manager`, `Helper`, `Util`, or `Processor` are red flags — they usually mean \"a pile of unrelated stuff lives here.\" A good module name tells you the *one* thing it does.",
      },

      { type: "h", text: "2. Coupling: how tangled the wires are" },
      {
        type: "p",
        text: "Coupling is about the **connections between** modules. **Low coupling** means a module only needs to know a tiny, simple thing about its neighbours. **High coupling** means modules are tangled together and reach deep into each other.",
      },
      {
        type: "p",
        text: "The everyday symptom of high coupling: **you change one thing and something unrelated breaks.** A one-line fix turns into \"oh, now I also have to update these five other files.\" When code is loosely coupled, a change stays in one place.",
      },

      { type: "h", text: "Putting them together" },
      {
        type: "p",
        text: "Think of a kitchen. Each station does one job — the grill grills, the pastry station bakes (**high cohesion**). They hand food off over a simple counter instead of rummaging through each other's drawers (**low coupling**). The result is fast and easy to change. The opposite — one chaotic station doing everything and grabbing everyone else's tools — is the messy code you're trying to avoid.",
      },

      { type: "h", text: "The #1 trick to lower coupling: use an interface" },
      {
        type: "p",
        text: "Here's the single most useful move. If `OrderService` builds a `StripeGateway` itself, it's *glued* to Stripe forever. Instead, have it ask for a generic `PaymentGateway` and let someone *hand it* the real one. Now `OrderService` doesn't know or care whether it's Stripe or PayPal:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// ❌ tightly coupled — glued to Stripe
class OrderService {
  private gateway = new StripeGateway(); // builds it itself → stuck with Stripe
}

// ✅ loosely coupled — just asks for "some payment gateway"
interface PaymentGateway { charge(cents: number): void; }

class OrderService {
  constructor(private gateway: PaymentGateway) {} // handed in from outside
}
// switching Stripe → PayPal now changes ONE line — never OrderService itself`,
      },
      {
        type: "p",
        text: "That's the whole idea behind the fancy name **Dependency Inversion**: depend on a simple *promise* (the interface — \"something that can charge a card\") instead of a specific *thing* (the Stripe class). Swapping implementations and testing with fakes both become trivial.",
      },

      { type: "h", text: "One warning: don't over-split" },
      {
        type: "p",
        text: "More modules is **not** automatically better. If you chop one focused class into ten tiny pieces, each piece looks neat on its own — but now they have to call each other constantly, and coupling shoots back up. The goal isn't *more* boxes; it's drawing boundaries in the right places, so things that change together stay together.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The one line to remember",
        text: "**High cohesion** = each module does *one thing well*. **Low coupling** = modules *barely need each other*. Almost every \"clean up this code\" task is just nudging these two dials in the right direction.",
      },
    ],

    handsOn: [
      {
        title: "01 · Move a function to its home module",
        body: "The board loads tangled: all eight functions sit in one **Unsorted** pile with dependency lines crossing everywhere. Click **chargeCard**, then pick **Billing** as its destination. Watch the log narrate `moved chargeCard → Billing: coupling 9→7` and see the coupling bar drop as that edge stops crossing a boundary.",
      },
      {
        title: "02 · Watch cohesion rise as you group",
        body: "Keep moving related functions together — `calcTax` and `formatInvoice` into **Billing**, `sendEmail` and `logEvent` into **Notifications**, the order functions into **Orders**. The **cohesion** indicator climbs as each module fills up with related members, while the **coupling** score keeps falling. Improving both at once is the whole game.",
      },
      {
        title: "03 · Auto-refactor vs. Tangle it",
        body: "Press **Auto-refactor** to snap every function into its ideal module — coupling bottoms out and cohesion maxes, showing you the target state. Then hit **Tangle it** to dump everything back into one module and watch both metrics collapse. The contrast makes \"high cohesion, low coupling\" visible at a glance.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "order.ts",
        code: `// ❌ BEFORE: one God class — low cohesion, tightly coupled to concretes
class OrderManager {
  place(order: Order) {
    if (!order.items.length) throw new Error("empty order"); // validation
    const tax = order.subtotal * 0.2;                        // tax
    new StripeGateway().charge(order.subtotal + tax);        // payment (concrete!)
    new MySqlDb().save(order);                               // persistence (concrete!)
    new SmtpMailer().send(order.email, "Thanks!");           // notification (concrete!)
  }
}

// ✅ AFTER: focused classes, each depending on small interfaces
interface PaymentGateway { charge(cents: number): void; }
interface OrderRepo     { save(order: Order): void; }
interface Mailer        { send(to: string, body: string): void; }

class TaxCalculator { taxFor(o: Order) { return o.subtotal * 0.2; } }
class OrderValidator { validate(o: Order) { if (!o.items.length) throw new Error("empty order"); } }

class OrderService {
  constructor(
    private validator: OrderValidator,
    private tax: TaxCalculator,
    private pay: PaymentGateway,   // interface, injected
    private repo: OrderRepo,       // interface, injected
    private mailer: Mailer,        // interface, injected
  ) {}

  place(order: Order) {
    this.validator.validate(order);
    const total = order.subtotal + this.tax.taxFor(order);
    this.pay.charge(total);
    this.repo.save(order);
    this.mailer.send(order.email, "Thanks!");
  }
}
// swapping Stripe → PayPal, or MySQL → Postgres, never touches OrderService.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "OrderService.java",
        code: `// ❌ BEFORE: one God class — low cohesion, welded to concretes
class OrderManager {
    void place(Order order) {
        if (order.items.isEmpty()) throw new IllegalStateException("empty"); // validate
        double tax = order.subtotal * 0.2;                                   // tax
        new StripeGateway().charge(order.subtotal + tax);                    // pay
        new MySqlDb().save(order);                                           // persist
        new SmtpMailer().send(order.email, "Thanks!");                       // notify
    }
}

// ✅ AFTER: focused classes depending on interfaces
interface PaymentGateway { void charge(double cents); }
interface OrderRepo      { void save(Order order); }
interface Mailer         { void send(String to, String body); }

class TaxCalculator  { double taxFor(Order o) { return o.subtotal * 0.2; } }
class OrderValidator { void validate(Order o) { if (o.items.isEmpty()) throw new IllegalStateException("empty"); } }

class OrderService {
    private final OrderValidator validator;
    private final TaxCalculator tax;
    private final PaymentGateway pay;   // interface, injected
    private final OrderRepo repo;       // interface, injected
    private final Mailer mailer;        // interface, injected

    OrderService(OrderValidator v, TaxCalculator t, PaymentGateway p, OrderRepo r, Mailer m) {
        this.validator = v; this.tax = t; this.pay = p; this.repo = r; this.mailer = m;
    }

    void place(Order order) {
        validator.validate(order);
        double total = order.subtotal + tax.taxFor(order);
        pay.charge(total);
        repo.save(order);
        mailer.send(order.email, "Thanks!");
    }
}
// swap StripeGateway -> PayPalGateway by changing one wiring line, not OrderService.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "order.py",
        code: `from typing import Protocol


# ❌ BEFORE: one God class — low cohesion, welded to concretes
class OrderManager:
    def place(self, order):
        if not order.items:                       # validation
            raise ValueError("empty order")
        tax = order.subtotal * 0.2               # tax
        StripeGateway().charge(order.subtotal + tax)   # payment (concrete!)
        MySqlDb().save(order)                          # persistence (concrete!)
        SmtpMailer().send(order.email, "Thanks!")      # notification (concrete!)


# ✅ AFTER: focused classes depending on small interfaces
class PaymentGateway(Protocol):
    def charge(self, cents: float) -> None: ...


class OrderRepo(Protocol):
    def save(self, order) -> None: ...


class Mailer(Protocol):
    def send(self, to: str, body: str) -> None: ...


class TaxCalculator:
    def tax_for(self, order) -> float:
        return order.subtotal * 0.2


class OrderValidator:
    def validate(self, order) -> None:
        if not order.items:
            raise ValueError("empty order")


class OrderService:
    def __init__(self, validator, tax, pay: PaymentGateway,
                 repo: OrderRepo, mailer: Mailer):
        self._validator = validator
        self._tax = tax
        self._pay = pay        # interface, injected
        self._repo = repo      # interface, injected
        self._mailer = mailer  # interface, injected

    def place(self, order) -> None:
        self._validator.validate(order)
        total = order.subtotal + self._tax.tax_for(order)
        self._pay.charge(total)
        self._repo.save(order)
        self._mailer.send(order.email, "Thanks!")
# swapping Stripe -> PayPal never touches OrderService.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "order.cpp",
        code: `#include <memory>
#include <stdexcept>
#include <string>

// ❌ BEFORE: one God class — low cohesion, welded to concretes
class OrderManager {
public:
    void place(const Order& order) {
        if (order.items.empty()) throw std::runtime_error("empty"); // validate
        double tax = order.subtotal * 0.2;                          // tax
        StripeGateway().charge(order.subtotal + tax);               // pay (concrete!)
        MySqlDb().save(order);                                      // persist (concrete!)
        SmtpMailer().send(order.email, "Thanks!");                  // notify (concrete!)
    }
};

// ✅ AFTER: focused classes depending on interfaces
struct PaymentGateway { virtual void charge(double cents) = 0; virtual ~PaymentGateway() = default; };
struct OrderRepo      { virtual void save(const Order&) = 0;   virtual ~OrderRepo() = default; };
struct Mailer         { virtual void send(const std::string&, const std::string&) = 0; virtual ~Mailer() = default; };

struct TaxCalculator  { double taxFor(const Order& o) const { return o.subtotal * 0.2; } };
struct OrderValidator { void validate(const Order& o) const { if (o.items.empty()) throw std::runtime_error("empty"); } };

class OrderService {
    OrderValidator validator;
    TaxCalculator tax;
    PaymentGateway* pay;   // interface, injected
    OrderRepo* repo;       // interface, injected
    Mailer* mailer;        // interface, injected
public:
    OrderService(PaymentGateway* p, OrderRepo* r, Mailer* m)
        : pay(p), repo(r), mailer(m) {}

    void place(const Order& order) {
        validator.validate(order);
        double total = order.subtotal + tax.taxFor(order);
        pay->charge(total);
        repo->save(order);
        mailer->send(order.email, "Thanks!");
    }
};
// swap a concrete gateway by passing a different pointer — OrderService is untouched.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for these dials" },
      {
        type: "p",
        text: "Use cohesion and coupling as your everyday review lens, not just for big redesigns. Whenever a class name turns vague (`Manager`, `Util`, `Helper`), whenever one method does several unrelated jobs, or whenever a tiny change ripples across many files, the dials are telling you to *split for cohesion* and *introduce an interface for coupling*. The payoff is biggest exactly where code changes most — at the seams between subsystems and around third-party integrations.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't chase the metrics off a cliff",
        text: "\"More modules\" is not the goal — *better boundaries* is. Splitting a focused class into a dozen anemic fragments that constantly call each other trades good cohesion for awful coupling. Group what changes together; only draw a boundary where there's a real seam.",
      },
    ],

    tradeoffs: {
      pros: [
        "Changes stay local — a focused, loosely coupled module can be modified without rippling across the codebase.",
        "Easier to test in isolation — depend on interfaces and you can mock collaborators trivially.",
        "Independent evolution and reuse — swap implementations (Stripe → PayPal, MySQL → Postgres) by changing one wiring line.",
        "Easier to read and reason about — one module, one job, with thin, explicit lines crossing its boundary.",
      ],
      cons: [
        "Over-splitting into anemic fragments — too many tiny classes that do almost nothing but call each other adds coupling and noise.",
        "Hidden coupling sneaks back through shared globals, singletons, or event buses that don't show up as obvious dependencies.",
        "Premature abstraction — adding interfaces and indirection before you actually need to swap anything just slows you down.",
        "Metrics are a guide, not a target — chasing a cohesion/coupling number blindly can produce technically 'clean' but harder-to-follow code.",
      ],
    },

    furtherReading: [
      {
        label: "Wikipedia — Coupling (computer programming)",
        href: "https://en.wikipedia.org/wiki/Coupling_(computer_programming)",
        note: "The full coupling spectrum from content coupling down to data coupling, with clear definitions of each level.",
        kind: "article",
      },
      {
        label: "Wikipedia — Cohesion (computer science)",
        href: "https://en.wikipedia.org/wiki/Cohesion_(computer_science)",
        note: "The cohesion ladder from coincidental up to functional, the gold standard you should aim for.",
        kind: "article",
      },
      {
        label: "Wikipedia — Single responsibility principle",
        href: "https://en.wikipedia.org/wiki/Single-responsibility_principle",
        note: "High cohesion stated as a design rule: a module should have one, and only one, reason to change.",
        kind: "article",
      },
      {
        label: "Structured Design — Larry Constantine & Ed Yourdon",
        note: "The classic that introduced coupling and cohesion as measurable design qualities; the origin of the whole vocabulary.",
        kind: "book",
      },
      {
        label: "Clean Architecture — Robert C. Martin",
        note: "Modern treatment connecting cohesion, coupling, the SOLID principles, and dependency inversion across module boundaries.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "cc-q1",
        question: "What do high cohesion and low coupling each describe?",
        options: [
          { id: "a", label: "Cohesion = how fast a module runs; coupling = how much memory it uses." },
          { id: "b", label: "Cohesion = how focused a module's own responsibilities are; coupling = how much it depends on other modules." },
          { id: "c", label: "Cohesion = number of modules; coupling = number of methods per module." },
          { id: "d", label: "They're two names for the same property." },
        ],
        correctOptionId: "b",
        explanation:
          "Cohesion is internal focus — does a module do one thing well? Coupling is external dependency — how much must it know about other modules? You want high cohesion and low coupling.",
      },
      {
        id: "cc-q2",
        question: "A single `OrderManager` class validates orders, charges cards, saves to the DB, and sends emails. Which problem is this?",
        options: [
          { id: "a", label: "High cohesion — it does a lot, so it's very capable." },
          { id: "b", label: "Low coupling — everything is in one place, so nothing depends on anything." },
          { id: "c", label: "Low cohesion — a God class doing several unrelated jobs that should be separate modules." },
          { id: "d", label: "Nothing wrong — fewer classes is always simpler." },
        ],
        correctOptionId: "c",
        explanation:
          "Four unrelated responsibilities in one class is the classic low-cohesion God class. Each job has its own reason to change, so each should live in its own focused module.",
      },
      {
        id: "cc-q3",
        question: "You change one class and five others break. Which design quality is poor?",
        options: [
          { id: "a", label: "Cohesion is too high." },
          { id: "b", label: "Coupling is too high — the modules depend on each other's internals too tightly." },
          { id: "c", label: "Coupling is too low." },
          { id: "d", label: "Cohesion is too low, which never causes ripple effects." },
        ],
        correctOptionId: "b",
        explanation:
          "Ripple effects — touch one thing, break five — are the signature of high coupling. The modules know too much about each other; depending on interfaces instead would isolate the change.",
      },
      {
        id: "cc-q4",
        question: "How does depending on an interface instead of a concrete class (DIP) reduce coupling?",
        options: [
          { id: "a", label: "It makes the program run faster by skipping the concrete class." },
          { id: "b", label: "It removes the need for any dependencies at all." },
          { id: "c", label: "The module depends on a thin, stable contract instead of a concrete type, so implementations can be swapped without changing the module." },
          { id: "d", label: "It copies the concrete class's code into the interface." },
        ],
        correctOptionId: "c",
        explanation:
          "An interface is a thin, stable line crossing the boundary. The high-level module depends on that abstraction, not on a concrete class, so you can swap implementations or mock in tests without touching it — that's the Dependency Inversion Principle.",
      },
      {
        id: "cc-q5",
        question: "Why can splitting a class too aggressively actually hurt the design?",
        options: [
          { id: "a", label: "It always improves both cohesion and coupling, so there's no downside." },
          { id: "b", label: "Many anemic fragments that constantly call each other raise coupling, even though each piece looks 'cohesive'." },
          { id: "c", label: "More classes always run slower." },
          { id: "d", label: "Splitting removes the need for interfaces." },
        ],
        correctOptionId: "b",
        explanation:
          "Cohesion and coupling trade off under careless splitting. Chop a focused class into tiny pieces and they all start calling each other, so coupling climbs. The goal is good boundaries along real seams — group what changes together — not simply more modules.",
      },
    ],
  },
};
