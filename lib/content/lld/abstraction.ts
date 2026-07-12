import type { RoadmapLesson } from "@/lib/content/types";

export const abstraction: RoadmapLesson = {
  title: "Abstraction",
  oneLiner:
    "Expose a simple, essential interface and hide the complex machinery behind it — you call makeEspresso(), not the twelve internal steps.",
  difficulty: "beginner",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/abstraction.html",
  content: {
    prototypeCaption:
      "On the left is the machine's *whole* control panel: one button. Press **makeEspresso()** and the outside world just sees `☕ espresso ready`. Flip **Show internals** to reveal the hidden pipeline — *grind → heat → pressure → extract → pour* — firing step by step. The caller never deals with any of it.",

    overview: [
      {
        type: "p",
        text: "**Abstraction** means showing *what* something does while hiding *how* it does it. You drive a car with a steering wheel and two pedals — a small, simple surface. Behind that surface sits an engine, a transmission, fuel injection, and a hundred moving parts you never touch. The simple controls are the abstraction; the machinery is the implementation.",
      },
      {
        type: "p",
        text: "A coffee machine is the same story. You press one button and get espresso. Inside, it grinds beans, heats water, builds pressure, extracts a shot, and pours — but none of that leaks out to you. The button is the **interface**; the steps are the **implementation**. Good abstraction lets you use a thing without understanding its insides.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Abstraction exposes the **essential WHAT** and hides the **complex HOW**. The caller presses one button; the steps stay behind the panel.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Interface vs. implementation" },
      {
        type: "p",
        text: "Every abstraction has two sides. The **interface** is the promise: the set of operations a caller can perform — `makeEspresso()`, `makeLatte()`. The **implementation** is the kept promise: the actual code that grinds, heats, and pours. The whole point is that callers depend on the interface and stay blissfully unaware of the implementation. Change how the machine builds pressure tomorrow, and every caller keeps working — because they only ever asked for *espresso*, not for a particular way of making it.",
      },
      { type: "h", text: "Expose WHAT, hide HOW" },
      {
        type: "p",
        text: "When you design an abstraction, you decide what belongs on the surface and what stays buried. A TV remote shows you `volumeUp`, `channelDown`, and `power`. It does *not* show you the infrared timing protocol or the panel's refresh circuitry. You expose the verbs people actually want and hide the mechanics they don't. A useful test: if a caller would have to read a manual about your internals to use you correctly, your abstraction is leaking.",
      },
      { type: "h", text: "Abstract classes and interfaces — the tools" },
      {
        type: "p",
        text: "Languages give you concrete tools to draw this line. An **interface** (or a pure abstract class) names the operations without saying how they work — it is a contract. A concrete class then *implements* that contract with real code. For example, a `PaymentMethod` interface might declare just one method:",
      },
      {
        type: "code",
        language: "typescript",
        filename: "payment.ts",
        code: `interface PaymentMethod {
  pay(amount: number): void; // the WHAT — no HOW in sight
}

// Two implementations doing very different hidden work:
class CardPayment implements PaymentMethod {
  pay(amount: number) { /* contact bank, run 3-D Secure... */ }
}
class UpiPayment implements PaymentMethod {
  pay(amount: number) { /* open UPI app, await VPA approval... */ }
}`,
      },
      { type: "h", text: "Program to an interface, not an implementation" },
      {
        type: "p",
        text: "Once the contract exists, write your callers against the *interface*, not a specific class. A checkout function that takes a `PaymentMethod` can be handed a `CardPayment` today and a `UpiPayment` tomorrow — it just calls `pay(amount)` and never asks which one it got. That single habit is what lets you swap, extend, and test implementations without rewriting the code that uses them.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Abstraction vs. encapsulation — the key distinction",
        text: "They're cousins, not twins. **Abstraction** is a *design view*: it hides *complexity* by exposing a simple interface (you press one button instead of running twelve steps). **Encapsulation** is an *implementation view*: it hides and protects *data* by keeping fields private and guarding them behind methods. One simplifies *what you have to think about*; the other protects *the state inside*.",
      },
    ],

    handsOn: [
      {
        title: "01 · Press one button, get a result",
        body: "With internals hidden, press **makeEspresso()**. All you see in the log is `☕ espresso ready`. That single call is the entire interface a caller deals with — no steps, no setup, no cleanup. That's abstraction: one simple verb on the surface.",
      },
      {
        title: "02 · Reveal the hidden machine",
        body: "Toggle **Show internals**, then brew again. Now the pipeline lights up step by step — `grind → heat → pressure → extract → pour` — while the external log still only reports `ready`. Same button, same result; the complexity was there all along, just hidden behind the panel.",
      },
      {
        title: "03 · Complexity stays hidden when it grows",
        body: "Press **makeLatte()**. It runs everything espresso does *plus* a steam-milk step — strictly more internal work — yet the caller still pressed exactly one button. Notice the button stays disabled while brewing: the abstraction guards its own machinery so you can't poke it mid-cycle.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "payment.ts",
        code: `// Abstraction: callers see pay(), never the hidden work.
interface PaymentMethod {
  pay(amount: number): void; // the WHAT — the contract
}

class CardPayment implements PaymentMethod {
  pay(amount: number) {
    // hidden HOW: talk to the bank, run 3-D Secure, settle
    console.log(\`Charged $\${amount} to card ****4242\`);
  }
}

class UpiPayment implements PaymentMethod {
  pay(amount: number) {
    // hidden HOW: open UPI app, await VPA approval, confirm
    console.log(\`Collected ₹\${amount} via UPI\`);
  }
}

// The caller programs to the interface, not an implementation.
function checkout(method: PaymentMethod, total: number) {
  method.pay(total); // never asks "are you a card or UPI?"
}

checkout(new CardPayment(), 50);
checkout(new UpiPayment(), 50);`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Payment.java",
        code: `// Abstraction: callers see pay(), never the hidden work.
interface PaymentMethod {
    void pay(double amount); // the WHAT — the contract
}

class CardPayment implements PaymentMethod {
    public void pay(double amount) {
        // hidden HOW: talk to the bank, run 3-D Secure, settle
        System.out.println("Charged $" + amount + " to card ****4242");
    }
}

class UpiPayment implements PaymentMethod {
    public void pay(double amount) {
        // hidden HOW: open UPI app, await VPA approval, confirm
        System.out.println("Collected " + amount + " via UPI");
    }
}

class Checkout {
    // The caller programs to the interface, not an implementation.
    static void run(PaymentMethod method, double total) {
        method.pay(total); // never asks "are you a card or UPI?"
    }

    public static void main(String[] args) {
        run(new CardPayment(), 50);
        run(new UpiPayment(), 50);
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "payment.py",
        code: `# Abstraction: callers see pay(), never the hidden work.
from abc import ABC, abstractmethod


class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount: float) -> None:  # the WHAT — the contract
        ...


class CardPayment(PaymentMethod):
    def pay(self, amount: float) -> None:
        # hidden HOW: talk to the bank, run 3-D Secure, settle
        print(f"Charged \${amount} to card ****4242")


class UpiPayment(PaymentMethod):
    def pay(self, amount: float) -> None:
        # hidden HOW: open UPI app, await VPA approval, confirm
        print(f"Collected {amount} via UPI")


# The caller programs to the interface, not an implementation.
def checkout(method: PaymentMethod, total: float) -> None:
    method.pay(total)  # never asks "are you a card or UPI?"


checkout(CardPayment(), 50)
checkout(UpiPayment(), 50)`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "payment.cpp",
        code: `// Abstraction: callers see pay(), never the hidden work.
#include <iostream>
#include <memory>

class PaymentMethod {
public:
    virtual void pay(double amount) = 0; // pure virtual — the contract
    virtual ~PaymentMethod() = default;
};

class CardPayment : public PaymentMethod {
public:
    void pay(double amount) override {
        // hidden HOW: talk to the bank, run 3-D Secure, settle
        std::cout << "Charged $" << amount << " to card ****4242\\n";
    }
};

class UpiPayment : public PaymentMethod {
public:
    void pay(double amount) override {
        // hidden HOW: open UPI app, await VPA approval, confirm
        std::cout << "Collected " << amount << " via UPI\\n";
    }
};

// The caller programs to the interface, not an implementation.
void checkout(PaymentMethod& method, double total) {
    method.pay(total); // never asks "are you a card or UPI?"
}

int main() {
    CardPayment card;
    UpiPayment upi;
    checkout(card, 50);
    checkout(upi, 50);
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to introduce an interface" },
      {
        type: "ul",
        items: [
          "When you have **more than one way** to do the same job — card vs. UPI, local disk vs. cloud storage. An interface names the job once and lets each variant fill in the *how*.",
          "When callers shouldn't care about the details — give them a clean verb like `pay()` or `makeEspresso()` and hide the rest.",
          "When you want to **swap or test** implementations freely — code written against an interface can accept a real service or a fake one without changing.",
          "When a subsystem is genuinely complex and a small, stable surface would make it far easier to use.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "YAGNI — don't abstract prematurely",
        text: "An interface with exactly one implementation that will never have another is just extra ceremony. Wait for the *second* real use case before extracting an abstraction — premature abstraction is harder to undo than a little duplication.",
      },
    ],

    tradeoffs: {
      pros: [
        "Callers depend on a simple, stable interface instead of messy internals — less to learn, less to break.",
        "You can swap one implementation for another (card → UPI, disk → cloud) without touching caller code.",
        "Implementations become easy to test and mock, because callers only need the contract.",
        "Complexity stays contained: the hard machinery lives in one place, behind the panel.",
      ],
      cons: [
        "**Leaky abstractions** — when implementation details bleed through the interface, callers end up needing to know the internals anyway.",
        "**Over-abstracting** — wrapping everything in interfaces 'just in case' adds indirection without ever paying off.",
        "Too many layers — stacking abstraction on abstraction makes code hard to trace and debug.",
        "A surface that's too thin can hide controls callers genuinely need, forcing ugly workarounds.",
      ],
    },

    furtherReading: [
      {
        label: "Wikipedia — Abstraction (computer science)",
        href: "https://en.wikipedia.org/wiki/Abstraction_(computer_science)",
        note: "A broad map of what abstraction means across programming, from data to control to layered systems.",
        kind: "article",
      },
      {
        label: "Oracle — Abstract Methods and Classes",
        href: "https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html",
        note: "The canonical Java tutorial on abstract classes and methods — your main tool for abstraction in Java.",
        kind: "docs",
      },
      {
        label: "Python docs — abc (Abstract Base Classes)",
        href: "https://docs.python.org/3/library/abc.html",
        note: "How to declare contracts in Python with abc.ABC and @abstractmethod.",
        kind: "docs",
      },
      {
        label: "refactoring.guru — What is a Design Pattern?",
        href: "https://refactoring.guru/design-patterns/what-is-pattern",
        note: "Grounds the 'program to an interface' mindset that good abstraction depends on.",
        kind: "article",
      },
      {
        label: "Wikipedia — Leaky abstraction",
        href: "https://en.wikipedia.org/wiki/Leaky_abstraction",
        note: "The classic pitfall: when the details you tried to hide leak back out to the caller.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "ab-q1",
        question: "What does abstraction primarily hide?",
        options: [
          { id: "a", label: "The names of a class's public methods." },
          { id: "b", label: "The complex implementation details behind a simple interface." },
          { id: "c", label: "The number of objects created from a class." },
          { id: "d", label: "The programming language the code is written in." },
        ],
        correctOptionId: "b",
        explanation:
          "Abstraction exposes a simple interface (the WHAT) and hides the complex implementation (the HOW). You press makeEspresso(); the twelve internal steps stay behind the panel.",
      },
      {
        id: "ab-q2",
        question:
          "A checkout function accepts a `PaymentMethod` and calls `pay(amount)`. Why does it not check whether it got a `CardPayment` or a `UpiPayment`?",
        options: [
          { id: "a", label: "Because both classes secretly share the same code." },
          { id: "b", label: "Because it programs to the interface, not a specific implementation." },
          { id: "c", label: "Because checking the type would be too slow." },
          { id: "d", label: "Because only one of them can ever exist at a time." },
        ],
        correctOptionId: "b",
        explanation:
          "The caller depends on the PaymentMethod contract, not on any concrete class. Each implementation fills in its own hidden pay() logic, so the caller just calls pay() and stays unaware of which one it got.",
      },
      {
        id: "ab-q3",
        question: "Which statement best captures the difference between abstraction and encapsulation?",
        options: [
          { id: "a", label: "They are two names for the exact same idea." },
          { id: "b", label: "Abstraction hides data; encapsulation hides complexity." },
          { id: "c", label: "Abstraction hides complexity (design view); encapsulation hides and protects data (implementation view)." },
          { id: "d", label: "Abstraction applies only to classes; encapsulation applies only to functions." },
        ],
        correctOptionId: "c",
        explanation:
          "Abstraction is a design view that hides complexity behind a simple interface. Encapsulation is an implementation view that hides and protects data by keeping fields private behind methods.",
      },
      {
        id: "ab-q4",
        question:
          "You're tempted to add an interface for a class that has exactly one implementation and no second use case in sight. What's the wise move?",
        options: [
          { id: "a", label: "Add the interface now — abstractions are always free." },
          { id: "b", label: "Hold off (YAGNI); extract the abstraction when a second real use case appears." },
          { id: "c", label: "Add three interfaces to be safe for the future." },
          { id: "d", label: "Make every field public so callers can reach the internals." },
        ],
        correctOptionId: "b",
        explanation:
          "Premature abstraction is ceremony with no payoff and is harder to undo than a little duplication. Wait for the second concrete use case before introducing the interface.",
      },
    ],
  },
};
