import type { ConceptContent } from "@/lib/content/types";

export const paxos: ConceptContent = {
  prototypeCaption:
    "One proposer and five acceptors running a single round of Basic Paxos. Pick a scenario — **Happy path**, **Minority down**, **No quorum**, or **Competing proposer** (where the safety rule overrides a new value) — and step through Prepare / Promise / Accept / Accepted / Chosen. Free play lets you toggle dead acceptors yourself; the log shows only the last two messages.",

  overview: [
    {
      type: "p",
      text: "**Paxos** is the foundational consensus algorithm — Leslie Lamport's 1998 *The Part-Time Parliament* (and the more readable 2001 *Paxos Made Simple*) introduced the protocol that every modern variant descends from. It solves a deceptively narrow problem: how can a cluster agree on **one value** even when nodes crash, messages are dropped, and proposals compete? Once you can do that for one value, you can do it for a whole log of values — that's what Multi-Paxos, Raft, and ZAB build on top.",
    },
    {
      type: "p",
      text: "Three roles: **Proposers** suggest values. **Acceptors** vote on them. **Learners** discover what was chosen. (In practice, every node plays all three.) The protocol runs in two rounds. **Prepare/Promise** locks in a proposal number with a majority of acceptors and learns about any prior accepted value. **Accept/Accepted** asks that same majority to durably store the value. A value is **chosen** the instant a majority of acceptors has stored it — the proposer learns this later.",
    },
    {
      type: "p",
      text: "The genius is in one rule: when a proposer is forced to learn about a previously-accepted value during the Promise phase, it **must propose that value**, not its own. That single constraint is why Paxos never contradicts itself. No matter how many proposers race, how many crash and restart, how many messages reorder — once a majority has accepted *anything*, every future round will converge on that same value.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Phase 1 — Prepare / Promise" },
    {
      type: "ol",
      items: [
        "Proposer picks a globally unique, monotonically increasing proposal number `n` (in practice, `(round, server_id)`) and sends `PREPARE(n)` to every acceptor.",
        "Each acceptor: if `n` is higher than any number it has promised before, it durably records the new promise and replies `PROMISE(n)`. Crucially, the promise also reports `(n', v')` — the highest-numbered proposal it has already accepted, if any. If it has promised a higher number, it replies NACK.",
        "Proposer waits for promises from a **majority** (any 2f+1 of 5 → 3). Less than that and the round abandons.",
      ],
    },
    { type: "h", text: "Phase 2 — Accept / Accepted" },
    {
      type: "ol",
      items: [
        "Proposer scans the promises. If any of them reported a previously-accepted value `v'`, the proposer **must** use the `v'` with the highest `n'`. Otherwise, it's free to use its own value `v`.",
        "Proposer sends `ACCEPT(n, value)` to that same majority.",
        "Each acceptor: if it has not promised a higher number, it durably stores `(n, value)` and replies `ACCEPTED(n, value)`.",
        "When a majority has stored the same value, it is **chosen** — permanent and impossible to contradict.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "The safety rule, in one sentence",
      text: "If a proposer sees in its promises that some acceptor has already accepted v', it MUST propose v' instead of its own value. That rule is the only thing standing between Paxos and disagreement — and it's enough.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Liveness — Paxos can starve",
      text: "Nothing in Basic Paxos prevents two proposers from leapfrogging each other forever — A proposes n=5, B proposes n=7 invalidating A, A retries with n=9 invalidating B, and so on. Real implementations elect a stable leader to do all the proposing (that's Multi-Paxos), or use randomized backoff to break the race.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Single-decree consensus** — agreeing on one decision, like \"who is the leader\" or \"what's the next config epoch.\" Basic Paxos is exactly built for this.",
        "**Foundational understanding** — Paxos is the algorithm everything else extends. Understanding it pays dividends every time you read about a Raft or ZAB design decision.",
        "**Specialist deployments** — Google Chubby, Megastore, and parts of Spanner run Multi-Paxos in production for log replication.",
        "**When you have an existing Paxos implementation** — interoperability is a real reason to stay on Paxos rather than switch to Raft.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Replicated log** (the common case) — use Multi-Paxos or, more commonly in 2026, Raft. Single-decree Paxos is a building block, not the goal.",
        "**You want a protocol you can hand to a new engineer next week** — Raft was specifically designed to be easier to understand and implement correctly.",
        "**You have byzantine participants** — Paxos assumes crash failures only. Use PBFT.",
        "**Atomic commit across heterogeneous resources** — that's 2PC territory, not Paxos.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Provably correct under crash failures** — no value chosen by a majority is ever contradicted, even with arbitrary message loss, delay, and reordering.",
      "**Tolerates f failures of 2f+1 nodes** — 2 of 5 can die, 3 still form a quorum and make progress.",
      "**No leader required for safety** — any proposer can drive a round (though one helps liveness).",
      "**Foundational and well-studied** — three decades of correctness proofs, optimisations, and papers.",
      "**The safety rule makes contradiction structurally impossible** — once a majority has accepted v, every future round converges to v.",
    ],
    cons: [
      "**Notoriously hard to understand** — even Lamport joked about it. Implementations diverged for years before Raft cleaned up the pedagogy.",
      "**Two round-trips per value** — Prepare/Promise + Accept/Accepted. Multi-Paxos amortises this by skipping Phase 1 in steady state.",
      "**Liveness depends on a stable leader in practice** — competing proposers can livelock forever without one.",
      "**Real implementations carry a lot of hidden state** — log compaction, membership changes, leader leases — none of which is in the simple description.",
      "**Single-decree only** — most real systems need a log, not a value. That's what Multi-Paxos solves.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk the Happy path",
      body: "Open **Happy path**. Watch the proposer send PREPARE(11), collect 5 promises (none carry a prior value), send ACCEPT(11, \"A\"), collect 5 ACCEPTEDs, and the value gets chosen. Notice that the safety rule never fires — there was no prior value to honour.",
    },
    {
      title: "02 · See it survive a minority failure",
      body: "Switch to **Minority down**: A4 and A5 are dead. The proposer still gets 3 promises and 3 accepts — exactly the quorum. The value is chosen. This is the fault-tolerance guarantee: 5-node Paxos survives 2 failures, full stop.",
    },
    {
      title: "03 · Watch a no-quorum round fail safely",
      body: "Run **No quorum** — three acceptors down. The proposer only collects 2 promises and stops. No value is chosen, but importantly no value is *miscommitted* either. The round abandons cleanly; a future round (with more live acceptors) can try again.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Try the **Competing proposer** preset: another proposer has already gotten A1 and A2 to accept (n=5, \"A\"). Now you propose (n=12, \"B\") — and watch the safety rule force your value to become \"A\". That is the whole point of Paxos: contradiction is structurally impossible. Try varying dead-node combos to see exactly which configurations have a quorum.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "paxos.go",
      code: `// Basic Paxos — one decree. Roles separated for clarity; in practice
// every node implements all three.
package paxos

import "sync"

// Promise is an acceptor's reply to Prepare. Accepted is false when the
// acceptor has never accepted a value (the "null" case).
type Promise struct {
	N         int
	AcceptedN int
	AcceptedV string
	Accepted  bool
}

type Acceptor struct {
	mu        sync.Mutex
	PromisedN int
	AcceptedN int
	AcceptedV string
	Accepted  bool
}

// Prepare returns (promise, true) on success, or (_, false) for a NACK.
func (a *Acceptor) Prepare(n int) (Promise, bool) {
	a.mu.Lock()
	defer a.mu.Unlock()
	if n <= a.PromisedN {
		return Promise{}, false // NACK
	}
	a.PromisedN = n // durable
	return Promise{N: n, AcceptedN: a.AcceptedN, AcceptedV: a.AcceptedV, Accepted: a.Accepted}, true
}

// Accept returns true on ACCEPTED, false on NACK.
func (a *Acceptor) Accept(n int, v string) bool {
	a.mu.Lock()
	defer a.mu.Unlock()
	if n < a.PromisedN {
		return false // NACK
	}
	a.PromisedN = n
	a.AcceptedN = n
	a.AcceptedV = v // durable
	a.Accepted = true
	return true
}

// Propose runs both phases. Returns (value, true) if a value was chosen,
// or ("", false) if the round failed for lack of quorum.
func Propose(acceptors []*Acceptor, n int, myV string) (string, bool) {
	majority := len(acceptors)/2 + 1

	// Phase 1 — Prepare (fan out to every acceptor in parallel)
	var wg sync.WaitGroup
	promises := make([]Promise, len(acceptors))
	ok := make([]bool, len(acceptors))
	for i, a := range acceptors {
		wg.Add(1)
		go func(i int, a *Acceptor) {
			defer wg.Done()
			promises[i], ok[i] = a.Prepare(n)
		}(i, a)
	}
	wg.Wait()

	var granted []Promise
	for i := range acceptors {
		if ok[i] {
			granted = append(granted, promises[i])
		}
	}
	if len(granted) < majority {
		return "", false // no quorum
	}

	// Safety rule: if any acceptor reported a prior accepted value,
	// we MUST use the one with the highest acceptedN.
	value := myV
	bestN := -1
	for _, p := range granted {
		if p.Accepted && p.AcceptedN > bestN {
			bestN = p.AcceptedN
			value = p.AcceptedV
		}
	}

	// Phase 2 — Accept (fan out again)
	accepted := make([]bool, len(acceptors))
	for i, a := range acceptors {
		wg.Add(1)
		go func(i int, a *Acceptor) {
			defer wg.Done()
			accepted[i] = a.Accept(n, value)
		}(i, a)
	}
	wg.Wait()

	count := 0
	for _, a := range accepted {
		if a {
			count++
		}
	}
	if count < majority {
		return "", false // round fails
	}

	return value, true // chosen — same as bestN's value if there was one
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Paxos.java",
      code: `// Basic Paxos — one decree. Roles separated for clarity; in practice
// every node implements all three.
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// Promise is an acceptor's reply to Prepare. acceptedV is null when the
// acceptor has never accepted a value.
record Promise(int n, Integer acceptedN, String acceptedV) {}

class Acceptor {
    int promisedN = 0;
    Integer acceptedN = null;
    String acceptedV = null;

    // Returns the Promise on success, or empty for a NACK.
    synchronized Optional<Promise> prepare(int n) {
        if (n <= promisedN) return Optional.empty(); // NACK
        promisedN = n;                               // durable
        return Optional.of(new Promise(n, acceptedN, acceptedV));
    }

    // Returns true on ACCEPTED, false on NACK.
    synchronized boolean accept(int n, String v) {
        if (n < promisedN) return false; // NACK
        promisedN = n;
        acceptedN = n;
        acceptedV = v;                   // durable
        return true;
    }
}

class Paxos {
    // Returns the chosen value, or null if the round failed for lack of quorum.
    static String propose(List<Acceptor> acceptors, int n, String myV) {
        int majority = acceptors.size() / 2 + 1;

        // Phase 1 — Prepare
        List<Promise> promises = new ArrayList<>();
        for (Acceptor a : acceptors) {
            a.prepare(n).ifPresent(promises::add);
        }
        if (promises.size() < majority) return null; // no quorum

        // Safety rule: if any acceptor reported a prior accepted value,
        // we MUST use the one with the highest acceptedN.
        String value = myV;
        int bestN = -1;
        for (Promise p : promises) {
            if (p.acceptedV() != null && p.acceptedN() > bestN) {
                bestN = p.acceptedN();
                value = p.acceptedV();
            }
        }

        // Phase 2 — Accept
        int accepts = 0;
        for (Acceptor a : acceptors) {
            if (a.accept(n, value)) accepts++;
        }
        if (accepts < majority) return null; // round fails

        return value; // chosen — same as bestN's value if there was one
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "paxos.py",
      code: `# Basic Paxos — one decree. Roles separated for clarity; in practice
# every node implements all three.
from dataclasses import dataclass
from typing import Optional


# A Promise is an acceptor's reply to prepare. accepted_v is None when the
# acceptor has never accepted a value.
@dataclass
class Promise:
    n: int
    accepted_n: Optional[int]
    accepted_v: Optional[str]


class Acceptor:
    def __init__(self) -> None:
        self.promised_n = 0
        self.accepted_n: Optional[int] = None
        self.accepted_v: Optional[str] = None

    def prepare(self, n: int) -> Optional[Promise]:
        # Returns a Promise on success, or None for a NACK.
        if n <= self.promised_n:
            return None  # NACK
        self.promised_n = n  # durable
        return Promise(n, self.accepted_n, self.accepted_v)

    def accept(self, n: int, v: str) -> bool:
        # Returns True on ACCEPTED, False on NACK.
        if n < self.promised_n:
            return False  # NACK
        self.promised_n = n
        self.accepted_n = n
        self.accepted_v = v  # durable
        return True


def propose(acceptors: list[Acceptor], n: int, my_v: str) -> Optional[str]:
    majority = len(acceptors) // 2 + 1

    # Phase 1 — Prepare
    promises = [p for p in (a.prepare(n) for a in acceptors) if p is not None]
    if len(promises) < majority:
        return None  # no quorum

    # Safety rule: if any acceptor reported a prior accepted value,
    # we MUST use the one with the highest accepted_n.
    value = my_v
    best_n = -1
    for p in promises:
        if p.accepted_v is not None and p.accepted_n > best_n:
            best_n = p.accepted_n
            value = p.accepted_v

    # Phase 2 — Accept
    accepts = sum(1 for a in acceptors if a.accept(n, value))
    if accepts < majority:
        return None  # round fails

    return value  # chosen — same as best_n's value if there was one`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "paxos.cpp",
      code: `// Basic Paxos — one decree. Roles separated for clarity; in practice
// every node implements all three.
#include <optional>
#include <string>
#include <vector>

// A Promise is an acceptor's reply to prepare. acceptedV is empty when the
// acceptor has never accepted a value (the "null" case).
struct Promise {
    int n;
    std::optional<int> acceptedN;
    std::optional<std::string> acceptedV;
};

class Acceptor {
public:
    int promisedN = 0;
    std::optional<int> acceptedN;
    std::optional<std::string> acceptedV;

    // Returns a Promise on success, or std::nullopt for a NACK.
    std::optional<Promise> prepare(int n) {
        if (n <= promisedN) return std::nullopt;  // NACK
        promisedN = n;                            // durable
        return Promise{n, acceptedN, acceptedV};
    }

    // Returns true on ACCEPTED, false on NACK.
    bool accept(int n, const std::string& v) {
        if (n < promisedN) return false;  // NACK
        promisedN = n;
        acceptedN = n;
        acceptedV = v;                    // durable
        return true;
    }
};

// Returns the chosen value, or std::nullopt if the round failed for lack of quorum.
std::optional<std::string> propose(std::vector<Acceptor>& acceptors, int n,
                                   const std::string& myV) {
    int majority = static_cast<int>(acceptors.size()) / 2 + 1;

    // Phase 1 — Prepare
    std::vector<Promise> promises;
    for (auto& a : acceptors) {
        if (auto p = a.prepare(n)) promises.push_back(*p);
    }
    if (static_cast<int>(promises.size()) < majority) return std::nullopt;  // no quorum

    // Safety rule: if any acceptor reported a prior accepted value,
    // we MUST use the one with the highest acceptedN.
    std::string value = myV;
    int bestN = -1;
    for (const auto& p : promises) {
        if (p.acceptedV.has_value() && *p.acceptedN > bestN) {
            bestN = *p.acceptedN;
            value = *p.acceptedV;
        }
    }

    // Phase 2 — Accept
    int accepts = 0;
    for (auto& a : acceptors) {
        if (a.accept(n, value)) accepts++;
    }
    if (accepts < majority) return std::nullopt;  // round fails

    return value;  // chosen — same as bestN's value if there was one
}`,
    },
  ],

  furtherReading: [
    {
      label: "Leslie Lamport — *The Part-Time Parliament* (1998)",
      href: "https://lamport.azurewebsites.net/pubs/lamport-paxos.pdf",
      note: "The original paper, told as an archaeological reconstruction of a Greek parliament. Famously hard on first read; canonical.",
      kind: "paper",
    },
    {
      label: "Leslie Lamport — *Paxos Made Simple* (2001)",
      href: "https://lamport.azurewebsites.net/pubs/paxos-simple.pdf",
      note: "Lamport's own follow-up to make the protocol approachable. Six pages, no parliament. Start here, not at the 1998 paper.",
      kind: "paper",
    },
    {
      label: "Tushar Chandra, Robert Griesemer & Joshua Redstone — *Paxos Made Live* (2007)",
      href: "https://www.cs.utexas.edu/users/lorenzo/corsi/cs380d/papers/paper2-1.pdf",
      note: "Google's account of building Chubby on Paxos — everything the simple description elides: leader leases, snapshots, membership changes, and the bug stories.",
      kind: "paper",
    },
    {
      label: "Diego Ongaro — *Consensus: Bridging Theory and Practice* (PhD thesis, 2014)",
      href: "https://github.com/ongardie/dissertation/raw/master/online.pdf",
      note: "The thesis behind Raft. Chapters 2–3 are the clearest pedagogical reframing of Paxos vs Raft you can find.",
      kind: "paper",
    },
    {
      label: "Robbert van Renesse & Deniz Altinbuken — *Paxos Made Moderately Complex* (2015)",
      href: "https://www.cs.cornell.edu/courses/cs7412/2011sp/paxos.pdf",
      note: "A complete pseudocode-level treatment of Multi-Paxos with all the production concerns. The reference companion to Paxos Made Simple.",
      kind: "paper",
    },
    {
      label: "Heidi Howard et al — *Flexible Paxos: Quorum intersection revisited* (2016)",
      href: "https://arxiv.org/abs/1608.06696",
      note: "Modern result showing the majority quorum isn't required — only that any two quorums intersect. Opens the door to faster Paxos variants.",
      kind: "paper",
    },
  ],

  quiz: [
    {
      id: "px-q1",
      question:
        "An acceptor's PROMISE message reports it previously accepted value \"A\" at proposal number 5. The current proposer wanted to propose \"B\" with proposal number 12. What value will be sent in the ACCEPT message?",
      options: [
        { id: "a", label: "\"B\" — the proposer's preferred value." },
        { id: "b", label: "\"A\" — the safety rule forces the proposer to honour the previously accepted value." },
        { id: "c", label: "Whichever value the proposer flips a coin for." },
        { id: "d", label: "The round aborts because the proposal numbers don't match." },
      ],
      correctOptionId: "b",
      explanation:
        "This is Paxos's safety rule in action: if any acceptor in the quorum has previously accepted a value, the proposer must use the value with the highest accepted-n. \"A\" might already be chosen elsewhere — refusing to overwrite it is what guarantees Paxos never contradicts itself.",
    },
    {
      id: "px-q2",
      question:
        "You have 5 acceptors. How many can fail before Paxos cannot make progress?",
      options: [
        { id: "a", label: "0 — Paxos requires all acceptors." },
        { id: "b", label: "1 — Paxos can survive a single failure." },
        { id: "c", label: "2 — Paxos needs a majority (3) to form a quorum." },
        { id: "d", label: "4 — only one live acceptor is needed." },
      ],
      correctOptionId: "c",
      explanation:
        "Paxos needs a majority of acceptors to participate in both phases. With 5 nodes that's 3, so up to 2 can be dead and the protocol still makes progress. More generally, for 2f+1 nodes Paxos tolerates f failures — the same fault budget every majority-quorum consensus algorithm shares.",
    },
    {
      id: "px-q3",
      question:
        "Why does Basic Paxos guarantee safety but not liveness?",
      options: [
        { id: "a", label: "Because messages are sent over UDP." },
        { id: "b", label: "Because two proposers can leapfrog each other's proposal numbers forever — each invalidating the other's promises — without anything getting chosen." },
        { id: "c", label: "Because acceptors are not durable." },
        { id: "d", label: "Because the algorithm has no notion of time." },
      ],
      correctOptionId: "b",
      explanation:
        "The dueling-proposer livelock: A's prepare(5) gets promises; B's prepare(7) invalidates A's promises before A's accept arrives; A retries with prepare(9), invalidating B; repeat forever. Safety holds (no value is ever falsely chosen) but liveness can starve indefinitely. Real systems break the symmetry by electing a stable leader — that's Multi-Paxos.",
    },
  ],
};
