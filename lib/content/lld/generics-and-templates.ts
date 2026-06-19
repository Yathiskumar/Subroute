import type { RoadmapLesson } from "@/lib/content/types";

export const genericsAndTemplates: RoadmapLesson = {
  title: "Generics & Templates",
  oneLiner:
    "Write a container or algorithm ONCE that works for any type, with the compiler enforcing type safety — no duplication, no casting, no runtime type errors.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/generics-and-templates.html",
  content: {
    prototypeCaption:
      "Pick a type for the box — **Box<number>**, **Box<string>**, or **Box<User>** — then try to put a value in. A matching value slides in (green); a wrong type is rejected *before it runs* with a simulated compile error. Flip on the **raw Box<any>** to see the opposite trade: it swallows anything, then blows up at *runtime* when you use it.",

    overview: [
      {
        type: "p",
        text: "**Generics** (called **templates** in C++) let you write code once and reuse it for many types — a `Stack`, a `List`, a `Box` — without rewriting it per type and without throwing away type safety. The type becomes a *parameter* you fill in later, like an argument, but for types instead of values.",
      },
      {
        type: "p",
        text: "Think of a labelled shipping box. The box design is identical no matter what goes inside, but once you write **\"BOOKS\"** on the side, everyone knows only books belong in it — and a mismatch gets caught at the loading dock, not after the truck has left. A generic `Box<T>` is exactly that: one design, but each box you create is *labelled* with the type it holds.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Generics move type errors from **runtime** (a crash when a user clicks the button) to **compile time** (a red squiggle before you even run the code) — all while writing the container *once*.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The problem: untyped containers force casts and crash late" },
      {
        type: "p",
        text: "Before generics, a reusable container held *anything* — `Object` in Java, `any` in TypeScript, `void*` in C. That sounds flexible, but it has two ugly costs. First, everything you take *out* has lost its type, so you must **cast** it back and hope you guessed right. Second, nothing stops you putting the *wrong* thing in — the mistake only surfaces later, as a runtime crash, often far from where the bug was written:",
      },
      {
        type: "code",
        language: "java",
        filename: "untyped.java",
        code: `// Pre-generics: a box of Object holds anything — and lies to you.
List box = new ArrayList();   // raw, untyped
box.add("hello");             // a String slips in by mistake
box.add(42);                  // ...so does an int

Integer n = (Integer) box.get(0); // cast — compiles fine
// ClassCastException at RUNTIME: "hello" is not an Integer.`,
      },
      {
        type: "p",
        text: "The other escape hatch is just as bad: writing the *same* class twice — an `IntStack`, then a `StringStack`, then a `UserStack` — each a copy-paste with one type swapped. Now a bug fixed in one is still alive in the other two.",
      },
      { type: "h", text: "The fix: a type parameter `T`" },
      {
        type: "p",
        text: "A generic introduces a **type parameter** — a placeholder, conventionally named `T` — that you fill in when you *use* the type. You write `Box<T>` once; callers create `Box<number>`, `Box<string>`, or `Box<User>`. Inside the class, `T` stands for whichever type the caller chose, so `push` accepts a `T` and `pop` returns a `T` — no casting on the way out.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "box.ts",
        code: `class Box<T> {           // T is a type parameter
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
}

const nums = new Box<number>();
nums.push(42);     // ok
const n = nums.pop();   // n is number — no cast needed`,
      },
      { type: "h", text: "Compile-time safety: the wrong type is rejected before it runs" },
      {
        type: "p",
        text: "This is the payoff. Once a box is `Box<number>`, the compiler *knows* `push` only takes a `number`. Hand it a string and the program never even runs — you get an error at your desk, not a 2am page:",
      },
      {
        type: "code",
        language: "typescript",
        filename: "rejected.ts",
        code: `const nums = new Box<number>();
nums.push("oops");
// ✗ Compile error: Argument of type 'string'
//   is not assignable to parameter of type 'number'.`,
      },
      { type: "h", text: "Bounded type parameters: \"any T, but it must be able to…\"" },
      {
        type: "p",
        text: "Sometimes \"any type\" is *too* loose — you need a `T` that supports a particular operation. A **bounded** type parameter constrains it. `T extends Comparable` means \"any type, as long as it can be compared\" — so inside the generic you can safely call `a.compareTo(b)`. You keep the reuse, but the compiler guarantees the capability you depend on.",
      },
      {
        type: "code",
        language: "java",
        filename: "bounded.java",
        code: `// T must be Comparable, so a.compareTo(b) is guaranteed to exist.
static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
max(3, 7);            // ok — Integer is Comparable
max("ant", "bee");    // ok — String is Comparable
// max(new Thread(), new Thread()); // ✗ Thread isn't Comparable`,
      },
      { type: "h", text: "So what exactly is a \"template\"?" },
      {
        type: "p",
        text: "**\"Template\" is C++'s word for the same idea** — write the code once with a type placeholder, fill the type in later. `template <class T> class Box { ... }` is C++ for what Java/C#/TypeScript call a generic `Box<T>`. So *generics* and *templates* are two names for the same goal: parametric reuse with type safety. The reason this lesson pairs the words is that you'll meet both — \"generics\" in Java, C#, TypeScript, Swift, Rust, and \"templates\" in C++ — and they are the same concept seen from two angles.",
      },
      {
        type: "p",
        text: "The angle is what differs. A **template is a recipe, not a class.** `Box<T>` on its own compiles to *nothing* — it's instructions for the compiler. Only when you actually write `Box<int>` does the compiler **stamp out** a brand-new, fully-typed `Box` class with every `T` replaced by `int` (this is called *template instantiation*). Use three types and you get three real, separate generated classes. Java generics work the opposite way: there is one `Box` class and the type is just *checked* then erased — see the callout below.",
      },
      {
        type: "code",
        language: "cpp",
        filename: "template.cpp",
        code: `// "template" is the keyword — T is the placeholder type.
template <class T>
T max(T a, T b) {
    return a > b ? a : b;   // works for any T that supports >
}

max(3, 7);          // compiler STAMPS OUT an int version
max(2.5, 1.5);      // ...and a separate double version
max(std::string{"ant"}, std::string{"bee"});  // ...and a string version
// Each call instantiates a real, concrete function — no casting, full speed.`,
      },
      {
        type: "p",
        text: "Because each instantiation is real generated code, a template can do things a Java generic can't: build the actual `int` machine code (so it runs at full speed with no boxing), take **non-type parameters** like `array<int, 5>` (the size `5` is part of the type), and even compute at compile time — a whole sub-discipline called *template metaprogramming*. The price is the flip side: **code bloat** (every type used generates another copy in the binary) and famously **cryptic error messages** when a type doesn't fit the recipe.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Erasure vs. real instantiation — the key difference",
        text: "This is the one distinction to keep. **Java** uses **type erasure**: `T` is checked at compile time, then *erased* — `Box<Integer>` and `Box<String>` are the *same* class at runtime, so you can't do `new T()` or `instanceof T`. **TypeScript** erases even further — none of the type info survives to runtime. **C++ templates** are the opposite: the compiler **instantiates** a fresh, fully-typed copy per type, so `Box<int>` and `Box<string>` are genuinely different generated classes. Same surface idea (`Box<T>`), two different engines underneath: *erase-and-check* vs *stamp-out-a-copy*.",
      },
    ],

    handsOn: [
      {
        title: "01 · Type the box, then put a match in",
        body: "Leave the dropdown on **Box<number>** (the seed) and type `7` into the input, then press **box.push()**. It lands in the box and the console logs `box.push(42): ok` in green. The box accepts exactly the type it was created with.",
      },
      {
        title: "02 · Try the wrong type — caught at compile time",
        body: "With **Box<number>** still selected, type a word like `hello` and press **box.push()**. A red banner appears: `✗ Compile error: Argument of type 'string' is not assignable to 'number'`, and nothing is added to the box. The mistake is stopped *before* the program runs.",
      },
      {
        title: "03 · Flip to the raw Box<any> and watch it blow up late",
        body: "Toggle **Use raw Box<any>** on. Now *any* value is accepted with no complaint. Push a string, then press **use item — .toFixed()**. With no compile-time check, the bad value sails through and throws a **runtime error** instead. Same mistake, much later — that's the cost generics remove.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "box.ts",
        code: `// One generic class, reused for many types. Pick your language above.
class Box<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
}

const nums = new Box<number>();
nums.push(42);          // ok
const n = nums.pop();   // n: number | undefined — no cast

const words = new Box<string>();
words.push("hi");       // ok

nums.push("oops");
// ✗ Compile error: Argument of type 'string' is not
//   assignable to parameter of type 'number'.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Box.java",
        code: `// One generic class, reused for many types. Pick your language above.
class Box<T> {
    private final java.util.Deque<T> items = new java.util.ArrayDeque<>();
    void push(T item) { items.push(item); }
    T pop()  { return items.pop(); }
    T peek() { return items.peek(); }
}

Box<Integer> nums = new Box<>();
nums.push(42);            // ok
Integer n = nums.pop();   // no cast — T is Integer

Box<String> words = new Box<>();
words.push("hi");         // ok

// nums.push("oops");
// ✗ Compile error: incompatible types:
//   String cannot be converted to Integer.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "box.py",
        code: `# One generic class, reused for many types. Pick your language above.
from typing import Generic, TypeVar, List, Optional

T = TypeVar("T")


class Box(Generic[T]):
    def __init__(self) -> None:
        self._items: List[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> Optional[T]:
        return self._items.pop() if self._items else None

    def peek(self) -> Optional[T]:
        return self._items[-1] if self._items else None


nums: Box[int] = Box()
nums.push(42)        # ok
n = nums.pop()       # a type checker infers int

# nums.push("oops")
# A type checker (mypy/pyright) flags this:
#   Argument 1 has incompatible type "str"; expected "int"`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "box.cpp",
        code: `// One template, instantiated per type at compile time. Pick a language above.
#include <vector>
#include <string>

template <class T>
class Box {
    std::vector<T> items;
public:
    void push(const T& item) { items.push_back(item); }
    T pop() { T v = items.back(); items.pop_back(); return v; }
    const T& peek() const { return items.back(); }
};

int main() {
    Box<int> nums;
    nums.push(42);        // ok
    int n = nums.pop();   // T is int — no cast

    Box<std::string> words;
    words.push("hi");     // ok

    // nums.push("oops");
    // ✗ Compile error: no matching function — cannot convert
    //   'const char[5]' to 'const int&'.
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for generics when…" },
      {
        type: "ul",
        items: [
          "You're writing a **container or collection** — a stack, queue, cache, list, tree — that should work for *any* element type without you rewriting it per type.",
          "You catch yourself **copy-pasting a class** and swapping one type (`IntStack` → `StringStack`). That duplication is the signal: parameterize it with `T` instead.",
          "An algorithm is **shape-agnostic** — `max`, `swap`, `map`, `filter` — and only needs the element to support a small capability. Use a **bounded** parameter (`T extends Comparable`) to require exactly that capability and no more.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't reach for `<T>` by reflex",
        text: "If a type only ever holds *one* concrete type, a plain non-generic class is clearer. Generics earn their keep when the *same* logic genuinely serves many types. A signature crammed with `<T, U, V extends Foo<T>>` for a one-off helper costs more readability than the reuse buys back.",
      },
    ],

    tradeoffs: {
      pros: [
        "Write the container or algorithm **once** and reuse it for every type — no copy-pasted IntStack/StringStack variants.",
        "**Compile-time type safety**: a wrong-type insert is rejected before the program runs, not as a runtime crash.",
        "**No casting** on the way out — `pop()` already returns `T`, so you keep the real type with no `(Integer)` casts.",
        "Self-documenting APIs: `Box<User>` states exactly what it holds, so callers and tools can't get it wrong.",
      ],
      cons: [
        "**Over-generic signatures** hurt readability — too many type parameters and bounds turn a simple helper into a puzzle.",
        "**Java erasure limits**: `T` is gone at runtime, so you can't do `new T()`, `instanceof T`, or make a `T[]` directly.",
        "**C++ template bloat & cryptic errors**: each instantiation generates real code (binary size), and a tiny mismatch can spew pages of unreadable compiler output.",
        "Easy to over-reach: forcing `<T>` onto code that only ever uses one type adds ceremony with no payoff.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Generics (Java Tutorial)",
        href: "https://docs.oracle.com/javase/tutorial/java/generics/index.html",
        note: "The canonical introduction to Java generics: type parameters, bounded types, wildcards, and erasure.",
        kind: "docs",
      },
      {
        label: "TypeScript Handbook — Generics",
        href: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
        note: "Generic functions, classes, constraints (`extends`), and default type parameters, with runnable examples.",
        kind: "docs",
      },
      {
        label: "cppreference — Templates",
        href: "https://en.cppreference.com/w/cpp/language/templates",
        note: "Reference for C++ class and function templates — the compile-time instantiation model behind `template<class T>`.",
        kind: "docs",
      },
      {
        label: "Python docs — typing.Generic",
        href: "https://docs.python.org/3/library/typing.html#typing.Generic",
        note: "How `Generic[T]` and `TypeVar` declare generic classes that static checkers like mypy and pyright enforce.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Generic programming",
        href: "https://en.wikipedia.org/wiki/Generic_programming",
        note: "A broad, language-agnostic map of generics, templates, and parametric polymorphism across languages.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "gn-q1",
        question: "What is the main benefit of a generic `Box<T>` over an untyped `Box` that holds `Object`/`any`?",
        options: [
          { id: "a", label: "It always runs faster at runtime." },
          { id: "b", label: "It uses less memory per element." },
          { id: "c", label: "The compiler enforces the element type, so wrong-type inserts and casts are caught before running." },
          { id: "d", label: "It can hold more elements than an untyped box." },
        ],
        correctOptionId: "c",
        explanation:
          "A generic ties the container to a specific type. The compiler then rejects a wrong-type `push` and lets `pop` return `T` with no cast — moving the error from runtime to compile time.",
      },
      {
        id: "gn-q2",
        question: "You have `Box<number> b`. What happens when you write `b.push(\"hello\")` in a typed language?",
        options: [
          { id: "a", label: "It compiles, then throws a runtime exception when you call push." },
          { id: "b", label: "It is a compile error: a string is not assignable to number — the program never runs." },
          { id: "c", label: "It silently converts the string to a number." },
          { id: "d", label: "It adds the string but pop() returns it as a number." },
        ],
        correctOptionId: "b",
        explanation:
          "Because the box is `Box<number>`, `push` only accepts a `number`. Passing a string is rejected at compile time, so the mistake is caught at your desk rather than as a runtime crash.",
      },
      {
        id: "gn-q3",
        question: "What does a bounded type parameter like `<T extends Comparable<T>>` give you?",
        options: [
          { id: "a", label: "It makes T any type at all, with no restrictions." },
          { id: "b", label: "It forces T to be exactly the Comparable class, nothing else." },
          { id: "c", label: "It allows any T that supports the Comparable capability, so you can safely call compareTo inside the generic." },
          { id: "d", label: "It disables type checking for that parameter." },
        ],
        correctOptionId: "c",
        explanation:
          "A bound constrains `T` to types that have a required capability. `T extends Comparable` admits any comparable type and lets the generic safely call `compareTo`, while still rejecting types that lack it.",
      },
      {
        id: "gn-q4",
        question: "Which statement about how generics work at runtime is correct?",
        options: [
          { id: "a", label: "Java keeps full generic type info at runtime, so `new T()` and `instanceof T` always work." },
          { id: "b", label: "Java erases generic types at runtime, while C++ instantiates a separate concrete class per type used." },
          { id: "c", label: "C++ erases template types at runtime just like Java." },
          { id: "d", label: "TypeScript generics are fully present at runtime and can be inspected." },
        ],
        correctOptionId: "b",
        explanation:
          "Java uses type erasure — `T` is checked then removed, so runtime can't do `new T()` or `instanceof T`. C++ templates are instantiated at compile time into distinct concrete classes. TypeScript types are erased entirely.",
      },
      {
        id: "gn-q6",
        question: "In C++, what does `template <class T> class Box` actually produce when you write `Box<int>` and `Box<string>`?",
        options: [
          { id: "a", label: "One shared Box class; the type is checked then erased, exactly like Java." },
          { id: "b", label: "Two genuinely separate generated classes — the compiler stamps out a fresh, fully-typed copy per type used." },
          { id: "c", label: "Nothing until runtime, when the type is resolved dynamically." },
          { id: "d", label: "A single class that stores its element type as a runtime field." },
        ],
        correctOptionId: "b",
        explanation:
          "A C++ template is a recipe, not a class. Each use instantiates a brand-new concrete class with `T` replaced — so `Box<int>` and `Box<string>` are different generated types. That's the opposite of Java's erase-and-check model, and it's why templates give full-speed code but can cause code bloat.",
      },
      {
        id: "gn-q5",
        question: "An untyped `Box<any>` accepts a string, and later code calls `.toFixed()` on the popped value expecting a number. When does this fail?",
        options: [
          { id: "a", label: "At compile time — the any box rejects the string up front." },
          { id: "b", label: "It never fails; any handles everything safely." },
          { id: "c", label: "At runtime — there was no compile-time check, so the bad value blows up when used." },
          { id: "d", label: "At link time, before the program starts." },
        ],
        correctOptionId: "c",
        explanation:
          "`any`/`Object` disables the compile-time check, so the wrong value slips in silently and only crashes later when used as a number. That late failure is exactly what a generic `Box<number>` prevents.",
      },
    ],
  },
};
