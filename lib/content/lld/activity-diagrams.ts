import type { RoadmapLesson } from "@/lib/content/types";

export const activityDiagrams: RoadmapLesson = {
  title: "Activity Diagrams",
  oneLiner:
    "An activity diagram is a flowchart for a workflow: it shows the steps, the decisions, and the parallel paths from start to finish — so you can read the whole logic of a process at a glance.",
  difficulty: "beginner",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/activity-diagrams.html",
  content: {
    prototypeCaption:
      "One clean stage holds a real workflow — placing an **online order** — drawn top to bottom: a start circle, a few action boxes, a decision diamond, and a fork that splits into two parallel actions. Press **Next** to walk a glowing token along the flow one node at a time; at the decision you pick **in stock** or **out of stock** to see the two different paths. A single fixed note panel is rewritten each step to explain that node's shape and meaning, so nothing scrolls away or grows the page.",

    overview: [
      {
        type: "p",
        text: "An **activity diagram** is a flowchart for a *process*. You draw the **steps** of some workflow, the **decisions** that send it down one path or another, and the points where work happens **in parallel** — all the way from a clear start to a clear finish. If a class diagram answers *“what are the pieces?”*, an activity diagram answers *“what happens, in what order, and when do things branch or run at the same time?”*",
      },
      {
        type: "p",
        text: "Think of a **recipe**. *Preheat the oven. Mix the batter. Is the oven hot yet? If yes, bake; if no, wait. While it bakes, wash up.* That's an activity diagram in words: a sequence of steps, a yes/no decision, and two things happening at once. Or picture the flowchart of *“what happens when you place an order online”* — that is exactly the kind of thing this diagram draws.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "An activity diagram = the **flow of a workflow**: a start, a chain of **actions** (rounded boxes), **decision** diamonds that branch, and **fork/join** bars for things that run in parallel — ending at a final node. Read it top to bottom like a flowchart and you've read the whole process.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The shapes, one at a time" },
      {
        type: "p",
        text: "An activity diagram is built from a small, fixed set of shapes. Each shape has one meaning. Learn these six and you can read any activity diagram — the workflow just connects them with arrows.",
      },
      {
        type: "ul",
        items: [
          "**Start (initial node)** — a *filled black circle* ●. Every diagram begins here. There's exactly one.",
          "**Action** — a *rounded rectangle*. One step of work, e.g. `Charge payment`. Most boxes in the diagram are actions.",
          "**Control flow** — an *arrow* from one node to the next. It shows the *order*: do this, then that.",
          "**Decision** — a *diamond* ◇ with one arrow in and two (or more) arrows out. Each outgoing arrow has a **guard** in square brackets like `[in stock]` or `[out of stock]`. The flow takes the branch whose guard is true.",
          "**Merge** — a *diamond* that does the opposite: several arrows come in, one goes out. It rejoins branches that split earlier. (Same diamond shape, used to gather paths back together.)",
          "**Fork / Join** — a *thick black bar*. A **fork** has one arrow in and several out: the flows after it all happen *in parallel*. A **join** has several arrows in and one out: it waits for *all* parallel flows to finish before moving on.",
          "**End (final node)** — a *filled circle with a ring* ◉. The workflow stops here. You can have more than one (e.g. one for success, one for the out-of-stock path).",
        ],
      },
      { type: "h", text: "How they fit together" },
      {
        type: "p",
        text: "Here is the online-order workflow from the prototype, drawn in text. Read it top to bottom, following the arrows:",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 560 660" width="100%" style="max-width:560px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An activity diagram for placing an online order: start, Add item to cart, Checkout, then a decision [in stock?]. The out-of-stock branch notifies and ends; the in-stock branch charges payment, forks into Send confirmation email and Reserve inventory in parallel, joins, then ships the order and ends.">
  <defs>
    <marker id="ad-flow" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#d8d3c9"/></marker>
  </defs>

  <!-- ● start (initial node) -->
  <circle cx="200" cy="24" r="10" fill="#e8e4dc"/>

  <!-- control flow: start → Add item to cart -->
  <line x1="200" y1="34" x2="200" y2="58" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>

  <!-- action: Add item to cart -->
  <rect x="120" y="62" width="160" height="36" rx="18" fill="#14161a" stroke="#2d333d"/>
  <text x="200" y="85" text-anchor="middle" font-size="13" fill="#e8e4dc">Add item to cart</text>

  <!-- flow → Checkout -->
  <line x1="200" y1="98" x2="200" y2="122" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>

  <!-- action: Checkout -->
  <rect x="120" y="126" width="160" height="36" rx="18" fill="#14161a" stroke="#2d333d"/>
  <text x="200" y="149" text-anchor="middle" font-size="13" fill="#e8e4dc">Checkout</text>

  <!-- flow → decision -->
  <line x1="200" y1="162" x2="200" y2="186" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>

  <!-- ◇ decision diamond -->
  <polygon points="200,190 244,224 200,258 156,224" fill="#14161a" stroke="rgba(251,134,58,0.55)" stroke-width="1.4"/>
  <text x="200" y="228" text-anchor="middle" font-size="12" fill="#fb863a">[in stock?]</text>

  <!-- guard branch: [in stock] going down to Charge payment -->
  <line x1="200" y1="258" x2="200" y2="290" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>
  <text x="208" y="278" font-size="11" fill="#9099a8">[in stock]</text>

  <!-- guard branch: [out of stock] going right then down -->
  <path d="M244,224 H440 V290" fill="none" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>
  <text x="332" y="216" text-anchor="middle" font-size="11" fill="#9099a8">[out of stock]</text>

  <!-- action: Notify out of stock (right branch) -->
  <rect x="356" y="294" width="168" height="36" rx="18" fill="#14161a" stroke="#2d333d"/>
  <text x="440" y="317" text-anchor="middle" font-size="13" fill="#e8e4dc">Notify out of stock</text>

  <!-- flow → end (right branch) -->
  <line x1="440" y1="330" x2="440" y2="356" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>

  <!-- ◉ end (right branch final node) -->
  <circle cx="440" cy="372" r="11" fill="none" stroke="#e8e4dc" stroke-width="1.6"/>
  <circle cx="440" cy="372" r="6" fill="#e8e4dc"/>

  <!-- action: Charge payment (in-stock path) -->
  <rect x="120" y="294" width="160" height="36" rx="18" fill="#14161a" stroke="#2d333d"/>
  <text x="200" y="317" text-anchor="middle" font-size="13" fill="#e8e4dc">Charge payment</text>

  <!-- flow → fork bar -->
  <line x1="200" y1="330" x2="200" y2="356" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>

  <!-- ━━ fork (thick bar) splits into parallel -->
  <rect x="96" y="360" width="208" height="7" rx="2" fill="#e8e4dc"/>
  <text x="312" y="367" font-size="11" fill="#6b7280">fork</text>

  <!-- two parallel control flows out of the fork -->
  <line x1="140" y1="367" x2="140" y2="392" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>
  <line x1="260" y1="367" x2="260" y2="392" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>

  <!-- parallel action: Send confirmation email -->
  <rect x="42" y="396" width="196" height="36" rx="18" fill="#14161a" stroke="#2d333d"/>
  <text x="140" y="419" text-anchor="middle" font-size="12" fill="#e8e4dc">Send confirmation email</text>

  <!-- parallel action: Reserve inventory -->
  <rect x="262" y="396" width="156" height="36" rx="18" fill="#14161a" stroke="#2d333d"/>
  <text x="340" y="419" text-anchor="middle" font-size="12" fill="#e8e4dc">Reserve inventory</text>

  <!-- two flows back into the join bar (Reserve inventory routed to x=260) -->
  <line x1="140" y1="432" x2="140" y2="456" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>
  <path d="M340,432 V444 H260 V456" fill="none" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>

  <!-- ━━ join (thick bar) waits for both -->
  <rect x="96" y="460" width="208" height="7" rx="2" fill="#e8e4dc"/>
  <text x="312" y="467" font-size="11" fill="#6b7280">join</text>

  <!-- flow → Ship order -->
  <line x1="200" y1="467" x2="200" y2="492" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>

  <!-- action: Ship order -->
  <rect x="120" y="496" width="160" height="36" rx="18" fill="#14161a" stroke="#2d333d"/>
  <text x="200" y="519" text-anchor="middle" font-size="13" fill="#e8e4dc">Ship order</text>

  <!-- flow → end (in-stock path) -->
  <line x1="200" y1="532" x2="200" y2="558" stroke="#d8d3c9" stroke-width="1.6" marker-end="url(#ad-flow)"/>

  <!-- ◉ end (in-stock final node) -->
  <circle cx="200" cy="574" r="11" fill="none" stroke="#e8e4dc" stroke-width="1.6"/>
  <circle cx="200" cy="574" r="6" fill="#e8e4dc"/>
</svg>`,
        caption:
          "Read it top to bottom: ● **start**, each rounded box is an **action**, the ◇ diamond is a **decision** with guards `[in stock]` / `[out of stock]`, the thick bar is a **fork/join** for *parallel* work (`Send confirmation email` and `Reserve inventory` run at once), and ◉ is an **end**.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Decision vs fork — don't mix them up",
        text: "A **decision** (diamond) chooses *one* path — *either* this branch *or* that one, based on a guard. A **fork** (bar) takes *all* paths *at once* — *both* this *and* that, in parallel. Diamond = a question with an *or* answer. Bar = an *and*: everything after it runs together.",
      },
      { type: "h", text: "Guards: the labels on a decision's branches" },
      {
        type: "p",
        text: "The little labels in square brackets — `[in stock]`, `[out of stock]`, `[amount > 0]` — are **guards**. A guard is the condition that must be true to take that branch. Guards on a single decision should cover every case and not overlap, so the flow always has exactly one way to go. They map straight to the conditions in an `if`/`else` in code.",
      },
      { type: "h", text: "Optional: swimlanes (who does what)" },
      {
        type: "p",
        text: "Sometimes you split the diagram into vertical columns called **swimlanes** (or *partitions*), one per actor — `Customer`, `Payment Service`, `Warehouse`. Each action sits in the lane of whoever performs it. The arrows still flow the same way; the lanes just add the *who*. Use them when the workflow crosses several people or systems and that ownership matters.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Activity diagram vs sequence diagram",
        text: "These two get confused. An **activity diagram** shows the *whole workflow's logic* — its steps, branches, and parallel paths — without caring much *which object* does each step. A **sequence diagram** shows *messages between specific objects* over time (object A calls object B, which calls C). Use an activity diagram for *“what is the flow of this process?”* and a sequence diagram for *“who calls whom, in what order?”*",
      },
    ],

    handsOn: [
      {
        title: "01 · Walk the happy path",
        body: "Open the prototype and press **Next** repeatedly. Watch the glowing token move ● → `Add item to cart` → `Checkout` → the decision diamond. When you reach the decision, click **in stock**, then keep pressing **Next**. Notice the token reach the **fork bar** and light up *both* `Send confirmation email` and `Reserve inventory` at once — that's parallelism — before joining and ending at `Ship order` → ◉.",
      },
      {
        title: "02 · Take the other branch",
        body: "Restart and step to the decision again, but this time click **out of stock**. Follow the token down the short branch to `Notify out of stock` → ◉. You just traced both guarded paths of the same diamond. Say out loud: *one diamond, two guards, the flow takes whichever guard is true.*",
      },
      {
        title: "03 · Name every shape",
        body: "Step through once more and, at each node, read the note panel and name the shape before it tells you: *filled circle = start, rounded box = action, diamond = decision with guards, thick bar = fork/join = parallel, ringed circle = end.* If you can name all six without help, you can read any activity diagram.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "process-order.ts",
        code: `// The activity diagram becomes this function.
// Each action box → a statement; the decision diamond → an if/else;
// the fork → two tasks started together (await Promise.all = the join).

async function processOrder(order: Order): Promise<void> {
  addItemToCart(order);   // action: Add item to cart
  checkout(order);        // action: Checkout

  // ◇ decision diamond — guards [in stock] / [out of stock]
  if (inStock(order)) {
    chargePayment(order); // action: Charge payment

    // ━━ FORK ━━ : these two run in PARALLEL
    await Promise.all([
      sendConfirmationEmail(order), // parallel action
      reserveInventory(order),      // parallel action
    ]); // ━━ JOIN ━━ : wait for BOTH before continuing

    shipOrder(order);     // action: Ship order
  } else {
    notifyOutOfStock(order); // action on the [out of stock] branch
  }
  // ◉ final node — the function returns
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "OrderProcessor.java",
        code: `// The activity diagram becomes this method.
// Action box -> a statement; decision diamond -> if/else;
// fork -> two parallel tasks; join -> waiting for both to finish.

import java.util.concurrent.CompletableFuture;

void processOrder(Order order) {
    addItemToCart(order);   // action: Add item to cart
    checkout(order);        // action: Checkout

    // <> decision diamond — guards [in stock] / [out of stock]
    if (inStock(order)) {
        chargePayment(order); // action: Charge payment

        // === FORK === : run these two in PARALLEL
        CompletableFuture<Void> email =
            CompletableFuture.runAsync(() -> sendConfirmationEmail(order));
        CompletableFuture<Void> stock =
            CompletableFuture.runAsync(() -> reserveInventory(order));
        CompletableFuture.allOf(email, stock).join(); // === JOIN === wait for both

        shipOrder(order);     // action: Ship order
    } else {
        notifyOutOfStock(order); // action on the [out of stock] branch
    }
    // (o) final node — the method returns
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "process_order.py",
        code: `# The activity diagram becomes this function.
# Action box -> a statement; decision diamond -> if/else;
# fork -> two coroutines started together; join -> asyncio.gather.

import asyncio


async def process_order(order: Order) -> None:
    add_item_to_cart(order)   # action: Add item to cart
    checkout(order)           # action: Checkout

    # <> decision diamond — guards [in stock] / [out of stock]
    if in_stock(order):
        charge_payment(order)  # action: Charge payment

        # ===== FORK ===== : these two run in PARALLEL
        await asyncio.gather(
            send_confirmation_email(order),  # parallel action
            reserve_inventory(order),        # parallel action
        )  # ===== JOIN ===== : gather waits for BOTH

        ship_order(order)      # action: Ship order
    else:
        notify_out_of_stock(order)  # action on the [out of stock] branch
    # (o) final node — the function returns`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "process_order.cpp",
        code: `// The activity diagram becomes this function.
// Action box -> a statement; decision diamond -> if/else;
// fork -> two async tasks; join -> calling .get() on both.

#include <future>

void processOrder(Order& order) {
    addItemToCart(order);   // action: Add item to cart
    checkout(order);        // action: Checkout

    // <> decision diamond — guards [in stock] / [out of stock]
    if (inStock(order)) {
        chargePayment(order); // action: Charge payment

        // === FORK === : launch these two in PARALLEL
        auto email = std::async(std::launch::async,
                                [&] { sendConfirmationEmail(order); });
        auto stock = std::async(std::launch::async,
                                [&] { reserveInventory(order); });
        email.get();          // === JOIN === : wait for both
        stock.get();

        shipOrder(order);     // action: Ship order
    } else {
        notifyOutOfStock(order); // action on the [out of stock] branch
    }
    // (o) final node — the function returns
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to reach for an activity diagram" },
      {
        type: "p",
        text: "Draw one whenever the interesting thing is the *flow*, not the structure: a business process (signing up, checking out, approving a refund), a complex method whose branches are hard to follow in prose, or any algorithm where work splits into parallel steps and joins back. It's also the friendliest UML diagram for *non-coders* — a product manager or analyst can read a flowchart of branches and arrows without knowing any code.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Great for parallel work and business logic",
        text: "Use an activity diagram to model a business process, to untangle a tricky method's branching logic, or to show where work happens *concurrently* (the fork/join bars make parallelism obvious). When you need to explain an algorithm's branching to people who don't read code, this is the diagram to draw.",
      },
    ],

    tradeoffs: {
      pros: [
        "Reads like a flowchart — almost anyone, technical or not, can follow it.",
        "Shows branching and parallelism clearly, which plain text and class diagrams cannot.",
        "Maps cleanly to code: decisions become if/else, forks become parallel tasks.",
        "Great for modelling whole business processes end to end, not just one class.",
      ],
      cons: [
        "Shows the flow of a process, but not *which objects* exchange *which messages* (that's a sequence diagram).",
        "Gets messy fast for big workflows — too many branches and forks turn into spaghetti.",
        "Easy to drift from the code: a detailed diagram goes stale as the logic changes.",
        "It models control flow, not data structure — you still need class/object diagrams for the shape of the data.",
      ],
    },

    furtherReading: [
      {
        label: "UML Activity Diagrams — UML-Diagrams.org reference",
        href: "https://www.uml-diagrams.org/activity-diagrams.html",
        note: "The complete plain reference for every element: initial/final nodes, actions, decisions, forks/joins, partitions. Use it as your lookup sheet.",
        kind: "docs",
      },
      {
        label: "UML Activity Diagram Tutorial — Visual Paradigm",
        href: "https://www.visual-paradigm.com/tutorials/activity-diagram-tutorial/",
        note: "A friendly, example-led walkthrough that builds an activity diagram step by step — a good second read after this lesson.",
        kind: "article",
      },
      {
        label: "Unified Modeling Language (UML) | Activity Diagrams — GeeksforGeeks",
        href: "https://www.geeksforgeeks.org/unified-modeling-language-uml-activity-diagrams/",
        note: "Clear notation breakdown with simple examples and a worked end-to-end diagram. Handy for quick revision.",
        kind: "article",
      },
      {
        label: "UML Distilled — Martin Fowler",
        note: "The classic short UML book. Its chapter on activity diagrams is the clearest few pages on when (and when not) to use them; Fowler's whole point is to use just enough notation to communicate.",
        kind: "book",
      },
      {
        label: "What is an Activity Diagram in UML? — Lucidchart guide",
        href: "https://www.lucidchart.com/pages/uml-activity-diagram",
        note: "A visual guide with annotated examples and a glossary of every symbol; pairs well with a drawing tool when you make your own.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "activity-diagrams-q1",
        question: "In an activity diagram, what does a thick black bar (a fork) mean?",
        options: [
          { id: "a", label: "The flow splits into actions that all run in parallel." },
          { id: "b", label: "The flow chooses exactly one of several branches." },
          { id: "c", label: "The workflow has ended." },
          { id: "d", label: "Two unrelated diagrams are joined together." },
        ],
        correctOptionId: "a",
        explanation:
          "A fork is a thick bar with one arrow in and several out: every path after it runs in parallel (an 'and' — all of them at once). The matching join bar later waits for all those parallel flows to finish. Choosing just one path is what a decision diamond does, not a fork.",
      },
      {
        id: "activity-diagrams-q2",
        question: "What is the `[in stock]` label on an arrow coming out of a decision diamond called?",
        options: [
          { id: "a", label: "A guard — the condition that must be true to take that branch." },
          { id: "b", label: "A swimlane that names who performs the step." },
          { id: "c", label: "A multiplicity, showing how many objects there are." },
          { id: "d", label: "The name of the action box." },
        ],
        correctOptionId: "a",
        explanation:
          "Labels in square brackets on a decision's outgoing arrows are guards: conditions like `[in stock]` / `[out of stock]`. The flow takes whichever branch's guard is true. Guards map directly to the conditions in an if/else in code.",
      },
      {
        id: "activity-diagrams-q3",
        question: "What is the difference between a decision diamond and a fork bar?",
        options: [
          { id: "a", label: "A decision picks one path (or); a fork runs all paths in parallel (and)." },
          { id: "b", label: "A decision runs paths in parallel; a fork picks one path." },
          { id: "c", label: "They mean the same thing and are interchangeable." },
          { id: "d", label: "A decision starts the diagram; a fork ends it." },
        ],
        correctOptionId: "a",
        explanation:
          "A decision diamond is a question with an 'or' answer — the flow follows exactly one guarded branch. A fork bar is an 'and' — every path after it runs at the same time, and a join later waits for all of them. Diamond = choose one; bar = do all together.",
      },
      {
        id: "activity-diagrams-q4",
        question: "How is the start (initial node) of an activity diagram drawn?",
        options: [
          { id: "a", label: "A filled black circle." },
          { id: "b", label: "A rounded rectangle." },
          { id: "c", label: "A diamond." },
          { id: "d", label: "A filled circle with a ring around it." },
        ],
        correctOptionId: "a",
        explanation:
          "The start is a plain filled black circle, and there's exactly one. The end (final node) is a filled circle with a ring around it. A rounded rectangle is an action, and a diamond is a decision or merge.",
      },
      {
        id: "activity-diagrams-q5",
        question: "Which question is best answered by a sequence diagram rather than an activity diagram?",
        options: [
          { id: "a", label: "Which object sends which message to which other object, and in what order?" },
          { id: "b", label: "What are the steps of this workflow from start to finish?" },
          { id: "c", label: "Where does the process branch on a condition?" },
          { id: "d", label: "Which steps of the process happen in parallel?" },
        ],
        correctOptionId: "a",
        explanation:
          "An activity diagram shows the flow of a whole process — its steps, branches, and parallel paths — without focusing on which object does each step. The order of messages between specific objects over time is what a sequence diagram captures. Pick the diagram that fits the question.",
      },
    ],
  },
};
