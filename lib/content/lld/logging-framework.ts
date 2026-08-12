import type { RoadmapLesson } from "@/lib/content/types";

export const loggingFramework: RoadmapLesson = {
  title: "Logging framework",
  oneLiner:
    "The purest separation-of-concerns problem in the set. One log call has **three completely independent questions** hiding inside it — *does this get through*, *where does it go*, *what does it look like* — and the moment you weld them into one class, every new sink and every new format costs an edit to the code everybody depends on.",
  difficulty: "intermediate",
  estimatedTime: "30 min",
  prototypePath: "/prototypes/lld/logging-framework.html",
  content: {
    prototypeCaption:
      "A live pipeline you can rewire. Press **ERROR** and watch one event pass the **threshold gate**, fan out, and land on all three appender cards at once; press **WARN** and only two of them take it. Flip **📄 File** to **{ } JSON** and press **ERROR** again — the *same* event is on screen as plain text and as JSON at the same time. Set the **root threshold** to **FATAL** and press **INFO**: the gate says **✗ DROP** and no formatter ever runs. Press **➕ Add Slack appender** — a fourth sink joins the fan-out and the counter still reads **core logger edited: 0 lines**. Then switch the network card to **⚡ async** and press **🔥 Burst 20** to watch the five-slot queue fill and the `dropped` counter start ticking.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design a logging framework.”* It is the friendliest-sounding prompt in the set, and it is the one most candidates fail without noticing. Everybody has used a logger. Almost nobody has been asked to take one apart.",
      },
      {
        type: "p",
        text: "Here is the naive answer, and it takes about ninety seconds to write: a `Logger` class with a `log(level, message)` method, a `switch` on the level, and a `System.out.println` at the bottom. It works. It also has no seams, and the interviewer is about to press on every one of the places where a seam should have been.",
      },
      {
        type: "p",
        text: "Because a single call — `log.warn(\"disk 91% full\")` — is really **three independent questions** stacked on top of each other. Does this message get through at all? Where does it go? What does it look like when it gets there? Each one changes for a different reason, at a different time, decided by a different person. Weld them together and every one of them costs you an edit to the class the whole application depends on.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 300" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The whole logging pipeline drawn left to right. A call to log dot info enters a threshold gate that asks whether the level is below the threshold. If it passes, one immutable LogEvent is built, then fanned out to three appenders: a console appender at DEBUG with a plain formatter, a file appender at WARN with a JSON formatter, and a network appender at ERROR with a JSON formatter. Each appender writes to its own sink: stdout, app dot log, and a collector. Labels mark the three axes: what gets through, where it goes, and how it looks.">
  <defs>
    <marker id="lg-flow" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="lg-fan" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <text x="156" y="104" font-size="9" fill="#fb863a">① WHAT gets through — the level threshold</text>
  <text x="478" y="12" font-size="9" fill="#fb863a">② WHERE it goes — Appender</text>
  <text x="478" y="294" font-size="9" fill="#fb863a">③ HOW it looks — Formatter (the small chips)</text>

  <rect x="8" y="122" width="112" height="56" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="18" y="146" font-size="10" fill="#e8e4dc">log.info(msg)</text>
  <text x="18" y="164" font-size="8.5" fill="#6b7280">Logger</text>
  <line x1="122" y1="150" x2="150" y2="150" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lg-flow)"/>

  <rect x="156" y="112" width="104" height="66" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="166" y="134" font-size="9" fill="#e8e4dc">level &lt; threshold</text>
  <text x="166" y="150" font-size="9" fill="#f06868">→ return</text>
  <text x="166" y="170" font-size="8.5" fill="#6b7280">threshold gate</text>
  <line x1="262" y1="150" x2="290" y2="150" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lg-flow)"/>

  <rect x="296" y="112" width="112" height="76" rx="6" fill="#14161a" stroke="#5e9ff6"/>
  <text x="306" y="132" font-size="10" fill="#5e9ff6">LogEvent</text>
  <text x="306" y="150" font-size="8.5" fill="#9099a8">ts · level · logger</text>
  <text x="306" y="165" font-size="8.5" fill="#9099a8">thread · msg · ctx</text>
  <text x="306" y="182" font-size="8.5" fill="#6b7280">built ONCE</text>
  <line x1="410" y1="150" x2="434" y2="150" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lg-flow)"/>

  <circle cx="446" cy="150" r="7" fill="rgba(94,159,246,0.16)" stroke="#5e9ff6"/>
  <text x="418" y="176" font-size="8.5" fill="#5e9ff6">fan-out</text>

  <line x1="453" y1="146" x2="472" y2="52" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#lg-fan)"/>
  <line x1="455" y1="150" x2="472" y2="150" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#lg-fan)"/>
  <line x1="453" y1="154" x2="472" y2="248" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#lg-fan)"/>

  <rect x="478" y="18" width="156" height="64" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="488" y="38" font-size="9.5" fill="#e8e4dc">🖥 ConsoleAppender</text>
  <rect x="488" y="46" width="60" height="17" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="494" y="58" font-size="8" fill="#fb863a">≥ DEBUG</text>
  <rect x="554" y="46" width="62" height="17" rx="8" fill="#1a1d22" stroke="#3a414c"/><text x="560" y="58" font-size="8" fill="#9099a8">📝 Plain</text>

  <rect x="478" y="118" width="156" height="64" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="488" y="138" font-size="9.5" fill="#e8e4dc">📄 FileAppender</text>
  <rect x="488" y="146" width="60" height="17" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="494" y="158" font-size="8" fill="#fb863a">≥ WARN</text>
  <rect x="554" y="146" width="62" height="17" rx="8" fill="#1a1d22" stroke="#3a414c"/><text x="560" y="158" font-size="8" fill="#9099a8">{ } Json</text>

  <rect x="478" y="218" width="156" height="64" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="488" y="238" font-size="9.5" fill="#e8e4dc">🌐 NetworkAppender</text>
  <rect x="488" y="246" width="60" height="17" rx="8" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="494" y="258" font-size="8" fill="#fb863a">≥ ERROR</text>
  <rect x="554" y="246" width="62" height="17" rx="8" fill="#1a1d22" stroke="#3a414c"/><text x="560" y="258" font-size="8" fill="#9099a8">{ } Json</text>

  <line x1="636" y1="50" x2="654" y2="50" stroke="#9099a8" stroke-width="1" marker-end="url(#lg-fan)"/>
  <line x1="636" y1="150" x2="654" y2="150" stroke="#9099a8" stroke-width="1" marker-end="url(#lg-fan)"/>
  <line x1="636" y1="250" x2="654" y2="250" stroke="#9099a8" stroke-width="1" marker-end="url(#lg-fan)"/>
  <text x="660" y="54" font-size="9" fill="#6b7280">stdout</text>
  <text x="660" y="154" font-size="9" fill="#6b7280">app.log</text>
  <text x="660" y="254" font-size="9" fill="#6b7280">collector</text>
