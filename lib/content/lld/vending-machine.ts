import type { RoadmapLesson } from "@/lib/content/types";

export const vendingMachine: RoadmapLesson = {
  title: "Vending Machine",
  oneLiner:
    "The problem that teaches you **state machines**. The same three buttons mean completely different things depending on what the machine is in the middle of — and the candidates who model that explicitly finish early, while the ones who reach for `if (hasMoney && !dispensing && ...)` are still debugging at minute 55.",
  difficulty: "beginner",
  estimatedTime: "24 min",
  prototypePath: "/prototypes/lld/vending-machine.html",
  content: {
    prototypeCaption:
      "A **real vending machine**. Try the wrong thing first: tap a product before paying and the machine refuses you — not with a validation message, but because you are in the wrong **state**. The pill strip at the top always shows where you are. Insert ₹20 + ₹10, buy the ₹25 cola, and watch one full loop: **IDLE → HAS_MONEY → DISPENSING → CHANGE → IDLE**, with the item dropping and ₹5 coming back. Then break it on purpose — **💰 Empty the coin bank**, insert ₹50, buy the ₹15 candy. The machine refuses *before* the item drops, because a machine that dispenses and then discovers it cannot pay you back has stolen ₹35.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design a vending machine.”* It sounds smaller than a parking lot, and the object model genuinely is — six classes, maybe seven. What makes it a real interview question is that its behaviour **changes over time**. The exact same button press is valid, invalid, or meaningless depending on what just happened.",
      },
      {
        type: "p",
        text: "Press the cola button with no money in: nothing should happen. Press it with ₹30 in: you get a cola and ₹5 back. Press it while the machine is mid-dispense: absolutely nothing should happen, or you have just given away two colas for one payment. That is a **state machine**, and recognising it in the first two minutes is most of the score.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 330" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A vending machine drawn from the front: a glass front with six product slots in a grid, a small display screen, a coin slot, a keypad, and a collection tray at the bottom. Labels mark which part becomes which class: Inventory, Product, Display, CoinSlot, and Tray.">
  <defs>
    <marker id="vm-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <!-- cabinet -->
  <rect x="196" y="20" width="330" height="292" rx="10" fill="none" stroke="#3a414c" stroke-width="1.4"/>

  <!-- glass front + slots -->
  <rect x="210" y="34" width="196" height="192" rx="6" fill="#14161a" stroke="#2d333d"/>
  <rect x="222" y="46" width="54" height="52" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="238" y="78" font-size="11" fill="#9099a8">A1</text>
  <rect x="284" y="46" width="54" height="52" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="300" y="78" font-size="11" fill="#9099a8">A2</text>
  <rect x="346" y="46" width="48" height="52" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="360" y="78" font-size="11" fill="#9099a8">A3</text>
  <rect x="222" y="108" width="54" height="52" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="238" y="140" font-size="11" fill="#fb863a">B1</text>
  <rect x="284" y="108" width="54" height="52" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="300" y="140" font-size="11" fill="#9099a8">B2</text>
  <rect x="346" y="108" width="48" height="52" rx="4" fill="none" stroke="#2d333d" stroke-dasharray="3 3"/><text x="360" y="140" font-size="11" fill="#9099a8">B3</text>
  <text x="222" y="190" font-size="9.5" fill="#6b7280">each slot: a Product + a count</text>
  <text x="222" y="208" font-size="9.5" fill="#6b7280">the whole grid: Inventory</text>

  <text x="34" y="60" font-size="11" fill="#fb863a">Inventory</text>
  <line x1="104" y1="56" x2="204" y2="72" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#vm-lead)"/>
  <text x="34" y="140" font-size="11" fill="#fb863a">Product</text>
  <line x1="96" y1="136" x2="216" y2="134" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#vm-lead)"/>

  <!-- display -->
  <rect x="420" y="46" width="92" height="42" rx="5" fill="#0a0b0e" stroke="#3a414c"/>
  <text x="430" y="64" font-size="9" fill="#5cc66f">CREDIT</text>
  <text x="430" y="80" font-size="12" fill="#e8e4dc">₹30</text>
  <text x="562" y="60" font-size="11" fill="#fb863a">Display</text>
  <line x1="596" y1="68" x2="518" y2="68" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#vm-lead)"/>

  <!-- coin slot -->
  <rect x="440" y="108" width="52" height="8" rx="4" fill="#0a0b0e" stroke="#3a414c"/>
  <circle cx="466" cy="140" r="13" fill="#14161a" stroke="#fb863a" stroke-width="1.2"/><text x="459" y="145" font-size="10" fill="#fb863a">₹20</text>
  <text x="562" y="126" font-size="11" fill="#fb863a">CoinSlot</text>
  <line x1="596" y1="134" x2="500" y2="118" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#vm-lead)"/>

  <!-- keypad -->
  <rect x="424" y="168" width="84" height="58" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="432" y="176" width="22" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="460" y="176" width="22" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="488" y="176" width="14" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="432" y="200" width="22" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="460" y="200" width="22" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="488" y="200" width="14" height="18" rx="3" fill="#1a1d22" stroke="#2d333d"/>

  <!-- tray -->
  <rect x="210" y="242" width="300" height="54" rx="6" fill="#0a0b0e" stroke="#3a414c" stroke-dasharray="4 4"/>
  <text x="228" y="274" font-size="18" fill="#e8e4dc">🥤</text>
  <text x="268" y="274" font-size="10" fill="#5cc66f">+ ₹5 change</text>
  <text x="562" y="274" font-size="11" fill="#fb863a">Tray</text>
  <line x1="596" y1="268" x2="518" y2="268" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#vm-lead)"/>
</svg>`,
        caption:
          "The object model falls out of the picture in about ninety seconds. The hard part is nowhere in this drawing — it is *when* each part is allowed to act.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "The machine sits in exactly one **state** at a time. Each state decides what `insertCoin`, `select` and `refund` are allowed to do, and which state comes next. Everything else — inventory, prices, change — is bookkeeping around that.",
      },
      { type: "h", text: "Why this problem exists in the interview set" },
      {
        type: "ul",
        items: [
          "**It punishes boolean soup.** Two flags give four combinations, three give eight, and half of them are nonsense that your code still has to survive. The interviewer wants to see whether you notice.",
          "**It has real money in it.** Every ordering mistake is a bug you can describe in rupees — dispense before you check change and the customer is out of pocket.",
          "**It is small enough to finish.** Unlike a parking lot, you can write the *whole* thing in 45 minutes, which means there is nowhere to hide.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- step 1 ----------
      { type: "h", text: "Step 1 · Clarify — 4 minutes" },
      {
        type: "ul",
        items: [
          "**Coins or notes, which denominations?** — *“₹5, ₹10, ₹20, ₹50.”* This decides the change algorithm.",
          "**Does it give change?** — Say yes. A machine without change is a much smaller problem, and the interviewer wants the change conversation.",
          "**What if it cannot make exact change?** — *“Refuse the sale and return the money.”* Getting this rule agreed early stops a bad design later.",
          "**Can you cancel?** — Yes, coin return at any time. That is the escape hatch every state needs.",
          "**Restocking, card payments, multi-buy?** — Out. Say so and move.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Do not accept “assume unlimited change”",
        text: "It sounds like a simplification and it deletes the most interesting half of the problem. Push back once — *“can I assume the machine has a finite coin bank? It makes the change logic real”* — and you have just given yourself something good to demo.",
      },

      // ---------- step 2 ----------
      { type: "h", text: "Step 2 · The state machine is the design" },
      {
        type: "p",
        text: "Before any class, draw the states and the arrows between them. Four states cover the whole machine. Every arrow is a method call, and every arrow that *does not exist* is a bug you no longer have to write a guard for.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A state diagram. A start dot leads to IDLE. insertCoin moves IDLE to HAS_MONEY. In HAS_MONEY, insertCoin loops back to itself, refund returns to IDLE, and a valid select moves to DISPENSING. DISPENSING moves automatically to CHANGE, and CHANGE returns to IDLE. Invalid selects in IDLE are rejected.">
  <defs>
    <marker id="vm-st" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#d8d3c9"/></marker>
    <marker id="vm-stx" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <circle cx="26" cy="96" r="7" fill="#d8d3c9"/>
  <line x1="34" y1="96" x2="66" y2="96" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#vm-st)"/>

  <rect x="72" y="74" width="112" height="44" rx="22" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="106" y="102" font-size="11.5" fill="#fb863a">IDLE</text>

  <text x="200" y="86" font-size="9.5" fill="#9099a8">insertCoin(c)</text>
  <line x1="186" y1="96" x2="304" y2="96" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#vm-st)"/>

  <rect x="310" y="74" width="130" height="44" rx="22" fill="#14161a" stroke="#3a414c"/>
  <text x="336" y="102" font-size="11.5" fill="#e8e4dc">HAS_MONEY</text>

  <!-- self loop: insert more -->
  <path d="M352,74 C344,40 406,40 398,74" fill="none" stroke="#9099a8" stroke-width="1.2" marker-end="url(#vm-st)"/>
  <text x="316" y="34" font-size="9.5" fill="#9099a8">insertCoin — stay, credit grows</text>

  <!-- refund back -->
  <path d="M340,118 C300,158 190,158 140,122" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#vm-st)"/>
  <text x="196" y="156" font-size="9.5" fill="#9099a8">refund() — the escape hatch</text>

  <text x="456" y="86" font-size="9.5" fill="#9099a8">select(code) ✓</text>
  <line x1="442" y1="96" x2="546" y2="96" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#vm-st)"/>

  <rect x="552" y="74" width="136" height="44" rx="22" fill="#14161a" stroke="#3a414c"/>
  <text x="574" y="102" font-size="11.5" fill="#e8e4dc">DISPENSING</text>

  <path d="M620,118 L620,190" fill="none" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#vm-st)"/>
  <text x="510" y="162" font-size="9.5" fill="#9099a8">item drops, price deducted</text>

  <rect x="552" y="196" width="136" height="44" rx="22" fill="#14161a" stroke="#3a414c"/>
  <text x="588" y="224" font-size="11.5" fill="#e8e4dc">CHANGE</text>

  <path d="M552,218 L200,218" fill="none" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#vm-st)"/>
  <line x1="196" y1="218" x2="128" y2="218" stroke="#d8d3c9" stroke-width="1.3"/>
  <line x1="128" y1="218" x2="128" y2="122" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#vm-st)"/>
  <text x="264" y="240" font-size="9.5" fill="#9099a8">coins returned, credit → ₹0</text>

  <!-- rejected -->
  <path d="M128,74 C128,44 200,44 200,64" fill="none" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#vm-stx)"/>
  <text x="130" y="278" font-size="10" fill="#f06868">✗ select() in IDLE, and any input during DISPENSING, are simply not arrows — nothing to guard</text>
</svg>`,
        caption:
          "Read it once and the guard conditions write themselves. There is **no arrow** out of `DISPENSING` for a button press, which is why a double-tap cannot give away two colas. Notation: [[state-diagrams]].",
      },
      {
        type: "p",
        text: "Now look at the same thing as a table. This is the artefact to actually write on the whiteboard, because it is what your code will look like:",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 244" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A table of state versus button. In IDLE, insertCoin goes to HAS_MONEY, select is ignored, refund is a no-op. In HAS_MONEY, insertCoin adds credit, select either dispenses or refuses, refund returns coins and goes to IDLE. In DISPENSING and CHANGE, every button is ignored.">
  <text x="176" y="26" font-size="10" fill="#9099a8">insertCoin()</text>
  <text x="356" y="26" font-size="10" fill="#9099a8">select(code)</text>
  <text x="536" y="26" font-size="10" fill="#9099a8">refund()</text>

  <text x="20" y="66" font-size="11" fill="#fb863a">IDLE</text>
  <rect x="150" y="42" width="166" height="36" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="164" y="66" font-size="10" fill="#5cc66f">→ HAS_MONEY</text>
  <rect x="330" y="42" width="166" height="36" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="344" y="66" font-size="10" fill="#f06868">✗ ignored</text>
  <rect x="510" y="42" width="166" height="36" rx="6" fill="#14161a" stroke="#2d333d"/><text x="524" y="66" font-size="10" fill="#9099a8">no-op</text>

  <text x="20" y="116" font-size="11" fill="#fb863a">HAS_MONEY</text>
  <rect x="150" y="92" width="166" height="36" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="164" y="116" font-size="10" fill="#5cc66f">credit += c, stay</text>
  <rect x="330" y="92" width="166" height="36" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="344" y="116" font-size="10" fill="#5cc66f">→ DISPENSING or refuse</text>
  <rect x="510" y="92" width="166" height="36" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="524" y="116" font-size="10" fill="#5cc66f">coins back → IDLE</text>

  <text x="20" y="166" font-size="11" fill="#9099a8">DISPENSING</text>
  <rect x="150" y="142" width="166" height="36" rx="6" fill="#14161a" stroke="#2d333d"/><text x="164" y="166" font-size="10" fill="#6b7280">ignored</text>
  <rect x="330" y="142" width="166" height="36" rx="6" fill="#14161a" stroke="#2d333d"/><text x="344" y="166" font-size="10" fill="#6b7280">ignored</text>
  <rect x="510" y="142" width="166" height="36" rx="6" fill="#14161a" stroke="#2d333d"/><text x="524" y="166" font-size="10" fill="#6b7280">ignored</text>

  <text x="20" y="216" font-size="11" fill="#9099a8">CHANGE</text>
  <rect x="150" y="192" width="166" height="36" rx="6" fill="#14161a" stroke="#2d333d"/><text x="164" y="216" font-size="10" fill="#6b7280">ignored</text>
  <rect x="330" y="192" width="166" height="36" rx="6" fill="#14161a" stroke="#2d333d"/><text x="344" y="216" font-size="10" fill="#6b7280">ignored</text>
  <rect x="510" y="192" width="166" height="36" rx="6" fill="#14161a" stroke="#2d333d"/><text x="524" y="216" font-size="10" fill="#6b7280">ignored</text>
</svg>`,
        caption:
          "Twelve cells, and eight of them are *“do nothing”*. That is the whole argument for modelling state explicitly: most of the truth table is boring, and boolean flags make you write it out by hand anyway.",
      },

      // ---------- step 3 ----------
      { type: "h", text: "Step 3 · Two ways to write it, and why one loses" },
      {
        type: "p",
        text: "Everybody's first instinct is flags. It works for about ten minutes.",
      },
      {
        type: "code",
        language: "java",
        filename: "the version that decays",
        code: `// what most people type first
private boolean hasMoney;
private boolean dispensing;
private boolean returningChange;

public void select(String code) {
    if (dispensing || returningChange) return;
    if (!hasMoney) { display("INSERT COIN"); return; }
    // ... and every new method repeats this same prelude,
    //     slightly differently, until two of them disagree
}`,
      },
      {
        type: "p",
        text: "Three booleans describe **eight** combinations, but the machine only has four legal states. The other four — *“dispensing and returning change at once”* — are nonsense your code must still survive, and nothing stops them being set.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 232" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Eight boolean combinations of hasMoney, dispensing and returningChange. Four of them map to legal states IDLE, HAS_MONEY, DISPENSING and CHANGE. The other four are marked impossible: dispensing while returning change, dispensing with no money, and so on. Beside them, a single state field with four values has no illegal combinations at all.">
  <text x="20" y="24" font-size="10" fill="#9099a8">3 BOOLEANS → 2³ = 8 COMBINATIONS</text>
  <text x="470" y="24" font-size="10" fill="#5cc66f">1 STATE FIELD → 4</text>

  <rect x="20" y="36" width="400" height="26" rx="5" fill="#14161a" stroke="rgba(92,198,111,0.5)"/><text x="34" y="54" font-size="10" fill="#5cc66f">F F F  →  IDLE ✓</text>
  <rect x="20" y="68" width="400" height="26" rx="5" fill="#14161a" stroke="rgba(92,198,111,0.5)"/><text x="34" y="86" font-size="10" fill="#5cc66f">T F F  →  HAS_MONEY ✓</text>
  <rect x="20" y="100" width="400" height="26" rx="5" fill="#14161a" stroke="rgba(92,198,111,0.5)"/><text x="34" y="118" font-size="10" fill="#5cc66f">T T F  →  DISPENSING ✓</text>
  <rect x="20" y="132" width="400" height="26" rx="5" fill="#14161a" stroke="rgba(92,198,111,0.5)"/><text x="34" y="150" font-size="10" fill="#5cc66f">T F T  →  CHANGE ✓</text>
  <rect x="20" y="164" width="400" height="26" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="34" y="182" font-size="10" fill="#f06868">T T T  →  dispensing AND returning change ?</text>
  <rect x="20" y="196" width="400" height="26" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="34" y="214" font-size="10" fill="#f06868">F T F · F F T · F T T  →  no money, yet busy ?</text>

  <rect x="450" y="36" width="230" height="122" rx="7" fill="#14161a" stroke="rgba(92,198,111,0.5)"/>
  <text x="466" y="60" font-size="10.5" fill="#5cc66f">state = IDLE</text>
  <text x="466" y="84" font-size="10.5" fill="#5cc66f">state = HAS_MONEY</text>
  <text x="466" y="108" font-size="10.5" fill="#5cc66f">state = DISPENSING</text>
  <text x="466" y="132" font-size="10.5" fill="#5cc66f">state = CHANGE</text>
  <text x="466" y="150" font-size="9.5" fill="#9099a8">— and nothing else is expressible</text>

  <text x="450" y="182" font-size="10" fill="#9099a8">4 illegal combinations you</text>
  <text x="450" y="198" font-size="10" fill="#9099a8">must guard against by hand</text>
  <text x="450" y="216" font-size="10.5" fill="#5cc66f">→ 0</text>
</svg>`,
        caption:
          "Half the truth table is garbage that can still be *set*. One `state` field deletes those rows from the universe rather than from your guards.",
      },
      {
        type: "p",
        text: "Now the version that holds up:",
      },
      {
        type: "code",
        language: "java",
        filename: "the version that survives the follow-ups",
        code: `interface State {
    default State insertCoin(Machine m, int coin) { return this; }   // ignored by default
    default State select(Machine m, String code)  { return this; }
    default State refund(Machine m)               { return this; }
}

class Idle implements State {
    public State insertCoin(Machine m, int coin) {
        m.addCredit(coin);
        return new HasMoney();          // the transition IS the return value
    }
    // select() and refund() are simply not overridden — that is the "ignored" cell
}`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "The move that makes it click",
        text: "**A state's method returns the next state.** No `setState` scattered through the code, no flag to forget. If a transition is not written, it does not exist — the empty cells in that table become *code you never wrote* instead of *guards you must remember*. This is the [[state]] pattern.",
      },
      {
        type: "callout",
        variant: "info",
        title: "How far to actually take this in 45 minutes",
        text: "A single `enum State` plus a `switch` in each method is **completely acceptable** and much faster to type. It gets you the same exhaustiveness. Mention that separate state classes are where you would go if states grew behaviour of their own, and the interviewer will nod. Do not build four classes for four two-line states unless you have time to spare — that is [[pattern-overuse-anti-patterns]] territory.",
      },

      // ---------- step 4 ----------
      { type: "h", text: "Step 4 · The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 380" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. VendingMachine holds an Inventory, a CoinBank and a current State. Inventory composes Slot, which references Product. The State interface is implemented by Idle, HasMoney, Dispensing and ReturningChange.">
  <defs>
    <marker id="vm-arw" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="vm-tri" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="12" refX="12" refY="6" orient="auto"><path d="M1,1 L12,6 L1,11 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <rect x="262" y="14" width="200" height="88" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="272" y="34" font-size="11.5" fill="#fb863a">VendingMachine</text>
  <line x1="262" y1="42" x2="462" y2="42" stroke="#2d333d"/>
  <text x="272" y="60" font-size="10" fill="#9099a8">- credit : int</text>
  <text x="272" y="78" font-size="10" fill="#e8e4dc">+ insertCoin(c) / select(code)</text>
  <text x="272" y="94" font-size="10" fill="#e8e4dc">+ refund()</text>

  <!-- inventory -->
  <path d="M300,102 L300,116 L292,124 L300,132 L308,124 L300,116" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="300" y1="132" x2="300" y2="160" stroke="#d8d3c9" stroke-width="1.3"/>
  <rect x="196" y="160" width="150" height="52" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="206" y="180" font-size="11.5" fill="#e8e4dc">Inventory</text>
  <line x1="196" y1="188" x2="346" y2="188" stroke="#2d333d"/>
  <text x="206" y="204" font-size="10" fill="#e8e4dc">+ take(code)</text>

  <path d="M270,212 L270,226 L262,234 L270,242 L278,234 L270,226" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="270" y1="242" x2="270" y2="266" stroke="#d8d3c9" stroke-width="1.3"/>
  <text x="278" y="258" font-size="9.5" fill="#9099a8">1..*</text>
  <rect x="196" y="266" width="150" height="52" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="206" y="286" font-size="11.5" fill="#e8e4dc">Slot</text>
  <line x1="196" y1="294" x2="346" y2="294" stroke="#2d333d"/>
  <text x="206" y="310" font-size="10" fill="#9099a8">- count : int</text>

  <rect x="26" y="266" width="146" height="52" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="36" y="286" font-size="11.5" fill="#e8e4dc">Product</text>
  <line x1="26" y1="294" x2="172" y2="294" stroke="#2d333d"/>
  <text x="36" y="310" font-size="10" fill="#9099a8">- price : int</text>
  <line x1="196" y1="292" x2="178" y2="292" stroke="#9099a8" stroke-width="1.2" marker-end="url(#vm-arw)"/>

  <!-- coin bank -->
  <line x1="424" y1="102" x2="424" y2="160" stroke="#9099a8" stroke-width="1.2" marker-end="url(#vm-arw)"/>
  <rect x="382" y="160" width="164" height="70" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="392" y="180" font-size="11.5" fill="#e8e4dc">CoinBank</text>
  <line x1="382" y1="188" x2="546" y2="188" stroke="#2d333d"/>
  <text x="392" y="204" font-size="10" fill="#e8e4dc">+ canMake(amt)</text>
  <text x="392" y="222" font-size="10" fill="#e8e4dc">+ withdraw(amt)</text>

  <!-- state -->
  <polyline points="462,58 580,58 580,160" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#vm-arw)"/>
  <text x="486" y="52" font-size="9.5" fill="#6b7280">current state</text>
  <rect x="566" y="160" width="140" height="56" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="578" y="180" font-size="9.5" fill="#6b7280">«interface»</text>
  <text x="578" y="196" font-size="11.5" fill="#5e9ff6">State</text>
  <text x="578" y="210" font-size="9.5" fill="#e8e4dc">returns the next State</text>

  <line x1="636" y1="246" x2="636" y2="220" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#vm-tri)"/>
  <rect x="566" y="246" width="140" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="578" y="264" font-size="10" fill="#e8e4dc">Idle</text>
  <rect x="566" y="278" width="140" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="578" y="296" font-size="10" fill="#e8e4dc">HasMoney</text>
  <rect x="566" y="310" width="140" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="578" y="328" font-size="10" fill="#e8e4dc">Dispensing</text>
  <rect x="566" y="342" width="140" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="578" y="360" font-size="10" fill="#e8e4dc">ReturningChange</text>
</svg>`,
        caption:
          "Note `Slot` sitting between `Inventory` and `Product`: a Coke is one `Product` with one price, but slot **A1** has *a count*. Merging them is the most common modelling slip here — restock A1 and you would be editing the drink itself.",
      },

      // ---------- change ----------
      { type: "h", text: "Making change — and the ordering trap underneath it" },
      {
        type: "p",
        text: "Owed ₹35, holding ₹20 ×1, ₹10 ×2, ₹5 ×3. Take the biggest coin you have that still fits, repeat. That is greedy, and it is correct for ordinary currency systems.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 210" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Greedy change for thirty-five rupees. Step one takes one twenty-rupee coin leaving fifteen. Step two takes one ten-rupee coin leaving five. Step three takes one five-rupee coin leaving zero. Below, a warning shows a currency of one, three and four where greedy gives six as four plus one plus one, three coins, while the optimal answer is three plus three, two coins.">
  <text x="20" y="26" font-size="10" fill="#9099a8">OWED ₹35 — take the biggest that fits, repeat</text>

  <rect x="20" y="38" width="200" height="40" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="63" font-size="10.5" fill="#e8e4dc">₹20 ×1</text><text x="120" y="63" font-size="10.5" fill="#9099a8">left ₹15</text>
  <text x="232" y="63" font-size="12" fill="#6b7280">→</text>
  <rect x="252" y="38" width="200" height="40" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="266" y="63" font-size="10.5" fill="#e8e4dc">₹10 ×1</text><text x="352" y="63" font-size="10.5" fill="#9099a8">left ₹5</text>
  <text x="464" y="63" font-size="12" fill="#6b7280">→</text>
  <rect x="484" y="38" width="196" height="40" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="498" y="63" font-size="10.5" fill="#5cc66f">₹5 ×1</text><text x="584" y="63" font-size="10.5" fill="#5cc66f">left ₹0 ✓</text>

  <line x1="20" y1="100" x2="680" y2="100" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="20" y="128" font-size="10" fill="#f06868">WHERE GREEDY BREAKS — a currency of 1, 3, 4 · make 6</text>
  <rect x="20" y="140" width="320" height="52" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="34" y="162" font-size="10.5" fill="#f06868">greedy: 4 + 1 + 1</text>
  <text x="34" y="182" font-size="10.5" fill="#9099a8">3 coins</text>
  <rect x="360" y="140" width="320" height="52" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="374" y="162" font-size="10.5" fill="#5cc66f">optimal: 3 + 3</text>
  <text x="374" y="182" font-size="10.5" fill="#9099a8">2 coins — needs DP</text>
</svg>`,
        caption:
          "Say this out loud and you have banked a free point: greedy is right for ₹/$/€ denominations, but not for *every* set. Real coin systems are **canonical**, which is exactly what makes greedy safe here.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The bug this problem is really testing",
        text: "**Check that you can make the change before you dispense the item.** Dispense first and then discover the coin bank is empty, and the customer has a ₹15 candy and you are holding their ₹50 with no way to give ₹35 back. Order of operations *is* the design. Press **💰 Empty the coin bank** in the prototype and try it — the item never leaves the shelf.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 214" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two orderings. The wrong one dispenses the item, then tries to make change, fails, and the customer is out of pocket. The right one checks change can be made, then dispenses, then returns the change, all succeeding.">
  <text x="20" y="24" font-size="10.5" fill="#f06868">✗ WRONG ORDER</text>
  <rect x="20" y="34" width="150" height="34" rx="6" fill="#14161a" stroke="#2d333d"/><text x="34" y="56" font-size="10" fill="#e8e4dc">take payment</text>
  <text x="180" y="56" font-size="11" fill="#6b7280">→</text>
  <rect x="200" y="34" width="150" height="34" rx="6" fill="#14161a" stroke="#2d333d"/><text x="214" y="56" font-size="10" fill="#e8e4dc">drop the item</text>
  <text x="360" y="56" font-size="11" fill="#6b7280">→</text>
  <rect x="380" y="34" width="150" height="34" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="394" y="56" font-size="10" fill="#f06868">make change… ✗</text>
  <text x="546" y="56" font-size="10.5" fill="#f06868">customer robbed</text>

  <line x1="20" y1="94" x2="680" y2="94" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="20" y="124" font-size="10.5" fill="#5cc66f">✓ RIGHT ORDER</text>
  <rect x="20" y="134" width="150" height="34" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="34" y="156" font-size="10" fill="#5cc66f">can I make change?</text>
  <text x="180" y="156" font-size="11" fill="#6b7280">→</text>
  <rect x="200" y="134" width="150" height="34" rx="6" fill="#14161a" stroke="#2d333d"/><text x="214" y="156" font-size="10" fill="#e8e4dc">drop the item</text>
  <text x="360" y="156" font-size="11" fill="#6b7280">→</text>
  <rect x="380" y="134" width="150" height="34" rx="6" fill="#14161a" stroke="#2d333d"/><text x="394" y="156" font-size="10" fill="#e8e4dc">return change</text>
  <text x="546" y="156" font-size="10.5" fill="#5cc66f">both or neither</text>
  <text x="20" y="198" font-size="9.5" fill="#9099a8">the check is cheap and reversible; the dispense is not — so the irreversible step always goes last</text>
</svg>`,
        caption:
          "A rule that generalises well past vending machines: **do every check that can fail before the first action you cannot undo.**",
      },

      // ---------- flow ----------
      { type: "h", text: "One purchase, message by message" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 320" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram. The customer inserts a coin into the VendingMachine, which delegates to the current State and becomes HasMoney. The customer selects A1; the machine asks Inventory whether it is in stock and CoinBank whether change can be made, then dispenses the item and returns five rupees change.">
  <defs>
    <marker id="vm-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="vm-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="32" y="32" font-size="10.5" fill="#e8e4dc">Customer</text>
  <rect x="172" y="12" width="118" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="184" y="32" font-size="10.5" fill="#fb863a">VendingMachine</text>
  <rect x="344" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="368" y="32" font-size="10.5" fill="#5e9ff6">«state»</text>
  <rect x="496" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="514" y="32" font-size="10.5" fill="#e8e4dc">Inventory</text>
  <rect x="606" y="12" width="100" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="622" y="32" font-size="10.5" fill="#e8e4dc">CoinBank</text>

  <line x1="66" y1="42" x2="66" y2="302" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="231" y1="42" x2="231" y2="302" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="396" y1="42" x2="396" y2="302" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="548" y1="42" x2="548" y2="302" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="656" y1="42" x2="656" y2="302" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="74" y="68" font-size="10" fill="#e8e4dc">insertCoin(20)</text>
  <line x1="66" y1="76" x2="227" y2="76" stroke="#fb863a" stroke-width="1.3" marker-end="url(#vm-call)"/>
  <text x="240" y="100" font-size="10" fill="#e8e4dc">insertCoin(m, 20)</text>
  <line x1="231" y1="108" x2="392" y2="108" stroke="#fb863a" stroke-width="1.3" marker-end="url(#vm-call)"/>
  <text x="254" y="132" font-size="10" fill="#5cc66f">new HasMoney()</text>
  <line x1="396" y1="140" x2="235" y2="140" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#vm-ret)"/>

  <text x="74" y="168" font-size="10" fill="#e8e4dc">select(“A1”)</text>
  <line x1="66" y1="176" x2="227" y2="176" stroke="#fb863a" stroke-width="1.3" marker-end="url(#vm-call)"/>

  <text x="240" y="202" font-size="10" fill="#e8e4dc">inStock(“A1”) ?</text>
  <line x1="231" y1="210" x2="544" y2="210" stroke="#fb863a" stroke-width="1.3" marker-end="url(#vm-call)"/>

  <text x="240" y="238" font-size="10" fill="#e8e4dc">canMake(₹5) ?</text>
  <line x1="231" y1="246" x2="652" y2="246" stroke="#fb863a" stroke-width="1.3" marker-end="url(#vm-call)"/>
  <text x="470" y="268" font-size="10" fill="#5cc66f">yes — only now is it safe to dispense</text>

  <text x="74" y="292" font-size="10" fill="#5cc66f">🥤 + ₹5</text>
  <line x1="231" y1="300" x2="70" y2="300" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#vm-ret)"/>
</svg>`,
        caption:
          "The machine asks **both** questions before it touches anything. Notation: [[sequence-diagrams]].",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“Add card payments.”** → a `PaymentMethod` interface with `Coins` and `Card` implementations. The state machine does not change: a card swipe is just another way to reach `HAS_MONEY`.",
          "**“Two people press buttons at once.”** → in a real machine there is one physical front panel, so serialising at the machine is genuinely correct here — unlike a parking lot with many gates. Say *why* it is different; that contrast is the point.",
          "**“Restocking and a maintenance mode.”** → a fifth state, `SERVICE`, that only a `MaintenanceKey` can enter. Notice how cheap a new state is once states are real objects.",
          "**“Track sales for reporting.”** → the machine publishes an event on each sale and a `SalesLog` listens. That is [[observer]], and it keeps reporting out of the purchase path entirely.",
          "**“A product has a discount on Tuesdays.”** → pricing becomes a strategy, exactly as in [[parking-lot]]. Same trick, different problem.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**Boolean soup.** Three flags, eight combinations, and the interviewer asking *“what happens if `dispensing` and `returningChange` are both true?”*",
          "**Dispensing before verifying change.** The single most-caught bug in this problem.",
          "**Merging `Product` and `Slot`.** Then “restock A1” means mutating the definition of Coke.",
          "**Money as a `double`.** ₹0.1 + ₹0.2 is a bad look on a machine that handles cash. Integers, always.",
          "**Four state classes for four one-line states**, with no working `main()` at the end. The pattern is not the deliverable; the machine is.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Get refused on purpose",
        body:
          "Before doing anything else, tap **A1 Cola**. Nothing happens — and the explain line tells you why: you are in **IDLE**, and `select()` is not an arrow out of IDLE. That is not a validation check, it is a missing transition. Notice the state pill never moved.",
      },
      {
        title: "Walk one full loop",
        body:
          "Insert **₹20** then **₹10** (watch affordable slots turn green the moment you have credit), then buy **A1 Cola ₹25**. Follow the pill strip: IDLE → HAS_MONEY → DISPENSING → CHANGE → IDLE. The cola drops, ₹5 comes back, and stock ticks from ×2 to ×1.",
      },
      {
        title: "Find the three refusals",
        body:
          "Each is a different failure and a different message. Insert **₹5** and try the ₹35 **B2 Cookie** — *insufficient credit*, and your coins stay put. Try **B3 Gum** — *sold out*, checked before money moves. Then hit **↩ Coin return** with ₹0 credit — a legal no-op, not an error.",
      },
      {
        title: "Break the coin bank",
        body:
          "Press **💰 Empty the coin bank**, insert **₹50**, and buy the **₹15 A3 Candy**. The machine owes ₹35 and cannot build it, so it refuses — and critically, **the tray stays empty**. Now imagine the same code with the dispense one line earlier.",
      },
      {
        title: "Watch the bank drain you into that corner",
        body:
          "Reset, then buy several cheap items with large coins. Each sale takes small coins *out* of the bank. Eventually a perfectly ordinary purchase gets refused — the failure builds up over time rather than arriving all at once, which is exactly why it is easy to miss in review.",
      },
      {
        title: "Write it from memory",
        body:
          "Blank file, in this order: `enum State` → `Product` and `Slot` → `Inventory.take()` → `CoinBank.canMake()`/`withdraw()` → `insertCoin`/`select`/`refund` → `main()`. Then add a `SERVICE` state for restocking. If adding it forces you to touch `select()`, your states are not carrying their own behaviour yet.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "VendingMachine.java",
        code: `import java.util.*;

enum Coin {
    FIVE(5), TEN(10), TWENTY(20), FIFTY(50);
    final int value;
    Coin(int v) { this.value = v; }
    static Coin[] descending() {
        Coin[] c = values().clone();
        Arrays.sort(c, Comparator.comparingInt((Coin x) -> x.value).reversed());
        return c;
    }
}

record Product(String name, int price) {}          // price in whole rupees — never a double

class Slot {
    private final String code;
    private final Product product;
    private int count;
    Slot(String code, Product product, int count) { this.code = code; this.product = product; this.count = count; }
    String code()      { return code; }
    Product product()  { return product; }
    boolean inStock()  { return count > 0; }
    void take()        { if (count <= 0) throw new IllegalStateException("empty slot " + code); count--; }
    void restock(int n){ count += n; }
}

class Inventory {
    private final Map<String, Slot> slots = new LinkedHashMap<>();
    void add(Slot s)          { slots.put(s.code(), s); }
    Optional<Slot> find(String code) { return Optional.ofNullable(slots.get(code)); }
}

class CoinBank {
    private final Map<Coin, Integer> held = new EnumMap<>(Coin.class);
    CoinBank() { for (Coin c : Coin.values()) held.put(c, 0); }

    void deposit(Coin c) { held.merge(c, 1, Integer::sum); }

    /** Greedy — correct for canonical currency systems like ₹/$/€. */
    Optional<Map<Coin, Integer>> plan(int amount) {
        Map<Coin, Integer> give = new EnumMap<>(Coin.class);
        int left = amount;
        for (Coin c : Coin.descending()) {
            int n = Math.min(left / c.value, held.get(c));
            if (n > 0) { give.put(c, n); left -= n * c.value; }
        }
        return left == 0 ? Optional.of(give) : Optional.empty();   // empty == cannot make exact change
    }

    void withdraw(Map<Coin, Integer> plan) {
        plan.forEach((c, n) -> held.merge(c, -n, Integer::sum));
    }
}

// ---------- states: each method RETURNS the next state ----------
interface State {
    default State insertCoin(VendingMachine m, Coin c) { return this; }   // ignored unless overridden
    default State select(VendingMachine m, String code) { return this; }
    default State refund(VendingMachine m)              { return this; }
    String name();
}

class Idle implements State {
    public String name() { return "IDLE"; }
    public State insertCoin(VendingMachine m, Coin c) {
        m.acceptCoin(c);
        return new HasMoney();
    }
    // select() and refund() deliberately NOT overridden — those cells are "do nothing"
}

class HasMoney implements State {
    public String name() { return "HAS_MONEY"; }

    public State insertCoin(VendingMachine m, Coin c) {
        m.acceptCoin(c);
        return this;                                       // stay here, credit grows
    }

    public State select(VendingMachine m, String code) {
        Slot slot = m.inventory().find(code).orElse(null);
        if (slot == null)        { m.display("INVALID CODE");  return this; }
        if (!slot.inStock())     { m.display("SOLD OUT");      return this; }

        int price = slot.product().price();
        if (m.credit() < price)  { m.display("NEED ₹" + (price - m.credit()) + " MORE"); return this; }

        int due = m.credit() - price;
        // ---- every check that can fail happens BEFORE the first irreversible step ----
        Optional<Map<Coin, Integer>> plan = due == 0 ? Optional.of(Map.of()) : m.bank().plan(due);
        if (plan.isEmpty())      { m.display("EXACT CHANGE ONLY"); return this; }

        slot.take();                                       // irreversible from here on
        m.deductCredit(price);
        m.dispense(slot.product());
        m.bank().withdraw(plan.get());
        m.returnCoins(plan.get());
        m.clearCredit();
        return new Idle();
    }

    public State refund(VendingMachine m) {
        m.bank().plan(m.credit()).ifPresent(p -> { m.bank().withdraw(p); m.returnCoins(p); });
        m.clearCredit();
        return new Idle();
    }
}

class VendingMachine {
    private final Inventory inventory = new Inventory();
    private final CoinBank bank = new CoinBank();
    private State state = new Idle();
    private int credit = 0;

    Inventory inventory() { return inventory; }
    CoinBank bank()       { return bank; }
    int credit()          { return credit; }
    String state()        { return state.name(); }

    void acceptCoin(Coin c)  { credit += c.value; bank.deposit(c); }
    void deductCredit(int n)  { credit -= n; }
    void clearCredit()        { credit = 0; }
    void display(String msg)  { System.out.println("   [display] " + msg); }
    void dispense(Product p)  { System.out.println("   [tray] " + p.name()); }
    void returnCoins(Map<Coin, Integer> coins) {
        if (!coins.isEmpty()) System.out.println("   [tray] change " + coins);
    }

    // the only three inputs — each just forwards to the current state
    void insertCoin(Coin c)   { state = state.insertCoin(this, c); }
    void select(String code)  { state = state.select(this, code); }
    void refund()             { state = state.refund(this); }
}

public class Main {
    public static void main(String[] args) {
        VendingMachine m = new VendingMachine();
        m.inventory().add(new Slot("A1", new Product("Cola", 25), 2));
        m.inventory().add(new Slot("A3", new Product("Candy", 15), 1));
        m.inventory().add(new Slot("B3", new Product("Gum", 5), 0));

        System.out.println("select before paying, state=" + m.state());
        m.select("A1");                                    // ignored — no arrow out of IDLE
        System.out.println("still " + m.state());

        m.insertCoin(Coin.TWENTY);
        m.insertCoin(Coin.TEN);
        System.out.println("credit ₹" + m.credit() + ", state=" + m.state());
        m.select("A1");                                    // cola + ₹5 change
        System.out.println("after sale, state=" + m.state() + ", credit ₹" + m.credit());

        m.insertCoin(Coin.FIFTY);
        m.select("A3");                                    // ₹35 change — bank may not have it
        m.refund();
        System.out.println("final state=" + m.state());
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "vending_machine.py",
        code: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import IntEnum
from typing import Optional


class Coin(IntEnum):
    FIVE = 5; TEN = 10; TWENTY = 20; FIFTY = 50


@dataclass(frozen=True)
class Product:
    name: str
    price: int                       # whole rupees — never a float


class Slot:
    def __init__(self, code: str, product: Product, count: int):
        self.code, self.product, self.count = code, product, count

    @property
    def in_stock(self) -> bool:
        return self.count > 0

    def take(self) -> None:
        if self.count <= 0:
            raise ValueError(f"empty slot {self.code}")
        self.count -= 1


class Inventory:
    def __init__(self):
        self._slots: dict[str, Slot] = {}

    def add(self, slot: Slot) -> None:
        self._slots[slot.code] = slot

    def find(self, code: str) -> Optional[Slot]:
        return self._slots.get(code)


class CoinBank:
    def __init__(self):
        self._held: dict[Coin, int] = {c: 0 for c in Coin}

    def deposit(self, coin: Coin) -> None:
        self._held[coin] += 1

    def plan(self, amount: int) -> Optional[dict[Coin, int]]:
        """Greedy — correct for canonical currencies. None == cannot make exact change."""
        give, left = {}, amount
        for coin in sorted(Coin, reverse=True):
            n = min(left // coin, self._held[coin])
            if n:
                give[coin] = n
                left -= n * coin
        return give if left == 0 else None

    def withdraw(self, plan: dict[Coin, int]) -> None:
        for coin, n in plan.items():
            self._held[coin] -= n


# ---------- states: each handler RETURNS the next state ----------
class State(ABC):
    name = "?"
    def insert_coin(self, m, coin): return self      # ignored unless overridden
    def select(self, m, code): return self
    def refund(self, m): return self


class Idle(State):
    name = "IDLE"
    def insert_coin(self, m, coin):
        m.accept_coin(coin)
        return HasMoney()
    # select() and refund() deliberately not overridden — those cells do nothing


class HasMoney(State):
    name = "HAS_MONEY"

    def insert_coin(self, m, coin):
        m.accept_coin(coin)
        return self                                  # stay, credit grows

    def select(self, m, code):
        slot = m.inventory.find(code)
        if slot is None:
            m.display("INVALID CODE"); return self
        if not slot.in_stock:
            m.display("SOLD OUT"); return self
        if m.credit < slot.product.price:
            m.display(f"NEED ₹{slot.product.price - m.credit} MORE"); return self

        due = m.credit - slot.product.price
        # every check that can fail runs BEFORE the first irreversible step
        plan = {} if due == 0 else m.bank.plan(due)
        if plan is None:
            m.display("EXACT CHANGE ONLY"); return self

        slot.take()                                  # irreversible from here on
        m.credit -= slot.product.price
        m.dispense(slot.product)
        m.bank.withdraw(plan)
        m.return_coins(plan)
        m.credit = 0
        return Idle()

    def refund(self, m):
        plan = m.bank.plan(m.credit)
        if plan:
            m.bank.withdraw(plan)
            m.return_coins(plan)
        m.credit = 0
        return Idle()


class VendingMachine:
    def __init__(self):
        self.inventory = Inventory()
        self.bank = CoinBank()
        self.credit = 0
        self._state: State = Idle()

    @property
    def state(self) -> str:
        return self._state.name

    def accept_coin(self, coin: Coin) -> None:
        self.credit += coin
        self.bank.deposit(coin)

    def display(self, msg): print("   [display]", msg)
    def dispense(self, product): print("   [tray]", product.name)
    def return_coins(self, plan):
        if plan:
            print("   [tray] change", {int(c): n for c, n in plan.items()})

    # the only three inputs — each forwards to the current state
    def insert_coin(self, coin): self._state = self._state.insert_coin(self, coin)
    def select(self, code):      self._state = self._state.select(self, code)
    def refund(self):            self._state = self._state.refund(self)


if __name__ == "__main__":
    m = VendingMachine()
    m.inventory.add(Slot("A1", Product("Cola", 25), 2))
    m.inventory.add(Slot("A3", Product("Candy", 15), 1))
    m.inventory.add(Slot("B3", Product("Gum", 5), 0))

    print("select before paying, state =", m.state)
    m.select("A1")                                   # ignored — no arrow out of IDLE
    print("still", m.state)

    m.insert_coin(Coin.TWENTY)
    m.insert_coin(Coin.TEN)
    print(f"credit ₹{m.credit}, state = {m.state}")
    m.select("A1")                                   # cola + ₹5 change
    print(f"after sale, state = {m.state}, credit ₹{m.credit}")

    m.insert_coin(Coin.FIFTY)
    m.select("A3")                                   # ₹35 change — bank may not have it
    m.refund()
    print("final state =", m.state)`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "vending_machine.cpp",
        code: `#include <algorithm>
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <string>
#include <vector>

enum class Coin { Five = 5, Ten = 10, Twenty = 20, Fifty = 50 };
static const std::vector<Coin> COINS_DESC = {Coin::Fifty, Coin::Twenty, Coin::Ten, Coin::Five};
static int value(Coin c) { return static_cast<int>(c); }

struct Product {
    std::string name;
    int price;                                    // whole rupees — never a double
};

class Slot {
public:
    Slot(std::string code, Product p, int count)
        : code_(std::move(code)), product_(std::move(p)), count_(count) {}
    const std::string& code() const { return code_; }
    const Product& product() const { return product_; }
    bool inStock() const { return count_ > 0; }
    void take() { if (count_ <= 0) throw std::runtime_error("empty slot " + code_); --count_; }
private:
    std::string code_;
    Product product_;
    int count_;
};

class Inventory {
public:
    void add(Slot s) { slots_.emplace(s.code(), std::move(s)); }
    Slot* find(const std::string& code) {
        auto it = slots_.find(code);
        return it == slots_.end() ? nullptr : &it->second;
    }
private:
    std::map<std::string, Slot> slots_;
};

using ChangePlan = std::map<int, int>;            // coin value -> count

class CoinBank {
public:
    CoinBank() { for (Coin c : COINS_DESC) held_[value(c)] = 0; }
    void deposit(Coin c) { held_[value(c)]++; }

    // Greedy — correct for canonical currencies. nullopt == cannot make exact change.
    std::optional<ChangePlan> plan(int amount) const {
        ChangePlan give;
        int left = amount;
        for (Coin c : COINS_DESC) {
            int v = value(c);
            int n = std::min(left / v, held_.at(v));
            if (n > 0) { give[v] = n; left -= n * v; }
        }
        return left == 0 ? std::optional<ChangePlan>{give} : std::nullopt;
    }

    void withdraw(const ChangePlan& p) { for (auto& [v, n] : p) held_[v] -= n; }

private:
    std::map<int, int> held_;
};

class VendingMachine;

// ---------- states: each handler RETURNS the next state ----------
class State {
public:
    virtual ~State() = default;
    virtual const char* name() const = 0;
    virtual std::unique_ptr<State> insertCoin(VendingMachine&, Coin) = 0;
    virtual std::unique_ptr<State> select(VendingMachine&, const std::string&) = 0;
    virtual std::unique_ptr<State> refund(VendingMachine&) = 0;
};

class VendingMachine {
public:
    VendingMachine();
    Inventory& inventory() { return inv_; }
    CoinBank& bank() { return bank_; }
    int credit() const { return credit_; }
    const char* state() const { return state_->name(); }

    void acceptCoin(Coin c) { credit_ += value(c); bank_.deposit(c); }
    void setCredit(int n) { credit_ = n; }
    void display(const std::string& m) const { std::cout << "   [display] " << m << "\\n"; }
    void dispense(const Product& p) const { std::cout << "   [tray] " << p.name << "\\n"; }
    void returnCoins(const ChangePlan& p) const {
        if (p.empty()) return;
        std::cout << "   [tray] change";
        for (auto& [v, n] : p) std::cout << " " << v << "x" << n;
        std::cout << "\\n";
    }

    void insertCoin(Coin c)              { state_ = state_->insertCoin(*this, c); }
    void select(const std::string& code) { state_ = state_->select(*this, code); }
    void refund()                        { state_ = state_->refund(*this); }

private:
    Inventory inv_;
    CoinBank bank_;
    std::unique_ptr<State> state_;
    int credit_ = 0;
};

class HasMoney : public State {
public:
    const char* name() const override { return "HAS_MONEY"; }

    std::unique_ptr<State> insertCoin(VendingMachine& m, Coin c) override {
        m.acceptCoin(c);
        return std::make_unique<HasMoney>();       // stay, credit grows
    }

    std::unique_ptr<State> select(VendingMachine& m, const std::string& code) override;
    std::unique_ptr<State> refund(VendingMachine& m) override;
};

class Idle : public State {
public:
    const char* name() const override { return "IDLE"; }
    std::unique_ptr<State> insertCoin(VendingMachine& m, Coin c) override {
        m.acceptCoin(c);
        return std::make_unique<HasMoney>();
    }
    // select and refund do nothing in IDLE — that is the "ignored" cell
    std::unique_ptr<State> select(VendingMachine&, const std::string&) override {
        return std::make_unique<Idle>();
    }
    std::unique_ptr<State> refund(VendingMachine&) override {
        return std::make_unique<Idle>();
    }
};

VendingMachine::VendingMachine() : state_(std::make_unique<Idle>()) {}

std::unique_ptr<State> HasMoney::select(VendingMachine& m, const std::string& code) {
    Slot* slot = m.inventory().find(code);
    if (!slot)            { m.display("INVALID CODE"); return std::make_unique<HasMoney>(); }
    if (!slot->inStock()) { m.display("SOLD OUT");     return std::make_unique<HasMoney>(); }

    int price = slot->product().price;
    if (m.credit() < price) {
        m.display("NEED MORE CREDIT");
        return std::make_unique<HasMoney>();
    }

    int due = m.credit() - price;
    // every check that can fail runs BEFORE the first irreversible step
    auto plan = due == 0 ? std::optional<ChangePlan>{ChangePlan{}} : m.bank().plan(due);
    if (!plan) { m.display("EXACT CHANGE ONLY"); return std::make_unique<HasMoney>(); }

    slot->take();                                  // irreversible from here on
    m.setCredit(m.credit() - price);
    m.dispense(slot->product());
    m.bank().withdraw(*plan);
    m.returnCoins(*plan);
    m.setCredit(0);
    return std::make_unique<Idle>();
}

std::unique_ptr<State> HasMoney::refund(VendingMachine& m) {
    if (auto plan = m.bank().plan(m.credit())) {
        m.bank().withdraw(*plan);
        m.returnCoins(*plan);
    }
    m.setCredit(0);
    return std::make_unique<Idle>();
}

int main() {
    VendingMachine m;
    m.inventory().add(Slot("A1", {"Cola", 25}, 2));
    m.inventory().add(Slot("A3", {"Candy", 15}, 1));
    m.inventory().add(Slot("B3", {"Gum", 5}, 0));

    std::cout << "select before paying, state=" << m.state() << "\\n";
    m.select("A1");                                // ignored — no arrow out of IDLE
    std::cout << "still " << m.state() << "\\n";

    m.insertCoin(Coin::Twenty);
    m.insertCoin(Coin::Ten);
    std::cout << "credit " << m.credit() << ", state=" << m.state() << "\\n";
    m.select("A1");                                // cola + 5 change
    std::cout << "after sale, state=" << m.state() << ", credit " << m.credit() << "\\n";

    m.insertCoin(Coin::Fifty);
    m.select("A3");                                // 35 change — bank may not have it
    m.refund();
    std::cout << "final state=" << m.state() << "\\n";
}`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "vending-machine.ts",
        code: `const COINS = [50, 20, 10, 5] as const;          // descending, for greedy change
type Coin = (typeof COINS)[number];

interface Product {
  readonly name: string;
  readonly price: number;                        // whole rupees — never a float
}

class Slot {
  constructor(
    readonly code: string,
    readonly product: Product,
    private count: number,
  ) {}
  get inStock(): boolean { return this.count > 0; }
  take(): void {
    if (this.count <= 0) throw new Error(\`empty slot \${this.code}\`);
    this.count--;
  }
}

class Inventory {
  private readonly slots = new Map<string, Slot>();
  add(slot: Slot) { this.slots.set(slot.code, slot); }
  find(code: string): Slot | undefined { return this.slots.get(code); }
}

type ChangePlan = Map<Coin, number>;

class CoinBank {
  private readonly held = new Map<Coin, number>(COINS.map((c) => [c, 0]));

  deposit(coin: Coin) { this.held.set(coin, (this.held.get(coin) ?? 0) + 1); }

  /** Greedy — correct for canonical currencies. null == cannot make exact change. */
  plan(amount: number): ChangePlan | null {
    const give: ChangePlan = new Map();
    let left = amount;
    for (const coin of COINS) {
      const n = Math.min(Math.floor(left / coin), this.held.get(coin) ?? 0);
      if (n > 0) { give.set(coin, n); left -= n * coin; }
    }
    return left === 0 ? give : null;
  }

  withdraw(plan: ChangePlan) {
    for (const [coin, n] of plan) this.held.set(coin, (this.held.get(coin) ?? 0) - n);
  }
}

// ---------- states: each handler RETURNS the next state ----------
interface State {
  readonly name: string;
  insertCoin(m: VendingMachine, coin: Coin): State;
  select(m: VendingMachine, code: string): State;
  refund(m: VendingMachine): State;
}

class Idle implements State {
  readonly name = "IDLE";
  insertCoin(m: VendingMachine, coin: Coin): State {
    m.acceptCoin(coin);
    return new HasMoney();
  }
  select(): State { return this; }               // no arrow out of IDLE for select
  refund(): State { return this; }
}

class HasMoney implements State {
  readonly name = "HAS_MONEY";

  insertCoin(m: VendingMachine, coin: Coin): State {
    m.acceptCoin(coin);
    return this;                                 // stay, credit grows
  }

  select(m: VendingMachine, code: string): State {
    const slot = m.inventory.find(code);
    if (!slot) { m.display("INVALID CODE"); return this; }
    if (!slot.inStock) { m.display("SOLD OUT"); return this; }
    if (m.credit < slot.product.price) {
      m.display(\`NEED ₹\${slot.product.price - m.credit} MORE\`);
      return this;
    }

    const due = m.credit - slot.product.price;
    // every check that can fail runs BEFORE the first irreversible step
    const plan = due === 0 ? new Map<Coin, number>() : m.bank.plan(due);
    if (plan === null) { m.display("EXACT CHANGE ONLY"); return this; }

    slot.take();                                 // irreversible from here on
    m.credit -= slot.product.price;
    m.dispense(slot.product);
    m.bank.withdraw(plan);
    m.returnCoins(plan);
    m.credit = 0;
    return new Idle();
  }

  refund(m: VendingMachine): State {
    const plan = m.bank.plan(m.credit);
    if (plan) { m.bank.withdraw(plan); m.returnCoins(plan); }
    m.credit = 0;
    return new Idle();
  }
}

class VendingMachine {
  readonly inventory = new Inventory();
  readonly bank = new CoinBank();
  credit = 0;
  private state: State = new Idle();

  get stateName(): string { return this.state.name; }

  acceptCoin(coin: Coin) { this.credit += coin; this.bank.deposit(coin); }
  display(msg: string) { console.log("   [display]", msg); }
  dispense(p: Product) { console.log("   [tray]", p.name); }
  returnCoins(plan: ChangePlan) {
    if (plan.size) console.log("   [tray] change", [...plan].map(([c, n]) => \`₹\${c}x\${n}\`).join(" "));
  }

  // the only three inputs — each forwards to the current state
  insertCoin(coin: Coin) { this.state = this.state.insertCoin(this, coin); }
  select(code: string) { this.state = this.state.select(this, code); }
  refund() { this.state = this.state.refund(this); }
}

const m = new VendingMachine();
m.inventory.add(new Slot("A1", { name: "Cola", price: 25 }, 2));
m.inventory.add(new Slot("A3", { name: "Candy", price: 15 }, 1));
m.inventory.add(new Slot("B3", { name: "Gum", price: 5 }, 0));

console.log("select before paying, state =", m.stateName);
m.select("A1");                                  // ignored — no arrow out of IDLE
console.log("still", m.stateName);

m.insertCoin(20);
m.insertCoin(10);
console.log(\`credit ₹\${m.credit}, state = \${m.stateName}\`);
m.select("A1");                                  // cola + ₹5 change
console.log(\`after sale, state = \${m.stateName}, credit ₹\${m.credit}\`);

m.insertCoin(50);
m.select("A3");                                  // ₹35 change — bank may not have it
m.refund();
console.log("final state =", m.stateName);`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "When an explicit state machine earns its keep" },
      {
        type: "p",
        text: "Not every class needs states. The pattern pays for itself when three things are true at once — and a vending machine hits all three, which is exactly why it is the teaching example.",
      },
      {
        type: "ul",
        items: [
          "**The same input means different things at different times.** `select()` is a purchase, an error, or a no-op depending only on where you are.",
          "**Illegal combinations are possible with flags.** If your booleans can describe a situation the real machine cannot be in, the flags are wrong.",
          "**New states arrive later.** `SERVICE`, `OUT_OF_ORDER`, `CARD_PENDING` — each is a new class, not a new branch in five existing methods.",
        ],
      },
      {
        type: "p",
        text: "Where it does *not* pay: two states and one transition. A boolean is fine, and dressing it up as a state machine is ceremony. Say which side of that line you are on and why — that judgement is more impressive than the pattern.",
      },
      { type: "h", text: "Interview variants of this same problem" },
      {
        type: "ul",
        items: [
          "**Coffee machine** — the same skeleton, but the scarce resource is *shared ingredients* rather than discrete slots, which turns it into a concurrency question. See [[coffee-machine]].",
          "**ATM** — a state machine too, but with authentication in front and two resources that must stay consistent. See [[atm]].",
          "**Elevator** — states plus scheduling. Much harder, and usually reserved for the intermediate tier.",
          "**Traffic light / turnstile** — the toy versions of this. If you can do the vending machine, you can do those in ten minutes.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Draw the states and arrows before you write a class.** The arrows you draw become methods; the arrows you *don't* draw become bugs you never have to write a guard for.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Illegal combinations become unrepresentable — there is no way to be dispensing and refunding at once.",
        "Each state's rules live in one place, so “what happens if I press this now?” has exactly one answer to read.",
        "Adding SERVICE or CARD_PENDING is a new class, not a new branch in every existing method.",
        "Checking change before dispensing falls naturally out of writing the transition as one method with a single exit.",
        "Small enough to finish completely in 45 minutes, with a demo that shows both the happy path and three refusals.",
      ],
      cons: [
        "Four classes for four short states is more ceremony than an enum plus a switch, which is often the better call under time pressure.",
        "Transitions are spread across state classes, so the whole machine is no longer visible on one screen — the diagram becomes required documentation.",
        "Every state needs access to machine internals (credit, bank, inventory), which pushes you towards a wide package-private surface.",
        "Greedy change is only correct for canonical denominations; a currency with a 1/3/4 system silently returns a worse answer.",
        "The model assumes a single physical front panel — it does not generalise to a machine served by several concurrent clients without adding locking.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "State pattern — Refactoring Guru",
        href: "https://refactoring.guru/design-patterns/state",
        kind: "docs",
        note: "The pattern this problem exists to teach, with the same “object changes behaviour when its state changes” framing.",
      },
      {
        label: "awesome-low-level-design — Vending Machine",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/vending-machine.md",
        kind: "article",
        note: "A second take on the same problem — compare its state set against yours.",
      },
      {
        label: "Coin change — canonical coin systems",
        href: "https://en.wikipedia.org/wiki/Change-making_problem",
        kind: "article",
        note: "Why greedy is safe for ₹/$/€ and where it stops being safe. The one-paragraph version is enough for the interview.",
      },
      {
        label: "Head First Design Patterns — the State chapter",
        kind: "book",
        note: "Builds a gumball machine from booleans to states, step by step. It is essentially this lesson in book form.",
      },
      {
        label: "Refactoring: Replace Type Code with State/Strategy",
        href: "https://refactoring.com/catalog/replaceTypeCodeWithSubclasses.html",
        kind: "docs",
        note: "The mechanical recipe for getting from a flag-based version to a state-based one without breaking anything.",
      },
      {
        label: "State machines in practice — Erlang/OTP gen_statem docs",
        href: "https://www.erlang.org/doc/design_principles/statem.html",
        kind: "docs",
        note: "How an ecosystem that takes state machines seriously structures them. Useful vocabulary: state, event, action, timeout.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "vending-machine-q1",
        question: "You model the machine with three booleans: `hasMoney`, `dispensing`, `returningChange`. What is the core problem?",
        options: [
          { id: "a", label: "Three booleans describe eight combinations but the machine only has four legal states — the other four are nonsense your code must still survive." },
          { id: "b", label: "Booleans are slower to check than an enum comparison." },
          { id: "c", label: "Booleans cannot be used as fields in most languages." },
          { id: "d", label: "It works fine; the state pattern is only about code style." },
        ],
        correctOptionId: "a",
        explanation:
          "The count is the whole argument. Flags let you represent situations the real machine can never be in, so every method has to defensively re-check combinations. One `state` field makes those situations unrepresentable.",
      },
      {
        id: "vending-machine-q2",
        question: "A customer inserts ₹50 and selects a ₹15 candy, but the coin bank cannot make ₹35. What must the machine do?",
        options: [
          { id: "a", label: "Refuse the sale before dispensing, keep the item on the shelf, and let the customer take their money back." },
          { id: "b", label: "Dispense the candy and display “no change available”." },
          { id: "c", label: "Dispense the candy and give whatever coins it has, keeping the rest." },
          { id: "d", label: "Dispense the candy and add ₹35 to a credit balance for a future purchase." },
        ],
        correctOptionId: "a",
        explanation:
          "The check has to happen before the first irreversible step. Once the candy has dropped you cannot un-drop it, and (b), (c) and (d) all leave the customer short. Press 💰 Empty the coin bank in the prototype and watch the tray stay empty.",
      },
      {
        id: "vending-machine-q3",
        question: "Why should `Product` and `Slot` be separate classes?",
        options: [
          { id: "a", label: "A Product is what a Coke *is* (name, price); a Slot is a position in the machine with a count. Restocking A1 should not mutate the definition of Coke." },
          { id: "b", label: "Because a machine can only ever hold one product per slot." },
          { id: "c", label: "Because Java does not allow a class to have both a price and a count." },
          { id: "d", label: "They should not be separate — merging them removes a pointless class." },
        ],
        correctOptionId: "a",
        explanation:
          "Two different lifetimes and two different identities. The same Product can sit in several slots, and its price is not a property of any one shelf position. Merging them is the most common modelling slip in this problem.",
      },
      {
        id: "vending-machine-q4",
        question: "In the state-object design, what should `Idle.select(machine, code)` do?",
        options: [
          { id: "a", label: "Nothing — it is simply not overridden, so the default “stay in this state” applies." },
          { id: "b", label: "Throw an IllegalStateException so the caller knows it was wrong." },
          { id: "c", label: "Set `hasMoney = false` and log a warning." },
          { id: "d", label: "Transition to HAS_MONEY so the purchase can continue." },
        ],
        correctOptionId: "a",
        explanation:
          "There is no arrow from IDLE on `select`, so there is nothing to write. Pressing a product button on a machine with no credit is not an exception — it is an ordinary thing customers do, and the correct response is to ignore it.",
      },
      {
        id: "vending-machine-q5",
        question: "Greedy change (biggest coin first) is used here. When would that give a worse answer than necessary?",
        options: [
          { id: "a", label: "In a non-canonical denomination set — with coins of 1, 3 and 4, greedy makes 6 as 4+1+1 while 3+3 is better." },
          { id: "b", label: "Whenever the amount owed is larger than the biggest coin." },
          { id: "c", label: "Whenever the machine holds more than one denomination." },
          { id: "d", label: "Never — greedy is optimal for every possible coin system." },
        ],
        correctOptionId: "a",
        explanation:
          "Real currencies are canonical, which is precisely what makes greedy safe here. Naming the counter-example takes ten seconds and shows you know why the shortcut is allowed rather than just that it usually works.",
      },
      {
        id: "vending-machine-q6",
        question: "The interviewer asks you to add card payments. What is the smallest correct change?",
        options: [
          { id: "a", label: "A `PaymentMethod` interface with Coins and Card implementations — the state machine is untouched, since a swipe is just another route into HAS_MONEY." },
          { id: "b", label: "Add a `CARD_PENDING` branch to every method in every state." },
          { id: "c", label: "Duplicate the machine into a CardVendingMachine subclass." },
          { id: "d", label: "Add an `isCard` boolean and branch on it inside `select()`." },
        ],
        correctOptionId: "a",
        explanation:
          "The states describe *the purchase flow*, and that flow does not change based on how money arrived. Isolating the payment mechanism keeps the two concerns from multiplying — the trap in (b) and (d) is exactly the boolean-soup problem in a new costume.",
      },
      {
        id: "vending-machine-q7",
        question: "Why does modelling `DISPENSING` as a real state matter, even though it lasts under a second?",
        options: [
          { id: "a", label: "Because no input is an arrow out of it, a second button press during dispensing cannot trigger a second sale." },
          { id: "b", label: "Because dispensing needs to be timed accurately for the report." },
          { id: "c", label: "Because the display needs somewhere to store its message." },
          { id: "d", label: "It does not matter; DISPENSING could be removed with no consequence." },
        ],
        correctOptionId: "a",
        explanation:
          "It is the state that closes the double-dispense hole. With flags you would need a guard at the top of every method; as a state, the protection is structural — there is simply nothing to call.",
      },
      {
        id: "vending-machine-q8",
        question: "With 20 minutes left and no working demo, which is the right call?",
        options: [
          { id: "a", label: "Use a single `enum State` with a switch in each method, finish the purchase flow, and say where you'd extract state classes." },
          { id: "b", label: "Write all four state classes properly first — the pattern is what is being graded." },
          { id: "c", label: "Skip change-making entirely and assume exact payment." },
          { id: "d", label: "Start over with a cleaner package structure." },
        ],
        correctOptionId: "a",
        explanation:
          "An enum plus a switch gives you the same exhaustiveness for a fraction of the typing, and naming the refactor you would do next gets you the design credit anyway. (c) removes the most interesting part of the problem, which costs more than the ceremony you saved.",
      },
    ],
  },
};
