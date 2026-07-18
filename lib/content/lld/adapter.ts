import type { RoadmapLesson } from "@/lib/content/types";

export const adapter: RoadmapLesson = {
  title: "Adapter",
  oneLiner:
    "Make two incompatible interfaces work together by putting a small translator between them. Your app expects `logger.log(message)`, but the third-party library only understands `writeXml(xmlString)` — like a round socket and a square plug. You can't change either side, so you wrap the library in an *adapter* that speaks both: it takes `log()` calls from your code and turns them into `writeXml()` calls for the library.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/adapter.html",
  content: {
    prototypeCaption:
      "A **travel plug adapter** for code. On the left, your app's card calls `logger.log(\"User signed up\")` through a **round socket**. On the right, `XmlLoggerLib.writeXml(xml)` sticks out a **square plug**. Press *▶ Plug in directly* and watch them clash — the shapes just don't fit. Press *＋ Add adapter* and a translator drops into the middle slot: round on the client side, square on the library side, with the mapping `log(msg) → writeXml(<log>msg</log>)` printed on it. Now press *▶ logger.log(...)* and follow the message: it leaves the client as plain text, the adapter wraps it in XML, and the library flashes green as it receives exactly the format it wants. Keep an eye on the chip that reads **client code changed: 0 lines** — that's the whole point of the pattern.",

    overview: [
      {
        type: "p",
        text: "**Adapter** is the pattern you reach for when two pieces of code *should* work together but their interfaces don't line up. Think of a travel plug adapter: your laptop charger has one shape of plug, the wall in another country has a different shape of socket. You don't rewire the wall, and you don't cut the cable — you put a small converter between them that fits both. An Adapter class does exactly that for objects: it sits between your code and something with the *wrong-shaped* interface, translating calls from one form to the other.",
      },
      {
        type: "p",
        text: "Here's the running example for this whole lesson. Your app is written against a tiny `Logger` interface with one method: `log(message)`. That's your *round socket* — dozens of places in your code call it. Now you bring in a great third-party library, `XmlLoggerLib`, but its only method is `writeXml(xmlString)` — a *square plug*. You can't edit the library (it's not your code), and you really don't want to hunt down every `logger.log(...)` call and rewrite it. So you write one small class, `XmlLoggerAdapter`, that *implements* `Logger` on the outside and *calls* `XmlLoggerLib` on the inside, wrapping each message as `<log>message</log>` along the way. Both sides stay untouched; only the adapter knows about the mismatch.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "An Adapter **converts the interface of an existing class into the interface your code expects**, so two classes that couldn't work together can — without changing either one.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You already use adapters every day",
        text: "USB-C to HDMI dongles, card readers, power bricks — all real-world adapters. In code they're just as common: database drivers adapt vendor APIs to one standard interface, and wrapper classes adapt old legacy code to new interfaces. Whenever you see a class named `SomethingAdapter` or `SomethingWrapper`, this pattern is at work.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three participants" },
      {
        type: "p",
        text: "Every Adapter setup has the same three roles. Name them and the pattern becomes easy to spot anywhere:",
      },
      {
        type: "ul",
        items: [
          "**Target** — the interface your client code expects. Here: `Logger` with `log(message)`. This is the *round socket*.",
          "**Adaptee** — the existing class with the useful behaviour but the wrong interface. Here: `XmlLoggerLib` with `writeXml(xmlString)`. This is the *square plug*. You can't (or won't) change it.",
          "**Adapter** — the small class in the middle. It *implements the Target* so the client can use it, and it *holds the Adaptee inside* so it can forward the real work — translating arguments, formats, or method names on the way through.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `// TARGET — what the app expects (round socket)
interface Logger {
  log(message: string): void;
}

// ADAPTEE — third-party, can't change it (square plug)
class XmlLoggerLib {
  writeXml(xmlString: string): void { /* writes XML somewhere */ }
}

// ADAPTER — implements Target, wraps Adaptee
class XmlLoggerAdapter implements Logger {
  constructor(private lib: XmlLoggerLib) {}   // composition

  log(message: string): void {
    this.lib.writeXml(\`<log>\${message}</log>\`);  // translate!
  }
}`,
      },
      {
        type: "p",
        text: "The key line is inside `log()`: the adapter takes the call your app makes, reshapes the data into what the library wants, and forwards it. All the 'mismatch knowledge' lives in this one small class. And crucially, the **client code never changes** — every `logger.log(...)` in your app keeps working exactly as written. You just hand it an `XmlLoggerAdapter` instead of some other `Logger`.",
      },
      { type: "h", text: "Object adapter vs class adapter" },
      {
        type: "p",
        text: "There are two ways to build the adapter, and the difference is *how it reaches the adaptee*:",
      },
      {
        type: "ul",
        items: [
          "**Object adapter (composition)** — the adapter *holds a reference* to the adaptee and forwards calls to it. This is the version above, and the one you should use. It works in every language, it can adapt the adaptee *and all its subclasses*, and it keeps the two classes loosely coupled.",
          "**Class adapter (inheritance)** — the adapter *inherits from* the adaptee (and the target at once). It needs multiple inheritance, so it only really works in languages like C++, and it welds the adapter to one concrete class. It saves a field, but that's about it.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Prefer composition",
        text: "Recommend the object adapter by default: wrap, don't inherit. This is the same principle you met in [[composition-vs-inheritance]] — composition keeps the adapter flexible and testable, and it works everywhere. Reach for a class adapter only in the rare case where you must override some of the adaptee's own behaviour.",
      },
      { type: "h", text: "Don't confuse it with its neighbours" },
      {
        type: "ul",
        items: [
          "**Adapter** changes an interface's *shape* so existing code fits — it adds no new behaviour.",
          "**Facade** ([[facade]]) doesn't translate one interface into another; it invents a *new, simpler* front door over a whole subsystem.",
          "**Decorator** keeps the *same* interface and adds behaviour on top; Adapter changes the interface and adds nothing.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Feel the mismatch",
        body: "Open the prototype and press '▶ Plug in directly'. The square plug lunges at the round socket, both cards shake, and a red ✗ lands in the slot: 'Interfaces don't match.' This is your app trying to call writeXml-shaped code through a log-shaped interface — it simply can't connect. Note the chip at the top: 'client code changed: 0 lines'. We're going to fix this without ever touching the client.",
      },
      {
        title: "02 · Drop in the adapter",
        body: "Press '＋ Add adapter'. A translator piece fills the middle slot — rounded on the client side, square on the library side — printed with the mapping log(msg) → writeXml(<log>msg</log>). That one line is the entire pattern: implement the interface the client expects, forward to the method the library provides. Notice the '▶ logger.log(...)' button lights up: the circuit is now complete.",
      },
      {
        title: "03 · Watch the translation",
        body: "Press '▶ logger.log(...)' and follow the message across the stage: it leaves the client as plain text \"User signed up\", the adapter wraps it into <log>User signed up</log>, and the library card flashes green as it receives valid XML. Now check the chip again — still 'client code changed: 0 lines'. The client kept calling log(), the library kept receiving writeXml(), and only the adapter knew about the mismatch. Press '↺ Reset' and run it once more until the flow feels obvious.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "xml-logger-adapter.ts",
        code: `// TARGET — the interface your app already expects (round socket)
interface Logger {
  log(message: string): void;
}

// ADAPTEE — third-party library, you can't change it (square plug)
class XmlLoggerLib {
  writeXml(xmlString: string): void {
    console.log("[xml-logger]", xmlString);
  }
}

// ADAPTER — implements the Target, wraps the Adaptee (composition)
class XmlLoggerAdapter implements Logger {
  constructor(private lib: XmlLoggerLib) {}

  log(message: string): void {
    // the translation: plain text -> the XML the library wants
    this.lib.writeXml(\`<log>\${message}</log>\`);
  }
}

// CLIENT — written against Logger; it never changes
function signUpUser(logger: Logger): void {
  logger.log("User signed up");
}

// plug the adapter in where a Logger is expected
signUpUser(new XmlLoggerAdapter(new XmlLoggerLib()));
// [xml-logger] <log>User signed up</log>`,
      },
      {
        label: "Java",
        language: "java",
        filename: "XmlLoggerAdapter.java",
        code: `// TARGET — the interface the app expects (round socket)
interface Logger {
    void log(String message);
}

// ADAPTEE — third-party library, can't change it (square plug)
class XmlLoggerLib {
    public void writeXml(String xmlString) {
        System.out.println("[xml-logger] " + xmlString);
    }
}

// ADAPTER — implements the Target, holds the Adaptee (composition)
class XmlLoggerAdapter implements Logger {
    private final XmlLoggerLib lib;

    public XmlLoggerAdapter(XmlLoggerLib lib) {
        this.lib = lib;
    }

    @Override
    public void log(String message) {
        // the translation: plain text -> the XML the library wants
        lib.writeXml("<log>" + message + "</log>");
    }
}

public class Demo {
    // CLIENT — written against Logger; it never changes
    static void signUpUser(Logger logger) {
        logger.log("User signed up");
    }

    public static void main(String[] args) {
        signUpUser(new XmlLoggerAdapter(new XmlLoggerLib()));
        // [xml-logger] <log>User signed up</log>
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "xml_logger_adapter.py",
        code: `from abc import ABC, abstractmethod


class Logger(ABC):
    """TARGET — the interface the app expects (round socket)."""

    @abstractmethod
    def log(self, message: str) -> None: ...


class XmlLoggerLib:
    """ADAPTEE — third-party library, can't change it (square plug)."""

    def write_xml(self, xml_string: str) -> None:
        print(f"[xml-logger] {xml_string}")


class XmlLoggerAdapter(Logger):
    """ADAPTER — implements the Target, wraps the Adaptee."""

    def __init__(self, lib: XmlLoggerLib) -> None:
        self._lib = lib                       # composition

    def log(self, message: str) -> None:
        # the translation: plain text -> the XML the library wants
        self._lib.write_xml(f"<log>{message}</log>")


def sign_up_user(logger: Logger) -> None:
    """CLIENT — written against Logger; it never changes."""
    logger.log("User signed up")


sign_up_user(XmlLoggerAdapter(XmlLoggerLib()))
# [xml-logger] <log>User signed up</log>`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "xml_logger_adapter.cpp",
        code: `#include <iostream>
#include <string>

// TARGET — the interface the app expects (round socket)
class Logger {
public:
    virtual ~Logger() = default;
    virtual void log(const std::string& message) = 0;
};

// ADAPTEE — third-party library, can't change it (square plug)
class XmlLoggerLib {
public:
    void writeXml(const std::string& xmlString) {
        std::cout << "[xml-logger] " << xmlString << "\\n";
    }
};

// ADAPTER — implements the Target, holds the Adaptee (composition)
class XmlLoggerAdapter : public Logger {
    XmlLoggerLib& lib_;                    // object adapter: wrap, don't inherit
public:
    explicit XmlLoggerAdapter(XmlLoggerLib& lib) : lib_(lib) {}

    void log(const std::string& message) override {
        // the translation: plain text -> the XML the library wants
        lib_.writeXml("<log>" + message + "</log>");
    }
};

// CLIENT — written against Logger; it never changes
void signUpUser(Logger& logger) { logger.log("User signed up"); }

int main() {
    XmlLoggerLib lib;
    XmlLoggerAdapter adapter{lib};
    signUpUser(adapter);        // [xml-logger] <log>User signed up</log>
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for an Adapter when you can't change one of the sides" },
      {
        type: "p",
        text: "Adapter earns its keep whenever useful code exists but its interface doesn't match what your code expects — and rewriting either side is off the table:",
      },
      {
        type: "ul",
        items: [
          "**Integrating third-party or legacy code** — a library, SDK, or ancient in-house module does exactly what you need, but its method names and data formats don't match yours. Wrap it once; use it everywhere.",
          "**Making old code fit a new interface** — you've designed a clean new interface and want existing classes to satisfy it without risky rewrites. One adapter per old class bridges the gap.",
          "**Adapters at system boundaries** — payment providers, logging backends, storage services. Define one Target interface for your app, then write a thin adapter per vendor. Swapping vendors becomes swapping adapters, and your core code never hears about it.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When NOT to use it",
        text: "If you **own both sides**, don't write an adapter — just change the code so the interfaces match. An adapter between two classes you control is pure overhead: an extra class, an extra hop, and a permanent reminder of a mismatch you could have simply fixed. And if you find yourself stacking adapters on adapters, stop and redesign the interface instead.",
      },
    ],

    tradeoffs: {
      pros: [
        "Reuses existing code you can't change — third-party libraries and legacy classes plug straight into your design without a rewrite.",
        "Client code stays untouched — every existing call site keeps working; you only add one small class and swap what gets passed in.",
        "Single responsibility for the mismatch — all the translation logic (formats, names, units) lives in one findable place instead of being smeared across the codebase.",
        "Makes swapping implementations easy — one adapter per vendor behind a shared Target interface turns 'migrate providers' into 'write one new adapter'.",
      ],
      cons: [
        "Adds a layer of indirection — one more class, one more hop per call, one more thing to name and navigate when reading the code.",
        "Can hide a design smell — sprinkling adapters between classes you own papers over interfaces that should just be fixed at the source.",
        "Translation can be lossy or leaky — if the two interfaces don't map cleanly (missing features, different error models), the adapter ends up faking or dropping behaviour.",
        "Adapter chains creep in — adapting an adapter of an adapter makes call flows genuinely hard to trace; a redesign is usually cheaper than a third layer.",
      ],
    },

    furtherReading: [
      {
        label: "Adapter — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/adapter",
        note: "The clearest illustrated walkthrough: the round-peg/square-peg problem, object vs class adapter structure, and examples in many languages. Best first read.",
        kind: "article",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Adapter among the structural patterns. The primary source for the pattern's intent, participants, and consequences.",
        kind: "book",
      },
      {
        label: "Adapter pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Adapter_pattern",
        note: "Concise reference with UML for both object and class adapters, plus real API examples and the distinction from Facade and Decorator.",
        kind: "docs",
      },
      {
        label: "Adapter Design Pattern — SourceMaking",
        href: "https://sourcemaking.com/design_patterns/adapter",
        note: "Short problem/solution framing with checklists and rules of thumb — good for a quick second angle on when the pattern applies.",
        kind: "article",
      },
      {
        label: "The Adapter Pattern in Java — Baeldung",
        href: "https://www.baeldung.com/java-adapter-pattern",
        note: "A compact Java implementation walkthrough with a practical example, plus notes on where the JDK itself uses adapters.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "adapter-q1",
        question: "What problem does the Adapter pattern solve?",
        options: [
          { id: "a", label: "A class creates too many instances of itself." },
          { id: "b", label: "Two pieces of code should work together, but their interfaces don't match — and you can't change either side." },
          { id: "c", label: "A subsystem is too complicated and needs a simpler front door." },
          { id: "d", label: "An object needs extra behaviour added at runtime." },
        ],
        correctOptionId: "b",
        explanation:
          "Adapter is the translator you insert when interfaces don't line up — like a round socket and a square plug. Option (c) describes Facade, (d) describes Decorator, and (a) is the territory of Singleton.",
      },
      {
        id: "adapter-q2",
        question: "In our example, the app expects `Logger.log(message)` but the library only has `XmlLoggerLib.writeXml(xmlString)`. Which role does `XmlLoggerLib` play?",
        options: [
          { id: "a", label: "The Target — the interface the client expects." },
          { id: "b", label: "The Client — the code making the calls." },
          { id: "c", label: "The Adaptee — the existing class with useful behaviour but the wrong interface." },
          { id: "d", label: "The Adapter — the translator in the middle." },
        ],
        correctOptionId: "c",
        explanation:
          "XmlLoggerLib is the Adaptee: it does the real work but speaks the wrong interface (the square plug). Logger is the Target, your app is the Client, and XmlLoggerAdapter is the Adapter that bridges them.",
      },
      {
        id: "adapter-q3",
        question: "How does a well-built object adapter connect the Target to the Adaptee?",
        options: [
          { id: "a", label: "It implements the Target interface and holds a reference to the Adaptee, translating each call as it forwards it." },
          { id: "b", label: "It inherits from both the Target and the Adaptee so it becomes both at once." },
          { id: "c", label: "It edits the Adaptee's source code so its methods match the Target." },
          { id: "d", label: "It copies the Adaptee's code into the client." },
        ],
        correctOptionId: "a",
        explanation:
          "The object adapter uses composition: implement the interface the client expects on the outside, keep the adaptee in a field on the inside, and translate in between. Option (b) describes the class adapter, which needs multiple inheritance and welds you to one concrete class — composition is the recommended default.",
      },
      {
        id: "adapter-q4",
        question: "After you introduce `XmlLoggerAdapter`, what happens to the client code that calls `logger.log(...)`?",
        options: [
          { id: "a", label: "Every call site must be rewritten to call writeXml() instead." },
          { id: "b", label: "It must add an if/else to check which logger type it received." },
          { id: "c", label: "It needs to import XmlLoggerLib directly." },
          { id: "d", label: "Nothing — it keeps calling log() exactly as before; only the object passed in changes." },
        ],
        correctOptionId: "d",
        explanation:
          "That's the payoff of the pattern: the client is written against the Target interface and never learns the library exists. You hand it an adapter instead of another Logger, and 'client code changed' stays at zero lines — exactly what the prototype's counter shows.",
      },
      {
        id: "adapter-q5",
        question: "When should you NOT write an adapter?",
        options: [
          { id: "a", label: "When integrating a third-party SDK whose method names don't match yours." },
          { id: "b", label: "When you own both sides of the mismatch — just change the code so the interfaces agree." },
          { id: "c", label: "When making a legacy class satisfy a new interface without rewriting it." },
          { id: "d", label: "When you want to swap between several vendors behind one interface." },
        ],
        correctOptionId: "b",
        explanation:
          "An adapter exists because you *can't* change one of the sides. If both classes are yours, an adapter just adds an extra layer to preserve a mismatch you could simply fix. Options (a), (c) and (d) are the classic legitimate uses: third-party code, legacy code, and vendor boundaries.",
      },
    ],
  },
};
