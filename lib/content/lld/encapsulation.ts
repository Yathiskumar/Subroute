import type { RoadmapLesson } from "@/lib/content/types";

export const encapsulation: RoadmapLesson = {
  title: "Encapsulation",
  oneLiner:
    "Hide an object's internal state behind methods so it protects its own rules — outside code can't reach in and break it.",
  difficulty: "beginner",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/encapsulation.html",
  content: {
    prototypeCaption:
      "One `BankAccount` drawn as a capsule with a *shielded* interior holding the private `balance`. Try the left column — `account.balance = X` — and the shield flashes **red**: outside code can't touch a private field. Use the right column — `deposit` and `withdraw` — and watch validation run before the balance changes. The `balance >= 0` invariant never breaks.",

    overview: [
      {
        type: "p",
        text: "Think of a medicine capsule. The powder inside is sealed — you don't pour it out and re-measure it yourself. You take the capsule as a whole, and the casing makes sure you get exactly the right dose. **Encapsulation** is that idea in code: an object wraps its data inside a protective shell and only lets you interact with it through a few trusted methods.",
      },
      {
        type: "p",
        text: "Without it, any code anywhere could reach into an object and scramble its data — set a bank balance to `-9999`, give an order a quantity of zero, put a date in an impossible state. With encapsulation, the object becomes the *guardian* of its own data. Want to change something? You go through a method, and that method gets to say yes or no.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Make the data **private**, expose **methods** that guard it. The object protects its own rules so no outside code can put it in a broken state.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Private vs. public" },
      {
        type: "p",
        text: "Every member of a class is either **public** — anyone can see and touch it — or **private** — only the object's own methods can. Encapsulation is the habit of keeping *data* private and making a small, deliberate set of *methods* public. The public methods are the object's front door; the private fields are the locked room behind it.",
      },
      {
        type: "p",
        text: "Picture a vending machine. There's a locked cash box inside (private). You can't open it and take the money. What you *can* do is press buttons and insert coins (public methods). The machine decides whether to dispense a snack and how much change to return. The rules live with the machine, not with whoever walks up to it.",
      },
      { type: "h", text: "Access modifiers" },
      {
        type: "p",
        text: "Languages give you keywords to mark this boundary. In TypeScript it's `private` (or a `#name` field that's truly hidden at runtime). In Java and C++ it's `private`. Python has no hard private, so the convention is a leading underscore like `_balance`, often paired with a `property` to control access. Same idea everywhere: a label that says *this is internal, don't touch it from outside*.",
      },
      { type: "h", text: "Getters and setters — done right" },
      {
        type: "p",
        text: "A **getter** reads a private field; a **setter** changes it. The point of routing through them is *not* to mindlessly mirror the field — it's to add a checkpoint. A good setter validates:",
      },
      {
        type: "ul",
        items: [
          "**Validate before you write.** A `deposit(amount)` rejects a negative amount; a `setTemperature(c)` rejects anything below absolute zero. The method refuses bad input instead of storing it.",
          "**Expose read-only when that's all you need.** Often you want a getter and *no* setter at all — outsiders can look at the balance but can only change it by depositing or withdrawing.",
          "**Don't just pass the field through.** A setter that does `this._balance = value` with no check gives away everything privacy bought you. If a field has no rules, maybe it doesn't need a setter.",
        ],
      },
      { type: "h", text: "Invariants: the rules the object guards" },
      {
        type: "p",
        text: "An **invariant** is a fact that must *always* be true about an object — for a bank account, `balance >= 0`. Encapsulation is what lets the object *promise* that invariant. Because the only way in is through `deposit` and `withdraw`, and those methods check the rule, the balance can never go negative. The object enforces its own correctness.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "account.ts",
        code: `class BankAccount {
  // private — the front door is the methods below, not this field
  #balance = 0;

  deposit(amount: number) {
    if (amount <= 0) throw new Error("amount must be positive");
    this.#balance += amount;            // guarded write
  }

  withdraw(amount: number) {
    if (amount > this.#balance) throw new Error("insufficient funds");
    this.#balance -= amount;            // invariant balance >= 0 holds
  }

  get balance() { return this.#balance; } // read-only view, no setter
}

const a = new BankAccount();
a.deposit(100);
// a.#balance = -5  ← won't even compile; the field is unreachable`,
      },
      { type: "h", text: "Why data and its guard methods belong together" },
      {
        type: "p",
        text: "The validation rules and the data they protect are two halves of one thing. If they're split apart — data in one place, the checks scattered across the codebase — sooner or later someone changes the data without running the checks. Keeping `balance` and the `deposit`/`withdraw` that guard it in the *same class* means there's exactly one trusted path in, and the rules can't be skipped.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Encapsulation vs. abstraction",
        text: "They sound alike but solve different problems. **Encapsulation** hides and protects *data* (private fields behind guard methods). **Abstraction** hides *complexity* (a simple interface over messy internals). Encapsulation is about *who can touch what*; abstraction is about *what you have to know*.",
      },
    ],

    handsOn: [
      {
        title: "01 · Try to break in directly",
        body: "Type a number into the left column and press `account.balance = X`. The shield flashes **red** and the log says the field is private — outside code can't touch it. The balance doesn't budge. That's the privacy boundary doing its job.",
      },
      {
        title: "02 · Go through the methods",
        body: "Use the right column to `deposit(50)`, then `withdraw(30)`. Valid operations flash **green** and the shielded balance updates. This is the front door — the only sanctioned way to change the data.",
      },
      {
        title: "03 · Watch validation reject bad input",
        body: "Try `deposit(-20)` or `withdraw` more than the current balance. The method *refuses* and logs why, and the `balance >= 0` invariant badge stays satisfied. The object guards its own rules even when you ask it to misbehave.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "bank-account.ts",
        code: `// balance is private; the only way to change it is through guarded methods.
class BankAccount {
  #balance: number;

  constructor(opening = 0) {
    if (opening < 0) throw new Error("opening balance can't be negative");
    this.#balance = opening;
  }

  deposit(amount: number) {
    if (amount <= 0) throw new Error("deposit must be positive");
    this.#balance += amount;
  }

  withdraw(amount: number) {
    if (amount <= 0) throw new Error("withdraw must be positive");
    if (amount > this.#balance) throw new Error("insufficient funds");
    this.#balance -= amount;
  }

  // read-only view — no setter, so outsiders can look but not poke
  get balance() {
    return this.#balance;
  }
}

const acct = new BankAccount(100);
acct.deposit(50);     // → 150
acct.withdraw(30);    // → 120
// acct.#balance = -5 ← syntax error: '#balance' is not accessible
// acct.balance  = -5 ← error: no setter; 'balance' is read-only`,
      },
      {
        label: "Java",
        language: "java",
        filename: "BankAccount.java",
        code: `// 'private' makes the field unreachable from outside the class.
public class BankAccount {
    private double balance;

    public BankAccount(double opening) {
        if (opening < 0)
            throw new IllegalArgumentException("opening can't be negative");
        this.balance = opening;
    }

    public void deposit(double amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("deposit must be positive");
        this.balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("withdraw must be positive");
        if (amount > this.balance)
            throw new IllegalStateException("insufficient funds");
        this.balance -= amount;
    }

    // getter only — no setBalance(), so the invariant can't be bypassed
    public double getBalance() {
        return this.balance;
    }
}

BankAccount acct = new BankAccount(100);
acct.deposit(50);     // → 150
acct.withdraw(30);    // → 120
// acct.balance = -5; ← won't compile: balance has private access`,
      },
      {
        label: "Python",
        language: "python",
        filename: "bank_account.py",
        code: `# A leading underscore marks the field internal; a property guards reads.
class BankAccount:
    def __init__(self, opening: float = 0):
        if opening < 0:
            raise ValueError("opening can't be negative")
        self._balance = opening  # _ = "internal, don't touch from outside"

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("withdraw must be positive")
        if amount > self._balance:
            raise ValueError("insufficient funds")
        self._balance -= amount

    @property
    def balance(self) -> float:  # read-only view: a getter with no setter
        return self._balance


acct = BankAccount(100)
acct.deposit(50)      # → 150
acct.withdraw(30)     # → 120
# acct.balance = -5   → AttributeError: can't set attribute (no setter)
# acct._balance = -5  → "works" but breaks the rules — the _ says don't.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "bank_account.cpp",
        code: `// Everything under 'private:' is sealed off from outside code.
#include <stdexcept>

class BankAccount {
    double balance;            // private by default in a class

public:
    explicit BankAccount(double opening) : balance(opening) {
        if (opening < 0)
            throw std::invalid_argument("opening can't be negative");
    }

    void deposit(double amount) {
        if (amount <= 0)
            throw std::invalid_argument("deposit must be positive");
        balance += amount;
    }

    void withdraw(double amount) {
        if (amount <= 0)
            throw std::invalid_argument("withdraw must be positive");
        if (amount > balance)
            throw std::runtime_error("insufficient funds");
        balance -= amount;
    }

    // const getter — read-only, no public way to set balance directly
    double getBalance() const { return balance; }
};

BankAccount acct(100);
acct.deposit(50);     // → 150
acct.withdraw(30);    // → 120
// acct.balance = -5; ← compile error: 'balance' is private`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to make things private" },
      {
        type: "ul",
        items: [
          "When a field has **rules** — a balance that can't go negative, a percentage that must stay 0–100, a status that only changes in a set order.",
          "When you want to **change the internals later** without breaking callers — hide the field now, and you're free to swap how it's stored.",
          "When data and the **logic that protects it** belong together — keep them in one class so the checks can't be skipped.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Make fields private by default",
        text: "Start every field as private and only open it up when you have a concrete reason. It's far easier to expose something later than to claw back access once code all over the codebase depends on a public field.",
      },
    ],

    tradeoffs: {
      pros: [
        "The object guards its own invariants — bad states become impossible, not just discouraged.",
        "One trusted path in means validation can't be bypassed or forgotten.",
        "You can change the internal representation freely without breaking any caller.",
        "Bugs are easier to find — if the balance is wrong, the cause is in one small set of methods.",
      ],
      cons: [
        "Anemic getters/setters that just expose every field — that's a public field wearing a disguise, with none of the protection.",
        "Leaking mutable internals — returning the actual list or array lets callers mutate your private state behind your back.",
        "Over-encapsulating — wrapping a plain value object with no rules in layers of ceremony adds noise for nothing.",
        "Treating `private` as security — it stops accidents and enforces design, but it isn't a defense against a determined attacker.",
      ],
    },

    furtherReading: [
      {
        label: "Wikipedia — Encapsulation (computer programming)",
        href: "https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)",
        note: "A broad overview of the concept and how it relates to information hiding across languages.",
        kind: "article",
      },
      {
        label: "MDN — Private properties",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties",
        note: "How JavaScript's `#name` private fields work — truly hidden, not just convention.",
        kind: "docs",
      },
      {
        label: "Oracle — Controlling Access to Members of a Class",
        href: "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html",
        note: "The definitive table of Java access modifiers: private, package-private, protected, public.",
        kind: "docs",
      },
      {
        label: "Python docs — property",
        href: "https://docs.python.org/3/library/functions.html#property",
        note: "How to add validating getters and setters in Python without changing the public attribute syntax.",
        kind: "docs",
      },
      {
        label: "Refactoring.guru — Encapsulate Field",
        href: "https://refactoring.guru/encapsulate-field",
        note: "A step-by-step refactoring that turns a public field into a private one behind accessors.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "en-q1",
        question: "What is the core purpose of encapsulation?",
        options: [
          { id: "a", label: "To make code run faster by hiding fields." },
          { id: "b", label: "To hide an object's data behind methods so it protects its own rules." },
          { id: "c", label: "To let any code change any field directly." },
          { id: "d", label: "To remove all methods from a class." },
        ],
        correctOptionId: "b",
        explanation:
          "Encapsulation keeps data private and exposes guard methods, so the object stays in control of its own state and outside code can't put it in a broken state.",
      },
      {
        id: "en-q2",
        question:
          "A `BankAccount` has a private `balance` and a `withdraw(amount)` method that rejects amounts greater than the balance. Why keep `balance` private?",
        options: [
          { id: "a", label: "Private fields use less memory." },
          { id: "b", label: "So callers must go through `withdraw`, which enforces the `balance >= 0` invariant." },
          { id: "c", label: "Private fields are encrypted and secure from attackers." },
          { id: "d", label: "It's required by every programming language." },
        ],
        correctOptionId: "b",
        explanation:
          "If `balance` were public, any code could set it negative. Keeping it private forces all changes through `withdraw`, whose check guarantees the balance never goes below zero.",
      },
      {
        id: "en-q3",
        question:
          "Which getter/setter pair actually *adds value* over a plain public field?",
        options: [
          { id: "a", label: "A setter that does `this._x = value;` with no checks." },
          { id: "b", label: "A getter and a setter that both just mirror the field exactly." },
          { id: "c", label: "A setter that validates the input (e.g. rejects negatives) before writing." },
          { id: "d", label: "No getters or setters at all, with the field left public." },
        ],
        correctOptionId: "c",
        explanation:
          "The point of a setter is the checkpoint. One that validates before writing protects the invariant; one that blindly mirrors the field is just a public field in disguise.",
      },
      {
        id: "en-q4",
        question: "How do encapsulation and abstraction differ?",
        options: [
          { id: "a", label: "They're two names for the same thing." },
          { id: "b", label: "Encapsulation hides complexity; abstraction hides data." },
          { id: "c", label: "Encapsulation hides and protects data; abstraction hides complexity behind a simple interface." },
          { id: "d", label: "Abstraction only applies to private fields." },
        ],
        correctOptionId: "c",
        explanation:
          "Encapsulation is about who can touch the data (private fields behind guard methods). Abstraction is about what you must know — a simple interface over messy internals.",
      },
    ],
  },
};
