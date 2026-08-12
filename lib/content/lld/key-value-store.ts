import type { RoadmapLesson } from "@/lib/content/types";

export const keyValueStore: RoadmapLesson = {
  title: "In-memory key-value store",
  oneLiner:
    "The sibling cache problem asks *what to throw away when you run out of room*. This one asks something stranger: **when does a key stop being real?** A key with a TTL has an expiry **instant** — and nothing runs when that instant arrives. The key is still in the map, still counted, still holding memory. It only *becomes* gone when somebody looks. Everything hard here follows from that one sentence.",
  difficulty: "intermediate",
  estimatedTime: "30 min",
  prototypePath: "/prototypes/lld/key-value-store.html",
  content: {
    prototypeCaption:
      "A live store with a **virtual clock** you control. Press **➕ SET** a few times to add keys with TTLs, then **⏩ +2s** — rows go grey and struck-through but stay in the table, and the **size()** stat *still counts them*, because nothing ran at the moment they expired. Click a struck-through row to **GET** it: it returns **(nil)** and only *then* vanishes — that is lazy expiry, done by hand, one key at a time. Press **😴 Cold key** to create a key nobody will ever read and watch the **leaked** counter climb, then **🧹 Sweep** to see the sampling loop draw 20 keys, delete the expired ones, and decide on screen whether to go round again. **🔒 SET no-TTL** makes an existing key's expiry vanish, and **📉 Fill memory** kills a key for *space* while everything else here dies of *time*.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design an in-memory key-value store. It should support TTL.”* Two sentences, and the second one is the whole interview. Without it you are writing a wrapper around a hash map and you will be finished in nine minutes.",
      },
      {
        type: "p",
        text: "With it, you are writing a miniature Redis. Somebody hands you a key, a value, and a number of seconds, and from that moment the store owes them a promise: *after those seconds, this key is gone.* The interesting question is what “gone” means when there is no thread standing over the key with a stopwatch.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 336" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The whole store in one picture. On the left three client calls, get, set with a TTL, and expire, point into a KeyValueStore box. Inside it is a single map from String key to an Entry holding a value and an absolute expiresAt instant; four rows are shown and one of them is greyed out and struck through because its expiry has already passed. A sweeper thread called ActiveExpirer sits to the right and samples keys from the map. A Clock interface feeds the store the current time. A memory bar runs along the bottom with a maxMemory limit marked on it.">
  <defs>
    <marker id="kv-f1-call" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="kv-f1-side" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <text x="14" y="34" font-size="10" fill="#fb863a">Client</text>
  <rect x="14" y="44" width="118" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="26" y="62" font-size="9.5" fill="#e8e4dc">get("session:1")</text>
  <rect x="14" y="88" width="118" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="26" y="106" font-size="9.5" fill="#e8e4dc">set(k, v, ttl=5s)</text>
  <rect x="14" y="132" width="118" height="28" rx="5" fill="#14161a" stroke="#2d333d"/><text x="26" y="150" font-size="9.5" fill="#e8e4dc">expire(k, 30s)</text>
  <text x="14" y="186" font-size="9" fill="#6b7280">the API surface</text>
  <text x="14" y="200" font-size="9" fill="#6b7280">IS the design</text>

  <line x1="134" y1="58" x2="186" y2="88" stroke="#fb863a" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#kv-f1-call)"/>
  <line x1="134" y1="102" x2="186" y2="102" stroke="#fb863a" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#kv-f1-call)"/>
  <line x1="134" y1="146" x2="186" y2="116" stroke="#fb863a" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#kv-f1-call)"/>

  <rect x="192" y="24" width="326" height="240" rx="10" fill="none" stroke="#fb863a" stroke-width="1.3"/>
  <text x="204" y="44" font-size="11.5" fill="#fb863a">KeyValueStore</text>
  <text x="204" y="60" font-size="9" fill="#6b7280">one ReadWriteLock (or N shard locks)</text>

  <rect x="204" y="70" width="302" height="182" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="216" y="88" font-size="9.5" fill="#9099a8">Map&lt;String, Entry&gt;</text>
  <line x1="216" y1="96" x2="494" y2="96" stroke="#2d333d"/>

  <rect x="216" y="106" width="278" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <text x="226" y="122" font-size="9" fill="#e8e4dc">"session:1"  →  Entry("abc", expiresAt=5000)</text>

  <rect x="216" y="136" width="278" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <text x="226" y="152" font-size="9" fill="#e8e4dc">"cart:42"    →  Entry("[…]", expiresAt=8000)</text>

  <rect x="216" y="166" width="278" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <text x="226" y="182" font-size="9" fill="#e8e4dc">"user:7"     →  Entry("nina", expiresAt=∞)</text>

  <rect x="216" y="196" width="278" height="24" rx="4" fill="#0c0d10" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="226" y="212" font-size="9" fill="#6b7280" text-decoration="line-through">"report:19"  →  Entry("…", expiresAt=3000)</text>
  <text x="226" y="238" font-size="9" fill="#f06868">expired at t=3000 · still here · size() still says 4</text>

  <text x="556" y="44" font-size="10" fill="#fb863a">Entry «value object»</text>
  <text x="556" y="60" font-size="9" fill="#9099a8">value + expiresAt</text>
  <text x="556" y="74" font-size="9" fill="#9099a8">an INSTANT, not a</text>
  <text x="556" y="88" font-size="9" fill="#9099a8">countdown</text>
  <line x1="552" y1="56" x2="500" y2="118" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#kv-f1-call)"/>

  <rect x="556" y="106" width="152" height="58" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="568" y="126" font-size="10.5" fill="#5e9ff6">ActiveExpirer</text>
  <text x="568" y="142" font-size="9" fill="#9099a8">samples 20 keys,</text>
  <text x="568" y="156" font-size="9" fill="#9099a8">repeats if &gt; 25% dead</text>
  <line x1="552" y1="134" x2="512" y2="182" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#kv-f1-side)"/>

  <rect x="556" y="180" width="152" height="52" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="568" y="200" font-size="10.5" fill="#e8e4dc">Clock  «interface»</text>
  <text x="568" y="218" font-size="9" fill="#9099a8">nowMillis()  · injected</text>
  <line x1="552" y1="206" x2="512" y2="214" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#kv-f1-side)"/>

  <text x="192" y="288" font-size="9.5" fill="#9099a8">memory used</text>
  <rect x="192" y="296" width="326" height="16" rx="4" fill="#14161a" stroke="#2d333d"/>
  <rect x="194" y="298" width="222" height="12" rx="3" fill="rgba(251,134,58,0.35)"/>
  <line x1="470" y1="292" x2="470" y2="316" stroke="#f06868" stroke-width="1.4"/>
  <text x="480" y="308" font-size="9" fill="#f06868">maxMemory</text>
  <text x="192" y="330" font-size="9" fill="#6b7280">past this line a key dies for SPACE, not for time — a different mechanism entirely</text>
</svg>`,
        caption:
          "Look at the fourth row. It is **grey, struck through, and still there** — its expiry passed at t=3000 and nothing happened. That row is the lesson.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "An **Entry** holds a value and an **absolute** `expiresAt` instant. A `get` reads the map, compares `expiresAt` to *now*, and if the instant has passed it deletes the key and reports a miss — that is **lazy expiry**. A background **sweeper** samples random keys with TTLs and deletes the dead ones, because a key nobody ever reads again would otherwise sit in memory forever.",
      },
      {
        type: "p",
        text: "That is roughly 200 lines of code and it is genuinely all of it. What separates a good round from a mediocre one is whether you *notice* the strange middle state — a key that is logically gone but physically present — and whether you can say out loud why every real cache server lives with it.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Is a TTL an instant or a countdown?** Storing `expiresAt = now + ttl` once is right. Storing `secondsLeft` and decrementing it means something has to do the decrementing, for every key, forever.",
          "**Do you know that expiry is not an event?** Nothing fires when a key expires. If you describe a `Timer` per key, or a callback, the round is effectively over — a million keys would mean a million timers.",
          "**Do you have both strategies?** Lazy expiry alone leaks any key nobody reads again. A full O(n) sweep alone stalls the server. The answer is lazy plus **sampled** active expiry, and being able to describe the sampling loop is a standout moment.",
          "**Is the API honest?** `ttl(key)` must distinguish three states — remaining time, *exists but never expires*, and *no such key*. A method that returns `-1` for two different situations is a bad API, and interviewers notice.",
          "**Does it run, and is the clock injectable?** `get(key)` reading a `Clock` interface means your TTL tests are three lines and instant. `System.currentTimeMillis()` sprinkled through the code means every test needs a `Thread.sleep`.",
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
          "**Single process, or a cluster?** — say single process, and offer the distributed version as a follow-up. In-process means one lock is a real answer; across machines it is not an answer at all.",
          "**Are values just strings?** — assume strings, and say you would make `Entry.value` a sealed type if they wanted lists, sets and hashes. It does not change the design, which is worth saying because they are checking whether you think it does.",
          "**Is there a memory limit?** — yes, and this is the question that gets you the eviction conversation for free. Ask it early.",
          "**Does it need to survive a restart?** — usually no, but ask. If yes you get an append-only log and a snapshot, which is a whole extra section you can control the size of.",
          "**How precise must expiry be?** — this is the *good* question. *“Is it acceptable that a key which expired 200ms ago is still using memory, as long as nobody can read it?”* If they say yes — and they will — you have just been handed permission to build the lazy plus sampled design.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 260" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An in-scope and out-of-scope board. In scope: get, set, delete and exists; TTL with set-with-ttl, expire and ttl; lazy expiry on read; a sampled background sweeper; a memory bound with an eviction policy; and thread safety with a read-write lock. Out of scope: clustering and replication, the wire protocol, pub-sub, data types beyond strings, full transactions, and durability beyond a sketch.">
  <text x="20" y="24" font-size="10.5" fill="#5cc66f">✓ IN SCOPE — say these in the first two minutes</text>
  <rect x="20" y="34" width="316" height="212" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="58" font-size="10" fill="#e8e4dc">get · set · delete · exists · size</text>
  <text x="38" y="82" font-size="10" fill="#e8e4dc">setWithTtl · expire · ttl · persist</text>
  <text x="38" y="106" font-size="10" fill="#fb863a">lazy expiry on every read</text>
  <text x="38" y="130" font-size="10" fill="#fb863a">sampled background sweeper</text>
  <text x="38" y="154" font-size="10" fill="#e8e4dc">memory bound + eviction policy</text>
  <text x="38" y="178" font-size="10" fill="#e8e4dc">thread safety (ReadWriteLock)</text>
  <text x="38" y="202" font-size="10" fill="#e8e4dc">injected Clock, so TTL is testable</text>
  <text x="38" y="230" font-size="9" fill="#6b7280">the two orange lines are what the problem is for</text>

  <text x="364" y="24" font-size="10.5" fill="#f06868">✗ OUT OF SCOPE — name them, do not build them</text>
  <rect x="364" y="34" width="316" height="212" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="382" y="58" font-size="10" fill="#9099a8">clustering · replication · failover</text>
  <text x="382" y="82" font-size="10" fill="#9099a8">the wire protocol / network layer</text>
  <text x="382" y="106" font-size="10" fill="#9099a8">pub-sub and keyspace notifications</text>
  <text x="382" y="130" font-size="10" fill="#9099a8">lists, sets, hashes, sorted sets</text>
  <text x="382" y="154" font-size="10" fill="#9099a8">real transactions with rollback</text>
  <text x="382" y="178" font-size="10" fill="#9099a8">durability beyond a two-minute sketch</text>
  <text x="382" y="202" font-size="10" fill="#9099a8">auth, ACLs, metrics endpoints</text>
  <text x="382" y="230" font-size="9" fill="#6b7280">each one is a follow-up you can pull in if time allows</text>
</svg>`,
        caption:
          "Reading the right-hand column out loud takes twenty seconds and buys you the whole hour. **Naming what you are not building is how you protect the time to build what you are.**",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Do not let TTL become an afterthought",
        text: "Candidates build `get`, `set` and `delete` in eight minutes, feel good, and then bolt TTL on at minute forty with a `Timer`. Build the `Entry` with `expiresAt` in it *from the first line*. TTL is not a feature of this problem — it **is** the problem, and every design decision that follows is downstream of how you represent it.",
      },

      // ---------- entry ----------
      { type: "h", text: "Step 2 · A TTL is an instant, not a countdown" },
      {
        type: "p",
        text: "The user says *“expire this in 5 seconds.”* You store `expiresAt = clock.nowMillis() + 5000` — one addition, once, at write time. From then on the question *“is this key alive?”* is a single comparison: `now < expiresAt`. No arithmetic runs in between. No thread wakes up. The key does not know how long it has left and does not need to.",
      },
      {
        type: "p",
        text: "The alternative — a `secondsLeft` field, or a `Timer`/`ScheduledFuture` per key — feels more direct and is the single most common way to lose this round.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 262" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two versions of the Entry class side by side. The good version holds a value and an absolute expiresAt millisecond instant, is immutable, costs eight bytes and needs nothing running. The bad version holds a value and a secondsLeft countdown plus a scheduled timer per key, which means one million keys becomes one million timers, plus a thread that must tick every key every second, and cancelled timers to clean up on every overwrite.">
  <text x="20" y="24" font-size="10.5" fill="#5cc66f">✓ AN ABSOLUTE INSTANT</text>
  <rect x="20" y="34" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="58" font-size="10" fill="#e8e4dc">final class Entry {</text>
  <text x="38" y="76" font-size="10" fill="#e8e4dc">    final String value;</text>
  <text x="38" y="94" font-size="10" fill="#5cc66f">    final long expiresAtMillis;</text>
  <text x="38" y="112" font-size="10" fill="#6b7280">    // Long.MAX_VALUE = never expires</text>
  <text x="38" y="130" font-size="10" fill="#e8e4dc">}</text>
  <line x1="38" y1="146" x2="318" y2="146" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="38" y="166" font-size="10" fill="#5cc66f">alive? → now &lt; expiresAt   (one compare)</text>
  <text x="38" y="186" font-size="10" fill="#5cc66f">8 extra bytes per key</text>
  <text x="38" y="206" font-size="10" fill="#5cc66f">nothing is running · nothing to cancel</text>
  <text x="38" y="224" font-size="9" fill="#9099a8">immutable — a new TTL makes a new Entry</text>

  <text x="364" y="24" font-size="10.5" fill="#f06868">✗ A COUNTDOWN, OR A TIMER PER KEY</text>
  <rect x="364" y="34" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="382" y="58" font-size="10" fill="#e8e4dc">class Entry {</text>
  <text x="382" y="76" font-size="10" fill="#e8e4dc">    String value;</text>
  <text x="382" y="94" font-size="10" fill="#f06868">    int secondsLeft;</text>
  <text x="382" y="112" font-size="10" fill="#f06868">    ScheduledFuture&lt;?&gt; timer;</text>
  <text x="382" y="130" font-size="10" fill="#e8e4dc">}</text>
  <line x1="382" y1="146" x2="662" y2="146" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="166" font-size="10.5" fill="#f06868">1,000,000 keys → 1,000,000 timers</text>
  <text x="382" y="186" font-size="10" fill="#f06868">or a thread ticking every key, every second</text>
  <text x="382" y="206" font-size="10" fill="#f06868">every overwrite must cancel the old timer</text>
  <text x="382" y="224" font-size="9" fill="#9099a8">and a paused process wakes up with wrong counts</text>
</svg>`,
        caption:
          "The right-hand box is not slower by a constant factor — it is **O(keys) of live machinery** to answer a question that the left-hand box answers with one subtraction, only when asked.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Which clock, though?",
        text: "Use a **monotonic** source where you can (`System.nanoTime`, `time.monotonic()`), because wall-clock time can jump backwards when NTP corrects it and a key would then un-expire. In the interview, wrap whichever you pick behind a `Clock` interface and move on — the point you are making is that the store never calls a static time function directly. That is plain [[dependency-injection-and-ioc]], and here it is also the only thing that makes TTL testable without sleeping.",
      },

      // ---------- the money section ----------
      { type: "h", text: "Step 3 · Expired is not deleted — the idea this whole problem turns on" },
      {
        type: "p",
        text: "Follow one key. At t=0 you call `set(\"k\", \"v\", ttl=5s)`, so `expiresAt = 5000`. At t=5000 the key expires. **Ask yourself what code runs at that moment.** The answer is: none. There is no timer, no callback, no thread watching. The clock simply moves past a number stored in a field.",
      },
      {
        type: "p",
        text: "So at t=6000 the key is still in the map. `size()` still counts it. Its bytes are still resident. It is *logically* gone and *physically* present, and it stays in that state — possibly for hours — until somebody looks at it.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 350" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A timeline from t equals zero to t equals nine seconds. At t equals zero, set k with a five second TTL puts a live green entry in the map. At t equals five a dashed red line marks the expiry instant, labelled nothing runs here. At t equals six, seven and eight the key is drawn greyed out and struck through but still present in the map, and the size counter still reads one at every step. At t equals nine a get call finds it, returns nil, and only then removes it, at which point size drops to zero.">
  <defs>
    <marker id="kv-f4-a" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <text x="20" y="24" font-size="11" fill="#fb863a">ONE KEY, TEN SECONDS — watch when it actually leaves the map</text>

  <rect x="34" y="46" width="150" height="42" rx="6" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>
  <text x="46" y="64" font-size="9.5" fill="#5cc66f">set("k","v",ttl=5s)</text>
  <text x="46" y="80" font-size="9" fill="#9099a8">expiresAt = 5000</text>

  <line x1="380" y1="40" x2="380" y2="252" stroke="#f06868" stroke-width="1.6" stroke-dasharray="5 4"/>
  <text x="392" y="56" font-size="10.5" fill="#f06868">t = 5000 · the expiry instant</text>
  <text x="392" y="72" font-size="10" fill="#f06868">NOTHING RUNS HERE</text>
  <text x="392" y="88" font-size="9" fill="#9099a8">no timer · no callback · no thread</text>

  <rect x="600" y="46" width="106" height="42" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="612" y="64" font-size="9.5" fill="#fb863a">get("k", now)</text>
  <text x="612" y="80" font-size="9" fill="#9099a8">→ (nil)</text>
  <line x1="600" y1="72" x2="558" y2="140" stroke="#fb863a" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#kv-f4-a)"/>

  <text x="20" y="124" font-size="9.5" fill="#9099a8">in the map</text>
  <rect x="88" y="108" width="292" height="30" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="100" y="128" font-size="9.5" fill="#5cc66f">"k" → Entry("v", 5000)   ·   LIVE</text>

  <rect x="380" y="108" width="196" height="30" rx="5" fill="#0c0d10" stroke="#2d333d" stroke-dasharray="4 3"/>
  <text x="392" y="128" font-size="9.5" fill="#6b7280" text-decoration="line-through">"k" → Entry("v", 5000)</text>
  <text x="392" y="152" font-size="9.5" fill="#f06868">expired-but-present · still costing memory</text>

  <rect x="576" y="108" width="130" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="588" y="128" font-size="9.5" fill="#9099a8">(map is empty)</text>

  <line x1="34" y1="200" x2="706" y2="200" stroke="#3a414c" stroke-width="1.2"/>
  <line x1="34" y1="196" x2="34" y2="206" stroke="#6b7280"/><text x="34" y="222" font-size="9" fill="#6b7280" text-anchor="middle">0</text>
  <line x1="103" y1="196" x2="103" y2="206" stroke="#6b7280"/><text x="103" y="222" font-size="9" fill="#6b7280" text-anchor="middle">1</text>
  <line x1="172" y1="196" x2="172" y2="206" stroke="#6b7280"/><text x="172" y="222" font-size="9" fill="#6b7280" text-anchor="middle">2</text>
  <line x1="241" y1="196" x2="241" y2="206" stroke="#6b7280"/><text x="241" y="222" font-size="9" fill="#6b7280" text-anchor="middle">3</text>
  <line x1="310" y1="196" x2="310" y2="206" stroke="#6b7280"/><text x="310" y="222" font-size="9" fill="#6b7280" text-anchor="middle">4</text>
  <line x1="380" y1="196" x2="380" y2="206" stroke="#f06868"/><text x="380" y="222" font-size="9" fill="#f06868" text-anchor="middle">5</text>
  <line x1="448" y1="196" x2="448" y2="206" stroke="#6b7280"/><text x="448" y="222" font-size="9" fill="#6b7280" text-anchor="middle">6</text>
  <line x1="517" y1="196" x2="517" y2="206" stroke="#6b7280"/><text x="517" y="222" font-size="9" fill="#6b7280" text-anchor="middle">7</text>
  <line x1="586" y1="196" x2="586" y2="206" stroke="#6b7280"/><text x="586" y="222" font-size="9" fill="#6b7280" text-anchor="middle">8</text>
  <line x1="655" y1="196" x2="655" y2="206" stroke="#fb863a"/><text x="655" y="222" font-size="9" fill="#fb863a" text-anchor="middle">9</text>
  <text x="706" y="222" font-size="9" fill="#6b7280" text-anchor="end">seconds</text>

  <text x="20" y="262" font-size="9.5" fill="#9099a8">size()</text>
  <text x="34" y="262" font-size="10" fill="#5cc66f" text-anchor="middle">1</text>
  <text x="103" y="262" font-size="10" fill="#5cc66f" text-anchor="middle">1</text>
  <text x="172" y="262" font-size="10" fill="#5cc66f" text-anchor="middle">1</text>
  <text x="241" y="262" font-size="10" fill="#5cc66f" text-anchor="middle">1</text>
  <text x="310" y="262" font-size="10" fill="#5cc66f" text-anchor="middle">1</text>
  <text x="380" y="262" font-size="10" fill="#f06868" text-anchor="middle">1</text>
  <text x="448" y="262" font-size="10" fill="#f06868" text-anchor="middle">1</text>
  <text x="517" y="262" font-size="10" fill="#f06868" text-anchor="middle">1</text>
  <text x="586" y="262" font-size="10" fill="#f06868" text-anchor="middle">1</text>
  <text x="655" y="262" font-size="10" fill="#5cc66f" text-anchor="middle">0</text>

  <text x="34" y="292" font-size="9.5" fill="#9099a8">get returns</text>
  <text x="380" y="292" font-size="9.5" fill="#5cc66f" text-anchor="middle">"v"</text>
  <text x="448" y="292" font-size="9.5" fill="#f06868" text-anchor="middle">(nil)</text>
  <text x="655" y="292" font-size="9.5" fill="#f06868" text-anchor="middle">(nil)</text>

  <text x="20" y="326" font-size="10" fill="#fb863a">The key was unreadable from t=5 — but it did not leave the map until a reader arrived at t=9.</text>
  <text x="20" y="342" font-size="9.5" fill="#9099a8">Four seconds of memory held by something no caller could ever see. That gap is what the sweeper exists to close.</text>
</svg>`,
        caption:
          "Read the `size()` row. It says **1** for four seconds after the key stopped being readable. Correctness and memory are two different questions here, and this figure is the moment they separate.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The sentence that wins this round",
        text: "*“Nothing happens at the expiry instant. The key is unreadable from that moment because every read checks `expiresAt`, but it does not leave the map until either somebody reads it or the sweeper samples it.”* Say that in the first ten minutes and the rest of the hour is a conversation between equals.",
      },

      // ---------- two strategies ----------
      { type: "h", text: "Step 4 · Two expiry strategies, and real systems use both" },
      {
        type: "p",
        text: "**Lazy expiry** is the one you get almost for free. Every `get` already looks the key up; adding one comparison to that lookup is free in every sense that matters. If `expiresAt` has passed, you delete the key right there and report a miss. The caller can never observe a stale value, and you never spend a single cycle on keys nobody asks about.",
      },
      {
        type: "p",
        text: "And that last clause is also the hole. Consider a key called `report:2019-q3` with a one-hour TTL, written once and never read again. Its hour passes. Nobody calls `get`. Nothing deletes it. **It sits in memory until the process restarts** — and a workload full of such keys will run the server out of RAM while `size()` cheerfully reports a number that is mostly ghosts.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 292" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Lazy expiry on the left and active expiry on the right. Under lazy expiry a hot key that is read often is cleaned up instantly on its first read after expiry, but a cold key that nobody ever reads again stays in memory forever, and the memory bar keeps climbing. Under active expiry a background sweeper samples keys and reclaims the cold one, so the memory bar comes back down. A line underneath says real systems do both, because lazy expiry is precise for anything anyone reads and the sweeper handles everything else.">
  <text x="20" y="24" font-size="10.5" fill="#fb863a">LAZY — check on every read</text>
  <rect x="20" y="34" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(251,134,58,0.5)"/>
  <text x="38" y="58" font-size="9.5" fill="#5cc66f">hot key "session:1" · read every 2s</text>
  <rect x="38" y="66" width="280" height="24" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="48" y="82" font-size="9" fill="#5cc66f">expires → next get deletes it → 0 bytes held</text>

  <text x="38" y="118" font-size="9.5" fill="#f06868">cold key "report:2019-q3" · never read again</text>
  <rect x="38" y="126" width="280" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="48" y="142" font-size="9" fill="#f06868">expires → nobody looks → still there</text>
  <rect x="38" y="156" width="280" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="48" y="172" font-size="9" fill="#f06868">an hour later → STILL THERE</text>
  <rect x="38" y="186" width="280" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="48" y="202" font-size="9" fill="#f06868">until the process restarts → leaked</text>
  <text x="38" y="224" font-size="9" fill="#9099a8">memory ▲▲▲ · size() counts ghosts</text>

  <text x="364" y="24" font-size="10.5" fill="#5e9ff6">ACTIVE — a sampling sweeper</text>
  <rect x="364" y="34" width="316" height="196" rx="8" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="382" y="58" font-size="9.5" fill="#9099a8">every 100ms, on its own thread:</text>
  <rect x="382" y="66" width="280" height="24" rx="4" fill="rgba(94,159,246,0.12)" stroke="rgba(94,159,246,0.5)"/>
  <text x="392" y="82" font-size="9" fill="#5e9ff6">draw 20 random keys THAT HAVE A TTL</text>
  <rect x="382" y="96" width="280" height="24" rx="4" fill="rgba(94,159,246,0.12)" stroke="rgba(94,159,246,0.5)"/>
  <text x="392" y="112" font-size="9" fill="#5e9ff6">delete the expired ones</text>
  <rect x="382" y="126" width="280" height="24" rx="4" fill="rgba(94,159,246,0.12)" stroke="rgba(94,159,246,0.5)"/>
  <text x="392" y="142" font-size="9" fill="#5e9ff6">&gt; 25% dead? → immediately go again</text>
  <rect x="382" y="156" width="280" height="24" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="392" y="172" font-size="9" fill="#5cc66f">cold key found → reclaimed</text>
  <text x="382" y="202" font-size="9.5" fill="#f06868">cost: O(sample), not O(n) — never scan every key</text>
  <text x="382" y="224" font-size="9" fill="#9099a8">memory ▼ · but expiry is now approximate in time</text>

  <line x1="20" y1="246" x2="680" y2="246" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="268" font-size="10.5" fill="#5cc66f">REAL SYSTEMS DO BOTH.</text>
  <text x="188" y="268" font-size="10" fill="#e8e4dc">Lazy is exact for anything anyone reads; the sweeper handles everything else.</text>
  <text x="20" y="286" font-size="9.5" fill="#9099a8">Memcached is famously lazy-only and relies on eviction to reclaim the rest. Redis runs both, on a loop, forever.</text>
</svg>`,
        caption:
          "Neither column is a complete answer on its own. **Say “both, and here is why neither alone works” — that is the graded sentence.**",
      },
      {
        type: "p",
        text: "So the sweeper has to run. The naive sweeper walks every key, checks every `expiresAt`, and deletes what is dead. On a store with ten million keys that walk takes long enough to be visible to every client, and it does it over and over to find the handful of keys that died since last time. You do not need a complete answer, you need a *statistical* one.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 320" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The sampling sweeper drawn as a cycle of four steps: draw twenty random keys that have a TTL, delete the expired ones among them, then ask whether more than twenty-five percent of the sample was expired; if yes loop straight back to the first step, if no sleep for one hundred milliseconds and start again. On the right a worked example shows a sample of twenty small squares of which six are marked expired, giving thirty percent which is above the twenty-five percent threshold, so the loop repeats immediately.">
  <defs>
    <marker id="kv-f6-a" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5e9ff6"/></marker>
    <marker id="kv-f6-b" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <text x="20" y="24" font-size="10.5" fill="#5e9ff6">THE SWEEPER LOOP — this is Redis's actual algorithm</text>

  <rect x="30" y="44" width="250" height="34" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="44" y="65" font-size="9.5" fill="#5e9ff6">1 · draw 20 random keys with a TTL</text>
  <line x1="155" y1="78" x2="155" y2="98" stroke="#5e9ff6" stroke-width="1.2" marker-end="url(#kv-f6-a)"/>

  <rect x="30" y="102" width="250" height="34" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="44" y="123" font-size="9.5" fill="#5e9ff6">2 · delete the expired ones</text>
  <line x1="155" y1="136" x2="155" y2="156" stroke="#5e9ff6" stroke-width="1.2" marker-end="url(#kv-f6-a)"/>

  <rect x="30" y="160" width="250" height="34" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="44" y="181" font-size="9.5" fill="#fb863a">3 · was more than 25% expired?</text>

  <path d="M30,177 L14,177 L14,61 L26,61" fill="none" stroke="#fb863a" stroke-width="1.3" marker-end="url(#kv-f6-b)"/>
  <text x="18" y="128" font-size="9" fill="#fb863a" transform="rotate(-90 18 128)">YES → go again now</text>

  <line x1="155" y1="194" x2="155" y2="214" stroke="#9099a8" stroke-width="1.2" marker-end="url(#kv-f6-a)"/>
  <text x="164" y="209" font-size="9" fill="#9099a8">NO</text>
  <rect x="30" y="218" width="250" height="34" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="44" y="239" font-size="9.5" fill="#9099a8">4 · sleep 100ms, then start over</text>

  <text x="30" y="278" font-size="9.5" fill="#9099a8">Bounded work per pass. The CPU it spends is</text>
  <text x="30" y="294" font-size="9.5" fill="#9099a8">proportional to how much junk it keeps finding —</text>
  <text x="30" y="310" font-size="9.5" fill="#9099a8">not to how many keys the store holds.</text>

  <text x="330" y="24" font-size="10.5" fill="#fb863a">ONE SAMPLE, DRAWN</text>
  <rect x="330" y="38" width="374" height="120" rx="8" fill="#14161a" stroke="#2d333d"/>
  <rect x="346" y="56" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="378" y="56" width="24" height="24" rx="4" fill="rgba(240,104,104,0.3)" stroke="#f06868"/>
  <rect x="410" y="56" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="442" y="56" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="474" y="56" width="24" height="24" rx="4" fill="rgba(240,104,104,0.3)" stroke="#f06868"/>
  <rect x="506" y="56" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="538" y="56" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="570" y="56" width="24" height="24" rx="4" fill="rgba(240,104,104,0.3)" stroke="#f06868"/>
  <rect x="602" y="56" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="634" y="56" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>

  <rect x="346" y="88" width="24" height="24" rx="4" fill="rgba(240,104,104,0.3)" stroke="#f06868"/>
  <rect x="378" y="88" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="410" y="88" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="442" y="88" width="24" height="24" rx="4" fill="rgba(240,104,104,0.3)" stroke="#f06868"/>
  <rect x="474" y="88" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="506" y="88" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="538" y="88" width="24" height="24" rx="4" fill="rgba(240,104,104,0.3)" stroke="#f06868"/>
  <rect x="570" y="88" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="602" y="88" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="634" y="88" width="24" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/>

  <text x="346" y="134" font-size="9.5" fill="#f06868">■ expired = 6</text>
  <text x="450" y="134" font-size="9.5" fill="#9099a8">□ still alive = 14</text>
  <text x="346" y="150" font-size="9" fill="#6b7280">these 20 were picked at random from the keys that have a TTL</text>

  <rect x="330" y="172" width="374" height="80" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="346" y="196" font-size="10.5" fill="#fb863a">6 / 20 = 30%   ·   30% &gt; 25%   →   SAMPLE AGAIN, NOW</text>
  <text x="346" y="220" font-size="9.5" fill="#e8e4dc">A dense sample means there is probably more dead weight nearby,</text>
  <text x="346" y="236" font-size="9.5" fill="#e8e4dc">so it is worth another pass. A sparse one means stop and sleep.</text>

  <text x="330" y="278" font-size="9.5" fill="#5cc66f">The guarantee this gives you is probabilistic:</text>
  <text x="330" y="294" font-size="9.5" fill="#5cc66f">at any moment fewer than ~25% of the keys with a TTL</text>
  <text x="330" y="310" font-size="9.5" fill="#5cc66f">are expired-but-present. Not zero. Bounded.</text>
</svg>`,
        caption:
          "The 25% rule is the clever bit: it makes the sweeper's cost **track the amount of garbage, not the size of the store**. Describe this loop out loud and you will be the only candidate that day who did.",
      },
      {
        type: "code",
        language: "java",
        filename: "the sweeper, in full",
        code: `/**
 * One pass of active expiry. Bounded work, then it returns.
 * A scheduler calls this every 100ms; it never walks the whole keyspace.
 */
int sweepOnce() {
    int totalRemoved = 0;

    for (int round = 0; round < MAX_ROUNDS; round++) {      // hard cap, so a pass always ends
        List<String> sample = randomKeysWithTtl(SAMPLE_SIZE);   // 20
        if (sample.isEmpty()) break;

        int expired = 0;
        lock.writeLock().lock();
        try {
            long now = clock.nowMillis();
            for (String key : sample) {
                Entry e = map.get(key);
                if (e != null && e.isExpired(now)) { map.remove(key); expired++; }
            }
        } finally {
            lock.writeLock().unlock();
        }
        totalRemoved += expired;

        // "was more than 25% of the sample dead?"  expired/size > 0.25  without floats
        if (expired * 4 <= sample.size()) break;            // sparse → stop, sleep, try later
    }
    return totalRemoved;
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Why sample only the keys that have a TTL",
        text: "Most stores hold a mix: some keys expire, most do not. Sampling the whole keyspace would waste almost every draw on keys that can never be expired. Keep a second set — Redis calls it the **expires dict** — holding just the keys with a deadline, and sample from that. It costs one extra insert on `setWithTtl` and it makes the sweeper an order of magnitude more effective.",
      },

      // ---------- API ----------
      { type: "h", text: "Step 5 · The API surface is the design" },
      {
        type: "p",
        text: "Write the method list on the board before you write any bodies. It takes two minutes, it is the artefact the interviewer will actually discuss with you, and two of the rows on it are where careless designs get caught.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 388" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A three column table of the API. Each row gives a method, what it returns, and the edge case that matters. Get returns the value or empty and lazily deletes an expired key. Set returns nothing and clears any existing TTL, which is the row highlighted as a production bug source. Set with TTL stores an absolute expiresAt. Delete returns whether the key was actually present. Exists must apply the same expiry check as get. Expire returns false if the key does not exist. The ttl method is highlighted because it must return three distinguishable states rather than overloading minus one. Keys with a pattern is O of n and is flagged as dangerous. Size is documented as the physical entry count, including expired keys not yet reclaimed.">
  <text x="14" y="22" font-size="10" fill="#9099a8">method</text>
  <text x="248" y="22" font-size="10" fill="#9099a8">returns</text>
  <text x="424" y="22" font-size="10" fill="#fb863a">the edge case that is graded</text>
  <line x1="14" y1="30" x2="706" y2="30" stroke="#3a414c"/>

  <text x="14" y="54" font-size="10" fill="#e8e4dc">get(key)</text>
  <text x="248" y="54" font-size="9.5" fill="#9099a8">Optional&lt;String&gt;</text>
  <text x="424" y="54" font-size="9.5" fill="#5cc66f">expired → miss, and delete it here (lazy)</text>
  <line x1="14" y1="64" x2="706" y2="64" stroke="#232830"/>

  <rect x="10" y="70" width="700" height="30" rx="4" fill="rgba(240,104,104,0.10)"/>
  <text x="14" y="90" font-size="10" fill="#e8e4dc">set(key, value)</text>
  <text x="248" y="90" font-size="9.5" fill="#9099a8">void</text>
  <text x="424" y="90" font-size="9.5" fill="#f06868">CLEARS any existing TTL — the key becomes permanent</text>
  <line x1="14" y1="100" x2="706" y2="100" stroke="#232830"/>

  <text x="14" y="124" font-size="10" fill="#e8e4dc">setWithTtl(key, value, ttl)</text>
  <text x="248" y="124" font-size="9.5" fill="#9099a8">void</text>
  <text x="424" y="124" font-size="9.5" fill="#5cc66f">stores now + ttl as an absolute instant</text>
  <line x1="14" y1="134" x2="706" y2="134" stroke="#232830"/>

  <text x="14" y="158" font-size="10" fill="#e8e4dc">delete(key)</text>
  <text x="248" y="158" font-size="9.5" fill="#9099a8">boolean</text>
  <text x="424" y="158" font-size="9.5" fill="#9099a8">false if it was already expired — do not lie</text>
  <line x1="14" y1="168" x2="706" y2="168" stroke="#232830"/>

  <text x="14" y="192" font-size="10" fill="#e8e4dc">exists(key)</text>
  <text x="248" y="192" font-size="9.5" fill="#9099a8">boolean</text>
  <text x="424" y="192" font-size="9.5" fill="#f06868">must apply the SAME expiry check as get()</text>
  <line x1="14" y1="202" x2="706" y2="202" stroke="#232830"/>

  <text x="14" y="226" font-size="10" fill="#e8e4dc">expire(key, ttl)</text>
  <text x="248" y="226" font-size="9.5" fill="#9099a8">boolean</text>
  <text x="424" y="226" font-size="9.5" fill="#9099a8">false if there is no such live key</text>
  <line x1="14" y1="236" x2="706" y2="236" stroke="#232830"/>

  <text x="14" y="260" font-size="10" fill="#e8e4dc">persist(key)</text>
  <text x="248" y="260" font-size="9.5" fill="#9099a8">boolean</text>
  <text x="424" y="260" font-size="9.5" fill="#9099a8">removes the deadline, keeps the value</text>
  <line x1="14" y1="270" x2="706" y2="270" stroke="#232830"/>

  <rect x="10" y="276" width="700" height="30" rx="4" fill="rgba(251,134,58,0.14)"/>
  <text x="14" y="296" font-size="10" fill="#fb863a">ttl(key)</text>
  <text x="248" y="296" font-size="9.5" fill="#fb863a">TtlResult — 3 states</text>
  <text x="424" y="296" font-size="9.5" fill="#fb863a">remaining · NO_EXPIRY · NO_SUCH_KEY</text>
  <line x1="14" y1="306" x2="706" y2="306" stroke="#232830"/>

  <text x="14" y="330" font-size="10" fill="#e8e4dc">keys(pattern)</text>
  <text x="248" y="330" font-size="9.5" fill="#9099a8">List&lt;String&gt;</text>
  <text x="424" y="330" font-size="9.5" fill="#f06868">O(n) and blocking — this is why SCAN exists</text>
  <line x1="14" y1="340" x2="706" y2="340" stroke="#232830"/>

  <text x="14" y="364" font-size="10" fill="#e8e4dc">size()</text>
  <text x="248" y="364" font-size="9.5" fill="#9099a8">int</text>
  <text x="424" y="364" font-size="9.5" fill="#9099a8">PHYSICAL count — includes expired-but-present</text>
  <line x1="14" y1="374" x2="706" y2="374" stroke="#232830"/>

  <text x="14" y="386" font-size="9" fill="#6b7280">The two shaded rows are the ones interviewers push on. Everything else is bookkeeping.</text>
</svg>`,
        caption:
          "Two shaded rows. The red one is a bug people ship to production; the orange one is a design smell that costs nothing to avoid. **Volunteer both before you are asked.**",
      },
      {
        type: "callout",
        variant: "warning",
        title: "`set` clears the TTL — and that has broken real systems",
        text: "A session key is written with a 30-minute TTL. Later some unrelated code refreshes the value with a plain `set(key, value)` — and the session becomes **immortal**. The user is logged in forever and the memory is never reclaimed. Redis behaves exactly this way, which is why it grew a `KEEPTTL` option. Offer the same choice: `set(key, value, keepTtl)`, defaulting to clearing, and say the sentence *“a plain set makes the key permanent”* out loud.",
      },
      {
        type: "p",
        text: "The second shaded row is `ttl(key)`. There are genuinely three answers it can give, and they mean completely different things: *“1,842 milliseconds left”*, *“this key exists and will never expire”*, and *“there is no such key.”* Collapse two of those into one sentinel and the caller cannot tell a permanent key from a missing one — which is exactly the bug that makes people write `if (ttl(k) == -1) recreate(k)` and then wipe a key that was fine.",
      },
      {
        type: "code",
        language: "java",
        filename: "an honest ttl()",
        code: `/** Three distinguishable states. No caller ever has to guess. */
sealed interface TtlResult {
    record Remaining(long millis) implements TtlResult {}
    record NoExpiry()             implements TtlResult {}   // key is there, no deadline
    record NoSuchKey()            implements TtlResult {}   // key is absent OR expired
}

TtlResult ttl(String key) {
    long now = clock.nowMillis();
    lock.readLock().lock();
    try {
        Entry e = map.get(key);
        if (e == null || e.isExpired(now)) return new TtlResult.NoSuchKey();
        if (e.neverExpires())               return new TtlResult.NoExpiry();
        return new TtlResult.Remaining(e.expiresAtMillis() - now);
    } finally {
        lock.readLock().unlock();
    }
}

// Redis encodes the same three states as -2 (no key), -1 (no expiry), n (millis left).
// That works, but only because it is documented. A type says it without a manual.`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "The `keys(pattern)` trap",
        text: "`keys(\"session:*\")` has to walk **every** key in the store, and in a single-threaded server it holds the whole thing still while it does. That is why Redis's own documentation tells you not to run `KEYS` in production and offers `SCAN` instead — a **cursor**: each call returns a few keys and a position to resume from, so the work is spread across many small calls. Mention it in one sentence: *“I would ship `keys()` for the interview and a cursor-based `scan()` for production, because `keys()` is O(n) and blocking.”*",
      },

      // ---------- concurrency ----------
      { type: "h", text: "Step 6 · Concurrency — where the lazy delete bites" },
      {
        type: "p",
        text: "A key-value store is read-heavy: many `get`s, few `set`s. That is the textbook case for a [[read-write-locks]] — any number of readers together, or one writer alone. And here, unlike in [[lru-lfu-cache]] where a `get` secretly rewrites the recency list and so a read lock buys you nothing, a `get` in a plain store really is a read. It looks up a key and compares two numbers. Nothing moves.",
      },
      {
        type: "p",
        text: "**Except when the key it finds has expired.** Then the read has to delete it — and deleting is a write. That is the one interesting concurrency moment in the whole problem, and it is worth being precise about.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 330" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The top half shows a read-write lock working normally: three reader threads are inside the store at the same time while a writer waits outside, and then the writer is inside alone while the readers wait. The bottom half shows the special case in this problem: a get that finds an expired key must delete it, so a read turns into a write. Java read-write locks cannot upgrade in place, so the reader releases the read lock, acquires the write lock, and must re-check the entry because another thread may have removed or replaced it in the gap.">
  <text x="20" y="22" font-size="10.5" fill="#5cc66f">NORMAL — a get really is a read here</text>

  <rect x="20" y="34" width="300" height="104" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="34" y="54" font-size="9.5" fill="#5cc66f">readLock held by three threads at once</text>
  <rect x="34" y="64" width="80" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="46" y="81" font-size="9" fill="#5cc66f">reader A</text>
  <rect x="122" y="64" width="80" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="134" y="81" font-size="9" fill="#5cc66f">reader B</text>
  <rect x="210" y="64" width="80" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="222" y="81" font-size="9" fill="#5cc66f">reader C</text>
  <rect x="34" y="98" width="256" height="26" rx="4" fill="#0c0d10" stroke="#3a414c" stroke-dasharray="4 3"/><text x="46" y="115" font-size="9" fill="#6b7280">writer W — waiting outside</text>

  <rect x="340" y="34" width="300" height="104" rx="8" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <text x="354" y="54" font-size="9.5" fill="#5e9ff6">writeLock held by exactly one thread</text>
  <rect x="354" y="64" width="256" height="26" rx="4" fill="rgba(94,159,246,0.14)" stroke="rgba(94,159,246,0.5)"/><text x="366" y="81" font-size="9" fill="#5e9ff6">writer W — set / delete / sweep</text>
  <rect x="354" y="98" width="80" height="26" rx="4" fill="#0c0d10" stroke="#3a414c" stroke-dasharray="4 3"/><text x="366" y="115" font-size="9" fill="#6b7280">reader A</text>
  <rect x="442" y="98" width="80" height="26" rx="4" fill="#0c0d10" stroke="#3a414c" stroke-dasharray="4 3"/><text x="454" y="115" font-size="9" fill="#6b7280">reader B</text>
  <rect x="530" y="98" width="80" height="26" rx="4" fill="#0c0d10" stroke="#3a414c" stroke-dasharray="4 3"/><text x="542" y="115" font-size="9" fill="#6b7280">reader C</text>

  <text x="656" y="86" font-size="9" fill="#9099a8">reads far</text>
  <text x="656" y="100" font-size="9" fill="#9099a8">outnumber</text>
  <text x="656" y="114" font-size="9" fill="#9099a8">writes → this</text>
  <text x="656" y="128" font-size="9" fill="#9099a8">actually pays</text>

  <line x1="20" y1="156" x2="700" y2="156" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="180" font-size="10.5" fill="#fb863a">THE CATCH — a get that finds an EXPIRED key must WRITE</text>

  <rect x="20" y="192" width="146" height="46" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="32" y="211" font-size="9" fill="#5cc66f">readLock · map.get(k)</text>
  <text x="32" y="227" font-size="9" fill="#5cc66f">expiresAt &lt; now ✗</text>

  <text x="176" y="219" font-size="11" fill="#f06868">→</text>

  <rect x="196" y="192" width="176" height="46" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="208" y="211" font-size="9" fill="#f06868">release readLock</text>
  <text x="208" y="227" font-size="9" fill="#f06868">(Java cannot upgrade in place)</text>

  <text x="382" y="219" font-size="11" fill="#fb863a">→</text>

  <rect x="402" y="192" width="146" height="46" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="414" y="211" font-size="9" fill="#fb863a">acquire writeLock</text>
  <text x="414" y="227" font-size="9" fill="#fb863a">RE-CHECK the entry</text>

  <text x="558" y="219" font-size="11" fill="#5cc66f">→</text>

  <rect x="578" y="192" width="122" height="46" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="590" y="211" font-size="9" fill="#5cc66f">map.remove(k)</text>
  <text x="590" y="227" font-size="9" fill="#5cc66f">return (nil)</text>

  <text x="20" y="266" font-size="9.5" fill="#f06868">Why the re-check is not optional: in the gap between releasing the read lock and taking the write lock,</text>
  <text x="20" y="282" font-size="9.5" fill="#f06868">another thread may have set(k) a brand-new value. Removing blindly would delete live data.</text>
  <text x="20" y="308" font-size="9.5" fill="#9099a8">Simpler alternative worth naming: keep one plain lock, or use ConcurrentHashMap and do the whole thing in a single</text>
  <text x="20" y="324" font-size="9.5" fill="#9099a8">atomic computeIfPresent — return null from the remapping function and the map deletes the entry for you.</text>
</svg>`,
        caption:
          "The red sentence is the whole point. **Release-then-reacquire is not an upgrade — it is a gap** — and any state you read before the gap must be read again after it.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 306" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram for a get call on an expired key. The client calls get with a key. The store asks the clock for now, takes the read lock, reads the entry from the map, and finds that expiresAt is less than now. It releases the read lock, takes the write lock, re-reads the entry to confirm it is still the expired one, removes it from the map, increments the lazy-expiry counter, releases the write lock, and returns empty to the client as a miss.">
  <defs>
    <marker id="kv-f8-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="kv-f8-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="96" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="34" y="31" font-size="10" fill="#e8e4dc">Client</text>
  <rect x="164" y="12" width="126" height="28" rx="5" fill="#14161a" stroke="#fb863a"/><text x="180" y="31" font-size="10" fill="#fb863a">KeyValueStore</text>
  <rect x="352" y="12" width="96" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="374" y="31" font-size="10" fill="#e8e4dc">Clock</text>
  <rect x="514" y="12" width="176" height="28" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="530" y="31" font-size="10" fill="#5cc66f">Map + ReadWriteLock</text>

  <line x1="62" y1="40" x2="62" y2="288" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="227" y1="40" x2="227" y2="288" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="400" y1="40" x2="400" y2="288" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="602" y1="40" x2="602" y2="288" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="70" y="62" font-size="9.5" fill="#e8e4dc">get("session:1")</text>
  <line x1="62" y1="70" x2="223" y2="70" stroke="#fb863a" stroke-width="1.3" marker-end="url(#kv-f8-call)"/>

  <text x="236" y="90" font-size="9.5" fill="#e8e4dc">nowMillis()</text>
  <line x1="227" y1="98" x2="396" y2="98" stroke="#fb863a" stroke-width="1.3" marker-end="url(#kv-f8-call)"/>
  <text x="256" y="118" font-size="9.5" fill="#9099a8">6000</text>
  <line x1="400" y1="126" x2="231" y2="126" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#kv-f8-ret)"/>

  <rect x="510" y="136" width="186" height="44" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="520" y="153" font-size="9" fill="#5cc66f">readLock · map.get</text>
  <text x="520" y="169" font-size="9" fill="#5cc66f">Entry(expiresAt=5000)</text>
  <line x1="227" y1="146" x2="506" y2="146" stroke="#fb863a" stroke-width="1.3" marker-end="url(#kv-f8-call)"/>
  <text x="240" y="142" font-size="9" fill="#9099a8">read under readLock</text>

  <text x="240" y="204" font-size="9.5" fill="#f06868">5000 &lt; 6000 → expired · this read must now WRITE</text>
  <rect x="510" y="192" width="186" height="60" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="520" y="209" font-size="9" fill="#fb863a">unlock read · lock write</text>
  <text x="520" y="225" font-size="9" fill="#fb863a">RE-CHECK the entry</text>
  <text x="520" y="241" font-size="9" fill="#fb863a">map.remove · unlock</text>
  <line x1="227" y1="216" x2="506" y2="216" stroke="#fb863a" stroke-width="1.3" marker-end="url(#kv-f8-call)"/>

  <line x1="602" y1="266" x2="231" y2="266" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#kv-f8-ret)"/>
  <text x="300" y="262" font-size="9.5" fill="#5cc66f">removed · lazyExpired++</text>

  <text x="70" y="286" font-size="9.5" fill="#f06868">Optional.empty()  — a MISS, never a stale value</text>
  <line x1="227" y1="294" x2="66" y2="294" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#kv-f8-ret)"/>
</svg>`,
        caption:
          "Trace the orange band. **A read that turns into a write is the only place this design has a sharp edge** — and pointing at it before the interviewer does is worth more than any other single sentence here. Notation: [[sequence-diagrams]].",
      },
      {
        type: "ul",
        items: [
          "**The 60-minute answer:** one `ReentrantReadWriteLock`, `get` takes the read lock, and the lazy delete drops the read lock and takes the write lock with a **re-check**. Ten lines, correct, and you can explain it.",
          "**The tidier answer:** a `ConcurrentHashMap` and `computeIfPresent(key, (k, e) -> e.isExpired(now) ? null : e)`. Returning `null` from the remapping function removes the entry, so the check and the delete are one atomic step on that bin — no explicit lock at all. Related: [[atomic-operations-and-cas]].",
          "**The answer you must not give:** `synchronized` on every method. It works, and it makes a read-heavy store serialise every single `get` behind every other one. Background: [[locks-mutex-semaphore]].",
          "**How you scale past one lock:** shard the keyspace. `shardFor(key) = shards[hash(key) & (N-1)]`, each shard holding its own map and its own lock. Keys in different shards never contend, so N writers can proceed at once.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 268" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Sharding the keyspace. On the left one store with one lock forces four writer threads into a single queue. On the right the same keyspace is split into four shards, each with its own map and its own lock, and a hash of the key selects the shard, so all four writers proceed at the same time. A note underneath warns that operations spanning shards, such as size or keys, must now visit every shard, and that a lock only guarantees anything inside one process.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ ONE LOCK — four writers, one queue</text>
  <rect x="20" y="34" width="300" height="120" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <rect x="34" y="48" width="60" height="24" rx="4" fill="#1a1d22" stroke="#3a414c"/><text x="44" y="64" font-size="9" fill="#9099a8">w1</text>
  <rect x="34" y="78" width="60" height="24" rx="4" fill="#0c0d10" stroke="#3a414c" stroke-dasharray="3 3"/><text x="44" y="94" font-size="9" fill="#6b7280">w2</text>
  <rect x="34" y="108" width="60" height="24" rx="4" fill="#0c0d10" stroke="#3a414c" stroke-dasharray="3 3"/><text x="44" y="124" font-size="9" fill="#6b7280">w3</text>
  <text x="104" y="94" font-size="11" fill="#f06868">→</text>
  <rect x="124" y="60" width="180" height="60" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="136" y="82" font-size="9.5" fill="#f06868">🔒 one lock</text>
  <text x="136" y="100" font-size="9.5" fill="#f06868">one map</text>
  <text x="34" y="148" font-size="9" fill="#9099a8">w2 and w3 wait even though they touch other keys</text>

  <text x="360" y="22" font-size="10.5" fill="#5cc66f">✓ FOUR SHARDS — four writers, at once</text>
  <rect x="360" y="34" width="340" height="120" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="374" y="52" font-size="9" fill="#9099a8">shardFor(key) = shards[hash(key) &amp; 3]</text>
  <rect x="374" y="62" width="74" height="72" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="386" y="80" font-size="9" fill="#5cc66f">shard 0</text><text x="386" y="96" font-size="8.5" fill="#9099a8">🔒 own lock</text><text x="386" y="112" font-size="8.5" fill="#9099a8">own map</text><text x="386" y="128" font-size="8.5" fill="#5cc66f">w1 inside</text>
  <rect x="456" y="62" width="74" height="72" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="468" y="80" font-size="9" fill="#5cc66f">shard 1</text><text x="468" y="96" font-size="8.5" fill="#9099a8">🔒 own lock</text><text x="468" y="112" font-size="8.5" fill="#9099a8">own map</text><text x="468" y="128" font-size="8.5" fill="#5cc66f">w2 inside</text>
  <rect x="538" y="62" width="74" height="72" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="550" y="80" font-size="9" fill="#5cc66f">shard 2</text><text x="550" y="96" font-size="8.5" fill="#9099a8">🔒 own lock</text><text x="550" y="112" font-size="8.5" fill="#9099a8">own map</text><text x="550" y="128" font-size="8.5" fill="#5cc66f">w3 inside</text>
  <rect x="620" y="62" width="66" height="72" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="632" y="80" font-size="9" fill="#5cc66f">shard 3</text><text x="632" y="96" font-size="8.5" fill="#9099a8">🔒 own lock</text><text x="632" y="112" font-size="8.5" fill="#9099a8">own map</text><text x="632" y="128" font-size="8.5" fill="#5cc66f">w4 inside</text>
  <text x="360" y="148" font-size="9" fill="#5cc66f">contention drops by roughly N — this is what ConcurrentHashMap does internally</text>

  <line x1="20" y1="172" x2="700" y2="172" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="196" font-size="9.5" fill="#fb863a">The bill for sharding: anything global now costs N visits.</text>
  <text x="20" y="214" font-size="9.5" fill="#9099a8">size() sums N counters · keys(pattern) walks N maps · the sweeper must sample across N shards</text>
  <text x="20" y="232" font-size="9.5" fill="#9099a8">and a snapshot of "the whole store" is no longer a single consistent instant unless you lock them all.</text>
  <text x="20" y="256" font-size="9.5" fill="#f06868">None of this survives leaving the process: a lock guarantees nothing across a cluster of machines.</text>
</svg>`,
        caption:
          "Sharding is the honest answer to *“won't one lock be a bottleneck?”* — but say the bill out loud too. **Every global operation gets more expensive, and correctness across machines needs something else entirely.**",
      },

      // ---------- class diagram ----------
      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 350" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. KeyValueStore holds one or more Shards, depends on a Clock interface implemented by SystemClock and FakeClock, owns an ActiveExpirer, and delegates to an EvictionPolicy interface implemented by NoEviction, VolatileTtl and AllKeysLru. Each Shard owns a map from String to Entry plus a ReadWriteLock and a set of the keys that have a TTL. Entry is an immutable value object holding a value and an absolute expiresAtMillis.">
  <defs>
    <marker id="kv-f11-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="250" y="12" width="224" height="82" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="262" y="32" font-size="11.5" fill="#fb863a">KeyValueStore</text>
  <line x1="250" y1="40" x2="474" y2="40" stroke="#2d333d"/>
  <text x="262" y="58" font-size="9.5" fill="#e8e4dc">+ get · set · setWithTtl · delete</text>
  <text x="262" y="74" font-size="9.5" fill="#e8e4dc">+ expire · persist · ttl · keys · size</text>
  <text x="262" y="88" font-size="9" fill="#6b7280">+ incr · compareAndSet</text>

  <path d="M300,94 L300,108 L292,116 L300,124 L308,116 L300,108" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="300" y1="124" x2="300" y2="150" stroke="#d8d3c9" stroke-width="1.3"/>
  <text x="252" y="142" font-size="9.5" fill="#9099a8">1..N</text>
  <rect x="196" y="150" width="212" height="94" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.3"/>
  <text x="208" y="170" font-size="11.5" fill="#5cc66f">Shard</text>
  <line x1="196" y1="178" x2="408" y2="178" stroke="#2d333d"/>
  <text x="208" y="196" font-size="9.5" fill="#9099a8">- map : Map&lt;String, Entry&gt;</text>
  <text x="208" y="212" font-size="9.5" fill="#fb863a">- lock : ReadWriteLock</text>
  <text x="208" y="228" font-size="9.5" fill="#9099a8">- volatileKeys : Set&lt;String&gt;</text>
  <text x="208" y="242" font-size="9" fill="#6b7280">only these are ever sampled</text>

  <line x1="300" y1="244" x2="300" y2="272" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#kv-f11-a)"/>
  <rect x="196" y="276" width="212" height="66" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="208" y="296" font-size="11.5" fill="#5e9ff6">Entry  «value object»</text>
  <line x1="196" y1="304" x2="408" y2="304" stroke="#2d333d"/>
  <text x="208" y="322" font-size="9.5" fill="#e8e4dc">- value : String</text>
  <text x="208" y="338" font-size="9.5" fill="#fb863a">- expiresAtMillis : long</text>

  <line x1="474" y1="34" x2="524" y2="34" stroke="#9099a8" stroke-width="1.2" marker-end="url(#kv-f11-a)"/>
  <rect x="528" y="12" width="178" height="56" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="540" y="32" font-size="11" fill="#e8e4dc">Clock  «interface»</text>
  <line x1="528" y1="40" x2="706" y2="40" stroke="#2d333d"/>
  <text x="540" y="58" font-size="9.5" fill="#9099a8">+ nowMillis() : long</text>
  <line x1="617" y1="88" x2="617" y2="72" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#kv-f11-a)"/>
  <rect x="528" y="90" width="86" height="34" rx="5" fill="#14161a" stroke="#3a414c"/><text x="538" y="111" font-size="9" fill="#9099a8">SystemClock</text>
  <rect x="620" y="90" width="86" height="34" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="632" y="111" font-size="9" fill="#5cc66f">FakeClock</text>
  <text x="528" y="140" font-size="9" fill="#5cc66f">FakeClock is why TTL tests take microseconds, not seconds</text>

  <line x1="474" y1="66" x2="524" y2="170" stroke="#9099a8" stroke-width="1.2" marker-end="url(#kv-f11-a)"/>
  <rect x="528" y="158" width="178" height="52" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="540" y="178" font-size="11" fill="#e8e4dc">ActiveExpirer</text>
  <line x1="528" y1="186" x2="706" y2="186" stroke="#2d333d"/>
  <text x="540" y="203" font-size="9.5" fill="#9099a8">+ sweepOnce() : int</text>

  <rect x="428" y="230" width="278" height="58" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="440" y="250" font-size="11" fill="#e8e4dc">EvictionPolicy  «interface»</text>
  <line x1="428" y1="258" x2="706" y2="258" stroke="#2d333d"/>
  <text x="440" y="276" font-size="9.5" fill="#9099a8">+ pickVictim(shard) : String</text>
  <line x1="428" y1="256" x2="412" y2="200" stroke="#9099a8" stroke-width="1.2" marker-end="url(#kv-f11-a)"/>

  <rect x="428" y="296" width="86" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="438" y="315" font-size="8.5" fill="#9099a8">NoEviction</text>
  <rect x="520" y="296" width="86" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="530" y="315" font-size="8.5" fill="#9099a8">VolatileTtl</text>
  <rect x="612" y="296" width="94" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="622" y="315" font-size="8.5" fill="#9099a8">AllKeysLru</text>
  <line x1="567" y1="296" x2="567" y2="290" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#kv-f11-a)"/>
  <text x="428" y="342" font-size="9" fill="#6b7280">AllKeysLru is where the sibling problem lives — this store just calls pickVictim()</text>

  <text x="14" y="176" font-size="9.5" fill="#fb863a">Four seams, and</text>
  <text x="14" y="192" font-size="9.5" fill="#fb863a">only one of them</text>
  <text x="14" y="208" font-size="9.5" fill="#fb863a">is really needed</text>
  <text x="14" y="224" font-size="9" fill="#9099a8">in 60 minutes:</text>
  <text x="14" y="240" font-size="9" fill="#9099a8">the Clock.</text>
</svg>`,
        caption:
          "Notice how small the store itself is. **The `Clock` seam is the one that earns its keep in an interview** — the eviction seam is the one to *name* and only build if there is time. Notation: [[class-diagrams]].",
      },

      // ---------- third act: eviction ----------
      { type: "h", text: "The memory bound — dying of space, not of time" },
      {
        type: "p",
        text: "A key can die two completely different deaths, and conflating them is a classic slip. **Expiry is about time**: this key had a deadline and the deadline passed. **Eviction is about space**: the store is full and something has to go, whether or not it had a deadline at all. Different trigger, different mechanism, different policy.",
      },
      {
        type: "ul",
        items: [
          "**`noeviction`** — refuse writes once the limit is hit. Correct for a store you are using as a database, infuriating for a cache. This should be your default answer, because it is the only one that never silently loses data.",
          "**`allkeys-lru`** — throw out the least recently used key, TTL or not. The right choice when the store is purely a cache. The machinery for it is the *entire* sibling problem — see [[lru-lfu-cache]] — so here you just call `policy.pickVictim()` and move on.",
          "**`volatile-ttl`** — among the keys that already have a deadline, drop the one expiring soonest. Elegant, because you are killing something that was going to die anyway, and it never touches a key the user marked permanent.",
          "**`random` / `allkeys-random`** — pick a victim at random. Sounds lazy; it is genuinely reasonable when access has no locality, and it costs nothing to implement.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Bytes, not entries",
        text: "`maxEntries` is fine for a whiteboard and wrong in production: 10,000 entries could be 4 MB or 4 GB. Real stores take a **weigher** — a function from an entry to its size — and evict while `totalWeight > maxMemory`. It is the same loop with a different comparison, and saying it takes ten seconds.",
      },

      // ---------- durability ----------
      { type: "h", text: "Durability — what survives a restart" },
      {
        type: "p",
        text: "An in-memory store loses everything when the process dies. Sometimes that is fine. When it is not, there are exactly two mechanisms, and real systems run both.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two durability mechanisms side by side. On the left an append-only log records every write command in order, is replayed from the start on boot to rebuild the map exactly, but grows forever and needs periodic compaction. On the right a snapshot writes the entire map to disk every sixty seconds, is small and loads fast, but everything written since the last snapshot is lost in a crash; a timeline marks that lost window in red. Underneath, a note explains that fsync after every write makes the log truly durable but caps throughput at the disk, so most systems fsync once a second and accept losing up to one second.">
  <text x="20" y="22" font-size="10.5" fill="#5cc66f">APPEND-ONLY LOG — every write, in order</text>
  <rect x="20" y="34" width="316" height="176" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="36" y="56" font-size="9" fill="#5cc66f">SET session:1 abc EX 5</text>
  <text x="36" y="74" font-size="9" fill="#5cc66f">SET user:7 nina</text>
  <text x="36" y="92" font-size="9" fill="#5cc66f">DEL cart:42</text>
  <text x="36" y="110" font-size="9" fill="#5cc66f">SET user:7 nina2</text>
  <text x="36" y="128" font-size="9" fill="#6b7280">… append, never rewrite</text>
  <line x1="36" y1="142" x2="320" y2="142" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="36" y="162" font-size="9.5" fill="#5cc66f">boot → replay from line 1 → exact state</text>
  <text x="36" y="180" font-size="9.5" fill="#f06868">grows forever · needs compaction</text>
  <text x="36" y="198" font-size="9" fill="#9099a8">compaction = rewrite it as the minimum set of SETs</text>

  <text x="364" y="22" font-size="10.5" fill="#5e9ff6">SNAPSHOT — the whole map, every N seconds</text>
  <rect x="364" y="34" width="316" height="176" rx="8" fill="#14161a" stroke="rgba(94,159,246,0.5)"/>
  <line x1="382" y1="76" x2="662" y2="76" stroke="#3a414c" stroke-width="1.2"/>
  <line x1="382" y1="70" x2="382" y2="82" stroke="#5e9ff6"/><text x="382" y="98" font-size="8.5" fill="#5e9ff6" text-anchor="middle">snap</text>
  <line x1="452" y1="70" x2="452" y2="82" stroke="#5e9ff6"/><text x="452" y="98" font-size="8.5" fill="#5e9ff6" text-anchor="middle">snap</text>
  <line x1="522" y1="70" x2="522" y2="82" stroke="#5e9ff6"/><text x="522" y="98" font-size="8.5" fill="#5e9ff6" text-anchor="middle">snap</text>
  <rect x="522" y="60" width="112" height="12" fill="rgba(240,104,104,0.3)"/>
  <line x1="634" y1="62" x2="634" y2="90" stroke="#f06868" stroke-width="1.6"/>
  <text x="640" y="72" font-size="9" fill="#f06868">💥 crash</text>
  <text x="522" y="54" font-size="9" fill="#f06868">LOST WINDOW</text>
  <line x1="382" y1="118" x2="662" y2="118" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="140" font-size="9.5" fill="#5cc66f">compact · loads in one pass · cheap to ship</text>
  <text x="382" y="158" font-size="9.5" fill="#f06868">loses everything since the last snapshot</text>
  <text x="382" y="176" font-size="9" fill="#9099a8">and writing it forks the process / doubles memory briefly</text>
  <text x="382" y="198" font-size="9" fill="#9099a8">TTLs are stored as absolute instants, so they survive correctly</text>

  <line x1="20" y1="230" x2="700" y2="230" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="252" font-size="10" fill="#fb863a">What fsync buys and costs:</text>
  <text x="192" y="252" font-size="9.5" fill="#e8e4dc">an appended line sits in the OS page cache until fsync pushes it to the disk.</text>
  <text x="20" y="270" font-size="9.5" fill="#9099a8">fsync every write = nothing is ever lost, and your write rate is now the disk's write rate.</text>
  <text x="20" y="288" font-size="9.5" fill="#9099a8">fsync once a second = you can lose one second, and writes stay in-memory fast. Almost everyone picks the second.</text>
</svg>`,
        caption:
          "The red band on the right is the honest number: **a snapshot every 60 seconds means “I can lose 60 seconds.”** Say the window out loud rather than saying *“it's durable”* — durability is always a number.",
      },

      // ---------- atomic ops ----------
      { type: "h", text: "Atomic operations, and why they belong in the store" },
      {
        type: "p",
        text: "*“Can two clients both increment a counter?”* If the only API is `get` then `set`, the answer is no — client A reads 5, client B reads 5, both write 6, and one increment vanishes. This is the same lost-update shape as two gates grabbing one spot in [[parking-lot]], and the fix is the same: the read-modify-write has to happen **inside** the store, under its lock, as one operation.",
      },
      {
        type: "ul",
        items: [
          "**`incr(key, delta)`** — parse, add, store, return the new value, all under one write lock. One method, and it removes an entire class of client bug. Note that it must decide what a missing key means: treat it as 0, and say so.",
          "**`compareAndSet(key, expected, next)`** — write only if the current value is still what the caller last read. This is optimistic concurrency: the caller retries on failure instead of holding a lock. Same primitive as [[atomic-operations-and-cas]], one level up.",
          "**MULTI-style batching** — queue several commands and run them back to back with nothing interleaved. Note the honest limitation: that gives you *isolation*, not *rollback*. If command three fails, commands one and two have already happened. Redis is explicit about this, and being explicit about it yourself reads very well.",
        ],
      },

      // ---------- budget ----------
      { type: "h", text: "The 60 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 200" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sixty minute budget bar split into seven segments: five minutes to clarify and agree the scope, six minutes for the API list plus the Entry and Clock types, fourteen minutes for the core map with lazy expiry on get, eight minutes for the TTL semantics of expire, persist and the three-state ttl method, ten minutes for the sampling sweeper, seven minutes for the read-write lock and the lazy-delete upgrade, and ten minutes for the eviction hook, a main method and running it.">
  <text x="20" y="40" font-size="9.5" fill="#6b7280">0 min</text>
  <text x="700" y="40" font-size="9.5" fill="#6b7280" text-anchor="end">60 min</text>

  <rect x="20" y="48" width="57" height="30" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="77" y="48" width="68" height="30" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="145" y="48" width="159" height="30" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="304" y="48" width="91" height="30" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="395" y="48" width="113" height="30" rx="4" fill="rgba(94,159,246,0.14)" stroke="rgba(94,159,246,0.5)"/>
  <rect x="508" y="48" width="79" height="30" rx="4" fill="#1a1d22" stroke="#3a414c"/>
  <rect x="587" y="48" width="113" height="30" rx="4" fill="#1a1d22" stroke="#3a414c"/>

  <line x1="48" y1="78" x2="48" y2="88" stroke="#3a414c"/>
  <text x="48" y="102" font-size="9.5" fill="#e8e4dc" text-anchor="middle">clarify</text>
  <text x="48" y="115" font-size="9" fill="#6b7280" text-anchor="middle">5</text>

  <line x1="224" y1="78" x2="224" y2="88" stroke="#fb863a"/>
  <text x="224" y="102" font-size="9.5" fill="#fb863a" text-anchor="middle">map + Entry + LAZY expiry in get()</text>
  <text x="224" y="115" font-size="9" fill="#6b7280" text-anchor="middle">14</text>

  <line x1="451" y1="78" x2="451" y2="88" stroke="#5e9ff6"/>
  <text x="451" y="102" font-size="9.5" fill="#5e9ff6" text-anchor="middle">sampling sweeper</text>
  <text x="451" y="115" font-size="9" fill="#6b7280" text-anchor="middle">10</text>

  <line x1="643" y1="78" x2="643" y2="88" stroke="#3a414c"/>
  <text x="643" y="102" font-size="9.5" fill="#e8e4dc" text-anchor="middle">eviction hook + main() + run it</text>
  <text x="643" y="115" font-size="9" fill="#6b7280" text-anchor="middle">10</text>

  <line x1="111" y1="78" x2="111" y2="134" stroke="#3a414c" stroke-dasharray="3 3"/>
  <text x="111" y="148" font-size="9.5" fill="#e8e4dc" text-anchor="middle">API list + Entry + Clock</text>
  <text x="111" y="161" font-size="9" fill="#6b7280" text-anchor="middle">6</text>

  <line x1="349" y1="78" x2="349" y2="134" stroke="#5cc66f" stroke-dasharray="3 3"/>
  <text x="349" y="148" font-size="9.5" fill="#5cc66f" text-anchor="middle">expire · persist · 3-state ttl</text>
  <text x="349" y="161" font-size="9" fill="#6b7280" text-anchor="middle">8</text>

  <line x1="547" y1="78" x2="547" y2="134" stroke="#3a414c" stroke-dasharray="3 3"/>
  <text x="547" y="148" font-size="9.5" fill="#e8e4dc" text-anchor="middle">RW lock + upgrade</text>
  <text x="547" y="161" font-size="9" fill="#6b7280" text-anchor="middle">7</text>

  <text x="20" y="188" font-size="9.5" fill="#fb863a">If minute 35 arrives and lazy expiry is not working, skip the sweeper and describe it instead. A store that returns stale values is a failed round; a store without a sweeper is an honest trade-off.</text>
</svg>`,
        caption:
          "The orange block is the one that cannot slip — **lazy expiry inside `get` is the minimum viable version of this problem.** Everything to the right of the green block is a bonus you narrate if you run out of time.",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“Support lists, sets and hashes, not just strings.”** → `Entry.value` becomes a sealed type (`StringValue | ListValue | HashValue`), commands validate the type and reject mismatches, and **nothing else about the design changes** — TTL, expiry, locking and eviction are all indifferent to what the value is. Say that last clause; it is the answer they are listening for.",
          "**“Notify me when a key expires.”** → publish an event from the two places a key actually dies (the lazy delete and the sweeper) and let subscribers listen: [[pub-sub-event-driven]]. Be honest that the notification fires when the key is *reclaimed*, not at the expiry instant — which is precisely the distinction the whole lesson is about.",
          "**“Make it distributed.”** → consistent hashing spreads keys across nodes so each key lives on exactly one, and each node runs this same design locally. Your `ReadWriteLock` now guarantees nothing across the cluster, TTLs depend on clocks that drift between machines, and `keys(pattern)` becomes a fan-out to every node. Naming those three consequences is the answer.",
          "**“What if a very hot key expires and ten thousand requests miss at once?”** → the thundering herd. One request rebuilds while the rest wait on the same future, or you refresh slightly *before* expiry. One sentence; it is a whole problem of its own.",
          "**“How would you test TTL?”** → a `FakeClock`, and tests that read like sentences: set with ttl 5s, advance 4s, expect a hit; advance 2s more, expect a miss; assert `size()` was still 1 *before* the get and 0 after. Not a `Thread.sleep` in sight. This is the payoff for injecting the clock.",
          "**“What would you monitor?”** → keys, expired-lazily, expired-actively, evicted, hit ratio, memory used against the limit, and the sweeper's sample-hit rate. That last one is the interesting one: if the sweeper keeps finding 25%+ expired every pass, it is losing the race and your TTLs are shorter than your reclaim rate.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**A `Timer` or `ScheduledFuture` per key.** It looks like the most direct translation of *“expire in 5 seconds”* and it does not survive contact with a million keys. This is the single most common way to fail this problem.",
          "**Storing a countdown instead of an instant.** Now something must decrement it, and you have invented the timer problem in a different shape.",
          "**Returning expired values.** If `get` does not check `expiresAt`, the TTL is decorative. The store is wrong in the most basic possible way and no amount of sweeper sophistication saves it.",
          "**A sweeper that scans every key.** O(n) on a loop, holding a lock, on a store meant to answer in microseconds. Sample instead.",
          "**`synchronized` on every method.** Correct and slow, in a workload that is 95% reads — the one case where a read-write lock genuinely pays for itself.",
          "**`ttl()` returning `-1` for both “no expiry” and “no such key”.** Two very different facts, one indistinguishable answer, and a caller that cannot help but get it wrong.",
          "**Treating expiry and eviction as one mechanism.** *“When memory is full I delete the expired keys”* is not an eviction policy — a store can be completely full of keys that are all perfectly alive.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Fill the store and read the columns",
        body:
          "Press **➕ SET** three times. Each row shows the key, the value, the **expiresAt** instant (an absolute number on the virtual clock, not a countdown) and a **ttl** that ticks down as a *derived* value. Note that `user:7` arrives with `expiresAt = ∞` — a key with no deadline is not a special case, it is just a very large number.",
      },
      {
        title: "The money moment — advance the clock",
        body:
          "Press **⏩ +2s** until the first key's `ttl` hits zero. The row goes **grey and struck through** and its pill reads `expired-but-present`. Now look at the **size()** stat: it has **not changed**. Nothing ran when that expiry passed. The key is unreadable and still resident, and it will stay that way as long as you leave it alone.",
      },
      {
        title: "Delete it by looking at it",
        body:
          "Click the struck-through row to **GET** it. It returns **(nil)**, the row disappears *at that moment*, **size()** finally drops and **misses** ticks up. You just performed lazy expiry by hand. Do it to a second key and notice that the store did no work at all on any key you did not touch.",
      },
      {
        title: "Watch a cold key leak",
        body:
          "Press **😴 Cold key**. It writes a key nobody will ever read and jumps the clock past its TTL. The **leaked** counter starts climbing and nothing stops it — press **⏩ +2s** a few more times and watch it keep climbing. This is the failure mode of a lazy-only store, and it is the entire reason the next button exists.",
      },
      {
        title: "Run the sampling sweeper",
        body:
          "Press **🧹 Sweep**. It draws up to 20 keys *that have a TTL*, highlights exactly those, deletes the expired ones, and then shows the decision on screen: something like `6/20 expired → 30% > 25% → sampling again`. It loops while the sample stays dense and stops when it goes sparse. The leaked keys vanish, and the cost was proportional to the garbage found — not to the size of the store.",
      },
      {
        title: "Make a TTL disappear",
        body:
          "Pick a row that still has a live `ttl` and press **🔒 SET no-TTL**. The value updates and the `expiresAt` column flips to **∞** — the deadline is gone and the key is now permanent. This is a real production bug: a session refreshed with a plain `set` never logs the user out and never frees its memory. The fix is a `keepTtl` flag, and knowing to offer it is the point.",
      },
      {
        title: "Kill a key for space instead of time",
        body:
          "Press **📉 Fill memory** until the memory bar crosses `maxMemory`. A key is **evicted** — and read the explain line carefully: this key was *alive*. It did not run out of time, it ran out of room. Two different mechanisms, two different counters, and mixing them up is one of the ways this round is lost.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `Clock` interface with a `FakeClock` → `Entry(value, expiresAtMillis)` with an `isExpired(now)` → a map plus a `get` that checks `expiresAt`, **deletes on expiry**, and returns a miss → `setWithTtl` / `expire` / a three-state `ttl` → a `sweepOnce()` that samples 20 and repeats above 25%. Then a `main()` that sets a key with a 5s TTL, advances the fake clock by 6s, prints `size()` (still 1), calls `get` (nil), and prints `size()` again (0). If that last pair of numbers is not 1 then 0, you have not built this problem — you have built a hash map.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "KeyValueStore.java",
        code: `import java.util.*;
import java.util.concurrent.atomic.LongAdder;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/** Time behind an interface — the one seam that makes TTL testable without sleeping. */
interface Clock { long nowMillis(); }

final class SystemClock implements Clock {
    public long nowMillis() { return System.currentTimeMillis(); }
}

/** A clock you move by hand. Every TTL test in this file runs in microseconds because of it. */
final class FakeClock implements Clock {
    private long now;
    FakeClock(long startMillis) { this.now = startMillis; }
    public long nowMillis() { return now; }
    void advance(long millis) { now += millis; }
}

/**
 * Immutable value object. Holds an ABSOLUTE instant, never a countdown:
 * nothing has to tick it, and a million keys still means zero running timers.
 */
final class Entry {
    static final long NEVER = Long.MAX_VALUE;

    private final String value;
    private final long expiresAtMillis;

    Entry(String value, long expiresAtMillis) {
        this.value = Objects.requireNonNull(value);
        this.expiresAtMillis = expiresAtMillis;
    }

    String value()            { return value; }
    long expiresAtMillis()    { return expiresAtMillis; }
    boolean neverExpires()    { return expiresAtMillis == NEVER; }
    boolean isExpired(long now) { return now >= expiresAtMillis; }
}

/** Three genuinely different answers. A single int that means all three is a bad API. */
sealed interface TtlResult {
    record Remaining(long millis) implements TtlResult {
        public String toString() { return millis + "ms left"; }
    }
    record NoExpiry() implements TtlResult {
        public String toString() { return "no expiry"; }
    }
    record NoSuchKey() implements TtlResult {
        public String toString() { return "no such key"; }
    }
}

final class KeyValueStore {
    private static final int SAMPLE_SIZE = 20;
    private static final int MAX_SWEEP_ROUNDS = 16;   // so one pass ALWAYS terminates

    private final Map<String, Entry> map = new HashMap<>();

    // Only the keys that HAVE a deadline. The sweeper samples from here, never from
    // the whole keyspace — otherwise almost every draw is wasted on permanent keys.
    private final List<String> volatileKeys = new ArrayList<>();
    private final Map<String, Integer> volatileIndex = new HashMap<>();

    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    private final Clock clock;
    private final int maxEntries;
    private final Random random = new Random(7);

    private final LongAdder hits = new LongAdder(), misses = new LongAdder();
    private final LongAdder lazyExpired = new LongAdder(), activeExpired = new LongAdder();
    private final LongAdder evicted = new LongAdder();

    KeyValueStore(Clock clock, int maxEntries) {
        this.clock = clock;
        this.maxEntries = maxEntries;
    }

    /* ------------------------------------------------------------------ reads */

    /**
     * A get really IS a read here — until it finds an expired key, and then it must WRITE.
     * Java's ReadWriteLock cannot upgrade in place, so we drop the read lock, take the
     * write lock, and RE-CHECK: another thread may have written a fresh value in the gap.
     */
    Optional<String> get(String key) {
        long now = clock.nowMillis();
        lock.readLock().lock();
        try {
            Entry e = map.get(key);
            if (e == null) { misses.increment(); return Optional.empty(); }
            if (!e.isExpired(now)) { hits.increment(); return Optional.of(e.value()); }
        } finally {
            lock.readLock().unlock();
        }

        lock.writeLock().lock();
        try {
            Entry again = map.get(key);
            if (again != null && again.isExpired(clock.nowMillis())) {
                removeLocked(key);
                lazyExpired.increment();
            }
            misses.increment();          // this call misses either way — it saw a dead key
            return Optional.empty();
        } finally {
            lock.writeLock().unlock();
        }
    }

    boolean exists(String key) { return get(key).isPresent(); }   // SAME expiry rule as get

    /** Three states, never overloaded onto one number. */
    TtlResult ttl(String key) {
        long now = clock.nowMillis();
        lock.readLock().lock();
        try {
            Entry e = map.get(key);
            if (e == null || e.isExpired(now)) return new TtlResult.NoSuchKey();
            if (e.neverExpires())               return new TtlResult.NoExpiry();
            return new TtlResult.Remaining(e.expiresAtMillis() - now);
        } finally {
            lock.readLock().unlock();
        }
    }

    /** The PHYSICAL entry count — expired-but-not-yet-reclaimed keys are included, on purpose. */
    int size() {
        lock.readLock().lock();
        try { return map.size(); } finally { lock.readLock().unlock(); }
    }

    /** What a caller could actually read right now. Usually smaller than size(). */
    int liveSize() {
        long now = clock.nowMillis();
        lock.readLock().lock();
        try {
            int n = 0;
            for (Entry e : map.values()) if (!e.isExpired(now)) n++;
            return n;
        } finally { lock.readLock().unlock(); }
    }

    /** O(n), and it holds the lock the whole way. This is exactly why SCAN with a cursor exists. */
    List<String> keys(String pattern) {
        long now = clock.nowMillis();
        lock.readLock().lock();
        try {
            List<String> out = new ArrayList<>();
            for (Map.Entry<String, Entry> e : map.entrySet())
                if (!e.getValue().isExpired(now) && glob(pattern, e.getKey())) out.add(e.getKey());
            Collections.sort(out);
            return out;
        } finally { lock.readLock().unlock(); }
    }

    /* ----------------------------------------------------------------- writes */

    /** Plain set CLEARS any existing deadline — the key becomes permanent. Real stores do this too. */
    void set(String key, String value) { set(key, value, false); }

    void set(String key, String value, boolean keepTtl) {
        lock.writeLock().lock();
        try {
            Entry old = map.get(key);
            long expiresAt = Entry.NEVER;
            if (keepTtl && old != null && !old.isExpired(clock.nowMillis()))
                expiresAt = old.expiresAtMillis();
            putLocked(key, new Entry(value, expiresAt));
            evictIfNeededLocked();
        } finally { lock.writeLock().unlock(); }
    }

    void setWithTtl(String key, String value, long ttlMillis) {
        lock.writeLock().lock();
        try {
            putLocked(key, new Entry(value, clock.nowMillis() + ttlMillis));   // ONE addition, once
            evictIfNeededLocked();
        } finally { lock.writeLock().unlock(); }
    }

    boolean delete(String key) {
        long now = clock.nowMillis();
        lock.writeLock().lock();
        try {
            Entry e = map.get(key);
            removeLocked(key);
            return e != null && !e.isExpired(now);       // do not claim to have deleted a ghost
        } finally { lock.writeLock().unlock(); }
    }

    boolean expire(String key, long ttlMillis) {
        lock.writeLock().lock();
        try {
            long now = clock.nowMillis();
            Entry e = map.get(key);
            if (e == null || e.isExpired(now)) return false;
            putLocked(key, new Entry(e.value(), now + ttlMillis));
            return true;
        } finally { lock.writeLock().unlock(); }
    }

    boolean persist(String key) {
        lock.writeLock().lock();
        try {
            long now = clock.nowMillis();
            Entry e = map.get(key);
            if (e == null || e.isExpired(now) || e.neverExpires()) return false;
            putLocked(key, new Entry(e.value(), Entry.NEVER));
            return true;
        } finally { lock.writeLock().unlock(); }
    }

    /* -------------------------------------------------- atomic read-modify-write */

    /** Two clients doing get-then-set would lose an increment. Doing it inside the store cannot. */
    long incr(String key, long delta) {
        lock.writeLock().lock();
        try {
            long now = clock.nowMillis();
            Entry e = map.get(key);
            boolean live = e != null && !e.isExpired(now);
            long current = live ? Long.parseLong(e.value()) : 0;      // missing key counts as 0
            long next = current + delta;
            putLocked(key, new Entry(Long.toString(next), live ? e.expiresAtMillis() : Entry.NEVER));
            return next;
        } finally { lock.writeLock().unlock(); }
    }

    /** Optimistic concurrency: write only if nobody changed it since you read it. */
    boolean compareAndSet(String key, String expected, String next) {
        lock.writeLock().lock();
        try {
            long now = clock.nowMillis();
            Entry e = map.get(key);
            if (e == null || e.isExpired(now) || !e.value().equals(expected)) return false;
            putLocked(key, new Entry(next, e.expiresAtMillis()));
            return true;
        } finally { lock.writeLock().unlock(); }
    }

    /* ---------------------------------------------------------- active expiry */

    /**
     * One pass of the sweeper. Draw 20 random keys that have a TTL, delete the dead ones,
     * and go again only while the sample stays dense. Bounded work, then it returns.
     */
    int sweepOnce() {
        int totalRemoved = 0;
        for (int round = 0; round < MAX_SWEEP_ROUNDS; round++) {
            List<String> sample;
            lock.readLock().lock();
            try { sample = sampleVolatileLocked(); } finally { lock.readLock().unlock(); }
            if (sample.isEmpty()) break;

            int expiredInSample = 0;
            lock.writeLock().lock();
            try {
                long now = clock.nowMillis();
                for (String key : sample) {
                    Entry e = map.get(key);
                    if (e != null && e.isExpired(now)) { removeLocked(key); expiredInSample++; }
                }
            } finally { lock.writeLock().unlock(); }

            totalRemoved += expiredInSample;
            activeExpired.add(expiredInSample);

            // more than 25% dead? go again immediately. Integer form of expired/n > 0.25
            if (expiredInSample * 4 <= sample.size()) break;
        }
        return totalRemoved;
    }

    private List<String> sampleVolatileLocked() {
        int n = Math.min(SAMPLE_SIZE, volatileKeys.size());
        List<String> out = new ArrayList<>(n);
        for (int i = 0; i < n; i++) out.add(volatileKeys.get(random.nextInt(volatileKeys.size())));
        return out;
    }

    /* ------------------------------------------------------------- eviction */

    /**
     * Dying of SPACE, not of time. Policy here is volatile-ttl: among keys that already
     * have a deadline, drop the one expiring soonest. The full machinery of allkeys-lru
     * is a problem of its own — this store only needs a pickVictim() seam.
     */
    private void evictIfNeededLocked() {
        while (map.size() > maxEntries) {
            String victim = null;
            long soonest = Long.MAX_VALUE;
            for (String key : volatileKeys) {
                Entry e = map.get(key);
                if (e != null && e.expiresAtMillis() < soonest) { soonest = e.expiresAtMillis(); victim = key; }
            }
            if (victim == null) victim = map.keySet().iterator().next();   // nothing volatile: random
            removeLocked(victim);
            evicted.increment();
        }
    }

    /* -------------------------------------------------------------- internals */

    private void putLocked(String key, Entry e) {
        map.put(key, e);
        if (e.neverExpires()) unmarkVolatile(key); else markVolatile(key);
    }

    private void removeLocked(String key) {
        map.remove(key);
        unmarkVolatile(key);
    }

    /** List + index, so a random pick and a removal are both O(1). */
    private void markVolatile(String key) {
        if (volatileIndex.containsKey(key)) return;
        volatileIndex.put(key, volatileKeys.size());
        volatileKeys.add(key);
    }

    private void unmarkVolatile(String key) {
        Integer i = volatileIndex.remove(key);
        if (i == null) return;
        int last = volatileKeys.size() - 1;
        if (i != last) {
            String moved = volatileKeys.get(last);
            volatileKeys.set(i, moved);
            volatileIndex.put(moved, i);
        }
        volatileKeys.remove(last);
    }

    /** One-star glob, which is all keys(pattern) ever really needs in an interview. */
    private static boolean glob(String pattern, String key) {
        int star = pattern.indexOf('*');
        if (star < 0) return pattern.equals(key);
        String head = pattern.substring(0, star), tail = pattern.substring(star + 1);
        return key.length() >= head.length() + tail.length()
            && key.startsWith(head) && key.endsWith(tail);
    }

    String stats() {
        return "keys=" + size() + " live=" + liveSize()
             + " hits=" + hits.sum() + " misses=" + misses.sum()
             + " expired-lazily=" + lazyExpired.sum()
             + " expired-actively=" + activeExpired.sum()
             + " evicted=" + evicted.sum();
    }
}

public class Main {
    public static void main(String[] args) {
        FakeClock clock = new FakeClock(0);
        KeyValueStore store = new KeyValueStore(clock, 100);

        store.setWithTtl("session:1", "abc", 5_000);
        store.set("user:7", "nina");                       // no deadline — permanent
        System.out.println("t=0     get(session:1) = " + store.get("session:1").orElse("(nil)"));
        System.out.println("t=0     size()=" + store.size() + " live=" + store.liveSize());

        clock.advance(6_000);                              // one second past the deadline
        System.out.println();
        System.out.println("t=6000  the key expired 1s ago. NOTHING RAN.");
        System.out.println("t=6000  size()=" + store.size() + " live=" + store.liveSize() + "   <- still counted");
        System.out.println("t=6000  get(session:1) = " + store.get("session:1").orElse("(nil)"));
        System.out.println("t=6000  size()=" + store.size() + "   <- the GET removed it (lazy expiry)");

        store.setWithTtl("report:2019", "...", 1_000);     // a key nobody will ever read
        clock.advance(60_000);
        System.out.println();
        System.out.println("t=66000 cold key expired 59s ago, never read: size()=" + store.size());
        System.out.println("t=66000 sweeper reclaimed " + store.sweepOnce() + " key(s), size()=" + store.size());

        store.setWithTtl("cart:42", "[a]", 30_000);
        System.out.println();
        System.out.println("ttl(cart:42) = " + store.ttl("cart:42"));
        System.out.println("ttl(user:7)  = " + store.ttl("user:7"));
        System.out.println("ttl(nope)    = " + store.ttl("nope"));

        store.set("cart:42", "[a,b]");                     // plain set — the TTL is gone
        System.out.println("after a plain set,   ttl(cart:42) = " + store.ttl("cart:42"));
        store.expire("cart:42", 30_000);
        store.set("cart:42", "[a,b,c]", true);             // keepTtl
        System.out.println("with keepTtl=true,   ttl(cart:42) = " + store.ttl("cart:42"));

        System.out.println();
        System.out.println("incr(visits) x3      = " + store.incr("visits", 1) + ", "
                                                     + store.incr("visits", 1) + ", "
                                                     + store.incr("visits", 1));
        System.out.println("cas(visits, 3 -> 10) = " + store.compareAndSet("visits", "3", "10"));
        System.out.println("cas(visits, 3 -> 99) = " + store.compareAndSet("visits", "3", "99") + "  (stale)");

        System.out.println();
        System.out.println("keys(\\"c*\\")          = " + store.keys("c*"));
        System.out.println(store.stats());
    }
}

/* -------------------------- expected output --------------------------
t=0     get(session:1) = abc
t=0     size()=2 live=2

t=6000  the key expired 1s ago. NOTHING RAN.
t=6000  size()=2 live=1   <- still counted
t=6000  get(session:1) = (nil)
t=6000  size()=1   <- the GET removed it (lazy expiry)

t=66000 cold key expired 59s ago, never read: size()=2
t=66000 sweeper reclaimed 1 key(s), size()=1

ttl(cart:42) = 30000ms left
ttl(user:7)  = no expiry
ttl(nope)    = no such key
after a plain set,   ttl(cart:42) = no expiry
with keepTtl=true,   ttl(cart:42) = 30000ms left

incr(visits) x3      = 1, 2, 3
cas(visits, 3 -> 10) = true
cas(visits, 3 -> 99) = false  (stale)

keys("c*")          = [cart:42]
keys=3 live=3 hits=1 misses=1 expired-lazily=1 expired-actively=1 evicted=0
--------------------------------------------------------------------- */`,
      },
      {
        label: "Python",
        language: "python",
        filename: "key_value_store.py",
        code: `from __future__ import annotations

import random
import threading
import time
from dataclasses import dataclass
from typing import Optional, Protocol

NEVER = float("inf")          # a key with no deadline is not a special case, just a big number
SAMPLE_SIZE = 20
MAX_SWEEP_ROUNDS = 16


class Clock(Protocol):
    """Time behind an interface — the seam that makes TTL testable without sleeping."""
    def now_millis(self) -> float: ...


class SystemClock:
    def now_millis(self) -> float:
        return time.monotonic() * 1000.0      # monotonic: never jumps backwards


class FakeClock:
    """A clock you move by hand. Every TTL test below runs in microseconds because of it."""
    def __init__(self, start_millis: float = 0.0):
        self._now = start_millis

    def now_millis(self) -> float:
        return self._now

    def advance(self, millis: float) -> None:
        self._now += millis


@dataclass(frozen=True)
class Entry:
    """Immutable. Holds an ABSOLUTE instant, never a countdown — nothing has to tick it."""
    value: str
    expires_at_millis: float

    def never_expires(self) -> bool:
        return self.expires_at_millis == NEVER

    def is_expired(self, now: float) -> bool:
        return now >= self.expires_at_millis


# ttl() has three genuinely different answers. One int meaning all three is a bad API.
@dataclass(frozen=True)
class Remaining:
    millis: float
    def __str__(self) -> str: return f"{int(self.millis)}ms left"


@dataclass(frozen=True)
class NoExpiry:
    def __str__(self) -> str: return "no expiry"


@dataclass(frozen=True)
class NoSuchKey:
    def __str__(self) -> str: return "no such key"


TtlResult = Remaining | NoExpiry | NoSuchKey


class KeyValueStore:
    """
    One lock, because CPython has no read-write lock in the standard library and the GIL
    already serialises the dict operations. In Java or Go this would be an RWLock, and the
    lazy delete inside get() would be the one place a read has to become a write.
    """

    def __init__(self, clock: Clock, max_entries: int = 100):
        self._map: dict[str, Entry] = {}
        # Only the keys that HAVE a deadline. The sweeper samples from here, never from the
        # whole keyspace, or almost every draw is wasted on permanent keys.
        self._volatile: list[str] = []
        self._volatile_index: dict[str, int] = {}
        self._lock = threading.RLock()
        self._clock = clock
        self._max_entries = max_entries
        self._rng = random.Random(7)
        self.hits = self.misses = 0
        self.lazy_expired = self.active_expired = self.evicted = 0

    # ------------------------------------------------------------------ reads

    def get(self, key: str) -> Optional[str]:
        """A read that finds an expired key must delete it — lazy expiry, in three lines."""
        with self._lock:
            now = self._clock.now_millis()
            entry = self._map.get(key)
            if entry is None:
                self.misses += 1
                return None
            if entry.is_expired(now):
                self._remove_locked(key)          # the read has become a write
                self.lazy_expired += 1
                self.misses += 1
                return None
            self.hits += 1
            return entry.value

    def exists(self, key: str) -> bool:
        return self.get(key) is not None          # SAME expiry rule as get

    def ttl(self, key: str) -> TtlResult:
        with self._lock:
            now = self._clock.now_millis()
            entry = self._map.get(key)
            if entry is None or entry.is_expired(now):
                return NoSuchKey()
            if entry.never_expires():
                return NoExpiry()
            return Remaining(entry.expires_at_millis - now)

    def size(self) -> int:
        """PHYSICAL entry count — expired-but-not-yet-reclaimed keys included, on purpose."""
        with self._lock:
            return len(self._map)

    def live_size(self) -> int:
        """What a caller could actually read right now. Usually smaller than size()."""
        with self._lock:
            now = self._clock.now_millis()
            return sum(1 for e in self._map.values() if not e.is_expired(now))

    def keys(self, pattern: str) -> list[str]:
        """O(n) and it holds the lock the whole way. This is exactly why SCAN exists."""
        with self._lock:
            now = self._clock.now_millis()
            return sorted(k for k, e in self._map.items()
                          if not e.is_expired(now) and _glob(pattern, k))

    # ----------------------------------------------------------------- writes

    def set(self, key: str, value: str, keep_ttl: bool = False) -> None:
        """A plain set CLEARS any existing deadline — the key becomes permanent."""
        with self._lock:
            expires_at = NEVER
            old = self._map.get(key)
            if keep_ttl and old is not None and not old.is_expired(self._clock.now_millis()):
                expires_at = old.expires_at_millis
            self._put_locked(key, Entry(value, expires_at))
            self._evict_if_needed_locked()

    def set_with_ttl(self, key: str, value: str, ttl_millis: float) -> None:
        with self._lock:
            # ONE addition, once, at write time. Nothing decrements anything, ever.
            self._put_locked(key, Entry(value, self._clock.now_millis() + ttl_millis))
            self._evict_if_needed_locked()

    def delete(self, key: str) -> bool:
        with self._lock:
            now = self._clock.now_millis()
            entry = self._map.get(key)
            self._remove_locked(key)
            return entry is not None and not entry.is_expired(now)   # never claim to delete a ghost

    def expire(self, key: str, ttl_millis: float) -> bool:
        with self._lock:
            now = self._clock.now_millis()
            entry = self._map.get(key)
            if entry is None or entry.is_expired(now):
                return False
            self._put_locked(key, Entry(entry.value, now + ttl_millis))
            return True

    def persist(self, key: str) -> bool:
        with self._lock:
            now = self._clock.now_millis()
            entry = self._map.get(key)
            if entry is None or entry.is_expired(now) or entry.never_expires():
                return False
            self._put_locked(key, Entry(entry.value, NEVER))
            return True

    # -------------------------------------------- atomic read-modify-write

    def incr(self, key: str, delta: int = 1) -> int:
        """Two clients doing get-then-set would lose an increment. Inside the store, they cannot."""
        with self._lock:
            now = self._clock.now_millis()
            entry = self._map.get(key)
            live = entry is not None and not entry.is_expired(now)
            nxt = (int(entry.value) if live else 0) + delta        # missing key counts as 0
            self._put_locked(key, Entry(str(nxt), entry.expires_at_millis if live else NEVER))
            return nxt

    def compare_and_set(self, key: str, expected: str, nxt: str) -> bool:
        """Optimistic concurrency: write only if nobody changed it since you read it."""
        with self._lock:
            now = self._clock.now_millis()
            entry = self._map.get(key)
            if entry is None or entry.is_expired(now) or entry.value != expected:
                return False
            self._put_locked(key, Entry(nxt, entry.expires_at_millis))
            return True

    # ---------------------------------------------------------- active expiry

    def sweep_once(self) -> int:
        """
        Draw 20 random keys that have a TTL, delete the dead ones, and go again only while
        the sample stays dense. Bounded work per pass — never a walk of the whole keyspace.
        """
        total = 0
        for _ in range(MAX_SWEEP_ROUNDS):
            with self._lock:
                if not self._volatile:
                    break
                n = min(SAMPLE_SIZE, len(self._volatile))
                sample = [self._rng.choice(self._volatile) for _ in range(n)]

                now = self._clock.now_millis()
                expired = 0
                for key in sample:
                    entry = self._map.get(key)
                    if entry is not None and entry.is_expired(now):
                        self._remove_locked(key)
                        expired += 1

            total += expired
            self.active_expired += expired
            if expired * 4 <= len(sample):     # 25% threshold, without floats
                break
        return total

    # ------------------------------------------------------------- eviction

    def _evict_if_needed_locked(self) -> None:
        """
        Dying of SPACE, not of time. Policy: volatile-ttl — among the keys that already have
        a deadline, drop the one expiring soonest. allkeys-lru is a whole problem of its own.
        """
        while len(self._map) > self._max_entries:
            victim = None
            soonest = NEVER
            for key in self._volatile:
                entry = self._map.get(key)
                if entry is not None and entry.expires_at_millis < soonest:
                    soonest, victim = entry.expires_at_millis, key
            if victim is None:
                victim = next(iter(self._map))
            self._remove_locked(victim)
            self.evicted += 1

    # ------------------------------------------------------------ internals

    def _put_locked(self, key: str, entry: Entry) -> None:
        self._map[key] = entry
        if entry.never_expires():
            self._unmark_volatile(key)
        else:
            self._mark_volatile(key)

    def _remove_locked(self, key: str) -> None:
        self._map.pop(key, None)
        self._unmark_volatile(key)

    def _mark_volatile(self, key: str) -> None:
        """List + index, so a random pick and a removal are both O(1)."""
        if key in self._volatile_index:
            return
        self._volatile_index[key] = len(self._volatile)
        self._volatile.append(key)

    def _unmark_volatile(self, key: str) -> None:
        i = self._volatile_index.pop(key, None)
        if i is None:
            return
        last = len(self._volatile) - 1
        if i != last:
            moved = self._volatile[last]
            self._volatile[i] = moved
            self._volatile_index[moved] = i
        self._volatile.pop()

    def stats(self) -> str:
        return (f"keys={self.size()} live={self.live_size()} hits={self.hits} "
                f"misses={self.misses} expired-lazily={self.lazy_expired} "
                f"expired-actively={self.active_expired} evicted={self.evicted}")


def _glob(pattern: str, key: str) -> bool:
    """One-star glob, which is all keys(pattern) ever really needs in an interview."""
    if "*" not in pattern:
        return pattern == key
    head, _, tail = pattern.partition("*")
    return len(key) >= len(head) + len(tail) and key.startswith(head) and key.endswith(tail)


if __name__ == "__main__":
    clock = FakeClock(0)
    store = KeyValueStore(clock, max_entries=100)

    store.set_with_ttl("session:1", "abc", 5_000)
    store.set("user:7", "nina")                    # no deadline — permanent
    print("t=0     get(session:1) =", store.get("session:1") or "(nil)")
    print(f"t=0     size()={store.size()} live={store.live_size()}")

    clock.advance(6_000)                           # one second past the deadline
    print()
    print("t=6000  the key expired 1s ago. NOTHING RAN.")
    print(f"t=6000  size()={store.size()} live={store.live_size()}   <- still counted")
    print("t=6000  get(session:1) =", store.get("session:1") or "(nil)")
    print(f"t=6000  size()={store.size()}   <- the GET removed it (lazy expiry)")

    store.set_with_ttl("report:2019", "...", 1_000)    # a key nobody will ever read
    clock.advance(60_000)
    print()
    print(f"t=66000 cold key expired 59s ago, never read: size()={store.size()}")
    print(f"t=66000 sweeper reclaimed {store.sweep_once()} key(s), size()={store.size()}")

    store.set_with_ttl("cart:42", "[a]", 30_000)
    print()
    print("ttl(cart:42) =", store.ttl("cart:42"))
    print("ttl(user:7)  =", store.ttl("user:7"))
    print("ttl(nope)    =", store.ttl("nope"))

    store.set("cart:42", "[a,b]")                  # plain set — the TTL is gone
    print("after a plain set,   ttl(cart:42) =", store.ttl("cart:42"))
    store.expire("cart:42", 30_000)
    store.set("cart:42", "[a,b,c]", keep_ttl=True)
    print("with keep_ttl=True,  ttl(cart:42) =", store.ttl("cart:42"))

    print()
    print("incr(visits) x3      =", store.incr("visits"), store.incr("visits"), store.incr("visits"))
    print("cas(visits, 3 -> 10) =", store.compare_and_set("visits", "3", "10"))
    print("cas(visits, 3 -> 99) =", store.compare_and_set("visits", "3", "99"), " (stale)")

    print()
    print("keys('c*')           =", store.keys("c*"))
    print(store.stats())

# -------------------------- expected output --------------------------
# t=0     get(session:1) = abc
# t=0     size()=2 live=2
#
# t=6000  the key expired 1s ago. NOTHING RAN.
# t=6000  size()=2 live=1   <- still counted
# t=6000  get(session:1) = (nil)
# t=6000  size()=1   <- the GET removed it (lazy expiry)
#
# t=66000 cold key expired 59s ago, never read: size()=2
# t=66000 sweeper reclaimed 1 key(s), size()=1
#
# ttl(cart:42) = 30000ms left
# ttl(user:7)  = no expiry
# ttl(nope)    = no such key
# after a plain set,   ttl(cart:42) = no expiry
# with keep_ttl=True,  ttl(cart:42) = 30000ms left
#
# incr(visits) x3      = 1 2 3
# cas(visits, 3 -> 10) = True
# cas(visits, 3 -> 99) = False  (stale)
#
# keys('c*')           = ['cart:42']
# keys=3 live=3 hits=1 misses=1 expired-lazily=1 expired-actively=1 evicted=0
# ---------------------------------------------------------------------`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "key_value_store.cpp",
        code: `#include <algorithm>
#include <atomic>
#include <chrono>
#include <iostream>
#include <limits>
#include <optional>
#include <random>
#include <shared_mutex>
#include <string>
#include <unordered_map>
#include <vector>

static constexpr long long NEVER = std::numeric_limits<long long>::max();
static constexpr int SAMPLE_SIZE = 20;
static constexpr int MAX_SWEEP_ROUNDS = 16;   // so one sweep pass ALWAYS terminates

// Time behind an interface — the seam that makes TTL testable without sleeping.
struct Clock {
    virtual ~Clock() = default;
    virtual long long nowMillis() const = 0;
};

struct SystemClock : Clock {
    long long nowMillis() const override {
        using namespace std::chrono;
        // steady_clock, not system_clock: wall time can jump backwards and un-expire a key.
        return duration_cast<milliseconds>(steady_clock::now().time_since_epoch()).count();
    }
};

// A clock you move by hand. Every TTL check below runs instantly because of it.
struct FakeClock : Clock {
    long long now;
    explicit FakeClock(long long start) : now(start) {}
    long long nowMillis() const override { return now; }
    void advance(long long millis) { now += millis; }
};

// Holds an ABSOLUTE instant, never a countdown — nothing has to tick it.
struct Entry {
    std::string value;
    long long expiresAtMillis = NEVER;
    bool neverExpires() const { return expiresAtMillis == NEVER; }
    bool isExpired(long long now) const { return now >= expiresAtMillis; }
};

// Three genuinely different answers. One int meaning all three is a bad API.
struct TtlResult {
    enum class Kind { Remaining, NoExpiry, NoSuchKey };
    Kind kind;
    long long millis = 0;
    std::string str() const {
        if (kind == Kind::Remaining) return std::to_string(millis) + "ms left";
        if (kind == Kind::NoExpiry)  return "no expiry";
        return "no such key";
    }
};

class KeyValueStore {
public:
    KeyValueStore(Clock& clock, int maxEntries) : clock_(clock), maxEntries_(maxEntries), rng_(7) {}

    // ------------------------------------------------------------------ reads

    // A get really IS a read — until it finds an expired key, and then it must WRITE.
    // A shared_mutex cannot upgrade in place, so we drop the shared lock, take the
    // exclusive one, and RE-CHECK: another thread may have written a fresh value.
    std::optional<std::string> get(const std::string& key) {
        const long long now = clock_.nowMillis();
        {
            std::shared_lock<std::shared_mutex> readGuard(m_);
            auto it = map_.find(key);
            if (it == map_.end()) { ++misses_; return std::nullopt; }
            if (!it->second.isExpired(now)) { ++hits_; return it->second.value; }
        }
        std::unique_lock<std::shared_mutex> writeGuard(m_);
        auto it = map_.find(key);
        if (it != map_.end() && it->second.isExpired(clock_.nowMillis())) {
            removeLocked(key);
            ++lazyExpired_;
        }
        ++misses_;
        return std::nullopt;
    }

    bool exists(const std::string& key) { return get(key).has_value(); }   // SAME rule as get

    TtlResult ttl(const std::string& key) {
        const long long now = clock_.nowMillis();
        std::shared_lock<std::shared_mutex> readGuard(m_);
        auto it = map_.find(key);
        if (it == map_.end() || it->second.isExpired(now)) return {TtlResult::Kind::NoSuchKey};
        if (it->second.neverExpires())                     return {TtlResult::Kind::NoExpiry};
        return {TtlResult::Kind::Remaining, it->second.expiresAtMillis - now};
    }

    // PHYSICAL entry count — expired-but-not-yet-reclaimed keys included, on purpose.
    std::size_t size() {
        std::shared_lock<std::shared_mutex> readGuard(m_);
        return map_.size();
    }

    // What a caller could actually read right now. Usually smaller than size().
    std::size_t liveSize() {
        const long long now = clock_.nowMillis();
        std::shared_lock<std::shared_mutex> readGuard(m_);
        std::size_t n = 0;
        for (auto& kv : map_) if (!kv.second.isExpired(now)) ++n;
        return n;
    }

    // O(n) and it holds the lock the whole way. Exactly why SCAN with a cursor exists.
    std::vector<std::string> keys(const std::string& pattern) {
        const long long now = clock_.nowMillis();
        std::shared_lock<std::shared_mutex> readGuard(m_);
        std::vector<std::string> out;
        for (auto& kv : map_)
            if (!kv.second.isExpired(now) && glob(pattern, kv.first)) out.push_back(kv.first);
        std::sort(out.begin(), out.end());
        return out;
    }

    // ----------------------------------------------------------------- writes

    // A plain set CLEARS any existing deadline — the key becomes permanent.
    void set(const std::string& key, const std::string& value, bool keepTtl = false) {
        std::unique_lock<std::shared_mutex> writeGuard(m_);
        long long expiresAt = NEVER;
        auto it = map_.find(key);
        if (keepTtl && it != map_.end() && !it->second.isExpired(clock_.nowMillis()))
            expiresAt = it->second.expiresAtMillis;
        putLocked(key, Entry{value, expiresAt});
        evictIfNeededLocked();
    }

    void setWithTtl(const std::string& key, const std::string& value, long long ttlMillis) {
        std::unique_lock<std::shared_mutex> writeGuard(m_);
        // ONE addition, once, at write time. Nothing decrements anything, ever.
        putLocked(key, Entry{value, clock_.nowMillis() + ttlMillis});
        evictIfNeededLocked();
    }

    bool del(const std::string& key) {
        const long long now = clock_.nowMillis();
        std::unique_lock<std::shared_mutex> writeGuard(m_);
        auto it = map_.find(key);
        const bool wasLive = it != map_.end() && !it->second.isExpired(now);
        removeLocked(key);
        return wasLive;                       // never claim to have deleted a ghost
    }

    bool expire(const std::string& key, long long ttlMillis) {
        std::unique_lock<std::shared_mutex> writeGuard(m_);
        const long long now = clock_.nowMillis();
        auto it = map_.find(key);
        if (it == map_.end() || it->second.isExpired(now)) return false;
        putLocked(key, Entry{it->second.value, now + ttlMillis});
        return true;
    }

    bool persist(const std::string& key) {
        std::unique_lock<std::shared_mutex> writeGuard(m_);
        const long long now = clock_.nowMillis();
        auto it = map_.find(key);
        if (it == map_.end() || it->second.isExpired(now) || it->second.neverExpires()) return false;
        putLocked(key, Entry{it->second.value, NEVER});
        return true;
    }

    // --------------------------------------------- atomic read-modify-write

    // Two clients doing get-then-set would lose an increment. Inside the store, they cannot.
    long long incr(const std::string& key, long long delta) {
        std::unique_lock<std::shared_mutex> writeGuard(m_);
        const long long now = clock_.nowMillis();
        auto it = map_.find(key);
        const bool live = it != map_.end() && !it->second.isExpired(now);
        const long long next = (live ? std::stoll(it->second.value) : 0) + delta;
        putLocked(key, Entry{std::to_string(next), live ? it->second.expiresAtMillis : NEVER});
        return next;
    }

    // Optimistic concurrency: write only if nobody changed it since you read it.
    bool compareAndSet(const std::string& key, const std::string& expected, const std::string& next) {
        std::unique_lock<std::shared_mutex> writeGuard(m_);
        const long long now = clock_.nowMillis();
        auto it = map_.find(key);
        if (it == map_.end() || it->second.isExpired(now) || it->second.value != expected) return false;
        putLocked(key, Entry{next, it->second.expiresAtMillis});
        return true;
    }

    // ---------------------------------------------------------- active expiry

    // Draw 20 random keys THAT HAVE A TTL, delete the dead ones, and go again only while
    // the sample stays dense. Bounded work per pass — never a walk of the whole keyspace.
    int sweepOnce() {
        int total = 0;
        for (int round = 0; round < MAX_SWEEP_ROUNDS; ++round) {
            std::unique_lock<std::shared_mutex> writeGuard(m_);
            if (volatileKeys_.empty()) break;

            const int n = static_cast<int>(std::min<std::size_t>(SAMPLE_SIZE, volatileKeys_.size()));
            std::vector<std::string> sample;
            std::uniform_int_distribution<std::size_t> pick(0, volatileKeys_.size() - 1);
            for (int i = 0; i < n; ++i) sample.push_back(volatileKeys_[pick(rng_)]);

            const long long now = clock_.nowMillis();
            int expired = 0;
            for (auto& key : sample) {
                auto it = map_.find(key);
                if (it != map_.end() && it->second.isExpired(now)) { removeLocked(key); ++expired; }
            }
            total += expired;
            activeExpired_ += expired;

            if (expired * 4 <= n) break;      // 25% threshold, in integers
        }
        return total;
    }

    std::string stats() {
        return "keys=" + std::to_string(size()) + " live=" + std::to_string(liveSize())
             + " hits=" + std::to_string(hits_.load()) + " misses=" + std::to_string(misses_.load())
             + " expired-lazily=" + std::to_string(lazyExpired_.load())
             + " expired-actively=" + std::to_string(activeExpired_.load())
             + " evicted=" + std::to_string(evicted_.load());
    }

private:
    // Dying of SPACE, not of time. Policy: volatile-ttl — among keys that already have a
    // deadline, drop the one expiring soonest. allkeys-lru is a whole problem of its own.
    void evictIfNeededLocked() {
        while (static_cast<int>(map_.size()) > maxEntries_) {
            std::string victim;
            long long soonest = NEVER;
            for (auto& key : volatileKeys_) {
                auto it = map_.find(key);
                if (it != map_.end() && it->second.expiresAtMillis < soonest) {
                    soonest = it->second.expiresAtMillis;
                    victim = key;
                }
            }
            if (victim.empty()) victim = map_.begin()->first;
            removeLocked(victim);
            ++evicted_;
        }
    }

    void putLocked(const std::string& key, Entry e) {
        const bool permanent = e.neverExpires();
        map_[key] = std::move(e);
        if (permanent) unmarkVolatile(key); else markVolatile(key);
    }

    void removeLocked(const std::string& key) {
        map_.erase(key);
        unmarkVolatile(key);
    }

    // Vector + index, so a random pick and a removal are both O(1).
    void markVolatile(const std::string& key) {
        if (volatileIndex_.count(key)) return;
        volatileIndex_[key] = volatileKeys_.size();
        volatileKeys_.push_back(key);
    }

    void unmarkVolatile(const std::string& key) {
        auto it = volatileIndex_.find(key);
        if (it == volatileIndex_.end()) return;
        const std::size_t i = it->second, last = volatileKeys_.size() - 1;
        volatileIndex_.erase(it);
        if (i != last) {
            volatileKeys_[i] = volatileKeys_[last];
            volatileIndex_[volatileKeys_[i]] = i;
        }
        volatileKeys_.pop_back();
    }

    // One-star glob, which is all keys(pattern) ever really needs in an interview.
    static bool glob(const std::string& pattern, const std::string& key) {
        const auto star = pattern.find('*');
        if (star == std::string::npos) return pattern == key;
        const std::string head = pattern.substr(0, star), tail = pattern.substr(star + 1);
        return key.size() >= head.size() + tail.size()
            && key.compare(0, head.size(), head) == 0
            && key.compare(key.size() - tail.size(), tail.size(), tail) == 0;
    }

    std::unordered_map<std::string, Entry> map_;
    std::vector<std::string> volatileKeys_;                 // ONLY the keys with a deadline
    std::unordered_map<std::string, std::size_t> volatileIndex_;
    mutable std::shared_mutex m_;
    Clock& clock_;
    int maxEntries_;
    std::mt19937 rng_;
    std::atomic<long long> hits_{0}, misses_{0}, lazyExpired_{0}, activeExpired_{0}, evicted_{0};
};

static std::string orNil(const std::optional<std::string>& v) { return v ? *v : "(nil)"; }

static std::string joined(const std::vector<std::string>& v) {
    std::string out = "[";
    for (std::size_t i = 0; i < v.size(); ++i) { if (i) out += ", "; out += v[i]; }
    return out + "]";
}

int main() {
    FakeClock clock(0);
    KeyValueStore store(clock, 100);

    store.setWithTtl("session:1", "abc", 5000);
    store.set("user:7", "nina");                      // no deadline — permanent
    std::cout << "t=0     get(session:1) = " << orNil(store.get("session:1")) << "\\n";
    std::cout << "t=0     size()=" << store.size() << " live=" << store.liveSize() << "\\n";

    clock.advance(6000);                              // one second past the deadline
    std::cout << "\\nt=6000  the key expired 1s ago. NOTHING RAN.\\n";
    std::cout << "t=6000  size()=" << store.size() << " live=" << store.liveSize()
              << "   <- still counted\\n";
    std::cout << "t=6000  get(session:1) = " << orNil(store.get("session:1")) << "\\n";
    std::cout << "t=6000  size()=" << store.size() << "   <- the GET removed it (lazy expiry)\\n";

    store.setWithTtl("report:2019", "...", 1000);     // a key nobody will ever read
    clock.advance(60000);
    std::cout << "\\nt=66000 cold key expired 59s ago, never read: size()=" << store.size() << "\\n";
    const int reclaimed = store.sweepOnce();
    std::cout << "t=66000 sweeper reclaimed " << reclaimed << " key(s), size()=" << store.size() << "\\n";

    store.setWithTtl("cart:42", "[a]", 30000);
    std::cout << "\\nttl(cart:42) = " << store.ttl("cart:42").str() << "\\n";
    std::cout << "ttl(user:7)  = " << store.ttl("user:7").str() << "\\n";
    std::cout << "ttl(nope)    = " << store.ttl("nope").str() << "\\n";

    store.set("cart:42", "[a,b]");                    // plain set — the TTL is gone
    std::cout << "after a plain set,   ttl(cart:42) = " << store.ttl("cart:42").str() << "\\n";
    store.expire("cart:42", 30000);
    store.set("cart:42", "[a,b,c]", true);            // keepTtl
    std::cout << "with keepTtl=true,   ttl(cart:42) = " << store.ttl("cart:42").str() << "\\n";

    std::cout << "\\nincr(visits) x3      = " << store.incr("visits", 1);
    std::cout << ", " << store.incr("visits", 1);
    std::cout << ", " << store.incr("visits", 1) << "\\n";
    std::cout << "cas(visits, 3 -> 10) = " << std::boolalpha
              << store.compareAndSet("visits", "3", "10") << "\\n";
    std::cout << "cas(visits, 3 -> 99) = " << store.compareAndSet("visits", "3", "99") << "  (stale)\\n";

    std::cout << "\\nkeys(c*)             = " << joined(store.keys("c*")) << "\\n";
    std::cout << store.stats() << "\\n";
}

/* -------------------------- expected output --------------------------
t=0     get(session:1) = abc
t=0     size()=2 live=2

t=6000  the key expired 1s ago. NOTHING RAN.
t=6000  size()=2 live=1   <- still counted
t=6000  get(session:1) = (nil)
t=6000  size()=1   <- the GET removed it (lazy expiry)

t=66000 cold key expired 59s ago, never read: size()=2
t=66000 sweeper reclaimed 1 key(s), size()=1

ttl(cart:42) = 30000ms left
ttl(user:7)  = no expiry
ttl(nope)    = no such key
after a plain set,   ttl(cart:42) = no expiry
with keepTtl=true,   ttl(cart:42) = 30000ms left

incr(visits) x3      = 1, 2, 3
cas(visits, 3 -> 10) = true
cas(visits, 3 -> 99) = false  (stale)

keys(c*)             = [cart:42]
keys=3 live=3 hits=1 misses=1 expired-lazily=1 expired-actively=1 evicted=0
--------------------------------------------------------------------- */`,
      },
      {
        label: "Go",
        language: "go",
        filename: "key_value_store.go",
        code: `package main

import (
	"fmt"
	"math"
	"math/rand"
	"sort"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

const (
	never          = int64(math.MaxInt64) // a key with no deadline is just a very large number
	sampleSize     = 20
	maxSweepRounds = 16 // so one sweep pass ALWAYS terminates
)

// Clock puts time behind an interface — the seam that makes TTL testable without sleeping.
type Clock interface{ NowMillis() int64 }

type SystemClock struct{}

func (SystemClock) NowMillis() int64 { return time.Now().UnixMilli() }

// FakeClock is a clock you move by hand.
type FakeClock struct{ now int64 }

func NewFakeClock(start int64) *FakeClock  { return &FakeClock{now: start} }
func (c *FakeClock) NowMillis() int64      { return c.now }
func (c *FakeClock) Advance(millis int64)  { c.now += millis }

// Entry holds an ABSOLUTE instant, never a countdown — nothing has to tick it.
type Entry struct {
	Value           string
	ExpiresAtMillis int64
}

func (e Entry) NeverExpires() bool       { return e.ExpiresAtMillis == never }
func (e Entry) IsExpired(now int64) bool { return now >= e.ExpiresAtMillis }

// TtlResult has three genuinely different answers. One int meaning all three is a bad API.
type TtlKind int

const (
	TtlRemaining TtlKind = iota
	TtlNoExpiry
	TtlNoSuchKey
)

type TtlResult struct {
	Kind   TtlKind
	Millis int64
}

func (t TtlResult) String() string {
	switch t.Kind {
	case TtlRemaining:
		return strconv.FormatInt(t.Millis, 10) + "ms left"
	case TtlNoExpiry:
		return "no expiry"
	default:
		return "no such key"
	}
}

type KeyValueStore struct {
	mu    sync.RWMutex
	items map[string]Entry

	// ONLY the keys that have a deadline. The sweeper samples from here, never from the
	// whole keyspace, or almost every draw is wasted on permanent keys.
	volatileKeys  []string
	volatileIndex map[string]int

	clock      Clock
	maxEntries int
	rng        *rand.Rand

	hits, misses                          atomic.Int64
	lazyExpired, activeExpired, evictedCt atomic.Int64
}

func NewKeyValueStore(clock Clock, maxEntries int) *KeyValueStore {
	return &KeyValueStore{
		items:         make(map[string]Entry),
		volatileIndex: make(map[string]int),
		clock:         clock,
		maxEntries:    maxEntries,
		rng:           rand.New(rand.NewSource(7)),
	}
}

// ---------------------------------------------------------------------- reads

// Get really IS a read — until it finds an expired key, and then it must WRITE.
// Go's RWMutex cannot upgrade in place, so we release the read lock, take the write
// lock, and RE-CHECK: another goroutine may have written a fresh value in the gap.
func (s *KeyValueStore) Get(key string) (string, bool) {
	now := s.clock.NowMillis()

	s.mu.RLock()
	e, ok := s.items[key]
	s.mu.RUnlock()

	if !ok {
		s.misses.Add(1)
		return "", false
	}
	if !e.IsExpired(now) {
		s.hits.Add(1)
		return e.Value, true
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	if again, still := s.items[key]; still && again.IsExpired(s.clock.NowMillis()) {
		s.removeLocked(key)
		s.lazyExpired.Add(1)
	}
	s.misses.Add(1)
	return "", false
}

func (s *KeyValueStore) Exists(key string) bool { // SAME expiry rule as Get
	_, ok := s.Get(key)
	return ok
}

func (s *KeyValueStore) TTL(key string) TtlResult {
	now := s.clock.NowMillis()
	s.mu.RLock()
	defer s.mu.RUnlock()

	e, ok := s.items[key]
	if !ok || e.IsExpired(now) {
		return TtlResult{Kind: TtlNoSuchKey}
	}
	if e.NeverExpires() {
		return TtlResult{Kind: TtlNoExpiry}
	}
	return TtlResult{Kind: TtlRemaining, Millis: e.ExpiresAtMillis - now}
}

// Size is the PHYSICAL entry count — expired-but-not-yet-reclaimed keys included, on purpose.
func (s *KeyValueStore) Size() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.items)
}

// LiveSize is what a caller could actually read right now. Usually smaller than Size.
func (s *KeyValueStore) LiveSize() int {
	now := s.clock.NowMillis()
	s.mu.RLock()
	defer s.mu.RUnlock()
	n := 0
	for _, e := range s.items {
		if !e.IsExpired(now) {
			n++
		}
	}
	return n
}

// Keys is O(n) and holds the lock the whole way. Exactly why SCAN with a cursor exists.
func (s *KeyValueStore) Keys(pattern string) []string {
	now := s.clock.NowMillis()
	s.mu.RLock()
	defer s.mu.RUnlock()

	out := make([]string, 0, len(s.items))
	for k, e := range s.items {
		if !e.IsExpired(now) && glob(pattern, k) {
			out = append(out, k)
		}
	}
	sort.Strings(out)
	return out
}

// --------------------------------------------------------------------- writes

// Set with keepTtl=false CLEARS any existing deadline — the key becomes permanent.
func (s *KeyValueStore) Set(key, value string, keepTtl bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	expiresAt := never
	if old, ok := s.items[key]; keepTtl && ok && !old.IsExpired(s.clock.NowMillis()) {
		expiresAt = old.ExpiresAtMillis
	}
	s.putLocked(key, Entry{Value: value, ExpiresAtMillis: expiresAt})
	s.evictIfNeededLocked()
}

func (s *KeyValueStore) SetWithTTL(key, value string, ttlMillis int64) {
	s.mu.Lock()
	defer s.mu.Unlock()
	// ONE addition, once, at write time. Nothing decrements anything, ever.
	s.putLocked(key, Entry{Value: value, ExpiresAtMillis: s.clock.NowMillis() + ttlMillis})
	s.evictIfNeededLocked()
}

func (s *KeyValueStore) Delete(key string) bool {
	now := s.clock.NowMillis()
	s.mu.Lock()
	defer s.mu.Unlock()

	e, ok := s.items[key]
	s.removeLocked(key)
	return ok && !e.IsExpired(now) // never claim to have deleted a ghost
}

func (s *KeyValueStore) Expire(key string, ttlMillis int64) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := s.clock.NowMillis()
	e, ok := s.items[key]
	if !ok || e.IsExpired(now) {
		return false
	}
	s.putLocked(key, Entry{Value: e.Value, ExpiresAtMillis: now + ttlMillis})
	return true
}

func (s *KeyValueStore) Persist(key string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := s.clock.NowMillis()
	e, ok := s.items[key]
	if !ok || e.IsExpired(now) || e.NeverExpires() {
		return false
	}
	s.putLocked(key, Entry{Value: e.Value, ExpiresAtMillis: never})
	return true
}

// ------------------------------------------------ atomic read-modify-write

// Incr: two clients doing Get-then-Set would lose an increment. Inside the store they cannot.
func (s *KeyValueStore) Incr(key string, delta int64) int64 {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := s.clock.NowMillis()
	e, ok := s.items[key]
	live := ok && !e.IsExpired(now)

	current := int64(0) // a missing key counts as zero
	if live {
		current, _ = strconv.ParseInt(e.Value, 10, 64)
	}
	next := current + delta

	expiresAt := never
	if live {
		expiresAt = e.ExpiresAtMillis
	}
	s.putLocked(key, Entry{Value: strconv.FormatInt(next, 10), ExpiresAtMillis: expiresAt})
	return next
}

// CompareAndSet is optimistic concurrency: write only if nobody changed it since you read it.
func (s *KeyValueStore) CompareAndSet(key, expected, next string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := s.clock.NowMillis()
	e, ok := s.items[key]
	if !ok || e.IsExpired(now) || e.Value != expected {
		return false
	}
	s.putLocked(key, Entry{Value: next, ExpiresAtMillis: e.ExpiresAtMillis})
	return true
}

// ---------------------------------------------------------------- active expiry

// SweepOnce draws 20 random keys THAT HAVE A TTL, deletes the dead ones, and goes again
// only while the sample stays dense. Bounded work per pass — never a full keyspace walk.
func (s *KeyValueStore) SweepOnce() int {
	total := 0
	for round := 0; round < maxSweepRounds; round++ {
		s.mu.Lock()
		if len(s.volatileKeys) == 0 {
			s.mu.Unlock()
			break
		}

		n := sampleSize
		if len(s.volatileKeys) < n {
			n = len(s.volatileKeys)
		}
		sample := make([]string, 0, n)
		for i := 0; i < n; i++ {
			sample = append(sample, s.volatileKeys[s.rng.Intn(len(s.volatileKeys))])
		}

		now := s.clock.NowMillis()
		expired := 0
		for _, key := range sample {
			if e, ok := s.items[key]; ok && e.IsExpired(now) {
				s.removeLocked(key)
				expired++
			}
		}
		s.mu.Unlock()

		total += expired
		s.activeExpired.Add(int64(expired))

		if expired*4 <= n { // the 25% threshold, in integers
			break
		}
	}
	return total
}

// -------------------------------------------------------------------- eviction

// Dying of SPACE, not of time. Policy: volatile-ttl — among the keys that already have a
// deadline, drop the one expiring soonest. allkeys-lru is a whole problem of its own.
func (s *KeyValueStore) evictIfNeededLocked() {
	for len(s.items) > s.maxEntries {
		victim, soonest := "", never
		for _, key := range s.volatileKeys {
			if e, ok := s.items[key]; ok && e.ExpiresAtMillis < soonest {
				soonest, victim = e.ExpiresAtMillis, key
			}
		}
		if victim == "" {
			for k := range s.items {
				victim = k
				break
			}
		}
		s.removeLocked(victim)
		s.evictedCt.Add(1)
	}
}

// ------------------------------------------------------------------- internals

func (s *KeyValueStore) putLocked(key string, e Entry) {
	s.items[key] = e
	if e.NeverExpires() {
		s.unmarkVolatile(key)
	} else {
		s.markVolatile(key)
	}
}

func (s *KeyValueStore) removeLocked(key string) {
	delete(s.items, key)
	s.unmarkVolatile(key)
}

// Slice + index, so a random pick and a removal are both O(1).
func (s *KeyValueStore) markVolatile(key string) {
	if _, ok := s.volatileIndex[key]; ok {
		return
	}
	s.volatileIndex[key] = len(s.volatileKeys)
	s.volatileKeys = append(s.volatileKeys, key)
}

func (s *KeyValueStore) unmarkVolatile(key string) {
	i, ok := s.volatileIndex[key]
	if !ok {
		return
	}
	delete(s.volatileIndex, key)
	last := len(s.volatileKeys) - 1
	if i != last {
		s.volatileKeys[i] = s.volatileKeys[last]
		s.volatileIndex[s.volatileKeys[i]] = i
	}
	s.volatileKeys = s.volatileKeys[:last]
}

// glob is a one-star matcher, all Keys(pattern) ever really needs in an interview.
func glob(pattern, key string) bool {
	star := strings.Index(pattern, "*")
	if star < 0 {
		return pattern == key
	}
	head, tail := pattern[:star], pattern[star+1:]
	return len(key) >= len(head)+len(tail) &&
		strings.HasPrefix(key, head) && strings.HasSuffix(key, tail)
}

func (s *KeyValueStore) Stats() string {
	return fmt.Sprintf("keys=%d live=%d hits=%d misses=%d expired-lazily=%d expired-actively=%d evicted=%d",
		s.Size(), s.LiveSize(), s.hits.Load(), s.misses.Load(),
		s.lazyExpired.Load(), s.activeExpired.Load(), s.evictedCt.Load())
}

func orNil(v string, ok bool) string {
	if !ok {
		return "(nil)"
	}
	return v
}

func main() {
	clock := NewFakeClock(0)
	store := NewKeyValueStore(clock, 100)

	store.SetWithTTL("session:1", "abc", 5000)
	store.Set("user:7", "nina", false) // no deadline — permanent
	fmt.Println("t=0     get(session:1) =", orNil(store.Get("session:1")))
	fmt.Printf("t=0     size()=%d live=%d\\n", store.Size(), store.LiveSize())

	clock.Advance(6000) // one second past the deadline
	fmt.Println()
	fmt.Println("t=6000  the key expired 1s ago. NOTHING RAN.")
	fmt.Printf("t=6000  size()=%d live=%d   <- still counted\\n", store.Size(), store.LiveSize())
	fmt.Println("t=6000  get(session:1) =", orNil(store.Get("session:1")))
	fmt.Printf("t=6000  size()=%d   <- the GET removed it (lazy expiry)\\n", store.Size())

	store.SetWithTTL("report:2019", "...", 1000) // a key nobody will ever read
	clock.Advance(60000)
	fmt.Println()
	fmt.Printf("t=66000 cold key expired 59s ago, never read: size()=%d\\n", store.Size())
	fmt.Printf("t=66000 sweeper reclaimed %d key(s), size()=%d\\n", store.SweepOnce(), store.Size())

	store.SetWithTTL("cart:42", "[a]", 30000)
	fmt.Println()
	fmt.Println("ttl(cart:42) =", store.TTL("cart:42"))
	fmt.Println("ttl(user:7)  =", store.TTL("user:7"))
	fmt.Println("ttl(nope)    =", store.TTL("nope"))

	store.Set("cart:42", "[a,b]", false) // plain set — the TTL is gone
	fmt.Println("after a plain set,   ttl(cart:42) =", store.TTL("cart:42"))
	store.Expire("cart:42", 30000)
	store.Set("cart:42", "[a,b,c]", true) // keepTtl
	fmt.Println("with keepTtl=true,   ttl(cart:42) =", store.TTL("cart:42"))

	fmt.Println()
	fmt.Println("incr(visits) x3      =", store.Incr("visits", 1), store.Incr("visits", 1), store.Incr("visits", 1))
	fmt.Println("cas(visits, 3 -> 10) =", store.CompareAndSet("visits", "3", "10"))
	fmt.Println("cas(visits, 3 -> 99) =", store.CompareAndSet("visits", "3", "99"), " (stale)")

	fmt.Println()
	fmt.Println("keys(c*)             =", store.Keys("c*"))
	fmt.Println(store.Stats())
}

/* -------------------------- expected output --------------------------
t=0     get(session:1) = abc
t=0     size()=2 live=2

t=6000  the key expired 1s ago. NOTHING RAN.
t=6000  size()=2 live=1   <- still counted
t=6000  get(session:1) = (nil)
t=6000  size()=1   <- the GET removed it (lazy expiry)

t=66000 cold key expired 59s ago, never read: size()=2
t=66000 sweeper reclaimed 1 key(s), size()=1

ttl(cart:42) = 30000ms left
ttl(user:7)  = no expiry
ttl(nope)    = no such key
after a plain set,   ttl(cart:42) = no expiry
with keepTtl=true,   ttl(cart:42) = 30000ms left

incr(visits) x3      = 1 2 3
cas(visits, 3 -> 10) = true
cas(visits, 3 -> 99) = false  (stale)

keys(c*)             = [cart:42]
keys=3 live=3 hits=1 misses=1 expired-lazily=1 expired-actively=1 evicted=0
--------------------------------------------------------------------- */`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Strip the keys and values away and what is left is: **state with a deadline, reclaimed lazily on access and swept probabilistically in the background.** Once you have seen it here you start seeing it everywhere, and the same two questions apply every time — *who checks the deadline?* and *who reclaims the ones nobody checks?*",
      },
      {
        type: "ul",
        items: [
          "**Session stores.** A logged-in session is exactly this: a value with a sliding deadline. The *only* thing that logs a user out is a request arriving and finding the deadline passed.",
          "**Idempotency keys.** *“I have seen this request id before”* is a set with a TTL. The lazy check happens on the next duplicate; the sweeper is what stops the set growing without limit.",
          "**Rate-limiter counters.** A per-user counter with a window is a key with a TTL. There is no timer resetting anybody's quota — the next request notices the window rolled over.",
          "**DNS and HTTP caches.** A record carries a TTL and the resolver checks it on lookup. Nothing purges your DNS cache at the instant a record expires.",
          "**Feature-flag and config caches.** A value with a refresh deadline, checked on read. Same design, smaller vocabulary.",
          "**Lock leases.** A distributed lock with a TTL is a key that dies on its own so a crashed holder cannot block everybody forever — and *“expired but not yet reclaimed”* is precisely the dangerous window you have to reason about.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The two-sentence version to say out loud",
        text: "*“A TTL is an absolute instant stored on the entry, so no timers exist. Reads check that instant and delete on the way past, and a background sampler catches the keys nobody reads — which means a key can be logically gone while still occupying memory, and that is a deliberate trade, not a bug.”*",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When expiry must be exact to the millisecond.** Nothing here fires at the deadline. If a key expiring *must* trigger an action at that instant — a scheduled job, a billing event — you need a real timer wheel or a priority queue of deadlines, and that is a different design with a different cost.",
          "**When the store spans machines.** Your `ReadWriteLock` protects one process. Across a cluster, TTLs depend on clocks that drift, `keys(pattern)` becomes a fan-out, and *“delete if expired”* becomes a distributed agreement problem.",
          "**When the data must not be lost.** In-memory means gone on restart, and both durability mechanisms have a loss window you have to state as a number. If the answer must be zero, you are designing a database, not a cache.",
          "**When values get large and structured.** The design does not change, but the *costs* do: eviction should count bytes rather than entries, and a single huge value can blow the memory bound on its own.",
          "**When the read/write mix flips.** The read-write lock pays for itself only while reads dominate. A write-heavy store gets everything serialised anyway, and you should shard from the start — or reach for a lock-free map.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Expired is not deleted.** A key stops being *readable* at its expiry instant and stops being *resident* only when a reader or a sweeper touches it. Every design decision in this problem — the absolute instant, the lazy check, the sampling loop, the honest `size()` — exists because of the gap between those two moments.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Storing an absolute expiresAt costs eight bytes per key and zero running machinery — a million keys still means zero timers and zero background ticking.",
        "Lazy expiry makes it impossible for a caller to read a stale value, and it costs one integer comparison on a lookup you were already doing.",
        "The sampling sweeper bounds its own work: the CPU it spends tracks the amount of garbage it keeps finding, not the number of keys in the store.",
        "A ReadWriteLock genuinely pays here, because in a plain key-value store a get really is a read — unlike a recency-ordered cache, where every get mutates.",
        "Injecting a Clock turns every TTL test into three fast, deterministic lines instead of a suite full of Thread.sleep.",
      ],
      cons: [
        "Expired keys keep holding memory until something looks at them, so size() and real memory usage can disagree for an unbounded stretch of time.",
        "The sweeper's guarantee is only probabilistic — roughly a quarter of the keys with a TTL may be expired-but-present at any instant, and there is no way to make it zero cheaply.",
        "The lazy delete forces a read to become a write, and since read-write locks cannot upgrade in place, that path needs a release, a re-acquire and a re-check that are easy to get subtly wrong.",
        "A plain set clearing the TTL is a genuine footgun — it matches Redis, and it has silently made session keys immortal in real systems.",
        "keys(pattern) is O(n) and blocks every other operation while it runs, which is why production systems need a second, cursor-based API you have not built.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "Redis — EXPIRE, and “how Redis expires keys”",
        href: "https://redis.io/docs/latest/commands/expire/",
        kind: "docs",
        note: "The section at the bottom describes the exact lazy-plus-sampled algorithm this lesson is built on, including the 20-key sample and the 25% threshold.",
      },
      {
        label: "Redis — key eviction and the maxmemory policies",
        href: "https://redis.io/docs/latest/develop/reference/eviction/",
        kind: "docs",
        note: "noeviction, allkeys-lru, volatile-ttl and the rest, with the crucial framing that eviction is about space while expiry is about time.",
      },
      {
        label: "Redis — SCAN, and why KEYS is dangerous",
        href: "https://redis.io/docs/latest/commands/scan/",
        kind: "docs",
        note: "The cursor contract, and the guarantees a partial scan can and cannot give you. Read this before you claim keys(pattern) is fine.",
      },
      {
        label: "Redis persistence — AOF versus RDB snapshots",
        href: "https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/",
        kind: "docs",
        note: "The append-only log and the periodic snapshot, side by side, with the fsync policies and the exact size of the window you can lose.",
      },
      {
        label: "Memcached — Overview (the lazy-expiry design)",
        href: "https://github.com/memcached/memcached/wiki/Overview",
        kind: "article",
        note: "The other end of the spectrum: no active expirer at all, expiry checked on fetch, and memory reclaimed by the slab allocator instead. A useful contrast.",
      },
      {
        label: "ReentrantReadWriteLock — Java API docs",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/ReentrantReadWriteLock.html",
        kind: "docs",
        note: "Read the “Lock downgrading” note in particular — it states plainly that a read lock cannot be upgraded to a write lock, which is why the lazy delete needs a re-check.",
      },
      {
        label: "Designing Data-Intensive Applications — Martin Kleppmann",
        kind: "book",
        note: "Chapter 3 on log-structured storage and compaction is the long version of this lesson's durability section, and chapter 8 explains why clocks make distributed TTLs hard.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "key-value-store-q1",
        question: "How should a key's TTL be stored?",
        options: [
          { id: "a", label: "As an absolute expiresAt instant computed once at write time, checked with a comparison on every read." },
          { id: "b", label: "As a secondsLeft counter that a background thread decrements once a second." },
          { id: "c", label: "As a scheduled timer per key that fires and deletes the key at the right moment." },
          { id: "d", label: "As a sorted list of keys ordered by expiry, walked from the front once a second." },
        ],
        correctOptionId: "a",
        explanation:
          "An instant needs no maintenance at all: one addition at write time, one comparison at read time. (c) is the tempting answer because it is the most literal translation of “expire in 5 seconds” — and a million keys would mean a million timers, plus a cancellation on every overwrite. (d) is closer to reasonable and is essentially a timer wheel, but it makes every write O(log n) to buy precision you were never asked for.",
      },
      {
        id: "key-value-store-q2",
        question: "A key is set at t=0 with a 5-second TTL. At t=8 nobody has touched it. What does `size()` return?",
        options: [
          { id: "a", label: "1 — the key is unreadable but still physically in the map, because nothing runs at the expiry instant." },
          { id: "b", label: "0 — the key was removed automatically when its TTL elapsed." },
          { id: "c", label: "0 — expired keys are excluded from the count even though they are still stored." },
          { id: "d", label: "It is undefined and depends on the garbage collector." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the whole lesson in one question. Nothing fires at t=5, so the entry is still there at t=8, still counted, still holding memory. (c) is a defensible *design*, and some stores do filter — but then size() becomes O(n), and you have hidden the very thing an operator needs to see. Reporting the physical count honestly and exposing a separate liveSize() is the better answer.",
      },
      {
        id: "key-value-store-q3",
        question: "What is the specific failure mode of a store that only does lazy expiry?",
        options: [
          { id: "a", label: "Keys that are never read again after expiring are never reclaimed, so memory leaks in proportion to the cold part of the workload." },
          { id: "b", label: "Callers can read stale values, because expiry is only checked occasionally." },
          { id: "c", label: "Reads become O(n) because each one has to scan for expired keys." },
          { id: "d", label: "It cannot support keys without a TTL." },
        ],
        correctOptionId: "a",
        explanation:
          "Lazy expiry is perfectly *correct* — no caller ever sees a stale value, which rules out (b). Its problem is purely about memory: the cleanup is triggered by reads, so a key nobody reads is never cleaned. That is exactly why an active sweeper exists, and why the prototype's leaked counter climbs until you press Sweep.",
      },
      {
        id: "key-value-store-q4",
        question: "Why does a background expirer sample around 20 random keys instead of scanning them all?",
        options: [
          { id: "a", label: "So the work per pass is bounded and proportional to the garbage found, rather than to the size of the keyspace." },
          { id: "b", label: "Because random access to a hash map is faster than iterating it." },
          { id: "c", label: "Because sampling guarantees that no expired key ever survives a pass." },
          { id: "d", label: "Because scanning would need a write lock and sampling does not." },
        ],
        correctOptionId: "a",
        explanation:
          "A full scan is O(n) and stalls the store, over and over, to find the few keys that died since last time. Sampling gives a *probabilistic* bound instead — repeat while more than 25% of the sample is dead, and at any moment only a small fraction of the keys with a TTL are expired-but-present. (c) inverts the guarantee: sampling explicitly gives up completeness in exchange for bounded cost.",
      },
      {
        id: "key-value-store-q5",
        question: "What must `ttl(key)` be able to express?",
        options: [
          { id: "a", label: "Three distinguishable states: the remaining time, “exists but has no expiry”, and “no such key”." },
          { id: "b", label: "Two states: the remaining time, or -1 when the key cannot expire or does not exist." },
          { id: "c", label: "Only the remaining milliseconds; the caller can use exists() for the rest." },
          { id: "d", label: "The absolute expiresAt instant, so the caller can compare it to its own clock." },
        ],
        correctOptionId: "a",
        explanation:
          "“This key is permanent” and “this key is gone” are completely different facts, and a caller that cannot tell them apart writes code like `if (ttl(k) == -1) recreate(k)` — which happily overwrites a perfectly good permanent key. (d) is worse than it looks: handing out an absolute instant invites the caller to compare it against a *different* clock than the store used.",
      },
      {
        id: "key-value-store-q6",
        question: "A key has 20 minutes left on its TTL. A caller does a plain `set(key, newValue)`. What happens to the deadline?",
        options: [
          { id: "a", label: "It is cleared — the key becomes permanent, unless the API offers an explicit keepTtl option." },
          { id: "b", label: "It is preserved, because set only changes the value." },
          { id: "c", label: "It is reset to a fresh 20 minutes." },
          { id: "d", label: "The set is rejected, because a key with a TTL is immutable until it expires." },
        ],
        correctOptionId: "a",
        explanation:
          "A write replaces the entry, and the entry is what carried the deadline. Redis behaves exactly this way, which is why it later added KEEPTTL. (b) is the tempting answer because it feels like the kinder default — and it is precisely the assumption that turns a 30-minute session into an immortal one when unrelated code refreshes the value.",
      },
      {
        id: "key-value-store-q7",
        question: "Why does a ReadWriteLock help in a plain key-value store, when it does not help in an LRU cache — and what is the catch?",
        options: [
          { id: "a", label: "Here a get really is a read, so many gets run together — except when it finds an expired key, because that delete is a write and needs a release, a re-acquire and a re-check." },
          { id: "b", label: "It does not help here either; every operation in a key-value store mutates state." },
          { id: "c", label: "It helps because read locks can be upgraded to write locks in place when a key turns out to be expired." },
          { id: "d", label: "It helps because expired keys can safely be removed while holding only the read lock." },
        ],
        correctOptionId: "a",
        explanation:
          "In an LRU cache a get reorders the recency list, so it is a write in disguise and a read lock buys nothing. Here a get is a genuine read — until the lazy delete. (c) is the trap: Java and Go read-write locks cannot upgrade, so you release and re-acquire, and in that gap another thread may have written a fresh value — which is exactly why the re-check is mandatory.",
      },
      {
        id: "key-value-store-q8",
        question: "The store hits its memory limit. Every key in it is alive and none has a TTL. What should happen?",
        options: [
          { id: "a", label: "The eviction policy decides — noeviction rejects the write, allkeys-lru or random drops a live key; expiry has nothing to offer here." },
          { id: "b", label: "The store deletes the expired keys to make room." },
          { id: "c", label: "The store shortens every key's TTL so more of them expire sooner." },
          { id: "d", label: "The store starts rejecting reads until memory frees up." },
        ],
        correctOptionId: "a",
        explanation:
          "Eviction and expiry are different mechanisms with different triggers: one is about space, the other about time. (b) is the answer most candidates give, and this question is built to expose it — there are no expired keys here, so a store that only knows how to delete expired keys has nothing to do and simply fails. Choosing between refusing the write and dropping live data is a policy decision, and naming it as such is the point.",
      },
    ],
  },
};
