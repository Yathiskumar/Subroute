import type { ConceptContent } from "@/lib/content/types";

export const errorPercentage: ConceptContent = {
  prototypeCaption:
    "**Two gates have to be open for the breaker to trip.** First, the request volume must clear a minimum — too few samples are too noisy to act on. Only *then* does the error percentage matter. Try cranking errors to 100% while keeping traffic at 1 req/sec — the breaker stays closed. Then raise traffic and watch both bars cross, and the verdict flip to <em>would trip</em>.",

  overview: [
    {
      type: "p",
      text: "Error Percentage is the rule Netflix Hystrix made famous, and the one every modern resilience library copied. It addresses the most common embarrassment of a naive breaker: tripping when 1 of 2 calls failed because that's technically '50%'. With a million requests, 50% errors mean catastrophe. With two requests, 50% means one customer's pizza was cold.",
    },
    {
      type: "p",
      text: "The fix is a **second gate**. The breaker tracks call results over a time window (typically seconds, occasionally a count window) and adds a **minimum request count** below which the error rate is *ignored*. Only when there are enough samples to trust the number does the breaker check whether the error rate has crossed the percentage threshold. Both conditions must be true to trip; either one alone is not enough.",
    },
    {
      type: "p",
      text: "Half-Open also tends to be simpler in this variant: instead of N trials, many implementations let through exactly one trial request. Pass → close. Fail → re-open. That's it.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Two conditions, both required" },
    {
      type: "ol",
      items: [
        "**Maintain a rolling window** of recent call results (Hystrix used a 10s × 1s bucketed window).",
        "**Gate 1 — Volume**: count requests in the window. If fewer than the minimum (e.g. 20 in 10 seconds), do nothing. The error rate is statistically meaningless on a small sample.",
        "**Gate 2 — Error %**: compute fails ÷ total. If this is below the threshold (e.g. 50%), do nothing.",
        "**Both gates met → trip**. OPEN, cooldown for the wait period.",
        "**Cooldown done → HALF-OPEN**. Allow exactly one trial. Pass → CLOSED, window reset. Fail → OPEN, cooldown restarts.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why the volume gate is the most important knob",
      text: "Almost every breaker incident at scale traces back to a missing or too-low volume gate. A 100% error rate over 1 sample looks identical to a 100% error rate over 10 000 samples to the rate-threshold rule. The volume gate is the only thing standing between you and tripping every single low-traffic endpoint as soon as anyone touches it.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Default values worth knowing",
      text: "Hystrix's historical defaults: 20 requests / 10 second window, 50% error rate threshold. Resilience4j defaults to minimumNumberOfCalls=100 over a 100-call sliding window with a 50% failure-rate threshold. Both are conservative — pick yours based on your actual baseline traffic, not the defaults.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When this is the right default" },
    {
      type: "ul",
      items: [
        "**Almost any production HTTP service** — if you don't have a strong reason to pick something else, start here. The volume gate alone makes this the safest default.",
        "**Low-volume endpoints** — admin pages, less-used APIs. Without the volume gate, these trip from a stiff breeze.",
        "**Multi-tenant services** where a single tenant's traffic might be tiny but the aggregate is large — set the minimum to the aggregate, not the per-tenant.",
        "**When you're inheriting code** — most existing breakers in mature codebases are this variant in disguise. Recognise the pattern when you see `minimumNumberOfCalls` or `requestVolumeThreshold`.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "The volume gate isn't free",
      text: "While the volume is below the gate, the breaker is *blind*. A genuinely broken downstream can fail every call and the breaker won't trip until enough requests accumulate. For services where even small outages must trip immediately, lower the gate — and live with the false trips.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Filters out tiny-sample noise** — the single biggest source of false trips, gone.",
      "**Battle-tested defaults** — Hystrix's 20-req / 10s / 50% has shipped in production for over a decade.",
      "**Composes with both Count- and Time-Based windows** — most libraries let you pick either and add the volume gate on top.",
      "**The simplest HALF-OPEN logic** — one trial call, two outcomes. Easier to reason about than N-trial averaging.",
    ],
    cons: [
      "**Slow to react on low-volume endpoints** — the volume gate is also a delay before tripping. A genuinely broken service can serve 19 errors before anyone hears the breaker click.",
      "**One trial is a lot of responsibility** — a single unlucky failure during half-open re-opens you. Some libraries make this configurable (Resilience4j) for exactly this reason.",
      "**More knobs** — window, volume, error %, wait — four numbers to tune instead of two. Wrong combinations are easy.",
      "**Doesn't catch latency degradations** — error % is blind to slow successes. Pair with a slow-call-rate rule for downstreams that hang.",
    ],
  },

  handsOn: [
    {
      title: "01 · The volume gate in action",
      body: "Set **Downstream errors** to 100% and **Traffic rate** to 1/s. Tick **Auto traffic** and wait. The error bar is full red, but the verdict stays at <em>stays closed (too few requests)</em> — the volume gate is blocking the trip. Now raise traffic to 8/s and watch both gates light up green and red, and the verdict flip to <em>tripped open</em>.",
    },
    {
      title: "02 · The half-open coin flip",
      body: "Once tripped, watch for the wait to elapse — the badge goes amber (half-open). Click **healthy call** — one trial request, the breaker closes immediately. Trip it again; this time click **failing call** in half-open — it re-opens immediately. Compare with Count-Based, which averages N trials.",
    },
    {
      title: "03 · Tune the gate for your traffic",
      body: "Drop **Min requests** to 3 with errors at 100% and traffic at 1/s. Now the breaker trips in three seconds. Set min back to 30 — even at 100% errors and 8/s traffic, you wait several seconds. Lower min = faster trips + more false alarms. Higher min = safer + slower to react.",
    },
    {
      title: "04 · Errors under threshold",
      body: "Keep traffic high (gate met). Slide **Downstream errors** to 30%. The volume gate stays met, but the error gate doesn't — verdict reads <em>stays closed (errors under threshold)</em>. Both must be true to trip. Either alone is not enough.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "error_percentage.go",
      code: `// Hystrix-style breaker: trip only when (a) request volume crosses a minimum
// AND (b) error rate crosses the threshold. The volume gate is the whole point.
package breaker

import (
	"errors"
	"time"
)

var ErrOpen = errors.New("circuit open")

type callResult struct {
	t  time.Time
	ok bool
}

type ErrorPercentageBreaker struct {
	state     string // "CLOSED" | "OPEN" | "HALF"
	calls     []callResult
	openUntil time.Time

	window         time.Duration
	minVolume      int // the gate
	errorThreshold float64
	cooldown       time.Duration
}

func NewErrorPercentageBreaker() *ErrorPercentageBreaker {
	return &ErrorPercentageBreaker{
		state:          "CLOSED",
		window:         10_000 * time.Millisecond,
		minVolume:      20,
		errorThreshold: 0.5,
		cooldown:       5_000 * time.Millisecond,
	}
}

func (cb *ErrorPercentageBreaker) Call(work func() error) error {
	if cb.state == "OPEN" && !time.Now().Before(cb.openUntil) {
		cb.state = "HALF"
	}
	if cb.state == "OPEN" {
		return ErrOpen
	}
	if err := work(); err != nil {
		cb.onResult(false)
		return err
	}
	cb.onResult(true)
	return nil
}

func (cb *ErrorPercentageBreaker) onResult(ok bool) {
	now := time.Now()

	if cb.state == "HALF" {
		// Single trial call decides everything.
		if ok {
			cb.state = "CLOSED"
			cb.calls = nil
		} else {
			cb.state = "OPEN"
			cb.openUntil = now.Add(cb.cooldown)
		}
		return
	}

	cb.calls = append(cb.calls, callResult{t: now, ok: ok})
	cb.prune(now)

	total := len(cb.calls)
	if total < cb.minVolume { // GATE 1: volume
		return
	}

	fails := 0
	for _, c := range cb.calls {
		if !c.ok {
			fails++
		}
	}
	if float64(fails)/float64(total) < cb.errorThreshold { // GATE 2: error %
		return
	}

	cb.state = "OPEN"
	cb.openUntil = now.Add(cb.cooldown)
}

func (cb *ErrorPercentageBreaker) prune(now time.Time) {
	lo := now.Add(-cb.window)
	for len(cb.calls) > 0 && cb.calls[0].t.Before(lo) {
		cb.calls = cb.calls[1:]
	}
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "ErrorPercentageBreaker.java",
      code: `// Hystrix-style breaker: trip only when (a) request volume crosses a minimum
// AND (b) error rate crosses the threshold. The volume gate is the whole point.
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.Callable;

class ErrorPercentageBreaker {
    private static final class Call {
        final long t;
        final boolean ok;
        Call(long t, boolean ok) { this.t = t; this.ok = ok; }
    }

    private String state = "CLOSED";              // "CLOSED" | "OPEN" | "HALF"
    private final Deque<Call> calls = new ArrayDeque<>();
    private long openUntil = 0;

    private final long windowMs;
    private final int minVolume;                  // the gate
    private final double errorThreshold;
    private final long cooldownMs;

    ErrorPercentageBreaker(long windowMs, int minVolume, double errorThreshold, long cooldownMs) {
        this.windowMs = windowMs;
        this.minVolume = minVolume;
        this.errorThreshold = errorThreshold;
        this.cooldownMs = cooldownMs;
    }

    <T> T call(Callable<T> work) throws Exception {
        if (state.equals("OPEN") && System.currentTimeMillis() >= openUntil) state = "HALF";
        if (state.equals("OPEN")) throw new IllegalStateException("circuit open");

        try {
            T result = work.call();
            onResult(true);
            return result;
        } catch (Exception err) {
            onResult(false);
            throw err;
        }
    }

    private void onResult(boolean ok) {
        long now = System.currentTimeMillis();

        if (state.equals("HALF")) {
            // Single trial call decides everything.
            if (ok) { state = "CLOSED"; calls.clear(); }
            else    { state = "OPEN"; openUntil = now + cooldownMs; }
            return;
        }

        calls.addLast(new Call(now, ok));
        prune(now);

        int total = calls.size();
        if (total < minVolume) return;                // GATE 1: volume

        long fails = calls.stream().filter(c -> !c.ok).count();
        if ((double) fails / total < errorThreshold) return;  // GATE 2: error %

        state = "OPEN";
        openUntil = now + cooldownMs;
    }

    private void prune(long now) {
        long lo = now - windowMs;
        while (!calls.isEmpty() && calls.peekFirst().t < lo) calls.removeFirst();
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "error_percentage.py",
      code: `# Hystrix-style breaker: trip only when (a) request volume crosses a minimum
# AND (b) error rate crosses the threshold. The volume gate is the whole point.
import time
from collections import deque
from dataclasses import dataclass
from typing import Callable, Deque, TypeVar

T = TypeVar("T")


@dataclass
class Call:
    t: float
    ok: bool


class ErrorPercentageBreaker:
    def __init__(
        self,
        window_s: float = 10.0,
        min_volume: int = 20,       # the gate
        error_threshold: float = 0.5,
        cooldown_s: float = 5.0,
    ) -> None:
        self.state = "CLOSED"       # "CLOSED" | "OPEN" | "HALF"
        self.calls: Deque[Call] = deque()
        self.open_until = 0.0
        self.window_s = window_s
        self.min_volume = min_volume
        self.error_threshold = error_threshold
        self.cooldown_s = cooldown_s

    def call(self, work: Callable[[], T]) -> T:
        if self.state == "OPEN" and time.monotonic() >= self.open_until:
            self.state = "HALF"
        if self.state == "OPEN":
            raise RuntimeError("circuit open")
        try:
            result = work()
        except Exception:
            self._on_result(False)
            raise
        self._on_result(True)
        return result

    def _on_result(self, ok: bool) -> None:
        now = time.monotonic()

        if self.state == "HALF":
            # Single trial call decides everything.
            if ok:
                self.state = "CLOSED"
                self.calls.clear()
            else:
                self.state = "OPEN"
                self.open_until = now + self.cooldown_s
            return

        self.calls.append(Call(t=now, ok=ok))
        self._prune(now)

        total = len(self.calls)
        if total < self.min_volume:                 # GATE 1: volume
            return

        fails = sum(1 for c in self.calls if not c.ok)
        if fails / total < self.error_threshold:    # GATE 2: error %
            return

        self.state = "OPEN"
        self.open_until = now + self.cooldown_s

    def _prune(self, now: float) -> None:
        lo = now - self.window_s
        while self.calls and self.calls[0].t < lo:
            self.calls.popleft()`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "error_percentage.cpp",
      code: `// Hystrix-style breaker: trip only when (a) request volume crosses a minimum
// AND (b) error rate crosses the threshold. The volume gate is the whole point.
#include <chrono>
#include <deque>
#include <functional>
#include <stdexcept>
#include <string>

class ErrorPercentageBreaker {
    using Clock = std::chrono::steady_clock;

    struct Call {
        Clock::time_point t;
        bool ok;
    };

    std::string state_ = "CLOSED";  // "CLOSED" | "OPEN" | "HALF"
    std::deque<Call> calls_;
    Clock::time_point openUntil_;

    std::chrono::milliseconds window_;
    int minVolume_;                 // the gate
    double errorThreshold_;
    std::chrono::milliseconds cooldown_;

public:
    ErrorPercentageBreaker(int windowMs = 10000, int minVolume = 20,
                           double errorThreshold = 0.5, int cooldownMs = 5000)
        : window_(windowMs), minVolume_(minVolume),
          errorThreshold_(errorThreshold), cooldown_(cooldownMs) {}

    // work() returns true on success, throws or returns false on failure.
    void call(const std::function<bool()>& work) {
        if (state_ == "OPEN" && Clock::now() >= openUntil_) state_ = "HALF";
        if (state_ == "OPEN") throw std::runtime_error("circuit open");

        bool ok = false;
        try {
            ok = work();
        } catch (...) {
            onResult(false);
            throw;
        }
        onResult(ok);
    }

private:
    void onResult(bool ok) {
        auto now = Clock::now();

        if (state_ == "HALF") {
            // Single trial call decides everything.
            if (ok) { state_ = "CLOSED"; calls_.clear(); }
            else    { state_ = "OPEN"; openUntil_ = now + cooldown_; }
            return;
        }

        calls_.push_back(Call{now, ok});
        prune(now);

        int total = static_cast<int>(calls_.size());
        if (total < minVolume_) return;               // GATE 1: volume

        int fails = 0;
        for (const auto& c : calls_) if (!c.ok) fails++;
        if (static_cast<double>(fails) / total < errorThreshold_) return;  // GATE 2: error %

        state_ = "OPEN";
        openUntil_ = now + cooldown_;
    }

    void prune(Clock::time_point now) {
        auto lo = now - window_;
        while (!calls_.empty() && calls_.front().t < lo) calls_.pop_front();
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Netflix Hystrix — How It Works",
      href: "https://github.com/Netflix/Hystrix/wiki/How-it-Works",
      note: "The historical reference. Walks through the request-volume threshold and error-percentage threshold concepts that every modern breaker library inherits.",
      kind: "docs",
    },
    {
      label: "Resilience4j — minimumNumberOfCalls + failureRateThreshold",
      href: "https://resilience4j.readme.io/docs/circuitbreaker#configuration",
      note: "The exact knobs from this variant, with default values. Reads almost like the table in this concept's overview.",
      kind: "docs",
    },
    {
      label: "Ben Christensen (Netflix) — Hystrix design",
      href: "https://www.infoq.com/presentations/hystrix-netflix/",
      note: "InfoQ talk from the Hystrix creator explaining why the volume gate was added — production stories of tiny-sample false trips.",
      kind: "video",
    },
    {
      label: "Microsoft .NET — Circuit Breaker pattern (production guidance)",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker",
      note: "Azure architecture-centre page explicitly recommending a request-volume threshold for production breakers. The vocabulary differs slightly but the rule is identical.",
      kind: "docs",
    },
    {
      label: "Yves Lin — Hystrix vs Resilience4j comparison",
      href: "https://reflectoring.io/circuitbreaker-with-resilience4j/",
      note: "Practical walk-through of the Hystrix → Resilience4j migration with the error-percentage configuration mapped one-to-one.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "cb-err-q1",
      question: "Why does this variant add a 'minimum number of calls' check on top of the error percentage?",
      options: [
        { id: "a", label: "To bound memory usage." },
        { id: "b", label: "To stop tiny samples from causing false trips (e.g. 1 fail of 2 = 50%)." },
        { id: "c", label: "Because the half-open phase needs a minimum number of trials." },
        { id: "d", label: "Because TCP requires at least 20 calls to warm up." },
      ],
      correctOptionId: "b",
      explanation:
        "A 50% error rate is meaningless on a 2-call sample. The volume gate is the cheapest way to require statistical confidence before tripping — and it's the rule's whole reason for existing.",
    },
    {
      id: "cb-err-q2",
      question: "Errors are at 100% but traffic is 1 request per second and the minimum is 20 in a 10s window. What happens?",
      options: [
        { id: "a", label: "The breaker trips immediately — 100% error is unambiguous." },
        { id: "b", label: "The breaker stays closed until enough requests accumulate." },
        { id: "c", label: "The breaker enters HALF-OPEN to probe." },
        { id: "d", label: "The breaker raises an alert but doesn't trip." },
      ],
      correctOptionId: "b",
      explanation:
        "Both gates must be met. The volume gate isn't met until you have 20 requests in 10 seconds (here, it takes 20 seconds at 1/s). The breaker is intentionally blind during this period — that's the tradeoff the gate buys you.",
    },
    {
      id: "cb-err-q3",
      question: "How does half-open typically work in this variant?",
      options: [
        { id: "a", label: "All traffic is admitted at 10% to probe." },
        { id: "b", label: "A fixed N (3–5) of trial calls are averaged, like count-based." },
        { id: "c", label: "Exactly one trial call is allowed; its single result decides close-or-reopen." },
        { id: "d", label: "The breaker stays open until a human resets it." },
      ],
      correctOptionId: "c",
      explanation:
        "Hystrix-lineage breakers usually allow a single trial. Pass → close. Fail → re-open. It's both the simplest implementation and a stricter probe than the N-trial average other variants use.",
    },
  ],
};
