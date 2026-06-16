import type { RoadmapLesson } from "@/lib/content/types";

export const staticVsInstance: RoadmapLesson = {
  title: "Static vs Instance Members",
  oneLiner:
    "Instance members belong to each object (one copy per object); static members belong to the class itself (one shared copy for all).",
  difficulty: "beginner",
  estimatedTime: "10 min",
  prototypePath: "/prototypes/lld/static-vs-instance.html",
  content: {
    prototypeCaption:
      "The `Employee` class card holds one *shared* box — `Employee.company` — that belongs to the class. Press **Hire employee** to stamp instance cards, each with its *own* `name` and `salary`. Give one employee a raise and only *that* card changes; **rebrand the company** and *every* card updates at once. One shared box vs many own boxes.",

    overview: [
      {
        type: "p",
        text: "Some data belongs to **each object**, and some data belongs to **the class as a whole**. An **instance member** gets a fresh copy for every object you create — your `name`, your `salary`. A **static member** exists exactly **once**, on the class itself, and every object shares that single copy.",
      },
      {
        type: "p",
        text: "Picture a company. Each employee has their *own* name badge and *own* salary — change yours and mine is untouched. But there's *one* company name printed on the wall that everyone shares. Rename the company and it changes for *all* of you at once, because there was only ever one of it. Instance = your own badge; static = the sign on the wall.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Instance members live on the **object** (one per object); static members live on the **class** (one for everyone). You reach an instance member through an object (`alice.salary`), and a static member through the class (`Employee.company`).",
      },
    ],

    howItWorks: [
      { type: "h", text: "Instance members: one copy per object" },
      {
        type: "p",
        text: "An **instance field** is declared on the class but *allocated per object* — every `new Employee(...)` gets its own slot for `name` and `salary`. Inside a method, you reach the current object's own copy through `this`: `this.salary`. Calling `alice.giveRaise()` touches **only** Alice's `salary`; Bob's is completely separate. That independence is the whole point of objects.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "instance.ts",
        code: `class Employee {
  name: string;
  salary: number; // instance field — one per object

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary; // each object gets its OWN salary
  }

  giveRaise(amount: number) {
    this.salary += amount; // 'this' = the specific object
  }
}

const alice = new Employee("Alice", 100);
const bob   = new Employee("Bob", 90);
alice.giveRaise(10); // alice.salary → 110, bob.salary still 90`,
      },
      { type: "h", text: "Static members: one copy, shared by all" },
      {
        type: "p",
        text: "A **static member** belongs to the class, not to any object. There is exactly **one** copy no matter how many objects exist — or even if *zero* exist. You don't need `this`, because there's no particular object involved; you call it on the class name itself, like `Employee.company` or `Employee.headcount()`. Change it once and every object that reads it sees the new value, because they're all reading the *same single box*.",
      },
      {
        type: "ul",
        items: [
          "**Static field** — shared data: a company name, a configuration constant, a running counter of how many objects exist.",
          "**Static method** — behavior that doesn't need a specific object: a factory like `Employee.fromCsv(...)`, or a helper like `Math.max(...)`.",
          "No `this` — a static method can't read `this.salary`, because *which* object's salary would it mean? There isn't one.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        filename: "static.ts",
        code: `class Employee {
  static company = "Acme";   // ONE shared box for every employee
  static count = 0;          // a static counter

  name: string;
  constructor(name: string) {
    this.name = name;
    Employee.count++;        // bump the shared counter on each hire
  }

  static headcount() {       // static method — no 'this'
    return Employee.count;
  }
}

const a = new Employee("Alice");
const b = new Employee("Bob");
Employee.company = "Globex"; // change ONCE → every employee sees "Globex"
Employee.headcount();        // 2 — read off the class, not an object`,
      },
      { type: "h", text: "When static makes sense" },
      {
        type: "p",
        text: "Static shines when the data or behavior truly belongs to the *concept*, not to any one object: a **counter** of live instances, a **factory method** that builds objects, a **constant** like `Math.PI`, or a stateless **utility** function. The test: ask \"would this value differ from object to object?\" If no — it's static.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The classic gotcha: static is shared mutable state",
        text: "A mutable static field is effectively a **global variable** wearing a class's clothes. Because *everyone* shares the one copy, a change anywhere is visible everywhere — which makes behavior depend on hidden, order-sensitive state that's hard to test and unsafe across threads. Use static state sparingly, and prefer it for *constants* and *counters*, not for things that change in surprising ways.",
      },
    ],

    handsOn: [
      {
        title: "01 · Give a raise — only one box changes",
        body: "Two employees are seeded on load. Click **give raise** on just one card and watch *only* that employee's `salary` climb while the other stays put. The console narrates `instance: alice.salary 100→110 (only alice)`. Each object owns its own `salary`.",
      },
      {
        title: "02 · Rebrand the company — every box changes",
        body: "Type a new name into the class-level **Rebrand company** field and press the button. Notice that `Employee.company` updates *and* every employee card instantly shows the new company. The console logs `static: Employee.company → 'Globex' (all employees updated)`. There's only one shared copy.",
      },
      {
        title: "03 · Watch the static counter",
        body: "Press **Hire employee** and keep an eye on `Employee.headcount` in the class card — it ticks up on every hire because the counter lives on the class, not on any one object. Compare it to `salary`, which is per-employee. Counter = static; salary = instance.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "employee.ts",
        code: `// static = shared by the class · instance = per object. Pick a language above.
class Employee {
  static company = "Acme";   // ONE shared copy for every employee
  static headcount = 0;      // a static counter

  // instance fields — one copy PER object
  constructor(public name: string, public salary: number) {
    Employee.headcount++;    // bump the shared counter on each hire
  }

  giveRaise(amount: number) {
    this.salary += amount;   // 'this' → only THIS employee's salary
  }

  // static method — no 'this'; called on the class
  static rebrand(name: string) {
    Employee.company = name; // changes the shared copy for everyone
  }
}

const alice = new Employee("Alice", 100);
const bob   = new Employee("Bob", 90);
alice.giveRaise(10);         // alice.salary → 110, bob still 90 (own box)
Employee.rebrand("Globex");  // every employee now reports "Globex" (shared)
Employee.headcount;          // 2 — read off the class itself`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Employee.java",
        code: `// static = shared by the class · instance = per object. Pick a language above.
class Employee {
    static String company = "Acme"; // ONE shared copy for every employee
    static int headcount = 0;       // a static counter

    private final String name;      // instance fields — one PER object
    private int salary;

    Employee(String name, int salary) {
        this.name = name;
        this.salary = salary;
        headcount++;                // bump the shared counter on each hire
    }

    void giveRaise(int amount) {
        this.salary += amount;      // 'this' → only THIS employee's salary
    }

    static void rebrand(String name) { // static method — no 'this'
        company = name;             // changes the shared copy for everyone
    }
}

Employee alice = new Employee("Alice", 100);
Employee bob   = new Employee("Bob", 90);
alice.giveRaise(10);            // alice.salary → 110, bob still 90 (own box)
Employee.rebrand("Globex");     // every employee now reports "Globex" (shared)
// Employee.headcount → 2 — read off the class itself`,
      },
      {
        label: "Python",
        language: "python",
        filename: "employee.py",
        code: `# static = shared by the class · instance = per object. Pick a language above.
class Employee:
    company = "Acme"        # class attribute — ONE shared copy for all
    headcount = 0           # a static counter

    def __init__(self, name: str, salary: int):
        self.name = name    # instance attributes — one PER object
        self.salary = salary
        Employee.headcount += 1  # bump the shared counter on each hire

    def give_raise(self, amount: int) -> None:
        self.salary += amount    # 'self' → only THIS employee's salary

    @classmethod
    def rebrand(cls, name: str) -> None:  # no instance; acts on the class
        cls.company = name       # changes the shared copy for everyone

    @staticmethod
    def is_valid_salary(salary: int) -> bool:  # no self, no cls
        return salary > 0


alice = Employee("Alice", 100)
bob   = Employee("Bob", 90)
alice.give_raise(10)        # alice.salary → 110, bob still 90 (own box)
Employee.rebrand("Globex")  # every employee now reports "Globex" (shared)
print(Employee.headcount)   # 2 — read off the class itself`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "employee.cpp",
        code: `// static = shared by the class · instance = per object. Pick a language above.
#include <string>

class Employee {
public:
    static std::string company; // ONE shared copy — declared here...
    static int headcount;       // a static counter

    std::string name;           // instance fields — one PER object
    int salary;

    Employee(std::string name, int salary)
        : name(std::move(name)), salary(salary) {
        ++headcount;            // bump the shared counter on each hire
    }

    void giveRaise(int amount) { salary += amount; } // only THIS object

    static void rebrand(const std::string& n) { // static method — no 'this'
        company = n;            // changes the shared copy for everyone
    }
};

// ...and DEFINED once, out of class (each static needs one definition)
std::string Employee::company = "Acme";
int Employee::headcount = 0;

// Employee alice("Alice", 100); alice.giveRaise(10); // alice only
// Employee::rebrand("Globex");  // every employee now reports "Globex"
// Employee::headcount;          // read off the class itself`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a static member when…" },
      {
        type: "ul",
        items: [
          "The value is **the same for every object** and belongs to the concept, not an instance — a company name, an app-wide config, a constant like `Math.PI`.",
          "You're counting instances or holding a **shared registry** — `Employee.headcount`, a cache, a connection pool.",
          "You need a **factory method** that builds objects before any object exists — `User.fromJson(...)`, `Logger.getInstance()`.",
          "The function is a **pure utility** with no per-object state — `Math.max(a, b)`, `StringUtils.capitalize(s)`.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Default to instance; promote to static deliberately",
        text: "If a value could ever differ between two objects, it's **instance** data — keep it on the object. Reach for *mutable* static state only when the sharing is genuinely intended, because once it's static, every object is coupled to that single copy.",
      },
    ],

    tradeoffs: {
      pros: [
        "One source of truth for data that's truly shared — change it once, everyone sees it.",
        "No memory wasted on a duplicate copy in every object; constants and config live in a single place.",
        "Factory methods and utilities are reachable without first creating an object.",
        "Static counters and registries give the class a clean, central place to track all its instances.",
      ],
      cons: [
        "Mutable static state is hidden global state — any code can change it and every object is affected.",
        "Hard to test and mock: tests share the one static value, so state leaks between them and order starts to matter.",
        "Not thread-safe by default — concurrent writes to a shared static field can corrupt it without explicit synchronization.",
        "Encourages tight coupling: callers depend on a global class rather than on an object they were handed.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Understanding Class Members",
        href: "https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html",
        note: "The canonical Java tutorial on static (class) vs instance fields and methods, with clear before/after examples.",
        kind: "docs",
      },
      {
        label: "MDN — static (JavaScript)",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static",
        note: "Reference for static fields and methods in JavaScript classes — called on the class, not on instances.",
        kind: "docs",
      },
      {
        label: "Python docs — classmethod",
        href: "https://docs.python.org/3/library/functions.html#classmethod",
        note: "How `@classmethod` (and `@staticmethod`) define behavior on the class itself rather than on instances.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Class variable",
        href: "https://en.wikipedia.org/wiki/Class_variable",
        note: "A language-agnostic overview of class (static) variables versus instance variables and why the distinction matters.",
        kind: "article",
      },
      {
        label: "Refactoring.Guru — Singleton",
        href: "https://refactoring.guru/design-patterns/singleton",
        note: "A common (and often criticized) use of static state — useful to see both its appeal and its global-state pitfalls.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "si-q1",
        question:
          "You create `alice` and `bob` from `Employee`, then call `alice.giveRaise(10)`. What happens to `bob.salary`?",
        options: [
          { id: "a", label: "It increases by 10 too — salary is shared." },
          { id: "b", label: "It is unchanged — each object has its own salary." },
          { id: "c", label: "It is reset to 0." },
          { id: "d", label: "It throws an error." },
        ],
        correctOptionId: "b",
        explanation:
          "`salary` is an instance field, so each object has its own copy. `alice.giveRaise(10)` touches only Alice's salary through `this`; Bob's is completely separate.",
      },
      {
        id: "si-q2",
        question:
          "`Employee.company` is a static field set to \"Acme\". You change it to \"Globex\". What do existing employee objects report as their company?",
        options: [
          { id: "a", label: "\"Acme\" — they each kept their original copy." },
          { id: "b", label: "Some say \"Acme\", some say \"Globex\", depending on when they were created." },
          { id: "c", label: "\"Globex\" — there is one shared copy and they all read it." },
          { id: "d", label: "Nothing — static fields can't be read from objects." },
        ],
        correctOptionId: "c",
        explanation:
          "A static field exists once on the class. Every object reads that same single copy, so changing `Employee.company` is instantly visible to all employees.",
      },
      {
        id: "si-q3",
        question: "Why can't a static method use `this`?",
        options: [
          { id: "a", label: "Because `this` is reserved for constructors only." },
          { id: "b", label: "Because a static method is called on the class, with no particular object to refer to." },
          { id: "c", label: "Because static methods can't take parameters." },
          { id: "d", label: "It actually can — `this` points to the class." },
        ],
        correctOptionId: "b",
        explanation:
          "A static method belongs to the class, not to any instance. There's no specific object in play, so there's nothing for `this` to mean — it operates on the class itself.",
      },
      {
        id: "si-q4",
        question: "Which is the biggest risk of using a mutable static field?",
        options: [
          { id: "a", label: "It uses more memory than instance fields." },
          { id: "b", label: "It becomes hidden global state — shared, hard to test, and not thread-safe by default." },
          { id: "c", label: "It can only be read once before it's destroyed." },
          { id: "d", label: "It prevents the class from having any instance fields." },
        ],
        correctOptionId: "b",
        explanation:
          "A mutable static field is effectively a global variable: every object shares the one copy, so changes ripple everywhere, tests leak state into each other, and concurrent writes are unsafe without synchronization.",
      },
    ],
  },
};
