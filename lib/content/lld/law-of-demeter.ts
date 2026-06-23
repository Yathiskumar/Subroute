import type { RoadmapLesson } from "@/lib/content/types";

export const lawOfDemeter: RoadmapLesson = {
  title: "Law of Demeter (Principle of Least Knowledge)",
  oneLiner:
    "Only talk to your immediate friends — not to strangers you reach through them. A method should call methods on itself, its own fields, its parameters, and objects it makes — but not on objects handed back by another call. Each extra dot (`a.getB().getC().doThing()`) reaches deeper into a stranger's guts and couples you to the whole chain.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/law-of-demeter.html",
  content: {
    prototypeCaption:
      "A live **train wreck** call chain: `order.getCustomer().getWallet().getCard().getNumber()` laid out as a row of object boxes (Order → Customer → Wallet → Card) with a caller standing at the left. Click each hop and it lights up as a **friend** (green — `Order` is the caller's direct collaborator) or a **stranger** (red — `Customer`, `Wallet`, `Card` were only reached *through* other calls). A live counter shows *classes this one line is coupled to: 4*. Hit **Refactor** and the chain collapses into a single friendly call `order.chargeCard(amount)` — the strangers fade away, the counter drops to **1**, and the fixed panel narrates *you told your friend Order to handle it; Order talks to its own Wallet and Card*. One panel, replaced each click; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "The **Law of Demeter** (also called the **Principle of Least Knowledge**) is a simple rule for keeping objects loosely coupled: *only talk to your immediate friends*. A method should not go digging through one object to reach another object behind it. The less your code knows about the *shape* of things around it, the less can break when those things change.",
      },
      {
        type: "p",
        text: "Think about **paying at a shop**. You hand the cashier your card and they take it from there. You do *not* reach over the counter, open the cashier's drawer, pull out their personal wallet, and make change yourself. You talk to your *friend* — the cashier — and let them deal with their own stuff. Code that writes `order.getCustomer().getWallet().getCard().getNumber()` is doing exactly that rude reach-over: digging through the order, into the customer, into their wallet, all the way down to a card number.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Talk to your **friends**, not to **strangers**. Ask the object right in front of you to do the work — don't reach *through* it to grab something deeper and do the work yourself.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Why it's called a 'law'",
        text: "It isn't a law of physics — it's a *guideline*, named after the **Demeter** research project at Northeastern University in the late 1980s, where it was first written down. 'Principle of Least Knowledge' is the clearer name: a method should know as little as possible about the internal structure of anything else.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The rule, precisely" },
      {
        type: "p",
        text: "A method `m` of an object `O` may only call methods on a short list of *friends*. Anything else is reaching through a stranger.",
      },
      {
        type: "ul",
        items: [
          "**`O` itself** — its own other methods (`this.helper()`).",
          "**`O`'s own fields** — objects it holds directly (`this.sender.send(...)`).",
          "**The method's parameters** — objects handed *in* to `m` (`order.total()`).",
          "**Objects `m` creates** — anything `m` `new`s up itself (`new Logger().log(...)`).",
        ],
      },
      {
        type: "p",
        text: "What's *not* on the list is the giveaway: **objects returned by another method call**. The moment you call a method and then call a method *on its result*, you're talking to a stranger you were introduced to by a friend. One dot is fine. It's the *second* dot on a returned object that starts the trouble.",
      },
      { type: "h", text: "The classic smell: a train wreck" },
      {
        type: "p",
        text: "When several of these reaches chain together, you get what people call a **train wreck** — a long line of dots, each car coupled to the next:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// ⚠️ a "train wreck" — every dot reaches deeper into a stranger
const number = order.getCustomer().getWallet().getCard().getNumber();`,
      },
      {
        type: "p",
        text: "Count what this one line now *knows*. It knows an `Order` has a `Customer`, that a `Customer` has a `Wallet`, that a `Wallet` has a `Card`, and that a `Card` has a number. That's **four** classes welded into a single statement. The day a `Wallet` stops holding a single `Card` — say it becomes a list — this line breaks, even though it was only ever trying to charge a card. You reached through three strangers to do it.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Each dot is a piece of knowledge that can betray you",
        text: "Every `.getX()` you chain bakes another class's internal structure into your code. Change *any* link in that chain — rename a getter, swap a type, add a layer — and every train wreck that walked through it breaks. The coupling is invisible until something moves.",
      },
      { type: "h", text: "The fix: ask your friend to do the work" },
      {
        type: "p",
        text: "Don't reach *for* the data — **tell your friend to do the job**. Add a method to the object right in front of you (`Order`) that does the work, so *it* deals with its own collaborators:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// ✓ talk to your friend Order; let Order handle its own Wallet & Card
order.chargeCard(amount);

class Order {
  // Order is allowed to talk to its OWN fields — they're its friends.
  chargeCard(amount: number) {
    this.customer.charge(amount);   // pass the job one step down
  }
}`,
      },
      {
        type: "p",
        text: "Now your code knows about exactly **one** class: `Order`. It has no idea whether a `Customer` has a `Wallet`, a `Wallet` has a `Card`, or how charging actually happens. Each object handles the layer directly below it and hides the rest. If the wallet-to-card relationship changes tomorrow, only `Customer` has to know — your code never finds out.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Its cousin: Tell, Don't Ask",
        text: "The Law of Demeter pairs naturally with **Tell, Don't Ask**: instead of *asking* an object for its data and acting on it yourself, *tell* the object what you want done and let it use its own data. `order.chargeCard(amount)` (tell) replaces `order.getCustomer().getWallet()...` (ask). Both push behaviour next to the data it needs.",
      },
      { type: "h", text: "Where it does NOT apply: this isn't a 'count the dots' law" },
      {
        type: "p",
        text: "Demeter is about *who you talk to*, not about *how many dots* you type. Some chains are perfectly fine:",
      },
      {
        type: "ul",
        items: [
          "**Fluent builders / chaining** — `new StringBuilder().append(\"a\").append(\"b\").toString()` returns `this` each time, so every call is still the *same friend*. No strangers are involved.",
          "**Streams / pipelines** — `list.stream().filter(...).map(...).collect(...)` chains operations on one pipeline object, not a walk through unrelated classes.",
          "**Data Transfer Objects** — a plain bag of public data with no behaviour (a config tree, a parsed JSON object) isn't a 'stranger' hiding logic; reading nested fields off it is reading data, not violating Demeter.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The test: is each call on the same object, or a deeper one?",
        text: "Fluent chains call method after method on the *same returned object* (it returns `this`). A train wreck calls a method on a *different, deeper object* each time. Same friend = fine. New stranger each dot = smell.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 640 230" width="100%" style="max-width:640px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Before and after of the Law of Demeter. Before: a caller reaches through Order to Customer to Wallet to Card, each an extra stranger, coupling to four classes. After: the caller makes one friendly call to Order, which handles its own collaborators, coupling to one class.">
  <defs>
    <marker id="lod-friend" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8 z" fill="#5cc66f"/></marker>
    <marker id="lod-stranger" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8 z" fill="#f06868"/></marker>
  </defs>

  <text x="20" y="24" font-size="12" font-weight="600" fill="#f06868">TRAIN WRECK — reaches through 3 strangers</text>

  <!-- caller -->
  <rect x="8" y="40" width="60" height="34" rx="5" fill="#14161a" stroke="#3a414c" stroke-width="1.3"/>
  <text x="38" y="61" text-anchor="middle" font-size="10" fill="#9099a8">caller</text>

  <!-- order = friend -->
  <rect x="96" y="40" width="78" height="34" rx="5" fill="#14161a" stroke="#5cc66f" stroke-width="1.4"/>
  <text x="135" y="56" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">Order</text>
  <text x="135" y="69" text-anchor="middle" font-size="8.5" fill="#5cc66f">friend</text>

  <!-- customer = stranger -->
  <rect x="216" y="40" width="84" height="34" rx="5" fill="#14161a" stroke="#f06868" stroke-width="1.3"/>
  <text x="258" y="56" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">Customer</text>
  <text x="258" y="69" text-anchor="middle" font-size="8.5" fill="#f06868">stranger</text>

  <!-- wallet = stranger -->
  <rect x="342" y="40" width="78" height="34" rx="5" fill="#14161a" stroke="#f06868" stroke-width="1.3"/>
  <text x="381" y="56" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">Wallet</text>
  <text x="381" y="69" text-anchor="middle" font-size="8.5" fill="#f06868">stranger</text>

  <!-- card = stranger -->
  <rect x="462" y="40" width="70" height="34" rx="5" fill="#14161a" stroke="#f06868" stroke-width="1.3"/>
  <text x="497" y="56" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">Card</text>
  <text x="497" y="69" text-anchor="middle" font-size="8.5" fill="#f06868">stranger</text>

  <line x1="68" y1="57" x2="92" y2="57" stroke="#5cc66f" stroke-width="1.5" marker-end="url(#lod-friend)"/>
  <line x1="174" y1="57" x2="212" y2="57" stroke="#f06868" stroke-width="1.5" marker-end="url(#lod-stranger)"/>
  <line x1="300" y1="57" x2="338" y2="57" stroke="#f06868" stroke-width="1.5" marker-end="url(#lod-stranger)"/>
  <line x1="420" y1="57" x2="458" y2="57" stroke="#f06868" stroke-width="1.5" marker-end="url(#lod-stranger)"/>

  <text x="20" y="104" font-size="9.5" fill="#9099a8">order.getCustomer().getWallet().getCard().getNumber()</text>
  <text x="540" y="60" font-size="11" font-weight="700" fill="#f06868">×4</text>

  <!-- divider -->
  <line x1="20" y1="128" x2="620" y2="128" stroke="#2d333d" stroke-width="1" stroke-dasharray="4 5"/>

  <text x="20" y="156" font-size="12" font-weight="600" fill="#5cc66f">REFACTORED — one friendly call</text>

  <rect x="8" y="172" width="60" height="34" rx="5" fill="#14161a" stroke="#3a414c" stroke-width="1.3"/>
  <text x="38" y="193" text-anchor="middle" font-size="10" fill="#9099a8">caller</text>

  <rect x="96" y="172" width="78" height="34" rx="5" fill="#14161a" stroke="#5cc66f" stroke-width="1.4"/>
  <text x="135" y="188" text-anchor="middle" font-size="11" font-weight="600" fill="#e8e4dc">Order</text>
  <text x="135" y="201" text-anchor="middle" font-size="8.5" fill="#5cc66f">friend</text>

  <line x1="68" y1="189" x2="92" y2="189" stroke="#5cc66f" stroke-width="1.5" marker-end="url(#lod-friend)"/>
  <text x="190" y="186" font-size="9.5" fill="#9099a8">order.chargeCard(amount)</text>
  <text x="190" y="200" font-size="8.5" fill="#6b7280">Order hides Customer, Wallet, Card</text>
  <text x="540" y="192" font-size="11" font-weight="700" fill="#5cc66f">×1</text>
</svg>`,
        caption:
          "**Top**: the caller's only *friend* is `Order` (green), but the train wreck reaches *through* it to `Customer`, `Wallet`, and `Card` — three **strangers** (red) introduced by earlier calls. The single line is now coupled to **four** classes. **Bottom**: one friendly call, `order.chargeCard(amount)`, leaves the caller coupled to just **one** class. `Order` deals with its own `Customer`/`Wallet`/`Card` privately.",
      },
    ],

    handsOn: [
      {
        title: "01 · Walk the train wreck",
        body: "Open the prototype. The expression `order.getCustomer().getWallet().getCard().getNumber()` is drawn as a row of boxes with the caller on the left. Click each hop in turn. `Order` lights up **green — friend**, because the caller holds it directly. But `Customer`, `Wallet`, and `Card` light up **red — stranger**: the caller never knew about them; it was only *introduced* to each one by the call before it. Watch the counter: *classes this line is coupled to: 4*.",
      },
      {
        title: "02 · Feel why each extra dot hurts",
        body: "Read the explain panel on each stranger. Reaching `Wallet` means your one line now *knows* that a `Customer` has a `Wallet` — so if that ever changes, your line breaks even though it only wanted to charge a card. Every red box is a fact about someone else's internals that you've baked into your code.",
      },
      {
        title: "03 · Refactor to one friendly call",
        body: "Hit **Refactor**. The chain collapses to a single call `order.chargeCard(amount)`, the three strangers fade away, and the counter drops from **4** to **1**. Read the panel: *you told your friend `Order` to handle it; `Order` talks to its own `Wallet` and `Card` privately.* You now talk to one friend and know about one class. That's the Law of Demeter in one move.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "law-of-demeter.ts",
        code: `// BEFORE — a "train wreck": the caller reaches through 3 strangers.
class Card { constructor(private number: string) {} getNumber() { return this.number; } }
class Wallet { constructor(private card: Card) {} getCard() { return this.card; } }
class Customer { constructor(private wallet: Wallet) {} getWallet() { return this.wallet; } }
class OrderV0 { constructor(private customer: Customer) {} getCustomer() { return this.customer; } }

function chargeV0(order: OrderV0, amount: number) {
  // ⚠️ coupled to Order, Customer, Wallet, AND Card — four classes in one line.
  const number = order.getCustomer().getWallet().getCard().getNumber();
  gateway.charge(number, amount);
}

// AFTER — tell your friend Order to do the job; each object handles its own.
class CardA { constructor(private number: string) {} charge(amount: number) { gateway.charge(this.number, amount); } }
class WalletA { constructor(private card: CardA) {} charge(amount: number) { this.card.charge(amount); } }
class CustomerA { constructor(private wallet: WalletA) {} charge(amount: number) { this.wallet.charge(amount); } }
class Order {
  constructor(private customer: CustomerA) {}
  // Order talks only to its OWN field — its friend. The caller knows nothing else.
  chargeCard(amount: number) { this.customer.charge(amount); }
}

function charge(order: Order, amount: number) {
  order.chargeCard(amount);   // ✓ coupled to ONE class: Order.
}

declare const gateway: { charge(num: string, amount: number): void };`,
      },
      {
        label: "Java",
        language: "java",
        filename: "LawOfDemeter.java",
        code: `// BEFORE — a "train wreck": the caller reaches through 3 strangers.
class Card { private String number; String getNumber() { return number; } }
class Wallet { private Card card; Card getCard() { return card; } }
class Customer { private Wallet wallet; Wallet getWallet() { return wallet; } }
class OrderV0 { private Customer customer; Customer getCustomer() { return customer; } }

class CheckoutV0 {
    void charge(OrderV0 order, int amount) {
        // ⚠️ coupled to Order, Customer, Wallet, AND Card — four classes.
        String number = order.getCustomer().getWallet().getCard().getNumber();
        gateway.charge(number, amount);
    }
    Gateway gateway;
}

// AFTER — tell your friend Order to do the job; each object handles its own.
class CardA { private String number; void charge(int amt) { /* gateway.charge(number, amt) */ } }
class WalletA { private CardA card; void charge(int amt) { card.charge(amt); } }
class CustomerA { private WalletA wallet; void charge(int amt) { wallet.charge(amt); } }
class Order {
    private CustomerA customer;
    // Order talks only to its OWN field — its friend.
    void chargeCard(int amount) { customer.charge(amount); }
}

class Checkout {
    void charge(Order order, int amount) {
        order.chargeCard(amount);   // ✓ coupled to ONE class: Order.
    }
}
interface Gateway { void charge(String number, int amount); }`,
      },
      {
        label: "Python",
        language: "python",
        filename: "law_of_demeter.py",
        code: `# BEFORE — a "train wreck": the caller reaches through 3 strangers.
class Card:
    def __init__(self, number: str) -> None: self._number = number
    def get_number(self) -> str: return self._number
class Wallet:
    def __init__(self, card: Card) -> None: self._card = card
    def get_card(self) -> Card: return self._card
class Customer:
    def __init__(self, wallet: Wallet) -> None: self._wallet = wallet
    def get_wallet(self) -> Wallet: return self._wallet
class OrderV0:
    def __init__(self, customer: Customer) -> None: self._customer = customer
    def get_customer(self) -> Customer: return self._customer

def charge_v0(order: OrderV0, amount: int) -> None:
    # ⚠️ coupled to Order, Customer, Wallet, AND Card — four classes in one line.
    number = order.get_customer().get_wallet().get_card().get_number()
    gateway.charge(number, amount)

# AFTER — tell your friend Order to do the job; each object handles its own.
class CardA:
    def __init__(self, number: str) -> None: self._number = number
    def charge(self, amount: int) -> None: gateway.charge(self._number, amount)
class WalletA:
    def __init__(self, card: CardA) -> None: self._card = card
    def charge(self, amount: int) -> None: self._card.charge(amount)
class CustomerA:
    def __init__(self, wallet: WalletA) -> None: self._wallet = wallet
    def charge(self, amount: int) -> None: self._wallet.charge(amount)
class Order:
    def __init__(self, customer: CustomerA) -> None: self._customer = customer
    # Order talks only to its OWN field — its friend.
    def charge_card(self, amount: int) -> None: self._customer.charge(amount)

def charge(order: Order, amount: int) -> None:
    order.charge_card(amount)   # ✓ coupled to ONE class: Order.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "law_of_demeter.cpp",
        code: `#include <string>

void gateway_charge(const std::string& number, int amount);

// BEFORE — a "train wreck": the caller reaches through 3 strangers.
class Card   { std::string number; public: const std::string& getNumber() const { return number; } };
class Wallet { Card card;   public: const Card& getCard() const { return card; } };
class Customer { Wallet wallet; public: const Wallet& getWallet() const { return wallet; } };
class OrderV0 { Customer customer; public: const Customer& getCustomer() const { return customer; } };

void chargeV0(const OrderV0& order, int amount) {
    // ⚠️ coupled to Order, Customer, Wallet, AND Card — four classes in one line.
    const std::string& number = order.getCustomer().getWallet().getCard().getNumber();
    gateway_charge(number, amount);
}

// AFTER — tell your friend Order to do the job; each object handles its own.
class CardA   { std::string number; public: void charge(int amt) { gateway_charge(number, amt); } };
class WalletA { CardA card;   public: void charge(int amt) { card.charge(amt); } };
class CustomerA { WalletA wallet; public: void charge(int amt) { wallet.charge(amt); } };
class Order {
    CustomerA customer;
public:
    // Order talks only to its OWN field — its friend.
    void chargeCard(int amount) { customer.charge(amount); }
};

void charge(Order& order, int amount) {
    order.chargeCard(amount);   // ✓ coupled to ONE class: Order.
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for it when a chain digs through other objects' guts" },
      {
        type: "p",
        text: "The Law of Demeter is most useful exactly where a long getter chain is forming. If you catch yourself writing a third dot on a returned object, stop and ask whether the *first* object could do the whole job for you.",
      },
      {
        type: "ul",
        items: [
          "**Train-wreck getter chains** — `a.getB().getC().getD()`. Push the behaviour onto `a` so it hides the chain.",
          "**Code that breaks far from where you edited** — if renaming a field in `Wallet` breaks a checkout screen, a train wreck is reaching through it. Demeter localises that ripple.",
          "**Rich domain objects** — when objects have real behaviour (not just data), 'tell, don't ask' keeps logic next to the data it uses.",
          "**Wrapping awkward third-party trees** — give yourself one friendly method instead of walking a library's nested structure everywhere.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't turn it into 'never type two dots'",
        text: "Demeter is about *strangers*, not *dot count*. Fluent builders (`builder.a().b().c()`), stream pipelines (`stream().filter().map().collect()`), and plain data objects all chain calls without reaching through strangers — they're fine. Blindly forbidding chains pushes people to wrap everything in pass-through 'delegate' methods, which can bloat your classes more than the chain ever did. Apply it where a chain reveals real coupling, not as a syntax rule.",
      },
    ],

    tradeoffs: {
      pros: [
        "Loose coupling — your code knows about one friend, not a whole chain of classes, so changes deep in the chain don't ripple out to you.",
        "Easier to change — when a Wallet's internals change, only its immediate neighbour has to care; distant callers never find out.",
        "Information hiding — each object keeps its collaborators private, which is the whole point of encapsulation.",
        "Behaviour lands next to data — 'tell, don't ask' nudges logic onto the object that owns the data it needs.",
      ],
      cons: [
        "Wrapper / delegate methods multiply — to avoid a chain you often add a pass-through method on each layer (Order.chargeCard → Customer.charge → ...), which is more code.",
        "Can be taken too literally — treating it as 'count the dots' flags harmless fluent and stream chains and breeds pointless wrappers.",
        "Doesn't fit pure data objects — for DTOs and config trees that are just public data, walking nested fields is reading data, not a violation; forcing methods there adds noise.",
        "Hides legitimate structure — sometimes a caller genuinely should know a relationship; over-applying Demeter can obscure a model that was clear.",
      ],
    },

    furtherReading: [
      {
        label: "Law of Demeter — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Law_of_Demeter",
        note: "The canonical definition: the precise list of which objects a method may call, the origin in the Demeter project, and a clear treatment of the 'don't talk to strangers' formulation.",
        kind: "docs",
      },
      {
        label: "The Pragmatic Programmer — Hunt & Thomas (Decoupling and the Law of Demeter)",
        href: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
        note: "The book that popularised the law for working developers, with the 'minimise coupling between modules' framing and the practical guidance on when to delegate versus chain.",
        kind: "book",
      },
      {
        label: "GetterEradicator — Martin Fowler",
        href: "https://martinfowler.com/bliki/GetterEradicator.html",
        note: "Fowler weighs the Law of Demeter against the urge to remove getters, and argues for 'tell, don't ask' as the deeper idea — with a candid look at where the rule helps and where it's overzealous.",
        kind: "article",
      },
      {
        label: "LawOfDemeter — Portland Pattern Repository (c2 wiki)",
        href: "https://wiki.c2.com/?LawOfDemeter",
        note: "A long, opinionated community thread that argues both sides: when chaining is a genuine smell and when the law is misapplied as a mechanical 'one dot' rule.",
        kind: "article",
      },
      {
        label: "The Law of Demeter in Java — Baeldung",
        href: "https://www.baeldung.com/java-demeter-law",
        note: "A hands-on, code-first walkthrough that refactors a train-wreck chain into delegating methods, with concrete Java examples of the friends-vs-strangers rule.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "law-of-demeter-q1",
        question: "What does the Law of Demeter tell a method to do?",
        options: [
          { id: "a", label: "Only call methods on itself, its own fields, its parameters, and objects it creates — not on objects returned by other calls." },
          { id: "b", label: "Never call more than one method in a single statement." },
          { id: "c", label: "Make every field public so other objects can read it directly." },
          { id: "d", label: "Always reach through one object to get to the object behind it." },
        ],
        correctOptionId: "a",
        explanation:
          "Demeter limits who a method may talk to: itself, its own fields, its parameters, and objects it makes — its 'immediate friends'. What's off-limits is calling methods on the *result* of another call (a stranger you were introduced to through a friend). It's about who you talk to, not a one-method-per-line rule (b).",
      },
      {
        id: "law-of-demeter-q2",
        question: "Why is `order.getCustomer().getWallet().getCard().getNumber()` considered a smell?",
        options: [
          { id: "a", label: "That single line is now coupled to four classes' internal structure, so changing any link in the chain can break it." },
          { id: "b", label: "Method chaining is illegal in most languages and won't compile." },
          { id: "c", label: "It runs slower because each getter allocates memory." },
          { id: "d", label: "Getters always return null, so the chain will crash." },
        ],
        correctOptionId: "a",
        explanation:
          "The line reaches through three strangers (`Customer`, `Wallet`, `Card`) to get a number, baking the shape of all four classes into one statement. If a `Wallet` later holds a list of cards instead of one, this line breaks — even though it only wanted to charge a card. That hidden, chain-wide coupling is the smell.",
      },
      {
        id: "law-of-demeter-q3",
        question: "What's the standard fix for a train-wreck chain like `order.getCustomer().getWallet().getCard().charge()`?",
        options: [
          { id: "a", label: "Add a method to Order (e.g. order.chargeCard(amount)) so Order handles its own Customer/Wallet/Card, and the caller talks to just one friend." },
          { id: "b", label: "Make Customer, Wallet, and Card all public static so anyone can reach them." },
          { id: "c", label: "Catch the exception the chain throws and ignore it." },
          { id: "d", label: "Inline the chain into a single very long variable name." },
        ],
        correctOptionId: "a",
        explanation:
          "Don't reach for the data — tell your friend to do the work. Add `chargeCard` to `Order`; `Order` calls its own `Customer`, which calls its own `Wallet`, and so on. The caller now knows about exactly one class. This is the Law of Demeter together with its cousin 'tell, don't ask'.",
      },
      {
        id: "law-of-demeter-q4",
        question: "Is `new StringBuilder().append(\"a\").append(\"b\").toString()` a violation of the Law of Demeter?",
        options: [
          { id: "a", label: "No — each call returns the SAME builder object (this), so every call is on the same friend, not a walk through new strangers." },
          { id: "b", label: "Yes — it has more than one dot, so it always violates the law." },
          { id: "c", label: "Yes — any method chain is a train wreck by definition." },
          { id: "d", label: "No — but only because StringBuilder is part of the standard library." },
        ],
        correctOptionId: "a",
        explanation:
          "Demeter is about talking to *strangers*, not about dot count. A fluent builder returns `this` from each call, so you're talking to the same object the whole time — one friend, no strangers. A train wreck differs because each dot lands on a *different, deeper* object. Same friend = fine; new stranger each dot = smell.",
      },
      {
        id: "law-of-demeter-q5",
        question: "Which principle is the closest cousin of the Law of Demeter?",
        options: [
          { id: "a", label: "Tell, Don't Ask — tell an object what to do instead of asking for its data and acting on it yourself." },
          { id: "b", label: "Premature optimisation is the root of all evil." },
          { id: "c", label: "Always program to a concrete class, never an interface." },
          { id: "d", label: "Make every class a singleton so there's only one of each." },
        ],
        correctOptionId: "a",
        explanation:
          "'Tell, don't ask' is the natural partner: instead of `order.getCustomer().getWallet()...` (asking for data and operating on it), you `order.chargeCard(amount)` (telling the object what you want). Both push behaviour next to the data it needs and stop callers from reaching through strangers.",
      },
    ],
  },
};
