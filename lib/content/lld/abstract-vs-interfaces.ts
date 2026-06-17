import type { RoadmapLesson } from "@/lib/content/types";

export const abstractVsInterfaces: RoadmapLesson = {
  title: "Abstract Classes vs Interfaces",
  oneLiner:
    "An abstract class is a half-built parent you extend — it can hand down real code and stored data, but you get only one. An interface is a checklist of abilities you implement — it carries nothing, but you can stack as many as you like.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/abstract-vs-interfaces.html",
  content: {
    prototypeCaption:
      "Build a smart device, piece by piece. First pick **one foundation** to extend — `Device` (battery-powered) or `Appliance` (wall-powered) — and watch its `Inherited for free` panel fill with working code you didn't write. Then check any number of **capability badges** (`Recordable`, `Dimmable`, …); each drops its methods into the `You must implement` panel. Press **Run it** to see the inherited code run on its own while your own methods fire alongside. Try clicking a *second* foundation — it tells you a class gets only one.",

    overview: [
      {
        type: "p",
        text: "Both an **abstract class** and an **interface** let you say *\"any object of this type will have these methods\"* without writing all the code yet. They look so similar that people mix them up. Here's the real split: an **abstract class is a parent you inherit from** — and it can hand its children real, working code plus stored data. An **interface is just a labelled checklist of abilities** — it hands down nothing; whatever takes it on must write every method itself.",
      },
      {
        type: "p",
        text: "Think of building a smart device. An abstract `Device` is like a **half-finished product coming off the line** — the battery and the charging circuit are *already installed* (that's shared data and working code), but the \"what happens when you switch it on\" part is left blank for each specific product to finish. You can't sell the half-finished unit itself; you complete it into a real `SmartCamera` or `SmartBulb`. An interface like `Recordable` is just a **spec sticker** that says *\"this can record\"* — it installs nothing, so whatever wears the sticker has to wire up `record()` on its own. A product is built on **one** base, but it can wear **many** stickers.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "If the relationship is *\"is a kind of\"* and you want to share code and data → **abstract class**. If it's just *\"can do this\"* and unrelated types need the same ability → **interface**. **is-a → abstract class; can-do → interface.**",
      },
    ],

    howItWorks: [
      { type: "h", text: "An abstract class — a half-built parent" },
      {
        type: "p",
        text: "An abstract class is a normal class with one twist: you *can't create an object from it directly* — it's unfinished. But it can carry almost everything a real class carries, and it hands all of it down to its children:",
      },
      {
        type: "ul",
        items: [
          "**Stored data (fields)** — like a `battery` level — that every child inherits automatically.",
          "**A constructor** — setup code that runs when a child object is built.",
          "**Fully-written methods** — real code, like `charge()`, that every child gets *for free*.",
          "**Blank `abstract` methods** — a method name with no body, which each child is *forced* to fill in.",
        ],
      },
      {
        type: "p",
        text: "A child `extends` the base and *is a* kind of it. The one big limit: a class can extend **only one** base — just as a real product sits on a single chassis. That single inheritance is what keeps the shared-data story simple.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "device.ts",
        code: `// Can't do \`new Device()\` — it's half-built on purpose.
abstract class Device {
  protected battery = 0;            // stored data — every child inherits it

  charge(pct: number): void {      // real, working code — children get it free
    this.battery = Math.min(100, this.battery + pct);
  }

  abstract turnOn(): string;       // blank — each child MUST fill this in
}`,
      },
      { type: "h", text: "An interface — a checklist of an ability" },
      {
        type: "p",
        text: "An interface is leaner: classically it's *just method names, no bodies and no stored data*. A class `implements` it by writing the real code for every method it lists. The superpower is that a single class can implement **many** interfaces at once — stacking abilities that come from completely unrelated places.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "abilities.ts",
        code: `// Interface = the promise of an ability. No data, no code — just the list.
interface Recordable { record(): string; }
interface Connectable { connectWifi(): void; }

// One class can wear MANY stickers at once:
class SmartCamera extends Device implements Recordable, Connectable {
  turnOn()      { return "camera live"; }   // fills Device's blank
  record()      { return "recording 4K…"; } // fulfils Recordable
  connectWifi() { /* … */ }                 // fulfils Connectable
}`,
      },
      { type: "h", text: "Most real classes use both" },
      {
        type: "p",
        text: "These aren't rivals — the everyday answer is to use them *together*. Extend **one** abstract base for the shared data and code, and implement **several** interfaces for the extra abilities. `SmartCamera` *is a* `Device` (so it gets `battery` and `charge()` for free) and *can do* `Recordable` and `Connectable` (so it promises those abilities and writes them itself). Base for what they *are*; interfaces for what they *can do*.",
      },
      {
        type: "callout",
        variant: "info",
        title: "A quick note on your language",
        text: "Modern languages blur the line a little, but the core stays: an interface still holds **no stored data**, and you can still take on **many**. In **Java**, interfaces can add `default` method bodies (Java 8+) yet keep no instance fields. **TypeScript** interfaces just describe a shape and vanish at runtime. **Python** uses `abc.ABC` for abstract classes and `Protocol` for interface-style contracts. **C++** has no `interface` keyword — there an interface is simply a class whose methods are all *pure virtual* (`= 0`).",
      },
    ],

    handsOn: [
      {
        title: "01 · Pick a foundation — you only get one",
        body: "Under **Foundation — extends (pick 1)**, click **Device**. The class card's **Inherited for free** panel fills with `battery`, `charge()`, and `batteryLevel()` — code you now have without writing a line. Now click **Appliance**: the log tells you a class can extend only *one* base, so it *replaces* Device. That swap is **single inheritance** you can feel.",
      },
      {
        title: "02 · Stack as many capabilities as you want",
        body: "Under **Capabilities — implement (pick any)**, check **Recordable**, then **MotionSensor**, then **Connectable**. Each drops its method into the amber **You must implement** panel, and the **Capabilities ∞** counter keeps climbing. Interfaces stack freely — the exact opposite of the one-and-only base.",
      },
      {
        title: "03 · Build it and run it",
        body: "With a foundation and a few badges selected, press **Run it**. In the console, the green lines are *inherited* code running on its own (you wrote zero lines of `charge()`), while the accent and blue lines are the methods *you* had to supply — the base's blank `turnOn()` and each capability. Hit **Reset** to build a different device.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "device.ts",
        code: `// Abstract class: a half-built PARENT — stored data + real code,
// plus a blank method each child must finish. Can't be \`new\`-ed directly.
abstract class Device {
  protected battery = 0;                 // stored data every child inherits

  charge(pct: number): void {            // real code — children get it FREE
    this.battery = Math.min(100, this.battery + pct);
  }

  batteryLevel(): string {               // real code — shared by all devices
    return \`\${this.battery}% battery\`;
  }

  abstract turnOn(): string;             // BLANK — each child fills this in
}

// Interface: just the promise of an ability. No data, no code.
interface Recordable {
  record(): string;
}

// SmartCamera IS-A Device (extends ONE base) and CAN record (implements an interface).
class SmartCamera extends Device implements Recordable {
  turnOn(): string {                     // fills Device's blank
    return "camera live";
  }
  record(): string {                     // fulfils the Recordable promise
    return "recording 4K…";
  }
}

const cam = new SmartCamera();
cam.charge(30);                  // inherited code runs — we never wrote charge()
console.log(cam.batteryLevel()); // "30% battery"
console.log(cam.turnOn());       // "camera live"
console.log(cam.record());       // "recording 4K…"`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Device.java",
        code: `// Abstract class: a half-built PARENT — stored data + real code + a blank method.
abstract class Device {
    protected int battery = 0;            // stored data every child inherits

    void charge(int pct) {                // real code — children get it FREE
        battery = Math.min(100, battery + pct);
    }

    String batteryLevel() {               // real code — shared by all devices
        return battery + "% battery";
    }

    abstract String turnOn();             // BLANK — each child fills this in
}

// Interface: just the promise of an ability — no data, no code.
interface Recordable {
    String record();
}

// SmartCamera IS-A Device (extends ONE) and CAN record (implements many).
class SmartCamera extends Device implements Recordable {
    String turnOn() { return "camera live"; }            // fills Device's blank
    public String record() { return "recording 4K…"; }   // fulfils Recordable

    public static void main(String[] args) {
        SmartCamera cam = new SmartCamera();
        cam.charge(30);                          // inherited code runs
        System.out.println(cam.batteryLevel());  // "30% battery"
        System.out.println(cam.record());        // "recording 4K…"
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "device.py",
        code: `from abc import ABC, abstractmethod
from typing import Protocol


# Abstract base class: stored data + real code + a blank method.
class Device(ABC):
    def __init__(self) -> None:
        self.battery = 0                       # stored data every child inherits

    def charge(self, pct: int) -> None:        # real code — children get it FREE
        self.battery = min(100, self.battery + pct)

    def battery_level(self) -> str:            # real code — shared by all devices
        return f"{self.battery}% battery"

    @abstractmethod
    def turn_on(self) -> str:                  # blank — each child fills this in
        ...


class Recordable(Protocol):                    # interface-style checklist
    def record(self) -> str: ...


# SmartCamera IS-A Device and satisfies the Recordable contract.
class SmartCamera(Device):
    def turn_on(self) -> str:
        return "camera live"

    def record(self) -> str:
        return "recording 4K…"


cam = SmartCamera()
cam.charge(30)                 # inherited code runs — we never wrote charge()
print(cam.battery_level())     # "30% battery"
print(cam.record())            # "recording 4K…"`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "device.cpp",
        code: `// No "interface" keyword — an interface is an all-pure-virtual class.
#include <algorithm>
#include <iostream>
#include <string>

// Abstract class: stored data + real code + a pure-virtual (blank) method.
class Device {
protected:
    int battery = 0;                          // stored data every child inherits
public:
    void charge(int pct) {                    // real code — children get it FREE
        battery = std::min(100, battery + pct);
    }
    std::string batteryLevel() const {        // real code — shared by all
        return std::to_string(battery) + "% battery";
    }
    virtual std::string turnOn() = 0;         // pure virtual — the blank
    virtual ~Device() = default;
};

// Interface = a class with only pure-virtual methods, no stored data.
class Recordable {
public:
    virtual std::string record() = 0;
    virtual ~Recordable() = default;
};

// SmartCamera IS-A Device and CAN record (C++ allows multiple inheritance).
class SmartCamera : public Device, public Recordable {
public:
    std::string turnOn() override { return "camera live"; }
    std::string record() override { return "recording 4K…"; }
};

int main() {
    SmartCamera cam;
    cam.charge(30);                           // inherited code runs
    std::cout << cam.batteryLevel() << "\\n";  // "30% battery"
    std::cout << cam.record() << "\\n";        // "recording 4K…"
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "A simple way to choose" },
      {
        type: "p",
        text: "Start with an **interface** — it's the lighter, more flexible choice, and types that share *nothing but an ability* can still take it on. Reach for an **abstract class** the moment you want to *share real code or stored data* across children that genuinely form an *is-a* family (a `SmartCamera` and a `SmartBulb` really are both a kind of `Device`). And when both pulls are real at once, don't pick — use an abstract base for the shared part and layer interfaces on top for the extra abilities. That last combo is what most real designs land on.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't fake an is-a just to share one method",
        text: "If you reach for an abstract base only to reuse a single helper, you drag every child into one inheritance line they might not belong in. If the types aren't truly the *same kind of thing*, an interface (or composition) keeps them free and untangled.",
      },
    ],

    tradeoffs: {
      pros: [
        "Reach for an **abstract class** when children share a real *is-a* relationship — a `SmartCamera` and a `SmartBulb` are both genuinely a kind of `Device`.",
        "Reach for an **abstract class** when there's *concrete code or stored data* every child should inherit, like a `battery` field and a working `charge()` method.",
        "Reach for an **abstract class** when you want a *constructor* to run the same valid setup for the whole family of children.",
        "Reach for an **abstract class** when *one base is enough* and you want a single, central place to evolve shared behaviour over time.",
      ],
      cons: [
        "Reach for an **interface** when *unrelated types* need the same ability — a `Camera` and a `Phone` can both be `Recordable` without sharing any family.",
        "Reach for an **interface** when one class must *mix several abilities* at once, since a class can implement many but extend only one base.",
        "Reach for an **interface** when you want a *pure contract with no data* — just method names callers can rely on, each type writing its own version.",
        "Reach for an **interface** for *flexibility and easy testing* — any type can opt into a capability and be swapped for a mock, with no inheritance baggage.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Abstract Methods and Classes",
        href: "https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html",
        note: "The canonical Java tutorial on abstract classes and methods — and a clear section on when to choose one over an interface.",
        kind: "docs",
      },
      {
        label: "Oracle — Defining an Interface",
        href: "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html",
        note: "How interfaces work in Java, including default methods (Java 8) and implementing several at once.",
        kind: "docs",
      },
      {
        label: "Python docs — abc (Abstract Base Classes)",
        href: "https://docs.python.org/3/library/abc.html",
        note: "Declaring abstract bases in Python with abc.ABC and @abstractmethod — the abstract-class side of the comparison.",
        kind: "docs",
      },
      {
        label: "Python docs — typing.Protocol (structural interfaces)",
        href: "https://docs.python.org/3/library/typing.html#typing.Protocol",
        note: "Protocol gives Python an interface-style contract without inheritance — the can-do half of the picture.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Interface (object-oriented programming)",
        href: "https://en.wikipedia.org/wiki/Interface_(object-oriented_programming)",
        note: "A language-agnostic overview of interfaces and how they relate to abstract classes across OOP languages.",
        kind: "article",
      },
      {
        label: "Effective Java — Item 20: Prefer interfaces to abstract classes",
        note: "Joshua Bloch's classic argument for defaulting to interfaces, and the skeletal-implementation pattern that combines both.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "ai-q1",
        question:
          "Which capability belongs to an abstract class but NOT to a classic interface?",
        options: [
          { id: "a", label: "Declaring a method that subtypes must implement." },
          { id: "b", label: "Holding stored data (fields) and running a constructor." },
          { id: "c", label: "Being used as a type for a variable." },
          { id: "d", label: "Forcing implementers to provide certain methods." },
        ],
        correctOptionId: "b",
        explanation:
          "Both can declare required methods and both can act as a type. The distinguishing feature is that an abstract class can store data in fields and run a constructor, while a classic interface holds no stored data.",
      },
      {
        id: "ai-q2",
        question:
          "A `SmartCamera` needs to be recordable, motion-sensing, and Wi-Fi connectable — three unrelated abilities. What's the natural fit?",
        options: [
          { id: "a", label: "Three abstract classes, all extended together." },
          { id: "b", label: "One giant abstract class with all three jobs." },
          { id: "c", label: "Three interfaces, all implemented by the one class." },
          { id: "d", label: "Nothing — a class can only ever have one ability." },
        ],
        correctOptionId: "c",
        explanation:
          "A class can implement many interfaces but extend only one base. Three independent abilities map cleanly onto three interfaces the single SmartCamera implements.",
      },
      {
        id: "ai-q3",
        question:
          "Since Java 8, interfaces can include `default` methods with real bodies. Does that make them the same as abstract classes?",
        options: [
          { id: "a", label: "No — interfaces still hold no stored data, and a class can implement many of them." },
          { id: "b", label: "Yes — default methods erase every difference." },
          { id: "c", label: "Yes — interfaces can now have constructors too." },
          { id: "d", label: "No — but only because default methods are rarely used." },
        ],
        correctOptionId: "a",
        explanation:
          "Default methods let interfaces share some code, but interfaces still carry no stored instance data and a class can still implement many of them. Those two facts keep them distinct from abstract classes.",
      },
      {
        id: "ai-q4",
        question:
          "You need children to share a stored `battery` field AND mix in several unrelated abilities. What's the idiomatic design?",
        options: [
          { id: "a", label: "Pick one tool and live with its limitation." },
          { id: "b", label: "Use several abstract classes at once." },
          { id: "c", label: "Make every field public and skip contracts entirely." },
          { id: "d", label: "An abstract base for the shared data, plus interfaces for the extra abilities." },
        ],
        correctOptionId: "d",
        explanation:
          "When the requirements pull both ways, combine them: an abstract base holds the shared data and code (one base), while interfaces add the mix-in abilities a class can implement many of.",
      },
      {
        id: "ai-q5",
        question:
          "Why can't you write `new Device()` when `Device` is an abstract class?",
        options: [
          { id: "a", label: "Because abstract classes are only allowed one method." },
          { id: "b", label: "Because it's deliberately unfinished — it has at least one blank (abstract) method with no body, so there's nothing complete to create." },
          { id: "c", label: "Because abstract classes can't hold any fields." },
          { id: "d", label: "Because only interfaces can be turned into objects." },
        ],
        correctOptionId: "b",
        explanation:
          "An abstract class is incomplete by design — its abstract methods have no bodies. You instantiate a concrete child that fills in those blanks, not the half-built base itself. (An interface can't be instantiated for the same reason: it has no implementations at all.)",
      },
    ],
  },
};
