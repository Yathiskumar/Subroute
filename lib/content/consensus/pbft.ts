import type { ConceptContent } from "@/lib/content/types";

export const pbft: ConceptContent = {
  prototypeCaption:
    "Four nodes — one primary, three backups — tolerating one Byzantine (lying) node. Pick a scenario — **Happy path**, **A backup lies** (quorum absorbs it), **The primary lies** (view change kicks in), or **Free play** where you pick which node is malicious. Step through Pre-Prepare / Prepare / Commit / Reply. Only two log lines are ever shown.",

  overview: [
    {
      type: "p",
      text: "**PBFT — Practical Byzantine Fault Tolerance** — is Miguel Castro and Barbara Liskov's 1999 algorithm that made byzantine-fault-tolerant state-machine replication actually deployable. \"Byzantine\" means: some nodes don't just crash — they actively lie, send conflicting messages, or attempt to corrupt the protocol. Before PBFT, BFT algorithms cost so much (exponential message counts, hours per decision) that nobody used them. PBFT cut that to O(n²) messages per request and decisions in milliseconds.",
    },
    {
      type: "p",
      text: "The deal is that fault tolerance comes at a different price. To tolerate `f` byzantine nodes you need **3f+1 total**, and consensus quorums are **2f+1** — overlapping quorums must share at least one honest node, which is what stops malicious nodes from making conflicting commits both succeed. So tolerating one liar needs 4 nodes; tolerating three liars needs 10. That's the structural cost of Byzantine tolerance, and it's why PBFT (and its descendants) live in permissioned blockchains and consortium systems, not your average internal cluster.",
    },
    {
      type: "p",
      text: "PBFT runs in *views*, each with one **primary** (the leader) and `n-1` **backups**. The primary proposes an order for incoming requests; the backups cross-check by broadcasting `Prepare` to each other. If a 2f+1 quorum of matching Prepares forms, every honest node concludes the primary didn't lie — they then broadcast `Commit` to make the agreement durable. When 2f+1 matching Commits arrive, the request executes and the client receives a reply. If the primary itself misbehaves, backups vote in a **view change** to rotate the role.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Normal-case operation (three rounds)" },
    {
      type: "ol",
      items: [
        "**Client → Primary:** REQUEST(op).",
        "**Pre-Prepare** — Primary assigns sequence number `n` and broadcasts `PRE-PREPARE(view, n, op)` to every backup.",
        "**Prepare** — Each backup that accepts the Pre-Prepare broadcasts `PREPARE(view, n, op)` to every other node. A node is **prepared** when it has the Pre-Prepare plus 2f matching Prepares from other nodes (total 2f+1 including itself).",
        "**Commit** — Once prepared, each node broadcasts `COMMIT(view, n)`. A node **commits and executes** the request when it sees 2f+1 matching Commits.",
        "**Reply** — Each committed node sends its result directly to the client. The client waits for f+1 matching replies before trusting the answer — since at most f can lie, f+1 matching replies must contain at least one truthful one.",
      ],
    },
    { type: "h", text: "View change (when the primary misbehaves)" },
    {
      type: "ol",
      items: [
        "Backups suspect the primary on timeout or detected misbehaviour (e.g., conflicting Pre-Prepares).",
        "Each suspecting backup broadcasts `VIEW-CHANGE(new view, prepared-set)` listing every request it has prepared.",
        "When 2f+1 view-change messages arrive at the new primary (the next server in deterministic round-robin order), it broadcasts `NEW-VIEW` carrying the recovered prepared-set so honest nodes resume from a consistent point.",
        "Then the cluster resumes normal operation in the new view. Committed requests are preserved by the quorum-intersection invariant.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why 3f+1 nodes and 2f+1 quorums",
      text: "With 3f+1 nodes and quorums of 2f+1, any two quorums share at least 2(2f+1) − (3f+1) = f+1 nodes. At most f of those can be liars, so at least one honest node is in both quorums. That honest node won't agree to two conflicting decisions — making conflicting commits structurally impossible.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "All-to-all broadcasts cost O(n²) messages",
      text: "Each round (Prepare, Commit) is an all-to-all broadcast — every node sends to every other. That's O(n²) messages per request — manageable at n = 4, 7, 10, but it scales badly. Modern descendants like HotStuff (used in Diem, Aptos) reduce this to O(n) by routing through the leader with cryptographic signatures.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Permissioned blockchains and consortium systems** — Hyperledger Fabric, Tendermint, IBFT (Quorum, ConsenSys), HotStuff (Diem/Aptos). Known validators, but some may be malicious.",
        "**Cross-organisation data sharing** with no single trusted party — financial settlement networks, supply-chain provenance.",
        "**Critical infrastructure** where Byzantine nodes are a real threat (compromised servers, insider attacks).",
        "**Small clusters where the O(n²) cost is acceptable** — typically up to ~20 validators.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Inside one trust boundary** (your own datacenter, your own replicas) — use Raft or Multi-Paxos. Crash-fault tolerance is cheap; BFT is expensive and unnecessary if all your machines are yours.",
        "**Public, permissionless blockchains** — Nakamoto consensus (PoW) or modern PoS protocols handle open membership and Sybil resistance; PBFT requires known validator sets.",
        "**Very large validator counts** (>50) — switch to HotStuff or chained variants that linearise the message cost.",
        "**Atomic commit across trusted services** — that's 2PC, not BFT.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Tolerates active malice**, not just crashes — nodes that lie, send conflicting messages, or attempt to corrupt the agreement.",
      "**Practical message complexity** — O(n²) per request, milliseconds per decision; was a watershed result vs the exponential earlier BFT algorithms.",
      "**Deterministic finality** — once committed, a request is final (no probabilistic settlement like PoW).",
      "**Well-studied** — three decades of formal analyses, optimisations, and production deployments in permissioned blockchains.",
      "**Foundation of modern BFT** — Tendermint, HotStuff, IBFT and most permissioned chain consensus algorithms inherit PBFT's structure.",
    ],
    cons: [
      "**Needs 3f+1 nodes to tolerate f liars** — 4 nodes for 1, 7 for 2, 10 for 3. Triple the cost of crash-fault majority quorums.",
      "**O(n²) messages per request** — every node broadcasts to every other in Prepare and Commit phases.",
      "**Scales poorly past ~20 validators** — modern BFT (HotStuff and chained variants) replaces the all-to-all phases with leader-pivot signatures to recover O(n).",
      "**View change is intricate and expensive** — a real source of corner-case bugs in implementations.",
      "**Static membership** — adding or removing a validator requires careful re-keying; doesn't handle open / churning sets gracefully.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk the Happy path",
      body: "Open **Happy path** with no Byzantine node. Watch the three rounds: Pre-Prepare (primary broadcasts), Prepare (all-to-all cross-check), Commit (all-to-all confirmation), Reply. Notice that even with no liar, the cross-check is still done — that's how the protocol stays safe without trust.",
    },
    {
      title: "02 · See a backup liar get absorbed",
      body: "Switch to **A backup lies** — pick any non-primary node. It sends a bogus PREPARE that doesn't match. The honest nodes still get 3 (=2f+1) matching Prepares from each other, ignore the liar's message, and the request commits with no disruption. This is what \"fault tolerance\" really means in BFT: the lie is silently absorbed.",
    },
    {
      title: "03 · Watch a faulty primary trigger view change",
      body: "Run **The primary lies**. The primary sends conflicting Pre-Prepares to different backups. Backups detect the mismatch during Prepare — they cannot form a quorum — and vote to change view. The primary role rotates to the next honest node, which redoes Pre-Prepare. The protocol heals itself.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play** and pick different Byzantine nodes. With one liar, 4-node PBFT survives every scenario — that's f=1 tolerance. Try toggling honesty mid-request. Notice that 2f+1 = 3 always shows up as the magic quorum number: enough that a single liar can't tip the result.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "pbft.go",
      code: `// Skeleton of PBFT normal-case operation on a backup node.
// All cross-node messages are signed; signature checks omitted for clarity.

// One message type with a Kind field models the PRE-PREPARE / PREPARE / COMMIT
// discriminated union (op is unused for COMMIT).
type Kind string

const (
	PrePrepare Kind = "PRE-PREPARE"
	Prepare    Kind = "PREPARE"
	Commit     Kind = "COMMIT"
)

type Msg struct {
	Kind Kind
	View int
	Seq  int
	Op   string // unused for COMMIT
	From int
}

type PbftBackup struct {
	myId int
	n    int

	view       int
	prePrepare map[int]string         // seq -> op
	prepares   map[int]map[int]string // seq -> from -> op
	commits    map[int]map[int]bool   // seq -> set of senders
	prepared   map[int]bool
	committed  map[int]bool
}

func NewPbftBackup(myId, n int) *PbftBackup {
	return &PbftBackup{
		myId:       myId,
		n:          n,
		prePrepare: make(map[int]string),
		prepares:   make(map[int]map[int]string),
		commits:    make(map[int]map[int]bool),
		prepared:   make(map[int]bool),
		committed:  make(map[int]bool),
	}
}

// 2f+1 quorum
func (p *PbftBackup) quorum() int {
	f := (p.n - 1) / 3
	return 2*f + 1
}

func (p *PbftBackup) OnPrePrepare(m Msg) {
	if m.View != p.view {
		return
	}
	if _, ok := p.prePrepare[m.Seq]; ok {
		return // already have one for this seq
	}
	p.prePrepare[m.Seq] = m.Op
	p.broadcast(Msg{Kind: Prepare, View: p.view, Seq: m.Seq, Op: m.Op, From: p.myId})
}

func (p *PbftBackup) OnPrepare(m Msg) {
	if m.View != p.view {
		return
	}
	if op, ok := p.prePrepare[m.Seq]; !ok || op != m.Op {
		return
	}
	bag := p.prepares[m.Seq]
	if bag == nil {
		bag = make(map[int]string)
		p.prepares[m.Seq] = bag
	}
	bag[m.From] = m.Op
	// Need pre-prepare + 2f matching prepares from others = 2f+1 total.
	if len(bag) >= p.quorum()-1 && !p.prepared[m.Seq] {
		p.prepared[m.Seq] = true
		p.broadcast(Msg{Kind: Commit, View: p.view, Seq: m.Seq, From: p.myId})
	}
}

func (p *PbftBackup) OnCommit(m Msg) {
	if m.View != p.view {
		return
	}
	set := p.commits[m.Seq]
	if set == nil {
		set = make(map[int]bool)
		p.commits[m.Seq] = set
	}
	set[m.From] = true
	if len(set) >= p.quorum() && !p.committed[m.Seq] && p.prepared[m.Seq] {
		p.committed[m.Seq] = true
		p.execute(p.prePrepare[m.Seq])
		p.replyToClient(m.Seq)
	}
}

func (p *PbftBackup) execute(_op string) {} // apply to state machine
func (p *PbftBackup) replyToClient(_seq int) {} // signed reply
func (p *PbftBackup) broadcast(_m Msg) {} // send to all other n-1 nodes`,
    },
    {
      label: "Java",
      language: "java",
      filename: "PbftBackup.java",
      code: `// Skeleton of PBFT normal-case operation on a backup node.
// All cross-node messages are signed; signature checks omitted for clarity.

import java.util.*;

// A tagged record models the PRE-PREPARE / PREPARE / COMMIT discriminated union
// (op is null for COMMIT).
record Msg(Kind kind, int view, int seq, String op, int from) {
  enum Kind { PRE_PREPARE, PREPARE, COMMIT }
}

class PbftBackup {
  private final int myId;
  private final int n;

  private int view = 0;
  private final Map<Integer, String> prePrepare = new HashMap<>();              // seq -> op
  private final Map<Integer, Map<Integer, String>> prepares = new HashMap<>();  // seq -> from -> op
  private final Map<Integer, Set<Integer>> commits = new HashMap<>();           // seq -> set of senders
  private final Set<Integer> prepared = new HashSet<>();
  private final Set<Integer> committed = new HashSet<>();

  PbftBackup(int myId, int n) {
    this.myId = myId;
    this.n = n;
  }

  // 2f+1 quorum
  private int quorum() {
    int f = (n - 1) / 3;
    return 2 * f + 1;
  }

  void onPrePrepare(Msg m) {
    if (m.view() != view) return;
    if (prePrepare.containsKey(m.seq())) return;            // already have one for this seq
    prePrepare.put(m.seq(), m.op());
    broadcast(new Msg(Msg.Kind.PREPARE, view, m.seq(), m.op(), myId));
  }

  void onPrepare(Msg m) {
    if (m.view() != view) return;
    if (!prePrepare.containsKey(m.seq()) || !prePrepare.get(m.seq()).equals(m.op())) return;
    Map<Integer, String> bag = prepares.computeIfAbsent(m.seq(), k -> new HashMap<>());
    bag.put(m.from(), m.op());
    // Need pre-prepare + 2f matching prepares from others = 2f+1 total.
    if (bag.size() >= quorum() - 1 && !prepared.contains(m.seq())) {
      prepared.add(m.seq());
      broadcast(new Msg(Msg.Kind.COMMIT, view, m.seq(), null, myId));
    }
  }

  void onCommit(Msg m) {
    if (m.view() != view) return;
    Set<Integer> set = commits.computeIfAbsent(m.seq(), k -> new HashSet<>());
    set.add(m.from());
    if (set.size() >= quorum() && !committed.contains(m.seq()) && prepared.contains(m.seq())) {
      committed.add(m.seq());
      execute(prePrepare.get(m.seq()));
      replyToClient(m.seq());
    }
  }

  private void execute(String op) { /* apply to state machine */ }
  private void replyToClient(int seq) { /* signed reply */ }
  private void broadcast(Msg m) { /* send to all other n-1 nodes */ }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "pbft.py",
      code: `# Skeleton of PBFT normal-case operation on a backup node.
# All cross-node messages are signed; signature checks omitted for clarity.

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class Kind(Enum):
    PRE_PREPARE = "PRE-PREPARE"
    PREPARE = "PREPARE"
    COMMIT = "COMMIT"


# A tagged dataclass models the PRE-PREPARE / PREPARE / COMMIT discriminated
# union (op is None for COMMIT).
@dataclass
class Msg:
    kind: Kind
    view: int
    seq: int
    from_: int
    op: Optional[str] = None


class PbftBackup:
    def __init__(self, my_id: int, n: int):
        self.my_id = my_id
        self.n = n
        self.view = 0
        self.pre_prepare: dict[int, str] = {}             # seq -> op
        self.prepares: dict[int, dict[int, str]] = {}     # seq -> from -> op
        self.commits: dict[int, set[int]] = {}            # seq -> set of senders
        self.prepared: set[int] = set()
        self.committed: set[int] = set()

    # 2f+1 quorum
    def _quorum(self) -> int:
        f = (self.n - 1) // 3
        return 2 * f + 1

    def on_pre_prepare(self, m: Msg) -> None:
        if m.view != self.view:
            return
        if m.seq in self.pre_prepare:
            return  # already have one for this seq
        self.pre_prepare[m.seq] = m.op
        self.broadcast(Msg(Kind.PREPARE, self.view, m.seq, self.my_id, m.op))

    def on_prepare(self, m: Msg) -> None:
        if m.view != self.view:
            return
        if m.seq not in self.pre_prepare or self.pre_prepare[m.seq] != m.op:
            return
        bag = self.prepares.setdefault(m.seq, {})
        bag[m.from_] = m.op
        # Need pre-prepare + 2f matching prepares from others = 2f+1 total.
        if len(bag) >= self._quorum() - 1 and m.seq not in self.prepared:
            self.prepared.add(m.seq)
            self.broadcast(Msg(Kind.COMMIT, self.view, m.seq, self.my_id))

    def on_commit(self, m: Msg) -> None:
        if m.view != self.view:
            return
        senders = self.commits.setdefault(m.seq, set())
        senders.add(m.from_)
        if len(senders) >= self._quorum() and m.seq not in self.committed and m.seq in self.prepared:
            self.committed.add(m.seq)
            self.execute(self.pre_prepare[m.seq])
            self.reply_to_client(m.seq)

    def execute(self, _op: str) -> None:
        pass  # apply to state machine

    def reply_to_client(self, _seq: int) -> None:
        pass  # signed reply

    def broadcast(self, _m: Msg) -> None:
        pass  # send to all other n-1 nodes`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "pbft.cpp",
      code: `// Skeleton of PBFT normal-case operation on a backup node.
// All cross-node messages are signed; signature checks omitted for clarity.

#include <string>
#include <unordered_map>
#include <unordered_set>

// One struct with a Kind field models the PRE-PREPARE / PREPARE / COMMIT
// discriminated union (op is empty for COMMIT).
enum class Kind { PrePrepare, Prepare, Commit };

struct Msg {
  Kind kind;
  int view;
  int seq;
  std::string op; // unused for COMMIT
  int from;
};

class PbftBackup {
 public:
  PbftBackup(int myId, int n) : myId_(myId), n_(n) {}

  void onPrePrepare(const Msg& m) {
    if (m.view != view_) return;
    if (prePrepare_.count(m.seq)) return;            // already have one for this seq
    prePrepare_[m.seq] = m.op;
    broadcast(Msg{Kind::Prepare, view_, m.seq, m.op, myId_});
  }

  void onPrepare(const Msg& m) {
    if (m.view != view_) return;
    auto it = prePrepare_.find(m.seq);
    if (it == prePrepare_.end() || it->second != m.op) return;
    auto& bag = prepares_[m.seq];
    bag[m.from] = m.op;
    // Need pre-prepare + 2f matching prepares from others = 2f+1 total.
    if (static_cast<int>(bag.size()) >= quorum() - 1 && !prepared_.count(m.seq)) {
      prepared_.insert(m.seq);
      broadcast(Msg{Kind::Commit, view_, m.seq, "", myId_});
    }
  }

  void onCommit(const Msg& m) {
    if (m.view != view_) return;
    auto& set = commits_[m.seq];
    set.insert(m.from);
    if (static_cast<int>(set.size()) >= quorum() && !committed_.count(m.seq) && prepared_.count(m.seq)) {
      committed_.insert(m.seq);
      execute(prePrepare_[m.seq]);
      replyToClient(m.seq);
    }
  }

 private:
  // 2f+1 quorum
  int quorum() const {
    int f = (n_ - 1) / 3;
    return 2 * f + 1;
  }

  void execute(const std::string& op) {} // apply to state machine
  void replyToClient(int seq) {}          // signed reply
  void broadcast(const Msg& m) {}         // send to all other n-1 nodes

  int myId_;
  int n_;

  int view_ = 0;
  std::unordered_map<int, std::string> prePrepare_;                      // seq -> op
  std::unordered_map<int, std::unordered_map<int, std::string>> prepares_; // seq -> from -> op
  std::unordered_map<int, std::unordered_set<int>> commits_;            // seq -> set of senders
  std::unordered_set<int> prepared_;
  std::unordered_set<int> committed_;
};`,
    },
  ],

  furtherReading: [
    {
      label: "Miguel Castro & Barbara Liskov — *Practical Byzantine Fault Tolerance* (OSDI 1999)",
      href: "https://css.csail.mit.edu/6.824/2014/papers/castro-practicalbft.pdf",
      note: "The original PBFT paper, mirrored by MIT's 6.824 distributed-systems course. The algorithm every modern BFT descendant references.",
      kind: "paper",
    },
    {
      label: "Miguel Castro — *Practical Byzantine Fault Tolerance* (PhD thesis, 2001)",
      href: "https://pmg.csail.mit.edu/~castro/thesis.pdf",
      note: "Castro's thesis (MIT-LCS-TR-817) — the full, complete treatment with all the optimisations, the proxy implementation, and the experimental evaluation. The reference work.",
      kind: "paper",
    },
    {
      label: "Maofan Yin, Dahlia Malkhi, Michael K. Reiter et al — *HotStuff: BFT Consensus in the Lens of Blockchain* (PODC 2019)",
      href: "https://arxiv.org/abs/1803.05069",
      note: "The modern reformulation of PBFT for blockchain settings. Linear message complexity per leader via signature aggregation. Powers Diem/Aptos.",
      kind: "paper",
    },
    {
      label: "Hyperledger Fabric — Ordering service docs",
      href: "https://hyperledger-fabric.readthedocs.io/en/latest/orderer/ordering_service.html",
      note: "Production permissioned-blockchain BFT ordering. Shows how PBFT-family algorithms ship inside an enterprise platform.",
      kind: "docs",
    },
    {
      label: "Tendermint Core docs — Consensus",
      href: "https://docs.tendermint.com/v0.34/introduction/what-is-tendermint.html",
      note: "Tendermint is a PBFT-derived BFT engine used by Cosmos, Binance Smart Chain, and others. Clear practical introduction to PBFT semantics in a deployed system.",
      kind: "docs",
    },
    {
      label: "Christian Cachin & Marko Vukolić — *Blockchain Consensus Protocols in the Wild* (DISC 2017)",
      href: "https://arxiv.org/abs/1707.01873",
      note: "Survey of PBFT, HotStuff, Tendermint, IBFT and other practical BFT protocols, comparing their guarantees and message complexities side-by-side.",
      kind: "paper",
    },
  ],

  quiz: [
    {
      id: "pbft-q1",
      question:
        "PBFT needs 3f+1 nodes to tolerate f Byzantine failures. What's the underlying reason?",
      options: [
        { id: "a", label: "Performance — three times as many votes makes consensus faster." },
        { id: "b", label: "Quorum intersection: with 3f+1 nodes and 2f+1 quorums, any two quorums share at least f+1 nodes, at least one of which must be honest — so conflicting commits can't both succeed." },
        { id: "c", label: "Cryptographic redundancy — each request must be signed three times." },
        { id: "d", label: "Backup nodes need to take over if the primary fails." },
      ],
      correctOptionId: "b",
      explanation:
        "The math: two 2f+1-quorums in a 3f+1-cluster share at least 2(2f+1) − (3f+1) = f+1 nodes. Since at most f are liars, at least one shared node is honest, and that honest node won't agree to two conflicting decisions. That structural quorum-intersection invariant is the entire safety story.",
    },
    {
      id: "pbft-q2",
      question:
        "A 4-node PBFT cluster has one Byzantine backup (not the primary). What does the protocol do?",
      options: [
        { id: "a", label: "The cluster halts until the liar is identified and removed." },
        { id: "b", label: "The three honest nodes form a 2f+1 = 3 quorum on their own; the liar's bogus messages don't match and are simply ignored." },
        { id: "c", label: "View change rotates the primary." },
        { id: "d", label: "The cluster slows down 10× to recover." },
      ],
      correctOptionId: "b",
      explanation:
        "With f=1 and n=4, the quorum is 3. The three honest backups exchange matching Prepares and matching Commits among themselves. The liar's mismatched messages can't form a quorum with anyone, so they're ignored. The request commits at full speed with zero disruption — that's the \"fault tolerance\" promise.",
    },
    {
      id: "pbft-q3",
      question:
        "What triggers a PBFT view change?",
      options: [
        { id: "a", label: "A scheduled time interval — like a Raft term timeout." },
        { id: "b", label: "The primary appears faulty: timeout on a request, or detected sending conflicting Pre-Prepares — 2f+1 backups then vote to rotate the primary role." },
        { id: "c", label: "Whenever a client retries a request." },
        { id: "d", label: "Whenever the network is slow." },
      ],
      correctOptionId: "b",
      explanation:
        "View change is the mechanism for tolerating a malicious or unresponsive primary. Backups suspect the primary on timeout or detected misbehaviour, broadcast VIEW-CHANGE messages, and when 2f+1 of them agree the new primary (next in round-robin order) takes over via NEW-VIEW. It's the BFT analogue of Raft's election triggered by missing heartbeats, but engineered to defend against active lying.",
    },
  ],
};
