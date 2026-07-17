import type { RoadmapLesson } from "@/lib/content/types";

export const mediator: RoadmapLesson = {
  title: "Mediator",
  oneLiner:
    "When a group of objects all talk to each other directly, every one of them ends up knowing every other — a tangle of n(n−1)/2 links. Mediator pulls all that communication into one hub: each object talks only to the mediator (`send()` to the ChatRoom), and the mediator decides who hears about it. Like air traffic control — planes never negotiate with each other; they all talk to the tower.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/mediator.html",
  content: {
    prototypeCaption:
      "A tiny chat network with four users. Flip between two worlds and watch the **connections counter**. In **WITHOUT Mediator**, every user holds a direct link to every other user — 4 people already need **6** tangled lines, and clicking an avatar fires a message down *all* of its links because the sender must know everyone personally. Press *＋ Add user* and Eve joins with a jolt: the mesh jumps from 6 to **10** lines, because every existing user had to learn about her. Flip to **WITH Mediator** and the tangle collapses: each user keeps exactly **one** calm line to the central 💬 ChatRoom hub. Click an avatar — one pulse to the hub, and the *hub* fans it out to the others. Add Eve now and the count ticks from 4 to just **5**: one new line, and nobody else changed. The line count *is* the lesson.",

    overview: [
      {
        type: "p",
        text: "**Mediator** answers one question: what do you do when a group of objects all need to talk to each other? The naive answer — give every object a reference to every other object — works for two or three, then rots. Each object must *know* all its peers, message them, and react to them; change one and you touch them all. The intent of Mediator, in one sentence: **centralize that tangled object-to-object communication in a single mediator object, so each colleague only knows the hub — never each other.**",
      },
      {
        type: "p",
        text: "The classic picture is **air traffic control**. Dozens of planes approach one airport, and they absolutely must coordinate — but they never negotiate with each other pairwise ('you land first, I'll circle'). Every plane talks *only to the tower*, and the tower coordinates all of them. In code, the same shape appears in a chat room: users don't hold references to every other user; each user just calls `send()` on the `ChatRoom`, and the room decides who receives the message. The planes and the users are the **colleagues**; the tower and the room are the **mediator**.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Mediator replaces **many-to-many** links between objects with **many-to-one** links to a hub. Colleagues stop saying *'hey Ben, hey Chloe, hey Dan…'* and start saying *'hey room, deliver this'* — the room knows who's there and routes it.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Why the difference explodes with size",
        text: "With direct links, *n* objects need up to `n(n−1)/2` connections — 4 objects need 6, 10 objects need 45, 50 objects need 1,225. With a mediator, *n* objects need exactly `n` connections. Adding one more colleague costs **one** new link instead of *n* new ones. The prototype's connections counter makes this painfully visible.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three participants" },
      {
        type: "p",
        text: "A textbook Mediator has three roles, and the discipline that makes it work is brutally simple: **colleagues hold a reference to the mediator and nothing else**.",
      },
      {
        type: "ul",
        items: [
          "**Mediator interface** — declares how colleagues talk to the hub, typically one method like `send(message, from)`. Colleagues depend only on this interface, so you can swap in a different concrete mediator (a logging room, a moderated room) without touching them.",
          "**Concrete Mediator** (`ChatRoom`, the control tower) — keeps the list of colleagues and owns *all* the coordination logic: who receives what, in what order, under what rules. This is the one place where 'who talks to whom' lives.",
          "**Colleagues** (`User`, a plane) — each holds a single reference to the mediator. To communicate, a colleague calls the mediator; to be reached, it exposes a method the mediator calls back (like `receive()`). A colleague never names another colleague.",
        ],
      },
      { type: "h", text: "The connection math" },
      {
        type: "p",
        text: "This is the heart of the pattern. Fully meshed, *n* colleagues need `n(n−1)/2` links, because every pair gets its own connection — and *every existing object changes* when a new one joins, since each must learn about the newcomer. With a hub, *n* colleagues need exactly `n` links, and a newcomer costs exactly **one** new link — registration with the mediator. Nobody else is edited, recompiled, or even aware.",
      },
      {
        type: "p",
        text: "There's a second, quieter win: **colleagues become reusable**. A `User` class that hard-codes `ben.receive(...)` and `chloe.receive(...)` can only live in this exact chat. A `User` that only knows 'some mediator' can be dropped into any room, any test harness, any future feature — because it never names its peers. Low coupling between colleagues is bought by pointing all the coupling at one hub (see [[coupling-and-cohesion]]).",
      },
      {
        type: "code",
        language: "typescript",
        code: `interface ChatMediator {                 // the Mediator interface
  send(message: string, from: User): void;
}

class ChatRoom implements ChatMediator { // the concrete mediator (the tower)
  private users: User[] = [];

  join(user: User) { this.users.push(user); }   // one link per newcomer

  send(message: string, from: User) {
    // ALL routing logic lives here — colleagues know none of it
    for (const u of this.users) {
      if (u !== from) u.receive(message, from.name);
    }
  }
}

class User {                             // a colleague
  constructor(public name: string, private room: ChatMediator) {}
  send(message: string)  { this.room.send(message, this); } // talk to the hub only
  receive(message: string, from: string) {
    console.log(\`\${this.name} got "\${message}" from \${from}\`);
  }
}`,
      },
      {
        type: "p",
        text: "Trace one message: Ana calls `ana.send(\"hi\")` → her `User` object forwards to `room.send(\"hi\", ana)` → the `ChatRoom` loops over its member list and calls `receive()` on everyone but Ana. Ana's class contains no mention of Ben, Chloe, or Dan. Add Eve tomorrow with one `room.join(eve)` call — Ana's code doesn't change by a single character.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The god-object trap",
        text: "Mediator's known failure mode: all the interaction logic you removed from the colleagues has to live *somewhere*, and it all lands in the mediator. Left unchecked, the hub grows into a sprawling **god object** — thousands of lines that know everything and are terrifying to change. If your mediator is accumulating unrelated coordination rules, split it into several focused mediators, each with one job — the same medicine as [[single-responsibility]]. Simplifying the colleagues by *complicating the hub without limit* is not a win.",
      },
      { type: "h", text: "Where you've already met it" },
      {
        type: "ul",
        items: [
          "**UI dialogs** — the GoF's original example. A dialog box coordinates its widgets: when the 'signup' checkbox is ticked, the dialog enables the email field and relabels the button. The checkbox doesn't poke the text field directly; the dialog (mediator) reacts and coordinates.",
          "**Air traffic control** — the physical-world mediator. Planes broadcast position and intent to the tower; the tower sequences landings. No pilot-to-pilot negotiation.",
          "**Chat servers** — Slack, Discord, IRC. Your client never opens a socket to every other member of a channel; it talks to the server, which routes to the room.",
          "**Event buses / message brokers** — components publish events to a bus and subscribe to what they care about, never referencing each other. Pub/sub is Mediator's looser cousin: same hub shape, but the hub routes by *topic* instead of by bespoke coordination rules.",
        ],
      },
      { type: "h", text: "Mediator vs Observer — the classic mix-up" },
      {
        type: "p",
        text: "Both patterns decouple objects that need to react to each other, so they're easy to confuse. [[observer]] is **one-to-many broadcast from a subject**: one object announces 'I changed', and whoever subscribed gets notified — the subject doesn't know or care what listeners do. Mediator is **many-to-many coordination through a hub**: a whole group of peers communicate, and the hub owns the *rules* of the conversation — who hears what, in what order, under what conditions. A handy tell: in Observer the interesting logic lives in the *listeners*; in Mediator the interesting logic lives in the *hub*. (In practice a mediator is often *implemented* using observer-style callbacks — the patterns compose.)",
      },
    ],

    handsOn: [
      {
        title: "01 · Count the tangle",
        body: "Open the prototype with the toggle on ✕ WITHOUT Mediator. Four avatars — Ana, Ben, Chloe, Dan — are joined by 6 reddish lines, one per pair, and the chip reads connections: 6. Click Ana: pulses race down all three of her direct links at once and each recipient flashes. She could only do that because her object holds a personal reference to every other user.",
      },
      {
        title: "02 · Feel the cost of growth",
        body: "Still in the WITHOUT world, press ＋ Add user. Eve joins the circle and the mesh jumps from 6 to 10 lines — the four brand-new links flash red, one for every existing user who had to learn about her. That's the n(n−1)/2 curve biting: user number 5 cost four new connections, and every existing object changed.",
      },
      {
        title: "03 · Flip to the hub",
        body: "Switch the toggle to ✓ WITH Mediator. The tangle collapses to 4 calm green lines, each running to the central 💬 ChatRoom hub. Click any avatar: one pulse to the hub, the hub flashes, then it fans the message out to everyone else. Press ＋ Add user again — Eve joins with exactly ONE new line (connections: 4 → 5) and nobody else gained a link. Press ↺ Reset and repeat in both worlds until the counter difference feels obvious.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "chat-room.ts",
        code: `// Mediator interface — the only thing colleagues know about
interface ChatMediator {
  send(message: string, from: User): void;
}

// Concrete mediator: the hub. ALL routing logic lives here.
class ChatRoom implements ChatMediator {
  private users: User[] = [];

  join(user: User): void {
    this.users.push(user);          // a newcomer costs ONE link
  }

  send(message: string, from: User): void {
    for (const u of this.users) {
      if (u !== from) {             // route to everyone but the sender
        u.receive(message, from.name);
      }
    }
  }
}

// Colleague: holds a reference to the mediator — never to other users.
class User {
  constructor(public name: string, private room: ChatMediator) {}

  send(message: string): void {
    this.room.send(message, this);  // talk to the hub, not to peers
  }

  receive(message: string, from: string): void {
    console.log(\`[\${this.name}] \${from}: \${message}\`);
  }
}

const room = new ChatRoom();
const ana = new User("Ana", room);
const ben = new User("Ben", room);
room.join(ana);
room.join(ben);

ana.send("hello!");   // → [Ben] Ana: hello!  (the room routed it)`,
      },
      {
        label: "Java",
        language: "java",
        filename: "ChatRoom.java",
        code: `import java.util.*;

// Mediator interface — colleagues depend only on this
interface ChatMediator {
    void send(String message, User from);
}

// Concrete mediator: the hub. All routing logic lives here.
class ChatRoom implements ChatMediator {
    private final List<User> users = new ArrayList<>();

    public void join(User user) {
        users.add(user);                    // a newcomer costs ONE link
    }

    @Override
    public void send(String message, User from) {
        for (User u : users) {
            if (u != from) {                // everyone but the sender
                u.receive(message, from.getName());
            }
        }
    }
}

// Colleague: knows the mediator — never the other users.
class User {
    private final String name;
    private final ChatMediator room;

    User(String name, ChatMediator room) { this.name = name; this.room = room; }

    String getName() { return name; }

    void send(String message)  { room.send(message, this); }  // hub only
    void receive(String message, String from) {
        System.out.println("[" + name + "] " + from + ": " + message);
    }
}

// ChatRoom room = new ChatRoom();
// User ana = new User("Ana", room);  room.join(ana);
// User ben = new User("Ben", room);  room.join(ben);
// ana.send("hello!");   // → [Ben] Ana: hello!`,
      },
      {
        label: "Python",
        language: "python",
        filename: "chat_room.py",
        code: `# Concrete mediator: the hub. ALL routing logic lives here.
class ChatRoom:
    def __init__(self):
        self._users = []

    def join(self, user):
        self._users.append(user)          # a newcomer costs ONE link

    def send(self, message, sender):
        for u in self._users:
            if u is not sender:           # route to everyone but the sender
                u.receive(message, sender.name)


# Colleague: holds a reference to the mediator — never to other users.
class User:
    def __init__(self, name, room):
        self.name = name
        self._room = room                 # the ONLY reference it holds

    def send(self, message):
        self._room.send(message, self)    # talk to the hub, not to peers

    def receive(self, message, from_name):
        print(f"[{self.name}] {from_name}: {message}")


room = ChatRoom()
ana = User("Ana", room)
ben = User("Ben", room)
room.join(ana)
room.join(ben)

ana.send("hello!")   # → [Ben] Ana: hello!  (the room routed it)`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "chat_room.cpp",
        code: `#include <iostream>
#include <string>
#include <vector>

class User;  // forward declaration

// Mediator interface — colleagues depend only on this
struct ChatMediator {
    virtual void send(const std::string& msg, User* from) = 0;
    virtual ~ChatMediator() = default;
};

// Colleague: knows the mediator — never the other users.
class User {
    std::string name;
    ChatMediator* room;                 // the ONLY reference it holds
public:
    User(std::string n, ChatMediator* r) : name(std::move(n)), room(r) {}

    const std::string& getName() const { return name; }
    void send(const std::string& msg)  { room->send(msg, this); }  // hub only
    void receive(const std::string& msg, const std::string& from) {
        std::cout << "[" << name << "] " << from << ": " << msg << "\\n";
    }
};

// Concrete mediator: the hub. All routing logic lives here.
class ChatRoom : public ChatMediator {
    std::vector<User*> users;
public:
    void join(User* u) { users.push_back(u); }   // ONE link per newcomer

    void send(const std::string& msg, User* from) override {
        for (User* u : users)
            if (u != from)                        // everyone but the sender
                u->receive(msg, from->getName());
    }
};

// int main() {
//     ChatRoom room;
//     User ana("Ana", &room), ben("Ben", &room);
//     room.join(&ana); room.join(&ben);
//     ana.send("hello!");   // → [Ben] Ana: hello!
// }`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a Mediator when the links themselves are the problem" },
      {
        type: "ul",
        items: [
          "**Widgets or components with tangled cross-references** — a form where the checkbox enables a field, the field validates against a dropdown, the dropdown relabels a button. Move the choreography into one dialog/controller mediator and each widget shrinks back to doing its own job.",
          "**You want to reuse colleagues independently** — a class you can't lift out of its context because it names five sibling classes isn't reusable. Route everything through a mediator and the colleague travels light: it only needs *a* hub, any hub.",
          "**Complex interaction rules that deserve one home** — 'when X happens, tell Y unless Z is busy' scattered across ten classes is unfindable. In a mediator, the whole conversation policy sits in one readable place you can test on its own.",
          "**The group's membership changes at runtime** — chat rooms, plugin systems, planes entering airspace. With a hub, joining and leaving is one registration call instead of introducing the newcomer to every peer.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When NOT to use it",
        text: "With only **2–3 objects and simple links**, a hub is overkill — you'd be adding an extra class and an extra hop to replace two references that were perfectly readable. Mediator earns its keep when the pair count grows or the interaction *rules* get intricate. Adding one prematurely just relocates simple code and hands you a future god object; the pattern pays off on the n(n−1)/2 curve, not at n = 3.",
      },
    ],

    tradeoffs: {
      pros: [
        "Slashes coupling — n colleagues need n links to the hub instead of up to n(n−1)/2 links to each other, and adding a colleague costs one registration instead of editing every peer.",
        "Single home for interaction rules — the whole conversation policy ('who hears what, when') lives in one class you can read, test, and change without hunting across the codebase.",
        "Colleagues become reusable and testable in isolation — a User that only knows 'some mediator' drops into any room or any test with a stub hub; it never names its peers.",
        "Open to new coordination behavior — swap or subclass the concrete mediator (a moderated room, a logging tower) without touching a single colleague, since they depend only on the mediator interface.",
      ],
      cons: [
        "God-object risk — every rule you remove from the colleagues lands in the hub, and an unwatched mediator swells into a do-everything class that's scarier than the tangle it replaced.",
        "Single point of failure and contention — all traffic flows through one object; a bug in the mediator breaks every conversation, and in concurrent systems the hub can bottleneck.",
        "Indirection tax — following one message now means hopping sender → mediator → receiver, which is harder to trace in a debugger than a direct call.",
        "Overkill for small groups — with 2–3 simply-linked objects, the extra interface, class, and hop add ceremony without paying back any coupling savings.",
      ],
    },

    furtherReading: [
      {
        label: "Mediator — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/mediator",
        note: "The clearest illustrated walkthrough: the tangled-dialog problem, the aircraft/tower analogy, structure diagrams, and code in several languages. Best first read.",
        kind: "article",
      },
      {
        label: "Mediator pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Mediator_pattern",
        note: "Concise reference with the formal participant roles (Mediator, Colleague), UML structure, and short examples across languages.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book. Its Mediator chapter uses the classic dialog-box-coordinating-widgets example and discusses the Observer relationship.",
        kind: "book",
      },
      {
        label: "Mediator — SourceMaking",
        href: "https://sourcemaking.com/design_patterns/mediator",
        note: "Intent, problem, and checklist framing with the air-traffic-control analogy spelled out, plus common misuse notes.",
        kind: "article",
      },
      {
        label: "The Mediator pattern in JavaScript — Addy Osmani, Learning JavaScript Design Patterns",
        href: "https://www.patterns.dev/vanilla/mediator-pattern/",
        note: "A modern front-end take: chat rooms and event aggregation, and an honest discussion of where Mediator ends and pub/sub begins.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "mediator-q1",
        question: "What is the core intent of the Mediator pattern?",
        options: [
          { id: "a", label: "Centralize communication between a group of objects in one hub, so each object only knows the mediator — never its peers." },
          { id: "b", label: "Guarantee that a class has exactly one instance with a global access point." },
          { id: "c", label: "Let objects be cloned instead of constructed from scratch." },
          { id: "d", label: "Give every object a direct reference to every other object so messages arrive faster." },
        ],
        correctOptionId: "a",
        explanation:
          "Mediator replaces many-to-many links between colleagues with many-to-one links to a hub that owns the routing rules — like planes talking only to the control tower. Option (b) is Singleton, (c) is Prototype, and (d) is exactly the tangle Mediator exists to remove.",
      },
      {
        id: "mediator-q2",
        question: "10 objects are fully meshed — each holds a direct link to every other. Roughly how many links exist, and how many would a mediator need?",
        options: [
          { id: "a", label: "45 direct links (n(n−1)/2); with a mediator, just 10 — one per object to the hub." },
          { id: "b", label: "10 direct links either way — a mediator doesn't change the count." },
          { id: "c", label: "100 direct links; with a mediator, 50." },
          { id: "d", label: "45 direct links; with a mediator, 90, because messages travel in both directions." },
        ],
        correctOptionId: "a",
        explanation:
          "Fully meshed, n objects need n(n−1)/2 links: 10 × 9 / 2 = 45. A mediator needs exactly one link per colleague — 10. Just as important: adding an 11th object costs 10 new links in the mesh but only 1 with the hub.",
      },
      {
        id: "mediator-q3",
        question: "In a ChatRoom mediator, what does a User (colleague) hold a reference to?",
        options: [
          { id: "a", label: "Only the mediator — it calls room.send() and never names another user." },
          { id: "b", label: "Every other user in the room, so it can call receive() on each of them." },
          { id: "c", label: "Nothing — colleagues communicate through global variables." },
          { id: "d", label: "Only the user who most recently messaged it." },
        ],
        correctOptionId: "a",
        explanation:
          "The whole discipline of the pattern is that colleagues hold exactly one reference: the mediator. That's what makes them reusable — a User that never names its peers can be dropped into any room or any test. Option (b) is the fully-meshed 'without' world.",
      },
      {
        id: "mediator-q4",
        question: "What is the best-known risk of applying the Mediator pattern?",
        options: [
          { id: "a", label: "The mediator absorbs all the interaction logic and swells into a god object that's hard to maintain." },
          { id: "b", label: "Colleagues become more tightly coupled to each other over time." },
          { id: "c", label: "It makes it impossible to add new colleagues at runtime." },
          { id: "d", label: "Messages can no longer be delivered to more than one receiver." },
        ],
        correctOptionId: "a",
        explanation:
          "Every rule removed from the colleagues has to live somewhere, and it all lands in the hub. Unwatched, the mediator becomes a sprawling god object — the cure is to split it into several focused mediators, each with a single responsibility. Options (b), (c), and (d) are the opposite of what the pattern does.",
      },
      {
        id: "mediator-q5",
        question: "How does Mediator differ from Observer?",
        options: [
          { id: "a", label: "Observer is one-to-many broadcast from a subject to whoever subscribed; Mediator coordinates many-to-many communication among peers through a hub that owns the routing rules." },
          { id: "b", label: "They are the same pattern with two names." },
          { id: "c", label: "Observer requires a central hub object; Mediator forbids one." },
          { id: "d", label: "Mediator can only be used in user interfaces, while Observer works anywhere." },
        ],
        correctOptionId: "a",
        explanation:
          "In Observer, a subject announces 'I changed' and doesn't care what listeners do — the interesting logic lives in the listeners. In Mediator, a hub owns the conversation rules for a whole group of peers — the interesting logic lives in the hub. The two even compose: mediators are often implemented with observer-style callbacks.",
      },
    ],
  },
};
