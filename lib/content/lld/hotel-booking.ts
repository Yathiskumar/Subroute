import type { RoadmapLesson } from "@/lib/content/types";

export const hotelBooking: RoadmapLesson = {
  title: "Hotel booking",
  oneLiner:
    "*“Is this room free?”* is not a yes/no question. It is a question about a **range of dates**, and the moment you understand that, the whole design falls out. Put a `boolean isBooked` on `Room` and you have already lost the round; keep a **count per night per room type** and everything else — search, pricing, cancellation, the last-room race — becomes ordinary.",
  difficulty: "advanced",
  estimatedTime: "45 min",
  prototypePath: "/prototypes/lld/hotel-booking.html",
  content: {
    prototypeCaption:
      "A live nightly-availability calendar you book against. Click **12** then **15** on the date strip and read the call line: `3 nights checked`, not 4. Press **🛏 Book** and watch the two passes — blue *checking* every night, then orange *taking* every night. Then press **🔴 Sell out night 2** and book again: it is refused in pass 1 and nothing moves. Flip **🩹 One-pass (buggy)** and repeat — night 1 is decremented, night 2 fails, and a red `⚠ leaked: 1` appears. Finish with **↔️ Checkout day** (two stays share 14 Aug and both succeed), the **⚠️ Use &lt;= instead of &lt;** toggle, and **⚔️ Two guests, last room** under **🔓 Unguarded** to watch a count go to **−1**.",

    // ==================================================================
    overview: [
      {
        type: "p",
        text: "*“Design a hotel booking system like Booking.com.”* One sentence, forty-five minutes, a blank file. Most candidates start typing entities inside ninety seconds, and most of them have already made the mistake that decides the round.",
      },
      {
        type: "p",
        text: "The mistake is small and it looks completely reasonable. It is a field called `isBooked` on a class called `Room`.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole lesson in one line",
        text: "**“Is this room free?” is not a yes/no question — it is a question about a range of dates.** A boolean can only answer *“free right now”*. Availability is a function of `(roomType, checkIn, checkOut)`. Once you say that sentence out loud, the nightly counter, the overlap test, the per-night price and the last-room race all follow from it. Say it in minute three, not minute thirty.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 420" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A hotel with three floors of room types — two suites, three deluxe rooms and six standard rooms — with a guest arriving at reception asking for a Deluxe from the twelfth to the fifteenth of August. A calendar strip below the hotel highlights the nights of the twelfth, thirteenth and fourteenth, showing that the fifteenth is a checkout day and not a night. Each noun is labelled with the class it becomes: Guest, Hotel, RoomType, Room, Stay, Inventory, Booking, RatePlan and CancellationPolicy.">
  <defs>
    <marker id="hb-scene-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="hb-scene-flow" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <rect x="206" y="26" width="288" height="200" rx="12" fill="none" stroke="#3a414c" stroke-width="1.4"/>
  <text x="220" y="46" font-size="9.5" fill="#6b7280">🏨 Sea Breeze, Goa — one Hotel</text>

  <rect x="220" y="56" width="260" height="46" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="232" y="74" font-size="10.5" fill="#e8e4dc">👑 Suite</text>
  <text x="232" y="92" font-size="9" fill="#6b7280">501   502</text>
  <text x="400" y="80" font-size="9.5" fill="#9099a8">2 rooms</text>

  <rect x="220" y="110" width="260" height="46" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="232" y="128" font-size="10.5" fill="#fb863a">✨ Deluxe</text>
  <text x="232" y="146" font-size="9" fill="#6b7280">401   402   403</text>
  <text x="400" y="134" font-size="9.5" fill="#fb863a">3 rooms</text>

  <rect x="220" y="164" width="260" height="46" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="232" y="182" font-size="10.5" fill="#e8e4dc">🛏 Standard</text>
  <text x="232" y="200" font-size="9" fill="#6b7280">301 … 306</text>
  <text x="400" y="188" font-size="9.5" fill="#9099a8">6 rooms</text>

  <text x="82" y="118" font-size="30">🧳</text>
  <text x="58" y="146" font-size="9.5" fill="#9099a8">Aarti · 2 guests</text>
  <text x="34" y="162" font-size="9" fill="#6b7280">“a Deluxe, 12–15 Aug”</text>
  <line x1="140" y1="118" x2="200" y2="128" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#hb-scene-flow)"/>

  <text x="206" y="256" font-size="9.5" fill="#6b7280">the calendar — availability lives HERE, never on a room</text>
  <rect x="206" y="264" width="46" height="42" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="220" y="282" font-size="11" fill="#fb863a">12</text>
  <text x="214" y="298" font-size="8" fill="#fb863a">night</text>
  <rect x="256" y="264" width="46" height="42" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="270" y="282" font-size="11" fill="#fb863a">13</text>
  <text x="264" y="298" font-size="8" fill="#fb863a">night</text>
  <rect x="306" y="264" width="46" height="42" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="320" y="282" font-size="11" fill="#fb863a">14</text>
  <text x="314" y="298" font-size="8" fill="#fb863a">night</text>
  <rect x="356" y="264" width="46" height="42" rx="5" fill="#14161a" stroke="#3a414c" stroke-dasharray="3 3"/>
  <text x="370" y="282" font-size="11" fill="#9099a8">15</text>
  <text x="360" y="298" font-size="8" fill="#6b7280">check-out</text>
  <rect x="406" y="264" width="46" height="42" rx="5" fill="#14161a" stroke="#232830"/>
  <text x="420" y="282" font-size="11" fill="#6b7280">16</text>
  <rect x="456" y="264" width="46" height="42" rx="5" fill="#14161a" stroke="#232830"/>
  <text x="470" y="282" font-size="11" fill="#6b7280">17</text>

  <text x="206" y="326" font-size="10" fill="#5cc66f">Stay(12 Aug, 15 Aug) → 3 nights, not 4</text>
  <text x="206" y="342" font-size="9" fill="#6b7280">the day you check out is the day the next guest checks in</text>

  <text x="16" y="216" font-size="11" fill="#fb863a">Guest</text>
  <text x="16" y="232" font-size="9" fill="#9099a8">id, name, contact</text>
  <text x="16" y="264" font-size="11" fill="#fb863a">Hotel</text>
  <text x="16" y="280" font-size="9" fill="#9099a8">city + its room types</text>
  <text x="16" y="312" font-size="11" fill="#fb863a">Room</text>
  <text x="16" y="328" font-size="9" fill="#9099a8">number, type</text>
  <text x="16" y="342" font-size="9" fill="#f06868">no isBooked flag</text>
  <line x1="130" y1="308" x2="216" y2="200" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#hb-scene-lead)"/>

  <text x="516" y="56" font-size="11" fill="#5e9ff6">RoomType</text>
  <text x="516" y="72" font-size="9" fill="#9099a8">what you actually SELL</text>
  <text x="516" y="86" font-size="9" fill="#9099a8">sleeps, totalRooms</text>
  <line x1="510" y1="66" x2="486" y2="86" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#hb-scene-flow)"/>

  <text x="516" y="120" font-size="11" fill="#5e9ff6">Stay</text>
  <text x="516" y="136" font-size="9" fill="#9099a8">checkIn, checkOut</text>
  <text x="516" y="150" font-size="9" fill="#9099a8">half-open [in, out)</text>

  <text x="516" y="184" font-size="11" fill="#5e9ff6">Booking</text>
  <text x="516" y="200" font-size="9" fill="#9099a8">guest, type, stay, rooms</text>
  <text x="516" y="214" font-size="9" fill="#9099a8">frozen per-night charges</text>

  <text x="516" y="248" font-size="11" fill="#5e9ff6">RatePlan</text>
  <text x="516" y="264" font-size="9" fill="#9099a8">rate(type, night) → paise</text>

  <text x="516" y="298" font-size="11" fill="#5e9ff6">CancellationPolicy</text>
  <text x="516" y="314" font-size="9" fill="#9099a8">refund(booking, at)</text>

  <rect x="510" y="330" width="214" height="72" rx="7" fill="#14161a" stroke="rgba(92,198,111,0.5)"/>
  <text x="522" y="350" font-size="11" fill="#5cc66f">Inventory</text>
  <text x="522" y="368" font-size="9" fill="#e8e4dc">Map&lt;(RoomTypeId, night), count&gt;</text>
  <text x="522" y="384" font-size="9" fill="#9099a8">the only thing that answers</text>
  <text x="522" y="396" font-size="9" fill="#9099a8">“is it free?” — one cell per night</text>
</svg>`,
        caption:
          "Two things to notice. **`Room` has no `isBooked`** — a room number is something you hand over at check-in, not something you sell. And the green box is where *free* is decided: **one counter per room type per night**.",
      },
      {
        type: "p",
        text: "Here is why the boolean is fatal rather than merely inelegant. Ask it three different questions and it gives the same answer to all three, and that answer is wrong at least twice.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A single boolean field named isBooked set to false sits in the middle. Three different date-range questions point at it — is room 402 free from the twelfth to the fifteenth, from the first to the third of September, and from the fourteenth to the sixteenth — and each arrow ends in a question mark because one boolean cannot distinguish between them. Below, the same boolean is shown answering true after one booking, which wrongly blocks every other date in the year.">
  <defs>
    <marker id="hb-bool-q" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ the trap — one bit asked three different questions</text>

  <rect x="280" y="112" width="164" height="66" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.55)" stroke-width="1.4"/>
  <text x="294" y="134" font-size="10" fill="#9099a8">class Room</text>
  <text x="294" y="156" font-size="12" fill="#f06868">boolean isBooked</text>
  <text x="294" y="171" font-size="9" fill="#6b7280">one bit. no dates. ever.</text>

  <text x="20" y="56" font-size="10" fill="#e8e4dc">“free 12 Aug → 15 Aug?”</text>
  <line x1="196" y1="52" x2="274" y2="120" stroke="#f06868" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#hb-bool-q)"/>
  <text x="232" y="80" font-size="14" fill="#f06868">?</text>

  <text x="20" y="146" font-size="10" fill="#e8e4dc">“free 1 Sep → 3 Sep?”</text>
  <line x1="196" y1="142" x2="274" y2="144" stroke="#f06868" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#hb-bool-q)"/>
  <text x="232" y="136" font-size="14" fill="#f06868">?</text>

  <text x="20" y="236" font-size="10" fill="#e8e4dc">“free 14 Aug → 16 Aug?”</text>
  <line x1="196" y1="232" x2="274" y2="172" stroke="#f06868" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#hb-bool-q)"/>
  <text x="232" y="212" font-size="14" fill="#f06868">?</text>

  <rect x="474" y="40" width="226" height="98" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="488" y="60" font-size="10" fill="#f06868">after ONE booking on 12 Aug</text>
  <line x1="488" y1="70" x2="686" y2="70" stroke="#2d333d"/>
  <text x="488" y="90" font-size="10" fill="#e8e4dc">isBooked = true</text>
  <text x="488" y="110" font-size="9.5" fill="#9099a8">→ room 402 is now “taken”</text>
  <text x="488" y="126" font-size="9.5" fill="#f06868">→ for all 365 nights of the year</text>

  <rect x="474" y="152" width="226" height="122" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="488" y="172" font-size="10" fill="#5cc66f">✓ what actually answers it</text>
  <line x1="488" y1="182" x2="686" y2="182" stroke="#2d333d"/>
  <text x="488" y="202" font-size="9.5" fill="#e8e4dc">isAvailable(</text>
  <text x="500" y="218" font-size="9.5" fill="#fb863a">roomType,</text>
  <text x="500" y="234" font-size="9.5" fill="#fb863a">checkIn, checkOut)</text>
  <text x="488" y="252" font-size="9.5" fill="#e8e4dc">→ boolean</text>
  <text x="488" y="268" font-size="9" fill="#6b7280">a function of a RANGE, not a field</text>

  <text x="20" y="290" font-size="9.5" fill="#6b7280">the boolean is not a small simplification you fix later — every method you write on top of it inherits the same blindness</text>
</svg>`,
        caption:
          "A boolean is a *snapshot*. A hotel sells the *future*. Nothing you build on top of `isBooked` can recover the information it never stored — which is why this is the one design decision you must get right before you write anything else.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Is availability a range question?** `isAvailable(roomType, checkIn, checkOut)` — and do you know that two stays clash only when their ranges **overlap**, with the test `aStart < bEnd && bStart < aEnd`?",
          "**Are the intervals half-open?** `[checkIn, checkOut)`. If your code counts the checkout day as a night, thirty rooms become unsellable on every changeover day and your test suite will never notice.",
          "**Do you sell a room *type*, not a room?** Guests book *“a Deluxe”*, not room 402. So inventory is a **count per night**, and assigning the actual room number is a **check-in-time** decision. Saying that out loud is the strongest single signal in this round.",
          "**Is the multi-night take all-or-nothing?** Check ALL nights, then take ALL nights. A partial decrement leaves your hotel in a state no guest asked for — the exact two-pass shape from [[coffee-machine]].",
          "**Is price per night, or per stay?** A three-night stay is `sum(rate(night))`, never `nightlyRate × 3`. And the booking stores the **frozen** breakdown so tomorrow's price change cannot rewrite yesterday's bill.",
          "**Does the last room go to exactly one guest?** Guard the **nightly counters**, not the whole hotel, and take the night locks in **sorted date order**.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "This is not the meeting-room problem",
        text: "[[meeting-room-scheduler]] also lives on the overlap test, and you should absolutely reuse it here. But there the resource is **one named room** and the answer is a *conflict check against a list of intervals*. Here you sell **an interchangeable pool of thirty identical Deluxe rooms**, so the answer is a *count per night*. Same arithmetic, completely different data structure — and the interviewer is watching to see whether you notice.",
      },
    ],

    // ==================================================================
    howItWorks: [
      // ---------------------------------------------------------- step 1
      { type: "h", text: "Step 1 · Clarify — 5 minutes" },
      {
        type: "p",
        text: "Six questions. They take ninety seconds and they decide what the next forty minutes look like. This is [[five-step-framework]] applied to a problem where the first question is the whole game.",
      },
      {
        type: "ul",
        items: [
          "**Does a guest book a specific room, or a room type?** — the question that unlocks everything. The answer is *a type*. Ask it first and the interviewer knows you have thought about this before.",
          "**One hotel or many?** — start with one hotel, keep `hotelId` on the inventory key so multi-property is a widening, not a rewrite.",
          "**Can a booking span multiple rooms?** — yes, *“2 Deluxe rooms for 3 nights”*. It costs you one `rooms` field and it changes the counter arithmetic from ±1 to ±n.",
          "**Is the price the same every night?** — no. Weekends, seasons and festivals differ, so the total is a **sum over nights**. Ask it; it is the second-biggest scoring question in the round.",
          "**What happens on cancellation?** — there is a policy: free until some hours before check-in, then a penalty. Model it as an object, not an `if`.",
          "**Do we overbook?** — hotels deliberately do. It is one number, `overbookBuffer`, and it must live in exactly one place.",
          "**Payments, reviews, loyalty points, the mobile app, search ranking?** — out of scope, in one sentence, and move on.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 246" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A two column scope board for the hotel booking round. In scope: room types and rooms, half-open stays, a nightly availability inventory, an all-or-nothing multi-night booking, a per-night rate plan, a cancellation policy with refunds, search over a date range, and a concurrency guard on the last room. Out of scope: payment gateways, reviews and ratings, loyalty programmes, search ranking and recommendations, the mobile user interface, and database schema design.">
  <text x="20" y="22" font-size="10.5" fill="#5cc66f">✓ IN — build these</text>
  <rect x="20" y="32" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="56" font-size="10" fill="#e8e4dc">Hotel · RoomType · Room · Guest</text>
  <text x="38" y="78" font-size="10" fill="#fb863a">Stay — half-open [checkIn, checkOut)</text>
  <text x="38" y="100" font-size="10" fill="#fb863a">Inventory — a count per type per night</text>
  <text x="38" y="122" font-size="10" fill="#e8e4dc">book() — check ALL nights, take ALL nights</text>
  <text x="38" y="144" font-size="10" fill="#fb863a">RatePlan — price per NIGHT, summed</text>
  <text x="38" y="166" font-size="10" fill="#e8e4dc">CancellationPolicy → refund in paise</text>
  <text x="38" y="188" font-size="10" fill="#e8e4dc">search(city, dates, guests)</text>
  <text x="38" y="210" font-size="10" fill="#fb863a">the last-room race, guarded per night</text>

  <text x="364" y="22" font-size="10.5" fill="#f06868">✗ OUT — say it in one sentence</text>
  <rect x="364" y="32" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="382" y="56" font-size="10" fill="#9099a8">payment gateways, refunds to a card</text>
  <text x="382" y="78" font-size="10" fill="#9099a8">reviews, ratings, photos</text>
  <text x="382" y="100" font-size="10" fill="#9099a8">loyalty points and coupons</text>
  <text x="382" y="122" font-size="10" fill="#9099a8">search ranking / recommendations</text>
  <text x="382" y="144" font-size="10" fill="#9099a8">the mobile UI and the web front end</text>
  <text x="382" y="166" font-size="10" fill="#9099a8">database schema and persistence</text>
  <line x1="382" y1="180" x2="662" y2="180" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="200" font-size="9.5" fill="#6b7280">“cancel() computes the refund amount and</text>
  <text x="382" y="216" font-size="9.5" fill="#6b7280">returns it — moving money is someone else’s</text>
  <text x="382" y="230" font-size="9.5" fill="#6b7280">job” is a complete answer.</text>
</svg>`,
        caption:
          "The four orange lines on the left are the entire grade. Everything else on that list is expected of anyone; those four are what separate the offers.",
      },

      // ---------------------------------------------------------- step 2
      { type: "h", text: "Step 2 · Nouns → classes" },
      {
        type: "p",
        text: "Read the prompt back and underline the nouns. Almost every one becomes a class, and the two that do **not** are the interesting ones.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 372" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A mapping table from the nouns in the interview prompt to the classes they become. A hotel in Goa becomes Hotel. A Deluxe room becomes RoomType, the thing you sell. Room 402 becomes Room, the thing you hand over at check-in. The twelfth to the fifteenth of August becomes Stay, a half-open date range. Is it free becomes Inventory, a count per room type per night. Book it becomes Booking with frozen per-night charges. Six thousand five hundred rupees a night becomes RatePlan. Free cancellation becomes CancellationPolicy. Two guests becomes a sleeps field on RoomType. The final red row shows Room dot isBooked as a boolean, marked as the trap that becomes nothing at all.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">underline the nouns in the prompt, then map them</text>

  <rect x="20" y="32" width="680" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="50" font-size="9" fill="#6b7280">the noun they said</text>
  <text x="256" y="50" font-size="9" fill="#6b7280">the class</text>
  <text x="410" y="50" font-size="9" fill="#6b7280">what it holds — and why</text>

  <rect x="20" y="62" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="80" font-size="9.5" fill="#e8e4dc">“a hotel in Goa”</text>
  <text x="256" y="80" font-size="9.5" fill="#5e9ff6">Hotel</text>
  <text x="410" y="80" font-size="9.5" fill="#9099a8">id, name, city, its room types</text>

  <rect x="20" y="94" width="680" height="28" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="34" y="112" font-size="9.5" fill="#e8e4dc">“a Deluxe room”</text>
  <text x="256" y="112" font-size="9.5" fill="#fb863a">RoomType</text>
  <text x="410" y="112" font-size="9.5" fill="#fb863a">sleeps, totalRooms — this is what you SELL</text>

  <rect x="20" y="126" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="144" font-size="9.5" fill="#e8e4dc">“room 402”</text>
  <text x="256" y="144" font-size="9.5" fill="#5e9ff6">Room</text>
  <text x="410" y="144" font-size="9.5" fill="#9099a8">number, type — handed over at CHECK-IN</text>

  <rect x="20" y="158" width="680" height="28" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="34" y="176" font-size="9.5" fill="#e8e4dc">“12–15 Aug”</text>
  <text x="256" y="176" font-size="9.5" fill="#fb863a">Stay</text>
  <text x="410" y="176" font-size="9.5" fill="#fb863a">checkIn, checkOut — half-open, so 3 nights</text>

  <rect x="20" y="190" width="680" height="28" rx="5" fill="#14161a" stroke="rgba(92,198,111,0.5)"/>
  <text x="34" y="208" font-size="9.5" fill="#e8e4dc">“is it free?”</text>
  <text x="256" y="208" font-size="9.5" fill="#5cc66f">Inventory</text>
  <text x="410" y="208" font-size="9.5" fill="#5cc66f">Map&lt;(RoomTypeId, night), count&gt; — the core</text>

  <rect x="20" y="222" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="240" font-size="9.5" fill="#e8e4dc">“book it”</text>
  <text x="256" y="240" font-size="9.5" fill="#5e9ff6">Booking</text>
  <text x="410" y="240" font-size="9.5" fill="#9099a8">guest, type, stay, rooms, FROZEN charges</text>

  <rect x="20" y="254" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="272" font-size="9.5" fill="#e8e4dc">“₹6,500 a night”</text>
  <text x="256" y="272" font-size="9.5" fill="#5e9ff6">RatePlan</text>
  <text x="410" y="272" font-size="9.5" fill="#9099a8">rateFor(type, night) → paise. one night at a time</text>

  <rect x="20" y="286" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="304" font-size="9.5" fill="#e8e4dc">“free cancellation”</text>
  <text x="256" y="304" font-size="9.5" fill="#5e9ff6">CancellationPolicy</text>
  <text x="410" y="304" font-size="9.5" fill="#9099a8">refundFor(booking, at) → paise</text>

  <rect x="20" y="318" width="680" height="28" rx="5" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="34" y="336" font-size="9.5" fill="#f06868">“the room is booked”</text>
  <text x="256" y="336" font-size="9.5" fill="#f06868">✗ nothing</text>
  <text x="410" y="336" font-size="9.5" fill="#f06868">Room.isBooked is the trap — do not write it</text>

  <text x="20" y="364" font-size="9" fill="#6b7280">two guests → a “sleeps” field on RoomType, filtered before any date arithmetic happens</text>
</svg>`,
        caption:
          "`RoomType` and `Room` being *separate* is the sentence that carries this table. One is a product listing; the other is a key on a hook.",
      },

      // ---------------------------------------------------------- overlap
      { type: "h", text: "Step 3 · The overlap test, and the `<=` that costs you thirty rooms" },
      {
        type: "p",
        text: "Two stays clash when their date ranges overlap. People reach for four separate cases — *a starts inside b*, *b starts inside a*, *a contains b*, *b contains a* — write eight comparisons, and get one of them wrong. There is one line that covers all four.",
      },
      {
        type: "code",
        language: "java",
        filename: "the only overlap test you ever need",
        code: `/**
 * Two half-open ranges [aStart, aEnd) and [bStart, bEnd) overlap
 * if and only if each one starts before the other one ends.
 *
 * STRICT "<" on BOTH sides. That is not a style choice — it is what makes
 * "checkout Tuesday, check-in Tuesday" legal, which it must be.
 */
static boolean overlaps(LocalDate aStart, LocalDate aEnd,
                        LocalDate bStart, LocalDate bEnd) {
    return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
}`,
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 386" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A Gantt chart with a date axis from the ninth to the eighteenth of August. An existing booking bar spans the twelfth to the fifteenth. Below it, six candidate bars are drawn. Four are red because they overlap: the tenth to the thirteenth partly overlaps at the start, the thirteenth to the fourteenth is entirely contained, the eleventh to the seventeenth completely contains the existing booking, and the fourteenth to the sixteenth partly overlaps at the end. Two are green because they only touch: the ninth to the twelfth ends exactly where the booking starts, and the fifteenth to the seventeenth starts exactly where the booking ends. The formula aStart is before bEnd and bStart is before aEnd is printed underneath.">
  <text x="20" y="20" font-size="10.5" fill="#9099a8">existing booking: Deluxe, 12 Aug → 15 Aug   ·   does the candidate clash?</text>

  <line x1="150" y1="34" x2="676" y2="34" stroke="#2d333d"/>
  <text x="150" y="30" font-size="8.5" fill="#6b7280">9</text>
  <text x="208" y="30" font-size="8.5" fill="#6b7280">10</text>
  <text x="266" y="30" font-size="8.5" fill="#6b7280">11</text>
  <text x="324" y="30" font-size="8.5" fill="#6b7280">12</text>
  <text x="382" y="30" font-size="8.5" fill="#6b7280">13</text>
  <text x="440" y="30" font-size="8.5" fill="#6b7280">14</text>
  <text x="498" y="30" font-size="8.5" fill="#6b7280">15</text>
  <text x="556" y="30" font-size="8.5" fill="#6b7280">16</text>
  <text x="614" y="30" font-size="8.5" fill="#6b7280">17</text>
  <text x="666" y="30" font-size="8.5" fill="#6b7280">18</text>

  <rect x="324" y="42" width="174" height="26" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="336" y="60" font-size="9.5" fill="#fb863a">EXISTING  12 → 15</text>
  <text x="20" y="60" font-size="9.5" fill="#fb863a">the booking</text>

  <rect x="208" y="82" width="174" height="24" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.6)"/>
  <text x="220" y="99" font-size="9" fill="#f06868">10 → 13</text>
  <text x="20" y="99" font-size="9" fill="#e8e4dc">partial, before</text>
  <text x="558" y="99" font-size="9.5" fill="#f06868">✗ CLASH</text>

  <rect x="382" y="116" width="58" height="24" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.6)"/>
  <text x="390" y="133" font-size="9" fill="#f06868">13 → 14</text>
  <text x="20" y="133" font-size="9" fill="#e8e4dc">contained</text>
  <text x="558" y="133" font-size="9.5" fill="#f06868">✗ CLASH</text>

  <rect x="266" y="150" width="348" height="24" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.6)"/>
  <text x="278" y="167" font-size="9" fill="#f06868">11 → 17</text>
  <text x="20" y="167" font-size="9" fill="#e8e4dc">contains it</text>
  <text x="558" y="167" font-size="9.5" fill="#f06868">✗ CLASH</text>

  <rect x="440" y="184" width="116" height="24" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.6)"/>
  <text x="452" y="201" font-size="9" fill="#f06868">14 → 16</text>
  <text x="20" y="201" font-size="9" fill="#e8e4dc">partial, after</text>
  <text x="558" y="201" font-size="9.5" fill="#f06868">✗ CLASH</text>

  <rect x="150" y="218" width="174" height="24" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.6)"/>
  <text x="162" y="235" font-size="9" fill="#5cc66f">9 → 12</text>
  <text x="20" y="235" font-size="9" fill="#e8e4dc">touches, before</text>
  <text x="558" y="235" font-size="9.5" fill="#5cc66f">✓ FREE</text>

  <rect x="498" y="252" width="116" height="24" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.6)"/>
  <text x="510" y="269" font-size="9" fill="#5cc66f">15 → 17</text>
  <text x="20" y="269" font-size="9" fill="#e8e4dc">touches, after</text>
  <text x="558" y="269" font-size="9.5" fill="#5cc66f">✓ FREE</text>

  <rect x="20" y="292" width="656" height="46" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="38" y="312" font-size="11" fill="#fb863a">one line covers all six rows</text>
  <text x="38" y="330" font-size="11.5" fill="#e8e4dc">overlaps  ⇔  aStart &lt; bEnd  &amp;&amp;  bStart &lt; aEnd</text>

  <text x="20" y="360" font-size="9.5" fill="#6b7280">the two green rows are the reason both comparisons are STRICT — with &lt;= they turn red and the room goes unsold</text>
  <text x="20" y="376" font-size="9.5" fill="#6b7280">no “contains” branch is needed: containment is already just “each starts before the other ends”</text>
