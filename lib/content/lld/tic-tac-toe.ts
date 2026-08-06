import type { RoadmapLesson } from "@/lib/content/types";

export const ticTacToe: RoadmapLesson = {
  title: "Tic-Tac-Toe",
  oneLiner:
    "Everyone can code this in fifteen minutes. That is exactly why it is asked — the interviewer is not checking whether you can detect three in a row, they are checking whether you **hardcoded the 3**. The good answer is an *n×n, k-in-a-row* engine that detects a win in **O(1)** without ever re-reading the board.",
  difficulty: "beginner",
  estimatedTime: "22 min",
  prototypePath: "/prototypes/lld/tic-tac-toe.html",
  content: {
    prototypeCaption:
      "A **playable game with its algorithm showing**. Play a move and watch the right-hand panel: every mark bumps **2 to 4 counters** — its row, its column, and the diagonals if it sits on one. X adds **+1**, O adds **−1**. The instant any counter hits **±n**, that line is a win, and the board lights up. Nothing was ever scanned. The two boxes at the bottom keep score of that: **cells read by a rescan** versus **counter reads** — after five moves it is already 45 against 15. Then press **4×4** or **5×5**: same code, same counters, bigger board. And **⎌ Undo** — because a move is a tiny record, undoing is just subtraction.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design tic-tac-toe.”* It is the friendliest prompt in the set, and it hides a trap: the problem is so small that a working solution is not evidence of anything. Nested `if`s over nine hardcoded cells will play a correct game — and score badly.",
      },
      {
        type: "p",
        text: "What is actually being asked is: **can you build a small game engine?** Something where the board size is data, the win rule is a rule, and adding a second player or a bigger grid does not mean rewriting the win check. That is the difference between coding a puzzle and designing a system.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A three by three tic-tac-toe board with X in the top-left and centre and O in the top-middle. Labels mark the parts that become classes: Board is the grid, Cell is one square, Piece is the X or O symbol, Player owns a piece, and Move is a record of a row, a column and a player.">
  <defs>
    <marker id="ttt-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <!-- board -->
  <rect x="238" y="34" width="236" height="236" rx="9" fill="none" stroke="#3a414c" stroke-width="1.4"/>
  <text x="238" y="26" font-size="11" fill="#fb863a">Board  —  n × n, not 3 × 3</text>

  <rect x="250" y="46" width="68" height="68" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="272" y="92" font-size="28" fill="#fb863a">X</text>
  <rect x="322" y="46" width="68" height="68" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="344" y="92" font-size="28" fill="#5e9ff6">O</text>
  <rect x="394" y="46" width="68" height="68" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="250" y="118" width="68" height="68" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="322" y="118" width="68" height="68" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="344" y="164" font-size="28" fill="#fb863a">X</text>
  <rect x="394" y="118" width="68" height="68" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="250" y="190" width="68" height="68" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="322" y="190" width="68" height="68" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="394" y="190" width="68" height="68" rx="5" fill="#1a1d22" stroke="#2d333d"/>

  <text x="36" y="86" font-size="11" fill="#fb863a">Cell</text>
  <line x1="82" y1="82" x2="244" y2="80" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#ttt-lead)"/>
  <text x="26" y="160" font-size="11" fill="#fb863a">Piece (X / O)</text>
  <line x1="132" y1="156" x2="338" y2="150" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#ttt-lead)"/>

  <!-- players -->
  <rect x="520" y="46" width="176" height="58" rx="7" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="536" y="68" font-size="10.5" fill="#fb863a">Player “Asha”</text>
  <text x="536" y="88" font-size="10" fill="#9099a8">piece = X</text>
  <rect x="520" y="116" width="176" height="58" rx="7" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="536" y="138" font-size="10.5" fill="#5e9ff6">Player “Ravi”</text>
  <text x="536" y="158" font-size="10" fill="#9099a8">piece = O</text>

  <!-- move -->
  <rect x="520" y="196" width="176" height="72" rx="7" fill="#14161a" stroke="#3a414c"/>
  <text x="536" y="218" font-size="10.5" fill="#e8e4dc">Move</text>
  <line x1="536" y1="226" x2="682" y2="226" stroke="#2d333d"/>
  <text x="536" y="244" font-size="10" fill="#9099a8">row 1 · col 1</text>
  <text x="536" y="260" font-size="10" fill="#9099a8">player Asha</text>
  <line x1="516" y1="232" x2="470" y2="180" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#ttt-lead)"/>
</svg>`,
        caption:
          "Five nouns, and only one of them is interesting. A **Move** is a small immutable record — that single decision is what later gives you undo, replay and a game log for free.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **Board** of `n × n` cells and a queue of **Players**. `play(row, col)` validates the move, writes the piece, and updates a handful of **counters**. If any counter reaches `±n`, that player has won — decided from a single number, never from a scan.",
      },
      { type: "h", text: "What separates a pass from a strong pass" },
      {
        type: "ol",
        items: [
          "**The 3 is a parameter, not a literal.** If `n` appears as `3` anywhere outside the constructor, you have hardcoded the problem.",
          "**Win detection does not scan.** Rescanning eight lines every move is fine for a 3×3 grid and embarrassing on a 19×19 Gomoku board — and they will ask about Gomoku.",
          "**Validation happens before mutation.** An invalid move must leave the board exactly as it was.",
          "**Two players is a list, not two variables.** `Player x, o;` cannot become three players; `Queue<Player>` can.",
          "**It runs.** Print a board after each move. This is the one problem where a full game in `main()` is genuinely quick.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- clarify ----------
      { type: "h", text: "Step 1 · Clarify — 3 minutes, and one question matters" },
      {
        type: "ul",
        items: [
          "**Is the board always 3×3?** — the question that shapes everything. Answer for yourself: *build it as n×n regardless*, because it costs nothing.",
          "**Is a win always a full line?** — on 3×3 yes, but on a 5×5 board it is usually *k in a row*. Ask, then build `n` and treat `k = n` as the default.",
          "**Two players, or more?** — build a queue. Three players on a 5×5 board is a real variant and costs you one line.",
          "**Do we need an AI opponent?** — almost always no. If yes, it is a separate `Player` implementation and you should say so, not start writing minimax.",
          "**Undo? Replay? A game log?** — all three fall out of keeping a move history, so build the history even if they say no.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The trap is agreeing to 3×3 too eagerly",
        text: "*“Let's keep it 3×3”* sounds like the interviewer being kind. Ten minutes later comes *“now make it 10×10 with 5 in a row”*, and a solution built around eight hardcoded lines has to be rewritten. Building n×n from the start costs about four extra lines.",
      },

      // ---------- win detection ----------
      { type: "h", text: "Step 2 · Win detection — the whole reason this problem is asked" },
      {
        type: "p",
        text: "The obvious approach after every move: check all `n` rows, all `n` columns and both diagonals. That is `O(n²)` work per move, and it re-reads cells that have not changed since the game began.",
      },
      {
        type: "p",
        text: "But only **one cell changed**. And a cell can only ever belong to four lines: its row, its column, and the two diagonals if it happens to sit on them. So keep a running total per line and update just those.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 316" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A three by three board with counters beside each row, below each column, and for both diagonals. X plays the centre, which increments the row-one counter, the column-one counter, and both diagonal counters — four counters in total. A note explains that X adds plus one and O adds minus one, so a counter reaching plus or minus n means every cell in that line belongs to one player.">
  <text x="20" y="24" font-size="10" fill="#9099a8">X = +1   ·   O = −1   ·   a line is won when its counter reaches ±n</text>

  <!-- board -->
  <rect x="120" y="42" width="70" height="60" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="146" y="82" font-size="22" fill="#fb863a">X</text>
  <rect x="194" y="42" width="70" height="60" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="220" y="82" font-size="22" fill="#5e9ff6">O</text>
  <rect x="268" y="42" width="70" height="60" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="120" y="106" width="70" height="60" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="194" y="106" width="70" height="60" rx="5" fill="rgba(251,134,58,0.16)" stroke="#fb863a" stroke-width="1.5"/><text x="220" y="146" font-size="22" fill="#fb863a">X</text>
  <rect x="268" y="106" width="70" height="60" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="120" y="170" width="70" height="60" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="194" y="170" width="70" height="60" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="268" y="170" width="70" height="60" rx="5" fill="#1a1d22" stroke="#2d333d"/>

  <!-- row counters -->
  <rect x="352" y="52" width="58" height="40" rx="5" fill="#14161a" stroke="#2d333d"/><text x="366" y="77" font-size="11" fill="#9099a8">r0  0</text>
  <rect x="352" y="116" width="58" height="40" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="366" y="141" font-size="11" fill="#5cc66f">r1 +1</text>
  <rect x="352" y="180" width="58" height="40" rx="5" fill="#14161a" stroke="#2d333d"/><text x="366" y="205" font-size="11" fill="#9099a8">r2  0</text>

  <!-- col counters -->
  <rect x="126" y="240" width="58" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="140" y="262" font-size="11" fill="#9099a8">c0 +1</text>
  <rect x="200" y="240" width="58" height="34" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="212" y="262" font-size="11" fill="#5cc66f">c1  0</text>
  <rect x="274" y="240" width="58" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="288" y="262" font-size="11" fill="#9099a8">c2  0</text>

  <!-- diagonals -->
  <rect x="440" y="52" width="86" height="40" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="454" y="77" font-size="11" fill="#5cc66f">＼  +2</text>
  <rect x="440" y="116" width="86" height="40" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="454" y="141" font-size="11" fill="#5cc66f">／  +1</text>

  <text x="440" y="196" font-size="10.5" fill="#fb863a">X played (1,1)</text>
  <text x="440" y="216" font-size="10" fill="#9099a8">4 counters touched:</text>
  <text x="440" y="234" font-size="10" fill="#e8e4dc">r1, c1, ＼, ／</text>
  <text x="440" y="256" font-size="10" fill="#9099a8">every other counter</text>
  <text x="440" y="272" font-size="10" fill="#9099a8">is untouched and still</text>
  <text x="440" y="288" font-size="10" fill="#9099a8">correct — nothing rescanned</text>

  <text x="20" y="306" font-size="9.5" fill="#6b7280">the centre is the only cell on both diagonals; a corner touches one; an edge touches none</text>
</svg>`,
        caption:
          "The `+1 / −1` trick is what makes one integer per line enough. A counter can only reach `+n` if **every** cell in that line is X, and `−n` only if every cell is O — mixed lines cancel out on the way.",
      },
      {
        type: "code",
        language: "java",
        filename: "the entire win check",
        code: `// after writing the piece at (row, col), where value is +1 for X and -1 for O
rows[row] += value;
cols[col] += value;
if (row == col)             diagonal += value;
if (row + col == n - 1)     antiDiagonal += value;

boolean won = Math.abs(rows[row]) == n
           || Math.abs(cols[col]) == n
           || Math.abs(diagonal) == n
           || Math.abs(antiDiagonal) == n;`,
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 218" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A comparison of work per move. Rescanning the board reads n squared cells per move: nine on a three by three board, one hundred on ten by ten, three hundred and sixty-one on nineteen by nineteen. Counters read at most four numbers regardless of board size.">
  <text x="176" y="26" font-size="10" fill="#f06868">RESCAN — O(n²) per move</text>
  <text x="468" y="26" font-size="10" fill="#5cc66f">COUNTERS — O(1) per move</text>

  <text x="20" y="66" font-size="11" fill="#e8e4dc">3 × 3</text>
  <rect x="150" y="44" width="270" height="32" rx="6" fill="#14161a" stroke="#2d333d"/><text x="164" y="65" font-size="10.5" fill="#9099a8">9 cells read</text>
  <rect x="440" y="44" width="240" height="32" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="454" y="65" font-size="10.5" fill="#5cc66f">≤ 4 numbers read</text>

  <text x="20" y="110" font-size="11" fill="#e8e4dc">10 × 10</text>
  <rect x="150" y="88" width="270" height="32" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.4)"/><text x="164" y="109" font-size="10.5" fill="#f06868">100 cells read</text>
  <rect x="440" y="88" width="240" height="32" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="454" y="109" font-size="10.5" fill="#5cc66f">≤ 4 numbers read</text>

  <text x="20" y="154" font-size="11" fill="#e8e4dc">19 × 19</text>
  <rect x="150" y="132" width="270" height="32" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.45)"/><text x="164" y="153" font-size="10.5" fill="#f06868">361 cells read — every move</text>
  <rect x="440" y="132" width="240" height="32" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="454" y="153" font-size="10.5" fill="#5cc66f">≤ 4 numbers read</text>

  <text x="20" y="196" font-size="9.5" fill="#9099a8">the counters cost n + n + 2 integers of memory — a rounding error next to the board itself</text>
