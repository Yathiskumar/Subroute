import type { RoadmapLesson } from "@/lib/content/types";

export const libraryManagement: RoadmapLesson = {
  title: "Library Management",
  oneLiner:
    "The pure **domain-modelling** round. There is no clever algorithm here and no race to draw — what is being graded is whether you can carve a messy real-world domain into the right classes. And there is exactly one carve that separates a good answer from a bad one: **a `Book` is not a book.**",
  difficulty: "intermediate",
  estimatedTime: "30 min",
  prototypePath: "/prototypes/lld/library-management.html",
  content: {
    prototypeCaption:
      "Three titles, eight **physical copies**, three members. Pick a member chip, then press **📕 Borrow** on a title — the system picks a *specific* copy and that barcode turns 🟠 and moves onto her card. Borrow again and a **different** barcode goes out while the header counts down `2 of 3 available`. When the last copy is gone the button becomes **🔖 Reserve**. Now press **📗 Return** on a loaned chip: because someone is queued, the copy does **not** go back to green — it turns 🔵 and is held for the head of the queue. **⏩ +7 days** makes loans overdue and fines appear; the **⏱ Flat / 🪜 Slabs / 🧢 Capped** chips re-price every fine without touching `returnItem()`.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design a library management system.”* It is the friendliest-sounding prompt in the set. Everybody has been in a library, nobody has to ask what a book is, and there is no concurrency puzzle waiting to ambush you.",
      },
      {
        type: "p",
        text: "That is exactly why it is dangerous. With no algorithm to hide behind, the interviewer is grading one thing: **can you turn a messy real-world domain into classes that hold up?** And this problem has a single specific carve that separates a good answer from a bad one — one that most candidates get wrong in the first three minutes and never recover from.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 344" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A library floor drawn as three areas. On the left a shelf on rack R-12 holds three physical copies of Clean Code, each with its own barcode B-001, B-002 and B-003, labelled BookItem. In the middle a catalogue terminal searches by title, author, subject and year and reports two of three available, labelled Catalog and Book. On the right an issue desk with a member and a librarian, labelled Member and Librarian. A band across the bottom labelled BookLending records that copy B-002 went to Meera, issued on day one, due on day fifteen.">
  <defs>
    <marker id="lb-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="lb-flow" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <text x="26" y="42" font-size="11" fill="#e8e4dc">“Clean Code” — three physical copies</text>
  <rect x="26" y="56" width="272" height="148" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="42" y="78" font-size="9.5" fill="#6b7280">shelf · rack R-12</text>
  <rect x="44" y="90" width="66" height="96" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="56" y="144" font-size="9" fill="#fb863a">B-001</text>
  <rect x="126" y="90" width="66" height="96" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="138" y="144" font-size="9" fill="#fb863a">B-002</text>
  <rect x="208" y="90" width="66" height="96" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="220" y="144" font-size="9" fill="#fb863a">B-003</text>
  <text x="26" y="226" font-size="11.5" fill="#fb863a">BookItem</text>
  <text x="26" y="244" font-size="9" fill="#9099a8">one per copy — barcode, rack,</text>
  <text x="26" y="258" font-size="9" fill="#9099a8">acquired date, condition, status</text>

  <rect x="330" y="56" width="176" height="148" rx="8" fill="#14161a" stroke="#5e9ff6"/>
  <text x="346" y="78" font-size="9.5" fill="#5e9ff6">catalogue terminal</text>
  <text x="346" y="102" font-size="9" fill="#e8e4dc">search: title · author</text>
  <text x="346" y="118" font-size="9" fill="#e8e4dc">subject · published year</text>
  <line x1="346" y1="132" x2="490" y2="132" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="346" y="152" font-size="9" fill="#9099a8">“Clean Code” — 1 record</text>
  <text x="346" y="170" font-size="9" fill="#5cc66f">2 of 3 available</text>
  <text x="346" y="188" font-size="9" fill="#6b7280">a count over its items</text>
  <text x="330" y="226" font-size="11.5" fill="#fb863a">Catalog + Book</text>
  <text x="330" y="244" font-size="9" fill="#9099a8">a Book is the description —</text>
  <text x="330" y="258" font-size="9" fill="#9099a8">not the object you carry home</text>

  <rect x="540" y="56" width="176" height="148" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="556" y="78" font-size="9.5" fill="#6b7280">issue desk</text>
  <text x="566" y="136" font-size="30">🧑‍🎓</text>
  <text x="650" y="136" font-size="30">🧑‍💼</text>
  <text x="558" y="164" font-size="9.5" fill="#fb863a">Member</text>
  <text x="640" y="164" font-size="9.5" fill="#fb863a">Librarian</text>
  <text x="556" y="188" font-size="9" fill="#9099a8">both are Accounts</text>
  <text x="540" y="226" font-size="11.5" fill="#fb863a">Account roles</text>
  <text x="540" y="244" font-size="9" fill="#9099a8">two roles, one level —</text>
  <text x="540" y="258" font-size="9" fill="#9099a8">not a six-deep hierarchy</text>

  <rect x="120" y="280" width="500" height="54" rx="8" fill="rgba(94,159,246,0.10)" stroke="#5e9ff6"/>
  <text x="138" y="302" font-size="11" fill="#5e9ff6">BookLending</text>
  <text x="138" y="322" font-size="9" fill="#9099a8">B-002 → Meera · issued day 1 · due day 15 · returnedOn null</text>
  <line x1="160" y1="206" x2="186" y2="276" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#lb-flow)"/>
  <line x1="600" y1="206" x2="562" y2="276" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#lb-flow)"/>
  <text x="20" y="20" font-size="10" fill="#6b7280">every noun on this floor, labelled with the class it becomes</text>
  <line x1="308" y1="16" x2="330" y2="50" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#lb-lead)"/>
</svg>`,
        caption:
          "Look at the shelf and the terminal separately. The terminal knows about **one** *“Clean Code”*. The shelf holds **three** of them, and each has its own barcode. Those are two different classes, and everything else in this design follows from that.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **`Book`** is a catalogue record — one per title. A **`BookItem`** is one physical copy of that title, with a barcode and a status. A **`BookLending`** is the act of one member taking one item home on one date — and because it is an object rather than a field, the library still has it next year.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Did you split the title from the copy?** `Book` versus `BookItem`. This is the single most common failure in this round, and there is no recovering from it at minute 45 — every method you have written will need changing.",
          "**Is a loan an object, or a field?** `BookItem.borrowedBy` can only hold the present. Fines, late-return history and member standing are all computed from loans that are *finished*.",
          "**Do the rules live on the objects that own the data?** `member.canBorrow(today)` versus a `LibraryService` that reads the member's loans, reads their fines, and decides for them.",
          "**Is time an argument?** `returnItem(barcode, on)` is testable in one line. A method that reads the clock internally means a fine calculation you cannot test — which means a fine calculation that is wrong.",
          "**Does it run?** Three titles, several copies, an issue, a return with a fine, and a reservation that intercepts a returned copy. Print it.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- the money split ----------
      { type: "h", text: "Step 1 · A `Book` is not a book" },
      {
        type: "p",
        text: "The instinct is one class. It has a title, an author, an ISBN — and, because you need to know whether someone can borrow it, an `isAvailable` boolean. It reads fine. It is wrong the moment the library buys a second copy.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 324" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, a single Book class holding isbn, title, author and an isAvailable boolean. With five copies owned, the boolean cannot be set, the question of which copy was taken is unanswerable, and three of five available cannot be expressed. On the right, one Book record for Clean Code with five BookItem cards hanging off it, barcodes B-001 to B-005, so availability is a count over items and a specific copy can be named.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ ONE CLASS — Book carries isAvailable</text>
  <rect x="20" y="32" width="330" height="272" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <rect x="44" y="52" width="212" height="108" rx="6" fill="#1a1d22" stroke="#f06868"/>
  <text x="58" y="74" font-size="11" fill="#f06868">Book</text>
  <line x1="44" y1="82" x2="256" y2="82" stroke="#2d333d"/>
  <text x="58" y="100" font-size="9.5" fill="#9099a8">- isbn, title, author</text>
  <text x="58" y="118" font-size="9.5" fill="#9099a8">- subject, publishedYear</text>
  <text x="58" y="140" font-size="9.5" fill="#f06868">- isAvailable : boolean</text>
  <text x="44" y="186" font-size="9.5" fill="#9099a8">the library owns 5 copies · 4 are out</text>
  <text x="44" y="210" font-size="9.5" fill="#f06868">isAvailable = ?   true and false at once</text>
  <text x="44" y="234" font-size="9.5" fill="#f06868">which copy did she take?   unanswerable</text>
  <text x="44" y="258" font-size="9.5" fill="#f06868">“1 of 5 available”   cannot be expressed</text>
  <text x="44" y="282" font-size="9.5" fill="#f06868">a barcode on a search hit   nowhere to put it</text>

  <text x="374" y="22" font-size="10.5" fill="#5cc66f">✓ TWO CLASSES — description vs instance</text>
  <rect x="374" y="32" width="326" height="272" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <rect x="446" y="50" width="184" height="60" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="460" y="70" font-size="10.5" fill="#fb863a">Book  «catalogue record»</text>
  <text x="460" y="88" font-size="9" fill="#e8e4dc">“Clean Code” · isbn 978-0-13</text>
  <text x="460" y="102" font-size="9" fill="#9099a8">exactly one, forever</text>
  <line x1="538" y1="110" x2="538" y2="126" stroke="#d8d3c9" stroke-width="1.2"/>
  <line x1="418" y1="126" x2="658" y2="126" stroke="#d8d3c9" stroke-width="1.2"/>
  <text x="546" y="122" font-size="9" fill="#9099a8">1 ─ *</text>
  <rect x="394" y="140" width="48" height="52" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="402" y="170" font-size="8.5" fill="#9099a8">B-001</text>
  <rect x="454" y="140" width="48" height="52" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="462" y="170" font-size="8.5" fill="#9099a8">B-002</text>
  <rect x="514" y="140" width="48" height="52" rx="5" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="522" y="170" font-size="8.5" fill="#5cc66f">B-003</text>
  <rect x="574" y="140" width="48" height="52" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="582" y="170" font-size="8.5" fill="#9099a8">B-004</text>
  <rect x="634" y="140" width="48" height="52" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="642" y="170" font-size="8.5" fill="#9099a8">B-005</text>
  <line x1="418" y1="126" x2="418" y2="140" stroke="#d8d3c9" stroke-width="1.2"/>
  <line x1="478" y1="126" x2="478" y2="140" stroke="#d8d3c9" stroke-width="1.2"/>
  <line x1="538" y1="126" x2="538" y2="140" stroke="#d8d3c9" stroke-width="1.2"/>
  <line x1="598" y1="126" x2="598" y2="140" stroke="#d8d3c9" stroke-width="1.2"/>
  <line x1="658" y1="126" x2="658" y2="140" stroke="#d8d3c9" stroke-width="1.2"/>
  <text x="394" y="212" font-size="9" fill="#6b7280">BookItem — barcode · rack · condition · status</text>
  <text x="394" y="238" font-size="9.5" fill="#5cc66f">“1 of 5 available” — a count over items</text>
  <text x="394" y="260" font-size="9.5" fill="#5cc66f">she took B-003 — a specific object</text>
  <text x="394" y="282" font-size="9.5" fill="#5cc66f">rack, condition and price live on the copy</text>
</svg>`,
        caption:
          "Cover the right half and try to answer *“which copy did she take?”* from the left. You cannot — and neither can any method you write on top of it. **Split this in minute 8, not minute 40.**",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Name the rule, because it transfers",
        text: "**The catalogue entry is a *description*; the copy is an *instance*.** Once you can say that sentence you have already designed half a dozen other systems: `Product` versus the SKU versus the unit sitting in the warehouse; `Show` versus `Seat` versus `Booking`; `FlightRoute` versus a dated `Flight`. Interviewers ask this problem *because* the split generalises. More on the vocabulary in [[domain-modeling]] and [[identifying-entities]].",
      },
      {
        type: "p",
        text: "The tell that you have it right: **search returns `Book`s, borrowing returns a `BookItem`.** Somebody searching wants titles. Somebody at the desk wants the object with a barcode on it. If your `search()` returns the same type your `issue()` returns, one of them is lying.",
      },

      // ---------- scope ----------
      { type: "h", text: "Step 2 · Clarify — 5 minutes" },
      {
        type: "ul",
        items: [
          "**Multiple copies of the same title?** — the only question that really matters. They will say yes. If they say no, ask *“would you ever want to?”*, because the answer shapes every class you are about to draw.",
          "**Can a member reserve a title when every copy is out?** — say yes and keep it to a FIFO queue per title. It is four lines and it makes `return` interesting.",
          "**Fines?** — yes, per day late, and ask whether the policy might change. That is your invitation to a strategy seam.",
          "**How many books can one member hold?** — a number, plus the rules that go with it: expired membership, unpaid fines. These belong on `Member`.",
          "**Search by what?** — title, author, subject, publication date. That is a `Catalog` with index maps, not a linear scan over every book.",
          "**Payments, branches, e-books, RFID gates, recommendations?** — out of scope. Say it in one sentence and move.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 258" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A two column scope board. In scope: multiple copies per title, search by title author subject and year, issue and return, fines with a swappable policy, reservations as a FIFO queue per title, renew, and member plus librarian roles. Out of scope: payment gateways, multiple branches, e-books and audio, recommendations, RFID gates, and inter-library loans.">
  <text x="20" y="22" font-size="10.5" fill="#5cc66f">✓ IN SCOPE — 60 minutes buys you this much</text>
  <rect x="20" y="32" width="326" height="212" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="40" y="58" font-size="10" fill="#e8e4dc">many physical copies per title</text>
  <text x="40" y="82" font-size="10" fill="#e8e4dc">search: title · author · subject · year</text>
  <text x="40" y="106" font-size="10" fill="#e8e4dc">issue · return · renew</text>
  <text x="40" y="130" font-size="10" fill="#e8e4dc">fines, behind a swappable policy</text>
  <text x="40" y="154" font-size="10" fill="#e8e4dc">reservation: FIFO queue per title</text>
  <text x="40" y="178" font-size="10" fill="#e8e4dc">borrow limits, on Member</text>
  <text x="40" y="202" font-size="10" fill="#e8e4dc">two roles: Member · Librarian</text>
  <text x="40" y="228" font-size="9" fill="#6b7280">everything above is one class or one method</text>

  <text x="374" y="22" font-size="10.5" fill="#f06868">✗ OUT OF SCOPE — say it once, then stop</text>
  <rect x="374" y="32" width="306" height="212" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="394" y="58" font-size="10" fill="#9099a8">payment gateways / card readers</text>
  <text x="394" y="82" font-size="10" fill="#9099a8">multiple branches</text>
  <text x="394" y="106" font-size="10" fill="#9099a8">e-books and audiobooks</text>
  <text x="394" y="130" font-size="10" fill="#9099a8">recommendations</text>
  <text x="394" y="154" font-size="10" fill="#9099a8">RFID gates, theft detection</text>
  <text x="394" y="178" font-size="10" fill="#9099a8">inter-library loans</text>
  <text x="394" y="202" font-size="10" fill="#9099a8">a deep Person class hierarchy</text>
  <text x="394" y="228" font-size="9" fill="#6b7280">name them so they become follow-ups, not surprises</text>
</svg>`,
        caption:
          "The last line on the right is not a joke. **A `Person` → `Staff` → `Librarian` → `SeniorLibrarian` hierarchy has eaten twenty minutes of more than one candidate's round** and added nothing the interviewer wanted.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 302" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A table mapping nouns from the problem statement to classes. The title in the catalogue becomes Book. The physical thing on the shelf becomes BookItem. Searching becomes Catalog. The person who borrows becomes Member. The person at the desk becomes Librarian. The act of borrowing becomes BookLending. Waiting for a copy becomes Reservation. Money owed for lateness becomes FinePolicy. Lost or being repaired becomes ItemStatus.">
  <text x="20" y="22" font-size="10.5" fill="#fb863a">NOUNS IN THE PROMPT  →  CLASSES ON THE BOARD</text>
  <line x1="20" y1="34" x2="680" y2="34" stroke="#3a414c"/>
  <text x="24" y="54" font-size="9" fill="#6b7280">what the interviewer said</text>
  <text x="386" y="54" font-size="9" fill="#6b7280">what you draw</text>
  <text x="560" y="54" font-size="9" fill="#6b7280">why</text>
  <line x1="20" y1="62" x2="680" y2="62" stroke="#2d333d" stroke-dasharray="3 3"/>

  <text x="24" y="84" font-size="10" fill="#e8e4dc">“a book in the catalogue”</text>
  <text x="386" y="84" font-size="10" fill="#fb863a">Book</text>
  <text x="560" y="84" font-size="9" fill="#9099a8">one per title</text>

  <text x="24" y="108" font-size="10" fill="#e8e4dc">“the book on the shelf”</text>
  <text x="386" y="108" font-size="10" fill="#fb863a">BookItem</text>
  <text x="560" y="108" font-size="9" fill="#9099a8">one per copy</text>

  <text x="24" y="132" font-size="10" fill="#e8e4dc">“search for a book”</text>
  <text x="386" y="132" font-size="10" fill="#fb863a">Catalog</text>
  <text x="560" y="132" font-size="9" fill="#9099a8">index maps, not a scan</text>

  <text x="24" y="156" font-size="10" fill="#e8e4dc">“someone borrows it”</text>
  <text x="386" y="156" font-size="10" fill="#fb863a">Member</text>
  <text x="560" y="156" font-size="9" fill="#9099a8">holds its own rules</text>

  <text x="24" y="180" font-size="10" fill="#e8e4dc">“the person at the desk”</text>
  <text x="386" y="180" font-size="10" fill="#fb863a">Librarian</text>
  <text x="560" y="180" font-size="9" fill="#9099a8">a role, not a subtree</text>

  <text x="24" y="204" font-size="10" fill="#e8e4dc">“taking it home until the 15th”</text>
  <text x="386" y="204" font-size="10" fill="#fb863a">BookLending</text>
  <text x="560" y="204" font-size="9" fill="#5cc66f">the relationship, as an object</text>

  <text x="24" y="228" font-size="10" fill="#e8e4dc">“waiting for a copy”</text>
  <text x="386" y="228" font-size="10" fill="#fb863a">Reservation</text>
  <text x="560" y="228" font-size="9" fill="#9099a8">FIFO per title</text>

  <text x="24" y="252" font-size="10" fill="#e8e4dc">“a fine of 5 a day”</text>
  <text x="386" y="252" font-size="10" fill="#fb863a">FinePolicy</text>
  <text x="560" y="252" font-size="9" fill="#9099a8">an interface, so it swaps</text>

  <text x="24" y="276" font-size="10" fill="#e8e4dc">“lost / being repaired”</text>
  <text x="386" y="276" font-size="10" fill="#fb863a">ItemStatus  «enum»</text>
  <text x="560" y="276" font-size="9" fill="#9099a8">five states, not a boolean</text>
  <line x1="20" y1="290" x2="680" y2="290" stroke="#3a414c"/>
</svg>`,
        caption:
          "Two rows do the work: the **first two** (title vs copy) and the **sixth** (the act of borrowing). Everything else on this table is bookkeeping you would get right anyway.",
      },
      // ---------- lending as an object ----------
      { type: "h", text: "Step 3 · A loan is its own object, not a field" },
      {
        type: "p",
        text: "You have split `Book` from `BookItem`. Now a member borrows a copy. The obvious move is two fields on the item: `borrowedBy` and `dueDate`. Set them on issue, null them on return. Done.",
      },
      {
        type: "p",
        text: "Then the interviewer asks *“how many times has this member returned a book late?”* and the design has no answer, because **a field can only hold the present**. The moment the copy comes back, everything you knew about that loan is gone.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The general form is worth memorising",
        text: "**When the relationship itself has attributes, it is a class, not a foreign key.** A loan has an issue date, a due date, a return date and a fine — four attributes that belong to neither the member nor the copy, but to the *pairing* of them. That is the definition of an association class. See [[association-aggregation-composition]] for the notation.",
      },
      {
        type: "code",
        language: "java",
        filename: "the difference in eight lines",
        code: `// ✗ fields on the item — one loan at a time, no past, no fines to compute from
class BookItem {
    String borrowedBy;      // null when on the shelf
    int    dueDay;          // meaningless when borrowedBy is null
}

// ✓ the act of borrowing, as an entity with a lifecycle
class BookLending {
    final String barcode, memberId;
    final int issuedOn, dueOn;
    Integer returnedOn;                       // null while it is open
    boolean isOpen() { return returnedOn == null; }
    long daysLate(int on) { return Math.max(0, on - dueOn); }
}
// the CLOSED lendings are the history: late count, member standing, fines earned`,
      },
      {
        type: "p",
        text: "Note what this buys you for free. `member.openLoans()` is a filter over the list. *“Is this member a repeat offender?”* is a filter over the same list. And the fine is computed from `dueOn` versus the day the copy actually came back — two fields on one object, rather than a subtraction spread across three classes.",
      },

      // ---------- tell don't ask ----------
      { type: "h", text: "Step 4 · Rules live on the object that owns the data" },
      {
        type: "p",
        text: "Here is the second place this round is lost. You have good classes, and then you write a `LibraryService.issueBook()` that reaches into all of them and decides. Two hundred lines, every rule in one method, and nothing on `Member` but getters.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 292" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, a LibraryService reaches into a Member to read its loans list size, its outstanding fine and its membership expiry, then makes the borrowing decision itself, leaving Member as a bag of getters. On the right, the service makes a single call to member dot canBorrow with today's date, and the three rules live inside Member where the data is.">
  <defs>
    <marker id="lb-reach" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#f06868"/></marker>
    <marker id="lb-ask" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
  </defs>

  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ THE SERVICE DECIDES</text>
  <rect x="20" y="32" width="330" height="240" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <rect x="38" y="48" width="132" height="46" rx="6" fill="#1a1d22" stroke="#f06868"/>
  <text x="50" y="68" font-size="10" fill="#f06868">LibraryService</text>
  <text x="50" y="86" font-size="8.5" fill="#9099a8">issueBook(...)</text>
  <rect x="212" y="48" width="120" height="46" rx="6" fill="#1a1d22" stroke="#2d333d"/>
  <text x="226" y="68" font-size="10" fill="#9099a8">Member</text>
  <text x="226" y="86" font-size="8.5" fill="#6b7280">getters only</text>
  <line x1="172" y1="60" x2="208" y2="60" stroke="#f06868" stroke-width="1.1" marker-end="url(#lb-reach)"/>
  <line x1="172" y1="72" x2="208" y2="72" stroke="#f06868" stroke-width="1.1" marker-end="url(#lb-reach)"/>
  <line x1="172" y1="84" x2="208" y2="84" stroke="#f06868" stroke-width="1.1" marker-end="url(#lb-reach)"/>
  <text x="38" y="126" font-size="9.5" fill="#e8e4dc">if (m.getLoans().size() &gt;= 5) refuse;</text>
  <text x="38" y="148" font-size="9.5" fill="#e8e4dc">if (m.getFines() &gt; 10000) refuse;</text>
  <text x="38" y="170" font-size="9.5" fill="#e8e4dc">if (m.getExpiry().before(today)) refuse;</text>
  <line x1="38" y1="184" x2="332" y2="184" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="38" y="206" font-size="9.5" fill="#f06868">three reaches into another object</text>
  <text x="38" y="228" font-size="9.5" fill="#f06868">the rule is copied wherever it is needed</text>
  <text x="38" y="250" font-size="9.5" fill="#f06868">Member cannot enforce its own invariants</text>

  <text x="374" y="22" font-size="10.5" fill="#5cc66f">✓ THE MEMBER DECIDES</text>
  <rect x="374" y="32" width="326" height="240" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <rect x="392" y="48" width="126" height="46" rx="6" fill="#1a1d22" stroke="#2d333d"/>
  <text x="404" y="68" font-size="10" fill="#9099a8">Library</text>
  <text x="404" y="86" font-size="8.5" fill="#6b7280">issue(...)</text>
  <rect x="560" y="48" width="126" height="46" rx="6" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>
  <text x="574" y="68" font-size="10" fill="#5cc66f">Member</text>
  <text x="574" y="86" font-size="8.5" fill="#5cc66f">owns the rules</text>
  <line x1="520" y1="70" x2="556" y2="70" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#lb-ask)"/>
  <text x="392" y="126" font-size="9.5" fill="#e8e4dc">member.canBorrow(today)</text>
  <line x1="392" y1="140" x2="686" y2="140" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="392" y="162" font-size="9" fill="#9099a8">inside Member:</text>
  <text x="404" y="182" font-size="9" fill="#5cc66f">openLoans() &lt; MAX_LOANS</text>
  <text x="404" y="200" font-size="9" fill="#5cc66f">fineOwed &lt;= MAX_FINE</text>
  <text x="404" y="218" font-size="9" fill="#5cc66f">membership not expired</text>
  <text x="392" y="244" font-size="9.5" fill="#5cc66f">one call · one place to change the limit</text>
  <text x="392" y="264" font-size="9" fill="#9099a8">the librarian screen asks the same question</text>
</svg>`,
        caption:
          "Count the arrows on the left: three reaches into someone else's data to make a decision that is not yours. That is [[tell-dont-ask]] and [[law-of-demeter]] failing in the same three lines — and the fix is one method.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The sentence that scores the point",
        text: "*“The five-book limit is a rule about a member, so it lives on `Member`. The service asks `member.canBorrow(today)` and does what it is told.”* Say that out loud while you write the method. It is the difference between a class diagram and a script with objects in it.",
      },
      {
        type: "p",
        text: "The same test applies everywhere else. *Can this item be loaned?* is a question about the item — `item.isAvailable()`. *How late is this?* is a question about the lending — `lending.daysLate(on)`. *How much is that worth?* is the only question the service genuinely owns, and it delegates that to a policy.",
      },

      // ---------- class diagram ----------
      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 476" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. Library holds one Catalog and issues, returns, reserves and renews. Account is the shared base with two roles, Member and Librarian. Catalog holds one to many Books, and each Book has one to many BookItems. Member has one to many BookLendings, and each BookLending refers to exactly one BookItem. Reservation links a Member to a Book as a FIFO queue. A FinePolicy interface with flat, slab and capped implementations prices a closed lending.">
  <defs>
    <marker id="lb-arrow" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="250" y="14" width="200" height="74" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="264" y="34" font-size="11.5" fill="#fb863a">Library</text>
  <line x1="250" y1="42" x2="450" y2="42" stroke="#2d333d"/>
  <text x="264" y="58" font-size="9" fill="#e8e4dc">+ issue(isbn, memberId, day)</text>
  <text x="264" y="72" font-size="9" fill="#e8e4dc">+ returnItem(barcode, day)</text>
  <text x="264" y="84" font-size="9" fill="#e8e4dc">+ reserve · renew · setFinePolicy</text>

  <rect x="510" y="14" width="200" height="74" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="524" y="34" font-size="11.5" fill="#e8e4dc">Account  «abstract»</text>
  <line x1="510" y1="42" x2="710" y2="42" stroke="#2d333d"/>
  <text x="524" y="60" font-size="9" fill="#9099a8">- id · name · role</text>
  <text x="524" y="78" font-size="9" fill="#6b7280">two roles, ONE level deep</text>

  <rect x="30" y="122" width="190" height="86" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="44" y="142" font-size="11.5" fill="#e8e4dc">Catalog</text>
  <line x1="30" y1="150" x2="220" y2="150" stroke="#2d333d"/>
  <text x="44" y="168" font-size="9" fill="#9099a8">- byTitle : Map</text>
  <text x="44" y="184" font-size="9" fill="#9099a8">- byAuthor · bySubject</text>
  <text x="44" y="200" font-size="9" fill="#fb863a">+ firstAvailable(isbn)</text>

  <rect x="250" y="122" width="200" height="86" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="264" y="142" font-size="11.5" fill="#e8e4dc">Reservation</text>
  <line x1="250" y1="150" x2="450" y2="150" stroke="#2d333d"/>
  <text x="264" y="168" font-size="9" fill="#9099a8">- isbn · memberId · placedOn</text>
  <text x="264" y="184" font-size="9" fill="#6b7280">held in a FIFO queue per Book</text>
  <text x="264" y="200" font-size="9" fill="#5cc66f">head gets the next returned copy</text>

  <rect x="510" y="122" width="200" height="86" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.3"/>
  <text x="524" y="142" font-size="11.5" fill="#5cc66f">Member</text>
  <line x1="510" y1="150" x2="710" y2="150" stroke="#2d333d"/>
  <text x="524" y="168" font-size="9" fill="#9099a8">- fineOwedMinor · expiresOn</text>
  <text x="524" y="184" font-size="9" fill="#fb863a">+ canBorrow(today)</text>
  <text x="524" y="200" font-size="9" fill="#6b7280">the rule lives HERE</text>

  <rect x="30" y="250" width="190" height="92" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="44" y="270" font-size="11.5" fill="#fb863a">Book  «record»</text>
  <line x1="30" y1="278" x2="220" y2="278" stroke="#2d333d"/>
  <text x="44" y="296" font-size="9" fill="#9099a8">- isbn · title · author</text>
  <text x="44" y="312" font-size="9" fill="#9099a8">- subject · publishedYear</text>
  <text x="44" y="332" font-size="9" fill="#6b7280">ONE per title</text>

  <rect x="250" y="250" width="200" height="110" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="264" y="270" font-size="11.5" fill="#fb863a">BookItem</text>
  <line x1="250" y1="278" x2="450" y2="278" stroke="#2d333d"/>
  <text x="264" y="296" font-size="9" fill="#9099a8">- barcode · rack · acquiredOn</text>
  <text x="264" y="312" font-size="9" fill="#9099a8">- priceMinor : long</text>
  <text x="264" y="328" font-size="9" fill="#5cc66f">- status : ItemStatus «enum»</text>
  <text x="264" y="348" font-size="9" fill="#6b7280">ONE per physical copy</text>

  <rect x="510" y="250" width="200" height="110" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="524" y="270" font-size="11.5" fill="#5e9ff6">BookLending</text>
  <line x1="510" y1="278" x2="710" y2="278" stroke="#2d333d"/>
  <text x="524" y="296" font-size="9" fill="#9099a8">- barcode · memberId</text>
  <text x="524" y="312" font-size="9" fill="#9099a8">- issuedOn · dueOn</text>
  <text x="524" y="328" font-size="9" fill="#5e9ff6">- returnedOn : nullable</text>
  <text x="524" y="348" font-size="9" fill="#6b7280">the relationship, as a class</text>

  <rect x="460" y="398" width="250" height="66" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="474" y="418" font-size="11" fill="#e8e4dc">FinePolicy  «interface»</text>
  <line x1="460" y1="426" x2="710" y2="426" stroke="#2d333d"/>
  <text x="474" y="444" font-size="9" fill="#fb863a">+ fineFor(daysLate, priceMinor)</text>
  <text x="474" y="458" font-size="9" fill="#6b7280">Flat · Slab · Capped</text>

  <line x1="300" y1="88" x2="150" y2="118" stroke="#d8d3c9" stroke-width="1.2" marker-end="url(#lb-arrow)"/>
  <text x="196" y="98" font-size="9" fill="#9099a8">1</text>
  <line x1="350" y1="88" x2="350" y2="118" stroke="#d8d3c9" stroke-width="1.2" marker-end="url(#lb-arrow)"/>
  <text x="358" y="106" font-size="9" fill="#9099a8">*</text>
  <line x1="450" y1="40" x2="506" y2="40" stroke="#d8d3c9" stroke-width="1.2" marker-end="url(#lb-arrow)"/>
  <line x1="610" y1="88" x2="610" y2="118" stroke="#d8d3c9" stroke-width="1.2" marker-end="url(#lb-arrow)"/>
  <text x="618" y="106" font-size="9" fill="#6b7280">Librarian too</text>

  <line x1="125" y1="208" x2="125" y2="246" stroke="#d8d3c9" stroke-width="1.2" marker-end="url(#lb-arrow)"/>
  <text x="132" y="230" font-size="9" fill="#9099a8">1 ─ *</text>
  <line x1="220" y1="296" x2="246" y2="296" stroke="#5cc66f" stroke-width="1.6" marker-end="url(#lb-arrow)"/>
  <text x="188" y="288" font-size="9" fill="#5cc66f">1 ─ *</text>
  <line x1="610" y1="208" x2="610" y2="246" stroke="#d8d3c9" stroke-width="1.2" marker-end="url(#lb-arrow)"/>
  <text x="618" y="230" font-size="9" fill="#9099a8">1 ─ *</text>
  <line x1="506" y1="306" x2="454" y2="306" stroke="#5e9ff6" stroke-width="1.3" marker-end="url(#lb-arrow)"/>
  <text x="458" y="298" font-size="9" fill="#5e9ff6">* ─ 1</text>
  <line x1="350" y1="208" x2="200" y2="246" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lb-arrow)"/>
  <text x="230" y="236" font-size="9" fill="#6b7280">queues on a Book</text>
  <line x1="450" y1="160" x2="506" y2="160" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lb-arrow)"/>
  <line x1="610" y1="360" x2="610" y2="394" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lb-arrow)"/>
  <text x="618" y="380" font-size="9" fill="#6b7280">priced by</text>

  <text x="30" y="392" font-size="9.5" fill="#5cc66f">the green arrow — Book 1 ─ * BookItem —</text>
  <text x="30" y="410" font-size="9.5" fill="#5cc66f">is the one the whole round is graded on</text>
  <text x="30" y="436" font-size="9" fill="#6b7280">notation: 1 ─ * means one to many</text>
  <text x="30" y="452" font-size="9" fill="#6b7280">dashed = uses, solid = holds</text>
</svg>`,
        caption:
          "Two arrows carry the design: **`Book 1 ─ * BookItem`** (title vs copy) and **`Member 1 ─ * BookLending * ─ 1 BookItem`** (the loan as its own object, sitting between them). Notation: [[class-diagrams]].",
      },

      // ---------- state machine ----------
      { type: "h", text: "The item's five states" },
      {
        type: "p",
        text: "`isAvailable: boolean` cannot answer *“where is B-003?”* when the answer is *“a member reported it lost”* or *“the spine is being repaired”*. Somebody always asks about a lost book. Five states, an enum, and the legal transitions written down.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 326" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A state machine for a book item. From AVAILABLE, issue moves to LOANED and damage moves to IN_REPAIR, which returns to AVAILABLE when repaired. From LOANED, a return with an empty reservation queue goes back to AVAILABLE, a return with someone queued goes to RESERVED, and being declared lost goes to LOST. From RESERVED, being picked up goes to LOANED and an expired hold goes back to AVAILABLE.">
  <defs>
    <marker id="lb-st" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#d8d3c9"/></marker>
    <marker id="lb-stg" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="lb-stb" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <rect x="40" y="40" width="140" height="44" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="66" y="68" font-size="10.5" fill="#9099a8">IN_REPAIR</text>

  <rect x="40" y="140" width="140" height="50" rx="8" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>
  <text x="62" y="171" font-size="11" fill="#5cc66f">AVAILABLE</text>

  <rect x="300" y="140" width="140" height="50" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="334" y="171" font-size="11" fill="#fb863a">LOANED</text>

  <rect x="300" y="240" width="140" height="50" rx="8" fill="rgba(94,159,246,0.14)" stroke="#5e9ff6"/>
  <text x="326" y="271" font-size="11" fill="#5e9ff6">RESERVED</text>

  <rect x="560" y="140" width="140" height="50" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="600" y="171" font-size="11" fill="#f06868">LOST</text>

  <line x1="180" y1="158" x2="296" y2="158" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#lb-st)"/>
  <text x="200" y="151" font-size="9" fill="#e8e4dc">issue()</text>

  <line x1="296" y1="180" x2="184" y2="180" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#lb-stg)"/>
  <text x="188" y="200" font-size="9" fill="#5cc66f">return · queue empty</text>

  <line x1="400" y1="190" x2="400" y2="236" stroke="#5e9ff6" stroke-width="1.3" marker-end="url(#lb-st)"/>
  <text x="410" y="218" font-size="9" fill="#5e9ff6">return · someone queued</text>

  <line x1="340" y1="236" x2="340" y2="194" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#lb-st)"/>
  <text x="228" y="218" font-size="9" fill="#e8e4dc">picked up</text>

  <path d="M300,276 L110,276 L110,196" fill="none" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lb-st)"/>
  <text x="116" y="294" font-size="9" fill="#9099a8">hold expires</text>

  <line x1="440" y1="158" x2="556" y2="158" stroke="#f06868" stroke-width="1.2" marker-end="url(#lb-stb)"/>
  <text x="446" y="151" font-size="9" fill="#f06868">declared lost</text>

  <line x1="90" y1="136" x2="90" y2="90" stroke="#d8d3c9" stroke-width="1.2" marker-end="url(#lb-st)"/>
  <text x="6" y="118" font-size="9" fill="#9099a8">damaged</text>
  <line x1="140" y1="88" x2="140" y2="134" stroke="#d8d3c9" stroke-width="1.2" marker-end="url(#lb-st)"/>
  <text x="150" y="118" font-size="9" fill="#9099a8">repaired</text>

  <text x="460" y="264" font-size="9.5" fill="#6b7280">a boolean cannot express five states —</text>
  <text x="460" y="282" font-size="9.5" fill="#6b7280">and someone always asks about a lost book</text>
  <text x="460" y="306" font-size="9" fill="#5cc66f">the blue branch is the interesting one</text>
</svg>`,
        caption:
          "The blue arrow is the one to point at unprompted: **a returned copy does not automatically go back on the shelf.** Notation: [[state-diagrams]]; the pattern for enforcing it in code is [[state]].",
      },

      // ---------- flows ----------
      { type: "h", text: "The flows, end to end" },
      {
        type: "p",
        text: "**Search** goes through the `Catalog`. Keep index maps — `Map<String, List<Book>>` for title words, author and subject — instead of a linear scan over every book. It is one line to say and it is the difference between *“I would loop over all books”* and a design. Search returns `Book`s; availability is `catalog.availableCount(isbn)`, a count over their items.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 760 336" width="100%" style="max-width:740px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram of issuing a book. The desk calls issue with an ISBN, a member id and the day. Library asks Catalog for the first available item and gets back BookItem B-003. Library then asks Member canBorrow for that day, and Member answers true after checking its own loan count, fine and membership. Library creates a BookLending due fourteen days later, flips B-003 to LOANED, and returns B-003 to the desk.">
  <defs>
    <marker id="lb-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="lb-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="34" y="32" font-size="10" fill="#e8e4dc">issue desk</text>
  <rect x="176" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="212" y="32" font-size="10" fill="#fb863a">Library</text>
  <rect x="330" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="360" y="32" font-size="10" fill="#e8e4dc">Catalog</text>
  <rect x="480" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="516" y="32" font-size="10" fill="#5cc66f">Member</text>
  <rect x="620" y="12" width="126" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="638" y="32" font-size="10" fill="#5e9ff6">BookLending</text>

  <line x1="66" y1="42" x2="66" y2="322" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="236" y1="42" x2="236" y2="322" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="390" y1="42" x2="390" y2="322" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="540" y1="42" x2="540" y2="322" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="683" y1="42" x2="683" y2="322" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="74" y="70" font-size="9.5" fill="#e8e4dc">issue(“978-0-13”, “M-2”, day=12)</text>
  <line x1="66" y1="78" x2="232" y2="78" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lb-call)"/>

  <text x="244" y="104" font-size="9.5" fill="#e8e4dc">firstAvailable(isbn)</text>
  <line x1="236" y1="112" x2="386" y2="112" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lb-call)"/>
  <text x="252" y="136" font-size="9.5" fill="#9099a8">BookItem B-003 · AVAILABLE</text>
  <line x1="390" y1="144" x2="240" y2="144" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lb-ret)"/>

  <text x="244" y="172" font-size="9.5" fill="#e8e4dc">canBorrow(day=12)</text>
  <line x1="236" y1="180" x2="536" y2="180" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lb-call)"/>
  <rect x="530" y="186" width="200" height="44" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="540" y="203" font-size="8.5" fill="#5cc66f">2 of 5 loans · fine ₹0 ·</text>
  <text x="540" y="219" font-size="8.5" fill="#5cc66f">membership valid → true</text>
  <line x1="540" y1="242" x2="240" y2="242" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lb-ret)"/>
  <text x="252" y="236" font-size="9.5" fill="#5cc66f">true — the rule lives there, not here</text>

  <text x="244" y="268" font-size="9.5" fill="#e8e4dc">new BookLending(B-003, M-2, issued 12, due 26)</text>
  <line x1="236" y1="276" x2="679" y2="276" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lb-call)"/>
  <rect x="176" y="288" width="180" height="24" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="186" y="304" font-size="8.5" fill="#fb863a">B-003.status = LOANED</text>
  <line x1="232" y1="330" x2="70" y2="330" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lb-ret)"/>
  <text x="366" y="304" font-size="9.5" fill="#5cc66f">returns a BookItem — never a Book</text>
</svg>`,
        caption:
          "Read the last line. `issue()` hands back a **copy**, with a barcode on it. Search hands back **titles**. If both return the same type, the `Book` / `BookItem` split has not really happened. Notation: [[sequence-diagrams]].",
      },
      {
        type: "p",
        text: "**Return** is the flow worth drawing, because it branches. Close the lending, price the lateness — and then ask the reservation queue what should happen to the copy.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 760 386" width="100%" style="max-width:740px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram of returning a book. The desk calls returnItem with a barcode and a day. Library closes the BookLending, which reports ten days late. Library asks the FinePolicy for the fine, which answers fifty rupees, and adds it to the member. Library then asks the reservation queue for the head. If the queue is empty the item becomes AVAILABLE and goes back on the shelf. If someone is queued the item becomes RESERVED and is held for that member instead.">
  <defs>
    <marker id="lb-rcall" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="lb-rret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="34" y="32" font-size="10" fill="#e8e4dc">issue desk</text>
  <rect x="166" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="202" y="32" font-size="10" fill="#fb863a">Library</text>
  <rect x="322" y="12" width="126" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="340" y="32" font-size="10" fill="#5e9ff6">BookLending</text>
  <rect x="480" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="500" y="32" font-size="10" fill="#e8e4dc">FinePolicy</text>
  <rect x="626" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="644" y="32" font-size="10" fill="#e8e4dc">Reservations</text>

  <line x1="66" y1="42" x2="66" y2="250" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="226" y1="42" x2="226" y2="250" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="385" y1="42" x2="385" y2="250" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="540" y1="42" x2="540" y2="250" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="686" y1="42" x2="686" y2="250" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="74" y="70" font-size="9.5" fill="#e8e4dc">returnItem(“B-001”, day=25)</text>
  <line x1="66" y1="78" x2="222" y2="78" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lb-rcall)"/>

  <text x="234" y="102" font-size="9.5" fill="#e8e4dc">close(returnedOn = 25)</text>
  <line x1="226" y1="110" x2="381" y2="110" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lb-rcall)"/>
  <text x="242" y="134" font-size="9.5" fill="#9099a8">daysLate = 25 − 15 = 10</text>
  <line x1="385" y1="142" x2="230" y2="142" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lb-rret)"/>

  <text x="234" y="166" font-size="9.5" fill="#e8e4dc">fineFor(10 days, priceMinor)</text>
  <line x1="226" y1="174" x2="536" y2="174" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lb-rcall)"/>
  <text x="242" y="198" font-size="9.5" fill="#9099a8">5000 paise = ₹50.00  → member.addFine(5000)</text>
  <line x1="540" y1="206" x2="230" y2="206" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lb-rret)"/>

  <text x="234" y="230" font-size="9.5" fill="#e8e4dc">head(isbn)</text>
  <line x1="226" y1="238" x2="682" y2="238" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lb-rcall)"/>

  <text x="20" y="272" font-size="10.5" fill="#fb863a">…and then the branch that makes this flow worth drawing</text>
  <rect x="20" y="282" width="356" height="90" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="36" y="304" font-size="10" fill="#5cc66f">queue EMPTY</text>
  <text x="36" y="326" font-size="9.5" fill="#e8e4dc">B-001.status = AVAILABLE</text>
  <text x="36" y="346" font-size="9.5" fill="#9099a8">goes back on rack R-12</text>
  <text x="36" y="364" font-size="9" fill="#6b7280">anyone can borrow it next</text>

  <rect x="392" y="282" width="348" height="90" rx="8" fill="#14161a" stroke="#5e9ff6"/>
  <text x="408" y="304" font-size="10" fill="#5e9ff6">queue has M-4 at the head</text>
  <text x="408" y="326" font-size="9.5" fill="#e8e4dc">B-001.status = RESERVED · heldFor = M-4</text>
  <text x="408" y="346" font-size="9.5" fill="#5e9ff6">notify M-4 — a copy is waiting</text>
  <text x="408" y="364" font-size="9" fill="#6b7280">it never touches the shelf</text>
