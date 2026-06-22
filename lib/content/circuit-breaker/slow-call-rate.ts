import type { ConceptContent } from "@/lib/content/types";

export const slowCallRate: ConceptContent = {
  prototypeCaption:
    "The breaker trips on **latency**, not errors. Every bar is one call's response time. Calls below the dotted line are **fast** (green); above it, **slow** (amber). Once the share of slow calls crosses the rate threshold, the breaker **trips** — even though every single call 'succeeded'. Drag **Downstream latency** above the slow line to see it happen on its own.",

  overview: [
    {
      type: "p",
      text: "Sometimes the downstream isn't broken — it's just *slow*. A database returning correct rows in 5 seconds will exhaust your thread pool just as effectively as one returning 500s instantly. The classic error-only breaker can't see that: every call returns 200 OK and the breaker stays closed while your service drowns.",
    },
    {
      type: "p",
      text: "The Slow Call Rate variant adds a latency dimension. Each call is timed; any call slower than a configured duration D is counted as 'slow.' If the share of slow calls in the window crosses a rate threshold (default 50%), the breaker trips just as it would for errors.",
    },
    {
      type: "p",
      text: "It's not a replacement for the error-based rule — most production setups run both. Errors trip on outright failure; slow-call-rate trips on degraded performance. Together they catch the two ways a dependency can take your service down.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The trip rule" },
    {
      type: "ol",
      items: [
        "On every call, **measure the duration** (start_time → end_time).",
        "Push the duration into a sliding window (count- or time-based — both work, this prototype uses count-based for clarity).",
        "Count how many durations are **≥ D** (the slow threshold).",
        "If that count divided by the window size hits the **slow-rate threshold** (e.g. 50%), **trip**.",
        "OPEN, cooldown, HALF-OPEN, trials — the rest is the standard state machine, with the same trip rule (still latency-based) applied to the trial calls.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Choose D from your SLO, not your gut",
      text: "The slow-duration D should come from what *callers* consider acceptable, not from what feels round. If your p99 SLO is 500ms, set D somewhere around there — D ≪ 500ms is too sensitive (trips on normal noise), D ≫ 500ms is too lax (trips after you've already broken the SLO). Real implementations often pick D = your timeout / 2.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Errors AND slow-call-rate, in parallel",
      text: "Resilience4j's recommendation is to enable both. An error rate trip catches outright 5xx; a slow-call-rate trip catches the trickier case where the dependency hangs but eventually returns. If you only enable one, prefer slow-call-rate for any dependency that holds a thread or connection — the slow-call case is the one that actually cascades.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to add Slow Call Rate to the mix" },
    {
      type: "ul",
      items: [
        "**Synchronous calls that hold a thread** — a slow downstream pins your thread pool. The slow-call-rate breaker frees those threads by failing fast.",
        "**Connection-pool-bound clients** — same idea at the connection layer. A slow database doesn't error, but it holds every connection in your pool until you trip.",
        "**Strict latency SLOs** — if 'too slow' is itself a contract violation, you'd rather degrade gracefully (fallback, cached value) than serve a slow response.",
        "**Downstreams that prefer to hang than fail** — some services swallow errors and time out at the load balancer instead of returning fast errors. Latency is the only signal you'll see.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "It pairs with timeouts, not replaces them",
      text: "A breaker is not a timeout. Without a timeout, a slow call still blocks the caller; the breaker only sees its duration after it eventually returns. Always set a per-call timeout *first*; the breaker then uses the bounded duration distribution to decide when to trip globally.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Catches the 'slow but not failing' case** that error-only breakers miss entirely.",
      "**Composes with the error-rate rule** — most libraries let you set both thresholds and either trips the breaker.",
      "**Cheap to add** — just record (duration, was-slow) per call; the comparison and counter are O(1).",
      "**Operationally legible** — 'we trip if ≥ 50% of calls take longer than 500 ms' is a one-sentence SLO you can show to product.",
    ],
    cons: [
      "**Tuning D matters** — wrong D means false trips (too low) or missed degradations (too high).",
      "**Doesn't capture errors** — you still need an error-rate rule (or both rules running in parallel).",
      "**Sensitive to one slow tail call** in low-volume windows — 1 of 2 calls being slow is 50% slow rate.",
      "**Has to wait for the call to return** to measure it — a permanently hanging call (no timeout) never registers as 'slow'. Hence the warning above.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the bars colour by speed",
      body: "Click **fast call** a few times — short green bars. Click **slow call** a few times — taller amber bars that overshoot the dotted line. The bar height is the latency; the threshold line and the colour both come from your **Slow if over** setting.",
    },
    {
      title: "02 · Trip on slow alone (no errors)",
      body: "Click **slow call** five times in a row. The bottom rate bar climbs into red — every call 'succeeded' but the slow-call rate is 100%. The breaker trips. The point: an error-only breaker would still be sitting at green right now.",
    },
    {
      title: "03 · Auto traffic with rising latency",
      body: "Tick **Auto traffic**. Slowly raise **Downstream latency** past the **Slow if over** value. Watch the bars turn amber and the rate climb. Drop latency back down to recover.",
    },
    {
      title: "04 · Tune the slow-duration",
      body: "Set **Downstream latency** to a fixed value, e.g. 400ms. Now slide **Slow if over** from 100ms to 1200ms. Same calls, completely different verdict — when D=100, all are slow; when D=1200, none are. The take-away: this knob is your most important one.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "slow_call_rate.go",
      code: `// Slow-call-rate breaker: trip when too many calls take longer than D ms.
// Same state machine as the error-rate breaker, just a different signal.
package breaker

import (
	"errors"
	"time"
)

var ErrOpen = errors.New("circuit open")

type SlowCallBreaker struct {
	state     string          // "CLOSED" | "OPEN" | "HALF"
	durations []time.Duration // recorded latencies
	trials    []time.Duration
	openUntil time.Time

	size          int
	slow          time.Duration
	rateThreshold float64
	cooldown      time.Duration
	trialCount    int
	minCalls      int
}

func NewSlowCallBreaker() *SlowCallBreaker {
	return &SlowCallBreaker{
		state:         "CLOSED",
		size:          10,
		slow:          500 * time.Millisecond,
		rateThreshold: 0.5,
		cooldown:      5000 * time.Millisecond,
		trialCount:    3,
		minCalls:      5,
	}
}

func (cb *SlowCallBreaker) Call(work func() error) error {
	if cb.state == "OPEN" && !time.Now().Before(cb.openUntil) {
		cb.state = "HALF"
		cb.trials = nil
	}
	if cb.state == "OPEN" {
		return ErrOpen
	}

	start := time.Now()
	err := work()
	cb.record(time.Since(start)) // record even on error
	return err
}

func (cb *SlowCallBreaker) record(d time.Duration) {
	if cb.state == "HALF" {
		cb.trials = append(cb.trials, d)
		if len(cb.trials) >= cb.trialCount {
			if cb.slowRate(cb.trials) >= cb.rateThreshold {
				cb.trip()
			} else {
				cb.close()
			}
		}
		return
	}
	cb.durations = append(cb.durations, d)
	if len(cb.durations) > cb.size {
		cb.durations = cb.durations[1:]
	}
	if len(cb.durations) >= cb.minCalls && cb.slowRate(cb.durations) >= cb.rateThreshold {
		cb.trip()
	}
}

func (cb *SlowCallBreaker) slowRate(arr []time.Duration) float64 {
	slow := 0
	for _, d := range arr {
		if d >= cb.slow {
			slow++
		}
	}
	return float64(slow) / float64(len(arr))
}

func (cb *SlowCallBreaker) trip() {
	cb.state = "OPEN"
	cb.openUntil = time.Now().Add(cb.cooldown)
	cb.trials = nil
}

func (cb *SlowCallBreaker) close() {
	cb.state = "CLOSED"
	cb.durations = nil
	cb.trials = nil
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "SlowCallBreaker.java",
      code: `// Slow-call-rate breaker: trip when too many calls take longer than D ms.
// Same state machine as the error-rate breaker, just a different signal.
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.Callable;

class SlowCallBreaker {
    private String state = "CLOSED";              // "CLOSED" | "OPEN" | "HALF"
    private final Deque<Double> durations = new ArrayDeque<>();  // ms
    private final Deque<Double> trials = new ArrayDeque<>();
    private long openUntil = 0;

    private final int size;
    private final double slowMs;
    private final double rateThreshold;
    private final long cooldownMs;
    private final int trialCount;
    private final int minCalls;

    SlowCallBreaker(int size, double slowMs, double rateThreshold,
                    long cooldownMs, int trialCount, int minCalls) {
        this.size = size;
        this.slowMs = slowMs;
        this.rateThreshold = rateThreshold;
        this.cooldownMs = cooldownMs;
        this.trialCount = trialCount;
        this.minCalls = minCalls;
    }

    <T> T call(Callable<T> work) throws Exception {
        if (state.equals("OPEN") && System.currentTimeMillis() >= openUntil) {
            state = "HALF"; trials.clear();
        }
        if (state.equals("OPEN")) throw new IllegalStateException("circuit open");

        long start = System.nanoTime();
        try {
            return work.call();
        } finally {
            record((System.nanoTime() - start) / 1_000_000.0);  // record even on throw
        }
    }

    private void record(double durationMs) {
        if (state.equals("HALF")) {
            trials.addLast(durationMs);
            if (trials.size() >= trialCount) {
                if (slowRate(trials) >= rateThreshold) trip();
                else close();
            }
            return;
        }
        durations.addLast(durationMs);
        if (durations.size() > size) durations.removeFirst();
        if (durations.size() >= minCalls && slowRate(durations) >= rateThreshold) {
            trip();
        }
    }

    private double slowRate(Deque<Double> arr) {
        long slow = arr.stream().filter(d -> d >= slowMs).count();
        return (double) slow / arr.size();
    }

    private void trip() {
        state = "OPEN";
        openUntil = System.currentTimeMillis() + cooldownMs;
        trials.clear();
    }

    private void close() {
        state = "CLOSED";
        durations.clear();
        trials.clear();
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "slow_call_rate.py",
      code: `# Slow-call-rate breaker: trip when too many calls take longer than D ms.
# Same state machine as the error-rate breaker, just a different signal.
import time
from collections import deque
from typing import Callable, Deque, TypeVar

T = TypeVar("T")


class SlowCallBreaker:
    def __init__(
        self,
        size: int = 10,
        slow_ms: float = 500,
        rate_threshold: float = 0.5,
        cooldown_s: float = 5.0,
        trial_count: int = 3,
        min_calls: int = 5,
    ) -> None:
        self.state = "CLOSED"       # "CLOSED" | "OPEN" | "HALF"
        self.durations: Deque[float] = deque()  # ms
        self.trials: list[float] = []
        self.open_until = 0.0
        self.size = size
        self.slow_ms = slow_ms
        self.rate_threshold = rate_threshold
        self.cooldown_s = cooldown_s
        self.trial_count = trial_count
        self.min_calls = min_calls

    def call(self, work: Callable[[], T]) -> T:
        if self.state == "OPEN" and time.monotonic() >= self.open_until:
            self.state = "HALF"
            self.trials = []
        if self.state == "OPEN":
            raise RuntimeError("circuit open")

        start = time.monotonic()
        try:
            return work()
        finally:
            self._record((time.monotonic() - start) * 1000)  # record even on throw

    def _record(self, duration_ms: float) -> None:
        if self.state == "HALF":
            self.trials.append(duration_ms)
            if len(self.trials) >= self.trial_count:
                if self._slow_rate(self.trials) >= self.rate_threshold:
                    self._trip()
                else:
                    self._close()
            return
        self.durations.append(duration_ms)
        if len(self.durations) > self.size:
            self.durations.popleft()
        if len(self.durations) >= self.min_calls and self._slow_rate(self.durations) >= self.rate_threshold:
            self._trip()

    def _slow_rate(self, arr) -> float:
        slow = sum(1 for d in arr if d >= self.slow_ms)
        return slow / len(arr)

    def _trip(self) -> None:
        self.state = "OPEN"
        self.open_until = time.monotonic() + self.cooldown_s
        self.trials = []

    def _close(self) -> None:
        self.state = "CLOSED"
        self.durations.clear()
        self.trials = []`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "slow_call_rate.cpp",
      code: `// Slow-call-rate breaker: trip when too many calls take longer than D ms.
// Same state machine as the error-rate breaker, just a different signal.
#include <chrono>
#include <deque>
#include <functional>
#include <stdexcept>
#include <string>

class SlowCallBreaker {
    using Clock = std::chrono::steady_clock;

    std::string state_ = "CLOSED";  // "CLOSED" | "OPEN" | "HALF"
    std::deque<double> durations_;  // ms
    std::deque<double> trials_;
    Clock::time_point openUntil_;

    int size_;
    double slowMs_;
    double rateThreshold_;
    std::chrono::milliseconds cooldown_;
    int trialCount_;
    int minCalls_;

public:
    SlowCallBreaker(int size = 10, double slowMs = 500, double rateThreshold = 0.5,
                    int cooldownMs = 5000, int trialCount = 3, int minCalls = 5)
        : size_(size), slowMs_(slowMs), rateThreshold_(rateThreshold),
          cooldown_(cooldownMs), trialCount_(trialCount), minCalls_(minCalls) {}

    // work() returns true on success, throws or returns false on failure.
    bool call(const std::function<bool()>& work) {
        if (state_ == "OPEN" && Clock::now() >= openUntil_) {
            state_ = "HALF"; trials_.clear();
        }
        if (state_ == "OPEN") throw std::runtime_error("circuit open");

        auto start = Clock::now();
        try {
            bool result = work();
            record(std::chrono::duration<double, std::milli>(Clock::now() - start).count());
            return result;
        } catch (...) {
            record(std::chrono::duration<double, std::milli>(Clock::now() - start).count());
            throw;  // record even on throw
        }
    }

private:
    void record(double durationMs) {
        if (state_ == "HALF") {
            trials_.push_back(durationMs);
            if (static_cast<int>(trials_.size()) >= trialCount_) {
                if (slowRate(trials_) >= rateThreshold_) trip();
                else close();
            }
            return;
        }
        durations_.push_back(durationMs);
        if (static_cast<int>(durations_.size()) > size_) durations_.pop_front();
        if (static_cast<int>(durations_.size()) >= minCalls_ && slowRate(durations_) >= rateThreshold_) {
            trip();
        }
    }

    double slowRate(const std::deque<double>& arr) {
        int slow = 0;
        for (double d : arr) if (d >= slowMs_) slow++;
        return static_cast<double>(slow) / arr.size();
    }

    void trip() {
        state_ = "OPEN";
        openUntil_ = Clock::now() + cooldown_;
        trials_.clear();
    }

    void close() {
        state_ = "CLOSED";
        durations_.clear();
        trials_.clear();
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Resilience4j — Slow call configuration",
      href: "https://resilience4j.readme.io/docs/circuitbreaker#configuration",
      note: "The slowCallRateThreshold and slowCallDurationThreshold options. Worth reading alongside the failureRateThreshold — they share a window and can both trip.",
      kind: "docs",
    },
    {
      label: "Marc Brooker — Timeouts, retries, and backoff with jitter",
      href: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
      note: "AWS Builders' Library piece explaining why slow responses (not errors) cause most cascading failures. The clearest justification for adding a slow-call rule alongside the error rule.",
      kind: "article",
    },
    {
      label: "Hystrix — Why Hystrix?",
      href: "https://github.com/Netflix/Hystrix/wiki",
      note: "The original problem statement — Netflix's services were being taken down by *slow* dependencies, not crashed ones. Reading the motivation makes this variant click.",
      kind: "docs",
    },
    {
      label: "Envoy — outlier detection (slow responses)",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/outlier",
      note: "Envoy ejects hosts based on consecutive 5xx and consecutive gateway failures including timeouts — the proxy-layer equivalent of a slow-call-rate rule.",
      kind: "docs",
    },
    {
      label: "Google SRE — Handling Overload (Ch. 21)",
      href: "https://sre.google/sre-book/handling-overload/",
      note: "The chapter on adaptive throttling and overload. Explains why latency is the signal you actually want to react to — much of which translates directly to breaker design.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "cb-slow-q1",
      question: "Why isn't an error-rate breaker enough on its own?",
      options: [
        { id: "a", label: "Errors are too rare to be useful." },
        { id: "b", label: "A downstream can return 200 OK very slowly and still take you down." },
        { id: "c", label: "Error rates always need a minimum-call gate to be reliable." },
        { id: "d", label: "Most downstreams don't return errors anymore." },
      ],
      correctOptionId: "b",
      explanation:
        "Most cascading failures aren't caused by errors — they're caused by slow successes that pin threads, connections, and queues. An error-rate-only breaker sits at 0% while your service runs out of capacity.",
    },
    {
      id: "cb-slow-q2",
      question: "What's the most important knob in this variant?",
      options: [
        { id: "a", label: "The window size." },
        { id: "b", label: "The slow-duration threshold (D)." },
        { id: "c", label: "The cooldown duration." },
        { id: "d", label: "The half-open trial count." },
      ],
      correctOptionId: "b",
      explanation:
        "D defines what counts as slow. Get it wrong and the rate threshold becomes meaningless — too low and you trip on normal noise, too high and you miss real degradations. Derive D from your SLO, not from a round number.",
    },
    {
      id: "cb-slow-q3",
      question: "Why does this rule pair with — not replace — a per-call timeout?",
      options: [
        { id: "a", label: "Timeouts are a different state machine." },
        { id: "b", label: "Without a timeout, a hanging call never returns, so the breaker never measures it as slow." },
        { id: "c", label: "Timeouts only work for HTTP, breakers work for any protocol." },
        { id: "d", label: "Both implement the same algorithm — pick whichever is easier." },
      ],
      correctOptionId: "b",
      explanation:
        "The breaker only sees a call's duration after the call returns. If the call hangs forever, it never enters the window. Per-call timeouts give every call a bounded duration, which the breaker can then aggregate.",
    },
  ],
};
