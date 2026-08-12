import type { RoadmapLesson } from "@/lib/content/types";

export const elevatorSystem: RoadmapLesson = {
  title: "Elevator / Lift system",
  oneLiner:
    "Every other problem in this set asks *what* to model. This one asks **in what order do you serve people, and which car goes**. Get the two request types wrong and no scheduling algorithm can save you; serve them in arrival order and the car travels **18 floors where 7 would do**.",
  difficulty: "intermediate",
  estimatedTime: "30 min",
  prototypePath: "/prototypes/lld/elevator-system.html",
  content: {
    prototypeCaption:
      "A 10-floor building with two cars. Press **▲ or ▼ next to any floor** to make a hall call — the explain line tells you *which* car took it and why. Press a floor number inside a car's panel for a car call. Then the whole point: press **⚡ Rush hour**, run it under **🧭 LOOK**, note `floors travelled`, press **🔀 FIFO**, and run the identical burst again. Same requests, same cars, **11 floors versus 21**. The **🎯 Nearest car** and **⚖️ Least load** chips swap the dispatch policy without changing a single call site.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design an elevator system.”* Most candidates start drawing a car and a shaft. That is not where the difficulty is. A car that moves up and down is twenty lines.",
      },
      {
        type: "p",
        text: "The difficulty is that requests **arrive faster than you can serve them**, from two completely different places, and you have to decide two things every time: *in what order do I serve what I have*, and *which car takes the next one*. Everything else in this problem is scaffolding around those two decisions.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 400" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A cutaway of a ten-floor building with two lift shafts. Car one sits at floor three with a rider inside pressing the number three button, car two sits at floor eight. A person standing on floor seven presses the up button outside. Each part is labelled with the class it becomes: Building, Floor, ElevatorCar, HallCall with floor and direction, CarCall with a destination only, and ElevatorSystem which owns the cars and picks one.">
  <defs>
    <marker id="el-lead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <text x="146" y="22" font-size="10" fill="#9099a8">Building — 10 floors, 2 shafts</text>
  <rect x="140" y="30" width="328" height="326" rx="8" fill="none" stroke="#3a414c" stroke-width="1.4"/>

  <text x="150" y="63" font-size="9" fill="#6b7280">10</text>
  <text x="152" y="93" font-size="9" fill="#6b7280">9</text>
  <text x="152" y="123" font-size="9" fill="#6b7280">8</text>
  <text x="152" y="153" font-size="9" fill="#fb863a">7</text>
  <text x="152" y="183" font-size="9" fill="#6b7280">6</text>
  <text x="152" y="213" font-size="9" fill="#6b7280">5</text>
  <text x="152" y="243" font-size="9" fill="#6b7280">4</text>
  <text x="152" y="273" font-size="9" fill="#fb863a">3</text>
  <text x="152" y="303" font-size="9" fill="#6b7280">2</text>
  <text x="152" y="333" font-size="9" fill="#6b7280">1</text>

  <rect x="182" y="44" width="118" height="300" rx="4" fill="#0f1114" stroke="#2d333d"/>
  <rect x="306" y="44" width="118" height="300" rx="4" fill="#0f1114" stroke="#2d333d"/>
  <line x1="182" y1="74" x2="424" y2="74" stroke="#232830"/>
  <line x1="182" y1="104" x2="424" y2="104" stroke="#232830"/>
  <line x1="182" y1="134" x2="424" y2="134" stroke="#232830"/>
  <line x1="182" y1="164" x2="424" y2="164" stroke="#232830"/>
  <line x1="182" y1="194" x2="424" y2="194" stroke="#232830"/>
  <line x1="182" y1="224" x2="424" y2="224" stroke="#232830"/>
  <line x1="182" y1="254" x2="424" y2="254" stroke="#232830"/>
  <line x1="182" y1="284" x2="424" y2="284" stroke="#232830"/>
  <line x1="182" y1="314" x2="424" y2="314" stroke="#232830"/>

  <rect x="186" y="256" width="110" height="26" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="192" y="274" font-size="10" fill="#fb863a">#1 ▲</text>
  <text x="232" y="274" font-size="11">🧑</text>
  <rect x="254" y="261" width="36" height="16" rx="3" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="264" y="273" font-size="9" fill="#fb863a">[3]</text>

  <rect x="310" y="106" width="110" height="26" rx="4" fill="#14161a" stroke="#5e9ff6"/>
  <text x="316" y="124" font-size="10" fill="#5e9ff6">#2 —</text>
  <text x="378" y="124" font-size="9" fill="#6b7280">idle</text>

  <text x="434" y="148" font-size="10" fill="#fb863a">▲</text>
  <text x="448" y="148" font-size="10" fill="#6b7280">▼</text>
  <text x="474" y="152" font-size="15">🧍</text>

  <text x="14" y="238" font-size="11" fill="#fb863a">Floor</text>
  <text x="14" y="254" font-size="9" fill="#9099a8">just an int 1..10</text>
  <text x="14" y="268" font-size="9" fill="#9099a8">— it has no behaviour</text>
  <line x1="96" y1="248" x2="144" y2="252" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#el-lead)"/>

  <text x="500" y="72" font-size="11" fill="#fb863a">ElevatorCar</text>
  <text x="500" y="88" font-size="9" fill="#9099a8">floor · direction · state</text>
  <text x="500" y="102" font-size="9" fill="#9099a8">upRequests · downRequests</text>
  <line x1="496" y1="82" x2="428" y2="112" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#el-lead)"/>

  <text x="500" y="158" font-size="11" fill="#fb863a">HallCall(7, UP)</text>
  <text x="500" y="174" font-size="9" fill="#9099a8">pressed OUTSIDE</text>
  <text x="500" y="188" font-size="9" fill="#9099a8">knows a direction</text>
  <text x="500" y="202" font-size="9" fill="#f06868">does NOT know where</text>
  <text x="500" y="216" font-size="9" fill="#f06868">the rider is going</text>
  <line x1="496" y1="152" x2="466" y2="150" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#el-lead)"/>

  <text x="500" y="264" font-size="11" fill="#fb863a">CarCall(3)</text>
  <text x="500" y="280" font-size="9" fill="#9099a8">pressed INSIDE</text>
  <text x="500" y="294" font-size="9" fill="#9099a8">knows the destination</text>
  <text x="500" y="308" font-size="9" fill="#f06868">carries NO direction</text>
  <line x1="496" y1="270" x2="296" y2="270" stroke="#fb863a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#el-lead)"/>

  <text x="500" y="344" font-size="11" fill="#5cc66f">ElevatorSystem</text>
  <text x="500" y="360" font-size="9" fill="#9099a8">owns the cars ·</text>
  <text x="500" y="374" font-size="9" fill="#9099a8">picks which one goes</text>
  <line x1="496" y1="338" x2="472" y2="330" stroke="#5cc66f" stroke-width="1" stroke-dasharray="3 3"/>
</svg>`,
        caption:
          "Look at the two orange labels on the right. The person outside pressed **a direction**; the rider inside pressed **a destination**. Those are not the same object, and treating them as one number is the mistake this whole lesson is about.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **hall call** is `(floor, direction)` and goes to the `ElevatorSystem`, which asks a **strategy** which car should take it. A **car call** is `(floor)` and goes straight to one car. Each car then serves what it holds using **LOOK**: keep going the way you are going, stop for everything on the way, and only reverse when there is nothing left ahead.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Are there two request types?** A `HallCall(floor, direction)` and a `CarCall(floor)`. One list of integers is the single most common way to fail this round, and it is fatal — you cannot decide whether to stop for someone if you never recorded which way they wanted to go.",
          "**Is the serving order LOOK, not FIFO?** Arrival order makes the car yo-yo past floors it is standing next to. The interviewer will hand you a request stream and count floors.",
          "**Is *which car* a separate, swappable decision?** `ElevatorSystem.request()` asks a `SchedulingStrategy`. The car itself knows nothing about the other cars.",
          "**Is time an input?** A `tick()` you call from outside, or an injected clock. A `Thread.sleep` inside the movement means nothing you wrote can be tested.",
          "**Does it run?** Two cars, a stream of calls, and a `main()` that prints floor-by-floor and then the total floors travelled.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- clarify ----------
      { type: "h", text: "Step 1 · Clarify — 5 minutes" },
      {
        type: "ul",
        items: [
          "**How many floors and how many cars?** — *“10 floors, 2 cars”* is the sweet spot. One car removes the dispatch conversation, which is half the problem. Twenty cars is the same code with a bigger loop.",
          "**Do riders enter a destination outside, or just a direction?** — say **just a direction**. That is the classic building, and it is what makes hall calls and car calls different objects. Destination entry is the best follow-up you will get, so keep it in your pocket.",
          "**Should I simulate time, or is this event-driven?** — *“I'll expose a `tick()` that advances one floor, and drive it from `main()`.”* Say this in the first five minutes and you have pre-answered the testability question.",
          "**Do cars have capacity limits?** — ask, then say you will model a count and refuse *riders*, not requests. It is one field.",
          "**Doors, motors, sensors, emergency brakes?** — out of scope. Doors exist as a **state with a timer**, nothing more.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 268" width="100%" style="max-width:660px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two panels. The left panel, In scope, lists: ten floors and two cars; hall calls carrying floor and direction; car calls carrying a destination; LOOK scheduling inside each car; a pluggable dispatch strategy; a tick driven simulation; and a main demo. The right panel, Out of scope, lists: motor and sensor control; door hardware; a UI; persistence; access control and billing; and destination dispatch panels.">
  <rect x="10" y="14" width="330" height="240" rx="9" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="28" y="40" font-size="11" fill="#5cc66f">IN SCOPE — I will build this</text>
  <line x1="28" y1="52" x2="322" y2="52" stroke="#2d333d"/>
  <text x="28" y="78" font-size="11" fill="#5cc66f">✓</text><text x="48" y="78" font-size="11" fill="#e8e4dc">10 floors · 2 cars</text>
  <text x="28" y="110" font-size="11" fill="#5cc66f">✓</text><text x="48" y="110" font-size="11" fill="#e8e4dc">HallCall(floor, direction)</text>
  <text x="28" y="142" font-size="11" fill="#5cc66f">✓</text><text x="48" y="142" font-size="11" fill="#e8e4dc">CarCall(floor)</text>
  <text x="28" y="174" font-size="11" fill="#5cc66f">✓</text><text x="48" y="174" font-size="11" fill="#e8e4dc">LOOK inside each car</text>
  <text x="28" y="206" font-size="11" fill="#5cc66f">✓</text><text x="48" y="206" font-size="11" fill="#e8e4dc">pluggable dispatch</text>
  <text x="28" y="238" font-size="11" fill="#5cc66f">✓</text><text x="48" y="238" font-size="11" fill="#e8e4dc">tick() + a main() demo</text>

  <rect x="360" y="14" width="330" height="240" rx="9" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="378" y="40" font-size="11" fill="#f06868">OUT — agreed, not built</text>
  <line x1="378" y1="52" x2="672" y2="52" stroke="#2d333d"/>
  <text x="378" y="78" font-size="11" fill="#f06868">✗</text><text x="398" y="78" font-size="11" fill="#9099a8">motor / sensor control</text>
  <text x="378" y="110" font-size="11" fill="#f06868">✗</text><text x="398" y="110" font-size="11" fill="#9099a8">door hardware</text>
  <text x="378" y="142" font-size="11" fill="#f06868">✗</text><text x="398" y="142" font-size="11" fill="#9099a8">any UI</text>
  <text x="378" y="174" font-size="11" fill="#f06868">✗</text><text x="398" y="174" font-size="11" fill="#9099a8">persistence</text>
  <text x="378" y="206" font-size="11" fill="#f06868">✗</text><text x="398" y="206" font-size="11" fill="#9099a8">access control / billing</text>
  <text x="378" y="238" font-size="11" fill="#f06868">✗</text><text x="398" y="238" font-size="11" fill="#9099a8">destination-entry panels</text>
</svg>`,
        caption:
          "Note the bottom-right item. **Destination dispatch is the follow-up**, not the build — but naming it here tells the interviewer you know it exists, which buys you the whole conversation at minute 50.",
      },

      // ---------- the two request types ----------
      { type: "h", text: "Step 2 · Two request types — and beginners merge them" },
      {
        type: "p",
        text: "Read the problem back and notice there are two buttons in two different places. The one in the lobby says *“I am on floor 7 and I want to go up.”* The one inside the car says *“take me to floor 3.”* They carry different information, they are created by different people, and they are answered by different objects.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 316" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two panels compared. A HallCall carries a floor and a direction, is pressed outside, does not know the destination, and is answered by the ElevatorSystem which picks a car. A CarCall carries only a destination floor, is pressed inside, carries no direction, and is answered by that one car. Below, a red strip shows a single list of integers collapsing both into a floor number, so the car can no longer tell whether to stop for a rider going the other way.">
  <text x="20" y="24" font-size="10.5" fill="#5e9ff6">HALL CALL — pressed outside</text>
  <rect x="20" y="34" width="316" height="176" rx="8" fill="#14161a" stroke="#5e9ff6"/>
  <text x="38" y="60" font-size="11" fill="#e8e4dc">HallCall(floor, direction)</text>
  <line x1="38" y1="72" x2="318" y2="72" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="38" y="94" font-size="10" fill="#5cc66f">knows</text><text x="106" y="94" font-size="10" fill="#e8e4dc">which floor</text>
  <text x="106" y="112" font-size="10" fill="#e8e4dc">which way the rider wants to go</text>
  <text x="38" y="140" font-size="10" fill="#f06868">does not</text><text x="106" y="140" font-size="10" fill="#9099a8">know the destination</text>
  <text x="38" y="172" font-size="10" fill="#9099a8">answered by</text>
  <text x="106" y="172" font-size="10" fill="#fb863a">system.request(call)</text>
  <text x="106" y="190" font-size="9" fill="#6b7280">— any car in the bank may take it</text>

  <text x="364" y="24" font-size="10.5" fill="#5e9ff6">CAR CALL — pressed inside</text>
  <rect x="364" y="34" width="316" height="176" rx="8" fill="#14161a" stroke="#5e9ff6"/>
  <text x="382" y="60" font-size="11" fill="#e8e4dc">CarCall(floor)</text>
  <line x1="382" y1="72" x2="662" y2="72" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="382" y="94" font-size="10" fill="#5cc66f">knows</text><text x="450" y="94" font-size="10" fill="#e8e4dc">the exact destination</text>
  <text x="382" y="140" font-size="10" fill="#f06868">does not</text><text x="450" y="140" font-size="10" fill="#9099a8">carry a direction — it is</text>
  <text x="450" y="158" font-size="10" fill="#9099a8">implied by where the car is</text>
  <text x="382" y="172" font-size="10" fill="#9099a8">answered by</text>
  <text x="450" y="172" font-size="10" fill="#fb863a">car.addRequest(call)</text>
  <text x="450" y="190" font-size="9" fill="#6b7280">— this car and no other</text>

  <rect x="20" y="230" width="660" height="72" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="38" y="256" font-size="10.5" fill="#f06868">✗ List&lt;Integer&gt; requests   — both collapsed into a floor number</text>
  <text x="38" y="280" font-size="10" fill="#9099a8">the car is at floor 5 going UP and sees “7”. Is that someone going up, who it should pick up now?</text>
  <text x="38" y="296" font-size="10" fill="#9099a8">Or someone going down, who should wait for the return trip? The information is gone. It cannot be recovered.</text>
</svg>`,
        caption:
          "The red strip is the actual failure. Once the direction is thrown away, **every scheduling algorithm you write on top is guessing** — and the interviewer's next question is exactly the one you can no longer answer.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The question that exposes it",
        text: "*“Your car is at floor 5 going up, and someone on floor 7 pressed the down button. Do you stop for them?”* The answer is **no — not on this trip**. You carry on up, serve everyone going up, and pick them up on the way back down. If your requests are plain integers you cannot even express that answer, let alone code it.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 296" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A table mapping nouns from the problem statement to the classes they become. Building becomes ElevatorSystem, a floor stays a plain integer, the outside up and down buttons become HallCall, the inside number buttons become CarCall, the lift car becomes ElevatorCar, up and down become a Direction enum, moving and doors open become a CarState enum, and the question of which car takes a call becomes a SchedulingStrategy interface.">
  <text x="20" y="22" font-size="10" fill="#9099a8">NOUN IN THE PROBLEM</text>
  <text x="250" y="22" font-size="10" fill="#fb863a">BECOMES</text>
  <text x="452" y="22" font-size="10" fill="#9099a8">WHY</text>
  <line x1="20" y1="32" x2="680" y2="32" stroke="#3a414c"/>

  <text x="20" y="58" font-size="10.5" fill="#e8e4dc">the building</text>
  <text x="250" y="58" font-size="10.5" fill="#fb863a">ElevatorSystem</text>
  <text x="452" y="58" font-size="9.5" fill="#9099a8">owns the cars, routes calls</text>

  <text x="20" y="88" font-size="10.5" fill="#e8e4dc">a floor</text>
  <text x="250" y="88" font-size="10.5" fill="#9099a8">int  (1..10)</text>
  <text x="452" y="88" font-size="9.5" fill="#5cc66f">no data, no behaviour — not a class</text>

  <text x="20" y="118" font-size="10.5" fill="#e8e4dc">the ▲▼ buttons outside</text>
  <text x="250" y="118" font-size="10.5" fill="#fb863a">HallCall(floor, dir)</text>
  <text x="452" y="118" font-size="9.5" fill="#9099a8">a floor AND a direction</text>

  <text x="20" y="148" font-size="10.5" fill="#e8e4dc">the number pad inside</text>
  <text x="250" y="148" font-size="10.5" fill="#fb863a">CarCall(floor)</text>
  <text x="452" y="148" font-size="9.5" fill="#9099a8">a destination, no direction</text>

  <text x="20" y="178" font-size="10.5" fill="#e8e4dc">a lift car</text>
  <text x="250" y="178" font-size="10.5" fill="#fb863a">ElevatorCar</text>
  <text x="452" y="178" font-size="9.5" fill="#9099a8">floor, direction, two request sets</text>

  <text x="20" y="208" font-size="10.5" fill="#e8e4dc">up / down</text>
  <text x="250" y="208" font-size="10.5" fill="#fb863a">Direction  «enum»</text>
  <text x="452" y="208" font-size="9.5" fill="#9099a8">UP · DOWN · IDLE</text>

  <text x="20" y="238" font-size="10.5" fill="#e8e4dc">moving / doors open</text>
  <text x="250" y="238" font-size="10.5" fill="#fb863a">CarState  «enum»</text>
  <text x="452" y="238" font-size="9.5" fill="#9099a8">a state machine, one per car</text>

  <text x="20" y="268" font-size="10.5" fill="#e8e4dc">“which car goes?”</text>
  <text x="250" y="268" font-size="10.5" fill="#5cc66f">SchedulingStrategy</text>
  <text x="452" y="268" font-size="9.5" fill="#5cc66f">an interface — this is the seam</text>
  <line x1="20" y1="248" x2="680" y2="248" stroke="#2d333d" stroke-dasharray="3 3"/>
</svg>`,
        caption:
          "Two rows earn their place: **a floor is not a class** (say that out loud — it shows you are modelling, not decorating), and **“which car goes” is a noun too**, which is how a decision becomes an interface.",
      },

      // ---------- FIFO vs LOOK ----------
      { type: "h", text: "Step 3 · FIFO is wrong, and you can measure how wrong" },
      {
        type: "p",
        text: "You have a car at floor 1. Four people press up buttons, in this order: floor 5, floor 2, floor 8, floor 3. Serve them in the order they arrived and watch what the car does.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 384" width="100%" style="max-width:690px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two floor-versus-travel charts for the same request stream. On the left, FIFO serves floors five, two, eight then three in arrival order, zig-zagging up and down for a total of eighteen floors travelled. On the right, LOOK keeps going up and serves two, three, five then eight on the way, for a total of seven floors travelled.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ FIFO — serve in arrival order</text>
  <text x="382" y="22" font-size="10.5" fill="#5cc66f">✓ LOOK — keep going, serve on the way</text>
  <text x="20" y="40" font-size="9.5" fill="#9099a8">car starts at floor 1 · up calls arrive: 5, 2, 8, 3</text>
  <text x="382" y="40" font-size="9.5" fill="#9099a8">identical stream, identical car</text>

  <line x1="56" y1="60" x2="56" y2="316" stroke="#2d333d"/>
  <line x1="56" y1="316" x2="340" y2="316" stroke="#2d333d"/>
  <text x="30" y="92" font-size="9" fill="#6b7280">8</text><line x1="52" y1="88" x2="340" y2="88" stroke="#1c2027" stroke-dasharray="3 4"/>
  <text x="30" y="164" font-size="9" fill="#6b7280">5</text><line x1="52" y1="160" x2="340" y2="160" stroke="#1c2027" stroke-dasharray="3 4"/>
  <text x="30" y="212" font-size="9" fill="#6b7280">3</text><line x1="52" y1="208" x2="340" y2="208" stroke="#1c2027" stroke-dasharray="3 4"/>
  <text x="30" y="236" font-size="9" fill="#6b7280">2</text><line x1="52" y1="232" x2="340" y2="232" stroke="#1c2027" stroke-dasharray="3 4"/>
  <text x="30" y="260" font-size="9" fill="#6b7280">1</text><line x1="52" y1="256" x2="340" y2="256" stroke="#1c2027" stroke-dasharray="3 4"/>

  <polyline points="56,256 116,160 161,232 251,88 326,208" fill="none" stroke="#f06868" stroke-width="1.8"/>
  <circle cx="56" cy="256" r="3.4" fill="#9099a8"/>
  <circle cx="116" cy="160" r="3.6" fill="#f06868"/><text x="120" y="152" font-size="9" fill="#f06868">5</text>
  <circle cx="161" cy="232" r="3.6" fill="#f06868"/><text x="165" y="248" font-size="9" fill="#f06868">2</text>
  <circle cx="251" cy="88" r="3.6" fill="#f06868"/><text x="255" y="80" font-size="9" fill="#f06868">8</text>
  <circle cx="326" cy="208" r="3.6" fill="#f06868"/><text x="314" y="224" font-size="9" fill="#f06868">3</text>
  <text x="56" y="336" font-size="9" fill="#6b7280">floors travelled →</text>
  <text x="20" y="368" font-size="26" fill="#f06868">18</text>
  <text x="66" y="368" font-size="11" fill="#f06868">floors  ·  4+3+6+5</text>

  <line x1="418" y1="60" x2="418" y2="316" stroke="#2d333d"/>
  <line x1="418" y1="316" x2="680" y2="316" stroke="#2d333d"/>
  <text x="392" y="92" font-size="9" fill="#6b7280">8</text><line x1="414" y1="88" x2="680" y2="88" stroke="#1c2027" stroke-dasharray="3 4"/>
  <text x="392" y="164" font-size="9" fill="#6b7280">5</text><line x1="414" y1="160" x2="680" y2="160" stroke="#1c2027" stroke-dasharray="3 4"/>
  <text x="392" y="212" font-size="9" fill="#6b7280">3</text><line x1="414" y1="208" x2="680" y2="208" stroke="#1c2027" stroke-dasharray="3 4"/>
  <text x="392" y="236" font-size="9" fill="#6b7280">2</text><line x1="414" y1="232" x2="680" y2="232" stroke="#1c2027" stroke-dasharray="3 4"/>
  <text x="392" y="260" font-size="9" fill="#6b7280">1</text><line x1="414" y1="256" x2="680" y2="256" stroke="#1c2027" stroke-dasharray="3 4"/>

  <polyline points="418,256 448,232 478,208 538,160 628,88" fill="none" stroke="#5cc66f" stroke-width="1.8"/>
  <circle cx="418" cy="256" r="3.4" fill="#9099a8"/>
  <circle cx="448" cy="232" r="3.6" fill="#5cc66f"/><text x="440" y="224" font-size="9" fill="#5cc66f">2</text>
  <circle cx="478" cy="208" r="3.6" fill="#5cc66f"/><text x="470" y="200" font-size="9" fill="#5cc66f">3</text>
  <circle cx="538" cy="160" r="3.6" fill="#5cc66f"/><text x="530" y="152" font-size="9" fill="#5cc66f">5</text>
  <circle cx="628" cy="88" r="3.6" fill="#5cc66f"/><text x="620" y="80" font-size="9" fill="#5cc66f">8</text>
  <text x="418" y="336" font-size="9" fill="#6b7280">floors travelled →</text>
  <text x="382" y="368" font-size="26" fill="#5cc66f">7</text>
  <text x="414" y="368" font-size="11" fill="#5cc66f">floors  ·  one sweep, 1 → 8</text>
</svg>`,
        caption:
          "**18 versus 7 on four requests.** FIFO walks past floor 2 twice and floor 3 three times without opening the doors. Run the same comparison yourself with **⚡ Rush hour** in the prototype and read `floors travelled` under each chip.",
      },
      {
        type: "p",
        text: "The fix is called **LOOK** (the practical cousin of SCAN, the disk-arm algorithm). The rule is one sentence: *the car has a direction; it keeps going that way, stopping for every request on the way, and only reverses when there is nothing left ahead of it.*",
      },
      {
        type: "p",
        text: "Implementing that becomes easy the moment you hold requests in **two sorted sets** instead of one list.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 300" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A car at floor four holds two sorted sets: upRequests ascending containing five, seven and nine, and downRequests descending containing eight, three and two. While the direction is up the car drains the up set in ascending order, serving five, seven and then nine. At nine there is nothing above, so the direction flips to down and the car drains the down set in descending order, serving eight, three and two.">
  <rect x="20" y="20" width="130" height="58" rx="7" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="42" font-size="11" fill="#fb863a">car #1 · floor 4</text>
  <text x="34" y="62" font-size="10" fill="#fb863a">direction = UP ▲</text>

  <text x="180" y="34" font-size="10" fill="#5cc66f">upRequests   «sorted ascending»</text>
  <rect x="180" y="42" width="52" height="26" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="200" y="59" font-size="10" fill="#5cc66f">5</text>
  <rect x="238" y="42" width="52" height="26" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="258" y="59" font-size="10" fill="#5cc66f">7</text>
  <rect x="296" y="42" width="52" height="26" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="316" y="59" font-size="10" fill="#5cc66f">9</text>
  <text x="366" y="59" font-size="9.5" fill="#5cc66f">← drained first, in this order</text>

  <text x="180" y="106" font-size="10" fill="#9099a8">downRequests «sorted descending»</text>
  <rect x="180" y="114" width="52" height="26" rx="4" fill="#14161a" stroke="#3a414c"/><text x="200" y="131" font-size="10" fill="#9099a8">8</text>
  <rect x="238" y="114" width="52" height="26" rx="4" fill="#14161a" stroke="#3a414c"/><text x="258" y="131" font-size="10" fill="#9099a8">3</text>
  <rect x="296" y="114" width="52" height="26" rx="4" fill="#14161a" stroke="#3a414c"/><text x="316" y="131" font-size="10" fill="#9099a8">2</text>
  <text x="366" y="131" font-size="9.5" fill="#6b7280">waiting — wrong direction for now</text>

  <line x1="20" y1="164" x2="680" y2="164" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="20" y="192" font-size="10.5" fill="#fb863a">at floor 9 there is nothing above → flip</text>
  <rect x="20" y="204" width="130" height="58" rx="7" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="34" y="226" font-size="11" fill="#fb863a">car #1 · floor 9</text>
  <text x="34" y="246" font-size="10" fill="#fb863a">direction = DOWN ▼</text>

  <text x="180" y="218" font-size="10" fill="#6b7280">upRequests    (empty)</text>
  <rect x="180" y="226" width="168" height="26" rx="4" fill="#14161a" stroke="#232830"/><text x="200" y="243" font-size="10" fill="#6b7280">—</text>

  <text x="392" y="218" font-size="10" fill="#5cc66f">downRequests — now the live one</text>
  <rect x="392" y="226" width="52" height="26" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="412" y="243" font-size="10" fill="#5cc66f">8</text>
  <rect x="450" y="226" width="52" height="26" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="470" y="243" font-size="10" fill="#5cc66f">3</text>
  <rect x="508" y="226" width="52" height="26" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="528" y="243" font-size="10" fill="#5cc66f">2</text>

  <text x="20" y="288" font-size="10" fill="#9099a8">the whole algorithm: drain the set that matches my direction, in its own sort order, then flip.</text>
</svg>`,
        caption:
          "Two sorted sets turn a scheduling algorithm into a **data-structure choice**. In Java that is a `TreeSet` and a `TreeSet(reverseOrder())`; the code below is barely fifteen lines because the ordering is already done.",
      },
      {
        type: "code",
        language: "java",
        filename: "the LOOK step, in full",
        code: `/** ONE floor of movement. Called from outside — there is no sleep in here. */
void step() {
    if (state == CarState.DOORS_OPEN) { state = resume(); return; }   // doors take one tick
    if (!busy()) { direction = Direction.IDLE; state = CarState.IDLE; return; }

    if (direction == Direction.IDLE) direction = towardsNearestRequest();
    if (serveHere()) { state = CarState.DOORS_OPEN; return; }         // already standing on one

    if (!workAhead(direction)) direction = opposite(direction);       // nothing left this way
    if (serveHere()) { state = CarState.DOORS_OPEN; return; }

    floor += (direction == Direction.UP) ? 1 : -1;                    // exactly one floor
    floorsTravelled++;
    state = (direction == Direction.UP) ? CarState.MOVING_UP : CarState.MOVING_DOWN;
    if (serveHere()) state = CarState.DOORS_OPEN;                     // stop for it on the way
}

/** Remove a request at the current floor IF it matches where we are going. */
private synchronized boolean serveHere() {
    if (direction == Direction.UP) {
        if (upRequests.remove(floor)) return true;
        if (!anyAbove(floor) && downRequests.remove(floor)) return true;   // turnaround point
    } else {
        if (downRequests.remove(floor)) return true;
        if (!anyBelow(floor) && upRequests.remove(floor)) return true;
    }
    return false;
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "The two lines everyone forgets",
        text: "The `!anyAbove(floor)` branches are the **turnaround rule**. A down request sitting at the top of the run must be served when the car gets there, otherwise the car flips direction, walks away from it, and comes back later. The other easy miss: a **car call you pass on the way** must be served. If your `serveHere()` only looks at the destination it was heading for, you have rebuilt FIFO with extra steps.",
      },

      // ---------- dispatch ----------
      { type: "h", text: "Step 4 · Which car goes — a separate, pluggable decision" },
      {
        type: "p",
        text: "So far every car knows how to serve what it holds. Nothing yet decides **who holds what**. That decision belongs to the `ElevatorSystem`, and it belongs behind an interface — because it is exactly the thing the interviewer will ask you to change.",
      },
      {
        type: "p",
        text: "A cost function you can defend out loud, in three cases: an **idle** car costs its distance. A car **already moving your way, and past-you-is-ahead-of-it**, also costs its distance — it will pass you anyway. A car **moving away, or moving the wrong way**, costs its distance plus a large fixed penalty, so it only wins when nothing else is remotely close.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 340" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. ElevatorSystem holds one to many ElevatorCar and one SchedulingStrategy. SchedulingStrategy is an interface implemented by NearestCarStrategy and LeastLoadStrategy. ElevatorCar holds a floor, a Direction, a CarState and two sorted request sets, and exposes addRequest and step. Request is an interface implemented by HallCall which carries a floor and a direction, and CarCall which carries only a floor.">
  <defs>
    <marker id="el-a" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="20" y="14" width="228" height="84" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="32" y="34" font-size="11.5" fill="#fb863a">ElevatorSystem</text>
  <line x1="20" y1="42" x2="248" y2="42" stroke="#2d333d"/>
  <text x="32" y="60" font-size="10" fill="#e8e4dc">+ request(HallCall) : ElevatorCar</text>
  <text x="32" y="78" font-size="10" fill="#e8e4dc">+ tick()</text>
  <text x="32" y="94" font-size="9.5" fill="#6b7280">+ setStrategy(s)   ← swappable</text>

  <path d="M132,98 L132,112 L124,120 L132,128 L140,120 L132,112" fill="#e8e4dc" stroke="#e8e4dc"/>
  <line x1="132" y1="128" x2="132" y2="156" stroke="#d8d3c9" stroke-width="1.3"/>
  <text x="140" y="148" font-size="9.5" fill="#9099a8">1..*</text>
  <rect x="20" y="156" width="228" height="122" rx="6" fill="#14161a" stroke="#5cc66f" stroke-width="1.3"/>
  <text x="32" y="176" font-size="11.5" fill="#5cc66f">ElevatorCar</text>
  <line x1="20" y1="184" x2="248" y2="184" stroke="#2d333d"/>
  <text x="32" y="202" font-size="10" fill="#9099a8">- floor : int</text>
  <text x="32" y="218" font-size="10" fill="#9099a8">- direction : Direction</text>
  <text x="32" y="234" font-size="10" fill="#9099a8">- state : CarState</text>
  <text x="32" y="250" font-size="10" fill="#fb863a">- upRequests : TreeSet↑</text>
  <text x="32" y="266" font-size="10" fill="#fb863a">- downRequests : TreeSet↓</text>
  <text x="32" y="298" font-size="10" fill="#e8e4dc">+ addRequest(Request)</text>
  <text x="32" y="316" font-size="10" fill="#e8e4dc">+ step()</text>
  <text x="32" y="332" font-size="9.5" fill="#6b7280">knows LOOK · knows no other car</text>

  <line x1="252" y1="52" x2="308" y2="52" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-a)"/>
  <rect x="312" y="24" width="212" height="60" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="324" y="44" font-size="11.5" fill="#5e9ff6">SchedulingStrategy</text>
  <text x="452" y="44" font-size="9" fill="#6b7280">«interface»</text>
  <line x1="312" y1="52" x2="524" y2="52" stroke="#2d333d"/>
  <text x="324" y="72" font-size="10" fill="#e8e4dc">+ pick(cars, HallCall) : ElevatorCar</text>

  <line x1="380" y1="112" x2="380" y2="86" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-a)"/>
  <line x1="480" y1="112" x2="480" y2="86" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-a)"/>
  <line x1="380" y1="112" x2="480" y2="112" stroke="#9099a8" stroke-width="1.2"/>
  <rect x="312" y="116" width="148" height="42" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="324" y="142" font-size="10.5" fill="#e8e4dc">NearestCarStrategy</text>
  <rect x="470" y="116" width="140" height="42" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="482" y="142" font-size="10.5" fill="#e8e4dc">LeastLoadStrategy</text>
  <text x="620" y="142" font-size="9" fill="#5cc66f">add a 3rd</text>
  <text x="620" y="156" font-size="9" fill="#5cc66f">here only</text>

  <line x1="252" y1="200" x2="308" y2="200" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-a)"/>
  <rect x="312" y="180" width="212" height="42" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="324" y="206" font-size="11.5" fill="#5e9ff6">Request  «interface»</text>

  <line x1="380" y1="250" x2="380" y2="224" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-a)"/>
  <line x1="480" y1="250" x2="480" y2="224" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-a)"/>
  <line x1="380" y1="250" x2="480" y2="250" stroke="#9099a8" stroke-width="1.2"/>
  <rect x="312" y="254" width="148" height="46" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="324" y="274" font-size="10.5" fill="#e8e4dc">HallCall</text>
  <text x="324" y="292" font-size="9" fill="#fb863a">floor + direction</text>
  <rect x="470" y="254" width="140" height="46" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="482" y="274" font-size="10.5" fill="#e8e4dc">CarCall</text>
  <text x="482" y="292" font-size="9" fill="#fb863a">floor only</text>

  <rect x="624" y="180" width="76" height="94" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="634" y="200" font-size="10" fill="#e8e4dc">Direction</text>
  <text x="634" y="216" font-size="9" fill="#9099a8">UP</text>
  <text x="634" y="230" font-size="9" fill="#9099a8">DOWN</text>
  <text x="634" y="244" font-size="9" fill="#9099a8">IDLE</text>
  <text x="634" y="266" font-size="9" fill="#6b7280">«enum»</text>
</svg>`,
        caption:
          "Two interfaces, and they do different jobs. `Request` splits the **data**; `SchedulingStrategy` splits the **decision**. Adding a third policy touches one new file and zero existing ones — that is [[open-closed]] with a number attached. Notation: [[class-diagrams]].",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 268" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram. A rider on floor seven presses up. ElevatorSystem receives request with a HallCall of floor seven going up and asks the SchedulingStrategy to pick a car. The strategy computes a cost of fourteen for car one which is moving down and away, and two for car two which is idle, and returns car two. ElevatorSystem then calls addRequest on car two, which inserts floor seven into its up request set under a lock.">
  <defs>
    <marker id="el-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="el-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="10" y="12" width="112" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="24" y="32" font-size="10.5" fill="#e8e4dc">Rider · floor 7</text>
  <rect x="176" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="190" y="32" font-size="10.5" fill="#fb863a">ElevatorSystem</text>
  <rect x="348" y="12" width="150" height="30" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="358" y="32" font-size="10.5" fill="#5e9ff6">SchedulingStrategy</text>
  <rect x="556" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="574" y="32" font-size="10.5" fill="#5cc66f">ElevatorCar #2</text>

  <line x1="66" y1="42" x2="66" y2="252" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="236" y1="42" x2="236" y2="252" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="423" y1="42" x2="423" y2="252" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="616" y1="42" x2="616" y2="252" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="74" y="68" font-size="10" fill="#e8e4dc">press ▲</text>
  <line x1="66" y1="76" x2="232" y2="76" stroke="#fb863a" stroke-width="1.3" marker-end="url(#el-call)"/>
  <text x="74" y="92" font-size="9" fill="#6b7280">system.request(new HallCall(7, UP))</text>

  <text x="248" y="120" font-size="10" fill="#e8e4dc">pick(cars, call)</text>
  <line x1="236" y1="128" x2="419" y2="128" stroke="#fb863a" stroke-width="1.3" marker-end="url(#el-call)"/>

  <rect x="414" y="136" width="230" height="52" rx="5" fill="rgba(94,159,246,0.12)" stroke="rgba(94,159,246,0.5)"/>
  <text x="424" y="154" font-size="9" fill="#f06868">car #1 · moving DOWN, away → 4 + 100</text>
  <text x="424" y="172" font-size="9" fill="#5cc66f">car #2 · IDLE, 2 floors away → 2</text>

  <line x1="423" y1="200" x2="240" y2="200" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#el-ret)"/>
  <text x="270" y="196" font-size="10" fill="#5cc66f">car #2</text>

  <text x="248" y="226" font-size="10" fill="#e8e4dc">addRequest(call)</text>
  <line x1="236" y1="234" x2="612" y2="234" stroke="#fb863a" stroke-width="1.3" marker-end="url(#el-call)"/>
  <text x="248" y="250" font-size="9" fill="#6b7280">🔒 upRequests.add(7) — the only shared state</text>
</svg>`,
        caption:
          "Trace the arrows: **the car is never asked to choose**. It is handed a request and gets on with LOOK. That split is [[single-responsibility]] doing real work — swap the middle box and nothing to its left or right changes. Notation: [[sequence-diagrams]].",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Say this when you extract the strategy",
        text: "*“`request()` will not change when the policy does.”* That sentence, plus a second implementation you can name — least-loaded, or zoned, or nearest-with-a-wait-time-cap — is worth more than a perfect cost function. It is the same seam [[parking-lot]] used for spot allocation, and the interviewer is checking whether you spot it twice. Background: [[strategy]].",
      },

      // ---------- tick model ----------
      { type: "h", text: "Step 5 · Time is an input, not something you sleep through" },
      {
        type: "p",
        text: "The single fastest way to make this program untestable is to write `Thread.sleep(1000)` inside the movement. Now a ten-floor trip takes ten real seconds, a test of the turnaround rule takes half a minute, and the interviewer cannot see anything happen before the round ends.",
      },
      {
        type: "p",
        text: "Instead expose `tick()`. One call advances every car by one floor. `main()` drives it in a loop, a test drives it three times and asserts a position, and a real building would drive it from a hardware timer. Same code, three clocks.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 264" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram of one tick. The caller, which may be a main loop, a test or a hardware timer, calls tick on the ElevatorSystem, which calls step on each ElevatorCar. Inside step the car moves one floor and increments the floors travelled counter, then checks whether the new floor is in the request set matching its direction. If it is, the request is removed and the state becomes DOORS_OPEN. The next tick closes the doors and the car resumes. A note says there is no sleep anywhere in this diagram.">
  <defs>
    <marker id="el-call2" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <rect x="10" y="12" width="164" height="30" rx="5" fill="#14161a" stroke="#3a414c"/><text x="22" y="32" font-size="10.5" fill="#e8e4dc">main() · test · timer</text>
  <rect x="252" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#fb863a"/><text x="266" y="32" font-size="10.5" fill="#fb863a">ElevatorSystem</text>
  <rect x="470" y="12" width="120" height="30" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="486" y="32" font-size="10.5" fill="#5cc66f">ElevatorCar</text>

  <line x1="92" y1="42" x2="92" y2="248" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="312" y1="42" x2="312" y2="248" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="530" y1="42" x2="530" y2="248" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="100" y="68" font-size="10" fill="#e8e4dc">tick()</text>
  <line x1="92" y1="76" x2="308" y2="76" stroke="#fb863a" stroke-width="1.3" marker-end="url(#el-call2)"/>
  <text x="324" y="102" font-size="10" fill="#e8e4dc">step()   — for every car</text>
  <line x1="312" y1="110" x2="526" y2="110" stroke="#fb863a" stroke-width="1.3" marker-end="url(#el-call2)"/>

  <rect x="524" y="118" width="188" height="92" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="534" y="136" font-size="9" fill="#5cc66f">1 · floor += ±1</text>
  <text x="534" y="152" font-size="9" fill="#5cc66f">2 · floorsTravelled++</text>
  <text x="534" y="168" font-size="9" fill="#5cc66f">3 · serveHere()?</text>
  <text x="534" y="184" font-size="9" fill="#5cc66f">   yes → remove + DOORS_OPEN</text>
  <text x="534" y="200" font-size="9" fill="#6b7280">next tick: doors close, resume</text>

  <text x="20" y="236" font-size="10" fill="#fb863a">there is no sleep anywhere in this diagram — that is the point</text>
  <text x="20" y="252" font-size="9.5" fill="#9099a8">the same rule as passing exitAt into a parking-lot bill: the caller owns time, so a test can own it too</text>
</svg>`,
        caption:
          "Compare the note at the bottom with how [[parking-lot]] handles billing. Same rule, different noun: **anything that reads the clock internally cannot be tested without waiting.**",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 300" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A state machine for one car with four states. IDLE moves to MOVING UP when a request is above and to MOVING DOWN when a request is below. Both moving states go to DOORS OPEN on arriving at a stop. DOORS OPEN returns to a moving state when work remains, or to IDLE when no requests are left. A highlighted arrow between MOVING UP and MOVING DOWN is labelled only when nothing is ahead, which is the rule that keeps the car from changing its mind mid-run.">
  <defs>
    <marker id="el-st" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#9099a8"/></marker>
    <marker id="el-st2" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <rect x="20" y="126" width="120" height="46" rx="10" fill="#14161a" stroke="#3a414c" stroke-width="1.3"/>
  <text x="52" y="154" font-size="11" fill="#e8e4dc">IDLE</text>

  <rect x="250" y="26" width="140" height="46" rx="10" fill="#14161a" stroke="#5cc66f" stroke-width="1.3"/>
  <text x="272" y="54" font-size="11" fill="#5cc66f">MOVING_UP</text>

  <rect x="250" y="226" width="140" height="46" rx="10" fill="#14161a" stroke="#5cc66f" stroke-width="1.3"/>
  <text x="266" y="254" font-size="11" fill="#5cc66f">MOVING_DOWN</text>

  <rect x="510" y="126" width="150" height="46" rx="10" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="530" y="154" font-size="11" fill="#fb863a">DOORS_OPEN</text>

  <line x1="140" y1="140" x2="246" y2="66" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-st)"/>
  <text x="146" y="98" font-size="9" fill="#9099a8">a request above</text>
  <line x1="140" y1="158" x2="246" y2="232" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-st)"/>
  <text x="146" y="212" font-size="9" fill="#9099a8">a request below</text>

  <line x1="394" y1="58" x2="512" y2="132" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-st)"/>
  <text x="404" y="92" font-size="9" fill="#9099a8">arrived at a stop</text>
  <line x1="394" y1="242" x2="512" y2="168" stroke="#9099a8" stroke-width="1.2" marker-end="url(#el-st)"/>
  <text x="404" y="222" font-size="9" fill="#9099a8">arrived at a stop</text>

  <path d="M556,126 C548,96 470,68 396,50" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#el-st)"/>
  <text x="440" y="30" font-size="9" fill="#9099a8">doors close · work still ahead</text>
  <path d="M556,172 C548,204 470,232 396,250" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#el-st)"/>
  <text x="440" y="288" font-size="9" fill="#9099a8">doors close · work still ahead</text>

  <path d="M510,150 C400,150 220,150 144,150" fill="none" stroke="#5e9ff6" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#el-st)"/>
  <text x="262" y="142" font-size="9" fill="#5e9ff6">no requests left</text>

  <line x1="320" y1="76" x2="320" y2="222" stroke="#fb863a" stroke-width="1.6" marker-end="url(#el-st2)"/>
  <line x1="336" y1="222" x2="336" y2="76" stroke="#fb863a" stroke-width="1.6" marker-end="url(#el-st2)"/>
  <text x="352" y="146" font-size="10" fill="#fb863a">ONLY when nothing</text>
  <text x="352" y="162" font-size="10" fill="#fb863a">is ahead</text>
