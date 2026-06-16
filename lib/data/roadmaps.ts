import type { Roadmap } from "@/lib/types";

export const ROADMAPS: Roadmap[] = [
  {
    slug: "lld",
    title: "Low-Level Design",
    abbr: "LLD",
    description:
      "Go from raw object-oriented fundamentals to designing real, interview-ready systems — modeling, UML, SOLID, every design pattern, concurrency, and a graded ladder of machine-coding problems you can actually finish under a timer.",
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
              },
              {
                title: "Identifying entities, attributes & behaviors",
                note: "Nouns become classes, verbs become methods.",
                tag: "core",
              },
              {
                title: "Responsibility assignment (GRASP)",
                note: "Information Expert, Creator, Controller, and friends.",
              },
              {
                title: "CRC cards",
                note: "Class–Responsibility–Collaborator brainstorming on paper.",
              },
              {
                title: "Domain modeling",
                note: "Entities, value objects, and services that mirror the real domain.",
              },
              {
                title: "Designing the API first",
                note: "Agree on contracts and method signatures before implementing.",
                tag: "core",
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
              },
              {
                title: "Object diagrams",
                note: "A concrete snapshot of instances at one moment.",
              },
              {
                title: "Sequence diagrams",
                note: "How objects collaborate over time, message by message.",
                tag: "interview",
              },
              {
                title: "Use case diagrams",
                note: "Actors and the goals they pursue with the system.",
              },
              {
                title: "Activity diagrams",
                note: "Workflows, branches, and parallel paths.",
              },
              {
                title: "State diagrams",
                note: "An object's lifecycle and its valid transitions.",
              },
              {
                title: "Component & deployment diagrams",
                note: "Zooming out to modules and where they run.",
              },
              {
                title: "Relationship notation",
                note: "Association, dependency, generalization, realization.",
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
              },
              {
                title: "Open/Closed (OCP)",
                note: "Open for extension, closed for modification.",
                tag: "core",
              },
              {
                title: "Liskov Substitution (LSP)",
                note: "Subtypes must be usable anywhere their base type is.",
                tag: "interview",
              },
              {
                title: "Interface Segregation (ISP)",
                note: "Many small, focused interfaces beat one fat one.",
              },
              {
                title: "Dependency Inversion (DIP)",
                note: "Depend on abstractions, never on concretions.",
                tag: "core",
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
                note: "Don't repeat yourself, keep it simple, don't build what you don't need.",
                tag: "core",
              },
              {
                title: "Law of Demeter",
                note: "Talk to your friends, not to strangers' internals.",
              },
              {
                title: "Separation of Concerns",
                note: "Each module owns one well-defined job.",
              },
              {
                title: "Program to interfaces",
                note: "Code against contracts, not concrete implementations.",
                tag: "core",
              },
              {
                title: "Dependency Injection & IoC",
                note: "Hand dependencies in instead of creating them inside.",
                tag: "interview",
              },
              {
                title: "Tell, Don't Ask",
                note: "Push behavior to the data instead of pulling data out.",
              },
              {
                title: "Command–Query Separation",
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
      "Scale from a single server to globally distributed systems — caching, sharding, queues, and the classic system-design problems.",
    icon: "Network",
    status: "coming-soon",
    difficulty: "advanced",
    estimatedTime: "8–12 weeks",
    tags: ["system-design", "distributed", "scalability"],
    phases: [],
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
