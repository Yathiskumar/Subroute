import type { RoadmapLesson } from "@/lib/content/types";

export const builder: RoadmapLesson = {
  title: "Builder",
  oneLiner:
    "Build a complex object one clear step at a time instead of jamming everything into one giant constructor. You call small named methods like `.addCheese()` and finish with `.build()`, so the code reads like a recipe and you can skip the parts you don't want.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/builder.html",
  content: {
    prototypeCaption:
      "Build a burger by clicking ingredient toggles — **🥩 Patty, 🧀 Cheese, 🥓 Bacon, 🥬 Lettuce, 🍅 Tomato, 🧂 Sauce, and 🥩🥩 Double Patty** (the bun is always there, top and bottom). Two things update together on every click: a **visual burger stack** where each layer drops in or out, and a **live builder-code panel** where the fluent chain grows and shrinks — `new BurgerBuilder().addCheese()…build()` — always ending in `.build()`. Flip the **⚙ Constructor way ↔ Builder way** switch to see the *same* burger built with the awful telescoping constructor `new Burger(true, false, true, …)` where nobody can tell which boolean is cheese, next to the readable builder chain. Two **Director** buttons — **🍔 Classic Cheeseburger** and **🥬 Veggie Deluxe** — fill the whole burger in one click by running a fixed recipe of steps. The single explain panel narrates each toggle; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "The **Builder** pattern helps you create a complex object **one readable step at a time** instead of passing every option into one big constructor at once. You call small, clearly named methods — `.addPatty()`, `.addCheese()`, `.addBacon()` — and then call `.build()` to get the finished object back. Each step is optional and the order is flexible, so the code reads like a recipe.",
      },
      {
        type: "p",
        text: "Think about **building a burger**. A burger has a bun and then a bunch of *optional* parts: a patty, cheese, bacon, lettuce, tomato, sauce, maybe a second patty. If you tried to make one with a single constructor, you'd end up writing `new Burger(true, false, true, true, false, true, false)` — and nobody looking at that line can tell which `true` is the cheese and which is the bacon. With a Builder you write `new BurgerBuilder().addPatty().addCheese().addBacon().build()` instead. Now every part is *named*, you only mention the parts you actually want, and the line reads out loud like an order at the counter.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A Builder lets you assemble an object step by step with named methods and finish with `.build()`, so a pile of confusing constructor arguments becomes a self-explaining chain: `new BurgerBuilder().addCheese().addBacon().build()`.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The problem it kills: the telescoping constructor",
        text: "When a class has many optional fields, people tend to add more and more constructor arguments (or a growing stack of overloaded constructors) until you get a long row of `true`/`false`/`null` values that only makes sense if you count the positions. That mess is called the *telescoping constructor* (also nicknamed *param soup*). The Builder replaces that unreadable row of arguments with a chain of named steps.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The two pieces: a Product and its Builder" },
      {
        type: "p",
        text: "A Builder setup has just two moving parts. The **Product** is the thing you actually want (the finished `Burger`). The **Builder** is a small helper object that collects your choices and then hands you the finished product:",
      },
      {
        type: "ul",
        items: [
          "**The Builder holds the choices so far.** As you call `.addCheese()` or `.addBacon()`, the builder just records that choice inside itself. Nothing is finished yet — you're still gathering ingredients.",
          "**Each step returns `this`.** Every method ends by returning the builder itself, so you can immediately call the next method on it. That's the trick that lets the calls *chain* into one readable line — it's called a *fluent* interface.",
          "**`build()` returns the finished Product.** The very last call takes everything the builder gathered and constructs the real `Burger` from it, then hands it back. Ideally the returned burger is *immutable* — done and unchangeable — so nobody can quietly alter it afterwards.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `class BurgerBuilder {
  private parts: string[] = ["bun-bottom"];   // bun is always there

  addPatty()  { this.parts.push("patty");   return this; }  // return this →
  addCheese() { this.parts.push("cheese");  return this; }  // lets calls chain
  addBacon()  { this.parts.push("bacon");   return this; }

  build(): Burger {                            // finish → hand back the product
    this.parts.push("bun-top");
    return new Burger(this.parts);
  }
}

// Reads like an order: patty, cheese, bacon — done.
const burger = new BurgerBuilder()
  .addPatty()
  .addCheese()
  .addBacon()
  .build();`,
      },
      {
        type: "p",
        text: "Notice how you only mention the parts you want. No cheese? Just don't call `.addCheese()`. Want two patties? Call `.addPatty()` twice. The order is up to you, and every line says exactly what it does — there is no row of mystery booleans to decode.",
      },
      {
        type: "callout",
        variant: "info",
        title: "\"return this\" is the whole trick behind the chain",
        text: "Each step returns the builder itself (`return this`), so the value of `.addPatty()` *is* the builder, ready for `.addCheese()` to be called on it. Chain them and you get one flowing sentence. This style — methods that return the object so calls link together — is called a *fluent interface*.",
      },
      { type: "h", text: "The Director: a helper that runs a known recipe" },
      {
        type: "p",
        text: "Sometimes the same combination of steps gets used over and over — a *Classic Cheeseburger* is always bun, patty, cheese, sauce. Instead of making every caller remember that recipe, you can wrap it in a **Director**: a small helper whose job is to run a *fixed sequence* of builder steps for you.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class BurgerDirector {
  // The Director knows the recipe; the caller doesn't have to.
  classicCheeseburger(b: BurgerBuilder): Burger {
    return b.addPatty().addCheese().addSauce().build();
  }
}

const burger = new BurgerDirector()
  .classicCheeseburger(new BurgerBuilder());   // one call → a preset burger`,
      },
      {
        type: "p",
        text: "Now a caller who just wants the standard cheeseburger asks the Director for it and gets a finished burger — without knowing or repeating the individual steps. The Director is optional: you only reach for it when you have a few named presets worth naming. The prototype's two preset buttons (*Classic Cheeseburger* and *Veggie Deluxe*) are exactly this idea — one click runs a fixed recipe of builder steps.",
      },
      { type: "h", text: "Why the constructor way goes wrong" },
      {
        type: "p",
        text: "If you build the same burger with a plain constructor, you have to pass a value for *every* optional part in a fixed position: `new Burger(true, true, false, true, false, true, false)`. Which flag is cheese? Which is bacon? You can't tell without opening the constructor and counting. Add one more topping later and every call site with that long argument list can silently break. The Builder makes each choice *named and optional*, so the code stays readable no matter how many toppings exist. Flip the prototype's *Constructor way ↔ Builder way* switch to feel the difference on the very same burger.",
      },
    ],

    handsOn: [
      {
        title: "01 · Toggle toppings and watch two views move together",
        body: "Open the prototype. Click 🧀 Cheese, then 🥓 Bacon. Two things update at once: the burger stack drops a cheese layer and a bacon layer in, and the code panel grows two new lines — `.addCheese()` and `.addBacon()` — always sitting above the final `.build()`. Toggle 🧀 Cheese off again and watch both the layer and the `.addCheese()` line disappear. This is 'build the object step by step' made visible.",
      },
      {
        title: "02 · Flip Constructor way ↔ Builder way",
        body: "Add a few toppings, then click the ⚙ Constructor way ↔ Builder way switch. The code panel now shows the *same* burger as one telescoping constructor: `new Burger(true, false, true, …)` with tiny labels asking 'which boolean is cheese?!'. Flip back to the Builder way and the readable named chain returns. This is the core 'why' of the pattern — same object, wildly different readability.",
      },
      {
        title: "03 · Let the Director run a recipe",
        body: "Click 🍔 Classic Cheeseburger. In one click the toggles, the burger stack, and the code chain all fill in with a fixed recipe — you didn't pick the steps, the Director did. Now click 🥬 Veggie Deluxe and watch it swap to a different preset. That's the Director: a helper that runs a known sequence of builder steps so callers get a preset without knowing the individual steps.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "burger.ts",
        code: `// 😖 The telescoping constructor — which boolean is cheese?!
// new Burger(true, false, true, true, false, true, false);

class Burger {
  constructor(readonly parts: string[]) {}   // finished & immutable
  toString() { return this.parts.join(" · "); }
}

class BurgerBuilder {
  private parts: string[] = ["bun-bottom"];  // bun is always present

  addPatty()  { this.parts.push("patty");  return this; }   // return this →
  addCheese() { this.parts.push("cheese"); return this; }   // enables chaining
  addBacon()  { this.parts.push("bacon");  return this; }
  addSauce()  { this.parts.push("sauce");  return this; }

  build(): Burger {                          // hand back the finished product
    this.parts.push("bun-top");
    return new Burger(this.parts);
  }
}

// A Director bundles a fixed recipe of steps into one call (optional).
class BurgerDirector {
  classicCheeseburger(b: BurgerBuilder): Burger {
    return b.addPatty().addCheese().addSauce().build();
  }
}

// Client: named, optional, order-flexible steps → one readable line.
const custom = new BurgerBuilder().addPatty().addBacon().build();
const classic = new BurgerDirector().classicCheeseburger(new BurgerBuilder());
console.log(custom.toString());   // bun-bottom · patty · bacon · bun-top`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Burger.java",
        code: `import java.util.*;

// 😖 The telescoping constructor this replaces:
// new Burger(true, false, true, true, false, true, false);

public final class Burger {                     // finished & immutable product
    private final List<String> parts;
    private Burger(List<String> parts) { this.parts = parts; }
    @Override public String toString() { return String.join(" · ", parts); }

    // The classic static nested Builder.
    public static class Builder {
        private final List<String> parts = new ArrayList<>(List.of("bun-bottom"));

        public Builder addPatty()  { parts.add("patty");  return this; } // return this →
        public Builder addCheese() { parts.add("cheese"); return this; } // enables chaining
        public Builder addBacon()  { parts.add("bacon");  return this; }
        public Builder addSauce()  { parts.add("sauce");  return this; }

        public Burger build() {                 // hand back the finished product
            parts.add("bun-top");
            return new Burger(parts);
        }
    }
}

// A Director runs a fixed recipe of steps (optional).
class BurgerDirector {
    Burger classicCheeseburger(Burger.Builder b) {
        return b.addPatty().addCheese().addSauce().build();
    }
}

// Burger custom = new Burger.Builder().addPatty().addBacon().build();
// Burger classic = new BurgerDirector().classicCheeseburger(new Burger.Builder());`,
      },
      {
        label: "Python",
        language: "python",
        filename: "burger.py",
        code: `from dataclasses import dataclass, field

# 😖 The telescoping constructor this replaces:
# Burger(True, False, True, True, False, True, False)

@dataclass(frozen=True)          # frozen → finished & immutable product
class Burger:
    parts: tuple[str, ...]
    def __str__(self) -> str:
        return " · ".join(self.parts)

class BurgerBuilder:
    def __init__(self) -> None:
        self._parts = ["bun-bottom"]         # bun is always present

    def add_patty(self):  self._parts.append("patty");  return self   # return self →
    def add_cheese(self): self._parts.append("cheese"); return self   # enables chaining
    def add_bacon(self):  self._parts.append("bacon");  return self
    def add_sauce(self):  self._parts.append("sauce");  return self

    def build(self) -> Burger:               # hand back the finished product
        self._parts.append("bun-top")
        return Burger(tuple(self._parts))

# A Director runs a fixed recipe of steps (optional).
def classic_cheeseburger(b: BurgerBuilder) -> Burger:
    return b.add_patty().add_cheese().add_sauce().build()

custom = BurgerBuilder().add_patty().add_bacon().build()
print(custom)                    # bun-bottom · patty · bacon · bun-top

# ⚠️ In Python you often DON'T need a Builder: keyword args and dataclasses
# already give named, optional fields, e.g. Burger(cheese=True, bacon=True).
# Reach for a real Builder mainly for step-by-step assembly or validation.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "burger.cpp",
        code: `#include <string>
#include <vector>

// 😖 The telescoping constructor this replaces:
// Burger(true, false, true, true, false, true, false);

class Burger {                                  // finished product
    std::vector<std::string> parts;
public:
    explicit Burger(std::vector<std::string> p) : parts(std::move(p)) {}
    const std::vector<std::string>& contents() const { return parts; }
};

class BurgerBuilder {
    std::vector<std::string> parts{"bun-bottom"};   // bun is always present
public:
    BurgerBuilder& addPatty()  { parts.push_back("patty");  return *this; } // return *this →
    BurgerBuilder& addCheese() { parts.push_back("cheese"); return *this; } // enables chaining
    BurgerBuilder& addBacon()  { parts.push_back("bacon");  return *this; }
    BurgerBuilder& addSauce()  { parts.push_back("sauce");  return *this; }

    Burger build() {                            // hand back the finished product
        parts.push_back("bun-top");
        return Burger(parts);
    }
};

// A Director runs a fixed recipe of steps (optional).
struct BurgerDirector {
    Burger classicCheeseburger(BurgerBuilder& b) {
        return b.addPatty().addCheese().addSauce().build();
    }
};

// auto custom = BurgerBuilder().addPatty().addBacon().build();
// BurgerBuilder b; auto classic = BurgerDirector().classicCheeseburger(b);`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a Builder when construction gets messy" },
      {
        type: "p",
        text: "The Builder shines whenever making an object with a plain constructor would be confusing, error-prone, or rigid:",
      },
      {
        type: "ul",
        items: [
          "**Many optional fields.** When an object has lots of parts that may or may not be present, a Builder lets callers set only the ones they want by name instead of passing a long line of `true`/`false`/`null`.",
          "**The object should be immutable once built.** Gather all the choices in the builder, then produce a finished object that can't be changed afterwards — a very common and safe pattern.",
          "**Step-by-step or validated assembly.** Config objects, HTTP request builders, SQL query builders, `StringBuilder`, and test-data builders all assemble a result piece by piece, sometimes checking rules before `build()` hands it back.",
          "**A few named presets exist.** When common combinations repeat (a *Classic Cheeseburger*), a Director wraps the recipe so callers get the preset in one call.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't reach for a Builder when a constructor will do",
        text: "A Builder is extra code — a whole second class with a method per field. If your object has just two or three required fields and no real optional ones, a plain constructor (or, in Python, keyword arguments / a dataclass) is clearer and shorter. Use the Builder to tame *genuinely* complex construction, not to dress up a simple object.",
      },
    ],

    tradeoffs: {
      pros: [
        "Readable, self-documenting creation — `.addCheese().addBacon()` says exactly what each step does, unlike a row of positional booleans.",
        "Only set what you want — optional parts are simply omitted, so there's no long list of nulls/defaults to pass through.",
        "Order-flexible and hard to misuse — named steps can't be swapped by accident the way positional arguments can.",
        "Produces immutable products cleanly — gather choices in the builder, then hand back a finished object nobody can alter.",
        "Presets via a Director — common recipes get a single named entry point without callers repeating the steps.",
      ],
      cons: [
        "More code to write — you add a separate builder class with a method per field, which is overkill for simple objects.",
        "Indirection — construction is split across the product and its builder, so there's one more hop to follow when reading the code.",
        "Often unnecessary in some languages — Python's keyword arguments and Kotlin/Scala default+named parameters already give named, optional fields without a builder.",
        "Easy to leave the product half-built — if you forget to call `.build()` (or a required step), you may get a builder or an incomplete object instead of what you wanted.",
      ],
    },

    furtherReading: [
      {
        label: "Builder — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/builder",
        note: "The clearest illustrated walkthrough: the telescoping-constructor problem, the Builder + Director structure, real-world analogy, and code in several languages. Best first read.",
        kind: "article",
      },
      {
        label: "Effective Java (Joshua Bloch) — Item 2: Consider a builder when faced with many constructor parameters",
        href: "https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/",
        note: "The definitive argument for the Builder over telescoping constructors and JavaBeans setters, with the classic static-nested-Builder pattern used in the Java sample here.",
        kind: "book",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Builder as a creational pattern, with the formal Product/Builder/Director roles.",
        kind: "book",
      },
      {
        label: "The Builder Pattern in Java — Baeldung",
        href: "https://www.baeldung.com/java-builder-pattern",
        note: "A hands-on Java tutorial building the static nested Builder step by step, including validation in build() and the fluent-chain style.",
        kind: "article",
      },
      {
        label: "Builder pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Builder_pattern",
        note: "Concise reference covering the Product/Builder/Director roles, the fluent variant, and how the pattern differs from Factory and Abstract Factory.",
        kind: "docs",
      },
      {
        label: "Builder Design Pattern — Christopher Okhravi (video)",
        href: "https://www.youtube.com/watch?v=oP76NM4qZhw",
        note: "A friendly whiteboard explanation of why the Builder exists and how the Director and fluent chain fit together. Good if you prefer watching.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "builder-q1",
        question: "What core problem does the Builder pattern solve?",
        options: [
          { id: "a", label: "Creating an object with many optional parts without a confusing, hard-to-read constructor call (the telescoping constructor)." },
          { id: "b", label: "Making sure a class has exactly one instance for the whole program." },
          { id: "c", label: "Turning a method that returns a value into one that returns nothing." },
          { id: "d", label: "Letting a subclass decide which concrete class to instantiate." },
        ],
        correctOptionId: "a",
        explanation:
          "Builder targets the telescoping constructor: when an object has many optional fields, one constructor with a long row of positional arguments becomes unreadable. Builder replaces it with named, optional, chainable steps. Option (b) is Singleton; (d) is Factory Method.",
      },
      {
        id: "builder-q2",
        question: "In a fluent Builder like `new BurgerBuilder().addPatty().addCheese().build()`, what does the `build()` call do?",
        options: [
          { id: "a", label: "It takes everything the builder gathered and returns the finished product (the Burger)." },
          { id: "b", label: "It resets the builder so you can start a new object." },
          { id: "c", label: "It returns the builder itself so you can keep chaining." },
          { id: "d", label: "It prints the burger to the console." },
        ],
        correctOptionId: "a",
        explanation:
          "The step methods (addPatty, addCheese) record choices and return the builder so calls can chain. build() is the finish line: it assembles and returns the actual product — ideally an immutable, fully-formed object.",
      },
      {
        id: "builder-q3",
        question: "Why can the builder methods be chained into one readable line?",
        options: [
          { id: "a", label: "Each step method returns the builder itself (`this`), so the next method can be called on the result." },
          { id: "b", label: "Because JavaScript and Java automatically chain any method calls." },
          { id: "c", label: "Because the methods are all static." },
          { id: "d", label: "Because build() is called first and passes itself along." },
        ],
        correctOptionId: "a",
        explanation:
          "The chain works because every step returns `this` — the builder object. That returned builder is what the next `.addX()` is called on, letting the calls link into one fluent sentence. This is called a fluent interface.",
      },
      {
        id: "builder-q4",
        question: "What is the role of the Director in the Builder pattern?",
        options: [
          { id: "a", label: "It runs a fixed, known sequence of builder steps (a recipe) so callers get a preset without knowing the individual steps." },
          { id: "b", label: "It stores the single shared instance of the product." },
          { id: "c", label: "It validates that the product is immutable." },
          { id: "d", label: "It is required — a Builder cannot work without a Director." },
        ],
        correctOptionId: "a",
        explanation:
          "A Director wraps a common recipe of builder calls (e.g. a Classic Cheeseburger = patty + cheese + sauce) behind one method, so callers reuse the preset without repeating the steps. It's optional — you only add one when named presets are worth having.",
      },
      {
        id: "builder-q5",
        question: "When is a Builder usually overkill?",
        options: [
          { id: "a", label: "When the object has only a couple of required fields and no real optional ones — a plain constructor is clearer and shorter." },
          { id: "b", label: "Whenever the object needs to be immutable." },
          { id: "c", label: "Whenever there are more than two toppings." },
          { id: "d", label: "When the object is created in more than one place." },
        ],
        correctOptionId: "a",
        explanation:
          "A Builder is a whole extra class with a method per field. That cost only pays off when construction is genuinely complex (many optional fields, step-by-step assembly, validation). For a simple object with a few required fields, a plain constructor — or Python keyword arguments — is the better choice.",
      },
    ],
  },
};
