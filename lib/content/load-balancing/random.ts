import type { ConceptContent } from "@/lib/content/types";

export const random: ConceptContent = {
  prototypeCaption:
    "The load balancer flips a 4-way coin for every request — p = ¼ per server, no memory of past picks. The 'Recent picks' strip shows the lumpiness up close; the 'Max deviation from 25%' stat shrinks as you pile on requests. Hit '+100 instant' a few times to watch it converge.",

  overview: [
    {
      type: "p",
      text: "Random load balancing is exactly what it sounds like: for each request, pick a server uniformly at random. No counter, no state, no coordination. It sounds too crude to work — and over a handful of requests it *is* lumpy — but as volume grows the law of large numbers drags the distribution toward a perfectly even split, just like round robin.",
    },
    {
      type: "p",
      text: "Its real superpower shows up in distributed systems. Round robin needs a shared counter to stay coordinated across many load-balancer instances. Random needs nothing shared at all: a thousand independent balancers each flipping their own coin still produce an even global distribution, because uniform randomness composes. That zero-coordination property is why random (and its smarter cousin, power-of-two-choices) underpins so many large-scale systems.",
    },
  ],

  howItWorks: [
    { type: "h", text: "One line of logic" },
    {
      type: "p",
      text: "Pick an index in `[0, N)` uniformly and forward the request there:",
    },
    {
      type: "code",
      language: "text",
      code: "target = floor(random() * N)",
    },
    {
      type: "p",
      text: "Each server has probability 1/N of being chosen on every request, independent of every other request. The *expected* share for each is exactly 1/N — 25% with four servers.",
    },
    { type: "h", text: "Lumpy now, even later" },
    {
      type: "p",
      text: "Because picks are independent, short runs cluster: you'll see S2, S2, S2 in a row, and one server can be 40% ahead after twenty requests. This is normal variance, not a bug. The deviation from the ideal 1/N share shrinks on the order of 1/√n — so it's loud at n=20 and nearly silent at n=10,000. The prototype's 'Max deviation from 25%' stat makes this concrete: watch it fall each time you add another 100 requests.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Weighted random",
      text: "Random extends to uneven fleets the same way round robin does: give each server a weight and pick proportionally (draw a number in [0, ΣW) and find which server's cumulative band it lands in). That's weighted random — the stateless cousin of weighted round robin.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Many uncoordinated load balancers** — client-side balancing in RPC libraries, or a fleet of edge proxies that can't cheaply share a counter.",
        "**You want round-robin fairness without shared state** — random matches it in the limit with literally no bookkeeping.",
        "**As the base for smarter schemes** — 'power of two choices' picks two servers at random and routes to the less busy one, getting most of least-connections' benefit while staying nearly stateless.",
        "**High request volume** — the more traffic, the closer random gets to a perfect split, so it's ideal exactly where load balancing matters most.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Not for low volume or long-lived connections",
      text: "With few requests, random's variance is real — one backend can genuinely run hot. And like round robin it's blind to request duration, so it's a poor fit for long-lived or wildly variable connections. When those matter, move to least-connections or power-of-two-choices.",
    },
  ],

  tradeoffs: {
    pros: [
      "Zero shared state — scales to any number of independent load balancers with no coordination.",
      "Matches round robin's even distribution as request volume grows.",
      "Trivial and O(1): a single random draw, no counters to maintain or synchronize.",
      "Foundation for power-of-two-choices, which gets near-least-connections quality almost for free.",
    ],
    cons: [
      "Lumpy over short runs — real short-term imbalance from normal variance.",
      "Blind to request cost and server load, exactly like round robin.",
      "No guarantee of even counts at low volume; a small service can see a genuinely overloaded backend.",
      "Depends on a decent PRNG; a biased random source skews the whole distribution.",
    ],
  },

  handsOn: [
    {
      title: "01 · Feel the lumpiness",
      body: "Click 'Send one' about fifteen times and read the 'Recent picks' strip. You'll almost certainly see a server repeat two or three times in a row, and the handled counts will look uneven. That short-run clustering is expected — independent coin flips cluster.",
    },
    {
      title: "02 · Watch it converge",
      body: "Now hammer '+100 instant' five or six times. The 'Max deviation from 25%' stat falls steadily — often into the low single digits — and the 'Actual vs target' row creeps toward 25% / 25% / 25% / 25%. That's the law of large numbers doing round robin's job without a counter.",
    },
    {
      title: "03 · Lumpy vs even, side by side",
      body: "Reset, send just 8 requests, and note the max deviation (likely 10–25%). Reset again and '+100 instant' twice for ~200 requests, and compare. Same algorithm, dramatically tighter distribution — deviation shrinks roughly like 1/√n as n grows.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "random.go",
      code: `package lb

import "math/rand"

// Uniform random: one draw, no state, no coordination.
type RandomBalancer struct {
	servers []string
}

func NewRandomBalancer(servers []string) *RandomBalancer {
	return &RandomBalancer{servers: servers}
}

func (b *RandomBalancer) Pick() string {
	i := rand.Intn(len(b.servers))
	return b.servers[i]
}

// Weighted random: draw into the cumulative-weight band.
type weighted struct {
	id     string
	weight float64
}

type WeightedRandomBalancer struct {
	pool  []weighted
	total float64
}

func NewWeightedRandomBalancer(pool []weighted) *WeightedRandomBalancer {
	total := 0.0
	for _, p := range pool {
		total += p.weight
	}
	return &WeightedRandomBalancer{pool: pool, total: total}
}

func (b *WeightedRandomBalancer) Pick() string {
	r := rand.Float64() * b.total
	for _, p := range b.pool {
		if r -= p.weight; r < 0 {
			return p.id
		}
	}
	return b.pool[len(b.pool)-1].id // float-rounding guard
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Random.java",
      code: `import java.util.concurrent.ThreadLocalRandom;

// Uniform random: one draw, no state, no coordination.
class RandomBalancer {
    private final String[] servers;

    RandomBalancer(String[] servers) {
        this.servers = servers;
    }

    String pick() {
        int i = ThreadLocalRandom.current().nextInt(servers.length);
        return servers[i];
    }
}

// Weighted random: draw into the cumulative-weight band.
class WeightedRandomBalancer {
    record Entry(String id, double weight) {}

    private final Entry[] pool;
    private final double total;

    WeightedRandomBalancer(Entry[] pool) {
        this.pool = pool;
        double sum = 0;
        for (Entry p : pool) sum += p.weight();
        this.total = sum;
    }

    String pick() {
        double r = ThreadLocalRandom.current().nextDouble() * total;
        for (Entry p : pool) {
            if ((r -= p.weight()) < 0) return p.id();
        }
        return pool[pool.length - 1].id(); // float-rounding guard
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "random_balancer.py",
      code: `import random


# Uniform random: one draw, no state, no coordination.
class RandomBalancer:
    def __init__(self, servers: list[str]) -> None:
        self.servers = servers

    def pick(self) -> str:
        i = random.randrange(len(self.servers))
        return self.servers[i]


# Weighted random: draw into the cumulative-weight band.
class WeightedRandomBalancer:
    def __init__(self, pool: list[tuple[str, float]]) -> None:
        self.pool = pool
        self.total = sum(weight for _, weight in pool)

    def pick(self) -> str:
        r = random.random() * self.total
        for server_id, weight in self.pool:
            r -= weight
            if r < 0:
                return server_id
        return self.pool[-1][0]  # float-rounding guard`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "random_balancer.cpp",
      code: `// Uniform random: one draw, no state, no coordination.
#include <random>
#include <string>
#include <vector>

static std::mt19937& rng() {
    static thread_local std::mt19937 gen{std::random_device{}()};
    return gen;
}

class RandomBalancer {
    std::vector<std::string> servers_;

public:
    explicit RandomBalancer(std::vector<std::string> servers)
        : servers_(std::move(servers)) {}

    std::string pick() {
        std::uniform_int_distribution<size_t> dist(0, servers_.size() - 1);
        return servers_[dist(rng())];
    }
};

// Weighted random: draw into the cumulative-weight band.
struct Weighted {
    std::string id;
    double weight;
};

class WeightedRandomBalancer {
    std::vector<Weighted> pool_;
    double total_ = 0;

public:
    explicit WeightedRandomBalancer(std::vector<Weighted> pool)
        : pool_(std::move(pool)) {
        for (const auto& p : pool_) total_ += p.weight;
    }

    std::string pick() {
        std::uniform_real_distribution<double> dist(0.0, total_);
        double r = dist(rng());
        for (const auto& p : pool_) {
            if ((r -= p.weight) < 0) return p.id;
        }
        return pool_.back().id; // float-rounding guard
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Marc Brooker — The power of two random choices",
      href: "https://brooker.co.za/blog/2012/01/17/two-random.html",
      note: "The clearest intuition anywhere for why pure random is lumpy and why two random probes fixes it — from an AWS principal engineer.",
      kind: "article",
    },
    {
      label: "Marc Brooker — Balls into bins in distributed systems",
      href: "https://brooker.co.za/blog/2018/01/01/balls-into-bins.html",
      note: "Follow-up that quantifies random's imbalance with the balls-into-bins model — the math behind the 1/√n convergence.",
      kind: "article",
    },
    {
      label: "Mitzenmacher, Richa & Sitaraman — The Power of Two Random Choices: A Survey",
      href: "https://www.eecs.harvard.edu/~michaelm/postscripts/handbook2001.pdf",
      note: "The definitive survey. Random gives max load ~log n / log log n; adding just one more random probe drops it to ~log log n.",
      kind: "paper",
    },
    {
      label: "Mitzenmacher — The Power of Two Choices in Randomized Load Balancing (TPDS 2001)",
      href: "https://www.eecs.harvard.edu/~michaelm/postscripts/tpds2001.pdf",
      note: "The original journal result that launched power-of-two-choices, the smart cousin of plain random.",
      kind: "paper",
    },
    {
      label: "Tyler McMullen — Load Balancing is Impossible (talk)",
      href: "https://www.infoq.com/presentations/load-balancing/",
      note: "Fastly's CTO on why random and round robin are inefficient, why least-conns has 'horrific edge cases,' and where randomized two-choices wins.",
      kind: "video",
    },
    {
      label: "AWS — Application Load Balancer adds weighted random routing",
      href: "https://aws.amazon.com/about-aws/whats-new/2019/11/application-load-balancer-now-supports-least-outstanding-requests-algorithm-for-load-balancing-requests/",
      note: "AWS shipping (weighted) random and least-outstanding-requests as first-class ALB algorithms — random in production.",
      kind: "docs",
    },
    {
      label: "Wikipedia — Load balancing (computing)",
      href: "https://en.wikipedia.org/wiki/Load_balancing_(computing)",
      note: "Overview placing random among the stateless strategies.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "rnd-q1",
      question:
        "Over a very large number of requests, how does random's distribution compare to round robin's?",
      options: [
        { id: "a", label: "Random is always far more uneven" },
        { id: "b", label: "They both approach a perfectly even 1/N split" },
        { id: "c", label: "Random sends everything to one server" },
        { id: "d", label: "Round robin becomes uneven while random stays even" },
      ],
      correctOptionId: "b",
      explanation:
        "By the law of large numbers, uniform random converges to the same even 1/N share that round robin produces. The difference is short-term: random is lumpier over small request counts, round robin is even at every step.",
    },
    {
      id: "rnd-q2",
      question:
        "What is random load balancing's key advantage over round robin in a distributed system?",
      options: [
        { id: "a", label: "It tracks server load in real time" },
        { id: "b", label: "It guarantees even counts even at very low volume" },
        { id: "c", label: "It needs no shared state across load-balancer instances" },
        { id: "d", label: "It is aware of request duration" },
      ],
      correctOptionId: "c",
      explanation:
        "Round robin needs a shared, synchronized counter to coordinate many LB instances. Random needs nothing shared — independent coin flips compose into an even global distribution — so it scales to any number of uncoordinated balancers.",
    },
    {
      id: "rnd-q3",
      question:
        "Roughly how does random's deviation from the ideal even split behave as the number of requests n grows?",
      options: [
        { id: "a", label: "It shrinks on the order of 1/√n" },
        { id: "b", label: "It grows linearly with n" },
        { id: "c", label: "It stays constant regardless of n" },
        { id: "d", label: "It shrinks like 1/n²" },
      ],
      correctOptionId: "a",
      explanation:
        "The relative deviation from a uniform split scales like 1/√n. That's why random looks lumpy at n=20 but is nearly perfectly even by n=10,000 — and why it's a great fit for high-volume traffic.",
    },
  ],
};
