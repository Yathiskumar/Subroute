import type { RoadmapLesson } from "@/lib/content/types";

export const tellDontAsk: RoadmapLesson = {
  title: "Tell, Don't Ask",
  oneLiner:
    "Don't pull data OUT of an object to make a decision and then push a result back. Instead, TELL the object what you want and let IT use its own data to decide. Asking (`if (account.getBalance() >= amount) account.setBalance(...)`) scatters the same rule across every caller; telling (`account.withdraw(amount)`) keeps the rule next to the data, in one place.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/tell-dont-ask.html",
  content: {
    prototypeCaption:
      "A `BankAccount` box holding a balance, with two callers — an **ATM** and an **OnlineCheckout** — that both need to withdraw money. In **Ask** mode the decision diamond (`balance >= amount?`) sits *outside* the account, copied into **both** caller boxes: each one reads `getBalance()`, decides for itself, then calls `setBalance()`. An indicator flags *rule lives in 2 places · can drift*. Click **Move the rule inside** and the diamond slides *into* the `BankAccount`, becoming `withdraw(amount)`; the callers shrink to a single `account.withdraw(x)` line and the indicator drops to *rule lives in 1 place*. Then trigger an **overdraft attempt**: in Ask mode one caller forgot the check and lets the balance go negative (inconsistent); in Tell mode the account rejects it uniformly. One fixed panel, replaced each interaction; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "**Tell, Don't Ask** is a simple rule about *where a decision lives*. Don't reach into an object, pull out its data, make a decision, and then push the result back. Instead, **tell** the object what you want done and let *it* use its own data to decide. The behaviour should sit next to the data it needs — inside the same object.",
      },
      {
        type: "p",
        text: "Think about a **good manager**. A good manager doesn't grab a worker's tools and do the task themselves. They *tell* the worker the goal — \"ship this order today\" — and let the worker, who knows their own tools and situation, handle the details. A bad manager micromanages: they ask for every detail, decide everything, and hand back instructions. Code that writes `if (account.getBalance() >= amount) account.setBalance(account.getBalance() - amount)` is that bad manager — it pulls the balance out of the account, decides, and pushes a new balance back, doing the account's own job for it.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Don't *ask* an object for its data and then make a decision about it. **Tell** the object what you want, and let it decide using the data it already owns. Behaviour belongs next to the data.",
      },
      {
        type: "callout",
        variant: "info",
        title: "It's a heuristic, not a law",
        text: "Tell, Don't Ask is a *guideline*, not an absolute rule. Objects still legitimately have getters: code that genuinely just *reports* state — showing a balance on a screen, formatting a report, logging a value — is fine. The smell is asking for data **to make a decision the object could have made itself**. Don't contort code to avoid every getter; apply the rule where a decision should have lived inside the object.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The smell: asking for data, then deciding for the object" },
      {
        type: "p",
        text: "Here is the trap. A caller wants to withdraw money. It *asks* the account for its balance, checks the rule itself, then *sets* a new balance:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// ⚠️ ASK — the caller pulls the balance out, decides, then pushes a result back.
if (account.getBalance() >= amount) {
  account.setBalance(account.getBalance() - amount);
}`,
      },
      {
        type: "p",
        text: "Notice who is doing the thinking. The *caller* knows the overdraft rule (`balance >= amount`). The account is just a **dumb data bag** with a getter and a setter — it holds a number but enforces nothing. The real rule about what a valid balance is now lives *outside* the thing it's about.",
      },
      { type: "h", text: "Why that hurts: the rule gets copied, then drifts" },
      {
        type: "p",
        text: "The moment a *second* caller also needs to withdraw — an ATM and an online checkout, say — that same `if` check gets copied into both. Now the overdraft rule lives in **two** places, and nothing keeps them in sync:",
      },
      {
        type: "ul",
        items: [
          "**Duplication** — the same `balance >= amount` rule is written in every caller that withdraws. Add a third caller and it's written a third time.",
          "**Drift** — when the rule changes (say, allow a $100 overdraft buffer), you must find and edit *every* copy. Miss one and the callers now disagree about what's legal.",
          "**Broken encapsulation** — the account exposes `getBalance` *and* `setBalance`, so any caller can set the balance to anything, bypassing the rule entirely. The object can't protect its own invariant.",
          "**Inconsistency** — if one caller simply *forgets* the check, it can drive the balance negative while another caller refuses. The same account behaves differently depending on who's asking.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "A getter + a setter = a rule with no home",
        text: "When an object exposes both `getX()` and `setX()` with no behaviour between them, every caller has to remember the rule that connects them. The object becomes a passive data holder, and the real logic is smeared across the whole codebase — impossible to enforce, easy to break.",
      },
      { type: "h", text: "The fix: tell the object, and put the rule inside it" },
      {
        type: "p",
        text: "Don't ask for the balance — **tell the account to withdraw**. Move the decision *into* the account, where the data already lives:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// ✓ TELL — one method on the account; the rule lives WITH the data.
account.withdraw(amount);

class BankAccount {
  private balance: number;
  withdraw(amount: number) {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;   // the rule and the data are in one place
  }
}`,
      },
      {
        type: "p",
        text: "Now there is exactly **one** copy of the overdraft rule, and it lives inside the account — right next to the `balance` it protects. Every caller, ATM or checkout, calls the same `account.withdraw(amount)`. The rule *can't* drift, because there's only one of it. And the account no longer needs a public `setBalance`, so no caller can bypass the check. The object guards its own invariant.",
      },
      { type: "h", text: "Where the decision lives — the whole idea in one picture" },
      {
        type: "p",
        text: "The difference is purely about *location*. In Ask, the decision (the `if`) sits **outside** the object, in the caller. In Tell, the very same decision sits **inside** the object, as a method. Same check, same data — just moved to where it belongs.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 640 250" width="100%" style="max-width:640px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Ask versus Tell. In Ask, the caller box contains a decision diamond that checks balance greater-or-equal amount, then reaches into the BankAccount via getBalance and setBalance — the decision lives outside the object. In Tell, the caller box just says account.withdraw(amount), and the decision diamond now lives inside the BankAccount as withdraw — the decision lives with the data.">
  <defs>
    <marker id="tda-ask" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8 z" fill="#f06868"/></marker>
    <marker id="tda-tell" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8 z" fill="#fb863a"/></marker>
  </defs>

  <!-- ===== ASK ===== -->
  <text x="160" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#f06868">ASK — decision OUTSIDE the object</text>

  <!-- caller with the decision inside it -->
  <rect x="34" y="38" width="156" height="86" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.3"/>
  <text x="112" y="55" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">Caller</text>
  <!-- decision diamond -->
  <path d="M112,66 L150,90 L112,114 L74,90 z" fill="rgba(240,104,104,0.16)" stroke="#f06868" stroke-width="1.3"/>
  <text x="112" y="87" text-anchor="middle" font-size="9" fill="#e8e4dc">balance</text>
  <text x="112" y="98" text-anchor="middle" font-size="9" fill="#e8e4dc">&gt;= amount?</text>

  <!-- account = dumb data bag -->
  <rect x="230" y="60" width="118" height="64" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.3"/>
  <text x="289" y="80" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">BankAccount</text>
  <text x="289" y="98" text-anchor="middle" font-size="9.5" fill="#9099a8">balance: 100</text>
  <text x="289" y="113" text-anchor="middle" font-size="8.5" fill="#6b7280">get/set only · dumb bag</text>

  <!-- arrows: caller reaches in via get and set -->
  <line x1="150" y1="78" x2="226" y2="78" stroke="#f06868" stroke-width="1.4" marker-end="url(#tda-ask)"/>
  <text x="188" y="73" text-anchor="middle" font-size="8" fill="#f06868">getBalance()</text>
  <line x1="226" y1="106" x2="150" y2="106" stroke="#f06868" stroke-width="1.4" marker-end="url(#tda-ask)"/>
  <text x="188" y="120" text-anchor="middle" font-size="8" fill="#f06868">setBalance()</text>

  <!-- divider -->
  <line x1="320" y1="36" x2="320" y2="232" stroke="#2d333d" stroke-width="1" stroke-dasharray="4 5"/>

  <!-- ===== TELL ===== -->
  <text x="480" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#fb863a">TELL — decision INSIDE the object</text>

  <!-- caller is now a one-liner -->
  <rect x="356" y="60" width="118" height="64" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.3"/>
  <text x="415" y="84" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">Caller</text>
  <text x="415" y="103" text-anchor="middle" font-size="8.5" fill="#9099a8">account.withdraw(x)</text>

  <!-- account now owns the decision -->
  <rect x="510" y="44" width="120" height="96" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)" stroke-width="1.5"/>
  <rect x="510" y="44" width="120" height="96" rx="6" fill="rgba(251,134,58,0.10)"/>
  <text x="570" y="62" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">BankAccount</text>
  <!-- decision diamond now inside -->
  <path d="M570,72 L604,92 L570,112 L536,92 z" fill="rgba(251,134,58,0.18)" stroke="#fb863a" stroke-width="1.3"/>
  <text x="570" y="89" text-anchor="middle" font-size="8.5" fill="#e8e4dc">balance</text>
  <text x="570" y="99" text-anchor="middle" font-size="8.5" fill="#e8e4dc">&gt;= amount?</text>
  <text x="570" y="130" text-anchor="middle" font-size="8.5" fill="#fb863a">withdraw(amount)</text>

  <!-- one arrow: tell -->
  <line x1="474" y1="92" x2="506" y2="92" stroke="#fb863a" stroke-width="1.5" marker-end="url(#tda-tell)"/>
  <text x="490" y="84" text-anchor="middle" font-size="8" fill="#fb863a">tell</text>

  <!-- bottom captions -->
  <text x="160" y="160" text-anchor="middle" font-size="9.5" fill="#9099a8">rule lives in the caller — copied into every caller</text>
  <text x="160" y="174" text-anchor="middle" font-size="11" font-weight="700" fill="#f06868">rule in N places · can drift</text>

  <text x="480" y="160" text-anchor="middle" font-size="9.5" fill="#9099a8">rule lives with the balance — one copy</text>
  <text x="480" y="174" text-anchor="middle" font-size="11" font-weight="700" fill="#fb863a">rule in 1 place · can't drift</text>

  <!-- footer line -->
  <line x1="34" y1="196" x2="630" y2="196" stroke="#2d333d" stroke-width="1"/>
  <text x="332" y="222" text-anchor="middle" font-size="10.5" fill="#9099a8">Same check, same data — Tell just moves the decision to where the data already lives.</text>
</svg>`,
        caption:
          "**Left (Ask)**: the decision diamond (`balance >= amount?`) sits *inside the caller*, which reaches into `BankAccount` through `getBalance()` and `setBalance()`. The account is a dumb data bag, and the rule has to be copied into every caller — so it can drift. **Right (Tell)**: the caller shrinks to `account.withdraw(x)`, and the *same* decision diamond now lives *inside* `BankAccount` as `withdraw(amount)`. One copy of the rule, sitting right next to the `balance` it guards.",
      },
      { type: "h", text: "How this connects to encapsulation and Law of Demeter" },
      {
        type: "ul",
        items: [
          "**Encapsulation** — Tell, Don't Ask is encapsulation taken seriously. An object should hide its data *and* the rules about that data. Exposing `getBalance`/`setBalance` leaks both; exposing `withdraw` keeps them inside.",
          "**Law of Demeter** — its close cousin. Demeter says *don't reach through* an object to talk to strangers (`order.getCustomer().getWallet()...`); Tell, Don't Ask says *don't reach into* an object to grab its data and decide for it. Both push behaviour next to the data it needs, so you tell one friend (`order.chargeCard(amount)`) instead of digging.",
          "**Rich objects, not data bags** — following the rule turns anaemic objects (all getters/setters, no behaviour) into ones that actually *do* things and protect their own state.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · See the rule copied into two callers",
        body: "Open the prototype in **Ask** mode. The `balance >= amount?` decision diamond sits *outside* the `BankAccount`, copied into **both** caller boxes — the ATM and the OnlineCheckout. Each one reads `getBalance()`, checks the rule itself, then calls `setBalance()`. Read the indicator: *rule lives in 2 places · can drift*. The account is just a data bag holding a number; it enforces nothing.",
      },
      {
        title: "02 · Trigger an overdraft and watch it drift",
        body: "In Ask mode, hit **Overdraft attempt**. One caller still checks the rule and refuses — but the other forgot the `if`, so it calls `setBalance()` straight through and drives the balance **negative**. Read the panel: the *same* account now behaves *inconsistently* depending on who asked, because the rule lived outside it and one copy was wrong.",
      },
      {
        title: "03 · Move the rule inside",
        body: "Click **Move the rule inside**. Watch the decision diamond slide *into* the `BankAccount`, becoming `withdraw(amount)`, while both callers shrink to a single `account.withdraw(x)` line. The indicator drops to *rule lives in 1 place*. Now trigger **Overdraft attempt** again: the account rejects it **uniformly**, no matter which caller asked, because there is exactly one copy of the rule and it lives next to the data. That's Tell, Don't Ask.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "tell-dont-ask.ts",
        code: `// BEFORE — ASK: every caller pulls the balance out and decides for the account.
class BankAccountV0 {
  constructor(private balance: number) {}
  getBalance() { return this.balance; }
  setBalance(b: number) { this.balance = b; }   // ⚠️ anyone can set anything
}

function atmWithdraw(account: BankAccountV0, amount: number) {
  // the overdraft rule lives HERE, in the caller...
  if (account.getBalance() >= amount) {
    account.setBalance(account.getBalance() - amount);
  }
}
function checkoutWithdraw(account: BankAccountV0, amount: number) {
  // ...and is copied AGAIN here. Forget the check and the balance goes negative.
  if (account.getBalance() >= amount) {
    account.setBalance(account.getBalance() - amount);
  }
}

// AFTER — TELL: one method on the account; the rule lives WITH the data.
class BankAccount {
  constructor(private balance: number) {}
  withdraw(amount: number) {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;          // rule + data in one place, can't drift
  }
  getBalance() { return this.balance; }   // a query is fine — it just reports state
}

const account = new BankAccount(100);
account.withdraw(30);   // ATM and checkout both just TELL the account.
account.withdraw(30);   // No setBalance to bypass; the account guards itself.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "TellDontAsk.java",
        code: `// BEFORE — ASK: every caller pulls the balance out and decides for the account.
class BankAccountV0 {
    private int balance;
    BankAccountV0(int balance) { this.balance = balance; }
    int getBalance() { return balance; }
    void setBalance(int b) { this.balance = b; }   // ⚠️ anyone can set anything
}

class CheckoutV0 {
    void atmWithdraw(BankAccountV0 account, int amount) {
        // the overdraft rule lives HERE, in the caller...
        if (account.getBalance() >= amount) {
            account.setBalance(account.getBalance() - amount);
        }
    }
    void checkoutWithdraw(BankAccountV0 account, int amount) {
        // ...and is copied AGAIN here. Forget the check and the balance goes negative.
        if (account.getBalance() >= amount) {
            account.setBalance(account.getBalance() - amount);
        }
    }
}

// AFTER — TELL: one method on the account; the rule lives WITH the data.
class BankAccount {
    private int balance;
    BankAccount(int balance) { this.balance = balance; }
    void withdraw(int amount) {
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;            // rule + data in one place, can't drift
    }
    int getBalance() { return balance; }   // a query is fine — it just reports state
}
// var account = new BankAccount(100);
// account.withdraw(30);   // ATM and checkout both just TELL the account.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "tell_dont_ask.py",
        code: `# BEFORE — ASK: every caller pulls the balance out and decides for the account.
class BankAccountV0:
    def __init__(self, balance: int) -> None:
        self.balance = balance        # exposed for get AND set

def atm_withdraw(account: BankAccountV0, amount: int) -> None:
    # the overdraft rule lives HERE, in the caller...
    if account.balance >= amount:
        account.balance = account.balance - amount

def checkout_withdraw(account: BankAccountV0, amount: int) -> None:
    # ...and is copied AGAIN here. Forget the check and the balance goes negative.
    if account.balance >= amount:
        account.balance = account.balance - amount

# AFTER — TELL: one method on the account; the rule lives WITH the data.
class BankAccount:
    def __init__(self, balance: int) -> None:
        self._balance = balance       # private; no setter to bypass the rule
    def withdraw(self, amount: int) -> None:
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount       # rule + data in one place, can't drift
    @property
    def balance(self) -> int:         # a query is fine — it just reports state
        return self._balance

account = BankAccount(100)
account.withdraw(30)   # ATM and checkout both just TELL the account.
account.withdraw(30)   # No way to set the balance directly; it guards itself.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "tell_dont_ask.cpp",
        code: `#include <stdexcept>

// BEFORE — ASK: every caller pulls the balance out and decides for the account.
class BankAccountV0 {
public:
    int balance;                                  // exposed for get AND set
    explicit BankAccountV0(int b) : balance(b) {}
};

void atmWithdraw(BankAccountV0& account, int amount) {
    // the overdraft rule lives HERE, in the caller...
    if (account.balance >= amount) {
        account.balance = account.balance - amount;
    }
}
void checkoutWithdraw(BankAccountV0& account, int amount) {
    // ...and is copied AGAIN here. Forget the check and the balance goes negative.
    if (account.balance >= amount) {
        account.balance = account.balance - amount;
    }
}

// AFTER — TELL: one method on the account; the rule lives WITH the data.
class BankAccount {
    int balance;                                  // private: no setter to bypass
public:
    explicit BankAccount(int b) : balance(b) {}
    void withdraw(int amount) {
        if (amount > balance) throw std::runtime_error("Insufficient funds");
        balance -= amount;            // rule + data in one place, can't drift
    }
    int getBalance() const { return balance; }    // a query is fine — reports state
};

// BankAccount account{100};
// account.withdraw(30);   // ATM and checkout both just TELL the account.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for it when a caller decides something the object should own" },
      {
        type: "p",
        text: "Tell, Don't Ask is most useful when you catch a caller pulling data out of an object, applying a rule, and pushing a result back — especially if that rule appears in more than one caller. Move the rule, and the data it protects, into the object.",
      },
      {
        type: "ul",
        items: [
          "**A get/check/set triple** — `if (x.getY() ...) x.setY(...)`. The rule connecting the getter and setter belongs *inside* the object as a single method.",
          "**A rule copied across callers** — the same validation or calculation written in several places. One method on the object means one copy that can't drift.",
          "**Invariants that must hold** — a balance that can't go negative, a status that must follow a sequence. Only the object can guarantee its own invariant, so the decision must live inside it.",
          "**Anaemic domain objects** — classes that are all getters and setters with no behaviour. Pushing decisions into them turns data bags into real objects.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't turn it into 'never write a getter'",
        text: "Queries that genuinely just *report* state are legitimate and necessary. A UI must read a balance to display it; a report formats values; a log records them. Those are *reads*, not decisions the object should own — Tell, Don't Ask isn't violated by them. The smell is asking for data **to make a decision the object itself could make**. Apply the rule there; don't contort code to eliminate every getter, or you'll just add awkward methods nobody needs.",
      },
    ],

    tradeoffs: {
      pros: [
        "One copy of each rule — the logic lives with the data, so it can't be duplicated across callers or drift out of sync.",
        "Real encapsulation — the object hides its data and the rules about it; without a public setter, no caller can put it into an invalid state.",
        "Consistency — every caller goes through the same method, so the same account behaves identically no matter who asks.",
        "Richer objects — behaviour lands next to data, turning anaemic data bags into objects that actually do their own work.",
      ],
      cons: [
        "Can be over-applied — treated as 'never expose a getter', it breeds awkward methods and hides state that callers legitimately need to read.",
        "Not a fit for pure data — DTOs, config trees, and value objects are meant to be read; forcing 'tell' methods onto them adds noise.",
        "Pushing every decision in can bloat an object — sometimes a rule truly belongs to a coordinator/service, not the entity, and over-telling overloads the object.",
        "Reporting and display still need queries — you can't avoid reads entirely, so the rule is a judgement call, not a mechanical transform.",
      ],
    },

    furtherReading: [
      {
        label: "TellDontAsk — Martin Fowler",
        href: "https://martinfowler.com/bliki/TellDontAsk.html",
        note: "Fowler's short, definitive bliki entry: what the principle means, how it relates to object-oriented design and the Law of Demeter, and a candid note that it's a guideline he doesn't follow blindly.",
        kind: "article",
      },
      {
        label: "The Pragmatic Programmer — 'The Art of Enbugging' (Hunt & Thomas)",
        href: "https://media.pragprog.com/articles/jan_03_enbug.pdf",
        note: "The IEEE Software column where Hunt and Thomas coined 'Tell, Don't Ask', tying it to decoupling and the Law of Demeter with a worked example of keeping decisions next to the data.",
        kind: "paper",
      },
      {
        label: "TellDontAsk — Portland Pattern Repository (c2 wiki)",
        href: "https://wiki.c2.com/?TellDontAsk",
        note: "A long, opinionated community thread that argues both sides — when telling genuinely improves a design, and when chasing 'no getters' becomes dogma.",
        kind: "article",
      },
      {
        label: "Tell Don't Ask — Mark Seemann (ploeh blog)",
        href: "https://blog.ploeh.dk/2018/09/17/typing-is-not-a-programming-bottleneck/",
        note: "Seemann's writing connects Tell, Don't Ask to encapsulation and invariants — why an object that owns its rules can guarantee it's always in a valid state.",
        kind: "article",
      },
      {
        label: "Avoid Getters and Setters Whenever Possible — Baeldung",
        href: "https://www.baeldung.com/java-getters-setters",
        note: "A code-first Java walkthrough of why exposing getters/setters leaks behaviour, and how moving rules into the object (the 'tell' style) protects its invariants.",
        kind: "article",
      },
      {
        label: "Tell, Don't Ask — object design explained (video)",
        href: "https://www.youtube.com/watch?v=Njm0SQ9Sh1Q",
        note: "A short, visual walkthrough that refactors a get/check/set caller into a single 'tell' method and shows the rule collapsing into one place.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "tell-dont-ask-q1",
        question: "What does 'Tell, Don't Ask' tell you to do?",
        options: [
          { id: "a", label: "Tell an object what you want and let it use its own data to decide — don't pull its data out, decide yourself, and push a result back." },
          { id: "b", label: "Always make fields public so callers can read and write them directly." },
          { id: "c", label: "Never call more than one method on any object." },
          { id: "d", label: "Ask an object for all its data up front, then cache it in the caller." },
        ],
        correctOptionId: "a",
        explanation:
          "The principle is about where a decision lives. Instead of asking an object for its data, making a decision, and writing a result back, you tell the object what you want (`account.withdraw(amount)`) and let it decide using the data it already owns. The behaviour ends up next to the data it needs.",
      },
      {
        id: "tell-dont-ask-q2",
        question: "Why is `if (account.getBalance() >= amount) account.setBalance(account.getBalance() - amount)` a smell?",
        options: [
          { id: "a", label: "The overdraft rule lives in the caller, so it gets copied into every caller and can drift; the account is a dumb data bag that can't protect its own balance." },
          { id: "b", label: "Calling getBalance() twice is a performance bug that will slow the program down." },
          { id: "c", label: "Setters are illegal in object-oriented languages." },
          { id: "d", label: "Nothing — putting the rule in the caller is the recommended approach." },
        ],
        correctOptionId: "a",
        explanation:
          "The decision (`balance >= amount`) sits outside the account, so every caller that withdraws has to repeat it. When the rule changes you must edit every copy, and because the account exposes a public setter, any caller can set the balance to anything — bypassing the rule. The object can't enforce its own invariant.",
      },
      {
        id: "tell-dont-ask-q3",
        question: "What's the standard fix for that get/check/set pattern?",
        options: [
          { id: "a", label: "Add a withdraw(amount) method to the account that checks the rule and updates the balance internally, then have every caller just call account.withdraw(amount)." },
          { id: "b", label: "Make getBalance and setBalance static so any class can reach them." },
          { id: "c", label: "Copy the if-check into a shared utility function and call it from each caller." },
          { id: "d", label: "Remove the check entirely and trust callers to behave." },
        ],
        correctOptionId: "a",
        explanation:
          "Move the decision into the object. `withdraw(amount)` puts the rule next to the `balance` it guards, so there's exactly one copy and the account can refuse an overdraft uniformly. A shared utility (c) still leaves the rule outside the object and keeps the public setter that lets callers bypass it.",
      },
      {
        id: "tell-dont-ask-q4",
        question: "Does 'Tell, Don't Ask' mean an object should never have a getter?",
        options: [
          { id: "a", label: "No — it's a heuristic, not an absolute. Queries that simply report state (for display, reports, logging) are legitimate; the smell is asking for data to make a decision the object could make itself." },
          { id: "b", label: "Yes — any getter is a violation and must be removed." },
          { id: "c", label: "Yes — objects must expose only setters, never getters." },
          { id: "d", label: "No — but only because some languages can't delete getters." },
        ],
        correctOptionId: "a",
        explanation:
          "Tell, Don't Ask is a guideline. Reading a value to display, format, or log it is a genuine query and perfectly fine. What it discourages is pulling data out *to make a decision the object should own*. Don't contort code to avoid every getter — apply the rule where a decision belongs inside the object.",
      },
      {
        id: "tell-dont-ask-q5",
        question: "Which principle is the closest cousin of Tell, Don't Ask?",
        options: [
          { id: "a", label: "The Law of Demeter — don't reach through an object to talk to strangers; both principles push behaviour next to the data it needs." },
          { id: "b", label: "Premature optimisation is the root of all evil." },
          { id: "c", label: "Always depend on concrete classes rather than interfaces." },
          { id: "d", label: "Make every class a singleton." },
        ],
        correctOptionId: "a",
        explanation:
          "The Law of Demeter ('only talk to your friends') is the natural partner. Demeter says don't *reach through* an object (`order.getCustomer().getWallet()...`); Tell, Don't Ask says don't *reach into* one to grab its data and decide for it. Both replace digging with a single 'tell' (`order.chargeCard(amount)`), keeping behaviour next to the data — which is encapsulation done properly.",
      },
    ],
  },
};
