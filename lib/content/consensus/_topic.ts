import type { TopicContent } from "@/lib/content/types";

export const consensusTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**Consensus is the problem of getting a bunch of machines to agree on a single value, in the same order, even when some of them die or lie.** It sounds modest until you try to do it. Networks lose packets, clocks drift, processes crash mid-decision, and the same byte can arrive twice or never. A consensus algorithm is a recipe for surviving every one of those failure modes while still producing one answer that everybody — both survivors and recovered nodes — agrees on.",
    },
    {
      type: "p",
      text: "All the algorithms here solve the same core problem, but they make different deals. **2PC** is the textbook atomic-commit protocol — simple and blocking. **3PC** patches the worst blocking case by adding a phase. **Paxos** is the foundational provably-correct algorithm, and Lamport's notes still inform everything that came after. **Multi-Paxos**, **Raft**, and **ZAB** are the production variants — they elect a stable leader and stream commands cheaply. And **PBFT** raises the difficulty: instead of crashes, what if some nodes actively lie?",
    },
    {
      type: "p",
      text: "If a database survives partitions, a key-value store stays strongly consistent across replicas, or a blockchain orders transactions deterministically — under the hood it is running one of these. Etcd, Consul, CockroachDB, Spanner, TiKV, FoundationDB, MongoDB's replica sets, Kafka's controller quorum, ZooKeeper, Hyperledger, every modern PoS chain — pick one and you can name the algorithm.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Where this shows up" },
    {
      type: "ul",
      items: [
        "**Replicated key-value stores** — etcd, Consul, ZooKeeper all run a leader-based consensus (Raft, Raft, ZAB respectively) to keep N copies of the same map in the same order.",
        "**Distributed databases** — Spanner, CockroachDB, YugabyteDB, TiDB shard data into Raft groups so each shard's replicas always agree on the write order.",
        "**Coordination services** — leader election for cron jobs, distributed locks, service discovery — all need *one* answer the rest of the cluster can trust.",
        "**Atomic commit across services** — 2PC still ships in XA transactions, distributed SQL, microservice sagas (as a building block), and any \"all participants commit or all abort\" workflow.",
        "**Kafka & message brokers** — KRaft replaces ZooKeeper with an internal Raft for the metadata log; the controller quorum decides partition leadership.",
        "**Blockchains** — PBFT and its descendants (Tendermint, HotStuff, IBFT, Hyperledger Fabric's BFT order service) power permissioned and PoS chains where some validators might be hostile, not just crashed.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "FLP — and why we still solve it anyway",
      text: "The Fischer–Lynch–Paterson impossibility (1985) proves no deterministic asynchronous algorithm can guarantee consensus with even one faulty process. Real protocols dodge it with partial synchrony (assume timeouts eventually work) and randomized timers — that's why Raft randomizes election timeouts and Paxos retries with higher ballot numbers. The impossibility is real; we work around it by relaxing the model, not by ignoring it.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Algorithm",
      bursts: "Fault model",
      precision: "Quorum",
      memory: "Steady-state RTTs",
      bestFor: "Best for",
    },
    rows: [
      {
        algorithm: "2PC",
        bursts: "Coordinator + participants",
        precision: "All-of-N",
        memory: "2 RTTs (vote + decide)",
        bestFor: "Atomic commit across known participants, brief, low-stakes blocking acceptable.",
      },
      {
        algorithm: "3PC",
        bursts: "Crash failures",
        precision: "All-of-N",
        memory: "3 RTTs",
        bestFor: "Atomic commit that must not block on coordinator failure — synchronous network only.",
      },
      {
        algorithm: "Paxos",
        bursts: "Crash failures",
        precision: "Majority (f+1 of 2f+1)",
        memory: "2 RTTs per value",
        bestFor: "Single-decree consensus, theoretical foundation, the algorithm every other modern one descends from.",
      },
      {
        algorithm: "Multi-Paxos",
        bursts: "Crash failures",
        precision: "Majority",
        memory: "1 RTT (after election)",
        bestFor: "High-throughput replicated logs — Spanner, Chubby, Megastore.",
      },
      {
        algorithm: "Raft",
        bursts: "Crash failures",
        precision: "Majority",
        memory: "1 RTT (after election)",
        bestFor: "Same job as Multi-Paxos, easier to implement and reason about — etcd, Consul, CockroachDB.",
      },
      {
        algorithm: "ZAB",
        bursts: "Crash failures",
        precision: "Majority",
        memory: "1 RTT (broadcast)",
        bestFor: "Total-order atomic broadcast for a coordination service — ZooKeeper.",
      },
      {
        algorithm: "PBFT",
        bursts: "Byzantine (lying) failures",
        precision: "2f+1 of 3f+1",
        memory: "3 all-to-all rounds",
        bestFor: "Permissioned blockchains, BFT replication where nodes may actively misbehave.",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to pick" },
    {
      type: "ul",
      items: [
        "**Single transaction across services?** Reach for **2PC** if you can tolerate a brief block on coordinator failure, or pair it with a saga for compensating actions. Don't reach for Paxos here — it solves a different shape of problem.",
        "**You need atomic commit but cannot tolerate the 2PC blocking case?** **3PC** in a synchronous network, or — more often in 2026 — replicate the coordinator itself with Raft so its decision survives a crash.",
        "**Replicated log / state machine, crash failures only?** **Raft**. It's the default in 2026: well-understood, libraries everywhere, clear leader semantics. Reach for **Multi-Paxos** only if you already speak it fluently or interoperate with a Paxos system.",
        "**Building a coordination service or ordered broadcast?** **ZAB** is the in-tree choice for ZooKeeper; for anything new, you'd still pick Raft.",
        "**Some nodes might be malicious, not just slow?** **PBFT** or one of its descendants (Tendermint, HotStuff, IBFT). The cost: O(n²) messages and 3f+1 nodes to tolerate f liars.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Crash-fault is almost always enough",
      text: "Inside one trust boundary — your own data centre, your own replicas — assume crash failures and pick Raft. Byzantine tolerance is for crossing trust boundaries (open consortia, permissioned blockchains) where you literally don't trust the other nodes. Don't pay the BFT message-complexity tax to defend against your own servers.",
    },
  ],
};
