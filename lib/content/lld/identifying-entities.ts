import type { RoadmapLesson } from "@/lib/content/types";

export const identifyingEntities: RoadmapLesson = {
  title: "Identifying Entities, Attributes & Behaviors",
  oneLiner:
    "Read the spec like a grammar exercise: the nouns become candidate classes and attributes, the verbs become candidate methods — then ruthlessly filter the list down to what really earns a place in the model.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/identifying-entities.html",
  content: {
    prototypeCaption:
      "A short problem statement sits at the top, every meaningful word a clickable **chip**. Click a word and classify it: is it a **Class**, an **Attribute**, a **Method**, or just noise to **Discard**? Correct picks flow into the live **Model** panel — Classes, Attributes, Methods — and the console tells you *why* each call was right or wrong (`'title' → Attribute of Book, not a class`). Watch the **model completeness** meter climb, or hit **Reveal model** to snap to the ideal answer.",

    overview: [
      {
        type: "p",
        text: "Before you can draw a single class diagram, you have to decide *what the classes even are*. The oldest and most reliable trick for that is almost embarrassingly simple: treat the requirements like a sentence-diagramming exercise from school. **The nouns are your candidate classes and attributes; the verbs are your candidate methods.** A `Book`, a `Member`, a `Librarian` — those are nouns, and they smell like classes. *Borrow*, *issue*, *return* — those are verbs, and they smell like methods that live on one of those classes.",
      },
      {
        type: "p",
        text: "Think of it like casting a play from a script. You read the script and circle every character who walks on stage (the nouns → classes), note what each one carries or wears (the nouns that are really *attributes* → fields), and list what each one *does* (the verbs → behaviors). Some words in the script are just scenery or stage directions — they get no role at all. Object modeling works the same way: you extract a long, messy candidate list, then *cut it down* until only the real cast remains.",
      },
      {
        type: "p",
        text: "The catch is that the raw noun list is never the final model. It's full of synonyms, vague words, things that belong *outside* your system, and nouns that are really just *properties* of some other noun. The skill isn't extracting the list — anyone can underline nouns — it's **filtering** it well, and knowing the difference between an entity, an attribute, and a behavior.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "**Nouns → candidate classes and attributes; verbs → candidate methods** — then filter ruthlessly, because the first list is a brainstorm, not a model.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Step 1 — underline the nouns and verbs" },
      {
        type: "p",
        text: "Start with the written requirements and physically mark them up. Underline every **noun** and **noun phrase** — these are your candidate *classes* and *attributes*. Circle every **verb** — these are your candidate *behaviors* (methods). For a small library spec — *\"A member borrows books; each book has a title and an author; a librarian issues and returns books\"* — you'd pull out nouns like `member`, `book`, `title`, `author`, `librarian`, and verbs like `borrow`, `issue`, `return`. This raw extraction is fast and mechanical; don't judge anything yet, just collect.",
      },
      { type: "h", text: "Step 2 — filter the noun list (this is the real work)" },
      {
        type: "p",
        text: "A raw noun list is a brainstorm, not a model. Walk it and *cut* aggressively. Four kinds of nouns should be removed or demoted:",
      },
      {
        type: "ul",
        items: [
          "**Synonyms and duplicates** — if the spec says *patron* in one place and *member* in another, they're the same concept. Keep one name, drop the rest. One concept, one class.",
          "**Nouns that are really attributes of another class** — `title` and `author` aren't classes; they're *fields* of `Book`. The test: does it have its own identity and lifecycle, or is it just a simple value describing something else? `color` is an attribute of `Car`, not a `Color` class.",
          "**Things outside the system boundary** — the spec might mention a `shelf`, a `building`, or the `weather`, but if your system never tracks or manipulates it, it's not in your model. Draw the boundary and discard what's beyond it.",
          "**Vague, redundant, or meta words** — `system`, `data`, `information`, `record`, `thing`, `process`. These are noise that describe the software in general, not domain concepts. Cut them.",
        ],
      },
      { type: "h", text: "Step 3 — entity vs. attribute vs. behavior" },
      {
        type: "p",
        text: "The heart of the whole exercise is telling these three apart. An **entity** (a class) has *identity and a lifecycle* — two `Member` objects are different even if every field matches, and a `Member` is created, changes over time, and eventually leaves. An **attribute** is a *simple value* that describes an entity and has no independent existence — a `title` only means something *as a property of* a `Book`. A **behavior** is a *verb* — something an entity *does* — and becomes a method. Ask of every noun: *\"Does this have its own identity, or is it just describing something else?\"* If it stands on its own, it's a class; if it merely describes, it's an attribute.",
      },
      { type: "h", text: "Step 4 — assign each behavior to the right owner" },
      {
        type: "p",
        text: "A verb is only half a decision — you still have to choose *which class owns the method*. The guiding question is: *\"Whose data does this behavior act on?\"* The verb *issue* in our library is performed by a `Librarian`, but it acts on a `Book` and a `Member`. Information-expert reasoning says put the method on the class that holds the data it needs — so `borrow()` often lives on `Member` (it knows its own borrowed books), while `issue()` and `returnBook()` live on `Librarian`. Misassigning behavior is how you end up with anemic data-bags and a single God class doing all the work.",
      },
      { type: "h", text: "Putting it together: before → after" },
      {
        type: "code",
        language: "typescript",
        code: `// BEFORE — raw noun/verb dump from the spec (a brainstorm, not a model)
//   nouns: member, patron, book, title, author, librarian, system, shelf
//   verbs: borrow, issue, return, has

// FILTER:
//   patron   → synonym of member        → drop
//   title    → attribute of Book        → field, not a class
//   author   → attribute of Book        → field, not a class
//   system   → vague meta-word          → discard
//   shelf    → outside the boundary      → discard
//   has      → not a real behavior       → discard

// AFTER — the refined model
class Book   { title: string; author: string; }
class Member { borrowed: Book[]; borrow(b: Book): void {} }
class Librarian { issue(b: Book, m: Member): void {} returnBook(b: Book): void {} }`,
      },
      { type: "h", text: "Iterate — the first list is never final" },
      {
        type: "p",
        text: "Object discovery is *iterative*, not one-and-done. Your first pass gives a rough cast; building the use cases, sketching collaborations, and writing example flows will reveal a missing class here and a duplicate there. A `Loan` (or `BorrowRecord`) often emerges that wasn't an obvious noun at all but turns out to have real identity — it has a due date and a return date and a lifecycle of its own. Expect to revisit the model several times.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't make every noun a class — that's over-modeling",
        text: "The single most common beginner mistake is promoting *every* noun to a class. A `Color`, a `Title`, an `Address` line, a `Status` — most of these are just attributes. A model drowning in tiny one-field classes is harder to read and reason about than one with a few well-chosen entities holding their own values. When in doubt, ask: *does it have identity and a lifecycle?* If not, it's an attribute.",
      },
      {
        type: "callout",
        variant: "info",
        title: "This feeds directly into class diagrams and CRC cards",
        text: "Noun/verb analysis isn't an academic warm-up — it's the raw input to the next steps. The classes you keep become boxes in a **class diagram**; the attributes fill the middle compartment and the methods the bottom. On **CRC cards** the rule is stated almost verbatim: *nouns become classes, verbs become responsibilities, collaborators are the other classes involved.*",
      },
    ],

    handsOn: [
      {
        title: "01 · Classify a noun into the model",
        body: "In the problem statement, click the word **book**. A picker opens with four buttons — **Class**, **Attribute**, **Method**, **Discard**. Choose **Class**. The chip turns green with a ✓ and `Book` appears in the **Classes** column of the Model panel, while the console logs why it was right. Now try **title**: the ideal answer is **Attribute**, and picking **Class** earns a ✗ with the reason `'title' → Attribute of Book, not a class`.",
      },
      {
        title: "02 · Extract the verbs as methods",
        body: "Click an action word like **borrows**, **issues**, or **returns** and classify it as **Method**. It drops into the **Methods** column and the **model completeness** meter near the top climbs. Then click a noise word such as **system** or **shelf** and choose **Discard** — the console confirms it was correctly cut as a vague meta-word or something outside the system boundary.",
      },
      {
        title: "03 · Reveal the ideal model, then Reset",
        body: "Stuck or curious? Press **Reveal model** to auto-classify every remaining chip into its correct bucket — the completeness meter jumps to 100% and the full Classes / Attributes / Methods model fills in at once. Hit **Reset** to clear every chip back to unclassified and try the extraction yourself from scratch.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "library.ts",
        code: `// Spec: "A member borrows books; each book has a title and author;
//        a librarian issues and returns books."
//
// Nouns → classes/attributes:  Member, Book, (title, author), Librarian
// Verbs → methods:             borrow, issue, return
// Discarded:                   "system", "shelf" (noise / outside boundary)

class Book {
  constructor(
    public title: string,   // attribute, not a class
    public author: string,  // attribute, not a class
  ) {}
}

class Member {
  private borrowed: Book[] = [];
  borrow(book: Book): void {        // verb → method, owned by Member
    this.borrowed.push(book);
  }
}

class Librarian {
  issue(book: Book, to: Member): void {}   // verb → method
  returnBook(book: Book): void {}          // verb → method
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Library.java",
        code: `// Spec: "A member borrows books; each book has a title and author;
//        a librarian issues and returns books."
//
// Nouns -> classes/attributes:  Member, Book, (title, author), Librarian
// Verbs -> methods:             borrow, issue, return

class Book {
    private String title;   // attribute, not a class
    private String author;  // attribute, not a class

    Book(String title, String author) {
        this.title = title;
        this.author = author;
    }
}

class Member {
    private List<Book> borrowed = new ArrayList<>();
    void borrow(Book book) {        // verb -> method, owned by Member
        borrowed.add(book);
    }
}

class Librarian {
    void issue(Book book, Member to) {}   // verb -> method
    void returnBook(Book book) {}         // verb -> method
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "library.py",
        code: `# Spec: "A member borrows books; each book has a title and author;
#        a librarian issues and returns books."
#
# Nouns -> classes/attributes:  Member, Book, (title, author), Librarian
# Verbs -> methods:             borrow, issue, return
# Discarded:                    "system", "shelf" (noise / outside boundary)


class Book:
    def __init__(self, title: str, author: str):
        self.title = title    # attribute, not a class
        self.author = author  # attribute, not a class


class Member:
    def __init__(self):
        self._borrowed: list[Book] = []

    def borrow(self, book: Book) -> None:   # verb -> method, owned by Member
        self._borrowed.append(book)


class Librarian:
    def issue(self, book: Book, to: Member) -> None: ...   # verb -> method
    def return_book(self, book: Book) -> None: ...         # verb -> method`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "library.cpp",
        code: `#include <string>
#include <vector>

// Spec: "A member borrows books; each book has a title and author;
//        a librarian issues and returns books."
//
// Nouns -> classes/attributes:  Member, Book, (title, author), Librarian
// Verbs -> methods:             borrow, issue, return

class Book {
    std::string title;   // attribute, not a class
    std::string author;  // attribute, not a class
public:
    Book(std::string t, std::string a) : title(std::move(t)), author(std::move(a)) {}
};

class Member {
    std::vector<Book> borrowed;
public:
    void borrow(const Book& book) {     // verb -> method, owned by Member
        borrowed.push_back(book);
    }
};

class Librarian {
public:
    void issue(const Book& book, Member& to) {}   // verb -> method
    void returnBook(const Book& book) {}          // verb -> method
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to run noun/verb analysis" },
      {
        type: "p",
        text: "Reach for this technique at the very start of design, the moment you have written requirements or a problem statement and need a first cut of the domain — it's the bridge from prose to a class diagram. It shines in interviews and design discussions where you must turn a one-paragraph prompt (*\"design a parking lot,\"* *\"design a chess game\"*) into objects quickly and defensibly. It's also a great sanity check on an existing model: re-run it and you'll spot missing classes and over-modeled attributes.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Pair it with use cases and CRC cards",
        text: "Noun/verb extraction gives you the *candidates*; use cases and CRC-card walkthroughs *validate* them. Acting out a scenario — \"a member borrows a book\" — quickly shows whether your classes have the right responsibilities and whether a hidden entity (like `Loan`) needs to exist.",
      },
    ],

    tradeoffs: {
      pros: [
        "Fast and approachable — anyone can underline nouns and circle verbs to get a first model in minutes.",
        "Bridges prose to design — turns written requirements directly into candidate classes, attributes, and methods.",
        "Grounded in the domain — names come straight from the stakeholders' language, so the model stays understandable.",
        "Feeds the next steps cleanly — the output drops straight into class diagrams and CRC cards.",
      ],
      cons: [
        "Over-modeling risk — naively promoting every noun to a class produces a bloated model full of trivial one-field classes.",
        "Quality depends on the spec — vague or incomplete requirements yield a vague or incomplete noun list.",
        "Misses non-obvious entities — concepts like `Loan` or `Transaction` rarely appear as plain nouns and surface only on iteration.",
        "Behavior assignment is still hard — extracting a verb doesn't tell you which class should own it; that takes judgment.",
      ],
    },

    furtherReading: [
      {
        label: "Wikipedia — Object-oriented analysis and design",
        href: "https://en.wikipedia.org/wiki/Object-oriented_analysis_and_design",
        note: "Overview of OOA&D and where object discovery fits — use cases in, object/class models out.",
        kind: "article",
      },
      {
        label: "Wikipedia — Class-responsibility-collaboration card",
        href: "https://en.wikipedia.org/wiki/Class-responsibility-collaboration_card",
        note: "States the rule almost verbatim: nouns become classes, verbs become responsibilities, collaborators are the other cards involved.",
        kind: "article",
      },
      {
        label: "Wikipedia — Domain model",
        href: "https://en.wikipedia.org/wiki/Domain_model",
        note: "What a conceptual/domain model is and how entities represent meaningful real-world concepts — the target of noun analysis.",
        kind: "article",
      },
      {
        label: "Refactoring.Guru — Large Class",
        href: "https://refactoring.guru/smells/large-class",
        note: "The smell you get when behavior is mis-assigned and one class hoards everything; Extract Class is the cure.",
        kind: "article",
      },
      {
        label: "Head First Object-Oriented Analysis & Design — McLaughlin, Pollice, West",
        href: "https://www.oreilly.com/library/view/head-first-object-oriented/0596008678/",
        note: "Beginner-friendly, hands-on walk through requirements → use cases → identifying classes and responsibilities.",
        kind: "book",
      },
      {
        label: "Applying UML and Patterns — Craig Larman",
        note: "The standard text on building a conceptual model from requirements, plus GRASP's 'Information Expert' for assigning behavior to the right owner.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "ie-q1",
        question:
          "In the classic noun/verb analysis of a requirements spec, what do the nouns and the verbs become?",
        options: [
          { id: "a", label: "Nouns become methods; verbs become classes." },
          { id: "b", label: "Nouns become candidate classes and attributes; verbs become candidate methods." },
          { id: "c", label: "Nouns become packages; verbs become interfaces." },
          { id: "d", label: "Both nouns and verbs become classes; you decide later." },
        ],
        correctOptionId: "b",
        explanation:
          "The technique reads the spec like grammar: nouns and noun phrases are candidate classes or attributes, and verbs are candidate behaviors (methods). It's a starting brainstorm, then you filter.",
      },
      {
        id: "ie-q2",
        question:
          "The spec says a book has a `title` and an `author`. Why are these usually attributes rather than classes?",
        options: [
          { id: "a", label: "Because they are verbs, not nouns." },
          { id: "b", label: "Because every noun should become a class, including these." },
          { id: "c", label: "Because they are simple values describing a Book — they have no independent identity or lifecycle." },
          { id: "d", label: "Because they appear later in the sentence than `book`." },
        ],
        correctOptionId: "c",
        explanation:
          "An attribute is a simple value that describes an entity and has no standalone existence. A `title` only means something as a property of a `Book`, so it's a field — not its own class.",
      },
      {
        id: "ie-q3",
        question:
          "Your raw noun list contains `member`, `patron`, `system`, and `shelf`. Which filtering action is correct?",
        options: [
          { id: "a", label: "Make all four classes — every noun is a candidate." },
          { id: "b", label: "Drop `patron` as a synonym of `member`, and discard `system` (vague) and `shelf` (outside the boundary)." },
          { id: "c", label: "Keep `system` because the software is the most important class." },
          { id: "d", label: "Merge all four into a single class." },
        ],
        correctOptionId: "b",
        explanation:
          "Filtering removes synonyms (patron = member), vague meta-words (system), and things outside the system boundary (shelf, if untracked). The raw list is a brainstorm, not the model.",
      },
      {
        id: "ie-q4",
        question:
          "What distinguishes an entity (class) from an attribute in the model?",
        options: [
          { id: "a", label: "An entity is spelled with a capital letter; an attribute is lowercase." },
          { id: "b", label: "An entity has its own identity and lifecycle; an attribute is a simple value describing some entity." },
          { id: "c", label: "An entity is always a verb; an attribute is always a noun." },
          { id: "d", label: "There is no real difference — they're interchangeable." },
        ],
        correctOptionId: "b",
        explanation:
          "Ask: does it have its own identity and lifecycle, or is it just describing something else? `Member` has identity and changes over time (entity); `title` only describes a `Book` (attribute).",
      },
      {
        id: "ie-q5",
        question:
          "What is the most common mistake when turning a noun list into a class model?",
        options: [
          { id: "a", label: "Promoting every single noun to its own class — over-modeling with trivial classes." },
          { id: "b", label: "Using too few verbs as methods." },
          { id: "c", label: "Treating the noun list as final on the first pass is impossible, so iteration is wasted." },
          { id: "d", label: "Writing the spec in plain English instead of code." },
        ],
        correctOptionId: "a",
        explanation:
          "Over-modeling — making a class out of every noun (Color, Title, Status) — produces a bloated model of one-field classes. Most nouns are attributes; reserve classes for things with real identity and a lifecycle.",
      },
    ],
  },
};
