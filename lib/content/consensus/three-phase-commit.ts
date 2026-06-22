import type { ConceptContent } from "@/lib/content/types";

export const threePhaseCommit: ConceptContent = {
  prototypeCaption:
    "The same coordinator + three participants as 2PC, but with an extra phase. Pick a scenario — **Happy path**, **Vote NO**, **Coordinator crashes after PreCommit** (the case 2PC blocks on), or **Free play**. Step with **Prev / Next / Auto / Restart**. The log card below the prototype only ever holds the last two lines.",

  overview: [
    {
      type: "p",
      text: "**Three-Phase Commit (3PC)** is 2PC's response to its own famous blocking weakness. The fix is precisely one extra phase, inserted between the vote and the commit, with a single purpose: make sure that *if any participant has been told the decision is COMMIT, then every other live participant also knows it*. That extra information is what lets the survivors decide on their own when the coordinator dies.",
    },
    {
      type: "p",
      text: "The three phases are **CanCommit**, **PreCommit**, and **DoCommit**. CanCommit collects votes (just like 2PC's Prepare). PreCommit is the new bit: once the coordinator has every YES, it sends a *pre-commit* notice — \"we are going to commit\" — and waits for acks. Only after a quorum has acked PreCommit does the coordinator send the actual DoCommit. The PreCommit acts as the signal: if every live participant reached it, the consensus is implicit, and a survivor can finish the job without the coordinator.",
    },
    {
      type: "p",
      text: "The catch — and it's a big one — is that 3PC is only safe under **synchronous-network assumptions**: messages must be either delivered within a known timeout or definitely lost. Real networks aren't synchronous; they're partitioned, GC-paused, and unpredictable. So 3PC is studied a lot more often than it is shipped. In production, the real fix for the 2PC blocking case is to replicate the coordinator with Paxos or Raft instead.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Phase 1 — CanCommit (collect votes)" },
    {
      type: "ol",
      items: [
        "Coordinator sends `CAN-COMMIT?` to every participant.",
        "Each participant replies YES (it could commit if asked) or NO. Crucially, the participant does **not** yet write to its log or hold locks heavily — this is a feasibility check.",
        "If anyone answers NO, the coordinator immediately aborts and broadcasts ABORT. Done.",
      ],
    },
    { type: "h", text: "Phase 2 — PreCommit (the new phase)" },
    {
      type: "ol",
      items: [
        "If every reply was YES, the coordinator writes PRE-COMMIT to its log and sends `PRE-COMMIT` to every participant.",
        "Each participant prepares durably (the heavy lifting of writing the redo/undo log, locking rows) and replies `ACK`.",
        "Once the coordinator has acks from a majority — and only then — it knows the decision can survive its own death. Move to Phase 3.",
      ],
    },
    { type: "h", text: "Phase 3 — DoCommit" },
    {
      type: "ol",
      items: [
        "Coordinator sends `DO-COMMIT` to every participant.",
        "Each participant applies the transaction permanently, releases locks, and replies ACK.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      title: "Why the new phase prevents blocking",
      text: "If the coordinator dies during Phase 3, the survivors check among themselves: *did anyone reach PreCommit?* If yes, then by the protocol's invariant every survivor reached PreCommit, which means the coordinator could only have decided to commit — they finish the commit on their own. If no, they all abort safely. Either way, no blocking.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Why production rarely ships 3PC",
      text: "3PC's safety proof depends on a network where every message either arrives within a known bound or is detectably lost. Real wide-area networks have unbounded delays and silent packet loss — under those conditions a partitioned survivor can mistakenly believe the coordinator is dead and commit, while the coordinator was actually alive on the other side of the partition and aborted. So the textbook answer for production is: replicate the coordinator with Raft.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Synchronous-network deployments** — single-datacenter clusters with predictable RTT and reliable hardware, where the synchronous assumption is approximately true.",
        "**You need atomic commit and cannot tolerate the 2PC blocking case**, but a full Raft-replicated coordinator is overkill or unavailable.",
        "**Pedagogical / classical study** — 3PC is the canonical illustration of how an extra phase removes blocking, and why network synchrony assumptions matter.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Asynchronous / WAN networks** — partitions break 3PC's safety. Use a real consensus protocol (Raft / Paxos) for the coordinator.",
        "**Production systems in 2026** — the de-facto fix is Paxos- or Raft-replicated coordinator. Modern DBs (Spanner, CockroachDB) do exactly this.",
        "**Anything where one of the participants is byzantine** — 3PC is crash-tolerant only.",
        "**Long-running workflows** — sagas with compensating transactions handle long-tail coordination better than any commit protocol.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Non-blocking on coordinator failure** (under synchronous assumptions) — survivors can recover the decision themselves.",
      "**Same atomicity guarantee as 2PC** in the happy path — every participant commits or every one aborts.",
      "**Clearer recovery semantics** — the PreCommit phase makes the survivors' decision deterministic.",
      "**Drops Phase 1's heavy work** — the CanCommit poll is light; the durable prepare lives in PreCommit.",
    ],
    cons: [
      "**One extra round-trip** — three RTTs in the happy path vs two for 2PC.",
      "**Safety requires a synchronous network** — partitions can cause inconsistency in real WAN deployments.",
      "**Still all-or-nothing** — one slow participant blocks Phase 2 acks.",
      "**Rarely used in production** — the industry settled on Raft-replicated coordinators instead.",
      "**More state to track on every node** — explicit prepared/precommit/committed states, more recovery cases to test.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk the Happy path",
      body: "Open **Happy path** and step through. Watch the three phases unfold: CanCommit → all YES → PreCommit → acks → DoCommit. Compare against 2PC: there is exactly one extra round-trip, and the prepared state lives in PreCommit, not the vote phase.",
    },
    {
      title: "02 · Flip a participant to NO",
      body: "Switch to **Vote NO** and toggle one participant. The coordinator decides to abort *during CanCommit* — Phase 2 never starts. No locks held, no precommit log, no fuss. 3PC's early-abort path is actually cheaper than 2PC's.",
    },
    {
      title: "03 · Crash the coordinator after PreCommit",
      body: "Run **Coordinator crashes**. Every participant has acked PreCommit, then the coordinator dies before DoCommit. Watch the participants notice the timeout, confer among themselves, observe that everyone reached PreCommit, and commit anyway — no blocking. This is the case 2PC famously gets stuck on.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play** and combine toggles: a NO vote plus a coordinator crash; a coordinator crash before PreCommit (compare to crashing after); all-YES with no crash. Notice that the dangerous network case — a partition that makes survivors think the coordinator is dead when it isn't — is precisely the case the prototype's synchronous assumption hides from you.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "three_phase_commit.go",
      code: `// 3PC coordinator. Adds a PreCommit phase between CanCommit and DoCommit.
package threepc

import "fmt"

type Vote string

const (
	VoteYes Vote = "YES"
	VoteNo  Vote = "NO"
)

type Participant interface {
	CanCommit(txID string) (Vote, error)
	PreCommit(txID string) (string, error) // returns "ACK"
	DoCommit(txID string) error
	Abort(txID string) error
}

type Log interface {
	Write(line string) error
}

func ThreePhaseCommit(txID string, participants []Participant, log Log) (string, error) {
	if err := log.Write(fmt.Sprintf("BEGIN %s", txID)); err != nil {
		return "", err
	}

	// Phase 1 — CanCommit (lightweight feasibility check)
	votes, err := withTimeout(func() ([]Vote, error) {
		out := make([]Vote, len(participants))
		for i, p := range participants {
			v, err := p.CanCommit(txID)
			if err != nil {
				return nil, err
			}
			out[i] = v
		}
		return out, nil
	})
	if err != nil {
		abortAll(txID, participants, log)
		return "ABORTED", nil
	}
	for _, v := range votes {
		if v == VoteNo {
			abortAll(txID, participants, log)
			return "ABORTED", nil
		}
	}

	// Phase 2 — PreCommit (the new phase that prevents blocking)
	if err := log.Write(fmt.Sprintf("PRECOMMIT %s", txID)); err != nil {
		return "", err
	}
	_, err = withTimeout(func() ([]Vote, error) {
		for _, p := range participants {
			if _, err := p.PreCommit(txID); err != nil {
				return nil, err
			}
		}
		return nil, nil
	})
	if err != nil {
		abortAll(txID, participants, log)
		return "ABORTED", nil
	}

	// Phase 3 — DoCommit
	if err := log.Write(fmt.Sprintf("COMMIT %s", txID)); err != nil {
		return "", err
	}
	retryAll(func() error {
		for _, p := range participants {
			if err := p.DoCommit(txID); err != nil {
				return err
			}
		}
		return nil
	})
	return "COMMITTED", nil
}

// On the participant side: if doCommit doesn't arrive within a timeout
// AND we already acked PreCommit, query peers. If any peer also reached
// PreCommit, finish the commit. Otherwise abort. That cooperative
// recovery is what 2PC lacks.`,
    },
    {
      label: "Java",
      language: "java",
      filename: "ThreePhaseCommit.java",
      code: `// 3PC coordinator. Adds a PreCommit phase between CanCommit and DoCommit.
import java.util.List;
import java.util.concurrent.CompletableFuture;

enum Vote { YES, NO }

interface Participant {
  CompletableFuture<Vote> canCommit(String txId);
  CompletableFuture<String> preCommit(String txId); // completes with "ACK"
  CompletableFuture<Void> doCommit(String txId);
  CompletableFuture<Void> abort(String txId);
}

interface Log {
  CompletableFuture<Void> write(String line);
}

public class ThreePhaseCommit {
  public static String threePhaseCommit(String txId, List<Participant> participants, Log log) {
    log.write("BEGIN " + txId).join();

    // Phase 1 — CanCommit (lightweight feasibility check)
    List<Vote> votes;
    try {
      votes = withTimeout(
        allOf(participants.stream().map(p -> p.canCommit(txId)).toList()));
    } catch (Exception e) {
      abortAll(txId, participants, log);
      return "ABORTED";
    }
    if (votes.stream().anyMatch(v -> v == Vote.NO)) {
      abortAll(txId, participants, log);
      return "ABORTED";
    }

    // Phase 2 — PreCommit (the new phase that prevents blocking)
    log.write("PRECOMMIT " + txId).join();
    try {
      withTimeout(
        allOf(participants.stream().map(p -> p.preCommit(txId)).toList()));
    } catch (Exception e) {
      abortAll(txId, participants, log);
      return "ABORTED";
    }

    // Phase 3 — DoCommit
    log.write("COMMIT " + txId).join();
    retryAll(() -> participants.stream().map(p -> p.doCommit(txId)).toList());
    return "COMMITTED";
  }
}

// On the participant side: if doCommit doesn't arrive within a timeout
// AND we already acked PreCommit, query peers. If any peer also reached
// PreCommit, finish the commit. Otherwise abort. That cooperative
// recovery is what 2PC lacks.`,
    },
    {
      label: "Python",
      language: "python",
      filename: "three_phase_commit.py",
      code: `# 3PC coordinator. Adds a PreCommit phase between CanCommit and DoCommit.
import asyncio
from enum import Enum
from typing import Protocol


class Vote(str, Enum):
    YES = "YES"
    NO = "NO"


class Participant(Protocol):
    async def can_commit(self, tx_id: str) -> Vote: ...
    async def pre_commit(self, tx_id: str) -> str: ...  # returns "ACK"
    async def do_commit(self, tx_id: str) -> None: ...
    async def abort(self, tx_id: str) -> None: ...


class Log(Protocol):
    async def write(self, line: str) -> None: ...


async def three_phase_commit(
    tx_id: str,
    participants: list[Participant],
    log: Log,
) -> str:
    await log.write(f"BEGIN {tx_id}")

    # Phase 1 — CanCommit (lightweight feasibility check)
    try:
        votes = await with_timeout(
            asyncio.gather(*(p.can_commit(tx_id) for p in participants)),
        )
    except Exception:
        await abort_all(tx_id, participants, log)
        return "ABORTED"
    if any(v == Vote.NO for v in votes):
        await abort_all(tx_id, participants, log)
        return "ABORTED"

    # Phase 2 — PreCommit (the new phase that prevents blocking)
    await log.write(f"PRECOMMIT {tx_id}")
    try:
        await with_timeout(
            asyncio.gather(*(p.pre_commit(tx_id) for p in participants)),
        )
    except Exception:
        await abort_all(tx_id, participants, log)
        return "ABORTED"

    # Phase 3 — DoCommit
    await log.write(f"COMMIT {tx_id}")
    await retry_all(lambda: [p.do_commit(tx_id) for p in participants])
    return "COMMITTED"


# On the participant side: if do_commit doesn't arrive within a timeout
# AND we already acked PreCommit, query peers. If any peer also reached
# PreCommit, finish the commit. Otherwise abort. That cooperative
# recovery is what 2PC lacks.`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "three_phase_commit.cpp",
      code: `// 3PC coordinator. Adds a PreCommit phase between CanCommit and DoCommit.
#include <future>
#include <string>
#include <vector>

enum class Vote { YES, NO };

struct Participant {
  virtual std::future<Vote> canCommit(const std::string& txId) = 0;
  virtual std::future<std::string> preCommit(const std::string& txId) = 0; // "ACK"
  virtual std::future<void> doCommit(const std::string& txId) = 0;
  virtual std::future<void> abort(const std::string& txId) = 0;
  virtual ~Participant() = default;
};

struct Log {
  virtual std::future<void> write(const std::string& line) = 0;
  virtual ~Log() = default;
};

std::string threePhaseCommit(
    const std::string& txId,
    std::vector<Participant*>& participants,
    Log& log) {
  log.write("BEGIN " + txId).get();

  // Phase 1 — CanCommit (lightweight feasibility check)
  std::vector<Vote> votes;
  try {
    votes = withTimeout<std::vector<Vote>>([&] {
      std::vector<std::future<Vote>> fs;
      for (auto* p : participants) fs.push_back(p->canCommit(txId));
      std::vector<Vote> out;
      for (auto& f : fs) out.push_back(f.get());
      return out;
    });
  } catch (...) {
    abortAll(txId, participants, log);
    return "ABORTED";
  }
  for (auto v : votes) {
    if (v == Vote::NO) {
      abortAll(txId, participants, log);
      return "ABORTED";
    }
  }

  // Phase 2 — PreCommit (the new phase that prevents blocking)
  log.write("PRECOMMIT " + txId).get();
  try {
    withTimeout<void>([&] {
      std::vector<std::future<std::string>> fs;
      for (auto* p : participants) fs.push_back(p->preCommit(txId));
      for (auto& f : fs) f.get();
    });
  } catch (...) {
    abortAll(txId, participants, log);
    return "ABORTED";
  }

  // Phase 3 — DoCommit
  log.write("COMMIT " + txId).get();
  retryAll([&] {
    std::vector<std::future<void>> fs;
    for (auto* p : participants) fs.push_back(p->doCommit(txId));
    return fs;
  });
  return "COMMITTED";
}

// On the participant side: if doCommit doesn't arrive within a timeout
// AND we already acked PreCommit, query peers. If any peer also reached
// PreCommit, finish the commit. Otherwise abort. That cooperative
// recovery is what 2PC lacks.`,
    },
  ],

  furtherReading: [
    {
      label: "Dale Skeen — *Nonblocking Commit Protocols* (1981)",
      href: "https://dl.acm.org/doi/10.1145/582318.582339",
      note: "The original paper that proves a non-blocking atomic-commit protocol exists in the synchronous model — and gives 3PC as the construction.",
      kind: "paper",
    },
    {
      label: "Dale Skeen & Michael Stonebraker — *A Formal Model of Crash Recovery in a Distributed System* (1983)",
      href: "https://www2.eecs.berkeley.edu/Pubs/TechRpts/1980/29225.html",
      note: "The follow-up (Berkeley TR M80/48, later IEEE TSE 1983) that formalises the assumptions 3PC relies on — bounded message delay and detectable failures — and shows where the protocol breaks under partition.",
      kind: "paper",
    },
    {
      label: "Wikipedia — Three-Phase Commit Protocol",
      href: "https://en.wikipedia.org/wiki/Three-phase_commit_protocol",
      note: "Concise reference for the message format, the recovery rules, and the well-known counterexamples that make 3PC unsafe on asynchronous networks.",
      kind: "article",
    },
    {
      label: "Martin Kleppmann — *Designing Data-Intensive Applications* (Chapter 9, \"Atomic Commit and Two-Phase Commit\")",
      href: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
      note: "Discusses why 3PC isn't widely used (network model is too strong) and what production systems do instead.",
      kind: "book",
    },
    {
      label: "ZooKeeper docs — Why not Two-Phase Commit?",
      href: "https://zookeeper.apache.org/doc/r3.4.13/zookeeperOver.html",
      note: "Production motivation for moving past 2PC/3PC entirely: a real coordination service replicates the decision itself with consensus rather than relying on a single coordinator.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "threepc-q1",
      question:
        "What's the single most important thing PreCommit gives 3PC that 2PC lacks?",
      options: [
        { id: "a", label: "A faster commit path in the happy case." },
        { id: "b", label: "A point at which every live participant *knows* the decision is COMMIT, so survivors can finish without the coordinator." },
        { id: "c", label: "A way to tolerate byzantine participants." },
        { id: "d", label: "A way to handle participants without durable storage." },
      ],
      correctOptionId: "b",
      explanation:
        "PreCommit acts as the deterministic signal: if any survivor reached it, by the protocol's invariant every live participant reached it — so they can collectively conclude the decision was COMMIT and finish on their own. That's how 3PC eliminates the 2PC blocking case.",
    },
    {
      id: "threepc-q2",
      question:
        "Why is 3PC rarely deployed in production despite being non-blocking?",
      options: [
        { id: "a", label: "It's patented and royalty-bearing." },
        { id: "b", label: "Its safety proof requires a synchronous network — under real network partitions 3PC can violate atomicity." },
        { id: "c", label: "It only supports two participants." },
        { id: "d", label: "Modern databases don't need atomic commit anymore." },
      ],
      correctOptionId: "b",
      explanation:
        "3PC assumes messages are either delivered within a known time bound or definitely lost. Under WAN partitions a survivor can wrongly decide the coordinator is dead and commit, while the coordinator on the other side of the partition decided to abort. Production fixes the 2PC blocking case differently — by replicating the coordinator itself with Raft or Paxos.",
    },
    {
      id: "threepc-q3",
      question:
        "A 3PC coordinator crashes immediately after sending PreCommit. The three participants are alive and all received it. What do they do?",
      options: [
        { id: "a", label: "Wait forever — same as the 2PC blocking case." },
        { id: "b", label: "Confer among themselves; since all reached PreCommit, they conclude the decision was COMMIT and finish the transaction." },
        { id: "c", label: "Each one rolls back independently." },
        { id: "d", label: "Restart the entire transaction from CanCommit." },
      ],
      correctOptionId: "b",
      explanation:
        "That's exactly the case PreCommit was added to solve. The invariant is: if any live participant reached PreCommit, all live participants did — so they cooperatively conclude the decision must have been COMMIT and apply it without needing the coordinator to come back.",
    },
  ],
};
