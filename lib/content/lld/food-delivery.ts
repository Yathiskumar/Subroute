import type { RoadmapLesson } from "@/lib/content/types";

export const foodDelivery: RoadmapLesson = {
  title: "Food delivery (Swiggy / Zomato)",
  oneLiner:
    "An order is not a row you write once. It is a **forty-minute-long object** that a customer, a restaurant and a delivery partner take turns acting on — and most of this design is deciding *who is allowed to do what, when*. Put that in one state machine owned by `Order` and the round is yours; scatter it across three services as booleans and you will eventually ship an order that is delivered **and** cancelled.",
  difficulty: "advanced",
  estimatedTime: "45 min",
  prototypePath: "/prototypes/lld/food-delivery.html",
  content: {
    prototypeCaption:
      "One live order, walked through its life by three actors. Press **🙍 Place order**, then **🍳 Accept** and **🍳 Start preparing** — the state pill strip lights up as it goes. Now press **🛵 Pick up** while the state is still PREPARING: the button shakes red and the call line prints `order.transition(PICK_UP, PARTNER) → ✗ illegal from PREPARING`. Walk on to PICKED_UP and press **🙍 Deliver** in the Customer panel to see the *other* kind of refusal — right event, wrong actor. Then press **🚫 Try to cancel** at each stage and watch the refund fall from 100% to 50% to 25% to refused, and use **💸 Menu price changed** followed by **🧾 Checkout** to see the bill rebuild from the current menu — and then freeze.",

    // ==================================================================
    overview: [
      {
        type: "p",
        text: "*“Design a food delivery app like Swiggy.”* One sentence, and it is deliberately enormous. There is a menu, a cart, payments, a map, live tracking, ratings, coupons, a partner app, a restaurant tablet. You have ninety minutes.",
      },
      {
        type: "p",
        text: "So the first thing being graded is what you *refuse* to build. The second thing — the thing this whole lesson is about — is the one object everything else hangs off.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole lesson in one line",
        text: "**An order is not a row you write once — it is a long-lived object that three different actors take turns changing.** A customer places it, a restaurant accepts and cooks it, a partner picks it up and delivers it. Your job is to make illegal moves *impossible*, not merely unlikely: one explicit state machine, owned by `Order`, where every transition names the state it comes from, the event that fires it, and **who is allowed to fire it**.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 400" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Three panels showing the real world scene. On the left a customer on a sofa holds a Cart that stores only menu item ids and quantities with no price. In the middle a restaurant kitchen holds MenuItem rows carrying the price and an availability flag, one of which is sold out. On the right a delivery partner on the road, with an AssignmentStrategy that can be nearest free or batched. Along the bottom, the Order object spans all three as a strip of six states from PLACED to DELIVERED, each labelled with the actor who fires the edge into it, and below it the frozen Bill in paise.">
  <defs>
    <marker id="fd-scene-a" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#6b7280"/></marker>
  </defs>

  <text x="18" y="24" font-size="10.5" fill="#9099a8">one order · three actors · forty minutes  —  every noun labelled as its class</text>

  <rect x="18" y="38" width="216" height="196" rx="10" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="58" font-size="9" fill="#6b7280">on the sofa</text>
  <text x="34" y="94" font-size="26">🙍</text>
  <text x="76" y="84" font-size="11" fill="#fb863a">Customer</text>
  <text x="76" y="100" font-size="9" fill="#9099a8">id · name · address</text>
  <rect x="34" y="114" width="186" height="104" rx="7" fill="#0c0d10" stroke="rgba(251,134,58,0.5)"/>
  <text x="46" y="134" font-size="10.5" fill="#fb863a">Cart</text>
  <text x="46" y="154" font-size="9.5" fill="#e8e4dc">paneer-butter-masala  x1</text>
  <text x="46" y="172" font-size="9.5" fill="#e8e4dc">butter-naan           x2</text>
  <line x1="46" y1="182" x2="208" y2="182" stroke="#2d333d"/>
  <text x="46" y="198" font-size="9" fill="#5cc66f">(menuItemId, qty) — that is all</text>
  <text x="46" y="212" font-size="9" fill="#f06868">no price is stored here</text>

  <rect x="254" y="38" width="216" height="196" rx="10" fill="#14161a" stroke="#3a414c"/>
  <text x="268" y="58" font-size="9" fill="#6b7280">the kitchen</text>
  <text x="270" y="94" font-size="26">🍳</text>
  <text x="312" y="84" font-size="11" fill="#fb863a">Restaurant</text>
  <text x="312" y="100" font-size="9" fill="#9099a8">open 11:00 – 23:00</text>
  <rect x="270" y="114" width="186" height="104" rx="7" fill="#0c0d10" stroke="#2d333d"/>
  <text x="282" y="134" font-size="10.5" fill="#fb863a">MenuItem</text>
  <text x="282" y="154" font-size="9.5" fill="#e8e4dc">paneer…      24000  ✓</text>
  <text x="282" y="172" font-size="9.5" fill="#e8e4dc">butter-naan   6000  ✓</text>
  <text x="282" y="190" font-size="9.5" fill="#f06868">gulab-jamun   9000  ✗ sold out</text>
  <text x="282" y="210" font-size="9" fill="#5cc66f">price + isAvailable live HERE</text>

  <rect x="490" y="38" width="232" height="196" rx="10" fill="#14161a" stroke="#3a414c"/>
  <text x="504" y="58" font-size="9" fill="#6b7280">on the road</text>
  <text x="506" y="94" font-size="26">🛵</text>
  <text x="548" y="84" font-size="11" fill="#fb863a">DeliveryPartner</text>
  <text x="548" y="100" font-size="9" fill="#9099a8">id · eta · current load</text>
  <rect x="506" y="114" width="200" height="104" rx="7" fill="#0c0d10" stroke="rgba(94,159,246,0.45)"/>
  <text x="518" y="134" font-size="10.5" fill="#5e9ff6">«interface» AssignmentStrategy</text>
  <text x="518" y="156" font-size="9.5" fill="#e8e4dc">📍 nearest free</text>
  <text x="518" y="174" font-size="9.5" fill="#e8e4dc">📦 batch two from one kitchen</text>
  <line x1="518" y1="184" x2="694" y2="184" stroke="#2d333d"/>
  <text x="518" y="200" font-size="9" fill="#9099a8">swapping it changes</text>
  <text x="518" y="214" font-size="9" fill="#5cc66f">zero lines of the order flow</text>

  <line x1="126" y1="234" x2="126" y2="248" stroke="#6b7280" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#fd-scene-a)"/>
  <line x1="362" y1="234" x2="362" y2="248" stroke="#6b7280" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#fd-scene-a)"/>
  <line x1="606" y1="234" x2="606" y2="248" stroke="#6b7280" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#fd-scene-a)"/>

  <rect x="18" y="252" width="704" height="134" rx="10" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="274" font-size="11.5" fill="#fb863a">Order</text>
  <text x="86" y="274" font-size="9" fill="#9099a8">— the forty-minute-long object all three of them take turns acting on</text>

  <rect x="34" y="284" width="94" height="26" rx="13" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="52" y="301" font-size="9" fill="#fb863a">PLACED</text>
  <text x="132" y="302" font-size="11" fill="#6b7280">›</text>
  <rect x="146" y="284" width="94" height="26" rx="13" fill="#0c0d10" stroke="#2d333d"/>
  <text x="158" y="301" font-size="9" fill="#9099a8">ACCEPTED</text>
  <text x="244" y="302" font-size="11" fill="#6b7280">›</text>
  <rect x="258" y="284" width="94" height="26" rx="13" fill="#0c0d10" stroke="#2d333d"/>
  <text x="266" y="301" font-size="9" fill="#9099a8">PREPARING</text>
  <text x="356" y="302" font-size="11" fill="#6b7280">›</text>
  <rect x="370" y="284" width="94" height="26" rx="13" fill="#0c0d10" stroke="#2d333d"/>
  <text x="390" y="301" font-size="9" fill="#9099a8">READY</text>
  <text x="468" y="302" font-size="11" fill="#6b7280">›</text>
  <rect x="482" y="284" width="94" height="26" rx="13" fill="#0c0d10" stroke="#2d333d"/>
  <text x="492" y="301" font-size="9" fill="#9099a8">PICKED_UP</text>
  <text x="580" y="302" font-size="11" fill="#6b7280">›</text>
  <rect x="594" y="284" width="94" height="26" rx="13" fill="#0c0d10" stroke="#2d333d"/>
  <text x="606" y="301" font-size="9" fill="#9099a8">DELIVERED</text>

  <text x="52" y="326" font-size="9" fill="#6b7280">🙍 places</text>
  <text x="164" y="326" font-size="9" fill="#6b7280">🍳 accepts</text>
  <text x="276" y="326" font-size="9" fill="#6b7280">🍳 starts</text>
  <text x="388" y="326" font-size="9" fill="#6b7280">🍳 marks</text>
  <text x="500" y="326" font-size="9" fill="#6b7280">🛵 picks up</text>
  <text x="612" y="326" font-size="9" fill="#6b7280">🛵 delivers</text>

  <line x1="34" y1="338" x2="706" y2="338" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="34" y="356" font-size="10" fill="#5cc66f">Bill  36000 + 2000 + 3500 + 1900 − 5000 = 38400 paise</text>
  <text x="34" y="374" font-size="9" fill="#6b7280">built at checkout from the CURRENT menu, then frozen — an order total must never move after PLACED</text>
</svg>`,
        caption:
          "Read the bottom band twice. The **states** are the design; the actor under each pill is the part that beginners leave out; and the **Bill** is computed from the kitchen's *current* prices at checkout, then never again.",
      },
      {
        type: "p",
        text: "Here is why that is harder than it sounds. Three different apps are open at once — the customer's phone, the restaurant's tablet, the partner's rider app — and each one has a button that changes the same order. The customer taps **Cancel** at the exact moment the restaurant taps **Order ready**. A partner taps **Picked up** for an order the kitchen has not started. A retried tap on a flaky connection sends **Place order** twice.",
      },
      {
        type: "p",
        text: "None of those are exotic. They happen every hour in production. And a design that keeps three booleans on the order — `isAccepted`, `isPickedUp`, `isCancelled` — has no way to say *no* to any of them.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Is there one explicit state machine, and does `Order` own it?** Not a set of booleans, not an `if` ladder duplicated in three services. One enum, one transition table, one `transition(event, actor)` method.",
          "**Does every transition name its actor?** *“Who may fire this?”* is half of the domain. `PICK_UP` from `READY` is the partner's move and nobody else's. If your `transition()` takes only an event, you have modelled half the problem.",
          "**Is cancellation modelled as a policy, with money attached?** Free before the restaurant accepts, partial once the food is being cooked, impossible once it is on a bike. That rule is a `CancellationPolicy` object, not four `if`s buried in a controller.",
          "**Is the price recomputed at checkout and then frozen?** The cart holds `(menuItemId, qty)`. The bill is built from the *current* menu at `placeOrder()` time — and the moment the order exists, its total is immutable.",
          "**Is money integer paise?** Item subtotal, packaging, delivery fee, taxes, discount, total — every one a `long`, and the parts must add up to the total exactly, by construction.",
          "**Can you swap partner assignment without touching the order flow?** `AssignmentStrategy` with nearest-free and batched implementations. This is the [[strategy]] question, and it is the easiest place in this problem to score.",
          "**Do you say “search is out of scope” out loud?** Browsing and ranking a menu is a whole other system. Naming it and stubbing it in one sentence buys you twenty minutes for the part that is actually being graded.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The drift to avoid",
        text: "This problem *looks* like it wants a map, a matching algorithm and live GPS. It does not. Geography is a collaborator you call — `partners.candidatesNear(restaurant)` — and it belongs to a different interview. Spend your time on the **lifecycle**: who may do what, from which state, and what it costs. That is where every follow-up question in this round comes from.",
      },
    ],

    // ==================================================================
    howItWorks: [
      // ---------------------------------------------------- step 1
      { type: "h", text: "Step 1 · Clarify — 5 minutes" },
      {
        type: "p",
        text: "The prompt is one sentence, so the first five minutes are yours to shrink it. Ask these, in this order, and write the answers on the board. The full method is in [[five-step-framework]].",
      },
      {
        type: "ul",
        items: [
          "**Who are the actors?** — customer, restaurant, delivery partner, and *the system itself* (timeouts, auto-cancels). Naming the system as a fourth actor early is worth a lot later; it is what makes the auto-reject follow-up trivial.",
          "**What is the life of an order?** — say the six words out loud: *placed, accepted, preparing, ready, picked up, delivered*. If the interviewer nods, you have just been handed your central abstraction. Write it on the board before you write any class.",
          "**Who can cancel, and when?** — this is the question they are waiting for. Ask it and you have shown that you know where the difficulty is.",
          "**One restaurant per order?** — yes. Multi-restaurant carts are a real feature and a total distraction; say “one restaurant per order, so the cart is bound to a restaurant” and move on.",
          "**Do I need search, ranking, recommendations, maps?** — no. *“I will treat menu search and partner geo-lookup as collaborators I call: `menu.search(q)` and `partners.candidatesNear(restaurant)`. I will not implement either.”* Say it once, clearly, and never revisit it.",
          "**Real payments?** — no. `payment.capture(orderId, paise)` returns success. Refunds are recorded, not executed.",
          "**Scale?** — single process, in-memory, one order at a time in the demo. Offer persistence and sharding as a closing paragraph, not as code.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 250" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A two column scope board for the round. In scope: the order state machine with actors, cancellation policy and refunds, a bill recomputed at checkout and frozen, restaurant open hours and item availability, partner assignment behind a strategy interface, and observers for notifications. Out of scope: menu search and ranking, maps and live tracking, real payment gateways, ratings and reviews, the mobile user interface, and persistence.">
  <text x="20" y="24" font-size="10.5" fill="#5cc66f">✓ IN — the ninety minutes go here</text>
  <rect x="20" y="34" width="316" height="200" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="58" font-size="10" fill="#fb863a">Order state machine + who may fire it</text>
  <text x="38" y="80" font-size="10" fill="#fb863a">CancellationPolicy — allowed? refund?</text>
  <text x="38" y="102" font-size="10" fill="#fb863a">Bill built at checkout, then frozen</text>
  <text x="38" y="124" font-size="10" fill="#e8e4dc">Restaurant open hours · item availability</text>
  <text x="38" y="146" font-size="10" fill="#e8e4dc">AssignmentStrategy: nearest / batched</text>
  <text x="38" y="168" font-size="10" fill="#e8e4dc">OrderObserver on every transition</text>
  <text x="38" y="190" font-size="10" fill="#e8e4dc">idempotent placeOrder(requestId)</text>
  <text x="38" y="212" font-size="9" fill="#6b7280">money in integer paise, time passed in</text>

  <text x="364" y="24" font-size="10.5" fill="#f06868">✗ OUT — one sentence each, then never again</text>
  <rect x="364" y="34" width="316" height="200" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="382" y="58" font-size="10" fill="#9099a8">menu search, ranking, recommendations</text>
  <text x="382" y="80" font-size="10" fill="#9099a8">maps, routing, live ETA, GPS tracking</text>
  <text x="382" y="102" font-size="10" fill="#9099a8">real payment gateways and settlement</text>
  <text x="382" y="124" font-size="10" fill="#9099a8">ratings, reviews, loyalty, coupons engine</text>
  <text x="382" y="146" font-size="10" fill="#9099a8">the customer / partner / restaurant UIs</text>
  <text x="382" y="168" font-size="10" fill="#9099a8">persistence, sharding, message queues</text>
  <line x1="382" y1="182" x2="662" y2="182" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="202" font-size="9" fill="#6b7280">“search is a collaborator: menu.search(q).</text>
  <text x="382" y="216" font-size="9" fill="#6b7280">Assume it returns MenuItems.” — complete.</text>
</svg>`,
        caption:
          "Everything orange on the left is what the round is really about. Everything on the right is a system somebody else is interviewing for. Saying so out loud is not laziness — it is the first design decision you make.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Search is the trap in this problem",
        text: "Half of all candidates open by modelling `Cuisine`, `Tag`, `SearchIndex` and a ranking score. Forty minutes later there is no `Order` class. **Browsing is a read path over a catalogue; the interview is about the write path over a lifecycle.** One sentence — *“`menu.search(query)` returns a list of `MenuItem`, stubbed”* — and you are free.",
      },

      // ---------------------------------------------------- step 2
      { type: "h", text: "Step 2 · Nouns to classes — 6 minutes" },
      {
        type: "p",
        text: "Read the prompt back as a story and underline the nouns. *A **customer** browses a **restaurant**'s **menu**, adds **items** to a **cart**, and places an **order**. The restaurant accepts it and cooks. A **delivery partner** picks it up and delivers it. The customer pays a **bill**.* Every underlined word is a class, and two of them hide a decision.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 344" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A mapping table from nouns in the prompt to classes. Customer maps to Customer holding id, name and address. Restaurant maps to Restaurant holding open hours and a menu. Dish maps to MenuItem holding pricePaise and isAvailable. Cart maps to Cart holding menu item ids and quantities with no price. Order maps to Order which owns the state, the frozen item snapshot and the frozen bill. Delivery guy maps to DeliveryPartner. The final total maps to Bill which is a value object of six integer fields. Two callouts mark the two decisions: the cart stores no price, and the order stores a price snapshot.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">the noun in the prompt  →  the class on the board  →  what it owns</text>

  <rect x="20" y="32" width="680" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="50" font-size="9" fill="#6b7280">noun</text>
  <text x="200" y="50" font-size="9" fill="#6b7280">class</text>
  <text x="366" y="50" font-size="9" fill="#6b7280">holds</text>

  <rect x="20" y="62" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="81" font-size="10" fill="#9099a8">“a customer”</text>
  <text x="200" y="81" font-size="10" fill="#e8e4dc">Customer</text>
  <text x="366" y="81" font-size="10" fill="#9099a8">id, name, address</text>

  <rect x="20" y="94" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="113" font-size="10" fill="#9099a8">“a restaurant”</text>
  <text x="200" y="113" font-size="10" fill="#e8e4dc">Restaurant</text>
  <text x="366" y="113" font-size="10" fill="#9099a8">open/close hours, its menu, prep time</text>

  <rect x="20" y="126" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="145" font-size="10" fill="#9099a8">“a dish on the menu”</text>
  <text x="200" y="145" font-size="10" fill="#e8e4dc">MenuItem</text>
  <text x="366" y="145" font-size="10" fill="#fb863a">pricePaise, isAvailable  ← the truth about price</text>

  <rect x="20" y="158" width="680" height="28" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="34" y="177" font-size="10" fill="#9099a8">“adds to a cart”</text>
  <text x="200" y="177" font-size="10" fill="#e8e4dc">Cart · CartLine</text>
  <text x="366" y="177" font-size="10" fill="#5cc66f">(menuItemId, qty)  — decision 1: NO price</text>

  <rect x="20" y="190" width="680" height="28" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="209" font-size="10" fill="#9099a8">“places an order”</text>
  <text x="200" y="209" font-size="10.5" fill="#fb863a">Order</text>
  <text x="366" y="209" font-size="10" fill="#fb863a">state + item snapshot + frozen Bill</text>

  <rect x="20" y="222" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="241" font-size="10" fill="#9099a8">“a delivery guy”</text>
  <text x="200" y="241" font-size="10" fill="#e8e4dc">DeliveryPartner</text>
  <text x="366" y="241" font-size="10" fill="#9099a8">id, eta, current load  (position: not ours)</text>

  <rect x="20" y="254" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="273" font-size="10" fill="#9099a8">“the final total”</text>
  <text x="200" y="273" font-size="10" fill="#e8e4dc">Bill</text>
  <text x="366" y="273" font-size="10" fill="#5cc66f">6 integer fields — decision 2: parts sum to total</text>

  <rect x="20" y="294" width="680" height="38" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="310" font-size="9.5" fill="#fb863a">the two decisions hiding in that table:</text>
  <text x="34" y="326" font-size="9.5" fill="#e8e4dc">1 · Cart stores no price — it is recomputed at checkout.   2 · Order stores a SNAPSHOT — it never changes again.</text>
</svg>`,
        caption:
          "Six of these rows are bookkeeping. Rows four and five are the design: the cart deliberately knows nothing about money, and the order deliberately knows only what money *was* at checkout time. More on finding classes this way in [[identifying-entities]].",
      },

      // ---------------------------------------------------- step 3
      { type: "h", text: "Step 3 · The booleans trap, and the enum that kills it" },
      {
        type: "p",
        text: "Almost every first draft tracks the order's life with flags. It feels natural, because each flag answers a question somebody asked for: *“has the restaurant accepted?”* → `isAccepted`. *“has the rider picked it up?”* → `isPickedUp`. *“was it cancelled?”* → `isCancelled`.",
      },
      {
        type: "p",
        text: "Three booleans is eight combinations. Only five of them mean anything. The other three are states your program can reach, print, save to a database, and show to a user — and no line of code anywhere says they are impossible.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 372" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, a truth table of three booleans isAccepted, isPickedUp and isCancelled producing eight combinations. Five are meaningful and marked in green. Three are struck through in red: picked up but never accepted, picked up and cancelled, and accepted and picked up and cancelled which reads as delivered and cancelled at the same time. On the right, an enum of eight named order states where every value is meaningful and nothing else can exist, with a note that adding preparing and ready as booleans would give thirty two combinations of which only eight mean anything.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ three booleans on the Order</text>
  <rect x="20" y="32" width="392" height="288" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>

  <text x="34" y="52" font-size="8.5" fill="#6b7280">isAccepted</text>
  <text x="102" y="52" font-size="8.5" fill="#6b7280">isPickedUp</text>
  <text x="176" y="52" font-size="8.5" fill="#6b7280">isCancelled</text>
  <text x="256" y="52" font-size="8.5" fill="#6b7280">what it is supposed to mean</text>
  <line x1="34" y1="58" x2="400" y2="58" stroke="#2d333d"/>

  <text x="34" y="76" font-size="9.5" fill="#9099a8">false</text>
  <text x="102" y="76" font-size="9.5" fill="#9099a8">false</text>
  <text x="176" y="76" font-size="9.5" fill="#9099a8">false</text>
  <text x="256" y="76" font-size="9.5" fill="#5cc66f">✓ waiting for the kitchen</text>

  <text x="34" y="98" font-size="9.5" fill="#9099a8">true</text>
  <text x="102" y="98" font-size="9.5" fill="#9099a8">false</text>
  <text x="176" y="98" font-size="9.5" fill="#9099a8">false</text>
  <text x="256" y="98" font-size="9.5" fill="#5cc66f">✓ accepted, cooking (or ready?)</text>

  <text x="34" y="120" font-size="9.5" fill="#9099a8">true</text>
  <text x="102" y="120" font-size="9.5" fill="#9099a8">true</text>
  <text x="176" y="120" font-size="9.5" fill="#9099a8">false</text>
  <text x="256" y="120" font-size="9.5" fill="#5cc66f">✓ on the way (or delivered?)</text>

  <text x="34" y="142" font-size="9.5" fill="#9099a8">false</text>
  <text x="102" y="142" font-size="9.5" fill="#9099a8">false</text>
  <text x="176" y="142" font-size="9.5" fill="#9099a8">true</text>
  <text x="256" y="142" font-size="9.5" fill="#5cc66f">✓ cancelled before acceptance</text>

  <text x="34" y="164" font-size="9.5" fill="#9099a8">true</text>
  <text x="102" y="164" font-size="9.5" fill="#9099a8">false</text>
  <text x="176" y="164" font-size="9.5" fill="#9099a8">true</text>
  <text x="256" y="164" font-size="9.5" fill="#5cc66f">✓ cancelled while cooking</text>

  <text x="34" y="186" font-size="9.5" fill="#f06868">false</text>
  <text x="102" y="186" font-size="9.5" fill="#f06868">true</text>
  <text x="176" y="186" font-size="9.5" fill="#f06868">false</text>
  <text x="256" y="186" font-size="9.5" fill="#f06868">picked up, never accepted</text>
  <line x1="30" y1="182" x2="400" y2="182" stroke="#f06868" stroke-width="1.1"/>

  <text x="34" y="208" font-size="9.5" fill="#f06868">false</text>
  <text x="102" y="208" font-size="9.5" fill="#f06868">true</text>
  <text x="176" y="208" font-size="9.5" fill="#f06868">true</text>
  <text x="256" y="208" font-size="9.5" fill="#f06868">on a bike, and also cancelled</text>
  <line x1="30" y1="204" x2="400" y2="204" stroke="#f06868" stroke-width="1.1"/>

  <text x="34" y="230" font-size="9.5" fill="#f06868">true</text>
  <text x="102" y="230" font-size="9.5" fill="#f06868">true</text>
  <text x="176" y="230" font-size="9.5" fill="#f06868">true</text>
  <text x="256" y="230" font-size="9.5" fill="#f06868">delivered AND cancelled</text>
  <line x1="30" y1="226" x2="400" y2="226" stroke="#f06868" stroke-width="1.1"/>

  <line x1="34" y1="244" x2="400" y2="244" stroke="#2d333d"/>
  <text x="34" y="264" font-size="9.5" fill="#f06868">3 of 8 combinations are nonsense —</text>
  <text x="34" y="280" font-size="9.5" fill="#f06868">and nothing in the code forbids them.</text>
  <text x="34" y="302" font-size="9" fill="#6b7280">PREPARING and READY are not even expressible.</text>
  <text x="34" y="314" font-size="9" fill="#6b7280">Add two more flags: 32 combinations, 8 legal.</text>

  <text x="428" y="22" font-size="10.5" fill="#5cc66f">✓ one enum on the Order</text>
  <rect x="428" y="32" width="292" height="288" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="444" y="54" font-size="10" fill="#9099a8">enum OrderState {</text>
  <text x="456" y="78" font-size="10.5" fill="#e8e4dc">PLACED,</text>
  <text x="456" y="100" font-size="10.5" fill="#e8e4dc">ACCEPTED,</text>
  <text x="456" y="122" font-size="10.5" fill="#e8e4dc">PREPARING,</text>
  <text x="456" y="144" font-size="10.5" fill="#e8e4dc">READY,</text>
  <text x="456" y="166" font-size="10.5" fill="#e8e4dc">PICKED_UP,</text>
  <text x="456" y="188" font-size="10.5" fill="#5cc66f">DELIVERED,</text>
  <text x="456" y="210" font-size="10.5" fill="#5cc66f">CANCELLED,</text>
  <text x="456" y="232" font-size="10.5" fill="#5cc66f">REJECTED</text>
  <text x="444" y="254" font-size="10" fill="#9099a8">}</text>
  <line x1="444" y1="266" x2="704" y2="266" stroke="#2d333d"/>
  <text x="444" y="284" font-size="9.5" fill="#5cc66f">8 values. All 8 mean something.</text>
  <text x="444" y="300" font-size="9.5" fill="#5cc66f">Nothing else is representable.</text>
  <text x="444" y="314" font-size="9" fill="#6b7280">green = terminal, nothing follows them</text>

  <rect x="20" y="332" width="700" height="32" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="352" font-size="10" fill="#fb863a">The sentence to say: “I want illegal states to be unrepresentable, not merely unlikely.”</text>
</svg>`,
        caption:
          "The struck-through rows are not hypothetical. `isDelivered && isCancelled` is a real production ticket, and it is always found by an accountant, not by a test. Background: [[state]] and [[state-diagrams]].",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Booleans do not just allow bad states — they hide good ones",
        text: "Look at row two of the table: `isAccepted=true, isPickedUp=false` is *both* “cooking” and “ready and waiting on the counter”. Those are different things to a restaurant, to a partner, and to the customer's ETA. Flags collapse states you need. Every time you find yourself writing `if (isAccepted && !isPickedUp && preparedAt != null)`, that expression **is** a state, and it wants a name.",
      },

      // ---------------------------------------------------- step 4
      { type: "h", text: "Step 4 · One state machine, and it belongs to `Order`" },
      {
        type: "p",
        text: "The enum is only half of it. The other half is the **transition table**: a list of `(from, event, actor) → to` rows, and a single method that consults it. Nothing else in the system is allowed to assign to `order.state`.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 486" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The order state machine drawn as a vertical chain. PLACED goes to ACCEPTED on the ACCEPT event fired by the restaurant, then to PREPARING on START_PREP by the restaurant, then to READY on MARK_READY by the restaurant, then to PICKED_UP on PICK_UP by the delivery partner, then to DELIVERED on DELIVER by the partner. On the right, PLACED also goes to REJECTED, fired either by the restaurant or automatically by the system after ninety seconds. Four states, PLACED, ACCEPTED, PREPARING and READY, each have a CANCEL edge fired by the customer into CANCELLED. PICKED_UP has no CANCEL edge at all. DELIVERED, CANCELLED and REJECTED are terminal, drawn with a double border.">
  <defs>
    <marker id="fd-sm-a" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="fd-sm-x" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="14" y="18" font-size="10.5" fill="#9099a8">every edge names the event AND the actor allowed to fire it</text>

  <rect x="250" y="28" width="170" height="36" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="290" y="51" font-size="11" fill="#fb863a">PLACED</text>
  <rect x="250" y="98" width="170" height="36" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="286" y="121" font-size="11" fill="#e8e4dc">ACCEPTED</text>
  <rect x="250" y="168" width="170" height="36" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="284" y="191" font-size="11" fill="#e8e4dc">PREPARING</text>
  <rect x="250" y="238" width="170" height="36" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="298" y="261" font-size="11" fill="#e8e4dc">READY</text>
  <rect x="250" y="308" width="170" height="36" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="284" y="331" font-size="11" fill="#e8e4dc">PICKED_UP</text>
  <rect x="250" y="378" width="170" height="36" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.55)"/>
  <rect x="254" y="382" width="162" height="28" rx="4" fill="none" stroke="rgba(92,198,111,0.35)"/>
  <text x="284" y="401" font-size="11" fill="#5cc66f">DELIVERED</text>

  <line x1="335" y1="66" x2="335" y2="94" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-sm-a)"/>
  <line x1="335" y1="136" x2="335" y2="164" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-sm-a)"/>
  <line x1="335" y1="206" x2="335" y2="234" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-sm-a)"/>
  <line x1="335" y1="276" x2="335" y2="304" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-sm-a)"/>
  <line x1="335" y1="346" x2="335" y2="374" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-sm-a)"/>

  <text x="326" y="85" font-size="9" fill="#9099a8" text-anchor="end">ACCEPT (🍳 restaurant)</text>
  <text x="326" y="155" font-size="9" fill="#9099a8" text-anchor="end">START_PREP (🍳 restaurant)</text>
  <text x="326" y="225" font-size="9" fill="#9099a8" text-anchor="end">MARK_READY (🍳 restaurant)</text>
  <text x="326" y="295" font-size="9" fill="#9099a8" text-anchor="end">PICK_UP (🛵 partner)</text>
  <text x="326" y="365" font-size="9" fill="#9099a8" text-anchor="end">DELIVER (🛵 partner)</text>

  <rect x="560" y="28" width="150" height="36" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.5)"/>
  <rect x="564" y="32" width="142" height="28" rx="4" fill="none" stroke="rgba(240,104,104,0.3)"/>
  <text x="596" y="51" font-size="11" fill="#f06868">REJECTED</text>
  <line x1="420" y1="46" x2="556" y2="46" stroke="#f06868" stroke-width="1.2" marker-end="url(#fd-sm-x)"/>
  <text x="426" y="38" font-size="8" fill="#9099a8">REJECT (🍳 restaurant)</text>
  <text x="426" y="60" font-size="8" fill="#9099a8">REJECT (⚙️ auto after 90s)</text>

  <rect x="560" y="230" width="150" height="36" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.5)"/>
  <rect x="564" y="234" width="142" height="28" rx="4" fill="none" stroke="rgba(240,104,104,0.3)"/>
  <text x="590" y="253" font-size="11" fill="#f06868">CANCELLED</text>
  <line x1="420" y1="62" x2="556" y2="246" stroke="#f06868" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#fd-sm-x)"/>
  <line x1="420" y1="124" x2="556" y2="246" stroke="#f06868" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#fd-sm-x)"/>
  <line x1="420" y1="192" x2="556" y2="246" stroke="#f06868" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#fd-sm-x)"/>
  <line x1="420" y1="258" x2="556" y2="250" stroke="#f06868" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#fd-sm-x)"/>
  <text x="556" y="286" font-size="9" fill="#f06868">CANCEL (🙍 customer)</text>
  <text x="556" y="300" font-size="8.5" fill="#6b7280">— legal from those four states only</text>

  <text x="440" y="326" font-size="9" fill="#f06868">✗ PICKED_UP has no CANCEL edge</text>
  <text x="440" y="342" font-size="8.5" fill="#6b7280">the food is on a bike; this is a support</text>
  <text x="440" y="356" font-size="8.5" fill="#6b7280">ticket, not a state transition</text>

  <rect x="14" y="300" width="176" height="146" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="26" y="320" font-size="9" fill="#6b7280">who may fire what</text>
  <line x1="26" y1="328" x2="178" y2="328" stroke="#2d333d"/>
  <text x="26" y="344" font-size="7.5" fill="#e8e4dc">🙍 CUSTOMER — place, cancel</text>
  <text x="26" y="362" font-size="7.5" fill="#e8e4dc">🍳 RESTAURANT — accept, reject,</text>
  <text x="26" y="374" font-size="7.5" fill="#e8e4dc">      start prep, mark ready</text>
  <text x="26" y="392" font-size="7.5" fill="#e8e4dc">🛵 PARTNER — pick up, deliver</text>
  <text x="26" y="410" font-size="7.5" fill="#e8e4dc">⚙️ SYSTEM — timeouts only</text>
  <line x1="26" y1="420" x2="178" y2="420" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="26" y="436" font-size="7.5" fill="#5cc66f">▣ double border = terminal</text>

  <text x="14" y="470" font-size="9.5" fill="#6b7280">8 states · 11 edges · 4 actors — the whole domain fits on one board, and it is the only place state changes</text>
