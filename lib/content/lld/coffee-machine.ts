import type { RoadmapLesson } from "@/lib/content/types";

export const coffeeMachine: RoadmapLesson = {
  title: "Coffee Machine",
  oneLiner:
    "The vending machine's harder sibling. There, each product sat in its own slot. Here, **every drink is made from the same tanks** — so the moment you have more than one outlet, two customers can both check the milk, both see enough, and both pour. This is the smallest problem that forces you to get a shared resource right.",
  difficulty: "beginner",
  estimatedTime: "24 min",
  prototypePath: "/prototypes/lld/coffee-machine.html",
  content: {
    prototypeCaption:
      "Three outlets, **one shared set of tanks**. Press **☕ All three want Latte** — each latte needs 80ml of milk and the tank holds 200, so only two can be served. Now press **▶ Serve all** in **⚠️ Unguarded** mode and watch the sequence: all three check, all three see enough milk, all three pour, and the milk tank ends at **−40ml**. The machine served coffee it did not have. Switch to **🔒 Guarded**, refill, and run the identical order: outlets go one at a time, the third one sees what the first two already took, and it is refused. **2 served, 1 refused, nothing below zero.**",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design a coffee machine.”* It sounds like the vending machine again — pick a drink, it comes out. And if there is exactly one outlet, it very nearly is.",
      },
      {
        type: "p",
        text: "The difference is what a drink is *made of*. A vending machine hands you an item that already exists in a slot. A coffee machine **builds** your drink from tanks of water, milk, beans and sugar — and those tanks are shared by everything it makes. Order a latte and you have quietly changed what the espresso next to it can do.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A coffee machine drawn from the front. Four ingredient tanks for water, milk, beans and sugar sit above three outlets, each with a cup below it. Arrows show all four tanks feeding all three outlets. Labels mark Ingredient, Inventory, Recipe, Outlet and Beverage.">
  <defs>
    <marker id="cm-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="cm-flow" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <rect x="176" y="20" width="360" height="266" rx="10" fill="none" stroke="#3a414c" stroke-width="1.4"/>

  <!-- tanks -->
  <rect x="192" y="34" width="76" height="66" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <rect x="196" y="66" width="68" height="30" rx="3" fill="rgba(94,159,246,0.22)"/>
  <text x="204" y="52" font-size="9" fill="#9099a8">Water</text><text x="204" y="88" font-size="9" fill="#e8e4dc">500</text>

  <rect x="276" y="34" width="76" height="66" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <rect x="280" y="72" width="68" height="24" rx="3" fill="rgba(94,159,246,0.22)"/>
  <text x="288" y="52" font-size="9" fill="#9099a8">Milk</text><text x="288" y="90" font-size="9" fill="#e8e4dc">200</text>

  <rect x="360" y="34" width="76" height="66" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <rect x="364" y="76" width="68" height="20" rx="3" fill="rgba(94,159,246,0.22)"/>
  <text x="368" y="52" font-size="9" fill="#9099a8">Beans</text><text x="368" y="91" font-size="9" fill="#e8e4dc">100</text>

  <rect x="444" y="34" width="76" height="66" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <rect x="448" y="82" width="68" height="14" rx="3" fill="rgba(94,159,246,0.22)"/>
  <text x="452" y="52" font-size="9" fill="#9099a8">Sugar</text><text x="452" y="93" font-size="9" fill="#e8e4dc">60</text>

  <text x="20" y="52" font-size="11" fill="#fb863a">Ingredient</text>
  <line x1="94" y1="48" x2="186" y2="52" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#cm-lead)"/>
  <text x="20" y="86" font-size="11" fill="#fb863a">Inventory</text>
  <text x="20" y="102" font-size="9" fill="#9099a8">all four tanks together</text>

  <!-- flow arrows: every tank feeds every outlet -->
  <line x1="230" y1="100" x2="248" y2="152" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#cm-flow)"/>
  <line x1="230" y1="100" x2="352" y2="152" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" opacity=".45" marker-end="url(#cm-flow)"/>
  <line x1="314" y1="100" x2="252" y2="152" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" opacity=".45" marker-end="url(#cm-flow)"/>
  <line x1="314" y1="100" x2="356" y2="152" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#cm-flow)"/>
  <line x1="398" y1="100" x2="360" y2="152" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" opacity=".45" marker-end="url(#cm-flow)"/>
  <line x1="398" y1="100" x2="462" y2="152" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#cm-flow)"/>
  <line x1="482" y1="100" x2="466" y2="152" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" opacity=".45" marker-end="url(#cm-flow)"/>

  <text x="556" y="92" font-size="10" fill="#5e9ff6">every tank feeds</text>
  <text x="556" y="108" font-size="10" fill="#5e9ff6">every outlet</text>

  <!-- outlets -->
  <rect x="196" y="158" width="104" height="46" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="216" y="186" font-size="9" fill="#9099a8">outlet #1</text>
  <rect x="304" y="158" width="104" height="46" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="324" y="186" font-size="9" fill="#fb863a">outlet #2</text>
  <rect x="412" y="158" width="104" height="46" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="432" y="186" font-size="9" fill="#9099a8">outlet #3</text>

  <text x="556" y="184" font-size="11" fill="#fb863a">Outlet</text>
  <line x1="590" y1="176" x2="522" y2="178" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#cm-lead)"/>

  <!-- cups -->
  <text x="230" y="248" font-size="24">☕</text>
  <text x="338" y="248" font-size="24">🥛</text>
  <text x="446" y="248" font-size="24">🍵</text>
  <text x="196" y="274" font-size="9" fill="#6b7280">Espresso</text>
  <text x="312" y="274" font-size="9" fill="#6b7280">Latte</text>
  <text x="428" y="274" font-size="9" fill="#6b7280">Tea</text>

  <text x="556" y="240" font-size="11" fill="#fb863a">Beverage</text>
  <text x="556" y="258" font-size="9" fill="#9099a8">made by a Recipe:</text>
  <text x="556" y="274" font-size="9" fill="#9099a8">water 60, milk 80,</text>
  <text x="556" y="288" font-size="9" fill="#9099a8">beans 20</text>
</svg>`,
        caption:
          "Follow the blue arrows. **Every tank feeds every outlet** — that crossing is the entire problem, and it is why this is not just a vending machine with different pictures.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **recipe** is a map of ingredient → quantity. An **outlet** takes an order, and asks the shared **inventory** for exactly those amounts. The inventory must check availability and subtract in **one indivisible step**, or two outlets will both be told yes for the same milk.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Are recipes data?** A `class Latte` and a `class Espresso` with identical structure means adding a drink is a code change. A row in a map means it is configuration.",
          "**Is check-and-take atomic?** The one question the problem exists to ask. Everything else here is bookkeeping.",
          "**Is a failed brew all-or-nothing?** Deducting water and beans and *then* discovering there is no milk leaves the machine short with nothing to show for it.",
          "**Does it say *which* ingredient is missing?** *“Cannot make latte”* is useless to whoever refills the machine. *“Not enough milk”* is a real error message.",
          "**Does it run?** Three outlets, a race you can point at, and a demo that prints the tank levels before and after.",
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
          "**How many outlets?** — the question that decides whether this is interesting. If they say one, ask *“could there be N?”*, because that is the whole design conversation.",
          "**Can outlets serve at the same time?** — say yes. It costs one lock and it is the difference between a toy and a system.",
          "**Where do recipes come from?** — configuration loaded at startup. Hardcoded recipes cannot be tested or varied.",
          "**What happens when an ingredient runs out?** — refuse and **name the ingredient**. Also worth asking: does the machine warn *before* it runs dry?",
          "**Payment, cup detection, cleaning cycles, temperature?** — out of scope. Say it in one sentence.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Do not let them talk you down to one outlet",
        text: "A single-outlet coffee machine is [[vending-machine]] with a different noun, and you will run out of things to say by minute 25. *“Assume three outlets that can brew simultaneously”* gives you the concurrency conversation, which is the only reason this problem is in the set.",
      },

      // ---------- recipes as data ----------
      { type: "h", text: "Step 2 · A recipe is data, not a class" },
      {
        type: "p",
        text: "The instinct is `class Latte`, `class Espresso`, `class Cappuccino`, each with a `make()` method. Look at what those classes would actually contain: the same three fields with different numbers.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 246" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, three beverage classes Espresso, Latte and Cappuccino, each with an identical make method differing only in numbers, and a note that adding a drink means adding a class and editing a factory. On the right, a single recipe map from name to ingredient quantities, with a note that adding a drink means adding one row of configuration.">
  <text x="20" y="24" font-size="10.5" fill="#f06868">✗ A CLASS PER DRINK</text>
  <rect x="20" y="34" width="316" height="190" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="38" y="58" font-size="10" fill="#e8e4dc">class Espresso   { make() { water 50, beans 20 } }</text>
  <text x="38" y="80" font-size="10" fill="#e8e4dc">class Latte      { make() { water 60, milk 80,</text>
  <text x="38" y="96" font-size="10" fill="#e8e4dc">                            beans 20 } }</text>
  <text x="38" y="118" font-size="10" fill="#e8e4dc">class Cappuccino { make() { water 50, milk 60,</text>
  <text x="38" y="134" font-size="10" fill="#e8e4dc">                            beans 25 } }</text>
  <line x1="38" y1="152" x2="318" y2="152" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="38" y="174" font-size="10" fill="#f06868">same shape three times</text>
  <text x="38" y="194" font-size="10" fill="#f06868">new drink = new class + edit a factory</text>
  <text x="38" y="214" font-size="10" fill="#f06868">+ a redeploy</text>

  <text x="364" y="24" font-size="10.5" fill="#5cc66f">✓ RECIPES AS DATA</text>
  <rect x="364" y="34" width="316" height="190" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="382" y="58" font-size="10" fill="#e8e4dc">Map&lt;String, Map&lt;Ingredient, Integer&gt;&gt;</text>
  <line x1="382" y1="70" x2="662" y2="70" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="92" font-size="10" fill="#5cc66f">espresso   → { water 50, beans 20 }</text>
  <text x="382" y="112" font-size="10" fill="#5cc66f">latte      → { water 60, milk 80, beans 20 }</text>
  <text x="382" y="132" font-size="10" fill="#5cc66f">cappuccino → { water 50, milk 60, beans 25 }</text>
  <line x1="382" y1="150" x2="662" y2="150" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="172" font-size="10" fill="#5cc66f">one brew() for every drink</text>
  <text x="382" y="192" font-size="10" fill="#5cc66f">new drink = one row of config</text>
  <text x="382" y="212" font-size="10" fill="#9099a8">no code, no redeploy</text>
</svg>`,
        caption:
          "The test: *does the new thing behave differently, or only hold different numbers?* Different numbers means data. If someone later adds a drink that needs a **step** rather than an ingredient — steam the milk, wait 30s — *that* earns a class.",
      },

      // ---------- the race ----------
      { type: "h", text: "Step 3 · The race — the reason this problem exists" },
      {
        type: "p",
        text: "Three outlets, 200ml of milk, three lattes at 80ml each. There is enough for two. Here is what happens when each outlet checks and then takes:",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 330" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Top half unguarded: outlets one, two and three each read milk equals two hundred and each conclude eighty is available, then all three subtract, leaving milk at minus forty and three lattes served. Bottom half guarded: outlet one checks and takes inside a lock leaving one hundred and twenty, outlet two checks and takes leaving forty, outlet three checks and sees forty is less than eighty so it is refused. Two served, nothing negative.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">⚠️ UNGUARDED — everyone checks before anyone takes</text>
  <rect x="20" y="32" width="660" height="126" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>

  <text x="36" y="58" font-size="9.5" fill="#9099a8">outlet 1</text>
  <rect x="94" y="44" width="150" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="104" y="59" font-size="9" fill="#e8e4dc">read milk = 200 ✓</text>
  <rect x="330" y="44" width="150" height="22" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="340" y="59" font-size="9" fill="#f06868">milk −= 80</text>

  <text x="36" y="92" font-size="9.5" fill="#9099a8">outlet 2</text>
  <rect x="132" y="78" width="150" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="142" y="93" font-size="9" fill="#e8e4dc">read milk = 200 ✓</text>
  <rect x="368" y="78" width="150" height="22" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="378" y="93" font-size="9" fill="#f06868">milk −= 80</text>

  <text x="36" y="126" font-size="9.5" fill="#9099a8">outlet 3</text>
  <rect x="170" y="112" width="150" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="180" y="127" font-size="9" fill="#e8e4dc">read milk = 200 ✓</text>
  <rect x="406" y="112" width="150" height="22" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="416" y="127" font-size="9" fill="#f06868">milk −= 80</text>

  <text x="36" y="150" font-size="10" fill="#f06868">3 lattes served · milk tank = −40ml · the machine poured what it did not have</text>

  <text x="20" y="192" font-size="10.5" fill="#5cc66f">🔒 GUARDED — check and take are one indivisible step</text>
  <rect x="20" y="202" width="660" height="112" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <text x="36" y="228" font-size="9.5" fill="#9099a8">outlet 1</text>
  <rect x="94" y="214" width="220" height="22" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="104" y="229" font-size="9" fill="#5cc66f">lock · 200 ≥ 80 · take → 120</text>

  <text x="36" y="262" font-size="9.5" fill="#9099a8">outlet 2</text>
  <rect x="330" y="248" width="220" height="22" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="340" y="263" font-size="9" fill="#5cc66f">lock · 120 ≥ 80 · take → 40</text>

  <text x="36" y="296" font-size="9.5" fill="#9099a8">outlet 3</text>
  <rect x="330" y="282" width="220" height="22" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="340" y="297" font-size="9" fill="#f06868">lock · 40 &lt; 80 · REFUSED</text>

  <text x="566" y="263" font-size="10" fill="#5cc66f">2 served, 1 refused</text>
  <text x="566" y="297" font-size="10" fill="#5cc66f">milk = 40, never below 0</text>
</svg>`,
        caption:
          "Run both halves in the prototype and read the milk tank. **−40ml** versus **40ml** — the same order, the same recipes, one lock apart.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "This is check-then-act, and it is everywhere",
        text: "*“Is there enough? Then take it.”* Between the question and the answer, someone else asked the same question and got the same answer. You have already met this exact bug: two gates grabbing one parking spot in [[parking-lot]], and two threads incrementing a counter in [[atomic-operations-and-cas]]. It always looks different and it is always the same shape.",
      },
      {
        type: "code",
        language: "java",
        filename: "the fix, in full",
        code: `class Inventory {
    private final Map<Ingredient, Integer> levels = new EnumMap<>(Ingredient.class);

    /**
     * Check every ingredient AND subtract every ingredient, with nothing in between.
     * Either the whole recipe is deducted, or nothing is.
     */
    public synchronized void consume(Map<Ingredient, Integer> recipe) {
        for (var e : recipe.entrySet()) {                 // check ALL first
            if (levels.get(e.getKey()) < e.getValue())
                throw new NotEnoughIngredientException(e.getKey());   // names WHICH one
        }
        for (var e : recipe.entrySet())                   // then take ALL
            levels.merge(e.getKey(), -e.getValue(), Integer::sum);
    }
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Note the two loops",
        text: "Checking and taking in a **single** pass is a subtler bug: you would deduct water and beans, hit the milk, throw — and leave the machine short of two ingredients with no coffee made. Two loops means the method is **all-or-nothing**, which is the same principle as the rollback in [[atm]] but achieved by ordering rather than compensation.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 224" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="One-pass deduction takes water then beans then hits milk and throws, leaving water and beans already gone and no drink made. Two-pass deduction checks water, beans and milk first, finds milk short, and throws before touching anything, so all tanks are unchanged.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ ONE PASS — check and take together, ingredient by ingredient</text>
  <rect x="20" y="32" width="660" height="72" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <rect x="38" y="46" width="130" height="24" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="48" y="62" font-size="9" fill="#e8e4dc">water ok → take</text>
  <text x="176" y="62" font-size="10" fill="#6b7280">→</text>
  <rect x="196" y="46" width="130" height="24" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="206" y="62" font-size="9" fill="#e8e4dc">beans ok → take</text>
  <text x="334" y="62" font-size="10" fill="#6b7280">→</text>
  <rect x="354" y="46" width="150" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="364" y="62" font-size="9" fill="#f06868">milk short → throw</text>
  <text x="38" y="94" font-size="10" fill="#f06868">water and beans are gone · no coffee made · nobody can undo it</text>

  <text x="20" y="142" font-size="10.5" fill="#5cc66f">✓ TWO PASSES — check everything, then take everything</text>
  <rect x="20" y="152" width="660" height="62" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <rect x="38" y="166" width="200" height="24" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="48" y="182" font-size="9" fill="#e8e4dc">check water, beans, milk</text>
  <text x="246" y="182" font-size="10" fill="#6b7280">→</text>
  <rect x="266" y="166" width="180" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="276" y="182" font-size="9" fill="#f06868">milk short → throw</text>
  <text x="462" y="182" font-size="10" fill="#5cc66f">every tank untouched</text>
  <text x="38" y="208" font-size="9.5" fill="#9099a8">the same rule as the parking lot and the ATM: do everything that can fail before the first thing you cannot undo</text>
</svg>`,
        caption:
          "Three problems in this phase, one rule: **every check that can fail goes before the first irreversible action.**",
      },

      // ---------- lock granularity ----------
      { type: "h", text: "How coarse should the lock be?" },
      {
        type: "p",
        text: "One `synchronized` on the whole inventory means only one outlet can be *taking ingredients* at a time. Candidates worry this is too coarse and reach for a lock per tank. That is the wrong instinct here, and knowing why is worth a point.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 250" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two locking strategies. One lock on the whole inventory is simple, cannot deadlock, and only serialises a microsecond of arithmetic while brewing stays parallel. A lock per ingredient allows more parallelism but risks deadlock when one outlet locks milk then water while another locks water then milk, and it requires a fixed lock ordering.">
  <text x="20" y="24" font-size="10.5" fill="#5cc66f">✓ ONE LOCK ON THE INVENTORY</text>
  <rect x="20" y="34" width="316" height="112" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="58" font-size="10" fill="#5cc66f">✓ four lines, impossible to deadlock</text>
  <text x="38" y="80" font-size="10" fill="#5cc66f">✓ only the arithmetic is serialised</text>
  <text x="38" y="102" font-size="10" fill="#5cc66f">✓ the 30-second brew stays parallel</text>
  <text x="38" y="128" font-size="9.5" fill="#9099a8">contention window: microseconds</text>

  <text x="364" y="24" font-size="10.5" fill="#f06868">✗ A LOCK PER TANK</text>
  <rect x="364" y="34" width="316" height="112" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="382" y="58" font-size="10" fill="#f06868">outlet 1: lock milk → lock water</text>
  <text x="382" y="80" font-size="10" fill="#f06868">outlet 2: lock water → lock milk</text>
  <text x="382" y="102" font-size="10" fill="#f06868">→ deadlock, unless you fix an order</text>
  <text x="382" y="128" font-size="9.5" fill="#9099a8">more machinery, no measurable gain</text>

  <line x1="20" y1="168" x2="680" y2="168" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="194" font-size="10" fill="#9099a8">what is actually slow is the BREW — and that happens outside the lock:</text>
  <rect x="20" y="204" width="180" height="30" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="34" y="223" font-size="9.5" fill="#5cc66f">lock · take ingredients</text>
  <text x="208" y="223" font-size="10" fill="#6b7280">→</text>
  <rect x="228" y="204" width="452" height="30" rx="6" fill="#14161a" stroke="#2d333d"/><text x="242" y="223" font-size="9.5" fill="#e8e4dc">unlock · brew for 30 seconds — all three outlets, at once</text>
</svg>`,
        caption:
          "**Hold the lock only around the ingredient arithmetic, never around the brewing.** That is the sentence that answers *“isn't one lock a bottleneck?”* — and it is true of nearly every shared-resource design. More on the failure modes in [[deadlock-race-starvation]].",
      },

      // ---------- class diagram ----------
      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 340" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. CoffeeMachine composes one Inventory and one or more Outlets, and holds a RecipeBook. Every Outlet references the same single Inventory. Inventory holds ingredient levels and a synchronized consume method. RecipeBook maps names to Recipes, and Recipe holds a map of Ingredient to quantity.">
  <defs>
    <marker id="cm-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="256" y="14" width="208" height="76" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="268" y="34" font-size="11.5" fill="#fb863a">CoffeeMachine</text>
  <line x1="256" y1="42" x2="464" y2="42" stroke="#2d333d"/>
  <text x="268" y="60" font-size="10" fill="#e8e4dc">+ order(outlet, drink)</text>
  <text x="268" y="78" font-size="10" fill="#e8e4dc">+ refill(ingredient, qty)</text>

  <!-- outlets -->
  <path d="M296,90 L296,104 L288,112 L296,120 L304,112 L296,104" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="296" y1="120" x2="296" y2="146" stroke="#d8d3c9" stroke-width="1.3"/>
  <text x="240" y="138" font-size="9.5" fill="#9099a8">1..*</text>
  <rect x="206" y="146" width="180" height="62" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="218" y="166" font-size="11.5" fill="#e8e4dc">Outlet</text>
  <line x1="206" y1="174" x2="386" y2="174" stroke="#2d333d"/>
  <text x="218" y="192" font-size="10" fill="#e8e4dc">+ brew(recipe)</text>

  <!-- inventory: shared -->
  <line x1="296" y1="208" x2="296" y2="238" stroke="#5cc66f" stroke-width="1.4" marker-end="url(#cm-a)"/>
  <text x="304" y="228" font-size="9.5" fill="#5cc66f">ALL outlets → the SAME one</text>
  <rect x="176" y="238" width="240" height="88" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.3"/>
  <text x="188" y="258" font-size="11.5" fill="#5cc66f">Inventory</text>
  <text x="290" y="258" font-size="9" fill="#6b7280">«shared resource»</text>
  <line x1="176" y1="266" x2="416" y2="266" stroke="#2d333d"/>
  <text x="188" y="284" font-size="10" fill="#9099a8">- levels : Map&lt;Ingredient,int&gt;</text>
  <text x="188" y="302" font-size="10" fill="#fb863a">+ synchronized consume(recipe)</text>
  <text x="188" y="318" font-size="9.5" fill="#6b7280">check ALL, then take ALL</text>

  <!-- recipe book -->
  <line x1="424" y1="52" x2="500" y2="52" stroke="#9099a8" stroke-width="1.2" marker-end="url(#cm-a)"/>
  <rect x="506" y="30" width="190" height="62" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="518" y="50" font-size="11.5" fill="#e8e4dc">RecipeBook</text>
  <line x1="506" y1="58" x2="696" y2="58" stroke="#2d333d"/>
  <text x="518" y="76" font-size="10" fill="#9099a8">- byName : Map</text>

  <line x1="600" y1="92" x2="600" y2="122" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#cm-a)"/>
  <rect x="506" y="126" width="190" height="76" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="518" y="146" font-size="11.5" fill="#e8e4dc">Recipe</text>
  <line x1="506" y1="154" x2="696" y2="154" stroke="#2d333d"/>
  <text x="518" y="172" font-size="10" fill="#9099a8">- name : String</text>
  <text x="518" y="190" font-size="10" fill="#fb863a">- needs : Map&lt;Ingredient,int&gt;</text>

  <rect x="506" y="220" width="190" height="52" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="518" y="240" font-size="11" fill="#e8e4dc">Ingredient  «enum»</text>
  <text x="518" y="258" font-size="9.5" fill="#9099a8">WATER · MILK · BEANS · SUGAR</text>
  <line x1="600" y1="220" x2="600" y2="206" stroke="#9099a8" stroke-width="1.2" marker-end="url(#cm-a)"/>

  <text x="20" y="200" font-size="9.5" fill="#5cc66f">one Inventory,</text>
  <text x="20" y="216" font-size="9.5" fill="#5cc66f">many Outlets —</text>
  <text x="20" y="232" font-size="9.5" fill="#5cc66f">that arrow is the</text>
  <text x="20" y="248" font-size="9.5" fill="#5cc66f">whole problem</text>
</svg>`,
        caption:
          "Compare with [[vending-machine]]: there, each slot owned its own stock, so slots never interfered. Here **many outlets point at one inventory**, and every hard question follows from that single arrow. Notation: [[class-diagrams]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 280" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram. A customer orders a latte at an outlet. The outlet asks the RecipeBook for the latte recipe, then calls consume on the Inventory, which locks, checks all ingredients, takes them all and unlocks. The outlet then brews outside the lock and returns the drink.">
  <defs>
    <marker id="cm-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="cm-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="34" y="32" font-size="10.5" fill="#e8e4dc">Customer</text>
  <rect x="176" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="204" y="32" font-size="10.5" fill="#fb863a">Outlet #2</text>
  <rect x="336" y="12" width="112" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="350" y="32" font-size="10.5" fill="#e8e4dc">RecipeBook</text>
  <rect x="514" y="12" width="130" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="530" y="32" font-size="10.5" fill="#5cc66f">Inventory</text>

  <line x1="66" y1="42" x2="66" y2="262" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="228" y1="42" x2="228" y2="262" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="392" y1="42" x2="392" y2="262" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="579" y1="42" x2="579" y2="262" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="74" y="68" font-size="10" fill="#e8e4dc">order(“latte”)</text>
  <line x1="66" y1="76" x2="224" y2="76" stroke="#fb863a" stroke-width="1.3" marker-end="url(#cm-call)"/>

  <text x="236" y="102" font-size="10" fill="#e8e4dc">find(“latte”)</text>
  <line x1="228" y1="110" x2="388" y2="110" stroke="#fb863a" stroke-width="1.3" marker-end="url(#cm-call)"/>
  <text x="248" y="134" font-size="10" fill="#9099a8">{water 60, milk 80, beans 20}</text>
  <line x1="392" y1="142" x2="232" y2="142" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#cm-ret)"/>

  <text x="236" y="168" font-size="10" fill="#e8e4dc">consume(recipe)</text>
  <line x1="228" y1="176" x2="575" y2="176" stroke="#fb863a" stroke-width="1.3" marker-end="url(#cm-call)"/>
  <rect x="570" y="182" width="140" height="46" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="580" y="199" font-size="9" fill="#5cc66f">🔒 check ALL</text>
  <text x="580" y="215" font-size="9" fill="#5cc66f">then take ALL</text>

  <line x1="579" y1="240" x2="232" y2="240" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#cm-ret)"/>
  <text x="300" y="234" font-size="10" fill="#5cc66f">ok — lock released</text>

  <text x="74" y="256" font-size="10" fill="#5cc66f">🥛 (brewed outside the lock)</text>
  <line x1="228" y1="264" x2="70" y2="264" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#cm-ret)"/>
</svg>`,
        caption:
          "The lock lives entirely inside `consume()` — a few microseconds of arithmetic. The slow part, the actual brewing, happens after it is released. Notation: [[sequence-diagrams]].",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“Warn when an ingredient is running low.”** → the inventory publishes a `LowIngredient` event after each consume; a display subscribes. [[observer]], and it keeps monitoring out of the brew path.",
          "**“Queue orders instead of refusing when busy.”** → outlets become consumers pulling from a shared order queue. That is [[producer-consumer]], and it is the natural next step up.",
          "**“Add a new drink without redeploying.”** → already free, because recipes are data. Load the recipe book from a file and say so.",
          "**“Two sizes — small and large.”** → scale the recipe quantities by a factor rather than adding `LargeLatte` rows. A small function, not new data.",
          "**“Refilling while people are brewing.”** → `refill()` must take the same lock as `consume()`. Easy to forget, and a good thing to mention unprompted.",
          "**“Make it a real espresso bar with 20 outlets.”** → the lock is still fine, because it only guards arithmetic. If you ever did need more, the move is per-ingredient atomics with a fixed acquisition order — mention it, do not build it.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**No lock at all.** The machine serves drinks it cannot make, and the interviewer will ask *“what happens if two outlets order at once?”* — every time.",
          "**A class per beverage.** Three classes with the same shape and different numbers, and a factory to edit for each new drink.",
          "**Deducting as you check.** A failed latte leaves the water and beans already spent.",
          "**Holding the lock while brewing.** Now a 30-second brew blocks every other outlet, and you have turned three outlets into one.",
          "**A vague error.** *“Cannot make latte”* tells the person refilling the machine nothing. Name the ingredient.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Serve three different drinks first",
        body:
          "Leave the default picks (☕ Espresso, 🥛 Latte, 🍵 Tea) and press **▶ Serve all**. All three succeed and every tank drops by the sum of the three recipes. Nothing dramatic — but notice that *one* order changed what the other two had available.",
      },
      {
        title: "Create the race",
        body:
          "Press **☕ All three want Latte**. Each latte needs 80ml of milk; the tank holds 200. Now press **▶ Serve all** in **⚠️ Unguarded** mode and read the beats: *every outlet checked — and every one said yes*, then all three pour. Final milk level: **−40ml**. The over-served counter ticks to 1.",
      },
      {
        title: "Run the identical order with a lock",
        body:
          "Press **🚰 Refill tanks**, switch to **🔒 Guarded**, press **☕ All three want Latte** again, and serve. Now the outlets go one at a time. The third one is refused — *not enough milk* — because it sees what the first two actually took. **2 served, 1 refused, milk at 40.** Same order, same recipes, one lock apart.",
      },
      {
        title: "Read the error message",
        body:
          "In the refused outlet, the message names the ingredient — *“refused: milk”*, not *“cannot make latte”*. That distinction is what makes the difference between an error a technician can act on and one they cannot.",
      },
      {
        title: "Add a drink in your head",
        body:
          "Look at the recipe list on the right: three rows of `name → ingredients`. Adding a cappuccino is a fourth row. Now imagine the version with `class Latte` and `class Espresso` — where would cappuccino go, and how many files would you touch?",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `Ingredient` enum → `Recipe` as a map → `Inventory` with a **synchronized** `consume()` that checks all then takes all → `Outlet` holding a reference to the *same* inventory → `main()` that starts three threads ordering lattes and prints the tank levels at the end. Run it. If milk ever goes negative, your `consume()` is not atomic.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "CoffeeMachine.java",
        code: `import java.util.*;
import java.util.concurrent.*;

enum Ingredient { WATER, MILK, BEANS, SUGAR }

/** A recipe is DATA — adding a drink is a new entry, not a new class. */
record Recipe(String name, Map<Ingredient, Integer> needs) {
    Recipe {
        needs = Map.copyOf(needs);
        if (needs.isEmpty()) throw new IllegalArgumentException("a recipe needs ingredients");
    }
    /** Small / large without new recipes. */
    Recipe scaled(String newName, double factor) {
        Map<Ingredient, Integer> out = new EnumMap<>(Ingredient.class);
        needs.forEach((k, v) -> out.put(k, (int) Math.ceil(v * factor)));
        return new Recipe(newName, out);
    }
}

class RecipeBook {
    private final Map<String, Recipe> byName = new LinkedHashMap<>();
    void add(Recipe r) { byName.put(r.name(), r); }
    Recipe find(String name) {
        Recipe r = byName.get(name);
        if (r == null) throw new IllegalArgumentException("unknown drink: " + name);
        return r;
    }
    static RecipeBook standard() {
        RecipeBook book = new RecipeBook();
        book.add(new Recipe("espresso", Map.of(Ingredient.WATER, 50, Ingredient.BEANS, 20)));
        book.add(new Recipe("latte",    Map.of(Ingredient.WATER, 60, Ingredient.MILK, 80, Ingredient.BEANS, 20)));
        book.add(new Recipe("tea",      Map.of(Ingredient.WATER, 120, Ingredient.MILK, 30, Ingredient.SUGAR, 20)));
        return book;
    }
}

class NotEnoughIngredientException extends RuntimeException {
    final Ingredient ingredient;
    NotEnoughIngredientException(Ingredient i) {
        super("not enough " + i);          // names WHICH one — actionable for whoever refills
        this.ingredient = i;
    }
}

/** THE shared resource. Every outlet points at the same instance. */
class Inventory {
    private final Map<Ingredient, Integer> levels = new EnumMap<>(Ingredient.class);
    private final Map<Ingredient, Integer> capacity = new EnumMap<>(Ingredient.class);
    private final List<Runnable> lowStockListeners = new CopyOnWriteArrayList<>();

    Inventory(Map<Ingredient, Integer> initial) {
        levels.putAll(initial);
        capacity.putAll(initial);
    }

    /**
     * Check EVERY ingredient, then take EVERY ingredient — with nothing in between.
     * Two loops, so a failure leaves the tanks completely untouched.
     */
    synchronized void consume(Recipe recipe) {
        for (var e : recipe.needs().entrySet())                       // pass 1: check all
            if (levels.getOrDefault(e.getKey(), 0) < e.getValue())
                throw new NotEnoughIngredientException(e.getKey());

        for (var e : recipe.needs().entrySet())                       // pass 2: take all
            levels.merge(e.getKey(), -e.getValue(), Integer::sum);

        checkLowStock();
    }

    /** Refilling must take the SAME lock — easy to forget. */
    synchronized void refill(Ingredient ingredient, int quantity) {
        levels.merge(ingredient, quantity, Integer::sum);
        capacity.merge(ingredient, 0, (a, b) -> Math.max(a, levels.get(ingredient)));
    }

    synchronized Map<Ingredient, Integer> snapshot() { return new EnumMap<>(levels); }

    void onLowStock(Runnable listener) { lowStockListeners.add(listener); }

    private void checkLowStock() {
        levels.forEach((ing, level) -> {
            if (level < capacity.get(ing) * 0.2) lowStockListeners.forEach(Runnable::run);
        });
    }
}

class Outlet {
    private final int id;
    private final Inventory inventory;      // shared — NOT a copy
    private final RecipeBook recipes;

    Outlet(int id, Inventory inventory, RecipeBook recipes) {
        this.id = id; this.inventory = inventory; this.recipes = recipes;
    }

    String brew(String drink) {
        Recipe recipe = recipes.find(drink);
        inventory.consume(recipe);          // <- the only synchronized part: microseconds
        pour(recipe);                       // <- the slow part, OUTSIDE the lock
        return "outlet " + id + " served " + recipe.name();
    }

    private void pour(Recipe recipe) {
        try { Thread.sleep(30); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}

class CoffeeMachine {
    private final Inventory inventory;
    private final List<Outlet> outlets = new ArrayList<>();
    private final RecipeBook recipes;

    CoffeeMachine(int outletCount, Map<Ingredient, Integer> initial, RecipeBook recipes) {
        this.inventory = new Inventory(initial);
        this.recipes = recipes;
        for (int i = 1; i <= outletCount; i++) outlets.add(new Outlet(i, inventory, recipes));
    }

    Outlet outlet(int i)   { return outlets.get(i - 1); }
    Inventory inventory()  { return inventory; }
}

public class Main {
    public static void main(String[] args) throws Exception {
        Map<Ingredient, Integer> initial = new EnumMap<>(Ingredient.class);
        initial.put(Ingredient.WATER, 500);
        initial.put(Ingredient.MILK, 200);      // only enough milk for TWO lattes
        initial.put(Ingredient.BEANS, 100);
        initial.put(Ingredient.SUGAR, 60);

        CoffeeMachine machine = new CoffeeMachine(3, initial, RecipeBook.standard());
        machine.inventory().onLowStock(() -> { /* a display would light up here */ });

        System.out.println("before: " + machine.inventory().snapshot());

        // three outlets, three lattes, at the same time — 240ml of milk wanted, 200 available
        ExecutorService pool = Executors.newFixedThreadPool(3);
        List<Future<String>> results = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            final int id = i;
            results.add(pool.submit(() -> machine.outlet(id).brew("latte")));
        }

        for (Future<String> f : results) {
            try { System.out.println("  " + f.get()); }
            catch (ExecutionException e) { System.out.println("  refused: " + e.getCause().getMessage()); }
        }
        pool.shutdown();

        System.out.println("after:  " + machine.inventory().snapshot());
        System.out.println("milk never went below zero because consume() is atomic");
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "coffee_machine.py",
        code: `from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from enum import Enum
from math import ceil
from threading import Lock
from typing import Callable


class Ingredient(Enum):
    WATER = "WATER"; MILK = "MILK"; BEANS = "BEANS"; SUGAR = "SUGAR"


@dataclass(frozen=True)
class Recipe:
    """A recipe is DATA — adding a drink is a new entry, not a new class."""
    name: str
    needs: tuple[tuple[Ingredient, int], ...]

    @staticmethod
    def of(name: str, **kwargs: int) -> "Recipe":
        return Recipe(name, tuple((Ingredient[k.upper()], v) for k, v in kwargs.items()))

    def scaled(self, new_name: str, factor: float) -> "Recipe":
        """Small / large without new recipes."""
        return Recipe(new_name, tuple((k, ceil(v * factor)) for k, v in self.needs))


class RecipeBook:
    def __init__(self):
        self._by_name: dict[str, Recipe] = {}

    def add(self, recipe: Recipe) -> None:
        self._by_name[recipe.name] = recipe

    def find(self, name: str) -> Recipe:
        if name not in self._by_name:
            raise ValueError(f"unknown drink: {name}")
        return self._by_name[name]

    @staticmethod
    def standard() -> "RecipeBook":
        book = RecipeBook()
        book.add(Recipe.of("espresso", water=50, beans=20))
        book.add(Recipe.of("latte", water=60, milk=80, beans=20))
        book.add(Recipe.of("tea", water=120, milk=30, sugar=20))
        return book


class NotEnoughIngredient(Exception):
    def __init__(self, ingredient: Ingredient):
        super().__init__(f"not enough {ingredient.value}")   # names WHICH one
        self.ingredient = ingredient


class Inventory:
    """THE shared resource. Every outlet points at the same instance."""

    def __init__(self, initial: dict[Ingredient, int]):
        self._levels = dict(initial)
        self._capacity = dict(initial)
        self._lock = Lock()
        self._low_stock_listeners: list[Callable[[Ingredient], None]] = []

    def consume(self, recipe: Recipe) -> None:
        """Check EVERY ingredient, then take EVERY ingredient — nothing in between."""
        with self._lock:
            for ingredient, qty in recipe.needs:            # pass 1: check all
                if self._levels.get(ingredient, 0) < qty:
                    raise NotEnoughIngredient(ingredient)

            for ingredient, qty in recipe.needs:            # pass 2: take all
                self._levels[ingredient] -= qty

            self._check_low_stock()

    def refill(self, ingredient: Ingredient, quantity: int) -> None:
        """Refilling must take the SAME lock — easy to forget."""
        with self._lock:
            self._levels[ingredient] = self._levels.get(ingredient, 0) + quantity
            self._capacity[ingredient] = max(self._capacity.get(ingredient, 0), self._levels[ingredient])

    def snapshot(self) -> dict[str, int]:
        with self._lock:
            return {i.value: v for i, v in self._levels.items()}

    def on_low_stock(self, listener: Callable[[Ingredient], None]) -> None:
        self._low_stock_listeners.append(listener)

    def _check_low_stock(self) -> None:
        for ingredient, level in self._levels.items():
            if level < self._capacity[ingredient] * 0.2:
                for listener in self._low_stock_listeners:
                    listener(ingredient)


class Outlet:
    def __init__(self, id_: int, inventory: Inventory, recipes: RecipeBook):
        self.id = id_
        self._inventory = inventory        # shared — NOT a copy
        self._recipes = recipes

    def brew(self, drink: str) -> str:
        recipe = self._recipes.find(drink)
        self._inventory.consume(recipe)    # <- the only locked part: microseconds
        self._pour(recipe)                 # <- the slow part, OUTSIDE the lock
        return f"outlet {self.id} served {recipe.name}"

    @staticmethod
    def _pour(recipe: Recipe) -> None:
        import time
        time.sleep(0.03)


class CoffeeMachine:
    def __init__(self, outlet_count: int, initial: dict[Ingredient, int], recipes: RecipeBook):
        self.inventory = Inventory(initial)
        self._recipes = recipes
        self.outlets = [Outlet(i, self.inventory, recipes) for i in range(1, outlet_count + 1)]

    def outlet(self, i: int) -> Outlet:
        return self.outlets[i - 1]


if __name__ == "__main__":
    initial = {
        Ingredient.WATER: 500,
        Ingredient.MILK: 200,          # only enough milk for TWO lattes
        Ingredient.BEANS: 100,
        Ingredient.SUGAR: 60,
    }
    machine = CoffeeMachine(3, initial, RecipeBook.standard())
    print("before:", machine.inventory.snapshot())

    # three outlets, three lattes, at the same time — 240ml of milk wanted, 200 available
    def order(i: int) -> str:
        try:
            return machine.outlet(i).brew("latte")
        except NotEnoughIngredient as e:
            return f"outlet {i} refused: {e}"

    with ThreadPoolExecutor(max_workers=3) as pool:
        for line in pool.map(order, [1, 2, 3]):
            print(" ", line)

    print("after: ", machine.inventory.snapshot())
    print("milk never went below zero because consume() is atomic")`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "coffee_machine.cpp",
        code: `#include <cmath>
#include <future>
#include <iostream>
#include <map>
#include <mutex>
#include <stdexcept>
#include <string>
#include <thread>
#include <vector>

enum class Ingredient { Water, Milk, Beans, Sugar };
static const char* name(Ingredient i) {
    switch (i) {
        case Ingredient::Water: return "WATER";
        case Ingredient::Milk:  return "MILK";
        case Ingredient::Beans: return "BEANS";
        default:                return "SUGAR";
    }
}

// A recipe is DATA — adding a drink is a new entry, not a new class.
struct Recipe {
    std::string name;
    std::map<Ingredient, int> needs;

    // Small / large without new recipes.
    Recipe scaled(const std::string& newName, double factor) const {
        std::map<Ingredient, int> out;
        for (auto& [k, v] : needs) out[k] = static_cast<int>(std::ceil(v * factor));
        return {newName, out};
    }
};

class RecipeBook {
public:
    void add(const Recipe& r) { byName_[r.name] = r; }
    const Recipe& find(const std::string& n) const {
        auto it = byName_.find(n);
        if (it == byName_.end()) throw std::invalid_argument("unknown drink: " + n);
        return it->second;
    }
    static RecipeBook standard() {
        RecipeBook b;
        b.add({"espresso", {{Ingredient::Water, 50}, {Ingredient::Beans, 20}}});
        b.add({"latte",    {{Ingredient::Water, 60}, {Ingredient::Milk, 80}, {Ingredient::Beans, 20}}});
        b.add({"tea",      {{Ingredient::Water, 120}, {Ingredient::Milk, 30}, {Ingredient::Sugar, 20}}});
        return b;
    }
private:
    std::map<std::string, Recipe> byName_;
};

struct NotEnoughIngredient : std::runtime_error {
    Ingredient ingredient;
    explicit NotEnoughIngredient(Ingredient i)
        : std::runtime_error(std::string("not enough ") + name(i)), ingredient(i) {}   // names WHICH one
};

// THE shared resource. Every outlet points at the same instance.
class Inventory {
public:
    explicit Inventory(std::map<Ingredient, int> initial)
        : levels_(initial), capacity_(std::move(initial)) {}

    // Check EVERY ingredient, then take EVERY ingredient — nothing in between.
    void consume(const Recipe& recipe) {
        std::lock_guard<std::mutex> guard(m_);
        for (auto& [ing, qty] : recipe.needs)              // pass 1: check all
            if (levels_[ing] < qty) throw NotEnoughIngredient(ing);

        for (auto& [ing, qty] : recipe.needs)              // pass 2: take all
            levels_[ing] -= qty;
    }

    // Refilling must take the SAME lock — easy to forget.
    void refill(Ingredient ingredient, int quantity) {
        std::lock_guard<std::mutex> guard(m_);
        levels_[ingredient] += quantity;
        capacity_[ingredient] = std::max(capacity_[ingredient], levels_[ingredient]);
    }

    std::map<Ingredient, int> snapshot() {
        std::lock_guard<std::mutex> guard(m_);
        return levels_;
    }

private:
    std::map<Ingredient, int> levels_, capacity_;
    std::mutex m_;
};

class Outlet {
public:
    Outlet(int id, Inventory& inventory, const RecipeBook& recipes)
        : id_(id), inventory_(inventory), recipes_(recipes) {}

    std::string brew(const std::string& drink) {
        const Recipe& recipe = recipes_.find(drink);
        inventory_.consume(recipe);                        // <- the only locked part: microseconds
        pour();                                            // <- the slow part, OUTSIDE the lock
        return "outlet " + std::to_string(id_) + " served " + recipe.name;
    }

private:
    static void pour() { std::this_thread::sleep_for(std::chrono::milliseconds(30)); }
    int id_;
    Inventory& inventory_;                                 // shared — NOT a copy
    const RecipeBook& recipes_;
};

class CoffeeMachine {
public:
    CoffeeMachine(int outletCount, std::map<Ingredient, int> initial, RecipeBook recipes)
        : inventory_(std::move(initial)), recipes_(std::move(recipes)) {
        for (int i = 1; i <= outletCount; ++i) outlets_.emplace_back(i, inventory_, recipes_);
    }
    Outlet& outlet(int i) { return outlets_[i - 1]; }
    Inventory& inventory() { return inventory_; }

private:
    Inventory inventory_;
    RecipeBook recipes_;
    std::vector<Outlet> outlets_;
};

int main() {
    CoffeeMachine machine(3,
        {{Ingredient::Water, 500}, {Ingredient::Milk, 200},     // only enough milk for TWO lattes
         {Ingredient::Beans, 100}, {Ingredient::Sugar, 60}},
        RecipeBook::standard());

    auto show = [&](const char* label) {
        std::cout << label;
        for (auto& [ing, v] : machine.inventory().snapshot()) std::cout << " " << name(ing) << "=" << v;
        std::cout << "\\n";
    };
    show("before:");

    // three outlets, three lattes, at the same time — 240ml of milk wanted, 200 available
    std::vector<std::future<std::string>> results;
    for (int i = 1; i <= 3; ++i)
        results.push_back(std::async(std::launch::async, [&machine, i] {
            try { return machine.outlet(i).brew("latte"); }
            catch (const NotEnoughIngredient& e) {
                return "outlet " + std::to_string(i) + " refused: " + e.what();
            }
        }));

    for (auto& f : results) std::cout << "  " << f.get() << "\\n";

    show("after: ");
    std::cout << "milk never went below zero because consume() is atomic\\n";
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "coffee_machine.go",
        code: `package main

import (
	"fmt"
	"math"
	"sync"
	"time"
)

type Ingredient string

const (
	Water Ingredient = "WATER"
	Milk  Ingredient = "MILK"
	Beans Ingredient = "BEANS"
	Sugar Ingredient = "SUGAR"
)

// Recipe is DATA — adding a drink is a new entry, not a new type.
type Recipe struct {
	Name  string
	Needs map[Ingredient]int
}

// Scaled gives small / large without new recipes.
func (r Recipe) Scaled(newName string, factor float64) Recipe {
	out := make(map[Ingredient]int, len(r.Needs))
	for k, v := range r.Needs {
		out[k] = int(math.Ceil(float64(v) * factor))
	}
	return Recipe{Name: newName, Needs: out}
}

type RecipeBook struct{ byName map[string]Recipe }

func StandardRecipes() *RecipeBook {
	return &RecipeBook{byName: map[string]Recipe{
		"espresso": {"espresso", map[Ingredient]int{Water: 50, Beans: 20}},
		"latte":    {"latte", map[Ingredient]int{Water: 60, Milk: 80, Beans: 20}},
		"tea":      {"tea", map[Ingredient]int{Water: 120, Milk: 30, Sugar: 20}},
	}}
}

func (b *RecipeBook) Find(name string) (Recipe, error) {
	r, ok := b.byName[name]
	if !ok {
		return Recipe{}, fmt.Errorf("unknown drink: %s", name)
	}
	return r, nil
}

type NotEnoughIngredientError struct{ Ingredient Ingredient }

func (e *NotEnoughIngredientError) Error() string {
	return "not enough " + string(e.Ingredient) // names WHICH one
}

// Inventory is THE shared resource. Every outlet points at the same instance.
type Inventory struct {
	mu       sync.Mutex
	levels   map[Ingredient]int
	capacity map[Ingredient]int
}

func NewInventory(initial map[Ingredient]int) *Inventory {
	levels := make(map[Ingredient]int, len(initial))
	capacity := make(map[Ingredient]int, len(initial))
	for k, v := range initial {
		levels[k], capacity[k] = v, v
	}
	return &Inventory{levels: levels, capacity: capacity}
}

// Consume checks EVERY ingredient, then takes EVERY ingredient — nothing in between.
func (inv *Inventory) Consume(r Recipe) error {
	inv.mu.Lock()
	defer inv.mu.Unlock()

	for ing, qty := range r.Needs { // pass 1: check all
		if inv.levels[ing] < qty {
			return &NotEnoughIngredientError{Ingredient: ing}
		}
	}
	for ing, qty := range r.Needs { // pass 2: take all
		inv.levels[ing] -= qty
	}
	return nil
}

// Refill must take the SAME lock — easy to forget.
func (inv *Inventory) Refill(ing Ingredient, qty int) {
	inv.mu.Lock()
	defer inv.mu.Unlock()
	inv.levels[ing] += qty
	if inv.levels[ing] > inv.capacity[ing] {
		inv.capacity[ing] = inv.levels[ing]
	}
}

func (inv *Inventory) Snapshot() map[Ingredient]int {
	inv.mu.Lock()
	defer inv.mu.Unlock()
	out := make(map[Ingredient]int, len(inv.levels))
	for k, v := range inv.levels {
		out[k] = v
	}
	return out
}

type Outlet struct {
	ID        int
	inventory *Inventory // shared — NOT a copy
	recipes   *RecipeBook
}

func (o *Outlet) Brew(drink string) (string, error) {
	recipe, err := o.recipes.Find(drink)
	if err != nil {
		return "", err
	}
	if err := o.inventory.Consume(recipe); err != nil { // the only locked part: microseconds
		return "", err
	}
	time.Sleep(30 * time.Millisecond) // the slow part, OUTSIDE the lock
	return fmt.Sprintf("outlet %d served %s", o.ID, recipe.Name), nil
}

type CoffeeMachine struct {
	Inventory *Inventory
	Outlets   []*Outlet
}

func NewCoffeeMachine(outletCount int, initial map[Ingredient]int, recipes *RecipeBook) *CoffeeMachine {
	inv := NewInventory(initial)
	outlets := make([]*Outlet, 0, outletCount)
	for i := 1; i <= outletCount; i++ {
		outlets = append(outlets, &Outlet{ID: i, inventory: inv, recipes: recipes})
	}
	return &CoffeeMachine{Inventory: inv, Outlets: outlets}
}

func main() {
	machine := NewCoffeeMachine(3, map[Ingredient]int{
		Water: 500,
		Milk:  200, // only enough milk for TWO lattes
		Beans: 100,
		Sugar: 60,
	}, StandardRecipes())

	fmt.Println("before:", machine.Inventory.Snapshot())

	// three outlets, three lattes, at the same time — 240ml of milk wanted, 200 available
	var wg sync.WaitGroup
	results := make([]string, 3)
	for i, outlet := range machine.Outlets {
		wg.Add(1)
		go func(i int, o *Outlet) {
			defer wg.Done()
			msg, err := o.Brew("latte")
			if err != nil {
				results[i] = fmt.Sprintf("outlet %d refused: %v", o.ID, err)
				return
			}
			results[i] = msg
		}(i, outlet)
	}
	wg.Wait()

	for _, r := range results {
		fmt.Println("  " + r)
	}
	fmt.Println("after: ", machine.Inventory.Snapshot())
	fmt.Println("milk never went below zero because Consume is atomic")
}`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Strip the coffee away and this is **N workers drawing from one pool of limited resources**. That shape shows up constantly, and the fix is always the same: make check-and-take one indivisible operation, and hold the lock for as short a time as you possibly can.",
      },
      {
        type: "ul",
        items: [
          "**Seat booking** — many users, one seat map. BookMyShow is this problem with a bigger pool and money attached.",
          "**Connection pools** — many threads, a fixed set of connections. Check out, use, return. See [[object-pool]].",
          "**Rate limiters** — many requests, one token bucket. Take a token or be refused.",
          "**Warehouse stock** — many orders, one count per SKU, and a partial reservation is exactly the multi-ingredient problem.",
          "**Any budget or quota** — the arithmetic is trivial, and it is wrong the moment two callers do it at once.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The two-sentence version to say out loud",
        text: "*“Check and take have to be one atomic step, or two callers both pass the check. And since a recipe touches several ingredients, the check must cover all of them before any of them is deducted — otherwise a failure leaves the machine short with nothing made.”* That is the whole design, and it is 20 seconds.",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When the machine is distributed.** Several machines drawing from one central stock cannot use an in-process lock — you need the store itself to do the atomic decrement, or optimistic concurrency with a version check.",
          "**When customers should queue rather than be refused.** Refusing is correct for a machine with a physical panel; a coffee *shop* would take the order and wait for milk. That is [[producer-consumer]] and it is a different design.",
          "**When brewing can fail halfway.** The ingredients are already spent, and unlike the [[atm]] you cannot un-pour milk. Real machines just log it — worth saying, because knowing which failures are compensable and which are not is the real skill.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Lock the arithmetic, not the work.** Take the ingredients inside a lock that lasts microseconds, then brew for thirty seconds outside it. That one sentence answers both *“is it correct?”* and *“is it a bottleneck?”*",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Recipes as data mean a new drink is one configuration row — no new class, no factory edit, no redeploy.",
        "A single synchronized consume() makes the machine correct under any number of concurrent outlets, in about four lines.",
        "Checking all ingredients before deducting any makes a failed brew all-or-nothing, so a refusal never leaves the tanks short.",
        "The lock covers only the arithmetic, so the slow brewing still happens fully in parallel across outlets.",
        "Errors name the specific missing ingredient, which is what makes the message useful to whoever refills the machine.",
      ],
      cons: [
        "One lock on the whole inventory serialises every order at that instant; it is the right call at this scale but it is genuinely a single point of contention.",
        "The in-process lock does not survive the design being split across machines — a shared store would need its own atomic decrement.",
        "Refusing rather than queueing is a deliberate choice that suits a physical panel and would be wrong for a coffee shop.",
        "A brew that fails after ingredients are consumed cannot be compensated the way an ATM debit can, so some loss is unavoidable and simply logged.",
        "Recipes as flat quantity maps cannot express steps or ordering — the moment a drink needs “steam the milk for 20 seconds”, the model has to grow.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "awesome-low-level-design — Vending / Coffee machine problems",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/vending-machine.md",
        kind: "article",
        note: "The closest sibling problem written up in full — useful for seeing exactly where the shared-inventory version diverges.",
      },
      {
        label: "Java synchronized — the Oracle tutorial",
        href: "https://docs.oracle.com/javase/tutorial/essential/concurrency/syncmeth.html",
        kind: "docs",
        note: "What synchronized actually guarantees: mutual exclusion and visibility. Both matter for consume().",
      },
      {
        label: "Check-then-act race conditions",
        href: "https://en.wikipedia.org/wiki/Time-of-check_to_time-of-use",
        kind: "article",
        note: "The formal name (TOCTOU) for the bug the prototype demonstrates. Worth being able to name in an interview.",
      },
      {
        label: "Java Concurrency in Practice — Goetz et al.",
        kind: "book",
        note: "Chapter 2 is exactly this: compound actions on shared state, and why check-then-act must be atomic.",
      },
      {
        label: "sync.Mutex — Go documentation",
        href: "https://pkg.go.dev/sync#Mutex",
        kind: "docs",
        note: "The Go sample's locking primitive, with the same “lock the smallest region that works” guidance.",
      },
      {
        label: "Prefer configuration over subclassing — Fowler on Value Object",
        href: "https://martinfowler.com/bliki/ValueObject.html",
        kind: "article",
        note: "Background for treating a Recipe as an immutable value rather than a class hierarchy of beverages.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "coffee-machine-q1",
        question: "Three outlets each order a latte needing 80ml of milk, from a tank holding 200ml. With no locking, what happens?",
        options: [
          { id: "a", label: "All three check, all three see 200ml, all three pour — and the tank ends at −40ml." },
          { id: "b", label: "Two succeed and the third is refused, because the tank cannot go below zero." },
          { id: "c", label: "All three block until milk is refilled." },
          { id: "d", label: "The first one wins and the other two crash immediately." },
        ],
        correctOptionId: "a",
        explanation:
          "The check and the subtraction are separate, so all three read the same stale value before any of them writes. Nothing in the code stops a negative tank — that is what the prototype shows in ⚠️ Unguarded mode.",
      },
      {
        id: "coffee-machine-q2",
        question: "Why should `consume()` check *all* ingredients before deducting *any* of them?",
        options: [
          { id: "a", label: "So a failure is all-or-nothing — deducting water and beans and then finding no milk would leave the machine short with no drink made." },
          { id: "b", label: "Because checking is faster than deducting." },
          { id: "c", label: "Because the ingredients must be deducted in alphabetical order." },
          { id: "d", label: "It makes no difference as long as the whole method is synchronized." },
        ],
        correctOptionId: "a",
        explanation:
          "The lock stops *other* callers interfering; it does nothing about a partial deduction inside your own method. (d) is the tempting wrong answer — atomicity against other threads and all-or-nothing within one call are two separate properties.",
      },
      {
        id: "coffee-machine-q3",
        question: "Should each beverage be its own class?",
        options: [
          { id: "a", label: "No — they differ only in quantities, so a recipe is data; a class is earned only when a drink needs different behaviour, like a steaming step." },
          { id: "b", label: "Yes — one class per drink is the cleanest object-oriented model." },
          { id: "c", label: "Yes — otherwise you cannot add new drinks." },
          { id: "d", label: "No — every drink should be a subclass of a shared Beverage base class instead." },
        ],
        correctOptionId: "a",
        explanation:
          "The test is whether the new thing *behaves* differently or just holds different numbers. Three classes with identical structure and different constants is duplication, and every new drink then costs a class plus a factory edit.",
      },
      {
        id: "coffee-machine-q4",
        question: "Should the lock be held while the drink is actually brewing?",
        options: [
          { id: "a", label: "No — take the ingredients under the lock, then release it and brew outside; otherwise a 30-second brew blocks every other outlet." },
          { id: "b", label: "Yes — otherwise another outlet could interrupt the brew." },
          { id: "c", label: "Yes — the lock protects the cup as well as the tanks." },
          { id: "d", label: "It does not matter, because brewing does not touch shared state." },
        ],
        correctOptionId: "a",
        explanation:
          "Once the ingredients are deducted they belong to that order — brewing touches nothing shared. Holding the lock through it would turn three outlets into one, which is the usual answer to “isn't a single lock a bottleneck?”",
      },
      {
        id: "coffee-machine-q5",
        question: "Why is a lock per ingredient usually the wrong choice here?",
        options: [
          { id: "a", label: "A recipe needs several ingredients, so two outlets acquiring them in different orders can deadlock — for no measurable gain, since the guarded section is only arithmetic." },
          { id: "b", label: "Because you cannot have more than one lock in a single class." },
          { id: "c", label: "Because ingredients are read far more often than they are written." },
          { id: "d", label: "It is the right choice; a single lock is always too coarse." },
        ],
        correctOptionId: "a",
        explanation:
          "Multi-ingredient recipes mean multi-lock acquisition, which needs a fixed global ordering to be deadlock-free. That is real complexity bought to speed up a few microseconds of subtraction — a bad trade at this scale.",
      },
      {
        id: "coffee-machine-q6",
        question: "The machine cannot make a latte. What should the error say?",
        options: [
          { id: "a", label: "Which ingredient is short — “not enough milk” — so whoever maintains the machine knows what to refill." },
          { id: "b", label: "“Cannot make latte”, since the specific cause is an implementation detail." },
          { id: "c", label: "“Machine unavailable”, to avoid revealing internal state." },
          { id: "d", label: "Nothing — it should silently pick a different drink." },
        ],
        correctOptionId: "a",
        explanation:
          "An error message exists so somebody can act on it. Naming the ingredient is one field on the exception and turns an unactionable failure into a refill instruction — the prototype prints exactly this on the refused outlet.",
      },
      {
        id: "coffee-machine-q7",
        question: "How does this problem differ structurally from a vending machine?",
        options: [
          { id: "a", label: "Vending machine slots each own their stock, so they never interfere; here every outlet draws from the same tanks, which is what creates the race." },
          { id: "b", label: "A coffee machine has no states, so no state machine is needed." },
          { id: "c", label: "A coffee machine does not need to handle payment." },
          { id: "d", label: "There is no structural difference — only the products differ." },
        ],
        correctOptionId: "a",
        explanation:
          "It is a sharing question, not a product question. Taking the last cola affects only that slot; taking 80ml of milk changes what every other outlet can make. That single arrow — many outlets, one inventory — is the whole problem.",
      },
      {
        id: "coffee-machine-q8",
        question: "The interviewer asks for a “low ingredient” warning on a display. What is the cleanest addition?",
        options: [
          { id: "a", label: "The inventory publishes an event after each consume, and the display subscribes — monitoring stays out of the brewing path." },
          { id: "b", label: "The brew method checks every level after pouring and prints a warning." },
          { id: "c", label: "A background thread polls the tanks every second." },
          { id: "d", label: "Each outlet keeps a copy of the levels and checks its own copy." },
        ],
        correctOptionId: "a",
        explanation:
          "Publishing an event keeps the display, the logger and anything else added later out of the brew path — the Observer pattern doing exactly what it is for. (d) is actively dangerous: a per-outlet copy of shared state reintroduces the very race the lock removed.",
      },
    ],
  },
};
