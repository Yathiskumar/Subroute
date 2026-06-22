import type { ConceptContent } from "@/lib/content/types";

export const ring: ConceptContent = {
  prototypeCaption:
    "Five processes arranged in a clockwise ring. Pick a scenario — **Leader dies** (one node notices, sends its own ID around; only larger IDs propagate forward), **Concurrent starts** (two nodes initiate at the same time and the higher ID swallows the lower one), or **Mid-ring failure** (a non-leader dies and the ring routes around it). Free play lets you crash any node and seed your own elections; the log card below holds only the last two messages.",

  overview: [
    {
      type: "p",
      text: "**The Ring algorithm** arranges processes into a logical ring — each one knows only its clockwise successor. Elections happen by passing a single message around the ring, and the highest ID is still the winner. There are two famous variants: **Le Lann's algorithm** (1977) accumulates every ID it visits, picks the max at the end, and uses O(n²) messages. **Chang–Roberts (1979)** is the efficient version every textbook teaches: each message carries a single ID, a process forwards only IDs greater than its own, and the algorithm finishes in 3n−1 messages in the best case.",
    },
    {
      type: "p",
      text: "The key Chang–Roberts rule is: **if the incoming ID is greater than mine, forward it. If it's less than mine and I'm not already participating, replace it with my ID and forward. If it's less and I'm already participating, discard it. If it's equal to my ID, I am the leader — start the COORDINATOR phase.** The discard rule is what kills the O(n²) of Le Lann: bid messages with a smaller ID than the current participant cannot propagate further.",
    },
    {
      type: "p",
      text: "Ring election was the practical choice for token-ring networks of the 1980s and still shows up wherever the physical or logical topology is already a ring — IBM Token Ring, FDDI, some peer-to-peer overlays, and as a sub-component inside larger fault-tolerant protocols. As with Bully, modern replicated systems use Raft or lease-based election instead, but Ring is the cleanest example of how a structural constraint (the ring) can replace the all-to-all messaging of Bully.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Chang–Roberts protocol" },
    {
      type: "ol",
      items: [
        "Every process knows its clockwise successor only — no other peers required.",
        "When a process P suspects the leader is dead, it becomes a *participant*, sends `ELECTION(P)` (its own ID) clockwise, and starts waiting.",
        "When process Q receives `ELECTION(id)`:  if `id > Q.id`, forward unchanged and become a participant.",
        "If `id < Q.id` and Q is *not* a participant, replace with `ELECTION(Q.id)` and forward — become a participant.",
        "If `id < Q.id` and Q *is* already a participant, **discard** the message (someone bigger than you is already in the running).",
        "If `id == Q.id`, the message has travelled the full ring and Q is the highest. Q becomes leader and sends `COORDINATOR(Q.id)` clockwise to announce.",
        "Every process forwards COORDINATOR exactly once, sets its leader to Q, exits participant mode, and the election is over.",
      ],
    },
    { type: "h", text: "Failures along the way" },
    {
      type: "ul",
      items: [
        "**Successor died** — each process must know its successor's successor (a small static list) and reroute around the gap.",
        "**Initiator died during election** — its own bid lapses; whichever other process is awaiting the COORDINATOR will time out and start a new election.",
        "**Two simultaneous initiators** — both forward their IDs; the higher one absorbs the lower (rule 3 → discard), so still exactly one winner.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why 3n − 1 messages?",
      text: "Best-case Chang–Roberts: the highest-ID node starts the election. Its bid travels n hops to come back to itself (1 ELECTION × n). Every other bid is discarded immediately by the highest node so they cost nothing. Then COORDINATOR makes one full lap (n − 1 messages, since the leader doesn't message itself). Total: n + (n − 1) = 2n − 1. Worst case (lowest-ID starter) adds another lap of \"absorbed\" bids and lands at 3n − 1.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Le Lann vs Chang–Roberts — and what the reference simulator does",
      text: "Le Lann's variant accumulates every visited ID in the message (`[3,4,5,1,2]`), forwards everything, and picks the max at the end — O(n²) messages but the algorithm is one line shorter. Chang–Roberts is what production protocols implement. The prototype here teaches Chang–Roberts because the discard rule is the interesting bit; some textbooks use Le Lann to visualise the running max.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When it's the right tool" },
    {
      type: "ul",
      items: [
        "**Your topology is already a ring** — token-ring LANs, FDDI, some peer-to-peer overlays. The election just hops along existing edges.",
        "**Bandwidth is the bottleneck** — each forwarded message is tiny (one ID) and traffic is bounded by O(n).",
        "**Teaching the discard / participant rule** — the cleanest example of how state per process can shrink message complexity.",
        "**Inside larger protocols** — token-passing mutual exclusion and group-membership protocols often use a ring-style election as a sub-step.",
      ],
    },
    { type: "h", text: "When to reach for something else" },
    {
      type: "ul",
      items: [
        "**Fully connected modern data centre** — every node already talks to every other; the ring constraint adds latency for no benefit. Use Raft.",
        "**Frequent membership changes** — the ring has to be rewired on every join/leave, and out-of-sync successor pointers cause messages to vanish.",
        "**Strict safety against partitions** — Ring has no quorum. A partition into two arcs lets each arc elect its own leader.",
        "**Latency-sensitive failover** — election takes ~n hops in latency, even in the best case. Lease-based or Raft are sub-RTT in the common case.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "**Single-ID messages** — bandwidth-cheap and easy to log.",
      "**Only neighbour knowledge required** — no all-to-all addressing.",
      "**Deterministic winner** — the highest alive ID, every time.",
      "**Chang–Roberts is O(n) on average** — far better than Bully's worst case.",
    ],
    cons: [
      "**Ring repair is non-trivial** — a dead successor leaves the ring broken; recovering needs a stored successor-list or a separate ring-maintenance protocol.",
      "**Latency proportional to ring length** — election takes O(n) hops in series, even in the best case.",
      "**No quorum** — a partition into two arcs lets each arc crown its own leader. Same split-brain problem as Bully.",
      "**Fragile under high churn** — joins and leaves race against in-flight election messages and can lose the bid.",
      "**No fence token** — COORDINATOR carries no monotonic epoch, so a paused-then-resumed old leader can still write after a new one is elected.",
    ],
  },

  handsOn: [
    {
      title: "01 · Walk Leader dies",
      body: "Open **Leader dies**. P5 (the leader, ID 5) crashes. P1 notices first and sends ELECTION(1). P2 sees 1 < 2 and (not a participant) bumps it to ELECTION(2). P3 → ELECTION(3). P4 → ELECTION(4). The ring skips dead P5 and returns to P1, which is now a participant. P1 forwards 4 onward. When the ELECTION(4) makes it back to P4, P4 wins. Notice the rule pattern: a bid only grows; it never shrinks.",
    },
    {
      title: "02 · Walk Concurrent starts",
      body: "Run **Concurrent starts**. P2 and P4 both notice the leader is gone and both start elections at the same time. ELECTION(4) absorbs ELECTION(2) the moment it passes any participant whose ID ≥ 4 — P2's bid is discarded by the discard rule. Only one bid ever completes the loop: the higher one. This is the property that gives Chang–Roberts its single-winner guarantee.",
    },
    {
      title: "03 · Walk Mid-ring failure",
      body: "Run **Mid-ring failure**. P3 (a follower, not the leader) dies. No election is needed — the ring just routes around it. The successor pointers heal, P1 → P2 → P4 → P5 → P1, the leader stays the same, and the cluster keeps working. Failover only happens when the *leader* goes silent.",
    },
    {
      title: "04 · Free play — break it yourself",
      body: "Open **Free play**. Crash any node and start an election from anyone you like. Try crashing P5 then P4 in quick succession — the ring keeps converging on the highest remaining ID. Try starting two elections at once from neighbouring nodes; the higher absorbs the lower. The deterministic outcome — highest alive ID wins — is the same property as Bully, just achieved with O(n) messages on a ring instead of O(n²) on a clique.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "ring_election.go",
      code: `// Chang-Roberts ring election. Each process knows only its clockwise successor.
package election

type ProcID = int

type Msg struct {
	Kind   string // "election" | "coord"
	ID     ProcID // for "election"
	Leader ProcID // for "coord"
}

type RingProcess struct {
	ID          ProcID
	participant bool
	Leader      *ProcID                // nil means none
	next        func(m Msg)            // send to clockwise successor
}

func NewRingProcess(id ProcID, next func(m Msg)) *RingProcess {
	return &RingProcess{ID: id, next: next}
}

// StartElection is triggered when this process suspects the leader is dead.
func (p *RingProcess) StartElection() {
	if p.participant {
		return
	}
	p.participant = true
	p.next(Msg{Kind: "election", ID: p.ID})
}

func (p *RingProcess) OnMessage(m Msg) {
	switch m.Kind {
	case "election":
		switch {
		case m.ID > p.ID:
			p.participant = true
			p.next(m) // forward larger bid
		case m.ID < p.ID && !p.participant:
			p.participant = true
			p.next(Msg{Kind: "election", ID: p.ID}) // bump to my ID
		case m.ID < p.ID && p.participant:
			return // discard - smaller bid
		default: // m.ID == p.ID -> we are the winner
			p.participant = false
			id := p.ID
			p.Leader = &id
			p.next(Msg{Kind: "coord", Leader: p.ID})
		}

	case "coord":
		p.participant = false
		leader := m.Leader
		p.Leader = &leader
		if m.Leader != p.ID {
			p.next(m) // forward one lap
		}
	}
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "RingElection.java",
      code: `// Chang-Roberts ring election. Each process knows only its clockwise successor.
import java.util.function.Consumer;

class RingProcess {
    record Msg(String kind, int id, int leader) {} // kind: "election" | "coord"

    static Msg election(int id) { return new Msg("election", id, 0); }
    static Msg coord(int leader) { return new Msg("coord", 0, leader); }

    final int id;
    private final Consumer<Msg> next; // send to clockwise successor
    private boolean participant = false;
    Integer leader = null;

    RingProcess(int id, Consumer<Msg> next) {
        this.id = id;
        this.next = next;
    }

    /** Triggered when this process suspects the leader is dead. */
    void startElection() {
        if (participant) return;
        participant = true;
        next.accept(election(id));
    }

    void onMessage(Msg m) {
        if (m.kind().equals("election")) {
            if (m.id() > id) {
                participant = true;
                next.accept(m);                  // forward larger bid
            } else if (m.id() < id && !participant) {
                participant = true;
                next.accept(election(id));       // bump to my ID
            } else if (m.id() < id) {            // && participant
                return;                          // discard - smaller bid
            } else {                             // m.id() == id -> we are the winner
                participant = false;
                leader = id;
                next.accept(coord(id));
            }
        }

        if (m.kind().equals("coord")) {
            participant = false;
            leader = m.leader();
            if (m.leader() != id) next.accept(m); // forward one lap
        }
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "ring_election.py",
      code: `# Chang-Roberts ring election. Each process knows only its clockwise successor.
from dataclasses import dataclass
from typing import Callable, Optional


@dataclass
class Msg:
    kind: str  # "election" | "coord"
    id: int = 0      # for "election"
    leader: int = 0  # for "coord"


class RingProcess:
    def __init__(self, id: int, next: Callable[[Msg], None]) -> None:
        self.id = id
        self._next = next  # send to clockwise successor
        self.participant = False
        self.leader: Optional[int] = None

    def start_election(self) -> None:
        """Triggered when this process suspects the leader is dead."""
        if self.participant:
            return
        self.participant = True
        self._next(Msg("election", id=self.id))

    def on_message(self, m: Msg) -> None:
        if m.kind == "election":
            if m.id > self.id:
                self.participant = True
                self._next(m)                          # forward larger bid
            elif m.id < self.id and not self.participant:
                self.participant = True
                self._next(Msg("election", id=self.id))  # bump to my ID
            elif m.id < self.id and self.participant:
                return                                 # discard - smaller bid
            else:  # m.id == self.id -> we are the winner
                self.participant = False
                self.leader = self.id
                self._next(Msg("coord", leader=self.id))

        if m.kind == "coord":
            self.participant = False
            self.leader = m.leader
            if m.leader != self.id:
                self._next(m)                          # forward one lap`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "ring_election.cpp",
      code: `// Chang-Roberts ring election. Each process knows only its clockwise successor.
#include <functional>
#include <optional>
#include <string>

using ProcId = int;

struct Msg {
    std::string kind; // "election" | "coord"
    ProcId id = 0;     // for "election"
    ProcId leader = 0; // for "coord"
};

class RingProcess {
public:
    std::optional<ProcId> leader;

    RingProcess(ProcId id, std::function<void(const Msg&)> next)
        : id_(id), next_(std::move(next)) {} // next sends to clockwise successor

    // Triggered when this process suspects the leader is dead.
    void startElection() {
        if (participant_) return;
        participant_ = true;
        next_(Msg{"election", id_, 0});
    }

    void onMessage(const Msg& m) {
        if (m.kind == "election") {
            if (m.id > id_) {
                participant_ = true;
                next_(m);                          // forward larger bid
            } else if (m.id < id_ && !participant_) {
                participant_ = true;
                next_(Msg{"election", id_, 0});     // bump to my ID
            } else if (m.id < id_ && participant_) {
                return;                            // discard - smaller bid
            } else { // m.id == id_ -> we are the winner
                participant_ = false;
                leader = id_;
                next_(Msg{"coord", 0, id_});
            }
        }

        if (m.kind == "coord") {
            participant_ = false;
            leader = m.leader;
            if (m.leader != id_) next_(m);         // forward one lap
        }
    }

private:
    ProcId id_;
    std::function<void(const Msg&)> next_;
    bool participant_ = false;
};`,
    },
  ],

  furtherReading: [
    {
      label: "Ernest Chang & Rosemary Roberts — *An Improved Algorithm for Decentralized Extrema-Finding in Circular Configurations of Processes* (CACM, 1979)",
      href: "https://dl.acm.org/doi/10.1145/359104.359108",
      note: "The original Chang–Roberts paper. Six pages; introduces the participant / discard optimisation that makes ring election O(n) on average.",
      kind: "paper",
    },
    {
      label: "Gérard Le Lann — *Distributed Systems: Towards a Formal Approach* (IFIP Congress, 1977)",
      href: "https://inria.hal.science/hal-03504338",
      note: "The earlier accumulating-IDs ring algorithm that Chang–Roberts improves. Useful historical context; hosted at HAL Inria.",
      kind: "paper",
    },
    {
      label: "Andrew S. Tanenbaum & Maarten van Steen — *Distributed Systems: Principles and Paradigms*, §6.5.1",
      href: "https://www.distributed-systems.net/index.php/books/ds3/",
      note: "Textbook side-by-side of Bully and Ring with pseudocode and worked traces. Free PDF online.",
      kind: "book",
    },
    {
      label: "Indranil Gupta — UIUC CS425 lecture on Leader Election",
      href: "https://courses.grainger.illinois.edu/cs425/fa2023/L17.FA23.pdf",
      note: "Slide deck (PDF) walking through Bully, Ring, and Chang–Roberts with running examples and complexity bounds. Single best free lecture treatment.",
      kind: "article",
    },
    {
      label: "Hagit Attiya & Jennifer Welch — *Distributed Computing: Fundamentals, Simulations, and Advanced Topics*, Chapter on Leader Election in Rings",
      href: "https://www.wiley.com/en-us/Distributed+Computing%3A+Fundamentals%2C+Simulations%2C+and+Advanced+Topics%2C+2nd+Edition-p-9780471453246",
      note: "Rigorous analysis: lower bounds for ring election (Ω(n log n) for comparison-based asynchronous rings), the Hirschberg–Sinclair improvement, and bidirectional algorithms.",
      kind: "book",
    },
    {
      label: "Wikipedia — Chang and Roberts algorithm",
      href: "https://en.wikipedia.org/wiki/Chang_and_Roberts_algorithm",
      note: "Compact summary with a worked five-node example and the proof sketch of 3n−1 worst-case message complexity.",
      kind: "article",
    },
  ],

  quiz: [
    {
      id: "ring-q1",
      question:
        "In Chang–Roberts, what happens when a participant process receives an ELECTION message with an ID smaller than its own?",
      options: [
        { id: "a", label: "Forward it unchanged." },
        { id: "b", label: "Replace it with its own ID and forward." },
        { id: "c", label: "Discard the message." },
        { id: "d", label: "Send an OK response and start its own election." },
      ],
      correctOptionId: "c",
      explanation:
        "The discard rule is the entire optimisation. If you are already a participant, a smaller incoming bid cannot win — someone bigger than that is already in the running. Dropping it on the floor avoids the cascading forwards that make Le Lann's variant O(n²).",
    },
    {
      id: "ring-q2",
      question:
        "Why does Ring election have lower message complexity than Bully?",
      options: [
        { id: "a", label: "Because IDs are smaller in a ring." },
        { id: "b", label: "Because each process talks only to its successor, so a single bid traverses O(n) edges instead of n² point-to-point pairs." },
        { id: "c", label: "Because Ring uses UDP instead of TCP." },
        { id: "d", label: "Because the highest ID is always at the top of the ring." },
      ],
      correctOptionId: "b",
      explanation:
        "Bully fans out: every initiator messages every higher node, each of whom messages every node higher still. Ring serialises the election onto a path of n edges; only one bid survives at any time thanks to the discard rule. Chang–Roberts ends up at 3n − 1 messages worst case, vs Bully's O(n²).",
    },
    {
      id: "ring-q3",
      question:
        "Two processes start a Ring election at the same time. How does Chang–Roberts guarantee a single winner?",
      options: [
        { id: "a", label: "Whichever message arrives at the leader's mailbox first wins." },
        { id: "b", label: "Both bids continue and the network arbitrarily drops one." },
        { id: "c", label: "Bids only grow, never shrink; the higher bid eventually absorbs the lower via the discard rule, leaving exactly one survivor." },
        { id: "d", label: "The algorithm fails — Ring requires a single initiator." },
      ],
      correctOptionId: "c",
      explanation:
        "An ELECTION(id) message can only be replaced upward (id < my id → bump) or forwarded (id > my id). The lower bid runs into a participant whose ID exceeds it and gets discarded; the higher bid keeps going. At most one bid ever completes the loop and triggers COORDINATOR.",
    },
  ],
};