</svg>`,
        caption:
          "Read it left to right and notice **where each decision lives**. The gate decides *whether*, the appender decides *where*, the chip on the appender decides *what it looks like*. Three decisions, three places, none of them inside the other.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A **Logger** checks one number — *is my level at least the threshold?* — and returns immediately if not. If it passes, it builds **one immutable LogEvent** and hands the same object to every **Appender** on its list. Each appender applies its *own* threshold, asks its *own* **Formatter** to turn the event into bytes, and writes them wherever it writes.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Are the three axes separate?** Level, sink and format must be three interfaces you can change independently. If any two live in the same class, the design has already failed and everything after is decoration.",
          "**Are levels ordered?** `TRACE < DEBUG < INFO < WARN < ERROR < FATAL` as an enum with an ordinal. Levels as strings make a threshold impossible, and that is the single most common wrong turn.",
          "**Is the level check before the work?** The filter must run before the message is formatted, before the event is built, before anything is allocated. Formatting first and filtering second is a real performance bug in a real system.",
          "**Can you add a sink without touching the core?** *“Now also send errors to Slack.”* The correct answer is one new class implementing `Appender` and one line of configuration. Any answer that edits `Logger` loses the point.",
          "**Does it run under threads?** Many threads log at once. Locking per appender, one event object shared by all of them, and an async option for the slow sink — that is the difference between a diagram and a framework.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 262" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An in-scope and out-of-scope board. In scope: ordered levels, hierarchical logger names, appenders for console, file and network, pluggable formatters, an immutable LogEvent, a thread-safe logger registry, per-appender locking, and an optional async appender with a bounded queue. Out of scope: log shipping and aggregation infrastructure, query and search, dashboards and alerting, log parsing, retention policy enforcement, and the wire protocol of the collector.">
  <text x="20" y="22" font-size="10.5" fill="#5cc66f">✓ IN SCOPE — say this out loud in minute 3</text>
  <rect x="20" y="32" width="326" height="212" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="38" y="56" font-size="10" fill="#e8e4dc">ordered Level enum + threshold</text>
  <text x="38" y="78" font-size="10" fill="#e8e4dc">hierarchical logger names</text>
  <text x="38" y="100" font-size="10" fill="#e8e4dc">Appender: console · file · network</text>
  <text x="38" y="122" font-size="10" fill="#e8e4dc">Formatter: plain text · JSON</text>
  <text x="38" y="144" font-size="10" fill="#e8e4dc">immutable LogEvent</text>
  <text x="38" y="166" font-size="10" fill="#e8e4dc">LogManager registry (thread-safe)</text>
  <text x="38" y="188" font-size="10" fill="#e8e4dc">per-appender locking</text>
  <text x="38" y="210" font-size="10" fill="#e8e4dc">async appender, bounded queue</text>
  <text x="38" y="232" font-size="9.5" fill="#5cc66f">eight nouns · all of them fit in 60 min</text>

  <text x="366" y="22" font-size="10.5" fill="#9099a8">✗ OUT OF SCOPE — one sentence, then move on</text>
  <rect x="366" y="32" width="314" height="212" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="384" y="56" font-size="10" fill="#9099a8">shipping logs off the box</text>
  <text x="384" y="78" font-size="10" fill="#9099a8">search, query, indexing</text>
  <text x="384" y="100" font-size="10" fill="#9099a8">dashboards and alerting</text>
  <text x="384" y="122" font-size="10" fill="#9099a8">parsing logs back into fields</text>
  <text x="384" y="144" font-size="10" fill="#9099a8">retention policy enforcement</text>
  <text x="384" y="166" font-size="10" fill="#9099a8">the collector's wire protocol</text>
  <text x="384" y="188" font-size="10" fill="#9099a8">config file format / reload</text>
  <text x="384" y="216" font-size="9.5" fill="#6b7280">these are a platform, not a framework —</text>
  <text x="384" y="232" font-size="9.5" fill="#6b7280">naming them shows you know the boundary</text>
</svg>`,
        caption:
          "The left column is what you will build. The right column is what you will **name in one sentence and then not build** — saying it out loud is worth as much as the code, because it proves you know where the framework ends.",
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      // ---------- clarify ----------
      { type: "h", text: "Step 1 · Clarify — 4 minutes" },
      {
        type: "ul",
        items: [
          "**Are we building the framework or using one?** — the framework. Say it back, because the whole round hinges on it: you are writing the thing that `slf4j` is, not the code that calls it.",
          "**How many destinations?** — at least three: console, file, and something over the network. Fewer than two and the fan-out never appears, which kills the most interesting half of the design.",
          "**Can two destinations want different formats?** — yes, and ask this deliberately. *“Plain text on the console for humans, JSON in the file for machines”* is the sentence that forces `Formatter` to be its own interface.",
          "**Can I turn on debug for one part of the app only?** — yes. That is the hierarchical logger name, and it is the follow-up they always have ready.",
          "**Is it multi-threaded?** — yes. Assume it, do not ask timidly. A logger that garbles lines when two threads write is not a logger.",
          "**Search, dashboards, shipping to a collector?** — out of scope. One sentence, then move on.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Do not start coding at minute 5",
        text: "This problem punishes the fast starter. If you open with `class Logger` and a `switch`, you will spend minutes 30 through 55 retrofitting seams into code that has none, in front of someone watching you do it. Spend four minutes drawing three boxes — gate, appender, formatter — and the code afterwards writes itself.",
      },

      // ---------- welded vs layered ----------
      { type: "h", text: "Step 2 · The welded version, and what it costs" },
      {
        type: "p",
        text: "Write the naive one down. Do not skip this — showing the interviewer that you *know* what you are avoiding is worth more than quietly avoiding it.",
      },
      {
        type: "code",
        language: "java",
        filename: "the version almost everyone writes",
        code: `class Logger {
    boolean toConsole = true;
    boolean toFile    = true;
    String  level     = "INFO";        // a String. remember this.

    void log(String level, String message) {
        String line = "[" + level + "] " + new Date() + " " + message;   // formatted FIRST
        switch (level) {
            case "DEBUG": if (!this.level.equals("DEBUG")) return; break;
            case "INFO":  if (this.level.equals("ERROR")) return; break;
            // ... and it grows every time somebody adds a level
        }
        if (toConsole) System.out.println(line);
        if (toFile)    writeToFile(line);
    }
}`,
      },
      {
        type: "p",
        text: "It works today. Now the interviewer says the sentence they were always going to say: *“Now also send errors to Slack, as JSON, but only in production.”* Count what you touch.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 320" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Side by side comparison. On the left, the welded design is one Logger class holding boolean flags for console and file, a string level, a switch statement and inline string formatting; adding a Slack sink as JSON means editing the core class, adding two flags, adding a format branch and redeploying, touching three files. On the right, the layered design has three separate interfaces: an ordered Level enum for the threshold, an Appender interface with console, file and network implementations, and a Formatter interface with plain and JSON implementations; adding a Slack sink means one new class and one config line, touching one new file and editing zero existing ones.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ WELDED — one class does all three jobs</text>
  <rect x="20" y="32" width="326" height="176" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="38" y="56" font-size="10" fill="#e8e4dc">class Logger {</text>
  <text x="46" y="76" font-size="10" fill="#f06868">boolean toConsole, toFile;</text>
  <text x="46" y="96" font-size="10" fill="#f06868">String level;</text>
  <text x="46" y="116" font-size="10" fill="#f06868">switch (level) { ... }</text>
  <text x="46" y="136" font-size="10" fill="#f06868">line = "[" + lvl + "] " + msg;</text>
  <text x="46" y="156" font-size="10" fill="#f06868">if (toConsole) println(line);</text>
  <text x="46" y="176" font-size="10" fill="#f06868">if (toFile) write(line);</text>
  <text x="38" y="196" font-size="10" fill="#e8e4dc">}</text>

  <text x="374" y="22" font-size="10.5" fill="#5cc66f">✓ LAYERED — three interfaces, three reasons to change</text>
  <rect x="374" y="32" width="326" height="176" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="392" y="56" font-size="10" fill="#fb863a">enum Level { TRACE…FATAL }</text>
  <text x="392" y="72" font-size="9" fill="#9099a8">ordered → a threshold is possible</text>
  <line x1="392" y1="84" x2="684" y2="84" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="392" y="104" font-size="10" fill="#5e9ff6">interface Appender { append(e) }</text>
  <text x="392" y="120" font-size="9" fill="#9099a8">Console · File · Network · Slack</text>
  <line x1="392" y1="132" x2="684" y2="132" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="392" y="152" font-size="10" fill="#5cc66f">interface Formatter { format(e) }</text>
  <text x="392" y="168" font-size="9" fill="#9099a8">PlainText · Json</text>
  <line x1="392" y1="180" x2="684" y2="180" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="392" y="198" font-size="9.5" fill="#5cc66f">each varies without disturbing the others</text>

  <line x1="20" y1="230" x2="700" y2="230" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="252" font-size="10.5" fill="#fb863a">“now also send errors to Slack, as JSON, but only in production”</text>

  <rect x="20" y="264" width="326" height="46" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="34" y="282" font-size="9.5" fill="#f06868">edit Logger · add 2 flags · add a format branch</text>
  <text x="34" y="300" font-size="10" fill="#f06868">files touched: 3 existing · redeploy the core</text>

  <rect x="374" y="264" width="326" height="46" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="388" y="282" font-size="9.5" fill="#5cc66f">new SlackAppender + the JsonFormatter you have</text>
  <text x="388" y="300" font-size="10" fill="#5cc66f">files touched: 1 new · 0 existing edits</text>
</svg>`,
        caption:
          "Look only at the bottom two boxes. **3 existing files versus 0** — that number is the entire argument for [[separation-of-concerns]], and it is why [[open-closed]] is phrased as *open to extension, closed to modification*. Three jobs in one class also means three reasons to change it, which is exactly what [[single-responsibility]] forbids.",
      },

      // ---------- axis 1: levels ----------
      { type: "h", text: "Step 3 · Axis one — WHAT gets through" },
      {
        type: "p",
        text: "Levels are not labels. They are an **ordered scale**, and the ordering is the only reason a threshold can exist. Make the enum, and one line of code does the entire job:",
      },
      {
        type: "code",
        language: "java",
        filename: "the most important line in the system",
        code: `enum Level { TRACE, DEBUG, INFO, WARN, ERROR, FATAL }   // order IS the meaning

// inside Logger.log(...)
if (level.ordinal() < threshold.ordinal()) return;      // before ANYTHING is built`,
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 320" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The six log levels drawn as a ladder with FATAL at the top and TRACE at the bottom, each labelled with its ordinal from five down to zero. A threshold line is drawn across the ladder just below INFO. FATAL, ERROR, WARN and INFO are above the line and pass; DEBUG and TRACE are below and are dropped. A note at the bottom shows the single comparison that implements the whole rule.">
  <text x="20" y="22" font-size="10.5" fill="#fb863a">threshold = INFO  (ordinal 2)</text>

  <rect x="60" y="32" width="240" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="74" y="52" font-size="10" fill="#e8e4dc">FATAL</text><text x="266" y="52" font-size="10" fill="#6b7280">5</text>
  <text x="320" y="52" font-size="10" fill="#5cc66f">✓ passes</text>

  <rect x="60" y="72" width="240" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="74" y="92" font-size="10" fill="#e8e4dc">ERROR</text><text x="266" y="92" font-size="10" fill="#6b7280">4</text>
  <text x="320" y="92" font-size="10" fill="#5cc66f">✓ passes</text>

  <rect x="60" y="112" width="240" height="30" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="74" y="132" font-size="10" fill="#e8e4dc">WARN</text><text x="266" y="132" font-size="10" fill="#6b7280">3</text>
  <text x="320" y="132" font-size="10" fill="#5cc66f">✓ passes</text>

  <rect x="60" y="152" width="240" height="30" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="74" y="172" font-size="10" fill="#fb863a">INFO</text><text x="266" y="172" font-size="10" fill="#fb863a">2</text>
  <text x="320" y="172" font-size="10" fill="#5cc66f">✓ passes — the threshold itself</text>

  <line x1="40" y1="190" x2="600" y2="190" stroke="#fb863a" stroke-width="1.4" stroke-dasharray="6 4"/>
  <text x="606" y="194" font-size="9" fill="#fb863a">threshold</text>

  <rect x="60" y="198" width="240" height="30" rx="5" fill="#14161a" stroke="rgba(240,104,104,0.35)"/>
  <text x="74" y="218" font-size="10" fill="#9099a8">DEBUG</text><text x="266" y="218" font-size="10" fill="#6b7280">1</text>
  <text x="320" y="218" font-size="10" fill="#f06868">✗ dropped at the gate</text>

  <rect x="60" y="238" width="240" height="30" rx="5" fill="#14161a" stroke="rgba(240,104,104,0.35)"/>
  <text x="74" y="258" font-size="10" fill="#9099a8">TRACE</text><text x="266" y="258" font-size="10" fill="#6b7280">0</text>
  <text x="320" y="258" font-size="10" fill="#f06868">✗ dropped at the gate</text>

  <line x1="20" y1="282" x2="680" y2="282" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="304" font-size="10" fill="#5cc66f">if (event.level.ordinal() &lt; threshold.ordinal()) return;   ← the whole rule, one line</text>
</svg>`,
        caption:
          "Notice what the ordinals buy you: **one comparison replaces a six-branch switch**. With levels as strings there is no `<`, so there is no threshold, so you end up with the switch that grows a case every time someone invents a level.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The check goes first, or it is not a check",
        text: "`if (isTooLow) return;` must be the **first statement**, before the timestamp is read, before the event is allocated, before `String.format` runs. Filtering after formatting is the classic version of this bug: you pay the full cost of every disabled DEBUG line and then throw the result away. Real frameworks care about allocation on this path for exactly that reason.",
      },

      // ---------- hierarchy ----------
      { type: "h", text: "The threshold is hierarchical — the follow-up they always have ready" },
      {
        type: "p",
        text: "*“The database pool is misbehaving. Turn on DEBUG for it — but only it.”* One global threshold cannot do this. What can is the **logger name**, which is a dotted path, and a threshold that is **inherited** down that path.",
      },
      {
        type: "p",
        text: "A logger named `com.app.db.PoolManager` asks itself: *am I configured?* No. So it asks `com.app.db`. Configured — DEBUG. Stop. That walk-up-until-someone-handles-it is [[chain-of-responsibility]], and it is why turning on DEBUG for one package does not drown you in everything else.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A chain of five loggers from root through com, com dot app, com dot app dot db, to com dot app dot db dot PoolManager. Only root is configured at INFO and only com dot app dot db is configured at DEBUG. Dashed arrows point back up the chain showing that com and com dot app inherit INFO from root, while PoolManager inherits DEBUG from com dot app dot db. A note explains that resolution walks up until a configured node is found.">
  <defs>
    <marker id="lg-up" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#9099a8"/></marker>
    <marker id="lg-chain" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <rect x="10" y="60" width="124" height="60" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="20" y="80" font-size="10" fill="#fb863a">root</text>
  <text x="20" y="98" font-size="8.5" fill="#e8e4dc">configured: INFO</text>
  <text x="20" y="113" font-size="8.5" fill="#5cc66f">effective: INFO</text>

  <line x1="136" y1="90" x2="156" y2="90" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lg-chain)"/>

  <rect x="162" y="60" width="124" height="60" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="172" y="80" font-size="10" fill="#e8e4dc">com</text>
  <text x="172" y="98" font-size="8.5" fill="#6b7280">configured: —</text>
  <text x="172" y="113" font-size="8.5" fill="#5cc66f">effective: INFO</text>

  <line x1="288" y1="90" x2="308" y2="90" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lg-chain)"/>

  <rect x="314" y="60" width="124" height="60" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="324" y="80" font-size="10" fill="#e8e4dc">com.app</text>
  <text x="324" y="98" font-size="8.5" fill="#6b7280">configured: —</text>
  <text x="324" y="113" font-size="8.5" fill="#5cc66f">effective: INFO</text>

  <line x1="440" y1="90" x2="460" y2="90" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lg-chain)"/>

  <rect x="466" y="60" width="124" height="60" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="476" y="80" font-size="10" fill="#5e9ff6">com.app.db</text>
  <text x="476" y="98" font-size="8.5" fill="#e8e4dc">configured: DEBUG</text>
  <text x="476" y="113" font-size="8.5" fill="#5cc66f">effective: DEBUG</text>

  <line x1="592" y1="90" x2="606" y2="90" stroke="#fb863a" stroke-width="1.2" marker-end="url(#lg-chain)"/>

  <rect x="466" y="164" width="200" height="60" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="476" y="184" font-size="10" fill="#e8e4dc">com.app.db.PoolManager</text>
  <text x="476" y="202" font-size="8.5" fill="#6b7280">configured: —</text>
  <text x="476" y="217" font-size="8.5" fill="#5cc66f">effective: DEBUG  ← inherited</text>

  <path d="M528,160 L528,124" fill="none" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lg-up)"/>
  <text x="536" y="146" font-size="8.5" fill="#9099a8">not configured → ask my parent</text>

  <path d="M224,56 L224,40 L72,40 L72,56" fill="none" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lg-up)"/>
  <path d="M376,56 L376,26 L72,26 L72,52" fill="none" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lg-up)"/>
  <text x="248" y="20" font-size="8.5" fill="#9099a8">inherit from the nearest configured ancestor</text>

  <line x1="20" y1="246" x2="700" y2="246" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="268" font-size="10" fill="#e8e4dc">effectiveLevel(): while (node.configured == null) node = node.parent;   ← Chain of Responsibility</text>
  <text x="20" y="288" font-size="9.5" fill="#9099a8">two configured nodes control the level of the entire tree — and DEBUG on the pool does not touch the web layer</text>
</svg>`,
        caption:
          "Two configured nodes, five effective levels. **Only the nodes somebody cared about carry a setting**; everything else inherits, so a config file with two lines governs an application with two thousand loggers.",
      },

      // ---------- axis 2 + 3 ----------
      { type: "h", text: "Step 4 · Axes two and three — WHERE it goes and HOW it looks" },
      {
        type: "p",
        text: "An **Appender** answers *where*. It has one method, `append(LogEvent)`, and the logger holds a **list** of them. When an event passes the gate, the logger walks the list and hands the same event to each one. That fan-out — one source, N interested parties, added and removed without the source knowing — is [[observer]].",
      },
      {
        type: "p",
        text: "A **Formatter** answers *what the bytes look like*. It also has one method, `format(LogEvent) -> String`. The appender owns one, calls it, and writes the result. Two interchangeable implementations behind one method is [[strategy]] in its most literal form.",
      },
      {
        type: "p",
        text: "The point is that they compose. **Each appender carries its own threshold and its own formatter**, so console-at-DEBUG-in-plain-text and file-at-WARN-in-JSON is not a special case — it is just two objects configured differently. The two filters stack: the logger gate decides if the event exists at all, and each appender decides if it wants this one.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 280" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Three independent dials. The first dial is level with six positions from TRACE to FATAL. The second is sink with four positions: console, file, network and Slack. The third is format with two positions: plain and JSON. A note below explains that six plus four plus two equals twelve classes cover six times four times two equals forty-eight combinations, and that welding the axes together would require one class per combination.">
  <text x="20" y="22" font-size="10.5" fill="#fb863a">three dials — turn any one without touching the other two</text>

  <rect x="20" y="38" width="204" height="140" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="34" y="60" font-size="10" fill="#fb863a">① LEVEL</text>
  <text x="34" y="80" font-size="9" fill="#9099a8">TRACE</text>
  <text x="34" y="96" font-size="9" fill="#9099a8">DEBUG</text>
  <text x="34" y="112" font-size="9" fill="#e8e4dc">INFO  ◀ set here</text>
  <text x="34" y="128" font-size="9" fill="#9099a8">WARN</text>
  <text x="34" y="144" font-size="9" fill="#9099a8">ERROR</text>
  <text x="34" y="160" font-size="9" fill="#9099a8">FATAL</text>
  <text x="150" y="172" font-size="9" fill="#6b7280">6 values</text>

  <rect x="248" y="38" width="204" height="140" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="262" y="60" font-size="10" fill="#5e9ff6">② SINK</text>
  <text x="262" y="82" font-size="9" fill="#e8e4dc">🖥 ConsoleAppender ◀</text>
  <text x="262" y="102" font-size="9" fill="#9099a8">📄 FileAppender</text>
  <text x="262" y="122" font-size="9" fill="#9099a8">🌐 NetworkAppender</text>
  <text x="262" y="142" font-size="9" fill="#9099a8">💬 SlackAppender</text>
  <text x="378" y="172" font-size="9" fill="#6b7280">4 classes</text>

  <rect x="476" y="38" width="204" height="140" rx="8" fill="#14161a" stroke="#2d333d"/>
  <text x="490" y="60" font-size="10" fill="#5cc66f">③ FORMAT</text>
  <text x="490" y="86" font-size="9" fill="#e8e4dc">📝 PlainTextFormatter ◀</text>
  <text x="490" y="110" font-size="9" fill="#9099a8">{ } JsonFormatter</text>
  <text x="490" y="140" font-size="8.5" fill="#6b7280">the appender never knows</text>
  <text x="490" y="155" font-size="8.5" fill="#6b7280">which one it is holding</text>
  <text x="606" y="172" font-size="9" fill="#6b7280">2 classes</text>

  <line x1="20" y1="200" x2="680" y2="200" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="224" font-size="10.5" fill="#5cc66f">6 + 4 + 2 = 12 classes cover 6 × 4 × 2 = 48 combinations</text>
  <text x="20" y="248" font-size="10" fill="#f06868">welded, the same 48 combinations need 48 branches inside one method</text>
  <text x="20" y="270" font-size="9.5" fill="#9099a8">addition instead of multiplication — that is what “orthogonal” buys you, and it is the sentence to say out loud</text>
</svg>`,
        caption:
          "**Addition, not multiplication.** Adding a fifth sink adds one class and instantly works with both formats and all six levels — because none of the three dials knows the others exist.",
      },

      // ---------- LogEvent ----------
      { type: "h", text: "Step 5 · The LogEvent — build it once, share it with everyone" },
      {
        type: "p",
        text: "The event is the value object that travels down the pipeline. It carries everything an appender could want, it is **immutable**, and — this matters — it is built exactly once per log call and handed to every appender. Building a fresh one per appender is a real bug: three appenders means three timestamps for one event, and now your file and your console disagree about when something happened.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 300" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A LogEvent card listing its fields: timestamp, level, logger name, message, thread name, an optional throwable, and an optional context map holding a trace id and a user id. The card is marked final and immutable, built once. Three dashed arrows carry the same object to a console appender, a file appender and a network appender, with a note that one event means one timestamp, and that building it per appender would give three different timestamps for the same line.">
  <defs>
    <marker id="lg-share" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
  </defs>

  <text x="20" y="22" font-size="10.5" fill="#5e9ff6">LogEvent  «immutable value object»</text>
  <rect x="20" y="32" width="300" height="204" rx="8" fill="#14161a" stroke="#5e9ff6"/>
  <text x="36" y="56" font-size="10" fill="#e8e4dc">timestamp   : Instant</text>
  <text x="36" y="78" font-size="10" fill="#e8e4dc">level       : Level</text>
  <text x="36" y="100" font-size="10" fill="#e8e4dc">loggerName  : String</text>
  <text x="36" y="122" font-size="10" fill="#e8e4dc">message     : String</text>
  <text x="36" y="144" font-size="10" fill="#e8e4dc">threadName  : String</text>
  <text x="36" y="166" font-size="10" fill="#9099a8">throwable   : Throwable?</text>
  <text x="36" y="188" font-size="10" fill="#9099a8">context     : Map (MDC)</text>
  <text x="52" y="206" font-size="9" fill="#6b7280">traceId=7f2a · userId=42</text>
  <text x="36" y="228" font-size="9.5" fill="#5cc66f">all final · no setters · built ONCE</text>

  <line x1="322" y1="90" x2="392" y2="60" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lg-share)"/>
  <line x1="322" y1="134" x2="392" y2="134" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lg-share)"/>
  <line x1="322" y1="178" x2="392" y2="208" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lg-share)"/>

  <rect x="398" y="38" width="200" height="44" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="412" y="58" font-size="9.5" fill="#e8e4dc">🖥 ConsoleAppender</text>
  <text x="412" y="73" font-size="8.5" fill="#6b7280">the SAME object</text>

  <rect x="398" y="112" width="200" height="44" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="412" y="132" font-size="9.5" fill="#e8e4dc">📄 FileAppender</text>
  <text x="412" y="147" font-size="8.5" fill="#6b7280">the SAME object</text>

  <rect x="398" y="186" width="200" height="44" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="412" y="206" font-size="9.5" fill="#e8e4dc">🌐 NetworkAppender</text>
  <text x="412" y="221" font-size="8.5" fill="#6b7280">the SAME object</text>

  <text x="612" y="134" font-size="9" fill="#5cc66f">immutable →</text>
  <text x="612" y="150" font-size="9" fill="#5cc66f">safe to share</text>
  <text x="612" y="166" font-size="9" fill="#5cc66f">across threads</text>

  <line x1="20" y1="256" x2="680" y2="256" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="20" y="278" font-size="10" fill="#f06868">build it per appender and one line gets three different timestamps — a bug you only find at 3am</text>
</svg>`,
        caption:
          "The `context` map is the field candidates forget and interviewers love: it is where a **trace id** rides along, so one request can be followed across every log line it produced.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 330" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram. Application code calls logger dot info. The Logger resolves its effective level, compares it with the event level and returns immediately if it is too low. Otherwise it builds one LogEvent, then loops over its appenders. Each appender applies its own threshold, calls its formatter to turn the event into a line, takes its own lock and writes. The console appender writes and the file appender writes, while a third appender below its own threshold skips the event without formatting it.">
  <defs>
    <marker id="lg-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="lg-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="8" y="12" width="98" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="22" y="31" font-size="10" fill="#e8e4dc">app code</text>
  <rect x="146" y="12" width="98" height="28" rx="5" fill="#14161a" stroke="#fb863a"/><text x="166" y="31" font-size="10" fill="#fb863a">Logger</text>
  <rect x="292" y="12" width="120" height="28" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="304" y="31" font-size="10" fill="#5e9ff6">ConsoleAppender</text>
  <rect x="454" y="12" width="110" height="28" rx="5" fill="#14161a" stroke="#5cc66f"/><text x="470" y="31" font-size="10" fill="#5cc66f">Formatter</text>
  <rect x="600" y="12" width="112" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="614" y="31" font-size="10" fill="#e8e4dc">FileAppender</text>

  <line x1="57" y1="40" x2="57" y2="312" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="195" y1="40" x2="195" y2="312" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="352" y1="40" x2="352" y2="312" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="509" y1="40" x2="509" y2="312" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="656" y1="40" x2="656" y2="312" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="64" y="62" font-size="9.5" fill="#e8e4dc">warn("disk 91% full")</text>
  <line x1="57" y1="70" x2="191" y2="70" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lg-call)"/>

  <rect x="118" y="80" width="160" height="42" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="128" y="96" font-size="8.5" fill="#fb863a">effectiveLevel() → INFO</text>
  <text x="128" y="112" font-size="8.5" fill="#fb863a">WARN ≥ INFO → continue</text>

  <rect x="130" y="130" width="136" height="26" rx="5" fill="rgba(94,159,246,0.16)" stroke="#5e9ff6"/>
  <text x="140" y="147" font-size="8.5" fill="#5e9ff6">new LogEvent(...)  ×1</text>

  <text x="202" y="180" font-size="9.5" fill="#e8e4dc">append(event)</text>
  <line x1="195" y1="188" x2="348" y2="188" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lg-call)"/>
  <rect x="286" y="196" width="132" height="24" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="294" y="212" font-size="8.5" fill="#9099a8">own threshold: DEBUG ✓</text>

  <text x="360" y="240" font-size="9.5" fill="#e8e4dc">format(event)</text>
  <line x1="352" y1="248" x2="505" y2="248" stroke="#fb863a" stroke-width="1.3" marker-end="url(#lg-call)"/>
  <line x1="509" y1="272" x2="356" y2="272" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#lg-ret)"/>
  <text x="372" y="266" font-size="9" fill="#9099a8">"10:12:04 WARN … disk 91% full"</text>

  <rect x="286" y="280" width="132" height="24" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="294" y="296" font-size="8.5" fill="#5cc66f">🔒 own lock · write</text>

  <text x="430" y="180" font-size="9.5" fill="#e8e4dc">append(same event)</text>
  <line x1="195" y1="160" x2="652" y2="160" stroke="#fb863a" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#lg-call)"/>
  <rect x="588" y="196" width="124" height="40" rx="5" fill="#1a1d22" stroke="#2d333d"/>
  <text x="596" y="212" font-size="8.5" fill="#9099a8">own threshold: WARN ✓</text>
  <text x="596" y="228" font-size="8.5" fill="#9099a8">its own JsonFormatter</text>