</svg>`,
        caption:
          "On a 3×3 board the difference is meaningless and you should say so. It becomes the whole answer the moment they say *“now make it Gomoku”* — which is why they ask.",
      },
      {
        type: "callout",
        variant: "info",
        title: "When k is smaller than n",
        text: "Once a win is *k in a row on an n×n board* (Connect 4, Gomoku), a single counter per line is no longer enough — a line can contain both players. The move is to scan outward from the placed cell in the **four directions**, counting consecutive matches. That is `O(k)` per move, still independent of `n²`. Know that this is the next step; you rarely have to build it.",
      },

      // ---------- validation ----------
      { type: "h", text: "Step 3 · Validate before you mutate" },
      {
        type: "p",
        text: "Three things can be wrong with a move, and all three must be caught **before** the board changes. A half-applied move — piece written, counters not updated — is unrecoverable state.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 218" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Three validation checks before mutating. Is the game still in progress, are the coordinates inside the board, and is the cell empty. Only after all three pass does the sequence write the piece, update the counters, check for a win, then advance the turn.">
  <defs>
    <marker id="ttt-fl" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#d8d3c9"/></marker>
  </defs>
  <text x="20" y="24" font-size="10" fill="#f06868">CHECK — nothing has changed yet</text>

  <rect x="20" y="36" width="200" height="32" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.4)"/><text x="34" y="57" font-size="10" fill="#e8e4dc">game still in progress ?</text>
  <rect x="236" y="36" width="200" height="32" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.4)"/><text x="250" y="57" font-size="10" fill="#e8e4dc">coordinates on the board ?</text>
  <rect x="452" y="36" width="200" height="32" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.4)"/><text x="466" y="57" font-size="10" fill="#e8e4dc">cell empty ?</text>

  <line x1="336" y1="70" x2="336" y2="98" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#ttt-fl)"/>
  <text x="348" y="90" font-size="9.5" fill="#5cc66f">all three pass</text>

  <text x="20" y="120" font-size="10" fill="#5cc66f">MUTATE — in this order, no early exits</text>

  <rect x="20" y="132" width="152" height="32" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="34" y="153" font-size="10" fill="#5cc66f">1 write the piece</text>
  <text x="180" y="153" font-size="11" fill="#6b7280">→</text>
  <rect x="200" y="132" width="152" height="32" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="214" y="153" font-size="10" fill="#5cc66f">2 update counters</text>
  <text x="360" y="153" font-size="11" fill="#6b7280">→</text>
  <rect x="380" y="132" width="140" height="32" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="394" y="153" font-size="10" fill="#5cc66f">3 check for a win</text>
  <text x="528" y="153" font-size="11" fill="#6b7280">→</text>
  <rect x="548" y="132" width="132" height="32" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="562" y="153" font-size="10" fill="#5cc66f">4 next player</text>

  <text x="20" y="196" font-size="9.5" fill="#9099a8">step 4 is skipped when step 3 found a winner — that is the only branch in the whole method</text>
</svg>`,
        caption:
          "Try it in the prototype: click an occupied cell. The cell shakes, the move counter does not move, and no counter changes. **A rejected move is a no-op, not a partial one.**",
      },

      // ---------- class diagram ----------
      { type: "h", text: "Step 4 · The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 340" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. Game holds a Board, a queue of Players and a list of Moves, and depends on a WinCondition interface. Board composes Cell. Player references Piece. WinCondition is implemented by FullLine and KInARow.">
  <defs>
    <marker id="ttt-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="ttt-t" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="12" refX="12" refY="6" orient="auto"><path d="M1,1 L12,6 L1,11 z" fill="#14161a" stroke="#9099a8" stroke-width="1.2"/></marker>
  </defs>

  <rect x="262" y="14" width="200" height="88" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="274" y="34" font-size="11.5" fill="#fb863a">Game</text>
  <line x1="262" y1="42" x2="462" y2="42" stroke="#2d333d"/>
  <text x="274" y="60" font-size="10" fill="#9099a8">- players : Deque&lt;Player&gt;</text>
  <text x="274" y="78" font-size="10" fill="#9099a8">- history : List&lt;Move&gt;</text>
  <text x="274" y="94" font-size="10" fill="#e8e4dc">+ play(r, c) · undo()</text>

  <!-- board -->
  <path d="M300,102 L300,116 L292,124 L300,132 L308,124 L300,116" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="300" y1="132" x2="300" y2="156" stroke="#d8d3c9" stroke-width="1.3"/>
  <rect x="212" y="156" width="176" height="88" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="224" y="176" font-size="11.5" fill="#e8e4dc">Board</text>
  <line x1="212" y1="184" x2="388" y2="184" stroke="#2d333d"/>
  <text x="224" y="202" font-size="10" fill="#fb863a">- n : int</text>
  <text x="224" y="218" font-size="10" fill="#9099a8">- rows[], cols[]</text>
  <text x="224" y="234" font-size="10" fill="#9099a8">- diag, antiDiag</text>

  <path d="M270,244 L270,258 L262,266 L270,274 L278,266 L270,258" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="270" y1="274" x2="270" y2="292" stroke="#d8d3c9" stroke-width="1.3"/>
  <text x="278" y="288" font-size="9.5" fill="#9099a8">n²</text>
  <rect x="212" y="292" width="176" height="40" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="224" y="317" font-size="11.5" fill="#e8e4dc">Cell</text>

  <!-- players -->
  <line x1="262" y1="58" x2="180" y2="58" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ttt-a)"/>
  <text x="150" y="46" font-size="9.5" fill="#6b7280">2..*</text>
  <rect x="20" y="34" width="156" height="60" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="54" font-size="11.5" fill="#e8e4dc">Player</text>
  <line x1="20" y1="62" x2="176" y2="62" stroke="#2d333d"/>
  <text x="32" y="80" font-size="10" fill="#9099a8">- name, piece</text>

  <line x1="98" y1="128" x2="98" y2="98" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ttt-a)"/>
  <rect x="20" y="128" width="156" height="40" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="153" font-size="11" fill="#e8e4dc">Piece  «enum» X · O</text>

  <!-- move -->
  <line x1="176" y1="196" x2="208" y2="196" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ttt-a)"/>
  <rect x="20" y="196" width="156" height="72" rx="6" fill="#14161a" stroke="#5cc66f"/>
  <text x="32" y="216" font-size="11.5" fill="#5cc66f">Move</text>
  <line x1="20" y1="224" x2="176" y2="224" stroke="#2d333d"/>
  <text x="32" y="242" font-size="10" fill="#9099a8">row, col, player</text>
  <text x="32" y="258" font-size="9.5" fill="#6b7280">immutable → undo, replay</text>

  <!-- win condition -->
  <polyline points="462,50 596,50 596,120" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#ttt-a)"/>
  <text x="486" y="44" font-size="9.5" fill="#6b7280">asks</text>
  <rect x="512" y="124" width="180" height="60" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="524" y="142" font-size="9.5" fill="#6b7280">«interface»</text>
  <text x="524" y="158" font-size="11.5" fill="#5e9ff6">WinCondition</text>
  <text x="524" y="176" font-size="9.5" fill="#e8e4dc">+ isWin(board, move)</text>

  <line x1="602" y1="216" x2="602" y2="188" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#ttt-t)"/>
  <rect x="512" y="216" width="180" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="524" y="235" font-size="10" fill="#e8e4dc">FullLine  (tic-tac-toe)</text>
  <rect x="512" y="252" width="180" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="524" y="271" font-size="10" fill="#e8e4dc">KInARow  (Gomoku)</text>
  <rect x="512" y="288" width="180" height="28" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)" stroke-dasharray="4 3"/><text x="524" y="307" font-size="10" fill="#5cc66f">Gravity  (Connect 4)</text>
