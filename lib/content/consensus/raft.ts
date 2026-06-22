import type { ConceptContent } from "@/lib/content/types";

export const raft: ConceptContent = {
  prototypeCaption:
    "Five servers running Raft. Pick a scenario — **Leader election** (a follower times out, requests votes, becomes leader), **Replicate a command** (one RTT of AppendEntries), or **Crash the leader** to see a new term begin. Free play queues commands and lets you crash whenever; the log card below holds only the last two messages.",

  overview: [
    {
      type: "p",
      text: "**Raft** is Multi-Paxos rewritten so humans can understand it. Diego Ongaro and John Ousterhout published it in 2014 (\"In Search of an Understandable Consensus Algorithm\") with one explicit design goal: make the protocol *teachable*. They split consensus into three independent sub-problems — **leader election**, **log replication**, and **safety** — and built each one so its rules can be stated in a couple of sentences. The result became the default consensus algorithm of the 2020s.",
    },
    {
      type: "p",
      text: "Every server is in one of three states: **Follower** (passive, takes orders), **Candidate** (running for leader), or **Leader** (the one issuing commands). Time is divided into **terms** — a monotonically increasing integer. Each term has at most one leader. Followers know about the leader by receiving heartbeats; if heartbeats stop arriving, a follower's election timer fires and it becomes a candidate, increments the term, and asks for votes.",
    },
    {
      type: "p",
      text: "Once elected, the leader replicates client commands by appending them to its log and sending `AppendEntries` to every follower. When a majority has stored an entry, the leader marks it **committed** and applies it to the state machine. Followers learn about the commit via the next AppendEntries. That's it. The whole protocol — election + replication + a small safety rule on which logs are allowed to win elections — fits on a single diagram. That's why etcd, Consul, CockroachDB, TiDB, Kafka's KRaft, and dozens of other systems all ship it.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Leader election" },
    {
      type: "ol",
      items: [
        "Followers expect a heartbeat (an empty AppendEntries from the leader) every ~50ms. If their election timer (randomized between 150–300ms) fires first, they become a Candidate.",
        "Candidate: increment term, vote for self, send `RequestVote(term, lastLogIndex, lastLogTerm)` to every other server.",
        "Each server votes YES at most **once per term**, and only for a candidate whose log is **at least as up-to-date** as its own. The up-to-date test is: later term wins; same term, longer log wins.",
        "If the candidate gets votes from a majority, it becomes leader and starts sending heartbeats. If it sees a higher term or another leader, it reverts to follower. If no winner (split vote), election times out and a new term begins with randomized backoff.",
      ],
    },
    { type: "h", text: "Log replication" },
    {
      type: "ol",
      items: [
        "Client sends a command to the leader. Leader appends `(term, index, command)` to its log.",
        "Leader sends `AppendEntries` to every follower, carrying the new entry plus `prevLogIndex/prevLogTerm` for consistency check.",
        "Follower accepts only if its log matches up to `prevLogIndex/prevLogTerm`. On mismatch, the leader decrements `nextIndex` for that follower and retries — that's how out-of-date followers catch up.",
        "When the leader sees the entry stored on a majority, it advances `commitIndex` and applies the entry to its state machine. Followers learn the new `commitIndex` from the next AppendEntries and apply too.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "The two safety rules in one paragraph",
      text: "**Election restriction:** a server only grants its vote to a candidate whose log is at least as up-to-date as its own. **Leader completeness:** if an entry is committed in term T, every leader of any term ≥ T has that entry in its log. Together these guarantee that committed entries are never lost, even across arbitrary leader changes.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The one tricky case — committing entries from prior terms",
      text: "A new leader cannot directly commit an entry from a previous term just because it's replicated on a majority — doing so could overwrite a committed entry in a corner case (Figure 8 in the paper). It must wait until an entry of its own current term is committed; that implicitly commits earlier entries too. This is the subtlety that makes Raft non-trivial and is the lesson new implementations most often get wrong.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Building a replicated state machine** — key-value store, configuration registry, distributed lock service. Raft is the default in 2026.",
        "**Replicated logs of any kind** — event sourcing, write-ahead logs across replicas, leader-based event streaming.",
        "**Teams that need to onboard new engineers quickly** — Raft's three-part decomposition is what makes it the friendly choice over Paxos.",
        "**Heterogeneous environments** — etcd's Raft library, Hashicorp's Raft (Go), Tikv (Rust), Apache Ratis (Java) — pick a language, you'll find a maintained Raft.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Byzantine fault model** — Raft assumes crash failures only. Use PBFT or HotStuff.",
        "**Leaderless / multi-master** writes — Raft funnels everything through the leader. EPaxos, Mencius, Generalized Paxos remove that bottleneck.",
        "**Atomic commit across services** — that's 2PC (or a Raft-replicated coordinator), not pure Raft.",
        "**Extreme wide-area latency** — Raft is bandwidth- and RTT-sensitive across the leader; geo-replication with witnesses or quorum tuning may suit better.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Designed for understandability** — three sub-problems, two safety rules. The 2014 paper is one of the most readable algorithms papers of its era.",
      "**Strong-leader simplicity** — only the leader appends to the log, only the leader talks to clients. Easy to reason about.",
      "**Same fault tolerance as Paxos** — f failures of 2f+1 nodes.",
      "**Mature library ecosystem** — production-grade implementations in Go, Rust, Java, C++, Python, Erlang.",
      "**One round-trip per command** in steady state — same hot path as Multi-Paxos.",
    ],
    cons: [
      "**Leader is a write bottleneck** — every write funnels through it; throughput caps at one node's resources.",
      "**Brief unavailability on leader failure** — bounded by the election timeout (typically 100–500ms), but real clients see timeouts.",
      "**Strong-leader assumption** doesn't fit everything — multi-master databases need different protocols.",
      "**Subtle commit-across-terms rule** is the most common source of correctness bugs in new implementations.",
      "**Snapshotting and membership changes** are bolted on, not baked into the core algorithm — additional code paths that need careful testing.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch a leader get elected",
      body: "Open **Leader election** and step through. A follower's election timer fires, it becomes a candidate, sends RequestVote, collects a majority (3 of 5), and becomes leader. Notice that the term advances by one — every election uses a fresh term so old leaders can't accidentally rejoin and confuse the cluster.",
    },
    {
      title: "02 · Replicate a command in one RTT",
      body: "Switch to **Replicate a command** (or continue after election). Click a command button. The leader appends it (amber = tentative), broadcasts AppendEntries, collects acks from a majority, and commits (green = permanent). Followers commit on the next heartbeat. One round-trip per command — same hot path as Multi-Paxos.",
    },
    {
      title: "03 · Crash the leader",
      body: "Run **Crash the leader**. Heartbeats stop, a follower's timer fires, a new election begins with the next term. Committed entries survive (a majority still holds them) and the new leader picks them up via the up-to-date-log rule. Notice that the cluster is briefly unavailable for writes — bounded but real.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Try crashing the leader mid-replication (between Append and Committed). Try queueing four commands fast. Notice that the leader-completeness rule means a follower with a stale log will never win an election — only candidates whose log is at least as up-to-date as the voter's get the vote. That single restriction is the entire safety story.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "raft.go",
      code: `// Simplified Raft RPC handlers. The protocol fits in two messages:
// RequestVote (elections) and AppendEntries (heartbeats + replication).
package raft

type LogEntry struct {
	Term int
	Cmd  string
}

type Role int

const (
	Follower Role = iota
	Candidate
	Leader
)

type RaftServer struct {
	currentTerm int
	votedFor    int // -1 means none
	log         []LogEntry
	commitIndex int // -1 means empty
	role        Role
}

func NewRaftServer() *RaftServer {
	return &RaftServer{votedFor: -1, commitIndex: -1, role: Follower}
}

type RequestVoteReq struct {
	Term, CandidateID, LastLogIndex, LastLogTerm int
}
type RequestVoteResp struct {
	Term        int
	VoteGranted bool
}

// --- election ---
func (s *RaftServer) OnRequestVote(req RequestVoteReq) RequestVoteResp {
	if req.Term > s.currentTerm {
		s.currentTerm = req.Term
		s.votedFor = -1
		s.role = Follower
	}
	myLastTerm := 0
	if len(s.log) > 0 {
		myLastTerm = s.log[len(s.log)-1].Term
	}
	myLastIdx := len(s.log) - 1
	upToDate := req.LastLogTerm > myLastTerm ||
		(req.LastLogTerm == myLastTerm && req.LastLogIndex >= myLastIdx)
	free := s.votedFor == -1 || s.votedFor == req.CandidateID
	grant := req.Term == s.currentTerm && free && upToDate
	if grant {
		s.votedFor = req.CandidateID
	}
	return RequestVoteResp{Term: s.currentTerm, VoteGranted: grant}
}

type AppendEntriesReq struct {
	Term, LeaderID, PrevLogIndex, PrevLogTerm int
	Entries                                   []LogEntry
	LeaderCommit                              int
}
type AppendEntriesResp struct {
	Term    int
	Success bool
}

// --- replication ---
func (s *RaftServer) OnAppendEntries(req AppendEntriesReq) AppendEntriesResp {
	if req.Term < s.currentTerm {
		return AppendEntriesResp{Term: s.currentTerm, Success: false}
	}
	if req.Term > s.currentTerm {
		s.currentTerm = req.Term
		s.votedFor = -1
	}
	s.role = Follower

	// log consistency check
	if req.PrevLogIndex >= 0 {
		if req.PrevLogIndex >= len(s.log) || s.log[req.PrevLogIndex].Term != req.PrevLogTerm {
			return AppendEntriesResp{Term: s.currentTerm, Success: false}
		}
	}
	// truncate any conflicting suffix, then append
	s.log = append(s.log[:req.PrevLogIndex+1], req.Entries...)

	if req.LeaderCommit > s.commitIndex {
		s.commitIndex = req.LeaderCommit
		if last := len(s.log) - 1; last < s.commitIndex {
			s.commitIndex = last
		}
		s.applyToStateMachine()
	}
	return AppendEntriesResp{Term: s.currentTerm, Success: true}
}

func (s *RaftServer) applyToStateMachine() { /* apply log[0..commitIndex] in order */ }`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Raft.java",
      code: `// Simplified Raft RPC handlers. The protocol fits in two messages:
// RequestVote (elections) and AppendEntries (heartbeats + replication).
import java.util.ArrayList;
import java.util.List;

record LogEntry(int term, String cmd) {}

enum Role { FOLLOWER, CANDIDATE, LEADER }

record RequestVoteReq(int term, int candidateId, int lastLogIndex, int lastLogTerm) {}
record RequestVoteResp(int term, boolean voteGranted) {}

record AppendEntriesReq(
    int term, int leaderId, int prevLogIndex, int prevLogTerm,
    List<LogEntry> entries, int leaderCommit) {}
record AppendEntriesResp(int term, boolean success) {}

public class Raft {
  int currentTerm = 0;
  Integer votedFor = null;       // null means none
  List<LogEntry> log = new ArrayList<>();
  int commitIndex = -1;
  Role role = Role.FOLLOWER;

  // --- election ---
  RequestVoteResp onRequestVote(RequestVoteReq req) {
    if (req.term() > currentTerm) { currentTerm = req.term(); votedFor = null; role = Role.FOLLOWER; }
    int myLastTerm = log.isEmpty() ? 0 : log.get(log.size() - 1).term();
    int myLastIdx  = log.size() - 1;
    boolean upToDate = req.lastLogTerm() > myLastTerm
        || (req.lastLogTerm() == myLastTerm && req.lastLogIndex() >= myLastIdx);
    boolean free = votedFor == null || votedFor == req.candidateId();
    boolean grant = req.term() == currentTerm && free && upToDate;
    if (grant) votedFor = req.candidateId();
    return new RequestVoteResp(currentTerm, grant);
  }

  // --- replication ---
  AppendEntriesResp onAppendEntries(AppendEntriesReq req) {
    if (req.term() < currentTerm) return new AppendEntriesResp(currentTerm, false);
    if (req.term() > currentTerm) { currentTerm = req.term(); votedFor = null; }
    role = Role.FOLLOWER;

    // log consistency check
    if (req.prevLogIndex() >= 0) {
      if (req.prevLogIndex() >= log.size() || log.get(req.prevLogIndex()).term() != req.prevLogTerm()) {
        return new AppendEntriesResp(currentTerm, false);
      }
    }
    // truncate any conflicting suffix, then append
    log = new ArrayList<>(log.subList(0, req.prevLogIndex() + 1));
    log.addAll(req.entries());

    if (req.leaderCommit() > commitIndex) {
      commitIndex = Math.min(req.leaderCommit(), log.size() - 1);
      applyToStateMachine();
    }
    return new AppendEntriesResp(currentTerm, true);
  }

  private void applyToStateMachine() { /* apply log[0..commitIndex] in order */ }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "raft.py",
      code: `# Simplified Raft RPC handlers. The protocol fits in two messages:
# RequestVote (elections) and AppendEntries (heartbeats + replication).
from dataclasses import dataclass, field
from enum import Enum


@dataclass
class LogEntry:
    term: int
    cmd: str


class Role(Enum):
    FOLLOWER = "follower"
    CANDIDATE = "candidate"
    LEADER = "leader"


class RaftServer:
    def __init__(self):
        self.current_term = 0
        self.voted_for: int | None = None
        self.log: list[LogEntry] = []
        self.commit_index = -1
        self.role = Role.FOLLOWER

    # --- election ---
    def on_request_vote(self, term, candidate_id, last_log_index, last_log_term):
        if term > self.current_term:
            self.current_term = term
            self.voted_for = None
            self.role = Role.FOLLOWER
        my_last_term = self.log[-1].term if self.log else 0
        my_last_idx = len(self.log) - 1
        up_to_date = last_log_term > my_last_term or (
            last_log_term == my_last_term and last_log_index >= my_last_idx
        )
        free = self.voted_for is None or self.voted_for == candidate_id
        grant = term == self.current_term and free and up_to_date
        if grant:
            self.voted_for = candidate_id
        return {"term": self.current_term, "vote_granted": grant}

    # --- replication ---
    def on_append_entries(
        self, term, leader_id, prev_log_index, prev_log_term, entries, leader_commit
    ):
        if term < self.current_term:
            return {"term": self.current_term, "success": False}
        if term > self.current_term:
            self.current_term = term
            self.voted_for = None
        self.role = Role.FOLLOWER

        # log consistency check
        if prev_log_index >= 0:
            if prev_log_index >= len(self.log) or self.log[prev_log_index].term != prev_log_term:
                return {"term": self.current_term, "success": False}
        # truncate any conflicting suffix, then append
        self.log = self.log[: prev_log_index + 1] + entries

        if leader_commit > self.commit_index:
            self.commit_index = min(leader_commit, len(self.log) - 1)
            self._apply_to_state_machine()
        return {"term": self.current_term, "success": True}

    def _apply_to_state_machine(self):
        pass  # apply log[0..commit_index] in order`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "raft.cpp",
      code: `// Simplified Raft RPC handlers. The protocol fits in two messages:
// RequestVote (elections) and AppendEntries (heartbeats + replication).
#include <algorithm>
#include <optional>
#include <string>
#include <vector>

struct LogEntry {
    int term;
    std::string cmd;
};

enum class Role { Follower, Candidate, Leader };

struct RequestVoteReq {
    int term, candidateId, lastLogIndex, lastLogTerm;
};
struct RequestVoteResp {
    int term;
    bool voteGranted;
};

struct AppendEntriesReq {
    int term, leaderId, prevLogIndex, prevLogTerm;
    std::vector<LogEntry> entries;
    int leaderCommit;
};
struct AppendEntriesResp {
    int term;
    bool success;
};

class RaftServer {
public:
    int currentTerm = 0;
    std::optional<int> votedFor;  // empty means none
    std::vector<LogEntry> log;
    int commitIndex = -1;
    Role role = Role::Follower;

    // --- election ---
    RequestVoteResp onRequestVote(const RequestVoteReq& req) {
        if (req.term > currentTerm) { currentTerm = req.term; votedFor.reset(); role = Role::Follower; }
        int myLastTerm = log.empty() ? 0 : log.back().term;
        int myLastIdx  = static_cast<int>(log.size()) - 1;
        bool upToDate = req.lastLogTerm > myLastTerm
            || (req.lastLogTerm == myLastTerm && req.lastLogIndex >= myLastIdx);
        bool free = !votedFor.has_value() || *votedFor == req.candidateId;
        bool grant = req.term == currentTerm && free && upToDate;
        if (grant) votedFor = req.candidateId;
        return { currentTerm, grant };
    }

    // --- replication ---
    AppendEntriesResp onAppendEntries(const AppendEntriesReq& req) {
        if (req.term < currentTerm) return { currentTerm, false };
        if (req.term > currentTerm) { currentTerm = req.term; votedFor.reset(); }
        role = Role::Follower;

        // log consistency check
        if (req.prevLogIndex >= 0) {
            if (req.prevLogIndex >= static_cast<int>(log.size())
                || log[req.prevLogIndex].term != req.prevLogTerm) {
                return { currentTerm, false };
            }
        }
        // truncate any conflicting suffix, then append
        log.resize(req.prevLogIndex + 1);
        log.insert(log.end(), req.entries.begin(), req.entries.end());

        if (req.leaderCommit > commitIndex) {
            commitIndex = std::min(req.leaderCommit, static_cast<int>(log.size()) - 1);
            applyToStateMachine();
        }
        return { currentTerm, true };
    }

private:
    void applyToStateMachine() { /* apply log[0..commitIndex] in order */ }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Diego Ongaro & John Ousterhout — *In Search of an Understandable Consensus Algorithm (Extended Version)* (2014)",
      href: "https://raft.github.io/raft.pdf",
      note: "The Raft paper. 18 pages, plain prose, three diagrams. The single best introduction; aim to read it cover-to-cover.",
      kind: "paper",
    },
    {
      label: "The Raft website — animated visualisation",
      href: "https://raft.github.io/",
      note: "Interactive visualisation of leader election, log replication, and partitions. Pair it with the paper for a deep grasp of the corner cases.",
      kind: "docs",
    },
    {
      label: "Diego Ongaro — *Consensus: Bridging Theory and Practice* (PhD, 2014)",
      href: "https://github.com/ongardie/dissertation/raw/master/online.pdf",
      note: "Ongaro's thesis. Goes far beyond the paper: membership changes, log compaction, snapshotting, client interactions, performance tuning.",
      kind: "paper",
    },
    {
      label: "etcd Raft library (Go)",
      href: "https://github.com/etcd-io/raft",
      note: "The production reference implementation that powers etcd, CockroachDB, TiKV (originally), and many others. Read README and docs for the practical surface area.",
      kind: "docs",
    },
    {
      label: "The Secret Lives of Data — Raft visualisation",
      href: "https://thesecretlivesofdata.com/raft/",
      note: "Scroll-driven storybook walkthrough; great for the very first introduction before tackling the paper itself.",
      kind: "article",
    },
    {
      label: "Heidi Howard & Richard Mortier — *Paxos vs Raft: have we reached consensus?* (PaPoC 2020)",
      href: "https://arxiv.org/abs/2004.05074",
      note: "Side-by-side comparison showing Raft and Multi-Paxos are structurally equivalent. Useful when picking between them on a team.",
      kind: "paper",
    },
    {
      label: "Aphyr / Jepsen — Raft analyses",
      href: "https://jepsen.io/analyses",
      note: "Real-world Raft-based systems (etcd, Consul, CockroachDB) tested under fault injection. Pages of bug discoveries that teach you what production Raft has to defend against.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "raft-q1",
      question:
        "What is a Raft \"term\" and why does it matter?",
      options: [
        { id: "a", label: "A fixed time interval (e.g. 5 minutes) after which the cluster re-elects." },
        { id: "b", label: "A monotonically increasing integer; each term has at most one leader, and every message carries the term so stale leaders are detected and stepped down." },
        { id: "c", label: "The number of log entries the leader can append per second." },
        { id: "d", label: "The number of followers required for a quorum." },
      ],
      correctOptionId: "b",
      explanation:
        "Terms are Raft's logical clock. Every RPC and log entry is tagged with a term, and any server seeing a higher term immediately steps down to follower. That property — combined with the rule that each server votes at most once per term — is what gives Raft at-most-one-leader-per-term and the safety story that follows.",
    },
    {
      id: "raft-q2",
      question:
        "A follower votes for a candidate only if the candidate's log is \"at least as up-to-date.\" What does up-to-date mean in Raft?",
      options: [
        { id: "a", label: "The candidate has the highest IP address." },
        { id: "b", label: "Last-log term wins; if tied, longer log wins." },
        { id: "c", label: "The candidate received the most heartbeats in the last term." },
        { id: "d", label: "Whichever candidate sent the RequestVote first." },
      ],
      correctOptionId: "b",
      explanation:
        "Raft's election restriction: the candidate's last log term must be ≥ the voter's last log term, and if equal, the candidate's log length must be ≥ the voter's. This is what guarantees Leader Completeness — any leader of a future term is guaranteed to have every previously committed entry.",
    },
    {
      id: "raft-q3",
      question:
        "Which production system is built directly on a Raft implementation?",
      options: [
        { id: "a", label: "Apache Cassandra." },
        { id: "b", label: "Redis (standalone)." },
        { id: "c", label: "etcd — the canonical reference, and the backing store for Kubernetes." },
        { id: "d", label: "PostgreSQL streaming replication." },
      ],
      correctOptionId: "c",
      explanation:
        "etcd was built explicitly as a Raft-backed key-value store, and its Raft library (etcd-io/raft) became the production reference implementation that other systems — CockroachDB, TiKV, M3DB and many more — adopted. Kubernetes uses etcd as its cluster store, so every k8s deployment is implicitly running Raft.",
    },
  ],
};
