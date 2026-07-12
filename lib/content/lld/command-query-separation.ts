import type { RoadmapLesson } from "@/lib/content/types";

export const commandQuerySeparation: RoadmapLesson = {
  title: "Command–Query Separation (CQS)",
  oneLiner:
    "Bertrand Meyer's rule: every method should be either a command that does something (changes state, returns nothing) or a query that answers something (returns a value, changes nothing) — never both. Asking a question shouldn't change the answer, so you can read state as often as you like without surprises.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/command-query-separation.html",
  content: {
    prototypeCaption:
      "Sort each method of a `ShoppingCart` into one of two buckets — **COMMAND** (does something, returns nothing) or **QUERY** (answers something, no side effects). Click a card; the single explain panel tells you instantly whether it's a command or a query and *why*. Then a red **TRAP** card appears — `popLast()`, which *returns* the last item **and** *removes* it — and it fits neither bucket cleanly. The panel flags the CQS violation and shows the compliant split (`peekLast()` query + `removeLast()` command). A tiny *call it twice* demo proves the point: a pure query gives the same answer both times (safe); the trap changes the cart the second time. One fixed panel, replaced each click; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "**Command–Query Separation (CQS)** is a tiny rule with a big payoff. Coined by **Bertrand Meyer**, it says: every method should be *one* of two things and never both. A **command** *does* something — it changes the object's state and returns nothing. A **query** *answers* something — it returns a value and changes nothing. Keep them apart and your code becomes far easier to reason about.",
      },
      {
        type: "p",
        text: "Think of a **bar**. You can *ask the bartender a question* — \"how full is my glass?\" — and you can *give the bartender an order* — \"pour me a beer.\" Asking the question must **not** change anything; you can ask it ten times and the answer only changes when something *else* happens. Giving the order *does* change the world: now there's beer in your glass. A query is a question. A command is an order. CQS just says: don't build a method that secretly does both — a \"question\" that also pours a beer every time you ask it.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "*Asking a question should not change the answer.* A query returns a value and leaves the object untouched; a command changes the object and returns nothing. Never mix the two in one method.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "CQS is not CQRS",
        text: "These names look almost identical and get confused constantly. **CQS** is a *method-level habit*: a single method is either a command or a query. **CQRS** (Command Query *Responsibility Segregation*) is a *system-level architecture*: you split your whole application into a separate write model and read model, often with different databases and data paths. CQS is something you apply to one method in seconds; CQRS is a major design decision for a whole service. CQRS was *inspired* by CQS, but they operate at completely different scales — don't treat them as the same thing.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Two kinds of method, and only two" },
      {
        type: "p",
        text: "Sort every method you write into one of these two boxes. Most methods fall in cleanly, and the type signature usually gives it away.",
      },
      {
        type: "ul",
        items: [
          "**Command** — it *does* something. It changes the object's state (adds an item, transfers money, clears a list) and **returns nothing** (`void`). Examples: `deposit(amount)`, `addItem(item)`, `clear()`.",
          "**Query** — it *answers* something. It **returns a value** and **changes nothing**. You can call it a hundred times in a row and get the same answer (assuming nothing else changed). Examples: `getBalance()`, `isEmpty()`, `totalItems()`.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "A quick litmus test",
        text: "Look at the return type and the body. **Returns `void`** and touches state? That's a command. **Returns a value** and only reads state? That's a query. If a method *both* returns a value *and* mutates state, a CQS alarm should go off — you've probably built something that surprises its callers.",
      },
      { type: "h", text: "The danger: a query that secretly mutates" },
      {
        type: "p",
        text: "The whole reason CQS exists is to stamp out one specific bug: a method that *looks* like a query — it returns a value, so callers assume it's safe to read — but *secretly* changes state every time it runs. The two classic offenders:",
      },
      {
        type: "code",
        language: "typescript",
        code: `stack.pop();        // returns the top item AND removes it  ⚠️ both!
idGen.getNextId();  // returns an id AND increments the counter ⚠️ both!`,
      },
      {
        type: "p",
        text: "Both *look* like questions — they hand you back a value — but each one *also* mutates. That breaks the most useful property of a query: **safe repeatability**. If `getNextId()` were a pure query you could call it twice and get the same id. Because it secretly increments, calling it twice gives you `1` then `2`. The caller who just wanted to *peek* at \"the next id\" has now silently burned an id. A method named like a question that behaves like an order is a landmine.",
      },
      {
        type: "callout",
        variant: "warning",
        title: 'Why "call it twice" is the killer test',
        text: "A pure query can be called as many times as you like, in any order, with no consequence — that's what makes reading state *safe*. The moment a query has a hidden side effect, you can no longer call it freely: a debugger that evaluates it, a log line that prints it, or a retry that repeats it will each *change your program's state*. The surprise is invisible at the call site, so the bug hides for a long time. If calling a method twice changes the answer, it should never have looked like a query.",
      },
      { type: "h", text: "The fix: split the trap into two honest methods" },
      {
        type: "p",
        text: "When you find a method that both answers and acts, **split it in two** — a pure query that only reads, and a command that only acts. Instead of one `popLast()` that returns *and* removes, expose a `peekLast()` query (read the last item, change nothing) and a `removeLast()` command (drop the last item, return nothing). Callers compose them when they truly need both:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// BEFORE — one method that both answers and mutates (violates CQS)
const item = cart.popLast();        // returns AND removes

// AFTER — a query and a command, each honest about what it does
const item = cart.peekLast();       // query: read it, cart unchanged
cart.removeLast();                  // command: remove it, returns nothing`,
      },
      {
        type: "p",
        text: "Now `peekLast()` is safe to call in a log line, a debugger, or a retry — it never changes the cart. `removeLast()` is clearly an action. The caller who wants the old behavior simply calls both, *on purpose*, in full view. Nothing happens by surprise.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 620 250" width="100%" style="max-width:620px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Diagram contrasting a CQS violation with the compliant split. On the left, one popLast method both returns a value and mutates state. On the right, it is split into a peekLast query that only reads and a removeLast command that only mutates.">
  <defs>
    <marker id="cqs-arrow" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L11,4 L1,8 z" fill="#9099a8"/></marker>
  </defs>

  <!-- column labels -->
  <text x="155" y="24" text-anchor="middle" font-size="12" font-weight="600" fill="#f06868">VIOLATION — does both</text>
  <text x="465" y="24" text-anchor="middle" font-size="12" font-weight="600" fill="#5cc66f">COMPLIANT — split in two</text>
  <line x1="310" y1="40" x2="310" y2="230" stroke="#2d333d" stroke-width="1" stroke-dasharray="4 5"/>

  <!-- ===== VIOLATION ===== -->
  <rect x="55" y="92" width="200" height="56" rx="6" fill="#14161a" stroke="#f06868" stroke-width="1.5"/>
  <text x="155" y="116" text-anchor="middle" font-size="13.5" font-weight="700" fill="#e8e4dc">popLast()</text>
  <text x="155" y="135" text-anchor="middle" font-size="10" fill="#f06868">returns AND removes</text>

  <text x="155" y="70" text-anchor="middle" font-size="10.5" fill="#9099a8">one method, two jobs</text>

  <!-- the two tangled responsibilities -->
  <text x="155" y="172" text-anchor="middle" font-size="10" fill="#9099a8">answers ✦ acts — caller can't read safely</text>

  <!-- ===== COMPLIANT ===== -->
  <rect x="365" y="62" width="200" height="50" rx="6" fill="#14161a" stroke="rgba(94,159,246,0.6)" stroke-width="1.5"/>
  <text x="465" y="83" text-anchor="middle" font-size="13" font-weight="700" fill="#e8e4dc">peekLast()</text>
  <text x="465" y="100" text-anchor="middle" font-size="10" fill="#5e9ff6">QUERY · reads, no change</text>

  <rect x="365" y="128" width="200" height="50" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.6)" stroke-width="1.5"/>
  <text x="465" y="149" text-anchor="middle" font-size="13" font-weight="700" fill="#e8e4dc">removeLast()</text>
  <text x="465" y="166" text-anchor="middle" font-size="10" fill="#5cc66f">COMMAND · mutates, returns void</text>

  <text x="465" y="206" text-anchor="middle" font-size="10" fill="#9099a8">each honest — read safely, act on purpose</text>
</svg>`,
        caption:
          "**Left:** one `popLast()` does two jobs at once — it *answers* (returns the item) **and** *acts* (removes it). A caller who only wanted to read can't, because reading mutates. **Right:** split it. `peekLast()` is a pure **query** (read, no change) and `removeLast()` is a pure **command** (mutate, return nothing). Now you read safely as often as you like, and act only when you mean to.",
      },
      { type: "h", text: "The famous pragmatic exceptions" },
      {
        type: "p",
        text: "CQS is a *guideline*, not a law of physics, and a few well-known methods break it on purpose because the combined operation is genuinely useful and the side effect is *expected*. `stack.pop()`, `queue.poll()`, and `iterator.next()` all return a value **and** advance/mutate — and that's fine, because everyone already knows they do, and \"take the next one\" is one atomic idea. The rule of thumb: it's acceptable to combine when the mutation is the *whole point* of the call and is obvious from the name. The trap is the *accidental* mix — a `getX()` or `isReady()` that nobody expects to change anything but quietly does.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Naming carries the contract",
        text: "Half of CQS is in the *names*. `get…`, `is…`, `has…`, `count…`, `peek…` promise a query — callers will read them freely, so they had *better* be side-effect-free. `add…`, `remove…`, `set…`, `clear…`, `save…` promise a command. When a name promises a question but the body gives an order, you've broken the contract the caller is relying on — even if the compiler never complains.",
      },
    ],

    handsOn: [
      {
        title: "01 · Sort the obvious ones",
        body: "Open the prototype. You'll see method cards from a `ShoppingCart` — `getBalance()`, `addItem(x)`, `isEmpty()`, `clear()`, `totalItems()`, `deposit(x)`. Click each card and drop it into **COMMAND** or **QUERY**. Use the litmus test: returns a value and only reads → query; returns `void` and changes state → command. The single explain panel tells you instantly whether you were right and *why*, and a running tally counts how many you've sorted correctly.",
      },
      {
        title: "02 · Meet the trap card",
        body: "After the clean cards are sorted, a red **TRAP** card appears: `popLast()`. Try to drop it in a bucket. The panel flags it: it *returns* the last item (looks like a query) **and** *removes* it (acts like a command), so it fits **neither** cleanly — it violates CQS. Read the suggested fix: split it into `peekLast()` (a pure query) and `removeLast()` (a pure command).",
      },
      {
        title: "03 · Call it twice",
        body: "Run the *call it twice* demo. First call a pure query — say `totalItems()` — twice in a row: the cart is unchanged, so you get the **same answer both times** (safe to repeat). Then call the trap `popLast()` twice: the first call removes the last item, and the **second call removes a different one** — the answer changed because asking the question mutated the cart. That single demo is the whole reason CQS exists: a query you can't safely repeat isn't really a query.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "shopping-cart.ts",
        code: `class ShoppingCart {
  private items: string[] = [];

  // COMMANDS — do something, change state, return nothing (void).
  addItem(item: string): void { this.items.push(item); }
  clear(): void { this.items = []; }

  // QUERIES — answer something, return a value, change nothing.
  totalItems(): number { return this.items.length; }
  isEmpty(): boolean { return this.items.length === 0; }
  peekLast(): string | undefined { return this.items[this.items.length - 1]; }

  // ⚠️ VIOLATION — returns the item AND removes it: both query and command.
  popLast(): string | undefined {
    return this.items.pop();   // looks like a read, but mutates every call
  }

  // ✅ COMPLIANT — split the trap into a pure command (peekLast is the query above).
  removeLast(): void { this.items.pop(); }
}

const cart = new ShoppingCart();
cart.addItem("milk");          // command
cart.addItem("bread");         // command

// A pure query is safe to repeat — same answer twice, cart untouched.
cart.totalItems();             // 2
cart.totalItems();             // 2  (no surprise)

// Need the value AND the removal? Compose the two honest methods, on purpose.
const last = cart.peekLast();  // query: "bread", cart unchanged
cart.removeLast();             // command: removes it, returns nothing`,
      },
      {
        label: "Java",
        language: "java",
        filename: "ShoppingCart.java",
        code: `import java.util.*;

class ShoppingCart {
    private final List<String> items = new ArrayList<>();

    // COMMANDS — do something, change state, return nothing (void).
    void addItem(String item) { items.add(item); }
    void clear() { items.clear(); }

    // QUERIES — answer something, return a value, change nothing.
    int totalItems() { return items.size(); }
    boolean isEmpty() { return items.isEmpty(); }
    String peekLast() { return items.isEmpty() ? null : items.get(items.size() - 1); }

    // ⚠️ VIOLATION — returns the item AND removes it: both query and command.
    String popLast() {
        return items.isEmpty() ? null : items.remove(items.size() - 1);
    }

    // ✅ COMPLIANT — split the trap into a pure command (peekLast is the query above).
    void removeLast() {
        if (!items.isEmpty()) items.remove(items.size() - 1);
    }
}

// ShoppingCart cart = new ShoppingCart();
// cart.addItem("milk");        // command
// cart.addItem("bread");       // command
// cart.totalItems();           // 2
// cart.totalItems();           // 2  (safe to repeat — same answer)
// String last = cart.peekLast(); // query: "bread", cart unchanged
// cart.removeLast();             // command: removes it, returns nothing`,
      },
      {
        label: "Python",
        language: "python",
        filename: "shopping_cart.py",
        code: `class ShoppingCart:
    def __init__(self) -> None:
        self._items: list[str] = []

    # COMMANDS — do something, change state, return nothing.
    def add_item(self, item: str) -> None:
        self._items.append(item)

    def clear(self) -> None:
        self._items.clear()

    # QUERIES — answer something, return a value, change nothing.
    def total_items(self) -> int:
        return len(self._items)

    def is_empty(self) -> bool:
        return not self._items

    def peek_last(self) -> str | None:
        return self._items[-1] if self._items else None

    # VIOLATION — returns the item AND removes it: both query and command.
    def pop_last(self) -> str | None:
        return self._items.pop() if self._items else None  # looks like a read, mutates

    # COMPLIANT — split the trap into a pure command (peek_last is the query above).
    def remove_last(self) -> None:
        if self._items:
            self._items.pop()


cart = ShoppingCart()
cart.add_item("milk")          # command
cart.add_item("bread")         # command

assert cart.total_items() == 2  # query, safe to repeat
assert cart.total_items() == 2  # same answer — cart untouched

last = cart.peek_last()        # query: "bread", cart unchanged
cart.remove_last()             # command: removes it, returns nothing`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "shopping_cart.cpp",
        code: `#include <string>
#include <vector>
#include <optional>

class ShoppingCart {
    std::vector<std::string> items;

public:
    // COMMANDS — do something, change state, return nothing (void).
    void addItem(const std::string& item) { items.push_back(item); }
    void clear() { items.clear(); }

    // QUERIES — answer something, return a value, change nothing (note: const).
    std::size_t totalItems() const { return items.size(); }
    bool isEmpty() const { return items.empty(); }
    std::optional<std::string> peekLast() const {
        if (items.empty()) return std::nullopt;
        return items.back();
    }

    // VIOLATION — returns the item AND removes it: both query and command.
    std::optional<std::string> popLast() {
        if (items.empty()) return std::nullopt;
        auto v = items.back();
        items.pop_back();           // looks like a read, but mutates
        return v;
    }

    // COMPLIANT — split the trap into a pure command (peekLast is the query above).
    void removeLast() {
        if (!items.empty()) items.pop_back();
    }
};

// ShoppingCart cart;
// cart.addItem("milk");          // command
// cart.addItem("bread");         // command
// cart.totalItems();             // 2  (const query — safe to repeat)
// cart.totalItems();             // 2  (same answer, cart untouched)
// auto last = cart.peekLast();   // query: "bread", cart unchanged
// cart.removeLast();             // command: removes it, returns nothing`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Apply CQS to almost every method you write" },
      {
        type: "p",
        text: "Unlike heavier patterns, CQS is cheap enough to be a *default habit*. As you write each method, ask: is this an order or a question? Make it clearly one or the other. It pays off most in the places where a hidden side effect would hurt:",
      },
      {
        type: "ul",
        items: [
          "**Anything named like a question** — `get…`, `is…`, `has…`, `count…`. Callers, debuggers, and log lines will read these freely, so they must be side-effect-free.",
          "**Code that gets retried or logged** — if a value-returning method might run twice (a retry, a `console.log`, a debugger watch), it must be safe to repeat. CQS guarantees that for queries.",
          "**Domain models and value objects** — keeping reads pure makes objects predictable and easy to test: call a query, assert the result, with no setup teardown for surprise mutations.",
          "**APIs other people call** — a public method's name is a promise. A query that mutates breaks that promise invisibly, and the bug lands in *their* code, not yours.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Know the sanctioned exceptions",
        text: "Don't fight idioms that already combine the two *by well-known convention*: `stack.pop()`, `queue.poll()`, `iterator.next()`, an atomic `getAndIncrement()`, or `compareAndSet()`. These return *and* mutate on purpose, everyone expects it, and the combined step is genuinely atomic. CQS targets the *accidental* mix — the `getStatus()` that quietly logs, increments, or lazily mutates. Combine deliberately and obviously, or not at all.",
      },
    ],

    tradeoffs: {
      pros: [
        "Safe to read — pure queries can be called any number of times, in any order, by code, logs, or a debugger, with zero risk of changing program state.",
        "Easier to reason about — a method's name and return type tell you whether it acts or answers, so you can predict behavior without reading the body.",
        "Simpler testing — query results are deterministic and repeatable; you assert on them without worrying that the act of checking changed the object.",
        "Catches a whole bug class — the 'looks like a query but mutates' landmine simply can't exist if you follow the rule.",
      ],
      cons: [
        "Occasional extra call — when you genuinely need a value and a mutation, you call two methods (peek then remove) instead of one combined pop.",
        "Famous exceptions exist — pop/poll/next/getAndIncrement deliberately break CQS, so it's a strong guideline, not an absolute law.",
        "Not always atomic — splitting a combined operation into query+command can introduce a race in concurrent code, where the single atomic op was actually safer.",
        "Easy to confuse with CQRS — the near-identical name leads people to over-engineer a whole architecture when they only needed the method-level habit.",
      ],
    },

    furtherReading: [
      {
        label: "CommandQuerySeparation — Martin Fowler (bliki)",
        href: "https://martinfowler.com/bliki/CommandQuerySeparation.html",
        note: "Fowler's crisp explanation of the principle, where it helps, and the pragmatic exceptions (like pop) where mutating-and-returning is acceptable. The best short read on the topic.",
        kind: "article",
      },
      {
        label: "Command–query separation — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Command%E2%80%93query_separation",
        note: "Concise reference covering the formal definition, Meyer's origin, the connection to referential transparency, and how CQS relates to (but differs from) CQRS.",
        kind: "docs",
      },
      {
        label: "Object-Oriented Software Construction — Bertrand Meyer",
        href: "https://en.wikipedia.org/wiki/Object-Oriented_Software_Construction",
        note: "The book where Meyer introduced CQS as part of the Eiffel design philosophy. The primary source for the principle and the reasoning behind 'asking a question shouldn't change the answer'.",
        kind: "book",
      },
      {
        label: "CQRS — Martin Fowler (bliki)",
        href: "https://martinfowler.com/bliki/CQRS.html",
        note: "Read this to keep CQS and CQRS straight: Fowler explains that CQRS splits an entire system into separate read and write models, a far bigger commitment than the method-level CQS habit.",
        kind: "article",
      },
      {
        label: "CQS versus CQRS — Greg Young",
        href: "https://gregyoung.wordpress.com/2010/02/16/cqrs-task-based-uis-event-sourcing-agh/",
        note: "From the person who popularized CQRS: a clear statement that CQRS is an architectural pattern at the object/service level, distinct from Meyer's method-level CQS. Settles the 'are they the same?' question.",
        kind: "article",
      },
      {
        label: "Command Query Separation explained (video)",
        href: "https://www.youtube.com/watch?v=qkn8fzLs0wY",
        note: "A short, visual walkthrough of CQS with live code: spotting a method that both returns and mutates, then splitting it into a clean query and command.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "command-query-separation-q1",
        question: "What does Command–Query Separation actually require?",
        options: [
          { id: "a", label: "Every method should be either a command (changes state, returns nothing) or a query (returns a value, changes nothing) — never both." },
          { id: "b", label: "Every method must return a value so callers can check whether it succeeded." },
          { id: "c", label: "Commands and queries must live in separate classes with separate databases." },
          { id: "d", label: "A class should expose only commands and hide all of its queries." },
        ],
        correctOptionId: "a",
        explanation:
          "CQS sorts every method into one of two roles: a command does something and returns nothing, or a query answers something and changes nothing. The point is to never mix the two. Option (c) describes CQRS — a different, system-level pattern — and the others invert or distort the rule.",
      },
      {
        id: "command-query-separation-q2",
        question: "Which method is the clearest CQS violation?",
        options: [
          { id: "a", label: "getNextId() that returns the next id AND increments an internal counter each time it's called." },
          { id: "b", label: "getBalance() that returns the account balance and changes nothing." },
          { id: "c", label: "deposit(amount) that adds to the balance and returns nothing." },
          { id: "d", label: "isEmpty() that returns true or false based on the current state." },
        ],
        correctOptionId: "a",
        explanation:
          "`getNextId()` is named like a query (it returns a value) but secretly mutates by incrementing the counter — so it both answers and acts, the exact mix CQS forbids. `getBalance()` and `isEmpty()` are pure queries; `deposit()` is a pure command. Each of those is fine; only (a) does two jobs at once.",
      },
      {
        id: "command-query-separation-q3",
        question: "Why is a query with a hidden side effect so dangerous?",
        options: [
          { id: "a", label: "Because it can't be called safely twice — a log line, a debugger, or a retry will each change program state without the caller realizing it." },
          { id: "b", label: "Because queries are always slower than commands, so the side effect wastes time." },
          { id: "c", label: "Because the compiler refuses to build any method that both returns and mutates." },
          { id: "d", label: "Because hidden side effects always crash the program immediately." },
        ],
        correctOptionId: "a",
        explanation:
          "The value of a query is that you can call it freely — to read, to log, to retry, to watch in a debugger — without consequence. A hidden side effect destroys that: the second call returns a different answer or changes state, and because the surprise is invisible at the call site, the bug hides for a long time. Compilers (c) happily allow such methods, which is exactly why the human discipline of CQS matters.",
      },
      {
        id: "command-query-separation-q4",
        question: "How do CQS and CQRS differ?",
        options: [
          { id: "a", label: "CQS is a method-level habit (one method is a command or a query); CQRS is a system architecture that splits the whole app into separate read and write models." },
          { id: "b", label: "They are two names for exactly the same principle." },
          { id: "c", label: "CQS applies only to databases; CQRS applies only to in-memory objects." },
          { id: "d", label: "CQRS is the simple rule; CQS is the large-scale architecture built on top of it." },
        ],
        correctOptionId: "a",
        explanation:
          "CQS (Command–Query Separation) is a small, per-method discipline you apply in seconds. CQRS (Command Query Responsibility Segregation) is a major architectural decision that gives a system separate read and write models and data paths. CQRS was inspired by CQS, but they operate at completely different scales — (d) reverses which is which.",
      },
      {
        id: "command-query-separation-q5",
        question: "Methods like stack.pop() and iterator.next() return a value AND mutate. How does CQS treat them?",
        options: [
          { id: "a", label: "As accepted pragmatic exceptions — the mutation is the whole point of the call and everyone expects it, so combining is fine here." },
          { id: "b", label: "As proof that CQS is wrong and should be ignored entirely." },
          { id: "c", label: "As violations that must be reported and removed from every standard library." },
          { id: "d", label: "As pure queries, because they return a value." },
        ],
        correctOptionId: "a",
        explanation:
          "CQS is a strong guideline, not an absolute law. `pop()`, `poll()`, and `next()` deliberately combine answer-and-act because the mutation is the entire purpose of the call and the behavior is universally understood. The combination is acceptable when it's deliberate and obvious; the rule targets the *accidental* mix — a method that looks like a harmless read but quietly changes state.",
      },
    ],
  },
};