</svg>`,
        caption:
          "Four ways to clash, two ways to merely touch, **one** expression. Draw exactly this on the whiteboard and then write the line — it takes twenty seconds and it removes any doubt that you know the case you are about to be asked about.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The off-by-one that makes thirty rooms unsellable",
        text: "Write `aStart <= bEnd && bStart <= aEnd` and stays that merely *touch* now count as a clash. Guest A checks out on Tuesday morning; guest B wants to check in on Tuesday afternoon; your system says the room is taken. On a busy changeover day that is **every room in the hotel, refused**. The bug never throws, never logs, and passes every test that only ever books non-adjacent dates — which is every test anyone writes by hand.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 316" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The changeover day explained. On the top, a timeline of Tuesday shows guest A checking out at eleven in the morning and guest B checking in at three in the afternoon, both using room 402, with the correct half-open ranges shown as Monday to Tuesday and Tuesday to Thursday, and a green tick saying no clash. On the bottom, the same two stays are evaluated with the buggy less-than-or-equal comparison; Tuesday is shaded red and marked as a false clash, and a note says the whole hotel is refused on every changeover day.">
  <text x="20" y="20" font-size="10.5" fill="#5cc66f">✓ half-open [checkIn, checkOut) — the day you leave is not a night you paid for</text>

  <rect x="20" y="30" width="660" height="118" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <line x1="60" y1="76" x2="640" y2="76" stroke="#2d333d"/>
  <text x="128" y="46" font-size="9" fill="#6b7280">MON</text>
  <text x="316" y="46" font-size="9" fill="#fb863a">TUE — changeover</text>
  <text x="520" y="46" font-size="9" fill="#6b7280">WED</text>
  <line x1="286" y1="52" x2="286" y2="140" stroke="#3a414c" stroke-dasharray="3 3"/>
  <line x1="446" y1="52" x2="446" y2="140" stroke="#3a414c" stroke-dasharray="3 3"/>

  <rect x="70" y="60" width="216" height="26" rx="4" fill="rgba(94,159,246,0.14)" stroke="#5e9ff6"/>
  <text x="82" y="78" font-size="9" fill="#5e9ff6">guest A · Stay(MON, TUE) · 1 night</text>
  <text x="228" y="102" font-size="9" fill="#9099a8">🚪 out 11:00</text>

  <rect x="286" y="96" width="300" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="#5cc66f"/>
  <text x="298" y="114" font-size="9" fill="#5cc66f">guest B · Stay(TUE, THU) · 2 nights</text>
  <text x="300" y="140" font-size="9" fill="#9099a8">🔑 in 15:00 — same room 402</text>

  <text x="596" y="78" font-size="10" fill="#5cc66f">✓ no clash</text>
  <text x="596" y="114" font-size="8.5" fill="#6b7280">TUE &lt; THU ✓</text>
  <text x="596" y="128" font-size="8.5" fill="#6b7280">MON &lt; TUE ✓</text>

  <text x="20" y="180" font-size="10.5" fill="#f06868">✗ the same two stays with &lt;= instead of &lt;</text>
  <rect x="20" y="190" width="660" height="106" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>

  <rect x="286" y="200" width="160" height="86" rx="5" fill="rgba(240,104,104,0.18)" stroke="rgba(240,104,104,0.6)"/>
  <text x="308" y="220" font-size="9.5" fill="#f06868">TUESDAY</text>
  <text x="300" y="238" font-size="9" fill="#f06868">counted as a night</text>
  <text x="308" y="254" font-size="9" fill="#f06868">by BOTH stays</text>
  <text x="316" y="274" font-size="16" fill="#f06868">✗</text>

  <rect x="70" y="212" width="216" height="24" rx="4" fill="rgba(94,159,246,0.1)" stroke="#3a414c"/>
  <text x="82" y="229" font-size="9" fill="#9099a8">guest A · MON → TUE</text>
  <rect x="286" y="248" width="300" height="24" rx="4" fill="rgba(92,198,111,0.08)" stroke="#3a414c"/>
  <text x="298" y="265" font-size="9" fill="#9099a8">guest B · TUE → THU</text>

  <text x="466" y="222" font-size="9.5" fill="#f06868">“room 402 is not available”</text>
  <text x="466" y="240" font-size="9" fill="#9099a8">for a room that is standing empty</text>
  <text x="466" y="262" font-size="9" fill="#f06868">× every room, every changeover day</text>
  <text x="466" y="280" font-size="9" fill="#6b7280">nothing throws. nothing logs.</text>
</svg>`,
        caption:
          "The red block is one character of source code. In the prototype, the **⚠️ Use &lt;= instead of &lt;** toggle turns this figure on and off in a single click — press it and watch a 12→15 selection start holding **4** nights instead of 3.",
      },

      // ---------------------------------------------------------- step 4
      { type: "h", text: "Step 4 · Sell a room *type* — one counter per night" },
      {
        type: "p",
        text: "Nobody has ever asked a hotel for room 402. They ask for *“a Deluxe”*. The hotel has three Deluxe rooms and they are interchangeable, so the only question that matters is *how many are still free on each night of your stay*.",
      },
      {
        type: "p",
        text: "So the inventory is one number per cell of a grid: **room type down the side, night across the top**. `Map<(RoomTypeId, LocalDate), int>` — either the free count directly, or the booked count with `free = totalRooms − booked`. The second is better, because `totalRooms` can then change without rewriting history.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 336" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A nightly inventory grid. Room types Standard with six rooms, Deluxe with three rooms and Suite with two rooms run down the left side. Nights from the twelfth to the seventeenth of August run across the top. Each cell holds the number of rooms still free on that night. A three-night Deluxe booking from the twelfth to the fifteenth is drawn as an orange bar covering exactly the twelfth, thirteenth and fourteenth columns, and the three Deluxe cells underneath it drop from three to two while the fifteenth column is untouched.">
  <defs>
    <marker id="hb-grid-drop" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <text x="20" y="20" font-size="10.5" fill="#9099a8">Inventory — free rooms per type, per night</text>

  <text x="152" y="46" font-size="9.5" fill="#6b7280">12 Aug</text>
  <text x="242" y="46" font-size="9.5" fill="#6b7280">13 Aug</text>
  <text x="332" y="46" font-size="9.5" fill="#6b7280">14 Aug</text>
  <text x="422" y="46" font-size="9.5" fill="#6b7280">15 Aug</text>
  <text x="512" y="46" font-size="9.5" fill="#6b7280">16 Aug</text>
  <text x="602" y="46" font-size="9.5" fill="#6b7280">17 Aug</text>

  <rect x="146" y="56" width="252" height="26" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="158" y="74" font-size="9.5" fill="#fb863a">Aarti · 1 Deluxe · Stay(12 Aug, 15 Aug) · 3 nights</text>
  <text x="410" y="74" font-size="9" fill="#6b7280">15 Aug is a check-out, so it is NOT touched</text>

  <text x="20" y="120" font-size="10" fill="#e8e4dc">🛏 Standard</text>
  <text x="20" y="134" font-size="8.5" fill="#6b7280">6 rooms</text>
  <rect x="146" y="100" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="180" y="122" font-size="12" fill="#5cc66f">4</text>
  <rect x="236" y="100" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="270" y="122" font-size="12" fill="#5cc66f">4</text>
  <rect x="326" y="100" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="360" y="122" font-size="12" fill="#5cc66f">6</text>
  <rect x="416" y="100" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="450" y="122" font-size="12" fill="#5cc66f">6</text>
  <rect x="506" y="100" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="540" y="122" font-size="12" fill="#5cc66f">6</text>
  <rect x="596" y="100" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="630" y="122" font-size="12" fill="#5cc66f">6</text>

  <text x="20" y="172" font-size="10" fill="#fb863a">✨ Deluxe</text>
  <text x="20" y="186" font-size="8.5" fill="#6b7280">3 rooms</text>
  <rect x="146" y="152" width="84" height="34" rx="5" fill="rgba(251,134,58,0.1)" stroke="rgba(251,134,58,0.55)"/>
  <text x="166" y="174" font-size="12" fill="#9099a8">3</text><text x="182" y="174" font-size="11" fill="#fb863a">→ 2</text>
  <rect x="236" y="152" width="84" height="34" rx="5" fill="rgba(251,134,58,0.1)" stroke="rgba(251,134,58,0.55)"/>
  <text x="256" y="174" font-size="12" fill="#9099a8">3</text><text x="272" y="174" font-size="11" fill="#fb863a">→ 2</text>
  <rect x="326" y="152" width="84" height="34" rx="5" fill="rgba(251,134,58,0.1)" stroke="rgba(251,134,58,0.55)"/>
  <text x="346" y="174" font-size="12" fill="#9099a8">3</text><text x="362" y="174" font-size="11" fill="#fb863a">→ 2</text>
  <rect x="416" y="152" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="450" y="174" font-size="12" fill="#5cc66f">3</text>
  <rect x="506" y="152" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="540" y="174" font-size="12" fill="#5cc66f">3</text>
  <rect x="596" y="152" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="630" y="174" font-size="12" fill="#5cc66f">3</text>

  <line x1="188" y1="82" x2="188" y2="148" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#hb-grid-drop)"/>
  <line x1="278" y1="82" x2="278" y2="148" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#hb-grid-drop)"/>
  <line x1="368" y1="82" x2="368" y2="148" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#hb-grid-drop)"/>

  <text x="20" y="224" font-size="10" fill="#e8e4dc">👑 Suite</text>
  <text x="20" y="238" font-size="8.5" fill="#6b7280">2 rooms</text>
  <rect x="146" y="204" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="180" y="226" font-size="12" fill="#5cc66f">2</text>
  <rect x="236" y="204" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="270" y="226" font-size="12" fill="#5cc66f">2</text>
  <rect x="326" y="204" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="360" y="226" font-size="12" fill="#5cc66f">2</text>
  <rect x="416" y="204" width="84" height="34" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.4)"/><text x="450" y="226" font-size="12" fill="#fb863a">1</text>
  <rect x="506" y="204" width="84" height="34" rx="5" fill="#14161a" stroke="rgba(240,104,104,0.5)"/><text x="450" y="226" font-size="12" fill="#fb863a"> </text><text x="540" y="226" font-size="12" fill="#f06868">0</text>
  <rect x="596" y="204" width="84" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="630" y="226" font-size="12" fill="#5cc66f">2</text>

  <rect x="20" y="256" width="660" height="66" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="36" y="276" font-size="10" fill="#e8e4dc">booking N nights  =  N counter decrements, all-or-nothing</text>
  <text x="36" y="296" font-size="9.5" fill="#9099a8">availability(type, stay)  =  min( free[type][night] for every night in the stay )</text>
  <text x="36" y="314" font-size="9.5" fill="#5cc66f">“1 Suite free on 15 Aug, 0 on 16 Aug” → a 15→17 stay is refused, because the MINIMUM is 0</text>
