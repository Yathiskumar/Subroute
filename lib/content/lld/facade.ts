import type { RoadmapLesson } from "@/lib/content/types";

export const facade: RoadmapLesson = {
  title: "Facade",
  oneLiner:
    "Put one simple front door on a complex subsystem. Instead of every caller driving six parts in the right order (amplifier on, DVD on, screen down, lights dim, projector on, play), a `HomeTheaterFacade` exposes one method — `watchMovie()` — that runs the whole sequence. The parts still exist and stay reachable; most callers just never need to touch them.",
  difficulty: "beginner",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/facade.html",
  content: {
    prototypeCaption:
      "A **home theater** with six parts: amplifier, DVD player, screen, lights, projector, playback. In **WITHOUT Facade**, *you* are the client — you must click all six cards yourself, *in the right order*. Click one too early and it shakes red: the projector has no signal because the DVD player isn't on yet. Get all six right and the 🎬 banner lights up — and the counter reads **calls you made: 6**. Flip to **WITH Facade** and the cards go quiet: one button, `watchMovie()`, fires the same six steps in sequence while you watch. Same movie, same parts, but the counter reads **1**. That gap — six careful calls versus one — is the whole pattern.",

    overview: [
      {
        type: "p",
        text: "**Facade** gives you **one simple front door to a complex subsystem**. That is the entire intent, in one sentence. Behind the door there may be six classes, ten setup steps, and a strict order to follow — but the caller sees one object with a couple of friendly methods and calls exactly one of them.",
      },
      {
        type: "p",
        text: "Picture a **home theater**. To watch a movie the hard way, you drive six machines yourself: turn the *amplifier* on, turn the *DVD player* on, lower the *screen*, dim the *lights*, turn the *projector* on, and finally press *play*. Do it out of order and something breaks — a projector with no signal, a screen glowing in a bright room. A `HomeTheaterFacade` wraps all of that behind one method: `watchMovie()`. It runs the six steps, in the right order, every time. When you're done, `endMovie()` shuts everything down in reverse. You *could* still walk up to the amplifier and fiddle with it — the facade doesn't lock the parts away. It just means you almost never have to.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A Facade is a **single simple class** that sits in front of a **complicated subsystem** and offers the common tasks as easy methods. It *simplifies*; it does not *hide by force* — the subsystem stays reachable for callers who need the full controls.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You already use facades every day",
        text: "Every time you call one tidy method and a lot happens underneath — `fetch(url)`, `client.sendEmail(...)`, `orderService.checkout(cart)` — you are on the friendly side of a facade. The pattern is less something you learn and more something you finally *notice*.",
      },
    ],

    howItWorks: [
      { type: "h", text: "One object that knows the subsystem so you don't have to" },
      {
        type: "p",
        text: "A facade is structurally the simplest of all patterns. It is just a class that **holds references to the subsystem objects** and **orchestrates them** inside a few high-level methods. There is no clever inheritance, no special interface — only delegation in the right order:",
      },
      {
        type: "ul",
        items: [
          "**It holds the parts** — the facade keeps a reference to each subsystem object (amp, dvd, screen, lights, projector).",
          "**It knows the choreography** — the correct order of calls, the right settings, the cleanup. That knowledge lives in *one* place instead of being copy-pasted into every caller.",
          "**It exposes the common cases** — one method per everyday task: `watchMovie()`, `endMovie()`. Rare or advanced needs can still go straight to the parts.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `class HomeTheaterFacade {
  constructor(
    private amp: Amplifier,
    private dvd: DvdPlayer,
    private screen: Screen,
    private lights: Lights,
    private projector: Projector,
  ) {}

  watchMovie(film: string): void {   // one call — six steps, right order
    this.amp.on();
    this.dvd.on();
    this.screen.down();
    this.lights.dim(10);
    this.projector.on();
    this.dvd.play(film);
  }

  endMovie(): void {                 // and one call to undo it all
    this.dvd.stop();
    this.projector.off();
    this.lights.on();
    this.screen.up();
    this.dvd.off();
    this.amp.off();
  }
}`,
      },
      {
        type: "p",
        text: "Notice what the facade does *not* do. It does not forbid direct access — if a power user wants to turn the amplifier up mid-movie, `amp.setVolume(11)` still works. It does not add new behaviour of its own — every line inside `watchMovie()` is a plain call to a subsystem the caller could have made. Its only job is to **reduce what callers must know**: from six classes and a fragile order down to one class and one method. That is [[coupling-and-cohesion]] in action — clients are coupled to one small facade instead of six churning subsystems — and it is the friendliest way to honour the [[law-of-demeter]]: callers talk to one near neighbour instead of reaching through a chain of strangers.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Real facades you've already met",
        text: "An `OrderService.checkout(cart)` that runs payment, inventory, and email behind one call. An SDK client class like `stripe.charges.create(...)` fronting a whole HTTP API. `fetch()` fronting sockets, TLS, redirects, and HTTP parsing. In every case: many moving parts behind one calm method.",
      },
      { type: "h", text: "Facade vs Adapter — easy to mix up, easy to separate" },
      {
        type: "p",
        text: "Both patterns are 'a class in front of another class', so beginners blur them. The test is *why* the wrapper exists. An [[adapter]] **changes an interface** so it matches what some caller already expects — usually wrapping *one* object, converting calls one-for-one. A facade **simplifies many interfaces into one** — wrapping a *whole subsystem* and collapsing a multi-step workflow into a single friendly method. Adapter is about *fit*; Facade is about *simplicity*.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The subsystem doesn't disappear",
        text: "A common misreading is 'Facade hides the subsystem so nobody can use it'. Wrong on both counts: the parts still exist, and direct access is still allowed. The facade is a *default* path for the common case, not a wall. If you find yourself forwarding every single subsystem method through the facade 'for consistency', you're building a god object, not a facade.",
      },
    ],

    handsOn: [
      {
        title: "01 · Be the client in the WITHOUT world",
        body: "Open the prototype with the toggle on ✕ WITHOUT Facade. You must start the movie yourself: click the six cards in order — 🔊 Amplifier, 💿 DVD Player, 🎞 Screen, 💡 Lights, 📽 Projector, ▶ Playback. Try clicking 📽 Projector first: the card shakes red and the panel tells you why it can't start. Order matters, and *you* have to know it.",
      },
      {
        title: "02 · Finish the sequence and read the counter",
        body: "Click all six cards in the correct order until the 🎬 movie playing banner appears. Now look at the chip at the top: 'calls you made: 6'. Six clicks, six chances to get the order wrong — that's the cost every caller pays when there's no facade.",
      },
      {
        title: "03 · Flip to WITH Facade",
        body: "Switch the toggle to ✓ WITH Facade. The six cards dim — you can't click them anymore, but they're all still there. Press the ▶ watchMovie() button and watch the same six lights turn green one by one, in the same order, ending on the same 🎬 banner. The counter reads 'calls you made: 1'. Press ⏹ endMovie() to shut everything down in reverse — still one call. Same subsystem, same steps; the only thing that changed is *who* knows the choreography.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "home-theater.ts",
        code: `// --- The subsystem: each part is simple, but there are many ---
class Amplifier { on() { console.log("Amp on"); }  off() { console.log("Amp off"); } }
class DvdPlayer {
  on()  { console.log("DVD on"); }
  off() { console.log("DVD off"); }
  play(film: string) { console.log("Playing " + film); }
  stop() { console.log("DVD stopped"); }
}
class Screen    { down() { console.log("Screen down"); } up() { console.log("Screen up"); } }
class Lights    { dim(p: number) { console.log("Lights " + p + "%"); } on() { console.log("Lights on"); } }
class Projector { on() { console.log("Projector on"); } off() { console.log("Projector off"); } }

// --- The facade: one front door, choreography in ONE place ---
class HomeTheaterFacade {
  constructor(
    private amp: Amplifier, private dvd: DvdPlayer,
    private screen: Screen, private lights: Lights,
    private projector: Projector,
  ) {}

  watchMovie(film: string): void {
    this.amp.on();          // 1. sound first
    this.dvd.on();          // 2. source next
    this.screen.down();     // 3. surface ready
    this.lights.dim(10);    // 4. set the mood
    this.projector.on();    // 5. picture (now it HAS a signal)
    this.dvd.play(film);    // 6. action!
  }

  endMovie(): void {        // same steps, reversed
    this.dvd.stop(); this.projector.off(); this.lights.on();
    this.screen.up(); this.dvd.off(); this.amp.off();
  }
}

const theater = new HomeTheaterFacade(
  new Amplifier(), new DvdPlayer(), new Screen(), new Lights(), new Projector(),
);
theater.watchMovie("Inception");   // one call — six steps happen correctly`,
      },
      {
        label: "Java",
        language: "java",
        filename: "HomeTheaterFacade.java",
        code: `// --- The subsystem classes (each one simple on its own) ---
class Amplifier { void on() { System.out.println("Amp on"); }  void off() { System.out.println("Amp off"); } }
class DvdPlayer {
    void on()  { System.out.println("DVD on"); }
    void off() { System.out.println("DVD off"); }
    void play(String film) { System.out.println("Playing " + film); }
    void stop() { System.out.println("DVD stopped"); }
}
class Screen    { void down() { System.out.println("Screen down"); } void up() { System.out.println("Screen up"); } }
class Lights    { void dim(int p) { System.out.println("Lights " + p + "%"); } void on() { System.out.println("Lights on"); } }
class Projector { void on() { System.out.println("Projector on"); } void off() { System.out.println("Projector off"); } }

// --- The facade: holds the parts, knows the order ---
public class HomeTheaterFacade {
    private final Amplifier amp;   private final DvdPlayer dvd;
    private final Screen screen;   private final Lights lights;
    private final Projector projector;

    public HomeTheaterFacade(Amplifier a, DvdPlayer d, Screen s, Lights l, Projector p) {
        amp = a; dvd = d; screen = s; lights = l; projector = p;
    }

    public void watchMovie(String film) {
        amp.on(); dvd.on();            // sound, then source
        screen.down(); lights.dim(10); // room ready
        projector.on(); dvd.play(film);// picture, then action
    }

    public void endMovie() {           // reverse the sequence
        dvd.stop(); projector.off(); lights.on();
        screen.up(); dvd.off(); amp.off();
    }
}

// HomeTheaterFacade t = new HomeTheaterFacade(new Amplifier(), new DvdPlayer(),
//         new Screen(), new Lights(), new Projector());
// t.watchMovie("Inception");   // one call instead of six`,
      },
      {
        label: "Python",
        language: "python",
        filename: "home_theater.py",
        code: `# --- The subsystem: many small parts ---
class Amplifier:
    def on(self):  print("Amp on")
    def off(self): print("Amp off")

class DvdPlayer:
    def on(self):   print("DVD on")
    def off(self):  print("DVD off")
    def play(self, film): print(f"Playing {film}")
    def stop(self): print("DVD stopped")

class Screen:
    def down(self): print("Screen down")
    def up(self):   print("Screen up")

class Lights:
    def dim(self, pct): print(f"Lights {pct}%")
    def on(self):       print("Lights on")

class Projector:
    def on(self):  print("Projector on")
    def off(self): print("Projector off")

# --- The facade: one front door over all of them ---
class HomeTheaterFacade:
    def __init__(self, amp, dvd, screen, lights, projector):
        self.amp, self.dvd = amp, dvd
        self.screen, self.lights, self.projector = screen, lights, projector

    def watch_movie(self, film):
        self.amp.on(); self.dvd.on()          # sound, then source
        self.screen.down(); self.lights.dim(10)
        self.projector.on(); self.dvd.play(film)  # picture, then action

    def end_movie(self):                       # reverse everything
        self.dvd.stop(); self.projector.off(); self.lights.on()
        self.screen.up(); self.dvd.off(); self.amp.off()


theater = HomeTheaterFacade(Amplifier(), DvdPlayer(), Screen(), Lights(), Projector())
theater.watch_movie("Inception")   # one call — six steps, right order`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "home_theater.cpp",
        code: `#include <iostream>
#include <string>

// --- The subsystem: each part simple, together fiddly ---
struct Amplifier { void on() { std::cout << "Amp on\\n"; }  void off() { std::cout << "Amp off\\n"; } };
struct DvdPlayer {
    void on()  { std::cout << "DVD on\\n"; }
    void off() { std::cout << "DVD off\\n"; }
    void play(const std::string& f) { std::cout << "Playing " << f << "\\n"; }
    void stop() { std::cout << "DVD stopped\\n"; }
};
struct Screen    { void down() { std::cout << "Screen down\\n"; } void up() { std::cout << "Screen up\\n"; } };
struct Lights    { void dim(int p) { std::cout << "Lights " << p << "%\\n"; } void on() { std::cout << "Lights on\\n"; } };
struct Projector { void on() { std::cout << "Projector on\\n"; } void off() { std::cout << "Projector off\\n"; } };

// --- The facade: holds references, owns the choreography ---
class HomeTheaterFacade {
    Amplifier& amp; DvdPlayer& dvd; Screen& screen;
    Lights& lights; Projector& projector;
public:
    HomeTheaterFacade(Amplifier& a, DvdPlayer& d, Screen& s, Lights& l, Projector& p)
        : amp(a), dvd(d), screen(s), lights(l), projector(p) {}

    void watchMovie(const std::string& film) {
        amp.on(); dvd.on();             // sound, then source
        screen.down(); lights.dim(10);  // room ready
        projector.on(); dvd.play(film); // picture, then action
    }

    void endMovie() {                   // reverse the sequence
        dvd.stop(); projector.off(); lights.on();
        screen.up(); dvd.off(); amp.off();
    }
};

int main() {
    Amplifier a; DvdPlayer d; Screen s; Lights l; Projector p;
    HomeTheaterFacade theater(a, d, s, l, p);
    theater.watchMovie("Inception");   // one call instead of six
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a facade when the subsystem is bigger than the task" },
      {
        type: "ul",
        items: [
          "**A complex subsystem with a simple common case** — most callers want `watchMovie()`, not six device APIs. Give the 90% case a one-method door and let the 10% go direct.",
          "**Layering** — give each layer of your system one entry point. Controllers call `OrderService`, not the payment gateway, the inventory table, and the mailer directly. The facade *is* the layer boundary.",
          "**Decoupling clients from subsystem churn** — when the parts behind the facade get replaced (new payment provider, new DVD-turned-streaming source), only the facade changes. Every client keeps calling the same simple method.",
        ],
      },
      { type: "h", text: "When NOT to use it" },
      {
        type: "ul",
        items: [
          "**Don't force every call through it** — a facade is a convenience, not a checkpoint. If advanced callers need the amplifier's fine controls, let them have the amplifier.",
          "**Beware the god-object facade** — a facade that mirrors *every* method of *every* subsystem class has simplified nothing; it's just a second copy of the API that must be kept in sync. Expose the few high-level tasks, not the whole surface.",
          "**Skip it when the subsystem is already simple** — wrapping one small class in a facade adds a layer with no payoff. One door in front of one door is just a hallway.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Callers get radically simpler — one class, one or two methods, instead of six classes and a fragile call order.",
        "The choreography lives in one place — the correct sequence is written once in the facade, not copy-pasted (and mis-ordered) across every caller.",
        "Loose coupling to the subsystem — clients depend on the small stable facade, so internals can be swapped or refactored without touching client code.",
        "Gentle and non-invasive — the subsystem needs zero changes, and direct access stays open for the rare caller who needs full control.",
      ],
      cons: [
        "Risk of a god object — an over-grown facade that knows about everything becomes its own maintenance problem and a magnet for unrelated logic.",
        "Can hide too much — callers who only ever see `watchMovie()` may never learn what the subsystem can really do, or why it failed three layers down.",
        "One more layer of indirection — trivial subsystems gain nothing but an extra hop and an extra file.",
        "A leaky facade is worse than none — if callers routinely need to reach around it for everyday tasks, the 'simple front door' was drawn in the wrong place.",
      ],
    },

    furtherReading: [
      {
        label: "Facade — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/facade",
        note: "The clearest illustrated walkthrough: problem, structure, real-world analogy, and code in many languages. Best first read.",
        kind: "article",
      },
      {
        label: "Facade pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Facade_pattern",
        note: "Concise reference with the UML structure, usage notes, and examples across languages.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Facade among the seven structural patterns. The primary source for its formal intent.",
        kind: "book",
      },
      {
        label: "Facade — SourceMaking",
        href: "https://sourcemaking.com/design_patterns/facade",
        note: "Intent, problem, checklist, and rules of thumb — including how Facade relates to Adapter and Mediator.",
        kind: "article",
      },
      {
        label: "Law of Demeter — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Law_of_Demeter",
        note: "The 'talk only to your neighbours' principle that facades serve so well: clients call one nearby object instead of reaching through a chain of subsystem parts.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "facade-q1",
        question: "What is the intent of the Facade pattern, in one sentence?",
        options: [
          { id: "a", label: "Provide one simple front door — a unified, easy interface — to a complex subsystem." },
          { id: "b", label: "Guarantee that a subsystem has exactly one instance." },
          { id: "c", label: "Convert one class's interface into another interface that a caller expects." },
          { id: "d", label: "Lock a subsystem away so no code can ever call it directly." },
        ],
        correctOptionId: "a",
        explanation:
          "A facade offers a single simple interface over a complicated set of classes — `watchMovie()` instead of six device calls. Option (b) is Singleton, (c) is Adapter, and (d) is a common misreading: a facade simplifies access but does not forbid it.",
      },
      {
        id: "facade-q2",
        question: "In the home theater example, what does HomeTheaterFacade.watchMovie() actually do?",
        options: [
          { id: "a", label: "It calls the six subsystem objects it holds references to, in the correct order — plain delegation, no new behaviour." },
          { id: "b", label: "It replaces the amplifier, DVD player, and projector with a single merged device." },
          { id: "c", label: "It creates brand-new subsystem objects on every call." },
          { id: "d", label: "It sends one message that each device somehow interprets on its own." },
        ],
        correctOptionId: "a",
        explanation:
          "A facade holds references to the existing subsystem objects and orchestrates them: amp on, DVD on, screen down, lights dim, projector on, play. Every line is a call the client could have made — the facade's value is knowing the choreography, not adding behaviour.",
      },
      {
        id: "facade-q3",
        question: "A power user wants to change the amplifier volume mid-movie. Under the Facade pattern, what happens?",
        options: [
          { id: "a", label: "They can call the amplifier directly — the facade simplifies the common path but does not block access to the parts." },
          { id: "b", label: "They can't — once a facade exists, the subsystem becomes private." },
          { id: "c", label: "They must first destroy the facade object." },
          { id: "d", label: "The facade throws an exception if any subsystem is touched directly." },
        ],
        correctOptionId: "a",
        explanation:
          "Facade is a convenience, not a wall. The subsystem classes remain public and reachable; the facade just means most callers never need them. Forcing every call through the facade is an anti-pattern that turns it into a god object.",
      },
      {
        id: "facade-q4",
        question: "What is the key difference between Facade and Adapter?",
        options: [
          { id: "a", label: "Adapter changes an interface to match what a caller expects; Facade simplifies many interfaces into one easy one." },
          { id: "b", label: "There is no difference — they are two names for the same pattern." },
          { id: "c", label: "Facade works only with hardware; Adapter works only with software." },
          { id: "d", label: "Adapter wraps whole subsystems; Facade always wraps exactly one class." },
        ],
        correctOptionId: "a",
        explanation:
          "Adapter is about fit: it converts one object's interface so existing callers can use it, usually one-to-one. Facade is about simplicity: it collapses a whole subsystem's many interfaces and a multi-step workflow into one friendly method. Option (d) has it exactly backwards.",
      },
      {
        id: "facade-q5",
        question: "In the prototype, the counter reads 6 in the WITHOUT world and 1 in the WITH world. What does that gap demonstrate?",
        options: [
          { id: "a", label: "The facade moves the knowledge of 'which calls, in what order' out of every client and into one place — clients make one call instead of six error-prone ones." },
          { id: "b", label: "The facade makes the hardware run six times faster." },
          { id: "c", label: "The WITH world skips five of the six steps to save work." },
          { id: "d", label: "The subsystem objects are deleted once a facade exists." },
        ],
        correctOptionId: "a",
        explanation:
          "Both worlds run the same six subsystem steps — watchMovie() fires all six cards in sequence. What changes is who must know the choreography: without a facade, every caller makes six calls and can get the order wrong; with one, callers make a single call and the correct sequence lives in exactly one place.",
      },
    ],
  },
};