</svg>`,
        caption:
          "Two decisions do all the work: **`n` is a field on the Board**, and **the win rule is an interface**. Everything the interviewer asks next is one of those two boxes. Notation: [[class-diagrams]].",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Why `Move` should be immutable",
        text: "A move is a fact about the past: *this player put this piece here*. Facts do not change. Keeping the list of them gives you **undo** (replay the counter arithmetic backwards), **replay** (apply them to a fresh board) and a **game log** — three features for one design decision. Related: [[immutability-and-value-objects]] and [[command]].",
      },

      // ---------- undo ----------
      { type: "h", text: "Undo is subtraction, not a snapshot" },
      {
        type: "p",
        text: "Because a move touched at most four counters and one cell, undoing it touches exactly the same things with the sign flipped. No board copies, no history of full states.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 200" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two approaches to undo. Snapshotting stores a full copy of the board after every move, costing n squared memory per move. Replaying the move record backwards clears one cell and subtracts from at most four counters, costing constant memory and time.">
  <text x="20" y="24" font-size="10.5" fill="#f06868">✗ SNAPSHOT EVERY BOARD</text>
  <rect x="20" y="34" width="320" height="60" rx="7" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="36" y="58" font-size="10" fill="#9099a8">store a full n×n copy after each move</text>
  <text x="36" y="80" font-size="10.5" fill="#f06868">O(n²) memory per move</text>

  <text x="368" y="24" font-size="10.5" fill="#5cc66f">✓ REVERSE THE MOVE RECORD</text>
  <rect x="368" y="34" width="312" height="60" rx="7" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="384" y="58" font-size="10" fill="#9099a8">pop the Move, clear the cell, subtract</text>
  <text x="384" y="80" font-size="10.5" fill="#5cc66f">O(1) memory and time</text>

  <line x1="20" y1="116" x2="680" y2="116" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="20" y="142" font-size="10" fill="#9099a8">undo(Move m at (1,1), value +1)</text>
  <rect x="20" y="152" width="150" height="32" rx="6" fill="#14161a" stroke="#2d333d"/><text x="34" y="173" font-size="10" fill="#e8e4dc">cell[1][1] = empty</text>
  <text x="178" y="173" font-size="11" fill="#6b7280">→</text>
  <rect x="198" y="152" width="150" height="32" rx="6" fill="#14161a" stroke="#2d333d"/><text x="212" y="173" font-size="10" fill="#e8e4dc">rows[1] −= +1</text>
  <text x="356" y="173" font-size="11" fill="#6b7280">→</text>
  <rect x="376" y="152" width="150" height="32" rx="6" fill="#14161a" stroke="#2d333d"/><text x="390" y="173" font-size="10" fill="#e8e4dc">cols[1] −= +1</text>
  <text x="534" y="173" font-size="11" fill="#6b7280">→</text>
  <rect x="554" y="152" width="126" height="32" rx="6" fill="#14161a" stroke="#2d333d"/><text x="568" y="173" font-size="10" fill="#e8e4dc">diags −= +1</text>
</svg>`,
        caption:
          "Press **⎌ Undo** in the prototype after a winning move and watch every counter come back down. This is the [[command]] pattern in miniature — an action that knows how to reverse itself.",
      },

      // ---------- sequence ----------
      { type: "h", text: "One move, message by message" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 290" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram of playing a move. A Player calls play on Game. Game asks Board whether the cell is empty, then tells Board to place the piece, which updates the counters. Game asks WinCondition whether this move wins; it answers yes and Game returns a win result.">
  <defs>
    <marker id="ttt-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="ttt-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="100" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="38" y="32" font-size="10.5" fill="#e8e4dc">Player</text>
  <rect x="182" y="12" width="100" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="212" y="32" font-size="10.5" fill="#fb863a">Game</text>
  <rect x="352" y="12" width="100" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="382" y="32" font-size="10.5" fill="#e8e4dc">Board</text>
  <rect x="530" y="12" width="130" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="542" y="32" font-size="10.5" fill="#5e9ff6">WinCondition</text>

  <line x1="64" y1="42" x2="64" y2="272" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="232" y1="42" x2="232" y2="272" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="402" y1="42" x2="402" y2="272" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="595" y1="42" x2="595" y2="272" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="72" y="70" font-size="10" fill="#e8e4dc">play(1, 1)</text>
  <line x1="64" y1="78" x2="228" y2="78" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ttt-call)"/>

  <text x="240" y="106" font-size="10" fill="#e8e4dc">isEmpty(1, 1) ?</text>
  <line x1="232" y1="114" x2="398" y2="114" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ttt-call)"/>
  <text x="264" y="138" font-size="10" fill="#5cc66f">true — safe to write</text>
  <line x1="402" y1="146" x2="236" y2="146" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#ttt-ret)"/>

  <text x="240" y="174" font-size="10" fill="#e8e4dc">place(X, 1, 1)</text>
  <line x1="232" y1="182" x2="398" y2="182" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ttt-call)"/>
  <text x="412" y="174" font-size="9.5" fill="#9099a8">rows[1]++ cols[1]++ ＼++ ／++</text>

  <text x="240" y="212" font-size="10" fill="#e8e4dc">isWin(board, move) ?</text>
  <line x1="232" y1="220" x2="591" y2="220" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ttt-call)"/>
  <text x="380" y="244" font-size="10" fill="#5cc66f">|＼| == n → true</text>
  <line x1="595" y1="252" x2="236" y2="252" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#ttt-ret)"/>

  <text x="72" y="270" font-size="10" fill="#5cc66f">WIN</text>
  <line x1="232" y1="278" x2="68" y2="278" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#ttt-ret)"/>
