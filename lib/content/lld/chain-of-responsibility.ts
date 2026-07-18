import type { RoadmapLesson } from "@/lib/content/types";

export const chainOfResponsibility: RoadmapLesson = {
  title: "Chain of Responsibility",
  oneLiner:
    "Pass a request along a chain of handlers, where each handler either deals with it or hands it to the next one. Think of a customer-support hotline: a password reset stops at Level 1, a $5,000 refund climbs up to the Manager — and the caller never needs to know who will pick it up, they just dial one number.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/chain-of-responsibility.html",
  content: {
    prototypeCaption:
      "A **customer-support hotline** as a live chain: 🧑‍💻 *L1 Support* → 👩‍🔧 *L2 Support* → 👔 *Manager* → 🏢 *Director*, each with its own tiny rule (`password resets`, `refunds ≤ $100`, `≤ $2,000`, `≤ $10,000`). Pick a request chip — `🔑 reset password`, `💳 refund $80`, `💸 refund $1,500`, `🏦 refund $9,000`, or `🚀 refund $50,000` — and press **▶ Send**. The request slides along the chain; each handler flashes amber *→ pass* or green *✓ handled*, and everything past the handler dims because it never even sees the request. The $50,000 one falls off the end in red: *✗ nobody handled it*. Then hit **⏏ Remove L2** and resend `💳 refund $80` — the same request now stops at the Manager instead. That's the whole pattern: handlers linked at runtime, each one deciding *handle it or pass it on*.",

    overview: [
      {
        type: "p",
        text: "**Chain of Responsibility** is a behavioral pattern with a one-sentence intent: *pass a request along a chain of handlers, where each handler either handles it or passes it to the next* — and the sender never knows (or cares) which one will handle it. Instead of one big `if/else` deciding who does what, you line up small handlers like links in a chain and drop the request in at the front.",
      },
      {
        type: "p",
        text: "Picture a **customer-support hotline**. You call one number. Your request lands at *Level 1 Support* first. If L1 can fix it (a password reset — done in a minute), it stops right there. If not, L1 passes it up: *L2 Support*, then the *Manager*, then the *Director*. A $5,000 refund travels up to the Manager; you, the caller, never dialed the Manager directly — you didn't even know a Manager existed. And if a request is so wild that *nobody* on the ladder can approve it, it falls off the end unhandled. That hotline **is** Chain of Responsibility.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "The sender talks to the **first link only**. Each handler makes one small decision — *handle it, or pass it on* — so the sender is fully decoupled from whoever actually does the work.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "A request can fall off the end",
        text: "Unlike a plain function call, a chain gives **no guarantee** anyone will handle the request. That's a feature (easy to say 'not my job') and a trap (silent drops). Always decide up front what happens at the end of the chain: a default handler, an error, or an explicit 'unhandled' result.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The moving parts" },
      {
        type: "p",
        text: "The pattern needs only two small ideas — a shared handler interface, and a `next` pointer that links handlers together:",
      },
      {
        type: "ul",
        items: [
          "**A Handler interface** — every handler exposes the same two methods: `setNext(handler)` to wire up the link after it, and `handle(request)` to receive a request.",
          "**Concrete handlers** — each one knows *one* small rule ('I do password resets', 'I approve refunds up to $100'). In `handle()`, it either deals with the request or forwards it: `return this.next.handle(request)`.",
          "**The sender** — holds a reference to the **first** link only. It calls `firstHandler.handle(request)` and walks away. It has no idea how long the chain is or who's in it.",
          "**The end of the chain** — the last handler has no `next`. If the request reaches it and still isn't handled, it goes *unhandled* — so you choose a fallback: a catch-all default handler, a logged warning, or a returned 'nobody could do this' value.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `interface Handler {
  setNext(next: Handler): Handler;   // returns next, so calls can be chained
  handle(req: SupportRequest): string | null;
}

class L1Support implements Handler {
  private next: Handler | null = null;
  setNext(next: Handler) { this.next = next; return next; }

  handle(req: SupportRequest): string | null {
    if (req.kind === "password-reset") {
      return "L1 handled it";               // ✅ my job — stop here
    }
    return this.next ? this.next.handle(req) : null;  // → pass it on
  }
}

// Wiring the hotline — the sender only ever sees 'l1':
const l1 = new L1Support();
l1.setNext(new L2Support()).setNext(new Manager()).setNext(new Director());
l1.handle({ kind: "refund", amount: 5000 });   // travels up to the Manager`,
      },
      {
        type: "p",
        text: "Two details matter more than they look. First, **order matters**: put the Director before L1 and every password reset lands on the Director's desk. Chains usually go cheapest-first or most-specific-first. Second, the chain is **built at runtime** — it's just objects pointing at each other. You can add a handler, remove one, or reorder the whole ladder while the program runs, and the sender's code doesn't change by a single character.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Two flavors of chain",
        text: "In the *classic* flavor, exactly one handler handles the request and the chain stops there (our hotline). In the *pipeline* flavor, **every** handler gets a turn and each does a bit of work before passing it along — that's how HTTP middleware works. Both are chains; the difference is just whether handling stops the walk.",
      },
      { type: "h", text: "You already use this every day" },
      {
        type: "ul",
        items: [
          "**HTTP middleware pipelines** — Express's `app.use(...)` and ASP.NET Core's middleware are chains: each middleware handles the request (auth, logging, compression) and calls `next()`, or short-circuits with a response.",
          "**DOM event bubbling** — a click on a button travels up parent elements until some listener handles it (or calls `stopPropagation()` — literally breaking the chain).",
          "**Logging levels** — a log record passes through loggers/filters; each decides to write it, transform it, or hand it up the logger hierarchy.",
          "**GUI event propagation** — desktop toolkits route a keypress from the focused widget up through its containers until something consumes it.",
          "**Servlet filters** — Java's `FilterChain` passes each request through a configurable line of filters before the servlet sees it.",
        ],
      },
      {
        type: "p",
        text: "The common win in all of these is **decoupling**: the code that *sends* a request is completely separated from the code that *handles* it. The sender knows one interface and one first link — that's low coupling with each handler keeping one focused job, exactly the goal of [[coupling-and-cohesion]]. And because each link wraps a tiny decision, the pattern feels like a cousin of [[decorator]] — same linked shape, but a decorator *always* passes through and adds behavior, while a chain handler may *stop* the walk by handling the request.",
      },
    ],

    handsOn: [
      {
        title: "01 · Send the easy ones",
        body: "In the prototype, the chain reads 🧑‍💻 L1 Support → 👩‍🔧 L2 Support → 👔 Manager → 🏢 Director, each card showing its one-line rule. Pick the `🔑 reset password` chip and press ▶ Send — L1 flashes green '✓ handled' immediately and everything after it dims (those handlers never even saw the request). Now send `💳 refund $80`: L1 passes (amber '→ pass'), L2 handles. Watch the 'handlers asked' counter — 1, then 2.",
      },
      {
        title: "02 · Watch a request climb — and one fall off the end",
        body: "Send `💸 refund $1,500`: it passes L1 and L2 and stops at the Manager (handlers asked: 3). Send `🏦 refund $9,000`: it climbs all the way to the Director. Now send `🚀 refund $50,000` — every card flashes '→ pass' and the request falls off the end in red: '✗ nobody handled it'. That's the pattern's honest edge case: a chain gives no guarantee of handling, so real systems add a fallback.",
      },
      {
        title: "03 · Re-wire the chain at runtime",
        body: "Press ⏏ Remove L2 to unplug L2 Support, then resend `💳 refund $80`. The same request now skips straight from L1 to the Manager, who handles it — a different handler, and the sender's click didn't change at all. That is runtime re-wiring: the chain is just objects linked by 'next' pointers, so you can add, remove, or reorder handlers while the program runs. Re-add L2 and ↺ Reset when done.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "hotline.ts",
        code: `type SupportRequest =
  | { kind: "password-reset" }
  | { kind: "refund"; amount: number };

interface Handler {
  setNext(next: Handler): Handler;         // returns next → fluent wiring
  handle(req: SupportRequest): string;
}

// Base link: stores 'next' and forwards by default.
abstract class SupportHandler implements Handler {
  private next: Handler | null = null;
  setNext(next: Handler): Handler { this.next = next; return next; }

  handle(req: SupportRequest): string {
    if (this.canHandle(req)) return \`\${this.name} handled it ✓\`;
    if (this.next) return this.next.handle(req);   // → pass it on
    return "✗ nobody handled it";                  // fell off the end
  }

  protected abstract name: string;
  protected abstract canHandle(req: SupportRequest): boolean;
}

class L1Support extends SupportHandler {
  protected name = "L1 Support";
  protected canHandle(r: SupportRequest) { return r.kind === "password-reset"; }
}
class L2Support extends SupportHandler {
  protected name = "L2 Support";
  protected canHandle(r: SupportRequest) { return r.kind === "refund" && r.amount <= 100; }
}
class Manager extends SupportHandler {
  protected name = "Manager";
  protected canHandle(r: SupportRequest) { return r.kind === "refund" && r.amount <= 2000; }
}
class Director extends SupportHandler {
  protected name = "Director";
  protected canHandle(r: SupportRequest) { return r.kind === "refund" && r.amount <= 10000; }
}

// Wire the hotline. The caller only ever knows 'hotline' (the first link).
const hotline = new L1Support();
hotline.setNext(new L2Support()).setNext(new Manager()).setNext(new Director());

console.log(hotline.handle({ kind: "password-reset" }));       // L1 Support handled it ✓
console.log(hotline.handle({ kind: "refund", amount: 5000 })); // Director handled it ✓
console.log(hotline.handle({ kind: "refund", amount: 50000 }));// ✗ nobody handled it`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Hotline.java",
        code: `// The request travelling along the chain.
record SupportRequest(String kind, int amount) {}

// Base link: stores 'next', forwards by default.
abstract class SupportHandler {
    private SupportHandler next;

    SupportHandler setNext(SupportHandler next) {
        this.next = next;
        return next;                       // return next → fluent wiring
    }

    String handle(SupportRequest req) {
        if (canHandle(req)) return name() + " handled it ✓";
        if (next != null) return next.handle(req);   // → pass it on
        return "✗ nobody handled it";                // fell off the end
    }

    abstract String name();
    abstract boolean canHandle(SupportRequest req);
}

class L1Support extends SupportHandler {
    String name() { return "L1 Support"; }
    boolean canHandle(SupportRequest r) { return r.kind().equals("password-reset"); }
}
class L2Support extends SupportHandler {
    String name() { return "L2 Support"; }
    boolean canHandle(SupportRequest r) { return r.kind().equals("refund") && r.amount() <= 100; }
}
class Manager extends SupportHandler {
    String name() { return "Manager"; }
    boolean canHandle(SupportRequest r) { return r.kind().equals("refund") && r.amount() <= 2000; }
}
class Director extends SupportHandler {
    String name() { return "Director"; }
    boolean canHandle(SupportRequest r) { return r.kind().equals("refund") && r.amount() <= 10000; }
}

public class Hotline {
    public static void main(String[] args) {
        SupportHandler hotline = new L1Support();   // caller knows only the first link
        hotline.setNext(new L2Support()).setNext(new Manager()).setNext(new Director());

        System.out.println(hotline.handle(new SupportRequest("password-reset", 0))); // L1 ✓
        System.out.println(hotline.handle(new SupportRequest("refund", 5000)));      // Director ✓
        System.out.println(hotline.handle(new SupportRequest("refund", 50000)));     // ✗ nobody
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "hotline.py",
        code: `from dataclasses import dataclass


@dataclass
class SupportRequest:
    kind: str            # "password-reset" | "refund"
    amount: int = 0


class SupportHandler:
    """Base link: stores 'next', forwards by default."""

    def __init__(self) -> None:
        self._next: "SupportHandler | None" = None

    def set_next(self, nxt: "SupportHandler") -> "SupportHandler":
        self._next = nxt
        return nxt                        # return next → fluent wiring

    def handle(self, req: SupportRequest) -> str:
        if self.can_handle(req):
            return f"{self.name} handled it ✓"
        if self._next:                    # → pass it on
            return self._next.handle(req)
        return "✗ nobody handled it"      # fell off the end

    name = "base"
    def can_handle(self, req: SupportRequest) -> bool: return False


class L1Support(SupportHandler):
    name = "L1 Support"
    def can_handle(self, r): return r.kind == "password-reset"

class L2Support(SupportHandler):
    name = "L2 Support"
    def can_handle(self, r): return r.kind == "refund" and r.amount <= 100

class Manager(SupportHandler):
    name = "Manager"
    def can_handle(self, r): return r.kind == "refund" and r.amount <= 2000

class Director(SupportHandler):
    name = "Director"
    def can_handle(self, r): return r.kind == "refund" and r.amount <= 10000


# Wire the hotline — the caller only ever knows the first link.
hotline = L1Support()
hotline.set_next(L2Support()).set_next(Manager()).set_next(Director())

print(hotline.handle(SupportRequest("password-reset")))     # L1 Support handled it ✓
print(hotline.handle(SupportRequest("refund", 5000)))       # Director handled it ✓
print(hotline.handle(SupportRequest("refund", 50000)))      # ✗ nobody handled it`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "hotline.cpp",
        code: `#include <iostream>
#include <string>

struct SupportRequest {
    std::string kind;    // "password-reset" | "refund"
    int amount = 0;
};

// Base link: stores 'next', forwards by default.
class SupportHandler {
    SupportHandler* next_ = nullptr;
public:
    virtual ~SupportHandler() = default;

    SupportHandler* setNext(SupportHandler* next) {
        next_ = next;
        return next;                       // return next → fluent wiring
    }

    std::string handle(const SupportRequest& req) {
        if (canHandle(req)) return name() + " handled it ✓";
        if (next_) return next_->handle(req);    // → pass it on
        return "✗ nobody handled it";            // fell off the end
    }

    virtual std::string name() const = 0;
    virtual bool canHandle(const SupportRequest& req) const = 0;
};

struct L1Support : SupportHandler {
    std::string name() const override { return "L1 Support"; }
    bool canHandle(const SupportRequest& r) const override { return r.kind == "password-reset"; }
};
struct L2Support : SupportHandler {
    std::string name() const override { return "L2 Support"; }
    bool canHandle(const SupportRequest& r) const override { return r.kind == "refund" && r.amount <= 100; }
};
struct Manager : SupportHandler {
    std::string name() const override { return "Manager"; }
    bool canHandle(const SupportRequest& r) const override { return r.kind == "refund" && r.amount <= 2000; }
};
struct Director : SupportHandler {
    std::string name() const override { return "Director"; }
    bool canHandle(const SupportRequest& r) const override { return r.kind == "refund" && r.amount <= 10000; }
};

int main() {
    L1Support l1; L2Support l2; Manager mgr; Director dir;
    l1.setNext(&l2)->setNext(&mgr)->setNext(&dir);   // caller knows only 'l1'

    std::cout << l1.handle({"password-reset"}) << "\\n";   // L1 Support handled it ✓
    std::cout << l1.handle({"refund", 5000})  << "\\n";    // Director handled it ✓
    std::cout << l1.handle({"refund", 50000}) << "\\n";    // ✗ nobody handled it
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a chain when the handler isn't known up front" },
      {
        type: "p",
        text: "Chain of Responsibility earns its keep when *who handles the request* is a runtime question, not a compile-time one:",
      },
      {
        type: "ul",
        items: [
          "**More than one possible handler, decided at runtime** — different requests need different levels of authority or expertise, and you can't (or don't want to) hard-code the routing in one big `if/else`.",
          "**The sender must not know the receiver** — you want to add a new approval level or a new middleware without touching a single line of sender code.",
          "**Handlers should be added, removed, or reordered freely** — plugin filters, configurable pipelines, escalation ladders that change per customer tier. The chain is just linked objects, so re-wiring is cheap and live.",
          "**Processing in a specific order matters** — auth before logging before compression: the chain makes the order explicit and swappable in one place (the wiring).",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When NOT to use it",
        text: "If there is **exactly one fixed handler**, just call it — a chain of one is an `if` statement wearing a costume. Same if every request must be handled by a known receiver: a direct call gives you a compile-time guarantee the chain can't. Add the chain when the *set* of handlers is genuinely open or the routing genuinely varies.",
      },
    ],

    tradeoffs: {
      pros: [
        "Decouples sender from receiver — the sender knows one interface and the first link; handlers can change completely behind it.",
        "Single-responsibility handlers — each link holds one small rule (one approval limit, one filter), which is far easier to test than a monolithic if/else ladder.",
        "Open for extension — add, remove, or reorder handlers at runtime without touching the sender or the other handlers (Open/Closed in action).",
        "Order is explicit and controllable — the wiring code is the one place that states processing order, instead of it being implied by tangled conditionals.",
      ],
      cons: [
        "No guarantee of handling — a request can silently fall off the end of the chain, so you must design a default/fallback or an explicit 'unhandled' signal.",
        "Harder to debug and trace — the actual handler is only known at runtime; following a request means stepping link by link through the chain.",
        "Latency through long chains — every request walks past each non-handling link, which adds calls (and in middleware pipelines, real per-request cost).",
        "Misconfigured wiring is a runtime bug — wrong order or a forgotten setNext() breaks routing, and the compiler can't catch it for you.",
      ],
    },

    furtherReading: [
      {
        label: "Chain of Responsibility — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/chain-of-responsibility",
        note: "The clearest illustrated walkthrough: the problem, the handler interface with setNext/handle, real-world analogies, and multi-language examples. Best first read.",
        kind: "article",
      },
      {
        label: "Chain-of-responsibility pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern",
        note: "Concise reference covering the structure, the classic vs pipeline variants, and its relatives in real frameworks (event bubbling, servlet filters, middleware).",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Chain of Responsibility. The primary source for the pattern's formal intent, structure, and consequences.",
        kind: "book",
      },
      {
        label: "Chain of Responsibility — SourceMaking",
        href: "https://sourcemaking.com/design_patterns/chain_of_responsibility",
        note: "A second angle on the pattern with UML structure, a checklist for building the chain, and rules of thumb on when a chain beats a conditional ladder.",
        kind: "article",
      },
      {
        label: "Chain of Responsibility in Java — Baeldung",
        href: "https://www.baeldung.com/chain-of-responsibility-pattern",
        note: "A practical Java implementation, plus where the pattern already lives in the wild: servlet FilterChain and framework middleware pipelines.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "chain-of-responsibility-q1",
        question: "What is the core intent of the Chain of Responsibility pattern?",
        options: [
          { id: "a", label: "Pass a request along a chain of handlers; each handler either handles it or passes it to the next, and the sender never knows who will handle it." },
          { id: "b", label: "Guarantee a class has exactly one instance with a global access point." },
          { id: "c", label: "Broadcast a request to every handler at once and merge all their results." },
          { id: "d", label: "Wrap an object so extra behavior always runs before and after every call." },
        ],
        correctOptionId: "a",
        explanation:
          "The pattern's whole point is the walk: the request enters at the first link and travels handler to handler until one takes it (or none do). Option (b) is Singleton, (c) is closer to Observer, and (d) describes Decorator — a chain handler may stop the walk, a decorator always passes through.",
      },
      {
        id: "chain-of-responsibility-q2",
        question: "In the support-hotline chain L1 → L2 (refunds ≤ $100) → Manager (≤ $2,000) → Director (≤ $10,000), who handles a $1,500 refund?",
        options: [
          { id: "a", label: "The Manager — L1 and L2 each pass it on, and the Manager's limit covers $1,500." },
          { id: "b", label: "L1 Support, because it is the first link in the chain." },
          { id: "c", label: "The Director, because refunds always go to the top." },
          { id: "d", label: "All four handlers process it together." },
        ],
        correctOptionId: "a",
        explanation:
          "The request walks the chain in order: L1 can't do refunds, L2's limit is $100, so both pass. The Manager's $2,000 limit covers it, so the walk stops there — the Director never even sees the request. Exactly one handler handles it in the classic flavor.",
      },
      {
        id: "chain-of-responsibility-q3",
        question: "How much does the sender know about the chain?",
        options: [
          { id: "a", label: "Only the first link — it calls handle() on it and has no idea how many handlers exist or which one will respond." },
          { id: "b", label: "Every handler, because it must pick the right one before sending." },
          { id: "c", label: "The last handler, so it can check whether the request was handled." },
          { id: "d", label: "The exact handler that will respond, resolved at compile time." },
        ],
        correctOptionId: "a",
        explanation:
          "The sender holds a reference to the first handler only. That's the decoupling win: you can add, remove, or reorder every link behind that first reference and the sender's code never changes. If the sender had to know the receiver, you'd just call the receiver directly.",
      },
      {
        id: "chain-of-responsibility-q4",
        question: "What happens if no handler in the chain can handle a request (like the $50,000 refund)?",
        options: [
          { id: "a", label: "It falls off the end unhandled — the pattern gives no guarantee, so you should design a default handler or an explicit 'unhandled' outcome." },
          { id: "b", label: "The chain automatically creates a new handler capable of handling it." },
          { id: "c", label: "The first handler is forced to handle it anyway." },
          { id: "d", label: "The request loops back to the start and retries forever." },
        ],
        correctOptionId: "a",
        explanation:
          "The last link has no 'next', so an unclaimed request simply drops off the end. That's a genuine trade-off of the pattern: flexible routing, but no handling guarantee. Production chains end with a catch-all default, raise an error, or return an explicit unhandled result — silent drops are the bug to avoid.",
      },
      {
        id: "chain-of-responsibility-q5",
        question: "When is Chain of Responsibility the WRONG choice?",
        options: [
          { id: "a", label: "When there is exactly one fixed handler that must always process the request — just call it directly." },
          { id: "b", label: "When handlers need to be added or removed while the program runs." },
          { id: "c", label: "When the sender must stay decoupled from whoever processes the request." },
          { id: "d", label: "When several possible handlers exist and the right one depends on the request." },
        ],
        correctOptionId: "a",
        explanation:
          "A chain of one is an if-statement in a costume: you pay the pattern's costs (indirection, runtime wiring, harder tracing) and get none of its benefits. Options (b), (c), and (d) are precisely the situations the pattern exists for — runtime re-wiring, sender/receiver decoupling, and routing decided per request.",
      },
    ],
  },
};
