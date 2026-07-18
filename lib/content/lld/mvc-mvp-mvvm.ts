import type { RoadmapLesson } from "@/lib/content/types";

export const mvcMvpMvvm: RoadmapLesson = {
  title: "MVC / MVP / MVVM",
  oneLiner:
    "Three sibling patterns that all split an app into a *Model* (the data + rules), a *View* (what you see), and a *middle coordinator* that keeps them in sync — so your business logic never gets tangled up in buttons and pixels. Think of a **restaurant**: the kitchen (Model) cooks, the dining room (View) is what the guest sees, and a *waiter* stands between them. MVC, MVP, and MVVM just argue about *who the waiter is* and *which way the plates flow*.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/mvc-mvp-mvvm.html",
  content: {
    prototypeCaption:
      "A tiny **temperature app** — a 📦 *Model* holding one number in °C, a 🖼 *View* that shows it, and a ＋1°C button. Flip between the **MVC**, **MVP**, and **MVVM** tabs, then press ＋1°C and watch *which arrows light up*. In **MVC** the View pokes the Controller, the Controller writes the Model, and the View reads the Model back. In **MVP** the View is dumb — it only ever talks *through* the Presenter, which pushes the finished text back to it. In **MVVM** one glowing ⇄ *binding* arrow does the work both ways automatically — notice the **\"glue you wrote\"** counter stays at **0**. Same app, same number; the only thing that changes is who carries the plates.",

    overview: [
      {
        type: "p",
        text: "Put a database call inside a button's click handler and your app rots fast: you can't test the logic without clicking, you can't reuse it on another screen, and one change ripples everywhere. **MVC**, **MVP**, and **MVVM** are three cures for the same disease. All three split your app into three parts: a **Model** (the data and the rules that guard it), a **View** (the buttons and pixels the user sees), and a **middle coordinator** that shuttles between them. The Model never touches the screen; the View never touches the database. That separation is the whole point — it's [[separation-of-concerns]] applied to UI.",
      },
      {
        type: "p",
        text: "Picture a **restaurant**. The *kitchen* is the Model — it holds the food and the recipes, and it doesn't care who's sitting at table 5. The *dining room* is the View — plates, menus, the stuff the guest actually sees. Between them stands a *waiter* who carries orders one way and dishes the other. The kitchen and the dining room never speak directly. That waiter is the middle coordinator — and MVC, MVP, and MVVM are simply three different waiters with three different sets of rules.",
      },
      {
        type: "p",
        text: "So what's actually different? Just **who the middle guy is** and **which way data flows**. In **MVC** the *Controller* takes your input and the View reads the Model itself. In **MVP** a *Presenter* does everything and hands finished results back to a totally passive View. In **MVVM** a *ViewModel* exposes state that the View is *bound* to, so a change on either side updates the other with no code you wrote. The trend across the three: the View gets progressively dumber and you write less and less manual wiring.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "All three separate a passive **Model** from a **View** via a middle coordinator; the only differences are *who the coordinator is* (Controller → Presenter → ViewModel) and *how the View learns about changes* — in **MVC** the View reads the Model, in **MVP** the Presenter pushes to the View, and in **MVVM** a two-way **data binding** syncs them automatically.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've already used all three",
        text: "Wrote a Rails, Django, or Spring controller? That's **MVC**. Built an old Android or WinForms screen with a Presenter and a passive view interface? That's **MVP**. Used Angular's `[(ngModel)]`, Vue's `v-model`, WPF, SwiftUI, or Jetpack Compose? The framework handed you **MVVM** with data binding built in.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three roles they all share" },
      {
        type: "p",
        text: "Before the differences, the common skeleton. Every one of the three has these three parts:",
      },
      {
        type: "ul",
        items: [
          "**Model** — the data plus the rules that protect it (a temperature, a user, a shopping cart, and the logic that says what's valid). It is *passive* about the UI: it never imports a button, never draws a pixel. It just holds truth.",
          "**View** — everything the user sees and touches: labels, text fields, buttons. Its job is to *display* and to *capture raw input*. How much thinking it's allowed to do is exactly what separates the three patterns.",
          "**The middle coordinator** — the piece that connects the two so they never touch directly. This is the Controller, the Presenter, or the ViewModel. Renaming this box and rewiring its arrows is *the entire difference* between MVC, MVP, and MVVM.",
        ],
      },
      {
        type: "figure",
        caption: "Same three roles, three different wirings — the View gets dumber left to right.",
        svg: `<svg viewBox="0 0 720 250" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,monospace" role="img" aria-label="Three diagrams comparing MVC, MVP and MVVM data flow between Model, coordinator, and View">
  <g fill="#e8e4dc" font-size="13">
    <text x="120" y="24" text-anchor="middle" fill="#fb863a" font-size="14">MVC</text>
    <text x="360" y="24" text-anchor="middle" fill="#fb863a" font-size="14">MVP</text>
    <text x="600" y="24" text-anchor="middle" fill="#fb863a" font-size="14">MVVM</text>
  </g>
  <!-- MVC column -->
  <g font-size="11" fill="#e8e4dc" text-anchor="middle">
    <rect x="70" y="40" width="100" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="120" y="61">📦 Model</text>
    <rect x="70" y="100" width="100" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="120" y="121">🧭 Controller</text>
    <rect x="70" y="160" width="100" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="120" y="181">🖼 View</text>
  </g>
  <g stroke="#9099a8" fill="none">
    <line x1="120" y1="160" x2="120" y2="136" marker-end="url(#a)"/>
    <line x1="120" y1="100" x2="120" y2="76" marker-end="url(#a)"/>
    <path d="M148 160 C 190 130 190 100 148 74" stroke="#fb863a" marker-end="url(#o)"/>
  </g>
  <text x="205" y="120" fill="#9099a8" font-size="9" text-anchor="middle" transform="rotate(90 205 120)">View reads Model</text>
  <!-- MVP column -->
  <g font-size="11" fill="#e8e4dc" text-anchor="middle">
    <rect x="310" y="40" width="100" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="360" y="61">📦 Model</text>
    <rect x="310" y="100" width="100" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="360" y="121">🧭 Presenter</text>
    <rect x="310" y="160" width="100" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="360" y="181">🖼 View</text>
  </g>
  <g stroke="#9099a8" fill="none">
    <line x1="352" y1="160" x2="352" y2="136" marker-end="url(#a)"/>
    <line x1="368" y1="136" x2="368" y2="160" marker-end="url(#a)"/>
    <line x1="360" y1="100" x2="360" y2="76" marker-end="url(#a)"/>
    <line x1="360" y1="76" x2="360" y2="100" marker-end="url(#a)"/>
  </g>
  <text x="430" y="150" fill="#9099a8" font-size="9" text-anchor="middle">via interface</text>
  <!-- MVVM column -->
  <g font-size="11" fill="#e8e4dc" text-anchor="middle">
    <rect x="550" y="40" width="100" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="600" y="61">📦 Model</text>
    <rect x="550" y="100" width="100" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="600" y="121">🧭 ViewModel</text>
    <rect x="550" y="160" width="100" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
    <text x="600" y="181">🖼 View</text>
  </g>
  <g stroke="#9099a8" fill="none">
    <line x1="600" y1="100" x2="600" y2="76" marker-end="url(#a)"/>
    <line x1="592" y1="160" x2="592" y2="136" stroke="#fb863a" marker-end="url(#o)"/>
    <line x1="608" y1="136" x2="608" y2="160" stroke="#fb863a" marker-end="url(#o)"/>
  </g>
  <text x="655" y="150" fill="#fb863a" font-size="9" text-anchor="middle">⇄ binding</text>
  <defs>
    <marker id="a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9099a8"/></marker>
    <marker id="o" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fb863a"/></marker>
  </defs>
</svg>`,
      },
      { type: "h", text: "MVC — the Controller takes input, the View reads the Model" },
      {
        type: "p",
        text: "**Model-View-Controller** is the classic, and the oldest (Smalltalk, 1979). The flow: the user acts on the *View*, the **Controller** receives that input, decides what it means, and updates the **Model**. The Model changes, and the **View reads the Model** to redraw itself. The key move is that the View is allowed to look at the Model directly — it pulls the data it needs. The Controller is mostly a router for input.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class TempModel { celsius = 20; }                 // data + rules

class TempController {
  constructor(private model: TempModel) {}
  onPlusClicked() { this.model.celsius += 1; }    // input → update Model
}

class TempView {
  constructor(private model: TempModel) {}
  render() { return \`\${this.model.celsius}°C\`; }  // View READS the Model itself
}`,
      },
      {
        type: "p",
        text: "This is what server frameworks give you — **Rails, Django, Spring MVC, Laravel, ASP.NET MVC**. A request hits a controller action, the action touches the model, and a template (the view) renders from that model. It fits the request/response web perfectly: each click is a fresh round trip.",
      },
      { type: "h", text: "MVP — the Presenter does everything, the View is passive" },
      {
        type: "p",
        text: "**Model-View-Presenter** makes the View as *dumb as possible*. The View captures a click and immediately forwards it: `presenter.onPlusClicked()`. It contains **no logic** — it doesn't read the Model, doesn't format anything, doesn't decide anything. The **Presenter** holds all of that. It updates the Model, formats the result, and **pushes the finished value back** to the View by calling methods on a small *View interface* like `view.showTemperature(\"21°C\")`.",
      },
      {
        type: "code",
        language: "typescript",
        code: `interface TempView {                      // the ONLY door the Presenter uses
  showTemperature(text: string): void;
}

class TempPresenter {
  constructor(private model: TempModel, private view: TempView) {}
  onPlusClicked() {
    this.model.celsius += 1;               // update the Model
    this.view.showTemperature(\`\${this.model.celsius}°C\`); // PUSH result to View
  }
}`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "Why MVP is the testable one",
        text: "Because the View is just an interface the Presenter talks to, you can write a *fake* View in a unit test — call `presenter.onPlusClicked()` and assert the fake received `\"21°C\"`. No screen, no framework, no clicking. That's why classic **Android (pre-Jetpack)** and **WinForms** teams loved MVP.",
      },
      { type: "h", text: "MVVM — data binding syncs the View and ViewModel for you" },
      {
        type: "p",
        text: "**Model-View-ViewModel** removes the manual push entirely. The **ViewModel** exposes *bindable* state — an observable `temperatureText` property. The View declares, once, that its label is *bound* to that property. From then on, **two-way data binding** keeps them in sync automatically: change the ViewModel and the label updates itself; type in a bound text field and the ViewModel updates itself. You write *no glue code* to copy values back and forth — the framework does it.",
      },
      {
        type: "code",
        language: "typescript",
        code: `class TempViewModel {
  private model = new TempModel();
  temperatureText = observable(\`\${this.model.celsius}°C\`); // bindable state

  increment() {
    this.model.celsius += 1;
    this.temperatureText.set(\`\${this.model.celsius}°C\`);   // binding auto-updates the View
  }
}
// In the view template:  <label text="{bind temperatureText}" />  ← no push code`,
      },
      {
        type: "p",
        text: "This is the modern default because frameworks ship the binding engine: **WPF/XAML** (where MVVM was coined), **Angular**, **Vue**, **Knockout**, **SwiftUI**, and **Jetpack Compose**. You describe *what* the UI should reflect, not *when* to update it.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The through-line: the View keeps getting dumber",
        text: "MVC → MVP → MVVM is one story told three times, each time moving more work out of the View. In MVC the View still reads the Model. In MVP the View knows nothing and is fed by the Presenter. In MVVM the View doesn't even get fed — it's *bound*, and updates happen with no wiring you wrote. Less manual glue at every step.",
      },
      { type: "h", text: "A quick side-by-side" },
      {
        type: "ul",
        items: [
          "**Who's the middleman?** MVC → Controller · MVP → Presenter · MVVM → ViewModel.",
          "**How does the View get updated?** MVC → it *reads the Model* · MVP → the Presenter *pushes* to it via an interface · MVVM → *data binding* updates it automatically.",
          "**How smart is the View?** MVC → medium (reads Model, some logic) · MVP → dumb (pure interface) · MVVM → declarative (just bindings).",
          "**Coupling of View↔coordinator?** MVC → Controller doesn't reference the View much · MVP → Presenter holds a View interface reference · MVVM → ViewModel doesn't even know the View exists (it just exposes observable state).",
          "**Where you meet it:** MVC → Rails, Django, Spring · MVP → old Android, WinForms · MVVM → WPF, Angular, Vue, SwiftUI, Compose.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Trace the MVC round trip",
        body: "Make sure the MVC tab is selected. Press ＋1°C in the View box. Watch the arrows light up in order: View → Controller (you told the controller), Controller → Model (it bumped the number), then Model → View (the View re-reads the Model to redraw). The shared temperature ticks up by one. Notice the explain line: the View had to reach back to the Model itself.",
      },
      {
        title: "02 · See the passive View in MVP",
        body: "Switch to the MVP tab and press ＋1°C. Now the flow is View → Presenter (the View just forwards the click), Presenter → Model (update), then Presenter → View (the Presenter pushes the finished '°C' text back through the view interface). The View never touched the Model — it only ever spoke to the Presenter. Watch the 'glue you wrote' counter tick up: in MVP you hand-wire every push.",
      },
      {
        title: "03 · Watch binding do the work in MVVM",
        body: "Switch to the MVVM tab and press ＋1°C. One glowing ⇄ arrow between View and ViewModel pulses both directions — that's two-way data binding. The ViewModel updates the Model, and the bound label refreshes with zero push code. Check the 'glue you wrote' counter: it stays at 0. Hit ↺ Reset any time to set the temperature back to 20°C and clear the counters.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "mvc.ts",
        code: `// ---- MVC: Controller takes input, View reads the Model ----

class TempModel {
  celsius = 20;                              // data + the rule that guards it
  bump(delta: number) { this.celsius += delta; }
}

class TempController {                        // the middleman: routes input
  constructor(private model: TempModel) {}
  onPlus() { this.model.bump(1); }           // input → update Model
}

class TempView {
  constructor(private model: TempModel, private ctrl: TempController) {}
  clickPlus() { this.ctrl.onPlus(); }        // View tells the Controller
  render(): string {
    return \`\${this.model.celsius}°C\`;        // View READS the Model directly
  }
}

const model = new TempModel();
const ctrl = new TempController(model);
const view = new TempView(model, ctrl);

view.clickPlus();
console.log(view.render());                  // "21°C"`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Mvp.java",
        code: `// ---- MVP: Presenter does everything, View is a passive interface ----

class TempModel {
    int celsius = 20;                        // data + rules
    void bump(int d) { celsius += d; }
}

interface TempView {                          // the ONLY door the Presenter uses
    void showTemperature(String text);
}

class TempPresenter {
    private final TempModel model;
    private final TempView view;
    TempPresenter(TempModel m, TempView v) { this.model = m; this.view = v; }

    void onPlus() {
        model.bump(1);                        // update the Model
        view.showTemperature(model.celsius + "°C");  // PUSH result to the View
    }
}

class ConsoleView implements TempView {       // a concrete (or fake, for tests) View
    public void showTemperature(String text) { System.out.println(text); }
}

class Demo {
    public static void main(String[] args) {
        TempModel model = new TempModel();
        ConsoleView view = new ConsoleView();
        TempPresenter presenter = new TempPresenter(model, view);
        presenter.onPlus();                   // prints "21°C" — View stayed dumb
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "mvvm.py",
        code: `# ---- MVVM: data binding syncs View and ViewModel automatically ----

class Observable:                              # a tiny bindable value
    def __init__(self, value):
        self._value = value
        self._subscribers = []

    def get(self): return self._value
    def set(self, v):
        self._value = v
        for cb in self._subscribers:           # binding: push to everyone bound
            cb(v)

    def bind(self, cb):                         # the View binds once...
        self._subscribers.append(cb)
        cb(self._value)


class TempModel:
    def __init__(self): self.celsius = 20


class TempViewModel:
    def __init__(self):
        self._model = TempModel()
        self.temperature_text = Observable(f"{self._model.celsius}°C")

    def increment(self):
        self._model.celsius += 1
        self.temperature_text.set(f"{self._model.celsius}°C")  # binding updates the View


vm = TempViewModel()
# The "View" just binds a label — no manual push code anywhere:
vm.temperature_text.bind(lambda text: print(f"label shows: {text}"))
vm.increment()   # label shows: 20°C  → then automatically: label shows: 21°C`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "mvc.cpp",
        code: `// ---- MVC: Controller takes input, View reads the Model ----
#include <iostream>
#include <string>

struct TempModel {
    int celsius = 20;                          // data + rules
    void bump(int d) { celsius += d; }
};

class TempController {                          // the middleman: routes input
    TempModel& model;
public:
    explicit TempController(TempModel& m) : model(m) {}
    void onPlus() { model.bump(1); }           // input → update Model
};

class TempView {
    TempModel& model;
    TempController& ctrl;
public:
    TempView(TempModel& m, TempController& c) : model(m), ctrl(c) {}
    void clickPlus() { ctrl.onPlus(); }        // View tells the Controller
    std::string render() {                     // View READS the Model directly
        return std::to_string(model.celsius) + "\\u00B0C";
    }
};

int main() {
    TempModel model;
    TempController ctrl(model);
    TempView view(model, ctrl);
    view.clickPlus();
    std::cout << view.render() << "\\n";        // "21°C"
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for..." },
      {
        type: "ul",
        items: [
          "**MVC** — when you're building a **server-rendered, request/response** app. Each click is a round trip: controller handles the request, touches the model, renders a template. Rails, Django, Spring, Laravel, and ASP.NET MVC are all built around it.",
          "**MVP** — when the View *must be dumb and unit-tested*. If you need to verify presentation logic without spinning up a screen (a fake view interface in a test), MVP's passive View is exactly the shape you want. Classic for legacy Android and desktop WinForms/GWT.",
          "**MVVM** — when your **framework gives you data binding**. If you're in WPF, Angular, Vue, SwiftUI, or Jetpack Compose, lean into the ViewModel and let bindings erase the glue code. Fighting the binding engine to do MVP by hand is wasted effort.",
        ],
      },
      { type: "h", text: "Which to pick / skip when..." },
      {
        type: "ul",
        items: [
          "**The app is tiny** — a one-screen toy doesn't need any of them. A Model plus a click handler is fine; adding a Presenter is ceremony with no payoff. Reach for a pattern when logic grows.",
          "**No binding engine? Don't fake MVVM.** Two-way binding by hand is fiddly and leaky. Without framework support, MVP (explicit pushes) is usually cleaner and easier to follow than a homegrown binding layer.",
          "**Don't mix the roles.** The moment SQL or business rules leak into the View, or the Model starts importing UI widgets, you've lost the [[separation-of-concerns]] that made you pick a pattern at all.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Separation of concerns — the Model (data + rules) stays free of UI, so business logic is reusable across screens and independently testable.",
        "Testability, especially in MVP and MVVM — the coordinator holds the logic and can be tested with a fake or headless View, no clicking required.",
        "Parallel work — once the interfaces are set, one person can build the View while another builds the Model and coordinator.",
        "Less glue over time — MVVM's data binding erases the manual copy-values-back-and-forth code that MVC and MVP require.",
      ],
      cons: [
        "Overhead for small apps — three roles plus interfaces is real boilerplate that a trivial screen doesn't earn back.",
        "MVP can get chatty — the Presenter needs a method on the View interface for every little UI update, which balloons on complex screens.",
        "MVVM binding is hard to debug — 'why did this update?' hides inside the framework's binding engine, and leaky bindings can cause subtle bugs and memory leaks.",
        "Blurry boundaries in practice — teams argue endlessly over what belongs in the Controller vs Model vs View, and the lines drift as the app grows.",
      ],
    },

    furtherReading: [
      {
        label: "GUI Architectures — Martin Fowler",
        href: "https://martinfowler.com/eaaDev/uiArchs.html",
        note: "The definitive deep history of MVC, MVP, Presentation Model, and the ideas MVVM grew from — traces exactly why each variant moved logic out of the View. The canonical reference.",
        kind: "article",
      },
      {
        label: "Model–view–controller — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller",
        note: "Concise reference on MVC's origins (Smalltalk-79), its three components, and how it relates to MVP and MVVM. Good for the shared vocabulary.",
        kind: "docs",
      },
      {
        label: "Model–view–viewmodel — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel",
        note: "Covers MVVM's WPF origins, the role of the binder/data binding, and the ViewModel as a 'model of the view'. Explains why binding is the defining feature.",
        kind: "docs",
      },
      {
        label: "Guide to app architecture — Android Developers",
        href: "https://developer.android.com/topic/architecture",
        note: "Google's modern take: a ViewModel-centered, unidirectional-data-flow architecture. Shows MVVM applied in a real, current framework (and why they moved off MVP).",
        kind: "docs",
      },
      {
        label: "The Model-View-ViewModel Pattern — Microsoft Learn",
        href: "https://learn.microsoft.com/en-us/dotnet/architecture/maui/mvvm",
        note: "A practical, code-first walkthrough of MVVM: ViewModel responsibilities, data binding, and commands — from the platform where MVVM was invented.",
        kind: "docs",
      },
      {
        label: "MVC, MVP and MVVM — clear comparison (video)",
        href: "https://www.youtube.com/watch?v=nWSk4X2Ae5Q",
        note: "A short, visual side-by-side of the three patterns and how their data flow differs. Handy if you learn better by watching the arrows move.",
        kind: "video",
      },
    ],

    quiz: [
      {
        id: "mvc-q1",
        question: "What do MVC, MVP, and MVVM all have in common?",
        options: [
          { id: "a", label: "They separate a passive Model (data + rules) from a View (UI) using a middle coordinator, so business logic stays out of the UI." },
          { id: "b", label: "They all require two-way data binding between the View and the data." },
          { id: "c", label: "They all make the View read the Model directly." },
          { id: "d", label: "They guarantee a class has exactly one instance." },
        ],
        correctOptionId: "a",
        explanation:
          "The shared skeleton is Model + View + a middle coordinator that keeps data and logic out of the UI. The differences are only in who that coordinator is and how the View gets updated. Two-way binding (b) is specific to MVVM, reading the Model directly (c) is MVC's move, and (d) is Singleton.",
      },
      {
        id: "mvc-q2",
        question: "Which of the three patterns uses two-way data binding to sync the View and the coordinator automatically?",
        options: [
          { id: "a", label: "MVVM — the ViewModel exposes bindable state and binding keeps View and ViewModel in sync with no manual glue." },
          { id: "b", label: "MVC — the Controller binds the Model to the View." },
          { id: "c", label: "MVP — the Presenter binds itself to the View." },
          { id: "d", label: "All three use data binding equally." },
        ],
        correctOptionId: "a",
        explanation:
          "Data binding is MVVM's defining feature: the View is bound to observable ViewModel state, so changes flow both ways automatically. MVC relies on the View reading the Model, and MVP relies on the Presenter explicitly pushing values through a View interface — neither uses automatic binding.",
      },
      {
        id: "mvc-q3",
        question: "In MVP, who does the View talk to, and how much logic does the View contain?",
        options: [
          { id: "a", label: "The View talks only to the Presenter (through an interface) and contains no logic — the Presenter updates the Model and pushes results back." },
          { id: "b", label: "The View talks directly to the Model and formats everything itself." },
          { id: "c", label: "The View binds to the Presenter's observable properties." },
          { id: "d", label: "The View talks to the Controller, which reads the Model." },
        ],
        correctOptionId: "a",
        explanation:
          "MVP makes the View as passive as possible: it forwards raw input to the Presenter and exposes a small interface the Presenter calls to display results. All logic lives in the Presenter, which is why you can unit-test it with a fake View. Reading the Model directly (b) is MVC, and binding (c) is MVVM.",
      },
      {
        id: "mvc-q4",
        question: "In classic MVC, how does the View learn about a change after the Controller updates the Model?",
        options: [
          { id: "a", label: "The View reads the Model itself to redraw — the Controller handles input, but the View pulls data from the Model." },
          { id: "b", label: "The Controller pushes the formatted value back to the View through an interface." },
          { id: "c", label: "A binding engine updates the View with no code." },
          { id: "d", label: "The Model imports the View and redraws it directly." },
        ],
        correctOptionId: "a",
        explanation:
          "In MVC the Controller routes input and updates the Model, and the View reads the Model to render itself. Pushing through an interface (b) is MVP, automatic binding (c) is MVVM, and (d) violates the whole point — the Model stays passive and never touches the UI.",
      },
      {
        id: "mvc-q5",
        question: "What is the overall trend as you move from MVC to MVP to MVVM?",
        options: [
          { id: "a", label: "The View gets progressively dumber and you write less manual wiring — from the View reading the Model, to being pushed to, to being auto-bound." },
          { id: "b", label: "The Model gets progressively smarter and takes over the UI." },
          { id: "c", label: "Each variant adds more manual glue code than the last." },
          { id: "d", label: "The patterns get slower and less testable in that order." },
        ],
        correctOptionId: "a",
        explanation:
          "The through-line is that responsibility keeps leaving the View: MVC's View still reads the Model, MVP's View is fed by the Presenter, and MVVM's View is simply bound. Each step removes manual wiring — the opposite of (c) — while the Model stays passive throughout.",
      },
      {
        id: "mvc-q6",
        question: "You're building a server-rendered app where each user click is an HTTP request that returns a rendered page. Which pattern fits most naturally?",
        options: [
          { id: "a", label: "MVC — a controller action handles the request, updates the model, and renders a template (view) from it." },
          { id: "b", label: "MVVM — you need a two-way binding engine for request/response." },
          { id: "c", label: "MVP — because HTTP requires a passive view interface." },
          { id: "d", label: "None of them work on the server." },
        ],
        correctOptionId: "a",
        explanation:
          "The request/response cycle maps directly onto MVC: the controller receives the request, updates the model, and a template renders from the model — exactly how Rails, Django, and Spring MVC work. MVVM's binding shines in long-lived client UIs, not stateless round trips, and MVP's testable passive view isn't what HTTP calls for.",
      },
    ],
  },
};
