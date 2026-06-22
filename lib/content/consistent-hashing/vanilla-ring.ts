import type { ConceptContent } from "@/lib/content/types";

export const vanillaRing: ConceptContent = {
  prototypeCaption:
    "The circle is the whole hash space, with the end joined back to the start. Every **server** (large dot) and every **key** (small dot) sits at the position of its hash. To find a key's owner, walk **clockwise** until you hit a server — the dashed curves are those walks. Hit *Watch the demo* for a guided tour, then remove a server and watch how few keys actually move.",

  overview: [
    {
      type: "p",
      text: "Start with the problem. You want to spread keys across N servers, so you write `server = hash(key) % N`. It distributes evenly and it's fast. But the moment N changes — a server is added or one crashes — the modulo flips for almost every key. Going from 4 servers to 5 remaps roughly 80% of them. In a cache that means 80% cold misses at once; in a database that means migrating most of your data. That sudden, total reshuffle is the thing consistent hashing exists to prevent.",
    },
    {
      type: "p",
      text: "The vanilla ring is the original fix, from Karger's 1997 paper. Imagine the range of the hash function bent into a circle — say 0 up to 2³² − 1, with the top wrapping back to 0. **Hash each server's name and drop it onto the circle. Hash each key and drop it on too.** A key is owned by the first server you reach going clockwise from where the key landed. That walk is the entire lookup rule.",
    },
    {
      type: "p",
      text: "Why this helps: a server is now responsible only for the *arc* between it and the previous server. Remove a server and only the keys in its arc move — they slide clockwise to the next survivor. Every other key stays exactly where it was. On average a change touches just **K/N keys** (K keys, N servers) instead of all K.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Build the ring, then walk it" },
    {
      type: "ol",
      items: [
        "Pick a hash function with a fixed output range (e.g. 32-bit). Treat that range as a circle: the largest value wraps around to 0.",
        "For each server, compute `hash(server_name)` and place it at that point on the circle.",
        "For each key, compute `hash(key)` and place it on the circle the same way.",
        "To find a key's owner, start at the key and move **clockwise** to the first server you meet. If you pass the top of the circle without finding one, wrap around to the first server from 0.",
      ],
    },
    {
      type: "p",
      text: "In code the ring is just the server hashes kept **sorted**. A lookup is a binary search for the first server hash ≥ the key's hash (wrapping to index 0 if there isn't one) — so O(log N), not O(N).",
    },
    { type: "h", text: "What happens when membership changes" },
    {
      type: "p",
      text: "Adding a server drops one new point onto the ring. It splits the arc it lands in, taking over the keys between the previous server and itself — only that arc's keys move, and they all come from a *single* neighbour. Removing a server deletes its point; the keys it owned walk clockwise to the next server along. In both cases the rest of the ring is untouched. That locality — a change only ever affects one neighbouring arc — is the whole value proposition.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The catch: random placement is lumpy",
      text: "Server positions come from a hash, so they land at random. With only a handful of servers, the gaps between them are wildly uneven — one server might own a third of the ring while another owns a sliver. That means uneven load, and worse, when a server dies *all* of its keys dump onto the single next server instead of spreading out. Virtual nodes (the next concept) fix exactly this.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When to reach for it" },
    {
      type: "ul",
      items: [
        "**Distributed caches and CDNs** — the original use case: resize the fleet without flushing every cache at once.",
        "**Any sharded system where moving a key is expensive** — copying data, warming a cache, migrating a partition. You want the minimum keys to move.",
        "**As the mental model** — the plain ring is the foundation every other method here builds on. Learn it first.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "In practice you rarely ship the *vanilla* ring",
      text: "Real systems almost always add virtual nodes on top (next concept) to fix the uneven-load problem. Treat the vanilla ring as the concept you must understand, not the version you deploy.",
    },
  ],

  tradeoffs: {
    pros: [
      "Membership changes move only ~K/N keys instead of nearly all of them — the defining win over `hash % N`.",
      "A change only ever disturbs one neighbouring arc; the rest of the ring is untouched.",
      "Lookups are O(log N) with a sorted list of server hashes and a binary search.",
      "Conceptually simple and the basis for every other method in this topic.",
    ],
    cons: [
      "Random placement makes the ring lumpy: with few servers, load is very uneven.",
      "When a server leaves, all its keys land on a single neighbour rather than spreading across survivors.",
      "No notion of server capacity — a big server and a small server each get one point.",
      "These weaknesses are real enough that production systems use virtual nodes instead.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch the guided demo",
      body: "Click **Watch the demo**. It builds an empty ring, drops three servers and six keys, highlights one server's arc of responsibility, then removes that server so you can see only its keys move. This is the whole idea in five steps.",
    },
    {
      title: "02 · Remove a server and count the movers",
      body: "With the ring populated, **click any server dot** to remove it. The narration tells you how many of the keys moved versus how many stayed put — and lists where the movers went. Notice most keys never budge; that's the property naive `hash % N` can't give you.",
    },
    {
      title: "03 · Feel the lumpiness",
      body: "Use **Add server** and **+5 keys** a few times and watch the per-server stat bars. With only a few servers the counts are wildly uneven — one server hogs a big arc while another sits nearly empty. Keep that imbalance in mind: it's exactly the problem virtual nodes solve next.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "hash_ring.go",
      code: `// Vanilla consistent-hashing ring.
// The ring is just the server hashes kept sorted; lookup is a binary search.
package main

import "sort"

type entry struct {
	hash   uint32
	server string
}

type HashRing struct {
	ring []entry
}

func (r *HashRing) hash(s string) uint32 {
	// FNV-1a 32-bit — any stable hash works.
	var h uint32 = 2166136261
	for i := 0; i < len(s); i++ {
		h ^= uint32(s[i])
		h *= 16777619
	}
	return h
}

func (r *HashRing) AddServer(name string) {
	r.ring = append(r.ring, entry{hash: r.hash(name), server: name})
	sort.Slice(r.ring, func(i, j int) bool { // keep the ring ordered
		return r.ring[i].hash < r.ring[j].hash
	})
}

func (r *HashRing) RemoveServer(name string) {
	out := r.ring[:0]
	for _, e := range r.ring {
		if e.server != name {
			out = append(out, e)
		}
	}
	r.ring = out
}

// First server clockwise from the key's hash (wrap to index 0).
func (r *HashRing) GetServer(key string) (string, bool) {
	if len(r.ring) == 0 {
		return "", false
	}
	h := r.hash(key)
	lo, hi, ans := 0, len(r.ring)-1, 0
	for lo <= hi {
		mid := (lo + hi) >> 1
		if r.ring[mid].hash >= h {
			ans = mid
			hi = mid - 1
		} else {
			lo = mid + 1
		}
	}
	// if h is past the last server, wrap around to the first
	if r.ring[ans].hash < h {
		ans = 0
	}
	return r.ring[ans].server, true
}

func main() {
	ring := &HashRing{}
	for _, s := range []string{"alpha", "beta", "gamma"} {
		ring.AddServer(s)
	}
	ring.GetServer("user:42") // -> whichever server is first clockwise
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "HashRing.java",
      code: `import java.util.ArrayList;
import java.util.List;

// Vanilla consistent-hashing ring.
// The ring is just the server hashes kept sorted; lookup is a binary search.
class HashRing {
    private record Entry(long hash, String server) {}

    private final List<Entry> ring = new ArrayList<>();

    private long hash(String s) {
        // FNV-1a 32-bit — any stable hash works.
        long h = 2166136261L;
        for (int i = 0; i < s.length(); i++) {
            h ^= s.charAt(i);
            h = (h * 16777619L) & 0xFFFFFFFFL;
        }
        return h;
    }

    void addServer(String name) {
        ring.add(new Entry(hash(name), name));
        ring.sort((a, b) -> Long.compare(a.hash(), b.hash())); // keep the ring ordered
    }

    void removeServer(String name) {
        ring.removeIf(e -> e.server().equals(name));
    }

    // First server clockwise from the key's hash (wrap to index 0).
    String getServer(String key) {
        if (ring.isEmpty()) return null;
        long h = hash(key);
        int lo = 0, hi = ring.size() - 1, ans = 0;
        while (lo <= hi) {
            int mid = (lo + hi) >> 1;
            if (ring.get(mid).hash() >= h) { ans = mid; hi = mid - 1; }
            else lo = mid + 1;
        }
        // if h is past the last server, wrap around to the first
        if (ring.get(ans).hash() < h) ans = 0;
        return ring.get(ans).server();
    }
}

// Usage:
// HashRing ring = new HashRing();
// for (String s : new String[]{"alpha", "beta", "gamma"}) ring.addServer(s);
// ring.getServer("user:42"); // -> whichever server is first clockwise`,
    },
    {
      label: "Python",
      language: "python",
      filename: "hash_ring.py",
      code: `import bisect


class HashRing:
    """Vanilla consistent-hashing ring.

    The ring is just the server hashes kept sorted; lookup is a binary search.
    """

    def __init__(self) -> None:
        self.hashes: list[int] = []   # sorted server hashes
        self.servers: list[str] = []  # parallel: server for each hash

    def _hash(self, s: str) -> int:
        # FNV-1a 32-bit — any stable hash works.
        h = 2166136261
        for ch in s:
            h ^= ord(ch)
            h = (h * 16777619) & 0xFFFFFFFF
        return h

    def add_server(self, name: str) -> None:
        h = self._hash(name)
        i = bisect.bisect_left(self.hashes, h)  # keep the ring ordered
        self.hashes.insert(i, h)
        self.servers.insert(i, name)

    def remove_server(self, name: str) -> None:
        kept = [(h, s) for h, s in zip(self.hashes, self.servers) if s != name]
        self.hashes = [h for h, _ in kept]
        self.servers = [s for _, s in kept]

    def get_server(self, key: str) -> str | None:
        if not self.hashes:
            return None
        h = self._hash(key)
        # first server clockwise; wrap to index 0 if past the end
        i = bisect.bisect_left(self.hashes, h)
        if i == len(self.hashes):
            i = 0
        return self.servers[i]


ring = HashRing()
for s in ["alpha", "beta", "gamma"]:
    ring.add_server(s)
ring.get_server("user:42")  # -> whichever server is first clockwise`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "hash_ring.cpp",
      code: `// Vanilla consistent-hashing ring.
// The ring is just the server hashes kept sorted; lookup is a binary search.
#include <algorithm>
#include <cstdint>
#include <string>
#include <vector>

class HashRing {
    struct Entry {
        uint32_t hash;
        std::string server;
    };
    std::vector<Entry> ring_;

    uint32_t hash(const std::string& s) const {
        // FNV-1a 32-bit — any stable hash works.
        uint32_t h = 2166136261u;
        for (char c : s) {
            h ^= static_cast<unsigned char>(c);
            h *= 16777619u;
        }
        return h;
    }

public:
    void addServer(const std::string& name) {
        ring_.push_back({hash(name), name});
        std::sort(ring_.begin(), ring_.end(), // keep the ring ordered
                  [](const Entry& a, const Entry& b) { return a.hash < b.hash; });
    }

    void removeServer(const std::string& name) {
        ring_.erase(std::remove_if(ring_.begin(), ring_.end(),
                                   [&](const Entry& e) { return e.server == name; }),
                    ring_.end());
    }

    // First server clockwise from the key's hash (wrap to index 0).
    const std::string* getServer(const std::string& key) const {
        if (ring_.empty()) return nullptr;
        uint32_t h = hash(key);
        int lo = 0, hi = static_cast<int>(ring_.size()) - 1, ans = 0;
        while (lo <= hi) {
            int mid = (lo + hi) >> 1;
            if (ring_[mid].hash >= h) { ans = mid; hi = mid - 1; }
            else lo = mid + 1;
        }
        // if h is past the last server, wrap around to the first
        if (ring_[ans].hash < h) ans = 0;
        return &ring_[ans].server;
    }
};

// Usage:
// HashRing ring;
// for (auto& s : {"alpha", "beta", "gamma"}) ring.addServer(s);
// ring.getServer("user:42"); // -> whichever server is first clockwise`,
    },
  ],

  furtherReading: [
    {
      label: "Karger et al. — Consistent Hashing and Random Trees (1997)",
      href: "https://dl.acm.org/doi/10.1145/258533.258660",
      note: "The original STOC paper that introduced the hash ring, written to relieve hot spots in web caching. Where it all started.",
      kind: "paper",
    },
    {
      label: "Tom White — Consistent Hashing",
      href: "https://tom-e-white.com/2007/11/consistent-hashing.html",
      note: "The clearest short walkthrough on the web, with a tiny Java implementation. The post that taught a generation of engineers the ring.",
      kind: "article",
    },
    {
      label: "Toptal — A Guide to Consistent Hashing",
      href: "https://www.toptal.com/big-data/consistent-hashing",
      note: "Builds from `hash % N` to the ring with worked examples, showing exactly how many keys move on a resize.",
      kind: "article",
    },
    {
      label: "AlgoMaster — Consistent Hashing Explained",
      href: "https://blog.algomaster.io/p/consistent-hashing-explained",
      note: "A modern, diagram-heavy explainer aimed at system-design interviews — good for cementing the intuition.",
      kind: "article",
    },
    {
      label: "Amazon Dynamo (SOSP 2007), §4.2 Partitioning",
      href: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
      note: "How a real system used the ring in production — and the section that motivates virtual nodes by naming the vanilla ring's weaknesses.",
      kind: "paper",
    },
  ],

  quiz: [
    {
      id: "vr-q1",
      question: "Why does `server = hash(key) % N` behave badly when N changes?",
      options: [
        { id: "a", label: "The hash function becomes slower with more servers" },
        { id: "b", label: "Changing N changes the modulo result for almost every key, so nearly all keys remap at once" },
        { id: "c", label: "Modulo can only handle a power-of-two number of servers" },
        { id: "d", label: "It stops being deterministic" },
      ],
      correctOptionId: "b",
      explanation:
        "The modulo ties each key's destination to the exact value of N. Change N and the remainder changes for ~all keys, forcing a near-total reshuffle — cold caches and mass data migration. Consistent hashing avoids this by not tying placement to N.",
    },
    {
      id: "vr-q2",
      question: "On the ring, which server owns a given key?",
      options: [
        { id: "a", label: "The server with the closest hash in either direction" },
        { id: "b", label: "The first server reached walking clockwise from the key (wrapping around if needed)" },
        { id: "c", label: "A randomly chosen server, re-rolled on each lookup" },
        { id: "d", label: "The server with the smallest hash value overall" },
      ],
      correctOptionId: "b",
      explanation:
        "You walk clockwise from the key's position to the first server you meet; if you reach the top of the ring, you wrap to the first server from 0. In code that's a binary search for the first server hash ≥ the key's hash.",
    },
    {
      id: "vr-q3",
      question: "What is the main weakness of the plain (vanilla) ring?",
      options: [
        { id: "a", label: "Lookups are O(N)" },
        { id: "b", label: "Random server placement makes arcs uneven, so load is lumpy and a removed server dumps all its keys on one neighbour" },
        { id: "c", label: "It moves more keys than `hash % N` on a resize" },
        { id: "d", label: "It cannot wrap around the circle" },
      ],
      correctOptionId: "b",
      explanation:
        "Because positions come from a hash, the gaps between servers vary a lot. Some servers own large arcs, others tiny ones, and when a server leaves, its entire arc lands on the single next server. Virtual nodes fix this by giving each server many positions.",
    },
  ],
};