</svg>`,
        caption:
          "Count the edges: **eleven**. That is the entire rulebook. Anything not on this picture is refused by one `throw` in one method — which is why the refusal message can be precise, and why a new rule is one new row.",
      },
      {
        type: "p",
        text: "The table gives you something a pile of `if`s never does: when a move is refused, you can say **why** in two distinguishable ways. Either there is no edge for that event from that state at all (*a missing transition*), or the edge exists but belongs to somebody else (*a wrong actor*). Those are different bugs in the calling app, and telling them apart is what makes the error message useful.",
      },
      {
        type: "code",
        language: "java",
        filename: "the whole rulebook, and the one method that enforces it",
        code: `/** (from, event, who) -> to.  Eleven rows. Nothing else is legal. */
private static final List<Transition> TABLE = List.of(
    new Transition(PLACED,    ACCEPT,     RESTAURANT, ACCEPTED),
    new Transition(PLACED,    REJECT,     RESTAURANT, REJECTED),
    new Transition(PLACED,    REJECT,     SYSTEM,     REJECTED),   // auto-reject timeout
    new Transition(PLACED,    CANCEL,     CUSTOMER,   CANCELLED),
    new Transition(ACCEPTED,  START_PREP, RESTAURANT, PREPARING),
    new Transition(ACCEPTED,  CANCEL,     CUSTOMER,   CANCELLED),
    new Transition(PREPARING, MARK_READY, RESTAURANT, READY),
    new Transition(PREPARING, CANCEL,     CUSTOMER,   CANCELLED),
    new Transition(READY,     PICK_UP,    PARTNER,    PICKED_UP),
    new Transition(READY,     CANCEL,     CUSTOMER,   CANCELLED),
    new Transition(PICKED_UP, DELIVER,    PARTNER,    DELIVERED));

/**
 * ONE place decides legality, and it distinguishes the two failures:
 *   - no row for (from, event)            -> "missing transition"
 *   - a row exists but for another actor  -> "wrong actor"
 */
