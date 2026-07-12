import type { RoadmapLesson } from "@/lib/content/types";

export const abstractFactory: RoadmapLesson = {
  title: "Abstract Factory",
  oneLiner:
    "Build a whole family of matching objects from one factory, so they always go together. Pick the Dark theme factory and every widget it makes — button, checkbox, card — comes out dark and consistent, and you can never accidentally mix a dark button with a light card.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/abstract-factory.html",
  content: {
    prototypeCaption:
      "A live **UI theme kit**. Pick one of three theme chips — ☀️ **Light**, 🌙 **Dark**, or 🌊 **Ocean** — and that single choice instantly builds a *matching set* of three real widgets inside a phone-style preview: a styled **Button**, a **Checkbox** with a label, and a **Card**. Switch themes and the *whole family* re-skins together, always consistent. Beside it, a **client-code panel** stays byte-for-byte identical across every theme (`const ui = ThemeFactory.for(theme)` → `render(...)`), tagged *client code: unchanged ✓* — proof that one factory swap re-skins everything. Then hit **⚠ Try to mix manually** to switch to a mode with three separate pickers: choose a Dark button and a Light card and a red **consistency check: ✗ MISMATCH** banner appears over the ugly clashing result. Flip back to factory mode and it returns to **✓ consistent** — the Abstract Factory makes the mismatch impossible. The single explain panel narrates which family was built each time.",

    overview: [
      {
        type: "p",
        text: "**Abstract Factory** is a pattern for building a whole **family of matching objects** in one go, so they always fit together. Instead of creating each object on its own and hoping they match, you pick *one* factory and it hands you the complete, guaranteed-consistent set.",
      },
      {
        type: "p",
        text: "Think of a **UI theme kit**. An app's widgets must all share one look — you'd never ship a screen with a dark button next to a light card; it looks broken. So imagine a factory for each theme. The `LightThemeFactory` knows how to make a light button, a light checkbox, and a light card. The `DarkThemeFactory` makes the dark versions. Your app picks *one* factory at the start, asks it for a button, a checkbox, and a card — and every piece comes out in the same theme, automatically. You never mix and match by hand, so you can never get it wrong.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "An Abstract Factory makes a **family of related objects that must go together** — you choose one factory, and everything it builds is guaranteed to match.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Factory Method vs Abstract Factory — the key difference",
        text: "**Factory Method** (the previous lesson) creates **one** product through a method you can override. **Abstract Factory** creates a **whole family of related products** — a button *and* a checkbox *and* a card — that all belong to the same set. If you only need one kind of thing, use Factory Method. When several things must be created together and stay consistent, that's Abstract Factory.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The four moving parts" },
      {
        type: "p",
        text: "Abstract Factory has four roles. They look like a lot at first, but each one is small, and together they lock in the 'always matching' guarantee:",
      },
      {
        type: "ul",
        items: [
          "**Abstract products** — one interface per *kind* of thing in the family: `Button`, `Checkbox`, `Card`. These say *what* a button can do, not what it looks like.",
          "**Concrete products** — the real theme versions: `LightButton`, `DarkButton`, `LightCard`, `DarkCard`, and so on. Each one implements its abstract product.",
          "**The abstract factory** — one interface, `ThemeFactory`, with a create method per product: `createButton()`, `createCheckbox()`, `createCard()`.",
          "**Concrete factories** — `LightThemeFactory`, `DarkThemeFactory`, `OceanThemeFactory`. Each one builds *its own* matching set of concrete products, and nothing else.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `interface Button   { render(): string; }
interface Checkbox { render(): string; }
interface Card     { render(): string; }

// One factory interface for the whole family.
interface ThemeFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  createCard(): Card;
}

// A concrete factory builds ONLY its theme's matching set.
class DarkThemeFactory implements ThemeFactory {
  createButton()   { return new DarkButton(); }
  createCheckbox() { return new DarkCheckbox(); }
  createCard()     { return new DarkCard(); }
}`,
      },
      {
        type: "p",
        text: "Notice that `DarkThemeFactory` can *only* make dark parts. There is no method on it that returns a light card. That's the whole trick: because a single factory builds the entire family, the family can't be mixed. Consistency isn't something the developer has to remember — it's built into the structure.",
      },
      { type: "h", text: "The client stays theme-agnostic" },
      {
        type: "p",
        text: "The best part is the code that *uses* the widgets. It receives *some* `ThemeFactory` and never asks which one. It just calls `createButton()`, `createCheckbox()`, `createCard()` and lays them out. It has no idea whether it's building a light UI or a dark one — and it doesn't care:",
      },
      {
        type: "code",
        language: "typescript",
        code: `function buildUI(factory: ThemeFactory) {
  const button   = factory.createButton();
  const checkbox = factory.createCheckbox();
  const card     = factory.createCard();
  // The client never mentions Light or Dark — it just wires them up.
  return [button.render(), checkbox.render(), card.render()];
}

buildUI(new DarkThemeFactory());   // a fully dark UI
buildUI(new LightThemeFactory());  // the same code, a fully light UI`,
      },
      {
        type: "callout",
        variant: "success",
        title: "Swap the family in one line",
        text: "Because the client only depends on the *interfaces*, switching the entire look of the app is a **one-line change**: pass a different factory. Every widget re-skins together, and it's *impossible* to get a half-updated screen.",
      },
      { type: "h", text: "Adding a new theme is cheap" },
      {
        type: "p",
        text: "Want an Ocean theme? Write `OceanButton`, `OceanCheckbox`, `OceanCard`, and one new `OceanThemeFactory` that builds them. You add code without touching any existing factory or the client. That's the **Open/Closed Principle** in action: open for extension (new themes), closed for modification (nothing old changes). The catch to know: adding a *new kind of product* — say every theme now needs a `Slider` too — means editing the `ThemeFactory` interface and every concrete factory. Families are easy to add; new family *members* are not.",
      },
    ],

    handsOn: [
      {
        title: "01 · Build a matching family in one click",
        body: "Open the prototype in factory mode. Click the 🌙 Dark chip. Watch all three widgets in the preview — Button, Checkbox, and Card — appear together in the dark theme. Now click ☀️ Light, then 🌊 Ocean. Each click swaps the *whole* family at once, and every widget always matches. That single chip is you choosing one concrete factory.",
      },
      {
        title: "02 · Notice the client code never changes",
        body: "Keep switching themes and watch the client-code panel on the right. The lines `const ui = ThemeFactory.for(theme)` and `render(ui.createButton(), ui.createCheckbox(), ui.createCard())` stay exactly the same for Light, Dark, and Ocean — it's tagged 'client code: unchanged ✓'. Only the factory you passed in changed. That's the client staying theme-agnostic.",
      },
      {
        title: "03 · Try to break it, and see why you can't (in real code)",
        body: "Click ⚠ Try to mix manually to enter the danger mode with three separate pickers. Give the button one theme and the card another — a red 'consistency check: ✗ MISMATCH' banner appears over the clashing result. Now switch back to factory mode: it snaps to '✓ consistent'. This is the whole point — with one factory building the family, a mismatch simply can't happen.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "theme-kit.ts",
        code: `// --- Abstract products: what each widget can do ---
interface Button   { render(): string; }
interface Checkbox { render(): string; }

// --- Concrete products for the Light theme ---
class LightButton   implements Button   { render() { return "[ Light Button ]"; } }
class LightCheckbox implements Checkbox { render() { return "[x] Light Checkbox"; } }

// --- Concrete products for the Dark theme ---
class DarkButton   implements Button   { render() { return "[ Dark Button ]"; } }
class DarkCheckbox implements Checkbox { render() { return "[x] Dark Checkbox"; } }

// --- The abstract factory: one create method per product ---
interface ThemeFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// --- Concrete factories: each builds ONLY its own matching family ---
class LightThemeFactory implements ThemeFactory {
  createButton()   { return new LightButton(); }
  createCheckbox() { return new LightCheckbox(); }
}
class DarkThemeFactory implements ThemeFactory {
  createButton()   { return new DarkButton(); }
  createCheckbox() { return new DarkCheckbox(); }
}

// --- Client: takes ANY factory, never knows the theme ---
function buildUI(factory: ThemeFactory): string[] {
  return [factory.createButton().render(), factory.createCheckbox().render()];
}

buildUI(new DarkThemeFactory());   // fully dark, guaranteed to match
buildUI(new LightThemeFactory());  // same code, fully light`,
      },
      {
        label: "Java",
        language: "java",
        filename: "ThemeKit.java",
        code: `// --- Abstract products ---
interface Button   { String render(); }
interface Checkbox { String render(); }

// --- Concrete products: Light theme ---
class LightButton   implements Button   { public String render() { return "[ Light Button ]"; } }
class LightCheckbox implements Checkbox { public String render() { return "[x] Light Checkbox"; } }

// --- Concrete products: Dark theme ---
class DarkButton   implements Button   { public String render() { return "[ Dark Button ]"; } }
class DarkCheckbox implements Checkbox { public String render() { return "[x] Dark Checkbox"; } }

// --- The abstract factory ---
interface ThemeFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// --- Concrete factories: each builds only its own family ---
class LightThemeFactory implements ThemeFactory {
    public Button createButton()     { return new LightButton(); }
    public Checkbox createCheckbox() { return new LightCheckbox(); }
}
class DarkThemeFactory implements ThemeFactory {
    public Button createButton()     { return new DarkButton(); }
    public Checkbox createCheckbox() { return new DarkCheckbox(); }
}

// --- Client: depends only on the interfaces, never the theme ---
class App {
    static String[] buildUI(ThemeFactory factory) {
        return new String[]{ factory.createButton().render(),
                             factory.createCheckbox().render() };
    }
    // buildUI(new DarkThemeFactory());  -> fully dark, guaranteed to match
    // buildUI(new LightThemeFactory()); -> same code, fully light
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "theme_kit.py",
        code: `from abc import ABC, abstractmethod

# --- Abstract products ---
class Button(ABC):
    @abstractmethod
    def render(self) -> str: ...

class Checkbox(ABC):
    @abstractmethod
    def render(self) -> str: ...

# --- Concrete products: Light theme ---
class LightButton(Button):
    def render(self) -> str: return "[ Light Button ]"
class LightCheckbox(Checkbox):
    def render(self) -> str: return "[x] Light Checkbox"

# --- Concrete products: Dark theme ---
class DarkButton(Button):
    def render(self) -> str: return "[ Dark Button ]"
class DarkCheckbox(Checkbox):
    def render(self) -> str: return "[x] Dark Checkbox"

# --- The abstract factory ---
class ThemeFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: ...
    @abstractmethod
    def create_checkbox(self) -> Checkbox: ...

# --- Concrete factories: each builds only its own family ---
class LightThemeFactory(ThemeFactory):
    def create_button(self) -> Button:     return LightButton()
    def create_checkbox(self) -> Checkbox: return LightCheckbox()

class DarkThemeFactory(ThemeFactory):
    def create_button(self) -> Button:     return DarkButton()
    def create_checkbox(self) -> Checkbox: return DarkCheckbox()

# --- Client: takes any factory, never knows the theme ---
def build_ui(factory: ThemeFactory) -> list[str]:
    return [factory.create_button().render(), factory.create_checkbox().render()]

build_ui(DarkThemeFactory())    # fully dark, guaranteed to match
build_ui(LightThemeFactory())   # same code, fully light`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "theme_kit.cpp",
        code: `#include <memory>
#include <string>
#include <vector>

// --- Abstract products ---
struct Button   { virtual std::string render() const = 0; virtual ~Button() = default; };
struct Checkbox { virtual std::string render() const = 0; virtual ~Checkbox() = default; };

// --- Concrete products: Light theme ---
struct LightButton   : Button   { std::string render() const override { return "[ Light Button ]"; } };
struct LightCheckbox : Checkbox { std::string render() const override { return "[x] Light Checkbox"; } };

// --- Concrete products: Dark theme ---
struct DarkButton   : Button   { std::string render() const override { return "[ Dark Button ]"; } };
struct DarkCheckbox : Checkbox { std::string render() const override { return "[x] Dark Checkbox"; } };

// --- The abstract factory ---
struct ThemeFactory {
    virtual std::unique_ptr<Button>   createButton()   const = 0;
    virtual std::unique_ptr<Checkbox> createCheckbox() const = 0;
    virtual ~ThemeFactory() = default;
};

// --- Concrete factories: each builds only its own family ---
struct LightThemeFactory : ThemeFactory {
    std::unique_ptr<Button>   createButton()   const override { return std::make_unique<LightButton>(); }
    std::unique_ptr<Checkbox> createCheckbox() const override { return std::make_unique<LightCheckbox>(); }
};
struct DarkThemeFactory : ThemeFactory {
    std::unique_ptr<Button>   createButton()   const override { return std::make_unique<DarkButton>(); }
    std::unique_ptr<Checkbox> createCheckbox() const override { return std::make_unique<DarkCheckbox>(); }
};

// --- Client: depends only on the abstract factory, never the theme ---
std::vector<std::string> buildUI(const ThemeFactory& f) {
    return { f.createButton()->render(), f.createCheckbox()->render() };
}
// buildUI(DarkThemeFactory{});  -> fully dark, guaranteed to match`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Use Abstract Factory when several things must be created together and match" },
      {
        type: "p",
        text: "Reach for it whenever your program needs to build a *set* of related objects that only make sense as a matched group, and you may want to swap the whole set for another:",
      },
      {
        type: "ul",
        items: [
          "**Cross-platform UI toolkits** — a Windows widget set (Windows button, Windows scrollbar, Windows menu) versus a macOS set. One factory per platform hands your app a whole native-looking family.",
          "**Swappable database drivers** — a connection, a command, and a reader that must all come from the *same* driver. A `PostgresFactory` or `MySqlFactory` builds the matching trio so they speak the same protocol.",
          "**Light / dark / branded theming** — exactly the prototype's case: one factory per theme, and every widget it produces is guaranteed to share the look.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't reach for it when you only need one product",
        text: "If you're only creating *one* kind of thing — just a button, with no related checkbox or card that has to match — an Abstract Factory is overkill. Use **Factory Method** (or a plain function) instead. Abstract Factory earns its extra interfaces only when there's a genuine *family* whose members must stay consistent.",
      },
    ],

    tradeoffs: {
      pros: [
        "Guarantees a consistent family — because one factory builds the whole set, you can never accidentally mix a Dark button with a Light card.",
        "The client stays decoupled from concrete classes — it works against the ThemeFactory interface and never names Light, Dark, or Ocean, so it doesn't change when themes do.",
        "Swapping the whole family is one line — pass a different factory and every product re-skins together.",
        "Adding a new theme is easy and safe — write one new concrete factory and its products; existing factories and client code stay untouched (Open/Closed).",
      ],
      cons: [
        "Lots of classes and interfaces — even a small family needs abstract products, concrete products, an abstract factory, and concrete factories. It's heavyweight for simple needs.",
        "Adding a new product kind is painful — introducing, say, a Slider means editing the ThemeFactory interface and every single concrete factory.",
        "Indirection can obscure the flow — you can't see which concrete class you'll get by reading the client; you have to trace back to which factory was passed in.",
        "Easy to over-apply — reaching for it when you only ever create one product adds ceremony without any real 'family' to keep consistent.",
      ],
    },

    furtherReading: [
      {
        label: "Abstract Factory — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/abstract-factory",
        note: "The clearest illustrated walkthrough: the problem, the family-of-products structure, the furniture/theme analogy, and code in many languages. Best first read.",
        kind: "article",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that defined Abstract Factory. The primary source for its formal intent, structure, and the classic 'kit of widgets' motivation.",
        kind: "book",
      },
      {
        label: "Abstract Factory pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Abstract_factory_pattern",
        note: "Concise reference covering the roles (abstract/concrete factories and products), the relationship to Factory Method, and common examples like GUI toolkits.",
        kind: "docs",
      },
      {
        label: "Abstract Factory vs Factory Method — Baeldung",
        href: "https://www.baeldung.com/java-abstract-factory-pattern",
        note: "A focused Java tutorial that builds a theme/widget example and clearly contrasts Abstract Factory (a family) with Factory Method (a single product).",
        kind: "article",
      },
      {
        label: "Abstract Factory Pattern — Christopher Okhravi (video)",
        href: "https://www.youtube.com/watch?v=v-GiuMmsXj4",
        note: "A friendly whiteboard explanation that walks through the intent and the family-of-products idea step by step, with live code.",
        kind: "video",
      },
      {
        label: "Head First Design Patterns — Freeman & Robson (Factory chapter)",
        href: "https://www.oreilly.com/library/view/head-first-design/9781492077992/",
        note: "The beginner-favourite book. Its pizza-store example teaches Factory Method and then Abstract Factory (ingredient families) in a memorable, plain-English way.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "abstract-factory-q1",
        question: "What does the Abstract Factory pattern give you?",
        options: [
          { id: "a", label: "A way to create a whole family of related objects that are guaranteed to match." },
          { id: "b", label: "A guarantee that a class has exactly one instance." },
          { id: "c", label: "A single method that builds one product and nothing else." },
          { id: "d", label: "A way to copy an existing object instead of building a new one." },
        ],
        correctOptionId: "a",
        explanation:
          "Abstract Factory's job is to produce a whole family of related products (button, checkbox, card) that belong together and stay consistent. Option (b) is Singleton, (c) leans toward Factory Method, and (d) is the Prototype pattern.",
      },
      {
        id: "abstract-factory-q2",
        question: "How does Abstract Factory differ from Factory Method?",
        options: [
          { id: "a", label: "Factory Method creates one product; Abstract Factory creates a whole family of related products that go together." },
          { id: "b", label: "They are two names for exactly the same pattern." },
          { id: "c", label: "Factory Method makes a family; Abstract Factory makes a single object." },
          { id: "d", label: "Abstract Factory only works in Java, while Factory Method works everywhere." },
        ],
        correctOptionId: "a",
        explanation:
          "Factory Method centres on creating a single product through an overridable method. Abstract Factory groups several create methods into one interface so a whole family of related products is built together and stays consistent.",
      },
      {
        id: "abstract-factory-q3",
        question: "Why is it impossible to mix a Dark button with a Light card when you use an Abstract Factory?",
        options: [
          { id: "a", label: "Because a single concrete factory builds the entire family, and it only knows how to make its own theme's parts." },
          { id: "b", label: "Because the compiler randomly picks a matching theme for you at runtime." },
          { id: "c", label: "Because the client manually checks each widget's colour before rendering." },
          { id: "d", label: "Because there is only ever one widget in the whole program." },
        ],
        correctOptionId: "a",
        explanation:
          "Consistency is structural. A DarkThemeFactory has no method that returns a light card — it can only produce dark parts. Since one factory builds the whole set, the family cannot be mixed, and no manual checking is needed.",
      },
      {
        id: "abstract-factory-q4",
        question: "You want to add a brand-new Ocean theme. What does that take?",
        options: [
          { id: "a", label: "Write one new OceanThemeFactory (and its products); existing factories and client code stay untouched." },
          { id: "b", label: "Edit every existing factory and rewrite the client code." },
          { id: "c", label: "Change the abstract ThemeFactory interface for every new theme." },
          { id: "d", label: "Delete the Light and Dark factories first." },
        ],
        correctOptionId: "a",
        explanation:
          "Adding a new *family* is cheap: you write one new concrete factory plus its concrete products. Nothing existing changes — that's the Open/Closed Principle. (Adding a new *kind of product* to every theme is the harder case, since it touches the factory interface.)",
      },
      {
        id: "abstract-factory-q5",
        question: "In the pattern, what does the client code know about the concrete theme?",
        options: [
          { id: "a", label: "Nothing — it works against the ThemeFactory interface and never names Light, Dark, or Ocean." },
          { id: "b", label: "It hard-codes the Dark theme so it always looks the same." },
          { id: "c", label: "It checks which theme is active with a big if/else before each widget." },
          { id: "d", label: "It creates each widget with `new` directly." },
        ],
        correctOptionId: "a",
        explanation:
          "The client stays theme-agnostic: it receives some ThemeFactory and just calls createButton(), createCheckbox(), createCard(). Because it depends only on interfaces, swapping the entire look is a one-line change — pass a different factory.",
      },
    ],
  },
};
