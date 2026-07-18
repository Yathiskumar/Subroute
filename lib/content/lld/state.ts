import type { RoadmapLesson } from "@/lib/content/types";

export const statePattern: RoadmapLesson = {
  title: "State",
  oneLiner:
    "Let an object change its behavior when its internal state changes — by making each state its own class. A music player's `pressPlay()` does three different things depending on whether it's stopped, playing, or paused. Instead of a `switch(this.state)` copied into every method, each state becomes a class (StoppedState, PlayingState, PausedState) and the player simply delegates to whichever one is current.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/state.html",
  content: {
    prototypeCaption:
      "A **music player** with one `⏯ pressPlay()` button. Press it while **STOPPED** and playback starts; press the *exact same button* while **PLAYING** and it pauses; press it while **PAUSED** and it resumes. Watch the glow: the player never decides anything itself — it hands every call to the *current state card* below it, and that card both performs the behavior and picks the next state (the glow physically moves). Flip the **🔀 switch-view** chip to see what the same logic looks like as a naive `switch(state)` block — one red card where *every new state means editing every method*. Same button, three behaviors: that is the State pattern in one glance.",

    overview: [
      {
        type: "p",
        text: "**State** is a behavioral pattern with a one-sentence intent: *let an object change its behavior when its internal state changes, by delegating to a state object instead of switching on a flag*. Think of a **music player**. It has one `pressPlay()` button, but that button does three completely different things: when the player is *stopped*, it starts playback from the top; when it's *playing*, it pauses; when it's *paused*, it resumes. The behavior of the very same method depends entirely on what mode the object is in right now.",
      },
      {
        type: "p",
        text: "The naive way to code this is a state *flag* — `this.state = \"PLAYING\"` — and a `switch` (or if/else chain) on that flag inside `pressPlay()`. Then another switch inside `pressStop()`. And another inside `pressNext()`. Every method grows its own copy of the same branching, and adding one new state (say, *Buffering*) means hunting down and editing **every one of those switches**. The State pattern flips this inside out: each state becomes its **own class** — `StoppedState`, `PlayingState`, `PausedState` — all implementing the same interface. The player keeps a reference to its *current* state object and forwards every call to it. The mode-specific logic lives in exactly one place per mode.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "When an object's behavior depends on a mode that changes at runtime, don't `switch` on a flag in every method — give each mode its **own class** and let the object **delegate to its current state**, which also decides what the *next* state is.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Same word, two lessons",
        text: "This lesson is the *behavioral design pattern* called State — states as classes inside your code. The [[state-diagrams]] lesson is the *UML notation* for drawing states and transitions on paper. They fit together beautifully: a state diagram is often the blueprint, and the State pattern is how you implement that blueprint so each circle in the drawing becomes one class.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three participants" },
      {
        type: "p",
        text: "A textbook State setup has three moving parts, and once you see them in the player example you'll recognize them everywhere:",
      },
      {
        type: "ul",
        items: [
          "**Context** — the object the outside world talks to. Here it's the `Player`. It holds one field, `current: State`, and its public methods (`pressPlay()`, `pressStop()`) do nothing but *forward the call* to `current`. The context contains **zero** mode-specific logic.",
          "**State interface** — one small interface with *one method per action* the context supports: `pressPlay(player)`, `pressStop(player)`. Every concrete state must answer all of them, so no mode can 'forget' to handle an action.",
          "**Concrete states** — one class per mode: `StoppedState`, `PlayingState`, `PausedState`. Each implements the actions *the way that mode behaves*, and — crucially — each decides the **next** state by calling `player.setState(new PlayingState())`.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `interface State {
  pressPlay(player: Player): void;
  pressStop(player: Player): void;
}

class Player {
  current: State = new StoppedState();   // start stopped
  setState(s: State) { this.current = s; }

  // the context only delegates — no switch, no flags
  pressPlay() { this.current.pressPlay(this); }
  pressStop() { this.current.pressStop(this); }
}

class StoppedState implements State {
  pressPlay(p: Player) {
    console.log("▶ start from 0:00");
    p.setState(new PlayingState());      // the STATE picks the next state
  }
  pressStop() { console.log("already stopped"); }
}

class PlayingState implements State {
  pressPlay(p: Player) {
    console.log("⏸ pause");
    p.setState(new PausedState());
  }
  pressStop(p: Player) {
    console.log("⏹ stop");
    p.setState(new StoppedState());
  }
}`,
      },
      {
        type: "p",
        text: "Follow one call through: you press play while music is playing. `player.pressPlay()` runs `this.current.pressPlay(this)`. Because `current` happens to be a `PlayingState`, *that class's* version runs — it pauses playback and swaps the player over to a fresh `PausedState`. The next `pressPlay()` lands on `PausedState` and resumes. The player object never asked \"what state am I in?\" — polymorphism answered the question for it.",
      },
      { type: "h", text: "Transitions live inside the states" },
      {
        type: "p",
        text: "This is the detail people miss on first read: it's not just that behavior is split into classes — the **transition logic moves too**. `StoppedState.pressPlay()` ends with `player.setState(new PlayingState())`. Each state knows which states can legally follow it, so the whole transition map is spelled out in the state classes themselves, not scattered across the context. Illegal moves become trivially easy to express: `StoppedState.pressStop()` simply does nothing (or logs \"already stopped\") — there's no way to accidentally fall through to the wrong branch of a shared switch.",
      },
      { type: "h", text: "The smell this pattern cures" },
      {
        type: "p",
        text: "Here's the code State replaces — and why it rots. Notice it's the *same* three-way branch, duplicated once per method:",
      },
      {
        type: "code",
        language: "typescript",
        code: `class Player {
  state = "STOPPED";               // a string flag

  pressPlay() {
    switch (this.state) {          // branch #1
      case "STOPPED": /* start */  this.state = "PLAYING"; break;
      case "PLAYING": /* pause */  this.state = "PAUSED";  break;
      case "PAUSED":  /* resume */ this.state = "PLAYING"; break;
    }
  }
  pressStop() {
    switch (this.state) { /* branch #2 — same three cases again */ }
  }
  pressNext() {
    switch (this.state) { /* branch #3 — and again... */ }
  }
}`,
      },
      {
        type: "ul",
        items: [
          "**Adding a state = editing every method.** Introduce `\"BUFFERING\"` and you must find and extend *every* switch — miss one and you have a silent bug that only shows up in that mode.",
          "**With the pattern, adding a state = adding one class.** `BufferingState` implements the interface, existing classes barely change, and the compiler tells you exactly which methods the new mode must handle. That's [[open-closed]] in action: open to new states, closed to modification of the old ones.",
          "**The branches drift apart.** Three copies of the same switch never stay in sync — someone fixes the PAUSED case in `pressPlay()` but forgets it in `pressStop()`.",
        ],
      },
      { type: "h", text: "State vs Strategy — same skeleton, different soul" },
      {
        type: "p",
        text: "Structurally, State looks *identical* to [[strategy]]: a context holding a reference to an interface, delegating calls, swapping the concrete object to change behavior. The difference is **who swaps it and when**. With Strategy, the *client* picks one algorithm up front (\"sort with quicksort\") and it rarely changes afterwards — the strategies don't know each other exist. With State, the object *transitions itself*: `PlayingState` knows about `PausedState` and actively installs it. States form a connected map of who-follows-whom; strategies are interchangeable strangers. If your objects hop between behaviors on their own as events happen, it's State. If a caller chooses one behavior and sticks with it, it's Strategy.",
      },
      { type: "h", text: "Where you'll meet it in the wild" },
      {
        type: "ul",
        items: [
          "**Order lifecycle** — `Placed → Paid → Shipped → Delivered`, where `cancel()` behaves differently (or is forbidden) in each stage.",
          "**TCP connection** — the classic GoF example: `Established`, `Listening`, `Closed`, each handling `open()`/`close()`/`send()` in its own way.",
          "**Vending machine** — `NoCoin`, `HasCoin`, `Dispensing`: pressing the button with no coin does nothing; with a coin it vends.",
          "**Document workflow** — `Draft → InReview → Published`, where `publish()` is only meaningful from certain states and `edit()` may bounce a document back to Draft.",
          "**Game character modes** — `Standing`, `Jumping`, `Ducking`: the same controller button kicks, dives, or slides depending on the character's current mode.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · One button, three behaviors",
        body: "Open the prototype and look at the glow on the StoppedState card — that's the player's current state object. Now click `⏯ pressPlay()` three times slowly. First click: StoppedState handles it, playback starts, and the glow jumps to PlayingState (watch the progress bar start moving). Second click: the *same button* now pauses, because PlayingState is answering the call. Third click: PausedState resumes. The button's label never changed — the object behind it did.",
      },
      {
        title: "02 · Transitions belong to the states",
        body: "Click `⏹ pressStop()` while PLAYING, then click it again while already STOPPED. The first press stops playback and moves the glow to StoppedState; the second is politely ignored — StoppedState decides that stopping while stopped does nothing, and no other class had to be consulted. Read the explain line each time: it always names *which state class* handled the call and *which state it handed over to*. That's the transition logic living inside the states.",
      },
      {
        title: "03 · See the code you escaped",
        body: "Click the `🔀 switch-view` chip. The three state cards collapse into a single red `switch(state)` block — the naive version — with the branch that *would* run highlighted for the player's current state. Press `⏯ pressPlay()` a few times in this view and watch the highlight jump between cases of one big conditional. Note the caption: adding one state means editing this switch in every method. Flip back and appreciate that in the pattern view, a new state is just one new card.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "player.ts",
        code: `// One method per action the player supports.
interface State {
  pressPlay(player: Player): void;
  pressStop(player: Player): void;
  name(): string;
}

// CONTEXT — holds the current state and only delegates.
class Player {
  private current: State = new StoppedState();  // start stopped

  setState(s: State): void {
    console.log(\`   → hand over to \${s.name()}\`);
    this.current = s;
  }

  pressPlay(): void { this.current.pressPlay(this); }  // no switch!
  pressStop(): void { this.current.pressStop(this); }
}

// CONCRETE STATES — behavior AND transitions live here.
class StoppedState implements State {
  name() { return "StoppedState"; }
  pressPlay(p: Player) {
    console.log("▶ start playback from 0:00");
    p.setState(new PlayingState());     // state picks the next state
  }
  pressStop(_p: Player) {
    console.log("⏹ already stopped — nothing to do");
  }
}

class PlayingState implements State {
  name() { return "PlayingState"; }
  pressPlay(p: Player) {
    console.log("⏸ pause playback");
    p.setState(new PausedState());
  }
  pressStop(p: Player) {
    console.log("⏹ stop playback");
    p.setState(new StoppedState());
  }
}

class PausedState implements State {
  name() { return "PausedState"; }
  pressPlay(p: Player) {
    console.log("▶ resume playback");
    p.setState(new PlayingState());
  }
  pressStop(p: Player) {
    console.log("⏹ stop playback");
    p.setState(new StoppedState());
  }
}

const player = new Player();
player.pressPlay();  // ▶ start   (StoppedState answered)
player.pressPlay();  // ⏸ pause   (PlayingState answered)
player.pressPlay();  // ▶ resume  (PausedState answered)
player.pressStop();  // ⏹ stop    (PlayingState answered)`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Player.java",
        code: `// One method per action the player supports.
interface State {
    void pressPlay(Player player);
    void pressStop(Player player);
}

// CONTEXT — holds the current state and only delegates.
class Player {
    private State current = new StoppedState();  // start stopped

    void setState(State s) { this.current = s; }

    public void pressPlay() { current.pressPlay(this); }  // no switch!
    public void pressStop() { current.pressStop(this); }
}

// CONCRETE STATES — behavior AND transitions live here.
class StoppedState implements State {
    public void pressPlay(Player p) {
        System.out.println("▶ start playback from 0:00");
        p.setState(new PlayingState());   // state picks the next state
    }
    public void pressStop(Player p) {
        System.out.println("⏹ already stopped — nothing to do");
    }
}

class PlayingState implements State {
    public void pressPlay(Player p) {
        System.out.println("⏸ pause playback");
        p.setState(new PausedState());
    }
    public void pressStop(Player p) {
        System.out.println("⏹ stop playback");
        p.setState(new StoppedState());
    }
}

class PausedState implements State {
    public void pressPlay(Player p) {
        System.out.println("▶ resume playback");
        p.setState(new PlayingState());
    }
    public void pressStop(Player p) {
        System.out.println("⏹ stop playback");
        p.setState(new StoppedState());
    }
}

// Player player = new Player();
// player.pressPlay();  // ▶ start   (StoppedState answered)
// player.pressPlay();  // ⏸ pause   (PlayingState answered)
// player.pressPlay();  // ▶ resume  (PausedState answered)`,
      },
      {
        label: "Python",
        language: "python",
        filename: "player.py",
        code: `from abc import ABC, abstractmethod


class State(ABC):
    """One method per action the player supports."""

    @abstractmethod
    def press_play(self, player: "Player") -> None: ...

    @abstractmethod
    def press_stop(self, player: "Player") -> None: ...


class Player:
    """CONTEXT — holds the current state and only delegates."""

    def __init__(self) -> None:
        self.current: State = StoppedState()   # start stopped

    def set_state(self, s: State) -> None:
        self.current = s

    def press_play(self) -> None:              # no switch!
        self.current.press_play(self)

    def press_stop(self) -> None:
        self.current.press_stop(self)


# CONCRETE STATES — behavior AND transitions live here.
class StoppedState(State):
    def press_play(self, p: Player) -> None:
        print("▶ start playback from 0:00")
        p.set_state(PlayingState())            # state picks the next state

    def press_stop(self, p: Player) -> None:
        print("⏹ already stopped — nothing to do")


class PlayingState(State):
    def press_play(self, p: Player) -> None:
        print("⏸ pause playback")
        p.set_state(PausedState())

    def press_stop(self, p: Player) -> None:
        print("⏹ stop playback")
        p.set_state(StoppedState())


class PausedState(State):
    def press_play(self, p: Player) -> None:
        print("▶ resume playback")
        p.set_state(PlayingState())

    def press_stop(self, p: Player) -> None:
        print("⏹ stop playback")
        p.set_state(StoppedState())


player = Player()
player.press_play()   # ▶ start   (StoppedState answered)
player.press_play()   # ⏸ pause   (PlayingState answered)
player.press_play()   # ▶ resume  (PausedState answered)
player.press_stop()   # ⏹ stop    (PlayingState answered)`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "player.cpp",
        code: `#include <iostream>
#include <memory>

class Player;  // forward declaration

// One method per action the player supports.
class State {
public:
    virtual ~State() = default;
    virtual void pressPlay(Player& p) = 0;
    virtual void pressStop(Player& p) = 0;
};

// CONTEXT — holds the current state and only delegates.
class Player {
    std::unique_ptr<State> current;            // owns the current state
public:
    Player();                                  // starts stopped (see below)
    void setState(std::unique_ptr<State> s) { current = std::move(s); }
    void pressPlay() { current->pressPlay(*this); }   // no switch!
    void pressStop() { current->pressStop(*this); }
};

// CONCRETE STATES — behavior AND transitions live here.
struct StoppedState : State {
    void pressPlay(Player& p) override;        // defined after all states
    void pressStop(Player&) override {
        std::cout << "⏹ already stopped — nothing to do\\n";
    }
};

struct PlayingState : State {
    void pressPlay(Player& p) override;
    void pressStop(Player& p) override;
};

struct PausedState : State {
    void pressPlay(Player& p) override;
    void pressStop(Player& p) override;
};

// Transitions: each state installs the next one.
void StoppedState::pressPlay(Player& p) {
    std::cout << "▶ start playback from 0:00\\n";
    p.setState(std::make_unique<PlayingState>());
}
void PlayingState::pressPlay(Player& p) {
    std::cout << "⏸ pause playback\\n";
    p.setState(std::make_unique<PausedState>());
}
void PlayingState::pressStop(Player& p) {
    std::cout << "⏹ stop playback\\n";
    p.setState(std::make_unique<StoppedState>());
}
void PausedState::pressPlay(Player& p) {
    std::cout << "▶ resume playback\\n";
    p.setState(std::make_unique<PlayingState>());
}
void PausedState::pressStop(Player& p) {
    std::cout << "⏹ stop playback\\n";
    p.setState(std::make_unique<StoppedState>());
}

Player::Player() : current(std::make_unique<StoppedState>()) {}

int main() {
    Player player;
    player.pressPlay();   // ▶ start   (StoppedState answered)
    player.pressPlay();   // ⏸ pause   (PlayingState answered)
    player.pressPlay();   // ▶ resume  (PausedState answered)
    player.pressStop();   // ⏹ stop    (PlayingState answered)
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for State when behavior follows a mode" },
      {
        type: "ul",
        items: [
          "**Behavior visibly depends on a mode that changes at runtime.** The same method call must do genuinely different things depending on the object's current condition — play/pause/resume, open/close a connection, cancel an order.",
          "**Fat conditionals on a state flag in several methods.** If you see the same `switch (this.state)` (or if/else chain) copy-pasted across three or more methods, the State pattern is the standard refactoring — each case column becomes one class.",
          "**The object has an explicit lifecycle.** Orders, documents, connections, and jobs all march through named stages with rules about which moves are legal. Encoding each stage as a class makes the legal moves explicit and the illegal ones impossible to reach.",
          "**You already drew it.** If the design phase produced a [[state-diagrams]] chart, the State pattern is the most direct translation: one class per circle, one `setState` call per arrow.",
        ],
      },
      { type: "h", text: "When NOT to use it" },
      {
        type: "ul",
        items: [
          "**Two trivial states — a boolean is fine.** A checkbox that's checked or not, a modal that's open or closed: `if (this.isOpen)` in one or two places is clearer than four classes. State earns its keep at roughly three-plus states or three-plus methods that branch on the mode.",
          "**The branching lives in exactly one method.** A single `switch` in a single function isn't a smell — it's just a switch. The pattern pays off when the *same* branching is duplicated across many methods.",
          "**States never transition at runtime.** If the 'mode' is picked once at construction and never changes, what you want is probably [[strategy]] (or plain configuration), not State.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Adding a new state means adding one new class — existing states and the context stay untouched, instead of editing every switch in every method ([[open-closed]]).",
        "All behavior for one mode lives in one file — to understand what the player does while paused, you read PausedState and nothing else.",
        "Transitions are explicit and enforced — each state names exactly which states can follow it, so illegal moves (shipping a cancelled order) have nowhere to hide.",
        "The context shrinks to almost nothing — Player becomes a thin delegator with no branching, which makes it trivially easy to read and test.",
      ],
      cons: [
        "Class count explodes for small problems — three modes and two actions already means one interface plus three classes where a couple of ifs once lived.",
        "The transition map gets scattered — with many states, 'who hands over to whom' is spread across every state class, and no single file shows the whole picture (keep the state diagram nearby).",
        "States often need access to the context's internals — passing the player into every call, or letting states poke its fields, can force you to widen its public surface.",
        "Object churn if you `new` a state per transition — usually negligible, but hot paths often share stateless singleton instances of each state instead.",
      ],
    },

    furtherReading: [
      {
        label: "State — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/state",
        note: "The clearest illustrated walkthrough: the media-player-style problem, the Context/State/ConcreteState structure, and a careful section on how State differs from Strategy. Best first read.",
        kind: "article",
      },
      {
        label: "State pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/State_pattern",
        note: "Concise reference with UML structure and multi-language examples, including the classic Java media-player-style implementation with transitions inside the states.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book. Its State chapter uses the famous TCPConnection example — Established, Listening, Closed as classes — the primary source for the pattern's intent.",
        kind: "book",
      },
      {
        label: "State — Game Programming Patterns (Robert Nystrom)",
        href: "https://gameprogrammingpatterns.com/state.html",
        note: "A free, wonderfully written chapter that grows the pattern from raw if-chains to finite state machines, using a game character (standing/jumping/ducking) as the running example.",
        kind: "book",
      },
      {
        label: "Replace Type Code with State/Strategy — Refactoring.Guru",
        href: "https://refactoring.guru/replace-type-code-with-state-strategy",
        note: "The step-by-step refactoring recipe for turning an existing switch-on-a-flag class into the State pattern — exactly the migration you'd perform on the naive player.",
        kind: "article",
      },
      {
        label: "Finite-state machine — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Finite-state_machine",
        note: "The theory underneath: states, events, and transitions as a formal model. Useful background for recognizing when a lifecycle is really a state machine wanting to be born.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "state-q1",
        question: "What is the core intent of the State pattern?",
        options: [
          { id: "a", label: "Let an object change its behavior when its internal state changes, by delegating to a state object instead of switching on a flag." },
          { id: "b", label: "Guarantee a class has exactly one instance with a global access point." },
          { id: "c", label: "Convert one interface into another so incompatible classes can work together." },
          { id: "d", label: "Notify many dependent objects automatically when one object changes." },
        ],
        correctOptionId: "a",
        explanation:
          "State makes an object appear to change its class: the same pressPlay() starts, pauses, or resumes depending on which state object currently sits inside the player. Option (b) is Singleton, (c) is Adapter, and (d) is Observer.",
      },
      {
        id: "state-q2",
        question: "In the music-player example, where does the decision 'after playing, the next state is paused' live?",
        options: [
          { id: "a", label: "Inside PlayingState — its pressPlay() calls player.setState(new PausedState())." },
          { id: "b", label: "Inside the Player class, in a big switch over all states." },
          { id: "c", label: "In the client code that created the player." },
          { id: "d", label: "In a global transitions table that every class reads." },
        ],
        correctOptionId: "a",
        explanation:
          "A defining feature of the State pattern is that transitions live inside the concrete states: each state performs its behavior and then installs the next state itself. The context (Player) just delegates — it holds no branching and makes no transition decisions.",
      },
      {
        id: "state-q3",
        question: "Your player uses `switch (this.state)` inside pressPlay(), pressStop(), and pressNext(). What happens when you add a new BUFFERING state — before and after applying the State pattern?",
        options: [
          { id: "a", label: "Before: you must find and edit every switch in every method. After: you add one BufferingState class and existing classes barely change." },
          { id: "b", label: "Before and after are the same amount of work — the pattern only renames things." },
          { id: "c", label: "Before: nothing changes. After: you must edit every existing state class." },
          { id: "d", label: "The pattern makes adding states impossible, which is the point — it freezes the design." },
        ],
        correctOptionId: "a",
        explanation:
          "That is exactly the smell State cures. With flag-and-switch code, each new state means extending the same conditional in every method — miss one and you get a silent bug. With states as classes, a new mode is one new class implementing the interface, an Open/Closed-style extension.",
      },
      {
        id: "state-q4",
        question: "State and Strategy have nearly identical structure — a context delegating to an interface. What is the key difference?",
        options: [
          { id: "a", label: "In Strategy the client picks one algorithm and it rarely changes; in State the object transitions itself and states know about each other." },
          { id: "b", label: "Strategy uses inheritance while State uses composition." },
          { id: "c", label: "State can only have two states, while Strategy supports any number of algorithms." },
          { id: "d", label: "There is no difference — they are two names for the same pattern." },
        ],
        correctOptionId: "a",
        explanation:
          "The skeleton is the same; the soul differs. Strategies are interchangeable strangers chosen by the caller (sort with quicksort) that rarely swap at runtime. States form a connected map: PlayingState knows PausedState exists and actively installs it when pressPlay() is called — the object drives its own transitions as events happen.",
      },
      {
        id: "state-q5",
        question: "Which situation is a poor fit for the State pattern?",
        options: [
          { id: "a", label: "A modal dialog that is simply open or closed, checked in one place — a boolean flag covers it." },
          { id: "b", label: "An order lifecycle (Placed → Paid → Shipped → Delivered) where cancel() behaves differently in each stage." },
          { id: "c", label: "A TCP connection whose open(), close(), and send() depend on whether it is Established, Listening, or Closed." },
          { id: "d", label: "A document workflow where publish() is only legal from the InReview state." },
        ],
        correctOptionId: "a",
        explanation:
          "Two trivial states consulted in one or two places don't justify an interface plus a family of classes — a boolean is clearer. The pattern earns its keep when there are several states, several methods branching on the mode, or an explicit lifecycle with transition rules, as in the other three options.",
      },
    ],
  },
};
