import type { RoadmapLesson } from "@/lib/content/types";

export const useCaseDiagrams: RoadmapLesson = {
  title: "Use Case Diagrams",
  oneLiner:
    "A use case diagram is a bird's-eye picture of who uses a system and what goals they can reach with it. Stick figures (actors) on the outside, ovals (goals) on the inside, lines joining who does what — it shows the WHAT, never the how.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/use-case-diagrams.html",
  content: {
    prototypeCaption:
      "One clean diagram of an **Online Store**. A box (the *system boundary*) holds the goals as ovals — `Browse Catalog`, `Place Order`, `Make Payment`, `Track Delivery`, `Manage Products` — while stick figures outside (`Customer`, `Admin`, `Payment Gateway`) connect by plain lines to the goals they perform. A dashed `«include»` arrow shows `Place Order` always reuses `Make Payment`, and a dashed `«extend»` arrow shows the optional `Apply Coupon` adds onto `Place Order`. Click any actor, oval, or arrow — or take the guided **Tour** — and a single fixed note explains it in plain English. Nothing scrolls away or grows the page.",

    overview: [
      {
        type: "p",
        text: "A **use case diagram** is the simplest picture in UML. It answers two questions in one glance: *who uses this system?* and *what can they do with it?* The *who* are the **actors** — drawn as stick figures. The *what* are the **use cases** — the goals a user can achieve, drawn as ovals. Lines join each actor to the goals they care about. That's the whole diagram.",
      },
      {
        type: "p",
        text: "It is deliberately high-level. A use case diagram shows the **WHAT**, never the *how*. It won't tell you which classes exist, what order things happen in, or how the code works inside. It's the menu, not the kitchen.",
      },
      {
        type: "p",
        text: "Think of a **restaurant menu**. The menu lists what a customer can order — *order food*, *pay the bill*, *book a table*. It also implies who does what: a customer orders and pays, the kitchen cooks, the card machine takes payment. You can read the menu without knowing a single recipe. A use case diagram is that menu for your software: a quick, shared list of what the system offers and who it offers it to.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A use case diagram = **actors** (stick figures = who, on the outside) + **use cases** (ovals = their goals, inside the system box) joined by **lines** (who can do what). It captures the *what*, so anyone — even a non-coder — can read it and agree on what the system should do.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The four things you draw" },
      {
        type: "p",
        text: "A use case diagram has only a handful of parts, and the prototype shows all of them at once. Here's the whole vocabulary:",
      },
      {
        type: "ul",
        items: [
          "**Actor** — a *stick figure*. It's a **role** outside the system, not a specific person. An actor can be a human (a `Customer`, an `Admin`) **or another system** (a `Payment Gateway`). Same person playing two roles = two actors.",
          "**Use case** — an *oval*. It's one **goal** the system lets an actor achieve, written as a verb phrase: `Place Order`, `Track Delivery`. One oval = one goal, not one button-click.",
          "**System boundary** — the *box* drawn around all the ovals. Everything inside is what the system does; actors live outside it. The box label is the system's name, e.g. **Online Store**.",
          "**Association** — a *plain line* from an actor to a use case. It just means *“this actor performs this goal.”* No arrowheads needed.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 432" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A use case diagram for an Online Store: the Customer actor connects to Browse Catalog, Place Order and Track Delivery; the Admin actor connects to Manage Products; the external Payment Gateway actor connects to Make Payment; a dashed include arrow runs from Place Order to Make Payment.">
  <defs>
    <marker id="uc-incl" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L10,3 L1,6" fill="none" stroke="#fb863a" stroke-width="1.3"/></marker>
  </defs>

  <!-- system boundary box -->
  <rect x="208" y="36" width="392" height="372" rx="12" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="404" y="30" text-anchor="middle" font-size="14" fill="#e8e4dc">Online Store</text>

  <!-- association lines (drawn first, sit under ovals/actors) -->
  <g stroke="#9099a8" stroke-width="1.3">
    <!-- Customer -> Browse Catalog / Place Order / Track Delivery -->
    <line x1="92" y1="110" x2="290" y2="92"/>
    <line x1="92" y1="110" x2="290" y2="168"/>
    <line x1="92" y1="110" x2="294" y2="316"/>
    <!-- Admin -> Manage Products -->
    <line x1="92" y1="330" x2="300" y2="316"/>
    <!-- Payment Gateway -> Make Payment -->
    <line x1="660" y1="232" x2="486" y2="246"/>
  </g>

  <!-- dashed «include»: Place Order -> Make Payment -->
  <g stroke="#fb863a" stroke-width="1.3" stroke-dasharray="6 4" marker-end="url(#uc-incl)">
    <line x1="392" y1="190" x2="392" y2="222"/>
  </g>
  <text x="402" y="210" font-size="11" fill="#fb863a" font-style="italic">«include»</text>

  <!-- use-case ovals -->
  <g fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)" stroke-width="1.2">
    <ellipse cx="392" cy="92" rx="74" ry="22"/>
    <ellipse cx="392" cy="168" rx="74" ry="22"/>
    <ellipse cx="392" cy="246" rx="74" ry="22"/>
    <ellipse cx="392" cy="316" rx="74" ry="22"/>
    <ellipse cx="520" cy="350" rx="70" ry="22"/>
  </g>
  <g font-size="12.5" fill="#e8e4dc" text-anchor="middle">
    <text x="392" y="96">Browse Catalog</text>
    <text x="392" y="172">Place Order</text>
    <text x="392" y="250">Make Payment</text>
    <text x="392" y="320">Track Delivery</text>
    <text x="520" y="354">Manage Products</text>
  </g>

  <!-- actors (stick figures) -->
  <!-- Customer (upper left) -->
  <g stroke="#d8d3c9" stroke-width="1.6" fill="none">
    <circle cx="64" cy="86" r="9"/>
    <line x1="64" y1="95" x2="64" y2="120"/>
    <line x1="48" y1="104" x2="80" y2="104"/>
    <line x1="64" y1="120" x2="52" y2="138"/>
    <line x1="64" y1="120" x2="76" y2="138"/>
  </g>
  <text x="64" y="156" text-anchor="middle" font-size="12.5" fill="#e8e4dc">Customer</text>

  <!-- Admin (lower left) -->
  <g stroke="#d8d3c9" stroke-width="1.6" fill="none">
    <circle cx="64" cy="306" r="9"/>
    <line x1="64" y1="315" x2="64" y2="340"/>
    <line x1="48" y1="324" x2="80" y2="324"/>
    <line x1="64" y1="340" x2="52" y2="358"/>
    <line x1="64" y1="340" x2="76" y2="358"/>
  </g>
  <text x="64" y="376" text-anchor="middle" font-size="12.5" fill="#e8e4dc">Admin</text>

  <!-- Payment Gateway (right, external system) -->
  <g stroke="#d8d3c9" stroke-width="1.6" fill="none">
    <circle cx="668" cy="206" r="9"/>
    <line x1="668" y1="215" x2="668" y2="240"/>
    <line x1="652" y1="224" x2="684" y2="224"/>
    <line x1="668" y1="240" x2="656" y2="258"/>
    <line x1="668" y1="240" x2="680" y2="258"/>
  </g>
  <text x="668" y="276" text-anchor="middle" font-size="12.5" fill="#e8e4dc">Payment Gateway</text>
  <text x="668" y="292" text-anchor="middle" font-size="10.5" fill="#9099a8" font-style="italic">«external system»</text>
</svg>`,
        caption:
          "An *actor* (stick figure) is a role outside the system; an *oval* is a goal the system offers; the box is the **system boundary** labelled `Online Store`. The dashed orange arrow is `«include»` — `Place Order` always reuses `Make Payment`.",
      },
      {
        type: "callout",
        variant: "info",
        title: "How to read it",
        text: "Start at a stick figure and follow its lines into the box. Each oval you reach is a goal that actor can pursue. So `Customer ── Place Order` reads as *“a customer can place an order.”* That's it — you can read any use case diagram this way.",
      },
      { type: "h", text: "«include» — a goal that ALWAYS reuses another" },
      {
        type: "p",
        text: "Sometimes one use case *always* contains another. `Place Order` always needs `Make Payment` — you can't finish an order without paying. Instead of repeating the payment steps in every checkout, you pull them into their own use case and point at it with an **`«include»`** arrow (a dashed arrow from the base use case to the included one).",
      },
      {
        type: "ul",
        items: [
          "Read it as: *“Place Order **always includes** Make Payment.”*",
          "It's the diagram version of *“call this shared sub-routine every time.”* Reuse a common step across several use cases.",
          "The dashed arrow points **from** the bigger goal **to** the step it reuses.",
        ],
      },
      { type: "h", text: "«extend» — an OPTIONAL extra that adds on" },
      {
        type: "p",
        text: "Other times a behaviour is *optional* — it only happens under some condition. `Apply Coupon` extends `Place Order`: most orders don't use a coupon, but some do. That's an **`«extend»`** arrow (a dashed arrow pointing the *other* way — from the optional extra back to the base use case it adds onto).",
      },
      {
        type: "ul",
        items: [
          "Read it as: *“Apply Coupon **may extend** Place Order”* — it adds behaviour *sometimes*, when a condition is met.",
          "Arrow direction is the giveaway: `«include»` points **to** the reused step; `«extend»` points **back to** the base case from the optional add-on.",
          "Rule of thumb: **`«include»` = always, mandatory. `«extend»` = sometimes, optional.**",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Tell include from extend",
        text: "Ask: *does it happen every single time?* If yes, it's **`«include»`** (always reused). If it's a conditional “only if…” add-on, it's **`«extend»`**. And watch the arrowhead — include points at the part being reused; extend points back at the goal being added to.",
      },
      { type: "h", text: "Generalization — one actor is a kind of another" },
      {
        type: "p",
        text: "Actors can inherit too. A hollow-triangle arrow between two actors means *“is a kind of.”* If a `Premium Customer` is a special `Customer`, you draw `Premium Customer ──▷ Customer`, and the premium one automatically gets all the customer's use cases plus its own. Same idea as inheritance in a class diagram, just for roles.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Keep ovals at goal-level, not step-level",
        text: "The most common beginner mistake is drawing tiny steps as use cases — `Enter Email`, `Click Submit`, `Validate Password`. Those are *steps inside* a goal, not goals. A good use case is something a user would say they came to do: `Log In`, `Place Order`, `Track Delivery`. If an actor wouldn't brag “I did that today,” it's probably too small to be its own oval.",
      },
    ],

    handsOn: [
      {
        title: "01 · Read who does what",
        body: "Open the prototype. Before clicking, trace each stick figure's lines into the box. Confirm out loud: the `Customer` can browse, order, pay, and track; the `Admin` manages products; the `Payment Gateway` is an external system that takes part in `Make Payment`. Now click `Customer` and read the note — an actor is a *role*, not a named person, and it can be another system too.",
      },
      {
        title: "02 · Click an oval, then the boundary",
        body: "Click the `Place Order` oval and read why it's a *goal* (a verb phrase a user came to achieve), not a button or a step. Then click the **system boundary** box itself: everything inside is what the Online Store does; everyone outside it is an actor. That line between inside and outside is the whole point of the diagram.",
      },
      {
        title: "03 · Compare «include» and «extend»",
        body: "Click the dashed `«include»` arrow from `Place Order` to `Make Payment` — note it means *always* reused. Then click the `«extend»` arrow from `Apply Coupon` to `Place Order` — note it means *optional, only sometimes*. Watch the arrow directions: include points at the reused step; extend points back at the base goal. Or hit **Tour** and let the stepper walk you through every element in order.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "store-service.ts",
        code: `// A use case diagram isn't code — but each use case (oval) usually becomes
// one public method on the service the actors talk to. The diagram is the
// menu; this interface is that same menu, written for the compiler.

interface StoreService {
  // Customer's use cases:
  browseCatalog(): Product[];          // ≈ use case "Browse Catalog"
  placeOrder(cart: Cart): Order;       // ≈ use case "Place Order"
  makePayment(order: Order): Receipt;  // ≈ use case "Make Payment"  (included by placeOrder)
  trackDelivery(orderId: string): DeliveryStatus; // ≈ use case "Track Delivery"

  // Admin's use case — an admin-only goal maps to the Admin actor:
  manageProducts(change: ProductChange): void;     // ≈ use case "Manage Products"
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "StoreService.java",
        code: `// A use case diagram isn't code — but each use case (oval) usually becomes
// one public method on the service the actors talk to. The diagram is the
// menu; this interface is that same menu, written for the compiler.

interface StoreService {
    // Customer's use cases:
    List<Product> browseCatalog();          // ~ use case "Browse Catalog"
    Order placeOrder(Cart cart);            // ~ use case "Place Order"
    Receipt makePayment(Order order);       // ~ use case "Make Payment" (included by placeOrder)
    DeliveryStatus trackDelivery(String orderId); // ~ use case "Track Delivery"

    // Admin's use case — an admin-only goal maps to the Admin actor:
    void manageProducts(ProductChange change);     // ~ use case "Manage Products"
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "store_service.py",
        code: `# A use case diagram isn't code — but each use case (oval) usually becomes
# one public method on the service the actors talk to. The diagram is the
# menu; this protocol is that same menu, written for the type checker.
from typing import Protocol


class StoreService(Protocol):
    # Customer's use cases:
    def browse_catalog(self) -> list["Product"]: ...        # ≈ use case "Browse Catalog"
    def place_order(self, cart: "Cart") -> "Order": ...      # ≈ use case "Place Order"
    def make_payment(self, order: "Order") -> "Receipt": ... # ≈ use case "Make Payment" (included)
    def track_delivery(self, order_id: str) -> "DeliveryStatus": ...  # ≈ "Track Delivery"

    # Admin's use case — an admin-only goal maps to the Admin actor:
    def manage_products(self, change: "ProductChange") -> None: ...   # ≈ "Manage Products"`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "store_service.cpp",
        code: `// A use case diagram isn't code — but each use case (oval) usually becomes
// one public method on the service the actors talk to. The diagram is the
// menu; this pure-virtual class is that same menu, written for the compiler.
#include <string>
#include <vector>

class StoreService {
public:
    // Customer's use cases:
    virtual std::vector<Product> browseCatalog() = 0;        // ~ "Browse Catalog"
    virtual Order  placeOrder(const Cart& cart) = 0;         // ~ "Place Order"
    virtual Receipt makePayment(const Order& order) = 0;     // ~ "Make Payment" (included)
    virtual DeliveryStatus trackDelivery(const std::string& orderId) = 0; // ~ "Track Delivery"

    // Admin's use case — an admin-only goal maps to the Admin actor:
    virtual void manageProducts(const ProductChange& change) = 0;  // ~ "Manage Products"

    virtual ~StoreService() = default;
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for a use case diagram" },
      {
        type: "p",
        text: "Reach for one early, when you're still figuring out *what to build*. It shines during **requirements gathering** and **scoping**: you sit with a client or product owner, list the actors, and sketch the goals each one needs. Because it's so simple, non-technical stakeholders can read it and say *“yes, that's the system”* or *“you forgot returns.”* It's the picture you put on the whiteboard to agree on the boundary of a feature before anyone writes code.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Great for agreeing scope — not for internal logic",
        text: "Use it to agree *what* the system does and *who* it serves: requirements, scope, and shared understanding with non-coders. Don't use it to describe *how* anything works inside — the order of steps belongs in a sequence or activity diagram, and the structure belongs in a class diagram. If you find yourself drawing logic, you've picked the wrong diagram.",
      },
    ],

    tradeoffs: {
      pros: [
        "Dead simple — stick figures and ovals mean even non-technical stakeholders can read it and give feedback.",
        "Perfect for scoping: it draws a clear line (the system boundary) around what's in and what's out.",
        "Captures the full set of user goals on one page, so nothing important gets forgotten in requirements.",
        "Each oval often maps to a real feature or public API method, giving you a natural to-do list to build.",
      ],
      cons: [
        "Shows the WHAT, not the how — it can't describe steps, order, data, or any internal logic.",
        "Easy to misuse by drawing tiny steps (`Enter Email`) as use cases, which turns it into noise.",
        "`«include»` vs `«extend»` and their arrow directions trip up beginners until practised.",
        "Low detail by design, so it must be paired with other diagrams (and written use-case text) to actually build from.",
      ],
    },

    furtherReading: [
      {
        label: "UML Use Case Diagrams — UML-Diagrams.org reference",
        href: "https://www.uml-diagrams.org/use-case-diagrams.html",
        note: "The complete plain-reference for every element: actors, use cases, system boundary, include, extend, generalization. Bookmark it as your lookup sheet.",
        kind: "docs",
      },
      {
        label: "What is a Use Case Diagram? — Visual Paradigm tutorial",
        href: "https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-use-case-diagram/",
        note: "A friendly, example-led walkthrough that builds a use case diagram step by step — great as a second read after this lesson.",
        kind: "article",
      },
      {
        label: "Use Case Diagram — GeeksforGeeks",
        href: "https://www.geeksforgeeks.org/use-case-diagram/",
        note: "A compact, exam-style overview with labelled examples and a quick include-vs-extend comparison. Handy for revision.",
        kind: "article",
      },
      {
        label: "Writing Effective Use Cases — Alistair Cockburn",
        note: "The classic book on what a use case really is and how to write the text behind the oval. The diagram is the index; this teaches the content. Read it to stop drawing steps as goals.",
        kind: "book",
      },
      {
        label: "Use Case Diagram Tutorial (with examples) — Lucidchart",
        href: "https://www.lucidchart.com/pages/uml-use-case-diagram",
        note: "Clear annotated diagrams plus a short how-to-draw video, with real-world examples like ATM and online shopping.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "use-case-diagrams-q1",
        question: "In a use case diagram, what does a stick figure (an actor) represent?",
        options: [
          { id: "a", label: "A role that uses the system — a person OR another system — not a specific named individual." },
          { id: "b", label: "A specific employee, identified by name." },
          { id: "c", label: "A step the system performs internally." },
          { id: "d", label: "A class in the codebase." },
        ],
        correctOptionId: "a",
        explanation:
          "An actor is a role outside the system. It can be a human role (Customer, Admin) or another system (Payment Gateway), and it's never a single named person — the same person playing two roles counts as two actors.",
      },
      {
        id: "use-case-diagrams-q2",
        question: "What does an oval inside the system boundary represent?",
        options: [
          { id: "a", label: "A goal the system lets an actor achieve, written as a verb phrase." },
          { id: "b", label: "A single button click in the UI." },
          { id: "c", label: "A database table." },
          { id: "d", label: "The order in which operations run." },
        ],
        correctOptionId: "a",
        explanation:
          "An oval is one use case — a user-level goal like Place Order or Track Delivery. It is not a tiny step (Enter Email) or a UI button; keep ovals at the level of something a user came to accomplish.",
      },
      {
        id: "use-case-diagrams-q3",
        question: "`Place Order` always needs `Make Payment` to complete. Which relationship models this?",
        options: [
          { id: "a", label: "«include» — a dashed arrow from Place Order to Make Payment, meaning it is always reused." },
          { id: "b", label: "«extend» — because payment is optional." },
          { id: "c", label: "Generalization — Place Order is a kind of Make Payment." },
          { id: "d", label: "A plain association line, because they're just connected." },
        ],
        correctOptionId: "a",
        explanation:
          "When one use case ALWAYS reuses another, it's «include». The dashed arrow points from the base goal (Place Order) to the reused step (Make Payment). «extend» would be wrong because payment isn't optional here — every order requires it.",
      },
      {
        id: "use-case-diagrams-q4",
        question: "`Apply Coupon` only happens on some orders, when the customer has a code. How is this drawn?",
        options: [
          { id: "a", label: "«extend» — a dashed arrow from Apply Coupon back to Place Order, marking it as optional/conditional." },
          { id: "b", label: "«include» — a dashed arrow from Place Order to Apply Coupon." },
          { id: "c", label: "A composition diamond on Place Order." },
          { id: "d", label: "A separate actor called Coupon." },
        ],
        correctOptionId: "a",
        explanation:
          "Optional, conditional behaviour is «extend». The arrow points from the optional add-on (Apply Coupon) back to the base use case it adds onto (Place Order). Remember: include = always; extend = sometimes — and the arrow direction is reversed between them.",
      },
      {
        id: "use-case-diagrams-q5",
        question: "Which question is a use case diagram NOT meant to answer?",
        options: [
          { id: "a", label: "In what order do the internal steps run to complete a checkout?" },
          { id: "b", label: "Who uses the system?" },
          { id: "c", label: "What goals can each actor achieve?" },
          { id: "d", label: "What is inside the system versus outside it?" },
        ],
        correctOptionId: "a",
        explanation:
          "A use case diagram shows the WHAT — who the actors are and what goals they pursue — but never the how. The order of internal steps over time is a sequence or activity diagram's job. Use the right diagram for the question you're answering.",
      },
    ],
  },
};
