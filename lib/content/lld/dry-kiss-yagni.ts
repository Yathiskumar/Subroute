import type { RoadmapLesson } from "@/lib/content/types";

export const dryKissYagni: RoadmapLesson = {
  title: "DRY, KISS, YAGNI",
  oneLiner:
    "Three everyday rules of thumb that keep code clean. DRY: every fact lives in one place. KISS: the simplest thing that works beats the clever thing. YAGNI: don't build for a future you only imagine. Handy on their own — and most useful when you feel the tension between them.",
  difficulty: "beginner",
  estimatedTime: "15 min",
  prototypePath: "/prototypes/lld/dry-kiss-yagni.html",
  content: {
    prototypeCaption:
      "Three tabs, one rule each, with a single explain panel replaced on every click. **DRY** shows the same tax formula copy-pasted into three places; press *Extract shared function* and they collapse into one home while a *places to change* counter drops **3 → 1**. **KISS** toggles between a cryptic one-liner and a plain readable version of the same logic, with a *seconds to understand* meter that improves for the simple one. **YAGNI** lists features for 'save a user's name' — tap the speculative ones (multi-currency, plugin system, i18n) to *defer* them and watch the *code to build now* meter fall. Nothing scrolls; the panel narrates each move.",

    overview: [
      {
        type: "p",
        text: "**DRY**, **KISS**, and **YAGNI** are three short rules of thumb. They don't need a framework or a diagram. They fit on a sticky note. Yet they catch a huge share of the mess that creeps into real code. Learn them once and you'll spot trouble before it's written.",
      },
      {
        type: "p",
        text: "Think of writing code like writing down the rules of a board game. **DRY** says: write each rule *once*, in one place — if you write 'a turn lasts 60 seconds' on three different pages, someone will change one and forget the others. **KISS** says: explain the rules so a new player gets it fast — clever phrasing that needs re-reading three times is worse than a plain sentence. **YAGNI** says: don't write rules for a tournament mode nobody asked for yet — you'll spend pages on a game variant that never gets played.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "One line each",
        text: "**DRY** — *Don't Repeat Yourself*: every piece of knowledge has exactly one home. **KISS** — *Keep It Simple*: the simplest thing that works wins. **YAGNI** — *You Aren't Gonna Need It*: build what today needs, not what tomorrow might.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "They can pull against each other",
        text: "These rules are friends most of the time, but they argue at the edges. Chase **DRY** too hard and you'll merge two things that only *looked* alike, creating a tangled abstraction that breaks **KISS**. The honest rule of thumb: *prefer a little duplication over the wrong abstraction.* We'll come back to this — it's the most important idea in the lesson.",
      },
    ],

    howItWorks: [
      { type: "h", text: "DRY — every fact has one home" },
      {
        type: "p",
        text: "DRY isn't really about lines of code looking the same. It's about *knowledge*. A single fact — a tax rate, a validation rule, the shape of a database row — should have **one authoritative place** it lives. When that fact changes, you change it in one spot, and the whole system stays correct.",
      },
      {
        type: "p",
        text: "The classic smell is the same calculation copy-pasted around the codebase:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// ⚠️ same tax knowledge, pasted in three places
function cartTotal(p: number)    { return p + p * 0.08; }
function invoiceTotal(p: number) { return p + p * 0.08; }
function receiptTotal(p: number) { return p + p * 0.08; }`,
      },
      {
        type: "p",
        text: "The day the tax rate becomes 9%, you must remember *all three* spots. Miss one and your receipts disagree with your invoices. DRY says: give that fact **one home**.",
      },
      {
        type: "code",
        language: "typescript",
        code: `const TAX_RATE = 0.08;                 // the single source of truth
function withTax(p: number) { return p + p * TAX_RATE; }
// cartTotal, invoiceTotal, receiptTotal all call withTax()`,
      },
      {
        type: "callout",
        variant: "info",
        title: "DRY is about knowledge, not characters",
        text: "Two lines of code that look identical *today* but mean different things will drift apart tomorrow. A shipping fee that happens to equal the tax rate isn't the same fact — merging them is a bug waiting to happen. Only deduplicate things that are the *same knowledge*, not things that merely *look alike*.",
      },
      { type: "h", text: "KISS — simple beats clever" },
      {
        type: "p",
        text: "Code is read far more often than it's written. KISS says the best version of a piece of code is the one the *next person* understands fastest — usually you, six months from now. A clever one-liner that saves three characters but takes a minute to decode is a bad trade.",
      },
      {
        type: "code",
        language: "typescript",
        code: `// clever — correct, but you have to stop and decode it
const r = a.reduce((s, x) => s + (x.q ? x.q * x.p : 0), 0);

// simple — boring, and instantly readable
let total = 0;
for (const item of cart) {
  if (item.quantity) total += item.quantity * item.price;
}`,
      },
      {
        type: "p",
        text: "Both compute the same total. The second one is longer and that's *fine* — anyone can read it at a glance, fix it under pressure, and trust it. KISS isn't 'write less code'; it's 'write code that's easy to understand.'",
      },
      { type: "h", text: "YAGNI — build for today, not for a guess" },
      {
        type: "p",
        text: "YAGNI fights the urge to add things 'just in case'. You're asked to **save a user's name**. The simple feature is one text field and a save. But it's tempting to also add multi-currency support, a plugin system, and full internationalization — because *maybe* the product will need them someday.",
      },
      {
        type: "p",
        text: "YAGNI says: don't. Every speculative feature is code you have to write, test, document, and maintain *now*, for a payoff that may never come. Most guessed-at futures never arrive, and when the real need shows up it's usually different from what you imagined — so you'd rebuild it anyway. Build the thing in front of you.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The classic trap: premature abstraction & speculative generality",
        text: "The deepest mistake behind all three is building for an imagined future. *Speculative generality* is adding hooks, config flags, and abstract base classes for cases that don't exist yet. *Premature abstraction* is wrapping code in a flexible framework before you understand the real shape of the problem. Both feel responsible. Both usually produce guesswork you'll delete later. Wait until you have two or three real examples before you abstract — then you'll abstract the *right* thing.",
      },
      { type: "h", text: "The tension: DRY vs. the wrong abstraction" },
      {
        type: "p",
        text: "Here is where these rules collide, and where good judgement matters most. Suppose two functions look 90% identical. DRY screams: merge them! So you extract a shared helper. Then the two callers slowly diverge — one needs an extra step, the other a special case. You add a `flag` parameter. Then another. Soon the 'shared' function is a maze of `if`s that serves neither caller well. You optimized for DRY and destroyed KISS.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 640 300" width="100%" style="max-width:640px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two paths from duplicated code. Path one: forcing both into one shared function adds flag parameters and becomes a tangled wrong abstraction. Path two: keeping a little duplication stays simple and easy to change.">
  <!-- start -->
  <rect x="245" y="20" width="150" height="44" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="320" y="40" text-anchor="middle" font-size="12" font-weight="600" fill="#e8e4dc">Two bits of code</text>
  <text x="320" y="56" text-anchor="middle" font-size="10" fill="#6b7280">that look 90% alike</text>

  <!-- branches -->
  <line x1="270" y1="64" x2="150" y2="104" stroke="#9099a8" stroke-width="1.4"/>
  <line x1="370" y1="64" x2="490" y2="104" stroke="#9099a8" stroke-width="1.4"/>
  <text x="180" y="92" text-anchor="middle" font-size="10" fill="#9099a8">force DRY</text>
  <text x="470" y="92" text-anchor="middle" font-size="10" fill="#fb863a">a little duplication</text>

  <!-- LEFT path: wrong abstraction -->
  <rect x="40" y="108" width="220" height="44" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="150" y="128" text-anchor="middle" font-size="11.5" font-weight="600" fill="#e8e4dc">one shared function</text>
  <text x="150" y="144" text-anchor="middle" font-size="10" fill="#6b7280">they start to diverge…</text>

  <line x1="150" y1="152" x2="150" y2="184" stroke="#9099a8" stroke-width="1.4" stroke-dasharray="4 4"/>

  <rect x="40" y="188" width="220" height="56" rx="6" fill="#14161a" stroke="#f06868" stroke-width="1.5"/>
  <text x="150" y="210" text-anchor="middle" font-size="11.5" font-weight="600" fill="#f06868">a maze of if(flag)</text>
  <text x="150" y="227" text-anchor="middle" font-size="10" fill="#9099a8">the WRONG abstraction —</text>
  <text x="150" y="240" text-anchor="middle" font-size="10" fill="#9099a8">serves neither caller</text>

  <!-- RIGHT path: stays simple -->
  <rect x="380" y="108" width="220" height="44" rx="6" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="490" y="128" text-anchor="middle" font-size="11.5" font-weight="600" fill="#e8e4dc">two small functions</text>
  <text x="490" y="144" text-anchor="middle" font-size="10" fill="#6b7280">each free to change</text>

  <line x1="490" y1="152" x2="490" y2="184" stroke="#fb863a" stroke-width="1.4" stroke-dasharray="4 4"/>

  <rect x="380" y="188" width="220" height="56" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.5"/>
  <text x="490" y="210" text-anchor="middle" font-size="11.5" font-weight="600" fill="#5cc66f">stays simple (KISS)</text>
  <text x="490" y="227" text-anchor="middle" font-size="10" fill="#9099a8">if they later prove the</text>
  <text x="490" y="240" text-anchor="middle" font-size="10" fill="#9099a8">SAME, merge then</text>
</svg>`,
        caption:
          "When two pieces of code merely *look* alike, forcing them under one DRY abstraction often backfires: they diverge, you bolt on `flag` parameters, and you end up with the **wrong abstraction** that breaks KISS. Keeping a little duplication leaves each piece simple and free to evolve — and if they turn out to be the *same* knowledge, you can always merge them later.",
      },
      {
        type: "callout",
        variant: "tip",
        title: 'Sandi Metz: "prefer duplication over the wrong abstraction"',
        text: "This trade-off is famous enough to have a name: **AHA — Avoid Hasty Abstractions**. The guidance: don't deduplicate the moment you see repetition. Wait until the duplication has *proven* it's the same knowledge (often after the third occurrence). A little duplication is cheap to fix; the wrong abstraction is expensive to unwind. When DRY and KISS disagree, lean toward simple.",
      },
    ],

    handsOn: [
      {
        title: "01 · DRY — give the fact one home",
        body: "Open the **DRY** tab. You'll see the same `price + price * 0.08` tax formula copy-pasted into three functions, and a *places to change when the tax rate moves* counter reading **3**. Press *Extract shared function*. The three copies collapse into one `withTax()` everyone calls, and the counter drops to **1**. The explain panel makes the point: one fact, one home — change it once and the whole app stays correct.",
      },
      {
        title: "02 · KISS — simple beats clever",
        body: "Switch to the **KISS** tab. A toggle flips the same logic between a cryptic `reduce` one-liner and a plain `for` loop. Watch the *seconds to understand* meter: the clever version reads high (slow to decode), the simple version reads low (instant). Both produce the same answer — KISS just picks the one the next reader grasps fastest.",
      },
      {
        title: "03 · YAGNI — defer the speculative",
        body: "Open the **YAGNI** tab. The job is *save a user's name*, but the checklist is padded with guessed-at features: multi-currency, a plugin system, full i18n. Click each speculative item to *defer* it and watch the *code to build & maintain now* meter fall. What's left is the one real feature today actually needs. Build that; let tomorrow ask for the rest.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "dry-kiss-yagni.ts",
        code: `// ===== DRY — one home for the tax fact =====
// BEFORE: same knowledge pasted in three places.
function cartTotalV0(p: number)    { return p + p * 0.08; }
function invoiceTotalV0(p: number) { return p + p * 0.08; }
// AFTER: single source of truth — change it once.
const TAX_RATE = 0.08;
function withTax(p: number) { return p + p * TAX_RATE; }
const cartTotal    = (p: number) => withTax(p);
const invoiceTotal = (p: number) => withTax(p);

// ===== KISS — simple beats clever =====
type Item = { quantity: number; price: number };
// clever one-liner (you have to decode it):
const totalClever = (cart: Item[]) =>
  cart.reduce((s, x) => s + (x.quantity ? x.quantity * x.price : 0), 0);
// simple, instantly readable — and that's the point:
function total(cart: Item[]) {
  let sum = 0;
  for (const item of cart) {
    if (item.quantity) sum += item.quantity * item.price;
  }
  return sum;
}

// ===== YAGNI — build only what today needs =====
// The ask: "save a user's name." So just do that.
function saveName(name: string) { db.save({ name }); }
// DON'T pre-build a speculative future nobody asked for:
//   multi-currency, a plugin system, full i18n…
//   add them when a real requirement actually arrives.
declare const db: { save: (row: { name: string }) => void };`,
      },
      {
        label: "Java",
        language: "java",
        filename: "DryKissYagni.java",
        code: `import java.util.List;

class DryKissYagni {
    // ===== DRY — one home for the tax fact =====
    // BEFORE: same knowledge pasted in three places.
    static double cartTotalV0(double p)    { return p + p * 0.08; }
    static double invoiceTotalV0(double p) { return p + p * 0.08; }
    // AFTER: single source of truth — change it once.
    static final double TAX_RATE = 0.08;
    static double withTax(double p) { return p + p * TAX_RATE; }
    static double cartTotal(double p)    { return withTax(p); }
    static double invoiceTotal(double p) { return withTax(p); }

    record Item(int quantity, double price) {}

    // ===== KISS — simple beats clever =====
    // clever (decode it): a stream one-liner.
    static double totalClever(List<Item> cart) {
        return cart.stream()
            .mapToDouble(x -> x.quantity() > 0 ? x.quantity() * x.price() : 0)
            .sum();
    }
    // simple, instantly readable — and that's the point:
    static double total(List<Item> cart) {
        double sum = 0;
        for (Item item : cart) {
            if (item.quantity() > 0) sum += item.quantity() * item.price();
        }
        return sum;
    }

    // ===== YAGNI — build only what today needs =====
    // The ask: "save a user's name." So just do that.
    static void saveName(Db db, String name) { db.save(name); }
    // DON'T pre-build multi-currency, a plugin system, full i18n…
    // add them when a real requirement actually arrives.
    interface Db { void save(String name); }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "dry_kiss_yagni.py",
        code: `from dataclasses import dataclass

# ===== DRY — one home for the tax fact =====
# BEFORE: same knowledge pasted in three places.
def cart_total_v0(p: float) -> float:    return p + p * 0.08
def invoice_total_v0(p: float) -> float: return p + p * 0.08
# AFTER: single source of truth — change it once.
TAX_RATE = 0.08
def with_tax(p: float) -> float: return p + p * TAX_RATE
def cart_total(p: float) -> float:    return with_tax(p)
def invoice_total(p: float) -> float: return with_tax(p)

@dataclass
class Item:
    quantity: int
    price: float

# ===== KISS — simple beats clever =====
# clever (decode it): a generator one-liner.
def total_clever(cart: list[Item]) -> float:
    return sum(x.quantity * x.price for x in cart if x.quantity)

# simple, instantly readable — and that's the point:
def total(cart: list[Item]) -> float:
    s = 0.0
    for item in cart:
        if item.quantity:
            s += item.quantity * item.price
    return s

# ===== YAGNI — build only what today needs =====
# The ask: "save a user's name." So just do that.
def save_name(db, name: str) -> None:
    db.save({"name": name})
# DON'T pre-build multi-currency, a plugin system, full i18n…
# add them when a real requirement actually arrives.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "dry_kiss_yagni.cpp",
        code: `#include <string>
#include <vector>
#include <numeric>

// ===== DRY — one home for the tax fact =====
// BEFORE: same knowledge pasted in three places.
double cartTotalV0(double p)    { return p + p * 0.08; }
double invoiceTotalV0(double p) { return p + p * 0.08; }
// AFTER: single source of truth — change it once.
constexpr double TAX_RATE = 0.08;
double withTax(double p) { return p + p * TAX_RATE; }
double cartTotal(double p)    { return withTax(p); }
double invoiceTotal(double p) { return withTax(p); }

struct Item { int quantity; double price; };

// ===== KISS — simple beats clever =====
// clever (decode it): an accumulate one-liner.
double totalClever(const std::vector<Item>& cart) {
    return std::accumulate(cart.begin(), cart.end(), 0.0,
        [](double s, const Item& x) {
            return s + (x.quantity ? x.quantity * x.price : 0.0);
        });
}
// simple, instantly readable — and that's the point:
double total(const std::vector<Item>& cart) {
    double sum = 0.0;
    for (const Item& item : cart) {
        if (item.quantity) sum += item.quantity * item.price;
    }
    return sum;
}

// ===== YAGNI — build only what today needs =====
// The ask: "save a user's name." So just do that.
struct Db { void save(const std::string& name); };
void saveName(Db& db, const std::string& name) { db.save(name); }
// DON'T pre-build multi-currency, a plugin system, full i18n…
// add them when a real requirement actually arrives.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for each rule when…" },
      {
        type: "ul",
        items: [
          "**DRY** — when you catch yourself copy-pasting a fact (a rate, a regex, a config value, a row shape) into a second or third place. Give it one home *before* the copies drift apart.",
          "**KISS** — always, but especially when you feel the pull to be clever: a dense one-liner, a too-flexible config, a fancy pattern. Ask 'will the next reader get this fast?' If not, simplify.",
          "**YAGNI** — when you're about to add something 'just in case' for a future nobody has actually asked for. Build the requirement in front of you; revisit when the real need shows up.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When DRY and KISS fight, KISS usually wins",
        text: "If removing duplication would force you to add flags, special cases, or a confusing abstraction, stop. A little honest duplication is easier to read and cheaper to change than a tangled 'shared' helper. Wait for the duplication to prove it's truly the same knowledge — then deduplicate with confidence.",
      },
    ],

    tradeoffs: {
      pros: [
        "Fewer bugs from drift — DRY means a fact changes in exactly one place, so copies can't silently disagree.",
        "Easier to read and fix — KISS code is graspable under pressure by whoever maintains it next (often future-you).",
        "Less wasted work — YAGNI keeps you from building, testing, and maintaining features that never ship.",
        "Smaller surface area — simpler code with one home per fact has fewer places for bugs to hide.",
      ],
      cons: [
        "DRY misapplied creates the wrong abstraction — merging things that only look alike couples them and adds flag-driven complexity.",
        "KISS can be used as an excuse to skip genuinely needed structure — 'simple' must not mean 'naive' or 'unsafe'.",
        "YAGNI taken too far skips real, known near-term needs — it's about *speculative* features, not deliberately ignoring the roadmap.",
        "They're heuristics, not laws — each requires judgement, and the three sometimes point in different directions.",
      ],
    },

    furtherReading: [
      {
        label: "Don't Repeat Yourself — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Don%27t_repeat_yourself",
        note: "Origin of DRY in The Pragmatic Programmer, framed around knowledge having a single authoritative representation — the key nuance most people miss.",
        kind: "docs",
      },
      {
        label: "KISS principle — Wikipedia",
        href: "https://en.wikipedia.org/wiki/KISS_principle",
        note: "History and meaning of 'Keep It Simple', including its engineering origins and why simplicity is a design goal rather than a lack of effort.",
        kind: "docs",
      },
      {
        label: "Yagni — Martin Fowler",
        href: "https://martinfowler.com/bliki/Yagni.html",
        note: "Fowler's careful essay on what YAGNI really means: it targets speculative presumptive features, and he tallies the four real costs of building them early.",
        kind: "article",
      },
      {
        label: "The Wrong Abstraction — Sandi Metz",
        href: "https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction",
        note: "The canonical piece on the DRY-vs-simplicity tension, with the famous line 'prefer duplication over the wrong abstraction.' Essential reading.",
        kind: "article",
      },
      {
        label: "AHA Programming (Avoid Hasty Abstractions) — Kent C. Dodds",
        href: "https://kentcdodds.com/blog/aha-programming",
        note: "Coins AHA as the practical balance between DRY and WET: optimize for change, and don't abstract until the duplication has proven itself.",
        kind: "article",
      },
      {
        label: "The Pragmatic Programmer — Hunt & Thomas",
        href: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
        note: "The book that introduced DRY (and much of this mindset). Chapters on duplication, orthogonality, and 'good-enough' software ground all three rules.",
        kind: "book",
      },
      {
        label: "Speculative Generality — Refactoring (Fowler)",
        href: "https://refactoring.guru/smells/speculative-generality",
        note: "A catalog entry on the exact code smell YAGNI prevents: hooks and abstractions added for cases that never arrive, plus how to refactor them out.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "dry-kiss-yagni-q1",
        question: "What does DRY (Don't Repeat Yourself) actually ask you to avoid duplicating?",
        options: [
          { id: "a", label: "Any single piece of knowledge — a fact should have one authoritative home in the system." },
          { id: "b", label: "Every line of code that looks textually similar, regardless of meaning." },
          { id: "c", label: "Function and variable names across the whole codebase." },
          { id: "d", label: "Comments — you should never explain the same thing twice." },
        ],
        correctOptionId: "a",
        explanation:
          "DRY is about knowledge, not characters. A fact like a tax rate or a validation rule should live in exactly one place so a change updates the whole system at once. Code that merely *looks* alike (b) but represents different facts should NOT be merged — that's how you get the wrong abstraction.",
      },
      {
        id: "dry-kiss-yagni-q2",
        question: "A teammate replaces a clear 6-line loop with a dense one-line `reduce` that does the same thing. From a KISS standpoint, is that an improvement?",
        options: [
          { id: "a", label: "Not necessarily — KISS favors the version the next reader understands fastest, even if it's longer." },
          { id: "b", label: "Yes — fewer lines is always simpler and therefore always better." },
          { id: "c", label: "Yes — clever code shows skill and should be preferred." },
          { id: "d", label: "It doesn't matter, because KISS only applies to architecture, not individual functions." },
        ],
        correctOptionId: "a",
        explanation:
          "KISS means 'easy to understand,' not 'fewest lines.' If the one-liner takes a minute to decode while the loop is instantly clear, the loop is the simpler choice. Code is read far more than it's written, so optimize for the reader.",
      },
      {
        id: "dry-kiss-yagni-q3",
        question: "You're asked only to 'save a user's name,' but you're tempted to also add a plugin system and multi-currency support for later. What does YAGNI advise?",
        options: [
          { id: "a", label: "Build just the save-name feature now; add the rest when a real requirement for them actually arrives." },
          { id: "b", label: "Build all of it now so you never have to come back to this code." },
          { id: "c", label: "Build the plugin system first, since everything else can hang off it." },
          { id: "d", label: "Skip the feature entirely until the full future design is known." },
        ],
        correctOptionId: "a",
        explanation:
          "YAGNI — You Aren't Gonna Need It — says don't build speculative features for an imagined future. Each one costs time to write, test, and maintain now, and the guessed-at need usually never comes (or arrives in a different shape). Build today's requirement; defer the rest.",
      },
      {
        id: "dry-kiss-yagni-q4",
        question: "Two functions look 90% alike, so you merge them under one shared helper. Over time you keep adding `flag` parameters and special cases until it's a maze. What went wrong?",
        options: [
          { id: "a", label: "DRY was applied to code that only looked alike, producing the wrong abstraction and breaking KISS." },
          { id: "b", label: "YAGNI was violated because the helper handles future cases." },
          { id: "c", label: "Nothing — a flag-driven shared function is the ideal outcome of DRY." },
          { id: "d", label: "The functions should have been duplicated four or five more times first." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the classic DRY-vs-KISS tension. The two pieces weren't truly the same knowledge; forcing them together coupled them, and each new difference added a flag until the abstraction served neither caller. The fix is to prefer a little duplication over the wrong abstraction (AHA — Avoid Hasty Abstractions).",
      },
      {
        id: "dry-kiss-yagni-q5",
        question: "What is 'speculative generality' and which rule most directly guards against it?",
        options: [
          { id: "a", label: "Adding hooks, flags, and abstractions for cases that don't exist yet — guarded against by YAGNI." },
          { id: "b", label: "Writing the same fact in many places — guarded against by KISS." },
          { id: "c", label: "Naming variables too cleverly — guarded against by DRY." },
          { id: "d", label: "Deleting code that might be needed later — guarded against by DRY." },
        ],
        correctOptionId: "a",
        explanation:
          "Speculative generality is building flexibility for imagined future needs — extra abstraction layers, config knobs, and extension points nobody asked for. YAGNI directly counters it: wait for a real requirement before adding the machinery, and you'll usually build the right thing instead of a guess you delete later.",
      },
    ],
  },
};
