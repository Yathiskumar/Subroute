import type { RoadmapLesson } from "@/lib/content/types";

export const iterator: RoadmapLesson = {
  title: "Iterator",
  oneLiner:
    "Give clients one standard way to walk through a collection — `next()` and `hasNext()` — without ever exposing how the collection stores its items. Two music apps can keep your playlist in an array or in a linked list of nodes; you press *next song* the same way on both, because each hands you an **iterator** that knows its own way around.",
  difficulty: "beginner",
  estimatedTime: "11 min",
  prototypePath: "/prototypes/lld/iterator.html",
  content: {
    prototypeCaption:
      "One playlist of **5 songs**, stored two completely different ways: the left card is an **ARRAY** (contiguous slots `[0..4]`), the right card is a **LINKED LIST** (scattered nodes chained by pointers). Each side exposes the exact same two things: a *▶ next()* button and a *hasNext?* chip. Press *▶ next()* and watch the cursor advance — the array hops to the next index while the list follows a pointer arrow, yet the same song title floats up from both. *▶ next() on both* drives the two collections with one identical client action. When a cursor runs out, its chip flips to ✗ and further presses just shake — `hasNext()` told you to stop. Hit *＋ 2nd cursor* to drop a second, independently-colored cursor on the array and prove that two iterations can walk the same collection at the same time without colliding. *↺ Reset* starts over.",

    overview: [
      {
        type: "p",
        text: "**Iterator** answers a question every program hits eventually: *how do I walk through the items in a collection without caring how the collection stores them?* Its intent in one sentence: **give a standard way to traverse a collection, one element at a time, without exposing its internal representation.** The client sees only two tiny operations — `hasNext()` (\"is there another one?\") and `next()` (\"give it to me and move forward\") — and the collection keeps its storage details private.",
      },
      {
        type: "p",
        text: "Picture your **music playlist** on two different apps. App one stores the songs in a plain *array*; app two stores them in a *linked list* of nodes, each pointing at the next. Internally they could not be more different — indexed slots versus pointer-chasing. But you, the listener, press **next song** the exact same way on both. That's because each app hands you an *iterator*: a small object that knows how to walk *its* structure and remembers where you are. The traversal knowledge lives in the iterator, not in you.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "An Iterator moves the *how do I walk this?* question out of the client and into a small object with `next()` / `hasNext()`. Swap the collection's storage from array to linked list to tree — the client's loop doesn't change a single character.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You already use this every day",
        text: "Every `for...of` in JavaScript, every `for x in ...` in Python, every enhanced `for` in Java is the Iterator pattern running under the hood. The loop syntax quietly asks the collection for an iterator and calls `next()` until it's exhausted.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three moving parts" },
      {
        type: "p",
        text: "The classic pattern has three participants, and each one has exactly one job:",
      },
      {
        type: "ul",
        items: [
          "**Iterator interface** — the tiny contract every traversal object promises: `next()` returns the current element and advances, `hasNext()` says whether anything is left. This is all the client ever sees.",
          "**Concrete Iterator** — one class per storage style, holding the *cursor* (current position). An array iterator keeps an index and does `i++`; a linked-list iterator keeps a node reference and does `node = node.next`. Same interface, totally different walk.",
          "**Iterable / Collection** — the playlist itself. It exposes a `createIterator()` method that builds a fresh iterator positioned at the start, and *never* leaks its internal array or head node. (Notice `createIterator()` is itself a small [[factory-method]].)",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `interface SongIterator {
  hasNext(): boolean;          // anything left?
  next(): string;              // return current song, move forward
}

class ArrayPlaylist {
  private songs: string[] = ["Neon Sky", "Midnight Run", "Paper Moon"];

  createIterator(): SongIterator {
    let i = 0;                              // the cursor lives HERE
    return {
      hasNext: () => i < this.songs.length,
      next: () => this.songs[i++],          // hop the index
    };
  }
}

// The client never sees the array — just the two methods:
const it = new ArrayPlaylist().createIterator();
while (it.hasNext()) console.log(it.next());`,
      },
      {
        type: "p",
        text: "The key detail: the **cursor lives in the iterator, not in the collection**. That's why you can call `createIterator()` twice and get two *independent* walks over the same playlist — each iterator remembers its own position. One part of your app can be halfway through the playlist while another part starts from the top, and neither disturbs the other. The prototype's *＋ 2nd cursor* button shows exactly this.",
      },
      { type: "h", text: "Different walks, same contract" },
      {
        type: "p",
        text: "Because the traversal logic is boxed inside the iterator, the *order* of iteration becomes a pluggable choice. The same playlist can hand out different iterators without changing the client loop at all:",
      },
      {
        type: "ul",
        items: [
          "**Forward** — the everyday case: first song to last.",
          "**Reverse** — same songs, walked back-to-front; the client loop is identical.",
          "**Filtered** — an iterator that skips as it goes, e.g. only songs over 3 minutes.",
          "**Tree in-order** — for hierarchical structures (think a [[composite]] of folders and playlists), the iterator can flatten a whole tree into a simple sequence, hiding the recursion from the client.",
        ],
      },
      { type: "h", text: "Modern languages bake this in" },
      {
        type: "p",
        text: "Iterator is so useful that **every mainstream language absorbed it into the language itself**: Java has the `Iterator` interface and `Iterable` (which powers the for-each loop), Python has `__iter__` / `__next__` with `StopIteration`, JavaScript has `Symbol.iterator` driving `for...of` and the spread operator, and C++ has `begin()` / `end()` powering range-for. So in day-to-day work you rarely hand-roll the GoF classes — instead you **implement your language's iterator protocol** on your own types, and instantly every built-in loop, spread, and library function knows how to walk them.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't mutate a collection mid-iteration",
        text: "The classic Iterator trap: adding or removing items from a collection *while an iterator is walking it*. The cursor's notion of \"position\" goes stale — you can skip elements, visit one twice, or crash. Java fails fast with a `ConcurrentModificationException`; Python and JavaScript may just silently misbehave. Rule of thumb: finish the walk first, collect the changes, apply them after — or use the iterator's own `remove()` if the language offers one.",
      },
    ],

    handsOn: [
      {
        title: "01 · Same button, different walk",
        body: "Press '▶ next()' under the ARRAY card a couple of times, then press '▶ next()' under the LINKED LIST card. Watch the cursors: the array's highlight hops from slot [0] to [1] to [2] in a straight line, while the list's highlight jumps between scattered nodes by following the pointer arrows. Both float up the same song title. The client action is identical — the traversal knowledge is inside each iterator.",
      },
      {
        title: "02 · One client action drives both",
        body: "Press '▶ next() on both' repeatedly until the songs run out. Both collections advance in lockstep from one identical call — this is the uniform interface at work. When a side is exhausted its 'hasNext?' chip flips from ✓ to ✗, and pressing its '▶ next()' again just shakes the card: hasNext() is the guard that tells you to stop before next() has nothing to give.",
      },
      {
        title: "03 · Two independent cursors",
        body: "Press '↺ Reset', then '＋ 2nd cursor'. A second, differently-colored cursor appears on the array at slot [0]. Advance cursor A three times with '▶ next()', then advance cursor B once with its own '▶ next() B' button. A sits at [3] while B sits at [1] — each iterator owns its position, so two simultaneous walks over one collection never collide.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "playlist.ts",
        code: `// A playlist stored as a LINKED LIST — but clients never see the nodes,
// because we implement JS/TS's native iterator protocol: Symbol.iterator.
class Node {
  constructor(public song: string, public next: Node | null = null) {}
}

class LinkedPlaylist implements Iterable<string> {
  private head: Node | null = null;
  private tail: Node | null = null;

  add(song: string): void {
    const node = new Node(song);
    if (this.tail) { this.tail.next = node; this.tail = node; }
    else { this.head = this.tail = node; }
  }

  // The iterator protocol: return an object with next() -> { value, done }.
  [Symbol.iterator](): Iterator<string> {
    let cursor = this.head;                   // cursor lives in the iterator
    return {
      next(): IteratorResult<string> {
        if (!cursor) return { value: undefined, done: true };  // "hasNext" = false
        const song = cursor.song;
        cursor = cursor.next;                 // follow the pointer
        return { value: song, done: false };
      },
    };
  }
}

const playlist = new LinkedPlaylist();
playlist.add("Neon Sky");
playlist.add("Midnight Run");
playlist.add("Paper Moon");

// The client walks it like any array — no idea it's a linked list:
for (const song of playlist) console.log("▶", song);

// Bonus: the protocol also unlocks spread and destructuring for free.
const [first] = playlist;      // "Neon Sky"
console.log([...playlist]);    // ["Neon Sky", "Midnight Run", "Paper Moon"]`,
      },
      {
        label: "Java",
        language: "java",
        filename: "LinkedPlaylist.java",
        code: `import java.util.Iterator;
import java.util.NoSuchElementException;

// A playlist stored as a LINKED LIST, made walkable by implementing
// Java's native protocol: Iterable<T> hands out an Iterator<T>.
public class LinkedPlaylist implements Iterable<String> {

    private static class Node {
        final String song; Node next;
        Node(String song) { this.song = song; }
    }

    private Node head, tail;

    public void add(String song) {
        Node node = new Node(song);
        if (tail != null) { tail.next = node; tail = node; }
        else { head = tail = node; }
    }

    @Override
    public Iterator<String> iterator() {        // createIterator()
        return new Iterator<>() {
            private Node cursor = head;          // cursor lives in the iterator

            @Override public boolean hasNext() { return cursor != null; }

            @Override public String next() {
                if (cursor == null) throw new NoSuchElementException();
                String song = cursor.song;
                cursor = cursor.next;            // follow the pointer
                return song;
            }
        };
    }

    public static void main(String[] args) {
        LinkedPlaylist playlist = new LinkedPlaylist();
        playlist.add("Neon Sky");
        playlist.add("Midnight Run");
        playlist.add("Paper Moon");

        // The enhanced for loop calls iterator()/hasNext()/next() for us:
        for (String song : playlist) System.out.println("▶ " + song);
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "playlist.py",
        code: `# A playlist stored as a LINKED LIST, made walkable via Python's
# native protocol: __iter__ returns an iterator, __next__ yields items
# and raises StopIteration when done (that's Python's "hasNext = False").

class _Node:
    def __init__(self, song):
        self.song = song
        self.next = None


class _PlaylistIterator:
    """Concrete iterator: owns the cursor, knows how to walk nodes."""

    def __init__(self, head):
        self._cursor = head                 # cursor lives in the iterator

    def __iter__(self):
        return self                          # an iterator iterates itself

    def __next__(self):
        if self._cursor is None:
            raise StopIteration              # signals "no more songs"
        song = self._cursor.song
        self._cursor = self._cursor.next     # follow the pointer
        return song


class LinkedPlaylist:
    def __init__(self):
        self._head = self._tail = None

    def add(self, song):
        node = _Node(song)
        if self._tail:
            self._tail.next = node
            self._tail = node
        else:
            self._head = self._tail = node

    def __iter__(self):                      # createIterator()
        return _PlaylistIterator(self._head)


playlist = LinkedPlaylist()
for s in ["Neon Sky", "Midnight Run", "Paper Moon"]:
    playlist.add(s)

# The for loop calls iter() and next() for us — storage stays hidden:
for song in playlist:
    print("▶", song)

print(list(playlist))   # ['Neon Sky', 'Midnight Run', 'Paper Moon']`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "playlist.cpp",
        code: `#include <iostream>
#include <string>

// A playlist stored as a LINKED LIST, made walkable via C++'s native
// protocol: begin()/end() returning an iterator with *, ++ and !=.
class LinkedPlaylist {
    struct Node { std::string song; Node* next = nullptr; };
    Node* head = nullptr;
    Node* tail = nullptr;

public:
    void add(const std::string& song) {
        Node* node = new Node{song};
        if (tail) { tail->next = node; tail = node; }
        else      { head = tail = node; }
    }

    // Minimal forward iterator: the cursor is just a node pointer.
    class Iterator {
        Node* cursor;                          // cursor lives in the iterator
    public:
        explicit Iterator(Node* start) : cursor(start) {}
        const std::string& operator*() const { return cursor->song; }
        Iterator& operator++() { cursor = cursor->next; return *this; }  // follow pointer
        bool operator!=(const Iterator& other) const {
            return cursor != other.cursor;     // "hasNext" = not at end
        }
    };

    Iterator begin() const { return Iterator(head); }     // createIterator()
    Iterator end()   const { return Iterator(nullptr); }  // one past the last
};

int main() {
    LinkedPlaylist playlist;
    playlist.add("Neon Sky");
    playlist.add("Midnight Run");
    playlist.add("Paper Moon");

    // Range-for expands to begin()/end()/!=/++/* — storage stays hidden:
    for (const std::string& song : playlist)
        std::cout << "▶ " << song << "\\n";
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for an Iterator when..." },
      {
        type: "ul",
        items: [
          "**You want to hide storage details** — clients should walk the playlist without knowing (or depending on) whether it's an array, linked list, hash map, or tree underneath. You stay free to swap the structure later.",
          "**You need uniform traversal across different structures** — one loop that works over anything walkable. Program to the iterator interface, not the concrete collection (see [[program-to-interfaces]]).",
          "**Several traversals must run at the same time** — each iterator carries its own cursor, so a UI can show 'now playing' at position 7 while a prefetcher scans ahead from position 8.",
          "**The sequence is lazy or streaming** — results from a database cursor, lines from a huge file, pages from an API. An iterator produces items one at a time, so you never need the whole collection in memory at once.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "When NOT to bother",
        text: "If you own a plain array, it's local to one function, and its representation will never change — just index it with a `for` loop. Wrapping `songs[i]` in a hand-rolled iterator class adds ceremony with zero payoff. The pattern earns its keep when storage details are worth hiding, not on every loop you write.",
      },
    ],

    tradeoffs: {
      pros: [
        "Decouples clients from storage — the collection can change from array to linked list to tree and every client loop keeps working unchanged.",
        "One traversal contract for everything — a single `hasNext()`/`next()` loop (or `for...of` / for-each) works across wildly different structures, including lazy and infinite sequences.",
        "Multiple simultaneous walks — each iterator owns its own cursor, so independent traversals over one collection never interfere with each other.",
        "Simplifies the collection itself — traversal logic (even complex tree walks) moves out into iterator objects, keeping the collection's own interface small (single responsibility).",
      ],
      cons: [
        "Overkill for simple cases — a plain indexed loop over an array you own is shorter and clearer than defining iterator machinery.",
        "Can be slower than direct access — going through `next()` calls adds indirection, and an iterator hides capabilities like 'jump straight to index 500' that the raw structure may offer.",
        "Stale-cursor hazards — mutating the collection mid-iteration invalidates cursors (Java's ConcurrentModificationException; undefined behaviour with invalidated iterators in C++).",
        "Extra classes to maintain when hand-rolled — each storage style needs its own concrete iterator; without language support the boilerplate adds up.",
      ],
    },

    furtherReading: [
      {
        label: "Iterator — Refactoring.Guru",
        href: "https://refactoring.guru/design-patterns/iterator",
        note: "The clearest illustrated walkthrough: intent, structure diagram, the Rome-tour-guide analogy, and implementations in many languages. Best first read.",
        kind: "article",
      },
      {
        label: "Iteration protocols — MDN Web Docs",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols",
        note: "How the pattern is baked into JavaScript: Symbol.iterator, the { value, done } contract, and everything for...of and spread do under the hood.",
        kind: "docs",
      },
      {
        label: "Iterator pattern — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Iterator_pattern",
        note: "Concise reference with the formal GoF structure plus a tour of how each mainstream language exposes iterators natively.",
        kind: "docs",
      },
      {
        label: "Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides",
        href: "https://en.wikipedia.org/wiki/Design_Patterns",
        note: "The original 'Gang of Four' book that catalogued Iterator among the 23 classic patterns — the primary source for its intent, participants, and consequences.",
        kind: "book",
      },
      {
        label: "Iterator (Java Platform SE 8) — Oracle API docs",
        href: "https://docs.oracle.com/javase/8/docs/api/java/util/Iterator.html",
        note: "The real-world interface millions of programs use daily: hasNext(), next(), the optional remove(), and the fail-fast ConcurrentModificationException contract.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "iterator-q1",
        question: "What is the core intent of the Iterator pattern?",
        options: [
          { id: "a", label: "Provide a standard way to walk through a collection's elements without exposing how the collection stores them." },
          { id: "b", label: "Make sure a collection can only ever hold one element." },
          { id: "c", label: "Sort a collection's elements before anyone reads them." },
          { id: "d", label: "Copy a collection so clients always work on a clone." },
        ],
        correctOptionId: "a",
        explanation:
          "Iterator is about traversal, not sorting, copying, or size limits: clients get a uniform hasNext()/next() interface, and the collection keeps its internal representation (array, linked list, tree...) completely private.",
      },
      {
        id: "iterator-q2",
        question: "In the playlist analogy, why can you press 'next song' the same way on an array-backed app and a linked-list-backed app?",
        options: [
          { id: "a", label: "Because both apps secretly convert their storage to an array first." },
          { id: "b", label: "Because each app hands you an iterator that knows how to walk its own structure, and both iterators share the same next()/hasNext() interface." },
          { id: "c", label: "Because linked lists and arrays are the same data structure." },
          { id: "d", label: "Because the client keeps its own copy of every song." },
        ],
        correctOptionId: "b",
        explanation:
          "The traversal knowledge lives inside each concrete iterator — one hops an index, the other follows node pointers — but both fulfil the same tiny contract, so the client's action is identical. No conversion or copying happens.",
      },
      {
        id: "iterator-q3",
        question: "Where does the cursor (current position) live, and why does that matter?",
        options: [
          { id: "a", label: "In the collection — so there can only ever be one traversal at a time." },
          { id: "b", label: "In the client — the client must track indexes itself." },
          { id: "c", label: "In the iterator — so multiple independent iterators can walk the same collection simultaneously without interfering." },
          { id: "d", label: "In a global variable shared by all collections." },
        ],
        correctOptionId: "c",
        explanation:
          "Each iterator object carries its own cursor. That's why createIterator() can be called many times and every caller gets an independent walk — one part of the app can be at song 7 while another starts at song 1, over the very same playlist.",
      },
      {
        id: "iterator-q4",
        question: "You remove songs from a playlist while an iterator is halfway through walking it. What is the likely result?",
        options: [
          { id: "a", label: "Nothing — iterators automatically adjust to any modification." },
          { id: "b", label: "The iterator restarts from the first song." },
          { id: "c", label: "The playlist is sorted again from scratch." },
          { id: "d", label: "The cursor goes stale: elements get skipped or repeated, and languages like Java fail fast with a ConcurrentModificationException." },
        ],
        correctOptionId: "d",
        explanation:
          "Mutating a collection mid-iteration is the classic Iterator trap. The cursor's idea of 'position' no longer matches reality, so behaviour breaks — Java throws ConcurrentModificationException on purpose to surface the bug early. Finish the walk first, then apply changes.",
      },
      {
        id: "iterator-q5",
        question: "How do modern languages relate to the classic GoF Iterator pattern?",
        options: [
          { id: "a", label: "They removed iteration entirely in favour of recursion." },
          { id: "b", label: "They bake the pattern into the language — Java's Iterable/Iterator, Python's __iter__/__next__, JS's Symbol.iterator, C++'s begin()/end() — so you implement the protocol rather than hand-roll the GoF classes." },
          { id: "c", label: "They forbid custom types from being iterable." },
          { id: "d", label: "Only functional languages support iteration." },
        ],
        correctOptionId: "b",
        explanation:
          "Iterator was so universally useful that it became language infrastructure. Implement your language's protocol on a custom type and every built-in loop (for...of, for-each, range-for), spread, and standard-library helper can walk it — the pattern's ideas live on, the boilerplate is gone.",
      },
    ],
  },
};
