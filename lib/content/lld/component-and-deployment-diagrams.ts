import type { RoadmapLesson } from "@/lib/content/types";

export const componentAndDeploymentDiagrams: RoadmapLesson = {
  title: "Component & Deployment Diagrams",
  oneLiner:
    "These are the two 'zoom out' diagrams. A component diagram shows the big software building-blocks and the interfaces they offer and need; a deployment diagram shows the physical machines those blocks actually run on.",
  difficulty: "beginner",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/component-and-deployment-diagrams.html",
  content: {
    prototypeCaption:
      "Two views of the *same* small web app, with a toggle on top. The **Component view** draws three building-blocks — `Web UI`, `Order API`, `Database` — joined by a **lollipop** (●—, 'I offer this service') plugging into a **socket** (⊃—, 'I need this service'). The **Deployment view** redraws the same app as three machines — `Browser`, `App Server`, `DB Server` — with the real files sitting inside them and labelled network links between them. Click any piece in either view and one fixed note explains it in plain English. Only one note shows at a time, so nothing scrolls away or grows the page.",

    overview: [
      {
        type: "p",
        text: "After class and object diagrams, which zoom *in* on individual classes, these two diagrams zoom *out*. A **component diagram** shows the big software building-blocks of a system — modules or services like `Web UI`, `Order API`, `Database` — and the *interfaces* each one offers and needs. A **deployment diagram** shows the physical side: which **machines** (called nodes) your software actually runs on, and which network links connect them.",
      },
      {
        type: "p",
        text: "Think of LEGO. A **component diagram** is the picture of the *bricks and how they clip together* — which brick offers a stud and which brick needs a stud. A **deployment diagram** is the picture of *which shelves and boxes the bricks physically sit in*. Same toy, two different questions: how do the pieces connect, versus where do the pieces live.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "**Component diagram = the logical pieces and how they plug together** (a brick offers a stud, another brick needs it). **Deployment diagram = the physical machines those pieces run on and the wires between them.** Component answers *what connects to what*; deployment answers *where does it run*.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Component diagram: the building-blocks" },
      {
        type: "p",
        text: "A **component** is a chunk of software you can build and replace on its own — a module, a library, or a whole service. You draw it as a rectangle with a little component icon in the corner, or with the keyword `«component»` above its name. The interesting part is the *interfaces*: the small symbols on the edges that say what each component offers and what it needs.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 640 260" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A component diagram: Web UI has a socket meaning it requires OrderService; Order API has a lollipop providing OrderService that plugs into that socket; Order API also has a second socket meaning it needs the Database.">
  <!-- ===== Web UI component (left) ===== -->
  <g>
    <rect x="44" y="86" width="170" height="74" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.5"/>
    <rect x="190" y="94" width="18" height="12" fill="#1a1d22" stroke="#3a414c"/>
    <rect x="186" y="96" width="7" height="3" fill="#1a1d22" stroke="#3a414c"/>
    <rect x="186" y="101" width="7" height="3" fill="#1a1d22" stroke="#3a414c"/>
    <text x="129" y="118" text-anchor="middle" font-size="11" fill="#9099a8">«component»</text>
    <text x="129" y="139" text-anchor="middle" font-size="14" fill="#e8e4dc" font-weight="700">Web UI</text>
  </g>

  <!-- Web UI's REQUIRED socket (⊃) on its right edge -->
  <g>
    <line x1="214" y1="123" x2="252" y2="123" stroke="#d8d3c9" stroke-width="1.6"/>
    <path d="M252,108 a15,15 0 1 0 0,30" fill="none" stroke="#fb863a" stroke-width="1.8"/>
    <text x="244" y="166" text-anchor="middle" font-size="11" fill="#fb863a">⊃ requires</text>
  </g>

  <!-- Order API's PROVIDED lollipop (●) plugging into the socket -->
  <g>
    <line x1="318" y1="123" x2="267" y2="123" stroke="#d8d3c9" stroke-width="1.6"/>
    <circle cx="267" cy="123" r="9" fill="#fb863a" stroke="#fb863a"/>
    <text x="320" y="166" text-anchor="middle" font-size="11" fill="#fb863a">● provides OrderService</text>
  </g>

  <!-- ===== Order API component (right) ===== -->
  <g>
    <rect x="318" y="86" width="170" height="74" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.5"/>
    <rect x="464" y="94" width="18" height="12" fill="#1a1d22" stroke="#3a414c"/>
    <rect x="460" y="96" width="7" height="3" fill="#1a1d22" stroke="#3a414c"/>
    <rect x="460" y="101" width="7" height="3" fill="#1a1d22" stroke="#3a414c"/>
    <text x="403" y="118" text-anchor="middle" font-size="11" fill="#9099a8">«component»</text>
    <text x="403" y="139" text-anchor="middle" font-size="14" fill="#e8e4dc" font-weight="700">Order API</text>
  </g>

  <!-- Order API REQUIRES the database (socket on its right edge) -->
  <g>
    <line x1="488" y1="123" x2="526" y2="123" stroke="#d8d3c9" stroke-width="1.6"/>
    <path d="M526,108 a15,15 0 1 0 0,30" fill="none" stroke="#fb863a" stroke-width="1.8"/>
    <text x="556" y="127" text-anchor="middle" font-size="11" fill="#9099a8">needs Database</text>
  </g>

  <!-- muted annotations -->
  <g font-size="11" fill="#6b7280">
    <text x="44" y="220">socket (⊃) = I NEED a service</text>
    <text x="44" y="240">lollipop (●) = I OFFER a service</text>
  </g>
</svg>`,
        caption:
          "A *lollipop* `●—` means \"I provide this interface\"; a *socket* `⊃—` means \"I require one.\" `Order API` **provides** `OrderService` (its lollipop) and **needs** the Database (its socket); `Web UI`'s socket plugs onto `Order API`'s lollipop — **offer meets need.**",
      },
      {
        type: "p",
        text: "Two symbols carry the whole meaning, and they fit together like a plug and a socket:",
      },
      {
        type: "ul",
        items: [
          "**Provided interface — the lollipop** (a line ending in a filled circle, `●—`). It means *“I offer this service.”* `Order API` draws a lollipop labelled `OrderService` to say *I provide order operations to whoever needs them.*",
          "**Required interface — the socket** (a line ending in a half-circle cup, `⊃—`). It means *“I need this service.”* `Web UI` draws a socket to say *I need an `OrderService` from somewhere.*",
          "**Assembly — plugging in.** When one component's **lollipop** sits inside another's **socket**, that's an *assembly connector*: the provider's `●` clicks into the consumer's `⊃`. `Order API`'s lollipop plugs into `Web UI`'s socket — the UI's need is satisfied by the API's offer.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Lollipop vs socket — never mix them up",
        text: "**Lollipop `●—` = provided = *I OFFER this.*** **Socket `⊃—` = required = *I NEED this.*** Remember it as: the lollipop is a candy you *give out*; the socket is an empty cup *waiting to be filled*. A working connection is always one component's lollipop sitting inside another's socket.",
      },
      { type: "h", text: "Deployment diagram: where it runs" },
      {
        type: "p",
        text: "A **deployment diagram** answers a different question: on which *machines* does this software actually run? It has three things — nodes, artifacts, and communication paths.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 680 300" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A deployment diagram: a Browser device, an App Server node and a DB Server node drawn as 3D boxes; webapp.js, order-api.jar and postgres sit inside them as artifacts; an HTTPS path links the browser to the app server, a JDBC/TCP path links the app server to the DB server.">
  <defs>
    <marker id="dep-arr" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <!-- communication paths (behind nodes), labelled with protocol -->
  <g>
    <line x1="208" y1="120" x2="240" y2="120" stroke="#fb863a" stroke-width="1.8" marker-end="url(#dep-arr)"/>
    <text x="224" y="108" text-anchor="middle" font-size="11" fill="#fb863a" font-weight="700">HTTPS</text>
    <line x1="440" y1="120" x2="472" y2="120" stroke="#fb863a" stroke-width="1.8" marker-end="url(#dep-arr)"/>
    <text x="456" y="108" text-anchor="middle" font-size="11" fill="#fb863a" font-weight="700">JDBC/TCP</text>
  </g>

  <!-- ===== Browser node (3D box) ===== -->
  <g>
    <polygon points="44,78 64,62 188,62 168,78" fill="#1a1d22" stroke="#3a414c" stroke-width="1.5"/>
    <polygon points="168,78 188,62 188,162 168,178" fill="#1a1d22" stroke="#3a414c" stroke-width="1.5"/>
    <rect x="44" y="78" width="124" height="100" rx="2" fill="#14161a" stroke="#3a414c" stroke-width="1.5"/>
    <text x="106" y="96" text-anchor="middle" font-size="10.5" fill="#9099a8">Browser (device)</text>
    <rect x="62" y="110" width="88" height="52" rx="3" fill="#14161a" stroke="#2d333d" stroke-width="1.3"/>
    <text x="106" y="130" text-anchor="middle" font-size="9" fill="#9099a8">«artifact»</text>
    <text x="106" y="148" text-anchor="middle" font-size="11" fill="#e8e4dc" font-weight="600">webapp.js</text>
  </g>

  <!-- ===== App Server node (3D box) ===== -->
  <g>
    <polygon points="280,78 300,62 424,62 404,78" fill="#1a1d22" stroke="#3a414c" stroke-width="1.5"/>
    <polygon points="404,78 424,62 424,162 404,178" fill="#1a1d22" stroke="#3a414c" stroke-width="1.5"/>
    <rect x="280" y="78" width="124" height="100" rx="2" fill="#14161a" stroke="#3a414c" stroke-width="1.5"/>
    <text x="342" y="96" text-anchor="middle" font-size="10.5" fill="#9099a8">App Server (node)</text>
    <rect x="296" y="110" width="92" height="52" rx="3" fill="#14161a" stroke="#2d333d" stroke-width="1.3"/>
    <text x="342" y="130" text-anchor="middle" font-size="9" fill="#9099a8">«artifact»</text>
    <text x="342" y="148" text-anchor="middle" font-size="11" fill="#e8e4dc" font-weight="600">order-api.jar</text>
  </g>

  <!-- ===== DB Server node (3D box) ===== -->
  <g>
    <polygon points="512,78 532,62 656,62 636,78" fill="#1a1d22" stroke="#3a414c" stroke-width="1.5"/>
    <polygon points="636,78 656,62 656,162 636,178" fill="#1a1d22" stroke="#3a414c" stroke-width="1.5"/>
    <rect x="512" y="78" width="124" height="100" rx="2" fill="#14161a" stroke="#3a414c" stroke-width="1.5"/>
    <text x="574" y="96" text-anchor="middle" font-size="10.5" fill="#9099a8">DB Server (node)</text>
    <rect x="530" y="110" width="88" height="52" rx="3" fill="#14161a" stroke="#2d333d" stroke-width="1.3"/>
    <text x="574" y="130" text-anchor="middle" font-size="9" fill="#9099a8">«artifact»</text>
    <text x="574" y="148" text-anchor="middle" font-size="11" fill="#e8e4dc" font-weight="600">postgres</text>
  </g>

  <!-- muted annotations -->
  <g font-size="11" fill="#6b7280">
    <text x="44" y="232">node = a machine</text>
    <text x="44" y="252">artifact = the deployed file</text>
    <text x="44" y="272">path = a network link + its protocol</text>
  </g>
</svg>`,
        caption:
          "A *node* is a machine (the 3D box: `Browser`, `App Server`, `DB Server`), an *artifact* is the file deployed inside it (`webapp.js`, `order-api.jar`, `postgres`), and a labelled *path* is the network link — `HTTPS` from browser to app server, `JDBC/TCP` from app server to database.",
      },
      {
        type: "ul",
        items: [
          "**Node** — a 3D box that stands for a *machine or device*: a server, a phone, a browser, a container. Here `Browser`, `App Server`, and `DB Server` are three nodes.",
          "**Artifact** — the *actual deployable file* that sits inside a node, drawn as a small rectangle (often marked `«artifact»`). Examples: `webapp.js`, `order-api.jar`, a Docker image, or `postgres`. The artifact is the real thing you copy onto the machine.",
          "**Communication path** — a line *between two nodes*, labelled with the protocol they talk over: `HTTPS` between browser and app server, `JDBC/TCP` between app server and database. The label tells ops people exactly which wire and port to open.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Same system, two pictures",
        text: "The `Order API` *component* (a logical building-block) is deployed as the `order-api.jar` *artifact*, which runs inside the `App Server` *node* (a physical machine). One side is *what it is and what it connects to*; the other side is *where it physically lives and over what wire it talks*. Drawing both shows you understand structure **and** operations.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't confuse the two",
        text: "A common mix-up: putting machines in a component diagram, or interfaces in a deployment diagram. Keep them apart — **component = logical structure** (modules + provided/required interfaces), **deployment = physical reality** (nodes + artifacts + network links). If you're talking about *clipping pieces together*, that's component; if you're talking about *which server it's on*, that's deployment.",
      },
    ],

    handsOn: [
      {
        title: "01 · Read the lollipop and the socket",
        body: "Open the prototype on the **Component view**. Find the round **lollipop (●—)** on `Order API` and click it — confirm the note says *I offer this service*. Now click the **socket (⊃—)** on `Web UI` — confirm it says *I need this service*. Say it out loud: *Order API offers, Web UI needs.* That offer-meets-need is the whole point of a component diagram.",
      },
      {
        title: "02 · Follow one feature across both views",
        body: "Still on the Component view, click the `Order API` box and read what it is. Now toggle to the **Deployment view** and find `order-api.jar` inside the `App Server` node and click it. You've just followed one piece from *logical building-block* (the component) to *physical file on a machine* (the artifact). That's the bridge between the two diagrams.",
      },
      {
        title: "03 · Trace the wires",
        body: "On the **Deployment view**, click the line labelled `HTTPS` between `Browser` and `App Server`, then the line labelled `JDBC/TCP` between `App Server` and `DB Server`. Read what each protocol means. Notice the diagram now tells an ops person exactly which machines talk to which, and over what — information a component diagram never shows.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "order-api.ts",
        code: `// A component diagram isn't code — but provided/required interfaces map
// straight onto an interface + dependency injection.

// The PROVIDED interface (the lollipop ●—): "I offer this service."
interface OrderService {
  placeOrder(itemId: string): string;
}

// OrderApi PROVIDES OrderService — it draws the lollipop ●—.
class OrderApi implements OrderService {
  placeOrder(itemId: string): string {
    return "order-for-" + itemId;
  }
}

// WebUi REQUIRES an OrderService (the socket ⊃—): it asks for one
// in its constructor instead of building its own. That's the socket.
class WebUi {
  // ⊃— required interface, satisfied by injection (the lollipop plugs in)
  constructor(private readonly orders: OrderService) {}

  checkout(itemId: string): string {
    return this.orders.placeOrder(itemId); // uses the offered service
  }
}

// "Assembly": OrderApi's lollipop plugs into WebUi's socket.
const ui = new WebUi(new OrderApi());`,
      },
      {
        label: "Java",
        language: "java",
        filename: "OrderApi.java",
        code: `// A component diagram isn't code — but provided/required interfaces map
// straight onto an interface + dependency injection.

// The PROVIDED interface (the lollipop ●—): "I offer this service."
interface OrderService {
    String placeOrder(String itemId);
}

// OrderApi PROVIDES OrderService — it draws the lollipop ●—.
class OrderApi implements OrderService {
    public String placeOrder(String itemId) {
        return "order-for-" + itemId;
    }
}

// WebUi REQUIRES an OrderService (the socket ⊃—): it asks for one
// in its constructor instead of building its own. That's the socket.
class WebUi {
    private final OrderService orders;

    // ⊃— required interface, satisfied by injection (the lollipop plugs in)
    WebUi(OrderService orders) { this.orders = orders; }

    String checkout(String itemId) {
        return orders.placeOrder(itemId); // uses the offered service
    }
}

// "Assembly": OrderApi's lollipop plugs into WebUi's socket.
// WebUi ui = new WebUi(new OrderApi());`,
      },
      {
        label: "Python",
        language: "python",
        filename: "order_api.py",
        code: `# A component diagram isn't code — but provided/required interfaces map
# straight onto a protocol/interface + dependency injection.
from typing import Protocol


# The PROVIDED interface (the lollipop ●—): "I offer this service."
class OrderService(Protocol):
    def place_order(self, item_id: str) -> str: ...


# OrderApi PROVIDES OrderService — it draws the lollipop ●—.
class OrderApi:
    def place_order(self, item_id: str) -> str:
        return f"order-for-{item_id}"


# WebUi REQUIRES an OrderService (the socket ⊃—): it asks for one
# in its constructor instead of building its own. That's the socket.
class WebUi:
    def __init__(self, orders: OrderService) -> None:  # ⊃— required, injected
        self._orders = orders

    def checkout(self, item_id: str) -> str:
        return self._orders.place_order(item_id)  # uses the offered service


# "Assembly": OrderApi's lollipop plugs into WebUi's socket.
ui = WebUi(OrderApi())`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "order_api.cpp",
        code: `// A component diagram isn't code — but provided/required interfaces map
// straight onto a pure-virtual interface + dependency injection.
#include <string>

// The PROVIDED interface (the lollipop ●—): "I offer this service."
class OrderService {
public:
    virtual std::string placeOrder(const std::string& itemId) = 0;
    virtual ~OrderService() = default;
};

// OrderApi PROVIDES OrderService — it draws the lollipop ●—.
class OrderApi : public OrderService {
public:
    std::string placeOrder(const std::string& itemId) override {
        return "order-for-" + itemId;
    }
};

// WebUi REQUIRES an OrderService (the socket ⊃—): it asks for one
// in its constructor instead of building its own. That's the socket.
class WebUi {
    OrderService& orders;  // ⊃— required interface, satisfied by injection
public:
    explicit WebUi(OrderService& o) : orders(o) {}
    std::string checkout(const std::string& itemId) {
        return orders.placeOrder(itemId); // uses the offered service
    }
};

// "Assembly": OrderApi's lollipop plugs into WebUi's socket.
// OrderApi api; WebUi ui(api);`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for each one" },
      {
        type: "p",
        text: "Reach for a **component diagram** when you're *organising the software*: splitting a system into services or modules, planning how a monolith breaks into microservices, or showing a teammate which block offers which interface. Reach for a **deployment diagram** when you're *planning where it runs*: an infrastructure or DevOps conversation, deciding which server hosts what, or showing how machines connect and over which protocols.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Deployment is the bridge from LLD to HLD",
        text: "A deployment diagram is where low-level design meets high-level design: it stops talking about classes and interfaces and starts talking about servers, containers, and networks. When an interviewer asks *“and how would you deploy this?”*, a quick node-and-path sketch — with `HTTPS` and `JDBC/TCP` on the links — shows you can think past the code to where it actually lives.",
      },
    ],

    tradeoffs: {
      pros: [
        "Zoom-out clarity — they show the whole system at a glance, which class diagrams (too detailed) can't.",
        "Component diagrams make a clean service/module split obvious before you commit to it in code.",
        "Provided/required interfaces force you to think about contracts between pieces, not just their insides.",
        "Deployment diagrams give ops and DevOps a shared map of machines, artifacts, and the wires (and ports) between them.",
      ],
      cons: [
        "Easy to confuse the two — beginners put machines in a component diagram or interfaces in a deployment one.",
        "Go stale quickly: infrastructure changes often, so a detailed deployment diagram needs constant upkeep.",
        "Can oversimplify — a single node box can hide a whole cluster, load balancer, or auto-scaling group.",
        "The notation (lollipop, socket, 3D node, «artifact») is unfamiliar at first and trips people up until practised.",
      ],
    },

    furtherReading: [
      {
        label: "UML Component Diagrams — UML-Diagrams.org reference",
        href: "https://www.uml-diagrams.org/component-diagrams.html",
        note: "The complete reference for components, provided/required interfaces (lollipop and socket), and assembly connectors. Bookmark it as your lookup sheet.",
        kind: "docs",
      },
      {
        label: "UML Deployment Diagrams — UML-Diagrams.org reference",
        href: "https://www.uml-diagrams.org/deployment-diagrams-overview.html",
        note: "The matching reference for nodes, artifacts, and communication paths — every element of the physical view, with examples.",
        kind: "docs",
      },
      {
        label: "What is Component Diagram? — Visual Paradigm tutorial",
        href: "https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-component-diagram/",
        note: "A friendly, example-led walkthrough that builds a component diagram step by step — great as a second read after this lesson.",
        kind: "article",
      },
      {
        label: "Component and Deployment Diagrams — GeeksforGeeks",
        href: "https://www.geeksforgeeks.org/component-based-diagram/",
        note: "A compact, beginner-paced article with diagrams contrasting the logical (component) and physical (deployment) views side by side.",
        kind: "article",
      },
      {
        label: "UML Distilled — Martin Fowler",
        note: "The classic short book on UML. Its chapters on component and deployment diagrams keep the notation to just what you need to communicate — exactly the spirit of this lesson.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "component-and-deployment-diagrams-q1",
        question:
          "In a component diagram, what does a lollipop (a line ending in a filled circle, ●—) on a component mean?",
        options: [
          { id: "a", label: "A provided interface — 'I offer this service.'" },
          { id: "b", label: "A required interface — 'I need this service.'" },
          { id: "c", label: "A physical machine the component runs on." },
          { id: "d", label: "A deployable file copied onto a server." },
        ],
        correctOptionId: "a",
        explanation:
          "The lollipop ●— is the provided interface: it means 'I offer this service.' The half-circle socket ⊃— is the opposite — a required interface, 'I need this service.' Remember it as a candy you give out (lollipop = provide) versus an empty cup waiting to be filled (socket = require).",
      },
      {
        id: "component-and-deployment-diagrams-q2",
        question:
          "`Web UI` draws a socket (⊃—) and `Order API` draws a lollipop (●—) labelled OrderService, and they plug together. What is happening?",
        options: [
          {
            id: "a",
            label:
              "Web UI needs an OrderService and Order API provides it — the provider's lollipop plugs into the consumer's socket (an assembly).",
          },
          {
            id: "b",
            label: "Order API needs a service that Web UI provides.",
          },
          {
            id: "c",
            label: "Both components run on the same physical machine.",
          },
          {
            id: "d",
            label: "Web UI inherits from Order API.",
          },
        ],
        correctOptionId: "a",
        explanation:
          "The socket (⊃—) on Web UI means it *needs* an OrderService; the lollipop (●—) on Order API means it *offers* one. When the offer plugs into the need, that's an assembly connector — the consumer's requirement is satisfied by the provider. Offer meets need.",
      },
      {
        id: "component-and-deployment-diagrams-q3",
        question:
          "You want to show which server runs your app and which database it talks to over JDBC/TCP. Which diagram do you draw?",
        options: [
          {
            id: "a",
            label:
              "A deployment diagram — it shows the physical machines (nodes) and the network links between them.",
          },
          {
            id: "b",
            label: "A component diagram — it shows machines and protocols.",
          },
          { id: "c", label: "A class diagram — it shows servers and wires." },
          { id: "d", label: "An object diagram — it shows live machines." },
        ],
        correctOptionId: "a",
        explanation:
          "Anything about *where software runs* and *how machines connect* is a deployment diagram: nodes (machines), artifacts (the files inside them), and communication paths labelled with the protocol (HTTPS, JDBC/TCP). A component diagram is the logical view — interfaces, not machines.",
      },
      {
        id: "component-and-deployment-diagrams-q4",
        question:
          "In a deployment diagram, what is an artifact (e.g. `order-api.jar` sitting inside a node)?",
        options: [
          {
            id: "a",
            label: "The actual deployable file that runs inside a node (machine).",
          },
          {
            id: "b",
            label: "An interface a component offers to others.",
          },
          { id: "c", label: "The network protocol between two machines." },
          { id: "d", label: "A class with its attributes and methods." },
        ],
        correctOptionId: "a",
        explanation:
          "An artifact is the real, deployable file — a `.jar`, a Docker image, `webapp.js`, `postgres` — that physically sits inside a node (a machine). The node is the machine; the artifact is the file you copy onto it; the line between nodes (with its protocol label) is the communication path.",
      },
      {
        id: "component-and-deployment-diagrams-q5",
        question:
          "What is the core difference between a component diagram and a deployment diagram?",
        options: [
          {
            id: "a",
            label:
              "Component shows the logical building-blocks and how they connect; deployment shows the physical machines they run on.",
          },
          {
            id: "b",
            label:
              "Component shows machines; deployment shows the source code line by line.",
          },
          {
            id: "c",
            label: "They are the same diagram with different colours.",
          },
          {
            id: "d",
            label:
              "Component shows behaviour over time; deployment shows class inheritance.",
          },
        ],
        correctOptionId: "a",
        explanation:
          "Component = logical structure: the software building-blocks (modules/services) and the provided/required interfaces that connect them. Deployment = physical reality: the nodes (machines) the software runs on, the artifacts inside them, and the network links between them. Component answers 'what connects to what'; deployment answers 'where does it run'.",
      },
    ],
  },
};
