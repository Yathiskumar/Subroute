import type { RoadmapLesson } from "@/lib/content/types";

export const flyweight: RoadmapLesson = {
  title: "Flyweight",
  oneLiner:
    "Share the heavy, repeated part of many objects so huge counts become cheap. A game forest needs 10,000 trees, but there are only 3 tree *species* — so instead of every tree carrying its own 2 KB copy of sprite data, all 10,000 trees point at 3 shared, immutable `TreeType` objects and keep only their own tiny `x, y`. Memory drops from ~20 MB to ~0.4 MB.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/flyweight.html",
  content: {
    prototypeCaption:
      "A game forest you fill with tree emojis. Flip between two worlds. In **✕ WITHOUT Flyweight**, every click of *＋ 50 trees* or *＋ 200 trees* stamps trees that each carry their **own 2 KB copy** of sprite data — watch the 🧠 *memory* chip and the memory bar climb fast and turn **red**, and *heavy objects* equal the tree count. In **✓ WITH Flyweight**, the exact same forest (same positions, same species — it's seeded) is recounted: a small **TreeType cache** strip shows just **3 shared cards** (🌳 Oak, 🌲 Pine, 🌴 Palm), each *created once* and then *reused ×N*, while every tree stores only `x, y` plus a reference. The bar barely moves and stays **green**. Same trees, ~50× less memory — that contrast *is* the pattern.",

    overview: [
      {
        type: "p",
        text: "**Flyweight** answers one question: how do you have *tons* of objects without running out of memory? The trick is noticing that most of those objects are secretly carrying the **same heavy data**. Picture a game that must render a forest of **10,000 trees**. Each tree needs sprite, texture and mesh data — say **2 KB** of it. But look closer: there are only **3 tree species** (Oak, Pine, Palm). The naive version gives every single tree its own copy of that 2 KB, so 10,000 trees cost roughly **20 MB** for data that is 99.97% duplicated.",
      },
      {
        type: "p",
        text: "Flyweight splits each tree in two. The heavy part that repeats — the sprite, the color, the texture — moves into **3 shared, immutable `TreeType` objects**, built once and cached in a factory. Each of the 10,000 trees then keeps only what is truly its own: an `x`, a `y`, and a *reference* to its shared `TreeType`. That's about 40 bytes per tree. Total: 3 × 2 KB of heavy data plus 10,000 tiny records — around **0.4 MB**. The forest looks identical on screen; only the memory bill changed.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Flyweight **shares the heavy, repeated part** of many objects (in immutable, cached *flyweights*) so that having a **huge number of objects becomes cheap** — each object keeps only its tiny unique bits plus a reference to the shared part.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've already used flyweights today",
        text: "Your text editor doesn't create a fresh object for every one of the million characters in a file — it shares one *glyph* object per distinct character. Java caches small `Integer` boxes, and most languages *intern* strings so equal literals point at one shared object. Flyweight is everywhere; it just usually hides inside the platform.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Two kinds of state: intrinsic vs extrinsic" },
      {
        type: "p",
        text: "The whole pattern is one act of sorting. Take everything an object stores and split it into two piles:",
      },
      {
        type: "ul",
        items: [
          "**Intrinsic state** — the part that is the *same* across many objects and doesn't change: the sprite, the color, the texture, the name *Oak*. This lives **inside the flyweight** (`TreeType`) and is **shared** by everyone. Intrinsic = *belongs to the type*.",
          "**Extrinsic state** — the part that is *unique* to each object: this tree's `x` and `y`. This is **kept outside the flyweight** — stored in the small per-tree object, or passed in as method arguments (`type.draw(x, y)`). Extrinsic = *belongs to the instance*.",
        ],
      },
      {
        type: "p",
        text: "A quick self-test for any field: *if I made 10,000 of these, how many distinct values would this field have?* Three values (species sprite) → intrinsic, share it. Ten thousand values (position) → extrinsic, keep it per object. Get this split right and the rest of the pattern writes itself.",
      },
      { type: "h", text: "The factory cache: build each flyweight once" },
      {
        type: "p",
        text: "Nobody creates a `TreeType` directly. Everyone asks a **`TreeFactory`**, which keeps a cache (a map from a key like `\"Oak\"` to the flyweight). The *first* request for Oak builds the heavy `TreeType` and stores it; every later request returns the **already-built, shared one**. Plant 10,000 trees across 3 species and the factory constructs exactly **3** heavy objects — the other 9,997 requests are cache hits. It's the same 'check the cache, build once, reuse forever' move a Singleton's `getInstance()` makes, except the factory manages a *family* of instances, one per key.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class TreeFactory {
  private static cache = new Map<string, TreeType>();

  static get(name: string, color: string, sprite: string): TreeType {
    let type = TreeFactory.cache.get(name);
    if (!type) {                                  // first time this species?
      type = new TreeType(name, color, sprite);   // build the heavy 2 KB once
      TreeFactory.cache.set(name, type);
    }
    return type;                                  // everyone shares this one
  }
}`,
      },
      { type: "h", text: "Why flyweights MUST be immutable" },
      {
        type: "p",
        text: "One `TreeType` is referenced by *thousands* of trees at once. If any code could write `oakType.color = \"purple\"`, every oak in the forest would silently turn purple — a change made 'to one tree' would hit thousands of unrelated ones. That's why flyweights are **immutable**: all fields set in the constructor, no setters, read-only forever. Immutability is what makes sharing *safe* — this is the same reasoning behind value objects in [[immutability-and-value-objects]]. If a value needs to differ per tree or change over time, it isn't intrinsic — move it out to extrinsic state.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Flyweight is not Object Pool",
        text: "Both reuse objects, but differently. A pool ([[object-pool]]) hands out objects **over time**: one user at a time borrows an object, *mutates* it, and returns it. Flyweight shares objects **simultaneously**: thousands of owners hold the same instance at the same moment, which is exactly why it must be *immutable*. Pool = reuse across time, mutable. Flyweight = share right now, frozen.",
      },
      { type: "h", text: "The memory math" },
      {
        type: "ul",
        items: [
          "**Without Flyweight**: 10,000 trees × 2 KB each ≈ **20 MB**, and it grows *linearly* — every new tree costs another full 2 KB.",
          "**With Flyweight**: 3 shared `TreeType`s × 2 KB + 10,000 trees × ~40 B (an `x`, a `y`, a reference) ≈ 6 KB + 400 KB ≈ **0.4 MB** — roughly **50× less**.",
          "The win scales with *count × duplication*: the heavy cost is paid **per species** (3, fixed), while the per-tree cost is tiny. Doubling the forest adds ~0.4 MB, not ~20 MB.",
        ],
      },
      { type: "h", text: "Where you meet this in the real world" },
      {
        type: "ul",
        items: [
          "**Text editors** — one shared glyph object per distinct character; each character position in the document stores only *which* glyph plus where it sits. A million-character file needs ~100 glyph objects, not a million.",
          "**String interning** — `\"hello\"` written in two places points at *one* shared string object; the runtime keeps an intern table (a flyweight factory for strings).",
          "**`Integer.valueOf()` in Java** — values from −128 to 127 come from a shared cache, so boxing small numbers doesn't allocate.",
          "**Browsers** — thousands of DOM nodes with identical styling share one computed-style object instead of each storing its own copy.",
          "**Games** — particles, bullets, tiles and props: thousands of instances, a handful of shared sprite/mesh 'types'. Flyweight is the standard trick.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Watch memory explode without sharing",
        body: "Open the prototype with the toggle on ✕ WITHOUT Flyweight. Click ＋ 50 trees a few times, then ＋ 200 trees. Watch the three chips: 🌳 trees climbs, heavy objects climbs in lockstep (every tree owns its own 2 KB copy), and 🧠 memory races up — the memory bar stretches and turns red. That linear climb is 'count × 2 KB' with nothing shared.",
      },
      {
        title: "02 · Flip to WITH and compare the same forest",
        body: "Switch the toggle to ✓ WITH Flyweight. The forest is identical — same positions, same species — but the accounting changes: heavy objects drops to at most 3, and the memory bar collapses to a green sliver. The TreeType cache strip appears with 3 cards (🌳 Oak, 🌲 Pine, 🌴 Palm), each marked 2 KB · shared with a reused ×N badge. Those 3 cards are the only heavy data in the whole scene.",
      },
      {
        title: "03 · Prove new trees are nearly free",
        body: "Still in ✓ WITH Flyweight, click ＋ 200 trees several times. The reused ×N badges tick up, heavy objects stays pinned at 3, and 🧠 memory barely moves — each new tree adds only ~40 bytes of x, y + reference. Then hit ↺ Reset, plant in WITH first and watch each card flash 'created once' exactly one time: the factory builds each species once, then every later tree is a cache hit.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "forest.ts",
        code: `// FLYWEIGHT — heavy intrinsic state, shared and IMMUTABLE.
class TreeType {
  constructor(
    readonly name: string,     // "Oak"
    readonly color: string,    // shared by every oak
    readonly sprite: string,   // pretend: ~2 KB of texture data
  ) {}
  // Extrinsic state (x, y) is passed IN — never stored here.
  draw(x: number, y: number): void {
    console.log(\`\${this.name} at (\${x}, \${y})\`);
  }
}

// FACTORY — cache: build each species once, then reuse.
class TreeFactory {
  private static cache = new Map<string, TreeType>();
  static get(name: string, color: string, sprite: string): TreeType {
    let t = TreeFactory.cache.get(name);
    if (!t) {                                   // miss → build the 2 KB once
      t = new TreeType(name, color, sprite);
      TreeFactory.cache.set(name, t);
    }
    return t;                                   // hit → the shared instance
  }
  static created(): number { return TreeFactory.cache.size; }
}

// CONTEXT — tiny per-tree record: extrinsic state + a reference.
class Tree {
  constructor(private x: number, private y: number,
              private type: TreeType) {}        // reference, NOT a copy
  draw(): void { this.type.draw(this.x, this.y); }
}

// 10,000 trees, 3 species → only 3 heavy objects ever exist.
const species = [["Oak", "green"], ["Pine", "teal"], ["Palm", "sand"]];
const forest: Tree[] = [];
for (let i = 0; i < 10_000; i++) {
  const [name, color] = species[i % 3];
  const type = TreeFactory.get(name, color, name + ".png");
  forest.push(new Tree(Math.random() * 800, Math.random() * 600, type));
}
console.log(TreeFactory.created());  // 3 — not 10,000`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Forest.java",
        code: `import java.util.*;

// FLYWEIGHT — immutable: final fields, no setters. Safe to share.
final class TreeType {
    private final String name, color, sprite;   // sprite ≈ 2 KB, shared
    TreeType(String name, String color, String sprite) {
        this.name = name; this.color = color; this.sprite = sprite;
    }
    void draw(int x, int y) {                   // extrinsic state passed in
        System.out.println(name + " at (" + x + ", " + y + ")");
    }
}

// FACTORY — one cached TreeType per species.
final class TreeFactory {
    private static final Map<String, TreeType> CACHE = new HashMap<>();
    static TreeType get(String name, String color, String sprite) {
        return CACHE.computeIfAbsent(name,       // build once per species,
            k -> new TreeType(name, color, sprite)); // then always reuse
    }
    static int created() { return CACHE.size(); }
}

// CONTEXT — ~40 bytes: two ints + one shared reference.
final class Tree {
    private final int x, y;
    private final TreeType type;                // reference, not a copy
    Tree(int x, int y, TreeType type) { this.x = x; this.y = y; this.type = type; }
    void draw() { type.draw(x, y); }
}

public class Forest {
    public static void main(String[] args) {
        String[][] species = {{"Oak","green"},{"Pine","teal"},{"Palm","sand"}};
        List<Tree> forest = new ArrayList<>();
        Random rnd = new Random(42);
        for (int i = 0; i < 10_000; i++) {
            String[] s = species[i % 3];
            forest.add(new Tree(rnd.nextInt(800), rnd.nextInt(600),
                TreeFactory.get(s[0], s[1], s[0] + ".png")));
        }
        System.out.println(TreeFactory.created()); // 3

        // Java ships flyweights: Integer.valueOf(-128..127) returns cached
        // boxes, and string literals are interned — "a" == "a" is one object.
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "forest.py",
        code: `import random
from dataclasses import dataclass

# FLYWEIGHT — frozen dataclass = immutable, so sharing is safe.
@dataclass(frozen=True)
class TreeType:
    name: str      # "Oak"
    color: str     # shared by every oak
    sprite: str    # pretend: ~2 KB of texture data

    def draw(self, x: int, y: int) -> None:   # extrinsic passed in
        print(f"{self.name} at ({x}, {y})")


# FACTORY — cache one TreeType per species.
class TreeFactory:
    _cache: dict[str, TreeType] = {}

    @classmethod
    def get(cls, name: str, color: str, sprite: str) -> TreeType:
        if name not in cls._cache:                       # miss → build once
            cls._cache[name] = TreeType(name, color, sprite)
        return cls._cache[name]                          # hit → shared one

    @classmethod
    def created(cls) -> int:
        return len(cls._cache)


# CONTEXT — tiny per-tree record: x, y + a reference.
class Tree:
    __slots__ = ("x", "y", "type")     # keep per-tree memory minimal
    def __init__(self, x: int, y: int, type_: TreeType):
        self.x, self.y, self.type = x, y, type_          # reference, no copy
    def draw(self) -> None:
        self.type.draw(self.x, self.y)


species = [("Oak", "green"), ("Pine", "teal"), ("Palm", "sand")]
forest = [
    Tree(random.randint(0, 800), random.randint(0, 600),
         TreeFactory.get(name, color, f"{name}.png"))
    for i in range(10_000)
    for name, color in [species[i % 3]]
]
print(TreeFactory.created())   # 3 — not 10,000
# Python interns small ints and many strings the same way.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "forest.cpp",
        code: `#include <iostream>
#include <memory>
#include <string>
#include <unordered_map>
#include <vector>

// FLYWEIGHT — all const members: immutable, safe to share.
class TreeType {
public:
    const std::string name, color, sprite;   // sprite ≈ 2 KB, shared
    TreeType(std::string n, std::string c, std::string s)
        : name(std::move(n)), color(std::move(c)), sprite(std::move(s)) {}
    void draw(int x, int y) const {          // extrinsic passed in
        std::cout << name << " at (" << x << ", " << y << ")\\n";
    }
};

// FACTORY — shared_ptr cache: each species built once.
class TreeFactory {
    static std::unordered_map<std::string, std::shared_ptr<const TreeType>> cache;
public:
    static std::shared_ptr<const TreeType>
    get(const std::string& name, const std::string& color, const std::string& sprite) {
        auto it = cache.find(name);
        if (it == cache.end())               // miss → build the 2 KB once
            it = cache.emplace(name,
                std::make_shared<const TreeType>(name, color, sprite)).first;
        return it->second;                   // hit → the shared instance
    }
    static std::size_t created() { return cache.size(); }
};
std::unordered_map<std::string, std::shared_ptr<const TreeType>> TreeFactory::cache;

// CONTEXT — two ints + one shared pointer per tree.
struct Tree {
    int x, y;
    std::shared_ptr<const TreeType> type;    // reference, not a copy
    void draw() const { type->draw(x, y); }
};

int main() {
    const char* species[3][2] = {{"Oak","green"},{"Pine","teal"},{"Palm","sand"}};
    std::vector<Tree> forest;
    forest.reserve(10'000);
    for (int i = 0; i < 10'000; ++i) {
        auto* s = species[i % 3];
        forest.push_back({rand() % 800, rand() % 600,
                          TreeFactory::get(s[0], s[1], std::string(s[0]) + ".png")});
    }
    std::cout << TreeFactory::created() << "\\n";  // 3 — not 10,000
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Flyweight when all three line up" },
      {
        type: "ul",
        items: [
          "**Huge object counts** — thousands to millions of instances alive *at the same time*: game entities, characters in a document, map markers, table cells.",
          "**Heavy, repeated state** — a big chunk of each object (sprite, glyph, style, config blob) is duplicated across many of them, with far fewer *distinct* values than instances.",
          "**The shared part can be immutable** — you can freeze the repeated chunk and pass the changing bits (position, selection, velocity) in from outside.",
          "**Memory is actually the constraint** — profiling (or arithmetic like 10,000 × 2 KB) shows the duplication is what's hurting you.",
        ],
      },
      { type: "h", text: "Skip it when" },
      {
        type: "ul",
        items: [
          "**Object counts are modest** — a few hundred objects duplicating 2 KB is ~half a megabyte; the pattern's complexity isn't buying anything.",
          "**State is mostly unique** — if almost every field differs per instance, there's nothing worth sharing; a flyweight of one field saves nothing.",
          "**The 'shared' part must mutate** — if per-object changes to that data are needed, sharing it is a bug factory, not an optimization.",
          "**You haven't measured** — Flyweight splits one simple class into three parts (flyweight, factory, context). Don't pay that readability cost before a profile or back-of-envelope math shows a real memory problem.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "It's an optimization pattern — treat it like one",
        text: "Unlike most patterns, Flyweight changes *cost*, not *capability*. The forest renders identically either way. So apply it the way you'd apply any optimization: measure first, confirm the duplication is the problem, then restructure — and keep the factory as the single door so callers never notice the sharing.",
      },
    ],

    tradeoffs: {
      pros: [
        "Massive memory savings when duplication is real — the heavy cost is paid per *distinct value* (3 species), not per *instance* (10,000 trees): ~20 MB becomes ~0.4 MB.",
        "Scales gracefully — once the flyweights exist, each extra object costs only its tiny extrinsic record, so doubling the count barely moves memory.",
        "Fewer allocations and better cache behavior — 3 heavy constructions instead of 10,000, and thousands of objects reading the same shared data keeps it hot.",
        "The factory centralizes creation — one place to build, count and inspect shared state, invisible to callers who just ask for 'an Oak'.",
      ],
      cons: [
        "Trades CPU for RAM — extrinsic state must be passed in or looked up on every operation, and the factory does a cache lookup per request; that's extra work per call.",
        "More moving parts — one plain class becomes flyweight + factory + context, and the intrinsic/extrinsic split makes the code harder to read for newcomers.",
        "The immutability requirement is rigid — the moment someone needs to tweak shared state 'for just one tree', the design fights back (or worse, they mutate it and corrupt thousands of objects).",
        "Cached flyweights live forever by default — the factory's map holds strong references, so rarely-used flyweights are never freed unless you add eviction or weak references.",
      ],
    },

    furtherReading: [
      {
        label: "Flyweight — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/flyweight",
        note: "The clearest illustrated walkthrough, built on the same forest-of-trees example: intrinsic vs extrinsic state, the factory cache, and full code in several languages. Best first read.",
        kind: "article",
      },
      {
        label: "Flyweight — Game Programming Patterns (Robert Nystrom)",
        href: "https://gameprogrammingpatterns.com/flyweight.html",
        note: "A free book chapter that treats Flyweight as the pattern games are built on — forests, terrain tiles, instanced rendering — with honest notes on when the win is real.",
        kind: "book",
      },
      {
        label: "Flyweight pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Flyweight_pattern",
        note: "Concise reference: formal structure, immutability and concurrency considerations, and classic examples like glyph sharing in text editors.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that named Flyweight, motivated by a document editor sharing one glyph object per character. The primary source for intent and structure.",
        kind: "book",
      },
      {
        label: "String interning — Wikipedia",
        href: "https://en.wikipedia.org/wiki/String_interning",
        note: "Flyweight you use every day without noticing: how runtimes keep one shared copy of each distinct string, the intern table as a flyweight factory, and the trade-offs.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "flyweight-q1",
        question: "What problem does the Flyweight pattern solve?",
        options: [
          { id: "a", label: "Huge numbers of objects blow up memory because each carries its own copy of heavy, repeated data — Flyweight shares that data instead." },
          { id: "b", label: "A class has more than one instance when it should have exactly one." },
          { id: "c", label: "Creating an object is slow, so it should be cloned from a template." },
          { id: "d", label: "Two incompatible interfaces need a translator between them." },
        ],
        correctOptionId: "a",
        explanation:
          "Flyweight is a memory optimization: when thousands of objects duplicate the same heavy chunk (10,000 trees each carrying 2 KB of sprite data), the pattern moves that chunk into a few shared, immutable flyweights so each object keeps only its tiny unique state. (b) is Singleton, (c) is Prototype, (d) is Adapter.",
      },
      {
        id: "flyweight-q2",
        question: "In the game forest, which is intrinsic state and which is extrinsic?",
        options: [
          { id: "a", label: "The sprite/texture/color is intrinsic (shared, lives in TreeType); each tree's x, y position is extrinsic (unique, kept outside the flyweight)." },
          { id: "b", label: "The x, y position is intrinsic; the sprite is extrinsic." },
          { id: "c", label: "Everything is intrinsic — flyweights store all the state." },
          { id: "d", label: "Everything is extrinsic — flyweights store no state at all." },
        ],
        correctOptionId: "a",
        explanation:
          "Intrinsic state is what repeats across many objects and never changes — the species' sprite, texture and color — so it lives inside the shared flyweight. Extrinsic state is what's unique per object — this tree's x, y — so it's stored in the small per-tree record or passed into methods. The self-test: 10,000 trees have 3 distinct sprites (intrinsic) but 10,000 distinct positions (extrinsic).",
      },
      {
        id: "flyweight-q3",
        question: "Why must flyweight objects be immutable?",
        options: [
          { id: "a", label: "Because one flyweight is shared by thousands of objects at once — mutating it would silently change all of them." },
          { id: "b", label: "Because immutable objects use less disk space." },
          { id: "c", label: "Because the factory cannot store mutable objects in a map." },
          { id: "d", label: "They don't need to be — flyweights are routinely mutated per object." },
        ],
        correctOptionId: "a",
        explanation:
          "A single TreeType is referenced by every tree of that species simultaneously. If code could set oakType.color, every oak in the forest would change at once — a spooky action-at-a-distance bug. Freezing the flyweight makes sharing safe; anything that must vary per object belongs in extrinsic state instead.",
      },
      {
        id: "flyweight-q4",
        question: "You plant 10,000 trees across 3 species through a TreeFactory. How many heavy TreeType objects exist, and roughly what memory do you save versus no sharing (2 KB heavy data, ~40 B per tree record)?",
        options: [
          { id: "a", label: "3 TreeTypes; roughly 20 MB shrinks to about 0.4 MB — the heavy cost is per species, not per tree." },
          { id: "b", label: "10,000 TreeTypes; memory is the same but lookups get faster." },
          { id: "c", label: "3 TreeTypes, but memory stays around 20 MB because references are as big as sprites." },
          { id: "d", label: "1 TreeType; all species share one sprite." },
        ],
        correctOptionId: "a",
        explanation:
          "The factory builds one TreeType per distinct species — 3 total — and every other request is a cache hit. Without sharing: 10,000 × 2 KB ≈ 20 MB. With sharing: 3 × 2 KB + 10,000 × ~40 B ≈ 0.4 MB, about 50× less. A reference costs a few bytes, nowhere near the 2 KB it replaces.",
      },
      {
        id: "flyweight-q5",
        question: "How is Flyweight different from Object Pool, since both 'reuse objects'?",
        options: [
          { id: "a", label: "A pool lends mutable objects to one user at a time and takes them back; a flyweight is held by thousands of owners simultaneously, which is why it must be immutable." },
          { id: "b", label: "They are the same pattern with different names." },
          { id: "c", label: "Flyweight reuses objects over time; a pool shares them simultaneously." },
          { id: "d", label: "Object pools only work for database connections, flyweights only for games." },
        ],
        correctOptionId: "a",
        explanation:
          "The axis is time vs simultaneity. An object pool reuses over TIME: borrow an object, mutate it freely (you're the only holder), return it for the next user. Flyweight shares RIGHT NOW: countless objects reference the same instance at the same moment, so it must be frozen. Option (c) states it exactly backwards.",
      },
    ],
  },
};
