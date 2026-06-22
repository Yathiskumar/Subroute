import type { ConceptContent } from "@/lib/content/types";

export const countBased: ConceptContent = {
  prototypeCaption:
    "A **sliding window of the last N calls**. Click **healthy call** or **failing call** to fill it; the bar tracks the failure rate, the dotted line marks the threshold. Cross it and the breaker trips to **OPEN** — every later call is rejected instantly until the cooldown elapses and **Half-Open** trial calls decide whether to close again. Flip on **Auto traffic** to watch a steady stream of requests do it on their own.",

  overview: [
    {
      type: "p",
      text: "Count-Based is the simplest trip rule there is. Keep the results of the **last N calls** in a fixed-size buffer. Every time you add a new result, drop the oldest. Compute the failure rate over that buffer. If it crosses your threshold (say, 50%), trip the breaker.",
    },
    {
      type: "p",
      text: "That is the whole algorithm. No timestamps, no decay function, no latency tracking. Just a ring of booleans and a percentage. It is what most libraries (Resilience4j, Polly, Hystrix in 'count' mode) default to, and it is what you should start with unless you have a reason not to.",
    },
    {
      type: "p",
      text: "The fixed-size window is also its blind spot. If traffic is bursty — five calls in a minute, then nothing — the breaker may stay in whatever state it was the last time someone called it, ignoring fresh evidence simply because no new calls arrived. The **Time-Based** variant fixes that.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The trip rule, step by step" },
    {
      type: "ol",
      items: [
        "Maintain a **ring buffer** of the last N call results (true = ok, false = fail). On every new call, push to the back and drop from the front if full.",
        "Compute the **failure rate**: count of fails ÷ count of entries. (Most implementations also require a minimum number of samples — typically half the window — before they will trip, so a single failure in a near-empty window doesn't immediately open you.)",
        "If the rate is at or above the **threshold** and you have enough samples, **trip → OPEN**.",
        "While OPEN, every call is **rejected immediately** for the configured cooldown.",
        "After the cooldown, **OPEN → HALF-OPEN**: a small number of trial calls are allowed. If the failure rate over the trials clears the threshold (e.g. all succeed), close. Otherwise, OPEN again.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why a window — not a streak?",
      text: "A counting variant ('5 fails in a row') is intuitive but brittle: a single intervening success resets the streak, even if you're really failing 80% of the time. A windowed rate captures the truth more honestly. Real failures don't ask permission to alternate with successes.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The bursty-traffic blind spot",
      text: "Suppose your window is 20 and traffic is sparse — one call every few minutes. The breaker only learns when a call happens. A downstream that comes back to life between calls is invisible: the breaker still thinks the last 20 calls are 80% failed (because that's what they were ten minutes ago) and trips on the next request. If your traffic is bursty, prefer **Time-Based**, which ages calls out by clock time.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for Count-Based" },
    {
      type: "ul",
      items: [
        "**Steady, predictable traffic** — a service handling dozens or hundreds of calls per second. The window always reflects roughly the last second or two of behaviour.",
        "**You want the simplest possible breaker** — fewer knobs to tune, easier to reason about, easier to debug. Count-Based is the 'no surprises' default.",
        "**Memory is a real constraint** — N booleans is the smallest serious breaker you can build. No timestamps, no counters per second.",
        "**You're prototyping** — ship Count-Based first, then upgrade to Time-Based or Error-Percentage once you see the actual traffic shape.",
        "**Avoid** when traffic is *bursty* or *very low volume* — both starve the window of fresh data. Use Time-Based or Error-Percentage instead.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Library defaults",
      text: "Resilience4j's default sliding-window type is COUNT_BASED with N=100 and a 50% failure-rate threshold. Polly's basic circuit-breaker counts consecutive failures (a degenerate count-based with the simplest possible rule). Hystrix used a bucketed count window internally even when its public API talked about time.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Tiny memory** — N bits (or N booleans) and a pointer.",
      "**O(1) per call** — push to the ring, compute rate over a fixed-size array, done.",
      "**Predictable** — no clocks, no decay, no surprise from time-of-day effects.",
      "**Easy to explain** — 'we trip if the last 20 calls were ≥ 50% failures' is a sentence a non-engineer can understand.",
    ],
    cons: [
      "**Insensitive to traffic shape** — bursty or low-volume traffic can leave stale data in the window.",
      "**No self-recovery in quiet periods** — without new calls, the rate stays whatever it was last measured.",
      "**Threshold tuning is workload-specific** — what counts as 'too many' depends on your normal error rate, which N alone doesn't capture.",
      "**Can trip on a tiny sample** unless you enforce a minimum-call count — one fail of two calls is 50%.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the window fill and trip",
      body: "Press **healthy call** four times, then **failing call** five times. Watch the bar climb from green to red and cross the threshold line — the breaker badge flips to **open**. Note the rejected count starts ticking only *after* it tripped.",
    },
    {
      title: "02 · The cooldown and recovery",
      body: "After tripping, wait for the cooldown — the badge flips to **half-open**. Click **healthy call** the configured number of trial times (default 3). All trials pass → **closed**, window reset. Now make those trials fail and watch it slam back to **open**.",
    },
    {
      title: "03 · Auto traffic with a sick downstream",
      body: "Tick **Auto traffic** and drag **Downstream failures** above the threshold. Watch it trip on its own. Now drag failures back to 0 and let the trial calls in Half-Open close it. This is what production traffic looks like through the breaker's eyes.",
    },
    {
      title: "04 · Push the knobs",
      body: "Widen the **Window size** to 16 — it takes longer to trip but the rate is more accurate. Shrink it to 4 — it's twitchy and trips on small bursts. Raise the **Failure threshold** to 80% — the breaker becomes much more tolerant. Each knob is a tradeoff between sensitivity and stability.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "count_based.go",
      code: `// Count-based circuit breaker: trip when the failure rate over the last N calls
// crosses the threshold. The simplest sliding window there is.
package breaker

import (
	"errors"
	"time"
)

var ErrOpen = errors.New("circuit open")

type CountBasedBreaker struct {
	state     string  // "CLOSED" | "OPEN" | "HALF"
	window    []bool  // true = ok, false = fail
	trials    []bool
	openUntil time.Time

	size       int
	threshold  float64 // 50%
	cooldown   time.Duration
	trialCount int
	minCalls   int // don't trip on tiny samples
}

func NewCountBasedBreaker() *CountBasedBreaker {
	return &CountBasedBreaker{
		state:      "CLOSED",
		size:       10,
		threshold:  0.5,
		cooldown:   5000 * time.Millisecond,
		trialCount: 3,
		minCalls:   5,
	}
}

func (cb *CountBasedBreaker) Call(work func() error) error {
	if cb.state == "OPEN" {
		if !time.Now().Before(cb.openUntil) {
			cb.state = "HALF"
			cb.trials = nil
		} else {
			return ErrOpen
		}
	}
	if err := work(); err != nil {
		cb.record(false)
		return err
	}
	cb.record(true)
	return nil
}

func (cb *CountBasedBreaker) record(ok bool) {
	if cb.state == "HALF" {
		cb.trials = append(cb.trials, ok)
		if len(cb.trials) >= cb.trialCount {
			if failRate(cb.trials) >= cb.threshold {
				cb.trip()
			} else {
				cb.close()
			}
		}
		return
	}
	cb.window = append(cb.window, ok)
	if len(cb.window) > cb.size {
		cb.window = cb.window[1:]
	}
	if len(cb.window) >= cb.minCalls && failRate(cb.window) >= cb.threshold {
		cb.trip()
	}
}

func failRate(window []bool) float64 {
	fails := 0
	for _, ok := range window {
		if !ok {
			fails++
		}
	}
	return float64(fails) / float64(len(window))
}

func (cb *CountBasedBreaker) trip() {
	cb.state = "OPEN"
	cb.openUntil = time.Now().Add(cb.cooldown)
	cb.trials = nil
}

func (cb *CountBasedBreaker) close() {
	cb.state = "CLOSED"
	cb.window = nil
	cb.trials = nil
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "CountBasedBreaker.java",
      code: `// Count-based circuit breaker: trip when the failure rate over the last N calls
// crosses the threshold. The simplest sliding window there is.
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.Callable;

class CountBasedBreaker {
    private String state = "CLOSED";              // "CLOSED" | "OPEN" | "HALF"
    private final Deque<Boolean> window = new ArrayDeque<>(); // true = ok, false = fail
    private final Deque<Boolean> trials = new ArrayDeque<>();
    private long openUntil = 0;

    private final int size;
    private final double threshold;               // 50%
    private final long cooldownMs;
    private final int trialCount;
    private final int minCalls;                   // don't trip on tiny samples

    CountBasedBreaker(int size, double threshold, long cooldownMs, int trialCount, int minCalls) {
        this.size = size;
        this.threshold = threshold;
        this.cooldownMs = cooldownMs;
        this.trialCount = trialCount;
        this.minCalls = minCalls;
    }

    <T> T call(Callable<T> work) throws Exception {
        if (state.equals("OPEN")) {
            if (System.currentTimeMillis() >= openUntil) { state = "HALF"; trials.clear(); }
            else throw new IllegalStateException("circuit open");
        }
        try {
            T result = work.call();
            record(true);
            return result;
        } catch (Exception err) {
            record(false);
            throw err;
        }
    }

    private void record(boolean ok) {
        if (state.equals("HALF")) {
            trials.addLast(ok);
            if (trials.size() >= trialCount) {
                if (failRate(trials) >= threshold) trip();
                else close();
            }
            return;
        }
        window.addLast(ok);
        if (window.size() > size) window.removeFirst();
        if (window.size() >= minCalls && failRate(window) >= threshold) trip();
    }

    private double failRate(Deque<Boolean> w) {
        long fails = w.stream().filter(x -> !x).count();
        return (double) fails / w.size();
    }

    private void trip() {
        state = "OPEN";
        openUntil = System.currentTimeMillis() + cooldownMs;
        trials.clear();
    }

    private void close() {
        state = "CLOSED";
        window.clear();
        trials.clear();
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "count_based.py",
      code: `# Count-based circuit breaker: trip when the failure rate over the last N calls
# crosses the threshold. The simplest sliding window there is.
import time
from collections import deque
from typing import Callable, Deque, TypeVar

T = TypeVar("T")


class CountBasedBreaker:
    def __init__(
        self,
        size: int = 10,
        threshold: float = 0.5,     # 50%
        cooldown_s: float = 5.0,
        trial_count: int = 3,
        min_calls: int = 5,         # don't trip on tiny samples
    ) -> None:
        self.state = "CLOSED"       # "CLOSED" | "OPEN" | "HALF"
        self.window: Deque[bool] = deque()  # True = ok, False = fail
        self.trials: list[bool] = []
        self.open_until = 0.0
        self.size = size
        self.threshold = threshold
        self.cooldown_s = cooldown_s
        self.trial_count = trial_count
        self.min_calls = min_calls

    def call(self, work: Callable[[], T]) -> T:
        if self.state == "OPEN":
            if time.monotonic() >= self.open_until:
                self.state = "HALF"
                self.trials = []
            else:
                raise RuntimeError("circuit open")
        try:
            result = work()
        except Exception:
            self._record(False)
            raise
        self._record(True)
        return result

    def _record(self, ok: bool) -> None:
        if self.state == "HALF":
            self.trials.append(ok)
            if len(self.trials) >= self.trial_count:
                if self._fail_rate(self.trials) >= self.threshold:
                    self._trip()
                else:
                    self._close()
            return
        self.window.append(ok)
        if len(self.window) > self.size:
            self.window.popleft()
        if len(self.window) >= self.min_calls and self._fail_rate(self.window) >= self.threshold:
            self._trip()

    @staticmethod
    def _fail_rate(window) -> float:
        fails = sum(1 for ok in window if not ok)
        return fails / len(window)

    def _trip(self) -> None:
        self.state = "OPEN"
        self.open_until = time.monotonic() + self.cooldown_s
        self.trials = []

    def _close(self) -> None:
        self.state = "CLOSED"
        self.window.clear()
        self.trials = []`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "count_based.cpp",
      code: `// Count-based circuit breaker: trip when the failure rate over the last N calls
// crosses the threshold. The simplest sliding window there is.
#include <chrono>
#include <deque>
#include <functional>
#include <stdexcept>

class CountBasedBreaker {
    std::string state_ = "CLOSED";  // "CLOSED" | "OPEN" | "HALF"
    std::deque<bool> window_;       // true = ok, false = fail
    std::deque<bool> trials_;
    std::chrono::steady_clock::time_point openUntil_;

    int size_;
    double threshold_;              // 50%
    std::chrono::milliseconds cooldown_;
    int trialCount_;
    int minCalls_;                  // don't trip on tiny samples

public:
    CountBasedBreaker(int size = 10, double threshold = 0.5, int cooldownMs = 5000,
                      int trialCount = 3, int minCalls = 5)
        : size_(size), threshold_(threshold), cooldown_(cooldownMs),
          trialCount_(trialCount), minCalls_(minCalls) {}

    // work() returns true on success, throws or returns false on failure.
    void call(const std::function<bool()>& work) {
        if (state_ == "OPEN") {
            if (std::chrono::steady_clock::now() >= openUntil_) { state_ = "HALF"; trials_.clear(); }
            else throw std::runtime_error("circuit open");
        }
        bool ok = false;
        try {
            ok = work();
        } catch (...) {
            record(false);
            throw;
        }
        record(ok);
    }

private:
    void record(bool ok) {
        if (state_ == "HALF") {
            trials_.push_back(ok);
            if (static_cast<int>(trials_.size()) >= trialCount_) {
                if (failRate(trials_) >= threshold_) trip();
                else close();
            }
            return;
        }
        window_.push_back(ok);
        if (static_cast<int>(window_.size()) > size_) window_.pop_front();
        if (static_cast<int>(window_.size()) >= minCalls_ && failRate(window_) >= threshold_) trip();
    }

    static double failRate(const std::deque<bool>& w) {
        int fails = 0;
        for (bool ok : w) if (!ok) fails++;
        return static_cast<double>(fails) / w.size();
    }

    void trip() {
        state_ = "OPEN";
        openUntil_ = std::chrono::steady_clock::now() + cooldown_;
        trials_.clear();
    }

    void close() {
        state_ = "CLOSED";
        window_.clear();
        trials_.clear();
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Resilience4j — CircuitBreaker sliding window",
      href: "https://resilience4j.readme.io/docs/circuitbreaker#sliding-window",
      note: "The canonical modern implementation. The COUNT_BASED type is exactly this concept; the docs explain how it composes with the half-open phase.",
      kind: "docs",
    },
    {
      label: "Microsoft .NET — Circuit Breaker pattern",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker",
      note: "Azure architecture-centre write-up with sequence diagrams for the trip and half-open transitions. Good complement to the algorithm above.",
      kind: "docs",
    },
    {
      label: "Polly — Advanced circuit-breaker (count-based)",
      href: "https://www.pollydocs.org/strategies/circuit-breaker",
      note: ".NET resilience library. The 'advanced' variant counts failures and successes in a sampling window — same idea, .NET vocabulary.",
      kind: "docs",
    },
    {
      label: "Hystrix — How it works",
      href: "https://github.com/Netflix/Hystrix/wiki/How-it-Works",
      note: "Netflix's original (archived) implementation. Worth reading for the bucketed-window optimisation that turns 'last 10 seconds' into ten 1-second counters — useful background for the next concept.",
      kind: "docs",
    },
    {
      label: "Martin Fowler — Circuit Breaker",
      href: "https://martinfowler.com/bliki/CircuitBreaker.html",
      note: "The short article with the canonical state-diagram drawing. Reads as a count-based rule by default.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "cb-count-q1",
      question: "What exactly is the 'window' in count-based?",
      options: [
        { id: "a", label: "The last N seconds of calls." },
        { id: "b", label: "The last N call results, regardless of when they happened." },
        { id: "c", label: "All calls since startup." },
        { id: "d", label: "All calls since the breaker last closed." },
      ],
      correctOptionId: "b",
      explanation:
        "Count-based windows are sized by call count, not time. A call ages out only when N newer calls have arrived to push it off the buffer. That's why bursty traffic is its blind spot.",
    },
    {
      id: "cb-count-q2",
      question: "Why do most implementations require a minimum number of calls before they will trip?",
      options: [
        { id: "a", label: "To save memory until the buffer fills up." },
        { id: "b", label: "To avoid tripping on a tiny, noisy sample (e.g. 1 fail of 2 calls = 50%)." },
        { id: "c", label: "Because the underlying TCP stack needs at least 5 calls to warm up." },
        { id: "d", label: "Because the half-open phase needs that many trials." },
      ],
      correctOptionId: "b",
      explanation:
        "A 50% failure rate sounds bad until you realise it came from 1 failure out of 2 calls — a sample size you can't trust. A minimum-call guard is the cheapest fix; the Error-Percentage variant is the more sophisticated version of the same idea.",
    },
    {
      id: "cb-count-q3",
      question: "If your service handles roughly 1 request per minute, why is count-based a poor choice?",
      options: [
        { id: "a", label: "It uses too much memory." },
        { id: "b", label: "It tracks latency, which dominates at low rates." },
        { id: "c", label: "The window only learns when a call happens, so stale data sits in it for very long periods." },
        { id: "d", label: "Half-open trials can't run at low rates." },
      ],
      correctOptionId: "c",
      explanation:
        "At one call per minute, a 20-call window covers 20 minutes. The breaker's view of 'now' is 20 minutes stale. Time-based windows fix this by ageing calls out by wall-clock time instead of by arrival count.",
    },
  ],
};
