import type { ConceptContent } from "@/lib/content/types";

export const zookeeper: ConceptContent = {
  prototypeCaption:
    "Five processes electing a leader through ephemeral sequential znodes under `/election`. Pick a scenario — **Join & elect** (each process creates its znode, smallest wins), **Leader dies, no herd** (the leader's session expires; only its single watcher is notified), or **Mid-chain death** (a follower dies and its watcher re-points to the new predecessor; leader is unaffected). Free play lets you kill any node and watch the watch-chain reshuffle; the log card below holds only the last two messages.",

  overview: [
    {
      type: "p",
      text: "**ZooKeeper leader election** is the textbook recipe baked into the ZooKeeper data model itself. Every contender creates an **ephemeral sequential znode** under `/election`. The znode names look like `node-0000000001`, `node-0000000002`, ... — ZooKeeper assigns the sequence number atomically on create. The rule is brutally simple: **the process whose znode has the smallest sequence number is the leader**. Everyone else is a follower.",
    },
    {
      type: "p",
      text: "Two pieces of ZooKeeper machinery make this election cheap and safe. **Ephemeral znodes** disappear automatically when the owning client's session ends — crash, network gap, voluntary close, doesn't matter. So a dead leader's znode just vanishes, no separate liveness check needed. **Watches** let each follower be notified when a specific znode changes. The trick — published as a recipe by the ZooKeeper team — is that **each follower watches only the znode immediately before it** in the sorted list, not the leader. This single rule eliminates the *herd effect*: when one znode disappears, exactly *one* follower wakes up, not the entire cluster.",
    },
    {
      type: "p",
      text: "When the leader dies, only the second-smallest process is notified. It re-reads `/election`, sees no smaller znode exists, and declares itself leader. When a mid-chain follower dies, only the node *after* it gets notified — and after re-reading, that node still sees a smaller znode (so it isn't leader yet), so it just re-points its watch to its new predecessor. No election happens, no leader changes. This watcher-chain recipe is the most elegant production leader-election scheme — and a perfect example of how ZooKeeper's tiny primitive set composes into bigger guarantees.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The recipe — \"Lock & Leader Election\" from the ZooKeeper docs" },
    {
      type: "ol",
      items: [
        "Each contender connects to the ZK ensemble and gets a unique session.",
        "It creates `/election/node-`  with the `EPHEMERAL_SEQUENTIAL` flag. ZK returns the full name with an atomic sequence number, e.g. `/election/node-0000000003`.",
        "It lists `/election`'s children and sorts by sequence number.",
        "If its own znode has the **smallest** sequence: it is the leader. Take leadership and start work.",
        "If not: identify the znode immediately *before* its own. Set a **watch** on exactly that one znode. Sleep.",
        "When the watched znode is deleted, the watch fires. Repeat steps 3–5.",
      ],
    },
    { type: "h", text: "Why \"watch only your predecessor\" matters" },
    {
      type: "ul",
      items: [
        "**Herd avoidance** — if everyone watched the leader instead, all `n-1` followers would wake up simultaneously on a leader death and stampede ZK with re-reads. The predecessor-watch sends exactly one notification per death.",
        "**Locality** — each follower's reaction is fast (one watch fire, one read, one compare) and bounded.",
        "**Healing without elections** — a non-leader death triggers only its successor, which re-watches its new predecessor and goes back to sleep. The leader keeps leading, no election runs.",
        "**Fence token built in** — the znode's zxid (ZooKeeper transaction id) is a monotonically increasing token the new leader can carry on subsequent writes.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why ephemeral?",
      text: "An ephemeral znode is tied to the creating client's *session*. When the session ends — crash, partition past the session timeout, voluntary close — ZooKeeper itself deletes the znode. There is no application code to write for \"detect that I died.\" The session timeout is the lease TTL equivalent (typically 2 × tickTime to 20 × tickTime, e.g. 6–60 s). Choose it as you would a lease TTL: shorter = faster failover, more sensitive to brief pauses.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The \"is my znode still there?\" reconnect check",
      text: "After a network blip, a client might reconnect to a different ZK server. The session may have been preserved (good) or expired (bad). When the client reconnects, it should re-verify it still owns its znode before assuming it's still in the election — and certainly before assuming it's still leader. Most ZK client libraries (Curator's `LeaderLatch` / `LeaderSelector`) handle this for you; if you implement the recipe yourself, this is the single most common bug.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**You already run ZooKeeper** — Kafka pre-KRaft, HBase, Solr, HDFS, Hive, classic Hadoop stack. Lease election against ZK is free.",
        "**You want true herd-free notification** — the watch-chain recipe is the cleanest answer; a single death notifies exactly one node.",
        "**Mass elections across many groups** — many independent `/election/<group-id>/` paths can coexist; one ZK ensemble can host hundreds of leadership groups.",
        "**You want a fence token without thinking about it** — the zxid is monotonically increasing across all operations in the ensemble.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You don't run ZooKeeper** — bootstrapping ZK *for* leader election is overkill. Use etcd lease or run Raft directly.",
        "**Sub-second failover** — session timeout has to outlive a brief pause, so failover is bounded by the session timeout (typically several seconds). Raft heartbeats are faster.",
        "**Modern Kafka deployments** — KRaft mode (since Kafka 3.3) replaces ZooKeeper with internal Raft. New projects rarely choose ZK in 2026.",
        "**Multi-region setups** — ZK's quorum and session model don't love high-latency WANs. Per-region leaders or a region-aware design beats one global ensemble.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Herd-free by construction** — only one follower wakes up on any single death.",
      "**Leader liveness handled by ZK** — ephemeral znode + session timeout = no separate liveness protocol.",
      "**Built-in fence token** — every znode operation has a monotonically increasing zxid.",
      "**Composes** — the same ensemble hosts many independent election groups, distributed locks, config storage, and more.",
      "**Battle-tested recipe** — published as `recipes/recipes-elections.html` in the ZooKeeper docs; used by Hadoop, Solr, HBase, classic Kafka.",
    ],
    cons: [
      "**You need ZooKeeper** — running it just for election is heavy compared to a single Raft library inside your service.",
      "**Failover is bounded by session timeout** — typically multiple seconds; not sub-second.",
      "**ZK clients are notoriously easy to misuse** — session lifecycle handling and reconnect logic are the bug sources of the JVM era. Use Curator.",
      "**ZK ensemble operations are a separate skill** — observers, dynamic reconfig, snapshot management, transaction-log compaction — a whole second stack to operate.",
      "**Newer alternatives** — etcd lease election is functionally equivalent with a simpler client model and gRPC.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk Join & elect",
      body: "Open **Join & elect** and step through. P1 connects and creates `/election/node-0000000001` — it has the smallest sequence, so it's leader. P2 creates `node-0000000002`, sees a smaller predecessor, watches `node-0000000001`. P3..P5 do the same, each watching exactly the one before. End state: one leader, four watchers, each pointing at a different predecessor. Notice how the cost of joining is constant — one create, one list, one watch.",
    },
    {
      title: "02 · Walk Leader dies, no herd",
      body: "Run **Leader dies, no herd**. P1's session ends; ZK deletes `node-0000000001`. *Only* P2's watch fires (P3..P5 were watching different znodes). P2 re-lists `/election`, sees no smaller znode, and declares itself leader. P3..P5 are entirely unbothered — they didn't even wake up. That single-notification behaviour is the whole reason the predecessor-watch recipe exists.",
    },
    {
      title: "03 · Walk Mid-chain death",
      body: "Run **Mid-chain death**. P3 dies; ZK deletes `node-0000000003`. Only P4's watch fires. P4 re-lists, finds it still has a smaller znode (`node-0000000002`), so it is *not* leader — it just re-points its watch to `node-0000000002` (its new predecessor) and goes back to sleep. No election. No leader change. The cluster heals itself in one round trip. This is the cheap-failure mode you almost never see in Raft.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Crash any process and watch which single follower is notified. Try crashing the second-smallest before the leader — nothing happens to the leader, just the next-after gets re-watched. Try crashing P5 (the largest) — no one is watching it, so absolutely nothing happens. Try crashing two non-adjacent followers at once — two independent watch fires, two re-points, no election. The lazy locality is the appeal.",
    },
  ],

  code: {
    language: "typescript",
    filename: "zk-election.ts",
    code: `// ZooKeeper leader election (predecessor-watch recipe).
// The ZooKeeper client API is abstracted; in production, use Apache Curator.
type ZkPath = string;
interface ZkClient {
  createEphemeralSequential(parent: ZkPath, data: Uint8Array): Promise<ZkPath>;
  /** Returns the full paths of every child, sorted by sequence number. */
  getChildrenSorted(parent: ZkPath): Promise<ZkPath[]>;
  /** Set a one-shot watch; resolves when the watched node is deleted. */
  watchNodeDeletion(path: ZkPath): Promise<void>;
  /** Returns true if the path still exists. */
  exists(path: ZkPath): Promise<boolean>;
}

class ZkLeader {
  private myZnode: ZkPath | null = null;

  constructor(private readonly zk: ZkClient, private readonly base = "/election") {}

  /** Join the election and block until we become leader. */
  async leadOrBlock(): Promise<void> {
    this.myZnode = await this.zk.createEphemeralSequential(this.base, new Uint8Array());

    // Loop: re-check who's smallest after each predecessor death.
    while (true) {
      const children = await this.zk.getChildrenSorted(this.base);
      const myIdx = children.indexOf(this.myZnode);
      if (myIdx === -1) throw new Error("my znode vanished — session expired?");
      if (myIdx === 0) return;                          // smallest → leader

      const predecessor = children[myIdx - 1];
      // Watch only the predecessor — herd avoidance.
      if (await this.zk.exists(predecessor)) {
        await this.zk.watchNodeDeletion(predecessor);   // resolves on delete
      }
      // The predecessor died. Loop back, re-check, possibly re-watch.
    }
  }

  /** Voluntary step-down. */
  async resign(): Promise<void> {
    // Deleting the ephemeral znode triggers the watch on our successor.
    this.myZnode = null;
    // (Equivalent: close the session — ZK deletes it for us.)
  }
}`,
  },

  furtherReading: [
    {
      label: "Apache ZooKeeper — *ZooKeeper Recipes: Leader Election*",
      href: "https://zookeeper.apache.org/doc/current/recipes.html#sc_leaderElection",
      note: "The official recipe. Four paragraphs of prose that have driven every JVM-era election since 2008.",
      kind: "docs",
    },
    {
      label: "Patrick Hunt, Mahadev Konar, Flavio P. Junqueira, Benjamin Reed — *ZooKeeper: Wait-free coordination for Internet-scale systems* (USENIX ATC 2010)",
      href: "https://www.usenix.org/conference/usenix-atc-10/zookeeper-wait-free-coordination-internet-scale-systems",
      note: "The ZooKeeper paper. Section 3 explains the data model (ephemeral, sequential, watches) — every property the election recipe relies on. USENIX page links to the PDF.",
      kind: "paper",
    },
    {
      label: "Apache Curator — *LeaderLatch / LeaderSelector*",
      href: "https://curator.apache.org/docs/recipes-leader-latch/",
      note: "The high-level Java wrapper around the recipe. Handles reconnects, session loss, and the subtle bugs everyone hits when implementing ZK election by hand.",
      kind: "docs",
    },
    {
      label: "Flavio P. Junqueira, Benjamin C. Reed, Marco Serafini — *Zab: High-performance broadcast for primary-backup systems* (DSN 2011)",
      href: "https://www.semanticscholar.org/paper/Zab%3A-High-performance-broadcast-for-primary-backup-Junqueira-Reed/b02c6b00bd5dbdbd951fddb00b906c82fa80f0b3",
      note: "The Zab paper. The Fast Leader Election variant ZooKeeper itself uses to pick its own ensemble leader — different from the user-level recipe in this concept.",
      kind: "paper",
    },
    {
      label: "Benjamin Reed & Flavio Junqueira — *A simple totally ordered broadcast protocol* (LADIS 2008)",
      href: "https://dl.acm.org/doi/10.1145/1529974.1529978",
      note: "Earlier Zab description. Useful pairing with the 2011 paper for the historical evolution of the algorithm.",
      kind: "paper",
    },
    {
      label: "Junqueira & Reed — *ZooKeeper: Distributed Process Coordination* (O'Reilly, 2013)",
      href: "https://www.oreilly.com/library/view/zookeeper/9781449361297/",
      note: "Book by the original authors. Chapter 4 walks through the leader election recipe with Java code; the entire book is the practitioner's reference.",
      kind: "book",
    },
    {
      label: "Wikipedia — Apache ZooKeeper",
      href: "https://en.wikipedia.org/wiki/Apache_ZooKeeper",
      note: "Quick reference for znode types, watches, sessions — useful glossary while reading the recipe.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "zk-q1",
      question:
        "In the ZooKeeper election recipe, which process is the leader?",
      options: [
        { id: "a", label: "Whichever process has the highest IP." },
        { id: "b", label: "The process whose ephemeral sequential znode has the smallest sequence number." },
        { id: "c", label: "The process that started first." },
        { id: "d", label: "The first to acquire a global lock under /lock." },
      ],
      correctOptionId: "b",
      explanation:
        "Every contender creates an ephemeral sequential znode under `/election`. The znodes are sorted by ZK's atomically assigned sequence number, and the smallest wins. When that znode disappears (session ends), the next-smallest becomes leader.",
    },
    {
      id: "zk-q2",
      question:
        "Why does each follower watch only its predecessor's znode instead of watching the leader's znode?",
      options: [
        { id: "a", label: "Followers cannot watch the leader for security reasons." },
        { id: "b", label: "To avoid a herd effect: when one znode dies, only one follower is notified instead of every follower waking up at once." },
        { id: "c", label: "ZooKeeper does not allow watching the smallest child." },
        { id: "d", label: "It saves disk space in the ZK ensemble." },
      ],
      correctOptionId: "b",
      explanation:
        "If every follower watched the leader, all `n-1` followers would wake up simultaneously on a leader death and stampede ZK with re-reads. The predecessor-watch chain limits notification to exactly the next-in-line follower per death — herd-free by construction.",
    },
    {
      id: "zk-q3",
      question:
        "A non-leader process dies in a five-node ZK election. What happens?",
      options: [
        { id: "a", label: "Nothing happens to the leader; only the one follower watching the dead node is notified and re-points its watch to its new predecessor." },
        { id: "b", label: "A full election runs and a new leader is chosen." },
        { id: "c", label: "All followers re-list `/election` and re-elect." },
        { id: "d", label: "The leader steps down and rejoins as a follower." },
      ],
      correctOptionId: "a",
      explanation:
        "The recipe makes mid-chain failures essentially free. The single watcher of the dead znode is notified, re-lists children, sees there's still a smaller znode (so it isn't leader), and re-watches its new predecessor. The leader and the rest of the chain are unaffected. No election happens.",
    },
  ],
};
