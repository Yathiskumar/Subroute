import type { RoadmapLesson } from "@/lib/content/types";

export const associationAggregationComposition: RoadmapLesson = {
  title: "Association, Aggregation & Composition",
  oneLiner:
    "Three flavors of object relationship that differ by ownership and lifecycle — a plain link, a shared whole-part, and an owned whole-part that dies together.",
  difficulty: "beginner",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/association-aggregation-composition.html",
  content: {
    prototypeCaption:
      "Three relationships side by side — **Association** (Driver → Car), **Aggregation** (Team ◇ Players), and **Composition** (House ◆ Rooms). Press *Destroy the whole* on each and watch what happens to the parts: the car lives on, the players escape to a free pool, and the rooms die with the house.",

    overview: [
      {
        type: "p",
        text: "Once you have classes, the interesting part of design is how objects *relate* to each other. Three relationships come up constantly, and beginners mix them up all the time: **association**, **aggregation**, and **composition**. They all describe one object connected to another — the difference is entirely about *ownership* and *lifecycle*.",
      },
      {
        type: "p",
        text: "Here's the intuition. **Association** is a plain link — a `Driver` *knows about* a `Car`, but neither owns the other and they live and die on their own schedule. **Aggregation** is a *has-a* where the parts are shared and can outlive the whole — a `Team` *has* `Players`, but disband the team and the players still exist. **Composition** is a stronger *owns-a* where the parts are created and destroyed with the whole — a `House` *owns* its `Rooms`, and demolish the house and the rooms go with it.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one question that decides everything",
        text: "Ask: *what happens to the part when the whole is destroyed?* If the part survives untouched, it's **association** or **aggregation**. If the part is destroyed along with the whole, it's **composition**. That single test settles almost every case.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Association — a plain link (uses-a / knows-a)" },
      {
        type: "p",
        text: "The loosest relationship. One object holds a reference to another so it can *use* it, but there's no ownership in either direction. A `Driver` is associated with a `Car` — the driver can call `car.drive()`, but the car was made elsewhere and will keep existing whether or not this driver does. Their lifecycles are completely **independent**.",
      },
      {
        type: "ul",
        items: [
          "The object is usually **passed in** from outside — you didn't create it, you just got a reference to it.",
          "Destroying one side leaves the other untouched.",
          "In UML, association is a plain solid line: `Driver ———— Car`.",
        ],
      },
      { type: "h", text: "Aggregation — a shared whole-part (has-a)" },
      {
        type: "p",
        text: "A *has-a* relationship where one object groups others, but the parts are **shared** and can **outlive** the whole. A `Team` *has* `Players` — but the players exist independently. Disband the team and every player still exists; they might join another team tomorrow. The team is just a container that references parts it does not own.",
      },
      {
        type: "ul",
        items: [
          "Parts are **added from outside** — `team.add(player)` — not built by the team itself.",
          "The same part can belong to several wholes at once (a player on a club *and* a national squad).",
          "In UML, aggregation is a **hollow** diamond on the whole's end: `Team ◇———— Player`.",
        ],
      },
      { type: "h", text: "Composition — an owned whole-part (owns-a)" },
      {
        type: "p",
        text: "The strongest *owns-a* relationship. The whole **creates** its parts and is solely responsible for **destroying** them. A `House` owns its `Rooms` — the rooms are built inside the house's constructor and they only exist as part of *that* house. Demolish the house and the rooms are gone with it. The classic engineering example is a `Car` and its `Engine`: the car builds the engine, and the engine has no life of its own once the car is scrapped.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "composition.ts",
        code: `class Engine {
  constructor(public hp: number) {}
}

class Car {
  private engine: Engine;            // exclusive part
  constructor(hp: number) {
    this.engine = new Engine(hp);    // CREATED inside the owner → composition
  }
  // when the Car is gone, nothing references this.engine → it dies too
}`,
      },
      {
        type: "p",
        text: "Contrast that with aggregation, where the part arrives from outside and is merely held: `team.add(existingPlayer)`. The keyword to look for is *who created the part* and *who is responsible for ending its life*. If the owner did both, it's composition. If the part came from elsewhere, it's aggregation or association.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Aggregation and composition are both \"has-a\"",
        text: "Don't get hung up on telling aggregation and composition apart by the words *has-a* vs *owns-a* — they overlap. The reliable difference is **lifecycle**: in aggregation the part can outlive the whole (shared, independent); in composition the part is created and destroyed with the whole (exclusive, owned). Association is the odd one out — it's a peer link, not a whole-part at all.",
      },
    ],

    handsOn: [
      {
        title: "01 · Association — the car survives",
        body: "In the **Association** scenario, press **Destroy the whole**. The `Driver` box vanishes but the `Car` stays fully intact — the console logs *\"Car still exists — independent lifecycle\"*. Nothing owned anything; cutting the link harms neither side.",
      },
      {
        title: "02 · Aggregation — the players escape",
        body: "In the **Aggregation** scenario, press **Destroy the whole**. The `Team` disappears, but its `Player` chips *survive* and slide down into the **free pool** below — the console logs *\"Players survive the team\"*. Shared parts outlive the whole that grouped them.",
      },
      {
        title: "03 · Composition — the rooms die too",
        body: "In the **Composition** scenario, press **Destroy the whole**. The `House` and every `Room` inside it fade out *together* — the console logs *\"Rooms destroyed with the house\"*. Exclusive parts share the owner's fate. Hit **Reset** to rebuild all three and compare the outcomes again.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "relationships.ts",
        code: `// ASSOCIATION — Driver just holds a reference passed in from outside.
class Car {
  constructor(public plate: string) {}
}
class Driver {
  constructor(private car: Car) {}      // car created elsewhere; not owned
  drive() { return \`driving \${this.car.plate}\`; }
}

// AGGREGATION — Team collects shared Players added from outside.
class Player {
  constructor(public name: string) {}
}
class Team {
  private players: Player[] = [];
  add(p: Player) { this.players.push(p); } // shared; outlives the team
}

// COMPOSITION — House builds its Rooms inside its own constructor.
class Room {
  constructor(public name: string) {}
}
class House {
  private rooms: Room[];
  constructor() {
    this.rooms = [new Room("kitchen"), new Room("bedroom")]; // owned & exclusive
  }
  // when the House is gone, its rooms are unreachable → destroyed with it
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Relationships.java",
        code: `// ASSOCIATION — Driver holds a reference passed in; does not own the Car.
class Car {
    final String plate;
    Car(String plate) { this.plate = plate; }
}
class Driver {
    private final Car car;                 // created elsewhere; not owned
    Driver(Car car) { this.car = car; }
    String drive() { return "driving " + car.plate; }
}

// AGGREGATION — Team collects shared Players added from outside.
class Player {
    final String name;
    Player(String name) { this.name = name; }
}
class Team {
    private final java.util.List<Player> players = new java.util.ArrayList<>();
    void add(Player p) { players.add(p); } // shared; outlives the team
}

// COMPOSITION — House builds its own Rooms in the constructor.
class Room {
    final String name;
    Room(String name) { this.name = name; }
}
class House {
    private final java.util.List<Room> rooms = new java.util.ArrayList<>();
    House() {
        rooms.add(new Room("kitchen"));    // owned & exclusive
        rooms.add(new Room("bedroom"));
    }
    // no outside reference to the rooms → they die with the House
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "relationships.py",
        code: `# ASSOCIATION — Driver holds a reference passed in; does not own the Car.
class Car:
    def __init__(self, plate: str):
        self.plate = plate

class Driver:
    def __init__(self, car: Car):          # created elsewhere; not owned
        self._car = car
    def drive(self) -> str:
        return f"driving {self._car.plate}"

# AGGREGATION — Team collects shared Players added from outside.
class Player:
    def __init__(self, name: str):
        self.name = name

class Team:
    def __init__(self):
        self._players: list[Player] = []
    def add(self, p: Player) -> None:      # shared; outlives the team
        self._players.append(p)

# COMPOSITION — House builds its own Rooms in __init__.
class Room:
    def __init__(self, name: str):
        self.name = name

class House:
    def __init__(self):
        self._rooms = [Room("kitchen"), Room("bedroom")]  # owned & exclusive
        # no outside reference to the rooms → they die with the House`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "relationships.cpp",
        code: `#include <memory>
#include <string>
#include <vector>

struct Car    { std::string plate; };
struct Player { std::string name; };
struct Room   { std::string name; };

// ASSOCIATION — Driver keeps a NON-owning pointer to an external Car.
class Driver {
    Car* car;                          // points at something it does not own
public:
    explicit Driver(Car* c) : car(c) {}
    std::string drive() const { return "driving " + car->plate; }
};

// AGGREGATION — Team holds non-owning pointers to shared Players.
class Team {
    std::vector<Player*> players;      // raw pointers → shared, not owned
public:
    void add(Player* p) { players.push_back(p); } // outlives the team
};

// COMPOSITION — House OWNS its Rooms as member objects / unique_ptr.
class House {
    std::vector<std::unique_ptr<Room>> rooms;     // exclusive ownership
public:
    House() {
        rooms.push_back(std::make_unique<Room>(Room{"kitchen"}));
        rooms.push_back(std::make_unique<Room>(Room{"bedroom"}));
    }
    // ~House() frees the rooms automatically → destroyed with the House
};`,
      },
    ],

    whenToUse: [
      { type: "h", text: "How to choose — follow the lifecycle" },
      {
        type: "p",
        text: "Pick the relationship by answering one question: *if the whole is destroyed, should the part go with it?* If yes, model **composition** — let the owner create the part in its constructor and clean it up. If the part should keep living on its own, you want **aggregation** — accept the part from outside and just hold a reference. If there's no whole-part feeling at all and the two objects are peers that merely use each other, it's a plain **association**.",
      },
      {
        type: "p",
        text: "A second tell is *who creates the part*. If the owner builds it, that's a strong signal for composition. If the part is handed in from the caller (and might be shared with others), that's aggregation or association. When in doubt, prefer the looser relationship — it's far easier to tighten an aggregation into a composition later than to untangle an over-eager composition that's destroying objects other code still needs.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Composition is a promise to destroy",
        text: "Choosing composition means *you* are now responsible for the part's whole life — including ending it. If anything outside might still need that part, composition is the wrong call: you'll either delete data others depend on, or fight to keep it alive. Reach for composition only when the part truly cannot exist without the whole.",
      },
    ],

    tradeoffs: {
      pros: [
        "Modeling the right relationship makes ownership obvious — readers instantly know who creates and destroys each object.",
        "It prevents lifecycle bugs: composition cleans up its parts automatically; aggregation lets shared parts survive correctly.",
        "It clarifies your UML and your API — a hollow vs filled diamond tells the next engineer exactly how the parts are managed.",
        "Choosing aggregation where parts are shared avoids duplicating objects and keeps a single source of truth.",
      ],
      cons: [
        "Using composition where aggregation belonged — the owner deletes a part that other code still references, causing accidental destruction or dangling references.",
        "Leaking ownership — handing out a reference to an owned part lets outside code mutate or hold it past the owner's lifetime.",
        "Treating a plain association as ownership — destroying a peer object that was never yours to destroy.",
        "Lifecycle bugs from the reverse mistake: aggregating parts that should have been owned, so nobody ever cleans them up and they leak.",
      ],
    },

    furtherReading: [
      {
        label: "Wikipedia — Object composition",
        href: "https://en.wikipedia.org/wiki/Object_composition",
        note: "Covers composition and aggregation as whole-part relationships, with the lifecycle distinction front and center.",
        kind: "article",
      },
      {
        label: "Wikipedia — Class diagram",
        href: "https://en.wikipedia.org/wiki/Class_diagram",
        note: "The UML reference for the notation — plain line, hollow diamond, and filled diamond — used to draw these relationships.",
        kind: "article",
      },
      {
        label: "Wikipedia — Association (object-oriented programming)",
        href: "https://en.wikipedia.org/wiki/Association_(object-oriented_programming)",
        note: "Defines association as a peer link and frames aggregation and composition as its specialized whole-part forms.",
        kind: "article",
      },
      {
        label: "UML Distilled — Martin Fowler",
        note: "A concise, practical guide to UML that explains when a hollow vs filled diamond actually earns its keep in a design.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "ag-q1",
        question:
          "A `Team` holds a list of `Player` objects that were created elsewhere and can join other teams. Disband the team and the players still exist. Which relationship is this?",
        options: [
          { id: "a", label: "Composition — the team owns the players." },
          { id: "b", label: "Aggregation — shared parts that outlive the whole." },
          { id: "c", label: "Inheritance — a team is a kind of player." },
          { id: "d", label: "There is no relationship between them." },
        ],
        correctOptionId: "b",
        explanation:
          "The players are added from outside, are shared, and survive the team's destruction. That's aggregation — a has-a relationship drawn with a hollow diamond.",
      },
      {
        id: "ag-q2",
        question:
          "What is the single most reliable test to tell composition apart from aggregation?",
        options: [
          { id: "a", label: "Whether the relationship uses the word \"has-a\"." },
          { id: "b", label: "Whether the classes are in the same file." },
          { id: "c", label: "What happens to the part when the whole is destroyed." },
          { id: "d", label: "How many parts the whole contains." },
        ],
        correctOptionId: "c",
        explanation:
          "Both are \"has-a\" relationships, so the wording doesn't decide it. Ask what happens to the part when the whole dies: destroyed with it means composition; survives means aggregation.",
      },
      {
        id: "ag-q3",
        question:
          "In UML, which symbol on the whole's end of the line denotes composition (the part is created and destroyed with the whole)?",
        options: [
          { id: "a", label: "A filled (solid) diamond." },
          { id: "b", label: "A hollow (open) diamond." },
          { id: "c", label: "A plain line with no diamond." },
          { id: "d", label: "An open arrowhead." },
        ],
        correctOptionId: "a",
        explanation:
          "A filled diamond marks composition (owned, exclusive parts). A hollow diamond marks aggregation (shared parts), and a plain line marks a simple association.",
      },
      {
        id: "ag-q4",
        question:
          "A `Driver` is constructed with a `Car` that was created by other code. The driver only calls `car.drive()`. Destroying the driver should leave the car untouched. What is this?",
        options: [
          { id: "a", label: "Composition — the driver owns the car." },
          { id: "b", label: "Aggregation — the car is a part of the driver." },
          { id: "c", label: "A plain association — a peer link with independent lifecycles." },
          { id: "d", label: "A static relationship shared by all drivers." },
        ],
        correctOptionId: "c",
        explanation:
          "Neither object owns the other; the driver simply uses a car it was handed. Their lifecycles are independent, which is the definition of a plain association — a solid line in UML.",
      },
    ],
  },
};
