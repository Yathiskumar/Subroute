import type { RoadmapLesson } from "@/lib/content/types";

export const bookmyshow: RoadmapLesson = {
  title: "BookMyShow",
  oneLiner:
    "Two people tap the same seat in the same second. Exactly one of them may have it, and the loser has to find out *immediately* — not after paying. The seat they are fighting over is not `A12`; it is **`A12 at the 6:00 PM show`**, and that one noun is the most-missed modelling insight in this entire interview.",
  difficulty: "advanced",
  estimatedTime: "45 min",
  prototypePath: "/prototypes/lld/bookmyshow.html",
  content: {
    prototypeCaption:
      "A live seat map for one 6:00 PM show, driven by two users. Press **⚔️ Both click A5** while the toggle reads **🔒 Guarded** — one compare-and-set wins, the loser's card shakes red and is told in the same millisecond. Now flip to **🔓 Unguarded** and press it again: *both* users are told “confirmed”, and the red `⚠ double-booked: 1` counter appears. Then hold a few seats as **👤 U1**, press **⏳ Let the hold expire** to watch them snap back to available, and switch **🎟 Flat** / **🪜 Tier × time** to re-price the same selection with zero caller changes.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design a movie ticket booking system like BookMyShow.”* That is the whole prompt. Most candidates hear it and start listing screens, movies, cities and reviews.",
      },
      {
        type: "p",
        text: "The interviewer is not shopping for a catalogue. They are shopping for **one seat, two people, one second**. Everything else on the page — the movies, the theatres, the search — is scaffolding around a single contended resource that two strangers are allowed to reach for at exactly the same moment.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole lesson in one line",
        text: "**Two people click the same seat in the same second. Exactly one of them may get it — and the loser must find out immediately, not after paying.** That splits into two ideas: the thing you book is a **`ShowSeat`**, not a `Seat`; and taking it is an **atomic compare-and-set on that one seat**, never a lock around the theatre.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 760 384" width="100%" style="max-width:730px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A cinema hall drawn as a screen bar with five rows of eight seats, coloured silver, gold and recliner by tier, with one person sitting in it. Every noun in the scene is labelled with the class that represents it: the room is a Screen, an individual chair is a Seat which is furniture and never has a status, the six o'clock listing is a Show made of a Movie times a Screen times a start time, the highlighted chair at this particular show is a ShowSeat which is where status and price live, the person is a User, and the printed stub on the right is a Booking. A footnote says the nine o'clock show reuses the same screen and the same seats and gets its own forty ShowSeats.">
  <defs>
    <marker id="bms-scene-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <rect x="186" y="44" width="384" height="300" rx="14" fill="none" stroke="#3a414c" stroke-width="1.4"/>
  <text x="200" y="66" font-size="9.5" fill="#6b7280">Screen 2 · “Dune” · today 6:00 PM</text>

  <rect x="218" y="76" width="320" height="13" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <text x="378" y="86" font-size="7.5" text-anchor="middle" fill="#6b7280">SCREEN</text>

  <text x="198" y="123" font-size="9" fill="#6b7280">A</text>
  <rect x="214" y="108" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="250" y="108" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="286" y="108" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="322" y="108" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="358" y="108" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="394" y="108" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="430" y="108" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="466" y="108" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>

  <text x="198" y="157" font-size="9" fill="#6b7280">B</text>
  <rect x="214" y="142" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="250" y="142" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="286" y="142" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="322" y="142" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="358" y="142" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="394" y="142" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="430" y="142" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>
  <rect x="466" y="142" width="28" height="22" rx="4" fill="#14161a" stroke="#7d8695"/>

  <text x="198" y="191" font-size="9" fill="#6b7280">C</text>
  <rect x="214" y="176" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="250" y="176" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="286" y="176" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="322" y="176" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="358" y="176" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="394" y="176" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="430" y="176" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="466" y="176" width="28" height="22" rx="4" fill="rgba(251,134,58,0.16)" stroke="#fb863a" stroke-width="1.6"/>
  <text x="480" y="191" font-size="8.5" text-anchor="middle" fill="#fb863a">C8</text>

  <text x="198" y="225" font-size="9" fill="#6b7280">D</text>
  <rect x="214" y="210" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="250" y="210" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="286" y="210" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="322" y="210" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="358" y="210" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="394" y="210" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="430" y="210" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>
  <rect x="466" y="210" width="28" height="22" rx="4" fill="#14161a" stroke="#d2a54a"/>

  <text x="198" y="259" font-size="9" fill="#6b7280">E</text>
  <rect x="214" y="244" width="28" height="22" rx="4" fill="#14161a" stroke="#9b7fd4"/>
  <rect x="250" y="244" width="28" height="22" rx="4" fill="#14161a" stroke="#9b7fd4"/>
  <rect x="286" y="244" width="28" height="22" rx="4" fill="#14161a" stroke="#9b7fd4"/>
  <rect x="322" y="244" width="28" height="22" rx="4" fill="#14161a" stroke="#9b7fd4"/>
  <rect x="358" y="244" width="28" height="22" rx="4" fill="#14161a" stroke="#9b7fd4"/>
  <rect x="394" y="244" width="28" height="22" rx="4" fill="#14161a" stroke="#9b7fd4"/>
  <rect x="430" y="244" width="28" height="22" rx="4" fill="#14161a" stroke="#9b7fd4"/>
  <rect x="466" y="244" width="28" height="22" rx="4" fill="#14161a" stroke="#9b7fd4"/>

  <text x="214" y="286" font-size="8.5" fill="#7d8695">▪ SILVER</text>
  <text x="290" y="286" font-size="8.5" fill="#d2a54a">▪ GOLD</text>
  <text x="356" y="286" font-size="8.5" fill="#9b7fd4">▪ RECLINER</text>

  <text x="334" y="322" font-size="24">🧑</text>

  <text x="16" y="84" font-size="11" fill="#fb863a">Screen</text>
  <text x="16" y="98" font-size="9" fill="#9099a8">the room — owns its Seats</text>
  <line x1="150" y1="88" x2="182" y2="80" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#bms-scene-lead)"/>

  <text x="16" y="170" font-size="11" fill="#fb863a">Seat</text>
  <text x="16" y="184" font-size="9" fill="#9099a8">C1 — furniture, bolted down</text>
  <text x="16" y="197" font-size="9" fill="#f06868">never has a status</text>
  <line x1="150" y1="176" x2="208" y2="184" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#bms-scene-lead)"/>

  <text x="16" y="306" font-size="11" fill="#fb863a">User</text>
  <text x="16" y="320" font-size="9" fill="#9099a8">id, name — nothing else</text>
  <line x1="90" y1="310" x2="328" y2="312" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#bms-scene-lead)"/>

  <text x="592" y="68" font-size="11" fill="#5e9ff6">Show</text>
  <text x="592" y="82" font-size="9" fill="#9099a8">Movie × Screen × 6:00 PM</text>
  <text x="592" y="95" font-size="9" fill="#9099a8">the thing you book against</text>
  <line x1="588" y1="64" x2="574" y2="54" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3"/>

  <text x="592" y="176" font-size="11" fill="#fb863a">ShowSeat</text>
  <text x="592" y="190" font-size="9" fill="#e8e4dc">C8 AT THIS SHOW</text>
  <text x="592" y="203" font-size="9" fill="#9099a8">status + price live here</text>
  <text x="592" y="216" font-size="9" fill="#9099a8">this is what you book</text>
  <line x1="588" y1="186" x2="500" y2="188" stroke="#fb863a" stroke-width="1.2" marker-end="url(#bms-scene-lead)"/>

  <text x="592" y="252" font-size="11" fill="#5cc66f">Booking</text>
  <rect x="592" y="262" width="152" height="72" rx="7" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="604" y="282" font-size="9" fill="#e8e4dc">BK-1041</text>
  <text x="604" y="300" font-size="9" fill="#9099a8">Aditi · C6 C7 C8</text>
  <text x="604" y="318" font-size="9" fill="#5cc66f">₹975.00 · CONFIRMED</text>
  <line x1="588" y1="292" x2="372" y2="306" stroke="#5cc66f" stroke-width="1" stroke-dasharray="3 3"/>

  <text x="16" y="368" font-size="9" fill="#6b7280">the 9:00 PM show reuses the same Screen and the same 40 Seats — and gets its own 40 ShowSeats</text>
</svg>`,
        caption:
          "Read the two orange labels on the left and the right. **`Seat` is furniture. `ShowSeat` is furniture-at-a-time.** Everything hard in this problem happens because beginners collapse those two into one class.",
      },
      {
        type: "p",
        text: "Here is what that collapse costs you. Put a boolean on the seat — `Seat { id, isBooked }` — and it works beautifully for exactly one show. Then the interviewer asks for the 9:00 PM listing, and *“is C8 free?”* becomes a question your model cannot answer, because C8 is taken at 6:00 and empty at 9:00, and there is only one C8 object in memory.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 330" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, the wrong model: one Seat object for C8 carrying an isBooked boolean, with both the six o'clock show and the nine o'clock show pointing at that same object, so booking it at six also marks it booked at nine, shown in red. On the right, the correct model: each Show materialises one ShowSeat per Seat, so ShowSeat C8 at six o'clock is BOOKED at three hundred and twenty five rupees while ShowSeat C8 at nine o'clock is still AVAILABLE at three hundred and seventy five rupees, and both merely reference the one shared Seat C8 which stays pure furniture.">
  <defs>
    <marker id="bms-model-bad" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
    <marker id="bms-model-ok" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="bms-model-ref" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#6b7280"/></marker>
  </defs>

  <text x="18" y="22" font-size="10.5" fill="#f06868">✗ the model almost everyone writes first</text>
  <rect x="18" y="32" width="336" height="278" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>

  <rect x="38" y="50" width="128" height="42" rx="6" fill="#1a1d22" stroke="#2d333d"/>
  <text x="52" y="68" font-size="9.5" fill="#e8e4dc">Show 6:00 PM</text>
  <text x="52" y="84" font-size="8.5" fill="#6b7280">screen.seats</text>

  <rect x="206" y="50" width="128" height="42" rx="6" fill="#1a1d22" stroke="#2d333d"/>
  <text x="220" y="68" font-size="9.5" fill="#e8e4dc">Show 9:00 PM</text>
  <text x="220" y="84" font-size="8.5" fill="#6b7280">screen.seats</text>

  <line x1="102" y1="92" x2="150" y2="140" stroke="#f06868" stroke-width="1.1" marker-end="url(#bms-model-bad)"/>
  <line x1="270" y1="92" x2="222" y2="140" stroke="#f06868" stroke-width="1.1" marker-end="url(#bms-model-bad)"/>

  <rect x="112" y="146" width="148" height="66" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.55)"/>
  <text x="126" y="166" font-size="10" fill="#e8e4dc">Seat C8</text>
  <line x1="112" y1="174" x2="260" y2="174" stroke="#2d333d"/>
  <text x="126" y="190" font-size="9.5" fill="#f06868">isBooked = true</text>
  <text x="126" y="205" font-size="8.5" fill="#6b7280">one object · one boolean</text>

  <text x="38" y="238" font-size="9.5" fill="#e8e4dc">book C8 at 6 PM  →  isBooked = true</text>
  <text x="38" y="256" font-size="9.5" fill="#f06868">C8 at 9 PM is now “sold” too</text>
  <text x="38" y="278" font-size="9" fill="#9099a8">and there is nowhere to put the price,</text>
  <text x="38" y="292" font-size="9" fill="#9099a8">which differs between the two shows</text>

  <text x="386" y="22" font-size="10.5" fill="#5cc66f">✓ the model the round is graded on</text>
  <rect x="386" y="32" width="336" height="278" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <rect x="404" y="50" width="140" height="42" rx="6" fill="#1a1d22" stroke="#2d333d"/>
  <text x="418" y="68" font-size="9.5" fill="#e8e4dc">Show 6:00 PM</text>
  <text x="418" y="84" font-size="8.5" fill="#6b7280">materialise() ×40</text>

  <rect x="562" y="50" width="140" height="42" rx="6" fill="#1a1d22" stroke="#2d333d"/>
  <text x="576" y="68" font-size="9.5" fill="#e8e4dc">Show 9:00 PM</text>
  <text x="576" y="84" font-size="8.5" fill="#6b7280">materialise() ×40</text>

  <line x1="474" y1="92" x2="474" y2="112" stroke="#5cc66f" stroke-width="1.1" marker-end="url(#bms-model-ok)"/>
  <line x1="632" y1="92" x2="632" y2="112" stroke="#5cc66f" stroke-width="1.1" marker-end="url(#bms-model-ok)"/>

  <rect x="404" y="118" width="140" height="76" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="416" y="136" font-size="9" fill="#fb863a">ShowSeat</text>
  <text x="416" y="152" font-size="9.5" fill="#e8e4dc">C8 @ 6:00 PM</text>
  <text x="416" y="168" font-size="9.5" fill="#f06868">BOOKED</text>
  <text x="416" y="184" font-size="9" fill="#9099a8">32500 paise</text>

  <rect x="562" y="118" width="140" height="76" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="574" y="136" font-size="9" fill="#fb863a">ShowSeat</text>
  <text x="574" y="152" font-size="9.5" fill="#e8e4dc">C8 @ 9:00 PM</text>
  <text x="574" y="168" font-size="9.5" fill="#5cc66f">AVAILABLE</text>
  <text x="574" y="184" font-size="9" fill="#9099a8">37500 paise</text>

  <line x1="474" y1="194" x2="512" y2="228" stroke="#6b7280" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#bms-model-ref)"/>
  <line x1="632" y1="194" x2="594" y2="228" stroke="#6b7280" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#bms-model-ref)"/>

  <rect x="480" y="234" width="148" height="50" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="494" y="252" font-size="10" fill="#e8e4dc">Seat C8</text>
  <text x="494" y="270" font-size="8.5" fill="#6b7280">row, number, tier — that is all</text>

  <text x="404" y="302" font-size="9" fill="#5cc66f">status and price live per show. the chair stays pure furniture.</text>
</svg>`,
        caption:
          "The fix is one word long: **materialise**. When a `Show` is created, it makes one `ShowSeat` per `Seat` in the `Screen`. Status lives there. Price lives there. The `Seat` never changes again.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Did you find `ShowSeat`?** A `Seat` with a boolean on it is the single most common way this round is failed, and it fails silently — the design looks fine until the second show exists.",
          "**Is taking a seat atomic on the seat itself?** A compare-and-set from `AVAILABLE` to `HELD`, on that one row. Not a `synchronized` method on `BookingService`, which serialises every seat click in the country through one lock.",
          "**Is there a hold with an expiry?** `AVAILABLE → HELD → BOOKED`, plus `HELD → AVAILABLE` when the timer runs out. No expiry means one abandoned checkout kills that seat forever.",
          "**Is payment outside the transaction, and is confirm idempotent?** Payment is slow, external, and retries. A duplicate webhook must not book the seat twice or charge the card twice.",
          "**Is selecting three seats all-or-nothing, in a canonical order?** Partial success is worse than failure, and unordered acquisition is a textbook deadlock ([[deadlock-race-starvation]]).",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The sentence that separates the top 10% in this round",
        text: "*“I will not lock the show. I will compare-and-set the individual `ShowSeat` row from `AVAILABLE` to `HELD`, and the loser gets `false` back synchronously.”* Say it in minute six, while you are still drawing boxes. Everything after that is easier because the interviewer already knows you understand the problem.",
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- clarify ----------
      { type: "h", text: "Step 1 · Clarify — 6 minutes" },
      {
        type: "p",
        text: "The prompt is one sentence, so the first six minutes are yours to shape. Ask these, and ask them in this order — the first two decide the entire design ([[five-step-framework]]).",
      },
      {
        type: "ul",
        items: [
          "**Is one movie shown at several times in the same hall?** — yes. Say it out loud, because this is the question that forces `Show` into existence and kills `seat.isBooked` before you ever type it.",
          "**When I pick a seat, is it mine while I pay?** — yes, for a few minutes. That single answer buys you the whole `HELD` state, the TTL, and the release-on-failure path. If you do not ask it, you will design a system where the seat is only taken *after* payment succeeds, and two people will pay for it.",
          "**How long is the hold?** — 5 to 10 minutes in the real product. Pick 7 and make it a constant, not a magic number.",
          "**Can one booking span several seats?** — yes, and it must be all-or-nothing. Nobody wants two of the three seats they asked for.",
          "**Do different seats cost different amounts?** — yes: Silver, Gold, Recliner, and evening shows cost more than matinees. That is a `PricingStrategy`, not a chain of `if`s ([[strategy]]).",
          "**Single process or a cluster?** — assume a single process for the 90 minutes, and say *“the atomic seat update becomes a conditional `UPDATE` on the seat row when this is ten servers”*. That one sentence banks the distributed answer without spending time on it.",
          "**Search, reviews, food ordering, offers, seat-map rendering, real payments?** — out of scope, in one sentence each.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 250" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A two column scope board for the round. In scope: movies theatres screens and seats, shows as movie times screen times start time, one ShowSeat materialised per seat per show, an atomic hold with a time to live, all-or-nothing multi seat selection, confirm with idempotency, a pricing strategy in integer paise, and cancellation. Out of scope: search and recommendations, real payment gateway integration, user login, seat map rendering, food ordering and offers, reviews and ratings, and persistence or schema design.">
  <text x="18" y="22" font-size="10.5" fill="#5cc66f">✓ IN — build these, in this order</text>
  <rect x="18" y="32" width="328" height="200" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="36" y="56" font-size="10" fill="#e8e4dc">Movie · Theatre · Screen · Seat</text>
  <text x="36" y="78" font-size="10" fill="#e8e4dc">Show = Movie × Screen × startsAt</text>
  <text x="36" y="100" font-size="10" fill="#fb863a">ShowSeat — one per Seat per Show</text>
  <text x="36" y="122" font-size="10" fill="#fb863a">tryHold: atomic CAS + TTL expiry</text>
  <text x="36" y="144" font-size="10" fill="#e8e4dc">selectSeats — all-or-nothing, sorted</text>
  <text x="36" y="166" font-size="10" fill="#fb863a">confirm — idempotent, after payment</text>
  <text x="36" y="188" font-size="10" fill="#e8e4dc">PricingStrategy, money in paise</text>
  <text x="36" y="210" font-size="10" fill="#e8e4dc">cancel + refund window</text>
  <text x="36" y="226" font-size="9" fill="#6b7280">and a sweeper that returns dead holds</text>

  <text x="374" y="22" font-size="10.5" fill="#f06868">✗ OUT — one sentence each</text>
  <rect x="374" y="32" width="328" height="200" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="392" y="56" font-size="10" fill="#9099a8">search, city browse, recommendations</text>
  <text x="392" y="78" font-size="10" fill="#9099a8">a real payment gateway — stub it</text>
  <text x="392" y="100" font-size="10" fill="#9099a8">login, OTP, sessions</text>
  <text x="392" y="122" font-size="10" fill="#9099a8">rendering the seat map in a browser</text>
  <text x="392" y="144" font-size="10" fill="#9099a8">food, offers, coupons, loyalty points</text>
  <text x="392" y="166" font-size="10" fill="#9099a8">reviews, ratings, trailers</text>
  <text x="392" y="188" font-size="10" fill="#9099a8">persistence and schema design</text>
  <line x1="392" y1="200" x2="686" y2="200" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="392" y="218" font-size="9" fill="#6b7280">“the gateway is an interface with one fake</text>
  <text x="392" y="230" font-size="9" fill="#6b7280">implementation” is a complete answer.</text>
</svg>`,
        caption:
          "Everything orange on the left is what the round is actually about. If you are at minute 45 and the orange rows are not working, cut a grey one — not an orange one.",
      },

      // ---------- entities ----------
      { type: "h", text: "Step 2 · Nouns → classes, and the one nobody says out loud" },
      {
        type: "p",
        text: "Read the prompt back and underline the nouns: *movie, theatre, screen, seat, show, ticket, user*. Six of those map to a class in the obvious way. The seventh — the one that is **not** in the prompt — is the one you have to invent.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 356" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A three column mapping table from the nouns in the prompt to classes and what each class owns. Movie maps to Movie holding title, language and runtime. Theatre maps to Theatre holding a name, a city and its screens. Hall or audi maps to Screen holding its seats. Seat maps to Seat holding row, number and tier and explicitly no status. Showtime maps to Show holding movie, screen and start time. The row that is not in the prompt is ShowSeat, highlighted in orange, holding status, held by, expires at, booking id and price in paise, and described as the bookable unit. Ticket maps to Booking holding user, show, the show seat ids, the amount and a status. Person maps to User holding an id and a name.">
  <text x="18" y="22" font-size="10.5" fill="#9099a8">the nouns you underline, and what each one becomes</text>

  <rect x="18" y="32" width="684" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="50" font-size="9" fill="#6b7280">noun in the prompt</text>
  <text x="212" y="50" font-size="9" fill="#6b7280">class</text>
  <text x="336" y="50" font-size="9" fill="#6b7280">what it owns</text>

  <rect x="18" y="62" width="684" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="80" font-size="9.5" fill="#e8e4dc">“movie”</text>
  <text x="212" y="80" font-size="9.5" fill="#5e9ff6">Movie</text>
  <text x="336" y="80" font-size="9.5" fill="#9099a8">title, language, runtime — no seats, no times</text>

  <rect x="18" y="94" width="684" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="112" font-size="9.5" fill="#e8e4dc">“theatre”, “multiplex”</text>
  <text x="212" y="112" font-size="9.5" fill="#5e9ff6">Theatre</text>
  <text x="336" y="112" font-size="9.5" fill="#9099a8">name, city, its Screens</text>

  <rect x="18" y="126" width="684" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="144" font-size="9.5" fill="#e8e4dc">“hall”, “audi”, “screen”</text>
  <text x="212" y="144" font-size="9.5" fill="#5e9ff6">Screen</text>
  <text x="336" y="144" font-size="9.5" fill="#9099a8">its fixed list of Seats — the physical room</text>

  <rect x="18" y="158" width="684" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="176" font-size="9.5" fill="#e8e4dc">“seat”</text>
  <text x="212" y="176" font-size="9.5" fill="#5e9ff6">Seat</text>
  <text x="336" y="176" font-size="9.5" fill="#9099a8">row, number, tier — and deliberately NO status</text>

  <rect x="18" y="190" width="684" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="208" font-size="9.5" fill="#e8e4dc">“showtime”, “6 PM show”</text>
  <text x="212" y="208" font-size="9.5" fill="#5e9ff6">Show</text>
  <text x="336" y="208" font-size="9.5" fill="#9099a8">movie × screen × startsAt — the bookable event</text>

  <rect x="18" y="222" width="684" height="34" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="236" font-size="9.5" fill="#fb863a">— NOT IN THE PROMPT —</text>
  <text x="34" y="250" font-size="8.5" fill="#9099a8">you have to invent it</text>
  <text x="212" y="243" font-size="10" fill="#fb863a">ShowSeat</text>
  <text x="336" y="236" font-size="9.5" fill="#e8e4dc">status · heldBy · expiresAt · bookingId · pricePaise</text>
  <text x="336" y="250" font-size="8.5" fill="#fb863a">THE BOOKABLE UNIT — everything contended lives here</text>

  <rect x="18" y="260" width="684" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="278" font-size="9.5" fill="#e8e4dc">“ticket”, “booking”</text>
  <text x="212" y="278" font-size="9.5" fill="#5e9ff6">Booking</text>
  <text x="336" y="278" font-size="9.5" fill="#9099a8">user, show, showSeatIds, amountPaise, status, paymentRef</text>

  <rect x="18" y="292" width="684" height="28" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="310" font-size="9.5" fill="#e8e4dc">“person”, “customer”</text>
  <text x="212" y="310" font-size="9.5" fill="#5e9ff6">User</text>
  <text x="336" y="310" font-size="9.5" fill="#9099a8">id, name — resist adding anything else</text>

  <text x="18" y="342" font-size="9" fill="#6b7280">rule of thumb: if two different questions about the same object have different answers, you are missing a class.</text>
</svg>`,
        caption:
          "The last line is the general version of the trick. *“Is C8 free?”* has two different answers at 6 PM and 9 PM — so `Seat` was hiding a second class inside it. That is the same instinct as [[identifying-entities]].",
      },
      {
        type: "callout",
        variant: "tip",
        title: "How to say the ShowSeat idea in fifteen seconds",
        text: "*“A `Seat` is furniture — row C, number 8, gold tier — and it is never booked. A `Show` is a movie in a screen at a time. When I create a `Show` I **materialise** one `ShowSeat` per `Seat`, and that object carries the status, the holder, the expiry and the price. Two shows in the same hall get two independent sets of forty `ShowSeat`s over the same forty chairs.”*",
      },
      {
        type: "p",
        text: "One follow-up always lands here: *“a 500-seat hall × 30 shows a day × 200 screens — are you really creating all those objects?”* The answer is yes, and it is fine: they are small, they are created once when the show is scheduled, and they are exactly the rows a real database would hold. If they push, the alternative is to materialise **lazily** — create the `ShowSeat` row on first touch and treat *“no row”* as `AVAILABLE`. Say that, then move on. It is a storage optimisation, not a model change.",
      },

      // ---------- APIs ----------
      { type: "h", text: "Step 3 · The APIs — five methods, and the shape of each" },
      {
        type: "p",
        text: "Write the method signatures before the classes. If the signatures are right, the classes almost fall out. Notice that **`now` is a parameter everywhere** — the moment you call the clock inside the logic, hold expiry becomes untestable.",
      },
      {
        type: "code",
        language: "java",
        filename: "the API surface — write this on the whiteboard first",
        code: `// ---- browsing (boring, but they will ask) -------------------------------
List<Show>      showsFor(String movieId, String city, LocalDate day);
SeatMap         seatMap(String showId, long now);        // 40 ShowSeats + status + price

// ---- the part the round is about ---------------------------------------
Booking         selectSeats(String showId, List<String> seatLabels,
                            String userId, long now);    // PENDING + holds, all-or-nothing
Booking         confirm(String bookingId, String paymentRef, long now);  // IDEMPOTENT
void            abandon(String bookingId, long now);     // user walked away / pay failed
void            cancel(String bookingId, long now);      // after booking, inside refund window

// ---- housekeeping -------------------------------------------------------
int             sweepExpiredHolds(long now);             // returns dead holds to the pool

// Note what is NOT here: there is no bookSeat(seatId). Booking a seat is two
// calls separated by a slow, failable payment. Collapsing them into one method
// is the same mistake as putting isBooked on Seat - it works until reality shows up.`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Why `selectSeats` returns a `Booking` and not a boolean",
        text: "Because the hold has to be *findable*. If `selectSeats` returns `true`, the only record that three seats are held for this user lives inside three seat objects, and nothing ties them together. A `PENDING` `Booking` is the handle: it knows the user, the seats, the amount and when it dies. `confirm` and `abandon` both take that one id.",
      },

      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 780 512" width="100%" style="max-width:760px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A class diagram. On the left a vertical chain: Theatre owns many Screens, and each Screen owns many Seats which carry row, number and tier only. In the middle: Movie and Screen combine into Show, and Show materialises many ShowSeats. The ShowSeat box is highlighted in orange and carries status, held by, expires at, booking id and price in paise, together with the atomic methods tryHold, release, confirm and cancel. Each ShowSeat references one Seat by a dashed arrow. On the right, SeatLockManager calls tryHold and release on ShowSeats in sorted order, and PricingStrategy with its Flat and Tier-times-time implementations supplies the price at materialisation time. Far right, User and Booking, where Booking holds the show seat ids, the amount in paise and a status. Along the bottom, BookingService orchestrates everything and talks to a PaymentGateway.">
  <defs>
    <marker id="bms-cd-own" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#9099a8"/></marker>
    <marker id="bms-cd-hot" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="bms-cd-ref" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#6b7280"/></marker>
  </defs>

  <text x="18" y="20" font-size="9.5" fill="#6b7280">the physical world — created once, never mutated</text>

  <rect x="18" y="30" width="152" height="46" rx="7" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="48" font-size="10" fill="#e8e4dc">Theatre</text>
  <text x="32" y="65" font-size="8.5" fill="#9099a8">name · city · screens</text>

  <line x1="94" y1="76" x2="94" y2="100" stroke="#9099a8" stroke-width="1.1" marker-end="url(#bms-cd-own)"/>
  <text x="100" y="93" font-size="8" fill="#6b7280">1..*</text>

  <rect x="18" y="106" width="152" height="46" rx="7" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="124" font-size="10" fill="#e8e4dc">Screen</text>
  <text x="32" y="141" font-size="8.5" fill="#9099a8">name · seats</text>

  <line x1="94" y1="152" x2="94" y2="176" stroke="#9099a8" stroke-width="1.1" marker-end="url(#bms-cd-own)"/>
  <text x="100" y="169" font-size="8" fill="#6b7280">1..*</text>

  <rect x="18" y="182" width="152" height="72" rx="7" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="200" font-size="10" fill="#e8e4dc">Seat</text>
  <line x1="18" y1="208" x2="170" y2="208" stroke="#2d333d"/>
  <text x="32" y="224" font-size="8.5" fill="#9099a8">row · number · tier</text>
  <text x="32" y="240" font-size="8.5" fill="#f06868">no status. ever.</text>

  <text x="212" y="20" font-size="9.5" fill="#6b7280">the scheduled world — one per listing</text>

  <rect x="212" y="30" width="152" height="46" rx="7" fill="#14161a" stroke="#3a414c"/>
  <text x="226" y="48" font-size="10" fill="#e8e4dc">Movie</text>
  <text x="226" y="65" font-size="8.5" fill="#9099a8">title · language · runtime</text>

  <line x1="288" y1="76" x2="288" y2="100" stroke="#9099a8" stroke-width="1.1" marker-end="url(#bms-cd-own)"/>
  <line x1="170" y1="128" x2="206" y2="118" stroke="#9099a8" stroke-width="1.1" marker-end="url(#bms-cd-own)"/>

  <rect x="212" y="106" width="180" height="60" rx="7" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="226" y="124" font-size="10" fill="#5e9ff6">Show</text>
  <line x1="212" y1="132" x2="392" y2="132" stroke="#2d333d"/>
  <text x="226" y="148" font-size="8.5" fill="#9099a8">movie × screen × startsAt</text>
  <text x="226" y="160" font-size="8.5" fill="#e8e4dc">materialise(pricing)</text>

  <line x1="288" y1="166" x2="288" y2="192" stroke="#fb863a" stroke-width="1.3" marker-end="url(#bms-cd-hot)"/>
  <text x="294" y="184" font-size="8" fill="#fb863a">1..* (40)</text>

  <rect x="212" y="198" width="196" height="130" rx="7" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)" stroke-width="1.4"/>
  <text x="226" y="216" font-size="10.5" fill="#fb863a">ShowSeat</text>
  <line x1="212" y1="224" x2="408" y2="224" stroke="rgba(251,134,58,0.35)"/>
  <text x="226" y="240" font-size="8.5" fill="#e8e4dc">status: AVAILABLE|HELD|BOOKED</text>
  <text x="226" y="254" font-size="8.5" fill="#e8e4dc">heldBy · expiresAt · bookingId</text>
  <text x="226" y="268" font-size="8.5" fill="#e8e4dc">pricePaise: long</text>
  <line x1="212" y1="276" x2="408" y2="276" stroke="rgba(251,134,58,0.35)"/>
  <text x="226" y="292" font-size="8.5" fill="#fb863a">tryHold(user, now, ttl): boolean</text>
  <text x="226" y="306" font-size="8.5" fill="#fb863a">release · confirm · cancel</text>
  <text x="226" y="320" font-size="8" fill="#9099a8">every method atomic on THIS object</text>

  <line x1="212" y1="252" x2="176" y2="230" stroke="#6b7280" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#bms-cd-ref)"/>
  <text x="176" y="264" font-size="8" fill="#6b7280">refs 1 Seat</text>

  <rect x="430" y="198" width="182" height="130" rx="7" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="444" y="216" font-size="10" fill="#5e9ff6">SeatLockManager</text>
  <line x1="430" y1="224" x2="612" y2="224" stroke="#2d333d"/>
  <text x="444" y="240" font-size="8.5" fill="#e8e4dc">ttlMillis</text>
  <line x1="430" y1="248" x2="612" y2="248" stroke="#2d333d"/>
  <text x="444" y="264" font-size="8.5" fill="#e8e4dc">holdAll(seats, user, now)</text>
  <text x="444" y="278" font-size="8" fill="#9099a8">sorts by id → no deadlock</text>
  <text x="444" y="292" font-size="8" fill="#9099a8">rolls back on the first refusal</text>
  <text x="444" y="308" font-size="8.5" fill="#e8e4dc">releaseAll(seats, user, now)</text>
  <text x="444" y="322" font-size="8.5" fill="#e8e4dc">sweepExpired(seats, now)</text>

  <line x1="430" y1="262" x2="412" y2="262" stroke="#fb863a" stroke-width="1.2" marker-end="url(#bms-cd-hot)"/>

  <rect x="430" y="30" width="182" height="56" rx="7" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="444" y="48" font-size="10" fill="#5e9ff6">«interface» PricingStrategy</text>
  <line x1="430" y1="56" x2="612" y2="56" stroke="#2d333d"/>
  <text x="444" y="74" font-size="8.5" fill="#e8e4dc">priceInPaise(show, seat): long</text>

  <line x1="472" y1="86" x2="472" y2="106" stroke="#9099a8" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="570" y1="86" x2="570" y2="106" stroke="#9099a8" stroke-width="1" stroke-dasharray="3 3"/>
  <rect x="430" y="110" width="90" height="34" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="440" y="131" font-size="8.5" fill="#9099a8">FlatPricing</text>
  <rect x="528" y="110" width="112" height="34" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="538" y="131" font-size="8.5" fill="#9099a8">TierAndTimePricing</text>

  <line x1="430" y1="152" x2="400" y2="196" stroke="#6b7280" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#bms-cd-ref)"/>
  <text x="404" y="176" font-size="8" fill="#6b7280">price set once, at materialise()</text>

  <rect x="634" y="30" width="130" height="46" rx="7" fill="#14161a" stroke="#3a414c"/>
  <text x="648" y="48" font-size="10" fill="#e8e4dc">User</text>
  <text x="648" y="65" font-size="8.5" fill="#9099a8">id · name</text>

  <rect x="634" y="106" width="130" height="120" rx="7" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="648" y="124" font-size="10" fill="#5cc66f">Booking</text>
  <line x1="634" y1="132" x2="764" y2="132" stroke="#2d333d"/>
  <text x="648" y="148" font-size="8.5" fill="#9099a8">userId · showId</text>
  <text x="648" y="162" font-size="8.5" fill="#e8e4dc">showSeatIds[]</text>
  <text x="648" y="176" font-size="8.5" fill="#e8e4dc">amountPaise: long</text>
  <text x="648" y="190" font-size="8.5" fill="#e8e4dc">status: PENDING|</text>
  <text x="648" y="202" font-size="8.5" fill="#e8e4dc">CONFIRMED|FAILED…</text>
  <text x="648" y="218" font-size="8.5" fill="#fb863a">paymentRef ← idempotency</text>

  <line x1="634" y1="180" x2="416" y2="240" stroke="#6b7280" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#bms-cd-ref)"/>

  <rect x="18" y="356" width="746" height="94" rx="8" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="34" y="376" font-size="10.5" fill="#5e9ff6">BookingService — the only orchestrator</text>
  <line x1="18" y1="384" x2="764" y2="384" stroke="#2d333d"/>
  <text x="34" y="402" font-size="9" fill="#e8e4dc">selectSeats(showId, labels, userId, now) → PENDING Booking  ·  holds via SeatLockManager, all-or-nothing</text>
  <text x="34" y="420" font-size="9" fill="#e8e4dc">confirm(bookingId, paymentRef, now) → charge, then flip HELD→BOOKED  ·  replay-safe on paymentRef</text>
  <text x="34" y="438" font-size="9" fill="#e8e4dc">abandon · cancel · sweepExpiredHolds(now)</text>

  <line x1="392" y1="356" x2="392" y2="332" stroke="#9099a8" stroke-width="1.1" marker-end="url(#bms-cd-own)"/>
  <line x1="150" y1="356" x2="150" y2="470" stroke="#9099a8" stroke-width="1.1" marker-end="url(#bms-cd-own)"/>

  <rect x="18" y="472" width="220" height="34" rx="7" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="493" font-size="9" fill="#9099a8">«interface» PaymentGateway</text>

  <text x="264" y="493" font-size="9" fill="#6b7280">slow · external · fails · retries — which is exactly why it lives outside the seat lock</text>
</svg>`,
        caption:
          "Three groups. The **left column never changes** after setup. The **orange box** is the only place contention exists. `BookingService` at the bottom orchestrates and owns nothing ([[single-responsibility]]) — notice it never touches a `Seat`, only `ShowSeat`s.",
      },

      // ---------- state machine ----------
      { type: "h", text: "Step 4 · The `ShowSeat` lifecycle — three states, five edges" },
      {
        type: "p",
        text: "Draw this before you write a line of `tryHold`. Three states, and every legal move between them. If a transition is not on this diagram, the code must refuse it — that is the difference between a state machine and a pile of booleans ([[state]]).",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 330" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A state machine for a ShowSeat with three states. AVAILABLE, where held by is null. HELD, where held by is a user id and expires at is set. BOOKED, where a booking id is set. The edges are: from AVAILABLE to HELD by tryHold which is a compare and set; from HELD back to AVAILABLE by expiry, by an explicit release, or by payment failure; from HELD to BOOKED by confirm, only if the confirming user still holds it; and from BOOKED back to AVAILABLE by cancel inside the refund window. A self loop on HELD shows that a tryHold by any other user returns false immediately, and a note says confirm is replayable because confirming an already booked seat with the same booking id returns true.">
  <defs>
    <marker id="bms-sm-a" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="bms-sm-b" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#9099a8"/></marker>
    <marker id="bms-sm-c" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="bms-sm-d" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <rect x="30" y="122" width="164" height="58" rx="10" fill="#14161a" stroke="rgba(92,198,111,0.55)" stroke-width="1.4"/>
  <text x="112" y="146" font-size="11" text-anchor="middle" fill="#5cc66f">AVAILABLE</text>
  <text x="112" y="164" font-size="8" text-anchor="middle" fill="#6b7280">heldBy = null</text>

  <rect x="288" y="122" width="164" height="58" rx="10" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)" stroke-width="1.4"/>
  <text x="370" y="146" font-size="11" text-anchor="middle" fill="#fb863a">HELD</text>
  <text x="370" y="164" font-size="8" text-anchor="middle" fill="#9099a8">heldBy = U1 · expiresAt = t+7m</text>

  <rect x="546" y="122" width="164" height="58" rx="10" fill="#14161a" stroke="rgba(94,159,246,0.5)" stroke-width="1.4"/>
  <text x="628" y="146" font-size="11" text-anchor="middle" fill="#5e9ff6">BOOKED</text>
  <text x="628" y="164" font-size="8" text-anchor="middle" fill="#6b7280">bookingId = BK-1041</text>

  <line x1="194" y1="140" x2="282" y2="140" stroke="#fb863a" stroke-width="1.3" marker-end="url(#bms-sm-a)"/>
  <text x="238" y="118" font-size="9" text-anchor="middle" fill="#fb863a">tryHold(u, now, ttl)</text>
  <text x="238" y="106" font-size="8" text-anchor="middle" fill="#9099a8">CAS: AVAILABLE → HELD</text>

  <path d="M288,166 C258,196 226,196 196,168" fill="none" stroke="#9099a8" stroke-width="1.2" marker-end="url(#bms-sm-b)"/>
  <text x="238" y="214" font-size="9" text-anchor="middle" fill="#9099a8">expire · release · payment failed</text>
  <text x="238" y="226" font-size="8" text-anchor="middle" fill="#6b7280">now ≥ expiresAt, checked on every read</text>

  <line x1="452" y1="140" x2="540" y2="140" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#bms-sm-c)"/>
  <text x="496" y="118" font-size="9" text-anchor="middle" fill="#5cc66f">confirm(bookingId)</text>
  <text x="496" y="106" font-size="8" text-anchor="middle" fill="#9099a8">only if heldBy == me</text>

  <path d="M600,180 C540,282 200,282 120,182" fill="none" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#bms-sm-d)"/>
  <text x="370" y="276" font-size="9" text-anchor="middle" fill="#f06868">cancel(now) — only inside the refund window</text>

  <path d="M330,122 C330,74 410,74 410,122" fill="none" stroke="#9099a8" stroke-width="1.1" marker-end="url(#bms-sm-b)"/>
  <text x="370" y="66" font-size="9" text-anchor="middle" fill="#e8e4dc">tryHold by anyone else → false, right now</text>
  <text x="370" y="54" font-size="8" text-anchor="middle" fill="#6b7280">the loser is told in the same call, not after paying</text>

  <text x="30" y="308" font-size="9" fill="#6b7280">replay safety: confirm() on a seat already BOOKED with the SAME bookingId returns true. Any other combination returns false.</text>
  <text x="30" y="322" font-size="9" fill="#6b7280">there is no HELD → HELD by a different user, and no AVAILABLE → BOOKED. Those two missing edges are the whole safety argument.</text>
</svg>`,
        caption:
          "Point at the two edges that do **not** exist — `AVAILABLE → BOOKED` and `HELD → HELD(other user)`. A state machine is defined by what it refuses ([[state-diagrams]]).",
      },
      {
        type: "callout",
        variant: "info",
        title: "Why `HELD` and not just a lock you hold during payment",
        text: "Because payment takes forty seconds and can fail. A real lock held across a network call to a bank is a lock you will eventually leak — the process dies mid-payment and that seat is gone until someone restarts the server. `HELD` is **soft state with an owner and a deadline**: it survives a crash badly on purpose, because the deadline cleans it up.",
      },

      // ---------- the race ----------
      { type: "h", text: "Step 5 · Two clicks, one seat — the race this problem is built around" },
      {
        type: "p",
        text: "Here is the code every first draft contains. It reads correctly, it passes every single-user test, and it is wrong.",
      },
      {
        type: "code",
        language: "java",
        filename: "the bug, in four lines",
        code: `// DO NOT SHIP THIS
if (showSeat.getStatus() == AVAILABLE) {      // 1. read
    showSeat.setStatus(HELD);                 // 2. write
    showSeat.setHeldBy(userId);
    return true;                              // "the seat is yours"
}
return false;

// Between line 1 and line 2 there is a gap. It is microseconds wide.
// A thousand people are clicking A5 on a Friday. Somebody is in that gap.`,
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 318" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An unguarded race timeline with two user lanes and time running left to right. At t1 user one reads seat A5 and sees AVAILABLE. At t2 user two also reads seat A5 and also sees AVAILABLE, because user one has not written yet. At t3 user one writes HELD and is told the seat is yours. At t4 user two writes HELD over the top and is also told the seat is yours. The seat object at the bottom shows held by first U1 then U2, and the outcome banner in red reads two confirmations, one chair, one very unhappy pair of customers at the door.">
  <defs>
    <marker id="bms-race-bad" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="18" y="20" font-size="10.5" fill="#f06868">🔓 UNGUARDED — check-then-act on a shared object</text>

  <line x1="120" y1="44" x2="700" y2="44" stroke="#2d333d"/>
  <text x="128" y="38" font-size="8" fill="#6b7280">t1</text>
  <text x="268" y="38" font-size="8" fill="#6b7280">t2</text>
  <text x="408" y="38" font-size="8" fill="#6b7280">t3</text>
  <text x="548" y="38" font-size="8" fill="#6b7280">t4</text>
  <text x="656" y="38" font-size="8" fill="#6b7280">time →</text>

  <text x="18" y="82" font-size="10" fill="#5e9ff6">👤 U1</text>
  <line x1="120" y1="86" x2="700" y2="86" stroke="#232830" stroke-dasharray="2 4"/>
  <rect x="120" y="66" width="130" height="38" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="132" y="82" font-size="8.5" fill="#e8e4dc">read A5.status</text>
  <text x="132" y="96" font-size="8.5" fill="#5cc66f">→ AVAILABLE</text>

  <rect x="400" y="66" width="130" height="38" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="412" y="82" font-size="8.5" fill="#e8e4dc">write HELD, U1</text>
  <text x="412" y="96" font-size="8.5" fill="#5cc66f">→ “seat is yours”</text>

  <text x="18" y="152" font-size="10" fill="#fb863a">👤 U2</text>
  <line x1="120" y1="156" x2="700" y2="156" stroke="#232830" stroke-dasharray="2 4"/>
  <rect x="260" y="136" width="130" height="38" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="272" y="152" font-size="8.5" fill="#e8e4dc">read A5.status</text>
  <text x="272" y="166" font-size="8.5" fill="#5cc66f">→ AVAILABLE</text>

  <rect x="540" y="136" width="146" height="38" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.55)"/>
  <text x="552" y="152" font-size="8.5" fill="#e8e4dc">write HELD, U2</text>
  <text x="552" y="166" font-size="8.5" fill="#f06868">→ “seat is yours”</text>

  <line x1="250" y1="86" x2="322" y2="132" stroke="#f06868" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="260" y="120" font-size="8" fill="#f06868">the gap</text>

  <rect x="120" y="192" width="566" height="42" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="132" y="210" font-size="8.5" fill="#6b7280">ShowSeat A5 @ 6:00 PM</text>
  <text x="132" y="226" font-size="9" fill="#e8e4dc">AVAILABLE  →  HELD(U1)  →  HELD(U2)   <tspan fill="#f06868">U1's hold was silently overwritten</tspan></text>

  <line x1="404" y1="176" x2="404" y2="190" stroke="#f06868" stroke-width="1" marker-end="url(#bms-race-bad)"/>

  <rect x="120" y="248" width="566" height="48" rx="7" fill="#14161a" stroke="rgba(240,104,104,0.55)"/>
  <text x="134" y="268" font-size="10.5" fill="#f06868">✗ two confirmations. one chair.</text>
  <text x="134" y="286" font-size="9" fill="#9099a8">both users pay, both get a QR code, and the usher sorts it out at the door.</text>
</svg>`,
        caption:
          "The gap between the read and the write is the entire problem. It is microseconds wide, which is why it never shows up in your demo and always shows up on a Friday night.",
      },
      {
        type: "p",
        text: "The fix is not a bigger lock. The fix is to make the **check and the take one indivisible operation on that one seat** — a compare-and-set. *“If and only if you are `AVAILABLE`, become `HELD` by me.”* One of the two callers gets `true`. The other gets `false`, immediately, and the UI can grey the seat out before the user has finished moving the mouse.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 336" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A guarded race timeline. Both users call tryHold on seat A5 in the same instant, but tryHold is a single atomic compare and set on that seat. User one's call sees AVAILABLE and flips it to HELD, returning true. User two's call arrives with the seat already HELD, so the compare fails and it returns false straight away, and user two sees the seat go grey with the message just gone, pick another. The seat object shows a single clean transition from AVAILABLE to HELD by U1. A side panel stresses that the atomic step covers exactly one seat, so the other thirty nine seats in the hall are still being taken in parallel, whereas a single lock around the whole show would serialise everybody.">
  <defs>
    <marker id="bms-race-ok" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="bms-race-no" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="18" y="20" font-size="10.5" fill="#5cc66f">🔒 GUARDED — one atomic compare-and-set on the seat</text>

  <text x="18" y="72" font-size="10" fill="#5e9ff6">👤 U1</text>
  <rect x="86" y="52" width="212" height="42" rx="7" fill="#14161a" stroke="#3a414c"/>
  <text x="98" y="70" font-size="8.5" fill="#e8e4dc">tryHold(A5, U1, now, ttl)</text>
  <text x="98" y="86" font-size="8.5" fill="#6b7280">one call. no gap inside it.</text>

  <text x="18" y="152" font-size="10" fill="#fb863a">👤 U2</text>
  <rect x="86" y="132" width="212" height="42" rx="7" fill="#14161a" stroke="#3a414c"/>
  <text x="98" y="150" font-size="8.5" fill="#e8e4dc">tryHold(A5, U2, now, ttl)</text>
  <text x="98" y="166" font-size="8.5" fill="#6b7280">same millisecond</text>

  <line x1="298" y1="73" x2="342" y2="100" stroke="#9099a8" stroke-width="1.1"/>
  <line x1="298" y1="153" x2="342" y2="126" stroke="#9099a8" stroke-width="1.1"/>

  <rect x="348" y="88" width="184" height="50" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)" stroke-width="1.4"/>
  <text x="440" y="107" font-size="9.5" text-anchor="middle" fill="#fb863a">ShowSeat A5 — CAS</text>
  <text x="440" y="124" font-size="8" text-anchor="middle" fill="#9099a8">if status == AVAILABLE → HELD</text>

  <line x1="532" y1="102" x2="586" y2="76" stroke="#5cc66f" stroke-width="1.2" marker-end="url(#bms-race-ok)"/>
  <line x1="532" y1="126" x2="586" y2="152" stroke="#f06868" stroke-width="1.2" marker-end="url(#bms-race-no)"/>

  <rect x="592" y="54" width="130" height="44" rx="7" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="604" y="72" font-size="9" fill="#5cc66f">→ true</text>
  <text x="604" y="88" font-size="8" fill="#9099a8">HELD by U1, 7:00 left</text>

  <rect x="592" y="132" width="130" height="44" rx="7" fill="#14161a" stroke="rgba(240,104,104,0.5)"/>
  <text x="604" y="150" font-size="9" fill="#f06868">→ false</text>
  <text x="604" y="166" font-size="8" fill="#9099a8">“just gone — pick another”</text>

  <rect x="86" y="196" width="636" height="40" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="98" y="214" font-size="8.5" fill="#6b7280">ShowSeat A5 @ 6:00 PM</text>
  <text x="98" y="230" font-size="9" fill="#e8e4dc">AVAILABLE  →  HELD(U1)   <tspan fill="#5cc66f">exactly one transition. the second caller never mutated anything.</tspan></text>

  <rect x="18" y="250" width="344" height="72" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="32" y="270" font-size="9.5" fill="#5cc66f">✓ lock the SEAT</text>
  <text x="32" y="288" font-size="8.5" fill="#9099a8">A5 is contended. B1…E8 are not.</text>
  <text x="32" y="304" font-size="8.5" fill="#9099a8">39 other seats keep selling in parallel.</text>
  <text x="32" y="318" font-size="8.5" fill="#6b7280">contention window ≈ a few instructions</text>

  <rect x="378" y="250" width="344" height="72" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="392" y="270" font-size="9.5" fill="#f06868">✗ synchronized BookingService</text>
  <text x="392" y="288" font-size="8.5" fill="#9099a8">every click in the country, one at a time.</text>
  <text x="392" y="304" font-size="8.5" fill="#9099a8">correct, and unusable on a release Friday.</text>
  <text x="392" y="318" font-size="8.5" fill="#6b7280">“it works” is not the bar in this round</text>
</svg>`,
        caption:
          "Both boxes at the bottom are *correct*. Only the left one is a design. This is the same trade-off as [[locks-mutex-semaphore]]: the size of the critical section is the whole engineering decision.",
      },
      {
        type: "code",
        language: "java",
        filename: "the only method that matters",
        code: `/**
 * The compare-and-set, on ONE seat. In Java, "synchronized" on the ShowSeat
 * instance is the lock - and the instance IS the contended resource, so the
 * lock is exactly as wide as the thing it protects.
 *
 * Note: expiry is checked on the way in. A hold whose deadline passed is
 * already dead, so the next caller through the door gets the seat for free.
 */
synchronized boolean tryHold(String userId, long now, long ttlMillis) {
    expireIfDue(now);                                  // lazy expiry

    if (status == SeatStatus.AVAILABLE) {              // COMPARE
        status      = SeatStatus.HELD;                 // ...and SET
        heldBy      = userId;
        holdExpires = now + ttlMillis;
        return true;
    }
    if (status == SeatStatus.HELD && userId.equals(heldBy)) {
        holdExpires = now + ttlMillis;                 // my own hold: extend, do not fail
        return true;
    }
    return false;                                      // the loser, told synchronously
}

private void expireIfDue(long now) {                   // caller already holds the monitor
    if (status == SeatStatus.HELD && now >= holdExpires) {
        status = SeatStatus.AVAILABLE;
        heldBy = null;
        holdExpires = 0L;
    }
}`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one-server answer and the ten-server answer, in one breath",
        text: "*“On one process this is a `synchronized` method on the `ShowSeat` — or a `compareAndSet` on an `AtomicReference` if I want it lock-free ([[atomic-operations-and-cas]]). On ten processes the object is a database row and the same operation becomes `UPDATE show_seat SET status='HELD', held_by=?, expires_at=? WHERE id=? AND status='AVAILABLE'` — I check that it affected exactly **one** row. Same shape, different place.”* Have that sentence ready; it gets asked every time.",
      },

      // ---------- all or nothing ----------
      { type: "h", text: "Three seats or none — and why the order matters" },
      {
        type: "p",
        text: "Nobody books one seat. They book three, and getting two of them is a worse outcome than getting zero. So `selectSeats` takes them one at a time and **rolls back everything it already took** the moment one refuses.",
      },
      {
        type: "p",
        text: "Then there is the part that separates a careful candidate from a fast one. Two users ask for overlapping sets: U1 wants `[C4, C5]`, U2 wants `[C5, C4]`. If each takes them in the order the user typed, U1 can hold C4 while U2 holds C5, and now neither can finish. **Sort the seats into one canonical order before acquiring** — by id — and that interleaving becomes impossible. It is the classic lock-ordering fix, and it costs one line ([[deadlock-race-starvation]]).",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 780 420" width="100%" style="max-width:760px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram for selectSeats. The user asks BookingService for seats C6, C4 and C5. BookingService sorts them into canonical order C4, C5, C6, noted as the step that makes deadlock impossible. It then calls SeatLockManager which calls tryHold on ShowSeat C4, which returns true, then on ShowSeat C5, which returns true, then on ShowSeat C6, which returns false because it is already held by another user. SeatLockManager then rolls back by releasing C5 and C4 in reverse, and BookingService returns a SeatsUnavailable error naming C6. A closing note says nothing was left half held and the user sees one clear message.">
  <defs>
    <marker id="bms-seq1-msg" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#d8d3c9"/></marker>
    <marker id="bms-seq1-ret" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="bms-seq1-no" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <rect x="14" y="20" width="96" height="28" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="62" y="39" font-size="9" text-anchor="middle" fill="#e8e4dc">👤 User</text>
  <rect x="132" y="20" width="120" height="28" rx="6" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="192" y="39" font-size="9" text-anchor="middle" fill="#5e9ff6">BookingService</text>
  <rect x="274" y="20" width="126" height="28" rx="6" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="337" y="39" font-size="9" text-anchor="middle" fill="#5e9ff6">SeatLockManager</text>
  <rect x="424" y="20" width="98" height="28" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="473" y="39" font-size="9" text-anchor="middle" fill="#fb863a">ShowSeat C4</text>
  <rect x="540" y="20" width="98" height="28" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="589" y="39" font-size="9" text-anchor="middle" fill="#fb863a">ShowSeat C5</text>
  <rect x="656" y="20" width="110" height="28" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="711" y="39" font-size="9" text-anchor="middle" fill="#fb863a">ShowSeat C6</text>

  <line x1="62" y1="48" x2="62" y2="396" stroke="#232830" stroke-dasharray="2 4"/>
  <line x1="192" y1="48" x2="192" y2="396" stroke="#232830" stroke-dasharray="2 4"/>
  <line x1="337" y1="48" x2="337" y2="396" stroke="#232830" stroke-dasharray="2 4"/>
  <line x1="473" y1="48" x2="473" y2="396" stroke="#232830" stroke-dasharray="2 4"/>
  <line x1="589" y1="48" x2="589" y2="396" stroke="#232830" stroke-dasharray="2 4"/>
  <line x1="711" y1="48" x2="711" y2="396" stroke="#232830" stroke-dasharray="2 4"/>

  <line x1="62" y1="74" x2="186" y2="74" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq1-msg)"/>
  <text x="66" y="68" font-size="8.5" fill="#e8e4dc">selectSeats(show, [C6, C4, C5], U1, now)</text>

  <rect x="132" y="86" width="252" height="32" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="144" y="100" font-size="8.5" fill="#fb863a">sort → [C4, C5, C6]  — canonical order</text>
  <text x="144" y="112" font-size="8" fill="#9099a8">every caller acquires in the same order → no deadlock</text>

  <line x1="192" y1="136" x2="331" y2="136" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq1-msg)"/>
  <text x="196" y="130" font-size="8.5" fill="#e8e4dc">holdAll([C4, C5, C6], U1, now)</text>

  <line x1="337" y1="164" x2="467" y2="164" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq1-msg)"/>
  <text x="341" y="158" font-size="8.5" fill="#e8e4dc">tryHold(U1, now, 7m)</text>
  <line x1="473" y1="182" x2="343" y2="182" stroke="#5cc66f" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#bms-seq1-ret)"/>
  <text x="386" y="176" font-size="8.5" fill="#5cc66f">true — HELD(U1)</text>

  <line x1="337" y1="206" x2="583" y2="206" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq1-msg)"/>
  <text x="341" y="200" font-size="8.5" fill="#e8e4dc">tryHold(U1, now, 7m)</text>
  <line x1="589" y1="224" x2="343" y2="224" stroke="#5cc66f" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#bms-seq1-ret)"/>
  <text x="446" y="218" font-size="8.5" fill="#5cc66f">true — HELD(U1)</text>

  <line x1="337" y1="248" x2="705" y2="248" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq1-msg)"/>
  <text x="341" y="242" font-size="8.5" fill="#e8e4dc">tryHold(U1, now, 7m)</text>
  <line x1="711" y1="266" x2="343" y2="266" stroke="#f06868" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#bms-seq1-no)"/>
  <text x="500" y="260" font-size="8.5" fill="#f06868">false — already HELD by U2</text>

  <rect x="274" y="280" width="316" height="30" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.5)"/>
  <text x="286" y="294" font-size="8.5" fill="#f06868">ROLLBACK — release everything already taken</text>
  <text x="286" y="306" font-size="8" fill="#9099a8">reverse order, only my own holds</text>

  <line x1="337" y1="330" x2="583" y2="330" stroke="#9099a8" stroke-width="1" marker-end="url(#bms-seq1-msg)"/>
  <text x="341" y="324" font-size="8.5" fill="#9099a8">release(C5, U1) → AVAILABLE</text>
  <line x1="337" y1="352" x2="467" y2="352" stroke="#9099a8" stroke-width="1" marker-end="url(#bms-seq1-msg)"/>
  <text x="341" y="346" font-size="8.5" fill="#9099a8">release(C4, U1) → AVAILABLE</text>

  <line x1="186" y1="378" x2="66" y2="378" stroke="#f06868" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#bms-seq1-no)"/>
  <text x="70" y="372" font-size="8.5" fill="#f06868">SeatsUnavailable([C6]) — nothing was booked, nothing is stuck</text>

  <text x="14" y="410" font-size="9" fill="#6b7280">all-or-nothing: the user gets one clear message and the two innocent seats are back in the pool within the same call.</text>
