import type { Roadmap } from "@/lib/types";

export const ROADMAPS: Roadmap[] = [
  {
    slug: "lld",
    title: "Low-Level Design",
    abbr: "LLD",
    description:
      "Go from raw object-oriented fundamentals to designing real, interview-ready systems — modeling, UML, SOLID, every design pattern, concurrency, and a graded ladder of machine-coding problems you can actually finish under a timer. Code examples lean on Java, but every concept is language-agnostic.",
    icon: "Boxes",
    status: "available",
    difficulty: "intermediate",
    estimatedTime: "10–12 weeks",
    tags: ["oop", "design-patterns", "solid", "machine-coding"],
    phases: [
      {
        title: "Object-Oriented Foundations",
        icon: "Boxes",
        duration: "~1 week",
        summary:
          "The bedrock everything else stands on. Get genuinely fluent here before reaching for patterns.",
        outcome:
          "Model any real-world entity as well-encapsulated objects and reason clearly about how they relate.",
        groups: [
          {
            items: [
              {
                title: "Classes & Objects",
                note: "Blueprints vs instances; fields, methods, constructors.",
                tag: "core",
                slug: "classes-and-objects",
              },
              {
                title: "Object lifecycle",
                note: "Construction, initialization, and cleanup / destructors.",
                slug: "object-lifecycle",
              },
              {
                title: "Encapsulation",
                note: "Hide state behind behavior; getters/setters done right.",
                tag: "core",
                slug: "encapsulation",
              },
              {
                title: "Abstraction",
                note: "Expose intent, hide the implementation details.",
                tag: "core",
                slug: "abstraction",
              },
              {
                title: "Inheritance",
                note: 'Reuse and specialization through an "is-a" relationship.',
                slug: "inheritance",
              },
              {
                title: "Polymorphism",
                note: "One interface, many forms; overriding vs overloading.",
                tag: "core",
                slug: "polymorphism",
              },
              {
                title: "Static vs instance members",
                note: "Class-level state and behavior vs per-object.",
                slug: "static-vs-instance",
              },
              {
                title: "Access modifiers",
                note: "public, private, protected, package — controlling visibility.",
                slug: "access-modifiers",
              },
              {
                title: "Abstract classes vs Interfaces",
                note: "Shared base vs pure contract — when to use which.",
                tag: "interview",
                slug: "abstract-vs-interfaces",
              },
              {
                title: "Composition vs Inheritance",
                note: 'Favor composition; "has-a" beats "is-a" more often than you think.',
                tag: "core",
                slug: "composition-vs-inheritance",
              },
              {
                title: "Association, Aggregation, Composition",
                note: "Object relationships and who owns whose lifecycle.",
                slug: "association-aggregation-composition",
              },
              {
                title: "Coupling & Cohesion",
                note: "The two metrics that quietly decide design quality.",
                tag: "core",
                slug: "coupling-and-cohesion",
              },
              {
                title: "equals(), hashCode() & identity",
                note: "Contracts that bite the moment objects enter collections.",
                slug: "equals-and-hashcode",
              },
              {
                title: "Immutability & value objects",
                note: "Objects that can't change are simpler and thread-safe by default.",
                slug: "immutability-and-value-objects",
              },
              {
                title: "Generics / Templates",
                note: "Type-safe reuse without casting everywhere.",
                slug: "generics-and-templates",
              },
              {
                title: "Enums & constants",
                note: "Modeling a fixed, finite set of options cleanly.",
                slug: "enums-and-constants",
              },
            ],
          },
        ],
      },
      {
        title: "OO Analysis & Modeling",
        icon: "Compass",
        duration: "3–4 days",
        summary:
          "The step most people skip — turning a fuzzy prompt into the right set of classes before any code exists.",
        outcome:
          "Translate a vague problem statement into clean entities, responsibilities, and APIs.",
        groups: [
          {
            items: [
              {
                title: "Requirement gathering & clarifying questions",
                note: "Pin down scope and assumptions before designing anything.",
                tag: "interview",
                slug: "requirement-gathering",
              },
              {
                title: "Identifying entities, attributes & behaviors",
                note: "Nouns become classes, verbs become methods.",
                tag: "core",
                slug: "identifying-entities",
              },
              {
                title: "Responsibility assignment (GRASP)",
                note: "Information Expert, Creator, Controller, and friends.",
                slug: "grasp-principles",
              },
              {
                title: "CRC cards",
                note: "Class–Responsibility–Collaborator brainstorming on paper.",
                slug: "crc-cards",
              },
              {
                title: "Domain modeling",
                note: "Entities, value objects, and services that mirror the real domain.",
                slug: "domain-modeling",
              },
              {
                title: "Designing the API first",
                note: "Agree on contracts and method signatures before implementing.",
                tag: "core",
                slug: "api-first-design",
              },
            ],
          },
        ],
      },
      {
        title: "UML & Diagramming",
        icon: "Workflow",
        duration: "3 days",
        summary:
          "A shared visual language so you can communicate a design — and get feedback — before writing code.",
        outcome:
          "Sketch a system's structure and behavior in diagrams anyone on the team can read.",
        groups: [
          {
            items: [
              {
                title: "Class diagrams",
                note: "Structure, relationships, multiplicity — the LLD workhorse.",
                tag: "core",
                slug: "class-diagrams",
              },
              {
                title: "Object diagrams",
                note: "A concrete snapshot of instances at one moment.",
                slug: "object-diagrams",
              },
              {
                title: "Sequence diagrams",
                note: "How objects collaborate over time, message by message.",
                tag: "interview",
                slug: "sequence-diagrams",
              },
              {
                title: "Use case diagrams",
                note: "Actors and the goals they pursue with the system.",
                slug: "use-case-diagrams",
              },
              {
                title: "Activity diagrams",
                note: "Workflows, branches, and parallel paths.",
                slug: "activity-diagrams",
              },
              {
                title: "State diagrams",
                note: "An object's lifecycle and its valid transitions.",
                slug: "state-diagrams",
              },
              {
                title: "Component & deployment diagrams",
                note: "Zooming out to modules and where they run.",
                slug: "component-and-deployment-diagrams",
              },
              {
                title: "Relationship notation",
                note: "Association, dependency, generalization, realization.",
                slug: "relationship-notation",
              },
            ],
          },
        ],
      },
      {
        title: "SOLID Principles",
        icon: "Columns3",
        duration: "~1 week",
        summary:
          "Five principles that turn rigid, change-resistant code into designs that flex with new requirements.",
        outcome:
          "Spot violations in existing code and refactor toward flexible, testable structures.",
        groups: [
          {
            items: [
              {
                title: "Single Responsibility (SRP)",
                note: "A class should have one, and only one, reason to change.",
                tag: "core",
                slug: "single-responsibility",
              },
              {
                title: "Open/Closed (OCP)",
                note: "Open for extension, closed for modification.",
                tag: "core",
                slug: "open-closed",
              },
              {
                title: "Liskov Substitution (LSP)",
                note: "Subtypes must be usable anywhere their base type is.",
                tag: "interview",
                slug: "liskov-substitution",
              },
              {
                title: "Interface Segregation (ISP)",
                note: "Many small, focused interfaces beat one fat one.",
                slug: "interface-segregation",
              },
              {
                title: "Dependency Inversion (DIP)",
                note: "Depend on abstractions, never on concretions.",
                tag: "core",
                slug: "dependency-inversion",
              },
            ],
          },
        ],
      },
      {
        title: "Design Principles & Heuristics",
        icon: "Lightbulb",
        duration: "4 days",
        summary:
          "The everyday rules of thumb that guide the hundreds of small decisions patterns don't cover.",
        outcome:
          "Make sound, defensible design calls quickly without over-engineering.",
        groups: [
          {
            items: [
              {
                title: "DRY, KISS, YAGNI",
                slug: "dry-kiss-yagni",
                note: "Don't repeat yourself, keep it simple, don't build what you don't need.",
                tag: "core",
              },
              {
                title: "Law of Demeter",
                slug: "law-of-demeter",
                note: "Talk to your friends, not to strangers' internals.",
              },
              {
                title: "Separation of Concerns",
                slug: "separation-of-concerns",
                note: "Each module owns one well-defined job.",
              },
              {
                title: "Program to interfaces",
                slug: "program-to-interfaces",
                note: "Code against contracts, not concrete implementations.",
                tag: "core",
              },
              {
                title: "Dependency Injection & IoC",
                slug: "dependency-injection-and-ioc",
                note: "Hand dependencies in instead of creating them inside.",
                tag: "interview",
              },
              {
                title: "Injection styles: constructor vs setter vs field",
                slug: "injection-styles",
                note: "The trade-offs interviewers probe — and why constructor injection usually wins.",
                tag: "interview",
              },
              {
                title: "Tell, Don't Ask",
                slug: "tell-dont-ask",
                note: "Push behavior to the data instead of pulling data out.",
              },
              {
                title: "Command–Query Separation",
                slug: "command-query-separation",
                note: "A method either does something or answers something — not both.",
              },
            ],
          },
        ],
      },
      {
        title: "Design Patterns",
        icon: "Shapes",
        duration: "~3 weeks",
        summary:
          "Battle-tested solutions to problems that recur in every codebase, grouped by what they're for.",
        outcome:
          "Recognize a recurring problem on sight and reach for the right pattern (and know when not to).",
        groups: [
          {
            label: "Creational",
            items: [
              { title: "Singleton", note: "One shared instance, globally reachable." },
              { title: "Factory Method", note: "Defer which class to instantiate to subclasses." },
              { title: "Abstract Factory", note: "Create families of related objects." },
              { title: "Builder", note: "Assemble complex objects step by step." },
              { title: "Prototype", note: "Clone an existing object instead of building anew." },
              { title: "Object Pool", note: "Reuse expensive objects instead of recreating them." },
            ],
          },
          {
            label: "Structural",
            items: [
              { title: "Adapter", note: "Make incompatible interfaces work together." },
              { title: "Bridge", note: "Split abstraction from implementation so both can vary." },
              { title: "Composite", note: "Treat trees of objects like a single object." },
              { title: "Decorator", note: "Add behavior by wrapping, not subclassing." },
              { title: "Facade", note: "One simple front door to a complex subsystem." },
              { title: "Flyweight", note: "Share common state across many objects to save memory." },
              { title: "Proxy", note: "A stand-in that controls access to the real object." },
            ],
          },
          {
            label: "Behavioral",
            items: [
              { title: "Chain of Responsibility", note: "Pass a request along a chain of handlers." },
              { title: "Command", note: "Wrap an action as an object you can queue or undo." },
              { title: "Iterator", note: "Traverse a collection without exposing its internals." },
              { title: "Mediator", note: "Centralize tangled object-to-object communication." },
              { title: "Memento", note: "Capture and restore an object's state." },
              { title: "Observer", note: "Notify dependents automatically when state changes.", tag: "interview" },
              { title: "State", note: "Change behavior when the internal state changes." },
              { title: "Strategy", note: "Swap interchangeable algorithms at runtime.", tag: "interview" },
              { title: "Template Method", note: "Fix the skeleton, let subclasses fill the steps." },
              { title: "Visitor", note: "Add operations to a hierarchy without touching it." },
              { title: "Null Object", note: "A do-nothing default that removes null checks." },
            ],
          },
          {
            label: "Architectural",
            items: [
              { title: "MVC / MVP / MVVM", note: "Separating data, presentation, and control." },
              { title: "Repository", note: "Abstract data access behind a collection-like API." },
              { title: "Pub/Sub & Event-driven", note: "Decouple producers from consumers via events." },
            ],
          },
          {
            label: "Using patterns wisely",
            items: [
              {
                title: "Pattern overuse & anti-patterns",
                note: "Singleton abuse, speculative generality, and knowing when a pattern is the wrong call.",
                tag: "interview",
              },
            ],
          },
        ],
      },
      {
        title: "Concurrency & Thread Safety",
        icon: "GitFork",
        duration: "~1 week",
        summary:
          "Designing objects that stay correct when many threads touch them at the same time.",
        outcome:
          "Reason about shared state and pick the right primitive to keep it safe and live.",
        groups: [
          {
            items: [
              {
                title: "Threads & lifecycle",
                note: "Creating, starting, and coordinating threads.",
              },
              {
                title: "Locks, Mutex, Semaphore",
                note: "The core tools for guarding shared state.",
                tag: "core",
              },
              {
                title: "Thread-safe Singleton",
                note: "Double-checked locking and the holder idiom.",
                tag: "interview",
              },
              {
                title: "Producer–Consumer",
                note: "Bounded buffers and blocking queues.",
                tag: "interview",
              },
              {
                title: "Read-Write locks",
                note: "Let many readers in, one writer at a time.",
              },
              {
                title: "Deadlock, race conditions, starvation",
                note: "The three classic ways concurrency goes wrong.",
                tag: "core",
              },
              {
                title: "Atomic operations & CAS",
                note: "Lock-free updates with compare-and-swap.",
              },
              {
                title: "Memory visibility & the memory model",
                note: "volatile, happens-before, and why one thread sees another's stale values.",
                tag: "interview",
              },
              {
                title: "Thread pools & Executors",
                note: "Reuse a fixed set of workers instead of spawning threads.",
              },
              {
                title: "Futures, Promises & async",
                note: "Composing results that aren't ready yet.",
              },
              {
                title: "Immutable objects for safety",
                note: "Share freely when nothing can change underneath.",
              },
            ],
          },
        ],
      },
      {
        title: "Machine Coding Practice",
        icon: "TerminalSquare",
        duration: "3–4 weeks",
        summary:
          "Where everything converges — design and code a working system in 60–90 minutes under a timer.",
        outcome:
          "Walk into a machine-coding round and ship a clean, extensible solution on the clock.",
        groups: [
          {
            label: "The approach",
            items: [
              {
                title: "A repeatable 5-step framework",
                note: "Clarify → entities → APIs → class diagram → code → test.",
                tag: "interview",
              },
            ],
          },
          {
            label: "Beginner",
            items: [
              { title: "Parking Lot", note: "The canonical warm-up problem." },
              { title: "Vending Machine", note: "State machine over products and coins." },
              { title: "ATM", note: "Transactions, balances, and a state flow." },
              { title: "Tic-Tac-Toe", note: "Board, players, and win detection." },
              { title: "Snake & Ladder", note: "Dice, board, and turn management." },
              { title: "Coffee Machine", note: "Recipes, ingredients, and inventory." },
            ],
          },
          {
            label: "Intermediate",
            items: [
              { title: "Elevator / Lift system", note: "Scheduling and request dispatch." },
              { title: "Library Management", note: "Catalog, members, and loans." },
              { title: "Logging framework", note: "Levels, appenders, and formatting." },
              { title: "Rate Limiter", note: "Token bucket and sliding windows." },
              { title: "Notification system", note: "Channels, templates, and routing." },
              { title: "Cache (LRU / LFU)", note: "Eviction policy behind a clean API." },
              { title: "Splitwise", note: "Expenses, balances, and settlements." },
              { title: "Meeting room scheduler", note: "Intervals, conflicts, and booking." },
              { title: "In-memory key-value store", note: "Get/set with TTL and eviction." },
            ],
          },
          {
            label: "Advanced",
            items: [
              { title: "BookMyShow", note: "Seats, shows, and concurrent booking." },
              { title: "Food delivery (Swiggy / Zomato)", note: "Restaurants, carts, and dispatch." },
              { title: "Ride sharing (Uber / Ola)", note: "Matching, pricing, and trips." },
              { title: "Hotel booking", note: "Inventory, availability, and rates." },
              { title: "Chess", note: "Pieces, moves, and rule validation." },
              { title: "Stock exchange / Order matching", note: "Order book and a matching engine." },
              { title: "Online IDE / Code editor", note: "Files, sessions, and execution." },
              { title: "Distributed task scheduler", note: "Jobs, workers, and retries." },
            ],
          },
        ],
      },
      {
        title: "Testing, Refactoring & Clean Code",
        icon: "Sparkles",
        duration: "~1 week",
        summary:
          "Keeping a design healthy as it grows — spotting decay early and proving the thing actually works.",
        outcome:
          "Write code that's safe to change, and keep it that way over time.",
        groups: [
          {
            items: [
              {
                title: "Code smells & how to spot them",
                note: "The early warning signs of a decaying design.",
                tag: "core",
              },
              {
                title: "Refactoring techniques",
                note: "Extract, inline, rename, replace-conditional-with-polymorphism.",
              },
              {
                title: "Anti-patterns to avoid",
                note: "God object, spaghetti, golden hammer, and friends.",
              },
              {
                title: "Unit testing basics",
                note: "Arrange–act–assert and what makes a good test.",
                tag: "core",
              },
              {
                title: "Test doubles: mocks, stubs, fakes",
                note: "Isolating the unit under test from its collaborators.",
              },
              {
                title: "TDD basics",
                note: "Red → green → refactor as a design tool.",
              },
              {
                title: "Writing testable code",
                note: "Seams, dependency injection, and pure functions.",
                tag: "core",
              },
              {
                title: "Clean code principles",
                note: "Naming, small functions, and comments that earn their place.",
              },
              {
                title: "Design & code review checklist",
                note: "A repeatable lens for catching problems before they ship.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "dsa",
    title: "Data Structures & Algorithms",
    abbr: "DSA",
    description:
      "From arrays and recursion to graphs, dynamic programming, and the recurring patterns that crack coding interviews.",
    icon: "Binary",
    status: "coming-soon",
    difficulty: "intermediate",
    estimatedTime: "12–16 weeks",
    tags: ["algorithms", "data-structures", "problem-solving"],
    phases: [],
  },
  {
    slug: "hld",
    title: "High-Level Design",
    abbr: "HLD",
    description:
      "Scale from a single server to globally distributed systems. Master the building blocks — networking, databases, caching, queues, consistency, and resilience — then put them together on the classic system-design interview problems, from a URL shortener to a global ride-sharing platform.",
    icon: "Network",
    status: "available",
    difficulty: "advanced",
    estimatedTime: "12–16 weeks",
    tags: ["system-design", "distributed", "scalability", "interview"],
    phases: [
      {
        title: "Foundations & Mindset",
        icon: "Compass",
        duration: "3–4 days",
        summary:
          "What system design actually is, the vocabulary of trade-offs, and the napkin math you'll use in every single problem.",
        outcome:
          "Frame any problem in terms of requirements and constraints, and estimate scale before drawing a single box.",
        groups: [
          {
            items: [
              {
                title: "What is system design? HLD vs LLD",
                note: "Where high-level design ends and class-level design begins.",
                tag: "core",
              },
              {
                title: "Functional vs non-functional requirements",
                note: "What the system does vs how well it must do it.",
                tag: "core",
              },
              {
                title: "The core qualities",
                note: "Scalability, availability, reliability, maintainability — defined precisely.",
                tag: "core",
              },
              {
                title: "Latency vs throughput",
                note: "Response time of one request vs requests served per second.",
                tag: "interview",
              },
              {
                title: "Back-of-the-envelope estimation",
                note: "QPS, storage, bandwidth, and memory math under pressure.",
                tag: "interview",
              },
              {
                title: "Numbers every engineer should know",
                note: "Latency of cache, memory, SSD, disk, and a cross-continent round trip.",
                tag: "core",
              },
              {
                title: "Powers of two & data-size units",
                note: "KB→PB, and turning users into bytes quickly.",
              },
              {
                title: "From one server to a distributed system",
                note: "The evolution every architecture walks through as it grows.",
                tag: "core",
              },
              {
                title: "Everything is a trade-off",
                note: "Why there is no perfect design — only the right one for the constraints.",
                tag: "core",
              },
              {
                title: "Push vs pull",
                note: "The reusable primitive behind feeds, polling, and notifications — who initiates the data transfer.",
                tag: "core",
              },
              {
                title: "Cost-aware architecture",
                note: "Cost per request as a first-class design axis — what senior+ interviews increasingly probe.",
                tag: "interview",
              },
            ],
          },
        ],
      },
      {
        title: "Networking & Communication",
        icon: "Network",
        duration: "~1 week",
        summary:
          "How bytes actually move between machines — the protocols and API styles every distributed system is built on.",
        outcome:
          "Choose the right communication style (REST, gRPC, WebSockets…) and explain what happens from URL to response.",
        groups: [
          {
            label: "The network stack",
            items: [
              {
                title: "How the internet works",
                note: "Clients, servers, IP addressing, and packets end to end.",
                tag: "core",
              },
              {
                title: "TCP vs UDP",
                note: "Reliable ordered streams vs fast fire-and-forget.",
                tag: "core",
              },
              {
                title: "DNS & name resolution",
                note: "Turning a domain into an IP, with caching at every hop.",
                tag: "interview",
              },
              {
                title: "HTTP & HTTPS",
                note: "Methods, status codes, headers, and statelessness.",
                tag: "core",
              },
              {
                title: "HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)",
                note: "Head-of-line blocking, multiplexing, and the move to UDP.",
                tag: "deep-dive",
              },
              {
                title: "TLS/SSL handshake",
                note: "How encryption and identity get established before data flows.",
              },
            ],
          },
          {
            label: "API & communication styles",
            items: [
              {
                title: "REST API design",
                note: "Resources, verbs, status codes, pagination, and versioning.",
                tag: "core",
              },
              {
                title: "RPC & gRPC",
                note: "Call a remote function like a local one; HTTP/2 + Protobuf, with unary and streaming calls.",
                tag: "interview",
              },
              {
                title: "GraphQL",
                note: "Client-driven queries that fetch exactly what's needed.",
              },
              {
                title: "WebSockets",
                note: "Full-duplex, persistent connections for real-time apps.",
                tag: "interview",
              },
              {
                title: "Polling, long polling & SSE",
                note: "Three ways to fake or stream server-push over HTTP.",
              },
              {
                title: "Webhooks",
                note: "Let a service call you back instead of you polling it.",
              },
              {
                title: "Serialization formats",
                note: "JSON vs Protobuf vs Avro vs Thrift — size and schema trade-offs.",
              },
              {
                title: "API Gateway",
                note: "One entry point for routing, auth, rate limiting, and aggregation.",
                tag: "core",
              },
            ],
          },
        ],
      },
      {
        title: "Scaling Fundamentals",
        icon: "TrendingUp",
        duration: "~1 week",
        summary:
          "The first moves you make when one server is no longer enough — spreading load across many.",
        outcome:
          "Take a single-server app and scale it horizontally behind a load balancer and a CDN.",
        groups: [
          {
            items: [
              {
                title: "Vertical vs horizontal scaling",
                note: "Bigger machine vs more machines — and why scale-out wins eventually.",
                tag: "core",
              },
              {
                title: "Stateless vs stateful services",
                note: "Why statelessness is the key that unlocks horizontal scaling.",
                tag: "core",
              },
              {
                title: "Load balancing",
                note: "Spreading traffic across servers; L4 (transport) vs L7 (application).",
                tag: "core",
              },
              {
                title: "Load balancing algorithms",
                note: "Round robin, least connections, weighted, IP/consistent hashing.",
                tag: "interview",
              },
              {
                title: "Reverse proxy vs forward proxy",
                note: "Who they hide — the servers or the clients.",
              },
              {
                title: "Content Delivery Network (CDN)",
                note: "Serve static (and edge) content from close to the user.",
                tag: "core",
              },
              {
                title: "Sticky sessions",
                note: "Pinning a user to a server — and why you usually shouldn't.",
              },
              {
                title: "Health checks & auto-scaling",
                note: "Detect dead instances and add/remove capacity automatically.",
              },
              {
                title: "Geo-distribution & multi-region",
                note: "Active-active across regions, latency-based DNS routing, and data-residency constraints.",
                tag: "interview",
              },
            ],
          },
        ],
      },
      {
        title: "Databases & Storage",
        icon: "Database",
        duration: "~1.5 weeks",
        summary:
          "The single most important decision in most designs: where and how the data lives.",
        outcome:
          "Pick the right database type for a workload and justify SQL vs NoSQL with confidence.",
        groups: [
          {
            label: "Relational foundations",
            items: [
              {
                title: "Relational databases & SQL",
                note: "Tables, rows, joins, and the relational model.",
                tag: "core",
              },
              {
                title: "ACID properties",
                note: "Atomicity, consistency, isolation, durability — what they guarantee.",
                tag: "core",
              },
              {
                title: "Transaction isolation levels",
                note: "Read-committed → serializable, and the anomalies each allows.",
                tag: "deep-dive",
              },
              {
                title: "Normalization vs denormalization",
                note: "Remove redundancy for writes, or duplicate it for fast reads.",
                tag: "interview",
              },
              {
                title: "Indexing",
                note: "B-tree, hash, composite, and covering indexes — speed vs write cost.",
                tag: "core",
              },
            ],
          },
          {
            label: "NoSQL & storage types",
            items: [
              {
                title: "SQL vs NoSQL — when to use which",
                note: "The single most common database question in interviews.",
                tag: "interview",
              },
              {
                title: "Key-value stores",
                note: "The simplest, fastest model — Redis, DynamoDB.",
                tag: "core",
              },
              {
                title: "Document databases",
                note: "Flexible JSON-like documents — MongoDB, Couchbase.",
              },
              {
                title: "Wide-column stores",
                note: "Sparse, huge tables for write-heavy scale — Cassandra, Bigtable.",
                tag: "deep-dive",
              },
              {
                title: "Graph databases",
                note: "Nodes and edges for relationship-heavy data — Neo4j.",
              },
              {
                title: "Time-series databases",
                note: "Optimized for metrics and append-only timestamps — InfluxDB.",
              },
              {
                title: "Blob / object vs block vs file storage",
                note: "S3 vs a disk volume vs a filesystem — what each is for.",
                tag: "core",
              },
            ],
          },
          {
            label: "Under the hood",
            items: [
              {
                title: "B-tree vs LSM-tree storage engines",
                note: "Read-optimized vs write-optimized — the core engine trade-off.",
                tag: "deep-dive",
              },
              {
                title: "Write-ahead log (WAL)",
                note: "How databases stay durable through a crash.",
              },
            ],
          },
        ],
      },
      {
        title: "Scaling the Database",
        icon: "Layers",
        duration: "~1 week",
        summary:
          "When one database can't keep up, you replicate it for reads and shard it for writes — each with sharp edges.",
        outcome:
          "Design a data tier that survives node failure and scales past a single machine's limits.",
        groups: [
          {
            items: [
              {
                title: "Replication",
                note: "Leader-follower, multi-leader, and leaderless — copies for safety and reads.",
                tag: "core",
              },
              {
                title: "Read replicas & replication lag",
                note: "Scale reads, but reckon with stale followers.",
                tag: "interview",
              },
              {
                title: "Sharding / partitioning",
                note: "Split one dataset across many nodes — horizontal vs vertical.",
                tag: "core",
              },
              {
                title: "Partitioning strategies",
                note: "Range, hash, and directory-based — and their hot-spot risks.",
                tag: "interview",
              },
              {
                title: "Consistent hashing",
                note: "Add/remove nodes while moving the fewest keys — the classic.",
                tag: "interview",
              },
              {
                title: "Database federation",
                note: "Split databases by feature/function instead of by row.",
              },
              {
                title: "Quorum reads & writes",
                note: "The R + W > N rule that tunes consistency vs availability.",
                tag: "deep-dive",
              },
              {
                title: "Rebalancing & hot partitions",
                note: "Keeping shards even as data and traffic skew over time.",
              },
              {
                title: "Connection pooling",
                note: "Reuse expensive DB connections instead of reopening them.",
              },
              {
                title: "Online migrations & schema evolution",
                note: "Backfills, dual-writes, and expand-contract — changing a live schema at scale without downtime.",
                tag: "deep-dive",
              },
            ],
          },
        ],
      },
      {
        title: "Caching",
        icon: "Zap",
        duration: "4–5 days",
        summary:
          "The highest-leverage performance tool there is — and the one with the most famously hard problem (invalidation).",
        outcome:
          "Place caches at the right layers, choose read/write strategies, and avoid stampedes and stale data.",
        groups: [
          {
            items: [
              {
                title: "Why & where to cache",
                note: "Client, CDN, application, and database layers.",
                tag: "core",
              },
              {
                title: "Cache-aside (lazy loading)",
                note: "The default: app checks cache, falls back to the DB, backfills.",
                tag: "core",
              },
              {
                title: "Read-through caching",
                note: "The cache itself loads from the source on a miss.",
              },
              {
                title: "Write-through, write-back, write-around",
                note: "Three ways to keep cache and database in sync on writes.",
                tag: "interview",
              },
              {
                title: "Eviction policies",
                note: "LRU, LFU, FIFO, and TTL — deciding what to drop.",
                tag: "core",
              },
              {
                title: "Distributed caching",
                note: "Redis vs Memcached, and sharding the cache itself.",
                tag: "interview",
              },
              {
                title: "Cache invalidation",
                note: "Keeping cached data fresh — the genuinely hard part.",
                tag: "core",
              },
              {
                title: "Cache stampede & hot keys",
                note: "Thundering herds on expiry, and one key melting one node.",
                tag: "deep-dive",
              },
              {
                title: "Negative caching",
                note: "Cache the 'not found' too, so misses don't hammer the database.",
              },
            ],
          },
        ],
      },
      {
        title: "Distributed Systems Theory",
        icon: "Share2",
        duration: "~1.5 weeks",
        summary:
          "The hard truths of running across many unreliable machines — the theory that explains why distributed design is hard.",
        outcome:
          "Reason precisely about consistency, availability, and agreement when nodes and networks fail.",
        groups: [
          {
            label: "The fundamental trade-offs",
            items: [
              {
                title: "CAP theorem",
                note: "Under a partition, choose consistency or availability — not both.",
                tag: "interview",
              },
              {
                title: "PACELC theorem",
                note: "CAP's missing half: latency vs consistency when there's no partition.",
                tag: "deep-dive",
              },
              {
                title: "Consistency models",
                note: "Strong, eventual, causal, and read-your-writes — a spectrum.",
                tag: "core",
              },
              {
                title: "ACID vs BASE",
                note: "Strict transactions vs basically-available, eventually-consistent.",
                tag: "interview",
              },
            ],
          },
          {
            label: "Agreement & coordination",
            items: [
              {
                title: "Consensus: Paxos & Raft",
                note: "How a cluster agrees on a value despite failures.",
                tag: "deep-dive",
              },
              {
                title: "Leader election",
                note: "Picking one coordinator, and re-picking when it dies.",
              },
              {
                title: "Two-phase & three-phase commit",
                note: "Atomic commits across services — and why 2PC blocks.",
                tag: "deep-dive",
              },
              {
                title: "Saga pattern",
                note: "Long-running distributed transactions via compensating steps.",
                tag: "interview",
              },
              {
                title: "Idempotency",
                note: "Make retries safe so 'do it twice' equals 'do it once'.",
                tag: "core",
              },
              {
                title: "Distributed locks",
                note: "Mutual exclusion across machines — fencing tokens included.",
              },
            ],
          },
          {
            label: "Time, ordering & detection",
            items: [
              {
                title: "Logical & vector clocks",
                note: "Ordering events without trusting wall-clock time.",
                tag: "deep-dive",
              },
              {
                title: "CRDTs",
                note: "Data types that merge concurrent edits without conflict.",
                tag: "deep-dive",
              },
              {
                title: "Heartbeats & failure detection",
                note: "Deciding a node is dead when you can't be sure.",
              },
              {
                title: "Gossip protocol",
                note: "Spread cluster state epidemic-style, node to node.",
              },
            ],
          },
        ],
      },
      {
        title: "Asynchronous Processing & Messaging",
        icon: "Workflow",
        duration: "~1 week",
        summary:
          "Decouple work in time — accept now, process later — the backbone of resilient, scalable systems.",
        outcome:
          "Design event-driven flows with queues and streams, and reason about delivery guarantees.",
        groups: [
          {
            items: [
              {
                title: "Synchronous vs asynchronous communication",
                note: "Wait for the answer vs hand it off and move on.",
                tag: "core",
              },
              {
                title: "Message queues",
                note: "Buffer and smooth bursts of work between producer and consumer.",
                tag: "core",
              },
              {
                title: "Publish / subscribe",
                note: "Fan one event out to many independent consumers.",
                tag: "interview",
              },
              {
                title: "Kafka deep dive",
                note: "Partitions, offsets, consumer groups, and the log abstraction.",
                tag: "interview",
              },
              {
                title: "RabbitMQ, SQS & brokers",
                note: "Smart-broker queues vs the dumb-broker log model.",
              },
              {
                title: "Event-driven architecture",
                note: "Services that react to events instead of calling each other.",
                tag: "core",
              },
              {
                title: "Delivery guarantees",
                note: "At-most-once, at-least-once, exactly-once — and the catch.",
                tag: "interview",
              },
              {
                title: "Dead letter queues",
                note: "Where messages go when they can't be processed.",
              },
              {
                title: "Backpressure",
                note: "What to do when producers outrun consumers.",
                tag: "deep-dive",
              },
              {
                title: "Stream processing",
                note: "Continuous computation over unbounded event streams.",
              },
              {
                title: "Job scheduling & batch processing",
                note: "Cron, distributed schedulers, and big offline jobs.",
              },
            ],
          },
        ],
      },
      {
        title: "Architecture & System Components",
        icon: "Building2",
        duration: "~1 week",
        summary:
          "How to slice a system into services — and the patterns that keep that slicing from becoming a distributed mess.",
        outcome:
          "Argue monolith vs microservices on the merits, and apply the right structural pattern.",
        groups: [
          {
            items: [
              {
                title: "Monolith vs microservices",
                note: "The central architecture debate — and when each one wins.",
                tag: "interview",
              },
              {
                title: "Service-oriented architecture (SOA)",
                note: "The enterprise ancestor of microservices.",
              },
              {
                title: "Microservices patterns & pitfalls",
                note: "Decomposition, the distributed monolith trap, and data ownership.",
                tag: "core",
              },
              {
                title: "API Gateway & BFF",
                note: "A single edge, and a backend tailored per client.",
                tag: "core",
              },
              {
                title: "Service discovery",
                note: "How services find each other's moving addresses.",
              },
              {
                title: "Service mesh & sidecar",
                note: "Push networking concerns out of app code into the platform.",
                tag: "deep-dive",
              },
              {
                title: "Event sourcing",
                note: "Store the stream of changes, not just the current state.",
                tag: "deep-dive",
              },
              {
                title: "CQRS",
                note: "Separate the write model from the read model.",
                tag: "interview",
              },
              {
                title: "Serverless / FaaS",
                note: "Run functions without managing servers — and the cold-start cost.",
              },
              {
                title: "Multi-tenancy",
                note: "Serving many customers from shared (or isolated) infrastructure.",
              },
            ],
          },
        ],
      },
      {
        title: "Reliability, Resilience & Fault Tolerance",
        icon: "ShieldCheck",
        duration: "~1 week",
        summary:
          "Everything fails eventually — design so that a failed part degrades gracefully instead of taking the system down.",
        outcome:
          "Build systems that bend instead of break, and put real numbers on availability.",
        groups: [
          {
            items: [
              {
                title: "Redundancy & eliminating single points of failure",
                note: "No one component whose death kills the system.",
                tag: "core",
              },
              {
                title: "Failover: active-passive vs active-active",
                note: "Standby that takes over vs all nodes serving at once.",
                tag: "interview",
              },
              {
                title: "Circuit breaker",
                note: "Stop hammering a failing dependency; fail fast and recover.",
                tag: "interview",
              },
              {
                title: "Retries, backoff & jitter",
                note: "Retry safely without creating a retry storm.",
                tag: "core",
              },
              {
                title: "Timeouts",
                note: "Never wait forever — bound every external call.",
                tag: "core",
              },
              {
                title: "Bulkhead pattern",
                note: "Isolate resources so one overload can't sink everything.",
              },
              {
                title: "Rate limiting & throttling",
                note: "Token bucket, leaky bucket, sliding window — protecting capacity.",
                tag: "interview",
              },
              {
                title: "Load shedding",
                note: "Drop or prioritize requests under overload so the system survives instead of collapsing.",
                tag: "deep-dive",
              },
              {
                title: "Graceful degradation & fallbacks",
                note: "Serve something useful when a dependency is down.",
                tag: "core",
              },
              {
                title: "Availability math & nines",
                note: "What 99.9% vs 99.999% actually costs in downtime.",
                tag: "interview",
              },
              {
                title: "Disaster recovery (RTO / RPO)",
                note: "How fast you recover and how much data you can lose.",
              },
              {
                title: "Chaos engineering",
                note: "Break things on purpose to find weaknesses first.",
                tag: "deep-dive",
              },
              {
                title: "SLA, SLO & SLI",
                note: "Promises, targets, and the metrics behind them.",
                tag: "core",
              },
            ],
          },
        ],
      },
      {
        title: "Observability, Deployment & Operations",
        icon: "Activity",
        duration: "4–5 days",
        summary:
          "You can't operate what you can't see — and you can't move fast without safe ways to ship.",
        outcome:
          "Instrument a system end to end and ship changes without taking it down.",
        groups: [
          {
            label: "Observability",
            items: [
              {
                title: "The three pillars: logs, metrics, traces",
                note: "What each tells you, and why you need all three.",
                tag: "core",
              },
              {
                title: "Centralized & structured logging",
                note: "Aggregating logs across many machines into one searchable place.",
              },
              {
                title: "Metrics & monitoring",
                note: "Dashboards, percentiles (p50/p99), and what to actually measure.",
                tag: "interview",
              },
              {
                title: "Distributed tracing",
                note: "Follow one request across many services.",
                tag: "deep-dive",
              },
              {
                title: "Alerting & on-call",
                note: "Page on symptoms, not causes — and avoid alert fatigue.",
              },
            ],
          },
          {
            label: "Delivery & infrastructure",
            items: [
              {
                title: "Deployment strategies",
                note: "Blue-green, canary, and rolling releases.",
                tag: "interview",
              },
              {
                title: "CI/CD pipelines",
                note: "Automated build, test, and release on every commit.",
                tag: "core",
              },
              {
                title: "Containers (Docker)",
                note: "Package an app with its environment so it runs anywhere.",
                tag: "core",
              },
              {
                title: "Orchestration (Kubernetes)",
                note: "Schedule, scale, and self-heal containers across a cluster.",
                tag: "interview",
              },
              {
                title: "Infrastructure as code",
                note: "Provision infra from versioned, reviewable definitions.",
              },
              {
                title: "Feature flags",
                note: "Ship dark, roll out gradually, and kill a feature instantly.",
              },
            ],
          },
        ],
      },
      {
        title: "Security & Privacy",
        icon: "Lock",
        duration: "4–5 days",
        summary:
          "The cross-cutting concern interviewers expect you to bring up unprompted — at least at the edges.",
        outcome:
          "Reason about authn/authz, protect data in transit and at rest, and name the common attack surfaces.",
        groups: [
          {
            items: [
              {
                title: "Authentication vs authorization",
                note: "Who you are vs what you're allowed to do.",
                tag: "core",
              },
              {
                title: "OAuth 2.0 & OpenID Connect",
                note: "Delegated access and 'log in with…' done right.",
                tag: "interview",
              },
              {
                title: "JWT & session management",
                note: "Stateless tokens vs server-side sessions — the trade-offs.",
                tag: "interview",
              },
              {
                title: "Encryption in transit & at rest",
                note: "TLS on the wire, and encrypted storage on disk.",
                tag: "core",
              },
              {
                title: "Hashing & salting",
                note: "Storing passwords so a breach doesn't reveal them.",
                tag: "core",
              },
              {
                title: "API security & keys",
                note: "Auth, scoping, and per-client rate limits at the gateway.",
              },
              {
                title: "DDoS protection",
                note: "Absorbing or shedding floods of malicious traffic.",
              },
              {
                title: "OWASP Top 10",
                note: "The most common web vulnerabilities, and the defenses.",
                tag: "deep-dive",
              },
              {
                title: "Secrets management",
                note: "Keeping keys and credentials out of code and config.",
              },
              {
                title: "Privacy & compliance (GDPR)",
                note: "Data residency, retention, and the right to be forgotten.",
              },
            ],
          },
        ],
      },
      {
        title: "Search, Big Data & Analytics",
        icon: "Search",
        duration: "~1 week",
        summary:
          "Specialized building blocks for search-heavy and data-heavy systems — and the probabilistic tricks that make scale affordable.",
        outcome:
          "Add full-text search, geo-queries, and analytics pipelines to a design when the problem calls for them.",
        groups: [
          {
            label: "Search & geo",
            items: [
              {
                title: "Full-text search & inverted index",
                note: "The data structure behind every search box.",
                tag: "interview",
              },
              {
                title: "Elasticsearch & search engines",
                note: "Indexing, relevance ranking, and the search cluster.",
              },
              {
                title: "Geospatial indexing",
                note: "Geohash and quadtrees for 'find places near me'.",
                tag: "deep-dive",
              },
            ],
          },
          {
            label: "Data & analytics",
            items: [
              {
                title: "OLTP vs OLAP",
                note: "Transaction systems vs analytical query systems.",
                tag: "core",
              },
              {
                title: "Data warehouse, lake & lakehouse",
                note: "Where analytical data lives — structured to raw.",
              },
              {
                title: "ETL / ELT pipelines",
                note: "Moving and reshaping data between systems.",
              },
              {
                title: "Batch processing (MapReduce, Spark)",
                note: "Crunching huge datasets offline, in parallel.",
                tag: "deep-dive",
              },
              {
                title: "Lambda & Kappa architectures",
                note: "Combining (or unifying) batch and streaming paths.",
                tag: "deep-dive",
              },
            ],
          },
          {
            label: "Probabilistic structures",
            items: [
              {
                title: "Bloom filters",
                note: "Cheaply test 'is this definitely not present?'",
                tag: "interview",
              },
              {
                title: "HyperLogLog & Count-Min Sketch",
                note: "Approximate cardinality and frequency at huge scale.",
                tag: "deep-dive",
              },
            ],
          },
        ],
      },
      {
        title: "The System Design Interview Framework",
        icon: "Target",
        duration: "3–4 days",
        summary:
          "A repeatable structure so you never freeze at the whiteboard — drive the conversation instead of being driven.",
        outcome:
          "Walk into any open-ended design round with a step-by-step method and the language to defend your choices.",
        groups: [
          {
            items: [
              {
                title: "A repeatable 6-step framework",
                note: "Clarify → estimate → API → data → high-level → deep-dive.",
                tag: "interview",
              },
              {
                title: "Clarifying requirements & scoping",
                note: "Nail functional, non-functional, and what's out of scope.",
                tag: "interview",
              },
              {
                title: "Capacity estimation in the room",
                note: "Turn DAU into QPS, storage, and bandwidth on the spot.",
                tag: "interview",
              },
              {
                title: "Defining the API",
                note: "The endpoints that pin down what you're actually building.",
                tag: "core",
              },
              {
                title: "Data modeling & storage choice",
                note: "Schema, access patterns, and SQL-vs-NoSQL justification.",
                tag: "core",
              },
              {
                title: "Drawing the high-level architecture",
                note: "Boxes, arrows, and the happy-path data flow.",
                tag: "interview",
              },
              {
                title: "Identifying & resolving bottlenecks",
                note: "Where it breaks at 10x, and how you'd fix it.",
                tag: "interview",
              },
              {
                title: "Discussing trade-offs",
                note: "Naming what you gave up — the mark of a senior answer.",
                tag: "core",
              },
              {
                title: "Common mistakes to avoid",
                note: "Over-engineering, silent assumptions, and skipping estimation.",
              },
            ],
          },
        ],
      },
      {
        title: "Classic System Design Case Studies",
        icon: "BookOpen",
        duration: "4–6 weeks",
        summary:
          "Where it all comes together — the canonical problems, from a warm-up URL shortener to a globally distributed platform.",
        outcome:
          "Confidently design any of the famous interview systems end to end, on the clock.",
        groups: [
          {
            label: "Warm-ups & infrastructure",
            items: [
              { title: "URL shortener (TinyURL)", note: "The canonical first problem — encoding, redirects, scale.", tag: "interview" },
              { title: "Pastebin", note: "Store and serve large text blobs with expiry." },
              { title: "Unique ID generator", note: "Distributed, sortable IDs — Snowflake-style.", tag: "interview" },
              { title: "Distributed rate limiter", note: "Enforce limits across many servers.", tag: "interview" },
              { title: "Distributed key-value store", note: "Replication, partitioning, and quorum from scratch.", tag: "deep-dive" },
              { title: "Distributed cache", note: "Sharded, replicated caching as a service." },
              { title: "Distributed message queue", note: "Build the queue everyone else depends on." },
              { title: "Distributed job scheduler", note: "Run jobs reliably across a fleet, with retries." },
            ],
          },
          {
            label: "Social, feed & messaging",
            items: [
              { title: "Twitter / X", note: "Tweets, follows, and the timeline at scale.", tag: "interview" },
              { title: "News feed system", note: "Fan-out on write vs read — the classic trade-off.", tag: "interview" },
              { title: "Instagram", note: "Media upload, feed, and the social graph." },
              { title: "WhatsApp / Messenger", note: "Real-time delivery, presence, and ordering.", tag: "interview" },
              { title: "Notification system", note: "Push, SMS, and email fan-out across channels.", tag: "interview" },
              { title: "Typeahead / autocomplete", note: "Suggestions in milliseconds from a trie at scale." },
            ],
          },
          {
            label: "Media, location & marketplace",
            items: [
              { title: "YouTube / Netflix", note: "Upload, transcode, store, and stream video globally.", tag: "interview" },
              { title: "Dropbox / Google Drive", note: "Sync, chunking, dedup, and conflict resolution." },
              { title: "Uber / Lyft", note: "Matching riders to drivers in real time with geo.", tag: "interview" },
              { title: "Google Maps / nearby places", note: "Geospatial indexing and routing at planet scale.", tag: "deep-dive" },
              { title: "Ticketmaster / BookMyShow", note: "Inventory, holds, and the concurrent-booking race." },
              { title: "Web crawler", note: "Crawl the web politely, dedup, and stay fresh.", tag: "deep-dive" },
            ],
          },
          {
            label: "Commerce, payments & analytics",
            items: [
              { title: "E-commerce (Amazon)", note: "Catalog, cart, inventory, and order pipeline." },
              { title: "Payment system", note: "Idempotency, ledgers, and exactly-once money movement.", tag: "interview" },
              { title: "Ad click aggregation", note: "Count billions of events accurately, fast.", tag: "deep-dive" },
              { title: "Stock exchange / order matching", note: "Low-latency order book and matching engine.", tag: "deep-dive" },
              { title: "Top-K / trending", note: "Heavy hitters over a massive stream." },
              { title: "Metrics & monitoring system", note: "Ingest, store, and query time-series at scale." },
            ],
          },
        ],
      },
    ],
  },
];

export function getRoadmap(slug: string): Roadmap | undefined {
  return ROADMAPS.find((r) => r.slug === slug);
}

export function roadmapTopicCount(roadmap: Roadmap): number {
  return roadmap.phases.reduce(
    (total, phase) =>
      total + phase.groups.reduce((sum, group) => sum + group.items.length, 0),
    0,
  );
}
