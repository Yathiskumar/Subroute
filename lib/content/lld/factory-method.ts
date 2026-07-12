import type { RoadmapLesson } from "@/lib/content/types";

export const factoryMethod: RoadmapLesson = {
  title: "Factory Method",
  oneLiner:
    "Instead of hard-coding `new EmailNotification()` all over your app, you ask a factory to build the right object for you: `NotificationFactory.create(channel)`. The factory decides which concrete class to make, hands back something that shares one interface, and your calling code never has to change when you add a new channel.",
  difficulty: "beginner",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/factory-method.html",
  content: {
    prototypeCaption:
      "A tiny **notification system**. Pick a channel with the three chips — **📧 Email**, **💬 SMS**, **🔔 Push** — then hit the big **`notify(user)`** button. Watch the flow play out in three beats: the client calls `factory.create(channel)`, the factory builds the *matching* concrete product, and `product.send(msg)` delivers `\"Your order shipped 📦\"` as a channel-styled card — an email envelope, an SMS chat bubble, or a push banner — so you *see* a different object was built each time. The **CLIENT CODE panel** stays highlighted and **identical** no matter which chip you pick (tag: *client code: unchanged ✓*). Then press **`＋ Add WhatsApp channel`**: a 4th chip (🟢 WhatsApp) appears, it delivers correctly, and the panel still reads **client code diff: 0 lines** — Open/Closed made visible. One fixed explain panel narrates every step; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "**Factory Method** is a pattern for *creating objects without hard-coding which class you create*. Instead of scattering `new EmailNotification()` throughout your app — which locks that code to one exact type — you ask a **factory** to build the object for you. The factory decides *which* concrete class to make and hands it back through a shared interface. Your calling code just uses that interface and never learns which type it actually got.",
      },
      {
        type: "p",
        text: "Picture an app that needs to **notify a user**. Today it sends email; tomorrow it also needs SMS and push. If every screen writes `new EmailNotification()` directly, adding SMS means hunting down and editing every one of those places. Instead, everyone calls `NotificationFactory.create(channel)`. Ask for `\"email\"` and you get an `EmailNotification`; ask for `\"sms\"` and you get an `SmsNotification`. They all share one method — `send(message)` — so the caller just calls `send()` and stays blissfully unaware of the concrete type. That single point of creation is the whole idea.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A Factory Method puts object creation *behind one door*: instead of `new ConcreteThing()` in your code, you call `factory.create(...)` and get back *something that fits a shared interface* — so the code that uses it never has to change when the concrete type changes.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Why this matters: the client stops depending on concrete classes",
        text: "The payoff is decoupling. Your business code depends on the `Notification` *interface*, not on `EmailNotification` or `SmsNotification`. Add a whole new channel and every existing caller keeps working unchanged — you touch one new product class and one factory branch, nothing else. That's the Open/Closed Principle in action: open to extension, closed to modification.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The moving parts" },
      {
        type: "p",
        text: "A factory setup has three roles. Once you see them, you'll spot the pattern everywhere:",
      },
      {
        type: "ul",
        items: [
          "**A product interface** — the shared contract every created object promises to honor. Here it's `Notification` with one method, `send(message)`. The caller only ever talks to this.",
          "**Concrete products** — the real classes that implement the interface: `EmailNotification`, `SmsNotification`, `PushNotification`. Each does `send()` its own way, but from the outside they look identical.",
          "**The factory** — the one place that decides which concrete product to build. The caller hands it a `channel` and gets back a `Notification`, never touching `new` itself.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `// The one place 'new' lives — everyone else stays clean.
class NotificationFactory {
  static create(channel: string): Notification {
    switch (channel) {
      case "email": return new EmailNotification();
      case "sms":   return new SmsNotification();
      case "push":  return new PushNotification();
      default: throw new Error("Unknown channel: " + channel);
    }
  }
}

// Client code — identical no matter which channel.
const n = NotificationFactory.create(user.channel);
n.send("Your order shipped 📦");`,
      },
      {
        type: "p",
        text: "Look at the last two lines: that's the *entire* client. It never says `new EmailNotification()`. It asks the factory for *a* notification and calls `send()`. Switch `user.channel` from `\"email\"` to `\"sms\"` and those two lines don't change at all — only the factory's internal branch and the returned product differ. That's the decoupling the pattern buys you.",
      },
      { type: "h", text: "\"Simple factory\" vs the real Gang-of-Four Factory Method" },
      {
        type: "p",
        text: "The version above — one `create(channel)` method with a `switch` — is what most people first meet, and it's often called a **simple factory**. It's a great on-ramp and it captures the key benefit (creation lives in one place). But it's not *quite* the pattern the original *Gang of Four* book named \"Factory Method.\"",
      },
      {
        type: "p",
        text: "The **true Factory Method** replaces the `switch` with *inheritance*. You have a base `Creator` class with a `factory method` — an overridable method like `createNotification()` — that returns the product. The base class contains the shared workflow and calls that method, but each **subclass decides** which concrete product to build by overriding it:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// The 'Creator' base class defines the workflow and a factory method.
abstract class Notifier {
  abstract createNotification(): Notification;  // the factory method

  notify(msg: string): void {          // shared workflow, written once
    const n = this.createNotification();
    n.send(msg);
  }
}

// Each subclass decides the concrete product — no switch anywhere.
class EmailNotifier extends Notifier {
  createNotification() { return new EmailNotification(); }
}
class SmsNotifier extends Notifier {
  createNotification() { return new SmsNotification(); }
}`,
      },
      {
        type: "p",
        text: "Both forms solve the same problem: the code that *uses* a product doesn't hard-code which concrete class it gets. The simple-factory `switch` picks the product at *runtime* from a value; the classic Factory Method picks it by *which subclass* you instantiated. Start with the simple factory in your head — it's the beginner-friendly on-ramp — and reach for the subclass version when different subclasses genuinely need different creation logic.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Factory Method vs Abstract Factory (the next lesson)",
        text: "**Factory Method** creates *one* product, chosen when you build it — one `send()`-able notification. **Abstract Factory** creates a whole *family* of related products that must fit together — e.g. a UI kit that produces a matching Button *and* Checkbox *and* Menu for one theme. Rule of thumb: one product → Factory Method; a coordinated set of products → Abstract Factory. We cover Abstract Factory next.",
      },
      { type: "h", text: "Why the client never changes when you add a channel" },
      {
        type: "p",
        text: "Say a new requirement lands: also notify by WhatsApp. With direct `new` calls scattered around, you'd edit every call site. With a factory, you do exactly two small things: (1) write a new `WhatsAppNotification` class that implements `send()`, and (2) add one branch to the factory. Every existing caller — every `NotificationFactory.create(...); n.send(...)` in the whole codebase — keeps working *untouched*. You extended the system without modifying the code that uses it. The prototype lets you feel this: add WhatsApp and watch the client-code panel report a **diff of 0 lines**.",
      },
    ],

    handsOn: [
      {
        title: "01 · Send one notification and watch the factory build it",
        body: "Open the prototype. Leave the 📧 Email chip selected and press the big `notify(user)` button. Watch the three beats: the client calls `factory.create(\"email\")`, the factory builds an `EmailNotification`, and `send()` renders an email envelope card with the message \"Your order shipped 📦\". The explain panel narrates exactly which concrete class was created and why the client didn't need to know.",
      },
      {
        title: "02 · Switch channels — notice the client code never moves",
        body: "Click the 💬 SMS chip, then 🔔 Push, pressing `notify(user)` after each. Each delivery looks visually different — a chat bubble, then a push banner — proving a different concrete object was built. But keep your eye on the highlighted CLIENT CODE panel: it stays byte-for-byte identical every time, tagged `client code: unchanged ✓`. Only the factory's internal branch and the returned product changed.",
      },
      {
        title: "03 · Add a whole new channel with zero client changes",
        body: "Press `＋ Add WhatsApp channel`. A 4th chip (🟢 WhatsApp) appears; select it and hit `notify(user)` — it delivers a WhatsApp-styled card. Now read the panel: it reports `client code diff: 0 lines`. You added a new product class and one factory branch, and every existing caller kept working untouched. That's the Open/Closed Principle you just watched happen.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "notifications.ts",
        code: `// 1) The product interface — the shared contract every channel honors.
interface Notification {
  send(message: string): void;
}

// 2) Concrete products — each implements send() its own way.
class EmailNotification implements Notification {
  send(message: string) { console.log("📧 Email:", message); }
}
class SmsNotification implements Notification {
  send(message: string) { console.log("💬 SMS:", message); }
}
class PushNotification implements Notification {
  send(message: string) { console.log("🔔 Push:", message); }
}

// 3) The factory — the ONE place that decides which product to build.
class NotificationFactory {
  static create(channel: string): Notification {
    switch (channel) {
      case "email": return new EmailNotification();
      case "sms":   return new SmsNotification();
      case "push":  return new PushNotification();
      default: throw new Error("Unknown channel: " + channel);
    }
  }
}

// 4) Client code — IDENTICAL for every channel. No 'new' in sight.
function notify(user: { channel: string }, msg: string) {
  const n = NotificationFactory.create(user.channel);
  n.send(msg);          // caller never knows the concrete type
}

notify({ channel: "email" }, "Your order shipped 📦");
notify({ channel: "sms" },   "Your order shipped 📦");  // same two lines above`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Notifications.java",
        code: `// 1) The product interface — the shared contract every channel honors.
interface Notification {
    void send(String message);
}

// 2) Concrete products — each implements send() its own way.
class EmailNotification implements Notification {
    public void send(String message) { System.out.println("📧 Email: " + message); }
}
class SmsNotification implements Notification {
    public void send(String message) { System.out.println("💬 SMS: " + message); }
}
class PushNotification implements Notification {
    public void send(String message) { System.out.println("🔔 Push: " + message); }
}

// 3) The factory — the ONE place that decides which product to build.
class NotificationFactory {
    public static Notification create(String channel) {
        switch (channel) {
            case "email": return new EmailNotification();
            case "sms":   return new SmsNotification();
            case "push":  return new PushNotification();
            default: throw new IllegalArgumentException("Unknown channel: " + channel);
        }
    }
}

// 4) Client code — IDENTICAL for every channel. No 'new' in sight.
class App {
    static void notify(String channel, String msg) {
        Notification n = NotificationFactory.create(channel);
        n.send(msg);          // caller never knows the concrete type
    }
    public static void main(String[] args) {
        notify("email", "Your order shipped 📦");
        notify("sms",   "Your order shipped 📦");  // same two lines above
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "notifications.py",
        code: `from abc import ABC, abstractmethod

# 1) The product interface — the shared contract every channel honors.
class Notification(ABC):
    @abstractmethod
    def send(self, message: str) -> None: ...

# 2) Concrete products — each implements send() its own way.
class EmailNotification(Notification):
    def send(self, message: str) -> None:
        print("📧 Email:", message)

class SmsNotification(Notification):
    def send(self, message: str) -> None:
        print("💬 SMS:", message)

class PushNotification(Notification):
    def send(self, message: str) -> None:
        print("🔔 Push:", message)

# 3) The factory — the ONE place that decides which product to build.
class NotificationFactory:
    @staticmethod
    def create(channel: str) -> Notification:
        match channel:
            case "email": return EmailNotification()
            case "sms":   return SmsNotification()
            case "push":  return PushNotification()
            case _: raise ValueError(f"Unknown channel: {channel}")

# 4) Client code — IDENTICAL for every channel. No constructor call in sight.
def notify(channel: str, msg: str) -> None:
    n = NotificationFactory.create(channel)
    n.send(msg)          # caller never knows the concrete type

notify("email", "Your order shipped 📦")
notify("sms",   "Your order shipped 📦")   # same two lines above`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "notifications.cpp",
        code: `#include <iostream>
#include <memory>
#include <string>

// 1) The product interface — the shared contract every channel honors.
struct Notification {
    virtual void send(const std::string& message) = 0;
    virtual ~Notification() = default;
};

// 2) Concrete products — each implements send() its own way.
struct EmailNotification : Notification {
    void send(const std::string& m) override { std::cout << "📧 Email: " << m << "\\n"; }
};
struct SmsNotification : Notification {
    void send(const std::string& m) override { std::cout << "💬 SMS: " << m << "\\n"; }
};
struct PushNotification : Notification {
    void send(const std::string& m) override { std::cout << "🔔 Push: " << m << "\\n"; }
};

// 3) The factory — the ONE place that decides which product to build.
struct NotificationFactory {
    static std::unique_ptr<Notification> create(const std::string& channel) {
        if (channel == "email") return std::make_unique<EmailNotification>();
        if (channel == "sms")   return std::make_unique<SmsNotification>();
        if (channel == "push")  return std::make_unique<PushNotification>();
        throw std::invalid_argument("Unknown channel: " + channel);
    }
};

// 4) Client code — IDENTICAL for every channel. No 'new' in sight.
void notify(const std::string& channel, const std::string& msg) {
    auto n = NotificationFactory::create(channel);
    n->send(msg);          // caller never knows the concrete type
}

int main() {
    notify("email", "Your order shipped 📦");
    notify("sms",   "Your order shipped 📦");  // same two lines above
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a factory when creation shouldn't be the caller's problem" },
      {
        type: "p",
        text: "A factory earns its keep whenever the *decision of which class to build* is likely to change or grow, and you don't want that decision smeared across your codebase:",
      },
      {
        type: "ul",
        items: [
          "**You have a family of interchangeable types behind one interface** — notification channels, payment providers, file exporters (PDF/CSV/XLSX), database drivers. New members get added over time and every caller should keep working.",
          "**The concrete type is chosen at runtime** — from config, a user setting, a request field, or an environment. The caller has a *value* (`\"sms\"`) and wants an *object*; the factory bridges the two.",
          "**Construction has real logic** — picking a class, wiring dependencies, reading a flag. Hiding that behind `create(...)` keeps callers simple and puts the messy part in one testable place.",
          "**You want to honor Open/Closed** — adding a type should mean *adding* code (a new product + a branch), not *editing* every place that creates one.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't reach for a factory when there's nothing to decide",
        text: "If there's only ever one concrete type and no realistic chance of a second, a plain `new Thing()` is clearer — a factory just adds a layer of indirection for no payoff. The pattern pays off when there's a *genuine choice* between types. Add it when the second type shows up, not before.",
      },
    ],

    tradeoffs: {
      pros: [
        "Decouples callers from concrete classes — client code depends only on the product interface, so it never breaks when the concrete type changes.",
        "Honors Open/Closed — adding a new type means adding a product class and one factory branch; existing callers stay untouched.",
        "Creation lives in one place — the messy 'which class, wired how' logic is centralized and easy to find, change, and test.",
        "Chooses at runtime — the concrete type can come from config, a user setting, or a request, without the caller hard-coding it.",
      ],
      cons: [
        "Adds indirection — one more layer to read through; overkill when there's only ever one concrete type and no real choice to make.",
        "The simple-factory switch is a mild Open/Closed compromise — you still edit that one central switch for each new type (the classic subclass form avoids even that).",
        "Can multiply classes — every product needs its own class, which is more files for what might be small behavioral differences.",
        "Easy to over-apply — reaching for a factory 'just in case' before a second type exists adds complexity you don't yet need.",
      ],
    },

    furtherReading: [
      {
        label: "Factory Method — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/factory-method",
        note: "The clearest illustrated walkthrough: the problem, the Creator + product structure, a real-world analogy, and side-by-side code in many languages. Best first read.",
        kind: "article",
      },
      {
        label: "Factory Method vs Abstract Factory — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/abstract-factory",
        note: "Read right after, to lock in the distinction: Factory Method makes one product; Abstract Factory makes a whole family of related products that fit together.",
        kind: "article",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that formally defined Factory Method as a Creator base class with an overridable method subclasses use to decide the product. The primary source.",
        kind: "book",
      },
      {
        label: "Factory method pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Factory_method_pattern",
        note: "Concise reference covering the formal intent, structure, the simple-factory vs Factory Method distinction, and examples across several languages.",
        kind: "docs",
      },
      {
        label: "Replace Constructor with Factory Method — Refactoring.com (Martin Fowler)",
        href: "https://refactoring.com/catalog/replaceConstructorWithFactoryMethod.html",
        note: "The refactoring lens: why and how to move from a raw constructor to a factory method, and what it buys you in flexibility and clarity.",
        kind: "article",
      },
      {
        label: "Factory Method Pattern explained (video)",
        href: "https://www.youtube.com/watch?v=EcFVTgRHJLM",
        note: "A short, visual walkthrough with live code: spotting hard-coded 'new' calls and refactoring them behind a factory so callers stop depending on concrete classes.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "factory-method-q1",
        question: "What problem does the Factory Method pattern primarily solve?",
        options: [
          { id: "a", label: "It removes hard-coded `new ConcreteClass()` calls from client code by moving object creation behind a factory that returns a shared interface." },
          { id: "b", label: "It guarantees a class has exactly one instance shared across the program." },
          { id: "c", label: "It makes objects copy themselves instead of being built from scratch." },
          { id: "d", label: "It splits an application into separate read and write models." },
        ],
        correctOptionId: "a",
        explanation:
          "Factory Method centralizes object creation: instead of callers writing `new EmailNotification()`, they ask a factory and get back something matching a shared interface. Option (b) is Singleton, (c) is Prototype, and (d) is CQRS — different patterns entirely.",
      },
      {
        id: "factory-method-q2",
        question: "Why is the client code decoupled from the concrete classes when it uses a factory?",
        options: [
          { id: "a", label: "Because the client only depends on the product interface (e.g. `Notification`) and calls `send()`, never learning or naming which concrete class it received." },
          { id: "b", label: "Because the factory makes the concrete classes run faster." },
          { id: "c", label: "Because the client stores every concrete class in a global variable." },
          { id: "d", label: "Because the concrete classes are all merged into one class at runtime." },
        ],
        correctOptionId: "a",
        explanation:
          "The client talks only to the shared interface and calls `send(message)`. It never references `EmailNotification` or `SmsNotification` by name, so changing or adding concrete types can't break it. That interface-only dependency is exactly what 'decoupled' means here.",
      },
      {
        id: "factory-method-q3",
        question: "In the notification example, what happens to the direct `new EmailNotification()` calls that used to be scattered through the app?",
        options: [
          { id: "a", label: "They disappear from client code — the only `new` for a product now lives inside the factory, so callers just call `factory.create(...)`." },
          { id: "b", label: "They stay everywhere, but each one is wrapped in a try/catch." },
          { id: "c", label: "They are replaced by direct `new SmsNotification()` calls instead." },
          { id: "d", label: "They must be duplicated once per channel in every caller." },
        ],
        correctOptionId: "a",
        explanation:
          "The whole point is to pull object creation into one place. After refactoring, client code contains no `new EmailNotification()` at all; the factory is the single spot that constructs products, and callers just request one through `create(...)`.",
      },
      {
        id: "factory-method-q4",
        question: "How does Factory Method differ from Abstract Factory?",
        options: [
          { id: "a", label: "Factory Method creates one product chosen at build time; Abstract Factory creates a whole family of related products that must fit together." },
          { id: "b", label: "They are two names for exactly the same pattern." },
          { id: "c", label: "Factory Method works only in Java; Abstract Factory works only in C++." },
          { id: "d", label: "Abstract Factory creates one product; Factory Method always creates exactly three." },
        ],
        correctOptionId: "a",
        explanation:
          "Factory Method produces a single product (one `send()`-able notification). Abstract Factory produces a coordinated set — e.g. a matching Button, Checkbox, and Menu for one theme. One product → Factory Method; a related family → Abstract Factory.",
      },
      {
        id: "factory-method-q5",
        question: "You need to add a WhatsApp channel. Using the factory, what do you have to change?",
        options: [
          { id: "a", label: "Add one new product class (`WhatsAppNotification`) and one branch in the factory — every existing caller keeps working unchanged." },
          { id: "b", label: "Edit every place in the app that sends a notification." },
          { id: "c", label: "Rewrite the `Notification` interface and all existing products." },
          { id: "d", label: "Nothing — factories can't support new types once written." },
        ],
        correctOptionId: "a",
        explanation:
          "That's the Open/Closed payoff: you extend the system by adding a new product and one factory branch, without modifying the code that uses notifications. Every `factory.create(...); n.send(...)` caller stays exactly as it was — a client-code diff of zero lines.",
      },
    ],
  },
};
