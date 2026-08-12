import type { RoadmapLesson } from "@/lib/content/types";

export const lruLfuCache: RoadmapLesson = {
  title: "Cache (LRU / LFU)",
  oneLiner:
    "Every other problem in this set is about modelling nouns. This one is about **a data structure**. A hash map gives you O(1) lookup and no order; a linked list gives you order and O(n) lookup. Bolt them together and both `get` and `evict` become O(1) — and once the eviction rule lives behind an interface, *“now make it LFU”* costs you a new class instead of a rewrite.",
  difficulty: "intermediate",
  estimatedTime: "30 min",
  prototypePath: "/prototypes/lld/lru-lfu-cache.html",
  content: {
    prototypeCaption:
      "A live capacity-3 cache with the linked list drawn as **real prev/next pointers** between sentinel `HEAD` and `TAIL`. Click a key on the pad — on a **hit** the node lifts out, the neighbours' arrows close the gap, and it drops in at the MRU end; on a **miss** it loads and the tail flashes red and dies. Press **▶ Replay trace** under **🔁 LRU**, hit **↺ Reset**, switch to **📊 LFU** and replay the *identical* trace: a different key gets evicted and the hit ratio changes. Then try **⚠️ FIFO bug** — `recordAccess()` does nothing, nothing looks broken, and the hit ratio quietly drops. **cap 2 / 3 / 4** changes the pressure.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design an LRU cache.”* Four words, and the interviewer will not add a fifth. It is the most-asked machine-coding problem there is, which means the bar is not *“can you produce something that works”* — it is *“can you produce the right thing, quickly, and then extend it.”*",
      },
      {
        type: "p",
        text: "A cache sits between a caller and something slow. When the caller asks for a key, the cache either has it — and answers in about 100 nanoseconds — or it does not, and someone has to pay a database round trip of roughly 10 milliseconds. That is a hundred thousand to one. The cache is small on purpose, so the only interesting question is: **when it is full, which key do you throw away?**",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 268" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A client calls get on a cache. The cache holds a store map, a capacity, an eviction policy and hit and miss counters. A green arrow leaves the cache to a value box labelled hit, roughly one hundred nanoseconds. A red arrow leaves the cache to a database box labelled miss, roughly ten milliseconds, a hundred thousand times slower. A dashed arrow returns from the database into the cache showing that a miss fills the cache and is where eviction happens.">
  <defs>
    <marker id="lc-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="lc-hit" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="lc-miss" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="14" y="26" font-size="9" fill="#6b7280">«caller»</text>
  <rect x="14" y="104" width="110" height="48" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="42" y="133" font-size="11" fill="#e8e4dc">Client</text>

  <line x1="126" y1="128" x2="200" y2="128" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lc-lead)"/>
  <text x="134" y="118" font-size="10" fill="#e8e4dc">get(k)</text>

  <rect x="204" y="54" width="216" height="150" rx="8" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="218" y="78" font-size="12" fill="#fb863a">Cache</text>
  <line x1="204" y1="88" x2="420" y2="88" stroke="#2d333d"/>
  <text x="218" y="108" font-size="10" fill="#e8e4dc">- store : Map&lt;K,V&gt;</text>
  <text x="218" y="127" font-size="10" fill="#e8e4dc">- capacity : 3 entries</text>
  <text x="218" y="146" font-size="10" fill="#fb863a">- policy : EvictionPolicy</text>
  <text x="218" y="165" font-size="9.5" fill="#9099a8">- hits / misses / evictions</text>
  <text x="218" y="190" font-size="9" fill="#6b7280">«the class you are asked to write»</text>

  <line x1="420" y1="96" x2="550" y2="76" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#lc-hit)"/>
  <text x="446" y="70" font-size="10" fill="#5cc66f">HIT</text>
  <rect x="556" y="48" width="150" height="50" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="576" y="72" font-size="11" fill="#5cc66f">value, now</text>
  <text x="576" y="90" font-size="9" fill="#9099a8">~100 ns</text>

  <line x1="420" y1="160" x2="550" y2="176" stroke="#f06868" stroke-width="1.3" marker-end="url(#lc-miss)"/>
  <text x="444" y="196" font-size="10" fill="#f06868">MISS</text>
  <rect x="556" y="152" width="150" height="52" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.45)"/>
  <text x="576" y="176" font-size="11" fill="#f06868">Database</text>
  <text x="576" y="194" font-size="9" fill="#9099a8">~10 ms · 100,000×</text>

  <polyline points="640,208 640,238 312,238 312,206" fill="none" stroke="#fb863a" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#lc-lead)"/>
  <text x="330" y="256" font-size="9.5" fill="#9099a8">a miss fills the cache — and that is the only place eviction ever happens</text>
</svg>`,
        caption:
          "Look at the dashed arrow. Reads are the easy half; the **miss path** is where the design lives, because that is where something has to die.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **map** holds `key → value` so lookup is O(1). A **policy** holds an ordering of the keys so that *“who dies next”* is also O(1). `Cache` owns the map, the capacity and the counters; the policy owns the order — and nothing else in the cache knows whether that order means *recently used* or *frequently used*.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Is it genuinely O(1)?** Not *“fast”* — O(1). If any path scans the entries to find a victim, or walks a list to find a predecessor, you have failed the only quantitative requirement the problem has.",
          "**Can you draw the pointers?** The interviewer will ask you to talk through `moveToFront`. *“It moves the node to the front”* is not an answer. The six assignments are the answer.",
          "**Did you use sentinels?** A `HEAD` and a `TAIL` node that hold no data delete every null check in the file. Skipping them is where the NullPointerException comes from.",
          "**Is the eviction rule swappable?** *“Now make it LFU”* is the follow-up, every time. If the list logic is welded into `get()`, that request is a rewrite. If it is behind an interface, it is a new class and zero edits.",
          "**Does it run, and can you show it working?** A `main()` that replays a fixed access trace and prints the contents and the hit ratio after each step. Numbers, not claims.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- clarify ----------
      { type: "h", text: "Step 1 · Clarify — 4 minutes" },
      {
        type: "ul",
        items: [
          "**What is the capacity measured in — entries or bytes?** — say entries, and add the one sentence that shows you know better: *“real caches weigh entries, because a 2 KB value and a 2 MB value are not the same tenant of a fixed memory budget.”*",
          "**What should `get` return on a miss?** — an empty `Optional` (or `null`, or `undefined`). Not an exception. A miss is the normal case, not an error.",
          "**Does the cache load on a miss, or does the caller?** — simplest is: the caller loads and calls `put`. Mention that a *loading* cache which takes a supplier is the nicer API and is what Caffeine and Guava do.",
          "**LRU only, or should the policy be pluggable?** — this is the question that decides the shape of your answer. Ask it early and they will usually say *“start with LRU, then we will talk.”* That is your cue to build the seam from the first minute.",
          "**Will several threads use it?** — say yes, one lock, and be ready for the twist in the follow-ups: **`get` mutates**.",
          "**TTL, persistence, distribution, stampede protection?** — out of scope in one sentence. TTL is *expiry*, which is a different axis from *eviction*, and mixing them up costs you time. Depth on that lives in [[key-value-store]].",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 236" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A scope board. In scope: get and put, a fixed capacity in entries, LRU and LFU as swappable policies, strict O of one for both operations, hit miss and eviction counters, and safety for concurrent callers. Out of scope: persistence to disk, TTL expiry, distribution across machines, byte accurate sizing, async refresh and write behind, and stampede protection on a cold key.">
  <text x="20" y="24" font-size="10.5" fill="#5cc66f">✓ IN SCOPE — 60 minutes buys you this</text>
  <rect x="20" y="34" width="330" height="184" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="58" font-size="10" fill="#e8e4dc">get(key) · put(key, value)</text>
  <text x="38" y="80" font-size="10" fill="#e8e4dc">a fixed capacity, counted in entries</text>
  <text x="38" y="102" font-size="10" fill="#e8e4dc">LRU and LFU behind one interface</text>
  <text x="38" y="124" font-size="10" fill="#fb863a">O(1) for get, put AND evict</text>
  <text x="38" y="146" font-size="10" fill="#e8e4dc">hits · misses · evictions · hit ratio</text>
  <text x="38" y="168" font-size="10" fill="#e8e4dc">safe for concurrent callers</text>
  <text x="38" y="196" font-size="9.5" fill="#9099a8">a main() that replays a trace</text>
  <text x="38" y="211" font-size="9.5" fill="#9099a8">and prints the numbers</text>

  <text x="378" y="24" font-size="10.5" fill="#6b7280">✗ OUT OF SCOPE — name each in one sentence</text>
  <rect x="378" y="34" width="322" height="184" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="396" y="58" font-size="10" fill="#9099a8">persistence to disk</text>
  <text x="396" y="80" font-size="10" fill="#9099a8">TTL expiry — a different axis</text>
  <text x="396" y="102" font-size="10" fill="#9099a8">distribution across machines</text>
  <text x="396" y="124" font-size="10" fill="#9099a8">byte-accurate sizing / serialization</text>
  <text x="396" y="146" font-size="10" fill="#9099a8">async refresh · write-behind</text>
  <text x="396" y="168" font-size="10" fill="#9099a8">thundering herd on a cold key</text>
  <text x="396" y="196" font-size="9.5" fill="#6b7280">saying these out loud costs 20 seconds</text>
  <text x="396" y="211" font-size="9.5" fill="#6b7280">and buys you the whole hour</text>
</svg>`,
        caption:
          "The right column is not wasted breath. Naming **TTL** and **distribution** as separate axes is what stops the interviewer from wondering whether you know they exist.",
      },

      // ---------- why neither structure alone ----------
      { type: "h", text: "Step 2 · Why neither structure alone works" },
      {
        type: "p",
        text: "Start from the two operations and ask what each costs. `get(key)` needs to find a value by key. `evict()` needs to find the least-recently-used entry. There is no single ordinary structure that does both in constant time — and understanding *why* is the entire design.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 256" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Three panels. A hash map alone gives get in O of one but finding the least recently used entry costs O of n because a map has no order. A linked list alone gives eviction in O of one from the tail but get costs O of n because you must walk it. A hash map plus a doubly linked list, shown in green, gives O of one for both: the map finds the node, the list holds the order.">
  <text x="14" y="22" font-size="10.5" fill="#f06868">✗ HASHMAP ALONE</text>
  <rect x="14" y="32" width="222" height="150" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="30" y="56" font-size="10" fill="#e8e4dc">A → v   C → v</text>
  <text x="30" y="74" font-size="10" fill="#e8e4dc">B → v   D → v</text>
  <text x="30" y="94" font-size="9" fill="#6b7280">buckets in hash order — no order</text>
  <line x1="30" y1="106" x2="220" y2="106" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="30" y="128" font-size="10" fill="#5cc66f">get(key)   O(1)  ✓</text>
  <text x="30" y="150" font-size="10" fill="#f06868">find LRU   O(n)  ✗</text>
  <text x="30" y="170" font-size="9" fill="#f06868">you must scan every entry</text>

  <text x="250" y="22" font-size="10.5" fill="#f06868">✗ LINKED LIST ALONE</text>
  <rect x="250" y="32" width="222" height="150" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="266" y="58" font-size="10" fill="#e8e4dc">D → C → B → A</text>
  <text x="266" y="78" font-size="9" fill="#6b7280">newest first, oldest last</text>
  <line x1="266" y1="106" x2="456" y2="106" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="266" y="128" font-size="10" fill="#f06868">get(key)   O(n)  ✗</text>
  <text x="266" y="150" font-size="10" fill="#5cc66f">find LRU   O(1)  ✓</text>
  <text x="266" y="170" font-size="9" fill="#f06868">you must walk it to find a key</text>

  <text x="486" y="22" font-size="10.5" fill="#5cc66f">✓ BOTH, POINTING AT EACH OTHER</text>
  <rect x="486" y="32" width="220" height="150" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="502" y="58" font-size="10" fill="#e8e4dc">map: key → Node</text>
  <text x="502" y="78" font-size="10" fill="#e8e4dc">list: Node ⇄ Node ⇄ Node</text>
  <line x1="502" y1="106" x2="690" y2="106" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="502" y="128" font-size="10" fill="#5cc66f">get(key)   O(1)  ✓</text>
  <text x="502" y="150" font-size="10" fill="#5cc66f">find LRU   O(1)  ✓</text>
  <text x="502" y="170" font-size="9" fill="#5cc66f">map finds it · list orders it</text>

  <text x="14" y="212" font-size="10" fill="#9099a8">The map answers “where is this key?”. The list answers “who has been idle longest?”.</text>
  <text x="14" y="232" font-size="10" fill="#9099a8">Neither question is answerable by the other structure, so you keep both and make them point at each other.</text>
  <text x="14" y="250" font-size="9.5" fill="#6b7280">Cost: one extra pointer per entry, and every mutation has to update both. That is the trade, and it is worth it.</text>
</svg>`,
        caption:
          "This is the sentence to say out loud in minute 6: *“I need O(1) lookup and O(1) ordering, so I need a map and a list, and the map's values are the list's nodes.”* Everything after this is mechanics.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 268" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A hash map on the left maps keys A, B and C to nodes, with dashed blue arrows crossing to a doubly linked list on the right. The list runs sentinel HEAD, node C, node B, node A, sentinel TAIL, with orange next arrows running left to right along the top and grey prev arrows running right to left along the bottom. The head side is labelled MRU end, most recently used, and the tail side is labelled LRU end, evict from here.">
  <defs>
    <marker id="lc-next" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="lc-prev" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#9099a8"/></marker>
    <marker id="lc-map" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <text x="14" y="44" font-size="10" fill="#5e9ff6">HashMap — key → Node</text>
  <rect x="14" y="54" width="158" height="112" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="30" y="80" font-size="11" fill="#e8e4dc">"A" ⬤</text>
  <text x="30" y="110" font-size="11" fill="#e8e4dc">"B" ⬤</text>
  <text x="30" y="140" font-size="11" fill="#e8e4dc">"C" ⬤</text>
  <text x="14" y="184" font-size="9" fill="#6b7280">no order at all —</text>
  <text x="14" y="198" font-size="9" fill="#6b7280">that is what the list is for</text>

  <text x="200" y="44" font-size="10" fill="#fb863a">doubly-linked list — ordered by recency</text>

  <line x1="174" y1="76" x2="522" y2="146" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" opacity=".55" marker-end="url(#lc-map)"/>
  <line x1="174" y1="106" x2="420" y2="146" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" opacity=".55" marker-end="url(#lc-map)"/>
  <line x1="174" y1="136" x2="318" y2="146" stroke="#5e9ff6" stroke-width="1" stroke-dasharray="3 3" opacity=".55" marker-end="url(#lc-map)"/>

  <text x="268" y="136" font-size="9" fill="#5cc66f">MRU end</text>
  <text x="486" y="136" font-size="9" fill="#f06868">LRU end — evict here</text>

  <rect x="200" y="150" width="62" height="50" rx="6" fill="#1a1d22" stroke="#3a414c"/>
  <text x="210" y="180" font-size="9.5" fill="#9099a8">HEAD</text>
  <text x="204" y="216" font-size="8.5" fill="#6b7280">sentinel</text>

  <rect x="282" y="150" width="80" height="50" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="316" y="174" font-size="12" fill="#fb863a">C</text>
  <text x="300" y="192" font-size="8.5" fill="#9099a8">value</text>

  <rect x="384" y="150" width="80" height="50" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="418" y="174" font-size="12" fill="#e8e4dc">B</text>
  <text x="402" y="192" font-size="8.5" fill="#9099a8">value</text>

  <rect x="486" y="150" width="80" height="50" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="520" y="174" font-size="12" fill="#e8e4dc">A</text>
  <text x="504" y="192" font-size="8.5" fill="#9099a8">value</text>

  <rect x="588" y="150" width="62" height="50" rx="6" fill="#1a1d22" stroke="#3a414c"/>
  <text x="600" y="180" font-size="9.5" fill="#9099a8">TAIL</text>
  <text x="592" y="216" font-size="8.5" fill="#6b7280">sentinel</text>

  <line x1="262" y1="166" x2="278" y2="166" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lc-next)"/>
  <line x1="362" y1="166" x2="380" y2="166" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lc-next)"/>
  <line x1="464" y1="166" x2="482" y2="166" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lc-next)"/>
  <line x1="566" y1="166" x2="584" y2="166" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lc-next)"/>

  <line x1="278" y1="186" x2="262" y2="186" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-prev)"/>
  <line x1="380" y1="186" x2="362" y2="186" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-prev)"/>
  <line x1="482" y1="186" x2="464" y2="186" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-prev)"/>
  <line x1="584" y1="186" x2="566" y2="186" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-prev)"/>

  <text x="200" y="242" font-size="9" fill="#fb863a">→ next</text>
  <text x="262" y="242" font-size="9" fill="#9099a8">← prev</text>
  <text x="330" y="242" font-size="9" fill="#5e9ff6">⋯ the map's values ARE these nodes</text>
  <text x="200" y="260" font-size="9.5" fill="#5cc66f">evictCandidate() is literally tail.prev — no scan, no search, no comparison</text>
</svg>`,
        caption:
          "Trace one blue arrow. The map hands you a **node**, not an index — which is the only reason you can unlink it without knowing where it sits.",
      },

      // ---------- pointer surgery ----------
      { type: "h", text: "Step 3 · The pointer surgery, spelled out" },
      {
        type: "p",
        text: "*“And then it moves to the front”* is where most candidates stop. Do not. Moving a node is two operations — **unlink** and **insert at head** — and between them there are exactly six assignments. Say them, write them, and the interviewer stops probing.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 350" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Three stages of moving node N to the front. Before: HEAD, X, N, Y, TAIL linked in both directions. Unlink: two assignments, n dot prev dot next equals n dot next, and n dot next dot prev equals n dot prev, drawn as new arrows joining X and Y directly while N floats free. Insert at head: four assignments, n dot next equals head dot next, n dot prev equals head, head dot next dot prev equals n, and head dot next equals n. After: HEAD, N, X, Y, TAIL.">
  <defs>
    <marker id="lc-p1" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#9099a8"/></marker>
    <marker id="lc-p2" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5cc66f"/></marker>
  </defs>

  <text x="14" y="20" font-size="10.5" fill="#9099a8">① BEFORE — you got N from the map in O(1); you do not know where it sits, and you do not need to</text>
  <rect x="14" y="30" width="54" height="38" rx="5" fill="#1a1d22" stroke="#3a414c"/><text x="22" y="54" font-size="9" fill="#9099a8">HEAD</text>
  <rect x="98" y="30" width="54" height="38" rx="5" fill="#14161a" stroke="#2d333d"/><text x="120" y="54" font-size="11" fill="#e8e4dc">X</text>
  <rect x="182" y="30" width="54" height="38" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="204" y="54" font-size="11" fill="#fb863a">N</text>
  <rect x="266" y="30" width="54" height="38" rx="5" fill="#14161a" stroke="#2d333d"/><text x="288" y="54" font-size="11" fill="#e8e4dc">Y</text>
  <rect x="350" y="30" width="54" height="38" rx="5" fill="#1a1d22" stroke="#3a414c"/><text x="360" y="54" font-size="9" fill="#9099a8">TAIL</text>
  <line x1="68" y1="42" x2="94" y2="42" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-p1)"/>
  <line x1="152" y1="42" x2="178" y2="42" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-p1)"/>
  <line x1="236" y1="42" x2="262" y2="42" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-p1)"/>
  <line x1="320" y1="42" x2="346" y2="42" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-p1)"/>
  <line x1="94" y1="60" x2="68" y2="60" stroke="#6b7280" stroke-width="1" marker-end="url(#lc-p1)"/>
  <line x1="178" y1="60" x2="152" y2="60" stroke="#6b7280" stroke-width="1" marker-end="url(#lc-p1)"/>
  <line x1="262" y1="60" x2="236" y2="60" stroke="#6b7280" stroke-width="1" marker-end="url(#lc-p1)"/>
  <line x1="346" y1="60" x2="320" y2="60" stroke="#6b7280" stroke-width="1" marker-end="url(#lc-p1)"/>
  <text x="426" y="46" font-size="9.5" fill="#6b7280">map.get("N") handed you this node directly</text>
  <text x="426" y="62" font-size="9.5" fill="#6b7280">— no walking, no index, no search</text>

  <line x1="14" y1="86" x2="706" y2="86" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="14" y="110" font-size="10.5" fill="#5cc66f">② UNLINK — two assignments, and X and Y now hold hands across the gap</text>
  <rect x="14" y="120" width="54" height="38" rx="5" fill="#1a1d22" stroke="#3a414c"/><text x="22" y="144" font-size="9" fill="#9099a8">HEAD</text>
  <rect x="98" y="120" width="54" height="38" rx="5" fill="#14161a" stroke="#2d333d"/><text x="120" y="144" font-size="11" fill="#e8e4dc">X</text>
  <rect x="182" y="96" width="54" height="30" rx="5" fill="#14161a" stroke="rgba(251,134,58,0.35)" stroke-dasharray="3 3"/><text x="204" y="116" font-size="11" fill="#fb863a">N</text>
  <rect x="266" y="120" width="54" height="38" rx="5" fill="#14161a" stroke="#2d333d"/><text x="288" y="144" font-size="11" fill="#e8e4dc">Y</text>
  <rect x="350" y="120" width="54" height="38" rx="5" fill="#1a1d22" stroke="#3a414c"/><text x="360" y="144" font-size="9" fill="#9099a8">TAIL</text>
  <line x1="68" y1="132" x2="94" y2="132" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-p1)"/>
  <path d="M152,130 C186,110 232,110 262,130" fill="none" stroke="#5cc66f" stroke-width="1.4" marker-end="url(#lc-p2)"/>
  <path d="M262,150 C232,168 186,168 152,150" fill="none" stroke="#5cc66f" stroke-width="1.4" marker-end="url(#lc-p2)"/>
  <line x1="320" y1="132" x2="346" y2="132" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-p1)"/>
  <text x="426" y="120" font-size="10" fill="#5cc66f">1.  n.prev.next = n.next;</text>
  <text x="426" y="140" font-size="10" fill="#5cc66f">2.  n.next.prev = n.prev;</text>
  <text x="426" y="160" font-size="9" fill="#6b7280">no null checks — X and Y always exist,</text>
  <text x="426" y="174" font-size="9" fill="#6b7280">because HEAD and TAIL are always there</text>

  <line x1="14" y1="196" x2="706" y2="196" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="14" y="220" font-size="10.5" fill="#5cc66f">③ INSERT AT HEAD — four assignments, in this order</text>
  <rect x="14" y="230" width="54" height="38" rx="5" fill="#1a1d22" stroke="#3a414c"/><text x="22" y="254" font-size="9" fill="#9099a8">HEAD</text>
  <rect x="98" y="230" width="54" height="38" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="120" y="254" font-size="11" fill="#fb863a">N</text>
  <rect x="182" y="230" width="54" height="38" rx="5" fill="#14161a" stroke="#2d333d"/><text x="204" y="254" font-size="11" fill="#e8e4dc">X</text>
  <rect x="266" y="230" width="54" height="38" rx="5" fill="#14161a" stroke="#2d333d"/><text x="288" y="254" font-size="11" fill="#e8e4dc">Y</text>
  <rect x="350" y="230" width="54" height="38" rx="5" fill="#1a1d22" stroke="#3a414c"/><text x="360" y="254" font-size="9" fill="#9099a8">TAIL</text>
  <line x1="68" y1="242" x2="94" y2="242" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lc-p1)"/>
  <line x1="152" y1="242" x2="178" y2="242" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-p1)"/>
  <line x1="236" y1="242" x2="262" y2="242" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-p1)"/>
  <line x1="320" y1="242" x2="346" y2="242" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-p1)"/>
  <line x1="94" y1="260" x2="68" y2="260" stroke="#6b7280" stroke-width="1" marker-end="url(#lc-p1)"/>
  <line x1="178" y1="260" x2="152" y2="260" stroke="#6b7280" stroke-width="1" marker-end="url(#lc-p1)"/>
  <line x1="262" y1="260" x2="236" y2="260" stroke="#6b7280" stroke-width="1" marker-end="url(#lc-p1)"/>
  <line x1="346" y1="260" x2="320" y2="260" stroke="#6b7280" stroke-width="1" marker-end="url(#lc-p1)"/>
  <text x="426" y="226" font-size="10" fill="#5cc66f">3.  n.next = head.next;</text>
  <text x="426" y="244" font-size="10" fill="#5cc66f">4.  n.prev = head;</text>
  <text x="426" y="262" font-size="10" fill="#5cc66f">5.  head.next.prev = n;</text>
  <text x="426" y="280" font-size="10" fill="#5cc66f">6.  head.next = n;</text>
  <text x="426" y="300" font-size="9" fill="#f06868">swap 5 and 6 and you have lost the old first node</text>

  <text x="14" y="300" font-size="9.5" fill="#9099a8">six assignments · no loop · no length</text>
  <text x="14" y="316" font-size="9.5" fill="#9099a8">this is the O(1) the problem is about</text>
  <text x="14" y="340" font-size="9.5" fill="#fb863a">get() = one map lookup + these six lines. That is the entire hot path.</text>