static OrderState next(OrderState from, OrderEvent event, Actor who) {
    Actor owner = null;
    for (Transition t : TABLE) {
        if (t.from() != from || t.event() != event) continue;
        owner = t.actor();
        if (t.actor() == who) return t.to();
    }
    if (owner == null)
        throw new IllegalTransition(event + " is not a legal event from " + from);
    throw new IllegalTransition(event + " from " + from + " is " + owner + "'s move, not " + who + "'s");
}`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "The line that scores this section",
        text: "*“Nothing outside `Order.transition()` assigns to the state field. The restaurant service, the partner service and the customer service all call the same method with their own `Actor`, and the order decides.”* Say it, then make the field `private` and never expose a setter. That single sentence is the difference between a state machine and a diagram of one.",
      },
      {
        type: "p",
        text: "And now the concurrency paragraph, which in *this* problem is short and honest. Two actors can fire at the same instant — the customer taps **Cancel** while the restaurant taps **Ready**. The fix is one lock per order (or a compare-and-set on the state field), because the guarded region is a table lookup and one field write. There is no hot shared resource here the way there is in a seat-booking or ride-matching problem; an order is touched by three people over forty minutes. Take the cheap lock, say why it is cheap, and move on. Depth if they push: [[locks-mutex-semaphore]] and [[atomic-operations-and-cas]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 330" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A swimlane timeline over forty simulated minutes with four lanes: customer, restaurant, delivery partner and system. At minute zero the customer places the order. At minute one the system freezes the bill and notifies the kitchen. At minute two the restaurant accepts. At minute three it starts preparing. At minute four the system assigns a delivery partner. At minute eighteen the restaurant marks the order ready. At minute twenty the partner picks it up. At minute thirty eight the partner delivers it. A dashed vertical line at minute twenty marks the point after which cancellation is no longer possible.">
  <text x="18" y="20" font-size="10.5" fill="#9099a8">the same order, forty simulated minutes, four lanes — the turns are the design</text>

  <line x1="120" y1="46" x2="720" y2="46" stroke="#2d333d"/>
  <text x="122" y="40" font-size="8.5" fill="#6b7280">0 min</text>
  <text x="264" y="40" font-size="8.5" fill="#6b7280">10</text>
  <text x="414" y="40" font-size="8.5" fill="#6b7280">20</text>
  <text x="564" y="40" font-size="8.5" fill="#6b7280">30</text>
  <text x="694" y="40" font-size="8.5" fill="#6b7280">40</text>

  <text x="18" y="80" font-size="10" fill="#fb863a">🙍 customer</text>
  <line x1="120" y1="76" x2="720" y2="76" stroke="#232830" stroke-dasharray="3 4"/>
  <text x="18" y="130" font-size="10" fill="#fb863a">🍳 restaurant</text>
  <line x1="120" y1="126" x2="720" y2="126" stroke="#232830" stroke-dasharray="3 4"/>
  <text x="18" y="180" font-size="10" fill="#fb863a">🛵 partner</text>
  <line x1="120" y1="176" x2="720" y2="176" stroke="#232830" stroke-dasharray="3 4"/>
  <text x="18" y="230" font-size="10" fill="#fb863a">⚙️ system</text>
  <line x1="120" y1="226" x2="720" y2="226" stroke="#232830" stroke-dasharray="3 4"/>

  <circle cx="126" cy="76" r="5" fill="#fb863a"/>
  <text x="118" y="66" font-size="8.5" fill="#e8e4dc">placeOrder</text>
  <circle cx="140" cy="226" r="5" fill="#5e9ff6"/>
  <text x="132" y="248" font-size="8.5" fill="#9099a8">freeze bill · notify kitchen</text>
  <circle cx="156" cy="126" r="5" fill="#fb863a"/>
  <text x="150" y="116" font-size="8.5" fill="#e8e4dc">ACCEPT</text>
  <circle cx="172" cy="126" r="5" fill="#fb863a"/>
  <text x="192" y="116" font-size="8.5" fill="#e8e4dc">START_PREP</text>
  <circle cx="186" cy="226" r="5" fill="#5e9ff6"/>
  <text x="200" y="268" font-size="8.5" fill="#9099a8">assign partner (strategy)</text>
  <line x1="186" y1="232" x2="196" y2="262" stroke="#3a414c" stroke-width="0.8"/>

  <circle cx="390" cy="126" r="5" fill="#fb863a"/>
  <text x="368" y="116" font-size="8.5" fill="#e8e4dc">MARK_READY</text>
  <circle cx="420" cy="176" r="5" fill="#fb863a"/>
  <text x="408" y="166" font-size="8.5" fill="#e8e4dc">PICK_UP</text>
  <circle cx="690" cy="176" r="5" fill="#5cc66f"/>
  <text x="654" y="166" font-size="8.5" fill="#5cc66f">DELIVER</text>
  <line x1="426" y1="176" x2="684" y2="176" stroke="#3a414c" stroke-width="1.4"/>
  <text x="500" y="192" font-size="8.5" fill="#6b7280">on the road — 18 minutes</text>

  <line x1="420" y1="56" x2="420" y2="300" stroke="#f06868" stroke-width="1" stroke-dasharray="5 4"/>
  <text x="428" y="292" font-size="9" fill="#f06868">after PICK_UP no cancel edge exists</text>

  <rect x="120" y="286" width="290" height="26" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="132" y="304" font-size="9" fill="#fb863a">cancel window: refund 100% → 50% → 25% → ✗</text>
</svg>`,
        caption:
          "The lanes are why booleans fail. Three different processes, on three different devices, each pushing the *same object* forward — and the only thing standing between them and nonsense is a table that says who is allowed to do what next.",
      },

      // ---------------------------------------------------- step 5
      { type: "h", text: "Step 5 · Cancellation is the hard question, and it is a money question" },
      {
        type: "p",
        text: "Every interviewer asks about cancellation, because it is where a lifecycle stops being a diagram and starts being a refund. Two questions, and they must be answered by two different objects.",
      },
      {
        type: "ol",
        items: [
          "***Is cancelling legal from here, and by whom?*** — the **state machine** answers this. There is a `CANCEL` edge from `PLACED`, `ACCEPTED`, `PREPARING` and `READY`, all owned by the customer. There is no `CANCEL` edge from `PICKED_UP` at all, so the answer is not a policy decision, it is a missing row.",
          "***What does it cost?*** — the **`CancellationPolicy`** answers this, and nothing else in the system knows the numbers. Free before the kitchen accepts. Half back once they are cooking, because the food is already made and somebody paid for it. A quarter back once it is boxed and waiting. Nothing back after the wheels move.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 320" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A matrix of order state against actor showing who may cancel or reject from each state and what the refund is on a 384 rupee order. From PLACED the customer may cancel with a full refund, the restaurant may reject, and the system may auto reject after ninety seconds. From ACCEPTED only the customer may cancel, still with a full refund. From PREPARING the customer may cancel with a fifty percent refund of 192 rupees. From READY the customer may cancel with a twenty five percent refund of 96 rupees. From PICKED_UP and DELIVERED nobody may cancel; there is no edge at all. A footer states that refund plus kept always equals the total exactly.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">cancellation by state and actor  —  on an order whose frozen total is 38400 paise (₹384.00)</text>

  <rect x="20" y="32" width="680" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="32" y="50" font-size="9" fill="#6b7280">state</text>
  <text x="140" y="50" font-size="9" fill="#6b7280">🙍 CUSTOMER</text>
  <text x="272" y="50" font-size="9" fill="#6b7280">🍳 RESTAURANT</text>
  <text x="404" y="50" font-size="9" fill="#6b7280">⚙️ SYSTEM</text>
  <text x="524" y="50" font-size="9" fill="#6b7280">refund to the customer</text>

  <rect x="20" y="62" width="680" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="32" y="82" font-size="10" fill="#e8e4dc">PLACED</text>
  <text x="140" y="82" font-size="10" fill="#5cc66f">CANCEL ✓</text>
  <text x="272" y="82" font-size="10" fill="#5cc66f">REJECT ✓</text>
  <text x="404" y="82" font-size="10" fill="#5cc66f">REJECT after 90s</text>
  <text x="524" y="82" font-size="10" fill="#5cc66f">100%  →  38400</text>

  <rect x="20" y="96" width="680" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="32" y="116" font-size="10" fill="#e8e4dc">ACCEPTED</text>
  <text x="140" y="116" font-size="10" fill="#5cc66f">CANCEL ✓</text>
  <text x="272" y="116" font-size="10" fill="#6b7280">—</text>
  <text x="404" y="116" font-size="10" fill="#6b7280">—</text>
  <text x="524" y="116" font-size="10" fill="#5cc66f">100%  →  38400</text>

  <rect x="20" y="130" width="680" height="30" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="32" y="150" font-size="10" fill="#e8e4dc">PREPARING</text>
  <text x="140" y="150" font-size="10" fill="#fb863a">CANCEL ✓</text>
  <text x="272" y="150" font-size="10" fill="#6b7280">—</text>
  <text x="404" y="150" font-size="10" fill="#6b7280">—</text>
  <text x="524" y="150" font-size="10" fill="#fb863a">50%   →  19200   (kitchen keeps 19200)</text>

  <rect x="20" y="164" width="680" height="30" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="32" y="184" font-size="10" fill="#e8e4dc">READY</text>
  <text x="140" y="184" font-size="10" fill="#fb863a">CANCEL ✓</text>
  <text x="272" y="184" font-size="10" fill="#6b7280">—</text>
  <text x="404" y="184" font-size="10" fill="#6b7280">—</text>
  <text x="524" y="184" font-size="10" fill="#fb863a">25%   →   9600   (kitchen keeps 28800)</text>

  <rect x="20" y="198" width="680" height="30" rx="5" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="32" y="218" font-size="10" fill="#e8e4dc">PICKED_UP</text>
  <text x="140" y="218" font-size="10" fill="#f06868">no edge</text>
  <text x="272" y="218" font-size="10" fill="#f06868">no edge</text>
  <text x="404" y="218" font-size="10" fill="#f06868">no edge</text>
  <text x="524" y="218" font-size="10" fill="#f06868">refused — support ticket, not a transition</text>

  <rect x="20" y="232" width="680" height="30" rx="5" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="32" y="252" font-size="10" fill="#e8e4dc">DELIVERED</text>
  <text x="140" y="252" font-size="10" fill="#f06868">no edge</text>
  <text x="272" y="252" font-size="10" fill="#f06868">no edge</text>
  <text x="404" y="252" font-size="10" fill="#f06868">no edge</text>
  <text x="524" y="252" font-size="10" fill="#f06868">terminal — nothing follows it</text>

  <rect x="20" y="272" width="680" height="36" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="34" y="288" font-size="9.5" fill="#5cc66f">refund = (total × bps + 5000) / 10000 in integer paise, and kept = total − refund</text>
  <text x="34" y="302" font-size="9" fill="#9099a8">so refund + kept == total, exactly, for every state — the same discipline as the bill, one line of code</text>
</svg>`,
        caption:
          "Two objects, two questions. The **grey dashes and the red “no edge” cells come from the transition table**; the percentage column comes from the policy. Change the business rule to *“full refund up to two minutes after acceptance”* and only the policy file moves.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Why the policy is a separate object, not four `if`s",
        text: "Refund rules change constantly, per city, per restaurant tier, per promotion, and they are the thing a product manager edits on a Friday. A `CancellationPolicy` interface with one method — `refundBpsFor(state)` — means a new rule is a new class, `Order` is untouched, and you can unit-test the money without constructing an order at all. This is [[strategy]] again, wearing a different hat, and [[single-responsibility]] doing the work.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The nuance interviewers love: rejection is not cancellation",
        text: "A customer **cancels**. A restaurant **rejects** — “we are out of paneer”, “the kitchen is slammed”. They land in different terminal states because the accounting, the notification text, and the restaurant's own metrics all differ. Two states, not one with a `reason` string. If you only have `CANCELLED`, you cannot answer *“what fraction of orders does this restaurant refuse?”* without parsing free text.",
      },

      // ---------------------------------------------------- step 6
      { type: "h", text: "Step 6 · Never store the price on the cart line" },
      {
        type: "p",
        text: "Somebody adds a paneer butter masala to their cart at 9pm and gets distracted. At 10pm the restaurant raises the price. At 10:05 they open the app and hit checkout. What do they pay?",
      },
      {
        type: "p",
        text: "If the cart stored the price, they pay yesterday's number, and the restaurant is quietly out of pocket on every stale cart in the city. If the price had gone *down* instead, the customer is overcharged and writes a review about it. Both are the same bug: **a cart is a wish, not a contract**.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 322" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two timelines side by side. On the left the cart stores the price: at nine pm the item is added at 24000 paise, at ten pm the restaurant raises the price to 27000, and at five past ten checkout charges the stale 24000 so the restaurant loses 3000 paise on every stale cart. On the right the cart stores only the item id and quantity: at checkout the bill is rebuilt from the current menu at 27000, giving a new total of 41550, which is then frozen onto the order so that a later price change to 30000 does not move the order total.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ the cart stores the price</text>
  <rect x="20" y="32" width="340" height="234" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="36" y="56" font-size="9.5" fill="#6b7280">21:00</text>
  <text x="92" y="56" font-size="9.5" fill="#e8e4dc">CartLine{ paneer, qty 1, price 24000 }</text>
  <text x="36" y="84" font-size="9.5" fill="#6b7280">22:00</text>
  <text x="92" y="84" font-size="9.5" fill="#fb863a">menu: paneer 24000 → 27000</text>
  <text x="36" y="112" font-size="9.5" fill="#6b7280">22:05</text>
  <text x="92" y="112" font-size="9.5" fill="#f06868">checkout charges 24000 — the stale copy</text>
  <line x1="36" y1="126" x2="344" y2="126" stroke="#2d333d"/>
  <text x="36" y="148" font-size="9.5" fill="#f06868">the restaurant is out 3000 paise, silently,</text>
  <text x="36" y="164" font-size="9.5" fill="#f06868">on every cart that was open when prices moved</text>
  <text x="36" y="192" font-size="9" fill="#9099a8">and if the price had gone DOWN, the customer</text>
  <text x="36" y="206" font-size="9" fill="#9099a8">is overcharged — same bug, angrier ticket</text>
  <text x="36" y="234" font-size="9" fill="#6b7280">the price now lives in two places and</text>
  <text x="36" y="248" font-size="9" fill="#6b7280">nothing keeps them equal</text>

  <text x="384" y="22" font-size="10.5" fill="#5cc66f">✓ the cart stores (menuItemId, qty)</text>
  <rect x="384" y="32" width="336" height="234" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="400" y="56" font-size="9.5" fill="#6b7280">21:00</text>
  <text x="456" y="56" font-size="9.5" fill="#e8e4dc">CartLine{ paneer, qty 1 }</text>
  <text x="400" y="84" font-size="9.5" fill="#6b7280">22:00</text>
  <text x="456" y="84" font-size="9.5" fill="#fb863a">menu: paneer 24000 → 27000</text>
  <text x="400" y="112" font-size="9.5" fill="#6b7280">22:05</text>
  <text x="456" y="112" font-size="9.5" fill="#5cc66f">checkout reads the CURRENT menu → 27000</text>
  <line x1="400" y1="126" x2="708" y2="126" stroke="#2d333d"/>
  <text x="400" y="148" font-size="9.5" fill="#e8e4dc">Bill rebuilt: 39000 + 2000 + 3500 + 2050 − 5000</text>
  <text x="400" y="166" font-size="11" fill="#5cc66f">total = 41550 paise   📌 FROZEN onto the order</text>
  <line x1="400" y1="180" x2="708" y2="180" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="400" y="202" font-size="9.5" fill="#6b7280">23:00  menu: paneer 27000 → 30000</text>
  <text x="400" y="220" font-size="9.5" fill="#5cc66f">order.bill.total is still 41550 — it cannot move</text>
  <text x="400" y="244" font-size="9" fill="#9099a8">the Order carries an OrderItem SNAPSHOT:</text>
  <text x="400" y="258" font-size="9" fill="#9099a8">name + unitPaise + qty, copied at checkout</text>

  <rect x="20" y="278" width="700" height="34" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="299" font-size="10" fill="#fb863a">Cart = live, recomputed on every view.   Order = frozen, computed once at PLACED and never again.</text>
</svg>`,
        caption:
          "Two objects that look similar and have opposite rules. Getting this backwards is the most common *silent* mistake in this problem, because a demo with one price change never shows it.",
      },
      {
        type: "p",
        text: "The freeze matters as much as the recompute. Once the order exists, its total is part of a payment, a receipt, a refund calculation and a restaurant payout. If a menu edit could reach backwards and change it, every one of those becomes unreproducible. So `Order` holds `List<OrderItem>` — a snapshot of `(name, unitPaise, qty)` — and a `Bill`, both immutable. See [[immutability-and-value-objects]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 316" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A bill breakdown card in integer paise. Item subtotal 36000, packaging 2000, delivery fee 3500, taxes 1900, discount minus 5000, total 38400. Beside it two rules: first, the total is defined as the sum of the five rounded components so the printed breakdown always adds up; second, when a flat fifty rupee coupon must be shown per line across three units, the split is 1667 plus 1667 plus 1666 which is exactly 5000, giving the leftover paisa away rather than rounding it away.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">every field is a long of paise — there is no double anywhere in this system</text>

  <rect x="20" y="34" width="320" height="212" rx="8" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="36" y="56" font-size="10.5" fill="#fb863a">Bill  «value object, immutable»</text>
  <line x1="36" y1="66" x2="324" y2="66" stroke="#2d333d"/>
  <text x="36" y="88" font-size="10" fill="#9099a8">itemSubtotal</text>
  <text x="230" y="88" font-size="10.5" fill="#e8e4dc">36000</text>
  <text x="36" y="110" font-size="10" fill="#9099a8">packaging</text>
  <text x="230" y="110" font-size="10.5" fill="#e8e4dc">+  2000</text>
  <text x="36" y="132" font-size="10" fill="#9099a8">deliveryFee</text>
  <text x="230" y="132" font-size="10.5" fill="#e8e4dc">+  3500</text>
  <text x="36" y="154" font-size="10" fill="#9099a8">taxes  (5% of 38000)</text>
  <text x="230" y="154" font-size="10.5" fill="#e8e4dc">+  1900</text>
  <text x="36" y="176" font-size="10" fill="#9099a8">discount  (SAVE50)</text>
  <text x="230" y="176" font-size="10.5" fill="#e8e4dc">−  5000</text>
  <line x1="36" y1="188" x2="324" y2="188" stroke="#3a414c" stroke-width="1.4"/>
  <text x="36" y="210" font-size="11" fill="#5cc66f">total</text>
  <text x="222" y="212" font-size="14" fill="#5cc66f">38400</text>
  <text x="36" y="234" font-size="9" fill="#6b7280">₹384.00  —  frozen at PLACED, forever</text>

  <text x="364" y="22" font-size="10.5" fill="#5cc66f">the two rounding rules</text>
  <rect x="364" y="34" width="336" height="98" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="378" y="56" font-size="10" fill="#5cc66f">1 · the total is DEFINED as the sum</text>
  <text x="378" y="76" font-size="9.5" fill="#e8e4dc">total = subtotal + pack + fee + tax − discount</text>
  <text x="378" y="96" font-size="9" fill="#9099a8">never compute it separately and round at the end —</text>
  <text x="378" y="110" font-size="9" fill="#9099a8">then the printed breakdown would not add up, and a</text>
  <text x="378" y="124" font-size="9" fill="#9099a8">customer WILL add up the printed breakdown</text>

  <rect x="364" y="142" width="336" height="104" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="378" y="164" font-size="10" fill="#5cc66f">2 · give the leftover paisa away, do not drop it</text>
  <text x="378" y="186" font-size="9.5" fill="#9099a8">the ₹50 coupon shown per line, 3 units:</text>
  <text x="378" y="206" font-size="10.5" fill="#e8e4dc">1667  +  1667  +  1666  =  5000  ✓</text>
  <text x="378" y="226" font-size="9" fill="#9099a8">base = 5000 / 3 = 1666, remainder = 2, hand the two</text>
  <text x="378" y="240" font-size="9" fill="#9099a8">extra paise to the first two lines — deterministic</text>

  <rect x="20" y="262" width="680" height="42" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="280" font-size="10" fill="#fb863a">Assert it in the constructor: if (subtotal + pack + fee + tax − discount != total) throw.</text>
  <text x="34" y="296" font-size="9.5" fill="#e8e4dc">A Bill that does not add up should be impossible to construct, not merely unlikely to be printed.</text>
</svg>`,
        caption:
          "The compact constructor is where this lives — a `Bill` whose parts do not sum to its total cannot exist as an object. Same idea as the zero-sum assertion in [[splitwise]], one scope smaller.",
      },

      // ---------------------------------------------------- class diagram
      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 546" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. Cart holds CartLine rows of menu item id and quantity with no price. Restaurant owns MenuItem rows carrying price in paise and an availability flag, and knows its opening hours. Order is the centre: it holds a private OrderState, an immutable list of OrderItem snapshots, a frozen Bill, and a single transition method taking an event and an actor. Order depends on four interfaces on the right: OrderStateMachine holding the transition table, CancellationPolicy returning refund basis points per state, AssignmentStrategy choosing a delivery partner, and OrderObserver notified on every transition. Each interface has concrete implementations shown beneath. DeliveryPartner and a stubbed PartnerDirectory sit on the left.">
  <defs>
    <marker id="fd-cls-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="fd-cls-i" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <rect x="14" y="26" width="204" height="76" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="26" y="46" font-size="11" fill="#e8e4dc">Cart</text>
  <line x1="14" y1="54" x2="218" y2="54" stroke="#2d333d"/>
  <text x="26" y="72" font-size="9.5" fill="#9099a8">- restaurantId : String</text>
  <text x="26" y="90" font-size="9.5" fill="#5cc66f">- lines : List&lt;CartLine&gt;   no price</text>

  <rect x="14" y="118" width="204" height="90" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="26" y="138" font-size="11" fill="#e8e4dc">Restaurant</text>
  <line x1="14" y1="146" x2="218" y2="146" stroke="#2d333d"/>
  <text x="26" y="164" font-size="9.5" fill="#9099a8">- menu : Map&lt;String, MenuItem&gt;</text>
  <text x="26" y="182" font-size="9.5" fill="#9099a8">- openMin, closeMin : int</text>
  <text x="26" y="200" font-size="9.5" fill="#e8e4dc">+ isOpenAt(minuteOfDay)</text>

  <rect x="14" y="224" width="204" height="86" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="26" y="244" font-size="11" fill="#e8e4dc">MenuItem</text>
  <line x1="14" y1="252" x2="218" y2="252" stroke="#2d333d"/>
  <text x="26" y="270" font-size="9.5" fill="#fb863a">- pricePaise : long   ← the truth</text>
  <text x="26" y="288" font-size="9.5" fill="#fb863a">- isAvailable : boolean</text>
  <text x="26" y="304" font-size="8.5" fill="#6b7280">mutable — the kitchen edits it any time</text>
  <path d="M116,208 L116,214 L108,219 L116,224 L124,219 L116,214" fill="#e8e4dc" stroke="#e8e4dc"/>

  <rect x="14" y="330" width="204" height="76" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="26" y="350" font-size="11" fill="#e8e4dc">DeliveryPartner</text>
  <line x1="14" y1="358" x2="218" y2="358" stroke="#2d333d"/>
  <text x="26" y="376" font-size="9.5" fill="#9099a8">- etaMinutes : int</text>
  <text x="26" y="394" font-size="9.5" fill="#9099a8">- activeOrders : List&lt;String&gt;</text>

  <rect x="14" y="422" width="204" height="72" rx="6" fill="#14161a" stroke="#2d333d" stroke-dasharray="4 3"/>
  <text x="26" y="442" font-size="10.5" fill="#6b7280">PartnerDirectory  «stub»</text>
  <line x1="14" y1="450" x2="218" y2="450" stroke="#2d333d"/>
  <text x="26" y="468" font-size="9.5" fill="#9099a8">+ candidatesNear(restaurant)</text>
  <text x="26" y="486" font-size="8.5" fill="#6b7280">geo lives in another interview</text>

  <rect x="252" y="26" width="216" height="204" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.4"/>
  <text x="264" y="46" font-size="12" fill="#fb863a">Order</text>
  <text x="404" y="46" font-size="8.5" fill="#6b7280">«aggregate»</text>
  <line x1="252" y1="54" x2="468" y2="54" stroke="#2d333d"/>
  <text x="264" y="74" font-size="9.5" fill="#fb863a">- state : OrderState    private!</text>
  <text x="264" y="92" font-size="9.5" fill="#9099a8">- items : List&lt;OrderItem&gt;</text>
  <text x="264" y="110" font-size="9.5" fill="#9099a8">- bill : Bill           frozen</text>
  <text x="264" y="128" font-size="9.5" fill="#9099a8">- placedAtMin : int</text>
  <text x="264" y="146" font-size="9.5" fill="#9099a8">- assignment : Assignment</text>
  <line x1="264" y1="158" x2="456" y2="158" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="264" y="178" font-size="10" fill="#e8e4dc">+ transition(event, actor, atMin)</text>
  <text x="264" y="196" font-size="10" fill="#e8e4dc">+ cancellationQuote()</text>
  <text x="264" y="214" font-size="10" fill="#e8e4dc">+ state()  — getter, no setter</text>
  <line x1="222" y1="60" x2="248" y2="60" stroke="#9099a8" stroke-width="1.2" marker-end="url(#fd-cls-a)"/>
  <line x1="222" y1="150" x2="248" y2="120" stroke="#9099a8" stroke-width="1.2" marker-end="url(#fd-cls-a)"/>

  <rect x="252" y="248" width="216" height="66" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="264" y="268" font-size="11" fill="#e8e4dc">OrderItem  «snapshot»</text>
  <line x1="252" y1="276" x2="468" y2="276" stroke="#2d333d"/>
  <text x="264" y="294" font-size="9.5" fill="#9099a8">name · unitPaise · qty</text>
  <text x="264" y="308" font-size="8.5" fill="#5cc66f">copied at checkout, never edited again</text>
  <path d="M360,230 L360,236 L352,241 L360,246 L368,241 L360,236" fill="#e8e4dc" stroke="#e8e4dc"/>

  <rect x="252" y="332" width="216" height="126" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.55)"/>
  <text x="264" y="352" font-size="11" fill="#5cc66f">Bill  «value object»</text>
  <line x1="252" y1="360" x2="468" y2="360" stroke="#2d333d"/>
  <text x="264" y="378" font-size="9.5" fill="#9099a8">itemSubtotal · packaging</text>
  <text x="264" y="396" font-size="9.5" fill="#9099a8">deliveryFee · taxes · discount</text>
  <text x="264" y="414" font-size="9.5" fill="#e8e4dc">total : long</text>
  <line x1="264" y1="426" x2="456" y2="426" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="264" y="444" font-size="9" fill="#5cc66f">ctor asserts the parts sum to total</text>
  <path d="M360,314 L360,320 L352,325 L360,330 L368,325 L360,320" fill="#e8e4dc" stroke="#e8e4dc"/>

  <rect x="252" y="476" width="216" height="56" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="264" y="496" font-size="10.5" fill="#6b7280">what is NOT here</text>
  <text x="264" y="514" font-size="9.5" fill="#f06868">✗ isAccepted / isPickedUp flags</text>
  <text x="264" y="528" font-size="9.5" fill="#f06868">✗ price on the CartLine</text>

  <rect x="500" y="26" width="226" height="76" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="512" y="46" font-size="10.5" fill="#5e9ff6">OrderStateMachine</text>
  <line x1="500" y1="54" x2="726" y2="54" stroke="#2d333d"/>
  <text x="512" y="72" font-size="9.5" fill="#e8e4dc">+ next(from, event, actor) : State</text>
  <text x="512" y="90" font-size="9" fill="#9099a8">the 11-row table — the only rulebook</text>
  <line x1="472" y1="70" x2="496" y2="64" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fd-cls-a)"/>

  <rect x="500" y="118" width="226" height="72" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="512" y="138" font-size="10.5" fill="#5e9ff6">«interface» CancellationPolicy</text>
  <line x1="500" y1="146" x2="726" y2="146" stroke="#2d333d"/>
  <text x="512" y="164" font-size="9.5" fill="#e8e4dc">+ refundBpsFor(state) : long</text>
  <text x="512" y="182" font-size="9" fill="#9099a8">−1 means “not allowed from here”</text>
  <line x1="472" y1="110" x2="496" y2="140" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fd-cls-a)"/>

  <rect x="500" y="206" width="226" height="72" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="512" y="226" font-size="10.5" fill="#5e9ff6">«interface» AssignmentStrategy</text>
  <line x1="500" y1="234" x2="726" y2="234" stroke="#2d333d"/>
  <text x="512" y="252" font-size="9.5" fill="#e8e4dc">+ pick(order, candidates) : Partner</text>
  <text x="512" y="270" font-size="9" fill="#9099a8">the order flow never names an impl</text>
  <line x1="472" y1="150" x2="496" y2="228" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fd-cls-a)"/>

  <rect x="500" y="294" width="226" height="72" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="512" y="314" font-size="10.5" fill="#5e9ff6">«interface» OrderObserver</text>
  <line x1="500" y1="322" x2="726" y2="322" stroke="#2d333d"/>
  <text x="512" y="340" font-size="9.5" fill="#e8e4dc">+ onTransition(order, from, to, …)</text>
  <text x="512" y="358" font-size="9" fill="#9099a8">fired once per state change</text>
  <line x1="472" y1="190" x2="496" y2="316" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fd-cls-a)"/>

  <rect x="500" y="386" width="110" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="510" y="405" font-size="9" fill="#e8e4dc">NearestFree</text>
  <rect x="616" y="386" width="110" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="626" y="405" font-size="9" fill="#e8e4dc">BatchedPickup</text>
  <line x1="556" y1="386" x2="590" y2="282" stroke="#9099a8" stroke-width="1" marker-end="url(#fd-cls-i)"/>
  <line x1="668" y1="386" x2="632" y2="282" stroke="#9099a8" stroke-width="1" marker-end="url(#fd-cls-i)"/>

  <rect x="500" y="424" width="110" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="510" y="443" font-size="9" fill="#e8e4dc">PushNotifier</text>
  <rect x="616" y="424" width="110" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="626" y="443" font-size="9" fill="#e8e4dc">SmsNotifier</text>
  <rect x="500" y="462" width="226" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="510" y="481" font-size="9" fill="#e8e4dc">AnalyticsSink   — a third one costs 0 edits</text>

  <text x="500" y="514" font-size="9" fill="#6b7280">every box on this column is a file you can add</text>
  <text x="500" y="528" font-size="9" fill="#5cc66f">without ever opening Order.java</text>
</svg>`,
        caption:
          "One box has a thick orange border, and that is the point: `Order` is the aggregate. Everything on the right is a seam — swap the implementation, `Order` never changes. Notation: [[class-diagrams]]; the aggregate idea: [[domain-modeling]].",
      },

      // ---------------------------------------------------- placeOrder
      { type: "h", text: "`placeOrder()`, end to end" },
      {
        type: "p",
        text: "This is the method they will read most carefully, because everything interesting happens in it exactly once: the validations that must run **at place time**, the bill built from live prices, and the freeze.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 396" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram for placing an order. The customer calls placeOrder with a cart, a request id and the current minute. The service first checks the idempotency map and returns the existing order if the request id was already seen. It then asks the Restaurant whether it is open at that minute, and whether every item in the cart still exists and is available, throwing a precise error if not. It calls the BillCalculator, which reads the current menu prices and returns a Bill whose parts are asserted to sum to the total. The service constructs the Order in the PLACED state with an immutable item snapshot and the frozen bill, then the Order notifies every observer of the transition into PLACED.">
  <defs>
    <marker id="fd-seq-c" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="fd-seq-r" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="12" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="34" y="32" font-size="10.5" fill="#e8e4dc">🙍 Customer</text>
  <rect x="150" y="12" width="126" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="160" y="32" font-size="10" fill="#fb863a">DeliveryService</text>
  <rect x="326" y="12" width="112" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="338" y="32" font-size="10.5" fill="#e8e4dc">Restaurant</text>
  <rect x="474" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="482" y="32" font-size="10" fill="#5e9ff6">BillCalculator</text>
  <rect x="628" y="12" width="100" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="654" y="32" font-size="10.5" fill="#5cc66f">Order</text>

  <line x1="64" y1="42" x2="64" y2="384" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="213" y1="42" x2="213" y2="384" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="382" y1="42" x2="382" y2="384" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="534" y1="42" x2="534" y2="384" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="678" y1="42" x2="678" y2="384" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="70" y="64" font-size="9.5" fill="#e8e4dc">placeOrder(cart, requestId, atMin)</text>
  <line x1="64" y1="72" x2="209" y2="72" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-seq-c)"/>

  <rect x="150" y="80" width="216" height="34" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="160" y="96" font-size="9" fill="#fb863a">seen(requestId)?  → return the SAME order</text>
  <text x="160" y="108" font-size="8.5" fill="#9099a8">a double-tap must not create a second order</text>

  <text x="222" y="138" font-size="9.5" fill="#e8e4dc">isOpenAt(atMin)</text>
  <line x1="213" y1="146" x2="378" y2="146" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-seq-c)"/>
  <line x1="382" y1="166" x2="217" y2="166" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#fd-seq-r)"/>
  <text x="240" y="161" font-size="9" fill="#5cc66f">true — else REJECT “restaurant is closed”</text>

  <text x="222" y="190" font-size="9.5" fill="#e8e4dc">for each line: item exists AND isAvailable</text>
  <line x1="213" y1="198" x2="378" y2="198" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-seq-c)"/>
  <rect x="326" y="204" width="230" height="32" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.5)"/>
  <text x="336" y="220" font-size="9" fill="#f06868">“Gulab Jamun is sold out” → refuse the whole</text>
  <text x="336" y="232" font-size="9" fill="#f06868">order now, not at PICK_UP time</text>

  <text x="222" y="262" font-size="9.5" fill="#e8e4dc">build(cart, restaurant, feeRules)</text>
  <line x1="213" y1="270" x2="530" y2="270" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-seq-c)"/>
  <rect x="474" y="276" width="252" height="46" rx="5" fill="rgba(94,159,246,0.12)" stroke="rgba(94,159,246,0.5)"/>
  <text x="484" y="292" font-size="9" fill="#5e9ff6">reads the CURRENT menu: 24000, 6000×2</text>
  <text x="484" y="306" font-size="9" fill="#5e9ff6">36000+2000+3500+1900−5000 = 38400</text>
  <text x="484" y="318" font-size="8.5" fill="#9099a8">ctor asserts the parts sum to total</text>

  <text x="222" y="344" font-size="9.5" fill="#e8e4dc">new Order(PLACED, itemSnapshot, 📌 bill)</text>
  <line x1="213" y1="352" x2="674" y2="352" stroke="#fb863a" stroke-width="1.3" marker-end="url(#fd-seq-c)"/>
  <rect x="560" y="358" width="168" height="30" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="570" y="377" font-size="9" fill="#5cc66f">observers ← (null → PLACED)</text>
