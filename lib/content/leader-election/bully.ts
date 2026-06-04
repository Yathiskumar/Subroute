import type { ConceptContent } from "@/lib/content/types";

export const bully: ConceptContent = {
  prototypeCaption:
    "Five processes with IDs P1..P5. Pick a scenario — **Leader dies** (P3 notices, runs an election, gets bullied by a higher ID), **Cascade failure** (two leaders die in a row, the next-highest survives), or **Old leader returns** (the failed top-ID rejoins and immediately re-bullies). Free play lets you crash any node and trigger your own elections; the log card below holds only the last two messages.",

  overview: [
    {
      type: "p",
      text: "**The Bully algorithm** is the textbook starting point for leader election. Published by Hector Garcia-Molina in 1982, it makes one ruthlessly simple promise: **the process with the highest ID is always the leader**. When the leader fails, any process that notices can start an election — and the algorithm guarantees that the election always converges on the highest-ID survivor, however many crashes have happened along the way.",
    },
    {
      type: "p",
      text: "It works on a fully connected network where every process knows every other process's ID. The dynamic is exactly what the name suggests: a low-ID process that starts an election gets *bullied out* by every higher-ID process that's still alive — they all reply OK and take over the election themselves. The highest-ID alive process eventually wins by default: nobody bullies it back. It then broadcasts COORDINATOR to everyone and the cluster goes back to work.",
    },
    {
      type: "p",
      text: "Bully is mostly of historical and pedagogical importance now. Real systems use Raft, ZAB, or lease-based election because Bully's all-to-all messaging is O(n²) at worst, it assumes a fully connected network, and the textbook version offers no guarantee against split-brain during a partition. But it captures the essence of leader election in two pages — the right place to start before the modern machinery makes sense.",
    },
  ],

  howItWorks: [
    { type: "h", text: "The protocol" },
    {
      type: "ol",
      items: [
        "Every process has a known unique ID. The process with the **highest ID** is by definition the leader.",
        "Each process periodically expects to hear from the current leader (a heartbeat or successful RPC). If the leader goes silent past a timeout, the process *suspects failure* and starts an election.",
        "**Election:** the suspecting process P sends an `ELECTION` message to every process with an ID *higher* than its own.",
        "If no higher-ID process answers within a timeout, P wins. It broadcasts `COORDINATOR(P)` to every process — done.",
        "If any higher-ID process Q answers `OK`, P drops out of contention (it has been bullied). Each Q now starts *its own* election, repeating step 3.",
        "Eventually the highest-alive ID has no higher-ID responder, declares itself leader, and broadcasts `COORDINATOR`.",
      ],
    },
    { type: "h", text: "Message complexity" },
    {
      type: "ul",
      items: [
        "**Best case** — the highest-alive ID notices first. One round of ELECTIONs (none answered) + one COORDINATOR broadcast = O(n) messages.",
        "**Worst case** — the lowest-alive ID notices first. Each higher ID then runs its own election, cascading up to the top. The textbook worst case is O(n²) messages.",
        "**Stable case** — once a leader is elected, the only traffic is the periodic heartbeat / RPC checks, plus occasional election noise. O(1) per heartbeat interval.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Two leaders during a partition",
      text: "If the network partitions so that, say, P5 (the leader) is on one side and {P1..P4} on the other, the lower side will run an election and crown P4 — because they cannot hear P5. Both sides now believe they have a leader. The textbook Bully algorithm has no quorum and no fence token to prevent this. Production usage either layers a quorum on top, or — much more commonly — picks a different algorithm. Bully on its own is **not** safe against partitions.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Why \"highest ID\"?",
      text: "Any total order over processes works — Bully would still be correct if the rule were \"lowest ID wins\" or \"longest hostname wins.\" Highest ID is just the convention. What matters is that the order is total and known: every process agrees on who is bigger than whom, so the algorithm converges on a single winner.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Teaching leader election** — the algorithm is two pages, the dynamic is intuitive, and it's the cleanest introduction to the problem.",
        "**Very small static clusters** (3–10 nodes) on a reliable fully-connected network, where simplicity beats safety guarantees you don't need.",
        "**Embedded systems / routing** — IS-IS DIS election and OSPF DR election use Bully-style \"highest priority wins\" inside a single broadcast segment.",
        "**Heuristics inside a larger protocol** — Bully sometimes appears as a tie-break inside a richer election (e.g. \"if tied on log length, highest server ID wins\").",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Replicated state machine over a real network** — use Raft. You need quorum-based safety, monotonic terms, and crash-recovery semantics Bully cannot give you.",
        "**Network can partition** — Bully has no split-brain defence. Use any quorum-based algorithm (Raft, Paxos, ZAB) or a lease against an external store.",
        "**Large clusters** (hundreds of nodes) — the O(n²) worst case bites hard. Lease-based or ZooKeeper's ephemeral-znode scheme scale far better.",
        "**You need a fence token** for safe writes after election — Bully's COORDINATOR carries no monotonic epoch. Use Raft's term, ZooKeeper's zxid, or a lease revision.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Two-page algorithm** — easy to teach, easy to implement, easy to debug.",
      "**Deterministic outcome** — given the same set of alive processes, the same winner is always picked (the highest ID).",
      "**No external dependency** — needs no shared store, no coordinator, no consensus library. Just point-to-point messaging.",
      "**Fast in the common case** — when the highest-alive ID notices first, the election finishes in one round.",
    ],
    cons: [
      "**O(n²) worst-case message complexity** — every node may run its own election in cascade.",
      "**Assumes a fully connected network** — every process must be able to address every other. Doesn't fit ring or partial-mesh topologies.",
      "**No partition safety** — separated subnetworks happily elect their own leaders. Split-brain by construction.",
      "**No fence token** — a paused-then-resumed old leader can write to backing stores after the new one is elected, corrupting state.",
      "**Liveness during turbulence is poor** — frequent failures cause repeated elections, each O(n²); the cluster can spend more time electing than working.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk Leader dies",
      body: "Open **Leader dies** and step through. P5 (the leader, ID 5) crashes. P3 — a mid-ID process — notices the leader's silence and starts an election. It sends ELECTION to P4 and P5, only P4 answers OK, P3 backs off, P4 then runs its own election, sees no higher alive ID, and broadcasts COORDINATOR. Notice the cascade — that's the textbook O(n²) shape.",
    },
    {
      title: "02 · Walk Cascade failure",
      body: "Run **Cascade failure**. P5 and P4 both crash; only P1, P2, P3 are alive. P1 starts an election, gets bullied by P3 (P4 and P5 don't answer), and P3 wins by default. Watch how the algorithm always converges on the highest-alive ID, no matter how many nodes died.",
    },
    {
      title: "03 · Walk Old leader returns",
      body: "Run **Old leader returns**. P5 dies and P4 becomes leader; then P5 restarts. As soon as P5 is back, it immediately starts an election and re-takes the crown — because the rule is *highest ID always wins*. This is the famous \"bully\" dynamic: a higher-ID rejoiner can disrupt a working cluster just by waking up.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Kill any node by clicking it. Trigger an election from any process you like. Try killing the leader and a higher ID simultaneously. Notice that the algorithm always converges on the same winner — the highest alive ID — regardless of who started the election or in what order failures occurred. That deterministic outcome is the appeal of Bully.",
    },
  ],

  code: {
    language: "typescript",
    filename: "bully.ts",
    code: `// Bully algorithm. Each process can be a candidate. Highest ID always wins.
type ProcId = number;
type Msg = { type: "election" | "ok" | "coord"; from: ProcId; to: ProcId };

class BullyProcess {
  constructor(
    public readonly id: ProcId,
    public readonly peers: ProcId[],
    private send: (m: Msg) => Promise<void>,
    private alive: (id: ProcId) => boolean,
  ) {}

  private leader: ProcId | null = null;
  private busy = false;

  /** Called when this process suspects the leader is dead. */
  async startElection(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      const higher = this.peers.filter(p => p > this.id);
      if (higher.length === 0) return this.declareSelfLeader();

      const acks = await Promise.race([
        this.askHigher(higher),
        sleep(ELECTION_TIMEOUT_MS).then(() => [] as ProcId[]),
      ]);

      if (acks.length === 0) {
        // No higher-ID process answered: I am the new leader.
        await this.declareSelfLeader();
      }
      // Otherwise: some higher-ID process took over. Wait for its COORDINATOR.
    } finally {
      this.busy = false;
    }
  }

  private async askHigher(higher: ProcId[]): Promise<ProcId[]> {
    const answers: ProcId[] = [];
    await Promise.all(higher.map(async to => {
      await this.send({ type: "election", from: this.id, to });
      if (this.alive(to)) answers.push(to);   // they will reply OK + start their own
    }));
    return answers;
  }

  async onMessage(m: Msg): Promise<void> {
    if (m.type === "election" && m.from < this.id) {
      await this.send({ type: "ok", from: this.id, to: m.from });
      this.startElection();              // I'm higher → take over the election
    }
    if (m.type === "coord") this.leader = m.from;
  }

  private async declareSelfLeader() {
    this.leader = this.id;
    await Promise.all(this.peers
      .filter(p => p !== this.id)
      .map(p => this.send({ type: "coord", from: this.id, to: p })));
  }
}

const ELECTION_TIMEOUT_MS = 500;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));`,
  },

  furtherReading: [
    {
      label: "Hector Garcia-Molina — *Elections in a Distributed Computing System* (IEEE TC, 1982)",
      href: "https://homepage.divms.uiowa.edu/~ghosh/Bully.pdf",
      note: "The original Bully paper. Twelve pages, plain prose; defines the problem and proves the algorithm converges. The right place to read it cover-to-cover.",
      kind: "paper",
    },
    {
      label: "Andrew S. Tanenbaum & Maarten van Steen — *Distributed Systems: Principles and Paradigms* (Chapter 6: Coordination)",
      href: "https://www.distributed-systems.net/index.php/books/ds3/",
      note: "The canonical textbook treatment of Bully and Ring algorithms with pseudocode and complexity analysis. Free PDF online.",
      kind: "book",
    },
    {
      label: "Wikipedia — Bully algorithm",
      href: "https://en.wikipedia.org/wiki/Bully_algorithm",
      note: "Clean prose summary with a worked five-process example. Good for quick reference and message-count back-of-envelope.",
      kind: "article",
    },
    {
      label: "Stallings — *Operating Systems: Internals and Design Principles*, Chapter on Distributed Process Management",
      href: "https://www.pearson.com/en-us/subject-catalog/p/operating-systems-internals-and-design-principles/P200000003445",
      note: "Bully appears in the distributed coordination chapter alongside Ricart–Agrawala and Lamport mutual exclusion. Useful context for where the algorithm sits historically.",
      kind: "book",
    },
    {
      label: "Bully algorithm — Coursera Cloud Computing Concepts lecture (Indranil Gupta)",
      href: "https://www.coursera.org/learn/cloud-computing-2",
      note: "Indranil Gupta's UIUC Cloud Computing course Week 4 walks through Bully, Ring, and Chang–Roberts with worked traces. The single most accessible video introduction.",
      kind: "video",
    },
    {
      label: "Kshemkalyani & Singhal — *Distributed Computing: Principles, Algorithms, and Systems*, §13.1",
      href: "https://www.cambridge.org/core/books/distributed-computing/E520A1A4E12D11B07AAB1A4DAAF2B82F",
      note: "Rigorous treatment of Bully and its variants (Stoller's modification, Bully-style with priority queues). Useful when you want to prove correctness rather than wave hands.",
      kind: "book",
    },
  ],

  quiz: [
    {
      id: "bully-q1",
      question: "In the Bully algorithm, which process becomes leader after an election?",
      options: [
        { id: "a", label: "The process that started the election." },
        { id: "b", label: "The process with the lowest ID among alive processes." },
        { id: "c", label: "The process with the highest ID among alive processes." },
        { id: "d", label: "A randomly chosen alive process." },
      ],
      correctOptionId: "c",
      explanation:
        "Bully's invariant is \"highest alive ID is leader,\" regardless of who started the election. A low-ID initiator gets bullied out by every higher-ID responder; each higher process then runs its own election; the highest-alive ID wins by default because nobody bullies it back.",
    },
    {
      id: "bully-q2",
      question: "What is the worst-case message complexity of the Bully algorithm?",
      options: [
        { id: "a", label: "O(1) — constant." },
        { id: "b", label: "O(log n)." },
        { id: "c", label: "O(n)." },
        { id: "d", label: "O(n²)." },
      ],
      correctOptionId: "d",
      explanation:
        "When the lowest-ID process notices the failure first, it sends ELECTION to every higher node, each of which then starts its own election to its higher neighbours, and so on. The cascade produces O(n²) messages. The best case is O(n) (when the highest-alive ID notices first).",
    },
    {
      id: "bully-q3",
      question:
        "Why is Bully alone usually inadequate for a production replicated database?",
      options: [
        { id: "a", label: "It is too slow even in the best case." },
        { id: "b", label: "It needs special hardware to compare process IDs." },
        { id: "c", label: "It has no quorum or fence token, so a network partition can elect two leaders." },
        { id: "d", label: "It only works on three nodes." },
      ],
      correctOptionId: "c",
      explanation:
        "Bully's safety relies on every process being able to hear every other. A network partition that hides the current leader from a subset of nodes lets that subset elect a second leader — and there's no fence token to stop the original leader's writes when it comes back. Production systems either layer a quorum on top or use a different algorithm.",
    },
  ],
};
