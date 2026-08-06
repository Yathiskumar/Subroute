import type { RoadmapLesson } from "@/lib/content/types";

export const parkingLot: RoadmapLesson = {
  title: "Parking Lot",
  oneLiner:
    "The single most-asked machine-coding problem. You get one line — *“design a parking lot”* — and 60 minutes to hand back **code that runs**. This lesson builds the whole system with you: the questions you ask, the classes you write, the two flows (`park` and `unpark`), the race condition nobody sees coming, and the four follow-ups the interviewer always asks next.",
  difficulty: "beginner",
  estimatedTime: "28 min",
  prototypePath: "/prototypes/lld/parking-lot.html",
  content: {
    prototypeCaption:
      "A **working parking lot**, not a slideshow. Pick a vehicle and press **▶ Park** — the lot answers in four beats: the vehicle arrives, every spot that *fits* lights up blue, the *smallest* fitting size narrows it down to orange, and the strategy picks one. A ticket drops into the tray with the entry time on it. The mono line at the top always shows the **real method call** behind what you just did. Then change the rules: **🎯 Nearest** vs **📊 Spread** re-routes cars without touching `park()`, **⏱ Flat** vs **🪜 Slabs** re-prices without touching `unpark()`. Push **⏩ +1 hour** and watch every open bill grow. Push **⚡ Fill the lot**, then Park — and watch the barrier stay down.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "The interviewer says one sentence — *“Design a parking lot.”* — and starts a timer. That is the whole prompt. It is deliberately tiny, because the question is not really *“can you park a car?”*. It is **“when I hand you a vague problem, what do you do in the first ten minutes?”**",
      },
      {
        type: "p",
        text: "The good news: a parking lot is a system you already understand. You have driven into one. You took a ticket, you parked, you paid on the way out. Everything you need to model is a thing you can point at in the real world — and that is exactly why this problem is the warm-up everybody starts with.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 320" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A parking lot drawn from the side: an entry gate with a car and a barrier on the left, a building with two floors of parking spots labelled S, M and L in the middle, an exit gate on the right, and a ticket card. Labels mark which real-world thing becomes which class: ParkingLot, ParkingFloor, ParkingSpot, Vehicle and Ticket.">
  <defs>
    <marker id="pl-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <!-- building -->
  <rect x="170" y="40" width="420" height="212" rx="8" fill="none" stroke="#3a414c" stroke-width="1.4"/>
  <text x="180" y="32" font-size="11" fill="#fb863a">ParkingLot</text>

  <!-- floor 2 -->
  <rect x="180" y="52" width="400" height="92" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="190" y="72" font-size="9" fill="#9099a8">Floor 2</text>
  <rect x="228" y="66" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="248" y="92" font-size="10" fill="#6b7280">S</text>
  <rect x="286" y="66" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="306" y="92" font-size="10" fill="#6b7280">S</text>
  <rect x="344" y="66" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="364" y="92" font-size="10" fill="#6b7280">M</text>
  <rect x="402" y="66" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="422" y="92" font-size="10" fill="#6b7280">M</text>
  <rect x="460" y="66" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="480" y="92" font-size="10" fill="#6b7280">L</text>
  <rect x="518" y="66" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="538" y="92" font-size="10" fill="#6b7280">L</text>

  <!-- floor 1 -->
  <rect x="180" y="152" width="400" height="92" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="190" y="172" font-size="9" fill="#9099a8">Floor 1</text>
  <rect x="228" y="166" width="50" height="42" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="248" y="192" font-size="10" fill="#fb863a">S</text>
  <rect x="286" y="166" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="306" y="192" font-size="10" fill="#6b7280">S</text>
  <rect x="344" y="166" width="50" height="42" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="364" y="192" font-size="10" fill="#fb863a">M</text>
  <rect x="402" y="166" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="422" y="192" font-size="10" fill="#6b7280">M</text>
  <rect x="460" y="166" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="480" y="192" font-size="10" fill="#6b7280">L</text>
  <rect x="518" y="166" width="50" height="42" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="538" y="192" font-size="10" fill="#6b7280">L</text>

  <!-- labels into the building -->
  <text x="34" y="70" font-size="11" fill="#fb863a">ParkingFloor</text>
  <line x1="112" y1="66" x2="176" y2="82" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#pl-lead)"/>
  <text x="332" y="292" font-size="11" fill="#fb863a">ParkingSpot</text>
  <line x1="378" y1="282" x2="368" y2="212" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#pl-lead)"/>

  <!-- entry gate -->
  <rect x="118" y="150" width="10" height="66" rx="2" fill="#14161a" stroke="#3a414c"/>
  <line x1="128" y1="158" x2="166" y2="158" stroke="#f06868" stroke-width="3" stroke-dasharray="7 6"/>
  <text x="104" y="234" font-size="9" fill="#9099a8">ENTRY</text>

  <!-- car -->
  <rect x="24" y="164" width="62" height="24" rx="7" fill="#14161a" stroke="#fb863a" stroke-width="1.4"/>
  <rect x="38" y="156" width="30" height="12" rx="4" fill="#14161a" stroke="#fb863a" stroke-width="1.2"/>
  <circle cx="40" cy="190" r="6" fill="#14161a" stroke="#d8d3c9"/>
  <circle cx="70" cy="190" r="6" fill="#14161a" stroke="#d8d3c9"/>
  <text x="24" y="146" font-size="11" fill="#fb863a">Vehicle</text>

  <!-- exit gate -->
  <rect x="596" y="150" width="10" height="66" rx="2" fill="#14161a" stroke="#3a414c"/>
  <line x1="606" y1="158" x2="646" y2="158" stroke="#f06868" stroke-width="3" stroke-dasharray="7 6"/>
  <text x="590" y="234" font-size="9" fill="#9099a8">EXIT</text>

  <!-- ticket -->
  <rect x="606" y="52" width="102" height="70" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.2"/>
  <text x="616" y="72" font-size="10" fill="#e8e4dc">T-7</text>
  <line x1="616" y1="80" x2="698" y2="80" stroke="#2d333d"/>
  <text x="616" y="96" font-size="9" fill="#9099a8">spot F1-03</text>
  <text x="616" y="112" font-size="9" fill="#9099a8">in  09:00</text>
  <text x="612" y="42" font-size="11" fill="#fb863a">Ticket</text>
</svg>`,
        caption:
          "Every **orange word** is a class you are about to write. That is not a coincidence — the fastest way into this problem is to name the things you can already see.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **ParkingLot** owns floors, and floors own spots. **`park(vehicle)`** finds a free spot the vehicle fits into, marks it taken, and hands back a **Ticket** stamped with the entry time. **`unpark(ticket)`** reads that timestamp, charges for the time, and frees the spot. Everything else in this lesson is detail hanging off those three sentences.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "p",
        text: "Interviewers do not score you on how many classes you produced. Almost every scorecard for this round looks like the same five lines:",
      },
      {
        type: "ol",
        items: [
          "**Does it run?** A `main()` that parks three vehicles and prints two bills beats a beautiful half-finished class hierarchy. Every time.",
          "**Are the names the real-world names?** `ParkingSpot`, `Ticket`, `Vehicle`. Not `SpotDataManager`, not `TicketVO`.",
          "**Can I change a rule without editing your code?** This is the big one. They *will* say “now charge differently on weekends”, and they are watching whether you open an existing method or add a new class.",
          "**Did you handle the ugly cases?** Lot full. Truck when only bike spots are free. Ticket presented twice. Two cars arriving at once.",
          "**Did you talk while you worked?** Silence reads as “stuck”, even when you are not.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "This lesson is the worked example of the framework",
        text: "The five steps come from [[five-step-framework]] — *clarify → entities → API → class diagram → code*. Here we actually walk them, end to end, on a real problem. If a step feels rushed, that lesson explains the *why*; this one shows the *what*.",
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ============ STEP 1 ============
      { type: "h", text: "Step 1 · Clarify — 5 minutes, and it is the cheapest time you will spend" },
      {
        type: "p",
        text: "You cannot build “a parking lot”. You can build *this* parking lot. So shrink the problem until it has edges. Four or five short questions is enough — and you say the answers out loud so they become an agreement, not a guess.",
      },
      {
        type: "ul",
        items: [
          "**How big is it?** — *“Two floors, about 16 spots?”* If they say “assume small”, a plain in-memory list is fine and you just saved yourself an hour of indexing.",
          "**What can drive in?** — *“Bikes, cars, trucks?”* Three types means three sizes, which means a spot has a size too.",
          "**How is it charged?** — *“Per hour, paid at exit?”* Now you know the ticket needs an entry timestamp. That one answer designs a whole class.",
          "**What happens when it is full?** — *“Turn the vehicle away.”* An answer here stops you from crashing on the demo.",
          "**What is *not* in scope?** — payments, login, a UI, a database. The most valuable question in the round is the one that **removes** work.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 268" width="100%" style="max-width:660px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two panels. The left panel, In scope, lists: two floors sixteen spots; bike car truck; park and unpark; fee per started hour paid at exit; in-memory single lot. The right panel, Out of scope, lists: payment gateway; login and users; web API or UI; database; reservations and monthly passes.">
  <rect x="10" y="14" width="330" height="240" rx="9" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="28" y="40" font-size="11" fill="#5cc66f">IN SCOPE — I will build this</text>
  <line x1="28" y1="52" x2="322" y2="52" stroke="#2d333d"/>
  <text x="28" y="78" font-size="11" fill="#5cc66f">✓</text><text x="48" y="78" font-size="11" fill="#e8e4dc">2 floors · 16 spots</text>
  <text x="28" y="110" font-size="11" fill="#5cc66f">✓</text><text x="48" y="110" font-size="11" fill="#e8e4dc">Bike · Car · Truck</text>
  <text x="28" y="142" font-size="11" fill="#5cc66f">✓</text><text x="48" y="142" font-size="11" fill="#e8e4dc">park() and unpark()</text>
  <text x="28" y="174" font-size="11" fill="#5cc66f">✓</text><text x="48" y="174" font-size="11" fill="#e8e4dc">fee per started hour</text>
  <text x="28" y="206" font-size="11" fill="#5cc66f">✓</text><text x="48" y="206" font-size="11" fill="#e8e4dc">in-memory, one lot</text>
  <text x="28" y="238" font-size="11" fill="#5cc66f">✓</text><text x="48" y="238" font-size="11" fill="#e8e4dc">a main() demo</text>

  <rect x="360" y="14" width="330" height="240" rx="9" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="378" y="40" font-size="11" fill="#f06868">OUT — agreed, not built</text>
  <line x1="378" y1="52" x2="672" y2="52" stroke="#2d333d"/>
  <text x="378" y="78" font-size="11" fill="#f06868">✗</text><text x="398" y="78" font-size="11" fill="#9099a8">payment gateway</text>
  <text x="378" y="110" font-size="11" fill="#f06868">✗</text><text x="398" y="110" font-size="11" fill="#9099a8">login / accounts</text>
  <text x="378" y="142" font-size="11" fill="#f06868">✗</text><text x="398" y="142" font-size="11" fill="#9099a8">web API or UI</text>
  <text x="378" y="174" font-size="11" fill="#f06868">✗</text><text x="398" y="174" font-size="11" fill="#9099a8">database / persistence</text>
  <text x="378" y="206" font-size="11" fill="#f06868">✗</text><text x="398" y="206" font-size="11" fill="#9099a8">reservations</text>
  <text x="378" y="238" font-size="11" fill="#f06868">✗</text><text x="398" y="238" font-size="11" fill="#9099a8">monthly passes</text>
</svg>`,
        caption:
          "Write this board down where the interviewer can see it. The right-hand column is what you point at, calmly, when you decide *not* to build something at minute 45.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The two questions that eat your clock",
        text: "*“Which database?”* and *“Should there be a UI?”* In a 60-minute round the answers are always **in-memory** and **a `main()` method**. State those as assumptions in one sentence and move. Every minute in a rabbit hole is a minute not spent on code that runs.",
      },

      // ============ STEP 2 ============
      { type: "h", text: "Step 2 · Nouns become classes, verbs become methods" },
      {
        type: "p",
        text: "Read your clarified problem back and underline the **nouns**. A noun that has its own data and its own behaviour is a class. Then underline the **verbs** — those are the methods, and they nearly always belong to the noun that owns the data they touch.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 322" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A mapping table. Nouns in the problem — parking lot, floor, spot, vehicle, ticket, the fee rule — map by arrows to classes you write: ParkingLot, ParkingFloor, ParkingSpot, Vehicle with Bike Car Truck, Ticket, and PricingStrategy. Below, a strip shows verbs park, unpark, calculate fee and is available becoming methods.">
  <defs>
    <marker id="pl-n2c" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#9099a8"/></marker>
  </defs>
  <text x="30" y="26" font-size="10" fill="#9099a8">NOUN IN THE PROBLEM</text>
  <text x="404" y="26" font-size="10" fill="#fb863a">CLASS YOU WRITE</text>

  <rect x="24" y="38" width="230" height="30" rx="6" fill="#14161a" stroke="#2d333d"/><text x="40" y="58" font-size="11" fill="#e8e4dc">“a parking lot”</text>
  <rect x="24" y="78" width="230" height="30" rx="6" fill="#14161a" stroke="#2d333d"/><text x="40" y="98" font-size="11" fill="#e8e4dc">“floors”</text>
  <rect x="24" y="118" width="230" height="30" rx="6" fill="#14161a" stroke="#2d333d"/><text x="40" y="138" font-size="11" fill="#e8e4dc">“spots”</text>
  <rect x="24" y="158" width="230" height="30" rx="6" fill="#14161a" stroke="#2d333d"/><text x="40" y="178" font-size="11" fill="#e8e4dc">“a vehicle”</text>
  <rect x="24" y="198" width="230" height="30" rx="6" fill="#14161a" stroke="#2d333d"/><text x="40" y="218" font-size="11" fill="#e8e4dc">“a ticket”</text>
  <rect x="24" y="238" width="230" height="30" rx="6" fill="#14161a" stroke="#2d333d"/><text x="40" y="258" font-size="11" fill="#e8e4dc">“charged per hour”</text>

  <line x1="262" y1="53" x2="392" y2="53" stroke="#9099a8" stroke-width="1" marker-end="url(#pl-n2c)"/>
  <line x1="262" y1="93" x2="392" y2="93" stroke="#9099a8" stroke-width="1" marker-end="url(#pl-n2c)"/>
  <line x1="262" y1="133" x2="392" y2="133" stroke="#9099a8" stroke-width="1" marker-end="url(#pl-n2c)"/>
  <line x1="262" y1="173" x2="392" y2="173" stroke="#9099a8" stroke-width="1" marker-end="url(#pl-n2c)"/>
  <line x1="262" y1="213" x2="392" y2="213" stroke="#9099a8" stroke-width="1" marker-end="url(#pl-n2c)"/>
  <line x1="262" y1="253" x2="392" y2="253" stroke="#9099a8" stroke-width="1" marker-end="url(#pl-n2c)"/>

  <rect x="400" y="38" width="276" height="30" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="416" y="58" font-size="11" fill="#fb863a">ParkingLot</text>
  <rect x="400" y="78" width="276" height="30" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="416" y="98" font-size="11" fill="#fb863a">ParkingFloor</text>
  <rect x="400" y="118" width="276" height="30" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="416" y="138" font-size="11" fill="#fb863a">ParkingSpot</text>
  <rect x="400" y="158" width="276" height="30" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="416" y="178" font-size="11" fill="#fb863a">Vehicle</text><text x="510" y="178" font-size="10" fill="#9099a8">← Bike · Car · Truck</text>
  <rect x="400" y="198" width="276" height="30" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="416" y="218" font-size="11" fill="#fb863a">Ticket</text>
  <rect x="400" y="238" width="276" height="30" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="416" y="258" font-size="11" fill="#fb863a">PricingStrategy</text>

  <line x1="24" y1="286" x2="676" y2="286" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="24" y="310" font-size="10" fill="#9099a8">VERBS → METHODS</text>
  <text x="190" y="310" font-size="11" fill="#e8e4dc">park()</text>
  <text x="262" y="310" font-size="11" fill="#e8e4dc">unpark()</text>
  <text x="352" y="310" font-size="11" fill="#e8e4dc">fee()</text>
  <text x="424" y="310" font-size="11" fill="#e8e4dc">isFree()</text>
  <text x="512" y="310" font-size="11" fill="#e8e4dc">fits()</text>
</svg>`,
        caption:
          "Notice the last row. *“Charged per hour”* is not a noun you can point at — it is a **rule**. Rules that might change become their own object. That single move is what makes this design extensible later.",
      },
      {
        type: "ul",
        items: [
          "**`ParkingLot`** — the front door of the system. It owns the floors and it is the only class the outside world talks to.",
          "**`ParkingFloor`** — a list of spots. In a small lot you can skip this and let the lot hold spots directly; say so out loud, and add it back the moment they mention multiple floors.",
          "**`ParkingSpot`** — has an id, a **size**, and either a vehicle in it or nothing. It knows two things: *am I free?* and *does this vehicle fit?*",
          "**`Vehicle`** — abstract, with `Bike`, `Car`, `Truck` under it. Each one answers *what size spot do I need?*",
          "**`Ticket`** — the contract between the lot and the driver: which vehicle, which spot, **entry time**. Once created, nothing on it changes except its status.",
          "**`SpotAllocationStrategy`** and **`PricingStrategy`** — the two rules that the interviewer is most likely to change on you. Interfaces, not `if` statements.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Use enums for the fixed vocabularies",
        text: "`VehicleType { BIKE, CAR, TRUCK }`, `SpotSize { SMALL, MEDIUM, LARGE }`, `TicketStatus { ACTIVE, PAID, LOST }`. Three enums, thirty seconds, and every stringly-typed bug in this problem disappears. More on why in [[enums-and-constants]].",
      },

      // ============ STEP 3 ============
      { type: "h", text: "Step 3 · Write the API before you write the code" },
      {
        type: "p",
        text: "Before a single field, write the method signatures a caller would use. Names, parameters, return types — nothing else. If you can describe the whole system in four lines here, your model is right. If you cannot, you are still confused and it is far cheaper to find that out now.",
      },
      {
        type: "code",
        language: "text",
        filename: "the public API",
        code: `lot.park(vehicle)              -> Ticket        // throws when the lot is full
lot.unpark(ticketId, exitAt)   -> Money         // the bill; frees the spot
lot.availableSpots(size)       -> int           // for the display board
lot.setPricing(strategy)       -> void          // swap the rule, not the code`,
      },
      {
        type: "p",
        text: "Three things worth defending out loud, because interviewers ask about all three:",
      },
      {
        type: "ul",
        items: [
          "**`park` returns a `Ticket`, not a `boolean`.** The caller needs something to bring back later. A boolean tells the driver nothing.",
          "**`unpark` takes a ticket *id*, not the ticket object.** A real gate scans a barcode. Taking an id also means the lot decides whether that ticket is still open — the caller cannot lie to it.",
          "**Time is a parameter, not `now()` read inside.** `unpark(id, exitAt)` is testable in one line. `unpark(id)` that calls the clock internally is not — you would have to sleep for an hour to test a two-hour bill. This is the single easiest senior-signal to give in this round.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Money is not a `double`",
        text: "`0.1 + 0.2` is not `0.3` in floating point, and a parking bill that is off by a paisa is a bug you will not enjoy explaining. Use a whole-number minor unit (paise/cents) as `long`, or `BigDecimal`. Saying this out loud costs five seconds and lands well. See [[immutability-and-value-objects]] for why `Money` deserves to be its own tiny type.",
      },

      // ============ STEP 4 ============
      { type: "h", text: "Step 4 · The class diagram — draw it, do not describe it" },
      {
        type: "p",
        text: "Two small diagrams beat one crowded one. The first is the **core model**: what holds what. Read the diamonds as “owns” — a lot owns its floors, a floor owns its spots, and if the lot is demolished they go with it.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 420" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. ParkingLot composes one or more ParkingFloor, which composes one or more ParkingSpot. ParkingSpot references zero or one Vehicle. Vehicle is abstract with Bike, Car and Truck inheriting from it. ParkingLot issues Ticket, and Ticket references the ParkingSpot it was issued for.">
  <defs>
    <marker id="pl-arrow" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="pl-tri" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="12" refX="12" refY="6" orient="auto"><path d="M1,1 L12,6 L1,11 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <!-- ParkingLot -->
  <rect x="262" y="14" width="196" height="76" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="272" y="34" font-size="11.5" fill="#fb863a">ParkingLot</text>
  <line x1="262" y1="42" x2="458" y2="42" stroke="#2d333d"/>
  <text x="272" y="60" font-size="10" fill="#e8e4dc">+ park(v) : Ticket</text>
  <text x="272" y="78" font-size="10" fill="#e8e4dc">+ unpark(id, t) : Money</text>

  <!-- composition to floor -->
  <path d="M360,90 L360,104 L352,112 L360,120 L368,112 L360,104" fill="#e8e4dc" stroke="#e8e4dc" stroke-width="1"/>
  <line x1="360" y1="120" x2="360" y2="150" stroke="#d8d3c9" stroke-width="1.3"/>
  <text x="370" y="140" font-size="9.5" fill="#9099a8">1..*</text>

  <!-- ParkingFloor -->
  <rect x="262" y="150" width="196" height="60" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="272" y="170" font-size="11.5" fill="#e8e4dc">ParkingFloor</text>
  <line x1="262" y1="178" x2="458" y2="178" stroke="#2d333d"/>
  <text x="272" y="196" font-size="10" fill="#9099a8">- spots : List&lt;Spot&gt;</text>

  <!-- composition to spot -->
  <path d="M360,210 L360,224 L352,232 L360,240 L368,232 L360,224" fill="#e8e4dc" stroke="#e8e4dc" stroke-width="1"/>
  <line x1="360" y1="240" x2="360" y2="266" stroke="#d8d3c9" stroke-width="1.3"/>
  <text x="370" y="258" font-size="9.5" fill="#9099a8">1..*</text>

  <!-- ParkingSpot -->
  <rect x="262" y="266" width="196" height="92" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="272" y="286" font-size="11.5" fill="#e8e4dc">ParkingSpot</text>
  <line x1="262" y1="294" x2="458" y2="294" stroke="#2d333d"/>
  <text x="272" y="312" font-size="10" fill="#9099a8">- size : SpotSize</text>
  <text x="272" y="330" font-size="10" fill="#e8e4dc">+ fits(v) : boolean</text>
  <text x="272" y="348" font-size="10" fill="#e8e4dc">+ tryAssign(v) : boolean</text>

  <!-- Vehicle -->
  <rect x="26" y="266" width="186" height="76" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="36" y="286" font-size="11.5" fill="#e8e4dc">Vehicle</text>
  <text x="106" y="286" font-size="9.5" fill="#6b7280">«abstract»</text>
  <line x1="26" y1="294" x2="212" y2="294" stroke="#2d333d"/>
  <text x="36" y="312" font-size="10" fill="#9099a8">- plate : String</text>
  <text x="36" y="330" font-size="10" fill="#e8e4dc">+ requiredSize() : Size</text>

  <line x1="262" y1="304" x2="218" y2="304" stroke="#9099a8" stroke-width="1.2" marker-end="url(#pl-arrow)"/>
  <text x="212" y="296" font-size="9.5" fill="#6b7280">0..1</text>

  <!-- subclasses -->
  <rect x="26" y="382" width="54" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="40" y="400" font-size="10" fill="#e8e4dc">Bike</text>
  <rect x="92" y="382" width="54" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="108" y="400" font-size="10" fill="#e8e4dc">Car</text>
  <rect x="158" y="382" width="54" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="168" y="400" font-size="10" fill="#e8e4dc">Truck</text>
  <line x1="53" y1="382" x2="53" y2="362" stroke="#9099a8" stroke-width="1.2"/>
  <line x1="119" y1="382" x2="119" y2="362" stroke="#9099a8" stroke-width="1.2"/>
  <line x1="185" y1="382" x2="185" y2="362" stroke="#9099a8" stroke-width="1.2"/>
  <line x1="53" y1="362" x2="185" y2="362" stroke="#9099a8" stroke-width="1.2"/>
  <line x1="119" y1="362" x2="119" y2="350" stroke="#9099a8" stroke-width="1.2" marker-end="url(#pl-tri)"/>

  <!-- Ticket -->
  <rect x="506" y="266" width="188" height="92" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="516" y="286" font-size="11.5" fill="#e8e4dc">Ticket</text>
  <line x1="506" y1="294" x2="694" y2="294" stroke="#2d333d"/>
  <text x="516" y="312" font-size="10" fill="#9099a8">- id : String</text>
  <text x="516" y="330" font-size="10" fill="#fb863a">- entryAt : Instant</text>
  <text x="516" y="348" font-size="10" fill="#9099a8">- status : Status</text>

  <line x1="506" y1="304" x2="462" y2="304" stroke="#9099a8" stroke-width="1.2" marker-end="url(#pl-arrow)"/>
  <polyline points="462,52 600,52 600,262" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#pl-arrow)"/>
  <text x="606" y="46" font-size="9.5" fill="#6b7280">issues</text>
</svg>`,
        caption:
          "Filled diamond = **composition** (“owns, and dies with”). Open arrow = a plain reference. Hollow triangle = inheritance. The one field worth pointing at is `entryAt` — the entire billing system is downstream of that timestamp. Notation refresher: [[class-diagrams]].",
      },
      {
        type: "p",
        text: "The second diagram is the part that wins the round. Both rules the interviewer is likely to change — *which spot do we give out?* and *how much do we charge?* — hang off the lot as **interfaces**, with the real rules as small classes underneath.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 330" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="ParkingLot depends on two interfaces. SpotAllocationStrategy with findSpot, implemented by NearestFirst and SpreadOut. PricingStrategy with fee, implemented by HourlyRate and SlabRate. A dotted box shows WeekendRate as a future implementation added without editing anything.">
  <defs>
    <marker id="pl-dep" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="pl-real" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="12" refX="12" refY="6" orient="auto"><path d="M1,1 L12,6 L1,11 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <rect x="252" y="12" width="196" height="52" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="262" y="32" font-size="11.5" fill="#fb863a">ParkingLot</text>
  <line x1="252" y1="40" x2="448" y2="40" stroke="#2d333d"/>
  <text x="262" y="56" font-size="10" fill="#9099a8">holds one of each ↓</text>

  <polyline points="300,64 300,90 150,90 150,116" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#pl-dep)"/>
  <polyline points="400,64 400,90 550,90 550,116" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#pl-dep)"/>
  <text x="176" y="84" font-size="9.5" fill="#6b7280">uses</text>
  <text x="500" y="84" font-size="9.5" fill="#6b7280">uses</text>

  <rect x="16" y="120" width="268" height="58" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="30" y="140" font-size="9.5" fill="#6b7280">«interface»</text>
  <text x="30" y="156" font-size="11.5" fill="#5e9ff6">SpotAllocationStrategy</text>
  <text x="30" y="172" font-size="10" fill="#e8e4dc">+ findSpot(spots, v) : Spot</text>

  <rect x="416" y="120" width="268" height="58" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="430" y="140" font-size="9.5" fill="#6b7280">«interface»</text>
  <text x="430" y="156" font-size="11.5" fill="#5e9ff6">PricingStrategy</text>
  <text x="430" y="172" font-size="10" fill="#e8e4dc">+ fee(ticket, exitAt) : Money</text>

  <line x1="76" y1="240" x2="76" y2="212" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="212" y1="240" x2="212" y2="212" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="76" y1="212" x2="212" y2="212" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="144" y1="212" x2="144" y2="182" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#pl-real)"/>
  <rect x="16" y="240" width="120" height="32" rx="5" fill="#14161a" stroke="#2d333d"/><text x="30" y="260" font-size="10" fill="#e8e4dc">NearestFirst</text>
  <rect x="152" y="240" width="120" height="32" rx="5" fill="#14161a" stroke="#2d333d"/><text x="166" y="260" font-size="10" fill="#e8e4dc">SpreadOut</text>

  <line x1="476" y1="240" x2="476" y2="212" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="612" y1="240" x2="612" y2="212" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="476" y1="212" x2="612" y2="212" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="544" y1="212" x2="544" y2="182" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#pl-real)"/>
  <rect x="416" y="240" width="120" height="32" rx="5" fill="#14161a" stroke="#2d333d"/><text x="430" y="260" font-size="10" fill="#e8e4dc">HourlyRate</text>
  <rect x="552" y="240" width="120" height="32" rx="5" fill="#14161a" stroke="#2d333d"/><text x="566" y="260" font-size="10" fill="#e8e4dc">SlabRate</text>

  <rect x="416" y="286" width="256" height="32" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)" stroke-dasharray="4 3"/>
  <text x="430" y="306" font-size="10" fill="#5cc66f">WeekendRate — the follow-up. 1 new file, 0 edits.</text>
</svg>`,
        caption:
          "This is the [[strategy]] pattern, and it is the answer to *“now charge differently on weekends”*. You add a class. You do not open `unpark()`. That is [[open-closed]] made concrete — and in the prototype above, the **🎯/📊** and **⏱/🪜** chips are exactly these four boxes being swapped at runtime.",
      },

      // ============ STEP 5 ============
      { type: "h", text: "Step 5 · The two flows, message by message" },
      {
        type: "p",
        text: "There are only two stories in this system. Walk both out loud while you draw them — this is where an interviewer decides whether you actually understand your own diagram.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 330" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram of park. EntryGate calls park on ParkingLot. ParkingLot calls findSpot on the allocation strategy, which returns spot F1 dash 03. ParkingLot calls tryAssign on the spot, which returns true. ParkingLot creates a Ticket and returns it to the gate.">
  <defs>
    <marker id="pl-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="pl-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="106" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="34" y="32" font-size="10.5" fill="#e8e4dc">EntryGate</text>
  <rect x="176" y="12" width="106" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="196" y="32" font-size="10.5" fill="#fb863a">ParkingLot</text>
  <rect x="338" y="12" width="106" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="352" y="32" font-size="10.5" fill="#5e9ff6">«strategy»</text>
  <rect x="490" y="12" width="106" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="512" y="32" font-size="10.5" fill="#e8e4dc">Spot F1-03</text>
  <rect x="614" y="12" width="92" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="640" y="32" font-size="10.5" fill="#e8e4dc">Ticket</text>

  <line x1="67" y1="42" x2="67" y2="310" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="229" y1="42" x2="229" y2="310" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="391" y1="42" x2="391" y2="310" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="543" y1="42" x2="543" y2="310" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="660" y1="42" x2="660" y2="310" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="74" y="72" font-size="10" fill="#e8e4dc">park(car)</text>
  <line x1="67" y1="80" x2="225" y2="80" stroke="#fb863a" stroke-width="1.3" marker-end="url(#pl-call)"/>

  <text x="236" y="112" font-size="10" fill="#e8e4dc">findSpot(spots, car)</text>
  <line x1="229" y1="120" x2="387" y2="120" stroke="#fb863a" stroke-width="1.3" marker-end="url(#pl-call)"/>

  <text x="248" y="146" font-size="10" fill="#9099a8">smallest that fits → F1-03</text>
  <line x1="391" y1="154" x2="233" y2="154" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#pl-ret)"/>

  <text x="236" y="186" font-size="10" fill="#e8e4dc">tryAssign(car)</text>
  <line x1="229" y1="194" x2="539" y2="194" stroke="#fb863a" stroke-width="1.3" marker-end="url(#pl-call)"/>

  <text x="392" y="220" font-size="10" fill="#5cc66f">true — it was still free</text>
  <line x1="543" y1="228" x2="233" y2="228" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#pl-ret)"/>

  <text x="236" y="260" font-size="10" fill="#e8e4dc">new Ticket(car, F1-03, 09:00)</text>
  <line x1="229" y1="268" x2="656" y2="268" stroke="#fb863a" stroke-width="1.3" marker-end="url(#pl-call)"/>

  <text x="74" y="296" font-size="10" fill="#5cc66f">Ticket T-7</text>
  <line x1="229" y1="304" x2="71" y2="304" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#pl-ret)"/>
</svg>`,
        caption:
          "`park()` — five messages, and only the lot talks to more than one collaborator. If a class in your diagram is not on this line, ask yourself whether it earns its place. Notation: [[sequence-diagrams]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram of unpark. ExitGate calls unpark with ticket T dash 7 and the exit time on ParkingLot. ParkingLot asks the pricing strategy for the fee, which returns sixty-five rupees. ParkingLot releases the spot and closes the ticket, then returns the amount to the gate.">
  <defs>
    <marker id="pl-call2" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="pl-ret2" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="106" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="38" y="32" font-size="10.5" fill="#e8e4dc">ExitGate</text>
  <rect x="176" y="12" width="106" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="196" y="32" font-size="10.5" fill="#fb863a">ParkingLot</text>
  <rect x="338" y="12" width="106" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="356" y="32" font-size="10.5" fill="#5e9ff6">«pricing»</text>
  <rect x="490" y="12" width="106" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="512" y="32" font-size="10.5" fill="#e8e4dc">Spot F1-03</text>
  <rect x="614" y="12" width="92" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="640" y="32" font-size="10.5" fill="#e8e4dc">Ticket</text>

  <line x1="67" y1="42" x2="67" y2="282" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="229" y1="42" x2="229" y2="282" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="391" y1="42" x2="391" y2="282" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="543" y1="42" x2="543" y2="282" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="660" y1="42" x2="660" y2="282" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="74" y="72" font-size="10" fill="#e8e4dc">unpark(“T-7”, 12:00)</text>
  <line x1="67" y1="80" x2="225" y2="80" stroke="#fb863a" stroke-width="1.3" marker-end="url(#pl-call2)"/>

  <text x="236" y="108" font-size="10" fill="#e8e4dc">fee(ticket, 12:00)</text>
  <line x1="229" y1="116" x2="387" y2="116" stroke="#fb863a" stroke-width="1.3" marker-end="url(#pl-call2)"/>

  <text x="250" y="142" font-size="10" fill="#5cc66f">₹65  (3 h, slab rate)</text>
  <line x1="391" y1="150" x2="233" y2="150" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#pl-ret2)"/>

  <text x="236" y="180" font-size="10" fill="#e8e4dc">release()</text>
  <line x1="229" y1="188" x2="539" y2="188" stroke="#fb863a" stroke-width="1.3" marker-end="url(#pl-call2)"/>

  <text x="236" y="216" font-size="10" fill="#e8e4dc">close(PAID)</text>
  <line x1="229" y1="224" x2="656" y2="224" stroke="#fb863a" stroke-width="1.3" marker-end="url(#pl-call2)"/>

  <text x="74" y="256" font-size="10" fill="#5cc66f">₹65</text>
  <line x1="229" y1="264" x2="71" y2="264" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#pl-ret2)"/>
</svg>`,
        caption:
          "`unpark()` — price it, free the spot, close the ticket, hand back the amount. **Order matters:** close the ticket *before* you release the spot in your head, so a ticket can never be billed twice.",
      },

      // ============ SPOT MATCHING ============
      { type: "h", text: "Choosing a spot: the rule everyone gets half-right" },
      {
        type: "p",
        text: "A bike fits in a bike spot. It also physically fits in a truck spot. So the naive rule — *“find any free spot big enough”* — is correct and quietly terrible: park three bikes and your two truck spots are gone. The rule you want is **the smallest free spot that fits**.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 620 236" width="100%" style="max-width:600px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A three by three fit table. Bike fits SMALL preferred, MEDIUM and LARGE. Car does not fit SMALL, fits MEDIUM preferred and LARGE. Truck does not fit SMALL or MEDIUM and fits LARGE preferred.">
  <text x="196" y="30" font-size="10" fill="#9099a8">SMALL</text>
  <text x="326" y="30" font-size="10" fill="#9099a8">MEDIUM</text>
  <text x="468" y="30" font-size="10" fill="#9099a8">LARGE</text>

  <text x="24" y="76" font-size="11" fill="#e8e4dc">Bike</text>
  <rect x="164" y="52" width="110" height="38" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="196" y="76" font-size="11" fill="#fb863a">✓ take</text>
  <rect x="296" y="52" width="110" height="38" rx="6" fill="#14161a" stroke="#2d333d"/><text x="336" y="76" font-size="11" fill="#5cc66f">✓</text>
  <rect x="428" y="52" width="110" height="38" rx="6" fill="#14161a" stroke="#2d333d"/><text x="468" y="76" font-size="11" fill="#5cc66f">✓</text>

  <text x="24" y="128" font-size="11" fill="#e8e4dc">Car</text>
  <rect x="164" y="104" width="110" height="38" rx="6" fill="#14161a" stroke="#2d333d"/><text x="204" y="128" font-size="11" fill="#f06868">✗</text>
  <rect x="296" y="104" width="110" height="38" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="328" y="128" font-size="11" fill="#fb863a">✓ take</text>
  <rect x="428" y="104" width="110" height="38" rx="6" fill="#14161a" stroke="#2d333d"/><text x="468" y="128" font-size="11" fill="#5cc66f">✓</text>

  <text x="24" y="180" font-size="11" fill="#e8e4dc">Truck</text>
  <rect x="164" y="156" width="110" height="38" rx="6" fill="#14161a" stroke="#2d333d"/><text x="204" y="180" font-size="11" fill="#f06868">✗</text>
  <rect x="296" y="156" width="110" height="38" rx="6" fill="#14161a" stroke="#2d333d"/><text x="336" y="180" font-size="11" fill="#f06868">✗</text>
  <rect x="428" y="156" width="110" height="38" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="460" y="180" font-size="11" fill="#fb863a">✓ take</text>

  <line x1="24" y1="208" x2="596" y2="208" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="24" y="228" font-size="10" fill="#9099a8">green = it physically fits · orange = the one you should actually hand out</text>
</svg>`,
        caption:
          "Two lines of code: `spot.size >= vehicle.requiredSize` to filter, then take the **minimum** size among what is left. In the prototype, the blue spots are the green cells and the orange spots are the orange cell.",
      },
      {
        type: "p",
        text: "Once the *size* filter has run you still have a choice among equals, and that choice is the strategy. Two that are easy to defend:",
      },
      {
        type: "ul",
        items: [
          "**Nearest first** — lowest floor, lowest spot number. Shortest walk for the driver. Floor 1 fills completely before Floor 2 gets a car.",
          "**Spread out** — send each arrival to the emptiest floor. Slower ramps stay clear, and no single floor jams at rush hour.",
          "**Cheapest / reserved / EV-only** — the same interface, more classes. This is why `findSpot` takes the spot list as a parameter instead of reaching inside the lot: the strategy stays a small, testable, stateless object.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "The real reason to use a strategy here",
        text: "It is not that you expect to ship `SpreadOut`. It is that when the interviewer says *“what if we wanted to fill the top floor first?”*, your answer is **“one new class, nothing else changes”** — and you can say it in four seconds instead of scrolling through an `if/else` chain looking for where to wedge it in.",
      },

      // ============ PRICING ============
      { type: "h", text: "Pricing: the same ticket, two different bills" },
      {
        type: "p",
        text: "The fee is a pure function of *the ticket* and *the exit time*. Nothing else. Keep it that way and pricing becomes trivially testable — and the interviewer's favourite follow-up becomes a one-liner.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 660 250" width="100%" style="max-width:640px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two receipts for the same ticket, a car parked three hours. The hourly rate receipt shows three hours times twenty rupees equals sixty rupees. The slab rate receipt shows fifty rupees for the first two hours plus one extra hour at fifteen rupees equals sixty-five rupees.">
  <text x="20" y="24" font-size="10" fill="#9099a8">same ticket · Car · in 09:00 · out 12:00 · 3 h</text>

  <rect x="20" y="38" width="292" height="188" rx="9" fill="#14161a" stroke="#2d333d"/>
  <text x="40" y="64" font-size="11" fill="#5e9ff6">HourlyRate</text>
  <line x1="40" y1="76" x2="292" y2="76" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="40" y="102" font-size="10.5" fill="#9099a8">rate for CAR</text><text x="238" y="102" font-size="10.5" fill="#e8e4dc">₹20 / h</text>
  <text x="40" y="128" font-size="10.5" fill="#9099a8">started hours</text><text x="264" y="128" font-size="10.5" fill="#e8e4dc">3</text>
  <text x="40" y="154" font-size="10.5" fill="#6b7280">3 × 20</text>
  <line x1="40" y1="170" x2="292" y2="170" stroke="#2d333d"/>
  <text x="40" y="196" font-size="11" fill="#e8e4dc">TOTAL</text><text x="236" y="196" font-size="13" fill="#5cc66f">₹60</text>

  <rect x="348" y="38" width="292" height="188" rx="9" fill="#14161a" stroke="#2d333d"/>
  <text x="368" y="64" font-size="11" fill="#5e9ff6">SlabRate</text>
  <line x1="368" y1="76" x2="620" y2="76" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="368" y="102" font-size="10.5" fill="#9099a8">first 2 h</text><text x="574" y="102" font-size="10.5" fill="#e8e4dc">₹50</text>
  <text x="368" y="128" font-size="10.5" fill="#9099a8">each extra hour</text><text x="574" y="128" font-size="10.5" fill="#e8e4dc">₹15</text>
  <text x="368" y="154" font-size="10.5" fill="#6b7280">50 + 1 × 15</text>
  <line x1="368" y1="170" x2="620" y2="170" stroke="#2d333d"/>
  <text x="368" y="196" font-size="11" fill="#e8e4dc">TOTAL</text><text x="564" y="196" font-size="13" fill="#5cc66f">₹65</text>
</svg>`,
        caption:
          "`unpark()` never knew which of these ran. It called `pricing.fee(ticket, exitAt)` and printed the number. Toggle **⏱ Flat / 🪜 Slabs** in the prototype and watch the open tickets re-price live.",
      },
      {
        type: "ul",
        items: [
          "**Round *up* to a started hour.** 61 minutes is 2 hours. Say this out loud — it is the kind of detail that separates “I thought about it” from “I divided by 3600”.",
          "**Charge a minimum.** Somebody who leaves after 4 minutes still pays for one hour, or your lot is free for anyone doing a drop-off.",
          "**Never bill from the current clock.** Bill from `ticket.entryAt` to the `exitAt` you were handed. That is what makes the whole thing unit-testable.",
        ],
      },

      // ============ TICKET LIFECYCLE ============
      { type: "h", text: "The ticket has a life, and it can only move forwards" },
      {
        type: "p",
        text: "A ticket is issued, then paid, then closed. It never goes backwards. Modelling that as an explicit **status** — instead of inferring it from “is the spot empty?” — is what stops a ticket being billed twice.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 680 150" width="100%" style="max-width:660px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A state diagram for a ticket. A start dot leads to ACTIVE. ACTIVE moves to PAID on unpark, and PAID moves to CLOSED when the spot is released. ACTIVE can also move to LOST, which charges a flat penalty and then goes to CLOSED.">
  <defs>
    <marker id="pl-st" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#d8d3c9"/></marker>
  </defs>
  <circle cx="26" cy="56" r="7" fill="#d8d3c9"/>
  <line x1="34" y1="56" x2="70" y2="56" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#pl-st)"/>

  <rect x="76" y="36" width="118" height="40" rx="20" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="112" y="61" font-size="11" fill="#fb863a">ACTIVE</text>
  <text x="212" y="48" font-size="9.5" fill="#9099a8">unpark(id, exitAt)</text>
  <line x1="196" y1="56" x2="326" y2="56" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#pl-st)"/>

  <rect x="332" y="36" width="118" height="40" rx="20" fill="#14161a" stroke="#3a414c"/><text x="374" y="61" font-size="11" fill="#e8e4dc">PAID</text>
  <text x="464" y="48" font-size="9.5" fill="#9099a8">spot released</text>
  <line x1="452" y1="56" x2="576" y2="56" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#pl-st)"/>

  <rect x="582" y="36" width="86" height="40" rx="20" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="602" y="61" font-size="11" fill="#5cc66f">CLOSED</text>

  <polyline points="135,78 135,120 374,120" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="374" y1="120" x2="374" y2="80" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#pl-st)"/>
  <text x="150" y="138" font-size="9.5" fill="#6b7280">ticket lost → flat penalty, then the same path out</text>
</svg>`,
        caption:
          "Two lines of guard code buy you this: `unpark` on a ticket that is not `ACTIVE` throws. Notation: [[state-diagrams]].",
      },

      // ============ CONCURRENCY ============
      { type: "h", text: "Two cars, one spot — the bug nobody mentions until they do" },
      {
        type: "p",
        text: "A parking lot has several entry gates, and gates do not take turns. Two threads can read *“F1-03 is free”* in the same instant, and both can then write themselves into it. You just gave one spot to two cars, and the second one is going to be upset.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 300" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Top half, unguarded: gate A and gate B both read that F1 dash 03 is free, then both write into it, producing two cars in one spot. Bottom half, guarded: gate A takes the spot atomically, gate B's attempt returns false and it retries and receives F1 dash 04.">
  <text x="20" y="24" font-size="10.5" fill="#f06868">UNGUARDED — both gates read “free” before either writes</text>
  <rect x="20" y="34" width="660" height="98" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>

  <text x="36" y="62" font-size="10" fill="#9099a8">Gate A</text>
  <rect x="96" y="46" width="150" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="108" y="64" font-size="9.5" fill="#e8e4dc">read F1-03 → free</text>
  <rect x="300" y="46" width="150" height="26" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="312" y="64" font-size="9.5" fill="#f06868">write car A</text>

  <text x="36" y="106" font-size="10" fill="#9099a8">Gate B</text>
  <rect x="150" y="90" width="150" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="162" y="108" font-size="9.5" fill="#e8e4dc">read F1-03 → free</text>
  <rect x="354" y="90" width="150" height="26" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="366" y="108" font-size="9.5" fill="#f06868">write car B</text>

  <text x="520" y="84" font-size="11" fill="#f06868">✗ one spot, two cars</text>

  <text x="20" y="182" font-size="10.5" fill="#5cc66f">GUARDED — “check and take” happens as one indivisible step</text>
  <rect x="20" y="192" width="660" height="98" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <text x="36" y="220" font-size="10" fill="#9099a8">Gate A</text>
  <rect x="96" y="204" width="196" height="26" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="108" y="222" font-size="9.5" fill="#5cc66f">tryAssign(F1-03) → true</text>

  <text x="36" y="264" font-size="10" fill="#9099a8">Gate B</text>
  <rect x="150" y="248" width="196" height="26" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="162" y="266" font-size="9.5" fill="#f06868">tryAssign(F1-03) → false</text>
  <rect x="360" y="248" width="176" height="26" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="372" y="266" font-size="9.5" fill="#5cc66f">retry → gets F1-04</text>

  <text x="556" y="222" font-size="11" fill="#5cc66f">✓ every car parked</text>
</svg>`,
        caption:
          "The fix is not “lock the whole lot”. It is to make **check-and-take one indivisible operation** on the spot, and let a loser simply ask again.",
      },
      {
        type: "code",
        language: "java",
        filename: "the whole fix",
        code: `// ParkingSpot — the check and the take cannot be split apart
public synchronized boolean tryAssign(Vehicle v) {
    if (vehicle != null) return false;   // someone got here first
    vehicle = v;
    return true;
}

// ParkingLot — a loser just asks the strategy again
public Ticket park(Vehicle v) {
    for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
        ParkingSpot spot = allocation.findSpot(spots, v)
            .orElseThrow(() -> new LotFullException(v.getType()));
        if (spot.tryAssign(v)) return issueTicket(v, spot);
    }
    throw new LotFullException(v.getType());   // heavy contention, give up cleanly
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Do not put `synchronized` on `park()` and call it done",
        text: "It is correct, and it means **one car enters the lot at a time** across every gate in the building. Lock the *spot*, not the lot: contention drops to the handful of cars actually competing for the same space. If they push further, mention an `AtomicReference<Vehicle>` with compare-and-set — same idea, no lock at all. Background: [[locks-mutex-semaphore]], [[atomic-operations-and-cas]] and [[deadlock-race-starvation]].",
      },
      {
        type: "callout",
        variant: "info",
        title: "How much of this to actually build",
        text: "In a 60-minute round, **write `tryAssign` as `synchronized` and say the rest out loud.** That is four extra characters of code and a 20-second explanation, and it reliably reads as senior. Building a full lock-free allocator is how you run out of time.",
      },

      // ============ EXTENSIBILITY ============
      { type: "h", text: "The extensibility test — where they will actually push you" },
      {
        type: "p",
        text: "With ten minutes left, the interviewer stops asking about parking and starts asking about **change**. This is the real exam. Each of these should be answerable in one sentence, and the sentence should contain the words *“a new class”*.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 254" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Four follow-up requests and what each costs. Weekend pricing: one new class, zero edits. Fill the top floor first: one new class, zero edits. Add an electric-vehicle spot: one enum value plus one new class, one edit. Add a second entry gate: no new class, but make check-and-take atomic.">
  <text x="20" y="24" font-size="10" fill="#9099a8">“NOW ALSO…”</text>
  <text x="430" y="24" font-size="10" fill="#9099a8">WHAT IT COSTS YOU</text>

  <rect x="20" y="36" width="660" height="46" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="64" font-size="11" fill="#e8e4dc">charge more on weekends</text>
  <rect x="430" y="48" width="130" height="24" rx="12" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="444" y="64" font-size="9.5" fill="#5cc66f">+1 class</text>
  <rect x="572" y="48" width="94" height="24" rx="12" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="586" y="64" font-size="9.5" fill="#5cc66f">0 edits</text>

  <rect x="20" y="90" width="660" height="46" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="118" font-size="11" fill="#e8e4dc">fill the top floor first</text>
  <rect x="430" y="102" width="130" height="24" rx="12" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="444" y="118" font-size="9.5" fill="#5cc66f">+1 class</text>
  <rect x="572" y="102" width="94" height="24" rx="12" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="586" y="118" font-size="9.5" fill="#5cc66f">0 edits</text>

  <rect x="20" y="144" width="660" height="46" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="172" font-size="11" fill="#e8e4dc">add an EV charging spot</text>
  <rect x="430" y="156" width="130" height="24" rx="12" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="444" y="172" font-size="9.5" fill="#5cc66f">+1 enum, +1 class</text>
  <rect x="572" y="156" width="94" height="24" rx="12" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="586" y="172" font-size="9.5" fill="#fb863a">1 edit</text>

  <rect x="20" y="198" width="660" height="46" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="226" font-size="11" fill="#e8e4dc">open a second entry gate</text>
  <rect x="430" y="210" width="130" height="24" rx="12" fill="#1a1d22" stroke="#2d333d"/><text x="444" y="226" font-size="9.5" fill="#9099a8">0 classes</text>
  <rect x="572" y="210" width="94" height="24" rx="12" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="580" y="226" font-size="9.5" fill="#fb863a">make it safe</text>
</svg>`,
        caption:
          "The first two are free *because* you made the rules into interfaces in step 4. That is the entire return on those ten minutes of diagramming.",
      },
      {
        type: "ul",
        items: [
          "**“Charge differently on weekends.”** → `class WeekendRate implements PricingStrategy`. Wire it in `main()`. Nothing else is touched.",
          "**“Fill the top floor first.”** → `class TopFloorFirst implements SpotAllocationStrategy`. Same story.",
          "**“Add electric-vehicle spots with a charger.”** → a new `SpotFeature` (or an `ELECTRIC` spot type) plus an `EvOnly` strategy. One edit, because the size-fit rule now has a second dimension — say that honestly rather than pretending it is free.",
          "**“Two entrance gates.”** → no new classes; this is the concurrency answer above. `tryAssign` is already atomic, so you are done.",
          "**“Show free spots on a board at the entrance.”** → a `DisplayBoard` that the lot notifies on every park and unpark. That is [[observer]], and mentioning it by name costs you nothing.",
          "**“Monthly pass holders skip the ticket.”** → a `ParkingPass` and a second entry path. Be careful here: this is the one follow-up big enough to change your model, so scope it out loud before you touch anything.",
        ],
      },

      // ============ BUDGET ============
      { type: "h", text: "Spending the 60 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 168" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sixty-minute timeline split into five segments: clarify five minutes, entities eight minutes, API seven minutes, class diagram eight minutes, and code plus demo thirty-two minutes. A marker at minute forty-five is labelled stop adding features, make it run.">
  <text x="20" y="26" font-size="10" fill="#9099a8">60 MINUTES</text>

  <rect x="20" y="40" width="53" height="44" rx="5" fill="rgba(94,159,246,0.12)" stroke="#5e9ff6"/>
  <rect x="77" y="40" width="85" height="44" rx="5" fill="rgba(94,159,246,0.12)" stroke="#5e9ff6"/>
  <rect x="166" y="40" width="75" height="44" rx="5" fill="rgba(94,159,246,0.12)" stroke="#5e9ff6"/>
  <rect x="245" y="40" width="85" height="44" rx="5" fill="rgba(94,159,246,0.12)" stroke="#5e9ff6"/>
  <rect x="334" y="40" width="346" height="44" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>

  <text x="26" y="66" font-size="9.5" fill="#5e9ff6">5m</text>
  <text x="83" y="66" font-size="9.5" fill="#5e9ff6">8m</text>
  <text x="172" y="66" font-size="9.5" fill="#5e9ff6">7m</text>
  <text x="251" y="66" font-size="9.5" fill="#5e9ff6">8m</text>
  <text x="340" y="66" font-size="9.5" fill="#fb863a">32m</text>

  <text x="20" y="104" font-size="9.5" fill="#9099a8">clarify</text>
  <text x="77" y="104" font-size="9.5" fill="#9099a8">entities</text>
  <text x="166" y="104" font-size="9.5" fill="#9099a8">API</text>
  <text x="245" y="104" font-size="9.5" fill="#9099a8">diagram</text>
  <text x="334" y="104" font-size="9.5" fill="#9099a8">code + demo</text>

  <line x1="530" y1="34" x2="530" y2="118" stroke="#f06868" stroke-width="1.3" stroke-dasharray="4 3"/>
  <text x="418" y="140" font-size="10" fill="#f06868">minute 45 — stop adding, start making it run</text>
</svg>`,
        caption:
          "The blue block is only 28 minutes, and every minute of it removes a decision from the orange block. That is why planning feels slower and finishes faster.",
      },
      {
        type: "ol",
        items: [
          "**Enums and `Vehicle` first** (3 min) — tiny, unblocks everything else.",
          "**`ParkingSpot` with `fits` and `tryAssign`** (5 min) — the heart of the model.",
          "**`ParkingLot.park()` with a hardcoded nearest-first strategy** (8 min) — get a ticket printing before you make anything pluggable.",
          "**`Ticket` + `unpark()` with the simplest pricing** (8 min) — now the loop is closed and you have a *working system*.",
          "**Extract the two strategies** (5 min) — only now. Extraction is a five-minute refactor when the thing works, and a rabbit hole when it does not.",
          "**`main()` demo** (5 min) — park a bike, a car and a truck, print two bills, try to park into a full lot. Print it. Run it.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "At minute 45, freeze the feature list",
        text: "Whatever is unbuilt at 45 stays unbuilt. Spend the last quarter making the demo run and printing clean output. A working lot with one pricing rule scores far above a half-typed lot with four.",
      },

      // ============ MISTAKES ============
      { type: "h", text: "Five ways this round is usually lost" },
      {
        type: "ul",
        items: [
          "**Typing at minute zero.** Twenty minutes later you discover the ticket needed an entry time and the rewrite eats the round.",
          "**A god `ParkingLot`** that finds spots, prices tickets, prints receipts and manages gates. Ask of each method: *is this the lot's job?* See [[single-responsibility]].",
          "**Anaemic classes.** `ParkingSpot` with nothing but getters and setters, while `ParkingLot` reaches in and mutates it. Behaviour belongs next to the data it touches — that is [[tell-dont-ask]].",
          "**Pattern cosplay.** A `ParkingLotFactoryProviderImpl` before there is a single working `park()`. Two strategies is the right amount of pattern for this problem; see [[pattern-overuse-anti-patterns]].",
          "**No demo.** If it does not run, most interviewers cannot give you the top band no matter how pretty the diagram was.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Watch the four beats of one park",
        body:
          "Pick **🚗 Car** and press **▶ Park**. Do not skip the middle: beat 2 lights up *every* spot big enough in blue, beat 3 narrows to the **smallest fitting size** in orange, and only then does the strategy pick one. Now do the same with **🏍 Bike** — notice how many more spots turn blue, and that it still takes an `S`.",
      },
      {
        title: "Change the strategy, not the code",
        body:
          "Park four cars on **🎯 Nearest** and watch Floor 1 fill left to right. Press **↺ Reset**, switch to **📊 Spread**, park four cars again — they alternate floors. Read the mono line at the top while you do it: `park()` is called identically both times. The only thing that changed is which object the lot is holding.",
      },
      {
        title: "Make the clock cost money",
        body:
          "Park a car, then press **⏩ +1 hour** three times. The open ticket re-prices itself on every press. Now switch **⏱ Flat → 🪜 Slabs** and watch the same ticket land on a different number — ₹60 becomes ₹65 — with nothing else touched. That is one interface with two implementations.",
      },
      {
        title: "Fill it up and get refused",
        body:
          "Press **⚡ Fill the lot**, then select **🚚 Truck** and press **▶ Park**. The barrier stays down and the entrance shakes. Ask yourself what your code should do here: return null, return an `Optional`, or throw? Say your answer out loud — the interviewer will ask.",
      },
      {
        title: "Find the smallest-fit trade-off",
        body:
          "Reset, then park **three trucks** first, then try a car and a bike. Compare with the reverse order. Smallest-fit protects the big spots, but it cannot save you once trucks have taken them. This is the exact conversation to have when they ask “what if the lot is 80% full?”",
      },
      {
        title: "Now build it yourself",
        body:
          "Open a blank file and write it from memory in this order: enums → `Vehicle` → `ParkingSpot` → `park()` → `Ticket` → `unpark()` → `main()`. Time yourself. Then add `WeekendRate implements PricingStrategy` and confirm you changed **zero** existing lines to wire it in. If you had to edit something, your interface is in the wrong place.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "ParkingLot.java",
        code: `import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

// ---------- vocabulary ----------
enum VehicleType { BIKE, CAR, TRUCK }
enum SpotSize    { SMALL, MEDIUM, LARGE }        // ordinal order == physical order
enum TicketStatus { ACTIVE, PAID, LOST }

// ---------- vehicles ----------
abstract class Vehicle {
    private final String plate;
    private final VehicleType type;
    protected Vehicle(String plate, VehicleType type) { this.plate = plate; this.type = type; }
    public String plate()      { return plate; }
    public VehicleType type()  { return type; }
    public abstract SpotSize requiredSize();
}
class Bike  extends Vehicle { public Bike(String p)  { super(p, VehicleType.BIKE);  } public SpotSize requiredSize() { return SpotSize.SMALL;  } }
class Car   extends Vehicle { public Car(String p)   { super(p, VehicleType.CAR);   } public SpotSize requiredSize() { return SpotSize.MEDIUM; } }
class Truck extends Vehicle { public Truck(String p) { super(p, VehicleType.TRUCK); } public SpotSize requiredSize() { return SpotSize.LARGE;  } }

// ---------- spot: knows how to be taken safely ----------
class ParkingSpot {
    private final String id;
    private final int floor;
    private final SpotSize size;
    private Vehicle vehicle;                       // null == free

    ParkingSpot(String id, int floor, SpotSize size) { this.id = id; this.floor = floor; this.size = size; }

    public String id()     { return id; }
    public int floor()     { return floor; }
    public SpotSize size() { return size; }

    public boolean fits(Vehicle v) { return size.ordinal() >= v.requiredSize().ordinal(); }
    public synchronized boolean isFree() { return vehicle == null; }

    /** Check and take, indivisibly. Two gates cannot both win. */
    public synchronized boolean tryAssign(Vehicle v) {
        if (vehicle != null) return false;
        vehicle = v;
        return true;
    }
    public synchronized void release() { vehicle = null; }
}

// ---------- ticket: issued once, then only its status moves ----------
class Ticket {
    private final String id;
    private final Vehicle vehicle;
    private final ParkingSpot spot;
    private final Instant entryAt;
    private TicketStatus status = TicketStatus.ACTIVE;

    Ticket(String id, Vehicle v, ParkingSpot s, Instant entryAt) {
        this.id = id; this.vehicle = v; this.spot = s; this.entryAt = entryAt;
    }
    public String id()          { return id; }
    public Vehicle vehicle()    { return vehicle; }
    public ParkingSpot spot()   { return spot; }
    public Instant entryAt()    { return entryAt; }
    public TicketStatus status(){ return status; }
    public void markPaid()      { this.status = TicketStatus.PAID; }
}

// ---------- rule 1: which spot? ----------
interface SpotAllocationStrategy {
    Optional<ParkingSpot> findSpot(List<ParkingSpot> spots, Vehicle v);

    /** Shared by every strategy: free, big enough, and the SMALLEST such size. */
    default List<ParkingSpot> candidates(List<ParkingSpot> spots, Vehicle v) {
        List<ParkingSpot> fits = spots.stream()
                .filter(ParkingSpot::isFree).filter(s -> s.fits(v)).toList();
        return fits.stream()
                .min(Comparator.comparingInt(s -> s.size().ordinal()))
                .map(best -> fits.stream().filter(s -> s.size() == best.size()).toList())
                .orElse(List.of());
    }
}

class NearestFirst implements SpotAllocationStrategy {
    public Optional<ParkingSpot> findSpot(List<ParkingSpot> spots, Vehicle v) {
        return candidates(spots, v).stream()
                .min(Comparator.comparingInt(ParkingSpot::floor)
                               .thenComparing(ParkingSpot::id));
    }
}

class SpreadOut implements SpotAllocationStrategy {
    public Optional<ParkingSpot> findSpot(List<ParkingSpot> spots, Vehicle v) {
        Map<Integer, Long> freePerFloor = new HashMap<>();
        for (ParkingSpot s : spots)
            if (s.isFree()) freePerFloor.merge(s.floor(), 1L, Long::sum);
        return candidates(spots, v).stream()
                .max(Comparator.comparingLong((ParkingSpot s) -> freePerFloor.getOrDefault(s.floor(), 0L))
                               .thenComparing(s -> s.id(), Comparator.reverseOrder()));
    }
}

// ---------- rule 2: how much? ----------
interface PricingStrategy {
    /** Money in paise/cents. Never a double. */
    long fee(Ticket t, Instant exitAt);

    default long startedHours(Ticket t, Instant exitAt) {
        long minutes = Duration.between(t.entryAt(), exitAt).toMinutes();
        return Math.max(1, (long) Math.ceil(minutes / 60.0));   // 61 min == 2 h, and never zero
    }
}

class HourlyRate implements PricingStrategy {
    private static final Map<VehicleType, Long> RATE =
            Map.of(VehicleType.BIKE, 1000L, VehicleType.CAR, 2000L, VehicleType.TRUCK, 3000L);
    public long fee(Ticket t, Instant exitAt) {
        return startedHours(t, exitAt) * RATE.get(t.vehicle().type());
    }
}

class SlabRate implements PricingStrategy {
    public long fee(Ticket t, Instant exitAt) {
        long h = startedHours(t, exitAt);
        return h <= 2 ? 5000L : 5000L + (h - 2) * 1500L;
    }
}

class LotFullException extends RuntimeException {
    LotFullException(VehicleType t) { super("No free spot for a " + t); }
}

// ---------- the front door ----------
class ParkingLot {
    private static final int MAX_RETRIES = 3;

    private final List<ParkingSpot> spots;
    private final Map<String, Ticket> open = new ConcurrentHashMap<>();
    private final AtomicInteger seq = new AtomicInteger();
    private SpotAllocationStrategy allocation;
    private PricingStrategy pricing;

    ParkingLot(List<ParkingSpot> spots, SpotAllocationStrategy a, PricingStrategy p) {
        this.spots = List.copyOf(spots); this.allocation = a; this.pricing = p;
    }
    public void setAllocation(SpotAllocationStrategy a) { this.allocation = a; }
    public void setPricing(PricingStrategy p)           { this.pricing = p; }

    public Ticket park(Vehicle v, Instant now) {
        for (int i = 0; i < MAX_RETRIES; i++) {
            ParkingSpot spot = allocation.findSpot(spots, v)
                    .orElseThrow(() -> new LotFullException(v.type()));
            if (spot.tryAssign(v)) {                       // lost the race? loop and pick another
                Ticket t = new Ticket("T-" + seq.incrementAndGet(), v, spot, now);
                open.put(t.id(), t);
                return t;
            }
        }
        throw new LotFullException(v.type());
    }

    public long unpark(String ticketId, Instant exitAt) {
        Ticket t = open.remove(ticketId);                  // remove == this ticket can never bill twice
        if (t == null) throw new IllegalArgumentException("Unknown or already-closed ticket: " + ticketId);
        long amount = pricing.fee(t, exitAt);
        t.markPaid();
        t.spot().release();
        return amount;
    }

    public long availableSpots(SpotSize size) {
        return spots.stream().filter(ParkingSpot::isFree).filter(s -> s.size() == size).count();
    }
}

// ---------- the demo that has to run ----------
public class Main {
    public static void main(String[] args) {
        List<ParkingSpot> spots = new ArrayList<>();
        SpotSize[][] layout = {
            { SpotSize.SMALL, SpotSize.SMALL, SpotSize.MEDIUM, SpotSize.MEDIUM, SpotSize.LARGE },
            { SpotSize.SMALL, SpotSize.MEDIUM, SpotSize.MEDIUM, SpotSize.LARGE,  SpotSize.LARGE }
        };
        for (int f = 0; f < layout.length; f++)
            for (int i = 0; i < layout[f].length; i++)
                spots.add(new ParkingSpot("F" + (f + 1) + "-" + (i + 1), f, layout[f][i]));

        ParkingLot lot = new ParkingLot(spots, new NearestFirst(), new HourlyRate());
        Instant nine = Instant.parse("2026-01-01T09:00:00Z");

        Ticket bike  = lot.park(new Bike("KA-01-0001"),  nine);
        Ticket car   = lot.park(new Car("KA-05-1007"),   nine);
        Ticket truck = lot.park(new Truck("KA-09-4242"), nine);
        System.out.println("parked -> " + bike.spot().id() + ", " + car.spot().id() + ", " + truck.spot().id());
        System.out.println("free MEDIUM spots: " + lot.availableSpots(SpotSize.MEDIUM));

        System.out.println("car bill  = " + lot.unpark(car.id(), nine.plus(Duration.ofHours(3))) + " paise");

        lot.setPricing(new SlabRate());                    // <-- the follow-up, one line
        System.out.println("bike bill = " + lot.unpark(bike.id(), nine.plus(Duration.ofHours(3))) + " paise");

        try {
            for (int i = 0; i < 5; i++) lot.park(new Truck("KA-09-90" + i), nine);
        } catch (LotFullException e) {
            System.out.println("rejected  -> " + e.getMessage());
        }
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "parking_lot.py",
        code: `from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import IntEnum, Enum
from math import ceil
from threading import Lock
from typing import Optional


class VehicleType(Enum):
    BIKE = "BIKE"; CAR = "CAR"; TRUCK = "TRUCK"

class SpotSize(IntEnum):           # IntEnum so SMALL < MEDIUM < LARGE compares directly
    SMALL = 0; MEDIUM = 1; LARGE = 2

class TicketStatus(Enum):
    ACTIVE = "ACTIVE"; PAID = "PAID"; LOST = "LOST"


# ---------- vehicles ----------
class Vehicle(ABC):
    def __init__(self, plate: str, type_: VehicleType):
        self.plate, self.type = plate, type_

    @property
    @abstractmethod
    def required_size(self) -> SpotSize: ...

class Bike(Vehicle):
    def __init__(self, plate): super().__init__(plate, VehicleType.BIKE)
    @property
    def required_size(self): return SpotSize.SMALL

class Car(Vehicle):
    def __init__(self, plate): super().__init__(plate, VehicleType.CAR)
    @property
    def required_size(self): return SpotSize.MEDIUM

class Truck(Vehicle):
    def __init__(self, plate): super().__init__(plate, VehicleType.TRUCK)
    @property
    def required_size(self): return SpotSize.LARGE


# ---------- spot ----------
class ParkingSpot:
    def __init__(self, id_: str, floor: int, size: SpotSize):
        self.id, self.floor, self.size = id_, floor, size
        self._vehicle: Optional[Vehicle] = None
        self._lock = Lock()

    @property
    def is_free(self) -> bool:
        return self._vehicle is None

    def fits(self, v: Vehicle) -> bool:
        return self.size >= v.required_size

    def try_assign(self, v: Vehicle) -> bool:
        """Check and take, indivisibly — two gates cannot both win."""
        with self._lock:
            if self._vehicle is not None:
                return False
            self._vehicle = v
            return True

    def release(self) -> None:
        with self._lock:
            self._vehicle = None


@dataclass
class Ticket:
    id: str
    vehicle: Vehicle
    spot: ParkingSpot
    entry_at: datetime
    status: TicketStatus = field(default=TicketStatus.ACTIVE)


# ---------- rule 1: which spot? ----------
class SpotAllocationStrategy(ABC):
    @abstractmethod
    def find_spot(self, spots, vehicle) -> Optional[ParkingSpot]: ...

    def candidates(self, spots, vehicle):
        fits = [s for s in spots if s.is_free and s.fits(vehicle)]
        if not fits:
            return []
        best = min(s.size for s in fits)              # smallest size that fits
        return [s for s in fits if s.size == best]

class NearestFirst(SpotAllocationStrategy):
    def find_spot(self, spots, vehicle):
        pool = self.candidates(spots, vehicle)
        return min(pool, key=lambda s: (s.floor, s.id), default=None)

class SpreadOut(SpotAllocationStrategy):
    def find_spot(self, spots, vehicle):
        pool = self.candidates(spots, vehicle)
        free = {}
        for s in spots:
            if s.is_free:
                free[s.floor] = free.get(s.floor, 0) + 1
        return max(pool, key=lambda s: (free.get(s.floor, 0), -s.floor), default=None)


# ---------- rule 2: how much? ----------
class PricingStrategy(ABC):
    @abstractmethod
    def fee(self, ticket: Ticket, exit_at: datetime) -> int: ...

    @staticmethod
    def started_hours(ticket: Ticket, exit_at: datetime) -> int:
        minutes = (exit_at - ticket.entry_at).total_seconds() / 60
        return max(1, ceil(minutes / 60))             # 61 min == 2 h, never zero

class HourlyRate(PricingStrategy):
    RATE = {VehicleType.BIKE: 1000, VehicleType.CAR: 2000, VehicleType.TRUCK: 3000}
    def fee(self, ticket, exit_at):
        return self.started_hours(ticket, exit_at) * self.RATE[ticket.vehicle.type]

class SlabRate(PricingStrategy):
    def fee(self, ticket, exit_at):
        h = self.started_hours(ticket, exit_at)
        return 5000 if h <= 2 else 5000 + (h - 2) * 1500


class LotFullError(Exception):
    pass


# ---------- the front door ----------
class ParkingLot:
    MAX_RETRIES = 3

    def __init__(self, spots, allocation, pricing):
        self._spots = list(spots)
        self._open: dict[str, Ticket] = {}
        self._seq = 0
        self.allocation = allocation
        self.pricing = pricing

    def park(self, vehicle: Vehicle, now: datetime) -> Ticket:
        for _ in range(self.MAX_RETRIES):
            spot = self.allocation.find_spot(self._spots, vehicle)
            if spot is None:
                raise LotFullError(f"No free spot for a {vehicle.type.value}")
            if spot.try_assign(vehicle):              # lost the race? loop and pick another
                self._seq += 1
                ticket = Ticket(f"T-{self._seq}", vehicle, spot, now)
                self._open[ticket.id] = ticket
                return ticket
        raise LotFullError(f"No free spot for a {vehicle.type.value}")

    def unpark(self, ticket_id: str, exit_at: datetime) -> int:
        ticket = self._open.pop(ticket_id, None)      # pop == cannot be billed twice
        if ticket is None:
            raise ValueError(f"Unknown or already-closed ticket: {ticket_id}")
        amount = self.pricing.fee(ticket, exit_at)
        ticket.status = TicketStatus.PAID
        ticket.spot.release()
        return amount

    def available_spots(self, size: SpotSize) -> int:
        return sum(1 for s in self._spots if s.is_free and s.size == size)


if __name__ == "__main__":
    layout = [
        [SpotSize.SMALL, SpotSize.SMALL, SpotSize.MEDIUM, SpotSize.MEDIUM, SpotSize.LARGE],
        [SpotSize.SMALL, SpotSize.MEDIUM, SpotSize.MEDIUM, SpotSize.LARGE, SpotSize.LARGE],
    ]
    spots = [ParkingSpot(f"F{f+1}-{i+1}", f, size)
             for f, row in enumerate(layout) for i, size in enumerate(row)]

    lot = ParkingLot(spots, NearestFirst(), HourlyRate())
    nine = datetime(2026, 1, 1, 9, 0)

    bike = lot.park(Bike("KA-01-0001"), nine)
    car = lot.park(Car("KA-05-1007"), nine)
    truck = lot.park(Truck("KA-09-4242"), nine)
    print("parked ->", bike.spot.id, car.spot.id, truck.spot.id)
    print("free MEDIUM spots:", lot.available_spots(SpotSize.MEDIUM))

    print("car bill  =", lot.unpark(car.id, nine + timedelta(hours=3)), "paise")

    lot.pricing = SlabRate()                          # <-- the follow-up, one line
    print("bike bill =", lot.unpark(bike.id, nine + timedelta(hours=3)), "paise")

    try:
        for i in range(5):
            lot.park(Truck(f"KA-09-90{i}"), nine)
    except LotFullError as e:
        print("rejected  ->", e)`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "parking_lot.cpp",
        code: `#include <algorithm>
#include <chrono>
#include <iostream>
#include <memory>
#include <mutex>
#include <optional>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std::chrono;
using Minutes = minutes;

enum class VehicleType { Bike, Car, Truck };
enum class SpotSize { Small = 0, Medium = 1, Large = 2 };   // ordered on purpose
enum class TicketStatus { Active, Paid, Lost };

// ---------- vehicles ----------
class Vehicle {
public:
    Vehicle(std::string plate, VehicleType type) : plate_(std::move(plate)), type_(type) {}
    virtual ~Vehicle() = default;
    virtual SpotSize requiredSize() const = 0;
    const std::string& plate() const { return plate_; }
    VehicleType type() const { return type_; }
private:
    std::string plate_;
    VehicleType type_;
};

struct Bike  : Vehicle { explicit Bike(std::string p)  : Vehicle(std::move(p), VehicleType::Bike)  {} SpotSize requiredSize() const override { return SpotSize::Small;  } };
struct Car   : Vehicle { explicit Car(std::string p)   : Vehicle(std::move(p), VehicleType::Car)   {} SpotSize requiredSize() const override { return SpotSize::Medium; } };
struct Truck : Vehicle { explicit Truck(std::string p) : Vehicle(std::move(p), VehicleType::Truck) {} SpotSize requiredSize() const override { return SpotSize::Large;  } };

// ---------- spot ----------
class ParkingSpot {
public:
    ParkingSpot(std::string id, int floor, SpotSize size)
        : id_(std::move(id)), floor_(floor), size_(size) {}

    const std::string& id() const { return id_; }
    int floor() const { return floor_; }
    SpotSize size() const { return size_; }

    bool fits(const Vehicle& v) const { return size_ >= v.requiredSize(); }
    bool isFree() const { std::lock_guard<std::mutex> g(m_); return vehicle_ == nullptr; }

    // Check and take, indivisibly — two gates cannot both win.
    bool tryAssign(std::shared_ptr<Vehicle> v) {
        std::lock_guard<std::mutex> g(m_);
        if (vehicle_) return false;
        vehicle_ = std::move(v);
        return true;
    }
    void release() { std::lock_guard<std::mutex> g(m_); vehicle_.reset(); }

private:
    std::string id_;
    int floor_;
    SpotSize size_;
    std::shared_ptr<Vehicle> vehicle_;
    mutable std::mutex m_;
};

struct Ticket {
    std::string id;
    std::shared_ptr<Vehicle> vehicle;
    ParkingSpot* spot;
    long entryMinutes;                       // minutes since opening — keeps the demo simple
    TicketStatus status = TicketStatus::Active;
};

// ---------- rule 1: which spot? ----------
class SpotAllocationStrategy {
public:
    virtual ~SpotAllocationStrategy() = default;
    virtual ParkingSpot* findSpot(std::vector<ParkingSpot>& spots, const Vehicle& v) = 0;
protected:
    static std::vector<ParkingSpot*> candidates(std::vector<ParkingSpot>& spots, const Vehicle& v) {
        std::vector<ParkingSpot*> fits;
        for (auto& s : spots)
            if (s.isFree() && s.fits(v)) fits.push_back(&s);
        if (fits.empty()) return fits;
        auto best = (*std::min_element(fits.begin(), fits.end(),
            [](auto* a, auto* b) { return a->size() < b->size(); }))->size();
        std::vector<ParkingSpot*> pool;
        for (auto* s : fits) if (s->size() == best) pool.push_back(s);
        return pool;                          // smallest size that fits
    }
};

class NearestFirst : public SpotAllocationStrategy {
public:
    ParkingSpot* findSpot(std::vector<ParkingSpot>& spots, const Vehicle& v) override {
        auto pool = candidates(spots, v);
        if (pool.empty()) return nullptr;
        return *std::min_element(pool.begin(), pool.end(), [](auto* a, auto* b) {
            return a->floor() != b->floor() ? a->floor() < b->floor() : a->id() < b->id();
        });
    }
};

class SpreadOut : public SpotAllocationStrategy {
public:
    ParkingSpot* findSpot(std::vector<ParkingSpot>& spots, const Vehicle& v) override {
        auto pool = candidates(spots, v);
        if (pool.empty()) return nullptr;
        std::unordered_map<int, int> free;
        for (auto& s : spots) if (s.isFree()) free[s.floor()]++;
        return *std::max_element(pool.begin(), pool.end(), [&](auto* a, auto* b) {
            return free[a->floor()] < free[b->floor()];
        });
    }
};

// ---------- rule 2: how much? ----------
class PricingStrategy {
public:
    virtual ~PricingStrategy() = default;
    virtual long fee(const Ticket& t, long exitMinutes) const = 0;   // in paise
protected:
    static long startedHours(const Ticket& t, long exitMinutes) {
        long mins = exitMinutes - t.entryMinutes;
        return std::max(1L, (mins + 59) / 60);       // 61 min == 2 h, never zero
    }
};

class HourlyRate : public PricingStrategy {
public:
    long fee(const Ticket& t, long exitMinutes) const override {
        long rate = t.vehicle->type() == VehicleType::Bike ? 1000
                  : t.vehicle->type() == VehicleType::Car  ? 2000 : 3000;
        return startedHours(t, exitMinutes) * rate;
    }
};

class SlabRate : public PricingStrategy {
public:
    long fee(const Ticket& t, long exitMinutes) const override {
        long h = startedHours(t, exitMinutes);
        return h <= 2 ? 5000 : 5000 + (h - 2) * 1500;
    }
};

struct LotFull : std::runtime_error {
    explicit LotFull(const std::string& what) : std::runtime_error(what) {}
};

// ---------- the front door ----------
class ParkingLot {
public:
    ParkingLot(std::vector<ParkingSpot> spots,
               std::unique_ptr<SpotAllocationStrategy> a,
               std::unique_ptr<PricingStrategy> p)
        : spots_(std::move(spots)), allocation_(std::move(a)), pricing_(std::move(p)) {}

    void setPricing(std::unique_ptr<PricingStrategy> p) { pricing_ = std::move(p); }

    Ticket park(std::shared_ptr<Vehicle> v, long nowMinutes) {
        for (int attempt = 0; attempt < 3; ++attempt) {
            ParkingSpot* spot = allocation_->findSpot(spots_, *v);
            if (!spot) throw LotFull("No free spot for that vehicle");
            if (spot->tryAssign(v)) {                 // lost the race? loop and pick another
                Ticket t{"T-" + std::to_string(++seq_), v, spot, nowMinutes};
                open_[t.id] = t;
                return t;
            }
        }
        throw LotFull("No free spot for that vehicle");
    }

    long unpark(const std::string& ticketId, long exitMinutes) {
        auto it = open_.find(ticketId);
        if (it == open_.end()) throw std::invalid_argument("Unknown or already-closed ticket");
        Ticket t = it->second;
        open_.erase(it);                              // erase == cannot be billed twice
        long amount = pricing_->fee(t, exitMinutes);
        t.spot->release();
        return amount;
    }

    long availableSpots(SpotSize size) const {
        long n = 0;
        for (const auto& s : spots_) if (s.isFree() && s.size() == size) ++n;
        return n;
    }

private:
    std::vector<ParkingSpot> spots_;
    std::unordered_map<std::string, Ticket> open_;
    std::unique_ptr<SpotAllocationStrategy> allocation_;
    std::unique_ptr<PricingStrategy> pricing_;
    int seq_ = 0;
};

int main() {
    std::vector<std::vector<SpotSize>> layout = {
        {SpotSize::Small, SpotSize::Small, SpotSize::Medium, SpotSize::Medium, SpotSize::Large},
        {SpotSize::Small, SpotSize::Medium, SpotSize::Medium, SpotSize::Large, SpotSize::Large}};

    std::vector<ParkingSpot> spots;
    for (size_t f = 0; f < layout.size(); ++f)
        for (size_t i = 0; i < layout[f].size(); ++i)
            spots.emplace_back("F" + std::to_string(f + 1) + "-" + std::to_string(i + 1),
                               static_cast<int>(f), layout[f][i]);

    ParkingLot lot(std::move(spots), std::make_unique<NearestFirst>(), std::make_unique<HourlyRate>());

    auto bike = lot.park(std::make_shared<Bike>("KA-01-0001"), 0);
    auto car = lot.park(std::make_shared<Car>("KA-05-1007"), 0);
    auto truck = lot.park(std::make_shared<Truck>("KA-09-4242"), 0);
    std::cout << "parked -> " << bike.spot->id() << ", " << car.spot->id()
              << ", " << truck.spot->id() << "\\n";
    std::cout << "free MEDIUM spots: " << lot.availableSpots(SpotSize::Medium) << "\\n";

    std::cout << "car bill  = " << lot.unpark(car.id, 180) << " paise\\n";

    lot.setPricing(std::make_unique<SlabRate>());     // <-- the follow-up, one line
    std::cout << "bike bill = " << lot.unpark(bike.id, 180) << " paise\\n";

    try {
        for (int i = 0; i < 5; ++i) lot.park(std::make_shared<Truck>("KA-09-90"), 0);
    } catch (const LotFull& e) {
        std::cout << "rejected  -> " << e.what() << "\\n";
    }
}`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "parking-lot.ts",
        code: `type VehicleType = "BIKE" | "CAR" | "TRUCK";
enum SpotSize { SMALL = 0, MEDIUM = 1, LARGE = 2 }   // numeric so the comparison is the fit rule
type TicketStatus = "ACTIVE" | "PAID" | "LOST";

// ---------- vehicles ----------
abstract class Vehicle {
  constructor(readonly plate: string, readonly type: VehicleType) {}
  abstract get requiredSize(): SpotSize;
}
class Bike extends Vehicle {
  constructor(plate: string) { super(plate, "BIKE"); }
  get requiredSize() { return SpotSize.SMALL; }
}
class Car extends Vehicle {
  constructor(plate: string) { super(plate, "CAR"); }
  get requiredSize() { return SpotSize.MEDIUM; }
}
class Truck extends Vehicle {
  constructor(plate: string) { super(plate, "TRUCK"); }
  get requiredSize() { return SpotSize.LARGE; }
}

// ---------- spot ----------
class ParkingSpot {
  private vehicle: Vehicle | null = null;
  constructor(readonly id: string, readonly floor: number, readonly size: SpotSize) {}

  get isFree(): boolean { return this.vehicle === null; }
  fits(v: Vehicle): boolean { return this.size >= v.requiredSize; }

  /** One event loop, so this really is atomic here — on a worker pool it would need a lock. */
  tryAssign(v: Vehicle): boolean {
    if (this.vehicle !== null) return false;
    this.vehicle = v;
    return true;
  }
  release(): void { this.vehicle = null; }
}

interface Ticket {
  id: string;
  vehicle: Vehicle;
  spot: ParkingSpot;
  entryAt: Date;
  status: TicketStatus;
}

// ---------- rule 1: which spot? ----------
interface SpotAllocationStrategy {
  findSpot(spots: ParkingSpot[], v: Vehicle): ParkingSpot | null;
}

function candidates(spots: ParkingSpot[], v: Vehicle): ParkingSpot[] {
  const fits = spots.filter((s) => s.isFree && s.fits(v));
  if (fits.length === 0) return [];
  const best = Math.min(...fits.map((s) => s.size));   // smallest size that fits
  return fits.filter((s) => s.size === best);
}

class NearestFirst implements SpotAllocationStrategy {
  findSpot(spots: ParkingSpot[], v: Vehicle) {
    return candidates(spots, v)
      .sort((a, b) => a.floor - b.floor || a.id.localeCompare(b.id))[0] ?? null;
  }
}

class SpreadOut implements SpotAllocationStrategy {
  findSpot(spots: ParkingSpot[], v: Vehicle) {
    const free = new Map<number, number>();
    for (const s of spots) if (s.isFree) free.set(s.floor, (free.get(s.floor) ?? 0) + 1);
    return candidates(spots, v)
      .sort((a, b) => (free.get(b.floor) ?? 0) - (free.get(a.floor) ?? 0) || a.floor - b.floor)[0] ?? null;
  }
}

// ---------- rule 2: how much? ----------
interface PricingStrategy {
  fee(t: Ticket, exitAt: Date): number;   // in paise — integers only
}

function startedHours(t: Ticket, exitAt: Date): number {
  const minutes = (exitAt.getTime() - t.entryAt.getTime()) / 60000;
  return Math.max(1, Math.ceil(minutes / 60));        // 61 min === 2 h, never zero
}

class HourlyRate implements PricingStrategy {
  private static readonly RATE: Record<VehicleType, number> = { BIKE: 1000, CAR: 2000, TRUCK: 3000 };
  fee(t: Ticket, exitAt: Date) { return startedHours(t, exitAt) * HourlyRate.RATE[t.vehicle.type]; }
}

class SlabRate implements PricingStrategy {
  fee(t: Ticket, exitAt: Date) {
    const h = startedHours(t, exitAt);
    return h <= 2 ? 5000 : 5000 + (h - 2) * 1500;
  }
}

class LotFullError extends Error {}

// ---------- the front door ----------
class ParkingLot {
  private readonly open = new Map<string, Ticket>();
  private seq = 0;

  constructor(
    private readonly spots: ParkingSpot[],
    private allocation: SpotAllocationStrategy,
    private pricing: PricingStrategy,
  ) {}

  setAllocation(a: SpotAllocationStrategy) { this.allocation = a; }
  setPricing(p: PricingStrategy) { this.pricing = p; }

  park(vehicle: Vehicle, now: Date): Ticket {
    for (let attempt = 0; attempt < 3; attempt++) {
      const spot = this.allocation.findSpot(this.spots, vehicle);
      if (!spot) throw new LotFullError(\`No free spot for a \${vehicle.type}\`);
      if (spot.tryAssign(vehicle)) {                  // lost the race? loop and pick another
        const ticket: Ticket = {
          id: \`T-\${++this.seq}\`, vehicle, spot, entryAt: now, status: "ACTIVE",
        };
        this.open.set(ticket.id, ticket);
        return ticket;
      }
    }
    throw new LotFullError(\`No free spot for a \${vehicle.type}\`);
  }

  unpark(ticketId: string, exitAt: Date): number {
    const ticket = this.open.get(ticketId);
    if (!ticket) throw new Error(\`Unknown or already-closed ticket: \${ticketId}\`);
    this.open.delete(ticketId);                       // delete == cannot be billed twice
    const amount = this.pricing.fee(ticket, exitAt);
    ticket.status = "PAID";
    ticket.spot.release();
    return amount;
  }

  availableSpots(size: SpotSize): number {
    return this.spots.filter((s) => s.isFree && s.size === size).length;
  }
}

// ---------- the demo that has to run ----------
const layout: SpotSize[][] = [
  [SpotSize.SMALL, SpotSize.SMALL, SpotSize.MEDIUM, SpotSize.MEDIUM, SpotSize.LARGE],
  [SpotSize.SMALL, SpotSize.MEDIUM, SpotSize.MEDIUM, SpotSize.LARGE, SpotSize.LARGE],
];
const spots = layout.flatMap((row, f) =>
  row.map((size, i) => new ParkingSpot(\`F\${f + 1}-\${i + 1}\`, f, size)),
);

const lot = new ParkingLot(spots, new NearestFirst(), new HourlyRate());
const nine = new Date("2026-01-01T09:00:00Z");
const plus = (h: number) => new Date(nine.getTime() + h * 3600_000);

const bike = lot.park(new Bike("KA-01-0001"), nine);
const car = lot.park(new Car("KA-05-1007"), nine);
const truck = lot.park(new Truck("KA-09-4242"), nine);
console.log("parked ->", bike.spot.id, car.spot.id, truck.spot.id);
console.log("free MEDIUM spots:", lot.availableSpots(SpotSize.MEDIUM));

console.log("car bill  =", lot.unpark(car.id, plus(3)), "paise");

lot.setPricing(new SlabRate());                       // <-- the follow-up, one line
console.log("bike bill =", lot.unpark(bike.id, plus(3)), "paise");

try {
  for (let i = 0; i < 5; i++) lot.park(new Truck(\`KA-09-90\${i}\`), nine);
} catch (e) {
  console.log("rejected  ->", (e as Error).message);
}`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The follow-ups, and a one-sentence answer for each" },
      {
        type: "p",
        text: "You will be asked at least three of these. Rehearse the answers until they are boring — the calm, fast answer is the one that scores.",
      },
      {
        type: "ul",
        items: [
          "**“How do you handle 5,000 spots?”** — Keep a free-list per `(floor, size)` instead of scanning every spot. Allocation drops from O(n) to O(1). Say it; only build it if there is time.",
          "**“Multiple entry and exit gates?”** — Gates are just callers of the same lot. The interesting part is concurrency, and `tryAssign` already handles it.",
          "**“What if someone loses their ticket?”** — `TicketStatus.LOST` plus a flat penalty rate. It is a new `PricingStrategy`, which is a nice thing to be able to say.",
          "**“Reserve a spot in advance?”** — Reservation is a third state on the spot (`FREE / RESERVED / OCCUPIED`) with an expiry. Warn them this changes the model — the spot is no longer a simple free/taken boolean.",
          "**“Different rates per floor?”** — The pricing strategy already receives the ticket, and the ticket knows its spot, which knows its floor. Zero model change.",
          "**“Would you persist this?”** — A `ParkingLotRepository` behind an interface, in-memory today, SQL tomorrow. See [[repository]] — naming it takes four seconds and shows you know where the seam goes.",
        ],
      },
      { type: "h", text: "Where this design would genuinely stop working" },
      {
        type: "ul",
        items: [
          "**Many lots in many cities.** The single in-memory `ParkingLot` becomes a service per lot with its own store. That is a high-level design conversation, not this round.",
          "**Real money.** Payments need idempotency, retries and a reconciliation trail. The moment payments are in scope, `unpark` returning a `long` is not enough.",
          "**Sensors instead of gates.** If occupancy comes from hardware events rather than `park()` calls, the lot becomes an event consumer and the ticket stops being the source of truth. Different problem; see [[pub-sub-event-driven]].",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Get `park` → `Ticket` → `unpark` → bill running end-to-end before you make anything pluggable.** A working system that you then refactor for ten minutes always beats a perfectly abstract system that never printed a line.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Every class maps to something you can point at in a real car park — the design explains itself with no glossary.",
        "The two rules most likely to change (spot choice, pricing) are interfaces, so the classic follow-ups cost one new class and zero edits.",
        "`unpark(id, exitAt)` takes time as a parameter, so the entire billing system is unit-testable without waiting or mocking a clock.",
        "`tryAssign` makes check-and-take atomic on the *spot*, so multiple gates work without serialising the whole lot.",
        "Small enough to actually finish in 60 minutes, with a `main()` that prints real output.",
      ],
      cons: [
        "Allocation scans every spot — fine for hundreds, wrong for tens of thousands without a per-size free-list.",
        "`ParkingFloor` is close to a pass-through in a small lot; keeping it can read as ceremony until multi-floor rules actually exist.",
        "Everything is in memory. A restart forgets every open ticket, so real deployments need persistence this design does not have.",
        "Two strategy interfaces is the right amount of pattern here — but the same instinct, applied to every class, is exactly how this problem gets over-engineered.",
        "Vehicle-size and spot-size as one ordered scale breaks down the moment a spot has features (EV charger, handicapped, valet-only) as well as a size.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "Strategy pattern — Refactoring Guru",
        href: "https://refactoring.guru/design-patterns/strategy",
        kind: "docs",
        note: "The pattern behind both swappable rules in this design, with diagrams in a dozen languages.",
      },
      {
        label: "awesome-low-level-design — Parking Lot",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/parking-lot.md",
        kind: "article",
        note: "A second, independent take on the same problem — worth diffing against your own model.",
      },
      {
        label: "Low Level Design Primer",
        href: "https://github.com/prasadgujar/low-level-design-primer",
        kind: "article",
        note: "A broad catalogue of machine-coding problems and solutions; good for the next problems after this one.",
      },
      {
        label: "Design a Parking Lot — asked at Google and Facebook",
        href: "https://www.youtube.com/watch?v=DSGsa0pu8-k",
        kind: "video",
        note: "Watch how the clarifying questions are asked out loud. The talking is most of the score.",
      },
      {
        label: "Grokking the Object Oriented Design Interview",
        href: "https://www.designgurus.io/course/grokking-the-object-oriented-design-interview",
        kind: "book",
        note: "The course that made this problem the canonical warm-up; parking lot is its opening case study.",
      },
      {
        label: "Anemic Domain Model — Martin Fowler",
        href: "https://martinfowler.com/bliki/AnemicDomainModel.html",
        kind: "article",
        note: "Why a ParkingSpot full of getters and setters, with all the logic in ParkingLot, is the anti-pattern to avoid.",
      },
      {
        label: "Value Object — Martin Fowler",
        href: "https://martinfowler.com/bliki/ValueObject.html",
        kind: "article",
        note: "The case for a small Money type instead of a double — and for an immutable Ticket.",
      },
      {
        label: "ReentrantLock — Java API docs",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html",
        kind: "docs",
        note: "If you want per-spot locking with a timeout instead of the synchronized block used here.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "parking-lot-q1",
        question: "A bike arrives. Three SMALL spots, two MEDIUM and one LARGE are free. Which spot should the lot hand out?",
        options: [
          { id: "a", label: "A SMALL spot — the smallest free size that fits, so the bigger spots stay available for bigger vehicles." },
          { id: "b", label: "The LARGE spot — bigger is always safer for the driver." },
          { id: "c", label: "Any free spot at random, since the bike physically fits in all of them." },
          { id: "d", label: "A MEDIUM spot, to keep both extremes free." },
        ],
        correctOptionId: "a",
        explanation:
          "The fit rule is `spot.size >= vehicle.requiredSize`, but among everything that fits you take the SMALLEST. Otherwise three bikes can consume your truck spots and a truck gets turned away from a lot that is mostly empty. In the prototype this is the blue-then-orange narrowing on beats 2 and 3.",
      },
      {
        id: "parking-lot-q2",
        question: "Why does `unpark(ticketId, exitAt)` take the exit time as a parameter instead of calling the clock inside?",
        options: [
          { id: "a", label: "So billing can be tested instantly for any duration — no sleeping, no clock mocking." },
          { id: "b", label: "Because reading the system clock is too slow to do inside a method." },
          { id: "c", label: "Because the ticket does not store an entry time." },
          { id: "d", label: "It is only a style preference; both versions are equally testable." },
        ],
        correctOptionId: "a",
        explanation:
          "Passing time in makes `fee()` a pure function of (ticket, exitAt) — a three-hour bill is a one-line test. A method that reads `now()` internally can only be tested by waiting or by injecting a fake clock, and in a 60-minute round you will do neither.",
      },
      {
        id: "parking-lot-q3",
        question: "The interviewer says: “Now charge a different rate on weekends.” What should your answer be?",
        options: [
          { id: "a", label: "Add a `WeekendRate implements PricingStrategy` class and wire it in — no existing code is edited." },
          { id: "b", label: "Add an `if (isWeekend)` branch inside `unpark()`." },
          { id: "c", label: "Add a `weekendRate` field to `Ticket` and read it when billing." },
          { id: "d", label: "Add a boolean parameter to `unpark()` and branch on it." },
        ],
        correctOptionId: "a",
        explanation:
          "This is precisely why pricing is an interface. A new rule is a new class; `unpark()` is never reopened. The other three all edit working code to add a variation, which is the Open/Closed violation the question is testing for.",
      },
      {
        id: "parking-lot-q4",
        question: "Two entry gates process arrivals at the same instant and both read that spot F1-03 is free. What is the correct fix?",
        options: [
          { id: "a", label: "Make check-and-take one atomic operation on the spot (`tryAssign`), and let the loser retry for another spot." },
          { id: "b", label: "Mark `park()` on the ParkingLot as synchronized so only one vehicle can ever enter at a time." },
          { id: "c", label: "Have each gate keep its own copy of the spot list and reconcile them later." },
          { id: "d", label: "Nothing — the window is so small it will not happen in practice." },
        ],
        correctOptionId: "a",
        explanation:
          "Locking the whole lot (b) is correct but serialises every gate in the building. Locking the *spot* means only cars competing for the same space contend, and a loser simply asks the strategy for another spot. (c) creates two sources of truth, and (d) is how you ship a double-booking.",
      },
      {
        id: "parking-lot-q5",
        question: "What does the Ticket need to carry for billing to work at all?",
        options: [
          { id: "a", label: "The entry timestamp — every fee is derived from it and the exit time." },
          { id: "b", label: "The running total, updated every minute while the vehicle is parked." },
          { id: "c", label: "The driver's payment details, captured at entry." },
          { id: "d", label: "The list of all spots that were free when the vehicle arrived." },
        ],
        correctOptionId: "a",
        explanation:
          "The fee is computed once, at exit, from `entryAt` and `exitAt`. Nothing recalculates while the car sits there — press ⏩ +1 hour in the prototype and the number moves purely because the *exit* side of that subtraction moved.",
      },
      {
        id: "parking-lot-q6",
        question: "You are at minute 45 with `park()` working, `unpark()` half-written, and no strategy interfaces yet. What do you do?",
        options: [
          { id: "a", label: "Finish `unpark()` and the `main()` demo so the system runs end-to-end, then mention the strategies verbally." },
          { id: "b", label: "Extract both strategy interfaces first — the design score matters more than running code." },
          { id: "c", label: "Start over with a cleaner class hierarchy now that you understand the problem." },
          { id: "d", label: "Add persistence so the design looks production-ready." },
        ],
        correctOptionId: "a",
        explanation:
          "Machine coding is graded on working code first. A complete park → bill loop plus “here is where I would extract the strategies, one class each” scores well above an elegantly abstract program that never printed a line. Freeze the feature list at minute 45.",
      },
      {
        id: "parking-lot-q7",
        question: "Why model `SpotSize` as an ordered enum (SMALL < MEDIUM < LARGE) rather than as free-form strings?",
        options: [
          { id: "a", label: "Because the fit rule becomes a single comparison, and typos like \"medum\" stop compiling." },
          { id: "b", label: "Because enums use less memory than strings at runtime." },
          { id: "c", label: "Because Java requires enums for any field used in a comparison." },
          { id: "d", label: "Because it lets a spot hold more than one vehicle." },
        ],
        correctOptionId: "a",
        explanation:
          "Ordering is the point: `spot.size >= vehicle.requiredSize` *is* the fit rule, in one expression. Strings give you no ordering, no exhaustiveness, and a whole family of typo bugs the compiler would otherwise catch for free.",
      },
      {
        id: "parking-lot-q8",
        question: "Which of these is the clearest sign that a parking-lot solution is over-engineered?",
        options: [
          { id: "a", label: "A `ParkingLotFactoryProvider` and an `IParkingService` exist before a single `park()` call works." },
          { id: "b", label: "There are two strategy interfaces — one for allocation, one for pricing." },
          { id: "c", label: "`Vehicle` is abstract with `Bike`, `Car` and `Truck` subclasses." },
          { id: "d", label: "`ParkingSpot` owns both `fits()` and `tryAssign()`." },
        ],
        correctOptionId: "a",
        explanation:
          "Abstractions must be paid for by a real, named force — “pricing will change” justifies a strategy; “factories are good practice” justifies nothing. (b), (c) and (d) each answer a concrete requirement in the problem statement. See the pattern-overuse lesson for the full smell test.",
      },
    ],
  },
};