</svg>`,
        caption:
          "Three gates before an order exists, and they are all **at place time**: is the kitchen open, is every item still available, and is this a retry. Checking availability at browse time only is the classic miss — the item sold out while the customer was choosing a payment method. Notation: [[sequence-diagrams]].",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Idempotency: the follow-up hiding in the first box",
        text: "The **Place order** button is tapped on a train. The request times out, the app retries, and now the customer has two identical orders and two charges. The fix is one line of design: the client sends a `requestId` it generated, and `placeOrder` keeps `Map<requestId, Order>`. A repeat returns **the same order object**, not a new one. Say this unprompted — it costs you eight seconds and it is the single most common “what about…?” in this round.",
      },

      // ---------------------------------------------------- assignment
      { type: "h", text: "Partner assignment — a strategy, deliberately shallow" },
      {
        type: "p",
        text: "The moment an order is accepted, somebody has to be sent to fetch it. This is where candidates burn twenty minutes inventing a geo-index. Do not. **Finding candidates is a collaborator; choosing among them is your design.**",
      },
      {
        type: "ul",
        items: [
          "`partners.candidatesNear(restaurant)` returns a handful of nearby partners. Say “this is backed by a spatial index — a grid or a geohash — and I am treating it as given”, and you have said everything the round needs about geography.",
          "**`AssignmentStrategy.pick(order, candidates)`** is the seam. `NearestFreeStrategy` takes the free partner with the smallest ETA. `BatchedPickupStrategy` prefers a partner who is *already* going to the same restaurant and has room for one more, and only falls back to nearest-free if nobody qualifies.",
          "Batching is a genuinely interesting rule to explain: two orders from one kitchen on one trip halves the cost per delivery and adds a few minutes to the second customer's ETA. That trade-off is a *business* decision, which is exactly why it belongs behind an interface that a config flag can swap.",
          "The assignment is its own small object — `Assignment { partnerId, assignedAtMin }` — hanging off the order. When a partner drops out, you replace the assignment; **the order's state does not change**. Re-assignment is legal while the order is `READY` or `PICKED_UP`, and that rule lives with the assignment, not in the order enum.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "The sentence that proves the seam is real",
        text: "*“Switching from nearest-free to batched changes zero lines of the order flow — `service.setAssignmentStrategy(new BatchedPickupStrategy())` and that is the whole diff.”* If you cannot say that truthfully about your code, the interface is decoration. The prototype has a chip for exactly this, and it prints **order-flow code changed: 0 lines**.",
      },

      // ---------------------------------------------------- availability
      { type: "h", text: "Restaurant availability — validate at PLACE time, not at browse time" },
      {
        type: "p",
        text: "A menu is not static. A kitchen closes at 11pm. Paneer runs out at 9:40. A customer who opened the app at 9:20 is looking at a page that is already wrong, and no amount of client-side checking fixes that — the check has to happen on the write, at the moment the order is created.",
      },
      {
        type: "ul",
        items: [
          "**`restaurant.isOpenAt(minuteOfDay)`** — pass the time in as a parameter. Never read a clock inside the domain logic; you cannot write a test for “orders at 11:01pm are refused” if the method asks the operating system what time it is. This is the same rule as billing in [[parking-lot]].",
          "**`menuItem.isAvailable`** — checked per line, and the failure message names the dish. *“Gulab Jamun is sold out”* is a usable error; *“invalid order”* is a support ticket.",
          "**Browse-time checks are a nicety, not a guarantee.** Greying out a sold-out dish in the UI is good product work and worth zero marks for correctness. The `placeOrder` gate is what makes it true.",
          "**What if the item sells out between ACCEPTED and PREPARING?** Then the restaurant rejects, or calls the customer and the order is cancelled with a full refund. Notice that both answers are already edges on your diagram — you do not need a new mechanism, which is the sign the state machine is carrying its weight.",
        ],
      },

      // ---------------------------------------------------- observers
      { type: "h", text: "Notifications — an observer on every transition" },
      {
        type: "p",
        text: "Six state changes, and each one is a push notification, an SMS to some users, an update to the restaurant tablet, an analytics event, and a row in the customer's order-tracking screen. If any of that appears inside `transition()`, the order now depends on a notification service, an SMS vendor and a metrics client — and every new channel edits the most important method in the system.",
      },
      {
        type: "p",
        text: "So `transition()` ends with one loop over `List<OrderObserver>`. Adding WhatsApp is a new class and one `register()` call. `Order` is untouched. That is [[observer]], and this problem is one of the cleanest places to demonstrate it — the prototype shows the counter ticking and prints **Order class edited: 0 lines** when you add a channel.",
      },
      {
        type: "callout",
        variant: "info",
        title: "One honest caveat to say out loud",
        text: "In-process observers run **inside** the transition. A slow SMS vendor now slows down “mark ready”, and a throwing observer can roll back a state change that should have succeeded. The real system publishes an event to a queue and lets subscribers run elsewhere. Saying *“in production this becomes a published event, not a synchronous callback — see [[pub-sub-event-driven]]”* takes five seconds and shows you know why the toy version is a toy.",
      },

      // ---------------------------------------------------- follow-ups
      { type: "h", text: "The follow-ups they always ask" },
      {
        type: "ul",
        items: [
          "**“What if the restaurant never accepts?”** — the `SYSTEM` actor exists for this. `service.tick(nowMin)` walks orders still in `PLACED` and fires `REJECT` by `SYSTEM` once they are older than 90 seconds, with a full refund. One extra row in the transition table, one loop. Because you named the system as an actor in minute three, this answer is free.",
          "**“What if the partner cancels mid-trip?”** — the order stays where it is and the *assignment* is replaced. Re-assign from `READY` or `PICKED_UP`; from `PICKED_UP` the new partner has to collect the food from the old one, which is an operations problem, not a modelling one. The key line: *“partner churn does not move the order's state, so it cannot corrupt the lifecycle.”*",
          "**“Scheduled orders — deliver at 8pm.”** — a scheduler that calls the ordinary `placeOrder` at the right minute. No new state, no new transition. Prices are picked up at *that* moment, which is the correct behaviour and falls out of the design for free.",
          "**“Ratings?”** — a `Rating` attached to a **terminal** order, allowed only from `DELIVERED`. Modelled as a separate object so `Order` does not grow a nullable field it ignores for forty minutes of its life.",
          "**“Refunds — how do they actually happen?”** — the order records a refund *intent* with an amount and a reason; a payment adapter executes it and calls back. The callback must be idempotent, because gateways retry. Recording is your job; executing is theirs.",
          "**“Two people press buttons at the same time.”** — one lock per order, or a compare-and-set on the state field. The critical section is a table lookup and a field write. Do not lock the service. Detail in [[locks-mutex-semaphore]].",
          "**“Order history and ‘why did this happen?’”** — keep an append-only `List<TransitionRecord>` on the order: from, to, event, actor, minute. It costs nothing, it *is* the tracking screen, and it answers every dispute. A state machine that keeps its own log is worth a lot more than one that does not.",
          "**“Multi-restaurant cart?”** — the honest answer: one order per restaurant, grouped under a parent, each with its own independent state machine and its own partner. Do not try to make one state machine describe two kitchens; you will end up back at booleans.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 268" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An extensibility cost table. Adding a notification channel costs one class implementing OrderObserver and zero edits to Order. Adding a fee such as a rain surcharge costs one fee rule inside the bill calculator. Adding batched assignment costs one class implementing AssignmentStrategy. Adding scheduled orders costs a scheduler that calls the existing placeOrder. Adding a new state such as ARRIVED_AT_RESTAURANT costs one enum value and two table rows. Supporting a multi restaurant cart is expensive because it splits one order into several, each with its own lifecycle.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">what the next feature actually costs</text>

  <rect x="20" y="32" width="660" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="50" font-size="9" fill="#6b7280">feature</text>
  <text x="276" y="50" font-size="9" fill="#6b7280">what you touch</text>
  <text x="586" y="50" font-size="9" fill="#6b7280">verdict</text>

  <rect x="20" y="62" width="660" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="82" font-size="10" fill="#e8e4dc">a WhatsApp / SMS channel</text>
  <text x="276" y="82" font-size="10" fill="#9099a8">1 class : OrderObserver — Order untouched</text>
  <text x="586" y="82" font-size="10" fill="#5cc66f">free</text>

  <rect x="20" y="96" width="660" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="116" font-size="10" fill="#e8e4dc">a rain surcharge / small-order fee</text>
  <text x="276" y="116" font-size="10" fill="#9099a8">1 fee rule inside BillCalculator</text>
  <text x="586" y="116" font-size="10" fill="#5cc66f">free</text>

  <rect x="20" y="130" width="660" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="150" font-size="10" fill="#e8e4dc">batched pickups (2 orders, 1 trip)</text>
  <text x="276" y="150" font-size="10" fill="#9099a8">1 class : AssignmentStrategy</text>
  <text x="586" y="150" font-size="10" fill="#5cc66f">free</text>

  <rect x="20" y="164" width="660" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="184" font-size="10" fill="#e8e4dc">scheduled orders (“deliver at 8pm”)</text>
  <text x="276" y="184" font-size="10" fill="#9099a8">a timer that calls the existing placeOrder</text>
  <text x="586" y="184" font-size="10" fill="#5cc66f">free</text>

  <rect x="20" y="198" width="660" height="30" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="34" y="218" font-size="10" fill="#fb863a">a new state (ARRIVED_AT_RESTAURANT)</text>
  <text x="276" y="218" font-size="10" fill="#9099a8">1 enum value + 2 rows in the table</text>
  <text x="586" y="218" font-size="10" fill="#fb863a">cheap</text>

  <rect x="20" y="232" width="660" height="30" rx="5" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="34" y="252" font-size="10" fill="#f06868">a multi-restaurant cart</text>
  <text x="276" y="252" font-size="10" fill="#9099a8">one order splits into N, each with a lifecycle</text>
  <text x="586" y="252" font-size="10" fill="#f06868">expensive</text>
</svg>`,
        caption:
          "Row five is the row that proves the design. Adding a *state* — the hardest kind of change in most codebases — is one enum value and two table rows, because there is exactly one place that knows the rules.",
      },

      // ---------------------------------------------------- the 90 minutes
      { type: "h", text: "The 90 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 216" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A ninety minute budget bar for the round divided into six segments: five minutes clarifying and cutting scope, eight minutes on entities and the state list, seven minutes on the transition table and class diagram, thirty minutes coding the enum, the table, the transition method and the order, eighteen minutes on the bill and the cancellation policy, twelve minutes on assignment strategy and observers, and ten minutes running the demo and taking follow ups.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">a 90-minute budget that actually fits</text>

  <rect x="20" y="34" width="40" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="64" y="34" width="62" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="130" y="34" width="54" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="188" y="34" width="232" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="424" y="34" width="140" height="34" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="568" y="34" width="94" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="666" y="34" width="14" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>

  <text x="28" y="56" font-size="9" fill="#9099a8">5m</text>
  <text x="72" y="56" font-size="9" fill="#9099a8">8m</text>
  <text x="138" y="56" font-size="9" fill="#9099a8">7m</text>
  <text x="196" y="56" font-size="9.5" fill="#fb863a">30m</text>
  <text x="432" y="56" font-size="9.5" fill="#5cc66f">18m</text>
  <text x="576" y="56" font-size="9" fill="#9099a8">12m</text>
  <text x="664" y="82" font-size="8" fill="#6b7280">10m</text>

  <text x="20" y="98" font-size="9.5" fill="#e8e4dc">clarify — the six states out loud, who cancels when, and “search is out of scope”</text>
  <text x="20" y="118" font-size="9.5" fill="#e8e4dc">entities — Customer, Restaurant, MenuItem, Cart, Order, DeliveryPartner, Bill</text>
  <text x="20" y="138" font-size="9.5" fill="#e8e4dc">the transition table on the whiteboard + the class diagram’s four seams</text>
  <text x="20" y="158" font-size="9.5" fill="#fb863a">code: OrderState enum → the 11-row table → transition(event, actor) → Order</text>
  <text x="20" y="178" font-size="9.5" fill="#5cc66f">Bill built from the current menu + frozen, then CancellationPolicy + refunds</text>
  <text x="20" y="196" font-size="9.5" fill="#9099a8">AssignmentStrategy (2 impls) + OrderObserver — then main(): the happy path, an illegal move, a cancel</text>
  <text x="20" y="212" font-size="9" fill="#6b7280">keep the last 10 minutes to RUN it and take follow-ups. An unrun program scores like an unwritten one.</text>
</svg>`,
        caption:
          "The orange block is the round. If you reach minute 50 without a working `transition()`, abandon fees, abandon batching, abandon observers — a running state machine with a hard-coded bill beats a beautiful class diagram with no `main()`.",
      },

      // ---------------------------------------------------- how it is lost
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**Booleans instead of a state enum.** Everything downstream — cancellation rules, refunds, notifications, the tracking screen — turns into nested conditions that nobody can verify, and `isDelivered && isCancelled` becomes reachable.",
          "**A `setState()` that anyone can call.** The enum was there, the rules were not. If three services can assign to the field, you have a diagram, not a machine.",
          "**Transitions with no actor.** `transition(PICK_UP)` lets the customer's app mark its own order picked up. Half the domain went missing and it looks fine in the demo.",
          "**Cancellation handled with four `if`s in a controller.** It works on the day, and then a product manager changes the refund rule and it works differently in three places.",
          "**A price on the cart line.** Silent, invisible in any demo, and wrong for every user whose cart outlived a menu edit.",
          "**A total that can change after `PLACED`.** Receipts, refunds and payouts all stop reconciling, and no test catches it because the number is *plausible*.",
          "**`double` anywhere near money.** ₹384.00 becomes 383.99999999999994 in a refund calculation, and refunds are the one number customers check.",
          "**Building search, ranking or a map.** The most common way to run out of time on this problem, and it costs you the part that was actually being graded.",
          "**No `main()`.** Forty minutes of beautiful interfaces and nothing you can run. Print the happy path, print one refused transition, print one refund.",
        ],
      },
    ],

    // ==================================================================
    handsOn: [
      {
        title: "Walk the order through its life",
        body:
          "Press **🙍 Place order**, then **🍳 Accept**, **🍳 Start preparing**, **🍳 Mark ready**, **🛵 Pick up**, **🛵 Deliver** — in that order. The pill strip lights each state as you arrive and dims the ones behind you, the **elapsed** counter climbs, and the **🔔 notifications** counter ticks once per transition. Six presses, three different people, one object. Notice that no button ever *sets* a state — every one of them calls the same `order.transition(event, actor)` shown in the call line.",
      },
      {
        title: "Two different kinds of “no”",
        body:
          "Reset, then place and accept, then press **🍳 Start preparing** so the state is PREPARING. Now press **🛵 Pick up**. The button shakes red and the explain says *“PICK_UP is not a legal event from PREPARING”* — a **missing transition**. Now press **🍳 Mark ready** and **🛵 Pick up** so the state is PICKED_UP, then press **🙍 Deliver** in the Customer panel. Same refusal, different reason: *“DELIVER from PICKED_UP is PARTNER's move, not CUSTOMER's”* — a **wrong actor**. One table produced both messages, and telling them apart is what makes the error useful to whoever is calling you.",
      },
      {
        title: "Cancel at every stage and read the money",
        body:
          "Reset, press **🙍 Place order**, then press **🚫 Try to cancel** straight away: refund **100%** of ₹384.00. Reset, place, **🍳 Accept**, then cancel: still 100%. Reset again, get to PREPARING, and cancel: **50%** — the refund readout shows ₹192.00 back and ₹192.00 kept, because the kitchen already spent the food. From READY it is **25%**. Get to PICKED_UP and press it again: refused, because there is no CANCEL edge from there at all. Watch which of the two objects produced each answer — the state machine said *legal*, the policy said *how much*.",
      },
      {
        title: "Change a price and watch the freeze",
        body:
          "Reset. Press **💸 Menu price changed** — the paneer goes from `24000` to `27000` and the **cart (live)** total moves. Press **🧾 Checkout** and the bill is rebuilt from the *current* menu: the panel shows the old total struck out and the new one beside it. Now press **🙍 Place order**: a **📌 Frozen** badge appears on the order total. Press **💸 Menu price changed** twice more and watch the cart total keep moving while the order total does not budge. That is the whole “cart is a wish, order is a contract” idea in four clicks.",
      },
      {
        title: "Prove the two seams are real",
        body:
          "Press the **📦 Batch two orders** chip. The assignment is recomputed, the partner changes, and the explain prints **order-flow code changed: 0 lines** — the flow calls `strategy.pick(...)` and has never heard of either implementation. Press **📍 Nearest free** to swap back. Then press **＋ Add SMS channel**: the channel row grows, the 🔔 counter keeps counting for *both* channels on the next transition, and the explain prints **Order class edited: 0 lines**. Finally press **↺ Reset** and rebuild the whole thing blank-file, in this order: the `OrderState` enum → the 11-row transition table → `transition(event, actor, atMin)` → `Bill` with the parts-sum assertion → `CancellationPolicy` → observers. If you can type that from memory in thirty minutes, this round is a formality.",
      },
    ],

    // ==================================================================
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "FoodDelivery.java",
        code: `import java.util.*;

/* ==================================================================== enums */
enum OrderState {
    PLACED, ACCEPTED, PREPARING, READY, PICKED_UP, DELIVERED, CANCELLED, REJECTED;
    boolean terminal() { return this == DELIVERED || this == CANCELLED || this == REJECTED; }
}

enum OrderEvent { ACCEPT, REJECT, START_PREP, MARK_READY, PICK_UP, DELIVER, CANCEL }

enum Actor { CUSTOMER, RESTAURANT, PARTNER, SYSTEM }

/* ==================================================================== money */
final class Money {
    static String fmt(long paise) {
        long a = Math.abs(paise);
        return (paise < 0 ? "-" : "") + "Rs." + (a / 100) + "." + String.format("%02d", a % 100);
    }
    /** Basis points of an amount, half-up, integers only. 10000 bps = 100%. */
    static long bps(long paise, long basisPoints) {
        return (paise * basisPoints + 5000) / 10000;
    }
    /** Split a total across n lines so the parts sum to the total EXACTLY. */
    static long[] spread(long total, int n) {
        long[] out = new long[n];
        long base = total / n, rem = total % n;
        for (int i = 0; i < n; i++) out[i] = base + (i < rem ? 1 : 0);
        return out;
    }
}

/* ============================================================= the rulebook */
class IllegalTransition extends RuntimeException {
    IllegalTransition(String msg) { super(msg); }
}

record Transition(OrderState from, OrderEvent event, Actor actor, OrderState to) {}

final class OrderStateMachine {
    // short aliases so the table below reads like the whiteboard
    private static final OrderState PLACED = OrderState.PLACED, ACCEPTED = OrderState.ACCEPTED,
        PREPARING = OrderState.PREPARING, READY = OrderState.READY, PICKED_UP = OrderState.PICKED_UP,
        DELIVERED = OrderState.DELIVERED, CANCELLED = OrderState.CANCELLED, REJECTED = OrderState.REJECTED;
    private static final OrderEvent ACCEPT = OrderEvent.ACCEPT, REJECT = OrderEvent.REJECT,
        START_PREP = OrderEvent.START_PREP, MARK_READY = OrderEvent.MARK_READY,
        PICK_UP = OrderEvent.PICK_UP, DELIVER = OrderEvent.DELIVER, CANCEL = OrderEvent.CANCEL;
    private static final Actor CUSTOMER = Actor.CUSTOMER, RESTAURANT = Actor.RESTAURANT,
        PARTNER = Actor.PARTNER, SYSTEM = Actor.SYSTEM;

    /** (from, event, who) -> to.  Eleven rows. Nothing else is legal, ever. */
    static final List<Transition> TABLE = List.of(
        new Transition(PLACED,    ACCEPT,     RESTAURANT, ACCEPTED),
        new Transition(PLACED,    REJECT,     RESTAURANT, REJECTED),
        new Transition(PLACED,    REJECT,     SYSTEM,     REJECTED),   // auto-reject timeout
        new Transition(PLACED,    CANCEL,     CUSTOMER,   CANCELLED),
        new Transition(ACCEPTED,  START_PREP, RESTAURANT, PREPARING),
        new Transition(ACCEPTED,  CANCEL,     CUSTOMER,   CANCELLED),
        new Transition(PREPARING, MARK_READY, RESTAURANT, READY),
        new Transition(PREPARING, CANCEL,     CUSTOMER,   CANCELLED),
        new Transition(READY,     PICK_UP,    PARTNER,    PICKED_UP),
        new Transition(READY,     CANCEL,     CUSTOMER,   CANCELLED),
        new Transition(PICKED_UP, DELIVER,    PARTNER,    DELIVERED));

    /**
     * ONE place decides legality, and it tells the two failures apart:
     *   no row for (from, event)           -> missing transition
     *   a row exists but for another actor -> wrong actor
     */
    static OrderState next(OrderState from, OrderEvent event, Actor who) {
        Actor owner = null;
        for (Transition t : TABLE) {
            if (t.from() != from || t.event() != event) continue;
            owner = t.actor();
            if (t.actor() == who) return t.to();
        }
        if (owner == null)
            throw new IllegalTransition(event + " is not a legal event from " + from
                + "   (missing transition)");
        throw new IllegalTransition(event + " from " + from + " is " + owner + "'s move, not "
            + who + "'s   (wrong actor)");
    }

    static boolean can(OrderState from, OrderEvent event, Actor who) {
        for (Transition t : TABLE)
            if (t.from() == from && t.event() == event && t.actor() == who) return true;
        return false;
    }
}

/* ================================================================ catalogue */
final class MenuItem {
    final String id, name;
    long pricePaise;             // the kitchen may change this at any moment
    boolean available = true;
    MenuItem(String id, String name, long pricePaise) {
        this.id = id; this.name = name; this.pricePaise = pricePaise;
    }
}

final class Restaurant {
    final String id, name;
    final Map<String, MenuItem> menu = new LinkedHashMap<>();
    final int openMin, closeMin;                       // minutes since midnight
    Restaurant(String id, String name, int openMin, int closeMin) {
        this.id = id; this.name = name; this.openMin = openMin; this.closeMin = closeMin;
    }
    Restaurant add(MenuItem m) { menu.put(m.id, m); return this; }
    /** Time comes IN. Nothing in this class ever asks the OS what time it is. */
    boolean isOpenAt(int minuteOfDay) { return minuteOfDay >= openMin && minuteOfDay < closeMin; }
}

/** No price here. That is the whole point of this class. */
record CartLine(String menuItemId, int qty) {}

final class Cart {
    final String restaurantId;
    final List<CartLine> lines = new ArrayList<>();
    Cart(String restaurantId) { this.restaurantId = restaurantId; }
    Cart add(String menuItemId, int qty) { lines.add(new CartLine(menuItemId, qty)); return this; }
}

/** The frozen snapshot: what this dish cost AT CHECKOUT. Never edited again. */
record OrderItem(String name, long unitPaise, int qty) {
    long linePaise() { return unitPaise * qty; }
}

/* ===================================================================== bill */
record Bill(long itemSubtotal, long packaging, long deliveryFee,
            long taxes, long discount, long total) {
    Bill {
        if (itemSubtotal + packaging + deliveryFee + taxes - discount != total)
            throw new IllegalArgumentException("bill parts do not sum to the total");
        if (total < 0) throw new IllegalArgumentException("total cannot be negative");
    }
    String pretty() {
        return Money.fmt(itemSubtotal) + " + pack " + Money.fmt(packaging)
             + " + delivery " + Money.fmt(deliveryFee) + " + tax " + Money.fmt(taxes)
             + " - off " + Money.fmt(discount) + "  =  " + Money.fmt(total);
    }
}

final class BillCalculator {
    static final long PACKAGING = 2000, DELIVERY = 3500, TAX_BPS = 500;

    /** Prices are read from the CURRENT menu, every single time this runs. */
    static Bill build(Cart cart, Restaurant r, long discountPaise, List<OrderItem> snapshotOut) {
        long subtotal = 0;
        for (CartLine line : cart.lines) {
            MenuItem m = r.menu.get(line.menuItemId());
            if (m == null) throw new IllegalArgumentException("no such item: " + line.menuItemId());
            if (!m.available) throw new IllegalArgumentException(m.name + " is sold out");
            OrderItem snap = new OrderItem(m.name, m.pricePaise, line.qty());
            snapshotOut.add(snap);
            subtotal += snap.linePaise();
        }
        long discount = Math.min(discountPaise, subtotal);          // never below zero
        long taxes = Money.bps(subtotal + PACKAGING, TAX_BPS);
        long total = subtotal + PACKAGING + DELIVERY + taxes - discount;
        return new Bill(subtotal, PACKAGING, DELIVERY, taxes, discount, total);
    }
}

/* ============================================================= cancellation */
interface CancellationPolicy {
    /** Basis points refunded, or -1 when cancelling is not allowed from this state. */
    long refundBpsFor(OrderState state);
}

final class StandardCancellationPolicy implements CancellationPolicy {
    public long refundBpsFor(OrderState s) {
        switch (s) {
            case PLACED:
            case ACCEPTED:  return 10000;   // nothing has been cooked yet
            case PREPARING: return 5000;    // the food is already on the pan
            case READY:     return 2500;    // cooked and boxed
            default:        return -1;      // on a bike, or already finished
        }
    }
}

record RefundQuote(boolean allowed, long refundPaise, long keptPaise, String reason) {}

/* ================================================================ observers */
interface OrderObserver {
    void onTransition(Order o, OrderState from, OrderState to, OrderEvent e, Actor who);
}

final class ChannelNotifier implements OrderObserver {
    final String channel;
    int sent = 0;
    ChannelNotifier(String channel) { this.channel = channel; }
    public void onTransition(Order o, OrderState from, OrderState to, OrderEvent e, Actor who) {
        sent++;
        System.out.println("        [" + channel + "] " + o.id + ": " + from + " -> " + to);
    }
}

/* ================================================== partners and assignment */
final class DeliveryPartner {
    final String id, name;
    final int etaMinutes;
    final List<String> activeOrders = new ArrayList<>();
    DeliveryPartner(String id, String name, int etaMinutes) {
        this.id = id; this.name = name; this.etaMinutes = etaMinutes;
    }
    boolean free() { return activeOrders.isEmpty(); }
}

record Assignment(String partnerId, int assignedAtMin) {}

interface AssignmentStrategy {
    String name();
    DeliveryPartner pick(Order order, List<DeliveryPartner> candidates, Map<String, Order> allOrders);
}

final class NearestFreeStrategy implements AssignmentStrategy {
    public String name() { return "nearest-free"; }
    public DeliveryPartner pick(Order order, List<DeliveryPartner> cands, Map<String, Order> all) {
        DeliveryPartner best = null;
        for (DeliveryPartner p : cands)
            if (p.free() && (best == null || p.etaMinutes < best.etaMinutes)) best = p;
        return best;
    }
}

final class BatchedPickupStrategy implements AssignmentStrategy {
    private static final int MAX_PER_TRIP = 2;
    public String name() { return "batched"; }
    public DeliveryPartner pick(Order order, List<DeliveryPartner> cands, Map<String, Order> all) {
        // 1. is somebody already going to THIS kitchen with room for one more?
        for (DeliveryPartner p : cands) {
            if (p.activeOrders.isEmpty() || p.activeOrders.size() >= MAX_PER_TRIP) continue;
            for (String oid : p.activeOrders) {
                Order other = all.get(oid);
                if (other != null && !other.state().terminal()
                        && other.restaurant.id.equals(order.restaurant.id)) return p;
            }
        }
        return new NearestFreeStrategy().pick(order, cands, all);   // 2. fall back
    }
}

/** Geography belongs to another interview. This is the seam where it plugs in. */
final class PartnerDirectory {
    final List<DeliveryPartner> all = new ArrayList<>();
    List<DeliveryPartner> candidatesNear(Restaurant r) { return all; }     // stub
}

/** Frees a partner as soon as an order reaches a terminal state. An observer. */
final class PartnerReleaser implements OrderObserver {
    private final PartnerDirectory dir;
    PartnerReleaser(PartnerDirectory dir) { this.dir = dir; }
    public void onTransition(Order o, OrderState from, OrderState to, OrderEvent e, Actor who) {
        if (!to.terminal() || o.assignment == null) return;
        for (DeliveryPartner p : dir.all)
            if (p.id.equals(o.assignment.partnerId())) p.activeOrders.remove(o.id);
    }
}

/* ==================================================================== order */
record TransitionRecord(OrderState from, OrderState to, OrderEvent event, Actor actor, int atMin) {}

final class Order {
    final String id, customerId;
    final Restaurant restaurant;
    final List<OrderItem> items;      // immutable snapshot of what was ordered
    final Bill bill;                  // frozen at PLACED, forever
    final int placedAtMin;

    private OrderState state = OrderState.PLACED;
    private final CancellationPolicy policy;
    private final List<OrderObserver> observers;
    private final List<TransitionRecord> log = new ArrayList<>();
    long refundPaise = 0;
    Assignment assignment;

    Order(String id, String customerId, Restaurant r, List<OrderItem> items, Bill bill,
          int placedAtMin, CancellationPolicy policy, List<OrderObserver> observers) {
        this.id = id; this.customerId = customerId; this.restaurant = r;
        this.items = List.copyOf(items); this.bill = bill; this.placedAtMin = placedAtMin;
        this.policy = policy; this.observers = observers;
        fanOut(null, OrderState.PLACED, null, Actor.CUSTOMER, placedAtMin);
    }

    OrderState state() { return state; }             // a getter. there is no setter.
    List<TransitionRecord> history() { return List.copyOf(log); }

    /**
     * The ONLY way the state ever changes. Synchronized because three different
     * apps push this object; the guarded region is a table lookup and one write.
     */
    synchronized OrderState transition(OrderEvent event, Actor who, int atMin) {
        OrderState from = state;
        if (from.terminal())
            throw new IllegalTransition(from + " is terminal - nothing follows it");
        OrderState to = OrderStateMachine.next(from, event, who);   // throws with a reason
        if (event == OrderEvent.CANCEL) {
            RefundQuote q = cancellationQuote();                    // the POLICY decides money
            if (!q.allowed()) throw new IllegalTransition(q.reason());
            refundPaise = q.refundPaise();
        }
        state = to;
        fanOut(from, to, event, who, atMin);
        return to;
    }

    /** Legality came from the table; this method only answers "how much?". */
    RefundQuote cancellationQuote() {
        long rate = policy.refundBpsFor(state);
        if (rate < 0) return new RefundQuote(false, 0, 0, "cancelling is not allowed from " + state);
        long refund = Money.bps(bill.total(), rate);
        return new RefundQuote(true, refund, bill.total() - refund,
            "refund " + (rate / 100) + "% of " + Money.fmt(bill.total()));
    }

    private void fanOut(OrderState from, OrderState to, OrderEvent e, Actor who, int atMin) {
        log.add(new TransitionRecord(from, to, e, who, atMin));
        for (OrderObserver o : observers) o.onTransition(this, from, to, e, who);
    }
}

/* ================================================================== service */
final class FoodDeliveryService {
    static final int AUTO_REJECT_AFTER_MIN = 2;

    private final Map<String, Order> orders = new LinkedHashMap<>();
    private final Map<String, Order> byRequestId = new HashMap<>();     // idempotency
    private final List<OrderObserver> observers = new ArrayList<>();
    private final CancellationPolicy policy;
    private final PartnerDirectory partners;
    private AssignmentStrategy strategy;
    private int seq = 0;

    FoodDeliveryService(CancellationPolicy policy, PartnerDirectory partners, AssignmentStrategy s) {
        this.policy = policy; this.partners = partners; this.strategy = s;
        observers.add(new PartnerReleaser(partners));
    }

    void register(OrderObserver o) { observers.add(o); }                 // +1 channel: 1 line
    void setAssignmentStrategy(AssignmentStrategy s) { strategy = s; }   // +1 rule:    1 line
    String strategyName() { return strategy.name(); }

    Order placeOrder(String customerId, Cart cart, Restaurant r, long discountPaise,
                     String requestId, int atMin) {
        Order seen = byRequestId.get(requestId);
        if (seen != null) return seen;                  // a retried tap is not a new order
        if (!r.isOpenAt(atMin))
            throw new IllegalArgumentException(r.name + " is closed at minute " + atMin);

        List<OrderItem> snapshot = new ArrayList<>();
        Bill bill = BillCalculator.build(cart, r, discountPaise, snapshot);   // CURRENT prices
        Order o = new Order("ORD-" + (++seq), customerId, r, snapshot, bill,
                            atMin, policy, observers);
        orders.put(o.id, o);
        byRequestId.put(requestId, o);
        return o;
    }

    /** The flow never names an implementation — that is what makes the seam real. */
    DeliveryPartner assign(Order o, int atMin) {
        DeliveryPartner p = strategy.pick(o, partners.candidatesNear(o.restaurant), orders);
        if (p == null) return null;
        p.activeOrders.add(o.id);
        o.assignment = new Assignment(p.id, atMin);
        return p;
    }

    /** The SYSTEM actor. Time comes in as a parameter; nothing here reads a clock. */
    void tick(int nowMin) {
        for (Order o : orders.values())
            if (o.state() == OrderState.PLACED && nowMin - o.placedAtMin >= AUTO_REJECT_AFTER_MIN)
                o.transition(OrderEvent.REJECT, Actor.SYSTEM, nowMin);
    }
}

/* ===================================================================== demo */
public class Main {
    static void fire(Order o, OrderEvent e, Actor who, int atMin) {
        try {
            OrderState to = o.transition(e, who, atMin);
            System.out.println("  ok   " + who + " fires " + e + "  ->  " + to);
        } catch (IllegalTransition ex) {
            System.out.println("  X    " + who + " fires " + e + "  ->  REFUSED: " + ex.getMessage());
        }
    }

    public static void main(String[] args) {
        Restaurant tandoor = new Restaurant("R1", "Tandoor House", 11 * 60, 23 * 60)
            .add(new MenuItem("paneer", "Paneer Butter Masala", 24000))
            .add(new MenuItem("naan",   "Butter Naan",           6000))
            .add(new MenuItem("jamun",  "Gulab Jamun",           9000));

        PartnerDirectory dir = new PartnerDirectory();
        dir.all.add(new DeliveryPartner("P1", "Asha",   4));
        dir.all.add(new DeliveryPartner("P2", "Vikram", 7));

        FoodDeliveryService app = new FoodDeliveryService(
            new StandardCancellationPolicy(), dir, new NearestFreeStrategy());
        ChannelNotifier push = new ChannelNotifier("push");
        app.register(push);

        Cart cart = new Cart("R1").add("paneer", 1).add("naan", 2);

        System.out.println("== 1. place the order at 20:00 (minute 1200) ==================");
        Order o = app.placeOrder("C1", cart, tandoor, 5000, "req-abc", 1200);
        System.out.println("  " + o.id + "  " + o.bill.pretty());

        System.out.println("== 2. the same tap arrives twice =============================");
        Order again = app.placeOrder("C1", cart, tandoor, 5000, "req-abc", 1200);
        System.out.println("  same object? " + (again == o) + "   (idempotency key req-abc)");

        System.out.println("== 3. the menu price moves AFTER the order exists ============");
        tandoor.menu.get("paneer").pricePaise = 27000;
        System.out.println("  menu paneer = 27000, order total still " + Money.fmt(o.bill.total())
            + "  (frozen)");

        System.out.println("== 4. illegal moves are refused, with a reason ===============");
        fire(o, OrderEvent.PICK_UP, Actor.PARTNER,  1201);      // missing transition
        fire(o, OrderEvent.ACCEPT,  Actor.CUSTOMER, 1201);      // wrong actor

        System.out.println("== 5. the happy path ========================================");
        fire(o, OrderEvent.ACCEPT, Actor.RESTAURANT, 1202);
        DeliveryPartner p = app.assign(o, 1203);
        System.out.println("  assigned " + p.name + " via " + app.strategyName()
            + " (eta " + p.etaMinutes + "m)");
        fire(o, OrderEvent.START_PREP, Actor.RESTAURANT, 1203);

        System.out.println("== 6. what would cancelling cost right now? ==================");
        RefundQuote q = o.cancellationQuote();
        System.out.println("  " + q.reason() + "  ->  back " + Money.fmt(q.refundPaise())
            + ", kitchen keeps " + Money.fmt(q.keptPaise())
            + "   (sums to " + Money.fmt(q.refundPaise() + q.keptPaise()) + ")");

        fire(o, OrderEvent.MARK_READY, Actor.RESTAURANT, 1218);
        fire(o, OrderEvent.PICK_UP,    Actor.PARTNER,    1220);

        System.out.println("== 7. cancelling once it is on a bike ========================");
        fire(o, OrderEvent.CANCEL,  Actor.CUSTOMER, 1221);
        fire(o, OrderEvent.DELIVER, Actor.PARTNER,  1238);
        System.out.println("  final " + o.state() + ", notifications sent " + push.sent
            + ", history rows " + o.history().size());

        System.out.println("== 8. a SECOND order — same cart, new prices ================");
        Order o2 = app.placeOrder("C2", cart, tandoor, 5000, "req-def", 1240);
        System.out.println("  " + o2.id + "  " + o2.bill.pretty());
        fire(o2, OrderEvent.ACCEPT,     Actor.RESTAURANT, 1241);
        fire(o2, OrderEvent.START_PREP, Actor.RESTAURANT, 1242);
        fire(o2, OrderEvent.CANCEL,     Actor.CUSTOMER,   1245);
        System.out.println("  refund due " + Money.fmt(o2.refundPaise) + " of "
            + Money.fmt(o2.bill.total()));

        System.out.println("== 9. the kitchen never answers ==============================");
        Order o3 = app.placeOrder("C3", cart, tandoor, 0, "req-ghi", 1300);
        app.tick(1301);
        System.out.println("  after 1 minute:  " + o3.state());
        app.tick(1303);
        System.out.println("  after 3 minutes: " + o3.state() + "  (SYSTEM fired REJECT)");

        System.out.println("== 10. swap the assignment strategy ==========================");
        app.setAssignmentStrategy(new BatchedPickupStrategy());
        Order a = app.placeOrder("C4", cart, tandoor, 0, "req-j", 1310);
        Order b = app.placeOrder("C5", cart, tandoor, 0, "req-k", 1311);
        fire(a, OrderEvent.ACCEPT, Actor.RESTAURANT, 1312);
        fire(b, OrderEvent.ACCEPT, Actor.RESTAURANT, 1312);
        System.out.println("  " + a.id + " -> " + app.assign(a, 1312).name);
        System.out.println("  " + b.id + " -> " + app.assign(b, 1312).name
            + "   (same rider, one trip)");
        System.out.println("  order-flow code changed: 0 lines");
    }
}

/* --- expected output (notification lines trimmed) ---------------------------
== 1. place the order at 20:00 (minute 1200) ==================
  ORD-1  Rs.360.00 + pack Rs.20.00 + delivery Rs.35.00 + tax Rs.19.00 - off Rs.50.00  =  Rs.384.00
== 2. the same tap arrives twice =============================
  same object? true   (idempotency key req-abc)
== 3. the menu price moves AFTER the order exists ============
  menu paneer = 27000, order total still Rs.384.00  (frozen)
== 4. illegal moves are refused, with a reason ===============
  X    PARTNER fires PICK_UP  ->  REFUSED: PICK_UP is not a legal event from PLACED   (missing transition)
  X    CUSTOMER fires ACCEPT  ->  REFUSED: ACCEPT from PLACED is RESTAURANT's move, not CUSTOMER's   (wrong actor)
== 5. the happy path ========================================
  ok   RESTAURANT fires ACCEPT  ->  ACCEPTED
  assigned Asha via nearest-free (eta 4m)
  ok   RESTAURANT fires START_PREP  ->  PREPARING
== 6. what would cancelling cost right now? ==================
  refund 50% of Rs.384.00  ->  back Rs.192.00, kitchen keeps Rs.192.00   (sums to Rs.384.00)
  ok   RESTAURANT fires MARK_READY  ->  READY
  ok   PARTNER fires PICK_UP  ->  PICKED_UP
== 7. cancelling once it is on a bike ========================
  X    CUSTOMER fires CANCEL  ->  REFUSED: CANCEL is not a legal event from PICKED_UP   (missing transition)
  ok   PARTNER fires DELIVER  ->  DELIVERED
  final DELIVERED, notifications sent 6, history rows 6
== 8. a SECOND order - same cart, new prices ================
  ORD-2  Rs.390.00 + pack Rs.20.00 + delivery Rs.35.00 + tax Rs.20.50 - off Rs.50.00  =  Rs.415.50
  refund due Rs.207.75 of Rs.415.50
== 9. the kitchen never answers ==============================
  after 1 minute:  PLACED
  after 3 minutes: REJECTED  (SYSTEM fired REJECT)
== 10. swap the assignment strategy ==========================
  ORD-4 -> Asha
  ORD-5 -> Asha   (same rider, one trip)
  order-flow code changed: 0 lines
--------------------------------------------------------------------------- */`,
      },
      {
        label: "Python",
        language: "python",
        filename: "food_delivery.py",
        code: `from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from threading import RLock

# ==================================================================== enums


class OrderState(Enum):
    PLACED = "PLACED"
    ACCEPTED = "ACCEPTED"
    PREPARING = "PREPARING"
    READY = "READY"
    PICKED_UP = "PICKED_UP"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"

    @property
    def terminal(self) -> bool:
        return self in (OrderState.DELIVERED, OrderState.CANCELLED, OrderState.REJECTED)

    def __str__(self) -> str:
        return self.value


class OrderEvent(Enum):
    ACCEPT = "ACCEPT"
    REJECT = "REJECT"
    START_PREP = "START_PREP"
    MARK_READY = "MARK_READY"
    PICK_UP = "PICK_UP"
    DELIVER = "DELIVER"
    CANCEL = "CANCEL"

    def __str__(self) -> str:
        return self.value


class Actor(Enum):
    CUSTOMER = "CUSTOMER"
    RESTAURANT = "RESTAURANT"
    PARTNER = "PARTNER"
    SYSTEM = "SYSTEM"

    def __str__(self) -> str:
        return self.value


# ==================================================================== money
# Every amount in this file is an integer number of PAISE. Never a float.


def fmt(paise: int) -> str:
    sign = "-" if paise < 0 else ""
    paise = abs(paise)
    return f"{sign}Rs.{paise // 100}.{paise % 100:02d}"


def bps(paise: int, basis_points: int) -> int:
    """Basis points of an amount, half-up, integers only. 10000 bps = 100%."""
    return (paise * basis_points + 5000) // 10000


def spread(total: int, n: int) -> list[int]:
    """Split a total across n lines so the parts sum to the total EXACTLY."""
    base, rem = divmod(total, n)
    return [base + (1 if i < rem else 0) for i in range(n)]


# ============================================================= the rulebook


class IllegalTransition(Exception):
    pass


S, E, A = OrderState, OrderEvent, Actor

# (from, event, who) -> to.  Eleven rows. Nothing else is legal, ever.
TABLE: list[tuple[OrderState, OrderEvent, Actor, OrderState]] = [
    (S.PLACED,    E.ACCEPT,     A.RESTAURANT, S.ACCEPTED),
    (S.PLACED,    E.REJECT,     A.RESTAURANT, S.REJECTED),
    (S.PLACED,    E.REJECT,     A.SYSTEM,     S.REJECTED),   # auto-reject timeout
    (S.PLACED,    E.CANCEL,     A.CUSTOMER,   S.CANCELLED),
    (S.ACCEPTED,  E.START_PREP, A.RESTAURANT, S.PREPARING),
    (S.ACCEPTED,  E.CANCEL,     A.CUSTOMER,   S.CANCELLED),
    (S.PREPARING, E.MARK_READY, A.RESTAURANT, S.READY),
    (S.PREPARING, E.CANCEL,     A.CUSTOMER,   S.CANCELLED),
    (S.READY,     E.PICK_UP,    A.PARTNER,    S.PICKED_UP),
    (S.READY,     E.CANCEL,     A.CUSTOMER,   S.CANCELLED),
    (S.PICKED_UP, E.DELIVER,    A.PARTNER,    S.DELIVERED),
]


def next_state(frm: OrderState, event: OrderEvent, who: Actor) -> OrderState:
    """
    ONE place decides legality, and it tells the two failures apart:
      no row for (from, event)           -> missing transition
      a row exists but for another actor -> wrong actor
    """
    owner = None
    for f, e, a, to in TABLE:
        if f is not frm or e is not event:
            continue
        owner = a
        if a is who:
            return to
    if owner is None:
        raise IllegalTransition(f"{event} is not a legal event from {frm}   (missing transition)")
    raise IllegalTransition(f"{event} from {frm} is {owner}'s move, not {who}'s   (wrong actor)")


def can(frm: OrderState, event: OrderEvent, who: Actor) -> bool:
    return any(f is frm and e is event and a is who for f, e, a, _ in TABLE)


# ================================================================ catalogue


@dataclass
class MenuItem:
    id: str
    name: str
    price_paise: int          # the kitchen may change this at any moment
    available: bool = True


@dataclass
class Restaurant:
    id: str
    name: str
    open_min: int
    close_min: int
    menu: dict[str, MenuItem] = field(default_factory=dict)

    def add(self, item: MenuItem) -> "Restaurant":
        self.menu[item.id] = item
        return self

    def is_open_at(self, minute_of_day: int) -> bool:
        """Time comes IN. This class never asks the OS what time it is."""
        return self.open_min <= minute_of_day < self.close_min


@dataclass(frozen=True)
class CartLine:
    menu_item_id: str
    qty: int                  # no price here. that is the whole point.


@dataclass
class Cart:
    restaurant_id: str
    lines: list[CartLine] = field(default_factory=list)

    def add(self, menu_item_id: str, qty: int) -> "Cart":
        self.lines.append(CartLine(menu_item_id, qty))
        return self


@dataclass(frozen=True)
class OrderItem:
    """The frozen snapshot: what this dish cost AT CHECKOUT."""
    name: str
    unit_paise: int
    qty: int

    @property
    def line_paise(self) -> int:
        return self.unit_paise * self.qty


# ===================================================================== bill


@dataclass(frozen=True)
class Bill:
    item_subtotal: int
    packaging: int
    delivery_fee: int
    taxes: int
    discount: int
    total: int

    def __post_init__(self) -> None:
        parts = (self.item_subtotal + self.packaging + self.delivery_fee
                 + self.taxes - self.discount)
        if parts != self.total:
            raise ValueError("bill parts do not sum to the total")
        if self.total < 0:
            raise ValueError("total cannot be negative")

    def pretty(self) -> str:
        return (f"{fmt(self.item_subtotal)} + pack {fmt(self.packaging)}"
                f" + delivery {fmt(self.delivery_fee)} + tax {fmt(self.taxes)}"
                f" - off {fmt(self.discount)}  =  {fmt(self.total)}")


PACKAGING, DELIVERY, TAX_BPS = 2000, 3500, 500


def build_bill(cart: Cart, r: Restaurant, discount_paise: int) -> tuple[Bill, list[OrderItem]]:
    """Prices are read from the CURRENT menu, every single time this runs."""
    snapshot: list[OrderItem] = []
    subtotal = 0
    for line in cart.lines:
        item = r.menu.get(line.menu_item_id)
        if item is None:
            raise ValueError(f"no such item: {line.menu_item_id}")
        if not item.available:
            raise ValueError(f"{item.name} is sold out")
        snap = OrderItem(item.name, item.price_paise, line.qty)
        snapshot.append(snap)
        subtotal += snap.line_paise
    discount = min(discount_paise, subtotal)
    taxes = bps(subtotal + PACKAGING, TAX_BPS)
    total = subtotal + PACKAGING + DELIVERY + taxes - discount
    return Bill(subtotal, PACKAGING, DELIVERY, taxes, discount, total), snapshot


# ============================================================= cancellation


class CancellationPolicy(ABC):
    @abstractmethod
    def refund_bps_for(self, state: OrderState) -> int:
        """Basis points refunded, or -1 when cancelling is not allowed."""


class StandardCancellationPolicy(CancellationPolicy):
    def refund_bps_for(self, state: OrderState) -> int:
        if state in (S.PLACED, S.ACCEPTED):
            return 10000        # nothing has been cooked yet
        if state is S.PREPARING:
            return 5000         # the food is already on the pan
        if state is S.READY:
            return 2500         # cooked and boxed
        return -1               # on a bike, or already finished


@dataclass(frozen=True)
class RefundQuote:
    allowed: bool
    refund_paise: int
    kept_paise: int
    reason: str


# ================================================================ observers


class OrderObserver(ABC):
    @abstractmethod
    def on_transition(self, order, frm, to, event, who) -> None: ...


class ChannelNotifier(OrderObserver):
    def __init__(self, channel: str) -> None:
        self.channel, self.sent = channel, 0

    def on_transition(self, order, frm, to, event, who) -> None:
        self.sent += 1
        print(f"        [{self.channel}] {order.id}: {frm} -> {to}")


# ================================================== partners and assignment


@dataclass
class DeliveryPartner:
    id: str
    name: str
    eta_minutes: int
    active_orders: list[str] = field(default_factory=list)

    @property
    def free(self) -> bool:
        return not self.active_orders


@dataclass(frozen=True)
class Assignment:
    partner_id: str
    assigned_at_min: int


class AssignmentStrategy(ABC):
    name = "?"

    @abstractmethod
    def pick(self, order, candidates: list[DeliveryPartner], all_orders: dict):
        ...


class NearestFreeStrategy(AssignmentStrategy):
    name = "nearest-free"

    def pick(self, order, candidates, all_orders):
        free = [p for p in candidates if p.free]
        return min(free, key=lambda p: p.eta_minutes) if free else None


class BatchedPickupStrategy(AssignmentStrategy):
    name = "batched"
    MAX_PER_TRIP = 2

    def pick(self, order, candidates, all_orders):
        # 1. is somebody already going to THIS kitchen with room for one more?
        for p in candidates:
            if not p.active_orders or len(p.active_orders) >= self.MAX_PER_TRIP:
                continue
            for oid in p.active_orders:
                other = all_orders.get(oid)
                if other and not other.state.terminal and other.restaurant.id == order.restaurant.id:
                    return p
        return NearestFreeStrategy().pick(order, candidates, all_orders)   # 2. fall back


class PartnerDirectory:
    """Geography belongs to another interview. This is where it plugs in."""

    def __init__(self) -> None:
        self.all: list[DeliveryPartner] = []

    def candidates_near(self, restaurant: Restaurant) -> list[DeliveryPartner]:
        return self.all                                    # stub


class PartnerReleaser(OrderObserver):
    def __init__(self, directory: PartnerDirectory) -> None:
        self.directory = directory

    def on_transition(self, order, frm, to, event, who) -> None:
        if not to.terminal or order.assignment is None:
            return
        for p in self.directory.all:
            if p.id == order.assignment.partner_id and order.id in p.active_orders:
                p.active_orders.remove(order.id)


# ==================================================================== order


@dataclass(frozen=True)
class TransitionRecord:
    frm: OrderState | None
    to: OrderState
    event: OrderEvent | None
    actor: Actor
    at_min: int


class Order:
    def __init__(self, oid, customer_id, restaurant, items, bill,
                 placed_at_min, policy, observers):
        self.id = oid
        self.customer_id = customer_id
        self.restaurant = restaurant
        self.items = tuple(items)          # immutable snapshot
        self.bill = bill                   # frozen at PLACED, forever
        self.placed_at_min = placed_at_min
        self._state = S.PLACED
        self._policy = policy
        self._observers = observers
        self._lock = RLock()
        self.log: list[TransitionRecord] = []
        self.refund_paise = 0
        self.assignment: Assignment | None = None
        self._fan_out(None, S.PLACED, None, A.CUSTOMER, placed_at_min)

    @property
    def state(self) -> OrderState:          # a getter. there is no setter.
        return self._state

    def transition(self, event: OrderEvent, who: Actor, at_min: int) -> OrderState:
        """The ONLY way the state ever changes."""
        with self._lock:
            frm = self._state
            if frm.terminal:
                raise IllegalTransition(f"{frm} is terminal - nothing follows it")
            to = next_state(frm, event, who)             # throws with a reason
            if event is E.CANCEL:
                quote = self.cancellation_quote()        # the POLICY decides money
                if not quote.allowed:
                    raise IllegalTransition(quote.reason)
                self.refund_paise = quote.refund_paise
            self._state = to
            self._fan_out(frm, to, event, who, at_min)
            return to

    def cancellation_quote(self) -> RefundQuote:
        """Legality came from the table; this only answers 'how much?'."""
        rate = self._policy.refund_bps_for(self._state)
        if rate < 0:
            return RefundQuote(False, 0, 0, f"cancelling is not allowed from {self._state}")
        refund = bps(self.bill.total, rate)
        return RefundQuote(True, refund, self.bill.total - refund,
                           f"refund {rate // 100}% of {fmt(self.bill.total)}")

    def _fan_out(self, frm, to, event, who, at_min) -> None:
        self.log.append(TransitionRecord(frm, to, event, who, at_min))
        for obs in self._observers:
            obs.on_transition(self, frm, to, event, who)


# ================================================================== service


class FoodDeliveryService:
    AUTO_REJECT_AFTER_MIN = 2

    def __init__(self, policy, partners, strategy):
        self.orders: dict[str, Order] = {}
        self.by_request_id: dict[str, Order] = {}          # idempotency
        self.observers: list[OrderObserver] = [PartnerReleaser(partners)]
        self.policy, self.partners, self.strategy = policy, partners, strategy
        self._seq = 0

    def register(self, observer) -> None:                  # +1 channel: 1 line
        self.observers.append(observer)

    def set_assignment_strategy(self, strategy) -> None:   # +1 rule:    1 line
        self.strategy = strategy

    def place_order(self, customer_id, cart, restaurant, discount_paise, request_id, at_min):
        seen = self.by_request_id.get(request_id)
        if seen is not None:
            return seen                                    # a retried tap is not a new order
        if not restaurant.is_open_at(at_min):
            raise ValueError(f"{restaurant.name} is closed at minute {at_min}")

        bill, snapshot = build_bill(cart, restaurant, discount_paise)   # CURRENT prices
        self._seq += 1
        order = Order(f"ORD-{self._seq}", customer_id, restaurant, snapshot, bill,
                      at_min, self.policy, self.observers)
        self.orders[order.id] = order
        self.by_request_id[request_id] = order
        return order

    def assign(self, order, at_min):
        """The flow never names an implementation — that is the seam."""
        p = self.strategy.pick(order, self.partners.candidates_near(order.restaurant), self.orders)
        if p is None:
            return None
        p.active_orders.append(order.id)
        order.assignment = Assignment(p.id, at_min)
        return p

    def tick(self, now_min: int) -> None:
        """The SYSTEM actor. Time comes in; nothing here reads a clock."""
        for order in list(self.orders.values()):
            if order.state is S.PLACED and now_min - order.placed_at_min >= self.AUTO_REJECT_AFTER_MIN:
                order.transition(E.REJECT, A.SYSTEM, now_min)


# ===================================================================== demo


def fire(order, event, who, at_min) -> None:
    try:
        to = order.transition(event, who, at_min)
        print(f"  ok   {who} fires {event}  ->  {to}")
    except IllegalTransition as ex:
        print(f"  X    {who} fires {event}  ->  REFUSED: {ex}")


def main() -> None:
    tandoor = (Restaurant("R1", "Tandoor House", 11 * 60, 23 * 60)
               .add(MenuItem("paneer", "Paneer Butter Masala", 24000))
               .add(MenuItem("naan", "Butter Naan", 6000))
               .add(MenuItem("jamun", "Gulab Jamun", 9000)))

    directory = PartnerDirectory()
    directory.all += [DeliveryPartner("P1", "Asha", 4), DeliveryPartner("P2", "Vikram", 7)]

    app = FoodDeliveryService(StandardCancellationPolicy(), directory, NearestFreeStrategy())
    push = ChannelNotifier("push")
    app.register(push)

    cart = Cart("R1").add("paneer", 1).add("naan", 2)

    print("== 1. place the order at 20:00 (minute 1200) ==================")
    o = app.place_order("C1", cart, tandoor, 5000, "req-abc", 1200)
    print(f"  {o.id}  {o.bill.pretty()}")

    print("== 2. the same tap arrives twice =============================")
    print(f"  same object? {app.place_order('C1', cart, tandoor, 5000, 'req-abc', 1200) is o}")

    print("== 3. the menu price moves AFTER the order exists ============")
    tandoor.menu["paneer"].price_paise = 27000
    print(f"  menu paneer = 27000, order total still {fmt(o.bill.total)}  (frozen)")

    print("== 4. illegal moves are refused, with a reason ===============")
    fire(o, E.PICK_UP, A.PARTNER, 1201)       # missing transition
    fire(o, E.ACCEPT, A.CUSTOMER, 1201)       # wrong actor

    print("== 5. the happy path ========================================")
    fire(o, E.ACCEPT, A.RESTAURANT, 1202)
    p = app.assign(o, 1203)
    print(f"  assigned {p.name} via {app.strategy.name} (eta {p.eta_minutes}m)")
    fire(o, E.START_PREP, A.RESTAURANT, 1203)

    print("== 6. what would cancelling cost right now? ==================")
    q = o.cancellation_quote()
    print(f"  {q.reason}  ->  back {fmt(q.refund_paise)}, kitchen keeps {fmt(q.kept_paise)}"
          f"   (sums to {fmt(q.refund_paise + q.kept_paise)})")

    fire(o, E.MARK_READY, A.RESTAURANT, 1218)
    fire(o, E.PICK_UP, A.PARTNER, 1220)

    print("== 7. cancelling once it is on a bike ========================")
    fire(o, E.CANCEL, A.CUSTOMER, 1221)
    fire(o, E.DELIVER, A.PARTNER, 1238)
    print(f"  final {o.state}, notifications sent {push.sent}, history rows {len(o.log)}")

    print("== 8. a SECOND order - same cart, new prices ================")
    o2 = app.place_order("C2", cart, tandoor, 5000, "req-def", 1240)
    print(f"  {o2.id}  {o2.bill.pretty()}")
    fire(o2, E.ACCEPT, A.RESTAURANT, 1241)
    fire(o2, E.START_PREP, A.RESTAURANT, 1242)
    fire(o2, E.CANCEL, A.CUSTOMER, 1245)
    print(f"  refund due {fmt(o2.refund_paise)} of {fmt(o2.bill.total)}")

    print("== 9. the kitchen never answers ==============================")
    o3 = app.place_order("C3", cart, tandoor, 0, "req-ghi", 1300)
    app.tick(1301)
    print(f"  after 1 minute:  {o3.state}")
    app.tick(1303)
    print(f"  after 3 minutes: {o3.state}  (SYSTEM fired REJECT)")

    print("== 10. swap the assignment strategy ==========================")
    app.set_assignment_strategy(BatchedPickupStrategy())
    a = app.place_order("C4", cart, tandoor, 0, "req-j", 1310)
    b = app.place_order("C5", cart, tandoor, 0, "req-k", 1311)
    fire(a, E.ACCEPT, A.RESTAURANT, 1312)
    fire(b, E.ACCEPT, A.RESTAURANT, 1312)
    print(f"  {a.id} -> {app.assign(a, 1312).name}")
    print(f"  {b.id} -> {app.assign(b, 1312).name}   (same rider, one trip)")
    print("  order-flow code changed: 0 lines")


if __name__ == "__main__":
    main()

# --- expected output (notification lines trimmed) ---------------------------
# ORD-1  Rs.360.00 + pack Rs.20.00 + delivery Rs.35.00 + tax Rs.19.00 - off Rs.50.00  =  Rs.384.00
# same object? True
# menu paneer = 27000, order total still Rs.384.00  (frozen)
# X    PARTNER fires PICK_UP  ->  REFUSED: PICK_UP is not a legal event from PLACED   (missing transition)
# X    CUSTOMER fires ACCEPT  ->  REFUSED: ACCEPT from PLACED is RESTAURANT's move, not CUSTOMER's   (wrong actor)
# refund 50% of Rs.384.00  ->  back Rs.192.00, kitchen keeps Rs.192.00   (sums to Rs.384.00)
# X    CUSTOMER fires CANCEL  ->  REFUSED: CANCEL is not a legal event from PICKED_UP   (missing transition)
# final DELIVERED, notifications sent 6, history rows 6
# ORD-2  Rs.390.00 + pack Rs.20.00 + delivery Rs.35.00 + tax Rs.20.50 - off Rs.50.00  =  Rs.415.50
# refund due Rs.207.75 of Rs.415.50
# after 3 minutes: REJECTED  (SYSTEM fired REJECT)
# ORD-5 -> Asha   (same rider, one trip)`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "food_delivery.cpp",
        code: `// g++ -std=c++17 -O2 food_delivery.cpp -o fd && ./fd
#include <algorithm>
#include <iostream>
#include <map>
#include <memory>
#include <mutex>
#include <stdexcept>
#include <string>
#include <vector>

/* ==================================================================== enums */
enum class State { PLACED, ACCEPTED, PREPARING, READY, PICKED_UP, DELIVERED, CANCELLED, REJECTED };
enum class Event { ACCEPT, REJECT, START_PREP, MARK_READY, PICK_UP, DELIVER, CANCEL };
enum class Actor { CUSTOMER, RESTAURANT, PARTNER, SYSTEM };

static const char* SN[] = {"PLACED","ACCEPTED","PREPARING","READY","PICKED_UP",
                           "DELIVERED","CANCELLED","REJECTED"};
static const char* EN[] = {"ACCEPT","REJECT","START_PREP","MARK_READY","PICK_UP","DELIVER","CANCEL"};
static const char* AN[] = {"CUSTOMER","RESTAURANT","PARTNER","SYSTEM"};

static std::string name(State s) { return SN[static_cast<int>(s)]; }
static std::string name(Event e) { return EN[static_cast<int>(e)]; }
static std::string name(Actor a) { return AN[static_cast<int>(a)]; }

static bool terminal(State s) {
    return s == State::DELIVERED || s == State::CANCELLED || s == State::REJECTED;
}

/* ==================================================================== money */
// Every amount here is an integer number of PAISE. Never a double.
static std::string fmt(long long paise) {
    bool neg = paise < 0;
    long long a = neg ? -paise : paise;
    std::string frac = std::to_string(a % 100);
    if (frac.size() == 1) frac = "0" + frac;
    return (neg ? "-" : "") + std::string("Rs.") + std::to_string(a / 100) + "." + frac;
}
/** Basis points of an amount, half-up, integers only. 10000 bps = 100%. */
static long long bps(long long paise, long long basisPoints) {
    return (paise * basisPoints + 5000) / 10000;
}
/** Split a total across n lines so the parts sum to the total EXACTLY. */
static std::vector<long long> spread(long long total, int n) {
    std::vector<long long> out(n);
    long long base = total / n, rem = total % n;
    for (int i = 0; i < n; ++i) out[i] = base + (i < rem ? 1 : 0);
    return out;
}

/* ============================================================= the rulebook */
struct IllegalTransition : std::runtime_error {
    explicit IllegalTransition(const std::string& m) : std::runtime_error(m) {}
};

struct Row { State from; Event event; Actor actor; State to; };

// (from, event, who) -> to.  Eleven rows. Nothing else is legal, ever.
static const std::vector<Row> TABLE = {
    {State::PLACED,    Event::ACCEPT,     Actor::RESTAURANT, State::ACCEPTED},
    {State::PLACED,    Event::REJECT,     Actor::RESTAURANT, State::REJECTED},
    {State::PLACED,    Event::REJECT,     Actor::SYSTEM,     State::REJECTED},  // timeout
    {State::PLACED,    Event::CANCEL,     Actor::CUSTOMER,   State::CANCELLED},
    {State::ACCEPTED,  Event::START_PREP, Actor::RESTAURANT, State::PREPARING},
    {State::ACCEPTED,  Event::CANCEL,     Actor::CUSTOMER,   State::CANCELLED},
    {State::PREPARING, Event::MARK_READY, Actor::RESTAURANT, State::READY},
    {State::PREPARING, Event::CANCEL,     Actor::CUSTOMER,   State::CANCELLED},
    {State::READY,     Event::PICK_UP,    Actor::PARTNER,    State::PICKED_UP},
    {State::READY,     Event::CANCEL,     Actor::CUSTOMER,   State::CANCELLED},
    {State::PICKED_UP, Event::DELIVER,    Actor::PARTNER,    State::DELIVERED},
};

/**
 * ONE place decides legality, and it tells the two failures apart:
 *   no row for (from, event)           -> missing transition
 *   a row exists but for another actor -> wrong actor
 */
static State nextState(State from, Event e, Actor who) {
    const Row* owner = nullptr;
    for (const Row& r : TABLE) {
        if (r.from != from || r.event != e) continue;
        owner = &r;
        if (r.actor == who) return r.to;
    }
    if (!owner)
        throw IllegalTransition(name(e) + " is not a legal event from " + name(from) +
                                "   (missing transition)");
    throw IllegalTransition(name(e) + " from " + name(from) + " is " + name(owner->actor) +
                            "'s move, not " + name(who) + "'s   (wrong actor)");
}

/* ================================================================ catalogue */
struct MenuItem {
    std::string id, itemName;
    long long pricePaise;          // the kitchen may change this at any moment
    bool available = true;
};

struct Restaurant {
    std::string id, rname;
    int openMin, closeMin;                        // minutes since midnight
    std::map<std::string, MenuItem> menu;
    Restaurant& add(const MenuItem& m) { menu[m.id] = m; return *this; }
    // Time comes IN. This struct never asks the OS what time it is.
    bool isOpenAt(int minuteOfDay) const { return minuteOfDay >= openMin && minuteOfDay < closeMin; }
};

struct CartLine { std::string menuItemId; int qty; };   // no price. that is the point.

struct Cart {
    std::string restaurantId;
    std::vector<CartLine> lines;
    Cart& add(const std::string& id, int qty) { lines.push_back({id, qty}); return *this; }
};

/** The frozen snapshot: what this dish cost AT CHECKOUT. */
struct OrderItem {
    std::string itemName;
    long long unitPaise;
    int qty;
    long long linePaise() const { return unitPaise * qty; }
};

/* ===================================================================== bill */
struct Bill {
    long long itemSubtotal = 0, packaging = 0, deliveryFee = 0, taxes = 0, discount = 0, total = 0;
    Bill() = default;
    Bill(long long s, long long p, long long d, long long t, long long off, long long tot)
        : itemSubtotal(s), packaging(p), deliveryFee(d), taxes(t), discount(off), total(tot) {
        if (s + p + d + t - off != tot) throw std::invalid_argument("bill parts do not sum to total");
        if (tot < 0) throw std::invalid_argument("total cannot be negative");
    }
    std::string pretty() const {
        return fmt(itemSubtotal) + " + pack " + fmt(packaging) + " + delivery " + fmt(deliveryFee) +
               " + tax " + fmt(taxes) + " - off " + fmt(discount) + "  =  " + fmt(total);
    }
};

static const long long PACKAGING = 2000, DELIVERY = 3500, TAX_BPS = 500;

/** Prices are read from the CURRENT menu, every single time this runs. */
static Bill buildBill(const Cart& cart, const Restaurant& r, long long discountPaise,
                      std::vector<OrderItem>& snapshotOut) {
    long long subtotal = 0;
    for (const CartLine& line : cart.lines) {
        auto it = r.menu.find(line.menuItemId);
        if (it == r.menu.end()) throw std::invalid_argument("no such item: " + line.menuItemId);
        if (!it->second.available) throw std::invalid_argument(it->second.itemName + " is sold out");
        OrderItem snap{it->second.itemName, it->second.pricePaise, line.qty};
        snapshotOut.push_back(snap);
        subtotal += snap.linePaise();
    }
    long long discount = std::min(discountPaise, subtotal);
    long long taxes = bps(subtotal + PACKAGING, TAX_BPS);
    long long total = subtotal + PACKAGING + DELIVERY + taxes - discount;
    return Bill(subtotal, PACKAGING, DELIVERY, taxes, discount, total);
}

/* ============================================================= cancellation */
struct CancellationPolicy {
    virtual ~CancellationPolicy() = default;
    /** Basis points refunded, or -1 when cancelling is not allowed. */
    virtual long long refundBpsFor(State s) const = 0;
};

struct StandardCancellationPolicy : CancellationPolicy {
    long long refundBpsFor(State s) const override {
        switch (s) {
            case State::PLACED:
            case State::ACCEPTED:  return 10000;   // nothing has been cooked yet
            case State::PREPARING: return 5000;    // the food is already on the pan
            case State::READY:     return 2500;    // cooked and boxed
            default:               return -1;      // on a bike, or already finished
        }
    }
};

struct RefundQuote { bool allowed; long long refundPaise, keptPaise; std::string reason; };

/* ================================================== partners and assignment */
struct Order;   // forward

struct OrderObserver {
    virtual ~OrderObserver() = default;
    virtual void onTransition(Order& o, State from, State to, Event e, Actor who) = 0;
};

struct DeliveryPartner {
    std::string id, pname;
    int etaMinutes;
    std::vector<std::string> activeOrders;
    bool free() const { return activeOrders.empty(); }
};

struct Assignment { std::string partnerId; int assignedAtMin; bool set = false; };

struct AssignmentStrategy {
    virtual ~AssignmentStrategy() = default;
    virtual std::string sname() const = 0;
    virtual DeliveryPartner* pick(const Order& o, std::vector<DeliveryPartner>& cands,
                                  const std::map<std::string, Order*>& all) = 0;
};

/* ==================================================================== order */
struct TransitionRecord { State from, to; Event event; Actor actor; int atMin; bool initial; };

struct Order {
    std::string id, customerId, restaurantId;
    std::vector<OrderItem> items;      // immutable snapshot of what was ordered
    Bill bill;                         // frozen at PLACED, forever
    int placedAtMin = 0;
    Assignment assignment;
    long long refundPaise = 0;
    std::vector<TransitionRecord> log;

    Order(std::string oid, std::string cid, std::string rid, std::vector<OrderItem> snap,
          Bill b, int atMin, const CancellationPolicy* policy,
          std::vector<OrderObserver*>* observers)
        : id(std::move(oid)), customerId(std::move(cid)), restaurantId(std::move(rid)),
          items(std::move(snap)), bill(b), placedAtMin(atMin),
          policy_(policy), observers_(observers) {
        fanOut(State::PLACED, State::PLACED, Event::ACCEPT, Actor::CUSTOMER, atMin, true);
    }

    State state() const { return state_; }        // a getter. there is no setter.

    /** The ONLY way the state ever changes. */
    State transition(Event e, Actor who, int atMin) {
        std::lock_guard<std::mutex> guard(mu_);
        State from = state_;
        if (terminal(from))
            throw IllegalTransition(name(from) + " is terminal - nothing follows it");
        State to = nextState(from, e, who);                 // throws with a reason
        if (e == Event::CANCEL) {
            RefundQuote q = cancellationQuote();            // the POLICY decides money
            if (!q.allowed) throw IllegalTransition(q.reason);
            refundPaise = q.refundPaise;
        }
        state_ = to;
        fanOut(from, to, e, who, atMin, false);
        return to;
    }

    /** Legality came from the table; this only answers "how much?". */
    RefundQuote cancellationQuote() const {
        long long rate = policy_->refundBpsFor(state_);
        if (rate < 0) return {false, 0, 0, "cancelling is not allowed from " + name(state_)};
        long long refund = bps(bill.total, rate);
        return {true, refund, bill.total - refund,
                "refund " + std::to_string(rate / 100) + "% of " + fmt(bill.total)};
    }

  private:
    State state_ = State::PLACED;
    const CancellationPolicy* policy_;
    std::vector<OrderObserver*>* observers_;
    mutable std::mutex mu_;

    void fanOut(State from, State to, Event e, Actor who, int atMin, bool initial) {
        log.push_back({from, to, e, who, atMin, initial});
        for (OrderObserver* o : *observers_) o->onTransition(*this, from, to, e, who);
    }
};

struct ChannelNotifier : OrderObserver {
    std::string channel;
    int sent = 0;
    explicit ChannelNotifier(std::string c) : channel(std::move(c)) {}
    void onTransition(Order& o, State from, State to, Event, Actor) override {
        ++sent;
        std::cout << "        [" << channel << "] " << o.id << ": " << name(from)
                  << " -> " << name(to) << "\\n";
    }
};

struct NearestFreeStrategy : AssignmentStrategy {
    std::string sname() const override { return "nearest-free"; }
    DeliveryPartner* pick(const Order&, std::vector<DeliveryPartner>& cands,
                          const std::map<std::string, Order*>&) override {
        DeliveryPartner* best = nullptr;
        for (DeliveryPartner& p : cands)
            if (p.free() && (!best || p.etaMinutes < best->etaMinutes)) best = &p;
        return best;
    }
};

struct BatchedPickupStrategy : AssignmentStrategy {
    static const int MAX_PER_TRIP = 2;
    std::string sname() const override { return "batched"; }
    DeliveryPartner* pick(const Order& order, std::vector<DeliveryPartner>& cands,
                          const std::map<std::string, Order*>& all) override {
        // 1. is somebody already going to THIS kitchen with room for one more?
        for (DeliveryPartner& p : cands) {
            if (p.activeOrders.empty() || (int)p.activeOrders.size() >= MAX_PER_TRIP) continue;
            for (const std::string& oid : p.activeOrders) {
                auto it = all.find(oid);
                if (it != all.end() && !terminal(it->second->state()) &&
                    it->second->restaurantId == order.restaurantId) return &p;
            }
        }
        NearestFreeStrategy fallback;                       // 2. fall back
        return fallback.pick(order, cands, all);
    }
};

/* ================================================================== service */
struct FoodDeliveryService {
    static const int AUTO_REJECT_AFTER_MIN = 2;

    std::map<std::string, Order*> orders;
    std::map<std::string, Order*> byRequestId;              // idempotency
    std::vector<OrderObserver*> observers;
    std::vector<DeliveryPartner> partners;                  // the "directory" stub
    const CancellationPolicy* policy;
    AssignmentStrategy* strategy;
    int seq = 0;

    void registerObserver(OrderObserver* o) { observers.push_back(o); }   // +1 channel: 1 line
    void setAssignmentStrategy(AssignmentStrategy* s) { strategy = s; }   // +1 rule:    1 line

    Order* placeOrder(const std::string& customerId, const Cart& cart, Restaurant& r,
                      long long discountPaise, const std::string& requestId, int atMin) {
        auto seen = byRequestId.find(requestId);
        if (seen != byRequestId.end()) return seen->second;  // a retried tap is not a new order
        if (!r.isOpenAt(atMin)) throw std::invalid_argument(r.rname + " is closed");

        std::vector<OrderItem> snapshot;
        Bill bill = buildBill(cart, r, discountPaise, snapshot);          // CURRENT prices
        Order* o = new Order("ORD-" + std::to_string(++seq), customerId, r.id,
                             std::move(snapshot), bill, atMin, policy, &observers);
        orders[o->id] = o;
        byRequestId[requestId] = o;
        return o;
    }

    /** The flow never names an implementation — that is the seam. */
    DeliveryPartner* assign(Order& o, int atMin) {
        DeliveryPartner* p = strategy->pick(o, partners, orders);
        if (!p) return nullptr;
        p->activeOrders.push_back(o.id);
        o.assignment = {p->id, atMin, true};
        return p;
    }

    /** The SYSTEM actor. Time comes in; nothing here reads a clock. */
    void tick(int nowMin) {
        for (auto& kv : orders)
            if (kv.second->state() == State::PLACED &&
                nowMin - kv.second->placedAtMin >= AUTO_REJECT_AFTER_MIN)
                kv.second->transition(Event::REJECT, Actor::SYSTEM, nowMin);
    }
};

/* ===================================================================== demo */
static void fire(Order& o, Event e, Actor who, int atMin) {
    try {
        State to = o.transition(e, who, atMin);
        std::cout << "  ok   " << name(who) << " fires " << name(e) << "  ->  " << name(to) << "\\n";
    } catch (const IllegalTransition& ex) {
        std::cout << "  X    " << name(who) << " fires " << name(e)
                  << "  ->  REFUSED: " << ex.what() << "\\n";
    }
}

int main() {
    Restaurant tandoor{"R1", "Tandoor House", 11 * 60, 23 * 60, {}};
    tandoor.add({"paneer", "Paneer Butter Masala", 24000, true})
           .add({"naan", "Butter Naan", 6000, true})
           .add({"jamun", "Gulab Jamun", 9000, true});

    StandardCancellationPolicy policy;
    NearestFreeStrategy nearest;
    BatchedPickupStrategy batched;
    ChannelNotifier push("push");

    FoodDeliveryService app;
    app.policy = &policy;
    app.strategy = &nearest;
    app.partners = {{"P1", "Asha", 4, {}}, {"P2", "Vikram", 7, {}}};
    app.registerObserver(&push);

    Cart cart("R1");
    cart.add("paneer", 1).add("naan", 2);

    std::cout << "== 1. place the order at 20:00 (minute 1200) ==================\\n";
    Order* o = app.placeOrder("C1", cart, tandoor, 5000, "req-abc", 1200);
    std::cout << "  " << o->id << "  " << o->bill.pretty() << "\\n";

    std::cout << "== 2. the same tap arrives twice =============================\\n";
    std::cout << "  same object? "
              << (app.placeOrder("C1", cart, tandoor, 5000, "req-abc", 1200) == o) << "\\n";

    std::cout << "== 3. the menu price moves AFTER the order exists ============\\n";
    tandoor.menu["paneer"].pricePaise = 27000;
    std::cout << "  order total still " << fmt(o->bill.total) << "  (frozen)\\n";

    std::cout << "== 4. illegal moves are refused, with a reason ===============\\n";
    fire(*o, Event::PICK_UP, Actor::PARTNER, 1201);      // missing transition
    fire(*o, Event::ACCEPT, Actor::CUSTOMER, 1201);      // wrong actor

    std::cout << "== 5. the happy path ========================================\\n";
    fire(*o, Event::ACCEPT, Actor::RESTAURANT, 1202);
    DeliveryPartner* p = app.assign(*o, 1203);
    std::cout << "  assigned " << p->pname << " via " << app.strategy->sname() << "\\n";
    fire(*o, Event::START_PREP, Actor::RESTAURANT, 1203);

    std::cout << "== 6. what would cancelling cost right now? ==================\\n";
    RefundQuote q = o->cancellationQuote();
    std::cout << "  " << q.reason << "  ->  back " << fmt(q.refundPaise) << ", kitchen keeps "
              << fmt(q.keptPaise) << "   (sums to " << fmt(q.refundPaise + q.keptPaise) << ")\\n";

    fire(*o, Event::MARK_READY, Actor::RESTAURANT, 1218);
    fire(*o, Event::PICK_UP, Actor::PARTNER, 1220);

    std::cout << "== 7. cancelling once it is on a bike ========================\\n";
    fire(*o, Event::CANCEL, Actor::CUSTOMER, 1221);
    fire(*o, Event::DELIVER, Actor::PARTNER, 1238);
    std::cout << "  final " << name(o->state()) << ", notifications " << push.sent << "\\n";

    std::cout << "== 8. a SECOND order - same cart, new prices ================\\n";
    Order* o2 = app.placeOrder("C2", cart, tandoor, 5000, "req-def", 1240);
    std::cout << "  " << o2->id << "  " << o2->bill.pretty() << "\\n";
    fire(*o2, Event::ACCEPT, Actor::RESTAURANT, 1241);
    fire(*o2, Event::START_PREP, Actor::RESTAURANT, 1242);
    fire(*o2, Event::CANCEL, Actor::CUSTOMER, 1245);
    std::cout << "  refund due " << fmt(o2->refundPaise) << " of " << fmt(o2->bill.total) << "\\n";

    std::cout << "== 9. the kitchen never answers ==============================\\n";
    Order* o3 = app.placeOrder("C3", cart, tandoor, 0, "req-ghi", 1300);
    app.tick(1301);
    std::cout << "  after 1 minute:  " << name(o3->state()) << "\\n";
    app.tick(1303);
    std::cout << "  after 3 minutes: " << name(o3->state()) << "  (SYSTEM fired REJECT)\\n";

    std::cout << "== 10. swap the assignment strategy ==========================\\n";
    app.setAssignmentStrategy(&batched);
    Order* a = app.placeOrder("C4", cart, tandoor, 0, "req-j", 1310);
    Order* b = app.placeOrder("C5", cart, tandoor, 0, "req-k", 1311);
    fire(*a, Event::ACCEPT, Actor::RESTAURANT, 1312);
    fire(*b, Event::ACCEPT, Actor::RESTAURANT, 1312);
    std::cout << "  " << a->id << " -> " << app.assign(*a, 1312)->pname << "\\n";
    std::cout << "  " << b->id << " -> " << app.assign(*b, 1312)->pname
              << "   (same rider, one trip)\\n";
    std::cout << "  order-flow code changed: 0 lines\\n";
    return 0;
}

/* --- expected output (notification lines trimmed) ---------------------------
  ORD-1  Rs.360.00 + pack Rs.20.00 + delivery Rs.35.00 + tax Rs.19.00 - off Rs.50.00  =  Rs.384.00
  order total still Rs.384.00  (frozen)
  X    PARTNER fires PICK_UP  ->  REFUSED: PICK_UP is not a legal event from PLACED   (missing transition)
  X    CUSTOMER fires ACCEPT  ->  REFUSED: ACCEPT from PLACED is RESTAURANT's move, not CUSTOMER's   (wrong actor)
  refund 50% of Rs.384.00  ->  back Rs.192.00, kitchen keeps Rs.192.00   (sums to Rs.384.00)
  X    CUSTOMER fires CANCEL  ->  REFUSED: CANCEL is not a legal event from PICKED_UP   (missing transition)
  ORD-2  Rs.390.00 + pack Rs.20.00 + delivery Rs.35.00 + tax Rs.20.50 - off Rs.50.00  =  Rs.415.50
  after 3 minutes: REJECTED  (SYSTEM fired REJECT)
  ORD-5 -> Asha   (same rider, one trip)
--------------------------------------------------------------------------- */`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "foodDelivery.ts",
        code: `// npx tsx foodDelivery.ts

/* ==================================================================== enums */
export enum State {
  PLACED = "PLACED", ACCEPTED = "ACCEPTED", PREPARING = "PREPARING", READY = "READY",
  PICKED_UP = "PICKED_UP", DELIVERED = "DELIVERED", CANCELLED = "CANCELLED", REJECTED = "REJECTED",
}
export enum Evt {
  ACCEPT = "ACCEPT", REJECT = "REJECT", START_PREP = "START_PREP", MARK_READY = "MARK_READY",
  PICK_UP = "PICK_UP", DELIVER = "DELIVER", CANCEL = "CANCEL",
}
export enum Actor { CUSTOMER = "CUSTOMER", RESTAURANT = "RESTAURANT", PARTNER = "PARTNER", SYSTEM = "SYSTEM" }

const TERMINAL = new Set([State.DELIVERED, State.CANCELLED, State.REJECTED]);
const isTerminal = (s: State) => TERMINAL.has(s);

/* ==================================================================== money */
// Every amount in this file is an integer number of PAISE. Never a float.
export function fmt(paise: number): string {
  const neg = paise < 0, a = Math.abs(paise);
  return (neg ? "-" : "") + "Rs." + Math.floor(a / 100) + "." + ("0" + (a % 100)).slice(-2);
}
/** Basis points of an amount, half-up, integers only. 10000 bps = 100%. */
export function bps(paise: number, basisPoints: number): number {
  return Math.floor((paise * basisPoints + 5000) / 10000);
}
/** Split a total across n lines so the parts sum to the total EXACTLY. */
export function spread(total: number, n: number): number[] {
  const base = Math.floor(total / n), rem = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < rem ? 1 : 0));
}

/* ============================================================= the rulebook */
export class IllegalTransition extends Error {}

type Row = { from: State; event: Evt; actor: Actor; to: State };

// (from, event, who) -> to.  Eleven rows. Nothing else is legal, ever.
const TABLE: Row[] = [
  { from: State.PLACED,    event: Evt.ACCEPT,     actor: Actor.RESTAURANT, to: State.ACCEPTED },
  { from: State.PLACED,    event: Evt.REJECT,     actor: Actor.RESTAURANT, to: State.REJECTED },
  { from: State.PLACED,    event: Evt.REJECT,     actor: Actor.SYSTEM,     to: State.REJECTED },
  { from: State.PLACED,    event: Evt.CANCEL,     actor: Actor.CUSTOMER,   to: State.CANCELLED },
  { from: State.ACCEPTED,  event: Evt.START_PREP, actor: Actor.RESTAURANT, to: State.PREPARING },
  { from: State.ACCEPTED,  event: Evt.CANCEL,     actor: Actor.CUSTOMER,   to: State.CANCELLED },
  { from: State.PREPARING, event: Evt.MARK_READY, actor: Actor.RESTAURANT, to: State.READY },
  { from: State.PREPARING, event: Evt.CANCEL,     actor: Actor.CUSTOMER,   to: State.CANCELLED },
  { from: State.READY,     event: Evt.PICK_UP,    actor: Actor.PARTNER,    to: State.PICKED_UP },
  { from: State.READY,     event: Evt.CANCEL,     actor: Actor.CUSTOMER,   to: State.CANCELLED },
  { from: State.PICKED_UP, event: Evt.DELIVER,    actor: Actor.PARTNER,    to: State.DELIVERED },
];

/**
 * ONE place decides legality, and it tells the two failures apart:
 *   no row for (from, event)           -> missing transition
 *   a row exists but for another actor -> wrong actor
 */
export function nextState(from: State, event: Evt, who: Actor): State {
  let owner: Actor | null = null;
  for (const r of TABLE) {
    if (r.from !== from || r.event !== event) continue;
    owner = r.actor;
    if (r.actor === who) return r.to;
  }
  if (owner === null)
    throw new IllegalTransition(event + " is not a legal event from " + from + "   (missing transition)");
  throw new IllegalTransition(
    event + " from " + from + " is " + owner + "'s move, not " + who + "'s   (wrong actor)");
}

export const can = (from: State, event: Evt, who: Actor) =>
  TABLE.some((r) => r.from === from && r.event === event && r.actor === who);

/* ================================================================ catalogue */
export type MenuItem = { id: string; name: string; pricePaise: number; available: boolean };

export class Restaurant {
  menu = new Map<string, MenuItem>();
  constructor(readonly id: string, readonly name: string,
              readonly openMin: number, readonly closeMin: number) {}
  add(m: MenuItem): this { this.menu.set(m.id, m); return this; }
  /** Time comes IN. This class never asks the OS what time it is. */
  isOpenAt(minuteOfDay: number): boolean {
    return minuteOfDay >= this.openMin && minuteOfDay < this.closeMin;
  }
}

export type CartLine = { menuItemId: string; qty: number };   // no price. that is the point.

export class Cart {
  lines: CartLine[] = [];
  constructor(readonly restaurantId: string) {}
  add(menuItemId: string, qty: number): this { this.lines.push({ menuItemId, qty }); return this; }
}

/** The frozen snapshot: what this dish cost AT CHECKOUT. */
export type OrderItem = { name: string; unitPaise: number; qty: number };

/* ===================================================================== bill */
export class Bill {
  constructor(
    readonly itemSubtotal: number, readonly packaging: number, readonly deliveryFee: number,
    readonly taxes: number, readonly discount: number, readonly total: number,
  ) {
    const parts = itemSubtotal + packaging + deliveryFee + taxes - discount;
    if (parts !== total) throw new Error("bill parts do not sum to the total");
    if (total < 0) throw new Error("total cannot be negative");
  }
  pretty(): string {
    return fmt(this.itemSubtotal) + " + pack " + fmt(this.packaging) +
           " + delivery " + fmt(this.deliveryFee) + " + tax " + fmt(this.taxes) +
           " - off " + fmt(this.discount) + "  =  " + fmt(this.total);
  }
}

const PACKAGING = 2000, DELIVERY = 3500, TAX_BPS = 500;

/** Prices are read from the CURRENT menu, every single time this runs. */
export function buildBill(cart: Cart, r: Restaurant, discountPaise: number):
    { bill: Bill; snapshot: OrderItem[] } {
  const snapshot: OrderItem[] = [];
  let subtotal = 0;
  for (const line of cart.lines) {
    const item = r.menu.get(line.menuItemId);
    if (!item) throw new Error("no such item: " + line.menuItemId);
    if (!item.available) throw new Error(item.name + " is sold out");
    snapshot.push({ name: item.name, unitPaise: item.pricePaise, qty: line.qty });
    subtotal += item.pricePaise * line.qty;
  }
  const discount = Math.min(discountPaise, subtotal);
  const taxes = bps(subtotal + PACKAGING, TAX_BPS);
  const total = subtotal + PACKAGING + DELIVERY + taxes - discount;
  return { bill: new Bill(subtotal, PACKAGING, DELIVERY, taxes, discount, total), snapshot };
}

/* ============================================================= cancellation */
export interface CancellationPolicy {
  /** Basis points refunded, or -1 when cancelling is not allowed. */
  refundBpsFor(state: State): number;
}

export class StandardCancellationPolicy implements CancellationPolicy {
  refundBpsFor(state: State): number {
    if (state === State.PLACED || state === State.ACCEPTED) return 10000;  // nothing cooked yet
    if (state === State.PREPARING) return 5000;                            // already on the pan
    if (state === State.READY) return 2500;                                // cooked and boxed
    return -1;                                                             // on a bike, or done
  }
}

export type RefundQuote = { allowed: boolean; refundPaise: number; keptPaise: number; reason: string };

/* ================================================================ observers */
export interface OrderObserver {
  onTransition(o: Order, from: State | null, to: State, e: Evt | null, who: Actor): void;
}

export class ChannelNotifier implements OrderObserver {
  sent = 0;
  constructor(private readonly channel: string) {}
  onTransition(o: Order, from: State | null, to: State): void {
    this.sent++;
    console.log("        [" + this.channel + "] " + o.id + ": " + from + " -> " + to);
  }
}

/* ================================================== partners and assignment */
export class DeliveryPartner {
  activeOrders: string[] = [];
  constructor(readonly id: string, readonly name: string, readonly etaMinutes: number) {}
  get free(): boolean { return this.activeOrders.length === 0; }
}

export type Assignment = { partnerId: string; assignedAtMin: number };

export interface AssignmentStrategy {
  readonly name: string;
  pick(order: Order, candidates: DeliveryPartner[], all: Map<string, Order>): DeliveryPartner | null;
}

export class NearestFreeStrategy implements AssignmentStrategy {
  readonly name = "nearest-free";
  pick(_o: Order, candidates: DeliveryPartner[]): DeliveryPartner | null {
    const free = candidates.filter((p) => p.free);
    return free.length ? free.reduce((a, b) => (b.etaMinutes < a.etaMinutes ? b : a)) : null;
  }
}

export class BatchedPickupStrategy implements AssignmentStrategy {
  readonly name = "batched";
  private static readonly MAX_PER_TRIP = 2;
  pick(order: Order, candidates: DeliveryPartner[], all: Map<string, Order>): DeliveryPartner | null {
    // 1. is somebody already going to THIS kitchen with room for one more?
    for (const p of candidates) {
      if (p.activeOrders.length === 0 ||
          p.activeOrders.length >= BatchedPickupStrategy.MAX_PER_TRIP) continue;
      for (const oid of p.activeOrders) {
        const other = all.get(oid);
        if (other && !isTerminal(other.state) && other.restaurantId === order.restaurantId) return p;
      }
    }
    return new NearestFreeStrategy().pick(order, candidates, all);   // 2. fall back
  }
}

/** Geography belongs to another interview. This is where it plugs in. */
export class PartnerDirectory {
  all: DeliveryPartner[] = [];
  candidatesNear(_r: Restaurant): DeliveryPartner[] { return this.all; }   // stub
}

export class PartnerReleaser implements OrderObserver {
  constructor(private readonly dir: PartnerDirectory) {}
  onTransition(o: Order, _from: State | null, to: State): void {
    if (!isTerminal(to) || !o.assignment) return;
    for (const p of this.dir.all)
      if (p.id === o.assignment.partnerId)
        p.activeOrders = p.activeOrders.filter((id) => id !== o.id);
  }
}

/* ==================================================================== order */
export type TransitionRecord =
  { from: State | null; to: State; event: Evt | null; actor: Actor; atMin: number };

export class Order {
  private _state: State = State.PLACED;
  readonly log: TransitionRecord[] = [];
  refundPaise = 0;
  assignment: Assignment | null = null;

  constructor(
    readonly id: string, readonly customerId: string, readonly restaurantId: string,
    readonly items: ReadonlyArray<OrderItem>,        // immutable snapshot
    readonly bill: Bill,                             // frozen at PLACED, forever
    readonly placedAtMin: number,
    private readonly policy: CancellationPolicy,
    private readonly observers: OrderObserver[],
  ) {
    this.fanOut(null, State.PLACED, null, Actor.CUSTOMER, placedAtMin);
  }

  get state(): State { return this._state; }        // a getter. there is no setter.

  /** The ONLY way the state ever changes. */
  transition(event: Evt, who: Actor, atMin: number): State {
    const from = this._state;
    if (isTerminal(from)) throw new IllegalTransition(from + " is terminal - nothing follows it");
    const to = nextState(from, event, who);          // throws with a reason
    if (event === Evt.CANCEL) {
      const q = this.cancellationQuote();            // the POLICY decides money
      if (!q.allowed) throw new IllegalTransition(q.reason);
      this.refundPaise = q.refundPaise;
    }
    this._state = to;
    this.fanOut(from, to, event, who, atMin);
    return to;
  }

  /** Legality came from the table; this only answers "how much?". */
  cancellationQuote(): RefundQuote {
    const rate = this.policy.refundBpsFor(this._state);
    if (rate < 0)
      return { allowed: false, refundPaise: 0, keptPaise: 0,
               reason: "cancelling is not allowed from " + this._state };
    const refund = bps(this.bill.total, rate);
    return { allowed: true, refundPaise: refund, keptPaise: this.bill.total - refund,
             reason: "refund " + Math.floor(rate / 100) + "% of " + fmt(this.bill.total) };
  }

  private fanOut(from: State | null, to: State, e: Evt | null, who: Actor, atMin: number): void {
    this.log.push({ from, to, event: e, actor: who, atMin });
    for (const o of this.observers) o.onTransition(this, from, to, e, who);
  }
}

/* ================================================================== service */
export class FoodDeliveryService {
  static readonly AUTO_REJECT_AFTER_MIN = 2;
  readonly orders = new Map<string, Order>();
  private readonly byRequestId = new Map<string, Order>();     // idempotency
  private readonly observers: OrderObserver[];
  private seq = 0;

  constructor(private readonly policy: CancellationPolicy,
              private readonly partners: PartnerDirectory,
              private strategy: AssignmentStrategy) {
    this.observers = [new PartnerReleaser(partners)];
  }

  register(o: OrderObserver): void { this.observers.push(o); }              // +1 channel: 1 line
  setAssignmentStrategy(s: AssignmentStrategy): void { this.strategy = s; } // +1 rule:    1 line
  get strategyName(): string { return this.strategy.name; }

  placeOrder(customerId: string, cart: Cart, r: Restaurant, discountPaise: number,
             requestId: string, atMin: number): Order {
    const seen = this.byRequestId.get(requestId);
    if (seen) return seen;                          // a retried tap is not a new order
    if (!r.isOpenAt(atMin)) throw new Error(r.name + " is closed at minute " + atMin);

    const { bill, snapshot } = buildBill(cart, r, discountPaise);           // CURRENT prices
    const o = new Order("ORD-" + ++this.seq, customerId, r.id, snapshot, bill,
                        atMin, this.policy, this.observers);
    this.orders.set(o.id, o);
    this.byRequestId.set(requestId, o);
    return o;
  }

  /** The flow never names an implementation — that is the seam. */
  assign(o: Order, atMin: number): DeliveryPartner | null {
    const r = { id: o.restaurantId } as unknown as Restaurant;
    const p = this.strategy.pick(o, this.partners.candidatesNear(r), this.orders);
    if (!p) return null;
    p.activeOrders.push(o.id);
    o.assignment = { partnerId: p.id, assignedAtMin: atMin };
    return p;
  }

  /** The SYSTEM actor. Time comes in; nothing here reads a clock. */
  tick(nowMin: number): void {
    for (const o of this.orders.values())
      if (o.state === State.PLACED &&
          nowMin - o.placedAtMin >= FoodDeliveryService.AUTO_REJECT_AFTER_MIN)
        o.transition(Evt.REJECT, Actor.SYSTEM, nowMin);
  }
}

/* ===================================================================== demo */
function fire(o: Order, e: Evt, who: Actor, atMin: number): void {
  try {
    console.log("  ok   " + who + " fires " + e + "  ->  " + o.transition(e, who, atMin));
  } catch (ex) {
    console.log("  X    " + who + " fires " + e + "  ->  REFUSED: " + (ex as Error).message);
  }
}

function main(): void {
  const tandoor = new Restaurant("R1", "Tandoor House", 11 * 60, 23 * 60)
    .add({ id: "paneer", name: "Paneer Butter Masala", pricePaise: 24000, available: true })
    .add({ id: "naan", name: "Butter Naan", pricePaise: 6000, available: true })
    .add({ id: "jamun", name: "Gulab Jamun", pricePaise: 9000, available: true });

  const dir = new PartnerDirectory();
  dir.all.push(new DeliveryPartner("P1", "Asha", 4), new DeliveryPartner("P2", "Vikram", 7));

  const app = new FoodDeliveryService(new StandardCancellationPolicy(), dir, new NearestFreeStrategy());
  const push = new ChannelNotifier("push");
  app.register(push);

  const cart = new Cart("R1").add("paneer", 1).add("naan", 2);

  console.log("== 1. place the order at 20:00 (minute 1200) ==================");
  const o = app.placeOrder("C1", cart, tandoor, 5000, "req-abc", 1200);
  console.log("  " + o.id + "  " + o.bill.pretty());

  console.log("== 2. the same tap arrives twice =============================");
  console.log("  same object? " + (app.placeOrder("C1", cart, tandoor, 5000, "req-abc", 1200) === o));

  console.log("== 3. the menu price moves AFTER the order exists ============");
  tandoor.menu.get("paneer")!.pricePaise = 27000;
  console.log("  order total still " + fmt(o.bill.total) + "  (frozen)");

  console.log("== 4. illegal moves are refused, with a reason ===============");
  fire(o, Evt.PICK_UP, Actor.PARTNER, 1201);       // missing transition
  fire(o, Evt.ACCEPT, Actor.CUSTOMER, 1201);       // wrong actor

  console.log("== 5. the happy path ========================================");
  fire(o, Evt.ACCEPT, Actor.RESTAURANT, 1202);
  const p = app.assign(o, 1203)!;
  console.log("  assigned " + p.name + " via " + app.strategyName + " (eta " + p.etaMinutes + "m)");
  fire(o, Evt.START_PREP, Actor.RESTAURANT, 1203);

  console.log("== 6. what would cancelling cost right now? ==================");
  const q = o.cancellationQuote();
  console.log("  " + q.reason + "  ->  back " + fmt(q.refundPaise) + ", kitchen keeps " +
              fmt(q.keptPaise) + "   (sums to " + fmt(q.refundPaise + q.keptPaise) + ")");

  fire(o, Evt.MARK_READY, Actor.RESTAURANT, 1218);
  fire(o, Evt.PICK_UP, Actor.PARTNER, 1220);

  console.log("== 7. cancelling once it is on a bike ========================");
  fire(o, Evt.CANCEL, Actor.CUSTOMER, 1221);
  fire(o, Evt.DELIVER, Actor.PARTNER, 1238);
  console.log("  final " + o.state + ", notifications " + push.sent + ", history " + o.log.length);

  console.log("== 8. a SECOND order - same cart, new prices ================");
  const o2 = app.placeOrder("C2", cart, tandoor, 5000, "req-def", 1240);
  console.log("  " + o2.id + "  " + o2.bill.pretty());
  fire(o2, Evt.ACCEPT, Actor.RESTAURANT, 1241);
  fire(o2, Evt.START_PREP, Actor.RESTAURANT, 1242);
  fire(o2, Evt.CANCEL, Actor.CUSTOMER, 1245);
  console.log("  refund due " + fmt(o2.refundPaise) + " of " + fmt(o2.bill.total));

  console.log("== 9. the kitchen never answers ==============================");
  const o3 = app.placeOrder("C3", cart, tandoor, 0, "req-ghi", 1300);
  app.tick(1301);
  console.log("  after 1 minute:  " + o3.state);
  app.tick(1303);
  console.log("  after 3 minutes: " + o3.state + "  (SYSTEM fired REJECT)");

  console.log("== 10. swap the assignment strategy ==========================");
  app.setAssignmentStrategy(new BatchedPickupStrategy());
  const a = app.placeOrder("C4", cart, tandoor, 0, "req-j", 1310);
  const b = app.placeOrder("C5", cart, tandoor, 0, "req-k", 1311);
  fire(a, Evt.ACCEPT, Actor.RESTAURANT, 1312);
  fire(b, Evt.ACCEPT, Actor.RESTAURANT, 1312);
  console.log("  " + a.id + " -> " + app.assign(a, 1312)!.name);
  console.log("  " + b.id + " -> " + app.assign(b, 1312)!.name + "   (same rider, one trip)");
  console.log("  order-flow code changed: 0 lines");
}

main();

/* --- expected output (notification lines trimmed) ---------------------------
  ORD-1  Rs.360.00 + pack Rs.20.00 + delivery Rs.35.00 + tax Rs.19.00 - off Rs.50.00  =  Rs.384.00
  same object? true
  order total still Rs.384.00  (frozen)
  X    PARTNER fires PICK_UP  ->  REFUSED: PICK_UP is not a legal event from PLACED   (missing transition)
  X    CUSTOMER fires ACCEPT  ->  REFUSED: ACCEPT from PLACED is RESTAURANT's move, not CUSTOMER's   (wrong actor)
  refund 50% of Rs.384.00  ->  back Rs.192.00, kitchen keeps Rs.192.00   (sums to Rs.384.00)
  X    CUSTOMER fires CANCEL  ->  REFUSED: CANCEL is not a legal event from PICKED_UP   (missing transition)
  ORD-2  Rs.390.00 + pack Rs.20.00 + delivery Rs.35.00 + tax Rs.20.50 - off Rs.50.00  =  Rs.415.50
  after 3 minutes: REJECTED  (SYSTEM fired REJECT)
  ORD-5 -> Asha   (same rider, one trip)
--------------------------------------------------------------------------- */`,
      },
    ],

    // ==================================================================
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Take the food away and what is left is **a long-lived entity with an explicit lifecycle that several different parties push forward**. That shape is everywhere, and it always fails the same way — someone models it with flags, and six months later two flags are true that should never be true together.",
      },
      {
        type: "ul",
        items: [
          "**A loan application** — submitted, under review, approved, disbursed, rejected. The applicant, the underwriter and an automated risk engine each own different transitions, and “approved and rejected” must be unrepresentable.",
          "**An insurance claim** — filed, assessed, approved, paid, contested. Money attaches to the transitions exactly the way refunds do here, and every edge needs an actor.",
          "**A support ticket** — open, triaged, in progress, waiting on customer, resolved. The *customer* may reopen; the *agent* may resolve. Same two-question split: is it legal, and who may do it.",
          "**A shipment** — booked, collected, in transit, at hub, out for delivery, delivered, returned. Literally the same diagram with more nodes, and the same “no cancel once it is moving” rule.",
          "**A content publishing workflow** — draft, in review, scheduled, published, retracted. Authors, editors and a scheduler are three actors, and “published and still in draft” is the bug you are preventing.",
          "**A CI/CD pipeline run** — queued, running, succeeded, failed, cancelled. A human may cancel a queued run; nobody may cancel a finished one. Familiar?",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The 20-second version to say out loud",
        text: "*“The order owns one `OrderState` enum and one transition table of `(from, event, actor) → to`. `transition()` is the only thing that writes the state field, and it refuses illegal moves with a message that distinguishes a missing transition from a wrong actor. Cancellation legality comes from the table; the refund comes from a `CancellationPolicy`, in integer paise. The cart stores `(itemId, qty)` only — the bill is built from the current menu at checkout and then frozen onto the order. Assignment and notifications sit behind interfaces, so adding a channel or a batching rule is a new file and zero edits.”*",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When the actors live in separate services.** An in-process `synchronized transition()` becomes a distributed decision. You end up with the state machine owned by one service and everyone else sending *commands* to it — or, if you split it, a saga with compensating actions, and the “make illegal states unrepresentable” guarantee weakens to “detect and compensate”.",
          "**When parts of the lifecycle run in parallel.** Payment authorisation, fraud checks and kitchen acceptance can all be in flight at once. A single linear enum starts to lie, and you need either orthogonal regions (a statechart) or a separate small machine per concern — which is exactly what `Assignment` already is here.",
          "**When the table gets big.** Thirty states and a hundred edges stop fitting in anyone's head; that is when you move to a hierarchical statechart with nested states and shared transitions, or generate the machine from a declarative spec.",
          "**When the truth lives outside your process.** A payment gateway, not you, decides whether a refund succeeded. The order can record intent and reconcile on a callback, but it cannot *own* that state — and the callback will be delivered more than once.",
          "**When it has to survive a crash.** In memory this is trivially consistent. With a database, the state change, the transition log row and the observer side effects must commit together, or you get an order that is `DELIVERED` with no notification sent and no history row explaining it. That is where the transactional outbox pattern shows up.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Write the transition table before you write any class.** Eleven rows of `(from, event, actor) → to` on the whiteboard takes four minutes, answers cancellation, refunds, timeouts, partner churn and notifications before they are asked, and turns the rest of the round into typing.",
      },
    ],

    // ==================================================================
    tradeoffs: {
      pros: [
        "One enum plus one transition table makes illegal states unrepresentable rather than merely unlikely — the isDelivered-and-cancelled class of bug cannot be constructed at all.",
        "Naming the actor on every edge captures half the domain for free, and it turns a vague “that call failed” into either “missing transition” or “wrong actor”, which is immediately actionable for the caller.",
        "Splitting legality (the table) from cost (the CancellationPolicy) means a product manager can change refund percentages without anyone touching the lifecycle, and the money can be unit-tested without constructing an order.",
        "Recomputing the bill at checkout and then freezing it gives both correctness while browsing and reproducibility afterwards — receipts, refunds and restaurant payouts all reconcile forever.",
        "Assignment, notification and refund rules all sit behind interfaces, so a new channel, a new fee or a batching experiment is a new file and zero edits to the order flow.",
      ],
      cons: [
        "A central transition table is a single place every new rule must pass through, which is the point — but it also means feature teams contend on one file, and a careless row can silently open an edge nobody reviewed.",
        "Modelling every actor and event explicitly is more ceremony than a small system needs; for a two-state “done / not done” workflow this is over-engineering and a boolean is genuinely correct.",
        "Synchronous in-process observers put notification latency and failures inside the transition, so a slow SMS vendor can slow down “mark ready” and a throwing observer can poison a legitimate state change.",
        "A single linear enum cannot express concurrent sub-flows; the moment payment, fraud and kitchen acceptance overlap you need a second machine or a statechart, and retrofitting that is real work.",
        "The frozen bill is correct and inflexible: a genuine pricing mistake now needs an explicit adjustment or reversal record rather than an edit, which is more machinery than simply changing a number.",
      ],
    },

    // ==================================================================
    furtherReading: [
      {
        label: "awesome-low-level-design — machine coding problems",
        href: "https://github.com/ashishps1/awesome-low-level-design",
        kind: "article",
        note: "The canonical list of LLD interview problems with entity breakdowns. Read the food-delivery and ride-sharing write-ups back to back to feel how different their cores are.",
      },
      {
        label: "Refactoring Guru — State pattern",
        href: "https://refactoring.guru/design-patterns/state",
        kind: "docs",
        note: "The class-per-state variant of what this lesson does with a table. Worth knowing both: a table is compact and easy to print, classes-per-state are better when each state carries a lot of behaviour.",
      },
      {
        label: "Designing with types — making illegal states unrepresentable",
        href: "https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/",
        kind: "article",
        note: "Scott Wlaschin's essay, and the clearest statement of the idea behind the booleans-versus-enum figure. Written in F#, but the argument is language-agnostic.",
      },
      {
        label: "Stripe API — idempotent requests",
        href: "https://docs.stripe.com/api/idempotent_requests",
        kind: "docs",
        note: "How a real payments API handles the retried “place order” tap: a client-generated key, stored results, and a defined window. This is the answer to the idempotency follow-up, in production form.",
      },
      {
        label: "Martin Fowler — Money (Patterns of Enterprise Application Architecture)",
        href: "https://martinfowler.com/eaaCatalog/money.html",
        kind: "article",
        note: "Why money is a value type over an integer number of minor units. Two pages, and it is the reason every amount in this lesson is a long of paise.",
      },
      {
        label: "W3C — State Chart XML (SCXML)",
        href: "https://www.w3.org/TR/scxml/",
        kind: "spec",
        note: "What state machines look like when they grow up: hierarchical states, parallel regions, guards and history. Skim the introduction to see where a flat eleven-row table stops being enough.",
      },
      {
        label: "Domain-Driven Design — Eric Evans",
        kind: "book",
        note: "The chapters on Aggregates and Value Objects. Order is the textbook aggregate root that owns its own invariants, and Bill is the textbook value object.",
      },
      {
        label: "Christopher Okhravi — design patterns on video",
        href: "https://www.youtube.com/@ChristopherOkhravi",
        kind: "video",
        note: "His State and Strategy episodes are the clearest walkthroughs of the two patterns this problem leans on, and they are worth watching before you draw the class diagram from memory.",
      },
    ],

    // ==================================================================
    quiz: [
      {
        id: "food-delivery-q1",
        question:
          "You track an order with three booleans: isAccepted, isPickedUp, isCancelled. What is the concrete failure?",
        options: [
          { id: "a", label: "Three booleans give eight combinations and only five mean anything — states like “picked up but never accepted” and “delivered and cancelled” become reachable, and nothing in the code forbids them." },
          { id: "b", label: "Booleans are slower to read than an enum, so the order-status endpoint gets slower as traffic grows." },
          { id: "c", label: "Nothing — booleans are fine as long as you set them in the right order in every service." },
          { id: "d", label: "You cannot serialise booleans to JSON without a custom converter." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) is exactly the belief that ships the bug: “in the right order” is a rule that lives in a human's head, and three services will eventually disagree. Booleans also *hide* states you need — isAccepted=true, isPickedUp=false is both “cooking” and “ready on the counter”, which are different things to the customer's ETA. An enum makes the legal set explicit and the illegal set impossible to construct.",
      },
      {
        id: "food-delivery-q2",
        question:
          "Why does `transition()` take an `Actor` and not just an `OrderEvent`?",
        options: [
          { id: "a", label: "Because “who may fire this” is half the domain — PICK_UP from READY is the partner's move and nobody else's, and without the actor the customer's app can mark its own order picked up." },
          { id: "b", label: "Because the actor is needed to look up the correct database shard for the order." },
          { id: "c", label: "Only for the audit log — the actor plays no part in deciding whether the move is legal." },
          { id: "d", label: "Because Java requires two parameters for a switch over an enum." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) is the near-miss that costs marks: logging the actor after the fact is bookkeeping, checking it beforehand is authorisation, and only the second one prevents anything. Notice that the same event can legitimately have two owners — REJECT belongs to both the restaurant and the SYSTEM (the 90-second timeout), which is why the table stores the actor per row rather than per event.",
      },
      {
        id: "food-delivery-q3",
        question:
          "The order is in PREPARING. A partner app sends PICK_UP, and a customer app sends DELIVER. Both are refused — what should the two messages say?",
        options: [
          { id: "a", label: "PICK_UP is a missing transition (there is no PICK_UP edge from PREPARING at all); DELIVER is a wrong actor only once the state actually has a DELIVER edge — from PREPARING it is also simply missing." },
          { id: "b", label: "Both are “invalid request” — distinguishing them leaks internal state to clients." },
          { id: "c", label: "Both are wrong-actor errors, because neither app owns the PREPARING state." },
          { id: "d", label: "PICK_UP should be silently queued until the order reaches READY." },
        ],
        correctOptionId: "a",
        explanation:
          "The distinction is per (state, event) pair, not per app. From PREPARING neither edge exists, so both are missing transitions; from PICKED_UP, DELIVER *does* exist but belongs to the PARTNER, so a customer firing it there is a wrong-actor error. (d) is the dangerous one — silently queueing an event means the order advances later for reasons nobody can trace, which is how a state machine quietly becomes a pile of flags again.",
      },
      {
        id: "food-delivery-q4",
        question:
          "Where do “can this order be cancelled?” and “how much do we refund?” belong?",
        options: [
          { id: "a", label: "Legality is a row in the transition table; the amount is a CancellationPolicy — two objects, because the first is a domain rule and the second is a business rule that changes weekly." },
          { id: "b", label: "Both in Order.cancel(), as a switch over the state — it is only four cases." },
          { id: "c", label: "Both in the CancellationPolicy, which should also mutate the order's state." },
          { id: "d", label: "Both in the API controller, so the mobile apps can show the refund before the user confirms." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) works on the day and rots immediately: refund percentages differ by city, by restaurant tier and by promotion, so that switch grows conditions that have nothing to do with the lifecycle. Splitting them also means you can unit-test the money without constructing an order, and swap the policy in one line. (d) is worse — now two mobile apps and a server all have their own copy of the rule.",
      },
      {
        id: "food-delivery-q5",
        question:
          "An item sits in a cart for an hour while the restaurant raises its price. What does a correct design do at checkout?",
        options: [
          { id: "a", label: "The cart stored only (menuItemId, qty), so the bill is built from the current menu — the customer sees and pays the new price." },
          { id: "b", label: "The cart stored the price when the item was added, so the customer pays the old price — that is the fair thing to do." },
          { id: "c", label: "The cart stores both prices and charges whichever is lower." },
          { id: "d", label: "The cart is silently emptied whenever any menu price changes." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) sounds customer-friendly and is a real revenue leak on every stale cart in the city — and the *same* bug overcharges customers when a price drops. The rule to say out loud: a cart is a wish, an order is a contract. Prices live in exactly one place, the menu, and are copied exactly once, at checkout.",
      },
      {
        id: "food-delivery-q6",
        question:
          "After the order is PLACED, the restaurant edits the dish price again. What happens to the order total?",
        options: [
          { id: "a", label: "Nothing — the Bill and the item snapshot were frozen onto the order at PLACED, so the total is immutable for the rest of its life." },
          { id: "b", label: "It recomputes, so the customer is always charged the latest price." },
          { id: "c", label: "It recomputes only if the order has not yet been ACCEPTED." },
          { id: "d", label: "It recomputes, and the difference is added to the refund balance." },
        ],
        correctOptionId: "a",
        explanation:
          "The order total is already part of a payment, a receipt, a refund calculation and a restaurant payout. If a menu edit could reach backwards, none of those reconcile — and no test catches it, because the number stays plausible. If a price really was entered wrongly, the fix is an explicit adjustment or reversal record, never an edit.",
      },
      {
        id: "food-delivery-q7",
        question:
          "A customer on a flaky connection taps “Place order”, the request times out, and the app retries. What prevents two orders and two charges?",
        options: [
          { id: "a", label: "The client sends a requestId it generated; placeOrder keeps a map from requestId to Order and returns the same order object on a repeat." },
          { id: "b", label: "A uniqueness constraint on (customerId, restaurantId) so a customer can only have one open order per restaurant." },
          { id: "c", label: "Deduplicating orders in a nightly batch job and refunding the extras." },
          { id: "d", label: "A five-second cooldown on the button in the mobile app." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is where most first answers go, and it is a UI nicety, not a guarantee — the retry may come from the network layer, not the button. (b) is wrong on its own terms: a customer is genuinely allowed to order twice from the same place. An idempotency key generated by the caller is the standard answer, and it is what real payment APIs do.",
      },
      {
        id: "food-delivery-q8",
        question:
          "A delivery partner cancels after picking the food up. What changes in your model?",
        options: [
          { id: "a", label: "The Assignment is replaced with a new partner; the order stays in PICKED_UP, because partner churn is a delivery-leg concern and must not be able to corrupt the order's lifecycle." },
          { id: "b", label: "The order transitions back to READY so a new partner can pick it up." },
          { id: "c", label: "The order is CANCELLED with a full refund, since nobody is carrying it." },
          { id: "d", label: "A new boolean, isReassigned, is set on the order." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is tempting and it is a backwards edge that quietly breaks your invariants — the food is not on the counter any more, so READY would be a lie, and any “once picked up, no cancel” rule is now bypassable by looping. Keeping a small `Assignment` object with its own lifecycle is the same move as keeping payment separate: one concern, one place, and the order enum stays honest. (d) is the booleans trap returning through the back door.",
      },
    ],
  },
};
