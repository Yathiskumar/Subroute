import type { ConceptContent } from "@/lib/content/types";

export const tokenBucket: ConceptContent = {
  prototypeCaption:
    "A bucket of size 10 refills at one token per second. Each request consumes a token. Hit 'Burst of 10' to drain it instantly — then watch the bucket recover at the steady refill rate.",

  overview: [
    {
      type: "p",
      text: "The token bucket is the most widely deployed rate-limiting algorithm on the public internet. It powers the request quotas behind APIs at Stripe, AWS, GitHub, Cloudflare, and most service meshes. The reason: it lets you allow short bursts while still enforcing a strict long-term rate — and it costs almost nothing to implement.",
    },
    {
      type: "p",
      text: "The mental model is exactly what the name suggests. A bucket holds tokens. A faucet drips new tokens in at a constant rate. Every incoming request tries to grab one token. If the bucket has one, the request goes through. If it's empty, the request is rejected (or queued).",
    },
  ],

  howItWorks: [
    { type: "h", text: "Two numbers, that's it" },
    {
      type: "p",
      text: "A token bucket is described by two parameters:",
    },
    {
      type: "ul",
      items: [
        "**Capacity (B)** — the maximum number of tokens the bucket can hold. This is your burst budget.",
        "**Refill rate (r)** — how many tokens are added per second. This is your sustained throughput.",
      ],
    },
    {
      type: "p",
      text: "Each arriving request costs one token (or sometimes more — for example, a heavy endpoint might cost 5 tokens). The algorithm is:",
    },
    {
      type: "ol",
      items: [
        "On each request, first refill: `tokens = min(B, tokens + elapsed × r)`.",
        "If `tokens ≥ cost`, subtract `cost` and **allow** the request.",
        "Otherwise, **reject** the request (or queue it, depending on the policy).",
      ],
    },
    { type: "h", text: "Why the lazy refill?" },
    {
      type: "p",
      text: "Notice the refill is computed on-demand using the elapsed time since the last update — there's no background timer ticking tokens in. This is the trick that makes token bucket O(1) memory and trivially distributed: you only need to store `tokens` and `lastRefill` per client.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Bursts vs. sustained rate",
      text: "The bucket capacity B controls how big a burst can be. The refill rate r controls the sustained rate. These two are independent — you can pick generous bursts with a tight long-run rate, or vice versa.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Public APIs** where occasional bursts are user-friendly but sustained abuse must be capped.",
        "**Per-user or per-API-key quotas** at the edge — gateway, reverse proxy, or service mesh.",
        "Anywhere you want a simple two-number contract: \"X requests/sec, with bursts up to Y\".",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "Stripe's API limits are token-bucket: 100 requests/sec sustained, with the ability to burst to ~25 in a short window. AWS API Gateway uses the same model under the hood.",
    },
  ],

  tradeoffs: {
    pros: [
      "Allows short bursts — feels good for real user traffic that is bursty by nature.",
      "Two counters per client — trivial in memory and easy to distribute via Redis or a counter store.",
      "Lazy O(1) refill with no background scheduler.",
      "Easy to tune: capacity = burst budget, refill = sustained rate.",
    ],
    cons: [
      "Brief over-rate windows are intentional — if downstream cannot handle a burst, this is the wrong tool.",
      "In distributed setups, contention on the shared counter requires careful design (Redis Lua scripts, sharding, or sloppy approximations).",
      "Heterogeneous request costs need careful pricing or one expensive call can drain the bucket.",
    ],
  },

  handsOn: [
    {
      title: "01 · Drain it on purpose",
      body: "Click 'Burst of 10' once. Watch the bucket empty and the next clicks get rejected. Time how long until you can send one again — that's the refill rate doing its job.",
    },
    {
      title: "02 · The 'burst then idle' trick",
      body: "Send a burst, wait 10 seconds without clicking, then burst again. The bucket refilled fully during your idle period, so you get a fresh burst budget — even though your one-minute total is well above the refill rate.",
    },
    {
      title: "03 · Predict the steady state",
      body: "If the bucket starts full and you click 'Send request' once per second forever, what does the token count converge to? Try it for 30 seconds and confirm.",
    },
  ],

  codeSamples: [
    {
      label: "TypeScript",
      language: "typescript",
      filename: "token-bucket.ts",
      code: `// A minimal token bucket. Lazy refill — no timer needed.
class TokenBucket {
  constructor(
    private capacity: number,        // max burst budget
    private refillPerSecond: number, // sustained rate
    private tokens = capacity,
    private lastRefill = Date.now(),
  ) {}

  tryConsume(cost = 1): boolean {
    this.refill();
    if (this.tokens < cost) return false;
    this.tokens -= cost;
    return true;
  }

  private refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillPerSecond,
    );
    this.lastRefill = now;
  }
}

// Usage: 100 req/s sustained, bursts up to 25
const bucket = new TokenBucket(25, 100);
if (bucket.tryConsume()) {
  // ... handle the request
} else {
  // ... return 429 Too Many Requests
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "TokenBucket.java",
      code: `// A minimal token bucket. Lazy refill — no timer needed.
class TokenBucket {
    private final double capacity;        // max burst budget
    private final double refillPerSecond; // sustained rate
    private double tokens;
    private long lastRefill = System.nanoTime();

    TokenBucket(double capacity, double refillPerSecond) {
        this.capacity = capacity;
        this.refillPerSecond = refillPerSecond;
        this.tokens = capacity;
    }

    synchronized boolean tryConsume(double cost) {
        refill();
        if (tokens < cost) return false;
        tokens -= cost;
        return true;
    }

    private void refill() {
        long now = System.nanoTime();
        double elapsed = (now - lastRefill) / 1_000_000_000.0;
        tokens = Math.min(capacity, tokens + elapsed * refillPerSecond);
        lastRefill = now;
    }
}

// Usage: 100 req/s sustained, bursts up to 25
TokenBucket bucket = new TokenBucket(25, 100);
if (bucket.tryConsume(1)) {
    // ... handle the request
} else {
    // ... return 429 Too Many Requests
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "token_bucket.py",
      code: `import time


class TokenBucket:
    """A minimal token bucket. Lazy refill — no timer needed."""

    def __init__(self, capacity: float, refill_per_second: float) -> None:
        self.capacity = capacity                    # max burst budget
        self.refill_per_second = refill_per_second  # sustained rate
        self.tokens = capacity
        self.last_refill = time.monotonic()

    def try_consume(self, cost: float = 1) -> bool:
        self._refill()
        if self.tokens < cost:
            return False
        self.tokens -= cost
        return True

    def _refill(self) -> None:
        now = time.monotonic()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_per_second)
        self.last_refill = now


# Usage: 100 req/s sustained, bursts up to 25
bucket = TokenBucket(25, 100)
if bucket.try_consume():
    ...  # handle the request
else:
    ...  # return 429 Too Many Requests`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "token_bucket.cpp",
      code: `// A minimal token bucket. Lazy refill — no timer needed.
#include <algorithm>
#include <chrono>

class TokenBucket {
    double capacity_;         // max burst budget
    double refillPerSecond_;  // sustained rate
    double tokens_;
    std::chrono::steady_clock::time_point lastRefill_;

public:
    TokenBucket(double capacity, double refillPerSecond)
        : capacity_(capacity), refillPerSecond_(refillPerSecond),
          tokens_(capacity), lastRefill_(std::chrono::steady_clock::now()) {}

    bool tryConsume(double cost = 1) {
        refill();
        if (tokens_ < cost) return false;
        tokens_ -= cost;
        return true;
    }

private:
    void refill() {
        auto now = std::chrono::steady_clock::now();
        double elapsed = std::chrono::duration<double>(now - lastRefill_).count();
        tokens_ = std::min(capacity_, tokens_ + elapsed * refillPerSecond_);
        lastRefill_ = now;
    }
};

// Usage: 100 req/s sustained, bursts up to 25
// TokenBucket bucket(25, 100);
// if (bucket.tryConsume()) { /* handle */ } else { /* 429 */ }`,
    },
  ],

  furtherReading: [
    {
      label: "Wikipedia — Token bucket",
      href: "https://en.wikipedia.org/wiki/Token_bucket",
      note: "Clear canonical description of the algorithm and its bandwidth/burstiness semantics.",
      kind: "article",
    },
    {
      label: "Stripe Engineering — Scaling your API with rate limiters",
      href: "https://stripe.com/blog/rate-limiters",
      note: "Public engineering blog walks through their token-bucket choices in production.",
      kind: "article",
    },
    {
      label: "RFC 2697 — A Single Rate Three Color Marker",
      href: "https://www.rfc-editor.org/rfc/rfc2697",
      note: "Formal two-token-bucket meter (CIR/CBS/EBS) used in network traffic shaping.",
      kind: "spec",
    },
    {
      label: "Cloudflare — How we built rate limiting capable of scaling to millions of domains",
      href: "https://blog.cloudflare.com/counting-things-a-lot-of-different-things/",
      note: "Distributed limiter with Redis. Worth the read for the consistency trade-offs.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "tb-q1",
      question:
        "Which parameter of a token bucket controls how big a sudden burst can be?",
      options: [
        { id: "a", label: "Refill rate" },
        { id: "b", label: "Bucket capacity" },
        { id: "c", label: "Token cost per request" },
        { id: "d", label: "Time since last refill" },
      ],
      correctOptionId: "b",
      explanation:
        "Capacity is the maximum number of tokens the bucket can hold at once. A full bucket can be drained quickly — that drain is your burst. The refill rate controls sustained throughput, not burst size.",
    },
    {
      id: "tb-q2",
      question:
        "Why is refill computed on each request instead of by a background timer?",
      options: [
        { id: "a", label: "Because timers are inaccurate" },
        { id: "b", label: "To save CPU on idle clients and keep memory O(1) per bucket" },
        { id: "c", label: "Because requests are processed in parallel" },
        { id: "d", label: "It's not — most implementations use a timer" },
      ],
      correctOptionId: "b",
      explanation:
        "Lazy refill — computing `tokens = min(B, tokens + elapsed × r)` only when a request arrives — means no scheduler is needed. You store two numbers per client (tokens, lastRefill), and idle clients cost zero CPU.",
    },
    {
      id: "tb-q3",
      question:
        "A token bucket has capacity 100 and refill rate 10/sec. What is the maximum number of requests that can be served in 1 minute, starting from a full bucket?",
      options: [
        { id: "a", label: "100" },
        { id: "b", label: "600" },
        { id: "c", label: "700" },
        { id: "d", label: "Unbounded" },
      ],
      correctOptionId: "c",
      explanation:
        "Start with 100 (the full bucket) + 60 seconds × 10 tokens/sec (refill) = 700 maximum. The bucket lets you 'pre-pay' your sustained rate by up to capacity tokens.",
    },
  ],
};