</svg>`,
        caption:
          "The rollback is the interesting half. Without it, a failed selection leaves two seats invisibly held for seven minutes — and the customer who *could* have taken them sees a full row.",
      },

      // ---------- expiry ----------
      { type: "h", text: "Why the hold must expire — and who does the expiring" },
      {
        type: "p",
        text: "Ask *“what happens if the user closes the tab?”* and answer it before they do. Without an expiry, that seat is `HELD` forever. One abandoned checkout, one dead seat, for every show, for the rest of time. A cinema fills up with ghosts.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 340" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A hold expiry timeline. The top lane shows a hold with a time to live: at time zero user one holds seat C4 for seven minutes, the amber bar runs to seven minutes, at seven minutes the deadline passes, at seven minutes and three seconds another user reads the seat and the lazy check evicts the dead hold immediately, and at seven minutes and thirty seconds a background sweeper also passes and finds nothing left to do. The seat is back in the pool. The bottom lane shows the same hold with no time to live: the amber bar runs off the right hand edge of the picture and the seat is described as dead until someone restarts the process.">
  <defs>
    <marker id="bms-ttl-a" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="bms-ttl-b" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="18" y="20" font-size="10.5" fill="#5cc66f">✓ with a TTL — the seat always comes back</text>

  <line x1="86" y1="44" x2="706" y2="44" stroke="#2d333d"/>
  <text x="88" y="38" font-size="8" fill="#6b7280">t = 0</text>
  <text x="392" y="38" font-size="8" fill="#6b7280">+3:30</text>
  <text x="524" y="38" font-size="8" fill="#6b7280">+7:00</text>
  <text x="668" y="38" font-size="8" fill="#6b7280">+8:00</text>

  <rect x="86" y="56" width="448" height="34" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="98" y="70" font-size="9" fill="#fb863a">HELD by U1 — expiresAt = t + 7:00</text>
  <text x="98" y="84" font-size="8" fill="#9099a8">the UI shows a countdown. the user goes to make tea.</text>

  <line x1="534" y1="52" x2="534" y2="96" stroke="#f06868" stroke-width="1.2" stroke-dasharray="3 3"/>
  <text x="540" y="66" font-size="8.5" fill="#f06868">deadline passes</text>
  <text x="540" y="80" font-size="8" fill="#6b7280">nothing runs yet — that is fine</text>

  <rect x="534" y="102" width="172" height="34" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="546" y="116" font-size="8.5" fill="#5cc66f">+7:03 someone reads C4</text>
  <text x="546" y="129" font-size="8" fill="#9099a8">lazy check evicts it, then and there</text>

  <rect x="534" y="144" width="172" height="34" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="546" y="158" font-size="8.5" fill="#9099a8">+7:30 sweeper passes</text>
  <text x="546" y="171" font-size="8" fill="#6b7280">already clean — nothing to do</text>

  <rect x="86" y="102" width="436" height="76" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="98" y="122" font-size="9" fill="#e8e4dc">two mechanisms, both cheap, both needed:</text>
  <text x="98" y="140" font-size="8.5" fill="#9099a8">LAZY — every read/write checks now ≥ expiresAt first. Correct instantly, costs nothing.</text>
  <text x="98" y="156" font-size="8.5" fill="#9099a8">SWEEPER — a timer walks held seats every 30s. Keeps counters and seat maps honest</text>
  <text x="98" y="170" font-size="8.5" fill="#9099a8">for seats nobody happens to be reading.</text>

  <line x1="86" y1="90" x2="86" y2="102" stroke="#5cc66f" stroke-width="1" marker-end="url(#bms-ttl-a)"/>

  <text x="18" y="216" font-size="10.5" fill="#f06868">✗ without a TTL — the seat never comes back</text>
  <line x1="86" y1="240" x2="706" y2="240" stroke="#2d333d"/>

  <rect x="86" y="252" width="620" height="34" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.5)"/>
  <text x="98" y="266" font-size="9" fill="#f06868">HELD by U1 — forever</text>
  <text x="98" y="280" font-size="8" fill="#9099a8">user closed the tab at +0:40. the seat is now unsellable for this show.</text>
  <line x1="706" y1="269" x2="726" y2="269" stroke="#f06868" stroke-width="1.2" marker-end="url(#bms-ttl-b)"/>

  <text x="18" y="310" font-size="9" fill="#6b7280">multiply by every abandoned checkout on a Friday: the hall shows “sold out” with forty empty chairs in it.</text>
  <text x="18" y="326" font-size="9" fill="#6b7280">this is why the TTL is part of the data model — expiresAt sits on the seat, not in a side timer that can be lost.</text>
</svg>`,
        caption:
          "Say both mechanisms. **Lazy expiry** is what makes it *correct*; the **sweeper** is what makes the seat-map screen and the “12 seats left” counter honest for seats nobody is looking at.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The trap inside lazy expiry",
        text: "`expireIfDue(now)` must run **inside** the same atomic step as the compare-and-set, not before it. If you check expiry, release the lock, and then try to hold, you have re-opened the exact gap you were closing — two callers can both see *“expired, therefore free”* and both take it. In the Java code above, `expireIfDue` is called from inside the `synchronized` method for precisely that reason.",
      },

      // ---------- payment ----------
      { type: "h", text: "Payment is not part of the transaction" },
      {
        type: "p",
        text: "The whole reason `HELD` exists is that payment is slow, external, and allowed to fail. So the flow is three separate steps with a network call in the middle: **hold → pay → confirm**. The seats are *held* across the payment, not *locked* across it.",
      },
      {
        type: "p",
        text: "And because payments retry, `confirm` will be called twice. A gateway webhook fires, times out, and fires again with the same `paymentRef`. If `confirm` is not **idempotent**, the second call either double-books the seat or double-charges the card — and in this problem it can do both.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 780 430" width="100%" style="max-width:760px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram for confirmBooking. The user calls confirm with a booking id and a payment reference. BookingService first performs the idempotency check: if a booking already exists for that payment reference it returns the existing booking immediately without charging again. Otherwise it verifies that all the held seats are still held by this user and not expired, then calls the payment gateway to charge the amount in paise, which is the slow external hop drawn outside the seat lock. On success it flips each ShowSeat from HELD to BOOKED, stamps the booking id, saves the booking as CONFIRMED and records the payment reference. On failure it releases every seat back to AVAILABLE and marks the booking FAILED. A closing note says the second identical webhook takes the early return path and changes nothing.">
  <defs>
    <marker id="bms-seq2-msg" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#d8d3c9"/></marker>
    <marker id="bms-seq2-ret" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="bms-seq2-no" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <rect x="14" y="20" width="96" height="28" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="62" y="39" font-size="9" text-anchor="middle" fill="#e8e4dc">👤 User</text>
  <rect x="146" y="20" width="126" height="28" rx="6" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="209" y="39" font-size="9" text-anchor="middle" fill="#5e9ff6">BookingService</text>
  <rect x="326" y="20" width="126" height="28" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="389" y="39" font-size="9" text-anchor="middle" fill="#9099a8">PaymentGateway</text>
  <rect x="506" y="20" width="126" height="28" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="569" y="39" font-size="9" text-anchor="middle" fill="#fb863a">ShowSeat × 3</text>
  <rect x="668" y="20" width="98" height="28" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="717" y="39" font-size="9" text-anchor="middle" fill="#5cc66f">Bookings</text>

  <line x1="62" y1="48" x2="62" y2="404" stroke="#232830" stroke-dasharray="2 4"/>
  <line x1="209" y1="48" x2="209" y2="404" stroke="#232830" stroke-dasharray="2 4"/>
  <line x1="389" y1="48" x2="389" y2="404" stroke="#232830" stroke-dasharray="2 4"/>
  <line x1="569" y1="48" x2="569" y2="404" stroke="#232830" stroke-dasharray="2 4"/>
  <line x1="717" y1="48" x2="717" y2="404" stroke="#232830" stroke-dasharray="2 4"/>

  <line x1="62" y1="74" x2="203" y2="74" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq2-msg)"/>
  <text x="66" y="68" font-size="8.5" fill="#e8e4dc">confirm(BK-1041, paymentRef=“PAY-77”, now)</text>

  <rect x="146" y="86" width="286" height="40" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="158" y="101" font-size="8.5" fill="#fb863a">1 · IDEMPOTENCY CHECK — index on paymentRef</text>
  <text x="158" y="114" font-size="8" fill="#9099a8">seen “PAY-77” before? → return that booking, unchanged</text>
  <text x="158" y="124" font-size="8" fill="#6b7280">no charge, no seat touched, same response body</text>

  <line x1="203" y1="140" x2="66" y2="140" stroke="#5cc66f" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#bms-seq2-ret)"/>
  <text x="70" y="134" font-size="8.5" fill="#5cc66f">(replay path — the retried webhook stops here)</text>

  <line x1="209" y1="168" x2="563" y2="168" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq2-msg)"/>
  <text x="213" y="162" font-size="8.5" fill="#e8e4dc">2 · still HELD by me, not expired?</text>
  <line x1="569" y1="186" x2="215" y2="186" stroke="#5cc66f" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#bms-seq2-ret)"/>
  <text x="380" y="180" font-size="8.5" fill="#5cc66f">yes ×3</text>

  <line x1="209" y1="214" x2="383" y2="214" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq2-msg)"/>
  <text x="213" y="208" font-size="8.5" fill="#e8e4dc">3 · charge(97500 paise)</text>
  <rect x="326" y="222" width="150" height="30" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="336" y="236" font-size="8" fill="#9099a8">slow · external · fails</text>
  <text x="336" y="247" font-size="8" fill="#6b7280">no seat lock is held here</text>
  <line x1="389" y1="264" x2="215" y2="264" stroke="#5cc66f" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#bms-seq2-ret)"/>
  <text x="238" y="258" font-size="8.5" fill="#5cc66f">OK</text>

  <line x1="209" y1="292" x2="563" y2="292" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq2-msg)"/>
  <text x="213" y="286" font-size="8.5" fill="#e8e4dc">4 · confirm(U1, BK-1041) — HELD → BOOKED ×3</text>

  <line x1="209" y1="320" x2="711" y2="320" stroke="#d8d3c9" stroke-width="1.1" marker-end="url(#bms-seq2-msg)"/>
  <text x="213" y="314" font-size="8.5" fill="#e8e4dc">5 · save CONFIRMED + index paymentRef “PAY-77”</text>

  <line x1="203" y1="344" x2="66" y2="344" stroke="#5cc66f" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#bms-seq2-ret)"/>
  <text x="70" y="338" font-size="8.5" fill="#5cc66f">Booking CONFIRMED · ₹975.00 · C4 C5 C6</text>

  <rect x="146" y="356" width="486" height="34" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.5)"/>
  <text x="158" y="370" font-size="8.5" fill="#f06868">FAILURE BRANCH — charge() throws or declines</text>
  <text x="158" y="383" font-size="8" fill="#9099a8">release all three seats → AVAILABLE immediately · booking = FAILED · the user sees the row light up again</text>

  <text x="14" y="418" font-size="9" fill="#6b7280">the second identical webhook takes step 1 and returns. that is what “idempotent” buys you: a retry is free.</text>
