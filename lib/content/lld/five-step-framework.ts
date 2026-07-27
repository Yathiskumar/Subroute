import type { RoadmapLesson } from "@/lib/content/types";

export const fiveStepFramework: RoadmapLesson = {
  title: "A repeatable 5-step framework",
  oneLiner:
    "In a machine coding round you get one problem, one hour, and one rule: it must run at the end. The framework is the order you do things in — **clarify → entities → API → diagram → code** — so you spend the hour building instead of guessing. Same five steps for a parking lot, a vending machine, or Splitwise. Only the nouns change.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/five-step-framework.html",
  content: {
    prototypeCaption:
      "A live **60-minute machine coding round** — *Design a Parking Lot*. Work the five steps on the left; the design document on the right builds itself as you go: scope lines, class chips, method signatures, a wired class diagram, then code. Every good pick spends its budgeted minutes; every **rabbit hole** (which database? what colour is the UI?) costs you *+2 minutes of rework* on the clock. Finish all five and ▶ **Run the demo** prints working output at minute 60. Or hit **⏭ Skip the plan, just code** to see the other ending: the clock jumps straight to 60, the board fills with ✖, and nothing runs.",

    overview: [
      {
        type: "p",
        text: "A **machine coding round** is simple to describe and hard to survive: you get one problem statement (*\"design a parking lot\"*), 60–90 minutes, and at the end your code has to **actually run**. No slides, no hand-waving. Most people fail it the same way — they read the problem, feel the clock, and start typing immediately. Twenty minutes later they realise they modelled the wrong thing, and the rewrite eats the round.",
      },
      {
        type: "p",
        text: "The fix is boring and it always works: **do the same five steps, in the same order, every single time.** Clarify the problem, name the entities, fix the API, draw the class diagram, then code. Roughly 20 minutes of thinking buys you 40 minutes of typing that you never have to undo.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole framework in one line",
        text: "**Clarify → Entities → API → Class diagram → Code & demo.** Each step produces something you can point at, and each one feeds the next: the questions decide the nouns, the nouns become classes, the classes get methods, the methods get wired, and the wiring gets typed out.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Why an order helps at all",
        text: "Every step removes decisions from the step after it. By the time you start typing, you already know what classes exist, what they're called, what methods they have, and who holds whom — so coding becomes transcription instead of design. That's why it feels *faster*, not slower.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Step 1 · Clarify — about 5 minutes" },
      {
        type: "p",
        text: "The problem statement is deliberately vague. Your first job is to shrink it. Ask a handful of short questions and write the answers down where you can see them — that written list is your **scope**, and it is the thing you'll point at later when you decide *not* to build something.",
      },
      {
        type: "ul",
        items: [
          "**How big?** — one floor or many, 30 spots or 30,000. This decides whether a plain list is fine.",
          "**What kinds?** — bike, car, truck. Types usually turn into an enum and a sizing rule.",
          "**What are the rules?** — how the fee is charged, what happens when the lot is full.",
          "**What's out?** — payments, login, UI, persistence. A question that *removes* work is the most valuable one you can ask.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The two questions that waste your clock",
        text: "*\"Which database?\"* and *\"What should the UI look like?\"* — in a 60-minute round the answers are always **in-memory** and **a `main()` demo**. Assume them out loud in one sentence and move on. Time spent in a rabbit hole is time not spent on code that runs.",
      },
      { type: "h", text: "Step 2 · Entities — about 8 minutes" },
      {
        type: "p",
        text: "Read your clarified statement and **underline the nouns**. Nouns are candidate classes; verbs are candidate methods. *Parking lot, spot, vehicle, ticket* → four classes. *Park, unpark, calculate fee* → three methods that will live on those classes.",
      },
      {
        type: "p",
        text: "Keep the names the same as the words the interviewer used. If they said \"ticket\", your class is `Ticket` — not `ParkingReceiptEntity`. And don't invent a class that isn't in the problem: `ParkingLotManagerFactoryImpl` is a red flag, not a design.",
      },
      { type: "h", text: "Step 3 · API — about 10 minutes" },
      {
        type: "p",
        text: "Before any implementation, write the **method signatures a caller would use**. Just the shapes — name, parameters, return type. Three or four of them usually describe the entire system:",
      },
      {
        type: "code",
        language: "text",
        code: `lot.park(vehicle)            -> Ticket
lot.unpark(ticket)           -> Fee
lot.availableSpots(type)     -> int`,
      },
      {
        type: "p",
        text: "This is the step people skip, and it's the one that saves the most time. Once the signatures are fixed, every later decision has an answer: *does this method belong here? does this class need that field?* — you check against the API. Getters and setters are **not** the API; they're plumbing you add when a method actually needs them.",
      },
      { type: "h", text: "Step 4 · Class diagram — about 7 minutes" },
      {
        type: "p",
        text: "Now connect the boxes. For each pair of classes ask one question: **has-a or is-a?** A `ParkingLot` *has* many `ParkingSpot`s. A `ParkingSpot` *holds* one `Vehicle` (or none). A `Car` *is a* `Vehicle`. That's it — three relationships and the design is settled.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The classic wrong turn",
        text: "Reaching for `extends` when you mean \"has a\". A `ParkingSpot` is **not** a kind of `Vehicle` just because it holds one. Inheritance is only for *is-a*; everything else is a field. See [[composition-vs-inheritance]].",
      },
      {
        type: "p",
        text: "This is also the only moment to consider a design pattern — and only if a **force in the problem** demands it. \"Fees are hourly *or* flat *or* weekend rates\" is a real force → [[strategy]]. \"A spot's state drives what you can do to it\" → [[state]]. No force, no pattern: a plain method is the right answer far more often than a pattern is. See [[pattern-overuse-anti-patterns]].",
      },
      { type: "h", text: "Step 5 · Code & demo — the remaining ~30 minutes" },
      {
        type: "p",
        text: "Code in an order that keeps you demo-able at every moment, so that whenever the timer stops you have something that runs:",
      },
      {
        type: "ol",
        items: [
          "**Skeletons** — the classes and enums from step 2, fields only. Ten minutes of typing, no thinking.",
          "**The happy path** — `park()` end to end. No edge cases yet.",
          "**The return trip** — `unpark()` and the fee. Now the loop closes.",
          "**A `main()` demo** — park two vehicles, unpark one, print the result. This *is* your test; it's what you run in front of the interviewer.",
          "**Edge cases, if time is left** — lot full, invalid ticket, wrong vehicle type.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "Working beats complete",
        text: "A small system that **runs** scores far higher than a large one that doesn't compile. If you're at minute 50 with an unfinished feature, stub it, get the demo green, and *say* what you'd do next — interviewers grade the thinking too.",
      },
      { type: "h", text: "What the interviewer is actually grading" },
      {
        type: "ul",
        items: [
          "**Does it run?** — the one non-negotiable.",
          "**Is the model sensible?** — do the class names match the domain, and does behaviour live inside the class that owns the data?",
          "**Can it be extended?** — if they say *\"now add electric-vehicle charging\"*, how many files do you touch? One new class is a great answer; a giant `switch` you have to edit is a poor one.",
          "**Is it readable?** — small methods, clear names, no dead code. Nobody is grading cleverness.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Ask the questions that shrink the problem",
        body: "In the prototype, step 1 gives you six questions. Pick three that pin down scope — how many spots, which vehicle types, how the fee works, whether payments are real. Each one lands as a line in the Scope section on the right, and the clock advances by its budgeted minutes. Notice that \"Real payment gateway?\" is worth asking precisely because the answer removes work.",
      },
      {
        title: "02 · Step into a rabbit hole on purpose",
        body: "Now click \"Which database?\" or \"What should the UI look like?\". The chip shakes red, nothing lands on the board, and the clock jumps +2 minutes with a rework counter. That's the whole lesson about clarifying: not every question is worth 2 minutes of a 60-minute round. Assume in-memory, assume a main() demo, keep moving.",
      },
      {
        title: "03 · Run the round end to end — then skip it",
        body: "Work through entities → API → diagram → code. Watch the right-hand board fill in: class chips, then method signatures, then real lines connecting ParkingLot ◆— ParkingSpot — Vehicle. Hit ▶ Run the demo and the output prints at minute 60. Now press ↺ Reset and instead hit ⏭ Skip the plan, just code: the clock jumps straight to 60, every section fills with ✖, and there's no demo to show. Same hour, opposite ending.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "parking-lot.ts",
        code: `// STEP 1 · scope (write it down, it decides everything below)
//   1 floor · 30 spots · Bike|Car|Truck · ₹/hour paid at exit
//   out of scope: payments, UI, database

// STEP 2 · entities — the nouns of the problem
enum VehicleType { BIKE, CAR, TRUCK }

class Vehicle {
  constructor(readonly plate: string, readonly type: VehicleType) {}
}

class ParkingSpot {
  vehicle: Vehicle | null = null;                 // has-a, not is-a
  constructor(readonly id: string, readonly type: VehicleType) {}
  get isFree() { return this.vehicle === null; }
}

class Ticket {
  constructor(
    readonly id: string,
    readonly spot: ParkingSpot,                   // issued FOR a spot
    readonly inTime: number,
  ) {}
}

// STEP 3 · API — three methods describe the whole system
class ParkingLot {
  private seq = 0;
  constructor(private spots: ParkingSpot[], private ratePerHour = 30) {}

  park(vehicle: Vehicle): Ticket {                // happy path first
    const spot = this.spots.find(s => s.isFree && s.type === vehicle.type);
    if (!spot) throw new Error("lot full for " + VehicleType[vehicle.type]);
    spot.vehicle = vehicle;
    return new Ticket("T" + ++this.seq, spot, Date.now());
  }

  unpark(ticket: Ticket): number {                // the return trip
    const hours = Math.max(1, Math.ceil((Date.now() - ticket.inTime) / 3_600_000));
    ticket.spot.vehicle = null;                   // free the spot
    return hours * this.ratePerHour;              // the fee
  }

  availableSpots(type: VehicleType): number {
    return this.spots.filter(s => s.isFree && s.type === type).length;
  }
}

// STEP 5 · main() demo — this is what you RUN for the interviewer
const spots = [new ParkingSpot("S1", VehicleType.CAR), new ParkingSpot("S2", VehicleType.BIKE)];
const lot = new ParkingLot(spots);

const t1 = lot.park(new Vehicle("KA-01", VehicleType.CAR));
console.log("parked ->", t1.id, t1.spot.id);
console.log("fee    ->", lot.unpark(t1));
console.log("free   ->", lot.availableSpots(VehicleType.CAR));`,
      },
      {
        label: "Java",
        language: "java",
        filename: "ParkingLot.java",
        code: `import java.util.*;

// STEP 1 · scope: 1 floor · 30 spots · BIKE|CAR|TRUCK · per-hour fee at exit
//          out of scope: payments, UI, database

// STEP 2 · entities — the nouns of the problem
enum VehicleType { BIKE, CAR, TRUCK }

class Vehicle {
    final String plate; final VehicleType type;
    Vehicle(String plate, VehicleType type) { this.plate = plate; this.type = type; }
}

class ParkingSpot {
    final String id; final VehicleType type;
    Vehicle vehicle;                                   // has-a, not is-a
    ParkingSpot(String id, VehicleType type) { this.id = id; this.type = type; }
    boolean isFree() { return vehicle == null; }
}

class Ticket {
    final String id; final ParkingSpot spot; final long inTime;
    Ticket(String id, ParkingSpot spot, long inTime) {
        this.id = id; this.spot = spot; this.inTime = inTime;
    }
}

// STEP 3 · API — three methods describe the whole system
class ParkingLot {
    private final List<ParkingSpot> spots;
    private final int ratePerHour;
    private int seq = 0;

    ParkingLot(List<ParkingSpot> spots, int ratePerHour) {
        this.spots = spots; this.ratePerHour = ratePerHour;
    }

    Ticket park(Vehicle v) {                            // happy path first
        for (ParkingSpot s : spots) {
            if (s.isFree() && s.type == v.type) {
                s.vehicle = v;
                return new Ticket("T" + (++seq), s, System.currentTimeMillis());
            }
        }
        throw new IllegalStateException("lot full for " + v.type);
    }

    int unpark(Ticket t) {                              // the return trip
        long hours = Math.max(1, (System.currentTimeMillis() - t.inTime) / 3_600_000);
        t.spot.vehicle = null;                          // free the spot
        return (int) hours * ratePerHour;               // the fee
    }

    long availableSpots(VehicleType type) {
        return spots.stream().filter(s -> s.isFree() && s.type == type).count();
    }
}

// STEP 5 · main() demo — this is what you RUN for the interviewer
public class Demo {
    public static void main(String[] args) {
        ParkingLot lot = new ParkingLot(new ArrayList<>(List.of(
                new ParkingSpot("S1", VehicleType.CAR),
                new ParkingSpot("S2", VehicleType.BIKE))), 30);

        Ticket t1 = lot.park(new Vehicle("KA-01", VehicleType.CAR));
        System.out.println("parked -> " + t1.id + " " + t1.spot.id);
        System.out.println("fee    -> " + lot.unpark(t1));
        System.out.println("free   -> " + lot.availableSpots(VehicleType.CAR));
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "parking_lot.py",
        code: `import time
from dataclasses import dataclass, field
from enum import Enum

# STEP 1 · scope: 1 floor · 30 spots · BIKE|CAR|TRUCK · per-hour fee at exit
#          out of scope: payments, UI, database


# STEP 2 · entities — the nouns of the problem
class VehicleType(Enum):
    BIKE, CAR, TRUCK = 1, 2, 3


@dataclass
class Vehicle:
    plate: str
    type: VehicleType


@dataclass
class ParkingSpot:
    id: str
    type: VehicleType
    vehicle: Vehicle | None = None       # has-a, not is-a

    @property
    def is_free(self) -> bool:
        return self.vehicle is None


@dataclass
class Ticket:
    id: str
    spot: ParkingSpot                     # issued FOR a spot
    in_time: float


# STEP 3 · API — three methods describe the whole system
class ParkingLot:
    def __init__(self, spots: list[ParkingSpot], rate_per_hour: int = 30) -> None:
        self._spots = spots
        self._rate = rate_per_hour
        self._seq = 0

    def park(self, vehicle: Vehicle) -> Ticket:            # happy path first
        for spot in self._spots:
            if spot.is_free and spot.type is vehicle.type:
                spot.vehicle = vehicle
                self._seq += 1
                return Ticket(f"T{self._seq}", spot, time.time())
        raise RuntimeError(f"lot full for {vehicle.type.name}")

    def unpark(self, ticket: Ticket) -> int:               # the return trip
        hours = max(1, int((time.time() - ticket.in_time) // 3600))
        ticket.spot.vehicle = None                         # free the spot
        return hours * self._rate                          # the fee

    def available_spots(self, type_: VehicleType) -> int:
        return sum(1 for s in self._spots if s.is_free and s.type is type_)


# STEP 5 · main() demo — this is what you RUN for the interviewer
if __name__ == "__main__":
    lot = ParkingLot([ParkingSpot("S1", VehicleType.CAR),
                      ParkingSpot("S2", VehicleType.BIKE)])

    t1 = lot.park(Vehicle("KA-01", VehicleType.CAR))
    print("parked ->", t1.id, t1.spot.id)
    print("fee    ->", lot.unpark(t1))
    print("free   ->", lot.available_spots(VehicleType.CAR))`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "parking_lot.cpp",
        code: `#include <algorithm>
#include <chrono>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

// STEP 1 · scope: 1 floor · 30 spots · BIKE|CAR|TRUCK · per-hour fee at exit
//          out of scope: payments, UI, database

// STEP 2 · entities — the nouns of the problem
enum class VehicleType { BIKE, CAR, TRUCK };

struct Vehicle {
    std::string plate;
    VehicleType type;
};

struct ParkingSpot {
    std::string id;
    VehicleType type;
    const Vehicle* vehicle = nullptr;        // has-a, not is-a
    bool isFree() const { return vehicle == nullptr; }
};

struct Ticket {
    std::string id;
    ParkingSpot* spot;                       // issued FOR a spot
    long inTime;
};

static long nowSeconds() {
    using namespace std::chrono;
    return duration_cast<seconds>(system_clock::now().time_since_epoch()).count();
}

// STEP 3 · API — three methods describe the whole system
class ParkingLot {
    std::vector<ParkingSpot> spots;
    int ratePerHour;
    int seq = 0;

public:
    ParkingLot(std::vector<ParkingSpot> s, int rate) : spots(std::move(s)), ratePerHour(rate) {}

    Ticket park(const Vehicle& v) {                       // happy path first
        for (auto& s : spots) {
            if (s.isFree() && s.type == v.type) {
                s.vehicle = &v;
                return Ticket{"T" + std::to_string(++seq), &s, nowSeconds()};
            }
        }
        throw std::runtime_error("lot full");
    }

    int unpark(const Ticket& t) {                         // the return trip
        long hours = std::max(1L, (nowSeconds() - t.inTime) / 3600);
        t.spot->vehicle = nullptr;                        // free the spot
        return static_cast<int>(hours) * ratePerHour;     // the fee
    }

    long availableSpots(VehicleType type) const {
        return std::count_if(spots.begin(), spots.end(), [&](const ParkingSpot& s) {
            return s.isFree() && s.type == type;
        });
    }
};

// STEP 5 · main() demo — this is what you RUN for the interviewer
int main() {
    ParkingLot lot({{"S1", VehicleType::CAR}, {"S2", VehicleType::BIKE}}, 30);

    Vehicle car{"KA-01", VehicleType::CAR};
    Ticket t1 = lot.park(car);
    std::cout << "parked -> " << t1.id << " " << t1.spot->id << "\\n";
    std::cout << "fee    -> " << lot.unpark(t1) << "\\n";
    std::cout << "free   -> " << lot.availableSpots(VehicleType::CAR) << "\\n";
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Use the framework when..." },
      {
        type: "ul",
        items: [
          "**You're in a timed machine coding round** — this is exactly what it was built for. 60–90 minutes, one problem, code that must run.",
          "**You're in an object-oriented design interview** — the same five steps, minus the typing. You just talk through steps 1–4 and sketch instead of code.",
          "**You're starting any small feature at work** — clarify, name the things, agree the API, sketch the wiring, then build. It scales down fine.",
        ],
      },
      { type: "h", text: "Bend it when..." },
      {
        type: "ul",
        items: [
          "**The interviewer hands you the entities already** — if the prompt lists the classes, steps 1–2 shrink to two minutes. Don't perform the ritual, use the time saved on code.",
          "**The problem is one algorithm, not a system** — an LRU cache is 80% data structure. Clarify, agree the API, and start coding; a class diagram of two boxes helps nobody.",
          "**You're at minute 40 with nothing running** — abandon polish, get `main()` green. A demo that works beats a diagram that's beautiful.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "No rewrites — the expensive mistake (wrong model discovered at minute 40) is caught at minute 10 when it costs nothing.",
        "The clock stops being scary — each step has a budget, so you always know whether you're ahead or behind.",
        "You always have something to show — coding happy-path-first means there's a running demo at every moment after minute 35.",
        "It's problem-agnostic — parking lot, vending machine, Splitwise, chess: the same five steps, only the nouns change.",
        "It makes your thinking visible — the interviewer sees scope, entities and an API, which is most of what they're grading.",
      ],
      cons: [
        "It costs ~20 minutes up front, which feels wrong when the clock is running and your hands want to type.",
        "Done rigidly it wastes time — a two-box class diagram for an LRU cache is ceremony, not design.",
        "Step 4 tempts you into patterns — the diagram invites a Strategy or a Factory that the problem never asked for.",
        "Steps 1–4 can drift long — without a per-step budget, clarifying quietly eats the coding time it was meant to protect.",
      ],
    },

    furtherReading: [
      {
        label: "awesome-low-level-design",
        href: "https://github.com/ashishps1/awesome-low-level-design",
        note: "The best single starting point: LLD concepts, the interview approach, and ~30 worked machine-coding problems (parking lot, vending machine, Splitwise) with full code. Use it to practise steps 2–5 on real prompts.",
        kind: "docs",
      },
      {
        label: "Grokking the Object Oriented Design Interview (open notes)",
        href: "https://github.com/tssovi/grokking-the-object-oriented-design-interview",
        note: "Case studies that follow this exact flow — requirements, use cases, class diagram, then code. Read two or three to see how the same five steps land on different problems.",
        kind: "article",
      },
      {
        label: "Low Level Design Primer",
        href: "https://github.com/prasadgujar/low-level-design-primer",
        note: "A structured LLD study guide: OOD basics, SOLID, UML, and a problem list with solutions. Good for filling gaps the framework assumes you already have.",
        kind: "docs",
      },
      {
        label: "Head First Object-Oriented Analysis and Design",
        href: "https://www.goodreads.com/book/show/43000.Head_First_Object_Oriented_Analysis_and_Design",
        note: "The friendliest book on steps 1–4: gathering requirements, finding the nouns, and turning them into a class model. Very beginner-oriented, heavy on worked examples.",
        kind: "book",
      },
      {
        label: "UML class diagrams — SourceMaking",
        href: "https://sourcemaking.com/uml/modeling-it-systems/structural-view/class-diagram",
        note: "Reference for step 4: association, aggregation, composition and inheritance notation, so your diamonds and arrows point the right way.",
        kind: "docs",
      },
      {
        label: "AnemicDomainModel — Martin Fowler",
        href: "https://martinfowler.com/bliki/AnemicDomainModel.html",
        note: "Names the most common machine-coding smell: classes that are only fields, with all the behaviour piled into one service class. Read it before step 5 so you put logic where the data lives.",
        kind: "article",
      },
      {
        label: "Design pattern catalog — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/catalog",
        note: "For step 4 only, and only when a real force in the problem demands it. Skim it to recognise patterns fast — not to add one to every design.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "five-step-framework-q1",
        question: "What are the five steps, in order?",
        options: [
          { id: "a", label: "Clarify → entities → API → class diagram → code & demo." },
          { id: "b", label: "Code → test → refactor → document → deploy." },
          { id: "c", label: "Class diagram → code → clarify → entities → API." },
          { id: "d", label: "Pick a design pattern → build classes around it → clarify later." },
        ],
        correctOptionId: "a",
        explanation:
          "Each step feeds the next: the clarifying questions decide the nouns, the nouns become classes, the classes get method signatures, the signatures get wired into a diagram, and only then do you type. Starting anywhere else means guessing at information you could simply have asked for.",
      },
      {
        id: "five-step-framework-q2",
        question: "In a 60-minute round, what is the best use of the first five minutes?",
        options: [
          { id: "a", label: "Ask a few short questions that pin down scope — sizes, types, rules, and what's explicitly out." },
          { id: "b", label: "Start typing the ParkingLot class immediately; the clock is running." },
          { id: "c", label: "Decide which design patterns you'll use before knowing the requirements." },
          { id: "d", label: "Set up a database schema and a build pipeline." },
        ],
        correctOptionId: "a",
        explanation:
          "Those five minutes remove the ambiguity that causes rewrites later. Typing first is the classic failure — you discover the wrong model at minute 40. Patterns can't be chosen before requirements exist, and databases/pipelines are out of scope in a machine coding round (assume in-memory).",
      },
      {
        id: "five-step-framework-q3",
        question: "You ask the interviewer \"which database should I use?\". What has that question cost you?",
        options: [
          { id: "a", label: "Time — in a timed round storage is always in-memory, so it's a rabbit hole you should assume past." },
          { id: "b", label: "Nothing; every question is equally valuable." },
          { id: "c", label: "Points for not knowing SQL." },
          { id: "d", label: "The whole design, since persistence must be modelled first." },
        ],
        correctOptionId: "a",
        explanation:
          "Good clarifying questions shrink the problem (how many spots? which vehicle types? is payment real?). Questions whose answer is always the same in a 60-minute round — database, UI, deployment — just burn clock. State the assumption in one sentence and move on.",
      },
      {
        id: "five-step-framework-q4",
        question: "In step 2 you're pulling entities out of the statement. Which of these should NOT become a class?",
        options: [
          { id: "a", label: "\"park\" — it's a verb, so it becomes a method on ParkingLot." },
          { id: "b", label: "\"ticket\" — a noun in the problem." },
          { id: "c", label: "\"parking spot\" — a noun in the problem." },
          { id: "d", label: "\"vehicle\" — a noun in the problem." },
        ],
        correctOptionId: "a",
        explanation:
          "The rule of thumb for step 2 is nouns → classes, verbs → methods. \"Park\" is something the lot does, so it belongs as `lot.park(vehicle)`. Also avoid classes the problem never mentions — an invented `ParkingLotManagerFactoryImpl` is a warning sign, not a design.",
      },
      {
        id: "five-step-framework-q5",
        question: "In step 4 you need to relate ParkingSpot and Vehicle. Which is right?",
        options: [
          { id: "a", label: "A spot HAS a vehicle (a nullable field) — has-a, so it's composition, not inheritance." },
          { id: "b", label: "ParkingSpot should extend Vehicle, since a spot always deals with vehicles." },
          { id: "c", label: "Vehicle should extend ParkingSpot, so it inherits the spot id." },
          { id: "d", label: "They shouldn't be related at all; keep every class independent." },
        ],
        correctOptionId: "a",
        explanation:
          "Ask \"is-a or has-a?\" for every pair. A spot is not a kind of vehicle and a vehicle is not a kind of spot, so `extends` in either direction is wrong — the spot simply holds a reference (null when free). Inheritance is reserved for genuine is-a, like Car extends Vehicle.",
      },
      {
        id: "five-step-framework-q6",
        question: "It's minute 50, and your extra features aren't finished. What's the best move?",
        options: [
          { id: "a", label: "Stub the unfinished parts, get the main() demo running, and say out loud what you'd do next." },
          { id: "b", label: "Keep building the missing features — an incomplete system scores zero anyway." },
          { id: "c", label: "Start writing unit tests for every getter to show test discipline." },
          { id: "d", label: "Refactor everything into design patterns to show breadth." },
        ],
        correctOptionId: "a",
        explanation:
          "The one non-negotiable in a machine coding round is that the code runs. A small working system beats a large broken one, and explaining what you'd add next still earns credit for the thinking. Getter tests and last-minute pattern refactors spend the exact time you no longer have.",
      },
    ],
  },
};