</svg>`,
        caption:
          "Read the last line twice. Availability across a range is the **minimum** across its nights — which is why search, booking and the sold-out check are all the same query with a different threshold.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The sentence that scores highest in this round",
        text: "*“I assign the actual room number at **check-in**, not at booking time. At booking I only decrement a nightly counter for the room type. That way a maintenance closure, an upgrade, or a guest extending by a night never has to move anyone between rooms.”* Say it unprompted while you are drawing the `Inventory` box. It signals that you have seen how hotels really work, and it pre-answers three follow-ups.",
      },
      {
        type: "p",
        text: "There is an honest alternative: give each **individual room** a sorted list of booked intervals and use the overlap test against it. It is worth naming, because it is not wrong — it is just right for a different shape of business.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 264" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A comparison of the two availability models. The nightly counter model per room type is O of N nights per check, is tiny in memory, handles a hundred identical rooms well, and needs no room chosen until check-in, but it cannot express a per-room constraint such as a sea view or a specific accessible room. The per-room interval list model is O of number of rooms times log of bookings per check, grows with history, is the right model when every room is different such as villas or apartments, and can answer questions about a specific room, but it forces a room choice at booking time and makes the last-room race harder to guard.">
  <text x="20" y="20" font-size="10.5" fill="#5cc66f">✓ counter per (type, night) — a hotel</text>
  <rect x="20" y="30" width="316" height="200" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="36" y="52" font-size="9.5" fill="#e8e4dc">check cost:  O(nights)  — 3 lookups</text>
  <text x="36" y="74" font-size="9.5" fill="#e8e4dc">memory:  1 int per type per night</text>
  <text x="36" y="96" font-size="9.5" fill="#5cc66f">100 identical Deluxe rooms → still 1 int</text>
  <text x="36" y="118" font-size="9.5" fill="#5cc66f">no room chosen until check-in</text>
  <text x="36" y="140" font-size="9.5" fill="#5cc66f">overbooking is one number on the type</text>
  <text x="36" y="162" font-size="9.5" fill="#5cc66f">the race guards ONE cell per night</text>
  <line x1="36" y1="176" x2="320" y2="176" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="36" y="196" font-size="9.5" fill="#f06868">✗ cannot say “room 402 specifically”</text>
  <text x="36" y="216" font-size="9" fill="#6b7280">sea view / accessible → make it its own type</text>

  <text x="364" y="20" font-size="10.5" fill="#5e9ff6">◆ interval list per room — villas, apartments</text>
  <rect x="364" y="30" width="316" height="200" rx="8" fill="#14161a" stroke="rgba(94,159,246,0.45)"/>
  <text x="380" y="52" font-size="9.5" fill="#e8e4dc">check cost:  O(rooms × log bookings)</text>
  <text x="380" y="74" font-size="9.5" fill="#e8e4dc">memory:  grows with history, forever</text>
  <text x="380" y="96" font-size="9.5" fill="#5cc66f">right when every unit is different</text>
  <text x="380" y="118" font-size="9.5" fill="#5cc66f">answers “is 402 free?” directly</text>
  <text x="380" y="140" font-size="9.5" fill="#5cc66f">this is the meeting-room-scheduler model</text>
  <line x1="380" y1="156" x2="664" y2="156" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="380" y="176" font-size="9.5" fill="#f06868">✗ forces a room choice at booking time</text>
  <text x="380" y="196" font-size="9.5" fill="#f06868">✗ the race must guard every candidate room</text>
  <text x="380" y="216" font-size="9" fill="#6b7280">and reshuffling for a 3-night stay is painful</text>

  <text x="20" y="254" font-size="9.5" fill="#6b7280">say both out loud, pick the counter, and give the one-line reason: “the rooms in a type are interchangeable, so I only need how many”</text>
</svg>`,
        caption:
          "Naming the alternative and then *choosing* is worth more than only knowing one. The deciding question is a single sentence: **are the units interchangeable?** For a hotel, yes. For a villa rental, no.",
      },

      // ---------------------------------------------------------- two-pass
      { type: "h", text: "Step 5 · Two passes — check ALL nights, then take ALL nights" },
      {
        type: "p",
        text: "Booking three nights means decrementing three counters. The temptation is to loop once: check a night, take it, move to the next. That works right up until night two is full — and now night one is decremented, no booking exists, and a room is held for a guest who does not exist. That is a **leak**, and nothing in your code will ever notice it.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "One pass is the bug; two passes is the fix",
        text: "**Pass 1 — check every night. Pass 2 — only then, take every night.** If any night fails in pass 1, you return without having touched a single counter. This is the identical shape to the ingredient tanks in [[coffee-machine]]: *verify the whole order, then consume the whole order*. The prototype's **🩹 One-pass (buggy)** toggle replays exactly this and leaves a red `⚠ leaked: 1 night` on the grid.",
      },
      {
        type: "code",
        language: "java",
        filename: "the all-or-nothing take",
        code: `/**
 * Two passes over the SAME night list, under the SAME lock.
 *   pass 1  can every night afford it?      (no writes at all)
 *   pass 2  take every night                (no checks at all)
 *
 * Returning false in pass 1 means the inventory is byte-for-byte unchanged.
 */
boolean tryTake(RoomTypeId type, Stay stay, int rooms) {
    List<LocalDate> nights = stay.nightList();

    lockNightsInSortedOrder(type, nights);          // sorted -> no deadlock
    try {
        for (LocalDate n : nights)                  // ---- pass 1: CHECK ALL
            if (freeOn(type, n) < rooms) return false;

        for (LocalDate n : nights)                  // ---- pass 2: TAKE ALL
            booked.get(type).merge(n, rooms, Integer::sum);

        return true;
    } finally {
        unlockNights(type, nights);
    }
}`,
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 400" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram of the book method. A guest calls book with a room type, a stay and a room count. The booking service first asks the rate plan for the rate of each night and freezes the resulting charges. It then calls tryTake on the inventory, which locks the nights in sorted order and runs pass one, checking every night without writing. If every night has room, pass two decrements every night and the service creates a confirmed booking. The alternative branch shows night two returning zero free, so pass one returns false immediately, no counter is written, and the guest receives a sold-out answer with the inventory unchanged.">
  <defs>
    <marker id="hb-seq-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="hb-seq-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="hb-seq-bad" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#f06868" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="92" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="40" y="32" font-size="10.5" fill="#e8e4dc">Guest</text>
  <rect x="164" y="12" width="132" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="176" y="32" font-size="10.5" fill="#fb863a">BookingService</text>
  <rect x="360" y="12" width="106" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="376" y="32" font-size="10.5" fill="#5e9ff6">RatePlan</text>
  <rect x="536" y="12" width="112" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="552" y="32" font-size="10.5" fill="#5cc66f">Inventory</text>

  <line x1="60" y1="42" x2="60" y2="388" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="230" y1="42" x2="230" y2="388" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="413" y1="42" x2="413" y2="388" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="592" y1="42" x2="592" y2="388" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="66" y="62" font-size="10" fill="#e8e4dc">book(DELUXE, Stay(12, 15), rooms = 1, at)</text>
  <line x1="60" y1="70" x2="226" y2="70" stroke="#fb863a" stroke-width="1.3" marker-end="url(#hb-seq-call)"/>

  <text x="238" y="90" font-size="9.5" fill="#e8e4dc">rateFor(DELUXE, night) × 3</text>
  <line x1="230" y1="98" x2="409" y2="98" stroke="#fb863a" stroke-width="1.3" marker-end="url(#hb-seq-call)"/>
  <rect x="330" y="104" width="230" height="42" rx="5" fill="rgba(94,159,246,0.12)" stroke="rgba(94,159,246,0.5)"/>
  <text x="342" y="121" font-size="9" fill="#5e9ff6">12 Aug 650000 · 13 Aug 650000</text>
  <text x="342" y="137" font-size="9" fill="#5e9ff6">14 Aug 1400000  → FROZEN on the booking</text>
  <line x1="413" y1="160" x2="234" y2="160" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#hb-seq-ret)"/>
  <text x="250" y="155" font-size="9" fill="#9099a8">3 NightCharge rows · total 2700000 paise</text>

  <text x="238" y="184" font-size="9.5" fill="#e8e4dc">tryTake(DELUXE, Stay(12,15), 1)</text>
  <line x1="230" y1="192" x2="588" y2="192" stroke="#fb863a" stroke-width="1.3" marker-end="url(#hb-seq-call)"/>

  <rect x="470" y="200" width="256" height="96" rx="6" fill="rgba(92,198,111,0.1)" stroke="rgba(92,198,111,0.5)"/>
  <text x="482" y="218" font-size="9" fill="#5cc66f">lock nights in SORTED date order</text>
  <text x="482" y="238" font-size="9.5" fill="#e8e4dc">pass 1 — CHECK all: 3 ✓  3 ✓  3 ✓</text>
  <text x="482" y="256" font-size="8.5" fill="#6b7280">not one write has happened yet</text>
  <text x="482" y="276" font-size="9.5" fill="#fb863a">pass 2 — TAKE all: 3→2  3→2  3→2</text>
  <text x="482" y="290" font-size="8.5" fill="#6b7280">unlock in reverse</text>

  <line x1="592" y1="310" x2="234" y2="310" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#hb-seq-ret)"/>
  <text x="256" y="305" font-size="9.5" fill="#5cc66f">true</text>
  <line x1="230" y1="330" x2="64" y2="330" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#hb-seq-ret)"/>
  <text x="80" y="325" font-size="9.5" fill="#5cc66f">Booking BK-1 · CONFIRMED · ₹27,000.00</text>

  <rect x="14" y="344" width="712" height="46" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="28" y="362" font-size="9.5" fill="#f06868">alt — night 13 has 0 free:  pass 1 returns FALSE on the second lookup</text>
  <text x="28" y="380" font-size="9.5" fill="#9099a8">zero counters written · no Booking created · guest gets “sold out” · the grid is byte-for-byte what it was</text>
  <line x1="592" y1="374" x2="234" y2="374" stroke="#f06868" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#hb-seq-bad)"/>
</svg>`,
        caption:
          "Follow the red strip at the bottom. **Failing is free** — that is the entire value of splitting the loop in two. Notation: [[sequence-diagrams]].",
      },

      // ---------------------------------------------------------- class diagram
      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 470" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram for the hotel booking system. Hotel owns many RoomTypes, and each RoomType owns many Rooms. BookingService depends on Inventory, RatePlan and CancellationPolicy and creates Bookings. Inventory holds a map from room type and night to a booked count and exposes freeOn, minFree, tryTake and release. Booking holds a Guest, a RoomTypeId, a Stay, a room count, a frozen list of NightCharge rows and a status, and its assigned room numbers are filled only at check-in. Stay is a value object holding checkIn and checkOut with an overlaps method and a nights method. RatePlan is an interface implemented by FlatRatePlan and SeasonalRatePlan. CancellationPolicy is an interface implemented by FlexiblePolicy and NonRefundablePolicy. A side box lists what is deliberately absent: Room dot isBooked, a double for money, and a lock around the whole hotel.">
  <defs>
    <marker id="hb-cls-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="hb-cls-inh" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <rect x="16" y="14" width="180" height="56" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="28" y="34" font-size="11.5" fill="#e8e4dc">Hotel</text>
  <line x1="16" y1="42" x2="196" y2="42" stroke="#2d333d"/>
  <text x="28" y="60" font-size="9.5" fill="#9099a8">- id, name, city</text>

  <rect x="16" y="96" width="180" height="76" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="28" y="116" font-size="11.5" fill="#fb863a">RoomType</text>
  <line x1="16" y1="124" x2="196" y2="124" stroke="#2d333d"/>
  <text x="28" y="142" font-size="9.5" fill="#9099a8">- sleeps, totalRooms</text>
  <text x="28" y="158" font-size="9.5" fill="#fb863a">- overbookBuffer</text>
  <path d="M106,70 L106,80 L98,88 L106,96 L114,88 L106,80" fill="#e8e4dc" stroke="#e8e4dc"/>
  <text x="120" y="90" font-size="9" fill="#9099a8">1..*</text>

  <rect x="16" y="198" width="180" height="60" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="28" y="218" font-size="11.5" fill="#e8e4dc">Room</text>
  <line x1="16" y1="226" x2="196" y2="226" stroke="#2d333d"/>
  <text x="28" y="244" font-size="9.5" fill="#9099a8">- number, type</text>
  <path d="M106,172 L106,182 L98,190 L106,198 L114,190 L106,182" fill="#e8e4dc" stroke="#e8e4dc"/>

  <rect x="16" y="284" width="180" height="84" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="28" y="304" font-size="11.5" fill="#5e9ff6">Stay «value»</text>
  <line x1="16" y1="312" x2="196" y2="312" stroke="#2d333d"/>
  <text x="28" y="330" font-size="9.5" fill="#9099a8">- checkIn, checkOut</text>
  <text x="28" y="346" font-size="9.5" fill="#e8e4dc">+ overlaps(other)</text>
  <text x="28" y="362" font-size="9.5" fill="#e8e4dc">+ nights() · nightList()</text>

  <rect x="248" y="14" width="216" height="118" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.4"/>
  <text x="260" y="34" font-size="11.5" fill="#fb863a">BookingService</text>
  <line x1="248" y1="42" x2="464" y2="42" stroke="#2d333d"/>
  <text x="260" y="60" font-size="9.5" fill="#e8e4dc">+ search(stay, guests, rooms)</text>
  <text x="260" y="78" font-size="9.5" fill="#e8e4dc">+ book(guest, type, stay, n, at)</text>
  <text x="260" y="96" font-size="9.5" fill="#e8e4dc">+ cancel(id, at) : long</text>
  <text x="260" y="114" font-size="9.5" fill="#e8e4dc">+ checkIn(id) : List&lt;Room&gt;</text>
  <text x="260" y="128" font-size="8.5" fill="#6b7280">time is a PARAMETER, never a clock call</text>

  <rect x="248" y="164" width="216" height="126" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.4"/>
  <text x="260" y="184" font-size="11.5" fill="#5cc66f">Inventory</text>
  <line x1="248" y1="192" x2="464" y2="192" stroke="#2d333d"/>
  <text x="260" y="210" font-size="9" fill="#9099a8">- booked : Map&lt;(type, night), int&gt;</text>
  <text x="260" y="228" font-size="9" fill="#9099a8">- nightLocks : Map&lt;key, Lock&gt;</text>
  <text x="260" y="248" font-size="9.5" fill="#e8e4dc">+ freeOn(type, night) : int</text>
  <text x="260" y="264" font-size="9.5" fill="#e8e4dc">+ minFree(type, stay) : int</text>
  <text x="260" y="280" font-size="9.5" fill="#fb863a">+ tryTake(…) · release(…)</text>
  <line x1="356" y1="132" x2="356" y2="160" stroke="#9099a8" stroke-width="1.2" marker-end="url(#hb-cls-a)"/>
  <line x1="244" y1="200" x2="200" y2="140" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#hb-cls-a)"/>

  <rect x="248" y="322" width="216" height="120" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="260" y="342" font-size="11.5" fill="#e8e4dc">Booking</text>
  <line x1="248" y1="350" x2="464" y2="350" stroke="#2d333d"/>
  <text x="260" y="368" font-size="9.5" fill="#9099a8">- guest, type, stay, rooms</text>
  <text x="260" y="386" font-size="9.5" fill="#fb863a">- charges : List&lt;NightCharge&gt;</text>
  <text x="260" y="400" font-size="8.5" fill="#6b7280">frozen at booking time — never recomputed</text>
  <text x="260" y="418" font-size="9.5" fill="#9099a8">- status : BookingStatus</text>
  <text x="260" y="436" font-size="9" fill="#5cc66f">- assignedRooms — filled at CHECK-IN</text>
  <line x1="356" y1="290" x2="356" y2="318" stroke="#9099a8" stroke-width="1.2" marker-end="url(#hb-cls-a)"/>
  <line x1="200" y1="326" x2="244" y2="340" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#hb-cls-a)"/>

  <rect x="516" y="14" width="208" height="66" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="528" y="34" font-size="11" fill="#5e9ff6">«interface» RatePlan</text>
  <line x1="516" y1="42" x2="724" y2="42" stroke="#2d333d"/>
  <text x="528" y="60" font-size="9.5" fill="#e8e4dc">+ rateFor(type, night) : long</text>
  <text x="528" y="74" font-size="8.5" fill="#6b7280">paise. ONE night. never a stay.</text>
  <line x1="512" y1="46" x2="468" y2="52" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#hb-cls-a)"/>

  <rect x="516" y="96" width="100" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="526" y="114" font-size="9" fill="#e8e4dc">FlatRatePlan</text>
  <rect x="624" y="96" width="100" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="632" y="114" font-size="9" fill="#e8e4dc">SeasonalPlan</text>
  <line x1="566" y1="96" x2="586" y2="82" stroke="#9099a8" stroke-width="1.1" marker-end="url(#hb-cls-inh)"/>
  <line x1="674" y1="96" x2="652" y2="82" stroke="#9099a8" stroke-width="1.1" marker-end="url(#hb-cls-inh)"/>

  <rect x="516" y="152" width="208" height="62" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="528" y="172" font-size="10.5" fill="#5e9ff6">«interface» CancellationPolicy</text>
  <line x1="516" y1="180" x2="724" y2="180" stroke="#2d333d"/>
  <text x="528" y="198" font-size="9.5" fill="#e8e4dc">+ refundFor(booking, at) : long</text>
  <line x1="512" y1="180" x2="468" y2="176" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#hb-cls-a)"/>

  <rect x="516" y="230" width="100" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="524" y="248" font-size="9" fill="#e8e4dc">FlexiblePolicy</text>
  <rect x="624" y="230" width="100" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="630" y="248" font-size="9" fill="#e8e4dc">NonRefundable</text>
  <line x1="566" y1="230" x2="586" y2="216" stroke="#9099a8" stroke-width="1.1" marker-end="url(#hb-cls-inh)"/>
  <line x1="674" y1="230" x2="652" y2="216" stroke="#9099a8" stroke-width="1.1" marker-end="url(#hb-cls-inh)"/>

  <rect x="516" y="288" width="208" height="70" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="528" y="308" font-size="11" fill="#e8e4dc">NightCharge «value»</text>
  <line x1="516" y1="316" x2="724" y2="316" stroke="#2d333d"/>
  <text x="528" y="334" font-size="9.5" fill="#9099a8">- night : LocalDate</text>
  <text x="528" y="350" font-size="9.5" fill="#fb863a">- paise : long   (never a double)</text>

  <rect x="516" y="376" width="208" height="88" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="528" y="396" font-size="10.5" fill="#9099a8">what is deliberately NOT here</text>
  <line x1="528" y1="404" x2="712" y2="404" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="528" y="422" font-size="9.5" fill="#f06868">✗ Room.isBooked : boolean</text>
  <text x="528" y="440" font-size="9.5" fill="#f06868">✗ double price</text>
  <text x="528" y="458" font-size="9.5" fill="#f06868">✗ synchronized on the whole Hotel</text>
</svg>`,
        caption:
          "Three arrows carry this diagram: **BookingService → Inventory** (the only thing that writes counters), **Booking → NightCharge** (the frozen bill), and the two dashed lines to the interfaces — [[strategy]] twice over, which is why a new rate plan or refund rule never touches `book()` ([[open-closed]]). Notation: [[class-diagrams]].",
      },

      // ---------------------------------------------------------- pricing
      { type: "h", text: "Step 6 · Price is per night, not per stay" },
      {
        type: "p",
        text: "*“It's ₹6,500 a night for three nights, so ₹19,500.”* That sentence is wrong in every hotel on earth. Friday costs more than Tuesday. Diwali costs more than Friday. A corporate rate plan costs less than both. The total for a stay is a **sum over its nights**, and the interface that makes that possible is one method: `rateFor(roomType, night) → paise`.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 320" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A three-night Deluxe stay from the twelfth to the fifteenth of August priced two ways. On the left, a flat nightly rate of six thousand five hundred rupees multiplied by three nights gives nineteen thousand five hundred rupees, marked wrong in red. On the right, the same stay priced night by night gives six thousand five hundred for the twelfth, six thousand five hundred for the thirteenth and fourteen thousand for the fourteenth, which is a festival night, totalling twenty-seven thousand rupees, marked correct in green. A note underneath says the difference is seven thousand five hundred rupees on a single booking and that the per-night charges are frozen on the booking so a later rate change cannot alter it.">
  <text x="20" y="20" font-size="10.5" fill="#9099a8">Deluxe · Stay(12 Aug, 15 Aug) · 3 nights · 1 room</text>

  <text x="20" y="48" font-size="10.5" fill="#f06868">✗ nightlyRate × nights</text>
  <rect x="20" y="58" width="316" height="176" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="38" y="84" font-size="10" fill="#9099a8">rate = 650000 paise   // “the” rate</text>
  <text x="38" y="112" font-size="11" fill="#e8e4dc">650000 × 3</text>
  <line x1="38" y1="124" x2="300" y2="124" stroke="#2d333d"/>
  <text x="38" y="150" font-size="15" fill="#f06868">= ₹19,500.00</text>
  <text x="38" y="180" font-size="9.5" fill="#9099a8">14 Aug is a festival night and you</text>
  <text x="38" y="196" font-size="9.5" fill="#9099a8">just sold it at the Tuesday price</text>
  <text x="38" y="218" font-size="9.5" fill="#f06868">the hotel loses ₹7,500 per booking</text>

  <text x="384" y="48" font-size="10.5" fill="#5cc66f">✓ Σ rateFor(type, night)</text>
  <rect x="384" y="58" width="316" height="176" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="400" y="82" font-size="9.5" fill="#e8e4dc">12 Aug  Wed  weekday</text>
  <text x="596" y="82" font-size="9.5" fill="#e8e4dc">650000</text>
  <text x="400" y="102" font-size="9.5" fill="#e8e4dc">13 Aug  Thu  weekday</text>
  <text x="596" y="102" font-size="9.5" fill="#e8e4dc">650000</text>
  <text x="400" y="122" font-size="9.5" fill="#fb863a">14 Aug  Fri  🎆 festival</text>
  <text x="588" y="122" font-size="9.5" fill="#fb863a">1400000</text>
  <line x1="400" y1="134" x2="684" y2="134" stroke="#2d333d"/>
  <text x="400" y="160" font-size="15" fill="#5cc66f">= ₹27,000.00</text>
  <text x="400" y="188" font-size="9.5" fill="#9099a8">stored as 3 NightCharge rows on the</text>
  <text x="400" y="204" font-size="9.5" fill="#9099a8">booking — FROZEN at booking time</text>
  <text x="400" y="224" font-size="9.5" fill="#5cc66f">tomorrow’s price change cannot touch it</text>

  <rect x="20" y="248" width="680" height="58" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="38" y="270" font-size="10.5" fill="#fb863a">interface RatePlan { long rateFor(RoomTypeId type, LocalDate night); }</text>
  <text x="38" y="292" font-size="9.5" fill="#e8e4dc">a corporate rate, a non-refundable rate, a long-stay discount → a new class. book() never changes.</text>
</svg>`,
        caption:
          "Two numbers, one booking, ₹7,500 apart. And the green box is doing a second job: it stores the *breakdown*, so *“why is my bill ₹27,000?”* has an answer that survives every future price change.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Freeze the bill, and count in paise",
        text: "The booking stores its own `List<NightCharge>` — one row per night, each an **integer number of paise**. It is never recomputed from the live `RatePlan`. If you recompute at display time, a Tuesday price change silently rewrites a bill somebody already agreed to, and a refund calculation done three days later disagrees with the confirmation email. Same integer-money discipline as [[splitwise]]: `long` paise, never `double`.",
      },

      // ---------------------------------------------------------- race
      { type: "h", text: "The last room, and two guests" },
      {
        type: "p",
        text: "One Deluxe room left on 12–15 Aug. Two guests press *Book* in the same millisecond. Both threads read `free = 1`, both decide *yes*, both decrement — and the counter is now **−1**. Two people have a confirmation email and one of them is going to arrive at a hotel that has nowhere to put them.",
      },
      {
        type: "p",
        text: "The fix is not to lock the hotel. It is to make **check-and-take atomic on the contended resource**, which here is the set of nightly counters the stay touches — and nothing else. Two guests booking different nights, or different room types, never contend at all. More on the failure shape in [[deadlock-race-starvation]] and on the mechanics in [[locks-mutex-semaphore]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 366" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two timelines for the last Deluxe room. In the unguarded timeline on top, guest A reads free equals one, guest B reads free equals one before A writes, both check that one is greater than or equal to one, and both decrement, leaving the count at minus one with two confirmed bookings and a red oversold by one marker. In the guarded timeline below, guest A takes the night locks, checks and takes atomically leaving the count at zero, then releases; guest B then takes the locks, reads zero, and is told sold out immediately with no counter written.">
  <text x="20" y="20" font-size="10.5" fill="#f06868">🔓 unguarded — check-then-act across two threads</text>
  <rect x="20" y="30" width="680" height="146" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>

  <text x="34" y="50" font-size="9" fill="#6b7280">t →</text>
  <line x1="34" y1="56" x2="686" y2="56" stroke="#2d333d"/>

  <text x="34" y="78" font-size="9.5" fill="#5e9ff6">guest A</text>
  <rect x="96" y="64" width="126" height="22" rx="4" fill="rgba(94,159,246,0.14)" stroke="#5e9ff6"/>
  <text x="106" y="79" font-size="8.5" fill="#5e9ff6">read free[13 Aug] = 1</text>
  <rect x="368" y="64" width="126" height="22" rx="4" fill="rgba(94,159,246,0.14)" stroke="#5e9ff6"/>
  <text x="378" y="79" font-size="8.5" fill="#5e9ff6">1 ≥ 1 ✓ → write 0</text>

  <text x="34" y="116" font-size="9.5" fill="#fb863a">guest B</text>
  <rect x="232" y="102" width="126" height="22" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="242" y="117" font-size="8.5" fill="#fb863a">read free[13 Aug] = 1</text>
  <rect x="504" y="102" width="126" height="22" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="514" y="117" font-size="8.5" fill="#fb863a">1 ≥ 1 ✓ → write 0</text>

  <text x="34" y="150" font-size="9.5" fill="#9099a8">counter</text>
  <text x="106" y="150" font-size="9.5" fill="#e8e4dc">1</text>
  <text x="242" y="150" font-size="9.5" fill="#e8e4dc">1</text>
  <text x="378" y="150" font-size="9.5" fill="#e8e4dc">0</text>
  <text x="514" y="150" font-size="12" fill="#f06868">−1</text>
  <text x="556" y="150" font-size="9.5" fill="#f06868">⚠ oversold: 1</text>
  <text x="34" y="168" font-size="9" fill="#f06868">two confirmation emails · one room · the second guest finds out at reception</text>

  <text x="20" y="206" font-size="10.5" fill="#5cc66f">🔒 guarded — the two passes are ONE atomic unit</text>
  <rect x="20" y="216" width="680" height="140" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <line x1="34" y1="242" x2="686" y2="242" stroke="#2d333d"/>

  <text x="34" y="264" font-size="9.5" fill="#5e9ff6">guest A</text>
  <rect x="96" y="250" width="230" height="22" rx="4" fill="rgba(92,198,111,0.14)" stroke="#5cc66f"/>
  <text x="106" y="265" font-size="8.5" fill="#5cc66f">🔒 lock nights → check ALL → take ALL → 🔓</text>

  <text x="34" y="302" font-size="9.5" fill="#fb863a">guest B</text>
  <rect x="336" y="288" width="230" height="22" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.6)"/>
  <text x="346" y="303" font-size="8.5" fill="#f06868">🔒 lock nights → read 0 → “sold out” → 🔓</text>
  <text x="576" y="303" font-size="8.5" fill="#9099a8">0 counters written</text>

  <text x="34" y="334" font-size="9.5" fill="#9099a8">counter</text>
  <text x="106" y="334" font-size="9.5" fill="#e8e4dc">1</text>
  <text x="346" y="334" font-size="12" fill="#5cc66f">0</text>
  <text x="380" y="334" font-size="9.5" fill="#5cc66f">and it stays 0 — never negative</text>
  <text x="34" y="350" font-size="9" fill="#6b7280">lock only the nights this stay touches, in SORTED date order — 12→15 and 14→17 can never deadlock each other</text>
</svg>`,
        caption:
          "The guarded row is not slower in any way a guest would notice: the critical section is three integer comparisons and three additions. **Lock the arithmetic, not the network call** — pricing, emails and payments all live outside it.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Why the nights must be locked in sorted order",
        text: "Guest A books **12→15**, guest B books **14→17**. They share night 14. If A grabs 12 then 13 then 14, and B grabs 16 then 15 then 14 — two threads each holding what the other needs. Taking the night locks in **ascending date order** gives every thread the same global ordering, which is the textbook cure for [[deadlock-race-starvation]]. It costs one `sort()` and it is worth saying out loud even if you never write it.",
      },
      {
        type: "callout",
        variant: "info",
        title: "What the production answer sounds like",
        text: "*“In a single process I take a lock per (roomType, night). Across ten servers that does not exist, so the counter moves into the database and the check-and-take becomes one statement — `UPDATE inventory SET booked = booked + 1 WHERE type = ? AND night = ? AND booked + 1 <= capacity`, executed once per night inside one transaction, and if any row updates zero rows I roll back.”* One sentence, and you have answered the distributed follow-up before it is asked. Related: [[atomic-operations-and-cas]].",
      },

      // ---------------------------------------------------------- cancellation
      { type: "h", text: "Cancellation, overbooking, and search" },
      {
        type: "p",
        text: "**Cancellation is two separate things and juniors merge them.** One is *how much money comes back*, which depends on how long before check-in the guest cancelled. The other is *what happens to the counters*, which is always the same: release exactly the nights that were taken, exactly the number of rooms that were taken.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A timeline running from seven days before check-in to check-in itself, divided into three refund bands. More than forty-eight hours before check-in is a green band giving a full refund. Between forty-eight and twenty-four hours is an amber band where one night is kept and the rest refunded. Inside twenty-four hours is a red band with no refund. Below, a worked example shows a twenty-seven thousand rupee booking cancelled thirty-six hours before check-in returning twenty thousand five hundred rupees, and a note explains that whatever the refund is, the three nightly counters go back up by one each.">
  <text x="20" y="20" font-size="10.5" fill="#9099a8">CancellationPolicy.refundFor(booking, at) — lead time decides the money</text>

  <line x1="40" y1="86" x2="676" y2="86" stroke="#3a414c" stroke-width="1.2"/>
  <text x="40" y="40" font-size="9" fill="#6b7280">7 days before</text>
  <text x="600" y="40" font-size="9" fill="#fb863a">🔑 check-in</text>
  <line x1="656" y1="52" x2="656" y2="120" stroke="#fb863a" stroke-width="1.2"/>

  <rect x="40" y="52" width="330" height="30" rx="4" fill="rgba(92,198,111,0.14)" stroke="#5cc66f"/>
  <text x="52" y="72" font-size="9.5" fill="#5cc66f">≥ 48h before — FULL refund</text>
  <rect x="374" y="52" width="150" height="30" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="386" y="72" font-size="9.5" fill="#fb863a">48h–24h — keep 1 night</text>
  <rect x="528" y="52" width="128" height="30" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.6)"/>
  <text x="540" y="72" font-size="9.5" fill="#f06868">&lt; 24h — no refund</text>

  <text x="356" y="104" font-size="8.5" fill="#6b7280">−48h</text>
  <text x="512" y="104" font-size="8.5" fill="#6b7280">−24h</text>

  <rect x="20" y="126" width="330" height="148" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="36" y="148" font-size="10" fill="#e8e4dc">worked example</text>
  <line x1="36" y1="156" x2="334" y2="156" stroke="#2d333d"/>
  <text x="36" y="176" font-size="9.5" fill="#9099a8">booking total          2700000 paise</text>
  <text x="36" y="196" font-size="9.5" fill="#9099a8">cancelled at           10 Aug 12:00</text>
  <text x="36" y="216" font-size="9.5" fill="#9099a8">check-in               12 Aug 00:00</text>
  <text x="36" y="236" font-size="9.5" fill="#fb863a">lead time              36 hours → band 2</text>
  <text x="36" y="258" font-size="11" fill="#5cc66f">refund = 2700000 − 650000 = ₹20,500.00</text>

  <rect x="366" y="126" width="334" height="148" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="382" y="148" font-size="10" fill="#5cc66f">…and the counters, which never vary</text>
  <line x1="382" y1="156" x2="684" y2="156" stroke="#2d333d"/>
  <text x="382" y="176" font-size="9.5" fill="#e8e4dc">release(DELUXE, Stay(12,15), rooms = 1)</text>
  <text x="382" y="198" font-size="9.5" fill="#9099a8">12 Aug  2 → 3</text>
  <text x="382" y="216" font-size="9.5" fill="#9099a8">13 Aug  2 → 3</text>
  <text x="382" y="234" font-size="9.5" fill="#9099a8">14 Aug  2 → 3</text>
  <text x="382" y="256" font-size="9" fill="#6b7280">status → CANCELLED. the row stays. the money is a separate question.</text>

  <text x="20" y="294" font-size="9.5" fill="#6b7280">a no-show is the same release run at check-in time plus a 100% penalty — one policy method, not a new code path</text>