</svg>`,
        caption:
          "Step 1 is the whole idempotency answer, and it is four lines of code: **key the operation on something the caller supplies** — `paymentRef` — and return the existing result if you have seen it. Never key it on “time” or “the seat state”.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Two smaller things the good candidates say here",
        text: "**1.** `confirm` re-checks that each seat is *still* `HELD by me`. The payment took forty seconds; the hold may have expired in the middle. If it did, you refund rather than book — and you say that out loud, because it is the failure everyone forgets. **2.** The seat-level `confirm` is itself replay-safe: confirming a seat that is already `BOOKED` with **the same** `bookingId` returns `true`, so a partial retry finishes cleanly instead of throwing.",
      },

      // ---------- pricing ----------
      { type: "h", text: "Pricing lives on the `ShowSeat`, and comes from a strategy" },
      {
        type: "p",
        text: "A recliner at 9 PM does not cost what a silver seat at 11 AM costs. Two inputs — **seat tier** and **show time** — and interviewers love to add a third mid-round (weekend surge, a discount code, dynamic pricing on demand). That is your cue to put the rule behind an interface instead of a growing `if` ladder ([[strategy]], [[open-closed]]).",
      },
      {
        type: "code",
        language: "java",
        filename: "pricing — one interface, integer paise, no doubles",
        code: `interface PricingStrategy {
    /** Never returns a double. Money is a long of paise, always. */
    long priceInPaise(Show show, Seat seat);
}

