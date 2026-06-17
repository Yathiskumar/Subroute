import type { RoadmapLesson } from "@/lib/content/types";

export const graspPrinciples: RoadmapLesson = {
  title: "Responsibility Assignment (GRASP)",
  oneLiner:
    "GRASP is a checklist for answering the one question OO design keeps asking — \"which class should own this responsibility?\" — by handing each job to whoever already has the information and authority to do it.",
  difficulty: "intermediate",
  estimatedTime: "15 min",
  prototypePath: "/prototypes/lld/grasp-principles.html",
  content: {
    prototypeCaption:
      "A round-by-round responsibility quiz. Each scenario asks **\"who should own this job?\"** — compute the order total, create an order line, receive the *checkout* event — and shows you the candidate classes *with their fields* so you can see who actually holds the information. Click the class you'd assign it to; the console narrates the governing GRASP principle and the coupling/cohesion cost of a wrong pick. Step through five scenarios with a running score, then **Reset** to try again.",

    overview: [
      {
        type: "p",
        text: "Once you've decided *what* classes exist, the harder question begins: *which class should do each job?* Should the `Order` compute its own total, or should a `Controller` reach in and add up the line items? Should the UI window create a new `OrderLine`, or should the `Order` make it? **GRASP** — *General Responsibility Assignment Software Patterns*, from Craig Larman's *Applying UML and Patterns* — is a named checklist of nine principles for answering exactly this: *where should each responsibility live?*",
      },
      {
        type: "p",
        text: "Think of running a team. A new task comes in — *\"how much is this order worth?\"* You don't hand it to whoever is standing closest; you hand it to the person who *has the information* to answer it. The accountant has the numbers, so the accountant tallies the bill. The warehouse has the stock, so the warehouse reports inventory. Assigning work to whoever holds the relevant facts (and the authority to act on them) keeps everyone focused and keeps hand-offs thin. GRASP is that instinct, made explicit for classes.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Give each responsibility to the class that already *has the information to fulfill it* — that's **Information Expert**, the heart of GRASP, and most of the other principles are just refinements of it.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The running example: an e-commerce Order" },
      {
        type: "p",
        text: "We'll use Larman's classic point-of-sale shape. An `Order` *contains* a list of `OrderLine` objects; each `OrderLine` references a `Product` and a quantity. There's a UI `Window` where the cashier clicks, and somewhere a `Checkout` use case fires. The question every principle answers is the same: *given a new job, which of these classes should own it?*",
      },
      { type: "h", text: "Information Expert — give the job to whoever has the data" },
      {
        type: "p",
        text: "The most-used GRASP principle: **assign a responsibility to the class that has the information needed to fulfill it.** Who should compute the order's grand total? The `Order` holds the list of lines, so the `Order` is the expert — it sums its lines. But each line's *subtotal* depends on a price and a quantity that live on the `OrderLine`, so each `OrderLine` computes its own subtotal. The work flows to where the data already is, and no one has to reach across object boundaries to peek at someone else's internals.",
      },
      {
        type: "code",
        language: "typescript",
        code: `// ❌ BAD: the Controller is NOT the information expert.
// It reaches into the order's internals, then into each line's internals.
class CheckoutController {
  grandTotal(order: Order): number {
    let total = 0;
    for (const line of order.lines) {          // poking at Order's internals
      total += line.product.price * line.qty;  // poking at OrderLine's internals
    }
    return total; // logic that depends on Order/OrderLine data lives OUTSIDE them
  }
}

// ✅ GOOD: Information Expert — the data owner computes its own answer.
class OrderLine {
  constructor(private product: Product, private qty: number) {}
  subtotal(): number { return this.product.price * this.qty; } // it has the data
}
class Order {
  private lines: OrderLine[] = [];
  total(): number {                                  // Order has the lines…
    return this.lines.reduce((sum, l) => sum + l.subtotal(), 0); // …so Order sums them
  }
}`,
      },
      {
        type: "p",
        text: "Notice the payoff: in the good version, change how a line is priced (add a discount, a tax band) and you edit `OrderLine` *only* — the `Order` and the controller don't move. In the bad version, that pricing logic leaked into the controller, so a pricing change drags the controller along with it. *Information Expert produces low coupling and high cohesion as a side effect* — which is exactly why it's the workhorse.",
      },
      { type: "h", text: "Creator — who should make a new object?" },
      {
        type: "p",
        text: "When something needs to be instantiated, **Creator** says: assign creation to the class that *contains, aggregates, records, or closely uses* the new object — and that has the data to initialize it. Who creates a new `OrderLine`? The `Order` does: it *contains* the lines, and it has (or is handed) the `Product` and quantity needed to build one. The UI `Window` shouldn't `new OrderLine(...)` and then hand it over; that scatters construction logic and couples the UI to the line's constructor.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class Order {
  private lines: OrderLine[] = [];
  // Creator: the container that aggregates OrderLines is the one that makes them.
  addLine(product: Product, qty: number): void {
    this.lines.push(new OrderLine(product, qty)); // Order owns its parts
  }
}`,
      },
      { type: "h", text: "Controller — who receives a system event?" },
      {
        type: "p",
        text: "When a *system event* arrives from the outside (the cashier clicks **checkout**), **Controller** says: route it to a **non-UI** object that represents either the overall use case (a `CheckoutHandler`, a *use-case controller*) or the system/root object (a façade controller). The point is to keep the UI thin — the window captures the click and immediately delegates — so business logic never gets tangled into buttons and views. A bloated controller that does *everything*, though, is an anti-pattern; the controller should *coordinate*, then delegate the real work to the experts.",
      },
      { type: "h", text: "Low Coupling & High Cohesion — the evaluative pair" },
      {
        type: "p",
        text: "These two aren't about a specific job — they're the *scorecard* you hold up to any candidate assignment. **Low Coupling**: prefer the assignment that creates the fewest, thinnest dependencies between classes. **High Cohesion**: prefer the assignment that keeps each class focused on one set of related responsibilities. When two placements both seem plausible, pick the one that keeps both dials healthy. Information Expert usually *wins* on this scorecard automatically — putting the logic next to its data is what keeps coupling low and cohesion high.",
      },
      {
        type: "callout",
        variant: "info",
        title: "GRASP sits underneath SOLID and the GoF patterns",
        text: "These principles aren't a competing system — they're the *foundation*. High Cohesion restated is the **Single Responsibility Principle**; Protected Variations is the spirit behind the **Open/Closed** and **Dependency Inversion** principles; Polymorphism and Indirection are the seeds of half the **Gang of Four** patterns (Strategy, Adapter, Mediator, Facade). Learn GRASP and the rest of OO design starts to feel like named special cases of it.",
      },
      { type: "h", text: "The remaining five, in one line each" },
      {
        type: "ul",
        items: [
          "**Polymorphism** — when behavior varies *by type*, assign the variation to subtypes via a polymorphic operation instead of `if/else`/`switch` on a type tag (e.g. each `PaymentMethod` charges itself).",
          "**Indirection** — assign a responsibility to an *intermediate* object so two things don't couple directly (a mediator/adapter sitting between them).",
          "**Pure Fabrication** — when no domain class is a good home, invent a *made-up* class that doesn't represent a real-world concept (e.g. a `OrderRepository` or `TaxService`) to keep coupling low and cohesion high.",
          "**Protected Variations** — wrap an unstable point (a third-party API, a changing rule) behind a *stable interface* so variation on one side can't ripple to the other.",
          "**Indirection + Pure Fabrication + Protected Variations** together are how you tame the messy parts the pure domain model can't absorb cleanly.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "These are heuristics, not laws",
        text: "GRASP names *forces to weigh*, not rules to obey mechanically. Don't invent a **Pure Fabrication** for every responsibility — a `OrderTotalCalculatorServiceManager` that just re-derives what `Order` already knows is worse than `Order.total()`. Reach for fabrication only when the domain class genuinely *isn't* the right home (persistence, cross-cutting concerns). When Information Expert gives a clean answer, take it.",
      },
    ],

    handsOn: [
      {
        title: "01 · Assign the grand-total responsibility",
        body: "Scenario 1 asks **\"who should compute the order's grand total?\"** and shows four cards — `Window`, `CheckoutController`, `Order`, `OrderLine` — each listing its fields. Read the fields: only `Order` holds `lines[]`. Click **Order**. The console confirms *Information Expert — Order has the line items, so Order sums them*, and your score ticks up.",
      },
      {
        title: "02 · Pick a wrong owner on purpose",
        body: "On the *\"who should create a new OrderLine?\"* scenario, click **Window** (the UI) instead of `Order`. You'll get a ✗ and a narration of the cost — *the UI now knows OrderLine's constructor; coupling rises, cohesion drops*. The feedback names the principle you violated (**Creator**) and what the right owner was, so a wrong pick still teaches.",
      },
      {
        title: "03 · Step through all five and Reset",
        body: "Use **Next ›** and **‹ Prev** to walk the full set — grand total, create line, receive *checkout*, charge-by-type (**Polymorphism**), and persist the order (**Pure Fabrication**). The header bar tracks *scenario X / 5* and your live score. Hit **Reset** to clear answers and the log, then try to score 5 / 5 in one pass.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "order.ts",
        code: `// Information Expert + Creator: the Order owns its lines and the totalling logic.
class Product {
  constructor(public name: string, public price: number) {}
}

class OrderLine {
  constructor(private product: Product, private qty: number) {}
  // Information Expert: the line has the price and qty, so the line computes subtotal.
  subtotal(): number { return this.product.price * this.qty; }
}

class Order {
  private lines: OrderLine[] = [];

  // Creator: Order CONTAINS OrderLines, so Order creates them.
  addLine(product: Product, qty: number): void {
    this.lines.push(new OrderLine(product, qty));
  }

  // Information Expert: Order has the lines, so Order sums them.
  total(): number {
    return this.lines.reduce((sum, line) => sum + line.subtotal(), 0);
  }
}

const order = new Order();
order.addLine(new Product("Keyboard", 49), 2);
order.addLine(new Product("Mouse", 25), 1);
console.log(order.total()); // 123 — no class reached into another's internals`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Order.java",
        code: `import java.util.ArrayList;
import java.util.List;

// Information Expert + Creator: the Order owns its lines and the totalling logic.
class Product {
    final String name;
    final double price;
    Product(String name, double price) { this.name = name; this.price = price; }
}

class OrderLine {
    private final Product product;
    private final int qty;
    OrderLine(Product product, int qty) { this.product = product; this.qty = qty; }
    // Information Expert: the line has the price and qty, so the line computes subtotal.
    double subtotal() { return product.price * qty; }
}

class Order {
    private final List<OrderLine> lines = new ArrayList<>();

    // Creator: Order CONTAINS OrderLines, so Order creates them.
    void addLine(Product product, int qty) {
        lines.add(new OrderLine(product, qty));
    }

    // Information Expert: Order has the lines, so Order sums them.
    double total() {
        return lines.stream().mapToDouble(OrderLine::subtotal).sum();
    }
}

class Demo {
    public static void main(String[] args) {
        Order order = new Order();
        order.addLine(new Product("Keyboard", 49), 2);
        order.addLine(new Product("Mouse", 25), 1);
        System.out.println(order.total()); // 123
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "order.py",
        code: `# Information Expert + Creator: the Order owns its lines and the totalling logic.
class Product:
    def __init__(self, name: str, price: float):
        self.name = name
        self.price = price


class OrderLine:
    def __init__(self, product: Product, qty: int):
        self._product = product
        self._qty = qty

    # Information Expert: the line has the price and qty, so the line computes subtotal.
    def subtotal(self) -> float:
        return self._product.price * self._qty


class Order:
    def __init__(self):
        self._lines: list[OrderLine] = []

    # Creator: Order CONTAINS OrderLines, so Order creates them.
    def add_line(self, product: Product, qty: int) -> None:
        self._lines.append(OrderLine(product, qty))

    # Information Expert: Order has the lines, so Order sums them.
    def total(self) -> float:
        return sum(line.subtotal() for line in self._lines)


order = Order()
order.add_line(Product("Keyboard", 49), 2)
order.add_line(Product("Mouse", 25), 1)
print(order.total())  # 123 — no class reached into another's internals`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "order.cpp",
        code: `#include <iostream>
#include <string>
#include <vector>

// Information Expert + Creator: the Order owns its lines and the totalling logic.
struct Product {
    std::string name;
    double price;
};

class OrderLine {
    Product product;
    int qty;
public:
    OrderLine(Product product, int qty) : product(std::move(product)), qty(qty) {}
    // Information Expert: the line has the price and qty, so the line computes subtotal.
    double subtotal() const { return product.price * qty; }
};

class Order {
    std::vector<OrderLine> lines;
public:
    // Creator: Order CONTAINS OrderLines, so Order creates them.
    void addLine(const Product& product, int qty) {
        lines.emplace_back(product, qty);
    }
    // Information Expert: Order has the lines, so Order sums them.
    double total() const {
        double sum = 0;
        for (const auto& line : lines) sum += line.subtotal();
        return sum;
    }
};

int main() {
    Order order;
    order.addLine({"Keyboard", 49}, 2);
    order.addLine({"Mouse", 25}, 1);
    std::cout << order.total() << "\\n"; // 123
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for GRASP" },
      {
        type: "p",
        text: "Use GRASP whenever you're staring at a method and unsure *which class it belongs on* — during design, in code review, or mid-refactor. The trigger questions are concrete: *Does this logic reach into another object's fields to do its job?* (move it to the Information Expert). *Is the UI doing business work?* (introduce a Controller). *Is a class creating something it doesn't contain or use?* (revisit Creator). *Does no domain class feel like the right home?* (consider a Pure Fabrication). GRASP turns the vague \"this feels off\" into a named force you can argue about.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't over-fabricate",
        text: "The most common GRASP overreach is sprinkling `Manager`, `Service`, and `Helper` classes everywhere under the banner of Pure Fabrication. Each one you add *removes* logic from the object that owns the data, lowering cohesion of the domain model. Fabricate when there's a real reason (persistence, an external integration, a cross-cutting concern) — not as a reflex.",
      },
    ],

    tradeoffs: {
      pros: [
        "A shared vocabulary — \"that's not the Information Expert\" or \"the UI is acting as a Controller\" makes design reviews precise instead of hand-wavy.",
        "Information Expert and Creator give low coupling and high cohesion almost for free — the data and the logic that needs it end up together.",
        "GRASP underlies SOLID and the GoF patterns, so it transfers everywhere and makes those higher-level ideas click.",
        "It scales down — useful for a single method's placement, not just whole-system architecture.",
      ],
      cons: [
        "They're heuristics, not algorithms — two engineers can weigh the forces differently and reach different (both defensible) assignments.",
        "Overusing Pure Fabrication scatters logic into anemic Manager/Service classes and hollows out the domain model.",
        "A Controller can swell into a God class if it does work instead of delegating to the experts.",
        "Knowing the names doesn't replace judgment — you still have to read the data flow to see who the real expert is.",
      ],
    },

    furtherReading: [
      {
        label: "Wikipedia — GRASP (object-oriented design)",
        href: "https://en.wikipedia.org/wiki/GRASP_(object-oriented_design)",
        note: "The canonical reference list of all nine principles with crisp one-paragraph definitions of each. Start here.",
        kind: "article",
      },
      {
        label: "Applying UML and Patterns — Craig Larman",
        note: "The book that introduced GRASP and made responsibility assignment the centerpiece of OO design, taught through a running point-of-sale case study. The original source.",
        kind: "book",
      },
      {
        label: "GRASP: 9 Must-Know Design Principles for Code — Fluent C++",
        href: "https://www.fluentcpp.com/2021/06/23/grasp-9-must-know-design-principles-for-code/",
        note: "A practical walk through all nine with code, and a useful take on how the principles aren't equally fundamental — some are overarching, some are techniques.",
        kind: "article",
      },
      {
        label: "GRASP — General Responsibility Assignment Software Patterns (bool.dev)",
        href: "https://bool.dev/blog/detail/grasp",
        note: "A focused explainer that leans on Information Expert and Controller with worked examples — good for cementing the two you'll use most.",
        kind: "article",
      },
      {
        label: "Wikipedia — Single-responsibility principle",
        href: "https://en.wikipedia.org/wiki/Single-responsibility_principle",
        note: "Read alongside High Cohesion: SRP is essentially that GRASP principle restated as \"one reason to change.\"",
        kind: "article",
      },
      {
        label: "GRASP Patterns — David Duncan (University of Colorado, PDF)",
        href: "https://home.cs.colorado.edu/~kena/classes/5448/f12/presentation-materials/duncan.pdf",
        note: "A concise academic lecture deck covering each principle with UML and motivation — handy as a printable revision sheet.",
        kind: "paper",
      },
    ],

    quiz: [
      {
        id: "grasp-q1",
        question:
          "An order contains line items. Following Information Expert, which class should compute the order's grand total?",
        options: [
          { id: "a", label: "The UI window, because that's where the total is displayed." },
          { id: "b", label: "The Order, because it holds the list of line items needed to total them." },
          { id: "c", label: "A standalone TotalCalculator utility that reaches into the order." },
          { id: "d", label: "Each Product, because products know their own price." },
        ],
        correctOptionId: "b",
        explanation:
          "Information Expert assigns a responsibility to the class that has the information to fulfill it. The Order holds the lines, so the Order sums them (delegating each line's subtotal to the OrderLine that owns the price and quantity). Putting the logic anywhere else forces that class to reach into the Order's internals.",
      },
      {
        id: "grasp-q2",
        question: "By the Creator principle, which class should instantiate a new OrderLine?",
        options: [
          { id: "a", label: "The Order, because it contains/aggregates the OrderLines." },
          { id: "b", label: "The UI window, because the cashier clicked to add an item." },
          { id: "c", label: "The Product, because the line refers to a product." },
          { id: "d", label: "A global factory singleton, always, for every object in the system." },
        ],
        correctOptionId: "a",
        explanation:
          "Creator says assign creation to the class that contains, aggregates, records, or closely uses the new object and has the data to initialize it. The Order contains its OrderLines, so the Order creates them — keeping construction logic out of the UI.",
      },
      {
        id: "grasp-q3",
        question: "A 'checkout' system event arrives from the UI. By the Controller principle, what should receive it?",
        options: [
          { id: "a", label: "The button's click handler, which then runs all the business logic inline." },
          { id: "b", label: "Whichever domain object is nearest, picked at random." },
          { id: "c", label: "A non-UI controller (a use-case or façade controller) that coordinates the work and delegates to experts." },
          { id: "d", label: "The database, so the event is persisted immediately." },
        ],
        correctOptionId: "c",
        explanation:
          "Controller routes a system event to a non-UI object representing the use case or the system root. The UI captures the click and immediately delegates, keeping business logic out of views — but the controller coordinates and delegates rather than doing all the work itself.",
      },
      {
        id: "grasp-q4",
        question: "What role do Low Coupling and High Cohesion play among the GRASP principles?",
        options: [
          { id: "a", label: "They name specific responsibilities, like 'compute the total,' to assign to classes." },
          { id: "b", label: "They are the evaluative scorecard used to choose between candidate assignments." },
          { id: "c", label: "They are only relevant to database design, not class design." },
          { id: "d", label: "They replace the need for Information Expert and Creator." },
        ],
        correctOptionId: "b",
        explanation:
          "Low Coupling and High Cohesion are the evaluative pair — you hold them up to any proposed assignment and prefer the one that keeps dependencies thin and classes focused. Information Expert usually scores well on this scorecard automatically, which is why it's the default.",
      },
      {
        id: "grasp-q5",
        question: "When is Pure Fabrication the right call?",
        options: [
          { id: "a", label: "Always — every responsibility deserves its own Manager or Service class." },
          { id: "b", label: "Never — domain classes should own everything, with no exceptions." },
          { id: "c", label: "When no domain class is a good home, so a made-up class (e.g. a repository) keeps coupling low and cohesion high." },
          { id: "d", label: "Only when you want behavior to vary by subtype." },
        ],
        correctOptionId: "c",
        explanation:
          "Pure Fabrication invents a non-domain class for a responsibility that doesn't fit any domain class — persistence, an external integration, a cross-cutting concern. It's a deliberate exception, not a default: over-fabricating drains logic out of the objects that own the data and hollows out the domain model.",
      },
      {
        id: "grasp-q6",
        question: "Charging an order can happen by card, wallet, or gift code, each with different logic. Which GRASP principle fits best?",
        options: [
          { id: "a", label: "Indirection — add a mediator object between unrelated classes." },
          { id: "b", label: "Polymorphism — let each PaymentMethod subtype charge itself, instead of a switch on a type tag." },
          { id: "c", label: "Creator — have the Order construct the payment." },
          { id: "d", label: "Protected Variations — there's no variation to protect against here." },
        ],
        correctOptionId: "b",
        explanation:
          "When behavior varies by type, Polymorphism assigns the variation to subtypes via a polymorphic operation, replacing a brittle if/else or switch on a type tag. Each PaymentMethod implementation charges itself — and this is the seed of the Strategy pattern.",
      },
    ],
  },
};
