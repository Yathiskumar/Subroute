import type { ConceptContent } from "@/lib/content/types";

export const multiPaxos: ConceptContent = {
  prototypeCaption:
    "Five nodes running Multi-Paxos. Pick a scenario — **Elect a leader** (the one-time Phase 1), **Stream commands** (Phase 2 only, one RTT each), or **Crash the leader** to watch re-election kick in. Free play lets you queue arbitrary commands and crash whenever; the message log keeps only the last two lines.",

  overview: [
    {
      type: "p",
      text: "**Multi-Paxos** is what you actually use when you want a replicated log built on Paxos. Basic Paxos agrees on *one* value; a real system needs a *sequence* of values (a log of commands). The naive answer — run Basic Paxos once per log slot — burns two round-trips per command, plus risks live-lock from duelling proposers. Multi-Paxos fixes both with a single move: **elect a stable leader once, then skip Phase 1 forever after**.",
    },
    {
      type: "p",
      text: "The structure: a designated proposer (the leader) runs Paxos Phase 1 — Prepare/Promise — across a quorum, but with an extended ballot number that covers *every future slot*. Once a majority has promised, the leader has \"won the right to propose\" for as many slots as it wants. Each subsequent command goes through Phase 2 only — one Accept round-trip and the value is chosen. That's a 2× latency win in steady state, and the dueling-proposer livelock simply can't happen because there's only one proposer.",
    },
    {
      type: "p",
      text: "When the leader crashes, a survivor starts a new election with a higher ballot number, runs Phase 1 again, and takes over. Committed log entries are safe because they're already on a majority — the new leader, by the Paxos safety rule, will always learn about them during Promise. This same shape — leader + Phase-2-only steady state + leader change — is exactly what Raft and ZAB inherited. Multi-Paxos is the algorithm the modern world copies from.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Phase 1 (rare) — Elect a leader" },
    {
      type: "ol",
      items: [
        "Candidate picks a ballot number `b` higher than any seen before and sends `PREPARE(b)` once, to every acceptor — covering *all future slots*, not a specific one.",
        "Each acceptor: promises not to accept anything below `b` and replies with the highest-numbered value already accepted in *every* slot it knows about.",
        "When a majority promises, the candidate is the leader. It must reconcile any partially-accepted values from those promises (re-running Accept for any pending slot) before accepting new commands.",
      ],
    },
    { type: "h", text: "Phase 2 (common) — Stream commands" },
    {
      type: "ol",
      items: [
        "Client sends a command to the leader.",
        "Leader assigns the next free slot, picks its own value, and sends `ACCEPT(b, slot, value)` to every acceptor.",
        "Each acceptor stores the entry durably (if `b` matches its promise) and replies `ACCEPTED`.",
        "When a majority has stored it, the leader marks the slot **committed** and applies it to the local state machine. It piggybacks the commit on the next ACCEPT so followers apply it too. That's one RTT per command.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why Phase 1 is amortised",
      text: "One Prepare covers all future slots. As long as the leader stays alive, you never run Phase 1 again — Prepare's cost is paid once per leader, not once per command. With a leader lasting hours, the per-command cost is essentially one Accept round-trip.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Leader-change recovery is the hard part",
      text: "A new leader's Promise messages might report different values for different slots (some had ACCEPTED on one acceptor but not a majority). The leader must fill those slots before serving new traffic — re-running Accept for each. Real implementations also handle log compaction, snapshots, and membership changes here, which is why \"Paxos Made Live\" is twice as long as \"Paxos Made Simple.\"",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Replicated state machines / logs** — exactly the job description. Google Chubby, Megastore, parts of Spanner, and many F1 components run Multi-Paxos.",
        "**Existing Paxos investment** — if your team already speaks Paxos, you keep the wisdom; the structure is the same, just amortised.",
        "**You want the smallest-possible message envelope** — a Phase-2-only Accept is roughly the minimum protocol for committed-by-majority replication.",
        "**You need the proven foundation** — Multi-Paxos has been formally verified, model-checked, and run at hyperscale for two decades.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You're picking a new replication library in 2026** — pick Raft. Same shape, friendlier to humans, more tooling.",
        "**Byzantine fault model** — Multi-Paxos assumes crash failures only. Use PBFT.",
        "**Single-decree only** — if you really do agree on exactly one value, Basic Paxos is enough.",
        "**You're new to the protocol and on a deadline** — the recovery edge cases (slot reconciliation, log gaps, membership changes) are where bugs live. Raft was designed exactly to make these easier.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Amortises the cost of Phase 1** — one Prepare per leader lifetime, then one Accept per command. Roughly half the latency of Basic Paxos.",
      "**No dueling-proposer livelock in steady state** — only the leader proposes; followers can't compete.",
      "**Same fault tolerance as Basic Paxos** — f failures of 2f+1 nodes.",
      "**Battle-tested at scale** — Google has run this in production for over twenty years.",
      "**Generalises cleanly** — Multi-Paxos is the structural template that Raft, ZAB, EPaxos, and Compartmentalised Paxos all build on.",
    ],
    cons: [
      "**Leader change is intricate** — slot reconciliation across the promise replies has fiddly edge cases that take care to implement.",
      "**Specification has more dark corners than Basic Paxos** — log compaction, snapshots, membership changes, leader leases — none of these are in the original paper.",
      "**Leader is a throughput bottleneck** — every write goes through it, so one node's CPU/network caps the cluster.",
      "**Brief unavailability during election** — bounded but real; clients see a few hundred ms of timeouts.",
      "**Harder to reason about than Raft** — same algorithm in essentials, but Raft's split into election + log replication is friendlier.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the one-time leader election",
      body: "Open the **Elect a leader** scenario. Step through Prepare → Promise → \"Leader set.\" That's the two-RTT Phase 1, paid exactly once. From here on, every command will be cheap.",
    },
    {
      title: "02 · Stream commands at one RTT each",
      body: "Switch to **Stream commands** (or stay on the same scenario after election). Hit the command buttons. Each command goes Leader → ACCEPT → majority ACCEPTED → Committed. One round-trip, no Prepare. Compare against Basic Paxos's two-RTT-per-value cost.",
    },
    {
      title: "03 · Crash the leader and watch failover",
      body: "Run **Crash the leader** at any point in steady state. The committed entries are safe (a majority still holds them). A survivor runs Phase 1 again with a higher ballot, becomes the new leader, and resumes streaming. This is the recovery story Multi-Paxos sells.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Try crashing the leader mid-command (after Accept but before Committed): the new leader must reconcile the pending slot. Try crashing again right after the new election. Try queueing four commands in a row to see throughput. The structural pattern — leader, slots, log, recovery — is identical to what you'll see next in Raft.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "multi_paxos.go",
      code: `// Multi-Paxos leader. Election is rare; the steady-state hot path is
// just Propose() which sends a single ACCEPT round-trip per command.

// External helpers (defined elsewhere):
//   func nextHigherBallot(ballot, myID int) int
//   func majority(n int) int
//   func collectPendingSlots(promises []*Promise) []PendingSlot
//   type Acceptor interface {
//       Prepare(ballot int) *Promise            // nil promise means NACK
//       Accept(ballot, slot int, value string) string // "ACCEPTED" or other
//   }
//   type PendingSlot struct { Slot int; Value string }

type LogEntry struct {
    Value     string
    Committed bool
}

type MultiPaxosLeader struct {
    acceptors []Acceptor
    myID      int
    ballot    int
    nextSlot  int
    log       []*LogEntry
}

func NewMultiPaxosLeader(acceptors []Acceptor, myID int) *MultiPaxosLeader {
    return &MultiPaxosLeader{
        acceptors: acceptors,
        myID:      myID,
        ballot:    0,
        nextSlot:  0,
    }
}

func (l *MultiPaxosLeader) ElectSelf() bool {
    l.ballot = nextHigherBallot(l.ballot, l.myID)

    // ONE prepare covers all future slots. Fan out concurrently.
    promises := make([]*Promise, len(l.acceptors))
    var wg sync.WaitGroup
    for i, a := range l.acceptors {
        wg.Add(1)
        go func(i int, a Acceptor) {
            defer wg.Done()
            promises[i] = a.Prepare(l.ballot)
        }(i, a)
    }
    wg.Wait()

    goodPromises := make([]*Promise, 0, len(promises))
    for _, p := range promises {
        if p != nil { // nil promise == NACK
            goodPromises = append(goodPromises, p)
        }
    }
    if len(goodPromises) < majority(len(l.acceptors)) {
        return false
    }

    // Reconcile partially-accepted slots: for each slot, if any promise
    // reported an acceptedV at any ballot, the leader MUST re-propose it.
    pendingSlots := collectPendingSlots(goodPromises)
    for _, ps := range pendingSlots {
        l.runAccept(ps.Slot, ps.Value)
        for len(l.log) <= ps.Slot {
            l.log = append(l.log, nil)
        }
        l.log[ps.Slot] = &LogEntry{Value: ps.Value, Committed: true}
    }
    l.nextSlot = len(l.log)
    return true // leader established; from here on, only Phase 2.
}

func (l *MultiPaxosLeader) Propose(value string) int {
    slot := l.nextSlot
    l.nextSlot++
    for len(l.log) <= slot {
        l.log = append(l.log, nil)
    }
    l.log[slot] = &LogEntry{Value: value, Committed: false}
    ok := l.runAccept(slot, value)
    if ok {
        l.log[slot].Committed = true
    }
    return slot
}

func (l *MultiPaxosLeader) runAccept(slot int, value string) bool {
    replies := make([]string, len(l.acceptors))
    var wg sync.WaitGroup
    for i, a := range l.acceptors {
        wg.Add(1)
        go func(i int, a Acceptor) {
            defer wg.Done()
            replies[i] = a.Accept(l.ballot, slot, value)
        }(i, a)
    }
    wg.Wait()

    accepted := 0
    for _, r := range replies {
        if r == "ACCEPTED" {
            accepted++
        }
    }
    return accepted >= majority(len(l.acceptors))
}

// Notice: hot path is one all-to-all ACCEPT and a quorum count. No
// Prepare. That's the whole point of Multi-Paxos.`,
    },
    {
      label: "Java",
      language: "java",
      filename: "MultiPaxos.java",
      code: `// Multi-Paxos leader. Election is rare; the steady-state hot path is
// just propose() which sends a single ACCEPT round-trip per command.

// External helpers (defined elsewhere):
//   static int nextHigherBallot(int ballot, int myId);
//   static int majority(int n);
//   static List<PendingSlot> collectPendingSlots(List<Promise> promises);
//   interface Acceptor {
//       Promise prepare(int ballot);                 // null promise means NACK
//       String  accept(int ballot, int slot, String value); // "ACCEPTED" or other
//   }
//   record PendingSlot(int slot, String value) {}

class LogEntry {
    String value;
    boolean committed;
    LogEntry(String value, boolean committed) {
        this.value = value;
        this.committed = committed;
    }
}

class MultiPaxosLeader {
    private final List<Acceptor> acceptors;
    private final int myId;
    private int ballot;
    private int nextSlot = 0;
    private final List<LogEntry> log = new ArrayList<>();

    MultiPaxosLeader(List<Acceptor> acceptors, int myId) {
        this.acceptors = acceptors;
        this.myId = myId;
        this.ballot = 0;
    }

    boolean electSelf() {
        ballot = nextHigherBallot(ballot, myId);

        // ONE prepare covers all future slots. Fan out concurrently.
        List<Promise> promises = acceptors.parallelStream()
            .map(a -> a.prepare(ballot))
            .collect(Collectors.toList());

        List<Promise> goodPromises = promises.stream()
            .filter(p -> p != null) // null promise == NACK
            .collect(Collectors.toList());
        if (goodPromises.size() < majority(acceptors.size())) return false;

        // Reconcile partially-accepted slots: for each slot, if any promise
        // reported an acceptedV at any ballot, the leader MUST re-propose it.
        List<PendingSlot> pendingSlots = collectPendingSlots(goodPromises);
        for (PendingSlot ps : pendingSlots) {
            runAccept(ps.slot(), ps.value());
            ensureSize(ps.slot());
            log.set(ps.slot(), new LogEntry(ps.value(), true));
        }
        nextSlot = log.size();
        return true;  // leader established; from here on, only Phase 2.
    }

    int propose(String value) {
        int slot = nextSlot++;
        ensureSize(slot);
        log.set(slot, new LogEntry(value, false));
        boolean ok = runAccept(slot, value);
        if (ok) log.get(slot).committed = true;
        return slot;
    }

    private boolean runAccept(int slot, String value) {
        List<String> replies = acceptors.parallelStream()
            .map(a -> a.accept(ballot, slot, value))
            .collect(Collectors.toList());
        long accepted = replies.stream()
            .filter("ACCEPTED"::equals)
            .count();
        return accepted >= majority(acceptors.size());
    }

    private void ensureSize(int slot) {
        while (log.size() <= slot) log.add(null);
    }
}

// Notice: hot path is one all-to-all ACCEPT and a quorum count. No
// Prepare. That's the whole point of Multi-Paxos.`,
    },
    {
      label: "Python",
      language: "python",
      filename: "multi_paxos.py",
      code: `# Multi-Paxos leader. Election is rare; the steady-state hot path is
# just propose() which sends a single ACCEPT round-trip per command.

# External helpers (defined elsewhere):
#   def next_higher_ballot(ballot: int, my_id: int) -> int
#   def majority(n: int) -> int
#   def collect_pending_slots(promises: list[Promise]) -> list[PendingSlot]
#   class Acceptor:
#       async def prepare(self, ballot: int) -> Promise | None  # None == NACK
#       async def accept(self, ballot: int, slot: int, value: str) -> str
#   PendingSlot = namedtuple("PendingSlot", ["slot", "value"])


@dataclass
class LogEntry:
    value: str
    committed: bool


class MultiPaxosLeader:
    def __init__(self, acceptors: list[Acceptor], my_id: int) -> None:
        self.acceptors = acceptors
        self.my_id = my_id
        self.ballot = 0
        self.next_slot = 0
        self.log: list[LogEntry | None] = []

    async def elect_self(self) -> bool:
        self.ballot = next_higher_ballot(self.ballot, self.my_id)

        # ONE prepare covers all future slots. Fan out concurrently.
        promises = await asyncio.gather(
            *(a.prepare(self.ballot) for a in self.acceptors)
        )
        good_promises = [p for p in promises if p is not None]  # None == NACK
        if len(good_promises) < majority(len(self.acceptors)):
            return False

        # Reconcile partially-accepted slots: for each slot, if any promise
        # reported an accepted_v at any ballot, the leader MUST re-propose it.
        pending_slots = collect_pending_slots(good_promises)
        for ps in pending_slots:
            await self._run_accept(ps.slot, ps.value)
            self._ensure_size(ps.slot)
            self.log[ps.slot] = LogEntry(value=ps.value, committed=True)
        self.next_slot = len(self.log)
        return True  # leader established; from here on, only Phase 2.

    async def propose(self, value: str) -> int:
        slot = self.next_slot
        self.next_slot += 1
        self._ensure_size(slot)
        self.log[slot] = LogEntry(value=value, committed=False)
        ok = await self._run_accept(slot, value)
        if ok:
            self.log[slot].committed = True
        return slot

    async def _run_accept(self, slot: int, value: str) -> bool:
        replies = await asyncio.gather(
            *(a.accept(self.ballot, slot, value) for a in self.acceptors)
        )
        accepted = sum(1 for r in replies if r == "ACCEPTED")
        return accepted >= majority(len(self.acceptors))

    def _ensure_size(self, slot: int) -> None:
        while len(self.log) <= slot:
            self.log.append(None)


# Notice: hot path is one all-to-all ACCEPT and a quorum count. No
# Prepare. That's the whole point of Multi-Paxos.`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "multi_paxos.cpp",
      code: `// Multi-Paxos leader. Election is rare; the steady-state hot path is
// just propose() which sends a single ACCEPT round-trip per command.

// External helpers (defined elsewhere):
//   int nextHigherBallot(int ballot, int myId);
//   int majority(int n);
//   std::vector<PendingSlot> collectPendingSlots(const std::vector<Promise>&);
//   struct Acceptor {
//       // returns std::nullopt to signal NACK
//       std::optional<Promise> prepare(int ballot);
//       std::string accept(int ballot, int slot, const std::string& value);
//   };
//   struct PendingSlot { int slot; std::string value; };

struct LogEntry {
    std::string value;
    bool committed;
};

class MultiPaxosLeader {
public:
    MultiPaxosLeader(std::vector<Acceptor> acceptors, int myId)
        : acceptors_(std::move(acceptors)), myId_(myId), ballot_(0),
          nextSlot_(0) {}

    bool electSelf() {
        ballot_ = nextHigherBallot(ballot_, myId_);

        // ONE prepare covers all future slots. Fan out concurrently.
        std::vector<std::future<std::optional<Promise>>> futures;
        for (auto& a : acceptors_) {
            futures.push_back(std::async(std::launch::async,
                [&a, this] { return a.prepare(ballot_); }));
        }

        std::vector<Promise> goodPromises;
        for (auto& f : futures) {
            auto p = f.get();
            if (p.has_value()) {           // nullopt == NACK
                goodPromises.push_back(*p);
            }
        }
        if (static_cast<int>(goodPromises.size())
                < majority(static_cast<int>(acceptors_.size()))) {
            return false;
        }

        // Reconcile partially-accepted slots: for each slot, if any promise
        // reported an acceptedV at any ballot, the leader MUST re-propose it.
        auto pendingSlots = collectPendingSlots(goodPromises);
        for (const auto& ps : pendingSlots) {
            runAccept(ps.slot, ps.value);
            ensureSize(ps.slot);
            log_[ps.slot] = LogEntry{ps.value, true};
        }
        nextSlot_ = static_cast<int>(log_.size());
        return true;  // leader established; from here on, only Phase 2.
    }

    int propose(const std::string& value) {
        int slot = nextSlot_++;
        ensureSize(slot);
        log_[slot] = LogEntry{value, false};
        bool ok = runAccept(slot, value);
        if (ok) log_[slot]->committed = true;
        return slot;
    }

private:
    bool runAccept(int slot, const std::string& value) {
        std::vector<std::future<std::string>> futures;
        for (auto& a : acceptors_) {
            futures.push_back(std::async(std::launch::async,
                [&a, this, slot, &value] {
                    return a.accept(ballot_, slot, value);
                }));
        }

        int accepted = 0;
        for (auto& f : futures) {
            if (f.get() == "ACCEPTED") ++accepted;
        }
        return accepted >= majority(static_cast<int>(acceptors_.size()));
    }

    void ensureSize(int slot) {
        while (static_cast<int>(log_.size()) <= slot) {
            log_.push_back(std::nullopt);
        }
    }

    std::vector<Acceptor> acceptors_;
    int myId_;
    int ballot_;
    int nextSlot_;
    std::vector<std::optional<LogEntry>> log_;
};

// Notice: hot path is one all-to-all ACCEPT and a quorum count. No
// Prepare. That's the whole point of Multi-Paxos.`,
    },
  ],

  furtherReading: [
    {
      label: "Leslie Lamport — *Paxos Made Simple* (2001)",
      href: "https://lamport.azurewebsites.net/pubs/paxos-simple.pdf",
      note: "Section 3 introduces \"Implementing a State Machine,\" which is Multi-Paxos in three paragraphs. The starting point.",
      kind: "paper",
    },
    {
      label: "Tushar Chandra, Robert Griesemer & Joshua Redstone — *Paxos Made Live* (2007)",
      href: "https://www.cs.utexas.edu/users/lorenzo/corsi/cs380d/papers/paper2-1.pdf",
      note: "Google's experience building Chubby on Multi-Paxos. Everything the textbook elides — leases, membership changes, snapshots, the bugs they hit, the tooling they wrote.",
      kind: "paper",
    },
    {
      label: "Robbert van Renesse & Deniz Altinbuken — *Paxos Made Moderately Complex* (2015)",
      href: "https://www.cs.cornell.edu/courses/cs7412/2011sp/paxos.pdf",
      note: "The most complete pseudocode-level treatment of Multi-Paxos with replicas, leaders, acceptors. The pragmatic reference.",
      kind: "paper",
    },
    {
      label: "Diego Ongaro — *Consensus: Bridging Theory and Practice* (2014)",
      href: "https://github.com/ongardie/dissertation/raw/master/online.pdf",
      note: "Chapter 11 walks through Multi-Paxos in Raft's vocabulary and shows the structural equivalence — the clearest comparison side-by-side.",
      kind: "paper",
    },
    {
      label: "Heidi Howard — *Distributed Consensus Revised* (PhD, 2019)",
      href: "https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-935.pdf",
      note: "A unifying view of Multi-Paxos, Raft, Vertical Paxos, and Flexible Paxos. Shows they're variations on the same skeleton.",
      kind: "paper",
    },
    {
      label: "Heidi Howard — *Paxos vs Raft: have we reached consensus on distributed consensus?* (PaPoC 2020)",
      href: "https://arxiv.org/abs/2004.05074",
      note: "A direct comparison of Multi-Paxos and Raft showing that their differences are largely cosmetic; pick the one your team understands.",
      kind: "paper",
    },
  ],

  quiz: [
    {
      id: "mp-q1",
      question:
        "What's the central optimisation Multi-Paxos makes over running Basic Paxos repeatedly?",
      options: [
        { id: "a", label: "It uses TCP instead of UDP." },
        { id: "b", label: "It elects a stable leader once, then skips Phase 1 (Prepare/Promise) for every subsequent command." },
        { id: "c", label: "It requires fewer acceptors." },
        { id: "d", label: "It eliminates the safety rule, so the leader can always use its own value." },
      ],
      correctOptionId: "b",
      explanation:
        "Multi-Paxos's one big idea: one Prepare locks in a ballot covering *all future slots*. While that leader is alive, every command costs one round-trip (Accept only). Phase 1 is paid once per leadership, not once per command — that's where the 2× latency win comes from.",
    },
    {
      id: "mp-q2",
      question:
        "A new Multi-Paxos leader has just won election. Its promises report that one acceptor has an ACCEPTED entry for slot 7 but no other acceptor knows about it. What must the leader do?",
      options: [
        { id: "a", label: "Discard it — only the majority counts." },
        { id: "b", label: "Re-run ACCEPT for slot 7 with that value before serving any new commands — it might already be chosen elsewhere." },
        { id: "c", label: "Restart the election." },
        { id: "d", label: "Treat slot 7 as committed without further messages." },
      ],
      correctOptionId: "b",
      explanation:
        "This is the slot-reconciliation rule. The leader cannot know whether that value was eventually accepted by a majority before the old leader died. Paxos's safety invariant forces it to re-propose the same value, not invent a new one — otherwise it might overwrite a committed value. After reconciliation it's free to serve new commands.",
    },
    {
      id: "mp-q3",
      question:
        "Multi-Paxos and Raft share the same essential structure. Which of the following is the cleanest summary of the difference?",
      options: [
        { id: "a", label: "Raft tolerates more failures." },
        { id: "b", label: "Raft uses a different fault model (Byzantine vs crash)." },
        { id: "c", label: "Raft separates the algorithm into leader election + log replication + safety in a way that's easier to teach and implement, but the underlying mechanics are equivalent." },
        { id: "d", label: "Multi-Paxos doesn't need durable storage." },
      ],
      correctOptionId: "c",
      explanation:
        "Howard and Ongaro have shown the two protocols are essentially the same algorithm with different pedagogy. Multi-Paxos is older and more flexible; Raft is structurally identical but its three-part decomposition is what made it the default choice in modern systems.",
    },
  ],
};
