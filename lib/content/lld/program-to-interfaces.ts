import type { RoadmapLesson } from "@/lib/content/types";

export const programToInterfaces: RoadmapLesson = {
  title: "Program to Interfaces, Not Implementations",
  oneLiner:
    "The Gang of Four motto. When you declare a variable, parameter, or return type, name the contract (an interface like List or MessageSender), not a specific class (like ArrayList or EmailSender). Then you can swap the concrete object behind it without touching the code that uses it. Nail it to a concrete class and every user is locked to that one choice forever.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/program-to-interfaces.html",
  content: {
    prototypeCaption:
      "A consuming function declares a parameter type, shown two ways. In **Concrete**, the type is `ArrayList<Order>` — a tray of candidates (`ArrayList`, `LinkedList`, `ImmutableList`) tries to plug in, but only `ArrayList` is accepted (green); the rest are rejected (red, *not an ArrayList*) and locked. The *values that fit* count reads **1** and *swap without editing this code? ✗*. Flip the declared type to `List<Order>` in **Interface** mode and the tray unlocks: all three click in as accepted (green), the count jumps to **3**, and the indicator flips to **✓** — the consuming code never changed. One explain panel, replaced on every click; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: 'This is the oldest rule in object-oriented design, and the most quoted line from the *Gang of Four* book: **“Program to an interface, not an implementation.”** It means one small, everyday habit. When you write down a *type* — for a variable, a function parameter, or a return value — write the **contract** (an interface like `List`), not the **specific class** (like `ArrayList`).',
      },
      {
        type: "p",
        text: "Think of the **power socket** in your wall. The socket is a *standard* — a contract. Any appliance with the right plug works: a toaster, a lamp, a phone charger. You can unplug one and plug in another and the wall never changes. Now imagine the opposite: someone **hard-wired** the toaster straight into the power station. It works, but only *that* toaster, forever. To change it you'd have to rewire the station. Programming to an interface is choosing the *socket*. Programming to an implementation is *hard-wiring the toaster*.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Type your variables, parameters, and returns to the **contract** (`List`, `MessageSender`), not the concrete class (`ArrayList`, `EmailSender`). Then the object behind the contract can be swapped — and the code using it never has to change.",
      },
      {
        type: "callout",
        variant: "info",
        title: "This is the everyday cousin of Dependency Inversion",
        text: "They sound alike and they help each other, but they are not the same thing. **Dependency Inversion (DIP)** is about the *direction* of dependencies between big modules: high-level policy and low-level details should both point at an abstraction the policy owns. **Program to interfaces** is the small, hourly *habit* of declaring your variables, parameters, and return types as the contract instead of a concrete class. You can’t really follow DIP without this habit — but you use this habit constantly even in code that has no high/low-level split at all.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Two ways to declare the same thing" },
      {
        type: "p",
        text: "Suppose a function needs a list of orders. There are two ways to declare what it accepts. Watch only the *type* — the body is identical.",
      },
      {
        type: "code",
        language: "typescript",
        code: `// Programming to an IMPLEMENTATION — locked to one class
function process(orders: Order[]) { ... }          // (TS arrays are concrete)

// In Java the difference is sharp:
void process(ArrayList<Order> orders) { ... }      // ⚠️ only an ArrayList fits
void process(List<Order> orders)      { ... }      // ✅ any List fits`,
      },
      {
        type: "p",
        text: "The second version asks for a `List` — *the contract*. Anything that **is a** `List` satisfies it: `ArrayList`, `LinkedList`, an immutable list, a list someone hands you from a library. The first version asks for an `ArrayList` — *one specific class*. Now only an `ArrayList` is allowed in the door, and you are stuck with that decision everywhere this function is called.",
      },
      { type: "h", text: "What you actually buy: the swap is free" },
      {
        type: "p",
        text: "Say you start with `ArrayList` and later discover the code does tons of inserts at the front, where `LinkedList` is faster. If you programmed to the **interface** (`List`), you change *one line* — the place that builds the list — and every consumer keeps working untouched, because they only ever asked for a `List`:",
      },
      {
        type: "code",
        language: "typescript",
        code: `List<Order> orders = new ArrayList<>();   // before
List<Order> orders = new LinkedList<>();  // after — the ONLY line that changed

// Every function that takes List<Order> keeps compiling and running.
// process(orders);  totalValue(orders);  report(orders);  // all untouched`,
      },
      {
        type: "p",
        text: "If instead you had typed everything as `ArrayList<Order>`, that one change would ripple into *every* function signature, every field, every variable that named the concrete class. You'd be editing dozens of lines to swap one object. That is the price of hard-wiring.",
      },
      {
        type: "h", text: "The hidden trap: leaking the concrete class's extra methods" },
      {
        type: "p",
        text: "There's a subtler cost to naming the concrete type. A concrete class often has **extra methods** the interface doesn't promise. If you declare `ArrayList`, a caller might quietly start using `ensureCapacity(...)` — an `ArrayList`-only method. Now you *can't* swap to `LinkedList` even if you wanted to, because real code depends on a method the new class doesn't have. Declaring the interface keeps everyone honest: they can only call what the *contract* promises, so the swap stays possible.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 620 300" width="100%" style="max-width:620px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two diagrams. Left: process declared as ArrayList accepts only ArrayList; LinkedList and ImmutableList are rejected. Right: process declared as the List interface accepts ArrayList, LinkedList and ImmutableList, all implementing List.">
  <defs>
    <marker id="pti-impl" markerUnits="userSpaceOnUse" markerWidth="15" markerHeight="13" refX="12" refY="5" orient="auto"><path d="M1,0 L13,5 L1,10" fill="none" stroke="#fb863a" stroke-width="1.5"/></marker>
  </defs>

  <text x="155" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#9099a8">CONCRETE — locked</text>
  <text x="465" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#fb863a">INTERFACE — open</text>
  <line x1="310" y1="36" x2="310" y2="284" stroke="#2d333d" stroke-width="1" stroke-dasharray="4 5"/>

  <!-- ===== LEFT: concrete ===== -->
  <rect x="55" y="44" width="200" height="44" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="155" y="64" text-anchor="middle" font-size="12" font-weight="600" fill="#e8e4dc">process(orders)</text>
  <text x="155" y="80" text-anchor="middle" font-size="10" fill="#f06868">param: ArrayList&lt;Order&gt;</text>

  <line x1="155" y1="88" x2="155" y2="124" stroke="#5cc66f" stroke-width="1.6" marker-end="url(#pti-impl)"/>
  <rect x="75" y="126" width="160" height="34" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.4"/>
  <text x="155" y="148" text-anchor="middle" font-size="12" fill="#e8e4dc">ArrayList ✓</text>

  <rect x="75" y="172" width="160" height="32" rx="6" fill="#14161a" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 4"/>
  <text x="155" y="192" text-anchor="middle" font-size="11.5" fill="#9099a8">LinkedList ✗</text>
  <rect x="75" y="214" width="160" height="32" rx="6" fill="#14161a" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 4"/>
  <text x="155" y="234" text-anchor="middle" font-size="11.5" fill="#9099a8">ImmutableList ✗</text>

  <!-- ===== RIGHT: interface ===== -->
  <rect x="365" y="44" width="200" height="44" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="465" y="64" text-anchor="middle" font-size="12" font-weight="600" fill="#e8e4dc">process(orders)</text>
  <text x="465" y="80" text-anchor="middle" font-size="10" fill="#fb863a">param: List&lt;Order&gt;</text>

  <rect x="385" y="118" width="160" height="40" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)" stroke-width="1.5"/>
  <rect x="385" y="118" width="160" height="40" rx="6" fill="rgba(251,134,58,0.16)"/>
  <text x="465" y="134" text-anchor="middle" font-size="10" fill="#fb863a">«interface»</text>
  <text x="465" y="150" text-anchor="middle" font-size="12.5" font-weight="600" fill="#e8e4dc">List</text>
  <line x1="465" y1="88" x2="465" y2="116" stroke="#9099a8" stroke-width="1.6"/>

  <line x1="410" y1="244" x2="445" y2="160" stroke="#fb863a" stroke-width="1.4" marker-end="url(#pti-impl)"/>
  <line x1="465" y1="244" x2="465" y2="160" stroke="#fb863a" stroke-width="1.4" marker-end="url(#pti-impl)"/>
  <line x1="520" y1="244" x2="485" y2="160" stroke="#fb863a" stroke-width="1.4" marker-end="url(#pti-impl)"/>
  <rect x="378" y="246" width="84" height="30" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.2"/>
  <text x="420" y="265" text-anchor="middle" font-size="10" fill="#e8e4dc">ArrayList</text>
  <rect x="468" y="246" width="84" height="30" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.2"/>
  <text x="510" y="265" text-anchor="middle" font-size="10" fill="#e8e4dc">LinkedList</text>
  <rect x="558" y="246" width="56" height="30" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.2"/>
  <text x="586" y="265" text-anchor="middle" font-size="9" fill="#e8e4dc">Immutable</text>
</svg>`,
        caption:
          "**Left** — the parameter is typed `ArrayList`, so only an `ArrayList` is accepted; `LinkedList` and `ImmutableList` are turned away even though they're perfectly good lists. **Right** — the parameter is typed `List` (the contract), and every class that *implements* `List` plugs in (open arrowheads point up at the interface). Same function body; the wider type lets three things fit where only one fit before.",
      },
      { type: "h", text: "The rule of thumb" },
      {
        type: "ul",
        items: [
          "**Declare the widest type that does the job.** Need to iterate and add? Declare `List`, not `ArrayList`. Need only to iterate? Declare `Iterable` or `Collection`.",
          "**Return the contract too.** A method that returns `ArrayList` leaks its implementation to every caller; returning `List` keeps you free to change the internals later.",
          "**Construct with the concrete class — in one place.** The single line `new ArrayList<>()` is fine; that's where the choice belongs. Just don't let the concrete name spread into signatures and fields.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't wrap everything in an interface “just in case”",
        text: "This rule is about typing to *existing* contracts and writing interfaces where variation is **real**. It is **not** a license to invent a one-implementation interface for every class on the off chance you might need a second one (`UserService` + its lone `UserServiceImpl`). That's **YAGNI** — you add a layer, a file, and a confusing indirection that buys nothing because no second implementation ever arrives. Type to the contract when there genuinely *is* a contract; introduce a new interface when there genuinely *is* variation — not before.",
      },
    ],

    handsOn: [
      {
        title: "01 · Feel the lock",
        body: "Open the prototype in **Concrete** mode. The function declares its parameter as `ArrayList<Order>`. Watch the tray: only `ArrayList` clicks in (green); `LinkedList` and `ImmutableList` are rejected with a red *not an ArrayList* and are locked. Read the side panel — *values that fit: 1*, *swap without editing this code? ✗*. This is what hard-wiring to a concrete class costs you.",
      },
      {
        title: "02 · Widen the type to the contract",
        body: "Flip to **Interface** mode. The declared parameter changes to `List<Order>` — and that is the *only* change to the consuming code. Instantly the tray unlocks. The count jumps to *3* and the swap indicator flips to *✓*. Notice the function body never changed; only the type you wrote did.",
      },
      {
        title: "03 · Plug in every implementation",
        body: "Still in Interface mode, click each chip — `ArrayList`, `LinkedList`, `ImmutableList`. Every one is accepted (green) and the explain panel narrates that the consuming code didn't move. That is the whole payoff: by depending on the *contract*, you made the implementation swappable for free. Toggle back to Concrete and watch two of the three lock shut again.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "process-orders.ts",
        code: `// Program to an interface: declare the CONTRACT, not a class.
interface MessageSender {
  send(to: string, text: string): void;
}

// ✅ Parameter typed to the interface — any sender fits.
function notify(sender: MessageSender, customer: string) {
  sender.send(customer, "Your order shipped");
}

class EmailSender implements MessageSender {
  send(to: string, text: string) { /* ...real email... */ }
}
class SmsSender implements MessageSender {
  send(to: string, text: string) { /* ...real SMS... */ }
}

// Swap the implementation — notify() never changes.
notify(new EmailSender(), "ada@x.io");
notify(new SmsSender(),   "ada@x.io");   // same call site, different object

// Same idea for collections: type the field/return to the contract.
class Cart {
  // ✅ Iterable<Order>, not Array<Order> — callers only iterate.
  private items: Order[] = [];
  all(): readonly Order[] { return this.items; }   // hand back the contract
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "ProcessOrders.java",
        code: `import java.util.*;

// ⚠️ Programming to an IMPLEMENTATION — only an ArrayList may pass.
class Welded {
    void process(ArrayList<Order> orders) {     // locked to ArrayList
        for (Order o : orders) { /* ... */ }
    }
}

// ✅ Programming to the INTERFACE — any List fits.
class Open {
    void process(List<Order> orders) {          // ArrayList, LinkedList, ...
        for (Order o : orders) { /* ... */ }
    }
    // Return the contract too, never the concrete class.
    List<Order> recent() {
        return new ArrayList<>();                // concrete choice lives HERE
    }
}

// Swap the implementation in ONE line; every List<Order> caller is untouched.
List<Order> orders = new ArrayList<>();   // before
// List<Order> orders = new LinkedList<>();  // after — only this line changes
new Open().process(orders);`,
      },
      {
        label: "Python",
        language: "python",
        filename: "process_orders.py",
        code: `from typing import Protocol, Iterable

# Program to an interface: a Protocol is the contract.
class MessageSender(Protocol):
    def send(self, to: str, text: str) -> None: ...

# ✅ Parameter typed to the contract — any sender fits.
def notify(sender: MessageSender, customer: str) -> None:
    sender.send(customer, "Your order shipped")

class EmailSender:                       # structurally a MessageSender
    def send(self, to: str, text: str) -> None: ...   # real email
class SmsSender:
    def send(self, to: str, text: str) -> None: ...   # real SMS

notify(EmailSender(), "ada@x.io")
notify(SmsSender(),   "ada@x.io")        # same call, different object

# For collections, accept the widest protocol you actually need.
def total(orders: Iterable["Order"]) -> int:   # not list — any iterable fits
    return sum(o.amount for o in orders)`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "process_orders.cpp",
        code: `#include <string>
#include <vector>

// Program to an interface: an abstract base class is the contract.
struct MessageSender {
    virtual void send(const std::string& to, const std::string& text) = 0;
    virtual ~MessageSender() = default;
};

// ✅ Parameter typed to the contract (by reference) — any sender fits.
void notify(MessageSender& sender, const std::string& customer) {
    sender.send(customer, "Your order shipped");
}

struct EmailSender : MessageSender {
    void send(const std::string&, const std::string&) override {} // real email
};
struct SmsSender : MessageSender {
    void send(const std::string&, const std::string&) override {} // real SMS
};

int main() {
    EmailSender email;  notify(email, "ada@x.io");
    SmsSender   sms;    notify(sms,   "ada@x.io");   // swap the object, not notify()
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Type to the contract by default; introduce one where variation is real" },
      {
        type: "p",
        text: "Two separate habits live under this rule. The first is free and you should do it almost always: when a contract *already exists* (`List`, `Collection`, `Reader`, `Comparator`), declare your variables, parameters, and returns as that contract. The second — *creating* a new interface — is a design decision you make only where genuine variation exists.",
      },
      {
        type: "ul",
        items: [
          "**A standard library already has the contract** — declare `List`/`Map`/`Iterable` instead of `ArrayList`/`HashMap`/`Vector`. Pure upside; do it everywhere.",
          "**There really are multiple implementations** — email vs. SMS senders, MySQL vs. in-memory repositories, real vs. fake clocks. Define an interface and type to it.",
          "**You want a fake for tests** — if you need to substitute a stub/mock, the seam is a contract. Declare the interface so the test double can stand in.",
          "**A public API boundary** — returning a contract keeps you free to change internals later without breaking callers.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Skip the interface when there's only ever one implementation",
        text: "If a class has exactly one implementation and no foreseeable second one — a value object like `Money`, a tiny internal helper, glue code that will never be faked — don't manufacture a `Thing` + `ThingImpl` pair. The interface adds a file and a hop of indirection while buying zero flexibility. Add it the day a second implementation (or a needed test double) actually shows up.",
      },
    ],

    tradeoffs: {
      pros: [
        "Swappability — change ArrayList→LinkedList or Email→SMS by editing one construction line; every consumer keeps working.",
        "Lower coupling — callers depend only on what the contract promises, so they can't accidentally lean on an implementation's extra methods.",
        "Testability — a contract is a natural seam to drop a fake or mock into during unit tests.",
        "Cleaner APIs — returning the interface hides internals and lets you evolve them later without breaking callers.",
      ],
      cons: [
        "Over-abstraction — wrapping single-implementation classes in interfaces “just in case” adds files and indirection for no payoff (YAGNI).",
        "Lost specifics — typing to the contract hides a concrete class's extra methods; occasionally you genuinely need one and must choose the right wider type.",
        "Indirection cost — ‘go to definition’ lands on the interface, so tracing a real call can take one extra hop.",
        "Judgment required — picking the *right* width (Iterable vs. Collection vs. List) is a small design decision, not a mechanical rule.",
      ],
    },

    furtherReading: [
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides (“Gang of Four”)",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The source of the motto itself: “Program to an interface, not an implementation.” The book's introduction lays out why coupling to abstractions, not concrete classes, is the foundation the patterns are built on.",
        kind: "book",
      },
      {
        label: "Code to interfaces — Wikipedia (“Interface-based programming”)",
        href: "https://en.wikipedia.org/wiki/Interface-based_programming",
        note: "Encyclopedic overview of programming to interfaces: what a contract is, how callers depend on it, and how it enables substitution of implementations.",
        kind: "docs",
      },
      {
        label: "Coding to an Interface — Baeldung",
        href: "https://www.baeldung.com/java-coding-to-interfaces",
        note: "A code-first Java walkthrough that takes a class wired to ArrayList and retypes it to List, showing exactly which lines change (one) versus which don't (all the callers).",
        kind: "article",
      },
      {
        label: "Effective Java, Item 64: Refer to objects by their interfaces — Joshua Bloch",
        href: "https://www.oreilly.com/library/view/effective-java/9780134686097/",
        note: "The canonical, precise statement of the habit: use interface types for parameters, fields, and return values, and the exceptions where a concrete type is the right call.",
        kind: "book",
      },
      {
        label: "Dependency Inversion Principle — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/abstract-factory",
        note: "Useful companion read: how depending on abstractions (the same idea) shapes patterns like Abstract Factory, which hand back interface types so callers never name a concrete product.",
        kind: "article",
      },
      {
        label: "Program to an interface, not an implementation — a short explainer (video)",
        href: "https://www.youtube.com/watch?v=NU_1StN5Tkk",
        note: "A quick visual run-through of the motto with before/after code, good for seeing the swap become free once the type widens to the contract.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "program-to-interfaces-q1",
        question: "What does “Program to an interface, not an implementation” actually tell you to do?",
        options: [
          { id: "a", label: "Declare variables, parameters, and return types as a contract (like List), not a concrete class (like ArrayList)." },
          { id: "b", label: "Never use the `new` keyword anywhere in your program." },
          { id: "c", label: "Create a matching interface for every single class you write, no exceptions." },
          { id: "d", label: "Put all of your code behind a REST API so other programs can call it." },
        ],
        correctOptionId: "a",
        explanation:
          "The motto is about the *types you declare*: name the contract (`List`, `MessageSender`) instead of a specific class (`ArrayList`, `EmailSender`), so the object behind it can be swapped without changing the code that uses it. You still construct concrete classes with `new` (option b), and you should NOT wrap every class in an interface (option c, that's YAGNI).",
      },
      {
        id: "program-to-interfaces-q2",
        question: "A function is declared as `process(ArrayList<Order> orders)`. Later you want to pass a `LinkedList<Order>`. What happens, and what's the fix?",
        options: [
          { id: "a", label: "It won't accept the LinkedList; widen the parameter type to the contract, `List<Order>`, and any list fits." },
          { id: "b", label: "It works automatically because LinkedList and ArrayList are the same class." },
          { id: "c", label: "You must rewrite the body of process() to handle linked lists differently." },
          { id: "d", label: "Nothing can be done; once a parameter is concrete it can never be changed." },
        ],
        correctOptionId: "a",
        explanation:
          "Because the parameter names the concrete `ArrayList`, only an `ArrayList` is accepted — a `LinkedList` is rejected. Retyping the parameter to the interface `List<Order>` lets every kind of list through, and the function body doesn't change at all. That one-type change is the whole benefit of programming to the interface.",
      },
      {
        id: "program-to-interfaces-q3",
        question: "How does “program to interfaces” relate to the Dependency Inversion Principle (DIP)?",
        options: [
          { id: "a", label: "They're related but different: DIP is about the direction of dependencies between high- and low-level modules; programming to interfaces is the everyday habit of typing variables/params/returns to a contract." },
          { id: "b", label: "They are two names for exactly the same rule." },
          { id: "c", label: "DIP says to use concrete classes; programming to interfaces says the opposite." },
          { id: "d", label: "Programming to interfaces only applies to databases; DIP applies to everything else." },
        ],
        correctOptionId: "a",
        explanation:
          "DIP is a module-level principle about which way dependencies point — high-level policy and low-level details both depending on an abstraction the policy owns. Programming to interfaces is the small, constant habit of declaring your types as contracts. You can't really achieve DIP without this habit, but you use the habit everywhere, even in code that has no high/low-level split.",
      },
      {
        id: "program-to-interfaces-q4",
        question: "Why is it risky to declare a field as `ArrayList` and let callers use it freely, even if an `ArrayList` is what you have today?",
        options: [
          { id: "a", label: "Callers may start using ArrayList-only methods (like ensureCapacity), which makes a later swap to LinkedList impossible." },
          { id: "b", label: "ArrayList is deprecated and will be removed from the language." },
          { id: "c", label: "Declaring ArrayList makes the whole class fail to compile." },
          { id: "d", label: "ArrayList objects can never be passed to a function at all." },
        ],
        correctOptionId: "a",
        explanation:
          "A concrete class exposes extra methods the interface doesn't promise. Once a caller depends on an `ArrayList`-only method, you can no longer swap in a `LinkedList` without breaking that caller. Declaring the contract (`List`) limits everyone to what the contract promises, keeping the implementation swappable.",
      },
      {
        id: "program-to-interfaces-q5",
        question: "When should you NOT introduce a new interface in front of a class?",
        options: [
          { id: "a", label: "When the class has exactly one implementation, no foreseeable second one, and no need for a test double — adding an interface is just YAGNI indirection." },
          { id: "b", label: "When you already know you'll need email and SMS variants of it." },
          { id: "c", label: "When the class talks to a database you'll want to fake in tests." },
          { id: "d", label: "When the class is part of a public API whose internals you want freedom to change." },
        ],
        correctOptionId: "a",
        explanation:
          "Programming to interfaces pays off where variation is *real*. A class with a single implementation and no test-double need (a value object, a tiny helper) gains nothing from a `Thing` + `ThingImpl` pair except an extra file and a confusing hop — that's YAGNI. The other cases (b, c, d) all have genuine variation, so an interface is justified there.",
      },
    ],
  },
};
