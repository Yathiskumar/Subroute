import type { TopicContent } from "@/lib/content/types";

export const leaderElectionTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**Leader election is the trick of getting a group of equal machines to pick one of themselves to be in charge — without a referee.** Every replicated system needs it. Somebody has to own the write path, advance the schema, run the cron job, hold the lock. The algorithms here are the ways a cluster nominates that somebody, and — far more interestingly — how it re-nominates a replacement when the current leader goes silent.",
    },
    {
      type: "p",
      text: "All five solve the same shape of problem, but they make wildly different deals. **Bully** and **Ring** are the textbook algorithms — pure ID comparisons over fully connected or ring-shaped networks. **Raft-style** uses random timers and per-term majority votes; the ID does not decide the winner, timing and quorum do. **Lease-based** offloads the entire problem to a single mutable lock with a TTL — whoever holds it leads, whoever stops renewing loses. **ZooKeeper's** ephemeral-sequential scheme combines lease and watcher semantics into a herd-free, in-tree solution.",
    },
    {
      type: "p",
      text: "Open any production system that needs a single coordinator — etcd, Kubernetes controllers, Kafka KRaft, ZooKeeper, Patroni, Redis Sentinel, HashiCorp Consul, Spark standalone, ClickHouse Keeper — and one of these patterns is under the hood. The choice you make decides how fast failover is, how badly a network partition hurts you, and whether two nodes can ever briefly think they are both leader.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Where this shows up" },
    {
      type: "ul",
      items: [
        "**Replicated databases** — Postgres-HA via Patroni elects a primary; Redis Sentinel/Cluster elects a master per shard; MySQL Group Replication elects a writer.",
        "**Coordination services** — etcd and Consul run Raft elections internally; ZooKeeper runs ZAB's Fast Leader Election on ephemeral znodes.",
        "**Cron-style singletons** — Kubernetes controllers, Apache Spark drivers, scheduled jobs that must run on exactly one node use lease-based election against the API server.",
        "**Stream processing** — Kafka KRaft elects a controller via Raft; partition leaders are elected within the controller's metadata log.",
        "**Service-discovery & locks** — \"is this the canary?\" \"who owns this shard?\" \"who runs the compaction?\" — every answer flows out of a leader election somewhere.",
        "**Embedded routing protocols** — OSPF designated routers, IS-IS DIS election: a tiny leader election lives inside every link-state network.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Split-brain is the failure to avoid",
      text: "The whole point of leader election is **at most one leader at a time**. If two nodes both believe they are leader, both will accept writes and the cluster's invariants break. Each algorithm here has a different mechanism for preventing it — quorum (Raft), monotonic terms, lease expiry, ephemeral session — and understanding which mechanism stops split-brain is the most important thing you can learn about leader election.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Algorithm",
      bursts: "Picks by",
      precision: "Network shape",
      memory: "Failover trigger",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "Bully",
        bursts: "Highest ID wins",
        precision: "Fully connected, every node knows the others",
        memory: "Any node notices leader silent → starts election",
        bestFor: "Small static clusters; teaching the textbook algorithm.",
      },
      {
        algorithm: "Ring",
        bursts: "Highest ID collected on a clockwise pass",
        precision: "Logical ring (each node knows its successor)",
        memory: "Neighbour notices leader silent → starts token",
        bestFor: "Topologies that are already a ring; protocols with constrained connectivity.",
      },
      {
        algorithm: "Raft-style",
        bursts: "Per-term majority vote (timing breaks ties)",
        precision: "Any-to-any; needs 2f+1 to tolerate f failures",
        memory: "Election timer (150–300 ms) fires on a follower",
        bestFor: "Replicated state machines; the default election scheme of 2026 (etcd, Consul, CockroachDB).",
      },
      {
        algorithm: "Lease-based",
        bursts: "First to grab a free lock + keeps renewing",
        precision: "Shared store everyone can talk to (etcd, Redis, DB)",
        memory: "Lease TTL drains to zero with no renewal",
        bestFor: "Kubernetes-style singleton controllers; piggybacking on an existing strongly-consistent store.",
      },
      {
        algorithm: "ZooKeeper",
        bursts: "Smallest sequence number in /election",
        precision: "All nodes connected to a ZK ensemble",
        memory: "Ephemeral znode auto-deletes on session loss",
        bestFor: "Systems already running ZooKeeper; massive clusters where the no-herd watcher chain matters.",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to pick" },
    {
      type: "ul",
      items: [
        "**You already run a Raft/etcd/Consul cluster?** Use **lease-based** election against it. You get a battle-tested store, a fence token (the lease revision), and zero new infrastructure. This is the Kubernetes pattern.",
        "**You're building a replicated state machine from scratch?** Use **Raft-style** election as part of the consensus protocol — it pairs naturally with the log-replication state and gets you the term number you need anyway.",
        "**You already run ZooKeeper?** Use the **ephemeral-sequential znode** recipe. Watching only your predecessor is the textbook way to avoid an election storm when one node dies.",
        "**Small static cluster, simple shape, no shared store?** **Bully** or **Ring** still work fine for tens of nodes and are easy to implement. Just be honest about the O(n²) or O(n) message complexity at failover.",
        "**You want guaranteed at-most-one leader under any network partition?** Pick the algorithm whose safety rests on a **quorum** (Raft) or an **external lock with a fence token** (lease), not on timing alone — the textbook Bully and Ring algorithms can elect two leaders during certain partitions.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Fence tokens, not heartbeats",
      text: "Heartbeats tell you the old leader was probably alive recently. They don't stop it from doing damage right now if it's just been slow. The defence is a monotonically increasing **fence token** issued at election time — every write the leader does carries the token, and the store rejects writes with stale tokens. Raft uses the term; lease-based uses the lease revision; ZooKeeper uses the zxid. Without a fence token, a paused-then-resumed old leader can still corrupt state after the new one has been elected. Always design for that case.",
    },
  ],
};
