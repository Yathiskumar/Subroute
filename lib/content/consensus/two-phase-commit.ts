import type { ConceptContent } from "@/lib/content/types";

export const twoPhaseCommit: ConceptContent = {
  prototypeCaption:
    "Three participants and one coordinator running a 2PC transaction. Pick a scenario — **Happy path**, **A participant votes NO**, or **Coordinator crashes**, or jump into **Free play** and toggle votes yourself. Use **Prev / Next / Auto / Restart**; the message log below the prototype keeps only the last two lines so it never grows.",

  overview: [
    {
      type: "p",
      text: "**Two-Phase Commit (2PC)** is the textbook atomic-commit protocol — the one every distributed-systems course opens with. One process plays the role of **coordinator**; the rest are **participants** that each hold a piece of the transaction. The coordinator's job is to get every participant to commit, or get every participant to abort. Half-committed is forbidden.",
    },
    {
      type: "p",
      text: "The shape is exactly what the name says: two phases. In **Phase 1 — Prepare**, the coordinator asks every participant \"can you commit?\" Each participant prepares — writes the transaction to a durable log, holds the locks — then replies YES or NO. In **Phase 2 — Decide**, the coordinator looks at the votes. If every reply was YES, it broadcasts COMMIT. If even one was NO (or never arrived), it broadcasts ABORT. Either way the decision is unanimous.",
    },
    {
      type: "p",
      text: "2PC delivers atomicity — but it pays a famous price. If the coordinator dies after collecting YES votes but before broadcasting the decision, the participants are stuck. They can't unilaterally abort (the coordinator might still be alive and have told someone else to commit), and they can't unilaterally commit (the same logic, in reverse). They block, holding locks, until the coordinator comes back. That blocking is what every protocol *after* 2PC tries to fix.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Phase 1 — Prepare (the vote)" },
    {
      type: "ol",
      items: [
        "Coordinator writes BEGIN to its log, then sends `PREPARE` to every participant.",
        "Each participant tentatively performs the work: locks rows, writes redo/undo records, fsyncs a `PREPARED` log entry. From this point on, the participant has promised it can commit if asked.",
        "The participant replies `YES` if it managed to prepare, or `NO` if it ran out of disk, hit a constraint, or otherwise can't commit.",
      ],
    },
    { type: "h", text: "Phase 2 — Decide (the broadcast)" },
    {
      type: "ol",
      items: [
        "If **every** vote is YES, the coordinator writes `COMMIT` to its log (this is the moment of decision) and sends `COMMIT` to every participant.",
        "If **any** vote is NO, the coordinator writes `ABORT` and sends `ABORT` to every participant.",
        "Each participant applies the decision permanently, releases locks, fsyncs the outcome, and replies `ACK`.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "The blocking failure",
      text: "If the coordinator crashes after some participants received COMMIT but others did not, the survivors are stuck. They asked their peers, but the peers don't know the decision either — the coordinator's log is the single source of truth. They wait, holding locks, until the coordinator recovers (it reads its log and resumes). This is the famous blocking case, and the entire reason 3PC, Paxos-replicated coordinators, and saga patterns exist.",
    },
    {
      type: "callout",
      variant: "info",
      title: "The atomicity guarantee in one sentence",
      text: "Once the coordinator writes COMMIT, every participant *will* eventually commit (even if they have to be reminded after recovery); once the coordinator writes ABORT, every participant *will* eventually abort. The protocol never leaves participants in disagreement once the coordinator has written its decision.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Cross-shard / cross-service transactions** where you need true atomicity and the participants are known ahead of time — XA distributed transactions, database-internal cross-partition writes, SQL across multiple PostgreSQL shards.",
        "**Short transactions** where the blocking case is rare and acceptable — milliseconds-long writes, intra-datacenter calls with reliable nodes.",
        "**You can replicate the coordinator** with a real consensus protocol (Raft / Paxos) so its decision survives its crash — this is exactly what Spanner does.",
        "**The simplest possible mental model** is your priority — 2PC is what every operator already understands, and that has real value.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Long-running workflows across services** (order → payment → shipping) — use a [saga](https://microservices.io/patterns/data/saga.html) with compensating actions instead. 2PC's lock-holding hurts.",
        "**You cannot tolerate the blocking case** — replicate the coordinator (Raft), or use 3PC, or restructure as eventual consistency with reconciliation.",
        "**Replicated state machines and log replication** — that's Paxos and Raft territory, not 2PC.",
        "**Byzantine fault model** — 2PC assumes participants only crash, not lie. Use PBFT or similar.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Simplest possible atomic-commit protocol** — two phases, three message types, fits on a whiteboard.",
      "**Strong atomicity guarantee** — every participant commits, or every participant aborts. No half-states once the coordinator decides.",
      "**Well-understood** — XA, JTA, MS DTC, all the textbooks; battle-tested across decades of databases.",
      "**Cheap in the happy path** — just two round-trips and no consensus quorum machinery.",
      "**Compositional** — you can wrap any resource manager (DB, queue, file system) that exposes prepare/commit/abort.",
    ],
    cons: [
      "**Blocks on coordinator failure** — the famous case: coordinator dies after collecting votes, participants hang holding locks.",
      "**Holds locks across both phases** — long latency multiplies contention.",
      "**All-or-nothing fragility** — one slow or dead participant stalls every other one.",
      "**Synchronous and chatty** — every participant must be reachable for every transaction.",
      "**No fault tolerance on the decision itself** — without external replication, the coordinator is a single point of failure.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk the Happy path",
      body: "Open the **Happy path** scenario and step through with **Next**. Watch the coordinator send PREPARE, all three participants reply YES, the coordinator write COMMIT, and every participant move to COMMITTED. Notice that the decision (COMMIT) is written *before* it's broadcast — that is the durable atomicity anchor.",
    },
    {
      title: "02 · Make a participant vote NO",
      body: "Switch to the **A participant votes NO** scenario. One participant — say P2 — replies NO during the vote. The coordinator immediately writes ABORT and tells everyone to roll back. Notice that even the participants who voted YES still abort: the rule is *unanimous YES required*, not majority.",
    },
    {
      title: "03 · Crash the coordinator mid-decision",
      body: "Run the **Coordinator crashes** scenario. Every participant has voted YES, then the coordinator dies before sending COMMIT. The participants are stuck — they have promised to commit if asked but cannot proceed without the coordinator's word. This is the blocking case, and the whole motivation for 3PC.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play** and toggle the per-participant vote checkboxes before stepping through. Try every combination: one NO, two NOs, three YESes. Try crashing the coordinator at different points (after Prepare, after votes, after Commit). The protocol holds the same invariant every time — and the same blocking weakness every time.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "two_phase_commit.go",
      code: `// Coordinator-side 2PC. Each participant exposes Prepare/Commit/Abort
// and persists its decision durably before replying.
type Vote string

const (
	VoteYes Vote = "YES"
	VoteNo  Vote = "NO"
)

type Participant interface {
	Prepare(txId string) (Vote, error)
	Commit(txId string) error
	Abort(txId string) error
}

type Log interface {
	Write(line string) error
}

func twoPhaseCommit(txId string, participants []Participant, log Log) string {
	log.Write("BEGIN " + txId)

	// Phase 1 — Prepare
	votes := make([]Vote, len(participants))
	var mu sync.Mutex
	g, _ := errgroup.WithContext(context.Background())
	for i, p := range participants {
		i, p := i, p
		g.Go(func() error {
			v, err := p.Prepare(txId)
			if err != nil {
				return err
			}
			mu.Lock()
			votes[i] = v
			mu.Unlock()
			return nil
		})
	}
	if err := g.Wait(); err != nil {
		// a participant failed to prepare — treat as NO
		log.Write("ABORT " + txId)
		abortAll(participants, txId) // best-effort, like Promise.allSettled
		return "ABORTED"
	}

	// Phase 2 — Decide
	allYes := true
	for _, v := range votes {
		if v != VoteYes {
			allYes = false
			break
		}
	}
	if allYes {
		log.Write("COMMIT " + txId) // <- the durable decision
		// Retry forever; participants must eventually apply the commit.
		retryAll(func() []func() error {
			calls := make([]func() error, len(participants))
			for i, p := range participants {
				p := p
				calls[i] = func() error { return p.Commit(txId) }
			}
			return calls
		})
		return "COMMITTED"
	}
	log.Write("ABORT " + txId)
	retryAll(func() []func() error {
		calls := make([]func() error, len(participants))
		for i, p := range participants {
			p := p
			calls[i] = func() error { return p.Abort(txId) }
		}
		return calls
	})
	return "ABORTED"
}

// On recovery, the coordinator reads its log: if it sees COMMIT/ABORT
// for txId, it replays the broadcast. If it sees BEGIN but no decision,
// it aborts. That single-source-of-truth log is what makes 2PC atomic.`,
    },
    {
      label: "Java",
      language: "java",
      filename: "TwoPhaseCommit.java",
      code: `// Coordinator-side 2PC. Each participant exposes prepare/commit/abort
// and persists its decision durably before replying.
enum Vote { YES, NO }

interface Participant {
    CompletableFuture<Vote> prepare(String txId);
    CompletableFuture<Void> commit(String txId);
    CompletableFuture<Void> abort(String txId);
}

interface Log {
    CompletableFuture<Void> write(String line);
}

String twoPhaseCommit(String txId, List<Participant> participants, Log log) {
    log.write("BEGIN " + txId).join();

    // Phase 1 — Prepare
    List<Vote> votes;
    try {
        List<CompletableFuture<Vote>> prepares = participants.stream()
            .map(p -> p.prepare(txId))
            .toList();
        CompletableFuture.allOf(prepares.toArray(new CompletableFuture[0])).join();
        votes = prepares.stream().map(CompletableFuture::join).toList();
    } catch (CompletionException ex) {
        // a participant failed to prepare — treat as NO
        log.write("ABORT " + txId).join();
        // best-effort, like Promise.allSettled
        participants.forEach(p -> p.abort(txId).exceptionally(t -> null).join());
        return "ABORTED";
    }

    // Phase 2 — Decide
    boolean allYes = votes.stream().allMatch(v -> v == Vote.YES);
    if (allYes) {
        log.write("COMMIT " + txId).join(); // <- the durable decision
        // Retry forever; participants must eventually apply the commit.
        retryAll(() -> participants.stream()
            .map(p -> (Supplier<CompletableFuture<Void>>) () -> p.commit(txId))
            .toList());
        return "COMMITTED";
    } else {
        log.write("ABORT " + txId).join();
        retryAll(() -> participants.stream()
            .map(p -> (Supplier<CompletableFuture<Void>>) () -> p.abort(txId))
            .toList());
        return "ABORTED";
    }
}

// On recovery, the coordinator reads its log: if it sees COMMIT/ABORT
// for txId, it replays the broadcast. If it sees BEGIN but no decision,
// it aborts. That single-source-of-truth log is what makes 2PC atomic.`,
    },
    {
      label: "Python",
      language: "python",
      filename: "two_phase_commit.py",
      code: `# Coordinator-side 2PC. Each participant exposes prepare/commit/abort
# and persists its decision durably before replying.
from enum import Enum
from typing import Protocol
import asyncio


class Vote(str, Enum):
    YES = "YES"
    NO = "NO"


class Participant(Protocol):
    async def prepare(self, tx_id: str) -> Vote: ...
    async def commit(self, tx_id: str) -> None: ...
    async def abort(self, tx_id: str) -> None: ...


class Log(Protocol):
    async def write(self, line: str) -> None: ...


async def two_phase_commit(
    tx_id: str,
    participants: list[Participant],
    log: Log,
) -> str:
    await log.write(f"BEGIN {tx_id}")

    # Phase 1 — Prepare
    try:
        votes = await asyncio.gather(*(p.prepare(tx_id) for p in participants))
    except Exception:
        # a participant failed to prepare — treat as NO
        await log.write(f"ABORT {tx_id}")
        # best-effort, like Promise.allSettled
        await asyncio.gather(
            *(p.abort(tx_id) for p in participants), return_exceptions=True
        )
        return "ABORTED"

    # Phase 2 — Decide
    all_yes = all(v == Vote.YES for v in votes)
    if all_yes:
        await log.write(f"COMMIT {tx_id}")  # <- the durable decision
        # Retry forever; participants must eventually apply the commit.
        await retry_all(lambda: [p.commit(tx_id) for p in participants])
        return "COMMITTED"
    else:
        await log.write(f"ABORT {tx_id}")
        await retry_all(lambda: [p.abort(tx_id) for p in participants])
        return "ABORTED"


# On recovery, the coordinator reads its log: if it sees COMMIT/ABORT
# for tx_id, it replays the broadcast. If it sees BEGIN but no decision,
# it aborts. That single-source-of-truth log is what makes 2PC atomic.`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "two_phase_commit.cpp",
      code: `// Coordinator-side 2PC. Each participant exposes prepare/commit/abort
// and persists its decision durably before replying.
enum class Vote { Yes, No };

struct Participant {
    virtual std::future<Vote> prepare(const std::string& txId) = 0;
    virtual std::future<void> commit(const std::string& txId) = 0;
    virtual std::future<void> abort(const std::string& txId) = 0;
    virtual ~Participant() = default;
};

struct Log {
    virtual void write(const std::string& line) = 0;
    virtual ~Log() = default;
};

std::string twoPhaseCommit(
    const std::string& txId,
    std::vector<Participant*>& participants,
    Log& log) {
    log.write("BEGIN " + txId);

    // Phase 1 — Prepare
    std::vector<Vote> votes;
    try {
        std::vector<std::future<Vote>> prepares;
        for (auto* p : participants)
            prepares.push_back(p->prepare(txId)); // fan out
        for (auto& f : prepares)
            votes.push_back(f.get()); // join; .get() rethrows on failure
    } catch (...) {
        // a participant failed to prepare — treat as NO
        log.write("ABORT " + txId);
        // best-effort, like Promise.allSettled
        std::vector<std::future<void>> aborts;
        for (auto* p : participants)
            aborts.push_back(p->abort(txId));
        for (auto& f : aborts) {
            try { f.get(); } catch (...) {}
        }
        return "ABORTED";
    }

    // Phase 2 — Decide
    bool allYes = std::all_of(votes.begin(), votes.end(),
                              [](Vote v) { return v == Vote::Yes; });
    if (allYes) {
        log.write("COMMIT " + txId); // <- the durable decision
        // Retry forever; participants must eventually apply the commit.
        retryAll([&] {
            std::vector<std::function<std::future<void>()>> calls;
            for (auto* p : participants)
                calls.push_back([p, &txId] { return p->commit(txId); });
            return calls;
        });
        return "COMMITTED";
    } else {
        log.write("ABORT " + txId);
        retryAll([&] {
            std::vector<std::function<std::future<void>()>> calls;
            for (auto* p : participants)
                calls.push_back([p, &txId] { return p->abort(txId); });
            return calls;
        });
        return "ABORTED";
    }
}

// On recovery, the coordinator reads its log: if it sees COMMIT/ABORT
// for txId, it replays the broadcast. If it sees BEGIN but no decision,
// it aborts. That single-source-of-truth log is what makes 2PC atomic.`,
    },
  ],

  furtherReading: [
    {
      label: "Jim Gray — *Notes on Database Operating Systems* (1978)",
      href: "https://jimgray.azurewebsites.net/papers/dbos.pdf",
      note: "The original write-up of 2PC, by the author who coined transactions. Section 5 is the canonical description of the protocol and the recovery rules.",
      kind: "paper",
    },
    {
      label: "Bernstein, Hadzilacos & Goodman — *Concurrency Control and Recovery in Database Systems* (Chapter 7)",
      href: "https://www.microsoft.com/en-us/research/wp-content/uploads/2016/05/CCsbookA4-2.pdf",
      note: "Textbook treatment of atomic commit protocols including the formal proof that 2PC is correct in the crash-failure model. Free PDF from the authors.",
      kind: "book",
    },
    {
      label: "X/Open XA Specification",
      href: "https://pubs.opengroup.org/onlinepubs/009680699/toc.pdf",
      note: "The industry-standard interface that databases and transaction managers implement to participate in 2PC across vendors. JTA, MS DTC, and Oracle all conform.",
      kind: "spec",
    },
    {
      label: "PostgreSQL docs — Two-Phase Commit (PREPARE TRANSACTION)",
      href: "https://www.postgresql.org/docs/current/sql-prepare-transaction.html",
      note: "Concrete production implementation. Shows the exact SQL surface, the on-disk pg_twophase directory, and how recovery replays prepared transactions.",
      kind: "docs",
    },
    {
      label: "Pat Helland — *Life beyond Distributed Transactions: an Apostate's Opinion* (2007)",
      href: "https://www.ics.uci.edu/~cs223/papers/cidr07p15.pdf",
      note: "The famous polemic against 2PC at scale. Argues you should design around eventual consistency rather than chase atomicity across services — required reading for anyone reaching for XA.",
      kind: "paper",
    },
    {
      label: "Martin Kleppmann — *Designing Data-Intensive Applications* (Chapter 9)",
      href: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
      note: "The clearest modern explanation of 2PC, where it's used (XA), why it blocks, and what production systems do instead (Spanner replicates the coordinator with Paxos).",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "tpc-q1",
      question:
        "In 2PC, what happens if the coordinator crashes immediately after writing `COMMIT` to its own log but before sending any COMMIT message?",
      options: [
        { id: "a", label: "Participants time out and abort the transaction." },
        { id: "b", label: "Participants stay blocked, holding locks, until the coordinator recovers and replays its log." },
        { id: "c", label: "The participant with the highest ID takes over as the new coordinator." },
        { id: "d", label: "Each participant votes again and the majority decides." },
      ],
      correctOptionId: "b",
      explanation:
        "The coordinator's log is the single source of truth: once it has written COMMIT, that decision is final. Participants cannot abort unilaterally (someone might already have committed) and cannot commit unilaterally (the other side of the same logic). They block until the coordinator comes back and resumes the broadcast — exactly the famous blocking case.",
    },
    {
      id: "tpc-q2",
      question:
        "How many YES votes does the coordinator need before it can decide to commit?",
      options: [
        { id: "a", label: "A simple majority (more than half)." },
        { id: "b", label: "A two-thirds super-majority." },
        { id: "c", label: "Unanimous — every participant must vote YES." },
        { id: "d", label: "Just one — any participant can authorise the commit." },
      ],
      correctOptionId: "c",
      explanation:
        "2PC requires unanimous YES. A single NO (or an unreachable participant) forces the coordinator to abort. That all-or-nothing rule is what makes 2PC atomic — and also why a single slow participant stalls every other one.",
    },
    {
      id: "tpc-q3",
      question:
        "Which production system avoids the 2PC blocking problem by *replicating the coordinator itself*?",
      options: [
        { id: "a", label: "Vanilla PostgreSQL with PREPARE TRANSACTION." },
        { id: "b", label: "MySQL's classic XA transactions." },
        { id: "c", label: "Google Spanner — the coordinator's decision is replicated via Paxos before being broadcast." },
        { id: "d", label: "Kafka's transactional producer API." },
      ],
      correctOptionId: "c",
      explanation:
        "Spanner runs 2PC across Paxos groups, but the *coordinator* is itself a Paxos group, not a single process. The COMMIT decision is replicated to a majority before any participant is told — so a single machine death no longer blocks the cluster. This is the standard modern fix.",
    },
  ],
};
