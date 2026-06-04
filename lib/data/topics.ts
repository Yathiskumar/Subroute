import type { Topic } from "@/lib/types";

export const TOPICS: Topic[] = [
  {
    slug: "rate-limiting",
    title: "Rate Limiting",
    description:
      "Control request throughput so a noisy client cannot starve everyone else. Compare the five canonical algorithms side-by-side.",
    difficulty: "intermediate",
    icon: "Gauge",
    tags: ["distributed", "api", "throughput"],
    estimatedTime: "45 min",
    prerequisites: ["HTTP basics", "Time complexity"],
    concepts: [
      {
        slug: "token-bucket",
        title: "Token Bucket Algorithm",
        oneLiner:
          "A refilling bucket of tokens lets bursts through, but caps the sustained rate.",
        difficulty: "intermediate",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/rate-limiting/token-bucket.html",
      },
      {
        slug: "leaky-bucket",
        title: "Leaky Bucket Algorithm",
        oneLiner:
          "Requests drain at a constant rate, regardless of how fast they arrive.",
        difficulty: "intermediate",
        estimatedTime: "7 min",
        prototypePath: "/prototypes/rate-limiting/leaky-bucket.html",
      },
      {
        slug: "fixed-window",
        title: "Fixed Window Counter",
        oneLiner:
          "Count requests per discrete time window. Simple, but suffers boundary spikes.",
        difficulty: "beginner",
        estimatedTime: "5 min",
        prototypePath: "/prototypes/rate-limiting/fixed-window.html",
      },
      {
        slug: "sliding-window",
        title: "Sliding Window Counter",
        oneLiner:
          "Smooth out boundary effects by tracking a rolling, weighted view.",
        difficulty: "intermediate",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/rate-limiting/sliding-window.html",
      },
      {
        slug: "sliding-log",
        title: "Sliding Window Log",
        oneLiner:
          "Precise but memory-heavy: keep a log of every request timestamp.",
        difficulty: "advanced",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/rate-limiting/sliding-log.html",
      },
    ],
  },
  {
    slug: "cache-write",
    title: "Cache Write Policies",
    description:
      "Three ways to handle a write when you have a cache in front of the store. Each policy is a different bet about durability, throughput, and how stale your data is allowed to get.",
    difficulty: "intermediate",
    icon: "PenLine",
    tags: ["performance", "memory", "patterns"],
    estimatedTime: "25 min",
    prerequisites: ["Cache basics", "Memory hierarchy"],
    concepts: [
      {
        slug: "write-through",
        title: "Write-Through",
        oneLiner:
          "Every write goes to cache and the backing store in lockstep. Simple, safe, and slow.",
        difficulty: "beginner",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/cache-write/write-through.html",
      },
      {
        slug: "write-back",
        title: "Write-Back",
        oneLiner:
          "Writes hit cache only; dirty lines flush to the store on eviction. Fast — and risky.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/cache-write/write-back.html",
      },
      {
        slug: "write-around",
        title: "Write-Around",
        oneLiner:
          "Writes skip the cache entirely. Keeps the cache clean for hot reads, costs you on re-reads.",
        difficulty: "intermediate",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/cache-write/write-around.html",
      },
    ],
  },
  {
    slug: "cache-eviction",
    title: "Cache Eviction",
    description:
      "When the cache fills up, something has to go — and which one you pick decides your hit rate. Ten classic policies, side-by-side.",
    difficulty: "intermediate",
    icon: "HardDrive",
    tags: ["performance", "memory", "patterns"],
    estimatedTime: "85 min",
    prerequisites: ["HashMap basics", "Linked lists"],
    concepts: [
      {
        slug: "lfu",
        title: "LFU — Least Frequently Used",
        oneLiner:
          "Evict the entry with the fewest accesses. Wins on skewed, long-tailed traffic.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/cache-eviction/lfu.html",
      },
      {
        slug: "lru",
        title: "LRU — Least Recently Used",
        oneLiner:
          "Evict the entry that was accessed the longest time ago. The default in nearly every cache.",
        difficulty: "beginner",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/cache-eviction/lru.html",
      },
      {
        slug: "mru",
        title: "MRU — Most Recently Used",
        oneLiner:
          "The opposite of LRU. Throws away what you just touched — perfect for loops bigger than the cache.",
        difficulty: "intermediate",
        estimatedTime: "7 min",
        prototypePath: "/prototypes/cache-eviction/mru.html",
      },
      {
        slug: "fifo",
        title: "FIFO — First In, First Out",
        oneLiner:
          "Evict by insertion age. Simple, predictable, and surprisingly useful for streams.",
        difficulty: "beginner",
        estimatedTime: "6 min",
        prototypePath: "/prototypes/cache-eviction/fifo.html",
      },
      {
        slug: "random",
        title: "Random",
        oneLiner:
          "Throw out a random entry. Embarrassingly close to LRU on real workloads.",
        difficulty: "beginner",
        estimatedTime: "6 min",
        prototypePath: "/prototypes/cache-eviction/random.html",
      },
      {
        slug: "ttl",
        title: "TTL — Time To Live",
        oneLiner:
          "Eviction by clock, not by capacity. The right tool for data with an intrinsic lifetime.",
        difficulty: "beginner",
        estimatedTime: "7 min",
        prototypePath: "/prototypes/cache-eviction/ttl.html",
      },
      {
        slug: "clock",
        title: "Clock — Second Chance",
        oneLiner:
          "An approximate LRU with one bit per entry. Cheap enough to run in a kernel.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/cache-eviction/clock.html",
      },
      {
        slug: "2q",
        title: "2Q — Two Queue",
        oneLiner:
          "A small FIFO probation queue protects an LRU main queue from being flushed by scans.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/cache-eviction/2q.html",
      },
      {
        slug: "arc",
        title: "ARC — Adaptive Replacement Cache",
        oneLiner:
          "Self-tunes between recency and frequency using 'ghost' lists of recently-evicted keys.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/cache-eviction/arc.html",
      },
      {
        slug: "lirs",
        title: "LIRS — Low Inter-reference Recency Set",
        oneLiner:
          "Classify keys by the gap between accesses. Top-tier hit rate; tricky to implement.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/cache-eviction/lirs.html",
      },
    ],
  },
  {
    slug: "garbage-collection",
    title: "Garbage Collection",
    description:
      "How a runtime reclaims memory you stopped using — without you ever calling free(). Eight algorithms, from the counter on every object to the collectors that run alongside your program.",
    difficulty: "advanced",
    icon: "Recycle",
    tags: ["memory", "runtime", "performance"],
    estimatedTime: "90 min",
    prerequisites: ["Pointers & references", "Graphs & reachability", "Heap basics"],
    concepts: [
      {
        slug: "reference-counting",
        title: "Reference Counting",
        oneLiner:
          "Every object carries a count of who points at it. Hits zero, it dies — instantly, but cycles leak.",
        difficulty: "beginner",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/garbage-collection/reference-counting.html",
      },
      {
        slug: "mark-sweep",
        title: "Mark & Sweep",
        oneLiner:
          "Trace from the roots, mark everything reachable, then sweep the rest. The tracing collector in its purest form.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/garbage-collection/mark-sweep.html",
      },
      {
        slug: "mark-compact",
        title: "Mark-Compact",
        oneLiner:
          "Mark the living, then slide them together to squeeze out the holes. Defeats fragmentation at a copying cost.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/garbage-collection/mark-compact.html",
      },
      {
        slug: "copying-cheney",
        title: "Copying — Cheney's Algorithm",
        oneLiner:
          "Two half-heaps. Copy the survivors to the empty half with a tidy breadth-first scan, then swap. Allocation becomes a pointer bump.",
        difficulty: "intermediate",
        estimatedTime: "11 min",
        prototypePath: "/prototypes/garbage-collection/copying-cheney.html",
      },
      {
        slug: "generational",
        title: "Generational GC",
        oneLiner:
          "Most objects die young, so collect the nursery often and the old guard rarely. The weak generational hypothesis, exploited.",
        difficulty: "advanced",
        estimatedTime: "11 min",
        prototypePath: "/prototypes/garbage-collection/generational.html",
      },
      {
        slug: "tri-color",
        title: "Tri-Color Marking",
        oneLiner:
          "White, grey, black — an invariant that lets a collector mark the heap while the program keeps mutating it.",
        difficulty: "advanced",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/garbage-collection/tri-color.html",
      },
      {
        slug: "incremental",
        title: "Incremental GC",
        oneLiner:
          "Slice the collection into tiny steps interleaved with the program, trading throughput for short pauses.",
        difficulty: "advanced",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/garbage-collection/incremental.html",
      },
      {
        slug: "concurrent-mark-sweep",
        title: "Concurrent Mark-Sweep",
        oneLiner:
          "Run the collector on its own thread, in parallel with the application, with write barriers keeping the marking honest.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/garbage-collection/concurrent-mark-sweep.html",
      },
    ],
  },
  {
    slug: "memory-allocation",
    title: "Memory Allocation",
    description:
      "Before garbage collection ever runs, something has to hand out the memory. Six allocators — four ways to pick a hole, plus the two structured schemes real kernels actually ship.",
    difficulty: "intermediate",
    icon: "MemoryStick",
    tags: ["memory", "runtime", "performance"],
    estimatedTime: "70 min",
    prerequisites: ["Pointers & addresses", "Heap basics", "Big-O intuition"],
    concepts: [
      {
        slug: "first-fit",
        title: "First Fit",
        oneLiner:
          "Scan from the start, grab the first hole big enough. The fast, simple default — and where fragmentation begins.",
        difficulty: "beginner",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/memory-allocation/first-fit.html",
      },
      {
        slug: "best-fit",
        title: "Best Fit",
        oneLiner:
          "Check every hole, take the smallest one that fits. Minimizes leftover — and breeds tiny, useless slivers.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/memory-allocation/best-fit.html",
      },
      {
        slug: "worst-fit",
        title: "Worst Fit",
        oneLiner:
          "Always carve from the largest hole. The intuition is to leave reusable leftovers — it usually backfires.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/memory-allocation/worst-fit.html",
      },
      {
        slug: "next-fit",
        title: "Next Fit",
        oneLiner:
          "First Fit with a memory: resume scanning where you stopped last time, wrapping around the end.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/memory-allocation/next-fit.html",
      },
      {
        slug: "buddy",
        title: "Buddy System",
        oneLiner:
          "Round up to a power of two, split blocks in half to fit, and merge buddies back on free. Fast coalescing, at the cost of internal waste.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/memory-allocation/buddy.html",
      },
      {
        slug: "slab",
        title: "Slab Allocation",
        oneLiner:
          "Pre-size caches of fixed slots per object type. O(1) allocation, zero external fragmentation — the kernel's workhorse.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/memory-allocation/slab.html",
      },
    ],
  },
  {
    slug: "load-balancing",
    title: "Load Balancing",
    description:
      "Run more than one server and something has to decide which one handles each request. Nine algorithms, from a blind counter to capacity-and-load-aware routing — built up one signal at a time.",
    difficulty: "intermediate",
    icon: "Network",
    tags: ["distributed", "scaling", "throughput"],
    estimatedTime: "75 min",
    prerequisites: ["HTTP basics", "Concurrency intuition"],
    concepts: [
      {
        slug: "round-robin",
        title: "Round Robin",
        oneLiner:
          "Deal requests out like cards — server 1, 2, 3, 4, repeat. Perfectly even counts, blind to everything else.",
        difficulty: "beginner",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/load-balancing/round-robin.html",
      },
      {
        slug: "weighted-round-robin",
        title: "Weighted Round Robin",
        oneLiner:
          "Round robin with capacity: give the big servers a higher weight and they take proportionally more turns.",
        difficulty: "beginner",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/load-balancing/weighted-round-robin.html",
      },
      {
        slug: "random",
        title: "Random",
        oneLiner:
          "Flip a coin per request. Lumpy up close, perfectly even in the limit — and it needs no shared state at all.",
        difficulty: "beginner",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/load-balancing/random.html",
      },
      {
        slug: "least-connections",
        title: "Least Connections",
        oneLiner:
          "Route to the shortest queue. The first state-aware method — it follows real-time busyness, not request counts.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/load-balancing/least-connections.html",
      },
      {
        slug: "weighted-least-connections",
        title: "Weighted Least Connections",
        oneLiner:
          "Route by active ÷ weight. Capacity and live load in one number — the most adaptive of the classic set.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/load-balancing/weighted-least-connections.html",
      },
      {
        slug: "least-response-time",
        title: "Least Response Time",
        oneLiner:
          "Pick the server that's been answering fastest — connection count weighted by measured latency.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/load-balancing/least-response-time.html",
      },
      {
        slug: "ewma",
        title: "EWMA — Exponentially Weighted Moving Average",
        oneLiner:
          "Smooth each server's recent latency into a decaying average and route to the lowest. The basis of modern adaptive LBs.",
        difficulty: "advanced",
        estimatedTime: "11 min",
        prototypePath: "/prototypes/load-balancing/ewma.html",
      },
      {
        slug: "ip-hash",
        title: "IP Hash",
        oneLiner:
          "Hash the client's address to a server so the same client always lands on the same backend — sticky sessions, no shared store.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/load-balancing/ip-hash.html",
      },
      {
        slug: "power-of-two-choices",
        title: "Power of Two Choices",
        oneLiner:
          "Probe two servers at random, route to the less busy one. Almost stateless, almost as good as least connections.",
        difficulty: "advanced",
        estimatedTime: "11 min",
        prototypePath: "/prototypes/load-balancing/power-of-two-choices.html",
      },
    ],
  },
  {
    slug: "consistent-hashing",
    title: "Consistent Hashing",
    description:
      "Map keys to servers so that adding or removing a server moves as few keys as possible. Five methods, from the classic hash ring to the table-based hashing inside modern network load balancers.",
    difficulty: "intermediate",
    icon: "CircleDashed",
    tags: ["distributed", "scaling", "patterns"],
    estimatedTime: "55 min",
    prerequisites: ["Hash functions", "Modular arithmetic", "Sharding basics"],
    concepts: [
      {
        slug: "vanilla-ring",
        title: "Vanilla Ring",
        oneLiner:
          "Place servers and keys on a circle; a key belongs to the first server clockwise. Membership changes move only K/N keys instead of all of them.",
        difficulty: "beginner",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/consistent-hashing/vanilla-ring.html",
      },
      {
        slug: "virtual-nodes",
        title: "Virtual Nodes",
        oneLiner:
          "Give each server many points on the ring so load evens out and a failure spreads across all survivors — the version real systems actually ship.",
        difficulty: "intermediate",
        estimatedTime: "11 min",
        prototypePath: "/prototypes/consistent-hashing/virtual-nodes.html",
      },
      {
        slug: "rendezvous-hrw",
        title: "Rendezvous Hashing (HRW)",
        oneLiner:
          "Score every server for the key with hash(key, server) and pick the highest. No ring, even load, and weighting is trivial.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/consistent-hashing/rendezvous-hrw.html",
      },
      {
        slug: "jump-hash",
        title: "Jump Consistent Hash",
        oneLiner:
          "A tiny formula maps a key and a bucket count to a bucket — near-perfect balance, zero memory, no ring at all.",
        difficulty: "advanced",
        estimatedTime: "11 min",
        prototypePath: "/prototypes/consistent-hashing/jump-hash.html",
      },
      {
        slug: "maglev",
        title: "Maglev Hashing",
        oneLiner:
          "Precompute a lookup table so routing is O(1) and disruption is minimal — Google's hashing for software network load balancers.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/consistent-hashing/maglev.html",
      },
    ],
  },
  {
    slug: "page-replacement",
    title: "Page Replacement",
    description:
      "When memory is full and a new page must come in, which page do you throw out? Eight algorithms, from the simple FIFO baseline through the unbeatable Optimal to the LRU approximations real operating systems actually ship.",
    difficulty: "intermediate",
    icon: "Replace",
    tags: ["os", "memory", "caching"],
    estimatedTime: "70 min",
    prerequisites: ["Virtual memory basics", "Pages and frames", "Hit/miss intuition"],
    concepts: [
      {
        slug: "fifo",
        title: "FIFO",
        oneLiner:
          "Evict the oldest-loaded page. The simplest baseline — and the famous home of Belady's anomaly, where more memory can mean more faults.",
        difficulty: "beginner",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/page-replacement/fifo.html",
      },
      {
        slug: "optimal",
        title: "Optimal (Belady's)",
        oneLiner:
          "Evict the page used furthest in the future. Unbeatable but unimplementable — it needs to see the future, so it's the yardstick every real policy is measured against.",
        difficulty: "intermediate",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/page-replacement/optimal.html",
      },
      {
        slug: "lru",
        title: "LRU",
        oneLiner:
          "Evict the least-recently-used page. Bet the recent past predicts the near future — the practical gold standard that often lands close to Optimal.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/page-replacement/lru.html",
      },
      {
        slug: "second-chance",
        title: "Second Chance",
        oneLiner:
          "FIFO plus one reference bit: spare a page that was used recently by rotating it to the back instead of evicting it. The cheap upgrade over FIFO.",
        difficulty: "intermediate",
        estimatedTime: "8 min",
        prototypePath: "/prototypes/page-replacement/second-chance.html",
      },
      {
        slug: "clock",
        title: "Clock",
        oneLiner:
          "Second Chance done efficiently: pages stay in a ring and a hand sweeps for a victim. The LRU approximation operating systems and buffer pools really ship.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/page-replacement/clock.html",
      },
      {
        slug: "nru",
        title: "NRU",
        oneLiner:
          "Sort pages into four classes by referenced and dirty bits, then evict from the cheapest class — folding writeback cost into the decision.",
        difficulty: "intermediate",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/page-replacement/nru.html",
      },
      {
        slug: "aging",
        title: "Aging",
        oneLiner:
          "Give each page a shift-register counter that ages old use away one bit at a time. Software's close, cheap imitation of LRU.",
        difficulty: "advanced",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/page-replacement/aging.html",
      },
      {
        slug: "lfu",
        title: "LFU",
        oneLiner:
          "Evict the least-frequently-used page. Popularity over recency — great for a stable hot set, but stale-but-popular pages cling forever without decay.",
        difficulty: "advanced",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/page-replacement/lfu.html",
      },
    ],
  },
  {
    slug: "circuit-breaker",
    title: "Circuit Breaker",
    description:
      "When a downstream service is failing, stop hammering it — fail fast instead. Six variants, from the state machine itself to the trip-condition tweaks that production resilience libraries actually ship.",
    difficulty: "intermediate",
    icon: "ZapOff",
    tags: ["distributed", "resilience", "patterns"],
    estimatedTime: "70 min",
    prerequisites: ["HTTP basics", "Latency vs error intuition", "Timeouts & retries"],
    concepts: [
      {
        slug: "state-machine",
        title: "The State Machine",
        oneLiner:
          "Closed lets calls through. Open rejects them all. Half-Open peeks at recovery with a handful of trials. Learn the three-state dance before any of the trip-rules.",
        difficulty: "beginner",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/circuit-breaker/state-machine.html",
      },
      {
        slug: "count-based",
        title: "Count-Based",
        oneLiner:
          "Trip on the failure rate across the last N calls. The simplest sliding window — small, fixed memory, fast to evaluate.",
        difficulty: "beginner",
        estimatedTime: "9 min",
        prototypePath: "/prototypes/circuit-breaker/count-based.html",
      },
      {
        slug: "time-based",
        title: "Time-Based",
        oneLiner:
          "Trip on the failure rate over the last N seconds. Old calls age out on their own — quiet periods recover the breaker without any clicks.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/circuit-breaker/time-based.html",
      },
      {
        slug: "slow-call-rate",
        title: "Slow Call Rate",
        oneLiner:
          "Trip on latency, not just errors. A downstream that returns 200 OK in 5 seconds is broken too — and this is the variant that catches it.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/circuit-breaker/slow-call-rate.html",
      },
      {
        slug: "error-percentage",
        title: "Error Percentage (Hystrix)",
        oneLiner:
          "Two gates: trip only if traffic clears a minimum volume AND the error rate crosses a threshold. The original Netflix Hystrix rule that stops tiny noisy samples from tripping.",
        difficulty: "intermediate",
        estimatedTime: "11 min",
        prototypePath: "/prototypes/circuit-breaker/error-percentage.html",
      },
      {
        slug: "adaptive",
        title: "Adaptive",
        oneLiner:
          "Exponential-backoff cooldowns that grow on every re-trip, plus a 10 → 25 → 50 → 100% recovery ramp so the downstream isn't slammed the moment it comes back.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/circuit-breaker/adaptive.html",
      },
    ],
  },
  {
    slug: "consensus",
    title: "Consensus",
    description:
      "How a cluster agrees on a single answer when nodes die, packets drop, and some machines may even lie. Seven algorithms, from the two-phase commit that everyone learns first to the Byzantine-fault-tolerant PBFT.",
    difficulty: "advanced",
    icon: "Handshake",
    tags: ["distributed", "consistency", "patterns"],
    estimatedTime: "90 min",
    prerequisites: ["Distributed systems basics", "Replication", "Quorums"],
    concepts: [
      {
        slug: "two-phase-commit",
        title: "Two-Phase Commit (2PC)",
        oneLiner:
          "A coordinator polls everyone, then tells them all the same answer. Atomic — but if the coordinator dies mid-decision, the cluster hangs.",
        difficulty: "beginner",
        estimatedTime: "11 min",
        prototypePath: "/prototypes/consensus/two-phase-commit.html",
      },
      {
        slug: "three-phase-commit",
        title: "Three-Phase Commit (3PC)",
        oneLiner:
          "Slip a pre-commit phase between vote and commit so survivors can recover the decision without the coordinator. Non-blocking — at the cost of an extra round.",
        difficulty: "intermediate",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/consensus/three-phase-commit.html",
      },
      {
        slug: "paxos",
        title: "Paxos",
        oneLiner:
          "Two rounds — Prepare and Accept — driven by ever-increasing proposal numbers, and the impossible-to-contradict invariant they enforce on a quorum.",
        difficulty: "advanced",
        estimatedTime: "14 min",
        prototypePath: "/prototypes/consensus/paxos.html",
      },
      {
        slug: "multi-paxos",
        title: "Multi-Paxos",
        oneLiner:
          "Pay for Prepare once, elect a stable leader, then stream commands with Accept alone. The shape every modern replication protocol ends up copying.",
        difficulty: "advanced",
        estimatedTime: "13 min",
        prototypePath: "/prototypes/consensus/multi-paxos.html",
      },
      {
        slug: "raft",
        title: "Raft",
        oneLiner:
          "Paxos rewritten so humans can implement it: terms, an elected leader, a strictly append-only log, and AppendEntries as the only replication RPC.",
        difficulty: "advanced",
        estimatedTime: "14 min",
        prototypePath: "/prototypes/consensus/raft.html",
      },
      {
        slug: "zab",
        title: "ZAB — ZooKeeper Atomic Broadcast",
        oneLiner:
          "ZooKeeper's variant. Elect by highest zxid, open a new epoch, sync followers up to the leader, then propose/ACK/commit in strict FIFO order.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/consensus/zab.html",
      },
      {
        slug: "pbft",
        title: "PBFT — Practical Byzantine Fault Tolerance",
        oneLiner:
          "Pre-Prepare, Prepare, Commit — three rounds of cross-checked broadcasts so 3f+1 nodes can agree even when f of them are actively lying.",
        difficulty: "advanced",
        estimatedTime: "14 min",
        prototypePath: "/prototypes/consensus/pbft.html",
      },
    ],
  },
  {
    slug: "leader-election",
    title: "Leader Election",
    description:
      "How a cluster picks one node to be in charge — and how it picks again when that node falls over. Five algorithms, from the textbook ID-based shouting matches to the lease-and-watcher schemes real coordination services ship.",
    difficulty: "intermediate",
    icon: "Crown",
    tags: ["distributed", "coordination", "patterns"],
    estimatedTime: "60 min",
    prerequisites: ["Distributed systems basics", "Timeouts & heartbeats", "Quorums"],
    concepts: [
      {
        slug: "bully",
        title: "Bully Algorithm",
        oneLiner:
          "Whoever has the highest ID wins. When the leader dies, anyone can call an election — and higher IDs bully lower IDs out of contention.",
        difficulty: "beginner",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/leader-election/bully.html",
      },
      {
        slug: "ring",
        title: "Ring (Chang–Roberts)",
        oneLiner:
          "Pass a token clockwise around a ring, each node appending its ID. Whoever's ID is highest when the token returns is the leader.",
        difficulty: "beginner",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/leader-election/ring.html",
      },
      {
        slug: "raft-election",
        title: "Raft-Style Election",
        oneLiner:
          "Random election timers + per-term majority votes. The first follower to time out runs for election; whoever gets a quorum leads the term.",
        difficulty: "intermediate",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/leader-election/raft-election.html",
      },
      {
        slug: "lease-based",
        title: "Lease-Based Election",
        oneLiner:
          "A single TTL-bounded lock in a shared store. Hold it and you're leader; stop renewing and someone else takes over when it expires.",
        difficulty: "intermediate",
        estimatedTime: "11 min",
        prototypePath: "/prototypes/leader-election/lease-based.html",
      },
      {
        slug: "zookeeper",
        title: "ZooKeeper Election",
        oneLiner:
          "Every node creates an ephemeral sequential znode; the smallest sequence is leader. Each follower watches only its predecessor — no herd effect.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/leader-election/zookeeper.html",
      },
    ],
  },
  {
    slug: "bloom-filters",
    title: "Bloom & Cuckoo Filters",
    description:
      "Three probabilistic set-membership structures that answer 'have I seen this before?' in a few bytes per item. From the classic bit-array Bloom filter to the counting variant that can delete, to the cuckoo filter that does it all with a smaller memory footprint.",
    difficulty: "intermediate",
    icon: "Filter",
    tags: ["data-structures", "memory", "probabilistic"],
    estimatedTime: "35 min",
    prerequisites: ["Hash functions", "Bit arrays", "Set membership"],
    concepts: [
      {
        slug: "bloom",
        title: "Bloom Filter",
        oneLiner:
          "A bit array plus a few hash functions: definitely-not or maybe-yes membership, in a fraction of the memory a hash set needs.",
        difficulty: "beginner",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/bloom-filters/bloom.html",
      },
      {
        slug: "counting-bloom",
        title: "Counting Bloom Filter",
        oneLiner:
          "Each bit becomes a small counter so items can be removed by decrementing — at roughly 4× the memory of a vanilla Bloom filter.",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        prototypePath: "/prototypes/bloom-filters/counting-bloom.html",
      },
      {
        slug: "cuckoo",
        title: "Cuckoo Filter",
        oneLiner:
          "Store short fingerprints in two candidate buckets and bump existing entries to their other home on collision. Delete-supporting and usually smaller than Bloom.",
        difficulty: "advanced",
        estimatedTime: "12 min",
        prototypePath: "/prototypes/bloom-filters/cuckoo.html",
      },
    ],
  },
];

export const ALL_TAGS = Array.from(
  new Set(TOPICS.flatMap((t) => t.tags)),
).sort();

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getConcept(topicSlug: string, conceptSlug: string) {
  const topic = getTopic(topicSlug);
  if (!topic) return null;
  const idx = topic.concepts.findIndex((c) => c.slug === conceptSlug);
  if (idx === -1) return null;
  return {
    topic,
    concept: topic.concepts[idx],
    prev: idx > 0 ? topic.concepts[idx - 1] : null,
    next: idx < topic.concepts.length - 1 ? topic.concepts[idx + 1] : null,
  };
}

export function getRelatedTopics(slug: string, limit = 3): Topic[] {
  const topic = getTopic(slug);
  if (!topic) return [];
  const scored = TOPICS.filter((t) => t.slug !== slug).map((t) => ({
    topic: t,
    score: t.tags.filter((tag) => topic.tags.includes(tag)).length,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.topic);
}
