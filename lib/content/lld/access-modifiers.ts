import type { RoadmapLesson } from "@/lib/content/types";

export const accessModifiers: RoadmapLesson = {
  title: "Access Modifiers",
  oneLiner:
    "public / protected / package-private / private control WHO can see a member — the dial that makes encapsulation enforceable.",
  difficulty: "beginner",
  estimatedTime: "10 min",
  prototypePath: "/prototypes/lld/access-modifiers.html",
  content: {
    prototypeCaption:
      "One `Account` class with members tagged at different visibility levels. Pick a **caller context** at the top — *Inside the same class*, *A subclass*, *Same package*, or *Outside world* — and every member row instantly recolors **green** (you can reach it) or **red with a lock** (you can't). Click a blocked member to log exactly why it's off-limits.",

    overview: [
      {
        type: "p",
        text: "Encapsulation says *keep your data hidden and expose a few trusted methods*. But hidden from **whom**? That's the question access modifiers answer. They're the dial on each member of a class that decides who is allowed to see and touch it: the class itself, its subclasses, other code in the same package, or absolutely anyone.",
      },
      {
        type: "p",
        text: "Think of a building with rooms at different clearance levels. The lobby is **public** — anyone walks in. Some rooms are for staff of the same department (**package-private**). A few are for staff *and* trainees who report up the chain (**protected**). And there's a private office that only *you* can enter (**private**). Same building, four levels of access, each door labelled with who may open it.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A member's access modifier names its **audience** — who can reach it. `private` = just this class. `package-private` = this package. `protected` = this package plus subclasses. `public` = everyone.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The four levels, from tightest to widest" },
      {
        type: "p",
        text: "Picture four concentric rings of access. Each level lets in everyone from the tighter levels *plus* one more group:",
      },
      {
        type: "ul",
        items: [
          "**`private`** — visible only inside the *same class*. Not even a subclass can see it. This is the default home for fields.",
          "**package-private** (Java's *default*, written by adding **no** modifier) — visible to the same class *and* any other class in the **same package**. There's no keyword; the absence of one is the signal.",
          "**`protected`** — visible to the same package *and* to **subclasses**, even subclasses in another package. It's `package-private` with an extra door for children.",
          "**`public`** — visible to **anyone, anywhere**. This is the deliberate, advertised front door of your class.",
        ],
      },
      { type: "h", text: "Who can access what" },
      {
        type: "p",
        text: "The clearest way to hold this is a table of *caller context* versus *level*. Reading across a row tells you exactly who's allowed in:",
      },
      {
        type: "ul",
        items: [
          "**Same class** — sees *everything*: `private`, package-private, `protected`, `public`.",
          "**A subclass** (in another package) — sees `protected` and `public`, but **not** `private` and **not** package-private.",
          "**Same package** (not a subclass) — sees package-private, `protected`, and `public`, but **not** `private`.",
          "**Outside world** (different package, not a subclass) — sees `public` *only*. Everything else is locked.",
        ],
      },
      { type: "h", text: "Languages draw the lines differently" },
      {
        type: "p",
        text: "Not every language ships all four levels. Java has the full set: `private`, package-private (no keyword), `protected`, and `public`. TypeScript and C++ have `public`, `protected`, and `private` — there is **no package level**, because neither language has Java-style packages. Python takes a different route entirely: it has no enforced access at all, only *convention*.",
      },
      {
        type: "code",
        language: "python",
        filename: "convention.py",
        code: `class Account:
    region = "EU"        # public by convention
    _audit_log = []      # one underscore: "internal, please don't touch"
    __balance = 0        # two underscores: name-mangled to _Account__balance

# acct._audit_log works, but the _ asks you not to.
# acct.__balance raises AttributeError — Python rewrote the name.`,
      },
      {
        type: "p",
        text: "In Python a single leading underscore like `_audit_log` is a polite *don't touch this* — nothing stops you, it's a gentleman's agreement. A double underscore like `__balance` triggers **name-mangling**: Python secretly renames it to `_Account__balance`, which makes accidental access from outside fail. It's still not true privacy, but it raises the bar.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The golden rule",
        text: "Make every member **as private as possible**, then widen only when a real caller needs it. It's trivial to open access later; it's painful to take it back once code across the codebase depends on it.",
      },
    ],

    handsOn: [
      {
        title: "01 · Start locked down",
        body: "On load the caller context is **Outside world** — only the `public` members (`id`, `getBalance()`) glow green. Everything else shows a red lock. This is what a stranger to your class sees: the advertised front door and nothing more.",
      },
      {
        title: "02 · Switch context and watch the matrix recolor",
        body: "Click through **Inside the same class → A subclass → Same package**. Each switch instantly repaints the rows. Notice `auditLog` (protected) turns green for a subclass, while `region` (package-private) stays red for it — and the explanation line spells out why.",
      },
      {
        title: "03 · Click a blocked member to learn why",
        body: "While in a restricted context, click any red row — say `balance` from a subclass. The log prints `✗ balance is private — not visible from A subclass`. It's the access rule, stated in plain words for the exact case you tried.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "account.ts",
        code: `// TypeScript has public / protected / private — NO package level.
class Account {
  public id: string;            // anyone, anywhere can read this
  protected auditLog: string[]; // this class + any subclass can touch it
  private balance: number;      // only methods inside Account can touch it

  constructor(id: string, opening: number) {
    this.id = id;
    this.auditLog = [];
    this.balance = opening;
  }

  public getBalance(): number {  // public method — the sanctioned read path
    return this.balance;
  }
}

const a = new Account("AC-1", 100);
a.id;            // ✓ public — fine
a.getBalance();  // ✓ public — fine
// a.balance;    // ✗ Property 'balance' is private
// a.auditLog;   // ✗ Property 'auditLog' is protected`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Account.java",
        code: `// Java is the only one of these four with a package level.
public class Account {
    public String id;            // anyone, anywhere
    protected String[] auditLog; // same package + subclasses (even elsewhere)
    String region;               // NO keyword = package-private (same package)
    private double balance;      // this class only

    public Account(String id, double opening) {
        this.id = id;
        this.auditLog = new String[0];
        this.region = "EU";
        this.balance = opening;
    }

    public double getBalance() { // public read path
        return this.balance;
    }
}

// From a class in ANOTHER package, not a subclass:
// acct.id          ✓ public
// acct.region      ✗ region is package-private
// acct.auditLog    ✗ protected, and we're not a subclass
// acct.balance     ✗ private`,
      },
      {
        label: "Python",
        language: "python",
        filename: "account.py",
        code: `# Python enforces nothing — it relies on convention.
class Account:
    def __init__(self, account_id: str, opening: float):
        self.id = account_id        # public by convention
        self._audit_log = []        # one _: "internal, don't touch from outside"
        self.__balance = opening    # two __: name-mangled to _Account__balance

    def get_balance(self) -> float: # the public read path
        return self.__balance


acct = Account("AC-1", 100)
acct.id              # ✓ public
acct.get_balance()   # ✓ public
acct._audit_log      # "works", but the _ asks you not to
# acct.__balance     → AttributeError: name-mangled, so this name doesn't exist
acct._Account__balance  # the mangled name — accessible, but you're cheating`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "account.cpp",
        code: `// C++ has public / protected / private — NO package level.
// Members are grouped under labels, not marked one by one.
#include <string>
#include <vector>

class Account {
public:
    std::string id;                  // anyone, anywhere
    double getBalance() const {      // public read path
        return balance;
    }

protected:
    std::vector<std::string> auditLog; // this class + subclasses

private:
    double balance;                  // this class only

public:
    Account(std::string id, double opening)
        : id(std::move(id)), balance(opening) {}
};

// Account a("AC-1", 100);
// a.id;          // ✓ public
// a.getBalance();// ✓ public
// a.auditLog;    // ✗ protected — not accessible from outside
// a.balance;     // ✗ private — not accessible from outside`,
      },
    ],

    whenToUse: [
      { type: "h", text: "How to pick a level" },
      {
        type: "p",
        text: "Default everything to the tightest level that still works, and widen one notch at a time only when a real caller forces it. Keep fields `private` and let methods guard them. Reach for `protected` only when a subclass genuinely needs to build on a member. Use package-private (in Java) to share helpers within a module without advertising them to the whole world. Make a member `public` only when it's part of the deliberate, supported interface you're willing to keep stable.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Public is a promise",
        text: "Every `public` member is a commitment: callers will depend on it, so changing or removing it later breaks them. Treat your public surface as a contract you have to honor, and keep it as small as you can.",
      },
    ],

    tradeoffs: {
      pros: [
        "Visibility control is what makes encapsulation *enforceable* — `private` turns 'please don't touch' into 'you can't'.",
        "A small public surface is a small contract: less to keep stable, more freedom to change internals.",
        "`protected` lets subclasses extend a class on purpose, without exposing internals to the whole world.",
        "Package-private (in Java) shares helpers within a module while keeping them invisible to outside code.",
      ],
      cons: [
        "Making everything `public` — the most common mistake; it throws away every benefit and locks you into the current layout.",
        "Overusing `protected` — it quietly commits internals to *every* future subclass, an interface that's hard to change.",
        "Leaking internals through a public getter that returns the actual private list or array, so callers mutate your state behind your back.",
        "Confusing Python's convention with enforcement — a leading underscore is a request, not a wall; treating it as security invites surprises.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Controlling Access to Members of a Class",
        href: "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html",
        note: "The definitive Java table of private, package-private, protected, and public — who can access what.",
        kind: "docs",
      },
      {
        label: "TypeScript Handbook — Member Visibility",
        href: "https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility",
        note: "How public, protected, and private work on TypeScript class members (note: no package level).",
        kind: "docs",
      },
      {
        label: "MDN — Private properties",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties",
        note: "JavaScript's `#name` private fields — truly hidden at runtime, the closest the language gets to enforced privacy.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Access modifiers",
        href: "https://en.wikipedia.org/wiki/Access_modifiers",
        note: "A cross-language overview of how different languages model visibility and access control.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "am-q1",
        question:
          "A field is marked `private` in a class. Which caller can read it directly?",
        options: [
          { id: "a", label: "Any subclass of the class." },
          { id: "b", label: "Any other class in the same package." },
          { id: "c", label: "Only code inside the same class." },
          { id: "d", label: "Anyone, anywhere." },
        ],
        correctOptionId: "c",
        explanation:
          "`private` is the tightest level: visible only inside the same class. Not subclasses, not same-package classes, not the outside world.",
      },
      {
        id: "am-q2",
        question:
          "In Java, what does a member with NO access modifier (e.g. `String region;`) mean?",
        options: [
          { id: "a", label: "It's public — no keyword means open to everyone." },
          { id: "b", label: "It's package-private — visible to classes in the same package." },
          { id: "c", label: "It's private — no keyword means hidden." },
          { id: "d", label: "It's a compile error; Java requires a modifier." },
        ],
        correctOptionId: "b",
        explanation:
          "Java's default (the absence of any keyword) is package-private: the member is visible to the same class and to any other class in the same package, but not to outside packages.",
      },
      {
        id: "am-q3",
        question:
          "From a subclass in a *different* package, which member of its parent can it access?",
        options: [
          { id: "a", label: "A `private` member." },
          { id: "b", label: "A package-private member." },
          { id: "c", label: "A `protected` member." },
          { id: "d", label: "None of them — different package blocks everything." },
        ],
        correctOptionId: "c",
        explanation:
          "`protected` extends access to subclasses even across packages. The subclass cannot see `private` (same class only) or package-private (same package only), but it can see `protected` and `public`.",
      },
      {
        id: "am-q4",
        question:
          "Which statement about Python's access control is correct?",
        options: [
          { id: "a", label: "Python enforces `private` strictly, like Java." },
          { id: "b", label: "A single leading underscore is a convention; a double underscore triggers name-mangling, but neither is truly enforced." },
          { id: "c", label: "Python has a `package-private` keyword that Java lacks." },
          { id: "d", label: "Python's `__name` fields are encrypted and unreadable." },
        ],
        correctOptionId: "b",
        explanation:
          "Python relies on convention: `_name` says 'internal, please don't touch', and `__name` is name-mangled to `_Class__name` to discourage accidental access. Neither is real enforcement — a determined caller can still reach in.",
      },
    ],
  },
};