</svg>`,
        caption:
          "Read assignment **6** last. `head.next = n` overwrites the pointer you needed in step 3 and step 5 — which is why the order is not arbitrary and why writing it out beats waving at it.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The sentinels are not decoration",
        text: "`HEAD` and `TAIL` are two real nodes that hold no key and no value, wired to each other at construction. With them, `n.prev` and `n.next` are **never null** for any node in the list, so `unlink` and `insertAtHead` have zero branches. Without them, every one of those six lines needs an *“is this the first node? is this the only node?”* guard, and the first thing that breaks in the interview is the empty-list case. Two wasted objects, an entire class of bugs deleted.",
      },
      {
        type: "code",
        language: "java",
        filename: "the whole of LRU, in one screen",
        code: `private void unlink(Node<K> n) {
    n.prev.next = n.next;      // 1
    n.next.prev = n.prev;      // 2
    n.prev = null; n.next = null;
}

private void insertAtHead(Node<K> n) {
    n.next = head.next;        // 3
    n.prev = head;             // 4
    head.next.prev = n;        // 5   <- must happen BEFORE line 6
    head.next = n;             // 6
}

// "this key was just used" — the whole of LRU
void recordAccess(K key) {
    Node<K> n = nodes.get(key);
    if (n == null) return;
    unlink(n);
    insertAtHead(n);
}

// "who dies next?" — no scan, no comparison, no loop
K evictCandidate() {
    return tail.prev == head ? null : tail.prev.key;
}`,
      },

      // ---------- why doubly ----------
      { type: "h", text: "Why the list must be doubly linked" },
      {
        type: "p",
        text: "This is the question that separates people who memorised the answer from people who understand it. You found the node through the map in O(1). To unlink it you need to change its **predecessor's** `next` pointer. With only `next` pointers, the node has no idea who its predecessor is — and the only way to find out is to walk from the head until you find the node whose `next` is you.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 214" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A singly linked list of five nodes with only next pointers. The map points straight at node N, but to unlink N the code must know N's predecessor, and the only way to find it is to walk from HEAD checking each node's next pointer, shown as three numbered dotted hops. A red note says the walk is O of n and destroys the constant time guarantee, while the doubly linked version reads n dot prev directly.">
  <defs>
    <marker id="lc-s1" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#9099a8"/></marker>
    <marker id="lc-s2" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
    <marker id="lc-s3" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <text x="14" y="22" font-size="10.5" fill="#f06868">✗ ONLY next POINTERS</text>

  <rect x="14" y="72" width="54" height="38" rx="5" fill="#1a1d22" stroke="#3a414c"/><text x="22" y="96" font-size="9" fill="#9099a8">HEAD</text>
  <rect x="98" y="72" width="54" height="38" rx="5" fill="#14161a" stroke="#2d333d"/><text x="120" y="96" font-size="11" fill="#e8e4dc">P</text>
  <rect x="182" y="72" width="54" height="38" rx="5" fill="#14161a" stroke="#2d333d"/><text x="204" y="96" font-size="11" fill="#e8e4dc">Q</text>
  <rect x="266" y="72" width="54" height="38" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="288" y="96" font-size="11" fill="#fb863a">N</text>
  <rect x="350" y="72" width="54" height="38" rx="5" fill="#14161a" stroke="#2d333d"/><text x="372" y="96" font-size="11" fill="#e8e4dc">Y</text>

  <line x1="68" y1="91" x2="94" y2="91" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-s1)"/>
  <line x1="152" y1="91" x2="178" y2="91" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-s1)"/>
  <line x1="236" y1="91" x2="262" y2="91" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-s1)"/>
  <line x1="320" y1="91" x2="346" y2="91" stroke="#9099a8" stroke-width="1.1" marker-end="url(#lc-s1)"/>

  <rect x="248" y="20" width="118" height="26" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <text x="256" y="37" font-size="9" fill="#5e9ff6">map.get("N") ⬤</text>
  <line x1="300" y1="46" x2="294" y2="68" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#lc-s3)"/>
  <text x="378" y="37" font-size="9.5" fill="#5e9ff6">the map gets you to N instantly …</text>

  <path d="M41,116 C60,146 96,146 118,120" fill="none" stroke="#f06868" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#lc-s2)"/>
  <text x="62" y="156" font-size="9" fill="#f06868">1</text>
  <path d="M125,116 C144,146 180,146 202,120" fill="none" stroke="#f06868" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#lc-s2)"/>
  <text x="146" y="156" font-size="9" fill="#f06868">2</text>
  <path d="M209,116 C228,146 264,146 286,120" fill="none" stroke="#f06868" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#lc-s2)"/>
  <text x="230" y="156" font-size="9" fill="#f06868">3 — found it: Q.next == N</text>

  <text x="420" y="80" font-size="10" fill="#f06868">… but N cannot name its predecessor.</text>
  <text x="420" y="100" font-size="10" fill="#f06868">Walking from HEAD to find Q is O(n),</text>
  <text x="420" y="120" font-size="10" fill="#f06868">so get() is O(n) and the design is dead.</text>

  <line x1="14" y1="172" x2="706" y2="172" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="14" y="194" font-size="10" fill="#5cc66f">✓ WITH prev POINTERS — n.prev IS Q. One field read replaces the whole walk.</text>
  <text x="14" y="210" font-size="9.5" fill="#9099a8">The second pointer costs one machine word per entry. It buys the O(1) that the entire problem is about.</text>
</svg>`,
        caption:
          "The extra `prev` field is not a nicety — it is the difference between the design working and the design being a linear scan with extra steps.",
      },

      // ---------- get / put flows ----------
      { type: "h", text: "Step 4 · The two flows, precisely" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 306" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram for get. On a hit the client calls get on the cache, the cache reads the store map, gets a value, increments hits, calls recordAccess on the policy which unlinks the node and inserts it at the head, and returns the value. On a miss the store returns null, the cache increments misses and returns empty, and the client is responsible for loading from the origin and calling put.">
  <defs>
    <marker id="lc-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="lc-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="100" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="38" y="32" font-size="10.5" fill="#e8e4dc">Client</text>
  <rect x="196" y="12" width="100" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="222" y="32" font-size="10.5" fill="#fb863a">Cache</text>
  <rect x="374" y="12" width="112" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="390" y="32" font-size="10.5" fill="#e8e4dc">store: Map</text>
  <rect x="560" y="12" width="140" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="574" y="32" font-size="10.5" fill="#5cc66f">LruPolicy</text>

  <line x1="64" y1="42" x2="64" y2="292" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="246" y1="42" x2="246" y2="292" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="430" y1="42" x2="430" y2="292" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="630" y1="42" x2="630" y2="292" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="72" y="64" font-size="10" fill="#5cc66f">HIT — get("A")</text>
  <line x1="64" y1="72" x2="242" y2="72" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lc-call)"/>
  <line x1="246" y1="96" x2="426" y2="96" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lc-call)"/>
  <text x="254" y="90" font-size="10" fill="#e8e4dc">store.get("A")</text>
  <line x1="430" y1="118" x2="250" y2="118" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lc-ret)"/>
  <text x="286" y="112" font-size="10" fill="#5cc66f">value  ·  hits++</text>
  <line x1="246" y1="142" x2="626" y2="142" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lc-call)"/>
  <text x="300" y="136" font-size="10" fill="#e8e4dc">policy.recordAccess("A")</text>
  <rect x="618" y="148" width="86" height="42" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="626" y="164" font-size="9" fill="#5cc66f">unlink(n)</text>
  <text x="626" y="180" font-size="9" fill="#5cc66f">insertAtHead(n)</text>
  <line x1="630" y1="202" x2="250" y2="202" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lc-ret)"/>
  <line x1="242" y1="216" x2="68" y2="216" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lc-ret)"/>
  <text x="86" y="210" font-size="10" fill="#5cc66f">value</text>

  <line x1="14" y1="232" x2="706" y2="232" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="72" y="254" font-size="10" fill="#f06868">MISS — get("Z")</text>
  <line x1="64" y1="262" x2="242" y2="262" stroke="#f06868" stroke-width="1.3" marker-end="url(#lc-call)"/>
  <line x1="246" y1="278" x2="426" y2="278" stroke="#f06868" stroke-width="1.2" marker-end="url(#lc-call)"/>
  <text x="254" y="274" font-size="9.5" fill="#9099a8">store.get("Z") → null · misses++</text>
  <line x1="242" y1="296" x2="68" y2="296" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lc-ret)"/>
  <text x="86" y="292" font-size="9.5" fill="#f06868">empty — the policy is NOT touched on a miss</text>
