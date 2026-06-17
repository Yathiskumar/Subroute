import type { RoadmapLesson } from "@/lib/content/types";

export const requirementGathering: RoadmapLesson = {
  title: "Requirement Gathering & Clarifying Questions",
  oneLiner:
    "Never start coding a vague prompt — ask the clarifying questions that turn \"Design a parking lot\" into a bounded, agreed-upon spec, then design against THAT.",
  difficulty: "intermediate",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/requirement-gathering.html",
  content: {
    prototypeCaption:
      "The prompt at the top is deliberately vague: **\"Design a parking lot.\"** A bank of candidate clarifying questions sits grouped by category — **Functional scope · Actors · Scale · Constraints · Edge cases · Non-functional**. Click a question to *ask* it: a concrete answer appears and a line is appended to the **Requirements spec** panel. Watch **Ambiguity remaining** fall and **Scope locked** rise. A few questions are *rabbit holes* (marked red) that burn time without locking any scope. Hit **Show final spec** to reveal the complete locked specification, or **Reset** to start over.",

    overview: [
      {
        type: "p",
        text: "Before you draw a single class, you have to know *what you're actually building*. **Requirement gathering** is the deliberate act of turning a fuzzy, one-line prompt — \"Design a parking lot,\" \"Design a chess game,\" \"Design an elevator\" — into a concrete, bounded list of things the system must and must not do. The tool for that conversion is the **clarifying question**: a short, pointed question whose answer removes ambiguity and locks down a piece of scope.",
      },
      {
        type: "p",
        text: "Think of an architect handed the brief \"design me a house.\" A good one doesn't immediately reach for a pencil and start drawing walls. They ask: *How many people will live here? One storey or two? What's the budget? Do you need a garage? Wheelchair access?* Every answer constrains the design and rules out wrong directions. Starting to draw before those answers means building a beautiful house for the wrong family. Code is no different — a slick `ParkingLot` class that solves a problem nobody asked for is wasted work.",
      },
      {
        type: "p",
        text: "In an LLD interview this step is *the* difference between a senior and a junior signal. The interviewer hands you something vague *on purpose*. They are watching whether you charge in and code, or whether you pause, scope the problem, state your assumptions, and get agreement first. The clarification phase is not a warm-up before the real work — it *is* part of the work being assessed.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A vague prompt is not a spec — it's an *invitation to ask questions*. Spend the first few minutes turning ambiguity into an agreed, bounded list of requirements, and design against **that**, not against your guesses.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Why you must never code a vague prompt" },
      {
        type: "p",
        text: "\"Design a parking lot\" silently hides a dozen forks. Are there different spot sizes for motorcycles, cars, and trucks? Can one vehicle span several spots? Do we charge by the hour? Is there one entrance or many? Each fork leads to a *different* class model. If you pick answers in your head and start coding, you are gambling that your private assumptions match the interviewer's hidden ones — and when they don't, you've built the wrong system and have to unwind it under time pressure. Asking up front is cheaper than rewriting later, every single time.",
      },
      { type: "h", text: "The categories of clarifying questions" },
      {
        type: "p",
        text: "Strong candidates don't ask questions at random — they sweep through a mental *checklist of categories* so nothing important is missed. The six that matter most for LLD:",
      },
      {
        type: "ul",
        items: [
          "**Functional scope** — what must the system actually *do*? \"Should it handle payments, or just allocate spots?\" These answers become your core features and methods.",
          "**Actors & use cases** — *who* uses it and *how*? A driver, an attendant, an admin, a billing system — each actor implies entry points and permissions.",
          "**Scale & volume** — *how big*? How many spots, how many entrances, peak cars per hour? Scale decides whether a simple list is fine or you need indexed lookup.",
          "**Constraints & assumptions** — what's fixed or out of bounds? \"Assume one physical lot, no multi-site.\" These trim the design surface.",
          "**Edge cases** — what happens at the boundaries? Lot full, vehicle too large for any free spot, lost ticket, double-entry. Naming these shows design maturity.",
          "**Non-functional** — qualities, not features: concurrency (two cars at two gates at once), persistence (does state survive a restart?), and — interview-specific — the time budget for the discussion itself.",
        ],
      },
      { type: "h", text: "State your assumptions out loud and get buy-in" },
      {
        type: "p",
        text: "You won't get an answer to every question, and you shouldn't try — that stalls the conversation. The senior move is to *state an assumption explicitly and ask for confirmation*: \"I'll assume a single physical lot with three spot types — motorcycle, car, truck — and that one vehicle takes exactly one spot. Sound right?\" This does three things: it keeps you moving, it makes your reasoning visible, and it hands the interviewer a clean moment to correct you *before* it's baked into code. Silent assumptions are a trap; *spoken* assumptions are a skill.",
      },
      { type: "h", text: "Bound the scope — in scope vs. out of scope" },
      {
        type: "p",
        text: "Equally important to deciding what you *will* build is declaring what you *won't*. Writing down an explicit **in scope / out of scope / future work** split protects you from sprawl and signals discipline. A written requirements block at the start of an LLD answer might look like:",
      },
      {
        type: "code",
        language: "text",
        code: `=== ParkingLot — agreed requirements ===
IN SCOPE
  - Single physical lot, multiple floors
  - Spot types: motorcycle / car / truck
  - One vehicle occupies exactly one spot (no oversized spanning)
  - Park & unpark; find the nearest free spot of the right type
  - Charge by time on exit (hourly rate per spot type)

OUT OF SCOPE  (mention, then defer)
  - Multi-site / franchise network
  - Reservations & loyalty pricing
  - Real-time license-plate recognition

ASSUMPTIONS  (stated, awaiting buy-in)
  - At most a few thousand spots -> in-memory structures are fine
  - Single-process for now; concurrency handled with simple locking`,
      },
      {
        type: "p",
        text: "Notice how much *design* is already implied: \"find the nearest free spot of the right type\" hints at a `findSpot(VehicleType)` method; \"charge by time on exit\" hints at a `Ticket` with an entry timestamp and a pricing strategy. The spec is the skeleton the classes hang on.",
      },
      { type: "h", text: "The interview-specific angle" },
      {
        type: "p",
        text: "Treat the first 3–5 minutes as a dedicated requirements phase, not optional small talk. Interviewers explicitly score whether you *clarify before designing* — jumping straight to classes is one of the most common ways strong coders fail LLD rounds. Lead with functional scope and a couple of sharp scale questions, write the answers down where you both can see them, confirm your assumptions, and only *then* start modeling. The written spec also becomes your anchor: when you're deep in code and start to drift, you glance back at it.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Beware analysis paralysis and rabbit holes",
        text: "Clarifying is not interrogating. Drilling into the exact RGB of the ticket-printer LED, or debating tax law for parking fees, burns your time budget without locking any real scope — those are *rabbit holes*. Ask the few questions that change the *shape* of the design, note the rest as out of scope, and move on. The goal is a bounded spec, not a perfect one.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Where this sits in LLD",
        text: "Everything downstream depends on this step. Your **core entities**, your **class diagram**, your choice of **design patterns**, and your read of **coupling and cohesion** all flow from the requirements you locked here. Get the requirements wrong and a flawlessly executed design still solves the wrong problem.",
      },
    ],

    handsOn: [
      {
        title: "01 · Ask a high-value question from a category",
        body: "In the question bank, find the **Functional scope** group and click *\"Do we charge by time, or is parking free?\"*. A concrete answer appears, a new line is appended to the **Requirements spec** panel on the right, **Ambiguity remaining** ticks down, and **Scope locked** ticks up. The console narrates the ask. Sweep the other categories — **Scale**, **Actors**, **Constraints**, **Edge cases**, **Non-functional** — and watch the two meters converge as the spec fills in.",
      },
      {
        title: "02 · Step into a rabbit hole on purpose",
        body: "Now click one of the red-flagged *rabbit hole* questions, like *\"What font is printed on the ticket?\"*. Notice it turns **red**, the console warns you it was out of scope, the **Time spent** meter jumps, but **Ambiguity remaining** does *not* fall and nothing is added to the spec. That's the lesson: not every question is worth asking — some only cost you time.",
      },
      {
        title: "03 · Reveal the locked spec, then Reset",
        body: "Once you've asked the questions that matter, press **Show final spec** to reveal the complete, bounded specification — the *in scope / out of scope / assumptions* block you'd design against. Then hit **Reset** to clear the board and the console back to the original vague prompt, and try sweeping the categories in a different order.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "parking-lot.ts",
        code: `// Three clarifying questions, answered, become three design decisions:
//   Q1: "Can one vehicle occupy multiple spots?"   -> A: no, exactly one
//   Q2: "Are there spot types?"                     -> A: yes: motorcycle/car/truck
//   Q3: "Do we charge by time?"                     -> A: yes, hourly per type
//
// Those answers translate directly into the interface skeleton below.

enum VehicleType { Motorcycle, Car, Truck }   // from Q2

interface Ticket {
  spotId: string;
  vehicleType: VehicleType;
  entryTime: number;       // from Q3 — we need a clock-in
}

interface ParkingLot {
  // Q1: returns ONE spot id (not a list) — one vehicle, one spot
  // Q2: takes a VehicleType so it finds the right kind of spot
  park(type: VehicleType): Ticket | null;   // null when the lot is full (edge case)

  // Q3: cost depends on time elapsed since entryTime
  unpark(ticket: Ticket): number;           // returns fee owed
}

// Had Q1 been "yes, trucks span 2 spots", park() would return string[].
// Had Q3 been "parking is free", unpark() would return void.
// The questions literally shape the signatures.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "ParkingLot.java",
        code: `// Three clarifying questions, answered, become three design decisions:
//   Q1: "Can one vehicle occupy multiple spots?"   -> no, exactly one
//   Q2: "Are there spot types?"                     -> yes: MOTORCYCLE/CAR/TRUCK
//   Q3: "Do we charge by time?"                     -> yes, hourly per type

enum VehicleType { MOTORCYCLE, CAR, TRUCK }   // from Q2

class Ticket {
    String spotId;
    VehicleType vehicleType;
    long entryTime;        // from Q3 — clock-in timestamp
}

interface ParkingLot {
    // Q1: returns ONE Ticket (not a list) — one vehicle, one spot
    // Q2: takes a VehicleType so it finds the right kind of spot
    // returns null when the lot is full (edge case)
    Ticket park(VehicleType type);

    // Q3: fee depends on time elapsed since entryTime
    double unpark(Ticket ticket);
}

// Had Q1 been "trucks span 2 spots", park() would return List<String>.
// Had Q3 been "parking is free", unpark() would return void.
// The questions literally shape the signatures.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "parking_lot.py",
        code: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum
from typing import Optional


# Three clarifying questions, answered, become three design decisions:
#   Q1: "Can one vehicle occupy multiple spots?"   -> no, exactly one
#   Q2: "Are there spot types?"                     -> yes: motorcycle/car/truck
#   Q3: "Do we charge by time?"                     -> yes, hourly per type


class VehicleType(Enum):      # from Q2
    MOTORCYCLE = 1
    CAR = 2
    TRUCK = 3


@dataclass
class Ticket:
    spot_id: str
    vehicle_type: VehicleType
    entry_time: float          # from Q3 — clock-in timestamp


class ParkingLot(ABC):
    @abstractmethod
    def park(self, vtype: VehicleType) -> Optional[Ticket]:
        # Q1: returns ONE ticket (not a list) — one vehicle, one spot
        # Q2: takes a VehicleType to find the right kind of spot
        # returns None when the lot is full (edge case)
        ...

    @abstractmethod
    def unpark(self, ticket: Ticket) -> float:
        # Q3: fee depends on time elapsed since entry_time
        ...


# Had Q1 been "trucks span 2 spots", park() would return list[str].
# Had Q3 been "parking is free", unpark() would return None.
# The questions literally shape the signatures.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "parking_lot.cpp",
        code: `#include <cstdint>
#include <optional>
#include <string>

// Three clarifying questions, answered, become three design decisions:
//   Q1: "Can one vehicle occupy multiple spots?"   -> no, exactly one
//   Q2: "Are there spot types?"                     -> yes: motorcycle/car/truck
//   Q3: "Do we charge by time?"                     -> yes, hourly per type

enum class VehicleType { Motorcycle, Car, Truck };   // from Q2

struct Ticket {
    std::string spotId;
    VehicleType vehicleType;
    int64_t entryTime;        // from Q3 — clock-in timestamp
};

struct ParkingLot {
    // Q1: returns ONE Ticket (not a vector) — one vehicle, one spot
    // Q2: takes a VehicleType so it finds the right kind of spot
    // empty optional when the lot is full (edge case)
    virtual std::optional<Ticket> park(VehicleType type) = 0;

    // Q3: fee depends on time elapsed since entryTime
    virtual double unpark(const Ticket& ticket) = 0;

    virtual ~ParkingLot() = default;
};

// Had Q1 been "trucks span 2 spots", park() would return std::vector<std::string>.
// Had Q3 been "parking is free", unpark() would return void.
// The questions literally shape the signatures.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When to spend time clarifying" },
      {
        type: "p",
        text: "Run a deliberate requirements phase whenever the prompt is open-ended — which, in an LLD or system-design interview, is *always*. \"Design X\" with no further detail is a signal to clarify, not to code. The same applies on the job: a one-line ticket (\"add export to the dashboard\"), a feature kicked off from a hallway conversation, or any task where you find yourself guessing at intent. The fuzzier the brief and the higher the cost of building the wrong thing, the more the first few minutes of questions pay off.",
      },
      { type: "h", text: "When to stop and start building" },
      {
        type: "p",
        text: "Clarifying has diminishing returns. Once you have the functional scope, the key actors, a rough sense of scale, the hard constraints, and a written in-scope/out-of-scope line — *stop*. Confirm your assumptions, then start modeling. Chasing every remaining edge case before writing any code is its own failure mode: you run out of time with a perfect spec and no design. Lock the questions that change the *shape* of the solution; defer the rest as out of scope and revisit only if they bite.",
      },
    ],

    tradeoffs: {
      pros: [
        "You design the right system — clarifying up front beats discovering the misunderstanding after you've written the classes.",
        "It's a strong seniority signal — interviewers explicitly score whether you scope and confirm before coding.",
        "A written in-scope / out-of-scope spec bounds the problem and protects you from sprawl mid-design.",
        "Stated assumptions give the other side a clean moment to correct you before anything is baked in.",
        "The spec doubles as a design skeleton — answered questions map straight onto entities, methods, and signatures.",
      ],
      cons: [
        "Over-clarifying wastes the clock — analysis paralysis leaves you with a perfect spec and no design.",
        "Rabbit-hole questions feel productive but lock no real scope; telling them apart takes judgement.",
        "Too many low-value questions can read as stalling or indecision rather than rigor.",
        "Silent (unspoken) assumptions are worse than none — they hide the very mismatch clarifying is meant to catch.",
        "Requirements drift — a spec agreed early can go stale if the conversation evolves and you don't update it.",
      ],
    },

    furtherReading: [
      {
        label: "Wikipedia — Requirements engineering",
        href: "https://en.wikipedia.org/wiki/Requirements_engineering",
        note: "The formal discipline behind this skill: elicitation, analysis, specification, and validation of requirements as the first phase of building anything.",
        kind: "article",
      },
      {
        label: "Hello Interview — System Design Delivery Framework",
        href: "https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery",
        note: "A timed, step-by-step framework that puts a dedicated ~5-minute requirements phase (functional vs. non-functional) first — exactly the discipline this lesson teaches.",
        kind: "article",
      },
      {
        label: "interviewing.io — A Senior Engineer's Guide to the System Design Interview",
        href: "https://interviewing.io/guides/system-design-interview",
        note: "Argues for back-and-forth about constraints instead of assuming, with the classic \"design a photo-sharing service — but which kind?\" example of why clarifying matters.",
        kind: "article",
      },
      {
        label: "Martin Fowler — YAGNI (You Aren't Gonna Need It)",
        href: "https://martinfowler.com/bliki/Yagni.html",
        note: "The discipline behind drawing an out-of-scope line: don't build presumptive features you weren't asked for. Pairs directly with bounding scope.",
        kind: "article",
      },
      {
        label: "Head First Object-Oriented Analysis and Design — McLaughlin, Pollice & West",
        note: "A hands-on walkthrough of turning fuzzy customer requests into clear requirements and use cases before any class is drawn — the OOA&D version of this lesson.",
        kind: "book",
      },
      {
        label: "Software Requirements (3rd ed.) — Karl Wiegers & Joy Beatty",
        note: "The standard practitioner reference on eliciting, writing, and managing requirements; deep on the techniques behind good clarifying questions.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "rg-q1",
        question: "You're given the prompt \"Design a parking lot\" in an LLD interview. What should you do first?",
        options: [
          { id: "a", label: "Immediately start sketching the ParkingLot, Spot, and Vehicle classes to save time." },
          { id: "b", label: "Ask clarifying questions to bound the scope — spot types, charging model, scale — and write down the agreed requirements." },
          { id: "c", label: "Pick the most complex possible version and design for that to be safe." },
          { id: "d", label: "Ask the interviewer to give you a more detailed written specification before you begin." },
        ],
        correctOptionId: "b",
        explanation:
          "The prompt is vague on purpose. A dedicated requirements phase — asking high-value clarifying questions and writing down the answers — is what turns ambiguity into a bounded spec. Jumping straight to classes is one of the most common ways strong coders fail LLD rounds.",
      },
      {
        id: "rg-q2",
        question: "Which of these is a clarifying question that changes the SHAPE of the design (worth asking), rather than a rabbit hole?",
        options: [
          { id: "a", label: "\"What color is the ticket printer?\"" },
          { id: "b", label: "\"What font is printed on the parking ticket?\"" },
          { id: "c", label: "\"Can a single vehicle occupy more than one spot, or exactly one?\"" },
          { id: "d", label: "\"What brand of barrier gate is installed at the entrance?\"" },
        ],
        correctOptionId: "c",
        explanation:
          "Whether a vehicle takes one spot or several changes the return type of park() and the allocation logic — it reshapes the design. Ticket color, font, and gate brand lock no real scope; they're rabbit holes that only cost time.",
      },
      {
        id: "rg-q3",
        question: "You can't get an explicit answer to every question. What's the senior move when you have to fill a gap?",
        options: [
          { id: "a", label: "Silently pick an answer in your head and code against it." },
          { id: "b", label: "State the assumption out loud and ask the interviewer to confirm it, then keep moving." },
          { id: "c", label: "Stop and refuse to proceed until every detail is answered." },
          { id: "d", label: "Design for every possible interpretation at once so you can't be wrong." },
        ],
        correctOptionId: "b",
        explanation:
          "Stating an assumption explicitly and asking for buy-in keeps you moving, makes your reasoning visible, and gives the other side a clean chance to correct you before it's baked into code. Silent assumptions hide the exact mismatch clarifying is meant to catch.",
      },
      {
        id: "rg-q4",
        question: "Why is it valuable to write an explicit \"out of scope\" list, not just an \"in scope\" one?",
        options: [
          { id: "a", label: "It makes the spec document look longer and more thorough." },
          { id: "b", label: "It bounds the problem, prevents scope sprawl, and signals the discipline of not building presumptive features." },
          { id: "c", label: "It guarantees those features will never be needed later." },
          { id: "d", label: "It lets you skip asking any functional-scope questions." },
        ],
        correctOptionId: "b",
        explanation:
          "Declaring what you won't build is as important as what you will. It keeps the design from sprawling and shows YAGNI discipline — don't build presumptive features. It doesn't mean those features are gone forever; they're deferred as future work.",
      },
      {
        id: "rg-q5",
        question: "Which set best captures the major CATEGORIES of clarifying questions to sweep for an LLD problem?",
        options: [
          { id: "a", label: "Variable names, indentation style, file layout, and comment format." },
          { id: "b", label: "Only how many users there will be and how fast the system must run." },
          { id: "c", label: "Functional scope, actors & use cases, scale & volume, constraints & assumptions, edge cases, and non-functional qualities." },
          { id: "d", label: "The programming language, the IDE, the test framework, and the deployment target." },
        ],
        correctOptionId: "c",
        explanation:
          "Strong candidates sweep a checklist of categories so nothing important is missed: what it must do (functional scope), who uses it (actors), how big (scale), what's fixed (constraints/assumptions), what happens at the boundaries (edge cases), and qualities like concurrency and persistence (non-functional).",
      },
    ],
  },
};