final class FlatPricing implements PricingStrategy {
    private final long paise;
    FlatPricing(long paise) { this.paise = paise; }
    public long priceInPaise(Show show, Seat seat) { return paise; }
}

final class TierAndTimePricing implements PricingStrategy {
    public long priceInPaise(Show show, Seat seat) {
        long base = switch (seat.tier()) {          // the chair
            case SILVER   -> 15000L;                // Rs.150.00
            case GOLD     -> 25000L;                // Rs.250.00
            case RECLINER -> 45000L;                // Rs.450.00
        };
        int pct = show.startHour() >= 21 ? 150      // late night
                : show.startHour() >= 18 ? 130      // prime evening
                : show.startHour() >= 12 ? 110      // afternoon
                : 90;                               // morning show, cheaper
        return base * pct / 100;                    // integer maths, rounds DOWN, never drifts
    }
}

// The price is computed ONCE, when the Show materialises its ShowSeats, and
// stamped onto each one. A price change tomorrow must not silently re-price a
// seat somebody is already holding - that is why it is a field, not a lookup.`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "Say this while you type it",
        text: "*“Money is a `long` of paise. `₹325.00` is `32500`. A `double` cannot represent 0.1 exactly, and a ticket price that drifts by a paisa is a reconciliation ticket six months later. I format to rupees only at the very edge, when I print.”* Same rule as [[splitwise]] — and it costs one sentence.",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups they always ask" },
      {
        type: "ul",
        items: [
          "**“A 500-seat hall — are you sending 500 objects to the browser?”** Yes, and it is about 20 KB of JSON, which is fine. The real answer is that the seat map is *read-heavy and stale-tolerant*: cache it, and let the `tryHold` call be the source of truth. A user seeing a seat that was taken 200 ms ago is not a bug — they just lose the CAS and are told instantly.",
          "**“Can I hold six seats?”** Cap it, and say why: an uncapped hold is a free denial-of-service. `maxSeatsPerBooking = 10` is a business rule, not a technical one, so it lives in one constant that a product manager can change.",
          "**“I want four seats together.”** That is a *selection* problem, not a booking problem. Scan each row for a run of `maxSeats` consecutive `AVAILABLE` seats and offer the best run; then hold them through the exact same `holdAll`. Nothing in the concurrency design changes — which is the point worth making.",
          "**“What about cancellation and refunds?”** `BOOKED → AVAILABLE` plus a `RefundPolicy` that takes `(booking, now, show.startsAt)` and returns an amount in paise: full refund up to 2 hours before, half up to 20 minutes, nothing after. Another strategy, another swappable rule.",
          "**“Why not just retry when the hold fails?”** Because the seat is gone, not busy. Retrying a lost CAS on a *specific* seat is pure hope — the honest UX is to say “A5 was just taken” and let the user pick again. Retry is right when the resource is fungible (any seat, any spot); it is wrong when the user chose *that* one.",
          "**“Ten servers instead of one?”** The `ShowSeat` becomes a row and `tryHold` becomes `UPDATE … WHERE id = ? AND status = 'AVAILABLE'` with a check on rows-affected, or a Redis `SET seat:id holder NX PX 420000`. The lifecycle, the TTL, the rollback and the idempotency key all survive unchanged — which is exactly why they were designed as data rather than as in-process locks.",
          "**“How would you test it?”** Two tests carry the round. First: 100 threads call `tryHold` on one seat; assert **exactly one** returns `true`. Second: a property test that fires random `select`, `confirm`, `abandon` and `sweep` calls with a fake clock, asserting after every step that no `ShowSeat` is `BOOKED` by two bookings and that `available + held + booked == totalSeats`.",
          "**“Overbooking, like airlines?”** Say no for cinemas and explain why: a plane seat is fungible and a bumped passenger can be compensated; a cinema seat is chosen by the customer and there is nowhere to move them to. Knowing when the trick does *not* apply reads better than knowing the trick.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 268" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An extensibility cost table. Adding a weekend surge pricing rule costs one new PricingStrategy class and zero edits elsewhere, so it is free. Adding a new seat tier costs one enum value and one map entry, so it is free. Changing the hold time to live costs one constant, so it is free. Adding group seating for contiguous seats costs one selection helper over the existing seat grid and no change to the booking path, so it is cheap. Adding cancellation and refunds costs one method plus a RefundPolicy strategy, so it is cheap. Moving to ten servers costs replacing tryHold with a conditional database update or a Redis set-if-not-exists, touching one method, and is marked as the expensive row.">
  <text x="18" y="22" font-size="10.5" fill="#9099a8">what each follow-up actually costs you</text>

  <rect x="18" y="32" width="684" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="32" y="50" font-size="9" fill="#6b7280">feature</text>
  <text x="284" y="50" font-size="9" fill="#6b7280">files touched</text>
  <text x="608" y="50" font-size="9" fill="#6b7280">verdict</text>

  <rect x="18" y="62" width="684" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="32" y="82" font-size="10" fill="#e8e4dc">weekend surge pricing</text>
  <text x="284" y="82" font-size="10" fill="#9099a8">1 new PricingStrategy — 0 edits</text>
  <text x="608" y="82" font-size="10" fill="#5cc66f">free</text>

  <rect x="18" y="96" width="684" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="32" y="116" font-size="10" fill="#e8e4dc">a new seat tier (“Recliner Plus”)</text>
  <text x="284" y="116" font-size="10" fill="#9099a8">1 enum value + 1 price entry</text>
  <text x="608" y="116" font-size="10" fill="#5cc66f">free</text>

  <rect x="18" y="130" width="684" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="32" y="150" font-size="10" fill="#e8e4dc">hold window 7 min → 4 min</text>
  <text x="284" y="150" font-size="10" fill="#9099a8">1 constant on SeatLockManager</text>
  <text x="608" y="150" font-size="10" fill="#5cc66f">free</text>

  <rect x="18" y="164" width="684" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="32" y="184" font-size="10" fill="#e8e4dc">group seating (4 together)</text>
  <text x="284" y="184" font-size="10" fill="#9099a8">1 selection helper — booking path untouched</text>
  <text x="608" y="184" font-size="10" fill="#5cc66f">cheap</text>

  <rect x="18" y="198" width="684" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="32" y="218" font-size="10" fill="#e8e4dc">cancellation + refund window</text>
  <text x="284" y="218" font-size="10" fill="#9099a8">1 method + 1 RefundPolicy strategy</text>
  <text x="608" y="218" font-size="10" fill="#5cc66f">cheap</text>

  <rect x="18" y="232" width="684" height="30" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="32" y="252" font-size="10" fill="#fb863a">1 server → 10 servers</text>
  <text x="284" y="252" font-size="10" fill="#9099a8">tryHold becomes a conditional UPDATE / SET NX</text>
  <text x="608" y="252" font-size="10" fill="#fb863a">1 method</text>
</svg>`,
        caption:
          "Look at the last row. Going distributed touches **one method**, because the hold was modelled as *data with a deadline* rather than as a language-level lock. That is the payoff for the design you made in minute six.",
      },

      // ---------- the 90 minutes ----------
      { type: "h", text: "The 90 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 220" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A ninety minute budget bar divided into six segments: six minutes clarifying, eight minutes on entities including saying the ShowSeat insight out loud, eight minutes on the APIs and the class diagram, thirty minutes coding the core which is materialise, tryHold with compare and set, and all-or-nothing selection, twenty two minutes on confirm with the payment hop and idempotency plus expiry, and sixteen minutes running the demo including the hundred thread race test and taking follow-ups.">
  <text x="18" y="22" font-size="10.5" fill="#9099a8">a 90-minute budget that actually fits</text>

  <rect x="18" y="34" width="46" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="68" y="34" width="60" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="132" y="34" width="60" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="196" y="34" width="228" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="428" y="34" width="166" height="34" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="598" y="34" width="104" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>

  <text x="26" y="56" font-size="9" fill="#9099a8">6m</text>
  <text x="76" y="56" font-size="9.5" fill="#fb863a">8m</text>
  <text x="140" y="56" font-size="9" fill="#9099a8">8m</text>
  <text x="202" y="56" font-size="9.5" fill="#fb863a">30m</text>
  <text x="434" y="56" font-size="9.5" fill="#5cc66f">22m</text>
  <text x="604" y="56" font-size="9" fill="#9099a8">16m</text>

  <text x="18" y="94" font-size="9.5" fill="#e8e4dc">clarify — several shows per hall? is the seat mine while I pay? how long? all-or-nothing?</text>
  <text x="18" y="114" font-size="9.5" fill="#fb863a">entities — and say “the bookable unit is a ShowSeat, not a Seat” out loud, with the 6 PM / 9 PM example</text>
  <text x="18" y="134" font-size="9.5" fill="#e8e4dc">APIs + class diagram — the ShowSeat box, SeatLockManager, PricingStrategy seam</text>
  <text x="18" y="154" font-size="9.5" fill="#fb863a">code: materialise() → tryHold() as an atomic CAS → holdAll() sorted + rollback</text>
  <text x="18" y="174" font-size="9.5" fill="#5cc66f">confirm() with the payment hop + idempotency on paymentRef → expiry (lazy) + sweeper</text>
  <text x="18" y="194" font-size="9" fill="#6b7280">leave 16 minutes: run main(), show 100 threads fighting for one seat and exactly one winner, take follow-ups</text>
  <text x="18" y="212" font-size="9" fill="#6b7280">at minute 60 freeze the feature list. pricing beats cancellation; the race test beats both.</text>
</svg>`,
        caption:
          "The two orange blocks are the round. If you reach minute 60 without `tryHold` working under two callers, drop pricing, drop cancellation, and get the race test running — it is the single most convincing thing you can show.",
      },

      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**`boolean isBooked` on `Seat`.** The model is dead the moment a second show exists, and you usually find out in minute 50 when the interviewer asks for the 9 PM listing.",
          "**No hold state at all** — the seat is taken only after payment succeeds. Two people pay, one gets a refund and a bad review, and the design has no place to put a fix.",
          "**A hold with no expiry.** One abandoned tab and that chair is unsellable forever. This is the follow-up that catches people who *did* remember the hold.",
          "**`synchronized` on `BookingService`.** Correct and useless: every seat click in the country queues behind one lock. The interviewer will not say anything; they will just write it down.",
          "**Acquiring several seats in the user's order.** Two overlapping requests, two half-held sets, nobody finishes. One `sort` line prevents it.",
          "**Partial selection with no rollback.** Two seats silently held for seven minutes after a failed request — invisible to everyone, including you.",
          "**`confirm` that is not idempotent.** The retried webhook charges twice. Money bugs are the ones that get escalated.",
          "**Calling the clock inside the logic.** `System.currentTimeMillis()` inside `tryHold` means you cannot test expiry without sleeping seven real minutes, so you will not test it, so it will be broken.",
          "**`double` for the ticket price.** Free marks thrown away in a problem that already has enough hard parts.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Hold a seat, and watch the countdown start",
        body:
          "The chip **👤 U1** is lit, so you are Aditi. Click **C4**, **C5** and **C6**. Each one turns amber with a `U1` badge and a live countdown, and the call line prints the real call: `seatLock.tryHold(SH-6PM:C4, U1, ttl=7s) → true`. Nothing is booked yet — read the counters strip: `held 3`, `booked 0`. That amber state *is* the whole `HELD` idea, and the number ticking down is `expiresAt`.",
      },
      {
        title: "The money button — ⚔️ Both click A5",
        body:
          "Leave the toggle on **🔒 Guarded** and press **⚔️ Both click A5**. Two `tryHold` calls hit the same seat in the same tick. One returns `true`, the seat goes amber for the winner, and the loser's card **shakes red** — the explain line says they were told in the same call, before typing a card number. Now press **🔓 Unguarded** and press **⚔️ Both click A5** again: both users are told “confirmed”, the seat shows `U1✚U2`, and the red **`⚠ double-booked: 1`** counter appears. That counter is the whole lesson.",
      },
      {
        title: "Let a hold die",
        body:
          "Hold two or three seats as **👤 U1**, then press **⏳ Let the hold expire**. The simulated clock jumps past the 7-second TTL, the amber seats snap back to outlined **available**, and the `held` counter drops to `0`. Nothing else happened — no user, no button. That is what stops one abandoned tab from killing a chair for the rest of the evening.",
      },
      {
        title: "Pay, then break the payment",
        body:
          "Hold **D1** and **D2**, then press **💳 Pay**: they go solid and a booking id like `BK-1041` is printed with the total. Reset, hold the same two seats, and press **💥 Payment fails** instead — they return to **available** in front of you. Watch which seats stay untouched both times: the payment hop never froze the rest of the hall, because the seats were *held*, not locked.",
      },
      {
        title: "Re-price the same selection with nobody's code changed",
        body:
          "With a few seats held, switch between **🎟 Flat** and **🪜 Tier × time**. The running `total` changes and the per-seat prices change — silver, gold and recliner diverge under `🪜 Tier × time` and collapse to one number under `🎟 Flat`. The explain line says it plainly: **0 lines of caller code changed**. Then press **⚡ Fill the show** and click any seat to see the sold-out path, and **↺ Reset** to start over.",
      },
      {
        title: "Then build it blank-file, in this order",
        body:
          "Close the page and write it from memory: `Seat` (row, number, tier, **no status**) → `Show` → `ShowSeat` materialised one-per-seat → `tryHold` as a single atomic compare-and-set with lazy expiry inside it → `holdAll` sorting by id and rolling back on the first refusal → `confirm` with an idempotency check on `paymentRef` before anything else. Then write the test that matters: 100 threads on one seat, assert exactly one `true`.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "BookMyShow.java",
        code: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/* =============================================================== money ==== */
final class Money {
    private Money() {}
    /** Every amount in this file is an integer number of PAISE. Never a double. */
    static String fmt(long paise) {
        long abs = Math.abs(paise);
        return (paise < 0 ? "-" : "") + "Rs." + (abs / 100) + "." + String.format("%02d", abs % 100);
    }
}

enum SeatTier    { SILVER, GOLD, RECLINER }
enum SeatStatus  { AVAILABLE, HELD, BOOKED }
enum BookingStatus { PENDING, CONFIRMED, FAILED, CANCELLED }

/* ================================================== the physical world ==== */
record User(String id, String name) {
    @Override public String toString() { return name; }
}

/** Furniture bolted to the floor of a Screen. It NEVER carries a status. */
record Seat(String id, String row, int number, SeatTier tier) {
    String label() { return row + number; }
}

record Movie(String id, String title, int runtimeMins) {}

final class Screen {
    final String id, name;
    final List<Seat> seats;
    Screen(String id, String name, List<Seat> seats) {
        this.id = id; this.name = name; this.seats = List.copyOf(seats);
    }
    static Screen grid(String id, String name, String[] rows, int perRow, Map<String, SeatTier> tiers) {
        List<Seat> out = new ArrayList<>();
        for (String r : rows)
            for (int n = 1; n <= perRow; n++)
                out.add(new Seat(id + "-" + r + n, r, n, tiers.get(r)));
        return new Screen(id, name, out);
    }
}

final class Theatre {
    final String id, name, city;
    final List<Screen> screens;
    Theatre(String id, String name, String city, List<Screen> screens) {
        this.id = id; this.name = name; this.city = city; this.screens = List.copyOf(screens);
    }
}

/** Movie x Screen x start time. THIS is what a customer books against. */
record Show(String id, Movie movie, Screen screen, int startHour) {
    String when() { return String.format("%02d:00", startHour); }
}

/* ============================================================= pricing ==== */
interface PricingStrategy {
    /** Never returns a double. Money is a long of paise, always. */
    long priceInPaise(Show show, Seat seat);
}

final class FlatPricing implements PricingStrategy {
    private final long paise;
    FlatPricing(long paise) { this.paise = paise; }
    public long priceInPaise(Show show, Seat seat) { return paise; }
}

final class TierAndTimePricing implements PricingStrategy {
    public long priceInPaise(Show show, Seat seat) {
        long base = switch (seat.tier()) {
            case SILVER   -> 15000L;                 // Rs.150.00
            case GOLD     -> 25000L;                 // Rs.250.00
            case RECLINER -> 45000L;                 // Rs.450.00
        };
        int pct = show.startHour() >= 21 ? 150       // late night
                : show.startHour() >= 18 ? 130       // prime evening
                : show.startHour() >= 12 ? 110       // afternoon
                : 90;                                // morning
        return base * pct / 100;                     // integer maths - never drifts
    }
}

/* ==================================================== THE BOOKABLE UNIT === */
/**
 * One Seat, at ONE Show. Two shows over the same 40 chairs produce two
 * independent sets of 40 ShowSeats. Status, holder, expiry and price all
 * live here - and every mutation is atomic on THIS object, nothing wider.
 */
final class ShowSeat {
    final String id;                 // "SH-6PM:C8" - also the canonical sort key
    final String showId;
    final Seat seat;
    final long pricePaise;

    private SeatStatus status = SeatStatus.AVAILABLE;
    private String heldBy;
    private long holdExpires;
    private String bookingId;

    ShowSeat(String showId, Seat seat, long pricePaise) {
        this.id = showId + ":" + seat.label();
        this.showId = showId; this.seat = seat; this.pricePaise = pricePaise;
    }

    /** Lazy expiry. MUST be called from inside the monitor, never before it. */
    private void expireIfDue(long now) {
        if (status == SeatStatus.HELD && now >= holdExpires) {
            status = SeatStatus.AVAILABLE; heldBy = null; holdExpires = 0L;
        }
    }

    synchronized SeatStatus statusAt(long now) { expireIfDue(now); return status; }
    synchronized String     holderAt(long now) { expireIfDue(now); return heldBy; }
    synchronized String     bookingRef()       { return bookingId; }

    /** THE compare-and-set. One caller wins; every other caller gets false, now. */
    synchronized boolean tryHold(String userId, long now, long ttlMillis) {
        expireIfDue(now);
        if (status == SeatStatus.AVAILABLE) {                 // COMPARE
            status = SeatStatus.HELD;                         // ...and SET
            heldBy = userId;
            holdExpires = now + ttlMillis;
            return true;
        }
        if (status == SeatStatus.HELD && userId.equals(heldBy)) {
            holdExpires = now + ttlMillis;                    // my own hold: extend
            return true;
        }
        return false;
    }

    synchronized boolean release(String userId, long now) {
        expireIfDue(now);
        if (status == SeatStatus.HELD && userId.equals(heldBy)) {
            status = SeatStatus.AVAILABLE; heldBy = null; holdExpires = 0L;
            return true;
        }
        return false;
    }

    /** HELD(by me) -> BOOKED. Replaying the same bookingId is a no-op that succeeds. */
    synchronized boolean confirm(String userId, String newBookingId, long now) {
        if (status == SeatStatus.BOOKED && newBookingId.equals(bookingId)) return true;
        expireIfDue(now);
        if (status != SeatStatus.HELD || !userId.equals(heldBy)) return false;
        status = SeatStatus.BOOKED; bookingId = newBookingId;
        heldBy = null; holdExpires = 0L;
        return true;
    }

    synchronized boolean cancel(String ref) {
        if (status == SeatStatus.BOOKED && ref.equals(bookingId)) {
            status = SeatStatus.AVAILABLE; bookingId = null; return true;
        }
        return false;
    }

    /** Used by the sweeper. Returns true only if THIS call freed the seat. */
    synchronized boolean sweep(long now) {
        boolean wasHeld = status == SeatStatus.HELD;
        expireIfDue(now);
        return wasHeld && status == SeatStatus.AVAILABLE;
    }
}

/* =========================================== one Show's worth of seats ==== */
final class ShowInventory {
    final Show show;
    private final Map<String, ShowSeat> byLabel = new LinkedHashMap<>();

    private ShowInventory(Show show) { this.show = show; }

    /** THE modelling step: one ShowSeat per Seat, priced once, at creation. */
    static ShowInventory materialise(Show show, PricingStrategy pricing) {
        ShowInventory inv = new ShowInventory(show);
        for (Seat s : show.screen().seats)
            inv.byLabel.put(s.label(), new ShowSeat(show.id(), s, pricing.priceInPaise(show, s)));
        return inv;
    }

    ShowSeat seat(String label) {
        ShowSeat s = byLabel.get(label);
        if (s == null) throw new NoSuchElementException("no seat " + label + " in " + show.id());
        return s;
    }
    Collection<ShowSeat> all() { return byLabel.values(); }

    Map<SeatStatus, Integer> census(long now) {
        Map<SeatStatus, Integer> m = new EnumMap<>(SeatStatus.class);
        for (SeatStatus st : SeatStatus.values()) m.put(st, 0);
        for (ShowSeat s : byLabel.values()) m.merge(s.statusAt(now), 1, Integer::sum);
        return m;
    }
}

/* ================================================ all-or-nothing holds ==== */
final class SeatLockManager {
    private final long ttlMillis;
    SeatLockManager(long ttlMillis) { this.ttlMillis = ttlMillis; }

    record HoldResult(boolean ok, List<ShowSeat> held, String blockedBy) {}

    HoldResult holdAll(List<ShowSeat> requested, String userId, long now) {
        List<ShowSeat> ordered = new ArrayList<>(requested);
        ordered.sort(Comparator.comparing((ShowSeat s) -> s.id));   // canonical order -> no deadlock
        List<ShowSeat> taken = new ArrayList<>();
        for (ShowSeat s : ordered) {
            if (s.tryHold(userId, now, ttlMillis)) { taken.add(s); continue; }
            for (int i = taken.size() - 1; i >= 0; i--)             // ROLLBACK, in reverse
                taken.get(i).release(userId, now);
            return new HoldResult(false, List.of(), s.seat.label());
        }
        return new HoldResult(true, List.copyOf(taken), null);
    }

    void releaseAll(List<ShowSeat> seats, String userId, long now) {
        for (ShowSeat s : seats) s.release(userId, now);
    }

    int sweepExpired(Collection<ShowSeat> seats, long now) {
        int freed = 0;
        for (ShowSeat s : seats) if (s.sweep(now)) freed++;
        return freed;
    }
}

/* ============================================================ payments ==== */
interface PaymentGateway {
    /** Slow, external, and allowed to throw. Called with NO seat lock held. */
    void charge(String bookingId, long amountPaise);
}

final class FakeGateway implements PaymentGateway {
    boolean declineNext = false;
    final AtomicInteger charges = new AtomicInteger();
    public void charge(String bookingId, long amountPaise) {
        if (declineNext) { declineNext = false; throw new IllegalStateException("card declined"); }
        charges.incrementAndGet();
    }
}

/* ============================================================= booking ==== */
final class Booking {
    final String id, userId, showId;
    final List<String> seatLabels;
    final long amountPaise;
    BookingStatus status = BookingStatus.PENDING;
    String paymentRef;

    Booking(String id, String userId, String showId, List<String> seatLabels, long amountPaise) {
        this.id = id; this.userId = userId; this.showId = showId;
        this.seatLabels = List.copyOf(seatLabels); this.amountPaise = amountPaise;
    }
    @Override public String toString() {
        return id + " " + status + " " + seatLabels + " " + Money.fmt(amountPaise);
    }
}

final class BookingService {
    static final int MAX_SEATS_PER_BOOKING = 10;

    private final Map<String, ShowInventory> shows   = new LinkedHashMap<>();
    private final Map<String, Booking> bookings      = new ConcurrentHashMap<>();
    private final Map<String, String> byPaymentRef   = new ConcurrentHashMap<>();  // idempotency index
    private final SeatLockManager locks;
    private final PaymentGateway gateway;
    private final AtomicInteger seq = new AtomicInteger(1040);

    BookingService(SeatLockManager locks, PaymentGateway gateway) {
        this.locks = locks; this.gateway = gateway;
    }

    // NOTE: there is deliberately no lock on this class. The only contended
    // thing in the system is a ShowSeat, and a ShowSeat guards itself.

    void addShow(ShowInventory inv) { shows.put(inv.show.id(), inv); }
    ShowInventory show(String id) { return shows.get(id); }

    /** Hold every requested seat or none of them. Returns a PENDING Booking. */
    Booking selectSeats(String showId, List<String> labels, User user, long now) {
        if (labels.isEmpty() || labels.size() > MAX_SEATS_PER_BOOKING)
            throw new IllegalArgumentException("1.." + MAX_SEATS_PER_BOOKING + " seats per booking");
        ShowInventory inv = shows.get(showId);
        List<ShowSeat> want = new ArrayList<>();
        for (String l : labels) want.add(inv.seat(l));

        SeatLockManager.HoldResult r = locks.holdAll(want, user.id(), now);
        if (!r.ok())
            throw new IllegalStateException(
                "seat " + r.blockedBy() + " was just taken - nothing was held");

        long total = 0;
        for (ShowSeat s : r.held()) total += s.pricePaise;
        Booking b = new Booking("BK-" + seq.incrementAndGet(), user.id(), showId, labels, total);
        bookings.put(b.id, b);
        return b;
    }

    /**
     * Idempotent on paymentRef: a retried gateway webhook must not charge or
     * book twice. Order matters - the replay check comes before everything.
     */
    Booking confirm(String bookingId, String paymentRef, long now) {
        String seen = byPaymentRef.get(paymentRef);                 // 1. replay?
        if (seen != null) return bookings.get(seen);

        Booking b = bookings.get(bookingId);
        if (b == null) throw new NoSuchElementException(bookingId);
        if (b.status == BookingStatus.CONFIRMED) return b;

        ShowInventory inv = shows.get(b.showId);
        List<ShowSeat> seats = new ArrayList<>();
        for (String l : b.seatLabels) seats.add(inv.seat(l));

        for (ShowSeat s : seats)                                    // 2. still mine?
            if (s.statusAt(now) != SeatStatus.HELD || !b.userId.equals(s.holderAt(now))) {
                locks.releaseAll(seats, b.userId, now);
                b.status = BookingStatus.FAILED;
                throw new IllegalStateException(
                    "hold expired on " + s.seat.label() + " - nothing was charged");
            }

        try {
            gateway.charge(b.id, b.amountPaise);                    // 3. slow hop, no lock held
        } catch (RuntimeException e) {
            locks.releaseAll(seats, b.userId, now);                 // failure branch
            b.status = BookingStatus.FAILED;
            throw e;
        }

        for (ShowSeat s : seats) s.confirm(b.userId, b.id, now);    // 4. HELD -> BOOKED
        b.status = BookingStatus.CONFIRMED;
        b.paymentRef = paymentRef;
        byPaymentRef.putIfAbsent(paymentRef, b.id);                 // 5. remember the key
        return b;
    }

    void abandon(String bookingId, long now) {
        Booking b = bookings.get(bookingId);
        if (b == null || b.status != BookingStatus.PENDING) return;
        ShowInventory inv = shows.get(b.showId);
        for (String l : b.seatLabels) inv.seat(l).release(b.userId, now);
        b.status = BookingStatus.FAILED;
    }

    /** Cancellation inside the refund window. Returns the refund, in paise. */
    long cancel(String bookingId, long minutesBeforeShow) {
        Booking b = bookings.get(bookingId);
        if (b == null || b.status != BookingStatus.CONFIRMED) return 0L;
        ShowInventory inv = shows.get(b.showId);
        for (String l : b.seatLabels) inv.seat(l).cancel(b.id);
        b.status = BookingStatus.CANCELLED;
        if (minutesBeforeShow >= 120) return b.amountPaise;         // full
        if (minutesBeforeShow >= 20)  return b.amountPaise / 2;     // half
        return 0L;                                                  // too late
    }

    int sweep(String showId, long now) { return locks.sweepExpired(shows.get(showId).all(), now); }
}

/* ================================================================ demo ==== */
public class BookMyShow {
    static final long MIN = 60_000L;
    static void say(String s) { System.out.println(s); }

    public static void main(String[] args) throws Exception {
        Map<String, SeatTier> tiers = new HashMap<>();
        tiers.put("A", SeatTier.SILVER);   tiers.put("B", SeatTier.SILVER);
        tiers.put("C", SeatTier.GOLD);     tiers.put("D", SeatTier.GOLD);
        tiers.put("E", SeatTier.RECLINER);

        Screen screen2 = Screen.grid("SCR-2", "Screen 2",
                new String[]{"A", "B", "C", "D", "E"}, 8, tiers);
        Theatre pvr = new Theatre("TH-1", "Forum Multiplex", "Bengaluru", List.of(screen2));
        Movie dune  = new Movie("MV-1", "Dune", 155);

        // TWO shows over the SAME screen and the SAME 40 chairs
        PricingStrategy pricing = new TierAndTimePricing();
        Show at6 = new Show("SH-6PM", dune, screen2, 18);
        Show at9 = new Show("SH-9PM", dune, screen2, 21);
        ShowInventory inv6 = ShowInventory.materialise(at6, pricing);
        ShowInventory inv9 = ShowInventory.materialise(at9, pricing);

        FakeGateway gateway = new FakeGateway();
        BookingService svc = new BookingService(new SeatLockManager(7 * MIN), gateway);
        svc.addShow(inv6);
        svc.addShow(inv9);

        User aditi = new User("U1", "Aditi");
        User rohan = new User("U2", "Rohan");
        long t = 0L;                                   // the clock is a PARAMETER

        say("=== 1. the same chair, two shows ==============================");
        Booking b1 = svc.selectSeats("SH-6PM", List.of("C6", "C7", "C8"), aditi, t);
        say("selectSeats(6PM, [C6,C7,C8], Aditi) -> " + b1);
        say("confirm -> " + svc.confirm(b1.id, "PAY-77", t));
        say("  C8 @ 6PM : " + inv6.seat("C8").statusAt(t) + "  " + Money.fmt(inv6.seat("C8").pricePaise));
        say("  C8 @ 9PM : " + inv9.seat("C8").statusAt(t) + "  " + Money.fmt(inv9.seat("C8").pricePaise));
        say("  ^ a boolean on Seat cannot print those two lines");

        say("");
        say("=== 2. one hundred people, one seat ===========================");
        ShowSeat e1 = inv6.seat("E1");
        int racers = 100;
        CountDownLatch start = new CountDownLatch(1), done = new CountDownLatch(racers);
        AtomicInteger winners = new AtomicInteger();
        for (int i = 0; i < racers; i++) {
            final String uid = "racer-" + i;
            new Thread(() -> {
                try { start.await(); } catch (InterruptedException ignored) { }
                if (e1.tryHold(uid, 0L, 7 * MIN)) winners.incrementAndGet();
                done.countDown();
            }).start();
        }
        start.countDown();
        done.await();
        say("  tryHold(E1) x100 -> winners = " + winners.get() + "   (must be exactly 1)");
        say("  E1 is " + e1.statusAt(t) + " by " + e1.holderAt(t));

        say("");
        say("=== 3. three seats or none ====================================");
        inv6.seat("D3").tryHold(rohan.id(), t, 7 * MIN);        // Rohan got there first
        try {
            svc.selectSeats("SH-6PM", List.of("D1", "D2", "D3"), aditi, t);
        } catch (IllegalStateException e) {
            say("  " + e.getMessage());
        }
        say("  D1 = " + inv6.seat("D1").statusAt(t) + " · D2 = " + inv6.seat("D2").statusAt(t)
            + "   <- rolled back, not left half-held");

        say("");
        say("=== 4. the hold expires =======================================");
        svc.selectSeats("SH-6PM", List.of("B1", "B2"), rohan, t);
        say("  t+0m  B1 = " + inv6.seat("B1").statusAt(t));
        long later = t + 8 * MIN;
        say("  t+8m  B1 = " + inv6.seat("B1").statusAt(later) + "   <- lazy expiry, on read");
        say("  sweeper freed " + svc.sweep("SH-6PM", later) + " more seat(s)");

        say("");
        say("=== 5. the payment fails ======================================");
        Booking b2 = svc.selectSeats("SH-6PM", List.of("A1", "A2"), aditi, later);
        gateway.declineNext = true;
        try { svc.confirm(b2.id, "PAY-88", later); }
        catch (RuntimeException e) { say("  charge failed: " + e.getMessage()); }
        say("  A1 = " + inv6.seat("A1").statusAt(later) + " · A2 = " + inv6.seat("A2").statusAt(later)
            + "   <- back in the pool immediately");

        say("");
        say("=== 6. the webhook fires twice ================================");
        Booking b3 = svc.selectSeats("SH-6PM", List.of("E5"), aditi, later);
        Booking first  = svc.confirm(b3.id, "PAY-99", later);
        Booking second = svc.confirm(b3.id, "PAY-99", later);    // duplicate delivery
        say("  first  -> " + first);
        say("  second -> " + second);
        say("  same booking object? " + (first == second)
            + "   successful charges = " + gateway.charges.get());

        say("");
        say("=== 7. swap the pricing rule ==================================");
        ShowInventory flat6 = ShowInventory.materialise(at6, new FlatPricing(20000L));
        say("  tier x time : C8@6PM " + Money.fmt(inv6.seat("C8").pricePaise)
            + " · C8@9PM " + Money.fmt(inv9.seat("C8").pricePaise)
            + " · E1@6PM " + Money.fmt(inv6.seat("E1").pricePaise));
        say("  flat        : C8@6PM " + Money.fmt(flat6.seat("C8").pricePaise)
            + " · E1@6PM " + Money.fmt(flat6.seat("E1").pricePaise));
        say("  0 lines of BookingService changed.");

        say("");
        say("=== 8. census =================================================");
        Map<SeatStatus, Integer> c = inv6.census(later);
        int sum = c.get(SeatStatus.AVAILABLE) + c.get(SeatStatus.HELD) + c.get(SeatStatus.BOOKED);
        say("  6PM " + c + "  total = " + sum + " (screen has " + screen2.seats.size() + " chairs)");
        say("  9PM " + inv9.census(later) + "  <- untouched by anything above");
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "bookmyshow.py",
        code: `"""BookMyShow - the bookable unit is a ShowSeat, taken by an atomic CAS.

Run:  python3 bookmyshow.py
"""
from __future__ import annotations

import threading
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional, Protocol

MINUTE_MS = 60_000


# ------------------------------------------------------------------- money --
def fmt(paise: int) -> str:
    """Every amount here is an integer number of paise. Never a float."""
    sign = "-" if paise < 0 else ""
    a = abs(paise)
    return f"{sign}Rs.{a // 100}.{a % 100:02d}"


class SeatTier(Enum):
    SILVER = "SILVER"
    GOLD = "GOLD"
    RECLINER = "RECLINER"


class SeatStatus(Enum):
    AVAILABLE = "AVAILABLE"
    HELD = "HELD"
    BOOKED = "BOOKED"


class BookingStatus(Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


# ------------------------------------------------------- the physical world --
@dataclass(frozen=True)
class User:
    id: str
    name: str


@dataclass(frozen=True)
class Seat:
    """Furniture. It never carries a status."""
    id: str
    row: str
    number: int
    tier: SeatTier

    @property
    def label(self) -> str:
        return f"{self.row}{self.number}"


@dataclass(frozen=True)
class Movie:
    id: str
    title: str
    runtime_mins: int


@dataclass(frozen=True)
class Screen:
    id: str
    name: str
    seats: List[Seat]

    @staticmethod
    def grid(sid: str, name: str, rows: List[str], per_row: int,
             tiers: Dict[str, SeatTier]) -> "Screen":
        seats = [Seat(f"{sid}-{r}{n}", r, n, tiers[r])
                 for r in rows for n in range(1, per_row + 1)]
        return Screen(sid, name, seats)


@dataclass(frozen=True)
class Theatre:
    id: str
    name: str
    city: str
    screens: List[Screen]


@dataclass(frozen=True)
class Show:
    """Movie x Screen x start time - the thing a customer books against."""
    id: str
    movie: Movie
    screen: Screen
    start_hour: int


# ----------------------------------------------------------------- pricing --
class PricingStrategy(Protocol):
    def price_in_paise(self, show: Show, seat: Seat) -> int: ...


class FlatPricing:
    def __init__(self, paise: int) -> None:
        self._paise = paise

    def price_in_paise(self, show: Show, seat: Seat) -> int:
        return self._paise


class TierAndTimePricing:
    BASE = {SeatTier.SILVER: 15000, SeatTier.GOLD: 25000, SeatTier.RECLINER: 45000}

    def price_in_paise(self, show: Show, seat: Seat) -> int:
        base = self.BASE[seat.tier]
        h = show.start_hour
        pct = 150 if h >= 21 else 130 if h >= 18 else 110 if h >= 12 else 90
        return base * pct // 100          # integer division - never drifts


# ------------------------------------------------------- THE BOOKABLE UNIT --
class ShowSeat:
    """One Seat at ONE Show. Its own lock guards its own three fields."""

    __slots__ = ("id", "show_id", "seat", "price_paise", "_lock",
                 "_status", "_held_by", "_expires_at", "_booking_id")

    def __init__(self, show_id: str, seat: Seat, price_paise: int) -> None:
        self.id = f"{show_id}:{seat.label}"       # also the canonical sort key
        self.show_id = show_id
        self.seat = seat
        self.price_paise = price_paise
        self._lock = threading.Lock()
        self._status = SeatStatus.AVAILABLE
        self._held_by: Optional[str] = None
        self._expires_at = 0
        self._booking_id: Optional[str] = None

    # ---- called with the lock already held --------------------------------
    def _expire_if_due(self, now: int) -> None:
        if self._status is SeatStatus.HELD and now >= self._expires_at:
            self._status = SeatStatus.AVAILABLE
            self._held_by = None
            self._expires_at = 0

    def status_at(self, now: int) -> SeatStatus:
        with self._lock:
            self._expire_if_due(now)
            return self._status

    def holder_at(self, now: int) -> Optional[str]:
        with self._lock:
            self._expire_if_due(now)
            return self._held_by

    def try_hold(self, user_id: str, now: int, ttl_ms: int) -> bool:
        """THE compare-and-set. Exactly one concurrent caller gets True."""
        with self._lock:
            self._expire_if_due(now)
            if self._status is SeatStatus.AVAILABLE:          # COMPARE
                self._status = SeatStatus.HELD                # ...and SET
                self._held_by = user_id
                self._expires_at = now + ttl_ms
                return True
            if self._status is SeatStatus.HELD and self._held_by == user_id:
                self._expires_at = now + ttl_ms               # extend my own hold
                return True
            return False

    def release(self, user_id: str, now: int) -> bool:
        with self._lock:
            self._expire_if_due(now)
            if self._status is SeatStatus.HELD and self._held_by == user_id:
                self._status = SeatStatus.AVAILABLE
                self._held_by = None
                self._expires_at = 0
                return True
            return False

    def confirm(self, user_id: str, booking_id: str, now: int) -> bool:
        with self._lock:
            if self._status is SeatStatus.BOOKED and self._booking_id == booking_id:
                return True                                   # replay-safe
            self._expire_if_due(now)
            if self._status is not SeatStatus.HELD or self._held_by != user_id:
                return False
            self._status = SeatStatus.BOOKED
            self._booking_id = booking_id
            self._held_by = None
            self._expires_at = 0
            return True

    def cancel(self, booking_id: str) -> bool:
        with self._lock:
            if self._status is SeatStatus.BOOKED and self._booking_id == booking_id:
                self._status = SeatStatus.AVAILABLE
                self._booking_id = None
                return True
            return False

    def sweep(self, now: int) -> bool:
        with self._lock:
            was_held = self._status is SeatStatus.HELD
            self._expire_if_due(now)
            return was_held and self._status is SeatStatus.AVAILABLE


class ShowInventory:
    def __init__(self, show: Show) -> None:
        self.show = show
        self._by_label: Dict[str, ShowSeat] = {}

    @staticmethod
    def materialise(show: Show, pricing: PricingStrategy) -> "ShowInventory":
        """One ShowSeat per Seat. This single line is the modelling insight."""
        inv = ShowInventory(show)
        for s in show.screen.seats:
            inv._by_label[s.label] = ShowSeat(show.id, s, pricing.price_in_paise(show, s))
        return inv

    def seat(self, label: str) -> ShowSeat:
        if label not in self._by_label:
            raise KeyError(f"no seat {label} in {self.show.id}")
        return self._by_label[label]

    def all(self) -> List[ShowSeat]:
        return list(self._by_label.values())

    def census(self, now: int) -> Dict[str, int]:
        out = {s.value: 0 for s in SeatStatus}
        for s in self._by_label.values():
            out[s.status_at(now).value] += 1
        return out


# ------------------------------------------------- all-or-nothing acquire ---
class SeatLockManager:
    def __init__(self, ttl_ms: int) -> None:
        self.ttl_ms = ttl_ms

    def hold_all(self, requested: List[ShowSeat], user_id: str, now: int):
        ordered = sorted(requested, key=lambda s: s.id)   # canonical order -> no deadlock
        taken: List[ShowSeat] = []
        for s in ordered:
            if s.try_hold(user_id, now, self.ttl_ms):
                taken.append(s)
                continue
            for t in reversed(taken):                     # ROLLBACK
                t.release(user_id, now)
            return (False, [], s.seat.label)
        return (True, taken, None)

    def release_all(self, seats: List[ShowSeat], user_id: str, now: int) -> None:
        for s in seats:
            s.release(user_id, now)

    def sweep_expired(self, seats: List[ShowSeat], now: int) -> int:
        return sum(1 for s in seats if s.sweep(now))


# ---------------------------------------------------------------- payments --
class PaymentDeclined(Exception):
    pass


class FakeGateway:
    def __init__(self) -> None:
        self.decline_next = False
        self.charges = 0

    def charge(self, booking_id: str, amount_paise: int) -> None:
        if self.decline_next:
            self.decline_next = False
            raise PaymentDeclined("card declined")
        self.charges += 1


# ----------------------------------------------------------------- booking --
@dataclass
class Booking:
    id: str
    user_id: str
    show_id: str
    seat_labels: List[str]
    amount_paise: int
    status: BookingStatus = BookingStatus.PENDING
    payment_ref: Optional[str] = None

    def __str__(self) -> str:
        return f"{self.id} {self.status.value} {self.seat_labels} {fmt(self.amount_paise)}"


class BookingService:
    MAX_SEATS_PER_BOOKING = 10

    def __init__(self, locks: SeatLockManager, gateway: FakeGateway) -> None:
        self._shows: Dict[str, ShowInventory] = {}
        self._bookings: Dict[str, Booking] = {}
        self._by_payment_ref: Dict[str, str] = {}     # the idempotency index
        self._locks = locks
        self._gateway = gateway
        self._seq = 1040
        # No lock on this object: the only contended thing is a ShowSeat,
        # and a ShowSeat guards itself.

    def add_show(self, inv: ShowInventory) -> None:
        self._shows[inv.show.id] = inv

    def select_seats(self, show_id: str, labels: List[str], user: User, now: int) -> Booking:
        if not 1 <= len(labels) <= self.MAX_SEATS_PER_BOOKING:
            raise ValueError(f"1..{self.MAX_SEATS_PER_BOOKING} seats per booking")
        inv = self._shows[show_id]
        want = [inv.seat(l) for l in labels]

        ok, held, blocked = self._locks.hold_all(want, user.id, now)
        if not ok:
            raise RuntimeError(f"seat {blocked} was just taken - nothing was held")

        self._seq += 1
        total = sum(s.price_paise for s in held)
        b = Booking(f"BK-{self._seq}", user.id, show_id, labels, total)
        self._bookings[b.id] = b
        return b

    def confirm(self, booking_id: str, payment_ref: str, now: int) -> Booking:
        seen = self._by_payment_ref.get(payment_ref)          # 1. replay?
        if seen is not None:
            return self._bookings[seen]

        b = self._bookings[booking_id]
        if b.status is BookingStatus.CONFIRMED:
            return b

        inv = self._shows[b.show_id]
        seats = [inv.seat(l) for l in b.seat_labels]

        for s in seats:                                       # 2. still mine?
            if s.status_at(now) is not SeatStatus.HELD or s.holder_at(now) != b.user_id:
                self._locks.release_all(seats, b.user_id, now)
                b.status = BookingStatus.FAILED
                raise RuntimeError(f"hold expired on {s.seat.label} - nothing was charged")

        try:
            self._gateway.charge(b.id, b.amount_paise)        # 3. slow hop, no lock held
        except PaymentDeclined:
            self._locks.release_all(seats, b.user_id, now)    # failure branch
            b.status = BookingStatus.FAILED
            raise

        for s in seats:                                       # 4. HELD -> BOOKED
            s.confirm(b.user_id, b.id, now)
        b.status = BookingStatus.CONFIRMED
        b.payment_ref = payment_ref
        self._by_payment_ref.setdefault(payment_ref, b.id)    # 5. remember the key
        return b

    def cancel(self, booking_id: str, minutes_before_show: int) -> int:
        b = self._bookings[booking_id]
        if b.status is not BookingStatus.CONFIRMED:
            return 0
        inv = self._shows[b.show_id]
        for l in b.seat_labels:
            inv.seat(l).cancel(b.id)
        b.status = BookingStatus.CANCELLED
        if minutes_before_show >= 120:
            return b.amount_paise
        if minutes_before_show >= 20:
            return b.amount_paise // 2
        return 0

    def sweep(self, show_id: str, now: int) -> int:
        return self._locks.sweep_expired(self._shows[show_id].all(), now)


# --------------------------------------------------------------------- demo --
def main() -> None:
    tiers = {"A": SeatTier.SILVER, "B": SeatTier.SILVER,
             "C": SeatTier.GOLD, "D": SeatTier.GOLD, "E": SeatTier.RECLINER}
    screen2 = Screen.grid("SCR-2", "Screen 2", ["A", "B", "C", "D", "E"], 8, tiers)
    dune = Movie("MV-1", "Dune", 155)
    Theatre("TH-1", "Forum Multiplex", "Bengaluru", [screen2])

    pricing = TierAndTimePricing()
    at6 = Show("SH-6PM", dune, screen2, 18)
    at9 = Show("SH-9PM", dune, screen2, 21)
    inv6 = ShowInventory.materialise(at6, pricing)
    inv9 = ShowInventory.materialise(at9, pricing)

    gateway = FakeGateway()
    svc = BookingService(SeatLockManager(7 * MINUTE_MS), gateway)
    svc.add_show(inv6)
    svc.add_show(inv9)

    aditi, rohan = User("U1", "Aditi"), User("U2", "Rohan")
    t = 0                                        # the clock is a PARAMETER

    print("=== 1. the same chair, two shows ==============================")
    b1 = svc.select_seats("SH-6PM", ["C6", "C7", "C8"], aditi, t)
    print("selectSeats(6PM, [C6,C7,C8], Aditi) ->", b1)
    print("confirm ->", svc.confirm(b1.id, "PAY-77", t))
    print("  C8 @ 6PM :", inv6.seat("C8").status_at(t).value, fmt(inv6.seat("C8").price_paise))
    print("  C8 @ 9PM :", inv9.seat("C8").status_at(t).value, fmt(inv9.seat("C8").price_paise))
    print("  ^ a boolean on Seat cannot print those two lines")

    print("\\n=== 2. one hundred people, one seat ===========================")
    e1 = inv6.seat("E1")
    winners = []
    gate = threading.Barrier(100)

    def racer(i: int) -> None:
        gate.wait()
        if e1.try_hold(f"racer-{i}", 0, 7 * MINUTE_MS):
            winners.append(i)

    threads = [threading.Thread(target=racer, args=(i,)) for i in range(100)]
    for th in threads:
        th.start()
    for th in threads:
        th.join()
    print(f"  try_hold(E1) x100 -> winners = {len(winners)}   (must be exactly 1)")
    print("  E1 is", e1.status_at(t).value, "by", e1.holder_at(t))

    print("\\n=== 3. three seats or none ====================================")
    inv6.seat("D3").try_hold(rohan.id, t, 7 * MINUTE_MS)
    try:
        svc.select_seats("SH-6PM", ["D1", "D2", "D3"], aditi, t)
    except RuntimeError as e:
        print("  ", e)
    print("  D1 =", inv6.seat("D1").status_at(t).value,
          "· D2 =", inv6.seat("D2").status_at(t).value, "  <- rolled back")

    print("\\n=== 4. the hold expires =======================================")
    svc.select_seats("SH-6PM", ["B1", "B2"], rohan, t)
    print("  t+0m  B1 =", inv6.seat("B1").status_at(t).value)
    later = t + 8 * MINUTE_MS
    print("  t+8m  B1 =", inv6.seat("B1").status_at(later).value, "  <- lazy expiry, on read")
    print("  sweeper freed", svc.sweep("SH-6PM", later), "more seat(s)")

    print("\\n=== 5. the payment fails ======================================")
    b2 = svc.select_seats("SH-6PM", ["A1", "A2"], aditi, later)
    gateway.decline_next = True
    try:
        svc.confirm(b2.id, "PAY-88", later)
    except PaymentDeclined as e:
        print("  charge failed:", e)
    print("  A1 =", inv6.seat("A1").status_at(later).value,
          "· A2 =", inv6.seat("A2").status_at(later).value, "  <- back in the pool")

    print("\\n=== 6. the webhook fires twice ================================")
    b3 = svc.select_seats("SH-6PM", ["E5"], aditi, later)
    first = svc.confirm(b3.id, "PAY-99", later)
    second = svc.confirm(b3.id, "PAY-99", later)
    print("  first  ->", first)
    print("  second ->", second)
    print("  same booking object?", first is second, "  successful charges =", gateway.charges)

    print("\\n=== 7. swap the pricing rule ==================================")
    flat6 = ShowInventory.materialise(at6, FlatPricing(20000))
    print("  tier x time : C8@6PM", fmt(inv6.seat("C8").price_paise),
          "· C8@9PM", fmt(inv9.seat("C8").price_paise),
          "· E1@6PM", fmt(inv6.seat("E1").price_paise))
    print("  flat        : C8@6PM", fmt(flat6.seat("C8").price_paise),
          "· E1@6PM", fmt(flat6.seat("E1").price_paise))
    print("  0 lines of BookingService changed.")

    print("\\n=== 8. census =================================================")
    c = inv6.census(later)
    print("  6PM", c, " total =", sum(c.values()), "(screen has", len(screen2.seats), "chairs)")
    print("  9PM", inv9.census(later), " <- untouched by anything above")


if __name__ == "__main__":
    main()`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "bookmyshow.cpp",
        code: `// BookMyShow - ShowSeat is the bookable unit; taking it is one atomic step.
// build: g++ -std=c++17 -pthread bookmyshow.cpp -o bms && ./bms
#include <algorithm>
#include <iostream>
#include <map>
#include <memory>
#include <mutex>
#include <stdexcept>
#include <string>
#include <thread>
#include <vector>

static const long long MINUTE_MS = 60000;

/* ---------------------------------------------------------------- money -- */
static std::string fmt(long long paise) {           // integer paise, never a double
    std::string sign = paise < 0 ? "-" : "";
    long long a = paise < 0 ? -paise : paise;
    std::string p = std::to_string(a % 100);
    if (p.size() < 2) p = "0" + p;
    return sign + "Rs." + std::to_string(a / 100) + "." + p;
}

enum class SeatTier   { SILVER, GOLD, RECLINER };
enum class SeatStatus { AVAILABLE, HELD, BOOKED };
enum class BookingStatus { PENDING, CONFIRMED, FAILED, CANCELLED };

static const char* name(SeatStatus s) {
    switch (s) {
        case SeatStatus::AVAILABLE: return "AVAILABLE";
        case SeatStatus::HELD:      return "HELD";
        default:                    return "BOOKED";
    }
}

/* ----------------------------------------------------- the physical world */
struct User  { std::string id, name; };
struct Movie { std::string id, title; int runtimeMins; };

/** Furniture. It never carries a status. */
struct Seat {
    std::string id, row;
    int number;
    SeatTier tier;
    std::string label() const { return row + std::to_string(number); }
};

struct Screen {
    std::string id, name;
    std::vector<Seat> seats;
    static Screen grid(const std::string& sid, const std::string& nm,
                       const std::vector<std::string>& rows, int perRow,
                       const std::map<std::string, SeatTier>& tiers) {
        Screen s{sid, nm, {}};
        for (const auto& r : rows)
            for (int n = 1; n <= perRow; ++n)
                s.seats.push_back(Seat{sid + "-" + r + std::to_string(n), r, n, tiers.at(r)});
        return s;
    }
};

/** Movie x Screen x start time. */
struct Show {
    std::string id;
    Movie movie;
    Screen screen;
    int startHour;
};

/* -------------------------------------------------------------- pricing -- */
struct PricingStrategy {
    virtual ~PricingStrategy() = default;
    virtual long long priceInPaise(const Show& show, const Seat& seat) const = 0;
};

struct FlatPricing : PricingStrategy {
    long long paise;
    explicit FlatPricing(long long p) : paise(p) {}
    long long priceInPaise(const Show&, const Seat&) const override { return paise; }
};

struct TierAndTimePricing : PricingStrategy {
    long long priceInPaise(const Show& show, const Seat& seat) const override {
        long long base = seat.tier == SeatTier::SILVER   ? 15000
                       : seat.tier == SeatTier::GOLD     ? 25000
                                                         : 45000;
        int pct = show.startHour >= 21 ? 150
                : show.startHour >= 18 ? 130
                : show.startHour >= 12 ? 110
                                       : 90;
        return base * pct / 100;                     // integer maths
    }
};

/* ---------------------------------------------------- THE BOOKABLE UNIT -- */
class ShowSeat {
public:
    const std::string id;                            // "SH-6PM:C8" - the sort key
    const std::string showId;
    const Seat seat;
    const long long pricePaise;

    ShowSeat(std::string sid, Seat st, long long price)
        : id(sid + ":" + st.label()), showId(std::move(sid)),
          seat(std::move(st)), pricePaise(price) {}

    SeatStatus statusAt(long long now) {
        std::lock_guard<std::mutex> g(m_);
        expireIfDue(now);
        return status_;
    }
    std::string holderAt(long long now) {
        std::lock_guard<std::mutex> g(m_);
        expireIfDue(now);
        return heldBy_;
    }

    /** THE compare-and-set. One caller wins; the rest get false immediately. */
    bool tryHold(const std::string& userId, long long now, long long ttlMs) {
        std::lock_guard<std::mutex> g(m_);
        expireIfDue(now);
        if (status_ == SeatStatus::AVAILABLE) {      // COMPARE
            status_ = SeatStatus::HELD;              // ...and SET
            heldBy_ = userId;
            expiresAt_ = now + ttlMs;
            return true;
        }
        if (status_ == SeatStatus::HELD && heldBy_ == userId) {
            expiresAt_ = now + ttlMs;                // extend my own hold
            return true;
        }
        return false;
    }

    bool release(const std::string& userId, long long now) {
        std::lock_guard<std::mutex> g(m_);
        expireIfDue(now);
        if (status_ == SeatStatus::HELD && heldBy_ == userId) {
            status_ = SeatStatus::AVAILABLE; heldBy_.clear(); expiresAt_ = 0;
            return true;
        }
        return false;
    }

    bool confirm(const std::string& userId, const std::string& bookingId, long long now) {
        std::lock_guard<std::mutex> g(m_);
        if (status_ == SeatStatus::BOOKED && bookingId_ == bookingId) return true;  // replay
        expireIfDue(now);
        if (status_ != SeatStatus::HELD || heldBy_ != userId) return false;
        status_ = SeatStatus::BOOKED; bookingId_ = bookingId;
        heldBy_.clear(); expiresAt_ = 0;
        return true;
    }

    bool cancel(const std::string& bookingId) {
        std::lock_guard<std::mutex> g(m_);
        if (status_ == SeatStatus::BOOKED && bookingId_ == bookingId) {
            status_ = SeatStatus::AVAILABLE; bookingId_.clear();
            return true;
        }
        return false;
    }

    bool sweep(long long now) {
        std::lock_guard<std::mutex> g(m_);
        bool wasHeld = status_ == SeatStatus::HELD;
        expireIfDue(now);
        return wasHeld && status_ == SeatStatus::AVAILABLE;
    }

private:
    std::mutex m_;
    SeatStatus status_ = SeatStatus::AVAILABLE;
    std::string heldBy_, bookingId_;
    long long expiresAt_ = 0;

    void expireIfDue(long long now) {                // caller already holds m_
        if (status_ == SeatStatus::HELD && now >= expiresAt_) {
            status_ = SeatStatus::AVAILABLE; heldBy_.clear(); expiresAt_ = 0;
        }
    }
};

/* -------------------------------------------- one Show's worth of seats -- */
class ShowInventory {
public:
    Show show;

    /** One ShowSeat per Seat. This is the modelling insight, in one loop. */
    static std::unique_ptr<ShowInventory> materialise(const Show& show,
                                                      const PricingStrategy& pricing) {
        auto inv = std::unique_ptr<ShowInventory>(new ShowInventory(show));
        for (const auto& s : show.screen.seats) {
            inv->owned_.push_back(std::unique_ptr<ShowSeat>(
                new ShowSeat(show.id, s, pricing.priceInPaise(show, s))));
            inv->byLabel_[s.label()] = inv->owned_.back().get();
        }
        return inv;
    }

    ShowSeat* seat(const std::string& label) {
        auto it = byLabel_.find(label);
        if (it == byLabel_.end()) throw std::runtime_error("no seat " + label);
        return it->second;
    }
    std::vector<ShowSeat*> all() {
        std::vector<ShowSeat*> out;
        for (auto& kv : byLabel_) out.push_back(kv.second);
        return out;
    }
    std::string census(long long now) {
        int a = 0, h = 0, b = 0;
        for (auto& kv : byLabel_) {
            switch (kv.second->statusAt(now)) {
                case SeatStatus::AVAILABLE: ++a; break;
                case SeatStatus::HELD:      ++h; break;
                default:                    ++b; break;
            }
        }
        return "available=" + std::to_string(a) + " held=" + std::to_string(h) +
               " booked=" + std::to_string(b) + " total=" + std::to_string(a + h + b);
    }

private:
    explicit ShowInventory(const Show& s) : show(s) {}
    std::vector<std::unique_ptr<ShowSeat>> owned_;
    std::map<std::string, ShowSeat*> byLabel_;
};

/* ------------------------------------------- all-or-nothing acquisition -- */
struct HoldResult {
    bool ok;
    std::vector<ShowSeat*> held;
    std::string blockedBy;
};

class SeatLockManager {
public:
    explicit SeatLockManager(long long ttlMs) : ttlMs_(ttlMs) {}

    HoldResult holdAll(std::vector<ShowSeat*> want, const std::string& userId, long long now) {
        std::sort(want.begin(), want.end(),                       // canonical order
                  [](ShowSeat* a, ShowSeat* b) { return a->id < b->id; });
        std::vector<ShowSeat*> taken;
        for (ShowSeat* s : want) {
            if (s->tryHold(userId, now, ttlMs_)) { taken.push_back(s); continue; }
            for (auto it = taken.rbegin(); it != taken.rend(); ++it)   // ROLLBACK
                (*it)->release(userId, now);
            return HoldResult{false, {}, s->seat.label()};
        }
        return HoldResult{true, taken, ""};
    }

    void releaseAll(const std::vector<ShowSeat*>& seats, const std::string& userId, long long now) {
        for (ShowSeat* s : seats) s->release(userId, now);
    }
    int sweepExpired(const std::vector<ShowSeat*>& seats, long long now) {
        int freed = 0;
        for (ShowSeat* s : seats) if (s->sweep(now)) ++freed;
        return freed;
    }

private:
    long long ttlMs_;
};

/* ------------------------------------------------------------- payments -- */
struct PaymentDeclined : std::runtime_error {
    PaymentDeclined() : std::runtime_error("card declined") {}
};

struct FakeGateway {
    bool declineNext = false;
    int charges = 0;
    void charge(const std::string&, long long) {
        if (declineNext) { declineNext = false; throw PaymentDeclined(); }
        ++charges;
    }
};

/* -------------------------------------------------------------- booking -- */
struct Booking {
    std::string id, userId, showId;
    std::vector<std::string> seatLabels;
    long long amountPaise = 0;
    BookingStatus status = BookingStatus::PENDING;
    std::string paymentRef;
    std::string str() const {
        std::string s = id + " " +
            (status == BookingStatus::CONFIRMED ? "CONFIRMED"
             : status == BookingStatus::FAILED  ? "FAILED"
             : status == BookingStatus::CANCELLED ? "CANCELLED" : "PENDING") + " [";
        for (size_t i = 0; i < seatLabels.size(); ++i)
            s += (i ? "," : "") + seatLabels[i];
        return s + "] " + fmt(amountPaise);
    }
};

class BookingService {
public:
    static const int MAX_SEATS_PER_BOOKING = 10;

    BookingService(SeatLockManager& locks, FakeGateway& gw) : locks_(locks), gw_(gw) {}

    void addShow(ShowInventory* inv) { shows_[inv->show.id] = inv; }

    Booking* selectSeats(const std::string& showId, const std::vector<std::string>& labels,
                         const User& user, long long now) {
        if (labels.empty() || (int)labels.size() > MAX_SEATS_PER_BOOKING)
            throw std::runtime_error("too many seats in one booking");
        ShowInventory* inv = shows_.at(showId);
        std::vector<ShowSeat*> want;
        for (const auto& l : labels) want.push_back(inv->seat(l));

        HoldResult r = locks_.holdAll(want, user.id, now);
        if (!r.ok)
            throw std::runtime_error("seat " + r.blockedBy + " was just taken - nothing was held");

        long long total = 0;
        for (ShowSeat* s : r.held) total += s->pricePaise;
        Booking b;
        b.id = "BK-" + std::to_string(++seq_);
        b.userId = user.id; b.showId = showId; b.seatLabels = labels; b.amountPaise = total;
        bookings_[b.id] = b;
        return &bookings_[b.id];
    }

    /** Idempotent on paymentRef - a retried webhook must change nothing. */
    Booking* confirm(const std::string& bookingId, const std::string& paymentRef, long long now) {
        auto seen = byPaymentRef_.find(paymentRef);              // 1. replay?
        if (seen != byPaymentRef_.end()) return &bookings_[seen->second];

        Booking& b = bookings_.at(bookingId);
        if (b.status == BookingStatus::CONFIRMED) return &b;

        ShowInventory* inv = shows_.at(b.showId);
        std::vector<ShowSeat*> seats;
        for (const auto& l : b.seatLabels) seats.push_back(inv->seat(l));

        for (ShowSeat* s : seats)                                 // 2. still mine?
            if (s->statusAt(now) != SeatStatus::HELD || s->holderAt(now) != b.userId) {
                locks_.releaseAll(seats, b.userId, now);
                b.status = BookingStatus::FAILED;
                throw std::runtime_error("hold expired on " + s->seat.label());
            }

        try {
            gw_.charge(b.id, b.amountPaise);                      // 3. slow hop, no lock held
        } catch (const PaymentDeclined&) {
            locks_.releaseAll(seats, b.userId, now);              // failure branch
            b.status = BookingStatus::FAILED;
            throw;
        }

        for (ShowSeat* s : seats) s->confirm(b.userId, b.id, now);// 4. HELD -> BOOKED
        b.status = BookingStatus::CONFIRMED;
        b.paymentRef = paymentRef;
        byPaymentRef_.emplace(paymentRef, b.id);                  // 5. remember the key
        return &b;
    }

    int sweep(const std::string& showId, long long now) {
        return locks_.sweepExpired(shows_.at(showId)->all(), now);
    }

private:
    std::map<std::string, ShowInventory*> shows_;
    std::map<std::string, Booking> bookings_;
    std::map<std::string, std::string> byPaymentRef_;
    SeatLockManager& locks_;
    FakeGateway& gw_;
    int seq_ = 1040;
};

/* ------------------------------------------------------------------ demo -- */
int main() {
    std::map<std::string, SeatTier> tiers{
        {"A", SeatTier::SILVER}, {"B", SeatTier::SILVER},
        {"C", SeatTier::GOLD},   {"D", SeatTier::GOLD},
        {"E", SeatTier::RECLINER}};
    Screen screen2 = Screen::grid("SCR-2", "Screen 2", {"A", "B", "C", "D", "E"}, 8, tiers);
    Movie dune{"MV-1", "Dune", 155};

    TierAndTimePricing pricing;
    Show at6{"SH-6PM", dune, screen2, 18};
    Show at9{"SH-9PM", dune, screen2, 21};
    auto inv6 = ShowInventory::materialise(at6, pricing);
    auto inv9 = ShowInventory::materialise(at9, pricing);

    FakeGateway gw;
    SeatLockManager locks(7 * MINUTE_MS);
    BookingService svc(locks, gw);
    svc.addShow(inv6.get());
    svc.addShow(inv9.get());

    User aditi{"U1", "Aditi"}, rohan{"U2", "Rohan"};
    long long t = 0;                                    // the clock is a PARAMETER

    std::cout << "=== 1. the same chair, two shows ==========================\\n";
    Booking* b1 = svc.selectSeats("SH-6PM", {"C6", "C7", "C8"}, aditi, t);
    std::cout << "selectSeats -> " << b1->str() << "\\n";
    std::cout << "confirm     -> " << svc.confirm(b1->id, "PAY-77", t)->str() << "\\n";
    std::cout << "  C8 @ 6PM : " << name(inv6->seat("C8")->statusAt(t))
              << " " << fmt(inv6->seat("C8")->pricePaise) << "\\n";
    std::cout << "  C8 @ 9PM : " << name(inv9->seat("C8")->statusAt(t))
              << " " << fmt(inv9->seat("C8")->pricePaise) << "\\n";

    std::cout << "\\n=== 2. one hundred people, one seat =======================\\n";
    ShowSeat* e1 = inv6->seat("E1");
    std::atomic<int> winners{0};
    std::vector<std::thread> ts;
    for (int i = 0; i < 100; ++i)
        ts.emplace_back([e1, i, &winners] {
            if (e1->tryHold("racer-" + std::to_string(i), 0, 7 * MINUTE_MS)) ++winners;
        });
    for (auto& th : ts) th.join();
    std::cout << "  tryHold(E1) x100 -> winners = " << winners.load()
              << "   (must be exactly 1)\\n";
    std::cout << "  E1 is " << name(e1->statusAt(t)) << " by " << e1->holderAt(t) << "\\n";

    std::cout << "\\n=== 3. three seats or none ================================\\n";
    inv6->seat("D3")->tryHold(rohan.id, t, 7 * MINUTE_MS);
    try {
        svc.selectSeats("SH-6PM", {"D1", "D2", "D3"}, aditi, t);
    } catch (const std::exception& e) {
        std::cout << "  " << e.what() << "\\n";
    }
    std::cout << "  D1 = " << name(inv6->seat("D1")->statusAt(t))
              << " D2 = " << name(inv6->seat("D2")->statusAt(t)) << "   <- rolled back\\n";

    std::cout << "\\n=== 4. the hold expires ===================================\\n";
    svc.selectSeats("SH-6PM", {"B1", "B2"}, rohan, t);
    std::cout << "  t+0m  B1 = " << name(inv6->seat("B1")->statusAt(t)) << "\\n";
    long long later = t + 8 * MINUTE_MS;
    std::cout << "  t+8m  B1 = " << name(inv6->seat("B1")->statusAt(later))
              << "   <- lazy expiry, on read\\n";
    std::cout << "  sweeper freed " << svc.sweep("SH-6PM", later) << " more seat(s)\\n";

    std::cout << "\\n=== 5. the payment fails ==================================\\n";
    Booking* b2 = svc.selectSeats("SH-6PM", {"A1", "A2"}, aditi, later);
    gw.declineNext = true;
    try { svc.confirm(b2->id, "PAY-88", later); }
    catch (const std::exception& e) { std::cout << "  charge failed: " << e.what() << "\\n"; }
    std::cout << "  A1 = " << name(inv6->seat("A1")->statusAt(later))
              << " A2 = " << name(inv6->seat("A2")->statusAt(later)) << "   <- back in the pool\\n";

    std::cout << "\\n=== 6. the webhook fires twice ============================\\n";
    Booking* b3 = svc.selectSeats("SH-6PM", {"E5"}, aditi, later);
    Booking* first  = svc.confirm(b3->id, "PAY-99", later);
    Booking* second = svc.confirm(b3->id, "PAY-99", later);
    std::cout << "  first  -> " << first->str() << "\\n";
    std::cout << "  second -> " << second->str() << "\\n";
    std::cout << "  same booking? " << (first == second)
              << "   successful charges = " << gw.charges << "\\n";

    std::cout << "\\n=== 7. swap the pricing rule ==============================\\n";
    FlatPricing flat(20000);
    auto flat6 = ShowInventory::materialise(at6, flat);
    std::cout << "  tier x time : C8@6PM " << fmt(inv6->seat("C8")->pricePaise)
              << " C8@9PM " << fmt(inv9->seat("C8")->pricePaise)
              << " E1@6PM " << fmt(inv6->seat("E1")->pricePaise) << "\\n";
    std::cout << "  flat        : C8@6PM " << fmt(flat6->seat("C8")->pricePaise)
              << " E1@6PM " << fmt(flat6->seat("E1")->pricePaise) << "\\n";
    std::cout << "  0 lines of BookingService changed.\\n";

    std::cout << "\\n=== 8. census ============================================\\n";
    std::cout << "  6PM " << inv6->census(later) << "\\n";
    std::cout << "  9PM " << inv9->census(later) << "   <- untouched\\n";
    return 0;
}`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "bookmyshow.ts",
        code: `/**
 * BookMyShow - ShowSeat is the bookable unit; taking it is one atomic step.
 *
 * JS runs one turn at a time, so tryHold() here cannot be interrupted mid-way.
 * That is exactly the property you must BUY in Java (a lock) and in a cluster
 * (a conditional UPDATE). The shape of the method is what matters:
 *
 *   UPDATE show_seat SET status='HELD', held_by=?, expires_at=?
 *   WHERE id=? AND status='AVAILABLE'        -- then assert rowsAffected === 1
 *
 * run: npx tsx bookmyshow.ts
 */

const MINUTE_MS = 60_000;

/* ---------------------------------------------------------------- money -- */
const fmt = (paise: number): string => {
  const sign = paise < 0 ? "-" : "";
  const a = Math.abs(paise);
  return sign + "Rs." + Math.floor(a / 100) + "." + String(a % 100).padStart(2, "0");
};

type SeatTier = "SILVER" | "GOLD" | "RECLINER";
type SeatStatus = "AVAILABLE" | "HELD" | "BOOKED";
type BookingStatus = "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED";

/* ----------------------------------------------------- the physical world */
interface User { id: string; name: string; }
interface Movie { id: string; title: string; runtimeMins: number; }

/** Furniture. It never carries a status. */
interface Seat { id: string; row: string; number: number; tier: SeatTier; }
const label = (s: Seat) => s.row + s.number;

interface Screen { id: string; name: string; seats: Seat[]; }

const gridScreen = (
  id: string, name: string, rows: string[], perRow: number,
  tiers: Record<string, SeatTier>,
): Screen => ({
  id, name,
  seats: rows.flatMap((r) =>
    Array.from({ length: perRow }, (_, i) => ({
      id: id + "-" + r + (i + 1), row: r, number: i + 1, tier: tiers[r],
    }))),
});

/** Movie x Screen x start time. */
interface Show { id: string; movie: Movie; screen: Screen; startHour: number; }

/* -------------------------------------------------------------- pricing -- */
interface PricingStrategy {
  /** Integer paise. Never a float. */
  priceInPaise(show: Show, seat: Seat): number;
}

class FlatPricing implements PricingStrategy {
  constructor(private readonly paise: number) {}
  priceInPaise(): number { return this.paise; }
}

class TierAndTimePricing implements PricingStrategy {
  private static BASE: Record<SeatTier, number> =
    { SILVER: 15000, GOLD: 25000, RECLINER: 45000 };
  priceInPaise(show: Show, seat: Seat): number {
    const base = TierAndTimePricing.BASE[seat.tier];
    const h = show.startHour;
    const pct = h >= 21 ? 150 : h >= 18 ? 130 : h >= 12 ? 110 : 90;
    return Math.floor((base * pct) / 100);
  }
}

/* ---------------------------------------------------- THE BOOKABLE UNIT -- */
class ShowSeat {
  readonly id: string;
  private status: SeatStatus = "AVAILABLE";
  private heldBy: string | null = null;
  private expiresAt = 0;
  private bookingId: string | null = null;

  constructor(readonly showId: string, readonly seat: Seat, readonly pricePaise: number) {
    this.id = showId + ":" + label(seat);           // also the canonical sort key
  }

  private expireIfDue(now: number): void {
    if (this.status === "HELD" && now >= this.expiresAt) {
      this.status = "AVAILABLE"; this.heldBy = null; this.expiresAt = 0;
    }
  }

  statusAt(now: number): SeatStatus { this.expireIfDue(now); return this.status; }
  holderAt(now: number): string | null { this.expireIfDue(now); return this.heldBy; }

  /** THE compare-and-set. One caller wins; every other caller gets false. */
  tryHold(userId: string, now: number, ttlMs: number): boolean {
    this.expireIfDue(now);
    if (this.status === "AVAILABLE") {              // COMPARE
      this.status = "HELD";                         // ...and SET
      this.heldBy = userId;
      this.expiresAt = now + ttlMs;
      return true;
    }
    if (this.status === "HELD" && this.heldBy === userId) {
      this.expiresAt = now + ttlMs;                 // extend my own hold
      return true;
    }
    return false;
  }

  release(userId: string, now: number): boolean {
    this.expireIfDue(now);
    if (this.status === "HELD" && this.heldBy === userId) {
      this.status = "AVAILABLE"; this.heldBy = null; this.expiresAt = 0;
      return true;
    }
    return false;
  }

  confirm(userId: string, bookingId: string, now: number): boolean {
    if (this.status === "BOOKED" && this.bookingId === bookingId) return true;  // replay
    this.expireIfDue(now);
    if (this.status !== "HELD" || this.heldBy !== userId) return false;
    this.status = "BOOKED"; this.bookingId = bookingId;
    this.heldBy = null; this.expiresAt = 0;
    return true;
  }

  cancel(bookingId: string): boolean {
    if (this.status === "BOOKED" && this.bookingId === bookingId) {
      this.status = "AVAILABLE"; this.bookingId = null;
      return true;
    }
    return false;
  }

  sweep(now: number): boolean {
    const wasHeld = this.status === "HELD";
    this.expireIfDue(now);
    return wasHeld && this.status === "AVAILABLE";
  }
}

/* -------------------------------------------- one Show's worth of seats -- */
class ShowInventory {
  private readonly byLabel = new Map<string, ShowSeat>();
  private constructor(readonly show: Show) {}

  /** One ShowSeat per Seat. This loop is the whole modelling insight. */
  static materialise(show: Show, pricing: PricingStrategy): ShowInventory {
    const inv = new ShowInventory(show);
    for (const s of show.screen.seats)
      inv.byLabel.set(label(s), new ShowSeat(show.id, s, pricing.priceInPaise(show, s)));
    return inv;
  }

  seat(l: string): ShowSeat {
    const s = this.byLabel.get(l);
    if (!s) throw new Error("no seat " + l + " in " + this.show.id);
    return s;
  }
  all(): ShowSeat[] { return [...this.byLabel.values()]; }

  census(now: number): Record<string, number> {
    const out: Record<string, number> = { AVAILABLE: 0, HELD: 0, BOOKED: 0 };
    for (const s of this.byLabel.values()) out[s.statusAt(now)]++;
    return out;
  }
}

/* ------------------------------------------- all-or-nothing acquisition -- */
type HoldResult =
  | { ok: true; held: ShowSeat[] }
  | { ok: false; blockedBy: string };

class SeatLockManager {
  constructor(private readonly ttlMs: number) {}

  holdAll(requested: ShowSeat[], userId: string, now: number): HoldResult {
    const ordered = [...requested].sort((a, b) => (a.id < b.id ? -1 : 1)); // canonical order
    const taken: ShowSeat[] = [];
    for (const s of ordered) {
      if (s.tryHold(userId, now, this.ttlMs)) { taken.push(s); continue; }
      for (const t of [...taken].reverse()) t.release(userId, now);        // ROLLBACK
      return { ok: false, blockedBy: label(s.seat) };
    }
    return { ok: true, held: taken };
  }

  releaseAll(seats: ShowSeat[], userId: string, now: number): void {
    for (const s of seats) s.release(userId, now);
  }
  sweepExpired(seats: ShowSeat[], now: number): number {
    return seats.filter((s) => s.sweep(now)).length;
  }
}

/* ------------------------------------------------------------- payments -- */
class PaymentDeclined extends Error {
  constructor() { super("card declined"); }
}

class FakeGateway {
  declineNext = false;
  charges = 0;
  charge(_bookingId: string, _amountPaise: number): void {
    if (this.declineNext) { this.declineNext = false; throw new PaymentDeclined(); }
    this.charges++;
  }
}

/* -------------------------------------------------------------- booking -- */
interface Booking {
  id: string; userId: string; showId: string;
  seatLabels: string[]; amountPaise: number;
  status: BookingStatus; paymentRef?: string;
}
const describe = (b: Booking) =>
  b.id + " " + b.status + " [" + b.seatLabels.join(",") + "] " + fmt(b.amountPaise);

class BookingService {
  static readonly MAX_SEATS_PER_BOOKING = 10;

  private readonly shows = new Map<string, ShowInventory>();
  private readonly bookings = new Map<string, Booking>();
  private readonly byPaymentRef = new Map<string, string>();   // idempotency index
  private seq = 1040;

  constructor(private readonly locks: SeatLockManager, private readonly gateway: FakeGateway) {}

  addShow(inv: ShowInventory): void { this.shows.set(inv.show.id, inv); }

  selectSeats(showId: string, labels: string[], user: User, now: number): Booking {
    if (labels.length < 1 || labels.length > BookingService.MAX_SEATS_PER_BOOKING)
      throw new Error("1..10 seats per booking");
    const inv = this.shows.get(showId)!;
    const want = labels.map((l) => inv.seat(l));

    const r = this.locks.holdAll(want, user.id, now);
    if (!r.ok) throw new Error("seat " + r.blockedBy + " was just taken - nothing was held");

    const total = r.held.reduce((sum, s) => sum + s.pricePaise, 0);
    const b: Booking = {
      id: "BK-" + (++this.seq), userId: user.id, showId,
      seatLabels: labels, amountPaise: total, status: "PENDING",
    };
    this.bookings.set(b.id, b);
    return b;
  }

  /** Idempotent on paymentRef - a retried webhook must change nothing. */
  confirm(bookingId: string, paymentRef: string, now: number): Booking {
    const seen = this.byPaymentRef.get(paymentRef);            // 1. replay?
    if (seen) return this.bookings.get(seen)!;

    const b = this.bookings.get(bookingId)!;
    if (b.status === "CONFIRMED") return b;

    const inv = this.shows.get(b.showId)!;
    const seats = b.seatLabels.map((l) => inv.seat(l));

    for (const s of seats)                                     // 2. still mine?
      if (s.statusAt(now) !== "HELD" || s.holderAt(now) !== b.userId) {
        this.locks.releaseAll(seats, b.userId, now);
        b.status = "FAILED";
        throw new Error("hold expired on " + label(s.seat) + " - nothing was charged");
      }

    try {
      this.gateway.charge(b.id, b.amountPaise);                // 3. slow hop, no lock held
    } catch (e) {
      this.locks.releaseAll(seats, b.userId, now);             // failure branch
      b.status = "FAILED";
      throw e;
    }

    for (const s of seats) s.confirm(b.userId, b.id, now);     // 4. HELD -> BOOKED
    b.status = "CONFIRMED";
    b.paymentRef = paymentRef;
    if (!this.byPaymentRef.has(paymentRef)) this.byPaymentRef.set(paymentRef, b.id);
    return b;
  }

  cancel(bookingId: string, minutesBeforeShow: number): number {
    const b = this.bookings.get(bookingId)!;
    if (b.status !== "CONFIRMED") return 0;
    const inv = this.shows.get(b.showId)!;
    for (const l of b.seatLabels) inv.seat(l).cancel(b.id);
    b.status = "CANCELLED";
    if (minutesBeforeShow >= 120) return b.amountPaise;
    if (minutesBeforeShow >= 20) return Math.floor(b.amountPaise / 2);
    return 0;
  }

  sweep(showId: string, now: number): number {
    return this.locks.sweepExpired(this.shows.get(showId)!.all(), now);
  }
}

/* ------------------------------------------------------------------ demo -- */
function main(): void {
  const tiers: Record<string, SeatTier> =
    { A: "SILVER", B: "SILVER", C: "GOLD", D: "GOLD", E: "RECLINER" };
  const screen2 = gridScreen("SCR-2", "Screen 2", ["A", "B", "C", "D", "E"], 8, tiers);
  const dune: Movie = { id: "MV-1", title: "Dune", runtimeMins: 155 };

  const pricing = new TierAndTimePricing();
  const at6: Show = { id: "SH-6PM", movie: dune, screen: screen2, startHour: 18 };
  const at9: Show = { id: "SH-9PM", movie: dune, screen: screen2, startHour: 21 };
  const inv6 = ShowInventory.materialise(at6, pricing);
  const inv9 = ShowInventory.materialise(at9, pricing);

  const gateway = new FakeGateway();
  const svc = new BookingService(new SeatLockManager(7 * MINUTE_MS), gateway);
  svc.addShow(inv6);
  svc.addShow(inv9);

  const aditi: User = { id: "U1", name: "Aditi" };
  const rohan: User = { id: "U2", name: "Rohan" };
  const t = 0;                                     // the clock is a PARAMETER

  console.log("=== 1. the same chair, two shows ==============================");
  const b1 = svc.selectSeats("SH-6PM", ["C6", "C7", "C8"], aditi, t);
  console.log("selectSeats ->", describe(b1));
  console.log("confirm     ->", describe(svc.confirm(b1.id, "PAY-77", t)));
  console.log("  C8 @ 6PM :", inv6.seat("C8").statusAt(t), fmt(inv6.seat("C8").pricePaise));
  console.log("  C8 @ 9PM :", inv9.seat("C8").statusAt(t), fmt(inv9.seat("C8").pricePaise));

  console.log("\\n=== 2. two people, one seat ===================================");
  const e1 = inv6.seat("E1");
  const a = e1.tryHold("U1", t, 7 * MINUTE_MS);
  const b = e1.tryHold("U2", t, 7 * MINUTE_MS);    // same tick, same seat
  console.log("  U1 tryHold(E1) ->", a, " U2 tryHold(E1) ->", b, "  (exactly one true)");
  console.log("  E1 is", e1.statusAt(t), "by", e1.holderAt(t));

  console.log("\\n=== 3. three seats or none ====================================");
  inv6.seat("D3").tryHold(rohan.id, t, 7 * MINUTE_MS);
  try {
    svc.selectSeats("SH-6PM", ["D1", "D2", "D3"], aditi, t);
  } catch (e) {
    console.log("  " + (e as Error).message);
  }
  console.log("  D1 =", inv6.seat("D1").statusAt(t), "D2 =", inv6.seat("D2").statusAt(t),
              "  <- rolled back");

  console.log("\\n=== 4. the hold expires =======================================");
  svc.selectSeats("SH-6PM", ["B1", "B2"], rohan, t);
  console.log("  t+0m  B1 =", inv6.seat("B1").statusAt(t));
  const later = t + 8 * MINUTE_MS;
  console.log("  t+8m  B1 =", inv6.seat("B1").statusAt(later), "  <- lazy expiry, on read");
  console.log("  sweeper freed", svc.sweep("SH-6PM", later), "more seat(s)");

  console.log("\\n=== 5. the payment fails ======================================");
  const b2 = svc.selectSeats("SH-6PM", ["A1", "A2"], aditi, later);
  gateway.declineNext = true;
  try { svc.confirm(b2.id, "PAY-88", later); }
  catch (e) { console.log("  charge failed:", (e as Error).message); }
  console.log("  A1 =", inv6.seat("A1").statusAt(later), "A2 =", inv6.seat("A2").statusAt(later),
              "  <- back in the pool");

  console.log("\\n=== 6. the webhook fires twice ================================");
  const b3 = svc.selectSeats("SH-6PM", ["E5"], aditi, later);
  const first = svc.confirm(b3.id, "PAY-99", later);
  const second = svc.confirm(b3.id, "PAY-99", later);
  console.log("  first  ->", describe(first));
  console.log("  second ->", describe(second));
  console.log("  same booking object?", first === second, " successful charges =", gateway.charges);

  console.log("\\n=== 7. swap the pricing rule ==================================");
  const flat6 = ShowInventory.materialise(at6, new FlatPricing(20000));
  console.log("  tier x time : C8@6PM", fmt(inv6.seat("C8").pricePaise),
              "C8@9PM", fmt(inv9.seat("C8").pricePaise),
              "E1@6PM", fmt(inv6.seat("E1").pricePaise));
  console.log("  flat        : C8@6PM", fmt(flat6.seat("C8").pricePaise),
              "E1@6PM", fmt(flat6.seat("E1").pricePaise));
  console.log("  0 lines of BookingService changed.");

  console.log("\\n=== 8. census =================================================");
  console.log("  6PM", inv6.census(later));
  console.log("  9PM", inv9.census(later), " <- untouched by anything above");
}

main();`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Take the cinema away and what is left is **a scarce, non-fungible resource that two strangers may reach for at the same instant, where the taking is fast but the paying is slow.** That shape has a fixed recipe, and you now know all four steps: split the *thing* from the *thing-at-a-time*, take it with one atomic compare-and-set, hold it with an owner and a deadline, and make the confirmation idempotent because the slow step retries.",
      },
      {
        type: "ul",
        items: [
          "**Concert, train and flight seats** — the same problem with a different vocabulary. A train seat is `Seat × Journey-leg`, which is the same materialisation trick with an extra dimension.",
          "**Restaurant tables and doctors' appointments** — a slot is `Resource × TimeWindow`. Once you see that, the *“is table 6 free?”* question stops being ambiguous, the same way *“is C8 free?”* did.",
          "**Flash sales and limited-stock checkout** — hold the stock unit while the customer pays, release it on abandonment. The only difference is that stock is fungible, so a lost CAS can retry against a different unit instead of failing.",
          "**Domain names, usernames, phone-number ports** — the pure case: one atomic claim, no expiry, and whoever loses is told instantly.",
          "**Parking spots, meeting rooms, library copies** — you have already met these as [[parking-lot]], [[meeting-room-scheduler]] and [[library-management]]. Read them again with `ShowSeat` in mind and the resemblance is uncomfortable.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The 25-second version to say out loud",
        text: "*“The bookable unit is a `ShowSeat` — one per `Seat` per `Show` — because a chair is free at 6 and taken at 9, so status cannot live on the chair. Taking one is an atomic compare-and-set from `AVAILABLE` to `HELD` on that single seat, so the loser is told in the same call and the other 39 seats keep selling. The hold carries a holder and an expiry, so an abandoned checkout heals itself. Payment sits between hold and confirm, outside any lock, and `confirm` is idempotent on the payment reference so a retried webhook cannot double-book or double-charge. Multi-seat selection sorts by seat id and rolls back on the first refusal.”*",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When it is more than one process.** In-memory `synchronized` protects one JVM. Ten booking servers need the atomicity to live where the state lives — a conditional `UPDATE … WHERE status = 'AVAILABLE'` with a rows-affected check, or a Redis `SET NX PX`. The lifecycle survives; the mechanism moves.",
          "**When the hold must survive a restart.** An in-memory `expiresAt` dies with the process, and every held seat comes back either stuck or free depending on which way you initialise. Persist the hold, and the sweeper becomes a job rather than a thread.",
          "**When 200,000 people hit one show at 10:00 AM.** A single hot row is a single hot row, wherever it lives. That is when you add a queue in front of the show — a virtual waiting room — and admit users in batches. The seat logic does not change; the *admission* does.",
          "**When seats stop being independent.** Reserved wheelchair bays, sofa seats sold in pairs, or “no single seat left behind” policies make the units interact, and a per-seat CAS can no longer express the rule. At that point the atomic unit becomes the *group*, not the seat.",
          "**When money must be exactly reconciled.** Here `charge` is one call that throws or does not. Real payments settle asynchronously and can be reversed hours later, which turns the booking into a small saga with compensating actions — and the idempotency key becomes the most important field in the system, not just a nice touch.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**The question “is this seat free?” must have exactly one answer.** The moment it has two — one for the 6 PM show and one for the 9 PM show — you are missing a class. Find it, put the status on it, and take it with a single atomic step.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Modelling ShowSeat separately from Seat makes “is C8 free?” answerable, lets two shows over the same hall be priced differently, and keeps the physical layout immutable for the life of the process.",
        "A compare-and-set on one seat keeps the contended region to a few instructions, so 39 other seats in the same hall are still being sold in parallel while A5 is being fought over.",
        "A hold with an owner and a deadline lets payment be slow and failable without ever holding a lock across a network call, and it heals abandoned checkouts with no human involved.",
        "Sorting seats into a canonical order before acquiring makes deadlock between overlapping multi-seat requests structurally impossible rather than merely unlikely.",
        "Idempotency keyed on a caller-supplied paymentRef makes retries free, which is what lets the gateway be at-least-once — the only delivery guarantee real payment providers offer.",
        "Pricing behind a strategy plus integer paise means a new rule is a new class and no amount can ever drift by a fraction.",
      ],
      cons: [
        "Materialising every ShowSeat up front is a lot of rows — 500 seats × 30 shows × 200 screens is three million objects a day — which is fine for a database and wasteful in memory, so at scale you either shard by show or materialise lazily.",
        "A hold TTL is a guess. Too short and a slow payer loses the seat they already paid for; too long and a popular show looks sold out while half its holds are dead. There is no correct value, only a tuned one.",
        "Lazy expiry means the seat map can lie until somebody reads it, so counters like “12 seats left” need the sweeper to stay honest — two mechanisms for one rule.",
        "Per-seat locking gives up any ability to reason about the show as a whole: “how many seats are free?” is now a scan, and it is never a consistent snapshot while people are clicking.",
        "The all-or-nothing rollback is best-effort — between releasing seat one and seat two, another user can take seat one, which is correct but makes “undo my selection” non-atomic as a whole.",
        "Everything here assumes a single process. The design survives the move to a cluster, but the actual atomicity has to be re-implemented in the datastore, and any team that skips that step ships the double-booking bug at exactly the moment it scales.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "awesome-low-level-design — Movie Ticket Booking System",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/movie-ticket-booking-system.md",
        kind: "article",
        note: "The canonical write-up of this exact interview problem, including the entity list most interviewers have in their head before you start talking.",
      },
      {
        label: "Martin Fowler — Patterns of Enterprise Application Architecture: Optimistic and Pessimistic Offline Lock",
        href: "https://martinfowler.com/eaaCatalog/optimisticOfflineLock.html",
        kind: "article",
        note: "The formal name for what a seat hold is. Read this and the Pessimistic Offline Lock page next to it — the trade-off they describe is exactly the one you are making at minute six.",
      },
      {
        label: "PostgreSQL — SELECT … FOR UPDATE and row-level locking",
        href: "https://www.postgresql.org/docs/current/explicit-locking.html",
        kind: "docs",
        note: "Where the per-seat compare-and-set actually lives once this is more than one server. The section on row-level locks is the ten-server version of the `synchronized` method in the Java sample.",
      },
      {
        label: "Redis — SET with NX and PX, and the distributed-lock page",
        href: "https://redis.io/docs/latest/develop/use-cases/distributed-locks/",
        kind: "docs",
        note: "The other common home for a seat hold. Note how much of the page is about expiry and about the lock outliving its owner — the same two problems the TTL solves here.",
      },
      {
        label: "Stripe — Idempotent requests",
        href: "https://docs.stripe.com/api/idempotent_requests",
        kind: "docs",
        note: "A production payment API explaining why the client supplies the key and how long the result is remembered. This is the confirm() story, written by people who have been burned by it.",
      },
      {
        label: "Designing Data-Intensive Applications — Martin Kleppmann",
        kind: "book",
        note: "Chapter 7 on transactions and write skew. Two people booking the same seat is the textbook example, and it explains precisely why a read followed by a write is not the same as a conditional write.",
      },
      {
        label: "Java — AtomicReference.compareAndSet",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/AtomicReference.html",
        kind: "docs",
        note: "The lock-free version of the seat hold. Worth reading so you can say, accurately, what `synchronized` is buying you and what it costs.",
      },
      {
        label: "Refactoring Guru — Strategy",
        href: "https://refactoring.guru/design-patterns/strategy",
        kind: "article",
        note: "The pattern behind PricingStrategy and RefundPolicy. The diagrams are the ones to have in your head when you draw the seam in minute fifteen.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "bookmyshow-q1",
        question: "Why is `boolean isBooked` on `Seat` the wrong model?",
        options: [
          { id: "a", label: "Because one chair is free at the 6 PM show and taken at the 9 PM show — status belongs to the seat-at-a-show, not to the seat." },
          { id: "b", label: "Because booleans cannot represent a seat that is held but not yet paid for." },
          { id: "c", label: "Because it wastes memory once a screen has more than 200 seats." },
          { id: "d", label: "Because seats need three states, so an enum on `Seat` would be correct instead." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) and (d) are both true observations that miss the point — swapping the boolean for a three-state enum on `Seat` leaves the model exactly as broken, because there is still only one C8 object shared by every show. The fix is a second class, `ShowSeat`, materialised one per seat per show. Price has the same problem: the same chair costs different amounts at different times.",
      },
      {
        id: "bookmyshow-q2",
        question: "Two users click seat A5 in the same millisecond. What is the correct guard?",
        options: [
          { id: "a", label: "An atomic compare-and-set on that one ShowSeat — “if you are AVAILABLE, become HELD by me” — returning false to the loser immediately." },
          { id: "b", label: "A `synchronized` method on BookingService, so only one booking runs at a time anywhere." },
          { id: "c", label: "A lock on the Show, so only one person can touch that show's seats at a time." },
          { id: "d", label: "Let both hold it, and resolve the conflict when they pay." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) and (c) are both correct and both wrong: they prevent the double-booking and they serialise thousands of independent users behind one lock. The size of the critical section is the engineering decision. (d) is the failure this whole problem exists to prevent — the loser must find out before paying, not after.",
      },
      {
        id: "bookmyshow-q3",
        question: "Why must a seat hold have an expiry?",
        options: [
          { id: "a", label: "Because a user who closes the tab would otherwise keep that seat HELD forever, and the show slowly fills with unsellable chairs." },
          { id: "b", label: "Because the payment gateway requires a timeout on its side." },
          { id: "c", label: "Because holding memory for a long time causes a leak." },
          { id: "d", label: "Because seats must be re-priced periodically while they are held." },
        ],
        correctOptionId: "a",
        explanation:
          "The hold is deliberately *soft* state: it has an owner and a deadline, and it heals itself. Without the deadline every abandoned checkout permanently removes a seat from sale, and nothing in the system will ever notice. (d) is actually the opposite of what you want — a held seat's price must be frozen, or the amount changes under a customer mid-payment.",
      },
      {
        id: "bookmyshow-q4",
        question: "Your `tryHold` checks whether an existing hold has expired, and then takes the seat. Where must that expiry check happen?",
        options: [
          { id: "a", label: "Inside the same atomic step as the compare-and-set, so two callers cannot both observe “expired, therefore free”." },
          { id: "b", label: "In a background sweeper only — the seat should never expire on read." },
          { id: "c", label: "In the caller, just before calling tryHold." },
          { id: "d", label: "Anywhere; expiry is idempotent, so a race there is harmless." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is the seductive one. Expiring twice is indeed harmless — but *observing* the expiry outside the atomic step re-opens the exact read-then-write gap you closed, and two callers can both take the newly-free seat. The sweeper in (b) is a useful second mechanism for keeping counters honest, not a replacement for the lazy check.",
      },
      {
        id: "bookmyshow-q5",
        question: "A user asks for [C6, C4, C5] and another asks for [C5, C4] at the same moment. Why sort the seats before acquiring them?",
        options: [
          { id: "a", label: "Because acquiring in a canonical order makes deadlock impossible — otherwise each caller can hold one of the seats the other is waiting for." },
          { id: "b", label: "Because sorted seats produce a nicer confirmation email." },
          { id: "c", label: "Because the compare-and-set only works on seats in ascending order." },
          { id: "d", label: "Because sorting makes the rollback faster." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the classic lock-ordering fix, and it costs one line. Note that with a non-blocking `tryHold` you get a livelock-ish churn rather than a true hang — both callers fail and roll back — which is survivable but still means neither user gets the seats they could have had. Sorting turns that into “one wins cleanly”.",
      },
      {
        id: "bookmyshow-q6",
        question: "The payment gateway's webhook is delivered twice with the same `paymentRef`. What makes `confirm` safe?",
        options: [
          { id: "a", label: "An index from paymentRef to booking id, checked first — a second call with a seen ref returns the existing booking without charging or touching a seat." },
          { id: "b", label: "Wrapping confirm in a lock so only one webhook can run at a time." },
          { id: "c", label: "Checking whether the seats are already BOOKED and returning early if they are." },
          { id: "d", label: "Ignoring any webhook that arrives less than a second after the previous one." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) is the tempting near-miss: it stops the double *booking* but not the double *charge*, because the gateway call happens before the seats flip. (b) serialises the duplicates without deduplicating them. Idempotency has to be keyed on something the caller supplies and you remember — that is why `paymentRef` comes in as a parameter.",
      },
      {
        id: "bookmyshow-q7",
        question: "In `confirm`, the payment succeeds but one of the three seats is no longer held by this user. What is the right behaviour?",
        options: [
          { id: "a", label: "Check every seat is still HELD by me *before* charging, and refuse the whole booking if any is not — nothing charged, everything released." },
          { id: "b", label: "Book the two seats that are still held and refund a third of the amount." },
          { id: "c", label: "Force the third seat from BOOKED back to HELD so the booking can complete." },
          { id: "d", label: "Retry tryHold on the third seat until it succeeds." },
        ],
        correctOptionId: "a",
        explanation:
          "Order matters: verify the holds, then charge. (b) is a partial booking, which is the outcome all-or-nothing exists to prevent — and it hands somebody a pair of seats in different rows. (c) steals a confirmed seat from another customer, and (d) waits on a seat that is gone rather than busy. If the charge has already gone through when you discover the problem, the honest path is a refund, and saying that out loud scores well.",
      },
      {
        id: "bookmyshow-q8",
        question: "The interviewer says: “now run this on ten servers.” What actually changes?",
        options: [
          { id: "a", label: "Only the mechanism of the atomic step — tryHold becomes a conditional UPDATE with a rows-affected check, or a Redis SET NX PX. The lifecycle, TTL, rollback and idempotency all carry over." },
          { id: "b", label: "Everything — the ShowSeat model has to be replaced with a distributed queue per show." },
          { id: "c", label: "Nothing, as long as each server keeps its own copy of the seat map in memory." },
          { id: "d", label: "The hold must be removed, because distributed systems cannot hold state across a payment." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the payoff for modelling the hold as *data with a deadline* rather than as a language-level lock: `expiresAt` is a column, `paymentRef` is a unique index, and the compare-and-set is a `WHERE` clause. (c) is the answer that ships the bug — ten independent in-memory maps means ten servers each happily selling C8.",
      },
    ],
  },
};
