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

  code: {
    language: "typescript",
    filename: "pbft.ts",
    code: `// Skeleton of PBFT normal-case operation on a backup node.
// All cross-node messages are signed; signature checks omitted for clarity.
type Msg =
  | { kind: "PRE-PREPARE"; view: number; seq: number; op: string; from: number }
  | { kind: "PREPARE";     view: number; seq: number; op: string; from: number }
  | { kind: "COMMIT";      view: number; seq: number; from: number };

class PbftBackup {
  view = 0;
  prePrepare = new Map<number, string>();          // seq -> op
  prepares   = new Map<number, Map<number, string>>(); // seq -> from -> op
  commits    = new Map<number, Set<number>>();     // seq -> set of senders
  prepared   = new Set<number>();
  committed  = new Set<number>();

  constructor(private myId: number, private n: number) {}

  // 2f+1 quorum
  private quorum() { const f = Math.floor((this.n - 1) / 3); return 2 * f + 1; }

  onPrePrepare(m: Extract<Msg, { kind: "PRE-PREPARE" }>) {
    if (m.view !== this.view) return;
    if (this.prePrepare.has(m.seq)) return;            // already have one for this seq
    this.prePrepare.set(m.seq, m.op);
    this.broadcast({ kind: "PREPARE", view: this.view, seq: m.seq, op: m.op, from: this.myId });
  }

  onPrepare(m: Extract<Msg, { kind: "PREPARE" }>) {
    if (m.view !== this.view) return;
    if (!this.prePrepare.has(m.seq) || this.prePrepare.get(m.seq) !== m.op) return;
    let bag = this.prepares.get(m.seq);
    if (!bag) { bag = new Map(); this.prepares.set(m.seq, bag); }
    bag.set(m.from, m.op);
    // Need pre-prepare + 2f matching prepares from others = 2f+1 total.
    if (bag.size >= this.quorum() - 1 && !this.prepared.has(m.seq)) {
      this.prepared.add(m.seq);
      this.broadcast({ kind: "COMMIT", view: this.view, seq: m.seq, from: this.myId });
    }
  }

  onCommit(m: Extract<Msg, { kind: "COMMIT" }>) {
    if (m.view !== this.view) return;
    let set = this.commits.get(m.seq);
    if (!set) { set = new Set(); this.commits.set(m.seq, set); }
    set.add(m.from);
    if (set.size >= this.quorum() && !this.committed.has(m.seq) && this.prepared.has(m.seq)) {
      this.committed.add(m.seq);
      this.execute(this.prePrepare.get(m.seq)!);
      this.replyToClient(m.seq);
    }
  }

  private execute(_op: string) { /* apply to state machine */ }
  private replyToClient(_seq: number) { /* signed reply */ }
  private broadcast(_m: Msg) { /* send to all other n-1 nodes */ }
}`,
  },

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
