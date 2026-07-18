import type { RoadmapLesson } from "@/lib/content/types";

export const templateMethod: RoadmapLesson = {
  title: "Template Method",
  oneLiner:
    "Write an algorithm's skeleton **once** in a base class and let subclasses fill in only the steps that differ. Making tea and coffee share the same recipe — boil water, brew, pour, add extras — so `HotDrink.prepare()` locks that order in place, and `Tea` and `Coffee` each supply just their own `brew()` and `addExtras()`. The parent calls the child's steps, never the other way round.",
  difficulty: "beginner",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/template-method.html",
  content: {
    prototypeCaption:
      "A hot-drink recipe as a living class diagram. The left column is the **template** — four step cards bolted into a fixed order inside `HotDrink.prepare()`. Steps 1 and 3 (`boilWater`, `pourInCup`) are locked 🔩: they're written once in the base class and nobody may reorder them. Steps 2 and 4 (`brew`, `addExtras`) are dashed — empty sockets waiting for a subclass. Pick **🍵 Tea** or **☕ Coffee** and watch colored implementation cards slot *into* those sockets while the skeleton stays untouched. Hit **▶ prepare()** and the highlight marches down the four steps in order — fixed steps flash neutral, subclass steps flash the drink's color, and the cup fills at step 3. Untick the `wantsExtras()` hook on step 4 and run again: the skeleton *skips* that step with a little hop. Switch drinks and re-run — same skeleton, different filling. That's the whole pattern in three clicks.",

    overview: [
      {
        type: "p",
        text: "**Template Method** answers a very common, very ordinary problem: two classes do *almost* the same thing. Think about making **tea** and making **coffee**. Both follow the same recipe: boil water → brew → pour into a cup → add extras. Only two steps actually differ — tea *steeps a bag* and gets *lemon*; coffee *drips through grounds* and gets *milk and sugar*. If you write `makeTea()` and `makeCoffee()` as two separate methods, you've copied the whole recipe twice just to change two lines. Now every fix to the shared part must be made in two places — the classic duplication bug factory.",
      },
      {
        type: "p",
        text: "The pattern's fix: write the recipe **once** in a base class. `HotDrink` gets a `prepare()` method — the **template method** — that spells out the skeleton in stone: call `boilWater()`, then `brew()`, then `pourInCup()`, then `addExtras()`, in exactly that order. The steps that never change are implemented right there in `HotDrink`. The steps that vary are left **abstract** — empty sockets — and `Tea` and `Coffee` each fill in only those. Subclasses can change *what happens inside a step*, but they can never reorder, skip, or rewrite the skeleton itself.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Template Method **fixes an algorithm's skeleton in a base-class method** and lets subclasses fill in specific steps — *without ever changing the skeleton's order*. The parent owns the recipe; the children own the ingredients.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The Hollywood principle: \"don't call us, we'll call you\"",
        text: "Notice who calls whom. Your code calls `tea.prepare()` on the *parent's* method, and the parent turns around and calls the *child's* `brew()` at exactly the right moment. The subclass never drives — it just waits to be called. This inversion of control is the pattern's signature move, and it's the same trick every framework plays when it calls *your* code at the right point in *its* lifecycle.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The participants: one abstract class, three kinds of steps" },
      {
        type: "p",
        text: "Template Method is a one-class-hierarchy pattern. Everything lives in an **abstract base class** and its concrete subclasses:",
      },
      {
        type: "ul",
        items: [
          "**The template method** — `prepare()` in `HotDrink`. It calls the steps in a fixed order and is marked *final* (or simply never overridden, in languages without `final`), so no subclass can tamper with the sequence.",
          "**Invariant steps** — `boilWater()` and `pourInCup()`. They're identical for every drink, so they're implemented once, concretely, in the base class.",
          "**Abstract (primitive) steps** — `brew()` and `addExtras()`. The base class declares them but can't implement them; every subclass *must* fill them in. `Tea` steeps a bag; `Coffee` drips grounds.",
          "**Hooks (optional steps)** — steps that come with a *default* implementation the subclass *may* override but doesn't have to. `wantsExtras()` returning `true` by default is a hook: `Tea` can leave it alone, but a `BlackCoffee` subclass could override it to return `false` and the skeleton would skip the extras step entirely.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `abstract class HotDrink {
  // THE template method — the skeleton, written once, order fixed.
  prepare(): void {                    // (final in Java/C++; just don't override)
    this.boilWater();                  // 1 — same for everyone
    this.brew();                       // 2 — filled in by subclass
    this.pourInCup();                  // 3 — same for everyone
    if (this.wantsExtras()) {          // hook decides whether step 4 runs
      this.addExtras();                // 4 — filled in by subclass
    }
  }

  private boilWater()  { console.log("Boiling water"); }
  private pourInCup()  { console.log("Pouring into cup"); }

  protected abstract brew(): void;       // subclass MUST supply
  protected abstract addExtras(): void;  // subclass MUST supply

  protected wantsExtras(): boolean { return true; }  // hook: MAY override
}

class Tea extends HotDrink {
  protected brew()      { console.log("Steeping the tea bag"); }
  protected addExtras() { console.log("Adding lemon"); }
}

new Tea().prepare();   // parent runs the skeleton, Tea supplies steps 2 & 4`,
      },
      { type: "h", text: "Inversion of control — not just \"calling a helper\"" },
      {
        type: "p",
        text: "It's easy to mistake this for ordinary method extraction — \"so what, a method calls other methods?\" The difference is the **direction of control**. When *you* extract a helper, your code decides when to call it. In Template Method, the **base class** decides when the subclass's code runs. `Tea` never calls `boilWater()` or arranges the sequence — it hands its two steps to the parent and the parent invokes them at the right moments. Control flows *down* from the skeleton into the filled-in steps. That's why frameworks are built on this shape: the framework owns the lifecycle and calls your overridden methods; you never call the framework's main loop.",
      },
      { type: "h", text: "The smell it cures: two near-identical methods" },
      {
        type: "p",
        text: "The tell-tale trigger is code review déjà vu: `makeTea()` and `makeCoffee()` are 12 lines each and 10 of those lines are *identical*. The classic refactoring is exactly this pattern — pull the identical lines up into a base-class template method, turn the two differing lines into abstract steps, and each subclass shrinks to just its unique bits. The shared logic now lives in one place, so a fix to `boilWater()` fixes every drink at once.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Template Method vs Strategy — the interview favourite",
        text: "Both attack \"the algorithm varies\", but from opposite ends. **Template Method** varies *individual steps* through **inheritance**, decided at *compile time* — the skeleton is fixed and a subclass fills the blanks. **Strategy** ([[strategy]]) swaps the *entire algorithm* through **composition**, decided at *runtime* — you hand an object a different strategy and it behaves differently mid-flight. If the variation is heavy, or you need to switch behaviour while the program runs, prefer Strategy: composition keeps you flexible where inheritance locks you in — see [[composition-vs-inheritance]] for the full argument.",
      },
      { type: "h", text: "You already use this pattern every day" },
      {
        type: "ul",
        items: [
          "**JUnit / test frameworks** — the runner's fixed lifecycle is `setUp()` → your test method → `tearDown()`. You override the steps; the framework owns the skeleton and calls them in order.",
          "**Framework lifecycle hooks** — React class components (`componentDidMount`, `render`), Rails controller callbacks (`before_action`), Android's `onCreate`/`onStart`: the framework runs a fixed sequence and invokes your overrides at published points.",
          "**`java.util.AbstractList`** — `indexOf()`, `contains()` and friends are written once against two abstract primitives, `get(i)` and `size()`. Implement those two and you inherit a whole working list API.",
          "**Game loops** — an engine's fixed `init()` → `update()` → `render()` cycle where your game overrides `update()` and `render()` but never reorders the loop.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Read the skeleton, then fill it",
        body: "Look at the left column: four step cards in a fixed order. Steps 1 and 3 carry a 🔩 lock and the label 'fixed in HotDrink' — they're implemented once in the base class. Steps 2 and 4 are dashed sockets labelled 'filled by subclass'. Now click the 🍵 Tea chip at the top: green mini-cards ('steep tea bag', 'add lemon') slot into the two dashed steps while steps 1 and 3 don't move a pixel. The skeleton was never touched — only the blanks got filled.",
      },
      {
        title: "02 · Run prepare() and watch who calls whom",
        body: "Press ▶ prepare(). The highlight walks down the four steps strictly in order — 1, 2, 3, 4 — with the cup filling at step 3. Fixed steps flash neutral grey; the subclass steps flash Tea's green. Read the explain line: HotDrink ran the skeleton and *it* called Tea's two steps at the right moments — Tea never drove. Now click ☕ Coffee and run again: identical marching order, but steps 2 and 4 flash brown with 'drip grounds' and 'add milk+sugar'. Same skeleton, different filling.",
      },
      {
        title: "03 · Flip the hook",
        body: "Find the small 'hook: wantsExtras()' toggle on step 4 — it's ticked by default, because a hook is a step with a *default* the subclass may override. Untick it and press ▶ prepare() again: the run goes 1 → 2 → 3 and then *hops over* step 4 entirely. The subclass didn't reorder anything — the skeleton itself consulted the hook and decided to skip. Tick it back, press ↺ Reset, and try the whole flow with the other drink.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "hot-drink.ts",
        code: `abstract class HotDrink {
  // The TEMPLATE METHOD: the skeleton, written once, order fixed.
  // Not overridable by convention — subclasses fill steps, not the recipe.
  prepare(): void {
    this.boilWater();                 // 1 · fixed
    this.brew();                      // 2 · subclass fills in
    this.pourInCup();                 // 3 · fixed
    if (this.wantsExtras()) {         //     hook gates step 4
      this.addExtras();               // 4 · subclass fills in
    }
  }

  // Invariant steps — same for every drink, implemented once.
  private boilWater(): void { console.log("Boiling water"); }
  private pourInCup(): void { console.log("Pouring into cup"); }

  // Abstract steps — every subclass MUST supply these.
  protected abstract brew(): void;
  protected abstract addExtras(): void;

  // Hook — a default the subclass MAY override.
  protected wantsExtras(): boolean { return true; }
}

class Tea extends HotDrink {
  protected brew(): void      { console.log("Steeping the tea bag"); }
  protected addExtras(): void { console.log("Adding lemon"); }
}

class Coffee extends HotDrink {
  protected brew(): void      { console.log("Dripping through grounds"); }
  protected addExtras(): void { console.log("Adding milk and sugar"); }
}

class BlackCoffee extends Coffee {
  protected wantsExtras(): boolean { return false; }  // hook: skip extras
}

new Tea().prepare();         // boil → steep → pour → lemon
new BlackCoffee().prepare(); // boil → drip  → pour → (extras skipped)`,
      },
      {
        label: "Java",
        language: "java",
        filename: "HotDrink.java",
        code: `abstract class HotDrink {
    // The TEMPLATE METHOD — 'final' so no subclass can change the order.
    public final void prepare() {
        boilWater();                  // 1 · fixed
        brew();                       // 2 · subclass fills in
        pourInCup();                  // 3 · fixed
        if (wantsExtras()) {          //     hook gates step 4
            addExtras();              // 4 · subclass fills in
        }
    }

    // Invariant steps — implemented once for every drink.
    private void boilWater() { System.out.println("Boiling water"); }
    private void pourInCup() { System.out.println("Pouring into cup"); }

    // Abstract steps — every subclass MUST supply these.
    protected abstract void brew();
    protected abstract void addExtras();

    // Hook — default behaviour the subclass MAY override.
    protected boolean wantsExtras() { return true; }
}

class Tea extends HotDrink {
    protected void brew()      { System.out.println("Steeping the tea bag"); }
    protected void addExtras() { System.out.println("Adding lemon"); }
}

class Coffee extends HotDrink {
    protected void brew()      { System.out.println("Dripping through grounds"); }
    protected void addExtras() { System.out.println("Adding milk and sugar"); }
}

// new Tea().prepare();     // boil → steep → pour → lemon
// new Coffee().prepare();  // boil → drip  → pour → milk & sugar
// JUnit's setUp()/tearDown() lifecycle is exactly this shape.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "hot_drink.py",
        code: `from abc import ABC, abstractmethod


class HotDrink(ABC):
    # The TEMPLATE METHOD — the skeleton, written once, order fixed.
    # (Python has no 'final'; by convention subclasses never override it.)
    def prepare(self) -> None:
        self._boil_water()            # 1 · fixed
        self.brew()                   # 2 · subclass fills in
        self._pour_in_cup()           # 3 · fixed
        if self.wants_extras():       #     hook gates step 4
            self.add_extras()         # 4 · subclass fills in

    # Invariant steps — same for every drink.
    def _boil_water(self) -> None:  print("Boiling water")
    def _pour_in_cup(self) -> None: print("Pouring into cup")

    # Abstract steps — every subclass MUST supply these.
    @abstractmethod
    def brew(self) -> None: ...

    @abstractmethod
    def add_extras(self) -> None: ...

    # Hook — a default the subclass MAY override.
    def wants_extras(self) -> bool:
        return True


class Tea(HotDrink):
    def brew(self) -> None:       print("Steeping the tea bag")
    def add_extras(self) -> None: print("Adding lemon")


class Coffee(HotDrink):
    def brew(self) -> None:       print("Dripping through grounds")
    def add_extras(self) -> None: print("Adding milk and sugar")


Tea().prepare()      # boil → steep → pour → lemon
Coffee().prepare()   # boil → drip  → pour → milk & sugar`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "hot_drink.cpp",
        code: `#include <iostream>

class HotDrink {
public:
    // The TEMPLATE METHOD — deliberately NOT virtual, so subclasses
    // cannot change the order. They fill steps, never the recipe.
    void prepare() {
        boilWater();                  // 1 · fixed
        brew();                       // 2 · subclass fills in
        pourInCup();                  // 3 · fixed
        if (wantsExtras()) {          //     hook gates step 4
            addExtras();              // 4 · subclass fills in
        }
    }
    virtual ~HotDrink() = default;

private:
    // Invariant steps — implemented once for every drink.
    void boilWater() { std::cout << "Boiling water\\n"; }
    void pourInCup() { std::cout << "Pouring into cup\\n"; }

protected:
    // Abstract steps — every subclass MUST supply these.
    virtual void brew() = 0;
    virtual void addExtras() = 0;

    // Hook — default behaviour the subclass MAY override.
    virtual bool wantsExtras() { return true; }
};

class Tea : public HotDrink {
protected:
    void brew() override      { std::cout << "Steeping the tea bag\\n"; }
    void addExtras() override { std::cout << "Adding lemon\\n"; }
};

class Coffee : public HotDrink {
protected:
    void brew() override      { std::cout << "Dripping through grounds\\n"; }
    void addExtras() override { std::cout << "Adding milk and sugar\\n"; }
};

int main() {
    Tea tea;       tea.prepare();     // boil → steep → pour → lemon
    Coffee coffee; coffee.prepare();  // boil → drip  → pour → milk & sugar
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Template Method when the shape is shared" },
      {
        type: "ul",
        items: [
          "**Several classes share an algorithm's shape** but differ in a few steps — report generators that all fetch → transform → format → save, with only *format* varying; importers that differ only in *parse*.",
          "**You keep seeing near-duplicate methods** — two or more methods that are 90% identical. Pull the identical 90% into a template method and make the differing 10% abstract steps.",
          "**You're a framework or library author defining extension points** — you own the lifecycle (init → run → cleanup) and want users to customise published steps without ever being able to break the sequence.",
          "**The step order is a real invariant** — validation *must* happen before saving, water *must* boil before brewing. Locking the skeleton in a final method turns that rule from a convention into a guarantee.",
        ],
      },
      { type: "h", text: "When NOT to use it" },
      {
        type: "ul",
        items: [
          "**The steps vary wildly** — if subclasses would override nearly every step, there's no real skeleton to share; you've just built an awkward inheritance tree. Extract whole interchangeable algorithms instead ([[strategy]]).",
          "**Clients must swap the algorithm at runtime** — inheritance is decided at compile time; a `Tea` can never become a `Coffee` mid-program. Strategy's composition lets you hand in a different behaviour on the fly.",
          "**You'd need to vary more than one axis** — a drink that varies by brew method *and* by serving style would need a subclass per combination. Composition handles multi-axis variation without the class explosion; see [[composition-vs-inheritance]].",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Kills duplication at the root — the shared skeleton lives in exactly one place, so a fix to a common step fixes every subclass at once.",
        "The order becomes a guarantee, not a convention — a final template method makes it impossible for a subclass to reorder, skip, or mangle the algorithm's invariant sequence.",
        "Clean, published extension points — subclasses (or framework users) see exactly which steps they must supply (abstract) and which they may tweak (hooks), and nothing else.",
        "Subclasses stay tiny and focused — Tea is two short methods; all the ceremony lives in the parent, which keeps each variant readable.",
      ],
      cons: [
        "Inheritance lock-in — every variant must be a subclass, fixed at compile time; you can't swap behaviour at runtime or mix steps from two variants the way composition allows.",
        "Fragile base class risk — subclasses implicitly depend on the parent's calling sequence, so an innocent-looking change to the skeleton can silently break every subclass.",
        "Liskov discipline required — an overridden step must honour what the skeleton expects of it (its contract); a `brew()` that throws or secretly pours the cup breaks the template's assumptions. See [[liskov-substitution]].",
        "Skeletons resist growth — the more steps and hooks you add to keep everyone happy, the harder the template is to follow, and clients can't extend the sequence itself, only the published blanks.",
      ],
    },

    furtherReading: [
      {
        label: "Template Method — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/template-method",
        note: "The clearest illustrated walkthrough: problem, structure, hooks, and the Template-Method-vs-Strategy comparison, with examples in many languages. Best first read.",
        kind: "article",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original Gang of Four book. Its Template Method chapter coins the 'Hollywood principle' framing and defines primitive operations vs hooks.",
        kind: "book",
      },
      {
        label: "Template method pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Template_method_pattern",
        note: "Concise reference with UML structure, the inversion-of-control angle, and notes on how the pattern underpins frameworks.",
        kind: "docs",
      },
      {
        label: "Form Template Method — Refactoring catalog (Martin Fowler)",
        href: "https://refactoring.com/catalog/formTemplateMethod.html",
        note: "The refactoring that *produces* this pattern: how to turn two near-identical methods in sibling classes into one template method plus abstract steps.",
        kind: "article",
      },
      {
        label: "AbstractList — Java Platform API documentation",
        href: "https://docs.oracle.com/javase/8/docs/api/java/util/AbstractList.html",
        note: "A production-grade template method in the JDK: implement just get(int) and size() and inherit a whole working List — the skeletal-implementation idiom.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "template-method-q1",
        question: "What is the core intent of the Template Method pattern?",
        options: [
          { id: "a", label: "Fix an algorithm's skeleton in a base-class method and let subclasses fill in specific steps without changing the skeleton's order." },
          { id: "b", label: "Ensure a class has exactly one instance with a global access point." },
          { id: "c", label: "Let a client swap an object's entire algorithm at runtime by handing it a different object." },
          { id: "d", label: "Copy an existing object instead of constructing a new one from scratch." },
        ],
        correctOptionId: "a",
        explanation:
          "Template Method writes the invariant sequence once in the parent (prepare(): boil → brew → pour → extras) and leaves only the varying steps abstract for subclasses. Option (b) is Singleton, (c) is Strategy, and (d) is Prototype.",
      },
      {
        id: "template-method-q2",
        question: "Why is the template method itself (e.g. `prepare()`) typically marked final or left non-overridable?",
        options: [
          { id: "a", label: "So no subclass can reorder, skip, or rewrite the algorithm's skeleton — subclasses may only fill in the designated steps." },
          { id: "b", label: "Because final methods execute faster than virtual ones." },
          { id: "c", label: "So the base class can be instantiated directly." },
          { id: "d", label: "Because abstract classes require at least one final method." },
        ],
        correctOptionId: "a",
        explanation:
          "The whole value of the pattern is that the step order is a guarantee. Marking prepare() final locks the sequence in the base class: Tea can change what brew() does, but it can never brew before boiling. The other options are either irrelevant micro-optimisation claims or simply untrue.",
      },
      {
        id: "template-method-q3",
        question: "In the hot-drink example, `wantsExtras()` returns true by default and subclasses may override it. What is such a step called, and how does it differ from `brew()`?",
        options: [
          { id: "a", label: "It's a hook — it has a default implementation subclasses MAY override, while brew() is abstract and every subclass MUST implement it." },
          { id: "b", label: "It's a template method — it defines the whole algorithm's order." },
          { id: "c", label: "It's a static factory — it decides which subclass gets created." },
          { id: "d", label: "There is no difference; both must be overridden by every subclass." },
        ],
        correctOptionId: "a",
        explanation:
          "Hooks are optional extension points: the base class supplies a sensible default (extras are wanted), so most subclasses ignore it, but BlackCoffee can override it to return false and the skeleton skips addExtras(). Abstract steps like brew() have no default — the class won't compile/instantiate until a subclass supplies them.",
      },
      {
        id: "template-method-q4",
        question: "What does the 'Hollywood principle' — don't call us, we'll call you — mean in this pattern?",
        options: [
          { id: "a", label: "The base class controls the flow: its template method calls the subclass's step implementations at the right moments, not the other way round." },
          { id: "b", label: "Subclasses must call super.prepare() at the start of every overridden method." },
          { id: "c", label: "Clients should call each step individually instead of calling prepare()." },
          { id: "d", label: "Methods should be named after the movies that inspired them." },
        ],
        correctOptionId: "a",
        explanation:
          "Control is inverted: Tea never orchestrates anything — it hands its brew() and addExtras() to the parent, and HotDrink.prepare() invokes them at the right points in the fixed sequence. This is the same relationship a framework has with your code: it owns the lifecycle and calls your overrides.",
      },
      {
        id: "template-method-q5",
        question: "Your app must let users switch a document exporter between PDF and CSV *while the program is running*. Why is Strategy a better fit than Template Method here?",
        options: [
          { id: "a", label: "Strategy swaps the whole algorithm via composition at runtime; Template Method varies steps via inheritance, which is fixed at compile time — an object can't change its superclass mid-flight." },
          { id: "b", label: "Template Method cannot express any algorithm with more than three steps." },
          { id: "c", label: "Strategy is newer and deprecated Template Method." },
          { id: "d", label: "Template Method only works in languages that have a final keyword." },
        ],
        correctOptionId: "a",
        explanation:
          "Inheritance is a compile-time decision — a PdfExporter subclass can never become a CsvExporter at runtime. Strategy composes instead: the document holds an exporter object and you hand it a different one whenever the user switches. Template Method shines when the variation is small, step-shaped, and known up front; Strategy when whole algorithms must be interchangeable on the fly.",
      },
    ],
  },
};
