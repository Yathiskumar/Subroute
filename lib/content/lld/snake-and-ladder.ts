import type { RoadmapLesson } from "@/lib/content/types";

export const snakeAndLadder: RoadmapLesson = {
  title: "Snake & Ladder",
  oneLiner:
    "A board game with **no strategy at all** — which is exactly what makes it a design problem. There is nothing to be clever about, so the interviewer gets a clean look at how you model a turn loop, a jump table, and the thing candidates almost always get wrong: **randomness you can test**.",
  difficulty: "beginner",
  estimatedTime: "22 min",
  prototypePath: "/prototypes/lld/snake-and-ladder.html",
  content: {
    prototypeCaption:
      "A **real three-player game**. Press **🎲 Roll** and the token walks square by square — because the board is a *line*, not a grid — then a 🐍 or a 🪜 may move it again in a second beat. Every jump is the same one-line lookup; the explain panel shows it as `jumps[4] = 14`. Now the part that matters: switch the dice to **🎯 Loaded**, press **↺ New game**, and roll. Do it again. **The same game happens every time** — because the dice is an object you can swap, not a call to `Math.random()` buried inside the turn. Then flip **exact landing** off and watch a house rule change with no code change.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design snakes and ladders.”* There is no skill in this game. You roll, you move, you climb or you slide. A five-year-old plays it correctly. So what is there to design?",
      },
      {
        type: "p",
        text: "Exactly that. Because the rules are trivial, nothing hides behind them — the interviewer sees your **modelling** with no algorithm to distract from it. Three things get judged: how you represent the board, how you run the turn loop, and whether the randomness is something you can control in a test. Most candidates nail the first two and fail the third without noticing.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A snakes and ladders board drawn as a snaking grid from one to one hundred, with a ladder from four to fourteen and a snake from thirty-six down to six. Labels mark Board, Square, Jump, Token and Dice.">
  <defs>
    <marker id="snl-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <!-- grid -->
  <rect x="176" y="26" width="330" height="240" rx="8" fill="none" stroke="#3a414c" stroke-width="1.4"/>
  <text x="176" y="18" font-size="11" fill="#fb863a">Board  —  100 squares in ONE line</text>

  <!-- row 100..91 -->
  <rect x="188" y="38" width="306" height="40" rx="4" fill="#14161a" stroke="#2d333d"/>
  <text x="198" y="63" font-size="9" fill="#6b7280">100</text><text x="240" y="63" font-size="9" fill="#6b7280">99</text>
  <text x="278" y="63" font-size="9" fill="#6b7280">98</text><text x="316" y="63" font-size="9" fill="#6b7280">…</text>
  <text x="452" y="63" font-size="9" fill="#6b7280">91</text>
  <text x="204" y="52" font-size="14" fill="#fb863a">🏁</text>

  <rect x="188" y="86" width="306" height="40" rx="4" fill="#14161a" stroke="#2d333d"/>
  <text x="198" y="111" font-size="9" fill="#6b7280">81</text><text x="240" y="111" font-size="9" fill="#6b7280">82</text>
  <text x="316" y="111" font-size="9" fill="#6b7280">…</text><text x="452" y="111" font-size="9" fill="#6b7280">90</text>

  <rect x="188" y="134" width="306" height="40" rx="4" fill="#14161a" stroke="#2d333d"/>
  <text x="198" y="159" font-size="9" fill="#6b7280">40</text><text x="240" y="159" font-size="9" fill="#6b7280">39</text>
  <text x="316" y="159" font-size="9" fill="#6b7280">…</text>
  <rect x="272" y="140" width="34" height="28" rx="4" fill="rgba(240,104,104,0.16)" stroke="rgba(240,104,104,0.5)"/>
  <text x="278" y="159" font-size="9" fill="#f06868">36🐍</text>

  <rect x="188" y="182" width="306" height="40" rx="4" fill="#14161a" stroke="#2d333d"/>
  <text x="198" y="207" font-size="9" fill="#6b7280">21</text><text x="316" y="207" font-size="9" fill="#6b7280">…</text>
  <text x="452" y="207" font-size="9" fill="#6b7280">30</text>

  <rect x="188" y="230" width="306" height="28" rx="4" fill="#14161a" stroke="#2d333d"/>
  <text x="198" y="249" font-size="9" fill="#6b7280">1</text>
  <rect x="222" y="234" width="34" height="20" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/>
  <text x="226" y="249" font-size="9" fill="#5cc66f">4🪜</text>
  <text x="316" y="249" font-size="9" fill="#6b7280">…</text><text x="452" y="249" font-size="9" fill="#6b7280">10</text>
  <text x="196" y="244" font-size="11">🔴</text>

  <!-- labels -->
  <text x="34" y="66" font-size="11" fill="#fb863a">Square</text>
  <line x1="98" y1="62" x2="182" y2="58" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#snl-lead)"/>
  <text x="24" y="160" font-size="11" fill="#fb863a">Jump  36 → 6</text>
  <line x1="130" y1="156" x2="268" y2="156" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#snl-lead)"/>
  <text x="24" y="248" font-size="11" fill="#fb863a">Token</text>
  <line x1="80" y1="244" x2="188" y2="244" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#snl-lead)"/>

  <!-- dice -->
  <rect x="546" y="86" width="70" height="70" rx="12" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="570" y="132" font-size="26" fill="#fb863a">4</text>
  <text x="546" y="176" font-size="11" fill="#fb863a">Dice</text>
  <text x="546" y="196" font-size="9.5" fill="#9099a8">an interface,</text>
  <text x="546" y="212" font-size="9.5" fill="#9099a8">not Math.random()</text>
  <text x="546" y="234" font-size="9.5" fill="#5cc66f">← the whole point</text>
</svg>`,
        caption:
          "Five nouns, and the last one is the exam question. Everything else in this problem is a lookup and a loop.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "The board is an **integer from 1 to 100** — the grid is only how it is drawn. A **jump map** turns any landing square into a destination, and snakes and ladders are the *same* map. A **turn loop** takes the next player from a queue, asks the **dice** for a number, moves, and stops when someone reaches 100.",
      },
      { type: "h", text: "The three things being graded" },
      {
        type: "ol",
        items: [
          "**Is the board a line?** Modelling it as a 10×10 grid means converting coordinates on every move for no benefit. A player's position is one number.",
          "**Are snakes and ladders one thing?** They are both *“landing here sends you there”*. Two classes with identical fields and opposite comparisons is duplicate code with a costume on.",
          "**Can you test it?** If `Math.random()` is called inside `playTurn()`, you cannot write a single deterministic test of your own game. This is the one that separates candidates.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- clarify ----------
      { type: "h", text: "Step 1 · Clarify — 3 minutes" },
      {
        type: "ul",
        items: [
          "**How many players?** — build a queue and it does not matter. Two, three, six: same code.",
          "**Do you need an exact roll to land on 100?** — this is a real house rule and it splits opinion. Ask, then make it a **flag**, because they will ask you to change it.",
          "**Does a six give another turn?** — another common house rule. Same answer: a rule, not a rewrite.",
          "**Can two tokens share a square?** — usually yes. If they say *“no, you send the other player back to 1”*, that is a genuinely different game and worth 30 seconds of scoping.",
          "**Where do snakes and ladders come from?** — configuration. A board with hardcoded jumps cannot be tested or varied.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The question that is really a design decision",
        text: "*“Should the game print the board?”* If your `Game` class contains `System.out.println`, you cannot run it in a UI, a test, or a server. Keep the game silent and let the caller render — a two-second decision that keeps the whole design usable.",
      },

      // ---------- board is a line ----------
      { type: "h", text: "Step 2 · The board is a line" },
      {
        type: "p",
        text: "The physical board snakes back and forth — 1 to 10 left to right, then 11 to 20 right to left. That layout is a **rendering** detail. To the game, square 47 is just 47, and moving is `position + roll`.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 250" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The top half shows the board drawn as a grid with rows alternating direction, labelled rendering only. The bottom half shows the same board as a straight numbered line from one to one hundred, labelled what the game actually stores, with the note that moving is position plus roll.">
  <text x="20" y="24" font-size="10.5" fill="#9099a8">HOW IT IS DRAWN — a grid, rows alternating direction</text>
  <rect x="20" y="34" width="660" height="82" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="40" y="58" font-size="10" fill="#6b7280">21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 30</text>
  <text x="40" y="80" font-size="10" fill="#6b7280">20 ← 19 ← 18 ← 17 ← 16 ← 15 ← 14 ← 13 ← 12 ← 11</text>
  <text x="40" y="102" font-size="10" fill="#6b7280">1  →  2 →  3 →  4 →  5 →  6 →  7 →  8 →  9 → 10</text>
  <text x="440" y="80" font-size="10" fill="#f06868">rendering only — the game never</text>
  <text x="440" y="98" font-size="10" fill="#f06868">needs a row or a column</text>

  <text x="20" y="152" font-size="10.5" fill="#5cc66f">WHAT THE GAME STORES — one integer</text>
  <rect x="20" y="162" width="660" height="66" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <line x1="46" y1="196" x2="654" y2="196" stroke="#d8d3c9" stroke-width="1.4"/>
  <circle cx="46" cy="196" r="5" fill="#5cc66f"/><text x="38" y="218" font-size="9" fill="#9099a8">1</text>
  <circle cx="198" cy="196" r="5" fill="#3a414c"/><text x="188" y="218" font-size="9" fill="#9099a8">25</text>
  <circle cx="350" cy="196" r="5" fill="#fb863a"/><text x="340" y="218" font-size="9" fill="#fb863a">50</text>
  <circle cx="502" cy="196" r="5" fill="#3a414c"/><text x="492" y="218" font-size="9" fill="#9099a8">75</text>
  <circle cx="654" cy="196" r="5" fill="#fb863a"/><text x="640" y="218" font-size="9" fill="#fb863a">100</text>
  <text x="330" y="184" font-size="11">🔴</text>
  <text x="380" y="182" font-size="9.5" fill="#5cc66f">position + roll = new position</text>
</svg>`,
        caption:
          "If your `Player` has a `row` and a `col`, you have imported the drawing into the rules. One `int position` is the whole board.",
      },

      // ---------- one jump map ----------
      { type: "h", text: "Step 3 · Snakes and ladders are the same thing" },
      {
        type: "p",
        text: "A snake takes you from 36 down to 6. A ladder takes you from 4 up to 14. Both are *“if you land on **from**, go to **to**”*. The only difference is the sign, and the sign is data.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 254" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, two separate classes Snake with head and tail and Ladder with bottom and top, plus two loops to check them. On the right, a single map from square to destination, with one lookup line, and a note that to is less than from for a snake and greater for a ladder.">
  <text x="20" y="24" font-size="10.5" fill="#f06868">✗ TWO CLASSES, TWO LOOPS</text>
  <rect x="20" y="34" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="38" y="60" font-size="10" fill="#e8e4dc">class Snake  { head, tail }</text>
  <text x="38" y="80" font-size="10" fill="#e8e4dc">class Ladder { bottom, top }</text>
  <line x1="38" y1="94" x2="318" y2="94" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="38" y="116" font-size="9.5" fill="#9099a8">for (s : snakes)</text>
  <text x="38" y="134" font-size="9.5" fill="#9099a8">   if (s.head == pos) pos = s.tail;</text>
  <text x="38" y="156" font-size="9.5" fill="#9099a8">for (l : ladders)</text>
  <text x="38" y="174" font-size="9.5" fill="#9099a8">   if (l.bottom == pos) pos = l.top;</text>
  <text x="38" y="204" font-size="10" fill="#f06868">two identical shapes · O(n) per move</text>
  <text x="38" y="220" font-size="10" fill="#f06868">and a new entity for every variant</text>

  <text x="364" y="24" font-size="10.5" fill="#5cc66f">✓ ONE MAP</text>
  <rect x="364" y="34" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="382" y="60" font-size="10" fill="#e8e4dc">Map&lt;Integer, Integer&gt; jumps</text>
  <line x1="382" y1="74" x2="662" y2="74" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="96" font-size="9.5" fill="#5cc66f">jumps.put(4, 14);</text><text x="530" y="96" font-size="9" fill="#6b7280">🪜 up</text>
  <text x="382" y="114" font-size="9.5" fill="#f06868">jumps.put(36, 6);</text><text x="530" y="114" font-size="9" fill="#6b7280">🐍 down</text>
  <line x1="382" y1="130" x2="662" y2="130" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="154" font-size="9.5" fill="#e8e4dc">pos = jumps.getOrDefault(pos, pos);</text>
  <text x="382" y="184" font-size="10" fill="#5cc66f">one line · O(1) per move</text>
  <text x="382" y="204" font-size="10" fill="#9099a8">to &lt; from → snake</text>
  <text x="382" y="220" font-size="10" fill="#9099a8">to &gt; from → ladder</text>
</svg>`,
        caption:
          "The prototype prints this lookup as you play: land on 4 and the explain line reads `jumps[4] = 14`. One map, two behaviours, and the difference is arithmetic rather than inheritance.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Should a jump chain?",
        text: "Land on a ladder that ends on a snake's head — do you slide again? **Real rules say no**: one jump per turn. Say this out loud and make it a single `if` rather than a `while`. It is a two-word answer that shows you thought about the edge, and it is a genuinely ambiguous rule so the interviewer will not have a fixed answer either.",
      },

      // ---------- dice ----------
      { type: "h", text: "Step 4 · The dice — the part everybody gets wrong" },
      {
        type: "p",
        text: "Here is the line most candidates write, and it quietly ruins the design:",
      },
      {
        type: "code",
        language: "java",
        filename: "the line that kills testability",
        code: `public void playTurn() {
    int roll = 1 + new Random().nextInt(6);      // <-- randomness welded into the game
    ...
}`,
      },
      {
        type: "p",
        text: "The game now cannot be tested. You cannot check *“a player at 4 climbs to 14”*, because you cannot make the dice show a 4. You cannot check *“from 97 a roll of 5 forfeits the turn”*. You cannot reproduce a reported bug. Every test you write is a coin toss.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 276" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A Dice interface with a roll method, implemented by RandomDice using a random number generator and LoadedDice returning a fixed sequence. Game depends only on the interface. Below, two columns compare: with Math.random inside, tests are impossible and bugs are unreproducible; with an injected dice, every scenario is one line and a failure replays exactly.">
  <defs>
    <marker id="snl-t" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="12" refX="12" refY="6" orient="auto"><path d="M1,1 L12,6 L1,11 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
    <marker id="snl-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="266" y="14" width="168" height="40" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="290" y="40" font-size="11.5" fill="#fb863a">Game</text>
  <line x1="350" y1="54" x2="350" y2="80" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#snl-a)"/>
  <text x="360" y="72" font-size="9.5" fill="#6b7280">holds a</text>

  <rect x="252" y="84" width="196" height="52" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="266" y="102" font-size="9.5" fill="#6b7280">«interface»</text>
  <text x="266" y="118" font-size="11.5" fill="#5e9ff6">Dice</text>
  <text x="266" y="132" font-size="9.5" fill="#e8e4dc">+ roll() : int</text>

  <line x1="190" y1="176" x2="190" y2="150" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="510" y1="176" x2="510" y2="150" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="190" y1="150" x2="510" y2="150" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="350" y1="150" x2="350" y2="140" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#snl-t)"/>

  <rect x="102" y="176" width="176" height="44" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="116" y="196" font-size="10.5" fill="#e8e4dc">RandomDice</text>
  <text x="116" y="212" font-size="9" fill="#9099a8">for playing</text>

  <rect x="422" y="176" width="176" height="44" rx="6" fill="#14161a" stroke="rgba(167,139,250,0.55)"/>
  <text x="436" y="196" font-size="10.5" fill="#a78bfa">LoadedDice([4,6,2,…])</text>
  <text x="436" y="212" font-size="9" fill="#9099a8">for testing</text>

  <text x="20" y="250" font-size="10" fill="#f06868">✗ Math.random() inside playTurn: no test can pin a value, no bug can be replayed</text>
  <text x="20" y="268" font-size="10" fill="#5cc66f">✓ dice injected: “from 4, roll 4 → lands 8” is a one-line test, and a failing game replays exactly</text>
</svg>`,
        caption:
          "This is [[dependency-inversion]] on the smallest possible surface — one method, one interface — and it is the highest-value four lines in the whole problem.",
      },
      {
        type: "code",
        language: "java",
        filename: "what it buys you",
        code: `interface Dice { int roll(); }

class RandomDice implements Dice {
    private final Random random = new Random();
    public int roll() { return 1 + random.nextInt(6); }
}

class LoadedDice implements Dice {              // for tests, replays and demos
    private final int[] values;
    private int i = 0;
    LoadedDice(int... values) { this.values = values; }
    public int roll() { return values[i++ % values.length]; }
}

// now this is a real, deterministic test:
Game game = new Game(board, List.of(asha), new LoadedDice(4));
game.playTurn();
assertEquals(14, asha.position());               // 4 is a ladder to 14`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "Try it in the prototype",
        text: "Switch to **🎯 Loaded**, press **↺ New game**, roll three times, then reset and roll three times again. Identical game, both times. That reproducibility is the *only* reason the dice is an object — and it is worth saying exactly that when the interviewer asks why you bothered.",
      },

      // ---------- turn loop ----------
      { type: "h", text: "Step 5 · The turn loop" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 250" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A turn flow. Take the next player from the front of the queue, ask the dice to roll, compute the target position. If the target exceeds one hundred and exact landing is required, forfeit the turn. Otherwise move, apply any jump, check whether the position is one hundred to declare a winner, and otherwise put the player at the back of the queue.">
  <defs>
    <marker id="snl-fl" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#d8d3c9"/></marker>
    <marker id="snl-flx" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <rect x="20" y="30" width="140" height="34" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="34" y="52" font-size="10" fill="#fb863a">queue.poll()</text>
  <line x1="168" y1="47" x2="204" y2="47" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#snl-fl)"/>
  <rect x="210" y="30" width="140" height="34" rx="6" fill="#14161a" stroke="#2d333d"/><text x="224" y="52" font-size="10" fill="#e8e4dc">dice.roll()</text>
  <line x1="358" y1="47" x2="394" y2="47" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#snl-fl)"/>
  <rect x="400" y="30" width="180" height="34" rx="6" fill="#14161a" stroke="#2d333d"/><text x="414" y="52" font-size="10" fill="#e8e4dc">target = pos + roll</text>

  <line x1="490" y1="64" x2="490" y2="94" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#snl-flx)"/>
  <rect x="400" y="98" width="280" height="34" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="414" y="120" font-size="10" fill="#f06868">target &gt; 100 &amp;&amp; exactLanding → forfeit</text>

  <line x1="90" y1="64" x2="90" y2="94" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#snl-fl)"/>
  <rect x="20" y="98" width="160" height="34" rx="6" fill="#14161a" stroke="#2d333d"/><text x="34" y="120" font-size="10" fill="#e8e4dc">pos = target</text>
  <line x1="188" y1="115" x2="224" y2="115" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#snl-fl)"/>
  <rect x="230" y="98" width="150" height="34" rx="6" fill="#14161a" stroke="#2d333d"/><text x="244" y="120" font-size="10" fill="#e8e4dc">apply jump</text>

  <line x1="90" y1="132" x2="90" y2="162" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#snl-fl)"/>
  <rect x="20" y="166" width="160" height="34" rx="6" fill="#14161a" stroke="#2d333d"/><text x="34" y="188" font-size="10" fill="#e8e4dc">pos == 100 ?</text>

  <line x1="188" y1="183" x2="224" y2="183" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#snl-fl)"/>
  <rect x="230" y="166" width="150" height="34" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="244" y="188" font-size="10" fill="#5cc66f">winner — stop</text>

  <path d="M100,200 C100,232 470,232 470,200" fill="none" stroke="#d8d3c9" stroke-width="1.3" stroke-dasharray="5 4"/>
  <line x1="470" y1="200" x2="470" y2="140" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#snl-fl)"/>
  <text x="200" y="245" font-size="9.5" fill="#9099a8">otherwise queue.offer(player) — back of the line, and the next turn begins</text>
</svg>`,
        caption:
          "The queue is the whole turn manager: **poll from the front, offer to the back**. Three players or six, the code is identical — and a player who wins is simply never re-queued.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Do not put the loop inside `Game`",
        text: "`while (true) { playTurn(); }` inside the game means it can only ever run as a console program. Expose **`playTurn()`** and let the caller loop — that is what makes the same class work in a `main()`, in a test, and behind a UI button. The prototype above calls exactly this method once per click.",
      },

      // ---------- rules as data ----------
      { type: "h", text: "House rules are configuration, not code" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 216" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Four common house rules and how each is expressed: exact landing required is a boolean, a six grants another turn is a boolean, jumps chain is a boolean, and the board layout including size and jump map is configuration passed in.">
  <text x="20" y="24" font-size="10" fill="#9099a8">HOUSE RULE</text>
  <text x="420" y="24" font-size="10" fill="#9099a8">HOW IT IS EXPRESSED</text>

  <rect x="20" y="36" width="660" height="38" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="60" font-size="10.5" fill="#e8e4dc">exact roll needed to land on 100</text>
  <rect x="420" y="44" width="244" height="22" rx="11" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="434" y="59" font-size="9.5" fill="#5cc66f">boolean exactLanding</text>

  <rect x="20" y="82" width="660" height="38" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="106" font-size="10.5" fill="#e8e4dc">rolling a 6 grants another turn</text>
  <rect x="420" y="90" width="244" height="22" rx="11" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="434" y="105" font-size="9.5" fill="#5cc66f">boolean extraTurnOnSix</text>

  <rect x="20" y="128" width="660" height="38" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="152" font-size="10.5" fill="#e8e4dc">a jump can land you on another jump</text>
  <rect x="420" y="136" width="244" height="22" rx="11" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="434" y="151" font-size="9.5" fill="#fb863a">if → while, behind a flag</text>

  <rect x="20" y="174" width="660" height="38" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="198" font-size="10.5" fill="#e8e4dc">a different board (size, snakes, ladders)</text>
  <rect x="420" y="182" width="244" height="22" rx="11" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="434" y="197" font-size="9.5" fill="#5cc66f">passed into the constructor</text>
</svg>`,
        caption:
          "None of these is a new class. Toggle **exact landing** in the prototype and the same code plays a different game — that is what *“rules as data”* buys you.",
      },
      {
        type: "callout",
        variant: "info",
        title: "When flags become too many",
        text: "Three or four booleans is fine and honest. Past that, bundle them into a `GameRules` object you pass in — one parameter instead of six, and named presets (`GameRules.classic()`, `GameRules.quick()`) become possible. Mention the threshold rather than pre-building it; see [[pattern-overuse-anti-patterns]].",
      },

      // ---------- class diagram ----------
      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 330" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. Game holds a Board, a queue of Players, a GameRules object and a Dice. Board holds the jump map and the size. Dice is an interface implemented by RandomDice and LoadedDice.">
  <defs>
    <marker id="snl-a2" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="snl-t2" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="12" refX="12" refY="6" orient="auto"><path d="M1,1 L12,6 L1,11 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <rect x="260" y="14" width="200" height="88" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="272" y="34" font-size="11.5" fill="#fb863a">Game</text>
  <line x1="260" y1="42" x2="460" y2="42" stroke="#2d333d"/>
  <text x="272" y="60" font-size="10" fill="#9099a8">- turns : Queue&lt;Player&gt;</text>
  <text x="272" y="78" font-size="10" fill="#e8e4dc">+ playTurn() : TurnResult</text>
  <text x="272" y="94" font-size="9.5" fill="#6b7280">no loop, no printing</text>

  <!-- board -->
  <path d="M300,102 L300,116 L292,124 L300,132 L308,124 L300,116" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="300" y1="132" x2="300" y2="158" stroke="#d8d3c9" stroke-width="1.3"/>
  <rect x="206" y="158" width="188" height="76" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="218" y="178" font-size="11.5" fill="#e8e4dc">Board</text>
  <line x1="206" y1="186" x2="394" y2="186" stroke="#2d333d"/>
  <text x="218" y="204" font-size="10" fill="#fb863a">- jumps : Map&lt;int,int&gt;</text>
  <text x="218" y="220" font-size="10" fill="#9099a8">- lastSquare : int</text>

  <!-- player -->
  <line x1="260" y1="58" x2="184" y2="58" stroke="#9099a8" stroke-width="1.2" marker-end="url(#snl-a2)"/>
  <text x="150" y="46" font-size="9.5" fill="#6b7280">2..*</text>
  <rect x="20" y="34" width="160" height="66" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="54" font-size="11.5" fill="#e8e4dc">Player</text>
  <line x1="20" y1="62" x2="180" y2="62" stroke="#2d333d"/>
  <text x="32" y="80" font-size="10" fill="#9099a8">- name : String</text>
  <text x="32" y="96" font-size="10" fill="#5cc66f">- position : int</text>

  <!-- rules -->
  <line x1="420" y1="102" x2="420" y2="158" stroke="#9099a8" stroke-width="1.2" marker-end="url(#snl-a2)"/>
  <rect x="418" y="158" width="188" height="76" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="430" y="178" font-size="11.5" fill="#e8e4dc">GameRules</text>
  <line x1="418" y1="186" x2="606" y2="186" stroke="#2d333d"/>
  <text x="430" y="204" font-size="10" fill="#9099a8">- exactLanding</text>
  <text x="430" y="220" font-size="10" fill="#9099a8">- extraTurnOnSix</text>

  <!-- dice -->
  <polyline points="460,50 640,50 640,116" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#snl-a2)"/>
  <text x="486" y="44" font-size="9.5" fill="#6b7280">rolls</text>
  <rect x="574" y="120" width="132" height="52" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="586" y="138" font-size="9.5" fill="#6b7280">«interface»</text>
  <text x="586" y="154" font-size="11.5" fill="#5e9ff6">Dice</text>
  <text x="586" y="168" font-size="9.5" fill="#e8e4dc">+ roll() : int</text>

  <line x1="640" y1="252" x2="640" y2="176" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#snl-t2)"/>
  <rect x="574" y="252" width="132" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="586" y="271" font-size="10" fill="#e8e4dc">RandomDice</text>
  <rect x="574" y="288" width="132" height="28" rx="5" fill="#14161a" stroke="rgba(167,139,250,0.55)"/><text x="586" y="307" font-size="10" fill="#a78bfa">LoadedDice</text>

  <text x="20" y="300" font-size="9.5" fill="#9099a8">a Player's whole state is one integer —</text>
  <text x="20" y="316" font-size="9.5" fill="#9099a8">the board is a line, so there is nothing else to store</text>
</svg>`,
        caption:
          "Five classes and one interface. The interface is `Dice`, and if you only get one abstraction into this design, make it that one. Notation: [[class-diagrams]].",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“Write a test that a player climbs a ladder.”** → already free. `new LoadedDice(4)`, one turn, assert position 14. If you welded in `Math.random()`, you are now rewriting the design under time pressure.",
          "**“Simulate 10,000 games and report the average number of turns.”** → the reason `playTurn()` does not print and does not loop. The caller loops; the game stays silent. This follow-up is common and it punishes a chatty `Game` class.",
          "**“Rolling a six gives another turn.”** → do not re-queue the player when `roll == 6`. One line, because the queue *is* the turn order.",
          "**“Landing on an occupied square sends the other player back to 1.”** → the only follow-up that genuinely changes the model: the game now needs to look up *who is on a square*, so positions become a two-way relationship.",
          "**“Make it playable over a network.”** → `playTurn()` is already a request handler. Add validation that the caller is the current player, and make it atomic — same shape as the check-and-take in [[parking-lot]].",
          "**“Log every move for replay.”** → keep a move history, exactly as in [[tic-tac-toe]]. Replay a game by feeding the recorded rolls into a `LoadedDice`.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**`Math.random()` inside the turn.** The single most common miss, and the one that makes every follow-up harder.",
          "**Separate `Snake` and `Ladder` classes.** Two identical shapes and two loops where one map would do.",
          "**A 2D board.** Row/column conversions on every move, in service of a drawing the game never needs.",
          "**`while (true)` and `println` inside `Game`.** Now it cannot be tested, simulated, or put behind a UI.",
          "**Forgetting the overshoot rule entirely.** A player sitting on 99 rolls a 4 and lands on 103 — and your array index throws.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Watch a move happen in two beats",
        body:
          "Press **🎲 Roll**. The token walks one square at a time to the target — that is `position + roll` on a line. Then, if it landed on a 🐍 or 🪜, a *second* beat fires and the explain line shows the actual lookup, `jumps[4] = 14`. Two beats, because a move and a jump are two different things.",
      },
      {
        title: "Prove the game is deterministic",
        body:
          "Switch to **🎯 Loaded**, press **↺ New game**, and roll three times — note where everyone lands. Reset and do it again. **Identical.** Now switch back to **🎲 Random** and repeat: never the same twice. That difference is the entire argument for making the dice an object.",
      },
      {
        title: "Test a specific rule by hand",
        body:
          "With the loaded dice, the first roll is always a **4** — and square 4 is a ladder to 14. That is exactly the unit test in the Java sample: `new LoadedDice(4)`, one turn, assert 14. You just ran it manually; in code it is three lines and takes a millisecond.",
      },
      {
        title: "Flip a house rule",
        body:
          "Play until someone is in the 90s, then toggle between **✓ Required** and **✗ Overshoot wins**. Under the strict rule a player on 97 needs exactly a 3 and forfeits on anything higher; under the loose rule any roll of 3 or more finishes it. Same code, one boolean.",
      },
      {
        title: "Let it run",
        body:
          "Press **⏩ Play 10 turns** and just watch the turn order rotate: 🔴 → 🔵 → 🟢 → 🔴. That rotation is one queue with `poll()` and `offer()`. Adding a fourth player would not change a single line of the turn logic.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `Dice` interface with `RandomDice` and `LoadedDice` **first** (it is the design decision, so write it first) → `Board` with the jump map → `Player` with one int → `Game.playTurn()` → a `main()` that loops until someone wins. Then write the ladder test. If the test needs more than three lines, your dice is not injected properly.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "SnakeAndLadder.java",
        code: `import java.util.*;

// ---------- the design decision: randomness is a collaborator, not a call ----------
interface Dice {
    int roll();
}

class RandomDice implements Dice {
    private final Random random;
    private final int faces;
    RandomDice()                     { this(6, new Random()); }
    RandomDice(int faces, Random r)  { this.faces = faces; this.random = r; }
    public int roll() { return 1 + random.nextInt(faces); }
}

/** Fixed sequence — for tests, replays and reproducible demos. */
class LoadedDice implements Dice {
    private final int[] values;
    private int i = 0;
    LoadedDice(int... values) { this.values = values; }
    public int roll() { return values[i++ % values.length]; }
}

class Player {
    private final String name;
    private int position = 0;                 // 0 == not yet on the board
    Player(String name) { this.name = name; }
    String name()      { return name; }
    int position()     { return position; }
    void moveTo(int p) { this.position = p; }
}

/** A snake and a ladder are the same thing: land on "from", go to "to". */
class Board {
    private final int lastSquare;
    private final Map<Integer, Integer> jumps;

    Board(int lastSquare, Map<Integer, Integer> jumps) {
        this.lastSquare = lastSquare;
        this.jumps = Map.copyOf(jumps);
        jumps.forEach((from, to) -> {
            if (from < 1 || from > lastSquare || to < 1 || to > lastSquare)
                throw new IllegalArgumentException("jump off the board: " + from + "->" + to);
            if (from.equals(to)) throw new IllegalArgumentException("jump to itself: " + from);
        });
    }

    int lastSquare() { return lastSquare; }

    /** One lookup. to &lt; from is a snake, to &gt; from is a ladder — the difference is arithmetic. */
    int destinationFrom(int square) { return jumps.getOrDefault(square, square); }

    static Board classic() {
        Map<Integer, Integer> j = new HashMap<>();
        j.put(1, 38);  j.put(4, 14);  j.put(9, 31);  j.put(21, 42);
        j.put(28, 84); j.put(51, 67); j.put(71, 91); j.put(80, 100);   // ladders
        j.put(17, 7);  j.put(36, 6);  j.put(49, 11); j.put(54, 34);
        j.put(62, 18); j.put(87, 24); j.put(95, 56); j.put(98, 78);    // snakes
        return new Board(100, j);
    }
}

/** House rules are data, not subclasses. */
record GameRules(boolean exactLanding, boolean extraTurnOnSix) {
    static GameRules classic() { return new GameRules(true, true); }
}

record TurnResult(Player player, int roll, int from, int to, boolean jumped, boolean won, boolean forfeited) {}

class Game {
    private final Board board;
    private final Deque<Player> turns = new ArrayDeque<>();
    private final Dice dice;
    private final GameRules rules;
    private Player winner;

    Game(Board board, List<Player> players, Dice dice, GameRules rules) {
        if (players.size() < 2) throw new IllegalArgumentException("need at least two players");
        this.board = board;
        this.dice = dice;
        this.rules = rules;
        this.turns.addAll(players);
    }

    boolean isOver()  { return winner != null; }
    Player winner()   { return winner; }
    Player current()  { return turns.peekFirst(); }

    /** ONE turn. No loop, no printing — so this works in a test, a UI or a simulation. */
    TurnResult playTurn() {
        if (isOver()) throw new IllegalStateException("game is over");

        Player player = turns.removeFirst();
        int roll = dice.roll();
        int from = player.position();
        int target = from + roll;

        // overshoot: forfeit, or clamp, depending on the house rule
        if (target > board.lastSquare()) {
            if (rules.exactLanding()) {
                turns.addLast(player);
                return new TurnResult(player, roll, from, from, false, false, true);
            }
            target = board.lastSquare();
        }

        int after = board.destinationFrom(target);      // one jump per turn, never a chain
        player.moveTo(after);

        if (after == board.lastSquare()) {
            winner = player;
            return new TurnResult(player, roll, from, after, after != target, true, false);
        }

        // rolling a six keeps you at the front of the queue
        if (rules.extraTurnOnSix() && roll == 6) turns.addFirst(player);
        else                                     turns.addLast(player);

        return new TurnResult(player, roll, from, after, after != target, false, false);
    }
}

public class Main {
    public static void main(String[] args) {
        List<Player> players = List.of(new Player("Asha"), new Player("Ravi"), new Player("Meera"));

        // ---- deterministic: the same game every run ----
        Game game = new Game(Board.classic(), players, new LoadedDice(4, 6, 2, 5, 3, 1), GameRules.classic());
        while (!game.isOver()) {
            TurnResult t = game.playTurn();
            System.out.printf("%-6s rolls %d : %d -> %d%s%s%n",
                    t.player().name(), t.roll(), t.from(), t.to(),
                    t.jumped() ? "  (jump)" : "", t.forfeited() ? "  (forfeit)" : "");
        }
        System.out.println("winner: " + game.winner().name());

        // ---- the test the injected dice makes possible ----
        Player solo = new Player("Test");
        Game t = new Game(Board.classic(), List.of(solo, new Player("Other")),
                          new LoadedDice(4), GameRules.classic());
        t.playTurn();
        System.out.println("rolled 4 from 0, ladder at 4 -> position " + solo.position() + " (expected 14)");
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "snake_and_ladder.py",
        code: `import random
from abc import ABC, abstractmethod
from collections import deque
from dataclasses import dataclass
from typing import Optional


# ---------- the design decision: randomness is a collaborator, not a call ----------
class Dice(ABC):
    @abstractmethod
    def roll(self) -> int: ...


class RandomDice(Dice):
    def __init__(self, faces: int = 6, rng: Optional[random.Random] = None):
        self._faces = faces
        self._rng = rng or random.Random()

    def roll(self) -> int:
        return self._rng.randint(1, self._faces)


class LoadedDice(Dice):
    """Fixed sequence — for tests, replays and reproducible demos."""
    def __init__(self, *values: int):
        self._values = values
        self._i = 0

    def roll(self) -> int:
        v = self._values[self._i % len(self._values)]
        self._i += 1
        return v


class Player:
    def __init__(self, name: str):
        self.name = name
        self.position = 0                  # 0 == not yet on the board


class Board:
    """A snake and a ladder are the same thing: land on "from", go to "to"."""

    def __init__(self, last_square: int, jumps: dict[int, int]):
        for src, dst in jumps.items():
            if not (1 <= src <= last_square and 1 <= dst <= last_square):
                raise ValueError(f"jump off the board: {src}->{dst}")
            if src == dst:
                raise ValueError(f"jump to itself: {src}")
        self.last_square = last_square
        self._jumps = dict(jumps)

    def destination_from(self, square: int) -> int:
        """One lookup. dst < src is a snake, dst > src is a ladder — the difference is arithmetic."""
        return self._jumps.get(square, square)

    @staticmethod
    def classic() -> "Board":
        ladders = {1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 51: 67, 71: 91, 80: 100}
        snakes = {17: 7, 36: 6, 49: 11, 54: 34, 62: 18, 87: 24, 95: 56, 98: 78}
        return Board(100, {**ladders, **snakes})


@dataclass(frozen=True)
class GameRules:
    """House rules are data, not subclasses."""
    exact_landing: bool = True
    extra_turn_on_six: bool = True


@dataclass(frozen=True)
class TurnResult:
    player: Player
    roll: int
    frm: int
    to: int
    jumped: bool
    won: bool
    forfeited: bool


class Game:
    def __init__(self, board: Board, players: list[Player], dice: Dice, rules: GameRules):
        if len(players) < 2:
            raise ValueError("need at least two players")
        self._board = board
        self._turns = deque(players)
        self._dice = dice
        self._rules = rules
        self.winner: Optional[Player] = None

    @property
    def is_over(self) -> bool:
        return self.winner is not None

    @property
    def current(self) -> Player:
        return self._turns[0]

    def play_turn(self) -> TurnResult:
        """ONE turn. No loop, no printing — so this works in a test, a UI or a simulation."""
        if self.is_over:
            raise RuntimeError("game is over")

        player = self._turns.popleft()
        roll = self._dice.roll()
        frm = player.position
        target = frm + roll

        # overshoot: forfeit, or clamp, depending on the house rule
        if target > self._board.last_square:
            if self._rules.exact_landing:
                self._turns.append(player)
                return TurnResult(player, roll, frm, frm, False, False, True)
            target = self._board.last_square

        after = self._board.destination_from(target)   # one jump per turn, never a chain
        player.position = after

        if after == self._board.last_square:
            self.winner = player
            return TurnResult(player, roll, frm, after, after != target, True, False)

        # rolling a six keeps you at the front of the queue
        if self._rules.extra_turn_on_six and roll == 6:
            self._turns.appendleft(player)
        else:
            self._turns.append(player)

        return TurnResult(player, roll, frm, after, after != target, False, False)


if __name__ == "__main__":
    players = [Player("Asha"), Player("Ravi"), Player("Meera")]

    # ---- deterministic: the same game every run ----
    game = Game(Board.classic(), players, LoadedDice(4, 6, 2, 5, 3, 1), GameRules())
    while not game.is_over:
        t = game.play_turn()
        extra = "  (jump)" if t.jumped else ""
        extra += "  (forfeit)" if t.forfeited else ""
        print(f"{t.player.name:<6} rolls {t.roll} : {t.frm} -> {t.to}{extra}")
    print("winner:", game.winner.name)

    # ---- the test the injected dice makes possible ----
    solo = Player("Test")
    t = Game(Board.classic(), [solo, Player("Other")], LoadedDice(4), GameRules())
    t.play_turn()
    print(f"rolled 4 from 0, ladder at 4 -> position {solo.position} (expected 14)")`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "snake_and_ladder.cpp",
        code: `#include <deque>
#include <iostream>
#include <map>
#include <memory>
#include <random>
#include <stdexcept>
#include <string>
#include <vector>

// ---------- the design decision: randomness is a collaborator, not a call ----------
class Dice {
public:
    virtual ~Dice() = default;
    virtual int roll() = 0;
};

class RandomDice : public Dice {
public:
    explicit RandomDice(int faces = 6) : dist_(1, faces), gen_(std::random_device{}()) {}
    int roll() override { return dist_(gen_); }
private:
    std::uniform_int_distribution<int> dist_;
    std::mt19937 gen_;
};

// Fixed sequence — for tests, replays and reproducible demos.
class LoadedDice : public Dice {
public:
    explicit LoadedDice(std::vector<int> values) : values_(std::move(values)) {}
    int roll() override { return values_[i_++ % values_.size()]; }
private:
    std::vector<int> values_;
    size_t i_ = 0;
};

struct Player {
    std::string name;
    int position = 0;                       // 0 == not yet on the board
};

// A snake and a ladder are the same thing: land on "from", go to "to".
class Board {
public:
    Board(int lastSquare, std::map<int, int> jumps)
        : lastSquare_(lastSquare), jumps_(std::move(jumps)) {
        for (auto& [from, to] : jumps_) {
            if (from < 1 || from > lastSquare_ || to < 1 || to > lastSquare_)
                throw std::invalid_argument("jump off the board");
            if (from == to) throw std::invalid_argument("jump to itself");
        }
    }

    int lastSquare() const { return lastSquare_; }

    // One lookup. to < from is a snake, to > from is a ladder — the difference is arithmetic.
    int destinationFrom(int square) const {
        auto it = jumps_.find(square);
        return it == jumps_.end() ? square : it->second;
    }

    static Board classic() {
        return Board(100, {
            {1, 38}, {4, 14}, {9, 31}, {21, 42}, {28, 84}, {51, 67}, {71, 91}, {80, 100},  // ladders
            {17, 7}, {36, 6}, {49, 11}, {54, 34}, {62, 18}, {87, 24}, {95, 56}, {98, 78}   // snakes
        });
    }

private:
    int lastSquare_;
    std::map<int, int> jumps_;
};

// House rules are data, not subclasses.
struct GameRules {
    bool exactLanding = true;
    bool extraTurnOnSix = true;
};

struct TurnResult {
    Player* player;
    int roll, from, to;
    bool jumped, won, forfeited;
};

class Game {
public:
    Game(Board board, std::vector<Player> players, std::unique_ptr<Dice> dice, GameRules rules)
        : board_(std::move(board)), players_(std::move(players)),
          dice_(std::move(dice)), rules_(rules) {
        if (players_.size() < 2) throw std::invalid_argument("need at least two players");
        for (auto& p : players_) turns_.push_back(&p);
    }

    bool isOver() const { return winner_ != nullptr; }
    const Player* winner() const { return winner_; }

    // ONE turn. No loop, no printing — so this works in a test, a UI or a simulation.
    TurnResult playTurn() {
        if (isOver()) throw std::runtime_error("game is over");

        Player* player = turns_.front();
        turns_.pop_front();
        int roll = dice_->roll();
        int from = player->position;
        int target = from + roll;

        // overshoot: forfeit, or clamp, depending on the house rule
        if (target > board_.lastSquare()) {
            if (rules_.exactLanding) {
                turns_.push_back(player);
                return {player, roll, from, from, false, false, true};
            }
            target = board_.lastSquare();
        }

        int after = board_.destinationFrom(target);      // one jump per turn, never a chain
        player->position = after;

        if (after == board_.lastSquare()) {
            winner_ = player;
            return {player, roll, from, after, after != target, true, false};
        }

        // rolling a six keeps you at the front of the queue
        if (rules_.extraTurnOnSix && roll == 6) turns_.push_front(player);
        else                                    turns_.push_back(player);

        return {player, roll, from, after, after != target, false, false};
    }

private:
    Board board_;
    std::vector<Player> players_;
    std::deque<Player*> turns_;
    std::unique_ptr<Dice> dice_;
    GameRules rules_;
    Player* winner_ = nullptr;
};

int main() {
    // ---- deterministic: the same game every run ----
    Game game(Board::classic(), {{"Asha"}, {"Ravi"}, {"Meera"}},
              std::make_unique<LoadedDice>(std::vector<int>{4, 6, 2, 5, 3, 1}), GameRules{});
    while (!game.isOver()) {
        TurnResult t = game.playTurn();
        std::cout << t.player->name << " rolls " << t.roll << " : " << t.from << " -> " << t.to
                  << (t.jumped ? "  (jump)" : "") << (t.forfeited ? "  (forfeit)" : "") << "\\n";
    }
    std::cout << "winner: " << game.winner()->name << "\\n";

    // ---- the test the injected dice makes possible ----
    Game t(Board::classic(), {{"Test"}, {"Other"}},
           std::make_unique<LoadedDice>(std::vector<int>{4}), GameRules{});
    TurnResult r = t.playTurn();
    std::cout << "rolled 4 from 0, ladder at 4 -> position " << r.to << " (expected 14)\\n";
}`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "snake-and-ladder.ts",
        code: `// ---------- the design decision: randomness is a collaborator, not a call ----------
interface Dice {
  roll(): number;
}

class RandomDice implements Dice {
  constructor(private readonly faces = 6) {}
  roll(): number { return 1 + Math.floor(Math.random() * this.faces); }
}

/** Fixed sequence — for tests, replays and reproducible demos. */
class LoadedDice implements Dice {
  private i = 0;
  private readonly values: number[];
  constructor(...values: number[]) { this.values = values; }
  roll(): number { return this.values[this.i++ % this.values.length]; }
}

class Player {
  position = 0;                        // 0 == not yet on the board
  constructor(readonly name: string) {}
}

/** A snake and a ladder are the same thing: land on "from", go to "to". */
class Board {
  private readonly jumps: ReadonlyMap<number, number>;

  constructor(readonly lastSquare: number, jumps: Map<number, number>) {
    for (const [from, to] of jumps) {
      if (from < 1 || from > lastSquare || to < 1 || to > lastSquare)
        throw new Error(\`jump off the board: \${from}->\${to}\`);
      if (from === to) throw new Error(\`jump to itself: \${from}\`);
    }
    this.jumps = new Map(jumps);
  }

  /** One lookup. to < from is a snake, to > from is a ladder — the difference is arithmetic. */
  destinationFrom(square: number): number {
    return this.jumps.get(square) ?? square;
  }

  static classic(): Board {
    return new Board(100, new Map([
      [1, 38], [4, 14], [9, 31], [21, 42], [28, 84], [51, 67], [71, 91], [80, 100],   // ladders
      [17, 7], [36, 6], [49, 11], [54, 34], [62, 18], [87, 24], [95, 56], [98, 78],   // snakes
    ]));
  }
}

/** House rules are data, not subclasses. */
interface GameRules {
  readonly exactLanding: boolean;
  readonly extraTurnOnSix: boolean;
}
const CLASSIC_RULES: GameRules = { exactLanding: true, extraTurnOnSix: true };

interface TurnResult {
  player: Player; roll: number; from: number; to: number;
  jumped: boolean; won: boolean; forfeited: boolean;
}

class Game {
  private readonly turns: Player[];
  winner: Player | null = null;

  constructor(
    private readonly board: Board,
    players: Player[],
    private readonly dice: Dice,
    private readonly rules: GameRules,
  ) {
    if (players.length < 2) throw new Error("need at least two players");
    this.turns = [...players];
  }

  get isOver(): boolean { return this.winner !== null; }
  get current(): Player { return this.turns[0]; }

  /** ONE turn. No loop, no printing — so this works in a test, a UI or a simulation. */
  playTurn(): TurnResult {
    if (this.isOver) throw new Error("game is over");

    const player = this.turns.shift()!;
    const roll = this.dice.roll();
    const from = player.position;
    let target = from + roll;

    // overshoot: forfeit, or clamp, depending on the house rule
    if (target > this.board.lastSquare) {
      if (this.rules.exactLanding) {
        this.turns.push(player);
        return { player, roll, from, to: from, jumped: false, won: false, forfeited: true };
      }
      target = this.board.lastSquare;
    }

    const after = this.board.destinationFrom(target);   // one jump per turn, never a chain
    player.position = after;

    if (after === this.board.lastSquare) {
      this.winner = player;
      return { player, roll, from, to: after, jumped: after !== target, won: true, forfeited: false };
    }

    // rolling a six keeps you at the front of the queue
    if (this.rules.extraTurnOnSix && roll === 6) this.turns.unshift(player);
    else this.turns.push(player);

    return { player, roll, from, to: after, jumped: after !== target, won: false, forfeited: false };
  }
}

// ---- deterministic: the same game every run ----
const players = [new Player("Asha"), new Player("Ravi"), new Player("Meera")];
const game = new Game(Board.classic(), players, new LoadedDice(4, 6, 2, 5, 3, 1), CLASSIC_RULES);
while (!game.isOver) {
  const t = game.playTurn();
  const tags = (t.jumped ? "  (jump)" : "") + (t.forfeited ? "  (forfeit)" : "");
  console.log(\`\${t.player.name.padEnd(6)} rolls \${t.roll} : \${t.from} -> \${t.to}\${tags}\`);
}
console.log("winner:", game.winner!.name);

// ---- the test the injected dice makes possible ----
const solo = new Player("Test");
const t = new Game(Board.classic(), [solo, new Player("Other")], new LoadedDice(4), CLASSIC_RULES);
t.playTurn();
console.log(\`rolled 4 from 0, ladder at 4 -> position \${solo.position} (expected 14)\`);`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "Injecting randomness — the transferable lesson" },
      {
        type: "p",
        text: "Everything in this problem is easy except one habit, and that habit is worth more than the game. **Anything non-deterministic that your logic depends on should arrive from outside**, behind a tiny interface you can swap.",
      },
      {
        type: "ul",
        items: [
          "**The clock.** `Instant.now()` inside a method is the same bug as `Math.random()` inside a turn. Pass the time in — exactly what [[atm]] and [[parking-lot]] both do with `exitAt`.",
          "**Random values** — dice, shuffles, sampling, jitter, IDs. Inject a source, or at minimum inject the seed.",
          "**UUIDs and IDs.** A generator interface makes assertions on created objects possible.",
          "**The network and the filesystem.** Same principle at a bigger scale: a `BankService` interface with a `FakeBank` is why [[atm]] can demo a rollback.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The cheap version, when you have no time",
        text: "Even without an interface, taking a **seeded** `Random` in the constructor makes the whole game reproducible: `new Game(board, players, new Random(42))`. It is one parameter and it recovers most of the benefit. Worth knowing as the fallback — but the interface is better and costs four lines.",
      },
      { type: "h", text: "Where this design stops" },
      {
        type: "ul",
        items: [
          "**Multiplayer over a network.** `playTurn()` becomes a request handler and needs to verify *who* is calling and be atomic. The design supports it; it just does not do it yet.",
          "**Games with actual choices.** Ludo lets you pick which token to move, so a turn takes a parameter and `Player` becomes a strategy. That is the natural next step up from this problem.",
          "**Interaction between tokens.** The moment landing on an occupied square does something, positions stop being independent and the board needs to answer *“who is on square 47?”*",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Never call the random number generator, or the clock, from inside your logic.** Take them as collaborators. It is four lines here and it is the difference between a system you can test and one you can only run.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "The dice behind an interface makes the entire game deterministic on demand — tests, replays and bug reproduction all become trivial.",
        "One jump map instead of Snake and Ladder classes makes lookups O(1) and removes a whole duplicated code path.",
        "Position as a single integer means no coordinate maths, and the board layout stays a rendering concern.",
        "playTurn() returning a result instead of looping and printing lets the same class run in a test, a UI, or a 10,000-game simulation.",
        "House rules as booleans mean the common variants cost nothing, and the board itself is passed in rather than hardcoded.",
      ],
      cons: [
        "The design assumes a turn has no choices; games where a player picks a move (Ludo, backgammon) need playTurn to take a parameter and Player to become a strategy.",
        "Positions are independent, so any rule about tokens interacting requires a new square-to-player lookup the board does not currently have.",
        "GameRules as loose booleans stops scaling past three or four flags before it wants to become a real object with presets.",
        "One jump per turn is hardcoded as a design choice — chaining jumps is a genuinely ambiguous rule that this model quietly decides for you.",
        "There is no move history, so replay and undo need to be added rather than falling out of the design as they do in tic-tac-toe.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "awesome-low-level-design — Snake and Ladder",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/snake-and-ladder.md",
        kind: "article",
        note: "A second take on the same problem — compare how it models the jumps.",
      },
      {
        label: "Test Double — Martin Fowler",
        href: "https://martinfowler.com/bliki/TestDouble.html",
        kind: "article",
        note: "The vocabulary for LoadedDice: stub, fake, mock, spy. Useful for naming exactly what you built.",
      },
      {
        label: "Mocking the clock — Fowler on Clock Wrapper",
        href: "https://martinfowler.com/bliki/ClockWrapper.html",
        kind: "article",
        note: "The same argument as the dice, applied to time. Short, and it generalises the lesson.",
      },
      {
        label: "Game Programming Patterns — Game Loop",
        href: "https://gameprogrammingpatterns.com/game-loop.html",
        kind: "book",
        note: "Free online. Why the loop belongs outside the game object, which is the reason playTurn() does not loop.",
      },
      {
        label: "java.util.Random — seeding for reproducibility",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Random.html",
        kind: "docs",
        note: "The cheap alternative to an interface: pass a seeded Random and the whole game replays identically.",
      },
      {
        label: "Snakes and Ladders — the history and the maths",
        href: "https://en.wikipedia.org/wiki/Snakes_and_ladders",
        kind: "article",
        note: "Includes the Markov-chain analysis of expected game length — good context if the interviewer asks you to simulate.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "snake-and-ladder-q1",
        question: "Why should the dice be an interface rather than a call to the random number generator inside `playTurn()`?",
        options: [
          { id: "a", label: "So the game can be made deterministic — a LoadedDice turns “a player at 4 climbs to 14” into a real, repeatable test." },
          { id: "b", label: "Because interfaces produce better-distributed random numbers." },
          { id: "c", label: "Because the game may later need a twelve-sided die." },
          { id: "d", label: "Because calling Math.random() repeatedly is too slow." },
        ],
        correctOptionId: "a",
        explanation:
          "Testability is the whole reason. With randomness welded in, you cannot pin a value, so you cannot test any rule or reproduce any reported bug. (c) is a real but minor bonus — do not lead with it.",
      },
      {
        id: "snake-and-ladder-q2",
        question: "How should snakes and ladders be represented?",
        options: [
          { id: "a", label: "One map from square to destination — a snake is an entry where the destination is lower, a ladder where it is higher." },
          { id: "b", label: "Two classes, Snake and Ladder, each with its own list and its own loop." },
          { id: "c", label: "A 2D array marking each square as snake, ladder or plain." },
          { id: "d", label: "A Snake class and a Ladder class both extending an abstract Jump class." },
        ],
        correctOptionId: "a",
        explanation:
          "They are the same rule — land here, go there — and the direction is just the sign. (b) duplicates an identical shape twice and makes each move O(n); (d) is the same duplication with extra ceremony.",
      },
      {
        id: "snake-and-ladder-q3",
        question: "A player on 97 rolls a 5 under the “exact landing required” rule. What happens?",
        options: [
          { id: "a", label: "The turn is forfeited — the token stays on 97 and play passes to the next player." },
          { id: "b", label: "The token moves to 100 and the player wins." },
          { id: "c", label: "The token moves to 102 and the array index throws." },
          { id: "d", label: "The token bounces back from 100 to 98." },
        ],
        correctOptionId: "a",
        explanation:
          "Under that rule the move is simply not made. (d) is the bounce-back variant some houses play — a perfectly reasonable alternative, and the right answer is to ask which one applies and make it a rule flag. (c) is what happens if you forget the check entirely.",
      },
      {
        id: "snake-and-ladder-q4",
        question: "Why store a player's position as a single integer rather than a row and a column?",
        options: [
          { id: "a", label: "The board is a line from 1 to 100; the snaking grid is only how it is drawn, so moving is just position + roll." },
          { id: "b", label: "Because two integers use more memory than one." },
          { id: "c", label: "Because the board might not be square." },
          { id: "d", label: "Because snakes and ladders only ever move you within one row." },
        ],
        correctOptionId: "a",
        explanation:
          "Coordinates are a rendering concept. Importing them into the rules means converting back and forth on every single move for no gain — and the conversion is fiddly precisely because alternating rows run in opposite directions.",
      },
      {
        id: "snake-and-ladder-q5",
        question: "Why should `playTurn()` play exactly one turn instead of the game containing `while (true)`?",
        options: [
          { id: "a", label: "So the same class works in a test, behind a UI button, and inside a 10,000-game simulation — the caller owns the loop." },
          { id: "b", label: "Because a while loop would never terminate." },
          { id: "c", label: "Because each turn needs to run on its own thread." },
          { id: "d", label: "It makes no difference as long as the game eventually ends." },
        ],
        correctOptionId: "a",
        explanation:
          "A game that loops and prints can only be a console program. The prototype calls playTurn() once per click for exactly this reason, and “simulate 10,000 games” is a common follow-up that a self-looping Game cannot answer.",
      },
      {
        id: "snake-and-ladder-q6",
        question: "How is turn order best managed for three or more players?",
        options: [
          { id: "a", label: "A queue — take from the front, put back at the end. Adding a fourth player changes nothing." },
          { id: "b", label: "An index into an array, incremented and wrapped with a modulo." },
          { id: "c", label: "Two fields, currentPlayer and nextPlayer, swapped each turn." },
          { id: "d", label: "A boolean isPlayerOneTurn, flipped each turn." },
        ],
        correctOptionId: "a",
        explanation:
          "A queue makes “rolling a six gives another turn” a one-line change too — you just push to the front instead of the back. (b) genuinely works and is fine; (c) and (d) hardcode two players into the design.",
      },
      {
        id: "snake-and-ladder-q7",
        question: "A ladder ends on a square that is a snake's head. What should happen, and how should you answer?",
        options: [
          { id: "a", label: "Standard rules apply one jump per turn — say so, implement it as a single `if`, and note that a `while` behind a flag would chain." },
          { id: "b", label: "Always chain jumps until the token lands on a plain square." },
          { id: "c", label: "Forbid such boards at construction time." },
          { id: "d", label: "It cannot happen, so no decision is needed." },
        ],
        correctOptionId: "a",
        explanation:
          "It is a genuinely ambiguous rule, so the interviewer is testing whether you notice the ambiguity rather than which answer you pick. Naming the decision and showing it is one keyword away from the alternative is the strong response.",
      },
      {
        id: "snake-and-ladder-q8",
        question: "You have five minutes left and no Dice interface yet. What is the best fallback?",
        options: [
          { id: "a", label: "Take a seeded `Random` as a constructor parameter — one line, and the whole game becomes reproducible." },
          { id: "b", label: "Leave Math.random() inline and explain that you would inject it given more time." },
          { id: "c", label: "Build the full interface with two implementations anyway and skip the demo." },
          { id: "d", label: "Hardcode a fixed roll of 3 so the game is deterministic." },
        ],
        correctOptionId: "a",
        explanation:
          "Passing the seed in recovers most of the benefit for a fraction of the work, and you can say the interface is the next step. (c) trades your working demo for ceremony, and (d) is not a game.",
      },
    ],
  },
};
