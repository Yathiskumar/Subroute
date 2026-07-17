import type { RoadmapLesson } from "@/lib/content/types";

export const command: RoadmapLesson = {
  title: "Command",
  oneLiner:
    "Turn a request into a stand-alone object. Instead of a button flipping the light directly, pressing it creates a `LightOnCommand` object that wraps the action and the device it acts on. Because the action is now an *object*, you can store it on a history stack, undo it, queue it for later, or log it — the remote never needs to know what any button actually does.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/command.html",
  content: {
    prototypeCaption:
      "A **smart-home remote** wired up with the Command pattern. Press **💡 Light on**, **💡 Light off**, or **🌡 Heat +** on the remote (left) and watch the two-hop: a command card (`LightOnCommand`, `ThermostatUpCommand`…) pops onto the **history stack** in the middle *first*, and only then does the device on the right react — the bulb lights up, the temperature ticks. That middle hop *is* the pattern: the button never touches the device; it builds an object that does. Now press **⎌ Undo** — the top card pops off the stack and the device reverses (light back off, temp back down), unwinding in exact reverse order. The stack holds at most 6 commands (oldest drops off — a bounded undo depth, just like real editors). The `history: N` chip counts what's undoable.",

    overview: [
      {
        type: "p",
        text: "**Command** turns a request into a **stand-alone object** — so instead of *calling* an action, you *create* an object that represents the action, and execute it whenever (and wherever) you like. In one sentence: wrap a request as an object so you can **parameterize** callers with it, **queue** it, **log** it, and **undo** it. Think of a smart-home remote: pressing a button doesn't flip the light directly. The press creates a `LightOnCommand` object that bundles *what to do* (turn on) with *what to do it to* (the living-room light). The remote just says `execute()` — it has no idea whether that means a light, a thermostat, or the garage door.",
      },
      {
        type: "p",
        text: "The classic analogy is a **restaurant order slip**. You tell the waiter what you want, and the waiter doesn't cook — they write your request on a slip and hand it to the kitchen. That slip is a command object: it captures the request, it can sit in a queue on the kitchen rail, the chef picks it up when ready, it can be cancelled, and at the end of the night the stack of slips is a *log* of everything that happened. The moment a request becomes a physical *thing* rather than a fleeting function call, all of that becomes possible.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Command makes an action a **first-class object** with an `execute()` (and usually an `undo()`) method. Anything you can do with an object — store it, pass it around, put it on a stack, replay it — you can now do with an *action*.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The superpower is the history stack",
        text: "Once every action is an object that knows how to reverse itself, **undo is almost free**: keep executed commands on a stack, and undo is just `history.pop().undo()`. This is exactly how editors, drawing apps, and IDEs implement Ctrl+Z.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The four players" },
      {
        type: "p",
        text: "The pattern splits 'a button press turns on a light' into four small roles. The split looks like ceremony at first, but each role is what unlocks one of the pattern's powers:",
      },
      {
        type: "ul",
        items: [
          "**Command interface** — the tiny contract every action signs: `execute()` and (for undoable systems) `undo()`. This is all the invoker ever sees.",
          "**Concrete commands** — one small class per action: `LightOnCommand`, `LightOffCommand`, `ThermostatUpCommand`. Each one holds a reference to its receiver and knows how to perform *and reverse* exactly one request.",
          "**Receiver** — the object that does the real work: the `Light`, the `Thermostat`. It has ordinary methods (`turnOn()`, `up()`) and knows nothing about commands at all.",
          "**Invoker** — the remote button (or menu item, or job queue worker). It holds *some* command and calls `execute()` on it. It never knows the concrete class — swap which command a button holds and the button's behaviour changes without touching the button.",
        ],
      },
      {
        type: "p",
        text: "The **client** (your setup code) wires it all together: it creates the receivers, creates concrete commands around them, and hands those commands to the invoker. Notice how this echoes [[dependency-injection-and-ioc]] — the button is *given* its behaviour from outside rather than hard-coding it.",
      },
      { type: "h", text: "How undo works" },
      {
        type: "p",
        text: "Each command knows how to reverse *itself*: `LightOnCommand.undo()` turns the light back off; `ThermostatUpCommand.undo()` steps the temperature back down. The invoker keeps a **history stack** — every executed command gets pushed on top. Undo pops the most recent command and calls its `undo()`, which unwinds actions in exact reverse order. Redo, if you want it, is a second stack of undone commands. Real systems cap the stack (say, the last 100 actions), so the oldest commands eventually fall off and can no longer be undone — the prototype's 6-slot stack shows this honestly.",
      },
      {
        type: "code",
        language: "typescript",
        code: `interface Command {
  execute(): void;
  undo(): void;
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}   // wraps action + receiver
  execute() { this.light.turnOn(); }
  undo()    { this.light.turnOff(); }    // knows its own reverse
}

class RemoteButton {                     // invoker
  private history: Command[] = [];
  press(cmd: Command) {
    cmd.execute();                       // run the request...
    this.history.push(cmd);              // ...and remember it
  }
  undo() {
    this.history.pop()?.undo();          // reverse the latest one
  }
}`,
      },
      {
        type: "p",
        text: "Look at what `RemoteButton` *doesn't* know: no `if (button === 'light')` branching, no reference to `Light` or `Thermostat`, no knowledge of what any command does. It just tells the command to execute — a clean example of [[tell-dont-ask]] at the object level. All the device-specific knowledge lives inside the concrete commands.",
      },
      { type: "h", text: "You've already met this pattern" },
      {
        type: "ul",
        items: [
          "**Editor undo/redo** — every keystroke, deletion, and format change is a command on a stack; Ctrl+Z pops and reverses it.",
          "**Job and task queues** — a background job is a serialized command: created now, queued, executed later by a worker that only knows the `run()` interface.",
          "**Transactional operations** — each step of a multi-step operation is a command with a compensating `undo()`, so a failure can roll everything back in reverse.",
          "**GUI buttons and menu items** — 'Copy' in the toolbar, the Edit menu, and Ctrl+C all hold *the same* command object; one action, three invokers.",
          "**Macro recording** — record the commands a user performs into a list, then replay the list to repeat the whole sequence.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Watch the two-hop",
        body: "Press 💡 Light on once and watch closely: a LightOnCommand card pops onto the history stack in the middle first, and only then does the bulb on the right light up. The button never touched the light — it built an object, and the object did the work. Press 🌡 Heat + and watch a ThermostatUpCommand do the same for the thermostat.",
      },
      {
        title: "02 · Fill the stack",
        body: "Mix presses — 💡 Light on, 🌡 Heat + a few times, 💡 Light off — and watch the history: N chip climb as cards pile on top. Keep going past six presses: the stack is full, so the oldest card drops off the bottom. That command can no longer be undone — you've just discovered why real editors have a bounded undo depth.",
      },
      {
        title: "03 · Unwind with Undo",
        body: "Now press ⎌ Undo repeatedly. Each press pops the top card and reverses exactly that action — light back off, temperature back down — in perfect reverse order, until the stack is empty. Press ⎌ Undo once more on the empty stack: nothing breaks, there is simply nothing left to reverse. Hit ↺ Reset and replay any sequence you like.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "smart-home.ts",
        code: `// Receivers — the devices that do the real work.
class Light {
  on = false;
  turnOn()  { this.on = true; }
  turnOff() { this.on = false; }
}
class Thermostat {
  temp = 20;
  up()   { this.temp++; }
  down() { this.temp--; }
}

// Command — every action signs this tiny contract.
interface Command {
  execute(): void;
  undo(): void;
}

// Concrete commands — wrap ONE action + its receiver.
class LightOnCommand implements Command {
  constructor(private light: Light) {}
  execute() { this.light.turnOn(); }
  undo()    { this.light.turnOff(); }     // its own reverse
}
class ThermostatUpCommand implements Command {
  constructor(private t: Thermostat) {}
  execute() { this.t.up(); }
  undo()    { this.t.down(); }
}

// Invoker — knows only the interface, keeps history for undo.
class Remote {
  private history: Command[] = [];
  press(cmd: Command) { cmd.execute(); this.history.push(cmd); }
  undo() { this.history.pop()?.undo(); }  // pop + reverse
}

// Client wires it together.
const light = new Light();
const remote = new Remote();
remote.press(new LightOnCommand(light));  // light.on === true
remote.undo();                            // light.on === false`,
      },
      {
        label: "Java",
        language: "java",
        filename: "SmartHome.java",
        code: `import java.util.*;

// Receiver — does the real work, knows nothing about commands.
class Light {
    boolean on = false;
    void turnOn()  { on = true; }
    void turnOff() { on = false; }
}

// Command — the contract every action signs.
interface Command {
    void execute();
    void undo();
}

// Concrete command — wraps one action + its receiver.
class LightOnCommand implements Command {
    private final Light light;
    LightOnCommand(Light light) { this.light = light; }
    public void execute() { light.turnOn(); }
    public void undo()    { light.turnOff(); }   // its own reverse
}

// Invoker — knows only the interface, keeps history for undo.
class Remote {
    private final Deque<Command> history = new ArrayDeque<>();
    void press(Command cmd) {
        cmd.execute();
        history.push(cmd);                        // remember it
    }
    void undo() {
        if (!history.isEmpty()) history.pop().undo();
    }
}

// Client:
// Light light = new Light();
// Remote remote = new Remote();
// remote.press(new LightOnCommand(light));  // light.on == true
// remote.undo();                            // light.on == false`,
      },
      {
        label: "Python",
        language: "python",
        filename: "smart_home.py",
        code: `from abc import ABC, abstractmethod

# Receiver — does the real work, knows nothing about commands.
class Light:
    def __init__(self):
        self.on = False
    def turn_on(self):  self.on = True
    def turn_off(self): self.on = False

# Command — the contract every action signs.
class Command(ABC):
    @abstractmethod
    def execute(self): ...
    @abstractmethod
    def undo(self): ...

# Concrete command — wraps one action + its receiver.
class LightOnCommand(Command):
    def __init__(self, light: Light):
        self.light = light
    def execute(self): self.light.turn_on()
    def undo(self):    self.light.turn_off()   # its own reverse

# Invoker — knows only the interface, keeps history for undo.
class Remote:
    def __init__(self):
        self.history: list[Command] = []
    def press(self, cmd: Command):
        cmd.execute()
        self.history.append(cmd)                # remember it
    def undo(self):
        if self.history:
            self.history.pop().undo()           # pop + reverse

light = Light()
remote = Remote()
remote.press(LightOnCommand(light))   # light.on -> True
remote.undo()                         # light.on -> False`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "smart_home.cpp",
        code: `#include <memory>
#include <vector>

// Receiver — does the real work, knows nothing about commands.
class Light {
public:
    bool on = false;
    void turnOn()  { on = true; }
    void turnOff() { on = false; }
};

// Command — the contract every action signs.
class Command {
public:
    virtual ~Command() = default;
    virtual void execute() = 0;
    virtual void undo() = 0;
};

// Concrete command — wraps one action + its receiver.
class LightOnCommand : public Command {
    Light& light;
public:
    explicit LightOnCommand(Light& l) : light(l) {}
    void execute() override { light.turnOn(); }
    void undo() override    { light.turnOff(); }  // its own reverse
};

// Invoker — knows only the interface, keeps history for undo.
class Remote {
    std::vector<std::unique_ptr<Command>> history;
public:
    void press(std::unique_ptr<Command> cmd) {
        cmd->execute();
        history.push_back(std::move(cmd));        // remember it
    }
    void undo() {
        if (history.empty()) return;
        history.back()->undo();                   // reverse latest
        history.pop_back();
    }
};

// Light light; Remote remote;
// remote.press(std::make_unique<LightOnCommand>(light)); // on == true
// remote.undo();                                          // on == false`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Command when the request itself needs a life of its own" },
      {
        type: "p",
        text: "The tell-tale sign is that you need to do something with an action *besides just running it right now*:",
      },
      {
        type: "ul",
        items: [
          "**Undo / redo** — the flagship use. Keep executed commands on a stack; each knows how to reverse itself, so Ctrl+Z is a pop and an `undo()`.",
          "**Queues and scheduling** — create a request now, run it later (or elsewhere). Background jobs, thread pools, and task schedulers all pass command-shaped objects to workers that only know `run()`.",
          "**Decoupling the trigger from the action** — toolbar button, menu item, and keyboard shortcut all hold the *same* command object; UI elements become interchangeable holders of behaviour instead of hard-coding it.",
          "**Macros, logging, and replay** — a list of commands is a recording. Replay it for macros, write it to disk as an audit log, or re-run it to recover state after a crash.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When NOT to use it",
        text: "If a button just needs to call a method — no history, no queue, no undo, no swapping behaviour at runtime — then a **plain direct call is better**. Wrapping every method call in a command class is pure ceremony: you pay the class-per-action tax and get none of the powers. Add the pattern when a concrete need (undo, queueing, logging) shows up, not before.",
      },
    ],

    tradeoffs: {
      pros: [
        "Undo/redo nearly for free — each command reverses itself, so a history stack gives you Ctrl+Z with a pop and an undo() call.",
        "Decouples invoker from receiver — the button knows only execute(), so you can rewire what a button does without touching the button, and reuse one command from many triggers.",
        "Actions become data — commands can be queued, scheduled, serialized, logged, and replayed, which is impossible with a bare method call.",
        "Easy to extend and compose — add a new action by adding one small class (open/closed), or build a macro command that runs a whole list of commands as one.",
      ],
      cons: [
        "Class proliferation — every distinct action becomes its own class, so a big app can accumulate dozens of tiny command classes (lambdas/closures soften this in modern languages).",
        "Indirection tax — a simple 'call this method' now takes an interface, a concrete class, and an invoker; readers must hop through layers to find what actually happens.",
        "Undo is only as correct as each command's undo() — reversing stateful or side-effecting actions (sent emails, API calls) can be hard or impossible, and one buggy undo corrupts the whole history.",
        "History has real costs — storing commands (and any state snapshots they need for undo) consumes memory, which is why undo stacks are capped and old commands become unrecoverable.",
      ],
    },

    furtherReading: [
      {
        label: "Command — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/command",
        note: "The best illustrated walkthrough: the problem (a toolbar with hard-coded buttons), the four participants, the restaurant-order analogy, and code in many languages. Read this first.",
        kind: "article",
      },
      {
        label: "Command — Game Programming Patterns (Bob Nystrom)",
        href: "https://gameprogrammingpatterns.com/command.html",
        note: "A famously readable chapter (free online) that builds Command from a game's input handler up to full undo/redo — the clearest explanation of why 'a request as an object' matters in practice.",
        kind: "book",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Command among the behavioral patterns. The primary source for the formal intent, structure, and participants.",
        kind: "book",
      },
      {
        label: "The Command Pattern in Java — Baeldung",
        href: "https://www.baeldung.com/java-command-pattern",
        note: "A compact Java implementation of the pattern, including the modern take: using lambdas and method references as lightweight commands instead of one class per action.",
        kind: "article",
      },
      {
        label: "Command pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Command_pattern",
        note: "Concise reference covering terminology (command, receiver, invoker, client), the undo mechanism, and a long list of real uses from GUI buttons to transactional behaviour and wizards.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "command-q1",
        question: "What is the core intent of the Command pattern?",
        options: [
          { id: "a", label: "Turn a request into a stand-alone object, so it can be parameterized, queued, logged, and undone." },
          { id: "b", label: "Guarantee that a class has exactly one instance with a global access point." },
          { id: "c", label: "Let subclasses decide which concrete class to instantiate." },
          { id: "d", label: "Convert one interface into another that clients expect." },
        ],
        correctOptionId: "a",
        explanation:
          "Command reifies a request: the action plus its receiver get wrapped in an object with execute()/undo(). Once the action is an object, you can store, queue, log, and reverse it. Option (b) is Singleton, (c) is Factory Method, (d) is Adapter.",
      },
      {
        id: "command-q2",
        question: "In the smart-home example, which object actually knows HOW to turn the light on?",
        options: [
          { id: "a", label: "The receiver (the Light) — the command just tells it to; the remote knows nothing at all." },
          { id: "b", label: "The remote button, which contains the light-switching logic." },
          { id: "c", label: "The history stack, which replays stored logic." },
          { id: "d", label: "The Command interface, which implements turnOn() for all devices." },
        ],
        correctOptionId: "a",
        explanation:
          "The real work lives in the receiver: Light.turnOn(). The concrete command (LightOnCommand) merely bundles that call with a reference to the light, and the invoker (remote) only ever calls execute() on the interface. That layering is exactly what decouples the button from the device.",
      },
      {
        id: "command-q3",
        question: "How does undo typically work in the Command pattern?",
        options: [
          { id: "a", label: "Executed commands are pushed onto a history stack; undo pops the top command and calls its undo(), which reverses that specific action." },
          { id: "b", label: "The invoker takes a snapshot of the entire application before every call and restores it." },
          { id: "c", label: "The receiver remembers every method ever called on it and replays them backwards automatically." },
          { id: "d", label: "Undo is impossible with Command — you need a separate pattern for it." },
        ],
        correctOptionId: "a",
        explanation:
          "Each concrete command knows its own reverse (LightOnCommand.undo() turns the light off). The invoker records executed commands on a stack, so undo is history.pop().undo() — unwinding actions in exact reverse order. That is how editors implement Ctrl+Z.",
      },
      {
        id: "command-q4",
        question: "The remote button holds a Command but never knows its concrete class. What does that buy you?",
        options: [
          { id: "a", label: "You can rewire what any button does — or drive the same command from a menu, shortcut, or queue — without changing the button code." },
          { id: "b", label: "It makes execute() run faster because the class is unknown." },
          { id: "c", label: "It guarantees the command can never fail." },
          { id: "d", label: "Nothing — the invoker must always know the concrete command class to call it." },
        ],
        correctOptionId: "a",
        explanation:
          "Because the invoker depends only on the Command interface, behaviour is injected rather than hard-coded: swap the command a button holds and the button does something else; give the same command object to a toolbar button, a menu item, and a shortcut and they all trigger one action. That decoupling is the pattern's structural payoff.",
      },
      {
        id: "command-q5",
        question: "When is Command the WRONG choice?",
        options: [
          { id: "a", label: "When a caller just needs to invoke a method directly, with no need for history, queueing, logging, or swapping behaviour at runtime." },
          { id: "b", label: "When you need undo/redo in a text editor." },
          { id: "c", label: "When background jobs must be created now and executed later by a worker." },
          { id: "d", label: "When a toolbar button and a menu item must share the same action." },
        ],
        correctOptionId: "a",
        explanation:
          "If none of the pattern's powers are needed, wrapping a plain call in an interface, a concrete class, and an invoker is pure ceremony — you pay the class-per-action cost and gain nothing. Options (b), (c), and (d) are the pattern's flagship use cases.",
      },
    ],
  },
};
