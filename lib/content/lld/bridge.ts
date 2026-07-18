import type { RoadmapLesson } from "@/lib/content/types";

export const bridge: RoadmapLesson = {
  title: "Bridge",
  oneLiner:
    "Split one big class hierarchy into two small ones — an *abstraction* side and an *implementation* side — and connect them with composition so each can grow on its own. Instead of a subclass for every remote-control × device combo (`BasicTVRemote`, `AdvancedRadioRemote`, ...), a `Remote` simply *has a* `Device`. Two remotes plus three devices is 5 classes, not 6 — and adding a projector adds 1 class, not 2.",
  difficulty: "intermediate",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/bridge.html",
  content: {
    prototypeCaption:
      "Remote controls driving devices, in two worlds. In **WITHOUT Bridge**, every remote×device combo is its own class — six cards fill the grid, and pressing *＋ Add Projector device* makes **two** more appear (one per remote type), while *＋ Add Kids remote* makes **three** more (one per device). Watch the *classes* counter climb and the grid get crowded — that explosion is the whole problem. Flip to **WITH Bridge** and the same system is two tidy columns — REMOTES and DEVICES — joined by a *has-a* arrow. The same add buttons now add exactly **one** card each. Then use the demo strip: pick any remote, pick any device, press *🔊 volume +*, and watch that device's volume bar rise — proof that any remote can drive any device across the bridge.",

    overview: [
      {
        type: "p",
        text: "**Bridge** is a structural pattern with a one-sentence intent: *split a class into two separate hierarchies — an abstraction and an implementation — and connect them with composition, so both sides can vary independently*. The word 'bridge' is the object reference that links the two sides: the abstraction *has a* implementation and delegates the real work to it.",
      },
      {
        type: "p",
        text: "Picture remote controls and devices. A remote (Basic or Advanced) is *what the user holds* — the high-level control. A device (TV, Radio, Speaker) is *what actually does the work* — the low-level machinery. Without Bridge, you'd be tempted to make a subclass for every pairing: `BasicTVRemote`, `AdvancedTVRemote`, `BasicRadioRemote`... 2 remotes × 3 devices = **6 classes**, and adding one new device forces you to write 2 more. With Bridge, a `Remote` simply holds a `Device` field. Two small hierarchies — **2 + 3 = 5 classes** — and any remote drives any device.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "When a class wants to vary in **two independent directions** at once, don't multiply subclasses — split it into an **abstraction** hierarchy and an **implementation** hierarchy, and let the abstraction *hold* an implementation. Growth becomes `m + n` classes instead of `m × n`.",
      },
      {
        type: "callout",
        variant: "info",
        title: "'Abstraction' here does not mean 'abstract class'",
        text: "In Bridge, *abstraction* just means the **high-level control side** (the remote — what callers talk to), and *implementation* means the **low-level work side** (the device — what actually does it). Either side may or may not use `abstract` classes in code. Don't confuse this with [[abstraction]] the OOP pillar — same word, narrower meaning here.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The four participants" },
      {
        type: "p",
        text: "Bridge has four roles, two per side. The bridge itself is just one field: the abstraction holds a reference to an implementor.",
      },
      {
        type: "ul",
        items: [
          "**Abstraction** (`Remote`) — the high-level control that callers use. It holds a `device` field and delegates real work to it: `volumeUp()` calls `device.setVolume(...)`.",
          "**Refined Abstraction** (`AdvancedRemote`) — an optional richer subclass of the abstraction. It adds higher-level features like `mute()` — still built out of implementor calls.",
          "**Implementor interface** (`Device`) — the contract the abstraction talks through: `isEnabled()`, `setVolume(v)`, `getVolume()`. This interface *is* the bridge.",
          "**Concrete Implementors** (`Tv`, `Radio`, `Speaker`) — the real platform-specific work. Each implements `Device` in its own way.",
        ],
      },
      { type: "h", text: "The m × n math" },
      {
        type: "p",
        text: "This is why the pattern exists. With one merged hierarchy, every combination is a class: *m* remote kinds × *n* device kinds = **m × n classes**. 2×3 = 6. Add a Projector: 8. Add a Kids remote too: 12. Every new idea on *either* side multiplies. With Bridge you keep two separate hierarchies: **m + n classes**. 2+3 = 5. Add a Projector: 6. Add a Kids remote: 7. Every new idea on either side adds exactly **one** class — and it instantly works with everything on the other side.",
      },
      {
        type: "code",
        language: "typescript",
        code: `interface Device {                    // the Implementor — this IS the bridge
  setVolume(v: number): void;
  getVolume(): number;
}

class Remote {                        // the Abstraction
  constructor(protected device: Device) {}   // 🌉 has-a Device (composition)

  volumeUp(): void {
    this.device.setVolume(this.device.getVolume() + 10);  // delegate
  }
}

class AdvancedRemote extends Remote { // Refined Abstraction
  mute(): void { this.device.setVolume(0); }
}

// Any remote drives any device — pick the pair at runtime:
const remote = new AdvancedRemote(new Tv());   // or new Radio(), new Speaker()
remote.volumeUp();`,
      },
      {
        type: "p",
        text: "Notice what `Remote` *doesn't* know: whether it's driving a TV or a radio. It only knows the `Device` interface. That's the bridge doing its job — the remote side and the device side only meet at one thin interface, so each can grow, change, or be swapped without touching the other.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "It's composition over inheritance — applied to two dimensions",
        text: "Bridge is exactly the [[composition-vs-inheritance]] lesson put to work. Inheritance would weld 'what kind of remote' and 'what kind of device' into one class name. Composition keeps them as two separate objects joined by a field — so the two dimensions vary independently.",
      },
      { type: "h", text: "Bridge vs Adapter — designed vs retrofitted" },
      {
        type: "p",
        text: "Bridge and [[adapter]] look similar on a diagram — both wrap a call through an interface. The difference is *when* and *why*. **Adapter** is a retrofit: two existing, incompatible interfaces already exist, and you glue them together after the fact. **Bridge** is planned up front: you design the abstraction and implementation as two hierarchies *from the start*, on purpose, so both can evolve independently. Adapter fixes a past mismatch; Bridge prevents a future explosion.",
      },
    ],

    handsOn: [
      {
        title: "01 · Watch the explosion in the WITHOUT world",
        body: "Open the prototype with the toggle on WITHOUT Bridge. The grid shows six class cards — one per remote×device combo — and the chip reads classes: 6. Press '＋ Add Projector device': two new red-flashing cards appear (BasicProjectorRemote, AdvancedProjectorRemote) and the counter jumps to 8. Press '＋ Add Kids remote': three more cards, counter 11. One new idea on either side multiplies the grid — feel how crowded it gets.",
      },
      {
        title: "02 · Flip to WITH Bridge and add again",
        body: "Switch the toggle to WITH Bridge. The same system is now two columns — REMOTES (Basic, Advanced) and DEVICES (TV, Radio, Speaker) — joined by a has-a arrow, and the chip reads classes: 5. Press the same two add buttons. Projector adds one card to the DEVICES column (5→6); Kids adds one card to REMOTES (6→7). Each new idea costs exactly one class, and it works with the whole other column immediately.",
      },
      {
        title: "03 · Drive any device with any remote",
        body: "Still in the WITH world, use the demo strip at the bottom: pick a remote chip (Basic or Advanced, or Kids if you added it), pick a device chip (TV, Radio, Speaker...), then press '🔊 volume +'. The picked device's volume bar rises. Now keep the same remote and pick a different device — it works there too. No BasicTVRemote class exists anywhere; the remote just calls device.setVolume() across the bridge.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "bridge.ts",
        code: `// Implementor — the low-level side. This interface IS the bridge.
interface Device {
  setVolume(v: number): void;
  getVolume(): number;
  name(): string;
}

// Concrete Implementors — each device works its own way.
class Tv implements Device {
  private vol = 30;
  setVolume(v: number) { this.vol = Math.max(0, Math.min(100, v)); }
  getVolume() { return this.vol; }
  name() { return "TV"; }
}

class Radio implements Device {
  private vol = 50;
  setVolume(v: number) { this.vol = Math.max(0, Math.min(100, v)); }
  getVolume() { return this.vol; }
  name() { return "Radio"; }
}

// Abstraction — the high-level side. Holds a Device, delegates to it.
class Remote {
  constructor(protected device: Device) {}          // 🌉 has-a (composition)
  volumeUp() { this.device.setVolume(this.device.getVolume() + 10); }
  volumeDown() { this.device.setVolume(this.device.getVolume() - 10); }
}

// Refined Abstraction — richer remote, same bridge underneath.
class AdvancedRemote extends Remote {
  mute() { this.device.setVolume(0); }
}

// Any remote drives any device — no combo classes anywhere.
const r1 = new Remote(new Tv());
const r2 = new AdvancedRemote(new Radio());
r1.volumeUp();          // TV: 30 → 40
r2.mute();              // Radio: 50 → 0
console.log(r2 instanceof Remote);   // true — one remote hierarchy`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Bridge.java",
        code: `// Implementor — the low-level side. This interface IS the bridge.
interface Device {
    void setVolume(int v);
    int getVolume();
    String name();
}

// Concrete Implementors
class Tv implements Device {
    private int vol = 30;
    public void setVolume(int v) { vol = Math.max(0, Math.min(100, v)); }
    public int getVolume() { return vol; }
    public String name() { return "TV"; }
}

class Radio implements Device {
    private int vol = 50;
    public void setVolume(int v) { vol = Math.max(0, Math.min(100, v)); }
    public int getVolume() { return vol; }
    public String name() { return "Radio"; }
}

// Abstraction — holds a Device and delegates (composition, not subclassing).
class Remote {
    protected final Device device;                 // 🌉 the bridge field
    Remote(Device device) { this.device = device; }
    void volumeUp()   { device.setVolume(device.getVolume() + 10); }
    void volumeDown() { device.setVolume(device.getVolume() - 10); }
}

// Refined Abstraction
class AdvancedRemote extends Remote {
    AdvancedRemote(Device device) { super(device); }
    void mute() { device.setVolume(0); }
}

// Remote r1 = new Remote(new Tv());            // any pairing, picked at runtime
// AdvancedRemote r2 = new AdvancedRemote(new Radio());
// r1.volumeUp();   // TV: 30 → 40
// r2.mute();       // Radio: 50 → 0`,
      },
      {
        label: "Python",
        language: "python",
        filename: "bridge.py",
        code: `from abc import ABC, abstractmethod

# Implementor — the low-level side. This interface IS the bridge.
class Device(ABC):
    @abstractmethod
    def set_volume(self, v: int) -> None: ...
    @abstractmethod
    def get_volume(self) -> int: ...

# Concrete Implementors
class Tv(Device):
    def __init__(self): self._vol = 30
    def set_volume(self, v): self._vol = max(0, min(100, v))
    def get_volume(self): return self._vol

class Radio(Device):
    def __init__(self): self._vol = 50
    def set_volume(self, v): self._vol = max(0, min(100, v))
    def get_volume(self): return self._vol

# Abstraction — holds a Device and delegates to it (composition).
class Remote:
    def __init__(self, device: Device):
        self.device = device                     # 🌉 the bridge field

    def volume_up(self):
        self.device.set_volume(self.device.get_volume() + 10)

    def volume_down(self):
        self.device.set_volume(self.device.get_volume() - 10)

# Refined Abstraction — richer remote, same bridge underneath.
class AdvancedRemote(Remote):
    def mute(self):
        self.device.set_volume(0)

r1 = Remote(Tv())                 # any remote drives any device
r2 = AdvancedRemote(Radio())
r1.volume_up()                    # TV: 30 -> 40
r2.mute()                         # Radio: 50 -> 0
print(r1.device.get_volume())     # 40`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "bridge.cpp",
        code: `#include <algorithm>
#include <memory>

// Implementor — the low-level side. This interface IS the bridge.
class Device {
public:
    virtual ~Device() = default;
    virtual void setVolume(int v) = 0;
    virtual int  getVolume() const = 0;
};

// Concrete Implementors
class Tv : public Device {
    int vol = 30;
public:
    void setVolume(int v) override { vol = std::clamp(v, 0, 100); }
    int  getVolume() const override { return vol; }
};

class Radio : public Device {
    int vol = 50;
public:
    void setVolume(int v) override { vol = std::clamp(v, 0, 100); }
    int  getVolume() const override { return vol; }
};

// Abstraction — holds a Device and delegates (composition, not subclassing).
class Remote {
protected:
    std::unique_ptr<Device> device;               // 🌉 the bridge field
public:
    explicit Remote(std::unique_ptr<Device> d) : device(std::move(d)) {}
    virtual ~Remote() = default;
    void volumeUp()   { device->setVolume(device->getVolume() + 10); }
    void volumeDown() { device->setVolume(device->getVolume() - 10); }
};

// Refined Abstraction
class AdvancedRemote : public Remote {
public:
    using Remote::Remote;
    void mute() { device->setVolume(0); }
};

// Remote r1{std::make_unique<Tv>()};             // any pairing at runtime
// AdvancedRemote r2{std::make_unique<Radio>()};
// r1.volumeUp();   // TV: 30 → 40
// r2.mute();       // Radio: 50 → 0`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Bridge when two dimensions want to vary" },
      {
        type: "ul",
        items: [
          "**A class is growing in two independent directions** — kind of control × kind of backend, shape × renderer, notification × delivery channel. Two hierarchies joined by a field beat one hierarchy of combos.",
          "**Subclass names start containing an '×'** — `BasicTVRemote`, `SqlWindowsLogger`, `CircleOpenGLRenderer`. Compound names are the smell: each word is a dimension that should be its own hierarchy.",
          "**You want to swap the implementation at runtime** — hand the same remote a different device mid-program. Inheritance fixes the pairing at compile time; a composed field can be reassigned.",
          "**Platform or backend variations** — one API surface over Windows/macOS/Linux implementations, or one storage interface over Postgres/SQLite/in-memory. Callers see the abstraction; the implementor hides the platform.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When NOT to use it",
        text: "If only **one** dimension varies, you don't need Bridge — a plain interface with a few implementations is enough (that's just [[program-to-interfaces]]). Bridge earns its extra indirection only when *both* sides genuinely grow. Splitting a stable, single-dimension class into two hierarchies is complexity with no payoff.",
      },
    ],

    tradeoffs: {
      pros: [
        "Kills the subclass explosion — m + n classes instead of m × n, and every new class on one side works with the entire other side for free.",
        "Both sides evolve independently — you can add a Projector without touching any remote, or a Kids remote without touching any device (Open/Closed in both dimensions).",
        "Implementations are swappable at runtime — the abstraction holds a reference, so you can hand the same remote a different device mid-program.",
        "Hides platform detail from callers — client code talks to the abstraction only, so platform-specific implementors can change or multiply behind the interface.",
      ],
      cons: [
        "More moving parts up front — two hierarchies plus an interface is more code than one class, which feels heavy while the design is still small.",
        "The implementor interface is a commitment — it must be designed before the split pays off, and changing it later ripples through every implementor.",
        "Indirection costs readability — following volumeUp() means hopping from Remote to Device to Tv; on a highly cohesive class the split can hurt more than help.",
        "Easy to confuse with look-alike patterns — Adapter, Strategy, and State all 'delegate through an interface'; misnaming the intent misleads readers about why the split exists.",
      ],
    },

    furtherReading: [
      {
        label: "Bridge — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/bridge",
        note: "The clearest illustrated walkthrough, built on the same remote-control × device example: the class-explosion problem, the two hierarchies, and code in several languages. Best first read.",
        kind: "article",
      },
      {
        label: "Bridge pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Bridge_pattern",
        note: "Concise reference with the formal GoF intent, UML structure, and short examples across languages — good for a quick structural recap.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Bridge. Its motivating example — windowing systems across platforms — is the classic two-dimension problem.",
        kind: "book",
      },
      {
        label: "Bridge Design Pattern — SourceMaking",
        href: "https://sourcemaking.com/design_patterns/bridge",
        note: "Short treatment focused on intent and the 'decouple abstraction from implementation' checklist, with rules of thumb for spotting when the split is worth it.",
        kind: "article",
      },
      {
        label: "Bridge Pattern in Java — Baeldung",
        href: "https://www.baeldung.com/java-bridge-pattern",
        note: "A compact Java implementation walkthrough — handy for seeing the pattern in idiomatic Java and comparing it against Adapter and Strategy.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "bridge-q1",
        question: "What is the intent of the Bridge pattern?",
        options: [
          { id: "a", label: "Split a class into an abstraction hierarchy and an implementation hierarchy, connected by composition, so both can vary independently." },
          { id: "b", label: "Make two existing incompatible interfaces work together by wrapping one in a translator." },
          { id: "c", label: "Guarantee a class has exactly one instance with a global access point." },
          { id: "d", label: "Build a complex object step by step through a fluent interface." },
        ],
        correctOptionId: "a",
        explanation:
          "Bridge deliberately separates the high-level control side (the abstraction, e.g. Remote) from the low-level work side (the implementation, e.g. Device) and links them with a has-a reference. Option (b) is Adapter, (c) is Singleton, (d) is Builder.",
      },
      {
        id: "bridge-q2",
        question: "You have 4 remote types and 5 device types. How many classes do you need without Bridge (one subclass per combo) versus with Bridge?",
        options: [
          { id: "a", label: "20 without, 9 with — Bridge turns m × n into m + n." },
          { id: "b", label: "9 without, 20 with — Bridge always needs more classes." },
          { id: "c", label: "20 in both cases — Bridge only changes the class names." },
          { id: "d", label: "5 in both cases — remotes never need their own classes." },
        ],
        correctOptionId: "a",
        explanation:
          "One subclass per combination is 4 × 5 = 20 classes, and each new device would add 4 more. With Bridge you keep the hierarchies separate: 4 remote classes + 5 device classes = 9, and any new class on either side adds exactly one.",
      },
      {
        id: "bridge-q3",
        question: "In the Bridge pattern, what exactly is 'the bridge'?",
        options: [
          { id: "a", label: "The composition link — the abstraction holds a reference to an implementor interface and delegates work through it." },
          { id: "b", label: "An abstract base class that both remotes and devices inherit from." },
          { id: "c", label: "A static utility class that converts remote commands into device commands." },
          { id: "d", label: "A shared global object that all remotes and devices register with." },
        ],
        correctOptionId: "a",
        explanation:
          "The bridge is the has-a field: Remote holds a Device and calls device.setVolume() instead of doing the work itself. There is no common ancestor across the two sides (b), no converter class (c), and no global registry (d) — just one thin interface and one reference crossing it.",
      },
      {
        id: "bridge-q4",
        question: "How is Bridge different from Adapter, given that both delegate through an interface?",
        options: [
          { id: "a", label: "Bridge is designed up front so two hierarchies can evolve independently; Adapter is a retrofit that glues already-existing, incompatible interfaces together." },
          { id: "b", label: "Bridge only works with hardware like remotes and TVs; Adapter is for software." },
          { id: "c", label: "Adapter is planned before coding starts; Bridge is only added after the code ships." },
          { id: "d", label: "There is no difference — the two names describe the same structure." },
        ],
        correctOptionId: "a",
        explanation:
          "The structures look alike but the intent and timing differ. Bridge is a deliberate up-front design decision: build the abstraction and implementation as separate hierarchies from day one. Adapter comes later, when two interfaces that were never designed to meet must work together. Option (c) has it exactly backwards.",
      },
      {
        id: "bridge-q5",
        question: "When is Bridge the WRONG choice?",
        options: [
          { id: "a", label: "When only one dimension varies — a plain interface with a few implementations does the job without the extra hierarchy." },
          { id: "b", label: "When you want to swap the implementation at runtime." },
          { id: "c", label: "When subclass names like BasicTVRemote keep multiplying." },
          { id: "d", label: "When you need one API over several platform-specific backends." },
        ],
        correctOptionId: "a",
        explanation:
          "Bridge pays for its indirection only when both sides genuinely grow. If just one dimension varies, programming to a single interface is simpler and sufficient. Options (b), (c), and (d) are the classic signals that Bridge IS the right choice.",
      },
    ],
  },
};
