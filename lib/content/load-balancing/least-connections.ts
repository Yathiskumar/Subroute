import type { ConceptContent } from "@/lib/content/types";

export const leastConnections: ConceptContent = {
  prototypeCaption:
    "Now requests have *duration*: each carries a random service time, drawn as a bar that drains while the server works it. The balancer routes every new request to whichever server has the fewest active connections right now — watch the 'Active' counts stay tight even as durations vary wildly. Try 'Send 10' to stress it.",

  overview: [
    {
      type: "p",
      text: "Round robin and random both assume requests are interchangeable. They aren't. A database query might run for two seconds; the health check behind it finishes in five milliseconds. When durations vary, counting requests tells you nothing about how busy a server actually is. Least connections fixes that by routing to whichever backend currently has the **fewest open connections** — a direct, live proxy for 'who is least busy.'",
    },
    {
      type: "p",
      text: "This is the first genuinely *state-aware* algorithm in the set. Instead of a blind counter, the balancer keeps a live tally of in-flight requests per server, increments it when it dispatches, and decrements it when the response completes. New work flows to the shortest queue — exactly how you'd pick a checkout line at the supermarket.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Track active connections, route to the minimum" },
    {
      type: "ol",
      items: [
        "Keep an `active[]` counter per server, all starting at 0.",
        "On a new request, pick the server with the smallest `active` count (break ties however you like — lowest index, or random).",
        "Increment that server's `active` *immediately*, then forward the request.",
        "When the response finishes, decrement that server's `active`.",
      ],
    },
    {
      type: "p",
      text: "Because slow requests keep their connection open longer, a server stuck with heavy work shows a higher active count and is automatically passed over for new requests until it catches up. The algorithm adapts to real load without ever measuring CPU or response time — connection count is the signal.",
    },
    { type: "h", text: "Increment eagerly, not on arrival" },
    {
      type: "p",
      text: "There's a subtle correctness trap the prototype is built to show. The counter must increment the **instant the balancer commits** to a server — not when the request finally lands at the backend. If you wait, a fast burst of arrivals all see the same stale 'everyone has 0 connections' snapshot and stampede onto the *same* server. The prototype increments at the moment of decision (watch the load balancer box pulse and a dashed 'reserved slot' appear before the request even arrives), which is why rapid 'Send 10' bursts still fan out cleanly.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Distributed least-connections is hard",
      text: "A single balancer sees its own dispatches perfectly. But several independent balancers each only know about *their own* connections — none has the global active count. They can collectively overload a backend that each thought was idle. This staleness is the central challenge of distributed load balancing, and a big reason power-of-two-choices exists.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Variable request durations** — anything where some requests are far heavier than others: search, reporting, file processing.",
        "**Long-lived connections** — websockets, streaming, database connection pools, SSE. Connection count *is* the load here.",
        "**A single balancer (or a small coordinated set)** that can see most of the traffic and keep an accurate active count.",
        "**Mixed-latency backends** — if one server is transiently slow (GC pause, cold cache), its connections drain slower, so it naturally receives less new work.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world default for L4",
      text: "Least connections (`leastconn` in HAProxy, `least_conn` in NGINX) is the go-to for TCP/L4 balancing and any workload with long or uneven sessions. It's often the recommended upgrade from round robin the moment request durations stop being uniform.",
    },
  ],

  tradeoffs: {
    pros: [
      "Adapts to real, live load instead of assuming uniform requests.",
      "Excellent for long-lived or highly variable connections.",
      "Naturally routes around a transiently slow server — its connections drain slower, so it gets fewer new ones.",
      "Still cheap: O(N) to scan for the minimum (or O(log N) with a heap), one counter per server.",
    ],
    cons: [
      "Requires per-server connection state — more bookkeeping than stateless schemes.",
      "Connection *count* isn't perfect: many cheap connections can outweigh a few expensive ones.",
      "Distributed balancers see only their own connections; stale global state can still overload a backend.",
      "Blind to server *capacity* — treats a big and small server as equal (that's what Weighted Least Connections fixes).",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch durations drive the balance",
      body: "Hit 'Auto' and watch the bars: each request's bar height is its remaining service time, and it drains as the server works. The balancer keeps sending new requests to the server with the lowest 'Active' count, so a server that caught a tall (slow) bar gets skipped until it drains. The 'Spread (max − min)' stat stays small — that's the whole point.",
    },
    {
      title: "02 · Stress it with a burst",
      body: "Click 'Send 10'. Ten requests fire in quick succession — and notice they fan out across all four servers instead of stacking on one. That's the eager counter: each pick increments 'Active' immediately (watch the LB box pulse and the dashed reserved slot appear), so the next pick already sees the updated counts.",
    },
    {
      title: "03 · Compare against round robin in your head",
      body: "Crank 'Arrival every' down so requests pour in. Some bars are short, some tall, yet active counts stay balanced. Round robin would have ignored those bar heights entirely and dealt every fourth request to the same server regardless of how loaded it was — that gap is exactly what least connections closes.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "least_connections.go",
      code: `package lb

// Least connections: route to the shortest queue, count eagerly.
type LeastConnBalancer struct {
	servers []string
	active  []int
}

func NewLeastConnBalancer(servers []string) *LeastConnBalancer {
	return &LeastConnBalancer{
		servers: servers,
		active:  make([]int, len(servers)),
	}
}

// Acquire picks the least-busy server and reserves a slot immediately.
func (b *LeastConnBalancer) Acquire() int {
	best := 0
	for i := 1; i < len(b.active); i++ {
		if b.active[i] < b.active[best] {
			best = i
		}
	}
	b.active[best]++ // increment NOW, at decision time —
	return best      // not when the request reaches the backend
}

// Release is called when the response completes.
func (b *LeastConnBalancer) Release(serverIndex int) {
	b.active[serverIndex]--
}

// Usage
// lb := NewLeastConnBalancer([]string{"s1", "s2", "s3", "s4"})
// i := lb.Acquire() // forward request to servers[i]
// // ... await response ...
// lb.Release(i)`,
    },
    {
      label: "Java",
      language: "java",
      filename: "LeastConnections.java",
      code: `// Least connections: route to the shortest queue, count eagerly.
class LeastConnBalancer {
    private final String[] servers;
    private final int[] active;

    LeastConnBalancer(String[] servers) {
        this.servers = servers;
        this.active = new int[servers.length];
    }

    // Pick the least-busy server and reserve a slot immediately.
    synchronized int acquire() {
        int best = 0;
        for (int i = 1; i < active.length; i++) {
            if (active[i] < active[best]) best = i;
        }
        active[best]++;          // increment NOW, at decision time —
        return best;             // not when the request reaches the backend
    }

    // Call when the response completes.
    synchronized void release(int serverIndex) {
        active[serverIndex]--;
    }
}

// Usage
LeastConnBalancer lb =
    new LeastConnBalancer(new String[] {"s1", "s2", "s3", "s4"});
int i = lb.acquire();            // forward request to servers[i]
// ... await response ...
lb.release(i);`,
    },
    {
      label: "Python",
      language: "python",
      filename: "least_connections.py",
      code: `# Least connections: route to the shortest queue, count eagerly.
class LeastConnBalancer:
    def __init__(self, servers: list[str]) -> None:
        self.servers = servers
        self.active = [0] * len(servers)

    def acquire(self) -> int:
        """Pick the least-busy server and reserve a slot immediately."""
        best = 0
        for i in range(1, len(self.active)):
            if self.active[i] < self.active[best]:
                best = i
        self.active[best] += 1   # increment NOW, at decision time —
        return best              # not when the request reaches the backend

    def release(self, server_index: int) -> None:
        """Call when the response completes."""
        self.active[server_index] -= 1


# Usage
lb = LeastConnBalancer(["s1", "s2", "s3", "s4"])
i = lb.acquire()                 # forward request to servers[i]
# ... await response ...
lb.release(i)`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "least_connections.cpp",
      code: `// Least connections: route to the shortest queue, count eagerly.
#include <string>
#include <vector>

class LeastConnBalancer {
    std::vector<std::string> servers_;
    std::vector<int> active_;

public:
    explicit LeastConnBalancer(std::vector<std::string> servers)
        : servers_(std::move(servers)), active_(servers_.size(), 0) {}

    // Pick the least-busy server and reserve a slot immediately.
    int acquire() {
        int best = 0;
        for (size_t i = 1; i < active_.size(); i++) {
            if (active_[i] < active_[best]) best = static_cast<int>(i);
        }
        active_[best]++;         // increment NOW, at decision time —
        return best;             // not when the request reaches the backend
    }

    // Call when the response completes.
    void release(int serverIndex) {
        active_[serverIndex]--;
    }
};

// Usage
// LeastConnBalancer lb({"s1", "s2", "s3", "s4"});
// int i = lb.acquire(); // forward request to servers[i]
// // ... await response ...
// lb.release(i);`,
    },
  ],

  furtherReading: [
    {
      label: "NGINX — least_conn",
      href: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/#load-balancing-methods",
      note: "NGINX's least-connections method and how it combines with weights.",
      kind: "docs",
    },
    {
      label: "HAProxy — Load balancing algorithms (leastconn)",
      href: "https://www.haproxy.com/documentation/haproxy-configuration-tutorials/load-balancing/",
      note: "When HAProxy recommends `leastconn` over roundrobin: long sessions (LDAP, SQL, TCP) and variable request durations.",
      kind: "docs",
    },
    {
      label: "Envoy — Load balancers (least request)",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers",
      note: "Envoy's 'least request' LB — and crucially, how it falls back to power-of-two-choices when it can't see every backend's full state.",
      kind: "docs",
    },
    {
      label: "AWS — ALB now supports Least Outstanding Requests",
      href: "https://aws.amazon.com/about-aws/whats-new/2019/11/application-load-balancer-now-supports-least-outstanding-requests-algorithm-for-load-balancing-requests/",
      note: "AWS's name for least-connections, and exactly the case they recommend it for: requests that vary in complexity across uneven targets.",
      kind: "docs",
    },
    {
      label: "Tyler McMullen — Load Balancing is Impossible (talk)",
      href: "https://www.infoq.com/presentations/load-balancing/",
      note: "The 'horrific edge cases' of least-conns in distributed setups — the stale-state stampede this concept warns about, demonstrated.",
      kind: "video",
    },
    {
      label: "Google SRE Book — Ch. 20: Load Balancing in the Datacenter",
      href: "https://sre.google/sre-book/load-balancing-datacenter/",
      note: "Why connection count alone is an imperfect load signal at scale, and what Google layers on top of it.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "lc-q1",
      question: "What signal does least connections use to choose a server?",
      options: [
        { id: "a", label: "A round-robin counter" },
        { id: "b", label: "The number of currently active connections per server" },
        { id: "c", label: "Each server's static weight" },
        { id: "d", label: "A random draw" },
      ],
      correctOptionId: "b",
      explanation:
        "It routes each request to the server with the fewest in-flight connections — a live proxy for 'who is least busy.' That makes it adapt to real load, unlike the stateless counter/coin-flip schemes.",
    },
    {
      id: "lc-q2",
      question:
        "Why must the active-connection counter be incremented at the moment of the routing decision, not when the request reaches the backend?",
      options: [
        { id: "a", label: "To save memory" },
        { id: "b", label: "So a fast burst of arrivals doesn't all see the same stale counts and stampede one server" },
        { id: "c", label: "Because backends can't be trusted to report completion" },
        { id: "d", label: "It doesn't matter when you increment" },
      ],
      correctOptionId: "b",
      explanation:
        "If you delay the increment, several requests arriving in quick succession all read the same 'everyone is idle' snapshot and pile onto the same server. Incrementing eagerly at decision time means each subsequent pick already sees the reservation.",
    },
    {
      id: "lc-q3",
      question:
        "Why is least connections harder to get right across multiple independent load balancers?",
      options: [
        { id: "a", label: "Each balancer only knows its own connections, so none has the true global count" },
        { id: "b", label: "Random number generators disagree across machines" },
        { id: "c", label: "Connection counts can't be stored in integers" },
        { id: "d", label: "It requires every server to have the same weight" },
      ],
      correctOptionId: "a",
      explanation:
        "A lone balancer tracks its dispatches perfectly, but with several balancers each sees only its own slice. All of them can pick the same 'idle-looking' backend and collectively overload it. This stale-state problem is central to distributed load balancing.",
    },
  ],
};
