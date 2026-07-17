import type { RoadmapLesson } from "@/lib/content/types";

export const memento: RoadmapLesson = {
  title: "Memento",
  oneLiner:
    "Capture an object's private state in a sealed snapshot so it can be restored later — without breaking encapsulation. Think of a game save file: the save-slot menu stores your saves, but only the *game itself* can open one and put your character back exactly where they were.",
  difficulty: "beginner",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/memento.html",
  content: {
    prototypeCaption:
      "A tiny game with **save slots**. On the left is the game (the *originator*): your 🎮 hero has a level, an HP bar, and a position on a small map — all private state. Play a little (*Fight*, *Potion*, *Move*), then hit **💾 Save**: a sealed cartridge lands in a save slot showing only `SAVE #n · 🔒` — deliberately **no stats visible**, because the slot menu (the *caretaker*) stores mementos but *cannot look inside them*. Try the **peek?** button on a filled slot and watch the lock refuse to open. Then press **⏪ Load** on any slot and the game snaps back to *exactly* that moment — level, HP, and position all restored by the game itself, the only object allowed to read the save. Fill a fourth save and watch the oldest slot recycle: history costs memory.",

    overview: [
      {
        type: "p",
        text: "**Memento** answers a very natural question: *how do I add undo?* Your object has rich private state — a game character's level, HP, and position; an editor's text and cursor; a form's half-filled fields — and you want to snapshot it now and roll back to that snapshot later. The obvious hack is to read every field out into a copy, but that forces you to make everything publicly readable *and* writable, which shreds [[encapsulation]]. Memento gives you snapshots **without** opening the object up.",
      },
      {
        type: "p",
        text: "Think of a **game save file**. When you hit 'Save game', the game packs its own state into a save file — a sealed box. The save-slot menu happily stores that box, shows it as 'SAVE #2', lets you pick it later… but it *cannot open it*. It has no idea what level you were or where you stood, and it certainly can't edit your HP. Only the game itself, when you hit 'Load', unpacks the box and restores everything. That sealed-box property is the entire point of the pattern.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Memento lets an object **capture its own state in a sealed snapshot** that outsiders can store and hand back — but never open — so the object can be **restored to a past moment without ever exposing its internals**.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Why 'sealed' matters so much",
        text: "If the snapshot were just a public bag of fields, any code could read it, tweak it, and load a corrupted 'save' back in — the object would lose all control over its own invariants. A memento is *opaque to everyone except the object that made it*, so the state stays as private in the snapshot as it was in the object.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three participants" },
      {
        type: "p",
        text: "The pattern splits the undo problem across three roles, and the split *is* the pattern — each role knows exactly as much as it needs and no more:",
      },
      {
        type: "ul",
        items: [
          "**Originator** — the object with the precious private state (the *game*). It has two extra methods: `save()` packs its current state into a memento, and `restore(m)` unpacks a memento back into itself. It is the **only** thing that ever reads a memento's contents.",
          "**Memento** — the sealed snapshot (the *save file*). It's a dumb, opaque box: ideally **immutable** (built once in `save()`, never changed — see [[immutability-and-value-objects]]) and unreadable from outside. It exposes nothing useful to anyone but its originator.",
          "**Caretaker** — the history keeper (the *save-slot menu*). It asks the originator to `save()`, stores the mementos in slots or a stack, and later hands one back for `restore(m)`. It stores and organises — it **never looks inside**.",
        ],
      },
      { type: "h", text: "Why not just copy the fields from outside?" },
      {
        type: "p",
        text: "Imagine the save menu doing the job itself: `snapshot = { level: game.getLevel(), hp: game.getHp(), x: game.getX(), ... }` and later `game.setLevel(...)`, `game.setHp(...)`. To pull that off, the game must grow a **public getter and setter for every single field** — its internals become everyone's business, any code can now half-restore it or set nonsense values, and each time the game adds a field, every snapshot site silently goes stale. That's [[encapsulation]] destroyed for the sake of undo. Memento flips the responsibility: the *object* snapshots *itself*, so its fields can stay `private` and the snapshot format is its own internal secret.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class Game {
  private level = 1;            // 🔒 all private — no getters/setters needed
  private hp = 100;
  private pos = 0;

  save(): SaveFile {            // originator packs its OWN state
    return new SaveFile(this.level, this.hp, this.pos);
  }
  restore(s: SaveFile): void {  // and is the ONLY reader of a save
    this.level = s["level"]; this.hp = s["hp"]; this.pos = s["pos"];
  }
}

class SaveFile {                // memento: built once, then sealed
  constructor(
    private readonly level: number,
    private readonly hp: number,
    private readonly pos: number,
  ) {}
}

class SaveSlots {               // caretaker: stores boxes, never opens them
  private slots: SaveFile[] = [];
  store(s: SaveFile) { this.slots.push(s); }
  pick(i: number): SaveFile { return this.slots[i]; }
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "How sealed can it really be?",
        text: "How strictly the memento is sealed depends on the language. Java can nest the memento as a **private inner class** of the originator, so outsiders literally cannot name its fields. C++ uses a `friend` declaration. TypeScript and Python enforce it mostly by *convention* (private/readonly fields, underscore names) — the design intent is identical even when the compiler polices it less.",
      },
      { type: "h", text: "Memento + Command: the classic undo duo" },
      {
        type: "p",
        text: "Memento pairs beautifully with [[command]]. A command object, right before it executes, asks the originator for a memento and tucks it away; `undo()` is then just `originator.restore(saved)`. The command doesn't need to know *how* to reverse the operation — it just rewinds to the checkpoint. This is how many real editors implement undo stacks.",
      },
      { type: "h", text: "The cost: snapshots aren't free" },
      {
        type: "p",
        text: "Every save copies state. If the state is large (a big document) or you snapshot on every keystroke, memory climbs fast — the prototype's *three fixed slots that recycle the oldest* is a miniature of the real answer: **cap the history**. Other real-world tactics: snapshot only every N operations, store *diffs* (deltas) between snapshots instead of full copies, or share unchanged parts between snapshots (persistent data structures). You'll meet the same idea in the wild as editor undo history limits, database *savepoints* inside transactions, and games keeping only your last few autosaves.",
      },
      {
        type: "ul",
        items: [
          "**Editor undo** — each undo step is (conceptually) a memento of document state; real editors mix in diffs to keep memory sane.",
          "**Database transactions & savepoints** — `SAVEPOINT` marks a sealed checkpoint you can `ROLLBACK TO` without the client ever seeing internal page state.",
          "**Game saves** — the pattern's poster child: sealed files the menu lists but only the engine can interpret.",
          "**Form draft restore** — snapshot the form state before a risky action (navigation, autofill) and offer 'restore draft'.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Play, then save",
        body: "In the prototype, click ⚔ Fight a couple of times (level goes up, HP goes down), 🧪 Potion once, and 👣 Move to walk the dot across the map. Now click 💾 Save. A cartridge appears in slot 1 reading only 'SAVE #1 · 🔒' — notice it shows **no stats at all**. The save-slot panel is the caretaker: it holds your snapshot but has no window into it.",
      },
      {
        title: "02 · Try to peek — then load",
        body: "Click the small 'peek?' button on your filled slot. The lock just wobbles: the caretaker can't open a memento — only the game can. Now mutate the game some more (Fight, Move), then press ⏪ Load on slot 1. Watch the level, HP bar, and position dot snap back to *exactly* the moment you saved. The game read its own sealed save and restored itself; nothing on the outside ever touched its fields.",
      },
      {
        title: "03 · Fill the history and watch it recycle",
        body: "Make three more saves in different states so all 3 slots are full, then save a 4th time. The **oldest** slot fades and gets recycled with the new save. That's the memory cost of Memento made visible: snapshots pile up, so real systems cap the history, keep diffs, or drop old checkpoints — exactly like a game keeping only your last few autosaves. Hit ↺ Reset to start fresh.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "gameSave.ts",
        code: `// MEMENTO — a sealed save file. Built once, readonly after.
class SaveFile {
  constructor(
    readonly level: number,
    readonly hp: number,
    readonly pos: number,
  ) {}
}

// ORIGINATOR — the game. Its state stays private; it alone
// knows how to pack a save and how to unpack one.
class Game {
  private level = 1;
  private hp = 100;
  private pos = 0;

  fight()  { this.level += 1; this.hp -= 20; }
  potion() { this.hp = Math.min(100, this.hp + 30); }
  move()   { this.pos += 1; }

  save(): SaveFile {                 // pack my OWN state
    return new SaveFile(this.level, this.hp, this.pos);
  }
  restore(s: SaveFile): void {       // only I read a save back
    this.level = s.level; this.hp = s.hp; this.pos = s.pos;
  }
  toString() { return \`Lv\${this.level} HP\${this.hp} @\${this.pos}\`; }
}

// CARETAKER — the save-slot menu. Stores saves, never opens them.
class SaveSlots {
  private slots: SaveFile[] = [];
  store(s: SaveFile) { this.slots.push(s); }
  pick(i: number): SaveFile { return this.slots[i]; }
}

const game = new Game();
const menu = new SaveSlots();

game.fight(); game.move();
menu.store(game.save());            // 💾 sealed snapshot into slot 0

game.fight(); game.fight();         // keep playing...
console.log(\`\${game}\`);             // Lv4 HP40 @1

game.restore(menu.pick(0));         // ⏪ load slot 0
console.log(\`\${game}\`);             // Lv2 HP80 @1 — exact restore`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Game.java",
        code: `import java.util.*;

// ORIGINATOR — the game with private state.
public class Game {
    private int level = 1, hp = 100, pos = 0;

    public void fight()  { level++; hp -= 20; }
    public void potion() { hp = Math.min(100, hp + 30); }
    public void move()   { pos++; }

    // MEMENTO as a private nested class: the classic Java trick.
    // Outside code sees only the opaque 'Game.SaveFile' type —
    // its fields are literally unreachable. True sealed box.
    public static final class SaveFile {
        private final int level, hp, pos;      // 🔒 private + final
        private SaveFile(int l, int h, int p) { level = l; hp = h; pos = p; }
    }

    public SaveFile save() { return new SaveFile(level, hp, pos); }
    public void restore(SaveFile s) {          // only Game reads it
        level = s.level; hp = s.hp; pos = s.pos;
    }
    public String toString() { return "Lv" + level + " HP" + hp + " @" + pos; }
}

// CARETAKER — stores sealed saves, cannot open them.
class SaveSlots {
    private final List<Game.SaveFile> slots = new ArrayList<>();
    void store(Game.SaveFile s) { slots.add(s); }
    Game.SaveFile pick(int i)   { return slots.get(i); }
}

// Game game = new Game(); SaveSlots menu = new SaveSlots();
// game.fight(); menu.store(game.save());   // 💾 save
// game.fight(); game.fight();
// game.restore(menu.pick(0));              // ⏪ exact restore`,
      },
      {
        label: "Python",
        language: "python",
        filename: "game_save.py",
        code: `from dataclasses import dataclass


# MEMENTO — frozen dataclass = built once, then immutable.
@dataclass(frozen=True)
class SaveFile:
    level: int
    hp: int
    pos: int


# ORIGINATOR — the game. State stays "private" by convention (_fields);
# it alone packs saves and reads them back.
class Game:
    def __init__(self) -> None:
        self._level, self._hp, self._pos = 1, 100, 0

    def fight(self)  -> None: self._level += 1; self._hp -= 20
    def potion(self) -> None: self._hp = min(100, self._hp + 30)
    def move(self)   -> None: self._pos += 1

    def save(self) -> SaveFile:                 # pack my OWN state
        return SaveFile(self._level, self._hp, self._pos)

    def restore(self, s: SaveFile) -> None:     # only Game reads a save
        self._level, self._hp, self._pos = s.level, s.hp, s.pos

    def __str__(self) -> str:
        return f"Lv{self._level} HP{self._hp} @{self._pos}"


# CARETAKER — the slot menu: stores boxes, never opens them.
class SaveSlots:
    def __init__(self) -> None:
        self._slots: list[SaveFile] = []
    def store(self, s: SaveFile) -> None: self._slots.append(s)
    def pick(self, i: int) -> SaveFile:   return self._slots[i]


game, menu = Game(), SaveSlots()
game.fight(); game.move()
menu.store(game.save())        # 💾 sealed snapshot
game.fight(); game.fight()
print(game)                    # Lv4 HP40 @1
game.restore(menu.pick(0))     # ⏪ load
print(game)                    # Lv2 HP80 @1 — exact restore`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "game_save.cpp",
        code: `#include <algorithm>
#include <vector>

// ORIGINATOR — the game. The memento is a nested class whose
// fields are private; Game is its friend, so ONLY Game reads it.
class Game {
    int level = 1, hp = 100, pos = 0;   // 🔒 private state

public:
    class SaveFile {                    // MEMENTO — sealed box
        int level, hp, pos;
        SaveFile(int l, int h, int p) : level(l), hp(h), pos(p) {}
        friend class Game;              // only the game may open it
    };

    void fight()  { level++; hp -= 20; }
    void potion() { hp = std::min(100, hp + 30); }
    void move()   { pos++; }

    SaveFile save() const { return SaveFile(level, hp, pos); }
    void restore(const SaveFile& s) {   // exact rollback
        level = s.level; hp = s.hp; pos = s.pos;
    }
    int currentLevel() const { return level; }
};

// CARETAKER — stores saves; SaveFile's fields are invisible to it.
class SaveSlots {
    std::vector<Game::SaveFile> slots;
public:
    void store(Game::SaveFile s) { slots.push_back(s); }
    const Game::SaveFile& pick(int i) const { return slots[i]; }
};

int main() {
    Game game; SaveSlots menu;
    game.fight(); game.move();
    menu.store(game.save());        // 💾 sealed snapshot
    game.fight(); game.fight();     // keep playing (Lv 4)
    game.restore(menu.pick(0));     // ⏪ back to Lv 2 exactly
    return game.currentLevel();     // 2
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Memento when rollback matters and privacy matters" },
      {
        type: "p",
        text: "The pattern earns its keep when *both* halves of its promise are needed — you want to rewind, and you don't want to expose internals to do it:",
      },
      {
        type: "ul",
        items: [
          "**Undo / rollback of rich private state** — editors, drawing apps, game state, wizards with multi-step forms: anything where 'take me back to how it was' must be exact and the state isn't public.",
          "**Checkpoints before risky operations** — snapshot before applying a migration, running an irreversible command, or letting the user try a destructive action; restore if it goes wrong (the database `SAVEPOINT` idea).",
          "**Pairing with [[command]]** — each command stores a memento before executing, making undo trivial and uniform across wildly different operations.",
        ],
      },
      { type: "h", text: "When NOT to use it" },
      {
        type: "ul",
        items: [
          "**The state is tiny or already public** — a single number, a plain settings struct: just copy the value. Wrapping `int score` in an originator/memento/caretaker trio is ceremony, not design.",
          "**History would blow memory** — thousands of snapshots of a large object is a leak with a design pattern's name on it. If you can't cap, diff, or share structure between snapshots, reconsider (event sourcing or reversible operations may fit better).",
          "**You need to *inspect* history, not just restore it** — a memento is deliberately opaque. If the UI must show 'what changed', you want an explicit change log, not sealed boxes.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Undo/rollback without breaking encapsulation — the object's fields stay private; no getter/setter explosion just to support snapshots.",
        "Exact, trustworthy restores — the originator packs and unpacks its own state, so a restore can never be partial or inconsistent the way field-by-field copying from outside can.",
        "Clean separation of duties — the caretaker owns *when* to save and *which* snapshot to keep, the originator owns *what* state means; history logic stays out of the business object.",
        "Immutable snapshots are safe to share — a sealed, read-only memento can be stored, passed around, even serialized, with no risk of anyone corrupting the saved state.",
      ],
      cons: [
        "Memory cost — every snapshot is a copy; frequent saves of large state add up fast, so real systems must cap history, snapshot less often, or store diffs.",
        "True sealing is language-dependent — Java nested classes and C++ friends enforce it; TypeScript and Python mostly rely on convention, so discipline is part of the design.",
        "Caretaker lifetime bugs — the caretaker decides how long saves live; forgetting to prune old mementos is a classic slow leak.",
        "Hidden staleness — a restored memento silently rewinds *everything* the originator owns; if other objects depended on the newer state, restoring can leave the wider system inconsistent.",
      ],
    },

    furtherReading: [
      {
        label: "Memento — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/memento",
        note: "The best illustrated first read: the editor-undo problem, why naive field copying breaks encapsulation, and the nested-class implementation with diagrams.",
        kind: "article",
      },
      {
        label: "Memento pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Memento_pattern",
        note: "Concise reference with the originator/memento/caretaker structure, UML, and multi-language examples including the Java inner-class approach.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original Gang of Four book that named Memento; the primary source for its intent — 'without violating encapsulation, capture and externalize an object's internal state'.",
        kind: "book",
      },
      {
        label: "Memento — SourceMaking",
        href: "https://sourcemaking.com/design_patterns/memento",
        note: "Compact treatment with checklists and rules of thumb, including the classic 'undo via Command + Memento' pairing.",
        kind: "article",
      },
      {
        label: "PostgreSQL SAVEPOINT — sealed checkpoints inside a transaction",
        href: "https://www.postgresql.org/docs/current/sql-savepoint.html",
        note: "A production Memento in the wild: mark a savepoint, keep working, and ROLLBACK TO it on failure — the client never sees the engine's internal state.",
        kind: "docs",
      },
      {
        label: "Memento in real codebases — Baeldung (Java)",
        href: "https://www.baeldung.com/java-memento-design-pattern",
        note: "A worked Java example walking through originator, memento, and caretaker classes, with notes on immutability of the snapshot.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "memento-q1",
        question: "What is the intent of the Memento pattern, in one sentence?",
        options: [
          { id: "a", label: "Capture an object's internal state in a sealed snapshot so it can be restored later, without exposing that state to the outside." },
          { id: "b", label: "Guarantee a class has exactly one instance with a global access point." },
          { id: "c", label: "Let subclasses decide which concrete class to instantiate." },
          { id: "d", label: "Convert one interface into another so incompatible classes can work together." },
        ],
        correctOptionId: "a",
        explanation:
          "Memento is 'save game' as a pattern: the object packs its own private state into an opaque snapshot that others can store and hand back — but never open — so an exact restore is possible without breaking encapsulation. (b) is Singleton, (c) is Factory Method, (d) is Adapter.",
      },
      {
        id: "memento-q2",
        question: "In the game-save analogy, who plays which role?",
        options: [
          { id: "a", label: "The game is the originator, the save file is the memento, and the save-slot menu is the caretaker." },
          { id: "b", label: "The save file is the originator, the game is the caretaker, and the menu is the memento." },
          { id: "c", label: "The menu is the originator because it decides when to save." },
          { id: "d", label: "All three roles are played by the game itself." },
        ],
        correctOptionId: "a",
        explanation:
          "The game owns the private state and knows how to pack/unpack it (originator). The save file is the sealed snapshot (memento). The slot menu stores and lists saves without ever opening them (caretaker). Deciding *when* to save is indeed the caretaker's job — but triggering a save doesn't make it the originator.",
      },
      {
        id: "memento-q3",
        question: "Why not skip the pattern and have the save menu copy the game's fields itself via public getters and setters?",
        options: [
          { id: "a", label: "Because that forces the game to expose every internal field publicly, letting any code read, half-restore, or corrupt its state — encapsulation is destroyed just to get undo." },
          { id: "b", label: "Because getters and setters are too slow for snapshots." },
          { id: "c", label: "Because getters can only return strings, not numbers." },
          { id: "d", label: "There is no downside — that approach is exactly equivalent to Memento." },
        ],
        correctOptionId: "a",
        explanation:
          "External field-copying needs a public getter *and* setter for every piece of state, so the object's internals become everyone's business: outside code can set nonsense values, restore only some fields, and every snapshot site silently breaks when a field is added. Memento keeps fields private by making the object snapshot itself; performance (b) is not the issue.",
      },
      {
        id: "memento-q4",
        question: "What is the caretaker allowed to do with a memento?",
        options: [
          { id: "a", label: "Store it, organise it, and hand it back to the originator — but never read or modify its contents." },
          { id: "b", label: "Open it and display the saved stats to the user." },
          { id: "c", label: "Edit the snapshot to fix invalid values before restoring." },
          { id: "d", label: "Restore the originator's fields itself, one setter at a time." },
        ],
        correctOptionId: "a",
        explanation:
          "The caretaker treats mementos as opaque boxes — like save slots showing only 'SAVE #2'. Reading, editing, or applying the contents is exclusively the originator's job; that one-reader rule is what keeps the state as private in the snapshot as it was in the object.",
      },
      {
        id: "memento-q5",
        question: "Your editor snapshots the full document on every keystroke and memory usage is exploding. What's the idiomatic fix?",
        options: [
          { id: "a", label: "Cap the history, snapshot less often, or store diffs between snapshots instead of full copies." },
          { id: "b", label: "Make the memento's fields public so snapshots are smaller." },
          { id: "c", label: "Have the caretaker compress mementos by deleting fields it thinks are unimportant." },
          { id: "d", label: "Memory growth is unavoidable with Memento; the pattern cannot be tuned." },
        ],
        correctOptionId: "a",
        explanation:
          "Snapshot cost is Memento's main tax, and it's managed by policy: bound the history (like 3 recycling save slots), checkpoint every N operations, or keep deltas/shared structure between snapshots. (b) changes visibility, not size; (c) breaks the sealed-box rule — the caretaker can never look inside, let alone edit.",
      },
    ],
  },
};
