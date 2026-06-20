import type { RoadmapLesson } from "@/lib/content/types";

export const dependencyInversion: RoadmapLesson = {
  title: "Dependency Inversion Principle (DIP)",
  oneLiner:
    "The 'D' in SOLID: don't let your important high-level code reach down and grab a specific tool by name. Have both the high-level code and the tool agree on an interface, and plug the tool in from outside. Now you can swap the tool — or fake it in a test — without touching the code that matters.",
  difficulty: "intermediate",
  estimatedTime: "16 min",
  prototypePath: "/prototypes/lld/dependency-inversion.html",
  content: {
    prototypeCaption:
      "Two modes of the same `OrderService`. In **Welded**, the service `new`s an `EmailSender` inside itself — the dependency arrow points straight down at the concrete class (in danger red), and the side panel shows *swap? ✗* and *testable? ✗*. Flip to **Inverted** and an `«interface» MessageSender` slides in between them; now a tray lets you plug in `EmailSender`, `SMSSender`, or `FakeSender (test)`. Each pick inverts the bottom arrow to point *up* at the interface, flips both indicators to green ✓, and the fixed panel narrates the swap — *OrderService never changed*. One panel, replaced each click; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "The **Dependency Inversion Principle** is the *D* in SOLID. Its job is to stop your most important code — the *high-level policy*, the part that holds the business rules — from being glued to a *specific tool* it happens to use. Instead of the policy reaching down and naming a concrete tool, you put an **interface** in the middle and let *both sides* depend on that interface.",
      },
      {
        type: "p",
        text: "Picture the **power socket** in your wall. Your laptop charger doesn't depend on the power *plant* — it depends on the *socket standard*. As long as something behind the wall delivers that standard, the charger neither knows nor cares whether the electricity comes from coal, a nuclear plant, or the solar panels you just installed. You can swap the entire power source and never touch your charger. DIP asks you to design code the same way: depend on the *socket* (an interface), not on the *plant* (a concrete class).",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "High-level policy and low-level details should *both* depend on an **abstraction** (an interface) — **not** on each other. The policy owns the socket; the details plug into it.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "DIP is not Dependency Injection",
        text: "These get mixed up constantly. **DIP** is the *principle* — a goal about which way your dependencies should point (toward abstractions). **Dependency Injection (DI)** is just *one technique* for reaching that goal: instead of a class building its own dependency with `new`, you hand the dependency to it from outside (usually through the constructor). You can follow DIP without a DI framework, and you can use DI without truly following DIP. DIP = the *why*; DI = one *how*.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The two formal rules" },
      {
        type: "p",
        text: "Robert C. Martin states DIP as two rules. They sound abstract; we'll make them concrete in a moment.",
      },
      {
        type: "ul",
        items: [
          "**Rule 1** — High-level modules should *not* depend on low-level modules. *Both* should depend on **abstractions**. (Your `OrderService` shouldn't depend on `MySQLDatabase`; both should depend on an `OrderRepository` interface.)",
          "**Rule 2** — Abstractions should *not* depend on details. **Details should depend on abstractions.** (The interface shouldn't mention MySQL-specific types; instead, `MySQLOrderRepository` is the one that bends to fit the interface.)",
        ],
      },
      { type: "h", text: "The classic smell: a service that `new`s its own tool" },
      {
        type: "p",
        text: "Here is the trap, and almost everyone writes it at first. A high-level class builds the concrete tool it needs *inside itself*:",
      },
      {
        type: "code",
        language: "typescript",
        code: `class OrderService {            // high-level policy
  private email = new EmailSender();   // ⚠️ welded to a concrete detail

  placeOrder(order: Order) {
    // ...business rules...
    this.email.send(order.customer, "Your order is confirmed");
  }
}`,
      },
      {
        type: "p",
        text: "That single `new EmailSender()` line quietly causes two real problems. **You can't swap it** — the day product wants SMS instead of email, you have to open `OrderService` and edit business-critical code just to change a delivery channel. And **you can't test it** — every test of `OrderService` now fires a real email, because the service insists on building the *real* sender. The policy has been welded to a detail it should never have cared about.",
      },
      { type: "h", text: "The fix: depend on an interface, inject the detail" },
      {
        type: "p",
        text: "Introduce an interface that describes *what the policy needs* — `MessageSender` with a `send(...)` method — and have `OrderService` hold one of those instead of a concrete sender. Then pass the real implementation in from outside, through the constructor:",
      },
      {
        type: "code",
        language: "typescript",
        code: `interface MessageSender {                // the abstraction (the "socket")
  send(to: string, text: string): void;
}

class OrderService {
  constructor(private sender: MessageSender) {}  // injected from outside

  placeOrder(order: Order) {
    // ...business rules...
    this.sender.send(order.customer, "Your order is confirmed");
  }
}

class EmailSender implements MessageSender { /* ... */ }   // a detail
class SMSSender   implements MessageSender { /* ... */ }   // another detail

new OrderService(new EmailSender());   // wire it up at the edge of the app`,
      },
      { type: "h", text: 'Where the "inversion" actually is' },
      {
        type: "p",
        text: "The name confuses people, so look closely at the arrows. **Before**, the dependency arrow ran *downward*: policy → detail (`OrderService` → `MySQLDatabase`). The high-level code pointed at, and was at the mercy of, the low-level code. **After**, that arrow is *inverted*: the detail now points *up* at the abstraction (`MySQLOrderRepository` → `OrderRepository`), and the policy points at the *same* abstraction. The crucial twist is that the interface is owned by the *high-level* side — it's defined in terms of what the policy needs, and the detail must conform to it. The detail now serves the policy, not the other way around. That reversal of who-conforms-to-whom is the 'inversion'.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 620 330" width="100%" style="max-width:620px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Before and after diagram of dependency inversion. Before: OrderService has a solid arrow pointing straight down to a concrete MySQLDatabase. After: OrderService points down to an interface OrderRepository, and MySQLOrderRepository points up to that same interface, so the detail's arrow is now inverted toward the abstraction.">
  <defs>
    <marker id="dip-solid" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L11,4 L1,8 z" fill="#9099a8"/></marker>
    <marker id="dip-impl" markerUnits="userSpaceOnUse" markerWidth="15" markerHeight="13" refX="12" refY="5" orient="auto"><path d="M1,0 L13,5 L1,10" fill="none" stroke="#fb863a" stroke-width="1.5"/></marker>
  </defs>

  <!-- column labels -->
  <text x="155" y="24" text-anchor="middle" font-size="12" font-weight="600" fill="#9099a8">BEFORE — welded</text>
  <text x="465" y="24" text-anchor="middle" font-size="12" font-weight="600" fill="#fb863a">AFTER — inverted</text>
  <line x1="310" y1="40" x2="310" y2="310" stroke="#2d333d" stroke-width="1" stroke-dasharray="4 5"/>

  <!-- ===== BEFORE ===== -->
  <rect x="65" y="50" width="180" height="46" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="155" y="71" text-anchor="middle" font-size="13" font-weight="600" fill="#e8e4dc">OrderService</text>
  <text x="155" y="87" text-anchor="middle" font-size="10" fill="#6b7280">high-level policy</text>

  <line x1="155" y1="96" x2="155" y2="220" stroke="#9099a8" stroke-width="1.6" marker-end="url(#dip-solid)"/>
  <text x="163" y="162" font-size="10" fill="#6b7280">depends on</text>

  <rect x="65" y="232" width="180" height="46" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="155" y="253" text-anchor="middle" font-size="13" font-weight="600" fill="#e8e4dc">MySQLDatabase</text>
  <text x="155" y="269" text-anchor="middle" font-size="10" fill="#6b7280">low-level detail</text>

  <!-- ===== AFTER ===== -->
  <rect x="375" y="50" width="180" height="46" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="465" y="71" text-anchor="middle" font-size="13" font-weight="600" fill="#e8e4dc">OrderService</text>
  <text x="465" y="87" text-anchor="middle" font-size="10" fill="#6b7280">high-level policy</text>

  <!-- policy depends on abstraction (down) -->
  <line x1="465" y1="96" x2="465" y2="135" stroke="#9099a8" stroke-width="1.6" marker-end="url(#dip-solid)"/>

  <!-- abstraction box -->
  <rect x="370" y="142" width="190" height="50" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)" stroke-width="1.5"/>
  <rect x="370" y="142" width="190" height="50" rx="6" fill="rgba(251,134,58,0.16)"/>
  <text x="465" y="161" text-anchor="middle" font-size="10" fill="#fb863a">«interface»</text>
  <text x="465" y="180" text-anchor="middle" font-size="13" font-weight="600" fill="#e8e4dc">OrderRepository</text>

  <!-- detail's arrow now inverted: points UP at the abstraction -->
  <line x1="465" y1="280" x2="465" y2="194" stroke="#fb863a" stroke-width="1.6" marker-end="url(#dip-impl)"/>
  <text x="473" y="240" font-size="10" fill="#fb863a">implements ↑</text>

  <rect x="370" y="282" width="190" height="44" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="465" y="309" text-anchor="middle" font-size="12.5" font-weight="600" fill="#e8e4dc">MySQLOrderRepository</text>
</svg>`,
        caption:
          "**Before**, the arrow runs policy → detail: `OrderService` points straight down at the concrete `MySQLDatabase` (filled arrowhead = a hard dependency). **After**, an `«interface» OrderRepository` sits in the middle. `OrderService` depends on *it*, and `MySQLOrderRepository` *implements* it — so the detail's arrow is now **inverted, pointing up** (open arrowhead) toward the abstraction the policy owns. Same work gets done; the dependency now flows the other way.",
      },
      { type: "h", text: "Why this is the whole point" },
      {
        type: "ul",
        items: [
          "**Swapping** — to go from email to SMS you write a new `SMSSender implements MessageSender` and change *one wiring line* at the edge of the app. `OrderService` is never opened.",
          "**Testing** — in a unit test you inject a `FakeSender` that just records what it was asked to send. The test is fast, offline, and asserts on the recording — no real email, no real database.",
          "**Decoupling** — the policy and the detail no longer know each other's names. Either can change independently as long as the interface holds. That's loose coupling, and it's what keeps a large codebase soft enough to change.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Who owns the interface matters",
        text: "DIP isn't just 'use an interface somewhere'. The abstraction should be defined by, and live with, the *high-level policy* — it describes what the policy needs (`MessageSender.send`), in the policy's language. The low-level detail then conforms to it. If instead the interface mirrors a specific tool's API, you've only added indirection, not inverted anything.",
      },
    ],

    handsOn: [
      {
        title: "01 · Feel the weld",
        body: "Open the prototype in **Welded** mode. The `OrderService` box literally contains `new EmailSender()`, and a red dependency arrow points straight down at the concrete `EmailSender`. Read the side panel: *swap? ✗*, *testable? ✗*. Notice the tray of other senders is disabled — there is no way to plug anything else in, because the service builds its own. This is the smell DIP fixes.",
      },
      {
        title: "02 · Invert the arrow",
        body: "Flip to **Inverted** mode. Watch an `«interface» MessageSender` slide in between the service and the implementations, and watch the bottom arrow *invert* to point **up** at the interface. Both indicators flip to green: *swap? ✓*, *testable? ✓*. Nothing inside `OrderService` changed — it now depends on the socket, not the plant.",
      },
      {
        title: "03 · Swap and fake without touching the service",
        body: "In Inverted mode, plug in `SMSSender` from the tray — the explain panel confirms *OrderService never changed*. Now plug in `FakeSender (test)` and read why that makes the service testable: the fake just records the message, so a unit test runs with no real email or network. Click between the three implementations and confirm the service box stays identical every time — that is the payoff of inverting the dependency.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "order-service.ts",
        code: `// BEFORE — OrderService is welded to a concrete EmailSender.
class EmailSenderV0 {
  send(to: string, text: string) { /* ...real email... */ }
}
class OrderServiceV0 {
  private email = new EmailSenderV0();   // ⚠️ can't swap, can't test
  placeOrder(customer: string) {
    this.email.send(customer, "Order confirmed");
  }
}

// AFTER — depend on an interface, inject the detail from outside.
interface MessageSender {
  send(to: string, text: string): void;
}
class OrderService {
  constructor(private sender: MessageSender) {}   // injected
  placeOrder(customer: string) {
    this.sender.send(customer, "Order confirmed");
  }
}

// Swap Email -> SMS by changing ONE wiring line. OrderService untouched.
class EmailSender implements MessageSender {
  send(to: string, text: string) { /* ...real email... */ }
}
class SMSSender implements MessageSender {
  send(to: string, text: string) { /* ...real SMS... */ }
}
const prod = new OrderService(new SMSSender());   // was new EmailSender()

// Inject a FAKE in a test — fast, offline, asserts on a recording.
class FakeSender implements MessageSender {
  sent: { to: string; text: string }[] = [];
  send(to: string, text: string) { this.sent.push({ to, text }); }
}
const fake = new FakeSender();
new OrderService(fake).placeOrder("ada@x.io");
// expect(fake.sent[0].text).toBe("Order confirmed");`,
      },
      {
        label: "Java",
        language: "java",
        filename: "OrderService.java",
        code: `// BEFORE — OrderService is welded to a concrete EmailSender.
class OrderServiceV0 {
    private final EmailSender email = new EmailSender();  // ⚠️ can't swap/test
    void placeOrder(String customer) {
        email.send(customer, "Order confirmed");
    }
}

// AFTER — depend on an interface, inject the detail from outside.
interface MessageSender {
    void send(String to, String text);
}
class OrderService {
    private final MessageSender sender;
    OrderService(MessageSender sender) { this.sender = sender; }  // injected
    void placeOrder(String customer) {
        sender.send(customer, "Order confirmed");
    }
}

// Swap Email -> SMS by changing ONE wiring line. OrderService untouched.
class EmailSender implements MessageSender {
    public void send(String to, String text) { /* ...real email... */ }
}
class SMSSender implements MessageSender {
    public void send(String to, String text) { /* ...real SMS... */ }
}
// var prod = new OrderService(new SMSSender());   // was new EmailSender()

// Inject a FAKE in a test — fast, offline, asserts on a recording.
class FakeSender implements MessageSender {
    final java.util.List<String> sent = new java.util.ArrayList<>();
    public void send(String to, String text) { sent.add(text); }
}
// var fake = new FakeSender();
// new OrderService(fake).placeOrder("ada@x.io");
// assertEquals("Order confirmed", fake.sent.get(0));`,
      },
      {
        label: "Python",
        language: "python",
        filename: "order_service.py",
        code: `from abc import ABC, abstractmethod

# BEFORE — OrderService is welded to a concrete EmailSender.
class OrderServiceV0:
    def __init__(self) -> None:
        self._email = EmailSender()          # ⚠️ can't swap, can't test
    def place_order(self, customer: str) -> None:
        self._email.send(customer, "Order confirmed")

# AFTER — depend on an abstraction, inject the detail from outside.
class MessageSender(ABC):
    @abstractmethod
    def send(self, to: str, text: str) -> None: ...

class OrderService:
    def __init__(self, sender: MessageSender) -> None:   # injected
        self._sender = sender
    def place_order(self, customer: str) -> None:
        self._sender.send(customer, "Order confirmed")

# Swap Email -> SMS by changing ONE wiring line. OrderService untouched.
class EmailSender(MessageSender):
    def send(self, to: str, text: str) -> None: ...  # real email
class SMSSender(MessageSender):
    def send(self, to: str, text: str) -> None: ...  # real SMS
prod = OrderService(SMSSender())          # was OrderService(EmailSender())

# Inject a FAKE in a test — fast, offline, asserts on a recording.
class FakeSender(MessageSender):
    def __init__(self) -> None:
        self.sent: list[tuple[str, str]] = []
    def send(self, to: str, text: str) -> None:
        self.sent.append((to, text))

fake = FakeSender()
OrderService(fake).place_order("ada@x.io")
assert fake.sent[0][1] == "Order confirmed"`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "order_service.cpp",
        code: `#include <string>
#include <vector>
#include <memory>

// BEFORE — OrderService is welded to a concrete EmailSender.
struct EmailSenderV0 { void send(const std::string&, const std::string&) {} };
class OrderServiceV0 {
    EmailSenderV0 email;                          // ⚠️ can't swap, can't test
public:
    void placeOrder(const std::string& customer) {
        email.send(customer, "Order confirmed");
    }
};

// AFTER — depend on an abstraction (pure-virtual), inject the detail.
struct MessageSender {
    virtual void send(const std::string& to, const std::string& text) = 0;
    virtual ~MessageSender() = default;
};
class OrderService {
    MessageSender& sender;                        // injected by reference
public:
    explicit OrderService(MessageSender& s) : sender(s) {}
    void placeOrder(const std::string& customer) {
        sender.send(customer, "Order confirmed");
    }
};

// Swap Email -> SMS by constructing with a different detail. Service untouched.
struct EmailSender : MessageSender {
    void send(const std::string&, const std::string&) override {} // real email
};
struct SMSSender : MessageSender {
    void send(const std::string&, const std::string&) override {} // real SMS
};
// SMSSender sms; OrderService prod{sms};   // was EmailSender email; OrderService{email};

// Inject a FAKE in a test — fast, offline, asserts on a recording.
struct FakeSender : MessageSender {
    std::vector<std::string> sent;
    void send(const std::string&, const std::string& text) override { sent.push_back(text); }
};
// FakeSender fake; OrderService{fake}.placeOrder("ada@x.io");
// assert(fake.sent[0] == "Order confirmed");`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Invert the dependencies that are likely to change" },
      {
        type: "p",
        text: "DIP earns its keep around **volatile or external** dependencies — anything that talks to the outside world or that you might reasonably want to replace, fake, or reconfigure. These are exactly the things that make code hard to test and hard to evolve when you `new` them inline.",
      },
      {
        type: "ul",
        items: [
          "**Databases / persistence** — `OrderRepository` interface in front of MySQL, Postgres, or an in-memory store for tests.",
          "**Network & third-party services** — payment gateways, email/SMS providers, an HTTP client to another team's API.",
          "**The clock and randomness** — wrap `now()` and `random()` behind an interface so tests can pin time and seeds instead of being flaky.",
          "**Anything you want to fake in a unit test** — if you can't test a class without standing up real infrastructure, that dependency wants inverting.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't invert stable, never-changing dependencies",
        text: "DIP is a tool, not a tax on every line. Don't wrap the standard library, simple value objects (a `Money`, a `Point`), `String`, or math functions behind interfaces — they don't vary, you'll never fake them, and you'll never swap them. Inverting a stable dependency just adds an extra hop and an empty interface that confuses the next reader. Invert what is *volatile*; depend directly on what is *stable*.",
      },
    ],

    tradeoffs: {
      pros: [
        "Testability — inject a fake or mock and unit-test the policy with no database, network, or email in sight.",
        "Swappability — change Email→SMS, MySQL→Postgres, or real→stub by editing one wiring line; the high-level code is never reopened.",
        "Decoupling — policy and details stop knowing each other's names, so each can evolve independently behind a stable interface.",
        "Parallel work & boundaries — once the interface is agreed, two people can build the policy and the implementation at the same time.",
      ],
      cons: [
        "More moving parts — every inverted dependency adds an interface plus a concrete class, which is more to read and navigate.",
        "Wiring overhead — something must construct and connect the pieces at the app's edge (a main()/composition root or a DI container), and that wiring can sprawl.",
        "Indirection cost — 'go to definition' lands on the interface, not the real code, which can slow down tracing a call for the first time.",
        "Over-application — inverting stable or one-off dependencies adds ceremony with no payoff; DIP misused turns simple code into interface soup.",
      ],
    },

    furtherReading: [
      {
        label: "Dependency inversion principle — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Dependency_inversion_principle",
        note: "Crisp definition of both formal rules, the relationship to SOLID, and a clear treatment of how DIP differs from (but is implemented via) dependency injection.",
        kind: "docs",
      },
      {
        label: "Inversion of Control Containers and the Dependency Injection pattern — Martin Fowler",
        href: "https://martinfowler.com/articles/injection.html",
        note: "The definitive essay on the technique most often used to achieve DIP. Fowler untangles Inversion of Control from Dependency Injection and walks through constructor vs. setter injection with examples.",
        kind: "article",
      },
      {
        label: "The Dependency Inversion Principle in Java — Baeldung",
        href: "https://www.baeldung.com/java-dependency-inversion-principle",
        note: "A hands-on, code-first walkthrough that refactors a welded service into an inverted one, then shows how Spring wires the implementation in. Great second read for Java developers.",
        kind: "article",
      },
      {
        label: "SOLID Design Principles Explained: Dependency Inversion — Stackify",
        href: "https://stackify.com/dependency-inversion-principle/",
        note: "Beginner-friendly explanation built around a coffee-machine example, with before/after code that makes the 'invert the arrow' idea click.",
        kind: "article",
      },
      {
        label: "Dependency Inversion Principle Explained — SOLID Design Principles (video)",
        href: "https://www.youtube.com/watch?v=9oHY5TllWaU",
        note: "A short, visual run-through of DIP with live refactoring — good if you want to see the dependency arrow flip on screen before reading the formal rules.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "dependency-inversion-q1",
        question: "What does the Dependency Inversion Principle actually say?",
        options: [
          { id: "a", label: "High-level and low-level modules should both depend on abstractions, not on each other." },
          { id: "b", label: "Every class must be created through a dependency-injection framework." },
          { id: "c", label: "Low-level modules should depend directly on the high-level modules that use them." },
          { id: "d", label: "A class should never use any other class; it must do everything itself." },
        ],
        correctOptionId: "a",
        explanation:
          "DIP's core rule: high-level policy and low-level details should both depend on an abstraction (an interface), rather than the policy depending on the concrete detail. A DI framework (b) is one way to achieve this but isn't required, and the other options describe the opposite of decoupling.",
      },
      {
        id: "dependency-inversion-q2",
        question:
          "An `OrderService` contains `private email = new EmailSender()`. Which two problems does this directly cause?",
        options: [
          { id: "a", label: "You can't swap the sender without editing OrderService, and you can't test OrderService without sending real email." },
          { id: "b", label: "The code won't compile, and EmailSender will leak memory." },
          { id: "c", label: "EmailSender becomes public, and OrderService becomes abstract." },
          { id: "d", label: "Nothing — building your dependencies inline is the recommended approach." },
        ],
        correctOptionId: "a",
        explanation:
          "By `new`-ing the concrete sender inside itself, the service is welded to that detail: changing the channel means editing business-critical code, and every test fires a real email because the service insists on the real sender. Those two pains — no swapping, no testing — are exactly what DIP removes.",
      },
      {
        id: "dependency-inversion-q3",
        question:
          "What is the difference between the Dependency Inversion Principle and Dependency Injection?",
        options: [
          { id: "a", label: "DIP is the principle (depend on abstractions); Dependency Injection is one technique for achieving it (pass dependencies in from outside)." },
          { id: "b", label: "They are two names for exactly the same thing." },
          { id: "c", label: "Dependency Injection is the principle; DIP is a specific Java framework that implements it." },
          { id: "d", label: "DIP applies to databases only; Dependency Injection applies to everything else." },
        ],
        correctOptionId: "a",
        explanation:
          "DIP is the goal — make dependencies point at abstractions. Dependency Injection is just one common way to reach that goal: instead of a class building its own dependency with `new`, you hand it the dependency (often via the constructor). You can follow DIP without a DI container, and you can use DI without truly inverting your dependencies.",
      },
      {
        id: "dependency-inversion-q4",
        question:
          "After applying DIP, what does the 'inversion' refer to — what changed about the dependency arrow?",
        options: [
          { id: "a", label: "The low-level detail now points UP at an abstraction the high-level policy owns, instead of the policy pointing DOWN at the concrete detail." },
          { id: "b", label: "The high-level module is deleted and the low-level module takes over its job." },
          { id: "c", label: "All arrows are removed because the classes no longer depend on anything." },
          { id: "d", label: "The interface starts depending on the concrete database type." },
        ],
        correctOptionId: "a",
        explanation:
          "Before, the arrow ran policy → concrete detail (downward). After, an interface owned by the policy sits in the middle: the policy depends on it, and the detail implements it — so the detail's arrow is inverted to point up at the abstraction. The detail now conforms to the policy, not the other way around. (d) would mean the abstraction depends on a detail, which violates DIP's second rule.",
      },
      {
        id: "dependency-inversion-q5",
        question: "Which dependency is the BEST candidate to leave alone rather than invert behind an interface?",
        options: [
          { id: "a", label: "A simple immutable value type like Money or Point from your own code." },
          { id: "b", label: "A third-party payment gateway you call over the network." },
          { id: "c", label: "The database your repository talks to." },
          { id: "d", label: "An email/SMS provider you may want to swap or fake in tests." },
        ],
        correctOptionId: "a",
        explanation:
          "DIP pays off for volatile, external dependencies — databases, networks, payment gateways, email/SMS — which you may swap or need to fake in tests. A stable, simple value type like `Money` never varies and won't be faked, so wrapping it in an interface just adds needless indirection. Invert what changes; depend directly on what's stable.",
      },
    ],
  },
};
