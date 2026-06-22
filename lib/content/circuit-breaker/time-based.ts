import type { ConceptContent } from "@/lib/content/types";

export const timeBased: ConceptContent = {
  prototypeCaption:
    "A **time-based window** — failures aren't counted by call number, but by clock. Each second has a bar; the current second is on the right. Spike the failure rate to trip it, then turn the failures off and *stop clicking* — the red bars march left and fall off the edge, and the breaker recovers on its own without any new calls.",

  overview: [
    {
      type: "p",
      text: "Time-Based is Count-Based's twin, with one critical change: the window is sized in **seconds**, not call count. Every call is stamped with its arrival time. The breaker only looks at calls newer than `now - windowSeconds`. Old calls don't have to wait for new ones to push them out — they age out by themselves.",
    },
    {
      type: "p",
      text: "Implementation is almost always bucketed: instead of storing every call's timestamp, the breaker maintains an array of one-second counters (or a similar fine grain) and rotates them. Hystrix did this with ten 1-second buckets; Resilience4j's TIME_BASED window does the same. The bucketing keeps the bookkeeping O(1) per call regardless of traffic volume.",
    },
    {
      type: "p",
      text: "The payoff is **self-recovery during quiet periods**. If your service was failing badly but stops getting traffic for a few seconds, those failed calls quietly drop out of the window and the breaker un-trips itself — no probing needed. The price is slightly more bookkeeping per call.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The trip rule" },
    {
      type: "ol",
      items: [
        "Maintain a window of the last **W seconds** of call results — typically as W one-second buckets, each holding (ok count, fail count).",
        "On every call, increment the bucket for `floor(now / 1s)` and let older buckets age out as time advances.",
        "Compute the **failure rate** across all buckets currently inside the window.",
        "If the rate is at or above the threshold and there are enough samples, **trip**.",
        "OPEN and HALF-OPEN behave exactly like Count-Based: cooldown, then a small number of trial calls decide.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Why bucketed and not exact timestamps?",
      text: "Storing every timestamp is O(traffic) memory. Bucketing trades a tiny precision loss for fixed memory: with W=10 seconds at 1-second granularity, you keep exactly 10 counter pairs no matter whether you handle 1 or 100 000 requests per second. The granularity sets your worst-case error: a 1s bucket can be off by ±1 second around the trip moment, which almost never matters.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Bursty traffic — fixed",
      text: "Imagine a service that handles 100 requests in one second, then nothing for a minute, then another 100. A Count-Based window of 20 calls would still be 'looking at' that first burst a minute later — its view of 'now' is stale. Time-Based with a 10-second window would have aged the burst out completely. That is the bug this variant exists to fix.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to prefer Time-Based" },
    {
      type: "ul",
      items: [
        "**Bursty or sparse traffic** — cron jobs, batch syncs, low-RPS endpoints. Counting calls leaves stale data; counting seconds is honest about how old the evidence is.",
        "**You want quiet-period self-recovery** — if requests stop entirely, the breaker should un-trip itself without you scripting probes.",
        "**Mixed traffic patterns** — your service handles big bursts and quiet patches in the same hour. A time-windowed view is the same shape whether you got 5 or 5 000 calls in the last second.",
        "**Capacity planning matters** — 'last 10 seconds' is a duration you can put on a dashboard alongside latency. 'Last 100 calls' isn't.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Watch the bucket granularity",
      text: "With 1-second buckets, the window is technically anywhere from W-1 to W seconds wide depending on where you are in the current second. That's normally fine. If you need sub-second precision (latency-sensitive edge proxies), drop to 100ms buckets — at the cost of 10× the memory.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Self-recovers in quiet periods** — failed calls age out by wall-clock, no probes required.",
      "**Honest under bursty traffic** — a sudden burst doesn't anchor the window forever.",
      "**Operationally legible** — 'we trip if 50% of the last 10 seconds were failures' is a dashboard sentence.",
      "**Still O(1) per call** — bucketing keeps memory and CPU fixed regardless of throughput.",
    ],
    cons: [
      "**Slightly more bookkeeping** than Count-Based — you have to manage buckets and time advancement.",
      "**Bucket granularity is a tuning knob** — too coarse and you lose precision; too fine and you spend more memory.",
      "**Clock skew can lie to you** — if the OS clock jumps (NTP correction, VM pause), buckets can be wrong for a moment. Most libraries use a monotonic clock to dodge this.",
      "**Still vulnerable at very low volumes** — pair with a minimum-call gate (the Error-Percentage variant) if traffic is tiny.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the bars age out",
      body: "Click **failing call** five times in quick succession — all five go into the rightmost (current-second) bar. Now don't click anything for ten seconds. Watch the red bars march left as new (empty) seconds slide in, and finally fall off the left edge. The failure rate drifts back to 0 without you touching the controls.",
    },
    {
      title: "02 · Spike, trip, and self-recover",
      body: "Tick **Auto traffic** and drag **Downstream failures** to 80%. The breaker trips. Now drag failures to 0 and untick auto traffic. Don't click anything. Within a few seconds the red bars age out, the rate falls below the threshold — but the breaker doesn't auto-close in OPEN. It waits for its cooldown, opens to HALF-OPEN, and the next clicks decide.",
    },
    {
      title: "03 · Compare to Count-Based",
      body: "Open the Count-Based prototype in another tab. In both, click **failing call** five times and stop. In Count-Based, those 5 fails will still be in the window for the next 5 calls you make — possibly minutes later. In Time-Based, they're gone in 10 seconds whether or not you make more calls. That is the entire difference between the two algorithms.",
    },
    {
      title: "04 · Widen the window",
      body: "Set **Window length** to 16s. The breaker now needs sustained failure across 16 seconds to trip — a 1-second blip won't do it. Drop the window to 4s and the breaker becomes twitchy: a single bad second can dominate. The window length is your noise filter.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "time_based.go",
      code: `// Time-based circuit breaker: trip on the failure rate over the last W seconds.
// Implemented with one bucket per second — bucketing keeps everything O(1).
package breaker

import (
	"errors"
	"time"
)

var ErrOpen = errors.New("circuit open")

type bucket struct {
	ok, fail int
	sec      int64
}

type TimeBasedBreaker struct {
	state     string // "CLOSED" | "OPEN" | "HALF"
	buckets   []bucket
	trials    []bool
	openUntil time.Time

	windowSec  int64
	threshold  float64
	cooldown   time.Duration
	trialCount int
	minCalls   int
}

func NewTimeBasedBreaker() *TimeBasedBreaker {
	return &TimeBasedBreaker{
		state:      "CLOSED",
		windowSec:  10,
		threshold:  0.5,
		cooldown:   5000 * time.Millisecond,
		trialCount: 3,
		minCalls:   5,
	}
}

func (cb *TimeBasedBreaker) Call(work func() error) error {
	if cb.state == "OPEN" && !time.Now().Before(cb.openUntil) {
		cb.state = "HALF"
		cb.trials = nil
	}
	if cb.state == "OPEN" {
		return ErrOpen
	}
	if err := work(); err != nil {
		cb.record(false)
		return err
	}
	cb.record(true)
	return nil
}

func (cb *TimeBasedBreaker) record(ok bool) {
	if cb.state == "HALF" {
		cb.trials = append(cb.trials, ok)
		if len(cb.trials) >= cb.trialCount {
			fails := 0
			for _, t := range cb.trials {
				if !t {
					fails++
				}
			}
			if float64(fails)/float64(len(cb.trials)) >= cb.threshold {
				cb.trip()
			} else {
				cb.close()
			}
		}
		return
	}
	sec := time.Now().Unix()
	if len(cb.buckets) == 0 || cb.buckets[len(cb.buckets)-1].sec != sec {
		cb.buckets = append(cb.buckets, bucket{sec: sec})
	}
	b := &cb.buckets[len(cb.buckets)-1]
	if ok {
		b.ok++
	} else {
		b.fail++
	}
	cb.prune(sec)
	cb.maybeTrip()
}

func (cb *TimeBasedBreaker) prune(now int64) {
	lo := now - cb.windowSec + 1
	for len(cb.buckets) > 0 && cb.buckets[0].sec < lo {
		cb.buckets = cb.buckets[1:]
	}
}

func (cb *TimeBasedBreaker) maybeTrip() {
	ok, fail := 0, 0
	for _, b := range cb.buckets {
		ok += b.ok
		fail += b.fail
	}
	total := ok + fail
	if total >= cb.minCalls && float64(fail)/float64(total) >= cb.threshold {
		cb.trip()
	}
}

func (cb *TimeBasedBreaker) trip() {
	cb.state = "OPEN"
	cb.openUntil = time.Now().Add(cb.cooldown)
	cb.trials = nil
}

func (cb *TimeBasedBreaker) close() {
	cb.state = "CLOSED"
	cb.buckets = nil
	cb.trials = nil
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "TimeBasedBreaker.java",
      code: `// Time-based circuit breaker: trip on the failure rate over the last W seconds.
// Implemented with one bucket per second — bucketing keeps everything O(1).
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.Callable;

class TimeBasedBreaker {
    private static final class Bucket {
        int ok, fail;
        final long sec;
        Bucket(long sec) { this.sec = sec; }
    }

    private String state = "CLOSED";              // "CLOSED" | "OPEN" | "HALF"
    private final Deque<Bucket> buckets = new ArrayDeque<>();
    private final Deque<Boolean> trials = new ArrayDeque<>();
    private long openUntil = 0;

    private final long windowSec;
    private final double threshold;
    private final long cooldownMs;
    private final int trialCount;
    private final int minCalls;

    TimeBasedBreaker(long windowSec, double threshold, long cooldownMs, int trialCount, int minCalls) {
        this.windowSec = windowSec;
        this.threshold = threshold;
        this.cooldownMs = cooldownMs;
        this.trialCount = trialCount;
        this.minCalls = minCalls;
    }

    <T> T call(Callable<T> work) throws Exception {
        if (state.equals("OPEN") && System.currentTimeMillis() >= openUntil) {
            state = "HALF"; trials.clear();
        }
        if (state.equals("OPEN")) throw new IllegalStateException("circuit open");

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
                long fails = trials.stream().filter(x -> !x).count();
                if ((double) fails / trials.size() >= threshold) trip();
                else close();
            }
            return;
        }
        long sec = System.currentTimeMillis() / 1000;
        Bucket b = buckets.peekLast();
        if (b == null || b.sec != sec) {
            b = new Bucket(sec);
            buckets.addLast(b);
        }
        if (ok) b.ok++; else b.fail++;
        prune(sec);
        maybeTrip();
    }

    private void prune(long now) {
        long lo = now - windowSec + 1;
        while (!buckets.isEmpty() && buckets.peekFirst().sec < lo) buckets.removeFirst();
    }

    private void maybeTrip() {
        int ok = 0, fail = 0;
        for (Bucket b : buckets) { ok += b.ok; fail += b.fail; }
        int total = ok + fail;
        if (total >= minCalls && (double) fail / total >= threshold) trip();
    }

    private void trip() {
        state = "OPEN";
        openUntil = System.currentTimeMillis() + cooldownMs;
        trials.clear();
    }

    private void close() {
        state = "CLOSED";
        buckets.clear();
        trials.clear();
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "time_based.py",
      code: `# Time-based circuit breaker: trip on the failure rate over the last W seconds.
# Implemented with one bucket per second — bucketing keeps everything O(1).
import time
from collections import deque
from dataclasses import dataclass
from typing import Callable, Deque, TypeVar

T = TypeVar("T")


@dataclass
class Bucket:
    sec: int
    ok: int = 0
    fail: int = 0


class TimeBasedBreaker:
    def __init__(
        self,
        window_sec: int = 10,
        threshold: float = 0.5,
        cooldown_s: float = 5.0,
        trial_count: int = 3,
        min_calls: int = 5,
    ) -> None:
        self.state = "CLOSED"       # "CLOSED" | "OPEN" | "HALF"
        self.buckets: Deque[Bucket] = deque()
        self.trials: list[bool] = []
        self.open_until = 0.0
        self.window_sec = window_sec
        self.threshold = threshold
        self.cooldown_s = cooldown_s
        self.trial_count = trial_count
        self.min_calls = min_calls

    def call(self, work: Callable[[], T]) -> T:
        if self.state == "OPEN" and time.monotonic() >= self.open_until:
            self.state = "HALF"
            self.trials = []
        if self.state == "OPEN":
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
                fails = sum(1 for t in self.trials if not t)
                if fails / len(self.trials) >= self.threshold:
                    self._trip()
                else:
                    self._close()
            return
        sec = int(time.monotonic())
        if not self.buckets or self.buckets[-1].sec != sec:
            self.buckets.append(Bucket(sec=sec))
        b = self.buckets[-1]
        if ok:
            b.ok += 1
        else:
            b.fail += 1
        self._prune(sec)
        self._maybe_trip()

    def _prune(self, now: int) -> None:
        lo = now - self.window_sec + 1
        while self.buckets and self.buckets[0].sec < lo:
            self.buckets.popleft()

    def _maybe_trip(self) -> None:
        ok = sum(b.ok for b in self.buckets)
        fail = sum(b.fail for b in self.buckets)
        total = ok + fail
        if total >= self.min_calls and fail / total >= self.threshold:
            self._trip()

    def _trip(self) -> None:
        self.state = "OPEN"
        self.open_until = time.monotonic() + self.cooldown_s
        self.trials = []

    def _close(self) -> None:
        self.state = "CLOSED"
        self.buckets.clear()
        self.trials = []`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "time_based.cpp",
      code: `// Time-based circuit breaker: trip on the failure rate over the last W seconds.
// Implemented with one bucket per second — bucketing keeps everything O(1).
#include <chrono>
#include <deque>
#include <functional>
#include <stdexcept>
#include <string>

class TimeBasedBreaker {
    struct Bucket {
        long sec;
        int ok = 0;
        int fail = 0;
    };

    std::string state_ = "CLOSED";  // "CLOSED" | "OPEN" | "HALF"
    std::deque<Bucket> buckets_;
    std::deque<bool> trials_;
    std::chrono::steady_clock::time_point openUntil_;

    long windowSec_;
    double threshold_;
    std::chrono::milliseconds cooldown_;
    int trialCount_;
    int minCalls_;

    static long nowSec() {
        return std::chrono::duration_cast<std::chrono::seconds>(
                   std::chrono::steady_clock::now().time_since_epoch())
            .count();
    }

public:
    TimeBasedBreaker(long windowSec = 10, double threshold = 0.5, int cooldownMs = 5000,
                     int trialCount = 3, int minCalls = 5)
        : windowSec_(windowSec), threshold_(threshold), cooldown_(cooldownMs),
          trialCount_(trialCount), minCalls_(minCalls) {}

    // work() returns true on success, throws or returns false on failure.
    void call(const std::function<bool()>& work) {
        if (state_ == "OPEN" && std::chrono::steady_clock::now() >= openUntil_) {
            state_ = "HALF"; trials_.clear();
        }
        if (state_ == "OPEN") throw std::runtime_error("circuit open");

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
                int fails = 0;
                for (bool t : trials_) if (!t) fails++;
                if (static_cast<double>(fails) / trials_.size() >= threshold_) trip();
                else close();
            }
            return;
        }
        long sec = nowSec();
        if (buckets_.empty() || buckets_.back().sec != sec) {
            buckets_.push_back(Bucket{sec});
        }
        Bucket& b = buckets_.back();
        if (ok) b.ok++; else b.fail++;
        prune(sec);
        maybeTrip();
    }

    void prune(long now) {
        long lo = now - windowSec_ + 1;
        while (!buckets_.empty() && buckets_.front().sec < lo) buckets_.pop_front();
    }

    void maybeTrip() {
        int ok = 0, fail = 0;
        for (const auto& b : buckets_) { ok += b.ok; fail += b.fail; }
        int total = ok + fail;
        if (total >= minCalls_ && static_cast<double>(fail) / total >= threshold_) trip();
    }

    void trip() {
        state_ = "OPEN";
        openUntil_ = std::chrono::steady_clock::now() + cooldown_;
        trials_.clear();
    }

    void close() {
        state_ = "CLOSED";
        buckets_.clear();
        trials_.clear();
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Resilience4j — TIME_BASED sliding window",
      href: "https://resilience4j.readme.io/docs/circuitbreaker#sliding-window",
      note: "The reference implementation. The TIME_BASED type is exactly this — bucketed per-second with the same trip rule and half-open phase.",
      kind: "docs",
    },
    {
      label: "Hystrix — Metrics and Health Counts",
      href: "https://github.com/Netflix/Hystrix/wiki/Metrics-and-Monitoring",
      note: "Netflix's original. Walks through the 10-bucket × 1-second rolling-window structure that almost every modern library inherited.",
      kind: "docs",
    },
    {
      label: "Adrian Cockcroft — Lessons from Netflix",
      href: "https://www.youtube.com/watch?v=lY7hX_jPNAQ",
      note: "Why Netflix needed time-based windows for their bursty cross-region traffic. The same talk that popularised the circuit-breaker-as-default-pattern idea.",
      kind: "video",
    },
    {
      label: "Envoy — outlier detection",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/outlier",
      note: "Envoy's per-host ejection uses a time-windowed view of consecutive 5xx and gateway failures — the same time-based-windowing idea at the proxy layer.",
      kind: "docs",
    },
    {
      label: "Sam Newman — Building Microservices, Ch. 12",
      href: "https://samnewman.io/books/building_microservices_2nd_edition/",
      note: "The chapter on resilience covers why time-windowing matters in service meshes and how it composes with retries and timeouts.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "cb-time-q1",
      question: "What's the key difference between Time-Based and Count-Based?",
      options: [
        { id: "a", label: "Time-Based uses a different state machine." },
        { id: "b", label: "Time-Based ages calls out by wall-clock; Count-Based ages them out by arrival order." },
        { id: "c", label: "Time-Based requires latency measurement; Count-Based doesn't." },
        { id: "d", label: "Time-Based always uses more memory." },
      ],
      correctOptionId: "b",
      explanation:
        "Same three-state machine, same trip rule (failure rate vs threshold), same Half-Open trial logic. The only difference is what makes a call leave the window — seconds elapsed vs new calls arrived.",
    },
    {
      id: "cb-time-q2",
      question: "Why are most implementations bucketed instead of storing per-call timestamps?",
      options: [
        { id: "a", label: "Buckets are easier to draw on a chart." },
        { id: "b", label: "Buckets give O(1) memory regardless of traffic — exact timestamps grow with throughput." },
        { id: "c", label: "Buckets are more accurate than timestamps." },
        { id: "d", label: "Buckets are required by the HTTP spec." },
      ],
      correctOptionId: "b",
      explanation:
        "A per-call timestamp list grows with traffic — bad for a high-RPS service. A fixed array of W buckets stays the same size whether you handle 1 or 100 000 calls per second, in exchange for slightly fuzzier window edges.",
    },
    {
      id: "cb-time-q3",
      question: "Which workload makes Time-Based clearly better than Count-Based?",
      options: [
        { id: "a", label: "Steady traffic at 100 requests/second." },
        { id: "b", label: "Periodic batches: a burst of 200 requests every five minutes." },
        { id: "c", label: "Latency-bound traffic where every call takes ~1 second." },
        { id: "d", label: "Single-threaded clients with strict ordering." },
      ],
      correctOptionId: "b",
      explanation:
        "Periodic bursts starve a count-based window of fresh data between bursts. The breaker keeps 'remembering' the previous burst until enough new calls arrive to push them out. Time-based naturally forgets old bursts when their seconds expire.",
    },
  ],
};
