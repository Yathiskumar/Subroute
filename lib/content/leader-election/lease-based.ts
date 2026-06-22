import type { ConceptContent } from "@/lib/content/types";

export const leaseBased: ConceptContent = {
  prototypeCaption:
    "Five processes contending for a single TTL-bounded lease in a shared store. Pick a scenario — **Acquire & renew** (the holder renews before each expiry to stay leader), **Leader crash** (renewals stop, the TTL drains to zero, another node takes over), or **GC pause & fence** (a paused leader resumes after the lease was reissued and gets rejected by the epoch token). Free play lets you crash any node and force the lease to expire; the log card below holds only the last two messages.",

  overview: [
    {
      type: "p",
      text: "**Lease-based leader election** is what you do when you already have a strongly-consistent key-value store and you don't want to run another consensus cluster on top. The store holds one key — call it `/leader` — with a value `(holder, epoch, expiresAt)`. To lead, a process **acquires** that key with a TTL (compare-and-swap from \"empty/expired\" to \"me, epoch+1, now+TTL\"). To stay leader, it **renews** the key well before TTL elapses. If renewals stop, the TTL runs out, and the next process to try wins the empty slot.",
    },
    {
      type: "p",
      text: "The store is what makes this safe: every acquire goes through a single linearizable compare-and-swap, so at most one process can ever hold the lease in a given moment of store time. The TTL bounds how long a crashed leader's lease lingers. The **epoch** (also called a fence token) is the monotonically increasing revision returned by each acquire; every write the leader does carries the epoch, and the data store rejects writes from stale epochs — so a paused-then-resumed old leader cannot quietly resume control after a new one was elected. That's the entire safety argument, in three primitives.",
    },
    {
      type: "p",
      text: "This pattern is everywhere: Kubernetes controller-manager and scheduler use it via the `coordination.k8s.io/Lease` API; etcd and Consul ship native session/lease primitives that frameworks like Patroni, Vitess, and Knative wrap; Redis users implement it with `SET key val NX PX ttl` (with Redlock as the multi-master variant); Google's Chubby paper popularised it as a coordination primitive in 2006. If your problem is \"exactly one process at a time runs job X,\" lease-based election is almost always the right answer.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The three primitives" },
    {
      type: "ol",
      items: [
        "**Acquire** — atomic compare-and-swap: `if /leader is empty or expired, set it to (me, epoch+1, now+TTL) and return the new revision; else fail`.",
        "**Renew** — periodic compare-and-swap: `if /leader.holder == me, extend expiresAt to now+TTL`. Done well before expiry — typically at TTL/3.",
        "**Release** — voluntary: set `/leader` to empty so a successor can grab it immediately, no waiting for expiry.",
      ],
    },
    { type: "h", text: "Lifecycle" },
    {
      type: "ol",
      items: [
        "A process tries to acquire. If the store's `/leader` is empty or expired, the CAS succeeds; the process becomes leader and starts the renew loop.",
        "Renewals fire every `TTL / 3` ms. As long as the leader is alive and not partitioned, the lease never expires.",
        "If the leader crashes, gets partitioned, or its host pauses, renewals stop. The store's TTL counts down from `expiresAt`. Once `now >= expiresAt`, the lease is treated as empty.",
        "Other processes are watching `/leader` (etcd `watch`, Redis Sentinel pub/sub, ZK watcher). Each tries to acquire on the next tick; one wins the CAS, becomes leader with `epoch + 1`.",
        "All subsequent writes by the leader carry the epoch. The data store checks the token on every write: stale epoch → reject. This is what stops a resurrected old leader from corrupting anything.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "The clock-skew gotcha — and why fence tokens are non-negotiable",
      text: "Martin Kleppmann's famous 2016 critique of naive distributed locks is that TTL alone is not safe: if the leader's process pauses (long GC, VM stall, virt-suspended container) past the TTL, a new leader is elected — but when the old leader resumes, it doesn't know any of this. It continues writing to the data store as if it were still leader, producing two-writer disasters. The fix is a **fence token** (epoch / revision) carried on every write; the data store maintains \"highest epoch I've seen\" and rejects writes with stale tokens. etcd's `leaseRevision`, ZK's `zxid`, Spanner's TrueTime + lease all serve this role. Don't ship lease election without fence-token enforcement on the data path.",
    },
    {
      type: "callout",
      variant: "info",
      title: "What TTL should I pick?",
      text: "Three knobs interact: TTL (how long a stale lease lingers), renew interval (how often the leader pings the store), and failover SLA. Common rule of thumb: TTL = 10–30 s, renew at TTL/3 = 3–10 s, expect failover within TTL + one renew interval = up to ~40 s. Shorter TTL means faster failover but more store pressure and false expirations under load. Kubernetes defaults to a 15 s lease duration with 10 s renew deadline.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Singleton job pattern** — exactly-one cron, leader-only background worker, exactly-one controller. Kubernetes controllers, Spark drivers, scheduled compactions.",
        "**You already run a coordination service** — etcd, Consul, ZooKeeper, or Redis. Lease election piggybacks on it for free; no new infrastructure.",
        "**You want simple application code** — `acquire` returns a leadership token; the framework hides the renew loop and watch logic.",
        "**Multi-language clusters** — your election logic lives in one shared service, not in every language's Raft port.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You don't yet have a strongly-consistent store** — bootstrapping etcd just to host a lease is heavier than running Raft directly in your service.",
        "**Sub-second failover required** — TTL has to outlive a brief pause, so failover is bounded by TTL. If you need <100 ms failover, Raft heartbeats are faster.",
        "**No fence-token enforcement on the data store** — without it, lease election is not safe against GC pauses. Use a different scheme or add the fence token first.",
        "**Geo-replicated cluster on a flaky WAN** — frequent partitions cause leadership thrash; consider per-region leaders or a more partition-aware design.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Trivial application code** — three calls (acquire, renew, release) plus a fence token on writes.",
      "**Reuses an existing store** — no new consensus cluster, no new operational surface.",
      "**Cross-language by construction** — the store is the source of truth, application language is irrelevant.",
      "**Voluntary release is instant** — graceful shutdown hands the lease off without waiting for TTL.",
      "**Fence token comes for free** — most stores return a monotonically increasing revision on each acquire; carry it on every write.",
    ],
    cons: [
      "**Failover is bounded by TTL** — a 15 s lease means up to 15 s of writes-unavailability after a crash.",
      "**Clock skew & process pauses are the failure mode** — without a fence token, a paused leader can write after a new one is elected (Kleppmann's two-writers).",
      "**Tight coupling to the store** — your availability is at most the store's availability.",
      "**Renewal traffic is constant** — even a healthy leader hits the store every TTL/3 ms.",
      "**Thundering-herd on expiry** — many followers may simultaneously try to acquire when the lease frees, briefly spiking the store.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk Acquire & renew",
      body: "Open **Acquire & renew** and step through. P1 grabs the empty lease (revision becomes 1). The TTL bar drains as time passes; before it empties, P1 renews and the bar refills. Followers see `/leader = P1` and stay idle. Notice the cost: a constant heartbeat to the store regardless of activity. That's the price of using a single key as the election point.",
    },
    {
      title: "02 · Walk Leader crash",
      body: "Run **Leader crash**. P1 dies. Renewals stop. The TTL bar drains to zero unattended — followers see the lease is still technically held by P1, so they wait. The moment `expiresAt < now`, the lease becomes empty and a follower (say P3) wins the next compare-and-swap with revision 2. Failover took up to one full TTL. This is the lease's defining latency cost.",
    },
    {
      title: "03 · Walk GC pause & fence",
      body: "Run **GC pause & fence**. P1 holds revision 1; its process freezes (long GC pause). The TTL expires; P3 acquires with revision 2 and starts writing. P1 unfreezes and tries to write — *with revision 1*. The data store rejects the write (`stale fence token, current is 2`). P1 sees the error, steps down, and resets. Without the fence token, both processes would have written and corrupted state. This is the safety story.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Crash the leader at any TTL phase and watch the lease drain. Try voluntarily releasing the lease (instant handoff). Try crashing a follower — nothing happens, because only the leader's death matters. Try shortening the TTL slider: faster failover, more store traffic, more vulnerability to a brief pause being mistaken for a crash. Find the regime where your application would feel safe.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "lease_election.go",
      code: `// Lease-based leader election on top of an etcd-like store.
// The store provides linearizable CAS and returns a monotonically increasing revision.
package election

import (
	"errors"
	"time"
)

type Lease struct {
	Holder    string
	Epoch     int
	ExpiresAt int64 // unix millis
}

type CASResult struct {
	OK    bool
	Epoch int
}

type LeaseStore interface {
	Read() (*Lease, bool)
	// CAS: if current matches expected, write next and return new revision.
	CAS(expected *Lease, next Lease) CASResult
}

type LeaseLeader struct {
	me       string
	store    LeaseStore
	ttlMs    int64
	now      func() int64
	epoch    int
	isLeader bool
}

func NewLeaseLeader(me string, store LeaseStore, ttlMs int64, now func() int64) *LeaseLeader {
	return &LeaseLeader{me: me, store: store, ttlMs: ttlMs, now: now}
}

func (l *LeaseLeader) TryAcquire() bool {
	cur, present := l.store.Read()
	expired := !present || cur.ExpiresAt <= l.now()
	if !expired {
		return false
	}

	prevEpoch := 0
	var expected *Lease
	if present {
		prevEpoch = cur.Epoch
		expected = cur
	}
	r := l.store.CAS(expected, Lease{
		Holder:    l.me,
		Epoch:     prevEpoch + 1,
		ExpiresAt: l.now() + l.ttlMs,
	})
	if r.OK {
		l.epoch = r.Epoch
		l.isLeader = true
	}
	return r.OK
}

// RenewLoop runs forever: renew at TTL/3, give up the role on any CAS failure.
func (l *LeaseLeader) RenewLoop() {
	for l.isLeader {
		time.Sleep(time.Duration(l.ttlMs/3) * time.Millisecond)
		cur, present := l.store.Read()
		if !present || cur.Holder != l.me {
			l.isLeader = false
			return
		}
		next := *cur
		next.ExpiresAt = l.now() + l.ttlMs
		if !l.store.CAS(cur, next).OK {
			l.isLeader = false
		}
	}
}

// LeaderWrite: every leader write must carry the epoch so stale leaders can't sneak through.
func (l *LeaseLeader) LeaderWrite(write func(epoch int) error) error {
	if !l.isLeader {
		return errors.New("not leader")
	}
	return write(l.epoch)
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "LeaseElection.java",
      code: `// Lease-based leader election on top of an etcd-like store.
// The store provides linearizable CAS and returns a monotonically increasing revision.
import java.util.Optional;
import java.util.function.IntFunction;
import java.util.function.LongSupplier;

class LeaseElection {

    record Lease(String holder, int epoch, long expiresAt) {}

    record CasResult(boolean ok, int epoch) {}

    interface LeaseStore {
        Optional<Lease> read();
        /** CAS: if current matches expected, write next and return new revision. */
        CasResult cas(Lease expected, Lease next);
    }

    static class LeaseLeader {
        private final String me;
        private final LeaseStore store;
        private final long ttlMs;
        private final LongSupplier now;
        private int epoch = 0;
        private boolean isLeader = false;

        LeaseLeader(String me, LeaseStore store, long ttlMs, LongSupplier now) {
            this.me = me;
            this.store = store;
            this.ttlMs = ttlMs;
            this.now = now;
        }

        boolean tryAcquire() {
            Optional<Lease> cur = store.read();
            boolean expired = cur.isEmpty() || cur.get().expiresAt() <= now.getAsLong();
            if (!expired) return false;

            int prevEpoch = cur.map(Lease::epoch).orElse(0);
            Lease expected = cur.orElse(null);
            CasResult r = store.cas(expected,
                new Lease(me, prevEpoch + 1, now.getAsLong() + ttlMs));
            if (r.ok()) { epoch = r.epoch(); isLeader = true; }
            return r.ok();
        }

        /** Run forever: renew at TTL/3, give up the role on any CAS failure. */
        void renewLoop() throws InterruptedException {
            while (isLeader) {
                Thread.sleep(ttlMs / 3);
                Optional<Lease> cur = store.read();
                if (cur.isEmpty() || !cur.get().holder().equals(me)) {
                    isLeader = false;
                    return;
                }
                Lease c = cur.get();
                CasResult r = store.cas(c,
                    new Lease(c.holder(), c.epoch(), now.getAsLong() + ttlMs));
                if (!r.ok()) isLeader = false;
            }
        }

        /** Every leader write must carry the epoch so stale leaders can't sneak through. */
        <T> T leaderWrite(IntFunction<T> write) {
            if (!isLeader) throw new IllegalStateException("not leader");
            return write.apply(epoch);
        }
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "lease_election.py",
      code: `# Lease-based leader election on top of an etcd-like store.
# The store provides linearizable CAS and returns a monotonically increasing revision.
import time
from dataclasses import dataclass, replace
from typing import Callable, Optional, Protocol, TypeVar

T = TypeVar("T")


@dataclass
class Lease:
    holder: str
    epoch: int
    expires_at: float  # seconds


@dataclass
class CasResult:
    ok: bool
    epoch: int = 0


class LeaseStore(Protocol):
    def read(self) -> Optional[Lease]: ...
    # CAS: if current matches expected, write next and return new revision.
    def cas(self, expected: Optional[Lease], next: Lease) -> CasResult: ...


class LeaseLeader:
    def __init__(
        self,
        me: str,
        store: LeaseStore,
        ttl_s: float,
        now: Callable[[], float] = time.monotonic,
    ) -> None:
        self.me = me
        self.store = store
        self.ttl_s = ttl_s
        self.now = now
        self.epoch = 0
        self.is_leader = False

    def try_acquire(self) -> bool:
        cur = self.store.read()
        expired = cur is None or cur.expires_at <= self.now()
        if not expired:
            return False

        prev_epoch = cur.epoch if cur else 0
        r = self.store.cas(
            cur if expired else None,
            Lease(holder=self.me, epoch=prev_epoch + 1, expires_at=self.now() + self.ttl_s),
        )
        if r.ok:
            self.epoch = r.epoch
            self.is_leader = True
        return r.ok

    def renew_loop(self) -> None:
        """Run forever: renew at TTL/3, give up the role on any CAS failure."""
        while self.is_leader:
            time.sleep(self.ttl_s / 3)
            cur = self.store.read()
            if cur is None or cur.holder != self.me:
                self.is_leader = False
                return
            r = self.store.cas(cur, replace(cur, expires_at=self.now() + self.ttl_s))
            if not r.ok:
                self.is_leader = False

    def leader_write(self, write: Callable[[int], T]) -> T:
        """Every leader write must carry the epoch so stale leaders can't sneak through."""
        if not self.is_leader:
            raise RuntimeError("not leader")
        return write(self.epoch)`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "lease_election.cpp",
      code: `// Lease-based leader election on top of an etcd-like store.
// The store provides linearizable CAS and returns a monotonically increasing revision.
#include <chrono>
#include <functional>
#include <optional>
#include <stdexcept>
#include <string>
#include <thread>

struct Lease {
    std::string holder;
    int epoch;
    long long expiresAt; // unix millis
};

struct CasResult {
    bool ok;
    int epoch;
};

struct LeaseStore {
    virtual std::optional<Lease> read() = 0;
    // CAS: if current matches expected, write next and return new revision.
    virtual CasResult cas(const std::optional<Lease>& expected, const Lease& next) = 0;
    virtual ~LeaseStore() = default;
};

class LeaseLeader {
public:
    LeaseLeader(std::string me, LeaseStore& store, long long ttlMs,
                std::function<long long()> now)
        : me_(std::move(me)), store_(store), ttlMs_(ttlMs), now_(std::move(now)) {}

    bool tryAcquire() {
        auto cur = store_.read();
        bool expired = !cur || cur->expiresAt <= now_();
        if (!expired) return false;

        int prevEpoch = cur ? cur->epoch : 0;
        auto expected = expired ? cur : std::nullopt;
        CasResult r = store_.cas(expected,
            Lease{me_, prevEpoch + 1, now_() + ttlMs_});
        if (r.ok) { epoch_ = r.epoch; isLeader_ = true; }
        return r.ok;
    }

    // Run forever: renew at TTL/3, give up the role on any CAS failure.
    void renewLoop() {
        while (isLeader_) {
            std::this_thread::sleep_for(std::chrono::milliseconds(ttlMs_ / 3));
            auto cur = store_.read();
            if (!cur || cur->holder != me_) { isLeader_ = false; return; }
            Lease next = *cur;
            next.expiresAt = now_() + ttlMs_;
            if (!store_.cas(cur, next).ok) isLeader_ = false;
        }
    }

    // Every leader write must carry the epoch so stale leaders can't sneak through.
    template <typename T>
    T leaderWrite(const std::function<T(int)>& write) {
        if (!isLeader_) throw std::runtime_error("not leader");
        return write(epoch_);
    }

private:
    std::string me_;
    LeaseStore& store_;
    long long ttlMs_;
    std::function<long long()> now_;
    int epoch_ = 0;
    bool isLeader_ = false;
};`,
    },
  ],

  furtherReading: [
    {
      label: "Mike Burrows — *The Chubby Lock Service for Loosely-Coupled Distributed Systems* (OSDI 2006)",
      href: "https://research.google/pubs/the-chubby-lock-service-for-loosely-coupled-distributed-systems/",
      note: "The paper that popularised lease-based leader election at scale inside Google. Reads like a postmortem and a design doc rolled together.",
      kind: "paper",
    },
    {
      label: "Martin Kleppmann — *How to do distributed locking*",
      href: "https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html",
      note: "The canonical critique of TTL-only locks and the fence-token argument. Required reading before shipping lease election anywhere.",
      kind: "article",
    },
    {
      label: "Kubernetes — Leader Election (coordination.k8s.io/Lease)",
      href: "https://kubernetes.io/docs/concepts/architecture/leases/",
      note: "How Kubernetes controllers elect a single active replica via the Lease object. The pattern most teams will copy in 2026.",
      kind: "docs",
    },
    {
      label: "etcd — How to create a lease (v3.5)",
      href: "https://etcd.io/docs/v3.5/tutorials/how-to-create-lease/",
      note: "The reference open-source implementation of lease primitives. Walks through grant, keep-alive, revocation, and attaching a lease to a key for TTL-bounded coordination.",
      kind: "docs",
    },
    {
      label: "Redis docs — Distributed Locks (Redlock)",
      href: "https://redis.io/docs/latest/develop/use/patterns/distributed-locks/",
      note: "Redis' official guide. The Redlock algorithm and its critics (Kleppmann vs Antirez) — the classic debate about safe distributed locking on a non-consensus store.",
      kind: "docs",
    },
    {
      label: "Patroni — *PostgreSQL HA on top of etcd/Consul/Zookeeper leases*",
      href: "https://patroni.readthedocs.io/en/latest/dynamic_configuration.html",
      note: "Production Postgres failover using lease election as the building block. Shows the full pattern in deployed form — TTL tuning, fencing via the leader_lsn, edge cases.",
      kind: "docs",
    },
    {
      label: "Vitess — Topology Service & Leader Election",
      href: "https://vitess.io/docs/22.0/user-guides/configuration-basic/global-topo/",
      note: "Vitess's leader-election story for MySQL sharding: pluggable topology (etcd / ZooKeeper / Consul) and the lease pattern in deployed form.",
      kind: "docs",
    },
  ],

  quiz: [
    {
      id: "lease-q1",
      question: "Why does lease-based election need a TTL on the lease?",
      options: [
        { id: "a", label: "The store charges by row age." },
        { id: "b", label: "So a crashed leader's lease eventually expires and a new election can happen without manual intervention." },
        { id: "c", label: "Because TTLs make the network faster." },
        { id: "d", label: "To compress the lease key in memory." },
      ],
      correctOptionId: "b",
      explanation:
        "Without a TTL, a crashed leader's lease would persist forever and no successor could acquire it. The TTL bounds how long a stale lease lingers, at the cost of bounding worst-case failover latency to ~ one TTL.",
    },
    {
      id: "lease-q2",
      question:
        "A leader's process pauses (long GC) for longer than the TTL. The lease expires, a new leader is elected, then the old leader's process resumes. What stops the old leader from corrupting state?",
      options: [
        { id: "a", label: "Operating-system signals." },
        { id: "b", label: "The new leader sends a kill command to the old one." },
        { id: "c", label: "A monotonically increasing fence token (epoch) on every write; the data store rejects writes with stale tokens." },
        { id: "d", label: "TCP keepalive." },
      ],
      correctOptionId: "c",
      explanation:
        "Kleppmann's fence-token argument: TTL alone is not safe because the old leader doesn't know it's no longer leader. Each acquire returns a higher epoch; every leader write carries the epoch; the data store keeps \"highest epoch seen\" and rejects writes with stale tokens. The pause-and-resume leader fails the next write and steps down.",
    },
    {
      id: "lease-q3",
      question: "What's the most common production setup for lease-based leader election?",
      options: [
        { id: "a", label: "A standalone Bully implementation per service." },
        { id: "b", label: "Acquire/renew a key on an existing strongly-consistent store (etcd, Consul, ZooKeeper) with a TTL + fence token." },
        { id: "c", label: "A round-robin DNS rotation." },
        { id: "d", label: "A static config file declaring the leader." },
      ],
      correctOptionId: "b",
      explanation:
        "Lease election is the pattern Kubernetes, Patroni, Vitess, Knative and many others use. It piggybacks on whichever consensus-backed store the cluster already runs, removing the need to ship a second consensus implementation inside every service.",
    },
  ],
};
