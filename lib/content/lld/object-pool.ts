import type { RoadmapLesson } from "@/lib/content/types";

export const objectPool: RoadmapLesson = {
  title: "Object Pool",
  oneLiner:
    "Some objects are slow and expensive to build — like a database connection that needs a network handshake. Instead of making a new one every time and throwing it away, an Object Pool keeps a small set of ready-made ones that you borrow, use, and return, so the same few get reused over and over.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/object-pool.html",
  content: {
    prototypeCaption:
      "Two worlds with the same clicking. Flip between **WITHOUT Pool** and **WITH Pool**. In **WITHOUT Pool**, every `＋ Acquire` runs `new Connection()` — you pay a **200ms handshake** and the **\"expensive objects created\"** counter climbs by one *every single click* and never stops. In **WITH Pool**, there's a fixed pool of **3 connections** shown as slots: 🟢 available or 🟡 in-use. `＋ Acquire` hands you an existing free slot (it turns 🟡) and the **created counter flatlines at 3** no matter how many times you click — you're *reusing*, not building. Acquire a 4th time with all three busy and your request drops into a **waiting queue** (\"pool exhausted — waiting…\"); click **Release** on any in-use slot and the pool hands that freed connection straight to the waiting request. The scoreboard says it all: **served 12 requests · created only 3**. One fixed explain panel narrates every action; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "An **Object Pool** keeps a small set of ready-made, reusable objects and lends them out. When you need one, you **borrow** it from the pool; when you're done, you **return** it so the next person can reuse it. You never build a fresh one for every request. The whole point is to avoid the cost of creating and destroying expensive objects again and again.",
      },
      {
        type: "p",
        text: "Think of a **car rental company**. Renting a car is expensive to *make* — you have to buy it, register it, insure it. So the company doesn't build you a brand-new car every time you show up and then scrap it when you're done. That would be insane. Instead they keep a **fixed fleet** of ready cars. You take one from the lot, drive it, and bring it back — then the next customer drives the *same* car. If the whole fleet is out, you **wait** until someone returns one. An Object Pool works exactly like that rental lot, just with database connections instead of cars.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Don't build a new expensive object for every request — keep a small pool and **acquire → use → release** the same few over and over. The number of objects actually *created* stays capped at the pool size, no matter how many requests come through.",
      },
      {
        type: "callout",
        variant: "info",
        title: "What makes an object \"expensive\"?",
        text: "A database connection has to open a network socket, do a TCP handshake, authenticate a username and password, and set up a session — that can take tens or hundreds of milliseconds *before you run a single query*. Threads, large memory buffers, and network sockets are expensive in the same way. Reusing one you already paid for is far cheaper than paying that cost again.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three-step lifecycle: acquire → use → release" },
      {
        type: "p",
        text: "Every pooled object goes around the same little loop. Learn these three words and you know the pattern:",
      },
      {
        type: "ul",
        items: [
          "**Acquire** — ask the pool for an object. If a free one is sitting in the pool, you get it instantly (no creation cost). If the pool is empty *and* it hasn't hit its size limit yet, it creates one for you. If it's at the limit and all are busy, your request **waits**.",
          "**Use** — do your work with the borrowed object: run your queries, send your bytes, fire your bullet. During this time the object is marked *in-use* so nobody else grabs the same one.",
          "**Release** — give it back to the pool (usually after a quick **reset** to clear any leftover state). It's now available again, and if someone was waiting, the pool hands it straight to them.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Reuse is the whole idea — objects created stays capped",
        text: "This is the number to watch. Serve 5 requests, 50, or 5,000 through a pool of 3, and you still only ever **created 3** connections. The pool *recycles* the same few. Without a pool, 5,000 requests means 5,000 expensive `new Connection()` calls (and 5,000 handshakes). With a pool of 3, it means 3. That gap is why the pattern exists.",
      },
      { type: "h", text: "What happens when the pool runs out" },
      {
        type: "p",
        text: "A pool has a **fixed maximum size** — say 3 connections. That cap is deliberate: it protects the database from being flooded by thousands of connections at once. So what happens when all 3 are borrowed and a 4th request arrives? There are a few common choices, and real pools let you pick:",
      },
      {
        type: "ul",
        items: [
          "**Wait (block)** — the request pauses in a **waiting queue** until someone releases a connection, then it gets that one. This is the most common default. (The prototype does this.)",
          "**Grow** — temporarily create extra objects above the normal size, then trim back later. Flexible, but you lose the hard cap that protected the resource.",
          "**Reject / time out** — refuse the request (or wait only up to a limit, then throw). This keeps the system from piling up an endless backlog under overload.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 640 210" width="100%" style="max-width:640px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Diagram of the object pool lifecycle. A client acquires a connection from a pool of three. The connection is marked in-use while the client works, then released back to the pool as available. When all three are in use, a new request waits in a queue until one is released.">
  <defs>
    <marker id="op-arrow" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L11,4 L1,8 z" fill="#9099a8"/></marker>
  </defs>

  <!-- client -->
  <rect x="24" y="78" width="104" height="48" rx="6" fill="#14161a" stroke="#2d333d" stroke-width="1.5"/>
  <text x="76" y="100" text-anchor="middle" font-size="12.5" font-weight="700" fill="#e8e4dc">Client</text>
  <text x="76" y="116" text-anchor="middle" font-size="9.5" fill="#9099a8">needs a conn</text>

  <!-- acquire arrow -->
  <line x1="130" y1="92" x2="236" y2="92" stroke="#9099a8" stroke-width="1.4" marker-end="url(#op-arrow)"/>
  <text x="183" y="84" text-anchor="middle" font-size="10" fill="#fb863a">acquire</text>
  <!-- release arrow -->
  <line x1="236" y1="118" x2="130" y2="118" stroke="#9099a8" stroke-width="1.4" marker-end="url(#op-arrow)"/>
  <text x="183" y="134" text-anchor="middle" font-size="10" fill="#5cc66f">release (reset)</text>

  <!-- pool box -->
  <rect x="244" y="40" width="210" height="130" rx="8" fill="#14161a" stroke="#2d333d" stroke-width="1.5"/>
  <text x="349" y="60" text-anchor="middle" font-size="10.5" letter-spacing="0.06em" fill="#9099a8">POOL · max 3</text>
  <rect x="262" y="74" width="174" height="26" rx="5" fill="#14161a" stroke="#5cc66f" stroke-width="1.4"/>
  <text x="349" y="91" text-anchor="middle" font-size="10.5" fill="#5cc66f">🟢 conn #1 · available</text>
  <rect x="262" y="106" width="174" height="26" rx="5" fill="#14161a" stroke="#e0a53d" stroke-width="1.4"/>
  <text x="349" y="123" text-anchor="middle" font-size="10.5" fill="#e0a53d">🟡 conn #2 · in-use</text>
  <rect x="262" y="138" width="174" height="26" rx="5" fill="#14161a" stroke="#e0a53d" stroke-width="1.4"/>
  <text x="349" y="155" text-anchor="middle" font-size="10.5" fill="#e0a53d">🟡 conn #3 · in-use</text>

  <!-- waiting queue -->
  <line x1="454" y1="105" x2="512" y2="105" stroke="#9099a8" stroke-width="1.4" stroke-dasharray="4 4" marker-end="url(#op-arrow)"/>
  <text x="483" y="97" text-anchor="middle" font-size="9" fill="#9099a8">all busy</text>
  <rect x="520" y="82" width="96" height="46" rx="6" fill="#14161a" stroke="#f06868" stroke-width="1.5"/>
  <text x="568" y="103" text-anchor="middle" font-size="11" font-weight="700" fill="#f06868">waiting…</text>
  <text x="568" y="118" text-anchor="middle" font-size="9" fill="#9099a8">req #4 queued</text>
</svg>`,
        caption:
          "The **client** *acquires* a connection from the **pool**, marking it 🟡 in-use while it works, then *releases* it (after a reset) back to 🟢 available. The pool holds at most 3. When all three are in-use, a new request drops into the **waiting queue** and stays there until someone releases — then it gets that freed connection.",
      },
      { type: "h", text: "Why \"without a pool\" goes wrong" },
      {
        type: "p",
        text: "Without a pool, every request runs `new Connection()`, pays the full handshake cost, uses the connection once, and throws it away. Under load — say a website with hundreds of requests a second — you're constantly opening and closing connections, hammering the database with handshakes, and burning time and memory on setup you immediately discard. The pool fixes this by paying the creation cost a *tiny* number of times up front and then reusing those objects forever. The prototype lets you feel the difference: in the WITHOUT world the created-count runs away with every click, while in the WITH world it flatlines at 3.",
      },
    ],

    handsOn: [
      {
        title: "01 · Watch the counter run away without a pool",
        body: "Open the prototype on WITHOUT Pool. Click ＋ Acquire several times. Each click runs new Connection(), pays a 200ms handshake, and bumps \"expensive objects created\" by one — 1, 2, 3, 4, 5… it never stops, because every request builds a fresh connection and then discards it. Notice there's no reuse at all: the number of objects created equals the number of clicks.",
      },
      {
        title: "02 · Flip to WITH Pool and see it flatline",
        body: "Switch the toggle to WITH Pool. Now three connection slots appear, all 🟢 available. Click ＋ Acquire and one slot turns 🟡 in-use — but the created counter stays at 3. Keep clicking Acquire and Release: connections flip between green and yellow, the scoreboard shows \"served N requests · created only 3\", yet no new object is ever built. That flat created-count is the entire lesson.",
      },
      {
        title: "03 · Exhaust the pool and hand off to a waiter",
        body: "Still in WITH Pool, click ＋ Acquire three times so all three slots are 🟡 in-use. Acquire once more — your request can't get a connection, so it drops into the waiting queue with \"pool exhausted — waiting…\". Now click Release on any in-use slot: instead of going back to green, that freed connection is handed straight to the waiting request. That wait-then-handoff is exactly how a real database pool protects the database while still serving everyone.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "connection-pool.ts",
        code: `// A tiny fixed-size pool of expensive Connection objects.
class Connection {
  constructor(public readonly id: number) {
    // Imagine a slow network handshake + auth here (~200ms).
  }
  query(sql: string): void { /* ...use the connection... */ }
  reset(): void { /* clear leftover state before reuse */ }
}

class ConnectionPool {
  private available: Connection[] = [];   // free, ready to hand out
  private inUse = new Set<Connection>();   // currently borrowed
  private created = 0;                     // how many we ever built

  constructor(private readonly max: number) {}

  acquire(): Connection | null {
    let conn = this.available.pop();       // reuse a free one if we have it
    if (!conn && this.created < this.max) {
      conn = new Connection(++this.created); // under the cap? build one
    }
    if (!conn) return null;                // pool exhausted → wait or reject
    this.inUse.add(conn);
    return conn;
  }

  release(conn: Connection): void {
    this.inUse.delete(conn);
    conn.reset();                          // ⚠️ clean stale state before reuse
    this.available.push(conn);             // back in the pool for the next caller
  }
}

// Client code: acquire → use → release.
const pool = new ConnectionPool(3);
const c = pool.acquire();                  // borrow one
c?.query("SELECT 1");                      // use it
if (c) pool.release(c);                    // ALWAYS give it back
// Serve 1000 requests through this pool and only 3 connections are ever created.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "ConnectionPool.java",
        code: `import java.util.*;

// A fixed-size pool. In real Java apps you'd use HikariCP — the standard,
// battle-tested JDBC connection pool — instead of writing your own.
class Connection {
    final int id;
    Connection(int id) { this.id = id; /* slow handshake + auth here */ }
    void query(String sql) { /* ...use it... */ }
    void reset() { /* clear leftover state before reuse */ }
}

class ConnectionPool {
    private final Deque<Connection> available = new ArrayDeque<>();
    private final Set<Connection> inUse = new HashSet<>();
    private int created = 0;
    private final int max;

    ConnectionPool(int max) { this.max = max; }

    // synchronized so two threads can't grab the same connection.
    synchronized Connection acquire() {
        Connection conn = available.pollFirst();     // reuse a free one
        if (conn == null && created < max) {
            conn = new Connection(++created);        // under cap? build one
        }
        if (conn == null) return null;               // exhausted → wait/reject
        inUse.add(conn);
        return conn;
    }

    synchronized void release(Connection conn) {
        inUse.remove(conn);
        conn.reset();                                // clean before reuse
        available.addLast(conn);                     // back in the pool
    }
}

// ConnectionPool pool = new ConnectionPool(3);
// Connection c = pool.acquire();  // borrow
// c.query("SELECT 1");            // use
// pool.release(c);                // ALWAYS release`,
      },
      {
        label: "Python",
        language: "python",
        filename: "connection_pool.py",
        code: `# A tiny fixed-size pool. In real projects you'd use a library's pool,
# e.g. SQLAlchemy's QueuePool or psycopg's ConnectionPool.

class Connection:
    def __init__(self, conn_id: int) -> None:
        self.id = conn_id            # imagine a slow handshake + auth here

    def query(self, sql: str) -> None:
        ...                          # use the connection

    def reset(self) -> None:
        ...                          # clear leftover state before reuse


class ConnectionPool:
    def __init__(self, max_size: int) -> None:
        self._available: list[Connection] = []   # free, ready to hand out
        self._in_use: set[Connection] = set()    # currently borrowed
        self._created = 0                         # how many we ever built
        self._max = max_size

    def acquire(self) -> Connection | None:
        conn = self._available.pop() if self._available else None
        if conn is None and self._created < self._max:
            self._created += 1
            conn = Connection(self._created)      # under cap? build one
        if conn is None:
            return None                           # exhausted → wait / reject
        self._in_use.add(conn)
        return conn

    def release(self, conn: Connection) -> None:
        self._in_use.discard(conn)
        conn.reset()                              # clean stale state
        self._available.append(conn)              # back in the pool


pool = ConnectionPool(3)
c = pool.acquire()          # borrow
if c:
    c.query("SELECT 1")     # use
    pool.release(c)         # ALWAYS release — a leaked conn starves the pool`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "connection_pool.cpp",
        code: `#include <vector>
#include <unordered_set>

// A fixed-size pool of expensive Connection objects.
struct Connection {
    int id;
    explicit Connection(int i) : id(i) { /* slow handshake + auth here */ }
    void query(const char* sql) { /* ...use it... */ }
    void reset() { /* clear leftover state before reuse */ }
};

class ConnectionPool {
    std::vector<Connection*> available;              // free, ready to hand out
    std::unordered_set<Connection*> inUse;           // currently borrowed
    int created = 0;
    int max;

public:
    explicit ConnectionPool(int m) : max(m) {}

    Connection* acquire() {
        Connection* conn = nullptr;
        if (!available.empty()) {                    // reuse a free one
            conn = available.back();
            available.pop_back();
        } else if (created < max) {
            conn = new Connection(++created);        // under cap? build one
        }
        if (!conn) return nullptr;                   // exhausted → wait/reject
        inUse.insert(conn);
        return conn;
    }

    void release(Connection* conn) {
        inUse.erase(conn);
        conn->reset();                               // clean before reuse
        available.push_back(conn);                   // back in the pool
    }
};

// ConnectionPool pool(3);
// Connection* c = pool.acquire();  // borrow
// c->query("SELECT 1");            // use
// pool.release(c);                 // ALWAYS release`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a pool when creation is genuinely expensive and reused often" },
      {
        type: "p",
        text: "An Object Pool pays off in a narrow but important set of cases — where building the object is slow or heavy, *and* you'll need many of them over and over:",
      },
      {
        type: "ul",
        items: [
          "**Database connection pools** — the classic case. Opening a DB connection is slow (network + auth), and a busy app needs one for every request. Real libraries: **HikariCP** (Java), SQLAlchemy's pool (Python), pgbouncer (Postgres).",
          "**Thread pools** — creating an OS thread is costly, so a thread pool keeps a fixed set of worker threads and feeds them tasks instead of spawning a thread per task.",
          "**Network sockets / HTTP connections** — reusing a kept-alive connection avoids repeating the TCP + TLS handshake for every call.",
          "**Large reusable buffers** — big byte buffers or arrays that are pricey to allocate and clear can be pooled and handed out for each operation.",
          "**Game objects** — bullets, particles, and enemies are spawned and destroyed constantly; pooling them avoids allocation spikes and garbage-collection stutter during play.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't pool cheap objects",
        text: "Pooling only helps when creation is *genuinely* expensive and objects are reused a lot. Pooling small, cheap objects (a point, a short string) usually costs *more* than it saves — you add complexity and, in garbage-collected languages like Java or JavaScript, a pool of live objects can actually *hurt* the collector more than just letting short-lived objects be born and die. If `new X()` is fast, skip the pool.",
      },
    ],

    tradeoffs: {
      pros: [
        "Avoids repeated expensive creation — you pay the handshake/allocation cost only a few times (up to the pool size), then reuse those objects for every request after.",
        "Caps resource usage — a fixed maximum protects the database (or OS) from being flooded by thousands of simultaneous connections or threads.",
        "Smooths performance — no allocation spikes or handshake latency on the hot path; borrowing a ready object is near-instant.",
        "Predictable under load — when demand exceeds the pool, requests queue in an orderly way instead of overwhelming the downstream resource.",
      ],
      cons: [
        "Added complexity — you now manage acquire/release, a size limit, waiting, and object lifecycle, instead of a simple new/discard.",
        "You MUST release — an object that's borrowed and never returned (a leak) is gone from the pool forever; enough leaks and the pool starves and every request hangs waiting.",
        "Stale state bugs — a pooled object carries whatever state the last user left on it; if you forget to reset it on release, the next caller sees leftover data.",
        "Sizing is a tuning problem — too small and requests wait; too large and you waste resources or flood the database. The right size takes measurement.",
        "Can hurt in GC languages — pooling cheap or short-lived objects keeps them alive longer and can make garbage collection worse, not better.",
      ],
    },

    furtherReading: [
      {
        label: "Object Pool — Refactoring.Guru (Design Patterns catalog)",
        href: "https://refactoring.guru/design-patterns/object-pool",
        note: "The clearest illustrated walkthrough: the problem of expensive objects, the acquire/reuse/release structure, and when the pattern pays off. Best first read.",
        kind: "article",
      },
      {
        label: "Object Pool pattern — Game Programming Patterns (Robert Nystrom)",
        href: "https://gameprogrammingpatterns.com/object-pool.html",
        note: "A free, superbly-written book chapter on pooling. Uses game objects (particles) to explain reuse, fixed size, and why pooling helps avoid allocation and GC hitches. Includes real code.",
        kind: "book",
      },
      {
        label: "HikariCP — the standard Java JDBC connection pool",
        href: "https://github.com/brettwooldridge/HikariCP",
        note: "The real, production connection pool almost every Java app uses. Its docs and 'About Pool Sizing' wiki are a great look at how pool size, waiting, and timeouts work in practice.",
        kind: "docs",
      },
      {
        label: "Object pool pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Object_pool_pattern",
        note: "Concise reference covering the pattern's intent, the acquire/release lifecycle, handling of an exhausted pool, and the pitfalls (leaks, stale state, GC interaction).",
        kind: "docs",
      },
      {
        label: "About Pool Sizing — HikariCP wiki",
        href: "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing",
        note: "A famous, practical write-up on why bigger pools are often slower and how to size a connection pool. The best real-world answer to 'how big should my pool be?'.",
        kind: "article",
      },
      {
        label: "Object Pool Design Pattern (video)",
        href: "https://www.youtube.com/watch?v=cBRUYQENx7Q",
        note: "A short, visual walkthrough of the pattern: expensive objects, borrowing and returning from a fixed pool, and what happens when it runs out.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "object-pool-q1",
        question: "What problem does the Object Pool pattern primarily solve?",
        options: [
          { id: "a", label: "The cost of repeatedly creating and destroying objects that are expensive to build, like database connections." },
          { id: "b", label: "Making sure a class has exactly one instance for the whole program." },
          { id: "c", label: "Letting a method both return a value and change state at the same time." },
          { id: "d", label: "Converting one object's interface into another so incompatible classes can work together." },
        ],
        correctOptionId: "a",
        explanation:
          "Object Pool exists to avoid paying the high cost of creating expensive objects (a DB connection's handshake, a thread, a big buffer) over and over. It keeps a few ready-made ones and reuses them. Option (b) is Singleton and (d) is Adapter — different patterns entirely.",
      },
      {
        id: "object-pool-q2",
        question: "What is the correct lifecycle of a pooled object?",
        options: [
          { id: "a", label: "Acquire it from the pool, use it, then release it back to the pool for the next caller." },
          { id: "b", label: "Create it with new, use it once, and destroy it immediately." },
          { id: "c", label: "Copy it, mutate the copy, and discard the original." },
          { id: "d", label: "Acquire it and keep it forever so no one else can ever use it." },
        ],
        correctOptionId: "a",
        explanation:
          "The pattern is a loop: acquire (borrow a ready object), use (do your work), release (return it, usually after a reset). Option (b) is exactly the no-pool behavior the pattern avoids, and (d) describes a leak that would starve the pool.",
      },
      {
        id: "object-pool-q3",
        question: "You serve 5,000 requests through a pool with a maximum size of 3. Roughly how many expensive objects get created?",
        options: [
          { id: "a", label: "About 3 — the pool reuses the same few objects for every request." },
          { id: "b", label: "About 5,000 — one new object per request." },
          { id: "c", label: "About 2,500 — one for every two requests." },
          { id: "d", label: "Zero — pooled objects are never actually created." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the heart of the pattern: reuse caps the number of objects *created* at the pool size. A pool of 3 builds at most 3 connections and recycles them across all 5,000 requests. Without a pool it would be ~5,000 creations, each with its own handshake.",
      },
      {
        id: "object-pool-q4",
        question: "All connections in a fixed-size pool are in use and another request arrives. What is the most common thing a pool does?",
        options: [
          { id: "a", label: "The request waits in a queue until a connection is released, then it gets that one." },
          { id: "b", label: "It silently ignores the request and returns nothing." },
          { id: "c", label: "It permanently deletes one of the in-use connections to free a slot." },
          { id: "d", label: "It crashes the whole program." },
        ],
        correctOptionId: "a",
        explanation:
          "The typical default is to block: the request waits in a queue until someone releases a connection, then the freed one is handed to the waiter. Some pools instead grow temporarily or reject/time out under overload, but waiting is the common behavior — and it's what protects the database from being flooded.",
      },
      {
        id: "object-pool-q5",
        question: "Which is a real failure mode specific to using an Object Pool?",
        options: [
          { id: "a", label: "Forgetting to release an object leaks it out of the pool, and enough leaks starve the pool so every request hangs waiting." },
          { id: "b", label: "The pool guarantees only one instance can ever exist, breaking multi-threading." },
          { id: "c", label: "Pooled objects can never hold any state at all." },
          { id: "d", label: "Reusing objects always makes garbage collection faster in every language." },
        ],
        correctOptionId: "a",
        explanation:
          "If a borrowed object is never released, it's gone from the pool forever; enough leaks and there's nothing left to hand out, so requests block indefinitely. A related trap is stale state — you must reset an object on release or the next caller sees leftover data. Option (d) is false: pooling cheap objects can actually hurt the collector.",
      },
    ],
  },
};
