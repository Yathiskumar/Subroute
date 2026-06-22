import type { ConceptContent } from "@/lib/content/types";

export const slidingLog: ConceptContent = {
  prototypeCaption:
    "Each click adds a timestamp to the log. The 8-second sliding window is the orange box on the right. Dots inside count; dots that have aged out are greyed and ignored. Burst a few times and watch entries decay leftward.",

  overview: [
    {
      type: "p",
      text: "The sliding window log is the most precise rate-limiting algorithm in the canonical family. Instead of summarizing requests in counters, you store the timestamp of every single one. On each new request, you drop the timestamps older than your window, count what remains, and compare to the limit.",
    },
    {
      type: "p",
      text: "There is no approximation, no boundary problem, no smoothing artifact — the log knows exactly when each request happened. The cost is that the log grows with traffic, and at high request rates this becomes the most expensive of the five algorithms.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Store every timestamp" },
    {
      type: "p",
      text: "Per client, the state is a sorted set of timestamps. On each request:",
    },
    {
      type: "ol",
      items: [
        "Remove all timestamps older than `now − windowSize`.",
        "If the remaining count is less than the limit, append `now` and **allow**.",
        "Otherwise, **reject**.",
      ],
    },
    {
      type: "p",
      text: "In Redis this is a `ZSET` keyed by client ID. The typical Lua-script pattern is `ZREMRANGEBYSCORE` (drop old entries), `ZCARD` (count what's left), and `ZADD` (insert the new timestamp) — all under a single atomic script.",
    },
    { type: "h", text: "Where the cost comes from" },
    {
      type: "p",
      text: "Memory grows linearly with request rate: at 1000 req/sec with a 60-second window, that's up to 60,000 timestamps stored per client. Each timestamp is ~16 bytes in Redis, so ~1 MB per client. Multiply by users and the cost is real.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Use it where precision matters",
      text: "Sliding log shines for low-rate, high-value endpoints — login attempts, password resets, payment requests — where exact counting matters more than efficiency.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Security-sensitive limits** — login attempts, OTP requests, password resets, financial transactions.",
        "**Low request rates with strict ceilings** — for example, '3 password resets per hour' is cheap to store and matters precisely.",
        "**Audit and forensics use cases** where you also want the raw timestamps for analysis later.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "Auth services typically use a sliding log (or its DB equivalent) for login throttling. The log is small (handful of timestamps per user), and the cost of being wrong — letting through a brute-force attempt — is large.",
    },
  ],

  tradeoffs: {
    pros: [
      "Exact: no approximation, no boundary issues, no weighting assumptions.",
      "The log itself doubles as an audit trail — you know when each request happened.",
      "Easy to reason about: 'X requests in the last Y seconds' is literal.",
    ],
    cons: [
      "Memory scales with request volume — can be expensive at high rates.",
      "Per-request cost is higher: must scan or delete a range of entries.",
      "More moving parts in distributed setups (Lua scripts, ZSETs) than the simpler counter algorithms.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch entries decay",
      body: "Send a single request. Watch the dot move leftward over 12 seconds — at 8 seconds, it crosses the dashed line and stops counting.",
    },
    {
      title: "02 · The smoothing property",
      body: "Burst 8 requests. Five succeed. After 8 seconds (when the first entries age out), you'll be allowed again — and the timing is exact, unlike sliding window counter's approximation.",
    },
    {
      title: "03 · Stress-test it",
      body: "Send a burst, then keep clicking once per second. You'll find the limiter rejects until exactly the right moment — never sooner, never later. That's the precision the log buys you.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "sliding-log.ts",
      code: `// Sliding log — exact, but stores every timestamp.
class SlidingLog {
  private log: number[] = [];

  constructor(
    private limit: number,
    private windowSizeMs: number,
  ) {}

  allow(): boolean {
    const now = Date.now();
    const cutoff = now - this.windowSizeMs;
    // Drop expired timestamps (log is append-ordered).
    while (this.log.length && this.log[0] <= cutoff) {
      this.log.shift();
    }
    if (this.log.length >= this.limit) return false;
    this.log.push(now);
    return true;
  }
}

// Redis (atomic via Lua):
//   ZREMRANGEBYSCORE rl:{user} -inf {now - window}
//   ZCARD rl:{user}              -> count
//   if count < limit:
//     ZADD rl:{user} {now} {uuid}
//   EXPIRE rl:{user} {window-seconds}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "SlidingLog.java",
      code: `// Sliding log — exact, but stores every timestamp.
import java.util.ArrayDeque;
import java.util.Deque;

class SlidingLog {
    private final Deque<Long> log = new ArrayDeque<>();
    private final int limit;
    private final long windowSizeMs;

    SlidingLog(int limit, long windowSizeMs) {
        this.limit = limit;
        this.windowSizeMs = windowSizeMs;
    }

    synchronized boolean allow() {
        long now = System.currentTimeMillis();
        long cutoff = now - windowSizeMs;
        // Drop expired timestamps (log is append-ordered).
        while (!log.isEmpty() && log.peekFirst() <= cutoff) {
            log.pollFirst();
        }
        if (log.size() >= limit) return false;
        log.addLast(now);
        return true;
    }
}

// Redis (atomic via Lua): ZREMRANGEBYSCORE to prune, ZCARD to count,
// ZADD the new timestamp if under the limit, then EXPIRE the key.`,
    },
    {
      label: "Python",
      language: "python",
      filename: "sliding_log.py",
      code: `import time
from collections import deque


class SlidingLog:
    """Sliding log — exact, but stores every timestamp."""

    def __init__(self, limit: int, window_size_s: float) -> None:
        self.limit = limit
        self.window_size_s = window_size_s
        self.log: deque[float] = deque()

    def allow(self) -> bool:
        now = time.monotonic()
        cutoff = now - self.window_size_s
        # Drop expired timestamps (log is append-ordered).
        while self.log and self.log[0] <= cutoff:
            self.log.popleft()
        if len(self.log) >= self.limit:
            return False
        self.log.append(now)
        return True


# Redis (atomic via Lua): ZREMRANGEBYSCORE to prune, ZCARD to count,
# ZADD the new timestamp if under the limit, then EXPIRE the key.`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "sliding_log.cpp",
      code: `// Sliding log — exact, but stores every timestamp.
#include <chrono>
#include <deque>
#include <mutex>

class SlidingLog {
    using clock = std::chrono::steady_clock;
    std::deque<clock::time_point> log_;
    int limit_;
    std::chrono::milliseconds windowSize_;
    std::mutex mu_;

public:
    SlidingLog(int limit, std::chrono::milliseconds windowSize)
        : limit_(limit), windowSize_(windowSize) {}

    bool allow() {
        std::lock_guard<std::mutex> lock(mu_);
        auto now = clock::now();
        auto cutoff = now - windowSize_;
        // Drop expired timestamps (log is append-ordered).
        while (!log_.empty() && log_.front() <= cutoff) {
            log_.pop_front();
        }
        if (static_cast<int>(log_.size()) >= limit_) return false;
        log_.push_back(now);
        return true;
    }
};

// Redis (atomic via Lua): ZREMRANGEBYSCORE to prune, ZCARD to count,
// ZADD the new timestamp if under the limit, then EXPIRE the key.`,
    },
  ],

  furtherReading: [
    {
      label: "Redis — Build rate limiters: fixed window, sliding window log, and more",
      href: "https://redis.io/tutorials/howtos/ratelimiting/",
      note: "Canonical `ZREMRANGEBYSCORE` + `ZCARD` + `ZADD` Lua script for the sorted-set sliding log.",
      kind: "docs",
    },
    {
      label: "Stripe Engineering — Scaling your API with rate limiters",
      href: "https://stripe.com/blog/rate-limiters",
      note: "Discusses sliding log alongside token bucket trade-offs in production.",
      kind: "article",
    },
    {
      label: "Wikipedia — Generic cell rate algorithm (GCRA)",
      href: "https://en.wikipedia.org/wiki/Generic_cell_rate_algorithm",
      note: "The dense, log-free alternative for high-rate scenarios — exact, but O(1) memory.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "sl-q1",
      question:
        "What is the main reason sliding window log is rarely used at high request rates?",
      options: [
        { id: "a", label: "It's less accurate than fixed window." },
        { id: "b", label: "Memory grows linearly with request volume — storing every timestamp gets expensive." },
        { id: "c", label: "It cannot run on Redis." },
        { id: "d", label: "It has boundary problems like fixed window." },
      ],
      correctOptionId: "b",
      explanation:
        "At 1000 req/sec over a 60s window, that's potentially 60,000 timestamps per client. Sliding log is precise but pays in memory and per-request scan cost.",
    },
    {
      id: "sl-q2",
      question:
        "Where does sliding window log shine compared to the counter algorithms?",
      options: [
        { id: "a", label: "High-throughput public APIs." },
        { id: "b", label: "Low-rate, high-value limits like login attempts or password resets — where precision matters and request volume is low." },
        { id: "c", label: "Streaming media servers." },
        { id: "d", label: "Anywhere — it's strictly better than the others." },
      ],
      correctOptionId: "b",
      explanation:
        "Per-user auth flows have tiny logs (a few timestamps) and strict precision requirements. The trade-off cost is negligible there, while the security benefit is large.",
    },
    {
      id: "sl-q3",
      question:
        "Which Redis primitives most naturally implement sliding window log?",
      options: [
        { id: "a", label: "STRING with INCR + EXPIRE." },
        { id: "b", label: "HASH fields." },
        { id: "c", label: "ZSET (sorted set) — entries scored by timestamp, with ZREMRANGEBYSCORE + ZCARD + ZADD." },
        { id: "d", label: "PUBSUB channels." },
      ],
      correctOptionId: "c",
      explanation:
        "A sorted set keyed by client ID, scored by timestamp, is the textbook implementation. The three ZSET operations under a Lua script give atomic, exact sliding-log semantics.",
    },
  ],
};
