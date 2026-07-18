import type { RoadmapLesson } from "@/lib/content/types";

export const observer: RoadmapLesson = {
  title: "Observer",
  oneLiner:
    "Let many dependents subscribe to one subject and get notified automatically the moment its state changes. Think of a YouTube channel: you hit 🔔 Subscribe, and when the channel uploads, *every current subscriber* is pinged — the channel doesn't know who you are, it just walks its list. Unsubscribe and the pings stop. Nobody polls \"is there a new video yet?\" — the subject *pushes*.",
  difficulty: "beginner",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/observer.html",
  content: {
    prototypeCaption:
      "A **YouTube channel** with four viewers. Hit 🔔 *Subscribe* on any viewer — the card turns green and the channel's **subscribers** counter ticks up: they're on the list now. Click **▶ Upload video** and notification dots fan out along the wires to *only* the subscribed viewers — their 📥 inbox badges tick +1 while unsubscribed viewers stay dim, visibly skipped. Now flip a couple of 🔔s and upload again: a *different* set gets notified, because the channel never knew who its viewers were — it just walks whatever its list says *right now*. That's the whole pattern: subscribe, get pushed to, unsubscribe, silence.",

    overview: [
      {
        type: "p",
        text: "**Observer** solves a problem every interactive program has: one object changes, and a bunch of *other* objects need to react. Its intent in one sentence: **let many dependents (observers) subscribe to one subject, and have the subject notify all of them automatically whenever its state changes.** The subject keeps a list of who's interested; when something happens, it walks that list and calls each one. It never hard-codes *who* is listening — observers add and remove themselves at runtime.",
      },
      {
        type: "p",
        text: "The perfect mental model is a **YouTube channel**. You hit the 🔔 *Subscribe* button — that's you adding yourself to the channel's subscriber list. When the channel uploads a video, YouTube notifies *every current subscriber*, automatically. The channel doesn't know your name, doesn't care what device you're on, and never checks in with you individually — it just walks its list. Hit *Unsubscribe* and the notifications stop, because you're off the list. And crucially, you never have to refresh the channel page every minute asking *\"is there a new video yet?\"* — the news comes **to you**, exactly when it happens.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Observer defines a **one-to-many** dependency: one *subject*, many *observers*. Observers `subscribe()` to the subject; when the subject's state changes it calls `notify()`, which walks the list and calls each observer's `update(...)` — the subject only ever knows the tiny Observer *interface*, never the concrete classes behind it.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've already used it today",
        text: "Every `button.addEventListener(\"click\", handler)` you've ever written *is* the Observer pattern — the button is the subject, your handler is an observer on its list, and the click is the state change that triggers `notify()`. React re-rendering the UI when state changes, RxJS streams, and spreadsheet cells recalculating when another cell changes are all the same idea.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The two roles" },
      {
        type: "p",
        text: "Observer has exactly two participants, connected by one tiny interface:",
      },
      {
        type: "ul",
        items: [
          "**Subject (the channel)** — owns the state everyone cares about *and* a private list of observers. It exposes three doors: `subscribe(observer)` adds to the list, `unsubscribe(observer)` removes from it, and `notify()` — usually called internally right after state changes — walks the list and calls each observer.",
          "**Observer (the subscriber)** — anyone who implements one small interface with a single method: `update(...)`. That method is literally *the subject calling you back*. Concrete observers (a viewer, a UI panel, a logger) each do their own thing inside it.",
          "**The one-to-many trick** — the subject stores observers *by interface only*. It can notify a viewer, a chart, and an email sender without knowing any of those classes exist. New observer types plug in without a single line changing in the subject.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `interface Subscriber {
  update(video: string): void;          // the channel calls THIS
}

class Channel {
  private subscribers: Subscriber[] = [];   // the one-to-many list

  subscribe(s: Subscriber)   { this.subscribers.push(s); }               // 🔔
  unsubscribe(s: Subscriber) { this.subscribers = this.subscribers.filter(x => x !== s); } // 🔕

  upload(title: string) {
    // 1. the subject's state changes...
    for (const s of this.subscribers) {  // 2. ...so it walks its list
      s.update(title);                   // 3. and pushes the news to each one
    }
  }
}`,
      },
      {
        type: "p",
        text: "That `for` loop inside `upload()` is the entire engine. The channel never asks *who* is on the list or *what* they'll do with the news — it fires `update()` at each entry and moves on. Subscribe four viewers and the loop runs four times; unsubscribe three of them and the very next upload notifies exactly one. The set of listeners is a **runtime** decision, not a compile-time one.",
      },
      { type: "h", text: "No more polling" },
      {
        type: "p",
        text: "The alternative to Observer is **polling**: every dependent repeatedly asks the subject *\"changed yet? changed yet?\"* on a timer. That's how you'd check a channel with no subscribe button — reload the page every minute. Polling wastes work when nothing changed and reacts *late* when something did (up to one full interval late). Observer inverts the direction: dependents register once, then the subject **pushes** at the exact moment of change. Zero wasted checks, zero built-in lag.",
      },
      { type: "h", text: "Push vs pull: what does update() carry?" },
      {
        type: "ul",
        items: [
          "**Push style** — the subject sends the data along: `update(video)`. The observer gets everything it needs in the call. Simple and fast, but the subject has to guess what every observer wants, and may end up shipping data most of them ignore.",
          "**Pull style** — the subject sends only *\"something changed\"*, typically passing itself: `update(this)`. Each observer then reads exactly the state it cares about off the subject. More flexible when observers need different slices of state, at the cost of an extra round trip and a tighter grip on the subject.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The lapsed listener — Observer's classic memory leak",
        text: "The subject's list holds a **reference** to every observer. Forget to `unsubscribe()` when an observer dies (a closed window, an unmounted component) and two bad things happen: the garbage collector can't reclaim it (the subject still points at it), and it keeps receiving updates as a *ghost*, often crashing on state it no longer has. Always pair every subscribe with an unsubscribe in teardown — component unmount, destructor, `removeEventListener`.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Order and reentrancy",
        text: "The pattern makes **no promise about notification order** — don't write observers that only work if they run before some other observer. And be careful with *reentrancy*: an `update()` that mutates the subject or subscribes/unsubscribes mid-notification can corrupt the very list being walked (many implementations iterate over a copy for exactly this reason). Keep `update()` handlers small and side-effect-light.",
      },
      { type: "h", text: "Where you meet it in the wild" },
      {
        type: "ul",
        items: [
          "**DOM events** — `addEventListener` / `removeEventListener` are subscribe/unsubscribe on a subject (the element).",
          "**React and friends** — state changes notify the framework, which re-renders the dependent UI. Model→view data binding in MVC/MVVM is the original GoF motivation.",
          "**RxJS / reactive streams** — Observables generalise the pattern into composable event pipelines.",
          "**Webhooks** — the same idea across the network: you register a URL with a service (subscribe), it POSTs to you when something happens (notify).",
        ],
      },
      { type: "h", text: "Observer vs pub/sub — close cousins, not twins" },
      {
        type: "p",
        text: "In Observer, the subject **holds the list itself** and calls its observers directly — the two sides share at least the `update()` interface and the observer knows which subject it signed up with. **Pub/sub** adds a *broker* in the middle (an event bus or message queue): publishers emit to the broker, subscribers register with the broker, and the two sides never know each other exists — not even by interface — and can even live in different processes. If you find yourself building a middleman object whose whole job is deciding who talks to whom, you're heading toward [[mediator]].",
      },
    ],

    handsOn: [
      {
        title: "01 · Build the subscriber list",
        body: "Hit the 🔔 Subscribe chip on Ana and Chloe. Their cards turn green and the channel's counter reads subscribers: 2 — that's two `subscribe()` calls landing in the channel's list. Note that nothing has been notified yet: subscribing just registers interest; only a state change triggers the push.",
      },
      {
        title: "02 · Upload and watch the push",
        body: "Click ▶ Upload video. The channel card pulses, then notification dots travel along the wires to only Ana and Chloe — their 📥 badges tick to 1 while Ben and Dan stay dim, visibly skipped. The explain panel reads 'Notified 2 of 4'. That's `notify()` walking the list: no polling, no asking — the channel pushes to whoever is registered.",
      },
      {
        title: "03 · Change the set at runtime",
        body: "Flip Chloe to 🔕 Unsubscribe and turn 🔔 on for Ben and Dan, then upload again. This time the dots reach Ana, Ben and Dan — a different set than before, with the 📥 badges keeping the history (Ana 2, Chloe stuck at 1). The channel's code never changed; only its list did. Hit ↺ Reset to start clean.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "channel.ts",
        code: `// The Observer interface — the ONLY thing the channel knows about viewers.
interface Subscriber {
  update(video: string): void;            // the channel calls this
}

// The Subject — owns state + the list, and pushes on change.
class Channel {
  private subscribers: Subscriber[] = []; // one-to-many list

  subscribe(s: Subscriber): void {
    this.subscribers.push(s);             // 🔔 join the list
  }

  unsubscribe(s: Subscriber): void {      // 🔕 leave the list
    this.subscribers = this.subscribers.filter(x => x !== s);
  }

  upload(title: string): void {
    console.log(\`📺 uploaded "\${title}"\`);
    // state changed → walk the list and PUSH (nobody polls)
    for (const s of [...this.subscribers]) s.update(title);
  }
}

// A concrete Observer — the channel never sees this class name.
class Viewer implements Subscriber {
  constructor(private name: string) {}
  update(video: string): void {           // push style: data arrives
    console.log(\`\${this.name} 🔔 new video: \${video}\`);
  }
}

const channel = new Channel();
const ana = new Viewer("Ana");
const ben = new Viewer("Ben");

channel.subscribe(ana);
channel.subscribe(ben);
channel.upload("Observer explained");    // → Ana AND Ben notified

channel.unsubscribe(ben);                // Ben leaves the list...
channel.upload("Strategy explained");    // → only Ana notified`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Channel.java",
        code: `import java.util.*;

// The Observer interface — the only thing the channel knows about viewers.
interface Subscriber {
    void update(String video);                    // the channel calls this
}

// The Subject — owns state + the list, and pushes on change.
class Channel {
    private final List<Subscriber> subscribers = new ArrayList<>();

    public void subscribe(Subscriber s)   { subscribers.add(s); }    // 🔔
    public void unsubscribe(Subscriber s) { subscribers.remove(s); } // 🔕

    public void upload(String title) {
        System.out.println("📺 uploaded: " + title);
        // state changed → walk a COPY of the list and push
        // (copy guards against subscribe/unsubscribe during notification)
        for (Subscriber s : new ArrayList<>(subscribers)) {
            s.update(title);
        }
    }
}

// A concrete Observer — the channel never sees this class name.
class Viewer implements Subscriber {
    private final String name;
    Viewer(String name) { this.name = name; }
    public void update(String video) {            // push style: data arrives
        System.out.println(name + " 🔔 new video: " + video);
    }
}

class Demo {
    public static void main(String[] args) {
        Channel channel = new Channel();
        Viewer ana = new Viewer("Ana"), ben = new Viewer("Ben");
        channel.subscribe(ana);
        channel.subscribe(ben);
        channel.upload("Observer explained");     // → Ana AND Ben notified
        channel.unsubscribe(ben);                 // Ben off the list...
        channel.upload("Strategy explained");     // → only Ana notified
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "channel.py",
        code: `from typing import Protocol


class Subscriber(Protocol):          # the tiny Observer interface
    def update(self, video: str) -> None: ...


class Channel:                        # the Subject
    def __init__(self) -> None:
        self._subscribers: list[Subscriber] = []   # one-to-many list

    def subscribe(self, s: Subscriber) -> None:
        self._subscribers.append(s)                # 🔔 join the list

    def unsubscribe(self, s: Subscriber) -> None:
        self._subscribers.remove(s)                # 🔕 leave the list

    def upload(self, title: str) -> None:
        print(f'📺 uploaded "{title}"')
        # state changed → walk a copy of the list and PUSH
        for s in list(self._subscribers):
            s.update(title)


class Viewer:                         # a concrete Observer
    def __init__(self, name: str) -> None:
        self.name = name

    def update(self, video: str) -> None:          # push style: data arrives
        print(f"{self.name} 🔔 new video: {video}")


channel = Channel()
ana, ben = Viewer("Ana"), Viewer("Ben")

channel.subscribe(ana)
channel.subscribe(ben)
channel.upload("Observer explained")   # → Ana AND Ben notified

channel.unsubscribe(ben)               # Ben off the list...
channel.upload("Strategy explained")   # → only Ana notified`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "channel.cpp",
        code: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

// The Observer interface — the only thing the channel knows about viewers.
struct Subscriber {
    virtual ~Subscriber() = default;
    virtual void update(const std::string& video) = 0;  // channel calls this
};

// The Subject — owns state + the list, and pushes on change.
class Channel {
    std::vector<Subscriber*> subscribers;   // one-to-many list (non-owning)

public:
    void subscribe(Subscriber* s)   { subscribers.push_back(s); }   // 🔔
    void unsubscribe(Subscriber* s) {                               // 🔕
        subscribers.erase(
            std::remove(subscribers.begin(), subscribers.end(), s),
            subscribers.end());
    }

    void upload(const std::string& title) {
        std::cout << "📺 uploaded: " << title << "\\n";
        auto snapshot = subscribers;        // copy: safe if list mutates
        for (auto* s : snapshot) s->update(title);   // push to each one
    }
};

// A concrete Observer — the channel never sees this class name.
class Viewer : public Subscriber {
    std::string name;
public:
    explicit Viewer(std::string n) : name(std::move(n)) {}
    void update(const std::string& video) override { // push style
        std::cout << name << " 🔔 new video: " << video << "\\n";
    }
};

int main() {
    Channel channel;
    Viewer ana{"Ana"}, ben{"Ben"};
    channel.subscribe(&ana);
    channel.subscribe(&ben);
    channel.upload("Observer explained");   // → Ana AND Ben notified
    channel.unsubscribe(&ben);              // Ben off the list...
    channel.upload("Strategy explained");   // → only Ana notified
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Observer when..." },
      {
        type: "ul",
        items: [
          "**One object's changes must reach a varying set of dependents** — you can't hard-code the receivers because they come and go at runtime (viewers subscribing, panels opening and closing, plugins registering).",
          "**You're building event-driven UI** — clicks, keystrokes, model-changed-so-redraw-the-view. Virtually every UI framework is Observer at its core.",
          "**You want the producer decoupled from its consumers** — the subject ships one `notify()`, and brand-new consumer types plug in later without touching the subject's code.",
        ],
      },
      { type: "h", text: "Skip it when..." },
      {
        type: "ul",
        items: [
          "**There's exactly one fixed, known dependent** — just call it directly. A subscription list for a single permanent listener is ceremony with no payoff.",
          "**Update cascades are getting hard to follow** — when observers mutate state that notifies *other* observers, control flow turns into invisible spaghetti. Centralise the choreography in a [[mediator]] or an explicit event bus instead.",
          "**Strict ordering or transactional delivery matters** — plain Observer promises neither; if receivers must run in a fixed order or all-or-nothing, you need a more explicit orchestration.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Loose coupling — the subject depends on one tiny interface, never on concrete observer classes, so either side can change freely.",
        "Open for extension — add a brand-new kind of observer (logger, chart, emailer) without touching one line of the subject.",
        "Runtime dynamism — the set of listeners is data, not code: subscribe and unsubscribe freely while the program runs.",
        "Push replaces polling — dependents are told at the exact moment of change instead of wastefully asking on a timer.",
      ],
      cons: [
        "Lapsed-listener leaks — a forgotten unsubscribe keeps dead observers referenced (never garbage-collected) and receiving ghost updates.",
        "Unspecified order — observers are notified in whatever order the list happens to have; code that relies on order breaks silently.",
        "Hidden cascades — an update() that changes other subjects can trigger chains of notifications nobody planned or can easily trace.",
        "Harder debugging — the caller of update() is a loop inside the subject, so 'who made this happen?' isn't visible by reading the observer's code.",
      ],
    },

    furtherReading: [
      {
        label: "Observer — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/observer",
        note: "The clearest illustrated walkthrough: publisher/subscriber roles, structure diagram, real-world analogy, and code in many languages. Best first read.",
        kind: "article",
      },
      {
        label: "Observer pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Observer_pattern",
        note: "Concise reference with the UML structure, push vs pull variants, the coupling and lapsed-listener criticisms, and language-level implementations.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book. Observer is one of its most influential entries — the formal intent, the push/pull discussion, and the MVC motivation come from here.",
        kind: "book",
      },
      {
        label: "EventTarget.addEventListener() — MDN",
        href: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
        note: "The Observer pattern you use every day: the DOM's subscribe call, with removeEventListener as the unsubscribe that prevents lapsed listeners.",
        kind: "docs",
      },
      {
        label: "RxJS — Observables overview",
        href: "https://rxjs.dev/guide/overview",
        note: "Where Observer grows up: Observables generalise subject/subscriber into composable, cancellable event streams used across modern front-end code.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "observer-q1",
        question: "What is the intent of the Observer pattern?",
        options: [
          { id: "a", label: "Let many dependents subscribe to one subject and be notified automatically when its state changes." },
          { id: "b", label: "Guarantee a class has exactly one instance with a global access point." },
          { id: "c", label: "Let each dependent poll the subject on a timer to check for changes." },
          { id: "d", label: "Wrap an incompatible interface so old code can call new code." },
        ],
        correctOptionId: "a",
        explanation:
          "Observer defines a one-to-many dependency: observers register with a subject, and the subject pushes notifications to all of them when it changes — like a YouTube channel notifying its subscribers on upload. (b) is Singleton, (d) is Adapter, and (c) is polling — the exact thing Observer replaces.",
      },
      {
        id: "observer-q2",
        question: "What does the subject (the channel) actually know about its observers?",
        options: [
          { id: "a", label: "Only the small Observer interface — it walks its list calling update() without knowing any concrete classes." },
          { id: "b", label: "The full concrete class of every observer, so it can call their specific methods." },
          { id: "c", label: "Nothing at all — a broker delivers the notifications for it." },
          { id: "d", label: "Only observers that were registered at compile time." },
        ],
        correctOptionId: "a",
        explanation:
          "The subject stores observers by interface and calls one method — update() — on each. It never depends on concrete observer types, which is what makes the coupling loose. Option (c) describes pub/sub with a broker; in plain Observer the subject holds the list and calls observers directly, and the list changes freely at runtime, not compile time.",
      },
      {
        id: "observer-q3",
        question: "What's the difference between push-style and pull-style notification?",
        options: [
          { id: "a", label: "Push sends the changed data inside update(data); pull sends just 'something changed' and observers read what they need from the subject." },
          { id: "b", label: "Push notifies instantly; pull batches all notifications until midnight." },
          { id: "c", label: "Push is for UI code only; pull is for backend code only." },
          { id: "d", label: "Push uses inheritance while pull uses composition." },
        ],
        correctOptionId: "a",
        explanation:
          "In push style the subject ships the data with the call (update(video)) — convenient, but the subject guesses what everyone needs. In pull style the subject sends a bare 'changed' signal (often update(this)) and each observer pulls exactly the state it cares about. It's a data-flow choice, not a timing, layer, or inheritance distinction.",
      },
      {
        id: "observer-q4",
        question: "You destroy a UI panel but forget to unsubscribe it from the model it was observing. What happens?",
        options: [
          { id: "a", label: "The model's list still references the panel, so it can't be garbage-collected and keeps receiving updates as a ghost — the classic lapsed-listener leak." },
          { id: "b", label: "Nothing — the subject automatically detects dead observers and drops them." },
          { id: "c", label: "The model is destroyed along with the panel." },
          { id: "d", label: "The next notify() call throws a compile-time error." },
        ],
        correctOptionId: "a",
        explanation:
          "The subject's list holds a live reference to every registered observer, so a 'dead' panel is kept alive in memory and still gets update() calls it can no longer handle safely. Plain Observer has no automatic dead-observer detection — that's why every subscribe must be paired with an unsubscribe in teardown (unmount, destructor, removeEventListener).",
      },
      {
        id: "observer-q5",
        question: "How does classic Observer differ from pub/sub?",
        options: [
          { id: "a", label: "In Observer the subject holds the list and calls observers directly; pub/sub puts a broker in the middle so publisher and subscriber don't know each other at all." },
          { id: "b", label: "They are identical patterns with two different names." },
          { id: "c", label: "Pub/sub only works over a network; Observer only works inside one class." },
          { id: "d", label: "Observer requires a message queue; pub/sub does not." },
        ],
        correctOptionId: "a",
        explanation:
          "The distinguishing feature is who owns the delivery. In Observer the subject itself keeps the list and invokes update() on each observer — they're coupled at least through the interface. Pub/sub inserts a broker (event bus, message queue): publishers emit to it, subscribers register with it, and the two sides are fully unaware of each other, often across process boundaries.",
      },
      {
        id: "observer-q6",
        question: "Before adding Observer, a dashboard asked the stock service for the latest price every second. What did the pattern change?",
        options: [
          { id: "a", label: "The dashboard subscribes once, and the service pushes exactly when the price changes — no wasted checks, no up-to-one-second lag." },
          { id: "b", label: "The dashboard now polls twice as fast, so updates feel more responsive." },
          { id: "c", label: "The service now polls the dashboard instead." },
          { id: "d", label: "Nothing about the update flow changes; only the class names do." },
        ],
        correctOptionId: "a",
        explanation:
          "Observer inverts the direction of the conversation. Instead of dependents repeatedly asking 'changed yet?' (wasteful when nothing changed, late when something did), they register once and the subject notifies them at the moment of change. Polling in either direction — options (b) and (c) — is exactly what the pattern removes.",
      },
    ],
  },
};