</svg>`,
        caption:
          "Look at what a *read* does: it calls `recordAccess`, which **writes** to the linked list. There is no such thing as a read-only `get` in this design, and that fact comes back in the concurrency follow-up.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 336" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram for put with two paths. Path one, the key already exists: the cache overwrites the value in the store and calls recordAccess, the size does not change and nobody is evicted. Path two, a new key when the cache is full: the cache asks the policy for an evict candidate, gets key C, removes C from the store, tells the policy to record the removal, increments evictions, then stores the new key and calls recordInsert.">
  <defs>
    <marker id="lc-pcall" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="lc-pret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="100" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="38" y="32" font-size="10.5" fill="#e8e4dc">Client</text>
  <rect x="196" y="12" width="100" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="222" y="32" font-size="10.5" fill="#fb863a">Cache</text>
  <rect x="374" y="12" width="112" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="390" y="32" font-size="10.5" fill="#e8e4dc">store: Map</text>
  <rect x="560" y="12" width="140" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="574" y="32" font-size="10.5" fill="#5cc66f">policy</text>

  <line x1="64" y1="42" x2="64" y2="322" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="246" y1="42" x2="246" y2="322" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="430" y1="42" x2="430" y2="322" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="630" y1="42" x2="630" y2="322" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="72" y="64" font-size="10" fill="#5e9ff6">PATH 1 — the key is already there:  put("B", v2)</text>
  <line x1="64" y1="74" x2="242" y2="74" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lc-pcall)"/>
  <line x1="246" y1="96" x2="426" y2="96" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lc-pcall)"/>
  <text x="254" y="91" font-size="9.5" fill="#e8e4dc">containsKey("B") → true · store.put("B", v2)</text>
  <line x1="246" y1="118" x2="626" y2="118" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lc-pcall)"/>
  <text x="300" y="113" font-size="9.5" fill="#e8e4dc">policy.recordAccess("B")</text>
  <text x="72" y="140" font-size="10" fill="#5e9ff6">size unchanged · nothing is evicted · this is the path people get wrong</text>

  <line x1="14" y1="154" x2="706" y2="154" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="72" y="176" font-size="10" fill="#fb863a">PATH 2 — a new key, and the cache is full:  put("D", v)</text>
  <line x1="64" y1="186" x2="242" y2="186" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lc-pcall)"/>
  <text x="254" y="206" font-size="9.5" fill="#9099a8">store.size() == capacity → make room FIRST</text>
  <line x1="246" y1="228" x2="626" y2="228" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lc-pcall)"/>
  <text x="300" y="223" font-size="9.5" fill="#e8e4dc">policy.evictCandidate()</text>
  <line x1="630" y1="248" x2="250" y2="248" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lc-pret)"/>
  <text x="330" y="243" font-size="9.5" fill="#f06868">"C"  ← tail.prev, in O(1)</text>
  <line x1="246" y1="268" x2="426" y2="268" stroke="#f06868" stroke-width="1.2" marker-end="url(#lc-pcall)"/>
  <text x="254" y="263" font-size="9.5" fill="#f06868">store.remove("C") · evictions++</text>
  <line x1="246" y1="290" x2="626" y2="290" stroke="#f06868" stroke-width="1.2" marker-end="url(#lc-pcall)"/>
  <text x="300" y="285" font-size="9.5" fill="#f06868">policy.recordRemove("C")</text>
  <line x1="246" y1="312" x2="626" y2="312" stroke="#5cc66f" stroke-width="1.2" marker-end="url(#lc-pcall)"/>
  <text x="278" y="307" font-size="9.5" fill="#5cc66f">store.put("D", v) · policy.recordInsert("D")  → D is now the MRU</text>
</svg>`,
        caption:
          "**Path 1 is the trap.** `put` on a key that is already present must not grow the cache and must not evict anything — but it *must* count as a use. Candidates who write `evictIfFull(); insert();` unconditionally throw away a live entry on every overwrite.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Evict before you insert, not after",
        text: "Inserting first and then trimming works, but for one moment the cache holds `capacity + 1` entries — and if the new key itself is chosen as the victim (possible in some policies), you have just inserted and deleted the thing you were asked to store. Check `size() >= capacity`, evict, then insert. Same principle as *do everything that can fail before the first irreversible step* in [[coffee-machine]].",
      },

      // ---------- the seam ----------
      { type: "h", text: "Step 5 · The seam — EvictionPolicy is an interface" },
      {
        type: "p",
        text: "Here is the moment the problem stops being a LeetCode exercise and becomes a design answer. `Cache` should own **storage, capacity and counters**. It should not own an opinion about who dies. Give the opinion its own type, with four methods:",
      },
      {
        type: "code",
        language: "java",
        filename: "the only interface in the file",
        code: `interface EvictionPolicy<K> {
    void recordInsert(K key);   // a brand-new key entered the cache
    void recordAccess(K key);   // an existing key was read or overwritten
    void recordRemove(K key);   // a key left the cache
    K    evictCandidate();      // who dies next — null if empty
}`,
      },
      {
        type: "p",
        text: "Now read `Cache.get()` again: it looks up the value, bumps a counter, and calls `recordAccess`. It never says the word *recency*. Swap `new LruPolicy()` for `new LfuPolicy()` in the constructor and **zero lines inside `Cache` change**. That is [[strategy]] doing exactly what it is for, and it is the [[open-closed]] principle stated as code: open to a new policy, closed to editing the cache.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 342" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. Cache holds a store map, a capacity, an eviction policy and hit, miss and eviction counters, and exposes synchronized get and put. It points at an EvictionPolicy interface with recordInsert, recordAccess, recordRemove and evictCandidate. Three classes implement it: LruPolicy, LfuPolicy and FifoPolicy. LruPolicy owns a private Node class with key, prev and next fields plus HEAD and TAIL sentinels.">
  <defs>
    <marker id="lc-uml" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="lc-impl" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="11" refX="11" refY="4" orient="auto"><path d="M1,0 L11,4 L1,8 z" fill="none" stroke="#5cc66f" stroke-width="1.2"/></marker>
  </defs>

  <rect x="20" y="18" width="252" height="152" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="34" y="40" font-size="11.5" fill="#fb863a">Cache&lt;K,V&gt;</text>
  <line x1="20" y1="48" x2="272" y2="48" stroke="#2d333d"/>
  <text x="34" y="66" font-size="9.5" fill="#9099a8">- store : Map&lt;K,V&gt;</text>
  <text x="34" y="84" font-size="9.5" fill="#9099a8">- capacity : int</text>
  <text x="34" y="102" font-size="9.5" fill="#fb863a">- policy : EvictionPolicy&lt;K&gt;</text>
  <text x="34" y="120" font-size="9.5" fill="#9099a8">- hits, misses, evictions : long</text>
  <line x1="20" y1="128" x2="272" y2="128" stroke="#2d333d"/>
  <text x="34" y="146" font-size="9.5" fill="#e8e4dc">+ synchronized get(K) : V</text>
  <text x="34" y="162" font-size="9.5" fill="#e8e4dc">+ synchronized put(K, V)</text>

  <line x1="274" y1="80" x2="396" y2="80" stroke="#9099a8" stroke-width="1.2" marker-end="url(#lc-uml)"/>
  <text x="290" y="72" font-size="9" fill="#6b7280">«strategy» owns one</text>

  <rect x="400" y="18" width="290" height="140" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.3"/>
  <text x="414" y="38" font-size="9" fill="#6b7280">«interface»</text>
  <text x="414" y="56" font-size="11.5" fill="#5cc66f">EvictionPolicy&lt;K&gt;</text>
  <line x1="400" y1="64" x2="690" y2="64" stroke="#2d333d"/>
  <text x="414" y="82" font-size="9.5" fill="#e8e4dc">+ recordInsert(K)</text>
  <text x="414" y="100" font-size="9.5" fill="#e8e4dc">+ recordAccess(K)</text>
  <text x="414" y="118" font-size="9.5" fill="#e8e4dc">+ recordRemove(K)</text>
  <text x="414" y="136" font-size="9.5" fill="#fb863a">+ evictCandidate() : K</text>
  <text x="414" y="152" font-size="9" fill="#6b7280">the only decision that varies</text>

  <line x1="392" y1="212" x2="470" y2="164" stroke="#5cc66f" stroke-width="1.2" marker-end="url(#lc-impl)"/>
  <line x1="530" y1="212" x2="530" y2="164" stroke="#5cc66f" stroke-width="1.2" marker-end="url(#lc-impl)"/>
  <line x1="646" y1="212" x2="588" y2="164" stroke="#5cc66f" stroke-width="1.2" marker-end="url(#lc-impl)"/>

  <rect x="336" y="216" width="112" height="56" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="348" y="238" font-size="10.5" fill="#e8e4dc">LruPolicy</text>
  <text x="348" y="256" font-size="8.5" fill="#9099a8">map + DLL</text>

  <rect x="474" y="216" width="112" height="56" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="486" y="238" font-size="10.5" fill="#e8e4dc">LfuPolicy</text>
  <text x="486" y="256" font-size="8.5" fill="#9099a8">freq buckets</text>

  <rect x="600" y="216" width="90" height="56" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="610" y="238" font-size="10.5" fill="#e8e4dc">FifoPolicy</text>
  <text x="610" y="256" font-size="8.5" fill="#9099a8">a queue</text>

  <rect x="20" y="200" width="252" height="96" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="222" font-size="10.5" fill="#e8e4dc">Node&lt;K&gt;</text>
  <text x="128" y="222" font-size="8.5" fill="#6b7280">«private to LruPolicy»</text>
  <line x1="20" y1="230" x2="272" y2="230" stroke="#2d333d"/>
  <text x="34" y="248" font-size="9.5" fill="#9099a8">- key : K</text>
  <text x="34" y="264" font-size="9.5" fill="#fb863a">- prev : Node · next : Node</text>
  <text x="34" y="284" font-size="9" fill="#6b7280">plus two sentinels: HEAD, TAIL</text>
  <line x1="332" y1="244" x2="278" y2="244" stroke="#9099a8" stroke-width="1.2" marker-end="url(#lc-uml)"/>

  <text x="20" y="322" font-size="10" fill="#5cc66f">Cache never mentions LRU, LFU, recency, frequency or a linked list. That is the seam.</text>
  <text x="20" y="338" font-size="9.5" fill="#9099a8">One interface, four methods, and Cache is closed to change.</text>
</svg>`,
        caption:
          "Cover the right half of this diagram with your hand. What is left — `Cache` plus `Node` — is a complete, working LRU cache. The right half is what makes *“now make it LFU”* a five-minute answer. Notation: [[class-diagrams]]; the flows above are [[sequence-diagrams]].",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The trap most candidates fall into",
        text: "One class called `LRUCache`, with `unlink` and `moveToFront` written directly inside `get()`. It works, it passes the test, and then the interviewer says *“now make it LFU”* — and there is nowhere to put the change. You end up either rewriting the class or adding an `if (mode == LFU)` branch through the hot path. Ten extra minutes at minute 30 to pull the interface out is the single highest-value spend in this round.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The honest cost of the seam",
        text: "In the welded version the map stores `key → Node` and the node holds the value, so a hit is **one** hash lookup. With a policy interface, `Cache` keeps `key → value` and the policy keeps its own `key → Node`, so a hit is **two** hash lookups and one extra object per entry. Still O(1), still nothing to worry about at interview scale — but say it out loud. Knowing what your abstraction costs is worth more than pretending it is free.",
      },

      // ---------- LFU ----------
      { type: "h", text: "Step 6 · LFU is a different structure, not a tweak" },
      {
        type: "p",
        text: "*“Now evict the least-frequently-used key instead.”* The naive move is to add a `count` field to each node and scan for the minimum — which is O(n) and undoes everything you just built. LFU needs its own three pieces:",
      },
      {
        type: "ol",
        items: [
          "`key → frequency` — how many times each key has been touched.",
          "`frequency → a doubly-linked list of the keys at that frequency`, ordered by recency inside the bucket.",
          "**`minFreq`** — a single integer holding the lowest frequency currently in use. This is the whole trick: without it, finding the victim means searching the buckets.",
        ],
      },
      {
        type: "p",
        text: "On access, a key moves from bucket `f` to bucket `f+1`. If bucket `f` is now empty **and** `f == minFreq`, then `minFreq++` — and that is the *only* place `minFreq` ever increases, because a key can only ever gain one frequency at a time. On insert, the new key goes into bucket 1 and `minFreq = 1`, because a fresh key is always the new minimum. Eviction takes the **oldest entry in bucket `minFreq`** — so the tie inside a frequency bucket is broken by **recency**, which is to say LFU has an LRU hiding inside it. Say that sentence; interviewers ask about the tie-break specifically.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The LFU structure. On the left a key to frequency map. On the right three frequency buckets, one, two and three, each holding a small doubly linked list of keys ordered by recency with the newest on the left. A minFreq pointer points at bucket one. A curved orange arrow shows key B being promoted from bucket two to bucket three, leaving bucket two empty, and a note explains that because minFreq is one and not two, minFreq does not move. The victim is the rightmost key of the bucket that minFreq points at.">
  <defs>
    <marker id="lc-promo" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <text x="14" y="24" font-size="10" fill="#5e9ff6">key → freq</text>
  <rect x="14" y="34" width="118" height="106" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="30" y="58" font-size="10" fill="#e8e4dc">"E" → 1</text>
  <text x="30" y="84" font-size="10" fill="#e8e4dc">"B" → 3</text>
  <text x="30" y="110" font-size="10" fill="#e8e4dc">"A" → 3</text>
  <text x="14" y="162" font-size="9" fill="#6b7280">a counter alone is</text>
  <text x="14" y="176" font-size="9" fill="#6b7280">useless — finding the</text>
  <text x="14" y="190" font-size="9" fill="#6b7280">minimum would be O(n)</text>

  <text x="164" y="24" font-size="10" fill="#fb863a">freq → doubly-linked list of keys (newest on the left)</text>

  <text x="164" y="62" font-size="10" fill="#f06868">minFreq ▸</text>
  <rect x="238" y="42" width="50" height="34" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.5)"/>
  <text x="256" y="64" font-size="11" fill="#f06868">1</text>
  <rect x="300" y="42" width="62" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="326" y="64" font-size="11" fill="#e8e4dc">E</text>
  <text x="378" y="64" font-size="9.5" fill="#f06868">← the victim: last node of bucket minFreq</text>

  <rect x="238" y="94" width="50" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="256" y="116" font-size="11" fill="#9099a8">2</text>
  <rect x="300" y="94" width="62" height="34" rx="5" fill="#0a0b0e" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="312" y="116" font-size="9" fill="#6b7280">empty</text>
  <text x="378" y="112" font-size="9.5" fill="#9099a8">bucket 2 just emptied — but minFreq is 1,</text>
  <text x="378" y="126" font-size="9.5" fill="#9099a8">not 2, so minFreq does NOT move</text>

  <rect x="238" y="146" width="50" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="256" y="168" font-size="11" fill="#9099a8">3</text>
  <rect x="300" y="146" width="62" height="34" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="326" y="168" font-size="11" fill="#fb863a">B</text>
  <rect x="374" y="146" width="62" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="400" y="168" font-size="11" fill="#e8e4dc">A</text>
  <line x1="362" y1="163" x2="370" y2="163" stroke="#9099a8" stroke-width="1.1"/>
  <text x="452" y="168" font-size="9.5" fill="#9099a8">newest in the bucket sits on the left</text>

  <path d="M300,112 C270,132 274,146 296,158" fill="none" stroke="#fb863a" stroke-width="1.4" marker-end="url(#lc-promo)"/>
  <text x="164" y="146" font-size="9.5" fill="#fb863a">get("B")</text>
  <text x="164" y="160" font-size="9.5" fill="#fb863a">promotes it</text>
  <text x="164" y="174" font-size="9.5" fill="#fb863a">2 → 3</text>

  <line x1="14" y1="212" x2="706" y2="212" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="14" y="234" font-size="10" fill="#5cc66f">recordInsert:  freq = 1 · push into bucket 1 · minFreq = 1     (a new key is always the new minimum)</text>
  <text x="14" y="254" font-size="10" fill="#5cc66f">recordAccess:  move key from bucket f to bucket f+1 · if bucket f is now empty AND f == minFreq → minFreq++</text>
  <text x="14" y="274" font-size="10" fill="#5cc66f">evictCandidate: last node of bucket[minFreq]      — every one of these is O(1)</text>
  <text x="14" y="294" font-size="9.5" fill="#6b7280">minFreq only ever moves up by ONE, because a single access raises a frequency by exactly one.</text>
</svg>`,
        caption:
          "Point at `minFreq` when you explain this. Everything else in LFU is bookkeeping; that one integer is what turns *“find the minimum”* from a search into a lookup.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "LFU's real flaw — say it before they ask",
        text: "A key that got hammered a thousand times during a one-off batch job at 3am has a frequency of 1000 forever, and it will outlive keys that are genuinely hot today. That is **cache pollution**, and pure LFU has no cure for it. The fixes are all forms of forgetting: **aging** (periodically halve every count), a **decay factor** on each access, or a **windowed count** that only remembers the recent past. That last one is what **TinyLFU** does, and it is what modern caches like Caffeine actually ship — a small window LRU in front, admitting into a large LFU-governed main region using a sketch of recent frequencies.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 330" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The same ten accesses A A A B C B D E B A replayed at capacity three under two policies. The LRU row shows the cache contents after each step and marks that A is evicted at step seven and C at step eight, ending with four hits out of ten, forty percent. The LFU row shows contents with frequency badges and marks that C is evicted at step seven and D at step eight, keeping A alive, ending with five hits out of ten, fifty percent. At step ten LRU misses on A while LFU hits.">
  <text x="14" y="18" font-size="10" fill="#9099a8">capacity 3 · the identical 10 accesses · two policies</text>

  <text x="14" y="46" font-size="9.5" fill="#6b7280">access</text>
  <rect x="74" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="101" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">A</text>
  <rect x="137" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="164" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">A</text>
  <rect x="200" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="227" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">A</text>
  <rect x="263" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="290" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">B</text>
  <rect x="326" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="353" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">C</text>
  <rect x="389" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="416" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">B</text>
  <rect x="452" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="479" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">D</text>
  <rect x="515" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="542" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">E</text>
  <rect x="578" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="605" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">B</text>
  <rect x="641" y="30" width="54" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="668" y="46" font-size="10" fill="#e8e4dc" text-anchor="middle">A</text>

  <text x="14" y="82" font-size="11" fill="#fb863a">LRU</text>
  <text x="14" y="98" font-size="8.5" fill="#6b7280">MRU first</text>
  <text x="101" y="72" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="164" y="72" font-size="9" fill="#5cc66f" text-anchor="middle">✓</text>
  <text x="227" y="72" font-size="9" fill="#5cc66f" text-anchor="middle">✓</text>
  <text x="290" y="72" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="353" y="72" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="416" y="72" font-size="9" fill="#5cc66f" text-anchor="middle">✓</text>
  <text x="479" y="72" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="542" y="72" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="605" y="72" font-size="9" fill="#5cc66f" text-anchor="middle">✓</text>
  <text x="668" y="72" font-size="9" fill="#f06868" text-anchor="middle">✗</text>

  <text x="101" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A</text>
  <text x="164" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A</text>
  <text x="227" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A</text>
  <text x="290" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B</text>
  <text x="290" y="106" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A</text>
  <text x="353" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">C</text>
  <text x="353" y="106" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B</text>
  <text x="353" y="120" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A</text>
  <text x="416" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B</text>
  <text x="416" y="106" font-size="9.5" fill="#e8e4dc" text-anchor="middle">C</text>
  <text x="416" y="120" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A</text>
  <text x="479" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">D</text>
  <text x="479" y="106" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B</text>
  <text x="479" y="120" font-size="9.5" fill="#e8e4dc" text-anchor="middle">C</text>
  <text x="542" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">E</text>
  <text x="542" y="106" font-size="9.5" fill="#e8e4dc" text-anchor="middle">D</text>
  <text x="542" y="120" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B</text>
  <text x="605" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B</text>
  <text x="605" y="106" font-size="9.5" fill="#e8e4dc" text-anchor="middle">E</text>
  <text x="605" y="120" font-size="9.5" fill="#e8e4dc" text-anchor="middle">D</text>
  <text x="668" y="92" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A</text>
  <text x="668" y="106" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B</text>
  <text x="668" y="120" font-size="9.5" fill="#e8e4dc" text-anchor="middle">E</text>

  <ellipse cx="479" cy="140" rx="24" ry="11" fill="rgba(240,104,104,0.14)" stroke="#f06868"/>
  <text x="479" y="144" font-size="9" fill="#f06868" text-anchor="middle">✗ A</text>
  <ellipse cx="542" cy="140" rx="24" ry="11" fill="rgba(240,104,104,0.14)" stroke="#f06868"/>
  <text x="542" y="144" font-size="9" fill="#f06868" text-anchor="middle">✗ C</text>
  <ellipse cx="668" cy="140" rx="24" ry="11" fill="rgba(240,104,104,0.14)" stroke="#f06868"/>
  <text x="668" y="144" font-size="9" fill="#f06868" text-anchor="middle">✗ D</text>
  <text x="14" y="144" font-size="9.5" fill="#f06868">4 hits / 10</text>

  <line x1="14" y1="160" x2="706" y2="160" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="14" y="196" font-size="11" fill="#5cc66f">LFU</text>
  <text x="14" y="212" font-size="8.5" fill="#6b7280">key·freq</text>
  <text x="101" y="186" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="164" y="186" font-size="9" fill="#5cc66f" text-anchor="middle">✓</text>
  <text x="227" y="186" font-size="9" fill="#5cc66f" text-anchor="middle">✓</text>
  <text x="290" y="186" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="353" y="186" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="416" y="186" font-size="9" fill="#5cc66f" text-anchor="middle">✓</text>
  <text x="479" y="186" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="542" y="186" font-size="9" fill="#f06868" text-anchor="middle">✗</text>
  <text x="605" y="186" font-size="9" fill="#5cc66f" text-anchor="middle">✓</text>
  <text x="668" y="186" font-size="9" fill="#5cc66f" text-anchor="middle">✓</text>

  <text x="101" y="206" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A·1</text>
  <text x="164" y="206" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A·2</text>
  <text x="227" y="206" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A·3</text>
  <text x="290" y="206" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A·3</text>
  <text x="290" y="220" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B·1</text>
  <text x="353" y="206" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A·3</text>
  <text x="353" y="220" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B·1</text>
  <text x="353" y="234" font-size="9.5" fill="#e8e4dc" text-anchor="middle">C·1</text>
  <text x="416" y="206" font-size="9.5" fill="#e8e4dc" text-anchor="middle">A·3</text>
  <text x="416" y="220" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B·2</text>
  <text x="416" y="234" font-size="9.5" fill="#e8e4dc" text-anchor="middle">C·1</text>
  <text x="479" y="206" font-size="9.5" fill="#5cc66f" text-anchor="middle">A·3</text>
  <text x="479" y="220" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B·2</text>
  <text x="479" y="234" font-size="9.5" fill="#e8e4dc" text-anchor="middle">D·1</text>
  <text x="542" y="206" font-size="9.5" fill="#5cc66f" text-anchor="middle">A·3</text>
  <text x="542" y="220" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B·2</text>
  <text x="542" y="234" font-size="9.5" fill="#e8e4dc" text-anchor="middle">E·1</text>
  <text x="605" y="206" font-size="9.5" fill="#5cc66f" text-anchor="middle">A·3</text>
  <text x="605" y="220" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B·3</text>
  <text x="605" y="234" font-size="9.5" fill="#e8e4dc" text-anchor="middle">E·1</text>
  <text x="668" y="206" font-size="9.5" fill="#5cc66f" text-anchor="middle">A·4</text>
  <text x="668" y="220" font-size="9.5" fill="#e8e4dc" text-anchor="middle">B·3</text>
  <text x="668" y="234" font-size="9.5" fill="#e8e4dc" text-anchor="middle">E·1</text>

  <ellipse cx="479" cy="254" rx="24" ry="11" fill="rgba(240,104,104,0.14)" stroke="#f06868"/>
  <text x="479" y="258" font-size="9" fill="#f06868" text-anchor="middle">✗ C</text>
  <ellipse cx="542" cy="254" rx="24" ry="11" fill="rgba(240,104,104,0.14)" stroke="#f06868"/>
  <text x="542" y="258" font-size="9" fill="#f06868" text-anchor="middle">✗ D</text>
  <text x="14" y="258" font-size="9.5" fill="#5cc66f">5 hits / 10</text>

  <text x="14" y="288" font-size="10" fill="#f06868">Step 7: LRU throws away A — the key it had just used three times — because it had gone quiet for three accesses.</text>
  <text x="14" y="306" font-size="10" fill="#5cc66f">LFU keeps A and kills C instead. At step 10 that pays: LRU misses on A, LFU hits. 40% vs 50%.</text>
  <text x="14" y="324" font-size="9.5" fill="#9099a8">C died before D under LFU because both sat at frequency 1 and C was the less recently used — the tie-break is LRU.</text>
</svg>`,
        caption:
          "Run this exact trace in the prototype under **🔁 LRU**, reset, then under **📊 LFU**. Same 10 clicks, different key in the bin, different hit ratio. Neither policy is *right* — they bet on different futures.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one-line answer to “LRU or LFU?”",
        text: "**LRU bets that what you touched recently you will touch again; LFU bets that what you touch often you will touch often.** LRU is cheap, adapts instantly to a change in workload, and is destroyed by a single full scan that sweeps the whole cache. LFU resists that scan, and in exchange it clings to yesterday's hot keys. Real systems use a hybrid for exactly this reason.",
      },

      // ---------- thread safety ----------
      { type: "h", text: "Thread safety — where the surprise is" },
      {
        type: "p",
        text: "Ask any candidate to make a cache thread-safe and they reach for a read-write lock: *“many readers, one writer.”* It is the wrong instinct here, and knowing why is worth a point. **`get()` is not a read.** It calls `recordAccess`, which unlinks a node and relinks it at the head — six pointer writes on a structure shared by everyone. Two concurrent `get`s on different keys can corrupt the list into a cycle, and then a later traversal never terminates.",
      },
      {
        type: "ul",
        items: [
          "**The 60-minute answer:** one lock (`synchronized`, or a `ReentrantLock`) around `get` and `put`. Four characters of code and it is correct. Say it, write it, move on. Background: [[locks-mutex-semaphore]].",
          "**Why a `ReadWriteLock` does not help:** everything takes the write lock anyway, because every operation mutates. You get the complexity of [[read-write-locks]] and none of the concurrency.",
          "**How you would actually scale it:** *striping* — split the key space into N independent segments, each with its own map, list and lock, so keys that hash to different segments never contend. The cost is that eviction becomes per-segment, so the policy is now approximate across the whole cache. That is a fine trade and it is what real caches do.",
          "**What production caches do instead:** Caffeine keeps the reads lock-free by writing each access into a small ring buffer and replaying those buffers onto the linked list **later, in one thread**. The reordering leaves the read path entirely. Mention it in one sentence; do not attempt it.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Capacity in entries or in bytes?",
        text: "Counting entries is fine for an interview and wrong for production: 1000 entries could be 4 MB or 4 GB. Real caches take a **weigher** — a function from an entry to its cost — and enforce a total weight. It is a one-line extension of the same design: `evict while totalWeight > maxWeight` instead of `while size > capacity`. Mention it; do not build it. And **TTL is a separate axis** — an entry can be evicted for being cold or dropped for being stale, and the two mechanisms do not know about each other. Depth on that belongs in [[key-value-store]].",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Metrics — the answer to “how would you know it is working?”",
        text: "Three counters and one derived number: **hits**, **misses**, **evictions**, and **hit ratio = hits / (hits + misses)**. It costs four lines and it is the only evidence that the cache is earning its memory. A hit ratio near zero means the cache is too small or the workload has no locality; a huge eviction count with a decent hit ratio means it is working hard but running hot. Print them in your `main()` — it turns *“it works”* into a number the interviewer can read.",
      },

      // ---------- extensibility ----------
      { type: "h", text: "What the seam actually buys you" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 258" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A cost table with three columns: the change, the cost when the list logic is welded into the Cache class, and the cost with an EvictionPolicy interface. Adding FIFO, adding Random, and adding a segmented LRU each require editing get and put in the welded design but only one new class in the policy design. Adding TTL expiry costs an edit to get in both designs, because expiry is a read time check and not an ordering. Adding metrics is a few fields on Cache either way.">
  <text x="14" y="22" font-size="10" fill="#9099a8">the change</text>
  <text x="248" y="22" font-size="10" fill="#f06868">✗ welded into Cache</text>
  <text x="482" y="22" font-size="10" fill="#5cc66f">✓ behind EvictionPolicy</text>
  <line x1="14" y1="30" x2="706" y2="30" stroke="#2d333d"/>

  <text x="14" y="54" font-size="10" fill="#e8e4dc">add FIFO</text>
  <text x="248" y="54" font-size="9.5" fill="#f06868">edit get() + put(), retest both</text>
  <text x="482" y="54" font-size="9.5" fill="#5cc66f">1 class, ~12 lines · Cache untouched</text>
  <line x1="14" y1="64" x2="706" y2="64" stroke="#232830"/>

  <text x="14" y="88" font-size="10" fill="#e8e4dc">add Random</text>
  <text x="248" y="88" font-size="9.5" fill="#f06868">edit get() + put() again</text>
  <text x="482" y="88" font-size="9.5" fill="#5cc66f">1 class, ~8 lines · Cache untouched</text>
  <line x1="14" y1="98" x2="706" y2="98" stroke="#232830"/>

  <text x="14" y="122" font-size="10" fill="#e8e4dc">add LFU</text>
  <text x="248" y="122" font-size="9.5" fill="#f06868">a rewrite, or an if (mode) branch</text>
  <text x="482" y="122" font-size="9.5" fill="#5cc66f">1 class · Cache untouched</text>
  <line x1="14" y1="132" x2="706" y2="132" stroke="#232830"/>

  <text x="14" y="156" font-size="10" fill="#e8e4dc">add segmented LRU</text>
  <text x="248" y="156" font-size="9.5" fill="#f06868">rewrite the whole hot path</text>
  <text x="482" y="156" font-size="9.5" fill="#5cc66f">1 class · Cache untouched</text>
  <line x1="14" y1="166" x2="706" y2="166" stroke="#232830"/>

  <text x="14" y="190" font-size="10" fill="#e8e4dc">add TTL expiry</text>
  <text x="248" y="190" font-size="9.5" fill="#fb863a">edit get()</text>
  <text x="482" y="190" font-size="9.5" fill="#fb863a">still edit get() — honestly</text>
  <line x1="14" y1="200" x2="706" y2="200" stroke="#232830"/>

  <text x="14" y="224" font-size="10" fill="#e8e4dc">add hit-ratio metrics</text>
  <text x="248" y="224" font-size="9.5" fill="#9099a8">3 fields on Cache</text>
  <text x="482" y="224" font-size="9.5" fill="#9099a8">3 fields on Cache</text>

  <text x="14" y="250" font-size="9.5" fill="#6b7280">The TTL row is the honest one: a seam only pays off for changes along the axis it was cut. Expiry is a different axis.</text>
</svg>`,
        caption:
          "Four green rows and one amber one. Say the amber row out loud — an interface that you claim solves everything is a red flag; one you can name the limits of is not.",
      },

      // ---------- budget ----------
      { type: "h", text: "The 60 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 196" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sixty minute budget bar split into seven segments: five minutes to clarify, five minutes for the API and a class sketch, eighteen minutes for the LRU core of map plus doubly linked list plus sentinels, eight minutes to extract the EvictionPolicy interface, twelve minutes for LFU with buckets and minFreq, six minutes for the lock and the metrics, and six minutes for a main method and running it.">
  <text x="20" y="40" font-size="9.5" fill="#6b7280">0 min</text>
  <text x="700" y="40" font-size="9.5" fill="#6b7280" text-anchor="end">60 min</text>

  <rect x="20" y="48" width="57" height="30" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="77" y="48" width="57" height="30" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="134" y="48" width="204" height="30" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="338" y="48" width="91" height="30" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="429" y="48" width="136" height="30" rx="4" fill="rgba(94,159,246,0.14)" stroke="rgba(94,159,246,0.5)"/>
  <rect x="565" y="48" width="68" height="30" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="633" y="48" width="67" height="30" rx="4" fill="#1a1d22" stroke="#3a414c"/>

  <line x1="48" y1="78" x2="48" y2="88" stroke="#3a414c"/>
  <text x="48" y="102" font-size="9.5" fill="#e8e4dc" text-anchor="middle">clarify</text>
  <text x="48" y="115" font-size="9" fill="#6b7280" text-anchor="middle">5</text>

  <line x1="236" y1="78" x2="236" y2="88" stroke="#fb863a"/>
  <text x="236" y="102" font-size="9.5" fill="#fb863a" text-anchor="middle">LRU core: map + DLL + sentinels</text>
  <text x="236" y="115" font-size="9" fill="#6b7280" text-anchor="middle">18</text>

  <line x1="497" y1="78" x2="497" y2="88" stroke="#5e9ff6"/>
  <text x="497" y="102" font-size="9.5" fill="#5e9ff6" text-anchor="middle">LFU: buckets + minFreq</text>
  <text x="497" y="115" font-size="9" fill="#6b7280" text-anchor="middle">12</text>

  <line x1="666" y1="78" x2="666" y2="88" stroke="#3a414c"/>
  <text x="666" y="102" font-size="9.5" fill="#e8e4dc" text-anchor="middle">main() + run it</text>
  <text x="666" y="115" font-size="9" fill="#6b7280" text-anchor="middle">6</text>

  <line x1="105" y1="78" x2="105" y2="134" stroke="#3a414c" stroke-dasharray="3 3"/>
  <text x="105" y="148" font-size="9.5" fill="#e8e4dc" text-anchor="middle">API + class sketch</text>
  <text x="105" y="161" font-size="9" fill="#6b7280" text-anchor="middle">5</text>

  <line x1="383" y1="78" x2="383" y2="134" stroke="#5cc66f" stroke-dasharray="3 3"/>
  <text x="383" y="148" font-size="9.5" fill="#5cc66f" text-anchor="middle">extract EvictionPolicy</text>
  <text x="383" y="161" font-size="9" fill="#6b7280" text-anchor="middle">8</text>

  <line x1="599" y1="78" x2="599" y2="134" stroke="#3a414c" stroke-dasharray="3 3"/>
  <text x="599" y="148" font-size="9.5" fill="#e8e4dc" text-anchor="middle">lock + metrics</text>
  <text x="599" y="161" font-size="9" fill="#6b7280" text-anchor="middle">6</text>

  <text x="20" y="188" font-size="9.5" fill="#fb863a">If you are at minute 30 without a working LRU, skip LFU entirely and describe it out loud. Running beats complete.</text>
</svg>`,
        caption:
          "The orange block is the one that must not slip. Everything to the right of it is optional; everything to the left of it is talking.",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“Java has this built in, doesn't it?”** → yes: `new LinkedHashMap<>(cap, 0.75f, true)` with `removeEldestEntry` overridden is a six-line LRU, and the `true` is *access order*. Name it — it shows you know the library. Then say the quiet part: *“in this round I assume you want the hand-rolled version, since that is what is being tested.”* Offering the shortcut and declining it reads better than not knowing it.",
          "**“Now make it LFU.”** → the whole point of the seam. New class, buckets plus `minFreq`, `Cache` untouched. If they push further: the tie inside a bucket is LRU, and pure LFU pollutes.",
          "**“Make it thread-safe.”** → one lock; explain that `get` mutates so a read-write lock buys nothing; mention striping and Caffeine's buffered replay as how you would scale it.",
          "**“Distribute it across ten servers.”** → a per-node LRU means ten caches with ten independent hit ratios and ten copies of the hot keys. Either route keys by consistent hashing so each key lives on one node, or accept the duplication and treat it as ten small caches. Invalidation across nodes is the genuinely hard part.",
          "**“Write-through, write-back or write-around?”** → write-through updates cache and store together (simple, always consistent, slower writes); write-back updates the cache and flushes later (fast, and you can lose data); write-around writes straight to the store and lets the next read populate the cache (good when writes are rarely re-read soon).",
          "**“What happens when a hot key expires and a thousand requests miss at once?”** → the thundering herd. One request loads and the rest wait on the same future, or you refresh slightly before expiry. One sentence, then stop — it is a whole problem of its own.",
          "**“How would you test it?”** → a fixed access trace with expected contents after each step, plus the boundary cases: capacity 1, `put` on an existing key, `get` on a missing key, and evicting down to empty.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**A singly-linked list.** It looks fine until you try to unlink a node found through the map, and then the whole O(1) claim collapses into a walk from the head.",
          "**No sentinels.** Every pointer assignment grows a null check, the empty-list and single-node cases get their own branches, and the first `NullPointerException` lands about four minutes later.",
          "**Forgetting to move the node on `get`.** This is the worst failure in the whole problem, because *the code still works*. Nothing throws. Nothing looks wrong. Your LRU is quietly a FIFO, and the only symptom is a hit ratio that is worse than it should be. The prototype has a chip for exactly this — see what you notice.",
          "**`put` on an existing key evicting something.** Overwriting a value must not change the size and must not kill a neighbour. Test it; it is one line and everybody skips it.",
          "**The policy welded into the cache class.** It works, and then *“now make it LFU”* has nowhere to land, and you spend the last fifteen minutes untangling `get()` instead of writing a second policy.",
          "**Scanning for the LFU minimum.** Adding a `count` field and calling `Collections.min` is the single most common way to answer the LFU follow-up wrongly. `minFreq` exists precisely so you never search.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Watch the map and the list disagree",
        body:
          "Start on **🔁 LRU** at **cap 3**. Click **A**, then **B**, then **C** — each is a miss, each is loaded and inserted at the MRU end. Now look at the two panels: the HashMap on the left lists the keys in a fixed, meaningless order, while the list on the right is ordered by recency. That is the point of the whole design. The map cannot answer *“who is oldest?”* and the list cannot answer *“where is B?”*",
      },
      {
        title: "Watch the pointer surgery",
        body:
          "Click **A** again — a hit. It happens in two beats: first the node **lifts out** of the list and the two neighbours' arrows close the gap (`n.prev.next = n.next`, `n.next.prev = n.prev`), then it **drops in at the head**. The `.callline` shows `policy.recordAccess(\"A\")` while it happens. Notice that at no point does anything walk the list — the map handed the node straight over.",
      },
      {
        title: "Force an eviction",
        body:
          "With A, B and C in a cap-3 cache, click **D**. Miss, and the cache is full: the **tail node flashes red and dies** before D is inserted. Watch the order — evict *first*, then insert, so the cache never briefly holds four. Then click **cap 2** and see two nodes evicted immediately, and **cap 4** and see the pressure disappear.",
      },
      {
        title: "Run the trace under LRU",
        body:
          "Hit **↺ Reset** and press **▶ Replay trace**. It replays `A A A B C B D E B A` one step at a time. Watch step 7: **A is evicted** — the key that was used three times at the start, thrown away because it had gone quiet. Note the final numbers: **4 hits, 6 misses, 3 evictions, 40%**.",
      },
      {
        title: "Run the identical trace under LFU",
        body:
          "Hit **↺ Reset**, click **📊 LFU**, and press **▶ Replay trace** again. Same ten clicks. This time the nodes carry a **freq badge** and regroup into frequency buckets with a **minFreq** pointer, and step 7 evicts **C** instead of A. A survives, so step 10 is a **hit** rather than a miss: **5 hits, 5 misses, 2 evictions, 50%**. Also notice which of C and D dies first — both sit at frequency 1, and the tie is broken by recency.",
      },
      {
        title: "Find the bug that works",
        body:
          "Reset, click **⚠️ FIFO bug**, and replay once more. In this mode `recordAccess()` does nothing — the exact line a tired candidate forgets. Nothing throws, nothing looks broken, the animation still runs. The only symptom is the number: **3 hits, 30%**, the worst of the three. This is why *“it works”* is not evidence, and why you print the hit ratio in your `main()`.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `Node` with `key`, `prev`, `next` → `LruPolicy` with the two sentinels wired together in the constructor, then `unlink`, `insertAtHead`, `recordAccess`, `evictCandidate` → the `EvictionPolicy` interface pulled out of it → `Cache` with the map, the capacity, the counters and a `put` that handles the existing-key path separately → `main()` replaying the trace and printing the hit ratio. Then add `LfuPolicy` without touching `Cache`. If you had to change one line inside `Cache`, your interface is in the wrong place.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "CacheDemo.java",
        code: `import java.util.*;

/** WHICH KEY DIES NEXT — the only decision that varies between caches. */
interface EvictionPolicy<K> {
    void recordInsert(K key);    // a brand-new key entered the cache
    void recordAccess(K key);    // an existing key was read or overwritten
    void recordRemove(K key);    // a key left the cache
    K    evictCandidate();       // who dies next; null when empty
    List<K> victimOrder();       // demo only: first element dies first
    String name();
}

/**
 * LRU. A doubly-linked list of keys with the most recently used at the head.
 * The two sentinels are the whole trick: head.next and tail.prev always exist,
 * so unlink() and insertAtHead() contain zero null checks and zero branches.
 */
final class LruPolicy<K> implements EvictionPolicy<K> {
    private static final class Node<K> {
        final K key;
        Node<K> prev, next;
        Node(K key) { this.key = key; }
    }

    private final Map<K, Node<K>> nodes = new HashMap<>();
    private final Node<K> head = new Node<>(null);   // MRU side — sentinel, holds no data
    private final Node<K> tail = new Node<>(null);   // LRU side — sentinel, holds no data

    LruPolicy() { head.next = tail; tail.prev = head; }

    /* ---- the pointer surgery: two assignments out, four assignments in ---- */
    private void unlink(Node<K> n) {
        n.prev.next = n.next;        // 1
        n.next.prev = n.prev;        // 2
        n.prev = null; n.next = null;
    }

    private void insertAtHead(Node<K> n) {
        n.next = head.next;          // 3
        n.prev = head;               // 4
        head.next.prev = n;          // 5  must run BEFORE 6
        head.next = n;               // 6
    }

    @Override public void recordInsert(K key) {
        Node<K> n = new Node<>(key);
        nodes.put(key, n);
        insertAtHead(n);
    }

    /** THE line people forget. Delete it and LRU silently becomes FIFO. */
    @Override public void recordAccess(K key) {
        Node<K> n = nodes.get(key);
        if (n == null) return;
        unlink(n);
        insertAtHead(n);
    }

    @Override public void recordRemove(K key) {
        Node<K> n = nodes.remove(key);
        if (n != null) unlink(n);
    }

    @Override public K evictCandidate() {
        return tail.prev == head ? null : tail.prev.key;   // no scan, no comparison
    }

    @Override public List<K> victimOrder() {
        List<K> out = new ArrayList<>();
        for (Node<K> n = tail.prev; n != head; n = n.prev) out.add(n.key);
        return out;
    }

    @Override public String name() { return "LRU"; }
}

/**
 * LFU. Three pieces and nothing else:
 *   key  -> frequency
 *   freq -> the keys at that frequency, oldest first
 *   minFreq — so finding the victim is a lookup, never a search
 * LinkedHashSet IS a hash map plus a doubly-linked list, so add / remove /
 * first-element are all O(1). Re-adding a key moves it to the end = newest.
 */
final class LfuPolicy<K> implements EvictionPolicy<K> {
    private final Map<K, Integer> freq = new HashMap<>();
    private final Map<Integer, LinkedHashSet<K>> buckets = new HashMap<>();
    private int minFreq = 0;

    @Override public void recordInsert(K key) {
        freq.put(key, 1);
        buckets.computeIfAbsent(1, f -> new LinkedHashSet<>()).add(key);
        minFreq = 1;                       // a fresh key is always the new minimum
    }

    @Override public void recordAccess(K key) {
        Integer f = freq.get(key);
        if (f == null) return;
        LinkedHashSet<K> from = buckets.get(f);
        from.remove(key);
        if (from.isEmpty()) {
            buckets.remove(f);
            if (minFreq == f) minFreq = f + 1;   // the ONLY place minFreq goes up
        }
        freq.put(key, f + 1);
        buckets.computeIfAbsent(f + 1, x -> new LinkedHashSet<>()).add(key);
    }

    @Override public void recordRemove(K key) {
        Integer f = freq.remove(key);
        if (f == null) return;
        LinkedHashSet<K> bucket = buckets.get(f);
        if (bucket == null) return;
        bucket.remove(key);
        if (bucket.isEmpty()) buckets.remove(f);
    }

    /** The tie inside a bucket is broken by recency — LFU has an LRU inside it. */
    @Override public K evictCandidate() {
        LinkedHashSet<K> bucket = buckets.get(minFreq);
        if (bucket == null || bucket.isEmpty()) return null;
        return bucket.iterator().next();
    }

    @Override public List<K> victimOrder() {
        List<Integer> levels = new ArrayList<>(buckets.keySet());
        Collections.sort(levels);
        List<K> out = new ArrayList<>();
        for (int f : levels) out.addAll(buckets.get(f));
        return out;
    }

    @Override public String name() { return "LFU"; }
}

/** FIFO is LRU with recordAccess() emptied out. That is the entire difference. */
final class FifoPolicy<K> implements EvictionPolicy<K> {
    private final Deque<K> queue = new ArrayDeque<>();
    @Override public void recordInsert(K key) { queue.addLast(key); }
    @Override public void recordAccess(K key) { /* nothing — insertion order only */ }
    @Override public void recordRemove(K key) { queue.remove(key); }
    @Override public K evictCandidate()       { return queue.peekFirst(); }
    @Override public List<K> victimOrder()    { return new ArrayList<>(queue); }
    @Override public String name()            { return "FIFO (the bug)"; }
}

/** Owns storage, capacity and counters. Owns NO opinion about who dies. */
final class Cache<K, V> {
    private final int capacity;
    private final Map<K, V> store = new HashMap<>();
    private final EvictionPolicy<K> policy;
    private long hits, misses, evictions;

    Cache(int capacity, EvictionPolicy<K> policy) {
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");
        this.capacity = capacity;
        this.policy = policy;
    }

    /** A READ MUTATES: recordAccess rewrites the list, so get() is guarded too. */
    public synchronized Optional<V> get(K key) {
        V value = store.get(key);
        if (value == null) { misses++; return Optional.empty(); }
        hits++;
        policy.recordAccess(key);
        return Optional.of(value);
    }

    public synchronized void put(K key, V value) {
        if (store.containsKey(key)) {         // PATH 1 — update. Size unchanged, nobody dies.
            store.put(key, value);
            policy.recordAccess(key);
            return;
        }
        if (store.size() >= capacity) {       // PATH 2 — new key: make room FIRST
            K victim = policy.evictCandidate();
            if (victim != null) {
                store.remove(victim);
                policy.recordRemove(victim);
                evictions++;
            }
        }
        store.put(key, value);
        policy.recordInsert(key);
    }

    public synchronized int size()             { return store.size(); }
    public synchronized List<K> victimOrder()  { return policy.victimOrder(); }
    public synchronized String stats() {
        long total = hits + misses;
        double ratio = total == 0 ? 0 : (100.0 * hits) / total;
        return String.format("hits=%d misses=%d evictions=%d hitRatio=%.0f%%", hits, misses, evictions, ratio);
    }
}

public class CacheDemo {
    private static final String[] TRACE = { "A", "A", "A", "B", "C", "B", "D", "E", "B", "A" };

    /** The slow thing the cache exists to avoid. */
    private static String load(String key) { return "value-of-" + key; }

    private static void run(EvictionPolicy<String> policy, int capacity) {
        Cache<String, String> cache = new Cache<>(capacity, policy);
        System.out.println("---- " + policy.name() + " - capacity " + capacity + " ----");
        for (int step = 0; step < TRACE.length; step++) {
            String key = TRACE[step];
            boolean hit = cache.get(key).isPresent();
            String note = "";
            if (!hit) {
                List<String> before = cache.victimOrder();
                String victim = (cache.size() >= capacity && !before.isEmpty()) ? before.get(0) : null;
                cache.put(key, load(key));
                if (victim != null) note = "   evicted " + victim;
            }
            System.out.printf("  %2d  get(%s) %-4s  next-to-die %s%s%n",
                step + 1, key, hit ? "HIT" : "MISS", cache.victimOrder(), note);
        }
        System.out.println("  " + cache.stats());
        System.out.println();
    }

    public static void main(String[] args) {
        run(new LruPolicy<>(), 3);
        run(new LfuPolicy<>(), 3);
        run(new FifoPolicy<>(), 3);   // LRU with recordAccess() removed — watch the hit ratio
    }
}

/* ---- expected output ------------------------------------------------------
---- LRU - capacity 3 ----
   1  get(A) MISS  next-to-die [A]
   2  get(A) HIT   next-to-die [A]
   3  get(A) HIT   next-to-die [A]
   4  get(B) MISS  next-to-die [A, B]
   5  get(C) MISS  next-to-die [A, B, C]
   6  get(B) HIT   next-to-die [A, C, B]
   7  get(D) MISS  next-to-die [C, B, D]   evicted A
   8  get(E) MISS  next-to-die [B, D, E]   evicted C
   9  get(B) HIT   next-to-die [D, E, B]
  10  get(A) MISS  next-to-die [E, B, A]   evicted D
  hits=4 misses=6 evictions=3 hitRatio=40%

---- LFU - capacity 3 ----
   6  get(B) HIT   next-to-die [C, B, A]
   7  get(D) MISS  next-to-die [D, B, A]   evicted C
   8  get(E) MISS  next-to-die [E, B, A]   evicted D
   9  get(B) HIT   next-to-die [E, A, B]
  10  get(A) HIT   next-to-die [E, B, A]
  hits=5 misses=5 evictions=2 hitRatio=50%

---- FIFO (the bug) - capacity 3 ----
  hits=3 misses=7 evictions=4 hitRatio=30%
--------------------------------------------------------------------------- */`,
      },
      {
        label: "Python",
        language: "python",
        filename: "cache_demo.py",
        code: `from __future__ import annotations

from abc import ABC, abstractmethod
from collections import OrderedDict, deque
from threading import RLock
from typing import Generic, Optional, TypeVar

K = TypeVar("K")
V = TypeVar("V")


class EvictionPolicy(ABC, Generic[K]):
    """WHICH KEY DIES NEXT — the only decision that varies between caches."""

    @abstractmethod
    def record_insert(self, key: K) -> None: ...

    @abstractmethod
    def record_access(self, key: K) -> None: ...

    @abstractmethod
    def record_remove(self, key: K) -> None: ...

    @abstractmethod
    def evict_candidate(self) -> Optional[K]: ...

    @abstractmethod
    def victim_order(self) -> list[K]: ...

    @property
    @abstractmethod
    def name(self) -> str: ...


class _Node(Generic[K]):
    __slots__ = ("key", "prev", "next")

    def __init__(self, key: Optional[K]) -> None:
        self.key = key
        self.prev: Optional[_Node[K]] = None
        self.next: Optional[_Node[K]] = None


class LruPolicy(EvictionPolicy[K]):
    """
    A doubly-linked list of keys, most recently used at the head.
    The two sentinels are the whole trick: head.next and tail.prev always
    exist, so unlink and insert_at_head hold zero None checks.
    """

    def __init__(self) -> None:
        self._nodes: dict[K, _Node[K]] = {}
        self._head: _Node[K] = _Node(None)   # MRU side — sentinel
        self._tail: _Node[K] = _Node(None)   # LRU side — sentinel
        self._head.next = self._tail
        self._tail.prev = self._head

    # ---- the pointer surgery: two assignments out, four assignments in ----
    @staticmethod
    def _unlink(n: _Node[K]) -> None:
        n.prev.next = n.next        # 1
        n.next.prev = n.prev        # 2
        n.prev = None
        n.next = None

    def _insert_at_head(self, n: _Node[K]) -> None:
        n.next = self._head.next    # 3
        n.prev = self._head         # 4
        self._head.next.prev = n    # 5  must run BEFORE 6
        self._head.next = n         # 6

    def record_insert(self, key: K) -> None:
        node = _Node(key)
        self._nodes[key] = node
        self._insert_at_head(node)

    def record_access(self, key: K) -> None:
        """THE line people forget. Delete it and LRU silently becomes FIFO."""
        node = self._nodes.get(key)
        if node is None:
            return
        self._unlink(node)
        self._insert_at_head(node)

    def record_remove(self, key: K) -> None:
        node = self._nodes.pop(key, None)
        if node is not None:
            self._unlink(node)

    def evict_candidate(self) -> Optional[K]:
        last = self._tail.prev
        return None if last is self._head else last.key      # no scan, no comparison

    def victim_order(self) -> list[K]:
        out, n = [], self._tail.prev
        while n is not self._head:
            out.append(n.key)
            n = n.prev
        return out

    @property
    def name(self) -> str:
        return "LRU"


class LfuPolicy(EvictionPolicy[K]):
    """
    key -> frequency, frequency -> keys at that frequency (oldest first),
    plus min_freq so finding the victim is a lookup and never a search.
    An OrderedDict used as a set gives O(1) add, remove and first-element.
    """

    def __init__(self) -> None:
        self._freq: dict[K, int] = {}
        self._buckets: dict[int, OrderedDict] = {}
        self._min_freq = 0

    def record_insert(self, key: K) -> None:
        self._freq[key] = 1
        self._buckets.setdefault(1, OrderedDict())[key] = None
        self._min_freq = 1                       # a fresh key is always the new minimum

    def record_access(self, key: K) -> None:
        f = self._freq.get(key)
        if f is None:
            return
        bucket = self._buckets[f]
        bucket.pop(key, None)
        if not bucket:
            del self._buckets[f]
            if self._min_freq == f:
                self._min_freq = f + 1           # the ONLY place min_freq goes up
        self._freq[key] = f + 1
        self._buckets.setdefault(f + 1, OrderedDict())[key] = None

    def record_remove(self, key: K) -> None:
        f = self._freq.pop(key, None)
        if f is None:
            return
        bucket = self._buckets.get(f)
        if bucket is None:
            return
        bucket.pop(key, None)
        if not bucket:
            del self._buckets[f]

    def evict_candidate(self) -> Optional[K]:
        """The tie inside a bucket is broken by recency — LFU has an LRU inside it."""
        bucket = self._buckets.get(self._min_freq)
        if not bucket:
            return None
        return next(iter(bucket))

    def victim_order(self) -> list[K]:
        out: list[K] = []
        for f in sorted(self._buckets):
            out.extend(self._buckets[f].keys())
        return out

    @property
    def name(self) -> str:
        return "LFU"


class FifoPolicy(EvictionPolicy[K]):
    """FIFO is LRU with record_access emptied out. That is the entire difference."""

    def __init__(self) -> None:
        self._queue: deque = deque()

    def record_insert(self, key: K) -> None:
        self._queue.append(key)

    def record_access(self, key: K) -> None:
        pass                                     # nothing — insertion order only

    def record_remove(self, key: K) -> None:
        try:
            self._queue.remove(key)
        except ValueError:
            pass

    def evict_candidate(self) -> Optional[K]:
        return self._queue[0] if self._queue else None

    def victim_order(self) -> list[K]:
        return list(self._queue)

    @property
    def name(self) -> str:
        return "FIFO (the bug)"


class Cache(Generic[K, V]):
    """Owns storage, capacity and counters. Owns NO opinion about who dies."""

    def __init__(self, capacity: int, policy: EvictionPolicy[K]) -> None:
        if capacity <= 0:
            raise ValueError("capacity must be > 0")
        self._capacity = capacity
        self._store: dict[K, V] = {}
        self._policy = policy
        self._lock = RLock()
        self.hits = self.misses = self.evictions = 0

    def get(self, key: K) -> Optional[V]:
        """A READ MUTATES: record_access rewrites the list, so get takes the lock too."""
        with self._lock:
            if key not in self._store:
                self.misses += 1
                return None
            self.hits += 1
            self._policy.record_access(key)
            return self._store[key]

    def put(self, key: K, value: V) -> None:
        with self._lock:
            if key in self._store:               # PATH 1 — update. Size unchanged, nobody dies.
                self._store[key] = value
                self._policy.record_access(key)
                return
            if len(self._store) >= self._capacity:   # PATH 2 — new key: make room FIRST
                victim = self._policy.evict_candidate()
                if victim is not None:
                    del self._store[victim]
                    self._policy.record_remove(victim)
                    self.evictions += 1
            self._store[key] = value
            self._policy.record_insert(key)

    def __len__(self) -> int:
        return len(self._store)

    def victim_order(self) -> list[K]:
        return self._policy.victim_order()

    def stats(self) -> str:
        total = self.hits + self.misses
        ratio = 0 if total == 0 else round(100 * self.hits / total)
        return f"hits={self.hits} misses={self.misses} evictions={self.evictions} hitRatio={ratio}%"


TRACE = ["A", "A", "A", "B", "C", "B", "D", "E", "B", "A"]


def load(key: str) -> str:
    """The slow thing the cache exists to avoid."""
    return "value-of-" + key


def run(policy: EvictionPolicy[str], capacity: int = 3) -> None:
    cache: Cache[str, str] = Cache(capacity, policy)
    print("----", policy.name, "- capacity", capacity, "----")
    for step, key in enumerate(TRACE, start=1):
        hit = cache.get(key) is not None
        note = ""
        if not hit:
            before = cache.victim_order()
            victim = before[0] if (len(cache) >= capacity and before) else None
            cache.put(key, load(key))
            if victim is not None:
                note = "   evicted " + victim
        print(f"  {step:2d}  get({key}) {'HIT' if hit else 'MISS':<4}  next-to-die {cache.victim_order()}{note}")
    print(" ", cache.stats())
    print()


if __name__ == "__main__":
    run(LruPolicy())
    run(LfuPolicy())
    run(FifoPolicy())     # LRU with record_access removed — watch the hit ratio

# ---- expected output -------------------------------------------------------
# ---- LRU - capacity 3 ----
#    7  get(D) MISS  next-to-die ['C', 'B', 'D']   evicted A
#   10  get(A) MISS  next-to-die ['E', 'B', 'A']   evicted D
#   hits=4 misses=6 evictions=3 hitRatio=40%
#
# ---- LFU - capacity 3 ----
#    7  get(D) MISS  next-to-die ['D', 'B', 'A']   evicted C
#   10  get(A) HIT   next-to-die ['E', 'B', 'A']
#   hits=5 misses=5 evictions=2 hitRatio=50%
#
# ---- FIFO (the bug) - capacity 3 ----
#   hits=3 misses=7 evictions=4 hitRatio=30%
# ---------------------------------------------------------------------------`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "cache_demo.cpp",
        code: `#include <algorithm>
#include <deque>
#include <iomanip>
#include <iostream>
#include <list>
#include <map>
#include <memory>
#include <mutex>
#include <optional>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

using Key = std::string;

// WHICH KEY DIES NEXT — the only decision that varies between caches.
class EvictionPolicy {
public:
    virtual ~EvictionPolicy() = default;
    virtual void recordInsert(const Key& key) = 0;
    virtual void recordAccess(const Key& key) = 0;
    virtual void recordRemove(const Key& key) = 0;
    virtual std::optional<Key> evictCandidate() const = 0;
    virtual std::vector<Key> victimOrder() const = 0;   // demo only: first dies first
    virtual std::string name() const = 0;
};

// LRU. A hand-rolled doubly-linked list of keys, MRU at the head.
// The two sentinels are the whole trick: head->next and tail->prev always
// exist, so unlink and insertAtHead contain zero null checks.
class LruPolicy : public EvictionPolicy {
    struct Node {
        Key key;
        Node* prev = nullptr;
        Node* next = nullptr;
        explicit Node(Key k = Key{}) : key(std::move(k)) {}
    };

public:
    LruPolicy() : head_(new Node()), tail_(new Node()) {
        head_->next = tail_;
        tail_->prev = head_;
    }
    ~LruPolicy() override {
        for (Node* n = head_; n != nullptr; ) { Node* nx = n->next; delete n; n = nx; }
    }

    void recordInsert(const Key& key) override {
        Node* n = new Node(key);
        nodes_[key] = n;
        insertAtHead(n);
    }

    // THE line people forget. Delete it and LRU silently becomes FIFO.
    void recordAccess(const Key& key) override {
        auto it = nodes_.find(key);
        if (it == nodes_.end()) return;
        unlink(it->second);
        insertAtHead(it->second);
    }

    void recordRemove(const Key& key) override {
        auto it = nodes_.find(key);
        if (it == nodes_.end()) return;
        unlink(it->second);
        delete it->second;
        nodes_.erase(it);
    }

    std::optional<Key> evictCandidate() const override {
        if (tail_->prev == head_) return std::nullopt;      // no scan, no comparison
        return tail_->prev->key;
    }

    std::vector<Key> victimOrder() const override {
        std::vector<Key> out;
        for (Node* n = tail_->prev; n != head_; n = n->prev) out.push_back(n->key);
        return out;
    }

    std::string name() const override { return "LRU"; }

private:
    // ---- the pointer surgery: two assignments out, four assignments in ----
    static void unlink(Node* n) {
        n->prev->next = n->next;      // 1
        n->next->prev = n->prev;      // 2
        n->prev = nullptr; n->next = nullptr;
    }
    void insertAtHead(Node* n) {
        n->next = head_->next;        // 3
        n->prev = head_;              // 4
        head_->next->prev = n;        // 5  must run BEFORE 6
        head_->next = n;              // 6
    }

    std::unordered_map<Key, Node*> nodes_;
    Node* head_;   // MRU side — sentinel, holds no data
    Node* tail_;   // LRU side — sentinel, holds no data
};

// LFU. key -> frequency, frequency -> keys at that frequency (oldest first),
// plus minFreq so finding the victim is a lookup and never a search.
// std::list is itself a doubly-linked list, and we keep an iterator per key,
// so erase from the middle is O(1).
class LfuPolicy : public EvictionPolicy {
public:
    void recordInsert(const Key& key) override {
        freq_[key] = 1;
        buckets_[1].push_back(key);
        where_[key] = std::prev(buckets_[1].end());
        minFreq_ = 1;                       // a fresh key is always the new minimum
    }

    void recordAccess(const Key& key) override {
        auto it = freq_.find(key);
        if (it == freq_.end()) return;
        int f = it->second;
        buckets_[f].erase(where_[key]);
        if (buckets_[f].empty()) {
            buckets_.erase(f);
            if (minFreq_ == f) minFreq_ = f + 1;   // the ONLY place minFreq goes up
        }
        it->second = f + 1;
        buckets_[f + 1].push_back(key);
        where_[key] = std::prev(buckets_[f + 1].end());
    }

    void recordRemove(const Key& key) override {
        auto it = freq_.find(key);
        if (it == freq_.end()) return;
        int f = it->second;
        buckets_[f].erase(where_[key]);
        if (buckets_[f].empty()) buckets_.erase(f);
        where_.erase(key);
        freq_.erase(it);
    }

    // The tie inside a bucket is broken by recency — LFU has an LRU inside it.
    std::optional<Key> evictCandidate() const override {
        auto it = buckets_.find(minFreq_);
        if (it == buckets_.end() || it->second.empty()) return std::nullopt;
        return it->second.front();
    }

    std::vector<Key> victimOrder() const override {
        std::vector<Key> out;
        for (const auto& [f, keys] : buckets_)          // std::map keeps freq ascending
            out.insert(out.end(), keys.begin(), keys.end());
        return out;
    }

    std::string name() const override { return "LFU"; }

private:
    std::unordered_map<Key, int> freq_;
    std::map<int, std::list<Key>> buckets_;
    std::unordered_map<Key, std::list<Key>::iterator> where_;
    int minFreq_ = 0;
};

// FIFO is LRU with recordAccess emptied out. That is the entire difference.
class FifoPolicy : public EvictionPolicy {
public:
    void recordInsert(const Key& key) override { queue_.push_back(key); }
    void recordAccess(const Key&) override     { /* nothing — insertion order only */ }
    void recordRemove(const Key& key) override {
        queue_.erase(std::remove(queue_.begin(), queue_.end(), key), queue_.end());
    }
    std::optional<Key> evictCandidate() const override {
        if (queue_.empty()) return std::nullopt;
        return queue_.front();
    }
    std::vector<Key> victimOrder() const override { return {queue_.begin(), queue_.end()}; }
    std::string name() const override { return "FIFO (the bug)"; }
private:
    std::deque<Key> queue_;
};

// Owns storage, capacity and counters. Owns NO opinion about who dies.
template <typename V>
class Cache {
public:
    Cache(int capacity, std::unique_ptr<EvictionPolicy> policy)
        : capacity_(capacity), policy_(std::move(policy)) {
        if (capacity <= 0) throw std::invalid_argument("capacity must be > 0");
    }

    // A READ MUTATES: recordAccess rewrites the list, so get takes the lock too.
    std::optional<V> get(const Key& key) {
        std::lock_guard<std::mutex> guard(m_);
        auto it = store_.find(key);
        if (it == store_.end()) { ++misses_; return std::nullopt; }
        ++hits_;
        policy_->recordAccess(key);
        return it->second;
    }

    void put(const Key& key, const V& value) {
        std::lock_guard<std::mutex> guard(m_);
        if (store_.count(key)) {                 // PATH 1 — update. Size unchanged, nobody dies.
            store_[key] = value;
            policy_->recordAccess(key);
            return;
        }
        if (static_cast<int>(store_.size()) >= capacity_) {   // PATH 2 — make room FIRST
            if (auto victim = policy_->evictCandidate()) {
                store_.erase(*victim);
                policy_->recordRemove(*victim);
                ++evictions_;
            }
        }
        store_[key] = value;
        policy_->recordInsert(key);
    }

    int size() const { return static_cast<int>(store_.size()); }
    std::vector<Key> victimOrder() const { return policy_->victimOrder(); }
    std::string name() const { return policy_->name(); }

    std::string stats() const {
        long total = hits_ + misses_;
        long ratio = total == 0 ? 0 : (100 * hits_ + total / 2) / total;
        return "hits=" + std::to_string(hits_) + " misses=" + std::to_string(misses_) +
               " evictions=" + std::to_string(evictions_) + " hitRatio=" + std::to_string(ratio) + "%";
    }

private:
    int capacity_;
    std::unordered_map<Key, V> store_;
    std::unique_ptr<EvictionPolicy> policy_;
    mutable std::mutex m_;
    long hits_ = 0, misses_ = 0, evictions_ = 0;
};

static const std::vector<Key> TRACE = {"A", "A", "A", "B", "C", "B", "D", "E", "B", "A"};

static std::string load(const Key& key) { return "value-of-" + key; }   // the slow thing

static void show(const std::vector<Key>& keys) {
    std::cout << "[";
    for (size_t i = 0; i < keys.size(); ++i) std::cout << (i ? ", " : "") << keys[i];
    std::cout << "]";
}

static void run(std::unique_ptr<EvictionPolicy> policy, int capacity = 3) {
    Cache<std::string> cache(capacity, std::move(policy));
    std::cout << "---- " << cache.name() << " - capacity " << capacity << " ----" << std::endl;
    for (size_t step = 0; step < TRACE.size(); ++step) {
        const Key& key = TRACE[step];
        bool hit = cache.get(key).has_value();
        std::optional<Key> victim;
        if (!hit) {
            auto before = cache.victimOrder();
            if (cache.size() >= capacity && !before.empty()) victim = before.front();
            cache.put(key, load(key));
        }
        std::cout << "  " << std::setw(2) << (step + 1) << "  get(" << key << ") "
                  << (hit ? "HIT " : "MISS") << "  next-to-die ";
        show(cache.victimOrder());
        if (victim) std::cout << "   evicted " << *victim;
        std::cout << std::endl;
    }
    std::cout << "  " << cache.stats() << std::endl << std::endl;
}

int main() {
    run(std::make_unique<LruPolicy>());
    run(std::make_unique<LfuPolicy>());
    run(std::make_unique<FifoPolicy>());   // LRU with recordAccess removed
}

/* ---- expected output ------------------------------------------------------
---- LRU - capacity 3 ----
   7  get(D) MISS  next-to-die [C, B, D]   evicted A
  10  get(A) MISS  next-to-die [E, B, A]   evicted D
  hits=4 misses=6 evictions=3 hitRatio=40%

---- LFU - capacity 3 ----
   7  get(D) MISS  next-to-die [D, B, A]   evicted C
  10  get(A) HIT   next-to-die [E, B, A]
  hits=5 misses=5 evictions=2 hitRatio=50%

---- FIFO (the bug) - capacity 3 ----
  hits=3 misses=7 evictions=4 hitRatio=30%
--------------------------------------------------------------------------- */`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "cacheDemo.ts",
        code: `// WHICH KEY DIES NEXT — the only decision that varies between caches.
interface EvictionPolicy<K> {
  recordInsert(key: K): void;   // a brand-new key entered the cache
  recordAccess(key: K): void;   // an existing key was read or overwritten
  recordRemove(key: K): void;   // a key left the cache
  evictCandidate(): K | undefined;
  victimOrder(): K[];           // demo only: first element dies first
  readonly name: string;
}

interface ListNode<K> {
  key: K | null;                // null on the two sentinels
  prev: ListNode<K> | null;
  next: ListNode<K> | null;
}

/**
 * LRU. A doubly-linked list of keys with the most recently used at the head.
 * The two sentinels are the whole trick: head.next and tail.prev always exist,
 * so unlink() and insertAtHead() contain zero null checks and zero branches.
 */
class LruPolicy<K> implements EvictionPolicy<K> {
  readonly name = "LRU";

  private readonly nodes = new Map<K, ListNode<K>>();
  private readonly head: ListNode<K> = { key: null, prev: null, next: null }; // MRU side
  private readonly tail: ListNode<K> = { key: null, prev: null, next: null }; // LRU side

  constructor() {
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // ---- the pointer surgery: two assignments out, four assignments in ----
  private unlink(n: ListNode<K>): void {
    n.prev!.next = n.next;        // 1
    n.next!.prev = n.prev;        // 2
    n.prev = null;
    n.next = null;
  }

  private insertAtHead(n: ListNode<K>): void {
    n.next = this.head.next;      // 3
    n.prev = this.head;           // 4
    this.head.next!.prev = n;     // 5  must run BEFORE 6
    this.head.next = n;           // 6
  }

  recordInsert(key: K): void {
    const n: ListNode<K> = { key, prev: null, next: null };
    this.nodes.set(key, n);
    this.insertAtHead(n);
  }

  /** THE line people forget. Delete it and LRU silently becomes FIFO. */
  recordAccess(key: K): void {
    const n = this.nodes.get(key);
    if (!n) return;
    this.unlink(n);
    this.insertAtHead(n);
  }

  recordRemove(key: K): void {
    const n = this.nodes.get(key);
    if (!n) return;
    this.unlink(n);
    this.nodes.delete(key);
  }

  evictCandidate(): K | undefined {
    const last = this.tail.prev!;
    return last === this.head ? undefined : (last.key as K);   // no scan, no comparison
  }

  victimOrder(): K[] {
    const out: K[] = [];
    for (let n = this.tail.prev!; n !== this.head; n = n.prev!) out.push(n.key as K);
    return out;
  }
}

/**
 * LFU. key -> frequency, frequency -> keys at that frequency (oldest first),
 * plus minFreq so finding the victim is a lookup and never a search.
 * A JS Set preserves insertion order, and delete + re-add moves a key to the
 * end, which is exactly the recency ordering the tie-break needs.
 */
class LfuPolicy<K> implements EvictionPolicy<K> {
  readonly name = "LFU";

  private readonly freq = new Map<K, number>();
  private readonly buckets = new Map<number, Set<K>>();
  private minFreq = 0;

  recordInsert(key: K): void {
    this.freq.set(key, 1);
    this.bucket(1).add(key);
    this.minFreq = 1;                    // a fresh key is always the new minimum
  }

  recordAccess(key: K): void {
    const f = this.freq.get(key);
    if (f === undefined) return;
    const from = this.buckets.get(f)!;
    from.delete(key);
    if (from.size === 0) {
      this.buckets.delete(f);
      if (this.minFreq === f) this.minFreq = f + 1;   // the ONLY place minFreq goes up
    }
    this.freq.set(key, f + 1);
    this.bucket(f + 1).add(key);
  }

  recordRemove(key: K): void {
    const f = this.freq.get(key);
    if (f === undefined) return;
    this.freq.delete(key);
    const bucket = this.buckets.get(f);
    if (!bucket) return;
    bucket.delete(key);
    if (bucket.size === 0) this.buckets.delete(f);
  }

  /** The tie inside a bucket is broken by recency — LFU has an LRU inside it. */
  evictCandidate(): K | undefined {
    const bucket = this.buckets.get(this.minFreq);
    if (!bucket || bucket.size === 0) return undefined;
    return bucket.values().next().value as K;
  }

  victimOrder(): K[] {
    const levels = [...this.buckets.keys()].sort((a, b) => a - b);
    const out: K[] = [];
    for (const f of levels) out.push(...this.buckets.get(f)!);
    return out;
  }

  private bucket(f: number): Set<K> {
    let b = this.buckets.get(f);
    if (!b) { b = new Set<K>(); this.buckets.set(f, b); }
    return b;
  }
}

/** FIFO is LRU with recordAccess() emptied out. That is the entire difference. */
class FifoPolicy<K> implements EvictionPolicy<K> {
  readonly name = "FIFO (the bug)";
  private queue: K[] = [];

  recordInsert(key: K): void { this.queue.push(key); }
  recordAccess(_key: K): void { /* nothing — insertion order only */ }
  recordRemove(key: K): void { this.queue = this.queue.filter((k) => k !== key); }
  evictCandidate(): K | undefined { return this.queue[0]; }
  victimOrder(): K[] { return [...this.queue]; }
}

/** Owns storage, capacity and counters. Owns NO opinion about who dies. */
class Cache<K, V> {
  private readonly store = new Map<K, V>();
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  constructor(private readonly capacity: number, private readonly policy: EvictionPolicy<K>) {
    if (capacity <= 0) throw new Error("capacity must be > 0");
  }

  /** A READ MUTATES: recordAccess rewrites the list. Single-threaded here, but note it. */
  get(key: K): V | undefined {
    if (!this.store.has(key)) { this.misses++; return undefined; }
    this.hits++;
    this.policy.recordAccess(key);
    return this.store.get(key);
  }

  put(key: K, value: V): void {
    if (this.store.has(key)) {              // PATH 1 — update. Size unchanged, nobody dies.
      this.store.set(key, value);
      this.policy.recordAccess(key);
      return;
    }
    if (this.store.size >= this.capacity) { // PATH 2 — new key: make room FIRST
      const victim = this.policy.evictCandidate();
      if (victim !== undefined) {
        this.store.delete(victim);
        this.policy.recordRemove(victim);
        this.evictions++;
      }
    }
    this.store.set(key, value);
    this.policy.recordInsert(key);
  }

  get size(): number { return this.store.size; }
  get policyName(): string { return this.policy.name; }
  victimOrder(): K[] { return this.policy.victimOrder(); }

  stats(): string {
    const total = this.hits + this.misses;
    const ratio = total === 0 ? 0 : Math.round((100 * this.hits) / total);
    return "hits=" + this.hits + " misses=" + this.misses +
           " evictions=" + this.evictions + " hitRatio=" + ratio + "%";
  }
}

const TRACE = ["A", "A", "A", "B", "C", "B", "D", "E", "B", "A"];

/** The slow thing the cache exists to avoid. */
function load(key: string): string { return "value-of-" + key; }

function run(policy: EvictionPolicy<string>, capacity = 3): void {
  const cache = new Cache<string, string>(capacity, policy);
  console.log("---- " + cache.policyName + " - capacity " + capacity + " ----");
  TRACE.forEach((key, i) => {
    const hit = cache.get(key) !== undefined;
    let note = "";
    if (!hit) {
      const before = cache.victimOrder();
      const victim = cache.size >= capacity && before.length > 0 ? before[0] : undefined;
      cache.put(key, load(key));
      if (victim !== undefined) note = "   evicted " + victim;
    }
    const step = String(i + 1).padStart(2, " ");
    console.log("  " + step + "  get(" + key + ") " + (hit ? "HIT " : "MISS") +
                "  next-to-die [" + cache.victimOrder().join(", ") + "]" + note);
  });
  console.log("  " + cache.stats());
  console.log("");
}

run(new LruPolicy<string>());
run(new LfuPolicy<string>());
run(new FifoPolicy<string>());   // LRU with recordAccess() removed

/* ---- expected output ------------------------------------------------------
---- LRU - capacity 3 ----
   7  get(D) MISS  next-to-die [C, B, D]   evicted A
  10  get(A) MISS  next-to-die [E, B, A]   evicted D
  hits=4 misses=6 evictions=3 hitRatio=40%

---- LFU - capacity 3 ----
   7  get(D) MISS  next-to-die [D, B, A]   evicted C
  10  get(A) HIT   next-to-die [E, B, A]
  hits=5 misses=5 evictions=2 hitRatio=50%

---- FIFO (the bug) - capacity 3 ----
  hits=3 misses=7 evictions=4 hitRatio=30%
--------------------------------------------------------------------------- */`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Strip the caching away and there are two reusable ideas here. The first: **when one structure cannot answer both of your questions, keep two and make them point at each other.** The second: **when a rule is likely to change, give the rule its own type** — because the caller then never has to know which rule is in force.",
      },
      {
        type: "ul",
        items: [
          "**Any LRU-ish eviction** — connection pools that close the idlest connection, session stores, image and tile caches, browser back/forward stacks.",
          "**Ordered maps in general** — a hash map plus a linked list is exactly what `LinkedHashMap` and Python's `dict` are, and now you know why insertion order is free in one and not the other.",
          "**Task schedulers** — the *“which task runs next”* decision is the same seam as *“which key dies next”*, and it belongs behind an interface for exactly the same reason. See [[strategy]].",
          "**Rate limiters and quota buckets** — a counter per key with a way to find the extreme value quickly; the `minFreq` trick generalises to *“maintain the answer instead of searching for it”*.",
          "**Undo stacks and MRU file lists** — the same list, the same move-to-front, the same tail-drop when the list gets too long.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The 20-second version to say out loud",
        text: "*“A map gives me O(1) lookup but no order; a doubly-linked list gives me O(1) reordering but no lookup. I keep both — the map's values are the list's nodes — so `get` is a lookup plus six pointer assignments and eviction is `tail.prev`. Sentinels remove the null checks. The eviction rule lives behind an interface, so LFU is a new class rather than a rewrite.”*",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**At high concurrency.** One lock around a structure that every read mutates is a hard serialisation point. The escapes are striping (approximate eviction, real parallelism) or moving the reordering off the read path entirely, which is what Caffeine's buffered replay does.",
          "**When entries have wildly different sizes.** Counting entries stops meaning anything; you need a weigher and a byte budget, and then eviction is *“drop until under the limit”* rather than *“drop one”*.",
          "**When the workload scans.** One pass over a large table walks LRU's entire contents out of the cache and leaves nothing useful behind. This is precisely what LFU and TinyLFU exist to resist.",
          "**When the cache is distributed.** A per-node LRU means N independent caches, N hit ratios, and N copies of the hot keys. Routing keys to owners fixes the duplication and introduces invalidation, which is a harder problem than eviction ever was.",
          "**When staleness matters more than memory.** Then you want *expiry*, not eviction, and the two mechanisms are independent — an entry can be evicted while fresh and go stale while resident.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**The map finds it, the list orders it, the interface decides who dies.** Those three clauses are the whole design, in that order — and the third one is what turns a correct LeetCode answer into a machine-coding answer.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "A hash map plus a doubly-linked list gives genuinely O(1) get, put and evict, with no scan anywhere in the design.",
        "Sentinel head and tail nodes delete every null check from the pointer code, which removes the most common source of a crash in this round.",
        "Putting eviction behind an interface makes LRU, LFU, FIFO and Random four small classes that share one unchanged Cache.",
        "LFU's minFreq integer turns finding the least-used key from an O(n) search into a single lookup, and it can only ever move up by one.",
        "Hit, miss and eviction counters cost four lines and are the only objective evidence that the cache is earning the memory it occupies.",
      ],
      cons: [
        "The policy seam costs one extra hash lookup and one extra node object per entry compared with the welded version where the map's value is the node.",
        "Every operation mutates shared state, so one lock is the honest answer and a read-write lock buys nothing — throughput is capped until you stripe.",
        "LRU is destroyed by a single scan of a large dataset, which sweeps every useful entry out of the cache in one pass.",
        "Pure LFU never forgets, so a key that was hot once during a batch job outlives keys that are genuinely hot today unless you add aging or a window.",
        "Capacity counted in entries says nothing about memory, so a cache of 1000 entries can be four megabytes or four gigabytes without any code changing.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "LinkedHashMap — Java API documentation",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedHashMap.html",
        kind: "docs",
        note: "The six-line LRU: access-order mode plus removeEldestEntry. Read it so you can name the shortcut and then explain why you are not using it.",
      },
      {
        label: "An O(1) algorithm for implementing the LFU cache eviction scheme",
        href: "https://arxiv.org/abs/2110.11602",
        kind: "paper",
        note: "Shah, Mitra and Matani. Eight pages, and it is exactly the frequency-bucket construction with minFreq that the lesson builds.",
      },
      {
        label: "TinyLFU: A Highly Efficient Cache Admission Policy",
        href: "https://arxiv.org/abs/1512.00727",
        kind: "paper",
        note: "The answer to LFU's never-forgetting problem: a windowed frequency sketch used as an admission filter. This is what modern caches actually ship.",
      },
      {
        label: "Caffeine — Efficiency",
        href: "https://github.com/ben-manes/caffeine/wiki/Efficiency",
        kind: "docs",
        note: "Hit-ratio graphs for LRU, LFU and W-TinyLFU on real traces. The clearest evidence anywhere that policy choice is a measurable thing, not a taste.",
      },
      {
        label: "Redis — key eviction policies",
        href: "https://redis.io/docs/latest/develop/reference/eviction/",
        kind: "docs",
        note: "How a production system does it: approximated LRU by sampling rather than an exact list, plus LFU with a logarithmic counter and a decay period.",
      },
      {
        label: "2-choices eviction — Dan Luu",
        href: "https://danluu.com/2choices-eviction/",
        kind: "article",
        note: "A short piece on how sampling two random entries and evicting the older one gets you most of LRU's quality with none of its bookkeeping.",
      },
      {
        label: "Java Concurrency in Practice — Goetz et al.",
        kind: "book",
        note: "Chapter 5 covers exactly the trap in this lesson: a method that looks like a read but mutates shared state, and why a read-write lock does not save you.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "lru-lfu-cache-q1",
        question: "Why is a HashMap on its own not enough to build an LRU cache?",
        options: [
          { id: "a", label: "A map has no order, so finding the least-recently-used entry means scanning every entry — O(n) — which breaks the one hard requirement of the problem." },
          { id: "b", label: "A map cannot store objects as values, only primitives." },
          { id: "c", label: "A map has no size limit, so it can never be bounded." },
          { id: "d", label: "Hash collisions make map lookups O(n) in practice." },
        ],
        correctOptionId: "a",
        explanation:
          "Lookup is exactly what a map is good at; ordering is exactly what it does not have. (d) is the tempting wrong answer — collisions are a real thing, but they are not why the map alone fails here, and they do not change the fact that the map cannot answer “who is oldest?” at any cost.",
      },
      {
        id: "lru-lfu-cache-q2",
        question: "Why must the linked list be doubly linked rather than singly linked?",
        options: [
          { id: "a", label: "To unlink a node you found through the map you must update its predecessor's next pointer, and with only next pointers the only way to find the predecessor is to walk from the head — O(n)." },
          { id: "b", label: "Because a singly-linked list cannot hold more than one type of value." },
          { id: "c", label: "Because you need to iterate the cache in both directions when printing it." },
          { id: "d", label: "It does not matter; a singly-linked list works just as well if you keep a tail pointer." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is tempting because a tail pointer does fix O(1) append and O(1) access to the last element. It does not fix the actual problem: unlinking a node from the middle, which is what every cache hit does. The prev pointer replaces the entire walk with one field read.",
      },
      {
        id: "lru-lfu-cache-q3",
        question: "What do the sentinel HEAD and TAIL nodes actually buy you?",
        options: [
          { id: "a", label: "Every node in the list is guaranteed to have a non-null prev and next, so unlink and insertAtHead need no null checks and no special cases for the empty or single-node list." },
          { id: "b", label: "They store the most and least recently used values so lookups are faster." },
          { id: "c", label: "They make the list circular, which is required for O(1) eviction." },
          { id: "d", label: "They reduce memory usage by letting nodes share their pointers." },
        ],
        correctOptionId: "a",
        explanation:
          "Two objects that hold no data, in exchange for deleting an entire category of branch. Without them, every one of the six pointer assignments needs an “is this the first or the only node?” guard, and the empty-list case is where the round's NullPointerException usually comes from.",
      },
      {
        id: "lru-lfu-cache-q4",
        question: "A candidate implements the list correctly but forgets to move the node on a cache hit. What happens?",
        options: [
          { id: "a", label: "Nothing visibly breaks — the cache silently becomes a FIFO, and the only symptom is a hit ratio lower than it should be." },
          { id: "b", label: "The list corrupts into a cycle and the next traversal never terminates." },
          { id: "c", label: "get() starts returning stale values for keys that were recently updated." },
          { id: "d", label: "The cache grows past its capacity because nothing is ever evicted." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the most dangerous bug in the problem precisely because it produces working code. Ordering is now insertion order, which is FIFO. Nothing throws, every test that only checks “is the value there?” passes, and the only evidence is a number — which is a strong argument for printing the hit ratio in your demo.",
      },
      {
        id: "lru-lfu-cache-q5",
        question: "What must `put(key, value)` do when the key is already present?",
        options: [
          { id: "a", label: "Overwrite the value, record it as an access, and change nothing else — the size does not change and nothing is evicted." },
          { id: "b", label: "Evict the least-recently-used entry first, then insert the new value." },
          { id: "c", label: "Remove the old entry and reinsert it, incrementing the eviction counter." },
          { id: "d", label: "Reject the write, since a cache entry is immutable once created." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is exactly what a candidate writes when put() is a single unconditional path, and it silently destroys a live entry on every overwrite. The existing-key case and the new-key case are two different flows, and separating them is one if-statement.",
      },
      {
        id: "lru-lfu-cache-q6",
        question: "In an O(1) LFU cache, how do you find the least-frequently-used key without scanning?",
        options: [
          { id: "a", label: "Keep a minFreq integer and a map from frequency to a recency-ordered list of the keys at that frequency; the victim is the oldest entry in bucket minFreq." },
          { id: "b", label: "Keep the keys in a sorted array by count and binary-search for the smallest." },
          { id: "c", label: "Store the counts in a min-heap and pop the root when you need a victim." },
          { id: "d", label: "Scan the frequency map — it is fine, because the cache is small by definition." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) is the tempting answer because a min-heap really is the textbook “find the minimum” structure — but updating a key's priority in a heap is O(log n), and this problem asks for O(1). The bucket construction works because a frequency only ever increases by exactly one, so minFreq only ever moves up by one.",
      },
      {
        id: "lru-lfu-cache-q7",
        question: "The interviewer asks you to make the cache thread-safe. Why does a ReadWriteLock not help the way people expect?",
        options: [
          { id: "a", label: "Because get() mutates — it reorders the linked list — so every operation needs the write lock anyway, and you get the complexity with none of the concurrency." },
          { id: "b", label: "Because a ReadWriteLock cannot be used with a HashMap." },
          { id: "c", label: "Because reads are rarer than writes in a cache." },
          { id: "d", label: "Because read locks are slower than a plain synchronized block." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the sentence that reads as senior: “a read in this design is a write.” One lock is the correct 60-minute answer. If they push on throughput, the real answers are striping the key space or moving the reordering off the read path entirely, which is what Caffeine does with buffered replay.",
      },
      {
        id: "lru-lfu-cache-q8",
        question: "You have a working LRU cache and the interviewer says “now make it LFU”. What determines whether that is a five-minute answer or a rewrite?",
        options: [
          { id: "a", label: "Whether the eviction decision lives behind an interface that Cache calls, or is written inline inside get() and put()." },
          { id: "b", label: "Whether you used generics for the key and value types." },
          { id: "c", label: "Whether your linked list is doubly rather than singly linked." },
          { id: "d", label: "Whether the cache is thread-safe, since LFU needs finer-grained locking." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) is tempting because the doubly-linked list is genuinely load-bearing — but it is load-bearing for correctness and complexity, not for extensibility. The seam is what makes LFU a new class instead of surgery on the hot path, and this follow-up is asked so consistently that building the interface up front is close to free.",
      },
    ],
  },
};
