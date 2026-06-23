import type { RoadmapLesson } from "@/lib/content/types";

export const injectionStyles: RoadmapLesson = {
  title: "Injection styles: constructor vs setter vs field",
  oneLiner:
    "There are three ways to hand a dependency to an object: through its constructor, through a setter you call later, or by letting a framework reach in and set a private field. They look similar but they are not equal — constructor injection makes required dependencies guaranteed, fields immutable, and tests framework-free, which is why it usually wins.",
  difficulty: "intermediate",
  estimatedTime: "15 min",
  prototypePath: "/prototypes/lld/injection-styles.html",
  content: {
    prototypeCaption:
      "Three tabs for one `OrderService` that needs a `MessageSender`: **Constructor**, **Setter**, and **Field**. Each tab shows that style's small code form and lights up a fixed four-row scorecard — *required dep guaranteed at construction?*, *can be `final`/immutable?*, *testable with a plain `new` + fake, no framework?*, *visible in the public API?* — as ✓ / ~ / ✗. A running green-checks tally sits beside each style; **Constructor** scores highest. The one explain panel is replaced on every tab switch (never appended) to narrate that style's trade-off and when it's the right pick.",

    overview: [
      {
        type: "p",
        text: "Once you've decided to *inject* a dependency instead of building it with `new` inside a class, one question remains: *how* do you hand it in? There are exactly three ways. You can pass it through the **constructor**, you can set it through a **setter** (or property) after the object exists, or you can let a framework set a private **field** directly. All three end with the dependency living inside the object — but they are not interchangeable, and the choice quietly affects how safe, immutable, and testable your class is.",
      },
      {
        type: "p",
        text: "Think about **building a chair**. *Constructor injection* is bolting all four legs on at the factory before the chair ships — you can *never* receive a legless chair, because it isn't a chair until it has legs. *Setter injection* is shipping the chair and screwing the legs on later — handy if the legs are optional, but the chair can sit in your hallway *wobbling* in between. *Field injection* is a magic hand that reaches in and glues legs on somewhere you can't see — the least effort, but you can't watch it happen, can't make the legs permanent, and can't easily inspect the chair to check.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Use the **constructor** for required dependencies (default), a **setter** only for genuinely optional or reconfigurable ones, and avoid **field** injection — it hides the dependency, blocks immutability, and forces you to bring a framework just to test the class.",
      },
      {
        type: "callout",
        variant: "info",
        title: "These are all 'dependency injection'",
        text: "All three styles are forms of *dependency injection* — the dependency comes from *outside* the class rather than being `new`-ed inside it. So this isn't a fight between DI and not-DI. It's a fight *within* DI about which way of passing the dependency gives you the strongest guarantees. The winner, almost always, is the constructor.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Constructor injection — the dependency is a constructor parameter" },
      {
        type: "p",
        text: "The dependency is declared as a parameter of the constructor, and the class stores it in a `final`/`readonly` field. Because the object *cannot be built* without supplying it, a required dependency is **guaranteed present** the moment the object exists.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class OrderService {
  constructor(private readonly sender: MessageSender) {}   // required, immutable
  placeOrder(c: string) { this.sender.send(c, "Confirmed"); }
}
new OrderService(new EmailSender());   // can't build it without a sender`,
      },
      {
        type: "p",
        text: "This buys you four things at once. **(1)** A required dependency is guaranteed — there is no way to construct a half-built object. **(2)** The field can be `final`/`readonly`, so the dependency is **immutable** and can't be swapped out from under you. **(3)** The dependency is **visible in the public API** — anyone reading the constructor signature sees exactly what this class needs. **(4)** You can build it in a **plain unit test** with `new OrderService(fakeSender)` — no framework, no reflection, no container.",
      },
      { type: "h", text: "Setter (property) injection — a setX() called after construction" },
      {
        type: "p",
        text: "Here the object is constructed first, then the dependency is handed in through a setter or writable property afterward.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class OrderService {
  private sender?: MessageSender;
  setSender(s: MessageSender) { this.sender = s; }   // set AFTER construction
  placeOrder(c: string) { this.sender?.send(c, "Confirmed"); }
}
const svc = new OrderService();   // ⚠️ valid object, but sender is undefined here
svc.setSender(new EmailSender()); // ...until you remember to call this`,
      },
      {
        type: "p",
        text: "The strength of setter injection is the same as its weakness: the dependency is **optional and reconfigurable**. That's perfect when a dependency genuinely *is* optional — a cache you may or may not attach, a logger that defaults to no-op. But for a *required* dependency it's a trap: between `new` and `setSender(...)` the object exists in a **half-built state** where calling `placeOrder()` blows up or silently does nothing. The dependency is no longer guaranteed, the field can't be `final`, and it's only *partly* visible in the API — you have to know to look for the setter.",
      },
      { type: "h", text: "Field injection — a framework sets a private field directly" },
      {
        type: "p",
        text: "The dependency is declared as a private field with a framework annotation, and the framework uses reflection to set it directly — no constructor parameter, no setter. In Java this is the `@Autowired` field.",
      },
      {
        type: "code",
        language: "java",
        code: `class OrderService {
    @Autowired                       // framework reaches in via reflection
    private MessageSender sender;    // can't be final; hidden from the API
    void placeOrder(String c) { sender.send(c, "Confirmed"); }
}
// new OrderService() leaves sender = null unless the framework wires it.`,
      },
      {
        type: "p",
        text: "Field injection looks the cleanest — *no boilerplate at all*. But it's the one most teams discourage, for concrete reasons. The dependency is **hidden** — nothing in the public API tells you the class needs a `MessageSender`. The field **can't be `final`**, so it's mutable and the object can briefly exist with a `null` dependency. And worst for daily work: you **can't test it with a plain `new`** — `new OrderService()` leaves the field `null`, so you must spin up the framework or use reflection to inject a fake. A required dependency hidden behind reflection is exactly the thing constructor injection makes safe.",
      },
      { type: "h", text: "The scorecard" },
      {
        type: "p",
        text: "Line the three up against the properties that actually matter and the pattern is obvious. Constructor injection is the only style that wins every row; setter injection is half-and-half (its 'looseness' is a feature only for optional deps); field injection loses the rows you care about most.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 640 300" width="100%" style="max-width:640px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Scorecard comparing constructor, setter, and field injection across four properties. Constructor scores check on all four. Setter scores cross on guaranteed, cross on final, check on testable, and partial on visible. Field scores cross on guaranteed, cross on final, cross on testable, and cross on visible.">
  <!-- column headers -->
  <text x="300" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#5cc66f">Constructor</text>
  <text x="430" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#9099a8">Setter</text>
  <text x="555" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#f06868">Field</text>

  <!-- rows -->
  <!-- row 1 -->
  <text x="14" y="74" font-size="11.5" fill="#e8e4dc">Required dep guaranteed at construction?</text>
  <text x="300" y="74" text-anchor="middle" font-size="15" font-weight="700" fill="#5cc66f">✓</text>
  <text x="430" y="74" text-anchor="middle" font-size="15" font-weight="700" fill="#f06868">✗</text>
  <text x="555" y="74" text-anchor="middle" font-size="15" font-weight="700" fill="#f06868">✗</text>
  <line x1="14" y1="90" x2="626" y2="90" stroke="#232830" stroke-width="1"/>

  <!-- row 2 -->
  <text x="14" y="126" font-size="11.5" fill="#e8e4dc">Can be final / immutable?</text>
  <text x="300" y="126" text-anchor="middle" font-size="15" font-weight="700" fill="#5cc66f">✓</text>
  <text x="430" y="126" text-anchor="middle" font-size="15" font-weight="700" fill="#f06868">✗</text>
  <text x="555" y="126" text-anchor="middle" font-size="15" font-weight="700" fill="#f06868">✗</text>
  <line x1="14" y1="142" x2="626" y2="142" stroke="#232830" stroke-width="1"/>

  <!-- row 3 -->
  <text x="14" y="178" font-size="11.5" fill="#e8e4dc">Testable with plain new + fake, no framework?</text>
  <text x="300" y="178" text-anchor="middle" font-size="15" font-weight="700" fill="#5cc66f">✓</text>
  <text x="430" y="178" text-anchor="middle" font-size="15" font-weight="700" fill="#5cc66f">✓</text>
  <text x="555" y="178" text-anchor="middle" font-size="15" font-weight="700" fill="#f06868">✗</text>
  <line x1="14" y1="194" x2="626" y2="194" stroke="#232830" stroke-width="1"/>

  <!-- row 4 -->
  <text x="14" y="230" font-size="11.5" fill="#e8e4dc">Dependency visible in the public API?</text>
  <text x="300" y="230" text-anchor="middle" font-size="15" font-weight="700" fill="#5cc66f">✓</text>
  <text x="430" y="230" text-anchor="middle" font-size="14" font-weight="700" fill="#d6a23a">~</text>
  <text x="555" y="230" text-anchor="middle" font-size="15" font-weight="700" fill="#f06868">✗</text>
  <line x1="14" y1="246" x2="626" y2="246" stroke="#232830" stroke-width="1"/>

  <!-- tally -->
  <text x="14" y="280" font-size="11.5" font-weight="600" fill="#9099a8">Green checks</text>
  <text x="300" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#5cc66f">4</text>
  <text x="430" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#9099a8">1½</text>
  <text x="555" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#f06868">0</text>
</svg>`,
        caption:
          "The four properties that matter, scored across the three styles. **Constructor** is the only one that wins every row — guaranteed, immutable, framework-free to test, and self-documenting. **Setter** trades the guarantee away (its point is to be optional) but stays testable with a plain `new`; its API visibility is *partial* (`~`) because you must know to look for the setter. **Field** loses the rows that hurt most: the dependency is hidden, mutable, and untestable without the framework.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Constructor injection and 'too many parameters'",
        text: "The usual objection — *but my constructor has eight parameters!* — is a feature, not a bug. A bloated constructor is constructor injection *shouting* that the class has too many responsibilities. Field injection doesn't fix that; it just *hides* the smell so the class can keep growing. Listen to the constructor and split the class.",
      },
    ],

    handsOn: [
      {
        title: "01 · Start on Constructor and read the scorecard",
        body: "Open the prototype on the **Constructor** tab. Read the small code form — the `MessageSender` is a constructor parameter stored in a `final`/`readonly` field. Now read the four-row scorecard: every row is a green ✓, and the tally shows the highest score. Note *why* each is a ✓: you can't build the object without the sender (guaranteed), the field is immutable, you can `new` it with a fake in a test, and the dependency is right there in the signature.",
      },
      {
        title: "02 · Switch to Setter and watch rows flip",
        body: "Click the **Setter** tab. The one explain panel is *replaced* (not appended) to narrate the trade-off. Watch *required guaranteed* and *can be final* flip to ✗ — between `new` and `setSender(...)` the object is half-built and mutable. But notice *testable with plain new* stays ✓, and *visible in API* is a partial `~`. Read the panel: setter injection is the right pick **only for genuinely optional or reconfigurable dependencies**.",
      },
      {
        title: "03 · Switch to Field and see why it's discouraged",
        body: "Click the **Field** tab. The code shows an `@Autowired` private field with no constructor and no setter. Watch the scorecard collapse — guaranteed ✗, final ✗, **testable ✗**, visible ✗ — and the tally drop to zero green checks. The explain panel spells out the cost: the dependency is hidden, can't be `final`, and you need the framework or reflection just to inject a fake in a test. Click back to **Constructor** and confirm it's the only style that wins every row — that's why it's the default.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "order-service.ts",
        code: `interface MessageSender {
  send(to: string, text: string): void;
}

// 1) CONSTRUCTOR injection — required, immutable, visible, test-friendly.
class OrderServiceCtor {
  constructor(private readonly sender: MessageSender) {}   // can't build without it
  placeOrder(customer: string) {
    this.sender.send(customer, "Order confirmed");
  }
}
// const svc = new OrderServiceCtor(new FakeSender());  // plain new + fake in a test

// 2) SETTER (property) injection — good for OPTIONAL/reconfigurable deps.
class OrderServiceSetter {
  private sender?: MessageSender;                          // may be unset
  setSender(sender: MessageSender) { this.sender = sender; }
  placeOrder(customer: string) {
    // ⚠️ half-built until setSender() is called
    this.sender?.send(customer, "Order confirmed");
  }
}
// const s = new OrderServiceSetter(); s.setSender(new FakeSender());

// 3) FIELD injection — no boilerplate, but hidden + can't be readonly.
//    (TS has no @Autowired; the closest is a mutable field set from outside.)
class OrderServiceField {
  sender!: MessageSender;            // set later, e.g. by a container; not readonly
  placeOrder(customer: string) {
    this.sender.send(customer, "Order confirmed");   // null if never wired
  }
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "OrderService.java",
        code: `interface MessageSender {
    void send(String to, String text);
}

// 1) CONSTRUCTOR injection — recommended by Spring. Required + final.
class OrderServiceCtor {
    private final MessageSender sender;                  // immutable, guaranteed
    OrderServiceCtor(MessageSender sender) {             // @Autowired optional on
        this.sender = sender;                            // a single constructor
    }
    void placeOrder(String customer) {
        sender.send(customer, "Order confirmed");
    }
}
// new OrderServiceCtor(new FakeSender());  // plain new + fake, no Spring needed

// 2) SETTER injection — for OPTIONAL or reconfigurable dependencies.
class OrderServiceSetter {
    private MessageSender sender;                         // not final
    @Autowired(required = false)
    void setSender(MessageSender sender) { this.sender = sender; }
    void placeOrder(String customer) {
        sender.send(customer, "Order confirmed");        // ⚠️ NPE if never set
    }
}

// 3) FIELD injection — least boilerplate, widely discouraged.
class OrderServiceField {
    @Autowired                                           // reflection sets it
    private MessageSender sender;                         // can't be final; hidden
    void placeOrder(String customer) {
        sender.send(customer, "Order confirmed");
    }
    // new OrderServiceField() leaves sender = null — needs Spring/reflection to test.
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "order_service.py",
        code: `from abc import ABC, abstractmethod
from typing import Optional


class MessageSender(ABC):
    @abstractmethod
    def send(self, to: str, text: str) -> None: ...


# 1) CONSTRUCTOR injection — required, visible, test-friendly.
class OrderServiceCtor:
    def __init__(self, sender: MessageSender) -> None:    # can't build without it
        self._sender = sender
    def place_order(self, customer: str) -> None:
        self._sender.send(customer, "Order confirmed")
# OrderServiceCtor(FakeSender())  # plain construction + fake in a test


# 2) SETTER (property) injection — for OPTIONAL/reconfigurable deps.
class OrderServiceSetter:
    def __init__(self) -> None:
        self._sender: Optional[MessageSender] = None      # may stay unset
    def set_sender(self, sender: MessageSender) -> None:
        self._sender = sender
    def place_order(self, customer: str) -> None:
        assert self._sender, "sender not set"             # half-built until set
        self._sender.send(customer, "Order confirmed")


# 3) FIELD injection — a container assigns the attribute directly.
class OrderServiceField:
    sender: MessageSender                                 # set from outside, hidden
    def place_order(self, customer: str) -> None:
        self.sender.send(customer, "Order confirmed")     # AttributeError if unwired`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "order_service.cpp",
        code: `#include <string>

struct MessageSender {
    virtual void send(const std::string& to, const std::string& text) = 0;
    virtual ~MessageSender() = default;
};

// 1) CONSTRUCTOR injection — required, can bind a const reference (immutable).
class OrderServiceCtor {
    MessageSender& sender;                                 // const-bound, guaranteed
public:
    explicit OrderServiceCtor(MessageSender& s) : sender(s) {}
    void placeOrder(const std::string& c) { sender.send(c, "Order confirmed"); }
};
// FakeSender fake; OrderServiceCtor svc{fake};  // plain construction + fake

// 2) SETTER injection — for OPTIONAL/reconfigurable deps (pointer = nullable).
class OrderServiceSetter {
    MessageSender* sender = nullptr;                       // not bound at construction
public:
    void setSender(MessageSender* s) { sender = s; }
    void placeOrder(const std::string& c) {
        if (sender) sender->send(c, "Order confirmed");   // ⚠️ half-built until set
    }
};

// 3) FIELD injection — assign the member from outside; mutable + hidden.
class OrderServiceField {
public:
    MessageSender* sender = nullptr;                       // public field set later
    void placeOrder(const std::string& c) {
        sender->send(c, "Order confirmed");               // UB/crash if never wired
    }
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Pick the style by what the dependency is" },
      {
        type: "p",
        text: "The choice isn't about taste — it follows from whether the dependency is *required* or *optional*, and whether you want it *immutable*.",
      },
      {
        type: "ul",
        items: [
          "**Constructor — your default.** Use it for every *required* dependency: a service's repository, its sender, its clock. You get a guaranteed, immutable, self-documenting dependency you can fake with a plain `new` in a test.",
          "**Setter — only for genuinely optional or reconfigurable deps.** An optional cache, a logger that defaults to no-op, something you legitimately reconfigure at runtime. If the object works fine without it, a setter is honest about that.",
          "**Field — avoid in production code.** It hides the dependency, blocks `final`, and drags the framework into your unit tests. The one common exception is *test code* in some frameworks, where field injection into a test class is tolerated for brevity.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "A required dependency behind a setter is a bug waiting to happen",
        text: "If the object *cannot function* without the dependency, do not use a setter or a field for it. Both let the object exist in a state where the dependency is missing, turning a compile-time guarantee into a runtime `NullPointerException` someone hits in production. Make it a constructor parameter and the problem can't occur.",
      },
    ],

    tradeoffs: {
      pros: [
        "Constructor — required dependencies are guaranteed at construction, so no object can exist half-built.",
        "Constructor — the field can be final/readonly, making the dependency immutable and thread-safe to publish.",
        "Constructor — dependencies are visible in the signature, so the class documents its own needs.",
        "Constructor — you can build the object with a plain new + fake in a unit test, with no framework or reflection.",
        "Setter — the right tool when a dependency is genuinely optional or must be reconfigured after construction.",
      ],
      cons: [
        "Constructor — a long parameter list can feel heavy, though that usually signals the class is doing too much.",
        "Setter — the object can exist in a half-built state between construction and the setter call, and the field can't be final.",
        "Field — the dependency is hidden from the public API, so readers can't see what the class needs.",
        "Field — the field can't be final and the object can briefly hold a null dependency.",
        "Field — you can't test the class with a plain new; you need the framework or reflection to inject a fake.",
      ],
    },

    furtherReading: [
      {
        label: "Inversion of Control Containers and the Dependency Injection pattern — Martin Fowler",
        href: "https://martinfowler.com/articles/injection.html",
        note: "The foundational essay. The 'Constructor Injection with PicoContainer' and 'Setter Injection with Spring' sections lay out the constructor-vs-setter trade-off that every later article restates.",
        kind: "article",
      },
      {
        label: "Dependency Injection — Spring Framework Reference",
        href: "https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html",
        note: "Spring's own documentation, which explicitly recommends constructor-based injection for required dependencies and reserves setter injection for optional ones. The canonical primary source.",
        kind: "docs",
      },
      {
        label: "Constructor vs Field Dependency Injection — Baeldung",
        href: "https://www.baeldung.com/constructor-injection-in-spring",
        note: "A code-first Spring walkthrough contrasting constructor and field injection, including how constructor injection enables final fields and framework-free testing while field injection blocks both.",
        kind: "article",
      },
      {
        label: "Effective Java, 3rd Edition — Item 5: Prefer dependency injection to hardwiring resources",
        href: "https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/",
        note: "Joshua Bloch's treatment of injecting dependencies through the constructor, and why a class that depends on configurable resources should take them as constructor parameters.",
        kind: "book",
      },
      {
        label: "Why field injection is evil (and constructor injection is better) — video walkthrough",
        href: "https://www.youtube.com/watch?v=aX-bgylmprA",
        note: "A short, practical screen-cast that refactors @Autowired field injection into constructor injection and demonstrates the testability and immutability wins live.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "injection-styles-q1",
        question: "Why is constructor injection usually preferred over the other two styles?",
        options: [
          { id: "a", label: "It guarantees required dependencies are present, lets the field be final/immutable, makes the dependency visible in the signature, and is testable with a plain new — no framework." },
          { id: "b", label: "It is the only style that any dependency-injection framework supports." },
          { id: "c", label: "It uses the least code and hides the dependency so the class looks cleaner." },
          { id: "d", label: "It allows the dependency to be changed at any time after the object is built." },
        ],
        correctOptionId: "a",
        explanation:
          "Constructor injection wins on the properties that matter: a required dependency can't be missing (you can't build the object without it), the field can be final/immutable, the dependency is visible in the constructor signature, and you can build the object with a plain new + fake in a unit test. (c) describes field injection's hiding (a downside), and (d) describes setter injection's mutability (also usually a downside).",
      },
      {
        id: "injection-styles-q2",
        question: "What is the main risk of using setter injection for a REQUIRED dependency?",
        options: [
          { id: "a", label: "Between construction and the setter call, the object exists in a half-built state and using it fails at runtime." },
          { id: "b", label: "The code will not compile until the setter is called." },
          { id: "c", label: "Setters are slower than constructors at runtime." },
          { id: "d", label: "The dependency becomes immutable and can never be set." },
        ],
        correctOptionId: "a",
        explanation:
          "A setter is called after construction, so there's a window where the object exists but its required dependency is still missing. Using it then throws (e.g., a NullPointerException) — a compile-time guarantee has been downgraded to a runtime bug. Setter injection is fine for genuinely optional dependencies, but not for required ones.",
      },
      {
        id: "injection-styles-q3",
        question: "Why is field injection (e.g., Java's @Autowired on a private field) widely discouraged?",
        options: [
          { id: "a", label: "The dependency is hidden from the public API, the field can't be final, and you need the framework or reflection to inject a fake in a test." },
          { id: "b", label: "It only works with databases and not with other kinds of dependencies." },
          { id: "c", label: "It requires writing more boilerplate than constructor injection." },
          { id: "d", label: "It makes the dependency immutable, which prevents reconfiguration." },
        ],
        correctOptionId: "a",
        explanation:
          "Field injection's convenience comes at a real cost: nothing in the public API reveals the dependency, the field can't be final (so the object can briefly be null and is mutable), and a plain new leaves the field unset — so you must start the framework or use reflection just to inject a fake in a test. (c) is the opposite of true; field injection has the least boilerplate, which is exactly its seductive trap.",
      },
      {
        id: "injection-styles-q4",
        question: "Which scenario is the BEST fit for setter (property) injection?",
        options: [
          { id: "a", label: "An optional cache that the service works fine without and may be attached or swapped after construction." },
          { id: "b", label: "The repository a service cannot function without." },
          { id: "c", label: "A value the class needs immutable and guaranteed at all times." },
          { id: "d", label: "Any dependency, since setter injection is the recommended default." },
        ],
        correctOptionId: "a",
        explanation:
          "Setter injection's strength is that the dependency is optional and reconfigurable — exactly right for something like an optional cache the object can run without. A required repository (b) or an immutable, always-present value (c) should go through the constructor. Setter injection is not the recommended default (d); the constructor is.",
      },
      {
        id: "injection-styles-q5",
        question: "A teammate argues for switching to field injection because the constructor now has eight parameters. What's the best response?",
        options: [
          { id: "a", label: "The long constructor is a signal the class has too many responsibilities; field injection would hide that smell rather than fix it, so split the class instead." },
          { id: "b", label: "Agree immediately — fewer constructor parameters always means cleaner code." },
          { id: "c", label: "Switch half the dependencies to field injection to balance the parameter count." },
          { id: "d", label: "Make the constructor parameters optional with default null values." },
        ],
        correctOptionId: "a",
        explanation:
          "A bloated constructor is constructor injection doing its job — loudly reporting that the class depends on too much. Field injection doesn't reduce the dependencies; it just hides them so the class can keep growing unchecked. The fix is to honor the signal and break the class into smaller, focused pieces. Defaulting required dependencies to null (d) reintroduces the half-built-object bug.",
      },
    ],
  },
};