</svg>`,
        caption:
          "Four messages. `Game` orchestrates, `Board` owns the data *and* the counters, and `WinCondition` reads but never writes. Notation: [[sequence-diagrams]].",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups — this is a single family of games" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 240" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Four game variants and what each needs. N by N tic-tac-toe needs only the board size, which is already a parameter. Gomoku needs a k-in-a-row win condition. Connect Four needs gravity on placement plus k-in-a-row. Three-player needs one more entry in the player queue.">
  <text x="20" y="24" font-size="10" fill="#9099a8">“NOW MAKE IT…”</text>
  <text x="404" y="24" font-size="10" fill="#9099a8">WHAT CHANGES</text>

  <rect x="20" y="36" width="660" height="42" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="62" font-size="11" fill="#e8e4dc">10 × 10 tic-tac-toe</text>
  <rect x="404" y="46" width="260" height="24" rx="12" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="418" y="62" font-size="9.5" fill="#5cc66f">nothing — n was always a parameter</text>

  <rect x="20" y="86" width="660" height="42" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="112" font-size="11" fill="#e8e4dc">Gomoku — 5 in a row on 19 × 19</text>
  <rect x="404" y="96" width="260" height="24" rx="12" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="418" y="112" font-size="9.5" fill="#fb863a">+1 class: KInARow win condition</text>

  <rect x="20" y="136" width="660" height="42" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="162" font-size="11" fill="#e8e4dc">Connect 4</text>
  <rect x="404" y="146" width="260" height="24" rx="12" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="418" y="162" font-size="9.5" fill="#fb863a">+gravity on placement, +KInARow</text>

  <rect x="20" y="186" width="660" height="42" rx="7" fill="#14161a" stroke="#2d333d"/>
  <text x="38" y="212" font-size="11" fill="#e8e4dc">three players</text>
  <rect x="404" y="196" width="260" height="24" rx="12" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="418" y="212" font-size="9.5" fill="#5cc66f">one more entry in the queue</text>
</svg>`,
        caption:
          "Two of the four are **free**, and they are free because of decisions you made in the first ten minutes. That is the return on treating `n` as data and the win rule as an object.",
      },
      {
        type: "ul",
        items: [
          "**“Add a computer opponent.”** → `Player` becomes an interface with `HumanPlayer` and `AiPlayer`; the game loop does not change because it only ever asks a player for a move. Do *not* start writing minimax unless asked.",
          "**“Undo the last move.”** → already free from the move history.",
          "**“Save and resume a game.”** → serialise the move list, not the board. Replaying it rebuilds board *and* counters, so there is only one thing to persist.",
          "**“Watch a game live from another screen.”** → the game publishes a `MovePlayed` event; renderers subscribe. That is [[observer]], and it keeps display code out of the rules.",
          "**“What if two players submit at once?”** → in an online version, `play()` must be atomic on the game. Same shape as the check-and-take in [[parking-lot]].",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**`3` hardcoded.** Eight explicit line checks, and the first follow-up destroys them.",
          "**Rescanning the whole board every move.** It works, and it tells the interviewer you did not think about what actually changed.",
          "**`Player x, o;` as two fields.** Two players is a coincidence of this game, not a fact about board games.",
          "**No draw detection, or draw detection by scanning for empty cells.** `moves == n * n` is one comparison.",
          "**A `char[][]` and nothing else.** No `Move`, no history — so undo, replay and logging all become new work later.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Watch a single move do its work",
        body:
          "Play the **centre** cell first. The explain line says *4 counters* — row 1, column 1, and both diagonals, because the centre is the only cell on both. Now play a **corner** (3 counters) and then an **edge** (2 counters). The number of counters a cell touches is a property of where it sits, and that is the whole optimisation.",
      },
      {
        title: "Win on a diagonal and read the number",
        body:
          "Play X at top-left, O anywhere, X centre, O anywhere, X bottom-right. The ＼ counter goes +1 → +2 → **+3**, the line lights up, and the explain line tells you the board was never re-read. Check the two cost boxes: about **45** cells rescanned versus **15** counter reads, after five moves on the smallest possible board.",
      },
      {
        title: "Try an illegal move",
        body:
          "Click a cell that already has a piece. It shakes, the call line shows `InvalidMoveException`, and — the important part — the **move count and every counter stay exactly where they were**. Then click anywhere after a game has ended. Same story.",
      },
      {
        title: "Undo a win",
        body:
          "Win a game, then press **⎌ Undo**. The winning counter drops from ±3 back to ±2, the highlight clears, and it is that player's turn again. No board snapshot was stored — the counters were simply run backwards.",
      },
      {
        title: "Break the hardcoded 3",
        body:
          "Press **5×5** and play a full row for X. The win fires at **+5**, not +3, and the counter panel now shows five rows and five columns with no code change. This is the exact follow-up an interviewer will throw at you; the chip exists so you can see what a parameterised `n` buys.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `Piece` enum → `Move` record → `Board(n)` with `rows[]`, `cols[]`, `diag`, `anti` → `place()` returning whether it won → `Game` with a player queue and history → `play()` with all three validations → `main()` that plays a full game and prints the board each move. Then add `undo()` — if it takes more than five lines, your `Move` is not carrying enough.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "TicTacToe.java",
        code: `import java.util.*;

enum Piece {
    X(+1), O(-1);
    final int value;                       // +1 / -1 is what makes one counter per line enough
    Piece(int value) { this.value = value; }
}

record Player(String name, Piece piece) {}

/** A fact about the past — immutable, which is what gives us undo and replay. */
record Move(int row, int col, Player player) {}

class InvalidMoveException extends RuntimeException {
    InvalidMoveException(String msg) { super(msg); }
}

class Board {
    private final int n;
    private final Piece[][] cells;
    private final int[] rows, cols;
    private int diag, antiDiag;
    private int filled;

    Board(int n) {
        this.n = n;
        this.cells = new Piece[n][n];
        this.rows = new int[n];
        this.cols = new int[n];
    }

    int size()      { return n; }
    boolean isFull(){ return filled == n * n; }
    boolean inBounds(int r, int c) { return r >= 0 && r < n && c >= 0 && c < n; }
    boolean isEmpty(int r, int c)  { return cells[r][c] == null; }
    Piece at(int r, int c)         { return cells[r][c]; }

    /** Writes the piece and updates at most four counters. Returns true if this move wins. */
    boolean place(int r, int c, Piece piece) {
        cells[r][c] = piece;
        filled++;
        int v = piece.value;
        rows[r] += v;
        cols[c] += v;
        if (r == c)          diag += v;
        if (r + c == n - 1)  antiDiag += v;

        return Math.abs(rows[r]) == n
            || Math.abs(cols[c]) == n
            || Math.abs(diag) == n
            || Math.abs(antiDiag) == n;
    }

    /** Undo is the same arithmetic with the sign flipped — no snapshots. */
    void remove(int r, int c) {
        Piece piece = cells[r][c];
        if (piece == null) return;
        cells[r][c] = null;
        filled--;
        int v = piece.value;
        rows[r] -= v;
        cols[c] -= v;
        if (r == c)          diag -= v;
        if (r + c == n - 1)  antiDiag -= v;
    }

    void print() {
        for (int r = 0; r < n; r++) {
            StringBuilder sb = new StringBuilder("   ");
            for (int c = 0; c < n; c++) sb.append(cells[r][c] == null ? "." : cells[r][c].name()).append(' ');
            System.out.println(sb);
        }
    }
}

enum Status { IN_PROGRESS, WON, DRAW }

class Game {
    private final Board board;
    private final Deque<Player> turnOrder = new ArrayDeque<>();   // a queue, so 3 players costs one line
    private final List<Move> history = new ArrayList<>();
    private Status status = Status.IN_PROGRESS;
    private Player winner;

    Game(int n, List<Player> players) {
        if (players.size() < 2) throw new IllegalArgumentException("need at least two players");
        this.board = new Board(n);
        this.turnOrder.addAll(players);
    }

    Status status()   { return status; }
    Player winner()   { return winner; }
    Player current()  { return turnOrder.peekFirst(); }
    Board board()     { return board; }

    Status play(int r, int c) {
        // ---- validate first; nothing has changed yet ----
        if (status != Status.IN_PROGRESS)   throw new InvalidMoveException("game is over");
        if (!board.inBounds(r, c))          throw new InvalidMoveException("off the board: " + r + "," + c);
        if (!board.isEmpty(r, c))           throw new InvalidMoveException("cell taken: " + r + "," + c);

        // ---- now mutate ----
        Player player = turnOrder.removeFirst();
        history.add(new Move(r, c, player));
        boolean won = board.place(r, c, player.piece());

        if (won) { status = Status.WON; winner = player; return status; }
        if (board.isFull()) { status = Status.DRAW; return status; }

        turnOrder.addLast(player);                 // rotate only when the game continues
        return status;
    }

    void undo() {
        if (history.isEmpty()) return;
        Move m = history.remove(history.size() - 1);
        board.remove(m.row(), m.col());
        if (status == Status.IN_PROGRESS) turnOrder.removeLast();   // un-rotate
        turnOrder.addFirst(m.player());
        status = Status.IN_PROGRESS;
        winner = null;
    }
}

public class Main {
    public static void main(String[] args) {
        Player asha = new Player("Asha", Piece.X);
        Player ravi = new Player("Ravi", Piece.O);
        Game game = new Game(3, List.of(asha, ravi));

        int[][] script = {{0,0},{0,1},{1,1},{0,2},{2,2}};    // X wins on the \\ diagonal
        for (int[] mv : script) {
            System.out.println(game.current().name() + " plays " + mv[0] + "," + mv[1]);
            Status s = game.play(mv[0], mv[1]);
            game.board().print();
            if (s == Status.WON)  { System.out.println("=> " + game.winner().name() + " wins"); break; }
            if (s == Status.DRAW) { System.out.println("=> draw"); break; }
        }

        try { game.play(1, 0); }
        catch (InvalidMoveException e) { System.out.println("rejected: " + e.getMessage()); }

        game.undo();
        System.out.println("after undo, status=" + game.status() + ", next=" + game.current().name());

        // the follow-up: same code, bigger board
        Game big = new Game(5, List.of(asha, ravi));
        for (int i = 0; i < 5; i++) { big.play(0, i); if (big.status() == Status.IN_PROGRESS) big.play(1, i); }
        System.out.println("5x5 => " + big.status() + " by " + big.winner().name());
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "tic_tac_toe.py",
        code: `from collections import deque
from dataclasses import dataclass
from enum import Enum
from typing import Optional


class Piece(Enum):
    X = 1                       # +1 / -1 is what makes one counter per line enough
    O = -1

    @property
    def value_(self) -> int:
        return self.value


@dataclass(frozen=True)
class Player:
    name: str
    piece: Piece


@dataclass(frozen=True)
class Move:
    """A fact about the past — immutable, which is what gives us undo and replay."""
    row: int
    col: int
    player: Player


class InvalidMove(Exception):
    pass


class Status(Enum):
    IN_PROGRESS = "IN_PROGRESS"
    WON = "WON"
    DRAW = "DRAW"


class Board:
    def __init__(self, n: int):
        self.n = n
        self._cells: list[list[Optional[Piece]]] = [[None] * n for _ in range(n)]
        self._rows = [0] * n
        self._cols = [0] * n
        self._diag = 0
        self._anti = 0
        self._filled = 0

    @property
    def is_full(self) -> bool:
        return self._filled == self.n * self.n

    def in_bounds(self, r: int, c: int) -> bool:
        return 0 <= r < self.n and 0 <= c < self.n

    def is_empty(self, r: int, c: int) -> bool:
        return self._cells[r][c] is None

    def place(self, r: int, c: int, piece: Piece) -> bool:
        """Writes the piece and updates at most four counters. True if this move wins."""
        self._cells[r][c] = piece
        self._filled += 1
        v = piece.value
        self._rows[r] += v
        self._cols[c] += v
        if r == c:
            self._diag += v
        if r + c == self.n - 1:
            self._anti += v

        return (abs(self._rows[r]) == self.n or abs(self._cols[c]) == self.n
                or abs(self._diag) == self.n or abs(self._anti) == self.n)

    def remove(self, r: int, c: int) -> None:
        """Undo is the same arithmetic with the sign flipped — no snapshots."""
        piece = self._cells[r][c]
        if piece is None:
            return
        self._cells[r][c] = None
        self._filled -= 1
        v = piece.value
        self._rows[r] -= v
        self._cols[c] -= v
        if r == c:
            self._diag -= v
        if r + c == self.n - 1:
            self._anti -= v

    def show(self) -> None:
        for row in self._cells:
            print("   " + " ".join(p.name if p else "." for p in row))


class Game:
    def __init__(self, n: int, players: list[Player]):
        if len(players) < 2:
            raise ValueError("need at least two players")
        self.board = Board(n)
        self._turns = deque(players)          # a queue, so 3 players costs one line
        self._history: list[Move] = []
        self.status = Status.IN_PROGRESS
        self.winner: Optional[Player] = None

    @property
    def current(self) -> Player:
        return self._turns[0]

    def play(self, r: int, c: int) -> Status:
        # ---- validate first; nothing has changed yet ----
        if self.status is not Status.IN_PROGRESS:
            raise InvalidMove("game is over")
        if not self.board.in_bounds(r, c):
            raise InvalidMove(f"off the board: {r},{c}")
        if not self.board.is_empty(r, c):
            raise InvalidMove(f"cell taken: {r},{c}")

        # ---- now mutate ----
        player = self._turns.popleft()
        self._history.append(Move(r, c, player))
        won = self.board.place(r, c, player.piece)

        if won:
            self.status, self.winner = Status.WON, player
            return self.status
        if self.board.is_full:
            self.status = Status.DRAW
            return self.status

        self._turns.append(player)            # rotate only when the game continues
        return self.status

    def undo(self) -> None:
        if not self._history:
            return
        move = self._history.pop()
        self.board.remove(move.row, move.col)
        if self.status is Status.IN_PROGRESS:
            self._turns.pop()                 # un-rotate
        self._turns.appendleft(move.player)
        self.status, self.winner = Status.IN_PROGRESS, None


if __name__ == "__main__":
    asha, ravi = Player("Asha", Piece.X), Player("Ravi", Piece.O)
    game = Game(3, [asha, ravi])

    for r, c in [(0, 0), (0, 1), (1, 1), (0, 2), (2, 2)]:     # X wins on the \\ diagonal
        print(f"{game.current.name} plays {r},{c}")
        status = game.play(r, c)
        game.board.show()
        if status is Status.WON:
            print(f"=> {game.winner.name} wins"); break
        if status is Status.DRAW:
            print("=> draw"); break

    try:
        game.play(1, 0)
    except InvalidMove as e:
        print("rejected:", e)

    game.undo()
    print(f"after undo, status={game.status.value}, next={game.current.name}")

    # the follow-up: same code, bigger board
    big = Game(5, [asha, ravi])
    for i in range(5):
        big.play(0, i)
        if big.status is Status.IN_PROGRESS:
            big.play(1, i)
    print(f"5x5 => {big.status.value} by {big.winner.name}")`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "tic_tac_toe.cpp",
        code: `#include <cstdlib>
#include <deque>
#include <iostream>
#include <optional>
#include <stdexcept>
#include <string>
#include <vector>

enum class Piece { None = 0, X = 1, O = -1 };   // +1 / -1 is what makes one counter per line enough
static char symbol(Piece p) { return p == Piece::X ? 'X' : p == Piece::O ? 'O' : '.'; }

struct Player {
    std::string name;
    Piece piece;
};

// A fact about the past — immutable, which is what gives us undo and replay.
struct Move {
    int row, col;
    Player player;
};

struct InvalidMove : std::runtime_error {
    explicit InvalidMove(const std::string& m) : std::runtime_error(m) {}
};

enum class Status { InProgress, Won, Draw };

class Board {
public:
    explicit Board(int n)
        : n_(n), cells_(n, std::vector<Piece>(n, Piece::None)), rows_(n, 0), cols_(n, 0) {}

    int size() const { return n_; }
    bool isFull() const { return filled_ == n_ * n_; }
    bool inBounds(int r, int c) const { return r >= 0 && r < n_ && c >= 0 && c < n_; }
    bool isEmpty(int r, int c) const { return cells_[r][c] == Piece::None; }

    // Writes the piece and updates at most four counters. True if this move wins.
    bool place(int r, int c, Piece piece) {
        cells_[r][c] = piece;
        ++filled_;
        int v = static_cast<int>(piece);
        rows_[r] += v;
        cols_[c] += v;
        if (r == c)            diag_ += v;
        if (r + c == n_ - 1)   anti_ += v;

        return std::abs(rows_[r]) == n_ || std::abs(cols_[c]) == n_
            || std::abs(diag_) == n_ || std::abs(anti_) == n_;
    }

    // Undo is the same arithmetic with the sign flipped — no snapshots.
    void remove(int r, int c) {
        Piece piece = cells_[r][c];
        if (piece == Piece::None) return;
        cells_[r][c] = Piece::None;
        --filled_;
        int v = static_cast<int>(piece);
        rows_[r] -= v;
        cols_[c] -= v;
        if (r == c)            diag_ -= v;
        if (r + c == n_ - 1)   anti_ -= v;
    }

    void print() const {
        for (const auto& row : cells_) {
            std::cout << "   ";
            for (Piece p : row) std::cout << symbol(p) << ' ';
            std::cout << "\\n";
        }
    }

private:
    int n_;
    std::vector<std::vector<Piece>> cells_;
    std::vector<int> rows_, cols_;
    int diag_ = 0, anti_ = 0, filled_ = 0;
};

class Game {
public:
    Game(int n, const std::vector<Player>& players) : board_(n) {
        if (players.size() < 2) throw std::invalid_argument("need at least two players");
        for (const auto& p : players) turns_.push_back(p);      // a queue, so 3 players costs one line
    }

    Status status() const { return status_; }
    const Player& current() const { return turns_.front(); }
    const Player& winner() const { return *winner_; }
    Board& board() { return board_; }

    Status play(int r, int c) {
        // ---- validate first; nothing has changed yet ----
        if (status_ != Status::InProgress) throw InvalidMove("game is over");
        if (!board_.inBounds(r, c))        throw InvalidMove("off the board");
        if (!board_.isEmpty(r, c))         throw InvalidMove("cell taken");

        // ---- now mutate ----
        Player player = turns_.front();
        turns_.pop_front();
        history_.push_back({r, c, player});
        bool won = board_.place(r, c, player.piece);

        if (won)             { status_ = Status::Won; winner_ = player; return status_; }
        if (board_.isFull()) { status_ = Status::Draw; return status_; }

        turns_.push_back(player);                                // rotate only if the game continues
        return status_;
    }

    void undo() {
        if (history_.empty()) return;
        Move m = history_.back();
        history_.pop_back();
        board_.remove(m.row, m.col);
        if (status_ == Status::InProgress) turns_.pop_back();    // un-rotate
        turns_.push_front(m.player);
        status_ = Status::InProgress;
        winner_.reset();
    }

private:
    Board board_;
    std::deque<Player> turns_;
    std::vector<Move> history_;
    Status status_ = Status::InProgress;
    std::optional<Player> winner_;
};

int main() {
    Player asha{"Asha", Piece::X}, ravi{"Ravi", Piece::O};
    Game game(3, {asha, ravi});

    int script[5][2] = {{0,0},{0,1},{1,1},{0,2},{2,2}};          // X wins on the \\ diagonal
    for (auto& mv : script) {
        std::cout << game.current().name << " plays " << mv[0] << "," << mv[1] << "\\n";
        Status s = game.play(mv[0], mv[1]);
        game.board().print();
        if (s == Status::Won)  { std::cout << "=> " << game.winner().name << " wins\\n"; break; }
        if (s == Status::Draw) { std::cout << "=> draw\\n"; break; }
    }

    try { game.play(1, 0); }
    catch (const InvalidMove& e) { std::cout << "rejected: " << e.what() << "\\n"; }

    game.undo();
    std::cout << "after undo, next = " << game.current().name << "\\n";

    // the follow-up: same code, bigger board
    Game big(5, {asha, ravi});
    for (int i = 0; i < 5; ++i) {
        big.play(0, i);
        if (big.status() == Status::InProgress) big.play(1, i);
    }
    std::cout << "5x5 => won by " << big.winner().name << "\\n";
}`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "tic-tac-toe.ts",
        code: `enum Piece { X = 1, O = -1 }        // +1 / -1 is what makes one counter per line enough

interface Player { readonly name: string; readonly piece: Piece; }

/** A fact about the past — immutable, which is what gives us undo and replay. */
interface Move { readonly row: number; readonly col: number; readonly player: Player; }

class InvalidMoveError extends Error {}

type Status = "IN_PROGRESS" | "WON" | "DRAW";

class Board {
  private readonly cells: (Piece | null)[][];
  private readonly rows: number[];
  private readonly cols: number[];
  private diag = 0;
  private anti = 0;
  private filled = 0;

  constructor(readonly n: number) {
    this.cells = Array.from({ length: n }, () => Array<Piece | null>(n).fill(null));
    this.rows = Array(n).fill(0);
    this.cols = Array(n).fill(0);
  }

  get isFull(): boolean { return this.filled === this.n * this.n; }
  inBounds(r: number, c: number) { return r >= 0 && r < this.n && c >= 0 && c < this.n; }
  isEmpty(r: number, c: number) { return this.cells[r][c] === null; }

  /** Writes the piece and updates at most four counters. True if this move wins. */
  place(r: number, c: number, piece: Piece): boolean {
    this.cells[r][c] = piece;
    this.filled++;
    this.rows[r] += piece;
    this.cols[c] += piece;
    if (r === c) this.diag += piece;
    if (r + c === this.n - 1) this.anti += piece;

    return Math.abs(this.rows[r]) === this.n
        || Math.abs(this.cols[c]) === this.n
        || Math.abs(this.diag) === this.n
        || Math.abs(this.anti) === this.n;
  }

  /** Undo is the same arithmetic with the sign flipped — no snapshots. */
  remove(r: number, c: number): void {
    const piece = this.cells[r][c];
    if (piece === null) return;
    this.cells[r][c] = null;
    this.filled--;
    this.rows[r] -= piece;
    this.cols[c] -= piece;
    if (r === c) this.diag -= piece;
    if (r + c === this.n - 1) this.anti -= piece;
  }

  print(): void {
    for (const row of this.cells) {
      console.log("   " + row.map((p) => (p === null ? "." : Piece[p])).join(" "));
    }
  }
}

class Game {
  readonly board: Board;
  private readonly turns: Player[];        // a queue, so 3 players costs one line
  private readonly history: Move[] = [];
  status: Status = "IN_PROGRESS";
  winner: Player | null = null;

  constructor(n: number, players: Player[]) {
    if (players.length < 2) throw new Error("need at least two players");
    this.board = new Board(n);
    this.turns = [...players];
  }

  get current(): Player { return this.turns[0]; }

  play(r: number, c: number): Status {
    // ---- validate first; nothing has changed yet ----
    if (this.status !== "IN_PROGRESS") throw new InvalidMoveError("game is over");
    if (!this.board.inBounds(r, c)) throw new InvalidMoveError(\`off the board: \${r},\${c}\`);
    if (!this.board.isEmpty(r, c)) throw new InvalidMoveError(\`cell taken: \${r},\${c}\`);

    // ---- now mutate ----
    const player = this.turns.shift()!;
    this.history.push({ row: r, col: c, player });
    const won = this.board.place(r, c, player.piece);

    if (won) { this.status = "WON"; this.winner = player; return this.status; }
    if (this.board.isFull) { this.status = "DRAW"; return this.status; }

    this.turns.push(player);               // rotate only when the game continues
    return this.status;
  }

  undo(): void {
    const move = this.history.pop();
    if (!move) return;
    this.board.remove(move.row, move.col);
    if (this.status === "IN_PROGRESS") this.turns.pop();    // un-rotate
    this.turns.unshift(move.player);
    this.status = "IN_PROGRESS";
    this.winner = null;
  }
}

const asha: Player = { name: "Asha", piece: Piece.X };
const ravi: Player = { name: "Ravi", piece: Piece.O };
const game = new Game(3, [asha, ravi]);

for (const [r, c] of [[0, 0], [0, 1], [1, 1], [0, 2], [2, 2]]) {   // X wins on the \\ diagonal
  console.log(\`\${game.current.name} plays \${r},\${c}\`);
  const status = game.play(r, c);
  game.board.print();
  if (status === "WON") { console.log(\`=> \${game.winner!.name} wins\`); break; }
  if (status === "DRAW") { console.log("=> draw"); break; }
}

try { game.play(1, 0); }
catch (e) { console.log("rejected:", (e as Error).message); }

game.undo();
console.log(\`after undo, status=\${game.status}, next=\${game.current.name}\`);

// the follow-up: same code, bigger board
const big = new Game(5, [asha, ravi]);
for (let i = 0; i < 5; i++) {
  big.play(0, i);
  if (big.status === "IN_PROGRESS") big.play(1, i);
}
console.log(\`5x5 => \${big.status} by \${big.winner!.name}\`);`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The pattern you just learned, generalised" },
      {
        type: "p",
        text: "The counter trick is an example of something worth naming, because it appears constantly once you look for it: **keep a summary that is cheap to maintain incrementally, instead of recomputing it from scratch.**",
      },
      {
        type: "ul",
        items: [
          "**Running totals** — a dashboard that maintains `sum` and `count` on write rather than aggregating on every read.",
          "**Inverted indexes** — a search index updated per document instead of scanning every document per query.",
          "**Materialised views** — the same idea, given a database name.",
          "**Dirty flags and memoisation** — recompute only what the last change could possibly have affected.",
        ],
      },
      {
        type: "p",
        text: "The precondition is always the same: you must be able to work out **exactly what the change affects**. In tic-tac-toe a cell affects at most four lines, and that bound is what makes the whole thing valid.",
      },
      { type: "h", text: "When you should *not* bother" },
      {
        type: "ul",
        items: [
          "**When the recompute is genuinely cheap and rare.** On a 3×3 board played by humans, rescanning is free. Build the counters anyway here — but *say* that you know they are not needed at this size, and why you built them regardless.",
          "**When the incremental update is hard to get right.** A summary that can silently drift out of sync with the data is worse than a slow, obviously correct scan. Counters are safe because the update is two lines and the undo is the same two lines negated.",
          "**When k < n.** A single counter per line stops working the moment a line can hold both players' pieces — you need the directional scan instead. Knowing the limit of your own optimisation is worth as much as the optimisation.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Only one cell changed, so only recompute what that cell could have affected.** Say that sentence in the interview and then write four lines of code that do exactly it.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Win detection is O(1) per move and completely independent of board size — the answer to “now make it 19×19”.",
        "The board size n is a constructor parameter, so bigger boards need zero new code.",
        "Players are a queue, so three or four players is a one-line change instead of a rewrite.",
        "An immutable Move history buys undo, replay, save/resume and a game log from one decision.",
        "Validation strictly precedes mutation, so a rejected move leaves the board and every counter untouched.",
      ],
      cons: [
        "The +1/−1 counter scheme only works for exactly two players and a full-line win — three players or k-in-a-row need a different representation.",
        "Counters duplicate information already in the board, so any code path that writes cells directly can desynchronise them.",
        "On a 3×3 board the optimisation is invisible, which makes it look like over-engineering unless you explain why you built it.",
        "A WinCondition interface is genuinely more machinery than a 45-minute round needs unless the interviewer asks for variants.",
        "The design assumes moves arrive one at a time; an online multiplayer version needs play() to be atomic and this says nothing about that.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "awesome-low-level-design — Tic Tac Toe",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/tic-tac-toe.md",
        kind: "article",
        note: "A second take on the same problem — compare its class split against yours.",
      },
      {
        label: "LeetCode 348 — Design Tic-Tac-Toe",
        kind: "docs",
        note: "The exact counter optimisation as a standalone algorithm problem (a premium problem). If the interview turns algorithmic, this is where it goes.",
      },
      {
        label: "Command pattern — Refactoring Guru",
        href: "https://refactoring.guru/design-patterns/command",
        kind: "docs",
        note: "The general form of “an action that knows how to undo itself”, which is what Move plus the history list is.",
      },
      {
        label: "m,n,k-game — the general family",
        href: "https://en.wikipedia.org/wiki/M,n,k-game",
        kind: "article",
        note: "Tic-tac-toe, Gomoku and Connect Four are all one parameterised game. Useful vocabulary for the follow-ups.",
      },
      {
        label: "Game Programming Patterns — Bruce Nystrom",
        href: "https://gameprogrammingpatterns.com/contents.html",
        kind: "book",
        note: "Free online. The Command and State chapters are directly applicable to any board-game design question.",
      },
      {
        label: "Effective Java — prefer immutable value types",
        kind: "book",
        note: "Item 17. The argument for why Move and Player should be records rather than mutable objects.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "tic-tac-toe-q1",
        question: "After a move at (r, c), which lines is it enough to check for a win?",
        options: [
          { id: "a", label: "Row r, column c, and the diagonals only if the cell sits on them — at most four counters." },
          { id: "b", label: "Every row, every column, and both diagonals." },
          { id: "c", label: "Only the row and column; diagonals can be checked once at the end." },
          { id: "d", label: "All eight lines, because any of them could have completed." },
        ],
        correctOptionId: "a",
        explanation:
          "A line can only complete if the piece you just placed is on it, and one cell lies on exactly one row, one column, and zero to two diagonals. Everything else was already correct before this move and cannot have changed.",
      },
      {
        id: "tic-tac-toe-q2",
        question: "Why represent X as +1 and O as −1 rather than as two separate counts per line?",
        options: [
          { id: "a", label: "One integer per line is then enough: it can only reach +n if the whole line is X, or −n if the whole line is O." },
          { id: "b", label: "Because integers are faster to add than to compare." },
          { id: "c", label: "Because it lets a line be won by both players at once." },
          { id: "d", label: "It has no advantage; two counts per line is equally simple." },
        ],
        correctOptionId: "a",
        explanation:
          "Mixed lines cancel towards zero, so the magnitude alone tells you whether one player owns the whole line. Two counts per line would work too, but this halves the state and makes the win test a single absolute value.",
      },
      {
        id: "tic-tac-toe-q3",
        question: "The interviewer says: “now make it 10×10 with 5 in a row to win.” What actually has to change?",
        options: [
          { id: "a", label: "Board size is already a parameter, so only the win rule changes — a k-in-a-row check that scans outward from the placed cell in four directions." },
          { id: "b", label: "Everything — the counter approach cannot be adapted, so the game needs a rewrite." },
          { id: "c", label: "Only the counters' target value, from n to k." },
          { id: "d", label: "Nothing at all; the existing counters already handle k-in-a-row." },
        ],
        correctOptionId: "a",
        explanation:
          "Once k < n, a single counter per line breaks, because one line can contain pieces from both players and still hold a run of k. The fix is a directional scan from the new cell, which is O(k) — still independent of n². Option (c) is the tempting wrong answer.",
      },
      {
        id: "tic-tac-toe-q4",
        question: "Why store the players in a queue rather than as two fields `x` and `o`?",
        options: [
          { id: "a", label: "Turn rotation becomes “remove from the front, add to the back”, and supporting three or more players costs one line." },
          { id: "b", label: "Because queues use less memory than two object fields." },
          { id: "c", label: "Because the game must be able to remove players mid-game." },
          { id: "d", label: "Because Java has no way to hold two objects as fields." },
        ],
        correctOptionId: "a",
        explanation:
          "Two players is a property of tic-tac-toe, not of board games. A queue makes the turn order a first-class concept and makes “now add a third player” trivial — which is a real variant on larger boards.",
      },
      {
        id: "tic-tac-toe-q5",
        question: "A player clicks a cell that already has a piece. What must be true afterwards?",
        options: [
          { id: "a", label: "Nothing has changed — no cell written, no counter moved, no turn advanced." },
          { id: "b", label: "The turn passes to the next player as a penalty." },
          { id: "c", label: "The existing piece is overwritten with the new one." },
          { id: "d", label: "The move is recorded in the history but not applied to the board." },
        ],
        correctOptionId: "a",
        explanation:
          "Validation strictly precedes mutation, so a rejected move is a complete no-op. (d) is the subtle wrong answer — a history entry with no board change would corrupt undo and replay.",
      },
      {
        id: "tic-tac-toe-q6",
        question: "How should a draw be detected?",
        options: [
          { id: "a", label: "Compare a move counter against n × n — one comparison, no scanning." },
          { id: "b", label: "Scan the whole board for empty cells after every move." },
          { id: "c", label: "Check whether every row counter is exactly zero." },
          { id: "d", label: "Wait for a player to have no legal move available." },
        ],
        correctOptionId: "a",
        explanation:
          "You already increment a counter on every successful move, so fullness is free. (c) is wrong on its own terms — a row of one X and one O and one empty cell also sums to zero.",
      },
      {
        id: "tic-tac-toe-q7",
        question: "Why is undo cheap in this design?",
        options: [
          { id: "a", label: "A Move records exactly what changed, so undoing it clears one cell and subtracts from the same few counters — no board snapshots." },
          { id: "b", label: "Because a copy of the board is stored after every move." },
          { id: "c", label: "Because the counters are recomputed from scratch on undo." },
          { id: "d", label: "Because undo simply replays the whole game from the start." },
        ],
        correctOptionId: "a",
        explanation:
          "Keeping the move rather than the state is what makes it O(1) in both time and memory. (d) works and is O(moves) — worth mentioning as the simpler fallback if you were short on time.",
      },
      {
        id: "tic-tac-toe-q8",
        question: "On a 3×3 board the counter optimisation saves almost nothing. Should you still build it?",
        options: [
          { id: "a", label: "Yes — it is four lines, and saying out loud that it matters at 19×19 rather than 3×3 is exactly the judgement being assessed." },
          { id: "b", label: "No — it is premature optimisation and should be avoided on principle." },
          { id: "c", label: "No — rescanning is clearer, and clarity always wins over speed." },
          { id: "d", label: "Yes, but only if the interviewer explicitly asks about performance." },
        ],
        correctOptionId: "a",
        explanation:
          "The cost here is trivial and the design payoff is real, so this is not the premature-optimisation case. What earns the point is not the code but the sentence that goes with it — knowing when it matters and when it does not.",
      },
    ],
  },
};
