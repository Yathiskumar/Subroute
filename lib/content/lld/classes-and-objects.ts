import type { RoadmapLesson } from "@/lib/content/types";

export const classesAndObjects: RoadmapLesson = {
  title: "Classes & Objects",
  oneLiner:
    "A class is the blueprint; objects are the real things you build from it. Master this and the rest of OOP clicks into place.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/classes-and-objects.html",
  content: {
    prototypeCaption:
      "On the left is the `Car` class — one blueprint. Press **Build a car** to stamp out objects from it. Each car you create gets its *own* color and speed, but they all share the same methods. Hit accelerate on one and watch only that car move — that's independent object state.",

    overview: [
      {
        type: "p",
        text: "Almost everything in object-oriented design starts here. A **class** is a blueprint — it describes *what something is* and *what it can do*, but it isn't a real thing yet. An **object** is a concrete thing built from that blueprint, living in memory with its own data.",
      },
      {
        type: "p",
        text: "Think of a cookie cutter and cookies. The cutter (the class) defines the shape once. Every cookie (an object) is stamped from it — same shape, but each is its own cookie you can decorate differently. You design the cutter one time and stamp out as many cookies as you need.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A class is written **once**, by you, at design time. Objects are created **many** times, while the program runs. One blueprint, many instances.",
      },
    ],

    howItWorks: [
      { type: "h", text: "What's inside a class" },
      {
        type: "p",
        text: "A class bundles two things that belong together — data and the behavior that acts on that data:",
      },
      {
        type: "ul",
        items: [
          "**Fields** (also called attributes or properties) — the data each object carries. For a `Car`: its `color`, `brand`, and current `speed`.",
          "**Methods** — the actions an object can perform. For a `Car`: `accelerate()`, `brake()`, `describe()`. Methods usually read or change the object's own fields.",
        ],
      },
      { type: "h", text: "The constructor: how an object is born" },
      {
        type: "p",
        text: "When you write `new Car(\"red\", \"Tesla\")`, a special method called the **constructor** runs. Its job is to set up a brand-new object — taking the values you pass in and storing them in the new object's fields, so it starts life in a valid state.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "car.ts",
        code: `class Car {
  // fields — every car gets its own copy of these
  color: string;
  brand: string;
  speed: number;

  // constructor — runs once, when the object is created
  constructor(color: string, brand: string) {
    this.color = color;
    this.brand = brand;
    this.speed = 0; // every new car starts parked
  }

  // methods — defined once, shared by every car
  accelerate(amount: number) {
    this.speed += amount;
  }

  brake() {
    this.speed = 0;
  }
}

const a = new Car("red", "Tesla");
const b = new Car("blue", "Toyota");
a.accelerate(30); // only 'a' speeds up → a.speed = 30, b.speed = 0`,
      },
      { type: "h", text: "Each object has its own state" },
      {
        type: "p",
        text: "This is the part beginners miss. `a` and `b` are both cars, but they're separate objects. Changing `a` does *nothing* to `b`. Each object keeps its own private copy of the fields — its own *state*. That independence is exactly why objects are so useful for modeling many real-world things at once.",
      },
      {
        type: "h",
        text: "The word `this`",
      },
      {
        type: "p",
        text: "Inside a method, `this` means *the specific object the method was called on*. When you write `a.accelerate(30)`, inside `accelerate` the word `this` refers to `a`. Call `b.accelerate(5)` and now `this` is `b`. One method definition, but it always acts on whichever object you called it on.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Instance vs. static — a quick peek",
        text: "Fields like `speed` belong to each object (instance state). Sometimes you want data shared across *all* objects of a class — like a running count of how many cars exist. That's a **static** member, and it lives on the class itself, not on any one object. The prototype tracks `Car.totalBuilt` to show this.",
      },
    ],

    handsOn: [
      {
        title: "01 · One blueprint, many cars",
        body: "Press **Build a car** a few times. Notice you wrote the class only once, yet each press produces a brand-new object with its own color. That's the blueprint-to-instance relationship in action.",
      },
      {
        title: "02 · Prove state is independent",
        body: "Build two cars. Click **accelerate** on the first one only. Watch its `speed` climb while the second car stays at `0`. Changing one object never touches the other — each holds its own state.",
      },
      {
        title: "03 · Static vs instance",
        body: "Keep an eye on `Car.totalBuilt` at the top of the class card. It goes up every time *any* car is created, because it lives on the class — not on a single object. Compare that to `speed`, which is per-car.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "bank-account.ts",
        code: `// Same idea, a different domain. Pick your language above.
class BankAccount {
  private balance: number;

  constructor(public owner: string, opening: number) {
    this.balance = opening; // each account gets its own balance
  }

  deposit(amount: number) {
    this.balance += amount;
  }

  withdraw(amount: number) {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
  }

  getBalance() {
    return this.balance;
  }
}

const alice = new BankAccount("Alice", 100);
const bob = new BankAccount("Bob", 0);
alice.deposit(50);   // alice → 150
bob.withdraw(10);    // throws — bob's own balance is 0
// alice and bob are independent objects of the same class.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "BankAccount.java",
        code: `// Same idea, a different domain. Pick your language above.
class BankAccount {
    private final String owner;
    private double balance;

    BankAccount(String owner, double opening) {
        this.owner = owner;
        this.balance = opening; // each account gets its own balance
    }

    void deposit(double amount) {
        this.balance += amount;
    }

    void withdraw(double amount) {
        if (amount > this.balance)
            throw new IllegalStateException("Insufficient funds");
        this.balance -= amount;
    }

    double getBalance() {
        return this.balance;
    }
}

BankAccount alice = new BankAccount("Alice", 100);
BankAccount bob = new BankAccount("Bob", 0);
alice.deposit(50);   // alice → 150
bob.withdraw(10);    // throws — bob's own balance is 0
// alice and bob are independent objects of the same class.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "bank_account.py",
        code: `# Same idea, a different domain. Pick your language above.
class BankAccount:
    def __init__(self, owner: str, opening: float):
        self.owner = owner
        self._balance = opening  # each account gets its own balance

    def deposit(self, amount: float) -> None:
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount

    def get_balance(self) -> float:
        return self._balance


alice = BankAccount("Alice", 100)
bob = BankAccount("Bob", 0)
alice.deposit(50)    # alice → 150
bob.withdraw(10)     # raises — bob's own balance is 0
# alice and bob are independent objects of the same class.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "bank_account.cpp",
        code: `// Same idea, a different domain. Pick your language above.
#include <stdexcept>
#include <string>

class BankAccount {
    std::string owner;
    double balance;

public:
    BankAccount(std::string owner, double opening)
        : owner(std::move(owner)), balance(opening) {} // own balance per object

    void deposit(double amount) { balance += amount; }

    void withdraw(double amount) {
        if (amount > balance)
            throw std::runtime_error("Insufficient funds");
        balance -= amount;
    }

    double getBalance() const { return balance; }
};

BankAccount alice("Alice", 100);
BankAccount bob("Bob", 0);
alice.deposit(50);   // alice → 150
bob.withdraw(10);    // throws — bob's own balance is 0
// alice and bob are independent objects of the same class.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to model something as a class" },
      {
        type: "ul",
        items: [
          "When you have a **thing** with data *and* behavior that belong together — a `User`, an `Order`, a `Car`, a `Game`.",
          "When you'll have **many** of that thing, each with its own state — thousands of users, hundreds of orders.",
          "When you want to **hide the details** and expose a clean set of actions (methods) instead of letting outside code poke at raw fields.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't over-class everything",
        text: "Not every bit of code needs a class. A pure calculation with no state is often just a function. Reach for a class when there's *state to hold* and *behavior that belongs with it* — that's the sweet spot.",
      },
    ],

    tradeoffs: {
      pros: [
        "Bundles data with the behavior that uses it — related code lives in one place.",
        "One blueprint produces unlimited objects, each with independent state.",
        "Methods give you a clean, named interface instead of scattered raw data access.",
        "It's the foundation every other OOP idea (inheritance, polymorphism, patterns) builds on.",
      ],
      cons: [
        "Confusing the class with the object — the blueprint is not the cookie.",
        "Forgetting each object has its own state, and accidentally sharing data that should be per-object.",
        "Putting everything in the constructor, or letting one class do far too much (a 'God object').",
        "Exposing fields directly instead of guarding them behind methods.",
      ],
    },

    furtherReading: [
      {
        label: "MDN — Classes (JavaScript)",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes",
        note: "Clear, example-driven reference for class syntax, constructors, fields, and methods.",
        kind: "docs",
      },
      {
        label: "Oracle — Object-Oriented Programming Concepts",
        href: "https://docs.oracle.com/javase/tutorial/java/concepts/index.html",
        note: "The classic Java tutorial that introduces classes and objects from first principles.",
        kind: "docs",
      },
      {
        label: "Python docs — Classes",
        href: "https://docs.python.org/3/tutorial/classes.html",
        note: "Same concepts in Python — useful to see how the ideas translate across languages.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Object-oriented programming",
        href: "https://en.wikipedia.org/wiki/Object-oriented_programming",
        note: "A broad map of where classes and objects sit within the wider OOP landscape.",
        kind: "article",
      },
      {
        label: "Head First Object-Oriented Analysis & Design",
        note: "A beginner-friendly book that builds intuition for designing with classes.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "co-q1",
        question: "Which statement best describes the difference between a class and an object?",
        options: [
          { id: "a", label: "They're two words for the same thing." },
          { id: "b", label: "A class is the blueprint; an object is a concrete instance built from it." },
          { id: "c", label: "An object is the blueprint; a class is the instance." },
          { id: "d", label: "A class holds data; an object holds methods." },
        ],
        correctOptionId: "b",
        explanation:
          "A class is the design written once. An object (instance) is a real thing created from that design while the program runs, with its own data.",
      },
      {
        id: "co-q2",
        question: "What does the `new` keyword do in `new Car(\"red\", \"Tesla\")`?",
        options: [
          { id: "a", label: "It edits the Car class definition." },
          { id: "b", label: "It deletes the previous Car object." },
          { id: "c", label: "It creates a new object and runs the constructor to initialize it." },
          { id: "d", label: "It renames the Car class to \"red\"." },
        ],
        correctOptionId: "c",
        explanation:
          "`new` allocates a fresh object and calls the constructor, which stores the passed-in values into the new object's fields so it starts in a valid state.",
      },
      {
        id: "co-q3",
        question:
          "You create two cars, `a` and `b`, then call `a.accelerate(30)`. What is `b.speed`?",
        options: [
          { id: "a", label: "30 — methods affect every object of the class." },
          { id: "b", label: "0 — each object has its own independent state." },
          { id: "c", label: "15 — the change is split between the two cars." },
          { id: "d", label: "It throws an error." },
        ],
        correctOptionId: "b",
        explanation:
          "`a` and `b` are separate objects with their own fields. Changing `a`'s speed never touches `b`. Independent state per object is the whole point.",
      },
      {
        id: "co-q4",
        question:
          "A `Car` class has a `speed` field and a `Car.totalBuilt` counter that increases each time any car is created. Which is which?",
        options: [
          { id: "a", label: "Both are instance fields, one per object." },
          { id: "b", label: "Both are static, shared by all cars." },
          { id: "c", label: "`speed` is per-object (instance); `totalBuilt` is shared (static)." },
          { id: "d", label: "`speed` is shared (static); `totalBuilt` is per-object (instance)." },
        ],
        correctOptionId: "c",
        explanation:
          "`speed` is instance state — each car has its own. `totalBuilt` describes the class as a whole, so it lives on the class as a static member shared by all objects.",
      },
    ],
  },
};