</svg>`,
        caption:
          "The right-hand box is the answer people forget. **A returned copy with a queue behind it goes to the head of that queue, not to the shelf** — otherwise the next walk-in takes the book the reserver has been waiting three weeks for.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Reserve and renew, in four lines",
        text: "**Reserve** is only offered when `availableCount(isbn) == 0` — otherwise just borrow it. Keep a `Deque<String>` of member ids per ISBN; FIFO, no priorities, no expiry unless asked. **Renew** is allowed only when nobody is queued on that title: *“you can keep it, because nobody is waiting.”* The notification when a copy frees up is one [[observer]] — say the word, do not build an event bus.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 288" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A reservation queue diagram. Clean Code shows zero of three available, with copies B-001, B-002 and B-003 all loaned to Asha, Ravi and Meera. Below, a FIFO queue holds Dev at the head, then Priya, then Sam. When B-001 comes back it is drawn going to Dev at the head of the queue, while a path to the empty shelf is crossed out.">
  <defs>
    <marker id="lb-q" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5e9ff6"/></marker>
    <marker id="lb-qbad" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="20" y="22" font-size="11" fill="#e8e4dc">“Clean Code”</text>
  <text x="140" y="22" font-size="11" fill="#f06868">0 of 3 available</text>
  <rect x="20" y="34" width="130" height="48" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="54" font-size="9.5" fill="#fb863a">B-001</text><text x="34" y="70" font-size="8.5" fill="#9099a8">Asha · due 15</text>
  <rect x="164" y="34" width="130" height="48" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="178" y="54" font-size="9.5" fill="#fb863a">B-002</text><text x="178" y="70" font-size="8.5" fill="#9099a8">Ravi · due 15</text>
  <rect x="308" y="34" width="130" height="48" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="322" y="54" font-size="9.5" fill="#fb863a">B-003</text><text x="322" y="70" font-size="8.5" fill="#9099a8">Meera · due 15</text>

  <text x="20" y="118" font-size="10" fill="#5e9ff6">reservation queue for isbn 978-0-13  —  FIFO</text>
  <rect x="20" y="128" width="120" height="44" rx="6" fill="rgba(94,159,246,0.14)" stroke="#5e9ff6"/>
  <text x="34" y="147" font-size="9.5" fill="#5e9ff6">Dev</text><text x="34" y="163" font-size="8.5" fill="#9099a8">head · placed day 1</text>
  <text x="150" y="154" font-size="11" fill="#6b7280">→</text>
  <rect x="172" y="128" width="120" height="44" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="186" y="147" font-size="9.5" fill="#9099a8">Priya</text><text x="186" y="163" font-size="8.5" fill="#6b7280">placed day 3</text>
  <text x="302" y="154" font-size="11" fill="#6b7280">→</text>
  <rect x="324" y="128" width="120" height="44" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="338" y="147" font-size="9.5" fill="#9099a8">Sam</text><text x="338" y="163" font-size="8.5" fill="#6b7280">placed day 6</text>

  <rect x="20" y="204" width="180" height="44" rx="6" fill="#14161a" stroke="#5cc66f"/>
  <text x="34" y="224" font-size="9.5" fill="#5cc66f">B-001 comes back, day 25</text>
  <text x="34" y="240" font-size="8.5" fill="#9099a8">returnItem(“B-001”, 25)</text>

  <line x1="106" y1="200" x2="82" y2="176" stroke="#5e9ff6" stroke-width="1.5" marker-end="url(#lb-q)"/>
  <text x="212" y="222" font-size="9.5" fill="#5e9ff6">→ held for Dev · status = RESERVED</text>
  <text x="212" y="240" font-size="9" fill="#6b7280">Priya moves up to the head</text>

  <rect x="490" y="180" width="210" height="86" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="504" y="202" font-size="10" fill="#f06868">✗ back on the shelf</text>
  <text x="504" y="222" font-size="9" fill="#9099a8">status = AVAILABLE</text>
  <text x="504" y="240" font-size="9" fill="#f06868">the next walk-in takes it</text>
  <text x="504" y="258" font-size="9" fill="#f06868">Dev waits another month</text>
  <line x1="206" y1="222" x2="486" y2="212" stroke="#f06868" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lb-qbad)"/>
  <line x1="330" y1="200" x2="370" y2="232" stroke="#f06868" stroke-width="2"/>
  <line x1="370" y1="200" x2="330" y2="232" stroke="#f06868" stroke-width="2"/>

  <text x="490" y="30" font-size="9.5" fill="#6b7280">reserve is offered only when the</text>
  <text x="490" y="48" font-size="9.5" fill="#6b7280">available count is zero — otherwise</text>
  <text x="490" y="66" font-size="9.5" fill="#6b7280">the member should simply borrow</text>
  <text x="490" y="98" font-size="9.5" fill="#5e9ff6">renew is refused while this</text>
  <text x="490" y="116" font-size="9.5" fill="#5e9ff6">queue is non-empty</text>
</svg>`,
        caption:
          "Follow the two arrows out of *“B-001 comes back”*. Only one of them is correct, and choosing it is a single `if` at the end of `returnItem()`.",
      },

      // ---------- money and time ----------
      { type: "h", text: "Money and time — the two things people get casually wrong" },
      {
        type: "ul",
        items: [
          "**Time is an argument.** `returnItem(barcode, on)` and `member.canBorrow(today)` — never `LocalDate.now()` read inside the method. A ten-day-late fine is then a one-line test. A method that reads the clock can only be tested by waiting or by injecting a fake clock, and in 60 minutes you will do neither. Same rule [[parking-lot]] used for billing.",
          "**Money is an integer in minor units.** `long fineMinor` in paise or cents, never `double`. `0.1 + 0.2` is not `0.3`, and a fine that is off by a hundredth is a bug report. Format only at the edge, when you print.",
          "**A fine policy is a [[strategy]].** `fineFor(daysLate, itemPriceMinor)` behind an interface, with a flat per-day version, a slab version and a capped version. Swapping it must not change one character of `returnItem()`. Exactly the same seam as the pricing strategy in [[parking-lot]] — say so, it shows you recognise the shape rather than memorised the problem.",
          "**Statuses are an enum with legal transitions,** not free-text strings and not a boolean. `AVAILABLE → LOANED → AVAILABLE` is the happy path; `RESERVED`, `LOST` and `IN_REPAIR` are the ones that prove you thought about the real world.",
        ],
      },
      {
        type: "code",
        language: "java",
        filename: "the strategy seam",
        code: `interface FinePolicy {
    /** daysLate is already clamped at 0. Money in minor units — paise, never double. */
    long fineFor(long daysLate, long itemPriceMinor);
    String label();
}

class FlatPerDayFine implements FinePolicy {          // 500 paise = 5.00 a day
    private final long perDayMinor;
    public long fineFor(long daysLate, long price) { return daysLate * perDayMinor; }
}

class SlabFine implements FinePolicy {                 // gentle first week, then not
    public long fineFor(long daysLate, long price) {
        long cheap = Math.min(daysLate, 7);
        return cheap * 200 + Math.max(0, daysLate - 7) * 1000;
    }
}

class CappedFine implements FinePolicy {               // never fine more than the cap
    private final FinePolicy inner; private final long capMinor;
    public long fineFor(long daysLate, long price) {
        return Math.min(inner.fineFor(daysLate, price), capMinor);
    }
}
// returnItem() calls policy.fineFor(...) and does not change when the policy does`,
      },

      // ---------- extensibility ----------
      { type: "h", text: "What the design costs to extend" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 302" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A table of extension costs. Adding a new fine policy costs one new class and no edits. Adding due-date notifications costs one observer and no edits to issue or return. Changing the borrow limit costs one constant on Member. Adding branches costs a branch field on BookItem plus a catalogue filter. Adding e-books costs a rethink because an e-book has no physical copy, which breaks the item model.">
  <text x="20" y="22" font-size="10.5" fill="#fb863a">ADD THIS FEATURE  →  WHAT YOU TOUCH</text>
  <line x1="20" y1="34" x2="680" y2="34" stroke="#3a414c"/>
  <text x="24" y="54" font-size="9" fill="#6b7280">feature</text>
  <text x="330" y="54" font-size="9" fill="#6b7280">files touched</text>
  <text x="586" y="54" font-size="9" fill="#6b7280">cost</text>
  <line x1="20" y1="62" x2="680" y2="62" stroke="#2d333d" stroke-dasharray="3 3"/>

  <text x="24" y="86" font-size="10" fill="#e8e4dc">a new fine policy (slabs)</text>
  <text x="330" y="86" font-size="9.5" fill="#9099a8">1 new class, 0 edits</text>
  <text x="586" y="86" font-size="10" fill="#5cc66f">free</text>

  <text x="24" y="112" font-size="10" fill="#e8e4dc">due-date reminders</text>
  <text x="330" y="112" font-size="9.5" fill="#9099a8">1 observer on Library</text>
  <text x="586" y="112" font-size="10" fill="#5cc66f">free</text>

  <text x="24" y="138" font-size="10" fill="#e8e4dc">borrow limit 5 → 8</text>
  <text x="330" y="138" font-size="9.5" fill="#9099a8">1 constant on Member</text>
  <text x="586" y="138" font-size="10" fill="#5cc66f">free</text>

  <text x="24" y="164" font-size="10" fill="#e8e4dc">reserve expiry after 3 days</text>
  <text x="330" y="164" font-size="9.5" fill="#9099a8">1 field on Reservation + a sweep</text>
  <text x="586" y="164" font-size="10" fill="#fb863a">small</text>

  <text x="24" y="190" font-size="10" fill="#e8e4dc">several branches</text>
  <text x="330" y="190" font-size="9.5" fill="#9099a8">branchId on BookItem, filter in Catalog</text>
  <text x="586" y="190" font-size="10" fill="#fb863a">small</text>

  <text x="24" y="216" font-size="10" fill="#e8e4dc">e-books and audiobooks</text>
  <text x="330" y="216" font-size="9.5" fill="#f06868">BookItem stops making sense</text>
  <text x="586" y="216" font-size="10" fill="#f06868">a rethink</text>

  <line x1="20" y1="232" x2="680" y2="232" stroke="#3a414c"/>
  <text x="24" y="256" font-size="9.5" fill="#9099a8">the first five are cheap because Book / BookItem / BookLending each hold one idea</text>
  <text x="24" y="276" font-size="9.5" fill="#f06868">the last one is honest: an e-book has no copy, no barcode and no rack —</text>
  <text x="24" y="294" font-size="9.5" fill="#f06868">it is a licence with a concurrent-loan count, and saying so is the good answer</text>
</svg>`,
        caption:
          "The bottom two lines are the ones to volunteer. **Knowing where your abstraction stops is worth more than pretending it does not.**",
      },

      // ---------- budget ----------
      { type: "h", text: "The 60 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 224" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sixty minute budget bar split into six segments: five minutes clarifying scope, twelve minutes on entities and the class diagram including the Book versus BookItem split, twenty minutes coding the core classes, twelve minutes on the issue, return and reserve flows, eight minutes on the fine policy and a main demo, and three minutes discussing follow-ups.">
  <text x="20" y="24" font-size="10.5" fill="#fb863a">A 60-MINUTE BUDGET THAT ACTUALLY FINISHES</text>
  <rect x="30" y="52" width="53" height="34" rx="4" fill="rgba(94,159,246,0.16)" stroke="#5e9ff6"/>
  <rect x="83" y="52" width="128" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="211" y="52" width="213" height="34" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="424" y="52" width="128" height="34" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="552" y="52" width="85" height="34" rx="4" fill="rgba(94,159,246,0.16)" stroke="#5e9ff6"/>
  <rect x="637" y="52" width="33" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>

  <text x="34" y="74" font-size="9" fill="#5e9ff6">5</text>
  <text x="87" y="74" font-size="9" fill="#fb863a">12</text>
  <text x="215" y="74" font-size="9" fill="#5cc66f">20</text>
  <text x="428" y="74" font-size="9" fill="#5cc66f">12</text>
  <text x="556" y="74" font-size="9" fill="#5e9ff6">8</text>
  <text x="641" y="74" font-size="9" fill="#9099a8">3</text>

  <line x1="30" y1="86" x2="30" y2="102" stroke="#2d333d"/>
  <line x1="211" y1="86" x2="211" y2="102" stroke="#2d333d"/>
  <line x1="424" y1="86" x2="424" y2="102" stroke="#2d333d"/>
  <line x1="670" y1="86" x2="670" y2="102" stroke="#2d333d"/>
  <text x="24" y="116" font-size="9" fill="#6b7280">0 min</text>
  <text x="198" y="116" font-size="9" fill="#6b7280">17</text>
  <text x="412" y="116" font-size="9" fill="#6b7280">37</text>
  <text x="650" y="116" font-size="9" fill="#6b7280">60</text>

  <text x="30" y="146" font-size="9.5" fill="#5e9ff6">5 · clarify scope — “multiple copies of a title?” is the question</text>
  <text x="30" y="164" font-size="9.5" fill="#fb863a">12 · entities + class diagram — the Book / BookItem split happens HERE</text>
  <text x="30" y="182" font-size="9.5" fill="#5cc66f">20 · code the core: Book, BookItem, Member, BookLending, Catalog</text>
  <text x="30" y="200" font-size="9.5" fill="#5cc66f">12 · issue, return with the reservation branch, reserve, renew</text>
  <text x="30" y="218" font-size="9.5" fill="#5e9ff6">8 · fine policy + a main() that prints  ·  3 · follow-ups out loud</text>
</svg>`,
        caption:
          "The orange block is load-bearing. **If you have not split `Book` from `BookItem` by minute 17, the next 43 minutes are spent writing code you will have to change.**",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups they will ask" },
      {
        type: "ul",
        items: [
          "**“Now there are five branches.”** → a `branchId` on `BookItem` (the *copy* lives somewhere; the title does not), and `Catalog.availableCount(isbn, branchId)`. Then the real question behind it: *can you return a copy to a different branch?* Yes — the lending closes normally and the item's `branchId` changes. Say that; it proves you know which class owns location.",
          "**“What about e-books?”** → the honest answer, not a fudge. An e-book has no barcode, no rack and no condition, so `BookItem` stops meaning anything. Model it as a licence with a concurrent-loan count: `Book` stays, `BookItem` is replaced by a `DigitalLicence` with `maxConcurrent`. This is a genuinely good question about where the abstraction ends.",
          "**“Two librarians issue the last copy at the same time.”** → `firstAvailable()` then `setStatus(LOANED)` is check-then-act, exactly the bug in [[coffee-machine]]. The fix is the same shape: an atomic take on the item — one lock around find-and-claim, or a compare-and-set on the status. One paragraph. Do not turn this into the whole answer; the round is about modelling.",
          "**“Notify members when a reserved copy arrives, and before a book is due.”** → the library publishes events, and an email or SMS notifier subscribes. [[observer]] again, and it keeps notification code out of `returnItem()`.",
          "**“Search is slow with two million books.”** → the `HashMap` indexes stop being enough once you want prefix matching, typo tolerance and ranking. That is a search engine — an inverted index, Lucene or Elasticsearch — and the `Catalog` interface is the seam you would put it behind. Name the seam, do not design the engine.",
          "**“How do you know a member is a repeat offender?”** → count the *closed* `BookLending`s with `daysLate > 0`. This is the payoff for making the loan an object, and it is worth pointing at when you answer.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**One `Book` class with `isAvailable`.** The fatal one. Every method downstream is then wrong, and there is no time at minute 45 to redo it.",
          "**A `LibraryService` that contains every rule.** Getters on `Member`, decisions in the service, and an anaemic model the interviewer will name out loud.",
          "**Loans as fields on the item.** No history, no late count, no way to compute a fine after the copy is back on the shelf.",
          "**`double` for fines.** It will be raised, and it is a free point you handed away.",
          "**A `Person` hierarchy four levels deep.** Twenty minutes spent on `AbstractLibraryUser` and no working `issue()` at the end.",
          "**Forgetting the reservation branch on return.** The copy goes back to the shelf and the member who waited three weeks watches a walk-in take it.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Borrow a copy — and notice which one",
        body:
          "Leave **M-1 Asha** selected and press **📕 Borrow** on *Clean Code*. Watch three things at once: one specific barcode chip turns 🟠, that same barcode appears on Asha's card, and the title header drops to `2 of 3 available`. The `.callline` says `library.issue(\"978-0-13\", \"M-1\", day=1) → BookItem#B-001`. **She has copy B-001 — not “the book”.** That is the entire `Book` versus `BookItem` lesson, in one click.",
      },
      {
        title: "Borrow the same title again",
        body:
          "Select **M-2 Ravi** and press **📕 Borrow** on the same title. A *different* barcode goes out — B-002 — and the header counts down again. Do it once more with **M-3 Meera** and the count hits `0 of 3` and the button changes to **🔖 Reserve**. (**📚 Empty the shelf** does all three at once.) Ask yourself where any of this would live if `Book` had a single `isAvailable` boolean.",
      },
      {
        title: "Reserve, then return into the queue",
        body:
          "With every copy out, press **🔖 Reserve** — the selected member joins a visible FIFO queue on the title. Now press **📗 Return** on one of the 🟠 chips. The copy does **not** go green: it turns 🔵 and moves to the head of the queue, and the explain line says exactly that. Return another copy when the queue is empty and *that* one goes 🟢. **One `if` at the end of `returnItem()` is the whole difference.**",
      },
      {
        title: "Make something overdue and price it three ways",
        body:
          "Press **⏩ +7 days** until the day counter passes a due date — overdue chips turn red and a fine appears on the member card. Now click **🪜 Slabs** and then **🧢 Capped**. Every open fine re-prices instantly and the explain line points out that `returnItem()` was never touched. That is [[strategy]] doing its only job.",
      },
      {
        title: "Hit the limit and read where the refusal came from",
        body:
          "Press **🚫 Fill to limit** with a member selected, then try to borrow again. The refusal names `member.canBorrow(day)` — *the rule is on `Member`, not in the service*. Change it in your head to the ✗ version from the figure: `if (service.getLoans(m).size() >= 5)`. How many places would you have to edit to raise the limit to eight?",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `ItemStatus` enum → `Book` (isbn, title, author, subject) → `BookItem` (barcode, isbn, rack, price in minor units, status) → `BookLending` (barcode, memberId, issuedOn, dueOn, returnedOn) → `Member` with `canBorrow(today)` → `Catalog` with index maps and `firstAvailable(isbn)` → `Library.issue / returnItem / reserve / renew` → a `main()` that issues three copies, reserves, returns late and prints the fine. If your `search()` and your `issue()` return the same type, start again.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "LibraryManagement.java",
        code: `import java.util.*;
import java.util.function.BiConsumer;

/*
 * Dates are plain day numbers so the demo is deterministic. Real code uses
 * LocalDate — what matters in the round is that the date is PASSED IN,
 * never read from a clock inside the method.
 */

enum ItemStatus { AVAILABLE, RESERVED, LOANED, LOST, IN_REPAIR }

/** The CATALOGUE RECORD. One per title, however many copies the library owns. */
record Book(String isbn, String title, String author, String subject, int publishedYear) {}

/** ONE PHYSICAL COPY — the thing a member actually carries home. */
final class BookItem {
    final String barcode, isbn, rack;
    final int acquiredOn;
    final long priceMinor;                  // paise — integer minor units, never double
    private ItemStatus status = ItemStatus.AVAILABLE;
    private String heldFor;                 // member id, only while RESERVED

    BookItem(String barcode, String isbn, String rack, int acquiredOn, long priceMinor) {
        this.barcode = barcode; this.isbn = isbn; this.rack = rack;
        this.acquiredOn = acquiredOn; this.priceMinor = priceMinor;
    }

    ItemStatus status()   { return status; }
    String heldFor()      { return heldFor; }
    boolean isAvailable() { return status == ItemStatus.AVAILABLE; }

    // the small state machine — a boolean cannot express five states
    void loanOut() {
        if (status != ItemStatus.AVAILABLE && status != ItemStatus.RESERVED)
            throw new IllegalStateException(barcode + " is " + status);
        status = ItemStatus.LOANED; heldFor = null;
    }
    void shelve()                 { status = ItemStatus.AVAILABLE; heldFor = null; }
    void holdFor(String memberId) { status = ItemStatus.RESERVED;  heldFor = memberId; }
    void markLost()               { status = ItemStatus.LOST;      heldFor = null; }
    void sendForRepair()          { status = ItemStatus.IN_REPAIR; heldFor = null; }
}

/** The relationship IS an object. The closed ones are the library's memory. */
final class BookLending {
    static final int LOAN_DAYS = 14;
    final String barcode, memberId;
    final int issuedOn, dueOn;
    private Integer returnedOn;
    private long fineMinor;

    BookLending(String barcode, String memberId, int issuedOn) {
        this.barcode = barcode; this.memberId = memberId;
        this.issuedOn = issuedOn; this.dueOn = issuedOn + LOAN_DAYS;
    }
    boolean isOpen()      { return returnedOn == null; }
    long daysLate(int on) { return Math.max(0, on - dueOn); }
    long fineMinor()      { return fineMinor; }
    void close(int on, long fine) { returnedOn = on; fineMinor = fine; }
}

final class Money {
    static String of(long minor) { return "Rs." + (minor / 100) + "." + String.format("%02d", minor % 100); }
}

/* ---------------- the strategy seam: pricing lateness ---------------- */

interface FinePolicy {
    long fineFor(long daysLate, long itemPriceMinor);   // daysLate is already clamped at 0
    String label();
}

final class FlatPerDayFine implements FinePolicy {
    private final long perDayMinor;
    FlatPerDayFine(long perDayMinor) { this.perDayMinor = perDayMinor; }
    public long fineFor(long daysLate, long price) { return daysLate * perDayMinor; }
    public String label() { return "flat " + Money.of(perDayMinor) + "/day"; }
}

final class SlabFine implements FinePolicy {
    public long fineFor(long daysLate, long price) {
        long gentle = Math.min(daysLate, 7);
        return gentle * 200 + Math.max(0, daysLate - 7) * 1000;
    }
    public String label() { return "slabs 2.00 then 10.00"; }
}

final class CappedFine implements FinePolicy {
    private final FinePolicy inner; private final long capMinor;
    CappedFine(FinePolicy inner, long capMinor) { this.inner = inner; this.capMinor = capMinor; }
    public long fineFor(long daysLate, long price) {
        return Math.min(inner.fineFor(daysLate, price), Math.min(capMinor, price));
    }
    public String label() { return inner.label() + ", capped at " + Money.of(capMinor); }
}

/* ---------------- accounts: two roles, ONE level deep ---------------- */

abstract class Account {
    final String id, name;
    Account(String id, String name) { this.id = id; this.name = name; }
    abstract String role();
}

final class BorrowRefused extends RuntimeException {
    BorrowRefused(String why) { super(why); }
}

final class Member extends Account {
    static final int  MAX_LOANS = 5;
    static final long MAX_FINE_MINOR = 10_000;            // Rs.100.00
    private final List<BookLending> lendings = new ArrayList<>();
    private final int membershipExpiresOn;
    private long fineOwedMinor;

    Member(String id, String name, int membershipExpiresOn) {
        super(id, name); this.membershipExpiresOn = membershipExpiresOn;
    }
    String role() { return "MEMBER"; }

    long openLoans()     { return lendings.stream().filter(BookLending::isOpen).count(); }
    long lateReturns()   { return lendings.stream().filter(l -> !l.isOpen() && l.fineMinor() > 0).count(); }
    long fineOwedMinor() { return fineOwedMinor; }
    List<BookLending> lendings() { return List.copyOf(lendings); }

    /** THE RULE LIVES HERE. The service asks; it does not reach in and decide. */
    void assertCanBorrow(int today) {
        if (today > membershipExpiresOn)
            throw new BorrowRefused(name + ": membership expired on day " + membershipExpiresOn);
        if (openLoans() >= MAX_LOANS)
            throw new BorrowRefused(name + ": loan limit reached (" + MAX_LOANS + " of " + MAX_LOANS + ")");
        if (fineOwedMinor > MAX_FINE_MINOR)
            throw new BorrowRefused(name + ": outstanding fine " + Money.of(fineOwedMinor));
    }
    boolean canBorrow(int today) {
        try { assertCanBorrow(today); return true; } catch (BorrowRefused e) { return false; }
    }
    void addLending(BookLending l) { lendings.add(l); }
    void addFine(long minor)       { fineOwedMinor += minor; }
    void payFine(long minor)       { fineOwedMinor = Math.max(0, fineOwedMinor - minor); }
}

final class Librarian extends Account {
    Librarian(String id, String name) { super(id, name); }
    String role() { return "LIBRARIAN"; }
    void addItem(Library library, BookItem item) { library.catalog().addItem(item); }
    BookItem issueFor(Library library, String isbn, String memberId, int today) {
        return library.issue(isbn, memberId, today);
    }
}

/* ---------------- search: index maps, not a linear scan ---------------- */

final class Catalog {
    private final Map<String, Book> byIsbn = new LinkedHashMap<>();
    private final Map<String, List<Book>> byTitleWord = new HashMap<>();
    private final Map<String, List<Book>> byAuthor = new HashMap<>();
    private final Map<String, List<Book>> bySubject = new HashMap<>();
    private final Map<String, List<BookItem>> itemsByIsbn = new LinkedHashMap<>();
    private final Map<String, BookItem> byBarcode = new HashMap<>();

    void addBook(Book b) {
        byIsbn.put(b.isbn(), b);
        for (String w : b.title().toLowerCase().split(" "))
            byTitleWord.computeIfAbsent(w, k -> new ArrayList<>()).add(b);
        byAuthor.computeIfAbsent(b.author().toLowerCase(), k -> new ArrayList<>()).add(b);
        bySubject.computeIfAbsent(b.subject().toLowerCase(), k -> new ArrayList<>()).add(b);
        itemsByIsbn.computeIfAbsent(b.isbn(), k -> new ArrayList<>());
    }
    void addItem(BookItem item) {
        itemsByIsbn.computeIfAbsent(item.isbn, k -> new ArrayList<>()).add(item);
        byBarcode.put(item.barcode, item);
    }

    Book book(String isbn)         { return byIsbn.get(isbn); }
    Collection<Book> allBooks()    { return byIsbn.values(); }
    List<BookItem> items(String isbn) { return itemsByIsbn.getOrDefault(isbn, List.of()); }
    BookItem item(String barcode) {
        BookItem i = byBarcode.get(barcode);
        if (i == null) throw new IllegalArgumentException("unknown barcode " + barcode);
        return i;
    }

    // SEARCH RETURNS BOOKS — titles. Availability is a COUNT over their items.
    List<Book> searchByTitle(String word)   { return byTitleWord.getOrDefault(word.toLowerCase(), List.of()); }
    List<Book> searchByAuthor(String a)     { return byAuthor.getOrDefault(a.toLowerCase(), List.of()); }
    List<Book> searchBySubject(String s)    { return bySubject.getOrDefault(s.toLowerCase(), List.of()); }
    List<Book> searchByYear(int year) {
        List<Book> out = new ArrayList<>();
        for (Book b : byIsbn.values()) if (b.publishedYear() == year) out.add(b);
        return out;
    }
    long availableCount(String isbn) { return items(isbn).stream().filter(BookItem::isAvailable).count(); }

    // ISSUE RETURNS AN ITEM — a specific copy with a barcode on it.
    Optional<BookItem> firstAvailable(String isbn) {
        return items(isbn).stream().filter(BookItem::isAvailable).findFirst();
    }
    Optional<BookItem> heldFor(String isbn, String memberId) {
        return items(isbn).stream()
                .filter(i -> i.status() == ItemStatus.RESERVED && memberId.equals(i.heldFor()))
                .findFirst();
    }
}

/* ---------------- the facade that orchestrates, and decides nothing ---------------- */

final class Library {
    private final Catalog catalog = new Catalog();
    private final Map<String, Member> members = new LinkedHashMap<>();
    private final Map<String, Deque<String>> reservations = new HashMap<>();
    private final List<BookLending> lendings = new ArrayList<>();
    private final List<BiConsumer<String, String>> listeners = new ArrayList<>();
    private FinePolicy finePolicy;

    Library(FinePolicy finePolicy) { this.finePolicy = finePolicy; }

    Catalog catalog()                      { return catalog; }
    FinePolicy finePolicy()                { return finePolicy; }
    void setFinePolicy(FinePolicy p)       { finePolicy = p; }          // returnItem() unchanged
    void addMember(Member m)               { members.put(m.id, m); }
    void onNotify(BiConsumer<String, String> l) { listeners.add(l); }   // observer, one line

    BookItem issue(String isbn, String memberId, int today) {
        Member m = member(memberId);
        BookItem item = catalog.heldFor(isbn, memberId)                  // your held copy comes first
                .or(() -> catalog.firstAvailable(isbn))
                .orElseThrow(() -> new IllegalStateException("no copy of " + isbn + " is available"));
        m.assertCanBorrow(today);                                        // ASK — do not decide for it
        if (item.status() == ItemStatus.RESERVED) dequeue(isbn, memberId);
        item.loanOut();
        BookLending lending = new BookLending(item.barcode, memberId, today);
        lendings.add(lending);
        m.addLending(lending);
        return item;
    }

    /** Returns the fine charged, in minor units. */
    long returnItem(String barcode, int on) {
        BookItem item = catalog.item(barcode);
        BookLending lending = openLendingFor(barcode);
        long fine = finePolicy.fineFor(lending.daysLate(on), item.priceMinor);
        lending.close(on, fine);
        member(lending.memberId).addFine(fine);

        Deque<String> queue = reservations.get(item.isbn);               // THE BRANCH
        if (queue != null && !queue.isEmpty()) {
            String next = queue.peekFirst();
            item.holdFor(next);                                          // NOT back on the shelf
            notifyMember(next, "copy " + barcode + " of " + item.isbn + " is waiting for you");
        } else {
            item.shelve();
        }
        return fine;
    }

    int reserve(String isbn, String memberId) {
        if (catalog.availableCount(isbn) > 0)
            throw new IllegalStateException("a copy is on the shelf — borrow it instead of reserving");
        Deque<String> q = reservations.computeIfAbsent(isbn, k -> new ArrayDeque<>());
        if (!q.contains(memberId)) q.addLast(memberId);
        return new ArrayList<>(q).indexOf(memberId) + 1;
    }

    /** Allowed only when nobody is waiting for the title. */
    BookLending renew(String barcode, int on) {
        BookItem item = catalog.item(barcode);
        Deque<String> q = reservations.get(item.isbn);
        if (q != null && !q.isEmpty())
            throw new IllegalStateException("cannot renew: " + q.size() + " reservation(s) waiting on " + item.isbn);
        BookLending current = openLendingFor(barcode);
        long fine = finePolicy.fineFor(current.daysLate(on), item.priceMinor);
        current.close(on, fine);
        Member m = member(current.memberId);
        m.addFine(fine);
        BookLending fresh = new BookLending(barcode, current.memberId, on);
        lendings.add(fresh);
        m.addLending(fresh);
        return fresh;
    }

    int queueDepth(String isbn) { return reservations.getOrDefault(isbn, new ArrayDeque<>()).size(); }
    Member member(String id) {
        Member m = members.get(id);
        if (m == null) throw new IllegalArgumentException("unknown member " + id);
        return m;
    }
    Collection<Member> allMembers() { return members.values(); }

    private void dequeue(String isbn, String memberId) {
        Deque<String> q = reservations.get(isbn);
        if (q != null) { q.remove(memberId); if (q.isEmpty()) reservations.remove(isbn); }
    }
    private BookLending openLendingFor(String barcode) {
        for (BookLending l : lendings) if (l.isOpen() && l.barcode.equals(barcode)) return l;
        throw new IllegalStateException(barcode + " is not on loan");
    }
    private void notifyMember(String memberId, String message) {
        for (BiConsumer<String, String> l : listeners) l.accept(memberId, message);
    }
}

public class Main {
    static Library library;

    public static void main(String[] args) {
        library = new Library(new FlatPerDayFine(500));                  // Rs.5.00 a day
        library.onNotify((memberId, msg) -> System.out.println("    notify " + memberId + ": " + msg));

        Catalog catalog = library.catalog();
        catalog.addBook(new Book("978-0-13", "Clean Code", "Robert C. Martin", "software", 2008));
        catalog.addBook(new Book("978-0-20", "The Pragmatic Programmer", "Andrew Hunt", "software", 1999));
        catalog.addBook(new Book("978-0-21", "Design Patterns", "Erich Gamma", "software", 1994));

        Librarian raj = new Librarian("L-1", "Raj");
        raj.addItem(library, new BookItem("B-001", "978-0-13", "R-12", 0, 70000));
        raj.addItem(library, new BookItem("B-002", "978-0-13", "R-12", 0, 70000));
        raj.addItem(library, new BookItem("B-003", "978-0-13", "R-12", 0, 70000));
        raj.addItem(library, new BookItem("P-001", "978-0-20", "R-07", 0, 60000));
        raj.addItem(library, new BookItem("P-002", "978-0-20", "R-07", 0, 60000));
        raj.addItem(library, new BookItem("D-001", "978-0-21", "R-03", 0, 90000));
        raj.addItem(library, new BookItem("D-002", "978-0-21", "R-03", 0, 90000));
        raj.addItem(library, new BookItem("D-003", "978-0-21", "R-03", 0, 90000));

        library.addMember(new Member("M-1", "Asha",  400));
        library.addMember(new Member("M-2", "Ravi",  400));
        library.addMember(new Member("M-3", "Meera", 400));
        library.addMember(new Member("M-4", "Dev",   400));

        System.out.println("=== search: title word \\"clean\\" — search returns BOOKS ===");
        for (Book b : catalog.searchByTitle("clean")) show(b);

        System.out.println("\\n=== day 1: three members borrow the same title ===");
        borrow("978-0-13", "M-1", 1);
        borrow("978-0-13", "M-2", 1);
        borrow("978-0-13", "M-3", 1);
        show(catalog.book("978-0-13"));

        System.out.println("\\n=== day 1: Dev wants it too ===");
        borrow("978-0-13", "M-4", 1);
        System.out.println("  reserve -> position " + library.reserve("978-0-13", "M-4") + " in the queue");

        System.out.println("\\n=== day 1: Ravi fills his card ===");
        borrow("978-0-20", "M-2", 1);
        borrow("978-0-20", "M-2", 1);
        borrow("978-0-21", "M-2", 1);
        borrow("978-0-21", "M-2", 1);
        borrow("978-0-21", "M-2", 1);          // the 6th — refused by Member, not by the service

        System.out.println("\\n=== day 10: Meera tries to renew B-003 ===");
        try { library.renew("B-003", 10); }
        catch (RuntimeException e) { System.out.println("  renew refused: " + e.getMessage()); }

        System.out.println("\\n=== day 25: Asha returns B-001, 10 days late ===");
        long fine = library.returnItem("B-001", 25);
        BookItem b001 = catalog.item("B-001");
        System.out.println("  fine " + Money.of(fine) + " (" + library.finePolicy().label() + ")");
        System.out.println("  B-001 -> " + b001.status() + ", held for " + b001.heldFor() + "  <- NOT back on the shelf");
        show(catalog.book("978-0-13"));

        System.out.println("\\n=== the same 10 days, priced by three policies ===");
        for (FinePolicy p : List.of(new FlatPerDayFine(500), new SlabFine(),
                                    new CappedFine(new FlatPerDayFine(500), 2000)))
            System.out.printf("  %-34s %s%n", p.label(), Money.of(p.fineFor(10, 70000)));
        System.out.println("  returnItem() was never touched — that is the strategy seam");

        System.out.println("\\n=== day 25: Dev collects the copy held for him ===");
        borrow("978-0-13", "M-4", 25);
        System.out.println("  queue depth for 978-0-13 is now " + library.queueDepth("978-0-13"));

        System.out.println("\\n=== members ===");
        for (Member m : library.allMembers())
            System.out.printf("  %-6s %-6s loans %d/%d  fine %-10s late returns %d%n",
                    m.id, m.name, m.openLoans(), Member.MAX_LOANS, Money.of(m.fineOwedMinor()), m.lateReturns());
    }

    static void borrow(String isbn, String memberId, int day) {
        try {
            BookItem item = library.issue(isbn, memberId, day);
            System.out.println("  " + memberId + " -> " + item.barcode + " (due day " + (day + BookLending.LOAN_DAYS) + ")");
        } catch (RuntimeException e) {
            System.out.println("  refused: " + e.getMessage());
        }
    }

    static void show(Book b) {
        Catalog c = library.catalog();
        System.out.printf("  %-26s %-18s %d of %d available%n",
                b.title(), b.author(), c.availableCount(b.isbn()), c.items(b.isbn()).size());
    }
}

/* ------------------------- expected output -------------------------
=== search: title word "clean" — search returns BOOKS ===
  Clean Code                 Robert C. Martin   3 of 3 available

=== day 1: three members borrow the same title ===
  M-1 -> B-001 (due day 15)
  M-2 -> B-002 (due day 15)
  M-3 -> B-003 (due day 15)
  Clean Code                 Robert C. Martin   0 of 3 available

=== day 1: Dev wants it too ===
  refused: no copy of 978-0-13 is available
  reserve -> position 1 in the queue

=== day 1: Ravi fills his card ===
  M-2 -> P-001 (due day 15)
  M-2 -> P-002 (due day 15)
  M-2 -> D-001 (due day 15)
  M-2 -> D-002 (due day 15)
  refused: Ravi: loan limit reached (5 of 5)

=== day 10: Meera tries to renew B-003 ===
  renew refused: cannot renew: 1 reservation(s) waiting on 978-0-13

=== day 25: Asha returns B-001, 10 days late ===
    notify M-4: copy B-001 of 978-0-13 is waiting for you
  fine Rs.50.00 (flat Rs.5.00/day)
  B-001 -> RESERVED, held for M-4  <- NOT back on the shelf
  Clean Code                 Robert C. Martin   0 of 3 available

=== the same 10 days, priced by three policies ===
  flat Rs.5.00/day                   Rs.50.00
  slabs 2.00 then 10.00              Rs.44.00
  flat Rs.5.00/day, capped at Rs.20.00 Rs.20.00
  returnItem() was never touched — that is the strategy seam

=== day 25: Dev collects the copy held for him ===
  M-4 -> B-001 (due day 39)
  queue depth for 978-0-13 is now 0

=== members ===
  M-1    Asha   loans 0/5  fine Rs.50.00  late returns 1
  M-2    Ravi   loans 5/5  fine Rs.0.00    late returns 0
  M-3    Meera  loans 1/5  fine Rs.0.00    late returns 0
  M-4    Dev    loans 1/5  fine Rs.0.00    late returns 0
------------------------------------------------------------------- */`,
      },
      {
        label: "Python",
        language: "python",
        filename: "library_management.py",
        code: `from collections import deque
from dataclasses import dataclass
from enum import Enum
from typing import Callable, Optional

# Dates are plain day numbers so the demo is deterministic. Real code uses
# datetime.date — what matters is that the date is PASSED IN, never read from
# a clock inside the method.

LOAN_DAYS = 14


class ItemStatus(Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    LOANED = "LOANED"
    LOST = "LOST"
    IN_REPAIR = "IN_REPAIR"


@dataclass(frozen=True)
class Book:
    """The CATALOGUE RECORD. One per title, however many copies the library owns."""
    isbn: str
    title: str
    author: str
    subject: str
    published_year: int


class BookItem:
    """ONE PHYSICAL COPY — the thing a member actually carries home."""

    def __init__(self, barcode: str, isbn: str, rack: str, acquired_on: int, price_minor: int):
        self.barcode = barcode
        self.isbn = isbn
        self.rack = rack
        self.acquired_on = acquired_on
        self.price_minor = price_minor          # paise — integers, never float
        self.status = ItemStatus.AVAILABLE
        self.held_for: Optional[str] = None     # member id, only while RESERVED

    @property
    def is_available(self) -> bool:
        return self.status is ItemStatus.AVAILABLE

    # the small state machine — a boolean cannot express five states
    def loan_out(self) -> None:
        if self.status not in (ItemStatus.AVAILABLE, ItemStatus.RESERVED):
            raise RuntimeError(f"{self.barcode} is {self.status.value}")
        self.status, self.held_for = ItemStatus.LOANED, None

    def shelve(self) -> None:
        self.status, self.held_for = ItemStatus.AVAILABLE, None

    def hold_for(self, member_id: str) -> None:
        self.status, self.held_for = ItemStatus.RESERVED, member_id

    def mark_lost(self) -> None:
        self.status, self.held_for = ItemStatus.LOST, None

    def send_for_repair(self) -> None:
        self.status, self.held_for = ItemStatus.IN_REPAIR, None


class BookLending:
    """The relationship IS an object. The closed ones are the library's memory."""

    def __init__(self, barcode: str, member_id: str, issued_on: int):
        self.barcode = barcode
        self.member_id = member_id
        self.issued_on = issued_on
        self.due_on = issued_on + LOAN_DAYS
        self.returned_on: Optional[int] = None
        self.fine_minor = 0

    @property
    def is_open(self) -> bool:
        return self.returned_on is None

    def days_late(self, on: int) -> int:
        return max(0, on - self.due_on)

    def close(self, on: int, fine_minor: int) -> None:
        self.returned_on, self.fine_minor = on, fine_minor


def money(minor: int) -> str:
    return f"Rs.{minor // 100}.{minor % 100:02d}"


# ---------------- the strategy seam: pricing lateness ----------------

class FinePolicy:
    def fine_for(self, days_late: int, item_price_minor: int) -> int:
        raise NotImplementedError

    def label(self) -> str:
        raise NotImplementedError


class FlatPerDayFine(FinePolicy):
    def __init__(self, per_day_minor: int):
        self.per_day_minor = per_day_minor

    def fine_for(self, days_late, item_price_minor):
        return days_late * self.per_day_minor

    def label(self):
        return f"flat {money(self.per_day_minor)}/day"


class SlabFine(FinePolicy):
    def fine_for(self, days_late, item_price_minor):
        gentle = min(days_late, 7)
        return gentle * 200 + max(0, days_late - 7) * 1000

    def label(self):
        return "slabs 2.00 then 10.00"


class CappedFine(FinePolicy):
    def __init__(self, inner: FinePolicy, cap_minor: int):
        self.inner, self.cap_minor = inner, cap_minor

    def fine_for(self, days_late, item_price_minor):
        return min(self.inner.fine_for(days_late, item_price_minor), self.cap_minor, item_price_minor)

    def label(self):
        return f"{self.inner.label()}, capped at {money(self.cap_minor)}"


# ---------------- accounts: two roles, ONE level deep ----------------

class BorrowRefused(Exception):
    pass


class Account:
    def __init__(self, id_: str, name: str):
        self.id = id_
        self.name = name

    @property
    def role(self) -> str:
        raise NotImplementedError


class Member(Account):
    MAX_LOANS = 5
    MAX_FINE_MINOR = 10_000                      # Rs.100.00

    def __init__(self, id_: str, name: str, membership_expires_on: int):
        super().__init__(id_, name)
        self.membership_expires_on = membership_expires_on
        self.lendings: list[BookLending] = []
        self.fine_owed_minor = 0

    @property
    def role(self):
        return "MEMBER"

    @property
    def open_loans(self) -> int:
        return sum(1 for l in self.lendings if l.is_open)

    @property
    def late_returns(self) -> int:
        return sum(1 for l in self.lendings if not l.is_open and l.fine_minor > 0)

    def assert_can_borrow(self, today: int) -> None:
        """THE RULE LIVES HERE. The service asks; it does not reach in and decide."""
        if today > self.membership_expires_on:
            raise BorrowRefused(f"{self.name}: membership expired on day {self.membership_expires_on}")
        if self.open_loans >= self.MAX_LOANS:
            raise BorrowRefused(f"{self.name}: loan limit reached ({self.MAX_LOANS} of {self.MAX_LOANS})")
        if self.fine_owed_minor > self.MAX_FINE_MINOR:
            raise BorrowRefused(f"{self.name}: outstanding fine {money(self.fine_owed_minor)}")

    def can_borrow(self, today: int) -> bool:
        try:
            self.assert_can_borrow(today)
            return True
        except BorrowRefused:
            return False

    def add_lending(self, lending: BookLending) -> None:
        self.lendings.append(lending)

    def add_fine(self, minor: int) -> None:
        self.fine_owed_minor += minor

    def pay_fine(self, minor: int) -> None:
        self.fine_owed_minor = max(0, self.fine_owed_minor - minor)


class Librarian(Account):
    @property
    def role(self):
        return "LIBRARIAN"

    def add_item(self, library: "Library", item: BookItem) -> None:
        library.catalog.add_item(item)

    def issue_for(self, library: "Library", isbn: str, member_id: str, today: int) -> BookItem:
        return library.issue(isbn, member_id, today)


# ---------------- search: index maps, not a linear scan ----------------

class Catalog:
    def __init__(self):
        self._by_isbn: dict[str, Book] = {}
        self._by_title_word: dict[str, list[Book]] = {}
        self._by_author: dict[str, list[Book]] = {}
        self._by_subject: dict[str, list[Book]] = {}
        self._items_by_isbn: dict[str, list[BookItem]] = {}
        self._by_barcode: dict[str, BookItem] = {}

    def add_book(self, book: Book) -> None:
        self._by_isbn[book.isbn] = book
        for word in book.title.lower().split(" "):
            self._by_title_word.setdefault(word, []).append(book)
        self._by_author.setdefault(book.author.lower(), []).append(book)
        self._by_subject.setdefault(book.subject.lower(), []).append(book)
        self._items_by_isbn.setdefault(book.isbn, [])

    def add_item(self, item: BookItem) -> None:
        self._items_by_isbn.setdefault(item.isbn, []).append(item)
        self._by_barcode[item.barcode] = item

    def book(self, isbn: str) -> Book:
        return self._by_isbn[isbn]

    def item(self, barcode: str) -> BookItem:
        if barcode not in self._by_barcode:
            raise KeyError(f"unknown barcode {barcode}")
        return self._by_barcode[barcode]

    def items(self, isbn: str) -> list[BookItem]:
        return self._items_by_isbn.get(isbn, [])

    # SEARCH RETURNS BOOKS — titles. Availability is a COUNT over their items.
    def search_by_title(self, word: str) -> list[Book]:
        return self._by_title_word.get(word.lower(), [])

    def search_by_author(self, author: str) -> list[Book]:
        return self._by_author.get(author.lower(), [])

    def search_by_subject(self, subject: str) -> list[Book]:
        return self._by_subject.get(subject.lower(), [])

    def search_by_year(self, year: int) -> list[Book]:
        return [b for b in self._by_isbn.values() if b.published_year == year]

    def available_count(self, isbn: str) -> int:
        return sum(1 for i in self.items(isbn) if i.is_available)

    # ISSUE RETURNS AN ITEM — a specific copy with a barcode on it.
    def first_available(self, isbn: str) -> Optional[BookItem]:
        return next((i for i in self.items(isbn) if i.is_available), None)

    def held_for(self, isbn: str, member_id: str) -> Optional[BookItem]:
        return next((i for i in self.items(isbn)
                     if i.status is ItemStatus.RESERVED and i.held_for == member_id), None)


# ---------------- the facade that orchestrates, and decides nothing ----------------

class Library:
    def __init__(self, fine_policy: FinePolicy):
        self.catalog = Catalog()
        self.fine_policy = fine_policy
        self._members: dict[str, Member] = {}
        self._reservations: dict[str, deque[str]] = {}
        self._lendings: list[BookLending] = []
        self._listeners: list[Callable[[str, str], None]] = []

    def add_member(self, member: Member) -> None:
        self._members[member.id] = member

    def on_notify(self, listener: Callable[[str, str], None]) -> None:
        self._listeners.append(listener)              # observer, one line

    def member(self, member_id: str) -> Member:
        return self._members[member_id]

    @property
    def members(self):
        return self._members.values()

    def issue(self, isbn: str, member_id: str, today: int) -> BookItem:
        member = self.member(member_id)
        item = self.catalog.held_for(isbn, member_id) or self.catalog.first_available(isbn)
        if item is None:
            raise RuntimeError(f"no copy of {isbn} is available")
        member.assert_can_borrow(today)               # ASK — do not decide for it
        if item.status is ItemStatus.RESERVED:
            self._dequeue(isbn, member_id)
        item.loan_out()
        lending = BookLending(item.barcode, member_id, today)
        self._lendings.append(lending)
        member.add_lending(lending)
        return item

    def return_item(self, barcode: str, on: int) -> int:
        """Returns the fine charged, in minor units."""
        item = self.catalog.item(barcode)
        lending = self._open_lending_for(barcode)
        fine = self.fine_policy.fine_for(lending.days_late(on), item.price_minor)
        lending.close(on, fine)
        self.member(lending.member_id).add_fine(fine)

        queue = self._reservations.get(item.isbn)      # THE BRANCH
        if queue:
            nxt = queue[0]
            item.hold_for(nxt)                         # NOT back on the shelf
            self._notify(nxt, f"copy {barcode} of {item.isbn} is waiting for you")
        else:
            item.shelve()
        return fine

    def reserve(self, isbn: str, member_id: str) -> int:
        if self.catalog.available_count(isbn) > 0:
            raise RuntimeError("a copy is on the shelf — borrow it instead of reserving")
        queue = self._reservations.setdefault(isbn, deque())
        if member_id not in queue:
            queue.append(member_id)
        return list(queue).index(member_id) + 1

    def renew(self, barcode: str, on: int) -> BookLending:
        """Allowed only when nobody is waiting for the title."""
        item = self.catalog.item(barcode)
        queue = self._reservations.get(item.isbn)
        if queue:
            raise RuntimeError(f"cannot renew: {len(queue)} reservation(s) waiting on {item.isbn}")
        current = self._open_lending_for(barcode)
        fine = self.fine_policy.fine_for(current.days_late(on), item.price_minor)
        current.close(on, fine)
        member = self.member(current.member_id)
        member.add_fine(fine)
        fresh = BookLending(barcode, current.member_id, on)
        self._lendings.append(fresh)
        member.add_lending(fresh)
        return fresh

    def queue_depth(self, isbn: str) -> int:
        return len(self._reservations.get(isbn, ()))

    def _dequeue(self, isbn: str, member_id: str) -> None:
        queue = self._reservations.get(isbn)
        if queue and member_id in queue:
            queue.remove(member_id)
            if not queue:
                del self._reservations[isbn]

    def _open_lending_for(self, barcode: str) -> BookLending:
        for lending in self._lendings:
            if lending.is_open and lending.barcode == barcode:
                return lending
        raise RuntimeError(f"{barcode} is not on loan")

    def _notify(self, member_id: str, message: str) -> None:
        for listener in self._listeners:
            listener(member_id, message)


if __name__ == "__main__":
    library = Library(FlatPerDayFine(500))            # Rs.5.00 a day
    library.on_notify(lambda mid, msg: print(f"    notify {mid}: {msg}"))

    catalog = library.catalog
    catalog.add_book(Book("978-0-13", "Clean Code", "Robert C. Martin", "software", 2008))
    catalog.add_book(Book("978-0-20", "The Pragmatic Programmer", "Andrew Hunt", "software", 1999))
    catalog.add_book(Book("978-0-21", "Design Patterns", "Erich Gamma", "software", 1994))

    raj = Librarian("L-1", "Raj")
    for barcode, isbn, rack, price in [
        ("B-001", "978-0-13", "R-12", 70000), ("B-002", "978-0-13", "R-12", 70000),
        ("B-003", "978-0-13", "R-12", 70000), ("P-001", "978-0-20", "R-07", 60000),
        ("P-002", "978-0-20", "R-07", 60000), ("D-001", "978-0-21", "R-03", 90000),
        ("D-002", "978-0-21", "R-03", 90000), ("D-003", "978-0-21", "R-03", 90000),
    ]:
        raj.add_item(library, BookItem(barcode, isbn, rack, 0, price))

    for mid, nm in [("M-1", "Asha"), ("M-2", "Ravi"), ("M-3", "Meera"), ("M-4", "Dev")]:
        library.add_member(Member(mid, nm, 400))

    def show(book: Book) -> None:
        print(f"  {book.title:<26} {book.author:<18} "
              f"{catalog.available_count(book.isbn)} of {len(catalog.items(book.isbn))} available")

    def borrow(isbn: str, member_id: str, day: int) -> None:
        try:
            item = library.issue(isbn, member_id, day)
            print(f"  {member_id} -> {item.barcode} (due day {day + LOAN_DAYS})")
        except (RuntimeError, BorrowRefused) as e:
            print(f"  refused: {e}")

    print('=== search: title word "clean" — search returns BOOKS ===')
    for b in catalog.search_by_title("clean"):
        show(b)

    print("\\n=== day 1: three members borrow the same title ===")
    borrow("978-0-13", "M-1", 1)
    borrow("978-0-13", "M-2", 1)
    borrow("978-0-13", "M-3", 1)
    show(catalog.book("978-0-13"))

    print("\\n=== day 1: Dev wants it too ===")
    borrow("978-0-13", "M-4", 1)
    print(f"  reserve -> position {library.reserve('978-0-13', 'M-4')} in the queue")

    print("\\n=== day 1: Ravi fills his card ===")
    for isbn in ["978-0-20", "978-0-20", "978-0-21", "978-0-21", "978-0-21"]:
        borrow(isbn, "M-2", 1)

    print("\\n=== day 10: Meera tries to renew B-003 ===")
    try:
        library.renew("B-003", 10)
    except RuntimeError as e:
        print(f"  renew refused: {e}")

    print("\\n=== day 25: Asha returns B-001, 10 days late ===")
    charged = library.return_item("B-001", 25)
    b001 = catalog.item("B-001")
    print(f"  fine {money(charged)} ({library.fine_policy.label()})")
    print(f"  B-001 -> {b001.status.value}, held for {b001.held_for}  <- NOT back on the shelf")
    show(catalog.book("978-0-13"))

    print("\\n=== the same 10 days, priced by three policies ===")
    for policy in [FlatPerDayFine(500), SlabFine(), CappedFine(FlatPerDayFine(500), 2000)]:
        print(f"  {policy.label():<36} {money(policy.fine_for(10, 70000))}")
    print("  return_item() was never touched — that is the strategy seam")

    print("\\n=== day 25: Dev collects the copy held for him ===")
    borrow("978-0-13", "M-4", 25)
    print(f"  queue depth for 978-0-13 is now {library.queue_depth('978-0-13')}")

    print("\\n=== members ===")
    for m in library.members:
        print(f"  {m.id:<6} {m.name:<6} loans {m.open_loans}/{Member.MAX_LOANS}  "
              f"fine {money(m.fine_owed_minor):<10} late returns {m.late_returns}")

# ------------------------- expected output -------------------------
# === search: title word "clean" — search returns BOOKS ===
#   Clean Code                 Robert C. Martin   3 of 3 available
#
# === day 1: three members borrow the same title ===
#   M-1 -> B-001 (due day 15)
#   M-2 -> B-002 (due day 15)
#   M-3 -> B-003 (due day 15)
#   Clean Code                 Robert C. Martin   0 of 3 available
#
# === day 1: Dev wants it too ===
#   refused: no copy of 978-0-13 is available
#   reserve -> position 1 in the queue
#
# === day 1: Ravi fills his card ===
#   M-2 -> P-001 (due day 15)
#   M-2 -> P-002 (due day 15)
#   M-2 -> D-001 (due day 15)
#   M-2 -> D-002 (due day 15)
#   refused: Ravi: loan limit reached (5 of 5)
#
# === day 10: Meera tries to renew B-003 ===
#   renew refused: cannot renew: 1 reservation(s) waiting on 978-0-13
#
# === day 25: Asha returns B-001, 10 days late ===
#     notify M-4: copy B-001 of 978-0-13 is waiting for you
#   fine Rs.50.00 (flat Rs.5.00/day)
#   B-001 -> RESERVED, held for M-4  <- NOT back on the shelf
#   Clean Code                 Robert C. Martin   0 of 3 available
#
# === the same 10 days, priced by three policies ===
#   flat Rs.5.00/day                     Rs.50.00
#   slabs 2.00 then 10.00                Rs.44.00
#   flat Rs.5.00/day, capped at Rs.20.00 Rs.20.00
#   return_item() was never touched — that is the strategy seam
#
# === day 25: Dev collects the copy held for him ===
#   M-4 -> B-001 (due day 39)
#   queue depth for 978-0-13 is now 0
#
# === members ===
#   M-1    Asha   loans 0/5  fine Rs.50.00   late returns 1
#   M-2    Ravi   loans 5/5  fine Rs.0.00    late returns 0
#   M-3    Meera  loans 1/5  fine Rs.0.00    late returns 0
#   M-4    Dev    loans 1/5  fine Rs.0.00    late returns 0
# -------------------------------------------------------------------`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "library_management.cpp",
        code: `#include <algorithm>
#include <deque>
#include <functional>
#include <iomanip>
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

// Dates are plain day numbers so the demo is deterministic. Real code uses a
// calendar type — what matters is that the date is PASSED IN, never read from
// a clock inside the method.

constexpr int LOAN_DAYS = 14;

enum class ItemStatus { Available, Reserved, Loaned, Lost, InRepair };

static const char* statusName(ItemStatus s) {
    switch (s) {
        case ItemStatus::Available: return "AVAILABLE";
        case ItemStatus::Reserved:  return "RESERVED";
        case ItemStatus::Loaned:    return "LOANED";
        case ItemStatus::Lost:      return "LOST";
        default:                    return "IN_REPAIR";
    }
}

static std::string money(long long minor) {
    std::ostringstream out;
    out << "Rs." << (minor / 100) << "." << std::setw(2) << std::setfill('0') << (minor % 100);
    return out.str();
}

// The CATALOGUE RECORD. One per title, however many copies the library owns.
struct Book {
    std::string isbn, title, author, subject;
    int publishedYear;
};

// ONE PHYSICAL COPY — the thing a member actually carries home.
class BookItem {
public:
    BookItem(std::string barcode, std::string isbn, std::string rack, int acquiredOn, long long priceMinor)
        : barcode(std::move(barcode)), isbn(std::move(isbn)), rack(std::move(rack)),
          acquiredOn(acquiredOn), priceMinor(priceMinor) {}

    const std::string barcode, isbn, rack;
    const int acquiredOn;
    const long long priceMinor;                       // paise — integers, never double

    ItemStatus status() const { return status_; }
    const std::string& heldFor() const { return heldFor_; }
    bool isAvailable() const { return status_ == ItemStatus::Available; }

    // the small state machine — a boolean cannot express five states
    void loanOut() {
        if (status_ != ItemStatus::Available && status_ != ItemStatus::Reserved)
            throw std::runtime_error(barcode + " is " + statusName(status_));
        status_ = ItemStatus::Loaned; heldFor_.clear();
    }
    void shelve()                            { status_ = ItemStatus::Available; heldFor_.clear(); }
    void holdFor(const std::string& memberId) { status_ = ItemStatus::Reserved; heldFor_ = memberId; }
    void markLost()                          { status_ = ItemStatus::Lost; heldFor_.clear(); }
    void sendForRepair()                     { status_ = ItemStatus::InRepair; heldFor_.clear(); }

private:
    ItemStatus status_ = ItemStatus::Available;
    std::string heldFor_;                             // member id, only while Reserved
};

// The relationship IS an object. The closed ones are the library's memory.
class BookLending {
public:
    BookLending(std::string barcode, std::string memberId, int issuedOn)
        : barcode(std::move(barcode)), memberId(std::move(memberId)),
          issuedOn(issuedOn), dueOn(issuedOn + LOAN_DAYS) {}

    const std::string barcode, memberId;
    const int issuedOn, dueOn;

    bool isOpen() const { return !returnedOn_.has_value(); }
    long long daysLate(int on) const { return std::max(0, on - dueOn); }
    long long fineMinor() const { return fineMinor_; }
    void close(int on, long long fine) { returnedOn_ = on; fineMinor_ = fine; }

private:
    std::optional<int> returnedOn_;
    long long fineMinor_ = 0;
};

// ---------------- the strategy seam: pricing lateness ----------------

struct FinePolicy {
    virtual ~FinePolicy() = default;
    virtual long long fineFor(long long daysLate, long long itemPriceMinor) const = 0;
    virtual std::string label() const = 0;
};

class FlatPerDayFine : public FinePolicy {
public:
    explicit FlatPerDayFine(long long perDayMinor) : perDayMinor_(perDayMinor) {}
    long long fineFor(long long daysLate, long long) const override { return daysLate * perDayMinor_; }
    std::string label() const override { return "flat " + money(perDayMinor_) + "/day"; }
private:
    long long perDayMinor_;
};

class SlabFine : public FinePolicy {
public:
    long long fineFor(long long daysLate, long long) const override {
        long long gentle = std::min<long long>(daysLate, 7);
        return gentle * 200 + std::max<long long>(0, daysLate - 7) * 1000;
    }
    std::string label() const override { return "slabs 2.00 then 10.00"; }
};

class CappedFine : public FinePolicy {
public:
    CappedFine(std::shared_ptr<FinePolicy> inner, long long capMinor)
        : inner_(std::move(inner)), capMinor_(capMinor) {}
    long long fineFor(long long daysLate, long long price) const override {
        return std::min(inner_->fineFor(daysLate, price), std::min(capMinor_, price));
    }
    std::string label() const override { return inner_->label() + ", capped at " + money(capMinor_); }
private:
    std::shared_ptr<FinePolicy> inner_;
    long long capMinor_;
};

// ---------------- accounts: two roles, ONE level deep ----------------

struct BorrowRefused : std::runtime_error {
    explicit BorrowRefused(const std::string& why) : std::runtime_error(why) {}
};

class Account {
public:
    Account(std::string id, std::string name) : id(std::move(id)), name(std::move(name)) {}
    virtual ~Account() = default;
    virtual std::string role() const = 0;
    const std::string id, name;
};

class Member : public Account {
public:
    static constexpr int MAX_LOANS = 5;
    static constexpr long long MAX_FINE_MINOR = 10000;      // Rs.100.00

    Member(std::string id, std::string name, int membershipExpiresOn)
        : Account(std::move(id), std::move(name)), membershipExpiresOn_(membershipExpiresOn) {}

    std::string role() const override { return "MEMBER"; }

    int openLoans() const {
        int n = 0; for (auto* l : lendings_) if (l->isOpen()) ++n; return n;
    }
    int lateReturns() const {
        int n = 0; for (auto* l : lendings_) if (!l->isOpen() && l->fineMinor() > 0) ++n; return n;
    }
    long long fineOwedMinor() const { return fineOwedMinor_; }

    // THE RULE LIVES HERE. The service asks; it does not reach in and decide.
    void assertCanBorrow(int today) const {
        if (today > membershipExpiresOn_)
            throw BorrowRefused(name + ": membership expired on day " + std::to_string(membershipExpiresOn_));
        if (openLoans() >= MAX_LOANS)
            throw BorrowRefused(name + ": loan limit reached (" + std::to_string(MAX_LOANS) +
                                " of " + std::to_string(MAX_LOANS) + ")");
        if (fineOwedMinor_ > MAX_FINE_MINOR)
            throw BorrowRefused(name + ": outstanding fine " + money(fineOwedMinor_));
    }
    bool canBorrow(int today) const {
        try { assertCanBorrow(today); return true; } catch (const BorrowRefused&) { return false; }
    }
    void addLending(BookLending* l) { lendings_.push_back(l); }
    void addFine(long long minor)   { fineOwedMinor_ += minor; }
    void payFine(long long minor)   { fineOwedMinor_ = std::max(0LL, fineOwedMinor_ - minor); }

private:
    int membershipExpiresOn_;
    std::vector<BookLending*> lendings_;
    long long fineOwedMinor_ = 0;
};

// ---------------- search: index maps, not a linear scan ----------------

class Catalog {
public:
    void addBook(const Book& b) {
        byIsbn_[b.isbn] = b;
        std::istringstream words(b.title);
        for (std::string w; words >> w; ) byTitleWord_[lower(w)].push_back(b.isbn);
        byAuthor_[lower(b.author)].push_back(b.isbn);
        bySubject_[lower(b.subject)].push_back(b.isbn);
        order_.push_back(b.isbn);
    }
    void addItem(std::unique_ptr<BookItem> item) {
        BookItem* raw = item.get();
        itemsByIsbn_[raw->isbn].push_back(raw);
        byBarcode_[raw->barcode] = std::move(item);
    }

    const Book& book(const std::string& isbn) const { return byIsbn_.at(isbn); }
    const std::vector<std::string>& order() const { return order_; }
    BookItem& item(const std::string& barcode) const {
        auto it = byBarcode_.find(barcode);
        if (it == byBarcode_.end()) throw std::runtime_error("unknown barcode " + barcode);
        return *it->second;
    }
    const std::vector<BookItem*>& items(const std::string& isbn) const {
        static const std::vector<BookItem*> none;
        auto it = itemsByIsbn_.find(isbn);
        return it == itemsByIsbn_.end() ? none : it->second;
    }

    // SEARCH RETURNS BOOKS — titles. Availability is a COUNT over their items.
    std::vector<Book> searchByTitle(const std::string& word) const   { return lookup(byTitleWord_, word); }
    std::vector<Book> searchByAuthor(const std::string& author) const { return lookup(byAuthor_, author); }
    std::vector<Book> searchBySubject(const std::string& s) const     { return lookup(bySubject_, s); }
    std::vector<Book> searchByYear(int year) const {
        std::vector<Book> out;
        for (auto& isbn : order_) if (byIsbn_.at(isbn).publishedYear == year) out.push_back(byIsbn_.at(isbn));
        return out;
    }
    int availableCount(const std::string& isbn) const {
        int n = 0; for (auto* i : items(isbn)) if (i->isAvailable()) ++n; return n;
    }

    // ISSUE RETURNS AN ITEM — a specific copy with a barcode on it.
    BookItem* firstAvailable(const std::string& isbn) const {
        for (auto* i : items(isbn)) if (i->isAvailable()) return i;
        return nullptr;
    }
    BookItem* heldFor(const std::string& isbn, const std::string& memberId) const {
        for (auto* i : items(isbn))
            if (i->status() == ItemStatus::Reserved && i->heldFor() == memberId) return i;
        return nullptr;
    }

private:
    static std::string lower(std::string s) {
        std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c) { return std::tolower(c); });
        return s;
    }
    std::vector<Book> lookup(const std::map<std::string, std::vector<std::string>>& index,
                             const std::string& key) const {
        std::vector<Book> out;
        auto it = index.find(lower(key));
        if (it != index.end()) for (auto& isbn : it->second) out.push_back(byIsbn_.at(isbn));
        return out;
    }
    std::map<std::string, Book> byIsbn_;
    std::vector<std::string> order_;
    std::map<std::string, std::vector<std::string>> byTitleWord_, byAuthor_, bySubject_;
    std::map<std::string, std::vector<BookItem*>> itemsByIsbn_;
    std::map<std::string, std::unique_ptr<BookItem>> byBarcode_;
};

// ---------------- the facade that orchestrates, and decides nothing ----------------

class Library {
public:
    explicit Library(std::shared_ptr<FinePolicy> policy) : finePolicy_(std::move(policy)) {}

    Catalog& catalog() { return catalog_; }
    const FinePolicy& finePolicy() const { return *finePolicy_; }
    void setFinePolicy(std::shared_ptr<FinePolicy> p) { finePolicy_ = std::move(p); }  // returnItem() unchanged
    void addMember(std::unique_ptr<Member> m) { order_.push_back(m->id); members_[m->id] = std::move(m); }
    void onNotify(std::function<void(const std::string&, const std::string&)> l) { listeners_.push_back(std::move(l)); }

    Member& member(const std::string& id) const { return *members_.at(id); }
    const std::vector<std::string>& memberOrder() const { return order_; }

    BookItem& issue(const std::string& isbn, const std::string& memberId, int today) {
        Member& m = member(memberId);
        BookItem* item = catalog_.heldFor(isbn, memberId);
        if (!item) item = catalog_.firstAvailable(isbn);
        if (!item) throw std::runtime_error("no copy of " + isbn + " is available");
        m.assertCanBorrow(today);                                     // ASK — do not decide for it
        if (item->status() == ItemStatus::Reserved) dequeue(isbn, memberId);
        item->loanOut();
        lendings_.push_back(std::make_unique<BookLending>(item->barcode, memberId, today));
        m.addLending(lendings_.back().get());
        return *item;
    }

    long long returnItem(const std::string& barcode, int on) {      // returns the fine, in minor units
        BookItem& item = catalog_.item(barcode);
        BookLending& lending = openLendingFor(barcode);
        long long fine = finePolicy_->fineFor(lending.daysLate(on), item.priceMinor);
        lending.close(on, fine);
        member(lending.memberId).addFine(fine);

        auto q = reservations_.find(item.isbn);                       // THE BRANCH
        if (q != reservations_.end() && !q->second.empty()) {
            std::string next = q->second.front();
            item.holdFor(next);                                       // NOT back on the shelf
            notifyMember(next, "copy " + barcode + " of " + item.isbn + " is waiting for you");
        } else {
            item.shelve();
        }
        return fine;
    }

    int reserve(const std::string& isbn, const std::string& memberId) {
        if (catalog_.availableCount(isbn) > 0)
            throw std::runtime_error("a copy is on the shelf — borrow it instead of reserving");
        auto& q = reservations_[isbn];
        if (std::find(q.begin(), q.end(), memberId) == q.end()) q.push_back(memberId);
        return static_cast<int>(std::distance(q.begin(), std::find(q.begin(), q.end(), memberId))) + 1;
    }

    void renew(const std::string& barcode, int on) {                  // only when nobody is waiting
        BookItem& item = catalog_.item(barcode);
        auto q = reservations_.find(item.isbn);
        if (q != reservations_.end() && !q->second.empty())
            throw std::runtime_error("cannot renew: " + std::to_string(q->second.size()) +
                                     " reservation(s) waiting on " + item.isbn);
        BookLending& current = openLendingFor(barcode);
        long long fine = finePolicy_->fineFor(current.daysLate(on), item.priceMinor);
        current.close(on, fine);
        Member& m = member(current.memberId);
        m.addFine(fine);
        lendings_.push_back(std::make_unique<BookLending>(barcode, current.memberId, on));
        m.addLending(lendings_.back().get());
    }

    int queueDepth(const std::string& isbn) const {
        auto it = reservations_.find(isbn);
        return it == reservations_.end() ? 0 : static_cast<int>(it->second.size());
    }

private:
    void dequeue(const std::string& isbn, const std::string& memberId) {
        auto it = reservations_.find(isbn);
        if (it == reservations_.end()) return;
        auto& q = it->second;
        q.erase(std::remove(q.begin(), q.end(), memberId), q.end());
        if (q.empty()) reservations_.erase(it);
    }
    BookLending& openLendingFor(const std::string& barcode) {
        for (auto& l : lendings_) if (l->isOpen() && l->barcode == barcode) return *l;
        throw std::runtime_error(barcode + " is not on loan");
    }
    void notifyMember(const std::string& memberId, const std::string& message) {
        for (auto& l : listeners_) l(memberId, message);
    }

    Catalog catalog_;
    std::shared_ptr<FinePolicy> finePolicy_;
    std::map<std::string, std::unique_ptr<Member>> members_;
    std::vector<std::string> order_;
    std::map<std::string, std::deque<std::string>> reservations_;
    std::vector<std::unique_ptr<BookLending>> lendings_;
    std::vector<std::function<void(const std::string&, const std::string&)>> listeners_;
};

int main() {
    Library library(std::make_shared<FlatPerDayFine>(500));          // Rs.5.00 a day
    library.onNotify([](const std::string& id, const std::string& msg) {
        std::cout << "    notify " << id << ": " << msg << "\\n";
    });

    Catalog& catalog = library.catalog();
    catalog.addBook({"978-0-13", "Clean Code", "Robert C. Martin", "software", 2008});
    catalog.addBook({"978-0-20", "The Pragmatic Programmer", "Andrew Hunt", "software", 1999});
    catalog.addBook({"978-0-21", "Design Patterns", "Erich Gamma", "software", 1994});

    struct Copy { const char* barcode; const char* isbn; const char* rack; long long price; };
    for (auto& c : std::vector<Copy>{
             {"B-001", "978-0-13", "R-12", 70000}, {"B-002", "978-0-13", "R-12", 70000},
             {"B-003", "978-0-13", "R-12", 70000}, {"P-001", "978-0-20", "R-07", 60000},
             {"P-002", "978-0-20", "R-07", 60000}, {"D-001", "978-0-21", "R-03", 90000},
             {"D-002", "978-0-21", "R-03", 90000}, {"D-003", "978-0-21", "R-03", 90000}})
        catalog.addItem(std::make_unique<BookItem>(c.barcode, c.isbn, c.rack, 0, c.price));

    for (auto& p : std::vector<std::pair<const char*, const char*>>{
             {"M-1", "Asha"}, {"M-2", "Ravi"}, {"M-3", "Meera"}, {"M-4", "Dev"}})
        library.addMember(std::make_unique<Member>(p.first, p.second, 400));

    auto show = [&](const std::string& isbn) {
        const Book& b = catalog.book(isbn);
        std::cout << "  " << std::left << std::setw(26) << b.title << " " << std::setw(18) << b.author
                  << " " << catalog.availableCount(isbn) << " of " << catalog.items(isbn).size()
                  << " available\\n" << std::right;
    };
    auto borrow = [&](const std::string& isbn, const std::string& memberId, int day) {
        try {
            BookItem& item = library.issue(isbn, memberId, day);
            std::cout << "  " << memberId << " -> " << item.barcode
                      << " (due day " << day + LOAN_DAYS << ")\\n";
        } catch (const std::exception& e) {
            std::cout << "  refused: " << e.what() << "\\n";
        }
    };

    std::cout << "=== search: title word \\"clean\\" — search returns BOOKS ===\\n";
    for (auto& b : catalog.searchByTitle("clean")) show(b.isbn);

    std::cout << "\\n=== day 1: three members borrow the same title ===\\n";
    borrow("978-0-13", "M-1", 1);
    borrow("978-0-13", "M-2", 1);
    borrow("978-0-13", "M-3", 1);
    show("978-0-13");

    std::cout << "\\n=== day 1: Dev wants it too ===\\n";
    borrow("978-0-13", "M-4", 1);
    std::cout << "  reserve -> position " << library.reserve("978-0-13", "M-4") << " in the queue\\n";

    std::cout << "\\n=== day 1: Ravi fills his card ===\\n";
    for (auto& isbn : std::vector<std::string>{"978-0-20", "978-0-20", "978-0-21", "978-0-21", "978-0-21"})
        borrow(isbn, "M-2", 1);

    std::cout << "\\n=== day 10: Meera tries to renew B-003 ===\\n";
    try { library.renew("B-003", 10); }
    catch (const std::exception& e) { std::cout << "  renew refused: " << e.what() << "\\n"; }

    std::cout << "\\n=== day 25: Asha returns B-001, 10 days late ===\\n";
    long long charged = library.returnItem("B-001", 25);
    BookItem& b001 = catalog.item("B-001");
    std::cout << "  fine " << money(charged) << " (" << library.finePolicy().label() << ")\\n";
    std::cout << "  B-001 -> " << statusName(b001.status()) << ", held for " << b001.heldFor()
              << "  <- NOT back on the shelf\\n";
    show("978-0-13");

    std::cout << "\\n=== the same 10 days, priced by three policies ===\\n";
    std::vector<std::shared_ptr<FinePolicy>> policies{
        std::make_shared<FlatPerDayFine>(500), std::make_shared<SlabFine>(),
        std::make_shared<CappedFine>(std::make_shared<FlatPerDayFine>(500), 2000)};
    for (auto& p : policies)
        std::cout << "  " << std::left << std::setw(36) << p->label() << money(p->fineFor(10, 70000))
                  << "\\n" << std::right;
    std::cout << "  returnItem() was never touched — that is the strategy seam\\n";

    std::cout << "\\n=== day 25: Dev collects the copy held for him ===\\n";
    borrow("978-0-13", "M-4", 25);
    std::cout << "  queue depth for 978-0-13 is now " << library.queueDepth("978-0-13") << "\\n";

    std::cout << "\\n=== members ===\\n";
    for (auto& id : library.memberOrder()) {
        Member& m = library.member(id);
        std::cout << "  " << std::left << std::setw(6) << m.id << " " << std::setw(6) << m.name
                  << " loans " << m.openLoans() << "/" << Member::MAX_LOANS
                  << "  fine " << std::setw(10) << money(m.fineOwedMinor())
                  << " late returns " << m.lateReturns() << "\\n" << std::right;
    }
}

/* ------------------------- expected output -------------------------
=== search: title word "clean" — search returns BOOKS ===
  Clean Code                 Robert C. Martin   3 of 3 available

=== day 1: three members borrow the same title ===
  M-1 -> B-001 (due day 15)
  M-2 -> B-002 (due day 15)
  M-3 -> B-003 (due day 15)
  Clean Code                 Robert C. Martin   0 of 3 available

=== day 1: Dev wants it too ===
  refused: no copy of 978-0-13 is available
  reserve -> position 1 in the queue

=== day 1: Ravi fills his card ===
  M-2 -> P-001 (due day 15)
  M-2 -> P-002 (due day 15)
  M-2 -> D-001 (due day 15)
  M-2 -> D-002 (due day 15)
  refused: Ravi: loan limit reached (5 of 5)

=== day 10: Meera tries to renew B-003 ===
  renew refused: cannot renew: 1 reservation(s) waiting on 978-0-13

=== day 25: Asha returns B-001, 10 days late ===
    notify M-4: copy B-001 of 978-0-13 is waiting for you
  fine Rs.50.00 (flat Rs.5.00/day)
  B-001 -> RESERVED, held for M-4  <- NOT back on the shelf
  Clean Code                 Robert C. Martin   0 of 3 available

=== the same 10 days, priced by three policies ===
  flat Rs.5.00/day                    Rs.50.00
  slabs 2.00 then 10.00               Rs.44.00
  flat Rs.5.00/day, capped at Rs.20.00Rs.20.00
  returnItem() was never touched — that is the strategy seam

=== day 25: Dev collects the copy held for him ===
  M-4 -> B-001 (due day 39)
  queue depth for 978-0-13 is now 0

=== members ===
  M-1    Asha   loans 0/5  fine Rs.50.00   late returns 1
  M-2    Ravi   loans 5/5  fine Rs.0.00    late returns 0
  M-3    Meera  loans 1/5  fine Rs.0.00    late returns 0
  M-4    Dev    loans 1/5  fine Rs.0.00    late returns 0
------------------------------------------------------------------- */`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "libraryManagement.ts",
        code: `/*
 * Dates are plain day numbers so the demo is deterministic. Real code uses a
 * date type — what matters in the round is that the date is PASSED IN, never
 * read from a clock inside the method.
 */

const LOAN_DAYS = 14;

enum ItemStatus { AVAILABLE = "AVAILABLE", RESERVED = "RESERVED", LOANED = "LOANED", LOST = "LOST", IN_REPAIR = "IN_REPAIR" }

const money = (minor: number): string =>
  "Rs." + Math.floor(minor / 100) + "." + String(minor % 100).padStart(2, "0");

/** The CATALOGUE RECORD. One per title, however many copies the library owns. */
interface Book {
  readonly isbn: string;
  readonly title: string;
  readonly author: string;
  readonly subject: string;
  readonly publishedYear: number;
}

/** ONE PHYSICAL COPY — the thing a member actually carries home. */
class BookItem {
  private itemStatus: ItemStatus = ItemStatus.AVAILABLE;
  private held: string | null = null;                // member id, only while RESERVED

  constructor(
    readonly barcode: string,
    readonly isbn: string,
    readonly rack: string,
    readonly acquiredOn: number,
    readonly priceMinor: number,                     // paise — integers, never floats
  ) {}

  get status(): ItemStatus { return this.itemStatus; }
  get heldFor(): string | null { return this.held; }
  get isAvailable(): boolean { return this.itemStatus === ItemStatus.AVAILABLE; }

  // the small state machine — a boolean cannot express five states
  loanOut(): void {
    if (this.itemStatus !== ItemStatus.AVAILABLE && this.itemStatus !== ItemStatus.RESERVED)
      throw new Error(this.barcode + " is " + this.itemStatus);
    this.itemStatus = ItemStatus.LOANED; this.held = null;
  }
  shelve(): void            { this.itemStatus = ItemStatus.AVAILABLE; this.held = null; }
  holdFor(id: string): void { this.itemStatus = ItemStatus.RESERVED;  this.held = id; }
  markLost(): void          { this.itemStatus = ItemStatus.LOST;      this.held = null; }
  sendForRepair(): void     { this.itemStatus = ItemStatus.IN_REPAIR; this.held = null; }
}

/** The relationship IS an object. The closed ones are the library's memory. */
class BookLending {
  readonly dueOn: number;
  private returnedOn: number | null = null;
  private fine = 0;

  constructor(readonly barcode: string, readonly memberId: string, readonly issuedOn: number) {
    this.dueOn = issuedOn + LOAN_DAYS;
  }
  get isOpen(): boolean { return this.returnedOn === null; }
  get fineMinor(): number { return this.fine; }
  daysLate(on: number): number { return Math.max(0, on - this.dueOn); }
  close(on: number, fineMinor: number): void { this.returnedOn = on; this.fine = fineMinor; }
}

/* ---------------- the strategy seam: pricing lateness ---------------- */

interface FinePolicy {
  fineFor(daysLate: number, itemPriceMinor: number): number;   // daysLate is clamped at 0
  label(): string;
}

class FlatPerDayFine implements FinePolicy {
  constructor(private readonly perDayMinor: number) {}
  fineFor(daysLate: number): number { return daysLate * this.perDayMinor; }
  label(): string { return "flat " + money(this.perDayMinor) + "/day"; }
}

class SlabFine implements FinePolicy {
  fineFor(daysLate: number): number {
    return Math.min(daysLate, 7) * 200 + Math.max(0, daysLate - 7) * 1000;
  }
  label(): string { return "slabs 2.00 then 10.00"; }
}

class CappedFine implements FinePolicy {
  constructor(private readonly inner: FinePolicy, private readonly capMinor: number) {}
  fineFor(daysLate: number, price: number): number {
    return Math.min(this.inner.fineFor(daysLate, price), this.capMinor, price);
  }
  label(): string { return this.inner.label() + ", capped at " + money(this.capMinor); }
}

/* ---------------- accounts: two roles, ONE level deep ---------------- */

class BorrowRefused extends Error {}

abstract class Account {
  constructor(readonly id: string, readonly name: string) {}
  abstract get role(): string;
}

class Member extends Account {
  static readonly MAX_LOANS = 5;
  static readonly MAX_FINE_MINOR = 10_000;            // Rs.100.00
  private readonly lendings: BookLending[] = [];
  private fineOwed = 0;

  constructor(id: string, name: string, private readonly membershipExpiresOn: number) {
    super(id, name);
  }
  get role(): string { return "MEMBER"; }
  get openLoans(): number { return this.lendings.filter((l) => l.isOpen).length; }
  get lateReturns(): number { return this.lendings.filter((l) => !l.isOpen && l.fineMinor > 0).length; }
  get fineOwedMinor(): number { return this.fineOwed; }

  /** THE RULE LIVES HERE. The service asks; it does not reach in and decide. */
  assertCanBorrow(today: number): void {
    if (today > this.membershipExpiresOn)
      throw new BorrowRefused(this.name + ": membership expired on day " + this.membershipExpiresOn);
    if (this.openLoans >= Member.MAX_LOANS)
      throw new BorrowRefused(this.name + ": loan limit reached (" + Member.MAX_LOANS + " of " + Member.MAX_LOANS + ")");
    if (this.fineOwed > Member.MAX_FINE_MINOR)
      throw new BorrowRefused(this.name + ": outstanding fine " + money(this.fineOwed));
  }
  canBorrow(today: number): boolean {
    try { this.assertCanBorrow(today); return true; } catch { return false; }
  }
  addLending(l: BookLending): void { this.lendings.push(l); }
  addFine(minor: number): void { this.fineOwed += minor; }
  payFine(minor: number): void { this.fineOwed = Math.max(0, this.fineOwed - minor); }
}

class Librarian extends Account {
  get role(): string { return "LIBRARIAN"; }
  addItem(library: Library, item: BookItem): void { library.catalog.addItem(item); }
  issueFor(library: Library, isbn: string, memberId: string, today: number): BookItem {
    return library.issue(isbn, memberId, today);
  }
}

/* ---------------- search: index maps, not a linear scan ---------------- */

class Catalog {
  private readonly byIsbn = new Map<string, Book>();
  private readonly byTitleWord = new Map<string, Book[]>();
  private readonly byAuthor = new Map<string, Book[]>();
  private readonly bySubject = new Map<string, Book[]>();
  private readonly itemsByIsbn = new Map<string, BookItem[]>();
  private readonly byBarcode = new Map<string, BookItem>();

  addBook(book: Book): void {
    this.byIsbn.set(book.isbn, book);
    for (const word of book.title.toLowerCase().split(" ")) push(this.byTitleWord, word, book);
    push(this.byAuthor, book.author.toLowerCase(), book);
    push(this.bySubject, book.subject.toLowerCase(), book);
    if (!this.itemsByIsbn.has(book.isbn)) this.itemsByIsbn.set(book.isbn, []);
  }
  addItem(item: BookItem): void {
    const list = this.itemsByIsbn.get(item.isbn) ?? [];
    list.push(item);
    this.itemsByIsbn.set(item.isbn, list);
    this.byBarcode.set(item.barcode, item);
  }

  book(isbn: string): Book {
    const b = this.byIsbn.get(isbn);
    if (!b) throw new Error("unknown isbn " + isbn);
    return b;
  }
  item(barcode: string): BookItem {
    const i = this.byBarcode.get(barcode);
    if (!i) throw new Error("unknown barcode " + barcode);
    return i;
  }
  items(isbn: string): BookItem[] { return this.itemsByIsbn.get(isbn) ?? []; }

  // SEARCH RETURNS BOOKS — titles. Availability is a COUNT over their items.
  searchByTitle(word: string): Book[] { return this.byTitleWord.get(word.toLowerCase()) ?? []; }
  searchByAuthor(a: string): Book[] { return this.byAuthor.get(a.toLowerCase()) ?? []; }
  searchBySubject(s: string): Book[] { return this.bySubject.get(s.toLowerCase()) ?? []; }
  searchByYear(year: number): Book[] {
    return [...this.byIsbn.values()].filter((b) => b.publishedYear === year);
  }
  availableCount(isbn: string): number { return this.items(isbn).filter((i) => i.isAvailable).length; }

  // ISSUE RETURNS AN ITEM — a specific copy with a barcode on it.
  firstAvailable(isbn: string): BookItem | undefined {
    return this.items(isbn).find((i) => i.isAvailable);
  }
  heldFor(isbn: string, memberId: string): BookItem | undefined {
    return this.items(isbn).find((i) => i.status === ItemStatus.RESERVED && i.heldFor === memberId);
  }
}

function push<T>(index: Map<string, T[]>, key: string, value: T): void {
  const list = index.get(key) ?? [];
  list.push(value);
  index.set(key, list);
}

/* ---------------- the facade that orchestrates, and decides nothing ---------------- */

type Notifier = (memberId: string, message: string) => void;

class Library {
  readonly catalog = new Catalog();
  private readonly members = new Map<string, Member>();
  private readonly reservations = new Map<string, string[]>();
  private readonly lendings: BookLending[] = [];
  private readonly listeners: Notifier[] = [];

  constructor(public finePolicy: FinePolicy) {}                 // swapping it leaves returnItem() alone

  addMember(m: Member): void { this.members.set(m.id, m); }
  onNotify(l: Notifier): void { this.listeners.push(l); }       // observer, one line
  member(id: string): Member {
    const m = this.members.get(id);
    if (!m) throw new Error("unknown member " + id);
    return m;
  }
  get allMembers(): Member[] { return [...this.members.values()]; }

  issue(isbn: string, memberId: string, today: number): BookItem {
    const member = this.member(memberId);
    const item = this.catalog.heldFor(isbn, memberId) ?? this.catalog.firstAvailable(isbn);
    if (!item) throw new Error("no copy of " + isbn + " is available");
    member.assertCanBorrow(today);                              // ASK — do not decide for it
    if (item.status === ItemStatus.RESERVED) this.dequeue(isbn, memberId);
    item.loanOut();
    const lending = new BookLending(item.barcode, memberId, today);
    this.lendings.push(lending);
    member.addLending(lending);
    return item;
  }

  /** Returns the fine charged, in minor units. */
  returnItem(barcode: string, on: number): number {
    const item = this.catalog.item(barcode);
    const lending = this.openLendingFor(barcode);
    const fine = this.finePolicy.fineFor(lending.daysLate(on), item.priceMinor);
    lending.close(on, fine);
    this.member(lending.memberId).addFine(fine);

    const queue = this.reservations.get(item.isbn);             // THE BRANCH
    if (queue && queue.length > 0) {
      const next = queue[0];
      item.holdFor(next);                                       // NOT back on the shelf
      this.notifyMember(next, "copy " + barcode + " of " + item.isbn + " is waiting for you");
    } else {
      item.shelve();
    }
    return fine;
  }

  reserve(isbn: string, memberId: string): number {
    if (this.catalog.availableCount(isbn) > 0)
      throw new Error("a copy is on the shelf — borrow it instead of reserving");
    const queue = this.reservations.get(isbn) ?? [];
    if (!queue.includes(memberId)) queue.push(memberId);
    this.reservations.set(isbn, queue);
    return queue.indexOf(memberId) + 1;
  }

  /** Allowed only when nobody is waiting for the title. */
  renew(barcode: string, on: number): BookLending {
    const item = this.catalog.item(barcode);
    const queue = this.reservations.get(item.isbn);
    if (queue && queue.length > 0)
      throw new Error("cannot renew: " + queue.length + " reservation(s) waiting on " + item.isbn);
    const current = this.openLendingFor(barcode);
    const fine = this.finePolicy.fineFor(current.daysLate(on), item.priceMinor);
    current.close(on, fine);
    const member = this.member(current.memberId);
    member.addFine(fine);
    const fresh = new BookLending(barcode, current.memberId, on);
    this.lendings.push(fresh);
    member.addLending(fresh);
    return fresh;
  }

  queueDepth(isbn: string): number { return (this.reservations.get(isbn) ?? []).length; }

  private dequeue(isbn: string, memberId: string): void {
    const queue = this.reservations.get(isbn);
    if (!queue) return;
    const at = queue.indexOf(memberId);
    if (at >= 0) queue.splice(at, 1);
    if (queue.length === 0) this.reservations.delete(isbn);
  }
  private openLendingFor(barcode: string): BookLending {
    const l = this.lendings.find((x) => x.isOpen && x.barcode === barcode);
    if (!l) throw new Error(barcode + " is not on loan");
    return l;
  }
  private notifyMember(memberId: string, message: string): void {
    for (const l of this.listeners) l(memberId, message);
  }
}

/* ---------------- demo ---------------- */

const library = new Library(new FlatPerDayFine(500));            // Rs.5.00 a day
library.onNotify((id, msg) => console.log("    notify " + id + ": " + msg));

const catalog = library.catalog;
catalog.addBook({ isbn: "978-0-13", title: "Clean Code", author: "Robert C. Martin", subject: "software", publishedYear: 2008 });
catalog.addBook({ isbn: "978-0-20", title: "The Pragmatic Programmer", author: "Andrew Hunt", subject: "software", publishedYear: 1999 });
catalog.addBook({ isbn: "978-0-21", title: "Design Patterns", author: "Erich Gamma", subject: "software", publishedYear: 1994 });

const raj = new Librarian("L-1", "Raj");
const copies: Array<[string, string, string, number]> = [
  ["B-001", "978-0-13", "R-12", 70000], ["B-002", "978-0-13", "R-12", 70000],
  ["B-003", "978-0-13", "R-12", 70000], ["P-001", "978-0-20", "R-07", 60000],
  ["P-002", "978-0-20", "R-07", 60000], ["D-001", "978-0-21", "R-03", 90000],
  ["D-002", "978-0-21", "R-03", 90000], ["D-003", "978-0-21", "R-03", 90000],
];
for (const [barcode, isbn, rack, price] of copies)
  raj.addItem(library, new BookItem(barcode, isbn, rack, 0, price));

for (const [id, name] of [["M-1", "Asha"], ["M-2", "Ravi"], ["M-3", "Meera"], ["M-4", "Dev"]])
  library.addMember(new Member(id, name, 400));

const show = (isbn: string): void => {
  const b = catalog.book(isbn);
  console.log("  " + b.title.padEnd(26) + " " + b.author.padEnd(18) + " " +
    catalog.availableCount(isbn) + " of " + catalog.items(isbn).length + " available");
};
const borrow = (isbn: string, memberId: string, day: number): void => {
  try {
    const item = library.issue(isbn, memberId, day);
    console.log("  " + memberId + " -> " + item.barcode + " (due day " + (day + LOAN_DAYS) + ")");
  } catch (e) {
    console.log("  refused: " + (e as Error).message);
  }
};

console.log('=== search: title word "clean" — search returns BOOKS ===');
for (const b of catalog.searchByTitle("clean")) show(b.isbn);

console.log("\\n=== day 1: three members borrow the same title ===");
borrow("978-0-13", "M-1", 1);
borrow("978-0-13", "M-2", 1);
borrow("978-0-13", "M-3", 1);
show("978-0-13");

console.log("\\n=== day 1: Dev wants it too ===");
borrow("978-0-13", "M-4", 1);
console.log("  reserve -> position " + library.reserve("978-0-13", "M-4") + " in the queue");

console.log("\\n=== day 1: Ravi fills his card ===");
for (const isbn of ["978-0-20", "978-0-20", "978-0-21", "978-0-21", "978-0-21"]) borrow(isbn, "M-2", 1);

console.log("\\n=== day 10: Meera tries to renew B-003 ===");
try { library.renew("B-003", 10); }
catch (e) { console.log("  renew refused: " + (e as Error).message); }

console.log("\\n=== day 25: Asha returns B-001, 10 days late ===");
const charged = library.returnItem("B-001", 25);
const b001 = catalog.item("B-001");
console.log("  fine " + money(charged) + " (" + library.finePolicy.label() + ")");
console.log("  B-001 -> " + b001.status + ", held for " + b001.heldFor + "  <- NOT back on the shelf");
show("978-0-13");

console.log("\\n=== the same 10 days, priced by three policies ===");
for (const policy of [new FlatPerDayFine(500), new SlabFine(), new CappedFine(new FlatPerDayFine(500), 2000)])
  console.log("  " + policy.label().padEnd(36) + money(policy.fineFor(10, 70000)));
console.log("  returnItem() was never touched — that is the strategy seam");

console.log("\\n=== day 25: Dev collects the copy held for him ===");
borrow("978-0-13", "M-4", 25);
console.log("  queue depth for 978-0-13 is now " + library.queueDepth("978-0-13"));

console.log("\\n=== members ===");
for (const m of library.allMembers)
  console.log("  " + m.id.padEnd(6) + " " + m.name.padEnd(6) + " loans " + m.openLoans + "/" + Member.MAX_LOANS +
    "  fine " + money(m.fineOwedMinor).padEnd(10) + " late returns " + m.lateReturns);

/* ------------------------- expected output -------------------------
=== search: title word "clean" — search returns BOOKS ===
  Clean Code                 Robert C. Martin   3 of 3 available

=== day 1: three members borrow the same title ===
  M-1 -> B-001 (due day 15)
  M-2 -> B-002 (due day 15)
  M-3 -> B-003 (due day 15)
  Clean Code                 Robert C. Martin   0 of 3 available

=== day 1: Dev wants it too ===
  refused: no copy of 978-0-13 is available
  reserve -> position 1 in the queue

=== day 1: Ravi fills his card ===
  M-2 -> P-001 (due day 15)
  M-2 -> P-002 (due day 15)
  M-2 -> D-001 (due day 15)
  M-2 -> D-002 (due day 15)
  refused: Ravi: loan limit reached (5 of 5)

=== day 10: Meera tries to renew B-003 ===
  renew refused: cannot renew: 1 reservation(s) waiting on 978-0-13

=== day 25: Asha returns B-001, 10 days late ===
    notify M-4: copy B-001 of 978-0-13 is waiting for you
  fine Rs.50.00 (flat Rs.5.00/day)
  B-001 -> RESERVED, held for M-4  <- NOT back on the shelf
  Clean Code                 Robert C. Martin   0 of 3 available

=== the same 10 days, priced by three policies ===
  flat Rs.5.00/day                     Rs.50.00
  slabs 2.00 then 10.00                Rs.44.00
  flat Rs.5.00/day, capped at Rs.20.00 Rs.20.00
  returnItem() was never touched — that is the strategy seam

=== day 25: Dev collects the copy held for him ===
  M-4 -> B-001 (due day 39)
  queue depth for 978-0-13 is now 0

=== members ===
  M-1    Asha   loans 0/5  fine Rs.50.00   late returns 1
  M-2    Ravi   loans 5/5  fine Rs.0.00    late returns 0
  M-3    Meera  loans 1/5  fine Rs.0.00    late returns 0
  M-4    Dev    loans 1/5  fine Rs.0.00    late returns 0
------------------------------------------------------------------- */`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Strip the books away and this is **a catalogue of descriptions, a pool of instances of those descriptions, and an object recording who has which one and when**. That triple shows up everywhere, and getting the first split right is what makes the other two possible.",
      },
      {
        type: "ul",
        items: [
          "**E-commerce** — `Product` describes it, a `SKU` narrows it, and the unit in the warehouse bin is the instance. *“3 in stock”* is a count over instances, exactly like *“2 of 3 available”*.",
          "**Ticketing** — a `Show` is the description, a `Seat` for a given show is the instance, and a `Booking` is the association with dates and money on it.",
          "**Airlines** — `FlightRoute` (AI-302, daily, BLR to DEL) versus a dated `Flight` you actually board. Merge them and you cannot cancel Tuesday's.",
          "**Car rental** — a `CarModel` in the brochure versus the registered vehicle with a number plate and a service history.",
          "**Hotels** — a `RoomType` versus room 412, and a `Stay` between a guest and a room across two dates.",
          "**Asset tracking of any kind** — the laptop model your company buys versus the laptop with asset tag L-0912 sitting on someone's desk.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The two-sentence version to say out loud",
        text: "*“A `Book` is a catalogue record and a `BookItem` is a physical copy, so availability is a count over items and a loan always points at a specific barcode. And a loan is its own object rather than a field, because the finished ones are what fines and member standing are computed from.”* Twenty seconds, and it is most of the round.",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When the thing has no physical instance.** E-books, streaming, software licences — there is no copy to give a barcode to. The model becomes a licence with a concurrent-use count, and forcing `BookItem` onto it is worse than admitting the boundary.",
          "**When one process is no longer the whole library.** Two desks in two buildings claiming the last copy need the *store* to do the atomic take, not an in-process check-then-set. The modelling is unchanged; the claim step is not.",
          "**When search stops being lookup.** Index maps answer *“author equals Martin”*. They do not answer *“books a bit like this one, ranked”*. That is a different system behind the same `Catalog` interface.",
          "**When the rules stop being a member's business.** A national inter-library policy is not an invariant of one `Member` object, and pushing it there would be [[tell-dont-ask]] applied past the point where it helps.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**The catalogue entry is a description; the copy is an instance.** Split them in minute 8, and every later question — *how many are available, which one did she take, where is it shelved, who had it last year* — has an obvious place to live. Merge them, and none of those questions has an answer at all.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Splitting Book from BookItem makes availability a count rather than a boolean, so “2 of 3 available”, per-copy racks, conditions and barcodes all have somewhere natural to live.",
        "Modelling the loan as a BookLending with a nullable returnedOn keeps the full history, so fines, late counts and member standing are queries over data you already have.",
        "Putting canBorrow() on Member means the limit, the fine ceiling and the expiry check exist in exactly one place, and every screen that needs the answer asks the same question.",
        "A FinePolicy interface lets flat, slab and capped pricing be swapped without returnItem() changing at all — the same seam as a pricing strategy anywhere else.",
        "Passing the date into issue(), returnItem() and canBorrow() makes every money calculation a one-line unit test instead of something you can only observe by waiting.",
      ],
      cons: [
        "Two classes where beginners expect one means more objects to create and keep consistent, and a bulk import of a thousand titles now has to create items too.",
        "Keeping every closed BookLending forever grows without bound; a real system needs archiving, and the design says nothing about when history stops being worth keeping.",
        "A single FIFO reservation queue per title has no expiry and no priority, so a reserver who never collects can hold a copy out of circulation indefinitely.",
        "The in-process find-then-claim on an item is check-then-act, and it is only safe because this design assumes one process — two desks need an atomic take at the store.",
        "The BookItem abstraction is genuinely physical, so digital formats do not fit it at all and require a parallel model rather than a subclass.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "awesome-low-level-design — Library Management System",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/library-management-system.md",
        kind: "article",
        note: "The problem written up as interviewers usually pose it. Compare its class list with yours — especially where it puts the borrow rules.",
      },
      {
        label: "FRBR — Functional Requirements for Bibliographic Records",
        href: "https://en.wikipedia.org/wiki/Functional_Requirements_for_Bibliographic_Records",
        kind: "spec",
        note: "Library science solved this exact split long ago: work, expression, manifestation, item. Your Book / BookItem pair is the last two, and knowing the real vocabulary is a nice thing to drop into the round.",
      },
      {
        label: "Martin Fowler — AnemicDomainModel",
        href: "https://martinfowler.com/bliki/AnemicDomainModel.html",
        kind: "article",
        note: "The precise name for the LibraryService-decides-everything failure, and why a model of pure getters is not really object-oriented.",
      },
      {
        label: "Martin Fowler — TellDontAsk",
        href: "https://martinfowler.com/bliki/TellDontAsk.html",
        kind: "article",
        note: "Two pages that justify member.canBorrow(today) better than any argument you can make on the spot.",
      },
      {
        label: "Martin Fowler — Money pattern",
        href: "https://martinfowler.com/eaaCatalog/money.html",
        kind: "article",
        note: "Why fines are integer minor units with a currency, and never a double. One paragraph, and it saves a point every time money appears in a round.",
      },
      {
        label: "Domain-Driven Design — Eric Evans",
        kind: "book",
        note: "Chapter 5 is entities versus value objects, which is exactly the question of whether a copy has an identity separate from its description. The rest of the chapter is the association-class argument.",
      },
      {
        label: "Refactoring Guru — Strategy",
        href: "https://refactoring.guru/design-patterns/strategy",
        kind: "docs",
        note: "The pattern behind FinePolicy, with the swap-at-runtime version you want for the “what if fines change?” follow-up.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "library-management-q1",
        question: "A library owns five copies of the same title. Why is a single `Book` class with an `isAvailable` boolean wrong?",
        options: [
          { id: "a", label: "Availability is a property of each physical copy, not of the title — so the boolean cannot say “1 of 5 available”, cannot say which copy a member took, and has nowhere to put a barcode or a rack." },
          { id: "b", label: "Because booleans are slower to query than integers." },
          { id: "c", label: "Because the ISBN would then have to be unique, which it is not." },
          { id: "d", label: "It is fine as long as you also store a copy count on the Book." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is the tempting wrong answer, because a count does fix the “1 of 5” display — but it still cannot tell you *which* copy is out, where each one is shelved, or what condition it is in, and a loan has nothing specific to point at. The catalogue entry is a description; the copy is an instance.",
      },
      {
        id: "library-management-q2",
        question: "Why model borrowing as a `BookLending` object rather than `borrowedBy` and `dueDate` fields on `BookItem`?",
        options: [
          { id: "a", label: "A field can only hold the present — closed lendings are the history that fines, late counts and member standing are computed from." },
          { id: "b", label: "Because two fields take more memory than one object." },
          { id: "c", label: "Because a BookItem should never know a member's id." },
          { id: "d", label: "It makes no difference; the fields are simpler and equivalent." },
        ],
        correctOptionId: "a",
        explanation:
          "The general rule is worth memorising: when the relationship itself has attributes — issued on, due on, returned on, fine — it is a class, not a foreign key. The moment the copy comes back, a field-based design has forgotten everything about that loan.",
      },
      {
        id: "library-management-q3",
        question: "Where should the “a member may hold at most five books” rule live?",
        options: [
          { id: "a", label: "On Member, as `canBorrow(today)`, alongside the fine ceiling and the membership expiry check." },
          { id: "b", label: "In LibraryService.issueBook(), which reads member.getLoans().size() and decides." },
          { id: "c", label: "On BookItem, since it is the item being issued." },
          { id: "d", label: "In the database, as a constraint." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is what most candidates write, and it is the anaemic model: the service reaches into another object's data to make a decision that is not its own. Tell, don't ask — and then raising the limit to eight is one constant, not a search through every caller.",
      },
      {
        id: "library-management-q4",
        question: "A copy is returned and three members are queued on that title. What happens to the copy?",
        options: [
          { id: "a", label: "It goes to the head of the reservation queue — status RESERVED, held for that member — and never touches the shelf." },
          { id: "b", label: "It becomes AVAILABLE, and the queued members are notified to come and try their luck." },
          { id: "c", label: "It stays LOANED until the queued member collects it." },
          { id: "d", label: "The queue is cleared, since a copy is now free." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is tempting because it is simpler to implement, but it makes the queue meaningless: whoever walks in first takes the copy, and the person who waited three weeks waits again. That branch at the end of returnItem() is the whole reason the return flow is worth drawing.",
      },
      {
        id: "library-management-q5",
        question: "Why should `returnItem(barcode, on)` take the date as an argument instead of reading the clock inside?",
        options: [
          { id: "a", label: "Because the fine depends on it — passing it in makes a ten-day-late charge a one-line test, while an internal clock can only be tested by waiting or faking time." },
          { id: "b", label: "Because reading the system clock is slow." },
          { id: "c", label: "Because the caller always knows the date better than the server does." },
          { id: "d", label: "Because dates cannot be read reliably inside a method." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the cheapest senior signal in the whole round and it costs one parameter. It is the same rule the parking-lot billing uses: any function whose output depends on time should receive that time rather than fetch it.",
      },
      {
        id: "library-management-q6",
        question: "Fines might be flat per day, slab-based, or capped. What is the right structure?",
        options: [
          { id: "a", label: "A FinePolicy interface with `fineFor(daysLate, priceMinor)` and one implementation each — returnItem() calls it and never changes." },
          { id: "b", label: "An if-else chain inside returnItem() switching on a policy-name string." },
          { id: "c", label: "A subclass of Library per pricing scheme." },
          { id: "d", label: "A boolean flag `isSlabPricing` on Member." },
        ],
        correctOptionId: "a",
        explanation:
          "It is exactly the pricing-strategy seam from the parking lot, and the interviewer is checking whether you recognise the shape rather than remembering the problem. Add a policy, add one class, edit nothing — that is open for extension, closed for modification.",
      },
      {
        id: "library-management-q7",
        question: "Why is `ItemStatus` an enum with five values rather than an `isAvailable` boolean?",
        options: [
          { id: "a", label: "Because a copy can be AVAILABLE, RESERVED, LOANED, LOST or IN_REPAIR, and the interviewer will ask about a lost book — two states cannot express five." },
          { id: "b", label: "Because enums are faster to compare than booleans." },
          { id: "c", label: "Because the status must be stored as text in the database." },
          { id: "d", label: "Because every field in a domain model should be an enum." },
        ],
        correctOptionId: "a",
        explanation:
          "The enum also gives you somewhere to write the legal transitions down: AVAILABLE to LOANED to either AVAILABLE or RESERVED. A boolean collapses “nobody has it” and “it is being repaired” into the same value, and then the shelf report lies.",
      },
      {
        id: "library-management-q8",
        question: "The interviewer asks how you would add e-books. What is the strongest answer?",
        options: [
          { id: "a", label: "Say honestly that BookItem breaks: an e-book has no barcode, rack or condition, so it becomes a licence with a concurrent-loan count while Book stays exactly as it is." },
          { id: "b", label: "Add an `isDigital` boolean to BookItem and skip the rack and barcode when it is true." },
          { id: "c", label: "Create a thousand BookItem rows so the existing lending code works unchanged." },
          { id: "d", label: "Make BookItem abstract and add a six-level format hierarchy beneath it." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is tempting because it is a two-minute change, but it leaves half the fields meaningless on half the rows — the classic sign that one class is holding two concepts. Knowing where your abstraction ends scores better than pretending it does not, and Book surviving unchanged is proof the original split was the right one.",
      },
    ],
  },
};
