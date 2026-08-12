import type { RoadmapLesson } from "@/lib/content/types";

export const rideSharing: RoadmapLesson = {
  title: "Ride sharing (Uber / Ola)",
  oneLiner:
    "A rider taps one button and, out of fifty thousand drivers, exactly one car has to be found, offered the ride, and — if they do not answer in fifteen seconds — replaced. This problem is graded on **matching**: how you find the nearby drivers without looking at all of them, how you offer the ride to one driver at a time instead of shouting at twenty, and what stops two riders from being matched to the same car.",
  difficulty: "advanced",
  estimatedTime: "45 min",
  prototypePath: "/prototypes/lld/ride-sharing.html",
  content: {
    prototypeCaption:
      "A toy city with fourteen cars and a visible cell grid. Start with the **🔍 Scan everyone** / **🧭 Grid lookup** toggle and watch the `checked` counter — 14 in scan mode, 3 in grid mode, and the gap widens every request. Then press **🚕 Request ride** and follow the beats: the 3×3 neighbourhood shades, a ranked candidate list appears, and driver #1 gets a **15-second countdown**. Press **⏱ Let the offer time out** and **🙅 Driver declines** to watch the offer walk down to #2 and #3. Finish with **⚔️ Two riders, one driver** under **🔓 Unguarded** — both riders get the same car and a red `⚠ double-matched: 1` appears — then flip to **🔒 Guarded** and run it again.",

    // ==================================================================
    overview: [
      {
        type: "p",
        text: "*“Design a ride-hailing service like Uber.”* That is the whole prompt. It is deliberately enormous, and the first thing being graded is whether you cut it down to something you can actually build in ninety minutes.",
      },
      {
        type: "p",
        text: "Almost everyone starts drawing `Rider`, `Driver`, `Trip`, `Payment`, `Rating`, `Notification`. That is a list, not a design. The problem has exactly one hard part, and it is this: **a rider taps a button, and out of fifty thousand drivers, one specific driver must be found, offered the ride, and — if they do not answer in fifteen seconds — replaced.**",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole lesson in one line",
        text: "**Matching is the problem. Everything else is paperwork.** Three things make matching work: you *partition space* so you never look at every driver, you *offer to one driver at a time with a deadline* instead of broadcasting, and you *flip the driver's state atomically* so two riders can never win the same car. Get those three right and the rest of the round is bookkeeping you can do half-asleep.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 356" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A city block seen from above. A person stands at a street corner holding a phone, and six cars are scattered across the surrounding streets. Every noun is labelled with the class it becomes: the person is Rider, each car is a Driver holding a Vehicle, every pin position is a Location, the tap on the phone is a RideRequest, the highlighted line joining the chosen car to the person is a Ride, and the receipt at the right is a Fare stored in integer paise.">
  <defs>
    <marker id="rs-scene-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="rs-scene-pick" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
  </defs>

  <rect x="150" y="34" width="380" height="288" rx="10" fill="none" stroke="#2d333d" stroke-width="1.2"/>
  <line x1="150" y1="130" x2="530" y2="130" stroke="#232830" stroke-width="9"/>
  <line x1="150" y1="236" x2="530" y2="236" stroke="#232830" stroke-width="9"/>
  <line x1="268" y1="34" x2="268" y2="322" stroke="#232830" stroke-width="9"/>
  <line x1="408" y1="34" x2="408" y2="322" stroke="#232830" stroke-width="9"/>
  <text x="162" y="52" font-size="9" fill="#6b7280">two square kilometres of a city</text>

  <text x="252" y="200" font-size="24">🧍</text>
  <text x="238" y="220" font-size="9" fill="#fb863a">Anita — Rider</text>
  <text x="238" y="234" font-size="8.5" fill="#6b7280">taps “Book a cab”</text>

  <text x="292" y="124" font-size="20">🚕</text>
  <text x="290" y="140" font-size="8" fill="#5cc66f">d3 · 0.4 km</text>
  <text x="180" y="124" font-size="20">🚗</text>
  <text x="172" y="140" font-size="8" fill="#9099a8">d1 · 0.9 km</text>
  <text x="430" y="124" font-size="20">🚗</text>
  <text x="424" y="140" font-size="8" fill="#9099a8">d7 · 1.1 km</text>
  <text x="180" y="292" font-size="20">🚗</text>
  <text x="172" y="308" font-size="8" fill="#6b7280">d5 · on a trip</text>
  <text x="430" y="292" font-size="20">🚗</text>
  <text x="424" y="308" font-size="8" fill="#6b7280">d9 · 3.8 km</text>
  <text x="330" y="72" font-size="20">🚗</text>
  <text x="322" y="88" font-size="8" fill="#6b7280">d2 · offline</text>

  <line x1="292" y1="132" x2="272" y2="186" stroke="#5cc66f" stroke-width="1.6" stroke-dasharray="4 3" marker-end="url(#rs-scene-pick)"/>
  <text x="300" y="166" font-size="9" fill="#5cc66f">the Ride</text>

  <text x="16" y="80" font-size="11" fill="#fb863a">Rider</text>
  <text x="16" y="96" font-size="9" fill="#9099a8">id, name, rating</text>
  <line x1="120" y1="88" x2="240" y2="192" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#rs-scene-lead)"/>

  <text x="16" y="140" font-size="11" fill="#fb863a">Driver + Vehicle</text>
  <text x="16" y="156" font-size="9" fill="#9099a8">a person AND a car —</text>
  <text x="16" y="170" font-size="9" fill="#9099a8">plate, model, seats, class</text>
  <line x1="120" y1="132" x2="174" y2="118" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#rs-scene-lead)"/>

  <text x="16" y="214" font-size="11" fill="#fb863a">Location</text>
  <text x="16" y="230" font-size="9" fill="#9099a8">lat, lng — and the cell</text>
  <text x="16" y="244" font-size="9" fill="#9099a8">it currently lives in</text>

  <text x="16" y="288" font-size="11" fill="#fb863a">RideRequest</text>
  <text x="16" y="304" font-size="9" fill="#9099a8">rider, pickup, drop, class</text>
  <text x="16" y="318" font-size="9" fill="#6b7280">the tap — not the trip</text>

  <text x="556" y="80" font-size="11" fill="#5cc66f">Ride</text>
  <text x="556" y="96" font-size="9" fill="#9099a8">rider + driver + the</text>
  <text x="556" y="110" font-size="9" fill="#9099a8">state machine below</text>
  <line x1="548" y1="88" x2="310" y2="146" stroke="#5cc66f" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#rs-scene-pick)"/>

  <text x="556" y="146" font-size="11" fill="#5e9ff6">Fare</text>
  <rect x="556" y="156" width="168" height="118" rx="7" fill="#14161a" stroke="rgba(94,159,246,0.45)"/>
  <text x="568" y="176" font-size="9" fill="#9099a8">base        5000</text>
  <text x="568" y="194" font-size="9" fill="#9099a8">6.4 km      7680</text>
  <text x="568" y="212" font-size="9" fill="#9099a8">18 min      2700</text>
  <text x="568" y="230" font-size="9" fill="#fb863a">surge ×1.8 +12304</text>
  <line x1="568" y1="240" x2="712" y2="240" stroke="#2d333d"/>
  <text x="568" y="258" font-size="10.5" fill="#5e9ff6">total      27700</text>
  <text x="568" y="270" font-size="8" fill="#6b7280">paise. never a double.</text>

  <text x="556" y="300" font-size="9" fill="#6b7280">GeoIndex, MatchingStrategy and</text>
  <text x="556" y="314" font-size="9" fill="#6b7280">PricingStrategy are not in the</text>
  <text x="556" y="328" font-size="9" fill="#6b7280">picture — they are the answer.</text>
</svg>`,
        caption:
          "Every noun in the scene is a class you will write. But notice the last line on the right: the three things that actually decide whether this design works — **GeoIndex**, **MatchingStrategy**, **PricingStrategy** — are invisible in the real-world picture. That is why listing nouns is not designing.",
      },
      {
        type: "p",
        text: "Here is the naive matcher that almost every candidate writes first, and it is the exact thing the round is testing:",
      },
      {
        type: "code",
        language: "java",
        filename: "the loop that loses the round",
        code: `// Find a driver for this rider.
for (Driver d : allDrivers) {                 // <- 50,000 iterations
    if (d.state == AVAILABLE && distance(d.location, pickup) < 3000) {
        candidates.add(d);
    }
}
// ...and this runs on EVERY ride request, in a city that has
// hundreds of ride requests per second. It is O(all drivers), forever.`,
      },
      {
        type: "p",
        text: "It works. It is also the wrong shape, and the interviewer will ask *“what happens at fifty thousand drivers?”* the moment you type it. The fix is not a faster loop — it is **not looking at most of the drivers at all**.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Did you partition space?** A `Map<CellId, Set<Driver>>` and a search over the rider's cell plus its eight neighbours. If your answer to *“how do you find nearby drivers”* is a loop over a list, the rest of the round is uphill.",
          "**Does the index survive movement?** Drivers move every four seconds. `updateLocation()` must be *remove from the old cell, add to the new cell* — O(1). If you reached for a sorted list, say why you did not.",
          "**Is the ride offered to one driver at a time, with a deadline?** Broadcasting to twenty drivers is the tempting wrong answer, and it recreates the double-booking problem you were trying to avoid.",
          "**Is “one driver, one ride” enforced by a compare-and-set?** Two ride requests can pick the same nearest driver in the same millisecond. Only an atomic `AVAILABLE → OFFERED` flip decides which one wins ([[atomic-operations-and-cas]]).",
          "**Is money an integer, and is surge a swappable rule?** Fare is `base + per-km + per-minute`, multiplied by a surge factor, in **paise**, behind a `PricingStrategy` ([[strategy]]) so a new pricing rule costs one class and zero edits to the matcher.",
          "**Does it run?** A `main()` that requests a ride, watches driver #1 time out, offers #2, accepts, completes, and prints a fare breakdown. Plus the failure path: no cars available.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 250" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A two column scope board for the ninety minute round. In scope: riders, drivers and vehicles, a cell based geo index with ring expansion, sequential offers with a fifteen second timeout, an atomic driver state flip, the ride state machine, and fare as an integer paise breakdown with a swappable surge rule. Out of scope: maps and turn by turn routing, real payments, authentication, push notification delivery, driver onboarding, and the mobile user interface.">
  <text x="20" y="24" font-size="10.5" fill="#5cc66f">✓ IN — build these, in this order</text>
  <rect x="20" y="34" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="58" font-size="10" fill="#e8e4dc">Rider · Driver · Vehicle · Location</text>
  <text x="38" y="80" font-size="10" fill="#fb863a">GeoIndex — cells + ring expansion</text>
  <text x="38" y="102" font-size="10" fill="#fb863a">sequential offers, 15s deadline</text>
  <text x="38" y="124" font-size="10" fill="#fb863a">atomic AVAILABLE → OFFERED flip</text>
  <text x="38" y="146" font-size="10" fill="#e8e4dc">Ride state machine + cancellation</text>
  <text x="38" y="168" font-size="10" fill="#e8e4dc">Fare breakdown in integer paise</text>
  <text x="38" y="190" font-size="10" fill="#e8e4dc">MatchingStrategy · PricingStrategy</text>
  <text x="38" y="214" font-size="9" fill="#6b7280">the three orange lines are the whole grade</text>

  <text x="364" y="24" font-size="10.5" fill="#f06868">✗ OUT — one sentence each, then move on</text>
  <rect x="364" y="34" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="382" y="58" font-size="10" fill="#9099a8">maps, turn-by-turn, ETA prediction</text>
  <text x="382" y="80" font-size="10" fill="#9099a8">real payments and refunds</text>
  <text x="382" y="102" font-size="10" fill="#9099a8">login, KYC, driver onboarding</text>
  <text x="382" y="124" font-size="10" fill="#9099a8">push delivery, SMS, the socket layer</text>
  <text x="382" y="146" font-size="10" fill="#9099a8">persistence and schema design</text>
  <text x="382" y="168" font-size="10" fill="#9099a8">the mobile UI, driver app screens</text>
  <line x1="382" y1="182" x2="662" y2="182" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="202" font-size="9.5" fill="#6b7280">“Routing is a RouteService interface with a</text>
  <text x="382" y="216" font-size="9.5" fill="#6b7280">straight-line stub” is a complete answer.</text>
</svg>`,
        caption:
          "Say the right-hand column out loud in the first three minutes. Then never mention it again. The three orange lines on the left are the only things anyone remembers about your answer.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 288" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A table mapping the nouns in the prompt to the classes they become. A person who books becomes Rider. A person who drives becomes Driver with a state field. The car itself becomes Vehicle, separate from Driver because one driver may swap cars. A point on the map becomes Location. The tap on the book button becomes RideRequest. The agreed trip becomes Ride with its own state machine. The money becomes Fare, a breakdown in integer paise. Nearby drivers becomes GeoIndex, which is the only row that is not a noun from the prompt.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">the prompt says … → you write …</text>

  <rect x="20" y="32" width="660" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="50" font-size="9" fill="#6b7280">the word in the prompt</text>
  <text x="250" y="50" font-size="9" fill="#6b7280">the class</text>
  <text x="404" y="50" font-size="9" fill="#6b7280">why it is its own thing</text>

  <rect x="20" y="62" width="660" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="81" font-size="10" fill="#e8e4dc">“a rider books a cab”</text>
  <text x="250" y="81" font-size="10" fill="#fb863a">Rider</text>
  <text x="404" y="81" font-size="9.5" fill="#9099a8">id, name, rating — thin on purpose</text>

  <rect x="20" y="94" width="660" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="113" font-size="10" fill="#e8e4dc">“a driver accepts”</text>
  <text x="250" y="113" font-size="10" fill="#fb863a">Driver</text>
  <text x="404" y="113" font-size="9.5" fill="#5cc66f">holds THE state — the contended resource</text>

  <rect x="20" y="126" width="660" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="145" font-size="10" fill="#e8e4dc">“a car arrives”</text>
  <text x="250" y="145" font-size="10" fill="#fb863a">Vehicle</text>
  <text x="404" y="145" font-size="9.5" fill="#9099a8">plate, seats, class — a driver can swap cars</text>

  <rect x="20" y="158" width="660" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="177" font-size="10" fill="#e8e4dc">“nearby”, “3 km away”</text>
  <text x="250" y="177" font-size="10" fill="#5cc66f">GeoIndex</text>
  <text x="404" y="177" font-size="9.5" fill="#5cc66f">NOT a noun in the prompt — and it is the answer</text>

  <rect x="20" y="190" width="660" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="209" font-size="10" fill="#e8e4dc">“taps the button”</text>
  <text x="250" y="209" font-size="10" fill="#fb863a">RideRequest</text>
  <text x="404" y="209" font-size="9.5" fill="#9099a8">the intent — it may end in no cars found</text>

  <rect x="20" y="222" width="660" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="241" font-size="10" fill="#e8e4dc">“the trip”</text>
  <text x="250" y="241" font-size="10" fill="#fb863a">Ride</text>
  <text x="404" y="241" font-size="9.5" fill="#9099a8">the agreed trip + its state machine</text>

  <rect x="20" y="254" width="660" height="28" rx="5" fill="#14161a" stroke="rgba(94,159,246,0.45)"/>
  <text x="34" y="273" font-size="10" fill="#e8e4dc">“₹277”</text>
  <text x="250" y="273" font-size="10" fill="#5e9ff6">Fare</text>
  <text x="404" y="273" font-size="9.5" fill="#5e9ff6">a breakdown of long paise, not one double</text>
</svg>`,
        caption:
          "Row four is the point of the whole table. **The most important class in this design is not a noun anybody said out loud.** Interviewers watch for exactly this: can you invent the structure the requirements imply but never name? ([[identifying-entities]])",
      },
    ],

    // ==================================================================
    howItWorks: [
      { type: "h", text: "Step 1 · Clarify — 5 minutes" },
      {
        type: "p",
        text: "The prompt is one sentence, so the questions matter more here than in any other problem in this set. Ask these six, in this order, and write the answers on the board.",
      },
      {
        type: "ul",
        items: [
          "**How do I find nearby drivers?** — ask it as *“can I assume I have a geo index, or should I build one?”*. They will say build one. That is the interviewer handing you the actual problem; take it.",
          "**How many drivers are online in a city?** — the number you want is *tens of thousands*. Say it back: *“so a linear scan per request is fifty thousand distance calculations, hundreds of times a second — I will partition space instead.”*",
          "**Do I offer the ride to one driver or many?** — the question that decides your whole dispatch design. Say *“one at a time with a timeout”* and explain why in a sentence.",
          "**What happens when a driver does not respond?** — get them to say a number. Fifteen seconds is the industry answer. Now you have a deadline in your design instead of a vague *“eventually”*.",
          "**Is pricing fixed or dynamic?** — surge is the follow-up they always ask, so pull it forward. *“I will put pricing behind an interface so surge is one class.”*",
          "**Pool rides, scheduled rides, ratings, payments?** — out of scope for the first pass, and each is a two-sentence follow-up you will answer at the end. Say that now so the scope is agreed.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The trap in minute one",
        text: "The instinct is to start with `Ride` and its state machine, because it is the comfortable part. Do not. **A perfect ride state machine with a linear driver scan fails this round.** A rough state machine with a real geo index and a compare-and-set on the driver passes it. Build in the order the grade is in.",
      },

      // ---------------- the grid ----------------
      { type: "h", text: "Step 2 · You cannot scan every driver. Partition space." },
      {
        type: "p",
        text: "Do the arithmetic out loud, because the arithmetic *is* the argument. Fifty thousand drivers online. A ride request arrives. The naive loop does fifty thousand distance calculations, and it does them again for the next request, and the one after that.",
      },
      {
        type: "p",
        text: "Now chop the map into squares. Take a cell of about **0.003 degrees on a side — roughly 330 metres**. A 50 km by 50 km city is 2,500 km², so that is about **28,000 cells**. Fifty thousand drivers spread over 28,000 cells is under two drivers per cell. Look at the rider's cell **plus its eight neighbours** — nine cells, about **16 drivers**. That is the entire change.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 320" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, a dense field of fifty small car dots representing all fifty thousand drivers, every one of them ringed in red to show it was checked, labelled fifty thousand distance calculations per request. On the right, the same map cut into a grid of cells, with only the rider's cell and its eight neighbours shaded orange and only three cars inside them checked, labelled nine cells and about sixteen drivers checked, roughly three thousand times less work.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ for (Driver d : allDrivers)</text>
  <rect x="20" y="32" width="326" height="216" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <circle cx="62" cy="66" r="4" fill="none" stroke="#f06868"/><circle cx="102" cy="58" r="4" fill="none" stroke="#f06868"/><circle cx="146" cy="74" r="4" fill="none" stroke="#f06868"/><circle cx="190" cy="56" r="4" fill="none" stroke="#f06868"/><circle cx="232" cy="70" r="4" fill="none" stroke="#f06868"/><circle cx="276" cy="60" r="4" fill="none" stroke="#f06868"/><circle cx="314" cy="76" r="4" fill="none" stroke="#f06868"/>
  <circle cx="52" cy="104" r="4" fill="none" stroke="#f06868"/><circle cx="94" cy="118" r="4" fill="none" stroke="#f06868"/><circle cx="138" cy="102" r="4" fill="none" stroke="#f06868"/><circle cx="184" cy="120" r="4" fill="none" stroke="#f06868"/><circle cx="226" cy="106" r="4" fill="none" stroke="#f06868"/><circle cx="268" cy="122" r="4" fill="none" stroke="#f06868"/><circle cx="310" cy="108" r="4" fill="none" stroke="#f06868"/>
  <circle cx="66" cy="152" r="4" fill="none" stroke="#f06868"/><circle cx="108" cy="164" r="4" fill="none" stroke="#f06868"/><circle cx="150" cy="148" r="4" fill="none" stroke="#f06868"/><circle cx="196" cy="166" r="4" fill="none" stroke="#f06868"/><circle cx="238" cy="150" r="4" fill="none" stroke="#f06868"/><circle cx="280" cy="168" r="4" fill="none" stroke="#f06868"/><circle cx="318" cy="154" r="4" fill="none" stroke="#f06868"/>
  <circle cx="56" cy="200" r="4" fill="none" stroke="#f06868"/><circle cx="100" cy="212" r="4" fill="none" stroke="#f06868"/><circle cx="144" cy="196" r="4" fill="none" stroke="#f06868"/><circle cx="188" cy="214" r="4" fill="none" stroke="#f06868"/><circle cx="230" cy="198" r="4" fill="none" stroke="#f06868"/><circle cx="272" cy="216" r="4" fill="none" stroke="#f06868"/><circle cx="316" cy="202" r="4" fill="none" stroke="#f06868"/>
  <text x="176" y="140" font-size="20">🧍</text>
  <text x="38" y="238" font-size="9.5" fill="#f06868">every dot ringed = every dot measured</text>

  <text x="374" y="22" font-size="10.5" fill="#5cc66f">✓ geoIndex.near(pickup, ring = 1)</text>
  <rect x="374" y="32" width="326" height="216" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <rect x="482" y="88" width="108" height="108" fill="rgba(251,134,58,0.16)" stroke="none"/>
  <line x1="410" y1="52" x2="410" y2="232" stroke="#2d333d"/><line x1="446" y1="52" x2="446" y2="232" stroke="#2d333d"/><line x1="482" y1="52" x2="482" y2="232" stroke="#2d333d"/><line x1="518" y1="52" x2="518" y2="232" stroke="#2d333d"/><line x1="554" y1="52" x2="554" y2="232" stroke="#2d333d"/><line x1="590" y1="52" x2="590" y2="232" stroke="#2d333d"/><line x1="626" y1="52" x2="626" y2="232" stroke="#2d333d"/><line x1="662" y1="52" x2="662" y2="232" stroke="#2d333d"/>
  <line x1="392" y1="52" x2="680" y2="52" stroke="#2d333d"/><line x1="392" y1="88" x2="680" y2="88" stroke="#2d333d"/><line x1="392" y1="124" x2="680" y2="124" stroke="#2d333d"/><line x1="392" y1="160" x2="680" y2="160" stroke="#2d333d"/><line x1="392" y1="196" x2="680" y2="196" stroke="#2d333d"/><line x1="392" y1="232" x2="680" y2="232" stroke="#2d333d"/>
  <rect x="482" y="88" width="108" height="108" fill="none" stroke="rgba(251,134,58,0.7)" stroke-width="1.6"/>
  <text x="524" y="146" font-size="18">🧍</text>
  <circle cx="500" cy="106" r="4" fill="none" stroke="#5cc66f"/><circle cx="572" cy="178" r="4" fill="none" stroke="#5cc66f"/><circle cx="504" cy="184" r="4" fill="none" stroke="#5cc66f"/>
  <circle cx="428" cy="70" r="4" fill="#3a414c"/><circle cx="466" cy="212" r="4" fill="#3a414c"/><circle cx="644" cy="106" r="4" fill="#3a414c"/><circle cx="608" cy="66" r="4" fill="#3a414c"/><circle cx="648" cy="212" r="4" fill="#3a414c"/><circle cx="410" cy="146" r="4" fill="#3a414c"/><circle cx="612" cy="220" r="4" fill="#3a414c"/><circle cx="428" cy="180" r="4" fill="#3a414c"/>
  <text x="392" y="248" font-size="9" fill="#6b7280">grey dots exist. they are never touched.</text>

  <rect x="20" y="262" width="326" height="44" rx="8" fill="rgba(240,104,104,0.10)" stroke="rgba(240,104,104,0.4)"/>
  <text x="38" y="282" font-size="16" fill="#f06868">50,000 checks</text>
  <text x="38" y="298" font-size="9" fill="#9099a8">per request · O(all drivers)</text>

  <rect x="374" y="262" width="326" height="44" rx="8" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="392" y="282" font-size="16" fill="#5cc66f">~16 checks</text>
  <text x="392" y="298" font-size="9" fill="#9099a8">9 cells × ~1.8 drivers · ~3,000× less work</text>
</svg>`,
        caption:
          "The two numbers at the bottom are the whole section. Say them in the interview with the arithmetic attached — *“28,000 cells, 50,000 drivers, under two per cell, nine cells is about sixteen”* — because a number you can derive sounds different from a number you memorised.",
      },
      {
        type: "code",
        language: "java",
        filename: "the index, in twelve lines",
        code: `/** A geohash by another name: the map chopped into fixed squares. */
final class GeoIndex {
    private static final double CELL_DEG = 0.003;          // ~330 m at the equator

    private final Map<Long, Set<String>> cells = new HashMap<>();   // cell -> driver ids
    private final Map<String, Long> whereIs = new HashMap<>();      // driver id -> cell

    static int row(double lat) { return (int) Math.floor(lat / CELL_DEG); }
    static int col(double lng) { return (int) Math.floor(lng / CELL_DEG); }
    static long cellId(int r, int c) { return ((long) r << 32) | (c & 0xffffffffL); }

    void put(String driverId, Location at) {
        long cell = cellId(row(at.lat()), col(at.lng()));
        Long old = whereIs.get(driverId);
        if (cell == (old == null ? Long.MIN_VALUE : old)) return;   // same cell, nothing to do
        remove(driverId);                                           // O(1) out of the old set
        cells.computeIfAbsent(cell, k -> new HashSet<>()).add(driverId);   // O(1) into the new
        whereIs.put(driverId, cell);
    }

    void remove(String driverId) {
        Long old = whereIs.remove(driverId);
        if (old == null) return;
        Set<String> set = cells.get(old);
        if (set != null && set.remove(driverId) && set.isEmpty()) cells.remove(old);
    }
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Why the cell size is a real trade-off, and what to say about it",
        text: "**Too big** and every cell holds thousands of drivers — you are back to scanning, just with extra steps. **Too small** and the 3×3 neighbourhood covers 60 metres, finds nobody, and you spend every request expanding rings and visiting hundreds of near-empty cells. Around 300–500 m is the sweet spot for a dense city. The honest sentence is: *“the right size depends on driver density, and dense city centres want smaller cells than the suburbs — which is exactly the argument for a quadtree, or S2, or H3, where the cell size adapts. A fixed grid is the right ninety-minute answer and I would name the upgrade path.”*",
      },
      {
        type: "p",
        text: "**Drivers move.** That is the part beginners forget. A driver pings a new location every four seconds, so `updateLocation()` runs tens of thousands of times a second — far more often than `requestRide()`. It has to be cheap.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 300" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A car labelled d7 moves east across a cell boundary from cell three comma four into cell three comma five. Below, the map from cell id to a set of driver ids is shown before and after: before, cell three comma four holds d7 and d3 while cell three comma five holds d9; after, cell three comma four holds only d3 and cell three comma five holds d9 and d7. Two hash set operations, both constant time. To the right, the alternative of a list of drivers sorted by latitude is shown, requiring a remove and a reinsert at a cost of order log n plus a shift, and it still cannot answer a two dimensional query.">
  <defs>
    <marker id="rs-move-a" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <text x="20" y="22" font-size="10.5" fill="#9099a8">d7 drives east and crosses one line on the map</text>

  <rect x="20" y="34" width="110" height="86" rx="4" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="52" font-size="9" fill="#6b7280">cell(3,4)</text>
  <text x="44" y="90" font-size="20">🚗</text>
  <text x="46" y="108" font-size="8.5" fill="#9099a8">d7</text>

  <rect x="130" y="34" width="110" height="86" rx="4" fill="#14161a" stroke="#3a414c"/>
  <text x="142" y="52" font-size="9" fill="#6b7280">cell(3,5)</text>
  <text x="184" y="90" font-size="20" opacity="0.35">🚗</text>
  <text x="186" y="108" font-size="8.5" fill="#6b7280">d7 (after)</text>

  <line x1="80" y1="76" x2="176" y2="76" stroke="#fb863a" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#rs-move-a)"/>

  <text x="20" y="146" font-size="10" fill="#f06868">before</text>
  <rect x="20" y="156" width="220" height="58" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="32" y="176" font-size="9.5" fill="#e8e4dc">cell(3,4) → { d7, d3 }</text>
  <text x="32" y="198" font-size="9.5" fill="#e8e4dc">cell(3,5) → { d9 }</text>

  <text x="20" y="240" font-size="10" fill="#5cc66f">after</text>
  <rect x="20" y="250" width="220" height="42" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="32" y="266" font-size="9.5" fill="#e8e4dc">cell(3,4) → { d3 }</text>
  <text x="32" y="284" font-size="9.5" fill="#e8e4dc">cell(3,5) → { d9, d7 }</text>

  <rect x="266" y="34" width="192" height="258" rx="8" fill="rgba(92,198,111,0.10)" stroke="rgba(92,198,111,0.5)"/>
  <text x="280" y="56" font-size="10.5" fill="#5cc66f">✓ what it costs</text>
  <text x="280" y="84" font-size="9.5" fill="#e8e4dc">oldSet.remove(d7)</text>
  <text x="392" y="84" font-size="9.5" fill="#5cc66f">O(1)</text>
  <text x="280" y="106" font-size="9.5" fill="#e8e4dc">newSet.add(d7)</text>
  <text x="392" y="106" font-size="9.5" fill="#5cc66f">O(1)</text>
  <text x="280" y="128" font-size="9.5" fill="#e8e4dc">whereIs.put(d7, cell)</text>
  <text x="392" y="128" font-size="9.5" fill="#5cc66f">O(1)</text>
  <line x1="280" y1="142" x2="444" y2="142" stroke="rgba(92,198,111,0.35)" stroke-dasharray="3 3"/>
  <text x="280" y="164" font-size="9" fill="#9099a8">and if the driver did not leave</text>
  <text x="280" y="178" font-size="9" fill="#9099a8">the cell, it is a single compare</text>
  <text x="280" y="192" font-size="9" fill="#9099a8">and an early return — which is</text>
  <text x="280" y="206" font-size="9" fill="#9099a8">the common case at 4-second</text>
  <text x="280" y="220" font-size="9" fill="#9099a8">pings in city traffic.</text>
  <line x1="280" y1="234" x2="444" y2="234" stroke="rgba(92,198,111,0.35)" stroke-dasharray="3 3"/>
  <text x="280" y="256" font-size="9.5" fill="#5cc66f">updateLocation runs 1000×</text>
  <text x="280" y="272" font-size="9.5" fill="#5cc66f">more often than requestRide.</text>

  <rect x="474" y="34" width="206" height="258" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="488" y="56" font-size="10.5" fill="#f06868">✗ “a list sorted by latitude”</text>
  <text x="488" y="84" font-size="9.5" fill="#e8e4dc">binarySearch + remove</text>
  <text x="488" y="100" font-size="9.5" fill="#f06868">O(log n) + O(n) shift</text>
  <text x="488" y="122" font-size="9.5" fill="#e8e4dc">insert at new position</text>
  <text x="488" y="138" font-size="9.5" fill="#f06868">O(log n) + O(n) shift</text>
  <line x1="488" y1="152" x2="664" y2="152" stroke="rgba(240,104,104,0.3)" stroke-dasharray="3 3"/>
  <text x="488" y="174" font-size="9" fill="#9099a8">and even after all that it only</text>
  <text x="488" y="188" font-size="9" fill="#9099a8">narrows ONE dimension. Every</text>
  <text x="488" y="202" font-size="9" fill="#9099a8">driver on the same latitude</text>
  <text x="488" y="216" font-size="9" fill="#9099a8">band is still a candidate —</text>
  <text x="488" y="230" font-size="9" fill="#9099a8">including one 40 km east.</text>
  <line x1="488" y1="244" x2="664" y2="244" stroke="rgba(240,104,104,0.3)" stroke-dasharray="3 3"/>
  <text x="488" y="266" font-size="9.5" fill="#f06868">sorting is 1-D. the problem</text>
  <text x="488" y="282" font-size="9.5" fill="#f06868">is 2-D. that is the whole reason.</text>
</svg>`,
        caption:
          "The red column is the answer people reach for when they hear *“nearby”*. Two dimensions do not sort. **A hash of buckets does not have to sort at all** — it just needs a key you can compute from a coordinate, which is exactly what a cell id is.",
      },
      {
        type: "p",
        text: "One more piece: **what if the nine cells are empty?** A rider on the edge of town at 3 a.m. Do not give up, and do not silently widen to the whole city either. **Expand in rings.**",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 268" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Three small grids side by side showing ring expansion around a rider. Ring zero shades only the rider's own cell, one cell, and finds zero drivers. Ring one shades the three by three neighbourhood, nine cells, and still finds zero drivers. Ring two shades the five by five neighbourhood, twenty five cells, and finds two drivers, at which point the search stops. A note says the search stops at the first ring that yields a candidate and gives up after ring three.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">expand outward one ring at a time, and stop at the first ring that has anybody</text>

  <text x="26" y="52" font-size="10" fill="#6b7280">ring 0 — 1 cell</text>
  <rect x="26" y="60" width="180" height="150" fill="none" stroke="#2d333d"/>
  <line x1="62" y1="60" x2="62" y2="210" stroke="#2d333d"/><line x1="98" y1="60" x2="98" y2="210" stroke="#2d333d"/><line x1="134" y1="60" x2="134" y2="210" stroke="#2d333d"/><line x1="170" y1="60" x2="170" y2="210" stroke="#2d333d"/>
  <line x1="26" y1="90" x2="206" y2="90" stroke="#2d333d"/><line x1="26" y1="120" x2="206" y2="120" stroke="#2d333d"/><line x1="26" y1="150" x2="206" y2="150" stroke="#2d333d"/><line x1="26" y1="180" x2="206" y2="180" stroke="#2d333d"/>
  <rect x="98" y="120" width="36" height="30" fill="rgba(251,134,58,0.22)" stroke="rgba(251,134,58,0.7)"/>
  <text x="106" y="142" font-size="13">🧍</text>
  <circle cx="44" cy="76" r="3.5" fill="#3a414c"/><circle cx="188" cy="196" r="3.5" fill="#3a414c"/><circle cx="182" cy="76" r="3.5" fill="#3a414c"/>
  <text x="26" y="230" font-size="9.5" fill="#f06868">candidates: 0</text>
  <text x="26" y="248" font-size="9" fill="#6b7280">→ widen</text>

  <text x="266" y="52" font-size="10" fill="#6b7280">ring 1 — 9 cells</text>
  <rect x="266" y="60" width="180" height="150" fill="none" stroke="#2d333d"/>
  <line x1="302" y1="60" x2="302" y2="210" stroke="#2d333d"/><line x1="338" y1="60" x2="338" y2="210" stroke="#2d333d"/><line x1="374" y1="60" x2="374" y2="210" stroke="#2d333d"/><line x1="410" y1="60" x2="410" y2="210" stroke="#2d333d"/>
  <line x1="266" y1="90" x2="446" y2="90" stroke="#2d333d"/><line x1="266" y1="120" x2="446" y2="120" stroke="#2d333d"/><line x1="266" y1="150" x2="446" y2="150" stroke="#2d333d"/><line x1="266" y1="180" x2="446" y2="180" stroke="#2d333d"/>
  <rect x="302" y="90" width="108" height="90" fill="rgba(251,134,58,0.22)" stroke="rgba(251,134,58,0.7)"/>
  <text x="346" y="142" font-size="13">🧍</text>
  <circle cx="284" cy="76" r="3.5" fill="#3a414c"/><circle cx="428" cy="196" r="3.5" fill="#3a414c"/><circle cx="422" cy="76" r="3.5" fill="#3a414c"/>
  <text x="266" y="230" font-size="9.5" fill="#f06868">candidates: 0</text>
  <text x="266" y="248" font-size="9" fill="#6b7280">→ widen</text>

  <text x="506" y="52" font-size="10" fill="#6b7280">ring 2 — 25 cells</text>
  <rect x="506" y="60" width="180" height="150" fill="none" stroke="#2d333d"/>
  <line x1="542" y1="60" x2="542" y2="210" stroke="#2d333d"/><line x1="578" y1="60" x2="578" y2="210" stroke="#2d333d"/><line x1="614" y1="60" x2="614" y2="210" stroke="#2d333d"/><line x1="650" y1="60" x2="650" y2="210" stroke="#2d333d"/>
  <line x1="506" y1="90" x2="686" y2="90" stroke="#2d333d"/><line x1="506" y1="120" x2="686" y2="120" stroke="#2d333d"/><line x1="506" y1="150" x2="686" y2="150" stroke="#2d333d"/><line x1="506" y1="180" x2="686" y2="180" stroke="#2d333d"/>
  <rect x="506" y="60" width="180" height="150" fill="rgba(251,134,58,0.22)" stroke="rgba(251,134,58,0.7)"/>
  <text x="586" y="142" font-size="13">🧍</text>
  <circle cx="524" cy="76" r="4" fill="none" stroke="#5cc66f" stroke-width="1.4"/><circle cx="668" cy="196" r="4" fill="none" stroke="#5cc66f" stroke-width="1.4"/><circle cx="662" cy="76" r="4" fill="none" stroke="#5cc66f" stroke-width="1.4"/>
  <text x="506" y="230" font-size="9.5" fill="#5cc66f">candidates: 3</text>
  <text x="506" y="248" font-size="9" fill="#5cc66f">→ stop. rank them.</text>

  <text x="20" y="266" font-size="9" fill="#6b7280">give up after ring 3 (49 cells, ~2.3 km across) and return NO_DRIVERS_FOUND — an honest failure beats a car 40 minutes away</text>
</svg>`,
        caption:
          "Two design points hide in this picture. **Stop at the first ring that yields anybody** — the ring is already a distance filter, so you do not need a second one. And **cap the expansion**: three rings, then fail. *“No cars available right now”* is a correct answer; a driver twenty kilometres away is not.",
      },

      // ---------------- offers ----------------
      { type: "h", text: "Step 3 · Offer one driver at a time, with a deadline" },
      {
        type: "p",
        text: "You now have sixteen nearby drivers, ranked. The obvious next move — send the ride to all of them and let the fastest tap win — is wrong, and it is wrong in an interesting way.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 330" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, a broadcast: one ride request is pushed to twenty drivers at once, all twenty phones buzz, one driver wins and nineteen race and lose, shown in red, with the loser drivers having stopped their cars for nothing and the winner chosen by network latency rather than by suitability. On the right, a sequential offer: the ranked list is offered to driver number one alone with a fifteen second countdown, and only if that offer is declined or expires does driver number two see anything.">
  <defs>
    <marker id="rs-bc-a" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="7" refX="6" refY="2.6" orient="auto"><path d="M0,0 L6,2.6 L0,5.2 z" fill="#f06868"/></marker>
    <marker id="rs-bc-b" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
  </defs>

  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ broadcast — “let the fastest tap win”</text>
  <rect x="20" y="32" width="326" height="252" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <rect x="128" y="46" width="112" height="30" rx="5" fill="#1a1d22" stroke="#3a414c"/>
  <text x="140" y="66" font-size="9.5" fill="#e8e4dc">RideRequest r1</text>

  <line x1="150" y1="76" x2="60" y2="112" stroke="#f06868" stroke-width="0.9" marker-end="url(#rs-bc-a)"/>
  <line x1="170" y1="76" x2="120" y2="112" stroke="#f06868" stroke-width="0.9" marker-end="url(#rs-bc-a)"/>
  <line x1="184" y1="76" x2="184" y2="112" stroke="#f06868" stroke-width="0.9" marker-end="url(#rs-bc-a)"/>
  <line x1="200" y1="76" x2="250" y2="112" stroke="#f06868" stroke-width="0.9" marker-end="url(#rs-bc-a)"/>
  <line x1="216" y1="76" x2="308" y2="112" stroke="#f06868" stroke-width="0.9" marker-end="url(#rs-bc-a)"/>

  <text x="44" y="136" font-size="16">📱</text><text x="104" y="136" font-size="16">📱</text><text x="168" y="136" font-size="16">📱</text><text x="234" y="136" font-size="16">📱</text><text x="292" y="136" font-size="16">📱</text>
  <text x="44" y="164" font-size="16">📱</text><text x="104" y="164" font-size="16">📱</text><text x="168" y="164" font-size="16">📱</text><text x="234" y="164" font-size="16">📱</text><text x="292" y="164" font-size="16">📱</text>
  <text x="44" y="192" font-size="16">📱</text><text x="104" y="192" font-size="16">📱</text><text x="168" y="192" font-size="16">📱</text><text x="234" y="192" font-size="16">📱</text><text x="292" y="192" font-size="16">📱</text>
  <text x="44" y="220" font-size="16">📱</text><text x="104" y="220" font-size="16">📱</text><text x="168" y="220" font-size="16">📱</text><text x="234" y="220" font-size="16">📱</text><text x="292" y="220" font-size="16">📱</text>
  <circle cx="173" cy="187" r="15" fill="none" stroke="#5cc66f" stroke-width="1.6"/>

  <text x="38" y="246" font-size="9.5" fill="#5cc66f">1 winner</text>
  <text x="120" y="246" font-size="9.5" fill="#f06868">19 losers — all of them braked for nothing</text>
  <text x="38" y="266" font-size="9" fill="#9099a8">and the “best” driver is whoever had the fastest 4G,</text>
  <text x="38" y="278" font-size="9" fill="#9099a8">not whoever was nearest. Ranking became decoration.</text>

  <text x="374" y="22" font-size="10.5" fill="#5cc66f">✓ sequential offer — one at a time, 15s</text>
  <rect x="374" y="32" width="326" height="252" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <rect x="392" y="48" width="290" height="30" rx="5" fill="#1a1d22" stroke="#3a414c"/>
  <text x="404" y="68" font-size="9.5" fill="#9099a8">ranked candidates:  d3 · d1 · d7</text>

  <rect x="392" y="92" width="290" height="52" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.6)"/>
  <text x="406" y="112" font-size="10.5" fill="#fb863a">#1  d3   0.4 km ★4.6</text>
  <text x="406" y="132" font-size="9.5" fill="#e8e4dc">📲 OFFERED — expires in 15s ⏱</text>
  <line x1="600" y1="98" x2="600" y2="138" stroke="rgba(251,134,58,0.5)"/>
  <text x="610" y="122" font-size="9" fill="#fb863a">only this</text>
  <text x="610" y="134" font-size="9" fill="#fb863a">phone buzzes</text>

  <rect x="392" y="156" width="290" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="406" y="177" font-size="10" fill="#6b7280">#2  d1   0.9 km ★4.9      waiting, sees nothing</text>

  <rect x="392" y="200" width="290" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="406" y="221" font-size="10" fill="#6b7280">#3  d7   1.1 km ★4.8      waiting, sees nothing</text>

  <line x1="440" y1="144" x2="440" y2="154" stroke="#5cc66f" stroke-width="1.2" stroke-dasharray="3 2" marker-end="url(#rs-bc-b)"/>
  <text x="452" y="152" font-size="8.5" fill="#5cc66f">on decline or timeout</text>

  <text x="392" y="256" font-size="9.5" fill="#5cc66f">exactly one driver can accept, because exactly one was asked</text>
  <text x="392" y="272" font-size="9" fill="#9099a8">cost: up to 15s of waiting. worth it, and you can shrink it.</text>

  <rect x="20" y="298" width="680" height="26" rx="6" fill="rgba(240,104,104,0.10)" stroke="rgba(240,104,104,0.4)"/>
  <text x="36" y="316" font-size="10" fill="#f06868">broadcast recreates the exact double-booking race you were trying to avoid — 20 accepts arrive, 19 must be rejected AFTER the driver already said yes</text>
</svg>`,
        caption:
          "The red bar at the bottom is the sentence to say. Broadcasting does not remove the race — it *multiplies* it, and it moves the rejection to the worst possible moment: after a human already committed. Sequential offers make the race impossible by construction.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The honest trade-off, and how to say it",
        text: "Sequential offers cost **latency**: three declines in a row is forty-five seconds of a rider staring at a spinner. Real systems soften this — shorter deadlines (8–10 s), a small *batch* of two or three offers with the CAS still deciding the winner, and pre-warming the next candidate while the current one is deciding. Say: *“I will start strictly sequential because it makes correctness obvious, and I would tune towards small batches once I had acceptance-rate data.”* That is the answer of somebody who has shipped one.",
      },
      {
        type: "p",
        text: "Ranking the candidates is a separate decision from dispatching them, so it goes behind its own interface — `MatchingStrategy.rank(pickup, candidates)`. Straight-line distance is the default. Swap in one that weights the driver's rating, or their acceptance rate, or how long they have been idle, and **`DispatchService` does not change a line** ([[strategy]], [[open-closed]]).",
      },
      {
        type: "callout",
        variant: "info",
        title: "Straight-line distance is right for ranking and wrong for money",
        text: "For **ranking**, straight line — haversine, or plain squared Euclidean on a small map — is fine and fast. You are ordering candidates that are all within a kilometre; the road network rarely reorders them, and when it does the cost of being slightly wrong is thirty seconds. For **the fare**, straight line is simply incorrect: a river or a one-way system can make a 2 km hop an 8 km drive, and a rider charged for the crow's flight will notice. So: `RouteService.roadMetres(a, b)` behind an interface, stubbed as `haversine × 1.35` in the round, and one sentence saying a real system calls a routing engine. Two different distances, two different purposes, said out loud — that is a whole grading point.",
      },

      // ---------------- the CAS ----------------
      { type: "h", text: "Step 4 · One driver, one ride — enforced by a compare-and-set" },
      {
        type: "p",
        text: "Two riders in the same neighbourhood tap *Book* in the same millisecond. Both requests query the index. Both get the same nine cells. Both rank the same list. Both pick **d3**, because d3 really is the nearest car for both of them. Now what?",
      },
      {
        type: "p",
        text: "The naive dispatcher does this, and it is the single most common bug in this problem:",
      },
      {
        type: "code",
        language: "java",
        filename: "check-then-act — the bug",
        code: `Driver d = candidates.get(0);
if (d.state == AVAILABLE) {        // thread A reads AVAILABLE. thread B reads AVAILABLE.
    d.state = OFFERED;             // thread A writes.        thread B writes.
    d.rideId = ride.id;            // ...and one of these rides just vanished.
    return d;                      // BOTH riders are told "d3 is on the way".
}`,
      },
      {
        type: "p",
        text: "The gap between the `if` and the assignment is where the second rider gets stolen. The fix is to make reading and writing **one indivisible step**: a compare-and-set that says *“change this driver from AVAILABLE to OFFERED, but only if it is still AVAILABLE”*. Exactly one of the two calls returns true. The loser does not crash and does not retry blindly — it moves to candidate #2 and offers there.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 322" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two timelines for two riders competing for driver d3. In the unguarded version both riders read the driver as available, both write offered, and both are told d3 is coming, producing a double match marked in red and a driver who arrives to find two people waiting. In the guarded version both riders attempt a compare and set from available to offered; rider A's compare and set succeeds, rider B's compare and set fails because the state is no longer available, and rider B falls through to candidate number two and is matched to driver d1 instead.">
  <defs>
    <marker id="rs-race-r" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
    <marker id="rs-race-g" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5cc66f"/></marker>
  </defs>

  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ UNGUARDED — if (state == AVAILABLE) { state = OFFERED; }</text>
  <rect x="20" y="32" width="680" height="112" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="34" y="54" font-size="9" fill="#6b7280">t →</text>
  <line x1="70" y1="48" x2="686" y2="48" stroke="#2d333d"/>

  <text x="34" y="80" font-size="9.5" fill="#9099a8">rider A</text>
  <rect x="96" y="64" width="118" height="22" rx="4" fill="#1a1d22" stroke="#3a414c"/><text x="106" y="79" font-size="9" fill="#e8e4dc">read d3 = AVAILABLE</text>
  <rect x="300" y="64" width="112" height="22" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.5)"/><text x="310" y="79" font-size="9" fill="#f06868">write OFFERED(A)</text>
  <line x1="418" y1="75" x2="500" y2="75" stroke="#f06868" stroke-width="1" marker-end="url(#rs-race-r)"/>
  <text x="506" y="79" font-size="9.5" fill="#f06868">“d3 is 2 min away”</text>

  <text x="34" y="118" font-size="9.5" fill="#9099a8">rider B</text>
  <rect x="176" y="102" width="118" height="22" rx="4" fill="#1a1d22" stroke="#3a414c"/><text x="186" y="117" font-size="9" fill="#e8e4dc">read d3 = AVAILABLE</text>
  <rect x="342" y="102" width="112" height="22" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.5)"/><text x="352" y="117" font-size="9" fill="#f06868">write OFFERED(B)</text>
  <line x1="460" y1="113" x2="500" y2="113" stroke="#f06868" stroke-width="1" marker-end="url(#rs-race-r)"/>
  <text x="506" y="117" font-size="9.5" fill="#f06868">“d3 is 2 min away”</text>

  <text x="20" y="162" font-size="10" fill="#f06868">⚠ double-matched: 1 — one car, two riders, and the app already promised both of them</text>

  <text x="20" y="196" font-size="10.5" fill="#5cc66f">✓ GUARDED — driver.tryOffer(rideId, deadline) — a compare-and-set</text>
  <rect x="20" y="206" width="680" height="112" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="34" y="228" font-size="9" fill="#6b7280">t →</text>
  <line x1="70" y1="222" x2="686" y2="222" stroke="#2d333d"/>

  <text x="34" y="254" font-size="9.5" fill="#9099a8">rider A</text>
  <rect x="96" y="238" width="190" height="22" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>
  <text x="106" y="253" font-size="9" fill="#5cc66f">CAS d3: AVAILABLE → OFFERED ✓</text>
  <line x1="292" y1="249" x2="378" y2="249" stroke="#5cc66f" stroke-width="1" marker-end="url(#rs-race-g)"/>
  <text x="384" y="253" font-size="9.5" fill="#5cc66f">matched to d3 · d3 leaves the index</text>

  <text x="34" y="292" font-size="9.5" fill="#9099a8">rider B</text>
  <rect x="176" y="276" width="190" height="22" rx="4" fill="rgba(240,104,104,0.10)" stroke="rgba(240,104,104,0.45)"/>
  <text x="186" y="291" font-size="9" fill="#f06868">CAS d3: AVAILABLE → OFFERED ✗</text>
  <line x1="372" y1="287" x2="418" y2="287" stroke="#5cc66f" stroke-width="1" marker-end="url(#rs-race-g)"/>
  <text x="424" y="291" font-size="9.5" fill="#5cc66f">falls through to #2 → matched to d1</text>
</svg>`,
        caption:
          "Look at the bottom row. The losing request **does not fail** — it just walks one step down its own ranked list. That is what makes a CAS the right tool here rather than a lock: there is nothing to wait for, because there is always another car.",
      },
      {
        type: "code",
        language: "java",
        filename: "the whole guarantee, in one method",
        code: `enum DriverState { OFFLINE, AVAILABLE, OFFERED, ON_TRIP }

/** state + rideId + deadline swapped together, so they can never disagree. */
record Slot(DriverState state, String rideId, long expiresAt) {}

final class Driver {
    final String id;
    private final AtomicReference<Slot> slot =
        new AtomicReference<>(new Slot(DriverState.OFFLINE, null, 0L));

    /** Exactly one concurrent caller can win this. That is the entire invariant. */
    boolean tryOffer(String rideId, long expiresAt) {
        Slot cur = slot.get();
        if (cur.state() != DriverState.AVAILABLE) return false;
        return slot.compareAndSet(cur, new Slot(DriverState.OFFERED, rideId, expiresAt));
    }

    /** The driver tapped Accept. Only valid for the ride they were actually offered. */
    boolean confirm(String rideId) {
        Slot cur = slot.get();
        if (cur.state() != DriverState.OFFERED || !rideId.equals(cur.rideId())) return false;
        return slot.compareAndSet(cur, new Slot(DriverState.ON_TRIP, rideId, 0L));
    }

    /** Declined, timed out, or the trip finished — back into the pool. */
    boolean release(String rideId) {
        Slot cur = slot.get();
        if (cur.state() == DriverState.OFFLINE || !rideId.equals(cur.rideId())) return false;
        return slot.compareAndSet(cur, new Slot(DriverState.AVAILABLE, null, 0L));
    }
}`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one line that prevents most of the bugs",
        text: "**A driver in `OFFERED` or `ON_TRIP` is not in the matchable index.** Remove them on the successful `tryOffer`, put them back on decline, timeout or trip completion. Once that is true, a driver who is mid-offer is not even a *candidate* for the next request, so the CAS almost never has to lose — it is there for the microsecond-wide window, not as the everyday mechanism. Say this while you write `tryOffer` and you have answered the next three follow-ups at once.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The driver state machine. Offline goes online to Available. Available is the only state in the matchable index. A successful compare and set moves Available to Offered, carrying a ride id and a fifteen second deadline; Offered is not in the index. From Offered, accept moves to On trip, while decline or timeout moves back to Available. On trip is not in the index either; completing or cancelling the ride moves back to Available. A side table lists each state with whether the driver appears in the geo index, and a note explains that removing offered and on-trip drivers from the index is what stops them from being candidates at all.">
  <defs>
    <marker id="rs-dsm-a" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#9099a8"/></marker>
    <marker id="rs-dsm-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="rs-dsm-o" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <rect x="24" y="126" width="98" height="44" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="42" y="146" font-size="10.5" fill="#9099a8">OFFLINE</text>
  <text x="38" y="162" font-size="8.5" fill="#6b7280">app closed</text>

  <rect x="176" y="120" width="118" height="56" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.6)" stroke-width="1.5"/>
  <text x="196" y="142" font-size="11" fill="#5cc66f">AVAILABLE</text>
  <text x="192" y="160" font-size="8.5" fill="#5cc66f">✓ in the index</text>

  <rect x="352" y="46" width="130" height="60" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.6)" stroke-width="1.5"/>
  <text x="372" y="68" font-size="11" fill="#fb863a">OFFERED</text>
  <text x="366" y="84" font-size="8.5" fill="#e8e4dc">rideId + expiresAt</text>
  <text x="366" y="98" font-size="8.5" fill="#f06868">✗ NOT in the index</text>

  <rect x="352" y="196" width="130" height="60" rx="8" fill="#14161a" stroke="rgba(94,159,246,0.6)" stroke-width="1.5"/>
  <text x="376" y="218" font-size="11" fill="#5e9ff6">ON_TRIP</text>
  <text x="366" y="234" font-size="8.5" fill="#e8e4dc">rideId</text>
  <text x="366" y="248" font-size="8.5" fill="#f06868">✗ NOT in the index</text>

  <line x1="122" y1="148" x2="172" y2="148" stroke="#9099a8" stroke-width="1.2" marker-end="url(#rs-dsm-a)"/>
  <text x="118" y="140" font-size="8.5" fill="#9099a8">goOnline()</text>

  <line x1="286" y1="124" x2="348" y2="86" stroke="#fb863a" stroke-width="1.5" marker-end="url(#rs-dsm-o)"/>
  <text x="256" y="98" font-size="8.5" fill="#fb863a">tryOffer() CAS ✓</text>

  <line x1="348" y1="98" x2="290" y2="132" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#rs-dsm-a)"/>
  <text x="252" y="122" font-size="8.5" fill="#9099a8">decline / 15s timeout</text>

  <line x1="417" y1="106" x2="417" y2="192" stroke="#5cc66f" stroke-width="1.5" marker-end="url(#rs-dsm-g)"/>
  <text x="424" y="152" font-size="8.5" fill="#5cc66f">confirm() — accept</text>

  <line x1="352" y1="232" x2="290" y2="170" stroke="#5e9ff6" stroke-width="1.2" marker-end="url(#rs-dsm-a)"/>
  <text x="232" y="204" font-size="8.5" fill="#5e9ff6">complete / cancel</text>

  <rect x="516" y="40" width="188" height="132" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="530" y="60" font-size="10" fill="#9099a8">state → in the index?</text>
  <line x1="530" y1="70" x2="690" y2="70" stroke="#2d333d"/>
  <text x="530" y="90" font-size="9.5" fill="#9099a8">OFFLINE</text><text x="646" y="90" font-size="9.5" fill="#f06868">no</text>
  <text x="530" y="112" font-size="9.5" fill="#5cc66f">AVAILABLE</text><text x="640" y="112" font-size="9.5" fill="#5cc66f">yes</text>
  <text x="530" y="134" font-size="9.5" fill="#fb863a">OFFERED</text><text x="646" y="134" font-size="9.5" fill="#f06868">no</text>
  <text x="530" y="156" font-size="9.5" fill="#5e9ff6">ON_TRIP</text><text x="646" y="156" font-size="9.5" fill="#f06868">no</text>

  <rect x="516" y="186" width="188" height="96" rx="8" fill="rgba(92,198,111,0.10)" stroke="rgba(92,198,111,0.45)"/>
  <text x="530" y="208" font-size="9.5" fill="#5cc66f">exactly one “yes” row.</text>
  <text x="530" y="228" font-size="9" fill="#9099a8">A driver mid-offer is not a</text>
  <text x="530" y="242" font-size="9" fill="#9099a8">candidate at all, so the CAS</text>
  <text x="530" y="256" font-size="9" fill="#9099a8">is a guard for a microsecond</text>
  <text x="530" y="270" font-size="9" fill="#9099a8">window, not the everyday path.</text>

  <text x="24" y="212" font-size="9" fill="#6b7280">notation: UML state diagram</text>
  <text x="24" y="234" font-size="9" fill="#6b7280">every arrow is a CAS on one</text>
  <text x="24" y="248" font-size="9" fill="#6b7280">AtomicReference&lt;Slot&gt; — so state,</text>
  <text x="24" y="262" font-size="9" fill="#6b7280">rideId and deadline can never</text>
  <text x="24" y="276" font-size="9" fill="#6b7280">disagree with each other.</text>
</svg>`,
        caption:
          "Read the small table on the right first. **One state is in the index.** That single fact is what turns *“stop two riders getting the same car”* from a hard concurrency problem into a bookkeeping one — with the CAS left as a cheap guard for the last microsecond. More on the mechanism in [[atomic-operations-and-cas]]; on why a lock is the heavier alternative, [[locks-mutex-semaphore]].",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Why not just `synchronized` around the whole dispatcher?",
        text: "You can, and for a ninety-minute round nobody will fail you for it. But say what it costs: **one global lock serialises every ride request in the entire city**, including the thousands that are nowhere near each other and could never contend. The contended thing is *one driver*, so the guard belongs on *one driver*. That is the difference between a lock around the system and an atomic operation on the resource — and interviewers listen for exactly that sentence ([[deadlock-race-starvation]]).",
      },

      // ---------------- class diagram ----------------
      { type: "h", text: "Step 5 · The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 452" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. DispatchService is the centre: it holds a GeoIndex, a MatchingStrategy, a PricingStrategy and a RouteService, and it owns every Ride. Driver holds one Vehicle and one atomic Slot carrying its state, current ride id and offer deadline. Location is a plain latitude and longitude value. GeoIndex maps cell ids to sets of driver ids and exposes put, remove and near. RideRequest carries rider, pickup, drop and vehicle class. Ride carries the rider, the driver, its own state and a Fare. MatchingStrategy has two implementations, nearest first and best rated nearby. PricingStrategy has two implementations, flat and surge.">
  <defs>
    <marker id="rs-cls-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="rs-cls-i" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <rect x="258" y="16" width="224" height="112" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.4"/>
  <text x="272" y="36" font-size="11.5" fill="#fb863a">DispatchService</text>
  <line x1="258" y1="44" x2="482" y2="44" stroke="#2d333d"/>
  <text x="272" y="62" font-size="9.5" fill="#e8e4dc">+ requestRide(req, now) : Ride</text>
  <text x="272" y="79" font-size="9.5" fill="#e8e4dc">+ accept(rideId, driverId, now)</text>
  <text x="272" y="96" font-size="9.5" fill="#e8e4dc">+ decline(rideId, driverId, now)</text>
  <text x="272" y="113" font-size="9.5" fill="#e8e4dc">+ tick(now)   ← expires offers</text>

  <rect x="18" y="16" width="204" height="108" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.4"/>
  <text x="32" y="36" font-size="11.5" fill="#5cc66f">GeoIndex</text>
  <line x1="18" y1="44" x2="222" y2="44" stroke="#2d333d"/>
  <text x="32" y="62" font-size="9" fill="#9099a8">- cells : Map&lt;Long, Set&lt;String&gt;&gt;</text>
  <text x="32" y="79" font-size="9" fill="#9099a8">- whereIs : Map&lt;String, Long&gt;</text>
  <text x="32" y="96" font-size="9.5" fill="#5cc66f">+ put(id, loc)  + remove(id)</text>
  <text x="32" y="113" font-size="9.5" fill="#5cc66f">+ near(loc, ring) : Set&lt;String&gt;</text>
  <line x1="226" y1="60" x2="254" y2="60" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#rs-cls-a)"/>

  <rect x="518" y="16" width="204" height="126" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.4"/>
  <text x="532" y="36" font-size="11.5" fill="#5e9ff6">Driver</text>
  <line x1="518" y1="44" x2="722" y2="44" stroke="#2d333d"/>
  <text x="532" y="62" font-size="9" fill="#9099a8">- id, name, rating</text>
  <text x="532" y="79" font-size="9" fill="#fb863a">- slot : AtomicReference&lt;Slot&gt;</text>
  <text x="532" y="96" font-size="9.5" fill="#e8e4dc">+ tryOffer(rideId, expiresAt)</text>
  <text x="532" y="113" font-size="9.5" fill="#e8e4dc">+ confirm(rideId)</text>
  <text x="532" y="130" font-size="9.5" fill="#e8e4dc">+ release(rideId)</text>
  <line x1="486" y1="60" x2="514" y2="60" stroke="#9099a8" stroke-width="1.2" marker-end="url(#rs-cls-a)"/>

  <rect x="518" y="164" width="204" height="62" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="532" y="184" font-size="11" fill="#e8e4dc">Vehicle</text>
  <line x1="518" y1="192" x2="722" y2="192" stroke="#2d333d"/>
  <text x="532" y="210" font-size="9" fill="#9099a8">plate · model · seats · class</text>
  <path d="M620,142 L620,152 L612,158 L620,164 L628,158 L620,152" fill="#e8e4dc" stroke="#e8e4dc"/>
  <text x="634" y="158" font-size="8.5" fill="#9099a8">1</text>

  <rect x="518" y="248" width="204" height="58" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="532" y="268" font-size="11" fill="#e8e4dc">Location</text>
  <line x1="518" y1="276" x2="722" y2="276" stroke="#2d333d"/>
  <text x="532" y="294" font-size="9" fill="#9099a8">lat : double · lng : double</text>

  <rect x="258" y="164" width="224" height="96" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="272" y="184" font-size="11.5" fill="#e8e4dc">Ride</text>
  <line x1="258" y1="192" x2="482" y2="192" stroke="#2d333d"/>
  <text x="272" y="210" font-size="9" fill="#9099a8">- rider : Rider   - driver : Driver</text>
  <text x="272" y="227" font-size="9" fill="#9099a8">- state : RideState</text>
  <text x="272" y="244" font-size="9" fill="#9099a8">- candidates : Deque&lt;String&gt;</text>
  <text x="272" y="256" font-size="8.5" fill="#6b7280">the ranked list it walks down</text>
  <line x1="370" y1="128" x2="370" y2="160" stroke="#fb863a" stroke-width="1.2" marker-end="url(#rs-cls-a)"/>
  <text x="378" y="150" font-size="8.5" fill="#fb863a">owns 0..*</text>

  <rect x="18" y="164" width="204" height="80" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="184" font-size="11" fill="#e8e4dc">RideRequest</text>
  <line x1="18" y1="192" x2="222" y2="192" stroke="#2d333d"/>
  <text x="32" y="210" font-size="9" fill="#9099a8">rider · pickup · drop</text>
  <text x="32" y="227" font-size="9" fill="#9099a8">vehicleClass · requestedAt</text>
  <line x1="226" y1="196" x2="254" y2="196" stroke="#9099a8" stroke-width="1.2" marker-end="url(#rs-cls-a)"/>

  <rect x="258" y="284" width="224" height="72" rx="6" fill="#14161a" stroke="rgba(94,159,246,0.55)"/>
  <text x="272" y="304" font-size="11" fill="#5e9ff6">Fare</text>
  <line x1="258" y1="312" x2="482" y2="312" stroke="#2d333d"/>
  <text x="272" y="330" font-size="9" fill="#9099a8">basePaise · distancePaise</text>
  <text x="272" y="347" font-size="9" fill="#9099a8">timePaise · surgePaise · totalPaise</text>
  <path d="M370,260 L370,268 L362,274 L370,280 L378,274 L370,268" fill="#e8e4dc" stroke="#e8e4dc"/>

  <rect x="18" y="284" width="204" height="62" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="32" y="304" font-size="10.5" fill="#5e9ff6">«interface» MatchingStrategy</text>
  <line x1="18" y1="312" x2="222" y2="312" stroke="#2d333d"/>
  <text x="32" y="332" font-size="9.5" fill="#e8e4dc">+ rank(pickup, candidates)</text>
  <line x1="226" y1="300" x2="254" y2="300" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#rs-cls-a)"/>

  <rect x="18" y="366" width="98" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="28" y="385" font-size="9" fill="#e8e4dc">NearestFirst</text>
  <rect x="124" y="366" width="98" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="134" y="385" font-size="9" fill="#e8e4dc">BestRated</text>
  <line x1="67" y1="366" x2="80" y2="350" stroke="#9099a8" stroke-width="1.1" marker-end="url(#rs-cls-i)"/>
  <line x1="173" y1="366" x2="140" y2="350" stroke="#9099a8" stroke-width="1.1" marker-end="url(#rs-cls-i)"/>

  <rect x="258" y="376" width="224" height="62" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="272" y="396" font-size="10.5" fill="#5e9ff6">«interface» PricingStrategy</text>
  <line x1="258" y1="404" x2="482" y2="404" stroke="#2d333d"/>
  <text x="272" y="424" font-size="9.5" fill="#e8e4dc">+ quote(metres, seconds) : Fare</text>

  <rect x="518" y="376" width="98" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="528" y="395" font-size="9" fill="#e8e4dc">FlatPricing</text>
  <rect x="624" y="376" width="98" height="28" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.5)"/><text x="634" y="395" font-size="9" fill="#fb863a">SurgePricing</text>
  <line x1="514" y1="390" x2="490" y2="400" stroke="#9099a8" stroke-width="1.1" marker-end="url(#rs-cls-i)"/>
  <line x1="620" y1="404" x2="500" y2="420" stroke="#9099a8" stroke-width="1.1" marker-end="url(#rs-cls-i)"/>

  <rect x="518" y="324" width="204" height="42" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="532" y="344" font-size="10" fill="#9099a8">«interface» RouteService</text>
  <text x="532" y="359" font-size="9" fill="#6b7280">roadMetres(a, b) — stubbed</text>

  <text x="18" y="418" font-size="9" fill="#6b7280">DispatchService knows four interfaces and</text>
  <text x="18" y="432" font-size="9" fill="#6b7280">one index. It knows no map provider, no</text>
  <text x="18" y="446" font-size="9" fill="#6b7280">payment gateway and no notification channel.</text>
</svg>`,
        caption:
          "`DispatchService` is the hub, and everything it depends on is an interface it could not name a vendor for. **Four seams** — matching, pricing, routing, and the index itself — and the two that interviewers push on (a new ranking signal, a new pricing rule) are both one new class and zero edits. Notation: [[class-diagrams]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 402" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram for requestRide. The rider calls requestRide on DispatchService. DispatchService asks GeoIndex for drivers near the pickup at ring one and gets sixteen ids back, filters them to available ones, and asks MatchingStrategy to rank them, receiving the ordered list d3, d1, d7. It then calls tryOffer on driver d3 with a fifteen second deadline; the compare and set succeeds, so d3 is removed from the index and the rider sees driver found. Fifteen seconds pass with no answer, so tick expires the offer, releases d3 back into the index, and offers d1. d1 accepts, confirm moves d1 to on trip, and the ride becomes matched with a fare quote attached.">
  <defs>
    <marker id="rs-seq-c" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="rs-seq-r" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="84" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="34" y="31" font-size="10" fill="#e8e4dc">Rider</text>
  <rect x="152" y="12" width="132" height="28" rx="5" fill="#14161a" stroke="#fb863a"/><text x="164" y="31" font-size="10" fill="#fb863a">DispatchService</text>
  <rect x="344" y="12" width="96" height="28" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="360" y="31" font-size="10" fill="#5cc66f">GeoIndex</text>
  <rect x="486" y="12" width="118" height="28" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="492" y="31" font-size="10" fill="#5e9ff6">MatchingStrat</text>
  <rect x="640" y="12" width="88" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="656" y="31" font-size="10" fill="#e8e4dc">Drivers</text>

  <line x1="56" y1="40" x2="56" y2="392" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="218" y1="40" x2="218" y2="392" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="392" y1="40" x2="392" y2="392" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="545" y1="40" x2="545" y2="392" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="684" y1="40" x2="684" y2="392" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="64" y="60" font-size="9.5" fill="#e8e4dc">requestRide(pickup, drop, t=0)</text>
  <line x1="56" y1="68" x2="214" y2="68" stroke="#fb863a" stroke-width="1.3" marker-end="url(#rs-seq-c)"/>

  <text x="226" y="88" font-size="9.5" fill="#e8e4dc">near(pickup, ring=1)</text>
  <line x1="218" y1="96" x2="388" y2="96" stroke="#fb863a" stroke-width="1.3" marker-end="url(#rs-seq-c)"/>
  <line x1="392" y1="118" x2="222" y2="118" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#rs-seq-r)"/>
  <text x="240" y="113" font-size="9" fill="#5cc66f">16 ids from 9 cells — not 50,000</text>

  <text x="226" y="140" font-size="9.5" fill="#e8e4dc">rank(pickup, available)</text>
  <line x1="218" y1="148" x2="541" y2="148" stroke="#fb863a" stroke-width="1.3" marker-end="url(#rs-seq-c)"/>
  <line x1="545" y1="170" x2="222" y2="170" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#rs-seq-r)"/>
  <text x="300" y="165" font-size="9" fill="#5e9ff6">[ d3 , d1 , d7 ]</text>

  <rect x="152" y="182" width="576" height="48" rx="6" fill="rgba(251,134,58,0.14)" stroke="rgba(251,134,58,0.55)"/>
  <text x="164" y="200" font-size="9.5" fill="#fb863a">d3.tryOffer(ride7, expiresAt = 15_000)   → CAS AVAILABLE → OFFERED ✓</text>
  <text x="164" y="220" font-size="9" fill="#5cc66f">geoIndex.remove(d3) — the moment it is offered, it stops being a candidate</text>

  <line x1="56" y1="248" x2="214" y2="248" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#rs-seq-r)"/>
  <text x="64" y="243" font-size="9" fill="#9099a8">“finding you a driver…”  state = REQUESTED</text>

  <rect x="152" y="262" width="576" height="46" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="164" y="280" font-size="9.5" fill="#f06868">tick(t = 15_001)  → offer expired, nobody answered</text>
  <text x="164" y="300" font-size="9" fill="#9099a8">d3.release(ride7) → AVAILABLE · geoIndex.put(d3) → back in the pool, no penalty</text>

  <rect x="152" y="320" width="576" height="46" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="164" y="338" font-size="9.5" fill="#5cc66f">d1.tryOffer(ride7, 30_001) ✓   →   accept(ride7, d1, t=18_400)</text>
  <text x="164" y="358" font-size="9" fill="#9099a8">d1.confirm(ride7) → ON_TRIP · ride.state = MATCHED · fare quote attached</text>

  <line x1="218" y1="386" x2="60" y2="386" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#rs-seq-r)"/>
  <text x="64" y="381" font-size="9.5" fill="#5cc66f">“Rahul in a white Swift, 3 min away”  ·  ₹277.00 upfront</text>
</svg>`,
        caption:
          "Two lines carry the whole flow. **`geoIndex.remove(d3)` the instant the offer lands** — so no other request can even see that car — and **`tick(now)` as the thing that expires offers**, because time is a parameter you pass in, not a clock you read. That is what makes this whole path testable. Notation: [[sequence-diagrams]].",
      },

      // ---------------- ride state machine ----------------
      { type: "h", text: "The `Ride` state machine (supporting cast, but they will ask)" },
      {
        type: "p",
        text: "Once a driver has accepted, the ride walks a short, boring path. Boring is the goal — the interesting concurrency all happened before `MATCHED`.",
      },
      {
        type: "ul",
        items: [
          "`REQUESTED` → the rider tapped, offers are going out. Nobody is committed yet.",
          "`MATCHED` → a driver confirmed. This is the first state a rider is allowed to see a name and a number plate in.",
          "`DRIVER_ARRIVED` → the car is at the pickup. Starts the free-waiting clock, which is what a cancellation fee later depends on.",
          "`IN_PROGRESS` → the rider is in the car. Distance and time start accruing here, not at `MATCHED`.",
          "`COMPLETED` → the fare is finalised, and the driver goes back to `AVAILABLE` **and back into the index**.",
          "`CANCELLED_BY_RIDER` / `CANCELLED_BY_DRIVER` → two different states, not one, because they have different consequences: one may charge the rider, the other counts against the driver's acceptance rate.",
          "`NO_DRIVERS_FOUND` → the honest terminal state after three rings and an empty candidate list. It is a *result*, not an exception.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Keep the transitions in one place",
        text: "`ride.transitionTo(next)` with an explicit table of legal moves — and every illegal move throws. It is fifteen lines and it kills a whole family of bugs: completing a ride that was cancelled, starting a trip nobody accepted, cancelling twice and charging twice. The deep treatment of this shape is [[state]]; here, a switch and a legal-moves map is enough, and *saying* that it is enough is part of the answer.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Every terminal state must release the driver",
        text: "Completed, cancelled by either side, or failed — **every** path ends with `driver.release(rideId)` and `geoIndex.put(driver)`. Miss one and you have leaked a car: a driver stuck in `ON_TRIP` forever, invisible to the index, wondering why they get no rides. Put it in a `finally`, or in one `endRide(ride, terminalState)` method that every path goes through. This is the single most common *silent* bug in a working submission.",
      },

      // ---------------- fare ----------------
      { type: "h", text: "Step 6 · Fare is a breakdown, not a number" },
      {
        type: "p",
        text: "`double totalFare` is the wrong type and the wrong shape. Wrong type because money in binary floating point drifts. Wrong shape because a rider who is charged ₹277 will ask *why*, and *“277”* is not an answer. Return a **`Fare` record with every component kept**, in **integer paise**.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 322" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A fare breakdown card. Base is five thousand paise. Distance of six thousand four hundred metres at twelve hundred paise per kilometre is seven thousand six hundred and eighty paise. Time of eighteen minutes at one hundred and fifty paise per minute is two thousand seven hundred paise. Subtotal is fifteen thousand three hundred and eighty paise. At normal pricing the surge multiplier is one point zero and the total rounds to fifteen thousand four hundred paise, one hundred and fifty four rupees. At surge one point eight the surge adds twelve thousand three hundred and four paise and the total rounds to twenty seven thousand seven hundred paise, two hundred and seventy seven rupees. A note on the right shows the integer rounding rule and warns that every multiplication happens before any division.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">one trip · 6.4 km · 18 min · everything below is an integer number of paise</text>

  <rect x="20" y="34" width="330" height="196" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="36" y="56" font-size="10" fill="#6b7280">component</text>
  <text x="200" y="56" font-size="10" fill="#6b7280">arithmetic</text>
  <text x="300" y="56" font-size="10" fill="#6b7280">paise</text>
  <line x1="36" y1="64" x2="334" y2="64" stroke="#2d333d"/>

  <text x="36" y="86" font-size="10" fill="#e8e4dc">base</text>
  <text x="200" y="86" font-size="9" fill="#9099a8">flat</text>
  <text x="300" y="86" font-size="10" fill="#e8e4dc">5000</text>

  <text x="36" y="110" font-size="10" fill="#e8e4dc">distance</text>
  <text x="200" y="110" font-size="9" fill="#9099a8">6400 × 1200 / 1000</text>
  <text x="300" y="110" font-size="10" fill="#e8e4dc">7680</text>

  <text x="36" y="134" font-size="10" fill="#e8e4dc">time</text>
  <text x="200" y="134" font-size="9" fill="#9099a8">18 × 150</text>
  <text x="300" y="134" font-size="10" fill="#e8e4dc">2700</text>

  <line x1="36" y1="146" x2="334" y2="146" stroke="#2d333d"/>
  <text x="36" y="166" font-size="10" fill="#9099a8">subtotal</text>
  <text x="300" y="166" font-size="10.5" fill="#9099a8">15380</text>

  <text x="36" y="192" font-size="10" fill="#fb863a">surge ×1.8</text>
  <text x="200" y="192" font-size="9" fill="#9099a8">15380 × 18000 / 10000</text>
  <text x="290" y="192" font-size="10" fill="#fb863a">+12304</text>

  <line x1="36" y1="202" x2="334" y2="202" stroke="#3a414c" stroke-width="1.3"/>
  <text x="36" y="222" font-size="11" fill="#5e9ff6">TOTAL</text>
  <text x="290" y="222" font-size="13" fill="#5e9ff6">27700</text>

  <rect x="368" y="34" width="332" height="94" rx="8" fill="rgba(92,198,111,0.10)" stroke="rgba(92,198,111,0.45)"/>
  <text x="384" y="56" font-size="10.5" fill="#5cc66f">the rounding rule — write it down</text>
  <text x="384" y="80" font-size="9.5" fill="#e8e4dc">round to the nearest whole rupee:</text>
  <text x="384" y="100" font-size="9.5" fill="#5cc66f">total = (p + 50) / 100 * 100</text>
  <text x="384" y="119" font-size="9" fill="#9099a8">27684 → 27700 = ₹277.00 · deterministic, testable</text>

  <rect x="368" y="140" width="332" height="90" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="384" y="162" font-size="10.5" fill="#f06868">the integer trap</text>
  <text x="384" y="184" font-size="9.5" fill="#f06868">✗ (metres / 1000) * perKm</text>
  <text x="384" y="200" font-size="9" fill="#9099a8">6400/1000 = 6 in integer maths — 400 m free</text>
  <text x="384" y="220" font-size="9.5" fill="#5cc66f">✓ metres * perKm / 1000 — multiply first</text>

  <rect x="20" y="244" width="330" height="62" rx="8" fill="#14161a" stroke="rgba(251,134,58,0.5)"/>
  <text x="36" y="266" font-size="10" fill="#fb863a">☀️ normal ×1.0  →  15400  =  ₹154.00</text>
  <text x="36" y="290" font-size="10" fill="#fb863a">🔥 surge ×1.8  →  27700  =  ₹277.00</text>

  <rect x="368" y="244" width="332" height="62" rx="8" fill="rgba(251,134,58,0.14)" stroke="rgba(251,134,58,0.55)"/>
  <text x="384" y="266" font-size="10" fill="#fb863a">surge lives in PricingStrategy</text>
  <text x="384" y="290" font-size="10" fill="#5cc66f">matching code changed: 0 lines</text>
</svg>`,
        caption:
          "The red box is a real bug that ships. `metres / 1000 * perKm` in integer arithmetic silently gives away up to 999 metres of every trip. **Multiply before you divide, always** — and keep the surge as a basis-points integer (`18000`) rather than a `1.8` double, so the multiplication stays exact.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Upfront quote versus final fare — the question behind the question",
        text: "Uber shows a price *before* you book. That number is computed from the **estimated** route and duration, and it is a promise. The trip then takes a different road and eleven extra minutes. Do you charge the quote or the meter? Both are defensible; what is not defensible is not having thought about it. The clean answer: **store both** — `quotedFare` on the `Ride` at match time, `finalFare` at completion — charge the quote, and re-price only when reality diverges beyond a threshold (a big detour, a changed destination). Two fields, one rule, and it answers the follow-up completely.",
      },
      {
        type: "code",
        language: "java",
        filename: "pricing, whole",
        code: `record Fare(long basePaise, long distancePaise, long timePaise,
            long surgePaise, long totalPaise) {
    String pretty() { return "Rs." + (totalPaise / 100) + "." + String.format("%02d", totalPaise % 100); }
}

interface PricingStrategy { Fare quote(long metres, long seconds); }

/** surgeBps is basis points: 10000 = x1.0, 18000 = x1.8. Integer all the way down. */
final class StandardPricing implements PricingStrategy {
    private final long basePaise, perKmPaise, perMinPaise, surgeBps;

    StandardPricing(long basePaise, long perKmPaise, long perMinPaise, long surgeBps) {
        this.basePaise = basePaise; this.perKmPaise = perKmPaise;
        this.perMinPaise = perMinPaise; this.surgeBps = surgeBps;
    }

    public Fare quote(long metres, long seconds) {
        long distance = metres * perKmPaise / 1000;      // multiply FIRST, then divide
        long time = seconds * perMinPaise / 60;
        long subtotal = basePaise + distance + time;
        long surged = subtotal * surgeBps / 10000;
        long rounded = (surged + 50) / 100 * 100;        // nearest whole rupee
        return new Fare(basePaise, distance, time, rounded - subtotal, rounded);
    }
}`,
      },

      // ---------------- follow-ups ----------------
      { type: "h", text: "The follow-ups they always ask" },
      {
        type: "ul",
        items: [
          "**Pool / shared rides.** A `Ride` gains a list of stops instead of one pickup and one drop, and matching gains a constraint: *“can this car take a second rider without adding more than N minutes of detour for the first?”* That is a routing question, so it belongs in the `RouteService`, and the change to `DispatchService` is that candidates now include cars in `ON_TRIP` with a free seat. Say that and stop; a full pool matcher is its own interview.",
          "**Scheduled rides.** A ride booked for 7 a.m. tomorrow is not matched now — it is a row in a queue with a `matchAt` timestamp, and a scheduler calls the *same* `requestRide()` a few minutes before. **No new matching logic at all.** That is the answer they want; anything more is over-engineering.",
          "**Driver rating.** A number on `Driver`, updated after each completed ride, and a *signal* that a `MatchingStrategy` may read. Keep it out of the dispatcher — the whole reason ranking is an interface is so a new signal costs one class.",
          "**Cancellation fees.** The rule is a function of the ride's state and the clock: free before `DRIVER_ARRIVED`, or within two minutes of matching; charged after, because the driver already drove. Notice this needs `arrivedAt` on the `Ride`, which is why `DRIVER_ARRIVED` is a real state and not a UI detail.",
          "**The driver's app loses network mid-trip.** Do not panic and do not cancel. Keep `lastSeenAt` and `lastKnownLocation` on the driver, updated by a heartbeat. If the heartbeat stops, the rider's map freezes at the last point and the ride *stays* `IN_PROGRESS` — the trip is happening whether or not the pipe is up. If it stops for many minutes while `AVAILABLE`, sweep the driver to `OFFLINE` and out of the index, so you never offer a ride to a phone in a tunnel.",
          "**A driver who accepts and never moves.** Same sweeper, different timer: an accepted ride with no location change and no arrival for several minutes gets auto-cancelled and re-dispatched, and it counts against the driver. Every timeout in this system is *some* background sweep over ride state — say that once and it covers three questions.",
          "**What changes at ten servers?** This is the big one, and it is two moves. The `GeoIndex` becomes a shared store — Redis `GEOADD` / `GEOSEARCH`, or a sharded service keyed by cell — because an in-process `HashMap` on server 3 does not know about the driver whose ping landed on server 7. And the CAS becomes a **conditional write in that shared store** (a Redis `SET ... NX`, or a compare-and-set on a row version), because `AtomicReference` guards one JVM's memory and nothing else. The *design* does not change — the guarantee just moves to where the state lives.",
          "**How would you test it?** Fix the clock, then assert: two `requestRide` calls against a one-driver city produce exactly one match and one `NO_DRIVERS_FOUND`; an offer at `t` is dead at `t + 15_001` and the driver is back in the index; a completed ride returns the driver to `AVAILABLE`; and a driver moving across a cell boundary is found by exactly one `near()` query, not zero and not two.",
        ],
      },

      // ---------------- budget ----------------
      { type: "h", text: "The 90 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 396" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A ninety minute budget bar split into six segments: five minutes clarifying, eight minutes on entities and the geo index decision, seven minutes on the APIs and class diagram, thirty minutes coding the index, the driver compare and set and requestRide, twenty minutes on the offer timeout loop and the ride state machine, and twenty minutes on pricing, the demo and follow-ups. Below it, an extensibility cost table: adding a ranking signal costs one MatchingStrategy class and zero edits; adding a pricing rule costs one PricingStrategy class and zero edits; adding scheduled rides costs one queue and a scheduler calling the same requestRide; adding a vehicle class costs one filter in the candidate step; adding pool rides costs a change to Ride and to the candidate filter and is expensive; and going multi server costs moving the index and the compare and set into a shared store, which is expensive.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">a 90-minute budget that actually fits</text>

  <rect x="20" y="34" width="42" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="66" y="34" width="62" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="132" y="34" width="56" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="192" y="34" width="236" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="432" y="34" width="126" height="34" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="562" y="34" width="138" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>

  <text x="28" y="56" font-size="9" fill="#9099a8">5m</text>
  <text x="76" y="56" font-size="9" fill="#9099a8">8m</text>
  <text x="142" y="56" font-size="9" fill="#9099a8">7m</text>
  <text x="198" y="56" font-size="9.5" fill="#fb863a">30m</text>
  <text x="438" y="56" font-size="9.5" fill="#5cc66f">20m</text>
  <text x="568" y="56" font-size="9" fill="#9099a8">20m</text>

  <text x="20" y="90" font-size="9.5" fill="#e8e4dc">clarify — how do I find nearby drivers? one offer or many? what is the timeout?</text>
  <text x="20" y="110" font-size="9.5" fill="#e8e4dc">entities + say “I will bucket the map into cells” out loud, with the arithmetic</text>
  <text x="20" y="130" font-size="9.5" fill="#e8e4dc">APIs + class diagram — GeoIndex, MatchingStrategy, PricingStrategy, the Driver slot</text>
  <text x="20" y="150" font-size="9.5" fill="#fb863a">code: GeoIndex.put/remove/near → Driver.tryOffer (the CAS) → requestRide with ring expansion</text>
  <text x="20" y="170" font-size="9.5" fill="#5cc66f">offer timeout loop + tick(now) + the Ride state machine and its terminal releases</text>
  <text x="20" y="190" font-size="9.5" fill="#e8e4dc">pricing → main(): request, time out #1, accept #2, complete, print the fare, then the no-drivers path</text>
  <text x="20" y="208" font-size="9" fill="#6b7280">if you are at minute 55 with no offer loop, stop polishing the index and write it — matching without a timeout is not matching</text>

  <text x="20" y="242" font-size="10.5" fill="#9099a8">what a new feature actually costs</text>
  <rect x="20" y="252" width="680" height="24" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="269" font-size="9" fill="#6b7280">feature</text>
  <text x="300" y="269" font-size="9" fill="#6b7280">files touched</text>
  <text x="596" y="269" font-size="9" fill="#6b7280">verdict</text>

  <rect x="20" y="280" width="680" height="26" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="298" font-size="9.5" fill="#e8e4dc">rank by acceptance rate, not distance</text>
  <text x="300" y="298" font-size="9.5" fill="#9099a8">1 new MatchingStrategy — dispatcher untouched</text>
  <text x="596" y="298" font-size="9.5" fill="#5cc66f">free</text>

  <rect x="20" y="310" width="680" height="26" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="328" font-size="9.5" fill="#e8e4dc">airport surcharge / night surge</text>
  <text x="300" y="328" font-size="9.5" fill="#9099a8">1 new PricingStrategy — matcher untouched</text>
  <text x="596" y="328" font-size="9.5" fill="#5cc66f">free</text>

  <rect x="20" y="340" width="680" height="26" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="358" font-size="9.5" fill="#e8e4dc">scheduled rides · SUV-only requests</text>
  <text x="300" y="358" font-size="9.5" fill="#9099a8">a queue + a scheduler · 1 filter in the candidate step</text>
  <text x="596" y="358" font-size="9.5" fill="#5cc66f">cheap</text>

  <rect x="20" y="370" width="680" height="26" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="34" y="388" font-size="9.5" fill="#fb863a">pool rides · going multi-server</text>
  <text x="300" y="388" font-size="9.5" fill="#9099a8">Ride gains stops · index + CAS move to a shared store</text>
  <text x="596" y="388" font-size="9.5" fill="#fb863a">expensive</text>
</svg>`,
        caption:
          "The orange block on the bar is where the grade is, and the green block is where most people run out of time. **Write the timeout loop before you make the ranking clever.** Then read the bottom row of the table: the two expensive rows are both about state that stopped being local, which is exactly the boundary between this round and a systems-design round.",
      },

      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**`for (Driver d : allDrivers)`.** The one thing the problem exists to test, answered with a linear scan. Everything after it is judged as decoration.",
          "**An index that cannot handle movement.** A sorted list, a static tree built once, anything that makes `updateLocation()` expensive. Drivers move every four seconds; the index is written a thousand times more often than it is read.",
          "**Broadcasting the ride to every nearby driver.** It feels faster and it recreates the double-booking race, moving the rejection to *after* a human committed.",
          "**No timeout on the offer.** A driver who puts the phone in their pocket freezes that rider forever. If there is no deadline in your design, there is no dispatch in your design.",
          "**Check-then-act on the driver's state.** Two riders, one car, no compare-and-set, and the bug is invisible in a single-threaded demo — which is exactly why interviewers ask about it instead of waiting to see it.",
          "**A driver left in `OFFERED` or `ON_TRIP` on some path.** A leaked car, permanently invisible. Usually a cancellation branch that forgot to `release()`.",
          "**`double` for the fare, and `System.currentTimeMillis()` inside the logic.** The first drifts; the second makes the fifteen-second timeout impossible to test, so you will never demo the most interesting behaviour you built.",
          "**Building the `Ride` state machine first because it is comfortable.** At minute sixty you will have beautiful enum transitions and no matcher.",
        ],
      },
    ],

    // ==================================================================
    handsOn: [
      {
        title: "Count the checks — 14 versus 3",
        body:
          "The map opens in **🧭 Grid lookup** mode. Press **🚕 Request ride** and read the counters: `checked this request: 3` and only the rider's cell plus its eight neighbours are shaded. Now press **🔍 Scan everyone** and request again — every one of the fourteen pins flashes and the counter reads `checked this request: 14`. Do it three or four times and watch `checked (cumulative)` pull apart. Fourteen is a toy; the real number on the left is **50,000**, and it is 50,000 *again* on the next request.",
      },
      {
        title: "Watch an offer time out, twice",
        body:
          "In grid mode press **🚕 Request ride** and stop at the ranked list — three candidates with distance and rating, and **#1 gets a visible 15-second countdown**. Press **⏱ Let the offer time out**: #1 is struck through, goes back into the index, and the offer moves to #2 in front of you. Press **🙅 Driver declines** and it moves to #3. Notice what never happens: the other two drivers are never asked at the same time, so there is never a second accept to reject.",
      },
      {
        title: "Fail honestly",
        body:
          "Press **📡 No cars nearby**. The rider pin jumps to the empty corner of the map and the search expands in front of you: ring 1 shades nine cells and finds nobody, ring 2 shades twenty-five and finds nobody, and then the request ends in `NO_DRIVERS_FOUND` rather than reaching across the city for a car twenty minutes away. Read the call line — the ring number is a parameter, and the cap is a design decision.",
      },
      {
        title: "Two riders, one car — the whole point",
        body:
          "Press **🔓 Unguarded**, then **⚔️ Two riders, one driver**. A second rider pin appears, both requests fire in the same tick, both rank the same nearest car, and **both are matched to it** — the pin turns red and `⚠ double-matched: 1` lights up. Now press **🔒 Guarded** and run **⚔️ Two riders, one driver** again: one compare-and-set wins, and you can watch the loser re-rank and take the *next* car in its own list. Same inputs, same ordering, one line of difference.",
      },
      {
        title: "Move the cars, change the price, then build it from memory",
        body:
          "Press **🚗 Drivers move** and watch the call line: `geoIndex.update(d7, cell(3,4) → cell(3,5))` — one removal, one insertion, no rebuild. Then flip **🔥 Surge ×1.8** and read the fare card recompute in paise while the badge says `matching code changed: 0 lines`. Press **↺ Reset**, close this, and write it blank-file in this order: `GeoIndex.put/remove/near(loc, ring)` → `Driver.tryOffer()` as a CAS → `requestRide()` with ring expansion and a sequential offer → `tick(now)` to expire offers → `PricingStrategy.quote()` in integer paise.",
      },
    ],

    // ==================================================================
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "RideSharing.java",
        code: `import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

/* ------------------------------------------------------------------ basics */
record Location(double lat, double lng) {
    /** Straight-line metres. Good enough to RANK candidates. Never used for a fare. */
    double metresTo(Location o) {
        double dLat = (lat - o.lat()) * 111_320.0;
        double dLng = (lng - o.lng()) * 111_320.0 * Math.cos(Math.toRadians(lat));
        return Math.sqrt(dLat * dLat + dLng * dLng);
    }
}

record Rider(String id, String name) {}
record Vehicle(String plate, String model, int seats) {}

/** Road distance is a DIFFERENT question from straight-line distance. Stub it. */
interface RouteService {
    long roadMetres(Location a, Location b);
    long etaSeconds(Location a, Location b);
}

final class StubRoutes implements RouteService {
    public long roadMetres(Location a, Location b) {
        return Math.round(a.metresTo(b) * 1.35);      // a real system calls a routing engine
    }
    public long etaSeconds(Location a, Location b) {
        return roadMetres(a, b) * 3600 / 22_000;      // assume 22 km/h in city traffic
    }
}

/* ---------------------------------------------------------------- geoindex */
/** A geohash by another name: the map chopped into fixed squares. */
final class GeoIndex {
    static final double CELL_DEG = 0.003;                      // ~330 m

    private final Map<Long, Set<String>> cells = new HashMap<>();   // cell -> driver ids
    private final Map<String, Long> whereIs = new HashMap<>();      // driver id -> cell

    static int row(double lat) { return (int) Math.floor(lat / CELL_DEG); }
    static int col(double lng) { return (int) Math.floor(lng / CELL_DEG); }
    static long cellId(int r, int c) { return ((long) r << 32) | (c & 0xffffffffL); }
    static String name(Location at) { return "cell(" + row(at.lat()) + "," + col(at.lng()) + ")"; }

    /** Remove from the old cell, add to the new one. Both O(1). Called constantly. */
    void put(String driverId, Location at) {
        long cell = cellId(row(at.lat()), col(at.lng()));
        Long old = whereIs.get(driverId);
        if (old != null && old == cell) return;                // did not leave the cell: nothing to do
        remove(driverId);
        cells.computeIfAbsent(cell, k -> new HashSet<>()).add(driverId);
        whereIs.put(driverId, cell);
    }

    void remove(String driverId) {
        Long old = whereIs.remove(driverId);
        if (old == null) return;
        Set<String> set = cells.get(old);
        if (set != null && set.remove(driverId) && set.isEmpty()) cells.remove(old);
    }

    boolean holds(String driverId) { return whereIs.containsKey(driverId); }

    /** Everyone in the (2*ring+1) x (2*ring+1) square of cells around "at". */
    Set<String> near(Location at, int ring) {
        int r0 = row(at.lat()), c0 = col(at.lng());
        Set<String> out = new LinkedHashSet<>();
        for (int r = r0 - ring; r <= r0 + ring; r++)
            for (int c = c0 - ring; c <= c0 + ring; c++) {
                Set<String> s = cells.get(cellId(r, c));
                if (s != null) out.addAll(s);
            }
        return out;
    }
}

/* ------------------------------------------------------------------ driver */
enum DriverState { OFFLINE, AVAILABLE, OFFERED, ON_TRIP }

/** state + rideId + deadline swapped TOGETHER, so they can never disagree. */
record Slot(DriverState state, String rideId, long expiresAt) {}

final class Driver {
    final String id, name;
    final double rating;
    final Vehicle vehicle;
    volatile Location at;
    private final AtomicReference<Slot> slot =
        new AtomicReference<>(new Slot(DriverState.OFFLINE, null, 0L));

    Driver(String id, String name, double rating, Vehicle vehicle) {
        this.id = id; this.name = name; this.rating = rating; this.vehicle = vehicle;
    }

    DriverState state() { return slot.get().state(); }

    boolean goOnline() {
        Slot cur = slot.get();
        return cur.state() == DriverState.OFFLINE
            && slot.compareAndSet(cur, new Slot(DriverState.AVAILABLE, null, 0L));
    }

    /** THE method. Exactly one concurrent caller can win this. */
    boolean tryOffer(String rideId, long expiresAt) {
        Slot cur = slot.get();
        if (cur.state() != DriverState.AVAILABLE) return false;
        return slot.compareAndSet(cur, new Slot(DriverState.OFFERED, rideId, expiresAt));
    }

    boolean confirm(String rideId) {
        Slot cur = slot.get();
        if (cur.state() != DriverState.OFFERED || !rideId.equals(cur.rideId())) return false;
        return slot.compareAndSet(cur, new Slot(DriverState.ON_TRIP, rideId, 0L));
    }

    /** Declined, expired, cancelled or completed — back into the pool. */
    boolean release(String rideId) {
        Slot cur = slot.get();
        if (cur.state() == DriverState.OFFLINE || cur.state() == DriverState.AVAILABLE) return false;
        if (!rideId.equals(cur.rideId())) return false;
        return slot.compareAndSet(cur, new Slot(DriverState.AVAILABLE, null, 0L));
    }
}

/* ------------------------------------------------------------- strategies */
interface MatchingStrategy { List<Driver> rank(Location pickup, List<Driver> pool); }

final class NearestFirst implements MatchingStrategy {
    public List<Driver> rank(Location pickup, List<Driver> pool) {
        List<Driver> out = new ArrayList<>(pool);
        out.sort(Comparator.comparingDouble(d -> d.at.metresTo(pickup)));
        return out;
    }
}

/** Same interface, a new signal, and DispatchService does not change one line. */
final class NearestThenRating implements MatchingStrategy {
    public List<Driver> rank(Location pickup, List<Driver> pool) {
        List<Driver> out = new ArrayList<>(pool);
        out.sort(Comparator.comparingDouble(d -> d.at.metresTo(pickup) * (1 + (5.0 - d.rating) * 0.10)));
        return out;
    }
}

record Fare(long basePaise, long distancePaise, long timePaise, long surgePaise, long totalPaise) {
    String pretty() { return "Rs." + (totalPaise / 100) + "." + String.format("%02d", totalPaise % 100); }
}

interface PricingStrategy { Fare quote(long metres, long seconds); }

/** surgeBps is basis points: 10000 = x1.0, 18000 = x1.8. Integers all the way down. */
final class StandardPricing implements PricingStrategy {
    private final long basePaise, perKmPaise, perMinPaise, surgeBps;
    StandardPricing(long basePaise, long perKmPaise, long perMinPaise, long surgeBps) {
        this.basePaise = basePaise; this.perKmPaise = perKmPaise;
        this.perMinPaise = perMinPaise; this.surgeBps = surgeBps;
    }
    public Fare quote(long metres, long seconds) {
        long distance = metres * perKmPaise / 1000;       // multiply FIRST, then divide
        long time = seconds * perMinPaise / 60;
        long subtotal = basePaise + distance + time;
        long surged = subtotal * surgeBps / 10000;
        long rounded = (surged + 50) / 100 * 100;         // nearest whole rupee, deterministic
        return new Fare(basePaise, distance, time, rounded - subtotal, rounded);
    }
}

/* -------------------------------------------------------------------- ride */
enum RideState {
    REQUESTED, MATCHED, DRIVER_ARRIVED, IN_PROGRESS, COMPLETED,
    CANCELLED_BY_RIDER, CANCELLED_BY_DRIVER, NO_DRIVERS_FOUND
}

final class Ride {
    private static final Map<RideState, Set<RideState>> LEGAL = Map.of(
        RideState.REQUESTED, Set.of(RideState.MATCHED, RideState.NO_DRIVERS_FOUND,
                                    RideState.CANCELLED_BY_RIDER),
        RideState.MATCHED, Set.of(RideState.DRIVER_ARRIVED, RideState.CANCELLED_BY_RIDER,
                                  RideState.CANCELLED_BY_DRIVER),
        RideState.DRIVER_ARRIVED, Set.of(RideState.IN_PROGRESS, RideState.CANCELLED_BY_RIDER,
                                         RideState.CANCELLED_BY_DRIVER),
        RideState.IN_PROGRESS, Set.of(RideState.COMPLETED)
    );

    final String id;
    final Rider rider;
    final Location pickup, drop;
    RideState state = RideState.REQUESTED;
    Driver driver;
    String offeredTo;
    long offerExpiresAt, startedAt;
    Fare quotedFare, finalFare;
    final Deque<String> candidates = new ArrayDeque<>();
    final Set<String> tried = new HashSet<>();

    Ride(String id, Rider rider, Location pickup, Location drop) {
        this.id = id; this.rider = rider; this.pickup = pickup; this.drop = drop;
    }

    /** One table, one method. An illegal move is an exception, not a silent bug. */
    void transitionTo(RideState next) {
        if (!LEGAL.getOrDefault(state, Set.of()).contains(next))
            throw new IllegalStateException(id + ": " + state + " -> " + next + " is not legal");
        state = next;
    }
}

/* -------------------------------------------------------------- dispatcher */
final class DispatchService {
    static final long OFFER_TTL_MS = 15_000;
    static final int MAX_RING = 3;

    private final Map<String, Driver> drivers = new LinkedHashMap<>();
    private final Map<String, Ride> rides = new LinkedHashMap<>();
    private final GeoIndex index = new GeoIndex();
    private final MatchingStrategy matcher;
    private final PricingStrategy pricing;
    private final RouteService routes;
    private int rideSeq;
    int lastChecked, lastRing;                     // just so the demo can print them

    DispatchService(MatchingStrategy m, PricingStrategy p, RouteService r) {
        this.matcher = m; this.pricing = p; this.routes = r;
    }

    void register(Driver d, Location at) { drivers.put(d.id, d); d.at = at; }

    void goOnline(String driverId, Location at) {
        Driver d = drivers.get(driverId);
        d.at = at;
        if (d.goOnline()) index.put(driverId, at);
    }

    /** Runs a thousand times more often than requestRide. Must stay O(1). */
    void updateLocation(String driverId, Location at) {
        Driver d = drivers.get(driverId);
        d.at = at;
        if (d.state() == DriverState.AVAILABLE) index.put(driverId, at);   // only matchable drivers are indexed
    }

    private List<Driver> availableNear(Ride ride, int ring) {
        List<Driver> pool = new ArrayList<>();
        for (String id : index.near(ride.pickup, ring)) {
            lastChecked++;                                        // this is the number the round is about
            Driver d = drivers.get(id);
            if (d != null && d.state() == DriverState.AVAILABLE && !ride.tried.contains(id)) pool.add(d);
        }
        return pool;
    }

    Ride requestRide(Rider rider, Location pickup, Location drop, long now) {
        Ride ride = new Ride("r" + (++rideSeq), rider, pickup, drop);
        rides.put(ride.id, ride);
        lastChecked = 0;
        if (!expandAndOffer(ride, 1, now)) ride.transitionTo(RideState.NO_DRIVERS_FOUND);
        return ride;
    }

    /** Ring by ring outward. Stop at the first ring that produces an accepted offer. */
    private boolean expandAndOffer(Ride ride, int fromRing, long now) {
        for (int ring = fromRing; ring <= MAX_RING; ring++) {
            lastRing = ring;
            List<Driver> pool = availableNear(ride, ring);
            if (pool.isEmpty()) continue;
            for (Driver d : matcher.rank(ride.pickup, pool)) ride.candidates.addLast(d.id);
            if (offerNext(ride, now)) return true;
        }
        return false;
    }

    /** Offer to ONE driver, with a deadline. Never a broadcast. */
    private boolean offerNext(Ride ride, long now) {
        while (!ride.candidates.isEmpty()) {
            String id = ride.candidates.pollFirst();
            ride.tried.add(id);
            Driver d = drivers.get(id);
            if (d == null) continue;
            if (!d.tryOffer(ride.id, now + OFFER_TTL_MS)) continue;   // CAS lost — somebody beat us here
            index.remove(id);                                         // offered => not a candidate for anyone
            ride.offeredTo = id;
            ride.offerExpiresAt = now + OFFER_TTL_MS;
            return true;
        }
        return false;
    }

    private void withdraw(Ride ride) {
        Driver d = drivers.get(ride.offeredTo);
        if (d != null && d.release(ride.id)) index.put(d.id, d.at);    // straight back into the pool
        ride.offeredTo = null;
    }

    boolean accept(String rideId, String driverId, long now) {
        Ride ride = rides.get(rideId);
        if (ride == null || ride.state != RideState.REQUESTED) return false;
        if (!driverId.equals(ride.offeredTo) || now > ride.offerExpiresAt) return false;
        Driver d = drivers.get(driverId);
        if (!d.confirm(rideId)) return false;
        ride.driver = d;
        ride.offeredTo = null;
        ride.quotedFare = pricing.quote(routes.roadMetres(ride.pickup, ride.drop),
                                        routes.etaSeconds(ride.pickup, ride.drop));
        ride.transitionTo(RideState.MATCHED);
        return true;
    }

    boolean decline(String rideId, String driverId, long now) {
        Ride ride = rides.get(rideId);
        if (ride == null || !driverId.equals(ride.offeredTo)) return false;
        withdraw(ride);
        if (!offerNext(ride, now) && !expandAndOffer(ride, 2, now))
            ride.transitionTo(RideState.NO_DRIVERS_FOUND);
        return true;
    }

    /** Time is a PARAMETER. That is the only reason the 15-second rule is testable. */
    void tick(long now) {
        for (Ride ride : rides.values()) {
            if (ride.state != RideState.REQUESTED || ride.offeredTo == null) continue;
            if (now <= ride.offerExpiresAt) continue;
            withdraw(ride);
            if (!offerNext(ride, now) && !expandAndOffer(ride, 2, now))
                ride.transitionTo(RideState.NO_DRIVERS_FOUND);
        }
    }

    void driverArrived(String rideId) { rides.get(rideId).transitionTo(RideState.DRIVER_ARRIVED); }

    void startTrip(String rideId, long now) {
        Ride ride = rides.get(rideId);
        ride.startedAt = now;
        ride.transitionTo(RideState.IN_PROGRESS);
    }

    Fare complete(String rideId, long actualMetres, long now) {
        Ride ride = rides.get(rideId);
        ride.finalFare = pricing.quote(actualMetres, (now - ride.startedAt) / 1000);
        ride.transitionTo(RideState.COMPLETED);
        endRide(ride);
        return ride.finalFare;
    }

    void cancelByRider(String rideId, long now) {
        Ride ride = rides.get(rideId);
        if (ride.offeredTo != null) withdraw(ride);
        ride.transitionTo(RideState.CANCELLED_BY_RIDER);
        endRide(ride);
    }

    /** EVERY terminal path goes through here, or you leak a car. */
    private void endRide(Ride ride) {
        Driver d = ride.driver;
        if (d != null && d.release(ride.id)) index.put(d.id, d.at);
    }

    Ride ride(String id) { return rides.get(id); }
    String cellOf(String driverId) { return GeoIndex.name(drivers.get(driverId).at); }
}

/* -------------------------------------------------------------------- demo */
public class Main {
    public static void main(String[] args) {
        DispatchService svc = new DispatchService(
            new NearestThenRating(),
            new StandardPricing(5000, 1200, 150, 18000),   // base Rs.50, Rs.12/km, Rs.1.50/min, x1.8
            new StubRoutes());

        Driver d1 = new Driver("d1", "Rahul", 4.9, new Vehicle("KA01AB1234", "Swift", 4));
        Driver d3 = new Driver("d3", "Meena", 4.6, new Vehicle("KA05CD5678", "Baleno", 4));
        Driver d7 = new Driver("d7", "Iqbal", 4.8, new Vehicle("KA03EF9012", "i20", 4));
        Driver d9 = new Driver("d9", "Farida", 4.7, new Vehicle("KA09GH3456", "Dzire", 4));

        svc.register(d1, new Location(12.9710, 77.5940));
        svc.register(d3, new Location(12.9702, 77.5952));
        svc.register(d7, new Location(12.9688, 77.5961));
        svc.register(d9, new Location(12.9500, 77.6300));          // far side of town
        svc.goOnline("d1", d1.at); svc.goOnline("d3", d3.at);
        svc.goOnline("d7", d7.at); svc.goOnline("d9", d9.at);

        Location pickup = new Location(12.9705, 77.5948);
        Location drop = new Location(12.9950, 77.6400);
        Rider anita = new Rider("u1", "Anita"), bala = new Rider("u2", "Bala");

        System.out.println("-- Anita taps Book at t=0 --");
        Ride r1 = svc.requestRide(anita, pickup, drop, 0);
        System.out.println("   ring " + svc.lastRing + ", checked " + svc.lastChecked
                + " drivers (not " + 50_000 + ") -> offered to " + r1.offeredTo
                + ", expires t=" + r1.offerExpiresAt);

        System.out.println("-- Bala taps Book at the SAME instant --");
        Ride r2 = svc.requestRide(bala, pickup, drop, 0);
        System.out.println("   d3 is OFFERED, so it is not in the index at all -> offered to "
                + r2.offeredTo);

        System.out.println("-- nobody answers Anita's offer --");
        svc.tick(15_001);
        System.out.println("   d3 expired and is back in the index; d1 is taken, so the CAS lost");
        System.out.println("   Anita's offer moved to " + r1.offeredTo);

        System.out.println("-- both drivers accept --");
        System.out.println("   Bala + d1: " + svc.accept(r2.id, "d1", 4_200));
        System.out.println("   Anita + d7: " + svc.accept(r1.id, "d7", 16_400));
        System.out.println("   quoted (surge x1.8): " + r1.quotedFare.pretty()
                + "  = " + r1.quotedFare.basePaise() + " + " + r1.quotedFare.distancePaise()
                + " + " + r1.quotedFare.timePaise() + " + " + r1.quotedFare.surgePaise() + " paise");

        System.out.println("-- the trip --");
        svc.driverArrived(r1.id);
        svc.startTrip(r1.id, 40_000);
        Fare fin = svc.complete(r1.id, 8_200, 1_380_000);
        System.out.println("   state=" + r1.state + "  final=" + fin.pretty()
                + "  d7 is " + d7.state() + " again");

        System.out.println("-- d7 drives east across a cell boundary --");
        System.out.println("   before: " + svc.cellOf("d7"));
        svc.updateLocation("d7", new Location(12.9688, 77.5995));
        System.out.println("   after:  " + svc.cellOf("d7") + "   (one remove, one add)");

        System.out.println("-- a rider in an empty part of town --");
        Ride r3 = svc.requestRide(anita, new Location(12.8000, 77.4000), drop, 2_000_000);
        System.out.println("   rings tried: " + DispatchService.MAX_RING
                + ", checked " + svc.lastChecked + " -> " + r3.state);
    }
}

/* ---------------------------------------------------------------- output ---
-- Anita taps Book at t=0 --
   ring 1, checked 3 drivers (not 50000) -> offered to d3, expires t=15000
-- Bala taps Book at the SAME instant --
   d3 is OFFERED, so it is not in the index at all -> offered to d1
-- nobody answers Anita's offer --
   d3 expired and is back in the index; d1 is taken, so the CAS lost
   Anita's offer moved to d7
-- both drivers accept --
   Bala + d1: true
   Anita + d7: true
   quoted (surge x1.8): Rs.309.00  = 5000 + 9088 + 3097 + 13715 paise
-- the trip --
   state=COMPLETED  final=Rs.327.00  d7 is AVAILABLE again
-- d7 drives east across a cell boundary --
   before: cell(4322,25865)
   after:  cell(4322,25866)   (one remove, one add)
-- a rider in an empty part of town --
   rings tried: 3, checked 0 -> NO_DRIVERS_FOUND
--------------------------------------------------------------------------- */`,
      },
      {
        label: "Python",
        language: "python",
        filename: "ride_sharing.py",
        code: `import math
from abc import ABC, abstractmethod
from collections import deque
from dataclasses import dataclass, field
from enum import Enum
from threading import Lock

CELL_DEG = 0.003          # ~330 m
OFFER_TTL_MS = 15_000
MAX_RING = 3


# ------------------------------------------------------------------ basics
@dataclass(frozen=True)
class Location:
    lat: float
    lng: float

    def metres_to(self, o: "Location") -> float:
        """Straight line. Fine for RANKING candidates. Never used for a fare."""
        d_lat = (self.lat - o.lat) * 111_320.0
        d_lng = (self.lng - o.lng) * 111_320.0 * math.cos(math.radians(self.lat))
        return math.hypot(d_lat, d_lng)


@dataclass(frozen=True)
class Rider:
    id: str
    name: str


@dataclass(frozen=True)
class Vehicle:
    plate: str
    model: str
    seats: int


class RouteService(ABC):
    @abstractmethod
    def road_metres(self, a: Location, b: Location) -> int: ...
    @abstractmethod
    def eta_seconds(self, a: Location, b: Location) -> int: ...


class StubRoutes(RouteService):
    def road_metres(self, a: Location, b: Location) -> int:
        return round(a.metres_to(b) * 1.35)          # a real system calls a routing engine

    def eta_seconds(self, a: Location, b: Location) -> int:
        return self.road_metres(a, b) * 3600 // 22_000   # 22 km/h in city traffic


# ---------------------------------------------------------------- geoindex
class GeoIndex:
    """A geohash by another name: the map chopped into fixed squares."""

    def __init__(self) -> None:
        self.cells: dict[tuple[int, int], set[str]] = {}
        self.where_is: dict[str, tuple[int, int]] = {}

    @staticmethod
    def cell_of(at: Location) -> tuple[int, int]:
        return (math.floor(at.lat / CELL_DEG), math.floor(at.lng / CELL_DEG))

    def put(self, driver_id: str, at: Location) -> None:
        cell = self.cell_of(at)
        if self.where_is.get(driver_id) == cell:
            return                                    # did not leave the cell
        self.remove(driver_id)                        # O(1) out of the old set
        self.cells.setdefault(cell, set()).add(driver_id)   # O(1) into the new one
        self.where_is[driver_id] = cell

    def remove(self, driver_id: str) -> None:
        old = self.where_is.pop(driver_id, None)
        if old is None:
            return
        bucket = self.cells.get(old)
        if bucket is not None:
            bucket.discard(driver_id)
            if not bucket:
                del self.cells[old]

    def near(self, at: Location, ring: int) -> list[str]:
        r0, c0 = self.cell_of(at)
        out: list[str] = []
        for r in range(r0 - ring, r0 + ring + 1):
            for c in range(c0 - ring, c0 + ring + 1):
                out.extend(self.cells.get((r, c), ()))
        return out


# ------------------------------------------------------------------ driver
class DriverState(Enum):
    OFFLINE = "OFFLINE"
    AVAILABLE = "AVAILABLE"
    OFFERED = "OFFERED"
    ON_TRIP = "ON_TRIP"


class Driver:
    """state + ride_id + deadline change together, under one tiny lock."""

    def __init__(self, id: str, name: str, rating: float, vehicle: Vehicle) -> None:
        self.id, self.name, self.rating, self.vehicle = id, name, rating, vehicle
        self.at: Location | None = None
        self.state = DriverState.OFFLINE
        self.ride_id: str | None = None
        self.expires_at = 0
        self._lock = Lock()                           # per driver, never global

    def go_online(self) -> bool:
        with self._lock:
            if self.state is not DriverState.OFFLINE:
                return False
            self.state, self.ride_id = DriverState.AVAILABLE, None
            return True

    def try_offer(self, ride_id: str, expires_at: int) -> bool:
        """THE method. Exactly one concurrent caller can win it."""
        with self._lock:
            if self.state is not DriverState.AVAILABLE:
                return False
            self.state, self.ride_id, self.expires_at = DriverState.OFFERED, ride_id, expires_at
            return True

    def confirm(self, ride_id: str) -> bool:
        with self._lock:
            if self.state is not DriverState.OFFERED or self.ride_id != ride_id:
                return False
            self.state = DriverState.ON_TRIP
            return True

    def release(self, ride_id: str) -> bool:
        with self._lock:
            if self.state in (DriverState.OFFLINE, DriverState.AVAILABLE):
                return False
            if self.ride_id != ride_id:
                return False
            self.state, self.ride_id, self.expires_at = DriverState.AVAILABLE, None, 0
            return True


# -------------------------------------------------------------- strategies
class MatchingStrategy(ABC):
    @abstractmethod
    def rank(self, pickup: Location, pool: list[Driver]) -> list[Driver]: ...


class NearestFirst(MatchingStrategy):
    def rank(self, pickup, pool):
        return sorted(pool, key=lambda d: d.at.metres_to(pickup))


class NearestThenRating(MatchingStrategy):
    """A new signal costs one class. The dispatcher does not change."""
    def rank(self, pickup, pool):
        return sorted(pool, key=lambda d: d.at.metres_to(pickup) * (1 + (5.0 - d.rating) * 0.10))


@dataclass(frozen=True)
class Fare:
    base_paise: int
    distance_paise: int
    time_paise: int
    surge_paise: int
    total_paise: int

    def pretty(self) -> str:
        return f"Rs.{self.total_paise // 100}.{self.total_paise % 100:02d}"


class PricingStrategy(ABC):
    @abstractmethod
    def quote(self, metres: int, seconds: int) -> Fare: ...


class StandardPricing(PricingStrategy):
    """surge_bps is basis points: 10000 = x1.0, 18000 = x1.8. Integers throughout."""

    def __init__(self, base_paise: int, per_km_paise: int, per_min_paise: int, surge_bps: int):
        self.base_paise, self.per_km_paise = base_paise, per_km_paise
        self.per_min_paise, self.surge_bps = per_min_paise, surge_bps

    def quote(self, metres: int, seconds: int) -> Fare:
        distance = metres * self.per_km_paise // 1000        # multiply FIRST
        time = seconds * self.per_min_paise // 60
        subtotal = self.base_paise + distance + time
        surged = subtotal * self.surge_bps // 10000
        rounded = (surged + 50) // 100 * 100                 # nearest whole rupee
        return Fare(self.base_paise, distance, time, rounded - subtotal, rounded)


# -------------------------------------------------------------------- ride
class RideState(Enum):
    REQUESTED = "REQUESTED"
    MATCHED = "MATCHED"
    DRIVER_ARRIVED = "DRIVER_ARRIVED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED_BY_RIDER = "CANCELLED_BY_RIDER"
    CANCELLED_BY_DRIVER = "CANCELLED_BY_DRIVER"
    NO_DRIVERS_FOUND = "NO_DRIVERS_FOUND"


LEGAL = {
    RideState.REQUESTED: {RideState.MATCHED, RideState.NO_DRIVERS_FOUND,
                          RideState.CANCELLED_BY_RIDER},
    RideState.MATCHED: {RideState.DRIVER_ARRIVED, RideState.CANCELLED_BY_RIDER,
                        RideState.CANCELLED_BY_DRIVER},
    RideState.DRIVER_ARRIVED: {RideState.IN_PROGRESS, RideState.CANCELLED_BY_RIDER,
                               RideState.CANCELLED_BY_DRIVER},
    RideState.IN_PROGRESS: {RideState.COMPLETED},
}


@dataclass
class Ride:
    id: str
    rider: Rider
    pickup: Location
    drop: Location
    state: RideState = RideState.REQUESTED
    driver: Driver | None = None
    offered_to: str | None = None
    offer_expires_at: int = 0
    started_at: int = 0
    quoted_fare: Fare | None = None
    final_fare: Fare | None = None
    candidates: deque = field(default_factory=deque)
    tried: set = field(default_factory=set)

    def transition_to(self, nxt: RideState) -> None:
        if nxt not in LEGAL.get(self.state, set()):
            raise ValueError(f"{self.id}: {self.state.value} -> {nxt.value} is not legal")
        self.state = nxt


# -------------------------------------------------------------- dispatcher
class DispatchService:
    def __init__(self, matcher: MatchingStrategy, pricing: PricingStrategy, routes: RouteService):
        self.matcher, self.pricing, self.routes = matcher, pricing, routes
        self.drivers: dict[str, Driver] = {}
        self.rides: dict[str, Ride] = {}
        self.index = GeoIndex()
        self.last_checked = 0
        self.last_ring = 0
        self._seq = 0

    def register(self, d: Driver, at: Location) -> None:
        self.drivers[d.id] = d
        d.at = at

    def go_online(self, driver_id: str, at: Location) -> None:
        d = self.drivers[driver_id]
        d.at = at
        if d.go_online():
            self.index.put(driver_id, at)

    def update_location(self, driver_id: str, at: Location) -> None:
        """Runs a thousand times more often than request_ride. Stays O(1)."""
        d = self.drivers[driver_id]
        d.at = at
        if d.state is DriverState.AVAILABLE:
            self.index.put(driver_id, at)             # only matchable drivers are indexed

    def _available_near(self, ride: Ride, ring: int) -> list[Driver]:
        pool = []
        for did in self.index.near(ride.pickup, ring):
            self.last_checked += 1                    # the number the whole round is about
            d = self.drivers.get(did)
            if d and d.state is DriverState.AVAILABLE and did not in ride.tried:
                pool.append(d)
        return pool

    def request_ride(self, rider: Rider, pickup: Location, drop: Location, now: int) -> Ride:
        self._seq += 1
        ride = Ride(f"r{self._seq}", rider, pickup, drop)
        self.rides[ride.id] = ride
        self.last_checked = 0
        if not self._expand_and_offer(ride, 1, now):
            ride.transition_to(RideState.NO_DRIVERS_FOUND)
        return ride

    def _expand_and_offer(self, ride: Ride, from_ring: int, now: int) -> bool:
        for ring in range(from_ring, MAX_RING + 1):
            self.last_ring = ring
            pool = self._available_near(ride, ring)
            if not pool:
                continue
            ride.candidates.extend(d.id for d in self.matcher.rank(ride.pickup, pool))
            if self._offer_next(ride, now):
                return True
        return False

    def _offer_next(self, ride: Ride, now: int) -> bool:
        """One driver at a time, with a deadline. Never a broadcast."""
        while ride.candidates:
            did = ride.candidates.popleft()
            ride.tried.add(did)
            d = self.drivers.get(did)
            if d is None or not d.try_offer(ride.id, now + OFFER_TTL_MS):
                continue                              # lost the race — just take the next one
            self.index.remove(did)                    # offered => not a candidate for anyone
            ride.offered_to = did
            ride.offer_expires_at = now + OFFER_TTL_MS
            return True
        return False

    def _withdraw(self, ride: Ride) -> None:
        d = self.drivers.get(ride.offered_to)
        if d and d.release(ride.id):
            self.index.put(d.id, d.at)                # straight back into the pool
        ride.offered_to = None

    def accept(self, ride_id: str, driver_id: str, now: int) -> bool:
        ride = self.rides.get(ride_id)
        if ride is None or ride.state is not RideState.REQUESTED:
            return False
        if driver_id != ride.offered_to or now > ride.offer_expires_at:
            return False
        d = self.drivers[driver_id]
        if not d.confirm(ride_id):
            return False
        ride.driver, ride.offered_to = d, None
        ride.quoted_fare = self.pricing.quote(
            self.routes.road_metres(ride.pickup, ride.drop),
            self.routes.eta_seconds(ride.pickup, ride.drop))
        ride.transition_to(RideState.MATCHED)
        return True

    def decline(self, ride_id: str, driver_id: str, now: int) -> bool:
        ride = self.rides.get(ride_id)
        if ride is None or driver_id != ride.offered_to:
            return False
        self._withdraw(ride)
        if not self._offer_next(ride, now) and not self._expand_and_offer(ride, 2, now):
            ride.transition_to(RideState.NO_DRIVERS_FOUND)
        return True

    def tick(self, now: int) -> None:
        """Time is a PARAMETER — that is the only reason the 15s rule is testable."""
        for ride in self.rides.values():
            if ride.state is not RideState.REQUESTED or ride.offered_to is None:
                continue
            if now <= ride.offer_expires_at:
                continue
            self._withdraw(ride)
            if not self._offer_next(ride, now) and not self._expand_and_offer(ride, 2, now):
                ride.transition_to(RideState.NO_DRIVERS_FOUND)

    def driver_arrived(self, ride_id: str) -> None:
        self.rides[ride_id].transition_to(RideState.DRIVER_ARRIVED)

    def start_trip(self, ride_id: str, now: int) -> None:
        ride = self.rides[ride_id]
        ride.started_at = now
        ride.transition_to(RideState.IN_PROGRESS)

    def complete(self, ride_id: str, actual_metres: int, now: int) -> Fare:
        ride = self.rides[ride_id]
        ride.final_fare = self.pricing.quote(actual_metres, (now - ride.started_at) // 1000)
        ride.transition_to(RideState.COMPLETED)
        self._end(ride)
        return ride.final_fare

    def cancel_by_rider(self, ride_id: str) -> None:
        ride = self.rides[ride_id]
        if ride.offered_to:
            self._withdraw(ride)
        ride.transition_to(RideState.CANCELLED_BY_RIDER)
        self._end(ride)

    def _end(self, ride: Ride) -> None:
        """EVERY terminal path goes through here, or you leak a car."""
        if ride.driver and ride.driver.release(ride.id):
            self.index.put(ride.driver.id, ride.driver.at)


# -------------------------------------------------------------------- demo
if __name__ == "__main__":
    svc = DispatchService(NearestThenRating(),
                          StandardPricing(5000, 1200, 150, 18000),
                          StubRoutes())

    d1 = Driver("d1", "Rahul", 4.9, Vehicle("KA01AB1234", "Swift", 4))
    d3 = Driver("d3", "Meena", 4.6, Vehicle("KA05CD5678", "Baleno", 4))
    d7 = Driver("d7", "Iqbal", 4.8, Vehicle("KA03EF9012", "i20", 4))
    d9 = Driver("d9", "Farida", 4.7, Vehicle("KA09GH3456", "Dzire", 4))

    for drv, loc in [(d1, Location(12.9710, 77.5940)), (d3, Location(12.9702, 77.5952)),
                     (d7, Location(12.9688, 77.5961)), (d9, Location(12.9500, 77.6300))]:
        svc.register(drv, loc)
        svc.go_online(drv.id, loc)

    pickup, drop = Location(12.9705, 77.5948), Location(12.9950, 77.6400)
    anita, bala = Rider("u1", "Anita"), Rider("u2", "Bala")

    print("-- Anita taps Book at t=0 --")
    r1 = svc.request_ride(anita, pickup, drop, 0)
    print(f"   ring {svc.last_ring}, checked {svc.last_checked} drivers (not 50000)"
          f" -> offered to {r1.offered_to}, expires t={r1.offer_expires_at}")

    print("-- Bala taps Book at the SAME instant --")
    r2 = svc.request_ride(bala, pickup, drop, 0)
    print(f"   d3 is OFFERED, so it is not in the index at all -> offered to {r2.offered_to}")

    print("-- nobody answers Anita's offer --")
    svc.tick(15_001)
    print("   d3 expired and is back in the index; d1 is taken, so the CAS lost")
    print(f"   Anita's offer moved to {r1.offered_to}")

    print("-- both drivers accept --")
    print("   Bala + d1:", svc.accept(r2.id, "d1", 4_200))
    print("   Anita + d7:", svc.accept(r1.id, "d7", 16_400))
    q = r1.quoted_fare
    print(f"   quoted (surge x1.8): {q.pretty()}  = {q.base_paise} + {q.distance_paise}"
          f" + {q.time_paise} + {q.surge_paise} paise")

    print("-- the trip --")
    svc.driver_arrived(r1.id)
    svc.start_trip(r1.id, 40_000)
    fin = svc.complete(r1.id, 8_200, 1_380_000)
    print(f"   state={r1.state.value}  final={fin.pretty()}  d7 is {d7.state.value} again")

    print("-- d7 drives east across a cell boundary --")
    print("   before:", GeoIndex.cell_of(d7.at))
    svc.update_location("d7", Location(12.9688, 77.5995))
    print("   after: ", GeoIndex.cell_of(d7.at), "  (one remove, one add)")

    print("-- a rider in an empty part of town --")
    r3 = svc.request_ride(anita, Location(12.8000, 77.4000), drop, 2_000_000)
    print(f"   rings tried: {MAX_RING}, checked {svc.last_checked} -> {r3.state.value}")

# ---------------------------------------------------------------- output ---
# -- Anita taps Book at t=0 --
#    ring 1, checked 3 drivers (not 50000) -> offered to d3, expires t=15000
# -- Bala taps Book at the SAME instant --
#    d3 is OFFERED, so it is not in the index at all -> offered to d1
# -- nobody answers Anita's offer --
#    d3 expired and is back in the index; d1 is taken, so the CAS lost
#    Anita's offer moved to d7
# -- both drivers accept --
#    Bala + d1: True
#    Anita + d7: True
#    quoted (surge x1.8): Rs.309.00  = 5000 + 9088 + 3097 + 13715 paise
# -- the trip --
#    state=COMPLETED  final=Rs.327.00  d7 is AVAILABLE again
# -- d7 drives east across a cell boundary --
#    before: (4322, 25865)
#    after:  (4322, 25866)   (one remove, one add)
# -- a rider in an empty part of town --
#    rings tried: 3, checked 0 -> NO_DRIVERS_FOUND
# ---------------------------------------------------------------------------`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "ride_sharing.cpp",
        code: `#include <algorithm>
#include <atomic>
#include <cmath>
#include <cstdint>
#include <deque>
#include <iostream>
#include <memory>
#include <mutex>
#include <set>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

static constexpr double CELL_DEG = 0.003;      // ~330 m
static constexpr long long OFFER_TTL_MS = 15000;
static constexpr int MAX_RING = 3;

/* ------------------------------------------------------------------ basics */
struct Location {
    double lat = 0, lng = 0;
    double metresTo(const Location& o) const {          // straight line: RANKING only
        double dLat = (lat - o.lat) * 111320.0;
        double dLng = (lng - o.lng) * 111320.0 * std::cos(lat * M_PI / 180.0);
        return std::sqrt(dLat * dLat + dLng * dLng);
    }
};

struct Rider  { std::string id, name; };
struct Vehicle { std::string plate, model; int seats = 4; };

struct RouteService {
    virtual ~RouteService() = default;
    virtual long long roadMetres(const Location&, const Location&) const = 0;
    virtual long long etaSeconds(const Location&, const Location&) const = 0;
};

struct StubRoutes : RouteService {
    long long roadMetres(const Location& a, const Location& b) const override {
        return llround(a.metresTo(b) * 1.35);           // a real system calls a routing engine
    }
    long long etaSeconds(const Location& a, const Location& b) const override {
        return roadMetres(a, b) * 3600 / 22000;         // 22 km/h in city traffic
    }
};

/* ---------------------------------------------------------------- geoindex */
struct CellKey {
    long long r = 0, c = 0;
    bool operator==(const CellKey& o) const { return r == o.r && c == o.c; }
};
struct CellHash {
    size_t operator()(const CellKey& k) const {
        return std::hash<long long>{}(k.r * 73856093LL ^ k.c * 19349663LL);
    }
};

class GeoIndex {
public:
    static CellKey cellOf(const Location& at) {
        return { (long long)std::floor(at.lat / CELL_DEG), (long long)std::floor(at.lng / CELL_DEG) };
    }

    /** Remove from the old cell, add to the new one. Both O(1). Called constantly. */
    void put(const std::string& id, const Location& at) {
        CellKey cell = cellOf(at);
        auto it = whereIs_.find(id);
        if (it != whereIs_.end() && it->second == cell) return;   // did not leave the cell
        remove(id);
        cells_[cell].insert(id);
        whereIs_[id] = cell;
    }

    void remove(const std::string& id) {
        auto it = whereIs_.find(id);
        if (it == whereIs_.end()) return;
        auto bucket = cells_.find(it->second);
        if (bucket != cells_.end()) {
            bucket->second.erase(id);
            if (bucket->second.empty()) cells_.erase(bucket);
        }
        whereIs_.erase(it);
    }

    std::vector<std::string> near(const Location& at, int ring) const {
        CellKey home = cellOf(at);
        std::vector<std::string> out;
        for (long long r = home.r - ring; r <= home.r + ring; ++r)
            for (long long c = home.c - ring; c <= home.c + ring; ++c) {
                auto it = cells_.find({ r, c });
                if (it != cells_.end()) out.insert(out.end(), it->second.begin(), it->second.end());
            }
        return out;
    }

private:
    std::unordered_map<CellKey, std::unordered_set<std::string>, CellHash> cells_;
    std::unordered_map<std::string, CellKey> whereIs_;
};

/* ------------------------------------------------------------------ driver */
enum class DriverState { OFFLINE, AVAILABLE, OFFERED, ON_TRIP };

static const char* nameOf(DriverState s) {
    switch (s) {
        case DriverState::OFFLINE: return "OFFLINE";
        case DriverState::AVAILABLE: return "AVAILABLE";
        case DriverState::OFFERED: return "OFFERED";
        default: return "ON_TRIP";
    }
}

class Driver {
public:
    std::string id, name;
    double rating = 5.0;
    Vehicle vehicle;
    Location at;

    Driver(std::string i, std::string n, double r, Vehicle v)
        : id(std::move(i)), name(std::move(n)), rating(r), vehicle(std::move(v)) {}

    DriverState state() const { std::lock_guard<std::mutex> g(m_); return state_; }

    bool goOnline() {
        std::lock_guard<std::mutex> g(m_);
        if (state_ != DriverState::OFFLINE) return false;
        state_ = DriverState::AVAILABLE; rideId_.clear();
        return true;
    }

    /** THE method. Exactly one concurrent caller can win it. */
    bool tryOffer(const std::string& rideId, long long expiresAt) {
        std::lock_guard<std::mutex> g(m_);            // one tiny lock per driver, never global
        if (state_ != DriverState::AVAILABLE) return false;
        state_ = DriverState::OFFERED; rideId_ = rideId; expiresAt_ = expiresAt;
        return true;
    }

    bool confirm(const std::string& rideId) {
        std::lock_guard<std::mutex> g(m_);
        if (state_ != DriverState::OFFERED || rideId_ != rideId) return false;
        state_ = DriverState::ON_TRIP;
        return true;
    }

    bool release(const std::string& rideId) {
        std::lock_guard<std::mutex> g(m_);
        if (state_ == DriverState::OFFLINE || state_ == DriverState::AVAILABLE) return false;
        if (rideId_ != rideId) return false;
        state_ = DriverState::AVAILABLE; rideId_.clear(); expiresAt_ = 0;
        return true;
    }

private:
    mutable std::mutex m_;
    DriverState state_ = DriverState::OFFLINE;
    std::string rideId_;
    long long expiresAt_ = 0;
};

/* -------------------------------------------------------------- strategies */
struct MatchingStrategy {
    virtual ~MatchingStrategy() = default;
    virtual std::vector<Driver*> rank(const Location& pickup, std::vector<Driver*> pool) const = 0;
};

struct NearestThenRating : MatchingStrategy {
    std::vector<Driver*> rank(const Location& pickup, std::vector<Driver*> pool) const override {
        std::sort(pool.begin(), pool.end(), [&](Driver* a, Driver* b) {
            return a->at.metresTo(pickup) * (1 + (5.0 - a->rating) * 0.10)
                 < b->at.metresTo(pickup) * (1 + (5.0 - b->rating) * 0.10);
        });
        return pool;                                    // a new signal costs one class
    }
};

struct Fare {
    long long base = 0, distance = 0, time = 0, surge = 0, total = 0;
    std::string pretty() const {
        return "Rs." + std::to_string(total / 100) + (total % 100 < 10 ? ".0" : ".")
             + std::to_string(total % 100);
    }
};

struct PricingStrategy {
    virtual ~PricingStrategy() = default;
    virtual Fare quote(long long metres, long long seconds) const = 0;
};

/** surgeBps in basis points: 10000 = x1.0, 18000 = x1.8. Integers all the way down. */
struct StandardPricing : PricingStrategy {
    long long basePaise, perKmPaise, perMinPaise, surgeBps;
    StandardPricing(long long b, long long km, long long mn, long long s)
        : basePaise(b), perKmPaise(km), perMinPaise(mn), surgeBps(s) {}

    Fare quote(long long metres, long long seconds) const override {
        long long distance = metres * perKmPaise / 1000;      // multiply FIRST
        long long time = seconds * perMinPaise / 60;
        long long subtotal = basePaise + distance + time;
        long long surged = subtotal * surgeBps / 10000;
        long long rounded = (surged + 50) / 100 * 100;        // nearest whole rupee
        return { basePaise, distance, time, rounded - subtotal, rounded };
    }
};

/* -------------------------------------------------------------------- ride */
enum class RideState { REQUESTED, MATCHED, DRIVER_ARRIVED, IN_PROGRESS, COMPLETED,
                       CANCELLED_BY_RIDER, CANCELLED_BY_DRIVER, NO_DRIVERS_FOUND };

static const char* nameOf(RideState s) {
    switch (s) {
        case RideState::REQUESTED: return "REQUESTED";
        case RideState::MATCHED: return "MATCHED";
        case RideState::DRIVER_ARRIVED: return "DRIVER_ARRIVED";
        case RideState::IN_PROGRESS: return "IN_PROGRESS";
        case RideState::COMPLETED: return "COMPLETED";
        case RideState::CANCELLED_BY_RIDER: return "CANCELLED_BY_RIDER";
        case RideState::CANCELLED_BY_DRIVER: return "CANCELLED_BY_DRIVER";
        default: return "NO_DRIVERS_FOUND";
    }
}

struct Ride {
    std::string id;
    Rider rider;
    Location pickup, drop;
    RideState state = RideState::REQUESTED;
    Driver* driver = nullptr;
    std::string offeredTo;
    long long offerExpiresAt = 0, startedAt = 0;
    Fare quoted, final;
    std::deque<std::string> candidates;
    std::set<std::string> tried;

    void transitionTo(RideState next) {
        static const std::unordered_map<int, std::set<int>> legal = {
            { (int)RideState::REQUESTED, { (int)RideState::MATCHED,
                                           (int)RideState::NO_DRIVERS_FOUND,
                                           (int)RideState::CANCELLED_BY_RIDER } },
            { (int)RideState::MATCHED, { (int)RideState::DRIVER_ARRIVED,
                                         (int)RideState::CANCELLED_BY_RIDER,
                                         (int)RideState::CANCELLED_BY_DRIVER } },
            { (int)RideState::DRIVER_ARRIVED, { (int)RideState::IN_PROGRESS,
                                                (int)RideState::CANCELLED_BY_RIDER,
                                                (int)RideState::CANCELLED_BY_DRIVER } },
            { (int)RideState::IN_PROGRESS, { (int)RideState::COMPLETED } },
        };
        auto it = legal.find((int)state);
        if (it == legal.end() || !it->second.count((int)next))
            throw std::runtime_error(id + ": illegal transition");
        state = next;
    }
};

/* -------------------------------------------------------------- dispatcher */
class DispatchService {
public:
    int lastChecked = 0, lastRing = 0;

    DispatchService(const MatchingStrategy& m, const PricingStrategy& p, const RouteService& r)
        : matcher_(m), pricing_(p), routes_(r) {}

    void registerDriver(Driver* d, Location at) { drivers_[d->id] = d; d->at = at; }

    void goOnline(const std::string& id, Location at) {
        Driver* d = drivers_[id];
        d->at = at;
        if (d->goOnline()) index_.put(id, at);
    }

    /** Runs a thousand times more often than requestRide. Stays O(1). */
    void updateLocation(const std::string& id, Location at) {
        Driver* d = drivers_[id];
        d->at = at;
        if (d->state() == DriverState::AVAILABLE) index_.put(id, at);
    }

    Ride* requestRide(const Rider& rider, Location pickup, Location drop, long long now) {
        auto ride = std::make_unique<Ride>();
        ride->id = "r" + std::to_string(++seq_);
        ride->rider = rider; ride->pickup = pickup; ride->drop = drop;
        Ride* raw = ride.get();
        rides_[raw->id] = std::move(ride);
        lastChecked = 0;
        if (!expandAndOffer(raw, 1, now)) raw->transitionTo(RideState::NO_DRIVERS_FOUND);
        return raw;
    }

    bool accept(const std::string& rideId, const std::string& driverId, long long now) {
        Ride* ride = rides_.count(rideId) ? rides_[rideId].get() : nullptr;
        if (!ride || ride->state != RideState::REQUESTED) return false;
        if (ride->offeredTo != driverId || now > ride->offerExpiresAt) return false;
        Driver* d = drivers_[driverId];
        if (!d->confirm(rideId)) return false;
        ride->driver = d;
        ride->offeredTo.clear();
        ride->quoted = pricing_.quote(routes_.roadMetres(ride->pickup, ride->drop),
                                      routes_.etaSeconds(ride->pickup, ride->drop));
        ride->transitionTo(RideState::MATCHED);
        return true;
    }

    /** Time is a PARAMETER — that is why the 15-second rule is testable at all. */
    void tick(long long now) {
        for (auto& [id, ridePtr] : rides_) {
            Ride* ride = ridePtr.get();
            if (ride->state != RideState::REQUESTED || ride->offeredTo.empty()) continue;
            if (now <= ride->offerExpiresAt) continue;
            withdraw(ride);
            if (!offerNext(ride, now) && !expandAndOffer(ride, 2, now))
                ride->transitionTo(RideState::NO_DRIVERS_FOUND);
        }
    }

    void driverArrived(const std::string& id) { rides_[id]->transitionTo(RideState::DRIVER_ARRIVED); }
    void startTrip(const std::string& id, long long now) {
        rides_[id]->startedAt = now;
        rides_[id]->transitionTo(RideState::IN_PROGRESS);
    }
    Fare complete(const std::string& id, long long metres, long long now) {
        Ride* ride = rides_[id].get();
        ride->final = pricing_.quote(metres, (now - ride->startedAt) / 1000);
        ride->transitionTo(RideState::COMPLETED);
        endRide(ride);
        return ride->final;
    }

private:
    std::vector<Driver*> availableNear(Ride* ride, int ring) {
        std::vector<Driver*> pool;
        for (const std::string& id : index_.near(ride->pickup, ring)) {
            ++lastChecked;                                   // the number the round is about
            Driver* d = drivers_.count(id) ? drivers_[id] : nullptr;
            if (d && d->state() == DriverState::AVAILABLE && !ride->tried.count(id)) pool.push_back(d);
        }
        return pool;
    }

    bool expandAndOffer(Ride* ride, int fromRing, long long now) {
        for (int ring = fromRing; ring <= MAX_RING; ++ring) {
            lastRing = ring;
            auto pool = availableNear(ride, ring);
            if (pool.empty()) continue;
            for (Driver* d : matcher_.rank(ride->pickup, pool)) ride->candidates.push_back(d->id);
            if (offerNext(ride, now)) return true;
        }
        return false;
    }

    /** One driver at a time, with a deadline. Never a broadcast. */
    bool offerNext(Ride* ride, long long now) {
        while (!ride->candidates.empty()) {
            std::string id = ride->candidates.front();
            ride->candidates.pop_front();
            ride->tried.insert(id);
            Driver* d = drivers_.count(id) ? drivers_[id] : nullptr;
            if (!d || !d->tryOffer(ride->id, now + OFFER_TTL_MS)) continue;   // lost the race
            index_.remove(id);                               // offered => nobody else can see it
            ride->offeredTo = id;
            ride->offerExpiresAt = now + OFFER_TTL_MS;
            return true;
        }
        return false;
    }

    void withdraw(Ride* ride) {
        Driver* d = drivers_.count(ride->offeredTo) ? drivers_[ride->offeredTo] : nullptr;
        if (d && d->release(ride->id)) index_.put(d->id, d->at);   // back into the pool
        ride->offeredTo.clear();
    }

    /** EVERY terminal path goes through here, or you leak a car. */
    void endRide(Ride* ride) {
        if (ride->driver && ride->driver->release(ride->id))
            index_.put(ride->driver->id, ride->driver->at);
    }

    const MatchingStrategy& matcher_;
    const PricingStrategy& pricing_;
    const RouteService& routes_;
    std::unordered_map<std::string, Driver*> drivers_;
    std::unordered_map<std::string, std::unique_ptr<Ride>> rides_;
    GeoIndex index_;
    int seq_ = 0;
};

/* -------------------------------------------------------------------- demo */
int main() {
    NearestThenRating matcher;
    StandardPricing pricing(5000, 1200, 150, 18000);
    StubRoutes routes;
    DispatchService svc(matcher, pricing, routes);

    Driver d1("d1", "Rahul", 4.9, { "KA01AB1234", "Swift", 4 });
    Driver d3("d3", "Meena", 4.6, { "KA05CD5678", "Baleno", 4 });
    Driver d7("d7", "Iqbal", 4.8, { "KA03EF9012", "i20", 4 });
    Driver d9("d9", "Farida", 4.7, { "KA09GH3456", "Dzire", 4 });

    svc.registerDriver(&d1, { 12.9710, 77.5940 }); svc.goOnline("d1", { 12.9710, 77.5940 });
    svc.registerDriver(&d3, { 12.9702, 77.5952 }); svc.goOnline("d3", { 12.9702, 77.5952 });
    svc.registerDriver(&d7, { 12.9688, 77.5961 }); svc.goOnline("d7", { 12.9688, 77.5961 });
    svc.registerDriver(&d9, { 12.9500, 77.6300 }); svc.goOnline("d9", { 12.9500, 77.6300 });

    Location pickup{ 12.9705, 77.5948 }, drop{ 12.9950, 77.6400 };

    std::cout << "-- Anita taps Book at t=0 --\\n";
    Ride* r1 = svc.requestRide({ "u1", "Anita" }, pickup, drop, 0);
    std::cout << "   ring " << svc.lastRing << ", checked " << svc.lastChecked
              << " drivers (not 50000) -> offered to " << r1->offeredTo
              << ", expires t=" << r1->offerExpiresAt << "\\n";

    std::cout << "-- Bala taps Book at the SAME instant --\\n";
    Ride* r2 = svc.requestRide({ "u2", "Bala" }, pickup, drop, 0);
    std::cout << "   d3 is OFFERED, so it is not in the index at all -> offered to "
              << r2->offeredTo << "\\n";

    std::cout << "-- nobody answers Anita's offer --\\n";
    svc.tick(15001);
    std::cout << "   Anita's offer moved to " << r1->offeredTo << "\\n";

    std::cout << "-- both drivers accept --\\n";
    std::cout << "   Bala + d1: " << svc.accept(r2->id, "d1", 4200) << "\\n";
    std::cout << "   Anita + d7: " << svc.accept(r1->id, "d7", 16400) << "\\n";
    std::cout << "   quoted (surge x1.8): " << r1->quoted.pretty()
              << "  = " << r1->quoted.base << " + " << r1->quoted.distance
              << " + " << r1->quoted.time << " + " << r1->quoted.surge << " paise\\n";

    svc.driverArrived(r1->id);
    svc.startTrip(r1->id, 40000);
    Fare fin = svc.complete(r1->id, 8200, 1380000);
    std::cout << "-- the trip --\\n   state=" << nameOf(r1->state)
              << "  final=" << fin.pretty() << "  d7 is " << nameOf(d7.state()) << " again\\n";

    svc.updateLocation("d7", { 12.9688, 77.5995 });
    std::cout << "-- d7 crossed a cell boundary: one remove, one add --\\n";

    Ride* r3 = svc.requestRide({ "u1", "Anita" }, { 12.8000, 77.4000 }, drop, 2000000);
    std::cout << "-- empty part of town --\\n   rings tried: " << MAX_RING
              << ", checked " << svc.lastChecked << " -> " << nameOf(r3->state) << "\\n";
    return 0;
}

/* ---------------------------------------------------------------- output ---
-- Anita taps Book at t=0 --
   ring 1, checked 3 drivers (not 50000) -> offered to d3, expires t=15000
-- Bala taps Book at the SAME instant --
   d3 is OFFERED, so it is not in the index at all -> offered to d1
-- nobody answers Anita's offer --
   Anita's offer moved to d7
-- both drivers accept --
   Bala + d1: 1
   Anita + d7: 1
   quoted (surge x1.8): Rs.309.00  = 5000 + 9088 + 3097 + 13715 paise
-- the trip --
   state=COMPLETED  final=Rs.327.00  d7 is AVAILABLE again
-- d7 crossed a cell boundary: one remove, one add --
-- empty part of town --
   rings tried: 3, checked 0 -> NO_DRIVERS_FOUND
--------------------------------------------------------------------------- */`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "rideSharing.ts",
        code: `/* ------------------------------------------------------------------ basics */
const CELL_DEG = 0.003;              // ~330 m
const OFFER_TTL_MS = 15_000;
const MAX_RING = 3;

class Location {
  constructor(readonly lat: number, readonly lng: number) {}
  /** Straight line. Fine for RANKING candidates. Never used for a fare. */
  metresTo(o: Location): number {
    const dLat = (this.lat - o.lat) * 111_320;
    const dLng = (this.lng - o.lng) * 111_320 * Math.cos((this.lat * Math.PI) / 180);
    return Math.sqrt(dLat * dLat + dLng * dLng);
  }
}

type Rider = { id: string; name: string };
type Vehicle = { plate: string; model: string; seats: number };

interface RouteService {
  roadMetres(a: Location, b: Location): number;
  etaSeconds(a: Location, b: Location): number;
}

class StubRoutes implements RouteService {
  roadMetres(a: Location, b: Location) { return Math.round(a.metresTo(b) * 1.35); }
  etaSeconds(a: Location, b: Location) { return Math.floor((this.roadMetres(a, b) * 3600) / 22_000); }
}

/* ---------------------------------------------------------------- geoindex */
class GeoIndex {
  private cells = new Map<string, Set<string>>();
  private whereIs = new Map<string, string>();

  static cellOf(at: Location): string {
    return "cell(" + Math.floor(at.lat / CELL_DEG) + "," + Math.floor(at.lng / CELL_DEG) + ")";
  }

  /** Remove from the old cell, add to the new one. Both O(1). Called constantly. */
  put(driverId: string, at: Location): void {
    const cell = GeoIndex.cellOf(at);
    if (this.whereIs.get(driverId) === cell) return;        // did not leave the cell
    this.remove(driverId);
    let bucket = this.cells.get(cell);
    if (!bucket) { bucket = new Set(); this.cells.set(cell, bucket); }
    bucket.add(driverId);
    this.whereIs.set(driverId, cell);
  }

  remove(driverId: string): void {
    const old = this.whereIs.get(driverId);
    if (old === undefined) return;
    this.whereIs.delete(driverId);
    const bucket = this.cells.get(old);
    if (!bucket) return;
    bucket.delete(driverId);
    if (bucket.size === 0) this.cells.delete(old);
  }

  near(at: Location, ring: number): string[] {
    const r0 = Math.floor(at.lat / CELL_DEG);
    const c0 = Math.floor(at.lng / CELL_DEG);
    const out: string[] = [];
    for (let r = r0 - ring; r <= r0 + ring; r++)
      for (let c = c0 - ring; c <= c0 + ring; c++) {
        const bucket = this.cells.get("cell(" + r + "," + c + ")");
        if (bucket) out.push(...bucket);
      }
    return out;
  }
}

/* ------------------------------------------------------------------ driver */
type DriverState = "OFFLINE" | "AVAILABLE" | "OFFERED" | "ON_TRIP";

class Driver {
  at!: Location;
  private state: DriverState = "OFFLINE";
  private rideId: string | null = null;
  private expiresAt = 0;

  constructor(readonly id: string, readonly name: string,
              readonly rating: number, readonly vehicle: Vehicle) {}

  currentState(): DriverState { return this.state; }

  goOnline(): boolean {
    if (this.state !== "OFFLINE") return false;
    this.state = "AVAILABLE"; this.rideId = null;
    return true;
  }

  /**
   * THE method. In a single-threaded runtime this cannot be pre-empted, but the
   * SHAPE is what matters: read the state and write it in one indivisible step,
   * so a multi-threaded or multi-server port becomes one conditional write.
   */
  tryOffer(rideId: string, expiresAt: number): boolean {
    if (this.state !== "AVAILABLE") return false;
    this.state = "OFFERED"; this.rideId = rideId; this.expiresAt = expiresAt;
    return true;
  }

  confirm(rideId: string): boolean {
    if (this.state !== "OFFERED" || this.rideId !== rideId) return false;
    this.state = "ON_TRIP";
    return true;
  }

  release(rideId: string): boolean {
    if (this.state === "OFFLINE" || this.state === "AVAILABLE") return false;
    if (this.rideId !== rideId) return false;
    this.state = "AVAILABLE"; this.rideId = null; this.expiresAt = 0;
    return true;
  }
}

/* -------------------------------------------------------------- strategies */
interface MatchingStrategy { rank(pickup: Location, pool: Driver[]): Driver[]; }

class NearestFirst implements MatchingStrategy {
  rank(pickup: Location, pool: Driver[]) {
    return [...pool].sort((a, b) => a.at.metresTo(pickup) - b.at.metresTo(pickup));
  }
}

/** A new ranking signal costs one class. DispatchService does not change. */
class NearestThenRating implements MatchingStrategy {
  private score(d: Driver, pickup: Location) {
    return d.at.metresTo(pickup) * (1 + (5 - d.rating) * 0.1);
  }
  rank(pickup: Location, pool: Driver[]) {
    return [...pool].sort((a, b) => this.score(a, pickup) - this.score(b, pickup));
  }
}

type Fare = {
  basePaise: number; distancePaise: number; timePaise: number;
  surgePaise: number; totalPaise: number;
};

const pretty = (f: Fare) =>
  "Rs." + Math.floor(f.totalPaise / 100) + "." + String(f.totalPaise % 100).padStart(2, "0");

interface PricingStrategy { quote(metres: number, seconds: number): Fare; }

/** surgeBps in basis points: 10000 = x1.0, 18000 = x1.8. Integers all the way. */
class StandardPricing implements PricingStrategy {
  constructor(private basePaise: number, private perKmPaise: number,
              private perMinPaise: number, private surgeBps: number) {}

  quote(metres: number, seconds: number): Fare {
    const distancePaise = Math.floor((metres * this.perKmPaise) / 1000);   // multiply FIRST
    const timePaise = Math.floor((seconds * this.perMinPaise) / 60);
    const subtotal = this.basePaise + distancePaise + timePaise;
    const surged = Math.floor((subtotal * this.surgeBps) / 10000);
    const totalPaise = Math.floor((surged + 50) / 100) * 100;              // nearest whole rupee
    return { basePaise: this.basePaise, distancePaise, timePaise,
             surgePaise: totalPaise - subtotal, totalPaise };
  }
}

/* -------------------------------------------------------------------- ride */
type RideState =
  | "REQUESTED" | "MATCHED" | "DRIVER_ARRIVED" | "IN_PROGRESS" | "COMPLETED"
  | "CANCELLED_BY_RIDER" | "CANCELLED_BY_DRIVER" | "NO_DRIVERS_FOUND";

const LEGAL: Record<string, RideState[]> = {
  REQUESTED: ["MATCHED", "NO_DRIVERS_FOUND", "CANCELLED_BY_RIDER"],
  MATCHED: ["DRIVER_ARRIVED", "CANCELLED_BY_RIDER", "CANCELLED_BY_DRIVER"],
  DRIVER_ARRIVED: ["IN_PROGRESS", "CANCELLED_BY_RIDER", "CANCELLED_BY_DRIVER"],
  IN_PROGRESS: ["COMPLETED"],
};

class Ride {
  state: RideState = "REQUESTED";
  driver: Driver | null = null;
  offeredTo: string | null = null;
  offerExpiresAt = 0;
  startedAt = 0;
  quotedFare: Fare | null = null;
  finalFare: Fare | null = null;
  candidates: string[] = [];
  tried = new Set<string>();

  constructor(readonly id: string, readonly rider: Rider,
              readonly pickup: Location, readonly drop: Location) {}

  transitionTo(next: RideState): void {
    if (!(LEGAL[this.state] ?? []).includes(next))
      throw new Error(this.id + ": " + this.state + " -> " + next + " is not legal");
    this.state = next;
  }
}

/* -------------------------------------------------------------- dispatcher */
class DispatchService {
  private drivers = new Map<string, Driver>();
  private rides = new Map<string, Ride>();
  private index = new GeoIndex();
  private seq = 0;
  lastChecked = 0;
  lastRing = 0;

  constructor(private matcher: MatchingStrategy,
              private pricing: PricingStrategy,
              private routes: RouteService) {}

  register(d: Driver, at: Location) { this.drivers.set(d.id, d); d.at = at; }

  goOnline(driverId: string, at: Location) {
    const d = this.drivers.get(driverId)!;
    d.at = at;
    if (d.goOnline()) this.index.put(driverId, at);
  }

  /** Runs a thousand times more often than requestRide. Stays O(1). */
  updateLocation(driverId: string, at: Location) {
    const d = this.drivers.get(driverId)!;
    d.at = at;
    if (d.currentState() === "AVAILABLE") this.index.put(driverId, at);
  }

  requestRide(rider: Rider, pickup: Location, drop: Location, now: number): Ride {
    const ride = new Ride("r" + ++this.seq, rider, pickup, drop);
    this.rides.set(ride.id, ride);
    this.lastChecked = 0;
    if (!this.expandAndOffer(ride, 1, now)) ride.transitionTo("NO_DRIVERS_FOUND");
    return ride;
  }

  accept(rideId: string, driverId: string, now: number): boolean {
    const ride = this.rides.get(rideId);
    if (!ride || ride.state !== "REQUESTED") return false;
    if (ride.offeredTo !== driverId || now > ride.offerExpiresAt) return false;
    const d = this.drivers.get(driverId)!;
    if (!d.confirm(rideId)) return false;
    ride.driver = d;
    ride.offeredTo = null;
    ride.quotedFare = this.pricing.quote(this.routes.roadMetres(ride.pickup, ride.drop),
                                         this.routes.etaSeconds(ride.pickup, ride.drop));
    ride.transitionTo("MATCHED");
    return true;
  }

  decline(rideId: string, driverId: string, now: number): boolean {
    const ride = this.rides.get(rideId);
    if (!ride || ride.offeredTo !== driverId) return false;
    this.withdraw(ride);
    if (!this.offerNext(ride, now) && !this.expandAndOffer(ride, 2, now))
      ride.transitionTo("NO_DRIVERS_FOUND");
    return true;
  }

  /** Time is a PARAMETER — that is the only reason the 15s rule is testable. */
  tick(now: number): void {
    for (const ride of this.rides.values()) {
      if (ride.state !== "REQUESTED" || ride.offeredTo === null) continue;
      if (now <= ride.offerExpiresAt) continue;
      this.withdraw(ride);
      if (!this.offerNext(ride, now) && !this.expandAndOffer(ride, 2, now))
        ride.transitionTo("NO_DRIVERS_FOUND");
    }
  }

  driverArrived(rideId: string) { this.rides.get(rideId)!.transitionTo("DRIVER_ARRIVED"); }

  startTrip(rideId: string, now: number) {
    const ride = this.rides.get(rideId)!;
    ride.startedAt = now;
    ride.transitionTo("IN_PROGRESS");
  }

  complete(rideId: string, actualMetres: number, now: number): Fare {
    const ride = this.rides.get(rideId)!;
    ride.finalFare = this.pricing.quote(actualMetres, Math.floor((now - ride.startedAt) / 1000));
    ride.transitionTo("COMPLETED");
    this.endRide(ride);
    return ride.finalFare;
  }

  private availableNear(ride: Ride, ring: number): Driver[] {
    const pool: Driver[] = [];
    for (const id of this.index.near(ride.pickup, ring)) {
      this.lastChecked++;                              // the number the whole round is about
      const d = this.drivers.get(id);
      if (d && d.currentState() === "AVAILABLE" && !ride.tried.has(id)) pool.push(d);
    }
    return pool;
  }

  private expandAndOffer(ride: Ride, fromRing: number, now: number): boolean {
    for (let ring = fromRing; ring <= MAX_RING; ring++) {
      this.lastRing = ring;
      const pool = this.availableNear(ride, ring);
      if (pool.length === 0) continue;
      for (const d of this.matcher.rank(ride.pickup, pool)) ride.candidates.push(d.id);
      if (this.offerNext(ride, now)) return true;
    }
    return false;
  }

  /** One driver at a time, with a deadline. Never a broadcast. */
  private offerNext(ride: Ride, now: number): boolean {
    while (ride.candidates.length > 0) {
      const id = ride.candidates.shift()!;
      ride.tried.add(id);
      const d = this.drivers.get(id);
      if (!d || !d.tryOffer(ride.id, now + OFFER_TTL_MS)) continue;   // lost the race
      this.index.remove(id);                            // offered => nobody else can see it
      ride.offeredTo = id;
      ride.offerExpiresAt = now + OFFER_TTL_MS;
      return true;
    }
    return false;
  }

  private withdraw(ride: Ride): void {
    const d = ride.offeredTo ? this.drivers.get(ride.offeredTo) : undefined;
    if (d && d.release(ride.id)) this.index.put(d.id, d.at);   // straight back into the pool
    ride.offeredTo = null;
  }

  /** EVERY terminal path goes through here, or you leak a car. */
  private endRide(ride: Ride): void {
    const d = ride.driver;
    if (d && d.release(ride.id)) this.index.put(d.id, d.at);
  }
}

/* -------------------------------------------------------------------- demo */
const svc = new DispatchService(new NearestThenRating(),
                                new StandardPricing(5000, 1200, 150, 18000),
                                new StubRoutes());

const fleet: [Driver, Location][] = [
  [new Driver("d1", "Rahul", 4.9, { plate: "KA01AB1234", model: "Swift", seats: 4 }),
   new Location(12.9710, 77.5940)],
  [new Driver("d3", "Meena", 4.6, { plate: "KA05CD5678", model: "Baleno", seats: 4 }),
   new Location(12.9702, 77.5952)],
  [new Driver("d7", "Iqbal", 4.8, { plate: "KA03EF9012", model: "i20", seats: 4 }),
   new Location(12.9688, 77.5961)],
  [new Driver("d9", "Farida", 4.7, { plate: "KA09GH3456", model: "Dzire", seats: 4 }),
   new Location(12.9500, 77.6300)],
];
for (const [d, at] of fleet) { svc.register(d, at); svc.goOnline(d.id, at); }

const pickup = new Location(12.9705, 77.5948);
const drop = new Location(12.9950, 77.6400);

console.log("-- Anita taps Book at t=0 --");
const r1 = svc.requestRide({ id: "u1", name: "Anita" }, pickup, drop, 0);
console.log("   ring " + svc.lastRing + ", checked " + svc.lastChecked +
            " drivers (not 50000) -> offered to " + r1.offeredTo +
            ", expires t=" + r1.offerExpiresAt);

console.log("-- Bala taps Book at the SAME instant --");
const r2 = svc.requestRide({ id: "u2", name: "Bala" }, pickup, drop, 0);
console.log("   d3 is OFFERED, so it is not in the index at all -> offered to " + r2.offeredTo);

console.log("-- nobody answers Anita's offer --");
svc.tick(15_001);
console.log("   d3 expired and is back in the index; d1 is taken, so the CAS lost");
console.log("   Anita's offer moved to " + r1.offeredTo);

console.log("-- both drivers accept --");
console.log("   Bala + d1: " + svc.accept(r2.id, "d1", 4_200));
console.log("   Anita + d7: " + svc.accept(r1.id, "d7", 16_400));
const q = r1.quotedFare!;
console.log("   quoted (surge x1.8): " + pretty(q) + "  = " + q.basePaise + " + " +
            q.distancePaise + " + " + q.timePaise + " + " + q.surgePaise + " paise");

console.log("-- the trip --");
svc.driverArrived(r1.id);
svc.startTrip(r1.id, 40_000);
const fin = svc.complete(r1.id, 8_200, 1_380_000);
console.log("   state=" + r1.state + "  final=" + pretty(fin) +
            "  d7 is " + fleet[2][0].currentState() + " again");

console.log("-- d7 drives east across a cell boundary --");
console.log("   before: " + GeoIndex.cellOf(fleet[2][0].at));
svc.updateLocation("d7", new Location(12.9688, 77.5995));
console.log("   after:  " + GeoIndex.cellOf(fleet[2][0].at) + "   (one remove, one add)");

console.log("-- a rider in an empty part of town --");
const r3 = svc.requestRide({ id: "u1", name: "Anita" },
                           new Location(12.8000, 77.4000), drop, 2_000_000);
console.log("   rings tried: " + MAX_RING + ", checked " + svc.lastChecked + " -> " + r3.state);

/* ---------------------------------------------------------------- output ---
-- Anita taps Book at t=0 --
   ring 1, checked 3 drivers (not 50000) -> offered to d3, expires t=15000
-- Bala taps Book at the SAME instant --
   d3 is OFFERED, so it is not in the index at all -> offered to d1
-- nobody answers Anita's offer --
   d3 expired and is back in the index; d1 is taken, so the CAS lost
   Anita's offer moved to d7
-- both drivers accept --
   Bala + d1: true
   Anita + d7: true
   quoted (surge x1.8): Rs.309.00  = 5000 + 9088 + 3097 + 13715 paise
-- the trip --
   state=COMPLETED  final=Rs.327.00  d7 is AVAILABLE again
-- d7 drives east across a cell boundary --
   before: cell(4322,25865)
   after:  cell(4322,25866)   (one remove, one add)
-- a rider in an empty part of town --
   rings tried: 3, checked 0 -> NO_DRIVERS_FOUND
--------------------------------------------------------------------------- */`,
      },
    ],

    // ==================================================================
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Take the cars and the city away and what is left is **assigning a scarce, moving resource to a request, fast, exactly once**. Three moves do all the work: an index that shrinks the search space to a bucket, a sequential offer with a deadline instead of a broadcast, and an atomic state flip on the resource so exactly one claim wins. Those three appear together far more often than you would guess.",
      },
      {
        type: "ul",
        items: [
          "**Food delivery dispatch** — the same matcher, but the resource is a courier and the trip has three actors. The geo index and the offer-with-timeout are literally the same code.",
          "**Warehouse robot or forklift assignment** — a pick request appears at an aisle, and the nearest free robot must be claimed exactly once. Bucketed by aisle instead of by latitude; everything else is identical.",
          "**Ambulance and field-technician dispatch** — same partition, same one-at-a-time offer, and the deadline is now a legal requirement rather than a UX preference.",
          "**Matchmaking in games** — bucket by skill rating instead of by geography, then expand the ring when the bucket is thin. The ring expansion *is* the widening skill tolerance every matchmaker has.",
          "**Ad-serving and auction routing** — the index shrinks millions of candidate ads to a few hundred by targeting keys, then a ranker orders them. Same two-stage shape: cheap filter, expensive rank.",
          "**Any check-then-act on a shared resource** — seat holds, inventory reservations, lock acquisition. The compare-and-set here is the same mechanism, and the same bug lives everywhere it is missing ([[atomic-operations-and-cas]]).",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The 30-second version to say out loud",
        text: "*“Drivers live in a `Map<CellId, Set<Driver>>` keyed by a fixed grid cell, so a request looks at nine cells and about sixteen drivers instead of fifty thousand — and `updateLocation` is one remove and one add, which matters because it runs a thousand times more often than a ride request. If the nine cells are empty I expand in rings and give up after three. The candidates go through a `MatchingStrategy` to be ranked, then I offer to number one alone with a fifteen-second deadline; decline or timeout moves to number two. The offer itself is a compare-and-set from `AVAILABLE` to `OFFERED` on the driver, and an offered driver leaves the index entirely — so two riders can never be matched to the same car. Fare is a breakdown in integer paise behind a `PricingStrategy`, which is where surge lives.”*",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**At more than one server.** An in-process `HashMap` index and an `AtomicReference` guard one JVM. With ten dispatchers, both have to move into shared state: the index becomes Redis geo commands or a sharded cell service, and the CAS becomes a conditional write with a version check. The *design* survives; the *mechanism* does not.",
          "**When density varies wildly.** A fixed grid is uniform and cities are not. The airport cell holds four hundred drivers and the outer-ring cell holds none, so one query is slow and the other always expands. That is the point where a quadtree, S2 or H3 earns its complexity — cells that subdivide where the drivers actually are.",
          "**When the ranking needs the road network.** Straight-line distance is a fine proxy until a river, a flyover or a one-way grid makes the nearest car the slowest one. Ranking by *ETA* rather than by metres means calling a routing engine for every candidate, which changes the cost model of matching completely.",
          "**When matching should be global rather than greedy.** Offering each rider their own nearest car is locally optimal and globally mediocre: two riders and two drivers can be assigned crosswise, doubling everybody's wait. Batching requests over a few seconds and solving an assignment problem is what real systems do, and it is a different algorithm entirely.",
          "**When a driver must be reachable to be matched.** The index says a driver is nearby; it does not say their phone has signal. Real dispatch weights by recent heartbeat and historical acceptance rate, because offering a ride into a tunnel costs fifteen seconds of a rider's patience.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Never look at a driver you do not have to, and never let two riders look at the same one.** The grid is the first half — nine cells instead of a city. The compare-and-set plus *removing offered drivers from the index* is the second half. Everything else in this lesson — the states, the fare, the follow-ups — is what you say while those two ideas are already on the board.",
      },
    ],

    // ==================================================================
    tradeoffs: {
      pros: [
        "A fixed cell grid turns nearest-driver search from O(all drivers) into a lookup over nine buckets, and it needs nothing more exotic than a hash map — you can write it correctly in ten minutes under interview pressure.",
        "updateLocation is one remove and one add, so an index that is written thousands of times per second stays cheap; a driver who has not left their cell costs a single comparison.",
        "Offering to one driver at a time with a deadline makes double-acceptance structurally impossible rather than merely unlikely, and it means a rejection never has to be sent to a human who already said yes.",
        "The compare-and-set guards exactly one driver instead of the whole dispatcher, so two ride requests in different neighbourhoods never wait on each other.",
        "Matching, pricing and routing are three separate interfaces, so a new ranking signal, a surge rule or a real routing engine is one new class and zero edits to the dispatcher.",
        "Because time is a parameter to requestRide, accept and tick, the fifteen-second timeout and the whole re-offer chain can be tested deterministically with no sleeping and no clock stubbing.",
      ],
      cons: [
        "A uniform grid does not match non-uniform driver density: the airport cell is huge and the suburb cell is empty, so one query does too much work and the other always expands. A quadtree or S2 fixes it and costs an hour you do not have.",
        "Sequential offers add latency — three declines is forty-five seconds of a rider watching a spinner — which is why real systems batch small groups and shorten the deadline once they have acceptance data.",
        "Greedy per-request matching is locally optimal and globally mediocre; batching riders and solving an assignment problem produces shorter total waits but is a different algorithm and a different interview.",
        "Straight-line ranking can pick a car that is two hundred metres away across a river, and the design has no way to notice; correcting it means an ETA call per candidate, which is far more expensive than the index it sits behind.",
        "Everything here is in-process. Ten dispatch servers need the index and the atomic flip to move into a shared store, and at that point the guarantee depends on that store's consistency rather than on your code.",
        "Cell boundaries are arbitrary: two drivers ten metres apart can sit in different cells, so ring 1 can miss a car that a plain radius query would have found. Ring expansion hides it, at the cost of visiting more cells.",
      ],
    },

    // ==================================================================
    furtherReading: [
      {
        label: "Uber Engineering — H3, a hexagonal hierarchical spatial index",
        href: "https://www.uber.com/en-IN/blog/h3/",
        kind: "article",
        note: "Uber's own writeup of the index that replaced the naive grid. Read it for why hexagons and multiple resolutions matter once density varies — it is the upgrade path you should be able to name in the round.",
      },
      {
        label: "S2 Geometry — the cell hierarchy behind many geo systems",
        href: "https://s2geometry.io/",
        kind: "docs",
        note: "The other standard answer. The key idea to take away is a space-filling curve that turns a 2-D cell into a single sortable integer, which is exactly what your cellId(r, c) is doing by hand.",
      },
      {
        label: "Redis — geospatial commands (GEOADD, GEOSEARCH)",
        href: "https://redis.io/docs/latest/develop/data-types/geospatial/",
        kind: "docs",
        note: "What your in-memory GeoIndex becomes at ten servers. Worth skimming so you can say what moves and what stays when the index leaves the process.",
      },
      {
        label: "java.util.concurrent.atomic — package documentation",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/package-summary.html",
        kind: "docs",
        note: "AtomicReference and compareAndSet, from the source. The package summary is short and it is the difference between “I used an atomic” and “I know what it guarantees”.",
      },
      {
        label: "awesome-low-level-design — ride sharing problem",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/ride-sharing-service.md",
        kind: "article",
        note: "The canonical write-up of this exact interview problem. Useful as a checklist of the entities most interviewers have in their head before you walk in.",
      },
      {
        label: "Uber Engineering — how surge pricing actually works",
        href: "https://www.uber.com/en-IN/blog/uber-dynamic-pricing/",
        kind: "article",
        note: "The product side of your PricingStrategy: what the multiplier is trying to do to supply and demand, and why it is a separate concern from matching.",
      },
      {
        label: "Designing Data-Intensive Applications — Martin Kleppmann",
        kind: "book",
        note: "Chapters on partitioning and on linearizability. Your cell key is a partition key, and your compare-and-set is the single-object atomic operation the book builds distributed guarantees from — reading it makes the multi-server follow-up easy.",
      },
      {
        label: "Refactoring Guru — Strategy pattern",
        href: "https://refactoring.guru/design-patterns/strategy",
        kind: "article",
        note: "The pattern behind both MatchingStrategy and PricingStrategy, with the standard diagrams. Short, and it gives you the vocabulary to justify the two seams in one sentence.",
      },
    ],

    // ==================================================================
    quiz: [
      {
        id: "ride-sharing-q1",
        question:
          "Fifty thousand drivers are online. A ride request arrives. Why is `for (Driver d : allDrivers) if (distance(d, pickup) < 3000)` the answer that loses this round?",
        options: [
          { id: "a", label: "It costs 50,000 distance calculations on every single request, and the city runs hundreds of requests per second — the work grows with the whole fleet instead of with the neighbourhood." },
          { id: "b", label: "Because the distance function is inaccurate over long ranges." },
          { id: "c", label: "Because it will find too many candidates to rank." },
          { id: "d", label: "Because a for loop cannot be made thread-safe." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) sounds plausible and is even partly true, but it is the small problem — you can always cut the list after ranking. The real objection is the cost model: the work per request is proportional to the entire fleet, so the system gets slower for everybody every time a driver signs up. Bucketing by cell makes the work proportional to local density instead.",
      },
      {
        id: "ride-sharing-q2",
        question:
          "You bucket the map into cells and keep `Map<CellId, Set<Driver>>`. A driver's location ping arrives. What has to happen, and why does that shape the whole index?",
        options: [
          { id: "a", label: "Remove them from the old cell's set and add them to the new one — both O(1) — because updateLocation runs orders of magnitude more often than requestRide." },
          { id: "b", label: "Re-sort the drivers in the affected cells by distance from the city centre." },
          { id: "c", label: "Rebuild the index from all driver locations, since it is only a hash map." },
          { id: "d", label: "Nothing — the index is only read during matching, so it can be built lazily per request." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the question that separates a real geo index from a diagram of one. A driver pings every few seconds, so writes vastly outnumber reads — and (d) is the trap, because building lazily per request just moves the O(all drivers) scan into the read path. Two hash-set operations per ping is what makes the structure affordable.",
      },
      {
        id: "ride-sharing-q3",
        question:
          "Your interviewer asks how you chose a cell size of roughly 300 metres. What is the real trade-off?",
        options: [
          { id: "a", label: "Too big and each cell holds thousands of drivers, so you are scanning again; too small and the 3×3 neighbourhood covers almost no ground, so every request expands rings over many near-empty cells." },
          { id: "b", label: "Smaller cells are always better because they make each lookup faster." },
          { id: "c", label: "The cell size must exactly match the maximum pickup radius, or the results are wrong." },
          { id: "d", label: "It only affects memory, never query time." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is the instinct and it is wrong in an interesting way: shrinking cells reduces drivers-per-cell but increases cells-per-query, and past a point you pay more in map lookups and ring expansions than you save. Being able to name both ends of the curve — and then say that a quadtree or H3 adapts the size to local density — is the full-credit answer.",
      },
      {
        id: "ride-sharing-q4",
        question:
          "You have sixteen ranked nearby drivers. Why not push the ride to all of them and let the first to tap Accept win?",
        options: [
          { id: "a", label: "Because sixteen accepts can arrive and fifteen must be rejected after a human already committed — it recreates the double-booking race, and the winner is decided by network latency rather than by your ranking." },
          { id: "b", label: "Because push notifications are expensive to send." },
          { id: "c", label: "Because drivers are not allowed to see more than one ride offer per day." },
          { id: "d", label: "Because broadcasting would require locking every driver at once." },
        ],
        correctOptionId: "a",
        explanation:
          "Broadcast feels faster and it is the most common wrong answer here. The damage is twofold: the ranking you carefully computed becomes decoration because 4G speed decides the winner, and the rejection moves from a cheap internal decision to a driver who has already braked and turned around. Sequential offers make the race impossible instead of merely handling it.",
      },
      {
        id: "ride-sharing-q5",
        question:
          "Two ride requests are processed at the same instant and both rank driver d3 first. What actually prevents both riders from being matched to d3?",
        options: [
          { id: "a", label: "An atomic compare-and-set on the driver from AVAILABLE to OFFERED — exactly one call returns true, and the loser walks down to candidate #2." },
          { id: "b", label: "Reading d3's state, checking it is AVAILABLE, and then setting it to OFFERED." },
          { id: "c", label: "The ranking is deterministic, so both requests would agree on the same order and cannot conflict." },
          { id: "d", label: "The ride state machine rejects the second MATCHED transition." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is exactly the bug — the gap between the check and the write is where the second rider gets stolen. (c) is a misread: agreeing on the same order is the *cause* of the collision, not a defence against it. (d) is too late; by then both riders have already been told a car is coming.",
      },
      {
        id: "ride-sharing-q6",
        question:
          "Which single rule removes most of the concurrency pressure from the matcher in the first place?",
        options: [
          { id: "a", label: "A driver in OFFERED or ON_TRIP is removed from the geo index, so they are not even a candidate for the next request." },
          { id: "b", label: "Synchronising the whole requestRide method so only one request runs at a time." },
          { id: "c", label: "Giving every driver a lock and acquiring them in id order before ranking." },
          { id: "d", label: "Retrying the failed compare-and-set on the same driver until it succeeds." },
        ],
        correctOptionId: "a",
        explanation:
          "The CAS is the last line of defence for a microsecond-wide window; the index removal is what makes that window rare. (b) serialises every request in the city to protect a resource that is almost never contended. (d) is worst of all — it waits for a driver who is busy while three free cars sit one cell away.",
      },
      {
        id: "ride-sharing-q7",
        question:
          "Driver #1 was offered the ride at t=0 with a fifteen-second deadline and never answered. What has to happen at t=15001, and what makes it testable?",
        options: [
          { id: "a", label: "A tick(now) sweep expires the offer, releases the driver back to AVAILABLE and back into the index, and offers candidate #2 — and because now is a parameter rather than a clock read, the whole chain runs deterministically in a test." },
          { id: "b", label: "The ride fails with NO_DRIVERS_FOUND, since the best candidate did not respond." },
          { id: "c", label: "The offer is re-sent to driver #1, since they may simply have missed it." },
          { id: "d", label: "A background thread sleeps for fifteen seconds and then wakes up to check." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is what most first drafts do, and it makes the most interesting behaviour in the system impossible to demonstrate in an interview — you cannot wait fifteen real seconds per test. Passing time in as a parameter to requestRide, accept and tick means you can assert the entire offer-expire-reoffer chain in microseconds. Note the release step too: a driver who ignored an offer goes straight back into the pool.",
      },
      {
        id: "ride-sharing-q8",
        question:
          "The trip is 6.4 km. Your fare code computes `metres / 1000 * perKmPaise` with integer arithmetic. What is wrong?",
        options: [
          { id: "a", label: "Integer division truncates 6400/1000 to 6, so 400 metres of every trip is free — you must multiply before you divide: metres * perKmPaise / 1000." },
          { id: "b", label: "Nothing — integer arithmetic is exactly why money should be stored in paise." },
          { id: "c", label: "It overflows for long trips." },
          { id: "d", label: "It is fine for distance but the same expression breaks for the surge multiplier." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is the seductive answer: integers are the right choice for money, and choosing them correctly does not save you from ordering the operations wrongly. Multiplying first keeps all the precision inside the integer domain. The same rule applies to surge — keep it as basis points (18000) and compute subtotal * bps / 10000, never a double multiply.",
      },
    ],
  },
};
