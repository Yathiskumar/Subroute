import type { ConceptContent } from "@/lib/content/types";

export const leastResponseTime: ConceptContent = {
  prototypeCaption:
    "Least connections, upgraded to also weigh how fast each server answers. The score row spells out the math live — (active + 1) × avg_rt — and the lowest score wins. Crank Server 3's latency multiplier up and watch the LB route around it even when its connection count is low.",

  overview: [
    {
      type: "p",
      text: "Least connections assumes that one active connection is as costly as any other. But a connection to a server that answers in 50ms is nothing like a connection to one limping along at 2 seconds. Least response time fixes this by folding **measured latency** into the decision: it scores each server by how busy it is *and* how fast it has been answering, then routes to the lowest score.",
    },
    {
      type: "p",
      text: "The score the prototype shows is the classic form used by NGINX Plus and others: `(active + 1) × average_response_time`. The `+1` accounts for the request you're about to add. Multiply by the server's recent average latency and you get an estimate of how long a new request would actually wait there. Pick the smallest estimate — that's least response time.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Score = (active + 1) × avg_rt" },
    {
      type: "p",
      text: "Two signals combine into one number per server:",
    },
    {
      type: "ul",
      items: [
        "**Active connections** — the live queue depth, exactly like least connections. The `+1` models the incoming request.",
        "**Average response time** — a running average of how long this server's recent requests took to complete.",
      ],
    },
    {
      type: "p",
      text: "Their product approximates the expected latency a new request would see: a short queue in front of a fast server scores low and wins; a short queue in front of a *slow* server scores higher and gets skipped. The prototype renders this as a live equation per server and flags the winner (`← lowest, will be picked`) and the laggard (`avoided`).",
    },
    { type: "h", text: "Where the response time comes from" },
    {
      type: "p",
      text: "The average is updated each time a request completes. A plain running mean works, but it reacts slowly and never forgets — a server that was briefly slow an hour ago still carries that weight. That lag is the motivation for the next concept, **EWMA**, which decays old samples exponentially so the score tracks *recent* behavior. (This prototype already uses a light exponential update under the hood; EWMA makes the decay rate an explicit, tunable knob.)",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Latency is a lagging signal",
      text: "Response time only updates when requests finish. A server that just fell off a cliff still looks fast until its slow responses start landing — so least response time reacts a beat late to sudden degradation. The active-connection term helps: a stalling server accumulates active connections immediately, nudging its score up before the latency catches up.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Backends with genuinely different speeds** — mixed hardware, mixed locations, or services where some instances are cold/warm.",
        "**Latency-sensitive traffic** — user-facing request paths where p99 matters more than raw even distribution.",
        "**When connection count alone misleads** — a server can hold few connections yet be slow; latency-awareness catches that.",
        "**A balancer that can observe response times** — you need completion timing, which an L7 proxy or smart client has but a dumb L4 forwarder may not.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "NGINX Plus offers `least_time` (by header or last-byte), and many service meshes default to a latency-aware policy. It's the natural next step once you have response-time telemetry and least-connections is no longer enough.",
    },
  ],

  tradeoffs: {
    pros: [
      "Accounts for server speed, not just queue depth — routes around slow backends automatically.",
      "Directly targets the thing users feel: expected latency.",
      "Degrades gracefully — the active-connection term reacts instantly even before latency updates.",
      "A small, cheap formula on top of the counters least connections already keeps.",
    ],
    cons: [
      "Response time is a lagging signal; reaction to sudden slowdowns is delayed.",
      "A plain running average never forgets — stale slow samples linger (EWMA fixes this).",
      "Requires measuring per-request completion time, which dumb L4 balancers can't do.",
      "All the distributed-state hazards of least connections still apply.",
    ],
  },

  handsOn: [
    {
      title: "01 · Read the score equation",
      body: "Hit 'Auto' and watch the score grid: each row shows `(active + 1) × avg_rt = score`, and the lowest is tagged `← lowest, will be picked`. Note Server 3 starts with a ×3 latency multiplier, so its avg_rt climbs higher than the others — and its row is the one most often marked `avoided`.",
    },
    {
      title: "02 · Make a server slow on purpose",
      body: "Use the 'S1 latency' stepper to push Server 1 up to ×4. Its connection line thins (it's getting less work) and its score climbs. Even when S1 has the fewest active connections, the LB skips it because the latency term dominates — that's the whole difference from plain least connections.",
    },
    {
      title: "03 · Flatten the fleet",
      body: "Set every server's latency multiplier back to ×1. Now avg_rt is roughly equal everywhere, so the score collapses to (active + 1) — and the algorithm behaves exactly like Least Connections. Watch the 'RT spread' stat shrink toward zero as the fleet evens out.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "least_response_time.go",
      code: `package lb

// Least response time: score = (active + 1) * avgRtSeconds, lowest wins.
type Backend struct {
	id      string
	active  int
	avgRtMs float64
	samples int
}

const defaultRtMs = 1500.0 // used until a server has answered once

type LeastResponseTimeBalancer struct {
	backends []*Backend
}

func NewLeastResponseTimeBalancer(ids []string) *LeastResponseTimeBalancer {
	bs := make([]*Backend, len(ids))
	for i, id := range ids {
		bs[i] = &Backend{id: id}
	}
	return &LeastResponseTimeBalancer{backends: bs}
}

func (lb *LeastResponseTimeBalancer) score(b *Backend) float64 {
	rt := b.avgRtMs
	if rt == 0 {
		rt = defaultRtMs
	}
	return float64(b.active+1) * (rt / 1000)
}

func (lb *LeastResponseTimeBalancer) Acquire() *Backend {
	best := lb.backends[0]
	for _, b := range lb.backends {
		if lb.score(b) < lb.score(best) {
			best = b
		}
	}
	best.active++ // reserve immediately, like least-conn
	return best
}

// Release is called on completion with the observed round-trip time.
func (lb *LeastResponseTimeBalancer) Release(b *Backend, rtMs float64) {
	b.active--
	// running mean — simple, but slow to forget (EWMA improves on this)
	b.avgRtMs = (b.avgRtMs*float64(b.samples) + rtMs) / float64(b.samples+1)
	b.samples++
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "LeastResponseTime.java",
      code: `import java.util.ArrayList;
import java.util.List;

// Least response time: score = (active + 1) * avgRtSeconds, lowest wins.
class LeastResponseTimeBalancer {
    static final class Backend {
        final String id;
        int active = 0;
        double avgRtMs = 0;
        int samples = 0;

        Backend(String id) { this.id = id; }
    }

    private static final double DEFAULT_RT_MS = 1500; // until a server answers once

    private final List<Backend> backends = new ArrayList<>();

    LeastResponseTimeBalancer(String[] ids) {
        for (String id : ids) backends.add(new Backend(id));
    }

    private double score(Backend b) {
        double rt = b.avgRtMs == 0 ? DEFAULT_RT_MS : b.avgRtMs;
        return (b.active + 1) * (rt / 1000);
    }

    Backend acquire() {
        Backend best = backends.get(0);
        for (Backend b : backends) {
            if (score(b) < score(best)) best = b;
        }
        best.active++;               // reserve immediately, like least-conn
        return best;
    }

    // Call on completion with the observed round-trip time.
    void release(Backend b, double rtMs) {
        b.active--;
        // running mean — simple, but slow to forget (EWMA improves on this)
        b.avgRtMs = (b.avgRtMs * b.samples + rtMs) / (b.samples + 1);
        b.samples++;
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "least_response_time.py",
      code: `from dataclasses import dataclass

DEFAULT_RT_MS = 1500.0  # used until a server has answered once


# Least response time: score = (active + 1) * avg_rt_seconds, lowest wins.
@dataclass
class Backend:
    id: str
    active: int = 0
    avg_rt_ms: float = 0
    samples: int = 0


class LeastResponseTimeBalancer:
    def __init__(self, ids: list[str]) -> None:
        self.backends = [Backend(id) for id in ids]

    def _score(self, b: Backend) -> float:
        rt = b.avg_rt_ms or DEFAULT_RT_MS
        return (b.active + 1) * (rt / 1000)

    def acquire(self) -> Backend:
        best = self.backends[0]
        for b in self.backends:
            if self._score(b) < self._score(best):
                best = b
        best.active += 1             # reserve immediately, like least-conn
        return best

    def release(self, b: Backend, rt_ms: float) -> None:
        """Call on completion with the observed round-trip time."""
        b.active -= 1
        # running mean — simple, but slow to forget (EWMA improves on this)
        b.avg_rt_ms = (b.avg_rt_ms * b.samples + rt_ms) / (b.samples + 1)
        b.samples += 1`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "least_response_time.cpp",
      code: `// Least response time: score = (active + 1) * avgRtSeconds, lowest wins.
#include <string>
#include <vector>

class LeastResponseTimeBalancer {
public:
    struct Backend {
        std::string id;
        int active = 0;
        double avgRtMs = 0;
        int samples = 0;
    };

private:
    static constexpr double DEFAULT_RT_MS = 1500; // until a server answers once
    std::vector<Backend> backends_;

    double score(const Backend& b) const {
        double rt = b.avgRtMs == 0 ? DEFAULT_RT_MS : b.avgRtMs;
        return (b.active + 1) * (rt / 1000);
    }

public:
    explicit LeastResponseTimeBalancer(const std::vector<std::string>& ids) {
        for (const auto& id : ids) backends_.push_back({id});
    }

    Backend* acquire() {
        Backend* best = &backends_[0];
        for (auto& b : backends_) {
            if (score(b) < score(*best)) best = &b;
        }
        best->active++;              // reserve immediately, like least-conn
        return best;
    }

    // Call on completion with the observed round-trip time.
    void release(Backend* b, double rtMs) {
        b->active--;
        // running mean — simple, but slow to forget (EWMA improves on this)
        b->avgRtMs = (b->avgRtMs * b->samples + rtMs) / (b->samples + 1);
        b->samples++;
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "NGINX — Load-balancing methods (least_time)",
      href: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/#load-balancing-methods",
      note: "NGINX Plus's `least_time` — score by header or last-byte latency, the production form of this algorithm.",
      kind: "docs",
    },
    {
      label: "Envoy — Load balancers (least request)",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers",
      note: "Envoy biases least-request by active requests and host weights — a close cousin that folds in load and capacity.",
      kind: "docs",
    },
    {
      label: "Finagle — Clients: load balancing",
      href: "https://twitter.github.io/finagle/guide/Clients.html",
      note: "Finagle's 'least loaded' and Peak EWMA balancers, with a clear discussion of why latency-awareness beats pure connection count.",
      kind: "docs",
    },
    {
      label: "Google SRE Book — Ch. 20: Load Balancing in the Datacenter",
      href: "https://sre.google/sre-book/load-balancing-datacenter/",
      note: "Why latency and queueing — not request counts — are the signals that actually protect tail latency.",
      kind: "book",
    },
    {
      label: "Tyler McMullen — Load Balancing is Impossible (talk)",
      href: "https://www.infoq.com/presentations/load-balancing/",
      note: "Why latency-based scoring helps, and the edge cases (herding onto a 'fast' server) it can still hit.",
      kind: "video",
    },
    {
      label: "Cloudflare — Types of load balancing algorithms",
      href: "https://www.cloudflare.com/learning/performance/types-of-load-balancing-algorithms/",
      note: "Plain-English summary of least-response-time among the dynamic methods.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "lrt-q1",
      question: "How does least response time score each server?",
      options: [
        { id: "a", label: "By active connections alone" },
        { id: "b", label: "By (active connections + 1) × average response time" },
        { id: "c", label: "By a round-robin counter" },
        { id: "d", label: "By the server's static weight" },
      ],
      correctOptionId: "b",
      explanation:
        "The score multiplies queue depth (active + 1, the +1 modeling the incoming request) by recent average latency. That product estimates how long a new request would actually wait, so the lowest score is the best bet.",
    },
    {
      id: "lrt-q2",
      question:
        "A server has the fewest active connections but the highest average response time. What does least response time do?",
      options: [
        { id: "a", label: "Always routes to it, because it has the fewest connections" },
        { id: "b", label: "May skip it, because its high latency inflates its score" },
        { id: "c", label: "Removes it from the pool permanently" },
        { id: "d", label: "Ignores response time entirely" },
      ],
      correctOptionId: "b",
      explanation:
        "Unlike least connections, the latency term can outweigh a low connection count. A slow server scores high and gets passed over — exactly the behavior the prototype shows when you raise a server's latency multiplier.",
    },
    {
      id: "lrt-q3",
      question: "Why is a plain running average of response time a weakness, and what addresses it?",
      options: [
        { id: "a", label: "It uses too much memory; sampling fixes it" },
        { id: "b", label: "It never forgets old samples, so it reacts slowly; EWMA's exponential decay fixes it" },
        { id: "c", label: "It reacts too fast; smoothing fixes it" },
        { id: "d", label: "It can't be computed online; batching fixes it" },
      ],
      correctOptionId: "b",
      explanation:
        "A simple mean weights a stale slow sample from long ago the same as a fresh one, so the score lags reality. An exponentially weighted moving average (EWMA) decays old samples, tracking recent behavior — which is the next concept.",
    },
  ],
};
