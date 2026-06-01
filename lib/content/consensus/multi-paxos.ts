import type { ConceptContent } from "@/lib/content/types";

export const multiPaxos: ConceptContent = {
  prototypeCaption:
    "Five nodes running Multi-Paxos. Pick a scenario — **Elect a leader** (the one-time Phase 1), **Stream commands** (Phase 2 only, one RTT each), or **Crash the leader** to watch re-election kick in. Free play lets you queue arbitrary commands and crash whenever; the message log keeps only the last two lines.",

  overview: [
    {
      type: "p",
      text: "**Multi-Paxos** is what you actually use when you want a replicated log built on Paxos. Basic Paxos agrees on *one* value; a real system needs a *sequence* of values (a log of commands). The naive answer — run Basic Paxos once per log slot — burns two round-trips per command, plus risks live-lock from duelling proposers. Multi-Paxos fixes both with a single move: **elect a stable leader once, then skip Phase 1 forever after**.",
    },
    {
      type: "p",
      text: "The structure: a designated proposer (the leader) runs Paxos Phase 1 — Prepare/Promise — across a quorum, but with an extended ballot number that covers *every future slot*. Once a majority has promised, the leader has \"won the right to propose\" for as many slots as it wants. Each subsequent command goes through Phase 2 only — one Accept round-trip and the value is chosen. That's a 2× latency win in steady state, and the dueling-proposer livelock simply can't happen because there's only one proposer.",
    },
    {
      type: "p",
      text: "When the leader crashes, a survivor starts a new election with a higher ballot number, runs Phase 1 again, and takes over. Committed log entries are safe because they're already on a majority — the new leader, by the Paxos safety rule, will always learn about them during Promise. This same shape — leader + Phase-2-only steady state + leader change — is exactly what Raft and ZAB inherited. Multi-Paxos is the algorithm the modern world copies from.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Phase 1 (rare) — Elect a leader" },
    {
      type: "ol",
      items: [
        "Candidate picks a ballot number `b` higher than any seen before and sends `PREPARE(b)` once, to every acceptor — covering *all future slots*, not a specific one.",
        "Each acceptor: promises not to accept anything below `b` and replies with the highest-numbered value already accepted in *every* slot it knows about.",
        "When a majority promises, the candidate is the leader. It must reconcile any partially-accepted values from those promises (re-running Accept for any pending slot) before accepting new commands.",
      ],
    },
    { type: "h", text: "Phase 2 (common) — Stream commands" },
    {
      type: "ol",
      items: [
        "Client sends a command to the leader.",
        "Leader assigns the next free slot, picks its own value, and sends `ACCEPT(b, slot, value)` to every acceptor.",
        "Each acceptor stores the entry durably (if `b` matches its promise) and replies `ACCEPTED`.",
        "When a majority has stored it, the leader marks the slot **committed** and applies it to the local state machine. It piggybacks the commit on the next ACCEPT so followers apply it too. That's one RTT per command.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why Phase 1 is amortised",
      text: "One Prepare covers all future slots. As long as the leader stays alive, you never run Phase 1 again — Prepare's cost is paid once per leader, not once per command. With a leader lasting hours, the per-command cost is essentially one Accept round-trip.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Leader-change recovery is the hard part",
      text: "A new leader's Promise messages might report different values for different slots (some had ACCEPTED on one acceptor but not a majority). The leader must fill those slots before serving new traffic — re-running Accept for each. Real implementations also handle log compaction, snapshots, and membership changes here, which is why \"Paxos Made Live\" is twice as long as \"Paxos Made Simple.\"",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Replicated state machines / logs** — exactly the job description. Google Chubby, Megastore, parts of Spanner, and many F1 components run Multi-Paxos.",
        "**Existing Paxos investment** — if your team already speaks Paxos, you keep the wisdom; the structure is the same, just amortised.",
        "**You want the smallest-possible message envelope** — a Phase-2-only Accept is roughly the minimum protocol for committed-by-majority replication.",
        "**You need the proven foundation** — Multi-Paxos has been formally verified, model-checked, and run at hyperscale for two decades.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**You're picking a new replication library in 2026** — pick Raft. Same shape, friendlier to humans, more tooling.",
        "**Byzantine fault model** — Multi-Paxos assumes crash failures only. Use PBFT.",
        "**Single-decree only** — if you really do agree on exactly one value, Basic Paxos is enough.",
        "**You're new to the protocol and on a deadline** — the recovery edge cases (slot reconciliation, log gaps, membership changes) are where bugs live. Raft was designed exactly to make these easier.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Amortises the cost of Phase 1** — one Prepare per leader lifetime, then one Accept per command. Roughly half the latency of Basic Paxos.",
      "**No dueling-proposer livelock in steady state** — only the leader proposes; followers can't compete.",
      "**Same fault tolerance as Basic Paxos** — f failures of 2f+1 nodes.",
      "**Battle-tested at scale** — Google has run this in production for over twenty years.",
      "**Generalises cleanly** — Multi-Paxos is the structural template that Raft, ZAB, EPaxos, and Compartmentalised Paxos all build on.",
    ],
    cons: [
      "**Leader change is intricate** — slot reconciliation across the promise replies has fiddly edge cases that take care to implement.",
      "**Specification has more dark corners than Basic Paxos** — log compaction, snapshots, membership changes, leader leases — none of these are in the original paper.",
      "**Leader is a throughput bottleneck** — every write goes through it, so one node's CPU/network caps the cluster.",
      "**Brief unavailability during election** — bounded but real; clients see a few hundred ms of timeouts.",
      "**Harder to reason about than Raft** — same algorithm in essentials, but Raft's split into election + log replication is friendlier.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the one-time leader election",
      body: "Open the **Elect a leader** scenario. Step through Prepare → Promise → \"Leader set.\" That's the two-RTT Phase 1, paid exactly once. From here on, every command will be cheap.",
    },
    {
      title: "02 · Stream commands at one RTT each",
      body: "Switch to **Stream commands** (or stay on the same scenario after election). Hit the command buttons. Each command goes Leader → ACCEPT → majority ACCEPTED → Committed. One round-trip, no Prepare. Compare against Basic Paxos's two-RTT-per-value cost.",
    },
    {
      title: "03 · Crash the leader and watch failover",
      body: "Run **Crash the leader** at any point in steady state. The committed entries are safe (a majority still holds them). A survivor runs Phase 1 again with a higher ballot, becomes the new leader, and resumes streaming. This is the recovery story Multi-Paxos sells.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Try crashing the leader mid-command (after Accept but before Committed): the new leader must reconcile the pending slot. Try crashing again right after the new election. Try queueing four commands in a row to see throughput. The structural pattern — leader, slots, log, recovery — is identical to what you'll see next in Raft.",
    },
  ],

  code: {
    language: "typescript",
    filename: "multi-paxos.ts",
    code: `// Multi-Paxos leader. Election is rare; the steady-state hot path is
// just propose() which sends a single ACCEPT round-trip per command.
class MultiPaxosLeader {
  ballot: number;
  nextSlot = 0;
  log: ({ value: string; committed: boolean } | null)[] = [];

  constructor(private acceptors: Acceptor[], private myId: number) {
    this.ballot = 0;
  }

  async electSelf(): Promise<boolean> {
    this.ballot = nextHigherBallot(this.ballot, this.myId);

    // ONE prepare covers all future slots.
    const promises = await Promise.all(
      this.acceptors.map(a => a.prepare(this.ballot)),
    );
    const goodPromises = promises.filter(p => p !== "NACK") as Promise_[];
    if (goodPromises.length < majority(this.acceptors.length)) return false;

    // Reconcile partially-accepted slots: for each slot, if any promise
    // reported an acceptedV at any ballot, the leader MUST re-propose it.
    const pendingSlots = collectPendingSlots(goodPromises);
    for (const { slot, value } of pendingSlots) {
      await this.runAccept(slot, value);
      this.log[slot] = { value, committed: true };
    }
    this.nextSlot = this.log.length;
    return true;  // leader established; from here on, only Phase 2.
  }

  async propose(value: string): Promise<number> {
    const slot = this.nextSlot++;
    this.log[slot] = { value, committed: false };
    const ok = await this.runAccept(slot, value);
    if (ok) this.log[slot]!.committed = true;
    return slot;
  }

  private async runAccept(slot: number, value: string): Promise<boolean> {
    const replies = await Promise.all(
      this.acceptors.map(a => a.accept(this.ballot, slot, value)),
    );
    return replies.filter(r => r === "ACCEPTED").length
      >= majority(this.acceptors.length);
  }
}

// Notice: hot path is one all-to-all ACCEPT and a quorum count. No
// Prepare. That's the whole point of Multi-Paxos.`,
  },

  furtherReading: [
    {
      label: "Leslie Lamport — *Paxos Made Simple* (2001)",
      href: "https://lamport.azurewebsites.net/pubs/paxos-simple.pdf",
      note: "Section 3 introduces \"Implementing a State Machine,\" which is Multi-Paxos in three paragraphs. The starting point.",
      kind: "paper",
    },
    {
      label: "Tushar Chandra, Robert Griesemer & Joshua Redstone — *Paxos Made Live* (2007)",
      href: "https://www.cs.utexas.edu/users/lorenzo/corsi/cs380d/papers/paper2-1.pdf",
      note: "Google's experience building Chubby on Multi-Paxos. Everything the textbook elides — leases, membership changes, snapshots, the bugs they hit, the tooling they wrote.",
      kind: "paper",
    },
    {
      label: "Robbert van Renesse & Deniz Altinbuken — *Paxos Made Moderately Complex* (2015)",
      href: "https://www.cs.cornell.edu/courses/cs7412/2011sp/paxos.pdf",
      note: "The most complete pseudocode-level treatment of Multi-Paxos with replicas, leaders, acceptors. The pragmatic reference.",
      kind: "paper",
    },
    {
      label: "Diego Ongaro — *Consensus: Bridging Theory and Practice* (2014)",
      href: "https://github.com/ongardie/dissertation/raw/master/online.pdf",
      note: "Chapter 11 walks through Multi-Paxos in Raft's vocabulary and shows the structural equivalence — the clearest comparison side-by-side.",
      kind: "paper",
    },
    {
      label: "Heidi Howard — *Distributed Consensus Revised* (PhD, 2019)",
      href: "https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-935.pdf",
      note: "A unifying view of Multi-Paxos, Raft, Vertical Paxos, and Flexible Paxos. Shows they're variations on the same skeleton.",
      kind: "paper",
    },
    {
      label: "Heidi Howard — *Paxos vs Raft: have we reached consensus on distributed consensus?* (PaPoC 2020)",
      href: "https://arxiv.org/abs/2004.05074",
      note: "A direct comparison of Multi-Paxos and Raft showing that their differences are largely cosmetic; pick the one your team understands.",
      kind: "paper",
    },
  ],

  quiz: [
    {
      id: "mp-q1",
      question:
        "What's the central optimisation Multi-Paxos makes over running Basic Paxos repeatedly?",
      options: [
        { id: "a", label: "It uses TCP instead of UDP." },
        { id: "b", label: "It elects a stable leader once, then skips Phase 1 (Prepare/Promise) for every subsequent command." },
        { id: "c", label: "It requires fewer acceptors." },
        { id: "d", label: "It eliminates the safety rule, so the leader can always use its own value." },
      ],
      correctOptionId: "b",
      explanation:
        "Multi-Paxos's one big idea: one Prepare locks in a ballot covering *all future slots*. While that leader is alive, every command costs one round-trip (Accept only). Phase 1 is paid once per leadership, not once per command — that's where the 2× latency win comes from.",
    },
    {
      id: "mp-q2",
      question:
        "A new Multi-Paxos leader has just won election. Its promises report that one acceptor has an ACCEPTED entry for slot 7 but no other acceptor knows about it. What must the leader do?",
      options: [
        { id: "a", label: "Discard it — only the majority counts." },
        { id: "b", label: "Re-run ACCEPT for slot 7 with that value before serving any new commands — it might already be chosen elsewhere." },
        { id: "c", label: "Restart the election." },
        { id: "d", label: "Treat slot 7 as committed without further messages." },
      ],
      correctOptionId: "b",
      explanation:
        "This is the slot-reconciliation rule. The leader cannot know whether that value was eventually accepted by a majority before the old leader died. Paxos's safety invariant forces it to re-propose the same value, not invent a new one — otherwise it might overwrite a committed value. After reconciliation it's free to serve new commands.",
    },
    {
      id: "mp-q3",
      question:
        "Multi-Paxos and Raft share the same essential structure. Which of the following is the cleanest summary of the difference?",
      options: [
        { id: "a", label: "Raft tolerates more failures." },
        { id: "b", label: "Raft uses a different fault model (Byzantine vs crash)." },
        { id: "c", label: "Raft separates the algorithm into leader election + log replication + safety in a way that's easier to teach and implement, but the underlying mechanics are equivalent." },
        { id: "d", label: "Multi-Paxos doesn't need durable storage." },
      ],
      correctOptionId: "c",
      explanation:
        "Howard and Ongaro have shown the two protocols are essentially the same algorithm with different pedagogy. Multi-Paxos is older and more flexible; Raft is structurally identical but its three-part decomposition is what made it the default choice in modern systems.",
    },
  ],
};
