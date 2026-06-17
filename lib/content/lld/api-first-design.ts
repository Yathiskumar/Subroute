import type { RoadmapLesson } from "@/lib/content/types";

export const apiFirstDesign: RoadmapLesson = {
  title: "Designing the API First",
  oneLiner:
    "Agree on the public contract — the method signatures a caller sees — before you write a line of implementation; design from the outside in, not the inside out.",
  difficulty: "intermediate",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/api-first-design.html",
  content: {
    prototypeCaption:
      "Pick the design decisions for a single `park(vehicle)` operation — its **return type**, **error-handling style**, **parameter style**, and **method name** — and watch the **client code** a caller would write re-render live on the right, alongside a **caller-experience score** with concrete pros and cons. Choose `return null` and it warns about forgotten null checks; choose a `Result` type and errors become explicit. Hit **Snap to clean API** to see the ideal contract, or **Reset** to start awkward again.",

    overview: [
      {
        type: "p",
        text: "Designing the API first means deciding what the *caller* sees — the public method signatures, the interface, the contract — *before* you write any implementation. You write down `book(request): Result<Ticket>` and agree on it, and only then do you fill in the body. It flips the usual habit of coding the logic first and letting whatever methods fall out become the \"API\" by accident. Here **API** means the public face of any class or module — its methods, parameters, and return types — not just a web or REST endpoint.",
      },
      {
        type: "p",
        text: "Think of wiring a building. You don't invent a brand-new socket shape in every room and then hope appliances fit. Everyone agrees on the *shape of the socket* first — the contract — and then electricians wire behind the wall and appliance makers build plugs, independently, confident the two will meet. The socket is the API: a small, stable, public shape that hides an ocean of wiring nobody calling it needs to think about. Design that shape on purpose, up front, and everything that plugs into it gets simpler.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Design the **contract** — the public signatures a caller sees — *before* the implementation: decide what plugs into the socket before you wire the wall.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Design from the caller's perspective" },
      {
        type: "p",
        text: "The single most useful trick is to *write the client code you wish you could call first*, before any implementation exists. Pretend the class is already done and write the few lines that use it: `const ticket = lot.park(car);`. Does that read cleanly? Is it obvious what comes back, and what happens when the lot is full? You're designing the API by *consuming* it, which is the only perspective that matters — an API is judged by the people who call it, not by the person who wrote it. This is the heart of *API-first* (sometimes called *consumer-driven* or *outside-in*) design.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Write the usage code first",
        text: "Before implementing anything, write three or four lines of *example client code* that call the method as you wish it existed. If those lines are awkward to write, the signature is wrong — fix it now, while it costs nothing.",
      },
      { type: "h", text: "What a good signature communicates" },
      {
        type: "p",
        text: "A method signature is a tiny contract that should answer four questions at a glance: *what does it do* (the name), *what does it need* (the parameters), *what does it give back* (the return type), and *how can it fail* (the error style). A signature like `boolean doIt(int a, int b, boolean flag)` answers none of them — you have to read the body to learn anything. `Result<Ticket> park(Vehicle vehicle)` answers all four: it parks a vehicle, it needs a vehicle, it returns a ticket, and the `Result` wrapper says it can fail in a way you must handle. Good signatures are *intention-revealing*: the name and types tell the story so the body doesn't have to.",
      },
      { type: "h", text: "The decisions you surface early" },
      {
        type: "p",
        text: "Designing the API first forces a handful of decisions into the open *before* they harden into accidents:",
      },
      {
        type: "ul",
        items: [
          "**Return type** — `void` (the caller learns nothing), a raw `Ticket` (fine on the happy path, but what about failure?), or a `Result<Ticket>` / `Optional<Ticket>` that makes \"might not produce one\" explicit in the type.",
          "**Error-handling style** — *throw an exception*, *return null*, *return a* `Result` */* `Optional`, or *return an error code*. Pick one deliberately and be consistent; mixing them is what makes a surface miserable to call.",
          "**Naming** — vague verbs like `process()`, `handle()`, `doIt()` hide intent; `park(vehicle)`, `cancelBooking(id)`, `reserveSeat(...)` reveal it.",
          "**Parameter shape** — a long positional list (`park(plate, color, height, isElectric, level)`) is easy to mis-order; a single **parameter object** (`park(ParkRequest)`) is self-documenting and grows without breaking callers.",
          "**Command–query separation** — a method should either *do* something (a command, often `void` or returning a receipt) or *answer* something (a query, with no side effects), not quietly both.",
          "**Idempotency** — can the caller safely retry `park` after a timeout without double-parking? Designing the contract is where you decide and document that.",
          "**Minimal surface** — expose the *fewest* public members that let callers do their job; every extra public method is a promise you must keep forever.",
        ],
      },
      { type: "h", text: "Keep the surface minimal — hide the internals" },
      {
        type: "p",
        text: "The public API is a *promise*: once a caller depends on a method, you can't change it freely without breaking them. So the contract should expose intent and hide mechanism — this is **encapsulation** and **abstraction** in action. A clean `park(vehicle)` says nothing about *how* spots are tracked, whether there's a database, or what an `int spotIndex` means internally. The moment a signature leaks `HashMap<String,Integer> spots` or a `Connection conn` parameter, the caller is coupled to your implementation, and you've lost the freedom to change it. A *deep* module — a small interface over a lot of hidden functionality — is the goal; a *shallow* one that exposes its guts is a liability.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't leak implementation or persistence concerns",
        text: "Never let database rows, ORM entities, connection objects, internal indices, or framework types appear in your public signatures. `save(Connection c, Row r)` welds every caller to your storage choice. The contract should speak the *domain's* language (`book(request): Result<Ticket>`), not the wiring's.",
      },
      { type: "h", text: "Contracts let implementations be swapped (DIP)" },
      {
        type: "p",
        text: "When the API is an *interface* rather than a concrete class, you gain the ability to swap what's behind it. `interface ParkingLot { park(v): Result<Ticket>; }` can be backed by an in-memory lot today and a distributed one tomorrow, and no caller changes. High-level code depends on the abstraction, not the concrete type — that's the **Dependency Inversion Principle**. Designing the API first naturally produces these thin contracts, because you're describing *what* the caller needs, not *how* you'll provide it.",
      },
      { type: "h", text: "Why agreeing first unblocks everyone" },
      {
        type: "p",
        text: "Once the contract is agreed, work *parallelizes*. One engineer builds the real implementation behind the interface; another builds the caller against a *mock* of that same interface; a third writes tests that assert the contract's behavior. None of them wait on each other, because the interface is the shared truth. Testing gets easier for the same reason: you mock against the interface, verify the caller handles every documented outcome (including the failure cases the `Result` type forces it to acknowledge), and you're done. A contract designed first is a coordination point; an API that fell out of the implementation is a surprise everyone discovers late.",
      },
      { type: "h", text: "Leaky vs. clean: a contrast" },
      {
        type: "p",
        text: "Here's the same operation as a leaky contract and a clean one. The leaky version returns a bare boolean, smuggles results out through an out-parameter, takes an error-prone positional list, and exposes an internal index. The clean version is an intention-revealing interface returning an explicit result type over a parameter object:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// ❌ LEAKY — boolean return, out-param, positional soup, exposed internals
class Lot {
  // did it work? caller can't tell why it failed.
  park(plate: string, color: string, h: number, ev: boolean,
       outSpotIndex: { value: number }): boolean { /* ... */ }
}
const out = { value: -1 };
if (!lot.park("AB-12", "red", 1.6, false, out)) { /* why?? */ }
// caller must know what 'outSpotIndex' means — that's an internal detail

// ✅ CLEAN — intention-revealing interface, result type, parameter object
interface ParkingLot {
  park(vehicle: Vehicle): Result<Ticket>;   // one obvious thing; failure is in the type
}
const r = lot.park(car);
if (r.ok) issue(r.value);           // r.value is a Ticket — a domain object
else      show(r.error.message);    // the caller MUST handle the failure case`,
      },
    ],

    handsOn: [
      {
        title: "01 · Flip the return type and read the client code",
        body: "Start with the **Return type** selector on `void`. The **Client code** panel shows a call that throws away its result — the caller learns nothing. Switch it to **Ticket**, then to **Result<Ticket>**, and watch the snippet re-render each time. Notice how `Result<Ticket>` forces an `if (r.ok)` check into the caller's code, and the **caller-experience score** climbs as failure becomes visible in the type.",
      },
      {
        title: "02 · Make the contract leak, then watch the cons appear",
        body: "Set **Error handling** to **return null** and read the live con in the experience panel: *\"caller can forget the null check → NPE risk.\"* Now switch **Parameter style** to **long param list** and **Naming** to the vague **doIt()** — the score bar drops into the red and the console narrates each regression. This is exactly the leaky contract: easy to mis-call, impossible to read.",
      },
      {
        title: "03 · Snap to the clean API",
        body: "Press **Snap to clean API**. Every selector jumps to its best choice — `Result<Ticket>` return, `Result` error handling, a **parameter object**, and the intention-revealing **park(vehicle)** name — and the Client code panel renders the ideal caller snippet. The score maxes out, the pros light up green, and you can see the leaky-vs-clean contrast at a glance. Hit **Reset** to return to the awkward starting contract.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "parking-lot.ts",
        code: `// 1) DESIGN THE CONTRACT FIRST — the interface a caller depends on.
//    No implementation yet; just the shape of the socket.
interface Result<T> { ok: boolean; value?: T; error?: { code: string; message: string }; }

interface ParkRequest { vehicle: Vehicle; preferEv?: boolean; }   // parameter object
interface Ticket { id: string; spot: string; issuedAt: number; }

interface ParkingLot {
  park(request: ParkRequest): Result<Ticket>;   // intention-revealing, failure in the type
  release(ticketId: string): Result<void>;
  isFull(): boolean;                             // a pure query — no side effects
}

// 2) WRITE THE CLIENT CODE YOU WISH YOU COULD CALL — against the interface only.
function handlePark(lot: ParkingLot, car: Vehicle) {
  const r = lot.park({ vehicle: car });
  if (r.ok) return r.value!;                  // a Ticket — a domain object
  console.warn("could not park:", r.error!.message); // failure is impossible to ignore
}
// Implementations (in-memory, distributed, mock-for-tests) can be swapped behind ParkingLot.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "ParkingLot.java",
        code: `// 1) DESIGN THE CONTRACT FIRST — the interface a caller depends on.
record Ticket(String id, String spot, long issuedAt) {}
record ParkRequest(Vehicle vehicle, boolean preferEv) {}   // parameter object

// a small explicit result type — failure lives in the return value
record Result<T>(boolean ok, T value, String errorMessage) {
    static <T> Result<T> ok(T v)        { return new Result<>(true, v, null); }
    static <T> Result<T> fail(String m) { return new Result<>(false, null, m); }
}

interface ParkingLot {
    Result<Ticket> park(ParkRequest request);  // intention-revealing, failure in the type
    Result<Void>   release(String ticketId);
    boolean        isFull();                    // pure query — no side effects
}

// 2) WRITE THE CLIENT CODE FIRST — against the interface only.
class Gate {
    private final ParkingLot lot;               // depends on the abstraction (DIP)
    Gate(ParkingLot lot) { this.lot = lot; }

    Ticket admit(Vehicle car) {
        Result<Ticket> r = lot.park(new ParkRequest(car, false));
        if (r.ok()) return r.value();
        throw new IllegalStateException("could not park: " + r.errorMessage());
    }
}
// In-memory, distributed, or a test mock can all implement ParkingLot — Gate never changes.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "parking_lot.py",
        code: `from dataclasses import dataclass
from typing import Optional, Protocol


# 1) DESIGN THE CONTRACT FIRST — the interface a caller depends on.
@dataclass(frozen=True)
class Ticket:
    id: str
    spot: str
    issued_at: float


@dataclass(frozen=True)
class ParkRequest:          # parameter object — grows without breaking callers
    vehicle: "Vehicle"
    prefer_ev: bool = False


@dataclass(frozen=True)
class Result:               # small explicit result — failure in the return value
    ok: bool
    value: Optional[Ticket] = None
    error: Optional[str] = None


class ParkingLot(Protocol):
    def park(self, request: ParkRequest) -> Result: ...   # intention-revealing
    def release(self, ticket_id: str) -> Result: ...
    def is_full(self) -> bool: ...                         # pure query, no side effects


# 2) WRITE THE CLIENT CODE FIRST — against the Protocol only.
def admit(lot: ParkingLot, car: "Vehicle") -> Ticket:
    r = lot.park(ParkRequest(vehicle=car))
    if r.ok and r.value:
        return r.value                       # a Ticket — a domain object
    raise RuntimeError(f"could not park: {r.error}")  # failure can't be ignored
# Any implementation satisfying ParkingLot can be swapped in — admit() never changes.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "parking_lot.cpp",
        code: `#include <optional>
#include <string>

// 1) DESIGN THE CONTRACT FIRST — the abstract interface a caller depends on.
struct Ticket { std::string id; std::string spot; long issuedAt; };
struct ParkRequest { Vehicle vehicle; bool preferEv = false; };   // parameter object

template <typename T>
struct Result {                       // small explicit result — failure in the value
    bool ok;
    std::optional<T> value;
    std::string error;
    static Result ok_(T v)             { return { true,  std::move(v), "" }; }
    static Result fail(std::string m)  { return { false, std::nullopt, std::move(m) }; }
};

struct ParkingLot {                   // pure interface
    virtual Result<Ticket> park(const ParkRequest& request) = 0;  // intention-revealing
    virtual Result<int>    release(const std::string& ticketId) = 0;
    virtual bool           isFull() const = 0;                    // pure query
    virtual ~ParkingLot() = default;
};

// 2) WRITE THE CLIENT CODE FIRST — against the interface only.
Ticket admit(ParkingLot& lot, const Vehicle& car) {
    auto r = lot.park(ParkRequest{ car });
    if (r.ok) return *r.value;                       // a Ticket — a domain object
    throw std::runtime_error("could not park: " + r.error);  // failure can't be ignored
}
// In-memory, distributed, or a mock can all derive from ParkingLot — admit() is untouched.`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When designing the API first pays off most" },
      {
        type: "p",
        text: "Reach for API-first design whenever a contract will be *shared* or *outlive its first caller*: a public library or SDK, a service consumed by another team, a module sitting at a subsystem boundary, or anything you'll mock heavily in tests. The cost of a bad signature scales with the number of callers depending on it — a *published interface* is expensive to change because you can't fix every caller in one commit. Spend the design effort up front exactly where the API will be hard to change later.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Published vs. merely public",
        text: "There's a difference between *public* (anyone in your codebase can call it) and *published* (callers outside your codebase depend on it). A published interface is a contract you can't quietly refactor — every breaking change ripples out to people you can't see. Design those with the most care, and keep their surface as small as you honestly can.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't over-engineer the contract either",
        text: "API-first is not an excuse to invent interfaces for code with exactly one caller that'll never be swapped. Throwaway internal helpers don't need a hand-crafted contract. Design the API first where the surface is *shared, stable, or hard to change* — not on every private function.",
      },
    ],

    tradeoffs: {
      pros: [
        "Callers come first — the contract is judged by the people who use it, so the public surface stays clean and intention-revealing.",
        "Parallel work unblocks — implementation, callers, and tests all proceed against the agreed interface at once.",
        "Easy testing — mock the interface, and the contract's documented outcomes (including failures) are simple to assert.",
        "Swappable implementations — an interface contract lets you change what's behind it (DIP) without touching callers.",
        "Failure modes are explicit — choosing a Result/Optional return makes 'this can fail' impossible for the caller to ignore.",
      ],
      cons: [
        "Up-front effort — agreeing the contract before coding feels slower at the very start of a feature.",
        "Premature contracts can mislead — designing an API before you understand the problem can lock in the wrong shape.",
        "Over-abstraction risk — wrapping single-caller internal code in interfaces adds indirection for no gain.",
        "A published API is a promise — once callers depend on it, breaking changes are costly, so the surface must be chosen carefully.",
        "Result/error-style consistency takes discipline — mixing exceptions, nulls, and result types across one surface confuses callers.",
      ],
    },

    furtherReading: [
      {
        label: "Joshua Bloch — \"How to Design a Good API and Why it Matters\" (paper)",
        href: "https://research.google.com/pubs/archive/32713.pdf",
        note: "The canonical OOPSLA paper: design from the caller's side, keep the surface minimal, names matter, when in doubt leave it out. The foundation of this whole lesson.",
        kind: "paper",
      },
      {
        label: "Joshua Bloch — API design talk (InfoQ)",
        href: "https://www.infoq.com/articles/API-Design-Joshua-Bloch",
        note: "The talk version of the paper, with the famous maxims spelled out — the same ideas if you'd rather watch/read than skim a PDF.",
        kind: "video",
      },
      {
        label: "Effective Java — Joshua Bloch (book)",
        note: "Items on minimizing accessibility, designing method signatures, returning empties/Optionals over null, and favoring interfaces — the API-first principles applied chapter by chapter.",
        kind: "book",
      },
      {
        label: "Martin Fowler — \"PublishedInterface\" (bliki)",
        href: "https://martinfowler.com/bliki/PublishedInterface.html",
        note: "Why the line between public and *published* matters more than public vs. private: once callers outside your codebase depend on an API, you can't freely change it.",
        kind: "article",
      },
      {
        label: "Martin Fowler — \"MinimalInterface\" (bliki)",
        href: "https://martinfowler.com/bliki/MinimalInterface.html",
        note: "Keep the public surface as small as honestly possible — the counterpart to 'hide the internals' and 'when in doubt, leave it out.'",
        kind: "article",
      },
      {
        label: "A Philosophy of Software Design — John Ousterhout (book)",
        note: "The 'deep vs. shallow modules' argument: a great API is a small interface over a lot of hidden functionality — exactly the minimal-surface goal.",
        kind: "book",
      },
      {
        label: "Google API Improvement Proposals (aip.dev)",
        href: "https://google.aip.dev/",
        note: "Google's house rules for designing APIs consistently — the web/RPC analogue of class-level API-first thinking, with concrete naming and contract conventions.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "afd-q1",
        question: "What does \"designing the API first\" primarily mean?",
        options: [
          { id: "a", label: "Building the database schema before writing any methods." },
          { id: "b", label: "Deciding the public method signatures / interface the caller sees before writing the implementation." },
          { id: "c", label: "Writing the web/REST endpoints before the class methods." },
          { id: "d", label: "Optimizing the implementation for speed before exposing it." },
        ],
        correctOptionId: "b",
        explanation:
          "API-first means agreeing on the public contract — the signatures, parameters, and return types a caller depends on — before filling in the body. \"API\" here is the class or module's public interface, not specifically a web endpoint.",
      },
      {
        id: "afd-q2",
        question: "What is the recommended first concrete step when designing an API?",
        options: [
          { id: "a", label: "Write the implementation, then extract whatever methods fell out as the API." },
          { id: "b", label: "Write the example client code you wish you could call, before any implementation exists." },
          { id: "c", label: "Add as many public methods as possible so callers have options." },
          { id: "d", label: "Expose the internal data structures so callers can do anything." },
        ],
        correctOptionId: "b",
        explanation:
          "Write the usage code first. Pretend the class is done and write the few lines a caller would use. If those lines are awkward, the signature is wrong — and fixing it costs nothing before the implementation exists.",
      },
      {
        id: "afd-q3",
        question: "Why is returning a `Result<Ticket>` or `Optional<Ticket>` often better than returning `null` on failure?",
        options: [
          { id: "a", label: "It runs faster than returning null." },
          { id: "b", label: "It hides the failure so the caller never has to think about it." },
          { id: "c", label: "It makes the possibility of failure explicit in the type, so the caller can't silently forget to handle it." },
          { id: "d", label: "It removes the need for the method to ever fail." },
        ],
        correctOptionId: "c",
        explanation:
          "A `Result`/`Optional` return puts \"this might not produce a ticket\" into the type itself. The caller is forced to acknowledge the failure path, whereas a bare null is easy to forget — leading to NullPointerExceptions.",
      },
      {
        id: "afd-q4",
        question: "Which signature leaks implementation details into the public contract?",
        options: [
          { id: "a", label: "Result<Ticket> park(ParkRequest request)" },
          { id: "b", label: "void save(Connection conn, Row row)" },
          { id: "c", label: "Result<void> release(String ticketId)" },
          { id: "d", label: "boolean isFull()" },
        ],
        correctOptionId: "b",
        explanation:
          "`save(Connection conn, Row row)` exposes a database connection and a storage row — persistence concerns — in the public signature, welding every caller to your storage choice. A clean contract speaks the domain's language and hides the wiring.",
      },
      {
        id: "afd-q5",
        question: "How does agreeing on the API (as an interface) first help a team work in parallel?",
        options: [
          { id: "a", label: "It doesn't — everyone must wait for the implementation to finish." },
          { id: "b", label: "The interface is a shared contract, so the implementation, the callers, and the tests (using a mock) can all be built at once." },
          { id: "c", label: "It forces everyone to use the same programming language." },
          { id: "d", label: "It removes the need for tests because the interface guarantees correctness." },
        ],
        correctOptionId: "b",
        explanation:
          "Once the interface is agreed, it becomes the shared truth. One person builds the real implementation behind it, another builds callers against a mock of it, and a third writes contract tests — none blocked on the others.",
      },
    ],
  },
};