</svg>`,
        caption:
          "Keep the two halves apart and every variant becomes free: non-refundable rates, corporate waivers, no-shows, partial-stay cancellations. Merge them and each variant is a new branch inside `cancel()`.",
      },
      {
        type: "ul",
        items: [
          "**Overbooking is a business rule, not a bug.** Hotels sell more rooms than they have because a predictable slice of guests never arrive. Model it as `capacity() = totalRooms + overbookBuffer` on `RoomType` — **one place**, so nobody can compute capacity a second way and disagree. Then `freeOn(night) = capacity() − booked(night)`, and every other line of code is unchanged. Naming it as a deliberate rule is one of the easiest strong signals in this round.",
          "**Search is the same query with a different threshold.** *“Hotels in Goa, 12–15 Aug, 2 guests”* filters room types where `sleeps >= guests` **and** `minFree(type, stay) >= roomsWanted`. The **minimum across the nights** is the clean framing because it collapses a range question into a single number, and it is the same number the booking check uses — so search and book can never disagree about what is available.",
          "**Filter on the cheap thing first.** `sleeps >= guests` is one comparison; `minFree` walks every night. Ordering the filter that way is free and it is the kind of detail that reads as care rather than cleverness.",
          "**Search results are advisory, always.** Between the search and the booking, someone else may have taken the room. That is not a bug to fix; it is why `book()` re-checks under the lock and can still say no. Say this out loud — candidates who try to make search authoritative end up inventing a hold/lock system nobody asked for.",
        ],
      },

      // ---------------------------------------------------------- follow-ups
      { type: "h", text: "The follow-ups they always ask" },
      {
        type: "ul",
        items: [
          "**“Two rooms, not one.”** — a `rooms` field on the booking and `± rooms` instead of `± 1` on each counter. The two-pass check becomes `freeOn(night) >= rooms`. Roughly four characters of change, which is the point of counting rather than flagging.",
          "**“A group block — 20 rooms for a wedding.”** — same call with `rooms = 20`, and now the *all-or-nothing* property is doing visible work: twenty rooms on four nights either all land or none do. In production a block is usually held rather than sold, which is a **hold with an expiry** — an inventory entry with a TTL, released by a sweeper.",
          "**“The guest wants to move the dates.”** — this is **cancel + rebook against the counters, and it can fail**. Release the old nights, try to take the new ones; if the take fails, put the old nights back and tell the guest their original booking is intact. Do NOT release-then-hope. Say the rollback out loud — it is the same all-or-nothing thinking one level up.",
          "**“What about no-shows?”** — a status transition, not a new flow. At check-in cut-off, `CONFIRMED → NO_SHOW`, run `release()` so the nights become sellable for whatever is left of the stay, and charge whatever the policy says. Modelling `BookingStatus` as a real state machine ([[state]]) keeps *cancelled* and *no-show* from becoming two booleans that can both be true.",
          "**“Taxes and fees?”** — they are per-night too (GST slabs change with the nightly rate in India), so they belong beside `NightCharge`, not as a multiplier on the total. Keep them as separate integer paise lines so a refund can return the base and keep the fee if that is the rule.",
          "**“What changes at ten servers?”** — the counters leave memory. The check-and-take becomes a conditional `UPDATE` per night inside one database transaction, and you add an **idempotency key** on `book()` so a retried request cannot double-decrement. Nothing about the model changes; only where the number lives.",
          "**“How do you test it?”** — a property test: generate random bookings, cancellations and date modifications, and assert after **every single operation** that for every type and night, `0 <= booked(night) <= capacity()` and that `booked(night)` equals the number of confirmed bookings covering that night. That one assertion catches leaks, oversells and off-by-ones together.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 424" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A ninety minute budget bar for the round, split into six segments: five minutes clarifying, seven minutes on entities and the room type versus room decision, eight minutes on the API and class diagram, thirty minutes coding the stay, the inventory and the two-pass book method, twenty minutes on pricing cancellation and the concurrency guard, and twenty minutes running the demo and taking follow-ups. Below it, an extensibility cost table shows that adding a rate plan costs one new class and no edits, adding a room type costs one row of configuration, adding overbooking costs one field on RoomType, adding multi-room costs one field on the booking, while switching to per-room specific inventory is expensive and touches the whole availability model.">
  <text x="20" y="20" font-size="10.5" fill="#9099a8">a 90-minute budget that actually fits</text>

  <rect x="20" y="32" width="46" height="32" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="70" y="32" width="62" height="32" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="136" y="32" width="70" height="32" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="210" y="32" width="248" height="32" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="462" y="32" width="160" height="32" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="626" y="32" width="74" height="32" rx="4" fill="#14161a" stroke="#3a414c"/>

  <text x="28" y="53" font-size="9" fill="#9099a8">5m</text>
  <text x="80" y="53" font-size="9" fill="#9099a8">7m</text>
  <text x="146" y="53" font-size="9" fill="#9099a8">8m</text>
  <text x="216" y="53" font-size="9.5" fill="#fb863a">30m</text>
  <text x="468" y="53" font-size="9.5" fill="#5cc66f">20m</text>
  <text x="632" y="53" font-size="9" fill="#9099a8">20m</text>

  <text x="20" y="86" font-size="9.5" fill="#e8e4dc">clarify — “type or specific room?”, multi-room?, per-night pricing?, overbooking?</text>
  <text x="20" y="104" font-size="9.5" fill="#e8e4dc">entities — and say “RoomType is what I sell, Room is what I hand over at check-in”</text>
  <text x="20" y="122" font-size="9.5" fill="#e8e4dc">APIs + class diagram — Inventory in the middle, RatePlan and CancellationPolicy as seams</text>
  <text x="20" y="140" font-size="9.5" fill="#fb863a">code: Stay + overlaps → Inventory with freeOn/minFree → tryTake with the TWO passes → book()</text>
  <text x="20" y="158" font-size="9.5" fill="#5cc66f">RatePlan summed per night → CancellationPolicy → the night locks, sorted</text>
  <text x="20" y="176" font-size="9" fill="#6b7280">leave 20 minutes: run main(), show the refused booking leaving counters untouched, take follow-ups</text>

  <text x="20" y="212" font-size="10.5" fill="#9099a8">what a new feature actually costs</text>
  <rect x="20" y="222" width="680" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="240" font-size="9" fill="#6b7280">feature</text>
  <text x="300" y="240" font-size="9" fill="#6b7280">files touched</text>
  <text x="592" y="240" font-size="9" fill="#6b7280">verdict</text>

  <rect x="20" y="252" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="270" font-size="9.5" fill="#e8e4dc">a corporate / non-refundable rate plan</text>
  <text x="300" y="270" font-size="9.5" fill="#9099a8">1 new RatePlan class — book() untouched</text>
  <text x="592" y="270" font-size="9.5" fill="#5cc66f">free</text>

  <rect x="20" y="284" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="302" font-size="9.5" fill="#e8e4dc">a fourth room type (“Sea View Deluxe”)</text>
  <text x="300" y="302" font-size="9.5" fill="#9099a8">1 row of configuration — zero code</text>
  <text x="592" y="302" font-size="9.5" fill="#5cc66f">free</text>

  <rect x="20" y="316" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="334" font-size="9.5" fill="#e8e4dc">overbooking by 2 rooms</text>
  <text x="300" y="334" font-size="9.5" fill="#9099a8">1 field on RoomType, used in capacity()</text>
  <text x="592" y="334" font-size="9.5" fill="#5cc66f">free</text>

  <rect x="20" y="348" width="680" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="366" font-size="9.5" fill="#e8e4dc">multi-room bookings / group blocks</text>
  <text x="300" y="366" font-size="9.5" fill="#9099a8">1 field, and ±1 becomes ±rooms</text>
  <text x="592" y="366" font-size="9.5" fill="#5cc66f">free</text>

  <rect x="20" y="380" width="680" height="28" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="34" y="398" font-size="9.5" fill="#fb863a">“guest must pick room 402 specifically”</text>
  <text x="300" y="398" font-size="9.5" fill="#9099a8">the whole availability model changes</text>
  <text x="592" y="398" font-size="9.5" fill="#fb863a">expensive</text>
</svg>`,
        caption:
          "Only the last row is expensive, and that is exactly the trade you made on purpose when you chose counters. If the interviewer asks for it, do not retrofit — say *“that is a different model: per-room interval lists”* and describe the switch.",
      },

      // ---------------------------------------------------------- how it is lost
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**`boolean isBooked` on `Room`.** The fastest possible loss. Everything built on top of it inherits a data model that cannot express the question being asked.",
          "**`<=` in the overlap test, or `!d.isAfter(checkOut)` in the night loop.** The changeover-day bug. Nothing throws, and thirty rooms silently stop selling on the busiest day of the week.",
          "**One pass instead of two.** Night 1 is decremented, night 2 fails, no booking exists, and a room is held forever for nobody. Reset is the only cure, and production has no reset.",
          "**`nightlyRate × nights`.** A festival night sold at the Tuesday price, or worse, a Tuesday sold at the festival price — and a bill that changes every time it is displayed because it was never frozen.",
          "**`synchronized` on the whole hotel.** It is correct and it is a red flag: it says you did not identify what is actually contended. Guard the nights the stay touches, and only those.",
          "**Recomputing the total from the live rate plan at refund time.** The refund disagrees with the confirmation email, and now it is a support ticket instead of a bug.",
          "**Capacity computed in two places.** `totalRooms` in one method and `totalRooms + buffer` in another. Overbooking then works everywhere except the one path that forgot, and the mismatch surfaces as an oversell.",
          "**No `main()`.** In this tier a system that has never been run is a design document. Print the grid before and after a refused booking — that single piece of output proves the all-or-nothing property better than any explanation.",
        ],
      },
    ],

    // ==================================================================
    handsOn: [
      {
        title: "Count the nights, not the dates",
        body:
          "On the date strip click **12**, then click **15**. Three cells light up — 12, 13, 14 — and the call line reads `inventory.isAvailable(DELUXE, 12 Aug → 15 Aug) → 3 nights checked`. Now press the **⚠️ Use &lt;= instead of &lt;** toggle and look again: the same two clicks now highlight **4** nights and the call line says `4 nights checked`. That single extra cell is the off-by-one that makes every changeover day unsellable. Toggle it back off before you continue.",
      },
      {
        title: "Watch the two passes, then break one of them",
        body:
          "With **✨ Deluxe** selected and 12→15 chosen, press **🛏 Book**. Pass 1 flashes each night **blue** (checking, no writes), pass 2 flashes each night **orange** (taking), and only then does the booking bar appear and the counts drop. Now press **🔴 Sell out night 2** and press **🛏 Book** again — it is refused *during pass 1*, and the explain panel says nothing was decremented. Compare the counts before and after: identical.",
      },
      {
        title: "The centrepiece — run the same booking one-pass",
        body:
          "Press **↺ Reset**, then **🔴 Sell out night 2**, then turn on **🩹 One-pass (buggy)** and press **🛏 Book**. This time night 1 is taken *as it goes*, night 2 fails, and the booking never exists. The grid is left holding a room for nobody and a red **⚠ leaked: 1** appears in the counter strip. Nothing in the system will ever notice — only **↺ Reset** clears it. That contrast is the whole reason `book()` has two loops.",
      },
      {
        title: "Prove the changeover day, then the last-room race",
        body:
          "Press **↔️ Checkout day**: with only ONE room left, the system books **12→14** and then **14→16** and both succeed — they share 14 Aug and never clash. Turn on **⚠️ Use &lt;= instead of &lt;** and press it again: the second booking is refused and 14 Aug shades red. Then press **⚔️ Two guests, last room** under **🔒 Guarded** — one confirmation, one honest *sold out*. Switch to **🔓 Unguarded** and press it again: both are confirmed, the count reads **−1**, and a red **⚠ oversold: 1** appears.",
      },
      {
        title: "Price it twice, then cancel it",
        body:
          "With a 12→15 Deluxe selection, press **📏 Flat × nights** and read the total, then press **📅 Per-night rates** and read it again — the breakdown shows two weekday nights and one festival night, the totals differ by thousands of rupees, and the caption says `booking code changed: 0 lines`. Finally press **🚫 Cancel** on the booking: the exact three cells tick back up and the refund is shown with the policy band that produced it. Then close this and rebuild it blank-file in the order the lesson used: `Stay` with `overlaps()` → `Inventory.freeOn/minFree` → `tryTake` with the two passes → `RatePlan` summed per night → `CancellationPolicy` → the sorted night locks → a `main()` that prints the grid before and after a refused booking.",
      },
    ],

    // ==================================================================
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "HotelBooking.java",
        code: `import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;

/* =============================================================== money */
/** Every amount in this file is an integer number of PAISE. Never a double. */
final class Money {
    static String fmt(long paise) {
        long a = Math.abs(paise);
        return (paise < 0 ? "-" : "") + "Rs." + (a / 100) + "." + String.format("%02d", a % 100);
    }
}

enum RoomTypeId { STANDARD, DELUXE, SUITE }
enum BookingStatus { CONFIRMED, CHECKED_IN, CANCELLED, NO_SHOW }

/* ================================================================ stay */
/**
 * A date range, HALF-OPEN: [checkIn, checkOut).
 * The checkout day is NOT a night. 12 Aug -> 15 Aug is THREE nights: 12, 13, 14.
 */
record Stay(LocalDate checkIn, LocalDate checkOut) {
    Stay {
        if (!checkIn.isBefore(checkOut))
            throw new IllegalArgumentException("check-out must be after check-in");
    }

    int nights() { return (int) ChronoUnit.DAYS.between(checkIn, checkOut); }

    /** The one line the whole problem turns on. STRICT "<" on BOTH sides. */
    boolean overlaps(Stay o) {
        return checkIn.isBefore(o.checkOut) && o.checkIn.isBefore(checkOut);
    }

    /** The buggy version, kept here only so main() can print the difference. */
    boolean overlapsBuggy(Stay o) {
        return !checkIn.isAfter(o.checkOut) && !o.checkIn.isAfter(checkOut);
    }

    /** Every night this stay occupies. Note "isBefore", NOT "!isAfter". */
    List<LocalDate> nightList() {
        List<LocalDate> out = new ArrayList<>(nights());
        for (LocalDate d = checkIn; d.isBefore(checkOut); d = d.plusDays(1)) out.add(d);
        return out;
    }

    @Override public String toString() {
        return checkIn.getDayOfMonth() + "->" + checkOut.getDayOfMonth() + " Aug (" + nights() + "n)";
    }
}

/** What you SELL. capacity() is the ONE place overbooking is decided. */
record RoomType(RoomTypeId id, String name, int sleeps, int totalRooms, int overbookBuffer) {
    int capacity() { return totalRooms + overbookBuffer; }
}

/** What you HAND OVER at check-in. Notice what is missing: no isBooked flag. */
record Room(String number, RoomTypeId type) {}

/* =========================================================== inventory */
/**
 * One counter per (room type, night). This is the whole availability model.
 * Locks are per night too, so two stays that share no night never contend.
 */
class Inventory {
    private final Map<RoomTypeId, RoomType> types = new EnumMap<>(RoomTypeId.class);
    private final Map<RoomTypeId, Map<LocalDate, Integer>> booked = new EnumMap<>(RoomTypeId.class);
    private final ConcurrentMap<String, ReentrantLock> nightLocks = new ConcurrentHashMap<>();

    Inventory(List<RoomType> roomTypes) {
        for (RoomType t : roomTypes) {
            types.put(t.id(), t);
            booked.put(t.id(), new ConcurrentHashMap<>());
        }
    }

    RoomType type(RoomTypeId id) { return types.get(id); }
    Collection<RoomType> allTypes() { return types.values(); }

    int freeOn(RoomTypeId id, LocalDate night) {
        return type(id).capacity() - booked.get(id).getOrDefault(night, 0);
    }

    /** Availability across a RANGE is the MINIMUM across its nights. */
    int minFree(RoomTypeId id, Stay stay) {
        int min = Integer.MAX_VALUE;
        for (LocalDate n : stay.nightList()) min = Math.min(min, freeOn(id, n));
        return min;
    }

    private List<ReentrantLock> locksFor(RoomTypeId id, List<LocalDate> nights) {
        List<String> keys = new ArrayList<>(nights.size());
        for (LocalDate n : nights) keys.add(id.name() + "@" + n);
        Collections.sort(keys);               // SORTED -> a global order -> no deadlock
        List<ReentrantLock> out = new ArrayList<>(keys.size());
        for (String k : keys) out.add(nightLocks.computeIfAbsent(k, x -> new ReentrantLock()));
        return out;
    }

    /**
     * TWO PASSES under the night locks:
     *   pass 1  can EVERY night afford it?   (zero writes)
     *   pass 2  take EVERY night             (zero checks)
     * Returning false means the inventory is byte-for-byte unchanged.
     */
    boolean tryTake(RoomTypeId id, Stay stay, int rooms) {
        if (rooms <= 0) throw new IllegalArgumentException("rooms must be positive");
        List<LocalDate> nights = stay.nightList();
        List<ReentrantLock> locks = locksFor(id, nights);
        for (ReentrantLock l : locks) l.lock();
        try {
            for (LocalDate n : nights)                                  // pass 1: CHECK ALL
                if (freeOn(id, n) < rooms) return false;
            for (LocalDate n : nights)                                  // pass 2: TAKE ALL
                booked.get(id).merge(n, rooms, Integer::sum);
            return true;
        } finally {
            for (int i = locks.size() - 1; i >= 0; i--) locks.get(i).unlock();
        }
    }

    /** THE BUG, kept for the demo: takes as it goes and leaks on failure. */
    boolean tryTakeOnePassBuggy(RoomTypeId id, Stay stay, int rooms) {
        for (LocalDate n : stay.nightList()) {
            if (freeOn(id, n) < rooms) return false;                    // earlier nights stay taken
            booked.get(id).merge(n, rooms, Integer::sum);
        }
        return true;
    }

    void release(RoomTypeId id, Stay stay, int rooms) {
        List<LocalDate> nights = stay.nightList();
        List<ReentrantLock> locks = locksFor(id, nights);
        for (ReentrantLock l : locks) l.lock();
        try {
            for (LocalDate n : nights) booked.get(id).merge(n, -rooms, Integer::sum);
        } finally {
            for (int i = locks.size() - 1; i >= 0; i--) locks.get(i).unlock();
        }
    }

    /** The property every test asserts: 0 <= booked <= capacity, on every night. */
    void assertInvariant() {
        for (RoomType t : types.values())
            for (Map.Entry<LocalDate, Integer> e : booked.get(t.id()).entrySet())
                if (e.getValue() < 0 || e.getValue() > t.capacity())
                    throw new IllegalStateException("oversold " + t.name() + " on " + e.getKey()
                            + ": booked=" + e.getValue() + " capacity=" + t.capacity());
    }

    String gridLine(RoomTypeId id, LocalDate from, int days) {
        StringBuilder sb = new StringBuilder(String.format("%-9s", type(id).name()));
        for (int i = 0; i < days; i++) sb.append(String.format("%3d", freeOn(id, from.plusDays(i))));
        return sb.toString();
    }
}

/* ============================================================= pricing */
interface RatePlan {
    /** Paise, for ONE night. Never for a stay. */
    long rateFor(RoomTypeId type, LocalDate night);
    String name();
}

/** The wrong-but-common one, kept so the demo can show the gap. */
class FlatRatePlan implements RatePlan {
    private final Map<RoomTypeId, Long> base;
    FlatRatePlan(Map<RoomTypeId, Long> base) { this.base = base; }
    public long rateFor(RoomTypeId type, LocalDate night) { return base.get(type); }
    public String name() { return "FlatRatePlan"; }
}

class SeasonalRatePlan implements RatePlan {
    private final Map<RoomTypeId, Long> weekday;
    private final Set<LocalDate> festivalNights;
    SeasonalRatePlan(Map<RoomTypeId, Long> weekday, Set<LocalDate> festivalNights) {
        this.weekday = weekday;
        this.festivalNights = festivalNights;
    }
    public long rateFor(RoomTypeId type, LocalDate night) {
        long r = weekday.get(type);
        DayOfWeek d = night.getDayOfWeek();
        if (d == DayOfWeek.SATURDAY || d == DayOfWeek.SUNDAY) r = r * 3 / 2;   // weekend
        if (festivalNights.contains(night)) r = r * 5 / 2;                     // festival wins
        return r;
    }
    public String name() { return "SeasonalRatePlan"; }
}

/** One frozen line of the bill. Integer paise, tied to a specific night. */
record NightCharge(LocalDate night, long paise) {}

/* ======================================================== cancellation */
interface CancellationPolicy {
    /** How much comes back, in paise, if the guest cancels at "at". */
    long refundFor(Booking b, Instant at, ZoneId zone);
    String describe();
}

class FlexiblePolicy implements CancellationPolicy {
    public long refundFor(Booking b, Instant at, ZoneId zone) {
        long hours = Duration.between(at, b.stay().checkIn().atStartOfDay(zone).toInstant()).toHours();
        long total = b.total();
        if (hours >= 48) return total;                                    // free
        if (hours >= 24) return Math.max(0, total - b.firstNightCost());  // keep one night
        return 0;                                                         // no refund
    }
    public String describe() { return "free >=48h, one night 48-24h, nothing inside 24h"; }
}

class NonRefundablePolicy implements CancellationPolicy {
    public long refundFor(Booking b, Instant at, ZoneId zone) { return 0; }
    public String describe() { return "non-refundable"; }
}

/* ============================================================= booking */
class Booking {
    private final String id, guestId;
    private final RoomTypeId type;
    private final Stay stay;
    private final int rooms;
    private final List<NightCharge> charges;     // FROZEN at booking time
    private final Instant bookedAt;
    private BookingStatus status = BookingStatus.CONFIRMED;
    private final List<String> assignedRooms = new ArrayList<>();   // filled at CHECK-IN

    Booking(String id, String guestId, RoomTypeId type, Stay stay, int rooms,
            List<NightCharge> charges, Instant bookedAt) {
        this.id = id; this.guestId = guestId; this.type = type; this.stay = stay;
        this.rooms = rooms; this.charges = List.copyOf(charges); this.bookedAt = bookedAt;
    }

    String id() { return id; }
    String guestId() { return guestId; }
    RoomTypeId type() { return type; }
    Stay stay() { return stay; }
    int rooms() { return rooms; }
    List<NightCharge> charges() { return charges; }
    Instant bookedAt() { return bookedAt; }
    BookingStatus status() { return status; }
    void setStatus(BookingStatus s) { status = s; }
    List<String> assignedRooms() { return assignedRooms; }

    long firstNightCost() { return charges.get(0).paise() * rooms; }

    long total() {
        long s = 0;
        for (NightCharge c : charges) s += c.paise();
        return s * rooms;
    }

    String breakdown() {
        StringBuilder sb = new StringBuilder();
        for (NightCharge c : charges)
            sb.append("      ").append(c.night()).append("  ").append(Money.fmt(c.paise())).append("\\n");
        sb.append("      total x").append(rooms).append(" room(s) = ").append(Money.fmt(total()));
        return sb.toString();
    }
}

/* ===================================================== booking service */
class BookingService {
    private final Inventory inventory;
    private final RatePlan ratePlan;
    private final CancellationPolicy policy;
    private final ZoneId zone;
    private final Map<RoomTypeId, Deque<Room>> freeRooms = new EnumMap<>(RoomTypeId.class);
    private final Map<String, Booking> bookings = new ConcurrentHashMap<>();
    private int seq = 0;

    BookingService(Inventory inv, RatePlan rp, CancellationPolicy cp, ZoneId zone, List<Room> rooms) {
        this.inventory = inv; this.ratePlan = rp; this.policy = cp; this.zone = zone;
        for (Room r : rooms) freeRooms.computeIfAbsent(r.type(), k -> new ArrayDeque<>()).add(r);
    }

    private synchronized String nextId() { return "BK-" + (++seq); }

    /** Advisory: someone may take the room between this call and book(). */
    List<RoomTypeId> search(Stay stay, int guests, int roomsWanted) {
        List<RoomTypeId> out = new ArrayList<>();
        for (RoomType t : inventory.allTypes())
            if (t.sleeps() >= guests && inventory.minFree(t.id(), stay) >= roomsWanted)  // cheap filter first
                out.add(t.id());
        return out;
    }

    List<NightCharge> quote(RoomTypeId type, Stay stay) {
        List<NightCharge> out = new ArrayList<>(stay.nights());
        for (LocalDate n : stay.nightList()) out.add(new NightCharge(n, ratePlan.rateFor(type, n)));
        return out;
    }

    /** "at" is a PARAMETER so every test is deterministic. */
    Optional<Booking> book(String guestId, RoomTypeId type, Stay stay, int rooms, Instant at) {
        List<NightCharge> charges = quote(type, stay);          // price first: touches no state
        if (!inventory.tryTake(type, stay, rooms)) return Optional.empty();
        Booking b = new Booking(nextId(), guestId, type, stay, rooms, charges, at);
        bookings.put(b.id(), b);
        return Optional.of(b);
    }

    long cancel(String bookingId, Instant at) {
        Booking b = bookings.get(bookingId);
        if (b == null || b.status() != BookingStatus.CONFIRMED) return 0;
        long refund = policy.refundFor(b, at, zone);            // the money question
        inventory.release(b.type(), b.stay(), b.rooms());       // the counter question - always the same
        b.setStatus(BookingStatus.CANCELLED);
        return refund;
    }

    /** Moving the dates is cancel + rebook against the counters, and it CAN fail. */
    boolean modifyDates(String bookingId, Stay newStay, Instant at) {
        Booking b = bookings.get(bookingId);
        if (b == null || b.status() != BookingStatus.CONFIRMED) return false;
        inventory.release(b.type(), b.stay(), b.rooms());
        if (!inventory.tryTake(b.type(), newStay, b.rooms())) {
            inventory.tryTake(b.type(), b.stay(), b.rooms());   // put it back - rollback
            return false;
        }
        Booking moved = new Booking(b.id(), b.guestId(), b.type(), newStay, b.rooms(),
                                    quote(b.type(), newStay), at);
        bookings.put(moved.id(), moved);
        return true;
    }

    /** The room NUMBER is decided here, not at booking time. */
    List<String> checkIn(String bookingId) {
        Booking b = bookings.get(bookingId);
        if (b == null || b.status() != BookingStatus.CONFIRMED) return List.of();
        Deque<Room> pool = freeRooms.get(b.type());
        for (int i = 0; i < b.rooms() && !pool.isEmpty(); i++) b.assignedRooms().add(pool.poll().number());
        b.setStatus(BookingStatus.CHECKED_IN);
        return b.assignedRooms();
    }

    Booking get(String id) { return bookings.get(id); }
}

/* ================================================================ demo */
public class HotelBooking {
    static final ZoneId IST = ZoneId.of("Asia/Kolkata");
    static LocalDate aug(int d) { return LocalDate.of(2026, 8, d); }

    public static void main(String[] args) throws Exception {
        List<RoomType> types = List.of(
            new RoomType(RoomTypeId.STANDARD, "Standard", 2, 6, 0),
            new RoomType(RoomTypeId.DELUXE,   "Deluxe",   3, 3, 0),
            new RoomType(RoomTypeId.SUITE,    "Suite",    4, 2, 0));

        List<Room> rooms = new ArrayList<>();
        for (int i = 1; i <= 6; i++) rooms.add(new Room("30" + i, RoomTypeId.STANDARD));
        for (int i = 1; i <= 3; i++) rooms.add(new Room("40" + i, RoomTypeId.DELUXE));
        for (int i = 1; i <= 2; i++) rooms.add(new Room("50" + i, RoomTypeId.SUITE));

        Map<RoomTypeId, Long> weekday = Map.of(
            RoomTypeId.STANDARD, 400000L, RoomTypeId.DELUXE, 650000L, RoomTypeId.SUITE, 1200000L);

        Inventory inv = new Inventory(types);
        RatePlan seasonal = new SeasonalRatePlan(weekday, Set.of(aug(14), aug(15)));
        RatePlan flat = new FlatRatePlan(weekday);
        BookingService svc = new BookingService(inv, seasonal, new FlexiblePolicy(), IST, rooms);

        Instant now = LocalDateTime.of(2026, 8, 10, 12, 0).atZone(IST).toInstant();
        Stay s1215 = new Stay(aug(12), aug(15));

        System.out.println("=== 0. half-open intervals =====================================");
        System.out.println("Stay(12,15).nights()          = " + s1215.nights() + "   <- three, not four");
        System.out.println("nightList()                   = " + s1215.nightList());
        Stay a = new Stay(aug(12), aug(14)), b = new Stay(aug(14), aug(16));
        System.out.println("overlaps(12->14, 14->16)      = " + a.overlaps(b) + "   <- checkout day is free");
        System.out.println("overlapsBuggy(same, with <=)  = " + a.overlapsBuggy(b) + "   <- the off-by-one");

        System.out.println("\\n=== 1. search ==================================================");
        System.out.println("search(12->15, guests=2, rooms=1) = " + svc.search(s1215, 2, 1));

        System.out.println("\\n=== 2. per-night pricing =======================================");
        long flatTotal = 0;
        for (LocalDate n : s1215.nightList()) flatTotal += flat.rateFor(RoomTypeId.DELUXE, n);
        Optional<Booking> aarti = svc.book("aarti", RoomTypeId.DELUXE, s1215, 1, now);
        System.out.println("Aarti books a Deluxe " + s1215 + " -> " + aarti.get().id());
        System.out.println(aarti.get().breakdown());
        System.out.println("      flat x nights would be   = " + Money.fmt(flatTotal)
                + "   (short by " + Money.fmt(aarti.get().total() - flatTotal) + ")");

        System.out.println("\\n=== 3. all-or-nothing ==========================================");
        svc.book("house", RoomTypeId.DELUXE, new Stay(aug(13), aug(14)), 2, now);   // night 13 -> 0 free
        System.out.println("before: " + inv.gridLine(RoomTypeId.DELUXE, aug(11), 6));
        Optional<Booking> ravi = svc.book("ravi", RoomTypeId.DELUXE, new Stay(aug(11), aug(16)), 1, now);
        System.out.println("Ravi books Deluxe 11->16      -> " + (ravi.isPresent() ? ravi.get().id() : "SOLD OUT"));
        System.out.println("after : " + inv.gridLine(RoomTypeId.DELUXE, aug(11), 6) + "   <- identical");

        System.out.println("\\n=== 4. one-pass leak (the bug) =================================");
        System.out.println("before: " + inv.gridLine(RoomTypeId.DELUXE, aug(11), 6));
        boolean buggy = inv.tryTakeOnePassBuggy(RoomTypeId.DELUXE, new Stay(aug(11), aug(16)), 1);
        System.out.println("one-pass take 11->16          -> " + (buggy ? "ok" : "FAILED"));
        System.out.println("after : " + inv.gridLine(RoomTypeId.DELUXE, aug(11), 6) + "   <- night 11 LEAKED");
        inv.release(RoomTypeId.DELUXE, new Stay(aug(11), aug(12)), 1);              // clean up the leak

        System.out.println("\\n=== 5. the changeover day ======================================");
        svc.book("house", RoomTypeId.SUITE, new Stay(aug(12), aug(18)), 1, now);    // 1 suite left
        Optional<Booking> x = svc.book("meera", RoomTypeId.SUITE, new Stay(aug(12), aug(14)), 1, now);
        Optional<Booking> y = svc.book("kabir", RoomTypeId.SUITE, new Stay(aug(14), aug(16)), 1, now);
        System.out.println("only 1 Suite left. 12->14 = " + (x.isPresent() ? "CONFIRMED" : "sold out")
                + " , 14->16 = " + (y.isPresent() ? "CONFIRMED" : "sold out") + "   <- both, sharing 14 Aug");

        System.out.println("\\n=== 6. two guests, one last room ===============================");
        svc.book("house", RoomTypeId.STANDARD, new Stay(aug(17), aug(18)), 5, now); // 1 Standard left
        Stay night17 = new Stay(aug(17), aug(18));
        List<String> results = Collections.synchronizedList(new ArrayList<>());
        CountDownLatch go = new CountDownLatch(1);
        Runnable racer = () -> {
            try { go.await(); } catch (InterruptedException ignored) { }
            Optional<Booking> r = svc.book("racer", RoomTypeId.STANDARD, night17, 1, now);
            results.add(r.isPresent() ? "CONFIRMED " + r.get().id() : "sold out");
        };
        Thread t1 = new Thread(racer), t2 = new Thread(racer);
        t1.start(); t2.start(); go.countDown(); t1.join(); t2.join();
        System.out.println("two threads, one room         -> " + results);
        System.out.println("free on 17 Aug                =  " + inv.freeOn(RoomTypeId.STANDARD, aug(17)));
        inv.assertInvariant();
        System.out.println("invariant 0 <= booked <= capacity: HOLDS");

        System.out.println("\\n=== 7. cancellation ============================================");
        System.out.println("before: " + inv.gridLine(RoomTypeId.DELUXE, aug(11), 6));
        long refund = svc.cancel(aarti.get().id(), now);
        System.out.println("Aarti cancels 36h before check-in, total " + Money.fmt(aarti.get().total()));
        System.out.println("refund                        =  " + Money.fmt(refund) + "   (one night kept)");
        System.out.println("after : " + inv.gridLine(RoomTypeId.DELUXE, aug(11), 6) + "   <- 3 cells back up");

        System.out.println("\\n=== 8. moving the dates can fail ===============================");
        boolean moved = svc.modifyDates(x.get().id(), new Stay(aug(13), aug(15)), now);
        System.out.println("move Meera's suite to 13->15  -> " + (moved ? "moved" : "REFUSED, original intact"));
        System.out.println("Meera still holds             =  " + svc.get(x.get().id()).stay());

        System.out.println("\\n=== 9. the room number is a CHECK-IN decision ==================");
        System.out.println("Kabir checks in               -> room " + svc.checkIn(y.get().id()));
        inv.assertInvariant();
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "hotel_booking.py",
        code: `"""Hotel booking - nightly inventory, half-open stays, integer paise."""