</svg>`,
        caption:
          "The orange arrow in the middle is the only one with a guard on it. **A car does not change direction while it still has requests ahead** — remove that guard and LOOK collapses back into something worse than FIFO. Notation and vocabulary: [[state]].",
      },

      // ---------- concurrency ----------
      { type: "h", text: "Step 6 · Concurrency — one lock, in one place" },
      {
        type: "p",
        text: "Hall calls arrive from ten floors at once, and a rider inside is pressing buttons at the same time. The **request sets are shared state**; two threads adding to a `TreeSet` at the same moment can corrupt it or lose an entry.",
      },
      {
        type: "ul",
        items: [
          "**Lock the queues, not the movement.** `addRequest()` and the removal inside `serveHere()` take the car's lock. Moving a floor and updating the counter do not need it.",
          "**One lock per car, not one global lock.** Cars share nothing with each other, so a global lock would serialise a building for no reason.",
          "**Dispatch reads car state without a lock**, and that is fine — the strategy is picking a *good* car, not a provably optimal one. Say this: a slightly stale floor number costs you one floor of travel, not correctness.",
          "**Never hold a lock across `step()`.** It is the same rule as brewing outside the lock in [[coffee-machine]]: guard the arithmetic, not the work.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "What the interviewer is checking",
        text: "Not that you wrote a lock-free scheduler. Just that you can point at **which field is shared and by whom**, and that your answer is proportionate. *“One lock per car around the two request sets”* is the whole answer, and it takes ten seconds. More on the primitives in [[locks-mutex-semaphore]].",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“Make one car an express that only stops at 1 and 6 to 10.”** → give the car a `servesFloor(int)` predicate and have the strategy return infinite cost for a call it cannot serve. No new class in the car, one guard in the cost function.",
          "**“Add a firefighter / service mode.”** → a mode flag on the car that clears both request sets, refuses new ones, and takes a single destination. Cancelling *every* pending request is the part people forget — the riders waiting on floor 7 must be told, so the system re-dispatches their hall calls to another car.",
          "**“Capacity and weight limits.”** → a `riderCount` on the car and a limit. Crucially it refuses **riders**, not requests: a full car still stops where it was going, it just does not let anyone in, and the hall call stays outstanding for the next car.",
          "**“Twenty cars in one bank.”** → the strategy loop is already O(cars); nothing structural changes. What does change is that a purely nearest-car policy starts bunching cars together, so you add a zoning or least-load term. Both are new strategy classes.",
          "**“Sixty floors, eight cars — what actually changes?”** → **destination dispatch**. Riders type their destination on a lobby panel instead of pressing a direction, the system groups people going to similar floors into the same car, and hall calls disappear entirely. `HallCall(floor, direction)` becomes `TripRequest(from, to)`, and the strategy suddenly has enough information to be genuinely optimal.",
          "**“How would you test the scheduler?”** → because time is a parameter, a test is: build a car, add three requests, call `step()` five times, assert the floor and the remaining sets. No threads, no waiting. Say this unprompted.",
        ],
      },

      // ---------- budget ----------
      { type: "h", text: "Spending the 60 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 168" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sixty-minute timeline split into five segments: clarify five minutes, entities and the two request types eight minutes, API and class diagram nine minutes, the LOOK step method eighteen minutes, and dispatch strategy plus a main demo twenty minutes. A marker at minute forty-two is labelled LOOK works, stop adding and print a trace.">
  <text x="20" y="26" font-size="10" fill="#9099a8">60 MINUTES</text>

  <rect x="20" y="40" width="55" height="44" rx="5" fill="rgba(94,159,246,0.12)" stroke="#5e9ff6"/>
  <rect x="79" y="40" width="88" height="44" rx="5" fill="rgba(94,159,246,0.12)" stroke="#5e9ff6"/>
  <rect x="171" y="40" width="99" height="44" rx="5" fill="rgba(94,159,246,0.12)" stroke="#5e9ff6"/>
  <rect x="274" y="40" width="198" height="44" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="476" y="40" width="204" height="44" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>

  <text x="26" y="66" font-size="9.5" fill="#5e9ff6">5m</text>
  <text x="85" y="66" font-size="9.5" fill="#5e9ff6">8m</text>
  <text x="177" y="66" font-size="9.5" fill="#5e9ff6">9m</text>
  <text x="280" y="66" font-size="9.5" fill="#fb863a">18m</text>
  <text x="482" y="66" font-size="9.5" fill="#fb863a">20m</text>

  <text x="20" y="104" font-size="9.5" fill="#9099a8">clarify</text>
  <text x="79" y="104" font-size="9.5" fill="#9099a8">2 request types</text>
  <text x="171" y="104" font-size="9.5" fill="#9099a8">API + diagram</text>
  <text x="274" y="104" font-size="9.5" fill="#9099a8">the LOOK step()</text>
  <text x="476" y="104" font-size="9.5" fill="#9099a8">strategy + main() demo</text>

  <line x1="512" y1="34" x2="512" y2="118" stroke="#f06868" stroke-width="1.3" stroke-dasharray="4 3"/>
  <text x="392" y="140" font-size="10" fill="#f06868">minute 42 — LOOK works: stop adding, print a trace</text>
  <text x="20" y="158" font-size="9.5" fill="#6b7280">one car serving correctly beats two cars that never move</text>
</svg>`,
        caption:
          "Note where the 18-minute block sits. **Get one car doing LOOK correctly before you add a second car at all** — a bank of cars that each schedule badly is not a partial answer, it is two bugs.",
      },
      {
        type: "ol",
        items: [
          "**`Direction`, `CarState`, `HallCall`, `CarCall`** (6 min) — the enums and the two request records. Tiny, and everything else leans on them.",
          "**`ElevatorCar` with the two sorted sets and `addRequest`** (6 min) — no movement yet.",
          "**`step()`** (18 min) — this is the round. Move one floor, `serveHere()`, flip when nothing is ahead. Print the floor every tick while you write it.",
          "**`ElevatorSystem` with one hardcoded “nearest car” rule** (8 min) — get two cars moving from one request stream.",
          "**Extract `SchedulingStrategy` and add a second implementation** (8 min) — a five-minute refactor once it works, a rabbit hole if you start here.",
          "**`main()` that prints a tick-by-tick trace and the total floors travelled** (8 min) — the number at the bottom is what makes your design visible.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**One `List<Integer> requests`.** Direction is gone, the *“do you stop for the down button?”* question cannot be answered, and no amount of clever scheduling on top recovers it.",
          "**`Thread.sleep` inside the movement.** A ten-floor trip now takes ten seconds, nothing can be tested, and the demo runs out of clock before it finishes.",
          "**Scheduling logic buried inside `ElevatorCar`.** The moment the interviewer says *“now pick the least busy car instead”*, you are editing the car class — and a second policy cannot exist alongside the first.",
          "**Forgetting the requests you pass.** A car heading to floor 8 that sails past a waiting request at floor 5 has quietly reimplemented FIFO.",
          "**Never reversing correctly.** No turnaround rule means a request at the top of the run gets skipped, the car flips, and the person waits forever. That is starvation, and it is easy for an interviewer to construct.",
          "**Designing a perfect cost function and never writing `step()`.** The cost function is worth one sentence; LOOK is worth the round.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Make one hall call and read the reason",
        body:
          "Press **▲ next to floor 7**. The call line shows `system.request(new HallCall(7, UP))` and one car flashes. The explain line does not just name the winner — it gives the cost for **both** cars. Note that the car chosen is the *idle* one, not necessarily the closest one in raw floors.",
      },
      {
        title: "Press a button from inside a car",
        body:
          "In the right-hand panel, click a floor number under **car #1**. The call line becomes `car1.addRequest(new CarCall(3))` — a different object, going to a different place, and no strategy is consulted at all. Watch which set it lands in: a car call above the car goes into `upRequests`, below it into `downRequests`.",
      },
      {
        title: "Run it and watch the sets drain",
        body:
          "Press **▶ Run**. Each tick moves every car one floor. Watch the chips: the car drains the set matching its **direction** in sort order, doors flash open on each stop, and the chip disappears. When nothing is left ahead, the direction flips and the other set becomes the live one.",
      },
      {
        title: "The comparison — this is the whole lesson",
        body:
          "Press **⚡ Rush hour** (seven hall calls, always the same ones), make sure **🧭 LOOK** is on, and press **▶ Run**. Read `floors travelled`: **11**. Now press **🔀 FIFO** — the identical requests are replayed from the start — and run again: **21**. Same building, same people, same cars. Nearly double the travel, from one line of ordering logic.",
      },
      {
        title: "Swap the dispatcher without changing the caller",
        body:
          "Press **⚖️ Least load**, then make a few hall calls near one car. Under **🎯 Nearest car** they all pile onto the closest car; under least-load they spread out. The call line is `system.request(...)` in both cases — **it never changed**. That is the strategy seam paying for itself.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `Direction` and `CarState` enums → `HallCall(floor, direction)` and `CarCall(floor)` → `ElevatorCar` with `upRequests` ascending and `downRequests` descending → `step()` with the flip-when-nothing-ahead rule → `SchedulingStrategy` with a nearest-car implementation → a `main()` that ticks in a loop and prints the total floors travelled. If your total for the stream *5, 2, 8, 3* from floor 1 is not **7**, your `serveHere()` is not stopping for requests on the way.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "ElevatorSystem.java",
        code: `import java.util.*;

enum Direction { UP, DOWN, IDLE }
enum CarState { IDLE, MOVING_UP, MOVING_DOWN, DOORS_OPEN }

/**
 * TWO kinds of request, and they are NOT the same thing.
 *   HallCall : pressed outside. Knows a floor AND a direction, but no destination.
 *   CarCall  : pressed inside.  Knows a destination, but carries no direction.
 * Collapsing both into "a floor number" is what makes correct scheduling impossible.
 */
sealed interface Request permits HallCall, CarCall { int floor(); }
record HallCall(int floor, Direction direction) implements Request {}
record CarCall(int floor) implements Request {}

class ElevatorCar {
    private final int id;
    private int floor;
    private Direction direction = Direction.IDLE;
    private CarState state = CarState.IDLE;
    private int floorsTravelled = 0;

    // Two sorted sets. The whole algorithm is "drain the one matching my direction, then flip".
    private final NavigableSet<Integer> upRequests   = new TreeSet<>();
    private final NavigableSet<Integer> downRequests = new TreeSet<>(Comparator.reverseOrder());
    private final Object queueLock = new Object();          // guards the two sets, nothing else

    ElevatorCar(int id, int startFloor) { this.id = id; this.floor = startFloor; }

    int id()              { return id; }
    int floor()           { return floor; }
    Direction direction() { return direction; }
    CarState state()      { return state; }
    int floorsTravelled() { return floorsTravelled; }

    int pending()  { synchronized (queueLock) { return upRequests.size() + downRequests.size(); } }
    boolean busy() { return pending() > 0 || state == CarState.DOORS_OPEN; }

    /** Hall calls arrive from many floors at once — this is the only shared state. */
    void addRequest(Request r) {
        synchronized (queueLock) {
            if (r instanceof HallCall h) {
                if (h.direction() == Direction.UP) upRequests.add(h.floor());
                else                               downRequests.add(h.floor());
            } else {                                        // a CarCall: direction comes from where we are
                if (r.floor() > floor)      upRequests.add(r.floor());
                else if (r.floor() < floor) downRequests.add(r.floor());
                else                        state = CarState.DOORS_OPEN;    // already standing here
            }
        }
    }

    /** ONE floor of movement. Time is driven from outside — never sleep in here. */
    void step() {
        if (state == CarState.DOORS_OPEN) { state = resume(); return; }     // doors take one tick
        if (!busy()) { direction = Direction.IDLE; state = CarState.IDLE; return; }

        if (direction == Direction.IDLE) direction = towardsNearest();
        if (serveHere()) { state = CarState.DOORS_OPEN; return; }

        if (!workAhead(direction)) direction = opposite(direction);         // nothing left this way
        if (serveHere()) { state = CarState.DOORS_OPEN; return; }

        floor += (direction == Direction.UP) ? 1 : -1;
        floorsTravelled++;
        state = (direction == Direction.UP) ? CarState.MOVING_UP : CarState.MOVING_DOWN;
        if (serveHere()) state = CarState.DOORS_OPEN;                       // stop for it on the way
    }

    /** Remove a request at this floor IF it matches where we are going. */
    private boolean serveHere() {
        synchronized (queueLock) {
            if (direction == Direction.UP) {
                if (upRequests.remove(floor)) return true;
                if (!anyAbove() && downRequests.remove(floor)) return true;   // turnaround point
            } else {
                if (downRequests.remove(floor)) return true;
                if (!anyBelow() && upRequests.remove(floor)) return true;
            }
            return false;
        }
    }

    private CarState resume() {
        if (pending() == 0) { direction = Direction.IDLE; return CarState.IDLE; }
        return direction == Direction.UP ? CarState.MOVING_UP : CarState.MOVING_DOWN;
    }

    private Direction towardsNearest() {
        int best = Integer.MAX_VALUE, target = floor;
        for (int f : allRequests())
            if (Math.abs(f - floor) < best) { best = Math.abs(f - floor); target = f; }
        return target >= floor ? Direction.UP : Direction.DOWN;
    }

    private boolean workAhead(Direction d) { return d == Direction.UP ? anyAbove() : anyBelow(); }
    private boolean anyAbove() { for (int f : allRequests()) if (f > floor) return true; return false; }
    private boolean anyBelow() { for (int f : allRequests()) if (f < floor) return true; return false; }

    private List<Integer> allRequests() {
        synchronized (queueLock) {
            List<Integer> out = new ArrayList<>(upRequests);
            out.addAll(downRequests);
            return out;
        }
    }

    private static Direction opposite(Direction d) { return d == Direction.UP ? Direction.DOWN : Direction.UP; }

    String describe() {
        synchronized (queueLock) {
            return "car#" + id + " floor " + floor + "  " + pad(state.name()) + " up" + upRequests + "  down" + downRequests;
        }
    }
    private static String pad(String s) { return (s + "           ").substring(0, 11); }
}

/** WHICH car takes a hall call. The one decision the interviewer will ask you to change. */
interface SchedulingStrategy {
    ElevatorCar pick(List<ElevatorCar> cars, HallCall call);
}

class NearestCarStrategy implements SchedulingStrategy {
    private static final int DETOUR = 100;      // big enough that a wrong-way car only wins if nothing else is close

    public ElevatorCar pick(List<ElevatorCar> cars, HallCall call) {
        ElevatorCar best = null;
        int bestCost = Integer.MAX_VALUE;
        for (ElevatorCar c : cars) {
            int cost = cost(c, call);
            if (cost < bestCost) { bestCost = cost; best = c; }
        }
        return best;
    }

    static int cost(ElevatorCar c, HallCall call) {
        int distance = Math.abs(c.floor() - call.floor());
        if (c.direction() == Direction.IDLE) return distance;               // idle: just the walk
        boolean towards = (c.direction() == Direction.UP   && call.floor() >= c.floor())
                       || (c.direction() == Direction.DOWN && call.floor() <= c.floor());
        if (towards && c.direction() == call.direction()) return distance;  // it passes you anyway
        return distance + DETOUR;                                          // it must finish its run first
    }
}

class LeastLoadStrategy implements SchedulingStrategy {
    public ElevatorCar pick(List<ElevatorCar> cars, HallCall call) {
        ElevatorCar best = null;
        int bestCost = Integer.MAX_VALUE;
        for (ElevatorCar c : cars) {
            int cost = c.pending() * 100 + Math.abs(c.floor() - call.floor());
            if (cost < bestCost) { bestCost = cost; best = c; }
        }
        return best;
    }
}

class ElevatorSystem {
    private final List<ElevatorCar> cars;
    private SchedulingStrategy strategy;

    ElevatorSystem(List<ElevatorCar> cars, SchedulingStrategy strategy) {
        this.cars = List.copyOf(cars);
        this.strategy = strategy;
    }

    /** Open for a new policy, closed for modification — request() below never changes. */
    void setStrategy(SchedulingStrategy s) { this.strategy = s; }

    ElevatorCar request(HallCall call) {
        ElevatorCar car = strategy.pick(cars, call);    // WHICH car — pluggable
        car.addRequest(call);                           // WHEN to serve it — the car's own LOOK
        return car;
    }

    ElevatorCar car(int id) {
        for (ElevatorCar c : cars) if (c.id() == id) return c;
        throw new NoSuchElementException("no car " + id);
    }

    /** Time comes from OUTSIDE: a main loop, a test, or a hardware timer. */
    void tick() { for (ElevatorCar c : cars) c.step(); }

    boolean busy() { for (ElevatorCar c : cars) if (c.busy()) return true; return false; }
    int floorsTravelled() { int t = 0; for (ElevatorCar c : cars) t += c.floorsTravelled(); return t; }
    List<ElevatorCar> cars() { return cars; }
}

public class Main {
    /** What FIFO would have cost: walk to each request in arrival order. */
    static int fifoFloors(int start, List<Integer> arrivalOrder) {
        int total = 0, at = start;
        for (int f : arrivalOrder) { total += Math.abs(f - at); at = f; }
        return total;
    }

    public static void main(String[] args) {
        System.out.println("=== one car, four hall calls: 5 up, 2 up, 8 up, 3 up ===");
        ElevatorSystem one = new ElevatorSystem(List.of(new ElevatorCar(1, 1)), new NearestCarStrategy());
        for (int f : new int[] { 5, 2, 8, 3 }) one.request(new HallCall(f, Direction.UP));

        int t = 0;
        while (one.busy() && t < 200) {                 // the caller owns time
            one.tick();
            t++;
            System.out.println("t=" + (t < 10 ? "0" : "") + t + "  " + one.car(1).describe());
        }
        System.out.println("LOOK floors travelled: " + one.floorsTravelled());
        System.out.println("FIFO floors travelled: " + fifoFloors(1, List.of(5, 2, 8, 3)) + "   (1 -> 5 -> 2 -> 8 -> 3)");

        System.out.println();
        System.out.println("=== two cars, dispatch is a separate decision ===");
        ElevatorSystem bank = new ElevatorSystem(
                List.of(new ElevatorCar(1, 1), new ElevatorCar(2, 9)), new NearestCarStrategy());

        for (int f : new int[] { 8, 7, 6 })
            System.out.println("hall call " + f + " DOWN -> car #" + bank.request(new HallCall(f, Direction.DOWN)).id());

        bank.setStrategy(new LeastLoadStrategy());      // the ONLY line that changes
        System.out.println("swapped strategy to LeastLoad — request() did not change");
        System.out.println("hall call 5 DOWN -> car #" + bank.request(new HallCall(5, Direction.DOWN)).id());
    }
}

/* expected output
=== one car, four hall calls: 5 up, 2 up, 8 up, 3 up ===
t=01  car#1 floor 2  DOORS_OPEN  up[3, 5, 8]  down[]
t=02  car#1 floor 2  MOVING_UP   up[3, 5, 8]  down[]
t=03  car#1 floor 3  DOORS_OPEN  up[5, 8]  down[]
t=04  car#1 floor 3  MOVING_UP   up[5, 8]  down[]
t=05  car#1 floor 4  MOVING_UP   up[5, 8]  down[]
t=06  car#1 floor 5  DOORS_OPEN  up[8]  down[]
t=07  car#1 floor 5  MOVING_UP   up[8]  down[]
t=08  car#1 floor 6  MOVING_UP   up[8]  down[]
t=09  car#1 floor 7  MOVING_UP   up[8]  down[]
t=10  car#1 floor 8  DOORS_OPEN  up[]  down[]
t=11  car#1 floor 8  IDLE        up[]  down[]
LOOK floors travelled: 7
FIFO floors travelled: 18   (1 -> 5 -> 2 -> 8 -> 3)

=== two cars, dispatch is a separate decision ===
hall call 8 DOWN -> car #2
hall call 7 DOWN -> car #2
hall call 6 DOWN -> car #2
swapped strategy to LeastLoad — request() did not change
hall call 5 DOWN -> car #1
*/`,
      },
      {
        label: "Python",
        language: "python",
        filename: "elevator_system.py",
        code: `from __future__ import annotations

from bisect import insort
from dataclasses import dataclass
from enum import Enum
from threading import RLock


class Direction(Enum):
    UP = "UP"
    DOWN = "DOWN"
    IDLE = "IDLE"


class CarState(Enum):
    IDLE = "IDLE"
    MOVING_UP = "MOVING_UP"
    MOVING_DOWN = "MOVING_DOWN"
    DOORS_OPEN = "DOORS_OPEN"


# TWO kinds of request, and they are NOT the same thing.
#   HallCall : pressed outside. Knows a floor AND a direction, but no destination.
#   CarCall  : pressed inside.  Knows a destination, but carries no direction.
@dataclass(frozen=True)
class HallCall:
    floor: int
    direction: Direction


@dataclass(frozen=True)
class CarCall:
    floor: int


class ElevatorCar:
    def __init__(self, car_id: int, start_floor: int):
        self.id = car_id
        self.floor = start_floor
        self.direction = Direction.IDLE
        self.state = CarState.IDLE
        self.floors_travelled = 0
        # Two sorted lists: up ascending, down descending.
        self.up_requests: list[int] = []
        self.down_requests: list[int] = []
        self._lock = RLock()                       # guards the two lists, nothing else

    # ---- queue ----
    def pending(self) -> int:
        with self._lock:
            return len(self.up_requests) + len(self.down_requests)

    def busy(self) -> bool:
        return self.pending() > 0 or self.state is CarState.DOORS_OPEN

    def add_request(self, request: HallCall | CarCall) -> None:
        """Hall calls arrive from many floors at once — this is the only shared state."""
        with self._lock:
            if isinstance(request, HallCall):
                if request.direction is Direction.UP:
                    self._add_up(request.floor)
                else:
                    self._add_down(request.floor)
            else:                                   # a CarCall: direction comes from where we are
                if request.floor > self.floor:
                    self._add_up(request.floor)
                elif request.floor < self.floor:
                    self._add_down(request.floor)
                else:
                    self.state = CarState.DOORS_OPEN

    def _add_up(self, floor: int) -> None:
        if floor not in self.up_requests:
            insort(self.up_requests, floor)                        # ascending

    def _add_down(self, floor: int) -> None:
        if floor not in self.down_requests:
            self.down_requests.append(floor)
            self.down_requests.sort(reverse=True)                  # descending

    # ---- movement ----
    def step(self) -> None:
        """ONE floor of movement. Time is driven from outside — never sleep in here."""
        if self.state is CarState.DOORS_OPEN:
            self.state = self._resume()
            return
        if not self.busy():
            self.direction, self.state = Direction.IDLE, CarState.IDLE
            return

        if self.direction is Direction.IDLE:
            self.direction = self._towards_nearest()
        if self._serve_here():
            self.state = CarState.DOORS_OPEN
            return

        if not self._work_ahead(self.direction):                   # nothing left this way
            self.direction = self._opposite(self.direction)
        if self._serve_here():
            self.state = CarState.DOORS_OPEN
            return

        self.floor += 1 if self.direction is Direction.UP else -1
        self.floors_travelled += 1
        self.state = CarState.MOVING_UP if self.direction is Direction.UP else CarState.MOVING_DOWN
        if self._serve_here():                                     # stop for it on the way
            self.state = CarState.DOORS_OPEN

    def _serve_here(self) -> bool:
        """Remove a request at this floor IF it matches where we are going."""
        with self._lock:
            if self.direction is Direction.UP:
                if self.floor in self.up_requests:
                    self.up_requests.remove(self.floor)
                    return True
                if not self._any_above() and self.floor in self.down_requests:
                    self.down_requests.remove(self.floor)          # turnaround point
                    return True
            else:
                if self.floor in self.down_requests:
                    self.down_requests.remove(self.floor)
                    return True
                if not self._any_below() and self.floor in self.up_requests:
                    self.up_requests.remove(self.floor)
                    return True
            return False

    def _resume(self) -> CarState:
        if self.pending() == 0:
            self.direction = Direction.IDLE
            return CarState.IDLE
        return CarState.MOVING_UP if self.direction is Direction.UP else CarState.MOVING_DOWN

    def _all(self) -> list[int]:
        with self._lock:
            return self.up_requests + self.down_requests

    def _towards_nearest(self) -> Direction:
        target = min(self._all(), key=lambda f: abs(f - self.floor))
        return Direction.UP if target >= self.floor else Direction.DOWN

    def _work_ahead(self, d: Direction) -> bool:
        return self._any_above() if d is Direction.UP else self._any_below()

    def _any_above(self) -> bool:
        return any(f > self.floor for f in self._all())

    def _any_below(self) -> bool:
        return any(f < self.floor for f in self._all())

    @staticmethod
    def _opposite(d: Direction) -> Direction:
        return Direction.DOWN if d is Direction.UP else Direction.UP

    def describe(self) -> str:
        return (f"car#{self.id} floor {self.floor}  {self.state.value:<11} "
                f"up{self.up_requests}  down{self.down_requests}")


# WHICH car takes a hall call. The one decision the interviewer will ask you to change.
class SchedulingStrategy:
    def pick(self, cars: list[ElevatorCar], call: HallCall) -> ElevatorCar:
        raise NotImplementedError


DETOUR = 100        # big enough that a wrong-way car only wins if nothing else is close


class NearestCarStrategy(SchedulingStrategy):
    def pick(self, cars: list[ElevatorCar], call: HallCall) -> ElevatorCar:
        return min(cars, key=lambda c: self.cost(c, call))

    @staticmethod
    def cost(car: ElevatorCar, call: HallCall) -> int:
        distance = abs(car.floor - call.floor)
        if car.direction is Direction.IDLE:
            return distance                                   # idle: just the walk
        towards = ((car.direction is Direction.UP and call.floor >= car.floor)
                   or (car.direction is Direction.DOWN and call.floor <= car.floor))
        if towards and car.direction is call.direction:
            return distance                                   # it passes you anyway
        return distance + DETOUR                              # it must finish its run first


class LeastLoadStrategy(SchedulingStrategy):
    def pick(self, cars: list[ElevatorCar], call: HallCall) -> ElevatorCar:
        return min(cars, key=lambda c: c.pending() * DETOUR + abs(c.floor - call.floor))


class ElevatorSystem:
    def __init__(self, cars: list[ElevatorCar], strategy: SchedulingStrategy):
        self.cars = cars
        self.strategy = strategy

    def set_strategy(self, strategy: SchedulingStrategy) -> None:
        """Open for a new policy, closed for modification — request() never changes."""
        self.strategy = strategy

    def request(self, call: HallCall) -> ElevatorCar:
        car = self.strategy.pick(self.cars, call)     # WHICH car — pluggable
        car.add_request(call)                         # WHEN to serve it — the car's own LOOK
        return car

    def car(self, car_id: int) -> ElevatorCar:
        return next(c for c in self.cars if c.id == car_id)

    def tick(self) -> None:
        """Time comes from OUTSIDE: a main loop, a test, or a hardware timer."""
        for c in self.cars:
            c.step()

    def busy(self) -> bool:
        return any(c.busy() for c in self.cars)

    def floors_travelled(self) -> int:
        return sum(c.floors_travelled for c in self.cars)


def fifo_floors(start: int, arrival_order: list[int]) -> int:
    """What FIFO would have cost: walk to each request in arrival order."""
    total, at = 0, start
    for f in arrival_order:
        total += abs(f - at)
        at = f
    return total


if __name__ == "__main__":
    print("=== one car, four hall calls: 5 up, 2 up, 8 up, 3 up ===")
    one = ElevatorSystem([ElevatorCar(1, 1)], NearestCarStrategy())
    for floor in (5, 2, 8, 3):
        one.request(HallCall(floor, Direction.UP))

    t = 0
    while one.busy() and t < 200:                     # the caller owns time
        one.tick()
        t += 1
        print(f"t={t:02d}  {one.car(1).describe()}")

    print("LOOK floors travelled:", one.floors_travelled())
    print("FIFO floors travelled:", fifo_floors(1, [5, 2, 8, 3]), "  (1 -> 5 -> 2 -> 8 -> 3)")

    print()
    print("=== two cars, dispatch is a separate decision ===")
    bank = ElevatorSystem([ElevatorCar(1, 1), ElevatorCar(2, 9)], NearestCarStrategy())
    for floor in (8, 7, 6):
        print(f"hall call {floor} DOWN -> car #{bank.request(HallCall(floor, Direction.DOWN)).id}")

    bank.set_strategy(LeastLoadStrategy())            # the ONLY line that changes
    print("swapped strategy to LeastLoad — request() did not change")
    print(f"hall call 5 DOWN -> car #{bank.request(HallCall(5, Direction.DOWN)).id}")

# expected output
# === one car, four hall calls: 5 up, 2 up, 8 up, 3 up ===
# t=01  car#1 floor 2  DOORS_OPEN  up[3, 5, 8]  down[]
# t=02  car#1 floor 2  MOVING_UP   up[3, 5, 8]  down[]
# t=03  car#1 floor 3  DOORS_OPEN  up[5, 8]  down[]
# t=04  car#1 floor 3  MOVING_UP   up[5, 8]  down[]
# t=05  car#1 floor 4  MOVING_UP   up[5, 8]  down[]
# t=06  car#1 floor 5  DOORS_OPEN  up[8]  down[]
# t=07  car#1 floor 5  MOVING_UP   up[8]  down[]
# t=08  car#1 floor 6  MOVING_UP   up[8]  down[]
# t=09  car#1 floor 7  MOVING_UP   up[8]  down[]
# t=10  car#1 floor 8  DOORS_OPEN  up[]  down[]
# t=11  car#1 floor 8  IDLE        up[]  down[]
# LOOK floors travelled: 7
# FIFO floors travelled: 18   (1 -> 5 -> 2 -> 8 -> 3)
#
# === two cars, dispatch is a separate decision ===
# hall call 8 DOWN -> car #2
# hall call 7 DOWN -> car #2
# hall call 6 DOWN -> car #2
# swapped strategy to LeastLoad — request() did not change
# hall call 5 DOWN -> car #1`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "elevator_system.cpp",
        code: `#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <memory>
#include <mutex>
#include <set>
#include <stdexcept>
#include <string>
#include <vector>

enum class Direction { Up, Down, Idle };
enum class CarState { Idle, MovingUp, MovingDown, DoorsOpen };

static const char* stateName(CarState s) {
    switch (s) {
        case CarState::Idle:       return "IDLE";
        case CarState::MovingUp:   return "MOVING_UP";
        case CarState::MovingDown: return "MOVING_DOWN";
        default:                   return "DOORS_OPEN";
    }
}

// TWO kinds of request, and they are NOT the same thing.
//   HallCall : pressed outside. Knows a floor AND a direction, but no destination.
//   CarCall  : pressed inside.  Knows a destination, but carries no direction.
struct HallCall { int floor; Direction direction; };
struct CarCall  { int floor; };

class ElevatorCar {
public:
    ElevatorCar(int id, int startFloor) : id_(id), floor_(startFloor) {}

    int id() const              { return id_; }
    int floor() const           { return floor_; }
    Direction direction() const { return direction_; }
    CarState state() const      { return state_; }
    int floorsTravelled() const { return floorsTravelled_; }

    int pending() const {
        std::lock_guard<std::mutex> g(m_);
        return static_cast<int>(up_.size() + down_.size());
    }
    bool busy() const { return pending() > 0 || state_ == CarState::DoorsOpen; }

    // Hall calls arrive from many floors at once — this is the only shared state.
    void addRequest(const HallCall& h) {
        std::lock_guard<std::mutex> g(m_);
        if (h.direction == Direction::Up) up_.insert(h.floor);
        else                              down_.insert(h.floor);
    }

    void addRequest(const CarCall& c) {         // direction comes from where we are
        std::lock_guard<std::mutex> g(m_);
        if (c.floor > floor_)      up_.insert(c.floor);
        else if (c.floor < floor_) down_.insert(c.floor);
        else                       state_ = CarState::DoorsOpen;
    }

    // ONE floor of movement. Time is driven from outside — never sleep in here.
    void step() {
        if (state_ == CarState::DoorsOpen) { state_ = resume(); return; }
        if (!busy()) { direction_ = Direction::Idle; state_ = CarState::Idle; return; }

        if (direction_ == Direction::Idle) direction_ = towardsNearest();
        if (serveHere()) { state_ = CarState::DoorsOpen; return; }

        if (!workAhead(direction_)) direction_ = opposite(direction_);   // nothing left this way
        if (serveHere()) { state_ = CarState::DoorsOpen; return; }

        floor_ += (direction_ == Direction::Up) ? 1 : -1;
        ++floorsTravelled_;
        state_ = (direction_ == Direction::Up) ? CarState::MovingUp : CarState::MovingDown;
        if (serveHere()) state_ = CarState::DoorsOpen;                   // stop for it on the way
    }

    std::string describe() const {
        std::lock_guard<std::mutex> g(m_);
        std::string s = "car#" + std::to_string(id_) + " floor " + std::to_string(floor_) + "  ";
        std::string st = stateName(state_);
        st.resize(11, ' ');
        s += st + " up[" + join(up_) + "]  down[" + join(down_, true) + "]";
        return s;
    }

private:
    // Remove a request at this floor IF it matches where we are going.
    bool serveHere() {
        std::lock_guard<std::mutex> g(m_);
        if (direction_ == Direction::Up) {
            if (up_.erase(floor_)) return true;
            if (!anyAbove() && down_.erase(floor_)) return true;         // turnaround point
        } else {
            if (down_.erase(floor_)) return true;
            if (!anyBelow() && up_.erase(floor_)) return true;
        }
        return false;
    }

    CarState resume() {
        if (pending() == 0) { direction_ = Direction::Idle; return CarState::Idle; }
        return direction_ == Direction::Up ? CarState::MovingUp : CarState::MovingDown;
    }

    Direction towardsNearest() const {
        std::lock_guard<std::mutex> g(m_);
        int target = floor_, best = 1 << 30;
        for (int f : all()) if (std::abs(f - floor_) < best) { best = std::abs(f - floor_); target = f; }
        return target >= floor_ ? Direction::Up : Direction::Down;
    }

    bool workAhead(Direction d) const {
        std::lock_guard<std::mutex> g(m_);
        return d == Direction::Up ? anyAbove() : anyBelow();
    }

    // callers already hold the lock
    std::vector<int> all() const { std::vector<int> v(up_.begin(), up_.end()); v.insert(v.end(), down_.begin(), down_.end()); return v; }
    bool anyAbove() const { for (int f : all()) if (f > floor_) return true; return false; }
    bool anyBelow() const { for (int f : all()) if (f < floor_) return true; return false; }
    static Direction opposite(Direction d) { return d == Direction::Up ? Direction::Down : Direction::Up; }

    static std::string join(const std::set<int>& s, bool reverse = false) {
        std::vector<int> v(s.begin(), s.end());
        if (reverse) std::reverse(v.begin(), v.end());
        std::string out;
        for (size_t i = 0; i < v.size(); ++i) { if (i) out += ", "; out += std::to_string(v[i]); }
        return out;
    }

    int id_;
    int floor_;
    Direction direction_ = Direction::Idle;
    CarState state_ = CarState::Idle;
    int floorsTravelled_ = 0;
    std::set<int> up_, down_;                  // ascending; down_ is printed reversed
    mutable std::mutex m_;                     // guards the two sets, nothing else
};

// WHICH car takes a hall call. The one decision the interviewer will ask you to change.
struct SchedulingStrategy {
    virtual ~SchedulingStrategy() = default;
    virtual ElevatorCar* pick(const std::vector<std::unique_ptr<ElevatorCar>>& cars, const HallCall& call) = 0;
};

static const int DETOUR = 100;   // big enough that a wrong-way car only wins if nothing else is close

struct NearestCarStrategy : SchedulingStrategy {
    static int cost(const ElevatorCar& c, const HallCall& call) {
        int distance = std::abs(c.floor() - call.floor);
        if (c.direction() == Direction::Idle) return distance;              // idle: just the walk
        bool towards = (c.direction() == Direction::Up   && call.floor >= c.floor())
                    || (c.direction() == Direction::Down && call.floor <= c.floor());
        if (towards && c.direction() == call.direction) return distance;    // it passes you anyway
        return distance + DETOUR;                                           // it must finish its run first
    }
    ElevatorCar* pick(const std::vector<std::unique_ptr<ElevatorCar>>& cars, const HallCall& call) override {
        ElevatorCar* best = nullptr; int bestCost = 1 << 30;
        for (auto& c : cars) { int k = cost(*c, call); if (k < bestCost) { bestCost = k; best = c.get(); } }
        return best;
    }
};

struct LeastLoadStrategy : SchedulingStrategy {
    ElevatorCar* pick(const std::vector<std::unique_ptr<ElevatorCar>>& cars, const HallCall& call) override {
        ElevatorCar* best = nullptr; int bestCost = 1 << 30;
        for (auto& c : cars) {
            int k = c->pending() * DETOUR + std::abs(c->floor() - call.floor);
            if (k < bestCost) { bestCost = k; best = c.get(); }
        }
        return best;
    }
};

class ElevatorSystem {
public:
    ElevatorSystem(std::vector<std::unique_ptr<ElevatorCar>> cars, std::unique_ptr<SchedulingStrategy> s)
        : cars_(std::move(cars)), strategy_(std::move(s)) {}

    // Open for a new policy, closed for modification — request() below never changes.
    void setStrategy(std::unique_ptr<SchedulingStrategy> s) { strategy_ = std::move(s); }

    ElevatorCar* request(const HallCall& call) {
        ElevatorCar* car = strategy_->pick(cars_, call);   // WHICH car — pluggable
        car->addRequest(call);                             // WHEN to serve it — the car's own LOOK
        return car;
    }

    ElevatorCar& car(int id) { for (auto& c : cars_) if (c->id() == id) return *c; throw std::runtime_error("no car"); }

    // Time comes from OUTSIDE: a main loop, a test, or a hardware timer.
    void tick() { for (auto& c : cars_) c->step(); }

    bool busy() const { for (auto& c : cars_) if (c->busy()) return true; return false; }
    int floorsTravelled() const { int t = 0; for (auto& c : cars_) t += c->floorsTravelled(); return t; }

private:
    std::vector<std::unique_ptr<ElevatorCar>> cars_;
    std::unique_ptr<SchedulingStrategy> strategy_;
};

// What FIFO would have cost: walk to each request in arrival order.
static int fifoFloors(int start, const std::vector<int>& arrivalOrder) {
    int total = 0, at = start;
    for (int f : arrivalOrder) { total += std::abs(f - at); at = f; }
    return total;
}

int main() {
    std::cout << "=== one car, four hall calls: 5 up, 2 up, 8 up, 3 up ===\\n";
    std::vector<std::unique_ptr<ElevatorCar>> oneCar;
    oneCar.push_back(std::make_unique<ElevatorCar>(1, 1));
    ElevatorSystem one(std::move(oneCar), std::make_unique<NearestCarStrategy>());
    for (int f : {5, 2, 8, 3}) one.request(HallCall{f, Direction::Up});

    int t = 0;
    while (one.busy() && t < 200) {                       // the caller owns time
        one.tick();
        ++t;
        std::cout << "t=" << std::setw(2) << std::setfill('0') << t << "  " << one.car(1).describe() << "\\n";
    }
    std::cout << std::setfill(' ');
    std::cout << "LOOK floors travelled: " << one.floorsTravelled() << "\\n";
    std::cout << "FIFO floors travelled: " << fifoFloors(1, {5, 2, 8, 3}) << "   (1 -> 5 -> 2 -> 8 -> 3)\\n\\n";

    std::cout << "=== two cars, dispatch is a separate decision ===\\n";
    std::vector<std::unique_ptr<ElevatorCar>> bankCars;
    bankCars.push_back(std::make_unique<ElevatorCar>(1, 1));
    bankCars.push_back(std::make_unique<ElevatorCar>(2, 9));
    ElevatorSystem bank(std::move(bankCars), std::make_unique<NearestCarStrategy>());

    for (int f : {8, 7, 6})
        std::cout << "hall call " << f << " DOWN -> car #" << bank.request(HallCall{f, Direction::Down})->id() << "\\n";

    bank.setStrategy(std::make_unique<LeastLoadStrategy>());   // the ONLY line that changes
    std::cout << "swapped strategy to LeastLoad — request() did not change\\n";
    std::cout << "hall call 5 DOWN -> car #" << bank.request(HallCall{5, Direction::Down})->id() << "\\n";
}

/* expected output
=== one car, four hall calls: 5 up, 2 up, 8 up, 3 up ===
t=01  car#1 floor 2  DOORS_OPEN  up[3, 5, 8]  down[]
t=02  car#1 floor 2  MOVING_UP   up[3, 5, 8]  down[]
t=03  car#1 floor 3  DOORS_OPEN  up[5, 8]  down[]
t=04  car#1 floor 3  MOVING_UP   up[5, 8]  down[]
t=05  car#1 floor 4  MOVING_UP   up[5, 8]  down[]
t=06  car#1 floor 5  DOORS_OPEN  up[8]  down[]
t=07  car#1 floor 5  MOVING_UP   up[8]  down[]
t=08  car#1 floor 6  MOVING_UP   up[8]  down[]
t=09  car#1 floor 7  MOVING_UP   up[8]  down[]
t=10  car#1 floor 8  DOORS_OPEN  up[]  down[]
t=11  car#1 floor 8  IDLE        up[]  down[]
LOOK floors travelled: 7
FIFO floors travelled: 18   (1 -> 5 -> 2 -> 8 -> 3)

=== two cars, dispatch is a separate decision ===
hall call 8 DOWN -> car #2
hall call 7 DOWN -> car #2
hall call 6 DOWN -> car #2
swapped strategy to LeastLoad — request() did not change
hall call 5 DOWN -> car #1
*/`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "elevatorSystem.ts",
        code: `type Direction = "UP" | "DOWN" | "IDLE";
type CarState = "IDLE" | "MOVING_UP" | "MOVING_DOWN" | "DOORS_OPEN";

/**
 * TWO kinds of request, and they are NOT the same thing.
 *   HallCall : pressed outside. Knows a floor AND a direction, but no destination.
 *   CarCall  : pressed inside.  Knows a destination, but carries no direction.
 */
export type HallCall = { kind: "hall"; floor: number; direction: "UP" | "DOWN" };
export type CarCall = { kind: "car"; floor: number };
export type Request = HallCall | CarCall;

export const hallCall = (floor: number, direction: "UP" | "DOWN"): HallCall =>
  ({ kind: "hall", floor, direction });
export const carCall = (floor: number): CarCall => ({ kind: "car", floor });

export class ElevatorCar {
  floor: number;
  direction: Direction = "IDLE";
  state: CarState = "IDLE";
  floorsTravelled = 0;

  // Two sorted sets: up ascending, down descending.
  private readonly upRequests: number[] = [];
  private readonly downRequests: number[] = [];

  constructor(readonly id: number, startFloor: number) {
    this.floor = startFloor;
  }

  pending(): number {
    return this.upRequests.length + this.downRequests.length;
  }

  busy(): boolean {
    return this.pending() > 0 || this.state === "DOORS_OPEN";
  }

  /** Hall calls arrive from many floors at once — this is the only shared state. */
  addRequest(request: Request): void {
    if (request.kind === "hall") {
      if (request.direction === "UP") this.addUp(request.floor);
      else this.addDown(request.floor);
      return;
    }
    // a CarCall: direction comes from where we are
    if (request.floor > this.floor) this.addUp(request.floor);
    else if (request.floor < this.floor) this.addDown(request.floor);
    else this.state = "DOORS_OPEN";
  }

  private addUp(floor: number): void {
    if (!this.upRequests.includes(floor)) {
      this.upRequests.push(floor);
      this.upRequests.sort((a, b) => a - b);
    }
  }

  private addDown(floor: number): void {
    if (!this.downRequests.includes(floor)) {
      this.downRequests.push(floor);
      this.downRequests.sort((a, b) => b - a);
    }
  }

  /** ONE floor of movement. Time is driven from outside — never sleep in here. */
  step(): void {
    if (this.state === "DOORS_OPEN") {
      this.state = this.resume();
      return;
    }
    if (!this.busy()) {
      this.direction = "IDLE";
      this.state = "IDLE";
      return;
    }

    if (this.direction === "IDLE") this.direction = this.towardsNearest();
    if (this.serveHere()) {
      this.state = "DOORS_OPEN";
      return;
    }

    if (!this.workAhead(this.direction)) this.direction = this.direction === "UP" ? "DOWN" : "UP";
    if (this.serveHere()) {
      this.state = "DOORS_OPEN";
      return;
    }

    this.floor += this.direction === "UP" ? 1 : -1;
    this.floorsTravelled++;
    this.state = this.direction === "UP" ? "MOVING_UP" : "MOVING_DOWN";
    if (this.serveHere()) this.state = "DOORS_OPEN";      // stop for it on the way
  }

  /** Remove a request at this floor IF it matches where we are going. */
  private serveHere(): boolean {
    if (this.direction === "UP") {
      if (this.drop(this.upRequests, this.floor)) return true;
      if (!this.anyAbove() && this.drop(this.downRequests, this.floor)) return true;  // turnaround
    } else if (this.direction === "DOWN") {
      if (this.drop(this.downRequests, this.floor)) return true;
      if (!this.anyBelow() && this.drop(this.upRequests, this.floor)) return true;
    }
    return false;
  }

  private drop(bucket: number[], floor: number): boolean {
    const i = bucket.indexOf(floor);
    if (i < 0) return false;
    bucket.splice(i, 1);
    return true;
  }

  private resume(): CarState {
    if (this.pending() === 0) {
      this.direction = "IDLE";
      return "IDLE";
    }
    return this.direction === "UP" ? "MOVING_UP" : "MOVING_DOWN";
  }

  private all(): number[] {
    return [...this.upRequests, ...this.downRequests];
  }

  private towardsNearest(): Direction {
    let target = this.floor;
    let best = Number.MAX_SAFE_INTEGER;
    for (const f of this.all()) {
      if (Math.abs(f - this.floor) < best) {
        best = Math.abs(f - this.floor);
        target = f;
      }
    }
    return target >= this.floor ? "UP" : "DOWN";
  }

  private workAhead(d: Direction): boolean {
    return d === "UP" ? this.anyAbove() : this.anyBelow();
  }

  private anyAbove(): boolean {
    return this.all().some((f) => f > this.floor);
  }

  private anyBelow(): boolean {
    return this.all().some((f) => f < this.floor);
  }

  describe(): string {
    return "car#" + this.id + " floor " + this.floor + "  " + this.state.padEnd(11) +
      " up[" + this.upRequests.join(", ") + "]  down[" + this.downRequests.join(", ") + "]";
  }
}

/** WHICH car takes a hall call. The one decision the interviewer will ask you to change. */
export interface SchedulingStrategy {
  pick(cars: ElevatorCar[], call: HallCall): ElevatorCar;
}

const DETOUR = 100;   // big enough that a wrong-way car only wins if nothing else is close

export class NearestCarStrategy implements SchedulingStrategy {
  static cost(car: ElevatorCar, call: HallCall): number {
    const distance = Math.abs(car.floor - call.floor);
    if (car.direction === "IDLE") return distance;                  // idle: just the walk
    const towards =
      (car.direction === "UP" && call.floor >= car.floor) ||
      (car.direction === "DOWN" && call.floor <= car.floor);
    if (towards && car.direction === call.direction) return distance;   // it passes you anyway
    return distance + DETOUR;                                       // it must finish its run first
  }

  pick(cars: ElevatorCar[], call: HallCall): ElevatorCar {
    return cars.reduce((best, c) =>
      NearestCarStrategy.cost(c, call) < NearestCarStrategy.cost(best, call) ? c : best);
  }
}

function leastLoadCost(car: ElevatorCar, call: HallCall): number {
  return car.pending() * DETOUR + Math.abs(car.floor - call.floor);
}

export class LeastLoadStrategy implements SchedulingStrategy {
  pick(cars: ElevatorCar[], call: HallCall): ElevatorCar {
    return cars.reduce((best, c) => (leastLoadCost(c, call) < leastLoadCost(best, call) ? c : best));
  }
}

export class ElevatorSystem {
  constructor(private readonly carList: ElevatorCar[], private strategy: SchedulingStrategy) {}

  /** Open for a new policy, closed for modification — request() below never changes. */
  setStrategy(strategy: SchedulingStrategy): void {
    this.strategy = strategy;
  }

  request(call: HallCall): ElevatorCar {
    const car = this.strategy.pick(this.carList, call);   // WHICH car — pluggable
    car.addRequest(call);                                 // WHEN to serve it — the car's own LOOK
    return car;
  }

  car(id: number): ElevatorCar {
    const found = this.carList.find((c) => c.id === id);
    if (!found) throw new Error("no car " + id);
    return found;
  }

  /** Time comes from OUTSIDE: a main loop, a test, or a hardware timer. */
  tick(): void {
    this.carList.forEach((c) => c.step());
  }

  busy(): boolean {
    return this.carList.some((c) => c.busy());
  }

  floorsTravelled(): number {
    return this.carList.reduce((t, c) => t + c.floorsTravelled, 0);
  }
}

/** What FIFO would have cost: walk to each request in arrival order. */
export function fifoFloors(start: number, arrivalOrder: number[]): number {
  let total = 0;
  let at = start;
  for (const f of arrivalOrder) {
    total += Math.abs(f - at);
    at = f;
  }
  return total;
}

// ---------------------------------------------------------------- demo
console.log("=== one car, four hall calls: 5 up, 2 up, 8 up, 3 up ===");
const one = new ElevatorSystem([new ElevatorCar(1, 1)], new NearestCarStrategy());
[5, 2, 8, 3].forEach((f) => one.request(hallCall(f, "UP")));

let t = 0;
while (one.busy() && t < 200) {                 // the caller owns time
  one.tick();
  t++;
  console.log("t=" + String(t).padStart(2, "0") + "  " + one.car(1).describe());
}
console.log("LOOK floors travelled:", one.floorsTravelled());
console.log("FIFO floors travelled:", fifoFloors(1, [5, 2, 8, 3]), "  (1 -> 5 -> 2 -> 8 -> 3)");

console.log("");
console.log("=== two cars, dispatch is a separate decision ===");
const bank = new ElevatorSystem([new ElevatorCar(1, 1), new ElevatorCar(2, 9)], new NearestCarStrategy());
[8, 7, 6].forEach((f) => console.log("hall call " + f + " DOWN -> car #" + bank.request(hallCall(f, "DOWN")).id));

bank.setStrategy(new LeastLoadStrategy());      // the ONLY line that changes
console.log("swapped strategy to LeastLoad — request() did not change");
console.log("hall call 5 DOWN -> car #" + bank.request(hallCall(5, "DOWN")).id);

/* expected output
=== one car, four hall calls: 5 up, 2 up, 8 up, 3 up ===
t=01  car#1 floor 2  DOORS_OPEN  up[3, 5, 8]  down[]
t=02  car#1 floor 2  MOVING_UP   up[3, 5, 8]  down[]
t=03  car#1 floor 3  DOORS_OPEN  up[5, 8]  down[]
t=04  car#1 floor 3  MOVING_UP   up[5, 8]  down[]
t=05  car#1 floor 4  MOVING_UP   up[5, 8]  down[]
t=06  car#1 floor 5  DOORS_OPEN  up[8]  down[]
t=07  car#1 floor 5  MOVING_UP   up[8]  down[]
t=08  car#1 floor 6  MOVING_UP   up[8]  down[]
t=09  car#1 floor 7  MOVING_UP   up[8]  down[]
t=10  car#1 floor 8  DOORS_OPEN  up[]  down[]
t=11  car#1 floor 8  IDLE        up[]  down[]
LOOK floors travelled: 7
FIFO floors travelled: 18   (1 -> 5 -> 2 -> 8 -> 3)

=== two cars, dispatch is a separate decision ===
hall call 8 DOWN -> car #2
hall call 7 DOWN -> car #2
hall call 6 DOWN -> car #2
swapped strategy to LeastLoad — request() did not change
hall call 5 DOWN -> car #1
*/`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Take the building away and this is **a queue of requests that must be served in a smart order, and a fleet of workers to spread them across**. Those are two independent decisions, and the whole design is about keeping them independent.",
      },
      {
        type: "ul",
        items: [
          "**Disk I/O scheduling** — LOOK is literally the disk-arm algorithm. The head sweeps across cylinders serving requests on the way instead of seeking back and forth.",
          "**Ride hailing** — a rider request is a hall call with a direction; matching a driver is `SchedulingStrategy.pick()`; picking up a second passenger on the way is `serveHere()`.",
          "**Delivery batching** — a courier who already has your street on the route costs nothing extra; one heading the other way costs the detour penalty. Same cost function, different units.",
          "**Print and job queues with a fleet of workers** — dispatch to the least-loaded worker is `LeastLoadStrategy` with a different name.",
          "**Any request router** — load balancers make the same two decisions: which backend takes it, and in what order does that backend serve what it holds.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The two-sentence version to say out loud",
        text: "*“There are two request types — a hall call carries a direction, a car call carries a destination — and merging them makes correct scheduling impossible. Each car serves what it holds with LOOK: keep going, stop for everything on the way, reverse only when nothing is ahead; and which car takes a hall call is a separate strategy the caller never sees.”* That is the design, in 20 seconds.",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**At 60 floors and 8 cars.** Per-car LOOK plus nearest-car dispatch causes **bunching** — cars drift into a clump and one region of the building waits. Real buildings switch to destination dispatch, where riders enter their destination in the lobby and the system groups them by trip, which gives the scheduler the information a hall call deliberately hides.",
          "**When fairness matters more than efficiency.** LOOK can starve a floor at the far end of a busy building. The fix is an age term in the cost — a request that has waited long enough overrides distance — and that is a real change to the algorithm, not a parameter.",
          "**When cars share a shaft.** Two cars in one shaft cannot pass each other, so scheduling becomes a constraint problem, not a sorting problem. Nothing you wrote survives that, and it is fine to say so.",
          "**When you need optimality.** Assigning N requests to M cars to minimise total travel is a hard combinatorial problem. Every real system uses a heuristic, which is exactly why the decision lives behind an interface.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Model the direction, then never serve in arrival order.** A `HallCall(floor, direction)` plus two sorted sets is maybe fifteen lines, and it is the difference between 7 floors and 18 on four requests. Everything else in this problem — doors, states, strategies, locks — is decoration on those two ideas.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Separating HallCall from CarCall keeps the direction of every waiting rider, which is the one piece of information LOOK cannot work without.",
        "Two sorted sets turn scheduling into a data-structure choice: the ordering is free, and step() stays about fifteen lines.",
        "Putting dispatch behind SchedulingStrategy means a new policy is one new class and zero edits to ElevatorSystem.request().",
        "Driving time with tick() makes the whole scheduler testable synchronously — three calls and an assertion, no threads and no waiting.",
        "One lock per car around the two request sets is enough for correctness, and it never blocks the movement of any car.",
      ],
      cons: [
        "Per-car LOOK plus nearest-car dispatch causes bunching in tall buildings — cars clump together and one region waits longer than it should.",
        "LOOK has no fairness guarantee: a request at the far end of a busy building can wait a long time unless you add an age term to the cost.",
        "The cost function is a heuristic, not an optimum — assigning many requests across many cars optimally is a hard combinatorial problem.",
        "A tick model quantises time into whole floors, so it cannot express acceleration, variable floor heights, or realistic door dwell times.",
        "Because dispatch reads car state without a lock, a request can occasionally be assigned using a floor number that is one tick stale.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "awesome-low-level-design — Elevator system problem",
        href: "https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/elevator-system.md",
        kind: "article",
        note: "The problem written up in the format interviewers use, with a reference solution to compare your class list against.",
      },
      {
        label: "Disk scheduling: SCAN, C-SCAN and LOOK",
        href: "https://en.wikipedia.org/wiki/Elevator_algorithm",
        kind: "article",
        note: "The algorithm is named after this problem and is still taught as the disk-arm scheduler. Short, and it names the variants you can offer as follow-ups.",
      },
      {
        label: "Operating System Concepts — Silberschatz, Galvin & Gagne",
        kind: "book",
        note: "The disk-scheduling chapter compares FCFS, SSTF, SCAN, C-SCAN and LOOK with worked head-movement totals — the same arithmetic as the 18-versus-7 figure.",
      },
      {
        label: "TreeSet — Java API documentation",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeSet.html",
        kind: "docs",
        note: "Why a TreeSet and a TreeSet(reverseOrder()) are the right containers: sorted iteration, no duplicates, and O(log n) add and remove.",
      },
      {
        label: "Destination dispatch — how modern lift banks actually work",
        href: "https://en.wikipedia.org/wiki/Destination_dispatch",
        kind: "article",
        note: "Read this before the interview. It is the answer to “what changes at 60 floors?”, and it explains why hall calls disappear entirely.",
      },
      {
        label: "Elevator traffic analysis and handling capacity",
        href: "https://www.peters-research.com/index.php/support/articles-and-papers",
        kind: "paper",
        note: "Real lift-engineering papers on round-trip time and handling capacity — useful if you want to defend a cost function with numbers rather than intuition.",
      },
      {
        label: "Refactoring Guru — Strategy pattern",
        href: "https://refactoring.guru/design-patterns/strategy",
        kind: "docs",
        note: "The seam used for SchedulingStrategy, with the same before-and-after shape: a family of interchangeable algorithms behind one call.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "elevator-system-q1",
        question: "Why must a hall call and a car call be different types?",
        options: [
          { id: "a", label: "A hall call carries a direction but no destination, and a car call carries a destination but no direction — merging them throws away the direction, and the car can no longer decide whether to stop." },
          { id: "b", label: "They are the same thing; using two types is over-engineering for a 60-minute round." },
          { id: "c", label: "Because hall calls must be stored in a database and car calls must not." },
          { id: "d", label: "Because car calls are higher priority than hall calls." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is the tempting answer, because both objects do look like “a floor number” when you write them down. But a car at floor 5 going up needs to know whether the person waiting at 7 wants to go up (stop now) or down (come back later). Once the direction is gone, that question is unanswerable.",
      },
      {
        id: "elevator-system-q2",
        question: "A car sits at floor 1. Up calls arrive for floors 5, 2, 8 and 3, in that order. How many floors does the car travel under FIFO, and under LOOK?",
        options: [
          { id: "a", label: "18 under FIFO, 7 under LOOK." },
          { id: "b", label: "7 under both — the total distance is the same either way." },
          { id: "c", label: "18 under both, because the car must visit all four floors." },
          { id: "d", label: "11 under FIFO, 7 under LOOK." },
        ],
        correctOptionId: "a",
        explanation:
          "FIFO walks 1→5→2→8→3, which is 4+3+6+5 = 18. LOOK sorts on the way up and does 1→2→3→5→8, a single sweep of 7. (c) is tempting because both do visit the same four floors — but FIFO visits several of them more than once without opening the doors.",
      },
      {
        id: "elevator-system-q3",
        question: "Your car is at floor 5 moving up, with a request at floor 9. Someone on floor 7 presses the DOWN button. What should the car do?",
        options: [
          { id: "a", label: "Carry on to 9, then reverse and pick them up at 7 on the way down." },
          { id: "b", label: "Stop at 7 immediately — it is on the way and stopping is cheap." },
          { id: "c", label: "Reverse at once, since a down request means the car should be going down." },
          { id: "d", label: "Refuse the request and let another car take it." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is the tempting one and it is what most first drafts do. But the rider at 7 wants to go DOWN — picking them up mid-upward-run means carrying them further away from where they are going. The direction on the hall call is exactly what lets you make this call.",
      },
      {
        id: "elevator-system-q4",
        question: "Why keep two sorted sets per car instead of one sorted list of pending floors?",
        options: [
          { id: "a", label: "Because the sets are split by the direction the rider wants to travel, so the car can drain the one matching its own direction and ignore the other until it flips." },
          { id: "b", label: "Because two smaller sets are faster to search than one larger one." },
          { id: "c", label: "Because a single set cannot hold both a floor above and a floor below the car." },
          { id: "d", label: "Because Java's TreeSet has a maximum size." },
        ],
        correctOptionId: "a",
        explanation:
          "The split is semantic, not performance. One sorted list can tell you what is above and below, but it cannot tell you which of those people wanted to go up — so it cannot express the LOOK rule at all. (b) is a real but irrelevant micro-effect.",
      },
      {
        id: "elevator-system-q5",
        question: "Where should the “which car takes this hall call” decision live?",
        options: [
          { id: "a", label: "Behind a SchedulingStrategy interface that ElevatorSystem.request() calls, so a new policy is one new class and no edits to the caller." },
          { id: "b", label: "Inside ElevatorCar, since the car knows its own position best." },
          { id: "c", label: "Inside the HallCall object, which can decide which car suits it." },
          { id: "d", label: "In ElevatorSystem.request() directly, as a chain of if statements." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is tempting because the car does know its own state — but a car cannot compare itself to cars it has no reference to, and putting the comparison there means every car knows about every other car. The strategy sees the whole fleet; each car stays ignorant of the others.",
      },
      {
        id: "elevator-system-q6",
        question: "Why should movement be driven by a tick() call instead of a sleep inside the car?",
        options: [
          { id: "a", label: "Because time becomes an input: a test can call tick() three times and assert the floor instantly, and the same code still works from a real timer." },
          { id: "b", label: "Because sleeping is not allowed inside a class in most languages." },
          { id: "c", label: "Because tick() is faster than sleeping." },
          { id: "d", label: "Because sleeping would make the car skip floors." },
        ],
        correctOptionId: "a",
        explanation:
          "It is the same rule as passing the exit time into a parking-lot bill instead of reading the clock inside it. Anything that reads or consumes time internally can only be tested by waiting — and in a 60-minute round you will not wait, so you will not test.",
      },
      {
        id: "elevator-system-q7",
        question: "A firefighter mode is requested. What is the part candidates most often forget?",
        options: [
          { id: "a", label: "Cancelling every pending request — the people already waiting on other floors must be dropped and their hall calls re-dispatched, not silently kept in the queue." },
          { id: "b", label: "Making the car move faster than normal." },
          { id: "c", label: "Adding a new subclass of ElevatorCar for firefighter cars." },
          { id: "d", label: "Persisting the mode change to a database." },
        ],
        correctOptionId: "a",
        explanation:
          "Service mode is not just “accept one destination”; it is “abandon the whole queue”. Anything left in the two sets would be silently served later, or worse, silently lost. Handling the abandoned hall calls — by putting them back through the dispatcher — is the answer that reads as senior.",
      },
      {
        id: "elevator-system-q8",
        question: "The building grows to 60 floors and 8 cars. What is the real structural change?",
        options: [
          { id: "a", label: "Destination dispatch: riders enter their destination in the lobby, the system groups people by trip, and hall calls with a bare direction disappear." },
          { id: "b", label: "Add more cars and keep nearest-car dispatch, since the strategy loop already handles any number of cars." },
          { id: "c", label: "Replace LOOK with FIFO, because FIFO scales better to many floors." },
          { id: "d", label: "Give each car its own thread so they can move in parallel." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is tempting and half-true — the code does scale — but nearest-car dispatch makes cars bunch together, and a hall call deliberately hides the one fact that would let the scheduler group riders: where they are going. Destination dispatch changes the input, which is why it is a structural change rather than a tuning one.",
      },
    ],
  },
};
