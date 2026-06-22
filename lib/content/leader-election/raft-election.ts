import type { ConceptContent } from "@/lib/content/types";

export const raftElection: ConceptContent = {
  prototypeCaption:
    "Five servers running Raft elections. Pick a scenario — **Election timeout** (the leader crashes, a follower's randomized timer fires, it wins a majority), **Split vote** (two candidates start in the same term, neither gets quorum, a new term begins with randomized backoff), or **Stale leader returns** (a partitioned old leader rejoins with an outdated term and steps down). Free play lets you crash any server and trigger elections; the log card below holds only the last two messages.",

  overview: [
    {
      type: "p",
      text: "**Raft-style election** is the leader-election half of the Raft consensus algorithm — extracted here on its own because every modern replicated system uses some variant of it. The idea: each server runs a **randomized election timer** (commonly 150–300 ms). Whoever's timer fires first becomes a **Candidate**, advances to the next **term**, and asks every other server for a vote. Whoever wins a **majority** of votes is the new Leader for that term. Heartbeats from the Leader reset everyone else's timers, so as long as the Leader is alive, no election happens.",
    },
    {
      type: "p",
      text: "Three properties give Raft election its production-grade safety. **Terms** are a monotonically increasing integer; every message carries the term, and any server seeing a higher term immediately steps down. **At most one leader per term** falls out of \"each server votes at most once per term and only with a quorum.\" **Election restriction:** a server only grants its vote to a candidate whose log is at least as up-to-date as its own — which is what guarantees committed entries survive across leader changes. The ID does not pick the winner; timing, term, and log freshness do.",
    },
    {
      type: "p",
      text: "Random timeouts are the trick that defeats split votes. If every server picked the same timeout, two would routinely fire together and split the vote in half forever. Randomising across a window means the *first* timer to expire usually wins outright; even when two do fire close together, the next round randomises them apart. This is how Raft elections converge in O(1) rounds in practice. The whole election protocol fits in two RPCs: RequestVote and the heartbeat-style AppendEntries.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Roles and the election timer" },
    {
      type: "ul",
      items: [
        "**Follower** — passive; expects heartbeats from the Leader. Maintains a randomized election timer (typical: 150–300 ms).",
        "**Candidate** — a follower whose timer expired. Has just incremented its term and is asking for votes.",
        "**Leader** — won a majority of votes; sends periodic heartbeats to reset all followers' timers and stay in power.",
        "**Term** — a monotonically increasing integer attached to every message. Higher term always wins; servers seeing a stale term reject the message.",
      ],
    },
    { type: "h", text: "The protocol" },
    {
      type: "ol",
      items: [
        "Leader L sends heartbeats every ~50 ms. Each heartbeat resets every follower's election timer.",
        "If a follower's timer fires (≈ Leader is gone), it transitions to Candidate, increments the term, votes for itself, and sends `RequestVote(term, lastLogIndex, lastLogTerm)` to every other server.",
        "Each server votes **at most once per term**. It grants the vote only if (a) it hasn't voted this term, and (b) the candidate's log is at least as up-to-date as its own.",
        "If the Candidate collects votes from a majority (e.g. 3 of 5), it becomes Leader and starts sending heartbeats — the election is over.",
        "If two Candidates split the vote and neither wins, the term ends without a Leader. Followers' timers fire again with new random values; whoever fires first next round is much more likely to win cleanly.",
        "If a Candidate receives a message with a higher term, it immediately steps down to Follower for that term — the future has already happened without it.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Majority is what kills split-brain",
      text: "Even if the network partitions and both sides try to elect a Leader, only the side with a strict majority can succeed. The minority side runs Candidates that never collect enough votes; they remain stuck in the election loop until they can reach the majority again. That's why Raft is safe across partitions and Bully isn't — the quorum requirement makes \"at most one leader per term\" mechanical, not optimistic.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The up-to-date log rule",
      text: "When choosing between two candidates, a follower picks the one whose log is at least as up-to-date as its own. The rule: \"the candidate with the higher last-log-term wins; if tied, the longer log wins.\" This Election Restriction is what guarantees previously committed entries are never lost — only candidates whose log already contains every committed entry can win a majority. It's the safety lemma that makes the whole Raft state machine correct.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Replicated state machine over an unreliable network** — Raft election + log replication is the default in 2026 (etcd, Consul, CockroachDB, TiKV, Kafka KRaft).",
        "**You need at-most-one leader per term, even across partitions** — the quorum rule makes split-brain impossible by construction.",
        "**You want a fence token for safe writes** — every Raft write carries the term; followers reject writes from stale terms automatically.",
        "**Team needs to onboard quickly** — Raft's three-state diagram and two RPCs are explicitly engineered for understandability.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Singleton job on top of an existing strongly-consistent store** — use lease-based election against etcd/Kubernetes instead of running your own Raft cluster.",
        "**Very small static cluster on a trusted LAN** — Bully or Ring may be enough, with much less code.",
        "**Byzantine fault model** — Raft assumes crash failures only. Use PBFT or HotStuff if nodes might actively lie.",
        "**You need leaderless writes** — Raft funnels everything through the leader. EPaxos, Mencius, or Generalized Paxos remove that bottleneck.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Provably at-most-one leader per term** — the quorum rule plus monotonic terms eliminate split-brain.",
      "**Fast failover** — bounded by the election timeout (typically 100–500 ms).",
      "**Built-in fence token** — the term is the epoch; old leaders' writes are automatically rejected.",
      "**Random timeouts solve split votes** — converges in O(1) rounds in practice.",
      "**Mature library ecosystem** — etcd/raft, hashicorp/raft, Apache Ratis, TiKV, OpenRaft, and dozens more.",
    ],
    cons: [
      "**Brief unavailability on leader failure** — the cluster cannot accept writes during the election window.",
      "**Leader is a write bottleneck** — every write funnels through it; throughput caps at one node's resources.",
      "**Higher message complexity than lease-based on a strongly-consistent store** — needs O(n) RequestVotes per election even when an external lock would do.",
      "**Quorum requirement** — a cluster of 5 tolerates 2 failures; 3 tolerates 1. You pay even-number nodes for nothing.",
      "**Hard to get right from scratch** — Raft is the *most understandable* consensus algorithm, but \"understandable\" is not the same as \"easy to implement.\" Use a library.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk Election timeout",
      body: "Open **Election timeout** and step through. The Leader (S1) crashes; heartbeats stop. S2's randomized timer fires first, S2 becomes a Candidate, advances to term 2, votes for itself, and sends RequestVote to the rest. S3/S4/S5 grant their votes (no one else has voted this term, and the logs match). S2 reaches 3 of 5, becomes Leader, and starts sending heartbeats. Notice that the ID didn't pick the winner — the *timer* did.",
    },
    {
      title: "02 · Walk Split vote",
      body: "Run **Split vote**. The Leader crashes and S2 and S4 happen to time out at almost the same instant. Both become Candidates for term 2. S3 votes for S2; S5 votes for S4. Each Candidate has 2 votes — less than the majority of 3. Term 2 ends without a Leader. New random timers fire in term 3; this time only one Candidate appears and wins cleanly. The random timeout window is the entire mechanism that breaks the deadlock.",
    },
    {
      title: "03 · Walk Stale leader returns",
      body: "Run **Stale leader returns**. The Leader S1 is partitioned away in term 1. The majority side elects S2 in term 2. The partition heals. S1 tries to send heartbeats with term 1; every server replies \"I have seen term 2\" and S1 immediately steps down to Follower for term 2. The monotonic term is the fence token: an old leader cannot quietly resume control. This is the safety property Bully and Ring lack.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Trigger elections manually, crash any server, and try to engineer a partition where you'd expect two leaders to appear. They won't — because the minority side cannot reach a quorum, the Candidate on the minority side just keeps re-trying without success. Try splitting 2 vs 3 nodes: the 3-node side elects, the 2-node side spins. That mechanical safety is the whole reason Raft displaced Bully and Ring for serious replicated systems.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "raft_election.go",
      code: `// Raft-style leader election. Two RPCs: RequestVote (election) and AppendEntries (heartbeat).
package election

import (
	"math/rand"
	"time"
)

type Role int

const (
	Follower Role = iota
	Candidate
	Leader
)

type ServerID = int

type LogEntry struct {
	Term int
	Cmd  string
}

type VoteReply struct {
	Term    int
	Granted bool
}

type RaftElectionServer struct {
	ID          ServerID
	Peers       []ServerID
	CurrentTerm int
	VotedFor    *ServerID
	role        Role
	Log         []LogEntry

	rpc func(to ServerID, kind string, args any) VoteReply
	now func() int64 // unix millis

	electionDeadline int64
}

// ResetElectionTimer sets a randomized 150-300ms timer; reset on heartbeat.
func (s *RaftElectionServer) ResetElectionTimer() {
	s.electionDeadline = s.now() + 150 + rand.Int63n(150)
}

// OnAppendEntries is called by AppendEntries (heartbeat) from current leader.
func (s *RaftElectionServer) OnAppendEntries(term int, leaderID ServerID) (int, bool) {
	if term < s.CurrentTerm {
		return s.CurrentTerm, false
	}
	if term > s.CurrentTerm {
		s.CurrentTerm = term
		s.VotedFor = nil
	}
	s.role = Follower
	s.ResetElectionTimer()
	return s.CurrentTerm, true
}

// StartElection is called when our election timer fires.
func (s *RaftElectionServer) StartElection() {
	s.role = Candidate
	s.CurrentTerm++
	s.VotedFor = &s.ID
	votes := 1 // myself
	myLastIdx := len(s.Log) - 1
	myLastTerm := 0
	if len(s.Log) > 0 {
		myLastTerm = s.Log[len(s.Log)-1].Term
	}

	for _, p := range s.Peers {
		r := s.rpc(p, "RequestVote", map[string]int{
			"term": s.CurrentTerm, "candidateId": s.ID,
			"lastLogIndex": myLastIdx, "lastLogTerm": myLastTerm,
		})
		if r.Term > s.CurrentTerm {
			s.CurrentTerm = r.Term
			s.role = Follower
			return
		}
		if r.Granted {
			votes++
		}
	}

	if votes >= len(s.Peers)/2+2 { // majority of (peers + self)
		s.role = Leader
		// start sending heartbeats
	} else {
		// split vote or lost - wait for next randomized timeout
		s.role = Follower
		s.ResetElectionTimer()
	}
}

// OnRequestVote is called when a peer sends us RequestVote.
func (s *RaftElectionServer) OnRequestVote(
	term, candidateID, lastLogIndex, lastLogTerm int,
) VoteReply {
	if term > s.CurrentTerm {
		s.CurrentTerm = term
		s.VotedFor = nil
		s.role = Follower
	}
	myLastIdx := len(s.Log) - 1
	myLastTerm := 0
	if len(s.Log) > 0 {
		myLastTerm = s.Log[len(s.Log)-1].Term
	}
	upToDate := lastLogTerm > myLastTerm ||
		(lastLogTerm == myLastTerm && lastLogIndex >= myLastIdx)
	free := s.VotedFor == nil || *s.VotedFor == candidateID
	grant := term == s.CurrentTerm && free && upToDate
	if grant {
		s.VotedFor = &candidateID
		s.ResetElectionTimer()
	}
	return VoteReply{Term: s.CurrentTerm, Granted: grant}
}

var _ = time.Now`,
    },
    {
      label: "Java",
      language: "java",
      filename: "RaftElection.java",
      code: `// Raft-style leader election. Two RPCs: RequestVote (election) and AppendEntries (heartbeat).
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.LongSupplier;

class RaftElectionServer {
    enum Role { FOLLOWER, CANDIDATE, LEADER }

    record LogEntry(int term, String cmd) {}
    record VoteReply(int term, boolean granted) {}

    interface Rpc {
        VoteReply call(int to, String kind, RequestVoteArgs args);
    }
    record RequestVoteArgs(int term, int candidateId, int lastLogIndex, int lastLogTerm) {}

    final int id;
    final List<Integer> peers;
    int currentTerm = 0;
    Integer votedFor = null;
    Role role = Role.FOLLOWER;
    final List<LogEntry> log = new ArrayList<>();

    private final Rpc rpc;
    private final LongSupplier now;
    private long electionDeadline = 0;

    RaftElectionServer(int id, List<Integer> peers, Rpc rpc, LongSupplier now) {
        this.id = id;
        this.peers = peers;
        this.rpc = rpc;
        this.now = now;
    }

    /** Randomized 150-300ms timer; reset on heartbeat. */
    void resetElectionTimer() {
        electionDeadline = now.getAsLong() + 150 + ThreadLocalRandom.current().nextInt(150);
    }

    /** Called by AppendEntries (heartbeat) from current leader. */
    VoteReply onAppendEntries(int term, int leaderId) {
        if (term < currentTerm) return new VoteReply(currentTerm, false);
        if (term > currentTerm) { currentTerm = term; votedFor = null; }
        role = Role.FOLLOWER;
        resetElectionTimer();
        return new VoteReply(currentTerm, true);
    }

    /** Called when our election timer fires. */
    void startElection() {
        role = Role.CANDIDATE;
        currentTerm++;
        votedFor = id;
        int votes = 1; // myself
        int myLastIdx = log.size() - 1;
        int myLastTerm = log.isEmpty() ? 0 : log.get(log.size() - 1).term();

        for (int p : peers) {
            VoteReply r;
            try {
                r = rpc.call(p, "RequestVote",
                    new RequestVoteArgs(currentTerm, id, myLastIdx, myLastTerm));
            } catch (Exception e) {
                r = new VoteReply(currentTerm, false);
            }
            if (r.term() > currentTerm) { currentTerm = r.term(); role = Role.FOLLOWER; return; }
            if (r.granted()) votes++;
        }

        if (votes >= (peers.size() + 1) / 2 + 1) {
            role = Role.LEADER;
            // start sending heartbeats
        } else {
            // split vote or lost - wait for next randomized timeout
            role = Role.FOLLOWER;
            resetElectionTimer();
        }
    }

    /** Called when a peer sends us RequestVote. */
    VoteReply onRequestVote(int term, int candidateId, int lastLogIndex, int lastLogTerm) {
        if (term > currentTerm) { currentTerm = term; votedFor = null; role = Role.FOLLOWER; }
        int myLastIdx = log.size() - 1;
        int myLastTerm = log.isEmpty() ? 0 : log.get(log.size() - 1).term();
        boolean upToDate = lastLogTerm > myLastTerm
            || (lastLogTerm == myLastTerm && lastLogIndex >= myLastIdx);
        boolean free = votedFor == null || votedFor == candidateId;
        boolean grant = term == currentTerm && free && upToDate;
        if (grant) { votedFor = candidateId; resetElectionTimer(); }
        return new VoteReply(currentTerm, grant);
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "raft_election.py",
      code: `# Raft-style leader election. Two RPCs: RequestVote (election) and AppendEntries (heartbeat).
import random
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Callable, Optional


class Role(Enum):
    FOLLOWER = "follower"
    CANDIDATE = "candidate"
    LEADER = "leader"


@dataclass
class LogEntry:
    term: int
    cmd: str


@dataclass
class VoteReply:
    term: int
    granted: bool


class RaftElectionServer:
    def __init__(
        self,
        id: int,
        peers: list[int],
        rpc: Callable[[int, str, dict], VoteReply],
        now: Callable[[], float] = time.monotonic,
    ) -> None:
        self.id = id
        self.peers = peers
        self.rpc = rpc
        self.now = now
        self.current_term = 0
        self.voted_for: Optional[int] = None
        self.role = Role.FOLLOWER
        self.log: list[LogEntry] = []
        self.election_deadline = 0.0

    def reset_election_timer(self) -> None:
        """Randomized 150-300ms timer; reset on heartbeat."""
        self.election_deadline = self.now() + 0.150 + random.random() * 0.150

    def on_append_entries(self, term: int, leader_id: int) -> VoteReply:
        """Called by AppendEntries (heartbeat) from current leader."""
        if term < self.current_term:
            return VoteReply(self.current_term, False)
        if term > self.current_term:
            self.current_term = term
            self.voted_for = None
        self.role = Role.FOLLOWER
        self.reset_election_timer()
        return VoteReply(self.current_term, True)

    def start_election(self) -> None:
        """Called when our election timer fires."""
        self.role = Role.CANDIDATE
        self.current_term += 1
        self.voted_for = self.id
        votes = 1  # myself
        my_last_idx = len(self.log) - 1
        my_last_term = self.log[-1].term if self.log else 0

        for p in self.peers:
            try:
                r = self.rpc(p, "RequestVote", {
                    "term": self.current_term, "candidateId": self.id,
                    "lastLogIndex": my_last_idx, "lastLogTerm": my_last_term,
                })
            except Exception:
                r = VoteReply(self.current_term, False)
            if r.term > self.current_term:
                self.current_term = r.term
                self.role = Role.FOLLOWER
                return
            if r.granted:
                votes += 1

        if votes >= (len(self.peers) + 1) // 2 + 1:
            self.role = Role.LEADER
            # start sending heartbeats
        else:
            # split vote or lost - wait for next randomized timeout
            self.role = Role.FOLLOWER
            self.reset_election_timer()

    def on_request_vote(
        self, term: int, candidate_id: int, last_log_index: int, last_log_term: int
    ) -> VoteReply:
        """Called when a peer sends us RequestVote."""
        if term > self.current_term:
            self.current_term = term
            self.voted_for = None
            self.role = Role.FOLLOWER
        my_last_idx = len(self.log) - 1
        my_last_term = self.log[-1].term if self.log else 0
        up_to_date = last_log_term > my_last_term or (
            last_log_term == my_last_term and last_log_index >= my_last_idx
        )
        free = self.voted_for is None or self.voted_for == candidate_id
        grant = term == self.current_term and free and up_to_date
        if grant:
            self.voted_for = candidate_id
            self.reset_election_timer()
        return VoteReply(self.current_term, grant)`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "raft_election.cpp",
      code: `// Raft-style leader election. Two RPCs: RequestVote (election) and AppendEntries (heartbeat).
#include <functional>
#include <optional>
#include <random>
#include <string>
#include <vector>

using ServerId = int;

enum class Role { Follower, Candidate, Leader };

struct LogEntry {
    int term;
    std::string cmd;
};

struct VoteReply {
    int term;
    bool granted;
};

struct RequestVoteArgs {
    int term;
    int candidateId;
    int lastLogIndex;
    int lastLogTerm;
};

class RaftElectionServer {
public:
    int currentTerm = 0;
    std::optional<ServerId> votedFor;
    Role role = Role::Follower;
    std::vector<LogEntry> log;

    RaftElectionServer(ServerId id, std::vector<ServerId> peers,
                       std::function<VoteReply(ServerId, std::string, RequestVoteArgs)> rpc,
                       std::function<long long()> now)
        : id_(id), peers_(std::move(peers)),
          rpc_(std::move(rpc)), now_(std::move(now)), rng_(std::random_device{}()) {}

    // Randomized 150-300ms timer; reset on heartbeat.
    void resetElectionTimer() {
        std::uniform_int_distribution<int> jitter(0, 149);
        electionDeadline_ = now_() + 150 + jitter(rng_);
    }

    // Called by AppendEntries (heartbeat) from current leader.
    VoteReply onAppendEntries(int term, ServerId leaderId) {
        if (term < currentTerm) return {currentTerm, false};
        if (term > currentTerm) { currentTerm = term; votedFor.reset(); }
        role = Role::Follower;
        resetElectionTimer();
        return {currentTerm, true};
    }

    // Called when our election timer fires.
    void startElection() {
        role = Role::Candidate;
        currentTerm++;
        votedFor = id_;
        int votes = 1; // myself
        int myLastIdx = static_cast<int>(log.size()) - 1;
        int myLastTerm = log.empty() ? 0 : log.back().term;

        for (ServerId p : peers_) {
            VoteReply r = rpc_(p, "RequestVote",
                {currentTerm, id_, myLastIdx, myLastTerm});
            if (r.term > currentTerm) { currentTerm = r.term; role = Role::Follower; return; }
            if (r.granted) votes++;
        }

        if (votes >= static_cast<int>(peers_.size() + 1) / 2 + 1) {
            role = Role::Leader;
            // start sending heartbeats
        } else {
            // split vote or lost - wait for next randomized timeout
            role = Role::Follower;
            resetElectionTimer();
        }
    }

    // Called when a peer sends us RequestVote.
    VoteReply onRequestVote(int term, ServerId candidateId,
                            int lastLogIndex, int lastLogTerm) {
        if (term > currentTerm) {
            currentTerm = term; votedFor.reset(); role = Role::Follower;
        }
        int myLastIdx = static_cast<int>(log.size()) - 1;
        int myLastTerm = log.empty() ? 0 : log.back().term;
        bool upToDate = lastLogTerm > myLastTerm
            || (lastLogTerm == myLastTerm && lastLogIndex >= myLastIdx);
        bool free = !votedFor.has_value() || *votedFor == candidateId;
        bool grant = term == currentTerm && free && upToDate;
        if (grant) { votedFor = candidateId; resetElectionTimer(); }
        return {currentTerm, grant};
    }

private:
    ServerId id_;
    std::vector<ServerId> peers_;
    std::function<VoteReply(ServerId, std::string, RequestVoteArgs)> rpc_;
    std::function<long long()> now_;
    std::mt19937 rng_;
    long long electionDeadline_ = 0;
};`,
    },
  ],

  furtherReading: [
    {
      label: "Diego Ongaro & John Ousterhout — *In Search of an Understandable Consensus Algorithm (Extended Version)* (2014)",
      href: "https://raft.github.io/raft.pdf",
      note: "The Raft paper. The leader election section (§5.2) covers everything in this concept in four pages of prose. Read it cover-to-cover.",
      kind: "paper",
    },
    {
      label: "The Raft website — animated visualisation",
      href: "https://raft.github.io/",
      note: "Click \"Visualization\" — drag the timers, kill servers, watch elections happen in real time. The fastest way to internalise the randomized-timeout dynamic.",
      kind: "docs",
    },
    {
      label: "The Secret Lives of Data — Raft visualisation",
      href: "https://thesecretlivesofdata.com/raft/",
      note: "Scroll-driven storybook that walks through election and replication. Pair it with the paper for first-time learners.",
      kind: "article",
    },
    {
      label: "Diego Ongaro — *Consensus: Bridging Theory and Practice* (PhD, 2014)",
      href: "https://github.com/ongardie/dissertation/raw/master/online.pdf",
      note: "Ongaro's thesis. Chapter on leader election goes into PreVote, the split-vote analysis, and election-timing recommendations far beyond the paper.",
      kind: "paper",
    },
    {
      label: "etcd Raft library — leader election internals",
      href: "https://github.com/etcd-io/raft/blob/main/raft.go",
      note: "The reference Go implementation. Search for `becomeCandidate`, `campaign`, `poll` — production code is more interesting than pseudocode.",
      kind: "docs",
    },
    {
      label: "Heidi Howard & Richard Mortier — *Paxos vs Raft: have we reached consensus?* (PaPoC 2020)",
      href: "https://arxiv.org/abs/2004.05074",
      note: "Side-by-side comparison showing Raft and Multi-Paxos elections are structurally equivalent. Useful background when choosing between protocol families.",
      kind: "paper",
    },
    {
      label: "Henrik Ingo — *Why does Raft need a randomised election timeout?*",
      href: "https://www.openlife.cc/blogs/2020/may/why-does-raft-need-randomised-election-timeout",
      note: "Compact blog post on the split-vote problem and why randomisation is sufficient — without needing PreVote or PriVote in most clusters.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "raft-elect-q1",
      question: "What triggers a follower to become a candidate?",
      options: [
        { id: "a", label: "Its ID is the highest in the cluster." },
        { id: "b", label: "A randomized election timer expires without receiving a heartbeat." },
        { id: "c", label: "An administrator manually promotes it." },
        { id: "d", label: "It accumulates more log entries than the leader." },
      ],
      correctOptionId: "b",
      explanation:
        "Followers expect periodic heartbeats from the leader. If no heartbeat arrives before the randomized election timer fires (typically 150–300 ms), the follower transitions to Candidate, advances the term, votes for itself, and sends RequestVote to every other server.",
    },
    {
      id: "raft-elect-q2",
      question:
        "Two candidates start an election in the same term, and neither collects a majority. What happens next?",
      options: [
        { id: "a", label: "The cluster picks the lower ID as the tie-breaker." },
        { id: "b", label: "The term ends with no leader; new randomized timers fire, and a new election begins in the next term." },
        { id: "c", label: "Both candidates become co-leaders for that term." },
        { id: "d", label: "The cluster halts and requires manual intervention." },
      ],
      correctOptionId: "b",
      explanation:
        "A split vote leaves the term with no leader. Each Candidate steps down, randomized timers fire again in the next term, and the *first* server to expire typically wins outright. Random timeouts are the entire mechanism that solves split votes; no special tie-breaker is needed.",
    },
    {
      id: "raft-elect-q3",
      question:
        "Why does Raft election survive network partitions safely?",
      options: [
        { id: "a", label: "Because it uses TCP." },
        { id: "b", label: "Because every server has a unique ID." },
        { id: "c", label: "Because a candidate must collect a quorum of votes, and at most one side of a partition can hold a strict majority." },
        { id: "d", label: "Because the leader's heartbeats automatically reach across partitions." },
      ],
      correctOptionId: "c",
      explanation:
        "The majority requirement is the safety mechanism. In any partition, at most one side can have a strict majority of nodes; only that side can elect a leader. The minority side runs candidates that never win, so it cannot accept writes until the partition heals. This is what Bully and Ring lack.",
    },
  ],
};
