import type { RoadmapLesson } from "@/lib/content/types";

export const prototypePattern: RoadmapLesson = {
  title: "Prototype",
  oneLiner:
    "When building a new object from scratch is slow or fiddly, take an existing, already-configured object and clone it instead. The Prototype pattern gives objects a `clone()` method that copies the original — a photocopy, not a re-type — so you get an identical copy in one step and then tweak the copy as needed.",
  difficulty: "beginner",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/prototype.html",
  content: {
    prototypeCaption:
      "A game **enemy factory**. On the left you configure **one template enemy** — pick a type (👺 Goblin / 👹 Orc / 🐉 Dragon), a colour, a weapon (🗡️ Sword / 🏹 Bow / 🔥 Fireball), and an HP value. That fiddly setup is the *expensive* part. Then hit the big **⧉ Clone** button and an identical copy pops into the grid on the right — all four fields copied in **one click**, no re-configuring. A cost readout keeps score: *made 5 enemies — from scratch: 5×4 steps · by cloning: 5 clicks*, so cloning is obviously cheaper. A second, clearly-labelled demo shows the classic trap: the template carries a small **inventory** list, and a **Shallow ↔ Deep** toggle. Add an item to a clone's inventory in **Shallow** mode and it *also* appears on the original (red: *shared reference!*); switch to **Deep** mode and the copies stay independent (green: *independent copies*). One or two clicks and the whole idea lands: clone an existing object instead of rebuilding it.",

    overview: [
      {
        type: "p",
        text: "**Prototype** is a creational pattern with a plain-English idea: when making a new object is expensive or fiddly to set up, don't build a fresh one from scratch every time — take one you've *already* configured and **copy it**. Think **photocopying instead of re-typing**. You typed the page once; now you press the button and get an identical copy in a second, then scribble your small changes on the copy.",
      },
      {
        type: "p",
        text: "Picture a game that spawns lots of enemies. Setting up one enemy is a chore: pick the type, the colour, the weapon, the stats, wire it all together. Do that **once** to make a *template* enemy. After that, every time you need another, you call `enemy.clone()` and get an identical copy instantly — same type, same colour, same weapon, same HP — then tweak the copy if you want (maybe bump one clone's HP). The template acts as a living blueprint you stamp out copies from.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Prototype means **clone an existing, already-configured object** instead of building a new one from scratch. The object carries a `clone()` method that returns a copy of itself with all its current field values — so you skip the expensive setup and don't even need to know the object's exact class.",
      },
      {
        type: "callout",
        variant: "info",
        title: "This is NOT the JavaScript prototype chain",
        text: "The name clashes with a JavaScript feature (the `prototype` property used for inheritance). They are unrelated. The Prototype *design pattern* is just 'copy an existing object to make a new one' — it has nothing to do with inheritance or JS internals.",
      },
    ],

    howItWorks: [
      { type: "h", text: "One method does all the work: clone()" },
      {
        type: "p",
        text: "The whole pattern is a single method — usually called `clone()` — that lives on the object and returns a copy of itself. The copy comes back with **all the current field values** already filled in, so the caller never runs the expensive setup and never has to know the concrete class. You ask the object, 'make me another one like you,' and it does.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class Enemy {
  constructor(
    public type: string,     // "Goblin"
    public color: string,    // "#5cc66f"
    public weapon: string,   // "Sword"
    public hp: number,       // 30
  ) {}

  clone(): Enemy {
    // copy every current field into a brand-new object
    return new Enemy(this.type, this.color, this.weapon, this.hp);
  }
}

const template = new Enemy("Goblin", "#5cc66f", "Sword", 30); // configured once
const a = template.clone();   // identical copy, one step
const b = template.clone();   // another one, instantly
b.hp = 45;                    // tweak just this copy`,
      },
      {
        type: "p",
        text: "That's the entire idea. `template.clone()` reads the template's *current* values and stamps out a fresh object holding the same ones. You configured the template once; each clone is a one-liner. And because the caller just calls `clone()`, it doesn't matter whether the object is a Goblin, an Orc, or a Dragon — every one knows how to copy itself.",
      },
      {
        type: "callout",
        variant: "info",
        title: "clone() copies the current state, not just the class",
        text: "A clone isn't 'a new blank Goblin' — it's a copy of *this* Goblin as it is right now, colour and HP and all. If you clone a template after tweaking its HP to 50, the copy has HP 50 too. That's the difference from a factory that always builds a default: Prototype snapshots the object's live state.",
      },
      { type: "h", text: "The one catch: shallow vs deep copy" },
      {
        type: "p",
        text: "There's one thing to watch for, and it's the classic Prototype gotcha. When an object holds a *nested* object inside it — say each enemy has an `inventory` list of items — a plain copy has a choice to make:",
      },
      {
        type: "ul",
        items: [
          "**Shallow copy** — copies the top-level fields, but for the nested list it copies only the *reference* (the pointer), not the list itself. So the clone and the original end up **sharing the same inventory**. Add an item to the clone's inventory and it appears on the original too — they're the same list. Usually a surprise bug.",
          "**Deep copy** — copies the nested objects as well, so the clone gets its *own* inventory. Now editing the clone's list leaves the original untouched. The copies are truly independent.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The shared-reference trap",
        text: "A shallow clone *looks* independent but secretly shares its nested objects with the original. If your objects hold mutable nested data (lists, maps, other objects) and you'll change them per-copy, you almost always want a **deep** copy. The prototype below lets you feel this: add an item to a clone's inventory in Shallow mode and watch it appear on the template too.",
      },
      {
        type: "h", text: "Why not just call the constructor?" },
      {
        type: "p",
        text: "Sometimes you can — if building an object is cheap and simple, a plain `new Enemy(...)` is fine and you don't need this pattern. Prototype earns its keep when setup is **expensive** (loading data, heavy computation), when you need **many similar** objects, or when the code doing the copying **doesn't know the concrete class** — it only has some object and needs 'another like it.' In all those cases, `clone()` is faster and simpler than rebuilding from scratch.",
      },
    ],

    handsOn: [
      {
        title: "01 · Configure once, then clone",
        body: "In the prototype, set up the template enemy on the left: pick a type (try 🐉 Dragon), choose a colour, pick a weapon (🔥 Fireball), and set the HP. Now click the big ⧉ Clone button a few times. Each click drops an identical Dragon into the grid on the right — same colour, same weapon, same HP — copied in one step. Notice you never had to re-pick anything: that's the point of a prototype.",
      },
      {
        title: "02 · Watch the cost counter",
        body: "Keep an eye on the readout under the Clone button. After a few clicks it shows something like 'made 5 enemies — from scratch: 5×4 steps · by cloning: 5 clicks.' Configuring each enemy from scratch would mean setting all 4 fields every single time; cloning is one click each. This is the whole reason the pattern exists — copying beats rebuilding when you need many similar objects.",
      },
      {
        title: "03 · Feel the shallow-vs-deep trap",
        body: "Find the Shallow ↔ Deep toggle and the inventory demo. With it on Shallow, clone the template, then click 'add item' on that clone's inventory — the new item also shows up on the template (highlighted red: shared reference!). Now flip to Deep, clone again, and add an item: this time only the clone changes (green: independent copies). That's shallow vs deep copy made visible.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "enemy.ts",
        code: `class Enemy {
  constructor(
    public type: string,
    public color: string,
    public weapon: string,
    public hp: number,
    public inventory: string[] = [],   // a nested, mutable object
  ) {}

  // Shallow-ish clone: copies fields, but shares the SAME inventory list.
  cloneShallow(): Enemy {
    return new Enemy(this.type, this.color, this.weapon, this.hp, this.inventory);
  }

  // Deep clone: also copies the nested list, so the copy is independent.
  cloneDeep(): Enemy {
    return new Enemy(this.type, this.color, this.weapon, this.hp, [...this.inventory]);
  }
}

const template = new Enemy("Goblin", "#5cc66f", "Sword", 30, ["potion"]);

const shallow = template.cloneShallow();
shallow.inventory.push("bomb");
console.log(template.inventory); // ["potion", "bomb"]  ⚠️ shared list!

const deep = template.cloneDeep();
deep.inventory.push("key");
console.log(template.inventory); // unchanged — deep copy is independent

// Tip: for a quick deep copy of plain data, modern JS has structuredClone():
// const copy = structuredClone(template);  // copies nested objects too`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Enemy.java",
        code: `import java.util.*;

public class Enemy {
    String type, color, weapon;
    int hp;
    List<String> inventory;                       // nested, mutable

    Enemy(String type, String color, String weapon, int hp, List<String> inventory) {
        this.type = type; this.color = color;
        this.weapon = weapon; this.hp = hp; this.inventory = inventory;
    }

    // A copy constructor is the clearest way to clone in Java.
    // Deep copy: we build a NEW list so the copy is independent.
    Enemy copy() {
        return new Enemy(type, color, weapon, hp, new ArrayList<>(inventory));
    }
}

// Enemy template = new Enemy("Goblin", "#5cc66f", "Sword", 30,
//         new ArrayList<>(List.of("potion")));
// Enemy a = template.copy();     // identical, independent copy
// a.inventory.add("bomb");       // template.inventory is untouched (deep copy)

// Note: Java also has Cloneable + Object.clone(), but it's clunky —
// clone() does a SHALLOW copy by default (shared nested lists!) and
// needs careful casting/overriding. Most teams prefer a copy constructor.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "enemy.py",
        code: `import copy
from dataclasses import dataclass, field

@dataclass
class Enemy:
    type: str
    color: str
    weapon: str
    hp: int
    inventory: list[str] = field(default_factory=list)  # nested, mutable

template = Enemy("Goblin", "#5cc66f", "Sword", 30, ["potion"])

# Shallow copy: fields copied, but the inventory list is SHARED.
shallow = copy.copy(template)
shallow.inventory.append("bomb")
print(template.inventory)   # ['potion', 'bomb']  ⚠️ shared reference!

# Deep copy: nested objects copied too, so the copy is independent.
deep = copy.deepcopy(template)
deep.inventory.append("key")
print(template.inventory)   # ['potion', 'bomb'] — deepcopy left it alone

# copy.copy  -> shallow,  copy.deepcopy -> deep. That's the whole story.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "enemy.cpp",
        code: `#include <string>
#include <vector>
#include <memory>

// A virtual clone() lets you copy an object without knowing its exact type.
struct Enemy {
    std::string type, color, weapon;
    int hp;
    std::vector<std::string> inventory;   // nested, mutable

    virtual std::unique_ptr<Enemy> clone() const {
        // Copying the struct copies the vector by value -> a DEEP copy.
        return std::make_unique<Enemy>(*this);
    }
    virtual ~Enemy() = default;
};

// Enemy template_{"Goblin", "#5cc66f", "Sword", 30, {"potion"}};
// auto a = template_.clone();      // independent copy
// a->inventory.push_back("bomb");  // template_.inventory is untouched
//
// Because you clone through the base pointer, you don't need to know
// whether it's a Goblin, Orc, or Dragon — each clone() copies itself.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Prototype when building fresh is wasteful or awkward" },
      {
        type: "p",
        text: "Prototype shines whenever copying an existing object is easier, faster, or more flexible than constructing a new one:",
      },
      {
        type: "ul",
        items: [
          "**Expensive-to-create objects** — if setup means heavy computation, loading from disk, or a database round-trip, do it once and clone the result instead of paying that cost every time.",
          "**Spawning many similar objects** — games spawning enemies, a document with hundreds of similar shapes, rows in a spreadsheet. Configure one template, stamp out copies.",
          "**Snapshotting current state** — clone an object to freeze how it looks *right now* (for undo/redo, or a 'save point'), then keep editing the original.",
          "**Avoiding a big parallel factory hierarchy** — instead of a matching factory class for every product type, keep a registry of prototype objects and just clone the one you want.",
          "**When the concrete class isn't known** — code that only has 'some object' and needs 'another like it' can call `clone()` without knowing whether it's a Goblin, Orc, or Dragon.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When a plain constructor is better",
        text: "Don't reach for Prototype if building the object is already cheap and simple — a plain `new Thing(...)` is clearer. And the moment your objects hold nested mutable data, you take on the shallow-vs-deep-copy burden: get it wrong and clones silently share state. Use Prototype when the copying genuinely saves work, and be deliberate about deep-copying nested fields.",
      },
    ],

    tradeoffs: {
      pros: [
        "Skips expensive setup — clone an already-built object instead of re-running heavy construction every time you need one.",
        "Great for many similar objects — configure a template once, then stamp out copies with a single call each.",
        "Copies current state — a clone captures the object exactly as it is now, which is perfect for snapshots and undo.",
        "Decouples from concrete classes — callers just call clone(); they don't need to know or name the exact type they're copying.",
        "Can replace a factory hierarchy — a small registry of prototypes to clone often beats a parallel tree of factory classes.",
      ],
      cons: [
        "Shallow-vs-deep copy is easy to get wrong — a shallow clone silently shares nested objects with the original, causing spooky action-at-a-distance bugs.",
        "Deep copying can be tricky — objects with circular references or non-copyable resources (open files, sockets) are hard or impossible to clone correctly.",
        "Each class must implement clone() — every prototype has to know how to copy itself, including all its nested fields.",
        "Overkill for simple objects — if construction is cheap, a plain constructor is clearer than a clone() method.",
      ],
    },

    furtherReading: [
      {
        label: "Prototype — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/prototype",
        note: "The clearest illustrated walkthrough: the problem, the clone() structure, the shallow-vs-deep issue, real-world analogy, and language examples. Best first read.",
        kind: "article",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Prototype alongside 22 other patterns. The primary source for its formal intent and structure.",
        kind: "book",
      },
      {
        label: "copy — Shallow and deep copy operations (Python docs)",
        href: "https://docs.python.org/3/library/copy.html",
        note: "The official Python reference explaining copy.copy (shallow) vs copy.deepcopy (deep) precisely — the cleanest statement of the core distinction the pattern hinges on.",
        kind: "docs",
      },
      {
        label: "Prototype pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Prototype_pattern",
        note: "Concise reference covering the intent, the clone() mechanism, the prototype registry variant, and shallow-vs-deep copy considerations across languages.",
        kind: "docs",
      },
      {
        label: "Prototype Pattern — Christopher Okhravi (video)",
        href: "https://www.youtube.com/watch?v=AFbZhRL0Uz8",
        note: "A friendly, whiteboard-style video walking through why you'd clone instead of construct, with the deep-copy pitfall explained clearly.",
        kind: "video",
      },
      {
        label: "structuredClone() — MDN Web Docs",
        href: "https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone",
        note: "The built-in JavaScript deep-clone function — a practical, batteries-included way to deep-copy plain objects without hand-writing a clone method.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "prototype-q1",
        question: "What does a clone() method in the Prototype pattern do, and why?",
        options: [
          { id: "a", label: "Returns a copy of the existing object with its current field values, so you skip building a new one from scratch." },
          { id: "b", label: "Sets up the JavaScript prototype chain so the object inherits methods from a parent." },
          { id: "c", label: "Guarantees the class has only one instance shared across the program." },
          { id: "d", label: "Deletes the original object and replaces it with a fresh default one." },
        ],
        correctOptionId: "a",
        explanation:
          "Prototype is about copying an already-configured object instead of rebuilding it. Option (b) is the unrelated JavaScript prototype *chain* (inheritance) — a common name-clash mistake, not this pattern. Option (c) is Singleton.",
      },
      {
        id: "prototype-q2",
        question: "When does the Prototype pattern beat calling a factory or constructor to build a new object?",
        options: [
          { id: "a", label: "When creation is expensive or you need many similar objects — clone a configured template instead of paying full setup each time." },
          { id: "b", label: "Always — cloning is faster than construction in every situation." },
          { id: "c", label: "Only when the object has no fields at all." },
          { id: "d", label: "When you specifically want a brand-new object with only default values." },
        ],
        correctOptionId: "a",
        explanation:
          "Prototype earns its keep when setup is costly or you need lots of similar objects, so copying an existing one saves work. It's not always better (b) — for cheap, simple objects a plain constructor is clearer. (d) describes a plain default constructor, not cloning current state.",
      },
      {
        id: "prototype-q3",
        question: "An enemy holds an `inventory` list. You make a SHALLOW clone and add an item to the clone's inventory. What happens?",
        options: [
          { id: "a", label: "The item also appears on the original, because a shallow copy shares the same nested inventory list." },
          { id: "b", label: "Only the clone changes; a shallow copy always gives each object its own inventory." },
          { id: "c", label: "The program crashes because you can't add to a cloned list." },
          { id: "d", label: "Both inventories are emptied." },
        ],
        correctOptionId: "a",
        explanation:
          "A shallow copy duplicates the top-level fields but copies only the *reference* to nested objects, so the clone and original share the same inventory list. Editing one is seen by the other. A deep copy would give the clone its own independent list.",
      },
      {
        id: "prototype-q4",
        question: "How does a clone differ from an object freshly built by a default constructor?",
        options: [
          { id: "a", label: "A clone copies the template's current state (its actual colour, HP, etc.), not just a blank default." },
          { id: "b", label: "A clone is always empty, while the constructor fills in real values." },
          { id: "c", label: "There is no difference; clone() and the constructor produce identical results." },
          { id: "d", label: "A clone can only copy the class name, never any field values." },
        ],
        correctOptionId: "a",
        explanation:
          "Prototype snapshots the object as it is *right now*. If you tweaked the template's HP to 50, its clone has HP 50 too. A default constructor instead always produces the same starting values, ignoring any live state.",
      },
      {
        id: "prototype-q5",
        question: "Which is a textbook real-world use of the Prototype pattern?",
        options: [
          { id: "a", label: "A game configures one template enemy, then clones it to spawn dozens of identical copies instantly." },
          { id: "b", label: "Ensuring the whole app shares one logger writing to one file." },
          { id: "c", label: "Wrapping an old API so a new client can talk to it." },
          { id: "d", label: "Splitting a large class into several smaller ones." },
        ],
        correctOptionId: "a",
        explanation:
          "Spawning many similar objects from a configured template is the classic Prototype use case — copy the template rather than rebuild each enemy. Option (b) is Singleton, (c) is Adapter, and (d) is just refactoring, not this pattern.",
      },
    ],
  },
};
