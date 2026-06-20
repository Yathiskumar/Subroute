import type { RoadmapLesson } from "@/lib/content/types";

export const interfaceSegregation: RoadmapLesson = {
  title: "Interface Segregation Principle (ISP)",
  oneLiner:
    "The “I” in SOLID: no client should be forced to depend on methods it doesn't use. Prefer many small, focused interfaces over one fat one — so a simple printer never has to fake a scan() it can't do.",
  difficulty: "beginner",
  estimatedTime: "16 min",
  prototypePath: "/prototypes/lld/interface-segregation.html",
  content: {
    prototypeCaption:
      "A device shop with a mode switch. In **Fat interface** mode, one big `IMultiFunctionDevice { print(); scan(); fax(); }` forces every device — `SimplePrinter`, `Scanner`, `PhotoCopier` — to implement all three methods. Click a method: green means the device can really do it, red means it was *forced* to declare it and can only `throw UnsupportedOperationException`. A running tally counts the **forced stubs**. Flip to **Segregated** mode and the fat contract splits into `Printer` / `Scanner` / `Fax` role interfaces — each device now exposes only the methods it genuinely supports, nothing throws, and the forced-stub tally drops to **0**. One fixed panel narrates every click; nothing scrolls away.",

    overview: [
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "No client should be forced to depend on methods it doesn't use — **prefer many small, focused interfaces over one fat one.**",
      },
      {
        type: "p",
        text: "The **Interface Segregation Principle** is the *I* in SOLID. It says something simple: don't make a class promise to do things it can't actually do. If an interface lists ten methods and a class only really needs three of them, that class is being *forced* to depend on seven methods it doesn't use. ISP tells you to break the big interface into small ones, so every class signs up for only what it truly does.",
      },
      {
        type: "p",
        text: "Think of a restaurant menu. A vegetarian sitting down shouldn't be handed a menu where the only option is a giant combo platter of steak, fish, *and* a salad — they just want the salad. A good restaurant offers separate sections so each diner picks only what they want. A fat interface is the combo-only menu: it forces everyone to take the whole thing. ISP is the menu with sections — small, focused choices.",
      },
      {
        type: "p",
        text: "Another way to picture it: a universal remote with 50 buttons when all you do is turn the TV on, change the channel, and adjust the volume. The other 47 buttons aren't just clutter — every one is a thing you now *depend on* that can break, confuse you, or change under you. A small remote with the 3 buttons you use is the segregated version.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The smell: a fat interface" },
      {
        type: "p",
        text: "A **fat interface** is one big contract that bundles together methods that don't all belong to every implementer. The classic textbook example is a `Worker` interface with `work()`, `eat()`, and `sleep()`. That's fine for a human worker — but the day you add a `RobotWorker`, it's suddenly forced to implement `eat()` and `sleep()`, which make no sense for a robot. The robot has to provide *something*, so it ends up with empty or throwing methods.",
      },
      {
        type: "p",
        text: "The most famous version is the **multifunction device**. Imagine one interface, `IMultiFunctionDevice`, with `print()`, `scan()`, and `fax()`. A fancy office `PhotoCopier` can do all three — great. But a humble `SimplePrinter` can only print. Because it implements the fat interface, it is *forced* to provide `scan()` and `fax()` anyway — methods it has no hardware for. All it can do is throw:",
      },
      {
        type: "code",
        language: "java",
        code: `class SimplePrinter implements IMultiFunctionDevice {
    public void print() { /* real work */ }

    // forced on us by the fat interface — we can't actually do these:
    public void scan() { throw new UnsupportedOperationException(); }
    public void fax()  { throw new UnsupportedOperationException(); }
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Empty or throwing stubs are the tell",
        text: "When you find yourself writing a method body that is empty, returns `null`, or just `throw new UnsupportedOperationException()` — stop. That stub is a sign the interface is fatter than the class. The class is being forced to depend on a method it doesn't use, which is exactly what ISP forbids.",
      },
      { type: "h", text: "Why a forced stub hurts" },
      {
        type: "ul",
        items: [
          "**It pollutes every implementer.** Every class that implements the fat interface must write *all* the methods, even the ones it can't do — so the same throwing stubs get copy-pasted everywhere.",
          "**It lies to callers.** Code that holds an `IMultiFunctionDevice` reference *thinks* it can call `scan()`. At runtime, on a `SimplePrinter`, that call blows up. The interface promised something the object can't keep.",
          "**It blocks change.** Add a `staple()` method to the fat interface and *every* device — even ones with no stapler — must be touched. Small interfaces only ripple to the classes that genuinely care.",
        ],
      },
      { type: "h", text: "The fix: split into role interfaces" },
      {
        type: "p",
        text: "Break the fat interface into small **role interfaces** — one per capability. `Printer` has just `print()`. `Scanner` has just `scan()`. `Fax` has just `fax()`. Now each class implements *only* the roles it can truly fulfil. A `SimplePrinter` implements `Printer`. A multifunction `PhotoCopier` implements all three — `Printer`, `Scanner`, and `Fax` — because it genuinely does all three. No class is ever forced; no stub ever throws.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 470" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Before: one fat IMultiFunctionDevice interface with print, scan and fax; SimplePrinter and PhotoCopier both implement it, but SimplePrinter is forced to throw on scan and fax. After: three small interfaces Printer, Scanner and Fax; SimplePrinter implements only Printer, PhotoCopier implements all three.">
  <defs>
    <marker id="isp-tri" markerUnits="userSpaceOnUse" markerWidth="16" markerHeight="14" refX="14" refY="7" orient="auto"><path d="M2,1 L14,7 L2,13 Z" fill="#14161a" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <!-- ====================== BEFORE ====================== -->
  <text x="20" y="26" font-size="12" font-weight="700" fill="#fb863a">BEFORE — one fat interface</text>

  <!-- fat interface -->
  <rect x="118" y="44" width="180" height="92" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <line x1="118" y1="68" x2="298" y2="68" stroke="#2d333d" stroke-width="1"/>
  <text x="208" y="61" text-anchor="middle" font-size="11" font-style="italic" fill="#9099a8">«interface»</text>
  <text x="208" y="86" text-anchor="middle" font-size="12.5" font-weight="700" fill="#e8e4dc">IMultiFunctionDevice</text>
  <text x="132" y="106" font-size="11.5" fill="#5e9ff6">+ print()</text>
  <text x="132" y="122" font-size="11.5" fill="#5e9ff6">+ scan()  + fax()</text>

  <!-- realization arrows up to the fat interface -->
  <line x1="100" y1="220" x2="168" y2="142" stroke="#9099a8" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#isp-tri)"/>
  <line x1="248" y1="220" x2="250" y2="142" stroke="#9099a8" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#isp-tri)"/>

  <!-- SimplePrinter (before) -->
  <rect x="20" y="222" width="160" height="118" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <line x1="20" y1="246" x2="180" y2="246" stroke="#2d333d" stroke-width="1"/>
  <text x="100" y="240" text-anchor="middle" font-size="12" font-weight="700" fill="#e8e4dc">SimplePrinter</text>
  <text x="34" y="266" font-size="11" fill="#5cc66f">+ print()  ✓</text>
  <text x="34" y="288" font-size="11" fill="#f06868">+ scan()  ✗ throws</text>
  <text x="34" y="310" font-size="11" fill="#f06868">+ fax()   ✗ throws</text>
  <text x="34" y="331" font-size="9.5" fill="#9099a8">2 forced stubs</text>

  <!-- PhotoCopier (before) -->
  <rect x="216" y="222" width="160" height="118" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <line x1="216" y1="246" x2="376" y2="246" stroke="#2d333d" stroke-width="1"/>
  <text x="296" y="240" text-anchor="middle" font-size="12" font-weight="700" fill="#e8e4dc">PhotoCopier</text>
  <text x="230" y="266" font-size="11" fill="#5cc66f">+ print()  ✓</text>
  <text x="230" y="288" font-size="11" fill="#5cc66f">+ scan()  ✓</text>
  <text x="230" y="310" font-size="11" fill="#5cc66f">+ fax()   ✓</text>
  <text x="230" y="331" font-size="9.5" fill="#9099a8">0 forced stubs</text>

  <!-- divider -->
  <line x1="404" y1="44" x2="404" y2="430" stroke="#2d333d" stroke-width="1" stroke-dasharray="3 5"/>

  <!-- ====================== AFTER ====================== -->
  <text x="424" y="26" font-size="12" font-weight="700" fill="#fb863a">AFTER — three role interfaces</text>

  <!-- three small interfaces -->
  <rect x="430" y="44" width="80" height="46" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="470" y="64" text-anchor="middle" font-size="10.5" font-weight="700" fill="#e8e4dc">Printer</text>
  <text x="470" y="80" text-anchor="middle" font-size="10" fill="#5e9ff6">+ print()</text>

  <rect x="524" y="44" width="80" height="46" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="564" y="64" text-anchor="middle" font-size="10.5" font-weight="700" fill="#e8e4dc">Scanner</text>
  <text x="564" y="80" text-anchor="middle" font-size="10" fill="#5e9ff6">+ scan()</text>

  <rect x="618" y="44" width="80" height="46" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="658" y="64" text-anchor="middle" font-size="10.5" font-weight="700" fill="#e8e4dc">Fax</text>
  <text x="658" y="80" text-anchor="middle" font-size="10" fill="#5e9ff6">+ fax()</text>

  <!-- SimplePrinter (after) -> Printer only -->
  <line x1="470" y1="240" x2="470" y2="96" stroke="#9099a8" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#isp-tri)"/>
  <rect x="430" y="242" width="150" height="74" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <line x1="430" y1="266" x2="580" y2="266" stroke="#2d333d" stroke-width="1"/>
  <text x="505" y="260" text-anchor="middle" font-size="11.5" font-weight="700" fill="#e8e4dc">SimplePrinter</text>
  <text x="444" y="286" font-size="11" fill="#5cc66f">+ print()  ✓</text>
  <text x="444" y="305" font-size="9.5" fill="#9099a8">0 forced stubs</text>

  <!-- PhotoCopier (after) -> all three -->
  <line x1="640" y1="360" x2="486" y2="96" stroke="#9099a8" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#isp-tri)"/>
  <line x1="648" y1="360" x2="566" y2="96" stroke="#9099a8" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#isp-tri)"/>
  <line x1="656" y1="360" x2="652" y2="96" stroke="#9099a8" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#isp-tri)"/>
  <rect x="568" y="362" width="150" height="92" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <line x1="568" y1="386" x2="718" y2="386" stroke="#2d333d" stroke-width="1"/>
  <text x="643" y="380" text-anchor="middle" font-size="11.5" font-weight="700" fill="#e8e4dc">PhotoCopier</text>
  <text x="582" y="406" font-size="11" fill="#5cc66f">+ print()  ✓</text>
  <text x="582" y="424" font-size="11" fill="#5cc66f">+ scan()  ✓  + fax() ✓</text>
  <text x="582" y="444" font-size="9.5" fill="#9099a8">0 forced stubs</text>
</svg>`,
        caption:
          "**Before:** one fat `IMultiFunctionDevice` forces both `SimplePrinter` and `PhotoCopier` to implement all three methods — so `SimplePrinter` is stuck with two *forced stubs* that throw on `scan()` and `fax()`. **After:** the contract is split into `Printer`, `Scanner`, and `Fax`; `SimplePrinter` implements only `Printer`, `PhotoCopier` implements all three, and *nobody* is forced — the stub count is **0** everywhere.",
      },
      { type: "h", text: "Links to LSP and to cohesion" },
      {
        type: "p",
        text: "ISP doesn't live alone. Those throwing stubs also break the **Liskov Substitution Principle (LSP)**: a caller holding an `IMultiFunctionDevice` expects every method to work, but substituting a `SimplePrinter` makes `scan()` blow up — the subtype isn't a safe stand-in for the type. Splitting the interface fixes both problems at once.",
      },
      {
        type: "callout",
        variant: "info",
        title: "ISP is high cohesion, at the interface level",
        text: "A small role interface groups methods that *belong together* and that the same clients use together — that's **high cohesion**. A fat interface is the opposite: a grab-bag of unrelated capabilities. So you can read ISP as: keep each interface cohesive, and let classes implement exactly the cohesive roles they fulfil.",
      },
    ],

    handsOn: [
      {
        title: "01 · Count the forced stubs",
        body: "Open the prototype in its default **Fat interface** mode. Read the big tally number at the bottom — those are the **forced stubs** across all three devices. Now click the red `scan()` button on `SimplePrinter`: watch the panel report `throw UnsupportedOperationException`. That red button is a method the printer was *forced* to declare but can't actually do.",
      },
      {
        title: "02 · Find the only device that's happy",
        body: "Still in Fat mode, click `print()`, `scan()`, and `fax()` on the `PhotoCopier`. Every one is green / supported — because a multifunction copier genuinely does all three. Compare that to `SimplePrinter` and `Scanner`, which each light up red on the methods they don't have. The fat interface only fits the device that happens to do everything.",
      },
      {
        title: "03 · Segregate and watch the tally hit 0",
        body: "Flip the toggle to **Segregated** mode. The fat interface splits into `Printer` / `Scanner` / `Fax`, and each device card now shows *only* the methods it truly supports — the impossible ones simply disappear. Click around: nothing throws anymore, and the forced-stub tally drops to **0**. That zero is the Interface Segregation Principle, made visible.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "interface-segregation.ts",
        code: `// ❌ FAT INTERFACE — one contract bundles three capabilities.
interface IMultiFunctionDevice {
  print(): void;
  scan(): void;
  fax(): void;
}

// A simple printer is FORCED to implement scan() and fax() it can't do.
class SimplePrinter implements IMultiFunctionDevice {
  print(): void { /* real work */ }
  scan(): void { throw new Error("UnsupportedOperationException"); } // forced stub
  fax(): void { throw new Error("UnsupportedOperationException"); }  // forced stub
}

// ✅ SEGREGATED — one small role interface per capability.
interface Printer { print(): void; }
interface Scanner { scan(): void; }
interface Fax { fax(): void; }

// Each class implements ONLY the roles it can truly fulfil.
class SimplePrinter2 implements Printer {
  print(): void { /* real work — nothing forced, nothing throws */ }
}

class PhotoCopier implements Printer, Scanner, Fax {
  print(): void { /* ... */ }
  scan(): void { /* ... */ }
  fax(): void { /* ... */ }
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "InterfaceSegregation.java",
        code: `// ❌ FAT INTERFACE — one contract bundles three capabilities.
interface IMultiFunctionDevice {
    void print();
    void scan();
    void fax();
}

// A simple printer is FORCED to implement scan() and fax() it can't do.
class SimplePrinter implements IMultiFunctionDevice {
    public void print() { /* real work */ }
    public void scan() { throw new UnsupportedOperationException(); } // forced stub
    public void fax()  { throw new UnsupportedOperationException(); } // forced stub
}

// ✅ SEGREGATED — one small role interface per capability.
interface Printer { void print(); }
interface Scanner { void scan(); }
interface Fax     { void fax(); }

// Each class implements ONLY the roles it can truly fulfil.
class SimplePrinter2 implements Printer {
    public void print() { /* real work — nothing forced, nothing throws */ }
}

class PhotoCopier implements Printer, Scanner, Fax {
    public void print() { /* ... */ }
    public void scan()  { /* ... */ }
    public void fax()   { /* ... */ }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "interface_segregation.py",
        code: `from typing import Protocol

# ❌ FAT INTERFACE — one Protocol bundles three capabilities.
class IMultiFunctionDevice(Protocol):
    def print(self) -> None: ...
    def scan(self) -> None: ...
    def fax(self) -> None: ...

# A simple printer is FORCED to provide scan() and fax() it can't do.
class SimplePrinter:
    def print(self) -> None: ...                       # real work
    def scan(self) -> None:
        raise NotImplementedError("not supported")     # forced stub
    def fax(self) -> None:
        raise NotImplementedError("not supported")     # forced stub

# ✅ SEGREGATED — one small role Protocol per capability.
class Printer(Protocol):
    def print(self) -> None: ...

class Scanner(Protocol):
    def scan(self) -> None: ...

class Fax(Protocol):
    def fax(self) -> None: ...

# Each class implements ONLY the roles it can truly fulfil.
class SimplePrinter2:           # satisfies Printer
    def print(self) -> None: ...  # nothing forced, nothing raises

class PhotoCopier:              # satisfies Printer, Scanner, Fax
    def print(self) -> None: ...
    def scan(self) -> None: ...
    def fax(self) -> None: ...`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "interface_segregation.cpp",
        code: `#include <stdexcept>

// ❌ FAT INTERFACE — one pure-virtual class bundles three capabilities.
class IMultiFunctionDevice {
public:
    virtual void print() = 0;
    virtual void scan() = 0;
    virtual void fax() = 0;
    virtual ~IMultiFunctionDevice() = default;
};

// A simple printer is FORCED to implement scan() and fax() it can't do.
class SimplePrinter : public IMultiFunctionDevice {
public:
    void print() override { /* real work */ }
    void scan() override { throw std::logic_error("unsupported"); } // forced stub
    void fax()  override { throw std::logic_error("unsupported"); } // forced stub
};

// ✅ SEGREGATED — one small role interface per capability.
class Printer { public: virtual void print() = 0; virtual ~Printer() = default; };
class Scanner { public: virtual void scan()  = 0; virtual ~Scanner() = default; };
class Fax     { public: virtual void fax()   = 0; virtual ~Fax() = default; };

// Each class implements ONLY the roles it can truly fulfil.
class SimplePrinter2 : public Printer {
public:
    void print() override { /* real work — nothing forced, nothing throws */ }
};

class PhotoCopier : public Printer, public Scanner, public Fax {
public:
    void print() override { /* ... */ }
    void scan()  override { /* ... */ }
    void fax()   override { /* ... */ }
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to split an interface" },
      {
        type: "p",
        text: "Reach for ISP whenever you notice the tell-tale signs: a class implementing an interface with empty bodies, `null` returns, or `throw UnsupportedOperationException`; an interface that keeps growing as new, unrelated features arrive; or different clients that each use only a small, *different* slice of the same big interface. In each case, carve the fat interface into role interfaces grouped by who-uses-what, and let each class implement only the roles it can honestly keep.",
      },
      {
        type: "p",
        text: "Note that *“interface”* here is broader than the `interface` keyword. It also means a **class's public surface** — the set of public methods other code can call — and a **role** an object plays for a particular client. ISP applies to all three: a class with 30 public methods, where each caller uses only a handful, is just as fat as a 30-method interface, and can be split the same way.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't over-segregate into one method per interface",
        text: "ISP is about *cohesion*, not maximum fragmentation. If you reflexively give every single method its own interface, you get a confetti of `IPrintable`, `IScannable`, `IFaxable`, `IStapleable`… that's just as hard to use as the fat one — now the pain is spread across dozens of tiny files. Group methods that genuinely belong together and that the same clients use together. Split when a client is forced to depend on something it doesn't use; *don't* split when the methods naturally travel as a set.",
      },
    ],

    tradeoffs: {
      pros: [
        "No forced stubs — every class implements only methods it can truly perform, so empty/throwing bodies disappear.",
        "Changes stay local: adding a method to one role interface only touches the classes that play that role, not every implementer.",
        "Clients depend on exactly the small contract they need, which lowers coupling and makes test doubles tiny and easy to write.",
        "Reinforces LSP and high cohesion — subtypes become safe substitutes and each interface describes one coherent capability.",
      ],
      cons: [
        "More interfaces (and files) to name, navigate, and keep track of — extra ceremony for small or stable designs.",
        "Over-applied, it fragments into one-method interfaces, which is its own kind of clutter and confusion.",
        "A class that genuinely does many things (a true multifunction device) must now declare it implements several interfaces, lengthening its header.",
        "Deciding where the seams go takes design judgement; splitting along the wrong axis just relocates the coupling.",
      ],
    },

    furtherReading: [
      {
        label: "Interface segregation principle — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Interface_segregation_principle",
        note: "The concise definition plus the origin story: ISP came out of Robert C. Martin's work for Xerox, whose fat Job class was the original multifunction-device problem.",
        kind: "article",
      },
      {
        label: "The Interface Segregation Principle — Robert C. Martin (cleancoder)",
        href: "https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html",
        note: "Uncle Bob, who coined the principle, on the SOLID set it belongs to. The original ISP paper is also linked from his archive at objectmentor.",
        kind: "article",
      },
      {
        label: "Interface Segregation Principle in Java — Baeldung",
        href: "https://www.baeldung.com/java-interface-segregation",
        note: "A hands-on, code-first walkthrough that refactors a fat interface into role interfaces in Java — the closest companion to this lesson's examples.",
        kind: "docs",
      },
      {
        label: "Refactoring: Extract Interface — Refactoring.Guru",
        href: "https://refactoring.guru/extract-interface",
        note: "The mechanical refactoring you apply to *do* ISP: pull a cohesive subset of methods into a new interface. Pairs with their SOLID overview.",
        kind: "docs",
      },
      {
        label: "SOLID Principles: Interface Segregation — video walkthrough",
        href: "https://www.youtube.com/watch?v=27qFFp2Ansg",
        note: "A clear visual explainer of ISP with the printer/scanner example, good for seeing the before-and-after refactor narrated step by step.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "interface-segregation-q1",
        question: "What does the Interface Segregation Principle state?",
        options: [
          { id: "a", label: "No client should be forced to depend on methods it doesn't use." },
          { id: "b", label: "A class should have only one reason to change." },
          { id: "c", label: "Subtypes must be substitutable for their base types." },
          { id: "d", label: "High-level modules should not depend on low-level modules." },
        ],
        correctOptionId: "a",
        explanation:
          "ISP, the “I” in SOLID, says no client should be forced to depend on methods it doesn't use — prefer many small, focused interfaces over one fat one. Option B is SRP, C is LSP, and D is DIP.",
      },
      {
        id: "interface-segregation-q2",
        question:
          "A `SimplePrinter` implements `IMultiFunctionDevice { print(); scan(); fax(); }` and its `scan()` body is just `throw new UnsupportedOperationException()`. What is this a sign of?",
        options: [
          { id: "a", label: "A fat interface — the class is forced to depend on a method it can't use." },
          { id: "b", label: "Correct defensive programming; throwing is the right way to handle scan." },
          { id: "c", label: "A missing abstract base class." },
          { id: "d", label: "The printer needs more memory to scan." },
        ],
        correctOptionId: "a",
        explanation:
          "An empty, null-returning, or throwing stub is the classic tell of an ISP violation: the interface is fatter than the class. `SimplePrinter` was forced to declare `scan()`/`fax()` it can't perform. The fix is to split the interface so the printer only implements what it can do.",
      },
      {
        id: "interface-segregation-q3",
        question: "How does ISP fix the multifunction-device problem?",
        options: [
          { id: "a", label: "Split the fat interface into role interfaces (Printer, Scanner, Fax) so each class implements only what it truly does." },
          { id: "b", label: "Make `SimplePrinter` extend `PhotoCopier` to inherit the missing methods." },
          { id: "c", label: "Add a `boolean canScan()` flag callers must check before every call." },
          { id: "d", label: "Catch and swallow the UnsupportedOperationException everywhere." },
        ],
        correctOptionId: "a",
        explanation:
          "Break the fat `IMultiFunctionDevice` into small role interfaces — `Printer`, `Scanner`, `Fax`. `SimplePrinter` implements only `Printer`; a `PhotoCopier` implements all three because it genuinely does all three. No class is forced, and no method has to throw.",
      },
      {
        id: "interface-segregation-q4",
        question: "Which other SOLID principle do throwing stubs also violate, and why?",
        options: [
          { id: "a", label: "LSP — a caller expects every method on the type to work, but substituting `SimplePrinter` makes `scan()` blow up." },
          { id: "b", label: "SRP — because the printer now has two responsibilities." },
          { id: "c", label: "DIP — because it depends on a concrete class." },
          { id: "d", label: "None — throwing stubs are perfectly fine under LSP." },
        ],
        correctOptionId: "a",
        explanation:
          "A throwing stub breaks the Liskov Substitution Principle: code holding an `IMultiFunctionDevice` assumes `scan()` works, but a `SimplePrinter` substituted in throws — so the subtype isn't a safe stand-in. Splitting the interface fixes ISP and LSP together.",
      },
      {
        id: "interface-segregation-q5",
        question: "What is the danger of over-applying ISP?",
        options: [
          { id: "a", label: "Fragmenting into one method per interface, scattering the design into needless tiny contracts." },
          { id: "b", label: "Classes can no longer implement more than one interface." },
          { id: "c", label: "Interfaces stop compiling once they have fewer than three methods." },
          { id: "d", label: "It forces every class to throw UnsupportedOperationException." },
        ],
        correctOptionId: "a",
        explanation:
          "ISP is about cohesion, not maximum fragmentation. Giving every single method its own interface produces confetti — `IPrintable`, `IScannable`, `IFaxable`… — that's as hard to work with as a fat interface. Group methods that belong together and that the same clients use together; split only when a client is forced to depend on something it doesn't use.",
      },
    ],
  },
};