from __future__ import annotations

import threading
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, timezone
from enum import Enum
from typing import Dict, List, Optional, Set

IST = timezone(timedelta(hours=5, minutes=30))


def fmt(paise: int) -> str:
    sign = "-" if paise < 0 else ""
    a = abs(paise)
    return sign + "Rs." + str(a // 100) + "." + str(a % 100).zfill(2)


class RoomTypeId(Enum):
    STANDARD = "STANDARD"
    DELUXE = "DELUXE"
    SUITE = "SUITE"


class BookingStatus(Enum):
    CONFIRMED = "CONFIRMED"
    CHECKED_IN = "CHECKED_IN"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"


# ----------------------------------------------------------------- stay
@dataclass(frozen=True)
class Stay:
    """HALF-OPEN [check_in, check_out). The checkout day is NOT a night."""
    check_in: date
    check_out: date

    def __post_init__(self) -> None:
        if not self.check_in < self.check_out:
            raise ValueError("check-out must be after check-in")

    def nights(self) -> int:
        return (self.check_out - self.check_in).days

    def overlaps(self, other: "Stay") -> bool:
        # STRICT "<" on BOTH sides. This is the whole problem in one line.
        return self.check_in < other.check_out and other.check_in < self.check_out

    def overlaps_buggy(self, other: "Stay") -> bool:
        return self.check_in <= other.check_out and other.check_in <= self.check_out

    def night_list(self) -> List[date]:
        out, d = [], self.check_in
        while d < self.check_out:          # "<", not "<=" - that is the off-by-one
            out.append(d)
            d += timedelta(days=1)
        return out

    def __str__(self) -> str:
        return str(self.check_in.day) + "->" + str(self.check_out.day) + " Aug (" + str(self.nights()) + "n)"


@dataclass(frozen=True)
class RoomType:
    id: RoomTypeId
    name: str
    sleeps: int
    total_rooms: int
    overbook_buffer: int = 0

    def capacity(self) -> int:             # the ONE place overbooking is decided
        return self.total_rooms + self.overbook_buffer


@dataclass(frozen=True)
class Room:
    number: str
    type: RoomTypeId                       # note: no is_booked flag anywhere


# ------------------------------------------------------------ inventory
class Inventory:
    """One counter per (room type, night). That is the entire model."""

    def __init__(self, room_types: List[RoomType]) -> None:
        self.types: Dict[RoomTypeId, RoomType] = {t.id: t for t in room_types}
        self.booked: Dict[RoomTypeId, Dict[date, int]] = {t.id: {} for t in room_types}
        self._locks: Dict[str, threading.Lock] = {}
        self._locks_guard = threading.Lock()

    def free_on(self, tid: RoomTypeId, night: date) -> int:
        return self.types[tid].capacity() - self.booked[tid].get(night, 0)

    def min_free(self, tid: RoomTypeId, stay: Stay) -> int:
        """Availability across a RANGE is the MINIMUM across its nights."""
        return min(self.free_on(tid, n) for n in stay.night_list())

    def _locks_for(self, tid: RoomTypeId, nights: List[date]) -> List[threading.Lock]:
        keys = sorted(tid.value + "@" + n.isoformat() for n in nights)   # SORTED -> no deadlock
        with self._locks_guard:
            return [self._locks.setdefault(k, threading.Lock()) for k in keys]

    def try_take(self, tid: RoomTypeId, stay: Stay, rooms: int) -> bool:
        """Two passes: check EVERY night, then take EVERY night. All or nothing."""
        if rooms <= 0:
            raise ValueError("rooms must be positive")
        nights = stay.night_list()
        locks = self._locks_for(tid, nights)
        for lk in locks:
            lk.acquire()
        try:
            for n in nights:                                  # pass 1: CHECK ALL
                if self.free_on(tid, n) < rooms:
                    return False                              # zero writes have happened
            for n in nights:                                  # pass 2: TAKE ALL
                self.booked[tid][n] = self.booked[tid].get(n, 0) + rooms
            return True
        finally:
            for lk in reversed(locks):
                lk.release()

    def try_take_one_pass_buggy(self, tid: RoomTypeId, stay: Stay, rooms: int) -> bool:
        """THE BUG - takes as it goes, so a late failure leaks the early nights."""
        for n in stay.night_list():
            if self.free_on(tid, n) < rooms:
                return False
            self.booked[tid][n] = self.booked[tid].get(n, 0) + rooms
        return True

    def release(self, tid: RoomTypeId, stay: Stay, rooms: int) -> None:
        nights = stay.night_list()
        locks = self._locks_for(tid, nights)
        for lk in locks:
            lk.acquire()
        try:
            for n in nights:
                self.booked[tid][n] = self.booked[tid].get(n, 0) - rooms
        finally:
            for lk in reversed(locks):
                lk.release()

    def assert_invariant(self) -> None:
        for tid, per_night in self.booked.items():
            cap = self.types[tid].capacity()
            for night, n in per_night.items():
                if n < 0 or n > cap:
                    raise AssertionError("oversold " + tid.value + " on " + str(night))

    def grid_line(self, tid: RoomTypeId, start: date, days: int) -> str:
        cells = "".join(str(self.free_on(tid, start + timedelta(days=i))).rjust(3) for i in range(days))
        return tid.value.ljust(9) + cells


# -------------------------------------------------------------- pricing
class RatePlan:
    def rate_for(self, tid: RoomTypeId, night: date) -> int:
        raise NotImplementedError


class FlatRatePlan(RatePlan):
    def __init__(self, base: Dict[RoomTypeId, int]) -> None:
        self.base = base

    def rate_for(self, tid: RoomTypeId, night: date) -> int:
        return self.base[tid]


class SeasonalRatePlan(RatePlan):
    def __init__(self, weekday: Dict[RoomTypeId, int], festival: Set[date]) -> None:
        self.weekday, self.festival = weekday, festival

    def rate_for(self, tid: RoomTypeId, night: date) -> int:
        r = self.weekday[tid]
        if night.weekday() >= 5:            # Sat / Sun
            r = r * 3 // 2
        if night in self.festival:
            r = r * 5 // 2
        return r


@dataclass(frozen=True)
class NightCharge:
    night: date
    paise: int                              # integer minor units, never a float


# --------------------------------------------------------- cancellation
class CancellationPolicy:
    def refund_for(self, b: "Booking", at: datetime) -> int:
        raise NotImplementedError


class FlexiblePolicy(CancellationPolicy):
    def refund_for(self, b: "Booking", at: datetime) -> int:
        check_in_at = datetime.combine(b.stay.check_in, datetime.min.time(), tzinfo=IST)
        hours = (check_in_at - at).total_seconds() / 3600.0
        if hours >= 48:
            return b.total()
        if hours >= 24:
            return max(0, b.total() - b.first_night_cost())
        return 0


class NonRefundablePolicy(CancellationPolicy):
    def refund_for(self, b: "Booking", at: datetime) -> int:
        return 0


# -------------------------------------------------------------- booking
@dataclass
class Booking:
    id: str
    guest_id: str
    type: RoomTypeId
    stay: Stay
    rooms: int
    charges: List[NightCharge]              # FROZEN at booking time
    booked_at: datetime
    status: BookingStatus = BookingStatus.CONFIRMED
    assigned_rooms: List[str] = field(default_factory=list)   # filled at CHECK-IN

    def total(self) -> int:
        return sum(c.paise for c in self.charges) * self.rooms

    def first_night_cost(self) -> int:
        return self.charges[0].paise * self.rooms

    def breakdown(self) -> str:
        lines = ["      " + str(c.night) + "  " + fmt(c.paise) for c in self.charges]
        lines.append("      total x" + str(self.rooms) + " room(s) = " + fmt(self.total()))
        return "\\n".join(lines)


class BookingService:
    def __init__(self, inv: Inventory, rate_plan: RatePlan,
                 policy: CancellationPolicy, rooms: List[Room]) -> None:
        self.inv, self.rate_plan, self.policy = inv, rate_plan, policy
        self.free_rooms: Dict[RoomTypeId, List[str]] = {}
        for r in rooms:
            self.free_rooms.setdefault(r.type, []).append(r.number)
        self.bookings: Dict[str, Booking] = {}
        self._seq = 0
        self._seq_lock = threading.Lock()

    def _next_id(self) -> str:
        with self._seq_lock:
            self._seq += 1
            return "BK-" + str(self._seq)

    def search(self, stay: Stay, guests: int, rooms_wanted: int) -> List[RoomTypeId]:
        # cheap filter (sleeps) BEFORE the expensive one (walks every night)
        return [t.id for t in self.inv.types.values()
                if t.sleeps >= guests and self.inv.min_free(t.id, stay) >= rooms_wanted]

    def quote(self, tid: RoomTypeId, stay: Stay) -> List[NightCharge]:
        return [NightCharge(n, self.rate_plan.rate_for(tid, n)) for n in stay.night_list()]

    def book(self, guest_id: str, tid: RoomTypeId, stay: Stay,
             rooms: int, at: datetime) -> Optional[Booking]:
        charges = self.quote(tid, stay)                  # price first - touches no state
        if not self.inv.try_take(tid, stay, rooms):
            return None
        b = Booking(self._next_id(), guest_id, tid, stay, rooms, charges, at)
        self.bookings[b.id] = b
        return b

    def cancel(self, booking_id: str, at: datetime) -> int:
        b = self.bookings.get(booking_id)
        if b is None or b.status is not BookingStatus.CONFIRMED:
            return 0
        refund = self.policy.refund_for(b, at)           # the money question
        self.inv.release(b.type, b.stay, b.rooms)        # the counter question - invariant
        b.status = BookingStatus.CANCELLED
        return refund

    def modify_dates(self, booking_id: str, new_stay: Stay, at: datetime) -> bool:
        """cancel + rebook against the counters - and it can fail, so roll back."""
        b = self.bookings.get(booking_id)
        if b is None or b.status is not BookingStatus.CONFIRMED:
            return False
        self.inv.release(b.type, b.stay, b.rooms)
        if not self.inv.try_take(b.type, new_stay, b.rooms):
            self.inv.try_take(b.type, b.stay, b.rooms)   # put it back
            return False
        b.stay = new_stay
        b.charges = self.quote(b.type, new_stay)
        return True

    def check_in(self, booking_id: str) -> List[str]:
        """The room NUMBER is decided HERE, not at booking time."""
        b = self.bookings.get(booking_id)
        if b is None or b.status is not BookingStatus.CONFIRMED:
            return []
        pool = self.free_rooms.get(b.type, [])
        for _ in range(min(b.rooms, len(pool))):
            b.assigned_rooms.append(pool.pop(0))
        b.status = BookingStatus.CHECKED_IN
        return b.assigned_rooms


# ----------------------------------------------------------------- demo
def aug(d: int) -> date:
    return date(2026, 8, d)


def main() -> None:
    types = [
        RoomType(RoomTypeId.STANDARD, "Standard", 2, 6),
        RoomType(RoomTypeId.DELUXE, "Deluxe", 3, 3),
        RoomType(RoomTypeId.SUITE, "Suite", 4, 2),
    ]
    rooms = ([Room("30" + str(i), RoomTypeId.STANDARD) for i in range(1, 7)]
             + [Room("40" + str(i), RoomTypeId.DELUXE) for i in range(1, 4)]
             + [Room("50" + str(i), RoomTypeId.SUITE) for i in range(1, 3)])

    weekday = {RoomTypeId.STANDARD: 400000, RoomTypeId.DELUXE: 650000, RoomTypeId.SUITE: 1200000}
    inv = Inventory(types)
    seasonal = SeasonalRatePlan(weekday, {aug(14), aug(15)})
    flat = FlatRatePlan(weekday)
    svc = BookingService(inv, seasonal, FlexiblePolicy(), rooms)

    now = datetime(2026, 8, 10, 12, 0, tzinfo=IST)
    s1215 = Stay(aug(12), aug(15))

    print("=== 0. half-open intervals =====================================")
    print("Stay(12,15).nights()          =", s1215.nights(), "  <- three, not four")
    a, b = Stay(aug(12), aug(14)), Stay(aug(14), aug(16))
    print("overlaps(12->14, 14->16)      =", a.overlaps(b), "  <- checkout day is free")
    print("overlaps_buggy(same, with <=) =", a.overlaps_buggy(b), "  <- the off-by-one")

    print("\\n=== 1. search ==================================================")
    print("search(12->15, guests=2)      =", [t.value for t in svc.search(s1215, 2, 1)])

    print("\\n=== 2. per-night pricing =======================================")
    flat_total = sum(flat.rate_for(RoomTypeId.DELUXE, n) for n in s1215.night_list())
    aarti = svc.book("aarti", RoomTypeId.DELUXE, s1215, 1, now)
    print("Aarti books a Deluxe", str(s1215), "->", aarti.id)
    print(aarti.breakdown())
    print("      flat x nights would be   =", fmt(flat_total),
          "  (short by " + fmt(aarti.total() - flat_total) + ")")

    print("\\n=== 3. all-or-nothing ==========================================")
    svc.book("house", RoomTypeId.DELUXE, Stay(aug(13), aug(14)), 2, now)   # night 13 -> 0
    print("before:", inv.grid_line(RoomTypeId.DELUXE, aug(11), 6))
    ravi = svc.book("ravi", RoomTypeId.DELUXE, Stay(aug(11), aug(16)), 1, now)
    print("Ravi books Deluxe 11->16      ->", ravi.id if ravi else "SOLD OUT")
    print("after :", inv.grid_line(RoomTypeId.DELUXE, aug(11), 6), "  <- identical")

    print("\\n=== 4. one-pass leak (the bug) =================================")
    print("before:", inv.grid_line(RoomTypeId.DELUXE, aug(11), 6))
    ok = inv.try_take_one_pass_buggy(RoomTypeId.DELUXE, Stay(aug(11), aug(16)), 1)
    print("one-pass take 11->16          ->", "ok" if ok else "FAILED")
    print("after :", inv.grid_line(RoomTypeId.DELUXE, aug(11), 6), "  <- night 11 LEAKED")
    inv.release(RoomTypeId.DELUXE, Stay(aug(11), aug(12)), 1)

    print("\\n=== 5. the changeover day ======================================")
    svc.book("house", RoomTypeId.SUITE, Stay(aug(12), aug(18)), 1, now)    # 1 suite left
    x = svc.book("meera", RoomTypeId.SUITE, Stay(aug(12), aug(14)), 1, now)
    y = svc.book("kabir", RoomTypeId.SUITE, Stay(aug(14), aug(16)), 1, now)
    print("only 1 Suite left. 12->14 =", "CONFIRMED" if x else "sold out",
          ", 14->16 =", "CONFIRMED" if y else "sold out", "  <- both, sharing 14 Aug")

    print("\\n=== 6. two guests, one last room ===============================")
    svc.book("house", RoomTypeId.STANDARD, Stay(aug(17), aug(18)), 5, now)  # 1 Standard left
    night17 = Stay(aug(17), aug(18))
    results: List[str] = []
    go = threading.Barrier(2)

    def racer() -> None:
        go.wait()
        r = svc.book("racer", RoomTypeId.STANDARD, night17, 1, now)
        results.append("CONFIRMED " + r.id if r else "sold out")

    ts = [threading.Thread(target=racer) for _ in range(2)]
    for t in ts:
        t.start()
    for t in ts:
        t.join()
    print("two threads, one room         ->", results)
    print("free on 17 Aug                = ", inv.free_on(RoomTypeId.STANDARD, aug(17)))
    inv.assert_invariant()
    print("invariant 0 <= booked <= capacity: HOLDS")

    print("\\n=== 7. cancellation ============================================")
    print("before:", inv.grid_line(RoomTypeId.DELUXE, aug(11), 6))
    refund = svc.cancel(aarti.id, now)
    print("Aarti cancels 36h before check-in, total", fmt(aarti.total()))
    print("refund                        = ", fmt(refund), "  (one night kept)")
    print("after :", inv.grid_line(RoomTypeId.DELUXE, aug(11), 6), "  <- 3 cells back up")

    print("\\n=== 8. moving the dates can fail ===============================")
    moved = svc.modify_dates(x.id, Stay(aug(13), aug(15)), now)
    print("move Meera's suite to 13->15  ->", "moved" if moved else "REFUSED, original intact")
    print("Meera still holds             = ", str(svc.bookings[x.id].stay))

    print("\\n=== 9. the room number is a CHECK-IN decision ==================")
    print("Kabir checks in               -> room", svc.check_in(y.id))
    inv.assert_invariant()


if __name__ == "__main__":
    main()`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "hotel_booking.cpp",
        code: `// Hotel booking - nightly inventory, half-open stays, integer paise.
// Build:  g++ -std=c++20 -O2 -pthread hotel_booking.cpp -o hotel && ./hotel
#include <algorithm>
#include <chrono>
#include <iomanip>
#include <iostream>
#include <map>
#include <mutex>
#include <optional>
#include <set>
#include <sstream>
#include <string>
#include <thread>
#include <vector>

using namespace std::chrono;
using Night = sys_days;                       // a calendar day, comparable and orderable

/* ============================================================== money */
static std::string fmt(long long paise) {
    long long a = paise < 0 ? -paise : paise;
    std::ostringstream os;
    os << (paise < 0 ? "-" : "") << "Rs." << (a / 100) << "."
       << std::setw(2) << std::setfill('0') << (a % 100);
    return os.str();
}

static std::string dstr(Night d) {
    year_month_day ymd{d};
    std::ostringstream os;
    os << int(ymd.year()) << "-" << std::setw(2) << std::setfill('0') << unsigned(ymd.month())
       << "-" << std::setw(2) << std::setfill('0') << unsigned(ymd.day());
    return os.str();
}

enum class RoomTypeId { STANDARD, DELUXE, SUITE };
enum class BookingStatus { CONFIRMED, CHECKED_IN, CANCELLED, NO_SHOW };

static const char* typeName(RoomTypeId t) {
    switch (t) {
        case RoomTypeId::STANDARD: return "STANDARD";
        case RoomTypeId::DELUXE:   return "DELUXE";
        default:                   return "SUITE";
    }
}

/* =============================================================== stay */
// HALF-OPEN [checkIn, checkOut). The checkout day is NOT a night.
struct Stay {
    Night checkIn, checkOut;

    Stay(Night in, Night out) : checkIn(in), checkOut(out) {
        if (!(in < out)) throw std::invalid_argument("check-out must be after check-in");
    }

    int nights() const { return (checkOut - checkIn).count(); }

    // The one line the whole problem turns on. STRICT "<" on BOTH sides.
    bool overlaps(const Stay& o) const { return checkIn < o.checkOut && o.checkIn < checkOut; }

    // The off-by-one, kept only so main() can print the difference.
    bool overlapsBuggy(const Stay& o) const { return checkIn <= o.checkOut && o.checkIn <= checkOut; }

    std::vector<Night> nightList() const {
        std::vector<Night> out;
        for (Night d = checkIn; d < checkOut; d += days(1)) out.push_back(d);   // "<", not "<="
        return out;
    }

    std::string str() const {
        std::ostringstream os;
        os << unsigned(year_month_day{checkIn}.day()) << "->"
           << unsigned(year_month_day{checkOut}.day()) << " Aug (" << nights() << "n)";
        return os.str();
    }
};

struct RoomType {
    RoomTypeId id;
    std::string name;
    int sleeps;
    int totalRooms;
    int overbookBuffer = 0;
    int capacity() const { return totalRooms + overbookBuffer; }   // the ONE place
};

struct Room {
    std::string number;
    RoomTypeId type;                          // note: no isBooked flag anywhere
};

/* ========================================================== inventory */
class Inventory {
public:
    explicit Inventory(std::vector<RoomType> ts) {
        for (auto& t : ts) types_[t.id] = t;
    }

    const RoomType& type(RoomTypeId id) const { return types_.at(id); }
    const std::map<RoomTypeId, RoomType>& allTypes() const { return types_; }

    int freeOn(RoomTypeId id, Night n) const {
        auto it = booked_.find({id, n});
        int taken = it == booked_.end() ? 0 : it->second;
        return types_.at(id).capacity() - taken;
    }

    // Availability across a RANGE is the MINIMUM across its nights.
    int minFree(RoomTypeId id, const Stay& s) const {
        int m = 1 << 30;
        for (Night n : s.nightList()) m = std::min(m, freeOn(id, n));
        return m;
    }

    // Two passes: check EVERY night, then take EVERY night. All-or-nothing.
    bool tryTake(RoomTypeId id, const Stay& s, int rooms) {
        if (rooms <= 0) throw std::invalid_argument("rooms must be positive");
        auto nights = s.nightList();
        auto locks = lockNights(id, nights);                 // sorted order inside
        for (Night n : nights)                               // pass 1: CHECK ALL
            if (freeOn(id, n) < rooms) return false;         // zero writes so far
        for (Night n : nights)                               // pass 2: TAKE ALL
            booked_[{id, n}] += rooms;
        return true;
    }

    // THE BUG: takes as it goes, so a late failure leaks the early nights.
    bool tryTakeOnePassBuggy(RoomTypeId id, const Stay& s, int rooms) {
        for (Night n : s.nightList()) {
            if (freeOn(id, n) < rooms) return false;
            booked_[{id, n}] += rooms;
        }
        return true;
    }

    void release(RoomTypeId id, const Stay& s, int rooms) {
        auto nights = s.nightList();
        auto locks = lockNights(id, nights);
        for (Night n : nights) booked_[{id, n}] -= rooms;
    }

    void assertInvariant() const {
        for (auto& [key, taken] : booked_) {
            int cap = types_.at(key.first).capacity();
            if (taken < 0 || taken > cap)
                throw std::runtime_error(std::string("oversold ") + typeName(key.first));
        }
    }

    std::string gridLine(RoomTypeId id, Night from, int daysCount) const {
        std::ostringstream os;
        os << std::left << std::setw(9) << typeName(id);
        for (int i = 0; i < daysCount; i++) os << std::right << std::setw(3) << freeOn(id, from + days(i));
        return os.str();
    }

private:
    using Key = std::pair<RoomTypeId, Night>;
    std::map<RoomTypeId, RoomType> types_;
    std::map<Key, int> booked_;
    std::map<std::string, std::unique_ptr<std::mutex>> nightLocks_;
    std::mutex registry_;

    // Locks the nights in SORTED order and hands back RAII guards.
    std::vector<std::unique_lock<std::mutex>> lockNights(RoomTypeId id, std::vector<Night> nights) {
        std::vector<std::string> keys;
        for (Night n : nights) keys.push_back(std::string(typeName(id)) + "@" + dstr(n));
        std::sort(keys.begin(), keys.end());                 // a global order -> no deadlock
        std::vector<std::unique_lock<std::mutex>> guards;
        for (auto& k : keys) {
            std::mutex* m;
            {
                std::lock_guard<std::mutex> g(registry_);
                auto& slot = nightLocks_[k];
                if (!slot) slot = std::make_unique<std::mutex>();
                m = slot.get();
            }
            guards.emplace_back(*m);
        }
        return guards;
    }
};

/* ============================================================ pricing */
struct RatePlan {
    virtual ~RatePlan() = default;
    virtual long long rateFor(RoomTypeId t, Night n) const = 0;   // paise, ONE night
};

struct FlatRatePlan : RatePlan {
    std::map<RoomTypeId, long long> base;
    long long rateFor(RoomTypeId t, Night) const override { return base.at(t); }
};

struct SeasonalRatePlan : RatePlan {
    std::map<RoomTypeId, long long> weekday;
    std::set<Night> festival;
    long long rateFor(RoomTypeId t, Night n) const override {
        long long r = weekday.at(t);
        std::chrono::weekday wd{n};                       // 0 = Sunday
        if (wd == Saturday || wd == Sunday) r = r * 3 / 2;
        if (festival.count(n)) r = r * 5 / 2;
        return r;
    }
};

struct NightCharge {
    Night night;
    long long paise;                          // integer minor units, never a double
};

/* ============================================================ booking */
struct Booking {
    std::string id, guestId;
    RoomTypeId type;
    Stay stay;
    int rooms;
    std::vector<NightCharge> charges;         // FROZEN at booking time
    long long bookedAtHours;                  // "now" as a parameter, not a clock call
    BookingStatus status = BookingStatus::CONFIRMED;
    std::vector<std::string> assignedRooms;   // filled at CHECK-IN

    long long total() const {
        long long s = 0;
        for (auto& c : charges) s += c.paise;
        return s * rooms;
    }
    long long firstNightCost() const { return charges.front().paise * rooms; }
};

/* ======================================================= cancellation */
struct CancellationPolicy {
    virtual ~CancellationPolicy() = default;
    // hoursBeforeCheckIn is passed in, so the rule is pure and testable.
    virtual long long refundFor(const Booking& b, long long hoursBeforeCheckIn) const = 0;
};

struct FlexiblePolicy : CancellationPolicy {
    long long refundFor(const Booking& b, long long h) const override {
        if (h >= 48) return b.total();
        if (h >= 24) return std::max(0LL, b.total() - b.firstNightCost());
        return 0;
    }
};

struct NonRefundablePolicy : CancellationPolicy {
    long long refundFor(const Booking&, long long) const override { return 0; }
};

/* ===================================================== bookingservice */
class BookingService {
public:
    BookingService(Inventory& inv, const RatePlan& rp, const CancellationPolicy& cp,
                   const std::vector<Room>& rooms)
        : inv_(inv), rate_(rp), policy_(cp) {
        for (auto& r : rooms) freeRooms_[r.type].push_back(r.number);
    }

    std::vector<RoomTypeId> search(const Stay& s, int guests, int roomsWanted) {
        std::vector<RoomTypeId> out;
        for (auto& [id, t] : inv_.allTypes())
            if (t.sleeps >= guests && inv_.minFree(id, s) >= roomsWanted)   // cheap filter first
                out.push_back(id);
        return out;
    }

    std::vector<NightCharge> quote(RoomTypeId t, const Stay& s) const {
        std::vector<NightCharge> out;
        for (Night n : s.nightList()) out.push_back({n, rate_.rateFor(t, n)});
        return out;
    }

    std::optional<std::string> book(const std::string& guest, RoomTypeId t,
                                    const Stay& s, int rooms, long long atHours) {
        auto charges = quote(t, s);                       // price first: touches no state
        if (!inv_.tryTake(t, s, rooms)) return std::nullopt;
        std::string id;
        {
            std::lock_guard<std::mutex> g(mu_);
            id = "BK-" + std::to_string(++seq_);
            bookings_.emplace(id, Booking{id, guest, t, s, rooms, charges, atHours});
        }
        return id;
    }

    long long cancel(const std::string& id, long long hoursBeforeCheckIn) {
        std::lock_guard<std::mutex> g(mu_);
        auto it = bookings_.find(id);
        if (it == bookings_.end() || it->second.status != BookingStatus::CONFIRMED) return 0;
        Booking& b = it->second;
        long long refund = policy_.refundFor(b, hoursBeforeCheckIn);   // the money question
        inv_.release(b.type, b.stay, b.rooms);                          // the counter question
        b.status = BookingStatus::CANCELLED;
        return refund;
    }

    // cancel + rebook against the counters - and it CAN fail, so roll back.
    bool modifyDates(const std::string& id, const Stay& newStay) {
        std::lock_guard<std::mutex> g(mu_);
        auto it = bookings_.find(id);
        if (it == bookings_.end() || it->second.status != BookingStatus::CONFIRMED) return false;
        Booking& b = it->second;
        inv_.release(b.type, b.stay, b.rooms);
        if (!inv_.tryTake(b.type, newStay, b.rooms)) {
            inv_.tryTake(b.type, b.stay, b.rooms);         // put it back
            return false;
        }
        b.stay = newStay;
        b.charges = quote(b.type, newStay);
        return true;
    }

    // The room NUMBER is decided HERE, not at booking time.
    std::vector<std::string> checkIn(const std::string& id) {
        std::lock_guard<std::mutex> g(mu_);
        auto it = bookings_.find(id);
        if (it == bookings_.end() || it->second.status != BookingStatus::CONFIRMED) return {};
        Booking& b = it->second;
        auto& pool = freeRooms_[b.type];
        for (int i = 0; i < b.rooms && !pool.empty(); i++) {
            b.assignedRooms.push_back(pool.front());
            pool.erase(pool.begin());
        }
        b.status = BookingStatus::CHECKED_IN;
        return b.assignedRooms;
    }

    const Booking& get(const std::string& id) { return bookings_.at(id); }

private:
    Inventory& inv_;
    const RatePlan& rate_;
    const CancellationPolicy& policy_;
    std::map<RoomTypeId, std::vector<std::string>> freeRooms_;
    std::map<std::string, Booking> bookings_;
    std::mutex mu_;
    int seq_ = 0;
};

/* =============================================================== demo */
static Night aug(int d) { return sys_days{year{2026} / 8 / day(unsigned(d))}; }

int main() {
    Inventory inv({{RoomTypeId::STANDARD, "Standard", 2, 6},
                   {RoomTypeId::DELUXE,   "Deluxe",   3, 3},
                   {RoomTypeId::SUITE,    "Suite",    4, 2}});

    std::vector<Room> rooms;
    for (int i = 1; i <= 6; i++) rooms.push_back({"30" + std::to_string(i), RoomTypeId::STANDARD});
    for (int i = 1; i <= 3; i++) rooms.push_back({"40" + std::to_string(i), RoomTypeId::DELUXE});
    for (int i = 1; i <= 2; i++) rooms.push_back({"50" + std::to_string(i), RoomTypeId::SUITE});

    std::map<RoomTypeId, long long> weekday{{RoomTypeId::STANDARD, 400000},
                                            {RoomTypeId::DELUXE, 650000},
                                            {RoomTypeId::SUITE, 1200000}};
    SeasonalRatePlan seasonal; seasonal.weekday = weekday; seasonal.festival = {aug(14), aug(15)};
    FlatRatePlan flat; flat.base = weekday;
    FlexiblePolicy policy;
    BookingService svc(inv, seasonal, policy, rooms);

    Stay s1215(aug(12), aug(15));

    std::cout << "=== 0. half-open intervals =====================================\\n";
    std::cout << "Stay(12,15).nights()          = " << s1215.nights() << "   <- three, not four\\n";
    Stay a(aug(12), aug(14)), b(aug(14), aug(16));
    std::cout << "overlaps(12->14, 14->16)      = " << std::boolalpha << a.overlaps(b) << "   <- checkout day is free\\n";
    std::cout << "overlapsBuggy(same, with <=)  = " << a.overlapsBuggy(b) << "   <- the off-by-one\\n";

    std::cout << "\\n=== 1. search ==================================================\\n";
    std::cout << "search(12->15, guests=2)      = ";
    for (auto t : svc.search(s1215, 2, 1)) std::cout << typeName(t) << " ";
    std::cout << "\\n";

    std::cout << "\\n=== 2. per-night pricing =======================================\\n";
    long long flatTotal = 0;
    for (Night n : s1215.nightList()) flatTotal += flat.rateFor(RoomTypeId::DELUXE, n);
    auto aarti = svc.book("aarti", RoomTypeId::DELUXE, s1215, 1, 0);
    std::cout << "Aarti books a Deluxe " << s1215.str() << " -> " << *aarti << "\\n";
    for (auto& c : svc.get(*aarti).charges)
        std::cout << "      " << dstr(c.night) << "  " << fmt(c.paise) << "\\n";
    std::cout << "      total                    = " << fmt(svc.get(*aarti).total()) << "\\n";
    std::cout << "      flat x nights would be   = " << fmt(flatTotal)
              << "   (short by " << fmt(svc.get(*aarti).total() - flatTotal) << ")\\n";

    std::cout << "\\n=== 3. all-or-nothing ==========================================\\n";
    svc.book("house", RoomTypeId::DELUXE, Stay(aug(13), aug(14)), 2, 0);   // night 13 -> 0
    std::cout << "before: " << inv.gridLine(RoomTypeId::DELUXE, aug(11), 6) << "\\n";
    auto ravi = svc.book("ravi", RoomTypeId::DELUXE, Stay(aug(11), aug(16)), 1, 0);
    std::cout << "Ravi books Deluxe 11->16      -> " << (ravi ? *ravi : std::string("SOLD OUT")) << "\\n";
    std::cout << "after : " << inv.gridLine(RoomTypeId::DELUXE, aug(11), 6) << "   <- identical\\n";

    std::cout << "\\n=== 4. one-pass leak (the bug) =================================\\n";
    std::cout << "before: " << inv.gridLine(RoomTypeId::DELUXE, aug(11), 6) << "\\n";
    bool ok = inv.tryTakeOnePassBuggy(RoomTypeId::DELUXE, Stay(aug(11), aug(16)), 1);
    std::cout << "one-pass take 11->16          -> " << (ok ? "ok" : "FAILED") << "\\n";
    std::cout << "after : " << inv.gridLine(RoomTypeId::DELUXE, aug(11), 6) << "   <- night 11 LEAKED\\n";
    inv.release(RoomTypeId::DELUXE, Stay(aug(11), aug(12)), 1);

    std::cout << "\\n=== 5. the changeover day ======================================\\n";
    svc.book("house", RoomTypeId::SUITE, Stay(aug(12), aug(18)), 1, 0);    // 1 suite left
    auto x = svc.book("meera", RoomTypeId::SUITE, Stay(aug(12), aug(14)), 1, 0);
    auto y = svc.book("kabir", RoomTypeId::SUITE, Stay(aug(14), aug(16)), 1, 0);
    std::cout << "only 1 Suite left. 12->14 = " << (x ? "CONFIRMED" : "sold out")
              << " , 14->16 = " << (y ? "CONFIRMED" : "sold out") << "   <- both, sharing 14 Aug\\n";

    std::cout << "\\n=== 6. two guests, one last room ===============================\\n";
    svc.book("house", RoomTypeId::STANDARD, Stay(aug(17), aug(18)), 5, 0); // 1 Standard left
    std::vector<std::string> out(2);
    std::thread t1([&] {
        auto r = svc.book("racerA", RoomTypeId::STANDARD, Stay(aug(17), aug(18)), 1, 0);
        out[0] = r ? "CONFIRMED " + *r : "sold out";
    });
    std::thread t2([&] {
        auto r = svc.book("racerB", RoomTypeId::STANDARD, Stay(aug(17), aug(18)), 1, 0);
        out[1] = r ? "CONFIRMED " + *r : "sold out";
    });
    t1.join(); t2.join();
    std::cout << "two threads, one room         -> " << out[0] << " | " << out[1] << "\\n";
    std::cout << "free on 17 Aug                =  " << inv.freeOn(RoomTypeId::STANDARD, aug(17)) << "\\n";
    inv.assertInvariant();
    std::cout << "invariant 0 <= booked <= capacity: HOLDS\\n";

    std::cout << "\\n=== 7. cancellation ============================================\\n";
    std::cout << "before: " << inv.gridLine(RoomTypeId::DELUXE, aug(11), 6) << "\\n";
    long long refund = svc.cancel(*aarti, 36);                 // 36h before check-in
    std::cout << "refund                        =  " << fmt(refund) << "   (one night kept)\\n";
    std::cout << "after : " << inv.gridLine(RoomTypeId::DELUXE, aug(11), 6) << "   <- 3 cells back up\\n";

    std::cout << "\\n=== 8. moving the dates can fail ===============================\\n";
    bool moved = svc.modifyDates(*x, Stay(aug(13), aug(15)));
    std::cout << "move Meera's suite to 13->15  -> " << (moved ? "moved" : "REFUSED, original intact") << "\\n";
    std::cout << "Meera still holds             =  " << svc.get(*x).stay.str() << "\\n";

    std::cout << "\\n=== 9. the room number is a CHECK-IN decision ==================\\n";
    std::cout << "Kabir checks in               -> room " << svc.checkIn(*y).front() << "\\n";
    inv.assertInvariant();
    return 0;
}`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "hotelBooking.ts",
        code: `/**
 * Hotel booking - nightly inventory, half-open stays, integer paise.
 * Run:  npx tsx hotelBooking.ts
 *
 * JS is single-threaded, so a synchronous check-then-take cannot be
 * interleaved. That is a real answer to the race question, not a dodge -
 * but the moment book() awaits anything, the guard has to come back.
 */

type Night = string;                       // ISO date, "2026-08-12" - sorts lexicographically

const DAY_MS = 86400000;

function toNight(y: number, m: number, d: number): Night {
  return new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
}
function addDays(n: Night, k: number): Night {
  return new Date(Date.parse(n + "T00:00:00Z") + k * DAY_MS).toISOString().slice(0, 10);
}
function diffDays(a: Night, b: Night): number {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / DAY_MS);
}
function dayOfWeek(n: Night): number {
  return new Date(Date.parse(n + "T00:00:00Z")).getUTCDay();   // 0 = Sun, 6 = Sat
}
function fmt(paise: number): string {
  const sign = paise < 0 ? "-" : "";
  const a = Math.abs(paise);
  return sign + "Rs." + Math.floor(a / 100) + "." + String(a % 100).padStart(2, "0");
}

