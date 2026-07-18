import type { RoadmapLesson } from "@/lib/content/types";

export const composite: RoadmapLesson = {
  title: "Composite",
  oneLiner:
    "Compose objects into tree structures, and let clients treat a single object and a whole group of objects exactly the same way. A file and a folder both answer `size()` — the file returns its own number, the folder asks each of its children and adds the answers up. The caller never needs to know which one it's talking to.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/composite.html",
  content: {
    prototypeCaption:
      "A live **file tree**. Every row — file or folder — carries the *same* `size()` chip; that uniformity is the whole pattern. Click `size()` on a file and it simply flashes back its own number. Click `size()` on a folder and watch the call **ripple down the subtree**: each child lights up in turn, floats its answer back, and the folder shows the summed total in a green badge. One call at the top, recursion does everything below. Select any folder and use **＋ File** / **＋ Folder** to grow the tree — then call `size()` again and see the new nodes join the cascade with zero extra code.",

    overview: [
      {
        type: "p",
        text: "**Composite** solves a very common shape of problem: your objects naturally form a **tree**. A folder holds files *and other folders*. A UI panel holds buttons *and other panels*. An order holds products *and bundles of products*. The pattern's intent fits in one sentence: **compose objects into tree structures, and treat individual objects and compositions of objects uniformly.**",
      },
      {
        type: "p",
        text: "Think of your computer's file system. A file has a size. A folder has a size too — it's just the sum of everything inside it. When you right-click a folder and pick *Properties*, you don't care that it contains 3 files here, a nested folder there, and more files inside that. You ask **one** question — 'how big is this?' — and get **one** answer. Composite makes your code work the same way: both `File` and `Folder` implement one shared interface (say, `FileSystemItem` with a `size()` method), so any code that can handle one item can automatically handle an entire tree of them.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A **Leaf** does the work itself; a **Composite** just forwards the same call to its children and combines the results. Because both share one interface, the client can't tell — and doesn't need to tell — a single object from a whole tree.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The magic ingredient is recursion",
        text: "You never write a loop that 'walks the whole tree'. You write `Folder.size()` as *ask each child for its size and add them up*. If a child is a file, it answers directly. If a child is another folder, the very same method runs again one level down. The tree walks itself.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three participants" },
      {
        type: "p",
        text: "Every Composite setup has the same three roles. Once you can name them, you can spot the pattern anywhere:",
      },
      {
        type: "ul",
        items: [
          "**Component** — the shared interface, e.g. `FileSystemItem` with `size()`. This is the *only* type client code ever talks to. It declares the operations that make sense for both single items and groups.",
          "**Leaf** — a plain end object with no children, e.g. `File`. It implements the operation directly: `size()` just returns its own byte count. Leaves do the *real* work.",
          "**Composite** — the container, e.g. `Folder`. It holds a list of children (each typed as `Component`, so files and folders mix freely) and implements the operation by *delegating*: call `size()` on every child and combine the answers.",
        ],
      },
      { type: "h", text: "How one call cascades down the tree" },
      {
        type: "p",
        text: "Say you call `size()` on the root folder `project`. The folder doesn't know (or care) what its children are — it just calls `size()` on each one. `readme.md` answers *2 KB* immediately. `src` is a folder, so the same thing happens one level down: it asks `app.ts` (*14 KB*) and `utils.ts` (*6 KB*), adds them to *20 KB*, and passes that up. Every level does one tiny job — ask children, add — and the recursion assembles the full answer:",
      },
      {
        type: "code",
        language: "typescript",
        code: `interface FileSystemItem {
  size(): number;                       // the one shared operation
}

class File implements FileSystemItem {
  constructor(private bytes: number) {}
  size(): number { return this.bytes; } // Leaf: answers directly
}

class Folder implements FileSystemItem {
  private children: FileSystemItem[] = [];

  add(item: FileSystemItem): void { this.children.push(item); }

  size(): number {                      // Composite: delegates + combines
    return this.children.reduce((sum, child) => sum + child.size(), 0);
  }
}`,
      },
      {
        type: "p",
        text: "Notice what's *missing*: `Folder.size()` has no `if (child is File)` check. A child is just a `FileSystemItem` that knows how to report its size. That's the uniformity the pattern buys you — add a new kind of node (a symlink, a zip archive) and `Folder` doesn't change at all.",
      },
      { type: "h", text: "Child management: where should add() live?" },
      {
        type: "p",
        text: "Composites need child-management methods — `add(item)`, `remove(item)`, maybe `getChildren()`. The classic design question is *where to declare them*, and there are two honest answers:",
      },
      {
        type: "ul",
        items: [
          "**Transparency** — declare `add()`/`remove()` on the `Component` interface itself. Now clients treat *everything* uniformly, even for child management. The cost: `File.add()` exists but makes no sense, so a leaf must throw or silently ignore it — a runtime surprise.",
          "**Safety** — declare `add()`/`remove()` only on `Composite` (as in the code above). Now it's *impossible* to add a child to a file — the compiler stops you. The cost: clients that want to build trees must know they're holding a `Folder`, so uniformity is slightly weaker.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Which to pick?",
        text: "The GoF book leans toward transparency; most modern codebases lean toward **safety**, because compile-time errors beat runtime surprises. Keep the *operations* (like `size()`) uniform on the Component — that's where uniformity pays off — and keep tree-building on the Composite.",
      },
      { type: "h", text: "This tree shape is everywhere" },
      {
        type: "p",
        text: "Once you see the file-system version, you'll recognise the same structure all over software:",
      },
      {
        type: "ul",
        items: [
          "**UI component trees** — a window holds panels, panels hold buttons and more panels; `render()` on the root renders everything.",
          "**Org charts** — a manager 'contains' employees and other managers; `headcount()` or `totalSalary()` rolls up the same way `size()` does.",
          "**Menus** — a menu holds items and submenus; `MenuItem` and `Menu` share one interface.",
          "**Arithmetic expressions** — `(2 + 3) * 4` is a tree where numbers are leaves and operators are composites; `evaluate()` cascades exactly like `size()`.",
        ],
      },
      {
        type: "p",
        text: "A close cousin worth contrasting: [[decorator]] also wraps objects behind a shared interface, but a Decorator has **exactly one** child and exists to *add behaviour* on the way through. A Composite has **many** children and exists to *aggregate* their answers. Same wrapping trick, different purpose.",
      },
    ],

    handsOn: [
      {
        title: "01 · Call size() on a leaf, then on a folder",
        body: "In the prototype, find 📄 readme.md and click the size() chip on its row — the row flashes and answers its own 2 KB. Nothing special. Now click the size() chip on 📁 src: the call ripples down, app.ts and utils.ts each light up and float their numbers back, and src shows the green total 20 KB. Same chip, same call — the only difference is what happens inside.",
      },
      {
        title: "02 · One call on the root sums the entire tree",
        body: "Click size() on 📁 project, the top row. Watch the cascade visit every file and folder underneath — each child returns its answer, nested folders sum their own children first, and the root shows the grand total in a green badge. You made exactly one call; recursion did all the walking.",
      },
      {
        title: "03 · Grow the tree, call again — zero new code",
        body: "Click the 📁 assets row to select it (a ring appears), then press ＋ File and ＋ Folder to drop new items inside it. Click size() on 📁 project again: the brand-new nodes just join the cascade and the total updates. The folder never needed to know what kinds of children it holds. Press ↺ Reset to start over.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "filesystem.ts",
        code: `// Component — the one interface both sides share
interface FileSystemItem {
  name: string;
  size(): number;
}

// Leaf — a plain file; answers size() directly
class File implements FileSystemItem {
  constructor(public name: string, private bytes: number) {}
  size(): number { return this.bytes; }
}

// Composite — a folder; holds children and delegates
class Folder implements FileSystemItem {
  private children: FileSystemItem[] = [];
  constructor(public name: string) {}

  add(item: FileSystemItem): this {   // "safety" style: add() lives here
    this.children.push(item);
    return this;
  }

  size(): number {                    // ask every child, add the answers
    return this.children.reduce((sum, c) => sum + c.size(), 0);
  }
}

// Build:  project/ ├─ readme.md  └─ src/ ├─ app.ts └─ utils.ts
const project = new Folder("project");
project.add(new File("readme.md", 2_000));
const src = new Folder("src");
src.add(new File("app.ts", 14_000)).add(new File("utils.ts", 6_000));
project.add(src);

// The client treats a file and a whole tree identically:
const anything: FileSystemItem = project;   // could just as well be a File
console.log(anything.size());               // 22000 — one call, whole tree`,
      },
      {
        label: "Java",
        language: "java",
        filename: "FileSystem.java",
        code: `import java.util.*;

// Component — the shared interface
interface FileSystemItem {
    String name();
    long size();
}

// Leaf — answers directly, no children
class File implements FileSystemItem {
    private final String name; private final long bytes;
    File(String name, long bytes) { this.name = name; this.bytes = bytes; }
    public String name() { return name; }
    public long size() { return bytes; }
}

// Composite — holds children typed as the interface, delegates to them
class Folder implements FileSystemItem {
    private final String name;
    private final List<FileSystemItem> children = new ArrayList<>();
    Folder(String name) { this.name = name; }

    Folder add(FileSystemItem item) { children.add(item); return this; }

    public String name() { return name; }
    public long size() {                       // recursion does the walking
        return children.stream().mapToLong(FileSystemItem::size).sum();
    }
}

class Demo {
    public static void main(String[] args) {
        Folder src = new Folder("src")
            .add(new File("app.ts", 14_000))
            .add(new File("utils.ts", 6_000));
        Folder project = new Folder("project").add(new File("readme.md", 2_000)).add(src);

        FileSystemItem item = project;          // client sees only the interface
        System.out.println(item.size());        // 22000 — file or tree, same call
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "filesystem.py",
        code: `from abc import ABC, abstractmethod


class FileSystemItem(ABC):          # Component — the shared interface
    @abstractmethod
    def size(self) -> int: ...


class File(FileSystemItem):          # Leaf — answers directly
    def __init__(self, name: str, bytes_: int):
        self.name = name
        self._bytes = bytes_

    def size(self) -> int:
        return self._bytes


class Folder(FileSystemItem):        # Composite — delegates to children
    def __init__(self, name: str):
        self.name = name
        self._children: list[FileSystemItem] = []

    def add(self, item: FileSystemItem) -> "Folder":
        self._children.append(item)
        return self

    def size(self) -> int:           # ask each child, sum the answers
        return sum(child.size() for child in self._children)


# project/ ├─ readme.md  └─ src/ ├─ app.ts └─ utils.ts
src = Folder("src").add(File("app.ts", 14_000)).add(File("utils.ts", 6_000))
project = Folder("project").add(File("readme.md", 2_000)).add(src)

item: FileSystemItem = project       # could be a File — client can't tell
print(item.size())                   # 22000 — one call walks the whole tree`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "filesystem.cpp",
        code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>

// Component — the shared interface
struct FileSystemItem {
    virtual ~FileSystemItem() = default;
    virtual long size() const = 0;
};

// Leaf — a file answers size() directly
class File : public FileSystemItem {
    std::string name; long bytes;
public:
    File(std::string n, long b) : name(std::move(n)), bytes(b) {}
    long size() const override { return bytes; }
};

// Composite — a folder owns children and delegates to them
class Folder : public FileSystemItem {
    std::string name;
    std::vector<std::unique_ptr<FileSystemItem>> children;
public:
    explicit Folder(std::string n) : name(std::move(n)) {}

    void add(std::unique_ptr<FileSystemItem> item) {
        children.push_back(std::move(item));
    }

    long size() const override {              // recursion sums the subtree
        long total = 0;
        for (const auto& child : children) total += child->size();
        return total;
    }
};

int main() {
    auto src = std::make_unique<Folder>("src");
    src->add(std::make_unique<File>("app.ts", 14000));
    src->add(std::make_unique<File>("utils.ts", 6000));

    Folder project("project");
    project.add(std::make_unique<File>("readme.md", 2000));
    project.add(std::move(src));

    const FileSystemItem& item = project;     // client sees the interface only
    std::cout << item.size() << "\\n";         // 22000 — one call, whole tree
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Use Composite when your problem is genuinely a tree" },
      {
        type: "p",
        text: "Two signals tell you this pattern fits. Both should be true:",
      },
      {
        type: "ul",
        items: [
          "**You have a part–whole hierarchy** — objects that contain other objects of the *same general kind*, nested to any depth: folders in folders, panels in panels, bundles in bundles, teams in teams.",
          "**Clients should ignore the difference** — the code *using* these objects wants to ask one question (`size()`, `render()`, `price()`, `headcount()`) without checking whether it's holding one item or a group. If you find yourself writing `if (item is Folder) ... else ...` all over, Composite removes exactly those branches.",
        ],
      },
      { type: "h", text: "When NOT to use it" },
      {
        type: "ul",
        items: [
          "**The structure is flat** — a plain list of files with no nesting needs a list, not a pattern. Composite only earns its keep when containers hold other containers.",
          "**Leaves and containers genuinely need different APIs** — if clients almost always need folder-only operations (permissions, watching, listing) and almost never treat files and folders alike, forcing one shared interface makes it *too general*: it fits neither side well.",
          "**The hierarchy is fixed and two levels deep** — a report with exactly 'sections containing rows' can be two plain classes. Reach for Composite when depth is open-ended.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Composite vs Decorator, in one line",
        text: "Both hide behind the component's interface and both delegate to what they wrap. A [[decorator]] wraps **one** child to *add behaviour*; a Composite wraps **many** children to *aggregate results*. If you're summing, rendering, or iterating over a group — that's Composite.",
      },
    ],

    tradeoffs: {
      pros: [
        "Clients get radically simpler — one call like `root.size()` handles a single file or a million-node tree, with no type checks and no hand-written tree-walking loops.",
        "Recursion comes for free — each Composite only knows about its direct children, yet operations naturally cascade through arbitrary depth.",
        "Open for extension — add a new node type (symlink, zip archive, smart folder) that implements the Component interface, and every existing Composite and client works with it unchanged.",
        "Trees are easy to build and reshape — because children are typed as the Component, you can freely move a subtree, nest deeper, or mix leaves and composites at any level.",
      ],
      cons: [
        "The Component interface can become over-general — to keep files and folders uniform you may declare methods that only make sense for one side, leaving leaves with awkward empty or throwing implementations.",
        "Hard to restrict what a composite may contain — the type system says 'any Component fits', so rules like 'a playlist may hold songs but not other playlists' need runtime checks instead of compiler help.",
        "Transparency vs safety is a real cost either way — put `add()` on the interface and leaves get nonsense methods; keep it on the Composite and clients must downcast to build trees.",
        "Debugging and performance need care — one innocent call at the root can fan out into thousands of recursive calls; without caching (e.g. memoised folder sizes) repeated queries on big trees get expensive.",
      ],
    },

    furtherReading: [
      {
        label: "Composite — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/composite",
        note: "The clearest illustrated walkthrough: the boxes-inside-boxes problem, structure diagrams, and pseudocode plus per-language examples. Best first read.",
        kind: "article",
      },
      {
        label: "Composite pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Composite_pattern",
        note: "Concise reference with UML for the pattern, the transparency-vs-safety discussion, and short implementations in several languages.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original Gang of Four book. Its Composite chapter defines the Component/Leaf/Composite roles and argues the transparency side of the add() debate.",
        kind: "book",
      },
      {
        label: "The Composite Pattern — Brandon Rhodes, Python Patterns",
        href: "https://python-patterns.guide/gang-of-four/composite/",
        note: "A thoughtful Python take: how duck typing changes the pattern, with the file-system hierarchy as the running example — a great second opinion after the classic treatment.",
        kind: "article",
      },
      {
        label: "Composite Design Pattern — SourceMaking",
        href: "https://sourcemaking.com/design_patterns/composite",
        note: "Compact summary with intent, checklist, and rules of thumb — handy for revision, including when to combine Composite with Iterator or Visitor.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "composite-q1",
        question: "What is the intent of the Composite pattern?",
        options: [
          { id: "a", label: "Compose objects into tree structures and let clients treat individual objects and compositions uniformly." },
          { id: "b", label: "Ensure a class has exactly one instance with a global access point." },
          { id: "c", label: "Convert one interface into another that clients expect." },
          { id: "d", label: "Separate an object's construction from its representation." },
        ],
        correctOptionId: "a",
        explanation:
          "That's the textbook intent: part–whole hierarchies as trees, with one shared Component interface so a client can't tell a Leaf from a whole subtree. Option (b) is Singleton, (c) is Adapter, and (d) is Builder.",
      },
      {
        id: "composite-q2",
        question: "In the file-system example, how does Folder.size() produce its answer?",
        options: [
          { id: "a", label: "It calls size() on each child and adds the results — nested folders recurse the same way." },
          { id: "b", label: "It keeps a hand-maintained total that must be updated on every file write." },
          { id: "c", label: "It walks the whole tree with a special loop that checks each node's concrete type." },
          { id: "d", label: "It asks the operating system, because folders can't compute sizes themselves." },
        ],
        correctOptionId: "a",
        explanation:
          "A Composite delegates: `children.reduce((sum, c) => sum + c.size(), 0)`. Files answer directly; sub-folders run the same method one level down. No type checks and no manual tree-walking loop — recursion assembles the total.",
      },
      {
        id: "composite-q3",
        question: "Which role does a File play, and what makes it different from a Folder?",
        options: [
          { id: "a", label: "File is a Leaf — it has no children and does the real work itself; Folder is a Composite that delegates to children." },
          { id: "b", label: "File is the Component — it defines the interface Folder must implement." },
          { id: "c", label: "File is a Composite — every file contains hidden child objects." },
          { id: "d", label: "There is no difference; both hold lists of children." },
        ],
        correctOptionId: "a",
        explanation:
          "Leaves are the end objects: no children, direct answers. Composites hold a list of children typed as the Component and implement operations by forwarding and combining. The Component is the shared *interface* (FileSystemItem), not the File class itself.",
      },
      {
        id: "composite-q4",
        question: "In the 'transparency vs safety' debate, what does the *safe* design choose?",
        options: [
          { id: "a", label: "Declare add()/remove() only on the Composite, so adding a child to a Leaf is a compile-time error." },
          { id: "b", label: "Declare add()/remove() on the Component interface, so leaves throw at runtime if called." },
          { id: "c", label: "Make every method private so no client can modify the tree." },
          { id: "d", label: "Let leaves silently convert themselves into composites when add() is called." },
        ],
        correctOptionId: "a",
        explanation:
          "Safety keeps child management on the Composite: the compiler prevents `file.add(...)` from existing at all. Transparency (option b) puts add() on the shared interface for maximal uniformity, but pays with nonsense methods on leaves that can only fail at runtime.",
      },
      {
        id: "composite-q5",
        question: "Both Composite and Decorator wrap objects behind a shared interface. What's the key difference?",
        options: [
          { id: "a", label: "A Decorator has exactly one child and adds behaviour; a Composite has many children and aggregates their results." },
          { id: "b", label: "A Composite can only be used with files and folders; Decorator works everywhere." },
          { id: "c", label: "A Decorator stores its children in a list; a Composite wraps exactly one object." },
          { id: "d", label: "There is no difference — the two names describe the same structure." },
        ],
        correctOptionId: "a",
        explanation:
          "Structurally they're cousins — both implement the component interface and delegate to what they wrap. The intent differs: Decorator wraps one object to layer extra behaviour on the way through; Composite holds many children and combines their answers (sum, render, iterate) into one.",
      },
    ],
  },
};
