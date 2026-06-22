import type { ConceptContent } from "@/lib/content/types";

export const weightedRoundRobin: ConceptContent = {
  prototypeCaption:
    "Round robin, but each server carries a weight. The cycle pattern shows the resulting sequence — a weight-3 server appears three times per round, a weight-1 server once. Adjust the weight steppers and watch the pattern (and the actual-vs-target share) re-balance.",

  overview: [
    {
      type: "p",
      text: "Real fleets aren't uniform. You have an 8-core box next to a 2-core box, or a new generation instance sharing the pool with last year's. Plain round robin sends them the same number of requests, so the small server saturates while the big one coasts. Weighted round robin fixes that by giving each server a **weight** proportional to its capacity, then handing out requests in that proportion.",
    },
    {
      type: "p",
      text: "A server with weight 3 receives three requests for every one a weight-1 server gets. Over a full cycle the split matches the weight ratios exactly — it's still the deterministic, stateless deal-out of round robin, just with some servers dealt more cards per round.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Expand the weights into a cycle" },
    {
      type: "p",
      text: "The easiest mental model — and what the prototype shows in its 'Cycle pattern' row — is to expand the weights into a sequence. With weights S1=3, S2=1, S3=2, S4=1 the round is:",
    },
    {
      type: "code",
      language: "text",
      code: "S1 → S1 → S1 → S2 → S3 → S3 → S4  ↺",
    },
    {
      type: "p",
      text: "Seven slots, then it repeats. Over each cycle S1 gets 3/7 of traffic, S3 gets 2/7, and S2 and S4 get 1/7 each — exactly their weight shares. The naïve implementation literally walks this expanded list.",
    },
    { type: "h", text: "Smooth weighted round robin" },
    {
      type: "p",
      text: "The naïve expansion is bursty: weight-3 S1 gets all three of its requests back-to-back at the top of every cycle. Production balancers (NGINX, Envoy) use **smooth weighted round robin** instead, which interleaves the picks — e.g. S1, S3, S1, S2, S1, S3, S4 — so a heavy server's requests are spread through the round rather than clumped. Same totals per cycle, gentler instantaneous load.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Weight is capacity, not load",
      text: "Weights are a static statement about how much each server *can* handle, set by you up front. They say nothing about how busy a server is *right now*. If a heavy-weighted server happens to catch a run of expensive requests, weighted round robin keeps feeding it its full share anyway — it can't see the imbalance.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Heterogeneous hardware** — mix of instance sizes or generations; weight each by relative capacity (cores, RAM, benchmarked throughput).",
        "**Canary / gradual rollout** — give a new version weight 1 against the stable pool's weight 10 to send it ~10% of traffic, then ramp the weight up.",
        "**Predictable request cost** — like plain round robin, it shines when requests are uniform; the weights handle capacity, not request variance.",
        "**Draining a node** — drop a server's weight toward zero to bleed traffic off it before maintenance.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "NGINX exposes this directly: `server backend1 weight=3;`. Envoy and HAProxy both implement smooth weighted round robin so a high-weight backend doesn't receive its whole allocation in one burst each cycle.",
    },
  ],

  tradeoffs: {
    pros: [
      "Handles uneven server capacity that plain round robin can't.",
      "Still stateless and O(1) per pick — no live monitoring of backends.",
      "Doubles as a traffic-splitting knob for canaries and gradual rollouts.",
      "Deterministic and easy to reason about: shares match weight ratios exactly per cycle.",
    ],
    cons: [
      "Weights are static — they encode capacity, not the live load, so a heavy server catching expensive requests still gets overfed.",
      "Someone has to set the weights correctly, and re-tune them when the fleet changes.",
      "Naïve expansion is bursty for high-weight servers; you want a smooth-WRR implementation.",
      "Still blind to request duration and server health, just like round robin.",
    ],
  },

  handsOn: [
    {
      title: "01 · Read the cycle pattern",
      body: "With the default weights (3, 1, 2, 1) the 'Cycle pattern' row reads S1 → S1 → S1 → S2 → S3 → S3 → S4. Send seven requests and confirm the handled counts land at 3 / 1 / 2 / 1 — one full cycle, split exactly by weight.",
    },
    {
      title: "02 · Re-weight a server",
      body: "Bump S2's weight from 1 up to 5 with its stepper. The cycle pattern instantly grows S2's slots and the connection line to S2 thickens. Hit 'Start auto' and watch the 'Actual vs target share' stat converge — S2 now pulls the largest slice.",
    },
    {
      title: "03 · Build a canary split",
      body: "Set three servers to weight 1 and one server to weight 9. That lone heavy server now takes ~75% of traffic — or flip it: weight 1 on a 'new version' against 9s elsewhere gives it ~3% for a cautious canary. Weights are your traffic-splitting dial.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "weighted_round_robin.go",
      code: `package lb

// Smooth Weighted Round Robin (the algorithm NGINX/Envoy use).
// Avoids the bursty "all of S1, then S2..." of naive expansion.
type server struct {
	id      string
	weight  int
	current int
}

type SmoothWRR struct {
	servers []*server
}

func NewSmoothWRR(pool []*server) *SmoothWRR {
	return &SmoothWRR{servers: pool}
}

func (b *SmoothWRR) Pick() string {
	total := 0
	for _, s := range b.servers {
		total += s.weight
	}
	var best *server
	for _, s := range b.servers {
		s.current += s.weight // each gains its weight
		if best == nil || s.current > best.current {
			best = s
		}
	}
	best.current -= total // the winner pays the full total back
	return best.id
}

// weights 3,1,2,1 -> a smooth, interleaved sequence like
// s1, s3, s1, s2, s1, s3, s4  (still 3:1:2:1 per cycle)
// lb := NewSmoothWRR([]*server{
// 	{id: "s1", weight: 3},
// 	{id: "s2", weight: 1},
// 	{id: "s3", weight: 2},
// 	{id: "s4", weight: 1},
// })`,
    },
    {
      label: "Java",
      language: "java",
      filename: "WeightedRoundRobin.java",
      code: `import java.util.List;

// Smooth Weighted Round Robin (the algorithm NGINX/Envoy use).
// Avoids the bursty "all of S1, then S2..." of naive expansion.
class SmoothWRR {
    static final class Server {
        final String id;
        final int weight;
        int current = 0;

        Server(String id, int weight) {
            this.id = id;
            this.weight = weight;
        }
    }

    private final List<Server> servers;

    SmoothWRR(List<Server> pool) {
        this.servers = pool;
    }

    String pick() {
        int total = 0;
        for (Server s : servers) total += s.weight;
        Server best = null;
        for (Server s : servers) {
            s.current += s.weight;            // each gains its weight
            if (best == null || s.current > best.current) best = s;
        }
        best.current -= total;                // the winner pays the full total back
        return best.id;
    }
}

// weights 3,1,2,1 -> a smooth, interleaved sequence like
// s1, s3, s1, s2, s1, s3, s4  (still 3:1:2:1 per cycle)
SmoothWRR lb = new SmoothWRR(List.of(
    new SmoothWRR.Server("s1", 3),
    new SmoothWRR.Server("s2", 1),
    new SmoothWRR.Server("s3", 2),
    new SmoothWRR.Server("s4", 1)));`,
    },
    {
      label: "Python",
      language: "python",
      filename: "weighted_round_robin.py",
      code: `from dataclasses import dataclass


# Smooth Weighted Round Robin (the algorithm NGINX/Envoy use).
# Avoids the bursty "all of S1, then S2..." of naive expansion.
@dataclass
class Server:
    id: str
    weight: int
    current: int = 0


class SmoothWRR:
    def __init__(self, pool: list[Server]) -> None:
        self.servers = pool

    def pick(self) -> str:
        total = sum(s.weight for s in self.servers)
        best: Server | None = None
        for s in self.servers:
            s.current += s.weight            # each gains its weight
            if best is None or s.current > best.current:
                best = s
        best.current -= total                # the winner pays the full total back
        return best.id


# weights 3,1,2,1 -> a smooth, interleaved sequence like
# s1, s3, s1, s2, s1, s3, s4  (still 3:1:2:1 per cycle)
lb = SmoothWRR([
    Server("s1", 3),
    Server("s2", 1),
    Server("s3", 2),
    Server("s4", 1),
])`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "weighted_round_robin.cpp",
      code: `// Smooth Weighted Round Robin (the algorithm NGINX/Envoy use).
// Avoids the bursty "all of S1, then S2..." of naive expansion.
#include <string>
#include <vector>

class SmoothWRR {
    struct Server {
        std::string id;
        int weight;
        int current = 0;
    };
    std::vector<Server> servers_;

public:
    explicit SmoothWRR(std::vector<Server> pool)
        : servers_(std::move(pool)) {}

    std::string pick() {
        int total = 0;
        for (const auto& s : servers_) total += s.weight;
        Server* best = nullptr;
        for (auto& s : servers_) {
            s.current += s.weight;            // each gains its weight
            if (!best || s.current > best->current) best = &s;
        }
        best->current -= total;               // the winner pays the full total back
        return best->id;
    }
};

// weights 3,1,2,1 -> a smooth, interleaved sequence like
// s1, s3, s1, s2, s1, s3, s4  (still 3:1:2:1 per cycle)
// SmoothWRR lb({{"s1", 3}, {"s2", 1}, {"s3", 2}, {"s4", 1}});`,
    },
  ],

  furtherReading: [
    {
      label: "NGINX — Weighted load balancing",
      href: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/#weighted-load-balancing",
      note: "The `weight=` directive and how NGINX splits traffic by it.",
      kind: "docs",
    },
    {
      label: "NGINX — smooth weighted round-robin (source commit)",
      href: "https://github.com/phusion/nginx/commit/27e94984486058d73157038f7950a0a36ecc6e35",
      note: "The original explanation of the smooth WRR algorithm and why it interleaves picks instead of expanding weights naively.",
      kind: "article",
    },
    {
      label: "Envoy — Load balancers (weighted round robin)",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers",
      note: "Envoy's weighted RR and how it interacts with locality weighting and health.",
      kind: "docs",
    },
    {
      label: "HAProxy — Load balancing algorithms",
      href: "https://www.haproxy.com/documentation/haproxy-configuration-tutorials/load-balancing/",
      note: "Per-server `weight` under roundrobin, plus HAProxy's dynamic-weight (agent-check) feature for live re-weighting.",
      kind: "docs",
    },
    {
      label: "Cloudflare — Types of load balancing algorithms",
      href: "https://www.cloudflare.com/learning/performance/types-of-load-balancing-algorithms/",
      note: "Weighted round robin explained for mixed-capacity fleets, in plain terms.",
      kind: "article",
    },
    {
      label: "AWS — How Elastic Load Balancing works (weighted target groups)",
      href: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html",
      note: "How ALB/NLB use target-group weights to split traffic — the same idea applied to canaries and blue/green rollouts.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "wrr-q1",
      question:
        "Servers have weights S1=3, S2=1, S3=2, S4=1. Over one full cycle, what fraction of requests does S3 receive?",
      options: [
        { id: "a", label: "1/4" },
        { id: "b", label: "2/7" },
        { id: "c", label: "2/4" },
        { id: "d", label: "3/7" },
      ],
      correctOptionId: "b",
      explanation:
        "Total weight is 3+1+2+1 = 7. S3's share is its weight over the total: 2/7. Weighted round robin matches the weight ratios exactly over each complete cycle.",
    },
    {
      id: "wrr-q2",
      question: "What does a server's weight represent?",
      options: [
        { id: "a", label: "Its current number of active connections" },
        { id: "b", label: "Its measured response time" },
        { id: "c", label: "Its relative capacity, set statically up front" },
        { id: "d", label: "How long it has been running" },
      ],
      correctOptionId: "c",
      explanation:
        "Weight is a static declaration of relative capacity that you configure. It does not change with live load — which is exactly why weighted round robin can still overfeed a heavily-weighted server that happens to catch expensive requests.",
    },
    {
      id: "wrr-q3",
      question: "Why do NGINX and Envoy use *smooth* weighted round robin instead of naively expanding the weights?",
      options: [
        { id: "a", label: "It changes the per-cycle totals to favor big servers" },
        { id: "b", label: "It interleaves picks so a high-weight server isn't hit in one burst each cycle" },
        { id: "c", label: "It uses less memory" },
        { id: "d", label: "It lets weights be negative" },
      ],
      correctOptionId: "b",
      explanation:
        "Naive expansion gives a weight-3 server all three requests back-to-back at the top of every cycle — bursty. Smooth WRR spreads those picks throughout the round. The per-cycle totals are identical; the instantaneous load is gentler.",
    },
  ],
};