export type RoomTypeId = "STANDARD" | "DELUXE" | "SUITE";
export type BookingStatus = "CONFIRMED" | "CHECKED_IN" | "CANCELLED" | "NO_SHOW";

/* ================================================================ stay */
/** HALF-OPEN [checkIn, checkOut). The checkout day is NOT a night. */
export class Stay {
  constructor(readonly checkIn: Night, readonly checkOut: Night) {
    if (!(checkIn < checkOut)) throw new Error("check-out must be after check-in");
  }

  nights(): number { return diffDays(this.checkIn, this.checkOut); }

  /** The one line the whole problem turns on. STRICT "<" on BOTH sides. */
  overlaps(o: Stay): boolean {
    return this.checkIn < o.checkOut && o.checkIn < this.checkOut;
  }

  /** The off-by-one, kept only so the demo can print the difference. */
  overlapsBuggy(o: Stay): boolean {
    return this.checkIn <= o.checkOut && o.checkIn <= this.checkOut;
  }

  nightList(): Night[] {
    const out: Night[] = [];
    for (let d = this.checkIn; d < this.checkOut; d = addDays(d, 1)) out.push(d);  // "<", not "<="
    return out;
  }

  toString(): string {
    return this.checkIn.slice(8) + "->" + this.checkOut.slice(8) + " Aug (" + this.nights() + "n)";
  }
}

