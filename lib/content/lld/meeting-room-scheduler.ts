import type { RoadmapLesson } from "@/lib/content/types";

export const meetingRoomScheduler: RoadmapLesson = {
  title: "Meeting room scheduler",
  oneLiner:
    "Every other problem in this set is about objects. This one is about **one line of code**: two intervals overlap if `aStart < bEnd && bStart < aEnd`. Get that line right — and get the `<` right, not `<=` — and the rest of the round is scaffolding. Get it wrong and every back-to-back booking in the building is refused.",
  difficulty: "intermediate",
  estimatedTime: "30 min",
  prototypePath: "/prototypes/lld/meeting-room-scheduler.html",
  content: {
    prototypeCaption:
      "A live day board: three rooms, hours 9→18, bookings drawn as blocks. Pick a room, a start hour and a duration and press **📅 Book** — the right-hand panel shows the overlap test being evaluated against every existing booking, with the real numbers substituted. Book **10–11** then **11–12**: both are allowed, because the intervals are half-open. Now flip the **`≤` inclusive** chip and book the same pair again — the second one is suddenly refused. Then press **⚔️ Two users book at once** in **⚠️ Unguarded** mode to put two bookings in one slot, and again under **🔒 Per-room lock** to watch the second be refused.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design a meeting room booking system for our office.”* Three rooms, a day, and people who want to book them. It sounds like the easiest problem in the set.",
      },
      {
        type: "p",
        text: "It is the easiest one to *start*. It is also the one most people get wrong, because the whole system rests on a single predicate — **do these two time ranges overlap?** — and there is a boundary case in it that almost everybody trips over.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A day view of an office. Three glass meeting rooms are listed down the left with their seat counts, and each has a horizontal timeline from nine in the morning to six in the evening with that day's meetings drawn as coloured blocks. On the right a person stands at a booking screen showing room R2, eleven to twelve, and a Book button, with an arrow from the screen into the grid labelled scheduler.book. Labels mark the nouns as the classes they become: Room, Booking, TimeSlot, Scheduler and User.">
  <defs>
    <marker id="mr-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <text x="24" y="24" font-size="9.5" fill="#9099a8">one day · 9:00 → 18:00</text>
  <text x="230" y="22" font-size="10" fill="#fb863a" text-anchor="middle">TimeSlot [11:00, 12:00)</text>
  <line x1="230" y1="26" x2="230" y2="40" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3"/>

  <text x="150" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">9</text>
  <text x="182" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">10</text>
  <text x="214" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">11</text>
  <text x="246" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">12</text>
  <text x="278" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">13</text>
  <text x="310" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">14</text>
  <text x="342" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">15</text>
  <text x="374" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">16</text>
  <text x="406" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">17</text>
  <text x="438" y="38" font-size="7.5" fill="#6b7280" text-anchor="middle">18</text>
  <path d="M214,42 L214,47 L246,47 L246,42" fill="none" stroke="#fb863a" stroke-width="1.2"/>

  <rect x="24" y="52" width="118" height="36" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <text x="34" y="70" font-size="9.5" fill="#e8e4dc">R1 · Huddle</text>
  <text x="34" y="82" font-size="8" fill="#6b7280">seats 4</text>
  <rect x="24" y="100" width="118" height="36" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <text x="34" y="118" font-size="9.5" fill="#e8e4dc">R2 · Sync</text>
  <text x="34" y="130" font-size="8" fill="#6b7280">seats 8 · projector</text>
  <rect x="24" y="148" width="118" height="36" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <text x="34" y="166" font-size="9.5" fill="#e8e4dc">R3 · Boardroom</text>
  <text x="34" y="178" font-size="8" fill="#6b7280">seats 12 · projector</text>

  <rect x="150" y="52" width="288" height="36" rx="4" fill="#14161a" stroke="#2d333d"/>
  <rect x="150" y="100" width="288" height="36" rx="4" fill="#14161a" stroke="#2d333d"/>
  <rect x="150" y="148" width="288" height="36" rx="4" fill="#14161a" stroke="#2d333d"/>

  <line x1="182" y1="52" x2="182" y2="184" stroke="#232830"/>
  <line x1="214" y1="52" x2="214" y2="184" stroke="#232830"/>
  <line x1="246" y1="52" x2="246" y2="184" stroke="#232830"/>
  <line x1="278" y1="52" x2="278" y2="184" stroke="#232830"/>
  <line x1="310" y1="52" x2="310" y2="184" stroke="#232830"/>
  <line x1="342" y1="52" x2="342" y2="184" stroke="#232830"/>
  <line x1="374" y1="52" x2="374" y2="184" stroke="#232830"/>
  <line x1="406" y1="52" x2="406" y2="184" stroke="#232830"/>

  <rect x="150" y="56" width="32" height="28" rx="3" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>
  <rect x="278" y="56" width="64" height="28" rx="3" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>
  <text x="284" y="74" font-size="7.5" fill="#5e9ff6">Retro</text>

  <rect x="182" y="104" width="64" height="28" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="188" y="122" font-size="7.5" fill="#fb863a">Design</text>
  <rect x="374" y="104" width="32" height="28" rx="3" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>

  <rect x="310" y="152" width="64" height="28" rx="3" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>
  <text x="316" y="170" font-size="7.5" fill="#5e9ff6">Interview</text>

  <rect x="486" y="52" width="204" height="124" rx="8" fill="#14161a" stroke="#3a414c"/>
  <text x="500" y="72" font-size="9" fill="#9099a8">book a room</text>
  <line x1="486" y1="80" x2="690" y2="80" stroke="#2d333d"/>
  <text x="500" y="98" font-size="9" fill="#e8e4dc">room:   R2 · Sync</text>
  <text x="500" y="116" font-size="9" fill="#e8e4dc">when:   11:00 – 12:00</text>
  <text x="500" y="134" font-size="9" fill="#9099a8">seats:  6 · projector yes</text>
  <rect x="500" y="144" width="80" height="22" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="512" y="159" font-size="9" fill="#fb863a">📅 Book</text>

  <circle cx="600" cy="208" r="12" fill="none" stroke="#9099a8" stroke-width="1.3"/>
  <path d="M582,250 Q600,220 618,250" fill="none" stroke="#9099a8" stroke-width="1.3"/>
  <text x="600" y="272" font-size="10.5" fill="#fb863a" text-anchor="middle">User</text>

  <path d="M486,168 C452,196 420,200 396,192" fill="none" stroke="#fb863a" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#mr-lead)"/>
  <text x="392" y="214" font-size="9.5" fill="#fb863a" text-anchor="end">Scheduler.book("R2", slot)</text>

  <text x="24" y="252" font-size="10.5" fill="#fb863a">Room</text>
  <line x1="44" y1="244" x2="66" y2="190" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#mr-lead)"/>
  <text x="24" y="268" font-size="8.5" fill="#9099a8">id · seats · features · lock</text>

  <text x="180" y="252" font-size="10.5" fill="#fb863a">Booking</text>
  <line x1="216" y1="244" x2="318" y2="190" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#mr-lead)"/>
  <text x="180" y="268" font-size="8.5" fill="#9099a8">room · slot · organiser · attendees</text>
</svg>`,
        caption:
          "Every noun on this picture is already a class. The one that does the work is the small orange bracket at the top: a **`TimeSlot`** is a pair of instants, and the entire system is one question asked about pairs of them.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **booking** is a room plus a `TimeSlot`. A slot is a half-open interval **`[start, end)`**, and two slots overlap **iff `aStart < bEnd && bStart < aEnd`**. Booking means: take the room's lock, ask that question against the room's existing bookings, and write only if the answer is no.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 250" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A two column scope board. The in-scope column lists rooms with capacity and features, booking and cancelling a slot, refusing overlaps, finding any free room, recurring series with an end date, and concurrent booking requests. The out-of-scope column lists authentication, email invite delivery, room hardware and displays, billing and floor plans, and federated cross-organisation calendars.">
  <text x="20" y="24" font-size="10.5" fill="#5cc66f">✓ IN SCOPE — say this out loud in minute two</text>
  <rect x="20" y="34" width="320" height="196" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="36" y="60" font-size="9.5" fill="#e8e4dc">rooms · capacity · features (projector, VC)</text>
  <text x="36" y="86" font-size="9.5" fill="#e8e4dc">book a slot · cancel a booking</text>
  <text x="36" y="112" font-size="9.5" fill="#e8e4dc">refuse anything that overlaps</text>
  <text x="36" y="138" font-size="9.5" fill="#e8e4dc">find ANY free room for a slot</text>
  <text x="36" y="164" font-size="9.5" fill="#e8e4dc">recurring series, with an end date</text>
  <text x="36" y="190" font-size="9.5" fill="#e8e4dc">two people booking at the same instant</text>
  <text x="36" y="216" font-size="9" fill="#5cc66f">six behaviours · all reachable in 60 minutes</text>

  <text x="364" y="24" font-size="10.5" fill="#6b7280">✗ OUT OF SCOPE — one sentence each, then move on</text>
  <rect x="364" y="34" width="316" height="196" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="380" y="60" font-size="9.5" fill="#9099a8">login, roles, who may book what</text>
  <text x="380" y="86" font-size="9.5" fill="#9099a8">sending calendar invites / email</text>
  <text x="380" y="112" font-size="9.5" fill="#9099a8">door locks, displays, occupancy sensors</text>
  <text x="380" y="138" font-size="9.5" fill="#9099a8">billing, catering, floor plans</text>
  <text x="380" y="164" font-size="9.5" fill="#9099a8">federating with external calendars</text>
  <text x="380" y="190" font-size="9.5" fill="#9099a8">persistence and a real database</text>
  <text x="380" y="216" font-size="9" fill="#6b7280">name them so they cannot be used against you</text>
</svg>`,
        caption:
          "Notice what stayed **in**: concurrency and recurrence. Those are the two places this problem gets interesting, and cutting them leaves you with a list and an `if`.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Is the overlap test one line?** `aStart < bEnd && bStart < aEnd`. If you write four `if` branches, the interviewer will find the wrong one — they always do.",
          "**Did you say `[start, end)` out loud?** Half-open intervals mean 10–11 and 11–12 do not conflict. State the convention before you write the code; the convention *is* part of the answer.",
          "**Do you know what a room lookup costs?** Linear scan is fine and you should say so — but you must be able to describe the sorted-list and interval-tree versions and when each earns its keep.",
          "**Is check-and-write atomic, and per room?** Two people clicking Book at the same instant is the second act of this problem. One lock **per room**, not one for the building.",
          "**Does it run?** A `main()` that books back-to-back slots successfully, refuses an overlap, finds any free room, and answers *“how many rooms do these five meetings need?”* with a min-heap.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      { type: "h", text: "Step 1 · Clarify — 4 minutes" },
      {
        type: "ul",
        items: [
          "**Can meetings be back-to-back?** — the single most valuable question in this round. Ask it, then answer it yourself: *“I will treat slots as half-open `[start, end)`, so 10–11 and 11–12 do not conflict.”*",
          "**Fixed rooms, or can rooms be added at runtime?** — a fixed list is fine; say the room set is data either way.",
          "**Do bookings have capacity and equipment requirements?** — yes, and they are **fields on `Room`**, not subclasses.",
          "**Recurring meetings?** — say yes, daily/weekly with an end date, and that you will generate occurrences from a rule rather than store a thousand rows.",
          "**Can two people book at once?** — say yes. This is the concurrency conversation, and it is worth more marks than everything else combined.",
          "**Timezones?** — store instants in UTC, keep the local time plus the zone for recurring rules. Two sentences, unprompted, and it lands well.",
          "**Auth, invites, hardware, billing?** — out of scope, one sentence.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Ask about back-to-back before you write anything",
        text: "It takes eight seconds and it decides your comparison operators. Candidates who skip it write `<=`, refuse every consecutive booking in the building, and then spend ten minutes debugging in front of the interviewer. Say the convention, write it as a comment above `overlaps()`, and move on.",
      },

      { type: "h", text: "Step 2 · The overlap test — the whole problem, in one line" },
      {
        type: "p",
        text: "Two intervals `[aStart, aEnd)` and `[bStart, bEnd)` overlap **if and only if `aStart < bEnd && bStart < aEnd`**. That is it. No case analysis, no branches, no ordering assumption — it is symmetric, so `overlaps(a, b)` and `overlaps(b, a)` are the same expression with the operands swapped.",
      },
      {
        type: "p",
        text: "The reasoning is worth saying out loud: *“A starts before B ends, and B starts before A ends. If either half fails, one of them is entirely finished before the other begins.”* Two comparisons, one for each direction.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 470" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Four interval pairs drawn on small timelines: a ends before b starts, a and b partly overlap, a sits inside b, and a contains b. Beside each pair the same single expression aStart less than bEnd and bStart less than aEnd is evaluated with the real numbers substituted, and each returns the correct answer. Below, the four-branch version that candidates typically write is shown in red beside the single return statement it collapses to.">
  <text x="20" y="24" font-size="11" fill="#5cc66f">✓ ONE LINE — aStart &lt; bEnd &amp;&amp; bStart &lt; aEnd  ·  every case, no branches</text>

  <text x="24" y="62" font-size="9.5" fill="#9099a8">a</text>
  <text x="24" y="77" font-size="9.5" fill="#9099a8">b</text>
  <rect x="36" y="50" width="224" height="30" rx="3" fill="#14161a" stroke="#2d333d"/>
  <rect x="64" y="53" width="56" height="11" rx="2" fill="rgba(251,134,58,0.22)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="148" y="68" width="56" height="11" rx="2" fill="rgba(94,159,246,0.22)" stroke="#5e9ff6"/>
  <text x="280" y="58" font-size="9.5" fill="#e8e4dc">10 &lt; 15  &amp;&amp;  13 &lt; 12</text>
  <text x="280" y="76" font-size="9.5" fill="#5cc66f">→ false · no conflict, book it</text>
  <text x="480" y="64" font-size="9.5" fill="#9099a8">a ends before b starts</text>

  <text x="24" y="136" font-size="9.5" fill="#9099a8">a</text>
  <text x="24" y="151" font-size="9.5" fill="#9099a8">b</text>
  <rect x="36" y="124" width="224" height="30" rx="3" fill="#14161a" stroke="#2d333d"/>
  <rect x="64" y="127" width="56" height="11" rx="2" fill="rgba(251,134,58,0.22)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="92" y="142" width="84" height="11" rx="2" fill="rgba(94,159,246,0.22)" stroke="#5e9ff6"/>
  <text x="280" y="132" font-size="9.5" fill="#e8e4dc">10 &lt; 14  &amp;&amp;  11 &lt; 12</text>
  <text x="280" y="150" font-size="9.5" fill="#f06868">→ true · refuse</text>
  <text x="480" y="138" font-size="9.5" fill="#9099a8">a and b partly overlap</text>

  <text x="24" y="210" font-size="9.5" fill="#9099a8">a</text>
  <text x="24" y="225" font-size="9.5" fill="#9099a8">b</text>
  <rect x="36" y="198" width="224" height="30" rx="3" fill="#14161a" stroke="#2d333d"/>
  <rect x="92" y="201" width="28" height="11" rx="2" fill="rgba(251,134,58,0.22)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="64" y="216" width="112" height="11" rx="2" fill="rgba(94,159,246,0.22)" stroke="#5e9ff6"/>
  <text x="280" y="206" font-size="9.5" fill="#e8e4dc">11 &lt; 14  &amp;&amp;  10 &lt; 12</text>
  <text x="280" y="224" font-size="9.5" fill="#f06868">→ true · refuse</text>
  <text x="480" y="212" font-size="9.5" fill="#9099a8">a sits entirely inside b</text>

  <text x="24" y="284" font-size="9.5" fill="#9099a8">a</text>
  <text x="24" y="299" font-size="9.5" fill="#9099a8">b</text>
  <rect x="36" y="272" width="224" height="30" rx="3" fill="#14161a" stroke="#2d333d"/>
  <rect x="36" y="275" width="168" height="11" rx="2" fill="rgba(251,134,58,0.22)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="92" y="290" width="28" height="11" rx="2" fill="rgba(94,159,246,0.22)" stroke="#5e9ff6"/>
  <text x="280" y="280" font-size="9.5" fill="#e8e4dc">9 &lt; 12  &amp;&amp;  11 &lt; 15</text>
  <text x="280" y="298" font-size="9.5" fill="#f06868">→ true · refuse</text>
  <text x="480" y="286" font-size="9.5" fill="#9099a8">a completely contains b</text>

  <line x1="20" y1="326" x2="700" y2="326" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="20" y="350" font-size="10.5" fill="#f06868">✗ WHAT CANDIDATES WRITE</text>
  <rect x="20" y="358" width="336" height="98" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="32" y="378" font-size="8.5" fill="#e8e4dc">if (aStart &gt;= bStart &amp;&amp; aStart &lt; bEnd) return true;</text>
  <text x="32" y="396" font-size="8.5" fill="#e8e4dc">if (bStart &gt;= aStart &amp;&amp; bStart &lt; aEnd) return true;</text>
  <text x="32" y="414" font-size="8.5" fill="#e8e4dc">if (aStart &lt;= bStart &amp;&amp; aEnd &gt;= bEnd)  return true;</text>
  <text x="32" y="432" font-size="8.5" fill="#e8e4dc">if (bStart &lt;= aStart &amp;&amp; bEnd &gt;= aEnd)  return true;</text>
  <text x="32" y="450" font-size="8.5" fill="#f06868">return false;   // eight chances to get one wrong</text>

  <text x="372" y="350" font-size="10.5" fill="#5cc66f">✓ WHAT IT COLLAPSES TO</text>
  <rect x="372" y="358" width="308" height="98" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="384" y="380" font-size="9.5" fill="#5cc66f">return aStart &lt; bEnd</text>
  <text x="384" y="398" font-size="9.5" fill="#5cc66f">    &amp;&amp; bStart &lt; aEnd;</text>
  <text x="384" y="422" font-size="8.5" fill="#9099a8">one comparison in each direction</text>
  <text x="384" y="440" font-size="8.5" fill="#9099a8">symmetric: overlaps(a,b) == overlaps(b,a)</text>
</svg>`,
        caption:
          "Look at the four expressions in the middle column: **they are the same expression four times**, only the numbers change. That is what “no case analysis” means, and it is why the one-liner cannot have a wrong branch — it has no branches.",
      },
      {
        type: "code",
        language: "java",
        filename: "the entire core of the problem",
        code: `/** Half-open [start, end): 10:00-11:00 and 11:00-12:00 do NOT conflict. */
record TimeSlot(Instant start, Instant end) {
    TimeSlot {
        if (!start.isBefore(end)) throw new IllegalArgumentException("end must be after start");
    }

    boolean overlaps(TimeSlot other) {
        return start.isBefore(other.end) && other.start.isBefore(end);
        //     aStart < bEnd            &&  bStart < aEnd
        //     strict "<" on both sides is what makes back-to-back legal
    }
}`,
      },

      { type: "h", text: "Step 3 · Half-open intervals, and the off-by-one that loses the round" },
      {
        type: "p",
        text: "A meeting from 10:00 to 11:00 **occupies** 10:00 and **does not occupy** 11:00. That is what `[start, end)` means: the start is included, the end is not. It is the same convention as a Python slice or a `for (i = start; i < end; i++)` loop, and it is the reason the operators are `<` and not `<=`.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 280" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two meetings drawn touching on a timeline: ten to eleven and eleven to twelve, with square bracket and round bracket notation showing the first ends exclusively at eleven and the second starts inclusively at eleven. Below, two evaluation boxes: with strict less-than the expression returns false so there is no conflict and the booking is allowed, and with less-than-or-equal the expression returns true so the booking is refused, which would refuse every back-to-back meeting in the building.">
  <text x="20" y="24" font-size="10.5" fill="#fb863a">two meetings that touch at 11:00</text>

  <line x1="60" y1="112" x2="620" y2="112" stroke="#2d333d"/>
  <text x="160" y="132" font-size="8.5" fill="#6b7280" text-anchor="middle">10:00</text>
  <text x="260" y="132" font-size="8.5" fill="#6b7280" text-anchor="middle">11:00</text>
  <text x="360" y="132" font-size="8.5" fill="#6b7280" text-anchor="middle">12:00</text>

  <rect x="160" y="70" width="100" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="210" y="92" font-size="9" fill="#fb863a" text-anchor="middle">standup</text>
  <rect x="260" y="70" width="100" height="34" rx="4" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>
  <text x="310" y="92" font-size="9" fill="#5e9ff6" text-anchor="middle">design</text>

  <text x="210" y="56" font-size="10" fill="#e8e4dc" text-anchor="middle">[10:00, 11:00)</text>
  <text x="310" y="56" font-size="10" fill="#e8e4dc" text-anchor="middle">[11:00, 12:00)</text>

  <text x="156" y="152" font-size="15" fill="#fb863a">[</text>
  <text x="250" y="152" font-size="15" fill="#fb863a">)</text>
  <text x="258" y="152" font-size="15" fill="#5e9ff6">[</text>
  <text x="352" y="152" font-size="15" fill="#5e9ff6">)</text>
  <line x1="260" y1="60" x2="260" y2="146" stroke="#9099a8" stroke-dasharray="3 3"/>
  <text x="376" y="150" font-size="9" fill="#9099a8">the end is excluded, the start is included —</text>
  <text x="376" y="164" font-size="9" fill="#9099a8">so nothing is ever double-counted at 11:00</text>

  <text x="20" y="192" font-size="10.5" fill="#5cc66f">✓ STRICT  &lt;</text>
  <rect x="20" y="200" width="320" height="66" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="34" y="222" font-size="9.5" fill="#e8e4dc">10 &lt; 12  &amp;&amp;  11 &lt; 11   →   true &amp;&amp; false</text>
  <text x="34" y="242" font-size="10" fill="#5cc66f">false — no conflict, the booking is allowed</text>
  <text x="34" y="258" font-size="8.5" fill="#9099a8">back-to-back meetings work, as everyone expects</text>

  <text x="364" y="192" font-size="10.5" fill="#f06868">✗ INCLUSIVE  &lt;=</text>
  <rect x="364" y="200" width="316" height="66" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="378" y="222" font-size="9.5" fill="#e8e4dc">10 &lt;= 12  &amp;&amp;  11 &lt;= 11  →  true &amp;&amp; true</text>
  <text x="378" y="242" font-size="10" fill="#f06868">true — refused, for touching at one instant</text>
  <text x="378" y="258" font-size="8.5" fill="#9099a8">every consecutive booking in the building breaks</text>
</svg>`,
        caption:
          "One character. Flip the **`≤` inclusive** chip in the prototype and book 10–11 then 11–12 — the second one is refused and the two blocks are drawn touching, so you can see there is nothing between them to fight over.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The convention is part of the answer",
        text: "Do not silently pick one. Say *“I am treating slots as half-open — `[start, end)` — so back-to-back bookings are legal”*, and put it in a comment. An interviewer who wanted the other convention will tell you, and either way you have shown you know the boundary exists. Silence here reads as luck.",
      },

      { type: "h", text: "Step 4 · The classes" },
      {
        type: "p",
        text: "Six types, and only one of them has interesting behaviour. `TimeSlot` is a value object — immutable, compared by value, and the owner of `overlaps()`. Putting the predicate anywhere else is the classic *feature envy* mistake: the method belongs to the data it interrogates. See [[immutability-and-value-objects]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 420" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. Scheduler holds many Rooms and exposes book, findRoom, cancel and roomsNeeded. Room carries an id, seat count, a feature set and its own lock, and delegates availability questions to an AvailabilityIndex. Booking holds a room id, an organiser, a TimeSlot, attendees and an optional RecurrenceRule. TimeSlot is a value object holding start and end instants and the overlaps method. AvailabilityIndex is an interface realised by LinearIndex, SortedIndex and IntervalTreeIndex.">
  <defs>
    <marker id="mr-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="248" y="14" width="230" height="86" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="260" y="34" font-size="11.5" fill="#fb863a">Scheduler</text>
  <line x1="248" y1="42" x2="478" y2="42" stroke="#2d333d"/>
  <text x="260" y="60" font-size="9.5" fill="#e8e4dc">+ book(roomId, slot) : Booking</text>
  <text x="260" y="76" font-size="9.5" fill="#e8e4dc">+ findRoom(slot, seats, features)</text>
  <text x="260" y="92" font-size="9.5" fill="#e8e4dc">+ cancel(id) · roomsNeeded(list)</text>

  <path d="M262,100 L262,114 L254,122 L262,130 L270,122 L262,114" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="262" y1="130" x2="180" y2="146" stroke="#d8d3c9" stroke-width="1.3"/>
  <text x="196" y="128" font-size="9" fill="#9099a8">1..*</text>

  <rect x="30" y="150" width="196" height="98" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="42" y="170" font-size="11.5" fill="#e8e4dc">Room</text>
  <line x1="30" y1="178" x2="226" y2="178" stroke="#2d333d"/>
  <text x="42" y="196" font-size="9.5" fill="#9099a8">- id · label : String</text>
  <text x="42" y="212" font-size="9.5" fill="#9099a8">- seats : int</text>
  <text x="42" y="228" font-size="9.5" fill="#9099a8">- features : Set&lt;Feature&gt;</text>
  <text x="42" y="244" font-size="9.5" fill="#fb863a">- lock : Lock  «per room»</text>

  <line x1="380" y1="100" x2="380" y2="146" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#mr-a)"/>
  <rect x="278" y="150" width="196" height="98" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="290" y="170" font-size="11.5" fill="#e8e4dc">Booking</text>
  <line x1="278" y1="178" x2="474" y2="178" stroke="#2d333d"/>
  <text x="290" y="196" font-size="9.5" fill="#9099a8">- id · roomId : String</text>
  <text x="290" y="212" font-size="9.5" fill="#9099a8">- organiser : String</text>
  <text x="290" y="228" font-size="9.5" fill="#fb863a">- slot : TimeSlot</text>
  <text x="290" y="244" font-size="9.5" fill="#9099a8">- attendees : List&lt;String&gt;</text>

  <line x1="482" y1="198" x2="518" y2="198" stroke="#9099a8" stroke-width="1.2" marker-end="url(#mr-a)"/>
  <rect x="522" y="150" width="176" height="98" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.3"/>
  <text x="534" y="170" font-size="11.5" fill="#5cc66f">TimeSlot</text>
  <text x="612" y="170" font-size="8" fill="#6b7280">«value»</text>
  <line x1="522" y1="178" x2="698" y2="178" stroke="#2d333d"/>
  <text x="534" y="196" font-size="9.5" fill="#9099a8">- start : Instant</text>
  <text x="534" y="212" font-size="9.5" fill="#9099a8">- end : Instant</text>
  <text x="534" y="230" font-size="9.5" fill="#fb863a">+ overlaps(other)</text>
  <text x="534" y="244" font-size="8.5" fill="#6b7280">half-open [start, end)</text>

  <line x1="610" y1="248" x2="610" y2="276" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="4 3"/>
  <rect x="522" y="280" width="176" height="86" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="534" y="300" font-size="11.5" fill="#e8e4dc">RecurrenceRule</text>
  <line x1="522" y1="308" x2="698" y2="308" stroke="#2d333d"/>
  <text x="534" y="326" font-size="9.5" fill="#9099a8">- freq : DAILY | WEEKLY</text>
  <text x="534" y="342" font-size="9.5" fill="#9099a8">- until : LocalDate</text>
  <text x="534" y="358" font-size="9.5" fill="#fb863a">- zone : ZoneId</text>

  <line x1="128" y1="248" x2="128" y2="276" stroke="#d8d3c9" stroke-width="1.3" marker-end="url(#mr-a)"/>
  <rect x="30" y="280" width="196" height="60" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="42" y="300" font-size="11" fill="#5e9ff6">AvailabilityIndex</text>
  <text x="164" y="300" font-size="8" fill="#6b7280">«interface»</text>
  <line x1="30" y1="308" x2="226" y2="308" stroke="#2d333d"/>
  <text x="42" y="326" font-size="9.5" fill="#e8e4dc">+ firstConflict(slot) : Booking?</text>

  <line x1="128" y1="340" x2="128" y2="356" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3"/>
  <line x1="66" y1="356" x2="300" y2="356" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3"/>
  <line x1="66" y1="356" x2="66" y2="370" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3"/>
  <line x1="180" y1="356" x2="180" y2="370" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3"/>
  <line x1="300" y1="356" x2="300" y2="370" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3"/>

  <rect x="20" y="372" width="92" height="38" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="30" y="390" font-size="9" fill="#e8e4dc">LinearIndex</text>
  <text x="30" y="403" font-size="8" fill="#6b7280">O(n)</text>
  <rect x="134" y="372" width="92" height="38" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="144" y="390" font-size="9" fill="#e8e4dc">SortedIndex</text>
  <text x="144" y="403" font-size="8" fill="#6b7280">O(log n)</text>
  <rect x="254" y="372" width="122" height="38" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="264" y="390" font-size="9" fill="#e8e4dc">IntervalTreeIndex</text>
  <text x="264" y="403" font-size="8" fill="#6b7280">O(log n) + ranges</text>

  <text x="396" y="392" font-size="9" fill="#9099a8">swap the index without</text>
  <text x="396" y="406" font-size="9" fill="#9099a8">touching Scheduler or Room</text>
</svg>`,
        caption:
          "Two things to look at. The **lock lives on `Room`**, so two rooms never wait on each other. And `AvailabilityIndex` is a [[strategy]] seam — start with `LinearIndex`, and the upgrade is a constructor argument, not a rewrite. Notation: [[class-diagrams]].",
      },

      { type: "h", text: "Step 5 · Finding a room, three ways — and what each really costs" },
      {
        type: "p",
        text: "*“How do you check whether a room is free?”* The honest first answer is: **loop over that room's bookings for that day and run `overlaps()` on each.** A room has maybe fifteen bookings in a day. Fifteen comparisons is nothing. Say this, and say that you would only change it under measurement — over-engineering here is a real way to lose marks.",
      },
      {
        type: "p",
        text: "Then show you know the upgrades exist. If the bookings for a room are kept **sorted by start and non-overlapping**, you can binary-search for the insertion point and check only **two** bookings: the one immediately before and the one immediately after. Nothing else can reach across them, because if it did, it would be overlapping its own neighbour — and the list is non-overlapping by construction.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 240" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A room's bookings held in a list sorted by start time. Binary search for a new booking starting at thirteen probes the middle entries and lands on insertion point three. Only the two neighbouring bookings, twelve to thirteen and fourteen to fifteen, are highlighted and checked with the overlap expression; every other booking is greyed out because a sorted non-overlapping list means nothing else can reach across them.">
  <text x="24" y="22" font-size="10" fill="#fb863a">insert [13:00, 14:00) — binary search for the insertion point</text>
  <text x="24" y="40" font-size="9" fill="#9099a8">mid = 3 → [14,15) starts at 14 &gt; 13 · go left</text>
  <text x="24" y="55" font-size="9" fill="#9099a8">mid = 1 → [10,11) starts at 10 ≤ 13 · go right</text>
  <text x="24" y="70" font-size="9" fill="#9099a8">mid = 2 → [12,13) starts at 12 ≤ 13 · go right  →  insertion point = 3</text>

  <rect x="24" y="84" width="88" height="34" rx="4" fill="#14161a" stroke="#2d333d" opacity="0.35"/>
  <text x="40" y="105" font-size="9" fill="#6b7280">[9,10)</text>
  <rect x="116" y="84" width="88" height="34" rx="4" fill="#14161a" stroke="#2d333d" opacity="0.35"/>
  <text x="130" y="105" font-size="9" fill="#6b7280">[10,11)</text>
  <rect x="208" y="84" width="88" height="34" rx="4" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="222" y="105" font-size="9" fill="#fb863a">[12,13)</text>
  <rect x="300" y="84" width="88" height="34" rx="4" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="314" y="105" font-size="9" fill="#fb863a">[14,15)</text>
  <rect x="392" y="84" width="88" height="34" rx="4" fill="#14161a" stroke="#2d333d" opacity="0.35"/>
  <text x="406" y="105" font-size="9" fill="#6b7280">[15,16)</text>
  <rect x="484" y="84" width="88" height="34" rx="4" fill="#14161a" stroke="#2d333d" opacity="0.35"/>
  <text x="498" y="105" font-size="9" fill="#6b7280">[16,17)</text>
  <rect x="576" y="84" width="88" height="34" rx="4" fill="#14161a" stroke="#2d333d" opacity="0.35"/>
  <text x="590" y="105" font-size="9" fill="#6b7280">[17,18)</text>

  <path d="M208,126 L208,134 L388,134 L388,126" fill="none" stroke="#fb863a" stroke-width="1.2"/>
  <text x="298" y="152" font-size="9.5" fill="#fb863a" text-anchor="middle">the only two that can possibly conflict</text>

  <text x="24" y="180" font-size="9.5" fill="#e8e4dc">prev [12,13) :  13 &lt; 13  &amp;&amp;  12 &lt; 14   →   false</text>
  <text x="24" y="198" font-size="9.5" fill="#e8e4dc">next [14,15) :  13 &lt; 15  &amp;&amp;  14 &lt; 14   →   false</text>
  <text x="392" y="180" font-size="9.5" fill="#5cc66f">free — insert at index 3</text>
  <text x="392" y="198" font-size="9" fill="#9099a8">two comparisons, not seven</text>
  <text x="24" y="226" font-size="9" fill="#9099a8">the list is sorted AND non-overlapping, so anything further away would have to cross a neighbour first</text>
</svg>`,
        caption:
          "The interesting part is not the binary search — it is the **invariant**. Because the list is kept non-overlapping, an entry three positions away *cannot* reach your slot without first overlapping the entry next to it. That argument is what earns the mark.",
      },
      {
        type: "p",
        text: "The third option is an **interval tree**: a balanced BST keyed by `start`, where every node also stores `maxEnd` — the largest end time anywhere in its subtree. The pruning rule is the whole idea: *if a subtree's `maxEnd` is `<=` your query start, nothing in that entire subtree can overlap you, so skip it.* That single check turns a walk of the whole tree into a walk of one path.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 340" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An interval tree keyed by start time. Each node shows its interval and the maximum end time in its subtree. Querying for anything overlapping thirteen to fourteen starts at the root twelve to thirteen, then skips the entire left subtree because its maxEnd of eleven is less than or equal to the query start of thirteen, shown by a dashed red box over those nodes. The walk continues down the right side and finds no overlap.">
  <defs>
    <marker id="mr-edge" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#9099a8"/></marker>
  </defs>

  <text x="20" y="24" font-size="10.5" fill="#fb863a">query: does anything overlap [13:00, 14:00) ?</text>

  <line x1="330" y1="70" x2="200" y2="112" stroke="#9099a8" stroke-width="1.2" marker-end="url(#mr-edge)"/>
  <line x1="380" y1="70" x2="510" y2="112" stroke="#9099a8" stroke-width="1.2" marker-end="url(#mr-edge)"/>
  <line x1="210" y1="146" x2="250" y2="186" stroke="#9099a8" stroke-width="1.2" marker-end="url(#mr-edge)"/>
  <line x1="500" y1="146" x2="460" y2="186" stroke="#9099a8" stroke-width="1.2" marker-end="url(#mr-edge)"/>
  <line x1="500" y1="220" x2="580" y2="250" stroke="#9099a8" stroke-width="1.2" marker-end="url(#mr-edge)"/>

  <rect x="100" y="100" width="230" height="124" rx="8" fill="rgba(240,104,104,0.07)" stroke="rgba(240,104,104,0.5)" stroke-dasharray="5 4"/>

  <rect x="298" y="36" width="114" height="34" rx="5" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="308" y="52" font-size="9" fill="#e8e4dc">[12,13)</text>
  <text x="308" y="65" font-size="8" fill="#fb863a">maxEnd 18</text>

  <rect x="120" y="112" width="114" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="130" y="128" font-size="9" fill="#6b7280">[9,10)</text>
  <text x="130" y="141" font-size="8" fill="#f06868">maxEnd 11</text>

  <rect x="200" y="186" width="114" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="210" y="202" font-size="9" fill="#6b7280">[10,11)</text>
  <text x="210" y="215" font-size="8" fill="#6b7280">maxEnd 11</text>

  <rect x="470" y="112" width="114" height="34" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <text x="480" y="128" font-size="9" fill="#e8e4dc">[15,16)</text>
  <text x="480" y="141" font-size="8" fill="#5e9ff6">maxEnd 18</text>

  <rect x="392" y="186" width="114" height="34" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <text x="402" y="202" font-size="9" fill="#e8e4dc">[14,15)</text>
  <text x="402" y="215" font-size="8" fill="#5e9ff6">maxEnd 15</text>

  <rect x="560" y="250" width="114" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="570" y="266" font-size="9" fill="#6b7280">[17,18)</text>
  <text x="570" y="279" font-size="8" fill="#6b7280">maxEnd 18</text>

  <text x="104" y="240" font-size="9.5" fill="#f06868">maxEnd 11 ≤ query start 13</text>
  <text x="104" y="254" font-size="9.5" fill="#f06868">→ skip this whole subtree</text>

  <text x="20" y="304" font-size="9" fill="#9099a8">root  [12,13) :  13 &lt; 13 → false · no overlap · left subtree pruned, go right</text>
  <text x="20" y="322" font-size="9" fill="#5cc66f">[15,16) then [14,15) : still false → the slot is free, in one path instead of six nodes</text>
</svg>`,
        caption:
          "Follow the dashed red box. **Two nodes were never visited** — not because of the interval in them, but because of the `maxEnd` summary carried by their parent. Naming the structure is worth nothing; explaining this rule is worth everything.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 220" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A cost table comparing three availability structures. Linear scan costs order n per query and order one to insert, and is the right answer for a single building. A sorted structure keyed by start costs order log n to query and insert, and suits a room with a long history. An interval tree with maxEnd costs order log n for both and also answers range queries, and suits a calendar view over many rooms and a long horizon.">
  <text x="24" y="26" font-size="9" fill="#6b7280">STRUCTURE</text>
  <text x="266" y="26" font-size="9" fill="#6b7280">QUERY</text>
  <text x="368" y="26" font-size="9" fill="#6b7280">INSERT</text>
  <text x="466" y="26" font-size="9" fill="#6b7280">WHEN YOU WOULD ACTUALLY REACH FOR IT</text>
  <line x1="24" y1="36" x2="696" y2="36" stroke="#3a414c"/>

  <text x="24" y="62" font-size="10" fill="#5cc66f">linear scan over a day</text>
  <text x="24" y="78" font-size="8.5" fill="#9099a8">a list, one overlaps() per booking</text>
  <text x="266" y="62" font-size="10" fill="#e8e4dc">O(n)</text>
  <text x="368" y="62" font-size="10" fill="#e8e4dc">O(1)</text>
  <text x="466" y="62" font-size="9" fill="#5cc66f">always, first. n is one day in one room</text>
  <text x="466" y="78" font-size="9" fill="#9099a8">— tens of entries. Ship this.</text>
  <line x1="24" y1="92" x2="696" y2="92" stroke="#232830"/>

  <text x="24" y="118" font-size="10" fill="#e8e4dc">sorted by start</text>
  <text x="24" y="134" font-size="8.5" fill="#9099a8">binary search, check 2 neighbours</text>
  <text x="266" y="118" font-size="10" fill="#e8e4dc">O(log n)</text>
  <text x="368" y="118" font-size="10" fill="#e8e4dc">O(log n)</text>
  <text x="466" y="118" font-size="9" fill="#9099a8">one room with a long history, or</text>
  <text x="466" y="134" font-size="9" fill="#9099a8">when you also want the next free gap</text>
  <line x1="24" y1="148" x2="696" y2="148" stroke="#232830"/>

  <text x="24" y="174" font-size="10" fill="#e8e4dc">interval tree (maxEnd)</text>
  <text x="24" y="190" font-size="8.5" fill="#9099a8">augmented BST, prune by maxEnd</text>
  <text x="266" y="174" font-size="10" fill="#e8e4dc">O(log n)</text>
  <text x="368" y="174" font-size="10" fill="#e8e4dc">O(log n)</text>
  <text x="466" y="174" font-size="9" fill="#9099a8">a calendar view: “everything overlapping</text>
  <text x="466" y="190" font-size="9" fill="#9099a8">this window”, across rooms and months</text>
</svg>`,
        caption:
          "Read the right-hand column, not the middle one. The costs are easy; knowing that **linear is the correct answer for a building** and being able to say why is the harder and more valuable thing.",
      },

      { type: "h", text: "The classic follow-up: how many rooms do these meetings need?" },
      {
        type: "p",
        text: "*“Forget my building. Here are N meetings — what is the minimum number of rooms that could hold them all?”* This gets asked almost every time, and it has a clean answer: **sort by start time, and keep a min-heap of end times.**",
      },
      {
        type: "ol",
        items: [
          "Sort the meetings by **start**.",
          "For each meeting: if the heap is non-empty and its **smallest end time is `<=` this meeting's start**, that room has freed up — pop it. (Half-open again: a room that ends exactly when this one starts is reusable.)",
          "Push this meeting's end time. That is the room it is now sitting in.",
          "The **peak size of the heap** across the whole walk is the number of rooms you need.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 375" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Five meetings drawn on a timeline from nine to fifteen, with a dashed line at half past ten showing three of them running at once. Below, five step cards walk the min-heap algorithm left to right: each card names the meeting, compares the smallest end time in the heap with the meeting's start, decides whether to open a new room or reuse one, and shows the heap contents. The third card, where the heap first reaches three entries, is highlighted, and the answer rooms needed equals three is shown at the bottom.">
  <text x="40" y="36" font-size="7.5" fill="#6b7280" text-anchor="middle">9</text>
  <text x="140" y="36" font-size="7.5" fill="#6b7280" text-anchor="middle">10</text>
  <text x="240" y="36" font-size="7.5" fill="#6b7280" text-anchor="middle">11</text>
  <text x="340" y="36" font-size="7.5" fill="#6b7280" text-anchor="middle">12</text>
  <text x="440" y="36" font-size="7.5" fill="#6b7280" text-anchor="middle">13</text>
  <text x="540" y="36" font-size="7.5" fill="#6b7280" text-anchor="middle">14</text>
  <text x="640" y="36" font-size="7.5" fill="#6b7280" text-anchor="middle">15</text>

  <rect x="40" y="44" width="300" height="18" rx="3" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>
  <text x="48" y="57" font-size="8" fill="#5e9ff6">A [9,12)</text>
  <rect x="40" y="68" width="200" height="18" rx="3" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>
  <text x="48" y="81" font-size="8" fill="#5e9ff6">B [9,11)</text>
  <rect x="140" y="92" width="300" height="18" rx="3" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>
  <text x="148" y="105" font-size="8" fill="#5e9ff6">C [10,13)</text>
  <rect x="240" y="116" width="100" height="18" rx="3" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>
  <text x="248" y="129" font-size="8" fill="#5e9ff6">D [11,12)</text>
  <rect x="440" y="140" width="200" height="18" rx="3" fill="rgba(94,159,246,0.18)" stroke="#5e9ff6"/>
  <text x="448" y="153" font-size="8" fill="#5e9ff6">E [13,15)</text>

  <line x1="190" y1="40" x2="190" y2="162" stroke="#fb863a" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="196" y="174" font-size="9" fill="#fb863a">at 10:30 three meetings are running at once</text>

  <rect x="20" y="190" width="132" height="112" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="30" y="208" font-size="8.5" fill="#fb863a">1 · A starts 9</text>
  <text x="30" y="226" font-size="8.5" fill="#e8e4dc">heap empty</text>
  <text x="30" y="244" font-size="8.5" fill="#fb863a">→ open a room</text>
  <text x="30" y="264" font-size="8" fill="#6b7280">heap of end times</text>
  <rect x="30" y="272" width="34" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/>
  <text x="38" y="284" font-size="8" fill="#e8e4dc">12</text>

  <rect x="160" y="190" width="132" height="112" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="170" y="208" font-size="8.5" fill="#fb863a">2 · B starts 9</text>
  <text x="170" y="226" font-size="8.5" fill="#e8e4dc">min end 12 &gt; 9</text>
  <text x="170" y="244" font-size="8.5" fill="#fb863a">→ open a room</text>
  <text x="170" y="264" font-size="8" fill="#6b7280">heap of end times</text>
  <rect x="170" y="272" width="34" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/>
  <text x="178" y="284" font-size="8" fill="#e8e4dc">11</text>
  <rect x="208" y="272" width="34" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/>
  <text x="216" y="284" font-size="8" fill="#e8e4dc">12</text>

  <rect x="300" y="190" width="132" height="112" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.4"/>
  <text x="310" y="208" font-size="8.5" fill="#fb863a">3 · C starts 10</text>
  <text x="310" y="226" font-size="8.5" fill="#e8e4dc">min end 11 &gt; 10</text>
  <text x="310" y="244" font-size="8.5" fill="#fb863a">→ open a room</text>
  <text x="310" y="264" font-size="8" fill="#fb863a">peak — 3 in the heap</text>
  <rect x="310" y="272" width="34" height="16" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="318" y="284" font-size="8" fill="#fb863a">11</text>
  <rect x="348" y="272" width="34" height="16" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="356" y="284" font-size="8" fill="#fb863a">12</text>
  <rect x="386" y="272" width="34" height="16" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="394" y="284" font-size="8" fill="#fb863a">13</text>

  <rect x="440" y="190" width="132" height="112" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="450" y="208" font-size="8.5" fill="#fb863a">4 · D starts 11</text>
  <text x="450" y="226" font-size="8.5" fill="#e8e4dc">min end 11 ≤ 11</text>
  <text x="450" y="244" font-size="8.5" fill="#5cc66f">→ reuse that room</text>
  <text x="450" y="264" font-size="8" fill="#6b7280">heap of end times</text>
  <rect x="450" y="272" width="34" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/>
  <text x="458" y="284" font-size="8" fill="#e8e4dc">12</text>
  <rect x="488" y="272" width="34" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/>
  <text x="496" y="284" font-size="8" fill="#e8e4dc">12</text>
  <rect x="526" y="272" width="34" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/>
  <text x="534" y="284" font-size="8" fill="#e8e4dc">13</text>

  <rect x="580" y="190" width="120" height="112" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="590" y="208" font-size="8.5" fill="#fb863a">5 · E starts 13</text>
  <text x="590" y="226" font-size="8.5" fill="#e8e4dc">min end 12 ≤ 13</text>
  <text x="590" y="244" font-size="8.5" fill="#5cc66f">→ reuse that room</text>
  <text x="590" y="264" font-size="8" fill="#6b7280">heap of end times</text>
  <rect x="590" y="272" width="32" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/>
  <text x="597" y="284" font-size="8" fill="#e8e4dc">12</text>
  <rect x="626" y="272" width="32" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/>
  <text x="633" y="284" font-size="8" fill="#e8e4dc">13</text>
  <rect x="662" y="272" width="32" height="16" rx="3" fill="#1a1d22" stroke="#3a414c"/>
  <text x="669" y="284" font-size="8" fill="#e8e4dc">15</text>

  <rect x="250" y="322" width="220" height="40" rx="20" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="360" y="347" font-size="12" fill="#fb863a" text-anchor="middle">rooms needed: 3</text>
</svg>`,
        caption:
          "The heap never gets bigger than the number of meetings running at the same instant — which is exactly the dashed orange line at 10:30. Press **📊 Rooms needed** in the prototype and watch this walk animate, card by card.",
      },
      {
        type: "code",
        language: "java",
        filename: "the min-heap answer, in full",
        code: `static int roomsNeeded(List<TimeSlot> meetings) {
    List<TimeSlot> sorted = new ArrayList<>(meetings);
    sorted.sort(Comparator.comparing(TimeSlot::start));

    PriorityQueue<Instant> endsInUse = new PriorityQueue<>();   // min-heap of end times
    int peak = 0;
    for (TimeSlot m : sorted) {
        // half-open again: a room that ends exactly when this one starts is reusable
        if (!endsInUse.isEmpty() && !endsInUse.peek().isAfter(m.start())) endsInUse.poll();
        endsInUse.add(m.end());
        peak = Math.max(peak, endsInUse.size());
    }
    return peak;   // the peak, not the final size
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Two details people get wrong here",
        text: "**Return the peak, not the final heap size** — the heap shrinks as the day empties out. And **only pop one room per meeting**: popping every expired room in a loop still works for counting, but it changes nothing and it hides the invariant that the heap size *is* the room count.",
      },

      { type: "h", text: "Booking, end to end" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram for booking a room. The user calls book on the Scheduler with room R2 and the slot eleven to twelve. The Scheduler takes that room's lock, asks the AvailabilityIndex for the first conflicting booking, receives none, adds the booking to the index, releases the lock, and returns Booking number 417 to the user. An activation bar on the Room lifeline shows how narrow the locked region is.">
  <defs>
    <marker id="mr-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="mr-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="14" y="12" width="104" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="46" y="32" font-size="10.5" fill="#e8e4dc">User</text>
  <rect x="170" y="12" width="112" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="192" y="32" font-size="10.5" fill="#fb863a">Scheduler</text>
  <rect x="346" y="12" width="126" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="360" y="32" font-size="10.5" fill="#5cc66f">Room «lock»</text>
  <rect x="524" y="12" width="160" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="536" y="32" font-size="10.5" fill="#e8e4dc">AvailabilityIndex</text>

  <line x1="66" y1="42" x2="66" y2="288" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="226" y1="42" x2="226" y2="288" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="409" y1="42" x2="409" y2="288" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="604" y1="42" x2="604" y2="288" stroke="#2d333d" stroke-dasharray="4 5"/>

  <rect x="403" y="104" width="12" height="130" rx="3" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/>

  <text x="74" y="64" font-size="10" fill="#e8e4dc">book("R2", [11,12))</text>
  <line x1="66" y1="72" x2="222" y2="72" stroke="#fb863a" stroke-width="1.3" marker-end="url(#mr-call)"/>

  <text x="234" y="98" font-size="10" fill="#e8e4dc">lock()</text>
  <line x1="226" y1="106" x2="399" y2="106" stroke="#fb863a" stroke-width="1.3" marker-end="url(#mr-call)"/>

  <text x="234" y="132" font-size="10" fill="#e8e4dc">firstConflict([11,12))</text>
  <line x1="226" y1="140" x2="600" y2="140" stroke="#fb863a" stroke-width="1.3" marker-end="url(#mr-call)"/>

  <text x="300" y="164" font-size="10" fill="#5cc66f">none — nothing overlaps</text>
  <line x1="604" y1="172" x2="230" y2="172" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#mr-ret)"/>

  <text x="234" y="196" font-size="10" fill="#e8e4dc">add(Booking#417)</text>
  <line x1="226" y1="204" x2="600" y2="204" stroke="#fb863a" stroke-width="1.3" marker-end="url(#mr-call)"/>

  <text x="234" y="228" font-size="10" fill="#e8e4dc">unlock()</text>
  <line x1="226" y1="236" x2="399" y2="236" stroke="#fb863a" stroke-width="1.3" marker-end="url(#mr-call)"/>

  <text x="90" y="262" font-size="10" fill="#5cc66f">Booking#417</text>
  <line x1="226" y1="270" x2="70" y2="270" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#mr-ret)"/>

  <text x="426" y="170" font-size="8.5" fill="#5cc66f">the lock covers</text>
  <text x="426" y="183" font-size="8.5" fill="#5cc66f">check AND write</text>
</svg>`,
        caption:
          "The green bar on the `Room` lifeline is the locked region. Notice it starts **before** the conflict check and ends **after** the write — if it did not span both, the whole thing would be pointless. Notation: [[sequence-diagrams]].",
      },

      { type: "h", text: "The second act · two people click Book at the same instant" },
      {
        type: "p",
        text: "Ana and Bo both want R2 at 11:00. Both requests run the overlap check. Both see an empty slot. Both write. Now one room holds two meetings, and at 11:00 two groups of people walk into the same room. This is **check-then-act on a shared resource**, the exact shape you already met in [[coffee-machine]] and [[parking-lot]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 330" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Top half unguarded: user A checks the slot and finds it free, user B checks the same slot and also finds it free, then both insert a booking, so room R2 at eleven holds two bookings shown as two stacked red blocks. Bottom half with a per-room lock: user A locks, finds it free, writes and unlocks, while user B waits, then acquires the lock, finds the conflict, and is refused, leaving exactly one booking in the slot.">
  <text x="20" y="28" font-size="10.5" fill="#f06868">⚠️ UNGUARDED — both check before either writes</text>
  <rect x="20" y="38" width="660" height="122" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>

  <text x="36" y="72" font-size="9.5" fill="#9099a8">Ana</text>
  <rect x="94" y="56" width="180" height="24" rx="4" fill="#1a1d22" stroke="#2d333d"/>
  <text x="104" y="72" font-size="9" fill="#e8e4dc">check [11,12) → free ✓</text>
  <rect x="330" y="56" width="150" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="340" y="72" font-size="9" fill="#f06868">insert booking</text>

  <text x="36" y="112" font-size="9.5" fill="#9099a8">Bo</text>
  <rect x="132" y="96" width="180" height="24" rx="4" fill="#1a1d22" stroke="#2d333d"/>
  <text x="142" y="112" font-size="9" fill="#e8e4dc">check [11,12) → free ✓</text>
  <rect x="368" y="96" width="150" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="378" y="112" font-size="9" fill="#f06868">insert booking</text>

  <rect x="540" y="52" width="126" height="14" rx="3" fill="rgba(240,104,104,0.2)" stroke="rgba(240,104,104,0.5)"/>
  <rect x="540" y="68" width="126" height="14" rx="3" fill="rgba(240,104,104,0.2)" stroke="rgba(240,104,104,0.5)"/>
  <text x="540" y="98" font-size="8" fill="#f06868">R2 · 11:00 — two blocks</text>
  <text x="540" y="110" font-size="8" fill="#f06868">stacked in one slot</text>

  <text x="36" y="148" font-size="10" fill="#f06868">two teams walk into the same room at 11:00 · double-booked</text>

  <text x="20" y="184" font-size="10.5" fill="#5cc66f">🔒 PER-ROOM LOCK — check and write are one indivisible step</text>
  <rect x="20" y="194" width="660" height="122" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>

  <text x="36" y="228" font-size="9.5" fill="#9099a8">Ana</text>
  <rect x="94" y="212" width="270" height="24" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="104" y="228" font-size="9" fill="#5cc66f">lock R2 · free ✓ · insert · unlock</text>

  <text x="36" y="268" font-size="9.5" fill="#9099a8">Bo</text>
  <rect x="94" y="252" width="90" height="24" rx="4" fill="#1a1d22" stroke="#2d333d"/>
  <text x="104" y="268" font-size="9" fill="#6b7280">waiting…</text>
  <rect x="190" y="252" width="250" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="200" y="268" font-size="9" fill="#f06868">lock R2 · conflict → REFUSED</text>

  <text x="36" y="304" font-size="10" fill="#5cc66f">1 booked, 1 refused · the slot holds exactly one meeting</text>
  <text x="470" y="228" font-size="9" fill="#9099a8">R1 and R3 are untouched —</text>
  <text x="470" y="242" font-size="9" fill="#9099a8">the lock is per ROOM, so bookings</text>
  <text x="470" y="256" font-size="9" fill="#9099a8">in other rooms never wait</text>
</svg>`,
        caption:
          "Run both halves with **⚔️ Two users book at once**. The `double-booked` counter is the whole point: it is a number that should be structurally impossible, and without the lock it is not.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "One lock per room — not one lock for the building",
        text: "A single `synchronized` on the `Scheduler` is correct, and it turns a fifty-room office into a queue: booking R1 blocks somebody booking R47, and those two have nothing to say to each other. The natural unit of contention is the **room**, because that is the thing whose bookings you are comparing. See [[locks-mutex-semaphore]].",
      },
      {
        type: "code",
        language: "java",
        filename: "check and write, under the room's own lock",
        code: `Booking book(String roomId, TimeSlot slot, String organiser) {
    Room room = rooms.get(roomId);
    room.lock.lock();                      // this ROOM only — R1 and R3 carry on
    try {
        var clash = room.firstConflict(slot);          // check
        if (clash.isPresent())
            throw new ConflictException(clash.get());  // names WHICH booking it clashed with
        Booking b = new Booking(nextId(), roomId, organiser, slot);
        room.add(b);                                   // ...and write, still holding the lock
        return b;
    } finally {
        room.lock.unlock();
    }
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "And the answer they are really fishing for",
        text: "*“What if this runs on three servers?”* An in-process lock protects nothing across machines. The real fix lives in the database: a **unique or exclusion constraint on (room, time range)** — Postgres will do exactly this with a `tsrange` and `EXCLUDE USING gist` — or optimistic concurrency with a version column and a retry. Say which you would build in the 60 minutes (**the per-room lock**) and which you would ship in production (**the constraint**). The database is the only place the check can truly be atomic.",
      },

      { type: "h", text: "Time in, timezones out" },
      {
        type: "p",
        text: "Take **time as a parameter**, never `Instant.now()` inside the scheduler — otherwise you cannot write a test that books a meeting next Tuesday. Store every booking's start and end as a **UTC instant**. Rendering into somebody's local time is a display concern.",
      },
      {
        type: "p",
        text: "Then raise the thing nobody prepares for. A recurring 9am standup is **9am local**, and local time moves relative to UTC twice a year. If you store the rule as a fixed UTC instant plus 24-hour steps, the standup drifts to 8am or 10am the morning after the clocks change. So for a recurring rule you store the **local time plus the zone** — `09:00` and `Europe/London` — and re-resolve it to an instant for every occurrence. Two sentences, said unprompted, and it is one of the best things you can do in this round.",
      },

      { type: "h", text: "Recurring meetings, and why they are all-or-nothing" },
      {
        type: "p",
        text: "*“Book this every weekday until the end of March.”* You do not write a row per occurrence and you do not expand forever. You store a **`RecurrenceRule`** — frequency, an `until` date, the zone — and *generate* the occurrences on demand, capped by a horizon.",
      },
      {
        type: "ul",
        items: [
          "**A recurring booking conflicts if *any* generated occurrence conflicts.** Book the whole series or none of it, and name the offending date: *“refused — Wednesday 25th clashes with the design review”*.",
          "**Cap the horizon.** *“Every Monday, forever”* has to become a bounded list at some point, or the conflict check never terminates. A year is a fine default, and saying you capped it deliberately is the point.",
          "**Exceptions belong beside the rule**, not inside it: a small list of *“this occurrence was moved / deleted”* entries. Trying to encode moves into the rule itself is how calendar code becomes unmaintainable.",
          "**Generating and checking is the same two-pass pattern as [[coffee-machine]]**: check every occurrence first, then insert every occurrence. Inserting as you go leaves half a series booked when day four collides.",
        ],
      },

      { type: "h", text: "Capacity and features are data, not subclasses" },
      {
        type: "p",
        text: "`findRoom(slot, minCapacity, needsProjector)` filters rooms before it ever asks about time. The filter reads fields on `Room`: `seats >= minCapacity && features.containsAll(needed)`. The moment somebody writes `class ProjectorRoom extends Room`, adding a whiteboard means a new class and a room with *both* means a class that cannot exist. Features are a **set on the object**; see [[open-closed]] for why that is the version that survives contact with new requirements.",
      },
      {
        type: "p",
        text: "Cancelling is the easy half: drop the booking from the room's index under the same lock, then publish a `BookingCancelled` event so attendees get notified — [[observer]], one line, and it keeps notification out of the booking path.",
      },

      { type: "h", text: "The 60-minute budget" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 200" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A horizontal bar spanning sixty minutes, split into eight segments: clarify five minutes, entities and TimeSlot seven minutes, APIs six minutes, class diagram six minutes, the overlap test and availability index eighteen minutes shown as the largest and highlighted segment, the per-room lock and book flow eight minutes, a main demo six minutes, and follow-ups four minutes.">
  <text x="30" y="42" font-size="7.5" fill="#6b7280" text-anchor="middle">0</text>
  <text x="84" y="42" font-size="7.5" fill="#6b7280" text-anchor="middle">5</text>
  <text x="160" y="42" font-size="7.5" fill="#6b7280" text-anchor="middle">12</text>
  <text x="225" y="42" font-size="7.5" fill="#6b7280" text-anchor="middle">18</text>
  <text x="290" y="42" font-size="7.5" fill="#6b7280" text-anchor="middle">24</text>
  <text x="485" y="42" font-size="7.5" fill="#6b7280" text-anchor="middle">42</text>
  <text x="572" y="42" font-size="7.5" fill="#6b7280" text-anchor="middle">50</text>
  <text x="637" y="42" font-size="7.5" fill="#6b7280" text-anchor="middle">56</text>
  <text x="680" y="42" font-size="7.5" fill="#6b7280" text-anchor="middle">60</text>

  <rect x="30" y="52" width="54" height="34" rx="3" fill="#14161a" stroke="#3a414c"/>
  <rect x="84" y="52" width="76" height="34" rx="3" fill="#14161a" stroke="#3a414c"/>
  <rect x="160" y="52" width="65" height="34" rx="3" fill="#14161a" stroke="#3a414c"/>
  <rect x="225" y="52" width="65" height="34" rx="3" fill="#14161a" stroke="#3a414c"/>
  <rect x="290" y="52" width="195" height="34" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="485" y="52" width="87" height="34" rx="3" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="572" y="52" width="65" height="34" rx="3" fill="#14161a" stroke="#3a414c"/>
  <rect x="637" y="52" width="43" height="34" rx="3" fill="#14161a" stroke="#3a414c"/>

  <line x1="57" y1="86" x2="57" y2="104" stroke="#3a414c"/>
  <text x="57" y="118" font-size="8.5" fill="#9099a8" text-anchor="middle">clarify</text>
  <line x1="122" y1="86" x2="122" y2="132" stroke="#3a414c"/>
  <text x="122" y="146" font-size="8.5" fill="#9099a8" text-anchor="middle">entities + TimeSlot</text>
  <line x1="192" y1="86" x2="192" y2="104" stroke="#3a414c"/>
  <text x="192" y="118" font-size="8.5" fill="#9099a8" text-anchor="middle">APIs</text>
  <line x1="257" y1="86" x2="257" y2="132" stroke="#3a414c"/>
  <text x="257" y="146" font-size="8.5" fill="#9099a8" text-anchor="middle">class diagram</text>
  <line x1="387" y1="86" x2="387" y2="104" stroke="rgba(251,134,58,0.55)"/>
  <text x="387" y="118" font-size="9" fill="#fb863a" text-anchor="middle">overlaps() + AvailabilityIndex + book()</text>
  <line x1="528" y1="86" x2="528" y2="132" stroke="rgba(92,198,111,0.5)"/>
  <text x="528" y="146" font-size="8.5" fill="#5cc66f" text-anchor="middle">per-room lock</text>
  <line x1="604" y1="86" x2="604" y2="104" stroke="#3a414c"/>
  <text x="604" y="118" font-size="8.5" fill="#9099a8" text-anchor="middle">main() demo</text>
  <line x1="658" y1="86" x2="658" y2="132" stroke="#3a414c"/>
  <text x="658" y="146" font-size="8.5" fill="#9099a8" text-anchor="middle">follow-ups</text>

  <line x1="30" y1="166" x2="680" y2="166" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="30" y="186" font-size="9" fill="#9099a8">18 of the 60 minutes are one predicate and the structure that calls it — everything else is scaffolding around it</text>
</svg>`,
        caption:
          "The orange block is the only part that is genuinely this problem. If you are still drawing boxes at minute 30, you will not reach the lock — and the lock is where the marks are.",
      },

      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“Suggest the earliest slot when all five attendees are free.”** → turn each attendee's bookings into a list of **free** intervals, then intersect them pairwise: `[max(aStart, bStart), min(aEnd, bEnd))`, keeping any result long enough for the meeting. Sketch the intersection formula — it is the overlap test's twin.",
          "**“Add 15 minutes of buffer between meetings.”** → do not change `overlaps()`. Widen the *candidate* slot by the buffer before you test it, and leave the stored booking as booked. One line, in one place.",
          "**“Auto-release a room if nobody checks in within 10 minutes.”** → a `checkedIn` flag on `Booking` plus a scheduled sweep that cancels un-checked-in bookings. Say it is a job, not a thread inside `Room`.",
          "**“Show me the whole floor for next week.”** → this is the query the interval tree exists for: everything overlapping a window, across rooms. With a linear index it is a full scan per room, which is fine at office scale and not fine at company scale.",
          "**“What if a booking needs approval?”** → the booking gets a status and becomes a small [[state]] machine — `PENDING → CONFIRMED → CANCELLED` — and a pending booking still holds the slot, or you have re-opened the race.",
          "**“Make it survive a restart.”** → the `AvailabilityIndex` becomes a repository over a table, and the overlap check becomes a `WHERE start < ? AND ? < end` query with the constraint doing the guarding.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**`<=` instead of `<`.** Every back-to-back meeting in the building is refused, and the bug is invisible until somebody tries it.",
          "**Four `if` branches instead of one line.** One of them will be wrong, the interviewer will find the case, and you will debug it live.",
          "**Never asking whether bookings can be back-to-back.** Even if you guess right, you guessed.",
          "**Scanning every booking ever made.** The overlap check should look at one room's bookings in one window, not the entire history of the office.",
          "**One global lock.** Correct, and it serialises fifty rooms that have nothing to do with each other.",
          "**`class ProjectorRoom extends Room`.** Now a room with a projector *and* a whiteboard needs a class that inherits from two places.",
          "**Inserting a recurring series as you go.** Day four collides and the calendar is left with three orphaned meetings nobody asked for.",
        ],
      },
    ],
    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Book something, and read the predicate",
        body:
          "Leave the defaults and press **📅 Book**. The block appears on R2, and the right-hand panel shows the overlap test run against every booking already in that room — the actual numbers substituted into `aStart < bEnd && bStart < aEnd`, with each result. Every line says `false`, so the booking is allowed.",
      },
      {
        title: "Make it clash",
        body:
          "Pick a start hour that lands inside an existing block and press **📅 Book** again. The attempted block flashes red and is refused, and in the right-hand panel exactly one line turns red — the comparison that returned `true`, next to the name of the booking it collided with. That is what a good error message looks like: it names the clash.",
      },
      {
        title: "Prove that back-to-back works — then break it",
        body:
          "Book **10–11**, then book **11–12** in the same room. Both are allowed, and the two blocks are drawn touching. Now flip the **`≤` inclusive** chip and try the same pair from a clean board: the second booking is refused for touching at a single instant. **One character**, and every consecutive meeting in the building stops working.",
      },
      {
        title: "Let the scheduler pick",
        body:
          "Set **seats ≥ 8** and turn on **📽️ projector**, choose **✨ Any room**, and press **📅 Book**. The explain line names each room it skipped and why — *too small*, *busy at that hour* — before it lands on one. That is `findRoom(slot, minCapacity, needsProjector)` filtering on data, not on subclasses.",
      },
      {
        title: "Create the double booking",
        body:
          "In **⚠️ Unguarded** mode press **⚔️ Two users book at once**. Both requests check, both see a free slot, both write — and the grid draws **two blocks stacked in one cell** while the `double-booked` counter ticks to 1. Switch to **🔒 Per-room lock**, reset, and run the identical demo: the second request waits, sees the first booking, and is refused. **1 booked, 1 refused, 0 double-booked.**",
      },
      {
        title: "Recurring, and counting rooms",
        body:
          "Press **🔁 Recurring** to book the same slot across the five-day strip — if any single day clashes, the whole series is refused and the offending day is named. Then press **📊 Rooms needed** and watch the min-heap walk five fixed meetings left to right, opening and reusing rooms, ending on **rooms needed: 3**.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `TimeSlot` as an immutable pair with **one** `overlaps()` method → `Room` with seats, features and its own lock → an `AvailabilityIndex` interface with a linear implementation → `Scheduler.book()` that checks and writes inside the room's lock → a `main()` that books 10–11 and 11–12 successfully, refuses an overlap, and runs `roomsNeeded()` on five meetings. If back-to-back bookings are refused, you wrote `<=`.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "MeetingRoomScheduler.java",
        code: `import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Consumer;

enum Feature { PROJECTOR, VIDEO_CONF, WHITEBOARD }

/**
 * A half-open interval [start, end). 10:00-11:00 and 11:00-12:00 do NOT conflict.
 * Say this convention out loud in the interview - it IS part of the answer.
 */
record TimeSlot(Instant start, Instant end) {
    TimeSlot {
        Objects.requireNonNull(start);
        Objects.requireNonNull(end);
        if (!start.isBefore(end)) throw new IllegalArgumentException("end must be after start");
    }

    /** THE predicate. One line, no case analysis, strict "<" on both sides. */
    boolean overlaps(TimeSlot other) {
        return start.isBefore(other.end) && other.start.isBefore(end);
    }

    /** Local wall time plus a zone -> a UTC instant. Storage is always UTC. */
    static TimeSlot on(LocalDate day, int fromHour, int toHour, ZoneId zone) {
        return new TimeSlot(day.atTime(fromHour, 0).atZone(zone).toInstant(),
                            day.atTime(toHour, 0).atZone(zone).toInstant());
    }

    String show(ZoneId zone) {
        var day = DateTimeFormatter.ofPattern("MM-dd");
        var time = DateTimeFormatter.ofPattern("HH:mm");
        return day.format(start.atZone(zone)) + " " + time.format(start.atZone(zone))
             + "-" + time.format(end.atZone(zone));
    }
}

record Booking(String id, String roomId, String organiser, TimeSlot slot, List<String> attendees) {}

/** The swappable seam: one contract, three cost profiles. */
interface AvailabilityIndex {
    Optional<Booking> firstConflict(TimeSlot slot);
    void add(Booking booking);
    void remove(String bookingId);
    int size();
}

/** O(n) per query. Boring, honest, and the right answer for one building. */
class LinearIndex implements AvailabilityIndex {
    private final List<Booking> bookings = new ArrayList<>();
    public Optional<Booking> firstConflict(TimeSlot slot) {
        for (Booking b : bookings) if (b.slot().overlaps(slot)) return Optional.of(b);
        return Optional.empty();
    }
    public void add(Booking b) { bookings.add(b); }
    public void remove(String id) { bookings.removeIf(b -> b.id().equals(id)); }
    public int size() { return bookings.size(); }
}

/**
 * O(log n). The entries are sorted by start AND non-overlapping, so only the booking
 * immediately before and the one immediately after the insertion point can conflict.
 */
class SortedIndex implements AvailabilityIndex {
    private final NavigableMap<Instant, Booking> byStart = new TreeMap<>();

    public Optional<Booking> firstConflict(TimeSlot slot) {
        var before = byStart.floorEntry(slot.start());
        if (before != null && before.getValue().slot().overlaps(slot)) return Optional.of(before.getValue());
        var after = byStart.ceilingEntry(slot.start());
        if (after != null && after.getValue().slot().overlaps(slot)) return Optional.of(after.getValue());
        return Optional.empty();   // nothing else can reach across those two
    }
    public void add(Booking b) { byStart.put(b.slot().start(), b); }
    public void remove(String id) { byStart.values().removeIf(b -> b.id().equals(id)); }
    public int size() { return byStart.size(); }
}

class Room {
    final String id, label;
    final int seats;
    final Set<Feature> features;                       // data, NOT subclasses
    final ReentrantLock lock = new ReentrantLock();    // per ROOM - R1 never waits on R3
    private final AvailabilityIndex index;

    Room(String id, String label, int seats, Set<Feature> features, AvailabilityIndex index) {
        this.id = id; this.label = label; this.seats = seats;
        this.features = Set.copyOf(features); this.index = index;
    }

    boolean suits(int minSeats, Set<Feature> needed) {
        return seats >= minSeats && features.containsAll(needed);
    }
    Optional<Booking> firstConflict(TimeSlot slot) { return index.firstConflict(slot); }
    void add(Booking b) { index.add(b); }
    void remove(String id) { index.remove(id); }
}

class ConflictException extends RuntimeException {
    final Booking clash;
    ConflictException(Booking clash) {
        super("clashes with " + clash.id());           // names WHICH booking
        this.clash = clash;
    }
}

/** Generates occurrences; never stores one row per day. */
record RecurrenceRule(Frequency freq, LocalDate until, ZoneId zone) {
    enum Frequency { DAILY, WEEKLY }
    static final int MAX_OCCURRENCES = 260;            // cap the horizon, always

    List<LocalDate> occurrences(LocalDate from) {
        List<LocalDate> out = new ArrayList<>();
        int step = freq == Frequency.DAILY ? 1 : 7;
        for (LocalDate d = from; !d.isAfter(until) && out.size() < MAX_OCCURRENCES; d = d.plusDays(step))
            out.add(d);
        return out;
    }
}

class Scheduler {
    private final Map<String, Room> rooms = new LinkedHashMap<>();
    private final List<Consumer<String>> listeners = new CopyOnWriteArrayList<>();
    private int lastId = 400;

    void addRoom(Room r) { rooms.put(r.id, r); }
    void onEvent(Consumer<String> listener) { listeners.add(listener); }
    private void publish(String msg) { listeners.forEach(l -> l.accept(msg)); }
    private synchronized String nextId() { return "B" + (++lastId); }

    Booking book(String roomId, TimeSlot slot, String organiser, List<String> attendees) {
        Room room = rooms.get(roomId);
        if (room == null) throw new IllegalArgumentException("no such room: " + roomId);
        room.lock.lock();                              // check AND write, one indivisible step
        try {
            var clash = room.firstConflict(slot);
            if (clash.isPresent()) throw new ConflictException(clash.get());
            Booking b = new Booking(nextId(), roomId, organiser, slot, List.copyOf(attendees));
            room.add(b);
            publish("booked " + b.id() + " in " + roomId);
            return b;
        } finally {
            room.lock.unlock();
        }
    }

    /** Capacity and features filter FIRST, time second. */
    Optional<Booking> findRoom(TimeSlot slot, int minSeats, Set<Feature> needed, String organiser) {
        for (Room r : rooms.values()) {
            if (!r.suits(minSeats, needed)) continue;
            try { return Optional.of(book(r.id, slot, organiser, List.of())); }
            catch (ConflictException busy) { /* try the next room */ }
        }
        return Optional.empty();
    }

    /** A series conflicts if ANY occurrence conflicts. Check them all, then write them all. */
    List<Booking> bookRecurring(String roomId, LocalDate from, int fromHour, int toHour,
                                RecurrenceRule rule, String organiser) {
        Room room = rooms.get(roomId);
        room.lock.lock();
        try {
            List<TimeSlot> slots = new ArrayList<>();
            for (LocalDate day : rule.occurrences(from)) {
                // 9am LOCAL on every occurrence - the UTC instant moves when the clocks do
                TimeSlot slot = TimeSlot.on(day, fromHour, toHour, rule.zone());
                var clash = room.firstConflict(slot);
                if (clash.isPresent())
                    throw new IllegalStateException("series refused: " + day + " clashes with " + clash.get().id());
                slots.add(slot);
            }
            List<Booking> made = new ArrayList<>();
            for (TimeSlot slot : slots) {
                Booking b = new Booking(nextId(), roomId, organiser, slot, List.of());
                room.add(b);
                made.add(b);
            }
            publish("booked a " + made.size() + "-occurrence series in " + roomId);
            return made;
        } finally {
            room.lock.unlock();
        }
    }

    void cancel(String roomId, String bookingId) {
        Room room = rooms.get(roomId);
        room.lock.lock();
        try { room.remove(bookingId); publish("cancelled " + bookingId); }
        finally { room.lock.unlock(); }
    }

    /** "How many rooms do these meetings need?" Sort by start, min-heap of end times. */
    static int roomsNeeded(List<TimeSlot> meetings) {
        List<TimeSlot> sorted = new ArrayList<>(meetings);
        sorted.sort(Comparator.comparing(TimeSlot::start));
        PriorityQueue<Instant> endsInUse = new PriorityQueue<>();
        int peak = 0;
        for (TimeSlot m : sorted) {
            // half-open: a room ending exactly when this starts is reusable
            if (!endsInUse.isEmpty() && !endsInUse.peek().isAfter(m.start())) endsInUse.poll();
            endsInUse.add(m.end());
            peak = Math.max(peak, endsInUse.size());
        }
        return peak;                                   // the PEAK, not the final size
    }
}

public class Main {
    static final ZoneId ZONE = ZoneId.of("Europe/London");

    public static void main(String[] args) throws Exception {
        Scheduler scheduler = new Scheduler();
        scheduler.addRoom(new Room("R1", "Huddle", 4, Set.of(), new SortedIndex()));
        scheduler.addRoom(new Room("R2", "Sync", 8, Set.of(Feature.PROJECTOR), new SortedIndex()));
        scheduler.addRoom(new Room("R3", "Boardroom", 12,
                Set.of(Feature.PROJECTOR, Feature.VIDEO_CONF), new SortedIndex()));
        scheduler.onEvent(msg -> System.out.println("   [notify] " + msg));

        LocalDate mon = LocalDate.of(2026, 3, 23);

        System.out.println("-- back to back is allowed --");
        scheduler.book("R2", TimeSlot.on(mon, 10, 11, ZONE), "ana", List.of("bo"));
        scheduler.book("R2", TimeSlot.on(mon, 11, 12, ZONE), "bo", List.of("ana"));
        System.out.println("   10-11 and 11-12 both booked: [start, end) is half-open");

        System.out.println("-- an overlapping request is refused --");
        try { scheduler.book("R2", TimeSlot.on(mon, 11, 13, ZONE), "cy", List.of()); }
        catch (ConflictException e) { System.out.println("   refused: " + e.getMessage()); }

        System.out.println("-- find any room seating 8 with a projector --");
        var found = scheduler.findRoom(TimeSlot.on(mon, 11, 12, ZONE), 8, Set.of(Feature.PROJECTOR), "dee");
        System.out.println("   -> " + found.map(b -> b.roomId() + " " + b.slot().show(ZONE)).orElse("nothing free"));

        System.out.println("-- a recurring series is all-or-nothing --");
        scheduler.book("R1", TimeSlot.on(mon.plusDays(2), 9, 10, ZONE), "eli", List.of());
        try {
            scheduler.bookRecurring("R1", mon, 9, 10,
                    new RecurrenceRule(RecurrenceRule.Frequency.DAILY, mon.plusDays(4), ZONE), "ana");
        } catch (IllegalStateException e) { System.out.println("   " + e.getMessage()); }

        System.out.println("-- how many rooms do these five meetings need? --");
        List<TimeSlot> five = List.of(
                TimeSlot.on(mon, 9, 12, ZONE), TimeSlot.on(mon, 9, 11, ZONE),
                TimeSlot.on(mon, 10, 13, ZONE), TimeSlot.on(mon, 11, 12, ZONE),
                TimeSlot.on(mon, 13, 15, ZONE));
        System.out.println("   rooms needed: " + Scheduler.roomsNeeded(five));

        System.out.println("-- two people book the same slot at the same instant --");
        var gate = new CountDownLatch(1);
        var pool = Executors.newFixedThreadPool(2);
        List<Future<String>> race = new ArrayList<>();
        for (String who : List.of("fay", "gus")) {
            race.add(pool.submit(() -> {
                gate.await();
                try {
                    var b = scheduler.book("R3", TimeSlot.on(mon, 15, 16, ZONE), who, List.of());
                    return who + " got " + b.id();
                } catch (ConflictException e) {
                    return who + " refused: " + e.getMessage();
                }
            }));
        }
        gate.countDown();
        for (var f : race) System.out.println("   " + f.get());
        pool.shutdown();
        System.out.println("exactly one winner, because check and write share the room's lock");
    }
}

/* expected output (the two racers may swap places):

-- back to back is allowed --
   [notify] booked B401 in R2
   [notify] booked B402 in R2
   10-11 and 11-12 both booked: [start, end) is half-open
-- an overlapping request is refused --
   refused: clashes with B402
-- find any room seating 8 with a projector --
   [notify] booked B403 in R3
   -> R3 03-23 11:00-12:00
-- a recurring series is all-or-nothing --
   [notify] booked B404 in R1
   series refused: 2026-03-25 clashes with B404
-- how many rooms do these five meetings need? --
   rooms needed: 3
-- two people book the same slot at the same instant --
   [notify] booked B405 in R3
   fay got B405
   gus refused: clashes with B405
exactly one winner, because check and write share the room's lock
*/`,
      },
      {
        label: "Python",
        language: "python",
        filename: "meeting_room_scheduler.py",
        code: `from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from enum import Enum
from heapq import heappush, heappop
from threading import Barrier, Lock
from typing import Callable, Iterable, Optional
from zoneinfo import ZoneInfo

ZONE = ZoneInfo("Europe/London")


class Feature(Enum):
    PROJECTOR = "projector"
    VIDEO_CONF = "video_conf"
    WHITEBOARD = "whiteboard"


@dataclass(frozen=True, order=True)
class TimeSlot:
    """Half-open [start, end): 10:00-11:00 and 11:00-12:00 do NOT conflict."""
    start: datetime
    end: datetime

    def __post_init__(self) -> None:
        if not self.start < self.end:
            raise ValueError("end must be after start")

    def overlaps(self, other: "TimeSlot") -> bool:
        """THE predicate. One line, no case analysis, strict "<" on both sides."""
        return self.start < other.end and other.start < self.end

    @staticmethod
    def on(day: date, from_hour: int, to_hour: int, zone: ZoneInfo = ZONE) -> "TimeSlot":
        # local wall time plus a zone -> an absolute instant; storage stays UTC
        return TimeSlot(datetime(day.year, day.month, day.day, from_hour, tzinfo=zone),
                        datetime(day.year, day.month, day.day, to_hour, tzinfo=zone))

    def show(self) -> str:
        return self.start.strftime("%m-%d %H:%M") + "-" + self.end.strftime("%H:%M")


@dataclass(frozen=True)
class Booking:
    id: str
    room_id: str
    organiser: str
    slot: TimeSlot
    attendees: tuple[str, ...] = ()


class AvailabilityIndex:
    """The swappable seam: one contract, several cost profiles."""

    def first_conflict(self, slot: TimeSlot) -> Optional[Booking]:
        raise NotImplementedError

    def add(self, booking: Booking) -> None:
        raise NotImplementedError

    def remove(self, booking_id: str) -> None:
        raise NotImplementedError


class LinearIndex(AvailabilityIndex):
    """O(n) per query. Boring, honest, right for one building."""

    def __init__(self) -> None:
        self._bookings: list[Booking] = []

    def first_conflict(self, slot: TimeSlot) -> Optional[Booking]:
        for b in self._bookings:
            if b.slot.overlaps(slot):
                return b
        return None

    def add(self, booking: Booking) -> None:
        self._bookings.append(booking)

    def remove(self, booking_id: str) -> None:
        self._bookings = [b for b in self._bookings if b.id != booking_id]


class SortedIndex(AvailabilityIndex):
    """O(log n): sorted by start and non-overlapping, so only two neighbours matter."""

    def __init__(self) -> None:
        self._bookings: list[Booking] = []          # kept sorted by slot.start

    def first_conflict(self, slot: TimeSlot) -> Optional[Booking]:
        from bisect import bisect_left
        starts = [b.slot.start for b in self._bookings]
        i = bisect_left(starts, slot.start)
        for j in (i - 1, i):                        # the one before and the one after
            if 0 <= j < len(self._bookings) and self._bookings[j].slot.overlaps(slot):
                return self._bookings[j]
        return None

    def add(self, booking: Booking) -> None:
        from bisect import insort
        insort(self._bookings, booking, key=lambda b: b.slot.start)

    def remove(self, booking_id: str) -> None:
        self._bookings = [b for b in self._bookings if b.id != booking_id]


class ConflictError(Exception):
    def __init__(self, clash: Booking):
        super().__init__("clashes with " + clash.id)   # names WHICH booking
        self.clash = clash


@dataclass
class Room:
    id: str
    label: str
    seats: int
    features: frozenset[Feature]                    # data, NOT subclasses
    index: AvailabilityIndex
    lock: Lock = field(default_factory=Lock)        # per ROOM - R1 never waits on R3

    def suits(self, min_seats: int, needed: Iterable[Feature]) -> bool:
        return self.seats >= min_seats and set(needed) <= self.features


class Frequency(Enum):
    DAILY = 1
    WEEKLY = 7


@dataclass(frozen=True)
class RecurrenceRule:
    freq: Frequency
    until: date
    zone: ZoneInfo = ZONE
    MAX_OCCURRENCES = 260                           # cap the horizon, always

    def occurrences(self, start_day: date) -> list[date]:
        out, day = [], start_day
        while day <= self.until and len(out) < self.MAX_OCCURRENCES:
            out.append(day)
            day = day + timedelta(days=self.freq.value)
        return out


class Scheduler:
    def __init__(self) -> None:
        self._rooms: dict[str, Room] = {}
        self._listeners: list[Callable[[str], None]] = []
        self._id_lock = Lock()
        self._last_id = 400

    def add_room(self, room: Room) -> None:
        self._rooms[room.id] = room

    def on_event(self, listener: Callable[[str], None]) -> None:
        self._listeners.append(listener)

    def _publish(self, msg: str) -> None:
        for listener in self._listeners:
            listener(msg)

    def _next_id(self) -> str:
        with self._id_lock:
            self._last_id += 1
            return "B" + str(self._last_id)

    def book(self, room_id: str, slot: TimeSlot, organiser: str,
             attendees: tuple[str, ...] = ()) -> Booking:
        room = self._rooms[room_id]
        with room.lock:                              # check AND write, one indivisible step
            clash = room.index.first_conflict(slot)
            if clash is not None:
                raise ConflictError(clash)
            booking = Booking(self._next_id(), room_id, organiser, slot, attendees)
            room.index.add(booking)
            self._publish("booked " + booking.id + " in " + room_id)
            return booking

    def find_room(self, slot: TimeSlot, min_seats: int,
                  needed: Iterable[Feature], organiser: str) -> Optional[Booking]:
        for room in self._rooms.values():
            if not room.suits(min_seats, needed):     # capacity and features first
                continue
            try:
                return self.book(room.id, slot, organiser)
            except ConflictError:
                continue                              # busy - try the next room
        return None

    def book_recurring(self, room_id: str, start_day: date, from_hour: int, to_hour: int,
                       rule: RecurrenceRule, organiser: str) -> list[Booking]:
        """A series conflicts if ANY occurrence conflicts. Check all, then write all."""
        room = self._rooms[room_id]
        with room.lock:
            slots = []
            for day in rule.occurrences(start_day):
                # 9am LOCAL on every occurrence - the instant moves when the clocks do
                slot = TimeSlot.on(day, from_hour, to_hour, rule.zone)
                clash = room.index.first_conflict(slot)
                if clash is not None:
                    raise RuntimeError("series refused: " + str(day) + " clashes with " + clash.id)
                slots.append(slot)
            made = []
            for slot in slots:
                booking = Booking(self._next_id(), room_id, organiser, slot)
                room.index.add(booking)
                made.append(booking)
            self._publish("booked a " + str(len(made)) + "-occurrence series in " + room_id)
            return made

    def cancel(self, room_id: str, booking_id: str) -> None:
        room = self._rooms[room_id]
        with room.lock:
            room.index.remove(booking_id)
            self._publish("cancelled " + booking_id)

    @staticmethod
    def rooms_needed(meetings: list[TimeSlot]) -> int:
        """Sort by start, keep a min-heap of end times, return the PEAK size."""
        ends_in_use: list[datetime] = []
        peak = 0
        for m in sorted(meetings, key=lambda s: s.start):
            # half-open: a room ending exactly when this starts is reusable
            if ends_in_use and ends_in_use[0] <= m.start:
                heappop(ends_in_use)
            heappush(ends_in_use, m.end)
            peak = max(peak, len(ends_in_use))
        return peak


if __name__ == "__main__":
    scheduler = Scheduler()
    scheduler.add_room(Room("R1", "Huddle", 4, frozenset(), SortedIndex()))
    scheduler.add_room(Room("R2", "Sync", 8, frozenset({Feature.PROJECTOR}), SortedIndex()))
    scheduler.add_room(Room("R3", "Boardroom", 12,
                            frozenset({Feature.PROJECTOR, Feature.VIDEO_CONF}), SortedIndex()))
    scheduler.on_event(lambda msg: print("   [notify]", msg))

    mon = date(2026, 3, 23)

    print("-- back to back is allowed --")
    scheduler.book("R2", TimeSlot.on(mon, 10, 11), "ana", ("bo",))
    scheduler.book("R2", TimeSlot.on(mon, 11, 12), "bo", ("ana",))
    print("   10-11 and 11-12 both booked: [start, end) is half-open")

    print("-- an overlapping request is refused --")
    try:
        scheduler.book("R2", TimeSlot.on(mon, 11, 13), "cy")
    except ConflictError as e:
        print("   refused:", e)

    print("-- find any room seating 8 with a projector --")
    found = scheduler.find_room(TimeSlot.on(mon, 11, 12), 8, [Feature.PROJECTOR], "dee")
    print("   ->", (found.room_id + " " + found.slot.show()) if found else "nothing free")

    print("-- a recurring series is all-or-nothing --")
    scheduler.book("R1", TimeSlot.on(mon + timedelta(days=2), 9, 10), "eli")
    try:
        scheduler.book_recurring("R1", mon, 9, 10,
                                 RecurrenceRule(Frequency.DAILY, mon + timedelta(days=4)), "ana")
    except RuntimeError as e:
        print("  ", e)

    print("-- how many rooms do these five meetings need? --")
    five = [TimeSlot.on(mon, 9, 12), TimeSlot.on(mon, 9, 11), TimeSlot.on(mon, 10, 13),
            TimeSlot.on(mon, 11, 12), TimeSlot.on(mon, 13, 15)]
    print("   rooms needed:", Scheduler.rooms_needed(five))

    print("-- two people book the same slot at the same instant --")
    gate = Barrier(2)

    def attempt(who: str) -> str:
        gate.wait()
        try:
            return who + " got " + scheduler.book("R3", TimeSlot.on(mon, 15, 16), who).id
        except ConflictError as e:
            return who + " refused: " + str(e)

    with ThreadPoolExecutor(max_workers=2) as pool:
        for line in pool.map(attempt, ["fay", "gus"]):
            print("  ", line)

    print("exactly one winner, because check and write share the room's lock")

# expected output (the two racers may swap places):
#
# -- back to back is allowed --
#    [notify] booked B401 in R2
#    [notify] booked B402 in R2
#    10-11 and 11-12 both booked: [start, end) is half-open
# -- an overlapping request is refused --
#    refused: clashes with B402
# -- find any room seating 8 with a projector --
#    [notify] booked B403 in R3
#    -> R3 03-23 11:00-12:00
# -- a recurring series is all-or-nothing --
#    [notify] booked B404 in R1
#    series refused: 2026-03-25 clashes with B404
# -- how many rooms do these five meetings need? --
#    rooms needed: 3
# -- two people book the same slot at the same instant --
#    [notify] booked B405 in R3
#    fay got B405
#    gus refused: clashes with B405
# exactly one winner, because check and write share the room's lock`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "meeting_room_scheduler.cpp",
        code: `#include <algorithm>
#include <future>
#include <iostream>
#include <map>
#include <mutex>
#include <optional>
#include <queue>
#include <set>
#include <stdexcept>
#include <string>
#include <vector>

// Minutes since a fixed origin, always UTC. A real system would use
// std::chrono::sys_time; the arithmetic below is identical either way.
using Minute = long long;
static Minute at(int day, int hour) { return static_cast<Minute>(day) * 1440 + hour * 60; }

enum class Feature { Projector, VideoConf, Whiteboard };

// Half-open [start, end): 10:00-11:00 and 11:00-12:00 do NOT conflict.
struct TimeSlot {
    Minute start, end;

    TimeSlot(Minute s, Minute e) : start(s), end(e) {
        if (!(s < e)) throw std::invalid_argument("end must be after start");
    }

    // THE predicate. One line, no case analysis, strict "<" on both sides.
    bool overlaps(const TimeSlot& other) const {
        return start < other.end && other.start < end;
    }

    static TimeSlot on(int day, int fromHour, int toHour) {
        return TimeSlot(at(day, fromHour), at(day, toHour));
    }

    std::string show() const {
        return "day" + std::to_string(start / 1440) + " " +
               std::to_string((start % 1440) / 60) + ":00-" +
               std::to_string((end % 1440) / 60) + ":00";
    }
};

struct Booking {
    std::string id, roomId, organiser;
    TimeSlot slot;
};

// The swappable seam: one contract, several cost profiles.
struct AvailabilityIndex {
    virtual ~AvailabilityIndex() = default;
    virtual std::optional<Booking> firstConflict(const TimeSlot& slot) const = 0;
    virtual void add(const Booking& b) = 0;
    virtual void remove(const std::string& id) = 0;
};

// O(n) per query. Boring, honest, right for one building.
class LinearIndex : public AvailabilityIndex {
public:
    std::optional<Booking> firstConflict(const TimeSlot& slot) const override {
        for (const auto& b : bookings_)
            if (b.slot.overlaps(slot)) return b;
        return std::nullopt;
    }
    void add(const Booking& b) override { bookings_.push_back(b); }
    void remove(const std::string& id) override {
        bookings_.erase(std::remove_if(bookings_.begin(), bookings_.end(),
                        [&](const Booking& b) { return b.id == id; }), bookings_.end());
    }
private:
    std::vector<Booking> bookings_;
};

// O(log n): sorted by start AND non-overlapping, so only two neighbours matter.
class SortedIndex : public AvailabilityIndex {
public:
    std::optional<Booking> firstConflict(const TimeSlot& slot) const override {
        auto it = byStart_.lower_bound(slot.start);
        if (it != byStart_.begin()) {
            auto prev = std::prev(it);                       // the one before
            if (prev->second.slot.overlaps(slot)) return prev->second;
        }
        if (it != byStart_.end() && it->second.slot.overlaps(slot)) return it->second;
        return std::nullopt;                                  // nothing else can reach across
    }
    void add(const Booking& b) override { byStart_.emplace(b.slot.start, b); }
    void remove(const std::string& id) override {
        for (auto it = byStart_.begin(); it != byStart_.end(); ++it)
            if (it->second.id == id) { byStart_.erase(it); return; }
    }
private:
    std::map<Minute, Booking> byStart_;
};

struct ConflictError : std::runtime_error {
    Booking clash;
    explicit ConflictError(const Booking& c)
        : std::runtime_error("clashes with " + c.id), clash(c) {}   // names WHICH booking
};

class Room {
public:
    Room(std::string id, std::string label, int seats, std::set<Feature> features,
         std::unique_ptr<AvailabilityIndex> index)
        : id(std::move(id)), label(std::move(label)), seats(seats),
          features(std::move(features)), index_(std::move(index)) {}

    bool suits(int minSeats, const std::set<Feature>& needed) const {
        return seats >= minSeats &&
               std::includes(features.begin(), features.end(), needed.begin(), needed.end());
    }
    std::optional<Booking> firstConflict(const TimeSlot& s) const { return index_->firstConflict(s); }
    void add(const Booking& b) { index_->add(b); }
    void remove(const std::string& id) { index_->remove(id); }

    std::string id, label;
    int seats;
    std::set<Feature> features;                       // data, NOT subclasses
    std::mutex lock;                                  // per ROOM - R1 never waits on R3
private:
    std::unique_ptr<AvailabilityIndex> index_;
};

enum class Frequency { Daily = 1, Weekly = 7 };

struct RecurrenceRule {
    Frequency freq;
    int untilDay;
    static constexpr int MAX_OCCURRENCES = 260;       // cap the horizon, always

    std::vector<int> occurrences(int startDay) const {
        std::vector<int> out;
        for (int d = startDay; d <= untilDay && static_cast<int>(out.size()) < MAX_OCCURRENCES;
             d += static_cast<int>(freq))
            out.push_back(d);
        return out;
    }
};

class Scheduler {
public:
    void addRoom(std::unique_ptr<Room> room) {
        order_.push_back(room->id);
        rooms_[room->id] = std::move(room);
    }
    void onEvent(std::function<void(const std::string&)> listener) {
        listeners_.push_back(std::move(listener));
    }

    Booking book(const std::string& roomId, const TimeSlot& slot, const std::string& organiser) {
        Room& room = *rooms_.at(roomId);
        std::lock_guard<std::mutex> guard(room.lock);        // check AND write together
        if (auto clash = room.firstConflict(slot)) throw ConflictError(*clash);
        Booking b{nextId(), roomId, organiser, slot};
        room.add(b);
        publish("booked " + b.id + " in " + roomId);
        return b;
    }

    std::optional<Booking> findRoom(const TimeSlot& slot, int minSeats,
                                    const std::set<Feature>& needed, const std::string& who) {
        for (const auto& id : order_) {
            Room& room = *rooms_.at(id);
            if (!room.suits(minSeats, needed)) continue;      // capacity and features first
            try { return book(id, slot, who); }
            catch (const ConflictError&) { continue; }        // busy - next room
        }
        return std::nullopt;
    }

    // A series conflicts if ANY occurrence conflicts. Check all, then write all.
    std::vector<Booking> bookRecurring(const std::string& roomId, int startDay, int fromHour,
                                       int toHour, const RecurrenceRule& rule,
                                       const std::string& organiser) {
        Room& room = *rooms_.at(roomId);
        std::lock_guard<std::mutex> guard(room.lock);
        std::vector<TimeSlot> slots;
        for (int day : rule.occurrences(startDay)) {
            TimeSlot slot = TimeSlot::on(day, fromHour, toHour);
            if (auto clash = room.firstConflict(slot))
                throw std::runtime_error("series refused: day" + std::to_string(day) +
                                         " clashes with " + clash->id);
            slots.push_back(slot);
        }
        std::vector<Booking> made;
        for (const auto& slot : slots) {
            Booking b{nextId(), roomId, organiser, slot};
            room.add(b);
            made.push_back(b);
        }
        publish("booked a " + std::to_string(made.size()) + "-occurrence series in " + roomId);
        return made;
    }

    void cancel(const std::string& roomId, const std::string& bookingId) {
        Room& room = *rooms_.at(roomId);
        std::lock_guard<std::mutex> guard(room.lock);
        room.remove(bookingId);
        publish("cancelled " + bookingId);
    }

    // Sort by start, keep a min-heap of end times, return the PEAK size.
    static int roomsNeeded(std::vector<TimeSlot> meetings) {
        std::sort(meetings.begin(), meetings.end(),
                  [](const TimeSlot& a, const TimeSlot& b) { return a.start < b.start; });
        std::priority_queue<Minute, std::vector<Minute>, std::greater<Minute>> endsInUse;
        int peak = 0;
        for (const auto& m : meetings) {
            // half-open: a room ending exactly when this starts is reusable
            if (!endsInUse.empty() && endsInUse.top() <= m.start) endsInUse.pop();
            endsInUse.push(m.end);
            peak = std::max(peak, static_cast<int>(endsInUse.size()));
        }
        return peak;
    }

private:
    std::string nextId() {
        std::lock_guard<std::mutex> guard(idLock_);
        return "B" + std::to_string(++lastId_);
    }
    void publish(const std::string& msg) { for (auto& l : listeners_) l(msg); }

    std::map<std::string, std::unique_ptr<Room>> rooms_;
    std::vector<std::string> order_;
    std::vector<std::function<void(const std::string&)>> listeners_;
    std::mutex idLock_;
    int lastId_ = 400;
};

int main() {
    Scheduler scheduler;
    scheduler.addRoom(std::make_unique<Room>("R1", "Huddle", 4,
        std::set<Feature>{}, std::make_unique<SortedIndex>()));
    scheduler.addRoom(std::make_unique<Room>("R2", "Sync", 8,
        std::set<Feature>{Feature::Projector}, std::make_unique<SortedIndex>()));
    scheduler.addRoom(std::make_unique<Room>("R3", "Boardroom", 12,
        std::set<Feature>{Feature::Projector, Feature::VideoConf}, std::make_unique<SortedIndex>()));
    scheduler.onEvent([](const std::string& m) { std::cout << "   [notify] " << m << "\\n"; });

    const int mon = 0;

    std::cout << "-- back to back is allowed --\\n";
    scheduler.book("R2", TimeSlot::on(mon, 10, 11), "ana");
    scheduler.book("R2", TimeSlot::on(mon, 11, 12), "bo");
    std::cout << "   10-11 and 11-12 both booked: [start, end) is half-open\\n";

    std::cout << "-- an overlapping request is refused --\\n";
    try { scheduler.book("R2", TimeSlot::on(mon, 11, 13), "cy"); }
    catch (const ConflictError& e) { std::cout << "   refused: " << e.what() << "\\n"; }

    std::cout << "-- find any room seating 8 with a projector --\\n";
    auto found = scheduler.findRoom(TimeSlot::on(mon, 11, 12), 8, {Feature::Projector}, "dee");
    std::cout << "   -> " << (found ? found->roomId + " " + found->slot.show() : "nothing free") << "\\n";

    std::cout << "-- a recurring series is all-or-nothing --\\n";
    scheduler.book("R1", TimeSlot::on(mon + 2, 9, 10), "eli");
    try { scheduler.bookRecurring("R1", mon, 9, 10, {Frequency::Daily, mon + 4}, "ana"); }
    catch (const std::runtime_error& e) { std::cout << "   " << e.what() << "\\n"; }

    std::cout << "-- how many rooms do these five meetings need? --\\n";
    std::cout << "   rooms needed: " << Scheduler::roomsNeeded({
        TimeSlot::on(mon, 9, 12), TimeSlot::on(mon, 9, 11), TimeSlot::on(mon, 10, 13),
        TimeSlot::on(mon, 11, 12), TimeSlot::on(mon, 13, 15)}) << "\\n";

    std::cout << "-- two people book the same slot at the same instant --\\n";
    auto attempt = [&scheduler, mon](std::string who) {
        try { return who + " got " + scheduler.book("R3", TimeSlot::on(mon, 15, 16), who).id; }
        catch (const ConflictError& e) { return who + " refused: " + e.what(); }
    };
    auto fay = std::async(std::launch::async, attempt, "fay");
    auto gus = std::async(std::launch::async, attempt, "gus");
    std::cout << "   " << fay.get() << "\\n   " << gus.get() << "\\n";
    std::cout << "exactly one winner, because check and write share the room's lock\\n";
}

/* expected output (the two racers may swap places):

-- back to back is allowed --
   [notify] booked B401 in R2
   [notify] booked B402 in R2
   10-11 and 11-12 both booked: [start, end) is half-open
-- an overlapping request is refused --
   refused: clashes with B402
-- find any room seating 8 with a projector --
   [notify] booked B403 in R3
   -> R3 day0 11:00-12:00
-- a recurring series is all-or-nothing --
   [notify] booked B404 in R1
   series refused: day2 clashes with B404
-- how many rooms do these five meetings need? --
   rooms needed: 3
-- two people book the same slot at the same instant --
   [notify] booked B405 in R3
   fay got B405
   gus refused: clashes with B405
exactly one winner, because check and write share the room's lock
*/`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "meetingRoomScheduler.ts",
        code: `// Minutes since a fixed origin, always UTC. Rendering into a viewer's local
// time is a display concern that never reaches this file.
type Minute = number;
const at = (day: number, hour: number): Minute => day * 1440 + hour * 60;

enum Feature { Projector = "projector", VideoConf = "video_conf", Whiteboard = "whiteboard" }

/** Half-open [start, end): 10:00-11:00 and 11:00-12:00 do NOT conflict. */
class TimeSlot {
  constructor(readonly start: Minute, readonly end: Minute) {
    if (!(start < end)) throw new Error("end must be after start");
  }

  /** THE predicate. One line, no case analysis, strict "<" on both sides. */
  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && other.start < this.end;
  }

  static on(day: number, fromHour: number, toHour: number): TimeSlot {
    return new TimeSlot(at(day, fromHour), at(day, toHour));
  }

  show(): string {
    const hour = (m: Minute) => String(Math.floor((m % 1440) / 60)) + ":00";
    return "day" + Math.floor(this.start / 1440) + " " + hour(this.start) + "-" + hour(this.end);
  }
}

interface Booking {
  id: string;
  roomId: string;
  organiser: string;
  slot: TimeSlot;
  attendees: string[];
}

/** The swappable seam: one contract, several cost profiles. */
interface AvailabilityIndex {
  firstConflict(slot: TimeSlot): Booking | null;
  add(booking: Booking): void;
  remove(bookingId: string): void;
}

/** O(n) per query. Boring, honest, right for one building. */
class LinearIndex implements AvailabilityIndex {
  private bookings: Booking[] = [];
  firstConflict(slot: TimeSlot): Booking | null {
    for (const b of this.bookings) if (b.slot.overlaps(slot)) return b;
    return null;
  }
  add(b: Booking): void { this.bookings.push(b); }
  remove(id: string): void { this.bookings = this.bookings.filter((b) => b.id !== id); }
}

/** O(log n): sorted by start AND non-overlapping, so only two neighbours matter. */
class SortedIndex implements AvailabilityIndex {
  private bookings: Booking[] = [];   // kept sorted by slot.start

  private insertionPoint(start: Minute): number {
    let lo = 0, hi = this.bookings.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.bookings[mid].slot.start > start) hi = mid; else lo = mid + 1;
    }
    return lo;
  }

  firstConflict(slot: TimeSlot): Booking | null {
    const i = this.insertionPoint(slot.start);
    for (const j of [i - 1, i]) {                 // the one before and the one after
      const b = this.bookings[j];
      if (b && b.slot.overlaps(slot)) return b;
    }
    return null;                                   // nothing else can reach across those two
  }
  add(b: Booking): void { this.bookings.splice(this.insertionPoint(b.slot.start), 0, b); }
  remove(id: string): void { this.bookings = this.bookings.filter((x) => x.id !== id); }
}

class ConflictError extends Error {
  constructor(readonly clash: Booking) {
    super("clashes with " + clash.id);             // names WHICH booking
  }
}

/**
 * JavaScript is single-threaded, but "await" is exactly where another request
 * slips in between the check and the write. An async mutex is the fix.
 */
class AsyncMutex {
  private tail: Promise<void> = Promise.resolve();
  async run<T>(work: () => Promise<T> | T): Promise<T> {
    const previous = this.tail;
    let release: () => void = () => {};
    this.tail = new Promise<void>((resolve) => { release = resolve; });
    await previous;
    try { return await work(); } finally { release(); }
  }
}

class Room {
  readonly lock = new AsyncMutex();                // per ROOM - R1 never waits on R3
  constructor(
    readonly id: string,
    readonly label: string,
    readonly seats: number,
    readonly features: ReadonlySet<Feature>,       // data, NOT subclasses
    readonly index: AvailabilityIndex,
  ) {}

  suits(minSeats: number, needed: Iterable<Feature>): boolean {
    if (this.seats < minSeats) return false;
    for (const f of needed) if (!this.features.has(f)) return false;
    return true;
  }
}

type Frequency = "daily" | "weekly";

class RecurrenceRule {
  static readonly MAX_OCCURRENCES = 260;           // cap the horizon, always
  constructor(readonly freq: Frequency, readonly untilDay: number) {}

  occurrences(startDay: number): number[] {
    const step = this.freq === "daily" ? 1 : 7;
    const out: number[] = [];
    for (let d = startDay; d <= this.untilDay && out.length < RecurrenceRule.MAX_OCCURRENCES; d += step)
      out.push(d);
    return out;
  }
}

class Scheduler {
  private rooms = new Map<string, Room>();
  private listeners: Array<(msg: string) => void> = [];
  private lastId = 400;

  addRoom(room: Room): void { this.rooms.set(room.id, room); }
  onEvent(listener: (msg: string) => void): void { this.listeners.push(listener); }
  private publish(msg: string): void { for (const l of this.listeners) l(msg); }
  private nextId(): string { this.lastId += 1; return "B" + this.lastId; }

  async book(roomId: string, slot: TimeSlot, organiser: string, attendees: string[] = []): Promise<Booking> {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error("no such room: " + roomId);
    return room.lock.run(() => {                   // check AND write, one indivisible step
      const clash = room.index.firstConflict(slot);
      if (clash) throw new ConflictError(clash);
      const booking: Booking = { id: this.nextId(), roomId, organiser, slot, attendees };
      room.index.add(booking);
      this.publish("booked " + booking.id + " in " + roomId);
      return booking;
    });
  }

  async findRoom(slot: TimeSlot, minSeats: number, needed: Feature[], organiser: string): Promise<Booking | null> {
    for (const room of this.rooms.values()) {
      if (!room.suits(minSeats, needed)) continue; // capacity and features first
      try { return await this.book(room.id, slot, organiser); }
      catch (e) { if (!(e instanceof ConflictError)) throw e; }   // busy - next room
    }
    return null;
  }

  /** A series conflicts if ANY occurrence conflicts. Check all, then write all. */
  async bookRecurring(roomId: string, startDay: number, fromHour: number, toHour: number,
                      rule: RecurrenceRule, organiser: string): Promise<Booking[]> {
    const room = this.rooms.get(roomId)!;
    return room.lock.run(() => {
      const slots: TimeSlot[] = [];
      for (const day of rule.occurrences(startDay)) {
        const slot = TimeSlot.on(day, fromHour, toHour);
        const clash = room.index.firstConflict(slot);
        if (clash) throw new Error("series refused: day" + day + " clashes with " + clash.id);
        slots.push(slot);
      }
      const made = slots.map((slot) => {
        const booking: Booking = { id: this.nextId(), roomId, organiser, slot, attendees: [] };
        room.index.add(booking);
        return booking;
      });
      this.publish("booked a " + made.length + "-occurrence series in " + roomId);
      return made;
    });
  }

  async cancel(roomId: string, bookingId: string): Promise<void> {
    const room = this.rooms.get(roomId)!;
    await room.lock.run(() => {
      room.index.remove(bookingId);
      this.publish("cancelled " + bookingId);
    });
  }

  /** Sort by start, keep a min-heap of end times, return the PEAK size. */
  static roomsNeeded(meetings: TimeSlot[]): number {
    const sorted = [...meetings].sort((a, b) => a.start - b.start);
    const endsInUse: Minute[] = [];                // small n: a sorted array IS the heap
    let peak = 0;
    for (const m of sorted) {
      // half-open: a room ending exactly when this starts is reusable
      if (endsInUse.length > 0 && endsInUse[0] <= m.start) endsInUse.shift();
      const at2 = endsInUse.findIndex((e) => e > m.end);
      endsInUse.splice(at2 === -1 ? endsInUse.length : at2, 0, m.end);
      peak = Math.max(peak, endsInUse.length);
    }
    return peak;
  }
}

async function main(): Promise<void> {
  const scheduler = new Scheduler();
  scheduler.addRoom(new Room("R1", "Huddle", 4, new Set(), new SortedIndex()));
  scheduler.addRoom(new Room("R2", "Sync", 8, new Set([Feature.Projector]), new SortedIndex()));
  scheduler.addRoom(new Room("R3", "Boardroom", 12,
    new Set([Feature.Projector, Feature.VideoConf]), new SortedIndex()));
  scheduler.onEvent((msg) => console.log("   [notify] " + msg));

  const mon = 0;

  console.log("-- back to back is allowed --");
  await scheduler.book("R2", TimeSlot.on(mon, 10, 11), "ana", ["bo"]);
  await scheduler.book("R2", TimeSlot.on(mon, 11, 12), "bo", ["ana"]);
  console.log("   10-11 and 11-12 both booked: [start, end) is half-open");

  console.log("-- an overlapping request is refused --");
  try { await scheduler.book("R2", TimeSlot.on(mon, 11, 13), "cy"); }
  catch (e) { console.log("   refused: " + (e as Error).message); }

  console.log("-- find any room seating 8 with a projector --");
  const found = await scheduler.findRoom(TimeSlot.on(mon, 11, 12), 8, [Feature.Projector], "dee");
  console.log("   -> " + (found ? found.roomId + " " + found.slot.show() : "nothing free"));

  console.log("-- a recurring series is all-or-nothing --");
  await scheduler.book("R1", TimeSlot.on(mon + 2, 9, 10), "eli");
  try { await scheduler.bookRecurring("R1", mon, 9, 10, new RecurrenceRule("daily", mon + 4), "ana"); }
  catch (e) { console.log("   " + (e as Error).message); }

  console.log("-- how many rooms do these five meetings need? --");
  console.log("   rooms needed: " + Scheduler.roomsNeeded([
    TimeSlot.on(mon, 9, 12), TimeSlot.on(mon, 9, 11), TimeSlot.on(mon, 10, 13),
    TimeSlot.on(mon, 11, 12), TimeSlot.on(mon, 13, 15)]));

  console.log("-- two people book the same slot at the same instant --");
  const attempt = async (who: string): Promise<string> => {
    try { return who + " got " + (await scheduler.book("R3", TimeSlot.on(mon, 15, 16), who)).id; }
    catch (e) { return who + " refused: " + (e as Error).message; }
  };
  for (const line of await Promise.all([attempt("fay"), attempt("gus")])) console.log("   " + line);
  console.log("exactly one winner, because check and write share the room's lock");
}

main();

/* expected output:

-- back to back is allowed --
   [notify] booked B401 in R2
   [notify] booked B402 in R2
   10-11 and 11-12 both booked: [start, end) is half-open
-- an overlapping request is refused --
   refused: clashes with B402
-- find any room seating 8 with a projector --
   [notify] booked B403 in R3
   -> R3 day0 11:00-12:00
-- a recurring series is all-or-nothing --
   [notify] booked B404 in R1
   series refused: day2 clashes with B404
-- how many rooms do these five meetings need? --
   rooms needed: 3
-- two people book the same slot at the same instant --
   [notify] booked B405 in R3
   fay got B405
   gus refused: clashes with B405
exactly one winner, because check and write share the room's lock
*/`,
      },
    ],
    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Strip the meetings away and this is **reserving a non-overlapping range on a resource**. Once you can write the overlap predicate without thinking, and once you know that `[start, end)` is the convention that makes adjacency work, an entire family of problems becomes the same problem.",
      },
      {
        type: "ul",
        items: [
          "**Hotel and seat booking** — a room for three nights is an interval; check-out day is the exclusive end, which is exactly why hotels never double-count it.",
          "**Machine or vehicle scheduling** — one crane, one operating theatre, one rental car, a queue of interval requests.",
          "**Cron and job windows** — *“is any job already running in this maintenance window?”* is the same `overlaps()`.",
          "**Calendar free/busy and availability search** — intersecting free intervals across people is the predicate's twin.",
          "**Version and validity ranges** — a price valid `[from, to)`, a feature flag active in a window; databases model this as a range type for exactly this reason.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The twenty-second version to say out loud",
        text: "*“A slot is half-open `[start, end)`, so back-to-back meetings are legal. Two slots overlap iff `aStart < bEnd && bStart < aEnd` — one line, no case analysis. Booking takes the room's own lock, runs that check against the room's bookings, and writes while still holding it. And if you ask how many rooms N meetings need: sort by start, min-heap of end times, the peak heap size is the answer.”*",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When it runs on more than one machine.** A per-room lock in one process guards nothing across servers. The check has to move into the database as an exclusion constraint, or become optimistic concurrency with a version and a retry.",
          "**When the calendar is enormous.** A linear scan per room is right for an office and wrong for a booking platform. That is when the interval tree stops being a talking point and starts being the implementation.",
          "**When intervals are not the model.** Overlapping is fine for rooms; for *people* you often want capacity — a resource that can take three simultaneous bookings turns the boolean predicate into a counting problem, and the min-heap becomes a sweep line over start and end events.",
          "**When recurrence gets real.** *“The third Thursday of every month, except December, moved to the following week”* is a rules engine. Storing a rule plus an exception list holds up for a long time, but it is not free, and the RFC that standardises it is longer than this lesson.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**`aStart < bEnd && bStart < aEnd` — strict on both sides.** One line, no branches, and the strictness is what makes 10–11 and 11–12 both bookable. Say the half-open convention out loud before you write it, and you have already answered the two questions this round exists to ask.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "The overlap test is a single symmetric expression, so there is no wrong branch to hide in — the correctness of the whole system rests on two comparisons.",
        "Half-open intervals make back-to-back bookings work with no special case, and they are the same convention as array slices, so nothing new has to be remembered.",
        "A lock per room means two rooms are never in each other's way, which is the difference between a fifty-room office and a fifty-deep queue.",
        "AvailabilityIndex is an interface, so the linear scan you write in the interview can become a sorted list or an interval tree by changing one constructor argument.",
        "Capacity and features are fields on Room, so a room with a projector and a whiteboard needs no new type — and neither does the room somebody adds next year.",
      ],
      cons: [
        "The per-room lock is worthless the moment the service runs on two machines; correctness then depends entirely on a database constraint you have not written yet.",
        "A linear index rescans a room's whole list for every query, which is fine at office scale and quietly quadratic when someone imports a year of history.",
        "Refusing a whole recurring series because one occurrence clashes is correct but blunt — real calendars offer to skip or move that occurrence, and that needs an exception list you now have to maintain.",
        "Storing instants in UTC makes every display path do timezone conversion, and any recurring rule that forgets to carry its zone silently drifts an hour when the clocks change.",
        "Treating rooms as single-occupancy means the model cannot express a resource with capacity greater than one without replacing the boolean check with a counting sweep.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "Allen's interval algebra",
        href: "https://en.wikipedia.org/wiki/Allen%27s_interval_algebra",
        kind: "article",
        note: "The thirteen possible relations between two intervals, named and enumerated. Reading it is the fastest way to see why the one-line predicate is complete.",
      },
      {
        label: "Interval tree",
        href: "https://en.wikipedia.org/wiki/Interval_tree",
        kind: "article",
        note: "The augmented-BST structure, including the maxEnd pruning rule the lesson draws. Skim the centered-interval variant too — interviewers sometimes mean that one.",
      },
      {
        label: "PostgreSQL range types and exclusion constraints",
        href: "https://www.postgresql.org/docs/current/rangetypes.html",
        kind: "docs",
        note: "The production answer to double-booking: EXCLUDE USING gist on a tsrange makes overlapping rows impossible at the storage layer. The example in this page is literally a room reservation.",
      },
      {
        label: "RFC 5545 — iCalendar, and the RRULE grammar",
        href: "https://datatracker.ietf.org/doc/html/rfc5545",
        kind: "spec",
        note: "What recurrence looks like when it is taken seriously. Section 3.8.5 is the recurrence rule; skimming it is a good cure for wanting to invent your own.",
      },
      {
        label: "Martin Fowler — Recurring Events for Calendars",
        href: "https://martinfowler.com/apsupp/recurring.pdf",
        kind: "paper",
        note: "The analysis-patterns treatment of temporal sets and schedules. It is where the rule-plus-exception model in this lesson comes from.",
      },
      {
        label: "The Problem with Time & Timezones — Computerphile",
        href: "https://www.youtube.com/watch?v=-5wpm-gesOY",
        kind: "video",
        note: "Ten minutes on why the DST paragraph in this lesson matters. Worth watching once before any interview that touches calendars.",
      },
      {
        label: "Introduction to Algorithms — Cormen, Leiserson, Rivest, Stein",
        kind: "book",
        note: "Chapter 14 builds the interval tree from a red-black tree and proves the maxEnd pruning rule correct — the argument you want to be able to sketch.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "meeting-room-scheduler-q1",
        question: "What is the correct test for whether two half-open intervals `[aStart, aEnd)` and `[bStart, bEnd)` overlap?",
        options: [
          { id: "a", label: "aStart < bEnd && bStart < aEnd" },
          { id: "b", label: "aStart <= bEnd && bStart <= aEnd" },
          { id: "c", label: "aStart < bStart && aEnd < bEnd" },
          { id: "d", label: "Four separate branches: a starts inside b, b starts inside a, a contains b, b contains a." },
        ],
        correctOptionId: "a",
        explanation:
          "One symmetric expression covers all four geometric cases. (d) is tempting because the four cases are real — but they are not four *tests*, they are four pictures of the same two comparisons, and writing them out separately just gives you four chances to get an operator wrong.",
      },
      {
        id: "meeting-room-scheduler-q2",
        question: "A meeting runs 10:00–11:00 and someone requests 11:00–12:00 in the same room. What should happen, and why?",
        options: [
          { id: "a", label: "Allowed — intervals are half-open, so the first ends exclusively at 11:00 and nothing is shared." },
          { id: "b", label: "Refused — they touch at 11:00, so they overlap." },
          { id: "c", label: "Allowed, but only if the room has a 15-minute buffer configured." },
          { id: "d", label: "It depends on the database isolation level." },
        ],
        correctOptionId: "a",
        explanation:
          "`[10, 11)` does not include 11:00, so there is no instant belonging to both. (b) is what you get from `<=` instead of `<`, and it refuses every back-to-back booking in the building — the single most common bug in this round.",
      },
      {
        id: "meeting-room-scheduler-q3",
        question: "Bookings for a room are kept in a list sorted by start time. Why is checking only the neighbour before and the neighbour after the insertion point enough?",
        options: [
          { id: "a", label: "Because the list is also non-overlapping, so anything further away would have to overlap its own neighbour first." },
          { id: "b", label: "Because binary search only ever returns two candidates." },
          { id: "c", label: "Because bookings are always exactly one hour long." },
          { id: "d", label: "It is not enough — you have to scan outward until you find a non-overlapping entry." },
        ],
        correctOptionId: "a",
        explanation:
          "The invariant does the work, not the search. In a sorted *and* non-overlapping list, an entry two positions away cannot reach across the entry between it and you without overlapping that entry — which the invariant forbids. Drop the non-overlapping guarantee and (d) becomes correct.",
      },
      {
        id: "meeting-room-scheduler-q4",
        question: "In an interval tree, each node stores `maxEnd` — the largest end time in its subtree. What does that let you do?",
        options: [
          { id: "a", label: "Skip an entire subtree when its maxEnd is <= the query's start, because nothing in it can possibly overlap." },
          { id: "b", label: "Keep the tree balanced without rotations." },
          { id: "c", label: "Find the longest meeting in O(1)." },
          { id: "d", label: "Sort the bookings by end time instead of start time." },
        ],
        correctOptionId: "a",
        explanation:
          "That one comparison is the entire reason the structure exists: it turns a full traversal into a single root-to-leaf path. Naming \"interval tree\" in an interview is worth nothing on its own — being able to state this pruning rule is what earns the mark.",
      },
      {
        id: "meeting-room-scheduler-q5",
        question: "Given N meetings, how do you compute the minimum number of rooms needed?",
        options: [
          { id: "a", label: "Sort by start time, keep a min-heap of end times, reuse a room when its end is <= the next start, and return the peak heap size." },
          { id: "b", label: "Sort by end time and count how many meetings finish after the first one starts." },
          { id: "c", label: "Divide the total meeting minutes by the length of the day and round up." },
          { id: "d", label: "Return the final size of the heap after processing every meeting." },
        ],
        correctOptionId: "a",
        explanation:
          "The heap holds one entry per room currently in use, so its peak size is the answer. (d) is the tempting near-miss: the heap shrinks as the day empties out, so the final size tells you about the last few meetings, not the busiest moment.",
      },
      {
        id: "meeting-room-scheduler-q6",
        question: "Two people press Book for the same room and slot at the same instant. What is the right fix in a 60-minute round?",
        options: [
          { id: "a", label: "A lock per room, taken around both the conflict check and the write — and mention a database exclusion constraint as the production answer." },
          { id: "b", label: "One lock on the whole scheduler, so no two bookings can ever interleave." },
          { id: "c", label: "Retry the losing request automatically until it succeeds." },
          { id: "d", label: "Nothing — the conflict check already returns the right answer." },
        ],
        correctOptionId: "a",
        explanation:
          "Check and write must be one indivisible step, and the natural unit of contention is the room. (b) is correct but serialises rooms that have nothing to do with each other; (d) is the actual bug — the check was right when it ran, and stale by the time the write landed.",
      },
      {
        id: "meeting-room-scheduler-q7",
        question: "A daily 9am standup recurs for six months. How should the recurrence be stored?",
        options: [
          { id: "a", label: "As a rule holding the local time plus the zone and an end date, generating occurrences on demand within a capped horizon." },
          { id: "b", label: "As one row per occurrence, written at creation time." },
          { id: "c", label: "As a single UTC instant plus a 24-hour step, so the arithmetic stays simple." },
          { id: "d", label: "As a rule with no end date, expanded whenever anyone opens the calendar." },
        ],
        correctOptionId: "a",
        explanation:
          "9am means 9am *local*, and the UTC instant shifts when the clocks change — which is exactly why (c) breaks twice a year and is the tempting answer for anyone who has only ever thought in epoch seconds. (d) fails because an unbounded rule makes the conflict check unbounded too.",
      },
      {
        id: "meeting-room-scheduler-q8",
        question: "Rooms differ by seat count and by equipment (projector, video conferencing). How should that be modelled?",
        options: [
          { id: "a", label: "As fields on Room — an int and a set of features — filtered by findRoom before it looks at time at all." },
          { id: "b", label: "As subclasses: ProjectorRoom, VideoRoom, LargeRoom." },
          { id: "c", label: "As a separate Equipment service queried during the booking flow." },
          { id: "d", label: "As a string description on Room, parsed when filtering." },
        ],
        correctOptionId: "a",
        explanation:
          "The rooms do not *behave* differently — they hold different values, which is the test for data versus a class. (b) is tempting because it looks object-oriented, right up to the room that has a projector and a whiteboard and would need to inherit from two places.",
      },
    ],
  },
};
