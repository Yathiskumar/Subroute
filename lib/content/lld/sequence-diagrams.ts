import type { RoadmapLesson } from "@/lib/content/types";

export const sequenceDiagrams: RoadmapLesson = {
  title: "Sequence Diagrams",
  oneLiner:
    "A sequence diagram is the story of one request told top to bottom — who calls whom, in what order, and what comes back. Where a class diagram shows the pieces, a sequence diagram shows them talking.",
  difficulty: "beginner",
  estimatedTime: "16 min",
  prototypePath: "/prototypes/lld/sequence-diagrams.html",
  content: {
    prototypeCaption:
      "Watch one checkout request travel through five participants — `User`, `:OrderUI`, `:OrderService`, `:Payment`, `:Database` — one message at a time. Each participant has a dashed **lifeline** dropping down the page, and time flows downward. Click **Next ›** to reveal the next arrow: a solid arrow for a call, a dashed arrow for a return. An **activation bar** lights up on whoever is currently busy. The single fixed-height note explains that one message — who calls whom, and why the line looks the way it does. Nothing scrolls away or grows the page.",

    overview: [
      {
        type: "p",
        text: "A **sequence diagram** shows *how* a group of objects talk to each other to get one job done. You line the objects up across the top, drop a vertical line down from each, and then draw arrows between those lines — one arrow per message — reading from the top of the page to the bottom. The vertical position *is* the timeline: an arrow drawn higher up happens *before* an arrow drawn lower down. So the whole picture answers one question a class diagram can't: *in what order do things happen?*",
      },
      {
        type: "p",
        text: "Think of it like the transcript of a phone-call relay. Person A rings Person B and asks for something; B can't answer alone, so B rings C; C does the work and tells B; B finally tells A. If you wrote that conversation down line by line, top to bottom, you'd have a sequence diagram. The objects are the people, the arrows are the calls, and reading downward replays the conversation in the exact order it happened.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A sequence diagram = **participants across the top**, a **dashed lifeline** dropping from each, and **arrows between the lifelines** read top-to-bottom as time. A class diagram shows *what the pieces are*; a sequence diagram shows *the order they talk in*.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Participants across the top, lifelines dropping down" },
      {
        type: "p",
        text: "Every object that takes part sits in a box along the **top** of the diagram. An object is written as `:OrderService` (a colon then the type) or `order:OrderService` (a name, colon, type). A plain stick-figure on the far left is an **actor** — usually a human user. From the bottom of each box, a thin **dashed vertical line** drops straight down: that's the **lifeline**, and it represents that object existing through time. Time always flows **downward** — the higher an arrow sits, the earlier it happens.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 432" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram: User calls checkout() on OrderUI, which calls placeOrder() on OrderService, which calls charge() on Payment; dashed return arrows travel back up.">
  <defs>
    <marker id="sd-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="sd-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <!-- participant header boxes -->
  <g>
    <rect x="44" y="12" width="72" height="30" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="80" y="31" text-anchor="middle" font-size="13" fill="#e8e4dc">User</text>
    <rect x="214" y="12" width="112" height="30" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="270" y="31" text-anchor="middle" font-size="13" fill="#e8e4dc">:OrderUI</text>
    <rect x="402" y="12" width="136" height="30" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="470" y="31" text-anchor="middle" font-size="13" fill="#e8e4dc">:OrderService</text>
    <rect x="596" y="12" width="108" height="30" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="650" y="31" text-anchor="middle" font-size="13" fill="#e8e4dc">:Payment</text>
  </g>

  <!-- lifelines (dashed, drop down through time) -->
  <g stroke="#3a414c" stroke-width="1" stroke-dasharray="4 4">
    <line x1="80" y1="42" x2="80" y2="414"/>
    <line x1="270" y1="42" x2="270" y2="414"/>
    <line x1="470" y1="42" x2="470" y2="414"/>
    <line x1="650" y1="42" x2="650" y2="414"/>
  </g>

  <!-- activation bars ("busy") -->
  <g fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)" stroke-width="1">
    <rect x="264.5" y="92" width="11" height="272" rx="2"/>
    <rect x="464.5" y="152" width="11" height="150" rx="2"/>
    <rect x="644.5" y="212" width="11" height="44" rx="2"/>
  </g>

  <!-- time-flows-down hint -->
  <text x="712" y="70" text-anchor="end" font-size="11" fill="#6b7280">time ↓</text>

  <!-- call messages (solid line, filled arrowhead) -->
  <g stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#sd-call)">
    <line x1="82" y1="92" x2="262" y2="92"/>
    <line x1="277" y1="152" x2="462" y2="152"/>
    <line x1="477" y1="212" x2="642" y2="212"/>
  </g>
  <g font-size="12.5" fill="#e8e4dc" text-anchor="middle">
    <text x="172" y="84">checkout()</text>
    <text x="372" y="144">placeOrder()</text>
    <text x="560" y="204">charge()</text>
  </g>

  <!-- return messages (dashed line, open arrowhead) -->
  <g stroke="#9099a8" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#sd-ret)">
    <line x1="643" y1="252" x2="478" y2="252"/>
    <line x1="463" y1="302" x2="278" y2="302"/>
    <line x1="262" y1="362" x2="83" y2="362"/>
  </g>
  <g font-size="11" fill="#9099a8" text-anchor="middle" font-style="italic">
    <text x="560" y="245">return</text>
    <text x="370" y="295">return</text>
    <text x="172" y="355">return</text>
  </g>
</svg>`,
        caption:
          "Time flows **downward** — the higher an arrow, the earlier it happens. A **solid line + filled arrowhead** is a call (`checkout()` → `placeOrder()` → `charge()`); a **dashed line + open arrowhead** is the reply travelling back. The **orange bars** show which object is *busy* handling work right now.",
      },
      { type: "h", text: "A message is an arrow from caller to callee" },
      {
        type: "p",
        text: "The heart of the diagram is the **message**: an arrow drawn from the lifeline of the object that *makes* the call to the lifeline of the object that *receives* it. The label on the arrow is the method being called, e.g. `placeOrder()`. Read every arrow the same way: *left end is who's calling, the arrowhead points at who's being asked to do the work.*",
      },
      { type: "h", text: "The activation bar — \"this object is busy\"" },
      {
        type: "p",
        text: "A thin tall **rectangle** sitting on top of a lifeline is an **activation bar** (also called an *execution occurrence*). It means *this object is currently busy doing work* — its method is running. The bar starts when a message arrives and ends when that method returns. Bars stack: while `OrderService` is busy and calls `Payment`, both bars are lit at once, because `OrderService` is waiting on `Payment` to finish.",
      },
      { type: "h", text: "Two line styles: the call and the return" },
      {
        type: "p",
        text: "There are two arrows you must tell apart, and the *style* of the line carries the meaning:",
      },
      {
        type: "ul",
        items: [
          "**Synchronous call** — a **solid** line with a **filled** (solid triangle) arrowhead. The caller asks and then *waits* for the answer before doing anything else. This is an ordinary method call.",
          "**Return** — a **dashed** line with an **open** (thin, line) arrowhead, drawn *back* from callee to caller. It carries the result, e.g. `ok` or `orderId`. Returns are often left out to reduce clutter, but the dashed style always means *coming back with an answer*.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Solid vs dashed, in one breath",
        text: "**Solid line, filled head = a call going out** (someone is asking for work). **Dashed line, open head = a result coming back.** If you only remember one thing about the arrows, remember *solid goes, dashed returns.*",
      },
      { type: "h", text: "A self-call: an object asks itself" },
      {
        type: "p",
        text: "Sometimes an object calls one of its *own* methods. You draw this as an arrow that leaves the lifeline and **loops back to the same lifeline** just below — a little hook shape. The activation bar gets slightly wider (nested) to show a method calling another method on the same object. Example: `OrderService` calls its own `validate()` before charging.",
      },
      { type: "h", text: "Combined fragments: if/else, optional, and loops" },
      {
        type: "p",
        text: "Real flows have choices and repetition. UML wraps a region of messages in a labelled **box** called a *combined fragment* to show this. The label in the top-left corner tells you how to read the box. The three you'll meet most:",
      },
      {
        type: "ul",
        items: [
          "**`alt`** — an *if / else*. The box is split by a dashed divider; the top half runs when the condition (the `[guard]`) is true, the bottom half otherwise. Example: `[in stock]` ship now, `[else]` back-order.",
          "**`opt`** — *optional*. The messages inside run only **if** the guard is true, otherwise the whole box is skipped. Example: `[customer opted in]` send a marketing email.",
          "**`loop`** — *repeat*. The messages inside run again and again while the guard holds. Example: `loop [for each item]` add the item to the basket.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Keep it to one scenario",
        text: "A sequence diagram is at its best when it tells *one* clear story — the happy path of a single request. If you try to cram every branch, error, and retry into one diagram with stacks of `alt` boxes, it turns into spaghetti. Draw the main flow first; add a second small diagram for the tricky error case if you really need it.",
      },
    ],

    handsOn: [
      {
        title: "01 · Replay the request top to bottom",
        body: "Open the prototype and click **Next ›** repeatedly without reading the notes yet. Watch the arrows appear one by one, always lower than the last — that downward march *is* time. By the end you've watched a checkout travel `User → :OrderUI → :OrderService → :Payment → :Database` and the answers come back. Now click **Start over** and step through again, this time reading each note.",
      },
      {
        title: "02 · Tell a call from a return",
        body: "Step to the `charge()` message: notice it's a **solid** arrow with a filled head pointing *into* `:Payment` — a call going out. Step once more to the `ok` arrow: it's **dashed** with an open head pointing *back* to `:OrderService` — a result coming home. Say it out loud: *solid goes, dashed returns.* That single habit lets you read any sequence diagram.",
      },
      {
        title: "03 · Watch the activation bars stack",
        body: "Find the step where `:OrderService` has called `:Payment`. Both activation bars are lit at the same time. Ask yourself *why* — because `:OrderService` is **waiting** on `:Payment` to finish before it can continue. When `:Payment` returns, its bar ends but `:OrderService`'s stays lit until it returns to `:OrderUI`. Stacked bars = somebody is blocked waiting on somebody else.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "checkout-flow.ts",
        code: `// This is the code the sequence diagram draws. Each call below is one
// arrow in the diagram, top to bottom. Returns are the dashed arrows.

class OrderUI {
  constructor(private service: OrderService) {}

  // User → :OrderUI  "checkout()"   (the actor's first message)
  checkout(cart: Cart): string {
    return this.service.placeOrder(cart);   // :OrderUI → :OrderService  "placeOrder()"
  }
}

class OrderService {
  constructor(private payment: Payment, private repo: OrderRepository) {}

  placeOrder(cart: Cart): string {
    this.validate(cart);                     // self-call: :OrderService → itself  "validate()"
    const ok = this.payment.charge(cart.total); // → :Payment  "charge()" ; dashed return "ok"
    if (ok) {
      return this.repo.save(cart);           // → :Database  "save()" ; dashed return "orderId"
    }
    throw new Error("payment failed");
  }

  private validate(cart: Cart): void { /* ... */ }
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "CheckoutFlow.java",
        code: `// This is the code the sequence diagram draws. Each call below is one
// arrow in the diagram, top to bottom. Returns are the dashed arrows.

class OrderUI {
    private final OrderService service;
    OrderUI(OrderService service) { this.service = service; }

    // User -> :OrderUI  "checkout()"   (the actor's first message)
    String checkout(Cart cart) {
        return service.placeOrder(cart);        // :OrderUI -> :OrderService  "placeOrder()"
    }
}

class OrderService {
    private final Payment payment;
    private final OrderRepository repo;
    OrderService(Payment payment, OrderRepository repo) { this.payment = payment; this.repo = repo; }

    String placeOrder(Cart cart) {
        validate(cart);                          // self-call: :OrderService -> itself  "validate()"
        boolean ok = payment.charge(cart.total); // -> :Payment  "charge()" ; dashed return "ok"
        if (ok) {
            return repo.save(cart);              // -> :Database  "save()" ; dashed return "orderId"
        }
        throw new IllegalStateException("payment failed");
    }

    private void validate(Cart cart) { /* ... */ }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "checkout_flow.py",
        code: `# This is the code the sequence diagram draws. Each call below is one
# arrow in the diagram, top to bottom. Returns are the dashed arrows.


class OrderUI:
    def __init__(self, service: "OrderService") -> None:
        self._service = service

    # User -> :OrderUI  "checkout()"   (the actor's first message)
    def checkout(self, cart: "Cart") -> str:
        return self._service.place_order(cart)   # :OrderUI -> :OrderService  "placeOrder()"


class OrderService:
    def __init__(self, payment: "Payment", repo: "OrderRepository") -> None:
        self._payment = payment
        self._repo = repo

    def place_order(self, cart: "Cart") -> str:
        self._validate(cart)                     # self-call: :OrderService -> itself  "validate()"
        ok = self._payment.charge(cart.total)    # -> :Payment  "charge()" ; dashed return "ok"
        if ok:
            return self._repo.save(cart)         # -> :Database  "save()" ; dashed return "orderId"
        raise RuntimeError("payment failed")

    def _validate(self, cart: "Cart") -> None: ...`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "checkout_flow.cpp",
        code: `// This is the code the sequence diagram draws. Each call below is one
// arrow in the diagram, top to bottom. Returns are the dashed arrows.
#include <string>
#include <stdexcept>

class OrderService {
public:
    OrderService(Payment& payment, OrderRepository& repo)
        : payment_(payment), repo_(repo) {}

    std::string placeOrder(const Cart& cart) {
        validate(cart);                          // self-call: :OrderService -> itself  "validate()"
        bool ok = payment_.charge(cart.total);   // -> :Payment  "charge()" ; dashed return "ok"
        if (ok) {
            return repo_.save(cart);             // -> :Database  "save()" ; dashed return "orderId"
        }
        throw std::runtime_error("payment failed");
    }
private:
    void validate(const Cart& cart) { /* ... */ }
    Payment& payment_;
    OrderRepository& repo_;
};

class OrderUI {
public:
    explicit OrderUI(OrderService& service) : service_(service) {}

    // User -> :OrderUI  "checkout()"   (the actor's first message)
    std::string checkout(const Cart& cart) {
        return service_.placeOrder(cart);        // :OrderUI -> :OrderService  "placeOrder()"
    }
private:
    OrderService& service_;
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for a sequence diagram" },
      {
        type: "p",
        text: "Draw one whenever the interesting thing is the **order of interactions**, not the static shape: explaining how a feature works end to end, documenting an API call chain, debugging *who calls whom* in a tangled flow, or showing how several services collaborate to serve one request. If you ever catch yourself saying *“first this happens, then that, then it calls...”*, that sentence is a sequence diagram waiting to be drawn.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "In interviews: structure and behaviour are a pair",
        text: "Sequence diagrams shine when you're asked to explain a flow or an algorithm's interactions — a checkout, a login, a cache miss. Pair it with a class diagram: the **class diagram is the structure** (what the pieces are) and the **sequence diagram is the behaviour over time** (the order they talk in). Sketching both shows an interviewer you can reason about a design from both angles.",
      },
    ],

    tradeoffs: {
      pros: [
        "Makes the order of events obvious — you can literally read the flow top to bottom like a script.",
        "Exposes chatty or tangled designs: too many arrows criss-crossing means too much coupling between objects.",
        "Great teaching and review tool — a newcomer can follow one request through the whole system in seconds.",
        "Pairs perfectly with a class diagram: structure plus behaviour gives a complete picture of a design.",
      ],
      cons: [
        "Shows behaviour, not structure — it won't tell you what classes exist or how they're related (that's a class diagram).",
        "Covers one scenario at a time; capturing every branch and error needs `alt`/`opt`/`loop` boxes that quickly get busy.",
        "Goes stale fast — the message order changes the moment the code does, so detailed diagrams need re-drawing.",
        "Easy to overload — a diagram with twenty lifelines and a hundred arrows teaches nothing; keep it to the messages that matter.",
      ],
    },

    furtherReading: [
      {
        label: "UML Sequence Diagrams — UML-Diagrams.org reference",
        href: "https://www.uml-diagrams.org/sequence-diagrams.html",
        note: "The complete plain reference: lifelines, messages, activation bars, combined fragments (alt/opt/loop), and every arrow style. Bookmark it as your lookup sheet.",
        kind: "docs",
      },
      {
        label: "What is a Sequence Diagram? — Visual Paradigm guide",
        href: "https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-sequence-diagram/",
        note: "A friendly, example-led walkthrough that builds a diagram step by step and explains each notation as it appears — a great second read after this lesson.",
        kind: "article",
      },
      {
        label: "UML Distilled — Martin Fowler",
        note: "The classic short book on UML. The sequence-diagram chapter is the clearest few pages on the topic; Fowler's whole point is to use just enough notation to communicate.",
        kind: "book",
      },
      {
        label: "SequenceDiagram.org — write sequence diagrams as text",
        href: "https://sequencediagram.org/",
        note: "A free online editor where you type the messages and it draws the diagram. The fastest way to sketch one without dragging boxes around.",
        kind: "docs",
      },
      {
        label: "Mermaid — Sequence Diagram syntax",
        href: "https://mermaid.js.org/syntax/sequenceDiagram.html",
        note: "Write sequence diagrams as plain text and render them in Markdown, docs, and GitHub. Shows exactly how arrows, activations, and alt/opt/loop are expressed in code.",
        kind: "docs",
      },
      {
        label: "Unified Modeling Language (UML) | Sequence Diagrams — GeeksforGeeks",
        href: "https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/",
        note: "A concise tutorial with labelled examples — handy for quick interview revision of the notation.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "sequence-diagrams-q1",
        question: "In a sequence diagram, what does the vertical position of an arrow tell you?",
        options: [
          { id: "a", label: "When it happens — arrows higher up occur before arrows lower down (time flows downward)." },
          { id: "b", label: "How important the message is — higher means more important." },
          { id: "c", label: "Which object is private and which is public." },
          { id: "d", label: "Nothing; only the left-to-right position matters." },
        ],
        correctOptionId: "a",
        explanation:
          "Time flows down the page. An arrow drawn higher up happens earlier; an arrow lower down happens later. Reading top to bottom replays the conversation in the exact order it occurred — that ordering is the whole point of a sequence diagram.",
      },
      {
        id: "sequence-diagrams-q2",
        question: "You see a dashed line with a thin open arrowhead pointing back from `:Payment` to `:OrderService`. What is it?",
        options: [
          { id: "a", label: "A return — `:Payment` is sending its result back to the caller." },
          { id: "b", label: "A new synchronous call from `:Payment` to `:OrderService`." },
          { id: "c", label: "An inheritance relationship between the two objects." },
          { id: "d", label: "An error — dashed lines are not allowed in sequence diagrams." },
        ],
        correctOptionId: "a",
        explanation:
          "Solid goes, dashed returns. A dashed line with an open arrowhead drawn back toward the caller is a return message carrying the result (like `ok` or `orderId`). A solid line with a filled head would instead be a call going out to ask for work.",
      },
      {
        id: "sequence-diagrams-q3",
        question: "What does the thin tall rectangle (activation bar) sitting on a lifeline mean?",
        options: [
          { id: "a", label: "That object is currently busy — one of its methods is running." },
          { id: "b", label: "That object has been deleted from memory." },
          { id: "c", label: "That object is a database." },
          { id: "d", label: "That object is the actor (the human user)." },
        ],
        correctOptionId: "a",
        explanation:
          "An activation bar (execution occurrence) means the object is busy doing work — its method is executing. It starts when a message arrives and ends when that method returns. When one busy object calls another, both bars are lit at once because the caller is waiting.",
      },
      {
        id: "sequence-diagrams-q4",
        question: "A flow needs to repeat a set of messages once for every item in a cart. Which combined fragment wraps those messages?",
        options: [
          { id: "a", label: "`loop` — the messages inside repeat while the guard (e.g. `[for each item]`) holds." },
          { id: "b", label: "`alt` — an if/else split into two halves." },
          { id: "c", label: "`opt` — runs the messages at most once, only if a condition is true." },
          { id: "d", label: "`ref` — points to a class diagram." },
        ],
        correctOptionId: "a",
        explanation:
          "`loop` repeats the messages inside while its guard holds. `alt` is an if/else (two mutually exclusive halves), and `opt` runs its block at most once when a condition is true. Use the fragment that matches the control flow you're modelling.",
      },
      {
        id: "sequence-diagrams-q5",
        question: "Your teammate wants to know what classes exist and how they're related (contains, inherits). Is a sequence diagram the right tool?",
        options: [
          { id: "a", label: "No — that's structure; use a class diagram. A sequence diagram shows behaviour: the order objects send messages." },
          { id: "b", label: "Yes — sequence diagrams are the best way to show inheritance." },
          { id: "c", label: "Yes — sequence diagrams replace class diagrams entirely." },
          { id: "d", label: "No — you should use a sequence diagram only for databases." },
        ],
        correctOptionId: "a",
        explanation:
          "A sequence diagram captures behaviour over time — who calls whom and in what order. It does not show what classes exist or how they relate. For structure (containment, inheritance, multiplicity) reach for a class diagram. The two are a pair: structure plus behaviour.",
      },
    ],
  },
};
