import type { RoadmapLesson } from "@/lib/content/types";

export const singleResponsibility: RoadmapLesson = {
  title: "Single Responsibility Principle (SRP)",
  oneLiner:
    "The \"S\" in SOLID: a class should have only one reason to change — that is, it should answer to just one person or part of the business. Mix two jobs in one class and a change to either one can break the other.",
  difficulty: "beginner",
  estimatedTime: "16 min",
  prototypePath: "/prototypes/lld/single-responsibility.html",
  content: {
    prototypeCaption:
      "A hands-on sorter. You start with a `god class` called `Employee` holding six methods that secretly belong to three different bosses — **Accounting**, **Database**, and **Reporting**. Click a method, then click the bucket you think owns it; a single fixed note tells you whether it fits and *which boss would ask to change it*. A live **reasons to change** counter shows the god class stuck at 3. Sort all six correctly and the prototype reveals the refactor: three focused classes, each with the counter dropped to **1**. Only one note ever shows, so nothing scrolls or grows the page.",

    overview: [
      {
        type: "p",
        text: "The **Single Responsibility Principle** says: *a class should do one job, and have one reason to change.* It is the **S** in **SOLID**, the first of five rules for keeping object-oriented code easy to change. The idea is small but powerful — when a class only does one thing, you always know where to look, and a change in one place can't accidentally break something unrelated.",
      },
      {
        type: "p",
        text: "Picture a restaurant where one person is the chef *and* the accountant *and* the dishwasher. When the menu changes, the tax rules change, and the dishwasher breaks, *the same overloaded person* has to deal with all three — and a mistake while doing the books might leave the kitchen unattended. A well-run restaurant gives each job to a dedicated person. SRP asks you to design classes the same way: one clear job each, so the people who care about that job have exactly one place to go.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "**A class should have only one reason to change** — meaning it should be answerable to one *actor* (one person or part of the business). If you can describe what a class does without using the word *\"and\"*, you're probably following SRP.",
      },
    ],

    howItWorks: [
      { type: "h", text: "\"One reason to change\" really means \"one actor\"" },
      {
        type: "p",
        text: "Beginners first hear SRP as *“a class should do one thing,”* which is fuzzy — *how big is one thing?* Robert C. Martin (Uncle Bob), who named the principle, later sharpened it: **a module should be responsible to one, and only one, actor.** An *actor* is the group of people who would ask for a change — a stakeholder, a department, a role. The real question isn't *“how many things does this class do?”* but *“how many different people would ever ask me to change it?”* If the answer is more than one, the class is doing too much.",
      },
      {
        type: "p",
        text: "Why does the *actor* matter more than the *count of methods*? Because changes come *from people*. If Accounting changes how pay is calculated and the DBA changes how data is stored, those two requests should never collide inside the same class. When they do, fixing one risks breaking the other — and that's exactly the bug SRP is designed to prevent.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 360" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A god class named Employee, holding calculatePay, saveToDatabase and generateReport, being split by an arrow into three focused classes: PayCalculator with calculatePay, EmployeeRepository with saveToDatabase, and ReportFormatter with generateReport.">
  <defs>
    <marker id="srp-arrow" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="11" refX="9" refY="4" orient="auto"><path d="M1,0 L11,4 L1,8" fill="none" stroke="#fb863a" stroke-width="1.6"/></marker>
  </defs>

  <!-- ===== god class (left) ===== -->
  <rect x="24" y="96" width="216" height="168" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.6"/>
  <line x1="24" y1="134" x2="240" y2="134" stroke="rgba(251,134,58,0.55)" stroke-width="1"/>
  <text x="132" y="120" text-anchor="middle" font-size="14" font-weight="700" fill="#e8e4dc">Employee</text>
  <text x="132" y="80" text-anchor="middle" font-size="11" fill="#fb863a">god class · 3 reasons to change</text>
  <g font-size="12">
    <text x="40" y="162"><tspan fill="#fb863a">+</tspan><tspan fill="#e8e4dc"> calculatePay()</tspan></text>
    <text x="40" y="190"><tspan fill="#fb863a">+</tspan><tspan fill="#e8e4dc"> saveToDatabase()</tspan></text>
    <text x="40" y="218"><tspan fill="#fb863a">+</tspan><tspan fill="#e8e4dc"> generateReport()</tspan></text>
  </g>
  <g font-size="10" fill="#9099a8">
    <text x="40" y="240">answers to 3 different bosses</text>
  </g>

  <!-- ===== split arrow ===== -->
  <line x1="252" y1="180" x2="316" y2="180" stroke="#fb863a" stroke-width="1.6" marker-end="url(#srp-arrow)"/>
  <text x="284" y="170" text-anchor="middle" font-size="10" fill="#9099a8">split</text>

  <!-- ===== three focused classes (right) ===== -->
  <!-- PayCalculator -->
  <rect x="332" y="24" width="232" height="86" rx="6" fill="#14161a" stroke="#2d333d" stroke-width="1.4"/>
  <line x1="332" y1="58" x2="564" y2="58" stroke="#2d333d" stroke-width="1"/>
  <text x="448" y="46" text-anchor="middle" font-size="13" font-weight="700" fill="#e8e4dc">PayCalculator</text>
  <text x="348" y="84"><tspan fill="#fb863a" font-size="12">+</tspan><tspan fill="#e8e4dc" font-size="12"> calculatePay()</tspan></text>
  <text x="592" y="71" font-size="10" fill="#9099a8">1 reason</text>
  <text x="592" y="85" font-size="10" fill="#6b7280">Accounting</text>

  <!-- EmployeeRepository -->
  <rect x="332" y="138" width="232" height="86" rx="6" fill="#14161a" stroke="#2d333d" stroke-width="1.4"/>
  <line x1="332" y1="172" x2="564" y2="172" stroke="#2d333d" stroke-width="1"/>
  <text x="448" y="160" text-anchor="middle" font-size="13" font-weight="700" fill="#e8e4dc">EmployeeRepository</text>
  <text x="348" y="198"><tspan fill="#fb863a" font-size="12">+</tspan><tspan fill="#e8e4dc" font-size="12"> saveToDatabase()</tspan></text>
  <text x="592" y="185" font-size="10" fill="#9099a8">1 reason</text>
  <text x="592" y="199" font-size="10" fill="#6b7280">DBA</text>

  <!-- ReportFormatter -->
  <rect x="332" y="252" width="232" height="86" rx="6" fill="#14161a" stroke="#2d333d" stroke-width="1.4"/>
  <line x1="332" y1="286" x2="564" y2="286" stroke="#2d333d" stroke-width="1"/>
  <text x="448" y="274" text-anchor="middle" font-size="13" font-weight="700" fill="#e8e4dc">ReportFormatter</text>
  <text x="348" y="312"><tspan fill="#fb863a" font-size="12">+</tspan><tspan fill="#e8e4dc" font-size="12"> generateReport()</tspan></text>
  <text x="592" y="299" font-size="10" fill="#9099a8">1 reason</text>
  <text x="592" y="313" font-size="10" fill="#6b7280">Reporting</text>
</svg>`,
        caption:
          "Left: one `Employee` class crams together pay math, database saves, and report formatting — **three reasons to change**, three different bosses. Right: split into `PayCalculator`, `EmployeeRepository`, and `ReportFormatter`, each owned by *one* actor with **one reason to change**. The behaviour is identical; the *responsibility* is now untangled.",
      },
      { type: "h", text: "The classic smell: business logic + persistence + formatting" },
      {
        type: "p",
        text: "The textbook SRP violation is a single class that *computes* something, *saves* it to a database, and *formats* it for a report. Those are three different concerns answering to three different actors — the business rules belong to a domain expert, the storage belongs to a DBA, and the report layout belongs to whoever reads the report. Stuffed into one class, every one of those people is now touching the same file, and a change for any of them can ripple into the others.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The danger isn't ugliness — it's accidental breakage",
        text: "Imagine `Employee.calculatePay()` and `Employee.generateReport()` happen to share a private helper that rounds money. Accounting asks for a rounding change, you tweak the helper, and the *report* — owned by a totally different team — silently changes too. Two actors collided in one class. SRP keeps them in separate classes so their changes can't reach each other.",
      },
      { type: "h", text: "How to spot a violation" },
      {
        type: "ul",
        items: [
          "**The \"and\" test** — if you can't describe the class without *\"and\"* (*“it calculates pay **and** saves to the DB **and** prints reports”*), it has more than one responsibility.",
          "**Methods that change for different reasons** — list *who* would request a change to each method. If two methods would be changed by two different roles, those methods belong in two different classes.",
          "**Mixed vocabulary** — one class talking about money rules, SQL tables, *and* HTML layout is juggling three worlds at once.",
          "**A name that's a grab-bag** — classes called `Manager`, `Helper`, `Util`, or `Processor` often hide several unrelated jobs behind a vague label.",
        ],
      },
      { type: "h", text: "How to fix it: extract one class per responsibility" },
      {
        type: "p",
        text: "The fix is **Extract Class**: pull each responsibility into its own focused class, then have the original object *use* them (often by holding references to them or receiving them via its constructor). The god class either disappears or shrinks into a thin coordinator that simply delegates. You don't lose any behaviour — you just give each job an owner. After the split, the *“who would change this?”* question has exactly one answer per class.",
      },
      {
        type: "callout",
        variant: "info",
        title: "SRP ≠ \"one method per class\"",
        text: "SRP is about **reasons to change**, not method count. A class with ten methods that all serve *one* actor is perfectly fine — that's still one responsibility. The goal is *cohesion* (everything in the class belongs together), not the smallest possible class.",
      },
    ],

    handsOn: [
      {
        title: "01 · Read the god class out loud",
        body: "In the prototype, look at the `Employee` god class before clicking anything. Read its six methods and try the *\"and\" test* out loud: *“it calculates pay AND saves to the database AND formats reports…”*. Notice the **reasons to change** counter pinned at **3** — that number is the whole problem in one digit.",
      },
      {
        title: "02 · Sort each method to its owner",
        body: "Click a method, then click the bucket — **Accounting**, **Database**, or **Reporting** — you think owns it. The fixed note tells you whether it fits and, crucially, *which boss would ask to change it*. Get one wrong on purpose (drop `saveToDatabase` into Accounting) and read why an Accountant would never request that change. Then move it to the right place.",
      },
      {
        title: "03 · Reveal the refactor and watch the counter drop",
        body: "Once all six methods are sorted into the correct actor, the prototype reveals the refactored design: three focused classes, each with its **reasons to change** counter dropped from 3 to **1**. Compare the before and after — same behaviour, but now each class answers to exactly one boss. That drop from 3→1 *is* SRP.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "employee.ts",
        code: `// ───── BEFORE: a god class with three reasons to change ─────
// Accounting owns the pay math, the DBA owns persistence,
// and Reporting owns the report layout — all crammed into one class.
class Employee {
  constructor(public name: string, public hours: number, public rate: number) {}

  calculatePay(): number {            // ← Accounting would change this
    return this.hours * this.rate;
  }
  saveToDatabase(): void {            // ← the DBA would change this
    db.execute("INSERT INTO employees ...");
  }
  generateReport(): string {         // ← Reporting would change this
    return \`Report for \${this.name}: $\${this.calculatePay()}\`;
  }
}

// ───── AFTER: one focused class per actor ─────
class Employee {                     // just the data + identity
  constructor(public name: string, public hours: number, public rate: number) {}
}

class PayCalculator {                // 1 reason to change: Accounting
  calculate(e: Employee): number {
    return e.hours * e.rate;
  }
}

class EmployeeRepository {           // 1 reason to change: the DBA
  save(e: Employee): void {
    db.execute("INSERT INTO employees ...");
  }
}

class ReportFormatter {              // 1 reason to change: Reporting
  format(e: Employee, pay: number): string {
    return \`Report for \${e.name}: $\${pay}\`;
  }
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Employee.java",
        code: `// ───── BEFORE: a god class with three reasons to change ─────
class Employee {
    String name; int hours; double rate;

    double calculatePay() {          // ← Accounting would change this
        return hours * rate;
    }
    void saveToDatabase() {          // ← the DBA would change this
        db.execute("INSERT INTO employees ...");
    }
    String generateReport() {        // ← Reporting would change this
        return "Report for " + name + ": $" + calculatePay();
    }
}

// ───── AFTER: one focused class per actor ─────
class Employee {                     // just the data + identity
    String name; int hours; double rate;
}

class PayCalculator {                // 1 reason to change: Accounting
    double calculate(Employee e) {
        return e.hours * e.rate;
    }
}

class EmployeeRepository {           // 1 reason to change: the DBA
    void save(Employee e) {
        db.execute("INSERT INTO employees ...");
    }
}

class ReportFormatter {              // 1 reason to change: Reporting
    String format(Employee e, double pay) {
        return "Report for " + e.name + ": $" + pay;
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "employee.py",
        code: `from dataclasses import dataclass

# ───── BEFORE: a god class with three reasons to change ─────
class Employee:
    def __init__(self, name, hours, rate):
        self.name, self.hours, self.rate = name, hours, rate

    def calculate_pay(self):          # ← Accounting would change this
        return self.hours * self.rate

    def save_to_database(self):       # ← the DBA would change this
        db.execute("INSERT INTO employees ...")

    def generate_report(self):        # ← Reporting would change this
        return f"Report for {self.name}: \${self.calculate_pay()}"


# ───── AFTER: one focused class per actor ─────
@dataclass
class Employee:                       # just the data + identity
    name: str
    hours: float
    rate: float


class PayCalculator:                  # 1 reason to change: Accounting
    def calculate(self, e: Employee) -> float:
        return e.hours * e.rate


class EmployeeRepository:             # 1 reason to change: the DBA
    def save(self, e: Employee) -> None:
        db.execute("INSERT INTO employees ...")


class ReportFormatter:                # 1 reason to change: Reporting
    def format(self, e: Employee, pay: float) -> str:
        return f"Report for {e.name}: \${pay}"`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "employee.cpp",
        code: `#include <string>

// ───── BEFORE: a god class with three reasons to change ─────
class Employee {
public:
    std::string name; int hours; double rate;

    double calculatePay() {           // ← Accounting would change this
        return hours * rate;
    }
    void saveToDatabase() {           // ← the DBA would change this
        db.execute("INSERT INTO employees ...");
    }
    std::string generateReport() {    // ← Reporting would change this
        return "Report for " + name + ": $" + std::to_string(calculatePay());
    }
};

// ───── AFTER: one focused class per actor ─────
struct Employee {                     // just the data + identity
    std::string name; int hours; double rate;
};

class PayCalculator {                 // 1 reason to change: Accounting
public:
    double calculate(const Employee& e) const {
        return e.hours * e.rate;
    }
};

class EmployeeRepository {            // 1 reason to change: the DBA
public:
    void save(const Employee& e) {
        db.execute("INSERT INTO employees ...");
    }
};

class ReportFormatter {              // 1 reason to change: Reporting
public:
    std::string format(const Employee& e, double pay) const {
        return "Report for " + e.name + ": $" + std::to_string(pay);
    }
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to apply SRP" },
      {
        type: "p",
        text: "Reach for SRP whenever a class starts answering to *more than one actor*: a model that also talks to the database, a service that also formats output, a controller that also holds business rules. It's especially valuable on code that changes often — the more a class is edited, the more painful it is when two unrelated jobs live inside it. In interviews, splitting a god class into focused classes is one of the fastest ways to show clean design instinct.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't over-split into a swarm of tiny classes",
        text: "SRP can be taken too far. If you create a separate class for *every* method, you trade one big tangle for a maze of one-line classes that are hard to follow — premature decomposition. Split when responsibilities answer to **different actors** or change for **different reasons**, not just to make classes smaller. A cohesive class with several related methods is *good* design, not a violation.",
      },
    ],

    tradeoffs: {
      pros: [
        "Changes stay local — a request from one actor touches one class, so you can't accidentally break an unrelated feature.",
        "Easier to read and reason about: each class has a clear, nameable job, so you always know where to look.",
        "Simpler to test — a focused class has fewer dependencies and one purpose, so its unit tests are small and targeted.",
        "Encourages reuse: an extracted `ReportFormatter` or `Repository` can be used by other classes instead of being trapped inside one.",
      ],
      cons: [
        "More classes and files to navigate — the design has more moving parts, which can feel heavier for very small programs.",
        "Easy to over-apply: splitting too aggressively produces a swarm of tiny one-method classes that obscure the flow.",
        "\"Responsibility\" is judgement-based — reasonable engineers disagree on where one actor ends and another begins.",
        "Adds indirection: behaviour that was in one place is now spread across collaborators, so you may jump between files to trace a flow.",
      ],
    },

    furtherReading: [
      {
        label: "The Single Responsibility Principle — Robert C. Martin (Uncle Bob)",
        href: "https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html",
        note: "The author of SRP explains the refined definition in his own words: a module should be responsible to one, and only one, actor. The source to read first.",
        kind: "article",
      },
      {
        label: "SOLID — Wikipedia",
        href: "https://en.wikipedia.org/wiki/SOLID",
        note: "A concise overview of all five SOLID principles, with SRP as the first. Good for seeing where SRP sits among its siblings (OCP, LSP, ISP, DIP).",
        kind: "docs",
      },
      {
        label: "Clean Architecture — Robert C. Martin",
        note: "Chapter 7 ('SRP: The Single Responsibility Principle') is the definitive written treatment, including the 'actor' framing and the classic Employee example used in this lesson.",
        kind: "book",
      },
      {
        label: "A Solid Guide to SOLID Principles — Baeldung",
        href: "https://www.baeldung.com/solid-principles",
        note: "A clear, example-led walkthrough of all five principles in Java, with a focused SRP section showing a before/after refactor.",
        kind: "article",
      },
      {
        label: "SOLID Principles: The Single Responsibility Principle — video",
        href: "https://www.youtube.com/watch?v=UQqY3_6Epbg",
        note: "A short, beginner-friendly video walkthrough of SRP with live code, useful as a second pass after reading.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "single-responsibility-q1",
        question: "According to SRP, what does \"a class should have only one reason to change\" actually mean?",
        options: [
          { id: "a", label: "It should be responsible to only one actor — one person or part of the business that would request a change." },
          { id: "b", label: "It should contain only one method." },
          { id: "c", label: "It should be changed by only one developer on the team." },
          { id: "d", label: "It should only ever be edited once, then frozen." },
        ],
        correctOptionId: "a",
        explanation:
          "Uncle Bob refined SRP to mean a module should be responsible to one, and only one, actor — one stakeholder or role that would ask for a change. It's about the source of change (people), not the method count or which developer edits the file.",
      },
      {
        id: "single-responsibility-q2",
        question:
          "A class `Employee` has `calculatePay()`, `saveToDatabase()`, and `generateReport()`. Why is this an SRP violation?",
        options: [
          { id: "a", label: "Those three methods answer to three different actors (Accounting, the DBA, Reporting), so the class has three reasons to change." },
          { id: "b", label: "The class has three methods, and SRP allows at most two." },
          { id: "c", label: "The methods are public; SRP requires them to be private." },
          { id: "d", label: "It violates SRP only if the methods are longer than ten lines each." },
        ],
        correctOptionId: "a",
        explanation:
          "The problem isn't the number of methods — it's that pay math, persistence, and report formatting belong to three different actors. Each could request a change independently, so the class has three reasons to change and one actor's change can break another's.",
      },
      {
        id: "single-responsibility-q3",
        question: "Which is the best quick test for spotting an SRP violation?",
        options: [
          { id: "a", label: "Try to describe the class in one sentence — if you need the word \"and\" to list its jobs, it likely does too much." },
          { id: "b", label: "Count the lines of code; over 100 lines always violates SRP." },
          { id: "c", label: "Check whether the class name ends in 'Service'." },
          { id: "d", label: "Check whether the class has any private fields." },
        ],
        correctOptionId: "a",
        explanation:
          "The 'and' test is the fastest heuristic: if you can't describe the class without 'and' ('it calculates pay AND saves to the DB AND formats reports'), it's juggling multiple responsibilities. Line count and naming are weaker, indirect signals.",
      },
      {
        id: "single-responsibility-q4",
        question: "What is the standard refactor for fixing an SRP violation?",
        options: [
          { id: "a", label: "Extract Class — pull each responsibility into its own focused class and have the original delegate to them." },
          { id: "b", label: "Make all the methods static so they don't share state." },
          { id: "c", label: "Merge the class with its callers to reduce the number of classes." },
          { id: "d", label: "Mark the class as abstract so it can't be instantiated." },
        ],
        correctOptionId: "a",
        explanation:
          "You fix an SRP violation with Extract Class: move each responsibility into its own class (e.g. PayCalculator, EmployeeRepository, ReportFormatter), then have the original object use them. No behaviour is lost — each job simply gets a single owner.",
      },
      {
        id: "single-responsibility-q5",
        question: "Which statement about applying SRP is correct?",
        options: [
          { id: "a", label: "A cohesive class with several methods that all serve one actor still follows SRP; over-splitting into many tiny classes can hurt." },
          { id: "b", label: "SRP requires exactly one method per class — anything more is a violation." },
          { id: "c", label: "SRP means a class may never depend on any other class." },
          { id: "d", label: "Following SRP guarantees the code runs faster at runtime." },
        ],
        correctOptionId: "a",
        explanation:
          "SRP is about cohesion and reasons to change, not minimizing method count. A class with many related methods serving one actor is fine; splitting every method into its own class is premature decomposition. SRP is a design/maintainability principle, not a performance one.",
      },
    ],
  },
};