export interface RoomType {
  id: RoomTypeId;
  name: string;
  sleeps: number;
  totalRooms: number;
  overbookBuffer: number;
}
/** The ONE place overbooking is decided. */
const capacity = (t: RoomType): number => t.totalRooms + t.overbookBuffer;

export interface Room { number: string; type: RoomTypeId; }   // no isBooked, ever

/* =========================================================== inventory */
export class Inventory {
  private types = new Map<RoomTypeId, RoomType>();
  private booked = new Map<string, number>();                 // "TYPE@night" -> rooms taken

  constructor(roomTypes: RoomType[]) {
    for (const t of roomTypes) this.types.set(t.id, t);
  }

  type(id: RoomTypeId): RoomType { return this.types.get(id)!; }
  allTypes(): RoomType[] { return [...this.types.values()]; }

  private key(id: RoomTypeId, n: Night): string { return id + "@" + n; }

  freeOn(id: RoomTypeId, n: Night): number {
    return capacity(this.type(id)) - (this.booked.get(this.key(id, n)) ?? 0);
  }

  /** Availability across a RANGE is the MINIMUM across its nights. */
  minFree(id: RoomTypeId, stay: Stay): number {
    return stay.nightList().reduce((m, n) => Math.min(m, this.freeOn(id, n)), Infinity);
  }

  /**
   * Two passes: check EVERY night, then take EVERY night.
   * Returning false means the inventory is byte-for-byte unchanged.
   */
  tryTake(id: RoomTypeId, stay: Stay, rooms: number): boolean {
    if (rooms <= 0) throw new Error("rooms must be positive");
    const nights = stay.nightList();
    for (const n of nights) if (this.freeOn(id, n) < rooms) return false;   // pass 1: CHECK ALL
    for (const n of nights) {                                              // pass 2: TAKE ALL
      const k = this.key(id, n);
      this.booked.set(k, (this.booked.get(k) ?? 0) + rooms);
    }
    return true;
  }

  /** THE BUG: takes as it goes, so a late failure leaks the early nights. */
  tryTakeOnePassBuggy(id: RoomTypeId, stay: Stay, rooms: number): boolean {
    for (const n of stay.nightList()) {
      if (this.freeOn(id, n) < rooms) return false;
      const k = this.key(id, n);
      this.booked.set(k, (this.booked.get(k) ?? 0) + rooms);
    }
    return true;
  }

  release(id: RoomTypeId, stay: Stay, rooms: number): void {
    for (const n of stay.nightList()) {
      const k = this.key(id, n);
      this.booked.set(k, (this.booked.get(k) ?? 0) - rooms);
    }
  }

  assertInvariant(): void {
    for (const [k, taken] of this.booked) {
      const id = k.split("@")[0] as RoomTypeId;
      if (taken < 0 || taken > capacity(this.type(id))) throw new Error("oversold: " + k + " = " + taken);
    }
  }

  gridLine(id: RoomTypeId, from: Night, days: number): string {
    let s = id.padEnd(9);
    for (let i = 0; i < days; i++) s += String(this.freeOn(id, addDays(from, i))).padStart(3);
    return s;
  }
}

/* ============================================================= pricing */
export interface RatePlan {
  /** Paise, for ONE night. Never for a stay. */
  rateFor(type: RoomTypeId, night: Night): number;
}

export class FlatRatePlan implements RatePlan {
  constructor(private base: Record<RoomTypeId, number>) {}
  rateFor(type: RoomTypeId): number { return this.base[type]; }
}

export class SeasonalRatePlan implements RatePlan {
  constructor(private weekday: Record<RoomTypeId, number>, private festival: Set<Night>) {}
  rateFor(type: RoomTypeId, night: Night): number {
    let r = this.weekday[type];
    const d = dayOfWeek(night);
    if (d === 0 || d === 6) r = Math.floor((r * 3) / 2);     // weekend
    if (this.festival.has(night)) r = Math.floor((r * 5) / 2);
    return r;
  }
}

export interface NightCharge { night: Night; paise: number; }   // integers only

/* ======================================================== cancellation */
export interface CancellationPolicy {
  /** hoursBeforeCheckIn is passed IN, so the rule is pure and testable. */
  refundFor(b: Booking, hoursBeforeCheckIn: number): number;
}

export class FlexiblePolicy implements CancellationPolicy {
  refundFor(b: Booking, h: number): number {
    if (h >= 48) return b.total();
    if (h >= 24) return Math.max(0, b.total() - b.firstNightCost());
    return 0;
  }
}

export class NonRefundablePolicy implements CancellationPolicy {
  refundFor(): number { return 0; }
}

/* ============================================================= booking */
export class Booking {
  status: BookingStatus = "CONFIRMED";
  assignedRooms: string[] = [];                 // filled at CHECK-IN, not now

  constructor(
    readonly id: string,
    readonly guestId: string,
    readonly type: RoomTypeId,
    public stay: Stay,
    readonly rooms: number,
    public charges: NightCharge[],              // FROZEN at booking time
    readonly bookedAtHours: number,
  ) {}

  total(): number { return this.charges.reduce((s, c) => s + c.paise, 0) * this.rooms; }
  firstNightCost(): number { return this.charges[0].paise * this.rooms; }
  breakdown(): string {
    return this.charges.map((c) => "      " + c.night + "  " + fmt(c.paise)).join("\\n")
      + "\\n      total x" + this.rooms + " room(s) = " + fmt(this.total());
  }
}

/* ====================================================== bookingservice */
export class BookingService {
  private bookings = new Map<string, Booking>();
  private freeRooms = new Map<RoomTypeId, string[]>();
  private seq = 0;

  constructor(
    private inv: Inventory,
    private ratePlan: RatePlan,
    private policy: CancellationPolicy,
    rooms: Room[],
  ) {
    for (const r of rooms) {
      const pool = this.freeRooms.get(r.type) ?? [];
      pool.push(r.number);
      this.freeRooms.set(r.type, pool);
    }
  }

  /** Advisory: someone may take the room between this and book(). */
  search(stay: Stay, guests: number, roomsWanted: number): RoomTypeId[] {
    return this.inv.allTypes()
      .filter((t) => t.sleeps >= guests)                       // cheap filter first
      .filter((t) => this.inv.minFree(t.id, stay) >= roomsWanted)
      .map((t) => t.id);
  }

  quote(type: RoomTypeId, stay: Stay): NightCharge[] {
    return stay.nightList().map((n) => ({ night: n, paise: this.ratePlan.rateFor(type, n) }));
  }

  book(guestId: string, type: RoomTypeId, stay: Stay, rooms: number, atHours: number): Booking | null {
    const charges = this.quote(type, stay);                    // price first: touches no state
    if (!this.inv.tryTake(type, stay, rooms)) return null;
    const b = new Booking("BK-" + ++this.seq, guestId, type, stay, rooms, charges, atHours);
    this.bookings.set(b.id, b);
    return b;
  }

