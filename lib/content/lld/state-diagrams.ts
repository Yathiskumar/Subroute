import type { RoadmapLesson } from "@/lib/content/types";

export const stateDiagrams: RoadmapLesson = {
  title: "State Diagrams",
  oneLiner:
    "A state diagram shows every situation one object can be in over its life, and which events move it from one to the next. It is the picture that spells out the legal lifecycle — and catches the illegal jumps.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/state-diagrams.html",
  content: {
    prototypeCaption:
      "A clean state diagram for an **Order**: `Placed → Paid → Shipped → Delivered`, with `Cancelled` off to the side. The current state glows. Press an event button — `pay`, `ship`, `deliver`, `cancel` — and watch what happens. A **legal** event slides the highlight to the next state and the panel explains the move; an **illegal** event refuses to move and tells you exactly why (\"you can't ship an order that isn't paid yet\"). One fixed note panel, replaced each click, so nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "A **state diagram** (also called a *state machine* or *statechart*) is a picture of the different *situations* one object can be in over its lifetime — and the *events* that move it from one situation to the next. Each situation is a **state**; each move is a **transition**. That's the whole idea: states are the dots, events are the arrows between them.",
      },
      {
        type: "p",
        text: "Think of a **traffic light**. It is always in exactly one state — `Red`, `Green`, or `Yellow` — and it can only move along set paths: `Red → Green → Yellow → Red`. It can never jump straight from `Red` to `Yellow`. Or think of an **online order**: it goes `Placed → Paid → Shipped → Delivered`. You cannot ship an order that hasn't been paid for. A state diagram draws exactly those rules.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A state diagram = **states** (the situations an object can be in) joined by **transitions** (the events that move it between them). It shows the *legal* lifecycle — so any move that isn't drawn is a move that isn't allowed.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The pieces of a state diagram" },
      {
        type: "p",
        text: "A state diagram is built from just a handful of symbols. Once you know these five, you can read any state diagram. Here is an order's life drawn out:",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An Order state machine: an initial dot leads into Placed; pay() goes to Paid; ship() goes to Shipped; deliver() goes to the final state Delivered. cancel() arrows drop from both Placed and Paid down to the final state Cancelled.">
  <defs>
    <marker id="st-arrow" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <!-- initial state: small filled circle, arrow into Placed -->
  <circle cx="24" cy="55" r="6" fill="#e8e4dc"/>
  <line x1="30" y1="55" x2="54" y2="55" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#st-arrow)"/>

  <!-- top row of states -->
  <g>
    <rect x="58" y="35" width="100" height="40" rx="9" fill="#14161a" stroke="#3a414c"/>
    <text x="108" y="60" text-anchor="middle" font-size="14" fill="#e8e4dc">Placed</text>

    <rect x="248" y="35" width="100" height="40" rx="9" fill="#14161a" stroke="#3a414c"/>
    <text x="298" y="60" text-anchor="middle" font-size="14" fill="#e8e4dc">Paid</text>

    <rect x="438" y="35" width="100" height="40" rx="9" fill="#14161a" stroke="#3a414c"/>
    <text x="488" y="60" text-anchor="middle" font-size="14" fill="#e8e4dc">Shipped</text>

    <!-- Delivered: final state — double border ring -->
    <rect x="616" y="31" width="100" height="48" rx="11" fill="none" stroke="#fb863a" stroke-width="1.2"/>
    <rect x="620" y="35" width="92" height="40" rx="9" fill="#14161a" stroke="#3a414c"/>
    <text x="666" y="60" text-anchor="middle" font-size="14" fill="#e8e4dc">Delivered</text>
    <text x="666" y="98" text-anchor="middle" font-size="11" fill="#9099a8">◉ final state</text>
  </g>

  <!-- transitions across the top row -->
  <g stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#st-arrow)">
    <line x1="158" y1="55" x2="244" y2="55"/>
    <line x1="348" y1="55" x2="434" y2="55"/>
    <line x1="538" y1="55" x2="612" y2="55"/>
  </g>
  <g font-size="12.5" fill="#9099a8" text-anchor="middle">
    <text x="201" y="47">pay()</text>
    <text x="391" y="47">ship()</text>
    <text x="575" y="47">deliver()</text>
  </g>

  <!-- Cancelled: final state below, with double-border ring -->
  <rect x="226" y="226" width="244" height="48" rx="11" fill="none" stroke="#fb863a" stroke-width="1.2"/>
  <rect x="230" y="230" width="236" height="40" rx="9" fill="#14161a" stroke="#3a414c"/>
  <text x="348" y="255" text-anchor="middle" font-size="14" fill="#e8e4dc">Cancelled</text>
  <text x="348" y="291" text-anchor="middle" font-size="11" fill="#9099a8">◉ final state</text>

  <!-- cancel() transitions down from Placed and Paid -->
  <g stroke="#d8d3c9" stroke-width="1.6" fill="none" marker-end="url(#st-arrow)">
    <path d="M108,75 L108,180 Q108,192 120,192 L278,192 Q290,192 290,204 L290,222"/>
    <path d="M310,75 L310,150 Q310,162 322,162 L388,162 Q400,162 400,174 L400,222"/>
  </g>
  <g font-size="12.5" fill="#9099a8">
    <text x="116" y="135">cancel()</text>
    <text x="324" y="123">cancel()</text>
  </g>
</svg>`,
        caption:
          "Each box is a *state*; each arrow is a *transition* triggered by an event like `pay()`. ● is where life starts and ◉ marks a final state (`Delivered`, `Cancelled`) — and notice there's no arrow for an illegal move, so you can't `ship()` an order that isn't `Paid` yet.",
      },
      { type: "h", text: "State — a rounded rectangle" },
      {
        type: "p",
        text: "A **state** is a *situation the object is currently in*. It is drawn as a rounded rectangle with a name inside, like `Paid`. At any moment the object is in exactly **one** state. The name describes a condition, not an action — `Shipped`, not `ship`.",
      },
      { type: "h", text: "Initial state — a filled black circle" },
      {
        type: "p",
        text: "The **initial state** is a small filled black circle ● with an arrow pointing into the first real state. It marks where the object's life begins. An order's life begins at `Placed`. There is exactly one initial marker per diagram.",
      },
      { type: "h", text: "Transition — a labelled arrow" },
      {
        type: "p",
        text: "A **transition** is an arrow from one state to another, labelled with what causes the move. The full label reads `event [guard] / action`:",
      },
      {
        type: "ul",
        items: [
          "**event** — the trigger that fires the move, e.g. `pay()`. This is the part you almost always see.",
          "**[guard]** — an optional condition in square brackets that must be true for the move to happen, e.g. `pay() [funds ok]`. If the guard is false, the transition does not fire.",
          "**/ action** — an optional thing the object *does* as it moves, e.g. `pay() / sendReceipt`.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "How to read one transition",
        text: "Read an arrow as *“when **event** happens, and **[guard]** is true, move to the next state and do **action**.”* So `Placed ──pay() [funds ok] / chargeCard──▶ Paid` means: *“in Placed, when pay() happens and funds are ok, charge the card and move to Paid.”*",
      },
      { type: "h", text: "Final state — a filled circle with a ring" },
      {
        type: "p",
        text: "The **final state** is a filled circle inside a ring ◉ (a 'bullseye'). It means the object has reached the end of its life — there are no transitions out of it. An order is finished once it is `Delivered` or `Cancelled`. A diagram can have several final states.",
      },
      { type: "h", text: "Illegal events are simply ignored" },
      {
        type: "p",
        text: "This is the most important idea. If an event happens and there is **no transition drawn for it** from the current state, that event is **illegal** — it is ignored, or it raises an error. You *cannot* ship an order that is still `Placed`, because no `ship()` arrow leaves `Placed`. The diagram is a contract: only the drawn moves are allowed.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The whole point: prevent invalid jumps",
        text: "A state diagram captures the **legal lifecycle**. Its real value is showing the moves that *aren't* allowed. If `ship()` doesn't have an arrow out of `Placed`, then shipping an unpaid order is impossible — the diagram caught the bug before any code was written.",
      },
      { type: "h", text: "Two finishing touches" },
      {
        type: "ul",
        items: [
          "**Self-transition** — an arrow that leaves a state and loops back to the *same* state, e.g. a connection that handles a `retry()` without changing state. It re-runs the entry/exit work but stays put.",
          "**Entry / exit actions** — work done *every time* you enter or leave a state, written inside the box as `entry / lockSeat` or `exit / unlockSeat`. Handy when many transitions share the same setup or cleanup.",
          "**Composite (nested) state** — a state that contains its own little state diagram inside it. `Shipped` might hold sub-states `InTransit` and `OutForDelivery`. Use it to hide detail until you need it.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Drive a legal path",
        body: "Open the prototype. The current state is `Placed`. Click `pay`, then `ship`, then `deliver` — one at a time. Watch the highlight walk `Placed → Paid → Shipped → Delivered` and read each note as it appears. You just drove the object along its *legal* lifecycle, one transition at a time.",
      },
      {
        title: "02 · Try an illegal jump",
        body: "Hit **Reset** to go back to `Placed`. Now click `ship` first. The highlight does NOT move — the panel tells you why: there is no `ship()` transition out of `Placed`, so the event is blocked. This is exactly what a state diagram protects you from: shipping an order that was never paid for.",
      },
      {
        title: "03 · Reach a final state, then poke it",
        body: "Drive the order all the way to `Delivered` (or click `cancel` from any non-final state to reach `Cancelled`). Now try clicking any event. Nothing moves — a final state ◉ has no transitions out of it. The object's life is over. Notice how the reachable buttons shrink as you progress: that *is* the lifecycle narrowing.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "order.ts",
        code: `// Each diagram arrow becomes a guarded method. The state is the single source of truth.
type State = "Placed" | "Paid" | "Shipped" | "Delivered" | "Cancelled";

class Order {
  private state: State = "Placed"; // ● initial state → Placed

  // Placed ──pay()──▶ Paid
  pay(): void {
    if (this.state !== "Placed") throw new Error("can only pay a Placed order");
    this.state = "Paid";
  }

  // Paid ──ship()──▶ Shipped   (no ship() arrow leaves Placed → illegal)
  ship(): void {
    if (this.state !== "Paid") throw new Error("can only ship a Paid order");
    this.state = "Shipped";
  }

  // Shipped ──deliver()──▶ Delivered ◉
  deliver(): void {
    if (this.state !== "Shipped") throw new Error("can only deliver a Shipped order");
    this.state = "Delivered";
  }

  // Placed/Paid ──cancel()──▶ Cancelled ◉   (final states can't be cancelled)
  cancel(): void {
    if (this.state === "Delivered" || this.state === "Cancelled")
      throw new Error("order already finished");
    this.state = "Cancelled";
  }

  current(): State { return this.state; }
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Order.java",
        code: `// Each diagram arrow becomes a guarded method. The enum is the single source of truth.
enum State { PLACED, PAID, SHIPPED, DELIVERED, CANCELLED }

class Order {
    private State state = State.PLACED; // ● initial state -> Placed

    // Placed --pay()--> Paid
    void pay() {
        if (state != State.PLACED) throw new IllegalStateException("can only pay a Placed order");
        state = State.PAID;
    }

    // Paid --ship()--> Shipped   (no ship() arrow leaves Placed -> illegal)
    void ship() {
        if (state != State.PAID) throw new IllegalStateException("can only ship a Paid order");
        state = State.SHIPPED;
    }

    // Shipped --deliver()--> Delivered (final)
    void deliver() {
        if (state != State.SHIPPED) throw new IllegalStateException("can only deliver a Shipped order");
        state = State.DELIVERED;
    }

    // Placed/Paid --cancel()--> Cancelled (final)
    void cancel() {
        if (state == State.DELIVERED || state == State.CANCELLED)
            throw new IllegalStateException("order already finished");
        state = State.CANCELLED;
    }

    State current() { return state; }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "order.py",
        code: `# Each diagram arrow becomes a guarded method. The state is the single source of truth.
from enum import Enum, auto


class State(Enum):
    PLACED = auto()
    PAID = auto()
    SHIPPED = auto()
    DELIVERED = auto()
    CANCELLED = auto()


class Order:
    def __init__(self) -> None:
        self.state = State.PLACED  # initial state -> Placed

    # Placed --pay()--> Paid
    def pay(self) -> None:
        if self.state is not State.PLACED:
            raise ValueError("can only pay a Placed order")
        self.state = State.PAID

    # Paid --ship()--> Shipped   (no ship() arrow leaves Placed -> illegal)
    def ship(self) -> None:
        if self.state is not State.PAID:
            raise ValueError("can only ship a Paid order")
        self.state = State.SHIPPED

    # Shipped --deliver()--> Delivered (final)
    def deliver(self) -> None:
        if self.state is not State.SHIPPED:
            raise ValueError("can only deliver a Shipped order")
        self.state = State.DELIVERED

    # Placed/Paid --cancel()--> Cancelled (final)
    def cancel(self) -> None:
        if self.state in (State.DELIVERED, State.CANCELLED):
            raise ValueError("order already finished")
        self.state = State.CANCELLED`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "order.cpp",
        code: `// Each diagram arrow becomes a guarded method. The enum is the single source of truth.
#include <stdexcept>

enum class State { Placed, Paid, Shipped, Delivered, Cancelled };

class Order {
    State state = State::Placed; // initial state -> Placed

public:
    // Placed --pay()--> Paid
    void pay() {
        if (state != State::Placed) throw std::logic_error("can only pay a Placed order");
        state = State::Paid;
    }

    // Paid --ship()--> Shipped   (no ship() arrow leaves Placed -> illegal)
    void ship() {
        if (state != State::Paid) throw std::logic_error("can only ship a Paid order");
        state = State::Shipped;
    }

    // Shipped --deliver()--> Delivered (final)
    void deliver() {
        if (state != State::Shipped) throw std::logic_error("can only deliver a Shipped order");
        state = State::Delivered;
    }

    // Placed/Paid --cancel()--> Cancelled (final)
    void cancel() {
        if (state == State::Delivered || state == State::Cancelled)
            throw std::logic_error("order already finished");
        state = State::Cancelled;
    }

    State current() const { return state; }
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for a state diagram" },
      {
        type: "p",
        text: "Draw one whenever an object has a *clear lifecycle with rules* — a set of stages it moves through, where some moves are allowed and others are not. The moment you hear yourself saying *“you can't do X until Y has happened,”* you have a state machine on your hands and a state diagram will make those rules obvious.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Good candidates",
        text: "Orders (`Placed → Paid → Shipped → Delivered`), payments (`Pending → Authorized → Captured / Failed`), documents (`Draft → Review → Published`), connection/session status (`Connecting → Open → Closed`), UI workflows (wizard steps), and game entities (`Idle → Walking → Jumping`). State diagrams are brilliant for spotting illegal transitions *early*, before they become bugs.",
      },
    ],

    tradeoffs: {
      pros: [
        "Makes the legal lifecycle explicit — everyone can see at a glance which moves are allowed and which aren't.",
        "Catches invalid transitions early (shipping an unpaid order) before they sneak into code as bugs.",
        "Maps almost one-to-one to a clean implementation: one state enum plus one guarded method per event.",
        "Far clearer than a tangle of `if`/`boolean` flags for describing 'what state is this thing in?'",
      ],
      cons: [
        "Only models one object's lifecycle at a time — it doesn't show how objects collaborate (that's a sequence diagram).",
        "Blows up fast: many states × many events can produce a dense, hard-to-read diagram (composite states help).",
        "Easy to forget transitions, leaving gaps where an event silently does nothing.",
        "Overkill for objects that don't really have stages — not every class is a state machine.",
      ],
    },

    furtherReading: [
      {
        label: "UML State Machine Diagrams — UML-Diagrams.org reference",
        href: "https://www.uml-diagrams.org/state-machine-diagrams.html",
        note: "The complete plain reference: states, initial/final pseudostates, transitions, guards, entry/exit actions, composite states. Your lookup sheet.",
        kind: "docs",
      },
      {
        label: "UML State Machine Diagram Tutorial — Visual Paradigm",
        href: "https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-state-machine-diagram-tutorial/",
        note: "A friendly, example-led walkthrough that builds a state diagram step by step — a great second read after this lesson.",
        kind: "article",
      },
      {
        label: "State Machine Diagrams — GeeksforGeeks",
        href: "https://www.geeksforgeeks.org/unified-modeling-language-uml-state-diagrams/",
        note: "Short, example-heavy notes with diagrams for states, transitions, and guards — handy for quick interview revision.",
        kind: "article",
      },
      {
        label: "UML Distilled — Martin Fowler",
        note: "The classic short UML book. Its chapter on state machine diagrams is the clearest few pages on the topic; Fowler's whole point is to use just enough notation to communicate.",
        kind: "book",
      },
      {
        label: "State Pattern — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/state",
        note: "The design pattern that turns a state diagram into clean code: each state becomes its own object. The next step once you can read the diagram.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "state-diagrams-q1",
        question: "In a state diagram, what does a single rounded rectangle represent?",
        options: [
          { id: "a", label: "A state — a situation the object is currently in, like `Paid`." },
          { id: "b", label: "An event that moves the object between situations." },
          { id: "c", label: "A method call on another object." },
          { id: "d", label: "The end of the object's life." },
        ],
        correctOptionId: "a",
        explanation:
          "A rounded rectangle is a state — one of the situations the object can be in, such as `Placed` or `Paid`. At any moment the object is in exactly one state. The events that move between states are drawn as labelled arrows, not boxes.",
      },
      {
        id: "state-diagrams-q2",
        question: "An order is in the `Placed` state. There is no `ship()` transition drawn out of `Placed`. What does this tell you?",
        options: [
          { id: "a", label: "Shipping a `Placed` order is illegal — the event is ignored or raises an error." },
          { id: "b", label: "The order will automatically move to `Shipped` anyway." },
          { id: "c", label: "The diagram is incomplete and the move should be allowed." },
          { id: "d", label: "`Placed` is a final state." },
        ],
        correctOptionId: "a",
        explanation:
          "If no transition is drawn for an event from the current state, that event is illegal: it's ignored or raises an error. No `ship()` arrow leaves `Placed`, so you cannot ship an order that hasn't been paid for. Only the drawn moves are allowed — that's the whole value of the diagram.",
      },
      {
        id: "state-diagrams-q3",
        question: "On a transition labelled `pay() [funds ok] / chargeCard`, what is the role of `[funds ok]`?",
        options: [
          { id: "a", label: "A guard — a condition that must be true for the transition to fire." },
          { id: "b", label: "The name of the next state." },
          { id: "c", label: "An action that always runs when the event happens." },
          { id: "d", label: "The initial state marker." },
        ],
        correctOptionId: "a",
        explanation:
          "The part in square brackets is a guard: an optional condition that must be true for the transition to happen. The full label reads `event [guard] / action`. Here, `pay()` only moves the order to `Paid` if `funds ok` is true; the action `chargeCard` runs as it moves.",
      },
      {
        id: "state-diagrams-q4",
        question: "What does a filled circle inside a ring ◉ mean in a state diagram?",
        options: [
          { id: "a", label: "A final state — the object has finished its life and has no transitions out." },
          { id: "b", label: "The initial state where the object's life begins." },
          { id: "c", label: "A self-transition that loops back to the same state." },
          { id: "d", label: "A composite state with sub-states inside." },
        ],
        correctOptionId: "a",
        explanation:
          "The 'bullseye' ◉ is the final state: the object has reached the end of its life and there are no transitions leaving it. (The plain filled circle ● is the initial state.) An order is finished once it reaches `Delivered` or `Cancelled`.",
      },
      {
        id: "state-diagrams-q5",
        question: "Which question is a state diagram best at answering?",
        options: [
          { id: "a", label: "What stages can this one object move through, and which moves are legal?" },
          { id: "b", label: "In what order do several objects send messages to handle a request?" },
          { id: "c", label: "What classes exist and how are they related?" },
          { id: "d", label: "Where do the system's modules run in production?" },
        ],
        correctOptionId: "a",
        explanation:
          "A state diagram models the lifecycle of a single object: the states it can be in and the legal transitions between them. The order of messages between several objects is a sequence diagram; classes and relationships are a class diagram; where modules run is a deployment diagram. Use the right diagram for the question.",
      },
    ],
  },
};
