import type { ConceptContent } from "@/lib/content/types";

export const rendezvousHrw: ConceptContent = {
  prototypeCaption:
    "Each key runs its own little **lottery**: every server computes a score of `hash(server + key)`, and the highest score wins. Click any key chip to see its bars — the tallest one (badged **WINS**) is its server. Remove a server with the **✕** and watch only *its* keys jump to their second-place bar; everyone else is untouched.",

  overview: [
    {
      type: "p",
      text: "The ring methods all share one assumption: you keep a structure (the ring, the vnode list) and look keys up against it. Rendezvous hashing throws that away. There is no ring and no stored positions. Instead, for every key you ask each server one question — *'what's your score for this key?'* — and the highest score wins. That's the entire algorithm.",
    },
    {
      type: "p",
      text: "The score is just a hash of the two names combined: `score = hash(server + key)`. Because the hash mixes both the server's name and the key's name, every (server, key) pair gets its own pseudo-random number between 0 and 1. The server with the biggest number for a given key owns that key. It's also called **HRW** — Highest Random Weight — for exactly this reason.",
    },
    {
      type: "p",
      text: "The magic is what happens when a server leaves. A key only moves if the server that left was its *winner*. In that case the key simply falls to whoever had the **second-highest** score — and no other key is touched, because their winners didn't change. You get minimal, surgical reassignment without ever placing anything on a ring.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Score everyone, pick the max" },
    {
      type: "ol",
      items: [
        "For the key you're placing, loop over every server.",
        "For each server, compute `score = hash(server_name + key_name)`.",
        "Keep the server with the highest score. That server owns the key.",
        "To replicate to R servers, just take the **top R** scores instead of the top 1.",
      ],
    },
    {
      type: "p",
      text: "Each key decides independently, so the work is O(N) per lookup — you score all N servers. There's no ring to keep sorted and no virtual nodes to manage; the only state is the list of server names. For small to medium N this is wonderfully simple.",
    },
    { type: "h", text: "Why removal is so clean" },
    {
      type: "p",
      text: "Imagine a key's scores ranked: alpha (0.91), gamma (0.62), beta (0.40). alpha wins. Remove alpha and the ranking is just gamma (0.62), beta (0.40) — gamma takes over. Crucially, every key whose winner *wasn't* alpha sees no change at all, because dropping alpha doesn't alter anyone else's scores. The prototype shows this directly: the second-place bar is already visible before you remove the leader.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Weighting is easy too",
      text: "To make a bigger server take more keys, multiply (or transform) its score so it wins more often — a small formula change, no extra ring positions. This is why rendezvous is popular when you want capacity-awareness without the bookkeeping of virtual nodes.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The cost is the O(N) scan",
      text: "Because every lookup scores every server, rendezvous gets expensive when N is large (thousands of nodes). For big fleets people either cap N, use it only at a small top layer, or switch to a method with cheaper lookups (jump hash, Maglev). For tens of servers, the scan is nothing.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Small or medium clusters** — a handful to a few hundred servers, where an O(N) scan per key is cheap.",
        "**You want weights without vnodes** — capacity-aware placement falls out of a small tweak to the score.",
        "**You need the top-R for replication** — picking the R highest scores gives a natural, stable replica set.",
        "**Caching layers** — its original use (CARP, web proxy caches): clients independently agree on which cache holds an object, with no coordination.",
      ],
    },
  ],

  tradeoffs: {
    pros: [
      "No ring, no virtual nodes — the only state is the list of server names.",
      "Naturally even distribution, even with few servers (no lumpy arcs to fix).",
      "Removal is surgical: only the leaving server's keys move, each to its second choice.",
      "Weights and top-R replication come from tiny formula changes.",
    ],
    cons: [
      "O(N) per lookup — you score every server — so it scales poorly to very large N.",
      "More hashing work per lookup than a ring's single binary search.",
      "Less common in off-the-shelf infrastructure than the ring, so fewer ready-made libraries.",
      "Still hash-based, so balance is statistical, not exactly equal.",
    ],
  },

  handsOn: [
    {
      title: "01 · Read a lottery",
      body: "Click any key chip. The bars show every server's `hash(server + key)` score for that key; the tallest, badged **WINS**, is the owner. Try a few keys — each has a totally different winner because each runs its own independent lottery.",
    },
    {
      title: "02 · Remove the winner, watch second place take over",
      body: "Pick a key, note its winner and its second-place bar. Now click the **✕** on that winning server's card. The key (and only keys it was winning) flips to second place — the narration tells you how many moved and how many were untouched.",
    },
    {
      title: "03 · Add servers and watch balance hold",
      body: "Use **Add server** and **+5 keys**. Notice the per-server counts stay fairly even without any virtual nodes — and adding a server only pulls over the keys whose new ticket beats their old winner. No global reshuffle, no ring.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "rendezvous.go",
      code: `// Rendezvous (HRW) hashing: score every server, pick the highest.
package main

import "sort"

type Rendezvous struct {
	servers []string
}

func (r *Rendezvous) hash(s string) uint32 {
	var h uint32 = 2166136261
	for i := 0; i < len(s); i++ {
		h ^= uint32(s[i])
		h *= 16777619
	}
	return h
}

// score combines server + key, so each pair gets its own number
func (r *Rendezvous) score(server, key string) uint32 {
	return r.hash(server + "|" + key)
}

func (r *Rendezvous) GetServer(key string) (string, bool) {
	best, bestScore, found := "", uint32(0), false
	for _, s := range r.servers {
		v := r.score(s, key)
		if !found || v > bestScore {
			bestScore, best, found = v, s, true
		}
	}
	return best, found // O(N): we looked at every server
}

// Top-R servers => a natural replica set
func (r *Rendezvous) GetReplicas(key string, n int) []string {
	sorted := append([]string(nil), r.servers...)
	sort.Slice(sorted, func(i, j int) bool {
		return r.score(sorted[i], key) > r.score(sorted[j], key)
	})
	if n > len(sorted) {
		n = len(sorted)
	}
	return sorted[:n]
}

func main() {
	rv := &Rendezvous{servers: []string{"alpha", "beta", "gamma"}}
	rv.GetServer("user:42")      // the highest-scoring server
	rv.GetReplicas("user:42", 2) // its primary + backup
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Rendezvous.java",
      code: `import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

// Rendezvous (HRW) hashing: score every server, pick the highest.
class Rendezvous {
    private final String[] servers;

    Rendezvous(String[] servers) {
        this.servers = servers;
    }

    private long hash(String s) {
        long h = 2166136261L;
        for (int i = 0; i < s.length(); i++) {
            h ^= s.charAt(i);
            h = (h * 16777619L) & 0xFFFFFFFFL;
        }
        return h;
    }

    // score combines server + key, so each pair gets its own number
    private long score(String server, String key) {
        return hash(server + "|" + key);
    }

    String getServer(String key) {
        String best = null;
        long bestScore = -1;
        for (String s : servers) {
            long v = score(s, key);
            if (v > bestScore) { bestScore = v; best = s; }
        }
        return best; // O(N): we looked at every server
    }

    // Top-R servers => a natural replica set
    List<String> getReplicas(String key, int r) {
        return Arrays.stream(servers)
            .sorted(Comparator.comparingLong((String s) -> score(s, key)).reversed())
            .limit(r)
            .collect(Collectors.toList());
    }
}

// Usage:
// Rendezvous rv = new Rendezvous(new String[]{"alpha", "beta", "gamma"});
// rv.getServer("user:42");      // the highest-scoring server
// rv.getReplicas("user:42", 2); // its primary + backup`,
    },
    {
      label: "Python",
      language: "python",
      filename: "rendezvous.py",
      code: `class Rendezvous:
    """Rendezvous (HRW) hashing: score every server, pick the highest."""

    def __init__(self, servers: list[str]) -> None:
        self.servers = servers

    def _hash(self, s: str) -> int:
        h = 2166136261
        for ch in s:
            h ^= ord(ch)
            h = (h * 16777619) & 0xFFFFFFFF
        return h

    # score combines server + key, so each pair gets its own number
    def _score(self, server: str, key: str) -> int:
        return self._hash(server + "|" + key)

    def get_server(self, key: str) -> str | None:
        best, best_score = None, -1
        for s in self.servers:
            v = self._score(s, key)
            if v > best_score:
                best_score, best = v, s
        return best  # O(N): we looked at every server

    # Top-R servers => a natural replica set
    def get_replicas(self, key: str, r: int) -> list[str]:
        return sorted(self.servers, key=lambda s: self._score(s, key), reverse=True)[:r]


rv = Rendezvous(["alpha", "beta", "gamma"])
rv.get_server("user:42")      # the highest-scoring server
rv.get_replicas("user:42", 2)  # its primary + backup`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "rendezvous.cpp",
      code: `// Rendezvous (HRW) hashing: score every server, pick the highest.
#include <algorithm>
#include <cstdint>
#include <string>
#include <vector>

class Rendezvous {
    std::vector<std::string> servers_;

    uint32_t hash(const std::string& s) const {
        uint32_t h = 2166136261u;
        for (char c : s) {
            h ^= static_cast<unsigned char>(c);
            h *= 16777619u;
        }
        return h;
    }

    // score combines server + key, so each pair gets its own number
    uint32_t score(const std::string& server, const std::string& key) const {
        return hash(server + "|" + key);
    }

public:
    explicit Rendezvous(std::vector<std::string> servers)
        : servers_(std::move(servers)) {}

    const std::string* getServer(const std::string& key) const {
        const std::string* best = nullptr;
        uint32_t bestScore = 0;
        for (const auto& s : servers_) {
            uint32_t v = score(s, key);
            if (!best || v > bestScore) { bestScore = v; best = &s; }
        }
        return best; // O(N): we looked at every server
    }

    // Top-R servers => a natural replica set
    std::vector<std::string> getReplicas(const std::string& key, int r) const {
        std::vector<std::string> sorted = servers_;
        std::sort(sorted.begin(), sorted.end(),
                  [&](const std::string& a, const std::string& b) {
                      return score(a, key) > score(b, key);
                  });
        if (r < static_cast<int>(sorted.size())) sorted.resize(r);
        return sorted;
    }
};

// Usage:
// Rendezvous rv({"alpha", "beta", "gamma"});
// rv.getServer("user:42");      // the highest-scoring server
// rv.getReplicas("user:42", 2); // its primary + backup`,
    },
  ],

  furtherReading: [
    {
      label: "Wikipedia — Rendezvous (HRW) hashing",
      href: "https://en.wikipedia.org/wiki/Rendezvous_hashing",
      note: "The clearest reference: the algorithm, the weighted variant, and the O(N) vs O(log N) tradeoff against the ring.",
      kind: "article",
    },
    {
      label: "Thaler & Ravishankar — Using Name-Based Mappings to Increase Hit Rates (1998)",
      href: "https://www.semanticscholar.org/paper/Using-name-based-mappings-to-increase-hit-rates-Thaler-Ravishankar/6a3d10bb30818c86c18cef1e5e4b128ae80840ae",
      note: "The original paper that introduced HRW, motivated by distributed web caching — the same problem that birthed consistent hashing.",
      kind: "paper",
    },
    {
      label: "DZone — Consistent Hashing vs. Rendezvous Hashing",
      href: "https://dzone.com/articles/consistent-hashing-vs-rendezvous-hashing-a-compara",
      note: "A side-by-side comparison: when the ring's O(log N) lookup beats HRW's even distribution, and vice versa.",
      kind: "article",
    },
    {
      label: "IETF draft — Weighted HRW and its applications",
      href: "https://www.ietf.org/archive/id/draft-ietf-bess-weighted-hrw-00.html",
      note: "How weighting is added to HRW in practice, and where it's used in networking (load distribution across links/next-hops).",
      kind: "spec",
    },
  ],

  quiz: [
    {
      id: "hrw-q1",
      question: "How does rendezvous hashing decide which server owns a key?",
      options: [
        { id: "a", label: "It walks clockwise around a ring to the first server" },
        { id: "b", label: "Every server computes hash(server + key); the highest score wins" },
        { id: "c", label: "It takes hash(key) % N" },
        { id: "d", label: "It picks a server at random each lookup" },
      ],
      correctOptionId: "b",
      explanation:
        "Each server gets a per-key score of hash(server + key), and the key goes to the server with the highest score — Highest Random Weight. No ring or stored positions are involved.",
    },
    {
      id: "hrw-q2",
      question: "When a server is removed, which keys move and where?",
      options: [
        { id: "a", label: "All keys are rehashed and redistributed" },
        { id: "b", label: "Only the keys that server was winning move, each to its second-highest-scoring server" },
        { id: "c", label: "Keys move to the next server clockwise" },
        { id: "d", label: "A random half of all keys move" },
      ],
      correctOptionId: "b",
      explanation:
        "Removing a server can't change any other key's scores, so only keys whose winner was the removed server are affected — and each simply drops to its second-place score. Everyone else is untouched.",
    },
    {
      id: "hrw-q3",
      question: "What is the main downside of rendezvous hashing?",
      options: [
        { id: "a", label: "It moves more keys than naive hash % N" },
        { id: "b", label: "Each lookup scores every server, so it is O(N) and scales poorly to very large fleets" },
        { id: "c", label: "It cannot support replication" },
        { id: "d", label: "It distributes keys very unevenly" },
      ],
      correctOptionId: "b",
      explanation:
        "Because a lookup computes a score for all N servers, cost grows with N. That's fine for tens or hundreds of servers, but for thousands you'd cap N or switch to a cheaper-lookup method like jump hash or Maglev.",
    },
  ],
};
