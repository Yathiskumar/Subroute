import type { ConceptContent } from "@/lib/content/types";

export const zab: ConceptContent = {
  prototypeCaption:
    "Five ZooKeeper servers running ZAB. Pick a scenario — **Elect by highest zxid**, **Sync followers**, **Broadcast a write** (propose → ack → commit), or **Crash the leader** to trigger a new epoch. Free play queues writes and crashes; the log card shows only the last two messages.",

  overview: [
    {
      type: "p",
      text: "**ZAB — ZooKeeper Atomic Broadcast** — is the consensus protocol inside Apache ZooKeeper, designed by Flavio Junqueira, Benjamin Reed, and Marco Serafini in 2008. The job is slightly narrower than general consensus: ZAB delivers a *total order* of write transactions to a quorum-replicated service. Every server applies the same operations in the same order, which is exactly what ZooKeeper needs to run a hierarchical key-value store with strong consistency.",
    },
    {
      type: "p",
      text: "ZAB looks superficially like Multi-Paxos or Raft: there's a leader, a quorum, and a per-write propose/ack/commit cycle. What sets it apart is its **synchronization phase**: when a new leader is elected, before serving any new writes, it makes every follower's log byte-for-byte identical to its own. That hard sync simplifies the steady-state protocol — by the time normal broadcast begins, every server is *exactly* caught up — and it's why ZooKeeper offers such crisp ordering guarantees.",
    },
    {
      type: "p",
      text: "ZAB's transactions carry a **zxid** — a 64-bit ID combining a 32-bit *epoch* (incremented on every leader change) and a 32-bit *counter* (incremented on every write). The election rule is dead simple: the server with the highest zxid wins, because by ZAB's invariants it must already hold every committed transaction. The sync phase then ships that history to anyone behind. After sync, the leader just streams Propose → ACK → Commit in strict FIFO order forever — that's the \"atomic broadcast\" in the name.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Phase 1 — Leader election (by highest zxid)" },
    {
      type: "ol",
      items: [
        "Each server advertises its `(epoch, zxid)` — i.e., how much committed history it has.",
        "The server with the highest zxid wins. By ZAB's invariants this server must have all committed transactions in the previous epoch, so nothing can be lost.",
        "Ties are broken deterministically (typically by server ID). Either way the result is unique.",
      ],
    },
    { type: "h", text: "Phase 2 — Discovery and Synchronization" },
    {
      type: "ol",
      items: [
        "New leader picks an epoch number higher than any seen and broadcasts `NEW-EPOCH(e)` to followers.",
        "Followers acknowledge with their last seen zxid. The leader collects from a quorum, then ships any missing transactions to each follower (`SYNC`) and drops any stray uncommitted transactions on followers' logs.",
        "Once a quorum is fully synced — every follower's log exactly matches the leader's — broadcast is allowed to begin.",
      ],
    },
    { type: "h", text: "Phase 3 — Broadcast (steady state)" },
    {
      type: "ol",
      items: [
        "Client write hits the leader. Leader assigns the next zxid `(epoch, counter+1)` and sends `PROPOSE(zxid, txn)` to every follower.",
        "Each follower writes the txn to its log (tentative) and replies `ACK`.",
        "When a quorum of ACKs arrives, the leader sends `COMMIT(zxid)`; all servers apply the txn to their state machine in zxid order.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why ZAB chose synchronisation upfront",
      text: "Raft and Multi-Paxos tolerate per-follower log gaps and patch them lazily via AppendEntries. ZAB instead front-loads the cost: bring everyone up to date *before* broadcast begins. That makes the per-write hot path trivial (no per-follower bookkeeping) and the ordering guarantee straightforward to reason about — at the cost of a more expensive election.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "ZAB only delivers, in zxid order, what passed through the leader",
      text: "ZAB provides *FIFO* total order — transactions from the leader appear in zxid order on every server. It does NOT make ZooKeeper a general-purpose state machine library: clients see operations strictly through ZooKeeper's API. The atomic-broadcast guarantee is what the service is built on, not what it exports directly.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Coordination services** — leader election, distributed locks, configuration metadata, service discovery. This is exactly what ZooKeeper is for.",
        "**Strong FIFO ordering** of writes is a hard requirement — every replica must see the same operations in the same order.",
        "**You're operating an existing ZooKeeper-based stack** — Hadoop, HBase, Solr, Kafka (pre-KRaft), Druid. ZAB is what you already have running.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Building a new replicated state machine from scratch in 2026** — pick Raft. Same shape, broader ecosystem, less ZooKeeper-specific machinery.",
        "**Atomic commit across services** — that's 2PC, not ZAB.",
        "**Byzantine fault tolerance** — ZAB assumes crash failures only. Use PBFT or descendants.",
        "**Multi-leader / leaderless writes** — ZAB is strictly single-leader. Look at EPaxos, Cassandra-style LWT, or CRDT-based approaches.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Strict FIFO total order** of writes — the strongest ordering guarantee, easy to reason about.",
      "**Steady-state broadcast is minimal** — Propose → ACK → Commit, one RTT per write.",
      "**Battle-tested for nearly two decades** in ZooKeeper deployments at hyperscale (Yahoo, Twitter, LinkedIn).",
      "**Crisp election rule** — highest zxid wins, no ambiguity, no log-completeness check across multiple criteria.",
      "**Synchronization upfront** simplifies steady-state protocol — followers' logs are identical at broadcast time.",
    ],
    cons: [
      "**Slower leader recovery** than Raft — the sync phase pays upfront for what Raft amortises across heartbeats.",
      "**Tightly coupled to ZooKeeper's needs** — it isn't a general consensus library you can drop into your own service.",
      "**Single-leader bottleneck** — same as Multi-Paxos and Raft.",
      "**Less library tooling** than Raft outside the ZooKeeper codebase — re-implementing ZAB cleanly is rare.",
      "**Documentation gap** — academic papers describe ZAB precisely, but the production ZooKeeper code has accumulated divergences worth knowing.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the election pick the highest-zxid server",
      body: "Open **Elect by highest zxid**. Notice the small `zxid epoch:count` under each server — that's how much committed history each holds. The protocol picks the one with the highest, because by ZAB's invariant it must already have every committed transaction. Ties go to lowest server ID.",
    },
    {
      title: "02 · Watch synchronization fix every follower",
      body: "Step through **Sync followers**. The new leader opens a higher epoch and ships any missing transactions to followers that are behind. By the end of sync, every live server's log is identical to the leader's — and only *then* is broadcast allowed to begin. Compare to Raft, which tolerates gaps and patches lazily.",
    },
    {
      title: "03 · Broadcast a write in one RTT",
      body: "Switch to **Broadcast** (or queue a command after sync). The leader sends PROPOSE → quorum ACKs → COMMIT. Every server applies the txn in zxid order. Throughput-wise this is the same hot path as Raft and Multi-Paxos.",
    },
    {
      title: "04 · Free play — crash the leader",
      body: "Open **Free play**. Queue a few writes, then crash the leader. Watch a new epoch open with the next-highest-zxid survivor, sync run, and broadcast resume. Try crashing the leader mid-broadcast (after Propose but before Commit) — the new leader's sync will either ship the pending txn forward or drop it, depending on whether a quorum had ACKed.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "zab.go",
      code: "// Skeleton of ZAB's three modes: discovery, synchronization, broadcast.\npackage zab\n\nimport (\n  \"errors\"\n  \"sync\"\n)\n\ntype Zxid struct {\n  Epoch   int\n  Counter int\n}\n\ntype LogEntry struct {\n  Zxid      Zxid\n  Txn       string\n  Committed bool\n}\n\n// ZabServer is the peer interface; helpers maxAdvertisedEpoch,\n// collectAcks and majority are provided externally.\ntype ZabServer interface {\n  NewEpoch(epoch int) error\n  LastZxid() (Zxid, error)\n  ApplySync(missing []LogEntry) error\n  Propose(zxid Zxid, txn string) error\n  Commit(zxid Zxid) error\n}\n\ntype ZabLeader struct {\n  epoch   int\n  counter int\n  log     []LogEntry\n  peers   []ZabServer\n  myID    int\n}\n\nfunc NewZabLeader(peers []ZabServer, myID int) *ZabLeader {\n  return &ZabLeader{epoch: 0, peers: peers, myID: myID}\n}\n\n// --- Discovery: claim a fresh epoch ---\nfunc (l *ZabLeader) Discovery() error {\n  highest, err := maxAdvertisedEpoch(l.peers)\n  if err != nil {\n    return err\n  }\n  l.epoch = highest + 1\n  var wg sync.WaitGroup\n  errs := make([]error, len(l.peers))\n  for i, p := range l.peers {\n    wg.Add(1)\n    go func(i int, p ZabServer) {\n      defer wg.Done()\n      errs[i] = p.NewEpoch(l.epoch)\n    }(i, p)\n  }\n  wg.Wait()\n  for _, e := range errs {\n    if e != nil {\n      return e\n    }\n  }\n  return nil\n}\n\n// --- Synchronization: ship missing txns, drop uncommitted strays ---\nfunc (l *ZabLeader) Synchronize() error {\n  for _, p := range l.peers {\n    theirLast, err := p.LastZxid()\n    if err != nil {\n      return err\n    }\n    var missing []LogEntry\n    for _, e := range l.log {\n      if zxidGt(e.Zxid, theirLast) {\n        missing = append(missing, e)\n      }\n    }\n    if err := p.ApplySync(missing); err != nil {\n      return err\n    }\n    // any uncommitted entries on p that we don't have get dropped on p\n  }\n  return nil\n}\n\n// --- Broadcast: Propose -> Ack -> Commit ---\nfunc (l *ZabLeader) Broadcast(txn string) error {\n  l.counter++\n  zxid := Zxid{Epoch: l.epoch, Counter: l.counter}\n  l.log = append(l.log, LogEntry{Zxid: zxid, Txn: txn, Committed: false})\n\n  acks := collectAcks(l.peers, func(p ZabServer) error {\n    return p.Propose(zxid, txn)\n  })\n  if len(acks) < majority(len(l.peers)) {\n    return errors.New(\"no quorum\")\n  }\n\n  var wg sync.WaitGroup\n  for _, p := range l.peers {\n    wg.Add(1)\n    go func(p ZabServer) {\n      defer wg.Done()\n      p.Commit(zxid)\n    }(p)\n  }\n  wg.Wait()\n  for i := range l.log {\n    if zxidEq(l.log[i].Zxid, zxid) {\n      l.log[i].Committed = true\n      break\n    }\n  }\n  return nil\n}\n\nfunc zxidGt(a, b Zxid) bool {\n  return a.Epoch > b.Epoch || (a.Epoch == b.Epoch && a.Counter > b.Counter)\n}\n\nfunc zxidEq(a, b Zxid) bool {\n  return a.Epoch == b.Epoch && a.Counter == b.Counter\n}",
    },
    {
      label: "Java",
      language: "java",
      filename: "ZabLeader.java",
      code: `// Skeleton of ZAB's three modes: discovery, synchronization, broadcast.
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

record Zxid(int epoch, int counter) {}

class LogEntry {
  final Zxid zxid;
  final String txn;
  boolean committed;
  LogEntry(Zxid zxid, String txn, boolean committed) {
    this.zxid = zxid;
    this.txn = txn;
    this.committed = committed;
  }
}

// ZabServer is the peer interface; helpers maxAdvertisedEpoch,
// collectAcks and majority are provided externally.
interface ZabServer {
  CompletableFuture<Void> newEpoch(int epoch);
  CompletableFuture<Zxid> lastZxid();
  CompletableFuture<Void> applySync(List<LogEntry> missing);
  CompletableFuture<Void> propose(Zxid zxid, String txn);
  CompletableFuture<Void> commit(Zxid zxid);
}

class ZabLeader {
  private int epoch;
  private int counter = 0;
  private final List<LogEntry> log = new ArrayList<>();
  private final List<ZabServer> peers;
  private final int myId;

  ZabLeader(List<ZabServer> peers, int myId) {
    this.peers = peers;
    this.myId = myId;
    this.epoch = 0;
  }

  // --- Discovery: claim a fresh epoch ---
  CompletableFuture<Void> discovery() {
    return maxAdvertisedEpoch(peers).thenCompose(highest -> {
      epoch = highest + 1;
      CompletableFuture<?>[] fs = peers.stream()
          .map(p -> p.newEpoch(epoch))
          .toArray(CompletableFuture[]::new);
      return CompletableFuture.allOf(fs);
    });
  }

  // --- Synchronization: ship missing txns, drop uncommitted strays ---
  CompletableFuture<Void> synchronize() {
    CompletableFuture<Void> chain = CompletableFuture.completedFuture(null);
    for (ZabServer p : peers) {
      chain = chain.thenCompose(v -> p.lastZxid()).thenCompose(theirLast -> {
        List<LogEntry> missing = log.stream()
            .filter(e -> zxidGt(e.zxid, theirLast))
            .collect(Collectors.toList());
        return p.applySync(missing);
        // any uncommitted entries on p that we don't have get dropped on p
      });
    }
    return chain;
  }

  // --- Broadcast: Propose -> Ack -> Commit ---
  CompletableFuture<Void> broadcast(String txn) {
    counter++;
    Zxid zxid = new Zxid(epoch, counter);
    log.add(new LogEntry(zxid, txn, false));

    return collectAcks(peers, p -> p.propose(zxid, txn)).thenCompose(acks -> {
      if (acks.size() < majority(peers.size())) {
        throw new RuntimeException("no quorum");
      }
      CompletableFuture<?>[] fs = peers.stream()
          .map(p -> p.commit(zxid))
          .toArray(CompletableFuture[]::new);
      return CompletableFuture.allOf(fs).thenRun(() -> {
        for (LogEntry e : log) {
          if (zxidEq(e.zxid, zxid)) {
            e.committed = true;
            break;
          }
        }
      });
    });
  }

  static boolean zxidGt(Zxid a, Zxid b) {
    return a.epoch() > b.epoch() || (a.epoch() == b.epoch() && a.counter() > b.counter());
  }

  static boolean zxidEq(Zxid a, Zxid b) {
    return a.epoch() == b.epoch() && a.counter() == b.counter();
  }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "zab.py",
      code: `# Skeleton of ZAB's three modes: discovery, synchronization, broadcast.
import asyncio
from dataclasses import dataclass, field


@dataclass
class Zxid:
    epoch: int
    counter: int


@dataclass
class LogEntry:
    zxid: Zxid
    txn: str
    committed: bool


# ZabServer is the peer protocol; helpers max_advertised_epoch,
# collect_acks and majority are provided externally.
class ZabLeader:
    def __init__(self, peers, my_id):
        self.peers = peers
        self.my_id = my_id
        self.epoch = 0
        self.counter = 0
        self.log: list[LogEntry] = []

    # --- Discovery: claim a fresh epoch ---
    async def discovery(self):
        self.epoch = await max_advertised_epoch(self.peers) + 1
        await asyncio.gather(*(p.new_epoch(self.epoch) for p in self.peers))

    # --- Synchronization: ship missing txns, drop uncommitted strays ---
    async def synchronize(self):
        for p in self.peers:
            their_last = await p.last_zxid()
            missing = [e for e in self.log if zxid_gt(e.zxid, their_last)]
            await p.apply_sync(missing)
            # any uncommitted entries on p that we don't have get dropped on p

    # --- Broadcast: Propose -> Ack -> Commit ---
    async def broadcast(self, txn):
        self.counter += 1
        zxid = Zxid(epoch=self.epoch, counter=self.counter)
        self.log.append(LogEntry(zxid=zxid, txn=txn, committed=False))

        acks = await collect_acks(self.peers, lambda p: p.propose(zxid, txn))
        if len(acks) < majority(len(self.peers)):
            raise RuntimeError("no quorum")

        await asyncio.gather(*(p.commit(zxid) for p in self.peers))
        next(e for e in self.log if zxid_eq(e.zxid, zxid)).committed = True


def zxid_gt(a: Zxid, b: Zxid) -> bool:
    return a.epoch > b.epoch or (a.epoch == b.epoch and a.counter > b.counter)


def zxid_eq(a: Zxid, b: Zxid) -> bool:
    return a.epoch == b.epoch and a.counter == b.counter`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "zab.cpp",
      code: `// Skeleton of ZAB's three modes: discovery, synchronization, broadcast.
#include <future>
#include <stdexcept>
#include <string>
#include <vector>

struct Zxid {
  int epoch;
  int counter;
};

struct LogEntry {
  Zxid zxid;
  std::string txn;
  bool committed;
};

// ZabServer is the peer interface; helpers maxAdvertisedEpoch,
// collectAcks and majority are provided externally.
class ZabServer {
 public:
  virtual ~ZabServer() = default;
  virtual void newEpoch(int epoch) = 0;
  virtual Zxid lastZxid() = 0;
  virtual void applySync(const std::vector<LogEntry>& missing) = 0;
  virtual void propose(const Zxid& zxid, const std::string& txn) = 0;
  virtual void commit(const Zxid& zxid) = 0;
};

bool zxidGt(const Zxid& a, const Zxid& b) {
  return a.epoch > b.epoch || (a.epoch == b.epoch && a.counter > b.counter);
}

bool zxidEq(const Zxid& a, const Zxid& b) {
  return a.epoch == b.epoch && a.counter == b.counter;
}

class ZabLeader {
  int epoch_ = 0;
  int counter_ = 0;
  std::vector<LogEntry> log_;
  std::vector<ZabServer*> peers_;
  int myId_;

 public:
  ZabLeader(std::vector<ZabServer*> peers, int myId)
      : peers_(std::move(peers)), myId_(myId) {}

  // --- Discovery: claim a fresh epoch ---
  void discovery() {
    epoch_ = maxAdvertisedEpoch(peers_) + 1;
    std::vector<std::future<void>> fs;
    for (auto* p : peers_) {
      fs.push_back(std::async(std::launch::async, [p, this] { p->newEpoch(epoch_); }));
    }
    for (auto& f : fs) f.get();
  }

  // --- Synchronization: ship missing txns, drop uncommitted strays ---
  void synchronize() {
    for (auto* p : peers_) {
      Zxid theirLast = p->lastZxid();
      std::vector<LogEntry> missing;
      for (const auto& e : log_) {
        if (zxidGt(e.zxid, theirLast)) missing.push_back(e);
      }
      p->applySync(missing);
      // any uncommitted entries on p that we don't have get dropped on p
    }
  }

  // --- Broadcast: Propose -> Ack -> Commit ---
  void broadcast(const std::string& txn) {
    counter_++;
    Zxid zxid{epoch_, counter_};
    log_.push_back({zxid, txn, false});

    auto acks = collectAcks(peers_, [&](ZabServer* p) { p->propose(zxid, txn); });
    if (acks.size() < majority(peers_.size())) throw std::runtime_error("no quorum");

    std::vector<std::future<void>> fs;
    for (auto* p : peers_) {
      fs.push_back(std::async(std::launch::async, [p, &zxid] { p->commit(zxid); }));
    }
    for (auto& f : fs) f.get();
    for (auto& e : log_) {
      if (zxidEq(e.zxid, zxid)) {
        e.committed = true;
        break;
      }
    }
  }
};`,
    },
  ],

  furtherReading: [
    {
      label: "Flavio Junqueira, Benjamin Reed & Marco Serafini — *Zab: High-performance broadcast for primary-backup systems* (DSN 2011)",
      href: "https://marcoserafini.github.io/assets/pdf/zab.pdf",
      note: "The canonical ZAB paper. Defines the three modes (discovery, sync, broadcast), states the invariants, and proves correctness.",
      kind: "paper",
    },
    {
      label: "Benjamin Reed & Flavio Junqueira — *A simple totally ordered broadcast protocol* (LADIS 2008)",
      href: "https://dl.acm.org/doi/10.1145/1529974.1529978",
      note: "The earlier, simpler write-up of ZAB. Useful for the intuition before tackling the 2011 paper.",
      kind: "paper",
    },
    {
      label: "Apache ZooKeeper — Internals: ZAB",
      href: "https://zookeeper.apache.org/doc/current/zookeeperInternals.html",
      note: "Official internals documentation explaining how the broadcast protocol is implemented in the production codebase, including epoch management and the leader election variants.",
      kind: "docs",
    },
    {
      label: "Patrick Hunt et al — *ZooKeeper: Wait-free coordination for Internet-scale systems* (USENIX ATC 2010)",
      href: "https://www.usenix.org/legacy/event/atc10/tech/full_papers/Hunt.pdf",
      note: "The ZooKeeper architecture paper. Explains why ZAB was designed the way it was — the API and consistency requirements drove the protocol's shape.",
      kind: "paper",
    },
    {
      label: "André Medeiros — *ZooKeeper's atomic broadcast protocol: Theory and practice* (Aalto report, 2012)",
      href: "https://www.tcs.hut.fi/Studies/T-79.5001/reports/2012-deSouzaMedeiros.pdf",
      note: "A clear walkthrough comparing the published ZAB spec with what's actually in ZooKeeper's source code — the divergences are real and instructive.",
      kind: "paper",
    },
    {
      label: "Junqueira & Reed — *ZooKeeper: Distributed Process Coordination* (O'Reilly, 2013)",
      href: "https://www.oreilly.com/library/view/zookeeper/9781449361297/",
      note: "Book-length treatment by the protocol's designers. The most accessible reference for understanding why ZAB and ZooKeeper look the way they do.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "zab-q1",
      question:
        "What's the safety reason ZAB elects the server with the highest zxid?",
      options: [
        { id: "a", label: "Performance — that server is usually closest to the clients." },
        { id: "b", label: "By the protocol's invariants, the server with the highest zxid must already hold every transaction committed in the previous epoch — so no committed write is lost across the leader change." },
        { id: "c", label: "Random fairness." },
        { id: "d", label: "ZooKeeper's clients refuse to talk to servers with low zxids." },
      ],
      correctOptionId: "b",
      explanation:
        "The highest-zxid rule isn't a heuristic — it's the safety guarantee. A server cannot be missing a committed transaction and still have the highest zxid, because committed means a quorum stored it, and any two quorums intersect. So electing the highest-zxid server is equivalent to electing a server that already has everything that mattered before the crash.",
    },
    {
      id: "zab-q2",
      question:
        "Why does ZAB synchronize all followers up to the leader *before* broadcast begins, instead of patching lazily on each write like Raft does?",
      options: [
        { id: "a", label: "Because ZooKeeper supports byzantine failures." },
        { id: "b", label: "Front-loading the sync makes the steady-state broadcast protocol trivial — every follower's log is identical, so there's no per-follower nextIndex bookkeeping per write." },
        { id: "c", label: "Because ZooKeeper writes are usually batched." },
        { id: "d", label: "Because the leader cannot append new writes until every follower acknowledges every prior one." },
      ],
      correctOptionId: "b",
      explanation:
        "ZAB's design choice: pay the cost once at the start of an epoch (sync), and the broadcast hot path stays simple. Raft makes the opposite trade — cheap election, per-follower gap repair via AppendEntries. Both are valid; they're different points in the design space.",
    },
    {
      id: "zab-q3",
      question:
        "A ZAB transaction's zxid is built from two parts. What are they, and why?",
      options: [
        { id: "a", label: "Wall-clock time + sequence number — for human readability." },
        { id: "b", label: "Epoch + counter — the epoch advances on every leader change, the counter on every write, so zxids are strictly increasing across leadership transitions." },
        { id: "c", label: "Client ID + request ID — for idempotency." },
        { id: "d", label: "Server ID + log offset — for shard routing." },
      ],
      correctOptionId: "b",
      explanation:
        "Epoch in the high 32 bits, counter in the low 32 bits. The epoch advances when a new leader takes over, so a new leader's first zxid is always greater than any prior leader's last zxid. That property — and the highest-zxid election rule — together guarantee FIFO total order across epoch changes.",
    },
  ],
};