</svg>`,
        caption:
          "Follow the two `append` arrows: **the logger does not know or care what happens after them**. Both appenders got the identical event and reached different bytes on different devices. Notation: [[sequence-diagrams]]. The class layout is [[class-diagrams]].",
      },

      // ---------- lazy trap ----------
      { type: "h", text: "The lazy-message trap — raise this unprompted" },
      {
        type: "p",
        text: "Here is a line that looks completely harmless and is not:",
      },
      {
        type: "code",
        language: "java",
        filename: "the cost you cannot see",
        code: `log.debug("user " + user.expensiveToString() + " has " + orders.size() + " orders");`,
      },
      {
        type: "p",
        text: "Arguments are evaluated **before** the call. So even with DEBUG switched off — even though `debug()` returns on its very first line — the concatenation and `expensiveToString()` have already run. On a hot path, called a million times, that is a million wasted strings for output nobody will ever see.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 270" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Two timelines with DEBUG switched off. In the first, the caller evaluates an expensive toString and concatenates a string, then calls debug, which returns immediately on the level check, so all the work is wasted. In the second, the caller passes a parameterised message with a placeholder and the user object, debug checks the level and returns before touching the arguments, so nothing is built. Two other fixes are listed: guarding with isDebugEnabled and passing a supplier lambda.">
  <text x="20" y="22" font-size="10.5" fill="#f06868">✗ DEBUG is OFF — and you paid for it anyway</text>
  <rect x="20" y="32" width="660" height="76" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <rect x="36" y="46" width="152" height="26" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="46" y="63" font-size="9" fill="#f06868">expensiveToString()</text>
  <text x="196" y="63" font-size="10" fill="#6b7280">→</text>
  <rect x="216" y="46" width="152" height="26" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="226" y="63" font-size="9" fill="#f06868">build the string</text>
  <text x="376" y="63" font-size="10" fill="#6b7280">→</text>
  <rect x="396" y="46" width="152" height="26" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="406" y="63" font-size="9" fill="#9099a8">debug(...) → return</text>
  <text x="36" y="96" font-size="10" fill="#f06868">every millisecond before the return was thrown away</text>

  <text x="20" y="142" font-size="10.5" fill="#5cc66f">✓ parameterised — the string is never built</text>
  <rect x="20" y="152" width="660" height="70" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <rect x="36" y="166" width="228" height="26" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="46" y="183" font-size="9" fill="#e8e4dc">debug("user {} has {} orders", u, n)</text>
  <text x="272" y="183" font-size="10" fill="#6b7280">→</text>
  <rect x="292" y="166" width="200" height="26" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="302" y="183" font-size="9" fill="#5cc66f">level check → return</text>
  <text x="504" y="183" font-size="9" fill="#5cc66f">nothing allocated</text>
  <text x="36" y="212" font-size="9.5" fill="#9099a8">substitution happens only after the event passes the gate</text>

  <text x="20" y="248" font-size="9.5" fill="#e8e4dc">two other fixes worth naming:  if (log.isDebugEnabled()) { … }   ·   log.debug(() -&gt; "user " + u)</text>
  <text x="20" y="264" font-size="9" fill="#6b7280">the guard is explicit, the supplier is lazy, the placeholder is both cheapest and tidiest</text>
</svg>`,
        caption:
          "Bringing this up before you are asked is one of the highest-value twenty seconds in the round — it says you have thought about the log call as a **hot path**, not just as a feature.",
      },

      // ---------- concurrency ----------
      { type: "h", text: "Step 6 · Threads — lock per appender, never globally" },
      {
        type: "p",
        text: "Twenty threads log at once. Two of them are halfway through writing a line to the same file, and what lands on disk is the front of one line spliced onto the back of another. So writes must be serialised — but **serialised per appender**, not across the whole framework.",
      },
      {
        type: "p",
        text: "One global lock and you have made every appender wait for the slowest one: a network sink taking 200ms stalls the console. A lock inside each appender lets the console write while the file writes while the network waits on its socket. The events themselves need no protection at all, because they are immutable. Background: [[locks-mutex-semaphore]].",
      },
      {
        type: "callout",
        variant: "info",
        title: "The registry is the one legitimately-global thing",
        text: "`LogManager.getLogger(name)` must return **the same logger object** for the same name, from any thread, forever. That is a cache: `ConcurrentHashMap.computeIfAbsent(name, ...)`. It is worth being precise here — the manager is a **registry**, not a [[singleton]] per logger. One manager, many loggers, each keyed by name. Candidates who say *“Logger is a singleton”* usually mean this and get corrected.",
      },

      // ---------- async ----------
      { type: "h", text: "Step 7 · The async appender, and the two questions after it" },
      {
        type: "p",
        text: "A network sink is slow, and right now the request thread is paying for it. The fix is a decorator: `AsyncAppender` wraps another appender, drops the event into a **bounded queue**, and returns. One writer thread drains the queue into the real appender. That is [[producer-consumer]], and mentioning it by name is free marks.",
      },
      {
        type: "p",
        text: "Then two questions arrive, and they arrive every single time.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 300" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="An async appender. Three request threads hand events into a bounded queue with a capacity of eight slots, of which six are full. One writer thread drains the queue into the slow network sink. A fork below shows the decision when the queue is full: block the caller, which keeps every event but makes logging able to stall a request, or drop and count, which protects latency but loses events, with a note that for logs dropping and counting is usually the right choice. A second note covers shutdown: close must drain the queue or the last events are lost.">
  <defs>
    <marker id="lg-q" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <rect x="12" y="34" width="112" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="24" y="51" font-size="9" fill="#e8e4dc">request thread 1</text>
  <rect x="12" y="70" width="112" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="24" y="87" font-size="9" fill="#e8e4dc">request thread 2</text>
  <rect x="12" y="106" width="112" height="26" rx="5" fill="#14161a" stroke="#2d333d"/><text x="24" y="123" font-size="9" fill="#e8e4dc">request thread 3</text>
  <text x="12" y="152" font-size="8.5" fill="#5cc66f">return in microseconds</text>

  <line x1="128" y1="47" x2="176" y2="72" stroke="#fb863a" stroke-width="1.1" marker-end="url(#lg-q)"/>
  <line x1="128" y1="83" x2="176" y2="83" stroke="#fb863a" stroke-width="1.1" marker-end="url(#lg-q)"/>
  <line x1="128" y1="119" x2="176" y2="94" stroke="#fb863a" stroke-width="1.1" marker-end="url(#lg-q)"/>

  <text x="182" y="30" font-size="9.5" fill="#fb863a">bounded queue — capacity 8</text>
  <rect x="182" y="38" width="268" height="90" rx="6" fill="#14161a" stroke="#fb863a"/>
  <rect x="194" y="70" width="28" height="26" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="226" y="70" width="28" height="26" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="258" y="70" width="28" height="26" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="290" y="70" width="28" height="26" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="322" y="70" width="28" height="26" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="354" y="70" width="28" height="26" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="386" y="70" width="28" height="26" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <rect x="418" y="70" width="28" height="26" rx="3" fill="#1a1d22" stroke="#2d333d"/>
  <text x="194" y="118" font-size="8.5" fill="#9099a8">6 of 8 used — two slots left</text>

  <line x1="452" y1="83" x2="486" y2="83" stroke="#fb863a" stroke-width="1.1" marker-end="url(#lg-q)"/>
  <rect x="492" y="60" width="104" height="46" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <text x="502" y="80" font-size="9" fill="#5e9ff6">writer thread</text>
  <text x="502" y="96" font-size="8.5" fill="#6b7280">exactly one</text>

  <line x1="600" y1="83" x2="620" y2="83" stroke="#fb863a" stroke-width="1.1" marker-end="url(#lg-q)"/>
  <rect x="626" y="60" width="86" height="46" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="636" y="80" font-size="9" fill="#e8e4dc">🌐 slow sink</text>
  <text x="636" y="96" font-size="8.5" fill="#6b7280">200 ms</text>

  <line x1="12" y1="168" x2="708" y2="168" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="12" y="190" font-size="10.5" fill="#fb863a">the queue is full. now what?</text>

  <rect x="12" y="200" width="336" height="60" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="26" y="220" font-size="9.5" fill="#e8e4dc">BLOCK the caller</text>
  <text x="26" y="238" font-size="9" fill="#5cc66f">✓ no event is ever lost</text>
  <text x="26" y="254" font-size="9" fill="#f06868">✗ logging can now stall a request</text>

  <rect x="372" y="200" width="336" height="60" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="386" y="220" font-size="9.5" fill="#5cc66f">DROP and count the drops</text>
  <text x="386" y="238" font-size="9" fill="#5cc66f">✓ the request never waits on logging</text>
  <text x="386" y="254" font-size="9" fill="#9099a8">✗ events are lost — but the counter says how many</text>

  <text x="12" y="284" font-size="9.5" fill="#e8e4dc">and on shutdown: close() must DRAIN the queue — otherwise the last events, the interesting ones, are the ones you lose</text>
</svg>`,
        caption:
          "Have an opinion on the fork. **For logs, drop and count** — a log line is worth less than the request it describes, and a counter of drops turns silent loss into a visible number. Say that, and say the opposite for an audit trail.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The shutdown question is the one people forget",
        text: "Async means events are in a queue when the process dies. If `close()` does not drain and flush, the last few seconds of logs — the seconds around the crash you are trying to debug — are exactly the ones that never reach disk. A `close()` on the `Appender` interface plus a shutdown hook is the whole answer, and it takes ten seconds to say.",
      },

      // ---------- extensibility table ----------
      { type: "h", text: "The extensibility test" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 268" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A table of change requests against files touched. Add a Slack sink: one new Appender class, zero core edits. Add an XML format: one new Formatter class, zero core edits. Add a TRACE level: one enum constant. Turn on DEBUG for one package: one configuration line, zero code. Make the network sink asynchronous: wrap it in an existing AsyncAppender, zero code. Rotate the log file daily: change only the FileAppender. Add a trace id to every line: put it in the context map, and the formatters already print it.">
  <text x="20" y="22" font-size="10.5" fill="#fb863a">the interviewer asks for one of these. count the files.</text>

  <line x1="20" y1="34" x2="680" y2="34" stroke="#3a414c"/>
  <text x="28" y="52" font-size="9.5" fill="#9099a8">CHANGE REQUEST</text>
  <text x="360" y="52" font-size="9.5" fill="#9099a8">WHAT YOU TOUCH</text>
  <text x="596" y="52" font-size="9.5" fill="#9099a8">CORE EDITS</text>
  <line x1="20" y1="60" x2="680" y2="60" stroke="#3a414c"/>

  <text x="28" y="82" font-size="9.5" fill="#e8e4dc">send errors to Slack</text>
  <text x="360" y="82" font-size="9.5" fill="#5cc66f">new SlackAppender</text>
  <text x="612" y="82" font-size="9.5" fill="#5cc66f">0</text>

  <text x="28" y="106" font-size="9.5" fill="#e8e4dc">emit XML instead of JSON</text>
  <text x="360" y="106" font-size="9.5" fill="#5cc66f">new XmlFormatter</text>
  <text x="612" y="106" font-size="9.5" fill="#5cc66f">0</text>

  <text x="28" y="130" font-size="9.5" fill="#e8e4dc">add a TRACE level</text>
  <text x="360" y="130" font-size="9.5" fill="#5cc66f">one enum constant</text>
  <text x="612" y="130" font-size="9.5" fill="#5cc66f">0</text>

  <text x="28" y="154" font-size="9.5" fill="#e8e4dc">DEBUG for one package only</text>
  <text x="360" y="154" font-size="9.5" fill="#5cc66f">one config line — no code</text>
  <text x="612" y="154" font-size="9.5" fill="#5cc66f">0</text>

  <text x="28" y="178" font-size="9.5" fill="#e8e4dc">make the network sink async</text>
  <text x="360" y="178" font-size="9.5" fill="#5cc66f">wrap it in AsyncAppender</text>
  <text x="612" y="178" font-size="9.5" fill="#5cc66f">0</text>

  <text x="28" y="202" font-size="9.5" fill="#e8e4dc">rotate the file daily</text>
  <text x="360" y="202" font-size="9.5" fill="#9099a8">inside FileAppender only</text>
  <text x="612" y="202" font-size="9.5" fill="#5cc66f">0</text>

  <text x="28" y="226" font-size="9.5" fill="#e8e4dc">a trace id on every line</text>
  <text x="360" y="226" font-size="9.5" fill="#9099a8">context map — formatters already print it</text>
  <text x="612" y="226" font-size="9.5" fill="#5cc66f">0</text>

  <line x1="20" y1="240" x2="680" y2="240" stroke="#3a414c"/>
  <text x="20" y="260" font-size="9.5" fill="#5cc66f">a column of zeros is the point — that is what “closed to modification” looks like when you can count it</text>
</svg>`,
        caption:
          "Sketch this column of zeros while you talk. It converts an abstract claim — *“my design is extensible”* — into a **number the interviewer can check**.",
      },

      // ---------- budget ----------
      { type: "h", text: "The 60 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 700 200" width="100%" style="max-width:680px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A horizontal bar dividing sixty minutes into six segments: four minutes to clarify scope, six minutes to draw the three axes, ten minutes for the Level enum and LogEvent, sixteen minutes for the Appender and Formatter interfaces with their implementations, twelve minutes for the Logger, hierarchy and registry, and twelve minutes for a runnable demo plus the concurrency and async discussion.">
  <text x="20" y="22" font-size="10.5" fill="#fb863a">60 minutes, spent in this order</text>

  <rect x="20" y="34" width="44" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="66" y="34" width="66" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="134" y="34" width="110" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="246" y="34" width="176" height="34" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <rect x="424" y="34" width="132" height="34" rx="4" fill="#14161a" stroke="#3a414c"/>
  <rect x="558" y="34" width="122" height="34" rx="4" fill="rgba(94,159,246,0.16)" stroke="#5e9ff6"/>

  <text x="26" y="56" font-size="9" fill="#fb863a">4m</text>
  <text x="72" y="56" font-size="9" fill="#fb863a">6m</text>
  <text x="140" y="56" font-size="9" fill="#e8e4dc">10m</text>
  <text x="252" y="56" font-size="9" fill="#5cc66f">16m</text>
  <text x="430" y="56" font-size="9" fill="#e8e4dc">12m</text>
  <text x="564" y="56" font-size="9" fill="#5e9ff6">12m</text>

  <text x="20" y="92" font-size="9.5" fill="#9099a8">4m   clarify — destinations, formats, per-package levels, threads</text>
  <text x="20" y="112" font-size="9.5" fill="#9099a8">6m   draw the three axes on the board and name the patterns</text>
  <text x="20" y="132" font-size="9.5" fill="#9099a8">10m  Level enum + LogEvent — small, and everything downstream depends on them</text>
  <text x="20" y="152" font-size="9.5" fill="#5cc66f">16m  Appender + Formatter interfaces and their implementations — THE core of the round</text>
  <text x="20" y="172" font-size="9.5" fill="#9099a8">12m  Logger, effective level via the parent walk, LogManager registry</text>
  <text x="20" y="192" font-size="9.5" fill="#5e9ff6">12m  main() that prints real output, then per-appender locking and the async appender</text>
</svg>`,
        caption:
          "The green block is where the marks are. If you are still explaining the Level enum at minute 25, you are behind — it is ten lines and it is not what they are grading.",
      },

      // ---------- follow-ups ----------
      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“The log file grows forever.”** → rotation inside `FileAppender`: roll when it passes a size, or at midnight, and keep the last N. Say that rotation belongs to the file appender and nothing else knows it happens.",
          "**“Why JSON instead of plain text?”** → because at scale nobody greps. One line per event with real fields lets you filter by `level`, `traceId` or `userId` without regexes that break the first time a message contains a space. Plain text stays on the console for humans.",
          "**“This log line fires ten thousand times a second.”** → sampling: keep 1 in N, and record the sampling rate so the count can be reconstructed. It belongs in a filter, not in the caller.",
          "**“I need to follow one request across all its lines.”** → the context map. Put a `traceId` in it at the edge of the request, and every formatter prints it because it is just another field on the event.",
          "**“What about secrets?”** → never log passwords, tokens or card numbers. The framework's contribution is a masking filter and the discipline of logging identifiers rather than payloads. Worth ten seconds; it is a real-world scar.",
          "**“Reload the configuration without a restart.”** → the loggers are already registry objects, so changing a level is a field write; the atom you swap is the config, not the logger. It works because the level was never baked into a `switch`.",
          "**“Two appenders both write to the same file.”** → they each have their own lock, so their own locks do not help. Either share one appender instance, or make the file itself the locked resource — a good question to answer honestly rather than hand-wave.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**One god `Logger` with a `switch`.** No interfaces, no seams, and every follow-up becomes an edit to the same method.",
          "**Levels as strings.** No ordering means no threshold, and you are back to comparing text and growing the switch.",
          "**Formatting inside the appender.** The `String.format` sits in `ConsoleAppender`, so JSON on the console means a new appender rather than a new formatter — the axes have been welded and nobody noticed.",
          "**The level check after the string is built.** Correct output, wasted work on every disabled line, and it signals you have not thought about the log call as a hot path.",
          "**A single global lock.** The slowest sink now sets the pace for all of them, and you have made logging a contention point across the whole process.",
          "**No way to add a sink without editing the core.** This is the one the whole problem exists to test. If `Logger` has to change to gain a destination, nothing else you did will rescue it.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    handsOn: [
      {
        title: "Send one event through the whole pipeline",
        body:
          "Press **ERROR**. The event passes the **threshold gate**, hits the fan-out, and lands on all three appender cards at once — one call, three writes, and the logger did not know any of the three existed. Now press **WARN**: it passes the gate just the same, but only two cards take it. The callline shows the real call each time — `log.warn(\"disk 91% full\")`.",
      },
      {
        title: "Close the gate and watch nothing get formatted",
        body:
          "The selected logger is `com.app.db.PoolManager` and the tree shows its effective level coming from `com.app.db`. Click **🏷 com.app** instead — the tree marker jumps to `root`, because `com.app` is not configured. Now set the **root threshold** to **FATAL** and press **INFO**: the gate reads **✗ DROP**, the `passed gate` counter does not move, and no card changes. Nothing was built, nothing was formatted, nothing was allocated.",
      },
      {
        title: "Make the same event look three different ways",
        body:
          "Reset the threshold to **INFO** and press **ERROR** — all three cards fill, two of them in plain text. Now flip **📄 File** to **{ } JSON** and press **ERROR** again: the same event is on screen simultaneously as a plain line and as two JSON objects. The formatter changed; the appender did not; the logger has no idea either happened.",
      },
      {
        title: "Stack the two filters",
        body:
          "Press **INFO** with the chips as they come: it passes the gate, reaches all three cards, and only **🖥 Console** (≥ DEBUG) accepts it — the other two show *✗ dropped — below its own ≥ WARN / ≥ ERROR*. Now click the console's own **≥ DEBUG** chip round to **≥ ERROR** and press **INFO** again: it still passes the gate and now lands nowhere. Two independent filters, composing without knowing about each other.",
      },
      {
        title: "Add a sink and count the edits",
        body:
          "Press **➕ Add Slack**. A fourth card slides into the fan-out and immediately receives the next event. Look at the counter in the top row: **core logger edited: 0 lines**. That zero is the entire argument for the design — and it is what [[open-closed]] means when you can measure it.",
      },
      {
        title: "Fill a bounded queue and lose events on purpose",
        body:
          "Press **🔥 Burst 20** with the network card on **⚡ sync**: twenty errors go through one at a time and the card flashes *⏳ caller blocked* on every write. Now click it to **⚡ async** and burst again — events land in a five-slot queue instantly, one writer drains it at its own pace, and the moment the queue is full the **dropped** counter starts ticking. Decide which behaviour you would ship, and be ready to defend it.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `Level` enum → `LogEvent` (all fields final) → `interface Formatter` with plain and JSON → `interface Appender` with a threshold, a formatter and its own lock → `Logger` with the parent walk for the effective level → `LogManager` with a `ConcurrentHashMap` → a `main()` that configures console-at-DEBUG-plain and file-at-WARN-JSON and logs from three different logger names. If adding a fourth sink requires editing `Logger`, start again.",
      },
    ],

    // ------------------------------------------------------------------
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "LoggingFramework.java",
        code: `import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;

/** Axis 1: WHAT gets through. Order IS the meaning — that is what makes a threshold possible. */
enum Level { TRACE, DEBUG, INFO, WARN, ERROR, FATAL }

/** The value object. Immutable, built ONCE per log call, shared by every appender. */
final class LogEvent {
    final Instant timestamp;
    final Level level;
    final String loggerName;
    final String message;
    final String threadName;
    final Throwable throwable;
    final Map<String, String> context;

    LogEvent(Level level, String loggerName, String message, Throwable throwable, Map<String, String> context) {
        this.timestamp = Instant.now();
        this.level = level;
        this.loggerName = loggerName;
        this.message = message;
        this.threadName = Thread.currentThread().getName();
        this.throwable = throwable;
        this.context = Map.copyOf(context);
    }
}

/** Axis 3: HOW it looks. One method, two implementations, zero knowledge of where it lands. */
interface Formatter { String format(LogEvent e); }

class PlainTextFormatter implements Formatter {
    public String format(LogEvent e) {
        StringBuilder sb = new StringBuilder()
            .append(e.timestamp).append(' ')
            .append(String.format("%-5s", e.level)).append(" [").append(e.threadName).append("] ")
            .append(e.loggerName).append(" - ").append(e.message);
        e.context.forEach((k, v) -> sb.append(' ').append(k).append('=').append(v));
        if (e.throwable != null) sb.append(" | ").append(e.throwable);
        return sb.toString();
    }
}

class JsonFormatter implements Formatter {
    public String format(LogEvent e) {
        StringBuilder sb = new StringBuilder("{");
        sb.append(q("ts")).append(':').append(q(e.timestamp.toString())).append(',');
        sb.append(q("level")).append(':').append(q(e.level.name())).append(',');
        sb.append(q("logger")).append(':').append(q(e.loggerName)).append(',');
        sb.append(q("thread")).append(':').append(q(e.threadName)).append(',');
        sb.append(q("msg")).append(':').append(q(e.message));
        e.context.forEach((k, v) -> sb.append(',').append(q(k)).append(':').append(q(v)));
        return sb.append('}').toString();
    }
    private static String q(String s) { return '"' + s.replace("\\"", "\\\\\\"") + '"'; }
}

/** Axis 2: WHERE it goes. Its own threshold, its own formatter, its OWN lock. */
interface Appender extends AutoCloseable {
    void append(LogEvent e);
    default void close() {}
}

abstract class AbstractAppender implements Appender {
    final String appenderName;
    private final Level threshold;
    private final Formatter formatter;
    private final Object writeLock = new Object();      // per appender — NOT global

    AbstractAppender(String appenderName, Level threshold, Formatter formatter) {
        this.appenderName = appenderName; this.threshold = threshold; this.formatter = formatter;
    }

    public final void append(LogEvent e) {
        if (e.level.ordinal() < threshold.ordinal()) return;   // second filter, composes with the logger's
        String line = formatter.format(e);                     // format OUTSIDE the lock
        synchronized (writeLock) { write(line); }              // only the write is serialised
    }

    protected abstract void write(String line);
}

class ConsoleAppender extends AbstractAppender {
    ConsoleAppender(Level threshold, Formatter formatter) { super("console", threshold, formatter); }
    protected void write(String line) { System.out.println("[console] " + line); }
}

/** Rotation lives HERE and nowhere else — nothing outside knows the file rolls. */
class FileAppender extends AbstractAppender {
    private final long maxBytes;
    private long written = 0;
    private int rollCount = 0;

    FileAppender(Level threshold, Formatter formatter, long maxBytes) {
        super("file", threshold, formatter);
        this.maxBytes = maxBytes;
    }

    protected void write(String line) {
        if (written + line.length() > maxBytes) {
            rollCount++;
            written = 0;
            System.out.println("[file] -- rolled to app.log." + rollCount + " --");
        }
        written += line.length();
        System.out.println("[file] " + line);
    }
}

class NetworkAppender extends AbstractAppender {
    NetworkAppender(Level threshold, Formatter formatter) { super("network", threshold, formatter); }
    protected void write(String line) {
        try { Thread.sleep(40); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
        System.out.println("[network] " + line);
    }
}

/** A decorator: the caller returns immediately, one writer thread drains the queue. */
class AsyncAppender implements Appender {
    private final Appender delegate;
    private final BlockingQueue<LogEvent> queue;
    private final Thread writer;
    private volatile boolean running = true;
    private int dropped = 0;

    AsyncAppender(Appender delegate, int capacity) {
        this.delegate = delegate;
        this.queue = new ArrayBlockingQueue<>(capacity);
        this.writer = new Thread(this::drain, "log-writer");
        this.writer.setDaemon(true);
        this.writer.start();
    }

    public void append(LogEvent e) {
        // FULL QUEUE POLICY: drop and count. A log line is worth less than the request it describes.
        if (!queue.offer(e)) dropped++;
    }

    private void drain() {
        while (running || !queue.isEmpty()) {
            try {
                LogEvent e = queue.poll(20, TimeUnit.MILLISECONDS);
                if (e != null) delegate.append(e);
            } catch (InterruptedException ie) { Thread.currentThread().interrupt(); return; }
        }
    }

    /** Without this, the last events — the interesting ones — never reach the sink. */
    public void close() {
        running = false;
        try { writer.join(2000); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
        delegate.close();
        System.out.println("[async] flushed; dropped=" + dropped);
    }
}

/** The logger: a threshold, a parent, and a list of appenders. It knows nothing about formats. */
class Logger {
    private final String loggerName;
    private final Logger parent;                    // null for root
    private volatile Level configured;              // null = inherit
    private final List<Appender> appenders = new CopyOnWriteArrayList<>();

    Logger(String loggerName, Logger parent) { this.loggerName = loggerName; this.parent = parent; }

    void setLevel(Level level) { this.configured = level; }
    void addAppender(Appender a) { appenders.add(a); }

    /** Chain of Responsibility: walk up until somebody is configured. */
    Level effectiveLevel() {
        for (Logger node = this; node != null; node = node.parent)
            if (node.configured != null) return node.configured;
        return Level.INFO;
    }

    boolean isEnabled(Level level) { return level.ordinal() >= effectiveLevel().ordinal(); }

    void log(Level level, String message, Throwable t, Map<String, String> context) {
        if (level.ordinal() < effectiveLevel().ordinal()) return;      // FIRST statement. nothing built yet.
        LogEvent e = new LogEvent(level, loggerName, message, t, context);   // built ONCE
        for (Logger node = this; node != null; node = node.parent)
            for (Appender a : node.appenders) a.append(e);             // the SAME object to everyone
    }

    /** Parameterised message: the substitution happens only after the gate. */
    void log(Level level, String pattern, Object... args) {
        if (level.ordinal() < effectiveLevel().ordinal()) return;
        String message = pattern;
        for (Object arg : args) message = message.replaceFirst("\\\\{\\\\}", String.valueOf(arg));
        log(level, message, null, Map.of());
    }

    void trace(String p, Object... a) { log(Level.TRACE, p, a); }
    void debug(String p, Object... a) { log(Level.DEBUG, p, a); }
    void info(String p, Object... a)  { log(Level.INFO, p, a); }
    void warn(String p, Object... a)  { log(Level.WARN, p, a); }
    void error(String p, Object... a) { log(Level.ERROR, p, a); }
}

/** A REGISTRY, not a singleton per logger: one manager, many loggers, cached by name. */
class LogManager {
    private static final Map<String, Logger> CACHE = new ConcurrentHashMap<>();
    private static final Logger ROOT = new Logger("root", null);
    static { ROOT.setLevel(Level.INFO); CACHE.put("root", ROOT); }

    static Logger root() { return ROOT; }

    static Logger getLogger(String loggerName) {
        return CACHE.computeIfAbsent(loggerName, n -> {
            int dot = n.lastIndexOf('.');
            Logger parent = dot < 0 ? ROOT : getLogger(n.substring(0, dot));
            return new Logger(n, parent);
        });
    }

    static void shutdown() { /* a real one walks every logger; here the demo closes explicitly */ }
}

public class Main {
    public static void main(String[] args) throws Exception {
        // ---- configuration: three sinks, three thresholds, two formats ----
        Logger root = LogManager.root();
        root.setLevel(Level.INFO);
        root.addAppender(new ConsoleAppender(Level.DEBUG, new PlainTextFormatter()));
        root.addAppender(new FileAppender(Level.WARN, new JsonFormatter(), 200));
        AsyncAppender net = new AsyncAppender(new NetworkAppender(Level.ERROR, new JsonFormatter()), 8);
        root.addAppender(net);

        // ---- turn on DEBUG for ONE package only ----
        LogManager.getLogger("com.app.db").setLevel(Level.DEBUG);

        Logger web  = LogManager.getLogger("com.app.web.Handler");
        Logger pool = LogManager.getLogger("com.app.db.PoolManager");

        System.out.println("web effective  = " + web.effectiveLevel());    // inherits root
        System.out.println("pool effective = " + pool.effectiveLevel());   // inherits com.app.db

        web.debug("this never appears — web inherits INFO");
        pool.debug("pool size={} idle={}", 8, 3);                          // DEBUG is on here
        web.info("user {} signed in", 42);
        pool.warn("disk {}% full", 91);
        web.error("connection refused");

        // ---- the lazy-message guard ----
        if (pool.isEnabled(Level.TRACE)) pool.trace("expensive: " + expensiveDump());

        Thread.sleep(300);
        net.close();
    }

    static String expensiveDump() { return "…a very costly string…"; }
}

/* expected output (ordering of the async lines may vary):
web effective  = INFO
pool effective = DEBUG
[console] …Z DEBUG [main] com.app.db.PoolManager - pool size=8 idle=3
[console] …Z INFO  [main] com.app.web.Handler - user 42 signed in
[console] …Z WARN  [main] com.app.db.PoolManager - disk 91% full
[file] {"ts":"…","level":"WARN","logger":"com.app.db.PoolManager","thread":"main","msg":"disk 91% full"}
[console] …Z ERROR [main] com.app.web.Handler - connection refused
[file] {"ts":"…","level":"ERROR","logger":"com.app.web.Handler","thread":"main","msg":"connection refused"}
[network] {"ts":"…","level":"ERROR","logger":"com.app.web.Handler","thread":"main","msg":"connection refused"}
[async] flushed; dropped=0
*/`,
      },
      {
        label: "Python",
        language: "python",
        filename: "logging_framework.py",
        code: `from __future__ import annotations

import json
import queue
import threading
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import IntEnum
from typing import Optional


class Level(IntEnum):
    """Axis 1: WHAT gets through. Ordered — that is what makes a threshold possible."""
    TRACE = 0
    DEBUG = 1
    INFO = 2
    WARN = 3
    ERROR = 4
    FATAL = 5


@dataclass(frozen=True)
class LogEvent:
    """Immutable, built ONCE per log call, shared by every appender."""
    timestamp: float
    level: Level
    logger_name: str
    message: str
    thread_name: str
    error: Optional[BaseException] = None
    context: dict[str, str] = field(default_factory=dict)


class Formatter(ABC):
    """Axis 3: HOW it looks."""
    @abstractmethod
    def format(self, e: LogEvent) -> str: ...


class PlainTextFormatter(Formatter):
    def format(self, e: LogEvent) -> str:
        stamp = time.strftime("%H:%M:%S", time.localtime(e.timestamp))
        ctx = "".join(" %s=%s" % (k, v) for k, v in e.context.items())
        line = "%s %-5s [%s] %s - %s%s" % (stamp, e.level.name, e.thread_name, e.logger_name, e.message, ctx)
        return line if e.error is None else line + " | " + repr(e.error)


class JsonFormatter(Formatter):
    def format(self, e: LogEvent) -> str:
        payload = {
            "ts": round(e.timestamp, 3),
            "level": e.level.name,
            "logger": e.logger_name,
            "thread": e.thread_name,
            "msg": e.message,
        }
        payload.update(e.context)
        return json.dumps(payload, separators=(",", ":"))


class Appender(ABC):
    """Axis 2: WHERE it goes. Its own threshold, its own formatter, its OWN lock."""

    def __init__(self, appender_name: str, threshold: Level, formatter: Formatter):
        self.appender_name = appender_name
        self.threshold = threshold
        self.formatter = formatter
        self._lock = threading.Lock()          # per appender — NOT global

    def append(self, e: LogEvent) -> None:
        if e.level < self.threshold:           # second filter, composes with the logger's
            return
        line = self.formatter.format(e)        # format OUTSIDE the lock
        with self._lock:                       # only the write is serialised
            self.write(line)

    @abstractmethod
    def write(self, line: str) -> None: ...

    def close(self) -> None:
        pass


class ConsoleAppender(Appender):
    def __init__(self, threshold: Level, formatter: Formatter):
        super().__init__("console", threshold, formatter)

    def write(self, line: str) -> None:
        print("[console] " + line)


class FileAppender(Appender):
    """Rotation lives HERE and nowhere else."""

    def __init__(self, threshold: Level, formatter: Formatter, max_bytes: int):
        super().__init__("file", threshold, formatter)
        self.max_bytes = max_bytes
        self._written = 0
        self._rolls = 0

    def write(self, line: str) -> None:
        if self._written + len(line) > self.max_bytes:
            self._rolls += 1
            self._written = 0
            print("[file] -- rolled to app.log.%d --" % self._rolls)
        self._written += len(line)
        print("[file] " + line)


class NetworkAppender(Appender):
    def __init__(self, threshold: Level, formatter: Formatter):
        super().__init__("network", threshold, formatter)

    def write(self, line: str) -> None:
        time.sleep(0.04)                        # the slow sink
        print("[network] " + line)


class AsyncAppender(Appender):
    """A decorator: the caller returns immediately, one writer thread drains the queue."""

    def __init__(self, delegate: Appender, capacity: int):
        super().__init__("async", Level.TRACE, delegate.formatter)
        self.delegate = delegate
        self.queue: queue.Queue[LogEvent] = queue.Queue(maxsize=capacity)
        self.dropped = 0
        self._running = True
        self._writer = threading.Thread(target=self._drain, name="log-writer", daemon=True)
        self._writer.start()

    def append(self, e: LogEvent) -> None:
        # FULL QUEUE POLICY: drop and count. A log line is worth less than the request.
        try:
            self.queue.put_nowait(e)
        except queue.Full:
            self.dropped += 1

    def write(self, line: str) -> None:         # never used — append is overridden
        pass

    def _drain(self) -> None:
        while self._running or not self.queue.empty():
            try:
                self.delegate.append(self.queue.get(timeout=0.02))
            except queue.Empty:
                continue

    def close(self) -> None:
        """Without this, the last events — the interesting ones — never reach the sink."""
        self._running = False
        self._writer.join(timeout=2)
        self.delegate.close()
        print("[async] flushed; dropped=%d" % self.dropped)


class Logger:
    """A threshold, a parent, and a list of appenders. It knows nothing about formats."""

    def __init__(self, logger_name: str, parent: Optional["Logger"]):
        self.logger_name = logger_name
        self.parent = parent
        self.configured: Optional[Level] = None       # None = inherit
        self.appenders: list[Appender] = []

    def set_level(self, level: Level) -> None:
        self.configured = level

    def add_appender(self, appender: Appender) -> None:
        self.appenders.append(appender)

    def effective_level(self) -> Level:
        """Chain of Responsibility: walk up until somebody is configured."""
        node: Optional[Logger] = self
        while node is not None:
            if node.configured is not None:
                return node.configured
            node = node.parent
        return Level.INFO

    def is_enabled(self, level: Level) -> bool:
        return level >= self.effective_level()

    def log(self, level: Level, pattern: str, *args: object, error: Optional[BaseException] = None,
            context: Optional[dict[str, str]] = None) -> None:
        if level < self.effective_level():            # FIRST statement. nothing built yet.
            return
        message = pattern
        for arg in args:                              # substitution only AFTER the gate
            message = message.replace("{}", str(arg), 1)
        e = LogEvent(time.time(), level, self.logger_name, message,
                     threading.current_thread().name, error, dict(context or {}))
        node: Optional[Logger] = self
        while node is not None:                       # the SAME object to everyone
            for appender in node.appenders:
                appender.append(e)
            node = node.parent

    def trace(self, p: str, *a: object) -> None: self.log(Level.TRACE, p, *a)
    def debug(self, p: str, *a: object) -> None: self.log(Level.DEBUG, p, *a)
    def info(self, p: str, *a: object) -> None: self.log(Level.INFO, p, *a)
    def warn(self, p: str, *a: object) -> None: self.log(Level.WARN, p, *a)
    def error_(self, p: str, *a: object) -> None: self.log(Level.ERROR, p, *a)


class LogManager:
    """A REGISTRY, not a singleton per logger: one manager, many loggers, cached by name."""
    _lock = threading.Lock()
    _root = Logger("root", None)
    _cache: dict[str, Logger] = {"root": _root}
    _root.set_level(Level.INFO)

    @classmethod
    def root(cls) -> Logger:
        return cls._root

    @classmethod
    def get_logger(cls, logger_name: str) -> Logger:
        with cls._lock:
            return cls._get(logger_name)

    @classmethod
    def _get(cls, logger_name: str) -> Logger:
        existing = cls._cache.get(logger_name)
        if existing is not None:
            return existing
        dot = logger_name.rfind(".")
        parent = cls._root if dot < 0 else cls._get(logger_name[:dot])
        created = Logger(logger_name, parent)
        cls._cache[logger_name] = created
        return created


if __name__ == "__main__":
    root = LogManager.root()
    root.set_level(Level.INFO)
    root.add_appender(ConsoleAppender(Level.DEBUG, PlainTextFormatter()))
    root.add_appender(FileAppender(Level.WARN, JsonFormatter(), max_bytes=200))
    net = AsyncAppender(NetworkAppender(Level.ERROR, JsonFormatter()), capacity=8)
    root.add_appender(net)

    LogManager.get_logger("com.app.db").set_level(Level.DEBUG)   # DEBUG for ONE package only

    web = LogManager.get_logger("com.app.web.Handler")
    pool = LogManager.get_logger("com.app.db.PoolManager")

    print("web effective  =", web.effective_level().name)
    print("pool effective =", pool.effective_level().name)

    web.debug("this never appears — web inherits INFO")
    pool.debug("pool size={} idle={}", 8, 3)
    web.info("user {} signed in", 42)
    pool.warn("disk {}% full", 91)
    web.error_("connection refused")

    if pool.is_enabled(Level.TRACE):            # the lazy-message guard
        pool.trace("expensive: " + "…a very costly string…")

    time.sleep(0.3)
    net.close()

# expected output (ordering of the async lines may vary):
# web effective  = INFO
# pool effective = DEBUG
# [console] 10:12:04 DEBUG [MainThread] com.app.db.PoolManager - pool size=8 idle=3
# [console] 10:12:04 INFO  [MainThread] com.app.web.Handler - user 42 signed in
# [console] 10:12:04 WARN  [MainThread] com.app.db.PoolManager - disk 91% full
# [file] {"ts":...,"level":"WARN","logger":"com.app.db.PoolManager","thread":"MainThread","msg":"disk 91% full"}
# [console] 10:12:04 ERROR [MainThread] com.app.web.Handler - connection refused
# [file] {"ts":...,"level":"ERROR","logger":"com.app.web.Handler","thread":"MainThread","msg":"connection refused"}
# [network] {"ts":...,"level":"ERROR","logger":"com.app.web.Handler","thread":"MainThread","msg":"connection refused"}
# [async] flushed; dropped=0`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "logging_framework.cpp",
        code: `#include <atomic>
#include <chrono>
#include <condition_variable>
#include <deque>
#include <iostream>
#include <map>
#include <memory>
#include <mutex>
#include <sstream>
#include <string>
#include <thread>
#include <vector>

// Axis 1: WHAT gets through. Ordered — that is what makes a threshold possible.
enum class Level { Trace = 0, Debug = 1, Info = 2, Warn = 3, Error = 4, Fatal = 5 };

static const char* levelName(Level l) {
    switch (l) {
        case Level::Trace: return "TRACE";
        case Level::Debug: return "DEBUG";
        case Level::Info:  return "INFO";
        case Level::Warn:  return "WARN";
        case Level::Error: return "ERROR";
        default:           return "FATAL";
    }
}

// Immutable value object, built ONCE per log call, shared by every appender.
struct LogEvent {
    long long timestampMs;
    Level level;
    std::string loggerName;
    std::string message;
    std::string threadName;
    std::map<std::string, std::string> context;
};

// Axis 3: HOW it looks.
struct Formatter {
    virtual ~Formatter() = default;
    virtual std::string format(const LogEvent& e) const = 0;
};

struct PlainTextFormatter : Formatter {
    std::string format(const LogEvent& e) const override {
        std::ostringstream out;
        out << e.timestampMs << " " << levelName(e.level) << " [" << e.threadName << "] "
            << e.loggerName << " - " << e.message;
        for (const auto& kv : e.context) out << " " << kv.first << "=" << kv.second;
        return out.str();
    }
};

struct JsonFormatter : Formatter {
    std::string format(const LogEvent& e) const override {
        std::ostringstream out;
        out << "{\\"ts\\":" << e.timestampMs
            << ",\\"level\\":\\"" << levelName(e.level) << "\\""
            << ",\\"logger\\":\\"" << e.loggerName << "\\""
            << ",\\"thread\\":\\"" << e.threadName << "\\""
            << ",\\"msg\\":\\"" << e.message << "\\"";
        for (const auto& kv : e.context) out << ",\\"" << kv.first << "\\":\\"" << kv.second << "\\"";
        out << "}";
        return out.str();
    }
};

// Axis 2: WHERE it goes. Its own threshold, its own formatter, its OWN mutex.
struct Appender {
    virtual ~Appender() = default;
    virtual void append(const LogEvent& e) = 0;
    virtual void close() {}
};

class BaseAppender : public Appender {
public:
    BaseAppender(std::string appenderName, Level threshold, std::shared_ptr<Formatter> formatter)
        : appenderName_(std::move(appenderName)), threshold_(threshold), formatter_(std::move(formatter)) {}

    void append(const LogEvent& e) override {
        if (e.level < threshold_) return;                 // second filter, composes with the logger's
        std::string line = formatter_->format(e);         // format OUTSIDE the lock
        std::lock_guard<std::mutex> guard(writeMutex_);   // per appender — NOT global
        write(line);
    }

protected:
    virtual void write(const std::string& line) = 0;
    std::string appenderName_;

private:
    Level threshold_;
    std::shared_ptr<Formatter> formatter_;
    std::mutex writeMutex_;
};

class ConsoleAppender : public BaseAppender {
public:
    ConsoleAppender(Level t, std::shared_ptr<Formatter> f) : BaseAppender("console", t, std::move(f)) {}
protected:
    void write(const std::string& line) override { std::cout << "[console] " << line << "\\n"; }
};

// Rotation lives HERE and nowhere else.
class FileAppender : public BaseAppender {
public:
    FileAppender(Level t, std::shared_ptr<Formatter> f, std::size_t maxBytes)
        : BaseAppender("file", t, std::move(f)), maxBytes_(maxBytes) {}
protected:
    void write(const std::string& line) override {
        if (written_ + line.size() > maxBytes_) {
            written_ = 0;
            std::cout << "[file] -- rolled to app.log." << ++rolls_ << " --\\n";
        }
        written_ += line.size();
        std::cout << "[file] " << line << "\\n";
    }
private:
    std::size_t maxBytes_, written_ = 0;
    int rolls_ = 0;
};

class NetworkAppender : public BaseAppender {
public:
    NetworkAppender(Level t, std::shared_ptr<Formatter> f) : BaseAppender("network", t, std::move(f)) {}
protected:
    void write(const std::string& line) override {
        std::this_thread::sleep_for(std::chrono::milliseconds(40));   // the slow sink
        std::cout << "[network] " << line << "\\n";
    }
};

// A decorator: the caller returns immediately, one writer thread drains the queue.
class AsyncAppender : public Appender {
public:
    AsyncAppender(std::shared_ptr<Appender> delegate, std::size_t capacity)
        : delegate_(std::move(delegate)), capacity_(capacity),
          worker_([this] { drain(); }) {}

    void append(const LogEvent& e) override {
        {
            std::lock_guard<std::mutex> guard(m_);
            // FULL QUEUE POLICY: drop and count.
            if (queue_.size() >= capacity_) { ++dropped_; return; }
            queue_.push_back(e);
        }
        cv_.notify_one();
    }

    // Without this, the last events — the interesting ones — never reach the sink.
    void close() override {
        { std::lock_guard<std::mutex> guard(m_); running_ = false; }
        cv_.notify_all();
        if (worker_.joinable()) worker_.join();
        delegate_->close();
        std::cout << "[async] flushed; dropped=" << dropped_ << "\\n";
    }

    ~AsyncAppender() override { if (worker_.joinable()) close(); }

private:
    void drain() {
        for (;;) {
            LogEvent e;
            {
                std::unique_lock<std::mutex> lk(m_);
                cv_.wait(lk, [this] { return !queue_.empty() || !running_; });
                if (queue_.empty()) return;
                e = queue_.front();
                queue_.pop_front();
            }
            delegate_->append(e);
        }
    }

    std::shared_ptr<Appender> delegate_;
    std::size_t capacity_;
    std::deque<LogEvent> queue_;
    std::mutex m_;
    std::condition_variable cv_;
    bool running_ = true;
    int dropped_ = 0;
    std::thread worker_;
};

// The logger: a threshold, a parent, and a list of appenders. It knows nothing about formats.
class Logger {
public:
    Logger(std::string loggerName, Logger* parent) : loggerName_(std::move(loggerName)), parent_(parent) {}

    void setLevel(Level l) { configured_ = l; hasLevel_ = true; }
    void addAppender(std::shared_ptr<Appender> a) { appenders_.push_back(std::move(a)); }

    // Chain of Responsibility: walk up until somebody is configured.
    Level effectiveLevel() const {
        for (const Logger* node = this; node; node = node->parent_)
            if (node->hasLevel_) return node->configured_;
        return Level::Info;
    }

    bool isEnabled(Level l) const { return l >= effectiveLevel(); }

    void log(Level level, const std::string& message) {
        if (level < effectiveLevel()) return;             // FIRST statement. nothing built yet.
        LogEvent e{nowMs(), level, loggerName_, message, "main", {}};   // built ONCE
        for (Logger* node = this; node; node = node->parent_)
            for (auto& a : node->appenders_) a->append(e); // the SAME object to everyone
    }

    void debug(const std::string& m) { log(Level::Debug, m); }
    void info(const std::string& m)  { log(Level::Info, m); }
    void warn(const std::string& m)  { log(Level::Warn, m); }
    void error(const std::string& m) { log(Level::Error, m); }

private:
    static long long nowMs() {
        using namespace std::chrono;
        return duration_cast<milliseconds>(steady_clock::now().time_since_epoch()).count();
    }
    std::string loggerName_;
    Logger* parent_;
    Level configured_ = Level::Info;
    bool hasLevel_ = false;
    std::vector<std::shared_ptr<Appender>> appenders_;
};

// A REGISTRY, not a singleton per logger: one manager, many loggers, cached by name.
class LogManager {
public:
    static Logger& root() { static Logger r("root", nullptr); return r; }

    static Logger& getLogger(const std::string& loggerName) {
        static std::mutex m;
        std::lock_guard<std::mutex> guard(m);
        return getUnlocked(loggerName);
    }

private:
    static Logger& getUnlocked(const std::string& loggerName) {
        static std::map<std::string, std::unique_ptr<Logger>> cache;
        auto it = cache.find(loggerName);
        if (it != cache.end()) return *it->second;
        auto dot = loggerName.rfind('.');
        Logger* parent = (dot == std::string::npos) ? &root() : &getUnlocked(loggerName.substr(0, dot));
        auto created = std::make_unique<Logger>(loggerName, parent);
        Logger& ref = *created;
        cache.emplace(loggerName, std::move(created));
        return ref;
    }
};

int main() {
    auto plain = std::make_shared<PlainTextFormatter>();
    auto json  = std::make_shared<JsonFormatter>();

    Logger& root = LogManager::root();
    root.setLevel(Level::Info);
    root.addAppender(std::make_shared<ConsoleAppender>(Level::Debug, plain));
    root.addAppender(std::make_shared<FileAppender>(Level::Warn, json, 200));
    auto net = std::make_shared<AsyncAppender>(std::make_shared<NetworkAppender>(Level::Error, json), 8);
    root.addAppender(net);

    LogManager::getLogger("com.app.db").setLevel(Level::Debug);   // DEBUG for ONE package only

    Logger& web  = LogManager::getLogger("com.app.web.Handler");
    Logger& pool = LogManager::getLogger("com.app.db.PoolManager");

    std::cout << "web effective  = " << levelName(web.effectiveLevel()) << "\\n";
    std::cout << "pool effective = " << levelName(pool.effectiveLevel()) << "\\n";

    web.debug("this never appears — web inherits INFO");
    pool.debug("pool size=8 idle=3");
    web.info("user 42 signed in");
    pool.warn("disk 91% full");
    web.error("connection refused");

    std::this_thread::sleep_for(std::chrono::milliseconds(300));
    net->close();
}

/* expected output (ordering of the async lines may vary):
web effective  = INFO
pool effective = DEBUG
[console] 1712… DEBUG [main] com.app.db.PoolManager - pool size=8 idle=3
[console] 1712… INFO [main] com.app.web.Handler - user 42 signed in
[console] 1712… WARN [main] com.app.db.PoolManager - disk 91% full
[file] {"ts":1712…,"level":"WARN","logger":"com.app.db.PoolManager","thread":"main","msg":"disk 91% full"}
[console] 1712… ERROR [main] com.app.web.Handler - connection refused
[file] {"ts":1712…,"level":"ERROR","logger":"com.app.web.Handler","thread":"main","msg":"connection refused"}
[network] {"ts":1712…,"level":"ERROR","logger":"com.app.web.Handler","thread":"main","msg":"connection refused"}
[async] flushed; dropped=0
*/`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "logging-framework.ts",
        code: `// Axis 1: WHAT gets through. Ordered — that is what makes a threshold possible.
export enum Level { TRACE = 0, DEBUG = 1, INFO = 2, WARN = 3, ERROR = 4, FATAL = 5 }

const LEVEL_NAME = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"];

/** Immutable value object, built ONCE per log call, shared by every appender. */
export interface LogEvent {
  readonly timestamp: number;
  readonly level: Level;
  readonly loggerName: string;
  readonly message: string;
  readonly threadName: string;
  readonly error?: Error;
  readonly context: Readonly<Record<string, string>>;
}

/** Axis 3: HOW it looks. */
export interface Formatter {
  format(e: LogEvent): string;
}

export class PlainTextFormatter implements Formatter {
  format(e: LogEvent): string {
    const stamp = new Date(e.timestamp).toISOString().slice(11, 23);
    const ctx = Object.entries(e.context).map(([k, v]) => " " + k + "=" + v).join("");
    const head = stamp + " " + LEVEL_NAME[e.level].padEnd(5) + " [" + e.threadName + "] ";
    return head + e.loggerName + " - " + e.message + ctx;
  }
}

export class JsonFormatter implements Formatter {
  format(e: LogEvent): string {
    return JSON.stringify({
      ts: new Date(e.timestamp).toISOString(),
      level: LEVEL_NAME[e.level],
      logger: e.loggerName,
      thread: e.threadName,
      msg: e.message,
      ...e.context,
    });
  }
}

/** Axis 2: WHERE it goes. Its own threshold, its own formatter. */
export interface Appender {
  append(e: LogEvent): void;
  close(): Promise<void> | void;
}

export abstract class BaseAppender implements Appender {
  constructor(
    readonly appenderName: string,
    readonly threshold: Level,
    readonly formatter: Formatter,
  ) {}

  append(e: LogEvent): void {
    if (e.level < this.threshold) return;   // second filter, composes with the logger's
    this.write(this.formatter.format(e));
  }

  protected abstract write(line: string): void;

  close(): void {}
}

export class ConsoleAppender extends BaseAppender {
  constructor(threshold: Level, formatter: Formatter) { super("console", threshold, formatter); }
  protected write(line: string): void { console.log("[console] " + line); }
}

/** Rotation lives HERE and nowhere else. */
export class FileAppender extends BaseAppender {
  private written = 0;
  private rolls = 0;

  constructor(threshold: Level, formatter: Formatter, private readonly maxBytes: number) {
    super("file", threshold, formatter);
  }

  protected write(line: string): void {
    if (this.written + line.length > this.maxBytes) {
      this.rolls += 1;
      this.written = 0;
      console.log("[file] -- rolled to app.log." + this.rolls + " --");
    }
    this.written += line.length;
    console.log("[file] " + line);
  }
}

export class NetworkAppender extends BaseAppender {
  constructor(threshold: Level, formatter: Formatter) { super("network", threshold, formatter); }
  protected write(line: string): void { console.log("[network] " + line); }
}

/** A decorator: the caller returns immediately, a drain loop empties a BOUNDED queue. */
export class AsyncAppender implements Appender {
  private readonly pending: LogEvent[] = [];
  private draining = false;
  dropped = 0;

  constructor(private readonly delegate: Appender, private readonly capacity: number) {}

  append(e: LogEvent): void {
    // FULL QUEUE POLICY: drop and count. A log line is worth less than the request.
    if (this.pending.length >= this.capacity) { this.dropped += 1; return; }
    this.pending.push(e);
    if (!this.draining) { this.draining = true; queueMicrotask(() => this.drain()); }
  }

  private drain(): void {
    while (this.pending.length > 0) this.delegate.append(this.pending.shift() as LogEvent);
    this.draining = false;
  }

  /** Without this, the last events — the interesting ones — never reach the sink. */
  close(): void {
    this.drain();
    this.delegate.close();
    console.log("[async] flushed; dropped=" + this.dropped);
  }
}

/** The logger: a threshold, a parent, and a list of appenders. It knows nothing about formats. */
export class Logger {
  private configured: Level | null = null;      // null = inherit
  private readonly appenders: Appender[] = [];

  constructor(readonly loggerName: string, readonly parent: Logger | null) {}

  setLevel(level: Level): void { this.configured = level; }
  addAppender(appender: Appender): void { this.appenders.push(appender); }

  /** Chain of Responsibility: walk up until somebody is configured. */
  effectiveLevel(): Level {
    for (let node: Logger | null = this; node !== null; node = node.parent) {
      if (node.configured !== null) return node.configured;
    }
    return Level.INFO;
  }

  isEnabled(level: Level): boolean { return level >= this.effectiveLevel(); }

  log(level: Level, pattern: string, ...args: unknown[]): void {
    if (level < this.effectiveLevel()) return;  // FIRST statement. nothing built yet.
    let message = pattern;
    for (const arg of args) message = message.replace("{}", String(arg));  // only AFTER the gate
    const e: LogEvent = {
      timestamp: Date.now(),
      level,
      loggerName: this.loggerName,
      message,
      threadName: "main",
      context: {},
    };
    for (let node: Logger | null = this; node !== null; node = node.parent) {
      for (const appender of node.appenders) appender.append(e);   // the SAME object to everyone
    }
  }

  trace(p: string, ...a: unknown[]): void { this.log(Level.TRACE, p, ...a); }
  debug(p: string, ...a: unknown[]): void { this.log(Level.DEBUG, p, ...a); }
  info(p: string, ...a: unknown[]): void { this.log(Level.INFO, p, ...a); }
  warn(p: string, ...a: unknown[]): void { this.log(Level.WARN, p, ...a); }
  error(p: string, ...a: unknown[]): void { this.log(Level.ERROR, p, ...a); }
}

/** A REGISTRY, not a singleton per logger: one manager, many loggers, cached by name. */
export class LogManager {
  private static readonly ROOT = new Logger("root", null);
  private static readonly CACHE = new Map<string, Logger>([["root", LogManager.ROOT]]);

  static root(): Logger { return LogManager.ROOT; }

  static getLogger(loggerName: string): Logger {
    const cached = LogManager.CACHE.get(loggerName);
    if (cached) return cached;
    const dot = loggerName.lastIndexOf(".");
    const parent = dot < 0 ? LogManager.ROOT : LogManager.getLogger(loggerName.slice(0, dot));
    const created = new Logger(loggerName, parent);
    LogManager.CACHE.set(loggerName, created);
    return created;
  }
}

// ---------------------------------------------------------------- demo
function main(): void {
  const plain = new PlainTextFormatter();
  const json = new JsonFormatter();

  const root = LogManager.root();
  root.setLevel(Level.INFO);
  root.addAppender(new ConsoleAppender(Level.DEBUG, plain));
  root.addAppender(new FileAppender(Level.WARN, json, 200));
  const net = new AsyncAppender(new NetworkAppender(Level.ERROR, json), 8);
  root.addAppender(net);

  LogManager.getLogger("com.app.db").setLevel(Level.DEBUG);   // DEBUG for ONE package only

  const web = LogManager.getLogger("com.app.web.Handler");
  const pool = LogManager.getLogger("com.app.db.PoolManager");

  console.log("web effective  = " + LEVEL_NAME[web.effectiveLevel()]);
  console.log("pool effective = " + LEVEL_NAME[pool.effectiveLevel()]);

  web.debug("this never appears — web inherits INFO");
  pool.debug("pool size={} idle={}", 8, 3);
  web.info("user {} signed in", 42);
  pool.warn("disk {}% full", 91);
  web.error("connection refused");

  if (pool.isEnabled(Level.TRACE)) pool.trace("expensive: …a very costly string…");

  net.close();
}

main();

/* expected output:
web effective  = INFO
pool effective = DEBUG
[console] 10:12:04.117 DEBUG [main] com.app.db.PoolManager - pool size=8 idle=3
[console] 10:12:04.118 INFO  [main] com.app.web.Handler - user 42 signed in
[console] 10:12:04.118 WARN  [main] com.app.db.PoolManager - disk 91% full
[file] {"ts":"…","level":"WARN","logger":"com.app.db.PoolManager","thread":"main","msg":"disk 91% full"}
[console] 10:12:04.119 ERROR [main] com.app.web.Handler - connection refused
[file] {"ts":"…","level":"ERROR","logger":"com.app.web.Handler","thread":"main","msg":"connection refused"}
[network] {"ts":"…","level":"ERROR","logger":"com.app.web.Handler","thread":"main","msg":"connection refused"}
[async] flushed; dropped=0
*/`,
      },
    ],

    // ------------------------------------------------------------------
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Strip the logging away and this is **one event, three independent decisions, three interfaces**: a filter that decides whether the event lives, a set of sinks that decide where it goes, and a rendering step that decides what it looks like. Once you can see that shape, you find it everywhere — and you find it welded together everywhere too.",
      },
      {
        type: "ul",
        items: [
          "**Metrics and tracing** — the same pipeline with different payloads: a sampler instead of a threshold, exporters instead of appenders, wire formats instead of layouts.",
          "**Notification systems** — one event, N channels (email, SMS, push), each with its own audience filter and its own template. Identical structure, different nouns.",
          "**Audit trails** — same fan-out, but the full-queue answer flips from *drop* to *block*, because losing an audit record is not acceptable.",
          "**Analytics event pipelines** — collect, filter, enrich, fan out to several destinations in several encodings.",
          "**Any render step at all** — the moment you catch yourself putting `String.format` inside the thing that does the I/O, you are welding axis three onto axis two.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The three-sentence version to say out loud",
        text: "*“Levels are an ordered enum so one comparison filters everything, and that comparison runs before anything is built. The logger builds one immutable event and fans it out to a list of appenders, so a new sink is a new class and no edit. Each appender owns its own threshold, its own formatter and its own lock, so where it goes, what it looks like and how it is serialised all vary independently.”* Twenty-five seconds, and it is the whole design.",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When throughput is extreme.** At millions of events a second, even building the `LogEvent` object is too much allocation. Real frameworks go to ring buffers and object reuse — which trades away the immutability you just relied on. Know the trade; do not build it in an interview.",
          "**When ordering across appenders must be exact.** An async appender reorders events relative to the synchronous ones. If a downstream consumer needs a strict global order, async is off the table or needs sequence numbers.",
          "**When logs are the system of record.** Dropping on a full queue is right for diagnostics and wrong for anything you will be audited on. Then you block, or you write to a durable local queue first.",
          "**When configuration must change constantly.** Per-package levels solve *“debug this component”*. They do not solve *“sample 1% of this specific customer's traffic”* — that wants a filter chain evaluated per event, which is a bigger design.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**Three axes, three interfaces, never welded.** *Whether* is an ordered level and a comparison that runs first. *Where* is an `Appender` you can add without editing anything. *What it looks like* is a `Formatter` the appender holds but does not know. Every follow-up in this round is answered by pointing at one of those three.",
      },
    ],

    // ------------------------------------------------------------------
    tradeoffs: {
      pros: [
        "Three orthogonal interfaces mean N sinks and M formats cost N+M classes instead of N×M branches, and a new destination is one new class with zero edits to the core.",
        "An ordered level enum turns the entire filtering rule into a single comparison that runs before any allocation, so disabled log lines cost almost nothing.",
        "Hierarchical logger names let two lines of configuration control the level of thousands of loggers, and let you enable DEBUG for one package without drowning in the rest.",
        "One immutable LogEvent per call, shared by every appender, means every sink agrees on the timestamp and the object is safe to hand across threads without copying.",
        "A per-appender lock keeps writes non-interleaved while still letting a fast console and a slow network sink proceed in parallel.",
      ],
      cons: [
        "The layered version is genuinely more code than the one-class logger, and for a script that prints to stdout the extra structure earns nothing.",
        "The parent walk on every log call costs a few pointer hops; real frameworks cache the resolved level and then have to invalidate that cache when configuration changes.",
        "Async appenders break the ordering between sinks and can lose events on a hard crash, so the diagnostics you most want are the ones most at risk.",
        "Allocating a LogEvent per call is fine at normal rates and is exactly the thing that stops being fine at extreme throughput, where reuse and ring buffers take over.",
        "Per-appender locking silently fails when two appender instances point at the same file — the lock protects the object, not the resource.",
      ],
    },

    // ------------------------------------------------------------------
    furtherReading: [
      {
        label: "Log4j 2 — Architecture",
        href: "https://logging.apache.org/log4j/2.x/manual/architecture.html",
        kind: "docs",
        note: "The reference implementation of exactly this design: LoggerContext, Logger, Appender, Layout and Filter, with the object diagram spelled out.",
      },
      {
        label: "Logback — Appenders",
        href: "https://logback.qos.ch/manual/appenders.html",
        kind: "docs",
        note: "Every appender variant you might be asked about, including rolling file policies and the async appender's discarding behaviour under a full queue.",
      },
      {
        label: "SLF4J FAQ — parameterised messages and the logging facade",
        href: "https://www.slf4j.org/faq.html",
        kind: "docs",
        note: "The canonical explanation of why the placeholder form beats string concatenation, and what a facade over several backends actually buys.",
      },
      {
        label: "Log4j 2 — Asynchronous Loggers",
        href: "https://logging.apache.org/log4j/2.x/manual/async.html",
        kind: "article",
        note: "What the queue-and-writer-thread idea looks like at production scale, including the trade-offs of dropping versus blocking.",
      },
      {
        label: "Python logging HOWTO",
        href: "https://docs.python.org/3/howto/logging.html",
        kind: "docs",
        note: "The same three axes under different names — levels, handlers, formatters — plus the clearest write-up of hierarchical logger name resolution.",
      },
      {
        label: "The Twelve-Factor App — Logs",
        href: "https://12factor.net/logs",
        kind: "article",
        note: "The argument that an application should emit an event stream and never manage log files, which is the boundary you name as out of scope.",
      },
      {
        label: "OpenTelemetry — Logs specification",
        href: "https://opentelemetry.io/docs/specs/otel/logs/",
        kind: "spec",
        note: "The modern structured-log data model: exactly the LogEvent fields from this lesson, standardised, with trace correlation built in.",
      },
    ],

    // ------------------------------------------------------------------
    quiz: [
      {
        id: "logging-framework-q1",
        question: "Why must log levels be an ordered enum rather than strings?",
        options: [
          { id: "a", label: "Because ordering makes a threshold possible — the whole filter becomes one comparison, `level.ordinal() < threshold.ordinal()`." },
          { id: "b", label: "Because enums are faster to compare than strings." },
          { id: "c", label: "Because strings cannot be used as map keys in most languages." },
          { id: "d", label: "Because an enum guarantees the level names are spelled correctly." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) and (d) are true but trivial, which is what makes them tempting. The real reason is structural: without an ordering there is no notion of \"at least this severe\", so you fall back to a switch that grows a branch for every level and cannot express a threshold at all.",
      },
      {
        id: "logging-framework-q2",
        question: "The interviewer says: *“now also send errors to Slack, as JSON, but only in production.”* In a correctly layered design, what do you touch?",
        options: [
          { id: "a", label: "One new SlackAppender class plus one configuration line — the existing JsonFormatter is reused and the Logger is not edited at all." },
          { id: "b", label: "The Logger class, to add a `toSlack` flag and a Slack branch." },
          { id: "c", label: "The JsonFormatter, to add a Slack-specific output mode." },
          { id: "d", label: "A new Logger subclass that overrides `log()` to also post to Slack." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the question the whole problem exists to ask. (d) is the subtle wrong answer — subclassing the Logger still couples the destination to the core type, so two extra sinks mean an inheritance tangle. A destination is an Appender, and adding one should cost zero edits.",
      },
      {
        id: "logging-framework-q3",
        question: "`log.debug(\"user \" + user.expensiveToString())` runs with DEBUG switched off. What actually happens?",
        options: [
          { id: "a", label: "The expensive call and the concatenation both run, then `debug()` returns immediately on its level check — all the work is wasted." },
          { id: "b", label: "Nothing runs, because the logger skips the call when DEBUG is off." },
          { id: "c", label: "The string is built lazily and discarded before evaluation." },
          { id: "d", label: "It throws, because the level does not match." },
        ],
        correctOptionId: "a",
        explanation:
          "Arguments are evaluated before the call — the logger never gets a chance to prevent it. That is why the fixes are all about not building the string: a parameterised message, an `isDebugEnabled()` guard, or a supplier lambda. Raising this unprompted is one of the highest-value moments in the round.",
      },
      {
        id: "logging-framework-q4",
        question: "A logger named `com.app.db.PoolManager` has no configured level. `com.app.db` is set to DEBUG and root is set to INFO. What is its effective level, and what pattern is that?",
        options: [
          { id: "a", label: "DEBUG — it walks up to the nearest configured ancestor and stops there, which is Chain of Responsibility." },
          { id: "b", label: "INFO — the root always wins, since it is the ultimate authority." },
          { id: "c", label: "DEBUG — because the most permissive level anywhere in the tree applies." },
          { id: "d", label: "It has no level, so nothing from that logger is ever emitted." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) reaches the right answer for the wrong reason and would break the moment an ancestor was stricter than a descendant. The rule is nearest-configured-ancestor, not most-permissive — which is exactly why setting DEBUG on one package does not affect any other.",
      },
      {
        id: "logging-framework-q5",
        question: "Where should the level check happen relative to formatting the message?",
        options: [
          { id: "a", label: "Before — the check must be the first statement, so a disabled line costs one integer comparison and no allocation." },
          { id: "b", label: "After — you need the formatted line to know what level it is." },
          { id: "c", label: "It does not matter; the output is identical either way." },
          { id: "d", label: "Inside the formatter, so each format can decide its own threshold." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) is the tempting one because the *output* really is identical — the difference is cost. Format-then-filter pays the full price of every disabled line, which on a hot path is the difference between logging being free and logging being your profile's top entry.",
      },
      {
        id: "logging-framework-q6",
        question: "Should the framework take one global lock, or a lock per appender?",
        options: [
          { id: "a", label: "One lock per appender — writes to a single sink must not interleave, but a slow network sink must not block the console." },
          { id: "b", label: "One global lock — it is simpler and logging is not performance-critical." },
          { id: "c", label: "No locks at all — the LogEvent is immutable, so nothing needs protecting." },
          { id: "d", label: "One lock per logger, since loggers are what the application calls." },
        ],
        correctOptionId: "a",
        explanation:
          "(c) is half right and dangerously so: the event needs no protection, but the *sink* does — two threads writing to one file will splice partial lines. The resource being protected is the output stream, so the lock belongs to the appender that owns it.",
      },
      {
        id: "logging-framework-q7",
        question: "An async appender's bounded queue is full. What should `append()` do, and why?",
        options: [
          { id: "a", label: "Drop the event and increment a counter — a log line is worth less than the request it describes, and the counter makes the loss visible." },
          { id: "b", label: "Block the caller until a slot frees up, because no log event should ever be lost." },
          { id: "c", label: "Grow the queue, since memory is cheap." },
          { id: "d", label: "Write the event synchronously instead, bypassing the queue." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is defensible and is the right answer for an audit trail — the point is to have a reasoned opinion, not a reflex. (c) is the genuinely wrong one: an unbounded queue turns a slow sink into an out-of-memory crash, which is why the queue is bounded in the first place.",
      },
      {
        id: "logging-framework-q8",
        question: "Why should the LogEvent be built once and handed to every appender, rather than built per appender?",
        options: [
          { id: "a", label: "So all sinks agree on one timestamp and one snapshot of context — building per appender gives one line three different times." },
          { id: "b", label: "Because object creation is expensive and one is cheaper than three." },
          { id: "c", label: "Because appenders are allowed to mutate the event." },
          { id: "d", label: "Because the formatter caches events by identity." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is true and is the wrong reason to lead with — correctness beats cost here. Three timestamps for one event makes your console and your file disagree about when something happened, which is exactly the confusion you are trying to avoid at 3am. And (c) is inverted: the event is immutable *so that* sharing it is safe.",
      },
    ],
  },
};
