import type { RoadmapLesson } from "@/lib/content/types";

export const atm: RoadmapLesson = {
  title: "ATM",
  oneLiner:
    "Looks like a vending machine with a keypad. It is not. An ATM changes **two things that must always agree** — a number in a database and a stack of physical paper — and only one of them can be rolled back. Every interesting question in this problem lives in that gap.",
  difficulty: "beginner",
  estimatedTime: "26 min",
  prototypePath: "/prototypes/lld/atm.html",
  content: {
    prototypeCaption:
      "A **working ATM**, with the two resources shown side by side: the cash cassettes and the account balance. Get the PIN wrong three times and the card is retained. Then find the three *different* ways a withdrawal can be declined — **₹99,000** (not enough money), **₹150** (no combination of notes makes it), and **₹2,700** after **💸 Run out of small notes** (the money exists, the *paper* doesn't). Finally, the one that matters: hit **🔧 Jam the dispenser** and withdraw ₹5,000. Watch the balance drop to ₹7,000 — and then watch it come back, because the notes never left the machine.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design an ATM.”* Most candidates hear *“vending machine, but for cash”* and start writing states. States are part of it — but they are not why this problem is asked.",
      },
      {
        type: "p",
        text: "An ATM is asked because it is the smallest realistic system where **one action must change two independent things**, and one of those things is a physical machine that can jam. Debit the account and the notes never come out, and you have taken someone's money. Push the notes out and fail to debit, and the bank has given money away. There is no ordering that is safe by itself — you need a way to *undo*.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An ATM drawn from the front: a screen, a card slot with a card, a keypad, a cash tray, and four cash cassettes inside stacked vertically. A dotted line separates the machine from a remote Bank holding the account balance. Labels mark Screen, CardReader, Keypad, CashDispenser with Cassettes, and Account.">
  <defs>
    <marker id="atm-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <!-- machine body -->
  <rect x="150" y="20" width="290" height="264" rx="10" fill="none" stroke="#3a414c" stroke-width="1.4"/>
  <text x="160" y="14" font-size="10" fill="#9099a8">the machine (local, physical, can fail)</text>

  <!-- screen -->
  <rect x="168" y="36" width="164" height="72" rx="5" fill="#0a0b0e" stroke="#3a414c"/>
  <text x="180" y="58" font-size="9" fill="#5e9ff6">MAIN MENU</text>
  <text x="180" y="78" font-size="10" fill="#e8e4dc">1 Balance</text>
  <text x="180" y="94" font-size="10" fill="#e8e4dc">2 Withdraw</text>
  <text x="34" y="52" font-size="11" fill="#fb863a">Screen</text>
  <line x1="90" y1="48" x2="162" y2="60" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#atm-lead)"/>

  <!-- card slot -->
  <rect x="348" y="44" width="76" height="10" rx="3" fill="#0a0b0e" stroke="#3a414c"/>
  <rect x="356" y="64" width="58" height="34" rx="4" fill="#14161a" stroke="#fb863a" stroke-width="1.2"/>
  <text x="364" y="86" font-size="9" fill="#fb863a">••••4821</text>
  <text x="560" y="52" font-size="11" fill="#fb863a">CardReader</text>
  <line x1="620" y1="60" x2="430" y2="50" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#atm-lead)"/>

  <!-- keypad -->
  <rect x="168" y="122" width="110" height="72" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="176" y="130" width="28" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="210" y="130" width="28" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="244" y="130" width="26" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="176" y="154" width="28" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="210" y="154" width="28" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="244" y="154" width="26" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="150" font-size="11" fill="#fb863a">Keypad</text>
  <line x1="92" y1="146" x2="162" y2="152" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#atm-lead)"/>

  <!-- cassettes -->
  <rect x="294" y="122" width="130" height="102" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="302" y="138" font-size="8.5" fill="#6b7280">CASSETTES</text>
  <rect x="302" y="144" width="114" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/><text x="310" y="156" font-size="8.5" fill="#e8e4dc">₹2000 ×2</text>
  <rect x="302" y="164" width="114" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/><text x="310" y="176" font-size="8.5" fill="#e8e4dc">₹500 ×6</text>
  <rect x="302" y="184" width="114" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/><text x="310" y="196" font-size="8.5" fill="#e8e4dc">₹200 ×3</text>
  <rect x="302" y="204" width="114" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/><text x="310" y="216" font-size="8.5" fill="#e8e4dc">₹100 ×5</text>
  <text x="560" y="150" font-size="11" fill="#fb863a">CashDispenser</text>
  <line x1="620" y1="158" x2="430" y2="170" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#atm-lead)"/>

  <!-- tray -->
  <rect x="168" y="238" width="256" height="32" rx="4" fill="#0a0b0e" stroke="#3a414c" stroke-dasharray="4 4"/>
  <text x="182" y="258" font-size="10" fill="#5cc66f">₹2,000 ×2   ₹500 ×2</text>

  <!-- the bank, separated -->
  <line x1="480" y1="196" x2="480" y2="290" stroke="#2d333d" stroke-dasharray="5 5"/>
  <rect x="500" y="204" width="196" height="76" rx="8" fill="#14161a" stroke="#5cc66f"/>
  <text x="516" y="226" font-size="10" fill="#5cc66f">Account ••••4821</text>
  <line x1="516" y1="234" x2="680" y2="234" stroke="#2d333d"/>
  <text x="516" y="252" font-size="12" fill="#e8e4dc">₹12,000</text>
  <text x="516" y="270" font-size="9" fill="#9099a8">remote · can be rolled back</text>
</svg>`,
        caption:
          "The dotted line is the whole problem. To the left, **paper that cannot be un-dispensed**. To the right, **a number that can be put back**. A withdrawal has to move both, and only one of them is reversible.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **session** starts when a card goes in and ends when it comes out — nothing survives it. Every transaction runs its cheap checks first (**balance**, **daily limit**, **can the notes even add up**) and only then touches anything. If the physical dispense fails, the account debit is **undone**.",
      },
      { type: "h", text: "What separates this from a vending machine" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 216" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A comparison table. Vending machine: one resource, the shelf; no identity; failure costs the price of a snack; a state machine is enough. ATM: two resources, cash and account; authenticated identity; failure costs real money; a state machine plus rollback is required.">
  <text x="188" y="24" font-size="10" fill="#9099a8">VENDING MACHINE</text>
  <text x="452" y="24" font-size="10" fill="#fb863a">ATM</text>

  <text x="20" y="60" font-size="10.5" fill="#e8e4dc">resources</text>
  <rect x="160" y="38" width="252" height="32" rx="6" fill="#14161a" stroke="#2d333d"/><text x="174" y="59" font-size="10" fill="#9099a8">one — the shelf</text>
  <rect x="428" y="38" width="252" height="32" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="442" y="59" font-size="10" fill="#fb863a">two — cash AND the account</text>

  <text x="20" y="104" font-size="10.5" fill="#e8e4dc">who is asking</text>
  <rect x="160" y="82" width="252" height="32" rx="6" fill="#14161a" stroke="#2d333d"/><text x="174" y="103" font-size="10" fill="#9099a8">nobody — coins are the auth</text>
  <rect x="428" y="82" width="252" height="32" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="442" y="103" font-size="10" fill="#fb863a">an authenticated identity</text>

  <text x="20" y="148" font-size="10.5" fill="#e8e4dc">cost of a bug</text>
  <rect x="160" y="126" width="252" height="32" rx="6" fill="#14161a" stroke="#2d333d"/><text x="174" y="147" font-size="10" fill="#9099a8">one snack</text>
  <rect x="428" y="126" width="252" height="32" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="442" y="147" font-size="10" fill="#f06868">somebody’s salary</text>

  <text x="20" y="192" font-size="10.5" fill="#e8e4dc">what you must build</text>
  <rect x="160" y="170" width="252" height="32" rx="6" fill="#14161a" stroke="#2d333d"/><text x="174" y="191" font-size="10" fill="#9099a8">a state machine</text>
  <rect x="428" y="170" width="252" height="32" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="442" y="191" font-size="10" fill="#5cc66f">a state machine + rollback</text>
</svg>`,
        caption:
          "If you have already done [[vending-machine]], you have the state machine. This lesson is about the extra row — and it is the row the interviewer is grading.",
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- clarify ----------
      { type: "h", text: "Step 1 · Clarify — 4 minutes" },
      {
        type: "ul",
        items: [
          "**Which transactions?** — *“Balance, withdraw, deposit.”* Three is plenty. Transfers add an account-to-account story that eats your clock.",
          "**Does the ATM hold the balance, or does a bank?** — *“A bank service holds it; the ATM asks.”* This one answer creates the two-resource problem you want to talk about.",
          "**What denominations, and how many?** — ₹2000/500/200/100 with finite counts. Finite is the interesting version.",
          "**PIN rules?** — three attempts, then the card is retained. Cheap to build, and it shows you thought about security.",
          "**Daily limit?** — yes, say ₹20,000. It gives you a second, *policy* kind of failure that is clearly not physical.",
          "**Out of scope** — cheque deposits, receipts, card networks, multi-currency, the bank's own persistence.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The question that unlocks the good conversation",
        text: "Ask: *“what happens if the dispenser jams after we've debited the account?”* Most candidates never raise it, and it is the single thing this problem exists to test. Asking it in minute three tells the interviewer you have seen a real system before.",
      },

      // ---------- session ----------
      { type: "h", text: "Step 2 · The session — everything dies with the card" },
      {
        type: "p",
        text: "An ATM is a machine used by strangers, one after another. The most important structural rule is that **nothing survives the card ejecting**: not the PIN attempts, not the authenticated flag, not the account reference, not the last-viewed balance.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 250" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A state diagram for the ATM session. A start dot leads to NO_CARD. insertCard moves to AUTHENTICATING. A correct PIN moves to SESSION_ACTIVE; three wrong PINs move to CARD_RETAINED. From SESSION_ACTIVE a transaction loops back to itself, and ejectCard returns to NO_CARD. A note says all session state is destroyed on the way back to NO_CARD.">
  <defs>
    <marker id="atm-st" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#d8d3c9"/></marker>
    <marker id="atm-stx" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <circle cx="24" cy="70" r="7" fill="#d8d3c9"/>
  <line x1="32" y1="70" x2="60" y2="70" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#atm-st)"/>

  <rect x="66" y="48" width="116" height="44" rx="22" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="94" y="76" font-size="11.5" fill="#fb863a">NO_CARD</text>

  <text x="196" y="60" font-size="9.5" fill="#9099a8">insertCard()</text>
  <line x1="184" y1="70" x2="272" y2="70" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#atm-st)"/>

  <rect x="278" y="48" width="152" height="44" rx="22" fill="#14161a" stroke="#3a414c"/>
  <text x="292" y="76" font-size="11.5" fill="#e8e4dc">AUTHENTICATING</text>

  <!-- self loop wrong pin -->
  <path d="M320,48 C312,16 388,16 380,48" fill="none" stroke="#f06868" stroke-width="1.2" marker-end="url(#atm-stx)"/>
  <text x="286" y="12" font-size="9.5" fill="#f06868">wrong PIN — attempts++</text>

  <text x="446" y="60" font-size="9.5" fill="#9099a8">PIN ok</text>
  <line x1="432" y1="70" x2="524" y2="70" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#atm-st)"/>

  <rect x="530" y="48" width="164" height="44" rx="22" fill="#14161a" stroke="#5cc66f"/>
  <text x="546" y="76" font-size="11.5" fill="#5cc66f">SESSION_ACTIVE</text>

  <!-- self loop transaction -->
  <path d="M576,92 C568,128 648,128 640,92" fill="none" stroke="#9099a8" stroke-width="1.2" marker-end="url(#atm-st)"/>
  <text x="530" y="146" font-size="9.5" fill="#9099a8">balance / withdraw / deposit</text>

  <!-- retained -->
  <line x1="354" y1="92" x2="354" y2="166" stroke="#f06868" stroke-width="1.3" marker-end="url(#atm-stx)"/>
  <text x="234" y="134" font-size="9.5" fill="#f06868">3rd wrong PIN</text>
  <rect x="278" y="172" width="152" height="40" rx="20" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="298" y="197" font-size="11" fill="#f06868">CARD_RETAINED</text>

  <!-- eject -->
  <path d="M600,92 C600,214 200,214 124,96" fill="none" stroke="#d8d3c9" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#atm-st)"/>
  <text x="380" y="232" font-size="9.5" fill="#9099a8">ejectCard() — and every field of the session is destroyed here</text>
</svg>`,
        caption:
          "The dashed arrow home is not just a transition, it is a **wipe**. Storing `attempts` or `currentAccount` on the ATM instead of on the session is how the next customer sees somebody else's balance. Notation: [[state-diagrams]].",
      },
      {
        type: "callout",
        variant: "tip",
        title: "One field, one bug avoided",
        text: "Model the session as an object (`Session { card, account, attempts, startedAt }`) and hold it as a **nullable field** on the ATM. `ejectCard()` becomes `session = null`. Now “did I remember to clear that?” is not a question you can get wrong.",
      },

      // ---------- withdrawal ----------
      { type: "h", text: "Step 3 · The withdrawal — three checks, then two writes" },
      {
        type: "p",
        text: "A withdrawal fails in three genuinely different ways, and the order you check them in is not arbitrary. Cheapest and most reversible first; the one that touches hardware last.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 300" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A flow of three checks. Check one: enough balance, else declined insufficient funds. Check two: under the daily limit, else declined limit exceeded. Check three: can the cassettes build this amount, else declined cannot dispense. Only after all three do two writes happen: debit the account, then dispense the notes, with a rollback arrow if the dispense fails.">
  <defs>
    <marker id="atm-fl" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#d8d3c9"/></marker>
    <marker id="atm-flx" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <rect x="20" y="24" width="200" height="38" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="34" y="48" font-size="10.5" fill="#e8e4dc">1 · amount ≤ balance ?</text>
  <line x1="228" y1="43" x2="330" y2="43" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#atm-flx)"/>
  <text x="342" y="47" font-size="10" fill="#f06868">✗ InsufficientFunds</text>
  <text x="342" y="62" font-size="9" fill="#6b7280">nothing touched · free to check</text>

  <line x1="120" y1="62" x2="120" y2="90" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#atm-fl)"/>

  <rect x="20" y="94" width="200" height="38" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="34" y="118" font-size="10.5" fill="#e8e4dc">2 · under daily limit ?</text>
  <line x1="228" y1="113" x2="330" y2="113" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#atm-flx)"/>
  <text x="342" y="117" font-size="10" fill="#f06868">✗ LimitExceeded</text>
  <text x="342" y="132" font-size="9" fill="#6b7280">a policy rule — belongs to the account</text>

  <line x1="120" y1="132" x2="120" y2="160" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#atm-fl)"/>

  <rect x="20" y="164" width="200" height="38" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="34" y="188" font-size="10.5" fill="#e8e4dc">3 · notes add up ?</text>
  <line x1="228" y1="183" x2="330" y2="183" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#atm-flx)"/>
  <text x="342" y="187" font-size="10" fill="#f06868">✗ CannotDispense</text>
  <text x="342" y="202" font-size="9" fill="#6b7280">a physical fact about THIS machine</text>

  <line x1="120" y1="202" x2="120" y2="230" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#atm-fl)"/>

  <rect x="20" y="234" width="200" height="34" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="34" y="256" font-size="10.5" fill="#5cc66f">debit the account</text>
  <line x1="228" y1="251" x2="286" y2="251" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#atm-fl)"/>
  <rect x="292" y="234" width="180" height="34" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="306" y="256" font-size="10.5" fill="#5cc66f">dispense the notes</text>

  <path d="M382,268 C382,292 120,292 120,272" fill="none" stroke="#f06868" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#atm-flx)"/>
  <text x="490" y="256" font-size="10" fill="#f06868">jam → ROLLBACK the debit</text>
</svg>`,
        caption:
          "Three failures, three different owners: the **account** has the money, the **bank policy** has the limit, the **machine** has the paper. Conflating them into one “declined” is the modelling mistake here.",
      },
      {
        type: "p",
        text: "Now the part that makes this an ATM and not a vending machine. The two writes at the bottom are not equal:",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 280" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two timelines. The naive version debits the account, the dispenser jams, and the customer has lost five thousand rupees. The correct version debits the account, the dispenser jams, an exception is caught, the debit is reversed and the balance returns to twelve thousand.">
  <text x="20" y="24" font-size="10.5" fill="#f06868">✗ NO ROLLBACK</text>
  <rect x="20" y="34" width="660" height="86" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>

  <rect x="38" y="50" width="150" height="28" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="50" y="69" font-size="9.5" fill="#e8e4dc">debit ₹5,000</text>
  <text x="196" y="69" font-size="11" fill="#6b7280">→</text>
  <rect x="216" y="50" width="160" height="28" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="228" y="69" font-size="9.5" fill="#f06868">dispenser jams ✗</text>
  <text x="384" y="69" font-size="11" fill="#6b7280">→</text>
  <rect x="404" y="50" width="160" height="28" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="416" y="69" font-size="9.5" fill="#9099a8">error shown</text>

  <text x="38" y="104" font-size="10" fill="#f06868">balance ₹12,000 → ₹7,000 · cash in hand ₹0 · the customer is out ₹5,000</text>

  <text x="20" y="158" font-size="10.5" fill="#5cc66f">✓ WITH ROLLBACK</text>
  <rect x="20" y="168" width="660" height="96" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <rect x="38" y="184" width="130" height="28" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="50" y="203" font-size="9.5" fill="#e8e4dc">debit ₹5,000</text>
  <text x="176" y="203" font-size="11" fill="#6b7280">→</text>
  <rect x="196" y="184" width="140" height="28" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="208" y="203" font-size="9.5" fill="#f06868">jams ✗ throws</text>
  <text x="344" y="203" font-size="11" fill="#6b7280">→</text>
  <rect x="364" y="184" width="130" height="28" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="376" y="203" font-size="9.5" fill="#e8e4dc">catch</text>
  <text x="502" y="203" font-size="11" fill="#6b7280">→</text>
  <rect x="522" y="184" width="142" height="28" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="534" y="203" font-size="9.5" fill="#5cc66f">credit ₹5,000 back</text>

  <text x="38" y="238" font-size="10" fill="#5cc66f">balance ₹12,000 → ₹7,000 → ₹12,000 · cash in hand ₹0 · nobody lost anything</text>
  <text x="38" y="256" font-size="9.5" fill="#9099a8">the reversal is a real transaction of its own — it is recorded, not erased</text>
</svg>`,
        caption:
          "Press **🔧 Jam the dispenser** in the prototype and withdraw ₹5,000. You will see the balance fall to ₹7,000 and then climb back. That flicker is the entire point of the problem.",
      },
      {
        type: "code",
        language: "java",
        filename: "the shape that matters",
        code: `public Receipt withdraw(Money amount) {
    requireSession();

    // ---- every check that can fail, before the first write ----
    if (!account.hasFunds(amount))            throw new InsufficientFundsException(amount);
    if (!policy.withinDailyLimit(account, amount)) throw new DailyLimitExceededException();
    NotePlan plan = dispenser.planFor(amount)             // can the CASSETTES build it?
            .orElseThrow(() -> new CannotDispenseAmountException(amount));

    // ---- two writes; the second one can physically fail ----
    account.debit(amount);
    try {
        dispenser.dispense(plan);
    } catch (DispenserFaultException e) {
        account.credit(amount);           // <-- the whole problem, in one line
        throw new TransactionReversedException(e);
    }
    return new Receipt(account.id(), amount, plan, clock.now());
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "“Just dispense first, then debit” does not fix it",
        text: "Then a failure *after* dispensing means the bank handed out cash and never charged for it. There is no ordering of two independent writes that is safe on its own — which is exactly why the answer is a compensating action, not a clever order. Say that sentence out loud in the interview; it is the one that lands.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Where this goes if they push further",
        text: "Real ATMs do not roll back optimistically — the network can drop between the debit and the acknowledgement. They use an **idempotency key** per transaction so a retry cannot double-charge, plus overnight **reconciliation** against the machine's physical note count. You do not need to build any of that. Naming it in two sentences is worth more than building half of it.",
      },

      // ---------- notes ----------
      { type: "h", text: "Choosing the notes" },
      {
        type: "p",
        text: "Same greedy walk as making change, with one difference that trips people up: an ATM can only pay in the notes it **physically holds**, so “₹150” is not a rounding problem, it is impossible.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 224" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Three withdrawal amounts against cassettes holding two two-thousand notes, six five-hundreds, three two-hundreds and five hundreds. Five thousand works as two two-thousands plus two five-hundreds. Two thousand seven hundred works as one of each of two thousand, five hundred and two hundred. One hundred and fifty is impossible because the smallest note is one hundred.">
  <text x="20" y="24" font-size="10" fill="#9099a8">CASSETTES  ₹2000 ×2   ₹500 ×6   ₹200 ×3   ₹100 ×5</text>

  <rect x="20" y="38" width="660" height="44" rx="7" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="66" font-size="11" fill="#e8e4dc">₹5,000</text>
  <text x="140" y="66" font-size="10.5" fill="#5cc66f">₹2000 ×2  +  ₹500 ×2</text>
  <text x="470" y="66" font-size="10" fill="#9099a8">biggest first, then fill</text>

  <rect x="20" y="92" width="660" height="44" rx="7" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="120" font-size="11" fill="#e8e4dc">₹2,700</text>
  <text x="140" y="120" font-size="10.5" fill="#5cc66f">₹2000 ×1  +  ₹500 ×1  +  ₹200 ×1</text>
  <text x="470" y="120" font-size="10" fill="#9099a8">exact, using three cassettes</text>

  <rect x="20" y="146" width="660" height="44" rx="7" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="38" y="174" font-size="11" fill="#e8e4dc">₹150</text>
  <text x="140" y="174" font-size="10.5" fill="#f06868">✗ impossible</text>
  <text x="470" y="174" font-size="10" fill="#9099a8">smallest note is ₹100</text>

  <text x="20" y="214" font-size="9.5" fill="#6b7280">greedy is enough here — but it can fail while a smarter search would succeed, so a real ATM validates the plan before committing</text>
</svg>`,
        caption:
          "Worth one sentence in the interview: greedy can *fail to find* a plan that exists (say the ₹500 cassette is empty but ₹200 ×5 would work). Because you validate the plan **before** dispensing, a greedy miss is a harmless decline — never a wrong payout.",
      },

      // ---------- class diagram ----------
      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 360" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. ATM holds a nullable Session and a CashDispenser, and depends on a BankService interface. Session references Card and Account. CashDispenser composes Cassette. BankService is implemented by RemoteBank and FakeBank. Transaction is subclassed by Withdrawal, Deposit and BalanceEnquiry.">
  <defs>
    <marker id="atm-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="atm-t" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="12" refX="12" refY="6" orient="auto"><path d="M1,1 L12,6 L1,11 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <rect x="264" y="14" width="192" height="72" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="276" y="34" font-size="11.5" fill="#fb863a">ATM</text>
  <line x1="264" y1="42" x2="456" y2="42" stroke="#2d333d"/>
  <text x="276" y="60" font-size="10" fill="#9099a8">- session : Session?</text>
  <text x="276" y="78" font-size="10" fill="#e8e4dc">+ insertCard / enterPin / eject</text>

  <!-- session -->
  <line x1="300" y1="86" x2="300" y2="128" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#atm-a)"/>
  <text x="196" y="112" font-size="9.5" fill="#6b7280">0..1 — null when no card</text>
  <rect x="196" y="132" width="176" height="68" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="208" y="152" font-size="11.5" fill="#e8e4dc">Session</text>
  <line x1="196" y1="160" x2="372" y2="160" stroke="#2d333d"/>
  <text x="208" y="178" font-size="10" fill="#9099a8">- attempts : int</text>
  <text x="208" y="194" font-size="10" fill="#9099a8">- account : Account</text>

  <rect x="20" y="132" width="150" height="46" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="152" font-size="11.5" fill="#e8e4dc">Card</text>
  <line x1="20" y1="160" x2="170" y2="160" stroke="#2d333d"/>
  <text x="32" y="174" font-size="10" fill="#9099a8">- number, pinHash</text>
  <line x1="196" y1="152" x2="176" y2="152" stroke="#9099a8" stroke-width="1.2" marker-end="url(#atm-a)"/>

  <!-- dispenser -->
  <path d="M420,86 L420,100 L412,108 L420,116 L428,108 L420,100" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="420" y1="116" x2="420" y2="132" stroke="#d8d3c9" stroke-width="1.3"/>
  <rect x="396" y="132" width="186" height="86" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="408" y="152" font-size="11.5" fill="#e8e4dc">CashDispenser</text>
  <line x1="396" y1="160" x2="582" y2="160" stroke="#2d333d"/>
  <text x="408" y="178" font-size="10" fill="#e8e4dc">+ planFor(amount)</text>
  <text x="408" y="196" font-size="10" fill="#e8e4dc">+ dispense(plan)</text>
  <text x="408" y="212" font-size="9.5" fill="#f06868">↑ can physically fail</text>

  <path d="M470,218 L470,232 L462,240 L470,248 L478,240 L470,232" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="470" y1="248" x2="470" y2="266" stroke="#d8d3c9" stroke-width="1.3"/>
  <text x="478" y="262" font-size="9.5" fill="#9099a8">1..*</text>
  <rect x="396" y="266" width="186" height="46" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="408" y="286" font-size="11.5" fill="#e8e4dc">Cassette</text>
  <line x1="396" y1="294" x2="582" y2="294" stroke="#2d333d"/>
  <text x="408" y="308" font-size="10" fill="#9099a8">- denom, count</text>

  <!-- bank -->
  <polyline points="456,50 618,50 618,128" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#atm-a)"/>
  <text x="480" y="44" font-size="9.5" fill="#6b7280">asks</text>
  <rect x="596" y="132" width="112" height="60" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="606" y="150" font-size="9.5" fill="#6b7280">«interface»</text>
  <text x="606" y="166" font-size="11" fill="#5e9ff6">BankService</text>
  <text x="606" y="184" font-size="9.5" fill="#e8e4dc">debit / credit</text>

  <line x1="652" y1="228" x2="652" y2="196" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#atm-t)"/>
  <rect x="596" y="228" width="112" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="606" y="246" font-size="10" fill="#e8e4dc">RemoteBank</text>
  <rect x="596" y="260" width="112" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="606" y="278" font-size="10" fill="#5cc66f">FakeBank</text>

  <!-- transactions -->
  <rect x="20" y="230" width="150" height="46" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="250" font-size="11.5" fill="#e8e4dc">Transaction</text>
  <text x="32" y="268" font-size="9.5" fill="#6b7280">«abstract»</text>
  <line x1="95" y1="290" x2="95" y2="278" stroke="#9099a8" stroke-width="1.2" marker-end="url(#atm-t)"/>
  <line x1="46" y1="304" x2="46" y2="290" stroke="#9099a8" stroke-width="1.2"/>
  <line x1="146" y1="304" x2="146" y2="290" stroke="#9099a8" stroke-width="1.2"/>
  <line x1="46" y1="290" x2="146" y2="290" stroke="#9099a8" stroke-width="1.2"/>
  <rect x="20" y="304" width="52" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="26" y="322" font-size="9" fill="#e8e4dc">Withdraw</text>
  <rect x="78" y="304" width="46" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="86" y="322" font-size="9" fill="#e8e4dc">Deposit</text>
  <rect x="130" y="304" width="42" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="140" y="322" font-size="9" fill="#e8e4dc">Balance</text>
</svg>`,
        caption:
          "Two details earn points. `session` is **nullable** — that is “no card inserted”, modelled instead of flagged. And `BankService` is an **interface** with a `FakeBank`, because you cannot demo a rollback against a real bank. Notation: [[class-diagrams]].",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The FakeBank is not a shortcut, it is the deliverable",
        text: "A `FakeBank` you can tell to fail on demand is how you *show* the rollback working in your `main()`. Interviewers remember the demo that printed `balance restored: ₹12,000`. Depending on an interface rather than a concrete bank is [[dependency-inversion]] doing real work for you.",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“The network dies right after the debit — you never learn if it succeeded.”** → an idempotency key per transaction, so the retry is safe, plus reconciliation later. This is the follow-up they most want to hear you handle.",
          "**“Two ATMs, one account, at the same moment.”** → the balance lives in the bank, so the bank serialises it. Notice that the ATM's own concurrency problem is trivial — one person stands at it. Contrast with [[parking-lot]], where many gates hit one lot.",
          "**“Add transfers between accounts.”** → now *two* accounts change, and you are looking at the same both-or-neither problem with no physical component. Same answer, cleaner.",
          "**“Different limits for premium customers.”** → the limit is a policy object on the account, not a constant in the ATM. Swappable, like pricing in [[parking-lot]].",
          "**“Print a receipt / send an SMS.”** → the transaction publishes an event; printers and notifiers subscribe. [[observer]], and it keeps the withdrawal path clean.",
          "**“Support multiple currencies.”** → `Money` becomes amount + currency, and cassettes are per-currency. Mostly a value-object exercise; see [[immutability-and-value-objects]].",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**No rollback.** The single most common miss, and the one the problem exists to catch.",
          "**Session state on the ATM.** `attempts` as an ATM field means the next customer inherits it.",
          "**Only one kind of decline.** Merging *insufficient funds*, *over the limit* and *cannot dispense* into one message throws away the entire modelling insight.",
          "**A real `Bank` class with no seam.** Then you cannot demonstrate the failure path, which is the best thing you had to show.",
          "**`double` for money.** On an ATM. Use a minor-unit `long` or `BigDecimal` and say why.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Get the card eaten",
        body:
          "Insert the card, then press **🔢 9999 (wrong)** three times. The counter is visible on screen each time, and on the third the card is retained. Note what the machine never tells you: which digit was wrong, or whether the card number even exists.",
      },
      {
        title: "Find all three declines",
        body:
          "Reset, authenticate with **1234**, then **💵 Withdraw**. Try **₹99,000** — insufficient funds, decided purely from the balance. Try **₹150** — the balance is fine, but no combination of ₹2000/500/200/100 makes 150. Two failures, two completely different causes, two different messages.",
      },
      {
        title: "Separate the account from the paper",
        body:
          "Press **💸 Run out of small notes**, then try **₹2,700**. The account has ₹12,000 sitting right there and the machine still says no: ₹2,000 + ₹500 = ₹2,500 and nothing can make the last ₹200. Then try **₹5,000** — it works, because 2000×2 + 500×2 fits. The money and the notes are different resources.",
      },
      {
        title: "Break it on purpose — the one that matters",
        body:
          "Press **🔧 Jam the dispenser**, then withdraw **₹5,000**. Watch the balance panel: ₹12,000 → **₹7,000** → back to **₹12,000**. The tray stays empty the whole time. That flicker is a compensating transaction, and it is the reason this problem is in the interview set.",
      },
      {
        title: "Watch the session die",
        body:
          "Authenticate, check the balance, then **⏏ Eject card**. Everything on screen resets to WELCOME and the balance panel goes back to ₹—. Ask yourself which fields had to be cleared for that to be true, and what would happen if `attempts` were stored on the ATM instead of the session.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file: `Money` → `Cassette` and `CashDispenser.planFor()` → `Session` → `BankService` interface with a `FakeBank` → `withdraw()` with all three checks and the try/catch rollback → `main()`. Make your demo call the fake bank in failure mode at least once, and print the balance before, during and after.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "ATM.java",
        code: `import java.util.*;

// ---------- money as whole paise; never a double ----------
record Money(long paise) {
    static Money rupees(long r) { return new Money(r * 100); }
    Money plus(Money o)  { return new Money(paise + o.paise); }
    Money minus(Money o) { return new Money(paise - o.paise); }
    boolean gt(Money o)  { return paise > o.paise; }
    long rupees()        { return paise / 100; }
    public String toString() { return "₹" + rupees(); }
}

class Account {
    private final String id;
    private Money balance;
    private Money withdrawnToday = new Money(0);

    Account(String id, Money opening) { this.id = id; this.balance = opening; }

    String id()        { return id; }
    Money balance()    { return balance; }
    Money usedToday()  { return withdrawnToday; }

    boolean hasFunds(Money amount) { return !amount.gt(balance); }

    void debit(Money amount) {
        if (!hasFunds(amount)) throw new IllegalStateException("overdraw");
        balance = balance.minus(amount);
        withdrawnToday = withdrawnToday.plus(amount);
    }
    /** The compensating action. Not "undo" — a real, recorded credit. */
    void credit(Money amount) {
        balance = balance.plus(amount);
        withdrawnToday = withdrawnToday.minus(amount);
    }
}

// ---------- the bank is behind an interface so failure is demoable ----------
interface BankService {
    Account authenticate(Card card, String pin);
    void debit(Account a, Money amount);
    void credit(Account a, Money amount);
}

record Card(String number, String pin) {}

class FakeBank implements BankService {
    private final Map<String, Account> accounts = new HashMap<>();
    void register(Card c, Account a) { accounts.put(c.number(), a); }

    public Account authenticate(Card card, String pin) {
        if (!card.pin().equals(pin)) throw new WrongPinException();
        return accounts.get(card.number());
    }
    public void debit(Account a, Money amount)  { a.debit(amount); }
    public void credit(Account a, Money amount) { a.credit(amount); }
}

class WrongPinException extends RuntimeException {}
class InsufficientFundsException extends RuntimeException {}
class DailyLimitExceededException extends RuntimeException {}
class CannotDispenseAmountException extends RuntimeException {}
class DispenserFaultException extends RuntimeException {}
class TransactionReversedException extends RuntimeException {
    TransactionReversedException(Throwable cause) { super("dispenser fault — debit reversed", cause); }
}

// ---------- the physical half ----------
class Cassette {
    final int denomination;      // in rupees
    int count;
    Cassette(int denomination, int count) { this.denomination = denomination; this.count = count; }
}

class CashDispenser {
    private final List<Cassette> cassettes;   // highest denomination first
    private boolean faulty = false;

    CashDispenser(List<Cassette> cassettes) {
        this.cassettes = new ArrayList<>(cassettes);
        this.cassettes.sort(Comparator.comparingInt((Cassette c) -> c.denomination).reversed());
    }
    void setFaulty(boolean f) { this.faulty = f; }

    /** Greedy over what is physically held. Empty == this machine cannot pay that number. */
    Optional<Map<Integer, Integer>> planFor(Money amount) {
        Map<Integer, Integer> plan = new LinkedHashMap<>();
        long left = amount.rupees();
        for (Cassette c : cassettes) {
            int n = (int) Math.min(left / c.denomination, c.count);
            if (n > 0) { plan.put(c.denomination, n); left -= (long) n * c.denomination; }
        }
        return left == 0 ? Optional.of(plan) : Optional.empty();
    }

    void dispense(Map<Integer, Integer> plan) {
        if (faulty) throw new DispenserFaultException();          // the jam
        for (Cassette c : cassettes) {
            Integer n = plan.get(c.denomination);
            if (n != null) c.count -= n;
        }
        System.out.println("   [tray] " + plan);
    }
}

/** Everything that must die when the card comes out. */
class Session {
    final Card card;
    final Account account;
    Session(Card card, Account account) { this.card = card; this.account = account; }
}

class ATM {
    private static final int MAX_PIN_ATTEMPTS = 3;
    private static final Money DAILY_LIMIT = Money.rupees(20_000);

    private final BankService bank;
    private final CashDispenser dispenser;
    private Session session;              // null == NO_CARD. The state, modelled.
    private Card insertedCard;
    private int pinAttempts;

    ATM(BankService bank, CashDispenser dispenser) { this.bank = bank; this.dispenser = dispenser; }

    void insertCard(Card card) { this.insertedCard = card; this.pinAttempts = 0; }

    void enterPin(String pin) {
        try {
            session = new Session(insertedCard, bank.authenticate(insertedCard, pin));
        } catch (WrongPinException e) {
            if (++pinAttempts >= MAX_PIN_ATTEMPTS) { retainCard(); throw new IllegalStateException("card retained"); }
            throw e;
        }
    }

    Money balance() { return requireSession().account.balance(); }

    Money withdraw(Money amount) {
        Account account = requireSession().account;

        // ---- three checks, cheapest first, before ANY write ----
        if (!account.hasFunds(amount))                                throw new InsufficientFundsException();
        if (account.usedToday().plus(amount).gt(DAILY_LIMIT))          throw new DailyLimitExceededException();
        Map<Integer, Integer> plan = dispenser.planFor(amount)
                .orElseThrow(CannotDispenseAmountException::new);

        // ---- two writes; only the first can be taken back ----
        bank.debit(account, amount);
        try {
            dispenser.dispense(plan);
        } catch (DispenserFaultException e) {
            bank.credit(account, amount);                             // compensate
            throw new TransactionReversedException(e);
        }
        return amount;
    }

    void deposit(Money amount) { bank.credit(requireSession().account, amount); }

    void ejectCard() { session = null; insertedCard = null; pinAttempts = 0; }   // the wipe
    private void retainCard() { session = null; insertedCard = null; }

    private Session requireSession() {
        if (session == null) throw new IllegalStateException("no authenticated session");
        return session;
    }
}

public class Main {
    public static void main(String[] args) {
        Card card = new Card("4821", "1234");
        Account account = new Account("A-1", Money.rupees(12_000));
        FakeBank bank = new FakeBank();
        bank.register(card, account);

        CashDispenser dispenser = new CashDispenser(List.of(
                new Cassette(2000, 2), new Cassette(500, 6), new Cassette(200, 3), new Cassette(100, 5)));
        ATM atm = new ATM(bank, dispenser);

        atm.insertCard(card);
        try { atm.enterPin("9999"); } catch (WrongPinException e) { System.out.println("wrong pin 1/3"); }
        atm.enterPin("1234");
        System.out.println("balance " + atm.balance());

        try { atm.withdraw(Money.rupees(99_000)); }
        catch (InsufficientFundsException e) { System.out.println("declined: insufficient funds"); }

        try { atm.withdraw(Money.rupees(150)); }
        catch (CannotDispenseAmountException e) { System.out.println("declined: no note combination makes ₹150"); }

        // ---- the one that matters ----
        dispenser.setFaulty(true);
        try { atm.withdraw(Money.rupees(5_000)); }
        catch (TransactionReversedException e) {
            System.out.println("dispenser jammed → balance restored to " + atm.balance());
        }

        dispenser.setFaulty(false);
        atm.withdraw(Money.rupees(5_000));
        System.out.println("after clean withdrawal: " + atm.balance());

        atm.ejectCard();
        System.out.println("card out — session cleared");
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "atm.py",
        code: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


# ---------- money as whole paise; never a float ----------
@dataclass(frozen=True)
class Money:
    paise: int

    @staticmethod
    def rupees(r: int) -> "Money":
        return Money(r * 100)

    def __add__(self, o): return Money(self.paise + o.paise)
    def __sub__(self, o): return Money(self.paise - o.paise)
    def __gt__(self, o):  return self.paise > o.paise
    def __str__(self):    return f"₹{self.paise // 100:,}"


class InsufficientFunds(Exception): pass
class DailyLimitExceeded(Exception): pass
class CannotDispenseAmount(Exception): pass
class DispenserFault(Exception): pass
class TransactionReversed(Exception): pass
class WrongPin(Exception): pass


class Account:
    def __init__(self, id_: str, opening: Money):
        self.id = id_
        self.balance = opening
        self.used_today = Money(0)

    def has_funds(self, amount: Money) -> bool:
        return not (amount > self.balance)

    def debit(self, amount: Money) -> None:
        if not self.has_funds(amount):
            raise InsufficientFunds()
        self.balance -= amount
        self.used_today += amount

    def credit(self, amount: Money) -> None:
        """The compensating action — a real credit, not an erase."""
        self.balance += amount
        self.used_today -= amount


@dataclass(frozen=True)
class Card:
    number: str
    pin: str


class BankService(ABC):
    @abstractmethod
    def authenticate(self, card: Card, pin: str) -> Account: ...
    @abstractmethod
    def debit(self, account: Account, amount: Money) -> None: ...
    @abstractmethod
    def credit(self, account: Account, amount: Money) -> None: ...


class FakeBank(BankService):
    """Behind an interface so a rollback can actually be demonstrated."""
    def __init__(self):
        self._accounts: dict[str, Account] = {}

    def register(self, card: Card, account: Account) -> None:
        self._accounts[card.number] = account

    def authenticate(self, card, pin):
        if card.pin != pin:
            raise WrongPin()
        return self._accounts[card.number]

    def debit(self, account, amount):  account.debit(amount)
    def credit(self, account, amount): account.credit(amount)


class Cassette:
    def __init__(self, denomination: int, count: int):
        self.denomination, self.count = denomination, count


class CashDispenser:
    def __init__(self, cassettes: list[Cassette]):
        self._cassettes = sorted(cassettes, key=lambda c: -c.denomination)
        self.faulty = False

    def plan_for(self, amount: Money) -> Optional[dict[int, int]]:
        """Greedy over what is physically held. None == this machine cannot pay it."""
        plan, left = {}, amount.paise // 100
        for c in self._cassettes:
            n = min(left // c.denomination, c.count)
            if n:
                plan[c.denomination] = n
                left -= n * c.denomination
        return plan if left == 0 else None

    def dispense(self, plan: dict[int, int]) -> None:
        if self.faulty:
            raise DispenserFault()                    # the jam
        for c in self._cassettes:
            if c.denomination in plan:
                c.count -= plan[c.denomination]
        print("   [tray]", plan)


@dataclass
class Session:
    """Everything that must die when the card comes out."""
    card: Card
    account: Account


class ATM:
    MAX_PIN_ATTEMPTS = 3
    DAILY_LIMIT = Money.rupees(20_000)

    def __init__(self, bank: BankService, dispenser: CashDispenser):
        self._bank = bank
        self._dispenser = dispenser
        self._session: Optional[Session] = None       # None == NO_CARD, modelled not flagged
        self._card: Optional[Card] = None
        self._attempts = 0

    def insert_card(self, card: Card) -> None:
        self._card, self._attempts = card, 0

    def enter_pin(self, pin: str) -> None:
        try:
            self._session = Session(self._card, self._bank.authenticate(self._card, pin))
        except WrongPin:
            self._attempts += 1
            if self._attempts >= self.MAX_PIN_ATTEMPTS:
                self._retain_card()
                raise RuntimeError("card retained")
            raise

    @property
    def balance(self) -> Money:
        return self._require_session().account.balance

    def withdraw(self, amount: Money) -> Money:
        account = self._require_session().account

        # ---- three checks, cheapest first, before ANY write ----
        if not account.has_funds(amount):
            raise InsufficientFunds()
        if account.used_today + amount > self.DAILY_LIMIT:
            raise DailyLimitExceeded()
        plan = self._dispenser.plan_for(amount)
        if plan is None:
            raise CannotDispenseAmount()

        # ---- two writes; only the first can be taken back ----
        self._bank.debit(account, amount)
        try:
            self._dispenser.dispense(plan)
        except DispenserFault as e:
            self._bank.credit(account, amount)        # compensate
            raise TransactionReversed("dispenser fault — debit reversed") from e
        return amount

    def deposit(self, amount: Money) -> None:
        self._bank.credit(self._require_session().account, amount)

    def eject_card(self) -> None:                     # the wipe
        self._session = self._card = None
        self._attempts = 0

    def _retain_card(self) -> None:
        self._session = self._card = None

    def _require_session(self) -> Session:
        if self._session is None:
            raise RuntimeError("no authenticated session")
        return self._session


if __name__ == "__main__":
    card = Card("4821", "1234")
    account = Account("A-1", Money.rupees(12_000))
    bank = FakeBank()
    bank.register(card, account)

    dispenser = CashDispenser([Cassette(2000, 2), Cassette(500, 6), Cassette(200, 3), Cassette(100, 5)])
    atm = ATM(bank, dispenser)

    atm.insert_card(card)
    try:
        atm.enter_pin("9999")
    except WrongPin:
        print("wrong pin 1/3")
    atm.enter_pin("1234")
    print("balance", atm.balance)

    try:
        atm.withdraw(Money.rupees(99_000))
    except InsufficientFunds:
        print("declined: insufficient funds")

    try:
        atm.withdraw(Money.rupees(150))
    except CannotDispenseAmount:
        print("declined: no note combination makes ₹150")

    # ---- the one that matters ----
    dispenser.faulty = True
    try:
        atm.withdraw(Money.rupees(5_000))
    except TransactionReversed:
        print("dispenser jammed → balance restored to", atm.balance)

    dispenser.faulty = False
    atm.withdraw(Money.rupees(5_000))
    print("after clean withdrawal:", atm.balance)

    atm.eject_card()
    print("card out — session cleared")`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "atm.cpp",
        code: `#include <algorithm>
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <stdexcept>
#include <string>
#include <vector>

// ---------- money as whole paise; never a double ----------
struct Money {
    long paise = 0;
    static Money rupees(long r) { return Money{r * 100}; }
    Money operator+(Money o) const { return Money{paise + o.paise}; }
    Money operator-(Money o) const { return Money{paise - o.paise}; }
    bool  operator>(Money o) const { return paise > o.paise; }
    long  rupees() const { return paise / 100; }
};
std::ostream& operator<<(std::ostream& os, Money m) { return os << "Rs." << m.rupees(); }

struct InsufficientFunds   : std::runtime_error { InsufficientFunds()   : std::runtime_error("insufficient funds") {} };
struct DailyLimitExceeded  : std::runtime_error { DailyLimitExceeded()  : std::runtime_error("daily limit") {} };
struct CannotDispense      : std::runtime_error { CannotDispense()      : std::runtime_error("cannot dispense") {} };
struct DispenserFault      : std::runtime_error { DispenserFault()      : std::runtime_error("dispenser fault") {} };
struct TransactionReversed : std::runtime_error { TransactionReversed() : std::runtime_error("debit reversed") {} };
struct WrongPin            : std::runtime_error { WrongPin()            : std::runtime_error("wrong pin") {} };

class Account {
public:
    Account(std::string id, Money opening) : id_(std::move(id)), balance_(opening) {}
    Money balance() const { return balance_; }
    Money usedToday() const { return used_; }
    bool hasFunds(Money a) const { return !(a > balance_); }

    void debit(Money a) {
        if (!hasFunds(a)) throw InsufficientFunds();
        balance_ = balance_ - a;
        used_ = used_ + a;
    }
    // The compensating action — a real credit, not an erase.
    void credit(Money a) { balance_ = balance_ + a; used_ = used_ - a; }

private:
    std::string id_;
    Money balance_, used_{0};
};

struct Card { std::string number, pin; };

// ---------- the bank is behind an interface so failure is demoable ----------
class BankService {
public:
    virtual ~BankService() = default;
    virtual Account& authenticate(const Card&, const std::string& pin) = 0;
    virtual void debit(Account&, Money) = 0;
    virtual void credit(Account&, Money) = 0;
};

class FakeBank : public BankService {
public:
    void registerCard(const Card& c, Account* a) { accounts_[c.number] = a; }
    Account& authenticate(const Card& card, const std::string& pin) override {
        if (card.pin != pin) throw WrongPin();
        return *accounts_.at(card.number);
    }
    void debit(Account& a, Money m) override { a.debit(m); }
    void credit(Account& a, Money m) override { a.credit(m); }
private:
    std::map<std::string, Account*> accounts_;
};

struct Cassette { int denomination; int count; };
using NotePlan = std::map<int, int>;

class CashDispenser {
public:
    explicit CashDispenser(std::vector<Cassette> cs) : cassettes_(std::move(cs)) {
        std::sort(cassettes_.begin(), cassettes_.end(),
                  [](const Cassette& a, const Cassette& b) { return a.denomination > b.denomination; });
    }
    void setFaulty(bool f) { faulty_ = f; }

    // Greedy over what is physically held. nullopt == this machine cannot pay it.
    std::optional<NotePlan> planFor(Money amount) const {
        NotePlan plan;
        long left = amount.rupees();
        for (const auto& c : cassettes_) {
            int n = static_cast<int>(std::min<long>(left / c.denomination, c.count));
            if (n > 0) { plan[c.denomination] = n; left -= static_cast<long>(n) * c.denomination; }
        }
        return left == 0 ? std::optional<NotePlan>{plan} : std::nullopt;
    }

    void dispense(const NotePlan& plan) {
        if (faulty_) throw DispenserFault();                  // the jam
        for (auto& c : cassettes_) {
            auto it = plan.find(c.denomination);
            if (it != plan.end()) c.count -= it->second;
        }
        std::cout << "   [tray]";
        for (auto& [d, n] : plan) std::cout << " " << d << "x" << n;
        std::cout << "\\n";
    }

private:
    std::vector<Cassette> cassettes_;
    bool faulty_ = false;
};

// Everything that must die when the card comes out.
struct Session { Card card; Account* account; };

class ATM {
public:
    ATM(BankService& bank, CashDispenser& dispenser) : bank_(bank), dispenser_(dispenser) {}

    void insertCard(const Card& c) { card_ = c; attempts_ = 0; }

    void enterPin(const std::string& pin) {
        try {
            session_ = Session{*card_, &bank_.authenticate(*card_, pin)};
        } catch (const WrongPin&) {
            if (++attempts_ >= 3) { session_.reset(); card_.reset(); throw std::runtime_error("card retained"); }
            throw;
        }
    }

    Money balance() { return requireSession().account->balance(); }

    Money withdraw(Money amount) {
        Account& account = *requireSession().account;

        // ---- three checks, cheapest first, before ANY write ----
        if (!account.hasFunds(amount))                       throw InsufficientFunds();
        if (account.usedToday() + amount > DAILY_LIMIT)      throw DailyLimitExceeded();
        auto plan = dispenser_.planFor(amount);
        if (!plan)                                           throw CannotDispense();

        // ---- two writes; only the first can be taken back ----
        bank_.debit(account, amount);
        try {
            dispenser_.dispense(*plan);
        } catch (const DispenserFault&) {
            bank_.credit(account, amount);                   // compensate
            throw TransactionReversed();
        }
        return amount;
    }

    void ejectCard() { session_.reset(); card_.reset(); attempts_ = 0; }   // the wipe

private:
    static inline const Money DAILY_LIMIT = Money::rupees(20000);
    BankService& bank_;
    CashDispenser& dispenser_;
    std::optional<Session> session_;      // empty == NO_CARD, modelled not flagged
    std::optional<Card> card_;
    int attempts_ = 0;

    Session& requireSession() {
        if (!session_) throw std::runtime_error("no authenticated session");
        return *session_;
    }
};

int main() {
    Card card{"4821", "1234"};
    Account account("A-1", Money::rupees(12000));
    FakeBank bank;
    bank.registerCard(card, &account);

    CashDispenser dispenser({{2000, 2}, {500, 6}, {200, 3}, {100, 5}});
    ATM atm(bank, dispenser);

    atm.insertCard(card);
    try { atm.enterPin("9999"); } catch (const WrongPin&) { std::cout << "wrong pin 1/3\\n"; }
    atm.enterPin("1234");
    std::cout << "balance " << atm.balance() << "\\n";

    try { atm.withdraw(Money::rupees(99000)); }
    catch (const InsufficientFunds&) { std::cout << "declined: insufficient funds\\n"; }

    try { atm.withdraw(Money::rupees(150)); }
    catch (const CannotDispense&) { std::cout << "declined: no notes make 150\\n"; }

    // ---- the one that matters ----
    dispenser.setFaulty(true);
    try { atm.withdraw(Money::rupees(5000)); }
    catch (const TransactionReversed&) {
        std::cout << "dispenser jammed -> balance restored to " << atm.balance() << "\\n";
    }

    dispenser.setFaulty(false);
    atm.withdraw(Money::rupees(5000));
    std::cout << "after clean withdrawal: " << atm.balance() << "\\n";

    atm.ejectCard();
    std::cout << "card out - session cleared\\n";
}`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "atm.ts",
        code: `// ---------- money as whole paise; never a float ----------
class Money {
  private constructor(readonly paise: number) {}
  static rupees(r: number) { return new Money(r * 100); }
  plus(o: Money) { return new Money(this.paise + o.paise); }
  minus(o: Money) { return new Money(this.paise - o.paise); }
  gt(o: Money) { return this.paise > o.paise; }
  toString() { return \`₹\${(this.paise / 100).toLocaleString("en-IN")}\`; }
  get rupees() { return this.paise / 100; }
}

class InsufficientFunds extends Error {}
class DailyLimitExceeded extends Error {}
class CannotDispenseAmount extends Error {}
class DispenserFault extends Error {}
class TransactionReversed extends Error {}
class WrongPin extends Error {}

class Account {
  private _used = Money.rupees(0);
  constructor(readonly id: string, private _balance: Money) {}

  get balance() { return this._balance; }
  get usedToday() { return this._used; }
  hasFunds(amount: Money) { return !amount.gt(this._balance); }

  debit(amount: Money) {
    if (!this.hasFunds(amount)) throw new InsufficientFunds();
    this._balance = this._balance.minus(amount);
    this._used = this._used.plus(amount);
  }
  /** The compensating action — a real credit, not an erase. */
  credit(amount: Money) {
    this._balance = this._balance.plus(amount);
    this._used = this._used.minus(amount);
  }
}

interface Card { readonly number: string; readonly pin: string; }

// ---------- the bank is behind an interface so failure is demoable ----------
interface BankService {
  authenticate(card: Card, pin: string): Account;
  debit(account: Account, amount: Money): void;
  credit(account: Account, amount: Money): void;
}

class FakeBank implements BankService {
  private readonly accounts = new Map<string, Account>();
  register(card: Card, account: Account) { this.accounts.set(card.number, account); }

  authenticate(card: Card, pin: string): Account {
    if (card.pin !== pin) throw new WrongPin();
    return this.accounts.get(card.number)!;
  }
  debit(a: Account, m: Money) { a.debit(m); }
  credit(a: Account, m: Money) { a.credit(m); }
}

interface Cassette { readonly denomination: number; count: number; }
type NotePlan = Map<number, number>;

class CashDispenser {
  faulty = false;
  private readonly cassettes: Cassette[];
  constructor(cassettes: Cassette[]) {
    this.cassettes = [...cassettes].sort((a, b) => b.denomination - a.denomination);
  }

  /** Greedy over what is physically held. null == this machine cannot pay it. */
  planFor(amount: Money): NotePlan | null {
    const plan: NotePlan = new Map();
    let left = amount.rupees;
    for (const c of this.cassettes) {
      const n = Math.min(Math.floor(left / c.denomination), c.count);
      if (n > 0) { plan.set(c.denomination, n); left -= n * c.denomination; }
    }
    return left === 0 ? plan : null;
  }

  dispense(plan: NotePlan) {
    if (this.faulty) throw new DispenserFault();          // the jam
    for (const c of this.cassettes) {
      const n = plan.get(c.denomination);
      if (n) c.count -= n;
    }
    console.log("   [tray]", [...plan].map(([d, n]) => \`₹\${d}x\${n}\`).join(" "));
  }
}

/** Everything that must die when the card comes out. */
interface Session { readonly card: Card; readonly account: Account; }

class ATM {
  private static readonly MAX_PIN_ATTEMPTS = 3;
  private static readonly DAILY_LIMIT = Money.rupees(20_000);

  private session: Session | null = null;   // null == NO_CARD, modelled not flagged
  private card: Card | null = null;
  private attempts = 0;

  constructor(private readonly bank: BankService, private readonly dispenser: CashDispenser) {}

  insertCard(card: Card) { this.card = card; this.attempts = 0; }

  enterPin(pin: string) {
    try {
      this.session = { card: this.card!, account: this.bank.authenticate(this.card!, pin) };
    } catch (e) {
      if (++this.attempts >= ATM.MAX_PIN_ATTEMPTS) {
        this.session = null; this.card = null;
        throw new Error("card retained");
      }
      throw e;
    }
  }

  get balance(): Money { return this.requireSession().account.balance; }

  withdraw(amount: Money): Money {
    const { account } = this.requireSession();

    // ---- three checks, cheapest first, before ANY write ----
    if (!account.hasFunds(amount)) throw new InsufficientFunds();
    if (account.usedToday.plus(amount).gt(ATM.DAILY_LIMIT)) throw new DailyLimitExceeded();
    const plan = this.dispenser.planFor(amount);
    if (plan === null) throw new CannotDispenseAmount();

    // ---- two writes; only the first can be taken back ----
    this.bank.debit(account, amount);
    try {
      this.dispenser.dispense(plan);
    } catch (e) {
      this.bank.credit(account, amount);                  // compensate
      throw new TransactionReversed("dispenser fault — debit reversed");
    }
    return amount;
  }

  ejectCard() { this.session = null; this.card = null; this.attempts = 0; }   // the wipe

  private requireSession(): Session {
    if (!this.session) throw new Error("no authenticated session");
    return this.session;
  }
}

const card: Card = { number: "4821", pin: "1234" };
const account = new Account("A-1", Money.rupees(12_000));
const bank = new FakeBank();
bank.register(card, account);

const dispenser = new CashDispenser([
  { denomination: 2000, count: 2 }, { denomination: 500, count: 6 },
  { denomination: 200, count: 3 }, { denomination: 100, count: 5 },
]);
const atm = new ATM(bank, dispenser);

atm.insertCard(card);
try { atm.enterPin("9999"); } catch { console.log("wrong pin 1/3"); }
atm.enterPin("1234");
console.log("balance", String(atm.balance));

try { atm.withdraw(Money.rupees(99_000)); }
catch (e) { if (e instanceof InsufficientFunds) console.log("declined: insufficient funds"); }

try { atm.withdraw(Money.rupees(150)); }
catch (e) { if (e instanceof CannotDispenseAmount) console.log("declined: no notes make ₹150"); }

// ---- the one that matters ----
dispenser.faulty = true;
try { atm.withdraw(Money.rupees(5_000)); }
catch (e) {
  if (e instanceof TransactionReversed) console.log("dispenser jammed → balance restored to", String(atm.balance));
}

dispenser.faulty = false;
atm.withdraw(Money.rupees(5_000));
console.log("after clean withdrawal:", String(atm.balance));

atm.ejectCard();
console.log("card out — session cleared");`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The pattern behind the ATM, and where else it shows up" },
      {
        type: "p",
        text: "Strip away the cards and cassettes and you are left with a shape that appears everywhere: **one user action that must change two systems, where at most one of them can be rolled back.** Once you recognise it, a lot of “hard” design questions become the same question.",
      },
      {
        type: "ul",
        items: [
          "**Checkout** — charge the card, then reserve the stock. Payment succeeded but the last item just sold? Refund. Same compensating action.",
          "**Booking a seat** — take the money, then hold the seat. Any system where the second half is contended has this problem; it is what makes BookMyShow the advanced version of it.",
          "**Sending a file and recording that you sent it** — the send is irreversible in exactly the way dispensing cash is.",
          "**Any two-service write without a distributed transaction** — which is nearly all of them. The industry name for the general solution is a **saga**: a sequence of local transactions, each with a compensating action.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The vocabulary that earns the point",
        text: "*“I'd treat this as a saga: local transaction plus compensating action, with an idempotency key so a retry can't double-charge, and reconciliation as the backstop.”* One sentence, and you have covered what a real payments team would actually do — without building any of it.",
      },
      { type: "h", text: "Where this design would stop working" },
      {
        type: "ul",
        items: [
          "**When the network can fail between debit and acknowledgement.** The try/catch only helps if you *learn* the dispense failed. In production you cannot always tell, which is exactly why idempotency keys and reconciliation exist.",
          "**When the ATM must work offline.** Then it needs its own ledger and a sync protocol, and the single source of truth is gone.",
          "**When one account is used from many machines at once.** The bank has to serialise it; the ATM cannot. Worth saying explicitly, because it shows you know where the concurrency actually lives.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Do all the checks that can fail, then do the reversible write, then the irreversible one — and be ready to undo the reversible one.** That single ordering rule is the ATM problem.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "The rollback path is explicit and demonstrable — a FakeBank plus a faulty dispenser proves it in the main() method.",
        "Three distinct decline reasons keep the account, the bank policy and the physical machine as separate concerns instead of one vague failure.",
        "Session-as-a-nullable-object makes “no card inserted” a modelled state, so nothing can leak between customers.",
        "BankService as an interface means the ATM is testable with no bank at all, and the daily limit lives with the account where it belongs.",
        "Money as whole paise removes an entire class of rounding bugs from a system that handles cash.",
      ],
      cons: [
        "The try/catch rollback only works when the failure is observable — a network timeout after the debit is a genuinely harder problem this design does not solve.",
        "Greedy note selection can decline an amount that a smarter search could have paid, so the machine occasionally refuses a valid request.",
        "Checking the note plan and then dispensing is two steps; between them another process could in principle change the cassettes, so a real machine needs the dispenser to hold its own lock.",
        "Modelling Withdrawal / Deposit / BalanceEnquiry as a Transaction hierarchy is often over-engineering at this size — three methods on the ATM are usually enough.",
        "The design assumes one customer at a time, so it says nothing useful about how the bank keeps a shared account consistent across machines.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "Saga pattern — microservices.io",
        href: "https://microservices.io/patterns/data/saga.html",
        kind: "docs",
        note: "The general name for “local transaction + compensating action”. This is the ATM's rollback, formalised.",
      },
      {
        label: "Compensating Transaction pattern — Microsoft Azure Architecture",
        href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction",
        kind: "docs",
        note: "A short, concrete write-up of exactly the undo-the-debit move, with the caveats about when it is not enough.",
      },
      {
        label: "awesome-low-level-design — ATM",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/atm.md",
        kind: "article",
        note: "A second take on the same problem — compare its state set and transaction hierarchy against yours.",
      },
      {
        label: "Idempotency keys — Stripe API reference",
        href: "https://docs.stripe.com/api/idempotent_requests",
        kind: "docs",
        note: "How a real payments system makes a retry safe. This is the follow-up answer when the interviewer says “what if the network drops?”",
      },
      {
        label: "Patterns of Enterprise Application Architecture — Unit of Work",
        href: "https://martinfowler.com/eaaCatalog/unitOfWork.html",
        kind: "article",
        note: "The classic framing of “a set of changes that commit or roll back together”, which is what the withdrawal is trying to be.",
      },
      {
        label: "Money value object — Martin Fowler",
        href: "https://martinfowler.com/eaaCatalog/money.html",
        kind: "article",
        note: "Why Money is its own type with integer minor units, and never a floating-point number.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "atm-q1",
        question: "The account is debited and then the dispenser jams. What must happen?",
        options: [
          { id: "a", label: "Credit the amount back to the account — a compensating transaction — and report the withdrawal as reversed." },
          { id: "b", label: "Retry the dispense until it works." },
          { id: "c", label: "Leave the debit; the customer can dispute it with the bank later." },
          { id: "d", label: "Dispense from a different cassette regardless of the requested denominations." },
        ],
        correctOptionId: "a",
        explanation:
          "Two independent writes, and only the account side can be taken back. The undo is a real recorded credit, not an erasure. Press 🔧 Jam the dispenser in the prototype and watch the balance dip and return.",
      },
      {
        id: "atm-q2",
        question: "Why not simply dispense the cash first and debit the account afterwards?",
        options: [
          { id: "a", label: "Because a failure after dispensing means the bank gave away cash it never charged for — no ordering of two writes is safe on its own." },
          { id: "b", label: "Because dispensing is slower than debiting." },
          { id: "c", label: "Because the dispenser needs the new balance to choose notes." },
          { id: "d", label: "It is fine — dispensing first removes the need for any rollback." },
        ],
        correctOptionId: "a",
        explanation:
          "Reversing the order just moves who loses money. The reason we debit first is that the debit is the *reversible* half — so we do the recoverable write first and keep the irreversible one last.",
      },
      {
        id: "atm-q3",
        question: "A customer with ₹12,000 asks for ₹2,700, but the machine holds only ₹2,000 and ₹500 notes. What is the correct response?",
        options: [
          { id: "a", label: "Decline with a distinct “cannot dispense that amount” — the funds exist, but this machine cannot build the number from the notes it holds." },
          { id: "b", label: "Decline with “insufficient funds”." },
          { id: "c", label: "Dispense ₹2,500 and debit ₹2,500." },
          { id: "d", label: "Dispense ₹3,000 and debit ₹3,000." },
        ],
        correctOptionId: "a",
        explanation:
          "The account and the cassettes are different resources with different failure modes. Reporting this as “insufficient funds” is a lie that will send the customer to their bank instead of the next ATM. (c) and (d) silently change what was asked for.",
      },
      {
        id: "atm-q4",
        question: "Where should the PIN-attempt counter live?",
        options: [
          { id: "a", label: "On the session, so it is destroyed when the card is ejected." },
          { id: "b", label: "As a field on the ATM, shared across customers." },
          { id: "c", label: "As a static counter on the Card class." },
          { id: "d", label: "In a global map keyed by machine id." },
        ],
        correctOptionId: "a",
        explanation:
          "Anything that outlives the card leaks between customers — one person's two failed attempts would eat the next person's card. Making the session a nullable object means ejecting is a single assignment and nothing can be forgotten.",
      },
      {
        id: "atm-q5",
        question: "Why should `BankService` be an interface with a `FakeBank` implementation?",
        options: [
          { id: "a", label: "So the demo can force a failure and actually show the rollback working — which is the whole point of the problem." },
          { id: "b", label: "Because interfaces run faster than concrete classes." },
          { id: "c", label: "Because the ATM needs to support two banks simultaneously." },
          { id: "d", label: "Because Java requires an interface for any remote call." },
        ],
        correctOptionId: "a",
        explanation:
          "You cannot demonstrate a compensating transaction against a real bank in a 60-minute round. The seam is what turns your best design decision into visible output — dependency inversion earning its keep.",
      },
      {
        id: "atm-q6",
        question: "Which failure is a *policy* rule rather than a physical or account fact?",
        options: [
          { id: "a", label: "The daily withdrawal limit." },
          { id: "b", label: "The account balance being too low." },
          { id: "c", label: "The cassettes not containing a matching set of notes." },
          { id: "d", label: "The dispenser jamming." },
        ],
        correctOptionId: "a",
        explanation:
          "The limit is a rule the bank chose and could change per customer tier — so it belongs to the account or a policy object, not hardcoded in the ATM. The other three are facts about money, paper and hardware respectively.",
      },
      {
        id: "atm-q7",
        question: "The interviewer asks: “what if the network drops after the debit, so you never learn whether the dispense succeeded?”",
        options: [
          { id: "a", label: "Use an idempotency key per transaction so a retry cannot double-charge, and reconcile the machine's physical note count against the ledger afterwards." },
          { id: "b", label: "Retry the whole withdrawal immediately until it returns a result." },
          { id: "c", label: "Assume it failed and always credit the money back." },
          { id: "d", label: "Assume it succeeded and keep the debit." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the honest limit of the try/catch design — you can only compensate for failures you observe. (b) risks double-dispensing, and (c) and (d) are just guessing with someone's money. Naming idempotency and reconciliation is what a real payments team would do.",
      },
      {
        id: "atm-q8",
        question: "Why check the note plan *before* debiting rather than while dispensing?",
        options: [
          { id: "a", label: "So a “cannot dispense” outcome costs nothing — it is decided while both resources are still untouched." },
          { id: "b", label: "Because computing the plan takes too long to do during a dispense." },
          { id: "c", label: "Because the cassettes are locked once a debit has happened." },
          { id: "d", label: "It makes no difference; the rollback covers it either way." },
        ],
        correctOptionId: "a",
        explanation:
          "Every check you can move before the first write is a failure that needs no undo. The rollback exists for things you genuinely cannot predict — a mechanical jam — not for arithmetic you could have done up front.",
      },
    ],
  },
};
