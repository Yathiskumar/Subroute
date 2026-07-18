import type { RoadmapLesson } from "@/lib/content/types";

export const repository: RoadmapLesson = {
  title: "Repository",
  oneLiner:
    "Hide *where* and *how* your data is stored behind a plain collection-like API — `save`, `findById`, `findAll`, `delete`. Think of a **librarian**: you say \"get me the book with id 7\" and a book comes back. You never touch the shelves, the card catalog, or which building it lives in. Swap a SQL database for an in-memory list or a REST API and your business code doesn't change a single line — only the librarian does.",
  difficulty: "beginner",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/repository.html",
  content: {
    prototypeCaption:
      "A tiny app with a **fixed caller panel** on the left — `repo.findAll()`, `repo.save(user)`, `repo.delete(id)` — and three **storage backend** chips on the right: 🗄 *SQL Database*, 🧠 *In-Memory*, 🌐 *REST API*. Click a chip and watch the middle **Repository** box re-wire to a different backend while the caller panel stays *identical* — the counter reads **client code changed: 0 lines**. Then hit ＋ *Add user*, 🔍 *Find all*, or 🗑 *Delete*: the same call runs, but the animation of *where the data goes* changes — SQL shows rows in a table, In-Memory shows a JS array, REST API shows a `fetch` to a URL. The librarian is the only thing that knows the backend.",

    overview: [
      {
        type: "p",
        text: "The **Repository** pattern gives your business code a *collection-like* interface for data — methods like `save`, `findById`, `findAll`, and `delete` — so it never knows or cares *how* or *where* that data is actually stored. To the caller, a repository looks and feels like a plain in-memory list you can add to, remove from, and search. Behind that friendly face sits the real machinery: a SQL database, a REST API, a file, or a genuine in-memory array. The caller can't tell the difference, and that's the whole point.",
      },
      {
        type: "p",
        text: "The mental model is a **librarian**. You walk up and say *\"get me the book with id 7\"* or *\"here, save this new book\"*. A book comes back, or your book gets stored — done. You never touch the shelves, flip through the card catalog, or figure out which building the book lives in. The librarian hides all of that. And here's the payoff: the day the library switches from paper shelves to a computer system, *your* request doesn't change at all — you still just ask the librarian. Swapping Postgres for an in-memory fake (for tests) or for a REST API changes only the repository implementation, never the code that calls it.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A Repository makes stored data look like a plain in-memory **collection** (`save`, `findById`, `findAll`, `delete`) — so your domain code talks to that collection and never to the database, and you can swap the real storage underneath without touching a single caller.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've already met it",
        text: "**Spring Data JPA** repositories, **Rails ActiveRecord**-style models, and **.NET Entity Framework** `DbSet`s are all the Repository idea: your code says `userRepository.findById(7)` and stays blissfully unaware of the SQL underneath.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The interface — a collection you can swap" },
      {
        type: "p",
        text: "A repository starts as an *interface*: a small set of collection-like methods that describe *what* you can do with your data, not *how* it's done. For a `User`, that's usually the CRUD-ish quartet plus any domain queries you actually need:",
      },
      {
        type: "code",
        language: "typescript",
        code: `interface UserRepository {
  save(user: User): void;          // add or update
  findById(id: number): User | null;
  findAll(): User[];
  delete(id: number): void;
}`,
      },
      {
        type: "p",
        text: "Notice there's no SQL, no HTTP, no file path — nothing about *storage* at all. The caller depends only on this interface. That's [[program-to-interfaces]]: your domain code is written against the abstraction, so any implementation that honors it can be dropped in.",
      },
      { type: "h", text: "Concrete implementations behind it" },
      {
        type: "p",
        text: "Now you write one or more classes that *satisfy* that interface, each backed by a different store:",
      },
      {
        type: "ul",
        items: [
          "**`SqlUserRepository`** — turns `findById(7)` into `SELECT * FROM users WHERE id = 7` and `save(user)` into an `INSERT`/`UPDATE`. It talks to a real database.",
          "**`InMemoryUserRepository`** — keeps a plain `Map` or array in memory. `save` pushes, `findById` looks up the key. Perfect for tests: no database required.",
          "**`ApiUserRepository`** — turns the same calls into HTTP requests: `findById(7)` becomes a `GET /users/7`, `save(user)` a `POST /users`.",
        ],
      },
      {
        type: "p",
        text: "All three are interchangeable because they honor the *same* `UserRepository` interface. The caller receives whichever one it's handed — usually via [[dependency-injection-and-ioc]] — and can't tell which. High-level code depending on an abstraction while the low-level storage details depend on that same abstraction is [[dependency-inversion]] in action.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 520 300" width="100%" style="max-width:520px;display:block;margin:0 auto;font-family:ui-monospace,monospace" role="img" aria-label="A caller talks to the Repository interface, which is satisfied by three interchangeable backends: SQL database, in-memory list, and REST API.">
  <rect x="24" y="18" width="140" height="52" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="94" y="42" fill="#e8e4dc" font-size="13" text-anchor="middle">Business code</text>
  <text x="94" y="59" fill="#9099a8" font-size="10.5" text-anchor="middle">the caller</text>

  <rect x="200" y="14" width="150" height="60" rx="8" fill="#14161a" stroke="#fb863a"/>
  <text x="275" y="38" fill="#fb863a" font-size="13" text-anchor="middle">UserRepository</text>
  <text x="275" y="55" fill="#9099a8" font-size="10.5" text-anchor="middle">interface</text>

  <line x1="164" y1="44" x2="200" y2="44" stroke="#9099a8" stroke-width="1.5"/>
  <polygon points="200,44 191,40 191,48" fill="#9099a8"/>

  <rect x="392" y="12" width="112" height="46" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="448" y="31" fill="#e8e4dc" font-size="11.5" text-anchor="middle">🗄 SQL DB</text>
  <text x="448" y="47" fill="#9099a8" font-size="9.5" text-anchor="middle">SELECT / INSERT</text>

  <rect x="392" y="120" width="112" height="46" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="448" y="139" fill="#e8e4dc" font-size="11.5" text-anchor="middle">🧠 In-Memory</text>
  <text x="448" y="155" fill="#9099a8" font-size="9.5" text-anchor="middle">array / map</text>

  <rect x="392" y="228" width="112" height="46" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="448" y="247" fill="#e8e4dc" font-size="11.5" text-anchor="middle">🌐 REST API</text>
  <text x="448" y="263" fill="#9099a8" font-size="9.5" text-anchor="middle">GET / POST</text>

  <line x1="350" y1="44" x2="392" y2="35" stroke="#2d333d" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="350" y1="52" x2="392" y2="143" stroke="#2d333d" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="350" y1="60" x2="392" y2="251" stroke="#2d333d" stroke-width="1.5" stroke-dasharray="4 4"/>

  <text x="275" y="150" fill="#9099a8" font-size="10.5" text-anchor="middle">one interface,</text>
  <text x="275" y="166" fill="#9099a8" font-size="10.5" text-anchor="middle">swappable backends</text>
</svg>`,
        caption:
          "The caller only ever touches the interface. Which concrete backend answers is a choice made elsewhere — swap it and the caller never notices.",
      },
      { type: "h", text: "Why bother — three concrete payoffs" },
      {
        type: "ul",
        items: [
          "**Testability** — hand your service an `InMemoryUserRepository` in tests. No database to spin up, no network, no flakiness. Tests run in milliseconds and stay deterministic.",
          "**One place for query logic** — every way of fetching users lives inside the repository. Need a new query? It goes in one file, not scattered across a dozen call sites.",
          "**Persistence-ignorant domain** — your business rules read like business rules, not like database plumbing. The domain never imports a SQL driver or an HTTP client.",
        ],
      },
      { type: "h", text: "Repository vs DAO — close, but not the same" },
      {
        type: "p",
        text: "People mix these up. A **DAO** (Data Access Object) is usually *one table, one class*, offering thin CRUD that maps very closely to the database — it thinks in rows and tables. A **Repository** is more *domain-oriented*: it deals in whole business objects (aggregates), behaves like an in-memory *collection*, and may pull data from several tables — or even several sources — to hand you one complete object. Roughly: DAO speaks *database*, Repository speaks *domain*. In practice a Repository is often implemented *using* one or more DAOs underneath.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The trap: leaky and pointless repositories",
        text: "A repository earns its keep only if it truly hides the store. Two common failures: (1) **Leaky abstractions** — returning an `IQueryable`, a raw query builder, or exposing SQL fragments. Now the caller *is* writing database queries again, just through your object, and you can't swap the backend anymore. (2) **The thin wrapper** — a repository per table that just forwards straight to the ORM with zero added value. If your repo method is a one-line passthrough to `dbContext.Users`, it's ceremony, not abstraction. Repositories should hide the store and hold real query logic, not rubber-stamp it.",
      },
    ],

    handsOn: [
      {
        title: "01 · Swap the backend, change zero caller code",
        body: "Click the 🧠 In-Memory chip, then 🗄 SQL Database, then 🌐 REST API. Watch the middle Repository box re-wire to a different store each time — but the caller panel on the left never changes, and the counter stays at 'client code changed: 0 lines'. That's the promise: the store is swappable, the caller is untouched.",
      },
      {
        title: "02 · Run the same call on each store",
        body: "With SQL active, hit ＋ Add user — a new row slides into the table. Switch to In-Memory and hit ＋ Add user again — this time the value is pushed onto a JS array. Switch to REST API and add once more — now you see a POST fetch to a URL. Same `repo.save(user)` call, three totally different destinations.",
      },
      {
        title: "03 · Find and delete through the interface",
        body: "Click 🔍 Find all to run `repo.findAll()` — the whole collection lights up regardless of which backend holds it. Then hit 🗑 Delete to run `repo.delete(id)` and watch one user leave the store. Finish with ↺ Reset. The caller only ever said 'find all' and 'delete' — the librarian did the rest.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "userRepository.ts",
        code: `// The collection-like interface — the ONLY thing the caller depends on.
interface User { id: number; name: string; }

interface UserRepository {
  save(user: User): void;
  findById(id: number): User | undefined;
  findAll(): User[];
  delete(id: number): void;
}

// One concrete implementation — a plain in-memory store (great for tests).
class InMemoryUserRepository implements UserRepository {
  private users = new Map<number, User>();
  save(user: User): void { this.users.set(user.id, user); }
  findById(id: number) { return this.users.get(id); }
  findAll(): User[] { return [...this.users.values()]; }
  delete(id: number): void { this.users.delete(id); }
}

// The caller talks to the INTERFACE — it has no idea what's behind it.
function greetEveryone(repo: UserRepository): void {
  repo.save({ id: 1, name: "Ada" });
  repo.save({ id: 2, name: "Linus" });
  for (const u of repo.findAll()) console.log("Hi " + u.name);
}

greetEveryone(new InMemoryUserRepository());  // swap this for SqlUserRepository, unchanged caller`,
      },
      {
        label: "Java",
        language: "java",
        filename: "UserRepository.java",
        code: `import java.util.*;

record User(int id, String name) {}

// The collection-like interface — the only thing the caller depends on.
interface UserRepository {
    void save(User user);
    Optional<User> findById(int id);
    List<User> findAll();
    void delete(int id);
}

// One concrete implementation — a plain in-memory store (great for tests).
class InMemoryUserRepository implements UserRepository {
    private final Map<Integer, User> users = new LinkedHashMap<>();
    public void save(User u)            { users.put(u.id(), u); }
    public Optional<User> findById(int id) { return Optional.ofNullable(users.get(id)); }
    public List<User> findAll()         { return new ArrayList<>(users.values()); }
    public void delete(int id)          { users.remove(id); }
}

class Demo {
    // The caller talks to the INTERFACE — no idea what's behind it.
    static void greetEveryone(UserRepository repo) {
        repo.save(new User(1, "Ada"));
        repo.save(new User(2, "Linus"));
        for (User u : repo.findAll()) System.out.println("Hi " + u.name());
    }
    public static void main(String[] args) {
        greetEveryone(new InMemoryUserRepository());  // swap for SqlUserRepository, unchanged caller
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "user_repository.py",
        code: `from dataclasses import dataclass
from typing import Protocol


@dataclass
class User:
    id: int
    name: str


class UserRepository(Protocol):          # the collection-like interface
    def save(self, user: User) -> None: ...
    def find_by_id(self, id: int) -> User | None: ...
    def find_all(self) -> list[User]: ...
    def delete(self, id: int) -> None: ...


class InMemoryUserRepository:            # one concrete impl (great for tests)
    def __init__(self) -> None:
        self._users: dict[int, User] = {}

    def save(self, user: User) -> None:        self._users[user.id] = user
    def find_by_id(self, id: int) -> User | None: return self._users.get(id)
    def find_all(self) -> list[User]:          return list(self._users.values())
    def delete(self, id: int) -> None:         self._users.pop(id, None)


def greet_everyone(repo: UserRepository) -> None:
    # The caller talks to the INTERFACE — no idea what's behind it.
    repo.save(User(1, "Ada"))
    repo.save(User(2, "Linus"))
    for u in repo.find_all():
        print("Hi", u.name)


greet_everyone(InMemoryUserRepository())  # swap for SqlUserRepository, unchanged caller`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "user_repository.cpp",
        code: `#include <iostream>
#include <map>
#include <optional>
#include <string>
#include <vector>

struct User { int id; std::string name; };

// The collection-like interface — the only thing the caller depends on.
struct UserRepository {
    virtual ~UserRepository() = default;
    virtual void save(const User& user) = 0;
    virtual std::optional<User> findById(int id) = 0;
    virtual std::vector<User> findAll() = 0;
    virtual void remove(int id) = 0;
};

// One concrete implementation — a plain in-memory store (great for tests).
class InMemoryUserRepository : public UserRepository {
    std::map<int, User> users;
public:
    void save(const User& u) override { users[u.id] = u; }
    std::optional<User> findById(int id) override {
        auto it = users.find(id);
        return it == users.end() ? std::nullopt : std::optional<User>(it->second);
    }
    std::vector<User> findAll() override {
        std::vector<User> out;
        for (auto& [id, u] : users) out.push_back(u);
        return out;
    }
    void remove(int id) override { users.erase(id); }
};

// The caller talks to the INTERFACE — no idea what's behind it.
void greetEveryone(UserRepository& repo) {
    repo.save({1, "Ada"});
    repo.save({2, "Linus"});
    for (const auto& u : repo.findAll()) std::cout << "Hi " << u.name << "\\n";
}

int main() {
    InMemoryUserRepository repo;   // swap for SqlUserRepository, unchanged caller
    greetEveryone(repo);
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Repository when..." },
      {
        type: "ul",
        items: [
          "**You want to swap storage without touching business code** — you're on Postgres today but want an in-memory fake for tests, or you foresee moving to a different store or a REST API later.",
          "**Testing keeps dragging in a real database** — an in-memory repository lets your service tests run fast, offline, and deterministically.",
          "**Query logic is scattered** — you want one home for all the ways your code fetches a given kind of object, instead of raw queries sprinkled across call sites.",
          "**Your domain should stay persistence-ignorant** — business rules that read like business rules, with no SQL or HTTP leaking in.",
        ],
      },
      { type: "h", text: "Skip it when..." },
      {
        type: "ul",
        items: [
          "**It's a tiny app with one data source that will never change** — the extra interface and class are ceremony with no payoff.",
          "**Your ORM already gives you a good-enough abstraction** — if a repository would just forward straight to `dbContext.Users` or a Spring Data interface with nothing added, it's a pointless passthrough.",
          "**You'd end up leaking the store anyway** — if the only way to express your queries is to hand back an `IQueryable` or raw builder, the abstraction buys you nothing.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Swappable storage — change SQL → in-memory → REST API by writing a new implementation, with zero changes to callers.",
        "Testability — drop in an in-memory fake and your service tests run fast, offline, and deterministically.",
        "Centralized query logic — every way of fetching an object lives in one place instead of being scattered across the codebase.",
        "Persistence-ignorant domain — business code depends on a collection-like interface, never on a database driver or HTTP client.",
      ],
      cons: [
        "Extra indirection — one more layer and interface to write and maintain, which is overkill for tiny or throwaway apps.",
        "Passthrough risk — a repository-per-table that just forwards to the ORM adds ceremony without real abstraction.",
        "Leaky abstractions — expose an IQueryable or raw query builder and callers are writing database queries again, killing the swap-ability.",
        "Duplicated ORM features — a good ORM may already provide change tracking, caching, and querying you now partly re-implement.",
      ],
    },

    furtherReading: [
      {
        label: "Repository — Martin Fowler (P of EAA)",
        href: "https://martinfowler.com/eaaCatalog/repository.html",
        note: "The canonical catalog entry: a repository mediates between the domain and data mapping, acting like an in-memory collection of domain objects. The original definition.",
        kind: "article",
      },
      {
        label: "Design the infrastructure persistence layer — Microsoft .NET docs",
        href: "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design",
        note: "A thorough, practical treatment of the Repository pattern with EF Core: why to use it, one repository per aggregate, and the pitfalls of generic/leaky repositories.",
        kind: "docs",
      },
      {
        label: "Repository pattern — Refactoring.Guru style overview (Wikipedia: Data access object)",
        href: "https://en.wikipedia.org/wiki/Data_access_object",
        note: "Concise reference contrasting DAO (row/table-oriented, close to the DB) with the more domain-oriented, collection-like Repository — the exact distinction that trips people up.",
        kind: "docs",
      },
      {
        label: "Spring Data JPA — Reference Documentation",
        href: "https://docs.spring.io/spring-data/jpa/reference/jpa.html",
        note: "The most widely used real-world Repository implementation: declare an interface extending JpaRepository and Spring generates the store-backed class for you.",
        kind: "docs",
      },
      {
        label: "Domain-Driven Design — Eric Evans",
        href: "https://www.domainlanguage.com/ddd/",
        note: "Where the modern, domain-oriented notion of Repository (one per aggregate root, collection-like, persistence-ignorant) was popularized. The source of the DAO-vs-Repository framing.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "repository-q1",
        question: "What does the caller actually see when it uses a Repository?",
        options: [
          { id: "a", label: "A plain collection-like interface — save, findById, findAll, delete — with no hint of how or where the data is stored." },
          { id: "b", label: "The raw SQL connection, so it can run whatever queries it needs." },
          { id: "c", label: "A different set of methods for each backend, so it must branch on the store type." },
          { id: "d", label: "Nothing — the caller writes its own persistence code inline." },
        ],
        correctOptionId: "a",
        explanation:
          "To the caller a repository looks like an in-memory collection: add, remove, find, list. That's exactly what lets the storage swap underneath. Exposing the SQL connection (b) or raw queries would be a leaky abstraction; the interface stays the same across backends (c).",
      },
      {
        id: "repository-q2",
        question: "You switch a service from a SQL database to an in-memory store for tests. What has to change?",
        options: [
          { id: "a", label: "Only which repository implementation is injected — the business code that calls the repository stays identical." },
          { id: "b", label: "Every caller, because each one talks directly to the database." },
          { id: "c", label: "The repository interface, since in-memory needs different method names." },
          { id: "d", label: "Nothing can change — repositories are locked to one backend." },
        ],
        correctOptionId: "a",
        explanation:
          "That's the core payoff. The callers depend on the interface, so you just hand them InMemoryUserRepository instead of SqlUserRepository — usually via dependency injection. The interface and all calling code are untouched.",
      },
      {
        id: "repository-q3",
        question: "How does a Repository differ from a DAO?",
        options: [
          { id: "a", label: "A DAO is usually thin, one-table CRUD close to the database; a Repository is more domain-oriented, behaves like a collection, and may aggregate several sources." },
          { id: "b", label: "They are identical — two names for the same thing." },
          { id: "c", label: "A DAO works only in memory; a Repository works only with SQL." },
          { id: "d", label: "A Repository can only read data, while a DAO can only write it." },
        ],
        correctOptionId: "a",
        explanation:
          "DAO thinks in rows and tables and maps closely to the database; Repository thinks in domain objects, feels like an in-memory collection, and may pull from multiple tables or sources. A repository is often built on top of one or more DAOs.",
      },
      {
        id: "repository-q4",
        question: "Which of these is the classic leaky-abstraction trap for repositories?",
        options: [
          { id: "a", label: "Returning an IQueryable or raw query builder, so callers write database queries again through your object and you can no longer swap the store." },
          { id: "b", label: "Returning fully-formed domain objects from findAll()." },
          { id: "c", label: "Having an interface with save, findById, findAll, and delete." },
          { id: "d", label: "Providing an in-memory implementation for tests." },
        ],
        correctOptionId: "a",
        explanation:
          "The moment a repository hands back an IQueryable or exposes SQL fragments, the caller is coupled to the store again and the swap-ability is gone. Returning finished domain objects (b) and offering an in-memory fake (d) are exactly what a good repository should do.",
      },
      {
        id: "repository-q5",
        question: "Why is a Repository good for testing?",
        options: [
          { id: "a", label: "You can inject an in-memory implementation, so tests run fast and deterministically with no real database or network." },
          { id: "b", label: "It automatically generates test cases for your queries." },
          { id: "c", label: "It disables the database in production so bugs can't reach it." },
          { id: "d", label: "It makes tests talk to the production database faster." },
        ],
        correctOptionId: "a",
        explanation:
          "Because callers depend on the interface, tests can supply a simple in-memory fake instead of the SQL implementation — no database to spin up, no flaky network, and millisecond, deterministic runs.",
      },
      {
        id: "repository-q6",
        question: "When is a Repository probably NOT worth it?",
        options: [
          { id: "a", label: "A tiny app with a single data source that will never change, or where your ORM already gives a good-enough abstraction and the repo would just be a passthrough." },
          { id: "b", label: "Whenever you need to write automated tests for your service." },
          { id: "c", label: "Whenever your domain has more than one kind of entity." },
          { id: "d", label: "Whenever you might one day switch databases." },
        ],
        correctOptionId: "a",
        explanation:
          "If storage will never change and your ORM already abstracts it, a repository that just forwards to dbContext.Users is ceremony with no payoff. The other options are precisely the situations where a repository earns its keep.",
      },
    ],
  },
};