  cancel(id: string, hoursBeforeCheckIn: number): number {
    const b = this.bookings.get(id);
    if (!b || b.status !== "CONFIRMED") return 0;
    const refund = this.policy.refundFor(b, hoursBeforeCheckIn);   // the money question
    this.inv.release(b.type, b.stay, b.rooms);                     // the counter question
    b.status = "CANCELLED";
    return refund;
  }

  /** cancel + rebook against the counters - and it CAN fail, so roll back. */
  modifyDates(id: string, newStay: Stay): boolean {
    const b = this.bookings.get(id);
    if (!b || b.status !== "CONFIRMED") return false;
    this.inv.release(b.type, b.stay, b.rooms);
    if (!this.inv.tryTake(b.type, newStay, b.rooms)) {
      this.inv.tryTake(b.type, b.stay, b.rooms);                   // put it back
      return false;
    }
    b.stay = newStay;
    b.charges = this.quote(b.type, newStay);
    return true;
  }

  /** The room NUMBER is decided HERE, not at booking time. */
  checkIn(id: string): string[] {
    const b = this.bookings.get(id);
    if (!b || b.status !== "CONFIRMED") return [];
    const pool = this.freeRooms.get(b.type) ?? [];
    for (let i = 0; i < b.rooms && pool.length; i++) b.assignedRooms.push(pool.shift()!);
    b.status = "CHECKED_IN";
    return b.assignedRooms;
  }

  get(id: string): Booking { return this.bookings.get(id)!; }
}

/* ================================================================ demo */
const aug = (d: number): Night => toNight(2026, 8, d);

function main(): void {
  const inv = new Inventory([
    { id: "STANDARD", name: "Standard", sleeps: 2, totalRooms: 6, overbookBuffer: 0 },
    { id: "DELUXE", name: "Deluxe", sleeps: 3, totalRooms: 3, overbookBuffer: 0 },
    { id: "SUITE", name: "Suite", sleeps: 4, totalRooms: 2, overbookBuffer: 0 },
  ]);

  const rooms: Room[] = [];
  for (let i = 1; i <= 6; i++) rooms.push({ number: "30" + i, type: "STANDARD" });
  for (let i = 1; i <= 3; i++) rooms.push({ number: "40" + i, type: "DELUXE" });
  for (let i = 1; i <= 2; i++) rooms.push({ number: "50" + i, type: "SUITE" });

  const weekday: Record<RoomTypeId, number> = { STANDARD: 400000, DELUXE: 650000, SUITE: 1200000 };
  const seasonal = new SeasonalRatePlan(weekday, new Set([aug(14), aug(15)]));
  const flat = new FlatRatePlan(weekday);
  const svc = new BookingService(inv, seasonal, new FlexiblePolicy(), rooms);

  const s1215 = new Stay(aug(12), aug(15));

  console.log("=== 0. half-open intervals =====================================");
  console.log("Stay(12,15).nights()          =", s1215.nights(), "  <- three, not four");
  const a = new Stay(aug(12), aug(14)), b = new Stay(aug(14), aug(16));
  console.log("overlaps(12->14, 14->16)      =", a.overlaps(b), "  <- checkout day is free");
  console.log("overlapsBuggy(same, with <=)  =", a.overlapsBuggy(b), "  <- the off-by-one");

  console.log("\\n=== 1. search ==================================================");
  console.log("search(12->15, guests=2)      =", svc.search(s1215, 2, 1));

  console.log("\\n=== 2. per-night pricing =======================================");
  const flatTotal = s1215.nightList().reduce((s, n) => s + flat.rateFor("DELUXE", n), 0);
  const aarti = svc.book("aarti", "DELUXE", s1215, 1, 0)!;
  console.log("Aarti books a Deluxe " + s1215 + " ->", aarti.id);
  console.log(aarti.breakdown());
  console.log("      flat x nights would be   =", fmt(flatTotal),
    "  (short by " + fmt(aarti.total() - flatTotal) + ")");

  console.log("\\n=== 3. all-or-nothing ==========================================");
  svc.book("house", "DELUXE", new Stay(aug(13), aug(14)), 2, 0);      // night 13 -> 0 free
  console.log("before:", inv.gridLine("DELUXE", aug(11), 6));
  const ravi = svc.book("ravi", "DELUXE", new Stay(aug(11), aug(16)), 1, 0);
  console.log("Ravi books Deluxe 11->16      ->", ravi ? ravi.id : "SOLD OUT");
  console.log("after :", inv.gridLine("DELUXE", aug(11), 6), "  <- identical");

  console.log("\\n=== 4. one-pass leak (the bug) =================================");
  console.log("before:", inv.gridLine("DELUXE", aug(11), 6));
  const ok = inv.tryTakeOnePassBuggy("DELUXE", new Stay(aug(11), aug(16)), 1);
  console.log("one-pass take 11->16          ->", ok ? "ok" : "FAILED");
  console.log("after :", inv.gridLine("DELUXE", aug(11), 6), "  <- night 11 LEAKED");
  inv.release("DELUXE", new Stay(aug(11), aug(12)), 1);

  console.log("\\n=== 5. the changeover day ======================================");
  svc.book("house", "SUITE", new Stay(aug(12), aug(18)), 1, 0);        // 1 suite left
  const x = svc.book("meera", "SUITE", new Stay(aug(12), aug(14)), 1, 0);
  const y = svc.book("kabir", "SUITE", new Stay(aug(14), aug(16)), 1, 0);
  console.log("only 1 Suite left. 12->14 =", x ? "CONFIRMED" : "sold out",
    ", 14->16 =", y ? "CONFIRMED" : "sold out", "  <- both, sharing 14 Aug");

  console.log("\\n=== 6. two guests, one last room ===============================");
  svc.book("house", "STANDARD", new Stay(aug(17), aug(18)), 5, 0);     // 1 Standard left
  const night17 = new Stay(aug(17), aug(18));
  const r1 = svc.book("guestA", "STANDARD", night17, 1, 0);
  const r2 = svc.book("guestB", "STANDARD", night17, 1, 0);
  console.log("two bookings, one room        ->",
    r1 ? "CONFIRMED " + r1.id : "sold out", "|", r2 ? "CONFIRMED " + r2.id : "sold out");
  console.log("free on 17 Aug                = ", inv.freeOn("STANDARD", aug(17)));
  inv.assertInvariant();
  console.log("invariant 0 <= booked <= capacity: HOLDS");

  console.log("\\n=== 7. cancellation ============================================");
  console.log("before:", inv.gridLine("DELUXE", aug(11), 6));
  const refund = svc.cancel(aarti.id, 36);                             // 36h before check-in
  console.log("refund                        = ", fmt(refund), "  (one night kept)");
  console.log("after :", inv.gridLine("DELUXE", aug(11), 6), "  <- 3 cells back up");

  console.log("\\n=== 8. moving the dates can fail ===============================");
  const moved = svc.modifyDates(x!.id, new Stay(aug(13), aug(15)));
  console.log("move Meera's suite to 13->15  ->", moved ? "moved" : "REFUSED, original intact");
  console.log("Meera still holds             = ", String(svc.get(x!.id).stay));

  console.log("\\n=== 9. the room number is a CHECK-IN decision ==================");
  console.log("Kabir checks in               -> room", svc.checkIn(y!.id));
  inv.assertInvariant();
}

main();`,
      },
    ],

    // ==================================================================
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Take the hotel away and what is left is **a pool of interchangeable units, reserved over a contiguous range of time slots**. Once you can see that shape, the same four moves apply everywhere: half-open ranges, one counter per slot, availability as the *minimum* across the range, and a check-all-then-take-all that is atomic as a unit.",
      },
      {
        type: "ul",
        items: [
          "**Airline and train seat inventory** — seats in a fare class across a set of flight legs. Booking a connecting itinerary is the same all-or-nothing take across several legs, and airlines overbook for exactly the reason hotels do.",
          "**Cloud capacity and reserved instances** — N identical machines held for a window. The counter is per instance type per hour, and the *minimum across the window* is the same query.",
          "**Equipment, vehicle and tool rental** — twelve identical drills, booked from Tuesday to Friday. The half-open interval matters just as much: the day it comes back is the day it goes out again.",
          "**Course, class and clinic scheduling** — thirty identical seats per session, and a multi-session enrolment that must land completely or not at all.",
          "**Warehouse slotting and dock scheduling** — a fixed number of interchangeable bays, reserved over an arrival window.",
          "**Any quota over time** — API tokens per minute, licences per day, delivery slots per hour. Distinct from [[rate-limiter]], which counts a *rolling* window rather than reserving future ones.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The 30-second version to say out loud",
        text: "*“Availability is a function of room type and a date range, not a flag on a room. I keep one counter per (room type, night) and compute availability across a stay as the minimum across its nights. Ranges are half-open, so 12→15 is three nights and a checkout day is immediately re-sellable. Booking checks every night before taking any night, under locks taken in sorted date order on just the nights involved. Price is summed per night from a RatePlan and frozen onto the booking in integer paise. Cancellation is a policy object that returns a refund; releasing the nights is the same code path every time. The actual room number is assigned at check-in.”*",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When the units stop being interchangeable.** The instant a guest can request room 402 specifically — a sea view, an accessible bathroom, adjoining rooms for a family — a count is not enough. Either promote the distinction to its own room type, or switch to per-room interval lists and accept the cost.",
          "**When bookings must survive a crash.** An in-memory map plus a process-local lock becomes a database row plus a transaction. The check-and-take turns into a conditional `UPDATE` per night, and `book()` needs an idempotency key so a retried request cannot double-decrement.",
          "**When there are ten servers.** Process-local `ReentrantLock`s guard nothing across machines. The counters have to live where the atomicity lives — a database with a uniqueness or check constraint, or a single-writer partition per (hotel, night).",
          "**When the calendar horizon is large.** A cell per type per night is cheap for one hotel and a year; it is not cheap for a million properties and a two-year horizon. Real systems store *bookings* and materialise nightly counters only for the hot window, rebuilding the rest on demand.",
          "**When pricing becomes dynamic.** `rateFor(type, night)` assumes the rate for a night is knowable independently. Yield management prices the *whole itinerary* — length of stay, lead time, current occupancy — so the interface has to widen to take the stay, and the moment it does, the frozen breakdown becomes even more important, not less.",
          "**When holds and payment enter.** A real checkout holds inventory for ten minutes while a card is charged. That is an inventory entry with a TTL and a sweeper, plus a state machine on the booking — and now the *hold* is the contended resource, not the booking.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Availability is a question about a range, and the answer is a count per night.** Write `Stay` with a half-open `[checkIn, checkOut)` and an `overlaps()` that uses strict `<` on both sides; write `Inventory` with one counter per (type, night) and a `tryTake` that checks every night before it touches any night. Those two classes are eighty percent of the grade, and everything else in this lesson hangs off them.",
      },
    ],

    // ==================================================================
    tradeoffs: {
      pros: [
        "A counter per (room type, night) answers availability in O(nights) regardless of how many physical rooms exist — a hundred identical Deluxe rooms cost exactly the same as three.",
        "Half-open [checkIn, checkOut) intervals make the changeover day correct by construction, so a room becomes re-sellable the morning it is vacated without a single special case.",
        "The two-pass take makes a partial multi-night booking unrepresentable: either every night is decremented or none is, so the inventory can never hold a room for a booking that does not exist.",
        "Locking only the nights a stay touches, in sorted date order, keeps the critical section to a handful of integer operations while remaining deadlock-free for overlapping stays.",
        "Deferring the room number to check-in means maintenance closures, upgrades and stay extensions never require moving a guest between rooms, and it lets overbooking be a single number on RoomType.",
        "Per-night charges frozen on the booking mean a later price change cannot rewrite an agreed bill, and the refund calculation always matches the confirmation the guest received.",
      ],
      cons: [
        "Counts cannot express a request for a specific room, so anything a guest can actually ask for — sea view, accessible, adjoining — has to become its own room type or force a different model entirely.",
        "The nightly grid grows with room types multiplied by the booking horizon, which is fine for one hotel and wasteful for a marketplace with millions of properties and a two-year window.",
        "Process-local night locks are worthless across servers; the correctness argument has to be rebuilt around database constraints the moment there is a second process.",
        "Overbooking makes the counters deliberately able to exceed physical rooms, so “sold out” and “actually full” are different questions and someone has to own the walk-in policy when the gamble loses.",
        "Freezing the per-night breakdown duplicates pricing data on every booking, so a genuine pricing error has to be corrected by an explicit adjustment rather than by fixing the rate plan.",
        "Availability from search is advisory and can go stale between the search and the booking, which is correct but produces a user experience that needs explaining rather than fixing.",
      ],
    },

    // ==================================================================
    furtherReading: [
      {
        label: "awesome-low-level-design — Hotel Management System",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/hotel-management-system.md",
        kind: "article",
        note: "The canonical write-up of this exact interview problem, with the entity list most interviewers already have in their head before you start.",
      },
      {
        label: "Allen's interval algebra",
        href: "https://en.wikipedia.org/wiki/Allen%27s_interval_algebra",
        kind: "article",
        note: "The formal enumeration of the thirteen ways two intervals can relate. Worth reading once, so you can say with confidence that the four overlapping cases collapse into a single expression.",
      },
      {
        label: "Martin Fowler — Range and Temporal Patterns",
        href: "https://martinfowler.com/eaaDev/timeNarrative.html",
        kind: "article",
        note: "Fowler on modelling time properly: ranges as value objects, half-open by convention, and why “effective dating” shows up in every serious domain model.",
      },
      {
        label: "PostgreSQL — range types and exclusion constraints",
        href: "https://www.postgresql.org/docs/current/rangetypes.html",
        kind: "docs",
        note: "The production answer to the last-room race. A daterange column plus an EXCLUDE constraint makes an overlapping booking impossible at the database level — and the docs spell out the half-open default.",
      },
      {
        label: "Martin Fowler — Money",
        href: "https://martinfowler.com/eaaCatalog/money.html",
        kind: "article",
        note: "Why a rate is a value object holding an integer of the smallest unit plus a currency. Read it before you type double anywhere near a nightly rate.",
      },
      {
        label: "Designing Data-Intensive Applications — Martin Kleppmann",
        kind: "book",
        note: "Chapter 7 on transactions and write skew is exactly the last-room race, one abstraction level up: two readers, one decision each, and a constraint that neither transaction can see the other breaking.",
      },
      {
        label: "Java — java.time.LocalDate and Temporal API",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html",
        kind: "docs",
        note: "Use isBefore and isAfter rather than compareTo, and note that ChronoUnit.DAYS.between is exactly the half-open night count you want.",
      },
      {
        label: "Revenue management and overbooking — an overview",
        href: "https://en.wikipedia.org/wiki/Yield_management",
        kind: "article",
        note: "Why hotels and airlines deliberately sell more rooms than they have. Useful for one confident sentence when the interviewer asks whether overbooking is a bug.",
      },
    ],

    // ==================================================================
    quiz: [
      {
        id: "hotel-booking-q1",
        question: "A candidate opens with `class Room { boolean isBooked; }`. What is the fundamental problem?",
        options: [
          { id: "a", label: "Availability is a function of (roomType, checkIn, checkOut) — a single boolean cannot distinguish between three different date ranges, so it answers “taken forever” after one booking." },
          { id: "b", label: "Booleans are slower than integers when there are many rooms." },
          { id: "c", label: "It works, but you would need one boolean per room instead of one per room type." },
          { id: "d", label: "Nothing, as long as you also store the current guest's name on the room." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) is the tempting near-miss: it sounds like a sizing problem when it is actually a *dimensionality* problem. The boolean has no date axis at all, so no amount of adding more booleans recovers the information. Availability must be a function of a range, which is why the answer is a counter per (room type, night).",
      },
      {
        id: "hotel-booking-q2",
        question: "Which single expression correctly detects that two stays clash, given half-open ranges?",
        options: [
          { id: "a", label: "aStart < bEnd && bStart < aEnd" },
          { id: "b", label: "aStart <= bEnd && bStart <= aEnd" },
          { id: "c", label: "aStart < bStart && aEnd < bEnd" },
          { id: "d", label: "Four separate branches: a inside b, b inside a, a contains b, b contains a." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is what most people write first and it is where the bug hides — one of the four branches always gets an inequality backwards. (b) is the off-by-one: it makes touching ranges count as a clash, so a guest checking out on Tuesday blocks the guest checking in on Tuesday. Containment needs no branch of its own; “each starts before the other ends” already covers it.",
      },
      {
        id: "hotel-booking-q3",
        question: "Stay(12 Aug, 15 Aug). How many nights, and which ones?",
        options: [
          { id: "a", label: "Three: 12, 13 and 14 — the checkout day is not a night, because the guest leaves that morning." },
          { id: "b", label: "Four: 12, 13, 14 and 15 — you occupy the room on all four calendar days." },
          { id: "c", label: "Three: 13, 14 and 15 — the first night is the arrival buffer." },
          { id: "d", label: "It depends on the hotel's check-in and check-out times." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is the bug that makes changeover days unsellable, and the loop that produces it is `for (d = checkIn; !d.isAfter(checkOut); ...)`. Write `d.isBefore(checkOut)` instead. (d) is a nice-sounding dodge: check-in and check-out *times* are an operational detail, but the night count is fixed by the half-open convention.",
      },
      {
        id: "hotel-booking-q4",
        question: "Why decrement a per-night count for a room *type* instead of marking a specific room as taken for those dates?",
        options: [
          { id: "a", label: "Because guests book “a Deluxe”, the rooms in a type are interchangeable, and deferring the room number to check-in survives maintenance closures, upgrades and stay extensions." },
          { id: "b", label: "Because a specific room can only ever hold one booking in its lifetime." },
          { id: "c", label: "Because counts are the only structure that can express an overlap test." },
          { id: "d", label: "Because assigning rooms at booking time is impossible to implement." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) overstates it — assigning at booking time is perfectly implementable and it is the right model for villas or apartments where every unit is different. The reason to prefer counts for a hotel is that the units are *interchangeable*, so committing to room 402 in advance buys you nothing and costs you a reshuffle every time a room goes out of service.",
      },
      {
        id: "hotel-booking-q5",
        question: "A three-night booking is being made. Night 2 turns out to be full. What must be true of your implementation?",
        options: [
          { id: "a", label: "Pass 1 checked all three nights before any write happened, so the failure leaves the inventory byte-for-byte unchanged." },
          { id: "b", label: "Night 1 was already decremented, so you subtract it back inside a catch block." },
          { id: "c", label: "The booking is created as PARTIAL and the guest is offered the two nights that were available." },
          { id: "d", label: "The check is unnecessary — the counter can simply be allowed to go negative and be reconciled later." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is the plausible-sounding fix that quietly reintroduces the bug: if the compensating subtraction is skipped by an early return, an exception, or a second failure, the room is leaked forever. Two passes make the failure path do *nothing at all*, which is the only version with no cleanup to forget. Same shape as the two-pass ingredient consume in the coffee machine.",
      },
      {
        id: "hotel-booking-q6",
        question: "Two guests take the last Deluxe room for the same nights at the same instant. What is the right guard?",
        options: [
          { id: "a", label: "Make check-and-take atomic on the nightly counters the stay touches, taking the night locks in sorted date order." },
          { id: "b", label: "Synchronize the entire Hotel object so no two bookings can ever interleave." },
          { id: "c", label: "Let both bookings succeed and run a nightly reconciliation job that cancels one of them." },
          { id: "d", label: "Retry the losing request until a room becomes free." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is correct but it is a red flag: it says you did not identify what is actually contended, and it serialises bookings for completely unrelated dates and room types. Sorted lock order matters because two stays can share *some* nights — 12→15 and 14→17 both need 14 Aug — and without a global ordering they can deadlock waiting on each other.",
      },
      {
        id: "hotel-booking-q7",
        question: "A guest stays three nights: two weekdays and one festival night. How is the total computed and stored?",
        options: [
          { id: "a", label: "Sum rateFor(type, night) over each night, and freeze the resulting per-night charges on the booking in integer paise." },
          { id: "b", label: "Multiply the room type's nightly rate by the number of nights, and recompute it whenever the bill is displayed." },
          { id: "c", label: "Take the average of the nightly rates and multiply by the number of nights." },
          { id: "d", label: "Store only the total as a double, since the breakdown can always be recomputed from the rate plan." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is the subtle one and it fails twice: doubles drift, and “recompute from the rate plan” means tomorrow's price change silently rewrites a bill the guest already agreed to — so the refund three days later disagrees with the confirmation email. Freezing the breakdown also answers “why is my bill this much?” without any extra work.",
      },
      {
        id: "hotel-booking-q8",
        question: "The interviewer asks you to let a guest move an existing booking to different dates. What is the correct answer?",
        options: [
          { id: "a", label: "It is a cancel plus a rebook against the counters, and it can fail — release the old nights, try to take the new ones, and if that fails put the old nights back and keep the original booking." },
          { id: "b", label: "Just overwrite the checkIn and checkOut fields on the booking; the counters catch up on the next read." },
          { id: "c", label: "Take the new nights first and only release the old ones if the guest confirms by email." },
          { id: "d", label: "Refuse all date changes — that is what cancellation is for." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is the trap: the counters are the source of truth for availability, so mutating the dates without moving the counts leaves the old nights held forever and the new nights oversold. The rollback in (a) is the same all-or-nothing thinking as the two-pass take, applied one level up — and saying “this operation can fail” out loud is most of the credit.",
      },
    ],
  },
};
