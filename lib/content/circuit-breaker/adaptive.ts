import type { ConceptContent } from "@/lib/content/types";

export const adaptive: ConceptContent = {
  prototypeCaption:
    "Two upgrades over the fixed-cooldown breakers. **Cooldowns grow with every re-trip** — 3s → 6s → 12s → 24s — so a flaky downstream isn't slammed back to life. And recovery isn't all-or-nothing: traffic is admitted in stages (**10% → 25% → 50% → 100%**), each stage gated by a few healthy probe calls. One failure during recovery throws you back to OPEN with the next bigger cooldown.",

  overview: [
    {
      type: "p",
      text: "Every breaker so far has the same two failure modes during recovery. **Fail mode A: the downstream isn't ready yet** — the cooldown was too short, the trial calls fail, the breaker re-opens, and you wasted the cooldown for nothing. **Fail mode B: the downstream is barely ready** — the cooldown was long enough but the trial calls were the lull before another storm; you re-open seconds later. Repeat ad nauseam.",
    },
    {
      type: "p",
      text: "The Adaptive variant fixes both with two mechanisms. **Exponential backoff** on the cooldown — every re-trip doubles the wait (up to a cap), so a serially-failing dependency gets longer and longer breathing room. And **gradual ramp-up** during recovery — instead of jumping from 0% to 100% traffic, admit 10% first, then 25%, then 50%, then 100%, and gate each step on a small batch of healthy probes.",
    },
    {
      type: "p",
      text: "It's the breaker AWS, Google, and the big libraries reach for when a fixed cooldown isn't cutting it. More moving parts, more knobs, but the only variant that doesn't keep slamming a recovering downstream the moment it shows a pulse.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Mechanism 1 — Exponential backoff" },
    {
      type: "ol",
      items: [
        "Start with a **base cooldown** (e.g. 3 seconds) and a re-trip **streak counter** at 0.",
        "On every trip, set the cooldown to `min(base × 2^streak, max)`. First trip: 3s. Second: 6s. Third: 12s. Capped (e.g. 24s) so it doesn't run away.",
        "Reset the streak to 0 only on a **full** recovery — i.e. when traffic has reached 100% admission and stayed healthy. A partial recovery that re-trips counts as another re-trip.",
        "In production, **add jitter** (Adaptive's untested cousin): cooldown = min(base × 2^streak, max) × random(0.5..1.0). Stops every caller from probing the downstream in lockstep after a wide outage.",
      ],
    },
    { type: "h", text: "Mechanism 2 — Traffic ramp recovery" },
    {
      type: "ol",
      items: [
        "After the cooldown, instead of HALF-OPEN with N trials, enter a **RECOVERING** state with an admission level — start at 10%.",
        "Each incoming call: roll a die; admit it with probability = current admission level. Hold the rest back (count as 'rejected' but no penalty to the downstream).",
        "Track the admitted calls. After **K consecutive healthy** admitted calls (e.g. 2), promote to the next level: 10% → 25% → 50% → 100%.",
        "At 100% with K healthy in a row, **CLOSE**. Streak counter resets to 0.",
        "**Any** failure during RECOVERING — at any level — re-OPENs the breaker, with the next-bigger cooldown.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why this combination matters",
      text: "Without backoff, a flaky downstream that briefly recovers will cause you to re-trip every few seconds — same cooldown, same instant slam, same failure. Without ramp recovery, you risk sending full production traffic to a service that just woke up and is still warming caches. The two mechanisms cover the two failure modes; either alone leaves you exposed.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Inspirations",
      text: "Exponential backoff with jitter comes straight from the AWS Builders' Library. The gradual ramp is the same idea as AWS Application Load Balancer's `slow_start` mode, Envoy's `panic_threshold` thresholds, and Linkerd's adaptive concurrency — all of which slowly increase admitted load to a recovering target.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to upgrade to Adaptive" },
    {
      type: "ul",
      items: [
        "**Flaky dependencies that recover, then re-fail** — fixed-cooldown breakers waste your time with this pattern. Adaptive cooldowns space probes further and further apart.",
        "**Downstreams with cold starts** — services that need warm caches, JIT compilation, or connection pools to be at full speed. The 10/25/50/100% ramp gives them time to fully wake up.",
        "**Multi-tenant or shared infrastructure** — if your breaker tripping floods another service when it un-trips, the ramp limits the inrush spike.",
        "**Production at scale** — when fixed-cooldown breakers have caused you an incident before, this is what to roll out next.",
        "**Avoid if** your service is simple enough that exp-backoff is overkill — three knobs to tune vs. one. Start with Error-Percentage; upgrade if you see the failure modes above.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "More knobs means more ways to misconfigure",
      text: "Base cooldown, max cooldown, ramp levels, probes-per-step — that's four numbers, all interdependent. Pick wrong (e.g. base = max) and you reduce to a fixed-cooldown breaker. Test the behaviour with the prototype and a chaos scenario before shipping.",
    },
  ],

  tradeoffs: {
    pros: [
      "**Doesn't slam recovering downstreams** — the ramp gives them time to warm up.",
      "**Handles flapping** — exp-backoff means re-failures get longer cooldowns, eventually waiting out the outage.",
      "**Self-tuning, in a sense** — you set the bounds; the cooldown picks its own length within them based on observed re-trips.",
      "**Mirrors what big systems do** — ALB slow-start, Envoy panic mode, Linkerd adaptive concurrency. Knowing this variant is knowing the production pattern.",
    ],
    cons: [
      "**More state and more knobs** — base, max, ramp levels, probes per level. Tuning is non-trivial.",
      "**Rejects some traffic during recovery** — at 10% admission, 90% of calls are held back. Pair with a fallback or queue if those callers need a response.",
      "**Cooldowns can get long** — a service that flaps 4 times can be locked out for 24+ seconds even though it's now healthy. Set a max you can live with.",
      "**Harder to reason about** — operators looking at a dashboard need to understand 'recovering at 25%' vs the simpler 'open' or 'closed'.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the cooldown double",
      body: "Click **failing call** until the breaker trips (default 50% over the last 12). It opens with a 3s cooldown. Wait until it recovers to half-open / recovering. Click **failing call** again to force a re-trip — now the cooldown is 6s. Do it again: 12s. The 'streak' counter in the cooldown card shows what you're paying for the flapping.",
    },
    {
      title: "02 · Walk the recovery ramp",
      body: "Trip the breaker once, let the cooldown elapse. The badge shows **recovering** at 10%. Click **healthy call** twice — the breaker promotes to 25%. Two more healthy → 50%. Two more → 100%. Two more → fully **closed**, streak resets to 0. The ramp is your insurance policy against flooding a freshly recovered service.",
    },
    {
      title: "03 · One slip and back to open",
      body: "Trip → recover to 25% with a couple of healthy calls. Now click **failing call** once. The breaker slams back to OPEN with the next-bigger cooldown — it doesn't average, it doesn't forgive. The single-failure rule applies at every ramp level, not just at 10%.",
    },
    {
      title: "04 · Auto traffic with a flaky downstream",
      body: "Tick **Auto traffic** and set **Downstream errors** to 60% (high but not 100). Watch the breaker repeatedly trip, recover partially, and re-trip — each cycle waiting longer. Eventually the cooldown sits at the max and probes get sparse. Drop errors to 0 and watch the ramp finally complete; the streak resets to 0, cooldown drops back to base.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "adaptive.go",
      code: `// Adaptive breaker: exp-backoff cooldown + ramped recovery.
package breaker

import (
	"errors"
	"math"
	"math/rand"
	"time"
)

var (
	ErrOpen      = errors.New("circuit open")
	ErrHeldBack  = errors.New("recovering · held back")
	admitLevels  = []int{10, 25, 50, 100} // % admission during recovery
)

type AdaptiveBreaker struct {
	state     string // "CLOSED" | "OPEN" | "RECOVERING"
	calls     []bool
	streak    int // re-trip count, drives backoff
	cooldown  time.Duration
	openUntil time.Time
	rampIdx   int
	rampOk    int

	size         int
	threshold    float64
	base         time.Duration
	max          time.Duration
	probesPerStep int
}

func NewAdaptiveBreaker() *AdaptiveBreaker {
	base := 3_000 * time.Millisecond
	return &AdaptiveBreaker{
		state:         "CLOSED",
		cooldown:      base,
		size:          12,
		threshold:     0.5,
		base:          base,
		max:           24_000 * time.Millisecond,
		probesPerStep: 2,
	}
}

func (cb *AdaptiveBreaker) Call(work func() error) error {
	if cb.state == "OPEN" && !time.Now().Before(cb.openUntil) {
		cb.toRecovering()
	}
	if cb.state == "OPEN" {
		return ErrOpen
	}

	if cb.state == "RECOVERING" {
		// Admit a probabilistic slice; the rest are short-circuited.
		admit := admitLevels[cb.rampIdx]
		if rand.Float64()*100 >= float64(admit) {
			return ErrHeldBack
		}
	}

	if err := work(); err != nil {
		cb.onResult(false)
		return err
	}
	cb.onResult(true)
	return nil
}

func (cb *AdaptiveBreaker) onResult(ok bool) {
	if cb.state == "RECOVERING" {
		if !ok {
			cb.trip()
			return
		}
		cb.rampOk++
		if cb.rampOk >= cb.probesPerStep {
			if cb.rampIdx < len(admitLevels)-1 {
				cb.rampIdx++
				cb.rampOk = 0
			} else {
				cb.close()
			}
		}
		return
	}
	cb.calls = append(cb.calls, ok)
	if len(cb.calls) > cb.size {
		cb.calls = cb.calls[1:]
	}
	fails := 0
	for _, c := range cb.calls {
		if !c {
			fails++
		}
	}
	minCalls := cb.size
	if minCalls > 5 {
		minCalls = 5
	}
	if len(cb.calls) >= minCalls && float64(fails)/float64(len(cb.calls)) >= cb.threshold {
		cb.trip()
	}
}

func (cb *AdaptiveBreaker) trip() {
	cb.streak++
	backoff := time.Duration(float64(cb.base) * math.Pow(2, float64(cb.streak-1)))
	if backoff > cb.max {
		backoff = cb.max
	}
	cb.cooldown = backoff
	cb.state = "OPEN"
	cb.openUntil = time.Now().Add(cb.cooldown)
	cb.rampIdx = 0
	cb.rampOk = 0
}

func (cb *AdaptiveBreaker) toRecovering() {
	cb.state = "RECOVERING"
	cb.rampIdx = 0
	cb.rampOk = 0
}

func (cb *AdaptiveBreaker) close() {
	cb.state = "CLOSED"
	cb.calls = nil
	cb.streak = 0
	cb.cooldown = cb.base
	cb.rampIdx = 0
	cb.rampOk = 0
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "AdaptiveBreaker.java",
      code: `// Adaptive breaker: exp-backoff cooldown + ramped recovery.
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.Callable;
import java.util.concurrent.ThreadLocalRandom;

class AdaptiveBreaker {
    // 10 → 25 → 50 → 100% admission during recovery
    private static final int[] ADMIT = {10, 25, 50, 100};

    private String state = "CLOSED";              // "CLOSED" | "OPEN" | "RECOVERING"
    private final Deque<Boolean> calls = new ArrayDeque<>();
    private int streak = 0;                        // re-trip count, drives backoff
    private long cooldownMs;
    private long openUntil = 0;
    private int rampIdx = 0;
    private int rampOk = 0;

    private final int size;
    private final double threshold;
    private final long baseMs;
    private final long maxMs;
    private final int probesPerStep;

    AdaptiveBreaker(int size, double threshold, long baseMs, long maxMs, int probesPerStep) {
        this.size = size;
        this.threshold = threshold;
        this.baseMs = baseMs;
        this.maxMs = maxMs;
        this.probesPerStep = probesPerStep;
        this.cooldownMs = baseMs;
    }

    <T> T call(Callable<T> work) throws Exception {
        if (state.equals("OPEN") && System.currentTimeMillis() >= openUntil) toRecovering();
        if (state.equals("OPEN")) throw new IllegalStateException("circuit open");

        if (state.equals("RECOVERING")) {
            // Admit a probabilistic slice; the rest are short-circuited.
            int admit = ADMIT[rampIdx];
            if (ThreadLocalRandom.current().nextDouble() * 100 >= admit) {
                throw new IllegalStateException("recovering · held back");
            }
        }

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
        if (state.equals("RECOVERING")) {
            if (!ok) { trip(); return; }
            rampOk++;
            if (rampOk >= probesPerStep) {
                if (rampIdx < ADMIT.length - 1) { rampIdx++; rampOk = 0; }
                else close();
            }
            return;
        }
        calls.addLast(ok);
        if (calls.size() > size) calls.removeFirst();
        long fails = calls.stream().filter(c -> !c).count();
        if (calls.size() >= Math.min(5, size) && (double) fails / calls.size() >= threshold) {
            trip();
        }
    }

    private void trip() {
        streak++;
        cooldownMs = Math.min((long) (baseMs * Math.pow(2, streak - 1)), maxMs);
        state = "OPEN";
        openUntil = System.currentTimeMillis() + cooldownMs;
        rampIdx = 0; rampOk = 0;
    }

    private void toRecovering() { state = "RECOVERING"; rampIdx = 0; rampOk = 0; }

    private void close() {
        state = "CLOSED"; calls.clear(); streak = 0;
        cooldownMs = baseMs; rampIdx = 0; rampOk = 0;
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "adaptive.py",
      code: `# Adaptive breaker: exp-backoff cooldown + ramped recovery.
import random
import time
from collections import deque
from typing import Callable, Deque, TypeVar

T = TypeVar("T")

# 10 → 25 → 50 → 100% admission during recovery
ADMIT = [10, 25, 50, 100]


class AdaptiveBreaker:
    def __init__(
        self,
        size: int = 12,
        threshold: float = 0.5,
        base_s: float = 3.0,
        max_s: float = 24.0,
        probes_per_step: int = 2,
    ) -> None:
        self.state = "CLOSED"       # "CLOSED" | "OPEN" | "RECOVERING"
        self.calls: Deque[bool] = deque()
        self.streak = 0             # re-trip count, drives backoff
        self.cooldown_s = base_s
        self.open_until = 0.0
        self.ramp_idx = 0
        self.ramp_ok = 0
        self.size = size
        self.threshold = threshold
        self.base_s = base_s
        self.max_s = max_s
        self.probes_per_step = probes_per_step

    def call(self, work: Callable[[], T]) -> T:
        if self.state == "OPEN" and time.monotonic() >= self.open_until:
            self._to_recovering()
        if self.state == "OPEN":
            raise RuntimeError("circuit open")

        if self.state == "RECOVERING":
            # Admit a probabilistic slice; the rest are short-circuited.
            admit = ADMIT[self.ramp_idx]
            if random.random() * 100 >= admit:
                raise RuntimeError("recovering · held back")

        try:
            result = work()
        except Exception:
            self._on_result(False)
            raise
        self._on_result(True)
        return result

    def _on_result(self, ok: bool) -> None:
        if self.state == "RECOVERING":
            if not ok:
                self._trip()
                return
            self.ramp_ok += 1
            if self.ramp_ok >= self.probes_per_step:
                if self.ramp_idx < len(ADMIT) - 1:
                    self.ramp_idx += 1
                    self.ramp_ok = 0
                else:
                    self._close()
            return
        self.calls.append(ok)
        if len(self.calls) > self.size:
            self.calls.popleft()
        fails = sum(1 for c in self.calls if not c)
        if len(self.calls) >= min(5, self.size) and fails / len(self.calls) >= self.threshold:
            self._trip()

    def _trip(self) -> None:
        self.streak += 1
        self.cooldown_s = min(self.base_s * 2 ** (self.streak - 1), self.max_s)
        self.state = "OPEN"
        self.open_until = time.monotonic() + self.cooldown_s
        self.ramp_idx = 0
        self.ramp_ok = 0

    def _to_recovering(self) -> None:
        self.state = "RECOVERING"
        self.ramp_idx = 0
        self.ramp_ok = 0

    def _close(self) -> None:
        self.state = "CLOSED"
        self.calls.clear()
        self.streak = 0
        self.cooldown_s = self.base_s
        self.ramp_idx = 0
        self.ramp_ok = 0`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "adaptive.cpp",
      code: `// Adaptive breaker: exp-backoff cooldown + ramped recovery.
#include <array>
#include <chrono>
#include <cmath>
#include <deque>
#include <functional>
#include <random>
#include <stdexcept>
#include <string>

class AdaptiveBreaker {
    using Clock = std::chrono::steady_clock;

    // 10 → 25 → 50 → 100% admission during recovery
    static constexpr std::array<int, 4> ADMIT = {10, 25, 50, 100};

    std::string state_ = "CLOSED";  // "CLOSED" | "OPEN" | "RECOVERING"
    std::deque<bool> calls_;
    int streak_ = 0;                // re-trip count, drives backoff
    std::chrono::milliseconds cooldown_;
    Clock::time_point openUntil_;
    int rampIdx_ = 0;
    int rampOk_ = 0;

    int size_;
    double threshold_;
    std::chrono::milliseconds base_;
    std::chrono::milliseconds max_;
    int probesPerStep_;

    std::mt19937 rng_{std::random_device{}()};
    std::uniform_real_distribution<double> dist_{0.0, 1.0};

public:
    AdaptiveBreaker(int size = 12, double threshold = 0.5, int baseMs = 3000,
                    int maxMs = 24000, int probesPerStep = 2)
        : cooldown_(baseMs), size_(size), threshold_(threshold),
          base_(baseMs), max_(maxMs), probesPerStep_(probesPerStep) {}

    // work() returns true on success, throws or returns false on failure.
    void call(const std::function<bool()>& work) {
        if (state_ == "OPEN" && Clock::now() >= openUntil_) toRecovering();
        if (state_ == "OPEN") throw std::runtime_error("circuit open");

        if (state_ == "RECOVERING") {
            // Admit a probabilistic slice; the rest are short-circuited.
            int admit = ADMIT[rampIdx_];
            if (dist_(rng_) * 100 >= admit) throw std::runtime_error("recovering · held back");
        }

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
        if (state_ == "RECOVERING") {
            if (!ok) { trip(); return; }
            rampOk_++;
            if (rampOk_ >= probesPerStep_) {
                if (rampIdx_ < static_cast<int>(ADMIT.size()) - 1) { rampIdx_++; rampOk_ = 0; }
                else close();
            }
            return;
        }
        calls_.push_back(ok);
        if (static_cast<int>(calls_.size()) > size_) calls_.pop_front();
        int fails = 0;
        for (bool c : calls_) if (!c) fails++;
        int minCalls = std::min(5, size_);
        if (static_cast<int>(calls_.size()) >= minCalls &&
            static_cast<double>(fails) / calls_.size() >= threshold_) {
            trip();
        }
    }

    void trip() {
        streak_++;
        auto backoff = std::chrono::milliseconds(
            static_cast<long>(base_.count() * std::pow(2, streak_ - 1)));
        cooldown_ = backoff > max_ ? max_ : backoff;
        state_ = "OPEN";
        openUntil_ = Clock::now() + cooldown_;
        rampIdx_ = 0; rampOk_ = 0;
    }

    void toRecovering() { state_ = "RECOVERING"; rampIdx_ = 0; rampOk_ = 0; }

    void close() {
        state_ = "CLOSED"; calls_.clear(); streak_ = 0;
        cooldown_ = base_; rampIdx_ = 0; rampOk_ = 0;
    }
};`,
    },
  ],

  furtherReading: [
    {
      label: "AWS Builders' Library — Timeouts, retries, and backoff with jitter",
      href: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
      note: "Marc Brooker's piece on why exponential backoff plus jitter is the only honest answer to flapping services. The exp-backoff part of this variant comes from here.",
      kind: "article",
    },
    {
      label: "AWS Application Load Balancer — slow_start_duration",
      href: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-attributes.html#slow-start-duration",
      note: "The 'gradually ramp traffic' idea, productionised at the load-balancer layer. Same concept as this breaker's recovery ramp, applied to new targets after deploy or recovery.",
      kind: "docs",
    },
    {
      label: "Envoy — panic threshold & outlier ejection",
      href: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/panic_threshold",
      note: "Envoy's adaptive behaviour during partial outages. The 'panic threshold' is a different mechanism but solves the same 'don't trust a single recovering host' problem.",
      kind: "docs",
    },
    {
      label: "Linkerd — adaptive concurrency control",
      href: "https://linkerd.io/2.14/features/load-balancing/",
      note: "Service-mesh take on the same idea: instead of binary open/closed, dynamically adjust how much load each upstream gets based on its recent latency.",
      kind: "docs",
    },
    {
      label: "Resilience4j — slowCallRateThreshold + allowedNumberOfCallsInHalfOpenState",
      href: "https://resilience4j.readme.io/docs/circuitbreaker#configuration",
      note: "Resilience4j doesn't ship full ramp recovery but its half-open knobs give you most of the way there. Worth reading to see how libraries approximate adaptive behaviour.",
      kind: "docs",
    },
    {
      label: "Polly — Advanced circuit-breaker + retry policies",
      href: "https://www.pollydocs.org/strategies/circuit-breaker",
      note: ".NET resilience library. The 'combining strategies' guide shows how to stack a breaker with retry-with-exp-backoff to get effectively adaptive behaviour.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "cb-adapt-q1",
      question: "Why does the cooldown grow on every re-trip?",
      options: [
        { id: "a", label: "To compensate for clock drift." },
        { id: "b", label: "Because a downstream that just re-failed probably needs more time, not the same time, to recover." },
        { id: "c", label: "To save memory on the breaker side." },
        { id: "d", label: "Because the HTTP spec requires it." },
      ],
      correctOptionId: "b",
      explanation:
        "A fixed cooldown means you keep probing at the same interval — and keep failing. Exponential backoff spaces probes further apart on each failure so a struggling service gets the time it actually needs.",
    },
    {
      id: "cb-adapt-q2",
      question: "During recovery, the breaker is at the 50% admission level when a single call fails. What happens?",
      options: [
        { id: "a", label: "It demotes to 25%." },
        { id: "b", label: "It stays at 50% and adds the failure to a running average." },
        { id: "c", label: "It re-opens with the next-bigger cooldown." },
        { id: "d", label: "Nothing — failures during recovery are ignored to avoid flapping." },
      ],
      correctOptionId: "c",
      explanation:
        "Recovery is intentionally fragile — one failure at any ramp level re-opens the breaker. The ramp is for *promotion*; demotion isn't a thing. If you survive any failure, you've effectively committed to the next cooldown.",
    },
    {
      id: "cb-adapt-q3",
      question: "Why is the ramp (10 → 25 → 50 → 100%) better than a single threshold of trial calls?",
      options: [
        { id: "a", label: "It uses less memory than counting trials." },
        { id: "b", label: "It avoids slamming a freshly recovered downstream with 100% traffic at once." },
        { id: "c", label: "It makes the breaker easier to test." },
        { id: "d", label: "It allows the breaker to use a smaller cooldown." },
      ],
      correctOptionId: "b",
      explanation:
        "A service that just woke up may have cold caches, empty connection pools, or be in the middle of warming a JIT. Going from 0 to 100% in one step risks immediate re-trip. The ramp gives the downstream time to fully come back before facing full load.",
    },
  ],
};
