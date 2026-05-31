import type { TopicContent } from "@/lib/content/types";

export const bloomFiltersTopic: TopicContent = {
  intro: [
    {
      type: "p",
      text: "**A probabilistic filter answers 'have I seen this before?' in a handful of bytes per item.** A hash set works too, but it has to store every key — fine for thousands, painful for billions. A Bloom filter, a counting Bloom filter, or a cuckoo filter give up *certainty* in one direction and get back orders of magnitude less memory. You'll see them in browsers (Safari's bad-URL list), databases (Cassandra/HBase/RocksDB skip disk reads), CDNs (cached-or-not), and every CRDB-style system that has to ask 'do I have this row?' over the network.",
    },
    {
      type: "p",
      text: "The trick is the kind of error they allow. All three are **one-sided**: a positive answer is *maybe*, but a negative answer is *definitely not*. That asymmetry is the whole product. You use the filter to skip an expensive lookup that would have failed; the rare false-positive just means you pay for the lookup anyway. You never miss a real hit.",
    },
    {
      type: "p",
      text: "The three variants here build on each other. **Bloom** is the original — bits, hashes, beautifully small, but you can never delete. **Counting Bloom** turns each bit into a small counter so you can delete by decrementing, at the cost of more memory. **Cuckoo** is the modern alternative: stores short fingerprints in two candidate buckets and uses a 'cuckoo' eviction to make room — it deletes safely *and* uses less space than Bloom at the same false-positive rate.",
    },
  ],

  whyItMatters: [
    { type: "h", text: "Where this shows up" },
    {
      type: "ul",
      items: [
        "**Database storage engines** — Cassandra, HBase, LevelDB, RocksDB, ScyllaDB attach a Bloom filter to every SSTable so a key lookup can skip files that definitely don't hold it instead of opening every file on disk.",
        "**CDNs and caches** — 'do I have this object?' before a multi-hop fetch. A 0.1%-false-positive filter the size of a thumbnail can rule out a million URLs.",
        "**Web browsers** — Chrome's Safe Browsing and old Safari builds shipped a Bloom filter of malicious URLs locally; only the maybe-hits actually call the remote checker.",
        "**Crypto wallets & Bitcoin SPV** — wallets register a Bloom filter of their addresses so the node sends back only matching transactions without learning the wallet's full set.",
        "**Networking & dedup** — TCP/IP duplicate-packet detection, CDN URL deduplication, web-crawler 'already-visited' set, Kafka exactly-once log compaction. Anywhere a 'have I seen this?' check fronts an expensive op.",
        "**Privacy-preserving sketches** — sending a filter is cheaper *and* leaks less than sending the raw set, which is why so many distributed systems use them at the protocol level.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why give up exactness?",
      text: "A hash set storing 1 billion 64-byte URLs needs ~60 GB. A Bloom filter with the same membership question, tuned for a 1% false-positive rate, needs ~1.2 GB — fifty times less. You trade rare extra lookups for fitting the whole thing in RAM. For most 'do I have this?' questions, that's the right trade.",
    },
  ],

  comparison: {
    headers: {
      algorithm: "Filter",
      bursts: "Delete?",
      precision: "Bits per item (1% FPR)",
      memory: "False-positive shape",
      bestFor: "Use when",
    },
    rows: [
      {
        algorithm: "Bloom Filter",
        bursts: "No",
        precision: "~9.6 bits",
        memory: "Grows with fill; can't shrink",
        bestFor: "Append-only sets — crawl frontier, SSTable summaries, denylists.",
      },
      {
        algorithm: "Counting Bloom",
        bursts: "Yes (decrement)",
        precision: "~38 bits (4-bit counters)",
        memory: "Same shape as Bloom",
        bestFor: "Membership with churn — sessions, sliding-window dedup, cache admission.",
      },
      {
        algorithm: "Cuckoo Filter",
        bursts: "Yes (clean remove)",
        precision: "~7 bits (typical)",
        memory: "Stable; insert can fail when very full",
        bestFor: "Modern default — smaller than Bloom, supports delete, predictable lookups.",
      },
    ],
  },

  howToChoose: [
    { type: "h", text: "How to pick" },
    {
      type: "ul",
      items: [
        "**You only ever add** (a crawl frontier, an immutable SSTable summary, a denylist that you rebuild instead of patching) → **Bloom filter**. Smallest and simplest; deletion isn't worth paying for if you don't need it.",
        "**You need to add *and* remove**, and you don't want to think about 'is the filter full?' edge cases → **Counting Bloom**. Mature, easy to reason about, costs ~4× the memory.",
        "**You need delete *and* the smallest filter** at a given false-positive rate, and you can handle the rare insertion failure → **Cuckoo filter**. Slightly more code, noticeably less RAM, faster lookups (only two cache lines touched).",
        "**You're picking a default in 2026** → **Cuckoo**. The Fan/Andersen/Kaminsky paper changed the landscape; for delete-supporting filters it's almost always the better engineering choice.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Always pair it with the source of truth",
      text: "A filter never *answers* a query — it only lets you *skip* the work for the definite-misses. Behind every Bloom/cuckoo filter in production there is a real store (a hash table, a B-tree, an SSTable on disk) that confirms the maybe-hits. Designing without that backstop is how you turn a 1% false-positive rate into a 1% wrong-result rate, which is a bug.",
    },
  ],
};
