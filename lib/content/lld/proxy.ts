import type { RoadmapLesson } from "@/lib/content/types";

export const proxy: RoadmapLesson = {
  title: "Proxy",
  oneLiner:
    "Put a stand-in object in front of the real one. The stand-in has the **same interface**, so the client can't tell the difference — but the stand-in decides *if* and *when* the real object is created or called. A photo gallery doesn't load every 5 MB image up front: an `ImageProxy` waits until you actually look at a photo, loads it once, and serves it from cache after that.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/proxy.html",
  content: {
    prototypeCaption:
      "A photo gallery with a proxy standing in front of the disk. In the **💤 Lazy + cache** tab, click a thumbnail: the client's `display()` call pulses to the *proxy*. The **first** time, the proxy has nothing cached, so the call continues to the disk — a loading bar runs and *loaded 5 MB* appears. Click the **same** photo again and the proxy answers instantly with a ⚡ *from cache* flash — the pulse never reaches the disk. Watch the two chips drift apart: **requests** climbs with every click, **disk loads** climbs only once per photo. That gap *is* the pattern. Flip to **🔒 Protection**: the real object is `deleteImage()`. As 🙂 Guest, the call dies at the proxy with a red ✗ — the real object is never touched. Switch to 🛡 Admin and the same call passes straight through. Same interface, different gatekeeping.",

    overview: [
      {
        type: "p",
        text: "**Proxy** is a stand-in. It's an object that has the **same interface** as the real object and sits *in front* of it, controlling access. The client calls the proxy exactly as it would call the real thing — and can't tell the difference. Behind the scenes, the proxy decides *whether*, *when*, and *how* to involve the real object: create it late, refuse the call, answer from a cache, or forward it across a network.",
      },
      {
        type: "p",
        text: "Picture a **photo gallery**. Each `RealImage` is a 5 MB file, and `RealImage.display()` reads it from disk — slow and expensive. If opening the gallery meant loading *every* photo, you'd wait forever for pictures you may never look at. So we put an `ImageProxy` in front of each one. It implements the same `Image` interface, but holds only the filename. Nothing is loaded until you actually call `display()` for the first time. Then the proxy loads the real image *once*, remembers it, and every later `display()` is instant. The gallery code never changes — it just talks to `Image`s.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A Proxy is a **stand-in object with the same interface** as the real one, which **controls access** to it — delaying its creation, guarding it, caching its answers, or reaching it over a network — while the client stays *unaware* anything is in between.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Same interface is the whole trick",
        text: "The proxy only works because it's a drop-in replacement. If `ImageProxy` needed different method names or extra setup, every client would have to know about it — and the illusion breaks. Because both implement `Image`, you can hand a client a proxy *or* the real thing and it behaves identically. This is [[program-to-interfaces]] doing real work.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three participants" },
      {
        type: "p",
        text: "Every proxy setup has the same small cast. The client only ever sees the first one:",
      },
      {
        type: "ul",
        items: [
          "**Subject (interface)** — the common contract, e.g. `Image` with a `display()` method. Client code depends only on this.",
          "**RealSubject** — the heavyweight or sensitive object doing the actual work, e.g. `RealImage`, which loads 5 MB from disk in its constructor.",
          "**Proxy** — implements the same Subject interface and *holds a reference* to the RealSubject (often `null` at first). Every call arrives here, and the proxy decides **if** and **when** to create or invoke the real object.",
        ],
      },
      {
        type: "p",
        text: "That decision — *if* and *when* — is the pattern's power. The proxy can delay creating the real object until the first call actually needs it (lazy). It can refuse the call outright (denied). It can answer from memory without forwarding at all (cached). Or it can serialize the call and send it to another machine (remote). Same shape, four superpowers.",
      },
      { type: "h", text: "The four classic kinds" },
      {
        type: "ul",
        items: [
          "**Virtual proxy** — delays creating an *expensive* object until it's first needed. Our `ImageProxy` is one: no disk read until the first `display()`.",
          "**Protection proxy** — checks *who is calling* before letting the call through. Guests can't reach `deleteImage()`; admins can.",
          "**Remote proxy** — a local stand-in for an object living *on another machine*; it hides the network plumbing (this is exactly what RPC/gRPC stubs are).",
          "**Caching / smart proxy** — memoizes results so repeat calls skip the real object, or adds housekeeping like reference counting and logging around each call.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `interface Image {                       // Subject — the shared contract
  display(): void;
}

class RealImage implements Image {      // RealSubject — expensive!
  constructor(private filename: string) {
    console.log(\`loading 5 MB \${filename} from disk…\`);  // slow
  }
  display() { console.log(\`showing \${this.filename}\`); }
}

class ImageProxy implements Image {     // Proxy — same interface
  private real: RealImage | null = null;   // nothing loaded yet

  constructor(private filename: string) {} // cheap: just a string

  display() {
    if (!this.real) {                      // first call only:
      this.real = new RealImage(this.filename);  // load once (virtual)
    }
    this.real.display();                   // cached ever after
  }
}

const photo: Image = new ImageProxy("beach.png"); // instant — no disk
photo.display();   // loads 5 MB, then shows       (first call)
photo.display();   // shows instantly — from cache  (every later call)`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Proxy vs Decorator — same shape, different intent",
        text: "A [[decorator]] also wraps an object behind the same interface, so the two look identical in a class diagram. The difference is *why*. A **Decorator ADDS behavior** the client asked for — scrollbars, compression, borders — and clients often stack decorators on purpose. A **Proxy CONTROLS ACCESS** — it can create the object late, deny the call, or answer from cache — and the client usually doesn't know (or care) it's there. Decorator changes *what you get*; Proxy changes *whether and how you reach it*.",
      },
      { type: "h", text: "You already use proxies every day" },
      {
        type: "ul",
        items: [
          "**ORM lazy relations** — Hibernate hands you a proxy for `order.getCustomer()`; the actual database query fires only when you first touch a field.",
          "**JavaScript's built-in `Proxy`** — wraps any object and intercepts every property read/write, powering things like Vue's reactivity.",
          "**API gateways** — clients call one endpoint that authenticates, rate-limits, and logs *before* forwarding to real backend services.",
          "**CDN edge caches** — a CDN node is a caching proxy for the origin server: repeat requests are answered at the edge and never travel to the origin.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Pay the disk cost exactly once",
        body: "Open the prototype on the 💤 Lazy + cache tab and click 🖼 photo-1. Watch the pulse travel client → proxy → disk, the loading bar run, and *loaded 5 MB* appear — both chips read 1. Now click 🖼 photo-1 again: a ⚡ *from cache* flash on the proxy, the image appears instantly, and the pulse never reaches the disk. Requests is 2, disk loads is still 1.",
      },
      {
        title: "02 · Widen the gap",
        body: "Click 🖼 photo-2 (one more disk load), then keep re-clicking photos you've already opened. The *requests* chip climbs on every click; *disk loads* stays frozen at the number of distinct photos you've opened. That widening gap is the virtual proxy + cache saving real work. Press ↺ Reset and the proxy forgets everything — the next click hits the disk again.",
      },
      {
        title: "03 · Get denied, then let through",
        body: "Switch to the 🔒 Protection tab. With 🙂 Guest selected, press ▶ Delete photo: the pulse stops *at the proxy* with a red ✗ denied — the real `deleteImage()` card is never touched and *real object calls* stays 0. Now pick 🛡 Admin and press ▶ Delete photo again: the call passes through, the photo greys out, and the counter ticks to 1. Same button, same interface — the proxy alone decided who gets through.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "image-proxy.ts",
        code: `interface Image {                        // Subject: the shared contract
  display(): void;
}

class RealImage implements Image {       // RealSubject: expensive to build
  constructor(private filename: string) {
    // pretend this reads 5 MB from disk — slow!
    console.log("loading " + this.filename + " (5 MB) from disk…");
  }
  display(): void {
    console.log("showing " + this.filename);
  }
}

class ImageProxy implements Image {      // Proxy: same interface, cheap
  private real: RealImage | null = null; // no image loaded yet

  constructor(private filename: string) {}

  display(): void {
    if (this.real === null) {            // virtual proxy: create lazily,
      this.real = new RealImage(this.filename);  // on the FIRST display()
    }
    this.real.display();                 // cache: reuse ever after
  }
}

// The gallery only knows the Image interface — proxy is invisible.
const gallery: Image[] = [
  new ImageProxy("beach.png"),           // instant — nothing loaded
  new ImageProxy("city.png"),
];

gallery[0].display();  // loads 5 MB, then shows   (first call pays)
gallery[0].display();  // shows instantly           (cache — no disk)
// city.png was never displayed → never loaded at all.`,
      },
      {
        label: "Java",
        language: "java",
        filename: "ImageProxy.java",
        code: `interface Image {                          // Subject
    void display();
}

class RealImage implements Image {         // RealSubject: expensive
    private final String filename;

    RealImage(String filename) {
        this.filename = filename;
        // pretend this reads 5 MB from disk — slow!
        System.out.println("loading " + filename + " (5 MB) from disk…");
    }

    public void display() {
        System.out.println("showing " + filename);
    }
}

class ImageProxy implements Image {        // Proxy: same interface
    private final String filename;
    private RealImage real;                // null until first use

    ImageProxy(String filename) { this.filename = filename; }

    public void display() {
        if (real == null) {                // lazy: build on first call
            real = new RealImage(filename);
        }
        real.display();                    // cached ever after
    }
}

// Image photo = new ImageProxy("beach.png");  // instant — no disk read
// photo.display();   // loads 5 MB, then shows (first call)
// photo.display();   // shows instantly — proxy reuses the loaded image
// This is exactly how Hibernate lazy-loads related entities.`,
      },
      {
        label: "Python",
        language: "python",
        filename: "image_proxy.py",
        code: `from abc import ABC, abstractmethod


class Image(ABC):                        # Subject: the shared contract
    @abstractmethod
    def display(self) -> None: ...


class RealImage(Image):                  # RealSubject: expensive
    def __init__(self, filename: str):
        self.filename = filename
        # pretend this reads 5 MB from disk — slow!
        print(f"loading {filename} (5 MB) from disk…")

    def display(self) -> None:
        print(f"showing {self.filename}")


class ImageProxy(Image):                 # Proxy: same interface, cheap
    def __init__(self, filename: str):
        self.filename = filename
        self._real: RealImage | None = None   # nothing loaded yet

    def display(self) -> None:
        if self._real is None:           # virtual proxy: first call
            self._real = RealImage(self.filename)  # load once
        self._real.display()             # cache: reuse ever after


gallery: list[Image] = [ImageProxy("beach.png"), ImageProxy("city.png")]

gallery[0].display()   # loads 5 MB, then shows   (first call pays)
gallery[0].display()   # shows instantly           (cache — no disk)
# city.png was never displayed -> never loaded at all.`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "image_proxy.cpp",
        code: `#include <iostream>
#include <memory>
#include <string>

class Image {                            // Subject: the shared contract
public:
    virtual ~Image() = default;
    virtual void display() = 0;
};

class RealImage : public Image {         // RealSubject: expensive
    std::string filename;
public:
    explicit RealImage(std::string f) : filename(std::move(f)) {
        // pretend this reads 5 MB from disk — slow!
        std::cout << "loading " << filename << " (5 MB) from disk…\\n";
    }
    void display() override { std::cout << "showing " << filename << "\\n"; }
};

class ImageProxy : public Image {        // Proxy: same interface, cheap
    std::string filename;
    std::unique_ptr<RealImage> real;     // null until first use
public:
    explicit ImageProxy(std::string f) : filename(std::move(f)) {}

    void display() override {
        if (!real) {                     // virtual proxy: first call only
            real = std::make_unique<RealImage>(filename);
        }
        real->display();                 // cached ever after
    }
};

int main() {
    std::unique_ptr<Image> photo = std::make_unique<ImageProxy>("beach.png");
    photo->display();   // loads 5 MB, then shows   (first call pays)
    photo->display();   // shows instantly           (cache — no disk)
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a Proxy when you need a gatekeeper" },
      {
        type: "p",
        text: "The pattern earns its keep whenever *something* should happen between the client and the real object — without either of them knowing:",
      },
      {
        type: "ul",
        items: [
          "**Lazy-init a heavy object** — images, database connections, big reports. Pay the construction cost only when (and if) it's actually used.",
          "**Access control** — the real object shouldn't check roles itself; a protection proxy screens callers before the call ever arrives.",
          "**Talk to a remote object** — hide serialization and networking behind a local stand-in with the same interface (RPC stubs, service clients).",
          "**Cache or log without touching the real class** — memoize expensive answers, count references, or record every call, all from the wrapper. The real class stays clean (see [[single-responsibility]]).",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When NOT to use it",
        text: "A proxy is one more layer of indirection: one more class, one more hop, one more place a bug can hide. If the real object is **cheap to create and safe for anyone to call**, a proxy adds ceremony and nothing else — just use the object. Add the stand-in when there's a real cost or a real gate, not by default.",
      },
    ],

    tradeoffs: {
      pros: [
        "Clients don't change — the proxy shares the Subject interface, so it drops in wherever the real object was expected.",
        "Expensive work is deferred (and maybe avoided entirely) — the real object is created only when first needed.",
        "Cross-cutting concerns stay out of the real class — access checks, caching, logging, and network plumbing live in the proxy, keeping RealSubject focused.",
        "The proxy manages the real object's lifecycle — it can create it late, reuse it, or release it, without the client ever knowing.",
      ],
      cons: [
        "One more layer of indirection — an extra class to write and an extra hop to reason about when debugging.",
        "The first call through a virtual proxy can pause noticeably — the deferred cost doesn't vanish, it just moves to the worst possible moment if you're unlucky.",
        "Cached answers can go stale — a caching proxy that never invalidates serves yesterday's data with full confidence.",
        "Hidden behavior can surprise — because the client can't see the proxy, a denied call or a lazy load looks like the real object misbehaving.",
      ],
    },

    furtherReading: [
      {
        label: "Proxy — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/proxy",
        note: "The clearest illustrated walkthrough: structure, the credit-card-as-proxy-for-cash analogy, all four kinds, and code in many languages. Best first read.",
        kind: "article",
      },
      {
        label: "Proxy pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Proxy_pattern",
        note: "Concise reference covering virtual, protection, and remote proxies with short examples across languages.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Proxy. The primary source for its intent, structure, and the virtual/protection/remote taxonomy.",
        kind: "book",
      },
      {
        label: "Proxy — MDN JavaScript reference",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy",
        note: "JavaScript ships the pattern as a language feature: wrap any object and intercept every get/set. Great for seeing proxying with zero boilerplate.",
        kind: "docs",
      },
      {
        label: "Hibernate proxies and lazy loading — Baeldung",
        href: "https://www.baeldung.com/hibernate-proxy-load-method",
        note: "How a production ORM hands you proxy objects for related entities and defers the database query until you actually touch a field — a virtual proxy in the wild.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "proxy-q1",
        question: "What is the core idea of the Proxy pattern?",
        options: [
          { id: "a", label: "A stand-in object with the same interface as the real one controls access to it — the client can't tell the difference." },
          { id: "b", label: "A class is guaranteed to have exactly one instance." },
          { id: "c", label: "Incompatible interfaces are converted so two classes can work together." },
          { id: "d", label: "An object's behavior is copied by cloning an existing instance." },
        ],
        correctOptionId: "a",
        explanation:
          "A Proxy implements the same Subject interface as the RealSubject and sits in front of it, deciding if and when calls reach the real object. (b) is Singleton, (c) is Adapter, (d) is Prototype.",
      },
      {
        id: "proxy-q2",
        question: "In the photo gallery, when does a *virtual* proxy load the 5 MB RealImage from disk?",
        options: [
          { id: "a", label: "The moment the ImageProxy object is constructed." },
          { id: "b", label: "On the first call to display() — and it reuses that loaded image for every later call." },
          { id: "c", label: "On every single call to display()." },
          { id: "d", label: "Never — the proxy draws the image itself." },
        ],
        correctOptionId: "b",
        explanation:
          "A virtual proxy is lazy: constructing it costs almost nothing (it holds just the filename). The expensive RealImage is created on the first display(), stored in the proxy's reference, and reused after that — which is why 'requests' can climb while 'disk loads' stays put.",
      },
      {
        id: "proxy-q3",
        question: "Proxy and Decorator have the same class-diagram shape. What actually separates them?",
        options: [
          { id: "a", label: "Nothing — they are two names for the same pattern." },
          { id: "b", label: "Decorator ADDS behavior for the client's benefit (often stacked deliberately); Proxy CONTROLS ACCESS, and the client is usually unaware of it." },
          { id: "c", label: "Proxy can only be used over a network; Decorator only locally." },
          { id: "d", label: "Decorator requires inheritance; Proxy forbids interfaces." },
        ],
        correctOptionId: "b",
        explanation:
          "Both wrap an object behind the same interface — the difference is intent. Decorators add features the client wants (borders, compression) and are often composed openly. A Proxy manages access — lazy creation, permission checks, caching, remoting — and clients typically never know it's there.",
      },
      {
        id: "proxy-q4",
        question: "A guest calls deleteImage() through a protection proxy and is denied. What happened to the real object?",
        options: [
          { id: "a", label: "It ran deleteImage() but rolled the change back." },
          { id: "b", label: "It received the call and threw an exception." },
          { id: "c", label: "Nothing — the call stopped at the proxy, so the real object was never touched." },
          { id: "d", label: "It was destroyed and recreated." },
        ],
        correctOptionId: "c",
        explanation:
          "That is the point of a protection proxy: the permission check happens *before* forwarding. A denied call never reaches the RealSubject at all — which is safer than letting the real object receive calls and defend itself.",
      },
      {
        id: "proxy-q5",
        question: "Which of these is a *remote* proxy?",
        options: [
          { id: "a", label: "An object that checks the caller's role before forwarding." },
          { id: "b", label: "An object that delays loading a big file until first use." },
          { id: "c", label: "An object that memoizes answers so repeats skip the real work." },
          { id: "d", label: "A local stub with the service's interface that hides the network and forwards calls to an object on another machine — like a gRPC client stub." },
        ],
        correctOptionId: "d",
        explanation:
          "A remote proxy is a local stand-in for something living elsewhere: it serializes the call, ships it over the network, and returns the result — while the client just sees a normal method call. (a) is a protection proxy, (b) a virtual proxy, (c) a caching proxy.",
      },
    ],
  },
};
