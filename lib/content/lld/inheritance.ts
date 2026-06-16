import type { RoadmapLesson } from "@/lib/content/types";

export const inheritance: RoadmapLesson = {
  title: "Inheritance",
  oneLiner:
    "A subclass reuses and extends a parent class through an \"is-a\" relationship — inheriting fields and methods, and overriding only what it needs to change.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/inheritance.html",
  content: {
    prototypeCaption:
      "At the top sits the base class `Animal` with its members. Below it, `Dog`, `Cat`, and `Bird` branch off — each one *inherits* everything from `Animal`, *adds* its own method, and *overrides* `makeSound()`. Click a subclass, then call its methods and watch the console say exactly **where each method came from**.",

    overview: [
      {
        type: "p",
        text: "Inheritance lets one class build on another. You write a general **parent** class once, then create **child** classes that automatically get all of its fields and methods — and add or change only what's different. Less copy-paste, one place to fix bugs.",
      },
      {
        type: "p",
        text: "Think of animals. Every animal has a `name`, can `eat()`, and can `sleep()`. A **dog** *is an* animal, so it gets all of that for free — but it also barks instead of making a generic noise, and it can `fetch()`. A **cat** *is an* animal too: same shared behavior, but it meows and can `scratch()`. You describe the shared parts once in `Animal`, then let each species specialize.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A subclass **inherits** what the parent already does, **adds** new behavior of its own, and **overrides** the few methods it wants to do differently. Reuse plus specialization, in one relationship.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Base class vs. derived class" },
      {
        type: "p",
        text: "The **base class** (also called the *parent* or *superclass*) holds the shared, general behavior — here, `Animal`. A **derived class** (the *child* or *subclass*) extends it — `Dog`, `Cat`, `Bird`. The derived class starts with everything the base has, then layers its own changes on top.",
      },
      {
        type: "p",
        text: "In most languages you spell this with the `extends` keyword. `class Dog extends Animal` reads almost like English: a `Dog` *extends* what an `Animal` already is.",
      },
      { type: "h", text: "Inheriting fields and methods" },
      {
        type: "p",
        text: "Because `Dog extends Animal`, every `Dog` automatically has a `name` field and can `eat()` and `sleep()` — you didn't rewrite any of that. Call `myDog.eat()` and it runs the exact code defined up in `Animal`. That's *inheritance*: the child reuses the parent's members as if they were its own.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "animal.ts",
        code: `class Animal {
  constructor(public name: string) {}

  eat() {
    return this.name + " is eating";
  }

  makeSound() {
    return "(some generic animal noise)";
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);          // run Animal's constructor first
  }

  // OWN method — only dogs have this
  fetch() {
    return this.name + " fetches the ball";
  }

  // OVERRIDE — replaces Animal's makeSound for dogs
  makeSound() {
    return "Woof!";
  }
}

const d = new Dog("Rex");
d.eat();        // inherited from Animal → "Rex is eating"
d.makeSound();  // overridden by Dog     → "Woof!"
d.fetch();      // Dog's own method      → "Rex fetches the ball"`,
      },
      { type: "h", text: "Calling the parent with `super`" },
      {
        type: "p",
        text: "When a subclass has its own constructor, it must first set up the part of the object that the parent owns. `super(name)` calls the parent's constructor so the inherited `name` field gets initialized before the child adds anything. You can also use `super.someMethod()` inside an override to *reuse* the parent's version and add to it, rather than replacing it entirely.",
      },
      { type: "h", text: "Overriding vs. inheriting" },
      {
        type: "p",
        text: "If a subclass defines a method with the *same name* as one in the parent, the subclass's version **overrides** it. After that, calling the method on a `Dog` runs the `Dog` version — `\"Woof!\"` — not the generic `Animal` one. Methods the subclass *doesn't* redefine are simply inherited and run the parent's code unchanged. So a `Dog` inherits `eat()` and `sleep()` but overrides `makeSound()`.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The \"is-a\" test",
        text: "Inheritance models an **is-a** relationship. Before writing `B extends A`, say it out loud: \"a `Dog` *is an* `Animal`\" — true, so inheritance fits. \"a `Car` *is an* `Engine`\"? No — a car *has an* engine. That's a different relationship, and inheritance would be the wrong tool there.",
      },
      { type: "h", text: "Single vs. multiple inheritance" },
      {
        type: "p",
        text: "Some languages let a class inherit from only **one** parent — Java and C# are *single-inheritance* (you then mix in extra capabilities through `interface`s). Others, like C++ and Python, allow **multiple inheritance**, where a class can extend several parents at once. Multiple inheritance is powerful but can get confusing when two parents define the same method, so single inheritance plus interfaces is the more common default.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Prefer composition when it isn't truly \"is-a\"",
        text: "Inheritance is tempting as a shortcut for code reuse, but reach for it *only* when the is-a test genuinely holds. If a type merely *needs* some behavior — but isn't really a kind of the parent — prefer **composition**: hold the other object as a field and delegate to it. We'll dig into *composition over inheritance* in a later lesson; for now, just remember that not every \"I want to reuse this\" is an inheritance.",
      },
    ],

    handsOn: [
      {
        title: "01 · Pick a subclass and read its members",
        body: "Click **Dog**, then **Cat**, then **Bird** in the family tree. Watch the instance card relabel every member: things tagged **inherited** came straight from `Animal`, **own** is the method that subclass added (like `fetch()`), and **overridden** is `makeSound()`, which each species redefines.",
      },
      {
        title: "02 · Call an inherited method",
        body: "With any subclass selected, press **eat()** or **sleep()**. The console narrates `→ inherited from Animal` and the highlight in the tree jumps up to `Animal`, proving the code that runs lives in the parent — the subclass didn't rewrite it.",
      },
      {
        title: "03 · See an override resolve",
        body: "Press **makeSound()** and notice the console says `Dog overrides → \"Woof!\"` — the highlight stays on the subclass, not `Animal`. Then press the subclass-only button (`fetch()` for Dog, `scratch()` for Cat, `fly()` for Bird); it's available *only* while that subclass is selected, because it's its own method.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "animals.ts",
        code: `class Animal {
  constructor(public name: string) {}

  eat() {
    return this.name + " is eating";
  }

  makeSound() {
    return "(generic animal noise)";
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name); // initialize the inherited 'name' field
  }

  // own method — added by Dog
  fetch() {
    return this.name + " fetches the ball";
  }

  // override — Dog's own version of makeSound
  makeSound() {
    return "Woof!";
  }
}

const rex = new Dog("Rex");
rex.eat();        // inherited → "Rex is eating"
rex.makeSound();  // overridden → "Woof!"
rex.fetch();      // own        → "Rex fetches the ball"`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Animals.java",
        code: `class Animal {
    protected String name;

    Animal(String name) {
        this.name = name;
    }

    String eat() {
        return name + " is eating";
    }

    String makeSound() {
        return "(generic animal noise)";
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name); // initialize the inherited 'name' field
    }

    // own method — added by Dog
    String fetch() {
        return name + " fetches the ball";
    }

    // override — Dog's own version of makeSound
    @Override
    String makeSound() {
        return "Woof!";
    }
}

Dog rex = new Dog("Rex");
rex.eat();        // inherited → "Rex is eating"
rex.makeSound();  // overridden → "Woof!"
rex.fetch();      // own        → "Rex fetches the ball"`,
      },
      {
        label: "Python",
        language: "python",
        filename: "animals.py",
        code: `class Animal:
    def __init__(self, name: str):
        self.name = name

    def eat(self) -> str:
        return f"{self.name} is eating"

    def make_sound(self) -> str:
        return "(generic animal noise)"


class Dog(Animal):
    def __init__(self, name: str):
        super().__init__(name)  # initialize the inherited 'name' field

    # own method — added by Dog
    def fetch(self) -> str:
        return f"{self.name} fetches the ball"

    # override — Dog's own version of make_sound
    def make_sound(self) -> str:
        return "Woof!"


rex = Dog("Rex")
rex.eat()         # inherited  -> "Rex is eating"
rex.make_sound()  # overridden -> "Woof!"
rex.fetch()       # own        -> "Rex fetches the ball"`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "animals.cpp",
        code: `#include <string>

class Animal {
protected:
    std::string name;

public:
    Animal(std::string name) : name(std::move(name)) {}

    std::string eat() const {
        return name + " is eating";
    }

    // virtual so a derived class can override it
    virtual std::string makeSound() const {
        return "(generic animal noise)";
    }
};

class Dog : public Animal {
public:
    Dog(std::string name) : Animal(std::move(name)) {} // init inherited 'name'

    // own method — added by Dog
    std::string fetch() const {
        return name + " fetches the ball";
    }

    // override — Dog's own version of makeSound
    std::string makeSound() const override {
        return "Woof!";
    }
};

Dog rex("Rex");
rex.eat();        // inherited  -> "Rex is eating"
rex.makeSound();  // overridden -> "Woof!"
rex.fetch();      // own        -> "Rex fetches the ball"`,
      },
    ],

    whenToUse: [
      { type: "h", text: "When inheritance is the right tool" },
      {
        type: "ul",
        items: [
          "When the relationship is a genuine **is-a** — a `Dog` *is an* `Animal`, a `SavingsAccount` *is a* `BankAccount`. Say it aloud; if it sounds wrong, it probably is.",
          "When several types share real, **common behavior** that you want to define once in a parent and reuse everywhere.",
          "When you want **polymorphism** — treating different subclasses uniformly through the parent type (loop over a list of `Animal` and call `makeSound()` on each).",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When to prefer composition instead",
        text: "If you're inheriting *just* to grab some handy code — but the child isn't truly a kind of the parent — stop. Use **composition**: hold the helper as a field and call it. Composition is more flexible, avoids fragile hierarchies, and doesn't lie about the relationship. Inheritance is for *is-a*; composition is for *has-a*.",
      },
    ],

    tradeoffs: {
      pros: [
        "Reuse — write shared fields and methods once in the parent, and every subclass gets them for free.",
        "Enables polymorphism — code can work against the base type and let each subclass supply its own behavior.",
        "Models real hierarchies cleanly when an honest is-a relationship exists.",
        "Centralizes change — fix or extend the parent and every subclass benefits at once.",
      ],
      cons: [
        "Deep, sprawling hierarchies become fragile — a small change in a base class can ripple into every descendant.",
        "Inheriting purely for code reuse (when it isn't really is-a) couples unrelated types and invites composition's job onto the wrong tool.",
        "A careless override can break the parent's contract (the Liskov Substitution Principle), so subclasses no longer behave as the base promised.",
        "Subclasses are tightly coupled to their parent's internals, making the base class hard to change without breaking children.",
      ],
    },

    furtherReading: [
      {
        label: "Oracle — Inheritance (Java Tutorial)",
        href: "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html",
        note: "The canonical walkthrough of subclasses, extends, and super from the official Java tutorial.",
        kind: "docs",
      },
      {
        label: "MDN — extends",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends",
        note: "Reference for the `extends` keyword in JavaScript, with super and override examples.",
        kind: "docs",
      },
      {
        label: "Python docs — Inheritance",
        href: "https://docs.python.org/3/tutorial/classes.html#inheritance",
        note: "How inheritance, super().__init__, and multiple inheritance work in Python.",
        kind: "docs",
      },
      {
        label: "Wikipedia — Inheritance (object-oriented programming)",
        href: "https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)",
        note: "A broad, language-agnostic survey of inheritance and where it fits in OOP.",
        kind: "article",
      },
      {
        label: "Wikipedia — Composition over inheritance",
        href: "https://en.wikipedia.org/wiki/Composition_over_inheritance",
        note: "The classic counterpoint — when to favor has-a composition over is-a inheritance.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "in-q1",
        question: "What does it mean for `Dog` to extend `Animal`?",
        options: [
          { id: "a", label: "Dog makes a private copy of Animal's source code." },
          { id: "b", label: "Dog inherits Animal's fields and methods, and can add to or override them." },
          { id: "c", label: "Animal inherits everything Dog defines." },
          { id: "d", label: "Dog and Animal become the exact same class." },
        ],
        correctOptionId: "b",
        explanation:
          "`extends` makes Dog a subclass of Animal: a Dog automatically has Animal's members and may add new ones (like fetch()) or override existing ones (like makeSound()).",
      },
      {
        id: "in-q2",
        question:
          "Inside `Dog`'s constructor you write `super(name)`. What is it for?",
        options: [
          { id: "a", label: "It deletes the Animal class." },
          { id: "b", label: "It creates a second, separate Animal object." },
          { id: "c", label: "It calls the parent (Animal) constructor to initialize the inherited part of the object." },
          { id: "d", label: "It renames Dog to Animal." },
        ],
        correctOptionId: "c",
        explanation:
          "`super(...)` runs the parent's constructor first, so inherited fields like `name` are set up before the subclass adds its own initialization.",
      },
      {
        id: "in-q3",
        question:
          "`Dog` defines its own `makeSound()` returning \"Woof!\", but does not redefine `eat()`. What runs for each call on a Dog?",
        options: [
          { id: "a", label: "Both run Animal's versions." },
          { id: "b", label: "Both run Dog's versions." },
          { id: "c", label: "`makeSound()` runs Dog's override; `eat()` runs Animal's inherited version." },
          { id: "d", label: "Neither runs — it throws an error." },
        ],
        correctOptionId: "c",
        explanation:
          "A subclass method with the same name overrides the parent's, so makeSound() runs Dog's version. Methods the subclass doesn't redefine, like eat(), are simply inherited from Animal.",
      },
      {
        id: "in-q4",
        question:
          "You want a `Car` to reuse some logic from an `Engine` class. Should `Car extends Engine`?",
        options: [
          { id: "a", label: "Yes — extending is the easiest way to reuse code." },
          { id: "b", label: "No — a Car has-an Engine, not is-an Engine; prefer composition." },
          { id: "c", label: "Yes — every class with shared code should use inheritance." },
          { id: "d", label: "It doesn't matter; the two are equivalent." },
        ],
        correctOptionId: "b",
        explanation:
          "Inheritance models is-a, and a Car is not a kind of Engine — it has one. Reusing code through inheritance here would be misleading and rigid; composition (Car holds an Engine field) is the right tool.",
      },
    ],
  },
};
