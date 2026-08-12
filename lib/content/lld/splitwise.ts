import type { RoadmapLesson } from "@/lib/content/types";

export const splitwise: RoadmapLesson = {
  title: "Splitwise",
  oneLiner:
    "Four friends, one bill, one card. Every other problem in this set is graded on structure — this one is graded on **arithmetic**. There is a number that must be exactly zero after every single operation, and there are three ordinary-looking mistakes that quietly make it not zero.",
  difficulty: "intermediate",
  estimatedTime: "30 min",
  prototypePath: "/prototypes/lld/splitwise.html",
  content: {
    prototypeCaption:
      "A live ledger for four friends. Press **➕ Add expense** and watch two things at once: edges appear in the balance graph, and the **total: ₹0.00** chip flashes green — the invariant, re-checked on every action. Press **🔢 Exact** and then switch a participant off: the ➕ button turns red and refuses, because 250+250+250 is not 1000. Press **🪙 Odd split** for ₹100 among three and read the paise. Then **🎲 Messy weekend** for five real expenses, and **⚡ Simplify debts** to watch **6 payments → 3 payments**.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design Splitwise.”* Or, if the interviewer is being kind: *“four friends go to dinner, one person pays, split the bill.”* It sounds like the easiest problem in the set.",
      },
      {
        type: "p",
        text: "It is not, and the reason is unusual. Every other machine-coding problem is graded on **structure** — did you find the right classes, is the seam in the right place. This one is graded on **money**. There is a property that has to hold after every operation you perform, and if it ever stops holding, no amount of clean design saves you.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole lesson in one line",
        text: "**Across everyone in the group, the balances must always sum to exactly zero.** Somebody is owed precisely what somebody else owes. Write it as an assertion — `assert sum(balances.values()) == 0` — put it at the end of `addExpense()`, and let it fail loudly. Every design decision below exists to keep that line true.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 330" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Four friends sit around a restaurant table with a single card on it and a one thousand rupee bill. Each person is labelled as the User class, the table as the Group class, the bill as the Expense class, the dashed arrows from the bill to each person as Split objects, the rule that decides the amounts as SplitStrategy, and the running tally at the side as the BalanceSheet whose column sums to zero.">
  <defs>
    <marker id="sw-scene-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="sw-scene-flow" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <rect x="150" y="42" width="330" height="240" rx="14" fill="none" stroke="#3a414c" stroke-width="1.4"/>
  <text x="164" y="64" font-size="9.5" fill="#6b7280">the dinner table</text>

  <text x="196" y="106" font-size="26">🧑</text>
  <text x="186" y="126" font-size="9" fill="#9099a8">Ravi</text>
  <text x="396" y="106" font-size="26">👩</text>
  <text x="392" y="126" font-size="9" fill="#9099a8">Priya</text>
  <text x="196" y="254" font-size="26">🧔</text>
  <text x="186" y="274" font-size="9" fill="#9099a8">Arjun</text>
  <text x="396" y="254" font-size="26">👧</text>
  <text x="388" y="274" font-size="9" fill="#9099a8">Meera</text>

  <rect x="272" y="140" width="94" height="66" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="286" y="162" font-size="9" fill="#9099a8">the bill</text>
  <text x="286" y="184" font-size="14" fill="#fb863a">₹1000</text>
  <text x="290" y="200" font-size="9" fill="#6b7280">💳 one card</text>

  <line x1="272" y1="158" x2="230" y2="118" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#sw-scene-flow)"/>
  <line x1="366" y1="158" x2="404" y2="118" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#sw-scene-flow)"/>
  <line x1="272" y1="192" x2="230" y2="234" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#sw-scene-flow)"/>
  <line x1="366" y1="192" x2="404" y2="234" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#sw-scene-flow)"/>

  <text x="16" y="90" font-size="11" fill="#fb863a">User</text>
  <text x="16" y="106" font-size="9" fill="#9099a8">id, name — nothing else</text>
  <line x1="120" y1="98" x2="188" y2="98" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#sw-scene-lead)"/>

  <text x="16" y="150" font-size="11" fill="#fb863a">Group</text>
  <text x="16" y="166" font-size="9" fill="#9099a8">named set of users</text>
  <text x="16" y="180" font-size="9" fill="#9099a8">+ its expenses</text>
  <line x1="120" y1="158" x2="146" y2="140" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#sw-scene-lead)"/>

  <text x="16" y="224" font-size="11" fill="#fb863a">Expense</text>
  <text x="16" y="240" font-size="9" fill="#9099a8">payer, total, splits</text>
  <text x="16" y="254" font-size="9" fill="#9099a8">100000 paise — not 1000.0</text>
  <line x1="120" y1="232" x2="266" y2="196" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#sw-scene-lead)"/>

  <text x="502" y="90" font-size="11" fill="#5e9ff6">Split</text>
  <text x="502" y="106" font-size="9" fill="#9099a8">one row: user → paise</text>
  <text x="502" y="132" font-size="11" fill="#5e9ff6">SplitStrategy</text>
  <text x="502" y="148" font-size="9" fill="#9099a8">decides the four numbers</text>
  <text x="502" y="162" font-size="9" fill="#9099a8">and checks they add up</text>

  <text x="502" y="200" font-size="11" fill="#5cc66f">BalanceSheet</text>
  <rect x="502" y="210" width="202" height="94" rx="7" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="514" y="230" font-size="9.5" fill="#e8e4dc">Ravi   +750.00</text>
  <text x="514" y="248" font-size="9.5" fill="#e8e4dc">Priya  −250.00</text>
  <text x="514" y="266" font-size="9.5" fill="#e8e4dc">Arjun  −250.00</text>
  <text x="514" y="284" font-size="9.5" fill="#e8e4dc">Meera  −250.00</text>
  <line x1="514" y1="290" x2="692" y2="290" stroke="#2d333d"/>
  <text x="514" y="302" font-size="10" fill="#5cc66f">sum      0.00  ✓</text>
</svg>`,
        caption:
          "Look at the green box. Four numbers that must add to **exactly zero** — not about zero. Everything else on this page is machinery for keeping that last line true.",
      },
      {
        type: "p",
        text: "Here is why that is harder than it looks. Split ₹100 three ways. Each person owes 33.33. Three times 33.33 is **99.99**. One paisa has vanished, the sum is no longer zero, and you did nothing wrong — you just used the obvious type for money.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 250" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, one hundred rupees stored as a double and divided three ways gives 33.33 three times, which adds to 99.99, and the missing paisa is circled in red. On the right, ten thousand paise stored as an integer gives 3334 plus 3333 plus 3333, which adds to exactly ten thousand paise, shown in green.">
  <text x="20" y="24" font-size="10.5" fill="#f06868">✗ double rupees — ₹100 ÷ 3</text>
  <rect x="20" y="34" width="316" height="176" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="38" y="60" font-size="10" fill="#9099a8">total = 100.0        // a double</text>
  <text x="38" y="84" font-size="10.5" fill="#e8e4dc">33.33</text>
  <text x="98" y="84" font-size="10.5" fill="#e8e4dc">+  33.33</text>
  <text x="178" y="84" font-size="10.5" fill="#e8e4dc">+  33.33</text>
  <line x1="38" y1="96" x2="300" y2="96" stroke="#2d333d"/>
  <text x="38" y="118" font-size="13" fill="#f06868">= 99.99</text>
  <ellipse cx="180" cy="113" rx="46" ry="17" fill="none" stroke="#f06868" stroke-width="1.6"/>
  <text x="228" y="118" font-size="10" fill="#f06868">₹0.01 gone</text>
  <text x="38" y="150" font-size="9.5" fill="#9099a8">the sheet no longer sums to zero</text>
  <text x="38" y="168" font-size="9.5" fill="#9099a8">multiply by every expense in the app</text>
  <text x="38" y="186" font-size="9.5" fill="#f06868">the books drift, forever, silently</text>

  <text x="364" y="24" font-size="10.5" fill="#5cc66f">✓ integer paise — 10000 ÷ 3</text>
  <rect x="364" y="34" width="316" height="176" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="382" y="60" font-size="10" fill="#9099a8">total = 10000        // a long</text>
  <text x="382" y="84" font-size="10.5" fill="#e8e4dc">3334</text>
  <text x="442" y="84" font-size="10.5" fill="#e8e4dc">+  3333</text>
  <text x="522" y="84" font-size="10.5" fill="#e8e4dc">+  3333</text>
  <line x1="382" y1="96" x2="644" y2="96" stroke="#2d333d"/>
  <text x="382" y="118" font-size="13" fill="#5cc66f">= 10000</text>
  <text x="470" y="118" font-size="10" fill="#5cc66f">exactly the total</text>
  <text x="382" y="150" font-size="9.5" fill="#9099a8">base = total / n = 3333, rem = total % n = 1</text>
  <text x="382" y="168" font-size="9.5" fill="#9099a8">hand the 1 leftover paisa to the first person</text>
  <text x="382" y="186" font-size="9.5" fill="#5cc66f">deterministic — so it is testable</text>
</svg>`,
        caption:
          "The rule to say out loud in the first two minutes: **money is a `long` of paise, never a `double`**. Then read the green box again — the leftover is *given to someone*, not rounded away.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Is money an integer?** Paise in a `long`, or `BigDecimal` with an explicit scale. A `double` anywhere near a balance is an automatic mark against you, and this is the problem where they look for it.",
          "**Does every split validate that it sums to the total?** And does that check live *inside* the strategy, so it cannot be forgotten by a caller?",
          "**Are balances a derived net map, or a growing list of IOUs?** *“How much do I owe Priya?”* should be one lookup, not a fold over every expense ever made.",
          "**Can you add a split type without touching `addExpense()`?** That is the [[open-closed]] question, and this problem hands you a textbook place to answer it.",
          "**Does it run, and can you simplify the debts?** Six IOUs between four people collapsing to three payments is the follow-up they always ask. Have it working, and know that the greedy version is not provably minimal.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- clarify ----------
      { type: "h", text: "Step 1 · Clarify — 4 minutes" },
      {
        type: "ul",
        items: [
          "**How are bills split?** — the question that opens the whole design. Equally, by exact amounts, by percentage, by shares. Name all four; that list is what becomes your strategy interface.",
          "**Can one person pay for people who are not splitting it?** — yes. The payer and the participants are two different lists. Getting this wrong collapses a lot of real cases.",
          "**Do expenses always belong to a group?** — no. A one-off coffee between two friends has no group. Say so, or you will end up creating a two-person group for every lunch.",
          "**One currency or many?** — assume one, and offer multi-currency as a follow-up. It is a real answer, not a dodge, and it keeps the first 40 minutes clean.",
          "**Do I need to minimise the number of payments?** — ask it, because they want you to. If they say yes, that is your second act.",
          "**Login, notifications, receipt photos, the mobile app?** — out of scope, in one sentence.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 236" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A two column scope board. In scope: users and groups, expenses with four split types, integer paise money, a net balance sheet, settle up, and debt simplification. Out of scope: authentication, notifications, receipt photos, payment gateway integration, and the mobile user interface.">
  <text x="20" y="24" font-size="10.5" fill="#5cc66f">✓ IN — build these</text>
  <rect x="20" y="34" width="316" height="186" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="58" font-size="10" fill="#e8e4dc">User · Group (a named set of users)</text>
  <text x="38" y="80" font-size="10" fill="#e8e4dc">Expense: payer, total, participants</text>
  <text x="38" y="102" font-size="10" fill="#e8e4dc">4 split types behind one interface</text>
  <text x="38" y="124" font-size="10" fill="#fb863a">money as integer paise</text>
  <text x="38" y="146" font-size="10" fill="#e8e4dc">BalanceSheet — net, not a debt log</text>
  <text x="38" y="168" font-size="10" fill="#e8e4dc">settleUp(from, to, amount)</text>
  <text x="38" y="190" font-size="10" fill="#fb863a">simplifyDebts() — the follow-up</text>
  <text x="38" y="210" font-size="9" fill="#6b7280">and the zero-sum assertion, everywhere</text>

  <text x="364" y="24" font-size="10.5" fill="#f06868">✗ OUT — say it in one sentence</text>
  <rect x="364" y="34" width="316" height="186" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="382" y="58" font-size="10" fill="#9099a8">login, signup, friend requests</text>
  <text x="382" y="80" font-size="10" fill="#9099a8">push notifications, email reminders</text>
  <text x="382" y="102" font-size="10" fill="#9099a8">receipt photos and attachments</text>
  <text x="382" y="124" font-size="10" fill="#9099a8">real payments — UPI, cards, banks</text>
  <text x="382" y="146" font-size="10" fill="#9099a8">the mobile UI</text>
  <text x="382" y="168" font-size="10" fill="#9099a8">persistence and schema design</text>
  <line x1="382" y1="182" x2="662" y2="182" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="202" font-size="9.5" fill="#6b7280">“settleUp just records that money moved —</text>
  <text x="382" y="216" font-size="9.5" fill="#6b7280">no gateway” is a complete answer.</text>
</svg>`,
        caption:
          "Read the orange lines on the left. **Integer paise** and **simplifyDebts** are the two things the interviewer is actually shopping for; everything else on that list is expected.",
      },

      // ---------- money ----------
      { type: "h", text: "Step 2 · Money is a `long` of paise" },
      {
        type: "p",
        text: "This costs you one sentence in the interview and it is the single highest-value sentence in the round. *“I will store every amount as an integer number of paise, so 1000 rupees is `100000`. Doubles cannot represent 0.1 exactly and money that drifts is a bug you find six months later in an audit.”*",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Three ways beginners break the zero-sum invariant",
        text: "**1. Splits that do not add up.** An EXACT split of 300 + 300 + 300 on a ₹1000 bill. The payer is credited 1000, the participants are debited 900, and ₹100 appears from nowhere. **2. Percentages that do not sum to 100.** Same bug wearing a different unit. **3. The rounding leak.** ₹100 three ways at 33.33 each is 99.99 — nobody typed anything wrong, and a paisa still vanished. The first two are caught by validation; the third is only caught by not using floating point at all.",
      },
      {
        type: "code",
        language: "java",
        filename: "the split that never leaks",
        code: `/**
 * base = total / n, remainder = total % n, then hand the leftover paise out
 * ONE AT A TIME to the first "remainder" people. Deterministic, so it is testable.
 * 10000 paise among 3  ->  3334, 3333, 3333   (sums to exactly 10000)
 */
static long[] spread(long totalPaise, long[] weights) {
    long weightSum = 0;
    for (long w : weights) weightSum += w;

    long[] out = new long[weights.length];
    long assigned = 0;
    for (int i = 0; i < weights.length; i++) {
        out[i] = totalPaise * weights[i] / weightSum;   // integer division, always rounds DOWN
        assigned += out[i];
    }
    for (int i = 0; assigned < totalPaise; i++, assigned++) out[i]++;   // give the leftover away
    return out;                                          // sum(out) == totalPaise, exactly
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Why the leftover goes to the *first* people, not a random one",
        text: "Because a test has to be able to assert the answer. *“Someone gets the extra paisa”* is not a specification. Real apps do exactly this and then rotate who is first across expenses so the same person is not always paying the extra 0.01 — worth one sentence if you have it, but the determinism is the part that scores.",
      },

      // ---------- strategies ----------
      { type: "h", text: "Step 3 · Four split types, one interface" },
      {
        type: "p",
        text: "`SplitStrategy.split(totalPaise, participants) → Map<User, paise>`. Four implementations. The design point is not that there is an interface — everyone writes an interface. It is **where the validation lives**.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 316" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Four split strategy cards each taking the same one thousand rupee bill and four people, producing different per person maps. Equal gives 250 each. Exact gives 400, 300, 200 and 100 as typed. Percent gives 40, 30, 20 and 10 percent converted to rupees. Shares gives two shares to a couple and one each to two singles, producing 333.34, 333.33, 166.67 and 166.66. Below, every strategy passes through the same validator gate that checks the outputs sum to the total, and a rejected example of 300 plus 300 plus 300 equalling 900 is shown being refused.">
  <defs>
    <marker id="sw-strat-gate" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#9099a8"/></marker>
  </defs>

  <text x="20" y="20" font-size="10" fill="#6b7280">same input to all four:  total = 100000 paise · participants = [Ravi, Priya, Arjun, Meera]</text>

  <rect x="20" y="32" width="160" height="112" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="52" font-size="10.5" fill="#fb863a">⚖️ EqualSplit</text>
  <line x1="20" y1="60" x2="180" y2="60" stroke="#2d333d"/>
  <text x="32" y="78" font-size="9.5" fill="#e8e4dc">Ravi   25000</text>
  <text x="32" y="94" font-size="9.5" fill="#e8e4dc">Priya  25000</text>
  <text x="32" y="110" font-size="9.5" fill="#e8e4dc">Arjun  25000</text>
  <text x="32" y="126" font-size="9.5" fill="#e8e4dc">Meera  25000</text>

  <rect x="196" y="32" width="160" height="112" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="208" y="52" font-size="10.5" fill="#fb863a">🔢 ExactSplit</text>
  <line x1="196" y1="60" x2="356" y2="60" stroke="#2d333d"/>
  <text x="208" y="78" font-size="9.5" fill="#e8e4dc">Ravi   40000</text>
  <text x="208" y="94" font-size="9.5" fill="#e8e4dc">Priya  30000</text>
  <text x="208" y="110" font-size="9.5" fill="#e8e4dc">Arjun  20000</text>
  <text x="208" y="126" font-size="9.5" fill="#e8e4dc">Meera  10000</text>

  <rect x="372" y="32" width="160" height="112" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="384" y="52" font-size="10.5" fill="#fb863a">% PercentSplit</text>
  <line x1="372" y1="60" x2="532" y2="60" stroke="#2d333d"/>
  <text x="384" y="78" font-size="9.5" fill="#e8e4dc">40%  →  40000</text>
  <text x="384" y="94" font-size="9.5" fill="#e8e4dc">30%  →  30000</text>
  <text x="384" y="110" font-size="9.5" fill="#e8e4dc">20%  →  20000</text>
  <text x="384" y="126" font-size="9.5" fill="#e8e4dc">10%  →  10000</text>

  <rect x="548" y="32" width="160" height="112" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="560" y="52" font-size="10.5" fill="#fb863a">🧮 ShareSplit</text>
  <line x1="548" y1="60" x2="708" y2="60" stroke="#2d333d"/>
  <text x="560" y="78" font-size="9.5" fill="#e8e4dc">2 shares → 33334</text>
  <text x="560" y="94" font-size="9.5" fill="#e8e4dc">2 shares → 33333</text>
  <text x="560" y="110" font-size="9.5" fill="#e8e4dc">1 share  → 16667</text>
  <text x="560" y="126" font-size="9.5" fill="#e8e4dc">1 share  → 16666</text>

  <line x1="100" y1="144" x2="100" y2="176" stroke="#9099a8" stroke-width="1.1" marker-end="url(#sw-strat-gate)"/>
  <line x1="276" y1="144" x2="276" y2="176" stroke="#9099a8" stroke-width="1.1" marker-end="url(#sw-strat-gate)"/>
  <line x1="452" y1="144" x2="452" y2="176" stroke="#9099a8" stroke-width="1.1" marker-end="url(#sw-strat-gate)"/>
  <line x1="628" y1="144" x2="628" y2="176" stroke="#9099a8" stroke-width="1.1" marker-end="url(#sw-strat-gate)"/>

  <rect x="20" y="182" width="688" height="46" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="36" y="202" font-size="11" fill="#fb863a">🚪 THE GATE — inside every strategy, never in the caller</text>
  <text x="36" y="220" font-size="10" fill="#e8e4dc">if (sum(splits) != totalPaise) throw new IllegalArgumentException(...)</text>

  <rect x="20" y="244" width="336" height="60" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="36" y="264" font-size="10" fill="#5cc66f">✓ 40000+30000+20000+10000 = 100000</text>
  <text x="36" y="286" font-size="9.5" fill="#9099a8">passes the gate — the expense is recorded</text>

  <rect x="372" y="244" width="336" height="60" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="388" y="264" font-size="10" fill="#f06868">✗ 30000+30000+30000 = 90000</text>
  <text x="388" y="286" font-size="9.5" fill="#9099a8">refused: “splits must sum to ₹1000.00 — got ₹900.00”</text>
</svg>`,
        caption:
          "Follow every arrow into the **same gate**. Put that check in `addExpense()` instead and it works — until the day someone calls `split()` from a new place and forgets it. This is [[strategy]] doing its actual job, and it is why `addExpense()` never changes when a fifth split type arrives ([[open-closed]]).",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The sentence that wins this section",
        text: "*“Each strategy validates its own output before returning, so an invalid split cannot reach the balance sheet at all.”* Say it while you are writing the interface, not afterwards.",
      },

      // ---------- balances ----------
      { type: "h", text: "Step 4 · Balances are a net map, not a list of debts" },
      {
        type: "p",
        text: "The naive model stores rows: *“Arjun owes Ravi ₹250”*, *“Arjun owes Priya ₹300”*, and appends forever. After ten expenses you have thirty rows, and answering *“how much do I owe Priya?”* means folding the entire history every time. Worse, nobody can look at it and tell.",
      },
      {
        type: "p",
        text: "Keep a **net** instead. Per user, `Map<otherUser, netAmount>`, with one rule enforced on every write: `balance[a][b] == -balance[b][a]`. Adding an expense becomes: for each participant who is not the payer, move their split amount across that one edge. `owes(me, priya)` is then an O(1) lookup.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, four people as nodes after one thousand rupee dinner paid by Ravi and split equally. Three arrows point from Priya, Arjun and Meera to Ravi, each labelled 250 rupees. On the right, the antisymmetry rule is shown as a table where balance of Priya to Ravi is plus 250 and balance of Ravi to Priya is minus 250, written on every single move, with a note that the same edge is never stored twice.">
  <defs>
    <marker id="sw-edge-owe" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <text x="20" y="22" font-size="10.5" fill="#9099a8">after ONE expense: Ravi paid ₹1000, split equally among all four</text>

  <circle cx="300" cy="70" r="24" fill="#14161a" stroke="rgba(92,198,111,0.55)" stroke-width="1.4"/>
  <text x="288" y="78" font-size="18">🧑</text>
  <text x="286" y="112" font-size="9.5" fill="#5cc66f">Ravi  +750</text>

  <circle cx="80" cy="200" r="22" fill="#14161a" stroke="#3a414c"/>
  <text x="69" y="207" font-size="16">👩</text>
  <text x="52" y="240" font-size="9.5" fill="#f06868">Priya  −250</text>

  <circle cx="240" cy="230" r="22" fill="#14161a" stroke="#3a414c"/>
  <text x="229" y="237" font-size="16">🧔</text>
  <text x="212" y="270" font-size="9.5" fill="#f06868">Arjun  −250</text>

  <circle cx="400" cy="200" r="22" fill="#14161a" stroke="#3a414c"/>
  <text x="389" y="207" font-size="16">👧</text>
  <text x="376" y="240" font-size="9.5" fill="#f06868">Meera  −250</text>

  <line x1="98" y1="186" x2="278" y2="86" stroke="#fb863a" stroke-width="1.3" marker-end="url(#sw-edge-owe)"/>
  <text x="150" y="128" font-size="9.5" fill="#fb863a">₹250</text>
  <line x1="252" y1="209" x2="292" y2="96" stroke="#fb863a" stroke-width="1.3" marker-end="url(#sw-edge-owe)"/>
  <text x="278" y="164" font-size="9.5" fill="#fb863a">₹250</text>
  <line x1="386" y1="182" x2="320" y2="90" stroke="#fb863a" stroke-width="1.3" marker-end="url(#sw-edge-owe)"/>
  <text x="352" y="146" font-size="9.5" fill="#fb863a">₹250</text>

  <text x="20" y="288" font-size="9.5" fill="#6b7280">an arrow means “owes”. Ravi is not in his own debt — a payer never owes himself his own share.</text>

  <text x="470" y="22" font-size="10.5" fill="#5e9ff6">the rule written on EVERY move</text>
  <rect x="470" y="34" width="234" height="122" rx="8" fill="#14161a" stroke="rgba(94,159,246,0.45)"/>
  <text x="484" y="56" font-size="10" fill="#e8e4dc">move(Priya → Ravi, 25000)</text>
  <line x1="484" y1="66" x2="690" y2="66" stroke="#2d333d"/>
  <text x="484" y="88" font-size="10" fill="#fb863a">bal[Priya][Ravi] += 25000</text>
  <text x="484" y="110" font-size="10" fill="#fb863a">bal[Ravi][Priya] −= 25000</text>
  <line x1="484" y1="122" x2="690" y2="122" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="484" y="142" font-size="9.5" fill="#5cc66f">both lines, or neither. always.</text>

  <rect x="470" y="170" width="234" height="106" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="484" y="192" font-size="10" fill="#9099a8">“what do I owe Priya?”</text>
  <text x="484" y="214" font-size="10" fill="#5cc66f">✓ bal[me][Priya]        O(1)</text>
  <text x="484" y="240" font-size="10" fill="#f06868">✗ fold 30 IOU rows       O(n)</text>
  <text x="484" y="264" font-size="9" fill="#6b7280">keep the Expense list too — as the audit</text>
</svg>`,
        caption:
          "Both lines on the right, on every write. That is what makes the sheet self-balancing: an edge can never be half-applied, so **the sum across everyone cannot drift**.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Balances are computed state, not the source of truth",
        text: "Keep the `Expense` list forever — it is the audit trail, and it is what lets you rebuild the balance sheet from scratch after a bug, edit an old expense, or show *“why do I owe this?”*. The balance map is a cache of a fold over that list, kept up to date incrementally. Say that sentence and you have answered three follow-ups before they are asked.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 680 250" width="100%" style="max-width:660px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A balance table for four people after five expenses. Ravi is owed 616 rupees 66 paise, Priya owes 383 rupees 33 paise, Arjun is owed 216 rupees 67 paise, Meera owes 450 rupees. The column is totalled at the bottom and the total is exactly zero, printed large in green next to the assertion that the balances must sum to zero.">
  <text x="20" y="24" font-size="10.5" fill="#9099a8">net position after five expenses  —  positive = is owed, negative = owes</text>

  <rect x="20" y="36" width="380" height="160" rx="8" fill="#14161a" stroke="#2d333d"/>
  <line x1="20" y1="64" x2="400" y2="64" stroke="#2d333d"/>
  <text x="38" y="56" font-size="9" fill="#6b7280">member</text>
  <text x="280" y="56" font-size="9" fill="#6b7280">net (paise)</text>

  <text x="38" y="86" font-size="10.5" fill="#e8e4dc">🧑 Ravi</text>
  <text x="280" y="86" font-size="10.5" fill="#5cc66f">+ 61666</text>
  <text x="38" y="110" font-size="10.5" fill="#e8e4dc">👩 Priya</text>
  <text x="280" y="110" font-size="10.5" fill="#f06868">− 38333</text>
  <text x="38" y="134" font-size="10.5" fill="#e8e4dc">🧔 Arjun</text>
  <text x="280" y="134" font-size="10.5" fill="#5cc66f">+ 21667</text>
  <text x="38" y="158" font-size="10.5" fill="#e8e4dc">👧 Meera</text>
  <text x="280" y="158" font-size="10.5" fill="#f06868">− 45000</text>

  <line x1="38" y1="170" x2="382" y2="170" stroke="#3a414c" stroke-width="1.4"/>
  <text x="38" y="188" font-size="11" fill="#5cc66f">TOTAL</text>
  <text x="280" y="188" font-size="14" fill="#5cc66f">0</text>

  <rect x="424" y="36" width="236" height="160" rx="8" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="440" y="60" font-size="10.5" fill="#5cc66f">the assertion you write</text>
  <text x="440" y="86" font-size="9.5" fill="#e8e4dc">assert balances.values()</text>
  <text x="440" y="102" font-size="9.5" fill="#e8e4dc">        .sum() == 0;</text>
  <line x1="440" y1="116" x2="644" y2="116" stroke="rgba(92,198,111,0.35)" stroke-dasharray="3 3"/>
  <text x="440" y="138" font-size="9.5" fill="#9099a8">at the end of addExpense()</text>
  <text x="440" y="156" font-size="9.5" fill="#9099a8">at the end of settleUp()</text>
  <text x="440" y="174" font-size="9.5" fill="#9099a8">at the end of simplifyDebts()</text>
  <text x="440" y="190" font-size="9" fill="#6b7280">and in every property test</text>

  <text x="20" y="228" font-size="9.5" fill="#6b7280">a double here would show TOTAL = 0.000000000001 — true enough to pass by eye, false enough to fail an audit</text>
  <text x="20" y="244" font-size="9.5" fill="#6b7280">integers make the assertion an exact equality, which is the only kind worth asserting</text>
</svg>`,
        caption:
          "The bottom row is the whole grade. Notice that it is `== 0`, not `< 0.01` — with integer paise you get to write the strict version, and a strict assertion is one that actually catches things.",
      },

      // ---------- class diagram ----------
      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 420" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. Group holds many Users, many Expenses, many Settlements and one BalanceSheet. Expense holds a payer User, a total in paise and many Split rows. Expense is created using a SplitStrategy interface which has four implementations: EqualSplit, ExactSplit, PercentSplit and ShareSplit. BalanceSheet holds a nested map from user to user to paise and exposes move, owes, netOf and simplify.">
  <defs>
    <marker id="sw-cls-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="sw-cls-inh" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <rect x="18" y="16" width="206" height="96" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="30" y="36" font-size="11.5" fill="#fb863a">Group</text>
  <line x1="18" y1="44" x2="224" y2="44" stroke="#2d333d"/>
  <text x="30" y="62" font-size="10" fill="#e8e4dc">+ addExpense(...)</text>
  <text x="30" y="80" font-size="10" fill="#e8e4dc">+ settleUp(from, to, paise)</text>
  <text x="30" y="98" font-size="10" fill="#e8e4dc">+ simplifyDebts()</text>

  <rect x="18" y="140" width="206" height="58" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="30" y="160" font-size="11.5" fill="#e8e4dc">User</text>
  <line x1="18" y1="168" x2="224" y2="168" stroke="#2d333d"/>
  <text x="30" y="186" font-size="10" fill="#9099a8">- id : String   - name : String</text>
  <path d="M112,112 L112,122 L104,130 L112,138 L120,130 L112,122" fill="#e8e4dc" stroke="#e8e4dc"/>
  <text x="126" y="132" font-size="9" fill="#9099a8">2..*</text>

  <rect x="18" y="226" width="206" height="74" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="30" y="246" font-size="11.5" fill="#e8e4dc">Settlement</text>
  <line x1="18" y1="254" x2="224" y2="254" stroke="#2d333d"/>
  <text x="30" y="272" font-size="10" fill="#9099a8">- from, to : User</text>
  <text x="30" y="290" font-size="10" fill="#9099a8">- paise : long   - at : Instant</text>
  <line x1="112" y1="198" x2="112" y2="222" stroke="#d8d3c9" stroke-width="1.2" marker-end="url(#sw-cls-a)"/>

  <rect x="272" y="16" width="212" height="112" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="284" y="36" font-size="11.5" fill="#e8e4dc">Expense</text>
  <line x1="272" y1="44" x2="484" y2="44" stroke="#2d333d"/>
  <text x="284" y="62" font-size="10" fill="#9099a8">- payer : User</text>
  <text x="284" y="80" font-size="10" fill="#fb863a">- totalPaise : long</text>
  <text x="284" y="98" font-size="10" fill="#9099a8">- splits : List&lt;Split&gt;</text>
  <text x="284" y="116" font-size="9" fill="#6b7280">immutable — the audit row</text>
  <line x1="228" y1="60" x2="268" y2="60" stroke="#9099a8" stroke-width="1.2" marker-end="url(#sw-cls-a)"/>

  <rect x="272" y="152" width="212" height="62" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="284" y="172" font-size="11.5" fill="#e8e4dc">Split</text>
  <line x1="272" y1="180" x2="484" y2="180" stroke="#2d333d"/>
  <text x="284" y="198" font-size="10" fill="#9099a8">- user : User   - paise : long</text>
  <path d="M378,128 L378,138 L370,146 L378,154 L386,146 L378,138" fill="#e8e4dc" stroke="#e8e4dc"/>
  <text x="392" y="148" font-size="9" fill="#9099a8">1..*</text>

  <rect x="272" y="248" width="212" height="70" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="284" y="268" font-size="11.5" fill="#5e9ff6">«interface» SplitStrategy</text>
  <line x1="272" y1="276" x2="484" y2="276" stroke="#2d333d"/>
  <text x="284" y="294" font-size="10" fill="#e8e4dc">+ split(totalPaise, users)</text>
  <text x="284" y="310" font-size="9" fill="#fb863a">…and validates its own sum</text>
  <line x1="378" y1="248" x2="378" y2="218" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#sw-cls-a)"/>

  <rect x="216" y="348" width="122" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="228" y="368" font-size="9.5" fill="#e8e4dc">EqualSplit</text>
  <rect x="348" y="348" width="122" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="360" y="368" font-size="9.5" fill="#e8e4dc">ExactSplit</text>
  <rect x="216" y="386" width="122" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="228" y="406" font-size="9.5" fill="#e8e4dc">PercentSplit</text>
  <rect x="348" y="386" width="122" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="360" y="406" font-size="9.5" fill="#e8e4dc">ShareSplit</text>
  <line x1="277" y1="348" x2="330" y2="322" stroke="#9099a8" stroke-width="1.1" marker-end="url(#sw-cls-inh)"/>
  <line x1="409" y1="348" x2="424" y2="322" stroke="#9099a8" stroke-width="1.1" marker-end="url(#sw-cls-inh)"/>
  <text x="486" y="372" font-size="9.5" fill="#6b7280">a fifth one costs</text>
  <text x="486" y="388" font-size="9.5" fill="#6b7280">one new file and</text>
  <text x="486" y="404" font-size="9.5" fill="#5cc66f">zero edits elsewhere</text>

  <rect x="516" y="16" width="212" height="150" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.3"/>
  <text x="528" y="36" font-size="11.5" fill="#5cc66f">BalanceSheet</text>
  <text x="640" y="36" font-size="8.5" fill="#6b7280">«derived»</text>
  <line x1="516" y1="44" x2="728" y2="44" stroke="#2d333d"/>
  <text x="528" y="62" font-size="9.5" fill="#9099a8">- net : Map&lt;User, Map&lt;User, long&gt;&gt;</text>
  <text x="528" y="84" font-size="10" fill="#fb863a">+ move(from, to, paise)</text>
  <text x="528" y="102" font-size="10" fill="#e8e4dc">+ owes(a, b) : long</text>
  <text x="528" y="120" font-size="10" fill="#e8e4dc">+ netOf(user) : long</text>
  <text x="528" y="138" font-size="10" fill="#e8e4dc">+ simplify() : List&lt;Settlement&gt;</text>
  <text x="528" y="158" font-size="9" fill="#5cc66f">invariant: Σ netOf(u) == 0</text>
  <line x1="228" y1="34" x2="512" y2="34" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#sw-cls-a)"/>
  <text x="330" y="28" font-size="9" fill="#5cc66f">exactly one, per group</text>

  <rect x="516" y="196" width="212" height="122" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="528" y="216" font-size="10.5" fill="#9099a8">what is NOT here</text>
  <line x1="528" y1="226" x2="716" y2="226" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="528" y="246" font-size="9.5" fill="#f06868">✗ class Debt { a, b, amount }</text>
  <text x="528" y="264" font-size="9" fill="#6b7280">   a growing IOU log, folded on read</text>
  <text x="528" y="286" font-size="9.5" fill="#f06868">✗ double amount</text>
  <text x="528" y="304" font-size="9" fill="#6b7280">   the single fastest way to lose</text>
</svg>`,
        caption:
          "Two arrows carry this diagram: **Expense → SplitStrategy** (the swappable seam) and **Group → BalanceSheet** (exactly one, and it is derived). The bottom-right box is what a weak answer draws instead. Notation: [[class-diagrams]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 306" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram for adding an expense. A client calls addExpense on the Group with a payer, a total in paise, participants and a strategy. The Group calls split on the SplitStrategy, which computes the amounts and validates internally that they sum to the total, returning the split list. The Group then calls move on the BalanceSheet once per participant who is not the payer. Finally the Group asserts that the sum of all net balances is zero before returning the expense.">
  <defs>
    <marker id="sw-seq-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="sw-seq-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="96" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="42" y="32" font-size="10.5" fill="#e8e4dc">Client</text>
  <rect x="176" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="208" y="32" font-size="10.5" fill="#fb863a">Group</text>
  <rect x="352" y="12" width="128" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="362" y="32" font-size="10.5" fill="#5e9ff6">SplitStrategy</text>
  <rect x="562" y="12" width="128" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="576" y="32" font-size="10.5" fill="#5cc66f">BalanceSheet</text>

  <line x1="62" y1="42" x2="62" y2="292" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="228" y1="42" x2="228" y2="292" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="416" y1="42" x2="416" y2="292" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="626" y1="42" x2="626" y2="292" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="70" y="66" font-size="10" fill="#e8e4dc">addExpense(Ravi, 100000, [R,P,A,M], EqualSplit)</text>
  <line x1="62" y1="74" x2="224" y2="74" stroke="#fb863a" stroke-width="1.3" marker-end="url(#sw-seq-call)"/>

  <text x="236" y="98" font-size="10" fill="#e8e4dc">split(100000, participants)</text>
  <line x1="228" y1="106" x2="412" y2="106" stroke="#fb863a" stroke-width="1.3" marker-end="url(#sw-seq-call)"/>
  <rect x="410" y="112" width="200" height="48" rx="5" fill="rgba(94,159,246,0.12)" stroke="rgba(94,159,246,0.5)"/>
  <text x="420" y="130" font-size="9" fill="#5e9ff6">base = 25000 · rem = 0</text>
  <text x="420" y="148" font-size="9" fill="#5e9ff6">🚪 assert Σ splits == total</text>
  <line x1="416" y1="176" x2="232" y2="176" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#sw-seq-ret)"/>
  <text x="250" y="170" font-size="9.5" fill="#9099a8">[R 25000, P 25000, A 25000, M 25000]</text>

  <text x="236" y="202" font-size="10" fill="#e8e4dc">move(Priya → Ravi, 25000)   ×3, payer skipped</text>
  <line x1="228" y1="210" x2="622" y2="210" stroke="#fb863a" stroke-width="1.3" marker-end="url(#sw-seq-call)"/>
  <rect x="600" y="216" width="132" height="46" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="610" y="234" font-size="9" fill="#5cc66f">bal[a][b] += p</text>
  <text x="610" y="250" font-size="9" fill="#5cc66f">bal[b][a] −= p</text>

  <rect x="176" y="266" width="290" height="26" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="188" y="284" font-size="9.5" fill="#5cc66f">assert Σ netOf(u) == 0   ← before returning</text>
  <line x1="228" y1="292" x2="66" y2="292" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#sw-seq-ret)"/>
  <text x="484" y="284" font-size="9.5" fill="#9099a8">Expense (the audit row)</text>
</svg>`,
        caption:
          "Two gates on one path: the strategy checks its own sum, and the group checks the invariant before it returns. Neither is expensive; both turn a silent corruption into a stack trace. Notation: [[sequence-diagrams]].",
      },

      // ---------- simplification ----------
      { type: "h", text: "Step 5 · Simplify debts — the follow-up they always ask" },
      {
        type: "p",
        text: "*“Four friends, a weekend, five expenses. Nobody wants to make six payments. Can you reduce it?”* This is where the round is won, and it takes about fifteen lines.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 330" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, a tangled graph of four friends with six directed arrows between every pair, labelled with rupee amounts. On the right, the same four people with only three arrows: Meera pays Ravi 450 rupees, Priya pays Arjun 216 rupees 67 paise and Priya pays Ravi 166 rupees 66 paise. Underneath, large counters read six payments arrow three payments, with a note that the bound is n minus one.">
  <defs>
    <marker id="sw-simp-a" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
    <marker id="sw-simp-b" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="sw-simp-big" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="#fb863a"/></marker>
  </defs>

  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ BEFORE — 6 open edges</text>
  <rect x="20" y="32" width="316" height="216" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>

  <circle cx="90" cy="82" r="18" fill="#14161a" stroke="#3a414c"/><text x="81" y="89" font-size="14">🧑</text><text x="70" y="60" font-size="8.5" fill="#9099a8">Ravi</text>
  <circle cx="264" cy="82" r="18" fill="#14161a" stroke="#3a414c"/><text x="255" y="89" font-size="14">👩</text><text x="248" y="60" font-size="8.5" fill="#9099a8">Priya</text>
  <circle cx="264" cy="196" r="18" fill="#14161a" stroke="#3a414c"/><text x="255" y="203" font-size="14">🧔</text><text x="246" y="230" font-size="8.5" fill="#9099a8">Arjun</text>
  <circle cx="90" cy="196" r="18" fill="#14161a" stroke="#3a414c"/><text x="81" y="203" font-size="14">👧</text><text x="70" y="230" font-size="8.5" fill="#9099a8">Meera</text>

  <line x1="246" y1="82" x2="112" y2="82" stroke="#f06868" stroke-width="1.1" marker-end="url(#sw-simp-a)"/>
  <text x="146" y="76" font-size="8.5" fill="#f06868">283.33</text>
  <line x1="264" y1="178" x2="264" y2="104" stroke="#f06868" stroke-width="1.1" marker-end="url(#sw-simp-a)"/>
  <text x="272" y="146" font-size="8.5" fill="#f06868">100.00</text>
  <line x1="108" y1="210" x2="242" y2="200" stroke="#f06868" stroke-width="1.1" marker-end="url(#sw-simp-a)"/>
  <text x="150" y="222" font-size="8.5" fill="#f06868">400.00</text>
  <line x1="90" y1="178" x2="90" y2="104" stroke="#f06868" stroke-width="1.1" marker-end="url(#sw-simp-a)"/>
  <text x="46" y="146" font-size="8.5" fill="#f06868">250.00</text>
  <line x1="246" y1="184" x2="112" y2="96" stroke="#f06868" stroke-width="1.1" marker-end="url(#sw-simp-a)"/>
  <text x="196" y="146" font-size="8.5" fill="#f06868">83.33</text>
  <line x1="250" y1="96" x2="106" y2="184" stroke="#f06868" stroke-width="1.1" marker-end="url(#sw-simp-a)"/>
  <text x="120" y="128" font-size="8.5" fill="#f06868">200.00</text>

  <text x="384" y="22" font-size="10.5" fill="#5cc66f">✓ AFTER — 3 payments, same nets</text>
  <rect x="384" y="32" width="316" height="216" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <circle cx="454" cy="82" r="18" fill="#14161a" stroke="rgba(92,198,111,0.55)"/><text x="445" y="89" font-size="14">🧑</text><text x="430" y="60" font-size="8.5" fill="#5cc66f">Ravi +616.66</text>
  <circle cx="628" cy="82" r="18" fill="#14161a" stroke="#3a414c"/><text x="619" y="89" font-size="14">👩</text><text x="600" y="60" font-size="8.5" fill="#f06868">Priya −383.33</text>
  <circle cx="628" cy="196" r="18" fill="#14161a" stroke="rgba(92,198,111,0.55)"/><text x="619" y="203" font-size="14">🧔</text><text x="596" y="230" font-size="8.5" fill="#5cc66f">Arjun +216.67</text>
  <circle cx="454" cy="196" r="18" fill="#14161a" stroke="#3a414c"/><text x="445" y="203" font-size="14">👧</text><text x="424" y="230" font-size="8.5" fill="#f06868">Meera −450.00</text>

  <line x1="454" y1="178" x2="454" y2="104" stroke="#5cc66f" stroke-width="1.6" marker-end="url(#sw-simp-b)"/>
  <text x="398" y="146" font-size="9" fill="#5cc66f">450.00</text>
  <line x1="628" y1="104" x2="628" y2="174" stroke="#5cc66f" stroke-width="1.6" marker-end="url(#sw-simp-b)"/>
  <text x="638" y="146" font-size="9" fill="#5cc66f">216.67</text>
  <line x1="610" y1="82" x2="476" y2="82" stroke="#5cc66f" stroke-width="1.6" marker-end="url(#sw-simp-b)"/>
  <text x="510" y="76" font-size="9" fill="#5cc66f">166.66</text>

  <line x1="340" y1="140" x2="380" y2="140" stroke="#fb863a" stroke-width="1.6" marker-end="url(#sw-simp-big)"/>

  <rect x="20" y="264" width="680" height="52" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="40" y="298" font-size="22" fill="#f06868">6 payments</text>
  <text x="184" y="298" font-size="20" fill="#fb863a">→</text>
  <text x="220" y="298" font-size="22" fill="#5cc66f">3 payments</text>
  <text x="378" y="286" font-size="9.5" fill="#9099a8">every net position is unchanged — only the routing is</text>
  <text x="378" y="304" font-size="9.5" fill="#9099a8">bound: at most n−1 = 3 transfers for 4 people</text>
</svg>`,
        caption:
          "Compare the two nets rows, not the arrows. **Nobody is better or worse off** — Ravi is still owed ₹616.66. What changed is how many times a phone has to be picked up.",
      },
      {
        type: "p",
        text: "The algorithm is short. Compute each person's **net** position, which sums to zero by the invariant. Then repeatedly match the **biggest creditor** with the **biggest debtor**, transfer `min(|debt|, credit)`, and put whatever is left back in the pool.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 262" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A table showing three rounds of the greedy debt simplification. Round one matches Ravi who is owed 616 rupees 66 paise with Meera who owes 450 rupees, transferring 450 and zeroing Meera. Round two matches Arjun owed 216 rupees 67 paise with Priya who owes 383 rupees 33 paise, transferring 216 rupees 67 paise and zeroing Arjun. Round three matches Ravi with 166 rupees 66 paise remaining against Priya with 166 rupees 66 paise, zeroing both. Three transfers total, and a note that at least one person zeroes out each round so it terminates in at most n minus one.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">greedy: biggest creditor ↔ biggest debtor, settle min(|debtor|, creditor), repeat</text>

  <rect x="20" y="32" width="660" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="50" font-size="9" fill="#6b7280">round</text>
  <text x="96" y="50" font-size="9" fill="#6b7280">biggest creditor</text>
  <text x="250" y="50" font-size="9" fill="#6b7280">biggest debtor</text>
  <text x="404" y="50" font-size="9" fill="#6b7280">transfer</text>
  <text x="530" y="50" font-size="9" fill="#6b7280">who zeroes out</text>

  <rect x="20" y="62" width="660" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="84" font-size="10" fill="#e8e4dc">1</text>
  <text x="96" y="84" font-size="10" fill="#5cc66f">Ravi  +616.66</text>
  <text x="250" y="84" font-size="10" fill="#f06868">Meera −450.00</text>
  <text x="404" y="84" font-size="10" fill="#fb863a">Meera → Ravi 450.00</text>
  <text x="530" y="84" font-size="10" fill="#9099a8">Meera ✔  (Ravi → 166.66)</text>

  <rect x="20" y="100" width="660" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="122" font-size="10" fill="#e8e4dc">2</text>
  <text x="96" y="122" font-size="10" fill="#5cc66f">Arjun +216.67</text>
  <text x="250" y="122" font-size="10" fill="#f06868">Priya −383.33</text>
  <text x="404" y="122" font-size="10" fill="#fb863a">Priya → Arjun 216.67</text>
  <text x="530" y="122" font-size="10" fill="#9099a8">Arjun ✔  (Priya → −166.66)</text>

  <rect x="20" y="138" width="660" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="160" font-size="10" fill="#e8e4dc">3</text>
  <text x="96" y="160" font-size="10" fill="#5cc66f">Ravi  +166.66</text>
  <text x="250" y="160" font-size="10" fill="#f06868">Priya −166.66</text>
  <text x="404" y="160" font-size="10" fill="#fb863a">Priya → Ravi 166.66</text>
  <text x="530" y="160" font-size="10" fill="#5cc66f">both ✔  — pool empty</text>

  <line x1="20" y1="184" x2="680" y2="184" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="206" font-size="10" fill="#5cc66f">at least one side hits zero every round → terminates in at most n−1 = 3 transfers</text>
  <text x="20" y="228" font-size="10" fill="#fb863a">but n−1 is a BOUND, not the minimum — the true minimum-transaction problem is NP-hard</text>
  <text x="20" y="248" font-size="9.5" fill="#9099a8">(it is subset-sum in disguise: any subset of people whose nets cancel could settle among themselves)</text>
</svg>`,
        caption:
          "Read the last two lines out loud in the interview. **Saying that the greedy is not provably minimal, and that n−1 is fine anyway, is what separates a good answer from a memorised one.**",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Simplification changes *who pays whom* — and that is a product decision",
        text: "Look at the figure again. Before simplifying, **Arjun owed Priya ₹100**. Afterwards, **Priya pays Arjun ₹216.67** — the direction flipped, and Priya is now sending money to someone she was owed by. The totals are perfectly right and the routing is unrecognisable. Real Splitwise makes simplification **opt-in per group** for exactly this reason: people trust a ledger they can trace back to a dinner. Mention it. It costs one sentence and it shows you thought past the algorithm.",
      },
      {
        type: "code",
        language: "java",
        filename: "simplify, in full",
        code: `/** Greedy: biggest creditor meets biggest debtor. At most n-1 transfers. */
List<Settlement> simplify(List<User> members) {
    PriorityQueue<long[]> creditors = new PriorityQueue<>((a, b) -> Long.compare(b[1], a[1]));
    PriorityQueue<long[]> debtors   = new PriorityQueue<>((a, b) -> Long.compare(b[1], a[1]));

    for (int i = 0; i < members.size(); i++) {
        long net = netOf(members.get(i));                 // sums to 0 across everyone
        if (net > 0) creditors.add(new long[]{i, net});
        else if (net < 0) debtors.add(new long[]{i, -net});
    }

    List<Settlement> out = new ArrayList<>();
    while (!creditors.isEmpty() && !debtors.isEmpty()) {
        long[] credit = creditors.poll(), debt = debtors.poll();
        long amount = Math.min(credit[1], debt[1]);       // one of them hits zero — always
        out.add(new Settlement(members.get((int) debt[0]), members.get((int) credit[0]), amount));

        if (credit[1] > amount) creditors.add(new long[]{credit[0], credit[1] - amount});
        if (debt[1]   > amount) debtors.add(new long[]{debt[0],   debt[1]   - amount});
    }
    return out;                                           // size <= members.size() - 1
}`,
      },

      // ---------- the rest ----------
      { type: "h", text: "Settle up, groups, and the things they ask next" },
      {
        type: "ul",
        items: [
          "**Settle up is an operation, not a reset.** `settleUp(from, to, paise)` moves the balance the other way *and records a `Settlement` row* — who, whom, how much, when. Silently zeroing an edge destroys the only evidence that a payment happened, and it is the first thing an angry user asks about.",
          "**Group vs non-group.** A `Group` is a named set of users plus its expenses. A one-off coffee between two friends belongs to no group — the expense just carries a payer and participants. Do not force a two-person group into existence for every lunch; say this unprompted and it reads as experience.",
          "**Multi-currency.** Store the currency *with* the amount, and never mix currencies on one balance edge — keep one edge per currency pair, or normalise to a base currency. Convert only at **display** time, using the rate **as of the expense date**, not today's. A ₹ balance that changes when the dollar moves is a bug report.",
          "**Concurrency.** Two people add an expense to the same group at the same instant; both read `bal[a][b]`, both write it, one write is lost. That is the same check-then-act shape as [[coffee-machine]]. Take **one lock per group** around `addExpense` — the contended region is a few map writes, so a coarse lock costs nothing. More in [[locks-mutex-semaphore]].",
          "**Editing or deleting a settled expense.** Do not mutate — **reverse** it. Apply the opposite balance movement and keep the original row plus a reversal row. An event log rather than an in-place edit means history is still explainable, and the invariant holds at every step.",
          "**The activity feed and reminders.** The group publishes `ExpenseAdded` and `SettlementRecorded`; feeds, notifications and analytics subscribe. [[observer]] — and it keeps all of that out of `addExpense()`, which stays about money.",
          "**Recurring expenses.** A schedule that creates a normal `Expense` on a timer. No new balance logic at all, which is the answer they want to hear.",
          "**How would you test it?** A property test: generate any sequence of random expenses, settlements and simplifications, and assert after **every single one** that the nets sum to zero and that `bal[a][b] == -bal[b][a]`. That test finds every bug on this page.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 236" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An extensibility cost table. Adding a split type costs one new class implementing SplitStrategy and zero edits elsewhere. Adding settle up costs one method and one Settlement record. Adding multi-currency costs a Money value type and a display-time converter, touching every amount field. Adding simplify debts costs one method on BalanceSheet. Adding an activity feed costs one event publisher and any number of subscribers.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">what a new feature actually costs</text>

  <rect x="20" y="32" width="660" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="34" y="50" font-size="9" fill="#6b7280">feature</text>
  <text x="270" y="50" font-size="9" fill="#6b7280">files touched</text>
  <text x="560" y="50" font-size="9" fill="#6b7280">verdict</text>

  <rect x="20" y="62" width="660" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="82" font-size="10" fill="#e8e4dc">a fifth split type (“by weight”)</text>
  <text x="270" y="82" font-size="10" fill="#9099a8">1 new class — addExpense untouched</text>
  <text x="560" y="82" font-size="10" fill="#5cc66f">free</text>

  <rect x="20" y="96" width="660" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="116" font-size="10" fill="#e8e4dc">settle up</text>
  <text x="270" y="116" font-size="10" fill="#9099a8">1 method + 1 Settlement record</text>
  <text x="560" y="116" font-size="10" fill="#5cc66f">free</text>

  <rect x="20" y="130" width="660" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="150" font-size="10" fill="#e8e4dc">simplify debts</text>
  <text x="270" y="150" font-size="10" fill="#9099a8">1 method on BalanceSheet, ~15 lines</text>
  <text x="560" y="150" font-size="10" fill="#5cc66f">free</text>

  <rect x="20" y="164" width="660" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="184" font-size="10" fill="#e8e4dc">activity feed / reminders</text>
  <text x="270" y="184" font-size="10" fill="#9099a8">1 publisher + N subscribers</text>
  <text x="560" y="184" font-size="10" fill="#5cc66f">free</text>

  <rect x="20" y="198" width="660" height="30" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.45)"/>
  <text x="34" y="218" font-size="10" fill="#fb863a">multi-currency</text>
  <text x="270" y="218" font-size="10" fill="#9099a8">a Money value type — every amount field</text>
  <text x="560" y="218" font-size="10" fill="#fb863a">expensive</text>
</svg>`,
        caption:
          "Only the last row is expensive — which is exactly why you introduce `Money` as a value type on **day one** if there is any chance of a second currency. Everything above it is free because the seams were put in the right places ([[single-responsibility]]).",
      },
      { type: "h", text: "The 60 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 190" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sixty minute budget bar divided into six segments: four minutes clarifying, six minutes on entities and the money decision, six minutes on the API and class diagram, twenty two minutes coding the strategies balance sheet and add expense, twelve minutes on simplify debts, and ten minutes running the demo and answering follow-ups.">
  <text x="20" y="22" font-size="10.5" fill="#9099a8">a 60-minute budget that actually fits</text>

  <rect x="20" y="34" width="46" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="70" y="34" width="70" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="144" y="34" width="70" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="218" y="34" width="256" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="478" y="34" width="86" height="34" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="568" y="34" width="112" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>

  <text x="26" y="56" font-size="9" fill="#9099a8">4m</text>
  <text x="76" y="56" font-size="9" fill="#9099a8">6m</text>
  <text x="150" y="56" font-size="9" fill="#9099a8">6m</text>
  <text x="224" y="56" font-size="9.5" fill="#fb863a">22m</text>
  <text x="484" y="56" font-size="9.5" fill="#5cc66f">12m</text>
  <text x="574" y="56" font-size="9" fill="#9099a8">10m</text>

  <text x="20" y="92" font-size="9.5" fill="#e8e4dc">clarify — how are bills split? one currency? minimise payments?</text>
  <text x="20" y="112" font-size="9.5" fill="#e8e4dc">entities + say “money is integer paise” out loud, and why</text>
  <text x="20" y="132" font-size="9.5" fill="#e8e4dc">APIs + class diagram — the SplitStrategy seam, the BalanceSheet</text>
  <text x="20" y="152" font-size="9.5" fill="#fb863a">code: strategies with their own validation → BalanceSheet.move → addExpense + the assertion</text>
  <text x="20" y="172" font-size="9.5" fill="#5cc66f">simplify() → then main(): 5 expenses, print the edges, simplify, print 3 transfers</text>
  <text x="20" y="188" font-size="9" fill="#6b7280">leave the last 10 minutes: run it, show the zero-sum line, take follow-ups</text>
</svg>`,
        caption:
          "The orange block is not negotiable and the green one is where the offer lives. If you are at minute 40 with no `simplify()`, stop polishing the strategies and write it — a rough simplification beats a beautiful `PercentSplit`.",
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**`double` for money.** The single fastest way to lose this specific problem. It is often the first thing typed and the last thing noticed.",
          "**Splits that are never validated.** 300 + 300 + 300 on a ₹1000 bill goes straight into the sheet, ₹100 appears from nowhere, and the invariant is dead with no error anywhere.",
          "**A growing list of pairwise IOUs.** Thirty rows after ten expenses, folded on every read, and no human can look at it and say what they owe.",
          "**Simplification that does not terminate.** Usually because a settled person is put back in the pool, or because a stale float never quite reaches zero. Integers and “remove whoever hit zero” make it provably finite.",
          "**A new split type that requires editing `addExpense`.** The interface was decoration; the seam was never real.",
          "**No zero-sum check anywhere.** The invariant existed only in your head, so nothing in the code could ever tell you it broke.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Add one expense and watch the chip",
        body:
          "Leave the defaults — payer **Ravi**, **₹1000**, all four participants, **⚖️ Equal** — and press **➕ Add expense**. Three edges appear pointing at Ravi, everyone's net moves, and the **total: ₹0.00** chip flashes green. That chip is the assertion from the lesson, running on every action. It should never move off ₹0.00, no matter what you press.",
      },
      {
        title: "Break the sum on purpose",
        body:
          "Press **🔢 Exact** — the per-person boxes appear, pre-filled with ₹250 each, and the validity line reads `sum: ₹1000.00 ✓`. Now click **Meera** in the participants row to drop her. The boxes still say 250, 250, 250. The line turns red — `splits must sum to ₹1000.00 — got ₹750.00` — and **➕ Add expense** goes red and refuses. Nothing reached the balance sheet. *That refusal is the design point:* the strategy caught it, not the caller.",
      },
      {
        title: "Find the missing paisa",
        body:
          "Press **🪙 Odd split**: ₹100 equally among Ravi, Priya and Arjun. Read the three boxes — **₹33.34 / ₹33.33 / ₹33.33** — and the readout `sum: ₹100.00 ✓`. With a `double` those would be 33.33 each and the sum would be ₹99.99. The leftover paisa was not rounded away; it was **given to the first person**, deterministically, so a test can assert it.",
      },
      {
        title: "Make a real mess",
        body:
          "Press **🎲 Messy weekend** — five expenses, four different payers, equal, share and exact splits. Now count the arrows in the balance graph: **six open edges** between four people. Read the stat row: `expenses 5 · open edges 6 · payments needed 3`. Six IOUs, and only three payments are actually required.",
      },
      {
        title: "Simplify, then look at who pays whom",
        body:
          "Press **⚡ Simplify debts**. Three transfers land one at a time and the counter reads **6 payments → 3 payments**. Now check the second explain line: before you pressed it, **Arjun owed Priya ₹100**; afterwards **Priya pays Arjun ₹216.67**. The nets are identical and the direction flipped. That is why real Splitwise makes this opt-in.",
      },
      {
        title: "Settle one edge, then build it from memory",
        body:
          "Press **💸 Settle up** — the largest edge is paid, zeroed, and *recorded* as a payment row, not silently deleted. Then close this and write it blank-file, in this order: money as `long` paise → `SplitStrategy` with `split()` that **validates its own sum** → `BalanceSheet.move()` writing both `bal[a][b]` and `bal[b][a]` → `Group.addExpense()` ending in `assert Σ net == 0` → `simplify()` with two heaps → a `main()` that runs the five expenses and prints three transfers. If your assertion ever fires, you have found a real bug.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "Splitwise.java",
        code: `import java.util.*;

/* ------------------------------------------------------------------ money */
/** Every amount in this file is an integer number of PAISE. Never a double. */
final class Money {
    static String fmt(long paise) {
        long abs = Math.abs(paise);
        return (paise < 0 ? "-" : "") + "Rs." + (abs / 100) + "." + String.format("%02d", abs % 100);
    }
}

record User(String id, String name) {
    @Override public String toString() { return name; }
}

record Split(User user, long paise) {}

/* -------------------------------------------------------------- strategies */
interface SplitStrategy {
    /** Returns one row per participant. MUST sum to totalPaise. */
    List<Split> split(long totalPaise, List<User> participants);

    /** The gate. Lives here so no caller can forget it. */
    static List<Split> validated(long totalPaise, List<Split> splits) {
        long sum = 0;
        for (Split s : splits) sum += s.paise();
        if (sum != totalPaise)
            throw new IllegalArgumentException(
                "splits must sum to " + Money.fmt(totalPaise) + " - got " + Money.fmt(sum));
        return List.copyOf(splits);
    }

    /**
     * base = total * weight / weightSum (rounds DOWN), then hand the leftover
     * paise out one at a time to the first people. Sum is exact, and it is
     * deterministic, so a test can assert every number.
     */
    static long[] spread(long totalPaise, long[] weights) {
        long weightSum = 0;
        for (long w : weights) {
            if (w < 0) throw new IllegalArgumentException("negative weight");
            weightSum += w;
        }
        if (weightSum == 0) throw new IllegalArgumentException("weights must not all be zero");

        long[] out = new long[weights.length];
        long assigned = 0;
        for (int i = 0; i < weights.length; i++) {
            out[i] = totalPaise * weights[i] / weightSum;
            assigned += out[i];
        }
        for (int i = 0; assigned < totalPaise; i = (i + 1) % out.length, assigned++) out[i]++;
        return out;
    }

    static List<Split> zip(List<User> users, long[] amounts) {
        List<Split> out = new ArrayList<>(users.size());
        for (int i = 0; i < users.size(); i++) out.add(new Split(users.get(i), amounts[i]));
        return out;
    }
}

class EqualSplit implements SplitStrategy {
    public List<Split> split(long totalPaise, List<User> participants) {
        long[] ones = new long[participants.size()];
        Arrays.fill(ones, 1L);
        return SplitStrategy.validated(totalPaise,
                SplitStrategy.zip(participants, SplitStrategy.spread(totalPaise, ones)));
    }
}

class ExactSplit implements SplitStrategy {
    private final long[] amounts;
    ExactSplit(long... amounts) { this.amounts = amounts.clone(); }
    public List<Split> split(long totalPaise, List<User> participants) {
        // No spreading here: the user typed these. validated() is the only defence.
        return SplitStrategy.validated(totalPaise, SplitStrategy.zip(participants, amounts));
    }
}

class PercentSplit implements SplitStrategy {
    private final long[] percents;
    PercentSplit(long... percents) { this.percents = percents.clone(); }
    public List<Split> split(long totalPaise, List<User> participants) {
        long sum = 0;
        for (long p : percents) sum += p;
        if (sum != 100) throw new IllegalArgumentException("percentages must sum to 100 - got " + sum);
        return SplitStrategy.validated(totalPaise,
                SplitStrategy.zip(participants, SplitStrategy.spread(totalPaise, percents)));
    }
}

class ShareSplit implements SplitStrategy {
    private final long[] shares;                 // 2 for the couple, 1 each for the singles
    ShareSplit(long... shares) { this.shares = shares.clone(); }
    public List<Split> split(long totalPaise, List<User> participants) {
        return SplitStrategy.validated(totalPaise,
                SplitStrategy.zip(participants, SplitStrategy.spread(totalPaise, shares)));
    }
}

/* ------------------------------------------------------------ balancesheet */
record Settlement(User from, User to, long paise) {
    @Override public String toString() { return from + " -> " + to + "  " + Money.fmt(paise); }
}

/** Derived state: a NET map, not a log of IOUs. bal[a][b] > 0 means a owes b. */
class BalanceSheet {
    private final Map<String, Map<String, Long>> net = new LinkedHashMap<>();

    /** The antisymmetry is written on every single move. Both lines, or neither. */
    void move(User from, User to, long paise) {
        if (from.equals(to) || paise == 0) return;
        bump(from.id(), to.id(), paise);
        bump(to.id(), from.id(), -paise);
    }

    private void bump(String a, String b, long delta) {
        Map<String, Long> row = net.computeIfAbsent(a, k -> new LinkedHashMap<>());
        long v = row.getOrDefault(b, 0L) + delta;
        if (v == 0) row.remove(b); else row.put(b, v);
    }

    long owes(User a, User b) {                              // O(1) — that is the point
        return net.getOrDefault(a.id(), Map.of()).getOrDefault(b.id(), 0L);
    }

    /** positive = is owed, negative = owes. */
    long netOf(User u) {
        long owed = 0;
        for (long v : net.getOrDefault(u.id(), Map.of()).values()) owed -= v;
        return owed;
    }

    long totalOfAllNets(List<User> members) {
        long s = 0;
        for (User u : members) s += netOf(u);
        return s;                                            // must be exactly 0
    }

    List<Settlement> openEdges(List<User> members) {
        List<Settlement> out = new ArrayList<>();
        for (User a : members)
            for (User b : members)
                if (owes(a, b) > 0) out.add(new Settlement(a, b, owes(a, b)));
        return out;
    }

    /** Greedy: biggest creditor meets biggest debtor. At most n-1 transfers. */
    List<Settlement> simplify(List<User> members) {
        Comparator<long[]> byAmountDesc = (x, y) -> Long.compare(y[1], x[1]);
        PriorityQueue<long[]> creditors = new PriorityQueue<>(byAmountDesc);
        PriorityQueue<long[]> debtors = new PriorityQueue<>(byAmountDesc);

        for (int i = 0; i < members.size(); i++) {
            long n = netOf(members.get(i));
            if (n > 0) creditors.add(new long[]{i, n});
            else if (n < 0) debtors.add(new long[]{i, -n});
        }

        List<Settlement> out = new ArrayList<>();
        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            long[] credit = creditors.poll(), debt = debtors.poll();
            long amount = Math.min(credit[1], debt[1]);      // one side always hits zero
            out.add(new Settlement(members.get((int) debt[0]), members.get((int) credit[0]), amount));
            if (credit[1] > amount) creditors.add(new long[]{credit[0], credit[1] - amount});
            if (debt[1] > amount) debtors.add(new long[]{debt[0], debt[1] - amount});
        }
        return out;
    }

    void replaceWith(List<User> members, List<Settlement> transfers) {
        net.clear();
        for (Settlement t : transfers) move(t.from(), t.to(), t.paise());
    }
}

/* -------------------------------------------------------------------- group */
record Expense(String description, User payer, long totalPaise, List<Split> splits) {}

class Group {
    final String name;
    final List<User> members;
    final List<Expense> expenses = new ArrayList<>();        // the audit trail — kept forever
    final List<Settlement> payments = new ArrayList<>();
    final BalanceSheet balances = new BalanceSheet();
    private final Object lock = new Object();                // one lock per group

    Group(String name, List<User> members) { this.name = name; this.members = List.copyOf(members); }

    Expense addExpense(String description, User payer, long totalPaise,
                       List<User> participants, SplitStrategy strategy) {
        synchronized (lock) {
            if (totalPaise <= 0) throw new IllegalArgumentException("amount must be positive");
            List<Split> splits = strategy.split(totalPaise, participants);   // validates itself
            for (Split s : splits)
                if (!s.user().equals(payer)) balances.move(s.user(), payer, s.paise());
            Expense e = new Expense(description, payer, totalPaise, splits);
            expenses.add(e);
            assertZeroSum();
            return e;
        }
    }

    /** A payment is a balance movement AND a recorded row. Never a silent zeroing. */
    void settleUp(User from, User to, long paise) {
        synchronized (lock) {
            balances.move(to, from, paise);                  // cancels what "from" owed "to"
            payments.add(new Settlement(from, to, paise));
            assertZeroSum();
        }
    }

    List<Settlement> simplifyDebts() {
        synchronized (lock) {
            List<Settlement> transfers = balances.simplify(members);
            balances.replaceWith(members, transfers);
            assertZeroSum();
            return transfers;
        }
    }

    private void assertZeroSum() {
        long total = balances.totalOfAllNets(members);
        if (total != 0) throw new IllegalStateException("BALANCES DO NOT SUM TO ZERO: " + total);
    }
}

/* --------------------------------------------------------------------- demo */
public class Main {
    public static void main(String[] args) {
        User ravi = new User("u1", "Ravi"), priya = new User("u2", "Priya");
        User arjun = new User("u3", "Arjun"), meera = new User("u4", "Meera");
        List<User> all = List.of(ravi, priya, arjun, meera);
        Group g = new Group("Weekend", all);

        g.addExpense("Dinner", ravi, 100_000, all, new EqualSplit());
        g.addExpense("Cab", priya, 90_000, List.of(priya, arjun, meera), new EqualSplit());
        g.addExpense("Movie", arjun, 120_000, all, new ShareSplit(1, 1, 2, 2));
        g.addExpense("Groceries", meera, 80_000, List.of(priya, meera), new ExactSplit(50_000, 30_000));
        g.addExpense("Coffee", ravi, 10_000, List.of(ravi, priya, arjun), new EqualSplit());

        System.out.println("open edges:");
        for (Settlement s : g.balances.openEdges(all)) System.out.println("  " + s);

        System.out.println("nets:");
        for (User u : all) System.out.println("  " + u + "  " + Money.fmt(g.balances.netOf(u)));
        System.out.println("  TOTAL " + g.balances.totalOfAllNets(all) + "   <- must be exactly 0");

        List<Settlement> transfers = g.simplifyDebts();
        System.out.println("simplified: " + g.balances.openEdges(all).size()
                + " payments (was 6, bound is n-1 = " + (all.size() - 1) + ")");
        for (Settlement s : transfers) System.out.println("  " + s);

        g.settleUp(meera, ravi, 45_000);
        System.out.println("after Meera pays Ravi: net(Meera) = " + Money.fmt(g.balances.netOf(meera))
                + ", payments recorded = " + g.payments.size());
        System.out.println("TOTAL still " + g.balances.totalOfAllNets(all));
    }
}

/* ---------------------------------------------------------------- output ---
open edges:
  Priya -> Ravi  Rs.283.33
  Arjun -> Ravi  Rs.83.33
  Arjun -> Priya  Rs.100.00
  Priya -> Meera  Rs.200.00
  Meera -> Ravi  Rs.250.00
  Meera -> Arjun  Rs.400.00
nets:
  Ravi  Rs.616.66
  Priya  -Rs.383.33
  Arjun  Rs.216.67
  Meera  -Rs.450.00
  TOTAL 0   <- must be exactly 0
simplified: 3 payments (was 6, bound is n-1 = 3)
  Meera -> Ravi  Rs.450.00
  Priya -> Arjun  Rs.216.67
  Priya -> Ravi  Rs.166.66
after Meera pays Ravi: net(Meera) = Rs.0.00, payments recorded = 1
TOTAL still 0
--------------------------------------------------------------------------- */`,
      },
      {
        label: "Python",
        language: "python",
        filename: "splitwise.py",
        code: `import heapq
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from threading import RLock

# ------------------------------------------------------------------- money
# Every amount here is an integer number of PAISE. Never a float.


def fmt(paise: int) -> str:
    sign = "-" if paise < 0 else ""
    paise = abs(paise)
    return f"{sign}Rs.{paise // 100}.{paise % 100:02d}"


@dataclass(frozen=True)
class User:
    id: str
    name: str

    def __str__(self) -> str:
        return self.name


@dataclass(frozen=True)
class Split:
    user: User
    paise: int


# -------------------------------------------------------------- strategies
def validated(total_paise: int, splits: list[Split]) -> list[Split]:
    """The gate. Lives here so no caller can forget it."""
    total = sum(s.paise for s in splits)
    if total != total_paise:
        raise ValueError(f"splits must sum to {fmt(total_paise)} - got {fmt(total)}")
    return splits


def spread(total_paise: int, weights: list[int]) -> list[int]:
    """
    Integer division rounds DOWN, then the leftover paise are handed out one at
    a time to the first people. Sum is exact and the result is deterministic.
    10000 among 3 -> [3334, 3333, 3333]
    """
    weight_sum = sum(weights)
    if weight_sum == 0:
        raise ValueError("weights must not all be zero")
    out = [total_paise * w // weight_sum for w in weights]
    leftover = total_paise - sum(out)
    for i in range(leftover):
        out[i % len(out)] += 1
    return out


class SplitStrategy(ABC):
    @abstractmethod
    def split(self, total_paise: int, participants: list[User]) -> list[Split]:
        """Returns one row per participant. MUST sum to total_paise."""


class EqualSplit(SplitStrategy):
    def split(self, total_paise, participants):
        amounts = spread(total_paise, [1] * len(participants))
        return validated(total_paise, [Split(u, a) for u, a in zip(participants, amounts)])


class ExactSplit(SplitStrategy):
    def __init__(self, *amounts: int):
        self.amounts = list(amounts)

    def split(self, total_paise, participants):
        # No spreading: the user typed these. validated() is the only defence.
        return validated(total_paise, [Split(u, a) for u, a in zip(participants, self.amounts)])


class PercentSplit(SplitStrategy):
    def __init__(self, *percents: int):
        self.percents = list(percents)

    def split(self, total_paise, participants):
        if sum(self.percents) != 100:
            raise ValueError(f"percentages must sum to 100 - got {sum(self.percents)}")
        amounts = spread(total_paise, self.percents)
        return validated(total_paise, [Split(u, a) for u, a in zip(participants, amounts)])


class ShareSplit(SplitStrategy):
    def __init__(self, *shares: int):      # 2 for the couple, 1 each for the singles
        self.shares = list(shares)

    def split(self, total_paise, participants):
        amounts = spread(total_paise, self.shares)
        return validated(total_paise, [Split(u, a) for u, a in zip(participants, amounts)])


# ------------------------------------------------------------ balance sheet
@dataclass(frozen=True)
class Settlement:
    frm: User
    to: User
    paise: int

    def __str__(self) -> str:
        return f"{self.frm} -> {self.to}  {fmt(self.paise)}"


class BalanceSheet:
    """Derived state: a NET map, not a log of IOUs. net[a][b] > 0 means a owes b."""

    def __init__(self) -> None:
        self._net: dict[str, dict[str, int]] = {}

    def move(self, frm: User, to: User, paise: int) -> None:
        """The antisymmetry is written on every move. Both lines, or neither."""
        if frm == to or paise == 0:
            return
        self._bump(frm.id, to.id, paise)
        self._bump(to.id, frm.id, -paise)

    def _bump(self, a: str, b: str, delta: int) -> None:
        row = self._net.setdefault(a, {})
        v = row.get(b, 0) + delta
        if v == 0:
            row.pop(b, None)
        else:
            row[b] = v

    def owes(self, a: User, b: User) -> int:          # O(1) — that is the point
        return self._net.get(a.id, {}).get(b.id, 0)

    def net_of(self, u: User) -> int:                 # positive = is owed
        return -sum(self._net.get(u.id, {}).values())

    def total_of_all_nets(self, members: list[User]) -> int:
        return sum(self.net_of(u) for u in members)   # must be exactly 0

    def open_edges(self, members: list[User]) -> list[Settlement]:
        return [Settlement(a, b, self.owes(a, b))
                for a in members for b in members if self.owes(a, b) > 0]

    def simplify(self, members: list[User]) -> list[Settlement]:
        """Greedy: biggest creditor meets biggest debtor. At most n-1 transfers."""
        creditors: list[tuple[int, int]] = []         # (-amount, index) -> max-heap
        debtors: list[tuple[int, int]] = []
        for i, u in enumerate(members):
            n = self.net_of(u)
            if n > 0:
                heapq.heappush(creditors, (-n, i))
            elif n < 0:
                heapq.heappush(debtors, (n, i))       # n is already negative

        out: list[Settlement] = []
        while creditors and debtors:
            credit, ci = heapq.heappop(creditors)
            debt, di = heapq.heappop(debtors)
            amount = min(-credit, -debt)              # one side always hits zero
            out.append(Settlement(members[di], members[ci], amount))
            if -credit > amount:
                heapq.heappush(creditors, (credit + amount, ci))
            if -debt > amount:
                heapq.heappush(debtors, (debt + amount, di))
        return out

    def replace_with(self, transfers: list[Settlement]) -> None:
        self._net.clear()
        for t in transfers:
            self.move(t.frm, t.to, t.paise)


# --------------------------------------------------------------------- group
@dataclass(frozen=True)
class Expense:
    description: str
    payer: User
    total_paise: int
    splits: list[Split]


class Group:
    def __init__(self, name: str, members: list[User]) -> None:
        self.name = name
        self.members = list(members)
        self.expenses: list[Expense] = []             # the audit trail — kept forever
        self.payments: list[Settlement] = []
        self.balances = BalanceSheet()
        self._lock = RLock()                          # one lock per group

    def add_expense(self, description, payer, total_paise, participants, strategy) -> Expense:
        with self._lock:
            if total_paise <= 0:
                raise ValueError("amount must be positive")
            splits = strategy.split(total_paise, participants)   # validates itself
            for s in splits:
                if s.user != payer:
                    self.balances.move(s.user, payer, s.paise)
            e = Expense(description, payer, total_paise, splits)
            self.expenses.append(e)
            self._assert_zero_sum()
            return e

    def settle_up(self, frm: User, to: User, paise: int) -> None:
        """A payment is a balance movement AND a recorded row. Never a silent zeroing."""
        with self._lock:
            self.balances.move(to, frm, paise)
            self.payments.append(Settlement(frm, to, paise))
            self._assert_zero_sum()

    def simplify_debts(self) -> list[Settlement]:
        with self._lock:
            transfers = self.balances.simplify(self.members)
            self.balances.replace_with(transfers)
            self._assert_zero_sum()
            return transfers

    def _assert_zero_sum(self) -> None:
        total = self.balances.total_of_all_nets(self.members)
        if total != 0:
            raise AssertionError(f"BALANCES DO NOT SUM TO ZERO: {total}")


# ---------------------------------------------------------------------- demo
if __name__ == "__main__":
    ravi, priya = User("u1", "Ravi"), User("u2", "Priya")
    arjun, meera = User("u3", "Arjun"), User("u4", "Meera")
    everyone = [ravi, priya, arjun, meera]
    g = Group("Weekend", everyone)

    g.add_expense("Dinner", ravi, 100_000, everyone, EqualSplit())
    g.add_expense("Cab", priya, 90_000, [priya, arjun, meera], EqualSplit())
    g.add_expense("Movie", arjun, 120_000, everyone, ShareSplit(1, 1, 2, 2))
    g.add_expense("Groceries", meera, 80_000, [priya, meera], ExactSplit(50_000, 30_000))
    g.add_expense("Coffee", ravi, 10_000, [ravi, priya, arjun], EqualSplit())

    print("open edges:")
    for s in g.balances.open_edges(everyone):
        print(" ", s)

    print("nets:")
    for u in everyone:
        print(" ", u, fmt(g.balances.net_of(u)))
    print("  TOTAL", g.balances.total_of_all_nets(everyone), "  <- must be exactly 0")

    transfers = g.simplify_debts()
    print(f"simplified: {len(transfers)} payments (was 6, bound is n-1 = {len(everyone) - 1})")
    for s in transfers:
        print(" ", s)

    g.settle_up(meera, ravi, 45_000)
    print("after Meera pays Ravi: net(Meera) =", fmt(g.balances.net_of(meera)),
          ", payments recorded =", len(g.payments))
    print("TOTAL still", g.balances.total_of_all_nets(everyone))

# ---------------------------------------------------------------- output ---
# open edges:
#   Priya -> Ravi  Rs.283.33
#   Arjun -> Ravi  Rs.83.33
#   Arjun -> Priya  Rs.100.00
#   Priya -> Meera  Rs.200.00
#   Meera -> Ravi  Rs.250.00
#   Meera -> Arjun  Rs.400.00
# nets:
#   Ravi Rs.616.66
#   Priya -Rs.383.33
#   Arjun Rs.216.67
#   Meera -Rs.450.00
#   TOTAL 0   <- must be exactly 0
# simplified: 3 payments (was 6, bound is n-1 = 3)
#   Meera -> Ravi  Rs.450.00
#   Priya -> Arjun  Rs.216.67
#   Priya -> Ravi  Rs.166.66
# after Meera pays Ravi: net(Meera) = Rs.0.00 , payments recorded = 1
# TOTAL still 0
# ---------------------------------------------------------------------------`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "splitwise.cpp",
        code: `#include <algorithm>
#include <iostream>
#include <map>
#include <memory>
#include <mutex>
#include <numeric>
#include <queue>
#include <stdexcept>
#include <string>
#include <vector>

// ------------------------------------------------------------------ money
// Every amount here is an integer number of PAISE (long long). Never a double.
static std::string fmt(long long paise) {
    std::string sign = paise < 0 ? "-" : "";
    long long a = paise < 0 ? -paise : paise;
    std::string p = std::to_string(a % 100);
    if (p.size() == 1) p = "0" + p;
    return sign + "Rs." + std::to_string(a / 100) + "." + p;
}

struct User {
    std::string id, name;
    bool operator==(const User& o) const { return id == o.id; }
};

struct Split {
    User user;
    long long paise;
};

// -------------------------------------------------------------- strategies
static std::vector<Split> validated(long long totalPaise, std::vector<Split> splits) {
    long long sum = 0;
    for (const auto& s : splits) sum += s.paise;
    if (sum != totalPaise)
        throw std::invalid_argument("splits must sum to " + fmt(totalPaise) + " - got " + fmt(sum));
    return splits;                                  // the gate — no caller can forget it
}

// Integer division rounds DOWN; the leftover paise are handed out one at a
// time to the first people. Exact sum, deterministic, therefore testable.
static std::vector<long long> spread(long long totalPaise, const std::vector<long long>& weights) {
    long long weightSum = std::accumulate(weights.begin(), weights.end(), 0LL);
    if (weightSum == 0) throw std::invalid_argument("weights must not all be zero");

    std::vector<long long> out(weights.size());
    long long assigned = 0;
    for (size_t i = 0; i < weights.size(); ++i) {
        out[i] = totalPaise * weights[i] / weightSum;
        assigned += out[i];
    }
    for (size_t i = 0; assigned < totalPaise; i = (i + 1) % out.size(), ++assigned) out[i]++;
    return out;
}

static std::vector<Split> zip(const std::vector<User>& users, const std::vector<long long>& amounts) {
    std::vector<Split> out;
    for (size_t i = 0; i < users.size(); ++i) out.push_back({users[i], amounts[i]});
    return out;
}

struct SplitStrategy {
    virtual ~SplitStrategy() = default;
    // Returns one row per participant. MUST sum to totalPaise.
    virtual std::vector<Split> split(long long totalPaise, const std::vector<User>& parts) const = 0;
};

struct EqualSplit : SplitStrategy {
    std::vector<Split> split(long long total, const std::vector<User>& parts) const override {
        return validated(total, zip(parts, spread(total, std::vector<long long>(parts.size(), 1))));
    }
};

struct ExactSplit : SplitStrategy {
    std::vector<long long> amounts;
    explicit ExactSplit(std::vector<long long> a) : amounts(std::move(a)) {}
    std::vector<Split> split(long long total, const std::vector<User>& parts) const override {
        // No spreading: the user typed these. validated() is the only defence.
        return validated(total, zip(parts, amounts));
    }
};

struct PercentSplit : SplitStrategy {
    std::vector<long long> percents;
    explicit PercentSplit(std::vector<long long> p) : percents(std::move(p)) {}
    std::vector<Split> split(long long total, const std::vector<User>& parts) const override {
        long long s = std::accumulate(percents.begin(), percents.end(), 0LL);
        if (s != 100) throw std::invalid_argument("percentages must sum to 100 - got " + std::to_string(s));
        return validated(total, zip(parts, spread(total, percents)));
    }
};

struct ShareSplit : SplitStrategy {                 // 2 for the couple, 1 each for the singles
    std::vector<long long> shares;
    explicit ShareSplit(std::vector<long long> s) : shares(std::move(s)) {}
    std::vector<Split> split(long long total, const std::vector<User>& parts) const override {
        return validated(total, zip(parts, spread(total, shares)));
    }
};

// ------------------------------------------------------------ balance sheet
struct Settlement {
    User from, to;
    long long paise;
    std::string str() const { return from.name + " -> " + to.name + "  " + fmt(paise); }
};

// Derived state: a NET map, not a log of IOUs. net[a][b] > 0 means a owes b.
class BalanceSheet {
public:
    // The antisymmetry is written on every move. Both lines, or neither.
    void move(const User& from, const User& to, long long paise) {
        if (from == to || paise == 0) return;
        bump(from.id, to.id, paise);
        bump(to.id, from.id, -paise);
    }

    long long owes(const User& a, const User& b) const {     // O(1) — that is the point
        auto r = net_.find(a.id);
        if (r == net_.end()) return 0;
        auto c = r->second.find(b.id);
        return c == r->second.end() ? 0 : c->second;
    }

    long long netOf(const User& u) const {                   // positive = is owed
        auto r = net_.find(u.id);
        if (r == net_.end()) return 0;
        long long owed = 0;
        for (const auto& kv : r->second) owed -= kv.second;
        return owed;
    }

    long long totalOfAllNets(const std::vector<User>& members) const {
        long long s = 0;
        for (const auto& u : members) s += netOf(u);
        return s;                                            // must be exactly 0
    }

    std::vector<Settlement> openEdges(const std::vector<User>& members) const {
        std::vector<Settlement> out;
        for (const auto& a : members)
            for (const auto& b : members)
                if (owes(a, b) > 0) out.push_back({a, b, owes(a, b)});
        return out;
    }

    // Greedy: biggest creditor meets biggest debtor. At most n-1 transfers.
    std::vector<Settlement> simplify(const std::vector<User>& members) const {
        using Entry = std::pair<long long, int>;             // (amount, index)
        std::priority_queue<Entry> creditors, debtors;
        for (int i = 0; i < static_cast<int>(members.size()); ++i) {
            long long n = netOf(members[i]);
            if (n > 0) creditors.push({n, i});
            else if (n < 0) debtors.push({-n, i});
        }

        std::vector<Settlement> out;
        while (!creditors.empty() && !debtors.empty()) {
            auto credit = creditors.top(); creditors.pop();
            auto debt = debtors.top(); debtors.pop();
            long long amount = std::min(credit.first, debt.first);   // one side hits zero
            out.push_back({members[debt.second], members[credit.second], amount});
            if (credit.first > amount) creditors.push({credit.first - amount, credit.second});
            if (debt.first > amount) debtors.push({debt.first - amount, debt.second});
        }
        return out;
    }

    void replaceWith(const std::vector<Settlement>& transfers) {
        net_.clear();
        for (const auto& t : transfers) move(t.from, t.to, t.paise);
    }

private:
    void bump(const std::string& a, const std::string& b, long long delta) {
        long long v = net_[a][b] + delta;
        if (v == 0) net_[a].erase(b); else net_[a][b] = v;
    }
    std::map<std::string, std::map<std::string, long long>> net_;
};

// --------------------------------------------------------------------- group
struct Expense {
    std::string description;
    User payer;
    long long totalPaise;
    std::vector<Split> splits;
};

class Group {
public:
    Group(std::string name, std::vector<User> members)
        : name_(std::move(name)), members_(std::move(members)) {}

    void addExpense(const std::string& description, const User& payer, long long totalPaise,
                    const std::vector<User>& parts, const SplitStrategy& strategy) {
        std::lock_guard<std::mutex> guard(lock_);            // one lock per group
        if (totalPaise <= 0) throw std::invalid_argument("amount must be positive");
        auto splits = strategy.split(totalPaise, parts);     // validates itself
        for (const auto& s : splits)
            if (!(s.user == payer)) balances.move(s.user, payer, s.paise);
        expenses.push_back({description, payer, totalPaise, splits});   // the audit trail
        assertZeroSum();
    }

    // A payment is a balance movement AND a recorded row. Never a silent zeroing.
    void settleUp(const User& from, const User& to, long long paise) {
        std::lock_guard<std::mutex> guard(lock_);
        balances.move(to, from, paise);
        payments.push_back({from, to, paise});
        assertZeroSum();
    }

    std::vector<Settlement> simplifyDebts() {
        std::lock_guard<std::mutex> guard(lock_);
        auto transfers = balances.simplify(members_);
        balances.replaceWith(transfers);
        assertZeroSum();
        return transfers;
    }

    const std::vector<User>& members() const { return members_; }

    BalanceSheet balances;
    std::vector<Expense> expenses;
    std::vector<Settlement> payments;

private:
    void assertZeroSum() const {
        long long total = balances.totalOfAllNets(members_);
        if (total != 0)
            throw std::runtime_error("BALANCES DO NOT SUM TO ZERO: " + std::to_string(total));
    }
    std::string name_;
    std::vector<User> members_;
    std::mutex lock_;
};

// ---------------------------------------------------------------------- demo
int main() {
    User ravi{"u1", "Ravi"}, priya{"u2", "Priya"}, arjun{"u3", "Arjun"}, meera{"u4", "Meera"};
    std::vector<User> all{ravi, priya, arjun, meera};
    Group g("Weekend", all);

    g.addExpense("Dinner", ravi, 100000, all, EqualSplit{});
    g.addExpense("Cab", priya, 90000, {priya, arjun, meera}, EqualSplit{});
    g.addExpense("Movie", arjun, 120000, all, ShareSplit{{1, 1, 2, 2}});
    g.addExpense("Groceries", meera, 80000, {priya, meera}, ExactSplit{{50000, 30000}});
    g.addExpense("Coffee", ravi, 10000, {ravi, priya, arjun}, EqualSplit{});

    std::cout << "open edges:\\n";
    for (const auto& s : g.balances.openEdges(all)) std::cout << "  " << s.str() << "\\n";

    std::cout << "nets:\\n";
    for (const auto& u : all) std::cout << "  " << u.name << "  " << fmt(g.balances.netOf(u)) << "\\n";
    std::cout << "  TOTAL " << g.balances.totalOfAllNets(all) << "   <- must be exactly 0\\n";

    auto transfers = g.simplifyDebts();
    std::cout << "simplified: " << transfers.size() << " payments (was 6, bound is n-1 = "
              << all.size() - 1 << ")\\n";
    for (const auto& s : transfers) std::cout << "  " << s.str() << "\\n";

    g.settleUp(meera, ravi, 45000);
    std::cout << "after Meera pays Ravi: net(Meera) = " << fmt(g.balances.netOf(meera))
              << ", payments recorded = " << g.payments.size() << "\\n";
    std::cout << "TOTAL still " << g.balances.totalOfAllNets(all) << "\\n";
}

/* ---------------------------------------------------------------- output ---
open edges:
  Arjun -> Priya  Rs.100.00
  Arjun -> Ravi  Rs.83.33
  Meera -> Arjun  Rs.400.00
  Meera -> Ravi  Rs.250.00
  Priya -> Meera  Rs.200.00
  Priya -> Ravi  Rs.283.33
nets:
  Ravi  Rs.616.66
  Priya  -Rs.383.33
  Arjun  Rs.216.67
  Meera  -Rs.450.00
  TOTAL 0   <- must be exactly 0
simplified: 3 payments (was 6, bound is n-1 = 3)
  Meera -> Ravi  Rs.450.00
  Priya -> Arjun  Rs.216.67
  Priya -> Ravi  Rs.166.66
after Meera pays Ravi: net(Meera) = Rs.0.00, payments recorded = 1
TOTAL still 0
--------------------------------------------------------------------------- */`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "splitwise.ts",
        code: `/* ------------------------------------------------------------------ money */
/** Paise is a whole number of paise. Never a float, never a "rupees" number. */
type Paise = number;

function fmt(paise: Paise): string {
    const sign = paise < 0 ? "-" : "";
    const a = Math.abs(paise);
    return sign + "Rs." + Math.floor(a / 100) + "." + String(a % 100).padStart(2, "0");
}

interface User { id: string; name: string; }
interface Split { user: User; paise: Paise; }

/* -------------------------------------------------------------- strategies */
/** The gate. Lives here so no caller can forget it. */
function validated(totalPaise: Paise, splits: Split[]): Split[] {
    const sum = splits.reduce((acc, s) => acc + s.paise, 0);
    if (sum !== totalPaise)
        throw new Error("splits must sum to " + fmt(totalPaise) + " - got " + fmt(sum));
    return splits;
}

/**
 * Integer division rounds DOWN, then the leftover paise are handed out one at
 * a time to the first people. Exact sum, deterministic, therefore testable.
 * spread(10000, [1,1,1]) -> [3334, 3333, 3333]
 */
function spread(totalPaise: Paise, weights: number[]): Paise[] {
    const weightSum = weights.reduce((a, b) => a + b, 0);
    if (weightSum === 0) throw new Error("weights must not all be zero");

    const out = weights.map((w) => Math.floor((totalPaise * w) / weightSum));
    let leftover = totalPaise - out.reduce((a, b) => a + b, 0);
    for (let i = 0; leftover > 0; i = (i + 1) % out.length, leftover--) out[i]++;
    return out;
}

const zip = (users: User[], amounts: Paise[]): Split[] =>
    users.map((user, i) => ({ user, paise: amounts[i] }));

interface SplitStrategy {
    /** Returns one row per participant. MUST sum to totalPaise. */
    split(totalPaise: Paise, participants: User[]): Split[];
}

class EqualSplit implements SplitStrategy {
    split(total: Paise, parts: User[]): Split[] {
        return validated(total, zip(parts, spread(total, parts.map(() => 1))));
    }
}

class ExactSplit implements SplitStrategy {
    constructor(private readonly amounts: Paise[]) {}
    split(total: Paise, parts: User[]): Split[] {
        // No spreading: the user typed these. validated() is the only defence.
        return validated(total, zip(parts, this.amounts));
    }
}

class PercentSplit implements SplitStrategy {
    constructor(private readonly percents: number[]) {}
    split(total: Paise, parts: User[]): Split[] {
        const s = this.percents.reduce((a, b) => a + b, 0);
        if (s !== 100) throw new Error("percentages must sum to 100 - got " + s);
        return validated(total, zip(parts, spread(total, this.percents)));
    }
}

class ShareSplit implements SplitStrategy {          // 2 for the couple, 1 each for singles
    constructor(private readonly shares: number[]) {}
    split(total: Paise, parts: User[]): Split[] {
        return validated(total, zip(parts, spread(total, this.shares)));
    }
}

/* ------------------------------------------------------------ balance sheet */
interface Settlement { from: User; to: User; paise: Paise; }
const show = (s: Settlement) => s.from.name + " -> " + s.to.name + "  " + fmt(s.paise);

/** Derived state: a NET map, not a log of IOUs. net[a][b] > 0 means a owes b. */
class BalanceSheet {
    private readonly net = new Map<string, Map<string, Paise>>();

    /** The antisymmetry is written on every move. Both lines, or neither. */
    move(from: User, to: User, paise: Paise): void {
        if (from.id === to.id || paise === 0) return;
        this.bump(from.id, to.id, paise);
        this.bump(to.id, from.id, -paise);
    }

    private bump(a: string, b: string, delta: Paise): void {
        const row = this.net.get(a) ?? new Map<string, Paise>();
        this.net.set(a, row);
        const v = (row.get(b) ?? 0) + delta;
        if (v === 0) row.delete(b); else row.set(b, v);
    }

    owes(a: User, b: User): Paise {                  // O(1) — that is the point
        return this.net.get(a.id)?.get(b.id) ?? 0;
    }

    netOf(u: User): Paise {                          // positive = is owed
        let owed = 0;
        for (const v of this.net.get(u.id)?.values() ?? []) owed -= v;
        return owed;
    }

    totalOfAllNets(members: User[]): Paise {
        return members.reduce((acc, u) => acc + this.netOf(u), 0);   // must be exactly 0
    }

    openEdges(members: User[]): Settlement[] {
        const out: Settlement[] = [];
        for (const a of members)
            for (const b of members)
                if (this.owes(a, b) > 0) out.push({ from: a, to: b, paise: this.owes(a, b) });
        return out;
    }

    /** Greedy: biggest creditor meets biggest debtor. At most n-1 transfers. */
    simplify(members: User[]): Settlement[] {
        const creditors: Array<[User, Paise]> = [];
        const debtors: Array<[User, Paise]> = [];
        for (const u of members) {
            const n = this.netOf(u);
            if (n > 0) creditors.push([u, n]);
            else if (n < 0) debtors.push([u, -n]);
        }

        const out: Settlement[] = [];
        while (creditors.length && debtors.length) {
            creditors.sort((x, y) => y[1] - x[1]);
            debtors.sort((x, y) => y[1] - x[1]);
            const credit = creditors[0], debt = debtors[0];
            const amount = Math.min(credit[1], debt[1]);   // one side always hits zero
            out.push({ from: debt[0], to: credit[0], paise: amount });
            credit[1] -= amount; debt[1] -= amount;
            if (credit[1] === 0) creditors.shift();
            if (debt[1] === 0) debtors.shift();
        }
        return out;
    }

    replaceWith(transfers: Settlement[]): void {
        this.net.clear();
        for (const t of transfers) this.move(t.from, t.to, t.paise);
    }
}

/* --------------------------------------------------------------------- group */
interface Expense { description: string; payer: User; totalPaise: Paise; splits: Split[]; }

class Group {
    readonly expenses: Expense[] = [];               // the audit trail — kept forever
    readonly payments: Settlement[] = [];
    readonly balances = new BalanceSheet();

    constructor(readonly name: string, readonly members: User[]) {}

    addExpense(description: string, payer: User, totalPaise: Paise,
               participants: User[], strategy: SplitStrategy): Expense {
        if (totalPaise <= 0) throw new Error("amount must be positive");
        const splits = strategy.split(totalPaise, participants);   // validates itself
        for (const s of splits)
            if (s.user.id !== payer.id) this.balances.move(s.user, payer, s.paise);
        const e: Expense = { description, payer, totalPaise, splits };
        this.expenses.push(e);
        this.assertZeroSum();
        return e;
    }

    /** A payment is a balance movement AND a recorded row. Never a silent zeroing. */
    settleUp(from: User, to: User, paise: Paise): void {
        this.balances.move(to, from, paise);
        this.payments.push({ from, to, paise });
        this.assertZeroSum();
    }

    simplifyDebts(): Settlement[] {
        const transfers = this.balances.simplify(this.members);
        this.balances.replaceWith(transfers);
        this.assertZeroSum();
        return transfers;
    }

    private assertZeroSum(): void {
        const total = this.balances.totalOfAllNets(this.members);
        if (total !== 0) throw new Error("BALANCES DO NOT SUM TO ZERO: " + total);
    }
}

/* ---------------------------------------------------------------------- demo */
const ravi: User = { id: "u1", name: "Ravi" };
const priya: User = { id: "u2", name: "Priya" };
const arjun: User = { id: "u3", name: "Arjun" };
const meera: User = { id: "u4", name: "Meera" };
const everyone = [ravi, priya, arjun, meera];
const g = new Group("Weekend", everyone);

g.addExpense("Dinner", ravi, 100000, everyone, new EqualSplit());
g.addExpense("Cab", priya, 90000, [priya, arjun, meera], new EqualSplit());
g.addExpense("Movie", arjun, 120000, everyone, new ShareSplit([1, 1, 2, 2]));
g.addExpense("Groceries", meera, 80000, [priya, meera], new ExactSplit([50000, 30000]));
g.addExpense("Coffee", ravi, 10000, [ravi, priya, arjun], new EqualSplit());

console.log("open edges:");
for (const s of g.balances.openEdges(everyone)) console.log("  " + show(s));

console.log("nets:");
for (const u of everyone) console.log("  " + u.name + "  " + fmt(g.balances.netOf(u)));
console.log("  TOTAL " + g.balances.totalOfAllNets(everyone) + "   <- must be exactly 0");

const transfers = g.simplifyDebts();
console.log("simplified: " + transfers.length + " payments (was 6, bound is n-1 = "
    + (everyone.length - 1) + ")");
for (const s of transfers) console.log("  " + show(s));

g.settleUp(meera, ravi, 45000);
console.log("after Meera pays Ravi: net(Meera) = " + fmt(g.balances.netOf(meera))
    + ", payments recorded = " + g.payments.length);
console.log("TOTAL still " + g.balances.totalOfAllNets(everyone));

/* ---------------------------------------------------------------- output ---
open edges:
  Priya -> Ravi  Rs.283.33
  Arjun -> Ravi  Rs.83.33
  Arjun -> Priya  Rs.100.00
  Priya -> Meera  Rs.200.00
  Meera -> Ravi  Rs.250.00
  Meera -> Arjun  Rs.400.00
nets:
  Ravi  Rs.616.66
  Priya  -Rs.383.33
  Arjun  Rs.216.67
  Meera  -Rs.450.00
  TOTAL 0   <- must be exactly 0
simplified: 3 payments (was 6, bound is n-1 = 3)
  Meera -> Ravi  Rs.450.00
  Priya -> Arjun  Rs.216.67
  Priya -> Ravi  Rs.166.66
after Meera pays Ravi: net(Meera) = Rs.0.00, payments recorded = 1
TOTAL still 0
--------------------------------------------------------------------------- */`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Strip the friends and the dinner away and this is **a system with a conservation law**. Some quantity moves between parties, and the total across all parties must never change. Once you see it that way, the same three moves apply everywhere: integers for the quantity, one operation that moves it across exactly one edge, and an assertion on the total after every move.",
      },
      {
        type: "ul",
        items: [
          "**Double-entry bookkeeping** — the 500-year-old version of this exact idea. Every debit has a matching credit, and the ledger balances or something is wrong.",
          "**Inventory transfers between warehouses** — stock leaves one and arrives at another; the global count is the invariant. A partial move is a lost pallet.",
          "**Wallet and payment ledgers** — money out of one account, into another, and never a `double`. This is where the paise rule stops being an interview trick and becomes a compliance requirement.",
          "**Token or credit allocation** — a quota moved between teams. Same shape, smaller stakes.",
          "**Any graph reduced to net flow** — the simplification step is just netting a flow network before routing it, which shows up in clearing houses and settlement systems.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The 20-second version to say out loud",
        text: "*“Money is an integer number of paise. Balances are a net map with `bal[a][b] == -bal[b][a]` written on every move, so the whole sheet always sums to zero — and I assert that after every operation. Splits go behind one interface, and each strategy validates that its own output sums to the total, so an invalid split can never reach the sheet. Simplification is greedy — biggest creditor against biggest debtor — which is at most n−1 transfers but is not provably minimal.”*",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When there are millions of members in a group.** The net map is a dense pairwise structure; at that size you store per-user net totals against the group instead of edges, and reconstruct pair balances on demand.",
          "**When the balance must survive a crash.** The in-memory map plus an in-process lock becomes a database transaction — the expense row and the balance updates must commit together, or you get exactly the half-applied edge the antisymmetry was protecting you from.",
          "**When there are real payments involved.** `settleUp` here is an assertion that money moved. With a real gateway it becomes a two-phase thing: record an intent, wait for the callback, then move the balance — and now you need idempotency on the callback.",
          "**When currencies float.** One balance edge per currency is fine until someone settles a ₹ debt in $. At that point the exchange itself is an expense, and somebody has to own the difference.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Write the invariant as code, not as a comment.** `assert sum(nets) == 0` at the end of every mutating method costs one line and turns every bug on this page — bad splits, a lost paisa, a half-applied edge, a broken simplification — into a stack trace on the very operation that caused it.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Integer paise make the zero-sum check an exact equality, so the invariant can be asserted rather than approximated — and no expense can ever leak a fraction.",
        "Validation inside each SplitStrategy means an invalid split is impossible to record, no matter which caller invokes it or how many callers appear later.",
        "A net balance map answers “what do I owe you?” in O(1) and stays readable to a human, instead of growing one IOU row per participant per expense.",
        "Writing bal[a][b] and bal[b][a] together makes a half-applied edge unrepresentable, which is what keeps the sheet self-balancing under any sequence of operations.",
        "Greedy simplification is about fifteen lines, provably terminates in at most n−1 transfers, and is the follow-up interviewers reach for most often.",
      ],
      cons: [
        "The net map is pairwise, so memory grows with the square of group size — fine for a dinner, wrong for a ten-thousand-member group.",
        "Greedy simplification is not guaranteed minimal; the true minimum-transaction problem is NP-hard, so you are shipping a bound rather than an optimum.",
        "Simplification rewrites who pays whom, which is arithmetically correct and socially confusing — real products have to make it opt-in.",
        "Because balances are derived, any bug in a mutation silently diverges them from the expense log until something recomputes from scratch; the assertion catches sums, not attribution.",
        "One lock per group serialises concurrent expense entry for that group, and a very active group would need the balance updates pushed into the database rather than held in memory.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "awesome-low-level-design — Splitwise problem",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/splitwise.md",
        kind: "article",
        note: "The canonical write-up of this exact interview problem, with the entity list most interviewers have in their head.",
      },
      {
        label: "Martin Fowler — Money (from Patterns of Enterprise Application Architecture)",
        href: "https://martinfowler.com/eaaCatalog/money.html",
        kind: "article",
        note: "Why money is a value type carrying an amount and a currency, and why the amount is an integer of the smallest unit. Read this before you type `double`.",
      },
      {
        label: "What Every Computer Scientist Should Know About Floating-Point Arithmetic",
        href: "https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html",
        kind: "paper",
        note: "Goldberg's classic. The section on why 0.1 has no exact binary representation is the whole argument for integer paise, in more rigour than you will ever need in an interview.",
      },
      {
        label: "Splitwise — how debt simplification works",
        href: "https://blog.splitwise.com/2012/09/14/debts-made-simple/",
        kind: "article",
        note: "The real product explaining the real feature, including why it is opt-in and what users find confusing about it.",
      },
      {
        label: "java.math.BigDecimal — Java documentation",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html",
        kind: "docs",
        note: "The other correct answer for money in Java. Note setScale and RoundingMode — if you use it, you must pick a rounding mode explicitly.",
      },
      {
        label: "Partition problem — the NP-hard core of minimum settlements",
        href: "https://en.wikipedia.org/wiki/Partition_problem",
        kind: "article",
        note: "Why “minimum number of transactions” is not solvable greedily: it reduces to finding subsets whose balances cancel. Worth being able to name.",
      },
      {
        label: "Domain-Driven Design — Eric Evans",
        kind: "book",
        note: "Chapters on Value Objects and Aggregates. Money is the textbook value object, and Group is the textbook aggregate root that owns its invariant.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "splitwise-q1",
        question: "You split ₹100 equally among three people using doubles. What actually goes wrong?",
        options: [
          { id: "a", label: "Each person owes 33.33, the three shares add to 99.99, and a paisa vanishes — so the balances no longer sum to zero." },
          { id: "b", label: "Nothing — 33.333… is close enough for a bill-splitting app." },
          { id: "c", label: "The program throws an ArithmeticException on the division." },
          { id: "d", label: "One person is charged 33.34 automatically by the language runtime." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is the tempting answer, and it is how the bug ships: the error is a single paisa, so nobody notices until it has happened ten thousand times. Integer paise plus explicit remainder distribution — base = total / n, then give the leftover to the first `total % n` people — makes the sum exact by construction.",
      },
      {
        id: "splitwise-q2",
        question: "Where should the check “these splits sum to the total” live?",
        options: [
          { id: "a", label: "Inside each SplitStrategy, before it returns — so no caller can record an invalid split, ever." },
          { id: "b", label: "In addExpense(), right after calling the strategy." },
          { id: "c", label: "In the UI, before the request is sent." },
          { id: "d", label: "In a nightly job that recomputes all balances and reports drift." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is tempting because it works today — one caller, one check. It fails the moment a second caller appears, or a bulk import, or a test helper. Putting the gate inside the strategy makes an invalid split unrepresentable rather than merely unlikely, and it keeps addExpense() unchanged when a fifth strategy arrives.",
      },
      {
        id: "splitwise-q3",
        question: "Why keep a net balance map instead of a list of “A owes B ₹X” rows?",
        options: [
          { id: "a", label: "Because “what do I owe Priya?” becomes an O(1) lookup rather than a fold over every expense, and the number of stored edges stops growing with history." },
          { id: "b", label: "Because a list of rows cannot represent negative amounts." },
          { id: "c", label: "Because the net map uses less memory in every case." },
          { id: "d", label: "Because you should never store the individual expenses at all." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is the trap: you keep the Expense list forever — it is the audit trail, and it is what lets you rebuild balances, explain a number, or reverse an edit. The net map is a cache of a fold over that list, maintained incrementally. Balances are computed state; expenses are the source of truth.",
      },
      {
        id: "splitwise-q4",
        question: "What single rule keeps the balance sheet from ever drifting?",
        options: [
          { id: "a", label: "Every move writes both bal[a][b] += x and bal[b][a] −= x — both lines, or neither." },
          { id: "b", label: "Recomputing every balance from the expense list after each operation." },
          { id: "c", label: "Rounding every amount to the nearest rupee." },
          { id: "d", label: "Only allowing one expense per group per day." },
        ],
        correctOptionId: "a",
        explanation:
          "Antisymmetry makes a half-applied edge unrepresentable, which is why the total across everyone is zero by construction rather than by luck. (b) is correct but O(history) on every write — it is the recovery path, not the hot path, and it is exactly what you would run to verify (a) after a suspected bug.",
      },
      {
        id: "splitwise-q5",
        question: "Six IOUs between four people. The greedy simplification matches biggest creditor with biggest debtor. Why does it terminate?",
        options: [
          { id: "a", label: "Because each round settles min(|debt|, credit), so at least one of the two hits exactly zero and leaves the pool — at most n−1 transfers." },
          { id: "b", label: "Because the amounts always halve each round." },
          { id: "c", label: "Because it is capped at a fixed iteration limit." },
          { id: "d", label: "It does not always terminate; you need a visited set to stop cycles." },
        ],
        correctOptionId: "a",
        explanation:
          "Taking the minimum is what guarantees progress: one side is fully paid off every round, so the pool shrinks by at least one person each time. With floating-point amounts (d) becomes a real risk — a residue of 0.0000001 never quite reaches zero — which is another reason for integers.",
      },
      {
        id: "splitwise-q6",
        question: "The interviewer asks whether your simplification produces the minimum possible number of payments. What is the right answer?",
        options: [
          { id: "a", label: "No — greedy gives at most n−1, but the true minimum-transaction problem is NP-hard because it reduces to finding subsets whose balances cancel." },
          { id: "b", label: "Yes — matching the largest creditor and debtor is provably optimal." },
          { id: "c", label: "Yes, as long as all amounts are integers." },
          { id: "d", label: "The question is meaningless; any settlement plan has the same number of payments." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is the confident-sounding wrong answer and it is very common. If three people's nets happen to cancel among themselves, they could settle in two transfers while greedy might route through a fourth person. Naming the reduction — subset-sum / partition — and then saying that n−1 is good enough for a real app is exactly the answer they want.",
      },
      {
        id: "splitwise-q7",
        question: "Two people add an expense to the same group at the same instant. What breaks, and what is the fix?",
        options: [
          { id: "a", label: "Both read bal[a][b], both write it, and one update is lost — take one lock per group around addExpense, since the guarded region is only a few map writes." },
          { id: "b", label: "Nothing — map writes are atomic in every language." },
          { id: "c", label: "The zero-sum assertion prevents it automatically." },
          { id: "d", label: "You need one lock per user pair to get enough parallelism." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the same check-then-act shape as the shared tanks in the coffee machine. (c) is tempting but backwards: the assertion detects damage, it does not prevent it — and a lost update can even leave the sum at zero while both edges are wrong. (d) buys deadlock risk to speed up microseconds of arithmetic.",
      },
      {
        id: "splitwise-q8",
        question: "Someone edits an expense that has already been partly settled. What is the cleanest way to handle it?",
        options: [
          { id: "a", label: "Reverse it — apply the opposite balance movement and keep both the original row and the reversal, so history stays explainable and the invariant holds at every step." },
          { id: "b", label: "Mutate the stored expense in place and recompute the balances from scratch." },
          { id: "c", label: "Refuse all edits once any settlement exists in the group." },
          { id: "d", label: "Delete the expense row and subtract its splits from the balances." },
        ],
        correctOptionId: "a",
        explanation:
          "An append-only event log means every number can be traced to the operations that produced it, and “why did my balance change?” has an answer. (b) is tempting and is what most first drafts do — it works arithmetically but destroys the audit trail, which in a money system is the part users actually escalate about.",
      },
    ],
  },
};
