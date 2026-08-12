import type { RoadmapLesson } from "@/lib/content/types";

export const rateLimiter: RoadmapLesson = {
  title: "Rate Limiter",
  oneLiner:
    "The interface is two lines: `boolean allow(String key)`. That is the easy part, and you should say so out loud. The whole round is about **which of five algorithms sits behind it** — and about one bug, at the seam between two windows, that lets **double the limit** through in two seconds.",
  difficulty: "intermediate",
  estimatedTime: "30 min",
  prototypePath: "/prototypes/lld/rate-limiter.html",
  content: {
    prototypeCaption:
      "One limiter, five algorithms, a live clock. Pick **🪟 Fixed** and press **💥 Boundary burst** — it jumps the clock to the last second of a window, fires 5 requests, steps 2 seconds into the next window, fires 5 more. **All ten go green** and the red `over-limit` stat jumps to **5**. Now press **📜 Sliding log** and press **💥 Boundary burst** again: the second batch is entirely red and `over-limit` stays at **0**. Then try **🪣 Token bucket** with **🔥 Burst of 10** and **⏩ +5s** — tokens reappear the instant you move the clock, with no timer running anywhere.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design a rate limiter.”* Most candidates start drawing classes. Do not. Write the interface first, in one line, and then say the sentence that wins you the next forty minutes: *“the interface is trivial — the whole design is which algorithm goes behind it.”*",
      },
      {
        type: "code",
        language: "java",
        filename: "the entire public surface",
        code: `interface RateLimiter {
    boolean allow(String key);   // "user-42" -> true (serve it) or false (429)
}`,
      },
      {
        type: "p",
        text: "That is it. A caller asks *“may this request through?”* and gets a yes or a no. Everything the interviewer is grading is on the other side of that one method: how you count, what you remember per key, what happens when the clock rolls over a window edge, and what two threads do when they both look at the last token.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Three clients, each identified by a key, send requests into a single RateLimiter box that sits in front of the API. The box exposes one method, allow of key and now, and holds one of five strategies plus one bucket per key. Allowed requests continue to the API handler and return 200 OK. Rejected requests return 429 Too Many Requests with a Retry-After header.">
  <defs>
    <marker id="rl-in" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="rl-ok" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="rl-no" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="16" y="44" font-size="10.5" fill="#fb863a">Client  →  the KEY</text>
  <rect x="16" y="60" width="122" height="38" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="28" y="84" font-size="9.5" fill="#e8e4dc">client · user-42</text>
  <rect x="16" y="120" width="122" height="38" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="28" y="144" font-size="9.5" fill="#e8e4dc">client · user-7</text>
  <rect x="16" y="180" width="122" height="38" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="28" y="204" font-size="9.5" fill="#e8e4dc">client · user-99</text>

  <line x1="140" y1="79" x2="222" y2="102" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#rl-in)"/>
  <line x1="140" y1="139" x2="222" y2="139" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#rl-in)"/>
  <line x1="140" y1="199" x2="222" y2="176" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#rl-in)"/>

  <rect x="226" y="30" width="190" height="232" rx="10" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="240" y="52" font-size="12" fill="#fb863a">RateLimiter</text>
  <text x="240" y="68" font-size="9" fill="#6b7280">«interface» — 1 method</text>
  <line x1="226" y1="78" x2="416" y2="78" stroke="#2d333d"/>
  <text x="240" y="97" font-size="10" fill="#e8e4dc">allow(key, now)</text>
  <line x1="226" y1="108" x2="416" y2="108" stroke="#2d333d"/>
  <text x="240" y="127" font-size="9" fill="#9099a8">one of five strategies:</text>
  <text x="248" y="145" font-size="9" fill="#e8e4dc">· fixed window</text>
  <text x="248" y="161" font-size="9" fill="#e8e4dc">· sliding window log</text>
  <text x="248" y="177" font-size="9" fill="#e8e4dc">· sliding window counter</text>
  <text x="248" y="193" font-size="9" fill="#e8e4dc">· token bucket</text>
  <text x="248" y="209" font-size="9" fill="#e8e4dc">· leaky bucket</text>
  <line x1="226" y1="222" x2="416" y2="222" stroke="#2d333d"/>
  <text x="240" y="241" font-size="9" fill="#fb863a">Map&lt;key, Bucket&gt;</text>
  <text x="240" y="255" font-size="8.5" fill="#6b7280">one small state object per key</text>

  <line x1="418" y1="112" x2="556" y2="112" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#rl-ok)"/>
  <text x="440" y="104" font-size="9.5" fill="#5cc66f">true</text>
  <rect x="560" y="88" width="146" height="60" rx="8" fill="#14161a" stroke="#5cc66f"/>
  <text x="574" y="112" font-size="11" fill="#5cc66f">API handler</text>
  <text x="574" y="132" font-size="9" fill="#9099a8">200 OK · the real work</text>

  <line x1="418" y1="208" x2="556" y2="208" stroke="#f06868" stroke-width="1.3" marker-end="url(#rl-no)"/>
  <text x="440" y="200" font-size="9.5" fill="#f06868">false</text>
  <rect x="560" y="176" width="146" height="76" rx="8" fill="#14161a" stroke="#f06868"/>
  <text x="574" y="200" font-size="12" fill="#f06868">429</text>
  <text x="574" y="218" font-size="9" fill="#f06868">Too Many Requests</text>
  <text x="574" y="234" font-size="8.5" fill="#9099a8">Retry-After: 12</text>
  <text x="574" y="247" font-size="8.5" fill="#9099a8">X-RateLimit-Remaining: 0</text>

  <text x="16" y="288" font-size="10" fill="#9099a8">the box has one method and no interesting API — every hard question is about what is inside it</text>
</svg>`,
        caption:
          "Look at how small the interface is compared to the box it hides. **That asymmetry is the problem statement.** Everything you will be asked about lives behind `allow()`.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **key** identifies who is being limited — a user, an API token, an IP. The limiter keeps one small **state object per key** and, on every call, looks at the current time and decides yes or no. The five algorithms differ only in *what that state object holds* and *how the arithmetic uses the clock*.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Do you know the boundary bug?** Fixed window lets **2× the limit** through at a window edge. If you cannot draw that on a timeline, nothing else you say counts.",
          "**Can you name and compare all five algorithms?** Memory per key, accuracy, bursts, smoothing. The interviewer is listening for the comparison, not for one implementation.",
          "**Is the refill lazy?** A token bucket needs **no background thread**. Compute what accrued since `lastRefillTime` on the way in. Spawning a timer is an instant mark against you.",
          "**Is the clock injected?** `allow(key, now)` or a `Clock` you can fake. Otherwise every test has to sleep for a real minute, and you will not write one in the round.",
          "**Is it correct with two threads on the same key?** Both read *1 token left*, both take one. Same check-then-act race as [[coffee-machine]] — and the fix is a lock on the **bucket**, not on the limiter.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 236" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A scope board. In scope: one allow method returning a boolean, per-key limits, a pluggable algorithm, an injected clock, thread safety on one key, and configurable limit and window. Out of scope: authentication, who the key belongs to, distributed coordination, persistence, the HTTP layer, and dynamic per-tier config loading, each with a one-line reason.">
  <text x="16" y="24" font-size="10.5" fill="#5cc66f">✓ IN SCOPE — build these in 60 minutes</text>
  <rect x="16" y="34" width="326" height="186" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="32" y="58" font-size="9.5" fill="#e8e4dc">allow(key) → boolean</text>
  <text x="32" y="80" font-size="9.5" fill="#e8e4dc">a limit per key, not one global count</text>
  <text x="32" y="102" font-size="9.5" fill="#e8e4dc">the algorithm behind an interface</text>
  <text x="32" y="124" font-size="9.5" fill="#e8e4dc">an injected Clock (so it is testable)</text>
  <text x="32" y="146" font-size="9.5" fill="#e8e4dc">thread safety for one key</text>
  <text x="32" y="168" font-size="9.5" fill="#e8e4dc">limit and window as configuration</text>
  <text x="32" y="196" font-size="9" fill="#5cc66f">every one of these is 10 lines or fewer</text>
  <text x="32" y="212" font-size="9" fill="#9099a8">the value is in the choices, not the volume</text>

  <text x="358" y="24" font-size="10.5" fill="#f06868">✗ OUT OF SCOPE — say it in one sentence each</text>
  <rect x="358" y="34" width="326" height="186" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="374" y="58" font-size="9.5" fill="#9099a8">auth — the key arrives already resolved</text>
  <text x="374" y="80" font-size="9.5" fill="#9099a8">the HTTP layer — a filter calls allow()</text>
  <text x="374" y="102" font-size="9.5" fill="#9099a8">persistence — limits are short-lived</text>
  <text x="374" y="124" font-size="9.5" fill="#9099a8">distributed counters — mention Redis, do</text>
  <text x="382" y="138" font-size="9.5" fill="#9099a8">not build it</text>
  <text x="374" y="160" font-size="9.5" fill="#9099a8">tiers and per-endpoint limits — config</text>
  <text x="374" y="188" font-size="9" fill="#f06868">naming these OUT is worth marks</text>
  <text x="374" y="204" font-size="9" fill="#9099a8">building them costs you the algorithms,</text>
  <text x="374" y="218" font-size="9" fill="#9099a8">which is the only thing being graded</text>
</svg>`,
        caption:
          "The trap in this problem is **breadth**. Rate limiting touches HTTP, auth, config and Redis, and every one of those is a rabbit hole. Say the words, draw the line, go back to the algorithms.",
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      { type: "h", text: "Step 1 · Clarify — 4 minutes" },
      {
        type: "ul",
        items: [
          "**What is the key?** — per user, per API token, per IP? Say *“the caller hands me a key; I do not care what it means.”* That one sentence removes auth from the round.",
          "**What is the limit?** — *“100 requests per minute”* is the shape. Confirm it is `count per window`, both configurable, both injected.",
          "**Do bursts matter?** — the question that picks your algorithm. If a client may fire 20 at once and then go quiet, you want a **token bucket**. If downstream needs a steady drip, you want a **leaky bucket**.",
          "**Reject or wait?** — say reject, and return 429. Blocking the caller turns a limiter into a queue and changes the whole design.",
          "**One process or many?** — assume one for the build, and raise distributed yourself at minute 50. Building it costs you the algorithms.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Do not spend ten minutes on the API",
        text: "There is nothing to design in `boolean allow(String key)`. Candidates who draw a `RateLimitRequest` class, a `RateLimitResponse` class and a builder for both have spent a quarter of the round on the one part nobody is grading. Write the interface in 30 seconds, then spend your time on the timeline below.",
      },

      { type: "h", text: "Step 2 · The boundary bug — draw this before you write any code" },
      {
        type: "p",
        text: "Limit: **5 requests per minute**. A client sends five requests at **12:00:59** and five more at **12:01:01**. Ask a fixed-window counter about either minute and it answers honestly: *five, exactly at the limit, both legal.* And yet **ten requests went through in two seconds** — double the limit, inside a thirtieth of the window.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 268" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A time ruler from 12:00:00 to 12:02:00 with a dashed red line at the window boundary at 12:01:00. Five green dots sit just before the boundary at 12:00:59 and five more just after it at 12:01:01. A red bracket spans the two seconds and is labelled ten requests in two seconds. Below the ruler, two window boxes each report a count of five out of five and are marked legal, and a red conclusion says both windows are legal yet ten requests landed in two seconds, twice the limit.">
  <text x="16" y="24" font-size="11" fill="#fb863a">limit = 5 requests per minute · fixed window counter</text>

  <line x1="360" y1="40" x2="360" y2="222" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 4"/>
  <text x="368" y="54" font-size="9.5" fill="#f06868">window boundary — counter resets to 0</text>

  <path d="M320,114 L320,100 L402,100 L402,114" fill="none" stroke="#f06868" stroke-width="1.3"/>
  <text x="412" y="106" font-size="11" fill="#f06868">10 requests in 2 seconds</text>

  <circle cx="326" cy="128" r="3.6" fill="#5cc66f"/>
  <circle cx="334" cy="128" r="3.6" fill="#5cc66f"/>
  <circle cx="342" cy="128" r="3.6" fill="#5cc66f"/>
  <circle cx="350" cy="128" r="3.6" fill="#5cc66f"/>
  <circle cx="357" cy="128" r="3.6" fill="#5cc66f"/>
  <circle cx="365" cy="128" r="3.6" fill="#5cc66f"/>
  <circle cx="373" cy="128" r="3.6" fill="#5cc66f"/>
  <circle cx="381" cy="128" r="3.6" fill="#5cc66f"/>
  <circle cx="389" cy="128" r="3.6" fill="#5cc66f"/>
  <circle cx="397" cy="128" r="3.6" fill="#5cc66f"/>

  <text x="180" y="132" font-size="9" fill="#6b7280">quiet</text>
  <text x="520" y="132" font-size="9" fill="#6b7280">quiet</text>

  <line x1="40" y1="150" x2="690" y2="150" stroke="#d8d3c9" stroke-width="1.2"/>
  <line x1="40" y1="150" x2="40" y2="160" stroke="#9099a8"/>
  <line x1="360" y1="150" x2="360" y2="160" stroke="#9099a8"/>
  <line x1="680" y1="150" x2="680" y2="160" stroke="#9099a8"/>
  <text x="20" y="174" font-size="9" fill="#9099a8">12:00:00</text>
  <text x="332" y="174" font-size="9" fill="#9099a8">12:01:00</text>
  <text x="648" y="174" font-size="9" fill="#9099a8">12:02:00</text>

  <rect x="40" y="186" width="316" height="30" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="54" y="206" font-size="9.5" fill="#5cc66f">window 12:00 · count = 5 / 5 · legal ✓</text>
  <rect x="364" y="186" width="316" height="30" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="378" y="206" font-size="9.5" fill="#5cc66f">window 12:01 · count = 5 / 5 · legal ✓</text>

  <text x="16" y="246" font-size="11" fill="#f06868">both windows are individually legal — and the client still got 2× the limit, in 2 seconds</text>
  <text x="16" y="262" font-size="9" fill="#9099a8">the counter has no memory of the window it just left; that is the entire flaw</text>
</svg>`,
        caption:
          "Trace the counter, not the dots. At 12:00:59 it reads **5**. At 12:01:00 it becomes **0** — and it forgets that five requests happened one second ago. Press **💥 Boundary burst** in the prototype under **🪟 Fixed** to watch exactly this.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "This is the one thing the interviewer is checking",
        text: "Every candidate can write a counter and an if-statement. The dividing line is whether you *volunteer* the boundary case before being asked. Draw the timeline, say *“this is why fixed window is not enough”*, and then earn the rest of the round by fixing it. If you wait to be asked, you have already lost the point.",
      },

      { type: "h", text: "Step 3 · Five algorithms, one interface" },
      {
        type: "p",
        text: "Each of the five fixes something the one before it got wrong. Walk them in this order out loud — it is a story, and the interviewer can follow it without you drawing a single class.",
      },

      { type: "h", text: "1 · Fixed window counter" },
      {
        type: "p",
        text: "State per key: a **window start** and a **count**. When a request arrives, work out which window this instant belongs to; if it is a new one, reset the count to zero. Then compare against the limit. Two numbers, O(1) memory, about six lines — and the boundary bug you just drew.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 244" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The fixed window state is two fields, windowStart and count. A strip of request slots shows counts one through five accepted and a sixth and seventh rejected, then at the reset instant the count drops to zero and requests are accepted again. A note explains that the window is derived from the current time by integer division, so no timer is needed to reset it.">
  <text x="16" y="24" font-size="10.5" fill="#fb863a">state per key — two numbers, that is all</text>
  <rect x="16" y="34" width="240" height="72" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="32" y="58" font-size="10" fill="#e8e4dc">long windowStart</text>
  <text x="32" y="80" font-size="10" fill="#e8e4dc">int  count</text>
  <text x="32" y="98" font-size="8.5" fill="#6b7280">16 bytes per key, forever</text>

  <rect x="276" y="34" width="408" height="72" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="292" y="56" font-size="9.5" fill="#9099a8">windowStart = now − (now % windowMs)</text>
  <text x="292" y="76" font-size="9.5" fill="#9099a8">if (windowStart != state.start) count = 0</text>
  <text x="292" y="96" font-size="9" fill="#5cc66f">the reset is derived from the clock — no timer, no thread</text>

  <text x="16" y="140" font-size="10.5" fill="#9099a8">limit 5 — what a client sees across one boundary</text>
  <rect x="16" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="26" y="170" font-size="10" fill="#5cc66f">1</text>
  <rect x="52" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="62" y="170" font-size="10" fill="#5cc66f">2</text>
  <rect x="88" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="98" y="170" font-size="10" fill="#5cc66f">3</text>
  <rect x="124" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="134" y="170" font-size="10" fill="#5cc66f">4</text>
  <rect x="160" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="170" y="170" font-size="10" fill="#5cc66f">5</text>
  <rect x="196" y="152" width="30" height="26" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.5)"/><text x="206" y="170" font-size="10" fill="#f06868">✗</text>
  <rect x="232" y="152" width="30" height="26" rx="4" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.5)"/><text x="242" y="170" font-size="10" fill="#f06868">✗</text>

  <line x1="278" y1="144" x2="278" y2="192" stroke="#fb863a" stroke-width="1.2" stroke-dasharray="4 4"/>
  <text x="286" y="140" font-size="9" fill="#fb863a">count → 0</text>

  <rect x="296" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="306" y="170" font-size="10" fill="#5cc66f">1</text>
  <rect x="332" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="342" y="170" font-size="10" fill="#5cc66f">2</text>
  <rect x="368" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="378" y="170" font-size="10" fill="#5cc66f">3</text>
  <rect x="404" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="414" y="170" font-size="10" fill="#5cc66f">4</text>
  <rect x="440" y="152" width="30" height="26" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="450" y="170" font-size="10" fill="#5cc66f">5</text>

  <text x="490" y="170" font-size="9.5" fill="#f06868">if these two batches sit either side</text>
  <text x="490" y="184" font-size="9.5" fill="#f06868">of the line, that is 10 in a moment</text>

  <text x="16" y="216" font-size="9.5" fill="#5cc66f">✓ smallest state, simplest code, and what almost every quota counter starts as</text>
  <text x="16" y="234" font-size="9.5" fill="#f06868">✗ up to 2× the limit across any boundary — disqualifying if the limit is a safety limit</text>
</svg>`,
        caption:
          "Notice there is **no timer** resetting the counter. The window is derived from the clock by integer division, which is the same trick the token bucket uses for refill. Deriving beats scheduling every time.",
      },

      { type: "h", text: "2 · Sliding window log" },
      {
        type: "p",
        text: "Fix the boundary by refusing to forget. Keep the **timestamp of every request**. On each call, drop everything older than `now − window` and count what remains. It is exactly correct — there is no boundary because there are no windows, only a moving cut-off. And it is disqualified at scale for one reason: **memory grows with the request rate**.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 250" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A queue of request timestamps for one key. A dashed cut-off line marks now minus the window. Three older timestamps to the left of the cut-off are faded and shown falling off the back of the queue, while five recent timestamps remain inside the window and are counted. A memory note says one timestamp per request per key, so a client sending a thousand requests a second stores sixty thousand timestamps per minute.">
  <text x="16" y="24" font-size="10.5" fill="#fb863a">one key · a queue of timestamps, oldest on the left</text>

  <line x1="228" y1="40" x2="228" y2="156" stroke="#fb863a" stroke-width="1.2" stroke-dasharray="4 4"/>
  <text x="16" y="56" font-size="9.5" fill="#fb863a">cut-off = now − window</text>

  <rect x="16" y="66" width="62" height="28" rx="5" fill="#14161a" stroke="#2d333d" opacity=".45"/><text x="26" y="85" font-size="9" fill="#9099a8" opacity=".6">12:00:02</text>
  <rect x="84" y="66" width="62" height="28" rx="5" fill="#14161a" stroke="#2d333d" opacity=".45"/><text x="94" y="85" font-size="9" fill="#9099a8" opacity=".6">12:00:07</text>
  <rect x="152" y="66" width="62" height="28" rx="5" fill="#14161a" stroke="#2d333d" opacity=".45"/><text x="162" y="85" font-size="9" fill="#9099a8" opacity=".6">12:00:11</text>

  <text x="16" y="118" font-size="9.5" fill="#6b7280">evicted — older than the cut-off, they no longer count</text>

  <rect x="240" y="66" width="62" height="28" rx="5" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="250" y="85" font-size="9" fill="#5cc66f">12:00:44</text>
  <rect x="308" y="66" width="62" height="28" rx="5" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="318" y="85" font-size="9" fill="#5cc66f">12:00:51</text>
  <rect x="376" y="66" width="62" height="28" rx="5" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="386" y="85" font-size="9" fill="#5cc66f">12:00:58</text>
  <rect x="444" y="66" width="62" height="28" rx="5" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="454" y="85" font-size="9" fill="#5cc66f">12:00:59</text>
  <rect x="512" y="66" width="62" height="28" rx="5" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/><text x="522" y="85" font-size="9" fill="#5cc66f">12:01:01</text>

  <text x="240" y="118" font-size="9.5" fill="#5cc66f">inside the window → count = 5 → at the limit → the next one is refused</text>

  <rect x="16" y="140" width="668" height="46" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="32" y="160" font-size="9.5" fill="#e8e4dc">while (head &lt;= now − window) pop();   if (size &lt; limit) { push(now); return true; }</text>
  <text x="32" y="178" font-size="9" fill="#5cc66f">no windows at all — just a cut-off that moves with the clock, so there is no boundary to exploit</text>

  <text x="16" y="212" font-size="9.5" fill="#5cc66f">✓ exactly correct — the only algorithm here with no approximation</text>
  <text x="16" y="230" font-size="9.5" fill="#f06868">✗ one timestamp per request per key: 1000 req/s for a minute = 60,000 stored longs, for one client</text>
</svg>`,
        caption:
          "The memory line is the one that matters. **The log is perfect and unaffordable** — say both halves, because the interviewer wants to hear you reject a correct answer for a cost reason.",
      },

      { type: "h", text: "3 · Sliding window counter" },
      {
        type: "p",
        text: "The practical compromise, and the one Cloudflare actually ships. Keep two counters — this window and the previous one — and weight the previous one by how much of it still falls inside the moving window. If you are 30% into the current window, then 70% of the previous window is still relevant:",
      },
      {
        type: "code",
        language: "text",
        filename: "the whole algorithm",
        code: `elapsed  = (now - windowStart) / windowMs        // 0.0 .. 1.0
estimate = prevCount * (1 - elapsed) + currCount

if (estimate < limit) { currCount++; return true; }
return false;`,
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 262" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two adjacent windows on a timeline. The previous window holds a count of five and the current window holds a count of two. A moving window of the same length is drawn overlapping seventy percent of the previous window and thirty percent of the current one. The arithmetic below shows five times zero point seven plus two equals five point five, which is above the limit of five, so the request is refused. A note says only three numbers are stored per key.">
  <text x="16" y="24" font-size="10.5" fill="#fb863a">limit 5 · you are 30% into the current window</text>

  <rect x="16" y="40" width="300" height="46" rx="6" fill="rgba(94,159,246,0.10)" stroke="#2d333d"/>
  <text x="30" y="60" font-size="9.5" fill="#9099a8">previous window</text>
  <text x="30" y="78" font-size="11" fill="#e8e4dc">prevCount = 5</text>

  <rect x="322" y="40" width="300" height="46" rx="6" fill="rgba(251,134,58,0.10)" stroke="#2d333d"/>
  <text x="336" y="60" font-size="9.5" fill="#9099a8">current window</text>
  <text x="336" y="78" font-size="11" fill="#e8e4dc">currCount = 2</text>

  <line x1="322" y1="34" x2="322" y2="150" stroke="#2d333d" stroke-dasharray="3 3"/>
  <line x1="412" y1="34" x2="412" y2="150" stroke="#fb863a" stroke-width="1.3"/>
  <text x="420" y="32" font-size="9.5" fill="#fb863a">now</text>

  <rect x="112" y="96" width="300" height="24" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="124" y="112" font-size="9" fill="#fb863a">the real window we care about — the last 60 seconds, ending at now</text>

  <line x1="112" y1="132" x2="316" y2="132" stroke="#5e9ff6" stroke-width="1.2"/>
  <text x="150" y="146" font-size="9" fill="#5e9ff6">70% of the previous window is still inside</text>
  <line x1="326" y1="132" x2="410" y2="132" stroke="#fb863a" stroke-width="1.2"/>
  <text x="326" y="146" font-size="9" fill="#fb863a">30% elapsed</text>

  <rect x="16" y="164" width="668" height="52" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="32" y="186" font-size="11" fill="#e8e4dc">estimate = prevCount × (1 − elapsed) + currCount  =  5 × 0.70 + 2  =  5.50</text>
  <text x="32" y="206" font-size="10" fill="#f06868">5.50 ≥ 5  →  refused — even though the current window only holds 2</text>

  <text x="16" y="238" font-size="9.5" fill="#5cc66f">✓ three numbers per key, no boundary cliff, and typically under 1% off the exact answer</text>
  <text x="16" y="256" font-size="9.5" fill="#9099a8">✗ it assumes the previous window was evenly spread — it was not, so it is an estimate, not a count</text>
</svg>`,
        caption:
          "The weighting is the whole idea: **the previous window fades out as you move through the current one**. Read the arithmetic once and you can re-derive it in an interview from the words *“weighted share of the previous window”*.",
      },

      { type: "h", text: "4 · Token bucket" },
      {
        type: "p",
        text: "Stop counting requests and start counting **permission**. A bucket holds up to `capacity` tokens and gains them at `rate` per second. A request takes one token, or is refused. Overflow spills — the bucket never holds more than its capacity. This is what most real systems use, including Guava's `RateLimiter` and Go's `golang.org/x/time/rate`.",
      },
      {
        type: "p",
        text: "The property that makes it popular: **it allows a burst up to the bucket size**. A client that was quiet for a minute has a full bucket and can fire all of it at once — which is usually exactly what you want, because idle clients are not the ones you are protecting against.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 276" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A bucket holding token dots, with a refill arrow entering from above labelled rate per second and an overflow arrow spilling off the rim at capacity. A request arrow takes one token from the bucket and is allowed. Beside it, the lazy refill formula computes tokens as the minimum of capacity and current tokens plus elapsed time times rate, with a note that no background thread exists anywhere in the design.">
  <defs>
    <marker id="rl-drop" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
    <marker id="rl-take" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="rl-spill" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <line x1="128" y1="26" x2="128" y2="82" stroke="#5e9ff6" stroke-width="1.4" marker-end="url(#rl-drop)"/>
  <text x="140" y="46" font-size="10" fill="#5e9ff6">refill · rate = 5 tokens/sec</text>
  <text x="140" y="62" font-size="8.5" fill="#6b7280">computed on arrival, never scheduled</text>

  <path d="M78,90 L178,90 L166,214 L90,214 Z" fill="none" stroke="#fb863a" stroke-width="1.4"/>
  <text x="96" y="234" font-size="9.5" fill="#fb863a">capacity = 5</text>

  <circle cx="106" cy="200" r="6" fill="#fb863a"/>
  <circle cx="128" cy="200" r="6" fill="#fb863a"/>
  <circle cx="150" cy="200" r="6" fill="#fb863a"/>
  <circle cx="117" cy="180" r="6" fill="#fb863a"/>
  <circle cx="139" cy="180" r="6" fill="#fb863a"/>

  <line x1="184" y1="88" x2="238" y2="66" stroke="#f06868" stroke-width="1.2" marker-end="url(#rl-spill)"/>
  <text x="244" y="64" font-size="9.5" fill="#f06868">overflow spills — a full bucket stays full</text>
  <text x="244" y="80" font-size="8.5" fill="#9099a8">idle time is capped; you cannot bank a week of quiet</text>

  <line x1="182" y1="182" x2="248" y2="182" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#rl-take)"/>
  <text x="256" y="178" font-size="10" fill="#5cc66f">request takes 1 token → allowed</text>
  <text x="256" y="194" font-size="9" fill="#9099a8">no tokens → refused, and nothing is queued</text>

  <rect x="256" y="104" width="428" height="60" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="270" y="126" font-size="9.5" fill="#e8e4dc">tokens = min(capacity, tokens + (now − lastRefill) × rate)</text>
  <text x="270" y="144" font-size="9.5" fill="#e8e4dc">lastRefill = now</text>
  <text x="270" y="158" font-size="8.5" fill="#5cc66f">two lines, on the way in — this is the whole refill mechanism</text>

  <text x="256" y="226" font-size="9.5" fill="#5cc66f">✓ two numbers per key, and a burst up to capacity is a feature, not a bug</text>
  <text x="256" y="244" font-size="9.5" fill="#5cc66f">✓ no timer, no scheduler, no thread — everything is derived from elapsed time</text>
  <text x="256" y="262" font-size="9.5" fill="#f06868">✗ a burst still reaches your service; capacity is a real safety decision</text>
</svg>`,
        caption:
          "Two fields, `tokens` and `lastRefill`, and one `min()`. **Anyone who adds a background thread here has misunderstood the algorithm** — and interviewers ask about it precisely because so many candidates do.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Lazy refill, said properly",
        text: "*“I do not tick tokens in. On every call I compute how many accrued since `lastRefillTime` and cap at capacity.”* That removes a thread, removes a scheduler, and makes the limiter a **pure function of state and time** — which is what lets you test it in a millisecond instead of a minute.",
      },

      { type: "h", text: "5 · Leaky bucket" },
      {
        type: "p",
        text: "A fixed-size queue that drains at a constant rate. A request joins the queue if there is room, and is dropped if there is not. What leaves the bucket leaves **evenly** — one every 200ms, forever — no matter how spiky the arrivals were.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 268" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A leaky bucket. Ten requests arrive at once from above; five fit into the fixed size queue and five overflow and are dropped. Below the bucket a constant drip leaves at one request every two hundred milliseconds, and a timeline shows the exits evenly spaced regardless of how bursty the arrivals were. A comparison line states that a token bucket limits the average and permits bursts while a leaky bucket enforces a constant rate.">
  <defs>
    <marker id="rl-arr" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="rl-drip" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="rl-drop2" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="16" y="24" font-size="10" fill="#fb863a">10 requests arrive at once</text>
  <line x1="96" y1="34" x2="96" y2="76" stroke="#fb863a" stroke-width="1.3" marker-end="url(#rl-arr)"/>
  <line x1="118" y1="34" x2="118" y2="76" stroke="#fb863a" stroke-width="1.3" marker-end="url(#rl-arr)"/>
  <line x1="140" y1="34" x2="140" y2="76" stroke="#fb863a" stroke-width="1.3" marker-end="url(#rl-arr)"/>

  <line x1="164" y1="52" x2="240" y2="40" stroke="#f06868" stroke-width="1.2" marker-end="url(#rl-drop2)"/>
  <text x="248" y="40" font-size="9.5" fill="#f06868">5 overflow → dropped immediately</text>

  <rect x="76" y="82" width="104" height="120" rx="4" fill="none" stroke="#fb863a" stroke-width="1.4"/>
  <rect x="82" y="98" width="92" height="18" rx="3" fill="rgba(94,159,246,0.28)"/>
  <rect x="82" y="120" width="92" height="18" rx="3" fill="rgba(94,159,246,0.28)"/>
  <rect x="82" y="142" width="92" height="18" rx="3" fill="rgba(94,159,246,0.28)"/>
  <rect x="82" y="164" width="92" height="18" rx="3" fill="rgba(94,159,246,0.28)"/>
  <rect x="82" y="186" width="92" height="12" rx="3" fill="rgba(94,159,246,0.28)"/>
  <text x="80" y="222" font-size="9.5" fill="#fb863a">queue size = 5</text>

  <line x1="128" y1="204" x2="128" y2="240" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#rl-drip)"/>
  <text x="16" y="252" font-size="9.5" fill="#5cc66f">drains at a constant rate</text>

  <text x="248" y="86" font-size="10" fill="#9099a8">what leaves the bucket, on a timeline:</text>
  <line x1="248" y1="120" x2="676" y2="120" stroke="#d8d3c9" stroke-width="1.1"/>
  <circle cx="268" cy="120" r="4.5" fill="#5cc66f"/>
  <circle cx="352" cy="120" r="4.5" fill="#5cc66f"/>
  <circle cx="436" cy="120" r="4.5" fill="#5cc66f"/>
  <circle cx="520" cy="120" r="4.5" fill="#5cc66f"/>
  <circle cx="604" cy="120" r="4.5" fill="#5cc66f"/>
  <text x="248" y="142" font-size="9" fill="#9099a8">t=0.0s</text>
  <text x="332" y="142" font-size="9" fill="#9099a8">t=0.2s</text>
  <text x="416" y="142" font-size="9" fill="#9099a8">t=0.4s</text>
  <text x="500" y="142" font-size="9" fill="#9099a8">t=0.6s</text>
  <text x="584" y="142" font-size="9" fill="#9099a8">t=0.8s</text>
  <text x="248" y="164" font-size="9.5" fill="#5cc66f">perfectly even — the burst went in, a steady stream came out</text>

  <rect x="248" y="182" width="436" height="72" rx="8" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="264" y="204" font-size="10" fill="#fb863a">the one-line distinction people fumble:</text>
  <text x="264" y="226" font-size="10" fill="#e8e4dc">token bucket limits the AVERAGE and permits bursts</text>
  <text x="264" y="244" font-size="10" fill="#e8e4dc">leaky bucket enforces a CONSTANT rate and smooths them away</text>
</svg>`,
        caption:
          "Read the two timelines together: the arrivals were a spike, the exits are a metronome. **Use a leaky bucket when the thing downstream cannot absorb a spike** — a payment gateway, a legacy database, an SMS provider with a hard per-second cap.",
      },

      {
        type: "figure",
        svg: `<svg viewBox="0 0 760 268" width="100%" style="max-width:740px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A comparison table of the five rate limiting algorithms across five columns: memory per key, accuracy, whether bursts are allowed, whether output is smoothed, and the hard part. Fixed window uses two numbers and is poor at boundaries. Sliding log is exact but stores one timestamp per request. Sliding counter uses three numbers and is within about one percent. Token bucket uses two numbers, is exact on average and allows bursts up to capacity. Leaky bucket uses two numbers, enforces an exact rate and is the only one that smooths output.">
  <text x="8" y="30" font-size="10" fill="#fb863a">algorithm</text>
  <text x="146" y="30" font-size="10" fill="#fb863a">memory / key</text>
  <text x="286" y="30" font-size="10" fill="#fb863a">accuracy</text>
  <text x="394" y="30" font-size="10" fill="#fb863a">bursts?</text>
  <text x="494" y="30" font-size="10" fill="#fb863a">smooths?</text>
  <text x="582" y="30" font-size="10" fill="#fb863a">the hard part</text>
  <line x1="8" y1="40" x2="752" y2="40" stroke="#3a414c" stroke-width="1.2"/>

  <rect x="8" y="48" width="744" height="30" rx="5" fill="rgba(240,104,104,0.08)"/>
  <text x="16" y="68" font-size="9" fill="#e8e4dc">fixed window</text>
  <text x="146" y="68" font-size="9" fill="#9099a8">2 numbers</text>
  <text x="286" y="68" font-size="9" fill="#f06868">2× at the edge</text>
  <text x="394" y="68" font-size="9" fill="#f06868">accidentally</text>
  <text x="494" y="68" font-size="9" fill="#9099a8">no</text>
  <text x="582" y="68" font-size="9" fill="#9099a8">the boundary</text>

  <rect x="8" y="82" width="744" height="30" rx="5" fill="rgba(255,255,255,0.02)"/>
  <text x="16" y="102" font-size="9" fill="#e8e4dc">sliding window log</text>
  <text x="146" y="102" font-size="9" fill="#f06868">1 stamp / request</text>
  <text x="286" y="102" font-size="9" fill="#5cc66f">exact</text>
  <text x="394" y="102" font-size="9" fill="#9099a8">no</text>
  <text x="494" y="102" font-size="9" fill="#9099a8">no</text>
  <text x="582" y="102" font-size="9" fill="#9099a8">memory at high rates</text>

  <rect x="8" y="116" width="744" height="30" rx="5" fill="rgba(255,255,255,0.02)"/>
  <text x="16" y="136" font-size="9" fill="#e8e4dc">sliding window counter</text>
  <text x="146" y="136" font-size="9" fill="#5cc66f">3 numbers</text>
  <text x="286" y="136" font-size="9" fill="#5cc66f">≈ exact (&lt;1% off)</text>
  <text x="394" y="136" font-size="9" fill="#9099a8">barely</text>
  <text x="494" y="136" font-size="9" fill="#9099a8">no</text>
  <text x="582" y="136" font-size="9" fill="#9099a8">the weighted arithmetic</text>

  <rect x="8" y="150" width="744" height="30" rx="5" fill="rgba(92,198,111,0.08)"/>
  <text x="16" y="170" font-size="9" fill="#e8e4dc">token bucket</text>
  <text x="146" y="170" font-size="9" fill="#5cc66f">2 numbers</text>
  <text x="286" y="170" font-size="9" fill="#5cc66f">exact on average</text>
  <text x="394" y="170" font-size="9" fill="#5cc66f">yes, up to capacity</text>
  <text x="494" y="170" font-size="9" fill="#9099a8">no</text>
  <text x="582" y="170" font-size="9" fill="#9099a8">choosing the capacity</text>

  <rect x="8" y="184" width="744" height="30" rx="5" fill="rgba(255,255,255,0.02)"/>
  <text x="16" y="204" font-size="9" fill="#e8e4dc">leaky bucket</text>
  <text x="146" y="204" font-size="9" fill="#5cc66f">2 numbers</text>
  <text x="286" y="204" font-size="9" fill="#5cc66f">exact rate</text>
  <text x="394" y="204" font-size="9" fill="#9099a8">no</text>
  <text x="494" y="204" font-size="9" fill="#5cc66f">yes — only one</text>
  <text x="582" y="204" font-size="9" fill="#9099a8">added queueing delay</text>

  <line x1="8" y1="224" x2="752" y2="224" stroke="#2d333d"/>
  <text x="8" y="246" font-size="9.5" fill="#fb863a">default to token bucket. Reach for leaky bucket only when something downstream cannot take a spike.</text>
  <text x="8" y="262" font-size="9" fill="#9099a8">sliding counter is the right answer when you need a hard per-window cap with O(1) memory; the log almost never survives review.</text>
</svg>`,
        caption:
          "This is the table to reproduce on the whiteboard. If you can draw these five rows from memory, you can answer *“which would you use and why?”* for any variation the interviewer invents.",
      },
      {
        type: "callout",
        variant: "success",
        title: "The seam that makes all five interchangeable",
        text: "Five classes, one interface, chosen at construction. That is [[strategy]] in its plainest form, and it is what makes *“show me a different algorithm”* a **one-line change** at the call site instead of a rewrite. It is also [[open-closed]] doing real work: a sixth algorithm is a new file, not an edit. See also [[program-to-interfaces]].",
      },
      { type: "h", text: "Step 4 · Inject the clock, or you will not test anything" },
      {
        type: "p",
        text: "Every algorithm above is a function of **state and time**. If you read `System.currentTimeMillis()` inside `allow()`, you have welded the clock to the logic, and the only way to test a one-minute window is to sleep for a minute. Nobody does that, so nobody tests it, so the boundary bug ships.",
      },
      {
        type: "code",
        language: "java",
        filename: "the whole trick",
        code: `interface Clock { long millis(); }

class SystemClock implements Clock {
    public long millis() { return System.currentTimeMillis(); }
}

class FakeClock implements Clock {              // the entire test infrastructure
    private long now;
    public long millis()        { return now; }
    public void set(long ms)    { now = ms; }
    public void advance(long m) { now += m; }
}

// the boundary bug, tested in microseconds instead of two minutes:
FakeClock clock = new FakeClock();
RateLimiter limiter = new FixedWindow(clock, 5, 60_000);
clock.set(59_000);  for (int i = 0; i < 5; i++) limiter.allow("user-42");   // 5 allowed
clock.set(61_000);  for (int i = 0; i < 5; i++) limiter.allow("user-42");   // 5 MORE allowed`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "You have seen this exact move before",
        text: "It is the same decision as `unpark(id, exitAt)` in [[parking-lot]]: **pass time in rather than reading it**. Anything that reads the wall clock, a random number generator or the filesystem directly is untestable by construction. Say the sentence *“I inject the clock so the tests do not sleep”* and it will land every time.",
      },

      { type: "h", text: "Step 5 · One limiter per key — and the leak nobody mentions" },
      {
        type: "p",
        text: "There is not one bucket, there is one bucket **per key**. That is a `ConcurrentHashMap<String, Bucket>` and a `computeIfAbsent`. Which raises a question the interviewer will be pleased you asked yourself: *what removes entries from that map?*",
      },
      {
        type: "code",
        language: "java",
        filename: "the registry, and the sweep",
        code: `private final ConcurrentHashMap<String, Bucket> byKey = new ConcurrentHashMap<>();

public boolean allow(String key) {
    Bucket bucket = byKey.computeIfAbsent(key, k -> new Bucket(capacity));
    synchronized (bucket) {              // lock the BUCKET, not the map
        bucket.lastSeen = clock.millis();
        return bucket.tryTake(clock.millis());
    }
}

// nothing above ever removes a key. One request from one IP creates an entry
// that lives forever. Sweep idle keys, or bound the map with an LRU cache.
public void sweepIdle(long idleMs) {
    long cutoff = clock.millis() - idleMs;
    byKey.entrySet().removeIf(e -> e.getValue().lastSeen < cutoff);
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Raise the leak before they do",
        text: "A limiter keyed by IP address on a public API accumulates an entry per unique IP, forever. It is a slow, boring, production-grade memory leak. Three acceptable answers: a **periodic sweep** of idle keys, a **bounded LRU** cache, or a store with **TTL** built in (which is one reason Redis is the standard distributed answer — the key expires by itself).",
      },

      { type: "h", text: "The class diagram" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 340" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. The RateLimiter interface declares allow of key. Five classes implement it: FixedWindow, SlidingLog, SlidingCounter, TokenBucket and LeakyBucket. A shared KeyedLimiter base class holds a concurrent map from key to per-key state, a Clock, a limit and a window, and provides the sweep of idle keys. The Clock interface has SystemClock and FakeClock implementations and is injected into the limiter.">
  <defs>
    <marker id="rl-impl" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="10" refY="4" orient="auto"><path d="M1,1 L10,4 L1,7 z" fill="none" stroke="#9099a8" stroke-width="1.2"/></marker>
    <marker id="rl-assoc" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="248" y="12" width="224" height="58" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="262" y="32" font-size="11.5" fill="#fb863a">RateLimiter</text>
  <text x="380" y="32" font-size="9" fill="#6b7280">«interface»</text>
  <line x1="248" y1="40" x2="472" y2="40" stroke="#2d333d"/>
  <text x="262" y="60" font-size="10" fill="#e8e4dc">+ allow(key) : boolean</text>

  <line x1="360" y1="70" x2="360" y2="94" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="5 4"/>
  <rect x="212" y="94" width="296" height="98" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="226" y="114" font-size="11.5" fill="#e8e4dc">KeyedLimiter</text>
  <text x="356" y="114" font-size="9" fill="#6b7280">«abstract»</text>
  <line x1="212" y1="122" x2="508" y2="122" stroke="#2d333d"/>
  <text x="226" y="140" font-size="9.5" fill="#fb863a">- byKey : ConcurrentMap&lt;String, State&gt;</text>
  <text x="226" y="156" font-size="9.5" fill="#9099a8">- clock : Clock   - limit : int   - windowMs</text>
  <text x="226" y="172" font-size="9.5" fill="#e8e4dc">+ allow(key)  · locks ONE bucket</text>
  <text x="226" y="186" font-size="9.5" fill="#e8e4dc">+ sweepIdle(ms)  · or the map leaks</text>

  <line x1="360" y1="192" x2="360" y2="214" stroke="#9099a8" stroke-width="1.2" marker-end="url(#rl-impl)"/>
  <line x1="76" y1="228" x2="644" y2="228" stroke="#3a414c" stroke-width="1.1"/>
  <line x1="76" y1="228" x2="76" y2="248" stroke="#3a414c"/>
  <line x1="218" y1="228" x2="218" y2="248" stroke="#3a414c"/>
  <line x1="360" y1="228" x2="360" y2="248" stroke="#3a414c"/>
  <line x1="502" y1="228" x2="502" y2="248" stroke="#3a414c"/>
  <line x1="644" y1="228" x2="644" y2="248" stroke="#3a414c"/>

  <rect x="16" y="248" width="120" height="56" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="26" y="266" font-size="9.5" fill="#e8e4dc">FixedWindow</text>
  <text x="26" y="282" font-size="8.5" fill="#9099a8">start, count</text>
  <text x="26" y="296" font-size="8.5" fill="#f06868">2× at the edge</text>

  <rect x="158" y="248" width="120" height="56" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="168" y="266" font-size="9.5" fill="#e8e4dc">SlidingLog</text>
  <text x="168" y="282" font-size="8.5" fill="#9099a8">Deque&lt;Long&gt;</text>
  <text x="168" y="296" font-size="8.5" fill="#f06868">memory grows</text>

  <rect x="300" y="248" width="120" height="56" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="310" y="266" font-size="9.5" fill="#e8e4dc">SlidingCounter</text>
  <text x="310" y="282" font-size="8.5" fill="#9099a8">prev, curr, start</text>
  <text x="310" y="296" font-size="8.5" fill="#5cc66f">O(1), ≈ exact</text>

  <rect x="442" y="248" width="120" height="56" rx="6" fill="#14161a" stroke="#5cc66f"/>
  <text x="452" y="266" font-size="9.5" fill="#5cc66f">TokenBucket</text>
  <text x="452" y="282" font-size="8.5" fill="#9099a8">tokens, lastRefill</text>
  <text x="452" y="296" font-size="8.5" fill="#5cc66f">the usual default</text>

  <rect x="584" y="248" width="120" height="56" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="594" y="266" font-size="9.5" fill="#e8e4dc">LeakyBucket</text>
  <text x="594" y="282" font-size="8.5" fill="#9099a8">level, lastLeak</text>
  <text x="594" y="296" font-size="8.5" fill="#5cc66f">smooths output</text>

  <rect x="530" y="94" width="174" height="80" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="542" y="114" font-size="11" fill="#5e9ff6">Clock</text>
  <text x="612" y="114" font-size="9" fill="#6b7280">«interface»</text>
  <line x1="530" y1="122" x2="704" y2="122" stroke="#2d333d"/>
  <text x="542" y="140" font-size="9.5" fill="#e8e4dc">+ millis() : long</text>
  <text x="542" y="158" font-size="9" fill="#9099a8">SystemClock · FakeClock</text>
  <line x1="528" y1="134" x2="512" y2="134" stroke="#9099a8" stroke-width="1.2" marker-end="url(#rl-assoc)"/>

  <text x="16" y="120" font-size="9.5" fill="#fb863a">five classes,</text>
  <text x="16" y="136" font-size="9.5" fill="#fb863a">one interface —</text>
  <text x="16" y="152" font-size="9.5" fill="#fb863a">the caller never</text>
  <text x="16" y="168" font-size="9.5" fill="#fb863a">changes a line</text>
  <text x="16" y="192" font-size="9" fill="#9099a8">that row of five</text>
  <text x="16" y="206" font-size="9" fill="#9099a8">boxes IS the round</text>

  <text x="16" y="330" font-size="9.5" fill="#9099a8">every box below the line holds two or three numbers — the design is small, the decision behind it is not</text>
</svg>`,
        caption:
          "Count the fields in the bottom row: **two or three numbers each**. This diagram exists to show the interviewer that you know the algorithms are interchangeable, not to show off class design. Notation: [[class-diagrams]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 288" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram. A client request reaches a filter, which calls allow on the RateLimiter with a key. The limiter reads the injected clock, finds or creates the bucket for that key, lazily refills it based on elapsed time, takes a token and returns true, and the filter forwards the request to the handler which returns 200 OK. A second, greyed path shows the same call returning false, and the filter returning 429 with Retry-After and X-RateLimit-Remaining headers without ever reaching the handler.">
  <defs>
    <marker id="rl-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="rl-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="92" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="34" y="32" font-size="10.5" fill="#e8e4dc">Client</text>
  <rect x="148" y="12" width="92" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="172" y="32" font-size="10.5" fill="#e8e4dc">Filter</text>
  <rect x="288" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="300" y="32" font-size="10.5" fill="#fb863a">RateLimiter</text>
  <rect x="452" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="474" y="32" font-size="10.5" fill="#5e9ff6">Bucket</text>
  <rect x="596" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="614" y="32" font-size="10.5" fill="#5cc66f">Handler</text>

  <line x1="60" y1="42" x2="60" y2="278" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="194" y1="42" x2="194" y2="278" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="348" y1="42" x2="348" y2="278" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="504" y1="42" x2="504" y2="278" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="648" y1="42" x2="648" y2="278" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="68" y="64" font-size="10" fill="#e8e4dc">GET /v1/charges</text>
  <line x1="60" y1="72" x2="190" y2="72" stroke="#fb863a" stroke-width="1.3" marker-end="url(#rl-call)"/>

  <text x="202" y="92" font-size="10" fill="#e8e4dc">allow(“user-42”)</text>
  <line x1="194" y1="100" x2="344" y2="100" stroke="#fb863a" stroke-width="1.3" marker-end="url(#rl-call)"/>

  <text x="356" y="120" font-size="9.5" fill="#9099a8">clock.millis() → 61_000</text>
  <text x="356" y="140" font-size="10" fill="#e8e4dc">byKey.computeIfAbsent(key)</text>
  <line x1="348" y1="148" x2="500" y2="148" stroke="#fb863a" stroke-width="1.3" marker-end="url(#rl-call)"/>

  <rect x="498" y="156" width="196" height="48" rx="5" fill="rgba(94,159,246,0.10)" stroke="rgba(94,159,246,0.5)"/>
  <text x="508" y="174" font-size="9" fill="#5e9ff6">🔒 lock this bucket only</text>
  <text x="508" y="190" font-size="9" fill="#5e9ff6">lazy refill · take 1 token</text>

  <line x1="504" y1="214" x2="352" y2="214" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#rl-ret)"/>
  <text x="372" y="228" font-size="10" fill="#5cc66f">true</text>

  <line x1="348" y1="242" x2="198" y2="242" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#rl-ret)"/>
  <line x1="194" y1="258" x2="644" y2="258" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#rl-call)"/>
  <text x="230" y="252" font-size="10" fill="#5cc66f">forward → 200 OK</text>

  <text x="202" y="278" font-size="9.5" fill="#f06868">false → the Filter answers 429 itself: Retry-After, X-RateLimit-Remaining — the Handler is never reached</text>
</svg>`,
        caption:
          "The limiter sits in a **filter**, before any business logic. That placement is the point: a rejected request must cost you almost nothing, so it must not touch the handler, the database or anything expensive. Notation: [[sequence-diagrams]].",
      },

      { type: "h", text: "The race — two threads, one last token" },
      {
        type: "p",
        text: "`allow()` reads the token count, decides, and writes it back. Two threads on the same key can both read **1**, both decide *yes*, and both subtract — leaving **−1** tokens and one more request through than the limit allows. This is the same check-then-act shape as the shared milk tank in [[coffee-machine]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 296" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Top half unguarded: thread A and thread B both read one token, both decide the request is allowed, and both subtract one, leaving minus one tokens and two requests through where only one was permitted. Bottom half guarded: thread A locks the bucket, reads one token, takes it and leaves zero; thread B then locks, reads zero and is refused. A note says lock the bucket, not the map, so other keys never wait.">
  <text x="16" y="22" font-size="10.5" fill="#f06868">⚠️ UNGUARDED — read, decide, write, with a gap between each</text>
  <rect x="16" y="32" width="668" height="112" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>

  <text x="32" y="58" font-size="9.5" fill="#9099a8">thread A</text>
  <rect x="98" y="44" width="146" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="108" y="59" font-size="9" fill="#e8e4dc">read tokens = 1 ✓</text>
  <rect x="336" y="44" width="146" height="22" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="346" y="59" font-size="9" fill="#f06868">tokens −= 1</text>

  <text x="32" y="92" font-size="9.5" fill="#9099a8">thread B</text>
  <rect x="140" y="78" width="146" height="22" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="150" y="93" font-size="9" fill="#e8e4dc">read tokens = 1 ✓</text>
  <rect x="378" y="78" width="146" height="22" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="388" y="93" font-size="9" fill="#f06868">tokens −= 1</text>

  <text x="32" y="130" font-size="10" fill="#f06868">tokens = −1 · 2 requests through where 1 was allowed · the limit is not a limit</text>

  <text x="16" y="180" font-size="10.5" fill="#5cc66f">🔒 GUARDED — refill, check and take inside one lock on that bucket</text>
  <rect x="16" y="190" width="668" height="100" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <text x="32" y="216" font-size="9.5" fill="#9099a8">thread A</text>
  <rect x="98" y="202" width="230" height="22" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="108" y="217" font-size="9" fill="#5cc66f">lock · refill · 1 ≥ 1 · take → 0</text>

  <text x="32" y="252" font-size="9.5" fill="#9099a8">thread B</text>
  <rect x="336" y="238" width="230" height="22" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="346" y="253" font-size="9" fill="#f06868">lock · refill · 0 &lt; 1 · REFUSED</text>

  <text x="32" y="280" font-size="9.5" fill="#5cc66f">lock the BUCKET, not the limiter — user-7 never waits behind user-42</text>
</svg>`,
        caption:
          "The fix is one word in the right place. `synchronized (bucket)` costs nothing and is correct; `synchronized` on the whole limiter is also correct and **serialises every key in the system**. Background: [[locks-mutex-semaphore]] and [[atomic-operations-and-cas]].",
      },
      {
        type: "callout",
        variant: "info",
        title: "The lock-free alternative, if they push",
        text: "A token bucket can be done with a single `AtomicLong` holding a packed `(tokens, lastRefill)` state and a `compareAndSet` retry loop: read the state, compute the new one, swap it, retry if someone beat you. Mention it as the version you would write if this were on a hot path; do not build it in 60 minutes. [[atomic-operations-and-cas]] has the loop.",
      },

      { type: "h", text: "What you actually return" },
      {
        type: "p",
        text: "A bare `false` is a weak answer at the end. Real limiters return **429 Too Many Requests** with a `Retry-After` header saying when to come back, and `X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset` so a well-behaved client can pace itself without being refused at all.",
      },
      {
        type: "p",
        text: "So the honest interface is a small result object rather than a boolean — `Decision(allowed, remaining, retryAfterMs)`. Build the boolean version first because it is the one you can finish, and say this in two sentences at minute 55.",
      },

      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“Free users get 10/min, paid users get 1000/min.”** → a `LimitPolicy` looked up by tier, returning `(limit, window)`. Configuration, not code, and no new algorithm.",
          "**“Different limits per endpoint.”** → make the key a compound one: `user-42:POST /charges`. One line, and the same map does the work.",
          "**“You have four servers.”** → each has its own in-process map, so the effective limit is **4× what you configured**. Say this yourself before they say it.",
          "**“So how do you fix it?”** → move the counter to Redis: `INCR` the key, `EXPIRE` it on first creation, compare to the limit. Both in one Lua script so it is atomic. The cost is a **network round trip on every request**.",
          "**“What if Redis is down?”** → fail **open** (serve the traffic, drop the limiting) for a general API, fail **closed** for something protecting a payment path or a hard third-party quota. Say which you would pick and why — that is the whole question.",
          "**“Can it be approximate to save the round trip?”** → yes: give each server `limit / serverCount`, or sync counts every few seconds. You trade exactness for latency, and for most APIs that is the right trade.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 250" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="On the left, four API servers each hold their own in-process map for user-42 with a limit of 100, so the client actually gets 400 requests per minute. On the right, the same four servers all call a single Redis instance which performs an atomic increment and expire on one shared key, giving a true limit of 100 at the cost of one network round trip per request.">
  <defs>
    <marker id="rl-net" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <text x="16" y="22" font-size="10.5" fill="#f06868">✗ IN-PROCESS MAP × 4 SERVERS</text>
  <rect x="16" y="32" width="316" height="164" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <rect x="32" y="48" width="130" height="34" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="42" y="69" font-size="9" fill="#e8e4dc">api-1 · user-42 → 100</text>
  <rect x="186" y="48" width="130" height="34" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="196" y="69" font-size="9" fill="#e8e4dc">api-2 · user-42 → 100</text>
  <rect x="32" y="94" width="130" height="34" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="42" y="115" font-size="9" fill="#e8e4dc">api-3 · user-42 → 100</text>
  <rect x="186" y="94" width="130" height="34" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="196" y="115" font-size="9" fill="#e8e4dc">api-4 · user-42 → 100</text>
  <text x="32" y="154" font-size="11" fill="#f06868">configured 100/min · actual 400/min</text>
  <text x="32" y="176" font-size="9" fill="#9099a8">nothing is wrong with the code; the state is just in four places</text>

  <text x="358" y="22" font-size="10.5" fill="#5cc66f">✓ ONE SHARED COUNTER</text>
  <rect x="358" y="32" width="326" height="164" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <rect x="374" y="48" width="86" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="384" y="65" font-size="9" fill="#e8e4dc">api-1</text>
  <rect x="374" y="80" width="86" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="384" y="97" font-size="9" fill="#e8e4dc">api-2</text>
  <rect x="374" y="112" width="86" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="384" y="129" font-size="9" fill="#e8e4dc">api-3</text>
  <rect x="374" y="144" width="86" height="26" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="384" y="161" font-size="9" fill="#e8e4dc">api-4</text>

  <line x1="464" y1="61" x2="536" y2="94" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#rl-net)"/>
  <line x1="464" y1="93" x2="536" y2="102" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#rl-net)"/>
  <line x1="464" y1="125" x2="536" y2="112" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#rl-net)"/>
  <line x1="464" y1="157" x2="536" y2="122" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#rl-net)"/>

  <rect x="540" y="76" width="130" height="64" rx="6" fill="#14161a" stroke="#5cc66f"/>
  <text x="552" y="96" font-size="10" fill="#5cc66f">Redis</text>
  <text x="552" y="114" font-size="9" fill="#e8e4dc">INCR key</text>
  <text x="552" y="130" font-size="9" fill="#e8e4dc">EXPIRE key ttl</text>
  <text x="374" y="182" font-size="9" fill="#5cc66f">one Lua script → atomic · true 100/min · one network hop per request</text>

  <text x="16" y="226" font-size="9.5" fill="#fb863a">the trade is latency for exactness — and if Redis is unreachable you must have already decided:</text>
  <text x="16" y="242" font-size="9.5" fill="#9099a8">fail OPEN (serve everything, no limiting) or fail CLOSED (refuse everything). There is no third answer.</text>
</svg>`,
        caption:
          "The number to say out loud is **4×**. It turns a vague *“you would need something distributed”* into a concrete failure, and it is the answer the interviewer is fishing for.",
      },

      { type: "h", text: "The 60 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 196" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sixty minute budget bar split into six segments: five minutes to clarify, five minutes for the interface and the boundary timeline, fifteen minutes for the fixed window plus the boundary demo, fifteen minutes for the token bucket with lazy refill and an injected clock, ten minutes for the per-key map and thread safety, and ten minutes for a runnable demo and the follow-up discussion.">
  <text x="16" y="24" font-size="10.5" fill="#fb863a">60 minutes · what to spend them on</text>

  <rect x="20" y="40" width="57" height="30" rx="4" fill="rgba(94,159,246,0.16)" stroke="rgba(94,159,246,0.5)"/>
  <rect x="79" y="40" width="54" height="30" rx="4" fill="rgba(94,159,246,0.16)" stroke="rgba(94,159,246,0.5)"/>
  <rect x="135" y="40" width="168" height="30" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="305" y="40" width="168" height="30" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="475" y="40" width="112" height="30" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="589" y="40" width="111" height="30" rx="4" fill="rgba(92,198,111,0.14)" stroke="rgba(92,198,111,0.5)"/>

  <line x1="20" y1="76" x2="20" y2="84" stroke="#6b7280"/><text x="12" y="96" font-size="8.5" fill="#6b7280">0</text>
  <line x1="135" y1="76" x2="135" y2="84" stroke="#6b7280"/><text x="127" y="96" font-size="8.5" fill="#6b7280">10</text>
  <line x1="305" y1="76" x2="305" y2="84" stroke="#6b7280"/><text x="297" y="96" font-size="8.5" fill="#6b7280">25</text>
  <line x1="475" y1="76" x2="475" y2="84" stroke="#6b7280"/><text x="467" y="96" font-size="8.5" fill="#6b7280">40</text>
  <line x1="589" y1="76" x2="589" y2="84" stroke="#6b7280"/><text x="581" y="96" font-size="8.5" fill="#6b7280">50</text>
  <line x1="700" y1="76" x2="700" y2="84" stroke="#6b7280"/><text x="688" y="96" font-size="8.5" fill="#6b7280">60</text>

  <text x="16" y="122" font-size="9.5" fill="#5e9ff6">0–5    clarify: key, limit, window, bursts, reject-not-wait</text>
  <text x="16" y="140" font-size="9.5" fill="#5e9ff6">5–10   write the interface (30s) and DRAW THE BOUNDARY TIMELINE</text>
  <text x="16" y="158" font-size="9.5" fill="#fb863a">10–25  fixed window + the boundary shown in a test with a FakeClock</text>
  <text x="16" y="176" font-size="9.5" fill="#fb863a">25–40  token bucket with lazy refill · sliding counter if there is time</text>
  <text x="360" y="122" font-size="9.5" fill="#5cc66f">40–50  per-key map, lock the bucket, mention the sweep</text>
  <text x="360" y="140" font-size="9.5" fill="#5cc66f">50–60  main() that prints the boundary result · then the follow-ups</text>
  <text x="360" y="164" font-size="9" fill="#9099a8">if you are behind at minute 40, drop the sliding counter</text>
  <text x="360" y="178" font-size="9" fill="#9099a8">and keep the demo — a running program beats a fifth algorithm</text>
</svg>`,
        caption:
          "The two orange blocks are where the marks are. If you find yourself at minute 25 still designing a request object, **abandon it and go write `FixedWindow`** — the whole story starts there.",
      },

      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**One hardcoded algorithm, no interface.** *“Show me the token bucket instead”* becomes a rewrite, and the comparison conversation never happens.",
          "**Not knowing the boundary case.** If the interviewer has to point out that ten requests got through, you have failed the question the problem exists to ask.",
          "**A background refill thread.** A `ScheduledExecutorService` ticking tokens into every bucket every second — for a million keys. It is wrong at every scale, and lazy refill is two lines.",
          "**`System.currentTimeMillis()` inline.** No injected clock means no tests, and you will not have time to write one that sleeps for a minute.",
          "**`synchronized` on the whole limiter.** Correct, and it makes every key in the system queue behind every other. Lock the bucket.",
          "**Silence about the map.** A per-key map with nothing evicting from it is a memory leak; raising it unprompted is one of the cheapest points on offer.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Send a few requests and watch the state panel",
        body:
          "Leave the default **🪟 Fixed**, limit **5 / 10s**, and press **▶ Send request** six times. Five dots go green on the ruler, the sixth goes red. Watch the state panel on the left: `count` climbs 1…5 and then the sixth call finds `count = 5` and refuses. Read the `.callline` — it shows the real call, `limiter.allow(\"user-42\", t=…) → true`.",
      },
      {
        title: "Fire the boundary bug under fixed window",
        body:
          "Press **↺ Reset**, stay on **🪟 Fixed**, and press **💥 Boundary burst**. It jumps the clock to the last second of a window, fires 5, steps 2 seconds past the edge, fires 5 more. **All ten are green.** The `over-limit` stat lights up red: ten requests inside one window-length, when the limit is five.",
      },
      {
        title: "Now do exactly the same thing on a correct algorithm",
        body:
          "Press **📜 Sliding log** (which clears the ruler) and press **💥 Boundary burst** again. Same clock, same ten requests — and the second batch is **all red**, because the log still remembers the five stamps from two seconds ago. Then try **⚖️ Sliding counter**: one gets through, four are refused. That single extra one is the approximation, and it is why the counter is *nearly* exact rather than exact.",
      },
      {
        title: "Move the clock and watch tokens appear from nothing",
        body:
          "Switch to **🪣 Token bucket** and press **🔥 Burst of 10** — five go through instantly (the bucket was full, that is the burst) and five are refused. Now press **⏩ +5s** and look at the bucket **before pressing anything else**: dots have reappeared. Nothing was running. Advancing the clock is what refilled it, because the refill is computed on arrival, not scheduled.",
      },
      {
        title: "Watch a leaky bucket smooth the same burst",
        body:
          "Press **💧 Leaky bucket** and press **🔥 Burst of 10**. Five are accepted again — but the panel now shows a **drain schedule**: those five leave one at a time, evenly spaced. Press **⏩ +5s** twice and watch the queue empty at a constant rate. That is the whole difference: the token bucket let a spike *through*, the leaky bucket let a spike *in* and released a metronome.",
      },
      {
        title: "Prove the limits are per key",
        body:
          "With any algorithm, hammer **▶ Send request** on `user-42` until it turns red, then click the **user-7** chip and press **▶ Send request**. It is allowed immediately. The per-key counters in the right pane tell the story: one key is exhausted, the other has not started. That is `computeIfAbsent` doing its job — and it is also the map that grows forever if nothing sweeps it.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `interface RateLimiter { boolean allow(String key); }` → `interface Clock` with a `FakeClock` → `FixedWindow` with `start` and `count` → a test that sets the clock to 59s, fires 5, sets it to 61s, fires 5, and **asserts that 10 got through** → `TokenBucket` with lazy refill → the same test, which now passes. If your test needs `Thread.sleep`, the clock is not injected.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "RateLimiters.java",
        code: `import java.util.*;
import java.util.concurrent.*;
import java.util.function.Function;

/** The entire public surface. Two lines. Everything hard is behind it. */
interface RateLimiter {
    boolean allow(String key);
}

/** Inject the clock, or a test for a 60-second window has to sleep for 60 seconds. */
interface Clock { long millis(); }

final class SystemClock implements Clock {
    public long millis() { return System.currentTimeMillis(); }
}

final class FakeClock implements Clock {
    private long now;
    FakeClock(long start) { this.now = start; }
    public long millis()      { return now; }
    void set(long ms)         { now = ms; }
    void advance(long ms)     { now += ms; }
}

/** Per-key state. lastSeen exists only so idle keys can be swept. */
abstract class KeyState { long lastSeen; }

/**
 * Everything the five algorithms share: one small state object per key, an
 * injected clock, a limit, a window, and a lock around ONE bucket.
 */
abstract class KeyedLimiter<S extends KeyState> implements RateLimiter {
    protected final ConcurrentHashMap<String, S> byKey = new ConcurrentHashMap<>();
    protected final Clock clock;
    protected final int limit;
    protected final long windowMs;

    KeyedLimiter(Clock clock, int limit, long windowMs) {
        this.clock = clock; this.limit = limit; this.windowMs = windowMs;
    }

    protected abstract S newState();
    protected abstract boolean tryTake(S state, long now);

    @Override public boolean allow(String key) {
        S state = byKey.computeIfAbsent(key, k -> newState());   // one bucket per key
        synchronized (state) {                                   // lock the BUCKET, not the map
            long now = clock.millis();
            state.lastSeen = now;
            return tryTake(state, now);                          // refill + check + take, atomically
        }
    }

    /** Without this the map grows forever — one entry per key ever seen. */
    public int sweepIdle(long idleMs) {
        long cutoff = clock.millis() - idleMs;
        int before = byKey.size();
        byKey.entrySet().removeIf(e -> e.getValue().lastSeen < cutoff);
        return before - byKey.size();
    }

    public int keyCount() { return byKey.size(); }
}

/** 1 · FIXED WINDOW — two numbers per key. Lets 2x the limit through at a boundary. */
final class FixedWindow extends KeyedLimiter<FixedWindow.W> {
    static final class W extends KeyState { long start = Long.MIN_VALUE; int count; }
    FixedWindow(Clock c, int limit, long windowMs) { super(c, limit, windowMs); }
    protected W newState() { return new W(); }

    protected boolean tryTake(W w, long now) {
        long windowStart = now - Math.floorMod(now, windowMs);   // derived from the clock, not scheduled
        if (w.start != windowStart) { w.start = windowStart; w.count = 0; }   // the reset instant
        if (w.count < limit) { w.count++; return true; }
        return false;
    }
}

/** 2 · SLIDING WINDOW LOG — exactly correct, and memory grows with the request rate. */
final class SlidingLog extends KeyedLimiter<SlidingLog.L> {
    static final class L extends KeyState { final ArrayDeque<Long> stamps = new ArrayDeque<>(); }
    SlidingLog(Clock c, int limit, long windowMs) { super(c, limit, windowMs); }
    protected L newState() { return new L(); }

    protected boolean tryTake(L l, long now) {
        long cutoff = now - windowMs;
        while (!l.stamps.isEmpty() && l.stamps.peekFirst() <= cutoff) l.stamps.pollFirst();  // lazy eviction
        if (l.stamps.size() < limit) { l.stamps.addLast(now); return true; }
        return false;
    }
}

/** 3 · SLIDING WINDOW COUNTER — three numbers per key, approximately right. */
final class SlidingCounter extends KeyedLimiter<SlidingCounter.C> {
    static final class C extends KeyState { long start = Long.MIN_VALUE; int curr, prev; }
    SlidingCounter(Clock c, int limit, long windowMs) { super(c, limit, windowMs); }
    protected C newState() { return new C(); }

    protected boolean tryTake(C c, long now) {
        long windowStart = now - Math.floorMod(now, windowMs);
        if (windowStart != c.start) {
            // one window on -> the old current becomes the previous; a longer gap -> nothing carries over
            c.prev  = (c.start != Long.MIN_VALUE && windowStart - c.start == windowMs) ? c.curr : 0;
            c.curr  = 0;
            c.start = windowStart;
        }
        double elapsed  = (now - windowStart) / (double) windowMs;         // 0.0 .. 1.0
        double estimate = c.prev * (1.0 - elapsed) + c.curr;               // the weighted share
        if (estimate < limit) { c.curr++; return true; }
        return false;
    }
}

/** 4 · TOKEN BUCKET — lazy refill, allows a burst up to capacity. The usual default. */
final class TokenBucket extends KeyedLimiter<TokenBucket.B> {
    private final double capacity;
    private final double ratePerMs;

    TokenBucket(Clock c, int limit, long windowMs) {
        super(c, limit, windowMs);
        this.capacity  = limit;                        // burst size; a real system tunes this separately
        this.ratePerMs = limit / (double) windowMs;    // 5 per 60s -> 0.0000833 tokens per ms
    }
    static final class B extends KeyState { double tokens = -1; long lastRefill; }
    protected B newState() { return new B(); }

    protected boolean tryTake(B b, long now) {
        if (b.tokens < 0) { b.tokens = capacity; b.lastRefill = now; }      // a new key starts full
        b.tokens    = Math.min(capacity, b.tokens + (now - b.lastRefill) * ratePerMs);   // LAZY refill
        b.lastRefill = now;                                                 // no timer anywhere
        if (b.tokens >= 1.0) { b.tokens -= 1.0; return true; }
        return false;
    }

    double tokensFor(String key) { B b = byKey.get(key); return b == null ? capacity : b.tokens; }
}

/** 5 · LEAKY BUCKET — a fixed queue drained at a constant rate: smooths instead of bursting. */
final class LeakyBucket extends KeyedLimiter<LeakyBucket.Q> {
    private final double capacity;
    private final double leakPerMs;

    LeakyBucket(Clock c, int limit, long windowMs) {
        super(c, limit, windowMs);
        this.capacity  = limit;
        this.leakPerMs = limit / (double) windowMs;
    }
    static final class Q extends KeyState { double level; long lastLeak = Long.MIN_VALUE; }
    protected Q newState() { return new Q(); }

    protected boolean tryTake(Q q, long now) {
        if (q.lastLeak == Long.MIN_VALUE) q.lastLeak = now;
        q.level    = Math.max(0.0, q.level - (now - q.lastLeak) * leakPerMs);   // drain by elapsed time
        q.lastLeak = now;
        if (q.level + 1.0 <= capacity) { q.level += 1.0; return true; }         // joins the queue
        return false;                                                           // overflow -> dropped
    }
}

public class Main {
    static int fire(RateLimiter limiter, String key, int n) {
        int ok = 0;
        for (int i = 0; i < n; i++) if (limiter.allow(key)) ok++;
        return ok;
    }

    /** Five at 12:00:59, five at 12:01:01 — the whole problem, in six lines. */
    static void boundary(String label, Function<Clock, RateLimiter> make) {
        FakeClock clock = new FakeClock(0);
        RateLimiter limiter = make.apply(clock);
        clock.set(59_000);                          // 12:00:59 — last second of the window
        int first = fire(limiter, "user-42", 5);
        clock.set(61_000);                          // 12:01:01 — two seconds later
        int second = fire(limiter, "user-42", 5);
        System.out.printf("  %-18s %d at :59  +  %d at 1:01  =  %2d in 2 seconds%s%n",
                label, first, second, first + second, first + second > 5 ? "   <-- above the limit" : "");
    }

    public static void main(String[] args) throws Exception {
        System.out.println("== the boundary · limit 5 per 60s ==");
        boundary("fixed window",    c -> new FixedWindow(c, 5, 60_000));
        boundary("sliding log",     c -> new SlidingLog(c, 5, 60_000));
        boundary("sliding counter", c -> new SlidingCounter(c, 5, 60_000));
        boundary("token bucket",    c -> new TokenBucket(c, 5, 60_000));
        boundary("leaky bucket",    c -> new LeakyBucket(c, 5, 60_000));

        System.out.println();
        System.out.println("== lazy refill · tokens return because time passed, not because a thread ran ==");
        FakeClock clock = new FakeClock(0);
        TokenBucket bucket = new TokenBucket(clock, 5, 60_000);
        System.out.printf("  t=0s   allowed %d of 8   tokens left %.2f%n",
                fire(bucket, "user-42", 8), bucket.tokensFor("user-42"));
        clock.advance(30_000);
        System.out.printf("  t=30s  allowed %d of 8   tokens left %.2f%n",
                fire(bucket, "user-42", 8), bucket.tokensFor("user-42"));

        System.out.println();
        System.out.println("== per key · and the map that grows forever ==");
        FakeClock c2 = new FakeClock(0);
        TokenBucket perKey = new TokenBucket(c2, 5, 60_000);
        System.out.println("  user-42 hammered 20x -> allowed " + fire(perKey, "user-42", 20));
        System.out.println("  user-7  first call   -> " + perKey.allow("user-7"));
        System.out.println("  keys held: " + perKey.keyCount());
        c2.advance(10 * 60_000);
        System.out.println("  swept " + perKey.sweepIdle(5 * 60_000) + " idle keys -> keys held: " + perKey.keyCount());

        System.out.println();
        System.out.println("== 8 threads, 1 key, limit 10 ==");
        FakeClock c3 = new FakeClock(0);
        RateLimiter shared = new TokenBucket(c3, 10, 60_000);
        ExecutorService pool = Executors.newFixedThreadPool(8);
        List<Future<Integer>> futures = new ArrayList<>();
        for (int t = 0; t < 8; t++) futures.add(pool.submit(() -> fire(shared, "user-42", 5)));
        int total = 0;
        for (Future<Integer> f : futures) total += f.get();
        pool.shutdown();
        System.out.println("  40 requests attempted -> " + total + " allowed, never more than the limit");
    }
}

/* Expected output:
== the boundary · limit 5 per 60s ==
  fixed window       5 at :59  +  5 at 1:01  =  10 in 2 seconds   <-- above the limit
  sliding log        5 at :59  +  0 at 1:01  =   5 in 2 seconds
  sliding counter    5 at :59  +  1 at 1:01  =   6 in 2 seconds   <-- above the limit
  token bucket       5 at :59  +  0 at 1:01  =   5 in 2 seconds
  leaky bucket       5 at :59  +  0 at 1:01  =   5 in 2 seconds

== lazy refill · tokens return because time passed, not because a thread ran ==
  t=0s   allowed 5 of 8   tokens left 0.00
  t=30s  allowed 2 of 8   tokens left 0.50

== per key · and the map that grows forever ==
  user-42 hammered 20x -> allowed 5
  user-7  first call   -> true
  keys held: 2
  swept 2 idle keys -> keys held: 0

== 8 threads, 1 key, limit 10 ==
  40 requests attempted -> 10 allowed, never more than the limit

The sliding counter's 6 is not a bug: it is the approximation. It weights the
previous window by the fraction still inside the moving window, so one extra
request slips through one second past the boundary instead of five.
*/`,
      },
      {
        label: "Python",
        language: "python",
        filename: "rate_limiters.py",
        code: `from abc import ABC, abstractmethod
from collections import deque
from concurrent.futures import ThreadPoolExecutor
from threading import Lock
from typing import Callable


class RateLimiter(ABC):
    """The entire public surface. One method. Everything hard is behind it."""

    @abstractmethod
    def allow(self, key: str) -> bool: ...


class Clock(ABC):
    """Inject the clock, or a test for a 60-second window has to sleep for 60 seconds."""

    @abstractmethod
    def millis(self) -> int: ...


class SystemClock(Clock):
    def millis(self) -> int:
        import time
        return int(time.time() * 1000)


class FakeClock(Clock):
    def __init__(self, start: int = 0):
        self._now = start

    def millis(self) -> int:
        return self._now

    def set(self, ms: int) -> None:
        self._now = ms

    def advance(self, ms: int) -> None:
        self._now += ms


class KeyState:
    """Per-key state. last_seen exists only so idle keys can be swept."""

    def __init__(self):
        self.last_seen = 0
        self.lock = Lock()          # one lock per BUCKET, not one for the whole limiter


class KeyedLimiter(RateLimiter):
    """Everything the five algorithms share."""

    def __init__(self, clock: Clock, limit: int, window_ms: int):
        self.clock = clock
        self.limit = limit
        self.window_ms = window_ms
        self._by_key: dict[str, KeyState] = {}
        self._map_lock = Lock()

    def _new_state(self) -> KeyState:
        raise NotImplementedError

    def _try_take(self, state: KeyState, now: int) -> bool:
        raise NotImplementedError

    def allow(self, key: str) -> bool:
        with self._map_lock:                                  # only to create the bucket
            state = self._by_key.get(key)
            if state is None:
                state = self._by_key[key] = self._new_state()
        with state.lock:                                      # refill + check + take, atomically
            now = self.clock.millis()
            state.last_seen = now
            return self._try_take(state, now)

    def sweep_idle(self, idle_ms: int) -> int:
        """Without this the map grows forever — one entry per key ever seen."""
        cutoff = self.clock.millis() - idle_ms
        with self._map_lock:
            stale = [k for k, s in self._by_key.items() if s.last_seen < cutoff]
            for k in stale:
                del self._by_key[k]
            return len(stale)

    def key_count(self) -> int:
        return len(self._by_key)


class FixedWindow(KeyedLimiter):
    """1 · two numbers per key. Lets 2x the limit through at a boundary."""

    class W(KeyState):
        def __init__(self):
            super().__init__()
            self.start = None
            self.count = 0

    def _new_state(self): return FixedWindow.W()

    def _try_take(self, w: "FixedWindow.W", now: int) -> bool:
        window_start = now - (now % self.window_ms)      # derived from the clock, not scheduled
        if w.start != window_start:                      # the reset instant
            w.start, w.count = window_start, 0
        if w.count < self.limit:
            w.count += 1
            return True
        return False


class SlidingLog(KeyedLimiter):
    """2 · exactly correct, and memory grows with the request rate."""

    class L(KeyState):
        def __init__(self):
            super().__init__()
            self.stamps: deque[int] = deque()

    def _new_state(self): return SlidingLog.L()

    def _try_take(self, l: "SlidingLog.L", now: int) -> bool:
        cutoff = now - self.window_ms
        while l.stamps and l.stamps[0] <= cutoff:        # lazy eviction, on the way in
            l.stamps.popleft()
        if len(l.stamps) < self.limit:
            l.stamps.append(now)
            return True
        return False


class SlidingCounter(KeyedLimiter):
    """3 · three numbers per key, approximately right."""

    class C(KeyState):
        def __init__(self):
            super().__init__()
            self.start = None
            self.curr = 0
            self.prev = 0

    def _new_state(self): return SlidingCounter.C()

    def _try_take(self, c: "SlidingCounter.C", now: int) -> bool:
        window_start = now - (now % self.window_ms)
        if c.start != window_start:
            one_window_on = c.start is not None and window_start - c.start == self.window_ms
            c.prev = c.curr if one_window_on else 0
            c.curr = 0
            c.start = window_start
        elapsed = (now - window_start) / self.window_ms          # 0.0 .. 1.0
        estimate = c.prev * (1.0 - elapsed) + c.curr             # the weighted share
        if estimate < self.limit:
            c.curr += 1
            return True
        return False


class TokenBucket(KeyedLimiter):
    """4 · lazy refill, allows a burst up to capacity. The usual default."""

    class B(KeyState):
        def __init__(self):
            super().__init__()
            self.tokens = None
            self.last_refill = 0

    def __init__(self, clock: Clock, limit: int, window_ms: int):
        super().__init__(clock, limit, window_ms)
        self.capacity = float(limit)                    # burst size
        self.rate_per_ms = limit / window_ms            # 5 per 60s -> 0.0000833 per ms

    def _new_state(self): return TokenBucket.B()

    def _try_take(self, b: "TokenBucket.B", now: int) -> bool:
        if b.tokens is None:                            # a new key starts full
            b.tokens, b.last_refill = self.capacity, now
        b.tokens = min(self.capacity, b.tokens + (now - b.last_refill) * self.rate_per_ms)  # LAZY
        b.last_refill = now                             # no timer anywhere in this file
        if b.tokens >= 1.0:
            b.tokens -= 1.0
            return True
        return False

    def tokens_for(self, key: str) -> float:
        b = self._by_key.get(key)
        return self.capacity if b is None or b.tokens is None else b.tokens


class LeakyBucket(KeyedLimiter):
    """5 · a fixed queue drained at a constant rate: smooths instead of bursting."""

    class Q(KeyState):
        def __init__(self):
            super().__init__()
            self.level = 0.0
            self.last_leak = None

    def __init__(self, clock: Clock, limit: int, window_ms: int):
        super().__init__(clock, limit, window_ms)
        self.capacity = float(limit)
        self.leak_per_ms = limit / window_ms

    def _new_state(self): return LeakyBucket.Q()

    def _try_take(self, q: "LeakyBucket.Q", now: int) -> bool:
        if q.last_leak is None:
            q.last_leak = now
        q.level = max(0.0, q.level - (now - q.last_leak) * self.leak_per_ms)   # drain by elapsed time
        q.last_leak = now
        if q.level + 1.0 <= self.capacity:
            q.level += 1.0                                                     # joins the queue
            return True
        return False                                                           # overflow -> dropped


def fire(limiter: RateLimiter, key: str, n: int) -> int:
    return sum(1 for _ in range(n) if limiter.allow(key))


def boundary(label: str, make: Callable[[Clock], RateLimiter]) -> None:
    """Five at 12:00:59, five at 12:01:01 — the whole problem, in six lines."""
    clock = FakeClock(0)
    limiter = make(clock)
    clock.set(59_000)                       # 12:00:59 — last second of the window
    first = fire(limiter, "user-42", 5)
    clock.set(61_000)                       # 12:01:01 — two seconds later
    second = fire(limiter, "user-42", 5)
    flag = "   <-- above the limit" if first + second > 5 else ""
    print(f"  {label:<18} {first} at :59  +  {second} at 1:01  =  {first + second:2d} in 2 seconds{flag}")


if __name__ == "__main__":
    print("== the boundary · limit 5 per 60s ==")
    boundary("fixed window", lambda c: FixedWindow(c, 5, 60_000))
    boundary("sliding log", lambda c: SlidingLog(c, 5, 60_000))
    boundary("sliding counter", lambda c: SlidingCounter(c, 5, 60_000))
    boundary("token bucket", lambda c: TokenBucket(c, 5, 60_000))
    boundary("leaky bucket", lambda c: LeakyBucket(c, 5, 60_000))

    print()
    print("== lazy refill · tokens return because time passed, not because a thread ran ==")
    clock = FakeClock(0)
    bucket = TokenBucket(clock, 5, 60_000)
    print(f"  t=0s   allowed {fire(bucket, 'user-42', 8)} of 8   tokens left {bucket.tokens_for('user-42'):.2f}")
    clock.advance(30_000)
    print(f"  t=30s  allowed {fire(bucket, 'user-42', 8)} of 8   tokens left {bucket.tokens_for('user-42'):.2f}")

    print()
    print("== per key · and the map that grows forever ==")
    c2 = FakeClock(0)
    per_key = TokenBucket(c2, 5, 60_000)
    print(f"  user-42 hammered 20x -> allowed {fire(per_key, 'user-42', 20)}")
    print(f"  user-7  first call   -> {per_key.allow('user-7')}")
    print(f"  keys held: {per_key.key_count()}")
    c2.advance(10 * 60_000)
    print(f"  swept {per_key.sweep_idle(5 * 60_000)} idle keys -> keys held: {per_key.key_count()}")

    print()
    print("== 8 threads, 1 key, limit 10 ==")
    c3 = FakeClock(0)
    shared = TokenBucket(c3, 10, 60_000)
    with ThreadPoolExecutor(max_workers=8) as pool:
        total = sum(pool.map(lambda _: fire(shared, "user-42", 5), range(8)))
    print(f"  40 requests attempted -> {total} allowed, never more than the limit")

# Expected output:
# == the boundary · limit 5 per 60s ==
#   fixed window       5 at :59  +  5 at 1:01  =  10 in 2 seconds   <-- above the limit
#   sliding log        5 at :59  +  0 at 1:01  =   5 in 2 seconds
#   sliding counter    5 at :59  +  1 at 1:01  =   6 in 2 seconds   <-- above the limit
#   token bucket       5 at :59  +  0 at 1:01  =   5 in 2 seconds
#   leaky bucket       5 at :59  +  0 at 1:01  =   5 in 2 seconds
#
# == lazy refill · tokens return because time passed, not because a thread ran ==
#   t=0s   allowed 5 of 8   tokens left 0.00
#   t=30s  allowed 2 of 8   tokens left 0.50
#
# == per key · and the map that grows forever ==
#   user-42 hammered 20x -> allowed 5
#   user-7  first call   -> True
#   keys held: 2
#   swept 2 idle keys -> keys held: 0
#
# == 8 threads, 1 key, limit 10 ==
#   40 requests attempted -> 10 allowed, never more than the limit`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "rate_limiters.cpp",
        code: `#include <algorithm>
#include <chrono>
#include <deque>
#include <functional>
#include <iomanip>
#include <iostream>
#include <memory>
#include <mutex>
#include <string>
#include <thread>
#include <unordered_map>
#include <vector>

// The entire public surface. One method. Everything hard is behind it.
struct RateLimiter {
    virtual ~RateLimiter() = default;
    virtual bool allow(const std::string& key) = 0;
};

// Inject the clock, or a test for a 60-second window has to sleep for 60 seconds.
struct Clock {
    virtual ~Clock() = default;
    virtual long long millis() const = 0;
};

struct SystemClock : Clock {
    long long millis() const override {
        using namespace std::chrono;
        return duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
    }
};

struct FakeClock : Clock {
    long long now;
    explicit FakeClock(long long start = 0) : now(start) {}
    long long millis() const override { return now; }
    void set(long long ms)     { now = ms; }
    void advance(long long ms) { now += ms; }
};

// Per-key state. lastSeen exists only so idle keys can be swept.
struct KeyState {
    virtual ~KeyState() = default;
    long long lastSeen = 0;
    std::mutex m;                       // one mutex per BUCKET, not one for the limiter
};

class KeyedLimiter : public RateLimiter {
public:
    KeyedLimiter(const Clock& clock, int limit, long long windowMs)
        : clock_(clock), limit_(limit), windowMs_(windowMs) {}

    bool allow(const std::string& key) override {
        KeyState* state;
        {
            std::lock_guard<std::mutex> guard(mapMutex_);       // only to create the bucket
            auto it = byKey_.find(key);
            if (it == byKey_.end()) it = byKey_.emplace(key, newState()).first;
            state = it->second.get();
        }
        std::lock_guard<std::mutex> guard(state->m);            // refill + check + take, atomically
        long long now = clock_.millis();
        state->lastSeen = now;
        return tryTake(*state, now);
    }

    // Without this the map grows forever — one entry per key ever seen.
    int sweepIdle(long long idleMs) {
        long long cutoff = clock_.millis() - idleMs;
        std::lock_guard<std::mutex> guard(mapMutex_);
        int before = static_cast<int>(byKey_.size());
        for (auto it = byKey_.begin(); it != byKey_.end();)
            it = (it->second->lastSeen < cutoff) ? byKey_.erase(it) : std::next(it);
        return before - static_cast<int>(byKey_.size());
    }

    int keyCount() const { return static_cast<int>(byKey_.size()); }

protected:
    virtual std::unique_ptr<KeyState> newState() const = 0;
    virtual bool tryTake(KeyState& state, long long now) = 0;

    const Clock& clock_;
    int limit_;
    long long windowMs_;
    std::unordered_map<std::string, std::unique_ptr<KeyState>> byKey_;
    mutable std::mutex mapMutex_;
};

// 1 · FIXED WINDOW — two numbers per key. Lets 2x the limit through at a boundary.
class FixedWindow : public KeyedLimiter {
    struct W : KeyState { long long start = -1; int count = 0; };
public:
    using KeyedLimiter::KeyedLimiter;
protected:
    std::unique_ptr<KeyState> newState() const override { return std::make_unique<W>(); }
    bool tryTake(KeyState& s, long long now) override {
        auto& w = static_cast<W&>(s);
        long long windowStart = now - (now % windowMs_);        // derived, never scheduled
        if (w.start != windowStart) { w.start = windowStart; w.count = 0; }
        if (w.count < limit_) { ++w.count; return true; }
        return false;
    }
};

// 2 · SLIDING WINDOW LOG — exactly correct, and memory grows with the request rate.
class SlidingLog : public KeyedLimiter {
    struct L : KeyState { std::deque<long long> stamps; };
public:
    using KeyedLimiter::KeyedLimiter;
protected:
    std::unique_ptr<KeyState> newState() const override { return std::make_unique<L>(); }
    bool tryTake(KeyState& s, long long now) override {
        auto& l = static_cast<L&>(s);
        long long cutoff = now - windowMs_;
        while (!l.stamps.empty() && l.stamps.front() <= cutoff) l.stamps.pop_front();
        if (static_cast<int>(l.stamps.size()) < limit_) { l.stamps.push_back(now); return true; }
        return false;
    }
};

// 3 · SLIDING WINDOW COUNTER — three numbers per key, approximately right.
class SlidingCounter : public KeyedLimiter {
    struct C : KeyState { long long start = -1; bool seeded = false; int curr = 0, prev = 0; };
public:
    using KeyedLimiter::KeyedLimiter;
protected:
    std::unique_ptr<KeyState> newState() const override { return std::make_unique<C>(); }
    bool tryTake(KeyState& s, long long now) override {
        auto& c = static_cast<C&>(s);
        long long windowStart = now - (now % windowMs_);
        if (!c.seeded || c.start != windowStart) {
            c.prev   = (c.seeded && windowStart - c.start == windowMs_) ? c.curr : 0;
            c.curr   = 0;
            c.start  = windowStart;
            c.seeded = true;
        }
        double elapsed  = static_cast<double>(now - windowStart) / windowMs_;   // 0.0 .. 1.0
        double estimate = c.prev * (1.0 - elapsed) + c.curr;                    // weighted share
        if (estimate < limit_) { ++c.curr; return true; }
        return false;
    }
};

// 4 · TOKEN BUCKET — lazy refill, allows a burst up to capacity. The usual default.
class TokenBucket : public KeyedLimiter {
    struct B : KeyState { double tokens = -1; long long lastRefill = 0; };
public:
    TokenBucket(const Clock& c, int limit, long long windowMs)
        : KeyedLimiter(c, limit, windowMs),
          capacity_(limit), ratePerMs_(limit / static_cast<double>(windowMs)) {}

    double tokensFor(const std::string& key) {
        std::lock_guard<std::mutex> guard(mapMutex_);
        auto it = byKey_.find(key);
        if (it == byKey_.end()) return capacity_;
        double t = static_cast<B*>(it->second.get())->tokens;
        return t < 0 ? capacity_ : t;
    }
protected:
    std::unique_ptr<KeyState> newState() const override { return std::make_unique<B>(); }
    bool tryTake(KeyState& s, long long now) override {
        auto& b = static_cast<B&>(s);
        if (b.tokens < 0) { b.tokens = capacity_; b.lastRefill = now; }         // a new key starts full
        b.tokens = std::min(capacity_, b.tokens + (now - b.lastRefill) * ratePerMs_);   // LAZY refill
        b.lastRefill = now;                                                     // no timer anywhere
        if (b.tokens >= 1.0) { b.tokens -= 1.0; return true; }
        return false;
    }
private:
    double capacity_, ratePerMs_;
};

// 5 · LEAKY BUCKET — a fixed queue drained at a constant rate: smooths instead of bursting.
class LeakyBucket : public KeyedLimiter {
    struct Q : KeyState { double level = 0; long long lastLeak = -1; };
public:
    LeakyBucket(const Clock& c, int limit, long long windowMs)
        : KeyedLimiter(c, limit, windowMs),
          capacity_(limit), leakPerMs_(limit / static_cast<double>(windowMs)) {}
protected:
    std::unique_ptr<KeyState> newState() const override { return std::make_unique<Q>(); }
    bool tryTake(KeyState& s, long long now) override {
        auto& q = static_cast<Q&>(s);
        if (q.lastLeak < 0) q.lastLeak = now;
        q.level = std::max(0.0, q.level - (now - q.lastLeak) * leakPerMs_);     // drain by elapsed time
        q.lastLeak = now;
        if (q.level + 1.0 <= capacity_) { q.level += 1.0; return true; }        // joins the queue
        return false;                                                           // overflow -> dropped
    }
private:
    double capacity_, leakPerMs_;
};

static int fire(RateLimiter& limiter, const std::string& key, int n) {
    int ok = 0;
    for (int i = 0; i < n; ++i) if (limiter.allow(key)) ++ok;
    return ok;
}

using Make = std::function<std::unique_ptr<RateLimiter>(const Clock&)>;

// Five at 12:00:59, five at 12:01:01 — the whole problem, in six lines.
static void boundary(const std::string& label, const Make& make) {
    FakeClock clock(0);
    auto limiter = make(clock);
    clock.set(59000);                       // 12:00:59 — last second of the window
    int first = fire(*limiter, "user-42", 5);
    clock.set(61000);                       // 12:01:01 — two seconds later
    int second = fire(*limiter, "user-42", 5);
    std::cout << "  " << std::left << std::setw(18) << label << std::right
              << first << " at :59  +  " << second << " at 1:01  =  "
              << std::setw(2) << (first + second) << " in 2 seconds"
              << (first + second > 5 ? "   <-- above the limit" : "") << std::endl;
}

int main() {
    std::cout << "== the boundary · limit 5 per 60s ==" << std::endl;
    boundary("fixed window",    [](const Clock& c) { return std::unique_ptr<RateLimiter>(new FixedWindow(c, 5, 60000)); });
    boundary("sliding log",     [](const Clock& c) { return std::unique_ptr<RateLimiter>(new SlidingLog(c, 5, 60000)); });
    boundary("sliding counter", [](const Clock& c) { return std::unique_ptr<RateLimiter>(new SlidingCounter(c, 5, 60000)); });
    boundary("token bucket",    [](const Clock& c) { return std::unique_ptr<RateLimiter>(new TokenBucket(c, 5, 60000)); });
    boundary("leaky bucket",    [](const Clock& c) { return std::unique_ptr<RateLimiter>(new LeakyBucket(c, 5, 60000)); });

    std::cout << std::endl
              << "== lazy refill · tokens return because time passed, not because a thread ran ==" << std::endl;
    FakeClock clock(0);
    TokenBucket bucket(clock, 5, 60000);
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "  t=0s   allowed " << fire(bucket, "user-42", 8)
              << " of 8   tokens left " << bucket.tokensFor("user-42") << std::endl;
    clock.advance(30000);
    std::cout << "  t=30s  allowed " << fire(bucket, "user-42", 8)
              << " of 8   tokens left " << bucket.tokensFor("user-42") << std::endl;

    std::cout << std::endl << "== per key · and the map that grows forever ==" << std::endl;
    FakeClock c2(0);
    TokenBucket perKey(c2, 5, 60000);
    std::cout << "  user-42 hammered 20x -> allowed " << fire(perKey, "user-42", 20) << std::endl;
    std::cout << "  user-7  first call   -> " << (perKey.allow("user-7") ? "true" : "false") << std::endl;
    std::cout << "  keys held: " << perKey.keyCount() << std::endl;
    c2.advance(10 * 60000);
    std::cout << "  swept " << perKey.sweepIdle(5 * 60000)
              << " idle keys -> keys held: " << perKey.keyCount() << std::endl;

    std::cout << std::endl << "== 8 threads, 1 key, limit 10 ==" << std::endl;
    FakeClock c3(0);
    TokenBucket shared(c3, 10, 60000);
    std::vector<int> results(8, 0);
    std::vector<std::thread> workers;
    for (int t = 0; t < 8; ++t)
        workers.emplace_back([&shared, &results, t] { results[t] = fire(shared, "user-42", 5); });
    for (auto& w : workers) w.join();
    int total = 0;
    for (int r : results) total += r;
    std::cout << "  40 requests attempted -> " << total
              << " allowed, never more than the limit" << std::endl;
}

/* Expected output:
== the boundary · limit 5 per 60s ==
  fixed window       5 at :59  +  5 at 1:01  =  10 in 2 seconds   <-- above the limit
  sliding log        5 at :59  +  0 at 1:01  =   5 in 2 seconds
  sliding counter    5 at :59  +  1 at 1:01  =   6 in 2 seconds   <-- above the limit
  token bucket       5 at :59  +  0 at 1:01  =   5 in 2 seconds
  leaky bucket       5 at :59  +  0 at 1:01  =   5 in 2 seconds

== lazy refill · tokens return because time passed, not because a thread ran ==
  t=0s   allowed 5 of 8   tokens left 0.00
  t=30s  allowed 2 of 8   tokens left 0.50

== per key · and the map that grows forever ==
  user-42 hammered 20x -> allowed 5
  user-7  first call   -> true
  keys held: 2
  swept 2 idle keys -> keys held: 0

== 8 threads, 1 key, limit 10 ==
  40 requests attempted -> 10 allowed, never more than the limit
*/`,
      },
      {
        label: "Go",
        language: "go",
        filename: "rate_limiters.go",
        code: `package main

import (
	"fmt"
	"sync"
	"time"
)

// RateLimiter is the entire public surface. One method.
type RateLimiter interface {
	Allow(key string) bool
}

// Clock is injected, so a 60-second window is testable in microseconds.
type Clock interface {
	Millis() int64
}

type SystemClock struct{}

func (SystemClock) Millis() int64 { return time.Now().UnixMilli() }

type FakeClock struct{ now int64 }

func (c *FakeClock) Millis() int64    { return c.now }
func (c *FakeClock) Set(ms int64)     { c.now = ms }
func (c *FakeClock) Advance(ms int64) { c.now += ms }

// base is the per-key state every algorithm shares. lastSeen exists only so
// idle keys can be swept; mu guards THIS bucket, never the whole limiter.
type base struct {
	mu       sync.Mutex
	lastSeen int64
}

type bucket interface {
	state() *base
	tryTake(limit int, windowMs, now int64) bool
}

// keyed holds one bucket per key and does the locking. The five algorithms
// below only implement tryTake.
type keyed struct {
	clock    Clock
	limit    int
	windowMs int64
	newState func() bucket

	mu    sync.Mutex
	byKey map[string]bucket
}

func newKeyed(clock Clock, limit int, windowMs int64, newState func() bucket) *keyed {
	return &keyed{clock: clock, limit: limit, windowMs: windowMs,
		newState: newState, byKey: make(map[string]bucket)}
}

func (k *keyed) Allow(key string) bool {
	k.mu.Lock() // only to find or create the bucket
	b, ok := k.byKey[key]
	if !ok {
		b = k.newState()
		k.byKey[key] = b
	}
	k.mu.Unlock()

	st := b.state()
	st.mu.Lock() // refill + check + take, atomically, for THIS key only
	defer st.mu.Unlock()
	now := k.clock.Millis()
	st.lastSeen = now
	return b.tryTake(k.limit, k.windowMs, now)
}

// SweepIdle: without it the map grows forever — one entry per key ever seen.
func (k *keyed) SweepIdle(idleMs int64) int {
	cutoff := k.clock.Millis() - idleMs
	k.mu.Lock()
	defer k.mu.Unlock()
	removed := 0
	for key, b := range k.byKey {
		if b.state().lastSeen < cutoff {
			delete(k.byKey, key)
			removed++
		}
	}
	return removed
}

func (k *keyed) KeyCount() int {
	k.mu.Lock()
	defer k.mu.Unlock()
	return len(k.byKey)
}

// 1 · FIXED WINDOW — two numbers per key. Lets 2x the limit through at a boundary.
type fixedWindow struct {
	base
	start  int64
	count  int
	seeded bool
}

func (w *fixedWindow) state() *base { return &w.base }

func (w *fixedWindow) tryTake(limit int, windowMs, now int64) bool {
	windowStart := now - now%windowMs // derived from the clock, never scheduled
	if !w.seeded || w.start != windowStart {
		w.start, w.count, w.seeded = windowStart, 0, true
	}
	if w.count < limit {
		w.count++
		return true
	}
	return false
}

func NewFixedWindow(c Clock, limit int, windowMs int64) *keyed {
	return newKeyed(c, limit, windowMs, func() bucket { return &fixedWindow{} })
}

// 2 · SLIDING WINDOW LOG — exactly correct, and memory grows with the request rate.
type slidingLog struct {
	base
	stamps []int64
}

func (l *slidingLog) state() *base { return &l.base }

func (l *slidingLog) tryTake(limit int, windowMs, now int64) bool {
	cutoff := now - windowMs
	i := 0
	for i < len(l.stamps) && l.stamps[i] <= cutoff { // lazy eviction, on the way in
		i++
	}
	l.stamps = l.stamps[i:]
	if len(l.stamps) < limit {
		l.stamps = append(l.stamps, now)
		return true
	}
	return false
}

func NewSlidingLog(c Clock, limit int, windowMs int64) *keyed {
	return newKeyed(c, limit, windowMs, func() bucket { return &slidingLog{} })
}

// 3 · SLIDING WINDOW COUNTER — three numbers per key, approximately right.
type slidingCounter struct {
	base
	start      int64
	curr, prev int
	seeded     bool
}

func (c *slidingCounter) state() *base { return &c.base }

func (c *slidingCounter) tryTake(limit int, windowMs, now int64) bool {
	windowStart := now - now%windowMs
	if !c.seeded || c.start != windowStart {
		if c.seeded && windowStart-c.start == windowMs {
			c.prev = c.curr // exactly one window on: it still partly counts
		} else {
			c.prev = 0 // a longer gap: nothing carries over
		}
		c.curr, c.start, c.seeded = 0, windowStart, true
	}
	elapsed := float64(now-windowStart) / float64(windowMs)      // 0.0 .. 1.0
	estimate := float64(c.prev)*(1.0-elapsed) + float64(c.curr)  // the weighted share
	if estimate < float64(limit) {
		c.curr++
		return true
	}
	return false
}

func NewSlidingCounter(c Clock, limit int, windowMs int64) *keyed {
	return newKeyed(c, limit, windowMs, func() bucket { return &slidingCounter{} })
}

// 4 · TOKEN BUCKET — lazy refill, allows a burst up to capacity. The usual default.
type tokenBucket struct {
	base
	tokens     float64
	lastRefill int64
	seeded     bool
}

func (b *tokenBucket) state() *base { return &b.base }

func (b *tokenBucket) tryTake(limit int, windowMs, now int64) bool {
	capacity := float64(limit)
	ratePerMs := float64(limit) / float64(windowMs)
	if !b.seeded { // a new key starts full
		b.tokens, b.lastRefill, b.seeded = capacity, now, true
	}
	b.tokens += float64(now-b.lastRefill) * ratePerMs // LAZY refill
	if b.tokens > capacity {
		b.tokens = capacity // the overflow spills
	}
	b.lastRefill = now // no ticker, no goroutine, no scheduler
	if b.tokens >= 1.0 {
		b.tokens -= 1.0
		return true
	}
	return false
}

func NewTokenBucket(c Clock, limit int, windowMs int64) *keyed {
	return newKeyed(c, limit, windowMs, func() bucket { return &tokenBucket{} })
}

// 5 · LEAKY BUCKET — a fixed queue drained at a constant rate: smooths, does not burst.
type leakyBucket struct {
	base
	level    float64
	lastLeak int64
	seeded   bool
}

func (q *leakyBucket) state() *base { return &q.base }

func (q *leakyBucket) tryTake(limit int, windowMs, now int64) bool {
	capacity := float64(limit)
	leakPerMs := float64(limit) / float64(windowMs)
	if !q.seeded {
		q.lastLeak, q.seeded = now, true
	}
	q.level -= float64(now-q.lastLeak) * leakPerMs // drain by elapsed time
	if q.level < 0 {
		q.level = 0
	}
	q.lastLeak = now
	if q.level+1.0 <= capacity {
		q.level += 1.0 // joins the queue
		return true
	}
	return false // overflow: dropped
}

func NewLeakyBucket(c Clock, limit int, windowMs int64) *keyed {
	return newKeyed(c, limit, windowMs, func() bucket { return &leakyBucket{} })
}

func fire(limiter RateLimiter, key string, n int) int {
	ok := 0
	for i := 0; i < n; i++ {
		if limiter.Allow(key) {
			ok++
		}
	}
	return ok
}

// boundary: five at 12:00:59, five at 12:01:01 — the whole problem, in six lines.
func boundary(label string, make func(Clock) RateLimiter) {
	clock := &FakeClock{}
	limiter := make(clock)
	clock.Set(59000) // 12:00:59 — last second of the window
	first := fire(limiter, "user-42", 5)
	clock.Set(61000) // 12:01:01 — two seconds later
	second := fire(limiter, "user-42", 5)
	flag := ""
	if first+second > 5 {
		flag = "   <-- above the limit"
	}
	fmt.Printf("  %-18s %d at :59  +  %d at 1:01  =  %2d in 2 seconds%s\\n",
		label, first, second, first+second, flag)
}

func main() {
	fmt.Println("== the boundary · limit 5 per 60s ==")
	boundary("fixed window", func(c Clock) RateLimiter { return NewFixedWindow(c, 5, 60000) })
	boundary("sliding log", func(c Clock) RateLimiter { return NewSlidingLog(c, 5, 60000) })
	boundary("sliding counter", func(c Clock) RateLimiter { return NewSlidingCounter(c, 5, 60000) })
	boundary("token bucket", func(c Clock) RateLimiter { return NewTokenBucket(c, 5, 60000) })
	boundary("leaky bucket", func(c Clock) RateLimiter { return NewLeakyBucket(c, 5, 60000) })

	fmt.Println()
	fmt.Println("== lazy refill · tokens return because time passed, not because a goroutine ran ==")
	clock := &FakeClock{}
	tb := NewTokenBucket(clock, 5, 60000)
	fmt.Printf("  t=0s   allowed %d of 8\\n", fire(tb, "user-42", 8))
	clock.Advance(30000)
	fmt.Printf("  t=30s  allowed %d of 8\\n", fire(tb, "user-42", 8))

	fmt.Println()
	fmt.Println("== per key · and the map that grows forever ==")
	c2 := &FakeClock{}
	perKey := NewTokenBucket(c2, 5, 60000)
	fmt.Printf("  user-42 hammered 20x -> allowed %d\\n", fire(perKey, "user-42", 20))
	fmt.Printf("  user-7  first call   -> %v\\n", perKey.Allow("user-7"))
	fmt.Printf("  keys held: %d\\n", perKey.KeyCount())
	c2.Advance(10 * 60000)
	fmt.Printf("  swept %d idle keys -> keys held: %d\\n", perKey.SweepIdle(5*60000), perKey.KeyCount())

	fmt.Println()
	fmt.Println("== 8 goroutines, 1 key, limit 10 ==")
	c3 := &FakeClock{}
	shared := NewTokenBucket(c3, 10, 60000)
	results := make([]int, 8)
	var wg sync.WaitGroup
	for i := 0; i < 8; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			results[i] = fire(shared, "user-42", 5)
		}(i)
	}
	wg.Wait()
	total := 0
	for _, r := range results {
		total += r
	}
	fmt.Printf("  40 requests attempted -> %d allowed, never more than the limit\\n", total)
}

/* Expected output:
== the boundary · limit 5 per 60s ==
  fixed window       5 at :59  +  5 at 1:01  =  10 in 2 seconds   <-- above the limit
  sliding log        5 at :59  +  0 at 1:01  =   5 in 2 seconds
  sliding counter    5 at :59  +  1 at 1:01  =   6 in 2 seconds   <-- above the limit
  token bucket       5 at :59  +  0 at 1:01  =   5 in 2 seconds
  leaky bucket       5 at :59  +  0 at 1:01  =   5 in 2 seconds

== lazy refill · tokens return because time passed, not because a goroutine ran ==
  t=0s   allowed 5 of 8
  t=30s  allowed 2 of 8

== per key · and the map that grows forever ==
  user-42 hammered 20x -> allowed 5
  user-7  first call   -> true
  keys held: 2
  swept 2 idle keys -> keys held: 0

== 8 goroutines, 1 key, limit 10 ==
  40 requests attempted -> 10 allowed, never more than the limit
*/`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Strip the requests away and this is **a budget that refills with time**. You hold a small amount of state per subject, you derive the current allowance from the clock rather than from a timer, and you make check-and-take one indivisible step. Once you see that shape you find it everywhere.",
      },
      {
        type: "ul",
        items: [
          "**Retry and backoff budgets** — a client that may retry N times per minute is a token bucket with the sign flipped.",
          "**Circuit breakers** — the same per-key state machine over a rolling window of failures rather than requests.",
          "**Login throttling** — five attempts per account per fifteen minutes, and the boundary bug matters more here, because the limit is a security control.",
          "**Connection and thread admission** — take a permit or be refused. That is a token bucket with no refill, which is [[object-pool]].",
          "**Billing quotas and free tiers** — the window is a month and the key is an account, but the arithmetic is identical.",
          "**Traffic shaping in networks** — leaky bucket is literally where the name comes from; it is how routers have smoothed packet flow for decades.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The two-sentence version to say out loud",
        text: "*“The interface is one method; the design is choosing the algorithm. Fixed window is simplest but leaks 2× at a boundary, a log is exact but its memory grows with traffic, a sliding counter is the O(1) compromise, and a token bucket with lazy refill is what I would ship — it allows a controlled burst, needs no background thread, and is trivially testable if I inject the clock.”* That is 25 seconds and it covers most of the round.",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**Across processes.** An in-process map means the limit multiplies by the number of servers. The moment there is a second instance, the counter has to move to a shared store with an atomic increment.",
          "**When the limit protects something that must never be exceeded.** A third-party API with a hard 100/second cap and a financial penalty needs a leaky bucket or a distributed counter, not an approximation and not a burst.",
          "**When clients should be slowed rather than refused.** Refusing is right for a public API. A trusted internal caller is usually better off waiting — but then you have built a queue, and back-pressure, timeouts and fairness all become your problem.",
          "**When the key space is unbounded and hostile.** Limiting by IP invites an attacker to create millions of map entries. Bound the map before you need to.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Derive from the clock; never schedule.** The window resets because `now / windowMs` changed, and tokens reappear because time passed — not because a thread woke up. That one habit removes the background thread, removes the scheduler, and makes the whole limiter a pure function of state and time that you can test in a microsecond.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "A one-method interface means the algorithm is a construction-time choice, so “use a token bucket instead” is a one-line change at the call site rather than a rewrite.",
        "Lazy refill removes every timer and scheduler from the design — the limiter is a pure function of stored state and the current time.",
        "An injected clock makes a 60-second window testable in microseconds, which is the only reason the boundary case ever gets a test written for it.",
        "One small state object per key keeps memory at a couple of numbers per client for four of the five algorithms, so a million keys is still tens of megabytes.",
        "Locking the individual bucket rather than the limiter keeps unrelated keys completely independent, so one hot client never slows anyone else down.",
      ],
      cons: [
        "Fixed window is the simplest to explain and the one most often shipped, and it silently permits double the configured limit across every window boundary.",
        "The sliding window log is the only exactly correct option and its memory grows with the request rate, which rules it out precisely for the clients you most want to limit.",
        "The sliding window counter is an estimate that assumes the previous window's traffic was evenly spread, so a spiky client can be refused slightly early or let through slightly late.",
        "A token bucket permits a burst up to its capacity by design, so the peak load your service sees is capacity plus the steady rate — capacity is a real capacity-planning decision, not a tuning knob.",
        "The per-key map grows forever unless something sweeps idle keys, and with an attacker-controlled key space such as IP addresses that becomes a denial-of-service vector rather than a slow leak.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "Stripe — Scaling your API with rate limiters",
        href: "https://stripe.com/blog/rate-limiters",
        kind: "article",
        note: "How a payments API actually deploys several limiters at once: a request-rate limiter, a concurrency limiter and a fleet-usage load shedder. Read it for the reasoning about which requests to shed first.",
      },
      {
        label: "Cloudflare — How we built rate limiting capable of scaling to millions of domains",
        href: "https://blog.cloudflare.com/counting-things-a-lot-of-different-things/",
        kind: "article",
        note: "The sliding-window-counter approximation described from production, including how far off the estimate actually is (under 1% on their traffic).",
      },
      {
        label: "Redis INCR — the rate limiter pattern",
        href: "https://redis.io/docs/latest/commands/incr/",
        kind: "docs",
        note: "The canonical distributed answer, written out as INCR plus EXPIRE, including the race in the naive version and why the fix is a single atomic script.",
      },
      {
        label: "golang.org/x/time/rate — Go's token bucket limiter",
        href: "https://pkg.go.dev/golang.org/x/time/rate",
        kind: "docs",
        note: "A production token bucket in about 200 lines of readable Go, with lazy refill and a reservation API. Worth reading next to the Go sample above.",
      },
      {
        label: "RFC 6585 §4 — 429 Too Many Requests",
        href: "https://datatracker.ietf.org/doc/html/rfc6585#section-4",
        kind: "spec",
        note: "Three paragraphs, and it is the actual specification for the status code plus the Retry-After guidance. Being able to cite it costs nothing and reads well.",
      },
      {
        label: "Token bucket — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Token_bucket",
        kind: "article",
        note: "The formal definition alongside the leaky bucket article it links to; useful for getting the average-versus-constant-rate distinction phrased precisely.",
      },
      {
        label: "System Design Interview vol. 1 — Alex Xu, chapter 4 “Design a rate limiter”",
        kind: "book",
        note: "The chapter most interviewers have read. Covers the same five algorithms plus the distributed race and the header conventions, in interview language.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "rate-limiter-q1",
        question: "Limit is 5 per minute. A fixed-window counter sees 5 requests at 12:00:59 and 5 more at 12:01:01. What happens?",
        options: [
          { id: "a", label: "All ten are allowed — each minute individually holds exactly 5, so ten requests pass in two seconds." },
          { id: "b", label: "The second batch is refused, because the counter remembers the previous window." },
          { id: "c", label: "Five are allowed and five are queued until 12:02:00." },
          { id: "d", label: "The counter throws, because two windows overlap." },
        ],
        correctOptionId: "a",
        explanation:
          "At 12:01:00 the counter resets to zero and has no memory of the five requests one second earlier. (b) is the tempting answer because it describes what you *want* to happen — but nothing in a fixed-window implementation stores anything about the previous window. That is precisely what the sliding window counter adds.",
      },
      {
        id: "rate-limiter-q2",
        question: "A sliding window log is exactly correct. Why is it usually the wrong choice in production?",
        options: [
          { id: "a", label: "It stores one timestamp per request per key, so memory grows with the request rate — exactly for the clients you most want to limit." },
          { id: "b", label: "It is inaccurate near window boundaries." },
          { id: "c", label: "It needs a background thread to evict old entries." },
          { id: "d", label: "It cannot support per-key limits." },
        ],
        correctOptionId: "a",
        explanation:
          "A client sending 1000 requests a second stores 60,000 timestamps for a one-minute window — and an abusive client stores the most. (c) is wrong and worth noticing: eviction is lazy, done on the way in by popping stamps older than the cut-off, exactly like token-bucket refill.",
      },
      {
        id: "rate-limiter-q3",
        question: "A sliding window counter is 30% into the current window. The previous window counted 8, the current one counts 1, and the limit is 8. What does it estimate, and what does it do?",
        options: [
          { id: "a", label: "8 × (1 − 0.3) + 1 = 6.6 — below the limit, so the request is allowed." },
          { id: "b", label: "8 + 1 = 9 — above the limit, so the request is refused." },
          { id: "c", label: "8 × 0.3 + 1 = 3.4 — below the limit, so the request is allowed." },
          { id: "d", label: "It only looks at the current window's count of 1, so the request is allowed." },
        ],
        correctOptionId: "a",
        explanation:
          "The previous window is weighted by how much of it is still inside the moving window — 70% of it, since you are 30% through the current one. (c) is the tempting error: weighting by the elapsed fraction instead of the remaining one, which fades the previous window in rather than out.",
      },
      {
        id: "rate-limiter-q4",
        question: "In one line, what is the difference between a token bucket and a leaky bucket?",
        options: [
          { id: "a", label: "A token bucket limits the average rate and permits bursts up to its capacity; a leaky bucket enforces a constant output rate and smooths bursts away." },
          { id: "b", label: "A token bucket is exact and a leaky bucket is an approximation." },
          { id: "c", label: "A token bucket works per key and a leaky bucket is global." },
          { id: "d", label: "They are two names for the same algorithm." },
        ],
        correctOptionId: "a",
        explanation:
          "Both cap long-run throughput; they differ in what they do to a spike. The token bucket lets a saved-up burst through immediately, which is usually desirable. The leaky bucket admits it to a queue and releases it evenly, which is what you want when the thing downstream cannot absorb a spike.",
      },
      {
        id: "rate-limiter-q5",
        question: "How should a token bucket refill?",
        options: [
          { id: "a", label: "Lazily, on each call: tokens = min(capacity, tokens + elapsed × rate), using the time since lastRefill." },
          { id: "b", label: "With a scheduled task that adds tokens to every bucket once per second." },
          { id: "c", label: "With one thread per key, sleeping between refills." },
          { id: "d", label: "By resetting to full whenever the window rolls over." },
        ],
        correctOptionId: "a",
        explanation:
          "Deriving the refill from elapsed time removes the timer entirely, and the cost is the same whether you have ten keys or ten million. (b) is tempting because it matches the mental picture of tokens dripping in — but it means one scheduled task walking every bucket in the system, and it makes the limiter untestable without waiting in real time.",
      },
      {
        id: "rate-limiter-q6",
        question: "Two threads call allow() for the same key when one token remains. What must the design guarantee, and how?",
        options: [
          { id: "a", label: "Refill, check and take must be one indivisible step for that bucket — hold a lock on the bucket, not on the whole limiter." },
          { id: "b", label: "Make the whole allow() method synchronized, so all keys are serialised." },
          { id: "c", label: "Nothing — an occasional extra request past the limit is unavoidable." },
          { id: "d", label: "Give each thread its own bucket for the key." },
        ],
        correctOptionId: "a",
        explanation:
          "Both threads can read “1 token” before either writes, so the count can go to −1 — the same check-then-act race as two outlets checking one milk tank. (b) is correct but coarse: it makes every key in the system queue behind every other, and one lock per bucket costs nothing more to write.",
      },
      {
        id: "rate-limiter-q7",
        question: "The limiter keeps a ConcurrentHashMap from key to bucket, populated by computeIfAbsent. What is the problem nobody mentions?",
        options: [
          { id: "a", label: "Nothing ever removes entries, so the map grows forever — and if the key is an IP address, an attacker controls how fast." },
          { id: "b", label: "computeIfAbsent is not thread-safe." },
          { id: "c", label: "Buckets for different keys can interfere with each other." },
          { id: "d", label: "Hash collisions cause two keys to share a limit." },
        ],
        correctOptionId: "a",
        explanation:
          "It is a slow, ordinary memory leak that becomes an attack surface when the key space is attacker-controlled. Three accepted fixes: a periodic sweep of buckets whose lastSeen is old, a bounded LRU, or a store with native TTL — which is one more reason Redis is the standard distributed answer.",
      },
      {
        id: "rate-limiter-q8",
        question: "You deploy the same in-process limiter to four API servers behind a load balancer, configured at 100 requests per minute. What does a client actually get?",
        options: [
          { id: "a", label: "Up to 400 per minute, because each server keeps its own counter — the fix is a shared store with an atomic INCR and EXPIRE." },
          { id: "b", label: "Exactly 100 per minute, because the load balancer distributes evenly." },
          { id: "c", label: "25 per minute, because the limit is divided across the servers." },
          { id: "d", label: "It depends on the algorithm; a token bucket would still give exactly 100." },
        ],
        correctOptionId: "a",
        explanation:
          "The code is not wrong; the state is simply in four places. (d) is tempting because token buckets feel more “correct”, but the algorithm is irrelevant — any per-process state multiplies by the process count. The fix costs a network round trip per request, and you must decide in advance whether an unreachable Redis fails open or closed.",
      },
    ],
  },
};
