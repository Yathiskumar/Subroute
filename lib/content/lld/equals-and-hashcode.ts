import type { RoadmapLesson } from "@/lib/content/types";

export const equalsAndHashcode: RoadmapLesson = {
  title: "equals(), hashCode() & Identity",
  oneLiner:
    "Reference identity (same object?) vs value equality (same contents?), and the hashCode contract that makes hash-based collections work.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/equals-and-hashcode.html",
  content: {
    prototypeCaption:
      "Two `Point` objects hold the *same* values `(2, 3)` but live at different addresses. Flip **Override equals() + hashCode()** and watch the IDENTITY checks change, then press **Add both to a HashSet** — with the override OFF a duplicate sneaks in (size **2**); with it ON the set recognizes the duplicate (size **1**).",

    overview: [
      {
        type: "p",
        text: "Two objects can hold exactly the same data and still not be 'equal' — it all depends on what *equal* means. There are two very different questions hiding behind that one word: *are these the same object?* (**identity**) and *do these hold the same contents?* (**value equality**). Mixing them up is the source of some of the most baffling bugs in object-oriented code.",
      },
      {
        type: "p",
        text: "Picture two printed copies of the same boarding pass. They show identical details — same name, same seat, same flight — but they are two separate pieces of paper. Asking *\"is this literally the same sheet of paper?\"* is identity. Asking *\"do these two passes say the same thing?\"* is value equality. Most of the time you care about the second question, but the default behavior in most languages answers the first.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one rule that ties it all together",
        text: "If two objects are **equal**, they *must* produce the **same hashCode**. Break that one rule and your objects start vanishing inside `HashSet`s and `HashMap`s — found one moment, lost the next.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Two kinds of \"equal\"" },
      {
        type: "p",
        text: "When you compare two objects, you have to decide which question you're asking:",
      },
      {
        type: "ul",
        items: [
          "**Reference / identity equality** — *are these two variables pointing at the very same object in memory?* In Java this is `p1 == p2`; in Python it's `p1 is p2`. It compares addresses, not contents, so two separately created objects are never identity-equal even if every field matches.",
          "**Value equality** — *do these two objects hold the same contents?* This is `p1.equals(p2)` in Java, `p1 == p2` in Python, `p1 == p2` (operator overload) in C++. By default, most languages make value equality fall back to identity — so until you override it, `equals` just checks `==` and reports `false` for two distinct objects.",
        ],
      },
      {
        type: "p",
        text: "That default is the trap. You create `Point(2, 3)` twice, you *mean* them to be the same point, but the language compares addresses and says they're different.",
      },
      { type: "h", text: "Overriding equals to compare by value" },
      {
        type: "p",
        text: "To make two equal-looking objects actually count as equal, you override the equality method to compare the *fields* you care about instead of the memory address:",
      },
      {
        type: "code",
        language: "java",
        filename: "Point.java",
        code: `@Override
public boolean equals(Object o) {
    if (this == o) return true;            // same object → trivially equal
    if (!(o instanceof Point p)) return false;
    return this.x == p.x && this.y == p.y; // compare by VALUE
}`,
      },
      { type: "h", text: "Why hashCode must agree with equals" },
      {
        type: "p",
        text: "Hash-based collections like `HashSet` and `HashMap` don't scan every element to find a match — that would be slow. Instead they call `hashCode()` to compute a number, use it to pick a **bucket**, and only compare objects *within that bucket* using `equals()`. So a lookup is really two steps: *which bucket?* (hashCode), then *is it really here?* (equals).",
      },
      {
        type: "p",
        text: "That two-step dance only works if `hashCode` and `equals` agree. If two objects are `equals`-equal but land in *different* buckets because their hash codes differ, the collection looks in the wrong bucket, never finds the match, and treats them as different. That's why the contract demands they move together.",
      },
      { type: "h", text: "The equals / hashCode contract" },
      {
        type: "p",
        text: "A correct `equals` must satisfy four properties, and `hashCode` must stay consistent with it:",
      },
      {
        type: "ul",
        items: [
          "**Reflexive** — `x.equals(x)` is always `true`. An object equals itself.",
          "**Symmetric** — if `x.equals(y)` is `true`, then `y.equals(x)` must be `true` too. Equality can't depend on which side you start from.",
          "**Transitive** — if `x.equals(y)` and `y.equals(z)`, then `x.equals(z)` must hold. Equality chains together.",
          "**Consistent** — repeated calls return the same answer as long as the objects don't change. No random results.",
          "**Equal ⇒ equal hash** — if `x.equals(y)`, then `x.hashCode() == y.hashCode()`. This is the rule that keeps hash collections working.",
          "**Unequal *may* collide** — the reverse is *not* required: two unequal objects are *allowed* to share a hashCode. That's a normal **collision**, and `equals` resolves it inside the bucket. Good hash functions just keep collisions rare.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The classic trap: override one but not both",
        text: "If you override `equals` to compare by value but forget `hashCode` (or vice-versa), your two equal points compute *different* hash codes, land in *different* buckets, and the `HashSet` never realizes they're duplicates — so a 'duplicate' sneaks in and `set.contains(p)` returns `false` for a point you *know* you added. Always override the **two together**. This is exactly the bug the prototype reproduces.",
      },
      { type: "h", text: "What breaks in HashSet / HashMap" },
      {
        type: "p",
        text: "Concretely, with `equals` overridden but `hashCode` left as the default (identity-based), here's the failure: you add `p1 = Point(2,3)`, then add `p2 = Point(2,3)`. They're `equals`-equal, so the set *should* keep just one. But their default hash codes differ, so they hash to different buckets; the set never compares them with `equals`, and you end up with **two** 'equal' points in a set that's supposed to hold no duplicates. Later, `set.contains(new Point(2,3))` may return `false` even though the point is clearly in there — it's looking in the wrong bucket.",
      },
      { type: "h", text: "How each language spells it" },
      {
        type: "ul",
        items: [
          "**Java** — override `boolean equals(Object)` *and* `int hashCode()` together. `Objects.equals(...)` and `Objects.hash(...)` make this easy and null-safe.",
          "**Python** — define `__eq__(self, other)` for value equality and `__hash__(self)` for hashing. Note: defining `__eq__` without `__hash__` makes the class **unhashable** (Python sets `__hash__ = None`), so you can't put it in a `set` or use it as a `dict` key until you add `__hash__`.",
          "**C++** — overload `operator==` for value equality, and specialize `std::hash<Point>` so the type can be a key in `std::unordered_set` / `std::unordered_map`.",
          "**JavaScript** — there is **only reference equality** (`===` / `==` compare object references). There's no `equals`/`hashCode` hook and `Set`/`Map` key on reference identity, so for value equality you must compare fields **manually** (or key your `Map` by a serialized string like `\`\${x},\${y}\``).",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Let the language write it for you",
        text: "Modern value types generate both methods automatically: Java **records** (`record Point(int x, int y) {}`), Kotlin/Scala **data classes**, Python's **`@dataclass`** (and `@dataclass(frozen=True)` to make it hashable), and C# **records** all derive a correct, field-based `equals` *and* `hashCode` for you. Prefer these for immutable value types and you side-step the whole trap.",
      },
    ],

    handsOn: [
      {
        title: "01 · See identity vs value, side by side",
        body: "With the toggle **OFF**, read the IDENTITY panel. `p1 == p2` is `false` (different addresses — reference check), `p1.equals(p2)` is also `false` (default falls back to identity), and the two `hashCode()` chips differ. Now flip **Override equals() + hashCode()** ON: `==` stays `false` (it's *still* two different objects), but `.equals()` flips to `true` and both hash codes become equal. That's value equality switching on.",
      },
      {
        title: "02 · Reproduce the HashSet bug — then fix it",
        body: "Leave the toggle **OFF** and press **Add both to a HashSet**. Watch p1 and p2 fall into *two different buckets* and the set size land on **2** — a duplicate sneaked in. Now flip the toggle **ON** and press it again: p2 hashes to the *same* bucket, `equals` recognizes it as a duplicate, and the size drops to **1**. Same data, correct behavior — only because hashCode and equals now agree.",
      },
      {
        title: "03 · Make them genuinely differ",
        body: "Edit a coordinate so the two points are no longer the same value (say change p2 to `(2, 9)`). Re-run the checks: now even with the override ON, `.equals()` is `false` and the hash codes differ *legitimately* — and the HashSet correctly holds **2** points. This shows the override isn't 'forcing' equality; it's comparing the actual contents.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "point.ts",
        code: `// JS/TS has ONLY reference equality — no equals()/hashCode() hook,
// and Set/Map key on object identity. So compare by value yourself.
class Point {
  constructor(public readonly x: number, public readonly y: number) {}

  // structural compare — the helper JS doesn't give you
  equals(o: Point): boolean {
    return o instanceof Point && this.x === o.x && this.y === o.y;
  }

  // a stable string "hash" usable as a Map/Set key
  key(): string {
    return \`\${this.x},\${this.y}\`;
  }
}

const p1 = new Point(2, 3);
const p2 = new Point(2, 3);

p1 === p2;        // false  — different objects (reference equality)
p1.equals(p2);    // true   — same contents (manual value compare)

// A native Set keys by reference, so it would keep BOTH.
// Key by value instead, using p.key():
const set = new Map<string, Point>();
set.set(p1.key(), p1);
set.set(p2.key(), p2);   // same key → overwrites, no duplicate
set.size;                // 1  — p2 recognized as equal to p1`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Point.java",
        code: `// Override equals() and hashCode() TOGETHER, or hash collections break.
import java.util.*;

final class Point {
    private final int x, y;

    Point(int x, int y) { this.x = x; this.y = y; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point p)) return false;
        return x == p.x && y == p.y;          // compare by value
    }

    @Override public int hashCode() {
        return Objects.hash(x, y);            // MUST agree with equals
    }
}

// (Or skip all of the above with a record:)
//   record Point(int x, int y) {}  // equals + hashCode auto-generated

Point p1 = new Point(2, 3);
Point p2 = new Point(2, 3);

p1 == p2;          // false — different objects (reference equality)
p1.equals(p2);     // true  — same contents (value equality)

Set<Point> set = new HashSet<>();
set.add(p1);
set.add(p2);       // recognized as a duplicate
set.size();        // 1  — equals + hashCode agree, so no dup sneaks in`,
      },
      {
        label: "Python",
        language: "python",
        filename: "point.py",
        code: `# Define __eq__ for value equality AND __hash__ to stay hashable.
# (Defining __eq__ alone makes the class unhashable!)

class Point:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    def __eq__(self, other) -> bool:
        return isinstance(other, Point) and \\
            (self.x, self.y) == (other.x, other.y)   # by value

    def __hash__(self) -> int:
        return hash((self.x, self.y))                # MUST agree

# Or let a frozen dataclass generate both for you:
#   from dataclasses import dataclass
#   @dataclass(frozen=True)
#   class Point:
#       x: int
#       y: int

p1, p2 = Point(2, 3), Point(2, 3)

p1 is p2          # False — different objects (identity)
p1 == p2          # True  — same contents (__eq__)

s = set()
s.add(p1)
s.add(p2)         # duplicate, recognized via __eq__ + __hash__
len(s)            # 1`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "point.cpp",
        code: `// Overload operator== for value equality, and specialize std::hash
// so Point can be a key in unordered_set / unordered_map.
#include <unordered_set>
#include <functional>
#include <cstddef>

struct Point {
    int x, y;
    bool operator==(const Point& o) const {   // value equality
        return x == o.x && y == o.y;
    }
};

// Teach the standard library how to hash a Point.
template <>
struct std::hash<Point> {
    std::size_t operator()(const Point& p) const noexcept {
        std::size_t h1 = std::hash<int>{}(p.x);
        std::size_t h2 = std::hash<int>{}(p.y);
        return h1 ^ (h2 << 1);                 // combine — agrees with ==
    }
};

int main() {
    Point p1{2, 3}, p2{2, 3};

    // p1 == p2 is true (value equality). Addresses (&p1 vs &p2) differ.
    std::unordered_set<Point> set;
    set.insert(p1);
    set.insert(p2);          // duplicate, recognized via == + hash
    return set.size();       // 1
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to override equals & hashCode" },
      {
        type: "p",
        text: "Override them whenever your class is a **value type** — an object that's defined by *what it holds*, not *which instance it is*. Money, coordinates, a date, an ID wrapper, a colour: two of these with identical fields *are* the same thing, and you'll want to compare them by value, deduplicate them in a `Set`, or use them as `Map`/`dict` keys. The moment a type ends up as a key or inside a hash-based collection, correct `equals` *and* `hashCode` are mandatory.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Entities keep identity; values get value-equality",
        text: "Not every class should compare by value. A *User* with a database ID is an **entity** — two rows with the same name are still different users, so identity (the ID) is the right notion of 'same'. *Value objects* (Money, Point, Range) are the ones that earn a field-based `equals`/`hashCode`. And keep the fields used in `hashCode` **immutable** — see the cons.",
      },
    ],

    tradeoffs: {
      pros: [
        "Deduplication just works — equal objects collapse to one inside a `HashSet`/`set`, instead of piling up as sneaky duplicates.",
        "Objects become reliable **map keys** — `map.get(new Point(2,3))` finds the value you stored under an equal-but-different instance.",
        "Value comparisons read naturally — `a.equals(b)` (or `a == b`) answers 'same contents?' instead of the rarely-useful 'same object?'.",
        "Fast lookups stay fast — a correct `hashCode` spreads objects across buckets so hash collections keep their O(1) average.",
      ],
      cons: [
        "**Overriding one but not the other** — value `equals` with a default `hashCode` (or vice-versa) silently breaks every hash collection; the #1 bug here.",
        "**Mutable fields in hashCode** — if you mutate a field the hash depends on *after* inserting the object, it moves buckets and gets 'lost' inside the `Set`/`Map`.",
        "**Using identity when you meant value** — relying on `==` / `is` for value types so two equal objects compare as different (and pile up as duplicates).",
        "**A broken contract** — an `equals` that isn't symmetric or transitive (a common slip when comparing across subclasses) makes collections behave unpredictably.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Object.equals & hashCode (Javadoc)",
        href: "https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html",
        note: "The authoritative statement of the equals/hashCode contract, straight from the Java API docs.",
        kind: "docs",
      },
      {
        label: "Python data model — object.__hash__",
        href: "https://docs.python.org/3/reference/datamodel.html#object.__hash__",
        note: "How __eq__ and __hash__ relate, and why defining __eq__ alone makes a class unhashable.",
        kind: "docs",
      },
      {
        label: "cppreference — std::hash",
        href: "https://en.cppreference.com/w/cpp/utility/hash",
        note: "Reference for specializing std::hash so your value type works as an unordered_set/map key.",
        kind: "docs",
      },
      {
        label: "MDN — Equality comparisons and sameness",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness",
        note: "Why JavaScript has only reference equality for objects, and how ==, ===, and Object.is differ.",
        kind: "docs",
      },
      {
        label: "Effective Java — Items 10 & 11",
        note: "Joshua Bloch's classic treatment: 'Obey the general contract when overriding equals' and 'Always override hashCode when you override equals'.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "eh-q1",
        question:
          "You create `p1 = new Point(2,3)` and `p2 = new Point(2,3)` and have overridden `equals`/`hashCode` to compare by value. What do `p1 == p2` and `p1.equals(p2)` return in Java?",
        options: [
          { id: "a", label: "Both true — the override makes them the same object." },
          { id: "b", label: "`==` is false (different objects), `equals` is true (same contents)." },
          { id: "c", label: "Both false — different objects can never be equal." },
          { id: "d", label: "`==` is true, `equals` is false." },
        ],
        correctOptionId: "b",
        explanation:
          "`==` checks reference identity — they're two distinct objects at different addresses, so it stays false no matter what you override. `equals` was overridden to compare the x and y fields, which match, so it returns true. Identity and value equality are separate questions.",
      },
      {
        id: "eh-q2",
        question:
          "You override `equals` on `Point` to compare by value but forget to override `hashCode`. You add two equal points to a `HashSet`. What happens?",
        options: [
          { id: "a", label: "The set holds 1 element — equals alone is enough to deduplicate." },
          { id: "b", label: "A compile error — you can't override equals without hashCode." },
          { id: "c", label: "The set holds 2 elements — they hash to different buckets, so the duplicate is never detected." },
          { id: "d", label: "The program throws at runtime when you add the second point." },
        ],
        correctOptionId: "c",
        explanation:
          "With the default (identity-based) hashCode, the two equal points compute different hash codes and land in different buckets. The set only calls equals on objects within the same bucket, so it never compares them — the duplicate sneaks in and the size is 2. Override both together.",
      },
      {
        id: "eh-q3",
        question: "Which part of the equals/hashCode contract is actually required?",
        options: [
          { id: "a", label: "Equal objects must have equal hash codes; unequal objects must have different hash codes." },
          { id: "b", label: "Equal objects must have equal hash codes; unequal objects may share a hash code (a collision)." },
          { id: "c", label: "Unequal objects must have equal hash codes; equal objects may differ." },
          { id: "d", label: "Hash codes must be unique for every distinct object in the program." },
        ],
        correctOptionId: "b",
        explanation:
          "The contract is one-directional: equal ⇒ equal hashCode (mandatory). The reverse isn't required — two unequal objects are allowed to share a hashCode. That's a normal collision, resolved by equals inside the bucket. Requiring globally unique hashes would be impossible.",
      },
      {
        id: "eh-q4",
        question:
          "Why is it dangerous to compute `hashCode` from a field you later mutate while the object is inside a `HashMap`?",
        options: [
          { id: "a", label: "It isn't — hashCode is recomputed automatically on every lookup." },
          { id: "b", label: "Mutating the field throws a ConcurrentModificationException." },
          { id: "c", label: "The object's hash changes, so it now belongs in a different bucket and effectively gets 'lost' — lookups fail." },
          { id: "d", label: "The map silently rehashes every element, which is slow but correct." },
        ],
        correctOptionId: "c",
        explanation:
          "The map placed the object in a bucket based on its original hash. Mutating a hash-relevant field changes what hashCode returns, so lookups now compute a different bucket and never find the object — it's stranded in the old bucket. Keep fields used in hashCode immutable.",
      },
      {
        id: "eh-q5",
        question:
          "In JavaScript, you put two distinct objects `{x:2,y:3}` into a `Set`. How many elements does the Set contain, and why?",
        options: [
          { id: "a", label: "1 — JS Sets compare objects by their contents." },
          { id: "b", label: "2 — JS objects only have reference equality, so two distinct objects are always different keys." },
          { id: "c", label: "0 — JS can't store objects in a Set." },
          { id: "d", label: "1 — defining an `equals` method makes the Set deduplicate them." },
        ],
        correctOptionId: "b",
        explanation:
          "JavaScript objects support only reference equality — `Set`/`Map` key on identity and there's no equals/hashCode hook. Two separately created objects are distinct keys, so the Set holds 2. For value semantics you compare fields manually or key a Map by a serialized string like `${x},${y}`.",
      },
    ],
  },
};
